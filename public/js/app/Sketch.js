define(['underscore', 'app/Canvas', 'app/ImageLoader', 'app/EntityImage',
        'app/Tile', 'app/TilesetImage'],
function (_, Canvas, ImageLoader, EntityImage,
          Tile, TilesetImage) {
  
  'use strict';
  
  var Sketch = {
    
    init: function (args) {
      var container;
      
      if (!args.container) {
        container = document.getElementById('SketchCanvasesContainer');
      } else {
        container = args.container;
      }
      container.style.position = 'relative';
      this.container = container;
      
      this.canvases = {};
      this.placeholder = document.createElement('canvas');
      this.images = {};
      
      this.entityImages = {};
      if (args.entityImages) {
        this.createEntityImages(args.entityImages);
      }
      
      this.tilesetImages = {};
      if (args.tilesetImages) {
        this.createTilesetImages(args.tilesetImages);
      }
      
      return this;
    },
    
    loadImages: function (srcs, callback) {
      ImageLoader.loadImages(this.images, srcs, callback);
    },
    
    createEntityImages: function (entityImages) {
      var imageName, src;
      for (imageName in entityImages) {
        src = entityImages[imageName];
        this.entityImages[imageName] = Object.create(EntityImage).init(src);
      }
    },
    
    createTilesetImages: function (tilesetImages) {
      var tilesetName, src;
      for (tilesetName in tilesetImages) {
        src = tilesetImages[tilesetName];
        this.tilesetImages[tilesetName] = Object.create(TilesetImage).init(src);
      }
    },
    
    addCanvas: function (name, el) {
      var canvas = Object.create(Canvas).init(el);
      this.canvases[name] = canvas;
      return canvas;
    },
    
    createCanvas: function (name, width, height) {
      var canvas = Object.create(Canvas).init(null, width, height);
      this.canvases[name] = canvas;
      return canvas;
    },
    
    appendCanvasToContainer: function (name, zIndex) {
      var el = this.canvases[name].el;
      el.style.position = 'absolute';
      el.style.zIndex = (typeof zIndex === 'undefined') ? 0 : zIndex;
      this.container.appendChild(el);
    },
    
    drawTilemap: function (canvas, tilemap, tileset) {
      var tileSize, width, height, pixelWidth, pixelHeight, tilesetImage, cache, image, i, len, tile, tileXY, coordinates;
      
      tileSize = tileset.tileSize;
      
      // Create a cached Canvas for effeciently redrawing the Tilemap.
      if (!tilemap.cache) {
        
        tilesetImage = this.tilesetImages[tileset.image];
        
        // Only create a cache if the Tilesets' image is loaded.
        if (tilesetImage && tilesetImage.image) {
          
          width = tilemap.width;
          height = tilemap.height;
          pixelWidth = width * tileSize;
          pixelHeight = height * tileSize;
          // TODO: Find better way to organize these caches?
          tilemap.cache = Object.create(Canvas).init(null, pixelWidth, pixelHeight);
          cache = tilemap.cache;
          
          // Draw all Tiles to the cache.
          for (i = 0, len = tilemap.tiles.length; i < len; i++) {
            tile = tileset.tiles[tilemap.tiles[i]];
            if (tile) {
              tileXY = Tile.getXY(i, width);
              coordinates = tile.coordinates;
              cache.drawSlice(
                tilesetImage.image,
                coordinates[0], coordinates[1],
                tileSize, tileSize,
                (tileXY[0] * tileSize), (tileXY[1] * tileSize)
              );
            }
          }
          
        } else {
          // Don't draw if there isn't a cache.
          return;
        }
      }
      
      // Draw from the cache onto this Canvas.
      this.canvases[canvas].drawImage(
        tilemap.cache.el,
        tilemap.x * tileSize,
        tilemap.y * tileSize
      );
    },
    
    drawEntity: function (canvas, entity) {
      var entityImage, entityImage, image, directionRow, xStart, yStart, spriteWidth, spriteHeight, frame;
      
      entityImage = this.entityImages[entity.image];
      
      // Check that the EntityImage's image has loaded.
      // CONSIDER: Is first part of boolean check needed?
      if (entityImage && entityImage.image) {
        image = entityImage.image;
      } else {
        // Don't draw if there is no image.
        return;
      }
      
      directionRow = entity.directionRow;
      
      spriteWidth = entityImage.spriteWidth;
      spriteHeight = entityImage.spriteHeight;
      frame = entity.frame;
      
      xStart = spriteWidth * frame;
      yStart = spriteHeight * directionRow;
      
      //this.ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
      //this.canvases[canvas].ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
      this.canvases[canvas].drawSlice(
        image,
        xStart, yStart,
        spriteWidth, spriteHeight,
        entity.x - Math.floor(spriteWidth / 2) + Math.floor(entity.width / 2),
        entity.y - spriteHeight + entity.height
      );
    },
    
    drawLayer: function (canvas, tilemaps, tileset, height, entities) {
      var t, tLen, e, eLen, tileSize, y, tilemap, entity;
      
      t = 0;
      tLen = tilemaps.length;
      if (entities) {
        e = 0
        eLen = entities.length;
        tileSize = tileset.tileSize;
      }
      // Entities can move off the map, so increase the range by 2.
      for (y = -1; y < height + 1; y++) {
        if (entities) {
          // The `entities` array MUST ALREADY BE ORDERED BY Y.
          for (; e < eLen; e++) {
            entity = entities[e];
            if (entity.getTileBase(tileSize) === y) {
              this.drawEntity(canvas, entity);
            } else {
              break;
            }
          }
        }
        // The `tilemaps` array MUST ALREADY BE ORDERED BY BASE.
        for (; t < tLen; t++) {
          tilemap = tilemaps[t];
          if (tilemap.base === y) {
            this.drawTilemap(canvas, tilemap, tileset);
          } else {
            break;
          }
        }
        
      }
    },
    
    // TODO: Allow multiple canvases.
    drawLayeredMap: function (canvas, layeredMap, entities) {
      var layers, tileset, height, i, len;
      
      layers = layeredMap.layers;
      tileset = layeredMap.tileset;
      height = layeredMap.height;
      
      for (i = 0, len = layers.length; i < len; i++) {
        if (entities && i === layeredMap.entityLayer) {
          this.drawLayer(canvas, layers[i], tileset, height, entities);
        } else {
          this.drawLayer(canvas, layers[i], tileset, height);
        }
      }
    }
    
  };
  
  return Sketch;
});

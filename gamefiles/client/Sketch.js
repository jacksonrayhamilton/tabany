define(['jquery', 'underscore',
        'client/Canvas', 'client/EntityImage', 'client/TilesetImage'],
function ($, _,
          Canvas, EntityImage, TilesetImage) {
  
  'use strict';
  
  var Sketch = {
    
    init: function (args) {
      args = args || {};
      
      this.$el = args.$el || $( (args.el || '.canvases-container') );
      this.$el.css({
        position: 'relative'
      });
      
      this.canvases = {};
      this.images = {};
      
      this.entityImages = {};
      if (args.entityImages) {
        this.createImages(this.entityImages, EntityImage, args.entityImages);
      }
      
      this.tilesetImages = {};
      if (args.tilesetImages) {
        this.createImages(this.tilesetImages, TilesetImage, args.tilesetImages);
      }
      
      return this;
    },
    
    createImages: function (container, ImageType, images) {
      var imageName;
      for (imageName in images) {
        container[imageName] = Object.create(ImageType).init({
          src: ImageType.DIRECTORY + images[imageName]
        });
      }
    },
    
    createCanvas: function (name, width, height) {
      var canvas = Object.create(Canvas).init(null, width, height);
      this.canvases[name] = canvas;
      return canvas;
    },
    
    appendCanvas: function (name, zIndex) {
      var $canvas = $(this.canvases[name].el);
      $canvas.css({
        position: 'absolute',
        zIndex: (typeof zIndex === 'undefined') ? 0 : zIndex
      });
      this.$el.append($canvas);
    },
    
    drawTilemap: function (canvas, tilemap, tileset) {
      var tileSize, width, height, pixelWidth, pixelHeight, tilesetImage, cache, image, i, len, tilesetTile, tile, tileXY, coordinates;
      
      tileSize = tileset.tileSize;
      
      // Create a cached Canvas for effeciently redrawing the Tilemap.
      if (!tilemap.cache) {
        
        tilesetImage = this.tilesetImages[tileset.image];
        
        // Only create a cache if the Tilesets' image is loaded.
        if (tilesetImage.image) {
          
          width = tilemap.width;
          height = tilemap.height;
          pixelWidth = width * tileSize;
          pixelHeight = height * tileSize;
          // TODO: Find better way to organize these caches?
          tilemap.cache = Object.create(Canvas).init(null, pixelWidth, pixelHeight);
          cache = tilemap.cache;
          
          // Draw all Tiles to the cache.
          for (i = 0, len = tilemap.tiles.length; i < len; i++) {
            tilesetTile = tilemap.tiles[i];
            if (tilesetTile > -1) {
              tile = tileset.tiles[tilesetTile];
              coordinates = tileset.coordinates[tilesetTile];
              cache.drawSlice(
                tilesetImage.image,
                coordinates[0], coordinates[1],
                tileSize, tileSize,
                ((i % width) * tileSize), (Math.floor(i / width) * tileSize)
              );
            }
          }
          
        } else {
          // The image wasn't loaded. Start loading it now, and continue
          // failing silently until it is loaded. Don't worry, no one will
          // notice. :)
          if (!tilesetImage.loading) {
            tilesetImage.load();
          }
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
      var entityImage, image, directionRow, xStart, yStart, spriteWidth, spriteHeight, frame;
      
      entityImage = this.entityImages[entity.image];
      
      // Check that the EntityImage's image has loaded.
      if (entityImage.image) {
        image = entityImage.image;
      } else {
        // The image wasn't loaded. Start loading it now, and continue
        // failing silently until it is loaded.
        if (!entityImage.loading) {
          entityImage.load();
        }
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

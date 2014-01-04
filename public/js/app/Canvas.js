define(['app/Tile'],
function (Tile) {
  
  'use strict';
  
  var Canvas = {
    
    init: function (el, width, height) {
      if (el === null) {
        el = document.createElement('canvas');
        el.width = width;
        el.height = height;
      }
      this.el = el;
      this.width = this.el.width;
      this.height = this.el.height;
      this.ctx = this.el.getContext('2d');
      return this;
    },
    
    drawImage: function (image, x, y) {
      this.ctx.drawImage(image, x, y);
    },
    
    drawSlice: function (image, sx, sy, sWidth, sHeight, dx, dy) {
      this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight);
    },
    
    drawTilemap: function (tilemap, tileset) {
      var tileSize, width, height, pixelWidth, pixelHeight, cache, image, i, len, tile, tileXY, coordinates;
      
      tileSize = tileset.tileSize;
      width = tilemap.width;
      height = tilemap.height;
      pixelWidth = width * tileSize;
      pixelHeight = height * tileSize;
      
      // Create a cached Canvas for effeciently redrawing the Tilemap.
      if (!tilemap.cache) {
        tilemap.cache = Object.create(Canvas).init(null, pixelWidth, pixelHeight);
        cache = tilemap.cache;
        image = tileset.image;
        // Draw all Tiles to the cache.
        for (i = 0, len = tilemap.tiles.length; i < len; i++) {
          tile = tileset.tiles[tilemap.tiles[i]];
          if (tile) {
            tileXY = Tile.getXY(i, width);
            coordinates = tile.coordinates;
            cache.drawSlice(
              image,
              coordinates[0], coordinates[1],
              tileSize, tileSize,
              (tileXY[0] * tileSize), (tileXY[1] * tileSize)
            );
          }
        }
      }
      
      // Draw from the cache onto this Canvas.
      this.drawImage(
        tilemap.cache.el,
        tilemap.x * tileSize,
        tilemap.y * tileSize
      );
    },
    
    drawEntity: function (entity) {
      var spriteset, image, directionRow, xStart, yStart, spriteWidth, spriteHeight, frame;
      
      image = entity.image;
      //spriteset = this.spritesets[entity.spriteset];
      /*if (entity.spriteset.image) {
        image = entity.spriteset.image;
      } else {
        
      }*/
      
      switch (entity.direction) {
        case 'left': directionRow = 1; break;
        case 'up': directionRow = 3; break;
        case 'right': directionRow = 2; break;
        case 'down': directionRow = 0; break;
      }
      
      //spriteWidth = entity.spriteset.spriteWidth;
      //spriteHeight = entity.spriteset.spriteHeight;
      spriteWidth = entity.spriteWidth;
      spriteHeight = entity.spriteHeight;
      frame = entity.frame;
      
      xStart = spriteWidth * frame;
      yStart = spriteHeight * directionRow;
      
      //this.ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
      //this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height)
      this.drawSlice(
        image,
        xStart, yStart,
        spriteWidth, spriteHeight,
        entity.x - Math.floor(spriteWidth / 2) + Math.floor(entity.width / 2),
        entity.y - spriteHeight + entity.height
      );
    },
    
    drawLayer: function (tilemaps, tileset, height, entities) {
      var t, tLen, e, eLen, tileSize, y, tilemap, entity;
      
      t = 0;
      tLen = tilemaps.length;
      if (entities) {
        e = 0
        eLen = entities.length;
        tileSize = tileset.tileSize;
      }
      for (y = 0; y < height; y++) {
        if (entities) {
          // TODO: Cache this row. Update if an entity moves.
          // Since `entities` are always sorted by y before this
          // block executes, this loop is also safe.
          for (; e < eLen; e++) {
            entity = entities[e];
            if (entity.getTileBase(tileSize) === y) {
              this.drawEntity(entity);
            } else {
              break;
            }
          }
        }
        // The `tilemaps` array MUST ALREADY BE ORDERED BY BASE.
        // Thus, when a Tilemap not of the currently-iterating base is
        // encountered, the loop can safely be broken.
        for (; t < tLen; t++) {
          tilemap = tilemaps[t];
          if (tilemap.base === y) {
            this.drawTilemap(tilemap, tileset);
          } else {
            break;
          }
        }
        
      }
    },
    
    drawLayeredMap: function (layeredMap, entities) {
      var layers, tileset, height, i, len;
      
      layers = layeredMap.layers;
      tileset = layeredMap.tileset;
      height = layeredMap.height;
      
      for (i = 0, len = layers.length; i < len; i++) {
        if (entities && i === layeredMap.entityLayer) {
          this.drawLayer(layers[i], tileset, height, entities);
        } else {
          this.drawLayer(layers[i], tileset, height);
        }
      }
    }
  };
  
  return Canvas;
});

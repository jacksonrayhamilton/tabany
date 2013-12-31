define(['app/Tile'],
function (Tile) {
  
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
      var width, image, tileSize, i, len, tile, tileXY, coordinates;
      width = tilemap.width;
      image = tileset.image;
      tileSize = tileset.tileSize;
      for (i = 0, len = tilemap.tiles.length; i < len; i++) {
        tile = tileset.tiles[tilemap.tiles[i]];
        if (tile) {
          tileXY = Tile.getXY(i, width);
          coordinates = tile.coordinates;
          this.drawSlice(
            image,
            coordinates[0], coordinates[1],
            tileSize, tileSize,
            ((tileXY[0] + tilemap.x) * tileSize), ((tileXY[1] + tilemap.y) * tileSize)
          );
        }
      }
    },
    
    drawEntity: function (entity) {
      var image = entity.image;
      /*this.ctx.fillRect(
        entity.x + Math.floor(entity.width / 2) - Math.floor(entity.baseX / 2),
        entity.y + entity.height - entity.baseY,
        entity.baseX,
        entity.baseY
      );*/
      this.ctx.fillRect(entity.x, entity.y, entity.baseX, entity.baseY)
      this.drawSlice(
        image,
        0, 0,
        image.width / 4, image.height / 4,
        entity.x - Math.floor(entity.width / 2) + Math.floor(entity.baseX / 2),
        entity.y - entity.height + entity.baseY
      );
    },
    
    drawLayer: function (tilemaps, tileset, height, entities) {
      var t, tLen, e, eLen, tileSize, entitiesSortedByY, y, tilemap, entity;
      
      t = 0;
      tLen = tilemaps.length;
      if (entities) {
        e = 0
        eLen = entities.length;
        tileSize = tileset.tileSize;
        
        // TODO: Mutate array.
        /*
         * `entities` must be sorted at least once prior to calling
         * this function. It cannot be assumed that any have
         * moved before this function has been called.
         * 
         * Each time a player moves, mark the entities array
         * for re-sorting. Then re-sort it the next time this function
         * is called.
         */
        
        entitiesSortedByY = entities.sort(function (a, b) {
          return a.y - b.y;
        });
      }
      for (y = 0; y < height; y++) {
        // TODO: Cache this row.
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
        if (entities) {
          // TODO: Cache this row. Update if an entity moves.
          // Since `entities` are always sorted by y before this
          // block executes, this loop is also safe.
          for (; e < eLen; e++) {
            entity = entitiesSortedByY[e];
            if (entity.getTileBase(tileSize) === y) {
              this.drawEntity(entity);
            } else {
              break;
            }
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

wouldCollideWithMap: function (direction, dx, dy, layeredMap) {
      var tileSize, impassibilityMap, start, end, current, preciseProjection, projection, row, col, currentTile, projectedTile, tiles, t, tLen, impassibility, tileXY, leftBound, rightBound, topBound, bottomBound;
      
      tileSize = layeredMap.tileset.tileSize;
      
      // RELIES ON MOVING BY 1 PIXEL!!! (But is more performant.)
      //if (this.x % tileSize !== 0 || this.y % tileSize !== 0) {
      //  return false;
      //}
      
      impassibilityMap = layeredMap.impassibilityMap;
      
      // Determine the range
      if (dx !== 0) {
        start = Math.floor(this.y / tileSize);
        end = Math.floor((this.y + this.baseY - 1) / tileSize);
        if (dx < 0) {
          current = Math.floor(this.x / tileSize);
          preciseProjection = this.x + dx;
        } else {
          current = Math.floor((this.x + this.baseX - 1) / tileSize);
          preciseProjection = this.x + this.baseX - 1 + dx;
        }
        projection = Math.floor(preciseProjection / tileSize);
        for (row = start; row <= end; row++) {
          currentTile = (row * layeredMap.width) + current;
          projectedTile = (row * layeredMap.width) + projection;
          tiles = [
            currentTile,
            projectedTile
          ];
          for (t = 0, tLen = tiles.length; t < tLen; t++) {
            impassibility = impassibilityMap[tiles[t]];
            if (impassibility) {
              // Complete impassibility
              if (impassibility === true) {
                return true;
              }
              // Directional impassibility
              else if (Array.isArray(impassibility)) {
                tileXY = Tile.getXY(tiles[t], layeredMap.width);
                if (impassibility.indexOf('left') > -1) {
                  leftBound = tileXY[0] * tileSize;
                  if      (t === 0 && dx < 0 && preciseProjection < leftBound) return true;
                  else if (t === 1 && dx > 0 && preciseProjection >= leftBound && (preciseProjection - this.baseX + 1) < leftBound) return true;
                }
                if (impassibility.indexOf('right') > -1) {
                  rightBound = ((tileXY[0] + 1) * tileSize) - 1;
                  if      (t === 1 && dx < 0 && preciseProjection <= rightBound && (preciseProjection + this.baseX - 1) > rightBound) return true;
                  else if (t === 0 && dx > 0 && preciseProjection > rightBound) return true;
                }
              }
            }
          }
        }
      } else if (dy !== 0) {
        start = Math.floor(this.x / tileSize);
        end = Math.floor((this.x + this.baseX - 1) / tileSize);
        if (dy < 0) {
          current = Math.floor(this.y / tileSize);
          preciseProjection = this.y + dy;
        } else {
          current = Math.floor((this.y + this.baseY - 1) / tileSize);
          preciseProjection = this.y + this.baseY - 1 + dy;
        }
        projection = Math.floor(preciseProjection / tileSize);
        for (col = start; col <= end; col++) {
          currentTile = (current * layeredMap.width) + col;
          projectedTile = (projection * layeredMap.width) + col;
          tiles = [
            currentTile,
            projectedTile
          ];
          for (t = 0, tLen = tiles.length; t < tLen; t++) {
            impassibility = impassibilityMap[tiles[t]];
            if (impassibility) {
              // Complete impassibility
              if (impassibility === true) {
                return true;
              }
              // Directional impassibility
              else if (Array.isArray(impassibility)) {
                tileXY = Tile.getXY(tiles[t], layeredMap.width);
                if (impassibility.indexOf('up') > -1) {
                  topBound = tileXY[1] * tileSize;
                  if      (t === 0 && dy < 0 && preciseProjection < topBound) return true;
                  else if (t === 1 && dy > 0 && preciseProjection >= topBound && (preciseProjection - this.baseY + 1) < topBound) return true;
                }
                if (impassibility.indexOf('down') > -1) {
                  bottomBound = ((tileXY[1] + 1) * tileSize) - 1;
                  if      (t === 1 && dy < 0 && preciseProjection <= bottomBound && (preciseProjection + this.baseY - 1) > bottomBound) return true;
                  else if (t === 0 && dy > 0 && preciseProjection > bottomBound) return true;
                }
              }
            }
          }
        }
      }
    },

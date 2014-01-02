define(['app/Tile'],
function (Tile) {
  
  'use strict';
  
  var Entity = {
    init: function (x, y, baseX, baseY, image, direction, movementRate, frameRate) {
      this.x = x;
      this.y = y;
      this.baseX = baseX;
      this.baseY = baseY;
      this.image = image;
      this.width = Math.floor(image.width / 4);
      this.height = Math.floor(image.height / 4);
      this.direction = direction;
      this.movementRate = movementRate;
      this.frameRate = frameRate;
      this.speed = 1;
      this.frame = 0; // 0-3
      this.nextFrameCount = 0;
      return this;
    },
    getTileBase: function (tileSize) {
      return Math.floor(this.y / tileSize);
    },
    wouldCollide: function (target, dx, dy) {
      return (
        this.x + dx <= target.x + target.width - 1  ||  // this.left <= target.right
        this.x + this.baseX - 1 + dx >= target.x    ||  // this.right >= target.left
        this.y + dy <= target.y + target.height - 1 ||  // this.top <= target.bottom
        this.y + this.baseY - 1 + dy >= target.y        // this.bottom >= target.top
      );
    },
    
    wouldCollideWithMap: function (dx, dy, layeredMap) {
      var tileSize, impassibilityMap,
      delta, axisIndex, axis, base, oppositeAxis, oppositeBase,
      lowerDirection, upperDirection,
      current, preciseProjection, projection,
      start, end, i, currentTile, projectedTile,
      tiles, t, tLen,
      impassibility, tileXY, lowerBound, upperBound;
      
      tileSize = layeredMap.tileset.tileSize;
      
      // RELIES ON MOVING BY 1 PIXEL!!! (But is more performant.)
      /*if (this.x % tileSize !== 0 || this.y % tileSize !== 0) {
        return false;
      }*/
      
      impassibilityMap = layeredMap.impassibilityMap;
      
      // This function is generalized to work for either axis.
      if (dx !== 0) {
        delta = dx;
        axisIndex = 0;
        axis = this.x;
        base = this.baseX;
        oppositeAxis = this.y;
        oppositeBase = this.baseY;
        lowerDirection = 'left';
        upperDirection = 'right';
      } else if (dy !== 0) {
        delta = dy;
        axisIndex = 1;
        axis = this.y;
        base = this.baseY;
        oppositeAxis = this.x;
        oppositeBase = this.baseX;
        lowerDirection = 'up';
        upperDirection = 'down';
      }
      
      // Determine the coordinates of the relevant sides of the Entity's
      // current area and of its projected area.
      // Its current area's side is needed for checking inclusive special
      // impassibility (when inside a Tile).
      // Its projected area's side is needed for checking exclusive special
      // impassibility (when moving into a Tile).
      if (delta < 0) {
        current = Math.floor(axis / tileSize);
        preciseProjection = axis + delta;
      } else if (delta > 0) {
        current = Math.floor((axis + base - 1) / tileSize);
        preciseProjection = axis + base - 1 + delta;
      }
      projection = Math.floor(preciseProjection / tileSize);
      
      // Determine the range of Tiles to check (the Entity may be
      // in-between more than 1 Tile).
      start = Math.floor(oppositeAxis / tileSize);
      end = Math.floor((oppositeAxis + oppositeBase - 1) / tileSize);
      
      // Check the whole range of Tiles.
      for (i = start; i <= end; i++) {
        // The current and projected tiles in terms of...
        if (dx !== 0) {
          // ...rows.
          currentTile = (i * layeredMap.width) + current;
          projectedTile = (i * layeredMap.width) + projection;
        } else if (dy !== 0) {
          // ...columns.
          currentTile = (current * layeredMap.width) + i;
          projectedTile = (projection * layeredMap.width) + i;
        }
        tiles = [
          currentTile,
          projectedTile
        ];
        
        // Check both the current and projected Tiles.
        for (t = 0, tLen = tiles.length; t < tLen; t++) {
          
          // Use the impassibility properties generated by the
          // impassibilityMap.
          impassibility = impassibilityMap[tiles[t]];
          
          // The impassibility may be undefined.
          if (impassibility) {
            
            // Complete impassibility (all directions). A simple check.
            if (impassibility === true) {
              return true;
            }
            // Directional impassibility (only certain edges of Tiles are
            // impassible [from either direction on an axis]). A more
            // involved check.
            else if (Array.isArray(impassibility)) {
              tileXY = Tile.getXY(tiles[t], layeredMap.width);
              
              // Check if left-moving Entity's left bound exceeds Tile's left bound
              // (or if up-moving Entity's top bound exceeds Tile's top bound).
              // Also check if right-moving Entity's right bound intersects the next Tile's left bound
              // (or if down-moving Entity's bottom bound intersects the next Tile's top bound).
              if (impassibility.indexOf(lowerDirection) > -1) {
                lowerBound = tileXY[axisIndex] * tileSize;
                if      (t === 0 && delta < 0 && preciseProjection < lowerBound) return true;
                else if (t === 1 && delta > 0 && preciseProjection >= lowerBound && (preciseProjection - base + 1) < lowerBound) return true;
              }
              
              // Check if left-moving Entity's left bound intersects the next Tile's right bound
              // (or if up-moving Entity's top bound intersects the next Tile's bottom bound).
              // Also check if right-moving Entity's right bound exceeds Tile's right bound
              // (or if down-moving Entity's bottom bound exceeds Tile's bottom bound).
              if (impassibility.indexOf(upperDirection) > -1) {
                upperBound = ((tileXY[axisIndex] + 1) * tileSize) - 1;
                if      (t === 1 && delta < 0 && preciseProjection <= upperBound && (preciseProjection + base - 1) > upperBound) return true;
                else if (t === 0 && delta > 0 && preciseProjection > upperBound) return true;
              }
            }
          }
        }
      }
      return false;
    },
    
    move: function (direction, layeredMap) {
      var dx, dy, nearbyTiles, tileBase;
      
      this.direction = direction;
      
      dx = 0;
      dy = 0;
      
      switch (direction) {
        case 'left': dx = -1 * this.speed; break;
        case 'up': dy = -1 * this.speed; break;
        case 'right': dx = this.speed; break;
        case 'down': dy = this.speed; break;
      }
      
      if (!this.wouldCollideWithMap(dx, dy, layeredMap)) {
        this.x += dx;
        this.y += dy;
      }
      
      /*if (!this.wouldCollideWithEntity()) {
        
      }*/
    },
    
    moveContinuously: function (direction, layeredMap, input, keyCode) {
      if (input.keyIsPressed(keyCode)) {
        this.moving = true;
        this.nextFrame();
        this.move(direction, layeredMap);
        this.movementTimeout = setTimeout((function () {
          this.moveContinuously.call(this, direction, layeredMap, input, keyCode);
        }).bind(this), this.movementRate);
      } else {
        this.moving = false;
        this.frame = 0;
        clearTimeout(this.movementTimeout);
      }
    },
    
    nextFrame: function () {
      if (this.nextFrameCount === this.frameRate) {
        var frame = this.frame += 1;
        this.frame = (frame > 3) ? 0 : frame;
        this.nextFrameCount = 0;
      }
      this.nextFrameCount += 1;
    }
    
  };
  
  return Entity;
});

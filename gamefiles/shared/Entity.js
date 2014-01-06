define(['shared/Util', 'shared/Tile'],
function (Util, Tile) {
  
  'use strict';
  
  var Entity = {
    init: function (x, y, width, height, image, direction, pixelRate, moveRate, frameRate) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      // String corresponding to the name of an EntityImage.
      this.image = image;
      this.setDirection(direction);
      this.pixelRate = pixelRate;
      this.moveRate = moveRate;
      this.frameRate = frameRate;
      
      if (Util.inBrowser()) {
        this.frame = 0; // 0..3
        this.nextFrameCount = 0;
        // Entities should NOT need this property
        this.game = null;
      }
      
      return this;
    },
    
    toJSON: function () {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        image: this.image,
        direction: this.direction,
        pixelRate: this.pixelRate,
        moveRate: this.moveRate,
        frameRate: this.frameRate
      };
    },
    
    setDirection: function (direction) {
      this.direction = direction;
      switch (direction) {
        case 'left': this.directionRow = 1; break;
        case 'up': this.directionRow = 3; break;
        case 'right': this.directionRow = 2; break;
        case 'down': this.directionRow = 0; break;
      }
    },
    
    getTileBase: function (tileSize) {
      return Math.floor((this.y + this.height - 1) / tileSize);
    },
    
    // TODO: Move all collision detection logic into Game.js.
    // That way all these arguments don't need to be passed in, also
    // you can have a reference to the game object without needing
    // to latch it onto the Entity.
    
    wouldCollide: function (target, dx, dy) {
      var x, y;
      x = this.x + dx;
      y = this.y + dy;
      return (
        x <= target.x + target.width - 1  &&  // this.left <= target.right
        x + this.width - 1 >= target.x    &&  // this.right >= target.left
        y <= target.y + target.height - 1 &&  // this.top <= target.bottom
        y + this.height - 1 >= target.y       // this.bottom >= target.top
      );
    },
    
    wouldCollideWithEntity: function (entities, dx, dy) {
      var i, len;
      for (i = 0, len = entities.length; i < len; i++) {
        if (entities[i] !== this && this.wouldCollide(entities[i], dx, dy)) return true;
      }
      return false;
    },
    
    wouldCollideWithMap: function (layeredMap, dx, dy) {
      var tileSize, impassibilityMap,
      delta, axisIndex, axis, sideLength, oppositeAxis, oppositeBase,
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
        sideLength = this.width;
        oppositeAxis = this.y;
        oppositeBase = this.height;
        lowerDirection = 'left';
        upperDirection = 'right';
      } else if (dy !== 0) {
        delta = dy;
        axisIndex = 1;
        axis = this.y;
        sideLength = this.height;
        oppositeAxis = this.x;
        oppositeBase = this.width;
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
        current = Math.floor((axis + sideLength - 1) / tileSize);
        preciseProjection = axis + sideLength - 1 + delta;
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
                else if (t === 1 && delta > 0 && preciseProjection >= lowerBound && (preciseProjection - sideLength + 1) < lowerBound) return true;
              }
              
              // Check if left-moving Entity's left bound intersects the next Tile's right bound
              // (or if up-moving Entity's top bound intersects the next Tile's bottom bound).
              // Also check if right-moving Entity's right bound exceeds Tile's right bound
              // (or if down-moving Entity's bottom bound exceeds Tile's bottom bound).
              if (impassibility.indexOf(upperDirection) > -1) {
                upperBound = ((tileXY[axisIndex] + 1) * tileSize) - 1;
                if      (t === 1 && delta < 0 && preciseProjection <= upperBound && (preciseProjection + sideLength - 1) > upperBound) return true;
                else if (t === 0 && delta > 0 && preciseProjection > upperBound) return true;
              }
            }
          }
        }
      }
      return false;
    },
    
    move: function (direction, layeredMap, entities) {
      var dx, dy, nearbyTiles, tileBase;
      
      if (this.direction !== direction) {
        this.setDirection(direction);
      }
      
      dx = 0;
      dy = 0;
      
      switch (direction) {
        case 'left': dx = -1 * this.pixelRate; break;
        case 'up': dy = -1 * this.pixelRate; break;
        case 'right': dx = this.pixelRate; break;
        case 'down': dy = this.pixelRate; break;
      }
      
      if (!this.wouldCollideWithMap(layeredMap, dx, dy) &&
          !this.wouldCollideWithEntity(entities, dx, dy)) {
        this.x += dx;
        this.y += dy;
      }
      
      this.game.entitiesChanged = true;
      
      /*if (!this.wouldCollideWithEntity()) {
        
      }*/
    },
    
    // TODO: Generalize this function so that it can be used without inputs.
    moveContinuously: (function () {
      var callback = function () {
        this.moveContinuously.apply(this, Util.slice(arguments[0]));
      };
      var actuallyMove = function (direction, layeredMap, entities, input, keyCode) {
        this.moving = true;
        this.nextFrame();
        this.move(direction, layeredMap, entities);
        this.movementTimeout = setTimeout(callback.bind(this, arguments), this.moveRate);
      };
      return function (direction, layeredMap, entities, input, keyCode) {
        var keyProperties,
        oppositeKeyCode, adjacentKeyCode, adjacentOppositeKeyCode,
        otherKeyIsPressed;
        
        // Check if the original key is still being pressed.
        if (input.keyIsPressed(keyCode)) {
          actuallyMove.apply(this, Util.slice(arguments));
        } else {
          // Check if any of the other directional keys are being pressed.
          keyProperties = input.keyProperties;
          oppositeKeyCode = keyProperties[keyCode].opposite;
          adjacentKeyCode = keyProperties[keyCode].adjacent;
          adjacentOppositeKeyCode = keyProperties[adjacentKeyCode].opposite;
          
          if (input.keyIsPressed(oppositeKeyCode)) {
            direction = keyProperties[oppositeKeyCode].direction;
            keyCode = oppositeKeyCode;
            otherKeyIsPressed = true;
          } else if (input.keyIsPressed(adjacentKeyCode)) {
            direction = keyProperties[adjacentKeyCode].direction;
            keyCode = adjacentKeyCode;
            otherKeyIsPressed = true;
          } else if (input.keyIsPressed(adjacentOppositeKeyCode)) {
            direction = keyProperties[adjacentOppositeKeyCode].direction;
            keyCode = adjacentOppositeKeyCode;
            otherKeyIsPressed = true;
          }
          
          if (otherKeyIsPressed) {
            actuallyMove.call(this, direction, layeredMap, entities, input, keyCode);
          } else {
            this.moving = false;
            this.frame = 0;
            clearTimeout(this.movementTimeout);
          }
        }
      };
    }()),
    
    startMovingContinuously: function (direction, layeredMap, entities, input, keyCode) {
      if (this.moving) {
        if (direction !== this.direction) {
          clearTimeout(this.movementTimeout);
          this.moveContinuously.apply(this, Util.slice(arguments));
        }
      } else {
        this.moveContinuously.apply(this, Util.slice(arguments));
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
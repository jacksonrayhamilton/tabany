define(
function () {
  
  var Entity = {
    init: function (x, y, baseX, baseY, image, orientation) {
      this.x = x;
      this.y = y;
      this.baseX = baseX;
      this.baseY = baseY;
      this.image = image;
      this.width = Math.floor(image.width / 4);
      this.height = Math.floor(image.height / 4);
      this.orientation = orientation; // 0, 1, 2, 3 for directions
      this.speed = 1;
      return this;
    },
    getTileBase: function (tileSize) {
      return Math.floor(this.y / tileSize);
    },
    wouldCollide: function (target, dx, dy) {
      return (
        this.x + dx <= target.x + target.width - 1  ||  // this.left <= target.right
        this.x + this.width - 1 + dx >= target.x    ||  // this.right >= target.left
        this.y + dy <= target.y + target.height - 1 ||  // this.top <= target.bottom
        this.y + this.height - 1 + dy >= target.y       // this.bottom >= target.top
      );
    },
    wouldCollideWithMap: function (dx, dy, layeredMap) {
      var tileSize, impassibilityMap, start, end, projection, row, col;
      
      tileSize = layeredMap.tileset.tileSize;
      
      // RELIES ON MOVING BY 1 PIXEL!!! (But is quite performant.)
      /*if (this.x % tileSize !== 0 || this.y % tileSize !== 0) {
        return false;
      }*/
      
      impassibilityMap = layeredMap.impassibilityMap;
      
      // Determine the range
      if (dx !== 0) {
        start = Math.floor(this.y / tileSize);
        end = Math.floor((this.y + this.height - 1) / tileSize);
        projection = Math.floor((this.x + dx) / tileSize);
        console.log(start, end, projection);
        for (row = start; row < end; row++) {
          console.log('checking', (row * layeredMap.width) + projection);
          if (impassibilityMap[(row * layeredMap.width) + projection]) {
            return true;
          }
        }
      } else if (dy !== 0) {
        start = Math.floor(this.x / tileSize);
        end = Math.floor((this.x + this.width - 1) / tileSize);
        projection = Math.floor((this.y + dy) / tileSize);
        for (col = start; col < end; col++) {
          if (impassibilityMap[(projection * layeredMap.width) + col]) {
            return true;
          }
        }
      }
    },
    
    move: function (direction, layeredMap) {
      var dx, dy, nearbyTiles, tileBase;
      
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
      
    }
  };
  
  return Entity;
});

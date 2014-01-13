define(['underscore',
        'shared/Entity', 'shared/LayeredMap', 'shared/Player', 'shared/Tileset', 'shared/Util'],
function (_,
          Entity, LayeredMap, Player, Tileset,
          Util) {
  
  'use strict';
  
  /*
   * Manages gamestate-related things that are common to both the client
   * and the server. (Both ClientGame and ServerGame inherit from this.)
   * 
   * Maintains containers of all objects used by the game.
   * Handles movement and collision detection.
   */
  var Game = {
    
    TILESETS_DIRECTORY: '/gamefiles/shared/tilesets/',
    MAPS_DIRECTORY: '/gamefiles/shared/maps/',
    
    init: function () {
      
      // Containers for all data maintained by the game.
      this.tilesets = [];
      this.maps = [];
      this.players = [];
      // Will be sorted constantly.
      this.entities = [];
      
      // Determines if any Entities have changed at all. Mostly used by Sketch
      // to know when to redraw.
      // TODO: Make an additional array that stores the Entities which have
      // changed.
      // REASONING:
      // - Short-term this allows delta information to be gotten from the
      // server relating to multiple Entities (batch calls).
      // - Long-term this can be used for Sketch optimizations (redrawing rects
      // only where changes occur).
      this.entitiesChanged = false;
      
      return this;
    },
    
    
    /*
     * Adders
     * Collection-augmenting methods.
     */
    
    addEntity: function (entity) {
      this.entities.push(entity);
      this.entitiesChanged = true;
      return entity;
    },
    
    // Does NOT add the Player's PlayerCharacter.
    addPlayer: function (player) {
      this.players.push(player);
      return player;
    },
    
    addTileset: function (tileset) {
      this.tilesets.push(tileset);
      return tileset;
    },
    
    addMap: function (map) {
      this.maps.push(map);
      return map;
    },
    
    
    /*
     * Creators
     * Object creation [convenience] methods.
     * Some of these have side-effects, but they are extremely convenient
     * and desirable side-effects so they are probably justifiable.
     */
    
    createEntity: function (entityArgs) {
      // Transform a string into its corresponding Map.
      if (typeof entityArgs.currentMap === 'string') {
        entityArgs.currentMap = this.getMap(entityArgs.currentMap);
      }
      var entity = Object.create(Entity).init(entityArgs);
      this.addEntity(entity);
      return entity;
    },
    
    createPlayer: function (playerArgs) {
      var player = Object.create(Player).init(playerArgs);
      this.addPlayer(player);
      return player;
    },
    
    createTileset: function (tilesetArgs) {
      var tileset = Object.create(Tileset).init(tilesetArgs);
      this.addTileset(tileset);
      return tileset;
    },
    
    createMap: function (mapArgs) {
      // Transform a string into its corresponding Tileset.
      if (typeof mapArgs.tileset === 'string') {
        mapArgs.tileset = this.getTileset(mapArgs.tileset);
      }
      var map = Object.create(LayeredMap).init(mapArgs);
      map.initLayers();
      this.addMap(map);
      return map;
    },
    
    
    /*
     * Getters
     * Object lookup-by-property methods.
     */
    
    getEntity: function (id) {
      var entities, i, len;
      entities = this.entities;
      for (i = 0, len = entities.length; i < len; i++) {
        if (entities[i].id === id) return entities[i];
      }
      return null;
    },
    
    getPlayer: function (uuid) {
      var players, i, len;
      players = this.players;
      for (i = 0, len = players.length; i < len; i++) {
        if (players[i].uuid == uuid) return players[i];
      }
      return null;
    },
    
    getTileset: function (name) {
      var tilesets, i, len;
      tilesets = this.tilesets;
      for (i = 0, len = tilesets.length; i < len; i++) {
        if (tilesets[i].name === name) return tilesets[i];
      }
      return null;
    },
    
    getMap: function (name) {
      var maps, i, len;
      maps = this.maps;
      for (i = 0, len = maps.length; i < len; i++) {
        if (maps[i].name === name) return maps[i];
      }
      return null;
    },
    
    
    /*
     * Removers
     * Collection splicing methods.
     */
    
    removeEntity: function (entity) {
      var index = this.entities.indexOf(entity);
      if (index > -1) {
        this.entities.splice(index, 1);
        this.entitiesChanged = true;
        return true;
      }
      return false;
    },
    
    // Also removes the Player's PlayerCharacter.
    removePlayer: function (player) {
      var index = this.player.indexOf(player);
      if (index > -1) {
        this.removeEntity(player.character);
        this.players.splice(index, 1);
        return true;
      }
      return false;
    },
    
    
    /*
     * Collision-detection
     */
    
    wouldCollide: function (mover, target, dx, dy) {
      var x, y;
      x = mover.x + dx;
      y = mover.y + dy;
      return (
        x <= target.x + target.width - 1 &&   // this.left <= target.right
        x + mover.width - 1 >= target.x &&    // this.right >= target.left
        y <= target.y + target.height - 1 &&  // this.top <= target.bottom
        y + mover.height - 1 >= target.y      // this.bottom >= target.top
      );
    },
    
    wouldCollideWithEntity: function (mover, dx, dy) {
      var entities, i, len;
      entities = this.entities;
      for (i = 0, len = entities.length; i < len; i++) {
        if (entities[i] !== mover && this.wouldCollide(mover, entities[i], dx, dy)) return true;
      }
      return false;
    },
    
    wouldCollideWithMap: function (mover, layeredMap, dx, dy) {
      var tileSize, impassibilityMap,
      delta, axisIndex, axis, sideLength, oppositeAxis, oppositeSideLength,
      lowerDirection, upperDirection,
      current, preciseProjection, projection,
      start, end, i, currentTile, projectedTile,
      tiles, t, tLen,
      impassibility, tile, width, tileXY, lowerBound, upperBound;
      
      tileSize = layeredMap.tileset.tileSize;
      
      // Relies on moving by only 1 pixel, but is more performant.
      /*if (this.x % tileSize !== 0 || this.y % tileSize !== 0) {
        return false;
      }*/
      
      impassibilityMap = layeredMap.impassibilityMap;
      
      // This function is generalized to work for either axis.
      if (dx !== 0) {
        delta = dx;
        axisIndex = 0;
        axis = mover.x;
        sideLength = mover.width;
        oppositeAxis = mover.y;
        oppositeSideLength = mover.height;
        lowerDirection = 'left';
        upperDirection = 'right';
      } else if (dy !== 0) {
        delta = dy;
        axisIndex = 1;
        axis = mover.y;
        sideLength = mover.height;
        oppositeAxis = mover.x;
        oppositeSideLength = mover.width;
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
      end = Math.floor((oppositeAxis + oppositeSideLength - 1) / tileSize);
      
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
              tile = tiles[t];
              width = layeredMap.width;
              tileXY = [tile % width, Math.floor(tile / width)];
              
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
      // If all checks failed, then the Entity will not collide.
      return false;
    },
    
    // Changes a mover's direction and attempts to move him in that direction.
    move: function (mover, direction, layeredMap) {
      var dx, dy, nearbyTiles, tileBase, ret;
      
      if (mover.direction !== direction) {
        mover.setDirection(direction);
      }
      
      dx = 0;
      dy = 0;
      
      switch (direction) {
        case 'left': dx = -1 * mover.pixelRate; break;
        case 'up': dy = -1 * mover.pixelRate; break;
        case 'right': dx = mover.pixelRate; break;
        case 'down': dy = mover.pixelRate; break;
      }
      
      if (!this.wouldCollideWithMap(mover, layeredMap, dx, dy) &&
          !this.wouldCollideWithEntity(mover, dx, dy)) {
        mover.x += dx;
        mover.y += dy;
        ret = true;
      } else {
        ret = false;
      }
      
      mover.changed = true;
      this.entitiesChanged = true;
      
      return ret;
    },
    
    // Moves an Entity at his moveRate for as long as he is deemed
    // to be moving. His moving property will probably be set to false
    // by stopMovingContinuously.
    // More efficient and controllable than registering repeated keydowns,
    // especially on the server.
    moveContinuously: function (mover, direction, layeredMap) {
      if (mover.moving) {
        mover.nextFrame();
        this.move(mover, direction, layeredMap);
        mover.movementTimeout = setTimeout((function () {
          this.moveContinuously(mover, direction, layeredMap);
        }).bind(this), mover.moveRate);
      } else {
        mover.frame = 0;
        clearTimeout(mover.movementTimeout);
      }
    },
    
    // Begins the process of moving continuously with a few checks that only
    // need to be made once per command.
    startMovingContinuously: function (entity, direction, layeredMap) {
      var newDirection;
      newDirection = direction !== entity.direction;
      if (!entity.moving || newDirection) {
        entity.moving = true;
        if (newDirection) {
          clearTimeout(entity.movementTimeout);
        }
        this.moveContinuously(entity, direction, layeredMap);
        // Only tell the world that the Entity is moving if you are in
        // control of him.
        if (Util.inBrowser() && entity === this.player.entity) {
          this.socket.emit('startMovingContinuously', { direction: direction });
        }
      }
    },
    
    // Throws a wrench in moveContinuously's loop.
    stopMovingContinuously: function (entity) {
      entity.moving = false;
      if (Util.inBrowser() && entity === this.player.entity) {
        this.socket.emit('stopMovingContinuously');
      }
    }
    
  };
  
  return Game;
});  

/* ****************************************************************************
 * RPG - Game Engine Module
 * ************************************************************************* */

(function($, undefined) {

var RPG = {
	
	// Contains all Entities on the current Map
	entities: [],
	
	// Ensures a unique ID for each newly-created Entity
	nextEntityId: 0,
	
	// Contains all Entities that need to have their DOM elements changed on a
	// requestAnimationFrame
	changedEntities: {},
	
	// Contains all Spritesets that have been used by Entities so far
	spritesets: {},
	
	// Contains all keys currently being pressed (to prevent duplicate presses)
	keys: [],
	
	directionNames: ['left', 'up', 'right', 'down'],
	
	currentEntity: null,
	currentMap: null,
	$map: $('#map')
};


/*
 * DIRECTIONS
 */

// Directions are used for movement and sprites, to determine which way an
// Entity moves, or where its graphic faces
RPG.directions = (function() {
	
	// Set the four cardinal directions
	var directions = {
		'left': {
			'axis': 'x',
			'oppositeAxis': 'y',
			'sign': -1,
			'keyCode': 37,
			'spritesetRow': 1,
			'side': 'left'
		},
		'up': {
			'axis': 'y',
			'oppositeAxis': 'x',
			'sign': -1,
			'keyCode': 38,
			'spritesetRow': 3,
			'side': 'top'
		},
		'right': {
			'axis': 'x',
			'oppositeAxis': 'y',
			'sign': 1,
			'keyCode': 39,
			'spritesetRow': 2,
			'side': 'right'
		},
		'down': {
			'axis': 'y',
			'oppositeAxis': 'x',
			'sign': 1,
			'keyCode': 40,
			'spritesetRow': 0,
			'side': 'bottom'
		}
	};
	
	directions.left.opposite = directions.right;
	directions.up.opposite = directions.down;
	directions.right.opposite = directions.left;
	directions.down.opposite = directions.up;
	
	return directions;
}());


// Create the left, top, right, and bottom map bounds
RPG.makeMapBounds = function() {
	var mapW = (RPG.currentMap.cols * 32),
		mapH = (RPG.currentMap.rows * 32);

	RPG.makeMapBound({
		name: 'left', nametag: false,
		x: -2, y: 0, z: 'all',
		width: 2, height: mapH
	});
	RPG.makeMapBound({
		name: 'top', nametag: false,
		x: 0, y: -2, z: 'all',
		width: mapW, height: 2
	});
	RPG.makeMapBound({
		name: 'right', nametag: false,
		x: mapW, y: 0, z: 'all',
		width: 2, height: mapH
	});
	RPG.makeMapBound({
		name: 'bottom', nametag: false,
		x: 0, y: mapH, z: 'all',
		width: mapW, height: 2
	});
};


/*
 * GENERAL ENTITY STUFF
 */

// Makes a unique Entity of the argument class and adds it to the
// collection of Entities
RPG.makeEntity = function(Class, properties) {
	
	var entity = new Class(properties);
	
	// Set a unique id for the Entity and its DOM element
	entity.id = RPG.nextEntityId;
	entity.$entity.data({
		'id': entity.id
	});
	RPG.nextEntityId += 1;
	
	// Add it to the collection of Entities
	RPG.entities.push(entity);
};


RPG.makePlayer = function(properties) {
	RPG.makeEntity(Player, properties);
};

RPG.makeCritter = function(properties) {
	RPG.makeEntity(Critter, properties);
};

RPG.makeMapBound = function(properties) {
	RPG.makeEntity(MapBound, properties);
};

// Gets the Entity with the argument property and value
RPG.getEntity = function(property, value) {
	for (var i = 0; i < this.entities.length; i += 1) {
		if (this.entities[i][property] === value) {
			return this.entities[i];
		}
	}
};


/*
 * KEYBOARD
 */

// Returns true if the argument keyCode's key is being pressed
RPG.keyIsDown = function(keyCode) {
	return (RPG.keys.indexOf(keyCode) !== -1);
};

// Translates a keyCode to a direction
RPG.keyCodeToDirection = function(keyCode) {
	return RPG.directions[RPG.directionNames[keyCode - 37]];
};

RPG.keyDownEvent = function(keyCode) {
	if (RPG.keyIsDown(keyCode) === false) {
		
		// Add the key to the keys array
		RPG.keys.push(keyCode);
		
		// If the key was shift:
		// Toggle nametags on
		if (keyCode === 16) {
			RPG.$map.addClass('nametags-visible');
		}
		
		// If the key was an arrow key:
		// Start moving in the key's respective direction
		if (keyCode >= 37 && keyCode <= 40) {
			RPG.currentEntity.startMove(RPG.keyCodeToDirection(keyCode));
			return false;
		}
	}
};

RPG.keyUpEvent = function(keyCode) {
	
	// Remove the key from the keys array
	RPG.keys.splice(RPG.keys.indexOf(keyCode), 1);
	
	// If the key was shift:
	// Toggle nametags off
	if (keyCode === 16) {
		RPG.$map.removeClass('nametags-visible');
	}
	
	// If the key was an arrow key:
	// Stop moving in the key's respective direction
	if (keyCode >= 37 && keyCode <= 40) {
		
		var direction = RPG.keyCodeToDirection(keyCode);
		
		// If the let up key's opposite direction is being pressed:
		// Move in that direction instead
		if (RPG.keyIsDown(direction.opposite.keyCode)) {
			RPG.currentEntity.startMove(direction.opposite);
		}
		// Otherwise: Stop moving
		else {
			RPG.currentEntity.stopMove(direction);
		}
	}
};



/* ----------------------------------------------------------------------------
 * BINDINGS
 * ------------------------------------------------------------------------- */

// Click an Entity to trigger its click event
RPG.$map.on('click', '.entity', function(event) {
	
	// Do not allow the invisible name container to act as a click target
	if ($(event.target).hasClass('name-container') === false) {
		
		// Trigger the click event of the clicked Entity. Parse the Entity's
		// id from the clicked DOM element's "id" property
		RPG.getEntity('id', $(this).data().id).click();
	}
});

// Desktop (keyboard) bindings
$(document)
	.on('keydown', function(event) {
		RPG.keyDownEvent(event.which);
	})
	.on('keyup', function(event) {
		RPG.keyUpEvent(event.which);
	});

// Mobile bindings
if (window.ontouchstart !== undefined) {
	
	// Prevent mobile scrolling behavior
	$('.button').on('touchmove', function(event) {
		event.preventDefault();
	});
	
	// Emulate arrow keys with arrow buttons
	$('#left-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(37);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(37);
		});
	$('#left-up-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(37);
			RPG.keyDownEvent(38);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(37);
			RPG.keyUpEvent(38);
		});
	$('#up-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(38);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(38);
		});
	$('#right-up-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(38);
			RPG.keyDownEvent(39);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(38);
			RPG.keyUpEvent(39);
		});
	$('#right-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(39);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(39);
		});
	$('#right-down-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(39);
			RPG.keyDownEvent(40);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(39);
			RPG.keyUpEvent(40);
		});
	$('#down-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(40);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(40);
		});
	$('#left-down-button')
		.on('touchstart', function() {
			RPG.keyDownEvent(40);
			RPG.keyDownEvent(37);
		})
		.on('touchend', function() {
			RPG.keyUpEvent(40);
			RPG.keyUpEvent(37);
		});
}



/* ----------------------------------------------------------------------------
 * IGNITE ENGINE
 * ------------------------------------------------------------------------- */

// Updates Entities' sprites 60 frames per second (every 16.7 msecs)
(function animationLoop() {
	
	requestAnimationFrame(animationLoop);
	
	// Update all Entities that have changed since the last update
	for (var id in RPG.changedEntities) {
		if (RPG.changedEntities.hasOwnProperty(id)) {
			RPG.changedEntities[id].updatePosition();
			RPG.changedEntities[id].updateSprite();
		}
	}
	RPG.changedEntities = {};
}());

window.RPG = RPG;

}(jQuery));


/*
 * COLLISION BOUNDS
 */

// CollisionBounds are used during collision detection to quickly reuse the
// same coordinates for comparisons
function CollisionBounds(left, top, right, bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
}

CollisionBounds.prototype.intersects = function(other) {
	return (
		this.left < other.right &&
		this.top < other.bottom &&
		this.right > other.left &&
		this.bottom > other.top
	);
};


/*
 * SPRITESET
 */

// Spriteset objects are used by Entities, to store data about both their
// spritesets' images, and of the individual sprites within those sets
function Spriteset(name) {
	this.name = name;
	this.path = '/images/spritesets/' + this.name + '.gif';
	this.image = new Image();
	
	// Tracks if the spriteset's image AND the image's callbacks have executed
	this.complete = false;
	
	// Functions to be executed once the image has loaded
	this.callbacks = [];
}

// Adds the argument anonymous function to a queue of functions, which will be
// executed when the Spriteset's image has loaded. This queue allows for
// asynchronous image loading
Spriteset.prototype.queueCallback = function(fn) {
	this.callbacks.push(fn);
};

// Begins loading the calling Spriteset. (Sometimes it is necessary to queue up
// at least 1 callback BEFORE loading the spriteset's image [especially in IE8])
Spriteset.prototype.load = function() {
	var self = this;
	this.image.onload = function() {
		
		// The dimensions of an individual sprite
		self.width = this.width / 3;
		self.height = this.height / 4;
		
		// Execute all queued callbacks for this image
		for (var i = 0; i < self.callbacks.length; i += 1) {
			self.callbacks[i]();
		}
		self.complete = true;
	};
	this.image.src = this.path;
};


/*
 * ENTITY
 */

// An Entity is any character in the game. Could be a player, NPC, creature,
// monster, etc. Entities can move around, animate, collide with and interact
// with other Entities
function Entity(properties) {
	
	// SETTABLE
	
	this.name = '';
	this.nametag = true;
	this.spriteset = 'blank';
	this.spriteCol = 1;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.width = 32;
	this.height = 32;
	this.direction = RPG.directions.down;
	this.pixelsPerMove = 1;
	this.moveDelay = 10;
	
	// Override the defaults with the argument properties
	$.extend(this, properties);
	
	// A string argument can be used in place of a "direction" object
	if (typeof this.direction === 'string') {
		this.direction = RPG.directions[this.direction];
	}
	
	// hokeyPokeyDelay, by default, is directly proportional to moveDelay
	if (this.hokeyPokeyDelay === undefined) {
		this.hokeyPokeyDelay = 10 * this.moveDelay;
	}
	
	
	// UNSETTABLE
	
	// A unique identifier. Is set through the makeEntity() function
	this.id = null;
	
	// Used for continuous movement across axes
	this.moving = {
		direction: {
			x: null,
			y: null
		},
		interval: {
			x: null,
			y: null
		}
	};
	
	// Used for back-and-forth "hokey pokey" animation
	this.hokeyPokeyInterval = null;
	this.hokeyPokeyFrame = 0;
	
	// This array stores a reference to each Entity that this one is currently
	// colliding with (to prevent unnecessary "consecutive" collisions)
	this.collisions = [];
	
	// Collision-detection bounds are remembered initially. They are updated
	// after every successful move
	this.bounds = this.getBounds();
	
	
	// ELEMENT / SPRITE
	
	// Create a DOM element and sprite for this Entity
	this.$entity = $(
		'<div class="entity">' +
			'<div class="shadow"></div>' +
			'<div class="sprite"></div>' +
		'</div>'
	).appendTo(RPG.$map);
	this.$sprite = this.$entity.children('.sprite');
	
	// Style the DOM element
	this.$entity.css({
		'width': this.width,
		'height': this.height
	});
	
	
	// NAMETAG
	
	// Add a nametag
	if (this.nametag) {
		this.$nameContainer = $(
			'<div class="name-container">' +
				'<div class="nametag">' + this.name + '</div>' +
			'</div>'
		).appendTo(this.$entity);
		this.$nametag = this.$nameContainer.children('.nametag');
	}
	
	
	// SPRITESET
	
	var self = this;
	
	// Remember this spriteset's name
	var spritesetName = this.spriteset;
	
	// Create and use a new spriteset if this Entity's spriteset isn't
	// currently cached
	if (RPG.spritesets[spritesetName] === undefined) {
		
		// Use this spriteset, and also cache it for future use
		this.spriteset = RPG.spritesets[spritesetName] = new Spriteset(spritesetName);
		
		// Initialize this Entity when its spriteset has loaded
		this.spriteset.queueCallback(function() {
			self.init();
		});
		
		// Now begin loading the Spriteset's image
		this.spriteset.load();
	}
	// Otherwise, use the cached spriteset
	else {
		this.spriteset = RPG.spritesets[spritesetName];
		
		// If the Spriteset exists but its image isn't done loading, initialize
		// this Entity when it's done
		if (!this.spriteset.complete) {
			this.spriteset.queueCallback(function() {
				self.init();
			});
		}
		// If the Spriteset's image HAS loaded, initialize this Entity now
		else if (this.spriteset.complete) {
			this.init();
		}
	}
}

// Is invoked after initialization
Entity.prototype.start = function() {};

// Is invoked when this Entity touches the argument Entity
Entity.prototype.touching = function(entity, direction) {};

// Is invoked when the argument Entity touches with this one
Entity.prototype.touched = function(entity, direction) {};

// Is invoked when clicked-on
Entity.prototype.click = function() {};

// Initializes the Entity once its sprite has loaded
Entity.prototype.init = function() {
	
	// Style it
	this.$sprite.css({
		'left': -(this.width / 2),
		'width': this.spriteset.width,
		'height': this.spriteset.height,
		'background-image': 'url(' + this.spriteset.path + ')'
	});
	
	// Update this Entity's DOM element and sprite now that they're loaded
	this.updatePosition();
	this.updateSprite();
	
	
	// NAMETAG
	
	// Center name above Entity's sprite
	if (this.nametag) {
		this.$nameContainer.css({
			'marginLeft': -(this.$nameContainer.width() / 2),
			'top': -(this.$nameContainer.height() + this.spriteset.height) + this.height
		});
	}
	
	// Invoke start method
	this.start();
};

// Updates DOM element's x, y and z position
Entity.prototype.updatePosition = function() {
	
	var spriteCss = {},
		nameContainerCss = {};
	
	// Update entity position
	this.$entity.css({
		'left': this.x,
		'top': this.y
	});
	
	// Adjust sprite's z-index
	spriteCss.zIndex = this.y + this.height + Math.max(0, ((this.z - 1) * 1000000));
	
	// Nametags must be visible above everything else
	if (this.nametag) {
		nameContainerCss.zIndex = this.y + this.height + Math.max(0, ((this.z - 1) * 1000000)) + 1.0e7;
	}
	
	if (this.z > 1) {
		spriteCss.bottom = Math.max(0, ((this.z - 1) * 64));
		if (this.nametag) {
			nameContainerCss.marginTop = -Math.max(0, ((this.z - 1) * 64));
		}
	}
	
	this.$sprite.css(spriteCss);
	if (this.nametag) {
		this.$nameContainer.css(nameContainerCss);
	}
};

// Updates an Entity's DOM element's sprite according to the Entity's
// current Direction
Entity.prototype.updateSprite = function() {
	this.$sprite.css('background-position',
		(-this.spriteset.width * this.spriteCol) + 'px ' +
		(-this.spriteset.height * this.direction.spritesetRow) + 'px');
};

// Starts a "back-and-forth" hokey pokey animation
Entity.prototype.startHokeyPokey = function() {
	this.incrementFrame();
	var self = this;
	this.hokeyPokeyInterval = setInterval(function() {
		self.incrementFrame();
	}, self.hokeyPokeyDelay);
};

// Stops animation and returns to a "stationary" sprite
Entity.prototype.stopHokeyPokey = function() {
	clearInterval(this.hokeyPokeyInterval);
	this.hokeyPokeyInterval = null;
	
	// Set frame to a "stationary" one if necessary
	if (this.hokeyPokeyFrame === 1 || this.hokeyPokeyFrame === 3) {
		this.incrementFrame();
	}
};

// Moves an Entity's current animation forward by 1 frame
Entity.prototype.incrementFrame = function() {
	
	// A hokey pokey animation has 4 looping frames which must be tracked
	if (this.hokeyPokeyFrame < 3) {
		this.hokeyPokeyFrame += 1;
	} else {
		this.hokeyPokeyFrame = 0;
	}
	
	// "Stationary" frames
	if (this.hokeyPokeyFrame === 0 || this.hokeyPokeyFrame === 2) {
		this.spriteCol = 1;
	}
	// "Left-/right-foot forward" frames
	else if (this.hokeyPokeyFrame === 1) {
		this.spriteCol = 0;
	} else if (this.hokeyPokeyFrame === 3){
		this.spriteCol = 2;
	}
	
	// Remember that this entity needs to have its DOM element updated
	RPG.changedEntities[this.id] = this;
};

// Gets the bounds of an Entity's collision-detection area
Entity.prototype.getBounds = function() {
	return new CollisionBounds(
		this.x,
		this.y,
		this.x + this.width,
		this.y + this.height
	);
};

// NTS: Should be renamed
Entity.prototype.getSpeed = function(direction) {
	return this.pixelsPerMove * direction.sign;
};

// Checks if this Entity will collide with the argument Entity, given the
// bounds this Entity would have after he would move
Entity.prototype.wouldCollideWithEntity = function(direction, bounds, other) {
	
	// If on the same z and bounds overlap: A collision would occur
	if ((this.z === other.z || this.z === 'all' || other.z === 'all') &&
		bounds.intersects(other.bounds)) {
		
		// If not already colliding: Invoke collision method
		if (this.collisions.indexOf(other.id) === -1) {
			
			// Remember that the calling Entity is already colliding with
			// the other Entity
			this.collisions.push(other.id);
			
			// Invoke collision methods
			this.touching(other, direction);
			other.touched(this, direction);
		}
		return true;
	}
	return false;
};

// Checks if this Entity would collide with a nearby unpassable Tile
Entity.prototype.wouldCollideWithTile = function(direction, bounds) {
	
	// If the CURRENT bound of the Entity is not a multiple of 32: It
	// would not collide with a Tile
	if ((this.bounds[direction.side]) % 32 !== 0) {
		return false;
	}
	// Otherwise: There is an opportunity to collide. Check all Tiles
	// within the range of the Entity's width or height
	// NTS: Z shouldn't matter.
	else if (this.z === 1) {
		
		// Determine the range
		var start, end;
		if (direction.axis === 'x') {
			start = Math.floor(bounds.top / 32);
			end = Math.floor(bounds.bottom / 32);
			
			// Accomodate for flooring and keep within the rows' range
			if (end === RPG.currentMap.rows) {
				end -= 1;
			}
		} else if (direction.axis === 'y') {
			start = Math.floor(bounds.left / 32);
			end = Math.floor(bounds.right / 32);
			
			if (end === RPG.currentMap.cols) {
				end -= 1;
			}
		}
		
		var projection = Math.floor(bounds[direction.side] / 32);
		
		// Check each Layer
		for (var l = 0; l < RPG.currentMap.layers.length; l += 1) {
			
			// Check each Tile in the range
			for (var i = 0; i < (end - start + 1); i += 1) {
				
				var row, col;
				if (direction.axis === 'x') {
					row = start + i;
					col = projection;
				} else if (direction.axis === 'y') {
					row = projection;
					col = start + i;
				}
				
				var tile = RPG.currentMap.getTile(l, row, col);
				var tileTraits;
				if (tile !== undefined && tile !== null) {
					tileTraits = getTileset(RPG.currentMap.tileset).getTileTraits(tile);
				}
				
				// If there is an unpassable Tile about to be collided with
				if (tile !== undefined &&
					tile !== null &&
					!tileTraits.passable &&
					bounds.intersects(RPG.currentMap.getTileBounds(row, col))) {
					return true;
				}
			}
		}
		
		// If no unpassable Tile would be collided with
		return false;
	}
};

// Checks if this Entity would collide with any Entity
Entity.prototype.wouldCollideWithSomething = function(direction) {
	
	// Get bounds to modify and recycle
	var bounds = this.getBounds();
	
	// Adjust bounds, for a projection of where the moving Entity WOULD go
	var speed = this.getSpeed(direction);
	bounds[direction.side] += speed;
	bounds[direction.opposite.side] += speed;
	
	// TO-DO
	// Only loop through entities which can collide with this player
	// For instance, players can only run into other players and the map bounds
	// Therefore, we should only loop through entities on the same z-index as
	// the current entity
	
	// Loop through all Entities, and if at least 1 collision would occur:
	// Then an Entity would be collided with
	for (var i = 0; i < RPG.entities.length; i += 1) {
		
		if (RPG.entities[i].id !== this.id &&
			this.wouldCollideWithEntity(direction, bounds, RPG.entities[i])) {
			return true;
		}
	}
	
	if (this.wouldCollideWithTile(direction, bounds)) {
		return true;
	}
	return false;
};

// Start moving in one Direction
Entity.prototype.startMove = function(direction) {
	
	// Convert string arguments to Direction objects
	if (typeof direction === 'string') {
		direction = RPG.directions[direction];
	}
	
	var axis = direction.axis;
	
	// Set direction and update sprite
	this.direction = direction;
	this.moving.direction[axis] = direction;
	this.updateSprite();
	
	// Begin animation
	if (this.hokeyPokeyInterval === null) {
		this.startHokeyPokey();
	}
	
	// Switch on an axis
	if (this.moving.interval[axis] !== null) {
		clearInterval(this.moving.interval[axis]);
	}
	
	// Reset collisions
	this.collisions = [];
	
	// Move on a delay
	var entity = this;
	this.moving.interval[axis] = setInterval(function() {
		
		// If there would be no collision, move and update bounds and sprite
		if (!entity.wouldCollideWithSomething(direction)) {
			
			entity[axis] += entity.pixelsPerMove * direction.sign;
			entity.bounds = entity.getBounds();
			RPG.changedEntities[entity.id] = entity;
		}
	}, this.moveDelay);
};

// Stop moving in one Direction
Entity.prototype.stopMove = function(direction) {
	
	if (direction === 'all') {
		this.stopMove(RPG.directions.left);
		this.stopMove(RPG.directions.up);
	} else {
		
		// Convert string arguments to Direction objects
		if (typeof direction === 'string') {
			direction = RPG.directions[direction];
		}
		var axis = direction.axis;
		var oppositeAxis = direction.oppositeAxis;
		
		// Stop moving on the argument Direction's axis
		this.moving.direction[axis] = null;
		clearInterval(this.moving.interval[axis]);
		
		// Reset collisions
		this.collisions = [];
		
		// If moving on the opposite axis: Set direction to the opposite axis
		if (this.moving.direction[oppositeAxis] !== null) {
			this.direction = this.moving.direction[oppositeAxis];
		}
		
		// If not moving on any axis: End animation
		else if (this.infiniteHokeyPokey !== true) {
			this.stopHokeyPokey();
		}
	}
};


/*
 * PLAYER
 */

function Player(properties) {
	inheritProperties(this, Entity, properties);
}
inheritPrototype(Player, Entity);

// Makes the calling Entity the current one
Player.prototype.switchTo = function() {
	if (this !== RPG.currentEntity) {
		if (RPG.currentEntity !== null) {
			RPG.currentEntity.stopMove('all');
			RPG.currentEntity.$entity.removeClass('current');
		}
		RPG.currentEntity = this;
		RPG.currentEntity.$entity.addClass('current');
	}
};

/*
 * NPC
 */



/*
 * CRITTER
 */

function Critter(properties) {
	inheritProperties(this, Entity, properties);
}
inheritPrototype(Critter, Entity);


/*
 * MAP BOUNDARIES
 */

function MapBound(properties) {
	inheritProperties(this, Entity, properties);
}
inheritPrototype(MapBound, Entity);

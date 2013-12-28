(function($, RPG) {

// Require both a map and a tileset before continuing
$.getJSON('res/maps/market.json', function(mapData) {
$.getJSON('res/tilesets/market-street.json', function(tilesetData) {

addToTilesets(objectToTileset(tilesetData));

// Create a map
RPG.currentMap = objectToMap(mapData);
RPG.currentMap.drawMap();

// Create some default Entities
var defaultEntities = ['caleb', 'mona', 'chan', 'terbun', 'piggie',
'blondy', 'sky', 'gren', 'teal'];

for (var i = 0; i < 27; i += 1) {
	
	RPG.makePlayer({
		spriteset: defaultEntities[i % 9],
		name: defaultEntities[i % 9],
		x: (30 * i) + 90,
		y: (10 * i) + 180,
		z: 1,
		width: 16,
		height: 16,
		moveDelay: 2 + (2 * i),
		hokeyPokeyDelay: 100 + (2 * i),
		start: function() {
			
			// Starts movement, then recursively calls itself
			// Basically a stress test
			this.goNuts = function() {
				this.moveRandomly();
				var self = this;
				this.goNutsTimeout = setTimeout(function() {
					self.stopMove(self.direction);
					self.goNuts();
				}, 3000);
			};
			
			if (this !== RPG.currentEntity) {
				this.goNuts();
			}
		},
		touched: function(entity, direction) {
			this.startMove(direction);
			var self = this;
			setTimeout(function() {
				self.stopMove(direction);
			}, 2000);
		},
		moveRandomly: function(){ console.log('kekekekekeke'); }
	});
}

RPG.makeAnimal({
	spriteset: 'gully',
	name: 'gully',
	x: 240,
	y: 240,
	z: 2,
	width: 16,
	height: 16,
	infiniteHokeyPokey: true,
	start: function() {
		this.startHokeyPokey();
	}
});

RPG.makeAnimal({
	spriteset: 'blaster',
	name: 'blaster',
	x: 300,
	y: 400,
	z: 1,
	width: 48,
	height: 48,
	moveDelay: 1,
	hokeyPokeyDelay: 100,
	switchTo: function(){}
});

// Assign switchTo() to the click() method of all Entities
// created before this line
for (var i = 0; i < RPG.getEntities().length; i += 1) {
	RPG.getEntity('id', i).click = function() {
		this.switchTo();
	};
}

RPG.makeAnimal({
	spriteset: 'bessy',
	name: 'bessy',
	x: 119,
	y: 230,
	z: 1,
	moveDelay: 30,
	direction: 'right',
	start: function() {
	
		// Starts and stops movement, then recursively calls itself
		this.graze = function() {
			this.moveRandomly();
			var self = this;
			this.grazeTimeout = setTimeout(function() {
				self.stopMove(self.direction);
				self.grazeTimeout = setTimeout(function() {
					self.graze();
				}, 1000);
			}, 1000);
		};
	
		//this.graze();
	},
	touched: function(entity, direction) {
		//console.log('moo');
	},
	click: function() {
		clearTimeout(this.grazeTimeout);
		this.stopMove('all');
		this.switchTo();
	},
	moveRandomly: function(){},
	switchTo: function(){}
});

// Make kakaw X times
for (var i = 0; i < 7; i += 1) {
	
	RPG.makeAnimal({
		spriteset: 'kakaw',
		name: 'kakaw',
		x: 32 + Math.floor(Math.random() * 500),
		y: 32 + Math.floor(Math.random() * 500),
		z: 2,
		width: 16,
		height: 16,
		moveDelay: 15,
		infiniteHokeyPokey: true,
		start: function() {
			//this.continuouslyMoveRandomly(1250);
		},
		touched: function(entity, direction) {
			//console.log('ka-KAW!!');
			this.stopFlying();
			this.stopContinuouslyMoving();
			this.continuouslyMoveRandomly(1250);
		},
		click: function() {
			this.stopFlying();
			this.stopContinuouslyMoving();
			this.switchTo();
		},
		stopFlying: function() {
			clearTimeout(this.circleFlyTimeout);
			clearInterval(this.circleFlyInterval);
			this.stopMove('all');
		},
		// Moves in random directions on an timeout
		continuouslyMoveRandomly: function(delay) {
			this.moveRandomly();
			var self = this;
			this.moveRandomlyTimeout = setTimeout(function() {
				self.stopMove(self.direction);
				self.continuouslyMoveRandomly(delay);
			}, delay);
		},
		stopContinuouslyMoving: function() {
			clearTimeout(this.moveRandomlyTimeout);
		},
		moveRandomly: function(){},
		switchTo: function(){}
	});
	
}

// Give all Entities (created before this line) some methods
for (var i = 0; i < RPG.getEntities().length; i += 1) {
	
	var entity = RPG.getEntity('id', i);
	
	entity.killMe = 'lol';
	
	// Starts moving this Entity in a random cardinal direction
	entity.moveRandomly = function() {
		entity.startMove(directionNames[Math.floor(Math.random() * 4)]);
	};
	
	// Makes this Entity the current entity, if not already it
	entity.switchTo = function() {
		if (this !== RPG.currentEntity) {
			if (RPG.currentEntity !== null) {
				RPG.currentEntity.stopMove('all');
				RPG.currentEntity.$entity.removeClass('current');
			}
			RPG.currentEntity = this;
			RPG.currentEntity.$entity.addClass('current');
		}
	};
}

// Create the left, top, right, and bottom map bounds
(function(){
	var mapW = (RPG.currentMap.cols * 32);
	var mapH = (RPG.currentMap.rows * 32);

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
}());

// Set the current entity
RPG.getEntity('name', 'caleb').switchTo();

// Hide the address bar on Mobile Safari
window.scrollTo(0, 1);

});
});

}(jQuery, RPG));
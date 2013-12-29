// Import jQuery, the RPG module
(function($, RPG) {

// Require both a map and a tileset before continuing
$.getJSON('/maps/garden-maze.json', function(mapData) {
$.getJSON('/tilesets/garden-maze.json', function(tilesetData) {

// Make a Tileset and make it accessible to Maps
addToTilesets(objectToTileset(tilesetData));

// Make a Map
//RPG.currentMap = objectToMap(mapData);
//RPG.currentMap.drawMap();

RPG.currentMap = objectToMap(mapData);
RPG.currentMap.drawMap();

// Set the boundaries of the map
RPG.makeMapBounds();

RPG.makePlayer({
	name: 'Caleb',
	spriteset: 'caleb',
	x: 0,
	y: 14,
	z: 1,
	width: 16,
	height: 16,
	moveDelay: 10,
	click: function() {
		this.switchTo();
	}
});

RPG.makePlayer({
	name: 'Jackson',
	spriteset: 'jackson',
	x: 0,
	y: 84,
	z: 1,
	width: 16,
	height: 16,
	moveDelay: 10,
	click: function() {
		this.switchTo();
	}
});

RPG.makeCritter({
	name: 'Vicious Rodent',
	spriteset: 'wabbit',
	spriteCol: 0,
	direction: 'right',
	x: 465,
	y: 14,
	z: 1,
	width: 16,
	height: 16,
	moveDelay: 20,
	touching: function() {
		RPG.currentEntity.stopMove('all');
	}
});

var wabbit = RPG.getEntity('name', 'Vicious Rodent');

var hopDuration = 1000;
var direction = 'right';

setTimeout(function hop() {
	wabbit.startMove(direction);
	if (direction === 'right') {
		direction = 'left';
	} else if (direction === 'left') {
		direction = 'right';
	}
	setTimeout(hop, hopDuration);	
}, hopDuration);

RPG.getEntity('name', 'Caleb').switchTo();



});
});

}(jQuery, RPG));

// Hide the address bar in Mobile Safari
window.scrollTo(0, 1);

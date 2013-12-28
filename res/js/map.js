(function($) {

var $$ = {};
$$.map = $('#map');
$$.layers = $('#layers');

// NTS: I cheated here
var CollisionBounds = function(left, top, right, bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
}

// All Tilesets available to scripts are stored here
// These Tilesets are derived from .json files in res/tilesets
window.tilesets = [];

// Adds a Tileset to the tilesets array (if it is not already there)
window.addToTilesets = function(tileset) {
	if ($.inArray(tileset, tilesets) === -1) {
		tilesets.push(tileset);
	}
}

// Loads a Tileset from localStorage with the argument name
window.loadTileset = function(name) {
	return objectToTileset(JSON.parse(localStorage.getItem('tileset-' + name)));
}

// Gets a Tileset by name
// Used by Maps, for referencing their respective Tileset
window.getTileset = function(name) {
	for (var i = 0; i < tilesets.length; i += 1) {
		if (tilesets[i].name === name) {
			return tilesets[i];
		}
	}
}

// Tiles are used by Maps, for design and player interactivity
// A Tile's row/column refers to row/column of a Tileset; from this row/column,
// a Tile derives its passability and above properties, and its graphic
function Tile(row, col) {
	this.row = row;
	this.col = col;
}
$.extend(Tile.prototype, {
	
	clone: function() {
		return new Tile(this.row, this.col);
	}
});

// Returns a 2D array
// Optionally passing a Tileset fills the array with its default Tile
// Otherwise the array is filled with null values
function makeTiles(rows, cols, tileset) {
	
	var tiles = [];
	for (var r = 0; r < rows; r += 1) {
		tiles[r] = [];
		for (var c = 0; c < cols; c += 1) {
			
			// When making layers1+
			if (typeof tileset === 'undefined') {
				tiles[r][c] = null;
			}
			// When making layer0
			else {
				tiles[r][c] = new Tile(tileset.defaultRow, tileset.defaultCol);
			}
		}
	}
	return tiles;
}

// Returns a 3D array; in other words, "layers" of Tiles
// layer0 uses the argument Tileset's default Tile
// layers1+ are blank
// Basically, creates ground (layer0) and air (layers1+)
function makeBlankLayers(amount, rows, cols, tileset) {
	
	var layers = [];
	for (var l = 0; l < amount; l += 1) {
		
		if (l !== 0) {
			layers[l] = makeTiles(rows, cols);
		}
		else {
			layers[l] = makeTiles(rows, cols, tileset);
		}
	}
	return layers;
}

// TileTraits objects are used by a Tileset to standardize the traits of
// a particular Tile
function TileTraits(passable, above) {
	
	// Determines if passible by Entities at z <= 1
	this.passable = passable;
	
	// Determines if above Entities at z <= 1
	this.above = above;
}
TileTraits.prototype.clone = function() {
	return new TileTraits(this.passable, this.above);
};

// Returns an array of TileTraits with default values
function makeDefaultTileTraits(rows, cols) {
	
	var tileTraits = [];
	for (var r = 0; r < rows; r += 1) {
		tileTraits[r] = [];
		for (var c = 0; c < cols; c += 1) {
			
			tileTraits[r][c] = new TileTraits(true, false);
		}
	}
	return tileTraits;
}

// Tilesets standardize the traits of all Tiles (e.g. being passible to, or
// above, Entities), for all Tiles using a certain tileset graphic
function Tileset(name, tileTraits, defaultRow, defaultCol) {
	
	this.name = name;
	this.path = 'res/img/tilesets/' + name + '.png';
	
	if (typeof tileTraits !== 'undefined') {
		
		this.tileTraits = tileTraits;
		
		this.rows = this.tileTraits.length;
		this.cols = this.tileTraits[0].length;
	}
	// If no TileTraits are passed:
	// Make TileTraits for each row and column of the tileset sprite
	// This doesn't really work since loading is too slow
	else {
		var image = new Image(),
			self = this;
		image.onload = function() {
			self.rows = this.height / 32;
			self.cols = this.width / 32;
			
			self.tileTraits = makeDefaultTileTraits(self.rows, self.cols);
		};
		image.src = this.path;
	}
	
	this.defaultRow = defaultRow || 0;
	this.defaultCol = defaultCol || 0;
}
extendPrototype(Tileset, {
	
	// Returns the traits of the argument Tile
	getTileTraits: function(tile) {
		return this.tileTraits[tile.row][tile.col];
	},
	
	clone: function() {
		
		var clonedTileTraits = [];
		for (var r = 0; r < this.rows; r += 1) {
			clonedTileTraits[r] = [];
			for (var c = 0; c < this.cols; c += 1) {
				
				clonedTileTraits[r][c] = this.tileTraits[r][c].clone();
			}
		}
		
		return new Tileset(
			this.name,
			clonedTileTraits,
			this.defaultRow,
			this.defaultCol
		);
	}
});

// Converts an Object to a Tileset
// Used after decoding a JSON-encoded Map object
function objectToTileset(object) {
	
	// Prepare each TileTraits
	var preparedTileTraits = [];
	for (var r = 0; r < object.rows; r += 1) {
		preparedTileTraits[r] = [];
		for (var c = 0; c < object.cols; c += 1) {
			
			var tileTraits = object.tileTraits[r][c];
			preparedTileTraits[r][c] = new TileTraits(
				tileTraits.passable,
				tileTraits.above
			);
		}
	}
	
	// Prepare the Tileset
	return new Tileset(
		object.name,
		preparedTileTraits,
		object.defaultRow,
		object.defaultCol
	);
}


/*
 * MAP
 */

function Map(name, tileset, layers) {
	
	this.name = name;
	
	// The name of the Tileset this Map references
	this.tileset = tileset;
	
	// This is a 3D array of Tiles
	this.layers = layers;
	
	// These are constants
	this.rows = this.layers[0].length;
	this.cols = this.layers[0][0].length;
}
$.extend(Map.prototype, {
	
	clone: function() {
		
		var clonedLayers = [];
		for (var l = 0; l < this.layers.length; l += 1) {
			
			var clonedTiles = [];
			for (var r = 0; r < this.layers[l].length; r += 1) {
				clonedTiles[r] = [];
				for (var c = 0; c < this.layers[l][r].length; c += 1) {
					
					var tile = this.layers[l][r][c];
					
					if (tile !== null) {
						clonedTiles[r][c] = tile.clone();
					} else {
						clonedTiles[r][c] = null;
					}
				}
			}
			
			clonedLayers[l] = clonedTiles;
		}
		
		return new Map(
			this.name,
			this.tileset,
			clonedLayers
		);
	},
	
	// Draws this map using new DOM elements
	drawMap: function() {
		
		$$.map.css({
			'width': this.cols * 32 + 'px',
			'height': this.rows * 32 + 'px'
		});
		
		// Clear the old map
		$$.layers.empty();
		
		for (var l = 0; l < this.layers.length; l += 1) {
			
			$('<div />')
			.prop({
				'class': 'layer',
				'id': 'layer-' + l
			})
			.css({
				// Only used by mapmaker
				'z-index': l
			})
			.appendTo($$.layers);
						
			for (var r = 0; r < this.rows; r += 1) {
				for (var c = 0; c < this.cols; c += 1) {
					
					var tile = this.getTile(l, r, c);
					
					if (tile !== null) {
						var tileTraits = getTileset(this.tileset).getTileTraits(tile);
					}
					
					$('<div />')
					.prop({
						'class': 'tile',
						'id': l + '-' + r + '-' + c
					})
					.appendTo('#layer-' + l);
					
					var $tile = $(tileID(l, r, c));
					
					// Assign CSS styles to this tile element
					
					// Assign any would-be Tiles a static position
					var css = {
						'top': (r * 32) + 'px',
						'left': (c * 32) + 'px'
					};
					
					// If there actually is a Tile here
					if (tile !== null) {
						css['background-position'] =
							(-tile.col * 32) + 'px ' +
							(-tile.row * 32) + 'px';
						
						// Only apply z-indexing to layers1+
						if (l >= 1) {
							
							var zIndex = (r * 32) + 32;
							css['z-index'] = zIndex;
							
							// If this Tile is passable and non-above:
							// Lower it underfoot
							if (tileTraits.passable && !tileTraits.above) {
								css['z-index'] -= 32;
							}
						
							// If this Tile could be a stem:
							// Raise all northern, consecutive, above Tiles (if
							// any) to the stem's z-index
							if (!tileTraits.above) {
								this.raiseAboveTiles(l, r - 1, c, zIndex);
							}
						
							// If this Tile is above:
							// Raise this Tile's z-index such that it is
							// higher than any Entity at z: 1
							else {
								css['z-index'] += 100000;
							}
						}
						
						// Add classes for styling
						var classes = ['visible'];
						if (tileTraits.passable) {
							classes.push('passable');
						}
						if (tileTraits.above) {
							classes.push('above');
						}
						$tile.addClass(classes.join(' '));
					}
					
					// Apply styling
					$tile.css(css);
				}
			}
		}
		
		$$.layers
		.find('.tile.visible')
		.css({
			'background-image': 'url(' + getTileset(this.tileset).path + ')'
		});
	},
	
	// Raises the z-index of the argument above Tile and consecutive above
	// Tiles to the north
	raiseAboveTiles: function(layer, row, col, amount) {
		
		// If the argument Tile exists and is above:
		// Raise it to the argument amount
		var tile = this.getTile(layer, row, col);
		if (typeof tile !== 'undefined' &&
			tile !== null &&
			getTileset(this.tileset).getTileTraits(tile).above
		) {
			$(tileID(layer, row, col)).css('z-index', amount);
			
			// Recursively raise the north Tile
			this.raiseAboveTiles(layer, row - 1, col, amount);
		}
	},
	
	// Gets the Tile at the argument layer, row, and column
	getTile: function(layer, row, col) {
		
		// If arguments are out of bounds:
		// Return undefined
		if (layer < 0 ||
			row < 0 || col < 0 ||
			row > (this.rows - 1) || col > (this.cols - 1)
		) {
			return;
		}
		
		return this.layers[layer][row][col];
	},
	
	// Returns the bounds a Tile would have at the argument row and column
	getTileBounds: function(row, col) {
		var x = col * 32,
			y = row * 32;
		return new CollisionBounds(
			x,
			y,
			x + 32,
			y + 32
		);
	}
});


function tileID(layer, row, col) {
	return '#' + layer + '-' + row + '-' + col;
}

function getTileElement(layer, row, col) {
	return $('#' + layer + '-' + row + '-' + col);
}


// Creates a blank Map
function makeBlankMap(name, tileset, layers, rows, cols) {
	return new Map(
		name,
		tileset,
		makeBlankLayers(layers, rows, cols, getTileset(tileset))
	);
}

// Converts an Object to a Map
// Used after decoding a JSON-encoded Map object
function objectToMap(object) {
	
	// Prepare each layer
	var preparedLayers = [];
	for (var l = 0; l < object.layers.length; l += 1) {
		
		// Prepare each row and column of Tiles
		var preparedTiles = [];
		for (var r = 0; r < object.rows; r += 1) {
			preparedTiles[r] = [];
			for (var c = 0; c < object.cols; c += 1) {
				
				var tile = object.layers[l][r][c];
				if (tile !== null) {
					preparedTiles[r][c] = new Tile(
						tile.row,
						tile.col
					);
				} else {
					preparedTiles[r][c] = null;
				}
			}
		}
		
		preparedLayers[l] = preparedTiles;
	}
	
	return new Map(
		object.name,
		object.tileset,
		preparedLayers
	);
}

// Returns a Map of the given JSON string
function parseMapJSON(json) {
	var object = JSON.parse(json);
	if (object === null) {
		// Handle null values
		return null;
	} else {
		// Otherwise, parse object if possible
		return objectToMap(object);
	}
}

// Export functions to global namespace
window.Tile = Tile;
window.makeTiles = makeTiles;
window.makeBlankLayers = makeBlankLayers;
window.TileTraits = TileTraits;
window.makeDefaultTileTraits = makeDefaultTileTraits;
window.Tileset = Tileset;
window.objectToTileset = objectToTileset;
window.Map = Map;
window.tileID = tileID;
window.makeBlankMap = makeBlankMap;
window.objectToMap = objectToMap;
}(jQuery));
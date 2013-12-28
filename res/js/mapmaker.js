(function($) {
window.onload = function() {


/*
 * CACHED PAGE ELEMENTS
 */

var $$ = {};

// Page sections
$$.mapName = $('#map-name');
$$.layers = $('#layers');
$$.spriteMap = $('#sprite-map');
$$.tileset = $('#tileset');
$$.undoHistoryMenu = $('#undo-history-menu');
$$.undoHistoryList = $('#undo-history-list');
$$.JSONMenu = $('#json-menu');
$$.tilesetMenu = $('#tileset-menu');
$$.layerPane = $('#layer-pane');
$$.layerList = $('#layer-list');
$$.map = $('#map');

// Top controls
$$.newMap = $('#new-map');
$$.loadMap = $('#load-map');
$$.saveMap = $('#save-map');
$$.saveMapAs = $('#save-map-as');
$$.deleteMap = $('#delete-map');
$$.exportJSON = $('#export-json');
$$.tilesetMenuOpen = $('#tileset-menu-open');
$$.undo = $('#undo');
$$.redo = $('#redo');
$$.undoHistory = $('#undo-history');
$$.clearLocalStorage = $('#clear-localstorage');

// Tileset Menu
$$.tilesetToolbar = $('#tileset-toolbar');
$$.saveTileset = $('#save-tileset');
$$.switchTileset = $('#switch-tileset');
$$.setTileset = $('#set-tileset');
$$.editingTilesetContainer = $('#editing-tileset-container');

// Layer controls
$$.addLayer = $('#add-layer');
$$.deleteLayer = $('#delete-layer');
$$.copyLayer = $('#copy-layer');
$$.moveLayer = $('#move-layer');
$$.layerSettings = $('#layer-settings');
$$.toggleContrastLayers = $('#toggle-contrast-layers');
$$.toggleEraser = $('#toggle-eraser');

// Misc
$$.grids = $('.grid');



/*
 * EDITOR PARAMETERS
 */

var params = {};

// Set some default values
params.drawing = false;

// Experimental:
var defaultTilesetNames = ['grassland', 'desert', 'market-street', 'desert-town'];

var defaultTilesets = {
	'grassland': new Tileset('grassland', makeDefaultTileTraits(16, 8)),
	'desert': new Tileset('desert', makeDefaultTileTraits(19, 8), 0, 1),
	'market-street': new Tileset('market-street', makeDefaultTileTraits(47, 8)),
	'desert-town': new Tileset('desert-town', makeDefaultTileTraits(22, 8))
};

// Initialize variables for storing the history of maps
var mapHistory = [];
params.maxUndos = null;

// The Map currently being edited
var currentMap;



/*
 * SETTINGS
 */

var settings = {

	// The name of the Map last worked-on
	// Used on startup to load that Map automatically
	'current': null,
	
	// Index of the last layer worked-on
	'currentLayer': 1,
	
	// Name of the last Tileset used
	'currentTileset': 'grassland',
	
	// An array of name strings corresponding to the JSON-encoded Maps saved
	// to localStorage
	'maps': [],
	
	// An array of name strings corresponding to the JSON-encoded Tilesets saved
	// to localStorage
	'tilesets': [],
	
	'contrastLayer': false,
	
	'eraser': false
}

function saveSettings() {
	save('settings', settings);
}

function getCurrentTileset() {
	return getTileset(settings.currentTileset);
}


/*
 * SAVING / LOADING TILESETS
 */

// Saves a Tileset to localStorage with a "tileset-" prefix
function saveTileset(tileset) {
	save('tileset-' + tileset.name, tileset);
}

// Saves a Tileset and updates settings (to remember that it exists)
function saveTilesetAndUpdateSettings(tileset) {
	saveTileset(tileset);
	if ($.inArray(tileset.name, settings.tilesets) === -1) {
		settings.tilesets.push(tileset.name);
	}
}

// Loads a Tileset and updates settings (to remember that it exists)
function loadTilesetAndUpdateSettings(name) {
	addToTilesets(loadTileset(name));
	if ($.inArray(name, settings.tilesets) === -1) {
		settings.tilesets.push(name);
	}
}

// TESTING: Set current tileset
function setCurrentTileset(name) {
	settings.currentTileset = name;
	$$.tileset.prop('src', getCurrentTileset().path);
}


/*
 * MISC HELPER FUNCTIONS
 */

// Rounds to nearest multiple of n
function nearest(num, n) {
	return (n === 0) ? 0 : Math.round(num / n) * n;
}

// Snap the given number to the grid
function snap(num) {
	return nearest(num, 32);
}

// Gets x/y offset from the given element
function getOffset($elem, event) {
	var offset = $elem.offset(),
		offsetX = event.pageX - offset.left,
		offsetY = event.pageY - offset.top;
	return {
		x: offsetX,
		y: offsetY
	};
}

// Gets a tile's position given the argument position (in pixels)
function getGridPosition(x, y) {
	return {
		row: Math.floor(x / 32),
		col: Math.floor(y / 32)
	};
}


/*
 * MAP
 */

// Give Map functions for editing
$.extend(Map.prototype, {
	
	// Changes Tile(s) starting at the argument layer, row and column,
	// continuing until the entire current selection has been applied
	changeTiles: function(layer, row, col) {
		
		var selection = $$.spriteMap.data('selection');
		
		// If rows and columns selected are non-negative (fix that bug...)
		if (selection.selected && selection.rows > 0 && selection.cols > 0) {
			for (var r = 0; r < selection.rows; r += 1) {
				
				// Ensure tiles aren't placed beyond the map's x-edge
				if ((row + r) < this.rows) {
					for (var c = 0; c < selection.cols; c += 1) {
					
						// Ensure tiles aren't placed beyond the map's y-edge
						if ((col + c) < this.cols) {
							
							var tile;
							
							// If currently erasing
							if (settings.eraser) {
								tile = null;
							}
							
							// If placing a Tile
							else {
								tile = new Tile(
									selection.startRow + r,
									selection.startCol + c
								);
							}
							
							// Insert the Tile (or null value) into this Map
							this.layers[layer][row + r][col + c] = tile;
							
							// Redraw the Tile's element
							var $tile = $(tileID(layer, row + r, col + c));
							if (tile !== null) {
								$tile.css({
									'background-image':
										'url(' + getTileset(this.tileset).path +
											')',
									'background-position':
										(-tile.col * 32) + 'px ' +
										(-tile.row * 32) + 'px'
								});
							} else {
								$tile.css({
									'background-image': ''
								});
							}
						}
					}
				}
			}
		}
	},
	
	// Draws a single Tile at the argument layer, row and col
	drawTile: function(layer, row, col) {
		
		var tile = this.layers[layer][row][col];
		var $tile = $(tileID(layer, row, col));
		
		if (tile === null) {
			$tile.css({
				'background-image': ''
			});
		} else {
			$tile.css({
				'background-image': 'url(' +
					getTileset(this.tileset).getPath() + ')',
				'background-position':
					(-tile.col * 32) + 'px ' +
					(-tile.row * 32) + 'px'
			});
		}
	},
	
	// Creates contrast between the current layer and those below and above it,
	// by applying dark overlays and adding opacity, respectively */
	contrastLayers: function() {
	
		// Refresh classes
		$('.layer').removeClass('darker faded');
	
		// If "contrast" input is ticked
		if (settings.contrastLayers === true) {
			
			var currentIndex = settings.currentLayer;
			var maxIndex = this.layers.length - 1;
			
			// Darken the layer directly below the current layer
			if (currentIndex > 0) {
				$('#layer-' + (currentIndex - 1)).addClass('darker');
			}
			
			// Make tiles in layers above the current layer transparent
			if (currentIndex < maxIndex) {
				
				// Iterate through each layer above the current
				for (var i = 0; i < (maxIndex - currentIndex); i += 1) {
					
					// Fade every tile in the above layer
					$('#layer-' + (currentIndex + 1 + i)).addClass('faded');
				}
			}
		}
	},
	
	// Inserts the argument Layer to the layers array at the argument index
	// Any Layers at indices above it will move to 1 higher index
	addLayer: function(index, layer) {
		this.layers.splice(index, 0, layer);
	},
	
	// Splices the Layer from the layers array at the argument index
	// All Layers at indices above it will move to 1 lower index
	deleteLayer: function(index) {
		this.layers.splice(index, 1);
	}
});


/*
 * SELECTION
 */

// Constructor; for selection boxes
function Selection($grid) {
	
	// Pixels
	this.startX = null;
	this.startY = null;
	this.lockX = null;
	this.lockY = null;
	this.lockWidth = null;
	this.lockHeight = null;
	
	// Rows & columns
	this.startRow = null;
	this.startCol = null;
	this.rows = null;
	this.cols = null;
	
	// State
	this.dragging = false;
	this.selected = false;
	
	// All grids get a selection outline that follows the mouse
	this.$selOutline = $('<div class="selection outline"></div>').appendTo($grid);
	
	// Whether the hovered-over tile is selectable or not
	if ($grid.hasClass('selectable') === true) {
		// If so, add the selection div
		this.$selBox = $('<div class="selection box"></div>').appendTo($grid);
	}
}

// Get the given grid element's selection object
function getSelection($grid) {
	return $.data($grid[0], 'selection');
}

// Each grid maintains its own selection properties
$$.grids.each(function(e, grid) {
	var $grid = $(grid);
	var selection = new Selection($grid);
	$.data($grid[0], 'selection', selection);
});


/*
 * OUTLINE/SELECTION BOXES
 */

// On mousedown, records the starting position, hides the outline, and creates
// a draggable selection box
$$.grids.on('mousedown', function(event) {
	var $grid = $(this);
	var selection = getSelection($grid);
	var $selBox = selection.$selBox;
	var $selOutline = selection.$selOutline;
	
	// Get the mouses' offset from the tileset
	var offset = getOffset($grid, event);
	
	// Record starting position in pixels
	selection.selected = false;
	selection.startX = offset.x - 16;
	selection.startY = offset.y - 16;
	
	// Record starting row/column and amount of rows/columns
	selection.startRow = Math.floor(offset.y / 32);
	selection.startCol = Math.floor(offset.x / 32);
	selection.rows = 1;
	selection.cols = 1;
	
	// Initiate dragging
	selection.dragging = true;
		
	$selOutline.addClass('visible');
	// Only show selection box if the grid is selectable
	if ($grid.hasClass('selectable') === true) {
		// Hide outline and move selection to the outline's position
		$selBox.css({
			top: $selOutline.css('top'),
			left: $selOutline.css('left'),
			width: 32,
			height: 32
		});
		$selBox.addClass('visible');
	}
	
	// Prevent interference from other mousedown events
	event.preventDefault();
});

// When dragging the mouse over a grid, resizes the selection.
// When hoving the mouse over a grid, repositions the outline.
$$.grids.on('mousemove', function(event) {
	var $grid = $(this);
	var selection = getSelection($grid);
	var $selBox = selection.$selBox;
	var $selOutline = selection.$selOutline;
	
	// Store the current x/y offset of the cursor relative to the top
	// of the tileset
	var offset = getOffset($grid, event);
	
	// If user is holding down the mouse button (is dragging)
	if (selection.dragging === true && $grid.hasClass('selectable') === true) {
		
		// Calculate the new width/height, according to cursor's new position
		// relative to its starting position
		var width = snap(Math.abs(offset.x - selection.startX));
		var height = snap(Math.abs(offset.y - selection.startY));
		
		// Only run other calculations if width/height has changed
		if (width !== selection.lockWidth || height !== selection.lockHeight) {
			
			selection.lockWidth = width;
			selection.lockHeight = height;
			selection.hasChanged = true;
			
			// Hide selection outline (the selection box takes its place)
			$selOutline.removeClass('visible');
			
			// Resize the selection
			$selBox.css({
				width: width,
				height: height
			});
				
			// If the user moves his cursor left or up from the starting position
			if (offset.x < selection.startX) {
				$selBox.css({
					left: snap(parseFloat($selOutline.css('left')) - width),
				});
			}
			if (offset.y < selection.startY) {
				$selBox.css({
					top: snap(parseFloat($selOutline.css('top')) - height),
				});
			}
		
			// Save the updated starting row/column and amount of rows/columns
			selection.startRow = Math.floor(parseFloat($selBox.css('top')) / 32);
			selection.startCol = Math.floor(parseFloat($selBox.css('left')) / 32);
			selection.rows = Math.floor(height / 32);
			selection.cols = Math.floor(width / 32);
		
		} else {
			selection.hasChanged = false;
		}
		
	// If user is hovering
	} else {
		
		// Match selection outline size to that of the tile chooser
		if ($grid.prop('id') === 'map') {
			var $selectionBox = $$.spriteMap.children('.selection.box');
			$selOutline.css({
				// Because we set box-sizing, we need to get the outer width/height
				width: $selectionBox.outerWidth(),
				height: $selectionBox.outerHeight()
			});
		}
		
		// The selection coordinates after snapping to grid
		var lockX = snap(offset.x - 16);
		var lockY = snap(offset.y - 16);
		
		// Only run other calculations if x/y has changed
		if (lockX !== selection.lockX || lockY !== selection.lockY) {
			
			selection.lockX = lockX;
			selection.lockY = lockY;
			selection.hasChanged = true;
			
			// Reposition the outline relative to the mouse's position
			$selOutline.addClass('visible');		
			$selOutline.css({
				top: selection.lockY,
				left: selection.lockX
			});
		
		} else {
			selection.hasChanged = false;
		}
	}
});

// If the user releases the mouse key (stops dragging)
$$.grids.on('mouseup', function(event) {
	var $grid = $(this);
	var selection = getSelection($grid);
	selection.dragging = false;
	selection.lockX = null;
	selection.lockY = null;
	selection.lockWidth = null;
	selection.lockHeight = null;
	if (selection.rows === 0 || selection.cols === 0) {
		// Deselect selection if there is none
		var $selection = $grid.children('.selection');
		$selection.removeClass('visible');
		// Reset selection box to the default tile size
		$selection.css({
			width: 32,
			height: 32
		});	
	} else {
		// Keep track of whether something is selected or not
		selection.selected = true;
	}
});

// Remove the selection outline when the mouse leaves the tileset
$$.grids.on('mouseleave', function(event) {
	var $grid = $(this);
	$grid.trigger('mouseup');
	// Only hide outline if there is no selection
	$grid.children('.selection.outline').removeClass('visible');	
});


/*
 * MAP EDITING
 */

// This is used to detect when dragging over the map
var tileEditor = {
	dragging: false
};

// Detects the row/column of the tile div called upon and changes them
// (according to the currently-selected layer and tile selection)
function changeTilesAtElement($tile) {
		
	// Determine row/column based on the tile's ID
	var rowCol = $tile.attr('id').split('-');
	var row = parseFloat(rowCol[1]);
	var col = parseFloat(rowCol[2]);
	
	currentMap.changeTiles(settings.currentLayer, row, col);
}

// On mousedown, the tile hovered-over will be changed; the initial mousedown
// also initiates dragging for the mousemove event
$$.map.on('mousedown', function(event) {
	var $tile = $(event.target);
	var selection = getSelection($$.map);
	
	// Save old version of map to history
	saveToHistory('Tile(s) were changed.');
	changeTilesAtElement($tile);
	
	// Initiate dragging
	tileEditor.dragging = true;
	
	// Prevent any default mouse behavior
	event.preventDefault();
});

// On mousemove, if user is dragging, continuously detects and changes the
// tile presently being moved over
$$.map.on('mousemove', function(event) {
	var $tile = $(event.target);
	var selection = getSelection($$.map);
	
	// ...and if the user is holding down the mouse button
	if (tileEditor.dragging === true && selection.hasChanged === true) {
							
		if (params.drawing === false) {
			
			params.drawing = true;
			changeTilesAtElement($tile);
			
			setTimeout(function() {
				params.drawing = false;
			}, 20);
			
		}
		
	}
});

// On mouseup, stops dragging
$$.layers.on('mouseup', '.tile', function() {
	tileEditor.dragging = false;
});


/*
 * EDITING TOOLS
 */

// Binds a SHIFT+KEY shortcut that calls a function
function bindShortcut(key, fn, arg) {
	$(document).on('keydown', function(e) {
		if (e.shiftKey && e.which === key) {
			e.preventDefault();
			fn(arg);
		}
	});
}

function bounceControl($button) {
	
	// Clone parameters object just to be safe
	var increment = 2,
		duration = 75,
		bounces = 4;
	
	// The controls starts by bouncing up
	var direction = 1;
	
	// Animate in one direction
	function animate() {
		
		// Bounce button up and down
		if (bounces !== 0) {
			
			$button.stop().animate({
				'top': (increment * direction)
			}, duration, function() {
				direction *= -1;
				bounces -= 1;
				// Animate until the there are no bounces remaining
				animate();
			});
		}
		// Revert button to original position when finished
		else {
			$button.animate({
				'top': 0
			}, duration);
		}
	}
	
	// Start animation sequence
	animate();
}


/*
 * SETTING / GETTING LOCALSTORAGE
 */

// Encodes an object to a JSON string, and saves it to localStorage
function save(name, object) {
	localStorage.setItem(name, JSON.stringify(object));
}

// Tries to load a JSON string from localStorage, and if successful, decodes
// the string into an Object
function load(name) {
	var item = localStorage.getItem(name);
	if (item === null) {
		return null;
	} else {
		return JSON.parse(item);
	}
}

// Tests if a localStorage item has been set
function itemExists(name) {
	if (localStorage.getItem(name) !== null) {
		return true;
	} else {
		return false;
	}
}


/*
 * MISC
 */

// Records the index of the argument Map as the current map
function recordCurrent(map) {
	settings.current = map.name;
	saveSettings();
}

// Sets the argument Map as current and records its index
function setAndRecordCurrent(map) {
	currentMap = map;
	recordCurrent(map);
}

// User confirms to overwrite a localStorage entry, if in use
// If not in use, returns true
function saveOK(name) {
	
	// Prompt if there is an item with the argument name
	if (itemExists(name)) {
		var confirmed = confirm(
			'There is already a Map named "' + name + '". Overwrite it?');
		return confirmed;
	} else {
		return true;
	}
}

params.reservedWords = ['settings'];

// Compares the argument string against all reserved words to see if it is one
function isReservedWord(string) {
	for (var i = 0, j = params.reservedWords.length; i < j; i += 1) {
		if (string === params.reservedWords[i]) {
			return true;
		}
	}
	return false;
}

// Prompts user for a name
function promptForName() {
	var input = prompt(
		'Enter a name for the map:');
	
	// Only return the string if it is not a reserved word
	if (!isReservedWord(input)) {
		return input;
	} else {
		alert('Error! "' + input + '" is a reserved word and cannot be used!');
		return null;
	}
}

// Get all available Maps' names and return them as a string
function getAvailableMaps() {
	
	var availableMaps = '';
	for (var i = 0, j = settings.maps.length; i < j; i += 1) {
		availableMaps += '\n' + i + ': ' + settings.maps[i];
		if (i === settings.maps.indexOf(settings.current)) {
			availableMaps += ' (current)';
		}
	}
	return availableMaps;
}


/*
 * NEW MAP
 */

// Creates a new, blank map
function makeNewMap(rows, cols) {

	// The history for the previous map is irrelevant; clear it
	clearHistory();
	setNextNote('New map made.');
	
	// Make a blank map and set it as current
	currentMap = makeBlankMap(
		null,
		settings.currentTileset,
		3,
		rows,
		cols
	);
	settings.current = null;
	settings.currentLayer = 1;
	
	// Refresh
	refreshEditor();
}

function saveAndMakeNewMap() {

	// Prompt to save the current Map
	promptToSave(currentMap);
	
	var input = prompt(
		'Enter the rows (height) and columns (width) of the new map.',
		'15 20');
	
	var widthAndHeight = input.split(' ');
	widthAndHeight[0] = parseInt(widthAndHeight[0]);
	widthAndHeight[1] = parseInt(widthAndHeight[1]);
	
	// CALEB I REQUIRE YOUR REGEX EXCELLENCE
	
	makeNewMap(widthAndHeight[0], widthAndHeight[1]);
}

// Toolbar item
$$.newMap.on('click', function() {
	saveAndMakeNewMap();
});

// SHIFT+N
bindShortcut(78, saveAndMakeNewMap);


/*
 * LOAD MAP
 */

// Lets the user choose a Map from localStorage and load it
function promptAndLoadMap() {
	
	if (settings.maps.length === 0) {
		alert('There are no Maps to load!')
	} else {
	
		// Get all available maps' names
		var availableMaps = getAvailableMaps();
		
		// Prompt user
		var input = prompt(
			'The following maps can be loaded:\n' +
			availableMaps + '\n\n' +
			'Enter the number of a map to load:');
		
		var item = settings.maps[parseInt(input)];
		
		// If input was good
		if (input !== null && typeof item !== 'undefined' && itemExists('map-' + item)) {
			loadMap(item);
		}
	}
}

// Loads the Map corresponding to the argument name and sets it as current
function loadMap(name) {
	
	// Load in the map and set it as current and record it
	setAndRecordCurrent(objectToMap(load('map-' + name)));
	
	// The history for the previous map is irrelevant; clear it
	clearHistory();
	setNextNote('Map "' + currentMap.name + '" loaded.');
	
	// Refresh
	refreshEditor();
}

// Toolbar item
$$.loadMap.on('click', function() {
	promptAndLoadMap();
});

// SHIFT+L
bindShortcut(76, promptAndLoadMap);


/*
 * SAVE MAP
 */

// Saves the argument map to localStorage
function saveMap(map) {
	
	// Check if name has been set yet
	var name;
	if (map.name !== null) {
		name = map.name;
	} else {
		
		// Prompt for a name
		name = promptForName();
		
		// If the user did NOT enter nothing or did NOT close the prompt
		if (name !== null) {
			// If the user is OK with overwriting another Map: Set the prompt
			// value as the Map's name
			if (saveOK(name)) {
				map.name = name;
				refreshMapName();
			}
			// If he is not OK: Stop
			else {
				return;
			}
		}
		// If he DID not enter anything or DID close the prompt: Stop
		else {
			return;
		}
	}
	
	// Save the argument Map
	save('map-' + name, map);
	
	// Update settings if the argument Map's name is not already there
	if ($.inArray(name, settings.maps) === -1) {
		settings.maps.push(name);
		saveSettings();
	}
	
	// Record the argument Map as the current map
	recordCurrent(map);
}

// Save Map
$$.saveMap.on('click', function() {
	saveMap(currentMap);
});

// SHIFT+S
bindShortcut(83, saveMap, currentMap);

// Prompts the user to save
function promptToSave(map) {
	
	var message;
	if (map.name !== null) {
		message = 'Save "' + map.name + '"?';
	} else {
		message = 'Save the unnamed map?'
	}
	
	var confirmed = confirm(message);
	
	if (confirmed) {
		saveMap(map);
	}
}


/*
 * SAVE MAP AS
 */

// Saves a clone of the argument map to localStorage and sets the clone
// as current
function saveMapAs(map) {
	
	var name = promptForName();
	
	// If a name was entered, the prompt not closed, and an overwrite approved:
	// Save a clone of the argument Map
	if (name !== null && saveOK(name)) {
		
		// Make a clone of the argument Map and set the clone's name to
		// the prompted value
		var clone = map.clone();
		clone.name = name;
		
		saveMap(clone);
		
		// Set that copy as the current map and record it
		setAndRecordCurrent(clone);
		refreshMapName();
		
		// The history for the previous map is irrelevant; clear it
		clearHistory();
		setNextNote('Map "' + map.name + '" saved as "' + clone.name + '".');
	}
}

// Save Map As
$$.saveMapAs.on('click', function() {
	saveMapAs(currentMap);
});

// SHIFT+Q
bindShortcut(81, saveMapAs, currentMap);


/*
 * DELETE MAP
 */

function deleteMap() {
	
	// If there are no Maps to delete, do nothing
	if (settings.maps.length === 0) {
		alert('There are no Maps to delete!')
	}
	// If there are, prompt to delete one
	else {
		
		// Get all available maps' names
		var availableMaps = getAvailableMaps();
		
		var input = prompt(
			'The following maps can be deleted:\n' +
			availableMaps + '\n\n' +
			'Enter the number of a map to delete:');
		
		var name = settings.maps[parseInt(input)],
			prefixedName = 'map-' + name;
		
		if (input !== null && name !== 'undefined' && itemExists(prefixedName)) {
			
			// Prompt user one last time
			var confirmed = confirm(
				'Are you sure you want to delete "' + name + '"?');
			
			if (confirmed) {
				
				// If the Map to delete is also the current one
				var isCurrent = (currentMap.name === name);
				
				// Record the index of the Map about to be deleted
				if (isCurrent) {
					var index = settings.maps.indexOf(settings.current);
				}
				
				// Delete the Map from localStorage
				localStorage.removeItem(prefixedName);
				
				// Delete the Map's reference in settings
				settings.maps = $.grep(settings.maps, function(element) {
					return (element !== name);
				});
				saveSettings();
				
				// If the deleted Map was also the current one: Load a different
				// one if available, or if not, make a new one
				if (isCurrent) {
					
					var totalMaps = settings.maps.length;
					
					// If no Maps are left to load: Make a new one
					if (totalMaps === 0) {
						makeNewMap(15, 20);
						settings.current = null;
						return;
					}
					// Otherwise: Keep the index within bounds
					else if (index >= totalMaps) {
						index = totalMaps - 1;
					}
					
					// Load the next available Map
					loadMap(settings.maps[index]);
				}
			}
		}
	}
}

// Delete Map
$$.deleteMap.on('click', function() {
	deleteMap();
});

/*
 * EXPORT JSON
 */

$$.exportJSON.on('click', function() {
	$$.JSONMenu.addClass('visible');
	$('#json-map-string').text(JSON.stringify(currentMap));
	$('#json-tileset-string').text(JSON.stringify(getCurrentTileset()));
});

// Click the close button to dismiss prompt
$$.JSONMenu.on('click', '.close', function() {
	$$.JSONMenu.removeClass('visible');
});


/*
 * UNDO
 */

// Undo
$$.undo.on('mousedown', function() {
	
	// Undo once initially
	undo();
			
	// Timer for the start of the undo sequence
	params.undoMenuTimer = setTimeout(function() {
	
		$$.undoHistoryMenu.addClass('visible');
		
	}, 500);
	
	// Prevent dragging the control
	event.preventDefault();
});

// Cancel undo loop when user mouses up from the control
$$.undo.on('mouseup', function() {
	clearTimeout(params.undoMenuTimer);
	if (mapHistory.length === 0 && $$.undoHistoryMenu.hasClass('visible') === false) {
		// Bounce to notify the user that there is no more history
		bounceControl($$.undo);
	}
	// Prevent default mouse behavior
	event.preventDefault();
});

// Reverts to the previous Map in history
function undo() {
	
	// Prevent undoing when there is no history
	if (mapHistory.length !== 0) {
		
		var lastMapIndex = mapHistory.length - 1;
	
		// Load the last map from history
		currentMap = loadFromHistory(lastMapIndex);
		
		// Refresh the menu and map
		settings.currentLayer = mapHistory[lastMapIndex].currentLayer;
		saveSettings();
		refreshEditor();
		
		// Delete the last map from history
		deleteMapFromHistory(lastMapIndex);
	}
}

// SHIFT+Z
bindShortcut(90, undo);


/*
 * UNDO HISTORY
 */

// Toggles the undo history menu's visibility
$$.undoHistory.on('click', function() {
	if (!$$.undoHistoryMenu.hasClass('visible')) {
		$$.undoHistoryMenu.addClass('visible');
	} else {
		$$.undoHistoryMenu.removeClass('visible');
	}
});

// Click undo entry to undo
$$.undoHistoryList.on('click', 'li', function() {
	
	var $entry = $(this);
	var index = mapHistory.length - ($entry.index() + 1);
	
	// Push map to undo history before reverting to previous map
	saveToHistory('Map was loaded from history.');
	
	// Revert to previous map
	currentMap = mapHistory[index].map;
	
	// Refresh menu and map
	settings.currentLayer = mapHistory[index].currentLayer;
	saveSettings();
	refreshEditor();
});

// Click the close button to dismiss prompt
$$.undoHistoryMenu.on('click', '.close', function() {
	$$.undoHistoryMenu.removeClass('visible');
});



/*
 * CLEAR LOCALSTORAGE
 */

$$.clearLocalStorage.on('click', function() {
	var input = confirm(
		'Delete settings and all maps in localStorage?');
	if (input === true) {
		input = prompt(
			'Are you absolutely sure? ALL your maps will be lost!\n' +
			'Type "yes" if you are sure.');
		if (input === 'yes') {
			localStorage.clear();
			location.reload();
		}
	}
});


/*
 * LAYER TOOLBAR
 */

// Add layer
$$.addLayer.on('click', function() {
	
	// Save old version of map to history
	saveToHistory('Layer was added.');
	
	// Add a Layer at the current index +1
	settings.currentLayer += 1;
	saveSettings();
	
	currentMap.addLayer(
		settings.currentLayer,
		makeTiles(currentMap.rows, currentMap.cols)
	);
	
	// Select the new layer
	refreshEditor();
});

// Delete layer
$$.deleteLayer.on('click', function() {
	
	// Prevent the deletion of the only Layer
	if (currentMap.layers.length > 1) {
		
		saveToHistory('Layer was deleted.');
		
		// Delete the current Layer
		currentMap.deleteLayer(settings.currentLayer);
		
		// If the deleted layer was the highest Layer:
		// Select the next-lowest Layer
		if (settings.currentLayer === currentMap.layers.length) {
			settings.currentLayer -= 1;
			saveSettings();
		}
		
		refreshEditor();
		
	} else {
				
		// Bounce to notify the user that the layer cannot be deleted
		bounceControl($(this));
	}
});


/*
 * TILESET MENU
 */

$$.tilesetMenuOpen.on('click', function() {
	$$.tilesetMenu.toggleClass('visible');
});

$$.tilesetMenu.on('click', '.close', function() {
	$$.tilesetMenu.removeClass('visible');
});

$$.saveTileset.on('click', function() {
	saveTilesetAndUpdateSettings(getCurrentTileset());
	saveSettings();
});

$$.switchTileset.on('change', function() {
	var tileset = getTileset($(this).find(':selected').val());
	setCurrentTileset(tileset.name);
	saveSettings();
	makeTilesetMenu(tileset);
});

$$.setTileset.on('click', function() {
	setCurrentTileset($$.switchTileset.find(':selected').val());
	currentMap.tileset = getCurrentTileset().name;
	currentMap.drawMap();
});

// Makes a menu for editing the argument Tileset
function makeTilesetMenu(tileset) {
	
	var path = tileset.path;
	
	// Clean up the select element (in case a menu is being replaced)
	$$.switchTileset.empty();
	
	// Append options for each tileset in memory
	for (var i = 0; i < tilesets.length; i += 1) {
		var name = tilesets[i].name;
		$('<option />', {
			'value': name,
			'text': name
		}).appendTo($$.switchTileset);
	}
	
	// Select the right option
	$$.switchTileset.val(tileset.name);
	
	// Clean up the Tileset's element (in case a menu is being replaced)
	$$.editingTilesetContainer.empty();
	
	$('<img />')
	.prop({
		'id': 'editing-tileset',
		'src': path
	})
	.appendTo($$.editingTilesetContainer);
	
	// Update the name
	$('#editing-tileset-name').text(tileset.name);
	
	// Make an element for each TileTraits
	for (var r = 0; r < tileset.rows; r += 1) {
		for (var c = 0; c < tileset.cols; c += 1) {
			
			var tileTraits = tileset.tileTraits[r][c];
			
			$('<div / >')
			.prop({
				'class': 'tile-trait',
			})
			.css({
				'left': c * 32,
				'top': r * 32,
				'background-image': getTileTraitsBackgroundImage(tileTraits)
			})
			.data('data', [tileset.name, r, c, 0])
			.on('click', function() {
				
				// Get identifying data about this TileTraits's element
				var data = $.data(this, 'data'),
					tilesetName = data[0]
					row = data[1],
					col = data[2],
					cycle = data[3];
				
				var tileTraits = getTileset(tilesetName).tileTraits[row][col];
				
				// Cycle from passable to impassable
				if (cycle === 0) {
					tileTraits.passable = false;
					tileTraits.above = false;
					cycle += 1;
				}
				// Cycle from impassable to above
				else if (cycle === 1) {
					tileTraits.passable = true;
					tileTraits.above = true;
					cycle += 1;
				}
				// Cycle from above to passable
				else {
					tileTraits.passable = true;
					tileTraits.above = false;
					cycle = 0;
				}
				
				// Update the element
				$(this)
				.data('data', [tilesetName, row, col, cycle])
				.css({
					'background-image': getTileTraitsBackgroundImage(tileTraits)
				});
			})
			// Each TileTrait's element is within the Tileset's element
			.appendTo($$.editingTilesetContainer);
		}
	}
}

// Returns a css value for an argument TileTraits's element's background image
// (an "O" for passable, an "X" for impassable, and an up arrow for above)
function getTileTraitsBackgroundImage(tileTraits) {
	var backgroundImage = 'url(res/img/icons/';
	if (tileTraits.passable && tileTraits.above) {
		backgroundImage += 'above';
	} else if (!tileTraits.passable && !tileTraits.above) {
		backgroundImage += 'impassable';
	} else {
		backgroundImage += 'passable';
	}
	return backgroundImage + '.png)';
}




// Toggles the argument setting to its opposite value and saves settings
function toggleSetting(setting) {
	settings[setting] = !settings[setting];
	saveSettings();
}

// Updates the argument element's icon according to the argument setting's
// boolean value
function updateIcon($element, setting, trueFileName, falseFileName) {
	var path = 'res/img/icons/';
	if (setting) {
		path += trueFileName;
	} else {
		path += falseFileName;
	}
	path += '.png';
	$element.prop('src', path);
}

function toggleContrastLayers() {
	toggleSetting('contrastLayers');
	updateContrastLayersIcon();
	currentMap.contrastLayers();
}

function updateContrastLayersIcon() {
	updateIcon(
		$$.toggleContrastLayers,
		settings.contrastLayers,
		'contrast',
		'contrast_low'
	);
}

// Refresh contrast whenever the "contrast" icon is clicked
$$.toggleContrastLayers.on('click', function() {
	toggleContrastLayers();
});

// Toggle Eraser
function toggleEraser() {
	toggleSetting('eraser');
	updateEraserIcon();
}

function updateEraserIcon() {
	updateIcon(
		$$.toggleEraser,
		settings.eraser,
		'eraser',
		'eraser_grey'
	);
	if (settings.eraser) {
		$('.selection').addClass('erasing');
	} else {
		$('.selection').removeClass('erasing');
	}
	
}

$$.toggleEraser.on('click', function() {
	toggleEraser();
});


/*
 * LAYER LIST
 */

// Refresh contrast whenever a new layer is selected
$$.layerList.on('click', 'li', function() {
	selectLayer($(this).index());
	currentMap.contrastLayers();
});

// Select the given layer in the list of layers
function selectLayer(selectedLayerIndex) {
	var $layers = $$.layerList.children('li');
	$layers.removeClass('selected');
	$layers.eq(selectedLayerIndex).addClass('selected');
	settings.currentLayer = selectedLayerIndex;
	saveSettings();
}

// Refresh the list of layers
function refreshLayerList() {
	
	// Clear old options
	$$.layerList.empty();

	// Add new ones
	for (var l = 0; l < currentMap.layers.length; l += 1) {
		$('<li />')
		.prop({
			'id': 'layer' + l,
			'value': l
		})
		.text('Layer ' + l)
		.appendTo($$.layerList);
	}
	
	// Select the current layer
	selectLayer(settings.currentLayer);
}


/*
 * HISTORY
 */

// Converts the given number of seconds since the epoch to clock time
function createTimestamp() {
	var hours, mins, secs, meridian;
	var date = new Date();
	hours = date.getHours();
	mins = date.getMinutes();
	secs = date.getSeconds();
	if (hours > 12) {
		hours -= 12;
		meridian = 'PM';
	} else {
		meridian = 'AM';
	}
	if (mins < 10) {
		mins = '0' + mins;
	}
	if (secs < 10) {
		secs = '0' + secs;
	}
	return hours + ':' + mins + ':' + secs + ' ' + meridian;
}

// Initialize variables which will always be used for the NEXT history entry
var nextTimestamp;
var nextNote;

// Sets the next timestamp/note to be used for history
function setNextNote(note) {
	nextTimestamp = createTimestamp();
	nextNote = note;
}

// Sets the next timestamp/note to be used for history, and saves the map 
function saveToHistory(note) {
	
	// Prepare the title and subtitle with the next timestamp and note
	var title = nextTimestamp;
	var subtitle = nextNote;
	
	// Save the timestamp and argument note for next time (so the info is
	// paired with its appropriate entry)
	setNextNote(note);
	
	// Push map to array
	mapHistory.push({
		map: currentMap.clone(),
		timestamp: title,
		currentLayer: settings.currentLayer,
	});
	
	// Cap the size of the map history (if maxUndos is not null)
	if (params.maxUndos !== null && mapHistory.length > params.maxUndos) {
		// Remove the oldest map from the history
		mapHistory.shift();
	}
	
	// Add history entry to menu
	$$.undoHistoryList.prepend(
		'<li>' + 
			'<span class="title">' + title + '</span><br />' +
			'<span class="subtitle">' + subtitle + '</span>' +
		'</li>'
	);
}

function loadFromHistory(index) {
	return mapHistory[index].map.clone();
}

function deleteMapFromHistory(index) {
	mapHistory.splice(index, 1);
}

function clearHistory() {
	mapHistory = [];
	$$.undoHistoryList.empty();
}

function refreshEditor() {
	refreshMapName();
	refreshLayerList();
	currentMap.drawMap();
	currentMap.contrastLayers();
}

function refreshMapName() {
	$$.mapName.text((currentMap.name !== null) ? currentMap.name : 'Untitled');
}


/*
 * INITIALIZATION
 */

// Load saved settings, if they exist
if (itemExists('settings')) {
	
	settings = load('settings');
	
	// Update icons according to settings
	updateContrastLayersIcon();
	updateEraserIcon();
}
// If there are no saved settings:
// Save the defaults
else {
	
	// Look through the res/tilesets folder for default Tileset .json files
	// If found: Save localStorage copies (those Tilesets are better)
	// Otherwise: Use the original default Tilesets (with default TileTraits)
	for (var i = 0; i < defaultTilesetNames.length; i += 1) {
		
		var name = defaultTilesetNames[i];
		$.ajax({
			'url': 'res/tilesets/' + name + '.json',
			'dataType': 'json',
			'async': false,
			'success': function(data) {
				saveTilesetAndUpdateSettings(objectToTileset(data));
			},
			'error': function() {
				saveTilesetAndUpdateSettings(defaultTilesets[name]);
			}
		});
	}
	
	saveSettings();
}

// Load in the Tilesets referenced from settings
for (var i = 0; i < settings.tilesets.length; i += 1) {
	addToTilesets(loadTileset(settings.tilesets[i]));
}

// If the settings file contains a Map reference:
// Load the current one
if (settings.maps.length > 0 && settings.current !== null) {
	
	currentMap = objectToMap(load('map-' + settings.current));
	
	// History
	setNextNote('Map "' + currentMap.name + '" loaded.');
}
// Otherwise:
// Make a new Map
else {
	
	// Make a blank map
	makeNewMap(15, 20);
}

setCurrentTileset(currentMap.tileset);
makeTilesetMenu(getCurrentTileset());

// Refresh since the Map was loaded
refreshEditor();


};
}(jQuery));
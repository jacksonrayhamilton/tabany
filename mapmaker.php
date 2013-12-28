<!DOCTYPE html>
<html lang='en-US'>
<head>
<meta charset='UTF-8' />
<meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1' />
<meta name='keywords' content='' />
<meta name='description' content='' />
<title>Map Maker</title>

<link href='res/css/global.css' rel='stylesheet' />
<link href='res/css/map.css' rel='stylesheet' />
<link href='res/css/mapmaker.css' rel='stylesheet' />
</head>
<body>

<div id='sprite-pane'>
	<div id='sprite-map' class='grid selectable'>
		<img id='tileset' src='' alt='Tileset'>
	</div>
</div>

<div id='toolbar'>
	<div class='controls'><?php
		// Dynamically create controls
		function createControls($controls) {
			
			// Dynamically create controls
			foreach ($controls as $action => $filename) {
				// Derive control's name from its ID
				$name = str_replace('-', ' ', $action);
				$name = ucwords($name);
				echo "<img src='res/img/icons/$filename.png' alt='$name' id='$action' class='control' title='$name' />";
			}
			
		}
		// Create toolbar controls
		createControls(array(
			'new-map' => 'page_white',
			'load-map' => 'folder_page',
			'save-map' => 'disk',
			'save-map-as' => 'disk_multiple',
			'delete-map' => 'bin_closed',
			'export-json' => 'box',
			'tileset-menu-open' => 'color_swatch',
			'undo' => 'arrow_undo',
			'redo' => 'arrow_redo',
			'undo-history' => 'book_open',
			'clear-localstorage' => 'bomb'
		));
	?></div>
</div>

<div id='layer-pane'>
	
	<h2>Options</h2>
	
	<div class='controls'>
		<div class='control-row'><?php
		createControls(array(
			'add-layer' => 'page_add',
			'delete-layer' => 'page_delete',
			'duplicate-layer' => 'page_copy',
			'move-layer' => 'page_go',
			'layer-settings' => 'page_gear'
		));
		?></div>
		<div class='control-row'><?php
		createControls(array(
			'toggle-contrast-layers' => 'contrast_low',
			'toggle-eraser' => 'eraser_grey'
		));
		?></div>
	</div>

	<ul id='layer-list'></ul>
	
</div>

<div class='menu' id='undo-history-menu'>
	<div class='close'>x</div>
	<h3>Undo History</h3>
	<ul id='undo-history-list'></ul>
</div>

<div class='menu' id='json-menu'>
	<div class='close'>x</div>
	<h3>JSON Strings</h3>
	<h4>Current Map</h4>
	<textarea id='json-map-string'></textarea>
	<h4>Current Tileset</h4>
	<textarea id='json-tileset-string'></textarea>
</div>

<div class='menu' id='tileset-menu'>
	<div class='close'>x</div>
	<h3>Tileset Editor</h3>
	<h4 id='editing-tileset-name'>tilesetName</h4>
	<div id='tileset-toolbar'>
		<div class='item' id='save-tileset' title='Save the current Tileset.'></div>
		<select id='switch-tileset'></select>
		<div class='item' id='set-tileset' title='Set the selected Tileset as this Map&#39;s.'></div>
	</div>
	<div id='editing-tileset-container'>
		<img id='editing-tileset' src='' />
	</div>
</div>

<div id='content'>
	<h1>Map Maker</h1>
	<em><h2 id='map-name'>mapName</h1></em>

	<div id='map' class='grid'>
		<div id='layers'></div>
	</div>
</div>

<script src='//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js'></script>
<script src='res/js/polyfills.js'></script>
<script src='res/js/inheritance.js'></script>
<script src='res/js/map.js'></script>
<script src='res/js/mapmaker.js'></script>
</body>
</html>
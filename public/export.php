<?php
	
	/*
	
	NTS: Implement this in Node
		
	To send data to this script via JavaScript,
	use jQuery's $.post() method
	
	$.post('res/php/export.php', {
		map: '{}', // Map JSON string
		tileset: '{}' // Tileset JSON string,
		overwrite: false // Whether or not to overwrite the JSON files
	});
	
	*/
	
	// Retrieve JSON strings from POST data
	$map_json = $_POST['map'];
	$tileset_json = $_POST['tileset'];
	$overwrite = (bool)$_POST[''];
	
	// Convert JSON strings to PHP objects
	$map_obj = json_decode($map_json);
	$tileset_obj = json_decode($tileset_json);
	
	// Determine paths to the map and tileset files
	$map_path = "res/maps/$map_obj->name.json";
	$tileset_path = "res/tilesets/$tileset_obj->name.json";
	
	// Do not overwrite map file unless otherwise directed
	if ($overwrite === true || file_exists($map_path) === false) {
		
		$map_file = fopen($map_path, 'w+');
		fwrite($map_file, $map_json);
		fclose($map_file);
		
	}
	
	// Do not overwrite tileset file unless otherwise directed
	if ($overwrite === true || file_exists($tileset_path) === false) {
					
		$tileset_file = fopen($tileset_path, 'w+');
		fwrite($tileset_file, $tileset_json);
		fclose($tileset_file);
		
	}
	
	

?>

<!DOCTYPE html>
<html lang='en-US'>
	<head>
		<meta charset='UTF-8'>
		<meta http-equiv='X-UA-Compatible' content='IE=edge, chrome=1'>
		<meta name='description' content='Tabany - A Free, Browser-Based MMORPG for Windows, Mac and Linux'>
		
		<!-- iOS meta tags -->
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
		
		<link href='res/css/global.css' rel='stylesheet'>
		<link href='res/css/map.css' rel='stylesheet'>
		<link href='res/css/engine.css' rel='stylesheet'>
		<link href='res/css/play.css' rel='stylesheet'>
		
		<title>Tabany - A Free MMORPG</title>
	</head>
	<body>
		
		<div id='gameplay'>
			
			<!--
			<h1 id='game-title'>Tabany</h1>
			-->
			
			<div id='map-container'>
				
				<div id='map'>
					<div id='layers'></div>
				</div>
				
			</div>
			
			<div id='controller'>
				<div class='button 'id='left-button'></div>
				<div class='button 'id='left-up-button'></div>
				<div class='button' id='up-button'></div>
				<div class='button 'id='right-up-button'></div>
				<div class='button' id='right-button'></div>
				<div class='button 'id='right-down-button'></div>
				<div class='button' id='down-button'></div>
				<div class='button 'id='left-down-button'></div>
			</div>
			
		</div>
		
		<script src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js'></script>
		<script src='res/js/polyfills.js'></script>
		<script src='res/js/inheritance.js'></script>
		<script src='res/js/map.js'></script>
		<script src='res/js/engine.js'></script>
		<script src='res/js/play.js'></script>
		
	</body>
</html>

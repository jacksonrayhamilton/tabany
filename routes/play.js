
/*
 * GET play page.
 */

exports.index = function(req, res){
  res.render('play', {
    title: 'Play a Free Browser-Based MMORPG | Tabany',
    stylesheets: ['global', 'map', 'engine', 'play'],
    javascripts: ['polyfills', 'inheritance', 'map', 'engine', 'play-old'],
    legacy: true
  });
};

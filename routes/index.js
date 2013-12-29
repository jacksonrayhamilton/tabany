
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'Free Open-Source Browser-Based MMORPG | Tabany',
    stylesheets: ['index']
  });
};

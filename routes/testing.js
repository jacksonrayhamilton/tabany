
/*
 * GET testing page.
 */

exports.index = function (req, res) {
  res.render('testing', {
    title: 'Testing | Tabany',
    stylesheets: ['style']
  });
};

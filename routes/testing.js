
/*
 * GET testing page.
 */

exports.index = function (req, res) {
  res.render('testing', {
    title: 'Testing | Tabany',
    pageName: 'testing',
    stylesheets: ['style']
  });
};

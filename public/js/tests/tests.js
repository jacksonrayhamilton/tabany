  var desert = Object.create(ImageLoader);
  desert.loadImage('/a/tilesets/GR-005-desert01.png', function (image) {
    console.log('Loaded image `' + image.src + '`.', image);
  });

  var loader = Object.create(ImageLoader);
  loader.loadImages([
    '/a/tilesets/GR-000-tomb01.png',
    '/a/tilesets/Siege-4qroi88.png',
    '/a/tilesets/Nononick-02exsdesertedtown011st0.png',
    '/a/tilesets/Boonzeet-SandATSet.png',
    '/a/tilesets/Gratheo-frozenlakemt9.png',
    '/a/tilesets/GR-000-water02.png',
    '/a/tilesets/Nononick-4peu26a.png',
    '/a/tilesets/GR-autopad.png',
    '/a/tilesets/GR-000-lava01.png',
    '/a/tilesets/Siege-6bmv61t.png',
    '/a/tilesets/Siege-4xym0qb.png',
    '/a/tilesets/GR-000-sand01.png',
    '/a/tilesets/GR-001-village01.png',
    '/a/tilesets/Gratheo-breezeicyyj9.png',
    '/a/tilesets/GR-000-tomb02.png',
    '/a/tilesets/GR-000-wall02.png',
    '/a/tilesets/GR-002-village02.png',
    '/a/tilesets/Boonzeet-CoastATSet.png',
    '/a/tilesets/Siege-6fj280x.png',
    '/a/tilesets/GR-000-lines.png',
    '/a/tilesets/GR-005-desert01.png',
    '/a/tilesets/GR-inner-1.png',
    '/a/tilesets/Siege-4p4abzk.png',
    '/a/tilesets/Seige-4yqw1t0.png',
    '/a/tilesets/Nononick-mudL.png',
    '/a/tilesets/GR-000-grass01.png',
    '/a/tilesets/Siege-53ue99i.png',
    '/a/tilesets/Nononick-poisonL.png',
    '/a/tilesets/GR-009-cave.png',
    '/a/tilesets/GR-000-sand03.png',
    '/a/tilesets/Siege-63sokgk.png',
    '/a/tilesets/GR-000-road01.png',
    '/a/tilesets/Siege-4liy4co.png',
    '/a/tilesets/Seige-4xw0y37.png',
    '/a/tilesets/GR-000-grass02.png',
    '/a/tilesets/GR-000-wall01.png',
    '/a/tilesets/GR-003-town01.png',
    '/a/tilesets/Nononick-swampL-1.png',
    '/a/tilesets/Siege-4p3iko2.png',
    '/a/tilesets/GR-01-village01-out.png',
    '/a/tilesets/Gratheo-breezedoorhb1.png',
    '/a/tilesets/Seige-538m3nr.png',
    '/a/tilesets/GR-000-sand02.png',
    '/a/tilesets/Siege-6azojuo.png',
    '/a/tilesets/GR-000-nature01.png',
    '/a/tilesets/GR-007-snow01.png'
  ], function (images) {
    console.log('All images loaded.', images);
  });

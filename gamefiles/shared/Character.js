define(['shared/inherits', 'shared/Entity'],
function (inherits, Entity) {
  
  var Character = inherits(Entity, {
    init: function () {
      Entity.init.apply(this, Array.prototype.slice.call(arguments));
      return this;
    }
  });
  
  return Character;
});

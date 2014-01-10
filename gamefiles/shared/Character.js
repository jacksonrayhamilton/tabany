define(['shared/Entity', 'shared/inherits'],
function (Entity, inherits) {
  
  var Character = inherits(Entity, {
    
    init: function (applySuper, args) {
      applySuper(this, arguments);
      return this;
    }
    
  });
  
  return Character;
});

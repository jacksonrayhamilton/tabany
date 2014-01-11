define(['shared/Entity', 'shared/inherits', 'shared/Types'],
function (Entity, inherits, Types) {
  
  var Character = inherits(Entity, {
    
    type: Types.Objects.Character,
    
    init: function (applySuper, args) {
      applySuper(this, arguments);
      return this;
    }
    
  });
  
  return Character;
});

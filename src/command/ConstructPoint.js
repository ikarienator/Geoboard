function ConstructPointCommand(x, y) {
  this.x = x;
  this.y = y;
};

ConstructPointCommand.prototype = new ConstructCommand();

ConstructPointCommand.prototype.canDo = function(gdoc) {
  return !!(this.x !== undefined && this.y !== undefined);
};

ConstructPointCommand.prototype.createNew = function(gdoc) {
  return new GBPoint(gdoc.nextId(), this.x, this.y);
};


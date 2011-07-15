function ConstructCircleCommand(center, on) {
  this.center = center;
  this.on = on;
};

ConstructCircleCommand.prototype = new ConstructCommand();

ConstructCircleCommand.prototype.canDo = function (gdoc) {
  return !!(this.center !== undefined && this.on !== undefined);
};

ConstructCircleCommand.prototype.createNew = function (gdoc) {
  return new GBCircle(gdoc.nextId(), this.center, this.on);
};

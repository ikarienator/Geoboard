function ConstructLineCommand(gpo1, gpo2) {
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
};

ConstructLineCommand.prototype = new ConstructCommand();

ConstructLineCommand.prototype.canDo = function(gdoc) {
  return !!(this.gpo1 !== undefined && this.gpo2 !== undefined);
};

ConstructLineCommand.prototype.createNew = function () {
  return new GBLine(gdoc.nextId(), this.gpo1, this.gpo2);
};

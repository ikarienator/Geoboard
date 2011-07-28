function ConstructPoOCommand(obj, arg) {
  this.obj = obj;
  this.arg = arg;
};

ConstructPoOCommand.prototype = new ConstructCommand();

ConstructPoOCommand.prototype.canDo = function (gdoc) {
  return !!(this.obj !== undefined && this.arg !== undefined);
};

ConstructPoOCommand.prototype.createNew = function (gdoc) {
  return new GBPoO(gdoc, this.obj, this.arg);
};

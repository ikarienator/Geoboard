/**
 * @class ConstructLineCommand
 * @extends ConstructCommand
 * @params {GBAbstractPoint} gpo1
 * @params {GBAbstractPoint} gpo2
 */
function ConstructLineCommand(gpo1, gpo2) {
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
}

ConstructLineCommand.prototype = new ConstructCommand();

ConstructLineCommand.prototype.canDo = function(gdoc) {
  return !!(this.gpo1 !== undefined && this.gpo2 !== undefined);
};

ConstructLineCommand.prototype.createNew = function (gdoc) {
  return new GBLine(gdoc, this.gpo1, this.gpo2);
};

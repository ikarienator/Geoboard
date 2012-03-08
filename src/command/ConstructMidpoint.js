function ConstructMidpointCommand(line) {
  this.line = line;
}
;

ConstructMidpointCommand.prototype = new ConstructCommand();

ConstructMidpointCommand.prototype.canDo = function (gdoc) {
  return !!(this.line !== undefined && this.line.type() == 'gli');
};

ConstructMidpointCommand.prototype.createNew = function (gdoc) {
  return new GBMidpoint(gdoc, this.line);
};
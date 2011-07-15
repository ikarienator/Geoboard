function ConstructMidpointCommand(line) {
  this.line = line;
};

ConstructMidpointCommand.prototype = new ConstructCommand();

ConstructMidpointCommand.prototype.canDo = function(gdoc) {
  return !!(this.line !== undefined && this.line.type() == 'gli');
};

ConstructMidpointCommand.prototype.createNew = function(gdoc){
  new GBMidpoint(gdoc.nextId(), this.line);
};
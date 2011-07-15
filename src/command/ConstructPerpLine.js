function ConstructPerpLineCommand(point, line) {
  this.point = point;
  this.line = line;
  
};

ConstructPerpLineCommand.prototype = new Command();

ConstructPerpLineCommand.prototype.canDo = function(gdoc) {
  return !!(this.point !== undefined && this.line !== undefined && this.line.isLine);
};

ConstructPerpLineCommand.prototype.createNew = function(gdoc) {
  return [new GBPointMark(gdoc.nextId(), this.point, this.line, true),
  new GBParaLine(gdoc.nextId(), this.point, this.line)];
};


ConstructPerpLineCommand.prototype.exec = function(gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructPerpLineCommand.prototype.undo = function(gdoc) {
  gdoc.remove(this.newObject[0]);
  gdoc.remove(this.newObject[1]);
};

ConstructPerpLineCommand.prototype.redo = function(gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};
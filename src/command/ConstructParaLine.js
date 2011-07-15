function ConstructParaLineCommand(point, line) {
  this.point = point;
  this.line = line;
  
};

ConstructParaLineCommand.prototype = new Command();

ConstructParaLineCommand.prototype.canDo = function(gdoc) {
  return !!(this.point !== undefined && this.line !== undefined && this.line.isLine);
};

ConstructParaLineCommand.prototype.createNew = function(gdoc) {
  var mark = new GBPointMark(gdoc.nextId(), this.point, this.line, false);
  return [mark, new GBXLine(gdoc.nextId(), this.point, mark)];
};


ConstructParaLineCommand.prototype.exec = function(gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructParaLineCommand.prototype.undo = function(gdoc) {
  gdoc.remove(this.newObject[0]);
  gdoc.remove(this.newObject[1]);
};

ConstructParaLineCommand.prototype.redo = function(gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};
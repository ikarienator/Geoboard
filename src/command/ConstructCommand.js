function ConstructCommand() {};
ConstructCommand.prototype = new Command();

/**
 * @field {Geom}
 */
ConstructCommand.prototype.newObject = null;

ConstructCommand.prototype.createNew = function(gdoc) {
  throw 'createNew(gdoc) not implemented';
};

ConstructCommand.prototype.exec = function(gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructCommand.prototype.undo = function(gdoc) {
  gdoc.del(this.newObject);
};

ConstructCommand.prototype.redo = function(gdoc) {
  gdoc.add(this.newObject);
  gdoc.selection = {};
  gdoc.selection[this.newObject.id] = this.newObject;
};
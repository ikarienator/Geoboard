function Command() {};

Command.prototype = {
  /**
   * 
   * @param gdoc
   * @returns {boolean}
   */
  canDo : function(gdoc) {
    throw 'canDoc(gdoc) not implemented';
  },
  exec : function(gdoc) {
    throw 'exec(gdoc) not implemented';
  },
  undo : function(gdoc) {
    throw 'undo(gdoc) not implemented';
  },
  redo : function(gdoc) {
    throw 'redo(gdoc) not implemented';
  }
};

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
};
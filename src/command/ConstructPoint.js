var ConstructPointCommand = function(x, y) {
  this.x = x;
  this.y = y;
};

ConstructPointCommand.prototype = new Command();
$.extend(ConstructPointCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.x !== undefined && this.y !== undefined);
  },
  exec : function(gdoc) {
    var np = this.np = new GBPoint(gdoc.nextId(), this.x, this.y);
    gdoc.entities[np.id()] = np;
    gdoc.selection = {};
    gdoc.selection[np.id()] = np;
  },
  undo : function(gdoc) {
    delete gdoc.entities[this.np.id()];
    if (gdoc.selection[this.np.id()])
      delete gdoc.selection[this.np.id()];
  },
  redo : function(gdoc) {
    gdoc.entities[this.np.id()] = this.np;
    gdoc.selection = {};
    gdoc.selection[this.np.id()] = this.np;
  }
});

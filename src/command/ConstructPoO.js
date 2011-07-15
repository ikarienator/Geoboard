var ConstructPoOCommand = function(obj, arg) {
  this.obj = obj;
  this.arg = arg;
};

ConstructPoOCommand.prototype = new Command();
$.extend(ConstructPoOCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.obj !== undefined && this.arg !== undefined);
  },
  exec : function(gdoc) {
    var np = this.np = new GBPoO(gdoc.nextId(), this.obj, this.arg);
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

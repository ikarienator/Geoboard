var ConstructMidpointCommand = function(line) {
  this.line = line;
};

ConstructMidpointCommand.prototype = new Command();
$.extend(ConstructMidpointCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.line !== undefined && this.line.type() == 'gli');
  },
  exec : function(gdoc) {
    var np = this.np = new GBMidpoint(gdoc.nextId(), this.line);
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

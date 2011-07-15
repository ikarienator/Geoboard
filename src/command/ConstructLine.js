var ConstructLineCommand = function(gpo1, gpo2) {
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
};

ConstructLineCommand.prototype = new Command();
$.extend(ConstructLineCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.gpo1 !== undefined && this.gpo2 !== undefined);
  },
  exec : function(gdoc) {
    var nl = this.nl = new GBLine(gdoc.nextId(), this.gpo1, this.gpo2);
    gdoc.entities[nl.id()] = nl;
    gdoc.selection = {};
    gdoc.selection[nl.id()] = nl;
  },
  undo : function(gdoc) {
    delete gdoc.entities[this.nl.id()];
    if (gdoc.selection[this.nl.id()])
      delete gdoc.selection[this.nl.id()];
  },
  redo : function(gdoc) {
    gdoc.entities[this.nl.id()] = this.nl;
    gdoc.selection = {};
    gdoc.selection[this.nl.id()] = this.nl;
  }
});

var ConstructPerpLineCommand = function(point, line) {
  this.point = point;
  this.line = line;
};

ConstructPerpLineCommand.prototype = new Command();
$.extend(ConstructPerpLineCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.point !== undefined && this.line !== undefined);
  },
  exec : function(gdoc) {
    var nl = this.nl = new GBPerpLine(gdoc.nextId(), this.point, this.line);
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

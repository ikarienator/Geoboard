var ConstructCircleCommand = function(center, on) {
  this.center = center;
  this.on = on;
};

ConstructCircleCommand.prototype = new Command();
$.extend(ConstructCircleCommand.prototype, {
  canDo : function(gdoc) {
    return !!(this.center !== undefined && this.on !== undefined);
  },
  exec : function(gdoc) {
    var nc = this.nc = new GBCircle(gdoc.nextId(), this.center, this.on);
    gdoc.entities[nc.id()] = nc;
    gdoc.selection = {};
    gdoc.selection[nc.id()] = nc;
  },
  undo : function(gdoc) {
    delete gdoc.entities[this.nc.id()];
    if (gdoc.selection[this.nc.id()])
      delete gdoc.selection[this.nc.id()];
  },
  redo : function(gdoc) {
    gdoc.entities[this.nc.id()] = this.nc;
    gdoc.selection = {};
    gdoc.selection[this.nc.id()] = this.nc;
  }
});

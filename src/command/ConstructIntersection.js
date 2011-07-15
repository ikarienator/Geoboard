var ConstructIntersectionCommand = function(obj1, obj2, x, y) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.x = x;
  this.y = y;
};

ConstructIntersectionCommand.prototype = new Command();
$.extend(ConstructIntersectionCommand.prototype, {
  canDo : function(gdoc) {
    if (!(this.obj1 !== undefined && this.obj2 !== undefined))
      return false;
    var inters = this.obj1.inters(this.obj2);
    return inters.length > 0;
  },
  exec : function(gdoc) {
    var inters = this.obj1.inters(this.obj2);
    var x = this.x;
    var y = this.y;
    var min = 0, mind = dist([ x, y ], inters[min]);
    $.each(inters, function(k, v) {
      var d = dist([ x, y ], v);
      if (d < mind) {
        min = k;
      }
    });
    var np = this.np = new GBInters(gdoc.nextId(), this.obj1, this.obj2, min);
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

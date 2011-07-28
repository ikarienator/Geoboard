function ConstructIntersectionsCommand(obj1, obj2) {
  this.obj1 = obj1;
  this.obj2 = obj2;
};

ConstructIntersectionsCommand.prototype = new Command();

ConstructIntersectionsCommand.prototype.canDo = function (gdoc) {
  if (!(this.obj1 !== undefined && this.obj2 !== undefined))
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > 0;
};

ConstructIntersectionsCommand.prototype.exec = function (gdoc) {
  var me = this;
  this.newObjects = $.map(me.obj1.inters(me.obj2), function(v, k) {
    return new GBInters(gdoc, me.obj1, me.obj2, k);
  });
  
  this.redo(gdoc);
};

ConstructIntersectionsCommand.prototype.undo = function (gdoc) {
  $.each(this.newObjects, function (k, v) {
    gdoc.del(v);
  });
};

ConstructIntersectionsCommand.prototype.redo = function (gdoc) {
  $.each(this.newObjects, function (k, v) {
    gdoc.add(v);
  });
};
function ConstructIntersectionCommand(obj1, obj2, x, y) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.x = x;
  this.y = y;
};

ConstructIntersectionCommand.prototype = new ConstructCommand();

ConstructIntersectionCommand.prototype.canDo = function (gdoc) {
  if (!(this.obj1 !== undefined && this.obj2 !== undefined))
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > 0;
};

ConstructIntersectionCommand.prototype.createNew = function (gdoc) {
  var inters = this.obj1.inters(this.obj2), x = this.x, y = this.y, min = 0, mind = dist([ x, y ], inters[min]);
  $.each(inters, function (k, v) {
    var d;
    if (k > 0 && (d = dist([ x, y ], v)) < mind) {
      min = k;
      mind = d;
    }
  });
  return new GBInters(gdoc.nextId(), this.obj1, this.obj2, min);
};

function GBInters (id, obj1, obj2, idx) {
  GBAbstractPoint.apply(this, [id, [obj1, obj2], [idx]]);
};

GBInters.prototype = new GBAbstractPoint();

GBInters.prototype.dragInvolve = function () {
  var d = {};
  $.each(this.obj1.dragInvolve(), function (k, v) {
    d[v.id()] = v;
  });
  $.each(this.obj2.dragInvolve(), function (k, v) {
    d[v.id()] = v;
  });
  return m2a(d);
};

GBInters.prototype.type = function () {
  return "xpo";
};

GBInters.prototype.getPosition = function () {
  var inters = this.getParent(0).inters(this.getParent(1));
  if (inters.length == 0)
    return [ NaN, NaN ];
  else if (this.getParam(0) < inters.length)
    return inters[this.getParam(0)];
  else
    return inters[inters.length - 1];
};

gb.geom.xpo = function (id, obj1, obj2, idx) {
  return new GBInters(id, obj1, obj2, idx);
};
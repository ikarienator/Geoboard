function GBInters (id, obj1, obj2, idx) {
  GBAbstractPoint.apply(this, [id, [obj1, obj2], [idx]]);
  this.cache = [];
};

GBInters.prototype = new GBAbstractPoint();

GBInters.prototype.dragInvolve = function () {
  var d = {};
  $.each(this.getParent(0).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  $.each(this.getParent(1).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  return m2a(d);
};

GBInters.prototype.type = function () {
  return "xpo";
};

GBInters.prototype.getPosition = function () {
  this.update();
  return this.cache;
};

GBInters.prototype.update = function() {
  if (this.__dirty) {
    Geom.prototype.update.apply(this, []);
    var inters = this.getParent(0).inters(this.getParent(1));
    if (inters.length == 0)
      this.cache = [ NaN, NaN ];
    else if (this.getParam(0) < inters.length)
      this.cache = inters[this.getParam(0)];
    else
      this.cache = inters[inters.length - 1];
  }
};
gb.geom.xpo = function (id, obj1, obj2, idx) {
  return new GBInters(id, obj1, obj2, idx);
};
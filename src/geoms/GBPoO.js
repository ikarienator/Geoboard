function GBPoO(id, obj, arg) {
  GBAbstractPoint.apply(this, [id, [obj], [arg]]);
};

GBPoO.prototype = new GBAbstractPoint();

GBPoO.prototype.drag = function(from, to) {
  var p = this.getPosition();
  p[0] += to[0] - from[0];
  p[1] += to[1] - from[1];
  this.setParam(0, this.getParent(0).nearestArg(p[0], p[1]));
};

GBPoO.prototype.type = function() {
  return "poo";
};

GBPoO.prototype.getPosition = function() {
  return this.getParent(0).getPosition(this.getParam(0));
};

gb.geom.poo = function(id, obj, arg) {
  return new GBPoO(id, obj, arg);
};
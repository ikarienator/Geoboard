function GBMidpoint (id, line) {
  GBAbstractPoint.apply(this, [id, [line], []]);
};

GBMidpoint.prototype = new GBAbstractPoint();
GBMidpoint.prototype.dragInvolve = function () {
  return this.getParent(0).dragInvolve();
};

GBMidpoint.prototype.drag = function (from, to) {

};

GBMidpoint.prototype.type = function () {
  return "mpo";
};

GBMidpoint.prototype.getPosition = function () {
  return this.getParent(0).getPosition(0.5);
};

gb.geom.mpo = function (id, line) {
  return new GBMidpoint(id, line);
};
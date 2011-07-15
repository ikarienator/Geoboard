function GBLine (id, gpo1, gpo2) {
  GBAbstractLine.apply(this, [id, [gpo1, gpo2]]);
};

GBLine.prototype = new GBAbstractLine();
GBLine.P1 = 0;
GBLine.P2 = 0;
GBLine.prototype.length = function () {
  var p1 = this.__getPosition(0),
      p2 = this.__getPosition(1),
      dx = p1[0] - p2[0],
      dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
};

GBLine.prototype.dragInvolve = function () {
  var d = {};
  $.extend(d, a2m(this.getParent[GBLine.P1].dragInvolve()));
  $.extend(d, a2m(this.getParent[GBLine.P2].dragInvolve()));
  return m2a(d);
};

GBLine.prototype.type = function () {
  return "gli";
};

GBLine.prototype.legalArg = function (arg) {
  if (arg < 0)
    return false;
  if (arg > 1)
    return false;
  return true;
};

GBLine.prototype.argRange = function (arg) {
  return [ 0, 1 ];
};

GBLine.prototype.adjustArg = function (arg) {
  if (arg < 0)
    return 0;
  if (arg > 1)
    return 1;
  return arg;
};

GBLine.prototype.__getPosition = function (arg) {
  if (arg == 0)
    return this.getParent[GBLine.P1].getPosition();
  if (arg == 1)
    return this.getParent[GBLine.P2].getPosition();
  var p1 = this.getParent[GBLine.P1].getPosition(),
      p2 = this.getParent[GBLine.P2].getPosition();
  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
};

GBLine.prototype.randPoint = function () {
  while (true) {
    var arg = Math.nrand() + 0.5;
    if (this.legalArg(arg)) {
      return this.__getPosition(arg);
    }
  }
};

gb.geom.gli = function (id, gpo1, gpo2) {
  return new GBLine(id, gpo1, gpo2);
};
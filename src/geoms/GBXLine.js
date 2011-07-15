function GBXLine (id, gpo1, gpo2) {
  GBAbstractLine.apply(this, [ id, [ gpo1, gpo2 ] ]);
};

GBXLine.prototype = new GBAbstractLine();

GBXLine.prototype.adjustArg = function (arg) {
  return arg;
};

GBXLine.prototype.getParents = function () {
  return [ this.gpo1, this.gpo2 ];
};

GBXLine.prototype.legalArg = function (arg) {
  return true;
};

GBXLine.prototype.argRange = function (arg) {
  return this.crossArg(-800, -600, 1600, 1200);
};

GBXLine.prototype.type = function () {
  return 'xli';
};

gb.geom.xli = function (id, gpo1, gpo2) {
  return new GBXLine(id, gpo1, gpo2);
};
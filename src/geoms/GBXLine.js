function GBXLine (id, gpo1, gpo2) {
  GBLine.apply(this, [ id, gpo1, gpo2]);
};

GBXLine.prototype = new GBLine();

GBXLine.prototype.adjustArg = function (arg) {
  return arg;
};

GBXLine.prototype.legalArg = function (arg) {
  return !$.isNaN(arg);
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
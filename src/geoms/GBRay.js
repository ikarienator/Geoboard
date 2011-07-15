function GBRay (id, gpo1, gpo2) {
  GBAbstractLine.apply(this, [ id, gpo1, gpo2]);
};

GBRay.prototype = new GBAbstractLine();
GBRay.prototype.adjustArg = function (arg) {
  if (arg < 0)
    return 0;
  return arg;
};

GBRay.prototype.legalArg = function (arg) {
  return arg >= 0;
};

GBRay.prototype.argRange = function (arg) {
  return [ 0, 100 ];
};

GBRay.prototype.type = function () {
  return 'ray';
};

gb.geom.ray = function (id, gpo1, gpo2) {
  return new GBRay(id, gpo1, gpo2);
};
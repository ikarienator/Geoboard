function GBRay(document, gpo1, gpo2) {
  GBLine.apply(this, [ document, gpo1, gpo2]);
}

GBRay.prototype = new GBLine();
GBRay.labelArg = 0;
GBRay.prototype.adjustArg = function (arg) {
  if (arg < 0) return 0;
  return arg;
};

GBRay.prototype.adjustArgInstruction = function (arg) {
  return [ 'if (', arg, ' < 0) ', arg, '= 0;' ].join('');
};

GBRay.prototype.legalArg = function (arg) {
  return arg >= 0;
};

GBRay.prototype.legalArgInstructionRef = function (arg) {
  return '(' + arg + '>=0)';
};


GBRay.prototype.argRange = function (arg) {
  var ext = this.document.context.getExtent();
  return arg = this.crossArg(ext[0] * 2, ext[1] * 2, (ext[2] - ext[0]) * 2, (ext[3] - ext[1]) * 2);
};

GBRay.prototype.type = function () {
  return 'ray';
};

gb.geom.reg(GBRay);
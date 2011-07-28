function GBLocus (document, poo, target) {
  GBAbstractCurve.apply(this, [ document, [ poo, target ] ]);
  this.path = [];
};

GBLocus.POO = 0;
GBLocus.TARGET = 1;

GBLocus.prototype = new GBAbstractCurve();
GBLocus.prototype.color = "#880";

GBLocus.prototype.__getDefaultRange = function () {
  var pa = this.getParent(GBLocus.POO).getParent(0);
  return pa.argRange && pa.argRange() || [0, 1];
};

GBLocus.prototype.__getPosition = function (arg, context) {
  return [NaN, NaN];
};

GBLocus.prototype.__curveStart = function () {
  
};

GBLocus.prototype.__curveStop = function (context) {
  
};

GBLocus.prototype.getInstruction = function (context) {
  return 'var ' + this.id + ' = (' + Geom.calculas(this.document, this.getParent(0), this.getParent(1)) + ') (gdoc);';
};

GBLocus.prototype.getInstructionRef = function (arg, context) {
  var range = this.__getDefaultRange();
  return this.id + '(' + (range[1] - range[0]) + '* (' + arg + ') +' + range[0] + ')';
};

GBLocus.prototype.type = function () {
  return "loc";
};

GBLocus.prototype.update = function () {
  if (this.__dirty) {
    var text = Geom.calculas(this.document, this.getParent(0), this.getParent(1));
    this.__getPosition = eval(text)(this.document);
    GBAbstractCurve.prototype.update.apply(this, []);
  }
};

gb.geom.loc = function (gdoc, poo, target) {
  return new GBLocus(gdoc, poo, target);
};
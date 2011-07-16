function GBLocus (id, poo, target) {
  GBAbstractCurve.apply(this, [ id, [ poo, target ] ]);
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

GBLocus.prototype.__getPosition = function (arg) {
  var poo = this.getParent(GBLocus.POO),
      target = this.getParent(GBLocus.TARGET);
  poo.setParam(0, arg);
  target.update();
  return target.getPosition();
};

GBLocus.prototype.__curveStart = function () {
  var poo = this.getParent(GBLocus.POO), dirts = {};
  $.each(poo.descendants(), function(k ,v) {
    dirts[v.id] = v.__dirty;
  });
  return {dirts : dirts, arg : poo.getParam(0) };
};

GBLocus.prototype.__curveStop = function (context) {
  var poo = this.getParent(GBLocus.POO),
      target = this.getParent(GBLocus.TARGET);
  poo.setParam(0, context.arg);
  target.update();
  $.each(poo.descendants(), function(k ,v) {
    v.__dirty = context.dirts[v.id];
  });
};



GBLocus.prototype.type = function () {
  return "loc";
};

gb.geom.loc = function (id, poo, target) {
  return new GBLocus();
};
function GBProjectionPoint(document, line, po) {
  GBAbstractPoint.apply(this, [document, [line, po]]);
}

GBProjectionPoint.prototype = new GBAbstractPoint();

GBProjectionPoint.prototype.drag = function(from, to) {
  var p = this.getPosition();
  p[0] += to[0] - from[0];
  p[1] += to[1] - from[1];
  this.setParam(0, this.getParent(0).nearestArg(p[0], p[1]));
  this.dirt();
};

GBProjectionPoint.prototype.type = function() {
  return "prp";
};

GBProjectionPoint.prototype.getPosition = function() {
  var line = this.getParent(0),
      p0 = line.__getPosition(0),
      p1 = line.__getPosition(1),
      p2 = this.getParent(1).getPosition(),
      arg = Geom.projArg(p0, p1, p2);
  return [(p1[0] - p0[0]) * arg + p0[0], (p1[1] - p0[1]) * arg + p0[1]];
};

GBProjectionPoint.prototype.getInstruction = function () {
  return 'var ' + this.id + ' = function (arg) { var p0 = ' + this.getParent(0).getInstructionRef(0) + ', p1 = ' +
      + this.getParent(0).getInstructionRef(1) + ', p = ' + this.getParent(1).getInstructionRef(0) + ', arg = Geom.projArg(p0, p1, p2);' +
  'return [(p1[0] - p0[0]) * arg + p0[0], (p1[1] - p0[1]) * arg + p0[1]]; }';
};


GBProjectionPoint.prototype.getInstructionRef = function (arg, context) {
  if(!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.id + '(' + arg + ')';
};

gb.geom.reg(GBProjectionPoint);
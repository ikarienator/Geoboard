function GBAngleBisectorMark(document, p1, p2, ang) {
  Geom.apply(this, [document, [p1, p2, ang]]);
}
GBAngleBisectorMark.prototype = new Geom();
GBAngleBisectorMark.prototype.isPoint = true;
GBAngleBisectorMark.prototype.nearestArg = function () { return 0; };
GBAngleBisectorMark.prototype.type = function() { return 'abm'; };
GBAngleBisectorMark.prototype.getPosition = function () {
  var p1 = this.getParent(0).getPosition(0), 
      p2 = this.getParent(1).getPosition(0),
      ang = this.getParent(2).getPosition(0),
      d1 = Math.sqrt(Geom.dist(ang, p1)),
      d2 = Math.sqrt(Geom.dist(ang, p2)),
      arg = d1 / (d1 + d2);
  return [(p2[0] - p1[0]) * arg + p1[0], (p2[1] - p1[1]) * arg + p1[1]];
};


GBAngleBisectorMark.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '_mark(arg) { ' ,
      'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';' ,
      'var p2 = ' + this.getParent(1).getInstructionRef(0, context) + ';' ,
      'var ang = ' + this.getParent(2).getInstructionRef(0, context) + ';' ,
      'var d1 = Math.sqrt(Geom.dist(ang, p1));',
      'var d2 = Math.sqrt(Geom.dist(ang, p2));',
      'var arg = d1 / (d1 + d2);',
      'return [(p2[0] - p1[0]) * arg + p1[0], (p2[1] - p1[1]) * arg + p1[1]];',
      '}'].join('\n');
};

GBAngleBisectorMark.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) {
    var p = this.getPosition();
    return '[' + p[0] + ',' + p[1] + ']';
  }
  return this.id + '_mark()';
};

gb.geom.abm = function(document, p1, p2, ang) {
  return new GBAngleBisectorMark(document, p1, p2, ang);
};
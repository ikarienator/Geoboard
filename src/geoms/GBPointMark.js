function GBPointMark(document, po, line, perp) {
  Geom.apply(this, [document, [line, po], [perp]]);
}

GBPointMark.IS_PERP = 0;
GBPointMark.prototype = new Geom();
GBPointMark.prototype.isPoint = true;
GBPointMark.prototype.nearestArg = function () {
  return 0;
};
GBPointMark.prototype.type = function () {
  return 'gpm';
};
GBPointMark.prototype.getPosition = function () {
  var p1 = this.getParent(0).getPosition(0),
    p2 = this.getParent(0).getPosition(1),
    p3 = this.getParent(1).getPosition(0);
  if (this.getParam(GBPointMark.IS_PERP))
    return [p3[0] - (p2[1] - p1[1]), p3[1] + (p2[0] - p1[0])];
  else
    return [p3[0] + p2[0] - p1[0], p3[1] + p2[1] - p1[1]];
};


GBPointMark.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '_mark(arg) { ' ,
    'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';' ,
    'var p2 = ' + this.getParent(0).getInstructionRef(1, context) + ';' ,
    'var p3 = ' + this.getParent(1).getInstructionRef(0, context) + ';' ,
    'return' +
      (this.getParam(0) ?
        '[p3[0] - (p2[1] - p1[1]), p3[1] + (p2[0] - p1[0])]' :
        '[p3[0] + p2[0] - p1[0], p3[1] + p2[1] - p1[1]]'
        ) +
      ';}'].join('\n');
};

GBPointMark.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) {
    var p = this.getPosition();
    return '[' + p[0] + ',' + p[1] + ']';
  }
  return this.id + '_mark()';
};

gb.geom.reg(GBPointMark);
function GBLine(document, gpo1, gpo2) {
  GBAbstractLine.apply(this, [document, gpo1, gpo2]);
}

GBLine.prototype = new GBAbstractLine();
GBLine.P1 = 0;
GBLine.P2 = 1;
GBLine.prototype.labelArg = 0.5;
GBLine.prototype.length = function () {
  var p1 = this.__getPosition(0),
    p2 = this.__getPosition(1),
    dx = p1[0] - p2[0],
    dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
};

GBLine.prototype.dragInvolve = function () {
  var d = {};
  $.extend(d, gb.utils.a2m(this.getParent(GBLine.P1).dragInvolve()));
  $.extend(d, gb.utils.a2m(this.getParent(GBLine.P2).dragInvolve()));
  return gb.utils.m2a(d);
};

GBLine.prototype.type = function () {
  return "gli";
};

GBLine.prototype.legalArg = function (arg) {
  return 0 <= arg && arg <= 1;
};

GBLine.prototype.legalArgInstructionRef = function (arg) {
  return '0<=' + arg + '&&' + arg + '<=1';
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

GBLine.prototype.adjustArgInstruction = function (arg, context) {
  return [ 'if (', arg, '<0) ', arg, '=0; else if (', arg, '>1) ', arg, '=1;' ].join('');
};

GBLine.prototype.__getPosition = function (arg) {
  if (arg == 0)
    return this.getParent(GBLine.P1).getPosition();
  if (arg == 1)
    return this.getParent(GBLine.P2).getPosition();
  arg = Math.atan(arg);
  var p1 = this.getParent(GBLine.P1).getPosition(),
    p2 = this.getParent(GBLine.P2).getPosition();
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

GBLine.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '(arg) {',
    '  if (!' + this.legalArgInstructionRef('arg', context) + ') return [NaN, NaN];',
    '  var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';',
    '  var p2 = ' + this.getParent(1).getInstructionRef(0, context) + ';',
    '  ' + this.adjustArgInstruction('arg', context),
    '  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];',
    '}'].join('\n');
};

GBLine.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id])
    return this.getInstructionRefStatic(arg, context);
  if (arg === 0)
    return this.getParent(0).getInstructionRef(0, context);
  else if (arg === 1)
    return this.getParent(1).getInstructionRef(0, context);
  else return this.id + '(' + arg + ')';
};

gb.geom.reg(GBLine);
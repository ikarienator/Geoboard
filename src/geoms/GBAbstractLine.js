/**
 * @class GBAbstractLine
 * @extends LabeledGeom
 * @param {GDoc} gdoc
 * @param {GBAbstractPoint} gpo1
 * @param {GBAbstractPoint} gpo2
 */
function GBAbstractLine (gdoc, gpo1, gpo2) {
  LabeledGeom.apply(this, [ gdoc, [ gpo1, gpo2 ] ]);
}

GBAbstractLine.prototype = new LabeledGeom();
GBAbstractLine.prototype.color = '#008';
GBAbstractLine.prototype.isLine = true;

GBAbstractLine.prototype.draw = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
      args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = context.transP2M(3);
  context.strokeStyle = this.color;
  context.stroke();
};

GBAbstractLine.prototype.drawSelected = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
      args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = context.transP2M(8);
  context.strokeStyle = "#44c";
  context.stroke();
  context.lineWidth = context.transP2M(6);
  context.strokeStyle = "#fff";
  context.stroke();
  this.draw(context);
};

GBAbstractLine.prototype.drawHovering = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
      args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = context.transP2M(4);
  context.strokeStyle = "#F00";
  context.stroke();
};

GBAbstractLine.prototype.hitTest = function (x, y, radius) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      fx = p1[0], tx = p2[0], fy = p1[1], ty = p2[1], t, c, dx, dy;
  
  if (fx > tx) {
    t = fx;
    fx = tx;
    tx = t;
  }
  
  if (fy > ty) {
    t = fy;
    fy = ty;
    ty = t;
  }

  c = Geom.cross(p1, [ x, y ], p2);
  c = c * c;
  dx = p1[0] - p2[0];
  dy = p1[1] - p2[1];
  if (c > radius * radius * (dx * dx + dy * dy))
    return false;

  return this.legalArg(Geom.projArg(p1, p2, [ x, y ]));
};

GBAbstractLine.prototype.crossTest = function (l, t, r, b) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      la, ra, ta, ba, li, ri, ti, bi, args;
  if (p1[1] == p2[1]) {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = this.adjustArg([ la, ra ]);
    if (args[0] == args[1])
      return false;
    return t < p1[1] && p1[1] < b;
  } else if (p1[0] == p2[0]) {
    ta = (t - p1[1]) / (p2[1] - p1[1]);
    ba = (b - p1[1]) / (p2[1] - p1[1]);
    args = [ this.adjustArg(ta), this.adjustArg(ba) ];
    if (args[0] == args[1])
      return false;
    return l < p1[0] && p1[0] < r;
  } else {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = [ this.adjustArg(la), this.adjustArg(ra) ];
    if (args[0] == args[1])
      return false;
    li = (p2[1] - p1[1]) * args[0] + p1[1];
    ri = (p2[1] - p1[1]) * args[1] + p1[1];
    if (t < li && li < b)
      return true;
    if (t < ri && ri < b)
      return true;

    ta = (t - p1[1]) / (p2[1] - p1[1]);
    ba = (b - p1[1]) / (p2[1] - p1[1]);
    args = [ this.adjustArg(ta), this.adjustArg(ba) ];
    if (args[0] == args[1])
      return false;
    ti = (p2[0] - p1[0]) * args[0] + p1[0];
    bi = (p2[0] - p1[0]) * args[1] + p1[0];
    return l < ti && ti < r || l < bi && bi < r;
  }
  if (this.adjustArg(args[0]) == this.adjustArg(args[1]))
    return false;
};


GBAbstractLine.prototype.projection = function (x, y) {
  var p1 = this.__getPosition(0),
      p2 = this.__getPosition(1);
  return Geom.projArg(p1, p2, [ x, y ]);
};

GBAbstractLine.prototype.nearestArg = function (x, y) {
  return this.adjustArg(this.projection(x, y));
};

GBAbstractLine.prototype.inters = function (obj) {
  if (obj.isLine)
    return this.intersLine(obj);
  else if (obj.isCircle)
    return this.intersCircle(obj);
  else
    return [];
};

GBAbstractLine.prototype.intersLine = function (line) {
  var p1 = this.__getPosition(0),
      p2 = this.__getPosition(1),
      p3 = line.__getPosition(0),
      p4 = line.__getPosition(1),
      c1, c2, c3, c4, a1, a2;
  
  c1 = Geom.cross(p3, p1, p2);
  c2 = Geom.cross(p4, p1, p2);
  if (c1 == c2) return [[NaN, NaN]];
  c3 = Geom.cross(p1, p3, p4);
  c4 = Geom.cross(p2, p3, p4);
  if (c3 == c4) return [[NaN, NaN]];
  a1 = c3 / (c3 - c4);
  a2 = c1 / (c1 - c2);
  if (this.legalArg(a1) && line.legalArg(a2)) {
    return [ this.getPosition(a1) ];
  } else
    return [ [ NaN, NaN ] ];
};

/**
 * 
 * @param {GBCircle} circ
 * @returns {Array}
 */
GBAbstractLine.prototype.intersCircle = function (circ) {
  var prop = circ.getParent(0).getPosition(),
      r2 = Geom.dist(prop, circ.getParent(1).getPosition()),
      p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      arg = Geom.projArg(p1, p2, prop),
      mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ],
      l = r2 - Geom.dist(prop, mp),
      dist2 = Math.sqrt(l) / this.length(),
      res = [];
  if (Math.abs(l) < 1e-10) 
    dist2 = 0;
  if (this.legalArg(arg - dist2)) {
    res.push(this.getPosition(arg - dist2));
  } else {
    res.push([ NaN, NaN ]);
  }

  if (this.legalArg(arg + dist2)) {
    res.push(this.getPosition(arg + dist2));
  } else {
    res.push([ NaN, NaN ]);
  }
  return res;
};

GBAbstractLine.prototype.type = function () {
  return "gli";
};

GBAbstractLine.prototype.adjustPosition = function (args) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1);
  args[0] = this.adjustArg(args[0]);
  args[1] = this.adjustArg(args[1]);
  return [ [ p1[0] + (p2[0] - p1[0]) * args[0], p1[1] + (p2[1] - p1[1]) * args[0] ],
      [ p1[0] + (p2[0] - p1[0]) * args[1], p1[1] + (p2[1] - p1[1]) * args[1] ] ];
};

GBAbstractLine.prototype.crossArg = function (l, t, r, b) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      amin, amax, aminx, amaxx, aminy, amaxy, te;
  if (p1[0] == p2[0]) {
    amin = (b - p1[1]) / (p2[1] - p1[1]);
    amax = (t - p1[1]) / (p2[1] - p1[1]);
    if (amin > amax) {
      te = amin;
      amin = amax;
      amax = te;
    }
  } else if (p1[1] == p2[1]) {
    amin = (l - p1[0]) / (p2[0] - p1[0]);
    amax = (r - p1[0]) / (p2[0] - p1[0]);
    if (amin > amax) {
      te = amin;
      amin = amax;
      amax = te;
    }
  } else {
    aminx = (l - p1[0]) / (p2[0] - p1[0]);
    amaxx = (r - p1[0]) / (p2[0] - p1[0]);
    if (aminx > amaxx) {
      te = aminx;
      aminx = amaxx;
      amaxx = te;
    }
    aminy = (b - p1[1]) / (p2[1] - p1[1]);
    amaxy = (t - p1[1]) / (p2[1] - p1[1]);
    if (aminy > amaxy) {
      te = aminy;
      aminy = amaxy;
      amaxy = te;
    }

    amin = Math.max(aminx, aminy);
    amax = Math.min(amaxx, amaxy);
  }
  return [ amin, amax ];
};

GBAbstractLine.prototype.getPosition = function (arg) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1);
  arg = this.adjustArg(arg);
  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
};

GBAbstractLine.prototype.__getPosition = function (arg) {
  throw '__gePosition(arg) not implemented';
};

GBAbstractLine.prototype.randPoint = function () {
  while (true) {
    var arg = Math.nrand() + 0.5;
    if (this.legalArg(arg)) {
      return this.__getPosition(arg);
    }
  }
};


GBAbstractLine.prototype.getInstructionRefStatic = function (arg) {
  var p1 = this.__getPosition(0);
  var p2 = this.__getPosition(1);
  if (typeof arg === 'number')
    return '[' + (p1[0] + (p2[0] - p1[0]) * arg) + ',' + (p1[1] + (p2[1] - p1[1]) * arg) + ']';
  else return '[' + p1[0] + (p2[0] == p1[0] ? '' :'+' + (p2[0] - p1[0]) + '*' + arg) +',' + 
    p1[1] + (p2[1] == p1[1] ? '' :'+' + (p2[1] - p1[1]) + '*' + arg) + ']';
},

GBAbstractLine.prototype.getIntersInstruction = function(obj, context, idx, intId) {
  if (obj.isLine) {
    if (idx != 0) return '[NaN, NaN]';
    return this.getIntersInstructionLL(obj, context, idx, intId);
  } else {
    if (idx >= 2) return '[NaN, NaN]';
    return this.getIntersInstructionLC(obj, context, idx, intId);
  }
};

GBAbstractLine.prototype.getIntersInstructionLL = function(obj, context, idx, intId) {
  return ['function () { ' ,
  'if (' + intId + '_revision == revision) return ' + intId + '_cache;',
  intId + '_revision = revision; ',
  'var p1 = ' + this.getInstructionRef(0, context) + ';' ,
  'var p2 = ' + this.getInstructionRef(1, context) + ';' ,
  'var p3 = ' + obj.getInstructionRef(0, context) + ';' ,
  'var p4 = ' + obj.getInstructionRef(1, context) + ';' ,
  'var c1 = Geom.cross(p3, p1, p2), c2 = Geom.cross(p4, p1, p2);' ,
  'if (Math.abs(c1 - c2) < 1e-10) return ' + intId + '_cache = [NaN, NaN];' ,
  'var c3 = Geom.cross(p1, p3, p4), c4 = Geom.cross(p2, p3, p4);' ,
  'if (Math.abs(c3 - c4) < 1e-10) return ' + intId + '_cache = [NaN, NaN];' ,
  'var a1 = c3 / (c3 - c4);' ,
  'var a2 = c1 / (c1 - c2);' ,
  'if (' + this.legalArgInstructionRef('a1', context) + '&&' + obj.legalArgInstructionRef('a2', context) + ') {' ,
    'return ' + intId + '_cache = [(p2[0]-p1[0])*a1+p1[0], (p2[1]-p1[1])*a1+p1[1]];' ,
  '} else' ,
    'return ' + intId + '_cache = [NaN,NaN]; }'].join('\n');
};

GBAbstractLine.prototype.getIntersInstructionLC = function(obj, context, idx, intId) {
  var pc = obj.getParent(0).getInstructionRef(0, context), p2 = obj.getParent(1).getInstructionRef(0, context);
  var res= ['function () {',
  'if (' + intId + '_revision == revision) return ' + intId + '_cache;',
  this.id + '_revision = revision; ',
  'var prop = ' + pc + ', r2 = Geom.dist(prop, ' + p2 + '),',
  'p1 = ' + this.getInstructionRef(0, context) + ', p2 = ' + this.getInstructionRef(1, context) + ',',
  'arg = Geom.projArg(p1, p2, prop),',
  'mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ],',
  'dist2 = Math.sqrt((r2 - Geom.dist(mp, prop)) / Geom.dist(p1, p2)),',
  'if (' + this.legalArgInstructionRef(idx == 0 ? '(arg - dist2)' : '(arg + dist2)', context) + ') ', 
  'return ' + intId + '_cache = ' + this.getInstructionRef(idx == 0 ? '(arg - dist2)' : '(arg + dist2)', context) + ';',
  'else',
  'return ' + intId + '_cache = [ NaN, NaN ]);',
  '}'
  ];
  return res.join('\n');
};

function GBAbstractLine (id, gpo1, gpo2) {
  Geom.apply(this, [ id, [ gpo1, gpo2 ] ]);
};

GBAbstractLine.prototype = new Geom();
GBAbstractLine.prototype.color = '#008';

GBAbstractLine.prototype.isLine = true;

GBAbstractLine.prototype.draw = function (context) {
  context.beginPath();
  var args = this.crossArg(-5, -5, context.canvas.clientWidth + 5, context.canvas.clientHeight + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = 3;
  context.strokeStyle = this.color;
  context.stroke();
};

GBAbstractLine.prototype.drawSelected = function (context) {
  context.beginPath();
  var args = this.crossArg(-5, -5, context.canvas.clientWidth + 5, context.canvas.clientHeight + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = 8;
  context.strokeStyle = "#44c";
  context.stroke();
  context.lineWidth = 6;
  context.strokeStyle = "#fff";
  context.stroke();
  this.draw(context);
};

GBAbstractLine.prototype.drawHovering = function (context) {
  context.beginPath();
  var args = this.crossArg(-5, -5, context.canvas.clientWidth + 5, context.canvas.clientHeight + 5),
      ps = this.adjustPosition(args);
  context.moveTo(ps[0][0], ps[0][1]);
  context.lineTo(ps[1][0], ps[1][1]);
  context.closePath();
  context.lineWidth = 4;
  context.strokeStyle = "#F00";
  context.stroke();
};

GBAbstractLine.prototype.hitTest = function (x, y) {
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

  c = cross(p1, [ x, y ], p2);
  c = c * c;
  dx = p1[0] - p2[0];
  dy = p1[1] - p2[1];
  if (c > 25 * (dx * dx + dy * dy))
    return false;

  return this.legalArg(projArg(p1, p2, [ x, y ]));
};

GBAbstractLine.prototype.crossTest = function (l, t, r, b) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      la, ra, ta, ba, li, ri, ti, bi, args;
  if (p1[1] == p2[1]) {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = this.adjustArg([ la, ra ]);
    if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
      return false;
    return t < p1[1] && p1[1] < b;
  } else if (p1[0] == p2[0]) {
    ta = (t - p1[1]) / (p2[1] - p1[1]);
    ba = (b - p1[1]) / (p2[1] - p1[1]);
    args = [ this.adjustArg(ta), this.adjustArg(ba) ];
    if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
      return false;
    return l < p1[0] && p1[0] < r;
  } else {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = [ this.adjustArg(la), this.adjustArg(ra) ];
    if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
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
    if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
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
  return projArg(p1, p2, [ x, y ]);
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
      c1 = cross(p3, p1, p2),
      c2 = cross(p4, p1, p2),
      c3 = cross(p1, p3, p4),
      c4 = cross(p2, p3, p4),
      a1 = c3 / (c3 - c4),
      a2 = c1 / (c1 - c2);
  if (this.legalArg(a1) && line.legalArg(a2)) {
    return [ this.getPosition(a1) ];
  } else
    return [ [ NaN, NaN ] ];
};

GBAbstractLine.prototype.intersCircle = function (circ) {
  var prop = circ.prop(),
      p1 = this.__getPosition(0), p2 = this.__getPosition(1),
      arg = projArg(p1, p2, prop),
      mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ],
      dx = prop[0] - mp[0],
      dy = prop[1] - mp[1],
      dist2 = Math.sqrt(prop[2] * prop[2] - (dx * dx + dy * dy)) / this.length(),
      res = [];

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

GBAbstractLine.prototype.legalArg = function (arg) {
  if (arg < 0)
    return false;
  if (arg > 1)
    return false;
  return true;
};

GBAbstractLine.prototype.argRange = function (arg) {
  return [ 0, 1 ];
};

GBAbstractLine.prototype.adjustArg = function (arg) {
  if (arg < 0)
    return 0;
  if (arg > 1)
    return 1;
  return arg;
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

gb.geom.gli = function (id, gpo1, gpo2) {
  return new GBAbstractLine(id, gpo1, gpo2);
};
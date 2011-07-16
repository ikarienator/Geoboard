function GBAbstractCurve () {
  Geom.apply(this, arguments);
}

GBAbstractCurve.SAMPLES = 500;
GBAbstractCurve.prototype = new Geom();
GBAbstractCurve.prototype.color = "#880";

GBAbstractCurve.prototype.__curve = function (start, stop) {
  var context = this.__curveStart(),
      ps1 = [], ps2 = [], curr1, curr2, i;
     
  for (i = 0; i <= GBAbstractCurve.SAMPLES; i++) {
    curr1 = start + (stop - start) / GBAbstractCurve.SAMPLES * i;
    curr2 = start + ((stop - start) / GBAbstractCurve.SAMPLES) * (i + 0.5);
    ps1.push(this.__getPosition(curr1));
    ps2.push(this.__getPosition(curr2));
  }
  
  this.__curveStop(context);
  return [ps1, ps2];
};

GBAbstractCurve.prototype.__drawPath = function (context) {
  this.update();
  var pss = this.path, ps = pss[0], dc = pss[1], last, top, curr, a, proj, i;
  context.beginPath();
  context.moveTo(ps[0][0], ps[0][1]);
  for (i = 1; i < ps.length; i++) {
    last = ps[i - 1];
    top = dc[i - 1].slice(0);
    curr = ps[i];
    a = projArg(last, curr, top);
    proj = [ (curr[0] - last[0]) * a + last[0], (curr[1] - last[1]) * a + last[1] ];
    context.quadraticCurveTo(top[0] + top[0] - proj[0], top[1] + top[1] - proj[1], curr[0], curr[1]);
  }
};

GBAbstractCurve.prototype.draw = function (context) {
  this.__drawPath(context);
  context.strokeStyle = this.color;
  context.lineWidth = 4;
  context.stroke();
};

GBAbstractCurve.prototype.drawSelected = function (context) {
  this.__drawPath(context);
  context.lineWidth = 8;
  context.strokeStyle = "#44c";
  context.stroke();
  context.lineWidth = 6;
  context.strokeStyle = "#fff";
  context.stroke();
  context.strokeStyle = this.color;
  context.lineWidth = 4;
  context.stroke();
};

GBAbstractCurve.prototype.drawHovering = function (context) {
  this.__drawPath(context);
  context.lineWidth = 4;
  context.strokeStyle = "#F00";
  context.stroke();
};

GBAbstractCurve.prototype.crossTest = function (l, t, r, b) {
  this.update();
  var i, path = this.path[0], p1, p2, la, ra, ta, ba, li, ri, ti, bi;
  for(i = 1; i < path.length; i++) {
    p1 = path[i - 1];
    p2 = path[i];
    if (l < p1[0] && p1[0] < r && t < p1[1] && p1[1] < b) 
      return true;
    if (p1[1] == p2[1]) {
      la = (l - p1[0]) / (p2[0] - p1[0]);
      ra = (r - p1[0]) / (p2[0] - p1[0]);
      if (la < 0) continue;
      if (la > 1) continue;
      if (ra < 0) continue;
      if (ra > 1) continue;
      if (t < p1[1] && p1[1] < b) return true;
    } else if (p1[0] == p2[0]) {
      ta = (t - p1[1]) / (p2[1] - p1[1]);
      ba = (b - p1[1]) / (p2[1] - p1[1]);
      if (ta < 0) continue;
      if (ta > 1) continue;
      if (ba < 0) continue;
      if (ba > 1) continue;
      if (l < p1[0] && p1[0] < r) return true;
    } else {
      la = (l - p1[0]) / (p2[0] - p1[0]);
      ra = (r - p1[0]) / (p2[0] - p1[0]);
      if (la < 0) continue;
      if (la > 1) continue;
      if (ra < 0) continue;
      if (ra > 1) continue;
      li = (p2[1] - p1[1]) * la + p1[1];
      ri = (p2[1] - p1[1]) * ra + p1[1];
      if (t < li && li < b || t < ri && ri < b)
        return true;
    
      ta = (t - p1[1]) / (p2[1] - p1[1]);
      ba = (b - p1[1]) / (p2[1] - p1[1]);
      if (ta < 0) continue;
      if (ta > 1) continue;
      if (ba < 0) continue;
      if (ba > 1) continue;
      ti = (p2[0] - p1[0]) * ta + p1[0];
      bi = (p2[0] - p1[0]) * ba + p1[0];
      
      if (l < ti && ti < r || l < bi && bi < r)
        return true;
      
      if(li < ri || ti < bi)
        return true;
    }
  }
};


GBAbstractCurve.prototype.hitTest = function (x, y) {
  this.update();
  var i, path = this.path[0], p1, p2, 
      fx, tx, fy, ty, t, c;
  for(i = 1; i < path.length; i++) {
    p1 = path[i - 1];
    p2 = path[i];
    fx = p1[0];
    tx = p2[0];
    fy = p1[1];
    ty = p2[1];
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
    if (c > 25 * dist(p1, p2))
      continue;
    c = projArg(p1, p2, [ x, y ]);
    if (c > 1) 
      continue;
    if (c < 0) 
      continue;
    return true;
  }
  return false;
};


GBAbstractCurve.prototype.nearestArg = function (x, y) {
  this.update();
  var context = this.__curveStart(), path = this.path[0],
      mind = Infinity, mini = -1, i, j, p, range = this.__getDefaultRange(), start = range[0], stop = range[1];
  $.each(path, function(k, p) {
    var d = dist(p, [x, y]);
    if (d < mind) {
      mind = d;
      mini = k;  
    }
  });
  range = [(mini - 1) * (range[1] - range[0]) / (path.length - 1) + range[0],
     (mini + 1) * (range[1] - range[0]) / (path.length - 1) + range[0]];
  mini = mini * (range[1] - range[0]) / (path.length - 1) + range[0];
  mind = Infinity;
  for (i = 0; i < 100; i++) {
    j = i * (range[1] - range[0]) * 0.01 + range[0];
    p = dist(this.__getPosition(j), [x, y]);
    if (p < mind) {
      mini = j;
      mind = p;
    }
  }
  this.__curveStop(context);
  return (mini - start) / (stop - start);
};

GBAbstractCurve.prototype.getPosition = function (arg) {
  this.update();
  var path = this.path[0], p1, p2, 
      a = arg * (path.length - 1), d = Math.floor(a), f = a - d;
  p1 = path[d] || [0, 0];
  p2 = path[d + 1] || p1;
  if (f == 0) return p1;
  return [f * (p2[0] - p1[0]) + p1[0], f * (p2[1] - p1[1]) + p1[1]];
};

GBAbstractCurve.prototype.update = function () {
  if (this.__dirty){
    Geom.prototype.update.apply(this, []);
    var range =  this.__getDefaultRange();
    this.path = this.__curve(range[0], range[1]);  
    this.__dirty = false;
  }
};

GBAbstractCurve.prototype.argRange = function () {
  return [0, 1];
};

GBAbstractCurve.prototype.__getPosition = function (arg) {
  throw '__getPosition(arg) not implemented';
};

GBAbstractCurve.prototype.__curveStart = function () {
  throw '__curveStart() not implemented';
};

GBAbstractCurve.prototype.__curveStop = function (context) {
  throw '__curveStop(context) not implemented';
};

GBAbstractCurve.prototype.__getDefaultRange = function () {
  return this.getParent(GBLocus.POO).getParent(0).argRange();
};
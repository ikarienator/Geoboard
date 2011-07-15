/**
 * @class GBCircle
 * @extends Geom
 * @param {string}
 *          id
 * @param {GBPoint}
 *          center
 * @param {GBPoint}
 *          on
 * @constructor
 */
function GBCircle (id, center, on) {
  Geom.apply(this, [ id, [ center, on ] ]);
};

GBCircle.prototype = new Geom();
GBCircle.CENTER = 0;
GBCircle.ON = 1;

GBCircle.prototype.color = '#080';
GBCircle.prototype.isCircle = true;

GBCircle.prototype.prop = function () {
  var cen = this.getParent(GBCircle.CENTER).getPosition(),
      on = this.getParent(GBCircle.ON).getPosition(),
      dx = cen[0] - on[0],
      dy = cen[1] - on[1],
      r = dx * dx + dy * dy;
  r = Math.sqrt(r);
  return [ cen[0], cen[1], r, [ [ 0, Math.PI * 2 ] ] ];
};

GBCircle.prototype.draw = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = 3;
  context.strokeStyle = this.color;
  context.stroke();
};

GBCircle.prototype.drawSelected = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2] - 4, 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#44c";
  context.stroke();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2] + 4, 0, Math.PI * 2, false);
  context.closePath();
  context.stroke();
  this.draw(context);
};

GBCircle.prototype.drawHovering = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = 3;
  context.strokeStyle = "#f00";
  context.stroke();
};

GBCircle.prototype.hitTest = function (x, y) {
  var prop = this.prop(),
      dx = prop[0] - x,
      dy = prop[1] - y,
      r = dx * dx + dy * dy;
  r = Math.sqrt(r);
  return r - 3 < prop[2] && prop[2] < r + 3;
};

GBCircle.prototype.inters = function (obj) {
  if (obj.isLine)
    return obj.inters(this);
  else if (obj.isCircle) {
    var prop1 = this.prop(),
        prop2 = obj.prop(),
        d = Math.sqrt(dist(prop1, prop2)),
        r1 = prop1[2],
        r2 = prop2[2],
        d1 = ((r1 * r1 - r2 * r2) / d + d) * 0.5,
        h = Math.sqrt(r1 * r1 - d1 * d1),
        dx = prop2[0] - prop1[0],
        dy = prop2[1] - prop1[1],
        c1 = [ prop1[0] + (dx * d1 - dy * h) / d, prop1[1] + (dy * d1 + dx * h) / d ],
        c2 = [ prop1[0] + (dx * d1 + dy * h) / d, prop1[1] + (dy * d1 - dx * h) / d ];
    return [ c1, c2 ];
  }
};

GBCircle.prototype.crossTest = function (l, t, r, b) {
  var prop = this.prop(),
      ps = [ [ l, b ], [ l, t ], [ r, t ], [ r, b ] ],
      ds = $.map(ps, function (v, k) { return dist(v, prop); }),
      r2 = prop[2] * prop[2];
  if (ds[0] < r2 && ds[1] < r2 && ds[2] < r2 && ds[3] < r2)
    return false;
  if (ds[0] > r2 && ds[1] > r2 && ds[2] > r2 && ds[3] > r2) {
    if (Math.abs(prop[1] - t) <= prop[2] || Math.abs(prop[1] - b) <= prop[2]) {
      if (l < prop[0] && prop[0] < r)
        return true;
    }
    if (Math.abs(prop[0] - l) <= prop[2] || Math.abs(prop[0] - r) <= prop[2]) {
      return (t < prop[1] && prop[1] < b);
    }
    return l < prop[0] - prop[2] && prop[0] + prop[2] < r && t < prop[1] - prop[2] && prop[1] + prop[2] < b;
  }
  return true;
};

GBCircle.prototype.nearestArg = function (x, y) {
  var c = this.getParent(GBCircle.CENTER).getPosition();
  return Math.atan2(y - c[1], x - c[0]);
};

GBCircle.prototype.dragInvolve = function () {
  return [ this.getParent(GBCircle.CENTER), this.getParent(GBCircle.ON) ];
};

GBCircle.prototype.drag = function (from, to) {

};

GBCircle.prototype.type = function () {
  return "gci";
};

GBCircle.prototype.getPosition = function (arg) {
  var prop = this.prop();
  return [ prop[0] + Math.cos(arg) * prop[2], prop[1] + Math.sin(arg) * prop[2] ];
};

GBCircle.prototype.legalArg = function (arg) {
  if (arg < 0)
    return false;
  if (arg > 2 * Math.PI)
    return false;
  return true;
};

GBCircle.prototype.argRange = function (arg) {
  return [ 0, 2 * Math.PI ];
};

GBCircle.prototype.randPoint = function () {
  while (true) {
    var arg = Math.random() * 2 * Math.PI;
    if (this.legalArg(arg)) {
      return this.getPosition(arg);
    }
  }
};

gb.geom.gci = function (id, center, on) {
  return new GBCircle(id, center, on);
};
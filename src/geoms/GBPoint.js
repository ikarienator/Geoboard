function GBPoint(id, x, y) {
  GBAbstractPoint.apply(this, [ id, [ ], [x, y] ]);
};
GBPoint.X = 0;
GBPoint.Y = 1;


GBPoint.prototype = new GBAbstractPoint();

GBPoint.prototype.draw = function(context) {
  var pos = this.getPosition();
  context.beginPath();
  context.arc(pos[0], pos[1], 3, 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#000";
  context.stroke();
};

GBPoint.prototype.drawSelected = function(context) {
  var pos = this.getPosition();
  this.draw(context);
  context.beginPath();
  context.arc(pos[0], pos[1], 6, 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#339";
  context.stroke();
};

GBPoint.prototype.drawHovering = function(context) {
  var pos = this.getPosition();
  context.beginPath();
  context.arc(pos[0], pos[1], 3, 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#F00";
  context.stroke();
};

GBPoint.prototype.hitTest = function(x, y) {
  var pos = this.getPosition(), dx = pos[0] - x, dy = pos[1] - y;
  return dx * dx + dy * dy < 100;
};

GBPoint.prototype.crossTest = function(l, t, r, b) {
  var pos = this.getPosition();
  return l < pos[0] && pos[0] < r && t < pos[1] && pos[1] < b;
};

GBPoint.prototype.nearestArg = function(x, y) {
  return 0;
};

GBPoint.prototype.drag = function(from, to) {
  this.__params[0] += to[0] - from[0];
  this.__params[1] += to[1] - from[1];
};

GBPoint.prototype.type = function() {
    return "gpo";
};

GBPoint.prototype.getPosition = function() {
  return [ this.__params[GBPoint.X], this.__params[GBPoint.Y] ];
};

gb.geom.gpo = function(id, x, y) { return new GBPoint(id, x, y); };
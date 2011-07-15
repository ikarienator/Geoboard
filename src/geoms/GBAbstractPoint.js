function GBAbstractPoint() {
  Geom.apply(this, arguments);
};
GBAbstractPoint.prototype = new Geom();
GBAbstractPoint.prototype.isPoint = true;
GBAbstractPoint.prototype.color = '#F00';
GBAbstractPoint.prototype.draw = function(context) {
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

GBAbstractPoint.prototype.drawSelected = function(context) {
  var pos = this.getPosition();
  this.draw(context);
  context.beginPath();
  context.arc(pos[0], pos[1], 6, 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#339";
  context.stroke();
};

GBAbstractPoint.prototype.drawHovering = function(context) {
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

GBAbstractPoint.prototype.hitTest = function(x, y) {
  var pos = this.getPosition(), 
      dx = pos[0] - x, 
      dy = pos[1] - y;
  return dx * dx + dy * dy < 100;
};

GBAbstractPoint.prototype.crossTest = function(l, t, r, b) {
  var pos = this.getPosition();
  return l < pos[0] && pos[0] < r && t < pos[1] && pos[1] < b;
};

GBAbstractPoint.prototype.nearestArg = function(x, y) {
  return 0;
};

GBAbstractPoint.prototype.legalArg = function(arg) {
  return arg == 0;
};
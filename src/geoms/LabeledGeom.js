function LabeledGeom () {
  Geom.apply(this, arguments);
}

LabeledGeom.prototype = new Geom();

LabeledGeom.prototype.fontSize = 18;
LabeledGeom.prototype.showLabel = false;
LabeledGeom.prototype.labelX = 10;
LabeledGeom.prototype.labelY = 10;
LabeledGeom.prototype.labelArg = 0;

LabeledGeom.prototype.drawLabel = function (context, hovering) {
  var p = context.transM2P(this.getPosition(this.labelArg)), m;
  p[0] += this.labelX;
  p[1] += this.labelY;
  context.save();
  context.font = this.fontSize + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  m = context.measureText(this.name);
  context.fillStyle = hovering? "#f00" : "#000";
  context.fillText(this.name, p[0] - m.width * 0.5, p[1] - this.fontSize * 0.5);
  context.restore();
};

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Number} dx
 * @param {Number} dy
 */
LabeledGeom.prototype.dragLabel = function (context, dx, dy) {
  this.dirt();
  var p = context.transM2P(this.getPosition(this.labelArg)), q, d;
  p[0] += this.labelX + dx;
  p[1] += this.labelY + dy;
  p = context.transP2M(p);
  q = context.transM2P(this.getPosition(this.labelArg = this.nearestArg(p[0], p[1])));
  p = context.transM2P(p);
  d = Math.sqrt(Geom.dist(p, q));
  p[0] -= q[0];
  p[1] -= q[1];
  if (d > this.fontSize) {
    p[0] *= this.fontSize / d;
    p[1] *= this.fontSize / d;
  }
  this.labelX = p[0];
  this.labelY = p[1];
};

LabeledGeom.prototype.labelHistTest = function (context, x, y) {
  context.save();
  var p = context.transM2P(this.getPosition(this.labelArg)), q = context.transM2P([x, y]), m;
  context.font = this.fontSize + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  m = context.measureText(this.name);
  context.restore();
  p[0] += this.labelX - m.width * 0.5;
  p[1] += this.labelY - this.fontSize * 0.5;
  return p[0] < q[0] && q[0] < p[0] + m.width && p[1] < q[1] && q[1] < p[1] + this.fontSize;
};

/**
 * 
 * @param {GDoc} gdoc
 * @returns {Object}
 */
LabeledGeom.prototype.save = function (gdoc) {
  var me = this, json = Geom.prototype.save.apply(this, [gdoc]);
  json.showLabel = me.showLabel;
  json.labelX = me.labelX;
  json.labelY = me.labelY;
  json.labelArg = me.labelArg;
  json.fontSize = me.fontSize;
  return json;
};

/**
 * @param {Object} json
 * @param {GDoc} gdoc
 */
LabeledGeom.prototype.load = function (json, gdoc) {
  var me = this;
  me.fontSize = json.fontSize || me.fontSize;
  me.showLabel = json.showLabel || me.showLabel;
  me.labelX = json.labelX || me.labelY;
  me.labelY = json.labelY || me.labelY;
  me.labelArg = json.labelArg || me.labelArg;
  Geom.prototype.load.apply(this, [json, gdoc]);
};
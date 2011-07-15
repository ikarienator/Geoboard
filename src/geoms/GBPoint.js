var GBPoint = gb.geom.gpo = function(id, x, y) {
  this.__id = id;
  this.x = x;
  this.y = y;
};

GBPoint.prototype = new Geom();
$.extend(GBPoint.prototype, {
  x : 0,
  y : 0,
  cached : [],
  isPoint : true,
  color : '#F00',
  draw : function(context) {
    var pos = this.getPosition();
    context.beginPath();
    context.arc(pos[0], pos[1], 3, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();
  },

  drawSelected : function(context) {
    var pos = this.getPosition();
    this.draw(context);
    context.beginPath();
    context.arc(pos[0], pos[1], 6, 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = "#339";
    context.stroke();
  },

  drawHovering : function(context) {
    var pos = this.getPosition();
    context.beginPath();
    context.arc(pos[0], pos[1], 3, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#F00";
    context.stroke();
  },

  hitTest : function(x, y) {
    var pos = this.getPosition();
    var dx = pos[0] - x;
    var dy = pos[1] - y;
    return dx * dx + dy * dy < 100;
  },

  crossTest : function(l, t, r, b) {
    var pos = this.getPosition();
    return l < pos[0] && pos[0] < r && t < pos[1] && pos[1] < b;
  },

  nearestArg : function(x, y) {
    return 0;
  },

  drag : function(from, to) {
    this.x += to[0] - from[0];
    this.y += to[1] - from[1];
  },

  id : function() {
    return this.__id;
  },

  type : function() {
    return "gpo";
  },

  getPosition : function() {
    return [ this.x, this.y ];
  },

  load : function(json) {
    this.__id = json.id;
    this.x = json.x;
    this.y = json.y;
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },

  save : function() {
    return {
      id : this.__id,
      x : this.x,
      y : this.y,
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});
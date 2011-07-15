/**
 * @class GBCircle
 * @param {string} id
 * @param {GBPoint} center
 * @param {GBPoint} on
 * @constructor
 */
function GBCircle(id, center, on) {
  this.__id = id;
  this.center = center;
  this.on = on;
};

GBCircle.prototype = new Geom();
$.extend(GBCircle.prototype, {
  color : '#080',
  isCircle : true,
  prop : function() {
    var cen = this.center.getPosition();
    var on = this.on.getPosition();
    var dx = cen[0] - on[0];
    var dy = cen[1] - on[1];
    var r = dx * dx + dy * dy;
    r = Math.sqrt(r);
    return [ cen[0], cen[1], r, [ [ 0, Math.PI * 2 ] ] ];
  },

  draw : function(context) {
    var prop = this.prop();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = this.color;
    context.stroke();
  },

  drawSelected : function(context) {
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
  },

  drawHovering : function(context) {
    var prop = this.prop();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = "#f00";
    context.stroke();
  },

  hitTest : function(x, y) {
    var prop = this.prop();
    var dx = prop[0] - x;
    var dy = prop[1] - y;
    var r = dx * dx + dy * dy;
    r = Math.sqrt(r);
    return r - 3 < prop[2] && prop[2] < r + 3;
  },

  inters : function(obj) {
    if (obj.isLine)
      return obj.inters(this);
    else if (obj.isCircle) {
      var prop1 = this.prop();
      var prop2 = obj.prop();
      var d = Math.sqrt(dist(prop1, prop2));
      var r1 = prop1[2];
      var r2 = prop2[2];
      var d1 = ((r1 * r1 - r2 * r2) / d + d) * 0.5;
      var h = Math.sqrt(r1 * r1 - d1 * d1);
      var dx = prop2[0] - prop1[0];
      var dy = prop2[1] - prop1[1];
      var c1 = [ prop1[0] + (dx * d1 - dy * h) / d, prop1[1] + (dy * d1 + dx * h) / d ];
      var c2 = [ prop1[0] + (dx * d1 + dy * h) / d, prop1[1] + (dy * d1 - dx * h) / d ];
      return [ c1, c2 ];
    }
  },

  crossTest : function(l, t, r, b) {
    var prop = this.prop();
    var ps = [ [ l, b ], [ l, t ], [ r, t ], [ r, b ] ];
    var ds = $.map(ps, function(v, k) {// not k,v !!!!!
      return dist(v, prop);
    });
    var r2 = prop[2] * prop[2];
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
  },

  nearestArg : function(x, y) {
    var c = this.center.getPosition();
    return Math.atan2(y - c[1], x - c[0]);
  },

  dragInvolve : function() {
    return [ this.center, this.on ];
  },

  drag : function(from, to) {

  },

  id : function() {
    return this.__id;
  },

  type : function() {
    return "gci";
  },

  getParents : function() {
    return [ this.center, this.on ];
  },

  getPosition : function(arg) {
    var prop = this.prop();
    return [ prop[0] + Math.cos(arg) * prop[2], prop[1] + Math.sin(arg) * prop[2] ];
  },

  load : function(json, gdoc) {
    this.__id = json.id;
    this.center = gdoc.entities[json.center];
    this.on = gdoc.entities[json.on];
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },

  save : function(json, gdoc) {
    return {
      id : this.__id,
      center : this.center.id(),
      on : this.on.id(),
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  },

  legalArg : function(arg) {
    if (arg < 0)
      return false;
    if (arg > 2 * Math.PI)
      return false;
    return true;
  },

  argRange : function(arg) {
    return [ 0, 2 * Math.PI ];
  },

  randPoint : function() {
    while (true) {
      var arg = Math.random() * 2 * Math.PI;
      if (this.legalArg(arg)) {
        return this.getPosition(arg);
      }
    }
  }
});

gb.geom.gci = GBCircle;
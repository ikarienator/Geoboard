var GBLine = gb.geom.gli = function(id, gpo1, gpo2) {
  this.__id = id;
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
};

GBLine.prototype = new Geom();
$.extend(GBLine.prototype, {
  color : '#008',
  isLine : true,
  draw : function(context) {
    context.beginPath();
    var args = this.crossArg(-5, -5, //
    context.canvas.clientWidth + 5, context.canvas.clientHeight + 5);
    var ps = this.adjustPosition(args);
    context.moveTo(ps[0][0], ps[0][1]);
    context.lineTo(ps[1][0], ps[1][1]);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = this.color;
    context.stroke();
  },

  drawSelected : function(context) {
    context.beginPath();
    var args = this.crossArg(-5, -5, //
    context.canvas.clientWidth + 5, context.canvas.clientHeight + 5);
    var ps = this.adjustPosition(args);
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
  },

  drawHovering : function(context) {
    context.beginPath();
    var args = this.crossArg(-5, -5, //
    context.canvas.clientWidth + 5, context.canvas.clientHeight + 5);
    var ps = this.adjustPosition(args);
    context.moveTo(ps[0][0], ps[0][1]);
    context.lineTo(ps[1][0], ps[1][1]);
    context.closePath();
    context.lineWidth = 4;
    context.strokeStyle = "#F00";
    context.stroke();
  },

  hitTest : function(x, y) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    var fx = p1[0], tx = p2[0];
    var fy = p1[1], ty = p2[1];
    if (fx > tx) {
      var t = fx;
      fx = tx;
      tx = t;
    }
    if (fy > ty) {
      var t = fy;
      fy = ty;
      ty = t;
    }

    var c = cross(p1, [ x, y ], p2);
    c = c * c;
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    if (c > 25 * (dx * dx + dy * dy))
      return false;

    var arg = projArg(p1, p2, [ x, y ]);
    return this.legalArg(arg);
  },

  crossTest : function(l, t, r, b) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    if (p1[1] == p2[1]) {
      var la = (l - p1[0]) / (p2[0] - p1[0]);
      var ra = (r - p1[0]) / (p2[0] - p1[0]);
      var args = this.adjustArg([ la, ra ]);
      if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
        return false;
      return t < p1[1] && p1[1] < b;
    } else if (p1[0] == p2[0]) {
      var ta = (t - p1[1]) / (p2[1] - p1[1]);
      var ba = (b - p1[1]) / (p2[1] - p1[1]);
      var args = [ this.adjustArg(ta), this.adjustArg(ba) ];
      if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
        return false;
      return l < p1[0] && p1[0] < r;
    } else {
      var la = (l - p1[0]) / (p2[0] - p1[0]);
      var ra = (r - p1[0]) / (p2[0] - p1[0]);
      var args = [ this.adjustArg(la), this.adjustArg(ra) ];
      if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
        return false;
      var li = (p2[1] - p1[1]) * args[0] + p1[1];
      var ri = (p2[1] - p1[1]) * args[1] + p1[1];
      if (t < li && li < b)
        return true;
      if (t < ri && ri < b)
        return true;

      var ta = (t - p1[1]) / (p2[1] - p1[1]);
      var ba = (b - p1[1]) / (p2[1] - p1[1]);
      var args = [ this.adjustArg(ta), this.adjustArg(ba) ];
      if (args[0] == args[1] && (args[0] == 0 || args[0] == 1))
        return false;
      var ti = (p2[0] - p1[0]) * args[0] + p1[0];
      var bi = (p2[0] - p1[0]) * args[1] + p1[0];
      return l < ti && ti < r || l < bi && bi < r;
    }
    if (this.adjustArg(args[0]) == this.adjustArg(args[1]))
      return false;
  },

  length : function() {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  },

  projection : function(x, y) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    return projArg(p1, p2, [ x, y ]);
  },

  nearestArg : function(x, y) {
    var d = this.projection(x, y);
    return this.adjustArg(d);
  },

  dragInvolve : function() {
    var d = {};
    $.extend(d, a2m(this.gpo1.dragInvolve()));
    $.extend(d, a2m(this.gpo2.dragInvolve()));
    return m2a(d);
  },

  drag : function(from, to) {

  },

  inters : function(obj) {
    if (obj.isLine)
      return this.intersLine(obj);
    else if (obj.isCircle)
      return this.intersCircle(obj);
    else
      return [];
  },

  intersLine : function(line) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    var p3 = line.__getPosition(0);
    var p4 = line.__getPosition(1);
    var c1 = cross(p3, p1, p2);
    var c2 = cross(p4, p1, p2);
    var c3 = cross(p1, p3, p4);
    var c4 = cross(p2, p3, p4);
    var a1 = c3 / (c3 - c4);
    var a2 = c1 / (c1 - c2);
    if (this.legalArg(a1) && line.legalArg(a2)) {
      return [ this.getPosition(a1) ];
    } else
      return [ [ NaN, NaN ] ];
  },

  intersCircle : function(circ) {
    var prop = circ.prop();
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    var arg = projArg(p1, p2, prop);
    var mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
    var dx = prop[0] - mp[0];
    var dy = prop[1] - mp[1];
    var dist2 = Math.sqrt(prop[2] * prop[2] - (dx * dx + dy * dy)) / this.length();
    var res = [];

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
  },

  id : function() {
    return this.__id;
  },

  type : function() {
    return "gli";
  },

  adjustPosition : function(args) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    args[0] = this.adjustArg(args[0]);
    args[1] = this.adjustArg(args[1]);
    return [ [ p1[0] + (p2[0] - p1[0]) * args[0], p1[1] + (p2[1] - p1[1]) * args[0] ],
        [ p1[0] + (p2[0] - p1[0]) * args[1], p1[1] + (p2[1] - p1[1]) * args[1] ] ];
  },

  legalArg : function(arg) {
    if (arg < 0)
      return false;
    if (arg > 1)
      return false;
    return true;
  },

  getParents : function() {
    return [ this.gpo1, this.gpo2 ];
  },

  argRange : function(arg) {
    return [ 0, 1 ];
  },

  adjustArg : function(arg) {
    if (arg < 0)
      return 0;
    if (arg > 1)
      return 1;
    return arg;
  },

  crossArg : function(l, t, r, b) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    var amin, amax;
    if (p1[0] == p2[0]) {
      amin = (b - p1[1]) / (p2[1] - p1[1]);
      amax = (t - p1[1]) / (p2[1] - p1[1]);
      if (amin > amax) {
        var te = amin;
        amin = amax;
        amax = te;
      }
    } else if (p1[1] == p2[1]) {
      amin = (l - p1[0]) / (p2[0] - p1[0]);
      amax = (r - p1[0]) / (p2[0] - p1[0]);
      if (amin > amax) {
        var te = amin;
        amin = amax;
        amax = te;
      }
    } else {
      var aminx = (l - p1[0]) / (p2[0] - p1[0]);
      var amaxx = (r - p1[0]) / (p2[0] - p1[0]);
      if (aminx > amaxx) {
        var te = aminx;
        aminx = amaxx;
        amaxx = te;
      }
      var aminy = (b - p1[1]) / (p2[1] - p1[1]);
      var amaxy = (t - p1[1]) / (p2[1] - p1[1]);
      if (aminy > amaxy) {
        var te = aminy;
        aminy = amaxy;
        amaxy = te;
      }

      amin = Math.max(aminx, aminy);
      amax = Math.min(amaxx, amaxy);
    }
    return [ amin, amax ];
  },

  getPosition : function(arg) {
    var p1 = this.__getPosition(0);
    var p2 = this.__getPosition(1);
    arg = this.adjustArg(arg);
    return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
  },

  __getPosition : function(arg) {
    if (arg == 0)
      return this.gpo1.getPosition();
    if (arg == 1)
      return this.gpo2.getPosition();
    var p1 = this.gpo1.getPosition();
    var p2 = this.gpo2.getPosition();
    return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
  },

  load : function(json, gdoc) {
    this.__id = json.id;
    this.gpo1 = gdoc.entities[json.p1];
    this.gpo2 = gdoc.entities[json.p2];
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },

  save : function(gdoc) {
    return {
      id : this.__id,
      p1 : this.gpo1.id(),
      p2 : this.gpo2.id(),
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  },

  randPoint : function() {
    while (true) {
      var arg = Math.nrand() + 0.5;
      if (this.legalArg(arg)) {
        return this.__getPosition(arg);
      }
    }
  }
});
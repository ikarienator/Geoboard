var GBLocus = gb.geom.loc = function(id, poo, target) {
  this.__id = id;
  this.poo = poo;
  this.target = target;
};

GBLocus.prototype = new Geom();
$.extend(GBLocus.prototype, {
  color : "#880",
  curve : function() {
    var arg = this.poo.arg;
    var ps = [];
    var range = this.poo.obj.argRange();
    var start = range[0];
    var stop = range[1];
    for ( var i = 0; i <= 100; i++) {
      var curr = start + (stop - start) * 0.01 * i;
      this.poo.arg = curr;
      ps.push(this.target.getPosition());
    }
    this.poo.arg = arg;
    return ps;
  },
  
  dcurve : function() {
    var arg = this.poo.arg;
    var ps = [];
    var range = this.poo.obj.argRange();
    var start = range[0];
    var stop = range[1];
    for ( var i = 1; i <= 100; i++) {
      var curr = start + ((stop - start) * 0.01) * (i - 0.5);
      this.poo.arg = curr;
      ps.push(this.target.getPosition());
    }
    this.poo.arg = arg;
    return ps;
  },
  
  setPath : function(context) {
    var ps = this.curve();
    var dc = this.dcurve();
    context.beginPath();
    context.moveTo(ps[0][0], ps[0][1]);
    for ( var i = 1; i < ps.length; i++) {
      var last = ps[i - 1];
      var top = dc[i - 1];
      var curr = ps[i];
      var a = projArg(last, curr, top);
      var proj = [ (curr[0] - last[0]) * a + last[0], (curr[1] - last[1]) * a + last[1] ];
      top[0] += top[0] - proj[0];
      top[1] += top[1] - proj[1];
      context.quadraticCurveTo(top[0], top[1], curr[0], curr[1]);
    }
  },
  
  draw : function(context) {
    this.setPath(context);
    context.strokeStyle = this.color;
    context.lineWidth = 4;
    context.stroke();
  },
  
  drawSelected : function(context) {
    this.setPath(context);
    context.lineWidth = 8;
    context.strokeStyle = "#44c";
    context.stroke();
    context.lineWidth = 6;
    context.strokeStyle = "#fff";
    context.stroke();
    context.strokeStyle = this.color;
    context.lineWidth = 4;
    context.stroke();
  },

  drawHovering : function(context) {
    this.setPath(context);
    context.lineWidth = 4;
    context.strokeStyle = "#F00";
    context.stroke();
  },

  getParents : function(context) {
    return [ this.poo, this.target ];
  },

  id : function() {
    return this.__id;
  },

  type : function() {
    return "loc";
  },

  load : function(json, gdoc) {
    this.__id = json.id;
    this.poo = gdoc.entities[json.poo];
    this.target = gdoc.entities[json.target];
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },

  save : function(gdoc) {
    return {
      id : this.__id,
      poo : this.poo.id(),
      target : this.target.id(),
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});
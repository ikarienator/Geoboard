var GBPoO = gb.geom.poo = function(id, obj, arg) {
  this.__id = id;
  this.obj = obj;
  this.arg = arg;
};

GBPoO.prototype = new GBPoint();
$.extend(GBPoO.prototype, {
  drag : function(from, to) {
    var p = this.getPosition();
    p[0] += to[0] - from[0];
    p[1] += to[1] - from[1];
    this.arg = this.obj.nearestArg(p[0], p[1]);
  },
  type : function() {
    return "poo";
  },
  getParents : function() {
    return [ this.obj ];
  },
  getPosition : function() {
    return this.obj.getPosition(this.arg);
  },
  load : function(json, gdoc) {
    this.__id = json.id;
    this.obj = gdoc.entities[json.obj];
    this.arg = json.arg;
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },
  save : function(json, gdoc) {
    return {
      id : this.__id,
      obj : this.obj.id(),
      arg : this.arg,
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});

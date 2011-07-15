var GBMidpoint = gb.geom.mpo = function(id, line) {
  this.__id = id;
  this.line = line;
};

GBMidpoint.prototype = new GBPoint();
$.extend(GBMidpoint.prototype, {
  dragInvolve : function() {
    return this.line.dragInvolve();
  },
  drag : function(from, to) {

  },
  type : function() {
    return "mpo";
  },
  getParents : function() {
    return [ this.line ];
  },
  getPosition : function() {
    return this.line.getPosition(0.5);
  },
  load : function(json, gdoc) {
    this.__id = json.id;
    this.line = gdoc.entities[json.line];
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },
  save : function(json, gdoc) {
    return {
      id : this.__id,
      line : this.line.id(),
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});
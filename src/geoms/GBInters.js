function GBInters(id, obj1, obj2, idx) {
  this.__id = id;
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.idx = idx;
};

GBInters.prototype = new GBPoint();
$.extend(GBInters.prototype, {
  dragInvolve : function() {
    var d = {};
    $.each(this.obj1.dragInvolve(), function(k, v) {
      d[v.id()] = v;
    });
    $.each(this.obj2.dragInvolve(), function(k, v) {
      d[v.id()] = v;
    });
    return m2a(d);
  },
  drag : function(from, to) {
  },
  type : function() {
    return "xpo";
  },
  getParents : function() {
    return [ this.obj1, this.obj2 ];
  },
  getPosition : function() {
    var inters = this.obj1.inters(this.obj2);
    if (inters.length == 0)
      return [ NaN, NaN ];
    else if (this.idx < inters.length)
      return inters[this.idx];
    else
      return inters[inters.length - 1];
  },
  load : function(json, gdoc) {
    this.__id = json.id;
    this.obj1 = gdoc.entities[json.obj1];
    this.obj2 = gdoc.entities[json.obj2];
    this.idx = json.idx;
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },
  save : function(json, gdoc) {
    return {
      id : this.__id,
      obj1 : this.obj1.id(),
      obj2 : this.obj2.id(),
      idx : this.idx,
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});

gb.geom['xpo'] = GBInters;
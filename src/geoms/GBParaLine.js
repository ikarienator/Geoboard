var GBParaLine = gb.geom.pal = function(id, gpo1, line) {
  this.__id = id;
  this.gpo1 = gpo1;
  this.line = line;
};

GBParaLine.prototype = new GBXLine();
$.extend(GBParaLine.prototype, {
  __getPosition : function(arg) {
    var base = this.gpo1.getPosition();
    if (arg == 0) {
      return base;
    } else {
      var pos = this.line.__getPosition(1);
      var p0 = this.line.__getPosition(0);
      return [ base[0] + (pos[0] - p0[0]) * arg, base[1] + (pos[1] - p0[1]) * arg ];
    }
  },

  getParents : function() {
    return [ this.gpo1, this.line ];
  },

  dragInvolve : function() {
    return this.gpo1.dragInvolve();
  },

  type : function() {
    return 'pal';
  },

  load : function(json, gdoc) {
    this.__id = json.id;
    this.gpo1 = gdoc.entities[json.p1];
    this.line = gdoc.entities[json.p2];
    this.color = json.color || this.color;
    this.hidden = json.hidden || this.hidden;
    this.size = json.size || this.size;
  },

  /**
   * 
   * @param json
   * @param gdoc
   * @returns {Object}
   */
  save : function(json, gdoc) {
    return {
      id : this.__id,
      p1 : this.gpo1.id(),
      p2 : this.line.id(),
      color : this.color,
      hidden : this.hidden,
      size : this.size
    };
  }
});

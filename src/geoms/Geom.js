gb.geom = {};
var Geom = gb.geom.Geom = function() {
};

Geom.prototype = {
  color : '#000',
  hidden : false,
  size : 4,
  draw : function() {

  },
  drawHovering : function() {

  },
  drawSelected : function() {

  },
  hitTest : function() {
    return false;
  },
  crossTest : function(l, t, r, b) {
    return false;
  },
  nearestArg : function(x, y) {
    throw 'nearestArg(x,y) not implemented';
  },
  dragInvolve : function() {
    return [ this ];
  },
  drag : function() {
  },
  id : function() {
    throw 'id() not implemented';
  },
  type : function() {
    throw 'type() not implemented';
  },
  /**
   * 
   * @param gdoc
   * @returns {Object}
   */
  save : function(gdoc) {
    throw 'save(gdoc) not implemented';
  },
  /**
   * @param {Object} json
   * @param {GDoc} gdoc
   */
  load : function(json, gdoc) {
    throw 'load(json, gdoc) not implemented';
  },
  getParents : function() {
    return [];
  },
  randPoint : function() {
    throw 'randPoint() not implemented';
  }
};

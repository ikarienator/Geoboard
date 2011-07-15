/**
 * 
 * @param {string} id
 * @param {Array} parents
 * @constructor
 */
function Geom(id, parents, params) {
  this.__id = id;
  this.__parents = parents || [];
  this.__params = params || [];
};

Geom.prototype = {
  color : '#000',
  hidden : false,
  size : 4,
  __id : null,
  __parents : null,
  __params : null,
  
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
  
  drag : function(fx, fy, tx, ty) {
    
  },
  
  id : function () {
    return this.__id;
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
    return {
      color : this.color,
      hidden : this.hidden,
      size : this.size,
      parents : $.map(this.__parents, function(v) { return v.id(); }),
      params : this.params.slice(0)
    };
  },
  
  /**
   * @param {Object} json
   * @param {GDoc} gdoc
   */
  load : function(json, gdoc) {
    me.color = json.color || me.color;
    me.hidden = json.hidden || me.hidden;
    me.size = json.size || me.size;
    me.parents = $.map(json.__parents, function(v) { return gdoc.get(v); });
    me.params = json.params.slice(0);
  },
  
  getParents : function() {
    return this.__parents;
  },
  
  getParent : function (index) {
    return this.__parents[index];
  },
  
  setParent : function (index, value) {
    this.__parents[index] = value;
  },
  
  getParam : function (index) {
    return this.__params[index];
  },
  
  setParam : function (index, value) {
    this.__params[index] = value;
  },
  
  getPosition : function (arg) {
    throw 'getPosition(arg) not implemented';
  },
  
  randPoint : function() {
    throw 'randPoint() not implemented';
  }
};

gb.geom = {};

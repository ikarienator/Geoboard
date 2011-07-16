/**
 * 
 * @param {string}
 *          id
 * @param {Array}
 *          parents
 * @constructor
 */
function Geom (id, parents, params) {
  this.id = id;
  this.__parents = parents || [];
  this.__params = params || [];
  this.__children = {};
};

Geom.prototype = {
  color : '#000',
  hidden : false,
  size : 4,
  __parents : null,
  __params : null,
  __children : null,
  __dirty : false,
  
  draw : function () {

  },

  drawHovering : function () {

  },

  drawSelected : function () {

  },

  hitTest : function (x, y) {
    return false;
  },

  inters : function () {
    return [];
  },
  
  crossTest : function (l, t, r, b) {
    return false;
  },

  nearestArg : function (x, y) {
    throw 'nearestArg(x,y) not implemented';
  },

  dragInvolve : function () {
    return [ this ];
  },

  drag : function (fx, fy, tx, ty) {

  },

  type : function () {
    throw 'type() not implemented';
  },
  /**
   * 
   * @param gdoc
   * @returns {Object}
   */
  save : function (gdoc) {
    return {
      id : this.id,
      color : this.color,
      hidden : this.hidden,
      size : this.size,
      parents : $.map(this.__parents, function (v) {
        return v.id;
      }),
      params : this.__params.slice(0)
    };
  },

  /**
   * @param {Object}
   *          json
   * @param {GDoc}
   *          gdoc
   */
  load : function (json, gdoc) {
    var me = this;
    me.id = json.id;
    me.color = json.color || me.color;
    me.hidden = json.hidden || me.hidden;
    me.size = json.size || me.size;
    me.__parents = $.map(json.parents, function (v) {
      return gdoc.get(v);
    });
    me.__params = json.params.slice(0);
    me.dirt();
  },

  getParents : function () {
    return this.__parents;
  },

  /**
   * 
   * @param index
   * @returns {Geom}
   */
  getParent : function (index) {
    return this.__parents[index];
  },

  setParent : function (index, value) {
    this.__parents[index] = value;
    this.dirt();
  },

  getParam : function (index) {
    return this.__params[index];
  },

  setParam : function (index, value) {
    this.__params[index] = value;
    this.dirt();
  },

  getPosition : function (arg) {
    throw 'getPosition(arg) not implemented';
  },

  randPoint : function () {
    throw 'randPoint() not implemented';
  },
  
  dirt : function () {
    if (this.__dirty) return;
    this.__dirty = true;
    $.each(this.__children, function(k, v){
      v.dirt();
    });
  },
  
  update : function () {
    if (!this.__dirty) return;
    $.each(this.__parents, function(k, v){
      v.update();
    });
    this.__dirty = false;
  },
  
  ancestors : function (){
    var result = {}, q = m2a(this.__parents.slice(0)), qi = 0, curr;
    while(qi < q.length) {
      curr = q[qi ++];
      $.each(curr.__parents, function (k, v) {
        if (!result[v.id]) {
          result[v.id] = v;
          q.push(v);
        }
      });
    }
    return q;
  },
  
  descendants : function () {
    var result = {}, q = m2a(this.__children), qi = 0, curr;
    while(qi < q.length) {
      curr = q[qi ++];
      $.each(curr.__children, function (k, v) {
        if (!result[v.id]) {
          result[v.id] = v;
          q.push(v);
        }
      });
    }
    return q;
  }
};

gb.geom = {};

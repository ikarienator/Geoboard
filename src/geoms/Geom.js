/**
 * @constructor
 * @class Geom
 * @param {GDoc} document
 * @param {Array} parents
 * @param {Array}params
 */
function Geom (document, parents, params) {
  if (document){
    this.document = document;
    this.id = document.nextId();
    this.__parents = parents || [];
    this.__params = params || [];
    this.__children = {};
  }
}

Geom.cross = function (p1, p2, p3) {
  return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
};

Geom.dist = function (p1, p2) {
  var dx = p1[0] - p2[0], dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
};

Geom.projArg = function (p1, p2, p3) {
  var x = p3[0], y = p3[1], k, ik;
  if (Math.abs(p1[1] - p2[1]) < 1e-10) {
    return (x - p1[0]) / (p2[0] - p1[0]);
  } else if (Math.abs(p1[0] - p2[0]) < 1e-10) {
    return (y - p1[1]) / (p2[1] - p1[1]);
  }
  k = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  ik = 1 / k;
  x = (y - p1[1]) + k * p1[0] + x * ik;
  x /= ik + k;
  return (x - p1[0]) / (p2[0] - p1[0]);
};

/**
 * @constructor 
 * @class GIC
 * @param {Object} desc
 * @param {GBPoO} poo
 * @param {GBAbstractPoint} target
 * @param {Object} ance
 */
function GIC(desc, poo, target, ance) {
  this.desc = desc;
  this.poo = poo;
  this.target = target;
  this.ance = ance;
}

/**
 * Create a function to deduce target position from poo (if presented)
 * @param {GDoc} gdoc
 * @param {GBPoO} poo
 * @param {GBAbstractPoint} target
 * @return {Function}
 */
Geom.calculas = function(gdoc, poo, target) {
  poo = poo || target;
  var desc = gb.utils.a2m(poo.descendants()), 
      ance = gb.utils.a2m(target.ancestors()),
      context = new GIC(desc, poo, target, ance),
      text = ['(function(gdoc){ var revision = 0; '];
  gdoc.topoFor(function(k, v){
    if (context.ance[v.id]) {
      text.push(v.getInstruction(context));
    }
  });
  text.push('return (function(___arg) {');
  if (poo) {
    text.push(poo.id + '_arg = ___arg; revision++; ');
  } 
  text.push('return ');
  text.push(target.getInstructionRef('', context));
  text.push(';});})');
  return text.join('');
};

Geom.prototype = {
  color : '#000',
  hidden : false,
  size : 4,
  name : '',
  __parents : null,
  __params : null,
  __children : null,
  __dirty : true,
  
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

  /**
   * 
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */
  nearestArg : function (x, y) {
    throw 'nearestArg(x,y) not implemented';
    return 0;
  },

  dragInvolve : function () {
    return [ this ];
  },

  drag : function (from, to) {

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
    var me = this;
    return {
      id : me.id,
      color : me.color,
      hidden : me.hidden,
      size : me.size,
      name : me.name,
      showLabel : me.showLabel,
      labelX : me.labelX,
      labelY : me.labelY,
      labelArg : me.labelArg,
      parents : $.map(me.__parents, function (v) {
        return v.id;
      }),
      params : me.__params.slice(0)
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
    me.document = gdoc;
    me.id = json.id;
    me.name = json.name;
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
    var result = {}, q = [this], qi = 0, curr;
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
    var result = {}, q = [this], qi = 0, curr;
    while(qi < q.length) {
      curr = q[qi++];
      $.each(curr.__children, function (k, v) {
        if (!result[v.id]) {
          result[v.id] = v;
          q.push(v);
        }
      });
    }
    return q;
  },
  
  getInstruction : function () {
    throw 'getInstruction() not implemented';
  },
  
  getInstructionRef : function (arg, isStatic) {
    throw 'getInstructionRef(arg, isStatic) not implemented';
  },
  
  getIntersInstruction : function(obj, isStatic1, isStatic2) {
    throw 'getIntersInstruction(obj, isStatic1, isStatic2) not implemented';
  },
  
  getIntersInstructionRef : function(obj, isStatic1, isStatic2) {
    
  },
  
  legalArgInstructionRef : function (isStatic) {
    throw 'legalArgInstructionRef(isStatic) not implemented';
  },
  
  isClosed : function () {
    return false;
  },
  
  phantom : function () {
    return false;
  },
  
  sector : function () {
    
  },
  
  getName : function () {
    if (this.name == '') {
      if (this.isPoint){
        this.name = this.document.nextPointLabel();
      } else {
        this.name = this.document.nextLineLabel();
      }
      this.dirt();
    }
    return this.name;
  },
  
  setName : function (name) {
    this.name = name;
    this.dirt();
  }
};

/**
 * @namespace gb.geom
 */
gb.geom = {};

/**
 * @private
 */
gb.geom.cc = function (klass) {
  function psklass () {}
  psklass.prototype = new klass();
  return function() {
    var inst = new psklass();
    klass.apply(inst, arguments);
    return inst;
  };
};

/**
 * @param {Function} klass
 */
gb.geom.reg = function (klass) {
  gb.geom[(new klass()).type()] = gb.geom.cc(klass);
};
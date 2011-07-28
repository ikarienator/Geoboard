function GBInters (document, obj1, obj2, idx) {
  GBAbstractPoint.apply(this, [document, [obj1, obj2], [idx]]);
  this.cache = [];
};

GBInters.prototype = new GBAbstractPoint();

GBInters.prototype.dragInvolve = function () {
  var d = {};
  $.each(this.getParent(0).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  $.each(this.getParent(1).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  return m2a(d);
};

GBInters.prototype.type = function () {
  return "xpo";
};

GBInters.prototype.getPosition = function () {
  if (this.__dirty) {
    var inters = this.getParent(0).inters(this.getParent(1));
    if (this.getParam(0) < inters.length)
      return inters[this.getParam(0)];
    else
      return [ NaN, NaN ];
  }
  return this.cache;
};

GBInters.prototype.update = function() {
  if (this.__dirty) {
    this.cache = this.getPosition();
    Geom.prototype.update.apply(this, []);
  }
};

GBInters.prototype.getInstruction = function (context) {
  return ['var ', this.id , '_revision = -1, ', this.id, '_cache = [NaN, NaN]; ',
          'var ' , this.id , '=' , this.getParent(0).getIntersInstruction(this.getParent(1), context, this.getParam(0), this.id) , ';'].join('');
};

GBInters.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.id + '(' + arg + ')';
};

gb.geom.xpo = function (gdoc, obj1, obj2, idx) {
  return new GBInters(gdoc, obj1, obj2, idx);
};
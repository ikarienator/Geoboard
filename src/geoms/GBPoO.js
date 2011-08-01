function GBPoO(document, obj, arg) {
  GBAbstractPoint.apply(this, [document, [obj], [arg]]);
}

GBPoO.prototype = new GBAbstractPoint();

GBPoO.prototype.drag = function(from, to) {
  var p = this.getPosition();
  p[0] += to[0] - from[0];
  p[1] += to[1] - from[1];
  this.setParam(0, this.getParent(0).nearestArg(p[0], p[1]));
  this.dirt();
};

GBPoO.prototype.type = function() {
  return "poo";
};

GBPoO.prototype.getPosition = function() {
  if (this.__dirty) {
    return this.getParent(0).getPosition(this.getParam(0));
  } 
  return this.cache;
};

GBPoO.prototype.getInstruction = function () {
  return 'var ' + this.id + '_arg=gdoc.get("' + this.id + '").__params[0];';
};


GBPoO.prototype.getInstructionRef = function (arg, context) {
  if(!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.getParent(0).getInstructionRef(this.id + '_arg', context);
};

gb.geom.reg(GBPoO);
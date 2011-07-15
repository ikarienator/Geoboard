var GBXLine = gb.geom.xli = function(id, gpo1, gpo2) {
  this.__id = id;
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
};

GBXLine.prototype = new GBLine();
$.extend(GBXLine.prototype, {
  adjustArg : function(arg) {
    return arg;
  },
  getParents : function() {
    return [ this.gpo1, this.gpo2 ];
  },
  legalArg : function(arg) {
    return true;
  },

  argRange : function(arg) {
    return this.crossArg(-800, -600, 1600, 1200);
  },

  type : function() {
    return 'xli';
  }
});
var GBRay = gb.geom.ray = function(id, gpo1, gpo2) {
  this.__id = id;
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
};

GBRay.prototype = new GBLine();
$.extend(GBRay.prototype, {
  adjustArg : function(arg) {
    if (arg < 0)
      return 0;
    return arg;
  },

  legalArg : function(arg) {
    return arg >= 0;
  },

  argRange : function(arg) {
    return [ 0, 100 ];
  },
  
  type : function() {
    return 'ray';
  }
});
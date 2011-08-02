function LineAction() {
  this.init();
};

LineAction.prototype = new Action();
$.extend(LineAction.prototype, {
  text : '<img src="images/line.svg" title="Line"/>',
  init : function() {
    var me = this;
    me.pointAction = new PointAction();
    me.pointAction.onNewPoint = function(np) {
      if (me.status == 0)
        me.p1 = np;
      else if (me.status == 1)
        me.p2 = np;
    };
    me.reset();
  },
  
  reset : function() {
    var me = this;
    me.status = 0;
    me.p1 = null;
    me.p2 = null;
    me.pointAction.reset();
  },
  
  mouseMove : function(gdoc, x, y) {
    var me = this, context, p1;
    switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y);
      context = gdoc.context;
      context.beginPath();
      p1 = me.p1.getPosition();
      context.moveTo(p1[0], p1[1]);
      context.lineTo(me.pointAction.current[0], me.pointAction.current[1]);
      context.closePath();
      context.strokeStyle = "#99d";
      context.lineWidth = context.transP2M(2);
      context.stroke();
      break;
    }
  },
  
  mouseUp : function(gdoc, x, y) {
    var me = this;
    if (me.status == 1) {
      this.mouseDown(gdoc, x, y);
    }
    this.mouseMove(gdoc, x, y);
  },
  
  mouseDown : function(gdoc, x, y) {
    var me = this, already = false;
    switch (me.status) {
    case 0:
      me.pointAction.mouseDown(gdoc, x, y);
      me.status = 1;
      break;
    case 1:
      me.pointAction.mouseDown(gdoc, x, y);
      if (me.p1 === me.p2)
        break;
      me.status = 0;
      $.each(gb.utils.join(me.p1.__children, me.p2.__children), function (k, v) {
        if (v.type() == 'gli') {
          already = v;
          return false;
        }
      });
      if(already) {
        if (!gdoc.showHidden)
          gdoc.showHidden = true;
        gdoc.selection = {};
        gdoc.selection[already.id] = already;
      }
      else 
        gdoc.run(new ConstructLineCommand(me.p1, me.p2));
      break;
    }
  }
});

gb.tools['line'] = new LineAction();
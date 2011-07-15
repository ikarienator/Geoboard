function LineAction() {
  this.init();
};

LineAction.prototype = new GBAction();
$.extend(LineAction.prototype, {
  text : '<img src="images/line.svg"/>',
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
    var me = this, con, p1;
    switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y);
      con = gdoc.context;
      con.beginPath();
      p1 = me.p1.getPosition();
      con.moveTo(p1[0], p1[1]);
      con.lineTo(me.pointAction.current[0], me.pointAction.current[1]);
      con.closePath();
      con.strokeStyle = "#99d";
      con.lineWidth = 2;
      con.stroke();
      break;
    }
  },
  mouseUp : function(gdoc, x, y) {
    var me = this;
    if (me.status == 1) {
      me.pointAction.mouseDown(gdoc, x, y);
      if (me.p1 !== me.p2) {
        gdoc.run(new ConstructLineCommand(me.p1, me.p2));
        me.status = 0;
      }
    }
  },
  mouseDown : function(gdoc, x, y) {
    var me = this;
    switch (me.status) {
    case 0:
      me.pointAction.mouseDown(gdoc, x, y);
      me.status = 1;
      break;
    case 1:
      me.pointAction.mouseDown(gdoc, x, y);
      me.status = 0;
      if (me.p1 === me.p2)
        break;
      gdoc.run(new ConstructLineCommand(me.p1, me.p2));
      break;
    }
  }
});

gb.tools['line'] = new LineAction();
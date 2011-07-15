function CircleAction() {
  this.init();
};

CircleAction.prototype = new GBAction();
$.extend(CircleAction.prototype, {
  text : '<img src="images/circ.svg"/>',
  init : function() {
    var me = this;
    me.pointAction = new PointAction();
    me.pointAction.onNewPoint = function(np) {
      if (me.status == 0) {
        me.p1 = np;
        me.p2 = np;
      } else if (me.status == 1)
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
    var me = this, con, p1, p2, dx, dy;
    switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y);
      con = gdoc.context;
      con.beginPath();
      x = me.pointAction.current[0];
      y = me.pointAction.current[1];
      p1 = me.p1.getPosition();
      p2 = [ x, y ];
      dx = p2[0] - p1[0];
      dy = p2[1] - p1[1];
      con.arc(p1[0], p1[1], Math.sqrt(dx * dx + dy * dy), 0, Math.PI * 2, false);
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
        gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
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
      gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
      break;
    }
  }
});

gb.tools['circ'] = new CircleAction();
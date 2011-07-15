var CircleAction = function() {
  this.init();
};

CircleAction.prototype = new GBAction();
$.extend(CircleAction.prototype, {
  text : '<img src="images/circ.svg"/>',
  init : function() {
    this.pointAction = new PointAction();
    var me = this;
    this.pointAction.onNewPoint = function(np) {
      if (me.status == 0) {
        me.p1 = np;
        me.p2 = np;
      } else if (me.status == 1)
        me.p2 = np;
    };
    this.reset();
  },
  reset : function() {
    this.status = 0;
    this.p1 = null;
    this.p2 = null;
    this.pointAction.reset();
  },
  mouseMove : function(gdoc, x, y) {
    switch (this.status) {
    case 0:
      this.pointAction.mouseMove(gdoc, x, y);
      break;
    case 1:
      this.pointAction.mouseMove(gdoc, x, y);
      var con = gdoc.context;
      con.beginPath();
      x = this.pointAction.current[0];
      y = this.pointAction.current[1];
      var p1 = this.p1.getPosition();
      var p2 = [ x, y ];
      var dx = p2[0] - p1[0];
      var dy = p2[1] - p1[1];
      con.arc(p1[0], p1[1], Math.sqrt(dx * dx + dy * dy), 0, Math.PI * 2, false);
      con.closePath();
      con.strokeStyle = "#99d";
      con.lineWidth = 2;
      con.stroke();
      break;
    }
  },
  mouseUp : function(gdoc, x, y) {
    if (this.status == 1) {
      this.pointAction.mouseDown(gdoc, x, y);
      if (this.p1 !== this.p2) {
        var cmd = new ConstructCircleCommand(this.p1, this.p2);
        gdoc.run(cmd);
        this.status = 0;
      }
    }
  },
  mouseDown : function(gdoc, x, y) {
    switch (this.status) {
    case 0:
      this.pointAction.mouseDown(gdoc, x, y);
      this.status = 1;
      break;
    case 1:
      this.pointAction.mouseDown(gdoc, x, y);
      this.status = 0;
      if (this.p1 === this.p2)
        break;
      var cmd = new ConstructCircleCommand(this.p1, this.p2);
      gdoc.run(cmd);
      break;
    }
  }
});

gb.tools['circ'] = new CircleAction();
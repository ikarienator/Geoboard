/**
 * @class CircleAction
 * @inherits GBAction
 */

function CircleAction() {
  this.init();
}

CircleAction.prototype = new Action();
CircleAction.prototype.text = '<img type="image/svg+xml" src="images/circ.svg" title="Circle"/>';

CircleAction.prototype.init = function() {
  var me = this;
  (me.pointAction = new PointAction()).registerOnNewPoint(function(np) {
    if (me.status == 0) {
      me.p1 = np;
      me.p2 = np;
    } else if (me.status == 1)
      me.p2 = np;
  });
  me.reset();
};

CircleAction.prototype.reset = function() {
  var me = this;
  me.status = 0;
  me.p1 = null;
  me.p2 = null;
  me.pointAction.reset();
};

CircleAction.prototype.mouseMove = function(gdoc, x, y, ev) {
  var me = this, context, p1, p2, dx, dy;
  switch (me.status) {
  case 0:
    me.pointAction.mouseMove(gdoc, x, y, ev);
    break;
  case 1:
    me.pointAction.mouseMove(gdoc, x, y, ev);
    context = gdoc.context;
    context.beginPath();
    x = me.pointAction.current[0];
    y = me.pointAction.current[1];
    p1 = me.p1.getPosition();
    p2 = [ x, y ];
    dx = p2[0] - p1[0];
    dy = p2[1] - p1[1];
    context.arc(p1[0], p1[1], Math.sqrt(dx * dx + dy * dy), 0, Math.PI * 2, false);
    context.closePath();
    context.strokeStyle = "#99d";
    context.lineWidth = context.transP2M(2);
    context.stroke();
    break;
  }
};
  
CircleAction.prototype.mouseUp = function(gdoc, x, y, ev) {
  var me = this;
  if (me.status == 1) {
    me.pointAction.mouseUp(gdoc, x, y, ev);
    if (me.p1 !== me.p2) {
      gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
      me.status = 0;
    }
  }
};
  

CircleAction.prototype.mouseDown = function(gdoc, x, y, ev) {
  var me = this;
  switch (me.status) {
  case 0:
    me.pointAction.mouseUp(gdoc, x, y, ev);
    me.status = 1;
    break;
  case 1:
    me.pointAction.mouseUp(gdoc, x, y, ev);
    me.status = 0;
    if (me.p1 === me.p2)
      break;
    gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
    break;
  }
}

gb.tools['circ'] = new CircleAction();
/**
 * @class LineAction
 * @extends Action
 */
function LineAction() {
  this.init();
}

LineAction.prototype = new Action();
LineAction.prototype.text = '<img src="images/line.svg" title="Line"/>';
LineAction.prototype.init = function() {
  var me = this;
  (me.pointAction = new PointAction()).registerOnNewPoint(function(np) {
    if (me.status == 0) {
      me.p1 = np;
      me.pointAction.basePoint = np;
    } else if (me.status == 1) {
      me.p2 = np;
    }

  });
  me.reset();
};

LineAction.prototype.reset = function() {
  var me = this;
  me.status = 0;
  me.p1 = null;
  me.p2 = null;
  me.pointAction.reset();
};

LineAction.prototype.mouseMove = function(gdoc, x, y, ev) {
  var me = this, context, p1;
  switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      context = gdoc.context;
      context.beginPath();
      if (me.p1) {
        p1 = me.p1.getPosition();
        context.moveTo(p1[0], p1[1]);
        context.lineTo(me.pointAction.current[0], me.pointAction.current[1]);
        context.closePath();
        context.strokeStyle = "#99d";
        context.lineWidth = context.transP2M(2);
        context.stroke();
      }
      break;
  }
};

LineAction.prototype.mouseUp = function(gdoc, x, y, ev) {
  var me = this;
  if (me.status == 1) {
    this.mouseDown(gdoc, x, y, ev);
  }
  this.mouseMove(gdoc, x, y, ev);
};

LineAction.prototype.mouseDown = function(gdoc, x, y, ev) {
  var me = this, already = false;
  switch (me.status) {
    case 0:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      me.status = 1;
      break;
    case 1:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      if (me.p1 === me.p2)
        break;
      me.status = 0;
      me.pointAction.reset();
      $.each(gb.utils.join(me.p1.__children, me.p2.__children), function (k, v) {
        if (v.type() == 'gli') {
          already = v;
          return false;
        }
      });
      if (already) {
        if (!gdoc.showHidden)
          gdoc.showHidden = true;
        gdoc.selection = {};
        gdoc.selection[already.id] = already;
      }
      else
        gdoc.run(new ConstructLineCommand(me.p1, me.p2));
      break;
  }
};

gb.tools['line'] = new LineAction();
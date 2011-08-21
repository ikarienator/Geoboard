function PointAction() {
  this.init();
}

PointAction.prototype = new Action();

/**
 * @static
 */
PointAction.prototype.text = '<img src="images/point.svg" title="Point"/>';
PointAction.prototype.color = '#f00';

/**
 * @type {Geom}
 */
PointAction.prototype.found = null;

/**
 * @type {Array}
 */
PointAction.prototype.current = null;
/**
 * @private
 * @type {Array}
 */
PointAction.prototype._onNewPoint = [];

/**
 * @param {Function} callback
 */
PointAction.prototype.registerOnNewPoint = function (callback) {
  this._onNewPoint.push(callback);
};

PointAction.prototype.init = function () {
  this.reset();
};

PointAction.prototype.reset = function () {
  this.current = [ 0, 0 ];
  this.found = null;
  this.status = 0;
  this.basePoint = null;
  this.cmd = null;
};

PointAction.prototype.adjust = function () {
  var me = this, plast, ds, mi = 0, min;
  if (me.basePoint) {
    plast = me.basePoint.getPosition();
    ds = [
      me.current[0] - plast[0],
      me.current[1] - plast[1],
      (me.current[0] + me.current[1] - plast[0] - plast[1]) * Math.SQRT1_2,
      (me.current[0] - me.current[1] - plast[0] + plast[1]) * Math.SQRT1_2
    ];
    min = ds[0];
    for (var i = 1; i < 4; i++) {
      if (Math.abs(min) > Math.abs(ds[i])) {
        min = ds[mi = i];
      }
    }
    switch (mi) {
      case 0:
        me.current[0] -= min;
        break;
      case 1:
        me.current[1] -= min;
        break;
      case 2:
        me.current[0] -= min * Math.SQRT1_2;
        me.current[1] -= min * Math.SQRT1_2;
        break;
      case 3:
        me.current[0] -= min * Math.SQRT1_2;
        me.current[1] += min * Math.SQRT1_2;
        break;
    }
  }
};

PointAction.prototype.snap = function (gdoc) {
  var me = this, context = gdoc.context, po, radius = context.transP2M(gdoc.mouse[2]);
  me.cmd = null;
  if (me.found.length == 1) {
    var target = me.found[0];
    if (target.isPoint) {
      context.beginPath();
      context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
      context.closePath();
      context.lineWidth = context.transP2M(1);
      context.strokeStyle = "#F00";
      context.stroke();
      return;
    }
    if (target.type() == 'gli') {
      po = target.getPosition(0.5);
      if (Geom.dist(me.current, po) < radius) {
        me.current = po;
        context.beginPath();
        context.moveTo(me.current[0], me.current[1] - radius * 2);
        context.lineTo(me.current[0] - radius * Math.sqrt(3), me.current[1] + radius);
        context.lineTo(me.current[0] + radius * Math.sqrt(3), me.current[1] + radius);
        context.closePath();
        context.lineWidth = context.transP2M(2);
        context.strokeStyle = "#880";
        context.stroke();
        context.fillStyle = "black";
        context.font = radius * 2 + "px Arial";
        context.fillText("Midpoint", po[0] + radius * 2, po[1] + radius * 2);
        me.cmd = new ConstructMidpointCommand(me.found[0]);
        return;
      }
    }
    if (me.basePoint) {
      if (target.isLine) {
        // Test for perpendicular line
        po = me.basePoint.getPosition(0);
        po = target.getPosition(target.nearestArg(po[0], po[1]));
        if (Geom.dist(me.current, po) < radius) {
          me.current = po;
          context.beginPath();
          context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
          context.closePath();
          context.lineWidth = context.transP2M(1);
          context.strokeStyle = "#0F0";
          context.stroke();
          context.fillStyle = "black";
          context.font = radius * 2 + "px Arial";
          context.fillText("Perpendicular", po[0] + radius * 2, po[1] + radius * 2);
          me.cmd = new ConstructProjectionPoint(me.found[0], me.basePoint);
          return;
        }
      }
    }
    me.cmd = new ConstructPoOCommand(me.found[0], me.found[0].nearestArg(me.current[0], me.current[1]));
    return;
  } else if (me.found.length >= 2) {
    context.beginPath();
    context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#0F0";
    context.stroke();
    me.cmd = new ConstructIntersectionCommand(me.found[0], me.found[1], me.current[2]);
    return;
  }
};

PointAction.prototype.mouseMove = function (gdoc, x, y, ev) {
  var me = this, test = gdoc.hitTest(x, y), context = gdoc.context;
  this.found = test.found;
  this.current = test.current;

  gdoc.draw();
  $.each(me.found, function (k, v) {
    v.drawHovering(context);
  });

  me.snap(gdoc);

  if (!me.cmd) {
    if (me.found.length == 0) {
      if (ev.shiftKey) me.adjust(ev);
      me.cmd = new ConstructPointCommand(test.current[0], test.current[1]);
    }
  }


  context.beginPath();
  context.arc(me.current[0], me.current[1], context.transP2M(3), 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = context.transP2M(1);
  context.strokeStyle = "#000";
  context.stroke();
};

PointAction.prototype.fireOnNewPoint = function (np) {
  $.each(this._onNewPoint, function(k, callback) {
    callback(np);
  });
}
/**
 * @param {GDoc} gdoc
 * @param {Number} x
 * @param {Number} y
 * @param {Event} ev
 */
PointAction.prototype.mouseUp = function (gdoc, x, y, ev) {
  var me = this;
  me.mouseMove(gdoc, x, y, ev);
  if (me.cmd) {
    gdoc.run(me.cmd);
    me.fireOnNewPoint(me.cmd.newObjects[0]);
    gdoc.draw();
  } else {
    me.fireOnNewPoint(me.found[0]);
  }
  me.mouseMove(gdoc, x, y, ev);
};

gb.tools['point'] = new PointAction();
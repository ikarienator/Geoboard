function PointAction() {
  this.init();
};

PointAction.prototype = new GBAction();

PointAction.prototype.text = '<img src="images/point.svg"/>';
PointAction.prototype.color = '#f00';
PointAction.prototype.found = null;
PointAction.prototype.current = null;
PointAction.prototype.init = function () {
  this.reset();
};
PointAction.prototype.reset = function () {
  this.current = [ 0, 0 ];
  this.found = null;
};
PointAction.prototype.mouseMove = function (gdoc, x, y) {
  var test = gdoc.hitTest(x, y), context = gdoc.context;
  this.found = test.found;
  this.current = test.current;
  gdoc.draw();

  if (test.found.length <= 2)
    $.each(test.found, function (k, v) {
      v.drawHovering(context);
    });

  if (test.found[0] && test.found[0].isPoint) {
    context.beginPath();
    context.arc(test.current[0], test.current[1], 6, 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = "#F00";
    context.stroke();
  }

  context.beginPath();
  context.arc(test.current[0], test.current[1], 5, 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#000";
  context.stroke();
};
/**
 * @param {gdoc}
 *          gdoc
 */
PointAction.prototype.mouseDown = function (gdoc, x, y) {
  var test = gdoc.hitTest(x, y), cmd, arg, np;
  this.found = test.found;
  this.current = test.current;
  if (test.found.length == 1) {
    if (test.found[0].isPoint) {
      np = test.found[0];
      this.lastPoint = np;
      if (this.onNewPoint)
        this.onNewPoint(np);
      return;
    } else {
      arg = test.found[0].nearestArg(test.current[0], test.current[1]);
      cmd = new ConstructPoOCommand(test.found[0], arg);
      gdoc.run(cmd);
      np = this.lastPoint = cmd.np;
      if (this.onNewPoint) {
        if (false == this.onNewPoint(np))
          return;
      }
      gdoc.draw();
    }
  } else if (test.found.length == 2) {
    cmd = new ConstructIntersectionCommand(test.found[0], test.found[1], test.current[0], test.current[1]);
    gdoc.run(cmd);
    np = cmd.np;
    this.lastPoint = np;
    if (this.onNewPoint) {
      if (false == this.onNewPoint(np))
        return;
    }
    gdoc.draw();
  } else if (test.found.length == 0) {
    cmd = new ConstructPointCommand(test.current[0], test.current[1]);
    gdoc.run(cmd);
    np = cmd.np;
    this.lastPoint = np;
    if (this.onNewPoint) {
      if (false == this.onNewPoint(np))
        return;
    }
    gdoc.draw();
  }
};

gb.tools['point'] = new PointAction();
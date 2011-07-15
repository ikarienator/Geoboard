function GBLocus (id, poo, target) {
  Geom.apply(this, [ id, [ poo, target ] ]);
};

GBLocus.POO = 0;
GBLocus.TARGET = 0;

GBLocus.prototype = new Geom();
GBLocus.prototype.color = "#880";
GBLocus.prototype.__curve = function () {
  var arg = this.getParent(GBLocus.POO).getParam(0),
      ps1 = [], ps2 = [], curr1, curr2, i,
      range = this.getParent(GBLocus.POO).getParent(0).argRange(), start = range[0], stop = range[1];
  for (i = 0; i <= 100; i++) {
    curr1 = start + (stop - start) * 0.01 * i;
    curr2 = start + ((stop - start) * 0.01) * (i - 0.5);
    this.getParent(GBLocus.POO).setParam(0, curr1);
    ps1.push(this.getParent(GBLocus.TARGET).getPosition());
    this.getParent(GBLocus.POO).setParam(0, curr2);
    ps2.push(this.getParent(GBLocus.TARGET).getPosition());
  }
  this.getParent(GBLocus.POO).arg = arg;
  return [ps1, ps2];
};


GBLocus.prototype.__setPath = function (context) {
  var pss = this.__curve(), ps = pss[0], dc = pss[1], last, top, curr, a, proj, i;
  context.beginPath();
  context.moveTo(ps[0][0], ps[0][1]);
  for (i = 1; i < ps.length; i++) {
    last = ps[i - 1];
    top = dc[i - 1];
    curr = ps[i];
    a = projArg(last, curr, top);
    proj = [ (curr[0] - last[0]) * a + last[0], (curr[1] - last[1]) * a + last[1] ];
    top[0] += top[0] - proj[0];
    top[1] += top[1] - proj[1];
    context.quadraticCurveTo(top[0], top[1], curr[0], curr[1]);
  }
};

GBLocus.prototype.draw = function (context) {
  this.__setPath(context);
  context.strokeStyle = this.color;
  context.lineWidth = 4;
  context.stroke();
};

GBLocus.prototype.drawSelected = function (context) {
  this.__setPath(context);
  context.lineWidth = 8;
  context.strokeStyle = "#44c";
  context.stroke();
  context.lineWidth = 6;
  context.strokeStyle = "#fff";
  context.stroke();
  context.strokeStyle = this.color;
  context.lineWidth = 4;
  context.stroke();
};

GBLocus.prototype.drawHovering = function (context) {
  this.__setPath(context);
  context.lineWidth = 4;
  context.strokeStyle = "#F00";
  context.stroke();
};

GBLocus.prototype.type = function () {
  return "loc";
};

gb.geom.loc = function (id, poo, target) {
  return new GBLocus();
};
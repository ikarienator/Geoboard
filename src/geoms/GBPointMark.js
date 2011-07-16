function GBPointMark(id, po, line, perp) {
  Geom.apply(this, [id, [line, po], [perp]]);
}
GBPointMark.IS_PERP = 0;
GBPointMark.prototype = new Geom();
GBPointMark.prototype.isPoint = true;
GBPointMark.prototype.nearestArg = function () { return 0; };
GBPointMark.prototype.type = function() { return 'gpm'; };
GBPointMark.prototype.getPosition = function () {
  var p1 = this.getParent(0).getPosition(0),
      p2 = this.getParent(0).getPosition(1),
      p3 = this.getParent(1).getPosition(0);
  if (this.getParam(GBPointMark.IS_PERP))
    return [p3[0] - (p2[1] - p1[1]), p3[1] + (p2[0] - p1[0])];
  else
    return [p3[0] + p2[0] - p1[0], p3[1] + p2[1] - p1[1]]; 
};

gb.geom.gpm = function(id, line, po, perp) {
  return new GBPointMark(id, line, po, perp);
};
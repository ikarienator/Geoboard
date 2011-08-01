/**
 * @class
 * @inherits Command
 */
function ConstructAngleBisector(p1, p2, ang) {
  this.p1 = p1;
  this.p2 = p2;
  this.ang = ang;
}

ConstructAngleBisector.prototype = new Command();

/**
 * 
 * @param {GDoc} gdoc
 * @returns {Boolean}
 */
ConstructAngleBisector.prototype.canDo = function(gdoc) {
  return this.p1 && this.p2 && this.ang && this.p1.isPoint && this.p2.isPoint && this.ang.isPoint;
};


 /**
   * 
   * @param {GDoc} gdoc
   */
ConstructAngleBisector.prototype.createNew = function(gdoc) {
  var mark = new GBAngleBisectorMark(gdoc, this.p1, this.p2, this.ang);
  return [mark, new GBRay(gdoc, this.ang, mark)];
};


ConstructAngleBisector.prototype.exec = function(gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructAngleBisector.prototype.undo = function(gdoc) {
  gdoc.del(this.newObject[0]);
  gdoc.del(this.newObject[1]);
};

ConstructAngleBisector.prototype.redo = function(gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};
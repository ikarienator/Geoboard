function ConstructIntersectionCommand(obj1, obj2, min) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.min = min;
}

ConstructIntersectionCommand.prototype = new ConstructCommand();

/**
 *
 * @param {GDoc} gdoc
 */
ConstructIntersectionCommand.prototype.canDo = function (gdoc) {
  if (!(this.min >= 0) || this.obj1 === undefined || this.obj2 === undefined)
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > this.min;
};

ConstructIntersectionCommand.prototype.createNew = function (gdoc) {
  return new GBInters(gdoc, this.obj1, this.obj2, this.min);
};

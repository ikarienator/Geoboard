/**
 * @class ConstructIntersectionsCommand
 * @inherits ConstructCommand
 * @param {Geom} obj1
 * @param {Geom} obj2
 */
function ConstructIntersectionsCommand(obj1, obj2) {
  ConstructCommand.apply(this, []);
  this.obj1 = obj1;
  this.obj2 = obj2;
}

ConstructIntersectionsCommand.prototype = new ConstructCommand();

/**
 * @private
 * @property {Geom} obj1
 */
ConstructIntersectionsCommand.prototype.obj1 = null;


/**
 * @property {Geom} obj2
 */
ConstructIntersectionsCommand.prototype.obj2 = null;


/**
 * @params {GDoc} gdoc
 * @inherits ConstructCommand
 */
ConstructIntersectionsCommand.prototype.canDo = function (gdoc) {
  if (!(this.obj1 !== undefined && this.obj2 !== undefined))
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > 0;
};

ConstructIntersectionsCommand.prototype.createNew = function (gdoc) {
  var me = this;
  return $.map(me.obj1.inters(me.obj2), function(v, k) {
    return new GBInters(gdoc, me.obj1, me.obj2, k);
  });
};
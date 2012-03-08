/**
 * @constructor
 * @class TranslateLabelCommand
 * @param dragList
 * @param fx
 * @param fy
 * @param tx
 * @param ty
 */
function TranslateLabelCommand(obj, dx, dy) {
  this.obj = obj;
  this.dx = dx;
  this.dy = dy;
}
;

TranslateLabelCommand.prototype = new Command();
$.extend(TranslateLabelCommand.prototype, {
  canDo : function (gdoc) {
    return this.obj;
  },
  exec : function (gdoc) {
    this.save = {};
    var me = this;
    me.save = me.obj.save(gdoc);
    this.redo(gdoc);
  },
  undo : function (gdoc) {
    var me = this;
    me.obj.load(me.save, gdoc);
  },
  redo : function (gdoc) {
    var me = this;
    me.obj.dragLabel(gdoc.contextPhantom, me.dx, me.dy);
  }
});

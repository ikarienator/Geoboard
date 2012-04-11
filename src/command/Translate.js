/**
 * @constructor
 * @class TranslateCommand
 * @param dragList
 * @param fx
 * @param fy
 * @param tx
 * @param ty
 */
function TranslateCommand(dragList, fx, fy, tx, ty) {
    this.dragList = dragList;
    this.fx = fx;
    this.fy = fy;
    this.tx = tx;
    this.ty = ty;
}

TranslateCommand.prototype = new Command();
$.extend(TranslateCommand.prototype, {
    canDo: function (gdoc) {
        return !!(this.dragList && this.fx !== undefined && this.fy !== undefined
            && this.tx !== undefined && this.ty !== undefined);
    },
    exec: function (gdoc) {
        this.save = {};
        var me = this;
        $.each(this.dragList, function (k, v) {
            me.save[v.id] = v.save(gdoc);
        });
        this.redo(gdoc);
    },
    undo: function (gdoc) {
        var me = this;
        $.each(this.dragList, function (k, v) {
            v.load(me.save[v.id], gdoc);
        });
    },
    redo: function (gdoc) {
        var me = this;
        $.each(this.dragList, function (k, v) {
            v.drag([ me.fx, me.fy ], [ me.tx, me.ty ]);
        });
    }
});

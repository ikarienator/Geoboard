function ShowLabelCommand(list, show) {
    this.list = list;
    this.show = show;
}
;

ShowLabelCommand.prototype = new Command();

ShowLabelCommand.prototype.canDo = function (gdoc) {
    var any = false;
    $.each(this.list, function (k, v) {
        any = true;
        return false;
    });
    return any;
};

ShowLabelCommand.prototype.exec = function (gdoc) {
    var me = this;
    me.save = {};
    $.each(me.list, function (k, v) {
        me.save[v.id] = { sl: v.showLabel, name: v.name };
    });
    me.redo(gdoc);
};

ShowLabelCommand.prototype.undo = function (gdoc) {
    var me = this;
    $.each(me.list, function (k, v) {
        v.showLabel = me.save[v.id].sl;
        v.name = me.save[v.id].name;
        v.dirt();
    });
};

ShowLabelCommand.prototype.redo = function (gdoc) {
    var me = this;
    $.each(me.list, function (k, v) {
        v.showLabel = me.show;
        v.getName();
    });
};
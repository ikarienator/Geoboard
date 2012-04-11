function DeleteCommand(list) {
    this.list = list;
}

DeleteCommand.prototype = new Command();
$.extend(DeleteCommand.prototype, {
    canDo: function (gdoc) {
        var any = false;
        $.each(this.list, function (k, v) {
            any = true;
            return false;
        });
        return any;
    },
    exec: function (gdoc) {
        var me = this, sels = {}, curr, list = [], i = 0;
        $.each(this.list, function (k, v) {
            sels[v.id] = v;
            list.push(v);
        });
        while (i < list.length) {
            curr = list[i++];
            $.each(curr.__children, function (k, v) {
                if (!sels[v.id]) {
                    sels[v.id] = v;
                    list.push(v);
                }
            });
        }
        this.list = list;
        this.redo(gdoc);
    },
    undo: function (gdoc) {
        gdoc.selection = {};
        $.each(this.list, function (k, obj) {
            gdoc.add(obj);
            // obj.load(v.json, gdoc);
        });
        $.each(this.list, function (k, v) {
            gdoc.selection[v.id] = gdoc.get(v.id);
        });
    },
    redo: function (gdoc) {
        gdoc.selection = {};
        $.each(this.list.reverse(), function (k, v) {
            gdoc.del(v);
        });
    }
});
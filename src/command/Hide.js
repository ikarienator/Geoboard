function HideCommand (list, hide) {
  this.list = list;
  this.hide = hide;
};

HideCommand.prototype = new Command();

HideCommand.prototype.canDo = function (gdoc) {
  var any = false;
  $.each(gdoc.selection, function(k, v) {
    any = true;
    return false;
  });
  return any;
};
HideCommand.prototype.exec = function (gdoc) {
  var save;
  save = this.save = [];
  $.each(this.list, function (k, v) {
    save.push({
      obj : v,
      hidden : v.hidden
    });
  });
  this.redo(gdoc);
};
HideCommand.prototype.undo = function (gdoc) {
  gdoc.selection = {};
  $.each(this.save, function (k, v) {
    v.obj.hidden = v.hidden;
    gdoc.selection[v.id] = v.obj;
  });
};
HideCommand.prototype.redo = function (gdoc) {
  var me = this;
  gdoc.selection = {};
  $.each(this.list, function (k, v) {
    v.hidden = me.hide;
  });
};
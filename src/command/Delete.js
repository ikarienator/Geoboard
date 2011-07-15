var DeleteCommand = function(list) {
  this.list = list;
};

DeleteCommand.prototype = new Command();
$.extend(DeleteCommand.prototype, {
  canDo : function(gdoc) {
    var any = false;
    $.each(this.list, function(k, v) {
      any = true;
      return false;
    });
    return any;
  },
  exec : function(gdoc) {
    var sels = {};
    $.each(this.list, function(k, v) {
      sels[v.id()] = v;
    });
    var topo = gdoc.topoSort();
    var q = [];
    $.each(this.list, function(k, v) {
      q.push(v);
    });
    var qi = 0;
    while (qi < q.length) {
      var curr = q[qi++];
      if (topo.topo[curr.id()])
        $.each(topo.topo[curr.id()], function(k, v) {
          if (!sels[v.id()]) {
            sels[v.id()] = v;
            q.push(v);
          }
        });
    }
    var list = [];
    $.each(topo.result, function(k, v) {
      if (sels[v.id()]) {
        list.push(v);
      }
    });
    this.list = list;
    var save = this.save = [];
    $.each(list, function(k, v) {
      save.push({
        type : v.type(),
        json : v.save(gdoc)
      });
    });
    this.redo(gdoc);
  },
  undo : function(gdoc) {
    gdoc.selection = {};
    $.each(this.save, function(k, v) {
      var obj = new gb.geom[v.type]();
      obj.load(v.json, gdoc);
      gdoc.entities[obj.id()] = obj;
      gdoc.selection[obj.id()] = obj;
    });
  },
  redo : function(gdoc) {
    gdoc.selection = {};
    $.each(this.list.reverse(), function(k, v) {
      delete gdoc.entities[v.id()];
      if (gdoc.hovering == v)
        gdoc.hovering = false;
    });
  }
});
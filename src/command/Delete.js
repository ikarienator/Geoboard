function DeleteCommand (list) {
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
    var sels = {}, topo, q, qi, curr, list, save;
    $.each(this.list, function(k, v) {
      sels[v.id] = v;
    });
    topo = gdoc.topoSort();
    q = [];
    $.each(this.list, function(k, v) {
      q.push(v);
    });
    qi = 0;
    while (qi < q.length) {
      curr = q[qi++];
      if (topo.topo[curr.id])
        $.each(topo.topo[curr.id], function(k, v) {
          if (!sels[v.id]) {
            sels[v.id] = v;
            q.push(v);
          }
        });
    }
    list = [];
    $.each(topo.result, function(k, v) {
      if (sels[v.id]) {
        list.push(v);
      }
    });
    this.list = list;
    save = this.save = [];
    $.each(list, function(k, v) {
      save.push({
        obj : v,
        json : v.save(gdoc)
      });
    });
    this.redo(gdoc);
  },
  undo : function(gdoc) {
    gdoc.selection = {};
    $.each(this.save, function(k, v) {
      var obj = v.obj;
      gdoc.add(obj);
      obj.load(v.json, gdoc);
    });
    $.each(this.save, function(k, v) {
      gdoc.selection[v.id] = gdoc.get(v.id);
    });
  },
  redo : function(gdoc) {
    gdoc.selection = {};
    $.each(this.list.reverse(), function(k, v) {
      gdoc.del(v);
    });
  }
});
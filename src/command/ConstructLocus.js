var ConstructLocusCommand = function(poo, target) {
  this.poo = poo;
  this.target = target;
};

ConstructLocusCommand.prototype = new Command();
$.extend(ConstructLocusCommand.prototype, {
  canDo : function(gdoc) {
    if (!(this.poo !== undefined && this.target !== undefined && //
    this.poo.type() == "poo" && this.target.isPoint))
      return false;
    var v = {};
    var q = [ this.target ];
    var qi = 0;
    while (qi < q.length) {
      var curr = q[qi++];
      if (curr == this.poo)
        return true;
      if (!v[curr.id()]) {
        v[curr.id()] = curr;
        $.each(curr.getParents(), function(k, v) {
          q.push(v);
        });
      }
    }
    return false;
  },
  exec : function(gdoc) {
    var range = this.poo.obj.argRange && this.poo.obj.argRange();
    range = range || [ 0, 1 ];
    var nl = this.nl = new GBLocus(gdoc.nextId(), this.poo, this.target, range[0], range[1]);
    gdoc.entities[nl.id()] = nl;
    gdoc.selection = {};
    gdoc.selection[nl.id()] = nl;
  },
  undo : function(gdoc) {
    delete gdoc.entities[this.nl.id()];
    if (gdoc.selection[this.nl.id()])
      delete gdoc.selection[this.nl.id()];
  },
  redo : function(gdoc) {
    gdoc.entities[this.nl.id()] = this.nl;
    gdoc.selection = {};
    gdoc.selection[this.nl.id()] = this.nl;
  }
});

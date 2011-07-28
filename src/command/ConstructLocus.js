function ConstructLocusCommand(poo, target) {
  this.poo = poo;
  this.target = target;
};

ConstructLocusCommand.prototype = new ConstructCommand();

ConstructLocusCommand.prototype.canDo = function(gdoc) {
  if (!(this.poo !== undefined && this.target !== undefined && //
      this.poo.type() == "poo" && this.target.isPoint))
    return false;
  var v = {}, q = [ this.target ], qi = 0, curr;
  while (qi < q.length) {
    curr = q[qi++];
    if (curr == this.poo)
      return true;
    if (!v[curr.id]) {
      v[curr.id] = curr;
      $.each(curr.getParents(), function(k, v) {
        q.push(v);
      });
    }
  }
  return false;
};

ConstructLocusCommand.prototype.createNew = function (gdoc) {
  var range = this.poo.getParent(0).argRange && this.poo.getParent(0).argRange() || [0, 1];
  return new GBLocus(gdoc, this.poo, this.target, range[0], range[1]);
};

function SelectionAction() {
  this.init();
  this.cmd = null;
  this.startDrag = null;
};

SelectionAction.prototype = new GBAction();
$.extend(SelectionAction.prototype, {
  text : '<img src="images/sel.svg"/>',
  reset : function() {
    this.startDrag = null;
    this.dragging = null;
    this.oldSelection = null;
  },
  mouseMove : function(gdoc, x, y) {
    var fx, fy, t, di, test;
    if (this.startDrag) {
      fx = this.startDrag[0], tx = x;
      fy = this.startDrag[1], ty = y;
      if (fx > tx) {
        t = fx;
        fx = tx;
        tx = t;
      }
      if (fy > ty) {
        t = fy;
        fy = ty;
        ty = t;
      }
      gdoc.selection = shallowClone(this.oldSelection);
      gdoc.forVisibles(function(k, ent) {
        if (ent.crossTest(fx, fy, tx, ty))
          gdoc.selection[ent.id()] = ent;
      });
      gdoc.draw();
      gdoc.context.beginPath();
      gdoc.context.rect(fx, fy, tx - fx, ty - fy);
      gdoc.context.closePath();
      gdoc.context.strokeStyle = "#339";
      gdoc.context.stroke();
      gdoc.context.fillStyle = "rgba(48,48,144,0.3)";
      gdoc.context.fill();
    } else if (this.dragging) {
      if (this.cmd) {
        if (this.cmd == gdoc.lastCommand()) {
          this.cmd.undo(gdoc);
          this.cmd.tx = x;
          this.cmd.ty = y;
          this.cmd.redo(gdoc);  
        }
      }
      else {
        di = {};
        $.each(gdoc.selection, function(k, v) {
          $.each(v.dragInvolve(), function(k, t) {
            di[t.id()] = t;
          });
        });
        
        this.cmd = new TranslateCommand(di, this.dragging[0], this.dragging[1], x, y);
        gdoc.run(this.cmd);
      }
      gdoc.draw();
    } else {
      test = gdoc.hitTest(x, y);
      if (test.found.length == 1) {
        if (gdoc.hovering != test.found[0]) {
          gdoc.hovering = test.found[0];
          gdoc.draw();
        }
      } else {
        if (gdoc.hovering != null) {
          gdoc.hovering = null;
          gdoc.draw();
        } 
      }
    }
  },
  mouseDown : function(gdoc, x, y, ev) {
    var test = gdoc.hitTest(x, y), ent;
    if (ev.shiftKey) {
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id()]) {
          gdoc.selection[ent.id()] = ent;
        } else
          delete gdoc.selection[ent.id()];
      }
      this.oldSelection = shallowClone(gdoc.selection);
      this.startDrag = [ x, y ];
    } else {
      this.oldSelection = new Object();
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id()]) {
          gdoc.selection = {};
          gdoc.selection[ent.id()] = ent;
        }
        this.dragging = [ x, y ];
      } else {
        gdoc.selection = {};
        this.startDrag = [ x, y ];
      }
    }
    gdoc.draw();
  },
  mouseUp : function(gdoc, x, y) {
    if (this.startDrag) {
      this.startDrag = null;
      gdoc.draw();
    } else if (this.dragging) {
      if (this.cmd && this.cmd == gdoc.lastCommand()) {
        this.cmd.undo(gdoc);
        this.cmd.tx = x;
        this.cmd.ty = y;
        this.cmd.redo(gdoc);
        gdoc.save();        
      }
      this.cmd = null;
      this.dragging = null;
    }
  }
});

gb.tools['sel'] = new SelectionAction();

function SelectionAction() {
  this.init();
  this.cmd = null;
  this.startDrag = null;
};

SelectionAction.prototype = new GBAction();
$.extend(SelectionAction.prototype, {
  text : '<img src="images/sel.svg"/>',
  startDrag : null,
  dragging : null,
  oldSelection : null,
  draggingLabel : null,
  /**
   * @field {Command} cmd
   */
  cmd : null,
  reset : function() {
    this.startDrag = null;
    this.dragging = null;
    this.oldSelection = null;
    this.draggingLabel = null;
    this.cmd = null;
  },
  
  mouseMove : function(gdoc, x, y) {
    var fx, fy, t, di, test;
    if (this.dragging) {
      if (this.cmd) {
        if (this.cmd == gdoc.lastCommand()) {
          this.cmd.undo(gdoc);
          this.cmd.tx = x;
          this.cmd.ty = y;
          this.cmd.redo(gdoc);  
        }
      } else {
        di = {};
        $.each(gdoc.selection, function(k, v) {
          $.each(v.dragInvolve(), function(k, t) {
            di[t.id] = t;
          });
        });
        this.cmd = new TranslateCommand(di, this.dragging[0], this.dragging[1], x, y);
        gdoc.run(this.cmd);
      }
      gdoc.draw();
    } else if (this.draggingLabel) {
      if (this.cmd) {
        if (this.cmd == gdoc.lastCommand()) {
          this.cmd.undo(gdoc);
          this.cmd.dx = x - this.startDrag[0];
          this.cmd.dy = y - this.startDrag[1];
          this.cmd.redo(gdoc);  
        }
      } else {
        this.cmd = new TranslateLabelCommand(this.draggingLabel, x - this.startDrag[0], y - this.startDrag[1]);
        gdoc.run(this.cmd);
      } 
      gdoc.draw();
      this.draggingLabel.drawLabel(gdoc.contextPhantom, true);
    } else if (this.startDrag) {
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
          gdoc.selection[ent.id] = ent;
      });
      gdoc.draw();
      gdoc.context.beginPath();
      gdoc.context.rect(fx, fy, tx - fx, ty - fy);
      gdoc.context.closePath();
      gdoc.context.strokeStyle = "#339";
      gdoc.context.stroke();
      gdoc.context.fillStyle = "rgba(48,48,144,0.3)";
      gdoc.context.fill();
    } else {
      test = gdoc.hitTest(x, y);
      if (test.found.length == 1) {
        if (gdoc.hovering != test.found[0]) {
          gdoc.hovering = test.found[0];
          gdoc.draw();
        }
      } else if (test.found.length == 0) {
        /**
         * @param {Geom} v 
         */
        if (gdoc.hovering != null) {
          gdoc.hovering = null;
        }
        gdoc.draw();
        gdoc.forVisibles(function(k, v){
          if (v.showLabel && v.labelHistTest(gdoc.contextPhantom, x, y)) {
            v.drawLabel(gdoc.contextPhantom, true);
            return false;
          }
        });
      }
    }
  },
  
  /**
   * 
   * @param {GDoc} gdoc
   * @param x
   * @param y
   * @param {MouseEvent} ev
   */
  mouseDown : function(gdoc, x, y, ev) {
    var me = this, test = gdoc.hitTest(x, y), ent;
    if (ev.shiftKey) {
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id]) {
          gdoc.selection[ent.id] = ent;
        } else
          delete gdoc.selection[ent.id];
      }
      me.oldSelection = shallowClone(gdoc.selection);
      me.startDrag = [ x, y ];
    } else {
      me.oldSelection = new Object();
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id]) {
          gdoc.selection = {};
          gdoc.selection[ent.id] = ent;
        }
        me.dragging = [ x, y ];
      } else if (test.found.length == 0) {
        /**
         * @param {Geom} v 
         */
        gdoc.forVisibles(function(k, v){
          if (v.showLabel && v.labelHistTest(gdoc.contextPhantom, x, y)) {
            me.draggingLabel = v;
            return false;
          }
        });
        if (!me.draggingLabel) {
          gdoc.selection = {};
        } else {
          gdoc.selection = {};
          gdoc.selection[me.draggingLabel.id] = me.draggingLabel;
        }
        me.startDrag = [ x, y ];
      }
    }
    gdoc.draw();
  },
  
  mouseUp : function(gdoc, x, y) {
    if (this.dragging) {
      if (this.cmd && this.cmd == gdoc.lastCommand()) {
        this.cmd.undo(gdoc);
        this.cmd.tx = x;
        this.cmd.ty = y;
        this.cmd.redo(gdoc);
        gdoc.save();        
      }
      this.cmd = null;
      this.dragging = null;
    } else if (this.draggingLabel) {
      if (this.cmd && this.cmd == gdoc.lastCommand()) {
        this.cmd.undo(gdoc);
        this.cmd.dx = x - this.startDrag[0];
        this.cmd.dy = y - this.startDrag[1];
        this.cmd.redo(gdoc);
        gdoc.save();        
      }
      this.cmd = null;
      this.startDrag = null;
      this.draggingLabel = null;
    } else if (this.startDrag) {
      this.startDrag = null;
    }
    this.mouseMove(gdoc, x, y);
  }
});

gb.tools['sel'] = new SelectionAction();

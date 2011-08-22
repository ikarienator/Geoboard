gb.menu = {};
gb.menu.file = {
  text : '<span class="ud">F</span>ile',
  items : [ 'news', 'down', '-', 'prop', 'help' ],
  news : {
    text : 'New Sketch',
    shortcutKey : new ShortcutKey(78, ShortcutKey.CTRL, 'gb.menu.file.news'),
    run : function(gdoc) {
      var doc = new GDoc();
      doc.active();
      doc.save();
    }
  },
  down : {
    shortcutKey : new ShortcutKey(83, ShortcutKey.CTRL, 'gb.menu.file.down'),
    text : 'Download...'
  },
  prop : {
    shortcutKey : new ShortcutKey(188, ShortcutKey.CTRL, 'gb.menu.file.props'),
    text : 'Properties'
  },
  help : {
    shortcutKey : new ShortcutKey(112, 0, 'gb.menu.file.help'),
    text : 'Help...'
  }
};

gb.menu.edit = {
  text : '<span class="ud">E</span>dit',
  items : [ 'undo', 'redo', '-', 'sela', '-', 'del' ],
  undo : {
    text : 'Undo',
    shortcutKey : new ShortcutKey(90, ShortcutKey.CTRL, 'gb.menu.edit.undo'),
    isEnabled : function(gdoc) {
      return gdoc.canUndo();
    },
    run : function(gdoc) {
      gdoc.undo();
    }
  },
  redo : {
    text : 'Redo',
    shortcutKey : new ShortcutKey(90, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.edit.redo'),
    isEnabled : function(gdoc) {
      return gdoc.canRedo();
    },
    run : function(gdoc) {
      gdoc.redo();
    }
  },
  
  sela : {
    text : 'Select all',
    shortcutKey : new ShortcutKey(65, ShortcutKey.CTRL, 'gb.menu.edit.sela'),
    run : function(gdoc) {
      gdoc.forVisibles(function (k, v) {
        gdoc.selection[k] = v;
      });
      gdoc.draw();
    }
  },
  
  del : {
    text : 'Delete',
    shortcutKey : [new ShortcutKey(8, 0, 'gb.menu.edit.del'), new ShortcutKey(46, 0, 'gb.menu.edit.del')],
    isEnabled : function(gdoc) {
      var any = false;
      $.each(gdoc.selection, function() {
        any = true;
        return false;
      });
      return any;
    },
    run : function(gdoc) {
      gdoc.run(new DeleteCommand(gdoc.selection));
    }
  }
};

gb.menu.disp = {
  text : '<span class="ud">D</span>isplay',
  items : ['sha', 'hide', 'unhide', '-', 'shl', 'hil', '-', 'zi', 'zo', 'zr'],
  zi : {
    text : 'Zoom in',
    shortcutKey : new ShortcutKey(187, ShortcutKey.CTRL, 'gb.menu.disp.zi'),
    run : function(gdoc) {
      gdoc.zoomIn();
    }
  },
  zo : {
    text : 'Zoom out',
    shortcutKey : new ShortcutKey(189, ShortcutKey.CTRL, 'gb.menu.disp.zo'),
    run : function(gdoc) {
      gdoc.zoomOut();
    }
  },
  zr : {
    text : 'Zoom restore',
    shortcutKey : new ShortcutKey(48, ShortcutKey.CTRL, 'gb.menu.disp.zr'),
    run : function(gdoc) {
      gdoc.zoomRestore();
    }
  },
  sha: {
    text : 'Show all hidden',
    show : false,
    isEnabled : function(gdoc) {
      this.show = gdoc.showHidden;
      this.text(this.show ? 'Hide hiden' : 'Show all hidden');
      return true;
    },
    /**
     * @param {GDoc} gdoc
     */
    run : function(gdoc) {
      gdoc.showHidden = (this.show = !this.show);
      this.text(this.show ? 'Hide hiden' : 'Show all hidden');
      gdoc.draw();
    }
  },
  shl : {
    text : 'Show label',
    /**
     * 
     * @param {GDoc} gdoc
     */
    isEnabled : function(gdoc) {
      this.cmd = new ShowLabelCommand(gdoc.selection, true);
      return this.cmd.canDo(gdoc);
    },
    /**
     * 
     * @param {GDoc} gdoc
     */
    run : function(gdoc) {
      gdoc.run(this.cmd);
    }
  },
  hil : {
    text : 'Hide label',
    /**
     * 
     * @param {GDoc} gdoc
     */
    isEnabled : function(gdoc) {
      this.cmd = new ShowLabelCommand(gdoc.selection, false);
      return this.cmd.canDo(gdoc);
    },
    /**
     * 
     * @param {GDoc} gdoc
     */
    run : function(gdoc) {
      gdoc.run(this.cmd);
    }
  },
  hide: {
    text: 'Hide',
    shortcutKey : new ShortcutKey(72, ShortcutKey.CTRL, 'gb.menu.disp.hide'),
    run : function(gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, true));
    }
  },
  unhide: {
    text: 'Unhide',
    shortcutKey : new ShortcutKey(72, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.disp.unhide'),
    run : function(gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, false));
    }
  }
};

gb.menu.cons = {
  text : '<span class="ud">C</span>onstruct',
  items : [ 'poo', 'mp', 'inters', '-', 'perp', 'para', 'anb', '-', 'loc' ],
  line : {
    text : 'Line',
    shortcutKey : new ShortcutKey(80, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.poo')
  },
  
  poo : {
    text : 'Point on Object',
    shortcutKey : new ShortcutKey(80, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.poo'),
    isEnabled : function(gdoc) {
      var any = false, anyP = false;
      $.each(gdoc.selection, function(k, v) {
        any = true;
        if (v.isPoint)
          anyP = true;
      });
      return any && !anyP;
    },
    run : function(gdoc) {
      $.each(gdoc.selection, function(k, v) {
        var randPoint = v.randPoint(),
            cmd = new ConstructPoOCommand(v, v.nearestArg(randPoint[0], randPoint[1]));
        gdoc.run(cmd);
      });
    }
  },
  mp : {
    text : 'Midpoint',
    shortcutKey : new ShortcutKey(77, ShortcutKey.CTRL, 'gb.menu.cons.mp'),
    isEnabled : function(gdoc) {
      var anyLine = false, allLine = true;
      $.each(gdoc.selection, function(k, v) {
        if (v.type() == 'gli')
          anyLine = true;
        else {
          allLine = false;
          return false;
        }
      });
      return anyLine && allLine;
    },
    run : function(gdoc) {
      if (!this.isEnabled(gdoc))
        return false;
      $.each(gdoc.selection, function(k, v) {
        var cmd = new ConstructMidpointCommand(v);
        gdoc.run(cmd);
      });
    }
  },
  perp : {
    text : 'Perpendical Line',
    isEnabled : function(gdoc) {
      var points = 0, lines = 0;
      $.each(gdoc.selection, function(k, v) {
        if (v.isPoint) {
          points++;
          if (points > 1)
            return false;
        } else if (v.isLine) {
          lines++;
        } else {
          points = 2;
          return false;
        }
      });
      return lines > 0 && points == 1;
    },
    run : function(gdoc) {
      var lines = [], po = null;
      $.each(gdoc.selection, function(k, v) {
        if (v.isPoint) {
          po = v;
        } else if (v.isLine) {
          lines.push(v);
        }
      });
      $.each(lines, function(k, v) {
        var cmd = new ConstructPerpLineCommand(po, v);
        gdoc.run(cmd);
      });
    }
  },
  para : {
    text : 'Parallel Line',
    isEnabled : function(gdoc) {
      var points = 0, lines = 0;
      $.each(gdoc.selection, function(k, v) {
        if (v.isPoint) {
          points++;
          if (points > 1)
            return false;
        } else {
          lines++;
        }
      });
      return lines > 0 && points == 1;
    },
    run : function(gdoc) {
      var lines = [], po = null;
      $.each(gdoc.selection, function(k, v) {
        if (v.isPoint) {
          po = v;
        } else if (v.isLine) {
          lines.push(v);
        }
      });
      $.each(lines, function(k, v) {
        var cmd = new ConstructParaLineCommand(po, v);
        gdoc.run(cmd);
      });
    }
  },
  anb : {
    text : 'Angle Bisector',
    isEnabled : function (gdoc) {
      var sel = gb.utils.m2a(gdoc.selection);
      if(sel.length != 3) return false;
      this.cmd = new ConstructAngleBisector(sel[0], sel[2], sel[1]);
      return this.cmd.canDo(gdoc);
    },
    run : function (gdoc) {
      gdoc.run(this.cmd); 
    }
  },
  loc : {
    // ConstructLocusCommand
    text : 'Locus',
    shortcutKey : new ShortcutKey(76, ShortcutKey.CTRL, 'gb.menu.cons.loc'),
    isEnabled : function(gdoc) {
      var poo = null, target = null;
      $.each(gdoc.selection, function(k, v) {
        if (v.type() == 'poo' && !poo)
          poo = v;
        else if (v.isPoint)
          target = v;
      });
      if (!poo)
        return false;
      if (!target)
        return false;
      this.cmd = new ConstructLocusCommand(poo, target);
      if (!!this.cmd.canDo())
        return true;
      if (target.type() == 'poo') {
        this.cmd = new ConstructLocusCommand(target, poo);
        return this.cmd.canDo();
      } else
        return false;
    },
    run : function(gdoc) {
      gdoc.run(this.cmd);
    }
  },
  inters : {
    text : 'Intersections',
    shortcutKey : new ShortcutKey(73, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.inters'),
    isEnabled : function(gdoc) {
      var l1 = null, l2 = null;
      $.each(gdoc.selection, function(k, v) {
        if (!v.isPoint)
          if (l1 == null)
            l1 = v;
          else if(l2 == null)
            l2 = v;
      });
      if (l1 == null) return false;
      if (l2 == null) return false;
      this.cmd = new ConstructIntersectionsCommand(l1, l2);
      return this.cmd.canDo();
    },
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  }
};
gb.menu.trans = {
  text : '<span class="ud">T</span>ransform',
  items : []
};
gb.menu.meas = {
  text : '<span class="ud">M</span>easure',
  items : []
};
gb.menu.numb = {
  text : '<span class="ud">N</span>umber',
  items : []
};
gb.menu.grap = {
  text : '<span class="ud">G</span>raph',
  items : []
};
gb.menu.items = [ 'file', 'edit', 'disp', 'cons'];
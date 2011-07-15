gb.menu = {};
gb.menu.file = {
  text : '<a><span class="ud">F</span>ile</a>',
  items : [ 'news', 'down', '-', 'prop', 'help' ],
  news : {
    text : 'New Sketch',
    run : function(gdoc) {
      new GDoc().active();
    }
  },
  down : {
    text : 'Download...'
  },
  prop : {
    text : 'Properties'
  },
  help : {
    text : 'Help...'
  }
};
gb.menu.edit = {
  text : '<a><span class="ud">E</span>dit</a>',
  items : [ 'undo', 'redo', '-', 'del' ],
  undo : {
    text : 'Undo',
    isEnabled : function(gdoc) {
      return gdoc.canUndo();
    },
    run : function(gdoc) {
      gdoc.undo();
    }
  },
  redo : {
    text : 'Redo',
    isEnabled : function(gdoc) {
      return gdoc.canRedo();
    },
    run : function(gdoc) {
      gdoc.redo();
    }
  },
  del : {
    text : 'Delete',
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
  text : '<a><span class="ud">D</span>isplay</a>',
  items : ['sha', 'hide', 'unhide'], 
  sha: {
    text : 'Show all hidden',
    show : false,
    /**
     * @param {GDoc} gdoc
     */
    run : function(gdoc) {
      gdoc.showHidden = (this.show = !this.show);
      this.text(this.show ? 'Hide hiden' : 'Show all hidden');
      gdoc.draw();
    }
  },
  hide: {
    text: 'Hide',
    run : function(gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, true));
    }
  },
  unhide: {
    text: 'Unhide',
    run : function(gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, false));
    }
  }
};
gb.menu.cons = {
  text : '<a><span class="ud">C</span>onstruct</a>',
  items : [ 'poo', 'mp', '-', 'perp', 'para', '-', 'loc' ],
  poo : {
    text : 'Point on Object',
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
  loc : {
    // ConstructLocusCommand
    text : 'Locus',
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
  }
};
gb.menu.trans = {
  text : '<a><span class="ud">T</span>ransform</a>',
  items : []
};
gb.menu.meas = {
  text : '<a><span class="ud">M</span>easure</a>',
  items : []
};
gb.menu.numb = {
  text : '<a><span class="ud">N</span>umber</a>',
  items : []
};
gb.menu.grap = {
  text : '<a><span class="ud">G</span>raph</a>',
  items : []
};
gb.menu.items = [ 'file', 'edit', 'disp', 'cons', 'trans', 'meas', 'numb', 'grap' ];
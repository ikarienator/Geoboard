gb.docs = [];
/**
 * 
 * @param title
 * @param json
 * @class GDoc
 * @constructor
 * @returns
 */
var GDoc = gb.GDoc = function(title, json) {
  var me = this;
  me.mouse = [0, 0];
  if (!title) {
    var docNames = {};
    $.each(gb.docs, function(k, v) {
      docNames[v.title] = true;
    });
    for ( var i = 1; docNames[GDoc.prototype.title + i]; i++)
      ;
    title = GDoc.prototype.title + i;
  }
  this.title = title;
  this.canvas = document.createElement('canvas');
  var can = $(this.canvas);
  can.attr('width', 800);
  can.attr('height', 600);
  if (window.G_vmlCanvasManager)
    window.G_vmlCanvasManager.initElement(this.canvas);
  $('div#area').append(can);
  can.mousedown(function(ev) {
    me.mouse = [ev.offsetX || ev.layerX, ev.offsetY || ev.layerY];
    var os = shallowClone(me.selection);
    $('#menu').removeClass('expand');
    if (ev.button == 0)
      gb.currentTool.mouseDown(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  can.mousemove(function(ev) {
    me.mouse = [ev.offsetX || ev.layerX, ev.offsetY || ev.layerY];
    var os = shallowClone(me.selection);
    gb.currentTool.mouseMove(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  can.mouseup(function(ev) {
    me.mouse = [ev.offsetX || ev.layerX, ev.offsetY || ev.layerY];
    var os = shallowClone(me.selection);
    gb.currentTool.mouseUp(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  this.context = this.canvas.getContext("2d");
  this.canvas.doc = this;
  this.entities = {};
  this.selection = {};
  this.__nextId = 100;
  this.cmdStack = [];
  this.cmdStackPos = 0;
  this.pageHeader = $('<li>' + this.title + '</li>');
  this.pageHeader.click(function() {
    me.active();
  });
  $('#page-header').append(this.pageHeader);
  this.pageHeader = this.pageHeader[0];
  gb.docs.push(this);
};

GDoc.prototype = {
  title : 'Untitled',
  draw : function() {
    var me = this;
    var context = me.context;
    context.fillStyle = "white";
    context.clearRect(0, 0, 800, 600);
    $.each(me.entities, function(k, v) {
      if (!v.isPoint) {
        if (me.selection[v.id()])
          v.drawSelected(context);
        else if (me.hovering === v)
          v.drawHovering(context);
        else if (!v.hidden || me.showHidden)
          v.draw(context);
      }
    });
    $.each(me.entities, function(k, v) {
      if (v.isPoint) {
        if (me.selection[v.id()])
          v.drawSelected(context);
        else if (me.hovering === v)
          v.drawHovering(context);
        else if (!v.hidden || me.showHidden)
          v.draw(context);
      }
    });
  },
  hitTest : function(x, y) {
    var me = this;
    var res = {
      found : [],
      current : [ NaN, NaN ]
    };
    $.each(me.entities, function(k, v) {
      if (v.hitTest(x, y)) {
        var p = v.getPosition(v.nearestArg(x, y));
        res.found.push({
          obj : v,
          x : p[0],
          y : p[1]
        });
      }
    });
    if (res.found.length == 0) {
      res.current[0] = x;
      res.current[1] = y;
      res.found = [];
    } else if (res.found.length == 1) {
      res.current[0] = res.found[0].x;
      res.current[1] = res.found[0].y;
      res.found = [ res.found[0].obj ];
    } else {
      var po = null;
      $.each(res.found, function(k, v) {
        if (v.obj.isPoint) {
          po = v.obj;
          return false;
        }
      });
      if (po) {
        res.found = [ po ];
        var pos = po.getPosition();
        res.current[0] = pos[0];
        res.current[1] = pos[1];
      } else {
        var min0 = res.found[0], mind0 = dist([x, y], [min0.x, min0.y]);
        var min1 = res.found[1], mind1 = dist([x, y], [min1.x, min1.y]);
        if (mind1 < mind0) {
          var temp = min0; min0 = min1; min1 = temp;
          var temp = mind0; mind0 = mind1; mind1 = temp;
        }
        for (var i = 2; i < res.found.length; i++){
          var curr = res.found[i], currd = dist([x, y], [curr.x, curr.y]);
          if (currd < mind1) {
            min1 = curr;
            mind1 =currd;
            if (mind1 < mind0) {
              temp = min0; min0 = min1; min1 = temp;
              temp = mind0; mind0 = mind1; mind1 = temp;
            }
          }
        }

        min0 = min0.obj;
        min1 = min1.obj;
        
        res.found = [min0, min1];
        
        var inters = min0.inters(min1);
        var min = 0, mind = dist([ x, y ], inters[min]);
        $.each(inters, function(k, v) {
          var d = dist([ x, y ], v);
          if (d < mind) {
            min = k;
          }
        });
        res.current = inters[min];
      }
    }
    return res;
  },
  load : function(json) {
    var me = this;
    var mock = {
      entities : {}
    };
    $.each(json.entities, function(k, v) {
      var obj = new gb.geom[v.type]();
      obj.load(v.data, mock);
      mock.entities[obj.id()] = obj;
    });
    me.title = json.title;
    me.__nextId = json.nextId;
    me.entities = mock.entities;
    me.cmdStack = [];
    me.cmdStackPos = 0;
    me.draw();
    me.refreshMenu();
  },
  save : function() {
    var result = {
      title : this.title,
      nextId : this.__nextId,
      entities : []
    };
    $.each(this.topoSort().result, function(k, v) {
      result.entities.push({
        type : v.type(),
        data : v.save()
      });
    });
    if(window.localStorage)
      localStorage[this.title] = gb.json.encode(result);
  },
  nextId : function() {
    return "ent" + this.__nextId++;
  },
  topoSort : function() {
    var parent = {};
    var children = {};
    var top = {};
    var me = this;
    $.each(this.entities, function(k, v) {
      var pats = v.getParents();
      parent[v.id()] = pats;
      if (pats.length == 0) {
        top[v.id()] = v;
      }
    });
    $.each(parent, function(k, v) {
      $.each(v, function(ki, ch) {
        if (!children[ch.id()])
          children[ch.id()] = {};
        children[ch.id()][k] = me.entities[k];
      });
      parent[k] = v.length;
    });
    var q = [];
    $.each(top, function(k, v) {
      q.push(v);
    });
    var qi = 0;
    while (qi < q.length) {
      var curr = q[qi++];
      if (!children[curr.id()])
        children[curr.id()] = {};
      else
        $.each(children[curr.id()], function(k, v) {
          parent[v.id()]--;
          if (parent[v.id()] == 0) {
            q.push(v);
          }
        });
    }
    return {
      result : q,
      topo : children
    };
  },
  run : function(cmd) {
    if (cmd.canDo(this)) {
      cmd.exec(this);
      this.cmdStack.length = this.cmdStackPos++;
      this.cmdStack.push(cmd);
      this.draw();
      this.refreshMenu();
      this.save();
    }
  },
  canUndo : function() {
    return this.cmdStackPos > 0;
  },
  undo : function() {
    if (this.canUndo()) {
      var cmd = this.cmdStack[this.cmdStackPos - 1];
      cmd.undo(this);
      --this.cmdStackPos;
      this.draw();
      this.refreshMenu();
      this.save();
    }
  },
  canRedo : function() {
    return this.cmdStackPos < this.cmdStack.length;
  },
  lastCommand : function() {
    return this.cmdStack[this.cmdStackPos - 1];
  },
  redo : function() {
    if (this.canRedo()) {
      var cmd = this.cmdStack[this.cmdStackPos];
      cmd.redo(this);
      this.cmdStackPos++;
      this.draw();
      this.refreshMenu();
      this.save();
    }
  },
  // update : function() {
  // var topo = this.topoSort();
  // },
  refreshMenu : function() {
    var me = this;
    $('li.sub-item').each(function(k, item) {
      if (!item.action.isEnabled || item.action.isEnabled(me)) {
        $(item).removeClass('disabled');
      } else {
        $(item).addClass('disabled');
      }
    });
  },
  active : function() {
    $('canvas').removeClass('active');
    $('#page-header li').removeClass('active');
    $(this.canvas).addClass('active');
    $(this.pageHeader).addClass('active');
    gb.currentDocument = this;
  }
};
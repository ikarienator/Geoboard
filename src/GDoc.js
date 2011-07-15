gb.docs = [];
/**
 * 
 * @param {string}
 *          title
 * @class GDoc
 * @constructor
 * @returns
 */
function GDoc (title) {
  var me = this, docNames, can, os, i;
  me.mouse = [ 0, 0 ];
  if (!title) {
    docNames = {};
    $.each(gb.docs, function (k, v) {
      docNames[v.title] = true;
    });
    for (i = 1; docNames[GDoc.prototype.title + i]; i++) {

    }
    title = GDoc.prototype.title + i;
  }
  me.title = title;
  me.canvas = document.createElement('canvas');
  can = $(me.canvas);
  can.attr('width', 800);
  can.attr('height', 600);
  if (window.G_vmlCanvasManager)
    window.G_vmlCanvasManager.initElement(me.canvas);
  $('div#area').append(can);
  can.mousedown(function (ev) {
    me.mouse = [ ev.offsetX || ev.layerX, ev.offsetY || ev.layerY ];
    os = shallowClone(me.selection);
    $('#menu').removeClass('expand');
    if (ev.button == 0)
      gb.currentTool.mouseDown(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  can.mousemove(function (ev) {
    me.mouse = [ ev.offsetX || ev.layerX, ev.offsetY || ev.layerY ];
    os = shallowClone(me.selection);
    gb.currentTool.mouseMove(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  can.mouseup(function (ev) {
    me.mouse = [ ev.offsetX || ev.layerX, ev.offsetY || ev.layerY ];
    os = shallowClone(me.selection);
    gb.currentTool.mouseUp(me, me.mouse[0], me.mouse[1], ev);
    if (!eqo(me.selection, os))
      me.refreshMenu();
    ev.preventDefault();
    ev.stopPropagation();
  });
  me.context = me.canvas.getContext("2d");
  me.canvas.doc = me;
  me.lines = {};
  me.points = {};
  me.selection = {};
  me.__nextId = 100;
  me.cmdStack = [];
  me.cmdStackPos = 0;
  me.pageHeader = $('<li>' + me.title + '</li>');
  me.pageHeader.click(function () {
    me.active();
  });
  $('#page-header').append(me.pageHeader);
  me.pageHeader = me.pageHeader[0];
  gb.docs.push(me);
};

GDoc.prototype.title = 'Untitled',
/**
 * @type Object
 */
GDoc.prototype.lines = new Object();
/**
 * @type Object
 */
GDoc.prototype.points = new Object();

GDoc.prototype.draw = function () {
  var me = this, context = me.context, start = new Date(), elapse;
  context.fillStyle = "white";
  context.clearRect(0, 0, 800, 600);
  me.forEntities(function (k, v) {
    if (me.selection[v.id()])
      v.drawSelected(context);
    else if (me.hovering === v)
      v.drawHovering(context);
    else if (v.hidden) {
      if(me.showHidden){
        context.globalAlpha = 0.3;
        v.draw(context);
        context.globalAlpha = 1;
      }
    } else
      v.draw(context);
  });
  elapse = new Date() - start;
  context.fillStyle = "black";
  context.fillText((1000 / elapse + 1).toFixed(3) + "fps", 15, 15);
};

GDoc.prototype.hitTest = function (x, y) {
  var me = this, po, pos, mini = [], minid = 1e300, min0, mind0, min1, mind1, 
      temp, p, currd, d, res = {
    found : [],
    current : [ NaN, NaN ]
  };
  me.forVisibles(function (k, v) {
    if (v.hitTest(x, y)) {
      p = v.getPosition(v.nearestArg(x, y));
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
    po = null;
    $.each(res.found, function (k, v) {
      if (v.obj.isPoint) {
        po = v.obj;
        return false;
      }
    });
    if (po) {
      res.found = [ po ];
      pos = po.getPosition();
      res.current[0] = pos[0];
      res.current[1] = pos[1];
    } else {
      min0 = res.found[0], mind0 = dist([ x, y ], [ min0.x, min0.y ]);
      min1 = res.found[1], mind1 = dist([ x, y ], [ min1.x, min1.y ]);
      if (mind1 < mind0) {
        temp = min0;
        min0 = min1;
        min1 = temp;
        temp = mind0;
        mind0 = mind1;
        mind1 = temp;
      }
      $.each(res.found, function (k, curr) {
        if (k < 2)
          return;
        currd = dist([ x, y ], [ curr.x, curr.y ]);
        if (currd < mind1) {
          min1 = curr;
          mind1 = currd;
          if (mind1 < mind0) {
            temp = min0;
            min0 = min1;
            min1 = temp;
            temp = mind0;
            mind0 = mind1;
            mind1 = temp;
          }
        }
      });
      res.found = [ min0.obj, min1.obj ];
      $.each(min0.obj.inters(min1.obj), function (k, v) {
        d = dist(v, [ x, y ]);
        if (k > 0) {
          if(d < minid) {
            minid = d;
            mini = v;
          }
        } else {
          minid = d;
          mini = v;
        }
      });
      res.current = mini;
    }
  }
  return res;
};

GDoc.prototype.get = function (key) {
  var me = this;
  return me.lines[key] || me.points[key];
};

GDoc.prototype.add = function (obj) {
  var me = this;
  if (obj.isPoint)
    me.points[obj.id()] = obj;
  else
    me.lines[obj.id()] = obj;
  me.selection = {};
  me.selection[obj.id()] = obj;
};

GDoc.prototype.del = function (obj) {
  var me = this;
  if (obj.isPoint)
    delete me.points[obj.id()];
  else
    delete me.lines[obj.id()];
  if (me.selection[obj.id()])
    delete me.selection[obj.id()];
};

GDoc.prototype.load = function (json) {
  var me = this;
  me.points = {};
  me.lines = {};
  $.each(json.entities, function (k, v) {
    var obj = gb.geom[v.type]();
    obj.load(v.data, me);
    if (obj.isPoint)
      me.points[obj.id()] = obj;
    else
      me.lines[obj.id()] = obj;
  });
  me.title = json.title;
  me.__nextId = json.nextId;
  me.cmdStack = [];
  me.cmdStackPos = 0;
  me.draw();
  me.refreshMenu();
};

GDoc.prototype.save = function () {
  var result = {
    title : this.title,
    nextId : this.__nextId,
    entities : []
  };
  $.each(this.topoSort().result, function (k, v) {
    result.entities.push({
      type : v.type(),
      data : v.save()
    });
  });
  if (window.localStorage)
    window.localStorage[this.title] = gb.json.encode(result);
};

/**
 * 
 * @param {function(string,Geom,GDoc)}callback
 */

GDoc.prototype.forEntities = function (callback) {
  var me = this;
  $.each(me.lines, function (k, v) {
    callback(k, v, me);
  });
  $.each(me.points, function (k, v) {
    callback(k, v, me);
  });
};

GDoc.prototype.forVisibles = function (callback) {
  if (this.showHidden) return this.forEntities(callback);
  var me = this;
  $.each(me.lines, function (k, v) {
    if(v.hidden) return true;
    callback(k, v, me);
  });
  $.each(me.points, function (k, v) {
    if(v.hidden) return true;
    callback(k, v, me);
  });
};

GDoc.prototype.nextId = function () {
  return "ent" + this.__nextId++;
};

GDoc.prototype.topoSort = function () {
  var me = this, q, qi, curr, parent = {}, children = {}, top = {};

  me.forEntities(function (k, v) {
    var pats = v.getParents();
    parent[v.id()] = pats;
    if (pats.length == 0) {
      top[v.id()] = v;
    }
  });
  $.each(parent, function (k, v) {
    $.each(v, function (ki, ch) {
      if (!children[ch.id()])
        children[ch.id()] = {};
      children[ch.id()][k] = me.get(k);
    });
    parent[k] = v.length;
  });
  q = [];
  $.each(top, function (k, v) {
    q.push(v);
  });
  qi = 0;
  while (qi < q.length) {
    curr = q[qi++];
    if (!children[curr.id()])
      children[curr.id()] = {};
    else
      $.each(children[curr.id()], function (k, v) {
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
};

GDoc.prototype.run = function (cmd) {
  var me = this;
  if (cmd.canDo(me)) {
    cmd.exec(me);
    me.cmdStack.length = me.cmdStackPos++;
    me.cmdStack.push(cmd);
    me.draw();
    me.refreshMenu();
    me.save();
  }
};

GDoc.prototype.canUndo = function () {
  return this.cmdStackPos > 0;
};

GDoc.prototype.undo = function () {
  var me = this, cmd;
  if (me.canUndo()) {
    cmd = me.cmdStack[me.cmdStackPos - 1];
    cmd.undo(me);
    --me.cmdStackPos;
    me.draw();
    me.refreshMenu();
    me.save();
  }
};

GDoc.prototype.canRedo = function () {
  return this.cmdStackPos < this.cmdStack.length;
};

GDoc.prototype.lastCommand = function () {
  return this.cmdStack[this.cmdStackPos - 1];
};

GDoc.prototype.redo = function () {
  var me = this, cmd;
  if (me.canRedo()) {
    cmd = me.cmdStack[me.cmdStackPos];
    cmd.redo(me);
    me.cmdStackPos++;
    me.draw();
    me.refreshMenu();
    me.save();
  }
};

GDoc.prototype.refreshMenu = function () {
  var me = this;
  $('li.sub-item').each(function (k, item) {
    if (!item.action.isEnabled || item.action.isEnabled(me)) {
      $(item).removeClass('disabled');
    } else {
      $(item).addClass('disabled');
    }
  });
};

GDoc.prototype.active = function () {
  var me = this;
  $('canvas').removeClass('active');
  $('#page-header li').removeClass('active');
  $(me.canvas).addClass('active');
  $(me.pageHeader).addClass('active');
  gb.currentDocument = this;
  if (window.localStorage)
    window.localStorage.__currentDocument = this.title;
  me.draw();
};

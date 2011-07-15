var gb = {};
gb.geo = {};

Array.prototype.contains = function (x) {
  var i;
  for (i = 0; i < this.length; i++)
    if (x == this[i])
      return true;
  return false;
};

function eqo (o2) {
  var o1 = this, failed = false;
  $.each(this, function (k) {
    if (!o2[k])
      return !(failed = true);
  });
  if (failed)
    return false;

  $.each(o2, function (k) {
    if (!o1[k])
      return !(failed = true);
  });
  return !failed;
};

/**
 * 
 * @param {Object}
 *          x
 * @returns {Object}
 */
function shallowClone (x) {
  var result = new Object();
  $.each(x, function (k, v) {
    result[k] = v;
  });
  return result;
}

function m2a (m) {
  var a = [];
  $.each(m, function (k, v) {
    a.push(v);
  });
  return a;
}

function a2m (a) {
  var m = {};
  $.each(a, function (k, v) {
    m[v.id()] = v;
  });
  return m;
}

function cross (p1, p2, p3) {
  return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
}

function dist (p1, p2) {
  var dx = p1[0] - p2[0], dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
}

function projArg (p1, p2, p3) {
  var x = p3[0], y = p3[1], k, ik;
  if (p1[1] == p2[1]) {
    return (x - p1[0]) / (p2[0] - p1[0]);

  } else if (p1[0] == p2[0]) {
    return (y - p1[1]) / (p2[1] - p1[1]);
  }
  k = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  ik = 1 / k;
  x = (y - p1[1]) + k * p1[0] + x * ik;
  x /= ik + k;
  return (x - p1[0]) / (p2[0] - p1[0]);
}

window.setTool = function (id) {
  $('ul.tool li').removeClass('active');
  $('#' + id).addClass('active');
  var action = $('#' + id)[0].action;
  gb.currentTool.reset();
  gb.currentTool = action;
  gb.currentDoc.draw();
  gb.currentDoc.refreshMenu();
};

Math.nrand = function () {
  var x1, x2, rad, c, r;
  if (Math.__lastc2 !== undefined) {
    r = Math.__lastc2;
    delete Math.__lastc2;
    return r;
  }
  do {
    x1 = 2 * this.random() - 1;
    x2 = 2 * this.random() - 1;
    rad = x1 * x1 + x2 * x2;
  } while (rad >= 1);
  if (rad == 0)
    return 0;
  c = Math.sqrt(-2 * Math.log(rad) / rad);
  Math.__lastc2 = x2 * c;
  return x1 * c;
};

function installMenu () {
  var menu = $('ul#menu'), item, ul, sitem;
  $.each(gb.menu.items, function (k, v) {
    item = $('<li class="item">' + gb.menu[v].text + '</li>');
    menu.append(item);
    ul = null;
    $.each(gb.menu[v].items, function (sk, sv) {
      if (!ul) {
        ul = $('<ul class="sub-menu"></ul>');
        item.append(ul);
      }
      if (sv == '-') {
        ul.append($('<li class="sep"></li>'));
      } else {
        sitem = $('<li class="sub-item">' + gb.menu[v][sv].text + '</li>');
        ul.append(sitem);
        sitem.isEnabled = function () {
          return !gb.menu[v][sv].isEnabled ? true : gb.menu[v][sv].isEnabled(gb.currentDoc);
        };
        sitem[0].action = gb.menu[v][sv];
        sitem[0].action.text = function (text) {
          return sitem.text(text);
        };
        sitem.click(function () {
          gb.menu[v][sv].run(gb.currentDoc);
          $('#menu').removeClass('expand');
        });
      }
    });
  });
  $('#menu').click(function (ev) {
    $('#menu').addClass('expand');
  });
  $('#center').click(function () {
    $('#menu').removeClass('expand');
  });
}

window.init = function () {
  installMenu();
  $.each(gb.tools, function (k, v) {
    if (!gb.currentTool)
      gb.currentTool = v;
    var li = $('<li class="item" id="tools-' + k + '">' + v.text + '</li>');
    li[0].action = v;
    $('#tools').append(li);
  });

  $('#tools li:nth(1)').addClass('active');
  $('ul.tool li').click(function (ev) {
    if (ev.currentTarget.id == 'tools-hider')
      return;
    $('ul.tool li').removeClass('active');
    window.setTool(ev.currentTarget.id);
  });
  $('#tools-hider').click(function (ev) {
    $('#center').toggleClass('hide-tools');
  });
  $('#menu-undo').click(function (ev) {
    gb.currentDoc.undo();
  });
  $('#menu-redo').click(function (ev) {
    gb.currentDoc.redo();
  });
  $(document).keyup(function (ev) {
    switch (ev.keyCode) {
    case 18:
      ev.preventDefault();
      ev.stopPropagation();
      $('#menu').removeClass('show-ud');
      break;
    }
  });
  $(document).keydown(function (ev) {
    var gdoc = gb.currentDoc;
    switch (ev.keyCode) {
    case 27:
      window.setTool('tools-sel');
      ev.stopPropagation();
      break;
    case 45:
      window.setTool('tools-sel');
      ev.stopPropagation();
      break;
    case 8:
      // delete
      ev.preventDefault();
      ev.stopPropagation();
      gdoc.run(new DeleteCommand(gdoc.selection));
      break;
    case 18:
      ev.preventDefault();
      ev.stopPropagation();
      $('#menu').addClass('show-ud');
      break;
    case 90:
      if (ev.metaKey) {
        if (!ev.shiftKey)
          gdoc.undo();
        else
          gdoc.redo();
      }
      break;
    default:
      $('#menu').removeClass('show-ud');
      // console.dir(ev);
      ev.stopPropagation();
    }
  });

  var cd, title = "", doc, json;
  if (window.localStorage) {
    cd = "";
    for (title in window.localStorage) {
      if (title == "__currentDocument")
        cd = window.localStorage[title];
      else {
        json = window.localStorage[title];
        doc = new GDoc(title);
        doc.load(gb.json.decode(json));
      }
    }

    if (cd) {
      $.each(gb.docs, function (k, v) {
        if (v.title == cd) {
          gb.currentDoc = v;
          v.active();
          return false;
        }
      });
    } else if (gb.docs.length == 0) {
      doc = new GDoc();
      gb.currentDoc = doc;
      doc.active();
    }
  } else {
    doc = new GDoc();
    gb.currentDoc = doc;
    doc.active();
  }
};

if (!document.createElement('canvas').getContext)
  $('head').append('<scr' + 'ipt src="scripts/excanvas.compiled.js"></script>');
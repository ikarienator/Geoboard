var gb = {};
gb.geo = {};
gb.keys = {};
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

function join (m1, m2) {
  var result = {};
  $.each(m1, function(k, v) {
    if(v === m2[k])
      result[k] = v;
  });
  return result;
}
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
    m[v.id] = v;
  });
  return m;
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

function registerShortcutKey(sk) {
  if (sk instanceof Array) {
    $.each(sk, function(k, v) { registerShortcutKey(v); });
  }
  if(!gb.keys[sk.keyCode]) {
    gb.keys[sk.keyCode] = {
      ctrl : {
        alt : {
          shift : [],
          def : []
        },
        shift : [],
        def : []
      },
      alt : {
        shift : [],
        def : []
      },
      def : [],
    };
  }
  var item = gb.keys[sk.keyCode];
  if (sk.alter & ShortcutKey.CTRL) {
    item = item.ctrl;
  }
  
  if (sk.alter & ShortcutKey.ALT) {
    item = item.alt;
  }
  
  if (sk.alter & ShortcutKey.SHIFT) {
    item = item.shift;
  }
  
  if (item.def) item = item.def;
  
  item.push(sk);
  return true;
}

function installMenu () {
  var menu = $('ul#menu'), item, ul;
  $.each(gb.menu.items, function (k, v) {
    item = $('<li class="item">' + gb.menu[v].text + '</li>');
    menu.append(item);
    ul = null;
    $.each(gb.menu[v].items, function (sk, sv) {
      var sitem, mitem;
      if (!ul) {
        ul = $('<ul class="sub-menu"></ul>');
        item.append(ul);
      }
      if (sv == '-') {
        ul.append($('<li class="sep"></li>'));
      } else {
        mitem = gb.menu[v][sv];
        sitem = $('<li class="sub-item">' + mitem.text + '</li>');
        if (mitem.shortcutKey) 
          registerShortcutKey(mitem.shortcutKey);
        ul.append(sitem);
        sitem[0].action = mitem;
        sitem[0].action.item = sitem;
        sitem[0].action.text = function (text) {
          return this.item.html(text);
        };
        sitem.click(function (ev) {
          if(!mitem.isEnabled || mitem.isEnabled(gb.currentDoc)) {
            mitem.run(gb.currentDoc);
            $('#menu').removeClass('expand');
          }
          ev.stopPropagation();
        });
      }
    });
  });
  $('#menu li.item').click(function (ev) {
    $('#menu').addClass('expand');
  });
  $('#center').click(function () {
    $('#menu').removeClass('expand');
  });
}

function handleKeydown (ev) {
  var gdoc = gb.currentDoc, sk;
  if (gb.keys[ev.keyCode]) {
    sk = gb.keys[ev.keyCode];
    if (ev.metaKey) {
      sk = sk.ctrl;
    }
    
    if (ev.altKey) {
      sk = sk.alt;
    }
    
    if (ev.shiftKey) {
      sk = sk.shift;
    }
    
    if (sk.def) sk = sk.def;
    
    if (sk.length == 1) {
      ev.preventDefault();
      ev.stopPropagation();
      sk = sk[0];
      sk.func();
      return;
    }
  };
  switch (ev.keyCode) {
  case 48:
    if (ev.metaKey) {
      gb.currentDoc.zoomRestore();
      ev.preventDefault();
      ev.stopPropagation();
    }
    break;
  case 49:
  case 50:
  case 51:
  case 52:
    if(!ev.metaKey && !ev.shiftKey){
      ev.preventDefault();
      ev.stopPropagation();
      setTool(gb.toolids[ev.keyCode - 49]);
    }
    break;
  case 27:
    window.setTool('tools-sel');
    ev.stopPropagation();
    break;
  case 45:
    window.setTool('tools-sel');
    ev.stopPropagation();
    break;
  case 18:
    ev.preventDefault();
    ev.stopPropagation();
    $('#menu').addClass('show-ud');
    break;
  case 72:
    if (ev.metaKey) {
      gdoc.run(new HideCommand(gdoc.selection, !ev.shiftKey));
      ev.preventDefault();
      ev.stopPropagation();
    }
    break;
  default:
    $('#menu').removeClass('show-ud');
    console.dir(ev.keyCode);
    ev.stopPropagation();
  }
}

window.init = function () {
  installMenu();
  var cd, title = "", doc, json;
  gb.toolids = [], 
  $.each(gb.tools, function (k, v) {
    if (!gb.currentTool)
      gb.currentTool = v;
    var li = $('<li class="item" id="tools-' + k + '">' + v.text + '</li>');
    li[0].action = v;
    $('#tools').append(li);
    gb.toolids.push('tools-' + k);
  });

  $('#tools li:nth(1)').addClass('active');
  $('ul.tool li').click(function (ev) {
    if (ev.currentTarget.id == 'tools-hider')
      return;
    $('ul.tool li').removeClass('active');
    window.setTool(ev.currentTarget.id);
  });
  $('#left .tools-hider').click(function (ev) {
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
  $(document).keydown(handleKeydown);
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
    if (gb.docs.length == 0) {
      doc = new GDoc();
      gb.currentDoc = doc;
      doc.active();
      cd = doc.title;
    }
    
    if (cd) {
      $.each(gb.docs, function (k, v) {
        if (v.title == cd) {
          gb.currentDoc = v;
          v.active();
          return false;
        }
      });
    } else {
      gb.docs[0].active();
    }
    
  } else {
    doc = new GDoc();
    gb.currentDoc = doc;
    doc.active();
  }
  $(window).resize(function(){
    gb.currentDoc.resize($('#area').width(), $('#area').height());
  });
};

if (!document.createElement('canvas').getContext)
  $('head').append('<scr' + 'ipt src="scripts/excanvas.compiled.js"></script>');
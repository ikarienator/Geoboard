/**
 * @namespace gb
 */
var gb = {};
gb.geom = {};
gb.keys = {};

String.prototype.startsWith = function(str) {
  return this.indexOf(str) === 0;
}

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
    $.each(sk, function(k, v) {
      registerShortcutKey(v);
    });
  }

  if (!gb.keys[sk.keyCode]) {
    gb.keys[sk.keyCode] = {
      ctrl : {
        alt : {
          shift : [],
          def : []
        },
        shift : {
          def : []
        },
        def : []
      },
      alt : {
        shift : {
          def : []
        },
        def : []
      },
      shift : {
        def : []
      },
      def : []
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

function installMenu() {
  var menu = $('ul#menu'), item, ul;
  $.each(gb.menu.items, function (k, v) {
    item = $('<li class="item">' + gb.menu[v].text + '</li>');
    menu.append(item);
    ul = null;
    $.each(gb.menu[v].items, function (sk, sv) {
      var sitem, mitem, text;
      if (!ul) {
        ul = $('<ul class="sub-menu"></ul>');
        item.append(ul);
      }
      if (sv == '-') {
        ul.append($('<li class="sep"></li>'));
      } else {
        mitem = gb.menu[v][sv];
        text = mitem.text;
        if (mitem.shortcutKey) {
          registerShortcutKey(mitem.shortcutKey);
          // text += mitem.shortcutKey.toString();
        }
        sitem = $('<li class="sub-item">' + text + '</li>');
        ul.append(sitem);
        sitem[0].action = mitem;
        sitem[0].action.item = sitem;
        sitem[0].action.text = function (text) {
          return this.item.html(text);
        };
        sitem.click(function (ev) {
          if (!mitem.isEnabled || mitem.isEnabled(gb.currentDoc)) {
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

function handleKeydown(ev) {
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
      gb.currentTool.reset();
      ev.preventDefault();
      ev.stopPropagation();
      sk = sk[0];
      sk.func();
      return;
    }
  }
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
      if (!ev.metaKey && !ev.shiftKey) {
        ev.preventDefault();
        ev.stopPropagation();
        gb.utils.setTool(gb.toolids[ev.keyCode - 49]);
      }
      break;
    case 27:
      gb.utils.setTool('tools-sel');
      ev.stopPropagation();
      break;
    case 45:
      gb.utils.setTool('tools-sel');
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

loadPrevious = function () {
  var cd, json, doc, title;
  if (window.localStorage) {
    cd = "";
    for (title in window.localStorage) {
      if (title == gb.localStoragePrefix + "currentDocument")
        cd = window.localStorage[title];
      else {
        json = window.localStorage[title];
        if (title.startsWith(gb.localStoragePrefix)) {
          doc = new GDoc(title.substr(gb.localStoragePrefix.length));
          doc.load(gb.json.decode(json));
        }
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
};

installTools = function () {
  gb.toolids = [];
  $.each(gb.tools, function (k, v) {
    if (!gb.currentTool)
      gb.currentTool = v;
    if (v instanceof Array) {
      var li = $('<li class="item group></li>'), ul = $('<ul></ul>');
      $('#tools').append(li);
      li.append(ul);
      $.each(v, function(k, item) {
        var li = $('<li id="tools-' + k + '">' + v.text + '</li>');
        ul.append(ul);
        li[0].action = v;
      });
    } else {
      var li = $('<li class="item" id="tools-' + k + '">' + v.text + '</li>');
      li[0].action = v;
      $('#tools').append(li);
      gb.toolids.push('tools-' + k);
    }
  });
  $('ul.tool li').bind('click touchstart', function (ev) {
    if (ev.currentTarget.id == 'tools-hider')
      return;
    $('ul.tool li').removeClass('active');
    gb.utils.setTool(ev.currentTarget.id);
  });
  $('#left .tools-hider').click(function (ev) {
    $('#center').toggleClass('hide-tools');
  });
  $('#tools li:nth(0)').addClass('active');
};

window.init = function () {
  if (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
      ) {
    $.isTouch = true;
    $(document).addClass('touch');  
  }
  loadPrevious();
  installMenu();
  installTools();
  if ($.isTouch) {
    $(document).bind('touchmove', function(event) {
      event.preventDefault();
    });
  }
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
  gb.utils.setTool('tools-sel');
  $(window).resize(function() {
    gb.currentDoc.resize($('#area').width(), $('#area').height());
  });
};

if (!document.createElement('canvas').getContext) {
  $('head').append('<scr' + 'ipt src="scripts/excanvas.compiled.js"></script>');
}
  
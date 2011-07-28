function ShortcutKey(keyCode, alter, func) {
  this.keyCode = keyCode;
  this.alter = alter;
  if (typeof func == 'string') {
    this.func = function () { var item = eval(func); if(!item.isEnabled || item.isEnabled(gb.currentDoc)) item.run(gb.currentDoc); };
  } else
    this.func = func;
};

ShortcutKey.CTRL = 1;
ShortcutKey.ALT = 2;
ShortcutKey.SHIFT = 4;

ShortcutKey.prototype = {
  keyCode : 0,
  alter : 0,
  func : function () {},
  test : function (ev){
    if (this.alter & ShortcutKey.CTRL) 
      if (!(ev.metaKey)) return false;
    if (this.alter & ShortcutKey.ALT) 
      if (!(ev.altKey)) return false;
    if (this.alter & ShortcutKey.SHIFT) 
      if (!(ev.shiftKey)) return false;
    return true;
  }
};
function ShortcutKey(keyCode, alter, func) {
  this.keyCode = keyCode;
  this.alter = alter;
  if (typeof func == 'string') {
    this.func = function () {
      var item = eval(func);
      if (!item.isEnabled || item.isEnabled(gb.currentDoc)) item.run(gb.currentDoc);
    };
  } else
    this.func = func;
}
;

ShortcutKey.CTRL = 1;
ShortcutKey.ALT = 2;
ShortcutKey.SHIFT = 4;
ShortcutKey.KEY_NAME = [
  '#0',
  '#1',
  '#2',
  '#3',
  '#4',
  '#5',
  '#6',
  '#7',
  'Backspace',
  'Tab',
  '#10',
  '#11',
  '#12',
  'Enter',
  '#14',
  '#15',
  'Shift',
  'Ctrl',
  '⌥',
  'Break',
  'Caps Lock',
  '#21',
  '#22',
  '#23',
  '#24',
  '#25',
  '#26',
  'Esc',
  '#28',
  '#29',
  '#30',
  '#31',
  'Space bar',
  'Page Up',
  'Page Down',
  'End',
  'Home',
  '←',
  '↑',
  '→',
  '↓',
  'Insert',
  'Delete',
  '#47',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '#58',
  '#59',
  '#60',
  '#61',
  '#62',
  '#63',
  '#64',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '⌘',
  '⌘',
  '#93',
  'num 0', 'num 1', 'num 2', 'num 3', 'num 4', 'num 5', 'num 6', 'num 7', 'num 8', 'num 9',
  '*',
  '+',
  '.',
  '/',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  '#124', '#125', '#126', '#127', '#',
  'Num Lock', 'Scroll Lock'
];


ShortcutKey.prototype = {
  keyCode : 0,
  alter : 0,
  func : function () {
  },
  test : function (ev) {
    if (this.alter & ShortcutKey.CTRL)
      if (!(ev.metaKey)) return false;
    if (this.alter & ShortcutKey.ALT)
      if (!(ev.altKey)) return false;
    if (this.alter & ShortcutKey.SHIFT)
      if (!(ev.shiftKey)) return false;
    return true;
  },
  toString : function () {
    var text = "";
    if (this.keyCode) {
      if (this.keyCode >= 65 && this.keyCode <= 90 && this.keyCode >= 96 && this.keyCode <= 122)
        text += String.fromCharCode(this.keyCode);
      else
        text += String.fromCharCode(this.keyCode);
    }
  }
};
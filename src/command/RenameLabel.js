function RenameLabel(obj, label) {
  this.obj = obj;
  this.label = label;
}

RenameLabel.prototype = new Command();

/**
 *
 * @param {GDoc} gdoc
 * @return {Boolean}
 */
RenameLabel.canDo = function (gdoc) {
  var me = this, ok = true;
  return me.obj.isLabeled;
};

/**
 *
 * @param {GDoc} gdoc
 */
RenameLabel.exec = function (gdoc) {
  this.lastLabel = this.obj.name;
  this.redo(gdoc);
};

/**
 *
 * @param {GDoc} gdoc
 */
RenameLabel.undo = function (gdoc) {
  this.obj.name = this.lastLabel;
};

/**
 *
 * @param {GDoc} gdoc
 */
RenameLabel.redo = function (gdoc) {
  this.obj.name = this.label;
};
/**
 * @class PanAction
 * @extends Action
 */
function PanAction() {
  this.init();
}

PanAction.prototype = new Action();

PanAction.reset = function () {
  this.lastPosition = null;
};

PanAction.mouseDown = function (gdoc, x, y) {
  this.lastPosition = [x, y];
};

PanAction.mouseMove = function (gdoc, x, y) {

}
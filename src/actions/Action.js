function Action() {
    this.init();
}

Action.prototype = {
    reset: function () {
    },
    init: function () {
    },
    click: function () {
    },
    /**
     * @param {GDoc} gdoc
     * @param {Number} x
     * @param {Number} y
     * @param {Event} event
     */
    mouseDown: function (gdoc, x, y, event) {
    },
    /**
     * @param {GDoc} gdoc
     * @param {Number} x
     * @param {Number} y
     * @param {Event} event
     */
    mouseMove: function (gdoc, x, y) {
    },
    /**
     * @param {GDoc} gdoc
     * @param {Number} x
     * @param {Number} y
     * @param {Event} event
     */
    mouseUp: function (gdoc, x, y) {
    }
};

gb.tools = {};
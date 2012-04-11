/**
 * @class
 * @inherits {Command}
 */
function ConstructCommand() {
    Command.apply(this, arguments);
}
ConstructCommand.prototype = new Command();

/**
 * @field {Array} newObjects
 */
ConstructCommand.prototype.newObjects = [];

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.createNew = function (gdoc) {
    throw 'createNew(gdoc) not implemented';
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.exec = function (gdoc) {
    this.newObjects = this.createNew(gdoc);
    if (!(this.newObjects instanceof Array)) {
        this.newObjects = [this.newObjects];
    }
    this.redo(gdoc);
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.undo = function (gdoc) {
    $.each(this.newObjects.reverse(), function (k, v) {
        gdoc.del(v);
    });
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.redo = function (gdoc) {
    $.each(this.newObjects, function (k, v) {
        gdoc.add(v);
    });
    gdoc.selection = gb.utils.a2m(this.newObjects);
};
function GBPoint(document, x, y) {
    GBAbstractPoint.apply(this, [ document, [ ], [x, y] ]);
}

GBPoint.X = 0;
GBPoint.Y = 1;

GBPoint.prototype = new GBAbstractPoint();

GBPoint.prototype.drag = function (from, to) {
    this.setParam(GBPoint.X, this.getParam(GBPoint.X) + to[0] - from[0]);
    this.setParam(GBPoint.Y, this.getParam(GBPoint.Y) + to[1] - from[1]);
};

GBPoint.prototype.type = function () {
    return "gpo";
};

GBPoint.prototype.getPosition = function () {
    return [ this.getParam(GBPoint.X), this.getParam(GBPoint.Y) ];
};

GBPoint.prototype.getInstruction = function (context) {
    return 'var ' + this.id + '_x = gdoc.get("' + this.id + '").__params[0];\n' +
        'var ' + this.id + '_y = gdoc.get("' + this.id + '").__params[1];';
};

GBPoint.prototype.getInstructionRef = function (arg, context) {
    if (!context.desc[this.id]) {
        return this.getInstructionRefStatic();
    }
    return '[' + this.id + '_x,' + this.id + '_y]';
};

gb.geom.reg(GBPoint);
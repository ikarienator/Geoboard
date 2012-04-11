function GBMidpoint(document, line) {
    GBAbstractPoint.apply(this, [document, [line], []]);
}

GBMidpoint.prototype = new GBAbstractPoint();
GBMidpoint.prototype.dragInvolve = function () {
    return this.getParent(0).dragInvolve();
};

GBMidpoint.prototype.drag = function (from, to) {

};

GBMidpoint.prototype.type = function () {
    return "mpo";
};

GBMidpoint.prototype.getPosition = function () {
    if (this.__dirty) {
        return this.getParent(0).getPosition(0.5);
    }
    return this.cache;
};

GBMidpoint.prototype.getInstruction = function (context) {
    return '';
};

GBMidpoint.prototype.getInstructionRef = function (arg, context) {
    return this.getParent(0).getInstructionRef(0.5, context);
};

gb.geom.reg(GBMidpoint);
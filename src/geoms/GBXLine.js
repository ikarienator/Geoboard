function GBXLine(document, gpo1, gpo2) {
    GBLine.apply(this, [ document, gpo1, gpo2]);
}

GBXLine.prototype = new GBLine();
GBXLine.labelArg = 0;
GBXLine.prototype.adjustArg = function (arg) {
    return arg;
};

GBXLine.prototype.adjustArgInstruction = function (arg) {
    return '';
};

GBXLine.prototype.legalArg = function (arg) {
    return !isNaN(arg);
};

GBXLine.prototype.legalArgInstructionRef = function (arg) {
    return '!isNaN(' + arg + ')';
};

GBXLine.prototype.argRange = function () {
    var ext = this.document.context.getExtent(),
        arg = this.crossArg(ext[0], ext[1], ext[2] - ext[0], ext[3] - ext[1]);
    return [arg[0] + (arg[0] - arg[1]) * 2, arg[1] + (arg[1] - arg[0]) * 2];
};

GBXLine.prototype.getPosition = function (arg) {
    return GBLine.prototype.getPosition.apply(this, [arg]);
};

GBXLine.prototype.type = function () {
    return 'xli';
};

gb.geom.reg(GBXLine);
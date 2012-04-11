function ConstructProjectionPoint(line, po) {
    this.line = line;
    this.po = po;
}
;

ConstructProjectionPoint.prototype = new ConstructCommand();

ConstructProjectionPoint.prototype.canDo = function (gdoc) {
    return !!(this.line !== undefined && this.line.isLine);
};

ConstructProjectionPoint.prototype.createNew = function (gdoc) {
    return new GBProjectionPoint(gdoc, this.line, this.po);
};
/**
 * @class GBCircle
 * @extends LabeledGeom
 * @param {string}
    *          id
 * @param {GBPoint}
    *          center
 * @param {GBPoint}
    *          on
 * @constructor
 */
function GBCircle (document, center, on) {
    LabeledGeom.apply(this, [ document, [ center, on ] ]);
}

GBCircle.prototype = new LabeledGeom();
GBCircle.CENTER = 0;
GBCircle.ON = 1;

GBCircle.prototype.color = '#080';
GBCircle.prototype.isCircle = true;

GBCircle.prototype.prop = function () {
    var cen = this.getParent(GBCircle.CENTER).getPosition(),
        on = this.getParent(GBCircle.ON).getPosition(),
        dx = cen[0] - on[0],
        dy = cen[1] - on[1],
        r = dx * dx + dy * dy;
    r = Math.sqrt(r);
    return [ cen[0], cen[1], r, [
        [ 0, Math.PI * 2 ]
    ] ];
};

GBCircle.prototype.draw = function (context) {
    var prop = this.prop();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(3);
    context.strokeStyle = this.color;
    context.stroke();
};

GBCircle.prototype.drawSelected = function (context) {
    var prop = this.prop();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2] - context.transP2M(4), 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#44c";
    context.stroke();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2] + context.transP2M(4), 0, Math.PI * 2, false);
    context.closePath();
    context.stroke();
    this.draw(context);
};

GBCircle.prototype.drawHovering = function (context) {
    var prop = this.prop();
    context.beginPath();
    context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(3);
    context.strokeStyle = "#f00";
    context.stroke();
};

GBCircle.prototype.hitTest = function (x, y, radius) {
    var prop = this.prop(),
        dx = prop[0] - x,
        dy = prop[1] - y,
        r = dx * dx + dy * dy;
    r = Math.sqrt(r);
    return r - this.document.context.transP2M(radius) < prop[2] && prop[2] < r + this.document.context.transP2M(radius);
};

GBCircle.prototype.inters = function (obj) {
    if (obj.isLine) {
        return obj.inters(this);
    }
    else if (obj.isCircle) {
        var prop1 = this.prop(),
            prop2 = obj.prop(),
            d = Math.sqrt(Geom.dist2(prop1, prop2)),
            r1 = prop1[2],
            r2 = prop2[2],
            d1 = ((r1 * r1 - r2 * r2) / d + d) * 0.5,
            h = Math.sqrt(r1 * r1 - d1 * d1),
            dx = prop2[0] - prop1[0],
            dy = prop2[1] - prop1[1],
            c1 = [ prop1[0] + (dx * d1 - dy * h) / d, prop1[1] + (dy * d1 + dx * h) / d ],
            c2 = [ prop1[0] + (dx * d1 + dy * h) / d, prop1[1] + (dy * d1 - dx * h) / d ];
        return [ c1, c2 ];
    }
};

GBCircle.prototype.crossTest = function (l, t, r, b) {
    var prop = this.prop(),
        ps = [
            [ l, b ],
            [ l, t ],
            [ r, t ],
            [ r, b ]
        ],
        ds = $.map(ps, function (v, k) {
            return Geom.dist2(v, prop);
        }),
        r2 = prop[2] * prop[2];
    if (ds[0] < r2 && ds[1] < r2 && ds[2] < r2 && ds[3] < r2) {
        return false;
    }
    if (ds[0] > r2 && ds[1] > r2 && ds[2] > r2 && ds[3] > r2) {
        if (Math.abs(prop[1] - t) <= prop[2] || Math.abs(prop[1] - b) <= prop[2]) {
            if (l < prop[0] && prop[0] < r) {
                return true;
            }
        }
        if (Math.abs(prop[0] - l) <= prop[2] || Math.abs(prop[0] - r) <= prop[2]) {
            return (t < prop[1] && prop[1] < b);
        }
        return l < prop[0] - prop[2] && prop[0] + prop[2] < r && t < prop[1] - prop[2] && prop[1] + prop[2] < b;
    }
    return true;
};

GBCircle.prototype.nearestArg = function (x, y) {
    var c = this.getParent(GBCircle.CENTER).getPosition();
    return Math.atan2(y - c[1], x - c[0]);
};

GBCircle.prototype.dragInvolve = function () {
    return [ this.getParent(GBCircle.CENTER), this.getParent(GBCircle.ON) ];
};

GBCircle.prototype.drag = function (from, to) {

};

GBCircle.prototype.type = function () {
    return "gci";
};

GBCircle.prototype.getPosition = function (arg) {
    var prop = this.prop();
    return [ prop[0] + Math.cos(arg) * prop[2], prop[1] + Math.sin(arg) * prop[2] ];
};

GBCircle.prototype.legalArg = function (arg) {
    if (arg < 0) {
        return false;
    }
    if (arg > 2 * Math.PI) {
        return false;
    }
    return true;
};

GBCircle.prototype.argRange = function () {
    return [ 0, 2 * Math.PI ];
};

GBCircle.prototype.randPoint = function () {
    while (true) {
        var arg = Math.random() * 2 * Math.PI;
        if (this.legalArg(arg)) {
            return this.getPosition(arg);
        }
    }
};

GBCircle.prototype.getInstruction = function (context) {
    return 'function ' + this.id + '(arg) { var p1 = ' + this.getParent(0).getInstructionRef(0, context) +
        ', p2 = ' + this.getParent(1).getInstructionRef(0, context) + ',' +
        ' r = Math.sqrt(Geom.dist2(p1, p2));' +
        'return [ p1[0] + Math.cos(arg) * r, p1[1] + Math.sin(arg) * r ]; }';
};

GBCircle.prototype.getInstructionRef = function (arg, context) {
    if (!context.desc[this.id]) {
        return this.getInstructionRefStatic(arg);
    }
    return this.id + '(' + arg + ')';
};

GBCircle.prototype.getInstruction = function (context) {
    return 'function ' + this.id + '(arg) { var p1 = ' + this.getParent(0).getInstructionRef(0, context) +
        ', p2 = ' + this.getParent(1).getInstructionRef(0, context) + ',' +
        ' r = Math.sqrt(Geom.dist2(p1, p2));' +
        'return [ p1[0] + Math.cos(arg) * r, p1[1] + Math.sin(arg) * r ]; }';
};

GBCircle.prototype.getInstructionRefStatic = function (arg) {
    var prop = this.prop();
    return '[' + prop[0] + '+Math.cos(' + arg + ')*' + prop[2] + ',' + prop[1] + '+Math.sin(' + arg + ')*' + prop[2] + ']';
};

GBCircle.prototype.getIntersInstruction = function (obj, context, idx, intId) {
    if (obj.isLine) {
        return obj.getIntersInstruction(this, context, idx, intId);
    } else {
        if (idx >= 2) {
            return '[NaN, NaN]';
        }
        var res = [
            'function() {',
            'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ',',
            'p2 = ' + obj.getParent(0).getInstructionRef(0, context) + ',',
            'd = Math.sqrt(Geom.dist2(p1, p2)),',
            'r1 = Geom.dist2(p1, ' + this.getParent(1).getInstructionRef(0, context) + '),',
            'r2 = Geom.dist2(p2, ' + obj.getParent(1).getInstructionRef(0, context) + '),',
            'd1 = ((r1 - r2) / d + d) * 0.5,',
            'h = Math.sqrt(r1- d1 * d1),',
            'dx = p2[0] - p1[0],',
            'dy = p2[1] - p1[1];',
            idx == 0 ? 'return [ p1[0] + (dx * d1 - dy * h) / d, p1[1] + (dy * d1 + dx * h) / d ];' :
                'return [ p1[0] + (dx * d1 + dy * h) / d, p1[1] + (dy * d1 - dx * h) / d ];',
            '}'
        ];
        return res.join('\n');
    }
};

GBCircle.prototype.isClosed = function () {
    return this.argRange()[1] == this.argRange()[0] + Math.PI * 2;
};

gb.geom.reg(GBCircle);
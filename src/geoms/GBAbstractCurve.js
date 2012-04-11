function GBAbstractCurve() {
    Geom.apply(this, arguments);
}

GBAbstractCurve.SAMPLES = 250;
GBAbstractCurve.prototype = new LabeledGeom();
GBAbstractCurve.prototype.color = "#880";

GBAbstractCurve.prototype.__curve = function (start, stop) {
    var context = this.__curveStart(),
        ps1 = [], ps2 = [], curr1, curr2, i;

    for (i = 0; i <= GBAbstractCurve.SAMPLES; i++) {
        curr1 = start + (stop - start) / GBAbstractCurve.SAMPLES * i;
        curr2 = start + ((stop - start) / GBAbstractCurve.SAMPLES) * (i + 0.5);
        ps1.push(this.__getPosition(curr1, context));
        ps2.push(this.__getPosition(curr2, context));
    }

    this.__curveStop(context);
    return [ps1, ps2];
};

GBAbstractCurve.prototype.__drawPath = function (context) {
    this.update();
    var pss = this.path, ps = pss[0], dc = pss[1], last, top,
        curr, i, ex = context.getExtent(), a, proj, l, t, c;
    if (!ps) {
        return;
    }
    context.beginPath();
    context.moveTo(ps[0][0], ps[0][1]);
    for (i = 1; i < ps.length; i++) {
        last = ps[i - 1];
        top = dc[i - 1];
        curr = ps[i];
        l = (ex[0] < last[0] && last[0] < ex[2] && ex[1] < last[1] && last[1] < ex[3]);
        t = (ex[0] < top[0] && top[0] < ex[2] && ex[1] < top[1] && top[1] < ex[3]);
        c = (ex[0] < curr[0] && curr[0] < ex[2] && ex[1] < curr[1] && curr[1] < ex[3]);
        a = Geom.projArg(last, curr, top);
        proj = [ (curr[0] - last[0]) * a + last[0], (curr[1] - last[1]) * a + last[1] ];
        if (l || t || c) {
            context.quadraticCurveTo(top[0] + top[0] - proj[0], top[1] + top[1] - proj[1], curr[0], curr[1]);
        }
        else {
            context.moveTo(curr[0], curr[1]);
        }
    }
};

GBAbstractCurve.prototype.draw = function (context) {
    this.__drawPath(context);
    context.strokeStyle = this.color;
    context.lineWidth = context.transP2M(4);
    context.stroke();
//  var path = this.path[0];
//  $.each(path, function (k, v) {
//    context.beginPath();
//    context.arc(v[0], v[1], context.transP2M(2), 0, 2 * Math.PI);
//    context.strokeStyle = 'black';
//    context.lineWidth = context.transP2M(1);
//    context.stroke();
//  });
};

/**
 *
 * @param {CanvasContext} context
 */
GBAbstractCurve.prototype.drawSelected = function (context) {
    this.__drawPath(context);
    context.lineWidth = context.transP2M(8);
    context.strokeStyle = "#44c";
    context.stroke();
    context.lineWidth = context.transP2M(6);
    context.strokeStyle = "#fff";
    context.stroke();
    context.strokeStyle = this.color;
    context.lineWidth = context.transP2M(4);
    context.stroke();
};

GBAbstractCurve.prototype.drawHovering = function (context) {
    this.__drawPath(context);
    context.lineWidth = context.transP2M(4);
    context.strokeStyle = "#F00";
    context.stroke();
};

GBAbstractCurve.prototype.crossTest = function (l, t, r, b) {
    this.update();
    var i, path = this.path[0], p1, p2, la, ra, ta, ba, li, ri, ti, bi;
    if (!path) {
        return false;
    }
    for (i = 1; i < path.length; i++) {
        p1 = path[i - 1];
        p2 = path[i];
        if (l < p1[0] && p1[0] < r && t < p1[1] && p1[1] < b) {
            return true;
        }
        if (p1[1] == p2[1]) {
            la = (l - p1[0]) / (p2[0] - p1[0]);
            ra = (r - p1[0]) / (p2[0] - p1[0]);
            if (la < 0) {
                continue;
            }
            if (la > 1) {
                continue;
            }
            if (ra < 0) {
                continue;
            }
            if (ra > 1) {
                continue;
            }
            if (t < p1[1] && p1[1] < b) {
                return true;
            }
        } else if (p1[0] == p2[0]) {
            ta = (t - p1[1]) / (p2[1] - p1[1]);
            ba = (b - p1[1]) / (p2[1] - p1[1]);
            if (ta < 0) {
                continue;
            }
            if (ta > 1) {
                continue;
            }
            if (ba < 0) {
                continue;
            }
            if (ba > 1) {
                continue;
            }
            if (l < p1[0] && p1[0] < r) {
                return true;
            }
        } else {
            la = (l - p1[0]) / (p2[0] - p1[0]);
            ra = (r - p1[0]) / (p2[0] - p1[0]);
            if (la < 0) {
                continue;
            }
            if (la > 1) {
                continue;
            }
            if (ra < 0) {
                continue;
            }
            if (ra > 1) {
                continue;
            }
            li = (p2[1] - p1[1]) * la + p1[1];
            ri = (p2[1] - p1[1]) * ra + p1[1];
            if (t < li && li < b || t < ri && ri < b) {
                return true;
            }

            ta = (t - p1[1]) / (p2[1] - p1[1]);
            ba = (b - p1[1]) / (p2[1] - p1[1]);
            if (ta < 0) {
                continue;
            }
            if (ta > 1) {
                continue;
            }
            if (ba < 0) {
                continue;
            }
            if (ba > 1) {
                continue;
            }
            ti = (p2[0] - p1[0]) * ta + p1[0];
            bi = (p2[0] - p1[0]) * ba + p1[0];

            if (l < ti && ti < r || l < bi && bi < r) {
                return true;
            }

            if (li < ri || ti < bi) {
                return true;
            }
        }
    }
    return false;
};

GBAbstractCurve.prototype.hitTest = function (x, y, radius) {
    this.update();
    var i, path = this.path[0], p1, p2,
        fx, tx, fy, ty, t, c;
    if (!path) {
        return false;
    }
    for (i = 1; i < path.length; i++) {
        p1 = path[i - 1];
        p2 = path[i];
        fx = p1[0];
        tx = p2[0];
        fy = p1[1];
        ty = p2[1];
        if (fx > tx) {
            t = fx;
            fx = tx;
            tx = t;
        }
        if (fy > ty) {
            t = fy;
            fy = ty;
            ty = t;
        }

        c = Geom.cross(p1, [ x, y ], p2);
        c = c * c;
        if (c > radius * radius * Geom.dist2(p1, p2)) {
            continue;
        }
        c = Geom.projArg(p1, p2, [ x, y ]);
        if (c > 1) {
            continue;
        }
        if (c < 0) {
            continue;
        }
        return true;
    }
    return false;
};

GBAbstractCurve.prototype.nearestArg = function (x, y) {
    this.update();
    var context = this.__curveStart(),
        d, mind = Infinity, mini = -1, it = 0, lastMind = 0, i, j, p, range = this.__getDefaultRange(), start = range[0], stop = range[1];
    while (Math.abs(mind - lastMind) > 1e-3 && it++ < 10000) {
        lastMind = mind;
        mind = Infinity;
        for (i = 0; i < 100; i++) {
            j = i * 0.01 * (range[1] - range[0]) + range[0];
            d = Geom.dist2(this.__getPosition(j, context), [x, y]);
            if (d < mind) {
                mini = i;
                mind = d;
            }
        }
        range = [(mini - 1) * 0.01 * (range[1] - range[0]) + range[0], (mini + 1) * 0.01 * (range[1] - range[0]) + range[0]];
    }
    this.__curveStop(context);
    p = (range[0] + range[1]) * 0.5;
    return (p - start) / (stop - start);
};

GBAbstractCurve.prototype.getPosition = function (arg) {
    var range = this.__getDefaultRange();
    return this.__getPosition((range[1] - range[0]) * arg + range[0]);
};

GBAbstractCurve.prototype.update = function () {
    if (this.__dirty) {
        Geom.prototype.update.apply(this, []);
        var range = this.__getDefaultRange();
        this.path = this.__curve(range[0], range[1]);
        this.__dirty = false;
    }
};

GBAbstractCurve.prototype.argRange = function () {
    return [0, 1];
};

GBAbstractCurve.prototype.__getPosition = function (arg) {
    throw '__getPosition(arg) not implemented';
};

GBAbstractCurve.prototype.__curveStart = function () {
    throw '__curveStart() not implemented';
};

GBAbstractCurve.prototype.__curveStop = function (context) {
    throw '__curveStop(context) not implemented';
};

GBAbstractCurve.prototype.__getDefaultRange = function () {
    return this.getParent(GBLocus.POO).getParent(0).argRange();
};
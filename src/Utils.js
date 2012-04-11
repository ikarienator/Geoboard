gb.utils = {};
gb.utils.eqo = function (o2) {
    var o1 = this, failed = false;
    $.each(this, function (k) {
        if (!o2[k]) {
            return !(failed = true);
        }
    });
    if (failed) {
        return false;
    }

    $.each(o2, function (k) {
        if (!o1[k]) {
            return !(failed = true);
        }
    });
    return !failed;
};

gb.utils.join = function (m1, m2) {
    var result = {};
    $.each(m1, function (k, v) {
        if (v === m2[k]) {
            result[k] = v;
        }
    });
    return result;
};

/**
 *
 * @param {Object}
    *          x
 * @returns {Object}
 */
gb.utils.shallowClone = function (x) {
    var result = new Object();
    $.each(x, function (k, v) {
        result[k] = v;
    });
    return result;
};

gb.utils.m2a = function (m) {
    var a = [];
    $.each(m, function (k, v) {
        a.push(v);
    });
    return a;
};

gb.utils.a2m = function (a) {
    var m = {};
    $.each(a, function (k, v) {
        m[v.id] = v;
    });
    return m;
};

gb.utils.setTool = function (id) {
    $('ul.tool li').removeClass('active');
    $('#' + id).addClass('active');
    var action = $('#' + id)[0].action;
    gb.currentTool.reset();
    gb.currentTool = action;
    gb.currentDoc.draw();
    gb.currentDoc.refreshMenu();
};
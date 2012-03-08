/*
 * This document is licensed as free software under the terms of the MIT
 * License: <a href="http://www.opensource.org/licenses/mit-license.php"
 * title="http://www.opensource.org/licenses/mit-license.php">http://www.opensource.org/licenses/mit-license.php</a>
 * 
 * Adapted by Rahul Singla.
 * 
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's <a href="http://www.json.org/json2.js"
 * title="http://www.json.org/json2.js">http://www.json.org/json2.js</a>, which
 * proclaims: "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a
 * sentiment that I uphold.
 * 
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

gb.json = {
  encode : function (o) {
    if (window.JSON && JSON.parse)
      return JSON.stringify(o);

    var type = typeof (o), me = this, ret, i;

    if (o === null)
      return "null";

    switch (type) {
      case "undefined":
        return undefined;
      case "number":
      case "boolean":
        return o.toString();
      case "string":
        return this.quoteString(o);
      case "object":
      default:
        if (typeof o.toJSON == "function")
          return me.encode(o.toJSON());

        if (o.constructor === Array) {
          ret = [];
          for (i = 0; i < o.length; i++)
            ret.push(me.encode(o[i]) || "null");

          return "[" + ret.join(",") + "]";
        }

        ret = [];
        $.each(o, function (k, v) {
          var type = typeof k, name;
          if (type == "number")
            name = '"' + k + '"';
          else if (type == "string")
            name = this._quoteString(k);
          else
            return;
          ret.push(name + ":" + me.encode(v));
        });
        return "{" + ret.join(", ") + "}";
    }
  },

  /**
   * jQuery.JSON.decode(src) Evaluates a given piece of json source.
   */
  decode : function (src) {
    if (window.JSON && JSON.parse)
      return JSON.parse(src);

    return eval("(" + src + ")");
  },

  /**
   * jQuery.JSON.decodeSecure(src) Evals JSON in a way that is *more* secure.
   */
  decodeSecure : function (src) {
    if (typeof (JSON) == 'object' && JSON.parse)
      return JSON.parse(src);

    var filtered = src;
    filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
    filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

    if (/^[\],:{}\s]*$/.test(filtered))
      return eval("(" + src + ")");
    else
      throw new SyntaxError("Error parsing JSON, source is not valid.");
  },

  /**
   * @private
   * @param {string} string
   * @returns {string}
   */
  _quoteString : function (string) {
    if (string.match(this._escapeable)) {
      return '"' + string.replace(this._escapeable, function (a) {
        var c = this._meta[a];
        if (typeof c === 'string')
          return c;
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + string + '"';
  },

  /**
   * @private
   * @constant
   */
  _escapeable : /["\\\x00-\x1f\x7f-\x9f]/g,

  /**
   * @private
   * @constant
   */
  _meta : {
    '\b' : '\\b',
    '\t' : '\\t',
    '\n' : '\\n',
    '\f' : '\\f',
    '\r' : '\\r',
    '"' : '\\"',
    '\\' : '\\\\'
  }
};
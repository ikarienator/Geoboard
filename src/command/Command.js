/**
 * @class Command
 */
function Command() {}

Command.prototype = {
  /**
   * 
   * @param {GDoc} gdoc
   * @returns {Boolean}
   */
  canDo : function(gdoc) {
    throw 'canDoc(gdoc) not implemented';
  },
  /**
   * 
   * @param {GDoc} gdoc
   */
  exec : function(gdoc) {
    throw 'exec(gdoc) not implemented';
  },
  /**
   * 
   * @param {GDoc} gdoc
   */
  undo : function(gdoc) {
    throw 'undo(gdoc) not implemented';
  },
  /**
   * 
   * @param {GDoc} gdoc
   */
  redo : function(gdoc) {
    throw 'redo(gdoc) not implemented';
  }
};
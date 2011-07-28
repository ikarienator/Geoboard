function Command() {};

Command.prototype = {
  /**
   * 
   * @param gdoc
   * @returns {boolean}
   */
  canDo : function(gdoc) {
    throw 'canDoc(gdoc) not implemented';
  },
  exec : function(gdoc) {
    throw 'exec(gdoc) not implemented';
  },
  undo : function(gdoc) {
    throw 'undo(gdoc) not implemented';
  },
  redo : function(gdoc) {
    throw 'redo(gdoc) not implemented';
  }
};
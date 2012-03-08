/**
 * @class gb.Dailog
 * @singleton
 */
gb.Dailog = {
  init : function () {
    var me = this;
    me.mask = $('<div class="mask"></div>');
    me.body = $('<div class="window"></div>');
    $(document).append(me.mask);
    me.mask.append(me.body);
  },
  alert : function (message) {
    var me = this;
    me.init();
    me.done();
  },
  done : function () {
    $(document).remove(me.mask);
  }
};
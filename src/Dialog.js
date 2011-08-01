function Dialog () {
	this.init();
}

Dialog.prototype = {
	init : function () {
		this.mask = $('<div class="mask"></div>');
		this.body = $('<div class="window"></div>');
		$(document).append(this.mask).append(this.body);
	},
  done : function () {
  	$(document).remove(this.mask).remove(this.body);
  }
};
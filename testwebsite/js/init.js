
define(function(require) {

    var $ = jQuery = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');

    window.$ = $;
    window.Backbone = Backbone;
    window._ = _;

	$(function() {				
		var BBRouter = require('./myapp/bbrouter');
        BBRouter.initialize();

	});
	
	

});



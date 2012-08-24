define(function(require, exports, module) {


	window.UserModel = Backbone.Model.extend({
		urlRoot: "index.php/api/restful_user/user/id",
	
	    defaults: {
	        id: null,
	        username: "clock ",
	        password: "11111",
	        email: "11111",
	        datecreated: "12222"
	    }			
	});	
	
})
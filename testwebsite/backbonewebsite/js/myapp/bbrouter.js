define(function(require, exports, module) {


	require('./model/categorymodel');
	require('./collection/categorycollection');
	



	window.app = {
		model:{},
		view:{},
		collection:{}
	};
	
	var AppRouter = Backbone.Router.extend({
	    routes: {    		
    			        
	        "categorylist" : "categorylist"			//Twitter Bootstrap app

	    },
	
	    initialize: function () {
	        
	    },

        categorylist: function(pageno) {


            app.collection.categoryList1 = new CategoryCollection();
            app.collection.categoryList1.fetch({success: function(){
                console.log( "123");
                app.view.categorylisttitle = new CategoryListTitleView({ model: app.collection.categoryList1 , el: $("#js_categorySelect") });
/* 	            $("#rightbox").append(new UserListView({model: app.collection.userList1, el: $("#userlist")}).el ); */

            }});


	    }

	
	});	
	
	exports.initialize = function() {
		new AppRouter();
		Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由
	};

})
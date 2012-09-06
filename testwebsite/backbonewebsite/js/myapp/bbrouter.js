define(function(require, exports, module) {


	require('./model/categorymodel');
	require('./collection/categorycollection');
	
	require('./views/userlistview');
	require('./views/userview');


	window.app = {
		model:{},
		view:{},
		collection:{}
	};
	
	var AppRouter = Backbone.Router.extend({
	    routes: {    		
    			        
	        "" : "userList",			//Twitter Bootstrap app

	    },
	
	    initialize: function () {
	        
	    },
		
		userList: function(pageno) {
            var song1 = new CategoryModel({ id: "How Bizarre", categoryname: "妈妈专区" });
            var song2 = new CategoryModel({ id: "Sexual Healing", categoryname: "宝宝专区" });

            app.collection.categoryList1 = new CategoryCollection([ song1,song2            })

            $("#bodybox").html(new UserListView01({model: app.collection.userList1}).el);

	       /* app.collection.userList1.fetch({success: function(){

	        }});*/
	    }

	
	});	
	
	exports.initialize = function() {
		new AppRouter();
		Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由
	};

})
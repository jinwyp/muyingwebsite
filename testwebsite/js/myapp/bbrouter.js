define(function(require, exports, module) {

	var $ = jQuery = require('jquery');
	var Backbone = require('backbone');
	var _ = require('underscore');

	
	require('./model/usermodel');
	require('./collection/usercollection');
	
	require('./views/userlistview');
	require('./views/userview');


	window.app = {
		model:{},
		view:{},
		collection:{},
		htmlbody:$('#pageapp')
	};
	
	var AppRouter = Backbone.Router.extend({
	    routes: {    		
    			        
	        "" : "userList",			//Twitter Bootstrap app
	        "user/add" : "addUser",        //Twitter Bootstrap app
    		"user/:id" : "userDetail"		//Twitter Bootstrap app    		 
	    },
	
	    initialize: function () {
	        
	    },
		
		userList: function(pageno) {

	        app.collection.userList1 = new UserCollection([ new UserModel({
                id: 1,
                username: "clock ",
                password: "11111",
                email: "123@123.com",
                datecreated: "12222"
            }),
                new UserModel({
                id: 2,
                username: "clock ",
                password: "11111",
                email: "234@123.com",
                datecreated: "12222"
            })
            ]);

            app.collection.userList2 = new UserCollection([ new UserModel({
                id: 3,
                username: "clock3333 ",
                password: "33333",
                email: "123@123.com",
                datecreated: "12222"
            }),
                new UserModel({
                    id: 4,
                    username: "clock4444",
                    password: "22222",
                    email: "234@123.com",
                    datecreated: "12222"
                })
            ]);
            $("#bodybox").html(new UserListView01({model: app.collection.userList1}).el);
            $("#bodybox").html(new UserListView02({model: app.collection.userList2}).el);
	       /* app.collection.userList1.fetch({success: function(){

	        }});*/
	    },
	
		userDetail: function(id) {
	        app.model.user1 = new UserModel({id: id});

	        app.model.user1.fetch({success: function(){
	        	app.view.userview1 = new UserView({ model: app.model.user1 });
	            $("#bodybox").html(app.view.userview1.el);
	        }});
	    },
	    
	    addUser: function() {
	        app.model.usernew = new UserModel();
	        $('#bodybox').html(new UserView({model: app.model.usernew}).el);
		}
	
	});	
	
	exports.initialize = function() {
		new AppRouter();
		Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由
	};

})
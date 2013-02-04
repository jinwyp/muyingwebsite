//定义全局变量
head.ready(function () {


    /* View 开始普通商品列表中的单个商品  */
    app.view.emailProduct = Backbone.View.extend({
        template: $('#ProductTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp) ;

            this._modelBinder.bind(this.model, this.el);
        },

        events: {
            "change input": "changeInput"
        },

        changeInput: function(){
            console.log(this.model);
        }
    });



    /* View 开始一个Email  */
    app.view.Email = Backbone.View.extend({
        template: $('#EmailTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp );
            this._modelBinder.bind(this.model, this.el);

            this.$el.find("#productbox").empty();
            this.collection.each(this.showProduct, this);
        },

        events: {
            "click #save_email": "saveEmail",
            "click #add_product": "addProduct",
            "click #del_email": "delEmail"
        },

        saveEmail: function(e){
            e.preventDefault();
            this.model.setproducts(this.collection.toJSON());
            console.log(this.model);
            this.model.save();
        },
        delEmail: function(e){
            e.preventDefault();
            this.model.destroy();
        },

        addProduct: function(e){
            e.preventDefault();
            app.m.product1 = new app.model.Product({emailid : this.model.get('emailid')});
            app.m.product2 = new app.model.Product({emailid : this.model.get('emailid')});

            this.collection.add(app.m.product1);
            this.collection.add(app.m.product2);
            this.render();
        },

        showProduct: function(product){
            product.set("emailid", this.model.get("emailid"));
            app.v.product = new app.view.emailProduct({ model: product });
            this.$el.find("#productbox").append(app.v.product.el);
        }
    });


    /* View 开始email列表  */
    app.view.emailList = Backbone.View.extend({
        initialize: function(){
            this.render();
        },

        render: function(){
            this.$el.find('#emailsinglebox').empty();
            this.model.each(this.showEmail, this);
        },
        showEmail: function(email){
            app.v.email = new app.view.emailSingleList({ model: email })
            this.$el.find('#emailsinglebox').append(app.v.email.el);
        }
    });

    /* View 开始email单个列表  */
    app.view.emailSingleList = Backbone.View.extend({
        tagName: 'tr',
        template: $('#emailSingleTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON() ) ) ;
        }
    });





    /*  页面开始渲染  */

    var AppRouter = Backbone.Router.extend({
        routes: {
            "" : "adminEmailList",		//Twitter Bootstrap app
            "email/add" : "adminEmailAdd",        //Twitter Bootstrap app
            "email/:id" : "adminEmailDetail"		//Twitter Bootstrap app
        },

        initialize: function () {
            this.adminEmailList();
        },

        adminEmailList: function() {

            app.co.emaillist1 = new app.collection.Emaillist();
            app.co.emaillist1.fetch({success: function(){
            app.v.emaillist = new app.view.emailList({ model: app.co.emaillist1 , el: $("#emaillistbox") });
            /* 	            $("#rightbox").append(new UserListView({model: app.collection.userList1, el: $("#userlist")}).el ); */
            } });
            $("#emailbox").hide();
        },

        adminEmailDetail: function(id) {
            app.m.email2 = new app.model.Email({emailid: id});
            app.m.email2.fetch({success: function(){

                app.co.plist2 = new app.collection.Productlist(app.m.email2.get('products'));

                app.v.email2 = new app.view.Email({ model: app.m.email2, collection: app.co.plist2 });
                /* 	        	$("#rightbox").append(new UserView({model: app.model.user1, el: $("#userlist") }).el);	   */
                $("#emailbox").html(app.v.email2.el);
                $("#emailbox").show();
            }});

        },

        adminEmailAdd: function() {
            app.co.plist1 = new app.collection.Productlist();
            app.m.email1 = new app.model.Email();
            app.v.email1 = new app.view.Email({ model: app.m.email1, collection: app.co.plist1 });
            $("#emailbox").html(app.v.email1.el);
            $("#emailbox").show();
        }

    });

    var router = new AppRouter();
    Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由



// 开始普通商品列表部分



});

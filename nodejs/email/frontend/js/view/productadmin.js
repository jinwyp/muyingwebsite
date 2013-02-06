//定义全局变量
head.ready(function () {

    /* View 开始一个  */
    app.view.Product = Backbone.View.extend({
        template: $('#ProductDetailTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp );
            this._modelBinder.bind(this.model, this.el);

        },

        events: {
            "click #save_email": "saveProduct",
            "click #del_email": "delProduct"
        },

        saveProduct: function(e){
            e.preventDefault();
            app.m.product2 = new app.model.Product({emailid : this.model.get('emailid')});
            this.model.setproducts(this.collection.toJSON());
            console.log(this.model);
            this.model.save();
        },
        delProduct: function(e){
            e.preventDefault();
            this.model.destroy();
        }
    });


    /* View 商品列表  */
    app.view.productList = Backbone.View.extend({
        template: $('#ProductListTemplate').html(),
        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp ) ;

            this.$el.find('#productsinglebox').empty();

            this.model.each(this.showProduct, this);
        },
        showProduct: function(product){
            app.v.product = new app.view.productSingleList({ model: product })
            this.$el.find('#productsinglebox').append(app.v.product.el);
        }
    });

    /* View 商品列表单条商品  */
    app.view.productSingleList = Backbone.View.extend({
        tagName: 'tr',
        template: $('#ProductListSingleTemplate').html(),

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
            "" : "adminProductList",		//Twitter Bootstrap app
            "product/add" : "adminProductAdd",        //Twitter Bootstrap app
            "product/:id" : "adminProductDetail"		//Twitter Bootstrap app
        },

        initialize: function () {
            this.adminProductAdd();
        },

        adminProductList: function() {

            app.co.plist = new app.collection.ProductDetaillist();
            app.co.plist.fetch({success: function(){
            app.v.plist = new app.view.productList({ model: app.co.plist , el: $("#listbox") });

            } });
        },

        adminProductDetail: function(id) {
            app.m.email2 = new app.model.Email({emailid: id});
            app.m.email2.fetch({success: function(){

                app.co.plist2 = new app.collection.Productlist(app.m.email2.get('products'));

                app.v.email2 = new app.view.Email({ model: app.m.email2, collection: app.co.plist2 });
                /* 	        	$("#rightbox").append(new UserView({model: app.model.user1, el: $("#userlist") }).el);	   */
                $("#emailbox").html(app.v.email2.el);
                $("#emailbox").show();
            }});

        },

        adminProductAdd: function() {
            app.m.product1 = new app.model.ProductDetail();
            app.v.product1 = new app.view.Product({ model: app.m.product1 });
        }

    });

    var router = new AppRouter();
    Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由



// 开始普通商品列表部分



});

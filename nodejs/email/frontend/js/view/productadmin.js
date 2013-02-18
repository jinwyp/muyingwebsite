//定义全局变量
head.ready(function () {

    /* View 商品列表  */
    app.view.ProductList = Backbone.View.extend({
        template: $('#ProductListTemplate').html(),
        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp ) ;

            this.$el.find('#productsinglebox').empty();

            this.collection.each(this.showProduct, this);
        },
        showProduct: function(product){
            app.v.product2 = new app.view.ProductSingleList({ model: product })
            this.$el.find('#productsinglebox').append(app.v.product2.el);
        }
    });

    /* View 商品列表单条商品  */
    app.view.ProductSingleList = Backbone.View.extend({
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


/* View 单个详细商品  */
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
            this.$el.find("#timelimitedbox").hide();
            this.$el.find("#combobox").hide();
            this.$el.find('#starttime').datepicker({
                format: 'yyyy-mm-dd'
            });
            this.$el.find('#endtime').datepicker({
                format: 'yyyy-mm-dd'
            });

            this.$el.find('#combostarttime').datepicker({
                format: 'yyyy-mm-dd'
            });
            this.$el.find('#comboendtime').datepicker({
                format: 'yyyy-mm-dd'
            });
        },

        events: {
            "click #save_email": "saveProduct",
            "click #del_email": "delProduct",
            "change": "showTab"
        },

        saveProduct: function(e){
            e.preventDefault();

            this.model.save();
        },
        delProduct: function(e){
            e.preventDefault();
            this.model.destroy();
        },
        showTab: function(e){
            console.dir(this.model.toJSON());
            if(this.model.get("promotiontab") == "timelimited"){
                this.$el.find("#timelimitedbox").show();
            }else{
                this.$el.find("#timelimitedbox").hide();
            }

            if(this.model.get("promotiontab") == "combo"){
                this.$el.find("#combobox").show();
            }else{
                this.$el.find("#combobox").hide();
            }

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
            
        },

        adminProductList: function() {

            app.co.plist = new app.collection.ProductList();
            app.co.plist.fetch({success: function(){
                app.v.plist = new app.view.ProductList({ collection: app.co.plist , el: $("#listbox") });
            } });
        },

        adminProductDetail: function(id) {

            app.m.product2 = new app.model.Product({productid: id});
            app.m.product2.fetch({success: function(){
                
                app.v.product2 = new app.view.Product({ model: app.m.product2});
                $("#listbox").html(app.v.product2.el);
                /* 	        	$("#rightbox").append(new UserView({model: app.model.user1, el: $("#userlist") }).el);	   */
 
            }});

        },

        adminProductAdd: function() {
            app.m.product1 = new app.model.Product();
            
            app.v.product1 = new app.view.Product({ model: app.m.product1 });
            $("#listbox").html(app.v.product1.el);
        }

    });

    var router = new AppRouter();
    Backbone.history.start(); //当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由



// 开始普通商品列表部分



});

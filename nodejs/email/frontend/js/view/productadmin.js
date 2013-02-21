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
            this.bingdings = {
                productid : {selector: '[name=productid]', converter: this.model.numberConverter},
                productname : '[name=productname]',
                productintro : '[name=productintro]',
                productredtitle : '[name=productredtitle]',
                productredtitleurl : '[name=productredtitleurl]',
                productpriceshowtext : '[name=productpriceshowtext]',
                producturl : '[name=producturl]',
//                productpic : '[name=productpic]',
                productmarketprice :{selector: '[name=productmarketprice]', converter: this.model.numberConverter},
                productnormailprice : {selector: '[name=productnormailprice]', converter: this.model.numberConverter},
                producttimelimitedprice : {selector: '[name=producttimelimitedprice]', converter: this.model.numberConverter},
                starttime : {selector: '[name=starttime]', converter: this.model.dateConverter},
                endtime : {selector: '[name=endtime]', converter: this.model.dateConverter},
                limitedstock : {selector: '[name=limitedstock]', converter: this.model.numberConverter},
                userlimitedstock : {selector: '[name=userlimitedstock]', converter: this.model.numberConverter},
                totalstock : {selector: '[name=totalstock]', converter: this.model.numberConverter},
//                productquantity : {selector: '[name=productquantity]', converter: this.model.numberConverter},
//                productfinalprice : {selector: '[name=productfinalprice]', converter: this.model.numberConverter},
                promotiontab :'[name=promotiontab]',
                combostarttime : {selector: '[name=combostarttime]', converter: this.model.dateConverter},
                comboendtime : {selector: '[name=comboendtime]', converter: this.model.dateConverter},
                comboquantity1 : {selector: '[name=comboquantity1]', converter: this.model.numberConverter},
                comboprice1 : {selector: '[name=comboprice1]', converter: this.model.numberConverter},
                comboquantity2 : {selector: '[name=comboquantity2]', converter: this.model.numberConverter},
                comboprice2 : {selector: '[name=comboprice2]', converter: this.model.numberConverter},
                comboquantity3 : {selector: '[name=comboquantity3]', converter: this.model.numberConverter},
                comboprice3 : {selector: '[name=comboprice3]', converter: this.model.numberConverter}  };
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp );
            this._modelBinder.bind(this.model, this.el, this.bingdings);
            this.$el.find("#timelimitedbox").hide();
            this.$el.find("#combobox").hide();

            var that = this;
            this.$el.find('#starttime').datepicker().on('changeDate', function(ev){
                that.model.set("starttime", ev.date);
                console.log(ev.date, that.model.get("starttime"));
            });

            this.$el.find('#endtime').datepicker().on('changeDate', function(ev){
                that.model.set("endtime", ev.date);
            });

            this.$el.find('#combostarttime').datepicker().on('changeDate', function(ev){
                that.model.set("combostarttime", ev.date);
            });

            this.$el.find('#comboendtime').datepicker().on('changeDate', function(ev){
                that.model.set("comboendtime", ev.date);
            });
        },

        events: {
            "click #save_email": "saveProduct",
            "click #del_email": "delProduct",
            "change ": "showTab"
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

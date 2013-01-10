    //定义全局变量
head.ready(function () {
    var app = {
        model:{},
        m:{},
        modelbinder:{},
        view:{},
        v:{},
        tpl:{},
        tplpre:{},
        collection:{},
        htmlbody:{},
        temp: {}
    };

    window.app = app;

    app.model.Product = Backbone.Model.extend({
        defaults : {
            productname : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            normalprice : 138,
            promotionprice : 120,
            productstock : 120,
            productquantity : 1,
            producttotalprice : 0,
            productluckynumber : 0,

            productpromotiongift : 0, //是否参与赠品活动
            productpromotiongiftnumber : 0, //赠品满足条件金额
            productpromotionexchange : 0, //是否参与换购活动
            productpromotionexchangenumber : 0, //换购满足条件金额
            productpromotionmanjian : 0, //是否参与满减
            productpromotionmanjiannumber : 90, //满减满足条件金额
            productpromotionmanjiandiscount : 10 //满减满足条件金额
        }
    });

    app.model.Productlist = Backbone.Collection.extend({
        model: app.model.Product

    });


    app.view.cartProduct = Backbone.View.extend({
        template: $('#ProductTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            this._modelBinder.bind(this.model, this.el);
            console.log(this.model);
            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( this.model.toJSON()) );
        },

        events: {
            "click #goordafds": "loginsubmit",

        },

        loginsubmit: function(e){
            e.preventDefault();
            console.log(this.model);
        }
    });


    app.view.cartProductList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            this.render();
            this.$el.html();
        },

        render: function(){

            this.collection.each(this.showProduct, this);
//            $(this.el).html(tmp );
        },

        showProduct: function(prodcut){
            app.v.product1 = new app.view.cartProduct({ model: prodcut });
            this.$el.append(app.v.product1.el);

        }

    });


    app.m.product1 = new app.model.Product({productname: "贝亲婴儿柔湿巾", productnormalprice: 400});
    app.m.product2 = new app.model.Product({productname: "贝亲婴3212312", productnormalprice: 200});

    app.collection.plist = new app.model.Productlist();

    app.collection.plist.add(app.m.product1);
    app.collection.plist.add(app.m.product2);

    app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });


});
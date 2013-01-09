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
            name : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            normalprice : 138,
            promotionprice : 120,
            stock : 120,
            quantity : 1,
            totalprice : 0,
            luckynumber : 0,

            promotiongift : 0, //是否参与赠品活动
            promotiongiftnumber : 0, //赠品满足条件金额
            promotionexchange : 0, //是否参与换购活动
            promotionexchangenumber : 0, //换购满足条件金额
            promotionmanjian : 0, //是否参与满减
            promotionmanjiannumber : 90, //满减满足条件金额
            promotionmanjiandiscount : 10 //满减满足条件金额
        }
    });

    app.model.Productlist = Backbone.Collection.extend({
        model: app.model.Product

    });


    app.view.cartProduct = Backbone.View.extend({
        template: $('#ProductTemplate').html(),

        initialize: function(){

            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( app.m.product1.toJSON()) );
        }
    });


    app.view.cartProductList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){

            this.collection.each(this.showProduct, this);
//            $(this.el).html(tmp );
        },

        showProduct: function(prodcut){
            app.v.product1 = new app.view.cartProduct({ model: prodcut });
            this.$el.append(app.v.product1.el);
            console.log(prodcut);
        }

    });


    app.m.product1 = new app.model.Product({name: "贝亲婴儿柔湿巾", normalprice: 400});
    app.m.product2 = new app.model.Product({name: "贝亲婴321", normalprice: 200});

    app.collection.plist = new app.model.Productlist();

    app.collection.plist.add(app.m.product1);
    app.collection.plist.add(app.m.product2);

    app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });


});
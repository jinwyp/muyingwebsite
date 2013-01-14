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
            productpromotiontext : '天天特价',
            normalprice : 138,
            promotionprice : 120,
            productstock : 6,
            productquantity : 1,
            producttotalprice : 0,
            producttotalpricetext : 0,
            productluckynumber : 0,

            productgift : 0, //是否是赠品
            productexchange : 0, //是否是换购商品
            productexchangeprice : 88, //换购价格

            productpromotiongift : 0, //是否参与赠品活动 不参与为0,参与为赠品活动ID
            productpromotiongiftnumber : 0, //赠品满足条件金额

            productpromotionexchange : 0, //是否参与换购活动 不参与为0,参与为换购活动ID
            productpromotionexchangenumber : 0, //换购满足条件金额

            productpromotionmanjian : 0, //是否参与满减 不参与为0,参与为满减活动ID
            productpromotionmanjiannumber : 90, //满减满足条件金额
            productpromotionmanjiandiscount : 10 //满减优惠金额
        }
    });

    app.model.Productlist = Backbone.Collection.extend({
        model: app.model.Product

    });


    app.view.cartProduct = Backbone.View.extend({
        tagName: 'li',
        className: 'clearfix',
        template: $('#ProductTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.sumtotal();
            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( this.model.toJSON()) );
            this._modelBinder.bind(this.model, this.el);
        },

        events: {
            "click #productaa": "loginsubmit",
            "click #productquantityreduce": "quantityreduce",
            "click #productquantityadd": "quantityadd",
            "click #productDel": "delete",
            "click #btnCancel": "deleteCancel",
            "click #btnAffirm": "deleteSuccess"
        },

        loginsubmit: function(e){
//            e.preventDefault();

        },

        quantityreduce: function(){
            if(this.model.get("productquantity") < 2 ){
                if(confirm("确认删除?")){
                    this.model.destroy();
                    console.log(this.model);
                }

//                $(this.el).find('#nostock_tips').html('数量太少').fadeIn();
            }else{
                this.model.set("productquantity", (this.model.get("productquantity") -1) );
                this.sumtotal();
                $(this.el).find('#nostock_tips').fadeOut();
            }

        },

        quantityadd: function(){

            if(this.model.get("productquantity") > (this.model.get("productstock") - 1) ){
                //如果大于库存数量显示提示库存不足
                $(this.el).find('#nostock_tips').html('库存不足').fadeIn();
            }else{
                this.model.set("productquantity", (this.model.get("productquantity") +1) );
                this.sumtotal();
                $(this.el).find('#nostock_tips').fadeOut();
            }

        },

        sumtotal: function(){
            var productsumtotal;
            if (this.model.get('promotionprice') == 0){
                productsumtotal = this.model.get('productquantity') * this.model.get('normalprice');
            }else{
                productsumtotal = this.model.get('productquantity') * this.model.get('promotionprice');
            }

            this.model.set("producttotalprice", productsumtotal);
            var rmb = $("<b>&yen;</b>").html(); //增加人民币符号
            this.model.set("producttotalpricetext", rmb + this.model.get("producttotalprice").toFixed(2) );
        },

        delete: function(e) {
            e.preventDefault();
                $(this.el).find("#productdel").after($("#j_delTips").animate({
                        left: '-60px',opacity: 'show'
                    },
                    "500")
                );

        },
        deleteCancel: function(e) {
            e.preventDefault();

            $(this.el).find("#j_delTips").animate({
                        left: '0',opacity: 'hide'
                    },
                    "500");

        },
        deleteSuccess: function(e) {
            var that = this;
            $(this.el).fadeOut(function(){
                    that.model.destroy();
                }
            );
            console.log(this.model);

        }
    });

    app.view.cartProductList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){

            this.render();
            this.collection.on('destroy', this.render, this);
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            $(this.el).html(tmp );
            console.log(this.collection);
            this.$el.empty();
            this.collection.each(this.showProduct, this);

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
    app.v.plist.render();
});


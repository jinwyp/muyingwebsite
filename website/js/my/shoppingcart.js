    //定义全局变量
head.ready(function () {


    /* View 开始普通商品列表中的单个商品  */
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
            "click #productDel": "_delete",
            "click #btnCancel": "deleteCancel",
            "click #btnAffirm": "deleteSuccess"
        },

        loginsubmit: function(e){
//            e.preventDefault();

        },

        quantityreduce: function(){
            if(this.model.get("productquantity") < 2 ){
                this.showDeleteBox();

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
                this.hideDeleteBox();
                this.model.set("productquantity", (this.model.get("productquantity") +1) );
                this.sumtotal();
                $(this.el).find('#nostock_tips').fadeOut();
            }
        },

        sumtotal: function(){
            var productsumtotal;
            productsumtotal = this.model.get('productquantity') * this.model.get('productfinalprice');

            this.model.set("producttotalprice", productsumtotal);
            var rmb = $("<b>&yen;</b>").html(); //增加人民币符号
            this.model.set("producttotalpricetext", rmb + this.model.get("producttotalprice").toFixed(2) );
        },

        _delete: function(e) {
            e.preventDefault();
            this.showDeleteBox();
        },

        showDeleteBox: function() {
            $(this.el).find("#productDel").hide();
            $(this.el).find("#j_delTips").animate({
                    left: '-60px',opacity: 'show'
                },
                "500");
        },

        hideDeleteBox: function() {
            $(this.el).find("#productDel").show();
            $(this.el).find("#j_delTips").animate({
                    left: '0',opacity: 'hide'
                },
                "500");
        },

        deleteCancel: function(e) {
            e.preventDefault();
            this.hideDeleteBox();
        },

        deleteSuccess: function(e) {
            var that = this;
            $(this.el).fadeOut(function(){
                    that.model.destroy();
                }
            );
            //console.log(this.model);
        }
    });



    /* View 开始普通商品列表  */
    app.view.cartProductList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            app.collection.pnormallist = new app.model.Productlist();  //非满减的普通商品
            app.collection.pnormallist = this.collection.byNormalProduct();
            this.render();
            app.collection.pnormallist.on('destroy', this.render, this);
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            $(this.el).html(tmp );
            //console.log(app.collection.pnormallist);

            this.$el.empty();
            app.collection.pnormallist.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product1 = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product1.el);
        }
    });



    /* View 开始满减促销列表  */
    app.view.cartManjianList = Backbone.View.extend({

        initialize: function(){
            this.render();
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            $(this.el).html(tmp );
            this.collection.each(this.showManjian, this);
        },

        showManjian: function(manjian){
            app.v.manijan1 = new app.view.cartManjian({ model: manjian });
            this.$el.append(app.v.manijan1.el);
        }
    });


    /* View 开始满减列表中每个满减里面的商品列表  */
    app.view.cartManjian = Backbone.View.extend({
        tagName: 'ul',
        className: 'cart-body cart-fullReduction',
        template: $('#ManjianTemplate').html(),

        initialize: function(){
            this.manjianproductlist = new app.model.Productlist(); //满减商品列表
            this.manjianproductlist = app.collection.plist.byManjianProduct(this.model.get('promotionid'));

            this._modelBinder = new Backbone.ModelBinder();
            //console.log(this.manjianproductlist);

            this.manjianproductlist.on('destroy', this.render, this);
            this.manjianproductlist.on('change', this.showManjianInfo, this);

            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( this.model.toJSON()) );
            this.showManjianInfo();
            this._modelBinder.bind(this.model, this.el);
            $(this.el).find("#manjiandiscountinfo").hide();
            this.manjianproductlist.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product2 = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product2.el);
        },

        showManjianInfo: function(){
            //显示满减信息提示

            this.model.set("promotiontotalprice", this.manjianproductlist.productTotalPrice() );
            var rmb = $("<b>&yen;</b>").html(); //增加人民币符号
            this.model.set("promotiontotalpricetext", rmb + this.model.get("promotiontotalprice").toFixed(2) );

            var unit = $("<b>元</b>").html(); //如果是满减件 要判断是否增加 件 还是 元 文字

            if (this.model.get("promotionmanjiancondition") < 10 ){
                unit = $("<b>件</b>").html(); //如果是满减件 要判断是否增加 件 还是 元 文字
            }

            var manjiandiff = this.model.get("promotionmanjiancondition") - this.model.get("promotiontotalprice");
            if( manjiandiff > 0 ){
                $(this.el).find("#manjiandiscountinfo").fadeOut();
                $(this.el).find("#manjiandiffinfo").fadeIn();
                this.model.set("promotiontotaldifferenceprice", manjiandiff );
                this.model.set("promotiontotaldifferencepricetext", (manjiandiff + unit) ); //如果是满减件 要判断是否增加 件 文字
//                console.log(this.model.get("promotiontotaldifferencepricetext"));
            }else{
                $(this.el).find("#manjiandiscountinfo").fadeIn();
                $(this.el).find("#manjiandiffinfo").fadeOut();
            }
        }

    });


    /* View 开始赠品促销列表  */
    app.view.cartGiftList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            $(this.el).html(tmp );
            this.collection.each(this.showGift, this);
        },

        showGift: function(gift){
            app.v.gift1 = new app.view.cartGift({ model: gift });
            this.$el.find("#promotiongift").append(app.v.gift1.el);
        }
    });


    /* View 开始赠品促销单个赠品  */
    app.view.cartGift = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionSingleGiftTemplate').html(),

        initialize: function(){
            this.giftproductlist = new app.model.Productlist(); //满减商品列表
            this.giftproductlist = app.collection.giftproductlist.byGiftProduct(this.model.get('promotionid'));
            console.log(this.giftproductlist);
            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( this.model.toJSON()) );

            this.giftproductlist.each(this.showProduct, this);
        },

        events: {
            "click #btn_giftSelect": "showBox",
            "click #giftboxbutton": "hideBox"
        },

        showProduct: function(product){
            app.v.product3 = new app.view.cartGiftProduct({ model: product });
            this.$el.find("#giftbox").append(app.v.product3.el);
        },

        showBox: function(e){
            e.preventDefault();
            this.$el.find("#giftbox").show();
        },
        hideBox: function(e){
            e.preventDefault();
            this.$el.find("#giftbox").hide();
        }

    });


    /* View 开始赠品促销里面所有赠品商品列表的一个商品  */
    app.view.cartGiftProduct = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionGiftSingleProductTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            $(this.el).html(tmp( this.model.toJSON()) );
        },

        events: {
            "click #btn_giftSelect": "addGift"
        },

        addGift: function(){

        }

    });


    /*  页面开始渲染  */

// 开始普通商品列表部分
    app.m.product1 = new app.model.Product({productname: "贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:10, productpromotionmanjian : 0});
    app.m.product2 = new app.model.Product({productname: "贝亲321231232123123212312", productnormalprice: 200, promotionprice:120, productpromotionmanjian : 0});
    app.m.product3 = new app.model.Product({productname: "满减1贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product4 = new app.model.Product({productname: "满减1贝亲321231232123123212312", productnormalprice: 20, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product5 = new app.model.Product({productname: "满减2贝亲婴儿柔湿巾", productnormalprice: 20, promotionprice:10, productpromotionmanjian : 11532});
    app.m.product6 = new app.model.Product({productname: "满减2贝亲321231232123123212312", productnormalprice: 20, promotionprice:10, productpromotionmanjian : 11532});

    app.collection.plist = new app.model.Productlist();


    app.collection.plist.add(app.m.product1);
    app.collection.plist.add(app.m.product2);
    app.collection.plist.add(app.m.product3);
    app.collection.plist.add(app.m.product4);
    app.collection.plist.add(app.m.product5);
    app.collection.plist.add(app.m.product6);


    app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });


// 开始满减商品部分
    app.m.promotionmanjian1 = new app.model.PromotionManjian({promotionid:11534, promotionname: "全场纸尿裤100立减20", promotionmanjiandiscount1:20, promotionmanjiancondition1: 100, promotionmanjiandiscount2:40, promotionmanjiancondition2: 150});
    app.m.promotionmanjian2 = new app.model.PromotionManjian({promotionid: 11532, promotionname: "2013健康领跑 优你钙 满99元减20元", promotionmanjiandiscount1:20, promotionmanjiancondition1: 99, promotionmanjiandiscount2:40, promotionmanjiancondition2: 300});

    app.collection.manjianlist = new app.model.PromotionManjianList();

    app.collection.manjianlist.add(app.m.promotionmanjian1);
    app.collection.manjianlist.add(app.m.promotionmanjian2);

    app.v.manjianlist = new app.view.cartManjianList({ collection: app.collection.manjianlist, el: $('#allist') });



// 开始赠品活动部分
    app.m.promotiongift1 = new app.model.PromotionGift({promotionid:11582, promotionname: "宝得适&西班牙Jane 买就送 儿童炫酷电动车", promotiongiftcondition1:60, promotiongiftcondition2: 100});
    app.m.promotiongift2 = new app.model.PromotionGift({promotionid: 11581, promotionname: "益力健 满58元 送 价值20元靠堑 或 价值20元儿童护耳帽", promotiongiftcondition1:100, promotiongiftcondition2: 150});

    app.collection.giftlist = new app.model.PromotionGiftList();

    app.collection.giftlist.add(app.m.promotiongift1);
    app.collection.giftlist.add(app.m.promotiongift2);

    app.m.productgift1 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:10, productgift : 11582});
    app.m.productgift2 = new app.model.Product({productname: "赠品贝亲321231232123123212312", productnormalprice: 200, promotionprice:120, productgift : 11582});
    app.m.productgift3 = new app.model.Product({productname: "赠品1贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:20, productgift : 11582});
    app.m.productgift4 = new app.model.Product({productname: "赠品1贝亲321231232123123212312", productnormalprice: 20, promotionprice:20, productgift : 11582});
    app.m.productgift5 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", productnormalprice: 20, promotionprice:10, productgift : 11582});
    app.m.productgift6 = new app.model.Product({productname: "赠品2贝亲321231232123123212312", productnormalprice: 20, promotionprice:10, productgift : 11581});

    app.collection.giftproductlist = new app.model.Productlist();

    app.collection.giftproductlist.add(app.m.productgift1);
    app.collection.giftproductlist.add(app.m.productgift2);
    app.collection.giftproductlist.add(app.m.productgift3);
    app.collection.giftproductlist.add(app.m.productgift4);
    app.collection.giftproductlist.add(app.m.productgift5);
    app.collection.giftproductlist.add(app.m.productgift6);

    app.v.freegiftlist = new app.view.cartGiftList({ collection: app.collection.giftlist, el: $('#promotiongiftlist') });

});


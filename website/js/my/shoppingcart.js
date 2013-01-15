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

    /* Model 开始  */
    /* Model 商品信息模型 */
    app.model.Product = Backbone.Model.extend({
        defaults : {
            productname : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            productpromotiontext : '天天特价',
            normalprice : 138,
            promotionprice : 0,
            productfinalprice : 0,
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
        },

        initialize: function() {
            if(this.get("promotionprice") > 0 ){
                this.set("productfinalprice", this.get("promotionprice"));
            }else{
                this.set("productfinalprice", this.get("normalprice"));
            };

            this.set("producttotalprice", (this.get("productfinalprice") * this.get("productquantity") ) );
        }
    });


    /* Collection 商品列表信息模型  */
    app.model.Productlist = Backbone.Collection.extend({
        model: app.model.Product,

        byNormalProduct: function(){
            var filtered = this.filter(function(product) {
                return product.get("productpromotionmanjian") === 0;
           });
            return new app.model.Productlist(filtered);
        },

        byManjianProduct: function(manjianID){
            var filtered = this.filter(function(product) {
                return product.get("productpromotionmanjian") === manjianID;
            });
            return new app.model.Productlist(filtered);
        },

        productTotalPrice: function() {
            return this.reduce(function(memo, product) {
                return memo + product.get("producttotalprice")
            }, 0);
        }

    });


    /* Model 满减信息模型  */
    app.model.PromotionManjian = Backbone.Model.extend({
        defaults : {
            promotionid : 0, //是否参与满减 不参与为0,参与为满减活动ID
            promotionname : '全场纸尿裤200立减20, //满减满足条件金额',
            promotiontotalprice : 0,  //参与满减商品当前总金额
            promotiontotalpricetext : 0,  //参与满减商品当前总金额
            promotiontotaldifferenceprice : 0,  //参与满减商品当前总金额还差多少够满减

            promotionmanjiandiscount : 0, //满减优惠金额
            promotionmanjiancondition : 0, //满减满足条件金额
            promotionmanjiandiscount1 : 10, //满减优惠金额
            promotionmanjiancondition1 : 90, //满减满足条件金额
            promotionmanjiandiscount1 : 10, //满减优惠金额
            promotionmanjiancondition2 : 90, //满减满足条件金额
            promotionmanjiandiscount2 : 10, //满减优惠金额
            promotionmanjiancondition3 : 90, //满减满足条件金额
            promotionmanjiandiscount3 : 10 //满减优惠金额
        },

        initialize: function() {
            if( (this.get("promotiontotalprice") - this.get("promotionmanjiancondition1") ) < 0 ){
                this.set("promotionmanjiancondition", this.get("promotionmanjiancondition1"));
                this.set("promotionmanjiandiscount", this.get("promotionmanjiandiscount1"));
            }
        }
    });

    /* Collection 满减信息列表模型  */
    app.model.PromotionManjianList = Backbone.Collection.extend({
        model: app.model.PromotionManjian
    });


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
            "click #btnAffirm": "deleteSuccess",
            "keyup .input":"changeval",
            "click #reBuy": "productRebuy",
            "click #favorites": "productFavorites"
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
                this.model.set("productquantity",this.model.get("productstock"));
            }else{
                this.hideDeleteBox();
                this.model.set("productquantity", (Number(this.model.get("productquantity")) + Number(1)) );
                this.sumtotal();
                $(this.el).find('#nostock_tips').fadeOut();
            }

            if($(this.el).find("#productDel").is(":hidden")){
                this.hideDeleteBox()
            }
        },

        changeval: function(){
            var val = $(this.el).find("input:eq(0)").val().trim();
            this.model.set("productquantity", parseInt(val));
            if(this.model.get("productquantity") < 1 ){
                this.showDeleteBox();
                this.model.set("productquantity",0);
            }else{
                if(this.model.get("productquantity") > this.model.get("productstock") ){
                    //如果大于库存数量显示提示库存不足
                    $(this.el).find('#nostock_tips').html('库存不足').fadeIn();
                    this.model.set("productquantity",this.model.get("productstock"));
                }else{
                    $(this.el).find('#nostock_tips').fadeOut();
                }
                if($(this.el).find("#productDel").is(":hidden")){
                    this.hideDeleteBox()
                }
                this.sumtotal();
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
            app.collection.productdeletelist.add(this.model);
            console.log(app.collection.productdeletelist);
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
        },
        productRebuy: function() {
            $(this.$el).append();
        },
        productFavorites: function() {

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

        showProduct: function(prodcut){
            app.v.product1 = new app.view.cartProduct({ model: prodcut });
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

        showProduct: function(prodcut){
            app.v.product2 = new app.view.cartProduct({ model: prodcut });
            this.$el.append(app.v.product2.el);
        },

        showManjianInfo: function(){
            //显示满减信息提示

            this.model.set("promotiontotalprice", this.manjianproductlist.productTotalPrice() );
            var rmb = $("<b>&yen;</b>").html(); //增加人民币符号
            this.model.set("promotiontotalpricetext", rmb + this.model.get("promotiontotalprice").toFixed(2) );
            //console.log(this.model.get("promotionmanjiancondition"));
            var manjiandiff = this.model.get("promotionmanjiancondition") - this.model.get("promotiontotalprice");
            if( manjiandiff > 0 ){
                $(this.el).find("#manjiandiscountinfo").fadeOut();
                $(this.el).find("#manjiandiffinfo").fadeIn();
                this.model.set("promotiontotaldifferenceprice", manjiandiff );
            }else{
                $(this.el).find("#manjiandiscountinfo").fadeIn();
                $(this.el).find("#manjiandiffinfo").fadeOut();
            }
        }

    });


    /* View 开始被删除商品列表  */
    app.view.removedProductList = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            this.render();
            app.collection.productdeletelist.on('change', this.render, this);

        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            $(this.el).html(tmp );
            //console.log(app.collection.pnormallist);

            this.$el.empty();
            app.collection.productdeletelist.each(this.showProduct, this);
        },

        showProduct: function(prodcut){
            app.v.product4 = new app.view.cartProduct({ model: prodcut });
            this.$el.append(app.v.product4.el);
        }
    });



// 开始普通商品列表部分
    app.m.product1 = new app.model.Product({productname: "贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:10, productpromotionmanjian : 0});
    app.m.product2 = new app.model.Product({productname: "贝亲321231232123123212312", productnormalprice: 200, promotionprice:120, productpromotionmanjian : 0});
    app.m.product3 = new app.model.Product({productname: "满减1贝亲婴儿柔湿巾", productnormalprice: 10, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product4 = new app.model.Product({productname: "满减1贝亲321231232123123212312", productnormalprice: 20, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product5 = new app.model.Product({productname: "满减2贝亲婴儿柔湿巾", productnormalprice: 20, promotionprice:10, productpromotionmanjian : 11532});
    app.m.product6 = new app.model.Product({productname: "满减2贝亲321231232123123212312", productnormalprice: 20, promotionprice:10, productpromotionmanjian : 11532});

    app.collection.plist = new app.model.Productlist();
    app.collection.productdeletelist = new app.model.Productlist();

    app.collection.plist.add(app.m.product1);
    app.collection.plist.add(app.m.product2);
    app.collection.plist.add(app.m.product3);
    app.collection.plist.add(app.m.product4);
    app.collection.plist.add(app.m.product5);
    app.collection.plist.add(app.m.product6);


    app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });
    app.v.productdellist = new app.view.removedProductList({el:$('#removedArea')});

// 开始满减商品部分
    app.m.promotionmanjian1 = new app.model.PromotionManjian({promotionid:11534, promotionname: "全场纸尿裤100立减20", promotionmanjiandiscount1:20, promotionmanjiancondition1: 100, promotionmanjiandiscount2:40, promotionmanjiancondition2: 150});
    app.m.promotionmanjian2 = new app.model.PromotionManjian({promotionid: 11532, promotionname: "2013健康领跑 优你钙 满99元减20元", promotionmanjiandiscount1:20, promotionmanjiancondition1: 99, promotionmanjiandiscount2:40, promotionmanjiancondition2: 300});

    app.collection.manjianlist = new app.model.PromotionManjianList();

    app.collection.manjianlist.add(app.m.promotionmanjian1);
    app.collection.manjianlist.add(app.m.promotionmanjian2);

    app.v.manjianlist = new app.view.cartManjianList({ collection: app.collection.manjianlist, el: $('#allist') });

// 开始被删除商品部分


});


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
            this.$el.html(tmp( this.model.toJSON()) );

            this._modelBinder.bind(this.model, this.el);

            //判断是否是已删除商品 增加重新购买按钮
            if(this.model.get('productdeleted') === 1 ){
                this.$el.find("#productDel").hide();
                this.$el.find("#removedProduct").show();
                this.$el.find("#productquantity").html(this.model.get('productquantity'));
            };

            //是否商品赠品图标 同时数量无法修改
            if(this.model.get('productgift') > 0 ){
                this.$el.find("#icon-gift").show();
                this.$el.find("#productquantity").html('1');
                this.model.set("productfinalprice",0); //赠品数量为1,价格为0
                this.sumtotal();
            };

            //商品换购图标 同时数量无法修改
            if(this.model.get('productexchange') > 0 ){
                this.$el.find("#icon-redemption").show();
                this.$el.find("#productquantity").html('1');
                this.model.set("productfinalprice", this.model.get("productexchangeprice")); //换购数量为1,价格为换购价格
                this.sumtotal();
            };
        },

        events: {
            "click #productquantityreduce": "quantityreduce",
            "click #productquantityadd": "quantityadd",
            "click #productDel": "_delete",
            "click #btnCancel": "deleteCancel",
            "click #btnAffirm": "deleteSuccess",
            "keyup .input":"changeval",
            "keydown .input":"voidval",
            "click #reBuy": "productRebuy",
            "click #favorites": "productFavorites"
        },

        quantityreduce: function(){
            if(this.model.get("productquantity") < 2 ){
                this.showDeleteBox();
//                this.$el.find('#nostock_tips').html('数量太少').fadeIn();
            }else{
                this.model.set("productquantity", (this.model.get("productquantity") -1) );
                this.sumtotal();
                this.$el.find('#nostock_tips').fadeOut();
            }
        },

        quantityadd: function(){

            if(this.model.get("productquantity") > (this.model.get("productstock") - 1) ){
                //如果大于库存数量显示提示库存不足
                this.$el.find('#nostock_tips').html('库存不足').fadeIn();
                this.model.set("productquantity",this.model.get("productstock"));
            }else{
                this.hideDeleteBox();
                this.model.set("productquantity", (Number(this.model.get("productquantity")) + Number(1)) );
                this.sumtotal();
                this.$el.find('#nostock_tips').fadeOut();
            }

            if(this.$el.find("#productDel").is(":hidden")){
                this.hideDeleteBox();
            }
        },

        voidval:function(e){
            return (e.which>95 && e.which<106) || (e.which>47 && e.which<58)|| e.which == 8 || e.which == 46
        },

        changeval: function(){
            var val = this.$el.find("input:eq(0)").val().trim();
            val = val.replace(/\D/g,'');
            if(val==""){this.$el.find("input:eq(0)").val(0);val=0}
            this.model.set("productquantity", parseInt(val));
            if(this.model.get("productquantity") < 1 ){
                this.showDeleteBox();
            }else{
                if(this.model.get("productquantity") > this.model.get("productstock") ){
                    //如果大于库存数量显示提示库存不足
                    this.$el.find('#nostock_tips').html('库存不足').fadeIn();
                    this.model.set("productquantity",this.model.get("productstock"));
                }else{
                    this.$el.find('#nostock_tips').fadeOut();
                }
                if(this.$el.find("#productDel").is(":hidden")){
                    this.hideDeleteBox();
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
        },

        showDeleteBox: function() {
            this.$el.find("#productDel").hide();
            this.$el.find("#j_delTips").animate({
                left: '-20px',opacity: 'show'
            }, "500");
        },

        hideDeleteBox: function() {
            this.$el.find("#productDel").show();
            this.$el.find("#j_delTips").animate({
                left: '0',opacity: 'hide'
            }, "500");
        },

        deleteCancel: function(e) {
            e.preventDefault();
            this.hideDeleteBox();
            if( this.model.get('productquantity')<1){
                this.model.set("productquantity",1);
            }
        },

        deleteSuccess: function(e) {

            if(this.model.get('productgift') > 0 ){
                //赠品商品
                app.collection.giftproductlist.add( this.model.clone());
                app.v.carttopfreegiftlist.render();
            }else if(this.model.get('productexchange') > 0 ){
                //换购商品
                app.collection.exchangeproductlist.add( this.model.clone());
                app.v.carttopexchangelist.render();

            }else if(this.model.get('productdeleted') === 0 ){
                //删除商品添加到恢复列表, 注意已经被删除的商品不会在添加到被删除列表里面
                this.model.set('productdeleted', 1);
                app.collection.productdeletelist.add( this.model.clone());
            };

            var that = this;
            this.$el.fadeOut(function(){
                    app.v.productdellist.render();
                    that.model.destroy();
                }
            );

        },
        productRebuy: function(e) {
            e.preventDefault();
            if(this.model.get('productdeleted') === 1 ){
                //恢复商品添加到普通列表
                this.model.set('productdeleted', 0);
                app.collection.plist.add( this.model.clone()); // 加回到商品列表中

                var that = this;
                this.$el.fadeOut(function(){
                        app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });
                        app.v.manjianlist.render();
//                        app.v.manjianlist = new app.view.cartManjianList({ collection: app.collection.manjianlist, el: $('#allist') });
                        that.model.destroy();
                    }
                );
            };
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
//            this.$el.html(tmp );

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
//            this.$el.html(tmp );
            this.$el.find("#manjianbox").remove(); //默认删除所有满减
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
        id:'manjianbox',
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
            this.$el.html(tmp( this.model.toJSON()) );

            this._modelBinder.bind(this.model, this.el);
//            console.log(this.manjianproductlist);
            if(this.manjianproductlist.length === 0){
                this.$el.empty(); //如果没有商品需要隐藏满减信息
            }
            this.$el.find("#manjiandiffinfo").hide(); //默认隐藏立减信息
            this.$el.find("#manjiandiscountinfo").hide(); //默认隐藏立减信息
            this.manjianproductlist.each(this.showProduct, this);
            this.showManjianInfo();
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
                this.$el.find("#manjiandiscountinfo").fadeOut();
                this.$el.find("#manjiandiffinfo").fadeIn();
                this.model.set("promotiontotaldifferenceprice", manjiandiff );
                this.model.set("promotiontotaldifferencepricetext", (manjiandiff + unit) ); //如果是满减件 要判断是否增加 件 文字
//                console.log(this.model.get("promotiontotaldifferencepricetext"));
            }else{
                this.$el.find("#manjiandiscountinfo").fadeIn();
                this.$el.find("#manjiandiffinfo").fadeOut();
            }
        }
    });



    /* View 开始被删除商品列表  */
    app.view.removedProductList = Backbone.View.extend({
        template: $('#ProductDeletedTemplate').html(),
        initialize: function(){
            this.render();
            app.collection.productdeletelist.on('destroy', this.render, this);
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp );
            this.$el.find('#removedArea')[0].innerHTML="";
            app.collection.productdeletelist.each(this.showProduct, this);

            if(app.collection.productdeletelist.length === 0){
                //如果为0不显示 已删除商品标题
                this.$el.empty();
//                console.log(app.collection.productdeletelist);
            };
        },

        showProduct: function(prodcut){
            app.v.product4 = new app.view.cartProduct({ model: prodcut });
            this.$el.find('#removedArea').append(app.v.product4.el);
        }

    });



    /* View 购物车中已经添加的赠品商品  */
    app.view.cartGiftProductList = Backbone.View.extend({
        initialize: function(){
            this.render();
        },

        render: function(){
            this.$el.empty();
//            console.log(app.collection.giftaddedproductlist);
            app.collection.giftaddedproductlist.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product1 = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product1.el);
        }
    });



    /* View 开始赠品促销列表  */
    app.view.cartTopGiftList = Backbone.View.extend({

        initialize: function(){
            this.render();
        },

        render: function(){
            this.$el.find("#promotiongift").empty();
            if(this.collection.length === 0){
                //如果没有一个活动就隐藏标题
                this.$el.empty();
            }
            this.collection.each(this.showGift, this);
        },

        showGift: function(gift){
            app.v.gift1 = new app.view.cartTopGift({ model: gift });
            this.$el.find("#promotiongift").append(app.v.gift1.el);
        }
    });




    /* View 开始赠品促销列表里面的单个赠品活动  */
    app.view.cartTopGift = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionSingleGiftTemplate').html(),

        initialize: function(){
            this.giftproductlist = new app.model.Productlist(); //满减商品列表
            this.giftproductlist = app.collection.giftproductlist.byGiftProduct(this.model.get('promotionid'));

            this.giftproductlist.on('destroy', this.hideBox2, this); //当数量为0时隐藏弹出框
            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );

            this.hideBox2();
            this.giftproductlist.each(this.showProduct, this);
        },

        events: {
            "click #btn_giftSelect": "showBox",
            "click #btn_giftClose": "hideBox"
        },

        showProduct: function(product){
            app.v.product3 = new app.view.cartTopGiftProduct({ model: product });
            this.$el.find("#giftbox").append(app.v.product3.el);
        },

        showBox: function(e){
            e.preventDefault();
            if(!$("#cover-bg").length){
                $("<div id='cover-bg'></div>")
                    .css({width:$(window).width(), height:$(document).height(), opacity:0.6, "z-index":"998", position:"absolute", background:"#333", top:0, left:0,display:"none"})
                    .appendTo("body")
            }
            $("#cover-bg").fadeIn(200);
            var giftbox = this.$el.find("#giftbox");
            giftbox.css({
                "margin-left":-giftbox.width()/2,
                top:($(window).height()-giftbox.height())/2
            }).show(200);
        },
        hideBox: function(e){
            e.preventDefault();
            this.$el.find("#giftbox").hide(300);
            $("#cover-bg").fadeOut()
        },

        hideBox2: function(){
            if(this.giftproductlist.length == 0){
                this.$el.find("#giftbox").remove();
                this.$el.find("#giftSoldout").show();
                this.$el.find("#giftSelect").remove();
//                this.$el.find("#giftbox").hide();
            };
        }

    });


    /* View 点击出现赠品促销里面所有赠品商品列表的一个商品  */
    app.view.cartTopGiftProduct = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionGiftSingleProductTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );

            if(this.model.get('productstock') == 0 ){
                this.$el.find("#giftFinish").show();
                this.$el.find("#giftAdd").remove();
            };
        },

        events: {
            "click #btn_giftAdd": "addGift"
        },

        addGift: function(e){
            e.preventDefault();

            app.m.tempproduct =  this.model.clone(); //添加的赠品消失,并出现在购物车里面
            app.m.tempproduct.set("productfinalprice",0); //赠品数量为1,价格为0
            app.collection.giftaddedproductlist.add(app.m.tempproduct);

            var that = this;
            this.$el.fadeOut(function(){
                    that.model.destroy();
                    app.v.cartgiftlist.render(); //渲染购物车的赠品商品
                }
            );
        }
    });




    /* View 购物车中已经添加的换购商品  */
    app.view.cartExchangeProductList = Backbone.View.extend({
        initialize: function(){
            this.render();
        },

        render: function(){
            this.$el.empty();
//            console.log(app.collection.giftaddedproductlist);
            app.collection.exchangeaddedproductlist.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product1 = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product1.el);
        }
    });



    /* View 开始换购促销列表  */
    app.view.cartTopExchangeList = Backbone.View.extend({

        initialize: function(){

            this.render();
        },

        render: function(){
            this.$el.find("#promotionredemption").empty();
            if(this.collection.length === 0){
                //如果没有一个活动就隐藏标题
                this.$el.empty();
            }
            this.collection.each(this.showExchange, this);
        },

        showExchange: function(exchange){
            app.v.exchange1 = new app.view.cartTopExchange({ model: exchange });
            this.$el.find("#promotionredemption").append(app.v.exchange1.el);
        }
    });



    /* View 开始换购促销列表里面的单个换购活动  */
    app.view.cartTopExchange = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionSingleRedemptionTemplate').html(),

        initialize: function(){
            this.exchangeproductlist = new app.model.Productlist(); //满减商品列表
            this.exchangeproductlist = app.collection.exchangeproductlist.byExchangeProduct(this.model.get('promotionid'), this.model.get('promotionexchangeprice'));

            this.exchangeproductlist.on('destroy', this.hideBox2, this); //当数量为0时隐藏弹出框
            this.render();
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );
            this.hideBox2();
            this.exchangeproductlist.each(this.showProduct, this);
        },

        events: {
            "click #btn_redemptionSelect": "showBox",
            "click #btn_redemptionClose": "hideBox"
        },

        showProduct: function(product){
            product.set("productexchangeprice", this.model.get('promotionexchangeprice'));
            app.v.product3 = new app.view.cartTopExchangeProduct({ model: product });
            this.$el.find("#exchangebox").append(app.v.product3.el);
        },

        showBox: function(e){
            e.preventDefault();
            if(!$("#cover-bg").length){
                $("<div id='cover-bg'></div>")
                    .css({width:$(window).width(), height:$(document).height(), opacity:0.6, "z-index":"998", position:"absolute", background:"#333", top:0, left:0,display:"none"})
                    .appendTo("body")
            }
            $("#cover-bg").fadeIn(200);
            var exchangebox = this.$el.find("#exchangebox");
            exchangebox.css({
                "margin-left":-exchangebox.width()/2,
                top:($(window).height()-exchangebox.height())/2
            }).show(200);
        },
        hideBox: function(e){
            e.preventDefault();
            this.$el.find("#exchangebox").hide(300);
            $("#cover-bg").fadeOut()
        },

        hideBox2: function(){
            if(this.exchangeproductlist.length == 0){
                this.$el.find("#exchangebox").remove();
                this.$el.find("#redemptionSoldout").show();
                this.$el.find("#redemptionSelect").remove();
//                this.$el.find("#exchangebox").hide();
            };
        }

    });


    /* View 点击出现换购促销里面所有换购商品列表的一个商品  */
    app.view.cartTopExchangeProduct = Backbone.View.extend({
        tagName: 'dl',
        template: $('#PromotionRedemptionProductsTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );

            if(this.model.get('productstock') == 0 ){
                this.$el.find("#redemptionFinish").show();
                this.$el.find("#redemptionAdd").remove();
            };
        },

        events: {
            "click #btn_redemptionAdd": "addRedemption"
        },

        addRedemption: function(e){
            e.preventDefault();
            app.m.tempproduct =  this.model.clone(); //添加的换购消失,并出现在购物车里面
            app.m.tempproduct.set("productfinalprice", this.model.get("productexchangeprice")); //换购数量为1,价格为换购价格
            app.collection.exchangeaddedproductlist.add(app.m.tempproduct);

            var that = this;
            this.$el.fadeOut(function(){
                    that.model.destroy();
                    app.v.cartexchangelist.render(); //渲染购物车的换购商品
                }
            );
        }
    });



    /*  页面开始渲染  */

// 开始普通商品列表部分
    app.m.product1 = new app.model.Product({productname: "贝亲婴儿柔湿巾", normalprice: 10, promotionprice:10, productpromotionmanjian : 0, productexchange:0 });
    app.m.product2 = new app.model.Product({productname: "贝亲321231232123123212312", normalprice: 200, promotionprice:120, productpromotionmanjian : 0});
    app.m.product3 = new app.model.Product({productname: "满减1贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product4 = new app.model.Product({productname: "满减1贝亲321231232123123212312", normalprice: 20, promotionprice:20, productpromotionmanjian : 11534});
    app.m.product5 = new app.model.Product({productname: "满减2贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10, productpromotionmanjian : 11532});
    app.m.product6 = new app.model.Product({productname: "满减2贝亲321231232123123212312", normalprice: 20, promotionprice:10, productpromotionmanjian : 11532});

    app.collection.plist = new app.model.Productlist();
    app.collection.productdeletelist = new app.model.Productlist();  //被删除的列表

    app.collection.plist.add(app.m.product1);
    app.collection.plist.add(app.m.product2);
    app.collection.plist.add(app.m.product3);
    app.collection.plist.add(app.m.product4);
    app.collection.plist.add(app.m.product5);
    app.collection.plist.add(app.m.product6);

    app.v.plist = new app.view.cartProductList({ collection: app.collection.plist, el: $('#normalproductList') });

// 开始被删除商品部分
    app.v.productdellist = new app.view.removedProductList({el:$('#deletedProductlist')});  //被删除的列表渲染

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

    app.collection.giftlist = new app.model.PromotionGiftList();  //赠品促销列表

    app.collection.giftlist.add(app.m.promotiongift1);
    app.collection.giftlist.add(app.m.promotiongift2);

    app.m.productgift1 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", normalprice: 10, promotionprice:10, productstock:20, productgift : 11582});
    app.m.productgift2 = new app.model.Product({productname: "赠品贝亲321231232123123212312", normalprice: 200, promotionprice:120, productstock:10, productgift : 11582});
    app.m.productgift3 = new app.model.Product({productname: "赠品1贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20, productstock:20, productgift : 11582});
    app.m.productgift4 = new app.model.Product({productname: "赠品1贝亲321231232123123212312", normalprice: 20, promotionprice:20, productstock:10, productgift : 11582});
    app.m.productgift5 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10, productstock:20, productgift : 11582});
    app.m.productgift6 = new app.model.Product({productname: "赠品2贝亲321231232123123212312", normalprice: 20, promotionprice:10, productstock:20, productgift : 11581});

    app.collection.giftproductlist = new app.model.Productlist();  //所有赠品促销里面的所有免费赠品商品

    app.collection.giftproductlist.add(app.m.productgift1);
    app.collection.giftproductlist.add(app.m.productgift2);
    app.collection.giftproductlist.add(app.m.productgift3);
    app.collection.giftproductlist.add(app.m.productgift4);
    app.collection.giftproductlist.add(app.m.productgift5);
    app.collection.giftproductlist.add(app.m.productgift6);


    app.collection.giftaddedproductlist = new app.model.Productlist(); //已经领取的赠品列表

    app.v.carttopfreegiftlist = new app.view.cartTopGiftList({ collection: app.collection.giftlist, el: $('#promotiongiftlist') });
    app.v.cartgiftlist = new app.view.cartGiftProductList({ collection: app.collection.giftaddedproductlist, el: $('#freegiftproductlist') });






// 开始换购活动部分
    app.m.promotionexchange1 = new app.model.PromotionExchange({promotionid:11592, promotionname: "周三全场买满358元加1元换购以下任一商品，换完为止。", promotiongiftcondition1:358, promotionexchangeprice1:1, promotiongiftcondition2: 458});
    app.m.promotionexchange2 = new app.model.PromotionExchange({promotionid:11583, promotionname: "宝得适&西班牙Jane 买任意商品+50元超值换购", promotiongiftcondition1:100, promotionexchangeprice1:50, promotiongiftcondition2: 150});
    app.m.promotionexchange3 = new app.model.PromotionExchange({promotionid:11498, promotionname: "周三全场买满358元加1元换购以下任一商品，换完为止。", promotiongiftcondition1:358, promotionexchangeprice1:1, promotiongiftcondition2: 458});
    app.m.promotionexchange4 = new app.model.PromotionExchange({promotionid:11458, promotionname: "好奇指定纸尿裤 购买即可18元换购 好奇清爽洁净婴儿柔湿巾80抽补充装", promotiongiftcondition1:0, promotionexchangeprice1:18, promotiongiftcondition2: 150});
    app.m.promotionexchange5 = new app.model.PromotionExchange({promotionid:11457, promotionname: "帮宝适指定纸尿裤 购买即可18元换购 帮宝适柔润护肤系列护儿湿巾56片装一包", promotiongiftcondition1:0, promotionexchangeprice1:18, promotiongiftcondition2: 458});
    app.m.promotionexchange6 = new app.model.PromotionExchange({promotionid:11387, promotionname: "宝宝服饰 全场满99元+39元 换购价值99元 迪士尼鞋一双", promotiongiftcondition1:99, promotionexchangeprice1:39, promotiongiftcondition2: 150});

    app.collection.exchangelist = new app.model.PromotionExchangeList();  //换购促销列表

    app.collection.exchangelist.add(app.m.promotionexchange1);
    app.collection.exchangelist.add(app.m.promotionexchange2);
    app.collection.exchangelist.add(app.m.promotionexchange3);
    app.collection.exchangelist.add(app.m.promotionexchange4);
    app.collection.exchangelist.add(app.m.promotionexchange5);
    app.collection.exchangelist.add(app.m.promotionexchange6);

    app.m.productexchange1 = new app.model.Product({productname: "换购贝亲婴儿柔湿巾good", normalprice: 10, promotionprice:10, productstock:0, productexchange : 11592});
    app.m.productexchange2 = new app.model.Product({productname: "换购贝亲321231232123123212312", normalprice: 200, promotionprice:120, productexchange : 11592});
    app.m.productexchange3 = new app.model.Product({productname: "换购1贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20, productexchange : 11592});
    app.m.productexchange4 = new app.model.Product({productname: "换购1贝亲321231232123123212312", normalprice: 20, promotionprice:20, productexchange : 11592});
    app.m.productexchange5 = new app.model.Product({productname: "换购贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10, productexchange : 11592});
    app.m.productexchange6 = new app.model.Product({productname: "换购2贝亲321231232123123212312", normalprice: 20, promotionprice:10, productexchange : 11583});
    app.m.productexchange7 = new app.model.Product({productname: "换购1贝亲321231232123123212312", normalprice: 20, promotionprice:20, productexchange : 11583});
    app.m.productexchange8 = new app.model.Product({productname: "换购贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10, productexchange : 11457});
    app.m.productexchange9 = new app.model.Product({productname: "换购2贝亲321231232123123212312", normalprice: 20, promotionprice:10, productexchange : 11387});
    app.m.productexchange10 = new app.model.Product({productname: "换购2贝亲321231232123123212312", normalprice: 20, promotionprice:10, productexchange : 11498});
    app.m.productexchange11 = new app.model.Product({productname: "换购1贝亲321231232123123212312", normalprice: 20, promotionprice:20, productexchange : 11458});


    app.collection.exchangeproductlist = new app.model.Productlist();  //所有换购促销里面的所有换购商品

    app.collection.exchangeproductlist.add(app.m.productexchange1);
    app.collection.exchangeproductlist.add(app.m.productexchange2);
    app.collection.exchangeproductlist.add(app.m.productexchange3);
    app.collection.exchangeproductlist.add(app.m.productexchange4);
    app.collection.exchangeproductlist.add(app.m.productexchange5);
    app.collection.exchangeproductlist.add(app.m.productexchange6);
    app.collection.exchangeproductlist.add(app.m.productexchange7);
    app.collection.exchangeproductlist.add(app.m.productexchange8);
    app.collection.exchangeproductlist.add(app.m.productexchange9);
    app.collection.exchangeproductlist.add(app.m.productexchange10);
    app.collection.exchangeproductlist.add(app.m.productexchange11);


    app.collection.exchangeaddedproductlist = new app.model.Productlist(); //已经领取的换购列表

    app.v.carttopexchangelist = new app.view.cartTopExchangeList({ collection: app.collection.exchangelist, el: $('#promotionredemptionlist') });
    app.v.cartexchangelist = new app.view.cartExchangeProductList({ collection: app.collection.exchangeaddedproductlist, el: $('#redemptionproductlist') });

    stickFooter(); // 购物车商品超出一屏，则结算按钮固定窗口底部显示
});
// 购物车商品超出一屏，则结算按钮固定窗口底部显示
function stickFooter(){
    var floatMain = $(".cart-button"),
        Top = floatMain.position().top,
        fw = floatMain.width(),
        floatStyle = false,
        isIE6 = $.browser.msie&&($.browser.version == "6.0")&&!$.support.style;

    if(isIE6){
        $("<style type='text/css'>#floatPic{margin:0px;padding:0px;z-index:99}#floatPic img{margin: 0px;padding: 0px;display: block;}*html,body{background-image:url(about:blank);background-attachment:fixed}html .fixed-bottom{position:absolute;bottom:auto;top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)));}</style>").appendTo("head");
    }

    stickrull();

    $(window).scroll(stickrull);

    function stickrull(){
        if($(document).scrollTop() + $(window).height() < Top){
            if(floatStyle==true){return false}
            if(!isIE6){
                floatMain.css({
                    position:"fixed",
                    "margin-left":-fw/2,
                    bottom:0,
                    width:fw,
                    left:"50%",
                    "z-index":"9999"
                });
            } else {
                floatMain.addClass("fixed-bottom").css({
                    "margin-left":fw/2,
                    width:fw,
                    left:"50%",
                    "z-index":"9999"
                });
            }
            floatStyle = true;
        }else{
            floatMain.removeAttr("style");
            if(isIE6){floatMain.removeClass("fixed-bottom")}
            floatStyle = false
        }
    }
}

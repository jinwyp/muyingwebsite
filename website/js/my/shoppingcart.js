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

            //判断是否是组合购商品
            if(this.model.get('productcombo') > 0 || this.model.get('productcomboproduct') > 0){
                this.$el.find("#productDel").hide();
                this.$el.find("#productquantity").html('1');
                this.model.sumPrice();
            };

            //是否商品赠品图标 同时数量无法修改
            if(this.model.get('productgift') > 0 ){
                this.$el.find("#icon-gift").show();
                this.$el.find("#productquantity").html('1');
                this.model.set("productfinalprice",0); //赠品数量为1,价格为0
                this.model.sumPrice();
            };

            //商品换购图标 同时数量无法修改
            if(this.model.get('productexchange') > 0 ){
                this.$el.find("#icon-redemption").show();
                this.$el.find("#productquantity").html('1');
                this.model.set("productfinalprice", this.model.get("productexchangeprice")); //换购数量为1,价格为换购价格
                this.model.sumPrice();
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
                app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
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
                app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
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
                app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
            }
        },

        sumtotal: function(){
            this.model.sumPrice();
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
            var that = this;
            this.$el.fadeOut(function(){

                if(that.model.get('productgift') > 0 ){
                    //赠品商品
                    app.co.giftproductlist.add( that.model.clone());
                    app.v.carttopfreegiftlist.render();
                }else if(that.model.get('productexchange') > 0 ){
                    //换购商品
                    app.co.exchangeproductlist.add( that.model.clone());
                    app.v.carttopexchangelist.render();

                }else if(that.model.get('productdeleted') === 0 ){
                    //删除商品添加到恢复列表, 注意已经被删除的商品不会在添加到被删除列表里面
                    that.model.set('productdeleted', 1);
                    app.co.productdeletelist.add( that.model.clone());
                };

                    // app.v.productdellist.render();
                that.model.destroy();
                app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
            }
            );

        },
        productRebuy: function(e) {
            e.preventDefault();
            if(this.model.get('productdeleted') === 1 ){
                //恢复商品添加到普通列表
                this.model.set('productdeleted', 0);
                app.co.plist.add( this.model.clone()); // 加回到商品列表中

                var that = this;
                this.$el.fadeOut(function(){
                        app.v.plist = new app.view.cartProductList({ collection: app.co.plist, el: $('#normalproductList') });
                        app.v.manjianlist.render();
//                        app.v.manjianlist = new app.view.cartManjianList({ collection: app.co.manjianlist, el: $('#allist') });
                        that.model.destroy();
                        app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
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
            app.co.pnormallist = new app.collection.Productlist();  //非满减的普通商品
            app.co.pnormallist = this.collection.byNormalProduct();

            this.render();
            app.co.pnormallist.on('destroy', this.render, this);
        },

        render: function(){

//            var tmp = Handlebars.compile( this.template );
//            this.$el.html(tmp );

            this.$el.empty();
            app.co.pnormallist.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product.el);
        }
    });


   /* View 开始被删除商品列表  */
    app.view.removedProductList = Backbone.View.extend({
        template: $('#ProductDeletedTemplate').html(),
        initialize: function(){
            this.render();
            this.collection.on('destroy', this.render, this);
            this.collection.on('add', this.render, this);
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp );
            this.$el.find('#removedArea')[0].innerHTML="";
            this.collection.each(this.showProduct, this);

            if(this.collection.length === 0){
                //如果为0不显示 已删除商品标题
                this.$el.empty();
//                console.log(app.co.productdeletelist);
            };
        },

        showProduct: function(prodcut){
            app.v.product = new app.view.cartProduct({ model: prodcut });
            this.$el.find('#removedArea').append(app.v.product.el);
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
            this.manjianproductlist = new app.collection.Productlist(); //满减商品列表
            this.manjianproductlist = app.co.plist.byManjianProduct(this.model.get('promotionid'));

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
            app.v.product = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product.el);
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
                this.model.set("promotionmanjianalreadydiscount", 0 );  //符合满减条件 设置已经满减优惠金额 否则为0
                this.model.set("promotiontotaldifferencepricetext", (manjiandiff + unit) ); //如果是满减件 要判断是否增加 件 文字
//                console.log(this.model.get("promotiontotaldifferencepricetext"));
            }else{
                this.$el.find("#manjiandiscountinfo").fadeIn();
                this.$el.find("#manjiandiffinfo").fadeOut();
                this.model.set("promotionmanjianalreadydiscount", this.model.get('promotionmanjiandiscount') );  //符合满减条件 设置已经满减优惠金额
            }
        }
    });






   /* View 开始单品组合购促销列表  */
    app.view.cartComboList = Backbone.View.extend({
        
        initialize: function(){
            app.co.combototallist = new app.collection.Productlist(); //组合购总计
            this.render();
        },

        render: function(){

            this.$el.find("#combobox").remove(); //默认删除所有组合购
            this.collection.each(this.showCombo, this);
        },

        showCombo: function(combo){
            app.v.combo1 = new app.view.cartCombo({ model: combo });
            this.$el.append(app.v.combo1.el);
            
        }

    });


    /* View 开始组合购列表中每个组合购里面的商品列表  */
    app.view.cartCombo = Backbone.View.extend({
        tagName: 'ul',
        id:'combobox',
        className: 'cart-body cart-combination',
        template: $('#ComboTemplate').html(),

        initialize: function(){
            this.comboproductlist = new app.collection.Productlist(); //组合购商品列表
            this.comboproductlist = app.co.comboproductlist.byComboProduct(this.model.get('comboid')); //找出主商品

            if(this.comboproductlist.length > 0){
                this.model.set('comboproductname', this.comboproductlist.at(0).get('productname'));    

                //添加副商品                
                this.addCombo(app.co.comboproductlist.byID(this.model.get('comboproductid1')), this.model.get('comboproductprice1') );
                this.addCombo(app.co.comboproductlist.byID(this.model.get('comboproductid2')), this.model.get('comboproductprice2') );
                this.addCombo(app.co.comboproductlist.byID(this.model.get('comboproductid3')), this.model.get('comboproductprice3') );
                this.addCombo(app.co.comboproductlist.byID(this.model.get('comboproductid4')), this.model.get('comboproductprice4') );
                            
                this.model.set('combototalprice', this.comboproductlist.productTotalPrice().toFixed(2) );

                // this._modelBinder = new Backbone.ModelBinder();
                
                this.render();
                this.tempcombototal = new app.model.Product();
                this.tempcombototal.set('producttotalprice', this.comboproductlist.productTotalPrice());
                this.tempcombototal.set('productquantity', this.comboproductlist.productTotalPrice());
                this.tempcombototal.set('producttotalluckynumber', this.comboproductlist.productTotalPrice());
                this.tempcombototal.set('producttotalweight', this.comboproductlist.productTotalPrice());

                app.co.combototallist.add( this.tempcombototal);

            };
        },

        render: function(){

            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );

            // this._modelBinder.bind(this.model, this.el);
//            console.log(this.comboproductlist);
            if(this.comboproductlist.length === 0){
                this.$el.empty(); //如果没有商品需要隐藏信息
            }
            this.comboproductlist.each(this.showProduct, this);

        },

        events: {
            "click #comboDel": "comboDelete"
        },

        showProduct: function(product){
            app.v.product = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product.el);
        },

        addCombo: function(comboproduct, comboproductprice){
            if( typeof(comboproduct)  === 'undefined' ){
                
            }else{
                comboproduct.set('productcomboprice',comboproductprice); //设置副商品组合购价格
                comboproduct.set('productfinalprice',comboproductprice);
                comboproduct.sumPrice();
                this.comboproductlist.add(comboproduct);
            };
        },

        comboDelete: function(e){
            e.preventDefault();
            var that = this;
            this.$el.fadeOut(function(){
                    app.co.combototallist.remove( that.tempcombototal);
                    app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
            });
        }

    });








    /* View 购物车中已经添加的赠品商品  */
    app.view.cartGiftProductList = Backbone.View.extend({
        initialize: function(){
            this.render();
            this.collection.on('add', this.render, this);
        },

        render: function(){
            this.$el.empty();
//            console.log(app.co.giftaddedproductlist);
            this.collection.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product.el);
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
            this.giftproductlist = new app.collection.Productlist(); //满减商品列表
            this.giftproductlist = app.co.giftproductlist.byGiftProduct(this.model.get('promotionid'));

            this.giftproductlist.on('destroy', this.hideBox2, this); //当数量为0时隐藏弹出框
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );
            this.hideBox2(); //如果没有任何赠品就要隐藏标题
            this.$el.find("#freegift_tips").hide(); //默认隐藏满足条件的提示
            this.giftproductlist.each(this.showProduct, this);
        },

        events: {
            "click #btn_giftSelect": "showBox",
            "click #btn_giftClose": "hideBox"
        },

        showProduct: function(product){
            product.set("productpromotiongiftnumber", this.model.get('promotiongiftcondition'));

            app.v.product = new app.view.cartTopGiftProduct({ model: product });
            this.$el.find("#giftbox").append(app.v.product.el);
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
            $("#cover-bg").fadeOut();
        },

        hideBox2: function(){
            if(this.giftproductlist.length == 0){
                this.$el.find("#giftbox").remove();

                this.$el.find("#giftSoldout").show();
                this.$el.find("#giftSelect").remove();
//                this.$el.find("#giftbox").hide();
                $("#cover-bg").fadeOut();
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

            if(this.model.get("productpromotiongiftnumber") > app.m.carttotal.get("carttotalfinalprice") ){
                this.$el.parent().find("#freegift_tips").fadeIn().delay(1500).fadeOut();
            }else{
                app.m.tempproduct =  this.model.clone(); //添加的赠品消失,并出现在购物车里面
                app.m.tempproduct.set("productfinalprice",0); //赠品数量为1,价格为0

                var that = this;
                this.$el.fadeOut(function(){
                        that.model.destroy();
                        $("#cartEmpty").hide(); // 隐藏购物车没有商品的提示
                        // app.v.cartgiftlist.render(); //渲染购物车的赠品商品
                        app.co.giftaddedproductlist.add(app.m.tempproduct);
                        app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
                    }
                );
            }

        }
    });









    /* View 购物车中已经添加的换购商品  */
    app.view.cartExchangeProductList = Backbone.View.extend({
        initialize: function(){
            this.render();
            this.collection.on('add', this.render, this);
        },

        render: function(){
            this.$el.empty();
//            console.log(app.co.giftaddedproductlist);
            this.collection.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product = new app.view.cartProduct({ model: product });
            this.$el.append(app.v.product.el);
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
            this.exchangeproductlist = new app.collection.Productlist(); //满减商品列表
            this.exchangeproductlist = app.co.exchangeproductlist.byExchangeProduct(this.model.get('promotionid'), this.model.get('promotionexchangeprice'));

            this.exchangeproductlist.on('destroy', this.hideBox2, this); //当数量为0时隐藏弹出框
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp( this.model.toJSON()) );
            this.hideBox2();
            this.$el.find("#redemption_tips").hide(); //默认隐藏满足条件的提示
            this.exchangeproductlist.each(this.showProduct, this);
        },

        events: {
            "click #btn_redemptionSelect": "showBox",
            "click #btn_redemptionClose": "hideBox"
        },

        showProduct: function(product){
            product.set("productexchangeprice", this.model.get('promotionexchangeprice'));
            product.set("productpromotionexchangenumber", this.model.get('promotionexchangecondition'));

            app.v.product = new app.view.cartTopExchangeProduct({ model: product });
            this.$el.find("#exchangebox").append(app.v.product.el);
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
            $("#cover-bg").fadeOut();
        },

        hideBox2: function(){
            if(this.exchangeproductlist.length == 0){
                this.$el.find("#exchangebox").remove();
                this.$el.find("#redemptionSoldout").show();
                this.$el.find("#redemptionSelect").remove();
//                this.$el.find("#exchangebox").hide();
                $("#cover-bg").fadeOut();
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

            if(this.model.get("productpromotionexchangenumber") > app.m.carttotal.get("carttotalfinalprice") ){
                this.$el.parent().find("#redemption_tips").fadeIn().delay(1500).fadeOut();
            }else{
                app.m.tempproduct =  this.model.clone(); //添加的换购消失,并出现在购物车里面
                app.m.tempproduct.set("productfinalprice", this.model.get("productexchangeprice")); //换购数量为1,价格为换购价格

                var that = this;
                this.$el.fadeOut(function(){
                        that.model.destroy();
                        $("#cartEmpty").hide(); // 隐藏购物车没有商品的提示
                        // app.v.cartexchangelist.render(); //渲染购物车的换购商品
                        app.co.exchangeaddedproductlist.add(app.m.tempproduct);
                        app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
                    }
                );
            }


        }
    });




    /* View 优惠码功能  */
    app.view.cartCouponCode = Backbone.View.extend({

        initialize: function(){
            // 判断优惠码是满减 / 赠品 / 换购
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            this._modelBinder.bind(this.model, this.el);
        },

        events: {
            "click #btn_coupon": "submitCoupon",
            "click .close-win": "hideBox"
        },

        submitCoupon: function(e){
            e.preventDefault();
            $("#couponTips").hide();
            // 判断优惠码是满减 / 赠品 / 换购
            console.log(this.model.get("couponname"));
            if( this.model.get("couponname") == 1  ){
                //满减
                app.co.plist.add(app.m.product7);
                app.co.manjianlist.add(app.m.promotionmanjian3);
                app.v.manjianlist = new app.view.cartManjianList({ collection: app.co.manjianlist, el: $('#allist') });
                app.m.carttotal.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价

            }else if( this.model.get("couponname") == 2 ){
                //赠品
                //要通过优惠码找出对应的赠品活动 此处省略 使用 app.m.promotiongift1 代替
                app.v.gift1 = new app.view.cartTopGift({ model: app.m.promotiongift1 });
                this.$el.find("#couponBox").html($(app.v.gift1.el).find('#giftbox').children());
                this.showBox();

            }else if( this.model.get("couponname") == 3 ){
                //换购
                //要通过优惠码找出对应的换购活动 此处省略 使用 app.m.promotionexchange1 代替
                app.v.exchange1 = new app.view.cartTopExchange({ model: app.m.promotionexchange1 });
                this.$el.find("#couponBox").html($(app.v.exchange1.el).find('#exchangebox').children());
                this.showBox();
            }else{
                $("#couponTips").fadeIn();
            }



        },

        hideBox: function(e){
            e.preventDefault();
            this.$el.find("#couponBox").hide(300);
            $("#cover-bg").fadeOut();

        },
        showBox: function(){
            if(!$("#cover-bg").length){
                $("<div id='cover-bg'></div>")
                    .css({width:$(window).width(), height:$(document).height(), opacity:0.6, "z-index":"998", position:"absolute", background:"#333", top:0, left:0,display:"none"})
                    .appendTo("body")
            }
            $("#cover-bg").fadeIn(200);
            var giftbox = this.$el.find("#couponBox");
            giftbox.css({
                "margin-left":-giftbox.width()/2,
                top:($(window).height()-giftbox.height())/2
            }).show(200);
        }
    });





    /* View 商品总金额  */
    app.view.cartTotal = Backbone.View.extend({

//        template: $('#PromotionRedemptionProductsTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            this.$el.html(tmp( this.model.toJSON()) );
            this._modelBinder.bind(this.model, this.el);
            this.model.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
        },

        events: {
            "click #removeAll": "removeAll"
        },

        removeAll: function(e){
            e.preventDefault();

            app.co.plist = new app.collection.Productlist();
            app.v.plist = new app.view.cartProductList({ collection: app.co.plist, el: $('#normalproductList') });

            app.co.manjianlist = new app.collection.PromotionManjianList();
            app.v.manjianlist.render();

            app.co.comboproductlist = new app.collection.Productlist();
            app.v.combolist.render();;

            app.co.giftaddedproductlist = new app.collection.Productlist();
            app.co.exchangeaddedproductlist = new app.collection.Productlist();

            app.v.cartgiftlist = new app.view.cartGiftProductList({ collection: app.co.giftaddedproductlist, el: $('#freegiftproductlist') });
            app.v.cartexchangelist = new app.view.cartExchangeProductList({ collection: app.co.exchangeaddedproductlist, el: $('#redemptionproductlist') });
            
            app.co.combototallist = new app.collection.Productlist(); //组合购总计
            
            this.model.countTotal(app.co.plist, app.co.giftaddedproductlist, app.co.exchangeaddedproductlist, app.co.manjianlist, app.co.combototallist); // 计算全部总价
            $("#cartEmpty").show();
            stickFooter(); // 购物车商品超出一屏，则结算按钮固定窗口底部显示
        }

    });



    /*  页面开始渲染  */

// 开始普通商品列表部分
    app.m.product1 = new app.model.Product({productid:10, productname: "贝亲婴儿柔湿巾", normalprice: 10, promotionprice:10, productluckynumber:10, productpromotionmanjian : 0, productexchange:0 });
    app.m.product2 = new app.model.Product({productid:10, productname: "贝亲321231232123123212312", normalprice: 200, promotionprice:120,  productluckynumber:20, productpromotionmanjian : 0});
    app.m.product3 = new app.model.Product({productid:10, productname: "满减1贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20,  productluckynumber:10, productpromotionmanjian : 11534});
    app.m.product4 = new app.model.Product({productid:10, productname: "满减1贝亲321231232123123212312", normalprice: 20, promotionprice:20,  productluckynumber:10, productpromotionmanjian : 11534});
    app.m.product5 = new app.model.Product({productid:10, productname: "满减2贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10,  productluckynumber:10, productpromotionmanjian : 11532});
    app.m.product6 = new app.model.Product({productid:10, productname: "满减2贝亲321231232123123212312", normalprice: 20, promotionprice:10,  productluckynumber:10, productpromotionmanjian : 11532});
    app.m.product7 = new app.model.Product({productid:10, productname: "满减3贝亲321231", normalprice: 20, promotionprice:10,  productluckynumber:10, productpromotionmanjian : 11536});

    app.co.plist = new app.collection.Productlist();
    app.co.productdeletelist = new app.collection.Productlist();  //被删除的列表

    app.co.plist.add(app.m.product1);
    app.co.plist.add(app.m.product2);
    app.co.plist.add(app.m.product3);
    app.co.plist.add(app.m.product4);
    app.co.plist.add(app.m.product5);
    app.co.plist.add(app.m.product6);


    app.v.plist = new app.view.cartProductList({ collection: app.co.plist, el: $('#normalproductList') });

// 开始被删除商品部分
    app.v.productdellist = new app.view.removedProductList({collection: app.co.productdeletelist, el:$('#deletedProductlist')});  //被删除的列表渲染




// 开始组合购商品部分
    app.m.product10 = new app.model.Product({productid:100, productname: "组合购 商品贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20,  productluckynumber:10, productcombo : 14400,  productcomboproduct : 14500});
    app.m.product11 = new app.model.Product({productid:101, productname: "组合购 商品1 贝亲3456123212312", normalprice: 10, promotionprice:15,  productluckynumber:10, productcombo : 14500, productcomboproduct : 14400});
    app.m.product12 = new app.model.Product({productid:102, productname: "组合购 商品2 贝亲366", normalprice: 10, promotionprice:20,  productluckynumber:10, productcomboproduct : 14400});

    app.co.comboproductlist = new app.collection.Productlist();
    

    app.co.comboproductlist.add(app.m.product10);
    app.co.comboproductlist.add(app.m.product11);
    app.co.comboproductlist.add(app.m.product12);

    app.m.combo1 = new app.model.PromotionCombo({comboid: 14400, comboproductid: 100, comboproductid1:101, comboproductprice1: 86 , comboproductid2:102, comboproductprice2: 87 });
    app.m.combo2 = new app.model.PromotionCombo({comboid: 14500, comboproductid: 101, comboproductid1:100, comboproductprice1: 50   });

    app.co.combolist = new app.collection.PromotionComboList();
    app.co.combolist.add(app.m.combo1);
    app.co.combolist.add(app.m.combo2);

    app.v.combolist = new app.view.cartComboList({ collection: app.co.combolist, el: $('#allist') });



// 开始满减商品部分
    app.m.promotionmanjian1 = new app.model.PromotionManjian({promotionid:11534, promotionname: "全场纸尿裤100立减20", promotionmanjiandiscount1:20, promotionmanjiancondition1: 100, promotionmanjiandiscount2:40, promotionmanjiancondition2: 150});
    app.m.promotionmanjian2 = new app.model.PromotionManjian({promotionid: 11532, promotionname: "2013健康领跑 优你钙 满99元减20元", promotionmanjiandiscount1:20, promotionmanjiancondition1: 99, promotionmanjiandiscount2:40, promotionmanjiancondition2: 300});
    app.m.promotionmanjian3 = new app.model.PromotionManjian({promotionid: 11536, promotionname: "2013健康领跑 满69元减20元", promotionmanjiandiscount1:20, promotionmanjiancondition1: 69, promotionmanjiandiscount2:40, promotionmanjiancondition2: 300});

    app.co.manjianlist = new app.collection.PromotionManjianList();

    app.co.manjianlist.add(app.m.promotionmanjian1);
    app.co.manjianlist.add(app.m.promotionmanjian2);

    app.v.manjianlist = new app.view.cartManjianList({ collection: app.co.manjianlist, el: $('#allist') });



// 开始赠品活动部分
    app.m.promotiongift1 = new app.model.PromotionGift({promotionid:11582, promotionname: "宝得适&西班牙Jane 买就送 儿童炫酷电动车", promotiongiftcondition1:0, promotiongiftcondition2: 100});
    app.m.promotiongift2 = new app.model.PromotionGift({promotionid: 11581, promotionname: "益力健 满58元 送 价值20元靠堑 或 价值20元儿童护耳帽", promotiongiftcondition1:58, promotiongiftcondition2: 150});

    app.co.giftlist = new app.collection.PromotionGiftList();  //赠品促销列表

    app.co.giftlist.add(app.m.promotiongift1);
    app.co.giftlist.add(app.m.promotiongift2);

    app.m.productgift1 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", normalprice: 10, promotionprice:10, productstock:20, productgift : 11582});
    app.m.productgift2 = new app.model.Product({productname: "赠品贝亲456", normalprice: 200, promotionprice:120, productstock:10, productgift : 11582});
    app.m.productgift3 = new app.model.Product({productname: "赠品1贝亲婴儿柔湿巾", normalprice: 10, promotionprice:20, productstock:20, productgift : 11582});
    app.m.productgift4 = new app.model.Product({productname: "赠品1贝亲789", normalprice: 20, promotionprice:20, productstock:10, productgift : 11582});
    app.m.productgift5 = new app.model.Product({productname: "赠品贝亲婴儿柔湿巾", normalprice: 20, promotionprice:10, productstock:20, productgift : 11582});
    app.m.productgift6 = new app.model.Product({productname: "赠品2贝亲32133334324242424", normalprice: 20, promotionprice:10, productstock:20, productgift : 11581});

    app.co.giftproductlist = new app.collection.Productlist();  //所有赠品促销里面的所有免费赠品商品

    app.co.giftproductlist.add(app.m.productgift1);
    app.co.giftproductlist.add(app.m.productgift2);
    app.co.giftproductlist.add(app.m.productgift3);
    app.co.giftproductlist.add(app.m.productgift4);
    app.co.giftproductlist.add(app.m.productgift5);
    app.co.giftproductlist.add(app.m.productgift6);


    app.co.giftaddedproductlist = new app.collection.Productlist(); //已经领取的赠品列表

    app.v.carttopfreegiftlist = new app.view.cartTopGiftList({ collection: app.co.giftlist, el: $('#promotiongiftlist') });
    app.v.cartgiftlist = new app.view.cartGiftProductList({ collection: app.co.giftaddedproductlist, el: $('#freegiftproductlist') });






// 开始换购活动部分
    app.m.promotionexchange1 = new app.model.PromotionExchange({promotionid:11592, promotionname: "周三全场买满358元加1元换购以下任一商品，换完为止。", promotionexchangecondition1:358, promotionexchangeprice1:1, promotiongiftcondition2: 458});
    app.m.promotionexchange2 = new app.model.PromotionExchange({promotionid:11583, promotionname: "宝得适&西班牙Jane 买任意商品+50元超值换购", promotionexchangecondition1:100, promotionexchangeprice1:50, promotiongiftcondition2: 150});
    app.m.promotionexchange3 = new app.model.PromotionExchange({promotionid:11498, promotionname: "周三全场买满358元加1元换购以下任一商品，换完为止。", promotionexchangecondition1:358, promotionexchangeprice1:1, promotiongiftcondition2: 458});
    app.m.promotionexchange4 = new app.model.PromotionExchange({promotionid:11458, promotionname: "好奇指定纸尿裤 购买即可18元换购 好奇清爽洁净婴儿柔湿巾80抽补充装", promotionexchangecondition1:0, promotionexchangeprice1:18, promotiongiftcondition2: 150});
    app.m.promotionexchange5 = new app.model.PromotionExchange({promotionid:11457, promotionname: "帮宝适指定纸尿裤 购买即可18元换购 帮宝适柔润护肤系列护儿湿巾56片装一包", promotionexchangecondition1:0, promotionexchangeprice1:18, promotiongiftcondition2: 458});

    app.co.exchangelist = new app.collection.PromotionExchangeList();  //换购促销列表

    app.co.exchangelist.add(app.m.promotionexchange1);
    app.co.exchangelist.add(app.m.promotionexchange2);
    app.co.exchangelist.add(app.m.promotionexchange3);
    app.co.exchangelist.add(app.m.promotionexchange4);
    app.co.exchangelist.add(app.m.promotionexchange5);
    app.co.exchangelist.add(app.m.promotionexchange6);

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


    app.co.exchangeproductlist = new app.collection.Productlist();  //所有换购促销里面的所有换购商品

    app.co.exchangeproductlist.add(app.m.productexchange1);
    app.co.exchangeproductlist.add(app.m.productexchange2);
    app.co.exchangeproductlist.add(app.m.productexchange3);
    app.co.exchangeproductlist.add(app.m.productexchange4);
    app.co.exchangeproductlist.add(app.m.productexchange5);
    app.co.exchangeproductlist.add(app.m.productexchange6);
    app.co.exchangeproductlist.add(app.m.productexchange7);
    app.co.exchangeproductlist.add(app.m.productexchange8);
    app.co.exchangeproductlist.add(app.m.productexchange9);
    app.co.exchangeproductlist.add(app.m.productexchange10);
    app.co.exchangeproductlist.add(app.m.productexchange11);


    app.co.exchangeaddedproductlist = new app.collection.Productlist(); //已经领取的换购列表

    app.v.carttopexchangelist = new app.view.cartTopExchangeList({ collection: app.co.exchangelist, el: $('#promotionredemptionlist') });
    app.v.cartexchangelist = new app.view.cartExchangeProductList({ collection: app.co.exchangeaddedproductlist, el: $('#redemptionproductlist') });


    // 开始商品总金额部分
    app.m.cartcouponcode = new app.model.PromotionCoupon({ couponid: 20, coupontype:2, couponpromotionid:11582 });
    app.v.cartcouponcode = new app.view.cartCouponCode({ model: app.m.cartcouponcode, el: $('#couponCodeBox') });

    app.m.carttotal = new app.model.CartTotal();
    app.v.carttotal = new app.view.cartTotal({ model: app.m.carttotal, el: $('#cart-total') });

    stickFooter(); // 购物车商品超出一屏，则结算按钮固定窗口底部显示
});
// 购物车商品超出一屏，则结算按钮固定窗口底部显示
function stickFooter(){
    var floatMain = $("#cart-final"),
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

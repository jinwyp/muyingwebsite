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

});

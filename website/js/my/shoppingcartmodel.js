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
        co:{},
        htmlbody:{},
        temp: {}
    };

    window.app = app;

    /* Model 开始  */
    /* Model 商品信息模型 */
    app.model.Product = Backbone.Model.extend({
        defaults : {
            idAttribute: 'productid',
            productid: 0,
            productname : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            productpromotiontext : '天天特价',
            producturl : '/xxx/xxx/pic.jpg',
            productpic : '/xxx/xxx/pic.jpg',
            normalprice : 138,
            promotionprice : 0,
            productfinalprice : 0,
            productstock : 6,
            productquantity : 1,
            productweight : 0,

            productdeleted : 0, //是否已被删除,等待恢复. 1表示已经被删除

            producttotalprice : 0,
            producttotalpricetext : 0,
            productluckynumber : 0, //幸运星
            producttotalluckynumber : 0,
            productweight : 10,
            producttotalweight : 0,

            productgift : 0, //是否是赠品 0为不是赠品, 如果是赠品需要填写属于哪个赠品促销ID
            productexchange : 0, //是否是换购商品 如果是换购商品需要填写属于哪个换购促销ID
            productexchangeprice : 88, //换购价格

            productcombo : 0, //作为主商品是否有组合购, 0为没有组合购, 否则填写组合购促销ID
            productcomboproduct : 0, //是否为组合购副商品, 0为没有组合购, 否则填写组合购促销ID
            productcomboprice : 0, //作为副商品组合购的显示价格, 价格从组合购设置里面取出

            productpromotiongift : 0, //该商品是否参与赠品活动 不参与为0,参与为赠品活动ID
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

            this.sumPrice();
        },

        sumPrice: function(){
            var productsumtotal = this.get('productquantity') * this.get('productfinalprice');
            this.set("producttotalprice", productsumtotal);

            var rmb = $("<b>&yen;</b>").html(); //增加人民币符号
            this.set("producttotalpricetext", rmb + this.get("producttotalprice").toFixed(2) );

            var productluckysumtotal = this.get('productquantity') * this.get('productluckynumber');
            this.set("producttotalluckynumber", productluckysumtotal);

            this.set("producttotalweight", (this.get('productquantity') * this.get('productweight')));
        }
    });


    /* Collection 商品列表信息模型  */
    app.collection.Productlist = Backbone.Collection.extend({
        model: app.model.Product,

        byID: function(productID){
            var found = this.find(function(item){
                return (item.get('productid')) === productID;
            });
            return found;
        },

        byNormalProduct: function(){
            var filtered = this.filter(function(product) {
                return (product.get("productpromotionmanjian") === 0) && (product.get("productcombo") === 0) && (product.get("productcomboproduct") === 0);
           });
            return new app.collection.Productlist(filtered);
        },

        byManjianProduct: function(manjianID){
            var filtered = this.filter(function(product) {
                return product.get("productpromotionmanjian") === manjianID;
            });
            return new app.collection.Productlist(filtered);
        },

        byComboProduct: function(comboID){
            var filtered = this.filter(function(product) {
                return product.get("productcombo") === comboID;
            });
            return new app.collection.Productlist(filtered);
        },


        byGiftProduct: function(giftID){
            var filtered = this.filter(function(product) {
                return product.get("productgift") === giftID;
            });
            return new app.collection.Productlist(filtered);
        },

        byExchangeProduct: function(exchangeID, exchangPrice){

            var filtered = this.filter(function(product) {

                return product.get("productexchange") === exchangeID;
            });
            return new app.collection.Productlist(filtered);
        },

        productTotalPrice: function() {
            return this.reduce(function(memo, product) {
                return memo + product.get("producttotalprice")
            }, 0);
        },

        productTotalQuantity: function() {
            return this.reduce(function(memo, product) {
                return memo + product.get("productquantity")
            }, 0);
        },

        productTotalLucky: function() {
            return this.reduce(function(memo, product) {
                return memo + product.get("producttotalluckynumber")
            }, 0);
        },

        productTotalWeight: function() {
            return this.reduce(function(memo, product) {
                return memo + product.get("producttotalweight")
            }, 0);
        }

    });




    /* Model 满减信息模型  */
    app.model.PromotionManjian = Backbone.Model.extend({
        defaults : {
            promotionid : 0, //是否参与满减 不参与为0,参与为满减活动ID
            promotionname : '全场纸尿裤200立减20',
            promotiontotalprice : 0,  //参与满减商品当前总金额
            promotiontotalpricetext : 0,  //参与满减商品当前总金额
            promotiontotaldifferenceprice : 0,  //参与满减商品当前总金额还差多少够满减
            promotiontotaldifferencepricetext : 0,  //参与满减商品当前总金额还差多少够满减

            promotionmanjianalreadydiscount : 0, //当前满减已优惠金额

            promotionmanjiancondition : 0, //满减满足条件金额
            promotionmanjiandiscount : 0, //满减优惠金额

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
    app.collection.PromotionManjianList = Backbone.Collection.extend({
        model: app.model.PromotionManjian,

        manjianTotalDiscount: function() {
            return this.reduce(function(memo, manjian) {
                return memo + manjian.get("promotionmanjianalreadydiscount")
            }, 0);
        }
    });




    /* Model 赠品促销信息模型  */
    app.model.PromotionGift = Backbone.Model.extend({
        defaults : {
            promotionid : 0,
            promotionname : '禧贝 满88元送 价值28元大头狗单入装毛巾 或 价值28元Little me婴儿植物滋养沐浴露',
            promotionimageurl : '/xxx/img.jpg',

            promotiontotalprice : 0,  //参与赠品商品当前总金额
            promotiontotalpricetext : 0,  //参与赠品商品当前总金额
            promotiontotaldifferenceprice : 0,  //参与赠品商品当前总金额还差多少够
            promotiontotaldifferencepricetext : 0,  //参与赠品商品当前总金额还差多少够

            promotiongiftcondition : 0, //赠品满足条件金额
            promotiongiftcondition1 : 90, //赠品满足条件金额1
            promotiongiftcondition2 : 120 //赠品满足条件金额2
        },

        initialize: function() {
            if( (this.get("promotiontotalprice") - this.get("promotiongiftcondition1") ) < 0 ){
                this.set("promotiongiftcondition", this.get("promotiongiftcondition1"));
            }
        }
    });

    /* Collection 赠品信息列表模型  */
    app.collection.PromotionGiftList = Backbone.Collection.extend({
        model: app.model.PromotionGift
    });



    /* Model 换购促销信息模型  */
    app.model.PromotionExchange = Backbone.Model.extend({
        defaults : {
            promotionid : 0,
            promotionname : '周三全场买满358元加1元换购以下任一商品，换完为止。',
            promotionimageurl : '/xxx/img.jpg',

            promotiontotalprice : 0,  //参与换购商品当前总金额
            promotiontotalpricetext : 0,  //参与换购商品当前总金额文字
            promotiontotaldifferenceprice : 0,  //参与换购商品当前总金额还差多少够
            promotiontotaldifferencepricetext : 0,  //参与换购商品当前总金额还差多少够

            promotionexchangecondition : 0, //换购满足条件金额
            promotionexchangeprice : 90, //满足条件换购价格

            promotionexchangecondition1 : 90, //换购满足条件金额1
            promotionexchangeprice1 : 90, //满足条件换购价格1
            promotionexchangecondition2 : 120, //换购满足条件金额2
            promotionexchangeprice2 : 90 //满足条件换购价格2
        },

        initialize: function() {
            if( (this.get("promotiontotalprice") - this.get("promotionexchangecondition1") ) < 0 ){
                this.set("promotionexchangecondition", this.get("promotionexchangecondition1"));
                this.set("promotionexchangeprice", this.get("promotionexchangeprice1"));
            }
        }
    });

    /* Collection 换购信息列表模型  */
    app.collection.PromotionExchangeList = Backbone.Collection.extend({
        model: app.model.PromotionExchange
    });



    /* Model 组合购信息模型  */
    app.model.PromotionCombo = Backbone.Model.extend({
        defaults : {
            comboid : 0,  //组合购促销ID
            comboproductid : 0, //主商品ID
            comboproductname : 0, //主商品名称
            comboproductprice : 0, //主商品价格

            comboproductid1 : 0, //第一个副商品ID
            comboproductprice1 : 0, //第一个副商品价格
 
            comboproductid2 : 0, //第二个副商品ID
            comboproductprice2 : 0, //第二个副商品价格

            comboproductid3 : 0, //第三个副商品ID
            comboproductprice3 : 0, //第三个副商品价格

            comboproductid4 : 0, //第四个副商品ID
            comboproductprice4 : 0, //第四个副商品价格

            combototalprice : 0,  //参与换购商品当前总金额
            combootalpricetext : 0,  //参与换购商品当前总金额文字

        }
    });



    /* Collection 组合购信息列表模型  */
    app.collection.PromotionComboList = Backbone.Collection.extend({
        model: app.model.PromotionCombo
    });




    /* Model 购物车信息总和信息模型  */
    app.model.CartTotal = Backbone.Model.extend({
        defaults : {
            carttotalquantity : 0,  //商品总数量
            carttotalweight : 0,  //商品总重量
            carttotalprice : 0,  //原始总金额
            carttotaldiscount : 0,  //优惠总金额
            carttotalfinalprice : 0,  //最终金额
            carttotallucky : 0  //总幸运星
        },

        initialize: function() {

                this.set("carttotalfinalprice", (this.get("carttotalprice") - this.get("carttotaldiscount"))  );
        },

        countTotal: function(plist, giftlist, exchangelist, manjianpromotionlist, combolist){

            var totalquantity = plist.productTotalQuantity() + giftlist.productTotalQuantity() + exchangelist.productTotalQuantity() + combolist.productTotalQuantity();
            this.set("carttotalquantity", totalquantity  );

            var totalprice = plist.productTotalPrice() + giftlist.productTotalPrice() + exchangelist.productTotalPrice() + combolist.productTotalPrice();
            this.set("carttotalprice", totalprice  );

            var totalweight = plist.productTotalWeight() + giftlist.productTotalWeight() + exchangelist.productTotalWeight() + combolist.productTotalWeight();
            this.set("carttotalweight", totalweight  );

            var totallucky = plist.productTotalLucky() + giftlist.productTotalLucky() + exchangelist.productTotalLucky() + combolist.productTotalLucky();
            this.set("carttotallucky", totallucky  );

            var totaldiscount = manjianpromotionlist.manjianTotalDiscount() ;
            this.set("carttotaldiscount", totaldiscount  );

            this.set("carttotalfinalprice", (this.get("carttotalprice") - this.get("carttotaldiscount")));

        }
    });


});


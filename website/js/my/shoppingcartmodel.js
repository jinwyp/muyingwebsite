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
            productpic : '/xxx/xxx/pic.jpg',
            normalprice : 138,
            promotionprice : 0,
            productfinalprice : 0,
            productstock : 6,
            productquantity : 1,
            producttotalprice : 0,
            producttotalpricetext : 0,
            productluckynumber : 0,

            productgift : 0, //是否是赠品 0为不是赠品, 如果是赠品需要填写属于哪个赠品促销ID
            productexchange : 0, //是否是换购商品 
            productexchangeprice : 88, //换购价格

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

        byGiftProduct: function(giftID){
            var filtered = this.filter(function(product) {
                return product.get("productgift") === giftID;
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
            promotionname : '全场纸尿裤200立减20',
            promotiontotalprice : 0,  //参与满减商品当前总金额
            promotiontotalpricetext : 0,  //参与满减商品当前总金额
            promotiontotaldifferenceprice : 0,  //参与满减商品当前总金额还差多少够满减
            promotiontotaldifferencepricetext : 0,  //参与满减商品当前总金额还差多少够满减

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
    app.model.PromotionManjianList = Backbone.Collection.extend({
        model: app.model.PromotionManjian
    });




    /* Model 赠品促销信息模型  */
    app.model.PromotionGift = Backbone.Model.extend({
        defaults : {
            promotionid : 0, //是否参与赠品 不参与为0,参与为赠品活动ID
            promotionname : '禧贝 满88元送 价值28元大头狗单入装毛巾 或 价值28元Little me婴儿植物滋养沐浴露',
            promotionimageurl : '/xxx/img.jpg',

            promotiontotalprice : 0,  //参与赠品商品当前总金额
            promotiontotalpricetext : 0,  //参与赠品商品当前总金额
            promotiontotaldifferenceprice : 0,  //参与赠品商品当前总金额还差多少够满减
            promotiontotaldifferencepricetext : 0,  //参与赠品商品当前总金额还差多少够满减

            promotiongiftcondition : 0, //赠品满足条件金额
            promotiongiftcondition1 : 90, //赠品满足条件金额1
            promotiongiftcondition2 : 90 //赠品满足条件金额2
        },

        initialize: function() {
            if( (this.get("promotiontotalprice") - this.get("promotiongiftcondition1") ) < 0 ){
                this.set("promotiongiftcondition", this.get("promotiongiftcondition1"));
            }
        }
    });

    /* Collection 满减信息列表模型  */
    app.model.PromotionGiftList = Backbone.Collection.extend({
        model: app.model.PromotionGift
    });





});


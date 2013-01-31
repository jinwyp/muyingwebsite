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

    /* Model 一个邮件活动信息模型 */
    app.model.Email = Backbone.Model.extend({
        defaults : {
            emailid:null,
            emailname : '',
            couponcode : ''
        },
        url: '/rest/emails',
        idAttribute: "emailid"
    });

    /* Model 一个商品信息模型 */
    app.model.Product = Backbone.Model.extend({
        defaults : {
            emailid:0,
            productid:null,
            productname : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            productintro : '今日特惠',
            producturl : '',
            productpic : '',
            productmarketprice : 9999,
            productfinalprice : 999
        },
        idAttribute: "productid"
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


});


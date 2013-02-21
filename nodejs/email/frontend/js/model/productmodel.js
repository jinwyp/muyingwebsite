    //定义全局变量
head.ready(function () {

    /* Model 开始  */

    /* Model 一个商品信息模型 */
    app.model.Product = Backbone.Model.extend({
        defaults : {
            productid:null,
            productname : '贝亲婴儿柔湿巾10片装 贝亲婴儿柔湿巾10片装',
            productintro : '今日特惠',
            productredtitle : '',
            productredtitleurl : '',
            productpriceshowtext: '会员价',
            producturl : '',
            productpic : '',
            productmarketprice : 9999,
            productnormailprice : 9999,
            producttimelimitedprice : 9999,
            starttime : 0,
            endtime : 0,
            limitedstock : 10,
            userlimitedstock : 3,
            totalstock : 20,
            productquantity : 1,
            productfinalprice : 9999,
            promotiontab:"",
            combostarttime : '',
            comboendtime : '',
            comboquantity1 : '',
            comboprice1 : '',
            comboquantity2 : '',
            comboprice2 : '',
            comboquantity3 : '',
            comboprice3 : ''
        },
        initialize : function(){
            this.set('starttime', this.date2Converter(this.get('starttime')) );
            this.set('endtime', this.date2Converter(this.get('endtime')) );
            this.set('combostarttime', this.date2Converter(this.get('combostarttime')) );
            this.set('comboendtime', this.date2Converter(this.get('comboendtime')) );
        },
        idAttribute: "productid",
        urlRoot: '/rest/products',
        numberConverter: function(direction, value){
            if (direction === Backbone.ModelBinder.Constants.ViewToModel) {
                return parseFloat(value) ;
            }else{
                return value ;
            }
            // direction is either ModelToView or ViewToModel

            // Return either a formatted value for the view or an un-formatted value for the model
        },
        dateConverter: function(direction, value){
            if (direction === Backbone.ModelBinder.Constants.ViewToModel) {
                return value ;
            }else{
                var dateshow = new Date(value);
//                console.log(dateshow);
                return dateshow.getFullYear() + '-' + (dateshow.getMonth()+1) + '-' + dateshow.getDate()   ;
            }
        },
        date2Converter: function(value){
            var dateshow = new Date(value);
//            console.log(dateshow);
            return dateshow.getFullYear() + '-' + (dateshow.getMonth()+1) + '-' + dateshow.getDate()   ;

        },
        addUnitConverter: function(direction, value){
            if (direction === Backbone.ModelBinder.Constants.ViewToModel) {
                return parseFloat(value) ;
            }else{
                return value + "元";
            }
            // direction is either ModelToView or ViewToModel

            // Return either a formatted value for the view or an un-formatted value for the model
        }
    });



    /* Collection 商品列表信息模型  */
    app.collection.ProductList = Backbone.Collection.extend({
        model: app.model.Product,
        url: '/rest/products',

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


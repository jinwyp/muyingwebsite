//定义全局变量
head.ready(function () {


    /* View 开始普通商品列表中的单个商品  */
    app.view.emailProduct = Backbone.View.extend({
        tagName : 'td',

        template: $('#singleProductTemplate').html(),

        initialize: function(){

            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp(this.model.toJSON())) ;

        }
    });

    /* View 开始普通商品列表中的单个商品  */
    app.view.emailTwoProduct = Backbone.View.extend({
        tagName : 'table',
        attributes: {
            "border":"0",
            "cellpadding" : "0",
            "cellspacing" : "0"
        },

        template: $('#twoProductTemplate').html(),

        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp) ;
            this.$el.find("#productbox").empty();
            this.collection.each(this.showProduct, this);
        },

        showProduct: function(product){
            app.v.product = new app.view.emailProduct({ model: product });
            this.$el.find("#productbox").append(app.v.product.el);

        }
    });


    /* View 开始一个Email  */
    app.view.Email = Backbone.View.extend({
        template: $('#edmTemplate').html(),
        tempcollection : new app.collection.Productlist(),
        number1 : 0,
        initialize: function(){
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp(this.model.toJSON()) );
            this.collection.each(this.showProduct, this);

        },

        showProduct: function(product){
            product.set("emailid", this.model.get("emailid"));
            this.tempcollection.add(product);

            if(this.number1%2  ){
                console.log( this.tempcollection);
                app.v.producttwo = new app.view.emailTwoProduct({ collection: this.tempcollection });
                this.$el.find("#productlinebox").append(app.v.producttwo.el);

                this.tempcollection = new app.collection.Productlist();
            }
            this.number1 = this.number1 +1 ;

        }
    });






    /*  页面开始渲染  */

    app.m.product1 = new app.model.Product({
        productid:12310,
        productname: "皇室新小蜜蜂床边音乐铃",
        productintro :"早期感官发育 适合0岁以上宝宝",
        producturl : "http://www.muyingzhijia.com/shopping/productdetail.aspx?pdtID=81360&ctlid=433&utm_source=myzj&utm_medium=email&utm_term=hv&utm_campaign=toys0123" ,
        productpic : "http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_10.jpg",
        productmarketprice: 20,
        productfinalprice:10
    });

    app.m.product2 = new app.model.Product({
            productid:12310312,
            productname: "皇室新32131",
            productintro :"早期感官发育 适合0岁以上宝宝",
            producturl : "http://www.muyingzhijia.com/shopping/productdetail.aspx?pdtID=81360&ctlid=433&utm_source=myzj&utm_medium=email&utm_term=hv&utm_campaign=toys0123" ,
            productpic : "http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_10.jpg",
            productmarketprice: 20,
            productfinalprice:10
    });

    app.m.product3 = new app.model.Product({
        productid:1231033,
        productname: "皇室新小蜜蜂4444",
        productintro :"早期感官发育 适合0岁以上宝宝",
        producturl : "http://www.muyingzhijia.com/shopping/productdetail.aspx?pdtID=81360&ctlid=433&utm_source=myzj&utm_medium=email&utm_term=hv&utm_campaign=toys0123" ,
        productpic : "http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_10.jpg",
        productmarketprice: 20,
        productfinalprice:10
    });

    app.m.product4 = new app.model.Product({
        productid:12310312123,
        productname: "皇室新666",
        productintro :"早期感官发育 适合0岁以上宝宝",
        producturl : "http://www.muyingzhijia.com/shopping/productdetail.aspx?pdtID=81360&ctlid=433&utm_source=myzj&utm_medium=email&utm_term=hv&utm_campaign=toys0123" ,
        productpic : "http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_10.jpg",
        productmarketprice: 20,
        productfinalprice:10
    });

    app.co.plist1 = new app.collection.Productlist();
    app.co.plist1.add(app.m.product1);
    app.co.plist1.add(app.m.product2);
    app.co.plist1.add(app.m.product3);
    app.co.plist1.add(app.m.product4);


    app.m.email1 = new app.model.Email({
        emailid:null,
        emailname : '活动EDM',
        emaillink : 'http://www.muyingzhijia.com/?utm_source=myzj&utm_source=myzj&utm_source=myzj&utm_medium=email&utm_term=hv&utm_campaign=toys0123',
        headpic1 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_01.jpg',
        headpic2 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_02.jpg',
        headpic3 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_03.jpg',
        headpic4 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_05.jpg',
        headpic5 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_06.jpg',
        headpic6 : '',
        borderpic : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_07.jpg',
        bottempic1 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_68.jpg',
        bottempic2 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_69.jpg',
        bottempic3 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_70.jpg',
        bottempic4 : 'http://img.muyingzhijia.com/edm/2013/0122toys/images/baby_joy_confluence_edm0121_71.jpg',
        couponcode : 'QHUYLP',
        coupondate : '在活动价基础上抵用(有效期截至：2013/1/31)'

    });
    app.v.email1 = new app.view.Email({ model: app.m.email1, collection: app.co.plist1, el:'body' });

// 开始普通商品列表部分



});

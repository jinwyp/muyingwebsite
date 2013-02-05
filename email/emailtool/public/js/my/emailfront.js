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

                app.v.producttwo = new app.view.emailTwoProduct({ collection: this.tempcollection });
                this.$el.find("#productlinebox").append(app.v.producttwo.el);

                this.tempcollection = new app.collection.Productlist();
            }
            this.number1 = this.number1 +1 ;

        }
    });







});

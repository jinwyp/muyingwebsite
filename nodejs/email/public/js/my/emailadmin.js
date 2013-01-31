//定义全局变量
head.ready(function () {


    /* View 开始普通商品列表中的单个商品  */
    app.view.emailProduct = Backbone.View.extend({
        template: $('#ProductTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp) ;

            this._modelBinder.bind(this.model, this.el);
        },

        events: {
            "change input": "changeInput"
        },

        changeInput: function(){
            console.log(this.model);
        }
    });




    /* View 开始一个Email  */
    app.view.Email = Backbone.View.extend({
//        template: $('#ProductListTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function(){
//            var tmp = Handlebars.compile( this.template );
//            this.$el.html(tmp );
            this._modelBinder.bind(this.model, this.el);
            this.$el.find("#productbox").empty();
            this.collection.each(this.showProduct, this);
        },

        events: {
            "click #save_email": "saveEmail",
            "click #add_product": "addProduct"
        },

        saveEmail: function(e){
            e.preventDefault();
            this.model.save();
            console.log(22);
        },

        addProduct: function(e){
            e.preventDefault();
            app.m.product1 = new app.model.Product();
            app.m.product2 = new app.model.Product();

            this.collection.add(app.m.product1);
            this.collection.add(app.m.product2);
            this.render();
        },

        showProduct: function(product){
            product.set("emailid", this.model.get("emailid"));
            app.v.product = new app.view.emailProduct({ model: product });
            this.$el.find("#productbox").append(app.v.product.el);
        }
    });


    /*  页面开始渲染  */

// 开始普通商品列表部分

    app.m.email = new app.model.Email();
    app.co.plist = new app.collection.Productlist();

    app.v.email = new app.view.Email({ model: app.m.email, collection: app.co.plist, el: $('#emailbox') });

});

//定义全局变量
head.ready(function () {


/* View 单个详细商品  */
    app.view.Product = Backbone.View.extend({
        
        template: $('#ProductTemplate').html(),

        initialize: function(){
            this._modelBinder = new Backbone.ModelBinder();
//            this.bingdings = {
//                productid : {selector: '[name=productid]', converter: this.model.numberConverter},
//                productname : '[name=productname]',
//                productintro : '[name=productintro]',
//                productredtitle : '[name=productredtitle]',
//                productredtitleurl : '[name=productredtitleurl]',
//                productpriceshowtext : '[name=productpriceshowtext]',
//                producturl : '[name=producturl]',
////                productpic : '[name=productpic]',
//                productmarketprice :{selector: '[name=productmarketprice]', converter: this.model.numberConverter},
//                productnormailprice : {selector: '[name=productnormailprice]', converter: this.model.numberConverter},
//                producttimelimitedprice : {selector: '[name=producttimelimitedprice]', converter: this.model.numberConverter},
//                starttime : {selector: '[name=starttime]', converter: this.model.dateConverter},
//                endtime : {selector: '[name=endtime]', converter: this.model.dateConverter},
//                limitedstock : {selector: '[name=limitedstock]', converter: this.model.numberConverter},
//                userlimitedstock : {selector: '[name=userlimitedstock]', converter: this.model.numberConverter},
//                totalstock : {selector: '[name=totalstock]', converter: this.model.numberConverter},
////                productquantity : {selector: '[name=productquantity]', converter: this.model.numberConverter},
////                productfinalprice : {selector: '[name=productfinalprice]', converter: this.model.numberConverter},
//                promotiontab :'[name=promotiontab]',
//                combostarttime : {selector: '[name=combostarttime]', converter: this.model.dateConverter},
//                comboendtime : {selector: '[name=comboendtime]', converter: this.model.dateConverter},
//                comboquantity1 : {selector: '[name=comboquantity1]', converter: this.model.numberConverter},
//                comboprice1 : {selector: '[name=comboprice1]', converter: this.model.numberConverter},
//                comboquantity2 : {selector: '[name=comboquantity2]', converter: this.model.numberConverter},
//                comboprice2 : {selector: '[name=comboprice2]', converter: this.model.numberConverter},
//                comboquantity3 : {selector: '[name=comboquantity3]', converter: this.model.numberConverter},
//                comboprice3 : {selector: '[name=comboprice3]', converter: this.model.numberConverter}  };
            this.render();
        },

        render: function(){
            var tmp = Handlebars.compile( this.template );
            this.$el.html(tmp (this.model.toJSON()));
//            this._modelBinder.bind(this.model, this.el);
//            this.$el.find("#timelimitedbox").hide();
//            this.$el.find("#combobox").hide();
//            this.showTab();
//            var that = this;
//            this.$el.find('#starttime').datepicker().on('changeDate', function(ev){
//                that.model.set("starttime", ev.date);
//                console.log(ev.date, that.model.get("starttime"));
//            });
//
//            this.$el.find('#endtime').datepicker().on('changeDate', function(ev){
//                that.model.set("endtime", ev.date);
//            });
//
//            this.$el.find('#combostarttime').datepicker().on('changeDate', function(ev){
//                that.model.set("combostarttime", ev.date);
//            });
//
//            this.$el.find('#comboendtime').datepicker().on('changeDate', function(ev){
//                that.model.set("comboendtime", ev.date);
//            });

        }
    });



    /*  页面开始渲染  */



        app.m.product2 = new app.model.Product({productid: 22});
        app.m.product2.fetch({success: function(){

            app.v.product2 = new app.view.Product({ model: app.m.product2});
            $("#productmain").html(app.v.product2.el);
            /* 	        	$("#rightbox").append(new UserView({model: app.model.user1, el: $("#userlist") }).el);	   */

        }});




// 开始普通商品列表部分



});

define(function(require, exports, module) {


    window.CategoryCollection = Backbone.Collection.extend({
        model: CategoryModel,
        url: "index.php/api/restful_user/users"
    });


})
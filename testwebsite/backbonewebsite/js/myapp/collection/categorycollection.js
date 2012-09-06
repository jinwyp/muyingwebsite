define(function(require, exports, module) {


    window.CategoryCollection = Backbone.Collection.extend({
        model: CategoryModel,
        url: "http://www.fbair.net/ci/index.php/api/restful_category/categories"
    });


})
define(function(require, exports, module) {


    window.CategoryModel = Backbone.Model.extend({
        urlRoot: "index.php/api/restful_user/user/id",

        defaults: {
            id: null,
            categoryname: "clock "
        }
    });
})
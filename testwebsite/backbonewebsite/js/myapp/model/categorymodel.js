/**
 * Created with JetBrains WebStorm.
 * User: wyp1237
 * Date: 12-9-4
 * Time: 下午12:28
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {


    window.CategoryModel = Backbone.Model.extend({
        urlRoot: "http://www.fbair.net/ci/index.php/api/restful_category/category/id",

        defaults: {
            id: null,
            level: "",
            parentcategoryid: "",
            categorywebsitename: "",
            categorymenuname: "",
            categorymobilename: "",
            displayorder: "",
            nodisplay: ""
        }
    });

})

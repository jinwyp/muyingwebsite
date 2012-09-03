/**
 * Created with JetBrains WebStorm.
 * User: wyp1237
 * Date: 12-8-31
 * Time: 下午3:15
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    require('./userlistsingleview');


    window.UserListView01 = Backbone.View.extend({
        initialize:function () {
            this.render();
        },

        render:function () {
            var usermodels = this.model.models;
            var len = usermodels.length;

            $(this.el).html('<ul class="userlistred"></ul>');

            for (var i = 0; i < len; i++) {
                $(this.el).append(new UserListSingleView({model:usermodels[i]}).render().el);
            }

            return this;
        }
    });

})



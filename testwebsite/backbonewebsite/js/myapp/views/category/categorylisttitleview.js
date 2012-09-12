define(function(require, exports, module) {

    var categorylisttitleTemplate = require('baseurl/templates/cateogrylisttitle.tpl');

    window.CategoryListTitleView = Backbone.View.extend({

        initialize: function () {

        },

        render: function () {
            var template =Handlebars.compile( categorylisttitleTemplate );
            $(this.el).html(template(this.model.toJSON()));
            return this;
        }

    });

});



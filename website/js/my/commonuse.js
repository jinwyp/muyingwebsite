/**
 * Created with JetBrains WebStorm.
 * User: Janker Zhang
 * Date: 13-1-9
 * Time: 下午2:01
 * To change this template use File | Settings | File Templates.
 */
//gotop  回顶部按钮
jQuery(function() {
    var $backToTopTxt = "回顶部", $backToTopEle = $('<div class="gotop"></div>').appendTo($("body"))
        .text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
            $("html, body").animate({ scrollTop: 0 }, 1000);
        }), $backToTopFun = function() {
        var st = $(document).scrollTop(), winh = $(window).height();
        (st > 0)? $backToTopEle.fadeIn(): $backToTopEle.fadeOut();
        //IE6下的定位
        if (!window.XMLHttpRequest) {
            $backToTopEle.css("top", st + winh - 166);
        }
    };
    $(window).bind("scroll", $backToTopFun);
    $(function() { $backToTopFun(); });
});


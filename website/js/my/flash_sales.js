//all brand
$(".more-brand").bind("click",function(){
    if($(this).hasClass("more-open")){
        $(".fs-brand-content").css("height","auto");
        $(this).removeClass("more-open").addClass("more-close");
    }
    else{
        $(".fs-brand-content").css("height","50px");
        $(this).removeClass("more-close").addClass("more-open");
    }
});
//border hover
$(".fs-item").bind("hover",function(){
    if($(this).hasClass("fs-item-hover")){
        $(this).find(".notice-name").hide();
        $(this).removeClass("fs-item-hover");
    }
    else{
        $(this).find(".notice-name").show();
        $(this).addClass("fs-item-hover");
    }
});
$(".detail-item").bind("hover", function () {
    if ($(this).hasClass("detail-item-hover")) {
        $(this).removeClass("detail-item-hover");
    }
    else {
        $(this).addClass("detail-item-hover");
    }
});

//goods list
$(".detail-item:nth-child(3n)").addClass("row3");
//popup
var $backToTopEle = $("#gotop").click(function() {
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
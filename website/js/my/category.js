//热销商品排行
jQuery(function(){
    $("#top5 dl:first dt").hide();
    $("#top5 dl:first dd").show();
    $("#top5 dl dt").mouseover(function(){
        $("#top5 dl dt").show();
        $("#top5 dl dd").hide();
        $(this).hide().siblings("dd").show();

    });
});
//商品列表背景变化
jQuery(function(){
$(".goods_list dl:nth-child(4n)").css({margin:"10px 0 0 10px"});
$(".goods_list dl").hover(function(){
    $(".goods_list dl").removeClass("hover");
    $(this).addClass("hover");
});
});
//筛选
jQuery(function(){
    $(".sift .order a:not(#liprice)").click(function(){		
        $(".sift .order a").removeClass("selected order_desc order_asc");
        $(this).addClass("selected");		
		
    })
	
	   $(".sift .order a#liprice").click(function(){
		$(".sift .order a").removeClass("selected");
        if ($(this).hasClass("order_desc")){			 	
			$(this).removeClass("order_desc").addClass("order_asc");
		}else{
			$(this).addClass("order_desc").removeClass("order_asc");
			
		}
	   });
});
jQuery(function(){
   $(".attrSelect li").each(function(){
   if($(this).children("dl").height() > 60){
       $(this).append("<span class=\"more\">展开</span>");
       $(this).children("dl").height(60);
       $(this).children(".more").toggle(function(){
            $(this).siblings("dl").css({height:"auto"});
            $(this).html("收起")},function(){
               $(this).siblings("dl").height(60);
               $(this).html("展开")}
       );
    }
    });
});

jQuery(function() {
    $(".switch_thumb").toggle(function(){
        $(this).addClass("swap");
        $(".goods_display").fadeOut("fast", function() {
            $(this).fadeIn("fast").addClass("list_view");
        });
    }, function () {
        $(this).removeClass("swap");
        $(".goods_display").fadeOut("fast", function() {
            $(this).fadeIn("fast").removeClass("list_view");
        });
    });

});


//gotop
jQuery(function() {
    var $backToTopTxt = "", $backToTopEle = $('<div class="gotop"></div>').appendTo($("body"))
        .text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
            $("html, body").animate({ scrollTop: 0 }, 1000);
        }), $backToTopFun = function() {
        var st = $(document).scrollTop(), winh = $(window).height();
        (st > 0)? $backToTopEle.fadeIn(): $backToTopEle.fadeOut();
        if (!window.XMLHttpRequest) {
            $backToTopEle.css("top", st + winh - 166);
        }
    };
    $(window).bind("scroll", $backToTopFun);
    $(function() { $backToTopFun(); });
});
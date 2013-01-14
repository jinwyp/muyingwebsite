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


//商品列表鼠标mouseover效果背景变化
jQuery(function(){
$(".goods_list dl:nth-child(4n)").css({margin:"10px 0 0 10px"});
$(".goods_list dl").hover(function(){
    $(".goods_list dl").removeClass("hover");
    $(this).addClass("hover");
});
});


//列表价格排序切换
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


//筛选展开收起按钮
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

// 切换排列方式, 列表还是图片展示
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




//滚动上部购物车栏会固定到顶部,方便查看购物车
function readyScroll(){
    var floatMain = $("#j-shopcar"),
        Top = floatMain.position().top,
        fw = floatMain.width(),
        floatStyle = false,
        isIE6 = $.browser.msie&&($.browser.version == "6.0")&&!$.support.style;
    if($(document).scrollTop()>Top){
        if(!isIE6){
            floatMain.css({
                position:"fixed",
                "margin-left":"-"+fw/2+"px",
                top:0,
                left:"50%",
                "z-index":"9999"
            });
        } else {
            $("<style type='text/css' id='ie6style'>#floatPic{margin:0;padding:0;z-index:99}#floatPic img{margin: 0;padding: 0;display: block;}*html,body{background-image:url(about:blank);background-attachment:fixed}.fixed-top{position:absolute;top:expression(eval(document.documentElement.scrollTop))}</style>").appendTo("head");
            floatMain.addClass("fixed-top").css({
                "margin-left":"-"+fw/2+"px",
                left:"50%",
                "z-index":"9999"
            });
        }
    }

    $(window).scroll(function(){
        if($(document).scrollTop()>Top){
            if(floatStyle==true){return false}
            if(!isIE6){
                floatMain.css({
                    position:"fixed",
                    "margin-left":"-"+fw/2+"px",
                    top:0,
                    left:"50%",
                    "z-index":"9999"
                });
            } else {
                floatMain.addClass("fixed-top").css({
                    "margin-left":"-"+fw/2+"px",
                    left:"50%",
                    "z-index":"9999"
                });
            }
            floatStyle = true;
        }else{
            floatMain.removeAttr("style");
            if(isIE6){floatMain.removeClass("fixed-top")}
            floatStyle = false
        }
    });

}


//列表页面点击购物车效果
$(document).ready(function () {
    readyScroll();
    $(".btn_m_o").each(function(){
        var $this = $(this);
        $this.click(function(){
            var pr = $this.parents("dl").css("position","relative");
            var clone = pr.find("a:eq(0)").clone();
            var position = $("#saleQty").offset();
            var bezier_params = {
                start: {
                    x: 0,
                    y: 10,
                    angle: -120
                },
                end: {
                    x:position.left - pr.position().left,
                    y:position.top - pr.position().top,
                    angle: 180,
                    length: 0.2
                }
            };
            if($this.attr("data-tip")=="nomore"){
                var tip = $("<a>你不能再购买该商品了</a>").css({
                    position:"absolute",
                    display:"block",
                    background:"#ffedb5",
                    width:"100%",
                    padding:"2px",
                    "text-align":"center",
                    border:"1px solid #ff9900",
                    top:-40,
                    color:"#e60000",
                    opacity:1,
                    "z-index":0
                }).appendTo(pr).animate({top:190},300,function(){
                        $this.unbind("click");
                        setTimeout(function(){
                           tip.fadeOut()
                        },1000)
                    });
                return false
            }
            clone.css({position:"absolute"}).appendTo(pr);
            if(!clone.is(":animated")){
                clone.animate({
                    path : new $.path.bezier(bezier_params),
                    width:"0px",
                    height:"0px",
                    opacity:"0.6"
                },600,function(){
                    var sq = $("#saleQty");
                    var p = parseInt(sq.text());
                    p += 1;
                    sq.animate({"margin-top":"20px",opacity:"0"},200,function(){
                        sq.animate({"margin-top":"-20px"},25,function(){
                            sq.animate({"margin-top":0,opacity:1},250,function(){
                                sq.text(p)
                            })
                        });
                    });

                    clone.remove();
                })
            }
            return false
        })
    })
});


//购物车下拉，添加延迟处理
(function(){
    var showing,shown,closing;
    $(".shopcart").hover(function(){
        if(closing)clearTimeout(closing);
        showing = setTimeout(function(){
            if(!shown)
                $("#cartList").stop().slideDown(200,function(){
                    shown = true;
                })
        },150);
    },function(){
        if(showing){
            clearTimeout(showing);
        }
        if(shown){
            closing = setTimeout(function(){
                $("#cartList").slideUp(200,function(){
                    shown = false
                })
            },300)
        }
    })
})()

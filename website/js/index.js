var Banner = function () {
    var Up = function () {
        jQuery("#banner").slideUp(1500);
        jQuery("#close").css("background", "url(http://img.muyingzhijia.com/images/close-open.png) no-repeat");
    }
    //setTimeout(Up, 5000);
    jQuery("#close").click(function () {
        jQuery("#banner").slideToggle(600, function () {
            if (jQuery("#banner").css("display") == "none") {
                jQuery("#close").css("background", "url(http://img.muyingzhijia.com/images/close-open.png) no-repeat");
            }
            else {
                jQuery("#close").css("background", "none");
            }
        });
    });
}
//顶部伸展广告
var BannerTwo = function () {
    if (jQuery("#js_ads_banner_top_slide").length) {
        var jQueryslidebannertop = jQuery("#js_ads_banner_top_slide"), jQuerybannertop = jQuery("#js_ads_banner_top");
        setTimeout(function () {
            jQuerybannertop.slideUp(1000);
            jQueryslidebannertop.slideDown(1000);

        }, 2500);
        setTimeout(function () {
            jQueryslidebannertop.slideUp(1000, function () {
                jQuerybannertop.slideDown(1000);
            });
        }, 6000);
    }
}
var subItem_hover = function () {
    $(".item").hover(function () {
        $(this).children(".subitem").show();
        $(this).addClass("curr");
    }, function () {
        $(this).children(".subitem").hide();
        $(this).removeClass("curr");
    });
    //	$(".item").hover(function () {
    //		$(this).children(".subitem").show();
    //		$(this).children(".subNavs").addClass("curr");
    //	}, function () {
    //		$(this).children(".subitem").hide();
    //		$(this).children(".subNavs").removeClass("curr");
    //	});
    $('#brand-list-1s').bxCarousel({

        display_num: 2,

        move: 2,

        auto: true,

        controls: false,

        margin: 0,

        auto_hover: true

    });
}
var hover_ShopCart = function () {
    var handle = null;
    jQuery("#wfc_head_gwc_div").mouseover(function () {
        clearTimeout(handle);
        if (jQuery("#wfc_head_gwc_div").is(":hidden")) {
            jQuery("#wfc_head_gwc_div").css("display", "block");
        }
    }).mouseout(function () {
        jQuery("#wfc_head_gwc_div").css("display", "none");
    });
    jQuery("#wfc_gwc_eleG").mouseover(function () {

        //trigergetshoppingcart();
        jQuery("#wfc_head_gwc_div").css("display", "block");

    }).mouseout(function () { handle = setTimeout(function () { jQuery("#wfc_head_gwc_div").css("display", "none"); }, 2000); });
}
var hover_search_quick_item_Fun = function () {
    $(".search-quick").hover(function () {
        $("#search-quick-item").show();
        $("#search-quick-item").hover(function () { $(this).show(); }, function () { $(this).hide(); });
    }, function () {
        $("#search-quick-item").hide();
    });
}
var tag_select_Fun = function () {
    $("#search-quick-item span.select_span").click(function (event) {
        var index_cur = $("#search-quick-item span.select_span").index(this);
        var style_cs = $("#search-quick-item #sub" + index_cur).attr("style");
        //alert(style_cs +":"+ "display: block");
        $("#search-quick-item ul.sub").hide();
        style_cs = style_cs == "display: block" ? $("#search-quick-item #sub" + index_cur).attr("style", "display: none") : $("#search-quick-item #sub" + index_cur).attr("style", "display: block");
        //(event || window.event).cancelBubble = true;

        //鼠标划过
        $("#search-quick-item #sub" + index_cur + " li").mouseover(function () {
            this.className = "hover";
        });
        //鼠标离开
        $("#search-quick-item #sub" + index_cur + " li").mouseout(function () {
            this.className = "";
        });
        //鼠标点击
        $("#search-quick-item #sub" + index_cur + " li").click(function () {
            $("#search-quick-item span.select_span").eq(index_cur).html(this.innerHTML);
            $("#search-quick-item ul.sub").hide();
        });
    });

    $("#search-quick-item ul.sub").hide();


//        $(document).click(function () {
//            $("#search-quick-item ul.sub").hide();
//        });

}
//#region 时间段事件
var time_priod_a_Hover = function () {
    $(".main_one_ping #time_priod a").hover(function () {
        $(".main_one_ping #time_priod a").removeClass("hover");
        $(this).addClass("hover");
    });
}
//#endregion

//#region 新闻滚动
var News_scroll = function () {
    var box = document.getElementById("div1"), can = true;
    box.innerHTML += box.innerHTML;
    box.onmouseover = function () { can = false };
    box.onmouseout = function () { can = true };
    new function () {
        var stop = box.scrollTop % 18 == 0 && !can;
        if (!stop) box.scrollTop == parseInt(box.scrollHeight / 2) ? box.scrollTop = 0 : box.scrollTop++;
        setTimeout(arguments.callee, box.scrollTop % 18 ? 10 : 1500);
    };
}
//#endregion

//#region 天天特价时间
var Every_Day_Timer = function () {
    //var SysSecond1 = parseInt(jQuery("#esTimes1").val());
    var SysSecond1 = parseInt(32229);
    var InterValObj1 = window.setInterval(SetRemainTime1, 1000);
    function SetRemainTime1() {
        if (SysSecond1 > 0) {
            SysSecond1 = SysSecond1 - 1;
            var hour1 = Math.floor(SysSecond1 / (60 * 60));
            var minite1 = Math.floor(SysSecond1 / 60) - (hour1 * 60);
            var second1 = Math.floor(SysSecond1) - (hour1 * 60 * 60) - (minite1 * 60);
            jQuery("#TimesHour1").text(hour1 < 10 ? "0" + hour1 : hour1);
            jQuery("#TimesMinte1").text(minite1 < 10 ? "0" + minite1 : minite1);
            jQuery("#TimesSecond1").text(second1 < 10 ? "0" + second1 : second1);
        } else {
            window.clearInterval(InterValObj1);
        }
    }
}
//#endregion

$(document).ready(function (e) {
    Banner();
    BannerTwo();
    subItem_hover();
    hover_ShopCart();
    hover_search_quick_item_Fun();
    tag_select_Fun();
    time_priod_a_Hover();
    News_scroll();
    Every_Day_Timer();
});

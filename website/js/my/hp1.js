function cur(ele, currentClass, tag) {
    ele = $(ele) ? $(ele) : ele;
    if (!tag) {
        ele.addClass(currentClass).siblings().removeClass(currentClass);
    } else {
        ele.addClass(currentClass).siblings(tag).removeClass(currentClass);
    }
}
$.fn.tab = function(options) {
    var org = {
        tabId: "",
        tabTag: "",
        conId: "",
        conTag: "",
        curClass: "cur",
        act: "click",
        dft: 0,
        effact: null,
        auto: false,
        TwoF: true, //���Ƶڶ����ƿ�2����ֵ��ص�һ��
        autotime: 8000,
        aniSpeed: 500
    }

    $.extend(org, options);

    var t = false;
    var k = 0;
    var _this = $(this);
    var tagwrp = $(org.tabId);
    var conwrp = $(org.conId);
    var tag = tagwrp.find(org.tabTag);
    var con = conwrp.find(org.conTag);
    var len = tag.length;
    var taght = parseInt(tagwrp.css("height"));
    var conwh = conwrp.get(0).offsetWidth;
    var conht = conwrp.get(0).offsetHeight;
    var curtag = tag.eq(org.dft);
    //prepare
    cur(curtag, org.curClass);
    con.eq(org.dft).show().siblings(org.conTag).hide();

    if (org.effact == "scrollx") {
        var padding = parseInt(con.css("padding-left")) + parseInt(con.css("padding-right"));
        _this.css({
            "position": "relative",
            "height": taght + conht + "px",
            "overflow": "hidden"
        });

        conwrp.css({
            "width": len * conwh + "px",
            "height": conht + "px",
            "position": "absolute",
            "top": taght + "px"
        });

        con.css({
            "float": "left",
            "width": conwh - padding + "px",
            "display": "block"
        });
    }

    if (org.effact == "scrolly") {
        var padding = parseInt(con.css("padding-top")) + parseInt(con.css("padding-bottom"));
        _this.css({
            "position": "relative",
            "height": taght + conht + "px",
            "overflow": "hidden"
        });
        tagwrp.css({
            "z-index": 100
        })
        conwrp.css({
            "width": "100%",
            "height": len * conht + "px",
            "position": "absolute",
            "z-index": 99
        })
        con.css({
            "height": conht - padding + "px",
            "float": "none",
            "display": "block"
        });
    }

    tag.css({ "cursor": "pointer" })
	    .each(function(i) {
	        tag.eq(i).bind(org.act, function() {
	            cur(this, org.curClass);
	            k = i;
	            switch (org.effact) {
	                case "slow": con.eq(i).show("slow").siblings(org.conTag).hide("slow");
	                    break;
	                case "fast": con.eq(i).show("fast").siblings(org.conTag).hide("fast");
	                    break;
	                case "scrollx": conwrp.animate({ left: -i * conwh + "px" }, org.aniSpeed);
	                    break;
	                case "scrolly": conwrp.animate({ top: -i * conht + taght + "px" }, org.aniSpeed);
	                    break;
	                default: con.eq(i).show().siblings(org.conTag).hide();
	                    break;
	                //End of switch                                                           
	            }
	        }
			)
	    })
    var auTim = org.autotime;
    if (org.auto) {
        var drive = function() {
            if (org.act == "mouseover") {
                tag.eq(k).mouseover();
            } else if (org.act == "click") {
                tag.eq(k).click();
            }
            k++;
            if (k == 0) {
                //alert(k);
                auTim = 3000;
                //alert(auTim);
            } else {
                auTim = 8000;
            }
            //alert(org.autotime);
            if (k == len) k = 0;

        }
        //alert(auTim);
        t = setInterval(drive, auTim);
    }

    if (org.TwoF) {

        var driveTwo = function() {
            if (org.act == "mouseover") {
                tag.eq(0).mouseover();
            } else if (org.act == "click") {
                tag.eq(0).click();
            }
        }
        tag.eq(1).hover(function() {
            clearInterval(t);
        }, function() {
            t = setInterval(driveTwo, 2000);
        });
        $(org.conId).find("div").eq(1).hover(function() {
            clearInterval(t);
        }, function() {
            t = setInterval(driveTwo, 2000);
        });
    }

    //End of $.fn.tab	
}
//Drive



var defaultOpts = { interval: 5000, fadeInTime: 300, fadeOutTime: 200 };
//Iterate over the current set of matched elements
	var _titles = $("ul.slide-txt li");
	var _titles_bg = $("ul.op li");
	var _bodies = $("ul.slide-pic li");
	var _count = _titles.length;
	var _current = 0;
	var _intervalID = null;
	var stop = function() { window.clearInterval(_intervalID); };
	var slide = function(opts) {
		if (opts) {
			_current = opts.current || 0;
		} else {
			_current = (_current >= (_count - 1)) ? 0 : (++_current);
		};
		_bodies.filter(":visible").fadeOut(defaultOpts.fadeOutTime, function() {
			_bodies.eq(_current).fadeIn(defaultOpts.fadeInTime);
			_bodies.removeClass("cur").eq(_current).addClass("cur");
		});
		_titles.removeClass("cur").eq(_current).addClass("cur");
		_titles_bg.removeClass("cur").eq(_current).addClass("cur");
	}; //endof slide
	var go = function() {
		stop();
		_intervalID = window.setInterval(function() { slide(); }, defaultOpts.interval);
	}; //endof go
	var itemMouseOver = function(target, items) {
		stop();
		var i = $.inArray(target, items);
		slide({ current: i });
	}; //endof itemMouseOver
	_titles.hover(function() { if($(this).attr('class')!='cur'){itemMouseOver(this, _titles); }else{stop();}}, go);
	//_titles_bg.hover(function() { itemMouseOver(this, _titles_bg); }, go);
	_bodies.hover(stop, go);
	//trigger the slidebox
	go();
	
	
	
var slideTxt={
	thisBox:$('.Promotions .pbox'),
	btnLeft:$('.Promotions a.left'),
	btnRight:$('.Promotions a.right'),
	thisEle:$('.Promotions .pbox ul'),
	init:function(){
		slideTxt.thisBox.width(slideTxt.thisEle.length*680);
		slideTxt.slideAuto();
		slideTxt.btnLeft.click(slideTxt.slideLeft).hover(slideTxt.slideStop,slideTxt.slideAuto);
		slideTxt.btnRight.click(slideTxt.slideRight).hover(slideTxt.slideStop,slideTxt.slideAuto);
		slideTxt.thisBox.hover(slideTxt.slideStop,slideTxt.slideAuto);
		},
	slideLeft:function(){
		slideTxt.btnLeft.unbind('click',slideTxt.slideLeft);
		slideTxt.thisBox.find('ul:last').prependTo(slideTxt.thisBox);
		slideTxt.thisBox.css('marginLeft',-680);
		slideTxt.thisBox.animate({'marginLeft':0},350,function(){
			slideTxt.btnLeft.bind('click',slideTxt.slideLeft);
			});
		return false;
		},
	slideRight:function(){
		slideTxt.btnRight.unbind('click',slideTxt.slideRight);
		slideTxt.thisBox.animate({'marginLeft':-680},350,function(){
			slideTxt.thisBox.css('marginLeft','0');
			slideTxt.thisBox.find('ul:first').appendTo(slideTxt.thisBox);
			slideTxt.btnRight.bind('click',slideTxt.slideRight);
			});
		return false;
		},
	slideAuto:function(){
		slideTxt.intervalId=window.setInterval(slideTxt.slideRight,5000);
		},
	slideStop:function(){
		window.clearInterval(slideTxt.intervalId);
		}
	}
$(function(){
	slideTxt.init();
});

//gotop
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



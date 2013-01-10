
//jQuery 邮箱地址下拉部分插件
(function($){
    $.fn.selectView = function(options){
        var elist = ($("ul.sliderBox").length>0)?$("ul.sliderBox"):$('<ul class="sliderBox"><li class="seleceted">@163.com</li><li>@sina.com</li><li>@qq.com</li><li>@gmail.com</li><li>@126.com</li><li>@vip.sina.com</li><li>@sina.cn</li><li>@hotmail.com</li><li>@sohu.com</li><li>@yahoo.cn</li><li>@139.com</li><li>@wo.com.cn</li><li>@189.cn</li><li>@21cn.com</li></ul>').appendTo("body");
        var defaults = {
            valuer:options?(options.valuer||$(this)):$(this),//指定input
            oo:options?(options.oo||elist):(elist)//邮箱地址列表
        };
        var opts = $.extend({},defaults ,options);
        var obj = opts.oo.children("li:eq(0)");
        var oo = opts.oo;
        var valuer = opts.valuer;
        var PrintVal = function (v){
            if(oo.is(":hidden")){return false}
            valuer.val(v);
            oo.hide();
        };
        var SwitchTo = function (targ){
            obj.removeClass("seleceted");
            obj = targ;
            obj.addClass("seleceted");
        };

        return opts.valuer.each(function(){
            //鼠标选择
            var _ = $(this);
            oo.click(function(event){
                SwitchTo($(event.target));
                PrintVal(obj.text());
                _.blur();
                if(_.parents("li").next().find("input").length>0)
                    _.parents("li").next().find("input").focus();
                return false
            });

            //焦点事件
            _.focus(function(){
                oo.css({
                    left:_.offset().left,
                    top:_.offset().top+_.outerHeight(),
                    width:_.outerWidth()-2
                });
            });

            $(document).click(function(){
                oo.hide()
            });

            //监听键盘事件
            _.keyup(function(e){
                e.stopPropagation();
                e.preventDefault();
                var v = $(this).val();
                var m = v.split("@")[1]||"";
                var r = [];
                if(v==""){return false}
                //判断邮箱地址是否输入完成
                if(m.indexOf(".com")>-1||m.indexOf(".cn")>-1||m.indexOf(".net")>-1){
                    oo.hide();
                }else{
                    oo.show()
                }

                $("li",oo).each(function(){
                    if($("span",this).length<1){
                        $("<span></span>").insertBefore(this.childNodes[0]);
                    }
                    $("span",this)[0].innerHTML = v.split("@")[0];
                    //简单匹配
                    var M = this.innerHTML.split("@")[1];
                    if(M.indexOf(m)>-1 && m!==""){
                        r.push(this)
                    }
                });

                switch (e.which){
                    case 40:
                        if(obj.next().length==0||obj.prev().length==0){
                            SwitchTo(obj.siblings().eq(0))
                        }else{
                            SwitchTo(obj.next())
                        }
                        break;
                    case 38:
                        if(obj.next().length==0||obj.prev().length==0){
                            SwitchTo(obj.siblings().last())
                        }else{
                            SwitchTo(obj.prev())
                        }
                        break;
                    case 13:
                        PrintVal(obj.text());
                        if(_.parents("li").next().find("input").length>0)
                            _.parents("li").next().find("input").focus();
                        break;
                    default:
                        SwitchTo(($(r[0]).length==0)?obj:$(r[0]))
                }
            });
        })
    };
})(jQuery);
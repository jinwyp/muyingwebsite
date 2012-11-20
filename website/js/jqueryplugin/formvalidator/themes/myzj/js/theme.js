//提示层的HTML
var onShowHtml = '';
var onFocusHtml = '';
var onErrorHtml = '<P class="noticeWrap noticeWrap-err"><B class="ico-warning"></B><SPAN class=txt-err>$data$</SPAN></P>';
var onCorrectHtml = '<P class="noticeWrap noticeWrap-suc"><B class="ico-succ"></B><SPAN class=txt-succ>$data$</SPAN></P>';

//文本框的样式
var onShowClass = "g-ipt";
var onFocusClass = "g-ipt-active";
var onErrorClass = "g-ipt-err";
var onCorrectClass = "g-ipt-cor";

//固定提示层的HTML
var onMouseOnFixTextHtml = '<DIV class="txt-info-mouseon">$data$</DIV>';
var onMouseOutFixTextHtml = '<DIV class="txt-info-mouseout">$data$</DIV>';

//初始状态，加其它几种状态
var passwordStrengthStatusHtml = '<div id="passStrong" class="pswState"><div id="progress" class="style_ps2"></div><em class="style_ps0">弱</em><em>中</em><em>强</em></div>';
var showLev = function (lev) {
    var Lv = lev<=0?1:lev;
    var progress = $("#progress");
    var ems = $("#passStrong em:eq(1)");
    if (progress.is(":animated")) {
        return false
    }

    if(Lv==3){
        ems.addClass("style_ps2");
        progress.attr("class","style_ps3")
    }
    if(Lv<2){
        ems.removeClass();
        progress.attr("class","style_ps2")
    }
    progress.animate({width:Lv * 61}, 250,function(){
        if(Lv>=2){
            ems.addClass("style_ps2")
        }else{
            ems.removeClass()
        }
    });

    //console.log(progress)
};
var passwordStrengthText = ['密码强度：弱', '密码强度：中', '密码强度：中', '密码强度：强'];
//密码强度校验规则(flag=1(数字)+2(小写)+4(大写)+8(特殊字符)的组合，value里的0表示跟密码一样长,1表示起码1个长度)
var passwordStrengthRule = [
    {level:1, rule:[
        {flag:1, value:[0]},
        //数字
        {flag:2, value:[0]},
        //小写字符
        {flag:4, value:[0]}            //大写字符
    ]
    },
    {level:2, rule:[
        {flag:8, value:[0]},
        //特符
        {flag:9, value:[1, 1]},
        //数字(>=1)+特符>=1)
        {flag:10, value:[1, 1]},
        //小写(>=1)+特符>=1)
        {flag:12, value:[1, 1]},
        //大写(>=1)+特符>=1)
        {flag:3, value:[1, 1]},
        //数字(>=1)+小写(>=1)
        {flag:5, value:[1, 1]},
        //数字(>=1)+大写(>=1)
        {flag:6, value:[1, 1]}            //小写(>=1)+大写(>=1)
    ]
    },
    {level:3, rule:[
        {flag:11, value:[1, 1, 1]},
        //数字(>=1)+小写(>=1)+特符(>=1)
        {flag:13, value:[1, 1, 1]},
        //数字(>=1)+大写(>=1)+特符(>=1)
        {flag:14, value:[1, 1, 1]},
        //小写(>=1)+大写(>=1)+特符(>=1)
        {flag:7, value:[1, 1, 1]}    //数字(>=1)+小写(>=1)+大写(>=1)
    ]
    }
];
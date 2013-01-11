/**
 * Created with JetBrains WebStorm.
 * User: Janker Zhang
 * Date: 13-01-08
 * Time: 下午2:16
 * Dialog 对话框组件
 */
 function Dialog(options){
     this.showclose = options.showclose;//是否显示关闭按钮
     this._class = !!options._class?options._class:"";//弹出框样式class 参见dialog.css
     this.png_fix = !!options.png_fix;//是否加png半透明边框
     this.title = !!options.title?options.title:"";//标题
     this.useAjax = !!options.useAjax;//是否启用ajax
     this.HTML = !!options.HTML?options.HTML:"";//加载HTML或者加载html模板
     this.closeEvent = !!options.closeEvent?options.closeEvent:undefined;//关闭对话框里的事件，无阻断
     this.showEvent = !!options.showEvent?options.showEvent:undefined;//对话框显示后触发的事件

     if(!$("#dialog").length){
         $("<div id='dialog'><div class='dialog-content'><div class='title'>"+this.title+"<a href='#' class='close'></a></div><div class='gost-content'></div></div></div>").appendTo("body")
     }

     if(!$("#cover-bg").length){
         var cover = $("<div id='cover-bg'></div>")
             .css({width:$(window).width(), height:$(document).height(), opacity:0.6, "z-index":"998", position:"absolute", background:"#333", top:0, left:0})
             .appendTo("body")
     }

     var $this = $("#dialog").addClass(this._class), _this = this;

     function init(){
         var content = $this.find(".dialog-content"),
             topcon = $('<div class="top-wrap"><div class="pngfix ctl"></div><div class="pngfix fixwidth ctm"></div><div class="pngfix ctr"></div></div>'),
             btncon = $('<div class="btm-wrap"><div class="pngfix cbl"></div><div class="pngfix fixwidth cbm"></div><div class="pngfix cbr"></div></div>');
         content.wrap('div.con-wrap').before(topcon).after(btncon);
         content.append('<div class="pngfix fixheight cml"></div><div class="pngfix fixheight cmr"></div>');
         var cw = content.width(), clw = $this.find('.ctl').width(), crw = $this.find('.ctr').width(), dw = $this.width(cw+clw+crw);
         content.css("margin-left",clw);
         content.find(".cml").css("left",-clw);
         content.find(".cmr").css("right",-clw);
         $this.find(".fixwidth").width(cw);
         $this.css("margin-left",-dw.width()/2);

         if(_this.HTML){
             if(_this.useAjax){
                 $.ajax({
                     url:_this.HTML,
                     dataType:"html",
                     success:function(data){
                         $this.find(".gost-content").html(data)
                     },
                     complete:function(){
                         if(!!_this.showEvent){
                             _this.showEvent()
                         }
                         toMiddle()
                     },
                     fail:function(){
                         $this.find(".gost-content").text("对不起，出错了")
                     }
                 })
             }else{
                 $this.find(".gost-content").html(_this.HTML);
                 toMiddle();
                 if(!!_this.showEvent){
                     _this.showEvent()
                 }
             }
         }
         //针对IE6
         if($.browser.msie&&($.browser.version=="6.0")&&!$.support.style){
             var reset = function(){
                 var ch = content.height();
                 $this.find(".fixheight").height(ch);
                 toMiddle()
             };
             reset();
             content.delegate([],"click",reset);
         }
         if(_this.png_fix){
             $this.find(".pngfix").pngfix()
         }
         if(_this.showclose===false){
             $this.find(".close").remove()
         }

         if(!_this.title){
             $this.find(".title").remove()
         }
     }

     function thisClose(){
         $this.slideUp(200,function(){$this.remove()});
         cover.fadeOut(300,function(){cover.remove()});
     }

     function toMiddle(){
         return $this.animate({top:($(window).height()-$this.height())/2},200);
     }

     $this.find(".close").click(function(){
         if(!!_this.closeEvent){_this.closeEvent()}
         thisClose();
         return false
     });

     init();

     return {
         close : thisClose
     }
 }

 //png透明插件,支持png背景和png文件
 (function($){
     $.fn.pngfix = function(options) {
         var defualts = {scale:"scale"/*scale拉伸；nocrop不拉伸*/,tranceImg:"images/trance.gif",ie6:($.browser.msie&&($.browser.version=="6.0")&&!$.support.style)},opts = $.extend({}, defualts, options);
         if(!opts.ie6){return}
         $.each($(this),function(){
             var oo = $(this),ow=oo.width(),oh=oo.height(),png=(oo[0].nodeName==="IMG")?oo.attr("src"):oo.css("background-image").split('("')[1].split('")')[0];
             if(oo[0].nodeName==="IMG"){oo.attr("src",opts.tranceImg).width(ow).height(oh).css({background:'none',filter:'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+png+'",sizingMethod="'+opts.scale+'")'});}
             else{oo.css({background:'none',position:'relative',cursor:function(){return (oo[0].nodeName==="A")?'pointer':'default'}});
                 var odiv = $("<span></span>").prependTo(oo).css({background:'none',filter:'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+png+'",sizingMethod="'+opts.scale+'")',width:ow,height:oh,position:'absolute',left:0,top:0})
             }
         })
     }
 })(jQuery);
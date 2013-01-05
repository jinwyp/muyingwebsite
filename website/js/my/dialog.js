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

 //dialog
 function Dialog(options){
     this.showclose = !!options.showclose;
     this._class = !!options._class?options._class:"";
     this.png_fix = !!options.png_fix;
     this.title = !!options.title?options.title:"";
     this.trancebord = !!options.trancebord;
     this.HTML = !!options.HTML?options.HTML:"";

     if(!$("#dialog").length){
         $("<div id='dialog'><div class='dialog-content'><div class='title'>"+this.title+"<a href='#' class='close'></a></div><div class='gost-content'></div></div></div>").appendTo("body")
     }

     if(!$("#cover-bg").length){
         var cover = $("<div id='cover-bg'></div>").css({
             width:$(window).width(),
             height:$(document).height(),
             opacity:0.6,
             "z-index":"998",
             position:"absolute",
             background:"#333333",
             top:0,
             left:0
         }).appendTo("body")
     }

     var $this = $("#dialog").addClass(this._class),
         content = $this.find(".dialog-content"),
         topcon = $('<div class="top-wrap"><div class="pngfix ctl"></div><div class="pngfix fixwidth ctm"></div><div class="pngfix ctr"></div></div>'),
         btncon = $('<div class="btm-wrap"><div class="pngfix cbl"></div><div class="pngfix fixwidth cbm"></div><div class="pngfix cbr"></div></div>');
     content.wrap('div.con-wrap').before(topcon).after(btncon);
     content.before('<div class="pngfix fixheight cml"></div>').after('<div class="pngfix fixheight cmr"></div>');

     if(!this.showclose){
         $this.find(".close").remove()
     }

     if(!this.title){
         $this.find(".title").remove()
     }

     if(this.png_fix){
         $this.find(".pngfix").pngfix()
     }

     if(this.trancebord){
         $this.find(".pngfix").css("opacity",0.5)
     }

     if(this.HTML){
         $this.find(".gost-content").html(this.HTML)
     }

     var cw = content.width(),
         ch = content.height(),
         clw = $this.find('.ctl').width(),
         crw = $this.find('.ctr').width(),
         dw = $this.width(clw+cw+crw),
         dh = $this.height();

     $this.find(".fixwidth").width(cw);
     $this.find(".fixheight").height(ch);
     $this.css({
         "margin-left":-dw.width()/2,
         top:($(window).height()-dh)/2-50
     });

     $this.find(".close").click(function(){
         $this.hide();
         cover.hide();
         return false
     });




     $this.find("#btn").click(function(){
         $this.animate({top:0},250,function(){$this.hide()});
     });

     return $this
 }


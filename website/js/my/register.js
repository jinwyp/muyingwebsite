/**
 * Created with JetBrains WebStorm.
 * User: Janker Zhang
 * Date: 12-10-18
 * Time: 下午2:16
 * To change this template use File | Settings | File Templates.
 */
//注册页面 校验
$(function(){
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"form",
        onError:function(msg){alert(msg);},
        submitAfterAjaxPrompt : '数据正在验证，请稍等...'
    });
    /*$("#us")
        .formValidator({
            onShowFixText:"6~12个字符，包括英文、数字、下划线",
            onShowText:"请填入用户名",
            onShow:"请填入用户名",
            onCorrect:"该用户名可以注册"
        })
        .inputValidator({
            min:6,
            max:12,
            onError:"用户名长度不正确,请重新填写"
        })
        .regexValidator({
            regExp:"username",
            dataType:"enum",
            onError:"用户名格式不正确"
        });
    .ajaxValidator({
     dataType : "json",
     async : true,
     url : "http://www.fbair.net/ci/index.php/api/restful_user/user/id/23",
     success : function(data){
     if( data.username );
     return "该用户名已被使用，请更换用户名";
     },
     buttons: $("#button"),
     error: function(jqXHR, textStatus, errorThrown){
     alert("服务器没有返回数据，可能服务器忙，请重试"+errorThrown);
     },
     onError : "该用户名已被使用，请更换用户名",
     onWait : "正在进行校验，请稍候..."
     });*/
    $("#email")
        .formValidator({
            onShowFixText:"请填入常用的邮箱，用来找回密码，接受通知等信息",
            onShow:"请填入常用的邮箱",
            onFocus:"请填入常用的邮箱",
            onCorrect:true
        })
        .inputValidator({
            min:3,max:100,onError:"您输入的邮箱长度不正确"
        })
        .regexValidator({
            regExp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$"
            ,onError:"您输入的邮箱格式不正确"
        });
    $("#password1")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请填入密码",
            onFocus:"请填入密码",
            onCorrect:"密码合法"
        })
        .inputValidator({
            min:6,max:20,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"密码两边不能有空符号"},
            onError:"密码长度限制为6-20位字符"
        })
        .passwordValidator({
            compareID:"us"
        });
    $("#password2")
        .formValidator({
            onShowFixText:"请再次输入密码保证与您设置的密码相同",
            onShow:"请再次填入密码",
            onFocus:"至少1个字符长度",
            onCorrect:true
        })
        .inputValidator({
            min:1,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"重复密码两边不能有空符号"},
            onError:"重复密码不能为空"
        })
        .compareValidator({
            desID:"password1",
            operateor:"=",
            onError:"您两次填入密码不一致"
        });
    $("#reg-form input:radio[name='baby']")
        .formValidator({
            relativeID:"",
            tipID:"babyTip",
            tipCss :{"left":"60px"},
            onShow:"",
            onFocus:"",
            onCorrect:true,
            defaultValue:["0"]
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择是否有宝宝"
        });
    $("#code")
        .formValidator({
            onShowFixText:"请填入右侧图片中的验证码",
            onShow:"请填入右侧图片中的验证码",
            onFocus:"请填入右侧图片中的验证码",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:4,
            onError:"填入的验证码不正确"
        });
    $("#agreement")
        .formValidator({
            onShowFixText:"",
            onShow:"你还没有同意用户协议",
            onFocus:"",
            onCorrect:true
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"你还没有同意用户协议"
        });
    if($("#email").length)
    $("#email").selectView();



//第三方登录注册页面
    /*$("#third-us")
     .formValidator({
     onShowFixText:"6~12个字符，包括字母、数字、下划线，以字母开头，字母或数字结尾",
     onShowText:"请输入用户名",
     onShow:"请输入用户名,只有输入\"maodong\"才是对的",
     onCorrect:"该用户名可以注册"
     })
     .inputValidator({
     min:6,
     max:12,
     onError:"你输入的用户长度不正确,请确认"
     })
     .regexValidator({
     regExp:"username",
     dataType:"enum",
     onError:"用户名格式不正确"
     });
     .ajaxValidator({
     dataType : "json",
     async : true,
     url : "http://www.fbair.net/ci/index.php/api/restful_user/user/id/23",
     success : function(data){
     if( data.username );
     return "该用户名不可用，请更换用户名";
     },
     buttons: $("#button"),
     error: function(jqXHR, textStatus, errorThrown){
     alert("服务器没有返回数据，可能服务器忙，请重试"+errorThrown);
     },
     onError : "该用户名不可用，请更换用户名",
     onWait : "正在进行校验，请稍候..."
     });*/
    $("#third-email")
        .formValidator({
            onShowFixText:"请填入常用的邮箱，用来找回密码，接受通知等信息",
            onShow:"请填入常用的邮箱",
            onFocus:"请填入常用的邮箱",
            onCorrect:true
        })
        .inputValidator({
            min:6,max:100,onError:"您输入的邮箱不正确"
        })
        .regexValidator({
            regExp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$"
            ,onError:"您输入的邮箱格式不正确"
        });
    $("#third-password1")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请输入密码",onFocus:"至少1个长度",onCorrect:"密码合法"
        })
        .inputValidator({
            min:6,max:20,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"密码两边不能有空符号"},
            onError:"密码长度为6-20位字符"
        })
        .passwordValidator({
            compareID:"third-us"
        });
    $("#third-password2")
        .formValidator({
            onShowFixText:"请再次输入密码保证与您设置的密码相同",
            onShow:"请再次填入密码",
            onFocus:"至少1个长度",
            onCorrect:true
        })
        .inputValidator({
            min:1,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"重复密码两边不能有空符号"},
            onError:"重复密码不能为空"
        })
        .compareValidator({
            desID:"third-password1",
            operateor:"=",
            onError:"您两次填入密码不一致"
        });
    $("#third-reg-form input:radio[name='baby']")
        .formValidator({
            relativeID:"",
            tipID:"third-babyTip",
            tipCss :{"left":"60px"},
            onShow:"",
            onFocus:"",
            onCorrect:true,
            defaultValue:[""]})
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择是否有宝宝"
        });
    if($("#third-email").length)
    $("#third-email").selectView();
});

//登录部分
$(function(){

    if($("#login-email").length)
    $("#login-email").selectView();
    $(".login-form input[class='txt']").each(function(){
        var $this = $(this);
        $this.focus(function(){
            $this.css({
                border:"1px solid #FF9900"
            });
            $this.keydown(function(){
                $this.css({
                    color:"#000"
                });
            })
        }).blur(function(){
                $this.css({
                    color:$this.val()==""?"#dedede":"#666666",
                    border:"1px solid #dedede"
                });
                if($this.siblings().length>0 && $this.val()!==""){
                    $(this).siblings().remove()
                }
            })
    });

    //表单提交
    function login_submit_check(){
        $("input[class='txt']","#login-form").each(function(){
            var $this = $(this);
            if($this.val()==""){
                if($this.siblings().length==0)
                    $this.after('<div class="onError" style="background: none repeat scroll 0% 0% transparent; display: block;"><p class="noticeWrap noticeWrap-err"><b class="ico-warning"></b><span class="txt-err">'+$this.attr("placeholder")+'</span></p></div>');
                $this.focus()
            }else{
                $this.siblings().remove();
            }
        });
        if($("#login-email").val()==""){
            $("#login-email").focus()
        }
    }

    $("#password").keydown(function(e){
        if(e.which==13){
            $("#login-btn").click()
        }
    });

    $("#login-btn").click(function(){
        login_submit_check();
        $("#login-form").submit();
    });


    //第三方支付
    $("#third-bind-link").click(function(){
        $("#third-bind-form").show()
    });

    //datepicker插件
    !!$("#birthday").length && $("#birthday" )
    .datepicker({
        inline: true,
        changeMonth:true,
        changeYear:true,
        dateFormat:"yy-mm-dd",
        yearRange:"c-5:c+2",
        showMonthAfterYear:true
    })
    .formValidator({
        onShowFixText:"请填写宝宝的预产期，格式为年-月-日",
        onCorrect:true
        })
    .inputValidator({
        regExp:"\\d{4}-\\d{2}-\\d{2}",
        min:10,max:10,onError:"请正确填写宝宝的预产期"
    });

    $("#mother-mobile")
    .formValidator({
        empty:true,
        onEmpty: "建议您留下手机号码，以便联系",
        onShowFixText:"请填写您的手机号码",
        onCorrect:true
    })
    .inputValidator({
        min:11,max:14,onError:"请正确填写您的手机号码"
    })
    .regexValidator({
        regExp:"mobile",
        dataType:"enum",
        onError:"你输入的手机号码格式不正确"
    });
    $("input:radio[name='pre-baby-rel']")
        .formValidator({
            empty:true,
            tipID:"pre-baby-relTip",
            defaultValue:[""],
            onCorrect:true,
            onEmpty:""
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择宝宝性别"
        });

    !!$("#birthday2").length && $("#birthday2" )
        .datepicker({
            inline: true,
            changeMonth:true,
            changeYear:true,
            dateFormat:"yy-mm-dd",
            yearRange:"c-5:c+2",
            showMonthAfterYear:true
        });
    $("#birthday2")
        .formValidator({
            onShowFixText:"请填写宝宝的生日，格式为年-月-日",
            onCorrect:true
        })
        .inputValidator({
            regExp:"\\d{4}-\\d{2}-\\d{2}",
            min:10,max:10,onError:"请按格式填写宝宝的生日"
        });

    $("#mother-mobile2")
        .formValidator({
            empty:true,
            onEmpty: "建议您留下手机号码，以便联系",
            onShowFixText:"请填写您的手机号码",
            onCorrect:true
        })
        .inputValidator({
            min:11,max:14,onError:"请正确填写您的手机号码"
        })
        .regexValidator({
            regExp:"mobile",
            dataType:"enum",
            onError:"你输入的手机号码格式不正确"
        });

    $("input:radio[name='baby-sex']")
        .formValidator({
            tipID:"baby-sexTip",
            defaultValue:[""],
            onCorrect:true,
            onEmpty:""
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择宝宝性别"
        });

    $("input:radio[name='baby-rel']")
        .formValidator({
            empty:true,
            tipID:"baby-relTip",
            defaultValue:[""],
            onCorrect:true,
            onEmpty:""
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择宝宝性别"
        });

    $("#add-baby a").click(function(){
        var i = $(".onemorebaby").length;
        if(i==1){
            $("#addbb").hide();
        }
        $("#addbb").before('<li class="onemorebaby"><label class="label">第'+(i==0?"二":"三")+'个宝宝的生日：</label><div class="inputCont"><input type="text" id="birthday2_'+i+'" name="birthday2_'+i+'" class="txt" placeholder="请填入宝宝生日" /><div id="birthday2_'+i+'Tip" class="stickTips"></div><div id="birthday2_'+i+'FixTip" class="floatTips"></div></div></li><li><label class="label">宝宝的性别：</label><div class="inputCont radioWrap"><div class="argWrap"><label><input type="radio" name="baby-sex_'+i+'" id="bb0-sex_'+i+'" value="0" />小王子</label><label><input type="radio" name="baby-sex_'+i+'" id="bb1-sex_'+i+'" value="1" />小公主</label></div><div id="baby-sex_'+i+'Tip" class="stickTips"></div><div class="floatTips"></div></div></li>');
        $("#birthday2_"+i)
            .datepicker({
                inline: true,
                changeMonth:true,
                changeYear:true,
                dateFormat:"yy-mm-dd",
                yearRange:"c-5:c+2",
                showMonthAfterYear:true
            })
            .formValidator({
                onShowFixText:"请填入宝宝的生日，格式为年-月-日",
                onCorrect:true
            })
            .inputValidator({
                regExp:"\\d{4}-\\d{2}-\\d{2}",
                min:10,max:10,onError:"请按格式填写宝宝的生日"
            });

        $("input:radio[name='baby-sex_"+i+"']")
            .formValidator({
                tipID:"baby-sex_"+i+"Tip",
                defaultValue:[""],
                onCorrect:true
            })
            .inputValidator({
                min:1,
                max:1,
                onError:"请选择宝宝性别"
            });

    })


    //找回密码
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"password-form",
        onError:function(msg){alert(msg);},
        submitAfterAjaxPrompt : '数据正在验证，请稍等...'
    });

    $("#forget-email")
        .formValidator({
            onShowFixText:"请填入您注册时的邮箱",
            onShow:"请填入您注册时的邮箱",
            onFocus:"请填入您注册时的邮箱",
            onCorrect:true
        })
        .inputValidator({
            min:3,max:100,onError:"您输入的邮箱长度不正确"
        })
        .regexValidator({
            regExp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$"
            ,onError:"您输入的邮箱格式不正确"
        });

    $("#forget-code")
        .formValidator({
            onShowFixText:"请填入右侧图片中的验证码",
            onShow:"请填入右侧图片中的验证码",
            onFocus:"请填入右侧图片中的验证码",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:4,
            onError:"填入的验证码不正确"
        });

    if($("#forget-email").length)
    $("#forget-email").selectView();

    $("#new-password")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请填入密码",
            onFocus:"请填入密码",
            onCorrect:"密码合法"
        })
        .inputValidator({
            min:6,max:20,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"密码两边不能有空符号"},
            onError:"密码长度限制为6-20位字符"
        })
        .passwordValidator({
            compareID:"new-password-conf"
        });
    $("#new-password-conf")
        .formValidator({
            onShowFixText:"请再次输入密码保证与您设置的新密码相同",
            onShow:"请再次填入密码确认",
            onFocus:"至少1个字符长度",
            onCorrect:true
        })
        .inputValidator({
            min:1,
            empty:{leftEmpty:false,rightEmpty:false,emptyError:"重复密码两边不能有空符号"},
            onError:"重复密码不能为空"
        })
        .compareValidator({
            desID:"new-password",
            operateor:"=",
            onError:"您两次填入密码不一致"
        });
});


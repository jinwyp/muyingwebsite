/**
 * Created with JetBrains WebStorm.
 * User: clock
 * Date: 12-12-12
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
//基本信息 校验
$(function () {
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"userInfo",
        onError:function (msg) {
            alert(msg);
        },
        submitAfterAjaxPrompt:'数据正在验证，请稍等...',
        onSuccess: function() {
            jQuery("#messagesuccess").slideDown("slow").fadeTo("slow", 1).delay(2000).fadeTo("slow", 0).slideUp("fast");
            return true
        }

    });
    $("#realName")
        .formValidator({
            tipID:"nameTip",
            onShowFixText:"请填入2~6个汉字，只限中文",
            onShowText:"请填入您的真实姓名",
            onShow:"请填入您的真实姓名",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:12,
            onError:"只限2~6个汉字，请重新填写"
        })
        .regexValidator({
            isValid:true,
            regExp:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",
            //dataType:"string",
            onError:"格式不正确，请输入2~6个汉字"
        });

    $("#userInfo input:radio[name='user_sex']")
        .formValidator({
            relativeID:"",
            tipID:"sexTip",
            tipCss:"",
            onShow:"",
            onFocus:"",
            onCorrect:true,
            defaultValue:["2"]
        })
        .inputValidator({
            min:1,
            max:1,
            onError:"请选择您的性别"
        });

    $("#userInfo select[name='userArea']")
        .formValidator({
            empty:false,
            tipID:"areaTip",
            onCorrect:true
        })
        .inputValidator({
            min:3,
            max:3,
            onError:"请选择所在地"
        });

});

//宝宝信息 校验
$(function () {
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"babyInfoEdit",
        onError:function (msg) {
            alert(msg);
        },
        submitAfterAjaxPrompt:'数据正在验证，请稍等...'
    });
    $("#baby_height")
        .formValidator({
            tipID:"baby_height_Tip",
            onFocus:"请填写您的宝宝身高",
            forceValid:true,
            onCorrect:true
        })
        .inputValidator({
            min:2,
            max:10,
            onError:"请正确填写您的宝宝身高"
        })
        .regexValidator({
            isValid:true,
            regExp:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",
            onError:"格式不正确，只能输入数字"
        });

    $("#baby_weight")
        .formValidator({
            tipID:"baby_weight_Tip",
            onShow:"请填写您的宝宝体重",
            onCorrect:true
        })
        .inputValidator({
            min:2,
            max:10,
            onError:"请正确填写您的宝宝体重"
        })
        .regexValidator({
            isValid:true,
            regExp:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",
            onError:"格式不正确，只能输入数字"
        });

    $("#birth_certificate_number")
        .formValidator({
            tipID:"birth_certificate_number_Tip",
            onShow:"请填写您的出生证号码",
            onCorrect:true
        })
        .inputValidator({
            min:2,
            max:10,
            onError:"请正确填写您的出生证号码"
        })
        .regexValidator({
            isValid:true,
            regExp:"^\\w+$",
            onError:"格式不正确，只能输入字母和数字"
        });
});

//修改密码 校验
$(function () {
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"form_editPwd",
        onError:function (msg) {
            alert(msg);
        },
        submitAfterAjaxPrompt:'数据正在验证，请稍等...'
    });
    $("#nowPwd")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请输入当前密码",
            onFocus:"请输入当前密码",
            onCorrect:"密码合法"
        })
        .inputValidator({
            isValid:false,
            min:6, max:20,
            empty:{leftEmpty:false, rightEmpty:false, emptyError:"密码两边不能有空符号"},
            onError:"密码长度限制为6-20位字符"
        });

    $("#newPwd")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请输入新密码",
            onFocus:"请输入新密码",
            onCorrect:""
        })
        .inputValidator({
            min:6, max:20,
            empty:{leftEmpty:false, rightEmpty:false, emptyError:"密码两边不能有空符号"},
            onError:"密码长度限制为6-20位字符"
        })
        .passwordValidator({
            compareID:"us"
        });
    $("#rePwd")
        .formValidator({
            onShowFixText:"请再次输入新密码",
            onShow:"请再次输入新密码",
            onFocus:"至少6个字符长度",
            onCorrect:true
        })
        .inputValidator({
            min:6,
            empty:{leftEmpty:false, rightEmpty:false, emptyError:"重复密码两边不能有空符号"},
            onError:"重复密码不能为空"
        })
        .compareValidator({
            desID:"nowPwd",
            operateor:"=",
            onError:"您两次输入的密码不一致"
        });
});

//邮箱验证 校验
$(function () {
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"form_emailChecking",
        onError:function (msg) {
            alert(msg);
        },
        submitAfterAjaxPrompt:'数据正在验证，请稍等...'
    });
    $("#email_nowPwd")
        .formValidator({
            onShowFixText:"请填入6~20个字符，包括字母、数字、特殊符号，区分大小写",
            onShow:"请输入当前密码",
            onFocus:"请输入当前密码",
            onCorrect:"密码合法"
        })
        .inputValidator({
            isValid:false,
            min:6, max:20,
            empty:{leftEmpty:false, rightEmpty:false, emptyError:"密码两边不能有空符号"},
            onError:"密码长度限制为6-20位字符"
        });
    $("#email_regEmail")
        .formValidator({
            onShowFixText:"请填入常用的邮箱，用来找回密码，接受通知等信息",
            onShow:"请填入常用的邮箱",
            onFocus:"请填入常用的邮箱",
            onCorrect:true
        })
        .inputValidator({
            min:3,max:100,onError:"邮箱长度限制为3-100位字符"
        })
        .regexValidator({
            regExp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$"
            ,onError:"您输入的邮箱格式不正确"
        });
});

//手机验证 校验
$(function () {
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"form_phoneChecking",
        onError:function (msg) {
            alert(msg);
        },
        submitAfterAjaxPrompt:'数据正在验证，请稍等...'
    });
    $("#phoneChecking")
        .formValidator({
            onShowFixText:"请输入手机校验码",
            onShow:"请输入手机校验码",
            onFocus:"请输入手机校验码",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:4,
            onError:"输入的手机校验码不正确"
        });
    $("#checkingCode")
        .formValidator({
            onShowFixText:"请输入右侧图片中的验证码",
            onShow:"请输入右侧图片中的验证码",
            onFocus:"请输入右侧图片中的验证码",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:4,
            onError:"输入的验证码不正确"
        });


});

// 用户中心修改宝宝信息
$(function () {
    $(".edit-baby").delegate('a', 'click', function (e) {
        e.preventDefault();
        $("#edit_babyinfo").hide();
        $(this).parents("dl").after($("#edit_babyinfo").fadeIn());
        console.log($(this).parents());
    });
    $("#submit_babyEdit,#submit_cancel").click(function() {
        $("#edit_babyinfo").hide();
    });
});

$(function () {

    $("#submitbutton").click(function(e) {
        e.preventDefault();

//            var ua = navigator.userAgent.toLowerCase();
//            var check = function(r) {
//                return r.test(ua);
//            };
//            var isOpera = check(/opera/);
//            var isIE = !isOpera && check(/msie/);
//            var isIE6 = isIE && check(/msie 6/);
//            $("#messageTwo").css({ "top": "0px" });
//            if (isIE6) {
//                $("#messageTwo").css({ "top": "" + $(window).scrollTop() + "px" });
//            }

    jQuery("#messagesuccess").slideDown("slow").fadeTo("slow", 1).delay(2000).fadeTo("slow", 0).slideUp("fast");

    });

});
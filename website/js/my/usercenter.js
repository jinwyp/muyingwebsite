/**
 * Created with JetBrains WebStorm.
 * User: clock
 * Date: 12-12-12
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
//基本信息 校验
$(function(){
    $.formValidator.initConfig({
        theme:"myzj",
        submitOnce:true,
        formID:"userInfo",
        onError:function(msg){alert(msg);},
        submitAfterAjaxPrompt : '数据正在验证，请稍等...'
    });
    $("#realName")
        .formValidator({
            tipID:"nameTip",
            onShowFixText:"2~6个汉字，只限中文",
            onShowText:"请填入您的真实姓名",
            onShow:"请填入您的真实姓名",
            onCorrect:true
        })
        .inputValidator({
            min:4,
            max:12,
            onError:"限2~6个汉字,请重新填写"
        })
        .regexValidator({
            isValid: true,
            regExp:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",
            //dataType:"string",
            onError:"格式不正确,只能输入汉字"
        });

    $("#userInfo input:radio[name='user_sex']")
        .formValidator({
            relativeID:"",
            tipID:"sexTip",
            tipCss :"",
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
            empty :false,
            tipID:"areaTip",
            onCorrect:true
        })
        .inputValidator({
            min:3,
            max:3,
            onError:"请选择所在地"
        });

    $("#baby_height")
        .formValidator({
            tipID:"baby_height_Tip",
            onShowText:"请填写您的宝宝身高",
            onFocus:"请填写您的宝宝身高",
            forceValid : true,
            onCorrect:true
        });
    $("#baby_weight")
        .formValidator({
            tipID:"baby_weight_Tip",
            onShowText:"请填写您的宝宝体重",
            onShow:"请填写您的宝宝体重",
            onCorrect:true
        })


});


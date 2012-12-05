/* formValidator 使用说明 */

//初始化设置(只针对一个form)
var initConfig_setting =
{
    theme:"Default",                                    //指定皮肤（主题所在文件夹）
    validatorGroup : "1",						        //分组号
    formID:"",					                        //表单ID
    submitOnce:false,			        				//页面是否提交一次，不会停留，否则停留在当前页
    ajaxForm : null,                                    //如果不为null，表示整个表单ajax提交
    mode : "FixTip",		                            //显示模式。可选项：AutoTip:自动插入提示层;FixTip:紧贴input，需要手动插入提示层;AlertTip:弹出提示;SingleTip:简单模式;
    errorFocus:true,			                        //第一个错误的控件获得焦点
    wideWord:true,			                        	//一个汉字当做2个长
    forceValid:false,	        						//控件输入正确之后，才允许失去焦
    debug:false,        								//调试模式点
    inIframe:false,                                     //
    onSuccess: function() {return true},		        //提交成功后的回调函数
    onError: $.noop,					            	//提交失败的回调函数度
    onAlert: function() {alert(arguments[0])},          //AlertTip模式下，强制forceValid时输出的显示信息
    status:"",                                          //提交的状态：submited、sumbiting、sumbitingWithAjax
    ajaxPrompt : "当前有数据正在进行服务器端校验，请稍候",   //控件失去焦点后，触发ajax校验，没有返回结果前的错误提示
    validCount:0,			                            //含ajaxValidator的控件个数
    ajaxCountSubmit:0,		                            //提交的时候触发的ajax验证个数
    ajaxCountValid:0,		                            //失去焦点时候触发的ajax验证个数
    validObjects:[],						        	//参加校验的控件集合
    ajaxObjects:[],							            //传到服务器的控件列表
    showTextObjects:"",                                 //指定显示文字的元素
    validateType : "initConfig",                        //初始化配置
    offsetChrome : {left:42,top:0},                     //Fix chrome
    oneByOneVerify : false                              //是否逐个校验
};

var formValidator_setting =
{
    validatorGroup : "1",                               //验证组，每个验证组可以对应一个form
    onShowText : "",                                    //文本框里的初始文字（默认文字）
    onShowTextColor:{mouseOnColor:"",mouseOutColor:""}, //鼠标焦点在文本框时的文字颜色
    onShowFixText:"",                                   //鼠标移到文本框时Tip的提示文字（register中input下的提示信息）
    onShow :"请输入内容",                                //初始Tip提示文字（无条件触发）
    onFocus: "请输入内容",                               //鼠标焦点在文本框时的Tip提示文字（右）
    onCorrect: "输入正确",                               //验证通过时Tip显示的文字,如果值为true(非字符串类型)则只显示图标,为空则不显示
    onEmpty: "输入内容为空",                             //输入值为空时Tip的提示文字
    empty :false,                                       //值是否可以为空
    autoModify : false,                                 //自动修改
    defaultValue : null,                                //默认值，如果是:text 则此处效果等同于onShowText
    bind : true,                                        //是否参与验证
    ajax : false,                                       //是否启用异步
    validateType : "formValidator",                     //类型
    tipCss :                                            //提示层位置设置.（感觉没必要~）
    {
        left:10,
        top:-4,
        height:20,
        width:280
    },
    triggerEvent:"blur change",                         //触发校验事件
    forceValid : false,                                 //是否强制-不通过验证无法失焦
    tipID : null,                                       //提示层ID
    pwdTipID : null,                                    //密码提示层ID
    fixTipID : null,                                    //错误/正确 信息提示层（右）
    relativeID : null,                                  //固定提示层
    index : 0,                                          //
    leftTrim : false,                                   //去左边空格
    rightTrim : false                                   //去右边空格
};

//单项表单验证初始化
var inputValidator_setting =
{
    isValid : false,                                   //是否启用
    type : "size",                                     //类型：长度
    min : 0,                                           //字符最小长度
    max : 99999,                                       //字符最大长度
    onError:"输入错误",                                 //输入错误时的提示
    validateType:"inputValidator",                     //类型
    empty:{leftEmpty:true,rightEmpty:true,leftEmptyError:null,rightEmptyError:null}
};

//密码检验设置（检验两次密码输入是否一致）
var compareValidator_setting =
{
    isValid : false,
    desID : "",
    operateor :"=",
    onError:"输入错误",
    validateType:"compareValidator"
};

//验证器初始化
var regexValidator_setting =
{
    isValid : false,                                //默认禁用
    regExp : "",                                    //验证方法（正则表达式）
    param : "i",
    dataType : "string",
    compareType : "||",                             //验证方法：“||”或，“&&”与
    onError:"输入的格式不正确",                       //错误提示语
    validateType:"regexValidator"                   //类型
};

//ajax配置
var ajaxForm_setting =
{
    type : "GET",
    url : window.location.href,
    dataType : "html",
    timeout : 100000,
    data : null,
    type : "GET",
    async : true,
    cache : false,
    buttons : null,
    beforeSend : function(){return true;},
    success : function(){return true;},
    complete : $.noop,
    processData : true,
    error : $.noop
};

//异步验证初始化设置
var ajaxValidator_setting =
{
    isValid : false,                                    //默认禁用
    lastValid : "",                                     //最后提交项
    oneceValid : false,                                 //只提交一次
    randNumberName : "rand",                            //生成随机ID
    onError:"服务器校验没有通过",                         //错误提示
    onWait:"正在等待服务器返回数据",                      //等待提示
    validateType:"ajaxValidator"                        //类型
};


//用于验证触发的自定义回调方法
var functionValidator_setting =
{
    isValid : true,                                     //默认启用
    fun : function(){this.isValid = true;},             //回调
    validateType:"functionValidator",                   //类型
    onError:"输入错误"                                   //错误提示文字
};

//密码验证规则
var passwordValidator_setting = {
    isValid : true,                                     //密码检验，默认启用
    compareID : "",                                     //用于指定二次验证，对比密码输入是否一致
    validateType:"passwordValidator",                   //验证类型
    onErrorContinueChar:"密码字符为连续字符不被允许",      //密码为连续字符串时的报错提示
    onErrorSameChar:"密码字符都相同不被允许",              //密码为相同字符时的报错提示
    onErrorCompareSame:"密码于用户名相同不被允许"          //密码与用户名相同时的报错提示
};
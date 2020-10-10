$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();

    //接口URL集合
    var interfaceURL = {
        getSetting:"/gl/GlFileEdoc/getSetting",//查询条件
        saveSetting:"/gl/GlFileEdoc/saveSetting",//保存
        testSetting:'/gl/GlFileEdoc/testSetting'//测试配置
       
    }; 


    var page = function () {
        return {
            getSetting: function(){
                ufma.ajax(interfaceURL.getSetting, "get", {}, function (result) {
                        if(result.data){
                            $('#address').val(result.data.FTP_ADDRESS);
                            $('#user').val(result.data.FTP_USER);
                            $('#pwd').val(result.data.FTP_PWD);
                            $('#stateinterface').val(result.data.STATE_INTERFACE);
                            $('#applyinterface').val(result.data.APPLY_INTERFACE);
                        }
                })
            },
            testArgu: function(){
                var FTP_ADDRESS = $('#address').val(),
                        FTP_USER = $('#user').val(),
                        FTP_PWD = $('#pwd').val(),
                        STATE_INTERFACE = $('#stateinterface').val(),
                        APPLY_INTERFACE = $('#applyinterface').val();
                    if(!FTP_ADDRESS){
                        ufma.showTip('FTP地址为空',function(){},'error')
                        return false;
                    }
                    if(!FTP_USER){
                        ufma.showTip('FTP用户为空',function(){},'error')
                        return false;
                    }
                    if(!FTP_PWD){
                        ufma.showTip('FTP密码为空',function(){},'error')
                        return false;
                    }
                    if(!STATE_INTERFACE){
                        ufma.showTip('电子档案归档状态查询接口为空',function(){},'error')
                        return false;
                    }
                    if(!APPLY_INTERFACE){
                        ufma.showTip('电子档案归档申请接口为空',function(){},'error')
                        return false;
                    }
                    return {
                        FTP_ADDRESS: FTP_ADDRESS,
                        FTP_USER: FTP_USER,
                        FTP_PWD: FTP_PWD,
                        STATE_INTERFACE: STATE_INTERFACE,
                        APPLY_INTERFACE: APPLY_INTERFACE
                     }
            },
            initPage: function(){
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);

                page.getSetting();
            },
            onEventListener: function(){
                $('.btn-test').on('click',function(){
                    var argu = page.testArgu();
                    if(!argu){
                        return ;
                    }
                    ufma.ajax(interfaceURL.testSetting, "post", argu, function (result) {
                        ufma.showTip(result.msg,function(){},result.flag)
                    })
                })
                $('.btn-save').on('click',function(){
                    var argu = page.testArgu();
                    if(!argu){
                        return ;
                    }
                    ufma.ajax(interfaceURL.saveSetting, "post", argu, function (result) {
                        ufma.showTip(result.msg,function(){},result.flag)
                    })
                })
            },
            //此方法必须保留
            init: function () {
                ufma.parse();
                page.initPage();
                page.onEventListener();
                ufma.parseScroll();
            }
        }
    }();
/////////////////////
    page.init();
});
__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}
function getWebRootPath() {
    var href = window.document.location.href;;
    var pathName = window.document.location.pathname;
    var pos = href.indexOf(pathName);
    var webPath = href.substring(0, pos);
    return webPath+'/';
}
var bootPath = __CreateJSPath("boot.js");
bootPath = bootPath.replace('/pub/','/');
//bootPath = 'http://192.168.1.168:8888/pf/';
//引用平台的ip.js
var dfBootPatn = bootPath.split("pf")[0];
var ctx=getWebRootPath();

//页面中禁止缓存,开发结束后需要去掉
/*document.write('<META HTTP-EQUIV="Pragma" CONTENT="no-cache">');
document.write('<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">');
document.write('<META HTTP-EQUIV="Expires" CONTENT="0">');*/
document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">');
//css begin
document.write('<link href="' + bootPath + 'agla-trd/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/uui/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/uui/css/u.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'pub/css/u.modal.css?rev=@@hash" rel="stylesheet" type="text/css" />');

document.write('<link href="' + bootPath + 'agla-trd/select2/select2.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/zTree/zTreeStyle.css" rel="stylesheet" type="text/css" />');

document.write('<link href="' + bootPath + 'agla-trd/datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css" />');

document.write('<link href="' + bootPath + 'agla-trd/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/datatables/external/css/fixedHeader.dataTables.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/datatables/external/css/fixedColumns.dataTables.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'agla-trd/datatables/external/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />');

document.write('<link href="' + bootPath + 'pub/css/yonyou-font/yonyou-font.css?rev=@@hash" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'pub/css/uftooltip.css?rev=@@hash" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'pub/css/ufma.css?rev=@@hash" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPath + 'pub/css/uf.core.min.css?rev=@@hash" rel="stylesheet" type="text/css" />');

//css end
//less引入
// document.write('<link href="' + bootPath + 'pub/less/style.less" rel="stylesheet/less" type="text/css" />');
// document.write('<script src="' + bootPath + 'pub/less/less.js" type="text/javascript"></sc' + 'ript>');
//js begin
//解决广东的安全漏洞问题， jQuery 存在 XSS 漏洞  目标站点存在javascript框架库漏洞 更新jquery由1.12.3版本到3.4.1 guohx 20200717
// document.write('<script src="' + bootPath + 'agla-trd/jquery/jquery-1.12.3.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/jquery/jquery-3.4.1.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/bootstrap/js/bootstrap.js" type="text/javascript"></sc' + 'ript>');

//引用平台的md5.js 
//改为引入到核算内部的agla-trd下面，解决85平台引用不到问题 guohx  20200917
document.write('<script src="' + bootPath + 'agla-trd/md5/js/md5.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');
//引用平台的ip.js
document.write('<script src="' + bootPath + 'agla-trd/ip/js/ip.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/uui/js/u-polyfill.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/uui/js/u.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/select2/select2.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/select2/select2-zh-CN.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/uui/js/u-tree.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/zTree/jquery.ztree.core.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/zTree/jquery.ztree.excheck.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/zTree/jquery.ztree.exedit.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/datatables/jquery.dataTables.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/datatable.default.js" type="text/javascript"></sc' + 'ript>');
/*document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/fixedHeader.dataTables.min.js" type="text/javascript"></sc' + 'ript>');*/
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/fixedColumns.dataTables.min.js" type="text/javascript"></sc' + 'ript>');
//打印start
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/dataTables.buttons.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/buttons.print.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/buttons.html5.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/buttons.colVis.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/buttons.flash.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'agla-trd/datatables/external/js/jszip.min.js" type="text/javascript"></sc' + 'ript>');
//打印end

document.write('<script src="' + bootPath + 'agla-trd/echarts/echarts.min.js" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'agla-trd/printarea/jquery.PrintArea.js" type="text/javascript"></sc' + 'ript>');
//打印模板（非datatables打印）start
document.write('<script src="' + bootPath + 'agla-trd/art-template/template-web.js" type="text/javascript"></sc' + 'ript>');
//打印模板（非datatables打印）end 
document.write('<script src="' + bootPath + 'pub/js/jquery.ztree.exhide-3.5.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'pub/js/jquery.uftooltip.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');

document.write('<script src="' + bootPath + 'pub/js/jquery.colResizable-1.5.min.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'pub/js/ufma.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPath + 'pub/js/uf.core.min.js?rev=@@hash" type="text/javascript"></sc' + 'ript>');
//云打印服务文件，暂时注释
// document.write('<script src="/iuap-print/artengine/YYPrint.js?rev=@@hash" type="text/javascript" charset="utf-8"></script>');
//js end


//skin
/*
 var skin = getCookie("miniuiSkin");
 if (skin && skin != 'default') {
 document.write('<link href="' + bootPath + 'themes/' + skin + '/skin.css" rel="stylesheet" type="text/css" />');
 }
 */

////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}
//  判断浏览器版本
var appName = navigator.appName, appVersion = navigator.appVersion .split(";")[1].replace(/[ ]/g,"");
if(appName == "Microsoft Internet Explorer" && (appVersion=="MSIE6.0"||appVersion=="MSIE7.0"||appVersion=="MSIE8.0"||appVersion=="MSIE9.0")){
        alert("Your browser version is too low, please use IE11 and above or Chrome, Firefox and other browsers!");
    }
// 获得query
function getRequest() {
    var url = decodeURIComponent(location.search);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return theRequest;
}
function setCookie(c_name, value, expTime) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expTime * 3600 * 1000);
    document.cookie = c_name + "=" + escape(value) + (expTime == null ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
function delCookie(c_name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(c_name);
    if (cval != null) {
        document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}
// 转义
function escape2Html(a) {
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return a.replace(/&(lt|gt|nbsp|amp|quot);/ig,
    function(all,t){return arrEntities[t];});
}
// logo 返回首页
function _back(){
    window.location.href = 'index.html'; 
};

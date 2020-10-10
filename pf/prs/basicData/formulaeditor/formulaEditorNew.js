$(function () {
    var svData = ufma.getCommonData();
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };
    var ownerData = window.ownerData;
    //接口URL集合
    var interfaceURL = {
        checkFormula:"/prs/PrsTypeItem/checkFormula",//校验公式
        findPrsTypeItemByPriority:"/prs/PrsTypeItem/findPrsTypeItemByPriority"//根据优先级查询工资项显示在高级公式定义
    };
    if(ownerData.isAgency){
        interfaceURL.checkFormula = "/prs/PrsTypeItemCo/checkFormula";
        interfaceURL.findPrsTypeItemByPriority = "/prs/PrsTypeItemCo/findPrsTypeItemCoByPriority"
    }
    var page = function () {
        return {
            //人员信息
            renderEmployee:function(){
                var employeeDatas = window.ownerData.employeeDatas;
                var ulHtml = '<ul class="conOne-ul"></ul>';
                $(".workspace-center .conOne-left").append(ulHtml);
                var liHtml = '';
                for(var i = 0 ;i <employeeDatas.length;i++){
                    liHtml += '<li data-code="'+employeeDatas[i].dataType+'">'+employeeDatas[i].caption+'</li>'
                }
                $(".conOne-ul").append(liHtml)
            },
            //工资项目
            renderWageItems:function(){
                var argu = {
                    priority:ownerData.rowData.priority?ownerData.rowData.priority:"",
                    prtypeCode:ownerData.prtypeCode
                };
                ufma.post(interfaceURL.findPrsTypeItemByPriority,argu,function (result) {
                    var wageItems = result.data;
                    var ulHtml = '<ul class="conTwo-ul"></ul>';
                    $(".workspace-center .conTwo").append(ulHtml);
                    var liHtml = '';
                    for(var i = 0 ;i <wageItems.length;i++){
                        liHtml += '<li data-code="'+wageItems[i].pritemCode+'">'+wageItems[i].pritemName+'</li>'
                    }
                    $(".conTwo-ul").append(liHtml)
                });

            },
            //函数
            renderFun:function(){
                var funs = [
                    {code:"1",name:"向上取整（）"},
                    {code:"2",name:"向下取整（）"},
                    {code:"3",name:"四舍五入（，）"},
                    {code:"4",name:"截取（，）"}
                ];
                var ulHtml = '<ul class="conThree-ul"></ul>';
                $(".workspace-center .conThree").append(ulHtml);
                var liHtml = '';
                for(var i = 0 ;i <funs.length;i++){
                    liHtml += '<li data-code="'+funs[i].code+'">'+funs[i].name+'</li>'
                }
                $(".conThree-ul").append(liHtml)
            },
            //编辑时set值
            setVal:function(){
                if(ownerData.FormulaEditorVal != "" && ownerData.FormulaEditorVal != null && ownerData.FormulaEditorVal != undefined){
                    $("#FormulaEditorVal").val(ownerData.FormulaEditorVal);
                }
            },
            //校验公式
            checkFormula:function(save){
                var argu = {
                    formula:$("#FormulaEditorVal").val()
                };
                ufma.post(interfaceURL.checkFormula,argu,function (result) {
                    if(result.data == "error"){
                        ufma.showTip(result.msg,function(){},"error")
                    }else if(save){
                        var colseData = {
                            rid:ownerData.rid,
                            val:$("#FormulaEditorVal").val(),
                            action:"save"
                        };
                        _close(colseData)
                    }else{
                        ufma.showTip(result.msg,function(){},result.flag)
                    }
                });
            },
            initPage:function(){
                page.renderEmployee();
                page.renderWageItems();
                page.renderFun();
                page.setVal();


            },
            onEventListener:function(){
                //切换tab
                $(".nav-tabs li").on("click",function () {
                    $(this).addClass("active").siblings("li").removeClass("active");
                    var index = $(this).index();
                    $(".tab-content").eq(index).removeClass("hidden").siblings(".tab-content").addClass("hidden");
                });
                //单击选项
                $(document).on("click",".tab-content li",function () {
                    $(this).addClass("select").siblings("li").removeClass("select");
                });
                //单击选项
                $(document).on("dblclick",".conOne-left li",function () {
                    $(this).addClass("select").siblings("li").removeClass("select");
                    var code = $(this).attr("data-code");
                    var text = $(this).text();
                    insertText(document.getElementById("FormulaEditorVal"), text);
                    setTa1CursorPosition(getTa1CursorPosition())
                    var index = $(this).index();
                    var data = window.ownerData.employeeDatas[index];
                    var rightData = data.valsetList;
                    if(rightData.length > 0){
                        $(".conOne .conOne-right").html("");
                        var rightHtml = "";
                        for(var i=0;i<rightData.length;i++){
                            rightHtml += '<div class="right-row" data-code="'+rightData[i].valId+'">'+rightData[i].val+'</div>'
                        }
                        $(".conOne .conOne-right").append(rightHtml);
                    }

                });
                //双击选项
                $(document).on("dblclick",".right-row",function () {
                    var code = $(this).attr("data-code");
                    var text = $(this).text();
                    insertText(document.getElementById("FormulaEditorVal"), text);
                    setTa1CursorPosition(getTa1CursorPosition())
                });
                //双击选项
                $(document).on("dblclick",".tab-content-click li",function () {
                    var code = $(this).attr("data-code");
                    var text = $(this).text();
                    insertText(document.getElementById("FormulaEditorVal"), text)
                    setTa1CursorPosition(getTa1CursorPosition())
                });
                //点击运算符
                $(document).on("click", ".newbtn", function () {
                    // var codes = $(this).text();
                    var codes = $(this).attr("data-code");
                    insertText(document.getElementById("FormulaEditorVal"), codes);
                    setTa1CursorPosition(getTa1CursorPosition())
                });
                //点击确定
                $("#btn-FormulaEditorsave").click(function () {
                    page.checkFormula("save")
                });
                //清空
                $("#btn-FormulaEditornone").click(function () {
                    $("#FormulaEditorVal").val("");
                });
                //检查
                $("#btn-FormulaEditorup").on("click",function () {
                    page.checkFormula()
                });
                //关闭
                $("#btn-close").on("click",function () {
                    _close();
                })

            },
            init: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.initPage();
                page.onEventListener();
                ufma.parse();
            }
        }
    }();
    page.init();
    function insertText(obj, str) {
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = " " + str + " ";
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + " " + str + " " + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length +2;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += " " + str + " ";
        }
        $("#FormulaEditorVal").focus();
    }
    function getTa1CursorPosition() {
        var evt = window.event ? window.event : getTa1CursorPosition.caller.arguments[0];
        var oTa1 = document.getElementById("FormulaEditorVal");
        var cursurPosition = -1;
        if (oTa1.selectionStart) { //非IE浏览器
            cursurPosition = oTa1.selectionStart;
        } else { //IE
            var range = oTa1.createTextRange();
            range.moveToPoint(evt.x, evt.y);
            range.moveStart("character", -oTa1.value.length);
            cursurPosition = range.text.length;
        }
        return cursurPosition
    }

    function setTa1CursorPosition(i) {
        var oTa2 = document.getElementById("FormulaEditorVal");
        if (oTa2.selectionStart) { //非IE浏览器
            oTa2.selectionStart = i;
            oTa2.selectionEnd = i;
        } else { //IE
            var range = oTa2.createTextRange();
            range.move("character", i);
            range.select();
        }
    }
})
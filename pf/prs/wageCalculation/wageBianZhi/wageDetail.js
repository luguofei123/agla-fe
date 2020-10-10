$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var ownerData = window.ownerData;

    //接口URL集合
    var interfaceURL = {
        updateCalcDatasItem:"/prs/prscalcdata/updateCalcDatasItem"//保存
    };
    var pageLength = 25;

    var page = function () {
        return {
            //表格列
            columns:function(){
                var newColumns = [
                    [
                        {
                            type: 'indexcolumn',
                            field: 'ordSeq',
                            width: 40,
                            name: '序号',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                            // onKeyup: function (e) {
                            //
                            // }
                        },
                        {
                            type: 'input',
                            field: 'prtypeCode',
                            width: 200,
                            name: '工资项目名称',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {

                            }
                        },
                        {
                            type: 'money',
                            field: 'value',
                            width: 200,
                            name: '值',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                if(!data || data == 0){
                                    return ""
                                }
                                return $.formatMoney(data, 2);
                            },
                            onKeyup: function (e) {

                            }
                        },
                    ]
                ];
                return newColumns;
            },
            //渲染表格
            showTable: function (tableData) {
                var id = "nameTable";
                $('#' + id).ufDatagrid({
                    // frozenStartColumn: 1, //冻结开始列,从1开始
                    // frozenEndColumn: 1, //冻结结束列
                    data: tableData,
                    disabled: false, // 可选择
                    columns:page.columns() ,
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        $(document).on("focus","#nameTableinputprtypeCode",function () {
                            $(this).attr("disabled",true);
                        });
                        $("#nameTableBody tbody td").on("click",function (e) {
                            
                            var rowid = $(this).closest("tr").attr("pid");
                            var rowNoarr = rowid.split("_");
                            var rowNo = parseInt(rowNoarr[rowNoarr.length - 1]);
                            var text = $(this).text();
                            if(ownerData.action == "view"){
                                //从工资审核的明细不能修改
                                stopPropagation(e)
                            }else{
                                //允许手工录入的才可以编辑
                                if (page.prsTypeItemCos[rowNo - 1].isEditable != "Y" || page.payEditStat != "1") {
                                    stopPropagation(e)
                                } else {
                                    $(".uf-grid-table-edit").removeClass("hidden");
                                }
                            }
                            
                        })


                    }
                });
            },
            //查询明细
            getSearchData:function(){
                var datas = ownerData.mainTableData[page.rowId];
                $(".employee-code").text(datas.empCode);
                $(".employee-name").text(datas.empName);
                var str1,str2,str3;
                str1 = datas.mo?datas.mo+'月':'';
                str2 = datas.payNoMo&&datas.payNoMo!==1?'-'+datas.payNoMo:'';
                str3 = '('+str1+str2+')';
                $(".prtype").text(datas.prtypeCodeName + str3);
                var prsTypeItemCos = datas.prsCalcItems;
                page.prsTypeItemCos = datas.prsCalcItems;
                var arr = [];
                for(var y=0;y<prsTypeItemCos.length;y++){
                    var code = prs.strTransform(prsTypeItemCos[y].pritemCode);
                    var obj = {code:code,name:prsTypeItemCos[y].pritemName};
                    arr.push(obj)
                }
                var newTableDatas = [];
                for(var i=0;i<arr.length;i++){
                    var obj = {prtypeCode:arr[i].name,value:datas[arr[i].code]};
                    newTableDatas.push(obj);
                }
                page.showTable(newTableDatas);
                page.payEditStat = datas.payEditStat;
                if(datas.payEditStat != "1"){
                    $("#btn-sure").addClass("hidden")
                }else{
                    $("#btn-sure").removeClass("hidden")
                }
            },
            //判断上一个下一个按钮置灰
            btnGrey:function(rowId){
                var first = 0;
                var last = ownerData.mainTableData.length - 1;
                if(ownerData.mainTableData.length == 1){
                    $("#theNext").attr("disabled",true);
                    $("#theLast").attr("disabled",true);
                    $("#thePre").attr("disabled",true);
                    $("#theFirst").attr("disabled",true);
                }else if(page.rowId == last){
                    $("#theNext").attr("disabled",true);
                    $("#theLast").attr("disabled",true);
                    $("#thePre").attr("disabled",false);
                    $("#theFirst").attr("disabled",false);
                }else if(page.rowId == first){
                    $("#thePre").attr("disabled",true);
                    $("#theFirst").attr("disabled",true);
                    $("#theNext").attr("disabled",false);
                    $("#theLast").attr("disabled",false);
                }else{
                    $("#thePre").attr("disabled",false);
                    $("#theFirst").attr("disabled",false);
                    $("#theNext").attr("disabled",false);
                    $("#theLast").attr("disabled",false);
                }
            },
            //保存
            save:function(callBackfun){
                var argu = {
                    prsCalcDatas:[]
                };
                var tableDatas = $("#nameTable").getObj().getData();
                var datas = ownerData.mainTableData[page.rowId];
                var prsCalcItems = datas.prsCalcItems;
                var obj = {
                    prtypeCode: datas.prtypeCode,     //薪资类别
                    empUid: datas.empUid, //人员唯一ID
                };
                var res = false;
                for(var i =0;i<tableDatas.length;i++){
                    var code = prs.strTransform(prsCalcItems[i].pritemCode);
                    if(tableDatas[i].value != datas[code]){
                        res = true;
                        obj[code] = tableDatas[i].value  //修改工资项数据
                    }
                }
                if(!res){
                    if(callBackfun) {
                        //翻页修改
                        callBackfun();
                    }else{
                        _close();
                    }
                    return false
                }
                argu.prsCalcDatas.push(obj);
                ufma.showloading("正在加载数据，请耐心等待");
                $("button").attr("disabled",true);
                ufma.post(interfaceURL.updateCalcDatasItem,argu,function (result) {
                    $("button").attr("disabled",false);
                    ufma.hideloading();
                    if(callBackfun){
                        //翻页修改
                        callBackfun();
                    }else{
                        //保存
                        var closeData = {
                            action:"save",
                            msg:result.msg,
                            flag:result.flag
                        };
                        _close(closeData);
                    }
                });
                var timeId = setTimeout(function () {
                    clearTimeout(timeId)
                    $("button").attr("disabled",false);
                })

            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.showTable([]);
                page.id = ownerData.id;
                page.rowId = parseInt(ownerData.rowId);
                page.getSearchData();
                page.btnGrey();

            },
            onEventListener: function () {
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    page.save();
                });
                //下一个
                $("#theNext").on("click",function () {
                    page.save(getNextData);
                    function getNextData(){
                        page.rowId = parseInt(page.rowId) + 1;
                        page.btnGrey(page.rowId);
                        page.id = ownerData.mainTableData[page.rowId].id;
                        page.getSearchData();
                    }
                });
                //上一个
                $("#thePre").on("click",function () {
                    page.save(getNextData);
                    function getNextData(){
                        page.rowId = parseInt(page.rowId) - 1;
                        page.btnGrey(page.rowId);
                        page.id = ownerData.mainTableData[page.rowId].id;
                        page.getSearchData();
                    }
                });
                //第一个
                $("#theFirst").on("click",function () {
                    page.save(getNextData);
                    function getNextData(){
                        page.rowId = 0;
                        page.btnGrey(page.rowId);
                        page.id = ownerData.mainTableData[page.rowId].id;
                        page.getSearchData();
                    }
                });
                //最后一个
                $("#theLast").on("click",function () {
                    page.save(getNextData);
                    function getNextData(){
                        page.rowId = ownerData.mainTableData.length - 1;
                        page.btnGrey(page.rowId);
                        page.id = ownerData.mainTableData[page.rowId].id;
                        page.getSearchData();
                    }
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

    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
});
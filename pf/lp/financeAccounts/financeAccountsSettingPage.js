$(function(){
    //open弹窗的关闭方法
    window._close = function(action, msg) {
        if (window.closeOwner) {
            var data = { action: action, msg: msg }
            window.closeOwner(data)
        }
    }
    var taskCode,taskName,rptType,rptCode,rptName,dataRowFlag,rgCode,setYear,enumerateData=[];
    function _save(close){
        if(taskCode == null || taskCode == ""){
            ufma.showTip("保存失败，报表任务为空。",function(){},"error");
            return;
        }
        if(rptType == null || rptType == ""){
            ufma.showTip("保存失败，报表类型为空。",function(){},"error");
            return;
        }
        if(rptCode == null || rptCode == ""){
            ufma.showTip("保存失败，报表代码为空。",function(){},"error");
            return;
        }
        if(rgCode == null || rgCode == ""){
            ufma.showTip("保存失败，区划为空。",function(){},"error");
            return;
        }
        if(setYear == null || setYear == ""){
            ufma.showTip("保存失败，年度为空。",function(){},"error");
            return;
        }
        var dbName =  $("#dbName").val();
        if(dbName == null || dbName == ""){
            ufma.showTip("保存失败，中间库表名为空。",function(){},"error");
            return;
        }
        var tableData = $("#tgDetailtable").getObj().getData();
        for(var i = 0;i<tableData.length;i++){
            var row = tableData[i];
            var dataRowFlag = row.dataRowFlag;
            var fieldName = row.fieldName;
            var fieldNameJq = row.fieldNameJQ;
            if(dataRowFlag == null || dataRowFlag == ""){
                ufma.showTip("保存失败，第"+(i+1)+"行数据行标识为空。",function(){},"error");
                return;
            }
            if(fieldName == null || fieldName == ""){
                ufma.showTip("保存失败，第"+(i+1)+"行报表字段为空。",function(){},"error");
                return;
            }
            if(fieldNameJq == null || fieldNameJq == ""){
                ufma.showTip("保存失败，第"+(i+1)+"行中间表字段为空。",function(){},"error");
                return;
            }
        }
        var rptCodeJQ = $('#rptCodeJQ').val();
        var rptTypeJQ = $('#rptTypeJQ').val();
        var url='/gl/FinalAccounts/saveSettingInfo';
        url += '?rgCode='+rgCode+'&setYear='+setYear+'&taskCode='+taskCode+'&taskName='+taskName+'&rptCode='+rptCode+'&rptName='+rptName+'&rptType='
        +rptType+'&dbName='+dbName+'&rptCodeJQ='+rptCodeJQ+'&rptTypeJQ='+rptTypeJQ;
        ufma.post(url,tableData, function(result) {
            if(result.flag == 'success'){
                if(!close){
                    ufma.showTip('保存成功',function(){},'success');
                }else{
                    window.closeOwner(result);
                }
            }else{
                ufma.showTip('保存失败'+result.msg,function(){},'error');
            }
        });
    }
    var page = function(){
        var portList = {
            GET_RPT_TASK:'/gl/FinalAccounts/getTaskInfo',
            GET_RPT_INFO:'/gl/FinalAccounts/getRptInfoByTaskCode',
            GET_SETTING_INFO:'/gl/FinalAccounts/getSettingInfo'
        };
        var tgDetaildatahq = new Array();
        return{
            params:{},
            focusIndex:0,
            getTask:function(){
                $('#selectTask').ufCombox({
                    url: portList.GET_RPT_TASK+'?rgCode='+page.params.rgCode+'&setYear='+page.params.setYear,
                    idField: 'taskCode', //可选
                    textField: 'taskName', //可选
                    readonly: false,
                    placeholder: '请选择报表任务',
                    onChange: function(sender, data) {
                        rptType = data.rptType;
                        taskCode = $('#selectTask').getObj().getValue();
                        taskName = data.taskName;
                        $('#selectRpt').ufCombox({
                            url: portList.GET_RPT_INFO+'?rgCode='+page.params.rgCode+'&setYear='+page.params.setYear+'&taskCode='+taskCode,
                            idField: 'rptCode', //可选
                            textField: 'rptName', //可选
                            readonly: false,
                            placeholder: '请选择报表',
                            onChange: function(sender, data) {
                                rptCode = $('#selectRpt').getObj().getValue();
                                rptName = data.rptName;
                                dataRowFlag = data.dataRowFlag;
                                var url=portList.GET_SETTING_INFO+'?rgCode='+page.params.rgCode+'&setYear='+page.params.setYear+'&taskCode='+taskCode+'&rptCode='+rptCode;
                                ufma.get(url,null, function(result) {
                                  if(result.flag == 'success'){
                                      page.tgDetailgrid(result.data.settingInfo);
                                      var dataRowFlagArr = result.data.dataRowFlag;
                                      for(var i = 0; i<dataRowFlagArr.length;i++){
                                          var obj = new Object();
                                          obj.dataRowFlag = dataRowFlagArr[i];
                                          enumerateData.push(obj);
                                      }
                                      if(result.data.settingInfo.length > 0){
                                          var dbName = result.data.settingInfo[0].dbName;
                                          var rptCodeJq = result.data.settingInfo[0].rptCodeJq;
                                          var rptTypeJq = result.data.settingInfo[0].rptTypeJq;
                                          $("#dbName").val(dbName);
                                          $("#rptCodeJQ").val(rptCodeJq);
                                          $("#rptTypeJQ").val(rptTypeJq);
                                      }else{
                                          $("#dbName").val('');
                                          $("#rptCodeJQ").val();
                                          $("#rptTypeJQ").val();
                                      }
                                  }else{
                                      ufma.showTip("查询数据失败",function(){},'error');
                                  }
                                });

                            },
                            onComplete: function(sender) {

                            }
                        });
                    },
                    onComplete: function(sender) {

                    }
                });
            },
            tgDetailgrid: function (tgDetaildata) {
                if (tgDetaildata.length == 0) {
                    tgDetaildata = [{
                        "rowNo": "",
                        "colNo": "",
                        "dataRowFlag":"",
                        "fieldName": "",
                        "fieldNameJQ": ""
                    }]
                }
                tgDetaildatahq = tgDetaildata;
                $('#tgDetailtable').ufDatagrid({
                    data: tgDetaildata,
                    // idField: 'chrCode', // 用于金额汇总
                    // pId: 'pcode', // 用于金额汇总
                    disabled: false, // 可选择
                    columns: [
                        [ // 支持多表头
                            {
                                type: 'input',
                                field: 'rowNo',
                                width: 100,
                                name: '行号',
                                headalign: 'center',
                                align: 'left',
                            },
                            {
                                type: 'input',
                                field: 'colNo',
                                name: '列号',
                                width: 100,
                                headalign: 'center',
                                align: 'left',

                            },
                            {
                                type: 'combox',
                                field: 'dataRowFlag',
                                name: '数据行标识',
                                width: 230,
                                headalign: 'center',
                                align: 'left',
                                idField: 'dataRowFlag',
                                textField: 'dataRowFlag',
                                pIdField: '',
                                data: enumerateData,
                                render: function (rowid, rowdata, data) {
                                    if (!data) {
                                        return '';
                                    }
                                    return rowdata.dataRowFlag;
                                },
                                onChange: function (e) {

                                },
                                beforeExpand: function (e) { //下拉框初始化
                                }
                            },
                            {
                                type: 'input',
                                field: 'fieldName',
                                name: '报表字段',
                                width: 150,
                                headalign: 'center',
                                align: 'left',

                            },
                            {
                                type: 'input',
                                field: 'fieldNameJQ',
                                name: '中间表字段',
                                width: 150,
                                headalign: 'center',
                                align: 'left',
                            },
                            {
                                type: "toolbar",
                                field: 'remark',
                                width: 140,
                                name: '操作',
                                align: 'center',
                                headalign: 'center',
                                render: function (rowid, rowdata, data) {
                                    return '<a class="insertthis btn btn-icon-only btn-sm btn-insert-row " data-toggle="tooltip" action= "" title="插入">' +
                                        '<span class="glyphicon icon-insert"></span></a>' +
                                        '<a class="copythis btn btn-icon-only btn-sm btn-copy-row " data-toggle="tooltip" action= "" title="复制">' +
                                        '<span class="glyphicon icon-file-x"></span></a>' +
                                        '<a class="delthis btn btn-icon-only btn-sm btn-delete-row " data-toggle="tooltip" action= "" title="删除">' +
                                        '<span class="glyphicon icon-trash"></span></a>'
                                       ;
                                }
                            }
                        ]
                    ],
                    initComplete: function (options, data) {
                        ufma.isShow(page.reslist);
                    }
                });
            },
            //初始化页面
            initPage:function(){
                page.params = window.ownerData;
                rgCode = page.params.rgCode;
                setYear = page.params.setYear;
                page.getTask();
                page.tgDetailgrid(new Array());
                // page.getTreeData();
            },

            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function(){
                $('#saveAndCloseBtn').on('click',function(){
                    page.saveData('saveAndClose');
                })
                $('#saveBtn').on('click',function(){
                    page.saveData('save');
                })
                $('#cancelBtn').on('click',function(){
                    window._close();
                })
                $("body").on("click", "#tgDetailbutton", function () {
                    var rowdata = {
                        "rowNo": "",
                        "colNo": "",
                        "dataRowFlag":"",
                        "fieldName": "",
                        "fieldNameJQ": ""
                    }
                    tgDetaildatahq.push(rowdata)
                    var obj = $('#tgDetailtable').getObj();
                    obj.add(rowdata)
                    // $("[data-toggle='tooltip']").tooltip();
                    ufma.isShow(page.reslist);
                })
                $(document).on("mousedown", "#tgDetailtable .delthis span", function () {
                    var rowid = $(this).parents("tr").attr("id");
                    var rowindex = $(this).parents("tr").index();
                    tgDetaildatahq.splice(rowindex, 1)
                    var obj = $('#tgDetailtable').getObj();
                    obj.del(rowid)
                })
                //分录行插入
                $(document).on("mousedown", "#tgDetailtable .insertthis span", function () {
                    var rowid = $(this).parents("tr").attr("id");
                    var rowindex = $(this).parents("tr").index();
                    var rowdata = [{
                        "rowNo": "",
                        "colNo": "",
                        "dataRowFlag":"",
                        "fieldName": "",
                        "fieldNameJQ": ""
                    }]
                    var insertdata = {
                        "rowNo": "",
                        "colNo": "",
                        "dataRowFlag":"",
                        "fieldName": "",
                        "fieldNameJQ": ""
                    }
                    tgDetaildatahq.splice(rowindex, '0', insertdata)
                    var obj = $('#tgDetailtable').getObj();
                    obj.insert(rowid, rowdata);
                    // $("[data-toggle='tooltip']").tooltip();
                    ufma.isShow(page.reslist);
                });
                //分录行复制
                $(document).on("mousedown", "#tgDetailtable .copythis span", function () {
                    $(document).trigger("mousedown");
                    var t = $(this);
                    var timeId = setTimeout(function () {
                        var rowid = t.parents("tr").attr("id");
                        // var rowindex = t.parents("tr").index();
                        var arr = rowid.split("_");
                        var rowindex = arr[arr.length - 1];
                        var result = false, copyRowDatas;
                        var eles = $(".uf-grid-body-view").find("#" + rowid).find("td");
                        var rowObj = {};
                        $(eles).each(function (i) {
                            if ($(this).text() != "") {
                                result = true;
                            }
                            if (i == 0) {
                                rowObj.rowNo = $(this).text();
                            } else if (i == 1) {
                                rowObj.colNo = $(this).text();
                            } else if (1 == 2){
                                rowObj.dataRowFlag = $(this).text();
                            }else if (i == 3) {
                                rowObj.fieldName = $(this).text();
                            } else if (i == 4) {
                                rowObj.fieldNameJQ = $(this).text();
                            }
                            rowObj.fx = "";

                        });
                        if (!result) {
                            copyRowDatas = {
                                "rowNo": "",
                                "colNo": "",
                                "dataRowFlag":"",
                                "fieldName": "",
                                "fieldNameJQ": ""
                            };
                        } else {
                            // var tableDatas = $("#tgDetailtable").getObj().getData();
                            // copyRowDatas = tableDatas[rowindex-1];
                            copyRowDatas = rowObj;
                        }

                        tgDetaildatahq.splice(rowindex, '0', copyRowDatas);
                        var obj = $('#tgDetailtable').getObj();
                        obj.insert(rowid, copyRowDatas);
                        ufma.isShow(page.reslist);
                    }, 300)


                });
                $('#btn-qx').on("click",function(){
                    var result = new Object();
                    result.flag = 'fail';
                    window.closeOwner(result);
                });
                $('#btn_save').on('click',function(){
                    _save(false);
                })
                $('#btn_save_close').on('click',function(){
                    _save(true);
                })
            },
            //此方法必须保留
            init:function(){
                this.initPage();
                this.onEventListener();
            }
        }
    }();

    /////////////////////
    page.init();
});
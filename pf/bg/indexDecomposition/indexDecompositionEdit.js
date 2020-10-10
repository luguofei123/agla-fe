$(function () {
    window._close = function () {
        if (window.closeOwner) {
            var data = { action: 'ok', result: {} };
            window.closeOwner(data);
        }
    }
    var page = function () {
        var addData = [];
        return {
            planData: window.ownerData.planData,
            tableData: window.ownerData.tableData,
            curBgPlanDataChrId: '',
            curBgPlanDataChrCode: '',
            planDataself: '',
            billId: '',
            billCode: '',
            billData: '',
            composePlanId: '',
            composePlanName: '',
            bCanLeave: true,
            tblObj: $('#decompose-data').getObj(),

            getChildBudgetHead: function () {   //分解子指标表格
                var column = [        //支持多表头
                    { type: 'checkbox', field: '', name: '', width: 40, headalign: 'center', align: 'center' },
                    { field: 'bgItemCode', name: '指标编码', width: 100, headalign: 'center' },
                    {
                        type: 'input',
                        field: 'bgItemSummary',
                        name: '摘要',
                        className: 'ellipsis',
                        width: 200,
                        headalign: 'center'
                    }
                ];
                if (!$.isNull(page.planDataself)) {
                    for (var i = 0; i < page.planDataself.planVo_Items.length; i++) {
                        var item = page.planDataself.planVo_Items[i];
                        var cbItem = item.eleCode;
                        var url = bg.getUrl('bgPlanItem');
                        var type = 'get';
                        var param = {};
                        param['agencyCode'] = page.agencyCode;
                        param['setYear'] = page.pfData.svSetYear;
                        param['eleCode'] = item.eleCode;
                        param['eleLevel'] = item.eleLevel;
                        var idField = bg.shortLineToTF(item.eleFieldName);
                        var textField = bg.shortLineToTF(item.eleFieldName + '_NAME');
                        var argu = param;
                        var callback = function (result) {
                            for (var j = 0; j < result.data.length; j++) {
                                var item1 = result.data[j];
                                item1[idField] = item1.CHR_CODE;
                                item1[textField] = item1.codeName;
                            }
                            column.push(
                                {
                                    type: 'treecombox',
                                    //field:bg.shortLineToTF(item.eleFieldName),
                                    field: textField,
                                    idField: idField,
                                    textField: textField,
                                    name: item.eleName,
                                    width: 240,
                                    headalign: 'center',
                                    data: result.data
                                }//guohx

                            );
                        }
                        ufma.ajaxDef(url, type, argu, callback);

                    }
                    ;
                }
                column.push({
                    type: 'money',
                    field: 'bgItemCur',
                    name: '金额',
                    width: 150,
                    align: 'right',
                    headalign: 'center',
                    render: function (rowid, rowdata, data) {
                        return $.formatMoney(data, 2);
                    },
                    onKeyup: function (e) {
                        $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                    }
                });
                column.push({
                    type: 'toolbar',
                    field: 'option',
                    name: '操作',
                    width: 150,
                    headalign: 'center',
                    headalign: 'center',
                    render: function (rowid, rowdata, data) {
                        return '<button class="btn btn-delete disabled btn-permission"  data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
                    }
                });
                return [column];
            },
            getSearchMap: function (planData) {
                var searchMap = bg.getBgPlanItemMap(planData);
                searchMap['agencyCode'] = page.agencyCode;
                searchMap['billType'] = 2;
                searchMap['status'] = 1;
                searchMap['billId'] = window.ownerData.billId;
                return searchMap;
            },
            setChildTable: function (data) {
                var columns = page.getChildBudgetHead();
                for (var i = 0; i < data.length; i++) {
                    var curRow = data[i];
                    for (var j = 0; j < page.planDataself.planVo_Items.length; j++) {
                        var item = page.planDataself.planVo_Items[j];
                        var idField = bg.shortLineToTF(item.eleFieldName);
                        var itemValue = curRow[idField];
                        var textField = bg.shortLineToTF(item.eleFieldName + '_NAME');
                        curRow[idField] = $.bof(itemValue, ' ');
                        curRow[textField] = itemValue;
                    }
                }
                $('#decompose-data').ufDatagrid({
                    data: data,
                    idField: 'bgItemCode', //用于金额汇总
                    pId: 'billId', //用于金额汇总
                    disabled: false, //可选择
                    frozenStartColumn: 1, //冻结开始列,从1开始
                    frozenEndColumn: 1, //冻结结束列
                    paginate: true, //分页
                    columns: columns,
                    toolbar: [{
                        type: 'checkbox',
                        class: 'check-all disabled',
                        text: '全选'
                    },
                    {
                        type: 'button',
                        class: 'btn-default btn-delete btn-permission disabled',
                        text: '删除',
                        action: function () {
                            var checkData = $('#decompose-data').getObj().getCheckData();
                            if (checkData.length == 0) {
                                ufma.alert('请选择要删除的指标！', 'warning');
                                return false;
                            } m
                            var data = [];
                            for (var i = 0; i < checkData.length; i++) {
                                var rowData = checkData[i];
                                data.push({ 'bgItemId': rowData.bgItemId });
                            }
                            page.delItems(data);
                            //page.delItems(checkData);
                        }
                    }],
                    initComplete: function (options, data) {
                        $('#decompose-data').off("click", '.btn-delete').on('click', '.btn-delete', function (e) {
                            e.stopPropagation();
                            var rowid = $(this).closest('tr').attr('id');
                            var rowData = $('#decompose-data').getObj().getRowByTId(rowid);
                            page.delItems([rowData]);
                        });
                    }
                });
                if ($.isNull(page.planDataself)) {
                    return false;
                }
                ufma.isShow(reslist);
                $('#decompose-datamoneybgItemCur').attr("maxlength", "20");//控制金额列输入不可超出20位
            },
            getAdjustHead: function () { //页面上面待分解指标表
                var columns = [];
                var column1 = [        //支持多表头
                    { field: 'bgItemCode', name: '指标编码', rowspan: 2, width: 100, headalign: 'center' },
                    { field: 'bgPlanName', name: '预算方案', rowspan: 2, width: 100, headalign: 'center' },
                    {
                        field: 'bgItemSummary',
                        name: '摘要',
                        rowspan: 2,
                        className: 'ellipsis',
                        width: 200,
                        headalign: 'center'
                    }
                ];
                if (!$.isNull(page.planData)) {
                    for (var i = 0; i < page.planData.planVo_Items.length; i++) {
                        var item = page.planData.planVo_Items[i];
                        var cbItem = item.eleCode;
                        column1.push({
                            field: bg.shortLineToTF(item.eleFieldName),
                            name: item.eleName,
                            rowspan: 2,
                            width: 240,
                            headalign: 'center'
                        });
                    }
                    ;
                }
                column1.push({
                    field: 'bgItemCur',
                    name: '金额',
                    width: 150,
                    headalign: 'center',
                    align: 'right',
                    render: function (rowid, rowdata, data) {
                        return $.formatMoney(data, 2);
                    }
                });
                column1.push({
                    field: 'bgItemBalanceCur',
                    name: '余额',
                    width: 150,
                    headalign: 'center',
                    align: 'right',
                    render: function (rowid, rowdata, data) {
                        return $.formatMoney(data, 2);
                        ;
                    }
                });
                column1.push({
                    type: 'toolbar',
                    field: 'option',
                    name: '操作',
                    width: 60,
                    rowspan: 2,
                    headalign: 'center',
                    render: function (rowid, rowdata, data) {
                        return '<button class="btn btn-watch-detail btn-log btn-permission disabled" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';
                    }
                });
                columns.push(column1);
                return columns;
            },
            setAdjustTable: function (data) {
                $('#zbtz-data-editor').ufDatagrid({
                    data: data,
                    idField: 'bgItemCode',//用于金额汇总
                    pId: 'pid',      //用于金额汇总
                    disabled: false,    //可选择
                    paginate: false,     //分页
                    columns: page.getAdjustHead(),
                    initComplete: function (options, data) {
                        $('#zbtz-data-editor tr').on('click', '.btn-log', function (e) {
                            //e.stopPropagation();
                            var rowid = $(this).closest('tr').attr('id');
                            var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
                            _bgPub_showLogModal("budgetItemDecomposeEdit", {
                                "bgBillId": rowData.billId,
                                "bgItemCode": "",
                                "agencyCode": page.agencyCode
                            });
                        });
                    }
                });
                ufma.isShow(reslist);
            },
            adjGridTop: function ($table) {
                $.timeOutRun(null, null, function () {
                    var gridTop = $table.offset().top;
                    var gridHeight = $('.ufma-layout-down').offset().top - gridTop - 15;
                    $table.getObj().setBodyHeight(gridHeight);
                }, 800);
            },
            setSearchMap: function () {
                var searchMap = { 'agencyCode': page.agencyCode };
                searchMap['billType'] = 2;
                searchMap['setYear'] = page.pfData.svSetYear;
                searchMap['billId'] = window.ownerData.billId;
                return searchMap;
            },
            getBudgetPlan: function (tempData2) {
                var url = _bgPub_requestUrlArray[1] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear + "&bgPlanChrId=" + page.curBgPlanDataChrId + "&bgPlanChrCode=" + page.curBgPlanDataChrCode;
                var argu = "";
                var callback = function (result) {
                    page.planDataself = result.data[0];
                    page.setChildTable(tempData2);
                    $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                    if (billData[0].status == "1") {
                        $("#btn-save").removeClass("hide");
                        $("#btn-newRow-decompose").removeClass("hide");
                        $('#decompose-data .btn-delete').removeClass('disabled');
                        $('#decompose-data .check-all').removeClass('disabled');
                        $('#zbtz-data-editor .btn-watch-detail').removeClass('disabled');

                    }
                    else {
                        $("#btn-save").addClass("hide");
                        $("#btn-newRow-decompose").addClass("hide");
                        $('#decompose-data .btn-delete').attr('disabled', 'disabled');
                        $('#decompose-data .check-all').attr('disabled', 'disabled');
                        $('#zbtz-data-editor .btn-watch-detail').attr('disabled', 'disabled');
                    }
                }
                ufma.get(url, argu, callback);
            },
            initPage: function () {
                page.setBillCode();
                page.getDecomposedData();
                page.curBill = ufma.getObjectCache('curBillData');
                page.billCode = page.curBill.billCode;
                $('#billCode').val(page.curBill.billCode);
            },
            getDecomposedData: function () {
                var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
                var argu = page.setSearchMap();
                var callback = function (result) {
                    billData = result.data.billWithItemsVo;
                    $('#createDate1').getObj().setValue(billData[0].billDate);
                    var tempData1 = [];
                    var tempData2 = [];
                    for (var i = 0; i < billData[0].billWithItems.length; i++) {
                        if (billData[0].billWithItems[i].adjustDir == 2) {
                            tempData1.push(billData[0].billWithItems[i]);
                            page.setAdjustTable(tempData1);
                        } else {
                            tempData2.push(billData[0].billWithItems[i]);
                            page.curBgPlanDataChrId = tempData2[0].bgPlanId;
                            page.curBgPlanDataChrCode = tempData2[0].bgPlanCode;


                        }
                    }
                    page.getBudgetPlan(tempData2);
                }
                ufma.post(url, argu, callback);
            },
            setBillCode: function () {
                if ($.isNull(window.ownerData.billId)) {
                    var url = _bgPub_requestUrlArray_subJs[14];
                    var argu = { 'agencyCode': page.agencyCode, "setYear": page.pfData.svSetYear };
                    argu['billType'] = 2;
                    var callback = function (result) {
                        page.billId = result.data.billId;
                        //page.billCode = result.data.billCode;
                        //$('#billCode').val(page.billCode);
                    }
                    ufma.get(url, argu, callback);
                } else {
                    page.billId = window.ownerData.billId;

                }
            },
            getRowsSum: function () {
                var rowsSum = $('#decompose-data').getObj().getData();
                var sum = 0;
                for (var i = 0; i < rowsSum.length; i++) {
                    sum = sum + parseFloat(rowsSum[i].bgItemCur);
                }
                return sum;
            },
            save: function () {
                var detailItems = $('#decompose-data').getObj().getData();
                var selectedItems = $('#zbtz-data-editor').getObj().getData();
                selectedItems[0].adjustDir = 2;
                selectedItems[0].isNew = '是';
                var billHJJE = 0.00;
                /*if(detailItems==null||detailItems==''){
                    ufma.showTip("请先选择一条指标!", "warning");
                }*/
                //暂不能用,已分解过指标报错 重复保存 现在代码仅支持新增一行
                var x = detailItems.length - addData.length;
                for (var i = x; i < detailItems.length; i++) {
                    if (detailItems[i].adjustDir != 1) {
                        // billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgItemCur);

                        var newData = $.extend(true, addData[i - x], {
                            adjustDir: 1,
                            bgReserve: 1,
                            bgItemParentid: selectedItems[0].bgItemId,
                            bgItemParentcode: selectedItems[0].bgItemCode
                        });
                        detailItems[i] = $.extend(true, newData, detailItems[i]);

                    } else {   //缺少如果被改变  isnew给为是
                        detailItems[i].isNew = '否'
                    }
                }
                for (var i = 0; i < detailItems.length; i++) {
                    billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgItemCur);
                }
                selectedItems[0].billCur = billHJJE;
                selectedItems[0].bgCutCur = billHJJE;
                selectedItems[0].checkCutCur = billHJJE;
                var items = [];
                items.push(selectedItems[0]);
                for (var i = 0; i < detailItems.length; i++) {
                    items.push(detailItems[i]);
                }
                if (ufma.parseFloat(selectedItems[0].realBgItemCur) >= billHJJE) {
                    var data = {
                        'agencyCode': page.agencyCode,
                        'billId': page.billId,
                        'billCur': ufma.parseFloat(selectedItems[0].realBgItemCur),
                        'billCode': page.billCode,
                        'setYear': page.pfData.svSetYear,
                        'createDate': page.pfData.svSysDate,
                        'billDate': page.pfData.svTransDate,
                        'createUser': page.pfData.svUserCode,
                        'createUserName': page.pfData.svUserName,
                        'isNew': '否',
                        'status': 1,
                        'latestOpDate': page.pfData.svSysDate,
                        'billType': 2,
                        'items': items
                    };
                    var url = _bgPub_requestUrlArray_subJs[4] + "?billType=2&agencyCode=" + page.agencyCode + '&setYear=' + ufma.getCommonData().svSetYear;
                    var callback = function (result) {
                        if (result.flag == "success") {
                            ufma.showTip("保存成功", null, "success");
                            bCanLeave = true;
                            //page.timeline.next();
                            //page.ctrlToolBar();
                        } else {
                            ufma.showTip("保存失败!" + result.msg, null, "error");
                        }

                    }
                    ufma.post(url, data, callback);
                } else {
                    ufma.showTip("分解指标金额之和不可大于待分解指标金额,请修改!", "warning");
                }


            },
            /*  delItems: function (data) {
                  function updateTable() {
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          var trId = 'decompose-data_row_' + item.bgItemCode;
                          $('tr[id="' + trId + '"]').remove();
                      }
                  }
  
                  ufma.confirm('您确定要删除所选择指标吗？', function (ac) {
                      if (ac) {
                          //if(window.ownerData.action == 'edit') {
                          var argu = {
                              'agencyCode': page.agencyCode,
                              'setYear': page.pfData.svSetYear,
                              'latestOpUser': page.pfData.svUserCode,
                              'latestOpUserName': page.pfData.svUserName,
                              'items': data
                          };
                          var url = _bgPub_requestUrlArray_subJs[5] + "?billType=2&agencyCode=" + page.agencyCode;
                          var callback = function (result) {
                              ufma.showTip('指标已删除！', function () {
                                  updateTable();
                              }, 'success');
                          };
                          $.ufajax(url, 'post', argu, callback);
                      }
                  }, {'type': 'warning'});
              },*/
            delItems: function (data) {
                function updateTable() {
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var trId = 'decompose-data_row_' + item.bgItemCode;
                        $('tr[id="' + trId + '"]').remove();
                        //item.shouldSave = "1";
                    }
                }
                ufma.confirm('您确定要删除所选择指标吗？', function (ac) {
                    if (ac) {
                        var argu = {
                            'agencyCode': page.agencyCode,
                            'setYear': page.pfData.svSetYear,
                            'latestOpUser': page.pfData.svUserCode,
                            'latestOpUserName': page.pfData.svUserName,
                            'items': data
                        };
                        var url = _bgPub_requestUrlArray_subJs[5] + "?billType=2&agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
                        var callback = function (result) {
                            ufma.showTip('指标已删除！', function () {
                                bCanLeave = false;
                                updateTable();
                                $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                            }, 'success');
                        };
                        $.ufajax(url, 'post', argu, callback);
                    }
                }, { 'type': 'warning' });
            },
            getRowsSum: function () {
                var rowsSum = $('#decompose-data').getObj().getData();
                var sum = 0;
                for (var i = 0; i < rowsSum.length; i++) {
                    sum = sum + parseFloat(rowsSum[i].bgItemCur);
                }
                return sum;
            },
            closeCheck: function (eleCdtn) {
                var tblData = $('#decompose-data').getObj().getData();
                if (!page.checkCanLeave()) {
                    ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
                        if (rst) {
                            _close();
                        }
                    }, {
                            'type': 'warning'
                        });
                } else if (tblData.length == 0) {
                    ufma.showTip('分解子指标为空,请先新增一条分解子指标！', function () { }, 'error');
                } else {
                    _close();
                }
            },
            checkCanLeave: function () {
                var tblObj = $('#decompose-data').getObj();
                var dt = tblObj.getData();

                /*for(var i=0; i< dt.length; i++){
                    if(!$.isNull(dt[i].shouldSave) && dt[i].shouldSave == "1"){
                        bCanLeave = false;
                        return bCanLeave;
                    }
                }*/
                bCanLeave = true;
                return bCanLeave;
            },
            onEventListener: function () {

                $('#btn-save').click(function () {
                    $.timeOutRun(null, null, function () {
                        page.save();
                    }, 300);
                });

                $('#btn-close').click(function () {
                    page.closeCheck();
                });
                $('.btn-more-item').click(function () {
                    page.adjGridTop($('#select-data'));
                });
                $('#zbtz-data-editor').on('keyup', 'input[name="bgItemFpedCur"]', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var $row = $(this).closest('tr');
                    var blCur = $row.find('td[name="bgItemBalanceCur"] .cell-label').text();
                    blCur = blCur.replaceAll(',', '');
                    var val = $(this).val();
                    if (val == '') val == 0.00;
                    var hj = parseFloat(blCur) - val;
                    $row.find('td[name="bgItemCurHJ"] .cell-label').html($.formatMoney(hj));
                    if (hj < 0) {
                        ufma.showTip('可分配金额不足！', function () {
                        }, 'warning');
                        $('#btn-save').attr('disabled', 'disabled');
                    } else {
                        $('#btn-save').removeAttr('disabled', 'disabled');
                    }
                });
                /**
                 * 上传附件
                 */
                $('#btnUploadFile').on('click', function (e) {
                    e.stopPropagation();
                    var modal_billAttachment = [];
                    var option = {
                        "agencyCode": page.agencyCode,
                        "billId": page.billId,
                        "uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.pfData.svSetYear,
                        "delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.pfData.svSetYear,
                        "downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.pfData.svSetYear,
                        "onClose": function (fileList) {
                            $("#billFJ").val(fileList.length + "");
                            modal_billAttachment = cloneObj(fileList);
                        }
                    };
                    _bgPub_ImpAttachment("pnl-tzzb", "指标单据[" + page.billCode + "]附件导入", modal_billAttachment, option);

                });
                /**
                 * 模态框表格-新增一行[本质就是获得一条指标]
                 * 特点：手工录入 + 新增未审核 + 可执行指标
                 */
                $('#btn-newRow-decompose').click(function () {
                    ufma.get(_bgPub_requestUrlArray_subJs[3] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear,//3  新增一条指标
                        {
                            "bgPlanChrId": page.planDataself.chrId,
                            "bgPlanChrCode": page.planDataself.chrCode,
                            "agencyCode": page.agencyCode,
                            "setYear": page.pfData.svSetYear,
                            "billType": '2',
                            "bgReserve": '2'
                        },
                        function (result) {
                            if (result.flag == "success") {
                                addData.push(result.data);
                                var newRow = page.getChildBudgetHead();
                                var newdata = {};
                                for (var i = 0; i < newRow[0].length; i++) {
                                    if (i == 1) {
                                        newdata[newRow[0][i].field] = result.data.bgItemCode;
                                    } else {
                                        newdata[newRow[0][i].field] = "";
                                    }
                                }
                                var newData = $.extend(true, newdata, { bgItemId: addData.bgItemId });
                                newdata.bgItemId = result.data.bgItemId;
                                var obj = $('#decompose-data').getObj(); //取对象
                                var newId = obj.add(newData);
                            }
                        });


                });
                /*$(document).on('mousedown', '#decompose-data .btn-del', function (e) {
                    e.stopPropagation();
                    var rowid = $(this).closest('tr').attr('id');
                    //var rowData = $('#decompose-data').getObj().getRowByTId(rowid);
                    var obj = $('#decompose-data').getObj(); //取对象
                    obj.del(rowid);
                    $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                });*/
            },
            //此方法必须保留
            init: function () {
                reslist = ufma.getPermission();
                ufma.isShow(reslist);
                page.pfData = ufma.getCommonData();
                ufma.parse();
                uf.parse();
                page.agencyCode = window.ownerData.agencyCode;
                this.initPage();
                this.onEventListener();
                //修改  编辑界面不可修改单据日期  guohx
                $("#createDate1 input").attr("disabled", "disabled");
                $("#createDate1 span").hide();
                $("#createDate1").css("background", "#eee");
            }
        }
    }();
    /////////////////////
    page.init();
});

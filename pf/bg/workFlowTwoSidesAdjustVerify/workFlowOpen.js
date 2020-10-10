$(function () {
  window._close = function () {
    if (window.closeOwner) {
      window.closeOwner();
    }
  };
  var page = function () {
    var ptData = ufma.getCommonData();
    var state; //判断必填项是否为空
    var inAdjustTable, outTable, outAdjustTable;
    var afterMoney = 0;
    var inAttachment = []; //单据的附件
    var inFileLeng = 0; //调入实际上传文件数
    var outFileLeng = 0; //调出实际上传文件数
    var saveAllData;
    var inSumMoney = 0;
    var pageAttachNum = 0; //后端返回的附件
    var arrayData = [];
    //编辑时查看调出
    var outSendDocNum = ''; //发文文号|| 指标id
    var outComeDocNum = ''; //来文文号
    var outDocNumToId = ''; //是否采购
    var outUpBudgetNeed = true; //判断用：发文文号|| 指标id
    var inHeight = 80; //第一个表格高度
    var adjestHeight = 120; //第二个表格高度
    var outHeight = 180; //第三个表格高度
    var targetNum = 0; //判断可输入金额框位置
    return {
      //初始化第一个表格
      initAdjustInTable: function () {
        if (inAdjustTable) {
          $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          inAdjustTable.fnDestroy();
        }
        var tblId = 'adjustInTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          data: "bgItemCode",
          title: "指标编码",
          className: "isprint nowrap",
          // width: "90px"
        },
        // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
        {
          data: "bgTypeName",
          title: "指标类型",
          className: "isprint nowrap BGTenLen", 
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "isprint nowrap BGThirtyLen",
          // width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (outComeDocNum == "是") {
          columns.push({
            data: "comeDocNum",
            title: "来文文号",
            className: "print BGThirtyLen nowrap",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
          });
        }
        var name = '';
        if (outDocNumToId == true) {
          name = '指标id';
        } else {
          name = '发文文号';
        }
        if (outSendDocNum == "是") {
          columns.push({
            data: "sendDocNum",
            title: name,
            className: "print BGThirtyLen nowrap",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
          });
        }
        //批复金额名称修改为‘年初预算’
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: "print tr nowrap",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (data == '') {
              return 0;
            } else {
              return $.formatMoney(data, 2);
            }
          }
        });
        //可执行总额名称修改为‘调整后预算’
        columns.push({
          data: "realBgItemCur",
          title: "调整后预算",
          className: "isprint nowrap tr",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "指标余额",
          className: "isprint nowrap tr",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            //如果单据 状态为3，则用bgItemBalanceCur+bgAddCur；反之取bgItemBalanceCur
            var moneyAll = rowdata.bgItemBalanceCur - rowdata.bgAddCur;
            if (saveAllData.status != "3") {
              return $.formatMoney(rowdata.bgItemBalanceCur, 2);
            } else {
              return $.formatMoney(moneyAll, 2);
            }
          }
        });
        columns.push({
          //data: "dispenseCurOut",
          data: "bgAddCur",
          title: "调入金额",
          className: "print tr nowrap",
          // width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        //调剂后金额修改名称为‘调剂后余额’
        columns.push({
          data: "afterDispenseCur",
          title: "调剂后余额",
          className: "print tr afterDispenseMoney nowrap",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            //如果单据 状态不为3，则用bgItemBalanceCur+bgAddCur；反之取bgItemBalanceCur
            if (saveAllData.status != "3") {
              var moneyAll = rowdata.bgItemBalanceCur + rowdata.bgAddCur;
              return $.formatMoney(moneyAll, 2);
            } else {
              return $.formatMoney(rowdata.bgItemBalanceCur, 2);
            }
          }
        });
        //指标调入指标加一列字段：调剂后总额，放在调剂后余额后面。调剂后总额就是可执行总额加调入金额。用来显示总额的变化
        //调剂后总额列: 调入指标，如果status == 3，就取realBgItemCur，如果status!=3 ，就取realBgItemCur+调入金额；
        columns.push({
          data: "allMoney",
          title: "调剂后总额",
          className: "print tr nowrap",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (saveAllData.status != "3") {
              var moneyAll = rowdata.realBgItemCur + rowdata.bgAddCur;
              return $.formatMoney(moneyAll, 2);
            } else {
              return $.formatMoney(rowdata.realBgItemCur, 2);
            }
          }
        }); 
        //获取辅助核算项
        for (var index = 0; index < saveAllData.eleValueList.length; index++) {
          var item = saveAllData.eleValueList[index];
          var cbCode = item.bgItemCode;
          var cbName = item.eleName;
          if (!$.isNull(cbCode)) {
            if (cbCode != 'ISUPBUDGET') {
              columns.push({
                title: cbName,
                data: page.shortLineToTF(cbCode), //转为驼峰
                className: 'nowrap BGThirtyLen',
                // width: 250,
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            } else {
              columns.push({
                data: "isUpBudget",
                title: "是否采购",
                // width: 120,
                className: 'nowrap tc',
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            }
          }
        }
        columns.push({
          data: "remark",
          title: "备注",
          className: "print BGThirtyLen nowrap",
          // width: "80px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        });
        var opts = {
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "bFilter": true,
          "bAutoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "paging": false,
          "scrollY": inHeight,
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#adjustInTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#adjustInTable_wrapper').width();
            var tableWidth = $('#adjustInTable').width();
            if (tableWidth > wrapperWidth) {
              $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
          }
        }

        inAdjustTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取第一个表格数据
      showAdjustInTblData: function (data) {
        inAdjustTable.fnClearTable();
        if (data.length != 0) {
          if (data.length > 2) {
            inHeight = 120;
          }
          inAdjustTable.fnAddData(data, true);
        }
        //模拟滚动条
        $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar({
          hScrollbar: true,
          mousewheel: false
        });
        ufma.setBarPos($(window));
      },
      //初始化第二个表格
      initAdjustOutTable: function () {
        if (outAdjustTable) {
          $('#adjustOutTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          outAdjustTable.fnDestroy();
        }
        var tblId = 'adjustOutTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          data: "bgItemCode",
          title: "指标编码",
          className: "isprint nowrap bgItemCodeRow",
          // width: "90px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '" rowIndex ="' + meta.row + '" >' + data + '</span>';
            } else {
              return '';
            }

          }
        }, 
        // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
        {
          data: "bgTypeName",
          title: "指标类型",
          className: "isprint nowrap BGTenLen", 
        },{
          data: "bgItemSummary",
          title: '摘要',
          className: "isprint nowrap BGThirtyLen",
          // width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span index="' + meta.row + '" title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (outComeDocNum == "是") {
          columns.push({
            data: "comeDocNum",
            title: "来文文号",
            className: "print BGThirtyLen nowrap",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
              if (!$.isNull(data)) {
                return '<span title="' + data + '">' + data + '</span>';
              } else {
                return '';
              }
            }
          });
        }
        var name = '';
        if (outDocNumToId == true) {
          name = '指标id';
        } else {
          name = '发文文号';
        }
        if (outSendDocNum == "是") {
          columns.push({
            data: "sendDocNum",
            title: name,
            className: "print BGThirtyLen nowrap",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
              if (!$.isNull(data)) {
                return '<span title="' + data + '">' + data + '</span>';
              } else {
                return '';
              }
            }
          });
        }
        //批复金额名称修改为‘年初预算’
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: "print tr nowrap",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (data == '') {
              return 0;
            } else {
              return $.formatMoney(data, 2);
            }
          }
        });
        //可执行总额名称修改为‘调整后预算’
        columns.push({
          data: "realBgItemCur",
          title: "调整后预算",
          className: "isprint nowrap tr",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "指标余额",
          className: "isprint nowrap tr",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            //调出的余额bgItemBalanceCur + bgCutCur
            var moneyAll = rowdata.bgItemBalanceCur + rowdata.bgCutCur;
            return $.formatMoney(moneyAll, 2);
          }
        });
        columns.push({
          //data: "dispenseCurOut",
          data: "bgCutCur",
          title: "调出金额",
          className: "print tr dispenseCurOut nowrap",
          // width: "150px"
        });
        //调剂后金额修改名称为‘调剂后余额’
        columns.push({
          data: "afterDispenseCur",
          title: "调剂后余额",
          className: "print tr afterDispenseMoney nowrap",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (afterMoney == 0) {
              return $.formatMoney(rowdata.bgItemBalanceCur, 2);
            }
          }
        });
        //获取辅助核算项
        for (var index = 0; index < saveAllData.eleValueList.length; index++) {
          var item = saveAllData.eleValueList[index];
          var cbCode = item.bgItemCode;
          var cbName = item.eleName;
          if (!$.isNull(cbCode)) {
            if (cbCode != 'ISUPBUDGET') {
              columns.push({
                title: cbName,
                data: page.shortLineToTF(cbCode), //转为驼峰
                className: 'nowrap BGThirtyLen',
                // width: 250,
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            } else {
              columns.push({
                data: "isUpBudget",
                title: "是否采购",
                // width: 120,
                className: 'nowrap tc',
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            }
          }
        }
        columns.push({
          data: "remark",
          title: "备注",
          className: "print remark BGThirtyLen nowrap",
          // width: "80px"
        });
        if (outSendDocNum == "是" || outComeDocNum == "是") {
          targetNum = 6;
        }
        if (outSendDocNum == "是" && outComeDocNum == "是") {
          targetNum = 7;
        } else {
          targetNum = 5;
        }
        var opts = {
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "bFilter": true,
          "bAutoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "paging": false,
          "scrollY": adjestHeight,
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          "columnDefs": [{
              "targets": [targetNum],
              "serchable": false,
              "orderable": false,
              "render": function (data, type, rowdata, meta) {
                return '<input onfocus="this.select()" class="form-control carryDownCurInput" style="width:120px;text-align:right" type="text" value="' + $.formatMoney(data, 2) + '" >';
              }
            },
            {
              "targets": [-1],
              "serchable": false,
              "orderable": false,
              "render": function (data, type, rowdata, meta) {
                var editEnable = '';
                if (saveAllData.editEnable == false) {
                  editEnable = 'disabled';
                } else {
                  editEnable = '';
                }
                return '<input class="form-control remarkInput" style="width:120px;" type="text" ' + editEnable + ' value="' + data + '" >';
              }
            }
          ],
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            $('.carryDownCurInput').amtInputNull();
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#adjustOutTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#adjustOutTable_wrapper').width();
            var tableWidth = $('#adjustOutTable').width();
            if (tableWidth > wrapperWidth) {
              $('#adjustOutTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('#adjustOutTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
          }
        }

        outAdjustTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取第二个表格数据
      showAdjustOutTblData: function (data) {
        outAdjustTable.fnClearTable();
        if (data.length != 0) {
          if (data.length > 2) {
            adjestHeight = 120;
          }
          outAdjustTable.fnAddData(data, true);
        }
        //模拟滚动条
        $('#adjustOutTable').closest('.dataTables_wrapper').ufScrollBar({
          hScrollbar: true,
          mousewheel: false
        });
        ufma.setBarPos($(window));
      },
      //显示预算方案
      initSearchPnl: function () {
        var argu = {
          agencyCode: saveAllData.agencyCode,
          setYear: ptData.svSetYear,
          rgCode: ptData.svRgCode
        }
        ufma.get('/bg/sysdata/getBgPlanArray', argu, function (result) {
          $('#cbBgPlan').ufCombox({ //初始化
            idField: "chrId",
            textField: "chrName",
            data: result.data, //列表数据
            readonly: true, //可选
            placeholder: "请选择预算方案",
            onChange: function (sender, data) {
              page.planData = data;
              page.initBgPlanItemPnl($('#searchPlanPnl'), data);
              $('#outTable').removeClass('hide');
              page.initOutTable();
              // setTimeout(function() {
              // 	page.showOutTblData();
              // }, 500);
            },
            onComplete: function (sender) {
              ufma.hideloading();
              if (result.data.length > 0) {
                $('#cbBgPlan').getObj().val(result.data[0].chrId);
              }
            }
          });
        });
      },
      //显示更多
      initBgPlanItemPnl: function ($pnl, planData) {
        if (planData != null) {
          var items = planData.planVo_Items;
        }
        var $curRow = $('#planItemMore');
        $curRow.html('');
        for (var i = 0; i < items.length; i++) {
          $curgroup = $('<div class="form-group"style="margin-top:8px;width:30em;margin-left:-2em;"></div>').prependTo($curRow);
          var item = items[i];
          $('<lable class="control-label auto" style="display:inline-block;width:10em;text-align: right; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          var formCtrl = $('<div id="cb' + item.eleCode + '" class="ufma-treecombox" style=" width:270px;"></div>').appendTo($curgroup);
          var param = {};
          param['agencyCode'] = planData.agencyCode;
          param['setYear'] = ufma.getCommonData().svSetYear;
          param['eleCode'] = item.eleCode;
          param['eleLevel'] = item.eleLevel;
          var treecombox = $('#cb' + item.eleCode);
          bg.cacheDataRun({
            element: treecombox,
            cacheId: param['agencyCode'] + param['eleCode'],
            url: bg.getUrl('bgPlanItem'),
            param: param,
            eleName: item.eleName,
            callback: function (ele, data, tmpEleName) {
              $(ele).ufTreecombox({ //初始化
                idField: 'id',
                textField: "codeName",
                label: true,
                readOnly: false,
                data: data, //列表数据
                placeholder: "请选择" + tmpEleName,
                onchange: function (sender, data) {

                },
                onComplete: function (sender) {

                }
              });
            }
          });
          var sId = "cb" + item.eleCode;
          $('#' + sId).off("keyup").on("keyup", function (e) {
            if (e.keyCode == 8) { //退格键，支持删除
              e.stopPropagation();
              var subId = $(e.target).attr("id").replace("_input_show", "");
              subId = subId.replace("_input", "");
              $('#' + subId + '_value').val('');
              $('#' + subId + '_input').val('');
              $('#' + subId + '_input_show').val('');
              $('#' + subId + '_text').val('');
            }
          });
        }
      },
      //转换为驼峰
      shortLineToTF: function (str) {
        var arr = str.split("_");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].toLowerCase();
        }
        for (var i = 1; i < arr.length; i++) {
          arr[i] = arr[i].toLowerCase()
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
        }
        return arr.join("");
      },
      //加载第三个表格
      initOutTable: function () {
        if (outTable) {
          $('#outTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          outTable.fnDestroy();
        }
        var tblId = 'outTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          title: '<input type="checkbox" style="	transition: all .3s;top: 1px;left: 0;height: 18px;width: 18px;border: 1px solid #d9d9d9;background-color: #fff;line-height: 20px;font-weight: 400;border-radius: 4px;" class="checkboxes check_H"/>&nbsp;',
          data: "code",
          className: 'nowrap tc',
          width: 40
        }, {
          data: "bgItemCode",
          title: "指标编码",
          className: "isprint nowrap BGasscodeClass",
          // width: "90px"
        },
        // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
        {
          data: "bgTypeName",
          title: "指标类型",
          className: "isprint nowrap BGTenLen", 
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "isprint nowrap BGThirtyLen",
          // width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (page.planData.isComeDocNum == "是") {
          columns.push({
            data: "comeDocNum",
            title: "来文文号",
            className: "print BGThirtyLen",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
          });
        }
        if (page.planData.isSendDocNum == "是") {
          columns.push({
            data: "sendDocNum",
            title: page.sendCloName,
            className: "print BGThirtyLen",
            // width: "250px",
            "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
          });
        }
        //获取辅助核算项
        for (var index = 0; index < page.planData.planVo_Items.length; index++) {
          var item = page.planData.planVo_Items[index];
          var cbCode = item.bgItemCode;
          var cbName = item.eleName;
          if (!$.isNull(cbCode)) {
            if (cbCode != 'ISUPBUDGET') {
              columns.push({
                title: cbName,
                data: page.shortLineToTF(cbCode), //转为驼峰
                className: 'nowrap BGThirtyLen',
                // width: 250,
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            } else {
              columns.push({
                data: "isUpBudget",
                title: "是否采购",
                // width: 120,
                className: 'nowrap tc',
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            }
          }
        }

        columns.push({
          data: "realBgItemCur",
          title: "金额",
          className: "bgPubMoneyCol isprint nowrap BGmoneyClass tr",
          // width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: "print BGmoneyClass tr",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (data == '') {
              return 0;
            } else {
              return $.formatMoney(data, 2);
            }
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "余额",
          className: "bgPubMoneyCol print BGmoneyClass tr",
          // width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        columns.push({
          data: "createUserName",
          title: "编制人",
          className: "print BGTenLen",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        });
        columns.push({
          data: "createDate",
          title: "编制日期",
          className: "print BGdateClass tc",
          // width: "150px"
        });
        columns.push({
          data: "checkUserName",
          title: "审核人",
          className: "print BGTenLen",
          // width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        });
        columns.push({
          data: "checkDate",
          title: "审核日期",
          className: "print BGdateClass tc",
          // width: "150px"
        });
        columns.push({
          data: "bgItemOperCol",
          title: "操作",
          className: "notPrint",
          width: "40px"
        });
        var opts = {
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "bFilter": true,
          "bAutoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "paging": false,
          "scrollY": outHeight,
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          "columnDefs": [{
            "targets": [-1],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
              return '<a class="btn btn-icon-only btn-sm btn-watch-detail" row-index="' + meta.row + '" data-toggle="tooltip" rowid="' + data + '" title="日志">' +
                '<span class="glyphicon icon-log detailLog"></span></a>';
            }
          }, {
            "targets": [0],
            "serchable": false,
            "orderable": false,
            "className": "checktd",
            "render": function (data, type, rowdata, meta) {
              return '<input type="checkbox" class="checkboxes bodyCheckbox" data-bgItemId="' + rowdata.bgItemId + '" data-initType="' + rowdata.isYearInit + '" data-bgItemParentid="' + rowdata.bgItemParentid + '"  data-bgItemParentid="' + rowdata.bgItemCode + '" index="' + meta.row + '" />&nbsp; ';
            }
          }],
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#outTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#outTable_wrapper').width();
            var tableWidth = $('#outTable').width();
            if (tableWidth > wrapperWidth) {
              $('#outTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('#outTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
          }
        }
        outTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取第三个表格数据
      showOutTblData: function () {
        var bgItemListArr = [];
        for (var i = 0; i < saveAllData.itemDispenseInList.length; i++) {
          var bgItemList = {};
          bgItemList.bgItemId = saveAllData.itemDispenseInList[i].bgItemId;
          bgItemListArr.push(bgItemList);
        }

        var surl = "/bg/budgetItem/selectBudgetItemsForDispenseOut?agencyCode=" + saveAllData.agencyCode + "&rgCode=" + saveAllData.rgCode + "&setYear=" + saveAllData.setYear;
        var bgItemDefaults = {
          'bgPlanId': $('#cbBgPlan').getObj().getValue(),
          'items': bgItemListArr
        };
        ufma.showloading('数据加载中，请耐心等待...');
        ufma.post(surl, bgItemDefaults, function (result) {
          ufma.hideloading();
          //加载指标-增加、减少、余额-----end
          outTable.fnClearTable();
          page.allDataLength = result.data.length;
          if (result.data.length > 0) {
            if (result.data.length > 2) {
              outHeight = 120;
            }
            outTable.fnAddData(result.data, true);
          }
          //模拟滚动条
          $('#outTable').closest('.dataTables_wrapper').ufScrollBar({
            hScrollbar: true,
            mousewheel: false
          });
          ufma.setBarPos($(window));
        });
      },

      //初始化日历控件
      initDatePicker: function () {
        $('#dateStart').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: new Date(new Date(ptData.svTransDate).getFullYear(), 0, 1)
        });
        $('#dateEnd').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: ptData.svTransDate
        });
      },
      //获取所有  信息
      getAllData: function () {
        var billId = saveAllData.billId;
        var argu = {
          "billType": "4",
          "billId": billId
        }
        var sUrl = '/bg/budgetItem/getBudgetItemsByBill?agencyCode=' + saveAllData.agencyCode + "&rgCode=" + saveAllData.rgCode + "&setYear=" + saveAllData.setYear;
        ufma.post(sUrl, argu, function (result) {
          var bill = result.data;
          if (!$.isNull(bill)) {
            pageAttachNum = bill.attachNum;
            page.showAdjustInTblData(bill.itemDispenseInList);
            if (outAdjustTable && bill.itemDispenseOutList.length > 0) {
              page.showAdjustInTblData(bill.itemDispenseOutList);
            }
          }
        });
      },
      //获取附件
      getInfile: function () {
        var url = '/bg/attach/getAttachInfo?billId=' + saveAllData.billId + '&agencyCode=' + saveAllData.agencyCode + '&rgCode=' + saveAllData.rgCode + '&setYear=' + saveAllData.setYear
        ufma.get(url, {}, function (result) {
          inAttachment = [];
          if (result.data.length > 0) {
            for (var m = 0; m < result.data.length; m++) {
              inAttachment[inAttachment.length] = {
                "filename": result.data[m].fileName,
                "filesize": 0,
                "fileid": result.data[m].attachId,
                "createUser": result.data[m].createUser,
                "singleStatus": result.data[m].canDelete
              };
            }
          }
          inAttachment.flag = 'workFlow';
          inAttachment.createUser = saveAllData.createUserName;
          if (saveAllData.labStatus == 'done') {
            saveAllData.status = '3';
          }
          var option = {
            "agencyCode": saveAllData.agencyCode,
            "billId": saveAllData.billId,
            "uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "onClose": function (fileList) {
              page.getAllData();
              inFileLeng = fileList.length;
              attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
              $("#bgInput").val(attachNum);
              inAttachment = cloneObj(fileList);
            }
          };
          //bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
          _bgPub_ImpAttachment("inFilesPage", "调剂单[" + saveAllData.billCode + "]附件导入", inAttachment, option, saveAllData.status);

        });
      },
      doSaveBill_check: function () {
        if ($("#twosidesAdj_balanceMoney").attr("v") != "0") {
          ufma.showTip("调出总金额不等于调入总金额", null, "error");
          return false;
        } else {
          return true;
        }

      },
      //保存调入
      inSave: function () {
        var argu = {};
        argu.items = [];
        argu.setYear = saveAllData.setYear;
        //argu.billCur = parseFloat($("#twosidesAdj_outSumMoney").attr("v"));
        argu.createUser = ptData.svUserCode;
        argu.createUserName = ptData.svUserName;
        argu.billDate = $('#bg_twoSidesAdjModal_dtp').getObj().getValue(); //_bgPub_getUserMsg().busDate;
        argu.applicant = ptData.svUserCode;
        argu.applicantName = ptData.svUserName;
        argu.latestOpUser = ptData.svUserCode;
        argu.latestOpUserName = ptData.svUserName;
        argu.billId = saveAllData.billId;
        argu.billCode = saveAllData.billCode;
        argu.rgCode = ptData.svRgCode;
        argu.agencyCode = saveAllData.agencyCode;
        argu.createDate = saveAllData.createDate;
        argu.createUser = saveAllData.createUser;
        argu.latestOpDate = saveAllData.latestOpDate;
        argu.billType = saveAllData.billType;
        argu.summary = saveAllData.summary;
        argu.remark = saveAllData.remark;
        argu.status = "1";
        argu.attachment = saveAllData.attachment;
        //bug77471--zsj
        if ($("#bgInput").val() < inFileLeng) {
          ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
          return false;
        }
        argu.attachNum = $("#bgInput").val() //bug77471--zsj
        $('#adjustOutTable_wrapper').find("tbody tr td.bgItemCodeRow span").each(function () {
          var rowIndex = $(this).attr('rowIndex');
          var rowData = {}
          if (rowIndex) {
            rowData = outAdjustTable.api(false).row(rowIndex).data();
            var tabData = {}
            var dispenseCurOut = $(this).closest('tr').find(".dispenseCurOut .carryDownCurInput").val().replace(/,/g, "");
            var remark = $(this).closest('tr').find(".remark .remarkInput").val();
            if (dispenseCurOut > 0) {
              tabData.setYear = rowData.setYear;
              tabData.rgCode = ptData.svRgCode;
              tabData.agencyCode = rowData.agencyCode;
              tabData.bgItemId = rowData.bgItemId;
              tabData.detailSummary = rowData.detailSummary;
              tabData.bgAddCur = 0;
              tabData.checkAddCur = 0;
              tabData.bgCutCur = dispenseCurOut;
              tabData.remark = remark;
              tabData.checkCutCur = dispenseCurOut;
              tabData.adjustDir = 2;
              inSumMoney += parseFloat(dispenseCurOut);
            }
          }
          argu.items.push(tabData);
          var billCur = $("#twosidesAdj_outSumMoney").html().replace(/,/g, '');
          argu.totalOutCur = parseFloat(billCur);
        });
        //保存
        var sUrl = '/bg/budgetItem/multiPost/saveItemsDispenseOut?billType=' + this.billType;
        ufma.post(sUrl, argu, function (result) {
          if (page.inSaveAddFlag == true && result.flag == 'success') {
            ufma.showTip('保存成功', function () {}, result.flag);
            $("#btn-modal-close").trigger("click");
            $("#btn-add-twoSidesAdjItem").trigger("click");
          } else if (result.flag == 'success') {
            ufma.showTip('保存成功', function () {
              _close();
            }, result.flag);
          }
        });
      },
      onEventListener: function () {
        $('#btnClose').click(function () {
          _close();
        });
        $('#btnQuery').on('click', function () {
          page.showOutTblData();
        });
        //输入调出金额
        $("#adjustOutTable").on('blur', '.carryDownCurInput', function () {
          inSumMoney = 0;
          var minm = $(this).val().replace(/,/g, "");
          var maxm = $(this).closest('td').siblings().eq(targetNum - 1).html().replace(/,/g, "");
          //判断起始金额是否大于结束金额
          if (parseFloat(minm) > parseFloat(maxm)) {
            $(this).val('');
            ufma.showTip('调出金额不能大于指标余额', function () {}, 'warning');
            return false;
          } else if (parseFloat(minm) > 0) {
            $("#adjustOutTable").find('.carryDownCurInput').each(function () {
              if (parseFloat($(this).val().replace(/,/g, "")) > 0) {
                inSumMoney += parseFloat($(this).val().replace(/,/g, ""));
              }
            });
            afterMoney = parseFloat(maxm) - parseFloat(minm);
            $(this).closest('td').siblings().eq(targetNum).html($.formatMoneyNull(afterMoney));
            $("#twosidesAdj_outSumMoney").html($.formatMoney(inSumMoney, 2));
            $("#twosidesAdj_balanceMoney").html($.formatMoney((parseFloat(page.inMoney) - parseFloat(inSumMoney)), 2)); //差额=调入-调出
            afterMoney = 0;
            // $(this).val($.formatMoney(parseFloat(minm), 2))
          }
        });

        $(document).on('click', function (e) {
          if ($(e.target).is('.detailLog')) {
            var index = $(this).attr('row-index');
            var dt = outTable.api(false).row(index).data();
            _bgPub_showLogModal("inFilesPage", {
              "bgItemId": dt.bgItemId,
              "bgItemCode": dt.bgItemCode,
              "agencyCode": dt.agencyCode
            });
          } else if ($(e.target).is('.bodyCheckbox')) {
            $(e.target).css({
              "border": "1px solid #008ff0!important",
              "background-color": "#008ff0!important"
            });
            arrayData = [];
            arrayData = arrayData.concat(saveAllData.itemDispenseOutList);
            var arrayDataCode = [];
            if (saveAllData.labStatus == 'todo') {
              if ($('#outTable_wrapper').find('.bodyCheckbox:checked').length > 0) {
                $('#outTable_wrapper').find('.bodyCheckbox:checked').each(function () {
                  var rowIndex = $(this).attr('index');
                  var rowData = {};
                  if (rowIndex) {
                    rowData = outTable.api(false).row(rowIndex).data();
                    if ($("#adjustOutTable").find('.carryDownCurInput').length > 0 && rowIndex <= $("#adjustOutTable").find('.carryDownCurInput').length - 1) {
                      var bgItemCode = $("#adjustOutTable").find('td.bgItemCodeRow').eq(rowIndex).text();
                      if (rowData.bgItemCode == bgItemCode) {
                        rowData.bgCutCur = parseFloat($("#adjustOutTable").find('.carryDownCurInput').eq(rowIndex).val().replace(/,/g, ""));
                      }
                    }
                    if (arrayData.length > 0) {
                      for (var m = 0; m < arrayData.length; m++) {
                        if ($.inArray(arrayData[m].bgItemCode, arrayDataCode) == -1) {
                          arrayDataCode.push(arrayData[m].bgItemCode)
                        }
                      }
                      if ($.inArray(rowData.bgItemCode, arrayDataCode) == -1) {
                        arrayData.push(rowData);
                      }
                    } else {
                      arrayData.push(rowData);
                    }
                  }
                });
                page.showAdjustOutTblData(arrayData);
              } else {
                var emptyData = [];
                page.showAdjustOutTblData(emptyData);
              }
            } else if (saveAllData.labStatus == 'done') {
              page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
            }
            var num = page.allDataLength;
            var arr = $('#outTable_wrapper').find('.bodyCheckbox:checked').length;

            if (num == arr) {
              $(".check_H").prop('checked', true)
            } else {
              $(".check_H").prop('checked', false)
            }
          } else if ($(e.target).is('.check_H')) {
            if ($('#outTable_wrapper').find('.check_H:checked').length > 0) {
              $("#outTable_wrapper").find('.bodyCheckbox').prop('checked', true);
            } else {
              $("#outTable_wrapper").find('.bodyCheckbox').removeAttr('checked');
            }
            arrayData = [];
            if ($('#outTable_wrapper').find('.bodyCheckbox:checked').length > 0) {
              $('#outTable_wrapper').find('.bodyCheckbox:checked').each(function () {
                var rowIndex = $(this).attr('index');
                var rowData = {};
                arrayData = arrayData.concat(saveAllData.itemDispenseOutList);
                if (rowIndex) {
                  rowData = outTable.api(false).row(rowIndex).data();
                }
                if (arrayData.length > 0) {
                  for (var i = 0; i < arrayData.length; i++) {
                    if (rowData.bgItemId != arrayData[i].bgItemId) {
                      arrayData.push(rowData);
                    }
                  }
                } else {
                  arrayData.push(rowData);
                }
              });
              page.showAdjustOutTblData(arrayData);
            } else {
              page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
            }
          }
        });
        //保存
        $('#btnSave').on('click', function () {
          page.inSaveAddFlag = false;
          page.inSave();
        });
        //调入的保存并新增
        $("#saveAddAll").on("click", function () {
          page.inSaveAddFlag = true;
          page.inSave();
        });
        //附件导入
        $("#btnInFiles").off("click").on("click", function () {
          page.getInfile();
        });
      },
      //初始化页面
      initPage: function () {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.allDataLength = 0;
        saveAllData = window.ownerData;
        pageAttachNum = saveAllData.attchNum;
        outSendDocNum = saveAllData.outSendDocNum;
        outComeDocNum = saveAllData.outComeDocNum;
        outDocNumToId = saveAllData.outDocNumToId;
        outUpBudgetNeed = saveAllData.outUpBudgetNeed;
        page.needSendDocNum = window.ownerData.needSendDocNum;
        if (page.needSendDocNum == true) {
          page.sendCloName = "指标id";
        } else {
          page.sendCloName = "发文文号";
        }
        $('#twoSidesAdjModal_billCode').val(saveAllData.billCode);
        if (saveAllData.labStatus == 'todo') {
          page.initDatePicker();
          page.initSearchPnl();
          $('.changeTitle').html('调出指标');
          $('#bgInput').removeAttr('disabled');
          $('.changeTitle,.outPlan,#outTable,#saveAddAll,#btnSave').removeClass('hide');
        } else if (saveAllData.labStatus == 'done') {
          $('.changeTitle,.outPlan,#outTable,#saveAddAll,#btnSave').addClass('hide');
          $('#bgInput').attr('disabled', true);
        }
        page.initAdjustInTable();
        page.showAdjustInTblData(saveAllData.itemDispenseInList);
        page.initAdjustOutTable();
        page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
        $('#bgInput').val(saveAllData.attchNum);
        page.outMoney = saveAllData.totalOutCur;
        page.inMoney = saveAllData.billCur;
        var balanceMoney = saveAllData.diffCur;
        $("#twosidesAdj_inSumMoney").html($.formatMoney(parseFloat(page.inMoney), 2));
        $("#twosidesAdj_outSumMoney").html($.formatMoney(parseFloat(page.outMoney), 2));
        $("#twosidesAdj_balanceMoney").html($.formatMoney(parseFloat(balanceMoney), 2));
        $('#inAdjModal').html(saveAllData.createUserName);
      },

      init: function () {
        //获取session
        this.initPage();
        this.onEventListener();
        uf.parse();
        ufma.parse();
      }
    }
  }();

  page.init();
});
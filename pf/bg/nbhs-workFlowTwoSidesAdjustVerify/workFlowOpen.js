$(function () {
  window._close = function () {
    if (window.closeOwner) {
      window.closeOwner();
    }
  };
  var page = function () {
    var ptData = ufma.getCommonData();
    var state; //判断必填项是否为空
    var inAdjustTable, outTable, outAdjustTable, inOtable;
    var afterMoney = 0;
    var inAttachment = []; //单据的附件
    var inFileLeng = 0; //调入实际上传文件数
    var outFileLeng = 0; //调出实际上传文件数
    var saveAllData;
    var inSumMoney = 0;
    var pageAttachNum = 0; //后端返回的附件
    var arrayDataIn = []; //调入指标数据--第二个表格
    var arrayDataOut = []; //调出指标数据--第三个表格
    //编辑时查看调出
    var outSendDocNum = ''; //发文文号|| 指标id
    var outComeDocNum = ''; //来文文号
    var inSendDocNum = ''; //发文文号|| 指标id
    var inComeDocNum = ''; //来文文号
    var outDocNumToId = ''; //是否采购
    var outUpBudgetNeed = true; //判断用：发文文号|| 指标id
    var inHeight = 80; //第一个表格高度
    var adjestHeight = 120; //第二个表格高度
    var outHeight = 180; //第三个表格高度
    var targetNumIn = 0; //判断调入可输入金额框位置
    var targetNumOut = 0; //判断调出可输入金额框位置
    return {
      //显示预算方案
      initSearchPnl: function () {
        var argu = {
          agencyCode: saveAllData.agencyCode,
          setYear: ptData.svSetYear,
          rgCode: ptData.svRgCode
        }
        ufma.get('/bg/sysdata/getBgPlanArray', argu, function (result) {
          $('#cbBgPlanIn').ufCombox({ //初始化
            idField: "chrId",
            textField: "chrName",
            data: result.data, //列表数据
            readonly: true, //可选
            placeholder: "请选择预算方案",
            onChange: function (sender, data) {
              page.planDataIn = data;
              inComeDocNum = data.isComeDocNum
              inSendDocNum = data.isSendDocNum
              page.initBgPlanItemPnl($('#searchPlanPnlIn'), data);
              page.initInTable();
            },
            onComplete: function (sender) {
              ufma.hideloading();
              if (!$.isNull(saveAllData.bgPlanChrId)) {
                $('#cbBgPlanIn').getObj().val(saveAllData.bgPlanChrId);
              } else if (result.data.length > 0) {
                $('#cbBgPlanIn').getObj().val(result.data[0].chrId);
              }
            }
          });
          $('#cbBgPlanOut').ufCombox({ //初始化
            idField: "chrId",
            textField: "chrName",
            data: result.data, //列表数据
            readonly: true, //可选
            placeholder: "请选择预算方案",
            onChange: function (sender, data) {
              page.planData = data;
              outComeDocNum = data.isComeDocNum
              outSendDocNum = data.isSendDocNum
              saveAllData.eleValueList = data.planVo_Items;
              page.initBgPlanItemPnlOut($('#searchPlanPnlOut'), data);
              page.initOutTable();
            },
            onComplete: function (sender) {
              ufma.hideloading();
              if (!$.isNull(saveAllData.bgPlanChrId)) {
                $('#cbBgPlanOut').getObj().val(saveAllData.bgPlanChrId);
                page.planData = saveAllData.planDataIn
              } else if (result.data.length > 0) {
                $('#cbBgPlanOut').getObj().val(result.data[0].chrId);
              }
            }
          });
        });
      },
      //调入--显示更多
      initBgPlanItemPnl: function ($pnl, planData) {
        if (planData != null) {
          var items = planData.planVo_Items;
        }
        var $curRow = $('#in-planItemMore');
        $curRow.html('');
        for (var i = 0; i < items.length; i++) {
          $curgroup = $('<div class="form-group"style="margin-top:8px;width:30em;margin-left:-2em;"></div>').prependTo($curRow);
          var item = items[i];
          $('<lable class="control-label auto" style="display:inline-block;width:10em;text-align: right; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          if (item.eleCode != 'ISUPBUDGET') {
          var formCtrl = $('<div id="inCb' + item.eleCode + '" class="ufma-treecombox" style=" width:270px;"></div>').appendTo($curgroup);
          var param = {};
          param['agencyCode'] = planData.agencyCode;
          param['setYear'] = ufma.getCommonData().svSetYear;
          param['eleCode'] = item.eleCode;
          param['eleLevel'] = item.eleLevel;
          var treecombox = $('#inCb' + item.eleCode);
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
          var sId = "inCb" + item.eleCode;
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
        }else {
          var formCtrl = $('<div id="in-isUpBudget" class="typeTree uf-combox" style=" width:270px;"></div>').appendTo($curgroup);
          var isUpBudgetData = [{
            code: "1",
            pId: "*",
            isLeaf: 1,
            parentId: "",
            levelNum: 1,
            pCode: "",
            codeName: "是",
            name: "是",
            chrFullname: "是",
            eleCode: "",
            id: "1",
            isFinal: "",
            lastVer: "",
          }, {
            code: "0",
            pId: "*",
            isLeaf: 1,
            parentId: "",
            levelNum: 1,
            pCode: "",
            codeName: "否",
            name: "否",
            chrFullname: "否",
            eleCode: "",
            id: "0",
            isFinal: "",
            lastVer: "",
          }];
          $('#in-isUpBudget').ufCombox({
            idField: "id",
            textField: "codeName",
            placeholder: "请选择是否采购",
            data: isUpBudgetData, //json 数据 
            onChange: function (sender, data) {},
            onComplete: function (sender) {}
          });
        }
      } 
      },
      //调出--显示更多
      initBgPlanItemPnlOut: function ($pnl, planData) {
        if (planData != null) {
          var items = planData.planVo_Items;
        }
        var $curRow = $('#out-planItemMore');
        $curRow.html('');
        for (var i = 0; i < items.length; i++) {
          $curgroup = $('<div class="form-group"style="margin-top:8px;width:30em;margin-left:-2em;"></div>').prependTo($curRow);
          var item = items[i];
          $('<lable class="control-label auto" style="display:inline-block;width:10em;text-align: right; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          if (item.eleCode != 'ISUPBUDGET') {
          var formCtrl = $('<div id="outCb' + item.eleCode + '" class="ufma-treecombox" style=" width:270px;"></div>').appendTo($curgroup);
          var param = {};
          param['agencyCode'] = planData.agencyCode;
          param['setYear'] = ufma.getCommonData().svSetYear;
          param['eleCode'] = item.eleCode;
          param['eleLevel'] = item.eleLevel;
          var treecombox = $('#outCb' + item.eleCode);
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
          var sId = "outCb" + item.eleCode;
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
        }else {
          var formCtrl = $('<div id="out-isUpBudget" class="typeTree uf-combox" style=" width:270px;"></div>').appendTo($curgroup);
          var isUpBudgetData = [{
            code: "1",
            pId: "*",
            isLeaf: 1,
            parentId: "",
            levelNum: 1,
            pCode: "",
            codeName: "是",
            name: "是",
            chrFullname: "是",
            eleCode: "",
            id: "1",
            isFinal: "",
            lastVer: "",
          }, {
            code: "0",
            pId: "*",
            isLeaf: 1,
            parentId: "",
            levelNum: 1,
            pCode: "",
            codeName: "否",
            name: "否",
            chrFullname: "否",
            eleCode: "",
            id: "0",
            isFinal: "",
            lastVer: "",
          }];
          $('#out-isUpBudget').ufCombox({
            idField: "id",
            textField: "codeName",
            placeholder: "请选择是否采购",
            data: isUpBudgetData, //json 数据 
            onChange: function (sender, data) {},
            onComplete: function (sender) {}
          });
        }
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
      //加载选择调入指标表格
      initInTable: function () {
        if (inOtable) {
          $('#inTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          inOtable.fnDestroy();
        }
        var tblId = 'inTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          title: '<input type="checkbox" style="	transition: all .3s;top: 1px;left: 0;height: 18px;width: 18px;border: 1px solid #d9d9d9;background-color: #fff;line-height: 20px;font-weight: 400;border-radius: 4px;" class="checkboxes checkAllIn"/>&nbsp;',
          data: "code",
          className: 'nowrap tc',
          width: 40
        }, {
          data: "bgItemCode",
          title: "指标编码",
          className: "nowrap BGasscodeClass",
          // width: "90px"
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "nowrap BGThirtyLen",
          // width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (page.planDataIn.isComeDocNum == "是") {
          columns.push({
            data: "comeDocNum",
            title: "来文文号",
            className: "nowrap BGThirtyLen",
            //width: "250px",
            "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
          });
        }
        if (page.planDataIn.isSendDocNum == "是") {
          columns.push({
            data: "sendDocNum",
            title: page.sendCloName,
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
        for (var index = 0; index < page.planDataIn.planVo_Items.length; index++) {
          var item = page.planDataIn.planVo_Items[index];
          var cbCode = item.bgItemCode;
          var cbName = item.eleName;
          if (!$.isNull(cbCode)) {
            if (cbCode != 'ISUPBUDGET') {
              columns.push({
                title: cbName,
                data: page.shortLineToTF(cbCode), //转为驼峰
                className: 'nowrap BGThirtyLen',
                //width: 250,
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
          //data: "realBgItemCurShow",
          data: "realBgItemCur",
          title: "金额",
          className: "bgPubMoneyCol  nowrap BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        //批复金额名称修改为‘年初预算’
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
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
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          //data: "bgItemBalanceCurShow",
          data: "bgItemBalanceCur",
          title: "余额",
          className: "bgPubMoneyCol nowrap BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题

        });
        columns.push({
          data: "createUserName",
          title: "编制人",
          className: "nowrap BGTenLen",
          //width: "150px",
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
          className: "nowrap BGdateClass tc",
          // width: "150px"
        });
        columns.push({
          data: "checkUserName",
          title: "审核人",
          className: "nowrap BGTenLen",
          //width: "150px",
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
          className: "nowrap BGdateClass tc",
          // width: "150px"
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
          "scrollY": page.getScrollY(),
          "scrollX": true,
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          "columnDefs": [{
            "targets": [0],
            "serchable": false,
            "orderable": false,
            "className": "checktd",
            "render": function (data, type, rowdata, meta) {
              return '<input type="checkbox" class="checkboxes checkboxesIn" data-bgItemCode="' + rowdata.bgItemCode + '"   index="' + meta.row + '" />&nbsp; ';
            }
          }],
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#inTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#inTable_wrapper').width();
            var tableWidth = $('#inTable').width();
            if (tableWidth > wrapperWidth) {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
            page.inBgItemCode = []
            $('#adjustInTable_wrapper').find('.btn-in-delete').each(function () {
              var bgItemCode = $(this).attr('data-bgItemCode');
              page.inBgItemCode.push(bgItemCode)
            })
            $('#inTable_wrapper').find('.checkboxesIn').each(function () {
              var bgItemCodeIn = $(this).attr('data-bgItemCode');
              if ($.inArray(bgItemCodeIn, page.inBgItemCode) > -1) {
                $(this).trigger('click')
              }
            })
          }
        }

        inOtable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取选择调入指标表格数据
      showInTblData: function () {
        var surl = "/bg/budgetItem/selectBudgetItemsForDispenseIn"
        var bgItemDefaults = {
          'agencyCode': saveAllData.agencyCode,
          'bgPlanChrId': $('#cbBgPlanIn').getObj().getValue(),
          'setYear': saveAllData.setYear,
          'bgItemType': '4', //调入为4，调出为3
          'status': '3',
          'createDateBegin': $('#dateStart').getObj().getValue(),
          'createDateEnd': $('#dateEnd').getObj().getValue(),
          'bgItemSummary': $('#bgItemSummary').val(),
          'bgItemCode': $('#bgItemCode').val()
        };
        var finallArgu = {};
        for (var i = 0; i < page.planDataIn.planVo_Items.length; i++) {
          var argu = {};
          var item = page.planDataIn.planVo_Items[i];
          var cbItem = item.eleCode;
          var field = page.shortLineToTF(item.bgItemCode);
          if (cbItem != 'ISUPBUDGET') {
            var setVal = $('#inCb' + cbItem).getObj().getValue();
            argu[field] = setVal;
          } else {
            argu["isUpBudget"] = $('#in-isUpBudget').getObj().getValue();
          }
          finallArgu = $.extend(finallArgu, argu);
        };
        finallArgu = $.extend(finallArgu, bgItemDefaults)
        ufma.showloading('数据加载中，请耐心等待...');
        ufma.post(surl, finallArgu,
          function (result) {
            ufma.hideloading();
            //加载指标-增加、减少、余额-----end
            inOtable.fnClearTable();
            if (result.data.length != 0) {
              inOtable.fnAddData(result.data, true);
              page.allDataLengthIn = result.data.length
            }
            //模拟滚动条
            $('#inTable').closest('.dataTables_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            });
            ufma.setBarPos($(window));
          });
      },
      //初始化第一个表格
      initAdjustInTable: function () {
        if (inAdjustTable) {
          $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          inAdjustTable.fnDestroy();
        }
        var tblId = 'adjustInTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          data: 'opt',
          title: '操作',
          className: 'inTableDel nowrap tc',
          width: 40,
          render: function (data, type, rowdata, meta) {
            return '<a class="btn btn-icon-only btn-sm  icon-trash f16 btn-in-delete" data-toggle="tooltip" data-bgItemCode="' + rowdata.bgItemCode + '" title="删除" rowIndex ="' + meta.row + '">';
          }
        }, {
          data: "bgItemCode",
          title: "指标编码",
          className: " nowrap BGasscodeClass",
          //width: "90px"
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: " nowrap BGThirtyLen",
          //width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (inComeDocNum == "是") {
          columns.push({
            data: "comeDocNum",
            title: "来文文号",
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
        if (inSendDocNum == "是") {
          columns.push({
            data: "sendDocNum",
            title: name,
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
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
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "指标余额",
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
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
          data: "bgAddCur",
          title: "调入金额",
          className: "nowrap BGmoneyClass tr dispenseCurIn",
          //width: "150px",
          // render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
          "render": function (data, type, rowdata, meta) {
            var editEnable = '';
            if (saveAllData.editEnable == false) {
              editEnable = 'disabled';
            } else if (saveAllData.editEnable == true) {
              editEnable = '';
            }
            return '<input onfocus="this.select()" class="form-control carryDownCurInput" style="width:120px;text-align:right" ' + editEnable + ' type="text" value="' + $.formatMoney(data, 2) + '" >';
          }
        });
        //调剂后金额修改名称为‘调剂后余额’
        columns.push({
          data: "afterDispenseCur",
          title: "调剂后余额",
          className: "nowrap BGmoneyClass tr afterDispenseMoney",
          //width: "150px",
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
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
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
                //width: 250,
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
          className: "nowrap BGThirtyLen remarkIn",
          //width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        });
        if (inSendDocNum == "是" && inComeDocNum == "否" || outSendDocNum == "否" && inComeDocNum == "是") {
          targetNumIn = 7;
        } else if (inSendDocNum == "是" && inComeDocNum == "是") {
          targetNumIn = 8;
        } else {
          targetNumIn = 6;
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
          "scrollY": inHeight,
          "scrollX": true,
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          "columnDefs": [{
            "targets": [-1],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
              var editEnable = '';
              if (saveAllData.editEnable == false) {
                editEnable = 'disabled';
              } else if (saveAllData.editEnable == true) {
                editEnable = '';
              }
              return '<input class="form-control remarkInput" style="width:240px;"  max-length="100" type="text" ' + editEnable + ' value="' + data + '" >';
            }
          }],
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            $('.carryDownCurInput').amtInputNull();
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#adjustInTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#adjustInTable_wrapper').width();
            var tableWidth = $('#adjustInTable').width();
            if (tableWidth > wrapperWidth) {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
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
          data: 'opt',
          title: '操作',
          className: 'nowrap tc',
          width: 40,
          render: function (data, type, rowdata, meta) {
            return '<a class="btn btn-icon-only btn-sm  icon-trash f16 btn-out-delete" data-toggle="tooltip" data-bgItemCode="' + rowdata.bgItemCode + '" title="删除" rowIndex ="' + meta.row + '">';
          }
        }, {
          data: "bgItemCode",
          title: "指标编码",
          className: " nowrap bgItemCodeRow BGasscodeClass",
          //width: "90px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '" rowIndex ="' + meta.row + '" >' + data + '</span>';
            } else {
              return '';
            }

          }
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: " nowrap BGThirtyLen",
          //width: "250px",
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
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
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
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "指标余额",
          className: " nowrap BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            //调出的余额bgItemBalanceCur + bgCutCur
            var moneyAll = rowdata.bgItemBalanceCur + rowdata.bgCutCur;
            return $.formatMoney(moneyAll, 2);
          }
        });
        columns.push({
          data: "bgCutCur",
          title: "调出金额",
          className: "nowrap BGmoneyClass tr dispenseCurOut",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            var editEnable = '';
            if (saveAllData.editEnable == false) {
              editEnable = 'disabled';
            } else if (saveAllData.editEnable == true) {
              editEnable = '';
            }
            return '<input onfocus="this.select()" class="form-control carryDownCurOut" style="width:120px;text-align:right" type="text" ' + editEnable + ' value="' + $.formatMoney(data, 2) + '" >';
          }
        });
        //调剂后金额修改名称为‘调剂后余额’
        columns.push({
          data: "afterDispenseCur",
          title: "调剂后余额",
          className: "nowrap BGmoneyClass tr afterDispenseMoney",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            if (afterMoney == 0) {
              return $.formatMoney(rowdata.bgItemBalanceCur, 2);
            }
          }
        });
       //指标调出指标加一列字段：调剂后总额，放在调剂后余额后面。取realBgItemCur
        columns.push({
          data: "realBgItemCur",
          title: "调剂后总额",
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
             if (afterMoney == 0) {
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
                //width: 250,
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
          className: "nowrap BGThirtyLen remark",
          //width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        });
        if (outSendDocNum == "是" && outComeDocNum == "否" || outSendDocNum == "否" && outComeDocNum == "是") {
          targetNumOut = 7;
        } else if (outSendDocNum == "是" && outComeDocNum == "是") {
          targetNumOut = 8;
        } else {
          targetNumOut = 6;
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
          "scrollX": true,
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
              var editEnable = '';
              if (saveAllData.editEnable == false) {
                editEnable = 'disabled';
              } else if (saveAllData.editEnable == true) {
                editEnable = '';
              }
              return '<input class="form-control remarkInput" style="width:240px;"  max-length="100" type="text" ' + editEnable + ' value="' + data + '" >';
            }
          }],
          //填充表格数据
          data: [],
          "dom": 'rt',
          initComplete: function (settings, json) {
            $('.carryDownCurOut').amtInputNull();
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            $('#adjustOutTable').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(page.reslist);
            var wrapperWidth = $('#adjustOutTable_wrapper').width();
            var tableWidth = $('#adjustOutTable').width();
            if (tableWidth > wrapperWidth) {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {

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

      //加载选择调出表格
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
          className: "nowrap BGasscodeClass",
          //width: "90px"
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "nowrap BGThirtyLen",
          //width: "250px",
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
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
            className: "nowrap BGThirtyLen",
            //width: "250px",
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
                //width: 250,
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
          className: "bgPubMoneyCol nowrap BGmoneyClass trtr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
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
          className: "bgPubMoneyCol nowrap BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        columns.push({
          data: "createUserName",
          title: "编制人",
          className: "nowrap BGTenLen",
          //width: "150px",
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
          className: "nowrap BGdateClass tc",
          // width: "150px"
        });
        columns.push({
          data: "checkUserName",
          title: "审核人",
          className: "nowrap BGTenLen",
          //width: "150px",
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
          className: "nowrap BGdateClass tc",
          // width: "150px"
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
          "scrollX": true,
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "serverSide": false,
          "ordering": false,
          "columns": columns,
          "columnDefs": [{
            "targets": [0],
            "serchable": false,
            "orderable": false,
            "className": "checktd",
            "render": function (data, type, rowdata, meta) {
              return '<input type="checkbox" class="checkboxes bodyCheckbox" data-bgItemCode="' + rowdata.bgItemCode + '"   index="' + meta.row + '" />&nbsp; ';
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
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
            page.outBgItemCode = []
            $('#adjustOutTable_wrapper').find('.btn-out-delete').each(function () {
              var bgItemCode = $(this).attr('data-bgItemCode');
              page.outBgItemCode.push(bgItemCode)
            })
            $('#outTable_wrapper').find('.bodyCheckbox').each(function () {
              var bgItemCodeIn = $(this).attr('data-bgItemCode');
              if ($.inArray(bgItemCodeIn, page.outBgItemCode) > -1) {
                $(this).trigger('click')
              }
            })
          }
        }
        outTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取选择调出表格数据
      showOutTblData: function () {
        var bgItemListArr = [];
        for (var i = 0; i < saveAllData.itemDispenseInList.length; i++) {
          var bgItemList = {};
          bgItemList.bgItemId = saveAllData.itemDispenseInList[i].bgItemId;
          bgItemListArr.push(bgItemList);
        }

        var surl = "/bg/budgetItem/selectBudgetItemsForDispenseOut?agencyCode=" + saveAllData.agencyCode + "&rgCode=" + saveAllData.rgCode + "&setYear=" + saveAllData.setYear;
        var bgItemDefaults = {
          'bgPlanId': $('#cbBgPlanOut').getObj().getValue(),
          'items': bgItemListArr,
          'bgItemSummary': $('#bgItemSummaryOut').val(),
          'bgItemCode': $('#bgItemCodeOut').val()
        };
        var finallArgu = {};
        for (var i = 0; i < page.planData.planVo_Items.length; i++) {
          var argu = {};
          var item = page.planData.planVo_Items[i];
          var cbItem = item.eleCode;
          var field = page.shortLineToTF(item.bgItemCode);
          if (cbItem != 'ISUPBUDGET') {
            var setVal = $('#outCb' + cbItem).getObj().getValue();
            argu[field] = setVal;
          } else {
            argu["isUpBudget"] = $('#out-isUpBudget').getObj().getValue();
          }
          finallArgu = $.extend(finallArgu, argu);
        };
        finallArgu = $.extend(finallArgu, bgItemDefaults)
        ufma.showloading('数据加载中，请耐心等待...');
        ufma.post(surl, finallArgu, function (result) {
          ufma.hideloading();
          //加载指标-增加、减少、余额-----end
          outTable.fnClearTable();
          page.allDataLengthOut = result.data.length;
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
        argu.setYear = saveAllData.setYear;
        argu.billDate = $('#bg_twoSidesAdjModal_dtp').getObj().getValue(); //_bgPub_getUserMsg().busDate;
        argu.latestOpUser = ptData.svUserCode;
        argu.latestOpUserName = ptData.svUserName;
        argu.billId = saveAllData.billId;
        argu.rgCode = ptData.svRgCode;
        argu.agencyCode = saveAllData.agencyCode;
        argu.billType = saveAllData.billType;
        argu.attachment = saveAllData.attachment;
        argu.itemsAdjIn = [];
        argu.itemsAdjOut = [];
        //bug77471--zsj
        if ($("#bgInput").val() < inFileLeng) {
          ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
          return false;
        }
        argu.attachNum = $("#bgInput").val() //bug77471--zsj
        //第一个表格数据--调入
        $('#adjustInTable_wrapper').find("tbody tr td.inTableDel a").each(function () {
          var rowIndex = $(this).attr('rowIndex');
          var inCount = 0;
          var rowData = {}
          if (rowIndex) {
            rowData = inAdjustTable.api(false).row(rowIndex).data();
            var tabData = {}
            var dispenseCurIn = !$.isNull($(this).closest('tr').find(".dispenseCurIn .carryDownCurInput").val()) ? parseFloat($(this).closest('tr').find(".dispenseCurIn .carryDownCurInput").val().replace(/,/g, "")) : 0;
            var remark = $(this).closest('tr').find(".remarkIn .remarkInput").val();
            // if (dispenseCurIn > 0) {
            tabData.setYear = rowData.setYear;
            tabData.rgCode = ptData.svRgCode;
            tabData.agencyCode = rowData.agencyCode;
            tabData.bgItemId = rowData.bgItemId;
            tabData.bgAddCur = dispenseCurIn;
            tabData.checkAddCur = dispenseCurIn;
            tabData.bgCutCur = 0;
            tabData.remark = remark;
            tabData.checkCutCur = 0;
            tabData.adjustDir = 2;
            // } else {
            //   inCount++;
            // }

          }
          argu.itemsAdjIn.push(tabData);
        });
        //第二个表格数据--调出
        $('#adjustOutTable_wrapper').find("tbody tr td.bgItemCodeRow span").each(function () {
          var rowIndex = $(this).attr('rowIndex');
          var outCount = 0;
          var rowData = {}
          if (rowIndex) {
            rowData = outAdjustTable.api(false).row(rowIndex).data();
            var tabData = {}
            var dispenseCurOut = !$.isNull($(this).closest('tr').find(".dispenseCurOut .carryDownCurOut").val()) ? parseFloat($(this).closest('tr').find(".dispenseCurOut .carryDownCurOut").val().replace(/,/g, "")) : 0;
            var remark = $(this).closest('tr').find(".remark .remarkInput").val();
            //if (dispenseCurOut > 0) {
            tabData.setYear = rowData.setYear;
            tabData.rgCode = ptData.svRgCode;
            tabData.agencyCode = rowData.agencyCode;
            tabData.bgItemId = rowData.bgItemId;
            tabData.bgAddCur = 0;
            tabData.checkAddCur = 0;
            tabData.bgCutCur = dispenseCurOut;
            tabData.remark = remark;
            tabData.checkCutCur = dispenseCurOut;
            tabData.adjustDir = 2;
            inSumMoney += parseFloat(dispenseCurOut);
            // } else {
            //   outCount++
            // }
          }
          argu.itemsAdjOut.push(tabData);
        });
        //保存
        var sUrl = '/bg/dispense/saveDispenseItems?billType=' + this.billType;
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
      getScrollY: function () {
        var winH = $(window).height();
        return winH - 56 - 78 - 40 - 30 - 120 + 'px'
      },
      onEventListener: function () {
        $('#btnClose').click(function () {
          _close();
        });
        $('#btnQueryIn').on('click', function () {
          page.showInTblData();
        });
        $('#btnQueryOut').on('click', function () {
          page.showOutTblData();
        });
        //输入调入金额
        $("#adjustInTable").on('blur', '.carryDownCurInput', function () {
          var inMoneySum = 0
          var minm = $(this).val().replace(/,/g, "");
          var maxm = $(this).closest('td').siblings().eq(targetNumIn - 1).html().replace(/,/g, "");
          //add by lnj 20200729 minm是调入指标，即可录入  maxm 是调剂后余额 新增的changallmoney是调剂后总额，按顺序走
          //targetNum基数是5
          var changallmoney = $(this).closest('td').siblings().eq(targetNumIn - 2).html().replace(/,/g, "");
          //判断起始金额是否大于结束金额
          if (parseFloat(minm) > 0) {
            $("#adjustInTable").find('.carryDownCurInput').each(function () {
              if (parseFloat($(this).val().replace(/,/g, "")) > 0) {
                inMoneySum += parseFloat($(this).val().replace(/,/g, ""));
              }
            });
            page.inMoney = 0
            page.inMoney = inMoneySum
            afterMoney = parseFloat(maxm) + parseFloat(minm);
            $(this).closest('td').siblings().eq(targetNumIn).html($.formatMoneyNull(afterMoney));
            afterMoney = parseFloat(minm) + parseFloat(changallmoney);
            $(this).closest('td').siblings().eq(targetNumIn+1).html($.formatMoneyNull(afterMoney));
            $("#twosidesAdj_inSumMoney").html($.formatMoney(inMoneySum, 2));
            var outM = !$.isNull($("#twosidesAdj_outSumMoney").html()) ? $("#twosidesAdj_outSumMoney").html().replace(/,/g, "") : 0;
            $("#twosidesAdj_balanceMoney").html($.formatMoney((parseFloat(page.inMoney) - parseFloat(outM)), 2)); //差额=调入-调出
            afterMoney = 0;
          }
        });
        //输入调出金额
        $("#adjustOutTable").on('blur', '.carryDownCurOut', function () {
          inSumMoney = 0;
          var minm = $(this).val().replace(/,/g, "");
          var maxm = $(this).closest('td').siblings().eq(targetNumOut - 1).html().replace(/,/g, "");
          //add by lnj 20200729 minm是调入指标，即可录入  maxm 是调剂后余额 新增的changallmoney是调剂后总额，按顺序走
          //targetNum基数是5
          var changallmoney = $(this).closest('td').siblings().eq(targetNumOut - 2).html().replace(/,/g, "");
          //判断起始金额是否大于结束金额
          if (parseFloat(minm) > parseFloat(maxm)) {
            $(this).val('');
            ufma.showTip('调出金额不能大于指标余额', function () {}, 'warning');
            return false;
          } else if (parseFloat(minm) > 0) {
            $("#adjustOutTable").find('.carryDownCurOut').each(function () {
              if (parseFloat($(this).val().replace(/,/g, "")) > 0) {
                inSumMoney += parseFloat($(this).val().replace(/,/g, ""));
              }
            });
            afterMoney = parseFloat(maxm) - parseFloat(minm);
            $(this).closest('td').siblings().eq(targetNumOut).html($.formatMoneyNull(afterMoney));
            afterMoney = parseFloat(changallmoney) -parseFloat(minm);
            $(this).closest('td').siblings().eq(targetNumOut+1).html($.formatMoneyNull(afterMoney));
            $("#twosidesAdj_outSumMoney").html($.formatMoney(inSumMoney, 2));
            $("#twosidesAdj_balanceMoney").html($.formatMoney((parseFloat(page.inMoney) - parseFloat(inSumMoney)), 2)); //差额=调入-调出
            afterMoney = 0;
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
            arrayDataOut = [];
            var checkCodeOut = $(e.target).attr('data-bgItemcode');
            var arrayDataOutCode = [];
            var delCodeOut = [];
            if (saveAllData.labStatus == 'todo') {
              if ($('#outTable_wrapper').find('.bodyCheckbox:checked').length > 0) {
                $('#outTable_wrapper').find('.bodyCheckbox:checked').each(function () {
                  var rowIndex = $(this).attr('index');
                  var rowData = {};
                  if (rowIndex) {
                    rowData = outTable.api(false).row(rowIndex).data();
                    delCodeOut.push(rowData.bgItemCode)
                    arrayDataOutCode.push(rowData.bgItemCode)
                    if ($("#adjustOutTable").find('.carryDownCurOut').length > 0 && rowIndex <= $("#adjustOutTable").find('.carryDownCurOut').length - 1) {
                      var bgItemCode = $("#adjustOutTable").find('td.bgItemCodeRow').eq(rowIndex).text();
                      if (rowData.bgItemCode == bgItemCode) {
                        rowData.bgCutCur = !$.isNull($("#adjustOutTable").find('.carryDownCurOut').eq(rowIndex).val()) ? parseFloat($("#adjustOutTable").find('.carryDownCurOut').eq(rowIndex).val().replace(/,/g, "")) : "";
                      } else {
                        rowData.bgCutCur = ""
                      }
                    }
                    arrayDataOut.push(rowData);
                  }
                });
                if ($.inArray(checkCodeOut, delCodeOut) == -1) {
                  if ($('#adjustOutTable_wrapper').find('.btn-out-delete').length > 0) {
                    $('#adjustOutTable_wrapper').find('.btn-out-delete').each(function () {
                      var rowIndex = $(this).attr('rowIndex');
                      var rowData = {};
                      if (rowIndex) {
                        rowData = outAdjustTable.api(false).row(rowIndex).data();
                        if (arrayDataOut.length > 0) {
                          for (var m = 0; m < arrayDataOut.length; m++) {
                            if ($.inArray(arrayDataOut[m].bgItemCode, arrayDataOutCode) == -1) {
                              arrayDataOutCode.push(arrayDataOut[m].bgItemCode)
                            }
                          }
                          if ($.inArray(rowData.bgItemCode, arrayDataOutCode) == -1 && rowData.bgItemCode != checkCodeOut) {
                            arrayDataOut.push(rowData);
                          }
                        } else {
                          arrayDataOut.push(rowData);
                        }
                      }
                    })
                  }
                }
                page.showAdjustOutTblData(arrayDataOut);
              } else {
                var emptyData = [];
                page.showAdjustOutTblData(emptyData);
              }
            } else if (saveAllData.labStatus == 'done') {
              page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
            }
            var num = page.allDataLengthOut;
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
            arrayDataOut = [];
            if ($('#outTable_wrapper').find('.bodyCheckbox:checked').length > 0) {
              $('#outTable_wrapper').find('.bodyCheckbox:checked').each(function () {
                var rowIndex = $(this).attr('index');
                var rowData = {};
                arrayDataOut = arrayDataOut.concat(saveAllData.itemDispenseOutList);
                if (rowIndex) {
                  rowData = outTable.api(false).row(rowIndex).data();
                }
                if (arrayDataOut.length > 0) {
                  for (var i = 0; i < arrayDataOut.length; i++) {
                    if (rowData.bgItemId != arrayDataOut[i].bgItemId) {
                      arrayDataOut.push(rowData);
                    }
                  }
                } else {
                  arrayDataOut.push(rowData);
                }
              });
              page.showAdjustOutTblData(arrayDataOut);
            } else {
              page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
            }
          } else if ($(e.target).is('.btn-out-delete')) {
            var index = $(e.target).attr('rowIndex');
            var arrayDataOutCode = []
            var delBgItemCode = $(e.target).attr('data-bgItemCode');
            $(e.target).closest('tr').remove()
            arrayDataOut = []
            if ($('#adjustOutTable_wrapper').find('.btn-out-delete').length > 0) {
              $('#adjustOutTable_wrapper').find('.btn-out-delete').each(function () {
                var rowIndex = $(this).attr('rowIndex');
                var rowData = {};
                if (rowIndex) {
                  rowData = outAdjustTable.api(false).row(rowIndex).data();
                  arrayDataOut.push(rowData);
                }
              })
            }
            if ($('#outTable_wrapper').find('.bodyCheckbox:checked').length > 0) {
              $('#outTable_wrapper').find('.bodyCheckbox:checked').each(function () {
                if (delBgItemCode == $(this).attr('data-bgItemCode')) {
                  $(this).trigger('click')
                }
              });
              page.showAdjustOutTblData(arrayDataOut);
            } else {
              page.showAdjustOutTblData(arrayDataOut);
            }
          } else if ($(e.target).is('.btn-in-delete')) {
            var index = $(e.target).attr('rowIndex');
            var delBgItemCode = $(e.target).attr('data-bgItemCode');
            $(e.target).closest('tr').remove()
            arrayDataIn = []
            var arrayDataInCode = [];
            if ($('#adjustInTable_wrapper').find('.btn-in-delete').length > 0) {
              $('#adjustInTable_wrapper').find('.btn-in-delete').each(function () {
                var rowIndex = $(this).attr('rowIndex');
                var rowData = {};
                if (rowIndex) {
                  rowData = inAdjustTable.api(false).row(rowIndex).data();
                  arrayDataIn.push(rowData);
                }
              })
            }
            if ($('#inTable_wrapper').find('.checkboxesIn:checked').length > 0) {
              $('#inTable_wrapper').find('.checkboxesIn:checked').each(function () {
                if (delBgItemCode == $(this).attr('data-bgItemCode')) {
                  $(this).trigger('click')
                }
              });
              page.showAdjustInTblData(arrayDataIn);
            } else {
              page.showAdjustInTblData(arrayDataIn);
            }
          } else if ($(e.target).is('.checkboxesIn')) {
            arrayDataIn = [];
            var arrayDataInCode = [];
            var checkCode = $(e.target).attr('data-bgItemcode');
            var delCode = [];
            if (saveAllData.labStatus == 'todo') {
              if ($('#inTable_wrapper').find('.checkboxesIn:checked').length > 0) {
                $('#inTable_wrapper').find('.checkboxesIn:checked').each(function () {
                  var rowIndex = $(this).attr('index');
                  $(this).prop('checked', true)
                  var rowData = {};
                  if (rowIndex) {
                    rowData = inOtable.api(false).row(rowIndex).data();
                    delCode.push(rowData.bgItemCode)
                    arrayDataInCode.push(rowData.bgItemCode)
                    if ($("#adjustInTable").find('.carryDownCurInput').length > 0 && rowIndex <= $("#adjustInTable").find('.carryDownCurInput').length - 1) {
                      var bgItemCode = $("#adjustInTable").find('td.bgItemCodeIn').eq(rowIndex).text();
                      if (rowData.bgItemCode == bgItemCode) {
                        rowData.bgAddCur = !$.isNull($("#adjustInTable").find('.carryDownCurInput').eq(rowIndex).val()) ? parseFloat($("#adjustInTable").find('.carryDownCurInput').eq(rowIndex).val().replace(/,/g, "")) : "";
                      }
                    } else {
                      rowData.bgAddCur = ""
                    }
                    arrayDataIn.push(rowData);
                  }
                });
                if ($.inArray(checkCode, delCode) == -1) {
                  if ($('#adjustInTable_wrapper').find('.btn-in-delete').length > 0) {
                    $('#adjustInTable_wrapper').find('.btn-in-delete').each(function () {
                      var rowIndex = $(this).attr('rowIndex');
                      var rowData = {};
                      if (rowIndex) {
                        rowData = inAdjustTable.api(false).row(rowIndex).data();
                        if (arrayDataIn.length > 0) {
                          for (var m = 0; m < arrayDataIn.length; m++) {
                            if ($.inArray(arrayDataIn[m].bgItemCode, arrayDataInCode) == -1) {
                              arrayDataInCode.push(arrayDataIn[m].bgItemCode)
                            }
                          }
                          if ($.inArray(rowData.bgItemCode, arrayDataInCode) == -1 && rowData.bgItemCode != checkCode) {
                            arrayDataIn.push(rowData);
                          }
                        } else {
                          arrayDataIn.push(rowData);
                        }
                      }
                    })

                  }
                }
                page.showAdjustInTblData(arrayDataIn);
              } else {
                var emptyDataIn = [];
                emptyDataIn = emptyDataIn.concat(saveAllData.itemDispenseOutList);
                page.showAdjustInTblData(emptyDataIn);
              }
            } else if (saveAllData.labStatus == 'done') {
              page.showAdjustInTblData(saveAllData.itemDispenseInList);
            }
            var numIn = page.allDataLengthIn;
            var arrIn = $('#inTable_wrapper').find('.checkboxesIn:checked').length;
            if (numIn == arrIn) {
              $(".checkAllIn").prop('checked', true)
            } else {
              $(".checkAllIn").prop('checked', false)
            }
          } else if ($(e.target).is('.checkAllIn')) {
            if ($('#inTable_wrapper').find('.checkAllIn:checked').length > 0) {
              $("#inTable_wrapper").find('.checkboxesIn').prop('checked', true);
            } else {
              $("#outTable_wrapper").find('.checkboxesIn').removeAttr('checked');
            }
            arrayDataIn = [];
            if ($('#inTable_wrapper').find('.checkboxesIn:checked').length > 0) {
              $('#inTable_wrapper').find('.checkboxesIn:checked').each(function () {
                var rowIndex = $(this).attr('index');
                var rowData = {};
                arrayDataIn = arrayDataIn.concat(saveAllData.itemDispenseInList);
                if (rowIndex) {
                  rowData = inOtable.api(false).row(rowIndex).data();
                }
                if (arrayDataIn.length > 0) {
                  for (var i = 0; i < arrayDataIn.length; i++) {
                    if (rowData.bgItemId != arrayDataIn[i].bgItemId) {
                      arrayDataIn.push(rowData);
                    }
                  }
                } else {
                  arrayDataIn.push(rowData);
                }
              });
              page.showAdjustInTblData(arrayDataIn);
            } else {
              page.showAdjustInTblData(saveAllData.itemDispenseInList);
            }
          }else if ($(e.target).is('.triggerPanelIn')) {
            page.initInTable();
          }else if ($(e.target).is('.triggerPanelOut')) {
            page.initOutTable()
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
        page.allDataLengthOut = 0; //调出指标
        page.allDataLengthIn = 0; //调入指标
        saveAllData = window.ownerData;
        pageAttachNum = saveAllData.attchNum;
        outSendDocNum = saveAllData.outSendDocNum;
        outComeDocNum = saveAllData.outComeDocNum;
        inSendDocNum = saveAllData.outSendDocNum;
        inComeDocNum = saveAllData.outComeDocNum;
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
          $('.outPanel, .inPanel').removeClass('hide');
          $('.changeTitle').html('调出指标');
          $('#bgInput').removeAttr('disabled');
          $('.changeTitle,.outPlan,#outTable,#saveAddAll,#btnSave').removeClass('hide');
        } else if (saveAllData.labStatus == 'done') {
          $('.changeTitle,.outPlan,#outTable,#saveAddAll,#btnSave').addClass('hide');
          $('#bgInput').attr('disabled', true);
        }
        page.planDataIn = saveAllData.planDataIn
        page.planData = saveAllData.planDataIn
        page.initAdjustInTable();
        page.showAdjustInTblData(saveAllData.itemDispenseInList);
        page.initAdjustOutTable();
        page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
        $('#bgInput').val(saveAllData.attchNum);
        $('#summary').val(saveAllData.summary)
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
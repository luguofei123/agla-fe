$(function () {
  window._close = function () {
    if (window.closeOwner) {
      window.closeOwner();
    }
  };
  var page = function () {
    var ptData = ufma.getCommonData();
    var state; //判断必填项是否为空
    var inOtable, inAdjustTable, outAdjustTable;
    var afterMoney = 0;
    var inAttachment = []; //调入单据的附件
    var outAttachment = []; //调出单据的附件
    var inFileLeng = 0; //调入实际上传文件数
    var outFileLeng = 0; //调出实际上传文件数
    var saveAllData;
    var inSumMoney = 0;
    //bug77471--zsj
    var attachNum = 0; //附件前输入框数字
    var pageAttachNum = 0; //后端返回的附件
    var targetNum = 0; //判断可输入金额框位置
    var isSendDocNum = ''; //发文文号|| 指标id
    var isComeDocNum = ''; //来文文号
    //编辑时查看调出
    var outSendDocNum = ''; //发文文号|| 指标id
    var outComeDocNum = ''; //来文文号
    var outDocNumToId = ''; //是否采购
    var outUpBudgetNeed = true; //判断用：发文文号|| 指标id
    return {
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
              isSendDocNum = page.planData.isSendDocNum;
              isComeDocNum = page.planData.isComeDocNum;
              page.initBgPlanItemPnl($('#searchPlanPnl'), data);
              $('#inTable').removeClass('hide');
              page.initInTable();
              page.initAdjustInTable();
              var data = [];
              page.showAdjustInTblData(data);
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
        var countItem = 0;
        for (var i = 0; i < items.length; i++) {
          $curgroup = $('<div class="form-group"style="margin-top:8px;width:30em;margin-left:-2em;"></div>').prependTo($curRow);
          var item = items[i];
          $('<lable class="control-label auto" style="display:inline-block;width:10em;text-align: right; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          if (item.eleCode != 'ISUPBUDGET') {
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
                    countItem++;
                    if (countItem == items.length) {
                      page.showInTblData();
                    }
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
          } else {
            var formCtrl = $('<div id="isUpBudget" class="typeTree uf-combox" style=" width:270px;"></div>').appendTo($curgroup);
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
            $('#isUpBudget').ufCombox({
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
          arr[i] = arr[i].toLowerCase()
        }
        for (var i = 1; i < arr.length; i++) {
          arr[i] = arr[i].toLowerCase()
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
        }
        return arr.join("");
      },
      //加载第一个表格
      initInTable: function () {
        if (inOtable) {
          $('#inTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          inOtable.fnDestroy();
        }
        var tblId = 'inTable';
        $("#" + tblId).html(''); //清空原有表格
        var columns = [{
          title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
            '<input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;' +
            '<span></span> ' +
            '</label>',
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
          //data: "realBgItemCurShow",
          data: "realBgItemCur",
          title: "金额",
          className: "bgPubMoneyCol nowrap BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        //批复金额名称修改为‘年初预算’
        columns.push({
          data: "bgItemCur",
          title: "年初预算",
          className: " nowrap tr BGmoneyClass",
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
          "scrollY": 300,
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
              return '<div class="checkdiv">' +
                '</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" data-bgItemId="' + rowdata.bgItemId + '" data-initType="' + rowdata.isYearInit + '" data-bgItemParentid="' + rowdata.bgItemParentid + '"  data-bgItemParentid="' + rowdata.bgItemCode + '" index="' + meta.row + '" />&nbsp; ' +
                '<span></span> ' +
                '</label>';
            }
          }, ],
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
              $('#inTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('#inTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
          }
        }

        inOtable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取第一个表格数据
      showInTblData: function () {
        var surl = "/bg/budgetItem/selectBudgetItemsForDispenseIn"
        var bgItemDefaults = {
          'agencyCode': saveAllData.agencyCode,
          'bgPlanChrId': $('#cbBgPlan').getObj().getValue(),
          'setYear': saveAllData.setYear,
          'bgItemType': '4', //调入为4，调出为3
          'status': '3',
          'createDateBegin': $('#dateStart').getObj().getValue(),
          'createDateEnd': $('#dateEnd').getObj().getValue()
        };
        var finallArgu = {};
        for (var i = 0; i < page.planData.planVo_Items.length; i++) {
          var argu = {};
          var item = page.planData.planVo_Items[i];
          var cbItem = item.eleCode;
          var field = page.shortLineToTF(item.bgItemCode);
          if (cbItem != 'ISUPBUDGET') {
            var setVal = $('#cb' + cbItem).getObj().getValue();
            argu[field] = setVal;
          } else {
            argu["isUpBudget"] = $('#isUpBudget').getObj().getValue();
          }
          finallArgu = $.extend(finallArgu, argu);
        };
        finallArgu = $.extend(finallArgu, bgItemDefaults)
        ufma.showloading('数据加载中，请耐心等待...');
        ufma.post(surl, finallArgu,
          function (result) {
            var tmpTblDt = $.extend({}, result.data);
            //增加判断筛选调入指标
            var tmpTblData1 = [];
            var billWithItemsVo = [];
            ufma.hideloading();
            //加载指标-增加、减少、余额-----end
            inOtable.fnClearTable();
            if (result.data.length != 0) {
              inOtable.fnAddData(result.data, true);
            }
            //模拟滚动条
            $('#inTable').closest('.dataTables_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            });
            ufma.setBarPos($(window));
          });
      },

      //初始化调入表格
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
          className: " nowrap BGasscodeClass",
          //width: "90px"
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "nowrap BGThirtyLen bgSummary",
          //width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<span index ="' + meta.row + '"  title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        }];
        if (isComeDocNum == "是") {
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
        if (isSendDocNum == "是") {
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
          //data: "dispenseCurOut",
          data: "bgAddCur",
          title: "调入金额",
          //width: "150px",
          className: "nowrap BGmoneyClass tr dispenseCurOut",

        });
        // 调剂后金额修改名称为‘调剂后余额’
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
        //指标调入指标加一列字段：调剂后总额，放在调剂后余额后面。调剂后总额就是可执行总额加调入金额。用来显示总额的变化。
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
        if (saveAllData.openAction == 'inAdd') {
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
        } else if (saveAllData.openAction == 'inEdit') {
          for (var index = 0; index < saveAllData.eleValueList.length; index++) {
            var item = saveAllData.eleValueList[index];
            var cbCode = item.bgItemCode;
            var cbName = item.eleName;
            if (!$.isNull(cbCode)) {
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
        if (isSendDocNum == "是" && isComeDocNum == "否" || isSendDocNum == "否" && isComeDocNum == "是") {
          targetNum = 6;
        } else if (isSendDocNum == "是" && isComeDocNum == "是") {
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
          "scrollY": 100,
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
                var editEnable = '';
                if (saveAllData.editEnable == false) {
                  editEnable = 'disabled';
                } else {
                  editEnable = '';
                }
                return '<input onfocus="this.select()" class="form-control carryDownCurInput" style="width:120px;text-align:right" type="text" ' + editEnable + ' value="' + $.formatMoney(data, 2) + '" >';
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
                return '<input  class="form-control remarkInput" style="width:240px;" max-length="100" type="text" ' + editEnable + ' value="' + data + '" >';
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
              //add  by lnj 20200728 拉大框框
              if($("#inTable_wrapper").is(":hidden")){
                $("#adjustInTable_wrapper").height(410);
                $("#adjustInTable_wrapper>.uf-sc-content .dataTables_scroll .dataTables_scrollBody").height(400);
                $("#adjustInTable_wrapper>.slider").css("top", "433px");
              }else{
                $("#inTable_wrapper>.uf-sc-content .dataTables_scroll .dataTables_scrollBody").height(400);
                $("#adjustInTable_wrapper>.dataTables_scroll .dataTables_scrollBody").height(10);
              }
            } else {
              $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
              if($("#inTable_wrapper").is(":hidden")){
                $("#adjustInTable_wrapper").height(410);
                $("#adjustInTable_wrapper>.uf-sc-content .dataTables_scroll .dataTables_scrollBody").height(400);
                $("#adjustInTable_wrapper>.slider").css("top", "433px");
              }else{
                $("#inTable_wrapper>.uf-sc-content .dataTables_scroll .dataTables_scrollBody").height(400);
                $("#adjustInTable_wrapper>.dataTables_scroll .dataTables_scrollBody").height(10);
              }
            }
          }
        }

        inAdjustTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      //获取选择调入表格数据
      showAdjustInTblData: function (data) {
        inAdjustTable.fnClearTable();
        if (data.length != 0) {
          inAdjustTable.fnAddData(data, true);
        }
        //模拟滚动条
        $('#adjustInTable').closest('.dataTables_wrapper').ufScrollBar({
          hScrollbar: true,
          mousewheel: false
        });
        ufma.setBarPos($(window));
      },
      //初始化调出表格
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
          className: " nowrap BGasscodeClass",
          //width: "90px"
        }, {
          data: "bgItemSummary",
          title: '摘要',
          className: "nowrap BGThirtyLen bgSummary",
          //width: "250px",
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
          className: " nowrap  BGmoneyClass tr",
          //width: "150px",
          "render": function (data, type, rowdata, meta) {
            return $.formatMoney(data, 2);
          }
        });
        columns.push({
          data: "bgItemBalanceCur",
          title: "指标余额",
          className: "nowrap BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
        });
        columns.push({
          data: "bgCutCur",
          title: "调出金额",
          className: "nowrap  BGmoneyClass tr",
          //width: "150px",
          render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
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
        var opts = {
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "bFilter": true,
          "bAutoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "paging": false,
          "scrollY": 80,
          "pagingType": "full_numbers", //分页样式
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
      //获取选择调出表格数据
      showAdjustOutTblData: function (data) {
        outAdjustTable.fnClearTable();
        if (data.length != 0) {
          outAdjustTable.fnAddData(data, true);
        }
        //模拟滚动条
        $('#adjustOutTable').closest('.dataTables_wrapper').ufScrollBar({
          hScrollbar: true,
          mousewheel: false
        });
        ufma.setBarPos($(window));
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
          if (saveAllData.labStatus == 'A') {
            saveAllData.status = '3';
          }
          var option = {
            "agencyCode": saveAllData.agencyCode,
            "billId": saveAllData.billId,
            "uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + saveAllData.agencyCode + "&billId=" + saveAllData.billId + "&setYear=" + saveAllData.setYear,
            "onClose": function (fileList) {
              //page.getAllData();
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
        //argu.createUser = saveAllData.createUser;
        argu.latestOpDate = saveAllData.latestOpDate;
        argu.billType = saveAllData.billType;
        argu.summary = $('#summary').val();
        argu.remark = saveAllData.remark;
        argu.status = saveAllData.status;
        argu.attachment = saveAllData.attachment;
        //bug77471--zsj
        if ($("#bgInput").val() < inFileLeng) {
          ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
          return false;
        }
        argu.attachNum = $("#bgInput").val() //bug77471--zsj
        $('#adjustInTable_wrapper').find("tbody tr td.bgSummary span").each(function () {
          var rowIndex = $(this).attr('index');
          var rowData = {};
          var tabData = {};
          if (rowIndex) {
            rowData = inAdjustTable.api(false).row(rowIndex).data();
            var dispenseCurOut = $(this).closest('tr').find(".dispenseCurOut .carryDownCurInput").val().replace(/,/g, "");
            var remark = $(this).closest('tr').find(".remark .remarkInput").val();
            if (dispenseCurOut > 0) {
              tabData.bgItemId = rowData.bgItemId;
              tabData.bgItemCode = rowData.bgItemCode;
              tabData.detailSummary = rowData.bgItemSummary;
              tabData.bgAddCur = dispenseCurOut;
              tabData.checkAddCur = dispenseCurOut;
              tabData.bgCutCur = 0;
              tabData.remark = rowData.remark;
              tabData.checkCutCur = 0;
              tabData.setYear = rowData.setYear;
              tabData.rgCode = ptData.svRgCode;
              tabData.agencyCode = rowData.agencyCode;
              tabData.remark = remark;
              tabData.adjustDir = 1;
              inSumMoney += parseFloat(dispenseCurOut);
            } else {
              ufma.showTip('请输入调入金额', function () {}, 'warning');
              return false;
            }
          }
          argu.items.push(tabData);
          var billCur = $("#twosidesAdj_inSumMoney").html().replace(/,/g, '');
          argu.billCur = parseFloat(billCur);
        });
        if (argu.items.length > 0) {
          //保存
          var sUrl = '/bg/budgetItem/multiPost/saveItemsDispense?billType=' + saveAllData.billType;
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
        }
      },
      onEventListener: function () {
        //全选			
        $("body").on("click", 'input#check_H', function () {
          var flag = $(this).prop("checked");
          $("#inTable_wrapper").find('input.checkboxes').prop('checked', flag);
        });
        $("body").on("click", 'input.checkboxes', function () {
          var num = 0;
          var arr = document.querySelectorAll('.checkboxes')
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
              num++
            }
          }
          if (num == arr.length) {
            $("#check_H").prop('checked', true)
          } else {
            $("#check_H").prop('checked', false)
          }
        });
        $('#btnClose').click(function () {
          _close();
        });
        $('#btnQuery').on('click', function () {
          page.showInTblData();
        });
        //下一步
        $("#inNext").on("click", function () {
          inSumMoney = 0;
          if ($('#inTable_wrapper').find('input.checkboxes:checked').length == 0) {
            ufma.showTip("请选择要调剂入的指标", null, "warning");
            return false;
          }
          //  else if ($('#inTable_wrapper').find('input.checkboxes:checked').length > 1) {
          //   ufma.showTip("调入指标只能选择一条", null, "warning");
          //   return false;
          // } 
          else {
            $('#twoSidesAdjModal_billCode').val(saveAllData.billCode);
            var items = [];
            $('#inTable_wrapper').find('input.checkboxes:checked').each(function () {
              var rowIndex = $(this).attr('index');
              var rowData = {}
              if (rowIndex) {
                rowData = inOtable.api(false).row(rowIndex).data();
              }
              items.push(rowData);
            });
            $('#inTable_wrapper,.inPlan,#inNext,#inTable').addClass('hide');
            $('.changeTitle').html('调入指标');
            $("#inAdjModal").text(ptData.svUserName);
            $('#adjustInTable,#inPrev,#saveAddAll,#btnSave,#inApplyTitle,#adjustTotal,#textInput').removeClass('hide');
            page.initAdjustInTable();
            page.showAdjustInTblData(items);
          }
        });
        //上一步
        $("#inPrev").on("click", function () {
          inSumMoney = 0;
          $('#inTable_wrapper,.inPlan,#inNext').removeClass('hide');
          $('.changeTitle').html('调入指标选择');
          $('#adjustInTable,#inPrev,#saveAddAll,#btnSave,#adjustInTable_wrapper,#inApplyTitle,#adjustTotal,#textInput').addClass('hide');
          page.initSearchPnl();
        });
        //输入结转金额进行判断：
        $("#adjustInTable").on('blur', '.carryDownCurInput', function () {
          inSumMoney = 0;
          var minm = $(this).val().replace(/,/g, "");
          var maxm = $(this).closest('td').siblings().eq(targetNum - 1).html().replace(/,/g, "");
          //add by lnj 20200729 minm是调入指标，即可录入  maxm 是调剂后余额 新增的changallmoney是调剂后总额，按顺序走
          //targetNum基数是5
          var changallmoney = $(this).closest('td').siblings().eq(targetNum - 2).html().replace(/,/g, "");
          //判断起始金额是否大于结束金额
          if (parseFloat(minm) > 0) {
            $("#adjustInTable").find('.carryDownCurInput').each(function () {
              if (parseFloat($(this).val().replace(/,/g, "")) > 0) {
                inSumMoney += parseFloat($(this).val().replace(/,/g, ""));
              }
            });
            afterMoney = parseFloat(minm) + parseFloat(maxm);
            $(this).closest('td').siblings().eq(targetNum).html($.formatMoneyNull(afterMoney));
            afterMoney = parseFloat(minm) + parseFloat(changallmoney);
            $(this).closest('td').siblings().eq(targetNum+1).html($.formatMoneyNull(afterMoney));
            $("#twosidesAdj_inSumMoney").html($.formatMoney(parseFloat(inSumMoney), 2));
            afterMoney = 0;
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
        $("#btnInFiles").on("click", function () {
          page.getInfile();

        });

        //提交--启动工作流
        /*$("#btnCommit").on("click", function(e) {
					var rowDt = tblObj.row($(this).closest("tr")).data();
					var businessKey = rowDt.billId;
					var billCurValue = rowDt.diffCur;
					var ctrlUser = rowDt.ctrlUser;
					var cwUser = rowDt.cwUser;
					var variables = [{
						type: "integer",
						name: "BILL_CUR",
						value: billCurValue
					}, {
						type: "string",
						name: "CTRL_USER",
						value: ctrlUser
					}, {
						type: "string",
						name: "CW_USER",
						value: cwUser
					}];
					var taskId = rowDt.taskId;
					var procDefId = rowDt.procDefId;
					var nodeId = rowDt.nodeId;
					var checkUrl = '/df/access/public/bg/workflow/checkForNext';
					var checkArgu = {
						agencyCode: bgItemManager.agencyCode,
						bgPlanChrId: $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().getValue(),
						billType: bgItemManager.billType,
						checkDate: page.pfData.svSysDate,
						checkUser: page.pfData.svUserCode,
						checkUserName: page.pfData.svUserName,
						items: [{
							billId: businessKey
						}],
						setYear: page.useYear,
						status: "3"
					}
					ufma.post(checkUrl, checkArgu, function(result) {
						if(result.flag == 'success') {
							var formDefinedData = {
								// 单据类型code
								bizTypeCode: 'BILL_DISPENSE', //"REPAY_GENERAL",单据类型：编制为1；分解为2；调整为3；调剂为4；
								// 区划code
								rgCode: page.pfData.svRgCode,
							};
							//if(taskId == '' || taskId == null) {
							ufma.confirm("确定要提交这条指标吗?", function(action) {
								if(action) {
									if($.isNull(taskId)) {
										emiter.emit('start', {
											...formDefinedData,
											businessKey: businessKey,
											taskId: taskId,
											nodeId: nodeId,
											procDefId: procDefId,
											userCode: page.pfData.svUserCode,
											variables: variables,
											onCancel: function() {

											},
											onComplete: function(ret) {
												this.isLoading = false;
												if(!$.isNull(ret.error)) {
													var flag = '';
													if(ret.error == 0) {
														flag = 'success';
														ufma.showTip('提交成功', function() {
															pnlFindRst.doFindBtnClick();
														}, flag);
													} else {
														flag = 'warning';
														ufma.showTip(ret.message, function() {
															pnlFindRst.doFindBtnClick();
														}, flag);
													}

													return;
												}
												//ufma.showTip(JSON.stringify(ret.extra), function() {}, 'warning');
											}
										});
									} else {
										emiter.emit('approve', {
											businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
											variables: variables,
											//menuId: '6f7c4687-0463-4d2c-85c1-178e82361811',
											taskId: taskId,
											nodeId: nodeId,
											procDefId: procDefId,
											onCancel: function() {},
											onComplete: function(ret) {
												pnlFindRst.doFindBtnClick();
											}
										});

									}
								}
							}, {
								'type': 'warning'
							});
						}
					});

				});

				 //撤回
				$("#" + tblId + " tbody").on("click", ".mainCancelAuditSpan", function(e) {
					var rowDt = tblObj.row($(this).closest("tr")).data();
					var businessKey = rowDt.billId;
					var taskId = rowDt.taskId;
					var procDefId = rowDt.procDefId;
					var nodeId = rowDt.nodeId;
					var procInstId = rowDt.procInstId;
					var variables = [];
					ufma.confirm('您确定要撤销选择的流程吗？', function(ac) {
						if(ac) {
							//permitCancel:0是不可撤销，permitCancel:1是可撤销
							emiter.emit('canTaskCancel', {
								taskId: taskId,
								nodeId: nodeId,
								procDefId: procDefId,
								procInstId: procInstId,
								businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
								onCancel: function() {},
								onComplete: function(ret) {
									if(ret == false) {
										ufma.showTip('流程不可撤销', function() {}, 'warning')
									} else if(ret.data.permitCancel == '1') {
										emiter.emit('cancel', {
											taskId: taskId,
											nodeId: nodeId,
											procDefId: procDefId,
											procInstId: procInstId,
											businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
											onCancel: function() {},
											onComplete: function(ret) {
												pnlFindRst.doFindBtnClick();
											}
										});
									}
								}
							});
						}
					}, {
						'type': 'warning'
					});

				});
*/
      },
      //初始化页面
      initPage: function () {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.initDatePicker();
      },

      init: function () {
        page.needSendDocNum = window.ownerData.needSendDocNum;
        if (page.needSendDocNum == true) {
          page.sendCloName = "指标id";
        } else {
          page.sendCloName = "发文文号";
        }
        if (window.ownerData.openAction == "inAdd") {
          saveAllData = window.ownerData;
          $('.inPlan,#inApplyTitle,.inCount').removeClass('hide');
          $('#inApplyTitle').addClass('hide');
          page.initSearchPnl();
        } else if (window.ownerData.openAction == "inEdit") {
          $('#inTable_wrapper,.inPlan,#inNext,#inTable').addClass('hide');
          saveAllData = window.ownerData;
          isSendDocNum = saveAllData.isSendDocNum;
          isComeDocNum = saveAllData.isComeDocNum;
          outSendDocNum = saveAllData.outSendDocNum;
          outComeDocNum = saveAllData.outComeDocNum;
          outDocNumToId = saveAllData.outDocNumToId;
          outUpBudgetNeed = saveAllData.outUpBudgetNeed;
          page.outMoney = saveAllData.totalOutCur;
          page.inMoney = saveAllData.billCur;
          var balanceMoney = saveAllData.diffCur;
          $('#twoSidesAdjModal_billCode').val(saveAllData.billCode);
          if (saveAllData.status != '1') {
            saveAllData.editEnable = false;
            if (saveAllData.itemDispenseOutList.length > 0) {
              $('.outCount,.subCount,#adjustOutTable').removeClass('hide');
              $("#twosidesAdj_outSumMoney").html($.formatMoney(parseFloat(page.outMoney), 2));
              $("#twosidesAdj_balanceMoney").html($.formatMoney(parseFloat(balanceMoney), 2));
              page.initAdjustOutTable();
              page.showAdjustOutTblData(saveAllData.itemDispenseOutList);
            }
          } else {
            saveAllData.editEnable = true;
            $('.changeTitle').html('调入指标');
            $('#inPrev,#saveAddAll,#btnSave').removeClass('hide');
            $('.outCount,.subCount,#adjustOutTable').addClass('hide');
          }
          $('#adjustInTable,#inApplyTitle,.inCount,#textInput').removeClass('hide');
          if(saveAllData.editEnable ==  false){
            $('#textInput').attr('readOnly')
          }
          pageAttachNum = saveAllData.attchNum;
          $('#bgInput').val(saveAllData.attchNum);
          $('#summary').val(saveAllData.summary)
          $("#twosidesAdj_inSumMoney").html($.formatMoney(parseFloat(page.inMoney), 2));
          $('#inAdjModal').html(ptData.svUserName);
          page.initAdjustInTable();
          page.showAdjustInTblData(saveAllData.itemDispenseInList);
        }

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
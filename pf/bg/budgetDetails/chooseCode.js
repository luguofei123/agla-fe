$(function () {
  window._close = function (action, data) {
    if (window.closeOwner) {
      var data = {
        action: action,
        data: data
      };
      window.closeOwner(data);
    }
  }
  var page = function () {
    var ptData = ufma.getCommonData();
    var inOtable;
    var setArgu = {};
    var saveAllData = window.ownerData;
    return {
      //显示预算方案
      initSearchPnl: function () {
        var argu = {
          agencyCode: saveAllData.agencyCode,
          setYear: saveAllData.setYear,
          rgCode: saveAllData.rgCode
        }
        ufma.showloading('数据加载中，请耐心等待...');
        ufma.get('/bg/sysdata/getBgPlanArray', argu, function (result) {
          $('#cbBgPlan').ufCombox({ //初始化
            idField: "chrId",
            textField: "chrName",
            data: result.data, //列表数据
            readOnly: false, //可选
            placeholder: "请选择预算方案",
            onChange: function (sender, data) {
              page.planData = data;
              var codeArr = []
              var codeList = []
              // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
              // 方案要素去重
              var obj = {};
              for(var i =0; i < data.planVo_Items.length; i++){
                var code = data.planVo_Items[i].eleCode;
                if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                  if(!obj[code]){
                    codeArr.push(data.planVo_Items[i]);
                    obj[code] = true;
                    codeList.push(code);
                  }
                }
              }
              if(page.planData.isSendDocNum == "是"){
                var isSendDocNumObj = {
                  eleCode:"sendDocNum",
                  eleName:page.sendCloName,
                  bgItemCode:"sendDocNum"
                }
                codeArr.push(isSendDocNumObj)
              }
              //ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件--zsj
              if(page.planData.isFinancialBudget == "1"){
                var isSendDocNumObj = {
                  eleCode:"bgItemIdMx",
                  eleName:'财政指标ID',
                  bgItemCode:"bgItemIdMx"
                }
                codeArr.push(isSendDocNumObj)
              }
              page.planData.planVo_Items = codeArr;
              page.initBgPlanItemPnl($('#searchPlanPnl'), page.planData);
              $('#inTable').removeClass('hide');
              page.initInTable();
            },
            onComplete: function (sender) {
              //ufma.hideloading();
              if (!$.isNull(saveAllData.planChrId)) {
                $('#cbBgPlan').getObj().val(saveAllData.planChrId);
              } else {
                if (result.data.length > 0) {
                  $('#cbBgPlan').getObj().val(result.data[0].chrId);
                }
              }
            }
          });
        });
      },
      initBgPlanItemPnl: function ($pnl, planData) {
        if (planData != null) {
          var items = planData.planVo_Items;
        }
        var $curRow = $('#planItemMore');
        $curRow.html('');
	        var countItem = 0;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.eleCode == 'sendDocNum' || item.eleCode == 'bgItemIdMx') {
            $curgroup = $('<div class="form-group"style="margin-top:8px;width:24em;margin-left:1em;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub; ">' + item.eleName + '：</lable>').appendTo($curgroup);
            // $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="margin-top:5px;width:30em;margin-left:1em;"></div>').prependTo($curRow);
            // $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub;">' + item.eleName + '：</lable>').appendTo($curgroup);
          } else {
            $curgroup = $('<div class="form-group"style="margin-top:8px;width:24em;margin-left:1em;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub;">' + item.eleName + '：</lable>').appendTo($curgroup);
          }
          if (item.eleCode == 'ISUPBUDGET') {
            var formCtrl = $('<div id="isUpBudget" class="typeTree uf-combox" style=" width:200px;margin-left:3px;"></div>').appendTo($curgroup);
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
            countItem++;
          } else if (item.eleCode == 'sendDocNum') {
            var formCtrl = $('<input id="sendDocNum" class="form-control" style=" width:200px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroup);
            countItem++;
          } else if (item.eleCode == 'bgItemIdMx') {
            var formCtrl = $('<input id="bgItemIdMx" class="form-control" style=" width:200px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroup);
            countItem++;
          } else {
            var formCtrl = $('<div id="cb' + item.eleCode + '" class="ufma-treecombox" style=" width:200px;margin-left:3px;"></div>').appendTo($curgroup);
            var param = {};
            param['agencyCode'] = saveAllData.agencyCode;
            param['setYear'] = saveAllData.setYear;
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
                  readonly: false,
                  data: data, //列表数据
                  placeholder: "请选择" + tmpEleName,
                  onchange: function (sender, data) {

                  },
                  onComplete: function (sender) {
                    countItem++;
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
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
        for (var k = 0; k < planData.planVo_Txts.length; k++) {
          var textItem = planData.planVo_Txts[k]
          var codeId = bg.shortLineToTF(textItem.eleFieldName) 
          var $curRowTetx = $('#planItemMore');
          var $curgroupTetx = $('<div class="form-group"style="margin-top:8px;width:24em;margin-left:1em;"></div>').appendTo($curRowTetx);
          $('<lable class="control-label auto commonShowLab" title="' + textItem.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub; ">' + textItem.eleName + '：</lable>').appendTo($curgroupTetx);
          var formCtrl = $('<input id="'+codeId+'" class="form-control" style=" width:200px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroupTetx);
        }
        //修改页面一直加载的问题
        setTimeout(function(){
          if (countItem == items.length) {
            page.showInTblData();
          }
        },800)
      },

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
          className: "isprint nowrap BGasscodeClass",
          //width: "100px",
          "render": function (data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
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
          //width: "250px",
          "render": function (data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, 
        {
          data: "bgItemSummary",
          title: '摘要',
          className: "isprint nowrap BGThirtyLen",
          //width: "250px",
          "render": function (data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }];
        if (page.planData.isSendDocNum == "是") {
          columns.push({
            data: 'sendDocNum',
            title: page.sendCloName,
            className: 'sendDocNum isprint nowrap BGThirtyLen',
            //width: 220,
            "render": function (data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
            }
          });
        }
        if (page.planData.isFinancialBudget == "1") {
          columns.push({
            data: 'bgItemIdMx',
            title: '财政指标ID',
            className: 'bgItemIdMx isprint nowrap BGThirtyLen',
            //width: 220,
            "render": function (data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
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
            if (cbCode != 'ISUPBUDGET' && cbCode != "sendDocNum" && cbCode != "bgItemIdMx") {
              columns.push({
                data: bg.shortLineToTF(cbCode),
                title: cbName,
                //width: 250,
                className: "nowrap BGThirtyLen",
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
            } else if (cbCode == 'ISUPBUDGET') {
              columns.push({
                data: "isUpBudget",
                title: "是否采购",
                // width: 120,
                className: "nowrap tc",
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
            }
          }
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
          var textCode =  bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
          columns.push({
            data: textCode,
            title: page.planData.planVo_Txts[k].eleName,
            className: 'nowrap BGThirtyLen',
            //width: 200,
            "render": function (data, type, rowdata, meta) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
            }
          });
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
          "scrollY": 225,
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
                '<input type="checkbox" class="checkboxes" data-index="' + meta.row + '" />&nbsp; ' +
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
            //注释弹窗勾选已选单据--zsj
            var arr = [];
            if (!$.isNull(saveAllData.tableCheck)) {
              arr = saveAllData.tableCheck.split(',');
              for (var i = 0; i < arr.length; i++) {
                $('#inTable_wrapper').find(".checkboxes").each(function () {
                  var rowIndex = $(this).attr('data-index');
                  var bgItemCode = '';
                  if (rowIndex) {
                    bgItemCode = inOtable.api(false).row(rowIndex).data().BG_ITEM_CODE;
                  }
                  if (bgItemCode == arr[i]) {
                    $(this).prop('checked', true);
                  }
                });
              }
            }
          }
        }

        inOtable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
      },
      getBgPlanItemMap: function () {
        if ($.isNull(page.planData.planVo_Items)) return {};
        var searchMap = {};
        for (var i = 0; i < page.planData.planVo_Items.length; i++) {
          var item = page.planData.planVo_Items[i];
          var cbItem = item.eleCode;
          var field = item.eleFieldName;
          /*var combox = $('#cb' + cbItem).getObj();
          searchMap[bg.shortLineToTF(field)] = combox.getValue();*/
          if (cbItem == 'ISUPBUDGET') {
            searchMap["isUpBudget"] = $('#isUpBudget').getObj().getValue();
          }else if(cbItem == 'sendDocNum'){
            searchMap['sendDocNum'] = $('#sendDocNum').val();
          } else if(cbItem == 'bgItemIdMx'){
            searchMap['bgItemIdMx'] = $('#bgItemIdMx').val();
          } else {
            var combox = $('#cb' + cbItem).getObj();
            searchMap[bg.shortLineToTF(field)] = combox.getValue();
          }
        };
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
        for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
          var textCode = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName);
          searchMap[textCode] = $('#'+ textCode).val();
        }
        searchMap["bgItemCode"] = $('#bgItemCode').val();
        searchMap["bgItemSummary"] = $('#bgItemSummary').val();
        return searchMap;
      },
      //获取表格数据
      showInTblData: function () {
        var bgPlanId = $('#cbBgPlan').getObj().getValue();
        var surl = "/bg/rule/selectBudgetItems?agencyCode=" + saveAllData.agencyCode + "&rgCode=" + saveAllData.rgCode + "&setYear=" + saveAllData.setYear + "&bgPlanId=" + bgPlanId + "&configType=" + saveAllData.configType;
        //ufma.showloading('数据加载中，请耐心等待...');
        var argu = page.getBgPlanItemMap();
        ufma.post(surl, argu,
          function (result) {
            tblDt = result.data;
            ufma.hideloading();
            inOtable.fnClearTable();
            if (tblDt.length != 0) {
              inOtable.fnAddData(tblDt, true);
            }
            //模拟滚动条
            $('#inTable').closest('.dataTables_wrapper').ufScrollBar({
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
      //保存调入
      inSave: function () {
        var allData = {};
        allData.openArgu = setArgu;
        var items = [];
        $('#inTable_wrapper').find(".checkboxes:checked").each(function () {
          var rowIndex = $(this).attr('data-index');
          var bgItemCode = '';
          if (rowIndex) {
            bgItemCode = inOtable.api(false).row(rowIndex).data().bgItemCode;
          }
          items.push(bgItemCode);
        });
        allData.openChrId = $('#cbBgPlan').getObj().getValue();
        allData.tableData = items;
        _close('save', allData);
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
          var data = [];
          _close('cancle', data);
        });
        $('#btnQuery').on('click', function () {
          page.showInTblData();
        });

        //保存
        $('#btnSave').on('click', function () {
          page.inSave();
        });
      },
      initSendName: function() {
        //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + saveAllData.rgCode + '&setYear=' + saveAllData.setYear + '&agencyCode=' + saveAllData.agencyCode + '&chrCode=BG003';
        ufma.get(bgUrl, {}, function (result) {
          page.needSendDocNum = result.data;
          if (page.needSendDocNum == true) {
            page.sendCloName = "指标id";
          } else {
            page.sendCloName = "发文文号";
          }
        });
      },
      //初始化页面
      initPage: function () {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.initDatePicker();
        page.initSearchPnl();
      },

      init: function () {
        //获取session
        this.initPage();
        page.initSendName();
        this.onEventListener();
        uf.parse();
        ufma.parse();
      }
    }
  }();

  page.init();
});
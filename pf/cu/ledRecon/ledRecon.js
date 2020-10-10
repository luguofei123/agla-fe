$(function() {
	var page = function() {
		var sendObj = {};
		var ptData = {};
		var sessionAccbook = ufma.getSelectedVar();
		var agencyCode = '',
			acctCode = '',
			accbookCode = '',
			accbookName = '';
		var oTable;
		var isNeedAcct;
		var accobookData ;
		return {
      initAgencyScc: function () {
        page.cbAgency = $("#cbAgency").ufmaTreecombox2({
          valueField: "id", //可选
          textField: "codeName", //可选
          readonly: false,
          pIdField: "pId", //可选
          placeholder: "请选择单位",
          icon: "icon-unit",
          theme: "label",
          leafRequire: true,
          onchange: function (data) {
            agencyCode = data.id;
            agencyName = data.name;
            //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
            //缓存单位
            var params = {
              selAgecncyCode: agencyCode,
              selAgecncyName: agencyName,
            };
            ufma.setSelectedVar(params);
            page.checkNeedAcct();

            //月份
            var argu = {
              agencyCode: agencyCode,
              setYear: ptData.svSetYear,
              rgCode: ptData.svRgCode,
            };
            dm.cbbMonth(argu, function (result) {
              $("#month").ufCombox({
                idField: "ENU_CODE",
                textField: "ENU_NAME",
                placeholder: "请选择月份",
                leafRequire: true,
                data: result.data,
                onComplete: function (sender) {
                  var month = parseInt(ptData.svFiscalPeriod);
                  $("#month").getObj().val(month);
                  var timeId = setTimeout(function () {
                    $("#btnQuery").trigger("click");
                    clearTimeout(timeId);
                  }, 300);
                },
              });
            });
          },
        });
        ufma.ajaxDef(dm.getCtrl("agency") + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
          page.cbAgency = $("#cbAgency").ufmaTreecombox2({
            data: result.data,
          });
          var agyCode = $.inArrayJson(result.data, "id", ptData.svAgencyCode);
          if (agyCode != undefined) {
            page.cbAgency.val(ptData.svAgencyCode);
          } else {
            page.cbAgency.val(result.data[0].id);
          }
        });
      },
      initGridDPE: function () {
        columns = [
          {
            title: "月份",
            data: "fisPerdName",
            width: 30,
            className: "tc isprint",
          },
          {
            title: "出纳",
            data: "journalDrMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "总账",
            data: "generalLedgerDrMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "借方差额",
            data: "drBalanceMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              if (val == "0.00") {
                return '<a  class= "drBalance common-jump-link" rowindex="' + meta.row + '" >';
              } else {
                if (sendObj.isLeaf == "1") {
                  //末级账簿可以联查
                  return '<a  class= "drBalance common-jump-link" rowindex="' + meta.row + '" >' + val;
                } else {
                  return val;
                }
              }
            },
          },
          {
            title: "出纳",
            data: "journalCrMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "总账",
            data: "generalLedgerCrMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "贷方差额",
            data: "crBalanceMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              if (val == "0.00") {
                return '<a  class= "crBalance common-jump-link" rowindex="' + meta.row + '" >';
              } else {
                if (sendObj.isLeaf == "1") {
                  //末级账簿可以联查
                  return '<a  class= "crBalance common-jump-link" rowindex="' + meta.row + '" >' + val;
                } else {
                  return val;
                }
              }
            },
          },
          {
            title: "出纳",
            data: "journalRestMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "总账",
            data: "generalLedgerRestMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              return val == "0.00" ? "" : val;
            },
          },
          {
            title: "期末差额",
            data: "restBalanceMoney",
            className: "isprint tdNum tr",
            render: function (data, type, rowdata, meta) {
              var val = $.formatMoney(data);
              if (val == "0.00") {
                return '<a  class= "restBalance common-jump-link" rowindex="' + meta.row + '" >';
              } else {
                if (sendObj.isLeaf == "1") {
                  //末级账簿可以联查
                  return '<a  class= "restBalance common-jump-link" rowindex="' + meta.row + '" >' + val;
                } else {
                  return val;
                }
              }
            },
          },
        ];
        var tableId = "gridDPE";

        oTable = $("#" + tableId).dataTable({
          language: {
            url: bootPath + "agla-trd/datatables/datatable.default.js",
          },
          autoWidth: false,
          bDestory: true,
          processing: true, //显示正在加载中
          pagingType: "full_numbers", //分页样式
          lengthChange: true, //是否允许用户自定义显示数量p
          lengthMenu: [
            [10, 20, 50, 100, 200, -1],
            [10, 20, 50, 100, 200, "全部"],
          ],
          pageLength: 100,
          serverSide: false,
          ordering: false,
          columns: columns,
          data: [],
          dom: '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
          buttons: [
            {
              extend: "print",
              text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              },
              customize: function (win) {
                $(win.document.body).find("h1").css("text-align", "center");
                $(win.document.body).css("height", "auto");
              },
            },
            {
              extend: "excelHtml5",
              text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              },
              customize: function (xlsx) {
                var sheet = xlsx.xl.worksheets["sheet1.xml"];
              },
            },
          ],
          initComplete: function (settings, json) {
            $(".datatable-toolbar").appendTo("#dtToolbar");
            $("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
              "data-toggle": "tooltip",
              title: "打印",
            });
            $("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
              "data-toggle": "tooltip",
              title: "导出",
            });
            //导出begin
            $("#dtToolbar .buttons-excel")
              .off()
              .on("click", function (evt) {
                evt = evt || window.event;
                evt.preventDefault();
                uf.expTable({
                  title: "总账对账",
                  exportTable: "#gridDPE",
                });
              });
            //导出end
            $(".btn-print").removeAttr("href");
            $(".btn-print")
              .off()
              .on("click", function () {
                page.pdfData();
              });
            $('#dtToolbar [data-toggle="tooltip"]').tooltip();
            var toolBar = $(this).attr("tool-bar");
            var $info = $(toolBar + " .info");
            if ($info.length == 0) {
              $info = $('<div class="info"></div>').appendTo($(toolBar + " .tool-bar-body"));
            }
            $info.html("");
            $("." + tableId + "-paginate").appendTo($info);
            ufma.isShow(page.reslist);
          },
          fnCreatedRow: function (nRow, aData, iDataIndex) {
            //$('td:eq(0)', nRow).html(iDataIndex + 1);
          },
          drawCallback: function (settings) {
            $("#gridDPE")
              .find("td.dataTables_empty")
              .text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

            $(".tableBox").css({
              "overflow-x": "auto",
            });
            ufma.isShow(page.reslist);
            ufma.setBarPos($(window));
          },
        });
      },
      //获取表格数据
      loadGridDPE: function () {
        var IS_ONLY_THIS_FISPERD = $("#isShowMonthData").prop("checked");
        var IS_SHOW_DIFFERENCE = $("#isShowDiff").prop("checked");
        var IS_INCLUDE_UNPOST = $("#isShowUnRecon").prop("checked");
        if (IS_ONLY_THIS_FISPERD) {
          IS_ONLY_THIS_FISPERD = "Y";
        } else {
          IS_ONLY_THIS_FISPERD = "N";
        }
        if (IS_SHOW_DIFFERENCE) {
          IS_SHOW_DIFFERENCE = "Y";
        } else {
          IS_SHOW_DIFFERENCE = "N";
        }
        if (IS_INCLUDE_UNPOST) {
          IS_INCLUDE_UNPOST = "Y";
        } else {
          IS_INCLUDE_UNPOST = "N";
        }
        var argu = $("#frmQuery").serializeObject();
        argu = $.extend(argu, {
          agencyCode: agencyCode,
          setYear: ptData.svSetYear,
          rgCode: ptData.svRgCode,
          accountbookGuid: sendObj.accountbookGuid,
          accoCode: sendObj.accoCode,
          acctCode: sendObj.acctCode,
          IS_ONLY_THIS_FISPERD: IS_ONLY_THIS_FISPERD,
          IS_SHOW_DIFFERENCE: IS_SHOW_DIFFERENCE,
          IS_INCLUDE_UNPOST: IS_INCLUDE_UNPOST,
        });
        if (isNeedAcct) {
          argu.acctCode = $("#cbAcct").getObj().getValue();
        }
        dm.loadGridData(argu, function (result) {
			page.printdata = result.data;
          oTable.fnClearTable();
          if (!$.isNull(result.data) && result.data.length > 0) {
            //bug79259--zsj--修改打印时月份为null的问题
            oTable.fnAddData(result.data, true);
          }
          $("#gridDPE").closest(".dataTables_wrapper").ufScrollBar({
            //浮动滚动条
            hScrollbar: true,
            mousewheel: false,
          });
          ufma.setBarPos($(window));
          $("#gridDPE").fixedColumns({
            rightColumns: 1,
          });
        });
      },
      //获取系统选项-各界面需选择账套
      checkNeedAcct: function () {
        //ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function (result) {
        ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002" + "/" + agencyCode, {}, function (result) {
          //CWYXM-11399 --系统管理-系统选项，出纳是否显示账套，设置为单位级控制，但仍然是由系统级控制--zsj
          isNeedAcct = result.data;
          if (isNeedAcct) {
            $("#acct").removeClass("hide");
            $("#cbAcct").ufCombox({
              idField: "code",
              textField: "codeName",
              readonly: false,
              placeholder: "请选择账套",
              icon: "icon-book",
              theme: "label",
              onChange: function (sender, data) {
                acctCode = $("#cbAcct").getObj().getValue();
                acctName = $("#cbAcct").getObj().getText();
                //获取账簿信息
                var url = dm.getCtrl("accBook");
                callback = function (result) {
                  $("#AccBook").getObj().load(result.data);
                  for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].isLeaf == "1") {
                      $("#AccBook").getObj().val(result.data[i].ID);
                      break;
                    }
                  }
                };
                ufma.get(
                  url,
                  {
                    agencyCode: agencyCode,
                    acctCode: acctCode,
                  },
                  callback
                );
              },
              onComplete: function (sender) {
                if (ptData.svAcctCode) {
                  $("#cbAcct").getObj().val(ptData.svAcctCode);
                } else {
                  $("#cbAcct").getObj().val("1");
                }
                ufma.hideloading();
              },
            });
            var argu = {
              agencyCode: agencyCode,
              setYear: ptData.svSetYear,
            };
            callback = function (result) {
              $("#cbAcct").getObj().load(result.data);
            };
            ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, argu, callback);
          } else {
            $("#acct").addClass("hide");
            //获取账簿信息
            var url = dm.getCtrl("accBook");
            callback = function (result) {
              $("#AccBook").getObj().load(result.data);
              for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].isLeaf == "1") {
                  $("#AccBook").getObj().val(result.data[i].ID);
                  break;
                }
              }
            };
            ufma.get(
              url,
              {
                agencyCode: agencyCode,
              },
              callback
            );
          }
        });
      },
      //组织打印数据
			pdfData: function () {
				var printsdataall = {
					'data': page.printdata,
					'agencyCode': agencyCode,
					'agencyName': agencyCode + ' '+agencyName,
					'accountbookName' : sendObj.accountbookName
				}
				if (isNeedAcct) {
					printsdataall.acctCode = acctCode;
					printsdataall.acctName = acctName;
				}
				ufma.post('/cu/print/getPrintDataForBase', printsdataall, function (result) {
					var now = [{}]
					now[0].CU_GENERAL_LEDGER_DATA = result.data[0].CU_JOURNAL_DATA;
					now[0].CU_BOOK_HEAD = result.data[1].CU_JOURNAL_HEAD;
					var coster = JSON.stringify(now)
					page.getPdf('CU_GENERAL_LEDGER', '*', coster)
				})
			},
			getPdf: function (reportCode, templId, groupDef) {
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				formData.append('reportCode', reportCode)
				formData.append('templId', templId)
				formData.append('groupDef', groupDef)
				xhr.open('POST', '/pqr/api/printpdfbydata', true)
				xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
				xhr.responseType = 'blob'

				//保存文件
				xhr.onload = function (e) {
					if (xhr.status === 200) {
						if (xhr.status === 200) {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
						}
					}
				}

				//状态改变时处理返回值
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						//通信成功时
						if (xhr.status === 200) {
							//交易成功时
							ufma.hideloading();
						} else {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							//提示框，各系统自行选择插件
							alert(content)
							ufma.hideloading();
						}
					}
				}
				xhr.send(formData)
			},
      onEventListener: function () {
        $("#btnQuery").click(function () {
          page.loadGridDPE();
        });

        $(document).on("click", function (e) {
          var IS_INCLUDE_UNPOST = $("#isShowUnRecon").prop("checked");
          if (IS_INCLUDE_UNPOST) {
            IS_INCLUDE_UNPOST = "Y";
          } else {
            IS_INCLUDE_UNPOST = "N";
          }
          var rowIndex = $(e.target).attr("rowindex");
          if (rowIndex) {
            var rowData = oTable.api(false).rows(rowIndex).data()[0];
            var style;
            if ($(e.target).is(".drBalance")) {
              style = "drBalance";
            } else if ($(e.target).is(".crBalance")) {
              style = "crBalance";
            } else if ($(e.target).is(".restBalance")) {
              style = "restBalance";
            } else {
              return false;
            }
            ufma.open({
              url: "detailAccount.html",
              title: "对账明细信息",
              width: 1100,
              height: 800,
              data: {
                agencyCode: agencyCode,
                setYear: ptData.svSetYear,
                rgCode: ptData.svRgCode,
                accountbookGuid: sendObj.accountbookGuid,
                accoCode: sendObj.accoCode,
                acctCode: sendObj.acctCode,
                accbookName: accbookName,
                IS_INCLUDE_UNPOST: IS_INCLUDE_UNPOST,
                mainData: rowData,
                style: style,
              },
              ondestory: function (action) {},
            });
          }
        });
      },
      //初始化页面
      initPage: function () {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        //账簿初始化
        $("#AccBook").ufTreecombox({
          idField: "ID", //可选
          textField: "accountbookName", //可选
          readonly: false,
          pIdField: "PID", //可选
          placeholder: "请选择账簿",
          icon: "icon-book",
          theme: "label",
          leafRequire: false, //true,将非叶子节点变为可选
          onChange: function (sender, data) {
			accobookData = data;
			sendObj.accountbookGuid = data.ID;
			sendObj.accountbookName = data.accountbookName;
            sendObj.agencyCode = data.agencyCode;
            sendObj.acctCode = data.ACCT_CODE;
            sendObj.accoCode = data.ACCO_CODE;
            sendObj.accountBookType = data.ACCOUNTBOOK_TYPE; //1 银行 2 现金 3 零余额
            sendObj.isLeaf = data.isLeaf;
            //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
            //缓存账簿
            accbookCode = data.ID;
            accbookName = data.accountbookName;
            var params = {
              selAgecncyCode: agencyCode,
              selAgecncyName: agencyName,
              selAccBookCode: accbookCode,
              selAccBookName: accbookName,
            };
            ufma.setSelectedVar(params);
            page.loadGridDPE();
          },
          onComplete: function (sender) {
            if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode)) {
              $("#AccBook").getObj().val(sessionAccbook.selAccBookCode);
            } else {
              $("#AccBook").getObj().val("1");
            }
          },
        });
        page.initAgencyScc();
        /////////////
        $(".uf-datepicker").ufDatepicker({
          format: "yyyy-mm-dd",
          //viewMode:'month',
          initialDate: new Date(),
        });
        dm.radioLabelDPEType("#apportionType");
        $("#apportionStartMoney").amtInput();
        $("#apportionEndMoney").amtInput();
        page.initGridDPE();
      },

      init: function () {
        //获取session
        ptData = ufma.getCommonData();
        this.initPage();
        this.onEventListener();
        ufma.parse();
        ufma.parseScroll();
      },
    };
	}();

	page.init();
});
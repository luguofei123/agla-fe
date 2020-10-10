$(function () {
  //open弹窗的关闭方法
  window._close = function (action) {
    if (window.closeOwner) {
      var data = { action: action };
      window.closeOwner(data);
    }
  };
  var svData = ufma.getCommonData();

  //接口URL集合
  var interfaceURL = {
    // search:"/prs/EmpClass/selectEmpClass",//查询
    getRptBankFileInitData: "/prs/prsrptbankfile/getRptBankFileInitData", //获取银行代发文件其他初始化数据
    getRptBankFileTableHeaderList:
      "/prs/prsrptbankfile/getRptBankFileTableHeaderList", //获取银行代发文件列表表头
    getRptBankFileDataList: "/prs/prsrptbankfile/getRptBankFileDataList", //获取银行代发文件列表数据
    getPrsBankStyleCoList: "/prs/prsbankstyleco/getPrsBankStyleCoList", //银行代发文件格式列表
    export: "/prs/prsrptbankfile/export", //导出
    bankFileCheck: "/prs/prsrptbankfile/bankFileCheck"//导出前检查
  };
  var pageLength = 25;
  function download(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', filename);
	  element.setAttribute('download', text);
	 
	  element.style.display = 'none';
	  document.body.appendChild(element);
	 
	  element.click();
	 
	  document.body.removeChild(element);
	}
  var page = (function () {
    return {
      orgCodes: '',//部门数据 string 以逗号分隔字符串
      prsOrgsData: [],//部门数据 对象数组
      //表格列
      columns: function (data) {
        page.prItemCodesArr = [];
        page.titleColumns = [];
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
              '<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
              "&nbsp;<span></span></label>",
            className: "nowrap check-style",
            width: 30,
            data: null,
            render: function (data, type, rowdata, meta) {
              return (
                '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" rowId="' + meta.row + '" data-id="' +
                data.id +
                '" />' +
                "&nbsp;<span></span></label>"
              );
            }
          },
          {
            title: "序号",
            className: "nowrap check-style",
            width: 30,
            data: null,
            "bVisible": false,
            render: function (data, type, rowdata, meta) {
              return meta.row + 1;
            }
          },
          // {
          //   title: "人员编码",
          //   className: "nowrap check-style",
          //   width: 80,
          //   data: "EMP_CODE",
          //   // render: function(data, type, rowdata, meta) {
          //   //   return meta.row + 1;
          //   // }
          // }
        ];

        for (var i = 0; i < data.length; i++) {
          var tData = data[i];
          if (data[i].pritemCode.indexOf("PR_PAYLIST_N") == 0) {
            page.prItemCodesArr.push(data[i].pritemCode);
          }
          var obj = {
            title: data[i].pritemName,
            data: data[i].pritemCode,
            className: "isprint nowrap ellipsis",
            render: function (data, type, rowdata, meta) {
              if (!data) {
                return "";
              }

              return data;
            }
          };
          if (data[i].pritemCode.indexOf("PR_PAYLIST_N") > -1) {
            obj.render = function (data, type, rowdata, meta) {
              if (!data || data == 0) {
                return ""
              }
              return '<div style="text-align: right">' + $.formatMoney(data, 2) + '</div>'
            }
          }

          columns.push(obj);
        }
        page.titleColumns = columns;

      },
      //初始化表格
      initTable: function (data) {
        var id = "mainTable";
        var toolBar = $("#" + id).attr("tool-bar");
        page.DataTable = $("#" + id).DataTable({
          language: {
            url: bootPath + "agla-trd/datatables/datatable.default.js"
          },
          data: data,
          searching: true,
          bFilter: false, //去掉搜索框
          bLengthChange: true, //去掉每页显示多少条数据
          processing: true, //显示正在加载中
          pagingType: "full_numbers", //分页样式
          lengthChange: true, //是否允许用户自定义显示数量p
          lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "全部"]],
          pageLength: pageLength,
          bInfo: true, //页脚信息
          bSort: false, //排序功能
          bAutoWidth: false, //表格自定义宽度，和swidth一起用
          bProcessing: true,
          bDestroy: true,
          columns: page.titleColumns,
          // defaultContent:"",
          // "columnDefs": columnDefsArr,
          // "fixedColumns":{
          //     rightColumns: 1
          // },
          // "dom": 'rt<"' + id + '-paginate"ilp>',
          // "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
          dom: '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
          buttons: [
            {
              extend: "print",
              text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
              exportOptions: {
                columns: ".isprint"
              },
              customize: function (win) {
                $(win.document.body)
                  .find("h1")
                  .css("text-align", "center");
                $(win.document.body).css("height", "auto");
              }
            },
            {
              extend: "excelHtml5",
              text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
              exportOptions: {
                columns: ".isprint"
              },
              customize: function (xlsx) {
                var sheet = xlsx.xl.worksheets["sheet1.xml"];
              }
            }
          ],
          initComplete: function (settings, json) {
            $('#' + id).fixedTableHead();
            //checkbox的全选操作
            $(".datatable-group-checkable").on("change", function () {
              var isCorrect = $(this).is(":checked");
              $("#" + id + " .checkboxes").each(function () {
                isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
              });
              $(".datatable-group-checkable").prop("checked", isCorrect);
            });
            $('.datatable-toolbar').appendTo('#dtToolbar');
            var toolBar = $(this).attr('tool-bar')
            var $info = $(toolBar + ' .info');
            if ($info.length == 0) {
              $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
            }
            $info.html('');
            $('.' + id + '-paginate').appendTo($info);
            $("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
              "data-toggle": "tooltip",
              "title": "打印"
            });
            $("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
              "data-toggle": "tooltip",
              "title": "导出"
            });
            //导出begin
            $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
              evt = evt || window.event;
              evt.preventDefault();
              // ufma.expXLSForDatatable($("#" + id), "银行代发文件");
              uf.expTable({
                title: '银行代发文件',
                exportTable: '#' + id,
                topInfo: '',
                bottomInfo: []
              });
            });
            //导出end
            $('[data-toggle="tooltip"]').tooltip();
            $("#mainTable_wrapper").ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            });
            ufma.setBarPos($(window));
            ufma.isShow(page.reslist);
          },
          drawCallback: function (settings) {
            // if (data.length > 0) {
            //   $("#" + id).fixedColumns({
            //     rightColumns: 1 //锁定右侧一列
            //     // leftColumns: 1//锁定左侧一列
            //   });
            // }
            $("#mainTable")
              .find("td.dataTables_empty")
              .text("目前还没有你要查询的数据")
            // .append(
            //   '<img src="' +
            //   bootPath +
            //   'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
            // );

            //权限控制
            ufma.isShow(page.reslist);
            $('#salary-category-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
          }
        });
      },
      //销毁表格
      desTroyTable: function () {
        if (page.DataTable != undefined && $('#mainTable').html() !== "") {
          pageLength = ufma.dtPageLength('#mainTable');
          $("#mainTable_wrapper").ufScrollBar('destroy');
          page.DataTable.clear().destroy();
          $("#mainTable").html("");
        }
      },
      //数据
      getSearchData: function () {
        var dataSource = $(".status .btn-primary").attr("value");
        var checks = $(".wageItems input:checked");
        var prtypeCodes = [];
        for (var i = 0; i < checks.length; i++) {
          prtypeCodes.push($(checks[i]).attr("data-code"));
        }
        var argu = {
          dataSource: dataSource,
          prItemCodes: page.prItemCodesArr,
          prtypeCodes: prtypeCodes,
          prstylCode: $("#prsrtlCode").getObj().getValue(),
          orgCodes: page.orgCodes === '' ? null : page.orgCodes.split(","),
          // orgCodes: $("#departmentCode").ufmaTextboxlist().getValue().length > 0 ? $("#departmentCode")
          //   .ufmaTextboxlist()
          //   .getValue()
          //   .split(",")
          //   : null,
          startMonth: dataSource == "2" ? $("#startMonth").val() : "",
          endMonth: dataSource == "2" ? $("#endMonth").val() : ""
        };
        if ($(".status .btn-primary").attr("value") == "2") {
          argu.startMonth = $("#startMonth").val();
          argu.endMonth = $("#endMonth").val();
        }

        ufma.showloading("正在加载数据请耐心等待...");
        ufma.post(interfaceURL.getRptBankFileDataList, argu, function (result) {
          ufma.hideloading();

          var data = result.data;
          if (page.titleColumns.length == 2) {
            page.desTroyTable();
            page.initTable([]);
            return false
          }
          if (page.DataTable && $("#mainTable").html() != "") {
            page.DataTable.clear();
            page.DataTable.rows.add(data).draw();
            page.DataTable.columns.adjust().draw()
          } else {
            page.initTable(data);
          }

        });
      },
      //获取勾选的数据
      getCheckedRows: function () {
        var checkes = $("input.checkboxes:checked");
        return checkes;
      },
      //初始化银行代发格式
      initBankFormat: function () {
        $("#prsrtlCode").ufCombox({
          idField: "prstylCode",
          textField: "prstylName",
          readonly: true,
          // data: data, //json 数据
          placeholder: "请选择银行代发格式",
          onChange: function (sender, data) {
            page.desTroyTable();
            page.getRptBankFileTableHeaderList();
          },
          onComplete: function (sender) {
            // $("input").attr("autocomplete", "off");
          }
        });
      },
      //获取银行代发格式
      getBankFormat: function (data) {
        $("#prsrtlCode")
          .getObj()
          .load(data);
        if (data.length > 0) {
          $("#prsrtlCode")
            .getObj()
            .val(data[0].prstylCode);
        }
      },
      //工资类别
      getWageItems: function (data) {
        var itemsHTML = '<label class="rpt-check checkAll mt-checkbox mt-checkbox-outline"><input data-code="*" type="checkbox" checked="checked" autocomplete="off">全部<span></span></label>';
        for (var i = 0; i < data.length; i++) {
          itemsHTML +=
            '<label class="rpt-check mt-checkbox mt-checkbox-outline">' +
            '<input name="wageItem" data-code="' +
            data[i].prtypeCode +
            '" type="checkbox" checked="checked" autocomplete="off">' +
            data[i].prtypeName +
            "<span></span>" +
            "</label>";
        }
        $(".wageItems").append(itemsHTML);
        $(".wage-items-hide").append(itemsHTML);
        // var w = $(".portlet-body").width();
        // $(".wageItems").width(w)

      },
      //获取部门数据
      getDepartment: function (data) {
        var obj = {
          id: "0",
          code: "0",
          codeName: "全部",
          pId: null
        }
        data.push(obj);
        page.prsOrgsData = data;

        var arr = [];
        for (var i = 0; i < data.length; i++) {
          arr.push(data[i].code);
        }
        page.orgCodes = arr.join(",");


        // $("#departmentCode").getObj().val(arr.join(","));
        // var treeObj = $.fn.zTree.getZTreeObj("departmentCode_tree");
        // treeObj.expandAll(true);
      },
      //基础数据
      getRptBankFileInitData: function () {
        ufma.showloading("正在加载数据，请耐心等待...")
        ufma.post(interfaceURL.getRptBankFileInitData, {}, function (result) {
          var data = result.data;
          //初始化查询条件label
          page.getWageItems(data.prTypes);
          //不再初始化部门控件 直接将部门信息处理 然后修改页面全局变量
          page.getDepartment(data.prsOrgs);
          //初始化文件格式
          page.getBankFormat(data.prsBankStyles);
          ufma.hideloading();
        });
      },
      //表头
      getRptBankFileTableHeaderList: function () {
        var argu = {
          prsrtlCode: $("#prsrtlCode")
            .getObj()
            .getValue()
        };
        ufma.post(interfaceURL.getRptBankFileTableHeaderList, argu, function (
          result
        ) {
          page.columns(result.data);
          page.getSearchData();
        });

      },
      //获取月份
      getMonth: function () {
        var data = [
          { code: "1", name: "1月" },
          { code: "2", name: "2月" },
          { code: "3", name: "3月" },
          { code: "4", name: "4月" },
          { code: "5", name: "5月" },
          { code: "6", name: "6月" },
          { code: "7", name: "7月" },
          { code: "8", name: "8月" },
          { code: "9", name: "9月" },
          { code: "10", name: "10月" },
          { code: "11", name: "11月" },
          { code: "12", name: "12月" }
        ];
        var optionHtml = "";
        for (var i = 0; i < data.length; i++) {
          optionHtml +=
            '<option value="' +
            data[i].code +
            '">' +
            data[i].name +
            "</option>";
        }
        $("#startMonth").append(optionHtml);
        $("#endMonth").append(optionHtml);
        // $("#startMonth").getObj().load(data);
        // $("#endMonth").getObj().load(data);
      },
      //导出前检查
      bankFileCheck: function () {
        var argu = $("#export").serializeObject();
        ufma.post(interfaceURL.bankFileCheck, argu, function (result) {
        	var downloadUrl = "/prs/prsrptbankfile/export";
        	var callback = function (result) {
        		window.location.href = '/pub/file/download?fileName=' + result.data.fileName + '&attachGuid=' + result.data.attachGuid
				$("#export").remove();
			}
			ufma.post(downloadUrl, argu, callback);
        })
      },
      initPage: function () {
        //权限控制
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.getMonth();

        //初始化银行代发格式控件
        page.initBankFormat();
        //获取初始化查询数据
        page.getRptBankFileInitData();
        // $(".wage-items-hide").slideUp();
      },
      onEventListener: function () {
        //表格单行选中
        $(document).on("click", "tbody tr", function (e) {
          stopPropagation(e);
          if ($("td.dataTables_empty").length > 0) {
            return false;
          }
          var inputDom = $(this).find('input.checkboxes');
          var inputCheck = $(inputDom).prop("checked");
          $(inputDom).prop("checked", !inputCheck);
          $(this).toggleClass("selected");
          var $tmp = $(".checkboxes:checkbox");
          $(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
          return false;
        });

        $('.label-more-self').on('click', function (e) {
          //e.stopPropagation();
          var target = $(this).attr('data-target');
          var targetH = 0;
          var $glyphicon = $(this).find('.glyphicon');
          $(target).css({
            'height': 'auto'
          });
          if ($glyphicon.hasClass('icon-angle-bottom')) {
            $glyphicon.removeClass('icon-angle-bottom');
            $glyphicon.addClass('icon-angle-top');
            $(target).removeClass('none');
          } else {
            $glyphicon.removeClass('icon-angle-top');
            $glyphicon.addClass('icon-angle-bottom');
            $(target).addClass('none');
          }
          ufma.setBarPos($(window));
          $("#mainTable").fixedTableHead();

          //开始渲染部门树
          $("#departmentCode").ufmaTextboxlist({
            valueField: 'id',
            textField: 'codeName',
            name: 'departmentCode',
            leafRequire: true,
            data: page.prsOrgsData,
            expand: true,
            onchange: function (data) {
              // console.log(data);
              page.orgCodes = $("#departmentCode").ufmaTextboxlist().getValue();
            }
          });
          //设置部门数据全选
          $("#departmentCode").ufmaTextboxlist().val(page.orgCodes);

        })
        //状态
        $(".status").on(".btn", function () {
          $(this)
            .addClass("btn-primary")
            .siblings(".btn")
            .removeClass("btn-primary");
        });
        //查询
        $("#btnQuery").on("click", function () {
          page.getSearchData();
        });
        //按钮切换
        $(document).on("click", ".status .select-item", function () {
          $(this)
            .removeClass("btn-default")
            .addClass("btn-primary");
          $(this)
            .siblings(".btn")
            .addClass("btn-default")
            .removeClass("btn-primary");
          if ($(this).hasClass("btn-primary") && $(this).attr("value") == "2") {
            $(".month-element").removeClass("hidden");
          } else {
            $(".month-element").addClass("hidden");
          }
        });
        $("#colAction").on("click", function () {
          $(this)
            .next(".rpt-funnelBoxList")
            .removeClass("hidden");
        });
        //导出
        $("#colList button").on("click", function () {
          $("#export").remove();
          $(this)
            .closest(".rpt-funnelBoxList")
            .addClass("hidden");
          var fileType = $(this).attr("value");
          var prsBankFileDataIds = [];
          var prtypeCodes = [];
          var tableDatas = page.DataTable.data();
          if (tableDatas.length == 0) {
            ufma.showTip("列表无数据，不能生成文件");
            return false
          }
          var trChecks = $("input.checkboxes:checked");
          for (var i = 0; i < trChecks.length; i++) {
            prsBankFileDataIds.push($(trChecks[i]).attr("rowId"));
          }
          var checks = $(".wageItems input:checked");
          for (var i = 0; i < checks.length; i++) {
            prtypeCodes.push($(checks[i]).attr("data-code"));
          }
          var dataSource = $(".status .btn-primary").attr("value");
          var prItemCodes = page.prItemCodesArr.join(",");
          var prstylCode = $("#prsrtlCode").getObj().getValue();
          // var treeObj = $.fn.zTree.getZTreeObj("departmentCode_tree");
          // var nodes = treeObj.getCheckedNodes(true);//获取选中的节点
          var orgCodes = page.orgCodes.split(",");
          // var orgCodes = $("#departmentCode").ufmaTextboxlist().getValue().length > 0 ? $("#departmentCode")
          //         .ufmaTextboxlist()
          //         .getValue()
          //         .split(",")
          //         : null;
          //var orgCodes = []
          /*for (var i = 0; i < nodes.length;i++){
            if (nodes[i]["id"] != "0"){
              orgCodes.push(nodes[i]["id"])
            }
          }*/
          var newOrgCodes = orgCodes.length > 0 ? orgCodes : null

          var startMonth = dataSource == "2" ? $("#startMonth").val() : "";
          var endMonth = dataSource == "2" ? $("#endMonth").val() : "";
          var downloadUrl = "/prs/prsrptbankfile/export";
          var form = $("<form id='export'>");
          form.attr("style", "display:none");
          form.attr("target", "");
          form.attr("method", "post");
          form.attr("action", downloadUrl);
          var input1 = $("<input>"),
            input2 = $("<input>"),
            input3 = $("<input>"),
            input4 = $("<input>"),
            input5 = $("<input>"),
            input6 = $("<input>"),
            input7 = $("<input>"),
            input8 = $("<input>"),
            input9 = $("<input>");
          input10 = $("<input>");
          input1.attr({ type: "hidden", name: "fileType", value: fileType });
          input2.attr({
            type: "hidden",
            name: "prsBankFileDataIds",
            value: prsBankFileDataIds.join(",")
          });
          input3.attr({
            type: "hidden",
            name: "prtypeCodes",
            value: prtypeCodes.join(",")
          });
          input4.attr({ type: "hidden", name: "dataSource", value: dataSource });
          input5.attr({ type: "hidden", name: "prItemCodes", value: prItemCodes });
          input6.attr({ type: "hidden", name: "prstylCode", value: prstylCode });
          input7.attr({ type: "hidden", name: "orgCodes", value: newOrgCodes });
          input8.attr({ type: "hidden", name: "startMonth", value: startMonth });
          input9.attr({ type: "hidden", name: "endMonth", value: endMonth });
          input10.attr({ type: "hidden", name: "agencyName", value: svData.svAgencyName });
          $("body").append(form);
          form.append(input1);
          form.append(input2);
          form.append(input3);
          form.append(input4);
          form.append(input5);
          form.append(input6);
          form.append(input7);
          form.append(input8);
          form.append(input9);
          form.append(input10);
          page.bankFileCheck();
        });
        $(".wageItems").on("change", ".checkAll input", function () {
          if ($(this).prop("checked")) {
            $("input[name=wageItem]").prop("checked", true)
          } else {
            $("input[name=wageItem]").prop("checked", false)
          }
        })
        $(".wageItems").on("change", "input[name=wageItem]", function () {
          var checks = $("input[name=wageItem]:checked");
          var inputs = $("input[name=wageItem]");
          // var index = $(this).closest("label").index();
          // if ($(this).prop("checked")) {
          //   $(".wageItems label").eq(index).find("input[name=wageItem]").prop("checked", true);
          // } else {
          //   $(".wageItemss label").eq(index).find("input[name=wageItem]").prop("checked", false);
          // }
          if (checks.length == inputs.length) {
            $(".checkAll").find("input").prop("checked", true)
          } else {
            $(".checkAll").find("input").prop("checked", false)
          }
        })
        // 点击空白处，设置的弹框消失
        $(document).bind("click", function (e) {
          var div1 = $(".rpt-funnelBoxList")[0];
          var div2 = $(".wageItems")[0];
          var div3 = $(".wage-items-hide")[0];
          if (e.target != div1 && !$.contains(div1, e.target)) {
            $(".rpt-funnelBoxList").addClass("hidden");
          }
          if (e.target != div2 && !$.contains(div2, e.target) && e.target != div3 && !$.contains(div3 == null ? '' : div3, e.target)) {
            // $(".wage-items-hide").addClass("hidden");
            $(".wage-items-hide").slideUp();
          }
        });
        $(".wageItems").on("mouseover", function () {
          // $(".wage-items-hide").removeClass("hidden");
          $(".wage-items-hide").slideDown();
        })
      },

      //此方法必须保留
      init: function () {
        ufma.parse();
        page.initPage();
        page.onEventListener();
        ufma.parseScroll();
      }
    };
  })();
  /////////////////////
  page.init();
  function stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }
});

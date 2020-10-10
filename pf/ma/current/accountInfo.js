$(function () {
  window._close = function (selectData) {
    var data = {
      selectData: selectData
    };
    window.closeOwner(data);
  };
  var ptData = {};
  var rowTableData = {};
  var page = function () {
    return {
      //初始化页面
      initPage: function () {

        page.selectAllAccount();
      },
      selectAllAccount: function () {
        var argu = {
          agencyCode: window.ownerData.agencyCode,
          acctCode: window.ownerData.acctCode,
          rgCode: window.ownerData.rgCode,
          setYear: window.ownerData.setYear
        };
        ufma.get("/ma/sys/current/selectAllAccount", argu, function (result) {
          page.loadGrid(result.data);
        });
      },
      getColumns: function () {
        var columns = [
          {
            title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
            className: "tc nowrap",
            render: function (data, type, rowdata, meta) {
              return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
            },
          },
          {
            title: "银行账户",
            data: "bankAccCode",
            className: "nowrap tl",
            render: function (data, type, rowdata, meta) {
              if ($.isNull(rowTableData[rowdata.chrId])) {
                rowTableData[rowdata.chrId] = rowdata;
              }
              return "<span class='viewData' data-index = '" + rowdata.chrId + "' data-bankCategoryName = '" + rowdata.bankCategoryName + "'data-banknodeName = '" + rowdata.banknodeName + "'>" + rowdata.bankAccCode + "</span>";
            }
          },
          {
            title: "账户名称",
            data: "bankAccName",
            className: "nowrap tl"
          },
          {
            title: "银行类别",
            data: "bankCategoryCode",
            className: "nowrap tl",
            render: function (data, type, rowdata, meta) {
              return rowdata.bankCategoryName
            }
          },
          {
            title: "开户行",
            data: "bankCode",
            className: "nowrap tl",
            render: function (data, type, rowdata, meta) {
              return rowdata.bankCode
            }
          },
          {
            title: "网点行号",
            data: "banknodeCode",
            className: "nowrap tl",
            render: function (data, type, rowdata, meta) {
              return rowdata.banknodeName
            }
          },
          {
            title: "省份",
            data: "province",
            className: "nowrap tl"
          },
          {
            title: "城市",
            data: "city",
            className: "nowrap tl"
          },
          {
            title: "人行联行号",
            data: "pbcInterBankNo",
            className: "nowrap tl"
          }
        ];
        return columns;
      },

      initGrid: function (data) {
        var columns = page.getColumns();
        oTable = $("#gridGOV").dataTable({
          language: {
            url: bootPath + "agla-trd/datatables/datatable.default.js",
          },
          autoWidth: false,
          bDestory: true,
          processing: true, //显示正在加载中
          serverSide: false,
          ordering: false,
          pagingType: "full_numbers", //分页样式
          lengthChange: true, //是否允许用户自定义显示数量p
          lengthMenu: [
            [10, 20, 50, 100, -1],
            [10, 20, 50, 100, "全部"],
          ],
          pageLength: ufma.dtPageLength("#gridGOV"),
          columns: columns,
          scrollY: 330,
          //填充表格数据
          data: data,
          dom: 'rt<"gridGOV-paginate"ilp>',
          // "dom": 'rt<ilp>',
          initComplete: function (settings, json) {
            var toolBar = $(this).attr("tool-bar");
            var $info = $(toolBar + " .info");
            if ($info.length == 0) {
              $info = $('<div class="info"></div>').appendTo($(toolBar + " .tool-bar-body"));
            }
            $info.html("");
            $(".gridGOV-paginate").appendTo($info);
            $("#gridGOV").closest(".dataTables_wrapper").ufScrollBar({
              hScrollbar: true,
              mousewheel: false,
            });
            var layoutUpDown = $(".ufma-layout-updown").height();
            var toolBarH = $("#tool-bar").height();
            var margin = layoutUpDown - toolBarH - 36 - 16 - 16; 
            $(".dataTables_scrollBody").css("height", margin + "px");
            $(".dataTables_scrollBody").css("border-bottom", "none");
            $(".ufma-table").css("width", $(".ufma-table").width() + 6 + "px");
            $("#tool-bar").css("margin-top", margin + "px");
            var top = margin + 28;
            $(".slider").css("top", top + "px");
            $(".checkAll-three").prop("checked", false);
            $(".checkAll-three").on("change", function () { });
            $("#gridGOV").fixedTableHead();
            ufma.setBarPos($(window));
          },
          drawCallback: function () {
            $("#gridGOV")
              .find("td.dataTables_empty")
              .text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

            $("#check-head").prop("checked", false);
            $("#all").prop("checked", false);
          },
        });
      },
      loadGrid: function (data) {
        if ($("#gridGOV").html() != "") {
          $("#gridGOV").dataTable().fnDestroy();
          $("#gridGOV").html("");
        }
        page.initGrid(data);
        ufma.setBarPos($(window));
      },
      save: function (flag) {
        var selectData = [];
        $("#gridGOV tbody tr").each(function (index, row) {
          var $chk = $(this).find("input[type='checkbox']");
          if ($chk.is(":checked") == true) {
            //字符串处理下
            var tempIndex = $(this).find(".viewData").attr("data-index");
            var tempBankCategoryName = $(this).find(".viewData").attr("data-bankCategoryName");
            var tempBanknodeName = $(this).find(".viewData").attr("data-banknodeName");
            var tempData = rowTableData[tempIndex];
            tempData.bankCategoryName = tempBankCategoryName;
            tempData.banknodeName = tempBanknodeName;
            selectData[selectData.length] = tempData;
          }
        });
        if (selectData.length != 0) {
          _close(selectData);
        }
      },
      onEventListener: function () {
        $("#btnOk").on("click", function () {
          page.save(true);
        });
        $("#btnClose").on("click", function () {
          _close();
        });
        //表头全选
        $("body").on("click", "input#check-head", function () {
          var flag = $(this).prop("checked");
          $("#gridGOV_wrapper").find("input.check-all").prop("checked", flag);
          $("#all").prop("checked", flag);
        });
        //全选
        $("#all").on("click", function () {
          var flag = $(this).prop("checked");
          $("#gridGOV_wrapper").find("input.check-all").prop("checked", flag);
          $("#check-head").prop("checked", flag);
        });
        //单选
        $("body").on("click", "input.check-all", function () {
          var num = 0;
          var arr = document.querySelectorAll(".check-all");
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
              num++;
            }
          }
          if (num == arr.length) {
            $("#all").prop("checked", true);
            $("#check-head").prop("checked", true);
          } else {
            $("#all").prop("checked", false);
            $("#check-head").prop("checked", false);
          }
        });
      },

      //此方法必须保留
      init: function () {
        //权限控制
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        this.initPage();
        this.onEventListener();
        ptData = ufma.getCommonData();
        ufma.parseScroll();
        ufma.parse();
      },
    };
  }();

  /////////////////////
  page.init();
});
$(function () {
  window._close = function (action) {
    if (window.closeOwner) {
      var data = {
        action: action,
        flag: page.flag
      };
      window.closeOwner(data);
    }
  }
  var page = function () {
    var pageData = {};
    var oTableCarrry;
    return {
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
      //初始化表格
      initCarryTable: function () {
        if (oTableCarrry) {
          oTableCarrry.fnDestroy();
          $('#carryOver').html('');
        }
        var tblId = 'carryOver';
        var columns = pageData.columns;
        oTableCarrry = $("#" + tblId).dataTable({
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "autoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "lengthMenu": [
            [20, 50, 100, 200, -1],
            [20, 50, 100, 200, "全部"]
          ],
          //"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
          "pageLength": ufma.dtPageLength("#" + tblId),
          "serverSide": false,
          "ordering": false,
          "scrollY": page.getScrollY(),
          "scrollX": true,
          columns: columns,
          "columnDefs": [],
          //填充表格数据
          data: [],
          "dom": "rt",
          initComplete: function (settings, json) {
            ufma.isShow(reslist);
          },
          drawCallback: function (settings) {
            $('#carryOver').find("td.dataTables_empty").text("")
                .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(reslist);
            // ufma.setBarPos($(window));
            var wrapperWidth = $('#carryOver_wrapper').width();
            var tableWidth = $('#carryOver').width();
            if (tableWidth > wrapperWidth) {
              // $('#carryOver').closest('.dataTables_wrapper').ufScrollBar({
              //     hScrollbar: true,
              //     mousewheel: false
              // });
              // ufma.setBarPos($(window));
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              //  $('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
          }
        })
      },

      //获取表格数据
      showTblData: function () {
        ufma.hideloading();
        oTableCarrry.fnClearTable();
        if (pageData.tableData.length > 0) {
          oTableCarrry.fnAddData(pageData.tableData, true);
        }
      },
      onEventListener: function () {
        $('#btnSave').on('click', function () {
          ufma.post('/bg/budgetItem/multiPost/confirmBudgetItemsAdd?billType=' + pageData.billType + '&agencyCode=' + pageData.agencyCode + '&setYear=' + pageData.setYear, pageData.modalCurBgBill,
            function (result) {
              ufma.showTip(result.msg, function () {
                page.flag = true;
                _close('save');
            }, result.flag)
          })
        });
        $('#btnClose').on('click', function () {
          _close('cancle');
        });
        //确认导出
        $('#btnExport').on('click', function () {
          window.location.href = "/bg/budgetItem/downLoad" + "?agencyCode=" + pageData.agencyCode + "&setYear=" + pageData.setYear + "&execlPath=" + pageData.url;
        });
      },
      getScrollY: function () {
        var winH = $(window).height();
        return winH - 56 - 78 - 30 - 20 + 'px';
      },
      //初始化页面
      initPage: function () {
        page.initCarryTable();
        page.showTblData();
      },
      init: function () {
        //获取session
        reslist = ufma.getPermission();
        ufma.isShow(reslist);
        pageData = window.ownerData;
        page.flag = false;
        $('#methodName').html(pageData.msg)
        this.initPage();
        this.onEventListener();
        ufma.parse();
        ufma.parseScroll();
      }
    }
  }();

  page.init();
});
$(function () {
  var page = function () {
    var pageData = {
      agencyCode: '',
      bgplanData: '',
      tblDt: '',
      tabData: [],
      bgPlanCode: ''
    }
    var oTableCarrry, oTableDep, oTablePro;
    var treeObj;
    var checkbox = true;
    var leafRequire = false;
    return {
      //初始化单位
      initAgency: function () {
        ufma.showloading('正在加载数据，请耐心等待...');
        var arguAge = {
          setYear: pageData.setYear,
          rgCode: pageData.rgCode
        }
        var disableFlag = false;
        if (page.disableFlag == true) {
          disableFlag == true;
        } else if (page.disableFlag == false) {
          disableFlag = false;
        }
        ufma.get("/bg/sysdata/getAgencyList", arguAge, function (result) {
          $('#cbAgency').ufTreecombox({
            idField: 'id', //可选
            textField: 'codeName', //可选
            pIdField: 'pId', //可选
            readonly: false,
            placeholder: '请选择单位',
            icon: 'icon-unit',
            theme: 'label',
            leafRequire: true,
            disabled: disableFlag,
            data: result.data,
            onChange: function (sender, treeNode) {
              pageData.agencyCode = treeNode.code;
              page.initCarryTable();
              page.showTblData();
              //缓存单位
              var params = {
                selAgecncyCode: treeNode.code,
                selAgecncyName: treeNode.name,
              }
              ufma.setSelectedVar(params);
            },
            onComplete: function (sender) {
              if (page.pfData.svAgencyCode) {
                $('#cbAgency').getObj().val(page.pfData.svAgencyCode);
              } else {
                $('#cbAgency').getObj().val('1');
              }
              ufma.hideloading();
            }
          });
        })
      },
      // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
      getAuthCur: function () {
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear + '&agencyCode=*' + '&chrCode=BG007';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.authCurFlag = result.data
        })
      },
      //初始化表格
      initCarryTable: function () {
        if (oTableCarrry) {
          oTableCarrry.fnDestroy();
          $('#carryOver').html('');
        }
        var heightScr = $(window).height() - 300;
        var tblId = 'carryOver';
        var columns = [{
          data: "ruleName",
          title: "权限名称",
          className: " nowrap BGThirtyLen",
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<a class="common-jump-link" title="' + data + '" index="' + meta.row + '">' + data + '</a>';
            } else {
              return '';
            }
          }
        }, {
          data: "configTypeName",
          title: "权限类别",
          className: " nowrap",
        }, {
          data: "simpleDeptList",
          title: "授权对象",
          className: " nowrap BGThirtyLen",
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              var dataStr = !$.isNull(rowdata.deptList) ? rowdata.deptList.replaceAll('<br>', ",") : '';
              var reg = /,$/gi;
              dataStr = dataStr.replace(reg, "");
              return '<code title="' + dataStr + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, {
          data: "simpleBgItemList",
          title: "指标编码",
          className: "nowrap BGThirtyLen",
          "orderable": false,
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              var dataStr = !$.isNull(rowdata.bgItemList) ? rowdata.bgItemList.replaceAll('<br>', ",") : '';
              var reg = /,$/gi;
              dataStr = dataStr.replace(reg, "");
              return '<code title="' + dataStr + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, {
          data: "simpleDepartmentList",
          title: "部门",
          className: "nowrap BGThirtyLen",
          "orderable": false,
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              var dataStr = !$.isNull(rowdata.departmentList) ? rowdata.departmentList.replaceAll('<br>', ",") : '';
              var reg = /,$/gi;
              dataStr = dataStr.replace(reg, "");
              return '<code title="' + dataStr + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, {
          data: "simpleProjectList",
          title: "项目",
          className: "nowrap BGThirtyLen",
          "orderable": false,
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              var dataStr = !$.isNull(rowdata.projectList) ? rowdata.projectList.replaceAll('<br>', ",") : '';
              var reg = /,$/gi;
              dataStr = dataStr.replace(reg, "");
              return '<code title="' + dataStr + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, {
          data: "simpleExpecoList",
          title: "部门经济分类",
          className: "nowrap BGThirtyLen",
          "orderable": false,
          render: function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              var dataStr = !$.isNull(rowdata.expecoList) ? rowdata.expecoList.replaceAll('<br>', ",") : '';
              var reg = /,$/gi;
              dataStr = dataStr.replace(reg, "");
              return '<code title="' + dataStr + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }, {
          data: 'opt',
          title: '操作',
          className: 'nowrap optBill tc',
          width: 40,
          "orderable": false,
          render: function (data, type, rowdata, meta) {
            return '<a ruleId="' + rowdata.ruleId + '" dataIndex="' + meta.row + '" class="btn btn-icon-only btn-sm  icon-trash f16 btnBillDelete btn-delete btn-permission" data-toggle="tooltip" title="删除">';
          }
        }];
        var theadhtml = ''
        theadhtml += '<thead id="carryOver">'
        theadhtml += '<tr>'
        theadhtml += '<th rowspan="2">权限名称</th>'
        theadhtml += '<th rowspan="2">权限类别</th>'
        theadhtml += '<th rowspan="2">授权对象</th>'
        theadhtml += '<th colspan="4">权限内容</th>'
        theadhtml += '<th rowspan="2" style="width:40px;">操作</th>'
        theadhtml += '</tr>'
        theadhtml += '<tr>'
        theadhtml += '<th>指标</th>'
        theadhtml += '<th>部门</th>'
        theadhtml += '<th>项目</th>'
        theadhtml += '<th style="border-right:1px solid #d9d9d9">部门经济分类</th>'
        theadhtml += '</tr>'
        theadhtml += '</thead>'
        $('#' + tblId).html(theadhtml);
        oTableCarrry = $("#" + tblId).dataTable({
          "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "data": [],
          "searching": true,
          "bFilter": false, //去掉搜索框
          "processing": true, //显示正在加载中
          "paging": false,
          "bInfo": true, //页脚信息
          "bSort": false, //排序功能
          "bProcessing": true,
          "bDestroy": true,
          "columns": columns,
          "columnDefs": [],
          "ordering": true,
          "bAutoWidth": true, //表格自定义宽度，和swidth一起用
          "fixedHeader": true, //同时固定表头和列样式
          "autoWidth": false,
          // CWYXM-14544 指标权限管理-点击排序按钮，页面向左移动--zsj 
          "scrollY": page.getScrollY(),
          "scrollX": true,
          "serverSide": false,
          // CWYXM-14255--zsj指标权限管理希望能根据一些字段排序。现在都堆在一起，数据量多时不方便查找--zsj
          "ordering": true,
          responsive: false,
          //填充表格数据
          data: [],
          "dom": "rt",
          initComplete: function (settings, json) {
            ufma.isShow(reslist);
            if (page.allTableData && page.allTableData.length == 0) {
              $('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
                "border-bottom": "1px solid transparent"
              });
            } else {
              $('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
                "border-bottom": "1px solid #D9D9D9"
              });
            }

          },
          drawCallback: function (settings) {
            $('#carryOver').find("td.dataTables_empty").text("")
              .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            ufma.isShow(reslist);
            // CWYXM-14544 指标权限管理-点击排序按钮，页面向左移动--zsj 
            var wrapperWidth = $('#carryOver_wrapper').width();
            var tableWidth = $('#carryOver').width();
            if (tableWidth > wrapperWidth) {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
            if (page.allTableData && page.allTableData.length == 0) {
              $('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
                "border-bottom": "1px solid transparent"
              });
            } else {
              $('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
                "border-bottom": "1px solid #D9D9D9"
              });
            }

          }

        })
      },

      //获取表格数据
      showTblData: function () {
        ufma.hideloading();
        var url = '/bg/rule/getRuleDetailList?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
        var argu = {
          authCur : page.authCurFlag
        }
        //外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
        ufma.ajaxDef(url, 'post', argu, function (result) {
          oTableCarrry.fnClearTable();
          if (!$.isNull(result.data) && result.data.length > 0) {
            page.allTableData = result.data;
            oTableCarrry.fnAddData(result.data, true);
          }
        });

      },
      getScrollY: function () {
        var winH = $(window).height();
        return winH - 56 - 78 - 30 - 40 + 'px'
      },
      //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
      getSysFlag: function(){
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear + '&agencyCode=' + pageData.agencyCode + '&chrCode=BG005';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.treeDepType = result.data
        })
      },
      onEventListener: function () {
        $(window).resize(function () {
          oTableCarrry.fnAdjustColumnSizing();
        });
        //新增弹窗
        $("#btnAdd").on('click', function () {
          page.getSysFlag();
          // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
          page.getAuthCur();
          //不要记忆已勾选数据, 相同的覆盖,不同的都保留
          var openData = {};
          openData.agencyCode = pageData.agencyCode;
          openData.setYear = pageData.setYear;
          openData.rgCode = pageData.rgCode;
          openData.pageAction = 'add';
          openData.treeDepType = page.treeDepType;
          // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
          openData.authCurType = page.authCurFlag;
          ufma.open({
            url: 'billPermissions.html',
            title: '新增授权内容',
            width: 1100,
            height: 650,
            data: openData,
            ondestory: function (result) {
              if (result) {
                if (result.action == 'save') {
                  //page.initCarryTable();
                  page.showTblData();
                }
              }
            }
          });
        });
        //编辑弹窗
        $('#carryOver').on('click', '.common-jump-link', function () {
          page.getSysFlag()
          // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
          page.getAuthCur();
          var index = $(this).attr('index');
          var trData = oTableCarrry.api(false).row(index).data();
          trData.pageAction = 'edit';
          trData.agencyCode = pageData.agencyCode;
          trData.setYear = pageData.setYear;
          trData.rgCode = pageData.rgCode;
          trData.treeDepType = page.treeDepType;
          // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
          trData.authCurType = page.authCurFlag;
          ufma.open({
            url: 'billPermissions.html',
            title: '授权内容编辑',
            width: 1100,
            height: 650,
            data: trData,
            ondestory: function (result) {
              if (result) {
                if (result.action == 'save') {
                  //page.initCarryTable();
                  page.showTblData();
                }
              }
            }
          });
        });
        //删除
        $('#carryOver').on('click', '.btnBillDelete', function (e) {
          e.preventDefault();
          var delId = [];
          var delObj = {
            "ruleId": $(this).attr('ruleId')
          };
          delId.push(delObj);
          var url = '/bg/rule/deleteRule?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;;
          var argu = {
            rules: delId
          }
          ufma.post(url, argu, function (result) {
            $(this).closest('tr').remove();
            page.initCarryTable();
            page.showTblData();
          });
        });
      },
      //初始化页面
      initPage: function () {
        this.initAgency();
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
        page.getAuthCur();
      },
      init: function () {
        //获取session
        reslist = ufma.getPermission();
        ufma.isShow(reslist);
        page.pfData = ufma.getCommonData();
        pageData.setYear = parseInt(page.pfData.svSetYear);
        pageData.rgCode = page.pfData.svRgCode;
        page.allTableData = [];
        page.depData = [];
        page.proData = [];
        this.initPage();
        this.onEventListener();
        ufma.parse();
        ufma.parseScroll();
      }
    }
  }();

  page.init();
});
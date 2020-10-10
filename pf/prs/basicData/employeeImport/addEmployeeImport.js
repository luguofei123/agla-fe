$(function() {
  //open弹窗的关闭方法
  window._close = function(action) {
    if (window.closeOwner) {
      var data = { action: action };
      window.closeOwner(data);
    }
  };
  var svData = ufma.getCommonData();
  var ownerData = window.ownerData;

  //接口URL集合
  var interfaceURL = {
    savePrsExcelStyleEmp: "/prs/sys/prsExcelStyleEmp/savePrsExcelStyleEmp", //新增/修改保存
    getPropertyInListUpper: "/prs/emp/maEmpProperty/getPropertyInListUpper", //人员属性代码列表
    selectPrsExcelStyleEmpDetail:
      "/prs/sys/prsExcelStyleEmp/selectPrsExcelStyleEmpDetail", //查询明细
    findPrsType: "/prs/PrsType/findPrsType", //查询工资类别
    getPrsBankStyleCoList: "/prs/prsbankstyleco/getPrsBankStyleCoList" //银行代发文件格式列表
  };
  if (ownerData.isAgency) {
    interfaceURL.savePrsExcelStyleEmp =
        "/prs/base/prsExcelStyleEmpCo/savePrsExcelStyleEmpCo";
    interfaceURL.selectPrsExcelStyleEmpDetail =
      "/prs/base/prsExcelStyleEmpCo/selectPrsExcelStyleEmpCoDetail";
    interfaceURL.findPrsType = "/prs/PrsTypeCo/findPrsTypeCo";
  }
  var pageLength = 25;

  var page = (function() {
    return {
      //表格列
      recombineColumns: function() {
        var columns = [
          [
            // 支持多表头
            {
              type: "indexcolumn",
              field: "ordSeq",
              width: 40,
              name: "序号",
              headalign: "center",
              align: "left",
              render: function(rowid, rowdata, data) {
                return data;
              }
              // onKeyup: function (e) {
              //
              // }
            },
            // {
            //   type: "input",
            //   field: "rowindex",
            //   width: 40,
            //   name: "行序号",
            //   headalign: "center",
            //   align: "left",
            //   onKeyup: function(e) {
            //     if (e.data !== "") {
            //       var newData = e.data.replace(/[^\d+-]/g, "");
            //       $("#nameTable2inputrowindex").val(newData);
            //     }
            //   }
            // },
            {
              type: "combox",
              field: "propertyCode",
              name: "人员属性代码",
              width: 200,
              headalign: "center",
              align: "left",
              idField: "propertyCode",
              textField: "propertyName",
              pIdField: "",
              data: page.propertyInList,
              render: function(rowid, rowdata, data) {
                // for (var i = 0; i < page.propertyInList.length; i++) {
                //   if (page.propertyInList[i].propertyCode == data) {
                //     return page.propertyInList[i].propertyName;
                //     break;
                //   }
                // }
                return rowdata.propertyName;
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {
                //下拉框初始化
                // $(e.sender).getObj().load(src.itemTypeData);
              }
            },
            {
              type: "input",
              field: "columnname",
              width: 200,
              name: "列名",
              headalign: "center",
              align: "left",
              onKeyup: function(e) {
                if (e.data !== "") {
                  var arr = e.data.split();
                  var newArr = [];
                  for (var i = 0; i < e.data.length; i++) {
                    if (!/[A-Z]/.test(e.data[i])) {
                      if (/[a-z]/.test(e.data[i])) {
                        newArr.push(e.data[i].toUpperCase());
                      } else {
                        newArr.push("");
                      }
                    } else {
                      newArr.push(e.data[i]);
                    }
                  }
                  $("#nameTable2inputcolumnindex").val(newArr.join(""));
                }
              }
            },
            // {
            //   type: "input",
            //   field: "columnindex",
            //   width: 200,
            //   name: "列序号",
            //   headalign: "center",
            //   align: "left",
            //   onKeyup: function(e) {
            //     if (e.data !== "") {
            //       var newData = e.data.replace(/[^\d+-]/g, "");
            //       $("#nameTable2inputcolumnindex").val(newData);
            //     }
            //   }
            // },
            {
              type: "toolbar",
              field: "remark",
              width: 140,
              name: "操作",
              align: "center",
              headalign: "center",
              render: function(rowid, rowdata, data) {
                return (
                  '<a class="to-del btn btn-icon-only btn-delete" data-value="2" data-toggle="tooltip" action= "" title="删除">' +
                  '<span class="glyphicon icon-trash"></span></a>'
                );
              }
            }
          ]
        ];
        return columns;
      },
      //表格列
      recombineColumns3: function() {
        var columns = [
          [
            // 支持多表头
            {
              type: "indexcolumn",
              field: "ordSeq",
              width: 40,
              name: "序号",
              headalign: "center",
              align: "left",
              render: function(rowid, rowdata, data) {
                return data;
              }
              // onKeyup: function (e) {
              //
              // }
            },
            {
              type: "combox",
              field: "prtypeCode",
              name: "工资类别",
              width: 200,
              headalign: "center",
              align: "left",
              idField: "prtypeCode",
              textField: "prtypeName",
              pIdField: "",
              data: page.prtypeCode,
              render: function(rowid, rowdata, data) {
                for (var i = 0; i < page.prtypeCode.length; i++) {
                  if (page.prtypeCode[i].prtypeCode == data) {
                    return page.prtypeCode[i].prtypeName;
                    break;
                  }
                }
                return data;
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {
                //下拉框初始化
                // $(e.sender).getObj().load(src.itemTypeData);
              }
            },
            {
              type: "combox",
              field: "prstylCode",
              name: "银行代发文件格式",
              width: 200,
              headalign: "center",
              align: "left",
              idField: "prstylCode",
              textField: "prstylName",
              pIdField: "",
              data: page.prstylCode,
              render: function(rowid, rowdata, data) {
                for (var i = 0; i < page.prstylCode.length; i++) {
                  if (page.prstylCode[i].prstylCode == data) {
                    return page.prstylCode[i].prstylName;
                    break;
                  }
                }
                return data;
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {
                //下拉框初始化
                // $(e.sender).getObj().load(src.itemTypeData);
              }
            },
            {
              type: "combox",
              field: "prstylCodeOther",
              name: "其它银行代发文件格式",
              width: 200,
              headalign: "center",
              align: "left",
              idField: "prstylCodeOther",
              textField: "prstylCodeOtherName",
              pIdField: "",
              data: page.prstylCodeOther,
              render: function(rowid, rowdata, data) {
                for (var i = 0; i < page.prstylCodeOther.length; i++) {
                  if (page.prstylCodeOther[i].prstylCodeOther == data) {
                    return page.prstylCodeOther[i].prstylCodeOtherName;
                    break;
                  }
                }
                return data;
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {
                //下拉框初始化
                // $(e.sender).getObj().load(src.itemTypeData);
              }
            },
            {
              type: "toolbar",
              field: "remark",
              width: 140,
              name: "操作",
              align: "center",
              headalign: "center",
              render: function(rowid, rowdata, data) {
                return (
                  '<a class="to-del btn btn-icon-only btn-delete" data-value="3" data-toggle="tooltip" action= "" title="删除">' +
                  '<span class="glyphicon icon-trash"></span></a>'
                );
              }
            }
          ]
        ];
        return columns;
      },
      //渲染表格
      showTable: function(tableData) {
        page.tableObjData = tableData;
        var id = "nameTable2";
        $("#" + id).ufDatagrid({
          data: tableData,
          disabled: false, // 可选择
          columns: page.recombineColumns(),
          initComplete: function(options, data) {
            //去掉谷歌表单自带的下拉提示
            // $(document).on("focus","input",function () {
            //     $(this).attr("autocomplete", "off");
            // });
          }
        });
      },
      //渲染表格
      showTable3: function(tableData) {
        page.tableObjData = tableData;
        var id = "nameTable3";
        $("#" + id).ufDatagrid({
          data: tableData,
          disabled: false, // 可选择
          columns: page.recombineColumns3(),
          initComplete: function(options, data) {
            //去掉谷歌表单自带的下拉提示
            // $(document).on("focus","input",function () {
            //     $(this).attr("autocomplete", "off");
            // });
          }
        });
      },
      //初始化匹配类型 姓名、人员编号、身份证号
      initMatchitem: function() {
        var data = [
          { code: "name", name: "姓名" },
          { code: "employeeCode", name: "人员编号" },
          { code: "card", name: "身份证号" }
        ];
        $("#matchitem").ufCombox({
          idField: "code",
          textField: "name",
          data: data, //json 数据
          placeholder: "请选择匹配类型",
          onChange: function(sender, data) {},
          onComplete: function(sender) {
            // $("input").attr("autocomplete", "off");
          }
        });
      },
      //银行代发文件格式
      getPrstylCode: function() {
        var argu = {
          prstylCode: "",
          prstylName: ""
        };
        ufma.post(interfaceURL.getPrsBankStyleCoList, argu, function(result) {
          var data = result.data.prsBankStyleCos;
          page.prstylCode = data;
          page.prstylCodeOther = [];
          for (var i = 0; i < data.length; i++) {
            var obj = {
              prstylCodeOther: data[i].prstylCode,
              prstylCodeOtherName: data[i].prstylName
            };
            page.prstylCodeOther.push(obj);
          }

          if (ownerData.action == "edit") {
            //查询明细
            page.selectPrsExcelStyleEmpDetail();
          }else{
            page.showTable([]);
            // page.showTable3([]);
          }
        });
      },
      //获取工资类别
      getPrtypeCode: function() {
        var argu = {
          prtypeCode: "",
          prtypeName: ""
        };
        ufma.post(interfaceURL.findPrsType, argu, function(result) {
          var data = result.data;
          page.prtypeCode = data;
          //银行代发文件格式
          page.getPrstylCode();
        });
      },
      //获取人员属性代码数据
      getPropertyInList: function() {
        var argu = {};
        //人员属性代码列表
        ufma.get(interfaceURL.getPropertyInListUpper, argu, function(result) {
          var data = result.data;
          var newData = [];
          for(var i=0;i<data.length;i++){
              var obj = {
                propertyCode:data[i].PROPERTY_CODE,
                propertyName:data[i].PROPERTY_NAME,
              }
              newData.push(obj);
          }
          newData.push({propertyCode:"PRTYPE_CODE",propertyName:"工资类别"},
          {propertyCode:"AGENCY_NAME",propertyName:"单位名称"},
          {propertyCode:"ORG_NAME",propertyName:"部门名称"},
          {propertyCode:"PRSTYL_CODE",propertyName:"银行代发文件格式"},
          {propertyCode:"PRSTYL_CODE_OTHER",propertyName:"其他代发文件格式"})

          page.propertyInList = newData;
          //获取工资类别
          page.getPrtypeCode();
        });
      },
      changeMatchItem: function(item) {
        if (item == "姓名") {
          item = "name";
        } else if (item == "人员编号") {
          item = "employeeCode";
        } else if (item == "身份证号") {
          item = "card";
        }
        return item;
      },
      //修改set值
      setValue: function(data) {
        data.matchitem = page.changeMatchItem(data.matchitem);
        data.doublematchitem = page.changeMatchItem(data.doublematchitem);
        $("#frmQuery").setForm(data);
      },
      //查询明细
      selectPrsExcelStyleEmpDetail: function() {
        var argu = {
          id: ownerData.rowId,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        };
        if(ownerData.isAgency){
            argu.agencyCode = svData.svAgencyCode
        }
        //查询明细
        ufma.post(interfaceURL.selectPrsExcelStyleEmpDetail, argu, function(
          result
        ) {
          var data = result.data;
          page.setValue(data);
          if(ownerData.isAgency){
            page.showTable(data.prsExcelStyleColumnEmpCoList);
            // page.showTable3(data.prsExcelStyleTypeEmpCoList);
          }else{
            page.showTable(data.prsExcelStyleColumnEmpList);
            // page.showTable3(data.prsExcelStyleTypeEmpList);
          }
          
        });
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        //初始化表格
        page.showTable([]);
        // page.showTable3([]);
        //初始化匹配类型 姓名、人员编号、身份证号
        page.initMatchitem();
        //获取人员属性代码数据
        page.getPropertyInList();
      },
      onEventListener: function() {
        //选择SQL语句引用值集界面变化
        $('input[name="sqlValue"]').on("change", function() {
          if ($(this).prop("checked")) {
            $("#sqlValueCodes").attr("disabled", false);
            $(".manual-opt").attr("disabled", true);
            $(".btn-preview").attr("disabled", false);
          } else {
            $("#sqlValueCodes").attr("disabled", true);
            $(".manual-opt").attr("disabled", false);
            $(".btn-preview").attr("disabled", true);
          }
        });
        //关闭
        $("#btn-close").on("click", function() {
          _close();
        });
        //确定
        $("#btn-sure").on("click", function() {
          var argu = $("#frmQuery").serializeObject();
          //校验

          if (argu.name == "") {
            ufma.showTip("请写格式名称", function() {}, "warning");
            return false;
          } else if (argu.matchcolumnindex == "") {
            ufma.showTip("请写匹配序列号", function() {}, "warning");
            return false;
          } else if (argu.matchitem == "") {
            ufma.showTip("请选择匹配类型", function() {}, "warning");
            return false;
          }

          if (argu.sheetid == "") {
            ufma.showTip("请输入页签号", function() {}, "warning");
            return false;
          }

          if (argu.datarowindex == "") {
            ufma.showTip("请输入导入开始行", function() {}, "warning");
            return false;
          }

          argu.matchitem = $("#matchitem")
            .getObj()
            .getItem().name;
          argu.rgCode = svData.svRgCode;
          argu.setYear = svData.svSetYear;
          // argu.agencyCode = "*";
          argu.columntype = "";
          argu.id = "";
          if (ownerData.isAgency) {
            argu.agencyCode = svData.svAgencyCode;
          }
          if (ownerData.action == "edit") {
            argu.id = ownerData.rowId;
          }
          
          if(ownerData.isAgency){
            argu.prsExcelStyleColumnEmpCoList = [];
            argu.prsExcelStyleTypeEmpCoList = [];
          }else{
            argu.prsExcelStyleColumnEmpList = [];
            argu.prsExcelStyleTypeEmpList = [];
          }
          var tableDatas2 = $("#nameTable2")
            .getObj()
            .getData();
          // var tableDatas3 = $("#nameTable3")
          //   .getObj()
          //   .getData();
          for (var i = 0; i < tableDatas2.length; i++) {
            var obj = {
              // columnindex: tableDatas2[i].columnindex,
              columnname: tableDatas2[i].columnname,
              // rowindex: tableDatas2[i].rowindex,
              propertyCode:tableDatas2[i].propertyCode,
              id: "",
              rgCode: svData.svRgCode,
              setYear: svData.svSetYear
            };
            if (ownerData.action == "edit") {
              obj.id = tableDatas2[i].id?tableDatas2[i].id:"";
            }
            if (ownerData.isAgency) {
                obj.agencyCode = svData.svAgencyCode;
                argu.prsExcelStyleColumnEmpCoList.push(obj);
              }else{
                argu.prsExcelStyleColumnEmpList.push(obj);
              }
            
          }
          // for (var i = 0; i < tableDatas3.length; i++) {
          //   var obj = {
          //     prstylCodeOther: tableDatas3[i].prstylCodeOther,
          //     prtypeCode: tableDatas3[i].prtypeCode,
          //     prstylCode: tableDatas3[i].prstylCode,
          //     id: "",
          //     rgCode: svData.svRgCode,
          //     setYear: svData.svSetYear
          //   };
          //   if (ownerData.action == "edit") {
          //     obj.id = tableDatas3[i].id?tableDatas3[i].id:"";
          //   }
          //   if (ownerData.isAgency) {
          //       obj.agencyCode = svData.svAgencyCode;
          //       argu.prsExcelStyleTypeEmpCoList.push(obj);
                
          //     }else{
          //       argu.prsExcelStyleTypeEmpList.push(obj);
          //     }
            
          // }
          ufma.post(interfaceURL.savePrsExcelStyleEmp, argu, function(result) {
            var closeData = {
              msg: result.msg,
              flag: result.flag,
              action: "save"
            };
            _close(closeData);
          });
        });
        //增行
        $(document).on("mousedown", ".btn-add-row", function() {
          var btnValue = $(this).attr("data-value");
          var rowdata = {};
          var obj = $("#nameTable" + btnValue).getObj();
          obj.add(rowdata);
          // ufma.isShow(page.reslist);
        });
        //删行
        $(document).on("mousedown", "a.btn-delete", function() {
          var rowid = $(this)
            .parents("tr")
            .attr("id");
          var value = $(this).attr("data-value");
          var rowindex = $(this)
            .parents("tr")
            .index();
          // tgDetaildatahq.splice(rowindex, 1)
          var obj = $("#nameTable" + value).getObj();
          obj.del(rowid);
        });
        //tab切换
        $(".nav-tabs li").on("click", function() {
          var index = $(this).index();
          $(".nav-content")
            .eq(index)
            .removeClass("hidden")
            .siblings(".nav-content")
            .addClass("hidden");
          var nameTableData = [];
          if (index == 0) {
            if ($("#nameTable2").getObj().getData) {
              nameTableData = $("#nameTable2")
                .getObj()
                .getData();
            }
            page.showTable(nameTableData);
          } else if (index == 1) {
            if ($("#nameTable3").getObj().getData) {
              nameTableData = $("#nameTable3")
                .getObj()
                .getData();
            }
            page.showTable3(nameTableData);
          }
        });
      },

      //此方法必须保留
      init: function() {
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

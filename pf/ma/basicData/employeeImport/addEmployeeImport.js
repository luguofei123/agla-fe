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
    savePrsExcelStyleEmp: "/ma/sys/prsExcelStyleEmp/savePrsExcelStyleEmp", //新增/修改保存
    getPropertyInListUpper: "/ma/emp/maEmpProperty/getPropertyInListUpper", //人员属性代码列表
    selectPrsExcelStyleEmpDetail:
      "/ma/sys/prsExcelStyleEmp/selectPrsExcelStyleEmpDetail" //查询明细
  };
  if (ownerData.isAgency) {
    interfaceURL.savePrsExcelStyleEmp =
        "/ma/base/prsExcelStyleEmpCo/savePrsExcelStyleEmpCo";
    interfaceURL.selectPrsExcelStyleEmpDetail =
      "/ma/base/prsExcelStyleEmpCo/selectPrsExcelStyleEmpCoDetail";
    interfaceURL.exportEmpTemplateFile = "/ma/base/prsExcelStyleEmpCo/exportEmpTemplateFile";
  }
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
              align: "center",
              render: function(rowid, rowdata, data) {
                // console.log(rowid,rowdata,data);
                var len = $('#nameTable2Body .uf-grid-body-view tr').length;
                return len;
              }
            },
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
                return rowdata.propertyName;
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {
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
            {
              type: "toolbar",
              field: "remark",
              width: 140,
              name: "操作",
              align: "center",
              headalign: "center",
              render: function(rowid, rowdata, data) {
                console.log(rowid,rowdata,data);
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
              align: "center",
              render: function(rowid, rowdata, data) {
                // console.log(rowid,rowdata,data);
                var len = $('##nameTable3Body .uf-grid-body-view tr').length;
                return len;
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
                console.log(rowid,rowdata,data);
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
      //初始化匹配类型
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
        var data = [];
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
          page.selectPrsExcelStyleEmpDetail();
        }else{
          page.showTable([]);
          page.showTable3([]);
        }
      },
      //获取工资类别
      getPrtypeCode: function() {
        var argu = {
          prtypeCode: "",
          prtypeName: ""
        };
        var data = [];
        page.prtypeCode = data;
        page.getPrstylCode();
      },
      //获取人员属性代码数据
      getPropertyInList: function() {
        var argu = {};
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
          newData.push(
          {propertyCode:"AGENCY_NAME",propertyName:"单位名称"},
          {propertyCode:"ORG_NAME",propertyName:"部门名称"},
          {propertyCode:"TYPE_CODE",propertyName:"人员身份"})

          page.propertyInList = newData;
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
        ufma.post(interfaceURL.selectPrsExcelStyleEmpDetail, argu, function(
          result
        ) {
          var data = result.data;
          page.setValue(data);
          if(ownerData.isAgency){
            page.showTable(data.prsExcelStyleColumnEmpCoList);
            page.showTable3(data.prsExcelStyleTypeEmpCoList);
          }else{
            page.showTable(data.prsExcelStyleColumnEmpList);
            page.showTable3(data.prsExcelStyleTypeEmpList);
          }
          
        });
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        console.log(ownerData.isAgency);
        if(!ownerData.isAgency){
        	$("#btn-export").addClass("hidden")
        }
        //初始化表格
        page.showTable([]);
        page.showTable3([]);
        page.initMatchitem();
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
          var tableDatas3 = $("#nameTable3")
            .getObj()
            .getData();
          var orgName = "";
          var empCode = "";
          var empName = "";
          for (var i = 0; i < tableDatas2.length; i++) {
	          var item = tableDatas2[i]
	          var valId = item.propertyCode
	          var val = item.columnname
	          var rowIndex = i + 1;
	          if (valId.trim() == 'ORG_NAME') {
	        	  orgName = valId;
	          }
	          if (valId.trim() == 'EMP_CODE') {
	        	  empCode = valId;
	          }
	          if (valId.trim() == 'EMP_NAME') {
	        	  empName = valId;
	          }
	          if ($.isNull(valId.trim())) {
	            ufma.showTip(
	              '表格第' + rowIndex + '行的人员属性代码没有填写',
	              function() {},
	              'warning'
	            )
	            return false
	          }
	          if ($.isNull(val.trim())) {
	            ufma.showTip(
	              '表格第' + rowIndex + '行的列名没有填写',
	              function() {},
	              'warning'
	            )
	            return false
	          }
            var obj = {
              // columnindex: tableDatas2[i].columnindex,
              columnname: tableDatas2[i].columnname,
              // rowindex: tableDatas2[i].rowindex,
              propertyName:tableDatas2[i].propertyName,
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
          if ($.isNull(orgName)) {
            ufma.showTip(
              '表格没有填写部门名称！',
              function() {},
              'warning'
            )
            return false
          }
          if ($.isNull(empCode)) {
	          ufma.showTip(
	            '表格没有填写人员编码！',
	            function() {},
	            'warning'
	          )
	          return false
	      }
          if ($.isNull(empName)) {
              ufma.showTip(
                '表格没有填写人员姓名！',
                function() {},
                'warning'
              )
              return false
          }
          for (var i = 0; i < tableDatas3.length; i++) {
            var obj = {
              prstylCodeOther: tableDatas3[i].prstylCodeOther,
              prtypeCode: tableDatas3[i].prtypeCode,
              prstylCode: tableDatas3[i].prstylCode,
              id: "",
              rgCode: svData.svRgCode,
              setYear: svData.svSetYear
            };
            if (ownerData.action == "edit") {
              obj.id = tableDatas3[i].id?tableDatas3[i].id:"";
            }
            if (ownerData.isAgency) {
                obj.agencyCode = svData.svAgencyCode;
                argu.prsExcelStyleTypeEmpCoList.push(obj);
                
              }else{
                argu.prsExcelStyleTypeEmpList.push(obj);
              }
            
          }
          if(ownerData.isAgency){
            if(argu.prsExcelStyleColumnEmpCoList.length<=0){
              delete argu.prsExcelStyleColumnEmpCoList
            }
            if(argu.prsExcelStyleTypeEmpCoList.length<=0){
              delete argu.prsExcelStyleTypeEmpCoList
            }
          }else{
            if(argu.prsExcelStyleColumnEmpList.length<=0){
              delete argu.prsExcelStyleColumnEmpList
            }
            if(argu.prsExcelStyleTypeEmpList.length<=0){
              delete argu.prsExcelStyleTypeEmpList
            }
          }
          ufma.post(interfaceURL.savePrsExcelStyleEmp, argu, function(result) {
            var closeData = {
              msg: result.msg,
              flag: result.flag,
              action: "save"
            };
            _close(closeData);
          });
        });
      //导出模板
        $("#btn-export").on("click", function() {
          var argu = $("#frmQuery").serializeObject();
          argu.matchitem = $("#matchitem")
            .getObj()
            .getItem().name;
          argu.rgCode = svData.svRgCode;
          argu.setYear = svData.svSetYear;
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
          var tableDatas3 = $("#nameTable3")
            .getObj()
            .getData();
          var orgName = "";
          var empCode = "";
          var empName = "";
          for (var i = 0; i < tableDatas2.length; i++) {
	          var item = tableDatas2[i]
	          var valId = item.propertyCode
	          var val = item.columnname
	          var rowIndex = i + 1;
	          if (valId.trim() == 'ORG_NAME') {
	        	  orgName = valId;
	          }
	          if (valId.trim() == 'EMP_CODE') {
	        	  empCode = valId;
	          }
	          if (valId.trim() == 'EMP_NAME') {
	        	  empName = valId;
	          }
	          if ($.isNull(valId.trim())) {
	            ufma.showTip(
	              '表格第' + rowIndex + '行的人员属性代码没有填写',
	              function() {},
	              'warning'
	            )
	            return false
	          }
	          if ($.isNull(val.trim())) {
	            ufma.showTip(
	              '表格第' + rowIndex + '行的列名没有填写',
	              function() {},
	              'warning'
	            )
	            return false
	          }
            var obj = {
              columnname: tableDatas2[i].columnname,
              propertyCode:tableDatas2[i].propertyCode,
              propertyName:tableDatas2[i].propertyName,
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
          for (var i = 0; i < tableDatas3.length; i++) {
            var obj = {
              prstylCodeOther: tableDatas3[i].prstylCodeOther,
              prtypeCode: tableDatas3[i].prtypeCode,
              prstylCode: tableDatas3[i].prstylCode,
              id: "",
              rgCode: svData.svRgCode,
              setYear: svData.svSetYear
            };
            if (ownerData.action == "edit") {
              obj.id = tableDatas3[i].id?tableDatas3[i].id:"";
            }
            if (ownerData.isAgency) {
                obj.agencyCode = svData.svAgencyCode;
                argu.prsExcelStyleTypeEmpCoList.push(obj);
                
              }else{
                argu.prsExcelStyleTypeEmpList.push(obj);
              }
            
          }
          if(ownerData.isAgency){
            if(argu.prsExcelStyleColumnEmpCoList.length<=0){
              delete argu.prsExcelStyleColumnEmpCoList
            }
            if(argu.prsExcelStyleTypeEmpCoList.length<=0){
              delete argu.prsExcelStyleTypeEmpCoList
            }
          }else{
            if(argu.prsExcelStyleColumnEmpList.length<=0){
              delete argu.prsExcelStyleColumnEmpList
            }
            if(argu.prsExcelStyleTypeEmpList.length<=0){
              delete argu.prsExcelStyleTypeEmpList
            }
          }
          argu.agencyName = svData.svAgencyName;
          var obj = JSON.stringify(argu);
          ufma.post(interfaceURL.exportEmpTemplateFile, argu, function (result) {
        	  window.location.href = '/pub/file/download?fileName=' + result.data.fileName + '&attachGuid=' + result.data.attachGuid;
          });
        });
        //增行
        $(document).on("mousedown", ".btn-add-row", function() {
          var btnValue = $(this).attr("data-value");
          var rowdata = {};
          var obj = $("#nameTable" + btnValue).getObj();
          obj.add(rowdata);
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
          var obj = $("#nameTable" + value).getObj();
          obj.del(rowid);
          //表格序号重新排列
          $("#nameTable" + value+" .indexcolumn").each(function(i){
            $(this).html(parseInt(i)+1);
          })
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

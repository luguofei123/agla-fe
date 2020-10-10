$(function () {
  var table_Main = "bgItems-data";
  var setYear ;
  var table_SuperposedLayer = "bgItems-data-edt";
  var modalTbl = null;
  var dataWhenRowDelBtnClick = null;

  var requestUrlArray = [
    getURL(0) + "/bg/sys/bgItem/getBgItems",       //0
    getURL(0) + "/bg/sys/bgItem/getMaItems",       //1
    getURL(0) + "/bg/sys/bgItem/useBgItems",       //2
    getURL(0) + "/bg/sys/bgItem/unUseBgItems",     //3
    getURL(0) + "/bg/sys/bgItem/activeBgItems",                 //5
    getURL(0) + "/bg/sys/bgItem/checkUseBgItemTxts"       //6

  ];
    
  var initMainTbl = function (result) {
    ufma.isShow(reslist);
    var tblHeight = parseFloat($("#workspaceBody").height()) - parseFloat($("#workspaceBody_Top").outerHeight()) - 35;
    var toolbar = "bgItems-data-tool-bar";
    var argu = {
      "agencyCode":page.agencyCode,
      "setYear": page.setYear, 
      "allBgItem": 0,
      "queryType":page.queryType
    }
    var tbData;
    ufma.ajaxDef(requestUrlArray[0],'get',argu,function(data){
      tbData = data.data.items;
    })
    var dataTbl = $("#" + table_Main).DataTable({
      "language": {
        "url": bootPath + "agla-trd/datatables/datatable.default.js"
      },
      // "ajax": {
      //   "url": requestUrlArray[0],
      //   "data": { "agencyCode":page.agencyCode, "setYear": page.setYear, "allBgItem": 0,"queryType":page.queryType },
      //   "type": "get",
      //   "dataSrc": "data.items"
      // },
      data: tbData,
      "bFilter": false, //去掉搜索框
      "bLengthChange": true, //去掉每页显示多少条数据
      "processing": true,//显示正在加载中
      "bInfo": false,//页脚信息
      "bSort": false, //排序功能
      "bAutoWidth": true,//表格自定义宽度，和swidth一起用  表头的控制有一点问题,待查会有晃得一下 当收缩门户的菜单时
      "bProcessing": true,
      "bDestroy": true,
      "bPaginate": false,
      //"scrollY": tblHeight + "px",
      columns: [
        {
          title: "要素编码",
          data: "eleCode",
          "visible": false,
        },
        {
          title: "指标要素",
          data: "eleName",
          className: "BGThirtyLen"
          // width: "30%"
        },
        {
          title: "编码规则",
          data: "codeRule",
          className: "BGasscodeClass"
        },
        {
          title: "控制方式",
          data: "controlLevelName",
          className: "BGTenLen"
        },
        {
          title: "chrid",    // 4列
          data: "chrId",
          visible: false,
          className: "mainTbl-cell-bgItemChrId"
        },
        {
          title: "操作",
          data: '',
          width:80
          }],
      columnDefs: [
        {
            "targets": [1],
            "serchable": false,
            "orderable": false,
            "className": "coaAcc-subject"
        },
        {
            "targets": [4],
            "render": function (data, type, rowdata, meta) {
                if (rowdata.enabled == 1) {
                    return '<span style="color:#00A854">' + data + '</span>';
                } else {
                    return '<span style="color:#F04134">' + data + '</span>';
                }
            }
        },
        {
            "targets": [-1],
            "serchable": false,
            "orderable": false,
            "className": "text-center nowrap btnGroup",
            "render": function (data, type, rowdata, meta) {
                var active = rowdata.isDeleted == 0 ? 'disabled' : '';
                var unactive = rowdata.isDeleted == 1 ? 'disabled' : '';
                return '<a class="btn btn-icon-only btn-sm btn-stop btn-delete btn-permission" data-toggle="tooltip" ' + unactive + ' action= "unactive" ' +
                    'rowid="' + data + '" title="停用">' +
                    '<span class="glyphicon icon-ban"></span></a>';
            }
        }],
      //"dom": 'rt',
      "fnDrawCallback": function (setting, json) {
        //单击行，选中复选框
        $("#" + table_Main + " tbody td:not(.btnGroup)").on("click", function (e) {
          e.preventDefault(); //取消事件的默认动作
          var $ele = $(e.target); //获得触发事件的元素（id名字）
          var $tr = $ele.closest('tr');  //获得符合条件的第一个祖父级节点
          if ($tr.hasClass('selected')) {
            $tr.removeClass('selected');
            $tr.find('input[type="checkbox"]').prop("checked", false);
          } else {
            $tr.addClass('selected');
            $tr.find('input[type="checkbox"]').prop("checked", true);
          }
        });

        $("#" + table_Main + " tbody").find(".btn-delete").ufTooltip({
          content: "您确定停用当前指标要素吗?",
          onYes: function () {
            activeOrUnActioveOneBgItem(false, dataWhenRowDelBtnClick);//停用
          },
          onNo: function () { }
        });

        $("#" + table_Main + " tbody").find(".btn-delete").off("click.bgitem").on("click.bgitem", function () {
          var tr = $(this).closest('tr');
          var table = $("#" + table_Main).DataTable();
          dataWhenRowDelBtnClick = table.row(tr).data();
        });

        ufma.isShow(reslist);
      }
    });

  };
  // 获取表格数据
  var getTableData = function() {
    var argu = {
      "agencyCode": page.agencyCode,
      "setYear": page.setYear,
      "rgCode" : page.rgCode,
      "queryType":page.queryType }
    ufma.get(requestUrlArray[1],argu,function(result){
      initSuperposedLayerTbl(result);
    })
  // $.ajax({
  //     url: requestUrlArray[1],
  //     data: { "agencyCode": page.agencyCode, "setYear": page.setYear,"rgCode" : page.rgCode,"queryType":page.queryType },
  //     dataType: "json",
  //     type: "GET",
  //     async: false,
  //     contentType: 'application/json; charset=utf-8',
  //     success: function (result) {
  //         initSuperposedLayerTbl(result);
  //     }
  // });
  }
  // 显示表格
  var initSuperposedLayerTbl = function (result) {
    if (!$.isNull(modalTbl)) {
      modalTbl.destroy();
      $("#" + table_SuperposedLayer).empty();
      modalTbl = null;
    }
    modalTbl = $("#" + table_SuperposedLayer).DataTable({
      "language": {
        "url": bootPath + "agla-trd/datatables/datatable.default.js"
      },
      data: result.data.items,
      "bFilter": false, //去掉搜索框
      "bLengthChange": true, //去掉每页显示多少条数据
      "processing": true,//显示正在加载中
      "bInfo": false,//页脚信息
      "bSort": false, //排序功能
      "bAutoWidth": false,//表格自定义宽度，和swidth一起用
      //			"scrollY" : "200px",
      "bProcessing": true,
      "bPaginate": false,
      "bDestroy": true,
      columns: [{
        title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
          '<input type="checkbox" class="datatable-group-checkable"/> &nbsp;' +
          '<span></span> ' +
          '</label>',
        data: "chrId"
      },
      {
        title: "要素编码",
        data: "eleCode",
        "visible": false
      },
      {
        title: "指标要素",
        data: "eleName",
        // width: "30%"
        className: "BGThirtyLen"
      },
      {
        title: "编码规则",
        data: "codeRule",
        className: "BGasscodeClass"
      },
      {
        title: "控制方式",
        data: "controlLevelName",
        className: "BGTenLen"
      }],
      columnDefs: [{
        "targets": [0],
        "serchable": false,
        "orderable": false,
        "className": "nowrap",
        "render": function (data, type, rowdata, meta) {
          return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
            '<input type="checkbox" class="checkboxes" value="' + data + '" data-level="' +
            rowdata.levelNum + '"/> &nbsp;' +
            '<span></span> ' +
            '</label>';
        }
      }],
      "dom": 't',
      "fnDrawCallback": function (setting, json) {
        //表头勾选后，全选和消除
        $("#" + table_SuperposedLayer + " thead :input[type='checkbox']").on("change", function (e) {
          e.preventDefault(); //取消事件的默认动作
          var $ele = $(e.target); //获得触发事件的元素（id名字）
          var $tr = $ele.closest('tr');
          if ($tr.find('input[type="checkbox"]').is(':checked') == true) {
            $("#" + table_SuperposedLayer + " tbody tr").find('input[type="checkbox"]').prop("checked", true);
            $("#" + table_SuperposedLayer + " tbody tr").addClass('selected');
          } else {
            $("#" + table_SuperposedLayer + " tbody tr").find('input[type="checkbox"]').prop("checked", false);
            $("#" + table_SuperposedLayer + " tbody tr").removeClass('selected');
          }
        });
        //单击行，选中复选框
        $("#" + table_SuperposedLayer + " tbody td").on("click", function (e) {
          e.preventDefault(); //取消事件的默认动作
          var $ele = $(e.target); //获得触发事件的元素（id名字）
          var $tr = $ele.closest('tr');  //获得符合条件的第一个祖父级节点
          if ($tr.hasClass('selected')) {
            $tr.removeClass('selected');
            $tr.find('input[type="checkbox"]').prop("checked", false);
          } else {
            $tr.addClass('selected');
            $tr.find('input[type="checkbox"]').prop("checked", true);
          }
        });
      }
    });
  };

  //批量启用停用, obj = [obj1, obj2, obj3....]
  var activeOrUnAcitveMultiEleBgItem = function (active, obj) {
    var requestObj = { items: [] };
    if (active) {
      //启用
      for (var i = 0; i < obj.length; i++) {
        var subObj = obj[i];
        var subObjTo = {};
        subObjTo.chrId = subObj.chrId;
        subObjTo.eleCode = subObj.eleCode;
        subObjTo.eleName = subObj.eleName;
        subObjTo.codeRule = subObj.codeRule;
        subObjTo.controlLevelName = subObj.controlLevelName;
        subObjTo.setYear = page.setYear; //guohx 取门户传过来的业务年度
        subObjTo.rgCode = subObj.rgCode;
        subObjTo.agencyCode = page.agencyCode;
        subObjTo.isDeleted = "0";
        subObjTo.bgItemCode = subObj.bgItemCode;
        subObjTo.type = page.type;
        requestObj.items[i] = subObjTo;
      }
      ufma.post(requestUrlArray[2],
      requestObj,
      function (result) {
        if (result.flag == "success") {
          ufma.showTip('添加成功！', function () { }, 'success'); //guohx 
          // refreshMainTblData();
         page.initDataTable();
        }
      });
    } else {
      //停用
      for (var ii = 0; ii < obj.length; ii++) {
        var subObj1 = obj[ii];
        var subObjTo1 = {};
        subObjTo.agencyCode = page.agencyCode;
        subObjTo1.chrId = subObj1.chrId;
        subObjTo1.eleCode = subObj1.eleCode;
        subObjTo1.eleName = subObj1.eleName;
        subObjTo1.isDeleted = "1";
        subObjTo1.type = page.type;
        requestObj.items[ii] = subObjTo1;
      }
      ufma.post(requestUrlArray[3],
      requestObj,
      function (result) {
        if (result.flag == "success") {
          ufma.showTip('停用成功！', function () { }, 'success'); //guohx 增加删除成功提示
          // refreshMainTblData();
         page.initDataTable();
        }
      });
    }
  };

  /**
   * 启用或者停用一条指标要素
   * @param  {[type]} active true=启用   false=停用
   * @param  {[type]} obj    [description]
   */
  var activeOrUnActioveOneBgItem = function (active, obj) {
    var requestObj = { items: [] };
    if (active) {
      //启用
      var subObj = obj;
      var subObjTo = {};
      subObjTo.chrId = subObj.chrId;
      subObjTo.eleCode = subObj.eleCode;
      subObjTo.eleName = subObj.eleName;
      subObjTo.codeRule = subObj.codeRule;
      subObjTo.controlLevelName = subObj.controlLevelName;
      subObjTo.setYear = page.setYear;
      subObjTo.rgCode = subObj.rgCode;
      subObjTo.agencyCode = subObj.agencyCode;
      subObjTo.isDeleted = "0";
      subObjTo.bgItemCode = subObj.bgItemCode;
      subObjTo.type = page.type;
      requestObj.items[i] = subObjTo;
      ufma.post(requestUrlArray[2],
      requestObj,
      function (result) {
        if (result.flag == "success") {
          ufma.showTip('添加成功！', function () { }, 'success'); //guohx 
          // refreshMainTblData();
         page.initDataTable();
        }
      });
    } else {
      //停用
      var subObj1 = obj;
      var subObjTo1 = {};
      subObjTo1.chrId = subObj1.chrId;
      subObjTo1.agencyCode =  page.agencyCode;
      subObjTo1.type = page.type;
      subObjTo1.eleCode = subObj1.eleCode;
      subObjTo1.eleName = subObj1.eleName;
      subObjTo1.isDeleted = "1";
      requestObj.items[0] = subObjTo1;
      ufma.post(requestUrlArray[3],
      requestObj,
      function (result) {
        if (result.flag == "success") {
          ufma.showTip('停用成功！', function () { }, 'success'); //guohx 增加删除成功提示
          // refreshMainTblData();
         page.initDataTable();
        }
      });
    }
  }

  var refreshMainTblData = function () {
    var table = $("#" + table_Main).DataTable();
    table.ajax.reload().draw();
  };

  var initForm = function () {
    var i = parseFloat($("#workspaceBody").outerHeight());
    var i_top = parseFloat($("#workspaceBody_Top").outerHeight());
    var i_bottom = parseFloat($("#workspaceBody_Bottom").outerHeight());

    // $("#workspaceBody_Center").css("max-height", (i - i_top - i_bottom) + "px");
  }
  // 添加按钮事件，获得服务器的指标要素数据
  $("#btn-add").click(function () {
    getTableData()
    $("#bgItemAddLabel").html("选择启用要素");
    $("#bgItem-edt").modal('show','800px');
  });

  //主界面-全选, 全不选
  $(document).on("change", "#bgitems-main-selectAll", function (e) {
    var mainTblTr = $("#" + table_Main + " tbody tr");
    if ($("#bgitems-main-selectAll").is(":checked") == true) {
      mainTblTr.addClass('selected');
      mainTblTr.find('input[type="checkbox"]').prop("checked", true);
    } else {
      mainTblTr.removeClass('selected');
      mainTblTr.find('input[type="checkbox"]').prop("checked", false);
    }
  });

  //主界面-批量停用
  $(document).on("click", "#bgitems-main-unactive", function (e) {
    var flag=false;
    for(i=0;i<$('#bgItems-data tbody tr').length;i++){
      if($('#bgItems-data tbody tr').eq(i).hasClass('selected')){
        flag=true
      }
    }
    if(flag){
      ufma.confirm('要停用选择的指标要素吗?', function (action) {
        if (!action) {
          return;
        } else {
          var mainTblTr = $("#" + table_Main + " tbody tr");
          var table = $("#" + table_Main).DataTable();  //注意，必须使用 DataTable， 而不能是 dataTable
          var iCount = 0;
          var doObj = [];
          $(mainTblTr).each(function () {   //遍历每一行
            if ($(this).find('input[type="checkbox"]').is(":checked") == true) {
              var obj = table.row(this).data();
              if (obj.isDeleted == '0') {
                doObj[iCount] = obj;
                iCount++;
              }
            }
          });
          activeOrUnAcitveMultiEleBgItem(false, doObj);
        }
      }, {
        'type': 'warning'
      });
    }else{
      ufma.showTip('请选择要停用的指标要素！',function(){},'warning')
    }
  });

  //模态框的保存
  $(document).on("click", "#bgitems-edt-save", function (e) {
    var flag=false;
    for(i=0;i<$('#bgItems-data-edt tbody tr').length;i++){
      if($('#bgItems-data-edt tbody tr').eq(i).hasClass('selected')){
        flag=true
      }
    }
    if(flag){
      ufma.confirm('要使用选择的指标要素吗?', function (action) {
        if (!action) {
          return;
        } else {
          var superposedTblTr = $("#" + table_SuperposedLayer + " tbody tr");
          var table = $("#" + table_SuperposedLayer).DataTable();  //注意，必须使用 DataTable， 而不能是 dataTable
          var iCount = 0;
          var doObj = []
          $(superposedTblTr).each(function () {   //遍历每一行
            if ($(this).find('input[type="checkbox"]').is(":checked") == true) {
              var obj = table.row(this).data();
              doObj[iCount] = obj;
              iCount++;
            }
          });
          activeOrUnAcitveMultiEleBgItem(true, doObj);
          $("#bgitems-edt-cancel").click();
        }
        }, {
        'type': 'warning'
        });
    }else{
      ufma.showTip('请选择要启用的指标要素！',function(){},'warning')
    }
  });
  var getTextData = function () {
    ufma.get('/bg/sys/bgItem/getTxtMaItems',{},function(result){
      $("#descFrom").setForm(result.data);
      //CWYXM-19304 ---启用的文本项如果没有输入名称，则按默认的填充，不需要填充没有启用的文本项；没有启用的文本项应该限制不能编辑；--zsj
      setEnabled(result.data);
    })
  }
  //CWYXM-19304 ---启用的文本项如果没有输入名称，则按默认的填充，不需要填充没有启用的文本项；没有启用的文本项应该限制不能编辑；--zsj
  var setEnabled = function (data) {
    data.enabledBgTextDes1 == '0' ?  $('input[name="bgTextName1"]').attr('disabled',true) : $('input[name="bgTextName1"]').removeAttr('disabled');
    data.enabledBgTextDes2 == '0' ?  $('input[name="bgTextName2"]').attr('disabled',true) : $('input[name="bgTextName2"]').removeAttr('disabled');
    data.enabledBgTextDes3 == '0' ?  $('input[name="bgTextName3"]').attr('disabled',true) : $('input[name="bgTextName3"]').removeAttr('disabled');
    data.enabledBgTextDes4 == '0' ?  $('input[name="bgTextName4"]').attr('disabled',true) : $('input[name="bgTextName4"]').removeAttr('disabled');
    data.enabledBgTextDes5 == '0' ?  $('input[name="bgTextName5"]').attr('disabled',true) : $('input[name="bgTextName5"]').removeAttr('disabled');
    //CWYXM-19453 文本说明项,只要被指标用了就应该不能修改,如果能修改请做好指标账簿界面的文本说明列同步--zsj
    if (!$.isEmptyObject(data)) {
      if (data.isUsed1 == '0') {
        $('input[name="bgTextName1"]').removeAttr('disabled');
        $('input[name="bgTextName1"]').parent('.control-element').find('.isUsedClass').addClass('hide');
      } else {
        $('input[name="bgTextName1"]').attr('disabled',true);
        $('input[name="bgTextName1"]').parent('.control-element').find('.isUsedClass').removeClass('hide');
      }
      if (data.isUsed2 == '0') {
        $('input[name="bgTextName2"]').removeAttr('disabled');
        $('input[name="bgTextName2"]').parent('.control-element').find('.isUsedClass').addClass('hide');
      } else {
        $('input[name="bgTextName2"]').attr('disabled',true);
        $('input[name="bgTextName2"]').parent('.control-element').find('.isUsedClass').removeClass('hide');
      }
      if (data.isUsed3 == '0') {
        $('input[name="bgTextName3"]').removeAttr('disabled');
        $('input[name="bgTextName3"]').parent('.control-element').find('.isUsedClass').addClass('hide');
      } else {
        $('input[name="bgTextName3"]').attr('disabled',true);
        $('input[name="bgTextName3"]').parent('.control-element').find('.isUsedClass').removeClass('hide');
      }
      if (data.isUsed4 == '0') {
        $('input[name="bgTextName4"]').removeAttr('disabled');
        $('input[name="bgTextName4"]').parent('.control-element').find('.isUsedClass').addClass('hide');
      } else {
        $('input[name="bgTextName4"]').attr('disabled',true);
        $('input[name="bgTextName4"]').parent('.control-element').find('.isUsedClass').removeClass('hide');
      }
      if (data.isUsed5 == '0') {
        $('input[name="bgTextName5"]').removeAttr('disabled');
        $('input[name="bgTextName5"]').parent('.control-element').find('.isUsedClass').addClass('hide');
      } else {
        $('input[name="bgTextName5"]').attr('disabled',true);
        $('input[name="bgTextName5"]').parent('.control-element').find('.isUsedClass').removeClass('hide');
      }
    } else {
      $('.isUsedClass').addClass('hide');
    }
  }
  // 模态框切换
  $('#tabAcce li a').click(function (e) {
    e.preventDefault();
    if ($(this).attr('id') == 'eleTab') {
      $('.tableArea').removeClass('hide');
      $('.descArea').addClass('hide');
      $('#btn-add').removeClass('hide');
      getTableData()
    } else if ($(this).attr('id') == 'descTab') {
      $('.descArea').removeClass('hide');
      $('.tableArea').addClass('hide');
      $('#btn-add').addClass('hide');
      getTextData()
    }
  });
  //CWYXM-19304 ---启用的文本项如果没有输入名称，则按默认的填充，不需要填充没有启用的文本项；没有启用的文本项应该限制不能编辑；--zsj
  $('.enabledN').click(function(e){
    e.preventDefault();
    var $this = $(this);
    // CWYXM-19300 --已经使用的文本项应该不能停用，需要做校验，在预算方案里启用就算使用；--zsj 
    var argu  = {
      setYear: page.setYear,
      rgCode: page.rgCode,
      txtCode: $this.attr('textCode')
    }
    ufma.post(requestUrlArray[6],
      argu,
      function (result) {
        if (result.data == true) {
          ufma.showTip(result.msg, function () { }, 'warning');
          $this.removeClass('active');
          $this.siblings().addClass('active')
          return false;
        } else if (result.data == false) {
          $this.closest('.col-xs-6').siblings().find('.nameValidte').attr('disabled',true);
        }
    });
  })
  //CWYXM-19304 ---启用的文本项如果没有输入名称，则按默认的填充，不需要填充没有启用的文本项；没有启用的文本项应该限制不能编辑；--zsj
  $('.enabledY').click(function(e){
    e.preventDefault();
    var textVal = $(this).closest('.form-group').find('.control-label').text().split('：')[0];
    var oldVal = $(this).closest('.col-xs-6').siblings().find('.nameValidte').val()
    $(this).closest('.col-xs-6').siblings().find('.nameValidte').removeAttr('disabled');
    $.isNull(oldVal) ? $(this).closest('.col-xs-6').siblings().find('.nameValidte').val(textVal) : $(this).closest('.col-xs-6').siblings().find('.nameValidte').val(oldVal)
  })
  // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--赵雪蕊--zsj
  // 保存说明项
  $('#textSave').click(function () {
    var bgTextDes = []
    var bgTextDes1 = {
        code: 'BG_TEXT_DES1',
        enabledBgTextDes1: $('.bgTextDes1 label.active').find('input').attr('value'),
        bgTextName1: !$.isNull($('input[name="bgTextName1"]').val()) ? $('input[name="bgTextName1"]').val() : ($('.bgTextDes1').find('.enabledY').hasClass('active') ? $('input[name="bgTextName1"]').parents('.col-xs-6').siblings().find('.control-label').text().split('：')[0] : '') 
      }
    var bgTextDes2 = {
        code: 'BG_TEXT_DES2',
        enabledBgTextDes2: $('.bgTextDes2 label.active').find('input').attr('value'),
        bgTextName2: !$.isNull($('input[name="bgTextName2"]').val()) ? $('input[name="bgTextName2"]').val() : ($('.bgTextDes2').find('.enabledY').hasClass('active') ? $('input[name="bgTextName2"]').parents('.col-xs-6').siblings().find('.control-label').text().split('：')[0] : '') 
      }
    var bgTextDes3 = {
        code: 'BG_TEXT_DES3',
        enabledBgTextDes3: $('.bgTextDes3 label.active').find('input').attr('value'),
        bgTextName3: !$.isNull($('input[name="bgTextName3"]').val()) ? $('input[name="bgTextName3"]').val() : ($('.bgTextDes3').find('.enabledY').hasClass('active') ? $('input[name="bgTextName3"]').parents('.col-xs-6').siblings().find('.control-label').text().split('：')[0] : '') 
      }
    var bgTextDes4 = {
        code: 'BG_TEXT_DES4',
        enabledBgTextDes4: $('.bgTextDes4 label.active').find('input').attr('value'),
        bgTextName4: !$.isNull($('input[name="bgTextName4"]').val()) ? $('input[name="bgTextName4"]').val() : ($('.bgTextDes4').find('.enabledY').hasClass('active') ? $('input[name="bgTextName4"]').parents('.col-xs-6').siblings().find('.control-label').text().split('：')[0] : '') 
      }
    var bgTextDes5 = {
        code: 'BG_TEXT_DES5',
        enabledBgTextDes5: $('.bgTextDes5 label.active').find('input').attr('value'),
        bgTextName5: !$.isNull($('input[name="bgTextName5"]').val()) ? $('input[name="bgTextName5"]').val() : ($('.bgTextDes5').find('.enabledY').hasClass('active') ? $('input[name="bgTextName5"]').parents('.col-xs-6').siblings().find('.control-label').text().split('：')[0] : '') 
      }
    bgTextDes.push(bgTextDes1, bgTextDes2, bgTextDes3, bgTextDes4, bgTextDes5)
    var param = {
      agencyCode: page.agencyCode,
      setYear: page.setYear,
      rgCode: page.rgCode,
      itemTxtEles: bgTextDes
    }
    ufma.post('/bg/sys/bgItem/saveBgItemTxtEle',param,function(result){
      // 保存成功后直接查询回调
      ufma.showTip(result.msg,function(){
        getTextData()
      },'success');
    })
  });
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--指标要素设置--说明项区域input不走ufma.js的校验 此校验：$(this).attr('bgItem') != 'bgItemInput' --zsj
  $(document).on('change', '.nameValidte', function(e) {
    var containSpecial = RegExp(/[(\~)(\!)(\#)(\$)(\%)(\^)(\&)(\*)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\?)(\)(\￥)(\……)(\！)(\`)(\·)(\【)(\】)(\‘)(\、)(\；)(\，)(\。)(\；)(\‘)(\,)(\@)(\「)(\」)(\：)(\”)(\“)(\《)(\》)(\？)]+/);
    var inputValue = $(this).val();
    if(containSpecial.test(inputValue)) {
      inputValue = inputValue.replaceAll(containSpecial,'')
      $(this).val(inputValue);
    }
	});
  var page = function () {
    return {
      // 1， 初始化表格 initDataTable
      initDataTable: function () {
        initMainTbl();
      },
      //初始化单位
      initAgency: function() {
        bg.setAgencyCombox($("#cbAgency"), {
          "userCode": page.pfData.svUserCode,
          "userId": page.pfData.svUserId,
          "setYear": page.setYear
        }, function(sender, treeNode) {
          page.agencyCode = treeNode.id;
          //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
            //缓存单位
            var params = {
              selAgecncyCode: treeNode.id,
              selAgecncyName: treeNode.name
            }
            ufma.setSelectedVar(params);
            page.initDataTable();
        });
      },
      init: function () {
        reslist = ufma.getPermission();
        ufma.isShow(reslist);
        page.pfData = ufma.getCommonData();
        page.setYear = parseInt(page.pfData.svSetYear);
        page.rgCode = page.pfData.svRgCode;
        if($('body').data("code")) {
          page.initAgency();
          page.queryType = 'self';
          page.type = 'self';
        }else{
          page.agencyCode = '*';
          page.queryType = '';
          page.type = '';
          page.initDataTable();
        }
        ufma.parse();
        // 初始化table
        //this.initDataTable();
        //初始化样式
        initForm();
        var agencyTemp = _bgPub_getUrlParam("agencyCode");
      }
    }
  }();
  page.init();
});

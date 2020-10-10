/*zhaoxjb 2018/6/5
 * 打开单据方案界面，请求数据类型->请求来源子系统->请求单据方案列表
 * 切换单位、数据源类型、来源子系统时重新请求单据方案列表
 * */
$(function() {
	//接口URL集合
	var interfaceURL = {
		// getBillTypeList: "/lp/billType/getBillTypeList", //根据单位代码获取所有单据类型和单据转换模版（全局传"*"，单位全传空,具体单位传单位的code）
		getAgencyTree: "/lp/eleAgency/getAgencyTree", //用于显示单位树
		deleteOriBilllMsg: "/lp/scheme/deleteSchemeByGuid", //根据billTypeGuid删除原始单据类型详细信息
		getEnumerate: "/lp/enumerate/List/", //获取数据源类型"
		getEnumerateSytem: "/lp/enumerate/List/", //获取来源子系统
		getSchemeByCondition: "/lp/scheme/getSchemeByCondition", //根据单位和类型获取数据
		getTableHeadName: "/lp/scheme/getTableHeadName", //导入数据时获取表头信息
		getSchemeByConditiondw: "/lp/scheme/getSchemeByConditiondw", //根据单位和类型获取数据
		getSchemeTypes: "/lp/scheme/getSchemeType/", //根据单位id获取单据方案列表
		updateBatchTemplateOrdseq: "/lp/template/updateBatchTemplateOrdseq", //保存模板排序
    exportScheme: "/lp/scheme/exportAllSchemeXml" ,//导出单据方案和凭证模板
    copyScheme : "/lp/scheme/copySchemeTemplate" //复制单据方案
	};
	var src = {};
	var className = $(".billDefinitionAgency").length > 0;
	var getSchemesResult = [];
	var svData = ufma.getCommonData();
	var nowAgencyCode = svData.svAgencyCode;
  var nowAgencyName = svData.svAgencyName;
  var eleAccItemList = [];

	var page = function() {

		return {
      //根据对象数组中某字段，分组
      objGrouping: function (arr, key1) {
        var map = {},
          dest = [];
        for (var i = 0; i < arr.length; i++) {
          var ai = arr[i];
          if (!map[ai[key1]]) {
            var obj = {};
            obj[key1] = ai[key1];
            obj["data"] = [ai];
            dest.push(obj);
            map[ai[key1]] = ai;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj[key1] == ai[key1]) {
                dj.data.push(ai);
                break;
              }
            }
          }
        }
        return dest;
      },

      //返回字符串第一个字符
      getFirstStr: function (str) {
        var strFirst = str.substr(0, 1);
        return strFirst;
      },

      //加载单位
      getAgency: function (result) {
        var data = result.data;
        //单位
        if (className) {
          page.agency = $("#bdAgency2").ufmaTreecombox2({
            valueField: "id",
            textField: "codeName",
            readOnly: false,
            icon: "icon-unit",
            leafRequire: true,
            popupWidth: 1.5,
            data: data,
            onchange: function (data) {
              //请求数据源和来源子系统
              page.getSchemeTypes(page.agency.getValue());
              //缓存单位账套
              var params = {
                selAgecncyCode: data.id,
                selAgecncyName: data.name,
              };
              ufma.setSelectedVar(params);
            },
          });

          //默认选择单位S

          if (data.length != 0) {
            if (nowAgencyCode != "" && nowAgencyName != "") {
              var agency = $.inArrayJson(data, "id", nowAgencyCode);
              if (agency != undefined) {
                page.agency.val(nowAgencyCode);
              } else {
                // 5270 会计平台-凭证生成 第一次进入单位显示的是非账套级
                var isLeafNum = 0;
                if (data.length > 1) {
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].isLeaf > 0) {
                      isLeafNum = i;
                      break;
                    }
                  }
                }
                page.agency.select(isLeafNum + 1);
              }
            } else {
              page.agency.select(1);
            }
          } else {
            ufma.hideloading();
          }
        } else {
          page.agencyDatas = data;
          page.agency = $("#bdAgency").ufmaTreecombox({
            valueField: "id",
            textField: "codeName",
            readOnly: false,
            leafRequire: true,
            popupWidth: 1.5,
            data: data,
            onchange: function (data) {
              page.getSchemeTypes(page.agency.getValue());
            },
          });
          page.getSchemeTypes("*");
        }
      },

      //给单据类型图标循环设置背景颜色（#64DDA0 #FFD249 #63BEFF #FFA0A0 #D19DEF）
      setColor: function (n) {
        n = n % 5;
        switch (n) {
          case 0:
            return "#64DDA0";
            break;
          case 1:
            return "#FFD249";
            break;
          case 2:
            return "#63BEFF";
            break;
          case 3:
            return "#FFA0A0";
            break;
          case 4:
            return "#D19DEF";
            break;
          default:
            break;
        }
      },
      //初始化来源子系统下拉
      initSysList: function () {
        $("#son-system-btns").ufCombox({
          idField: "ENU_CODE",
          textField: "ENU_NAME",
          // data: data, //json 数据
          placeholder: "请选择来源子系统",
          onChange: function (sender, data) {},
          onComplete: function (sender) {
            $("input").attr("autocomplete", "off");
          },
        });
        //请求来源子系统
        page.getSonSystem();
      },
      //初始化数据源类型
      initSourceBtn: function () {
        $("#source-btn").ufCombox({
          idField: "ENU_CODE",
          textField: "ENU_NAME",
          // data: data, //json 数据
          placeholder: "请选择数据源类型",
          onChange: function (sender, data) {},
          onComplete: function (sender) {
            $("input").attr("autocomplete", "off");
          },
        });
        //来源子系统
        page.getDataSourceType();
      },
      //初始化方案名称
      initSchemeNames: function () {
        $("#schemne-name").ufCombox({
          idField: "schemeGuid",
          textField: "schemeName",
          // data: data, //json 数据
          placeholder: "请选择来方案名称",
          // readonly:'false',
          onChange: function (sender, data) {},
          onComplete: function (sender) {
            $("input").attr("autocomplete", "off");
          },
        });
      },
      getSchemeTypes: function (agencyCode) {
        $(".schemeName-box-outter2").addClass("hidden");
        $(".schemeName-box-outter1").removeClass("hidden");
        $("#schemeNameVisible").val("1");
        $("#schemeName").val("全部");
        // $(".schemeName-list").slideUp();
        var newAgencyCode = agencyCode ? agencyCode : page.agency.getValue();
        if (!className) {
          newAgencyCode = "*";
        }
        var argu = {
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.get(interfaceURL.getSchemeTypes + newAgencyCode, argu, function (result) {
          var data = result.data;
          data.unshift({
            schemeGuid: "全部",
            schemeName: "全部",
          });
          if (data.length > 1) {
            $("#schemne-name").getObj().load(data);
            $("#schemne-name").getObj().val("全部");
          } else {
            //当方案列表的内容为空时，方案名称按输入的内容查询
            //这是不用公共下拉控件
            $(".schemeName-box-outter1").addClass("hidden");
            $(".schemeName-box-outter2").removeClass("hidden");
            $("#schemeNameVisible").val("2");
          }

          page.getSchemeByCondition();
        });
      },
      //请求单据方案模版列表
      getSchemeByCondition: function () {
        $(".model-list").html(""); //清除原始内容
        var agencyCode = "*";
        if ($(".billDefinitionAgency").length > 0) {
          agencyCode = page.agency.getValue();
        }
        var dataSrcType = $("#source-btn").getObj().getValue();
        dataSrcType = dataSrcType === "全部" ? "" : dataSrcType;
        var sysId = $("#son-system-btns").getObj().getValue();
        sysId = sysId === "全部" ? "" : sysId;
        var schemeGuid = $("#schemne-name").getObj().getValue();
        schemeGuid = schemeGuid === "全部" ? "" : schemeGuid;
        // var schemeName = $("input[name='schemeName']").val();
        var tabArgu = {
          agencyCode: agencyCode,
          dataSrcType: dataSrcType,
          sysId: sysId,
          schemeGuid: schemeGuid,
          vouTmpName: $("#vouTmpName").val(),
          schemeDescribe: $("#schemeDescribe").val(),
          schemeName: "",
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        if ($("#schemeNameVisible").val() == "2") {
          tabArgu.schemeGuid = "";
          tabArgu.schemeName = $("#schemeName").val() == "全部" ? "" : $("#schemeName").val();
        }
        ufma.showloading("正在加载数据，请耐心等待...");
        if (className) {
          //请求单据方案列表和模版,单位级
          ufma.post(interfaceURL.getSchemeByConditiondw, tabArgu, page.renderSchemeByCondition);
        } else {
          //请求单据方案列表和模版，系统级
          ufma.post(interfaceURL.getSchemeByCondition, tabArgu, page.renderSchemeByCondition);
        }
      },

      //渲染单据方案列表和模版
      renderSchemeByCondition: function (result) {
        ufma.hideloading();
        $(".model-box").html("");
        if (result.data.length > 0) {
          //根据数据的billTypeGuid分组
          var data = page.objGrouping(result.data, "SCHEME_GUID");

          for (var i = 0; i < data.length; i++) {
            var $mLi = $('<li class="model-item clearfix"></li>');
            var iconChar = data[i].data[0].SCHEME_NAME ? page.getFirstStr(data[i].data[0].SCHEME_NAME) : "";
            var schemeName = data[i].data[0].SCHEME_NAME ? data[i].data[0].SCHEME_NAME : "";
            //根据每组第一条数据加载单据类型
            var agencyIcon = "系统级";
            if (data[i].data[0].AGENCY_CODE != "*") {
              agencyIcon = "单位级";
            }
            var $mLeft = $('<div class="model-left pull-left"><div class="model-body pull-left">' + '<span class="agency-icon" data-agency="' + data[i].data[0].AGENCY_CODE + '" style="width:auto;background-color: #108ee9">' + agencyIcon + "</span>" + '<div class="hover-blue"></div><div class="model-top-part"></div></div>' + '<div class="line pull-left"><div class="horizontal"></div></div></div>');
            var $mlS = $('<div class="model-sign pull-left" style="background-color:' + page.setColor(i) + ';">' + page.getFirstStr(iconChar) + "</div>");
            $mLeft.find(".model-top-part").append($mlS);
            var schemeDescribe = data[i].data[0].SCHEME_DESCRIBE ? data[i].data[0].SCHEME_DESCRIBE : "";
            var $mlT = $(
              '<div class="model-text clearfix">' +
                '<div class="title" data-schemeid="' +
                data[i].data[0].SCHEME_GUID +
                '" data-typecode="' +
                data[i].data[0].SCHEME_GUID +
                '" title="' +
                schemeName +
                '">' +
                schemeName +
                "</div>" +
                '<div class="info">' +
                '<span class="base-infor light-color describe" data-describe="' +
                schemeDescribe +
                '" title="' +
                schemeDescribe +
                '">' +
                schemeDescribe +
                "</span>" +
                '<span class="base-infor light-color agency" data-agency="' +
                data[i].data[0].AGENCY_CODE +
                '">' +
                data[i].data[0].AGENCYNAME +
                "</span>" +
                '<span class="base-infor light-color data" data-src="' +
                data[i].data[0].DATA_SRC_TYPE +
                '">' +
                data[i].data[0].DSNAME +
                "</span>" +
                '<span class="base-infor light-color sys" data-sys="' +
                data[i].data[0].SYS_ID +
                '" style="display: none">' +
                data[i].data[0].SYSNAME +
                "</span>" +
                '<span class="base-infor light-color isUsed" data-billtype="' +
                data[i].data[0].IS_USED +
                '" style="display: none">是否挂接</span>' +
                '<span class="base-infor light-color isTurned" data-billtype="' +
                data[i].data[0].IS_TURNED +
                '" style="display: none">是否转换</span>' +
                '<span class="base-infor light-color isAllow" data-billtype="' +
                data[i].data[0].IS_ALLOW +
                '" style="display: none">转换失败允许导入</span>' +
                '<span class="base-infor light-color billType" data-billtype="' +
                data[i].data[0].BILL_TYPE_CODE +
                '" style="display: none">' +
                data[i].data[0].BILL_TYPE_NAME +
                "</span></div></div>"
            );
            $mLeft.find(".model-top-part").append($mlT);

            var $mlI = $(
              '<div class="model-icon">' +
                '<a class="btn btn-icon-only btn-sm btn-setup btn-permission b-set" data-toggle="tooltip" action= ""' +
                ' bill-num = "' +
                data[i].data[0].BILLNUM +
                '" tem-num = "' +
                data[i].data[0].TEMNUM +
                '">' +
                '<span class="glyphicon icon-setting"></span>设置</a>' +
                '<a class="btn btn-icon-only btn-sm btn-copySche  " data-toggle="tooltip" action= "">' +
                '<span class="glyphicon icon-file-x"></span>复制</a>' +
                '<a class="btn btn-icon-only btn-sm btn-add-temp btn-permission b-add" data-toggle="tooltip" action= "">' +
                '<span class="glyphicon icon-add"></span>凭证模版</a>' +
                '<a class="btn btn-icon-only btn-sm btn-delete btn-permission b-del" data-toggle="tooltip" action= ""' +
                ' bill-num = "' +
                data[i].data[0].BILLNUM +
                '" tem-num = "' +
                data[i].data[0].TEMNUM +
                '">' +
                '<span class="glyphicon icon-trash"></span>删除</a></div>'
            );
            $mLeft.find(".model-body").append($mlI);

            $mLi.append($mLeft);
            // '<a class="btn btn-icon-only btn-sm btn-permission b-import" data-toggle="tooltip" action="">' +
            // '<span class="glyphicon icon-file"></span>导入数据</a>'+

            //根据数据中的VOU_TMP_GUID字段是否为null,判断是否有模版
            if (data[i].data[0].VOU_TMP_GUID != null && data[i].data[0].VOU_TMP_GUID != "") {
              //单据类型线显示
              $mLeft.find(".line").show();

              var $mRight = $('<div class="model-right-box clearfix"><div class="lines-part pull-left"></div><ul class="model-right list-unstyled clearfix"></ul></div>');

              //遍历每组的数据加载目标单据

              for (var j = 0; j < data[i].data.length; j++) {
                var vouTmpName = data[i].data[j].VOU_TMP_NAME ? data[i].data[j].VOU_TMP_NAME : "";
                var agencyIconT = "系统级";
                if (data[i].data[j].TEMAGENCYCODE != "*") {
                  agencyIconT = "单位级";
                }
                var $ti = $(
                  '<li class="target-item clearfix">' +
                    '<div class="line"><div class="horizontal"></div><div class="vertical"><div class="arrow"></div></div></div>' +
                    '<div class="target-body" agency-code = "' +
                    data[i].data[j].AGENCY_CODE +
                    '">' +
                    '<span class="agency-icon" data-agency="' +
                    data[i].data[j].AGENCY_CODE +
                    '" style="width:auto;background-color: #108ee9">' +
                    agencyIconT +
                    "</span>" +
                    '<div class="hover-blue"></div></div></li>'
                );
                var $tiT = $('<div class="target-text">' + '<div class="title" data-tmpid="' + data[i].data[j].VOU_TMP_GUID + '" title="' + vouTmpName + '">' + vouTmpName + "</div>" + '<div class="info"><span class="agency" data-agency="' + data[i].data[j].TEMAGENCYCODE + '" title="' + data[i].data[j].TEMAGENCYNAME + '">' + data[i].data[j].TEMAGENCYNAME + "</span></div></div>");
                $ti.find(".target-body").append($tiT);
                var coverHtml = "";
                if (data[i].data[j].TEMAGENCYCODE == "*" && $(".billDefinitionAgency").length > 0) {
                  coverHtml = '<a class="btn btn-icon-only btn-sm btn-copy btn-permission t-copy" data-toggle="tooltip" action= "">' + '<span class="glyphicon icon-file-x"></span>复制</a>';
                }
                var $tiI = $('<div class="target-icon">' + '<a class="btn btn-icon-only btn-sm btn-setup btn-permission t-set" data-toggle="tooltip" action= "">' + '<span class="glyphicon icon-setting"></span>设置</a>' + coverHtml + '<a class="btn btn-icon-only btn-sm btn-delete btn-permission t-del" data-toggle="tooltip" action= "">' + '<span class="glyphicon icon-trash"></span>删除</a></div>');
                $ti.find(".target-body").append($tiI);

                //判断目标单据的序列加载不同的线样式
                if (data[i].data.length > 1) {
                  if (j == 0) {
                    $ti.find(".line").addClass("first");
                  } else if (j == data[i].data.length - 1) {
                    $ti.find(".line").addClass("last");
                  } else {
                    $ti.find(".line").addClass("middle");
                  }
                }
                $mRight.find(".model-right").append($ti);
              }
              $mLi.append($mRight);
            }

            $(".model-box").append($mLi);

            //计算竖线line的高度
            var h = $(".model-left").eq(i).next(".model-right-box").find(".lines-part").height();
            $(".model-left")
              .eq(i)
              .next(".model-right-box")
              .find(".lines-part")
              .height(h - 170);
          }

          //窗口改变时计算竖线line的高度
          $(window).resize(function () {
            $(".lines-part").each(function () {
              var h = $(this).next(".model-right").height();
              $(this).height(h - 170);
            });
          });
          //按钮提示
          $("[data-toggle='tooltip']").tooltip();
          dragFun();
        } else {
          $(".model-box").append('<div style="text-align: center;padding-top:80px"><img src="' + bootPath + 'images/noData.png"/><br/><br/><i>目前还没有你要查询的数据</i></div>');
        }
        //判断单据方案（系统级），方案是否是系统级的，若是则不能做新增模版，删除单据操作
        // if (className) {
        //     //单据方案（系统级）
        //
        //     $(".model-item").each(function () {
        //         if ($(this).find(".info .agency").attr("data-agency") == "*") {
        //             //系统级方案
        //             $(this).find(".b-add").attr("disabled", true);
        //             $(this).find(".b-del").attr("disabled", true);
        //             $(this).find(".t-del").attr("disabled", true);
        //         }
        //
        //     });
        // }
        //权限控制
        ufma.isShow(page.reslist);
      },
      //渲染数据源类型dom
      DataSourceTypeHtml: function (result) {
        var data = result.data,
          dsHtml = '<button class="btn btn-default" value="" data-id="">全部</button>';
        dataSourceType = data;
        for (var i in data) {
          dsHtml += '<button class="btn btn-default" value="" data-id="' + i + '">' + data[i] + "</button>";
        }
        $("#source-btn").html(dsHtml);
        $("#source-btn").find("button").eq(0).attr({
          class: "btn btn-primary",
        });
        // page.showContent();
        // ufma.get(interfaceURL.getAgencyTree, "", page.getAgency);
        //请求来源子系统
        page.getSonSystem();
      },
      //关闭弹窗后的回调
      destoryCallBack: function (data) {
        if (data.action !== "import") {
          //设置界面点保存
          // page.reshowContent();
          page.getSchemeTypes();
          // page.getSchemeByCondition()
        } else {
          //在设置界面点导入数据，弹出导入数据模态框
          setTimeout(function () {
            page.getTableHeadName(data.guid, data.dataType, data.aCode);
          }, 200);
        }
      },
      //请求数据源类型
      getDataSourceType: function () {
        var url = "LP_DS_TYPE";
        // ufma.get(interfaceURL.getEnumerate + url, "", page.DataSourceTypeHtml);
        var argu = {
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.get(interfaceURL.getEnumerate + url, argu, function (result) {
          var data = result.data;
          var newData = page.newDataEnumerate(data);
          newData.unshift({
            ENU_CODE: "全部",
            ENU_NAME: "全部",
          });
          $("#source-btn").getObj().load(newData);
          $("#source-btn").getObj().val("全部");
        });
      },
      newDataEnumerate: function (data) {
        var newData = [];
        for (var i in data) {
          newData.push({
            ENU_CODE: i,
            ENU_NAME: data[i],
          });
        }
        return newData;
      },
      //请求来源子系统
      getSonSystem: function () {
        var url = "VOU_SOURCE";
        var argu = {
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.get(interfaceURL.getEnumerate + url, argu, function (result) {
          var data = result.data;
          var newData = page.newDataEnumerate(data);
          src.sonSystemData = JSON.stringify(newData);
          newData.unshift({
            ENU_CODE: "全部",
            ENU_NAME: "全部",
          });
          $("#son-system-btns").getObj().load(newData);
          $("#son-system-btns").getObj().val("全部");
        });

        // ufma.get(interfaceURL.getEnumerateSytem + url, "", page.renderSonSystem);
      },
      //渲染来源子系统
      renderSonSystem: function (result) {
        var data = result.data;
        //保存来源子系统，在新增/设置单据方案时用 S
        src.sonSystemData = data;
        //保存来源子系统，在新增/设置单据方案时用 E

        //渲染html
        var html = '<button class="btn btn-default" data-id="">全部</button>';
        var btns = "",
          len = data.length;
        var restLIst = '<div id="lp-btns-list" style="display: none">';
        for (var i = 0; i < data.length; i++) {
          if (i < 4) {
            btns += '<button class="btn btn-default" data-id="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + "</button>";
          } else {
            restLIst += '<button class="btn btn-default" value="" data-id="' + data[i].ENU_CODE + '" style="display: block">' + data[i].ENU_NAME + "</button>";
          }
        }
        restLIst += "</div>";
        if (len > 4) {
          btns += '<span class="lp-rest-sign">...</span>';
        }
        btns += restLIst;
        html += btns;
        $("#son-system-btns").html("").append(html);
        $("#son-system-btns").find("button").eq(0).attr("class", "btn btn-primary");

        //请求单据方案列表
        if (!className) {
          page.getSchemeByCondition();
        }
        var argu = {
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.get(interfaceURL.getAgencyTree, argu, page.getAgency);
      },
      //导入数据时请求表头信息
      getTableHeadName: function (guid, type, aCode, schemeName) {
        var tabArgu = {
          schemeGuid: guid,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.post(interfaceURL.getTableHeadName, tabArgu, function (result) {
          var tableHeadName = result.data;
          //返回成功后跳转页面
          var tabArgu = {
            agencyCode: aCode,
            schemeName: schemeName,
            dataSourceType: type,
            schemeGuid: guid,
            tableHeadName: tableHeadName,
          };
          ufma.setObjectCache("dataSourceModelInfor", tabArgu);
          ufma.open({
            url: "schemeDataImport.html",
            title: "Excel数据导入",
            width: 1090,
            data: {
              action: "defineType",
              // data: data
            },
            ondestory: function (data) {},
          });
        });
      },
      setScheme: function (t) {
        var billNum = t.attr("bill-num");
        var temNum = t.attr("tem-num");
        var schemeGuid = t.parents(".model-body").find(".model-text .title").attr("data-schemeid");
        var schemeName = t.parents(".model-body").find(".model-text .title").text();
        var agencyId = t.parents(".model-body").find(".model-text .agency").attr("data-agency");
        var agencyName = t.parents(".model-body").find(".model-text .agency").text();
        var schemeDescribe = t.parents(".model-body").find(".model-text .describe").text();
        var sysId = t.parents(".model-body").find(".model-text .sys").attr("data-sys");
        var dataType = t.parents(".model-body").find(".model-text .data").attr("data-src");
        var billType = t.parents(".model-body").find(".model-text .billType").attr("data-billtype");
        var isUsed = t.parents(".model-body").find(".model-text .isUsed").attr("data-billtype");
        var isTurned = t.parents(".model-body").find(".model-text .isTurned").attr("data-billtype");
        var isAllow = t.parents(".model-body").find(".model-text .isAllow").attr("data-billtype");
        var setData = {
          schemeGuid: schemeGuid,
          schemeName: schemeName,
          agencyId: agencyId,
          agencyName: agencyName,
          schemeDescribe: schemeDescribe,
          sysId: sysId,
          dataType: dataType,
          billNum: billNum,
          temNum: temNum,
          soSystemData: src.sonSystemData,
          billType: billType,
          isUsed: isUsed,
          isTurned: isTurned,
          isAllow: isAllow,
        };
        var openData = {
          action: "editBill",
          agencyName: agencyName,
          data: setData,
        };
        if (className) {
          openData.className = "billDefinitionAgency";
        }
        ufma.open({
          url: "edit.html",
          title: "单据方案",
          //  width: 1090,
          width: 1190,
          data: openData,
          ondestory: function (data) {
            //窗口关闭时回传的值
            if (data.action == "save") {
              //加载单据方案列表
              page.getSchemeByCondition();
            }
          },
        });
      },
      setTem: function (t) {
        var agencyName = t.parents(".target-body").find(".agency").text();
        var UPagencyCode = t.parents(".model-right").parents(".model-item").find(".model-left").find(".model-body").find(".agency").attr("data-agency");
        var billAgencyCode = t.parents(".target-body").attr("agency-code");
        //					$(this).parents(".target-body").parents(".model-right").parents(".model-item").find(".model-left").find(".model-body")
        agencyName = agencyName.substring(agencyName.indexOf("：") + 1);
        var addTemplate = {
          schemeGuid: t.parents(".model-item").find(".title").attr("data-schemeid"),
          agencyCode: t.parents(".target-body").find(".agency").attr("data-agency"),
          agencyName: agencyName,
          UPagencyCode: UPagencyCode,
        };
        var guid = t.parents(".target-icon").prev(".target-text").find(".title").attr("data-tmpid");
        var Type = t.parents(".target-icon").prev(".target-text").find(".title").attr("data-billkind");
        // ufma.post("/lp/template/getTemplate?tarBillType=" + Type + "&tmpGuid=" + guid, "", function (res) {
        ufma.post("/lp/template/getTemplate?tmpGuid=" + guid, "", function (res) {
          var datas = {
            action: "editTemplate",
            thisdata: res.data,
            data: addTemplate,
            eleAccItem: eleAccItemList,
          };
          if (className) {
            //如果是单据方案（单位级）
            datas.billAgencyCode = billAgencyCode;
            datas.className = "billDefinitionAgency";
          }
          ufma.setObjectCache("addTemplate", datas);
          page.temHtml = ufma.open({
            url: "templateGeneration.html",
            title: "凭证模版",
            width: 1090,
            // height: 500,
            data: "",
            ondestory: function (data) {
              //窗口关闭时回传的值
              if (data.action == "save") {
                //加载单据方案列表
                // page.getSchemeByCondition()
                $("#search-btn").trigger("click");
              }
            },
          });

          // showModal("/pf/lp/billScheme/templateGeneration.html")
        });
      },
      getEleAccItem: function () {
        ufma.get("/lp/eleAccItem/" + nowAgencyCode, "", function (res) {
          eleAccItemList = res.data;
        })
      },

      //初始化页面
      initPage: function () {
        //权限控制
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        //初始化方案名称
        page.initSchemeNames();
        //初始化来源子系统
        page.initSysList();
        //初始化数据源类型
        page.initSourceBtn();
        // 获取辅助项列表
        page.getEleAccItem();
        //请求单位树
        var argu = {
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
        };
        ufma.get(interfaceURL.getAgencyTree, argu, page.getAgency);

        //系统级单据方案，进入页面首先查系统级的方案名称
        // if (!className) {
        //     page.getSchemeTypes("*");
        // }
      },

      //页面元素事件绑定使用jquery 的 on()方法
      onEventListener: function () {
        //启用拖拽排序
        $(document).on("click", ".disable_open", function () {
          $.disable_open();
          $("input.disable").trigger("click");
          $(".btn-drag").removeClass("disable_open").addClass("disable_cloose").text("保存拖拽顺序");
        });
        //保存拖拽后顺序
        $(document).on("click", ".disable_cloose", function () {
          $.disable_cloose();
          $("input.disable").trigger("click");
          var argu = cbEndFun();
          console.log(argu);
          ufma.post(interfaceURL.updateBatchTemplateOrdseq, argu, function (result) {
            ufma.showTip(result.msg, function () {}, result.flag);
          });
          $(".btn-drag").removeClass("disable_cloose").addClass("disable_open").text("启用模板排序");
        });
        //查询
        $("#search-btn").on("click", function () {
          $(".schemeName-list").addClass("hidden");
          $(".schemeName-box").removeClass("open");
          page.getSchemeByCondition();
        });
        //选中单位的时候,单位下拉才会出现
        $('input[name="subUnits"]').on("change", function () {
          if ($('input[name="subUnits"]:checked').val() == "*") {
            //所属单位为全局
            $("#bdAgency").css({
              visibility: "hidden",
            });
            //page.agency.setValue("0","全部"); //目前不好使
            $("#bdAgency_input").val("");
            page.getSchemeTypes("*");
          } else {
            //所属单位为所选单位
            $("#bdAgency").css({
              visibility: "visible",
            });
            //默认选择单位S

            var data = page.agencyDatas;
            if (data != "" && data != null && data.length > 0) {
              var code = data[0].id;
              var codeName = data[0].codeName;
              if (data[0].pId === "0") {
                code = data[1].id;
                codeName = data[1].codeName;
              }

              if (svData.svAgencyCode != "" && svData.svAgencyName != "") {
                var agency = $.inArrayJson(data, "id", svData.svAgencyCode);
                if (agency != undefined) {
                  page.agency.setValue(svData.svAgencyCode, svData.svAgencyCode + " " + svData.svAgencyName);
                } else {
                  page.agency.setValue(code, codeName);
                }
              } else {
                page.agency.setValue(code, codeName);
              }
              //默认选择单位E
            }
          }
        });
        //鼠标滑入单据方案效果target-body
        $(document).on("mouseover", ".model-body", function () {
          $(this).find(".hover-blue").addClass("hover-blue-hover");
          $(this).css("box-shadow", "0 2px 16px 0 rgba(169, 169, 169, 0.70)");
        });
        $(document).on("mouseout", ".model-body", function () {
          $(this).find(".hover-blue").removeClass("hover-blue-hover");
          $(this).css("box-shadow", "0 1px 4px 0 rgba(169, 169, 169, 0.20)");
        });
        $(document).on("mouseover", ".target-body", function () {
          $(this).find(".hover-blue").addClass("hover-blue-hover");
          $(this).css("box-shadow", "0 2px 16px 0 rgba(169, 169, 169, 0.70)");
        });
        $(document).on("mouseout", ".target-body", function () {
          $(this).find(".hover-blue").removeClass("hover-blue-hover");
          $(this).css("box-shadow", "0 1px 4px 0 rgba(169, 169, 169, 0.20)");
        });

        //点击转换规则
        $("#billDefinition").on("click", ".b-rule", function () {
          var goURL, goTitle;
          var agy = $(this).parents(".model-body").find(".agency").attr("data-agency");
          if (agy == "*") {
            goURL = "../../../lp/transrule/transRule.html?menuid=";
            goTitle = "转换规则";
          } else {
            var agencyName = $(this).parents(".model-body").find(".agency").text();
            agencyName = agencyName.substring(agencyName.indexOf("：") + 1);
            goURL = "../../../lp/transrule/transRuleAgy.html?menuid=&agencyCode=" + agy + "&agencyName=" + agencyName;
            goTitle = "转换规则（单位级）";
          }

          $(this).attr("data-href", goURL);
          $(this).attr("data-title", goTitle);
          window.parent.openNewMenu($(this));
        });

        //点击删除单据方案
        $("#billDefinition").on("click", ".b-del", function (e) {
          stopPropagation(e);
          var billNum = $(this).attr("bill-num");
          var temNum = $(this).attr("tem-num");
          var agencyId = $(this).parents(".model-body").find(".model-text .agency").attr("data-agency");
          var t = $(this);
          if (className && agencyId == "*") {
            ufma.confirm(
              "单据方案是系统级的，不允许删除",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          }
          if (billNum == "true" && temNum == "true") {
            ufma.confirm(
              "单据方案已经导入数据并且增加了凭证模版，不允许删除",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          } else if (billNum == "true") {
            ufma.confirm(
              "单据方案已经导入数据，不允许删除",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          } else if (temNum == "true") {
            ufma.confirm(
              "单据方案已经增加了凭证模版，不允许删除",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          }
          var schemeGuid = $(this).parents(".model-body").find(".title").attr("data-schemeid");
          var tabArgu = {
            schemeGuid: schemeGuid,
            rgCode: svData.svRgCode,
            setYear: svData.svSetYear,
          };
          ufma.confirm(
            "确认删除？",
            function (action) {
              if (action) {
                ufma.post(interfaceURL.deleteOriBilllMsg, tabArgu, function (result) {
                  ufma.showTip(
                    result.msg,
                    function () {
                      if (result.flag == "success") {
                        page.getSchemeTypes();
                        // $("#search-btn").trigger("click");
                      }
                    },
                    result.flag
                  );
                });
              }
            },
            {
              type: "warning",
            }
          );
        });

        //点击新增,新增单据方案
        $("#bdAdd").on("click", function (e) {
          stopPropagation(e);
          var data = {};
          if ($('input[name="subUnits"]:checked').val() == "*") {
            data.agencyCode = "*";
            data.agencyName = "全局";
          } else {
            if (page.agency == undefined || $("#bdAgency_input").val() == "") {
              data.agencyCode = "*";
              data.agencyName = "全局";
            } else {
              data.agencyCode = page.agency.getValue();
              data.agencyName = page.agency.getText();
            }
          }
          setData = {
            schemeGuid: "",
            soSystemData: src.sonSystemData,
          };
          var openData = {
            action: "addBill",
            agencyCode: page.agency.getValue(),
            agencyName: page.agency.getText(),
            data: setData,
          };
          if (className) {
            openData.className = "billDefinitionAgency";
          }
          ufma.open({
            url: "edit.html",
            title: "单据方案",
            //width: 1090,
            width: 1190,
            data: openData,
            ondestory: function (data) {
              //窗口关闭时回传的值
              page.destoryCallBack(data);
            },
          });
        });
        //点击单据方案卡片的设置,更改单据方案数据
        $("#billDefinition").on("click", ".b-set", function (e) {
          stopPropagation(e);
          var agencyId = $(this).parents(".model-body").find(".model-text .agency").attr("data-agency");
          var t = $(this);
          if (className && agencyId == "*") {
            ufma.confirm(
              "单据方案是系统级的，仅可查看，不允许修改",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                  page.setScheme(t);
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          }
          // if (billNum == "true" && temNum == "true") {
          //     ufma.confirm('单据方案已经导入数据并且增加了凭证模版，仅允许修改方案描述', function (action) {
          //         if (action) {
          //             //点击确定的回调函数
          //             page.setScheme(t);
          //         } else {
          //             //点击取消的回调函数
          //         }
          //     }, {type: 'warning'});
          //     $(".u-msg-footer").find("button").eq(0).css("display", "none");
          //     return false;
          // }
          // else if (billNum == "true") {
          //     ufma.confirm('单据方案已经导入数据，仅允许修改方案描述', function (action) {
          //         if (action) {
          //             //点击确定的回调函数
          //             page.setScheme(t);
          //         } else {
          //             //点击取消的回调函数
          //         }
          //     }, {type: 'warning'});
          //     $(".u-msg-footer").find("button").eq(0).css("display", "none");
          //     return false;
          // }
          // else if (temNum == "true") {
          //     ufma.confirm('单据方案已经增加了凭证模版，仅允许修改方案描述', function (action) {
          //         if (action) {
          //             //点击确定的回调函数
          //             page.setScheme(t);
          //         } else {
          //             //点击取消的回调函数
          //         }
          //     }, {type: 'warning'});
          //     $(".u-msg-footer").find("button").eq(0).css("display", "none");
          //     return false;
          // }
          page.setScheme(t);
        });
        //点击单据方案卡片的导入数据
        $("#billDefinition").on("click", ".b-import", function (e) {
          stopPropagation(e);
          var guid = $(this).parents(".model-body").find(".model-text .title").attr("data-schemeid");
          var type = $(this).parents(".model-body").find(".model-text .data").attr("data-src");
          var agencyCode = $(this).parents(".model-body").find(".model-text .agency").attr("data-agency");
          var schemeName = $(this).parents(".model-body").find(".model-text .title").text();
          page.getTableHeadName(guid, type, agencyCode, schemeName);
        });
        //点击新增模板,新增目标单据转换模板
        $("#billDefinition").on("click", ".b-add", function (e) {
          stopPropagation(e);
          var schemeGuid = $(this).parents(".model-body").find(".model-text .title").attr("data-schemeid");
          var schemeName = $(this).parents(".model-body").find(".model-text .title").text();
          var agencyId = $(this).parents(".model-body").find(".model-text .agency").attr("data-agency");
          var agencyName = $(this).parents(".model-body").find(".model-text .agency").text();
          // var agencyName = $(this).parents(".model-body").find(".agency").text();
          agencyName = agencyName.substring(agencyName.indexOf("：") + 1);
          if (agencyId == "*" && className) {
            agencyId = page.agency.getValue();
            agencyName = page.agency.getText();
          }
          var addTemplate = {
            schemeGuid: schemeGuid,
            agencyCode: agencyId,
            agencyName: agencyName,
            UPagencyCode: agencyId,
          };
          var datas = {
            action: "addTemplate",
            data: addTemplate,
            eleAccItem: eleAccItemList,
          };
          ufma.setObjectCache("addTemplate", datas);
          page.temHtml = ufma.open({
            url: "templateGeneration.html",
            title: "凭证模版",
            width: 1090,
            // height: 500,
            data: "",
            ondestory: function (data) {
              //窗口关闭时回传的值
              if (data.action == "save") {
                //加载单据方案列表
                // page.getSchemeByCondition()
                $("#search-btn").trigger("click");
              }
            },
          });
          // showModal("/pf/lp/billScheme/templateGeneration.html")
        });
        //点击模版的设置,设置模版数据
        $("#billDefinition").on("click", ".t-set", function (e) {
          stopPropagation(e);
          var temAgencyCode = $(this).parents(".target-body").find(".agency").attr("data-agency");
          var t = $(this);
          if (className && temAgencyCode == "*") {
            ufma.confirm(
              "凭证模版为系统级，仅可查看，不能修改",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                  page.setTem(t);
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          }
          page.setTem(t);
        });
        $("#billDefinition").on("click", ".t-copy", function (e) {
          stopPropagation(e);
          var guid = $(this).parents(".target-icon").prev(".target-text").find(".title").attr("data-tmpid");
          var openData = {
            guid: guid,
            agencyCode: page.agency.getValue(),
            schemeGuid: $(this).parents(".model-item").find(".title").attr("data-schemeid"),
          };
          page.temHtml = ufma.open({
            url: "templateCopy.html",
            title: "补充模版信息",
            width: 700,
            data: openData,
            ondestory: function (data) {
              //窗口关闭时回传的值;
              if (data.action == "save") {
                //加载单据方案列表
                $("#search-btn").trigger("click");
              }
            },
          });
        });
        //删除模版
        $(document).on("click", ".target-icon .t-del", function (e) {
          stopPropagation(e);
          var guid = $(this).parents(".target-icon").prev(".target-text").find(".title").attr("data-tmpid");
          var Type = $(this).parents(".target-icon").prev(".target-text").find(".title").attr("data-billkind");
          var temAgencyCode = $(this).parents(".target-body").find(".agency").attr("data-agency");
          if (className && temAgencyCode == "*") {
            ufma.confirm(
              "凭证模版为系统级，不允许删除",
              function (action) {
                if (action) {
                  //点击确定的回调函数
                } else {
                  //点击取消的回调函数
                }
              },
              {
                type: "warning",
              }
            );
            $(".u-msg-footer").find("button").eq(0).css("display", "none");
            return false;
          }
          ufma.confirm(
            "确认删除？",
            function (action) {
              if (action) {
                // ufma.delete("/lp/template/deleteTemplate?tarBillType=" + Type + "&tmpGuid=" + guid, "", function () {
                ufma.delete("/lp/template/deleteTemplate?tmpGuid=" + guid, "", function () {
                  ufma.showTip("删除成功", function () {}, "success");
                  page.getSchemeByCondition();
                });
              }
            },
            {
              type: "warning",
            }
          );
        });
        //点击切换数据源类型
        $("#source-btn").on("click", "button", function () {
          if (!$(this).hasClass("btn-primary")) {
            $("#lp-btns-list").hide();
            $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
            $(this).siblings("#lp-btns-list").find("button").attr("class", "btn btn-default");
            page.getSchemeByCondition();
          }
          // page.getBillTypeList();
        });
        //点击来源子系统切换
        $("#son-system-btns").on("click", "button", function () {
          if (!$(this).hasClass("btn-primary")) {
            $("#lp-btns-list").hide();
            $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
            $(this).siblings("#lp-btns-list").find("button").attr("class", "btn btn-default");
            page.getSchemeByCondition();
          }
        });
        //点击来源子系统切换
        $(document).on("click", "#lp-btns-list button", function (e) {
          e.stopPropagation();
          $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
          $(this).parent().siblings("button").attr("class", "btn btn-default");
          $("#lp-btns-list").show();
          page.getSchemeByCondition();
        });
        //显示隐藏的来源子系统
        $(document).on("click", ".lp-rest-sign", function (e) {
          e.stopPropagation();
          $("#lp-btns-list").show();
        });
        //点击空白处，设置的弹框消失
        // $(document).bind("click", function (e) {
        //     $("#lp-btns-list").hide();
        // });
        $(document).on("click", "#open-formula-editor", function (e) {
          ufma.open({
            url: "../formulaeditor/formulaEditor.html",
            title: "公式编辑器",
            width: 1090,
            // height: 500,
            data: "",
            ondestory: function (data) {
              if (data.action) {
                if(data.action.pagePosition === "accountGsName"){ // 辅助核算需求
                  page.accItemHtml.setData(data);
                } else {
                  page.temHtml.setData(data);
                }
              }
            },
          });
        });
        // 辅助核算需求
        $(document).on("click", "#open-accItemType-editor", function (e) {
          page.accItemHtml = ufma.open({
              url: '../accItemTypeEditor/accItemTypeEditor.html',
              title: '辅助核算',
              width: 1090,
              data: "",
              ondestory: function (data) {
                  // 窗口关闭时回传的值
                  if (data.action) {
                    //辅助核算
                    page.temHtml.setData(data);
              }
              }
          });
        });
        //点击更多和收起
        $(".tip-more").on("click", function () {
          if ($(this).find("i").text() == "更多") {
            $(this).find("i").text("收起");
            $(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
            $(".lp-query-box-li-bottom").slideDown();
          } else {
            $(this).find("i").text("更多");
            $(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
            $(".lp-query-box-li-bottom").slideUp();
          }
        });
        //模拟下拉列表
        $(".schemeName-box").on("click", function () {
          if (!$(this).hasClass("open")) {
            $(this).find(".schemeName-list").removeClass("hidden");
            // $(this).find(".schemeName-list").slideDown("1500");
            $(this).addClass("open");
          }
        });
        // 点击空白处，设置的弹框消失
        $(document).bind("click", function (e) {
          var div1 = $(".schemeName-box")[0];
          if (e.target != div1 && !$.contains(div1, e.target)) {
            // $(".schemeName-list").slideUp();
            $(".schemeName-list").addClass("hidden");
            $(".schemeName-box").removeClass("open");
          }
        });
        $(".uf-combox").on("click", function () {
          // $(".schemeName-list").slideUp();
          $(".schemeName-list").addClass("hidden");
          $(".schemeName-box").removeClass("open");
        });
        //导入单据方案
        $("#btnImport").on("click", function (e) {
          stopPropagation(e);
          var agencyCode = "*";
          if ($(".billDefinitionAgency").length > 0) {
            agencyCode = page.agency.getValue();
          }
          var isSys = agencyCode == "*" ? "1" : "0";
          // 导入单据方案
          ufma.open({
            title: '导入',
            url: '../../pub/impXLS/impXLS.html',
            width: 800,
            height: 400,
            data: {
              eleName: '导入单据方案和凭证模版',
              eleCode: 'LPSCHE',
              projectName: 'lp', //这里多加了一个参数，用于区分模板所属模块
              agencyCode: agencyCode,
              rgCode: svData.svRgCode,
              setYear: svData.svSetYear,
              isSys: isSys,
              // checkUrl: "/lp/scheme/checkXmlScheme?eleCode=LPSCHE&rgCode=" + svData.svRgCode + "&agencyCode=" + agencyCode + "&setYear=" + svData.svSetYear + "&isSys=" + isSys,
              checkUrl: "/lp/scheme/checkXmlScheme",
              insertUrl: "/lp/scheme/insertAllXmlScheme"
            },
            ondestory: function(res) {
              //加载单据方案列表
              page.getSchemeTypes();
              $("#search-btn").trigger("click");
            }
          });
        });
        //导出单据方案 guohx 20200422
        $("#btnExport").on("click", function (e) {
          stopPropagation(e);
          var agencyCode = "*";
          if ($(".billDefinitionAgency").length > 0) {
            agencyCode = page.agency.getValue();
          }
          // var dataSrcType = $("#source-btn").getObj().getValue();
          // dataSrcType = dataSrcType === "全部" ? "" : dataSrcType;
          // var sysId = $("#son-system-btns").getObj().getValue();
          // sysId = sysId === "全部" ? "" : sysId;
          // var schemeGuid = $("#schemne-name").getObj().getValue();
          // schemeGuid = schemeGuid === "全部" ? "" : schemeGuid;
          var tabArgu = {
            agencyCode: agencyCode,
            rgCode: svData.svRgCode,
            setYear: svData.svSetYear,
          };
          ufma.open({
            url: bootPath + "pub/baseTreeSelect/baseTreeSelect.html",
            title: "选择单据方案和凭证模版",
            width: 580,
            height: 545,
            data: {
              flag: 'LPSCHE',
              rootName: "单据方案和凭证模版",
              checkbox: true,
              leafRequire: false,
              data: tabArgu,
              url : '/lp/scheme/getSchemeTemplateTree'
            },
            ondestory: function (result) {
              if (result.action) {
                var target = page.convertToTreeData(result.data);
                var tabArgu = {
                  agencyCode : agencyCode,
                  target: target,
                  rgCode: svData.svRgCode,
                  setYear: svData.svSetYear,
                  isSys: agencyCode == "*" ? "1" : "0",
                };
                // var menuid = $.getUrlParam('menuid');
                // var roleId = $.getUrlParam('roleId');
                // $.ajax({
                //   url: interfaceURL.exportScheme,
                //   type: 'POST', //GET
                //   async: false, //或false,是否异步
                //   data: JSON.stringify(tabArgu),
                //   contentType: 'application/json; charset=utf-8',
                //   responseType: 'blob',
                //   beforeSend: function(xhr) {
                //     xhr.setRequestHeader("x-function-id",menuid);
                //     xhr.setRequestHeader("x-functiongroup-ids",roleId);
                //   },
                //   success: function(result) {
                //     download(result,'导出单据方案.xml')
                //   },
                //   error: function(jqXHR, textStatus) {
                //   },
                // });

								ufma.post(interfaceURL.exportScheme, tabArgu,function(res){
									if(res.flag == 'success'){
                    window.location.href = res.data;
									}else{
										ufma.showTip(res.msg, function(){},'fail');
									}
									ufma.hideloading();
								});

              };
            }
          });
        });
         //复制单据方案 guohx 20200710  CWYXM-18075 会计平台单据方案增加复制功能，可以复制单据方案和方案下的凭证模版
         $("#billDefinition").on("click", ".btn-copySche", function (e) {
          stopPropagation(e);
          var agencyCode = "*";
          if ($(".billDefinitionAgency").length > 0) {
            agencyCode = page.agency.getValue();
          }
          var tabArgu = {
            agencyCode: agencyCode,
            setYear:svData.svSetYear,
            rgCode:svData.svRgCode,
            schemeGuid: $(this).parents(".model-item").find(".title").attr("data-schemeid")
          };
          ufma.ajax(interfaceURL.copyScheme, "post", tabArgu, function(result) {
            ufma.showTip(result.msg, function () {}, result.flag);
          });
        });
      },
      convertToTreeData:function(data) {
        var result = [];
        var obj ={};
        function isContainFlag (flag, res) {
          for (var i = 0; i < res.length; i++) {
            if (flag == res[i].schemeGuid) {
              return true;
            }
          }
        }
        for (var j = 0; j < data.length; j++) {
          if (data[j].PID == 0) { // PID为0都push到result
            if (data[j].ISTEMPLATE == "0") { // 单据方案
              obj = { 'schemeGuid': data[j].ID, 'schemeName': data[j].NAME, 'vouTmpGuid': [] };
            }
            result.push(obj)
          } else {
            if (isContainFlag(data[j].PID, result)) { // 如果result有这个单据方案
              result.forEach(function (item) {
                if (item.schemeGuid == data[j].PID) {
                  var temp = {};
                  temp[data[j].ID] = data[j].NAME1;
                  item.vouTmpGuid.push(temp)
                }
              });
            } else { // 如果result没有这个单据方案
              obj = {'schemeGuid': data[j].PID, 'schemeName': data[j].NAME, 'vouTmpGuid': []};
              var temp = {};
              temp[data[j].ID] = data[j].NAME1;
              obj.vouTmpGuid.push(temp);
              result.push(obj)
            }
          }
        }
        return result;
      },
      //此方法必须保留
      init: function () {
        ufma.parse();
        this.initPage();
        this.onEventListener();
      },
    };
	}();

	/////////////////////
	page.init();
	$(document).on("click", "#showclickbillDefinition", function() {
		page.getSchemeByCondition()
		$("body").css("overflow", "auto");
	});
	$("#lp-btns-list").on("click", "button", function() {
		$("#lp-btns-list").hide();
	});

	function showModal(url, width, height) {
		if(typeof(width) == "undefined") {
			width = document.body.clientWidth;
		}
		if(typeof(height) == "undefined") {
			height = document.body.clientHeight;
		}
		var divBg = '<div id="tempModalBg" style="background:#fff;width:1090px;height:500px;position:fixed;z-index:9999;overflow:hidden;top:0;left:0;">' +
			'<iframe src="' + url + '" height="100%" width="100%" style="border:none;position:absolute;"></iframe>' +
			'</div>';
		$("body").append($(divBg));
		var topVal = ($(window).height() - $("#tempModalBg").height()) / 2;
		var leftVal = ($(window).width() - 1090) / 2;
		$("#tempModalBg").css({
			top: topVal.toString() + 'px',
			left: leftVal.toString() + 'px'
		});
		$("#ModalBg").css("display", "block");
		$("body").css("overflow", "hidden");
		$(window).on("resize", function() {
			var topVal = ($(window).height() - $("#tempModalBg").height()) / 2;
			var leftVal = ($(window).width() - 1090) / 2;
			$("#tempModalBg").css({
				top: topVal.toString() + 'px',
				left: leftVal.toString() + 'px'
			});
		});
	};

});

function stopPropagation(e) {
	if(e.stopPropagation)
		e.stopPropagation();
	else
		e.cancelBubble = true;
}

function dragFun() {
	var modelItems = $(".model-item");
	for(var i = 0; i < modelItems.length; i++) {
		var $targetItem = $(modelItems[i]).find(".target-item");
		$targetItem.Tdrag({
			scope: ".model-right",
			pos: true,
			dragChange: true,
			handle: ".target-text",
			cbEnd: cbEndFun,
			disable: true,
			disableInput: ".disable"
		});
		var $modelRight = $(modelItems[i]).find(".model-right");
		var w = $modelRight.width();
		var targetItems = $modelRight.find(".target-item");
		var len = targetItems.length;
		var sumL = 0,
			res = 0,
			h = 170;
		for(var y = 0; y < len; y++) {
			sumL += 230 * (y + 1);
			if(sumL > w && y < len) {
				res = y + 1;
				break
			}
		}
		if(res > 0) {
			var num = Math.ceil(len / res);
			h = 170 * num;
			$modelRight.height(h);
		}
	}
}

function cbEndFun(obj, self) {
	var argu = {
		data: []
	};
	var modelItems = $(".model-box .model-item");
	modelItems.each(function() {
		var targetItems = $(this).find(".model-right .target-item")
		for(var i = 0; i < targetItems.length; i++) {
			var tmpid = $(targetItems[i]).find(".title").attr("data-tmpid");
			var index = $(targetItems[i]).attr("index")
			var obj = {
				vouTmpGuid: tmpid,
				ordSeq: parseInt(index) + 1
			}
			argu.data.push(obj)
		}
	})
	return argu

}
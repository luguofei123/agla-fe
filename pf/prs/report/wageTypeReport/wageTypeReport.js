$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();

    //接口URL集合
    var interfaceURL = {
        findCalcDatas: "/prs/rpt/PrsRptData/getSummarySalaryByConditionData",
        getPrsOrgTreeIsUsed:"/prs/emp/prsOrg/getPrsOrgTreeIsUsed",//部门树
        printSummarySalaryByConditionData:"/prs/rpt/PrsRptData/printSummarySalaryByConditionData"//获取打印数据
    };
    var pageLength = 25;
    var newCellsData = [];
    var isGet = false;
    //固定列
    var fixcolData = {cols:[
        {code: "prtypeCodeName", name: "类别"},
    ]};
    var notatm = ["prtypeCodeName","smo"];
    var page = function () {
        return {
            combinePrsCalcItems: function (data) {
                var result = {};
                for (var i = 0; i < data.length; i++) {
                    var code = prs.strTransform(data[i].pritemCode);
                    result[code] = data[i].isEditable
                }
                return result;
            },
            //表格列
            combineColumns: function () {
                var columns = {};
                for (var i = 0; i < page.columns.length; i++) {
                    var obj = {
                        title: page.columns[i].name,
                        data: page.columns[i].code,
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    };
                    //notatm 数据属性Array
                    if(notatm.indexOf(obj.data) <0 ){//数组不存在code
                        // obj.render = $.fn.dataTable.render.number(',', '.', 2, '');
                    	obj.render = function (data, type, rowdata, meta) {
                            if (!data || data == 0) {
                                return "";
                            }
                            var color = "";
                            if (rowdata.isEdit == 'dept') {
                            	color = 'colorY';
                            }
                            return '<span class="'+color+'">'+$.formatMoney(data,2)+'</span>';
                            //return $.formatMoney(data,2);
                        }
                        obj.className = "isprint nowrap ellipsis tdNum";
                    }else if (obj.data == "empName") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                            //return '<a href="javascript:;" class="edit-row-data" data-id="' + rowdata.id + '" row-id= "' + meta.row + '" style="color: #108ee9">' + data + '</a>';
                        }
                    } else if (obj.data == "sex") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            } else if (data == "1") {
                                return "男";
                            } else if (data == "0") {
                                return "女";
                            }else{
                                return "未知";
                            }
                            return data
                        }
                    } else if (obj.data == "isFugle") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            } else if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data
                        }
                    }
                    columns[page.columns[i].code] = obj;
                }

                var checks = $("#colList input:checked");
                var newColumns = [
                    {
                        title: '序号',
                        className: "nowrap check-style",
                        width: 30,
                        data: null,
                        "render": function (data, type, rowdata, meta) {
                            return meta.row + 1;
                        }
                    }
                ];
                for (var i = 0; i < checks.length; i++) {
                    var code = $(checks[i]).attr("data-code");
                    newColumns.push(columns[code]);
                }
                return newColumns;
            },
            //初始化表格
            initTable: function (data) {
                var h = $(".workspace").height();
                var newH = h - 130;
                var id = "mainTable";
                // var toolBar = $('#' + id).attr('tool-bar');
                page.DataTable = $('#' + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    // "scrollY": newH,
                    "scrollX": false,
                    paging: false,
                    searching: false,
                    ordering: false,
                    "columns": page.combineColumns(),
                    fixedColumns: {
                        leftColumns: 2
                    },
                    "dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
                    // "dom": '<"datatable-toolbar"B>',
                    "buttons": [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint'
                        },
                        customize: function (win) {
                            $(win.document.body).find('h1').css("text-align", "center");
                            $(win.document.body).css("height", "auto");
                        }
                    },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint'
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function (settings, json) {
                        console.log('---initComplete---');
                        // 打印&导出按钮
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        // $('#datatables-print').html('');
                        // $('#datatables-print').append($(".datatable-toolbar"));
                        $(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        });
                        $('.btn-print').removeAttr('href')
                        $(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });
                        
                        $(".colorY").each(function(index){
                        	$(this).closest("tr").find("td").addClass("colorY");
                        })
                        
                      //导出begin
                        $("#dtToolbar .buttons-print").off().on('click', function (evt) {
                        	var dataSource = $(".source .btn-primary").attr("value");
                            var payNoMo = "";
                        	var argu = {
                                orgCodes: $("#departmentCode").ufmaTextboxlist().getValue() ? $("#departmentCode").ufmaTextboxlist().getValue().split(",") : [],
                                prtypeCodes: page.selPrtypeCodes(),
                                flag : dataSource == "1" ? "RPT_PAYLIST" : "RPT_CALC",
                                monthStart: dataSource == "1" ? $("#startMonth").val() : "",
                                monthEnd: dataSource == "1" ? $("#endMonth").val() : "",
                                payNoMo : dataSource == "1" ? $("#payNoMo").val() : "",
                                time : '',
                                condition : "prtypeCode"
                            };
                            ufma.showloading("正在加载数据请耐心等待...");
                            ufma.post(interfaceURL.printSummarySalaryByConditionData, argu, function (result) {
                            	var data = JSON.stringify(result.data);
                            	getPdf("salarySummaryForm","*",data);
                            })
                        	function getPdf(reportCode, templId, groupDef) {
                    			var xhr = new XMLHttpRequest()
                    			var formData = new FormData()
                    			formData.append('reportCode', reportCode)
                    			formData.append('templId', templId)
                    			formData.append('groupDef', groupDef)
                    			xhr.open('POST', '/pqr/api/printpdfbydata', true)
                    			xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
                    			xhr.responseType = 'blob'

                    			//保存文件
                    			xhr.onload = function(e) {
                    				if(xhr.status === 200) {
                    					if(xhr.status === 200) {
                    						const content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
                    						window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
                    					}
                    				}
                    			}

                    			//状态改变时处理返回值
                    			xhr.onreadystatechange = function() {
                    				if(xhr.readyState === 4) {
                    					//通信成功时
                    					if(xhr.status === 200) {
                    						//交易成功时
                    						ufma.hideloading();
                    					} else {
                    						const content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
                    						//提示框，各系统自行选择插件
                    						alert(content)
                    						ufma.hideloading();
                    					}
                    				}
                    			}
                    			xhr.send(formData)
                    		}
                        });
                        // 导出end

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '类别工资汇总表');
                        });
                        // 导出end

                        //驻底end
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();
                        // $("#tool-bar").width($(".prs-workspace").width() - 224);

                        $("#mainTable").wrapAll("<div style='overflow-x:auto'>");
                        $('.dataTables_scrollBody').scroll(function () {
                            if (page.tableData && page.tableData.length > 0) {
                                if ($(this)[0].scrollHeight - $(this).scrollTop() - 30 < $(this).height()) {
                                    if (!isGet) {
                                        isGet = true;
                                        // var tData = page.tableData.slice(page.page*100-20,page.page*100+100);
                                        var tData = page.tableData.slice(page.page * 100, page.page * 100 + 100);
                                        page.page += 1;
                                        page.curTableData = tData;
                                        if (tData.length > 0) {
                                            // page.DataTable.clear().draw();
                                            page.DataTable.rows.add(tData).draw();
                                            // $(this).scrollTop(0)
                                            // page.initTable(tData);
                                        }
                                    }
                                }
                            }
                        })
                        //权限控制
                        ufma.isShow(page.reslist);
                    },
                    "drawCallback": function (settings) {
                        isGet = false;
                        $("#mainTable").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
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
            //获取勾选的数据
            getCheckedRows: function () {
                var checkes = $("input.checkboxes:checked");
                return checkes;
            },
            //获取部门数据
            getDepartment: function () {
                ufma.get(interfaceURL.getPrsOrgTreeIsUsed,"",function(result){
                    var data = result.data;
                    var obj = {
                        id: "0",
                        code: "0",
                        codeName: "全部",
                        pId: null
                    }
                    data.push(obj);
                    page.departmentData = data;
                    var arr = [];
        	        for (var i = 0; i < data.length; i++) {
        	          if (data[i].code != '0') {
        	        	  arr.push(data[i].code);
        	          }
        	        }
        	        page.orgCodes = arr.join(",");
                    console.log(data);
                    $("#departmentCode").ufmaTextboxlist({//初始化
                        valueField: 'id',//可选
                        textField: 'codeName',//可选
                        name: 'departmentCode',
                        data: page.departmentData,//列表数据
                        leafRequire: true,
                        expand: true,
                        onchange : function(data) {
    						// console.log(data);
    						page.orgCodes = $("#departmentCode").ufmaTextboxlist().getValue();
    					}
                    });
                    // 设置部门数据全选
					$("#departmentCode").ufmaTextboxlist().val(page.orgCodes);
                })
                
            },
            //可选择的表格列
            renderSeletableColumns: function (data) {
                var newData=$.extend(true,{},fixcolData).cols;
                for (var y = 0; y < data.length; y++) {
                    for (var i in data[y]) {
                        var code = prs.strTransform(i);
                        var obj = {code: code, name: data[y][i]};
                        newData.push(obj)
                    }
                }

                page.columns = newData;
                page.renderP(newData);
            },
            renderP: function (datas) {
                $("#colList").html("");
                // var arr = ["empName", "sex", "orgCode", "prtypeCode", "levelGrade", "dutyGrade", "isFugle"];
                var pHtml = "";
                for (var i = 0; i < datas.length; i++) {
                    // if (arr.indexOf(datas[i].code) >= 0) {
                    pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" checked="checked" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    // } else {
                    //     pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    // }

                }
                $("#colList").append(pHtml);
            },
            //左侧工资类别树
            wageItemsTree: function (wageTypes) {
            	prsTypeData = wageTypes;
                var liHtmls = '<label class="rpt-check checkAll mt-checkbox mt-checkbox-outline"><input data-code="*" type="checkbox" autocomplete="off">工资类别<span></span></label>';
                for (var i = 0; i < wageTypes.length; i++) {
                    liHtmls += '<li><label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="prType" data-code="' + wageTypes[i].prtypeCode + '" type="checkbox" autocomplete="off">' + wageTypes[i].prtypeName + '<span></span></label></li>'
                }
                $('#atree').html(liHtmls);
            },
            //获取基础数据
            findCalcDataBase: function () {
                var argu = {
                    "flag":"CALCBZ",
                    "time" : '1',
                    "condition" : "prtypeCode"
                };
                ufma.showloading("正在加载数据，请耐心等待...");
                ufma.post(interfaceURL.findCalcDatas,argu,function (result) {
                    console.log(result);
                    ufma.hideloading();
                    var data = result.data;
                    page.baseData = data;
                    page.prsTypeCosData = data.topMessage.prsTypeCos;//筛选条件
                    page.orgTreeData = data.topMessage.orgTree;//部门？
                    page.renderSeletableColumns(data.moveItem);//渲染表头
                    page.wageItemsTree(data.topMessage.prsTypeCos);//渲染筛选条件
                    page.tableDraw(data.prsCalcDatas);//渲染表格
                    page.getMonth(data.topMessage.payNoMo);//通过月份设置批次
                })

            },
            //查询到表格数据后重绘表格
            tableDraw:function(data){
                page.desTroyTable();//销毁
                page.tableData = data;
                var tData = data.slice(0, 100);//100条分页
                page.curTableData = tData;
                page.page = 1;//页码
                page.initTable(tData);//表格初始化
            },
            /*
            * 获取选择的工资类别
            * 
            * return Array
            */
            selPrtypeCodes: function () {
                var inputChecks = $("input[name=prType]:checked");
                var prtypeCodes = [];
                for (var i = 0; i < inputChecks.length; i++) {
                    prtypeCodes.push($(inputChecks[i]).attr("data-code"));
                }
                return prtypeCodes;
            },
            selPrtypeCodesName: function () {
                var inputChecks = $("input[name=prType]:checked");
                var names = [];
                for (var i = 0; i < inputChecks.length; i++) {
                	names.push($(inputChecks[i]).closest("label").text());
                }
                return names;
            },
            //获取所有工资类别
            allPrtypeCodes: function () {
                var inputChecks = $("input[name=prType]");
                var prtypeCodes = [];
                for (var i = 0; i < inputChecks.length; i++) {
                    prtypeCodes.push($(inputChecks[i]).attr("data-code"));
                }
                return prtypeCodes;
            },
            //数据
            getSearchData: function () {
            	// $(".prTypes-hide").slideUp();
            	var dataSource = $(".source .btn-primary").attr("value");
                var payNoMo = "";
            	var argu = {
                    orgCodes: $("#departmentCode").ufmaTextboxlist().getValue() ? $("#departmentCode").ufmaTextboxlist().getValue().split(",") : [],
                    prtypeCodes: page.selPrtypeCodes(),
                    flag : dataSource == "1" ? "RPT_PAYLIST" : "RPT_CALC",
                    monthStart: dataSource == "1" ? $("#startMonth").val() : "",
                    monthEnd: dataSource == "1" ? $("#endMonth").val() : "",
                    payNoMo : dataSource == "1" ? $("#payNoMo").val() : "",
                    time : '',
                    condition : "prtypeCode"
                };
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.findCalcDatas, argu, function (result) {
                    console.log(result);
                    ufma.hideloading();
                    page.searchDatas = result.data;
                    page.renderSeletableColumns(result.data.moveItem);
                    page.tableDraw(result.data.prsCalcDatas)
                })
            },
            //初始化可选列
            initSelColumns: function () {
                page.columns =fixcolData.cols;
                page.renderP(page.columns);
            },
            //初始化月份
            initMonth: function () {
                page.getMonth();
            },
            //获取月份
            getMonth: function (num) {
            	var data = [
                    {code: "1", name: "1月"},
                    {code: "2", name: "2月"},
                    {code: "3", name: "3月"},
                    {code: "4", name: "4月"},
                    {code: "5", name: "5月"},
                    {code: "6", name: "6月"},
                    {code: "7", name: "7月"},
                    {code: "8", name: "8月"},
                    {code: "9", name: "9月"},
                    {code: "10", name: "10月"},
                    {code: "11", name: "11月"},
                    {code: "12", name: "12月"}
                ];
                var optionHtml = "";
                for(var i =0;i<data.length;i++){
                    optionHtml += '<option value="'+data[i].code+'">'+data[i].name+'</option>'
                }
                $("#startMonth").append(optionHtml);
                $("#endMonth").append(optionHtml);
                
//                var data2 = [
//                	{code: "", name: ""},
//                    {code: "1", name: "1"},
//                    {code: "2", name: "2"},
//                    {code: "3", name: "3"},
//                    {code: "4", name: "4"},
//                    {code: "5", name: "5"},
//                    {code: "6", name: "6"},
//                    {code: "7", name: "7"},
//                    {code: "8", name: "8"},
//                    {code: "9", name: "9"},
//                    {code: "10", name: "10"},
//                    {code: "11", name: "11"},
//                    {code: "12", name: "12"}
//                ];
                var payNoHtml = "";
                payNoHtml += '<option value=""></option>'
                for(var i = 1; i <= num; i++){
                	payNoHtml += '<option value="'+i+'">'+i+'</option>'
                }
                $("#payNoMo").append(payNoHtml);
                // $("#startMonth").getObj().load(data);
                // $("#endMonth").getObj().load(data);
            },
            //初始查询方案
            initSerchScheme: function () {
                $("#serchScheme").ufTreecombox({
                    valueField: "id",
                    textField: "codeName",
                    pIdField: 'pId', //可选
                    readonly: false,
                    placeholder: "请选择会计科目",
                    leafRequire: false
                });
                page.getSerchScheme();
            },
          //获取查询方案
            getSerchScheme: function () {
                var data = [
                    {code: "1", codeName: "全部",id:"1"},
                    {code: "2", codeName: "国家级正职",id:"2"}
                ];
                $("#serchScheme").getObj().load(data);
                if (data.length > 0) {
                    $("#serchScheme").getObj().val(data[0].code);
                }
                //page.getSearchData();
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.initSelColumns();
                page.initTable([]);
//                page.initMonth();
                page.getDepartment();
                page.findCalcDataBase();//获取基础数据
                page.initSerchScheme();
                $(window).resize(function () {
                    $("#tool-bar").find(".slider").width($(".prs-workspace").width() - 252);
                    $("#tool-bar").width($(".prs-workspace").width() - 224);
                });
            },
            onEventListener: function () {
            	//状态
                $(".status").on(".btn", function () {
                    $(this).addClass("btn-primary").siblings(".btn").removeClass("btn-primary");
                });
                //查询
                $("#btnQuery").on("click", function () {
                    page.getSearchData();
                })
                //选择显示的列
                $("#colAction").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                $("#addCol").on("click", function () {
                    // page.desTroyTable();

                    pageLength = ufma.dtPageLength('#mainTable');
                    $('#mainTable_wrapper').ufScrollBar('destroy');
                    page.DataTable.clear().destroy();
                    $("#mainTable").html("");
                    $(this).closest(".rpt-funnelBoxList").addClass("hidden");
                    page.initTable(page.tableData);
                });
                //审核
                $("#btn-audit").on("click",function () {
                    ufma.confirm('您确定继续吗？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                            var nodes = prs.getTreeSelectedNodes("atree");
                            var argu = {};
                            ufma.post("",argu,function (result) {
                                ufma.showTip(result.msg,function () {

                                },result.flag);
                                if(result.data.length > 0){
                                    page.initTable(result.data);
                                }
                            });
                        }else{
                            //点击取消的回调函数
                        }
                    },{type:'warning'});

                });
                //查询
                $("#btnQuery").on("click",function () {
                    var argu = $('#frmQuery').serializeObject();
                    ufma.post("",argu,function (result) {
                        ufma.showTip(result.msg,function () {

                        },result.flag);
                        if(result.data.length > 0){
                            page.initTable(result.data);
                        }
                    });
                });
                //退回
                $("#btn-wf-untread").on("click",function () {
                    ufma.confirm('您确定退回吗？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                            var nodes = prs.getTreeSelectedNodes("atree");
                            var argu = {};
                            ufma.post("",argu,function (result) {
                                ufma.showTip(result.msg,function () {

                                },result.flag);
                                if(result.data.length > 0){
                                    page.initTable(result.data);
                                }
                            });
                        }else{
                            //点击取消的回调函数
                        }
                    },{type:'warning'});

                });
                //按钮切换
                $(document).on("click", ".source .select-item", function () {
                    $(this).removeClass("btn-default").addClass("btn-primary");
                    $(this).siblings(".btn").addClass("btn-default").removeClass("btn-primary");
                    if($(this).hasClass("btn-primary") && $(this).attr("value") == "1"){
                        $(".month-element").removeClass("hidden");
                    }else{
                        $(".month-element").addClass("hidden");
                    }
                });
                $("#btn-set").on("click",function () {
                    var openData = {};
                    page.setScheme = ufma.open({
                        url: 'setScheme.html',
                        title: "设置查询方案",
                        width: 1090,
                        //height:500,
                        data: openData,
                        ondestory: function (data) {
                            //窗口关闭时回传的值
                            // if (data) {
                            //
                            // }
                            //重新获取单击方案下拉列表
                        }
                    });
                });
                $("#open-plus-reduce").on("click",function () {
                    ufma.open({
                        url: 'plusAndReduce.html',
                        title: "选择工资项目",
                        width: 1090,
                        //height:500,
                        data: "",
                        ondestory: function (data) {
                            //窗口关闭时回传的值
                            if(data.action){
                                page.setScheme.setData(data);
                            }
                        }
                    });
                })

                $("#atree").on("change", ".checkAll input", function () {
		            if ($(this).prop("checked")) {
		                $("input[name=prType]").prop("checked", true)
		            } else {
		                $("input[name=prType]").prop("checked", false)
		            }
		            //page.getSearchData();
		        })
		        $("#atree").on("change", "input[name=prType]", function () {
		            var checks = $("input[name=prType]:checked");
		            var inputs = $("input[name=prType]");
		            if (checks.length == inputs.length) {
		                $(".checkAll").find("input").prop("checked", true)
		            } else {
		                $(".checkAll").find("input").prop("checked", false)
		            }
		        })
            },

            //此方法必须保留
            init: function () {
                ufma.parse();
                page.initPage();
                page.onEventListener();
                ufma.parseScroll();
            }
        }
    }();
/////////////////////
    page.init();

    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "64px");
        }
    })
});

function combinePrsCalcItems(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);
        result[code] = data[i].color;
    }
    return result;
}

function combinePrsCalcItemsLight(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);
        result[code] = data[i].isHighLight;
    }
    return result;
}

$(function(){
    var pageLength= ufma.dtPageLength('#glRptJournalTable');
    var hideColArray=[];
    var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 20,
	};
	var page = function(){
		
		var glRptJournalDataTable;//全局datatable对象
        var glRptJournalTable;//全局table的ID
        var isCrossDomain = false;
		
		//明细账所用接口
    //    rpt.urlPath = "http://127.0.0.1:8083";//本地调试
         rpt.urlPath = "";//服务器
		var portList = {
			
			accItemTypeList:rpt.urlPath+"/gl/EleAccItem/getAccItemType", //辅助项类别列表接口 不包括科目
			getReport:rpt.urlPath+"/gl/rpt/getReportData/GL_RPT_JOURNAL",//请求表格数据
			getReportPage:rpt.urlPath+"/gl/rpt/getReportDataPage/GL_RPT_JOURNAL"//请求表格数据-带分页的接口
				
		};

        //用于存储表头信息
        var headArr;
        var changeCol = [];
        var count = 1;

        //固定隐藏列数组
        var fixedArr = [{
            name: "票据号",
            code: "billNo",
            checked: false
        },
            {
                name: "对方科目",
                code: "dAccoName",
                checked: false
            }
        ];
        //动态添加的隐藏列数组
        var actionArr = [];

        //三种表格样式的初始化列数组
        //三栏式
        var SANLANColsArr = [
            {
                data: "vouYear",
                className: 'nowrap isprint tc',
                width: 60,
                render: function(data, type, rowdata, meta) {
                    return rowdata.vouYear||rowdata.rq;
                }

            },{
                data: "vouMonth",
                className: 'nowrap isprint tc',
                width: 60

            }, //-10日期-月
            {
                data: "vouDay",
                className: 'nowrap isprint tc',
            }, //-9日期-日
            {
                data: "rowType",
                className: 'nowrap isprint tc',
                width: 100
            }, //-12行类型
            {
                data: "vouGuid",
                className: 'nowrap isprint ellipsis',
                width: 100
            }, //-11凭证字号
            {
                data: "vouNo",
                className: 'nowrap isprint ellipsis',
                width: 100
            }, //-8凭证字号
            {
                data: "billNo",
                className: 'nowrap isprint',
                width: 150
            }, //-7票据号
            {
                data: "dAccoName",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-6对方科目
            {
                data: "descpt",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-5摘要
            {
                data: "dStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-4借方金额
            {
                data: "cStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-3贷方金额
            {
                data: "drCr"
            }, //-2方向
            {
                data: "bStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            } //-1余额
        ];
        //外币式
        var WAIBIColsArr = [
            {
                data: "vouYear",
                className: 'nowrap isprint tc',
                width: 60,
                render: function(data, type, rowdata, meta) {
                    return rowdata.vouYear||rowdata.rq;
                }

            },{
                data: "vouMonth",
                className: 'nowrap isprint tc',
            }, //-15日期-月
            {
                data: "vouDay",
                className: 'nowrap isprint tc',
            }, //-14日期-日
            {
                data: "rowType",
                className: 'nowrap isprint tc',
                width: 100
            }, //-17行类型
            {
                data: "vouGuid",
                className: 'nowrap isprint ellipsis'
            }, //-16凭证字号
            {
                data: "vouNo",
                className: 'nowrap isprint ellipsis',
                width: 100
            }, //-13凭证字号
            {
                data: "billNo",
                className: 'nowrap isprint',
                width: 150
            }, //-12票据号
            {
                data: "dAccoName",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-11对方科目
            {
                data: "descpt",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-10摘要
            {
                data: "dExRate"
            }, //-9汇率
            {
                data: "dCurrAmt",
                className: 'nowrap isprint tdNum',
                width: 100
            }, //-8借方金额-外币
            {
                data: "dStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-7借方金额-本币
            {
                data: "cCurrAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-6贷方金额-外币
            {
                data: "cStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-5贷方金额-本币
            {
                data: "drCr"
            }, //-4方向
            {
                data: "bExRate"
            }, //-3余额-汇率
            {
                data: "bCurrAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-2余额-外币
            {
                data: "bStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            } //-1余额-本币
        ];
        //数量金额式
        var SHULIANGColsArr = [
            {
                data: "vouYear",
                className: 'nowrap isprint tc',
                width: 60,
                render: function(data, type, rowdata, meta) {
                    return rowdata.vouYear||rowdata.rq;
                }

            },{
                data: "vouMonth",
                className: 'nowrap isprint tc',
            }, //-16日期-月
            {
                data: "vouDay",
                className: 'nowrap isprint tc',
                width: 60
            }, //-15日期-日
            {
                data: "rowType"
            }, //-18行类型
            {
                data: "vouGuid",
                className: 'nowrap isprint ellipsis'
            }, //-17凭证字号
            {
                data: "vouNo",
                className: 'nowrap isprint ellipsis',
                width: 100
            }, //-14凭证字号
            {
                data: "billNo",
                className: 'nowrap isprint',
                width: 150
            }, //-13票据号
            {
                data: "dAccoName",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-12对方科目
            {
                data: "descpt",
                className: 'ellipsis isprint',
                width: 200,
                render: function(data, type, rowdata, meta) {
                    if(data == '' || data == null) {
                        data = ''
                    }
                    return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                }
            }, //-11摘要
            {
                data: "dQty"
            }, //-10借方金额-数量
            {
                data: "dPrice"
            }, //-9借方金额-单价
            {
                data: "dStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-8借方金额-金额
            {
                data: "cQty"
            }, //-7贷方金额-数量
            {
                data: "cPrice"
            }, //-6贷方金额-单价
            {
                data: "cStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            }, //-5贷方金额-金额
            {
                data: "drCr"
            }, //-4方向
            {
                data: "bQty"
            }, //-3余额-数量
            {
                data: "bPrice"
            }, //-2余额-单价
            {
                data: "bStadAmt",
                className: 'nowrap tr isprint tdNum',
                width: 100
            } //-1余额-金额
        ];

        var SANLANhtml1;
        var SANLANhtml2;

        var WAIBIhtml1;
        var WAIBIhtml2;

        var SHULIANGhtml1;
        var SHULIANGhtml2;
		return{
		
			//新增表格列，重置表格信息
            setTable: function(liArr, tableData, colArrBase, type) {
                var colArr = [].concat(colArrBase);
                var descpt = $.inArrayJson(colArr, 'data', 'descpt');
                var ipos = $.inArray(descpt, colArr);
                pageLength = ufma.dtPageLength('#glRptJournalTable');
                $('#glRptJournalTable_wrapper').ufScrollBar('destroy');
                page.glRptJournalDataTable.clear().destroy();
                var columnList = [];
                if(type == "SANLAN") {
                    page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
                    $('#glRptJournalTable tbody').html('');
                } else if(type == "WAIBI") {
                    page.glRptJournalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
                    $('#glRptJournalTable tbody').html('');
                } else if(type == "SHULIANG") {
                    page.glRptJournalThead.html('<tr>' + page.SHULIANGhtml1 + '</tr><tr>' + page.SHULIANGhtml2 + '</tr>');
                    $('#glRptJournalTable tbody').html('');
                }
                var zhaiyaoCol = page.glRptJournalThead.find('.zhaiyaoCol');

                var trHtml = "";
                for(var i = liArr.length - 1; i >= 0; i--) {
                    var index = i;
                    /*					var tempTr = "";
                                        tempTr = ufma.htmFormat('<th rowspan="2"><%=name%></th>',{name:liArr[i].itemTypeName});

                                        trHtml += tempTr;*/
                    zhaiyaoCol.after(ufma.htmFormat('<th rowspan="2"><%=name%></th>', {
                        name: liArr[i].itemTypeName
                    }));
                    var colObj = {};
                    colObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Name";
                    colObj.className = "ellipsis isprint";
                    colObj.width = 200;
                    colObj.render = function(data, type, rowdata, meta) {
                        if(data == '' || data == null) {
                            data = ''
                        }
                        return '<span  title="' + data + '" style="cursor: default">' + data + '</span>'
                    }
                    //columnList.push(colObj);
                    if(!$.inArrayJson(colArr, 'data', colObj.data)) {
                        colArr.splice(ipos + 1, 0, colObj);
                    }

                }
                page.newTable(tableData, colArr, type);
            },

            //表格初始化
            newTable: function(tableData, columnsArr, type) {
                //				console.info("表格查询列columnsArr==="+JSON.stringify(columnsArr));
                var columnDefsArr = [];
                var colIndex1 = 0; //票据号索引
                var colIndex2 = 0; //对方科目索引
                if(type == "SANLAN") {
                    colIndex1 = -7;
                    colIndex2 = -6;

                    columnDefsArr = [{
                        "targets": [5], //凭证字号
                        "className": "isprint",
                        "render": function(data, type, full, meta) {
                            if(data != null) {
                                if(full.vouGuid != null) {
                                    return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                } else {
                                    return data;
                                }
                            } else {
                                return "";
                            }
                        }
                    },
                        {
                            "targets": hideColArray, //对方科目，凭证id，行类型
                            "visible": false
                        },
                        {
                            "targets": [6], //摘要
                            "render": function(data, type, full, meta) {
                                if(data != null) {
                                    if(full.vouGuid != null) {
                                        return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "targets": [-4, -3, -1], //借方金额，贷方金额，余额
                            "className": "tdNum isprint",
                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                        },
                        {
                            "targets": [0, 1, 4, 6, 7, -2], //月，日，凭证字号，摘要，方向
                            "className": "isprint"
                        }
                    ];
                } else if(type == "WAIBI") {
                    colIndex1 = -12;
                    colIndex2 = -11;

                    columnDefsArr = [{
                        "targets": [4], //凭证字号
                        "className": "isprint",
                        "render": function(data, type, full, meta) {
                            if(data != null) {
                                if(full.vouGuid != null) {
                                    return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                } else {
                                    return data;
                                }
                            } else {
                                return "";
                            }
                        }
                    },
                        {
                            "targets": hideColArray, //对方科目，凭证字号，行类型
                            "visible": false
                        },
                        {
                            "targets": [6], //摘要
                            "render": function(data, type, full, meta) {
                                if(data != null) {
                                    if(full.vouGuid != null) {
                                        return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "targets": [0, 1, 4, 6, -9, -4, -3], //月，日，凭证字号，摘要，汇率，方向，汇率
                            "className": "isprint"
                        },
                        {
                            "targets": [-8, -7, -6, -5, -2, -1], //借方金额-外币，借方金额-本币，贷方金额-外币，贷方金额-本币，余额-外币，余额-本币
                            "className": "tdNum isprint",
                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                        }
                    ];
                } else if(type == "SHULIANG") {
                    colIndex1 = -13;
                    colIndex2 = -12;

                    columnDefsArr = [{
                        "targets": [4], //凭证字号
                        "render": function(data, type, full, meta) {
                            if(data != null) {
                                if(full.vouGuid != null) {
                                    return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                } else {
                                    return data;
                                }
                            } else {
                                return "";
                            }
                        }
                    },
                        {
                            "targets": hideColArray, //对方科目，凭证字号，行类型
                            "visible": false
                        },
                        {
                            "targets": [6], //摘要
                            "render": function(data, type, full, meta) {
                                if(data != null) {
                                    if(full.vouGuid != null) {
                                        return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "targets": [0, 1, 4, 6, -10, -7, -4, -3], //月，日，凭证字号，摘要，借方金额-数量，贷方金额-数量，方向，余额-数量
                            "className": "isprint"
                        },
                        {
                            "targets": [-9, -8, -6, -5, -2, -1], //借方金额-单价，借方金额-金额，贷方金额-单价，贷方金额-金额，余额-单价，余额-金额
                            "className": "tdNum isprint",
                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                        }
                    ];
                }
                var id = "glRptJournalTable"; //表格id
                var toolBar = $('#' + id).attr('tool-bar');
                page.glRptJournalDataTable = page.glRptJournalTable.DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "autoWidth": false,
                    "bDestory": true,
                    "data": tableData.list,
                    "processing": true, //显示正在加载中
                    // "pagingType": "full_numbers", //分页样式
                    // "lengthChange": true, //是否允许用户自定义显示数量p
                    // "lengthMenu": [
                    //     [ 20, 50, 100, 200, 100000],
                    //     [ 20, 50, 100, 200, "全部"]
                    // ],
                    // "pageLength": pageLength,
                    "paging": false,
                    "serverSide": false,
                    "ordering": false,
                    "columns": columnsArr,
                    "columnDefs": columnDefsArr,
                    "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
                    //"dom":'r<"tableBox"t><"'+id+'-paginate"ilp>',
                    //"dom": '<"printButtons"B>rt<"tableBox"><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
                    "buttons": [{
                        extend: 'excelHtml5',
                        text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint',
                            format: {
                                header: function(data, columnIdx) {
                                    console.log(page.printHead)
                                    var thisHead = $.inArrayJson(page.printHead, 'index', columnIdx);
                                    if($(data).length == 0) {
                                        return thisHead.pTitle + data;
                                    } else {
                                        return thisHead.pTitle + $(data)[0].innerHTML;
                                    }
                                }
                            }
                        },
                        customize: function(xlsx) {
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        }
                    }],
                    "initComplete": function() {
                        //批量操作toolbar与分页
                        $("#printTableData").html("");
                        $("#printTableData").append($(".printButtons"));

                        $("#printTableData .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });
                        //导出begin
                        $("#printTableData .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '明细账');
                        });
                        //导出end
                        $('#printTableData.btn-group').css("position", "inherit");
                        $('#printTableData div.dt-buttons').css("position", "inherit");
                        $('#printTableData [data-toggle="tooltip"]').tooltip();

                        page.setVisibleCol();
                        page.printHead = rpt.tableHeader(id);

                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        $('#' + id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        $("#tool-bar").width($(".rpt-workspace").width()-224);
                        // $("#tool-bar").css("margin-left","252px");
                        //驻底end

                        var timeId = setTimeout(function () {
                            //左侧树高度
                            var h = $(window).height() -88;
                            $(".rpt-acc-box-left").height(h);
                            var H = $(".rpt-acc-box-right").height();
                            if(H > h){
                                $(".rpt-acc-box-left").height(h + 48);
                                if($("#tool-bar .slider").length > 0){
                                    $(".rpt-acc-box-left").height(h + 52);
                                }
                            }
                            $(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 54);
                            clearTimeout(timeId);
                        },200);
                        //固定表头
                        $("#glRptJournalTable").fixedTableHead();
                        //金额区间-范围筛选
                        rpt.twoSearch(page.glRptJournalTable);
                        // 点击表格行高亮
                        rpt.tableTrHighlight();
                        ufma.isShow(page.reslist);
                    },
                    "drawCallback": function(settings) {
                        $("#" + id).find("tbody tr").each(function() {
                            var rowData = page.glRptJournalDataTable.row($(this)).data();
                            if(!$.isNull(rowData)) {
                                if(rowData.rowType == "4" || rowData.rowType == "5" || rowData.rowType == "7") {
                                    $(this).css({
                                        "background-color": "#f0f0f0"
                                    })
                                }
                            }
                        })

                        page.headArr = rpt.tableHeader(id);
                        
                        page.glRptJournalTable.find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        $(".tableBox").css({
                            "overflow-x": "auto"
                        });

                        if($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
                            $("td.tdNum").each(function() {
                                if($(this).text() != "") {
                                    var num = $(this).text().replace(/\,/g, "");
                                    $(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
                                }
                                $(this).addClass("wanyuan");
                            })
                        }

                        //摘要-模糊单项筛选
                        rpt.oneSearch(page.glRptJournalTable);

                        //金额区间-范围筛选
                        // rpt.twoSearch(page.glRptJournalTable);

                        //显示/隐藏筛选框
                        rpt.isShowFunnelBox();

                        //弹出详细凭证
                        $(rpt.namespace).find("td span").on("click", function() {
                            rpt.openVouShow(this, "glRptJournal", page.isCrossDomain);
                        })
                        ufma.setBarPos($(window));

                        // 修改为后端分页
						$("#glRptJournal .ufma-table-paginate").empty();
						if(!$.isNull(tableData)){
							var paging = tableData;
							uf.backendPaging(paging,"glRptJournal",serachData);
						}
                    }
                });
                return page.glRptJournalDataTable;
            },
			
			//设置隐藏列盒子内容
            setVisibleCol: function() {
                var nowHead = page.headArr;
                if(!nowHead) {
                    return false;
                }
                var changeHead = [];
                var html = "";
                for(var i = 0; i < nowHead.length; i++) {
                    if(nowHead[i].title == "票据号" || nowHead[i].title == "对方科目") {
                        changeHead.push(nowHead[i]);
                        var h = ufma.htmFormat('<p><label class="mt-checkbox mt-checkbox-outline">' +
                            '<input type="checkbox" data-code="<%=code%>" data-index="<%=index%>"><%=title%>' +
                            '<span></span>' +
                            '</label></p>', {
                            title: nowHead[i].title,
                            index: i,
                            code: nowHead[i].code
                        });
                        html += h;
                    }
                }
                $("#colList").html(html);
                page.changeCol = changeHead;
            },
			
			//初始化页面
			initPage:function(){
				//增加筛选框
				$(rpt.namespace+" #SANLAN .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容","-5")));
				$(rpt.namespace+" #SANLAN .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-4")));
				$(rpt.namespace+" #SANLAN .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-3")));
				$(rpt.namespace+" #SANLAN .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-1")));
				
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-zhaiyao-10").after($(rpt.backOneSearchHtml("摘要内容","-10")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-8")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-7")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine3-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-6")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-5")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-2")));
				$(rpt.namespace+" #WAIBI .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-1")));
				
				$(rpt.namespace+" .SHULIANG .thTitle.rpt-th-zhaiyao-11").after($(rpt.backOneSearchHtml("摘要内容","-11")));
				$(rpt.namespace+" .SHULIANG .thTitle.rpt-th-jine3-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-7")));
				$(rpt.namespace+" .SHULIANG .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-5")));
				$(rpt.namespace+" .SHULIANG .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-1")));
				
				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();
				page.SANLANhtml2 = $("#SANLAN tr").eq(1).html();
				
				page.WAIBIhtml1 = $("#WAIBI tr").eq(0).html();
				page.WAIBIhtml2 = $("#WAIBI tr").eq(1).html();
				
				page.SHULIANGhtml1 = $("#SHULIANG tr").eq(0).html();
				page.SHULIANGhtml2 = $("#SHULIANG tr").eq(1).html();
				
				//需要根据自己页面写的ID修改
				page.glRptJournalTable = $('#glRptJournalTable');//当前table的ID
				page.glRptJournalThead = $('#glRptJournalThead');//当前table的头部ID
				
				//默认三栏式表格
				var tableData = [];
                $('#glRptJournalTable tbody').html('');
                page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
                hideColArray = [3, 4, 6,7];
				page.glRptJournalDataTable = page.newTable(tableData,SANLANColsArr,"SANLAN");
				
                // //初始化单位样式
            	// rpt.initAgencyList();
            	//
            	// //初始化账套样式
            	// rpt.initAcctList();
            	
            	// //请求单位列表
            	// rpt.reqAgencyList();
                //请求左侧单位账套树
                rpt2.atreeData();
                //清空查询方案，并查询
                rpt.showPlan();
                //初始化查询方案
                rpt.initPageNew();
				
				$("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
        			idField:"accItemCode",
        			textField:"accItemName",
        			placeholder:"请选择",
                    readonly: true,
        			onChange:function(sender,data){
						/*
        				data=data.sort(
        						function compareFunction(item1,item2){
        									return item1.accItemName.localeCompare(item2.accItemName,"zh");
        						}
						)
						*/
                        var raun = true;
                        var senderid = sender.attr("id");
                        if($("#" + senderid).getObj().getText() != '请选择') {
                            for (var i = 1; i < 6; i++) {
                                if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
                                    raun = false
                                    ufma.showTip("请勿选择重复科目辅助项", function () {
                                    }, "warning");
                                    $("#" + senderid).getObj().setValue("", "请选择")

                                }
                            }
                            if (raun) {
                                rpt.accHtml(sender, data)
                            }
                        }else{
                            rpt.accHtml(sender, data)
                        }
                        dm.showItemCol();
        			},
        			onComplete:function(sender){
        				
        			}
        		});
                // #6099:查询辅助项数量减少时，结果列仍显示bug
                $('#accList1,#accList2,#accList3,#accList4,#accList5').find(".uf-combox-clear").click(function(e) {
                    var sender = $(this).parents(".accList");
                    var data = $(this).getObj("getItem")
                    var senderid = sender.attr("id");
                    $("#" + senderid).getObj().clear();
                    rpt.accHtml(sender, data)
                    dm.showItemCol();
                });
				
				//请求查询条件其他选项列表
				rpt.reqOptList();
				//打开界面查询科目，科目处显示一条科目
                // rpt.initQueryAcco();
				
				//检查是否是从其他页面联查打开的
				
				function queryJournal(key){
					var arguStr = sessionStorage.getItem(key);
					var tabArgu = JSON.parse(arguStr);
//					var qryItems = tabArgu.prjContent.qryItems;
//					for(var i=0;i<qryItems.length;i++){
//						if($.isNull(qryItems[i].itemType)){
//							qryItems[i].splice(i,1);
//						}
//					}
//					tabArgu.prjContent.qryItems = qryItems;
					console.info(tabArgu);
					//单位账套
					rpt.cbAgency.val(tabArgu.agencyCode);
					setTimeout(function(){
						$("#cbAcct").ufmaCombox2().val(tabArgu.acctCode)
						setTimeout(function(){
							var aa = JSON.stringify(tabArgu.prjContent);
							var prjCont = {data:{prjContent:aa}};
                            rpt.showPrjCont(prjCont);
							// ufma.ajax(portList.getReport,"post",tabArgu,function(result){
							// 	rpt.showPrjCont(prjCont);
							// 	var tableData = result.data.tableData;
							// 	var showLiArr = tabArgu.prjContent.qryItems;
							// 	page.setTable(showLiArr,tableData,SANLANColsArr,"SANLAN");
							// 	if(showLiArr.length>1){
							// 		var twid = 100 + (showLiArr.length-1)*5;
							// 		page.glRptJournalTable.css("width",twid+"%");
							// 		page.glRptJournalDataTable.columns.adjust().draw();
							// 	}
							// 	rpt.journalLoaded = false;
							// });
                            $("#glRptJournal-query").trigger("click");
						},500);
					},500);
				}
				
				
				var isLoaded = setInterval(function(){
					if(rpt.journalLoaded){
						clearInterval(isLoaded);
						var myDataFrom=rpt.GetQueryString("dataFrom");
						if(myDataFrom !=null && myDataFrom.toString().length>1)
						{
							myDataFrom = rpt.GetQueryString("dataFrom");
						}
						if(myDataFrom == "glRptLedger"){
							var key = rpt.journalFormLedger;
							queryJournal(key);
						}else if(myDataFrom == "glRptBal"){
							var key = rpt.journalFormBal;
							queryJournal(key);
						}else if(myDataFrom == "vou"){
							var key = "journalFormVou";
							queryJournal(key);
							$(".rpt-query-btn-cont-date .btn").eq(0).removeClass("btn-primary").addClass("btn-default");
							$(".rpt-query-btn-cont-date .btn").eq(1).addClass("btn-primary").removeClass("btn-default");
							$(".rpt-query-btn-cont-date .btn").eq(2).removeClass("btn-primary").addClass("btn-default");
						}else{
//							console.info("不是从总账、余额表、凭证打开的页面！");
						}
					}
				},100);
				
				// $(window).scroll(function () {
				// 	//设置底部工具栏的显隐
				// 	rpt.showHide("glRptJournalTable");
				// })
				// $(window,page.glRptJournalTable).resize(function(e){
				// 	//设置底部工具栏的显隐
				// 	rpt.showHide("glRptJournalTable");
				// })
                $(window).resize(function () {
                    $("#tool-bar").find(".slider").width($(".rpt-workspace").width()-252);
                    $("#tool-bar").width($(".rpt-workspace").width()-224);
                })
                ufma.parseScroll();
                // 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("glRptJournalPageSize")) ? parseInt(localStorage.getItem("glRptJournalPageSize")) : 20;
			},
			
			onEventListener: function(){
                $(".label-more").on("click", function () {
                    var timeId = setTimeout(function () {
                        clearTimeout(timeId);
                        //金额区间-范围筛选
                        ufma.setBarPos($(window));
                        rpt.twoSearch(page.glRptJournalTable);
                    }, 300)

                })
            	//点选本年、本期、今日
				$(".bida-form-group-date .control-element a").on("click",function () {
					if(!$(this).hasClass("selected")){
						$(this).addClass("selected").siblings("a").removeClass("selected");
					}
                });
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//改变表格样式
				$(rpt.namespace).find(".change-rpt-type,.rpt-table-sub-tip-currency").on("click","i",function(){
					$(this).hide();
					$(this).siblings("select").show();
				});
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change","select",function(){
					var tableData = [];
					$(this).siblings("i").attr("data-type",$(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
                    pageLength= ufma.dtPageLength('#glRptJournalTable');
                    $('#glRptJournalTable_wrapper').ufScrollBar('destroy');
					page.glRptJournalDataTable.clear().destroy();
					page.glRptJournalThead.html('<tr>'+page.WAIBIhtml1+'</tr><tr>'+page.WAIBIhtml2+'</tr>');
					page.glRptJournalDataTable = page.newTable(tableData,WAIBIColsArr,"WAIBI");
				});
				$(rpt.namespace).find(".change-rpt-type").on("change","select",function(){
					//count = 1;
					for(var i=0;i<fixedArr.length;i++){
						fixedArr[i].checked = false;
					}
                    pageLength= ufma.dtPageLength('#glRptJournalTable');
                    $('#glRptJournalTable_wrapper').ufScrollBar('destroy');
					page.glRptJournalDataTable.clear().destroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type",$(this).val());
					if($(this).val() == "SANLAN"){
						page.glRptJournalThead.html('<tr>'+page.SANLANhtml1+'</tr><tr>'+page.SANLANhtml2+'</tr>');
				      	columnsArr = SANLANColsArr;
				      	$(".rpt-table-sub-tip-currency").hide();
				      	
					}else if($(this).val() == "WAIBI"){
						page.glRptJournalThead.html('<tr>'+page.WAIBIhtml1+'</tr><tr>'+page.WAIBIhtml2+'</tr>');
				      	columnsArr = WAIBIColsArr;
				      	$(".rpt-table-sub-tip-currency").show();
				      	
					}else if($(this).val() == "SHULIANG"){
						page.glRptJournalThead.html('<tr>'+page.SHULIANGhtml1+'</tr><tr>'+page.SHULIANGhtml2+'</tr>');
				      	columnsArr = SHULIANGColsArr;
				      	$(".rpt-table-sub-tip-currency").hide();
				      	
					}
					
					page.glRptJournalDataTable = page.newTable(tableData,columnsArr,$(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
				});
				
				
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();
				//展开更多查询
				rpt.queryBoxMore();
				
				//绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date()
                };
                $("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
                rpt.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $(rpt.namespace + " #dateBq").on("click", function() {
                    rpt.dateBenQi("dateStart", "dateEnd");
                });
                $(rpt.namespace + " #dateBn").on("click", function() {
                    rpt.dateBenNian("dateStart", "dateEnd");
                });
                $(rpt.namespace + " #dateJr").on("click", function() {
                    rpt.dateToday("dateStart", "dateEnd");
                });
				
				//单选会计体系
				$(rpt.namespace+" #accaList").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//sessionStorage.clear();
						if(rpt.sessionKeyArr.length>0){
							for(var i=0;i<rpt.sessionKeyArr.length;i++){
								sessionStorage.removeItem(rpt.sessionKeyArr[i]);
							}
						}
						//还原查询条件
                        $(rpt.namespace).find('.rpt-method-list li').css({
                            "border": "1px solid rgba(16,142,233,0.30)",
                            "background": "rgba(16,142,233,0.20)"
                        }).removeClass("isUsed").find("span,b").css("color", "#108EE9");
						rpt.resBackQuery();
						
						$(this).addClass("btn-primary").removeClass("btn-default");
						$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				})
				
				//查选方案列表的触摸效果
				rpt.methodPointer();
				
				//点击查询方案
				rpt.clickMethod();
				
				//使用共享方案
				rpt.useShareMethod();
				
				//删除查询方案
				rpt.deleteMethod();
				
				//打开-保存查询方案模态框
				rpt.openSaveMethodModal()
				
				//确认-保存查询方案
                $('#sureSaveMethod,#saveAs').on('click',function(e){
					if($("#methodName").val().trim()!= ""){
						rpt.reqSavePrj($(e.target).is('#saveAs'));
					}else{
						ufma.showInputHelp('methodName','<span class="error">方案名称不能为空</span>');
						$('#methodName').closest('.form-group').addClass('error');
					}
				});
				
				//输入方案名的提示
				rpt.methodNameTips();
				
				//编辑表格名称
				rpt.editTableTitle();
				
				//编辑金额单位
				rpt.changeMonetaryUnit();
				
				//下拉选择展开隐藏
				rpt.showSelectTree();
				$("#oneAcco").parent().on("click",function(e){
					var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
					rpt.showHideTree(this,"ACCO",radioType);
				});
				
				$(rpt.namespace).on("click",".isShowCol",function(){
					if(!$(this).prop("checked")){
						$(this).parent("label").siblings().find(".isSumCol").removeAttr("checked");
					}
				});
				$(rpt.namespace).on("click",".isSumCol",function(){
					if($(this).prop("checked")){
						$(this).parent("label").siblings().find(".isShowCol").prop("checked",true);
					}
				})
				
				//展开隐藏共享查询方案
				rpt.showHideShareMethod();
		       	
                   //搜索隐藏显示--表格模糊搜索
                ufma.searchHideShow(page.glRptJournalTable);
				// rpt.searchHideShow(page.glRptJournalTable);
				
				//显示更多查询方案
				rpt.showMoreMethod();
				
				//显示/隐藏列隐藏框
				$(rpt.namespace).on("click","#colAction",function(evt){
					evt.stopPropagation();
					$("#colList input").each(function(i){
						$(this).prop("checked",page.changeCol[i].visible);
					})
					
					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})

                //确认添加列
                $(rpt.namespace).find("#addCol").on("click", function(evt) {
                    evt.stopPropagation();
                    $("#colList label").each(function(i) {
                        page.changeCol[i].visible = $(this).find("input").prop("checked");
                        var nn = $(this).find("input").data("index");
                        if (hideColArray.indexOf(nn) >= 0) {
                            hideColArray.remove(nn);
                        }
                        if($(this).find("input").is(":checked")) {
                            page.glRptJournalDataTable.column(nn).visible(true);
                            $(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).addClass("isprint");
                        } else {
                            if (hideColArray.indexOf(nn) == -1) {
                                hideColArray.push(nn);
                            }
                            page.glRptJournalDataTable.column(nn).visible(false);
                            $(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).removeClass("isprint");
                        }
                    });
                    page.glRptJournalDataTable.columns.adjust().draw();
                });
                // 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#glRptJournalTable', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#glRptJournalTable tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.queryTable();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
                });
				//查询明细表
				$("#glRptJournal-query").on("click",function(){
					page.queryTable(true);
				})
				//2019-5-7不知道干嘛用的注释掉了，代码影响界面显示
				// $(".rpt-p-search-key").find("input").on("blur",function(){
				// 	$(this).val("");
				// })
				
				//打印
				$(".btn-print").on("click",function(){
					var printTableType = $(".change-rpt-type i").attr("data-type");
//					console.info(printTableType);
					rpt.rptPrint("glRptJournal","glRptJournalTable",printTableType);
				})
                $(".menuBtn").on("click",function(){
                    rpt2.openTabMenu(this);
                });
                // $(".label-more").on("click",function () {
					// if($(this).find("i").hasClass("icon-angle-bottom")){
                //         $(this).html('收起<i class="glyphicon icon-angle-top"></i>');
                //         $("#queryMore").show();
					// }else {
                //         $(this).html('更多<i class="glyphicon icon-angle-bottom"></i>');
                //         $("#queryMore").hide();
					// }
                //
                // })

			},

            queryTable: function(checkCond) {
                if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                    ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
                    return false;
                }
                $("#glRptJournalTable").html('')
                var arr = [];
                for(var i = 1; i < 6; i++) {
                    var name = $("#accList" + i).getObj().getText();
                    if(name != "请选择" && !$.isNull(name)) {
                        arr.push(name);
                    }
                }
                var nary = arr.sort();
                for(var i = 0; i < nary.length; i++) {
                    if(nary[i] == nary[i + 1]) {
                        ufma.showTip(nary[i] + "重复了!", function() {}, "warning");
                        return false;
                    }
                }
                var nowTabType = $(".change-rpt-type i").attr("data-type");

                var tabArgu = rpt.backTabArgu();
                // 修改为后端分页
                tabArgu.prjContent.currPage = parseInt(serachData.currentPage);
                tabArgu.prjContent.rowNumber = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
                // 查询后记录当前选择的行数信息到缓存
                localStorage.removeItem("glRptJournalPageSize");
                localStorage.setItem("glRptJournalPageSize", tabArgu.prjContent.rowNumber);
                ufma.showloading('正在请求数据，请耐心等待...');
                ufma.ajaxDef(portList.getReportPage, "post", tabArgu, function(result) {
                    ufma.hideloading();
                    var tableData = result.data.tablePageInfo;
                    var showLiArr = rpt.tableColArr();

                    //需要显示的辅助核算项
                    if(nowTabType == "SANLAN") {
                        page.setTable(showLiArr, tableData, SANLANColsArr, "SANLAN");

                        if(showLiArr.length > 1) {
                            var twid = 100 + (showLiArr.length - 1) * 5;
                            //page.glRptJournalTable.css("width",twid+"%");
                            page.glRptJournalDataTable.columns.adjust().draw();
                        }

                    } else if(nowTabType == "WAIBI") {
                        page.setTable(showLiArr, tableData, WAIBIColsArr, "WAIBI");

                        //page.glRptJournalTable.css("width","150%");
                        page.glRptJournalDataTable.columns.adjust().draw();

                    } else if(nowTabType == "SHULIANG") {
                        page.setTable(showLiArr, tableData, SHULIANGColsArr, "SHULIANG");

                        //page.glRptJournalTable.css("width","150%");
                        page.glRptJournalDataTable.columns.adjust().draw();
                    }
                    var year = (new Date($("#dateStart").getObj().getValue())).getFullYear();
                    page.setTheadYear(year);
                });
            },
			
			//修改表头年份
			setTheadYear:function(year){
                $(".tabDateCol").text(year);
                $(".editYear").attr("parent-title", year + "-");
			},
			
			//此方法必须保留
			init:function(){
                //修改表头年份
				page.setTheadYear(pfData.svSetYear);
	       		page.reslist = ufma.getPermission();
                ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	
 /////////////////////
    page.init();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "58px");
        }
    });
    window.addEventListener('message', function (e) {
        if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
                page.isCrossDomain = true;
        } else {
                page.isCrossDomain = false;
        }
    });
});

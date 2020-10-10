$(function () {
    if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
        sessionStorage.removeItem('gl_rpt_glRptChrBook');
    }
    var pageLength = ufma.dtPageLength('#glRptChrTable');
    var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 100,
	};

    var page = function () {

        var glRptChrDataTable; //全局datatable对象
        var glRptChrTable; //全局table的ID
        var glRptChrThead; //全局table的头部ID

        //余额表所用接口
        var portList = {

            prjContent: "/gl/rpt/prj/getPrjcontent", //查询方案内容接口
            getReport: "/gl/rpt/getReportData/GL_RPT_CHRBOOK", //请求表格数据
            getReportPage: "/gl/rpt/getReportDataPage/GL_RPT_CHRBOOK" //请求表格数据-带分页的接口
        };

        var columnsArr = [
            {
                data: "vouDate",
                title: "日期",
                width: "92",
                className: 'isprint nowrap center'
            },
            {
                data: "vouNo",
                title: "凭证号",
                width: "154",
                className: 'isprint nowrap left'
            },
            {
                data: "descpt",
                title: "摘要",
                width: "120",
                className: 'isprint nowrap nolength left'
            },
            {
                data: "drAmt",
                title: "借方金额",
                width: "170",
                className: 'isprint nowrap tdNum right',
                render:function (data, type, rowdata, meta) {
                    if(!data || data == 0 || data == "0.00"){
                        return "";
                    }
                    return '<div class="tr">'+$.formatMoney(data, 2)+'</div>';
                }
            },
            {
                data: "crAmt",
                title: "贷方金额",
                width: "170",
                className: 'isprint nowrap tdNum right',
                render:function (data, type, rowdata, meta) {
                    if(!data || data == 0 || data == "0.00"){
                        return "";
                    }
                    return '<div class="tr">'+$.formatMoney(data, 2)+'</div>';
                }
            },
            {
                data: "billType",
                title: "票据类型",
                width: "120",
                className: 'isprint nowrap',
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            {
                data: "billNo",
                title: "票据号",
                width: "120",
                className: 'isprint nowrap',
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            {
                data: "dAccoName",
                title: "对方科目",
                width: "120",
                className: 'isprint nowrap',
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            // {
            //     data: "accoSurplusName",
            //     title: "差异项",
            //     // width: "160",
            //     className: 'isprint nowrap',
            //     render:function (data, type, rowdata, meta) {
            //         if(!data){
            //             return "";
            //         }
            //         return data;
            //     }
            // }
        ];
        var newDataArr = [];


        return {
            //字符串下滑线转驼峰
            strTransform: function (str) {
                str = str.toLowerCase();
                var re = /_(\w)/g;
                str = str.replace(re, function ($0, $1) {
                    return $1.toUpperCase();
                });
                return str;
            },

            //根据辅助项目形成对应的余额表表格
            changTable: function (tableData) {
                var columnsArr2 = [];
                page.printclumns = []
                var headArr = [
                    {
                        data: "billType",
                        title: "票据类型",
                        width: "120",
                        className: 'isprint nowrap'
                    },
                    {
                        data: "billNo",
                        title: "票据号",
                        width: "120",
                        className: 'isprint nowrap'
                    },
                    {
                        data: "dAccoName",
                        title: "对方科目",
                        width: "120",
                        className: 'isprint nowrap'
                    },
                    // {
                    //     data: "accoSurplus",
                    //     title: "差异项",
                    //     // width: "160",
                    //     className: 'isprint nowrap'
                    // }
                ];
                page.printclumns.push({
                    title: '票据类型',
                    key:'billType'
                })
                page.printclumns.push({
                    title: '票据号',
                    key:'billNo'
                })
                page.printclumns.push({
                    title: '对方科目',
                    key:'dAccoName'
                })
                for (var i = 0; i < rpt.accItems.length; i++) {
                    if(rpt.accItems[i].accItemName && rpt.accItems[i].accItemName != ""){
                        var codeData = page.strTransform(rpt.accItems[i].accItemCode) + "Name";
                        var obj = {
                            data: codeData,
                            title: rpt.accItems[i].accItemName,
                            width: "120",
                            className: 'isprint nowrap',
                            render:function (data, type, rowdata, meta) {
                                if(!data){
                                    return "";
                                }
                                return '<span  title="' + data + '">' + data + '</span>';
                            }
                        };
                        page.printclumns.push({
                            title: rpt.accItems[i].accItemName,
                            key:codeData
                        })
                        columnsArr2.push(obj);
                        headArr.push(obj);
                    }
                }
                page.headArr = headArr;
                var newColumnsArr = columnsArr.concat(columnsArr2);
                page.columnsArr = newColumnsArr;
                pageLength = ufma.dtPageLength('#glRptChrTable');
                $('#glRptChrTable_wrapper').ufScrollBar('destroy');
                page.glRptChrDataTable.clear().destroy();
                $("#glRptChrTable").html("");
                if(!rpt.headSelectedArr){
                    page.setVisibleCol();
                }
                page.combineNewColumns();
                // page.newTable(newColumnsArr, tableData);
                page.newTable(page.columnsArr, tableData);
                // $("#addCol").trigger("click");
                rpt.headSelectedArr = true;
            },
            combineNewColumns:function(){
                page.columnsArr.splice(5);
                $("#colList label").each(function(i) {
                    if($(this).find("input").is(":checked")) {
                        var obj = {
                            data: $(this).find("input").attr("data-code"),
                            title: $(this).attr("title"),
                            width: "120",
                            className: 'isprint nowrap',
                            render:function (data, type, rowdata, meta) {
                                if(!data){
                                    return "";
                                }
                                return '<span  title="' + data + '">' + data + '</span>';
                            }
                        };
                        page.columnsArr.push(obj);
                    }
                });
            },

            //表格初始化
            newTable: function (columnsArr, tableData,widthauto) {
                for (var i = 0; i < columnsArr.length; i++) {
                    if(columnsArr[i].data == "accoName" && columnsArr[i-1].data == "dAccoName") { // 交换"对方科目"和"会计科目"的顺序
                        columnsArr[i] = columnsArr.splice(i-1, 1, columnsArr[i])[0];
                    }
                }
                var id = "glRptChrTable"; //表格id
                var toolBar = $('#' + id).attr('tool-bar');
                page.glRptChrDataTable = page.glRptChrTable.DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": tableData.list,
                    "processing": true, //显示正在加载中
                    // "pagingType": "full_numbers", //分页样式
                    // "lengthChange": true, //是否允许用户自定义显示数量p
                    "autoWidth": false,
                    bAutoWidth: false,
                    // "autoWidth": widthauto === undefined? false:true,
                    // bAutoWidth: widthauto === undefined? false:true,  // 只有点击添加列的时候是自动获取宽度
                    // "lengthMenu": [
                    //     [20, 50, 100, 200, 100000],
                    //     [20, 50, 100, 200, "全部"]
                    // ],
                    // "pageLength": pageLength,
                    "paging": false,
                    "ordering": false,
                    "columns": columnsArr,
                    "columnDefs": [
                    	{
                            "targets": [1], //凭证号
                            // "className": "isprint",
                            "render": function(data, type, full, meta) {
                                if(data != null) {
                                    if(full.vouGuid != null) {
                                        return '<span class="turn-vou" title="'+ data +'" data-deguid="' + full.detailGuid + '" data-desguid="' + full.detailAssGuid + '"  data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            }
                    	}

                    ],
                    "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
                    //"dom": '<"printButtons"B>r<"tableBox"t><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"barBox"<"bar">><"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
                    buttons: [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint',
                            format: {
								header: function(data, columnIdx) {
									if($(data).length == 0) {
										return data;
									} else {
										return $(data)[0].innerHTML;
									}
								}
                            }
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
                                columns: '.isprint',
                                format: {
									header: function(data, columnIdx) {
										if($(data).length == 0) {
											return data;
										} else {
											return $(data)[0].innerHTML;
										}
									}
                                }
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function () {

                        $("#printTableData").html("");
                        $("#printTableData").append($(".printButtons"));

                        $("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        }).removeAttr("href");
                        $("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });
                        //使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
 						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							$("div#printTableBox").show();
                        });
                        $("div#printTableBox").hover(function() {
							$("div#printTableBox").show();
						}, function() {
							$("div#printTableBox").hide();
						});
						// 导出本页
						$("#printTablePage").off().on('click', function(evt) {
                            evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title:'序时账',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName],
									['账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName],
                                    ['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()],
                                    ['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});							
							//ufma.expXLSForDatatable($('#' + id), '序时账');
						});
						// 导出全部
						$("#printTableAll").off().on('click', function(evt) {
                            ufma.showloading('正在导出数据，请耐心等待...');
                            page.queryTable(true, function(tableData) { // 导出全部时要先查一次全部数据再请求导出接口
                                if(tableData.length == 0){
                                    ufma.showTip("没有数据需要导出");
                                    ufma.hideloading();
                                    return;
                                } else {
                                    tableData.list[0].dw = '单位：' + rpt.nowAgencyCode+' '+rpt.nowAgencyName + ' （账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）';
                                    tableData.list[0].qj = '期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue() + " （单位：元）";
                                    tableData.list[0].prjName = '方案名称：' + $("#nowPrjName").html();
                                }
                                var tabArgu = rpt.backTabArgu();
                                tabArgu.prjContent.rptOption = [];
                                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                                    tabArgu.prjContent.accaCode = conditions.accaCode;
                                    tabArgu.prjContent.qryItems = conditions.qryItems;
                                    tabArgu.prjContent.rptCondItem = conditions.rptCondItem;
                                    tabArgu.prjContent.rptOption = conditions.rptOption;
                                    tabArgu.prjContent.accoSurplus = conditions.accoSurplus;
                                    tabArgu.prjContent.billNo = conditions.billNo;
                                    tabArgu.prjContent.billType = conditions.billType;
                                    tabArgu.prjContent.endDate = conditions.endDate;
                                    tabArgu.prjContent.startDate = conditions.startDate;
                                    tabArgu.prjContent.descpt = conditions.descpt;
                                    tabArgu.prjContent.drCr = conditions.drCr;
                                    tabArgu.prjContent.inputorName = conditions.inputorName;
                                    tabArgu.prjContent.printCount = conditions.printCount;
                                    tabArgu.prjContent.vouSource = conditions.vouSource;
                                    var obj1 = {
                                        condCode: "dStadAmtFrom",
                                        condName: "分录金额起",
                                        condText: conditions.dStadAmtFrom,
                                        condValue: conditions.dStadAmtFrom
                                    }
                                    tabArgu.prjContent.rptCondItem.push(obj1);
                                    var obj2 = {
                                        condCode: "dStadAmtTo",
                                        condName: "分录金额止",
                                        condText: conditions.dStadAmtTo,
                                        condValue: conditions.dStadAmtTo
                                    }
                                    tabArgu.prjContent.rptCondItem.push(obj2);
                                    var obj3 = {
                                        condCode: "fzStadAmtFrom",
                                        condName: "辅助分录金额起",
                                        condText: conditions.fzStadAmtFrom,
                                        condValue: conditions.fzStadAmtFrom
                                    }
                                    tabArgu.prjContent.rptCondItem.push(obj3);
                                    var obj4 = {
                                        condCode: "fzStadAmtTo",
                                        condName: "辅助分录金额止",
                                        condText: conditions.fzStadAmtTo,
                                        condValue: conditions.fzStadAmtTo
                                    }
                                    tabArgu.prjContent.rptCondItem.push(obj4);
                                }else{
                                    for(var i = 0;i<rpt.accItems.length;i++){
                                        var obj = {
                                            isGradsum: "0",
                                            isShowItem: "1",
                                            itemDir: "",
                                            itemLevel: "-1",
                                            itemPos: "condition",
                                            itemType: rpt.accItems[i].accItemCode,
                                            itemTypeName: rpt.accItems[i].accItemName,
                                            items: [],
                                            seq: i+1
                                        }
                                        tabArgu.prjContent.qryItems.push(obj);
                                    }
                                    // 以下是添加对方科目的代码
                                    // itemType这个字段在后台会先变成小写然后再加上Name 最后出来的是 daccoName
                                    // 所以表格数据里面的这个字段也要转换成这样 ，否则导出来是空值。
                                    tabArgu.prjContent.qryItems.splice(2,0,
                                        {
                                            isGradsum: "0",
                                            isShowItem: "1",
                                            itemDir: "",
                                            itemLevel: "-1",
                                            itemPos: "condition",
                                            itemType: "dacco",
                                            itemTypeName: "对方科目",  // dAccoName
                                            items: [],
                                            seq: 0
                                        }
                                    )
                                }
                                var list = tableData.list.map(function(item,index){
                                    item.daccoName = item.dAccoName
                                    return item
                                })
                                // 以上是添加对方科目的代码
                                var datas =	[
                                    {
                                        "GL_RPT_PRINT": list
                                    }
                                ];
                                var argu = {
                                    qryItems: tabArgu.prjContent.qryItems,
                                    exportData: datas,
                                    rptTypeName: '序时账',
                                    rptType: 'glRptChrBook'
                                }
                                var url = "/pub/file/batchExport";
                                ufma.post(url,argu,function(rst){
                                    if(rst.flag == 'success'){
                                        window.location.href = "/pub/file/download?attachGuid=" + rst.data.attachGuid + '&fileName=' + decodeURI(rst.data.fileName);
                                    }else{
                                        ufma.showTip("导出失败",function(){},'fail');
                                    }
                                    ufma.hideloading();
                                });
                            });
						});

                        // $("#printTableData .buttons-excel").off().on('click', function (evt) {
                        //     evt = evt || window.event;
                        //     evt.preventDefault();
                        //     ufma.expXLSForDatatable($('#' + id), '序时账');
                        // });
						//导出end	                       
                        $('#printTableData.btn-group').css("position", "inherit");
                        $('#printTableData div.dt-buttons').css("position", "inherit");
                        $('#printTableData [data-toggle="tooltip"]').tooltip();

                        ufma.isShow(page.reslist);
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);
                        $(".btn-print").off().on('click', function () {
                            page.editor = ufma.showModal('tableprint', 450, 350);
                            var postSetData = {
                                agencyCode: rpt.nowAgencyCode,
                                acctCode: rpt.nowAcctCode,
                                componentId: $('#rptType option:selected').val(),
                                rgCode: pfData.svRgCode,
                                setYear: pfData.svSetYear,
                                sys: '100',
                                directory: '序时账'
                            };
                            $.ajax({
                                type: "POST",
                                url: "/pqr/api/templ",
                                dataType: "json",
                                data: postSetData,
                                success: function (data) {
                                    var data = data.data;
                                    $('#rptTemplate').html('')
                                    for (var i = 0; i < data.length; i++) {
                                        var jData = data[i].reportCode
                                        $op = $('<option templId = ' + data[0].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
                                        $('#rptTemplate').append($op);
                                    }
                                },
                                error: function () { }
                            });
                        });
                        $("#btn-printyun").off().on("click", function () {
							var postSetData = {
								reportCode:'GL_RPT_CHRBOOK',
								templId:'*'
							}
							$.ajax({
								type: "POST",
								url: "/pqr/api/iprint/templbycode",
								dataType: "json",
								data: postSetData,
								success: function(data) {
									var printcode= data.data.printCode
									var medata = JSON.parse(data.data.tempContent) 
									var tabArgu = rpt.backTabArgu();
									tabArgu.accaCode = rpt.nowAccaCode;
									tabArgu.prjContent.pageLength =data.data.rowNum
									var runNum = data.data.rowNum
									ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_BAL', "post", tabArgu, function (result) {
										var outTableData = {}
										outTableData.agency=rpt.nowAgencyCode+' '+rpt.nowAgencyName
										outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
										outTableData.acco = $('input[id="ACCO-data-key"]').val()
										outTableData.printor = rpt.nowUserName
										outTableData.startPage = 1
										outTableData.showWatermark = true
										outTableData.date = rpt.today
										outTableData.title = '余额表'
										var pagelen = result.data.tableData.length
										outTableData.totalPage= Math.ceil(pagelen/runNum)
										result.data.outTableData = outTableData
										result.data.tableHead = {"drColumns":page.getcloumsData()}
										var names = medata.template
										// var  tempdata = YYPrint.register({ names });
										// result.data.tableHead.columns =result.data.tableHead.crcolumns
										var html = YYPrint.engine(medata.template,medata.meta, result.data);
										YYPrint.print(html)
									})
								},
								error: function() {}
							});
						})
                        //驻底end
                        // page.headerArr = rpt.tableHeader(id);
                        //固定表头
                        $("#glRptChrTable").fixedTableHead();
                         
						// 点击表格行高亮
                        rpt.tableTrHighlight();
                        // 此处添加滚动条
                    	$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        $(window).resize();
                    },
                    "drawCallback": function (settings) {
						ufma.dtPageLength($(this));
                        
                        $("#" + id).find("tbody tr").each(function () {
                            var rowData = page.glRptChrDataTable.row($(this)).data();
                            if (!$.isNull(rowData)) {
                                if (rowData.rowType == "3" || rowData.rowType == "9") {
                                    $(this).css({
                                        "background-color": "#f0f0f0"
                                    })
                                }
                            }
                        })
                        ufma.isShow(page.reslist);
                        page.glRptChrTable.find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //$(".tableBox").css({"overflow-x":"auto","width":"100%"});
                        // var twidth = 20*columnsArr.length;
                        // $("#"+id).css("width",twidth+"%");

                        if ($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
                            $("td.tdNum").each(function () {
                                if ($(this).text() != "") {
                                    var num = $(this).text().replace(/\,/g, "");
                                    $(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
                                }
                                $(this).addClass("wanyuan");
                            })
                        }

                        //搜索隐藏显示--表格模糊搜索
                        // rpt.searchHideShow(page.glRptChrTable);
                        ufma.searchHideShow(page.glRptChrTable);

                        //金额区间-范围筛选
                        rpt.twoSearch(page.glRptChrTable);

                        //显示/隐藏筛选框
                        rpt.isShowFunnelBox();
                        //弹出详细凭证
                        $('#glRptChrTable').find("td span.turn-vou").on("click", function() {
                            // rpt.openVouShow(this, "glRptChrBook");
                            var guid = $(this).attr('data-vouguid')
                            var deguid = $(this).attr('data-deguid')
                            var desguid = $(this).attr('data-desguid')
                            var baseUrl = '/pf/gl/vou/index.html?menuid=' + rpt.vouMenuId + '&dataFrom=glRptChrBook&action=query';
                            baseUrl = baseUrl  + '&vouGuid=' + guid +'&deguid=' + deguid +'&desguid=' + desguid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode
                            if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
                                baseUrl = baseUrl + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
                            }
                            ufma.removeCache("cacheData");
                            var cacheData = {};
                            cacheData.agencyCode = rpt.nowAgencyCode;
                            cacheData.acctCode = rpt.nowAcctCode;
                            cacheData.startVouDate = $('#dateStart').getObj().getValue();
                            cacheData.endVouDate = $('#dateEnd').getObj().getValue();
                            ufma.setObjectCache("cacheData", cacheData);
                            uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
                        })

                    	$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        // 列宽可拖拽
						$('#glRptChrTable').tblcolResizable();
                        $("#glRptChrTable").fixedTableHead();
                        
                        // 修改为后端分页
						$("#glRptChrBook .ufma-table-paginate").empty();
                        if(!$.isNull(tableData)){
                            var paging = tableData;
                            uf.backendPaging(paging,"glRptChrBook",serachData);
						}
                    }
                });
                return page.glRptChrDataTable;
            },
            //设置隐藏列盒子内容
            setVisibleCol: function () {
                var nowHead = page.headArr;
                if (!nowHead) {
                    return false;
                }
                var changeHead = [];
                var html = "";
                for (var i = 0; i < nowHead.length; i++) {
                    changeHead.push(nowHead[i]);
                    var h = ufma.htmFormat('<p><label class="mt-checkbox mt-checkbox-outline" title="<%=title%>">' +
                        '<input type="checkbox" checked data-code="<%=code%>" data-index="<%=index%>"><%=title%>' +
                        '<span></span>' +
                        '</label></p>', {
                        title: (nowHead[i].title=="")? nowHead[i].data:nowHead[i].title,
                        index: i,
                        code: nowHead[i].data
                    });
                    html += h;
                }
                $("#colList").html(html);
                page.changeCol = changeHead;
            },
            //增加筛选框
            addFunnelBox: function () {
                $(rpt.namespace).find(".thTitle.rpt-th-jine-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-7")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-6")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-5")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-2")));
                $(rpt.namespace).find(".thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));
            },

            //******初始化页面******************************************************
            initPage: function () {
                //增加筛选框
                page.addFunnelBox();

                page.glRptChrTable = $('#glRptChrTable'); //当前table的ID
                // page.glRptChrThead = $('#glRptChrThead'); //当前table的头部ID

                newDataArr = [{
                    data: "accoCode",
                    className: "isprint",
                    width: "200"
                }, //会计科目代码
                    {
                        data: "accoName",
                        className: "isprint",
                        width: "200"
                    } //会计科目名称
                ];
                var tableData = [];
                page.headArr = [
                    {
                        data: "billType",
                        title: "票据类型",
                        width: "160",
                        className: 'isprint nowrap'
                    },
                    {
                        data: "billNo",
                        title: "票据号",
                        width: "160",
                        className: 'isprint nowrap'
                    },
                    {
                        data: "dAccoName",
                        title: "对方科目",
                        width: "160",
                        className: 'isprint nowrap'
                    },
                    // {
                    //     data: "accoSurplus",
                    //     title: "差异项",
                    //     width: "160",
                    //     className: 'isprint nowrap'
                    // }
                ];
                page.glRptChrDataTable = page.newTable(columnsArr, tableData);
                page.setVisibleCol();
                //				page.glRptChrDataTable.columns.adjust().draw();
                ufma.isShow(page.reslist);
                //初始化单位样式
                rpt.initAgencyList();
                //初始化账套样式
                rpt.initAcctList();

                $("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
                    idField: "accItemCode",
                    textField: "accItemName",
                    placeholder: "请选择",
                    onChange: function (sender, data) {
                        var raun = true;
                        var senderid = sender.attr("id")
                        if ($("#" + senderid).getObj().getText() != '请选择') {
                            for (var i = 1; i < 6; i++) {
                                if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
                                    raun = false
                                    ufma.showTip("请勿选择重复辅助项", function () {
                                    }, "warning");
                                    $("#" + senderid).getObj().setValue("", "请选择")
                                }
                            }
                            if (raun) {
                                rpt.accHtml(sender, data)
                            }
                        } else {
                            rpt.accHtml(sender, data)
                        }
                    },
                    onComplete: function (sender) {

                    }
                });

                //请求单位列表
                rpt.reqAgencyList();

                //请求查询条件其他选项列表
                rpt.reqOptList();

                // 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("glRptChrTablePageSize")) ? parseInt(localStorage.getItem("glRptChrTablePageSize")) : 100;

            },

            onEventListener: function () {
                $('#glRptChrTable').on('length.dt', function ( e, settings, len ) {
                    pageLength = len;
                    $("#searchTableData").trigger("click");
                });
                //方案作用域单选
                rpt.raidoInputGroup("rpt-radio-span");

                //期间单选按钮组
                rpt.raidoBtnGroup("rpt-query-btn-cont-date");

                //选择树形展示的radio组
                rpt.raidoTreeShow();

                //按钮提示
                rpt.tooltip();

                //绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        rpt.checkDate(fmtDate, "#dateStart")
                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        rpt.checkDate(fmtDate, "#dateEnd")
                    }
                };
                $("#dateStart").ufDatepicker(glRptLedgerDate);
                $("#dateEnd").ufDatepicker(glRptLedgerEndDate);
                rpt.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $(rpt.namespace + " #dateBq").on("click", function () {
                    rpt.dateBenQi("dateStart", "dateEnd");
                    if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                        var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                        conditions.startDate = $("#dateStart").getObj().getValue();
                        conditions.endDate = $("#dateEnd").getObj().getValue();
                        sessionStorage.setItem('gl_rpt_glRptChrBook',JSON.stringify(conditions));
                    }
                });
                $(rpt.namespace + " #dateBn").on("click", function () {
                    rpt.dateBenNian("dateStart", "dateEnd");
                    if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                        var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                        conditions.startDate = $("#dateStart").getObj().getValue();
                        conditions.endDate = $("#dateEnd").getObj().getValue();
                        sessionStorage.setItem('gl_rpt_glRptChrBook',JSON.stringify(conditions));
                    }
                });
                $(rpt.namespace + " #dateJr").on("click", function () {
                    rpt.dateToday("dateStart", "dateEnd");
                    if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                        var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                        conditions.startDate = $("#dateStart").getObj().getValue();
                        conditions.endDate = $("#dateEnd").getObj().getValue();
                        sessionStorage.setItem('gl_rpt_glRptChrBook',JSON.stringify(conditions));
                    }
                });

                //单选会计体系
                $(rpt.namespace + " #accaList").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        if (rpt.sessionKeyArr.length > 0) {
                            for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
                                sessionStorage.removeItem(rpt.sessionKeyArr[i]);
                            }
                        }
                        //还原查询条件
                        $(rpt.namespace).find('.rpt-method-list li').css({
                            "border": "1px solid #D9D9D9"
                        }).removeClass("isUsed");
                        rpt.resBackQuery();

                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
                    }
                })

                //打开-保存查询方案模态框
                rpt.openSaveMethodModal();

                //确认-保存查询方案
                $('#sureSaveMethod,#saveAs').on('click', function (e) {
                    if ($("#methodName").val().trim() != "") {
                        rpt.reqSavePrj($(e.target).is('#saveAs'));
                    } else {
                        ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
                        $('#methodName').closest('.form-group').addClass('error');
                    }
                });

                //输入方案名的提示
                rpt.methodNameTips();

                //编辑表格名称
                rpt.editTableTitle();

                //编辑金额单位
                rpt.changeMonetaryUnit();

                $(rpt.namespace).on("click", ".isShowCol", function () {
                    if (!$(this).prop("checked")) {
                        $(this).parent("label").siblings().find(".isSumCol").removeAttr("checked");
                    }
                });
                $(rpt.namespace).on("click", ".isSumCol", function () {
                    if ($(this).prop("checked")) {
                        $(this).parent("label").siblings().find(".isShowCol").prop("checked", true);
                    }
                })

                // 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#glRptChrTable', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#glRptChrTable tbody").html('');
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
						$("#glRptChrTable tbody").html('');
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
						$("#glRptChrTable tbody").html('');
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
						$("#glRptChrTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});
                //点击查询按钮，改变表格信息
                $(rpt.namespace).find("#searchTableData").on("click", function () {
					if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}                	
                    var arr = [];
                    for (var i = 1; i < 6; i++) {
                        var name = $("#accList" + i).getObj().getText();
                        if (name != "请选择" && !$.isNull(name)) {
                            arr.push(name);
                        }
                    }
                    var nary = arr.sort();
                    for (var i = 0; i < nary.length; i++) {
                        if (nary[i] == nary[i + 1]) {
                            ufma.showTip(nary[i] + "重复了!", function () {
                            }, "warning");
                            return false;
                        }
                    }
                    page.queryTable();
                });
                $("#more-setting").on("click", function () {
                    var opendata = {
                        agencyCode: rpt.nowAgencyCode,
                        acctCode: rpt.nowAcctCode,
                        isParallelsum: rpt.isParallelsum,
                        isDoubleVousum: rpt.isDoubleVousum,
                        accItems: rpt.accItems || [],
                        period: $("a[class='label label-radio selected']").attr("id"),
                        dateStart: $("#dateStart").getObj().getValue(),
                        dateEnd: $("#dateEnd").getObj().getValue(),
                        accoDatas: rpt.accoDatas || []
                    };
                    ufma.open({
                        url: "setMoreConditions.html",
                        title: "查询条件",
                        width: 900,
                        height: 500,
                        data: opendata,
                        ondestory: function (e) {
                            if (e.action) {
                                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                                    $("#dateStart").getObj().setValue(new Date(conditions.startDate));
                                    $("#dateEnd").getObj().setValue(new Date(conditions.endDate));
                                    $("a[id='" + conditions.period + "']").addClass("selected").siblings("a").removeClass("selected")
                                }
                                $("#searchTableData").trigger("click");
                            }
                        }
                    });
                })
                //显示/隐藏列隐藏框
                $(rpt.namespace).on("click", "#colAction", function (evt) {
                    evt.stopPropagation();
                    $("#colList input").each(function (i) {
                        $(this).prop("checked", page.changeCol[i].visible);
                    });

                    $("div.rpt-funnelBox").hide();
                    $(this).next("div.rpt-funnelBox").show();
                    
                    if ($("#colList input").length == $('#colList input:checked').length) {
                        $('#columnSelectAll').prop('checked', true);
                   } else {
                        $('#columnSelectAll').prop('checked', false);
                   }
                });
                // 全选点击
                $(rpt.namespace).on('click',"#columnSelectAll", function () {
                    if ($(this).prop('checked') === true) {
                        $("#colList input").each(function (i) {
                            $(this).prop("checked", true);
                        });
                    } else {
                        $("#colList input").each(function (i) {
                            $(this).prop("checked", false);
                        });
                    }
                })
                // 单个选择框选择时 判断全选
                $(rpt.namespace).on('click',"#colList input", function () {
                    if ($("#colList input").length == $('#colList input:checked').length) {
                        $('#columnSelectAll').prop('checked', true);
                   } else {
                        $('#columnSelectAll').prop('checked', false);
                   }
                })
                //确认添加列
                $(rpt.namespace).find("#addCol").on("click", function(evt) {
                    evt.stopPropagation();
                    page.combineNewColumns();
                    pageLength = ufma.dtPageLength('#glRptChrTable');
                    $('#glRptChrTable_wrapper').ufScrollBar('destroy');
                    page.glRptChrDataTable.clear().destroy();
                    $("#glRptChrTable").html("");
                    page.newTable(page.columnsArr,page.tableData,true);

                    // $("#glRptChrBook").scrollTop(Math.ceil(100* Math.random()));

                    // console.log($('.uf-sc-content').outerWidth(true))
                    // $('#glRptChrTable').tblcolResizable();
                    //setTimeout(function(){
                        // $('#glRptChrTable_wrapper').ufScrollBar('destroy');
                        // $('#glRptChrTable_wrapper').ufScrollBar({
                        //     hScrollbar: true,
                        //     mousewheel: false
                        // });
                        // $("#glRptChrTable").fixedTableHead();
                        // page.queryTable();
                    //},500)


                    // $('#glRptChrTable').tblcolResizable();
                    // $("#glRptChrTable").fixedTableHead(); update
                    // page.queryTable();
                });
                $("#btn-tableprintsave").off().on('click', function () {
					var xhr = new XMLHttpRequest()
					var formData = new FormData()
					formData.append('reportCode', $('#rptTemplate option:selected').attr('valueid'))
					formData.append('templId',$('#rptTemplate option:selected').attr('templId'))
					var printtabledata=JSON.parse(JSON.stringify(page.tableData.list))
					var tablePrintHead={}
					for(var i=5;i<page.columnsArr.length;i++){
                        tablePrintHead['ext'+(i-4)+'Name'] = page.columnsArr[i].title
                        for(var j=0;j<printtabledata.length;j++){
                            if($.isNull(printtabledata[j][page.columnsArr[i].data])){
                                printtabledata[j]['accItemExt'+(i-4)] = ''
                            }else{
                                printtabledata[j]['accItemExt'+(i-4)] = printtabledata[j][page.columnsArr[i].data]
                            }
                        }
					}
					var datas = [{
						"GL_RPT_PRINT":printtabledata,
						'GL_RPT_HEAD_EXT': [tablePrintHead]
					}]
					formData.append('groupDef', JSON.stringify(datas))
					xhr.open('POST', '/pqr/api/printpdfbydata', true)
					xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
					xhr.responseType = 'blob'

					//保存文件
					xhr.onload = function(e) {
						if(xhr.status === 200) {
							if(xhr.status === 200) {
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
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
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								//提示框，各系统自行选择插件
								alert(content)
								ufma.hideloading();
							}
						}
					}
					xhr.send(formData)
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})
            },
            queryTable: function (flag, callback) {
                var tabArgu = rpt.backTabArgu();
                tabArgu.prjContent.rptOption = [];
                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                    tabArgu.prjContent.accaCode = conditions.accaCode;
                    tabArgu.prjContent.qryItems = conditions.qryItems;
                    tabArgu.prjContent.rptCondItem = conditions.rptCondItem;
                    tabArgu.prjContent.rptOption = conditions.rptOption;
                    tabArgu.prjContent.accoSurplus = conditions.accoSurplus;
                    tabArgu.prjContent.billNo = conditions.billNo;
                    tabArgu.prjContent.billType = conditions.billType;
                    tabArgu.prjContent.endDate = conditions.endDate;
                    tabArgu.prjContent.startDate = conditions.startDate;
                    tabArgu.prjContent.descpt = conditions.descpt;
                    tabArgu.prjContent.drCr = conditions.drCr;
                    tabArgu.prjContent.inputorName = conditions.inputorName;
                    tabArgu.prjContent.printCount = conditions.printCount;
                    tabArgu.prjContent.vouSource = conditions.vouSource;
                    var obj1 = {
                        condCode: "dStadAmtFrom",
                        condName: "分录金额起",
                        condText: conditions.dStadAmtFrom,
                        condValue: conditions.dStadAmtFrom
                    }
                    tabArgu.prjContent.rptCondItem.push(obj1);
                    var obj2 = {
                        condCode: "dStadAmtTo",
                        condName: "分录金额止",
                        condText: conditions.dStadAmtTo,
                        condValue: conditions.dStadAmtTo
                    }
                    tabArgu.prjContent.rptCondItem.push(obj2);
                    var obj3 = {
                        condCode: "fzStadAmtFrom",
                        condName: "辅助分录金额起",
                        condText: conditions.fzStadAmtFrom,
                        condValue: conditions.fzStadAmtFrom
                    }
                    tabArgu.prjContent.rptCondItem.push(obj3);
                    var obj4 = {
                        condCode: "fzStadAmtTo",
                        condName: "辅助分录金额止",
                        condText: conditions.fzStadAmtTo,
                        condValue: conditions.fzStadAmtTo
                    }
                    tabArgu.prjContent.rptCondItem.push(obj4);
                }else{
                    if (rpt.accItems && rpt.accItems.length) {
                        for(var i = 0;i<rpt.accItems.length;i++){
                            var obj = {
                                isGradsum: "0",
                                isShowItem: "1",
                                itemDir: "",
                                itemLevel: "-1",
                                itemPos: "condition",
                                itemType: rpt.accItems[i].accItemCode,
                                itemTypeName: rpt.accItems[i].accItemName,
                                items: [],
                                seq: i+1
                            }
                            tabArgu.prjContent.qryItems.push(obj);
                        }
                    }
                }
                var obj = {
                    defCompoValue:"Y",
                    optCode:"IS_INCLUDE_UNPOST",
                    optName:"含未记账凭证"
                };
                var obj1 = {
                    defCompoValue: "Y",
                    optCode: "IS_INCLUDE_YJ",
                    optName: "含月结凭证",
                };
                var obj2 = {
                    defCompoValue: "Y",
                    optCode: "IS_INCLUDE_NJ",
                    optName: "含年结凭证",
                };
                tabArgu.prjContent.rptOption.push(obj);
                tabArgu.prjContent.rptOption.push(obj1);
                tabArgu.prjContent.rptOption.push(obj2);
                tabArgu.prjContent.pageLength = pageLength;
                // 修改为后端分页
                tabArgu.prjContent.currPage = parseInt(serachData.currentPage);
                if (flag) {
                    tabArgu.prjContent.rowNumber = 99999999; // 查全部
                } else {
                    tabArgu.prjContent.rowNumber = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
                }
                // 查询后记录当前选择的行数信息到缓存
                localStorage.removeItem("glRptChrTablePageSize");
                localStorage.setItem("glRptChrTablePageSize", tabArgu.prjContent.rowNumber);

                ufma.showloading('正在加载数据，请耐心等待...');
                
                // 查询时，修改方案的查询次数
				rpt.addQryCount(tabArgu.prjGuid);
                // 重新查询方案列表
				rpt.reqPrjList();

                ufma.ajax(portList.getReportPage, "post", tabArgu, function (result) {
                    if (flag) { // 不刷新表格 只取结果
						callback(result.data.tablePageInfo);
					} else {
                        ufma.hideloading();
                        var tableData = result.data.tablePageInfo;
                        page.tableData = tableData;
                        // var showLiArr = rpt.tableColArr();
                        page.changTable(tableData);
                        // page.glRptChrDataTable = page.newTable(columnsArr, tableData);
                    }
                });

            },
			// 重新计算表格宽度度 表内横向滚动
			resetTableWidth: function () {
				// 表内滚动
				// var windowHeight = $(window).height();
				// var top = $('.rpt-table-tab').offset().top;
				// $('.rpt-table-tab').css("height", windowHeight - top - 3 - 56 - 5);
				// $('.rpt-table-tab').css("overflow","auto");
				// $('#glRptJournalTable_wrapper').ufScrollBar({
				// 	hScrollbar: true,
				// 	mousewheel: false
				// });
				// $('#glRptJournalTable').tblcolResizable();
				// $("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
				// ufma.setBarPos($(window));
			},

            //重构
            initPageNew: function () {
            	$('.rpt-method-tip').tooltip();
                $('#showMethodTip').click(function () {
                    if ($("#rptPlanList").find('li').length == 0) {
                        $("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
                    }
                    ;
                });

                $('#showMethodTip').ufTooltip({
                    className: 'p0',
                    trigger: 'click', //click|hover
                    opacity: 1,
                    confirm: false,
                    gravity: 'north', //north|south|west|east
                    content: "#rptPlanList"
                });
            },
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                this.onEventListener();
                this.initPage();
                this.initPageNew();
                ufma.parse();
                ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
            }
        }
    }();

    /////////////////////
    page.init();
});
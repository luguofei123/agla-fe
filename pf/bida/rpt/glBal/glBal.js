 $(function(){
    var pageLength= ufma.dtPageLength('#glRptBalTable');
	var page = function(){
		
		var glRptBalDataTable;//全局datatable对象
		var glRptBalTable;//全局table的ID
        var glRptBalThead;//全局table的头部ID
        var isCrossDomain = false;
		
		//余额表所用接口
    //    rpt.urlPath = "http://127.0.0.1:8083";//本地调试
         rpt.urlPath = "";//服务器
		var portList = {
			
			prjContent:rpt.urlPath+"/gl/rpt/prj/getPrjcontent",//查询方案内容接口
			getReport:rpt.urlPath+"/gl/rpt/getReportData/GL_RPT_BAL"//请求表格数据
		};

        var dataArr = [
            {
                data: "rowType"
            }, //-9行类型 	只有当rowType=1时，才允许联查
            {
                data: "begDrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //期初借方
            {
                data: "begCrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //期初贷方
            {
                data: "cDrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //本期借方
            {
                data: "cCrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //本期贷方
            {
                data: "totalDrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //累计借方
            {
                data: "totalCrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //累计贷方
            {
                data: "endDrAmt",
                width: "160",
                className:'isprint nowrap tr'
            }, //期末借方
            {
                data: "endCrAmt",
                width: "160",
                className:'isprint nowrap tr'
            } //期末贷方
        ];
		var newDataArr = [];

        //左侧树高度
        // var h = $(window).height();
        // $(".rpt-acc-box-left").height(h - 38);
        // var H = $(".workspace").height() - 64;
        // $(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 54 - 64);
		return{
			
	  		
			//根据辅助项目形成对应的余额表表格
			changTable:function(liArr,tableData){
				rpt.isSetAcc = true;
				var tr1 = "";
				var tr2 = "";

		    	newDataArr = [];
                if($('#showColSet td[data-code="ACCO"] input:checked').length==0){
                    tr1='<th rowspan=2></th>';
                    newDataArr.push({
                        title: '会计体系',
                        data: 'accaCode',
                        width: 80,
                        className:'tc',
                        render:function(data, type, rowdata, meta){
                            return data=='1'?'财':'预';
                        }
                    });
                }
				for(var i=0;i<liArr.length;i++){
					var dataObj = {};
					dataObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Code";
					dataObj.className = "isprint";
					newDataArr.push(dataObj);
					dataObj = {};
					dataObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Name";
					dataObj.className = "isprint";
					newDataArr.push(dataObj);
					
					var tempTr1 = ufma.htmFormat('<th colspan="2"><%=name%></th>',{name:liArr[i].itemTypeName});
					tr1 += tempTr1;
					var tempTr2 = ufma.htmFormat('<th><%=name%>编码</th><th><%=name%>名称</th>',{name:liArr[i].itemTypeName});
					tr2 += tempTr2;
				}
				
				var thLen = page.glRptBalThead.find("tr").eq(1).find("th").length;
				var allThStr = "";
				for(var i=thLen-1;i>=thLen-8;i--){
					var thDom = page.glRptBalThead.find("tr").eq(1).find("th").eq(i);
					var pTitle = thDom.attr("parent-title");
					var thStr ='<th  parent-title="'+pTitle+'">'+thDom.html()+'</th>';
					allThStr = thStr + allThStr;
				}
				
				var fixedHtml1 = '<th rowspan="2">行类型</th><th colspan="2">期初余额</th><th colspan="2">本期发生额</th><th colspan="2">累计发生额</th><th colspan="2">期末余额</th>';
		    	var theadHtml = '<tr>'+tr1+fixedHtml1+'</tr><tr>'+tr2+allThStr+'</tr>';
				
		    	var thisDataArr = newDataArr.concat(dataArr);
		    	pageLength= ufma.dtPageLength('#glRptBalTable');
//		    	console.info(JSON.stringify(thisDataArr));
                $('#glRptBalTable_wrapper').ufScrollBar('destroy');
				page.glRptBalDataTable.clear().destroy();
				page.glRptBalThead.html(theadHtml);
				page.newTable(thisDataArr,tableData);
				
				 // var twidth = ((liArr.length)*20 + 80);
				 // if(twidth > 100){
                  //    page.glRptBalTable.removeAttr("width").css("width",twidth+"%");
				 // }
				 // page.glRptBalDataTable.columns.adjust().draw();
			},
			
			//表格初始化
			newTable:function(columnsArr,tableData){
				// page.winH = $(window).height() - 324 - $(".rpt-query-box").height();
				// if(page.winH<290){
				// 	page.winH = 290;
				// }
				var id = "glRptBalTable";//表格id
                var toolBar = $('#'+id).attr('tool-bar');
                console.log('pageLength',pageLength);
				page.glRptBalDataTable = page.glRptBalTable.DataTable({
			    	"language":{
						"url":bootPath+"agla-trd/datatables/datatable.default.js"
				    },
//				    "fixedHeader": {
//				        header: true
//				    },
                    "data":tableData,
                    "bDestory": true,
			    	"processing":true,//显示正在加载中
			    	"pagingType":"full_numbers",//分页样式
			      	"lengthChange":true,//是否允许用户自定义显示数量p
			      	"lengthMenu":[
                        [ 20, 50, 100, 200, 100000],
                        [ 20, 50, 100, 200, "全部"]
			      	],
			      	
//			      	"fixedColumns":   {
//			            "leftColumns": 0
//			        },
//			        "scrollX": "100%",
//			        "scrollY": page.winH + "px",
//			        "scrollCollapse": true,
			        
			      	"pageLength": pageLength,
			      	"ordering":false,
                    "bAutoWidth":false,
			      	"columns":columnsArr,
			      	"columnDefs": [
			            {
					        "targets": [-9],
					        "visible": false
					    },
					    {
					        "targets": [-8,-7,-6,-5,-4,-3,-2,-1],
					        "className":"tdNum isprint",
					        "width":"50",
					        "render": $.fn.dataTable.render.number( ',', '.', 2, '' )
					    },
                        {
                            targets:[0,1],
                            className:"gotoJournal",
                            render:function(data, type, rowdata, meta){
                                if(rowdata.rowType =='3' || rowdata.rowType =='9' || rowdata.rowType == 10 || rowdata.rowType == 31 || rowdata.rowType == 32) return data;// #6066 31-财务会计合计 32-预算会计合计
                                return '<span class="turn-vou">'+($.isNull(data)?'':data)+'</span>'
                            }
                        }
			        ],
                    "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
			       	// "dom":'<"printButtons"B>r<"tableBox"t><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"'+id+'-paginate"ilp>>>><"tableBottomFix"<"barBox"<"bar">><"tool-bar-body"<"ufma-tool-btns"><"info"<"'+id+'-paginate"ilp>>>>',
                    buttons: [
                        {
                            extend: 'print',
                            text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint',
                                format: {
                                    header: function(data, columnIdx) {
                                        var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
                                        if($(data).length == 0) {
                                            return thisHead.pTitle + data;
                                        } else {
                                            return thisHead.pTitle + $(data)[0].innerHTML;
                                        }
                                    }
                                }
                            },
                            customize: function(win) {
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
                                        var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
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
                        }
                    ],
			       	"initComplete":function(){
			       		
			       		$("#printTableData").html("");
                    	$("#printTableData").append($(".printButtons"));

                    	$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({"data-toggle":"tooltip","title":"打印"});
                    	$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({"data-toggle":"tooltip","title":"导出"});
                    	//导出begin
                        $("#printTableData .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '余额表');
                        });
                        //导出end
                    	$('#printTableData.btn-group').css("position","inherit");
                    	$('#printTableData div.dt-buttons').css("position","inherit"); 
                    	$('#printTableData [data-toggle="tooltip"]').tooltip(); 

			       		//驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        $('#'+id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        $("#tool-bar").width($(".rpt-workspace").width()-224);
                        // $("#tool-bar").css("margin-left","252px");
                        //驻底end

			       		page.headerArr = rpt.tableHeader(id);

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
                              $("#glRptBalTable").fixedTableHead();
                              //金额区间-范围筛选
                              rpt.twoSearch(page.glRptBalTable);

                        // 点击表格行高亮
                        rpt.tableTrHighlight();
                        ufma.isShow(page.reslist);
			       	},
			       	"drawCallback":function(settings){
                        ufma.dtPageLength($(this));
			       		$("#"+id).find("tbody tr").each(function(){
			       			var rowData = page.glRptBalDataTable.row($(this)).data();
			       			if(!$.isNull(rowData)){
				       			// if(rowData.rowType == "3" || rowData.rowType == "9" || rowData.rowType == "10"){
                                if(rowData.rowType == "3" || rowData.rowType == "9" || rowData.rowType == 10 || rowData.rowType == 31 || rowData.rowType == 32){
									$(this).css({
										"background-color":"#f0f0f0"
									})
								}
			       			}
			       		})
			       		// ufma.isShow(page.reslist);
			       		page.glRptBalTable.find("td.dataTables_empty").text("")
			       		.append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
			       		
			       		//$(".tableBox").css({"overflow-x":"auto","width":"100%"});
			       		// var twidth = 20*columnsArr.length;
			       		// $("#"+id).css("width",twidth+"%");
			       		
			       		if($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")){
							$("td.tdNum").each(function(){
								if($(this).text() != ""){
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num/10000).toFixed(6)));
								}	
								$(this).addClass("wanyuan");
							})
						}
			       		
                           //搜索隐藏显示--表格模糊搜索
                              ufma.searchHideShow(page.glRptBalTable);
						// rpt.searchHideShow(page.glRptBalTable);

						//金额区间-范围筛选
						rpt.twoSearch(page.glRptBalTable);
						
						//显示/隐藏筛选框
						rpt.isShowFunnelBox();
			       		
						//联查明细账
                        page.glRptBalTable.find("tbody td:not(.dataTables_empty)").on("click",function(){
                            var rowData = page.glRptBalDataTable.row($(this).parents("tr")).data();
                            if(rowData.rowType == "1"){
                                page.openJournalShow(rowData);
                            }else{
//								console.info(rowData.rowType);
                            }
                        })
						
						//设置底部工具栏的显隐
						//rpt.showHide("glRptBalTable");
						
						
						$(".tableBox").on("scroll",function(e){
							var $Head = $(".fixedHeader-floating") || $(".fixedHeader-locked");
			            	var len = $Head.length;
		            		var tableBoxLeft = parseInt($(this).scrollLeft());
			            	if(len == 1){
			            		var HeadLeft = parseInt($Head.css("left").substring(0,$Head.css("left").length-2));
//			            		console.info(HeadLeft+"****"+tableBoxLeft);
			            		var newLeft = parseInt(HeadLeft-tableBoxLeft);
//			            		console.info("newLeft=="+newLeft);
			            		$Head.css("left",newLeft+"px");
			            	}
			            });

			       	}
			   });
			   return page.glRptBalDataTable;
			},
			
			//余额表联查明细账
            openJournalShow:function(dt){
				var rowData = $.extend(true, {}, dt);
				if (rowData.accoCode) {
					if(rowData.accoName.lastIndexOf('/')!=-1){
						rowData.accoName = rowData.accoName.substr(rowData.accoName.lastIndexOf('/')+1);
					}
				}
				sessionStorage.removeItem(rpt.journalFormBal);

                var startYear = (new Date($("#dateStart").getObj().getValue())).getFullYear(); //起始年度(只有年，如2017)
                var startFisperd = (new Date($("#dateStart").getObj().getValue())).getMonth() + 1; //起始期间(只有月份，如7)
                var endYear = (new Date($("#dateEnd").getObj().getValue())).getFullYear(); //截止年度(只有年，如2017)
                var endFisperd = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1; //截止期间(只有月份，如7)

                var tdd = new Date(endYear,endFisperd,0);
                var ddDay = tdd.getDate();

                var startDate = $("#dateStart").getObj().getValue() + "-01"; //开始日期
                var endDate = $("#dateEnd").getObj().getValue() + "-" + ddDay; //结束日期

                var accaCode = $(rpt.namespace+" #accaList").find(".btn-primary").data("code");//会计体系

                var ACCOitems = rpt.qryItemsArr();//选中会计科目代码数组

                //var rptOption = rpt.rptOptionArr();//其他查询项
                var IS_INCLUDE_UNPOST = $("#IS_INCLUDE_UNPOST").prop("checked");
                var IS_INCLUDE_JZ = $("#IS_INCLUDE_JZ").prop("checked");

                var IS_UNSHOW_OCCZERO = $("#IS_UNSHOW_OCCZERO").prop("checked");
                var IS_UNSHOW_OCCENDBALZERO = $("#IS_UNSHOW_OCCENDBALZERO").prop("checked");
                var IS_UNSHOW_OCCBALZERO = $("#IS_UNSHOW_OCCBALZERO").prop("checked");

                if(IS_INCLUDE_UNPOST){
                    IS_INCLUDE_UNPOST = "Y"
                }else{
                    IS_INCLUDE_UNPOST = "N"
                }

                if(IS_INCLUDE_JZ){
                    IS_INCLUDE_JZ = "Y"
                }else{
                    IS_INCLUDE_JZ = "N"
                }

                var IS_JUSTSHOW_OCCFISPERD = "";
                if(IS_UNSHOW_OCCZERO || IS_UNSHOW_OCCENDBALZERO || IS_UNSHOW_OCCBALZERO){
                    IS_JUSTSHOW_OCCFISPERD = "Y"
                }else{
                    IS_JUSTSHOW_OCCFISPERD = "N"
                }

                var arguObj = {
                    "acctCode":rpt.nowAcctCode,
                    "agencyCode":rpt.nowAgencyCode,
                    "agencyName":rpt.nowAgencyName,
                    "prjCode":"",
                    "prjName":"",
                    "prjScope":"",
                    "rptType":"GL_RPT_JOURNAL",
                    "setYear":rpt.nowSetYear,
                    "userId":rpt.nowUserId,
                    "prjContent":{
                        "accaCode":accaCode,
                        "agencyAcctInfo":[{
                            "acctCode":rpt.nowAcctCode,
                            "agencyCode":rpt.nowAgencyCode
                        }],
                        "startDate":startDate,
                        "endDate":endDate,
                        "startYear":"",
                        "startFisperd":"",
                        "endYear":"",
                        "endFisperd":"",
                        "qryItems":ACCOitems,
                        "rptCondItem":[],
                        "rptOption":[
                            {"defCompoValue":IS_INCLUDE_UNPOST,"optCode":"IS_INCLUDE_UNPOST","optName":"含未记账凭证"},
                            {"defCompoValue":IS_INCLUDE_JZ,"optCode":"IS_INCLUDE_JZ","optName":"含结转凭证"},
                            {"defCompoValue":IS_JUSTSHOW_OCCFISPERD,"optCode":"IS_JUSTSHOW_OCCFISPERD","optName":"只显示有发生期间"}
                        ],
                        "curCode":"",
                        "rptStyle":"SANLAN",
                        "rptTitleName":"明细账"
                    }
                };
                $("a[name='period']").each(function () {
                    if($(this).hasClass("selected")){
                        arguObj.timeBtn = $(this).attr("id");
                    }
                });
                arguObj.rowData = rowData;
                var arguStr = JSON.stringify(arguObj);

                rpt.nowAgencyCode = arguObj.agencyCode; // 更新单位代码
                rpt.nowAgencyName = arguObj.agencyName; // 更新单位名称
                rpt.nowAcctCode = arguObj.acctCode; // 更新账套代码
                // 改写平台缓存单位账套
                var params = {
                    selAgecncyCode: rpt.nowAgencyCode,
                    selAgecncyName: rpt.nowAgencyName,
                    selAcctCode: rpt.nowAcctCode,
                    // selAcctName: rpt.nowAcctName
                }
                ufma.setSelectedVar(params);
                rpt.journalFormBal = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, "journalFormBal");
                sessionStorage.setItem(rpt.journalFormBal,arguStr);
                rpt.sessionKeyArr.push(rpt.journalFormBal);
                //window.location.href = '../glRptJournal/glRptJournal.html?dataFrom=glRptBal&action=query';

                // //门户打开方式
                // $(this).attr('data-href','../../../gl/rpt/glRptJournal/glRptJournal.html?menuid='+rpt.journalMenuId+'&dataFrom=glRptBal&action=query');
                // $(this).attr('data-title','明细账');
                // window.parent.openNewMenu($(this));
                var baseUrl = '/gl/rpt/glRptJournal/glRptJournal.html?menuid='+rpt.journalMenuId+'&dataFrom=glRptBal&action=query';
                // baseUrl = page.isCrossDomain ? '/pf' + baseUrl : '../../..' + baseUrl;
                baseUrl = '/pf' + baseUrl;
                uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "明细账");		
            },
			
			//增加筛选框
			addFunnelBox:function(){
				$(rpt.namespace).find(".thTitle.rpt-th-jine-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-8")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-7")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-6")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-5")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum","金额区间","-4")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-3")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-2")));
				$(rpt.namespace).find(".thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3","金额区间","-1")));
			},
			
			//******初始化页面******************************************************
			initPage:function(){
				//增加筛选框
				page.addFunnelBox();
				
				page.glRptBalTable = $('#glRptBalTable');//当前table的ID
				page.glRptBalThead = $('#glRptBalThead');//当前table的头部ID
				
				newDataArr = [
				    {data:"accoCode",className:"isprint",width:"200"},//会计科目代码	
					{data:"accoName",className:"isprint",width:"200"}//会计科目名称
				];
				var initDataArr = newDataArr.concat(dataArr);
//		    	console.info(JSON.stringify(initDataArr));
		    	var tableData = [];
				page.glRptBalDataTable = page.newTable(initDataArr,tableData);
//				page.glRptBalDataTable.columns.adjust().draw();
				//page.glRptBalDataTable.ajax.url("glRptBal1.json");
				ufma.isShow(page.reslist);
                // //初始化单位样式
            	// rpt.initAgencyList();
            	// //初始化账套样式
            	// rpt.initAcctList();
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
                        }else {
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
            	
            	// //请求单位列表
            	// rpt.reqAgencyList();
				
				//请求查询条件其他选项列表
				rpt.reqOptList();
				
				// $(window).scroll(function () {
				// 	//设置底部工具栏的显隐
				// 	// rpt.showHide("glRptBalTable");
				// })
				// $(window,page.glRptBalTable).resize(function(e){
				// 	//设置底部工具栏的显隐
				// 	rpt.showHide("glRptBalTable");
				// })
                $(window).resize(function () {
                    ufma.setBarPos($(window));
                    $("#tool-bar").find(".slider").width($(".rpt-workspace").width()-252);
                    $("#tool-bar").width($(".rpt-workspace").width()-224);
                })
                ufma.parseScroll();

			},
			
			
			onEventListener: function(){
                $(".label-more").on("click", function () {
                    var timeId = setTimeout(function () {
                        clearTimeout(timeId);
                        //金额区间-范围筛选
                        rpt.twoSearch(page.glRptBalTable);
                    }, 300)

                })
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
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date()
                };
                $("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
                rpt.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $(" #dateBq").on("click", function() {
                    rpt.dateBenQi("dateStart", "dateEnd");
                });
                $(" #dateBn").on("click", function() {
                    rpt.dateBenNian("dateStart", "dateEnd");
                });
				
				//单选会计体系
				$(rpt.namespace+" #accaList").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
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
				$(rpt.namespace).find('.rpt-method-list').on('click','li span',function(){
					if($(this).parent("li").hasClass("isUsed")){
                        $(this).parent("li").css({
                            "border":"1px solid rgba(16,142,233,0.30)",
                            "background":"rgba(16,142,233,0.20)"
                        }).removeClass("isUsed").find("span,b").css("color","#108EE9");
                        //取消选中的查询方案后还原会计体系
                        rpt.backToOrigin();
					}else{
                        $(this).parent("li").css({
                            "border":"1px solid #108EE9",
                            "background":"#108EE9"
                        }).addClass("isUsed").find("span,b").css("color","#fff");
                        $(this).parent("li").siblings().css({
                            "border":"1px solid rgba(16,142,233,0.30)",
                            "background":"rgba(16,142,233,0.20)"
                        }).removeClass("isUsed").find("span,b").css("color","#108EE9");
                        $(rpt.namespace).find('.rpt-share-method-box-body .btn').remove("isUsed");

                        //console.info($(this).offset().top);
                        if($(this).offset().top>67){
                            $(this).parents("ul.rpt-method-list").find("li").eq(0).before($(this).parent("li"));
                        }

                        //请求方案内容
                        var prjCode = $(this).data("code");
                        rpt.reqPrjCont(prjCode);
					}
				});
				
				//使用共享方案
				$(rpt.namespace).find('.rpt-share-method-box-body').on('click','.btn',function(){
					$(this).addClass("isUsed");
					$(rpt.namespace).find('.rpt-method-list li').css({
						"border":"1px solid rgba(16,142,233,0.30)",
						"background":"rgba(16,142,233,0.20)"
					}).removeClass("isUsed").find("span,b").css("color","#108EE9");
					//请求方案内容
					var prjCode = $(this).data("code");
					rpt.reqPrjCont(prjCode);
				});
				
				//删除查询方案
				rpt.deleteMethod();
				
				//打开-保存查询方案模态框
				rpt.openSaveMethodModal();

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
				
				//下拉选择展开隐藏ztree盒子
				rpt.showSelectTree();
				$("#oneAcco").parent().on("click",function(e){
					var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
					rpt.showHideTree(this,"ACCO",radioType);
				});
				
//				$(rpt.namespace).find(".rpt-query-box-center .rpt-tree-view").each(function(i){
//					var $combox = $("#accList"+(i+1));
//					$(this).on("click",function(e){
//						e.stopPropagation();
//						var code = $combox.getObj().getValue();
//						var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
//						rpt.showHideTree(this,code,radioType);
//					})
//				})
				
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
				
				//显示更多查询方案
				rpt.showMoreMethod();

				//点击查询按钮，改变表格信息
				$(rpt.namespace).find("#searchTableData").on("click",function(){
                    if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.showTip('开始月份不能大于结束月份！', function() {}, 'error');
                        return false;
                    }
					var arr = [];
					for(var i=1;i<6;i++){
						var name = $("#accList"+i).getObj().getText();
						if(name != "请选择" && !$.isNull(name)){
							arr.push(name);
						}
					}
					var nary=arr.sort();  
					for(var i=0;i<nary.length;i++){  
						if (nary[i]==nary[i+1]){  
							ufma.showTip(nary[i]+"重复了!",function(){},"warning");
							return false;
						}  
					}
                    var tabArgu = rpt.backTabArgu();
                    tabArgu.accaCode = rpt.nowAccaCode;
					console.info(JSON.stringify(tabArgu));
					
					//console.info(JSON.stringify(newDataArr));
//					var nowDataArr = newDataArr.concat(dataArr);
			    	//console.info(JSON.stringify(nowDataArr));
					ufma.showloading('正在请求数据，请耐心等待...');
					ufma.ajax(portList.getReport,"post",tabArgu,function(result){
                        ufma.hideloading();
						var tableData = result.data.tableData;
                        $.each(tableData, function(index, item){
                            if (item.hiddenColumns) {
                                for (var i = 0; i < item.hiddenColumns.length; i++) {
                                    item[item.hiddenColumns[i]] = '';
                                }
                            }
                        });						
						
//						if(rpt.isSetAcc){
//							page.glRptBalDataTable.clear().destroy();
//							page.glRptBalDataTable = page.newTable(nowDataArr,tableData);
//							var twidth = ((newDataArr.length)*20 + 80);
//							page.glRptBalTable.removeAttr("width").css("width",twidth+"%");
//							page.glRptBalDataTable.columns.adjust().draw();
//						}else{
//							var accoArr = [{"seq":"condition","dir":"","itemPos":"","itemTypeName":"会计科目","itemType":"ACCO","tips":"","items":""}];
//							page.changTable(accoArr,tableData);
//						}
//						//rpt.isSetAcc = false;

						var showLiArr = rpt.tableColArr();
						page.changTable(showLiArr,tableData);
					});
					
				});
                $(".menuBtn").on("click",function(){
                    rpt2.openTabMenu(this);
                });
				
			},
			
			//此方法必须保留
			init:function(){
	       		page.reslist = ufma.getPermission();
				ufma.parse();
				this.initPage();
				this.onEventListener();
				
//				$(window).scroll(function(e){
//					var $Head = $(".fixedHeader-floating");
//                	var len = $Head.length;
//                	console.info(len);
//                	if(len == 1){
//                		var wid = $('.tableBox').width();
//                		var left = $Head.css("left");
//                		$("#fixedHeadBox").css({
//                			"width":wid+"px",
//                			"height":"74px",
//                			"position":"fixed",
//                			"top":"0",
//                			"left":left
//                		});
//                		var tableWid = $Head.css("width");
//                		$Head.removeAttr("style").css("width",tableWid);
//                		$("#fixedHeadBox").append($Head);
//                	}
//                });
				
				
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
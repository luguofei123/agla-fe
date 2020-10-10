$(function(){
    var page = function(){
    	
    	var glRptCfStatementDataTable;//全局datatable对象
		var glRptCfStatementTable;//全局table的ID
		
		//现金流量统计表所用接口
		var portList = {
			GL_RPT_CASHFLOW:'/gl/rpt/getReportData/GL_RPT_CASHFLOW'
		};
    	
        return{
        	
			//表格初始化
			newTable:function(tableData){
				var id = 'glRptCfStatementTable';
				page.glRptCfStatementDataTable = page.glRptCfStatementTable.DataTable({
			    	"language":{
						"url":bootPath+"agla-trd/datatables/datatable.default.js"
				    },
			    	"data":tableData,
			    	"processing":true,//显示正在加载中
			    	"pagingType":"full_numbers",//分页样式
					"lengthChange":false,//是否允许用户自定义显示数量p
					"bAutoWidth": false, //表格自定义宽度
					"bProcessing": true,
					"bDestroy": true,
					"paging":false,//不分页
			      	"ordering":false,
			      	"info":false,
			      	"columns":page.cloumns(),
			      	"columnDefs": [
					    {
							"targets": [-1,-2,-3,-4,-5],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						}
			        ],
			       	"dom": '<"printButtons"B>rt',
                    buttons: [
                    	{
                    		extend: 'print',
                    		text:'<i class="glyphicon icon-print" aria-hidden="true"></i>',
                            customize: function(win) {
                            	$(win.document.body).find('h1').css("text-align","center");
                                $(win.document.body).css("height","auto");
                            }
                    	},
                    	{
                    		extend: 'excelHtml5',
                    		text:'<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                    		customize: function ( xlsx ){
                    			var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    		}
                    	}
                    ],
			       	"initComplete":function(){
			       		$("#printTableData").html("");
                    	$("#printTableData").append($(".printButtons"));

                    	$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({"data-toggle":"tooltip","title":"打印"});
                    	$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({"data-toggle":"tooltip","title":"导出"});
                    	$('#printTableData.btn-group').css("position","inherit"); 
                    	$('#printTableData div.dt-buttons').css("position","inherit"); 
                    	$('#printTableData [data-toggle="tooltip"]').tooltip(); 

			       		page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);

						//驻底begin
						// var toolBar = $(this).attr('tool-bar')
						// var $info = $(toolBar + ' .info');
						// if($info.length == 0) {
						// 	$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						// }
						// $info.html('');
						// $('.' + id + '-paginate').appendTo($info);

						// ufma.isShow(page.reslist);
						// ufma.setBarPos($(window));
						//驻底end

						//固定表头
						$("#glRptCfStatementTable").fixedTableHead();
						// 点击表格行高亮
						rpt.tableTrHighlight();
			       	},
			       	"drawCallback":function(settings){
			       		
			       		page.glRptCfStatementTable.find("td.dataTables_empty").text("")
			       		.append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

			       	}
			   	});
			   
			   	return page.glRptCfStatementDataTable;
			},
			cloumns:function(){
				var cloumns = [{
					title:'现金流量编码',
					data:'cashflowCode',
					width: 100,
					className:'center isprint'
				},{
					title:'现金流量名称',
					data:'cashflowName',
					width: 100,
					className:'isprint nowrap ellipsis'
				},{
					title:'方向',
					data:'cashflowDirection',
					width: 100,
					className:'center isprint'
				},{
					title:'本期流入',
					data:'currentInAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'本期流出',
					data:'currentOutAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'净流入',
					data:'netInAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'累计流入',
					data:'totalInAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'累计流出',
					data:'totalOutAmt',
					width: 100,
					className:'isprint tr tdNum'
				}];
				return cloumns
			},
			getGlRptCashFlow: function(param){
				if(!param instanceof Object){
					param = {}
				}
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.post(portList.GL_RPT_CASHFLOW,param,function(result){
					ufma.hideloading();
					// console.log(result.data.tableData);
					page.newTable(result.data.tableData)
				})
			},
			
            //初始化页面
            initPage:function(){
            	//需要根据自己页面写的ID修改
				page.glRptCfStatementTable = $('#glRptCfStatementTable');//当前table的ID
				// var columnsArr = [
		        //     	{data:"xiangmu"},//0项目
		        //     	{data:"hangci"},//1行次
		        //     	{data:"jine"}//2金额
			    //   	];
				// var tableData = [];
				
				//初始化单位样式
            	rpt.initAgencyList();
            	
            	//初始化账套样式
            	rpt.initAcctList();
            	
            	//请求单位列表
				rpt.reqAgencyList();
				
				//请求查询条件其他选项列表
				rpt.reqOptList();

				//初始化会计科目
				rpt.initIsCashflowAccoList();

				//请求会计科目
				rpt.queryIsCashflowAccoList();
            },
            
            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function(){
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();

				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateStart")
					}
				};
				var glRptLedgerEndDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateEnd")
					}
				};
				$("#dateStart").ufDatepicker(glRptLedgerDate);
				$("#dateEnd").ufDatepicker(glRptLedgerEndDate);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$("#dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});
				
				//切换表格上方年度信息
				$(rpt.namespace).find("#dateStart").on("change",function(){
					$(".rpt-table-sub-year").text($(this).val().substring(0,4)+"年");
				})
				
				//编辑金额单位
				rpt.changeMonetaryUnit();
				
		       	//搜索隐藏显示--表格模糊搜索
				// rpt.searchHideShow(page.glRptCfStatementTable);
				ufma.searchHideShow(page.glRptCfStatementTable);
				
				//查询现金流量统计表
				$("#glRptCfStatement-query").on("click",function(){
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function () { }, 'error');
						return false;
					}
					var tabArgu = rpt.backTabArgu();
					console.log(tabArgu);
					// var param = {
					// 	acctCode: rpt.nowAcctCode,
					// 	acctName: rpt.nowAcctName,
					// 	agencyCode: rpt.nowAgencyCode,
					// 	agencyName: rpt.nowAgencyName,
					// 	prjContent:{
					// 		endFisperd: 8,
					// 		startFisperd:7,
					// 		qryItems:[{
					// 			itemType:'ACCO',
					// 			itemTypeName: '会计科目',
					// 			items: [{code: "1001", name: "1001 库存现金"}],
					// 			isShowItem: '1',
					// 			isCradsum: '1'
					// 		}]//插入会计科目
					// 	},
					// 	setYear: pfData.svSetYear
					//   }
					page.getGlRptCashFlow(tabArgu);
				})
				
            },
            //此方法必须保留
            init:function(){
				ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }();

 /////////////////////
    page.init();
});
$(function(){
    var page = function(){
		
		//与资产对账接口
		var portList = {
			GL_RPT_ASSETRC:'/gl/rpt/getReportData/GL_RPT_ASSETRC',
			GET_ASSET_DATA_INFO:'/gl/glAssetRc/getAssetDataInfo'
		};
    	
        return{
        	
			//表格初始化
			newTable:function(tableData){
				var id = 'glRptAssetRcTable';
				page.glRptAssetRcTable = $('#'+id).DataTable({
			    	"language":{
						"url":bootPath+"agla-trd/datatables/datatable.default.js"
				    },
			    	"data":tableData,
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
							"targets": [-2,-3,-5,-6],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							"targets": [-7],
							"className": "isprint",
							"render":function (data, type, rowdata, meta) {
								var dataArr = rowdata;
								var ti = 0;
								if (rowdata.accitemLevel) {
									ti = rowdata.accitemLevel - 1;
									ti = ti < 0 ? 0 : ti;
								}
								return '<span title="' + data + '" style="display:inline-block;text-indent:' + ti + 'em;">' + data + '</span>';
							}
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

						ufma.isShow(page.reslist);

						//固定表头
						$('#'+id).fixedTableHead();
						// 点击表格行高亮
						rpt.tableTrHighlight();
			       	},
			       	"drawCallback":function(settings){
			       		$('#glRptAssetRcTable').find("td.dataTables_empty").text("")
						   .append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						   
						$('#glRptAssetRcTable_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						setTimeout(function () {
							ufma.isShow(page.reslist);
							ufma.setBarPos($(window));
						}, 30);

			       	}
			   	});
			   
			   	return page.glRptAssetRcTable;
			},
			cloumns:function(){
				var cloumns = [{
					title:'会计科目',
					data:'accitem',
					width: 100,
					className:'center isprint'
				},{
					title:'借方金额',
					data:'drAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'贷方金额',
					data:'crAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'资产类型',
					data:'assetType',
					width: 100,
					className:'center isprint'
				},{
					title:'增加',
					data:'addAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'减少',
					data:'decreaseAmt',
					width: 100,
					className:'isprint tr tdNum'
				},{
					title:'对账结果',
					data:'checkResult',
					width: 20,
					className:'center isprint'
				}];
				return cloumns
			},
			getGlRptAssetRc: function(param){
				if(!param instanceof Object){
					param = {}
				}
				ufma.showloading('正在加载数据请耐心等待...');
				ufma.post(portList.GL_RPT_ASSETRC,param,function(result){
					ufma.hideloading();
					console.log(result.data.tableData);
					page.newTable(result.data.tableData)
				})
			},
			
            //初始化页面
            initPage:function(){
				ufma.isShow(page.reslist);
            	//需要根据自己页面写的ID修改
				page.glRptAssetRcTable = $('#glRptAssetRcTable');//当前table的ID
				console.log(page.glRptAssetRcTable);
				//初始化单位样式
            	rpt.initAgencyList();
            	
            	//初始化账套样式
            	rpt.initAcctList();
            	
            	//请求单位列表
				rpt.reqAgencyList();
				
				//请求查询条件其他选项列表
				rpt.reqOptList();
			},
			//单选按钮组
			raidoBtnGroup: function (btnGroupClass) {
				$("#frmQuery").find("." + btnGroupClass).on("click", function () {
					if ($(this).hasClass("selected")) {
						$(this).siblings().removeClass("selected");
					} else {
						$(this).addClass("selected");
						$(this).siblings().removeClass("selected");
					}
				})
			},
            
            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function(){
				//期间单选按钮组
				page.raidoBtnGroup("label-radio");
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
				// ufma.searchHideShow(page.glRptAssetRcTable);
				
				//点击取资产数据
				$("#glRptAssetRc-getData").on("click",function(){
					var dateStart = $('#dateStart').getObj().getValue();
					var dateEnd = $('#dateEnd').getObj().getValue();
					var param = {
						rgCode:rpt.rgCode,
						agencyCode:rpt.nowAgencyCode,
						acctCode:rpt.nowAcctCode,
						setYear:pfData.svSetYear,
						startFisperd:parseInt(dateStart.split('-')[1]),
						endFisperd:parseInt(dateEnd.split('-')[1])
					}
					ufma.showloading('正在加载数据，请耐心等待...');
					ufma.get(portList.GET_ASSET_DATA_INFO,param,function(result){
						ufma.hideloading();
						console.log(result.data);
						ufma.showTip('取资产数据成功！',function(res){
							console.log(res);
						},'success')
					})
				})

				$('#btn-setting').on('click',function(){
					var data = {
						rgCode:rpt.rgCode,
						agencyCode:rpt.nowAgencyCode,
						acctCode:rpt.nowAcctCode,
						setYear:pfData.svSetYear
					}
					ufma.open({
						url: 'getAccoAndAccItemFrame.html',
						title: '条件选择',
						width: 700,
						height:500,
						data: data,
						ondestory: function (res) {
							//窗口关闭时回传的值
							if (res.action && res.action.action == "save") {
								ufma.showTip(res.action.msg,function () {
	
								},res.action.flag)
								$("#glRptAssetRc-query").click();
							}
						}
					});
				})

				//查询与资产对账
				$("#glRptAssetRc-query").on("click",function(){
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function () { }, 'error');
						return false;
					}
					var tabArgu = rpt.backTabArgu();
					var isShowDetail = $("input[name='isShowDetailCheck']:checked").eq(0).val();
					var rptOptions = tabArgu.prjContent.rptOption;
					if(isShowDetail != undefined && isShowDetail == 1){
						var cond = {
							defCompoValue: "Y",
							optCode: "IS_SHOW_DETAIL",
							optName: "展开明细"
						};
						rptOptions.push(cond);
					}else{
						var cond = {
							defCompoValue: "N",
							optCode: "IS_SHOW_DETAIL",
							optName: "展开明细"
						};
						rptOptions.push(cond);
					}
					tabArgu.prjContent.rptOption = rptOptions;
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
					page.getGlRptAssetRc(tabArgu);
				})
				
            },
            //此方法必须保留
            init:function(){
				page.reslist = ufma.getPermission();
                this.initPage();
				this.onEventListener();
				ufma.parseScroll();
				ufma.parse();
            }
        }
    }();

 /////////////////////
    page.init();
});
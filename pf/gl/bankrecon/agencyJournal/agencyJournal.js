$(function () {
    var page = function () {
    	
    	//单位日记账接口
    	var portList = {
    		agencyList:"/gl/eleAgency/getAgencyTree",//单位列表接口
    		accScheList:"/gl/bank/recon/getBankReconSche",//方案列表接口
    		getDailyJournal:"/gl/bank/daily/getDaily",//生成单位日记账
        	queryJournal:"/gl/bank/daily/getJournal",//查询单位日记账
            deleteJournal:"/gl/bank/daily/deleteDailyJournal",//删除单位日记账
            getBankExtends:"/gl/bank/daily/getBankExtends"//获取对账单扩展字段
		};
    	
        return {
            namespace: 'agencyJournal',
            get: function (tag) {
                return $('#' + this.namespace + ' ' + tag);
            },
            
            //单位日记账固定字段
            agencyFixedArr:[
            	{title:"是否对账",data:"isBalanceAccName"},//0
	        	{title:"凭证日期",data:"vouDate"},//1
	        	{title:"凭证编号",data:"vouNo"},//2
	        	{title:"摘要",data:"descpt"},//3 筛选
	        	{title:"借方金额",data:"dStadAmt"},//4 筛选
	        	{title:"贷方金额",data:"cStadAmt"},//5 筛选
	        	{title:"结算方式",data:"setmodeName"},//6
	        	{title:"票据类型",data:"billType"},//7
	        	{title:"票据日期",data:"billDate"},//8
	        	{title:"票据号",data:"billNo"},//9
	        	{title:"账套",data:"acctName"}//10
            ],
            
            //获取对账方案列表
            reqMethod: function () {
            	var argu = {
            		"agencyCode":page.agencyCode
            	}
            	ufma.get(portList.accScheList,argu,function(result){
            		var data = result.data;
            		$("#accScheList").ufCombox({
            			data:data
            		});
            		$("#accScheList2").ufCombox({
            			data:data
            		});
            		if(data.length>0){
            			$("#accScheList").getObj().val(data[0].schemaGuid);
            			$("#accScheList2").getObj().val(data[0].schemaGuid);
        				page.schemaGuid = data[0].schemaGuid;
        				var argu = {
                    		schemaGuid:page.schemaGuid	
                    	}
        				ufma.get(portList.getBankExtends,argu,function(result){
        					var data = result.data;
        					var extendsArr = data.extendTableHeadList;
    		            	var tableData = [];
    						page.showDataTable(extendsArr,tableData);
        				});
            		}else{
            			page.schemaGuid = "";
            		}
            	})
            },
            
            //单选按钮组
            raidoBtnGroup:function(btnGroupClass){
            	$("."+btnGroupClass).on("click",function(){
            		if($(this).hasClass("selected")){
                		$(this).siblings().removeClass("selected");
            		}else{
            			$(this).addClass("selected");
                		$(this).siblings().removeClass("selected");
            		}
            	})
            },
            
            //返回本期时间
            dateBenQi:function(startId,endId){
            	var ddYear = page.setYear;
            	var ddMonth = page.month - 1;
            	var tdd = new Date(ddYear,ddMonth+1,0)
            	var ddDay = tdd.getDate();
            	$("#"+startId+" input").datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
            	$("#"+endId+" input").datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));
            },
            
            //返回本年时间
            dateBenNian:function(startId,endId){
            	var ddYear = page.setYear;
            	$("#"+startId+" input").datetimepicker('setDate',(new Date(ddYear,0,1)));
            	$("#"+endId+" input").datetimepicker('setDate',(new Date(ddYear,11,31)));
            },
            
            //返回今日时间
            dateToday:function(startId,endId){
            	$("#"+startId+" input,#"+endId+" input").datetimepicker('setDate',(new Date(page.today)));
            },
            
            //返回单列筛选html
            backOneSearchHtml:function(id,title,index){
            	var sHtml = '<div class="funnelModal" id="'+id+'">'+
				        		'<span class="funnelArrow"></span>'+
				        		'<div class="funnelBox" >'+
				        			'<p class="funnelTitle">'+
				        				'<span class="funnelTitle-span1">'+title+'</span>'+
				        				'<span class="funnelTitle-span2">清空</span>'+
				        				'<span class="funnelClear"></span>'+
				        			'</p>'+
				        			'<p class="funnelCont">'+
				        				'<input type="hidden" class="txtHide" value =""/>'+
					        			'<input type="text" class="txtCont bordered-input" col-index="'+index+'" placeholder="请输入过滤内容"/>'+
					        			'<button class="btn btn-primary rpt-oneSearch">查询</button>'+
				        			'</p>'+
				        		'</div>'+
				    		'</div>';
            	return sHtml;
            },

            //返回区间筛选html
            backTwoSearchHtml:function(id,title,index){
            	var sHtml = '<div class="funnelModal" id="'+id+'">'+
								'<span class="funnelArrow"></span>'+
								'<div class="funnelBox" >'+
									'<p class="funnelTitle">'+
										'<span class="funnelTitle-span1">'+title+'</span>'+
										'<span class="funnelTitle-span2">清空</span>'+
										'<span class="funnelClear"></span>'+
									'</p>'+
									'<p class="funnelCont">'+
										'<input type="hidden" class="txtHide1" value =""/>'+
						    			'<input type="text" class="numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
						    			'<span>至</span>'+
						    			'<input type="hidden" class="txtHide2" value =""/>'+
						    			'<input type="text" class="numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
						    			'<button class="btn btn-primary rpt-twoSearch">查询</button>'+
									'</p>'+
								'</div>'+
							'</div>';
            	return sHtml;
            },
            
            //模糊单项选择
            oneSearch:function(dom,id,selector){
        		var i = $(dom).siblings(".txtCont").eq(0).attr("col-index");
        		var key = $(dom).siblings(".txtCont").eq(0).val();
        		$("#"+id+" .txtHide").val("");
        		var columns = $(selector).DataTable().columns(i);
        		var val = $.fn.dataTable.util.escapeRegex(key);
        		columns.search(val, false, false).draw();
        		if(val != ""){
        			$(".th"+id).css("color","#108EE9");
        			$(".btn"+id).css("color","#108EE9");
        		}else{
        			$(".th"+id).css("color","");
        			$(".btn"+id).css("color","");
        		}
        		$("#"+id+".funnelModal").hide();
        		$("#"+id+" .txtHide").val(val);
            },
            
            //数字校验
            validatorNum:function(dom){
            	var num = $(dom).val().replace(/\,/g, "");
        		if(num !=""){
        			var ret1 = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
        			var ret2 = /^-?[1-9]\d*$/;
        	      	if(ret1.test(num) || ret2.test(num)){
        				$(dom).val(rpt.comdify(parseFloat(num).toFixed(2)));
        			}else{
        				ufma.alert("请输入合法的数字！","error");
        				return false;
        			}
        		}
            },
            
            //单列范围筛选
            twoSearch:function(dom,id,selector){
            	var i = $(dom).siblings(".numCont").eq(0).attr("col-index");
        		$("#"+id+" .txtHide1").val("");
        		$("#"+id+" .txtHide2").val("");
        		var key1 = $(dom).siblings(".numCont").eq(0).val();
        		var key2 = $(dom).siblings(".numCont").eq(1).val();
        		var val1 = $.fn.dataTable.util.escapeRegex(key1);
        		var val2 = $.fn.dataTable.util.escapeRegex(key2);
        		var columns = $(selector).DataTable().columns(i);
        		
        		if(val1 != "" || val2 != ""){
        			if(val1 == ""){
        				val1 = -Number.MAX_VALUE;
        				val2 = val2.replace(/\,/g, "");
        			}else if(val2 == ""){
        				val1 = val1.replace(/\,/g, "");
        				val2 = Number.MAX_VALUE;
        			}else{
        				val1 = val1.replace(/\,/g, "");
            			val2 = val2.replace(/\,/g, "");
        			}
        			$.fn.dataTable.ext.search.push(
        				function( settings, data, dataIndex ) {
        					var colIndex  =  data.length + parseInt(i);
        					var min = parseFloat( val1, 10 );
        					var max = parseFloat( val2, 10 );
        					var col = parseFloat( data[colIndex],10 ) || 0; 
        					if ( ( isNaN( min ) && isNaN( max ) ) ||
        						 ( isNaN( min ) && col <= max ) ||
        						 ( min <= col   && isNaN( max ) ) ||
        						 ( min <= col   && col <= max ) )
        					{
        						return true;
        					}
        					return false;
        				}
        			);
        			$(".th"+id).css("color","#108EE9");
        			$(".btn"+id).css("color","#108EE9");
        		}else{
        			$.fn.dataTable.ext.search.pop();
        			$(".th"+id).css("color","");
        			$(".btn"+id).css("color","");
        		}
        		$(selector).DataTable().draw();
        		$("#"+id+".funnelModal").hide();
        		$("#"+id+" .txtHide1").val(key1);
        		$("#"+id+" .txtHide2").val(key2);
            },
            
            //初始化表格
            initTable:function(id,data,colArr){
            	var toolBar = $('#' + id).attr('tool-bar');
            	var tableObj = $("#"+id).DataTable({
            		"language":{
						"url":bootPath+"agla-trd/datatables/datatable.default.js"
				    },
//				    "fixedHeader": {
//				    	"header": true
//				    },
				    "scrollY": page.winH + "px",
					"sScrollX": "100%",
					"scrollCollapse": true,
					"fixedColumns": {
				        "leftColumns": 0
				    },
			    	"data":data,
			    	"paging": false, // 禁止分页
			    	"processing":true,//显示正在加载中
			      	"ordering":false,
			      	"columns":colArr,
			      	"columnDefs": [
			            {
					        "targets": [0,1,2,6,7,8,9,10],
					        "className":"isprint",
					    },
					    {
					        "targets": [3],
					        "className":"isprint funnel",
					    },
					    {
					        "targets": [4,5],
					        "className":"tr isprint funnel",
					        "render": $.fn.dataTable.render.number( ',', '.', 2, '' )
					    }
			        ],
			       	"dom": '<"printButtons"B>rt<"' + id + '-paginate"i>',
			       	buttons: [
                    	{
                    		extend: 'print',
                    		text:'<i class="glyphicon icon-print" aria-hidden="true"></i>',
                    		exportOptions: {
                    			columns: '.isprint',
                    			format: {
                    		        header: function (data, columnIdx) {
                    		        	if($(data).length==0){
                    		        		return data;
                    		        	}else{
                    		        		return $(data)[0].innerHTML;
                    		        	}
                    		        }
                    			}
                    		},
                    		customize: function(win) {
                            	$(win.document.body).find('h1').css("text-align","center");
                                $(win.document.body).css("height","auto");
                            }
                    	},
                    	{
                    		extend: 'excelHtml5',
                    		text:'<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                    		exportOptions: {
                    			columns: '.isprint',
                    			format: {
                    		        header: function (data, columnIdx) {
                    		        	if($(data).length==0){
                    		        		return data;
                    		        	}else{
                    		        		return $(data)[0].innerHTML;
                    		        	}
                    		        }
                    			}
                    		},
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
			       		//批量操作toolbar与分页
                      	var $info = $(toolBar +' .info');
                      	if($info.length == 0){
                          	$info = $('<div class="info"></div>').appendTo($(toolBar+' .tool-bar-body'));
                      	}
                      	$info.html('');
                      	$('.'+id+'-paginate').appendTo($info);
                      	
                      	$(".dataTables_scrollHead .funnel").each(function(){
                      		var txt = $(this).text();
                      		$(this).html('<span class="thTitle">'+txt+'</span>&nbsp;<span class="glyphicon icon-filter funnelBtn cp"></span>');
                      		$(this).on("click",function(){
                      			var btn =$(this).find(".funnelBtn").offset();
                      			var modalLeft = parseInt(btn.left - 48);//214 229 698 650
                      			var modalTop = parseInt(btn.top + 15);
                      			$(".funnelModal").hide();
                      			if(txt == "摘要"){
                      				$("#zhaiyao .txtCont").val($("#zhaiyao .txtHide").val());
                      				$(this).find(".thTitle").addClass("thzhaiyao");
                      				$(this).find(".funnelBtn").addClass("btnzhaiyao");
                      				$("#zhaiyao").css({
                      					"top":modalTop+"px",
                      					"left":modalLeft+"px"
                      				}).show();
                      			}else if(txt == "借方金额"){
                      				$("#jiefang .numCont").eq(0).val($("#jiefang .txtHide1").val());
                      				$("#jiefang .numCont").eq(1).val($("#jiefang .txtHide2").val());
                      				$(this).find(".thTitle").addClass("thjiefang");
                      				$(this).find(".funnelBtn").addClass("btnjiefang");
                      				$("#jiefang").css({
                      					"top":modalTop+"px",
                      					"left":modalLeft+"px"
                      				}).show();
                      			}else if(txt == "贷方金额"){
                      				$("#daifang .numCont").eq(0).val($("#daifang .txtHide1").val());
                      				$("#daifang .numCont").eq(1).val($("#daifang .txtHide2").val());
                      				$(this).find(".thTitle").addClass("thdaifang");
                      				$(this).find(".funnelBtn").addClass("btndaifang");
                      				$("#daifang").css({
                      					"top":modalTop+"px",
                      					"left":modalLeft+"px"
                      				}).show();
                      			}
                      		});
                      	});
                      	
                      	
			       	},
			       	"drawCallback":function(settings){
			       		/*var twidth = 0;
			       		for(var i=0;i<colArr.length;i++){
			       			twidth += parseFloat(colArr[i].width);
			       		}*/
			       		
			       		var twidth = 15*colArr.length;
			       		$("#"+id).css("width",twidth+"%");
			       		ufma.isShow(page.reslist);
			       		$("#"+id).find("td.dataTables_empty").text("")
			       		.append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
			       	}
			   	});
			   	return tableObj;
            },
            
            //展示表格
            showDataTable:function(extendsArr,tableData){
            	
            	var extColArr = [];
            	for(var i=0;i<extendsArr.length;i++){
            		var extColObj = {
            			title:extendsArr[i].showName,
            			data:extendsArr[i].extendField+"Name",
            			className:"isprint"
            		}
            		extColArr.push(extColObj);
            	}
            	var allCol = page.agencyFixedArr.concat(extColArr);
            	page.agencyDataTable.clear().destroy();
            	$("#agencyDataTable").html("");
            	page.agencyDataTable = page.initTable('agencyDataTable',tableData,allCol);
            },
            
            onEventListener: function () {
            	//表格搜索
            	ufma.searchHideShow($('#agencyDataTable'));
            	
            	//期间单选按钮组
				page.raidoBtnGroup("label-radio");
				
				//按钮提示
				$("[data-toggle='tooltip']").tooltip();
				
				//绑定日历控件
				var todayDate = {
				    format: 'yyyy-mm-dd',
			        autoclose: true,
			        todayBtn: true,
			        startView: 'month',
			        minView:'year',
			        maxView:'day',
			        language: 'zh-CN'
				};
				$("#dateStart input,#dateEnd input").datetimepicker(todayDate);
				page.dateBenNian("dateStart","dateEnd");
				$("#dateStart2 input,#dateEnd2 input").datetimepicker(todayDate);
				page.dateBenNian("dateStart2","dateEnd2");
				
				//选择期间，改变日历控件的值
				$("#dateBq").on("click",function(){
					page.dateBenQi("dateStart","dateEnd");
				});
				$("#dateBn").on("click",function(){
					page.dateBenNian("dateStart","dateEnd");
				});
				$("#dateJr").on("click",function(){
					page.dateToday("dateStart","dateEnd");
				});
				$("#dateBq2").on("click",function(){
					page.dateBenQi("dateStart2","dateEnd2");
				});
				$("#dateBn2").on("click",function(){
					page.dateBenNian("dateStart2","dateEnd2");
				});
				$("#dateJr2").on("click",function(){
					page.dateToday("dateStart2","dateEnd2");
				});
				
				//点击方案设置
				$("#setAccSche").on("click",function(){
					var obj = {};//选中的方案内容
					obj.schemaGuid = $("#accScheList").getObj().getValue();
					var param = {};
	                param["action"] = "edit";
	                param["agencyCode"] = page.agencyCode;
	                param["agencyName"] = page.agencyName;
	                param["rgCode"] = page.rgCode;
	                param["setYear"] = page.setYear;
	                param["data"] = obj;
	                ufma.open({
	                    url: "../bankBalanceAccSche/setAccSche.html",
	                    title: "编辑对账方案",
	                    width: 1090,
	                    data: param,
	                    ondestory: function (data) {
	                        if(data.action == "save"){
	                        	//获取对账方案列表
	                        	page.reqMethod();
	                        	$("#accScheList").getObj().val(obj.schemaGuid);
	                        	$("#accScheList2").getObj().val(obj.schemaGuid);
	                        }
	                    }
	                });
				});
				
				//点击提取
				$(".btn-gen").on("click",function(){
					if(page.schemaGuid !=""){
						$("#accScheList2").getObj().val(page.schemaGuid);
//						$("#dateStart2 input").val($("#dateStart1 input").val());
//						$("#dateEnd2 input").val($("#dateEnd1 input").val());
//						console.info($("#dateStart1 input").val());
//						var qijian = $("#qijian1 .selected").attr("code");
//						$("#qijian2 .label-radio").removeClass("selected");
//						$("#qijian2 .label-radio[code='"+qijian+"']").addClass("selected");
						page.modal = ufma.showModal("genBox",590,300);
					}else{
						ufma.showTip("请先设置一个对账方案！",function(){},"warning");
						return false;
					}
				});
				//确定提取
				$("#sureGenBox").on("click",function(){
					var schemaGuid = $("#accScheList2").getObj().getValue();
					var startDate = $("#dateStart2 input").val();
					var endDate = $("#dateEnd2 input").val();
					var argu = {
						"agencyCode":page.agencyCode,
						"setYear":page.setYear,
						"startDate":startDate,
						"endDate":endDate,
						"startYear":"",
						"endYear":"",
						"startFisperd":"",
						"endFisperd":"",
						"schemaGuid":schemaGuid
					}
					ufma.post(portList.getDailyJournal,argu,function(result){
						ufma.showTip("提取成功！",function(){},"success");
						var data = result.data;
						for(var i=0;i<data.tableData.length;i++){
							if(data.tableData[i].dStadAmt==0){data.tableData[i].dStadAmt=''}
							if(data.tableData[i].cStadAmt==0){data.tableData[i].cStadAmt=''}
						}
						var extendsArr = data.extendsArr;
		            	var tableData = data.tableData;
						page.showDataTable(extendsArr,tableData);
						page.modal.close();
					});
				});
				//取消提取
				$(".btn-close").on("click",function(){
					var value = $("#accScheList2").getObj().getValue();
					$("#accScheList").getObj().val(value);
//					$("#dateStart1 input").val($("#dateStart2 input").val());
//					$("#dateEnd1 input").val($("#dateEnd2 input").val());
//					var qijian = $("#qijian2 .selected").attr("code");
//					$("#qijian1 .label-radio").removeClass("selected");
//					$("#qijian1 .label-radio[code='"+qijian+"']").addClass("selected");
					page.modal.close();
				});
				
				//点击查询
				$(".btn-query").on("click",function(){
					if(page.schemaGuid !=""){
						var startDate = $("#dateStart input").val();
						var endDate = $("#dateEnd input").val();
						var argu = {
							"startDate":startDate,
							"endDate":endDate,
							"schemaGuid":page.schemaGuid
						}
						ufma.post(portList.queryJournal,argu,function(result){
							var data = result.data;
							for(var i=0;i<data.tableData.length;i++){
								if(data.tableData[i].dStadAmt==0){data.tableData[i].dStadAmt=''}
								if(data.tableData[i].cStadAmt==0){data.tableData[i].cStadAmt=''}
							}
							var extendsArr = data.extendsArr;
			            	var tableData = data.tableData;
							page.showDataTable(extendsArr,tableData);			            	
						});
					}else{
						ufma.showTip("请先设置一个对账方案！",function(){},"warning");
						return false;
					}
					
				});
				
				//点击删除
				$(".btn-delete").on("click",function(){
					ufma.confirm("您确认删除该方案的单位日记账吗？",function(action){
		                if (action) {
		                	var argu = {
	    						"schemaGuid":page.schemaGuid
	    					}
	    					ufma.delete(portList.deleteJournal,argu,function(result){
	    						ufma.showTip(result.msg,function(){},result.flag);
	    						var extendsArr = [];
	    		            	var tableData = [];
	    						page.showDataTable(extendsArr,tableData);
	    					});
		                }
		            },{type:'warning'});
				});
				
				$("body").on("click",function(e){
					if($(e.target).closest(".funnelBtn").length == 0 && $(e.target).closest(".funnelModal").length == 0){
				   		$(".funnelModal").hide();
			        }
				}).on("mouseenter",".funnelModal",function(){
					$(this).show();
				}).on("mouseleave",".funnelModal",function(){
					$(this).hide();
				}).on("scroll",function(){
					$(".funnelModal").hide();
				});
				
				//清空筛选输入框
				$(".funnelTitle-span2").on("click",function(){
					$(this).parents(".funnelBox").find("input[type='text']").val("");
				});
				
				$("#zhaiyao .rpt-oneSearch").on("click",function(){
					page.oneSearch(this,"zhaiyao","#agencyDataTable");
				});
				
				$("#zhaiyao .txtCont").eq(0).on("focus",function(){
            		$(this).keydown(function(e){
            			var val = $(this).val();
            			if(e.keyCode==13){
            				$("#zhaiyao .rpt-oneSearch").trigger("click");
            			}
            		});
            	});
				
				$("#jiefang .rpt-twoSearch").on("click",function(){
					page.twoSearch(this,"jiefang","#agencyDataTable");
				});
				$("#daifang .rpt-twoSearch").on("click",function(){
					page.twoSearch(this,"daifang","#agencyDataTable");
				});
				
				$(".funnelModal .numCont").on("blur",function(){
					page.validatorNum(this);
            	});
				
				$("#jiefang .numCont").eq(1).on("focus",function(){
            		$(this).keydown(function(e){
            			var val = $(this).val();
            			if(e.keyCode==13){
            				$("#jiefang .rpt-twoSearch").trigger("click");
            			}
            		});
            	});
				$("#daifang .numCont").eq(1).on("focus",function(){
            		$(this).keydown(function(e){
            			var val = $(this).val();
            			if(e.keyCode==13){
            				$("#daifang .rpt-twoSearch").trigger("click");
            			}
            		});
            	});
            },
            
            //初始化页面
            initPage: function () {
            	var pfData = ufma.getCommonData();
            	page.nowDate = pfData.svTransDate;//当前年月日
            	page.rgCode = pfData.svRgCode;//区划代码

            	page.setYear = pfData.svSetYear;//本年 年度
            	page.month = pfData.svFiscalPeriod;//本期 月份
            	page.today = pfData.svTransDate;//今日 年月日
            	
            	//修改权限  将svUserCode改为 svUserId  20181012
            	page.userId = pfData.svUserId;//登录用户ID
            	// page.userId = pfData.svUserCode;//登录用户ID
            	page.userName = pfData.svUserName;//登录用户名称
            	page.agencyCode = pfData.svAgencyCode;//登录单位代码
            	page.agencyName = pfData.svAgencyName;//登录单位名称
            	
            	//初始化单位列表样式
            	$("#cbAgency").ufmaTreecombox2({
            		valueField:'id',
            		textField:'codeName',
            		placeholder:'请选择单位',
            		icon:'icon-unit',
            		readOnly:false,
            		onchange:function(data){
            			//给全局单位变量赋值
            			page.agencyCode = data.id;
						page.agencyName = data.name;
						//缓存单位账套
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);

                    	//获取对账方案
                    	page.reqMethod();
            	    }
            	});
            	
            	//请求单位列表
        		ufma.ajax(portList.agencyList,"get",{"rgCode":page.rgCode,"setYear":page.setYear},function(result){
        			var data = result.data;
        			var cbAgency = $("#cbAgency").ufmaTreecombox2({
        	    		data:result.data
        	    	});
        			
        			var code = data[0].id;
        	    	var name = data[0].name;
        			
        			if(page.agencyCode != "" && page.agencyName != ""){
        				var agency = $.inArrayJson(data,'id',page.agencyCode);
        				if(agency != undefined){
        					cbAgency.val(page.agencyCode);
        				}else{
        					cbAgency.val(code);
            				page.agencyCode = code;
            				page.agencyName = name;
        				}
        			}else{
        				cbAgency.setValue(code,code+" "+name);
        				page.agencyCode = code;
        				page.agencyName = name;
        			}
        		});
            	
        		//初始化方案列表
        		$("#accScheList").ufCombox({
        			idField:"schemaGuid",
        			textField:"schemaName",
        			placeholder:"请选择对账方案",
        			onChange:function(sender,data){
        				page.schemaGuid = data.schemaGuid;
        				
                    	var argu = {
                    		schemaGuid:page.schemaGuid	
                    	}
        				ufma.get(portList.getBankExtends,argu,function(result){
        					var data = result.data;
        					var extendsArr = data.extendTableHeadList;
    		            	var tableData = [];
    						page.showDataTable(extendsArr,tableData);
        				});
        				
        			}
        		});
        		$("#accScheList2").ufCombox({
        			idField:"schemaGuid",
        			textField:"schemaName",
        			placeholder:"请选择对账方案",
        			onChange:function(sender,data){
        			}
        		});
            	
            	//初始化表格
            	var data  = [];
            	page.agencyDataTable = page.initTable('agencyDataTable',data,page.agencyFixedArr);
            	var $zhaiyao = page.backOneSearchHtml("zhaiyao","摘要","3");
              	var $daifang = page.backTwoSearchHtml("daifang","金额区间","5");
              	var $jiefang = page.backTwoSearchHtml("jiefang","金额区间","4");
              	$("body").append($zhaiyao);
              	$("#zhaiyao").hide();
              	$("body").append($daifang);
              	$("#daifang").hide();
              	$("body").append($jiefang);
              	$("#jiefang").hide();
            },

            init: function () {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
            	page.winH = $(window).height() - 290;
            	//$(".tab-content").css({"max-height":page.winH+"px","overflow-y":"auto"});
                this.initPage();
                this.onEventListener();
                
            }
        }
    }();

    page.init();
});
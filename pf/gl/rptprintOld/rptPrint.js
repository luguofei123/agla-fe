$(function(){
	var page = function(){
		//定义datatables变量
		var rptPrintDataTable;
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host: "http://" + window.location.host;
		var TMPL_CODEs=''
		var isprint = ''
		//绑定日历控件
		var glRptBalDate = {
		    format: 'yyyy-mm',
	        autoclose: true,
	        todayBtn: true,
	        startView: 'year',
	        minView:'year',
	        maxView:'decade',    
	        language: 'zh-CN2'
		};
		//获取门户信息
		var svData;
		var setYear;
		var user;
		//定义数据对象
		var searchData = {};
		//获取表格数据对象
		var getTable = {};
		
		var sorttmplValueArr = [];
		
		//明细账
		var rptJournalArr = [
			{
				title:'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
	                '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'+
	                '<span></span> ' +
	                '</label>',
                className:"col-check",
                data:null
			},
			{
				title:'会计科目'
					+'<div class="rpt-funnel acco-set"><span class="glyphicon icon-filter rpt-funnelBtn"></span><div class="rpt-funnelBox rpt-funnelBoxText">'
					+'<div class="range-box"><input type="range" value="0" max="10" min="0" step="1" /></div>'
					+'<div class="range-info"><ul class="list-unstyled clearfix">'
					+'<li class="act"><a href="javascript:void(0);">全部</a></li>'
					+'<li><a href="javascript:void(0);">1级</a></li><li><a href="javascript:void(0);">2级</a></li>'
					+'<li><a href="javascript:void(0);">3级</a></li><li><a href="javascript:void(0);">4级</a></li>'
					+'<li><a href="javascript:void(0);">5级</a></li><li><a href="javascript:void(0);">6级</a></li>'
					+'<li><a href="javascript:void(0);">7级</a></li><li><a href="javascript:void(0);">8级</a></li>'
					+'<li><a href="javascript:void(0);">9级</a></li><li><a href="javascript:void(0);">末级</a></li>'
					+'</ul></div>'
					+'<p class="rpt-funnelCont clearfix"><span class="pull-left">提示：拖动滑块按级次筛选科目。</span><button class="btn btn-primary btn-sm pull-right btn-confirm">确定</button></p>'
					+'</div></div>',
                data:"accoName"
			},
			{
				title:'辅助核算项'
					+'<div id="accounting-set" class="rpt-funnel"><span class="glyphicon icon-setting rpt-funnelBtn"></span></div>',
                data:"eleName"
			},
//			{
//				title:"打印张数",
//              data:"pageCount"
//			},
			{
				title:"操作",
                data:null
			}
		];
		
		//总账
		var rptLedgerArr = [
			{
				title:'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
	                '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'+
	                '<span></span> ' +
	                '</label>',
                className:"col-check",
                data:null
			},
			{
				title:'会计科目'
					+'<div class="rpt-funnel acco-set"><span class="glyphicon icon-filter rpt-funnelBtn"></span><div class="rpt-funnelBox rpt-funnelBoxText">'
					+'<div class="range-box"><input type="range" value="0" max="10" min="0" step="1" /></div>'
					+'<div class="range-info"><ul class="list-unstyled clearfix">'
					+'<li class="act"><a href="javascript:void(0);">全部</a></li>'
					+'<li><a href="javascript:void(0);">1级</a></li><li><a href="javascript:void(0);">2级</a></li>'
					+'<li><a href="javascript:void(0);">3级</a></li><li><a href="javascript:void(0);">4级</a></li>'
					+'<li><a href="javascript:void(0);">5级</a></li><li><a href="javascript:void(0);">6级</a></li>'
					+'<li><a href="javascript:void(0);">7级</a></li><li><a href="javascript:void(0);">8级</a></li>'
					+'<li><a href="javascript:void(0);">9级</a></li><li><a href="javascript:void(0);">末级</a></li>'
					+'</ul></div>'
					+'<p class="rpt-funnelCont clearfix"><span class="pull-left">提示：拖动滑块按级次筛选科目。</span><button class="btn btn-primary btn-sm pull-right btn-confirm">确定</button></p>'
					+'</div></div>',
                data:"accoName"
			},
//			{
//				title:"打印张数",
//              data:"pageCount"
//			},
			{
				title:"操作",
                data:null
			}
		];
		
		return{
			
			//数组去重
			uniqueArray:function(array, key){
			    var result = (array[0]==undefined)?[]:[array[0]];
			    for(var i = 1; i < array.length; i++){
			        var item = array[i];
			        var repeat = false;
			        for (var j = 0; j < result.length; j++) {
			            if (item[key] == result[j][key]) {
			                repeat = true;
			                break;
			            }
			        }
			        if (!repeat) {
			            result.push(item);
			        }
			    }
			    return result;
			},
			getPdf:function(result){
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				var ids = $('#rptTemplate option:selected').attr('valueid')
				var templId = $('#rptTemplate option:selected').attr('templId')
				formData.append('reportCode', ids)
				formData.append('templId', templId)
				var datas = []
				for(var i=0;i<result.data.data.length;i++){
					datas.push({"GL_RPT_PRINT":result.data.data[i]})
				}
				formData.append('groupDef', JSON.stringify(datas))
				if(datas.length==0){
					ufma.showTip('发生额与余额都为零，不需打印')
					return false;
				}
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
			},
			printcallback : function(result){
				var pData= result.data;
				var domain = printServiceUrl + '/pqr/pages/query/query.html';
				var uniqueInfo = new Date().getTime().toString()
				var url = domain+
					'?sys=100&code='+TMPL_CODEs+'&'+isprint+'&' +
					'uniqueInfo=' + uniqueInfo
				var myPopup = window.open(url, uniqueInfo);
				var dataCnt = 0;
				var connected =false;
				var index = setInterval(function () {
					if (connected) {
						clearInterval(index)
					} else {
						var message = {uniqueInfo: uniqueInfo, type: 0}
						console.log(message)
						//send the message and target URI
						myPopup.postMessage(message, domain)
					}
				}, 2000)
				window.addEventListener('message', function (event) {
						//连接通信
				if (event.data.hasOwnProperty('uniqueInfo')) {
					if (event.data.uniqueInfo === uniqueInfo) {
						if (event.data.result === 0) {
							connected = true;
				//如果发送测试数据未关闭，先关闭发送测试数据index
							console.log(event.data.uniqueInfo)
							//第一遍发送数据
							var message ;
							var dType = 1;
							if(1 == pData.data.length){
								dType = 2;
							}
							message = {
									uniqueInfo: uniqueInfo, type: dType,dataType:1,
									data: {
										'GL_RPT_PRINT': pData.data[0]
									}
							}
							console.log(JSON.stringify(message))
							myPopup.postMessage(message, domain)
						} else if (event.data.result === 1) {
							if (connected) {
								dataCnt++;
								var message ;
								var dType = 1;
								if(dataCnt == (pData.data.length-1)){
									dType = 2;
										}
								message = {
												uniqueInfo: uniqueInfo, type: dType,dataType:1,
												data: {
													'GL_RPT_PRINT': pData.data[dataCnt]
												}
								}
								console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
							}
						} else {
							console.log(event.data.reason)
						}
					}
				}
			}, false);
			},
			//根据单位、账套、账簿类型和账簿样式获取模板数据，接口：/gl/GlRpt/getPrtFormatList
			initRptTemplate:function(result){
				var data = result.data;
				
				var defaultType = true;//防止多个默认模板的开关变量
				
				//循环填入账簿样式
				for(var i=0;i<data.length;i++){
//					var jData = JSON.stringify(data[i]).replace(/\"/g,"'");
					var jData =data[i].reportCode
					//判断是否是默认
					var $op;
					if(data[i].defaultTmpl=="1"||defaultType==true){
						$op = $('<option value="'+jData+'" templId = '+data[i].templId+' valueid="' + data[i].reportCode + '" selected="selected">'+data[i].reportName+'</option>');
						defaultType = false;
					}else{
						$op = $('<option value="'+jData+'"  templId = '+data[i].templId+' valueid="' + data[i].reportCode + '">'+data[i].reportName+'</option>');
					}
					$('#rptTemplate').append($op);
					
					sorttmplValueArr.push(data[i].sorttmplValue);
				}
			},
			
			//根据单位、账套和账簿类型获取账簿样式，接口：/gl/GlRpt/RptFormats
			initRptStyle:function(result){
				var data = result.data;
				
				//循环填入账簿样式
				for(var i=0;i<data.length;i++){
					var $op = $('<option value="'+data[i].rptFormat+'">'+data[i].rptFormatName+'</option>');
					$('#rptStyle').append($op);
				}
				$('#rptStyle').val("SANLAN");
				$('#rptPrint-data thead').html('');
				searchData.rptFormat = 'SANLAN';
/*				if($('#rptType option:selected').val() == "GL_RPT_LEDGER" && $('#rptStyle option:eq(0)').val() == "SHULIANG"){
					//如果是总账并且第一个是数量金额式，则选择第二个
					$('#rptStyle option:eq(1)').prop("selected",true);
					//获取第二个数据的账簿样式
					searchData.rptFormat = data[1].rptFormat;
				}else{
					//获取第一个数据的账簿样式
					searchData.rptFormat = data[0].rptFormat;
				}*/
				
				var postSetData = {
					agencyCode: searchData.agencyCode,
					acctCode: searchData.acctCode,
					componentId: $('#rptType option:selected').val(),
					rgCode:svData.svRgCode,
					setYear:svData.svSetYear,
					sys:'100',
					directory:$('#rptType option:selected').text()+$('#rptStyle option:selected').text()
				};
				//加载模板
//				ufma.post("/gl/GlRpt/getPrtFormatList",postSetData,page.initRptTemplate);
//				ufma.post("/pqr/api/templ?sys=100",postSetData,page.initRptTemplate);
				$.ajax({
					type: "POST",
					url: "/pqr/api/templ",
					dataType: "json",
					data: postSetData,
					success: function(data) {
						page.initRptTemplate(data)
					},
					error: function() {}
				});
				//根据单位、账套（、账簿类型和账簿样式）获取表格数据，跟根据账簿类型确定表格展示内容
				var callback = function(result){
					var tableData = result.data;
					switch (searchData.componentId){
						case "GL_RPT_JOURNAL":
							//明细账
							page.getRptPrintTable(tableData,rptJournalArr,searchData.componentId);
							break;
						case "GL_RPT_LEDGER":
							//总账
							page.getRptPrintTable(tableData,rptLedgerArr,searchData.componentId);
							break;
						default:
							break;
					}
				}
				ufma.get("/gl/GlRpt/search/"+searchData.agencyCode+"/"+searchData.acctCode+"/"+searchData.componentId+"/"+searchData.rptFormat,"",callback);
			},
			
			//填入账簿类型，接口：/gl/enumerate/RPT_TYPE
			initRptType:function(result){
				var data = result.data;
				
				//循环填入账簿类型
				for(var i=0;i<data.length;i++){
					var $op = $('<option value="'+data[i].ENU_CODE+'">'+data[i].ENU_NAME+'</option>');
					$('#rptType').append($op);
				}
				
				//获取第一个数据的账簿类型
				searchData.componentId = data[0].ENU_CODE;
				var searchFormats = {};
				searchFormats.agencyCode = searchData.agencyCode;
				searchFormats.acctCode = searchData.acctCode;
				searchFormats.componentId = searchData.componentId;
				//加载账簿样式
				ufma.post("/gl/GlRpt/RptFormats",searchFormats,page.initRptStyle);
			},
			
			//获取打印表格数据,接口：/gl/GlRpt/search/{agencyCode}/{acctCode}/{tableType}/{tableFormat}
			getRptPrintTable:function(tableData,columnsArr,type){
				var columnDefsArr = [];
				var id = "rptPrint-data";
                var toolBar = $('#'+id).attr('tool-bar');
                var data = tableData;
                if(type=="GL_RPT_JOURNAL"){
                	//明细账
                	columnDefsArr = [
                		{
                			"targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "col-check",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="checkboxes" value="' + data + '" data-leaf="'+rowdata.isLeaf+'" data-level="'+rowdata.levelNum+'" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                		},
                		{
                			"targets": [1],
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<span class="searchTxt">'+rowdata.accoCode+' '+rowdata.accoName+'</span>';
                            }
                		},
                		{
                			"targets": [2],
                			"serchable": false,
                            "orderable": false,
                            "className": "td-li",
                            "render": function (data, type, rowdata, meta) {
                            	var ul;
                            	if(rowdata.eleName!=null&&rowdata.eleSource!=null&&rowdata.codeRule!=null&&rowdata.eleCode!=null){
                            		var eleNameArr = rowdata.eleName.split(",");
                            		var eleSourceArr = rowdata.eleSource.split(",");
                            		var codeRuleArr = rowdata.codeRule.split(",");
                            		var eleCodeArr = rowdata.eleCode.split(",");
                            		var li = '';
                            		for(var i=0;i<eleSourceArr.length;i++){
                            			li += '<li class="accounting-item">'
                            			if(eleNameArr[i]!=''){
	                            			li += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
	                            			li += '<input type="checkbox" name="'+rowdata.accoCode+'" value="'+eleSourceArr[i]+'" data-rule="'+codeRuleArr[i]+'" data-code="'+eleCodeArr[i]+'">'
	                            			li += '<i title ='+eleNameArr[i]+'>'+eleNameArr[i]+'</i>'
                            			}
                            			li += '&nbsp;<span></span></label>'
                            			li += '<a class="accounting-btn pull-right"><span class="glyphicon icon-filter"></span></a></li>';
                            		}
                            		ul = '<ul class="list-unstyled accounting-list clearfix">'+li+'</ul>';
                            	}else{
                            		ul = '';
                            	}
                                return ul;
                            }
                		},
//              		{
//              			"targets": [3],
//              			"serchable": false,
//                          "orderable": false,
//                          "className": "td-count",
//                          "render": function (data, type, rowdata, meta) {
//								var count;
//								if(!$.isNull(rowdata.pageCount)){  //guohx修改本地后台返回"" 没有计算按钮问题
//                          	//if(rowdata.pageCount!=null){
//                          		count = rowdata.pageCount;
//                          	}else{
//                          		count = '<a href="javascript:void(0);" class="count">计算</a>';
//                          	}
//                              return count;
//                          }
//              		},
                		{
//              			"targets": [4],
							"targets": [3],
                			"serchable": false,
                            "orderable": false,
                            "className": "td-action",
                            "render": function (data, type, rowdata, meta) {
                                return '<a class="btn btn-icon-only btn-sm btn-permission btn-print-preview" data-toggle="tooltip" action= "" title="打印预览">'
                                	+'<span class="glyphicon icon-print-preview"></span></a>'
                                	+'<a class="btn btn-icon-only btn-sm btn-permission btn-print" data-toggle="tooltip" action= "" title="直接打印">'
                                	+'<span class="glyphicon icon-print"></span></a>';
                            }
                		}
                	];
                }else if(type=="GL_RPT_LEDGER"){
                	//总账
                	columnDefsArr = [
                		{
                			"targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "col-check",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="checkboxes" value="' + data + '" data-leaf="'+rowdata.isLeaf+'" data-level="'+rowdata.levelNum+'" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                		},
                		{
                			"targets": [1],
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<span>'+rowdata.accoCode+' '+rowdata.accoName+'</span>';
                            }
                		},
//              		{
//              			"targets": [2],
//              			"serchable": false,
//                          "orderable": false,
//                          "className": "td-count",
//                          "render": function (data, type, rowdata, meta) {
//                          	var count;
//                          	if(rowdata.pageCount!=null){
//                          		count = rowdata.pageCount;
//                          	}else{
//                          		count = '<a href="javascript:void(0);" class="count">计算</a>';
//                          	}
//                              return count;
//                          }
//              		},
                		{
//              			"targets": [3],
                			"targets": [2],
                			"serchable": false,
                            "orderable": false,
                            "className": "td-action",
                            "render": function (data, type, rowdata, meta) {
                                return '<a class="btn btn-icon-only btn-sm btn-permission btn-print-preview" data-toggle="tooltip" action= "" title="打印预览">'
                                	+'<span class="glyphicon icon-print-preview"></span></a>'
                                	+'<a class="btn btn-icon-only btn-sm btn-permission btn-print" data-toggle="tooltip" action= "" title="直接打印">'
                                	+'<span class="glyphicon icon-print"></span></a>';
                            }
                		}
                	];
                }
                rptPrintDataTable = $("#" + id).DataTable({
                	"language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
                    "data":data,
                    "bFilter": false,    //去掉搜索框
                    "bLengthChange": true,   //去掉每页显示多少条数据
                    "processing": true,//显示正在加载中
                    "pageLength": -1,
                    "bSort": false, //排序功能
                    "bAutoWidth": false,//表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    "columns":columnsArr,
			      	"columnDefs":columnDefsArr,
			      	"dom":'rt<"'+id+'-paginate">',
			      	"initComplete":function(settings,json){
			      		//行checkbox的单选操作
                        /*$("#" + id + " tbody td.nowrap").on("click", function (e) {
                            e.preventDefault();
                            var $ele = $(e.target);
                            var $tr = $ele.closest("tr");
                            if ($tr.hasClass("selected")) {
                                $tr.find("input.checkboxes").prop("checked", false);
                                $tr.removeClass("selected");
                            } else {
                                $tr.find("input.checkboxes").prop("checked", true);
                                $tr.addClass("selected");
                            }
                        });*/
                       
                       	//批量操作toolbar与分页
                        var $info = $(toolBar +' .info');
                        if($info.length == 0){
                            $info = $('<div class="info"></div>').appendTo($(toolBar+' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.'+id+'-paginate').appendTo($info);
                        
                        //checkbox的全选操作
                        $(".datatable-group-checkable").on("change", function () {
                            var isCorrect = $(this).is(":checked");
                            $("#" + id + " .checkboxes").each(function () {
                                isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
                            })
                            $(".datatable-group-checkable").prop("checked", isCorrect);
                        });
			      	},
			      	"drawCallback":function(settings){
			      		$("#rptPrint-data").find("td.dataTables_empty").text("").append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                    	if($("#rptPrint-data td.dataTables_empty").get(0)){
                    		$("#rptPrint-data input.datatable-group-checkable").prop("disabled",true);
                    		$("#rptPrint-tool-bar input.datatable-group-checkable").prop("disabled",true);
                    		$('#rptPrint-data .acco-set').hide();
                    		$('#rptPrint-data #accounting-set').hide();
                    	}else{
                    		$("#rptPrint-data input.datatable-group-checkable").prop("disabled",false);
                    		$("#rptPrint-tool-bar input.datatable-group-checkable").prop("disabled",false);
                    		$('#rptPrint-data .acco-set').show();
                    		$('#rptPrint-data #accounting-set').show();
                    	}
			      		
			      		//操作按钮显示tips
	                    $('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();
	                    
	                    //权限判断
											ufma.isShow(page.reslist);
	                    
	                    //获取模板信息，接口：/gl/GlRpt/getRptModel
	                    switch (searchData.componentId){
	                    	case "GL_RPT_JOURNAL":
	                    		var infoPost = {};
	                    		infoPost.agencyCode = searchData.agencyCode;
	                    		infoPost.acctCode = searchData.acctCode;
	                    		infoPost.componentId = searchData.componentId;
	                    		var infoCallback = function(result){
	                    			if(result.data!=null){
	                    				var tmplValue = eval("("+result.data.tmplValue+")");
		                    			//循环科目
															if(tmplValue!=undefined){
																for(var i=0;i<tmplValue.length;i++){
																	//遍历对应的科目的辅助核算项
																$('#rptPrint-data input[name="'+tmplValue[i].acco+'"]').each(function(){
																	//循环辅助项
																	for(var j=0;j<tmplValue[i].element.length;j++){
																		if($(this).attr('data-code')==tmplValue[i].element[j].eleCode){
																			$(this).prop('checked',true);
																			if(tmplValue[i].element[j].content!=undefined){
																				$(this).attr('data-content',JSON.stringify(tmplValue[i].element[j].content).replace(/\"/g,"'"));
																			}
																			var t = (tmplValue[i].element[j].printCode==undefined)?"":tmplValue[i].element[j].printCode;
																				$(this).attr('data-type',t);
																				var l = (tmplValue[i].element[j].printLevle==undefined)?"":tmplValue[i].element[j].printLevle;
																				$(this).attr('data-levle',l);
																		}
																		}
																});
																}
															}
		                    			
	                    			}
	                    			
	                    		};
	                    		ufma.post("/gl/GlRpt/getRptModel",infoPost,infoCallback);
	                    		break;
	                    	default:
	                    		break;
	                    }
			      	}
                });
			},
			
			//设置本期
			setMonth:function(){
//				$('#rptPrint').find("#startDate,#endDate").datetimepicker(glRptBalDate);
				var dd = new Date();
				var ddYear = dd.getFullYear();
				var ddmonth = dd.getMonth() +1;
				$("#startDate").getObj().setValue(ddYear+ '-' + ddmonth)
				$("#endDate").getObj().setValue(ddYear+ '-' + ddmonth)
//				$('#rptPrint').find("#startDate").datetimepicker('setDate',(new Date()));
//				$('#rptPrint').find("#endDate").datetimepicker('setDate',(new Date()));
			},
			
			//设置本年
			setYear:function(){
				var dd = new Date();
				var ddYear = dd.getFullYear();
				$("#startDate").getObj().setValue(ddYear + '-01')
				$("#endDate").getObj().setValue(ddYear + '-12')
//				$('#rptPrint').find("#startDate").datetimepicker('setDate',(new Date(ddYear,0)));
//				$('#rptPrint').find("#endDate").datetimepicker('setDate',(new Date(ddYear,11)));
			},
			
			getLastDay:function(year,month){
				 var new_year = year;    //取当前的年份          
	             var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
	             if(month>12) {         
	              new_month -=12;        //月份减          
	              new_year++;            //年份增          
	             }         
	             var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天          
	             return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期 
			},
			
			//返回账表其他选项的数组对象
			rptOptionArr:function(){
				var rptOptionArr = [];
				$('#rptPrint .rptOption').each(function(){
					var rptOptionObj = {};
					
					var flag = $(this).prop("checked");
					if(flag){
						rptOptionObj.defCompoValue = "Y";
					}else{
						rptOptionObj.defCompoValue = "N";
					}
					
					rptOptionObj.optCode = $(this).val();
					if($(this).val()=="IS_JUSTSHOW_OCCFISPERD"){
						rptOptionObj.optName = "只显示有发生期间";
					}else if($(this).val()=="IS_INCLUDE_UNPOST"){
						rptOptionObj.optName = "含未记账凭证";
					}
					
					rptOptionArr.push(rptOptionObj);
					
				})
				var rptOptionObj = {};
				var flag = $('#isHaveAmtAndCurCheck').prop('checked')?true:false;
				if(flag){
					rptOptionObj.defCompoValue = "Y";
				}else{
					rptOptionObj.defCompoValue = "N";
				}
				rptOptionObj.optCode = "IS_HAVE_AMTANDCUR";
				rptOptionObj.optName = "发生额及余额为零不打印";
				rptOptionArr.push(rptOptionObj);
				return rptOptionArr;
			},
			
			//返回辅助项的数组对象
			qryItemsArr:function(dom){
				var qryItemsArr = [];
				
				if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
					//明细账
//					$('#rptPrint-data tr input.checkboxes:checked').parents('tr').each(function(){
						var qryItemsObj = {};
						qryItemsObj.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
						qryItemsObj.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
						qryItemsObj.itemPos =  "condition";//核算项数据位置（行、列）
						qryItemsObj.itemType = "ACCO";//核算项类别代码
						qryItemsObj.itemTypeName = "会计科目";//核算项类别名称
//						qryItemsObj.seq = 0;//核算项类别顺序号
						qryItemsObj.items = [];//选择的核算项的值
						qryItemsObj.isShowItem ='1'
// 						var itemObj = {};
// 						itemObj.code = rptPrintDataTable.row(dom).data().accoCode;
// 						itemObj.name = rptPrintDataTable.row(dom).data().accoCode + " " + rptPrintDataTable.row(dom).data().accoName;
// 						itemObj.fullname = rptPrintDataTable.row(dom).data().accoFullname;
// 						qryItemsObj.items.push(itemObj);
						if($('#rptPrint-data tbody tr:visible.selected').get(0)){
							$('#rptPrint-data tbody tr:visible.selected').each(function(){
								var itemObj = {};
								itemObj.code = rptPrintDataTable.row($(this)).data().accoCode;
								itemObj.name = rptPrintDataTable.row($(this)).data().accoCode +' '+ rptPrintDataTable.row($(this)).data().accoName;
								itemObj.fullname = rptPrintDataTable.row($(this)).data().accoFullname;
								qryItemsObj.items.push(itemObj);
								if($(this).find('.accounting-item input:checked').length>0){
									//循环辅助项
									for(var i=0;i<$(this).find('.accounting-item input:checked').length;i++){
										var qryItemsObj2 = {};
										qryItemsObj2.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
										qryItemsObj2.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
										qryItemsObj2.itemPos =  "condition";//核算项数据位置（行、列）
										qryItemsObj2.accoCode = rptPrintDataTable.row($(this)).data().accoCode
										qryItemsObj2.itemType = $(this).find('.accounting-item input:checked').eq(i).attr('data-code');//核算项类别代码
										qryItemsObj2.itemTypeName = $(this).find('.accounting-item input:checked').eq(i).parent().text();//核算项类别名称
//										qryItemsObj2.seq = i+1;//核算项类别顺序号
										qryItemsObj2.items = [];//选择的核算项的值
										qryItemsObj2.isShowItem ='1'
										var content = eval("("+$(this).find('.accounting-item input:checked').eq(i).attr('data-content')+")");
										if(!$.isNull(content)){
											for(var j=0;j<content.length;j++){
												var itemObj2 = {};
												itemObj2.code = content[j].code;
												itemObj2.name = content[j].name;
												qryItemsObj2.items.push(itemObj2);
											}
										}
										qryItemsArr.push(qryItemsObj2);
									}
								}
							});
						}else{
							$('#rptPrint-data tbody tr:visible').each(function(){
								var itemObj = {};
								itemObj.code = rptPrintDataTable.row($(this)).data().accoCode;
								itemObj.name = rptPrintDataTable.row($(this)).data().accoCode + ' ' + rptPrintDataTable.row($(this)).data().accoName;
								itemObj.fullname = rptPrintDataTable.row($(this)).data().accoFullname;
								qryItemsObj.items.push(itemObj);
								if($(this).find('.accounting-item input:checked').length>0){
									//循环辅助项
									for(var i=0;i<$(this).find('.accounting-item input:checked').length;i++){
										var qryItemsObj2 = {};
										qryItemsObj2.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
										qryItemsObj2.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
										qryItemsObj2.itemPos =  "condition";//核算项数据位置（行、列）
										qryItemsObj2.accoCode = rptPrintDataTable.row($(this)).data().accoCode
										qryItemsObj2.itemType = $(this).find('.accounting-item input:checked').eq(i).attr('data-code');//核算项类别代码
										qryItemsObj2.itemTypeName = $(this).find('.accounting-item input:checked').eq(i).parent().text();//核算项类别名称
//										qryItemsObj2.seq = i+1;//核算项类别顺序号
										qryItemsObj2.items = [];//选择的核算项的值
										qryItemsObj2.isShowItem ='1'
										var content = eval("("+$(this).find('.accounting-item input:checked').eq(i).attr('data-content')+")");
										if(!$.isNull(content)){
											for(var j=0;j<content.length;j++){
												var itemObj2 = {};
												itemObj2.code = content[j].code;
												itemObj2.name = content[j].name;
												qryItemsObj2.items.push(itemObj2);
											}
										}
										qryItemsArr.push(qryItemsObj2);
									}
								}
							});
						}
						qryItemsArr.push(qryItemsObj);
						
// 						if(dom.find('.accounting-item input:checked').length>0){
// 							//循环辅助项
// 							for(var i=0;i<dom.find('.accounting-item input:checked').length;i++){
// 								var qryItemsObj2 = {};
// 								qryItemsObj2.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
// 								qryItemsObj2.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
// 								qryItemsObj2.itemPos =  "condition";//核算项数据位置（行、列）
// 								qryItemsObj2.itemType = dom.find('.accounting-item input:checked').eq(i).attr('data-code');//核算项类别代码
// 								qryItemsObj2.itemTypeName = dom.find('.accounting-item input:checked').eq(i).parent().text();//核算项类别名称
// 								qryItemsObj2.seq = i+1;//核算项类别顺序号
// 								qryItemsObj2.items = [];//选择的核算项的值
// 								var content = eval("("+dom.find('.accounting-item input:checked').eq(i).attr('data-content')+")");
// 								if(!$.isNull(content)){
// 									for(var j=0;j<content.length;j++){
// 										var itemObj2 = {};
// 										itemObj2.code = content[j].code;
// 										itemObj2.name = content[j].name;
// 										qryItemsObj2.items.push(itemObj2);
// 									}
// 								}
// 								qryItemsArr.push(qryItemsObj2);
// 							}
// 						}
//					});
				
				}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
					//总账
					var qryItemsObj = {};
					qryItemsObj.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
					qryItemsObj.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
					qryItemsObj.itemPos =  "condition";//核算项数据位置（行、列）
					qryItemsObj.itemType = "ACCO";//核算项类别代码
					qryItemsObj.itemTypeName = "会计科目";//核算项类别名称
//					qryItemsObj.seq = 0;//核算项类别顺序号
					qryItemsObj.items = [];//选择的核算项的值
					if($('#rptPrint-data tbody tr:visible.selected').get(0)){
						$('#rptPrint-data tbody tr:visible.selected').each(function(){
							var itemObj = {};
							itemObj.code = rptPrintDataTable.row($(this)).data().accoCode;
							itemObj.name = rptPrintDataTable.row($(this)).data().accoCode +' '+ rptPrintDataTable.row($(this)).data().accoName;
							itemObj.fullname = rptPrintDataTable.row($(this)).data().accoFullname;
							qryItemsObj.items.push(itemObj);
						});
					}else{
						$('#rptPrint-data tbody tr:visible').each(function(){
							var itemObj = {};
							itemObj.code = rptPrintDataTable.row($(this)).data().accoCode;
							itemObj.name = rptPrintDataTable.row($(this)).data().accoCode + ' ' + rptPrintDataTable.row($(this)).data().accoName;
							itemObj.fullname = rptPrintDataTable.row($(this)).data().accoFullname;
							qryItemsObj.items.push(itemObj);
						});
					}
					qryItemsArr.push(qryItemsObj);
				}
				
				return qryItemsArr;
			},
			
			//返回方案内容对象
			prjContObj:function(dom){
				//方案内容
				prjContObj = {};
				
				//会计体系代码
				prjContObj.accaCode = "*";
				
				//选择的单位账套信息
				prjContObj.agencyAcctInfo = [];
				var acctInfoObj = {};
				acctInfoObj.acctCode = searchData.acctCode;//账套代码
				acctInfoObj.agencyCode = searchData.agencyCode;//单位代码
				prjContObj.agencyAcctInfo.push(acctInfoObj);
				
				if($('#rptType option:selected').val() == "GL_RPT_BAL" || $('#rptType option:selected').val() == "GL_RPT_LEDGER"){
					prjContObj.startDate = "";//起始日期(如2017-01-01)
					prjContObj.endDate = "";//截止日期(如2017-12-31)
								
					prjContObj.startYear = new Date($("#startDate").getObj().getValue()).getFullYear().toString();//起始年度(只有年，如2017)
					prjContObj.startFisperd = (new Date($("#startDate").getObj().getValue()).getMonth()+1).toString();//起始期间(只有月份，如7)
					prjContObj.endYear = new Date($("#endDate").getObj().getValue()).getFullYear().toString();//截止年度(只有年，如2017)
					prjContObj.endFisperd = (new Date($("#endDate").getObj().getValue()).getMonth()+1).toString();//截止期间(只有月份，如7)
				}else if($('#rptType option:selected').val() == "GL_RPT_JOURNAL" || $('#rptType option:selected').val() == "GL_RPT_DAILYJOURNAL" || $('#rptType option:selected').val() == "GL_RPT_VOUSUMMARY" || $('#rptType option:selected').val() == "GL_RPT_COLUMNAR"){
					var endYear = new Date($("#endDate").getObj().getValue()).getFullYear();
					var endFisperd = new Date($("#endDate").getObj().getValue()).getMonth()+1;
					prjContObj.startDate = $("#startDate").getObj().getValue() + "-01";//起始日期(如2017-01-01)
					prjContObj.endDate = $("#endDate").getObj().getValue() + "-" + page.getLastDay(endYear,endFisperd);//截止日期(如2017-12-31)
					
					prjContObj.startYear = "";//起始年度(只有年，如2017)
					prjContObj.startFisperd = "";//起始期间(只有月份，如7)
					prjContObj.endYear = "";//截止年度(只有年，如2017)
					prjContObj.endFisperd = "";//截止期间(只有月份，如7)
				}else{
					console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
				}
				
				if($('#rptType option:selected').val() != "GL_RPT_VOUSUMMARY"){
					//核算项设置
					prjContObj.qryItems = page.qryItemsArr(dom);
					//查询条件对象
					prjContObj.rptCondItem = [];
				}
				
				//账表查询项
				prjContObj.rptOption = page.rptOptionArr();
				
				prjContObj.curCode = "RMB";//币种代码
				prjContObj.rptStyle = $('#rptStyle option:selected').val();//账表样式
				prjContObj.rptTitleName = $('#rptType option:selected').text();//账表中标题名称
				
				return prjContObj;
			},
			
			//返回账表查询的入参结果集
			backTabArgu:function(dom){
				var tabArgu = {};
								
				tabArgu.acctCode = searchData.acctCode;//账套代码
				tabArgu.agencyCode = searchData.agencyCode;//单位代码
				tabArgu.acctName = searchData.acctName;
				tabArgu.agencyName = searchData.agencyName;
				
				tabArgu.prjCode = "";//方案代码
				tabArgu.prjName = "";//方案名称
				tabArgu.prjScope = "";//方案作用域
				
				tabArgu.rptType = $('#rptType option:selected').val();//账表类型
				tabArgu.setYear = setYear.toString();//业务年度
				tabArgu.userId = user;//用户id
				
				tabArgu.prjContent = page.prjContObj(dom);//方案内容
				
				return tabArgu;
			},
			
			//保存模板
			savePrtTmpl:function(){
				//科目
//				var tmplValueArr = [];
//				$('#rptPrint-data tr').each(function(){
//					//判断行内是否有有辅助项勾选
//					if($(this).find('ul').get(0)&&$(this).find('.accounting-item input[type="checkbox"]:checked').length!=0){
//						var tmplValueOne = {};
//						tmplValueOne.acco = rptPrintDataTable.row($(this)).data().accoCode;
//						
//						//辅助项
//						var elementArr = [];
//						//循环遍历
//						$('#rptPrint-data .accounting-item input[name="'+tmplValueOne.acco+'"]').each(function(){
//							//判断
//							if($(this).prop('checked')==true){
//								//定义辅助项
//								var elementOne = {};
//								elementOne.isPrint = "2";
//								//辅助项条件
//								if(typeof($(this).attr('data-content'))!="undefined"){
//									var contentData = eval("("+$(this).attr('data-content')+")");
//									elementOne.content = contentData;
//								}
//								//辅助项其他
//								elementOne.codeRule = $(this).attr('data-rule');
//								elementOne.eleSource = $(this).val();
//								elementOne.eleCode = $(this).attr('data-code');
//								elementOne.eleName = $(this).parent().text();
//								if(typeof($(this).attr('data-type'))!="undefined"){
//									elementOne.printCode = $(this).attr('data-type');
//									if(typeof($(this).attr('data-levle'))!="undefined"){
//										elementOne.printLevle = $(this).attr('data-levle');
//									}
//								}
//								elementArr.push(elementOne);
//							}
//						});
//						tmplValueOne.element = elementArr;
//						tmplValueArr.push(tmplValueOne);
//					}
//				});
//				
//				//保存数据
//				var savePost = {};
//				var prtPrint = {};
//				prtPrint.agencyCode = searchData.agencyCode;
//				prtPrint.acctCode = searchData.acctCode;
//				prtPrint.formattmplCode = eval("("+$('#rptPrint #rptTemplate option:selected').val()+")").formattmplCode;
//				prtPrint.componentId = $('#rptPrint #rptType option:selected').val();
//				prtPrint.tmplValue = JSON.stringify(tmplValueArr).replace(/\"/g,"'");
//				prtPrint.rptFormat = $('#rptPrint #rptStyle option:selected').val()
//				savePost.pubPrtPrintTmpl = prtPrint;
//				
//				var callback = function(result){}
//				ufma.post("/gl/GlRpt/saveRptModel",savePost,callback);
			},
			
			//计算页数
			countPages:function(dom){
				var tabArgu = {};
				
				tabArgu.acctCode = searchData.acctCode;//账套代码
				tabArgu.agencyCode = searchData.agencyCode;//单位代码
				
				tabArgu.prjCode = "";//方案代码
				tabArgu.prjName = "";//方案名称
				tabArgu.prjScope = "";//方案作用域
				
				tabArgu.rptType = $('#rptType option:selected').val();//账表类型
				tabArgu.setYear = setYear.toString();//业务年度
				tabArgu.userId = user;//用户id
				
				var prj = function(dom){
					//方案内容
					prjContObj = {};
					
					//会计体系代码
					prjContObj.accaCode = "*";
					
					//选择的单位账套信息
					prjContObj.agencyAcctInfo = [];
					var acctInfoObj = {};
					acctInfoObj.acctCode = searchData.acctCode;//账套代码
					acctInfoObj.agencyCode = searchData.agencyCode;//单位代码
					prjContObj.agencyAcctInfo.push(acctInfoObj);
					
					if($('#rptType option:selected').val() == "GL_RPT_BAL" || $('#rptType option:selected').val() == "GL_RPT_LEDGER"){
						prjContObj.startDate = "";//起始日期(如2017-01-01)
						prjContObj.endDate = "";//截止日期(如2017-12-31)
						
						prjContObj.startYear = new Date($("#startDate").getObj().getValue()).getFullYear().toString();//起始年度(只有年，如2017)
						prjContObj.startFisperd = (new Date($("#startDate").getObj().getValue()).getMonth()+1).toString();//起始期间(只有月份，如7)
						prjContObj.endYear = new Date($("#endDate").getObj().getValue()).getFullYear().toString();//截止年度(只有年，如2017)
						prjContObj.endFisperd = (new Date($("#endDate").getObj().getValue()).getMonth()+1).toString();//截止期间(只有月份，如7)
					}else if($('#rptType option:selected').val() == "GL_RPT_JOURNAL" || $('#rptType option:selected').val() == "GL_RPT_DAILYJOURNAL" || $('#rptType option:selected').val() == "GL_RPT_VOUSUMMARY" || $('#rptType option:selected').val() == "GL_RPT_COLUMNAR"){
						var endYear = new Date($("#endDate").getObj().getValue()).getFullYear();
						var endFisperd = new Date($("#endDate").getObj().getValue()).getMonth()+1;
						prjContObj.startDate = $("#startDate").getObj().getValue() + "-01";//起始日期(如2017-01-01)
						prjContObj.endDate = $("#endDate").getObj().getValue() + "-" + page.getLastDay(endYear,endFisperd);//截止日期(如2017-12-31)
						
						prjContObj.startYear = "";//起始年度(只有年，如2017)
						prjContObj.startFisperd = "";//起始期间(只有月份，如7)
						prjContObj.endYear = "";//截止年度(只有年，如2017)
						prjContObj.endFisperd = "";//截止期间(只有月份，如7)
					}else{
						console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
					}
					
					if($('#rptType option:selected').val() != "GL_RPT_VOUSUMMARY"){
						
						var qry = function(dom){
							var qryItemsArr = [];
			
							if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
								//明细账
								var qryItemsObj = {};
								qryItemsObj.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
								qryItemsObj.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
								qryItemsObj.itemPos =  "condition";//核算项数据位置（行、列）
								qryItemsObj.itemType = "ACCO";//核算项类别代码
								qryItemsObj.itemTypeName = "会计科目";//核算项类别名称
//								qryItemsObj.seq = 0;//核算项类别顺序号
								qryItemsObj.items = [];//选择的核算项的值
								var itemObj = {};
								itemObj.code = rptPrintDataTable.row(dom).data().accoCode;
								itemObj.name = rptPrintDataTable.row(dom).data().accoCode + " " + rptPrintDataTable.row(dom).data().accoName;
								itemObj.fullname = rptPrintDataTable.row(dom).data().accoFullname;
								qryItemsObj.items.push(itemObj);
								qryItemsArr.push(qryItemsObj);
								
								if(dom.find('.accounting-item input:checked').length>0){
									//循环辅助项
									for(var i=0;i<dom.find('.accounting-item input:checked').length;i++){
										var qryItemsObj2 = {};
										qryItemsObj2.itemPos =  "condition";//核算项数据位置（行、列）
										qryItemsObj2.itemType = dom.find('.accounting-item input:checked').eq(i).attr('data-code');//核算项类别代码
										qryItemsObj2.itemTypeName = dom.find('.accounting-item input:checked').eq(i).parent().text();//核算项类别名称
										qryItemsObj2.seq = i+1;//核算项类别顺序号
										qryItemsObj2.items = [];//选择的核算项的值
										var content = eval("("+dom.find('.accounting-item input:checked').eq(i).attr('data-content')+")");
										if(!$.isNull(content)){
											for(var j=0;j<content.length;j++){
												var itemObj2 = {};
												itemObj2.code = content[j].code;
												itemObj2.name = content[j].name;
												qryItemsObj2.items.push(itemObj2);
											}
										}
										qryItemsArr.push(qryItemsObj2);
									}
								}
							}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
								//总账
								var qryItemsObj = {};
								qryItemsObj.isShowCode = $('#rptPrint input[name="isShowCode"]').prop('checked')?"1":"0";
								qryItemsObj.isShowFullName = $('#rptPrint input[name="isShowFullName"]:checked').val();
								qryItemsObj.itemPos =  "condition";//核算项数据位置（行、列）
								qryItemsObj.itemType = "ACCO";//核算项类别代码
								qryItemsObj.itemTypeName = "会计科目";//核算项类别名称
								qryItemsObj.seq = 0;//核算项类别顺序号
								qryItemsObj.items = [];//选择的核算项的值
								var itemObj = {};
								itemObj.code = rptPrintDataTable.row(dom).data().accoCode;
								itemObj.name = rptPrintDataTable.row(dom).data().accoCode + " " + rptPrintDataTable.row(dom).data().accoName;
								itemObj.fullname = rptPrintDataTable.row(dom).data().accoFullname;
								qryItemsObj.items.push(itemObj);
								qryItemsArr.push(qryItemsObj);
							}
							
							return qryItemsArr;
						}
						
						//核算项设置
						prjContObj.qryItems = qry(dom);
						//查询条件对象
						prjContObj.rptCondItem = [];
					}
					
					//账表查询项
					prjContObj.rptOption = page.rptOptionArr();
					
					prjContObj.curCode = "RMB";//币种代码
					prjContObj.rptStyle = $('#rptStyle option:selected').val();//账表样式
					prjContObj.rptTitleName = $('#rptType option:selected').text();//账表中标题名称
					
					return prjContObj;
				}
				
				tabArgu.prjContent = prj(dom);//方案内容
				
				return tabArgu;
			},
			//打印目录传参
			postCatalog:function(postData){
				//清除缓存
				ufma.removeCache("iWantToPrint");
				
				//判断缓存
				var judgeCache = {};
				judgeCache.dataFrom = "rptPrintCatalog";
				judgeCache.direct = "0";
				
				var cacheData = {
					print:postData,
					judge:judgeCache
				};
				console.log(cacheData)
				ufma.setObjectCache("iWantToPrint",cacheData);
				window.open('../../pub/printpreview/printPreview.html');
			},
			
			//初始化页面
			initPage:function(){
				page.reslist = ufma.getPermission();
				svData = ufma.getCommonData();
				page.svTransDate = svData.svTransDate;
				$("#startDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: '',
				}).on('change', function() {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var startdate = $('#startDate').getObj().getValue();
					var enddate = $('#endDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						setTimeout(function () {
							var mydate = new Date(svData.svTransDate);
							Year = mydate.getFullYear();
							Month = (mydate.getMonth() + 1);
							Month = Month < 10 ? ('0' + Month) : Month;
							$('#startDate').getObj().setValue(Year + '-' + Month);
						}, 100)
					}
				})
				$("#endDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: '',
				}).on('change', function() {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var startdate = $('#startDate').getObj().getValue();
					var enddate = $('#endDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						setTimeout(function () {
							$('#endDate').getObj().setValue($('#startDate').getObj().getValue());
						}, 100)
					}
				})
				this.setMonth();
				//修改权限  将svUserCode改为 svUserId  20181012
				user = svData.svUserId;
				// user = svData.svUserCode;
				
				setYear = svData.svSetYear;
				
				//账套选择
				page.cbAcct = $("#cbAcct").ufmaCombox2({
            		valueField:'code',
					textField:'codeName',
					placeholder:'请选择账套',
					icon:'icon-book',
            		onchange:function(data){
						searchData.acctCode = data.code;
						searchData.acctName = data.name;
						
						$('#rptPrint #rptStyle').html('');
						$('#rptPrint #rptTemplate').html('');
						//根据单位和账套获取账簿类型
						$('#rptPrint #rptType').html('');
						ufma.get("/gl/enumerate/RPT_TYPE","",page.initRptType);
				    }
            	});
				
				//单位选择
				page.cbAgency=$("#cbAgency").ufmaTreecombox2({
					valueField:"id",
					textField:"codeName",
					readonly:false,
					placeholder:"请选择单位",
					icon:"icon-unit",
				    onchange:function(data){
				    	searchData.agencyCode = data.id;
				    	searchData.agencyName = data.name;
				    	
				    	//改变单位,账套选择内容改变
				    	var url = '/gl/eleCoacc/getRptAccts';
						var callback = function(result){
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data,"code",svData.svAcctCode);
							if(svFlag!=undefined){
								page.cbAcct.val(svData.svAcctCode);
							}else{
								page.cbAcct.val(result.data[0].code);
							}
						}
						ufma.get(url, {'userId':svData.svUserId,'setYear':svData.svSetYear,'agencyCode':searchData.agencyCode}, callback);
						//切换单位后取消全选
                        $(".datatable-group-checkable,.checkboxes").prop("checked",false);
				    }
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree","get","",function(result){
					page.cbAgency=$("#cbAgency").ufmaTreecombox2({
						data:result.data
					});
					var agyCode = $.inArrayJson(result.data,"id",svData.svAgencyCode);
			    	if(agyCode!=undefined){
			   			page.cbAgency.val(svData.svAgencyCode);
			   		}else{
			   			page.cbAgency.val(result.data[0].id);
			   		}
				});
				
			},
			
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function(){
				//表格单行选中
		       	$("#rptPrint-data").on("click","tbody td.nowrap,tbody td.col-check", function(e){
	        		e.preventDefault();
	            	var inputDom = $(this).parent().find('input.checkboxes');
	            	var inputCheck = $(inputDom).prop("checked");
	            	$(inputDom).prop("checked",!inputCheck);
	            	$(this).parent().toggleClass("selected");
	            	var $tmp = $(".checkboxes:checkbox");
	           		$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
	           		return false;
		        });
				
				//期间切换
				$('#rptPrint .setTimes').on('click','button',function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				$('.setTimeMonth').on('click',function(){
					page.setMonth();
				});
				$('.setTimeYear').on('click',function(){
					page.setYear();
				});
				
				//鼠标移入会计科目筛选，显示筛选级次框
				$('#rptPrint .dataTable').on('mouseover','.acco-set .rpt-funnelBtn',function(event){
					$('.rpt-funnelBoxText').show();
				});
				
				//点击辅助核算项表头设置按钮
				$('#rptPrint #rptPrint-data').on('click','#accounting-set',function(){
					var itemArr = [];
					$('#rptPrint-data .accounting-item').each(function(){
						if($(this).find('input[type="checkbox"]').length>0){
							var itemOne = {};
							itemOne.eleCode = $(this).find('input[type="checkbox"]').attr('data-code');
							itemOne.codeRule = $(this).find('input[type="checkbox"]').attr('data-rule');
							itemOne.eleName = $(this).find('input[type="checkbox"]').parents('label').text();
							if(typeof($(this).find('input[type="checkbox"]').attr('data-type'))!="undefined"){
								itemOne.printType = $(this).find('input[type="checkbox"]').attr('data-type');
							}else{
								itemOne.printType = "01";
							}
							if(typeof($(this).find('input[type="checkbox"]').attr('data-levle'))!="undefined"){
								itemOne.printLevle = $(this).find('input[type="checkbox"]').attr('data-levle');
							}else{
								itemOne.printLevle = "0";
							}
							itemArr.push(itemOne);
						}
					});
					//去除重复的辅助项
					itemArr = page.uniqueArray(itemArr,"eleCode");
					ufma.open({
                        url:'rptPrintPrintSet.html',
                        title:'辅助核算项打印设置',
                        width:950,
//                      height:600,
                        data:{action:"printSet",data:itemArr},
                        ondestory:function(data){
                        	//窗口关闭时回传的值
                            if(data.action=="confirm"){
                            	var ele = data.element;
	                            for(var i=0;i<ele.length;i++){
	                            	$('#rptPrint-data .accounting-item').each(function(){
		                            	if($(this).find('input[type="checkbox"]').attr('data-code')==ele[i].eleCode){
		                            		$(this).find('input[type="checkbox"]').attr('data-levle',ele[i].printLevle);
		                            		$(this).find('input[type="checkbox"]').attr('data-type',ele[i].printType);
		                            	}
		                            });
	                            }
                            }
                        }
                    });
				});
				//点击辅助核算项表格内的按钮
				$('#rptPrint').on('click','#rptPrint-data .accounting-btn',function(){
					//如果勾选才能打开页面
					if($(this).parents('.accounting-item').find('input').length>0){
						var conditionData = {};
						conditionData.agencyCode = searchData.agencyCode;
						conditionData.acctCode = searchData.acctCode;
						conditionData.eleSource = $(this).parents('.accounting-item').find('input').val();
						conditionData.accoCode = $(this).parents('.accounting-item').find('input').attr('name');
						conditionData.eleCode = $(this).parents('.accounting-item').find('input').attr('data-code');
						conditionData.content = eval("("+$(this).parents('.accounting-item').find('input').attr('data-content')+")");
						ufma.open({
	                        url:'rptPrintConditionSet.html',
	                        title:'条件设置',
	                        width:800,
//	                        height:480,
	                        data:{action:"conditionSet",data:conditionData},
	                        ondestory:function(data){
	                        	//窗口关闭时回传的值
	                            if(data.action=="confirm"){
	                            	$('input[name="'+data.accoCode+'"][value="'+data.eleSource+'"]').attr('data-content',JSON.stringify(data.content).replace(/\"/g,"'"));
	                            }
	                        }
	                    });
					}else{
						ufma.showTip('此科目暂无辅助核算',function(){},'warning')
					}
				});
				
				//切换账簿类型
				$('#rptPrint #rptType').on('change',function(){
					searchData.componentId = $(this).val();
					
					$('#rptPrint #rptTemplate').html('');

					$('#rptPrint-data thead').html('');
					rptPrintDataTable.clear().destroy();
					//加载账簿样式
					$('#rptPrint #rptStyle').html('');
					var searchFormats = {};
					searchFormats.agencyCode = searchData.agencyCode;
					searchFormats.acctCode = searchData.acctCode;
					searchFormats.componentId = searchData.componentId;
					ufma.post("/gl/GlRpt/RptFormats",searchFormats,page.initRptStyle);
				});
				
				//切换账簿样式
				$('#rptPrint #rptStyle').on('change',function(){
					searchData.rptFormat = $(this).val();
					
					//加载账簿样式
					$('#rptPrint #rptTemplate').html('');
					$('#rptPrint-data thead').html('');
					var postSetData = {
						agencyCode: searchData.agencyCode,
						acctCode: searchData.acctCode,
						componentId: $('#rptType option:selected').val(),
						rgCode:svData.svRgCode,
						setYear:svData.svSetYear,
						sys:'100',
						directory:$('#rptType option:selected').text()+$('#rptStyle option:selected').text()
					};
//					ufma.post("/gl/GlRpt/getPrtFormatList",postSetData,page.initRptTemplate);
//					ufma.post("/pqr/api/templ?sys=100",postSetData,page.initRptTemplate);

				$.ajax({
					type: "POST",
					url: "/pqr/api/templ",
					dataType: "json",
					data: postSetData,
					success: function(data) {
						page.initRptTemplate(data)
					},
					error: function() {}
				});
				});
				
				//点击打印封面按钮
				$('#rptPrint #btn-print-cover').on('click',function(){
					var postCoverData = {
						agencyName:page.cbAgency.getText(),
						rptName:$('#rptStyle option:selected').text()+""+$('#rptType option:selected').text(),
						setYear:setYear
					};
					ufma.open({
                        url:'rptPrintPrintCover.html',
                        title:'打印封面',
                        width:1000,
                        data:{action:'printCover',data:postCoverData},
                        ondestory:function(data){
                        	//窗口关闭时回传的值
                        }
                    });
				});
				
				//点击打印预览
				$('#btn-print-preview,#rp-print-preview').on('click',function(){
					if($('#rptPrint-data tbody tr .checkboxes').length>0){
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							//明细账先执行保存模板，接口：/gl/GlRpt/saveRptModel
							page.savePrtTmpl();
						}
						TMPL_CODEs = $('#rptTemplate option:selected').val()
						isprint = 'blank'
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.backTabArgu(''),page.printcallback);
						}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
							ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.backTabArgu(""),page.printcallback);
						}
					}else{
						ufma.showTip("当前单位账套下无数据", function() {}, "warning");
					}
				});
				
				//点击直接打印
				$('#btn-direct-print,#rp-direct-print').on('click',function(){
					if($('#rptPrint-data tbody tr .checkboxes').length>0){
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							//明细账先执行保存模板，接口：/gl/GlRpt/saveRptModel
							page.savePrtTmpl();
						}
						isprint = 'print'
						TMPL_CODEs = $('#rptTemplate option:selected').val()
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.backTabArgu(''),page.printcallback);
						}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
							ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.backTabArgu(""),page.printcallback);
						}
					}else{
						ufma.showTip("当前单位账套下无数据", function() {}, "warning");
					}
				});
				$('#btn-print-pdf,#btn-print-pdfs').on('click',function(){
					if($('#rptPrint-data tbody tr .checkboxes').length>0){
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							//明细账先执行保存模板，接口：/gl/GlRpt/saveRptModel
							page.savePrtTmpl();
						}
						isprint = 'print'
						TMPL_CODEs = $('#rptTemplate option:selected').val()
						if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.backTabArgu(''),page.getPdf);
						}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
							ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.backTabArgu(""),page.getPdf);
						}
					}else{
						ufma.showTip("当前单位账套下无数据", function() {}, "warning");
					}
				});
				//点击行内打印预览
				$('#rptPrint-data').on('click','a.btn-print-preview',function(){
					if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
						//明细账先执行保存模板，接口：/gl/GlRpt/saveRptModel
						page.savePrtTmpl();
					}
					isprint = 'blank'
					TMPL_CODEs = $('#rptTemplate option:selected').val()
					if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
						ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.countPages($(this).parents('tr')),page.printcallback);
					}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
						ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.countPages($(this).parents('tr')),page.printcallback);
					}
				});
				
				//点击行内直接打印
				$('#rptPrint-data').on('click','a.btn-print',function(){
					if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
							//明细账先执行保存模板，接口：/gl/GlRpt/saveRptModel
						page.savePrtTmpl();
					}
					isprint = 'print'
					TMPL_CODEs = $('#rptTemplate option:selected').val()
					if($('#rptType option:selected').val()=="GL_RPT_JOURNAL"){
						ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.countPages($(this).parents('tr')),page.getPdf);
					}else if($('#rptType option:selected').val()=="GL_RPT_LEDGER"){
						ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.countPages($(this).parents('tr')),page.getPdf);
					}
				});
				
				//点击计算页数
				$('#rptPrint-data').on('click','.count',function(){
					var td = $(this).parents('td.td-count');
					//账表打印数据查询（计算用） ，接口/gl/rpt/getReportPrintData/{rptType}
					var getPdata = function(result){
						var p_data = result.data;
						
						//获取其他的打印模板数据
						var t = eval("("+$('#rptTemplate option:selected').val()+")");
						var p_form = t.formattmplValue;
						var n = $('#rptTemplate option:selected').index();
						var p_formtmpl = sorttmplValueArr[n];
						var p_paper = {
							marginBottom:t.marginBottom,
							marginLeft:t.marginLeft,
							marginRight:t.marginRight,
							marginTop:t.marginTop,
							paperCode:t.paperCode,
							paperHeight:t.paperHeight,
							paperName:t.paperName,
							paperOrientation:t.paperOrientation,
							paperWidth:t.paperWidth
						}
						var options = {};
						var result = getPrintHtml(p_formtmpl, p_paper, eval("("+p_form+")"), p_data, options);
						td.text(result.pageCount);
						td.parents('tr').addClass('calculated');
					}
					ufma.post("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),page.countPages($(this).parents('tr')),getPdata);
				});
				
				//点击打印目录
				$('#btn-print-catalog').on('click',function(){
					//勾选科目间连续编页码才能打印目录
					if($('input[name="pagination"][value="1"]').prop('checked')==true){
						//计算页码
						//有勾选打勾选，没勾选打全部
						var $cTr;
						if($('#rptPrint-data tr.selected').length>0){
							$cTr = $('#rptPrint-data tbody tr:visible.selected');
						}else{
							$cTr = $('#rptPrint-data tbody tr:visible');
						}
				
//						$cTr.not(".calculated").each(function(){
//							console.log($(this));
//							var td = $(this).find('td.td-count');
//							//账表打印数据查询（计算用） ，接口/gl/rpt/getReportPrintData/{rptType}
//							var getPdata = function(result){
//								var p_data = result.data;
//								
//								//获取其他的打印模板数据
//								var t = eval("("+$('#rptTemplate option:selected').val()+")");
//								var p_form = t.formattmplValue;
//								var n = $('#rptTemplate option:selected').index();
//								var p_formtmpl = sorttmplValueArr[n];
//								var p_paper = {
//									marginBottom:t.marginBottom,
//									marginLeft:t.marginLeft,
//									marginRight:t.marginRight,
//									marginTop:t.marginTop,
//									paperCode:t.paperCode,
//									paperHeight:t.paperHeight,
//									paperName:t.paperName,
//									paperOrientation:t.paperOrientation,
//									paperWidth:t.paperWidth
//								}
//								var options = {};
//								var result = getPrintHtml(p_formtmpl, p_paper, eval("("+p_form+")"), p_data, options);
//								td.text(result.pageCount);
//								td.parents('tr').addClass('calculated');
//							}
//							ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.countPages($(this)),getPdata);
//						});
						var catalogArr = [];
						$cTr.each(function(){
							if($(this).hasClass("calculated")){
								var catalogOne = {};
								catalogOne.title = rptPrintDataTable.row($(this)).data().accoCode+' '+rptPrintDataTable.row($(this)).data().accoName;
								catalogOne.num = $(this).find('td.td-count').text();
								catalogArr.push(catalogOne);
							}
						});
						page.postCatalog(catalogArr);
					}else{
						ufma.confirm('您未勾选科目间连续编页码，是否要打印目录？',function(action){if(action){
							$('input[name="pagination"][value="1"]').prop('checked',true);
							//计算页码
							//有勾选打勾选，没勾选打全部
							var $cTr;
							if($('#rptPrint-data tr.selected').length>0){
								$cTr = $('#rptPrint-data tbody tr:visible.selected');
							}else{
								$cTr = $('#rptPrint-data tbody tr:visible');
							}
					
							$cTr.not(".calculated").each(function(){
//								console.log($(this));
								var td = $(this).find('td.td-count');
								//账表打印数据查询（计算用） ，接口/gl/rpt/getReportPrintData/{rptType}
								var getPdata = function(result){
									var p_data = result.data;
									
									//获取其他的打印模板数据
									var t = eval("("+$('#rptTemplate option:selected').val()+")");
									var p_form= t.formattmplValue;
									var n = $('#rptTemplate option:selected').index();
									var p_formtmpl = sorttmplValueArr[n];
									var p_paper = {
										marginBottom:t.marginBottom,
										marginLeft:t.marginLeft,
										marginRight:t.marginRight,
										marginTop:t.marginTop,
										paperCode:t.paperCode,
										paperHeight:t.paperHeight,
										paperName:t.paperName,
										paperOrientation:t.paperOrientation,
										paperWidth:t.paperWidth
									}
									var options = {};
									var result = getPrintHtml(p_formtmpl, p_paper, eval("("+p_form+")"), p_data, options);
									td.text(result.pageCount);
									td.parents('tr').addClass('calculated');
								}
								ufma.ajaxDef("/gl/rpt/getReportPrintData/"+$('#rptType option:selected').val(),"post",page.countPages($(this)),getPdata);
							});
							var catalogArr = [];
							$cTr.each(function(){
								if($(this).hasClass("calculated")){
									var catalogOne = {};
									catalogOne.title = rptPrintDataTable.row($(this)).data().accoCode+' '+rptPrintDataTable.row($(this)).data().accoName;
									catalogOne.num = $(this).find('td.td-count').text();
									catalogArr.push(catalogOne);
								}
							});
							page.postCatalog(catalogArr);
						}});
					}
				});
				
				//滑块
				$('#rptPrint-data').on('change','input[type="range"]',function(){
					var n = $(this).val();
					$(this).css({"background-size":(n*10)+"% 100%"});
					$('.range-info ul li:eq('+n+')').addClass('act').siblings().removeClass('act');
				});
				
				//点击滑块下方文字
				$('#rptPrint-data').on('click','.range-info ul li a',function(){
					if(!$(this).parent().hasClass('act')){
						$(this).parent().addClass('act').siblings().removeClass('act');
						var n =  $(this).parent().index();
						$('input[type="range"]').val(n).css({"background-size":(n*10)+"% 100%"});;
					}
				});
				
				//点击级次筛选按钮触发事件
				$('#rptPrint-data').on('click','.rpt-funnelCont .btn-confirm',function(){
					var level = $('input[type="range"]').val();
					var val = $("#rptPrint .searchHide").val();
					$('#rptPrint-data tbody tr').show();
					$('#rptPrint-data tbody tr').removeClass('show-tr');
					if(val!=""){
						if(level>0){
							//当前级次（末级+非末级）
							$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
							//小于当前的级次（末级）
							for(var i=1;i<level;i++){
								$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
							}
							$("#rptPrint-data tbody tr.show-tr").each(function(){
								if($(this).find('span.searchTxt').text().indexOf(val)==-1){
									//没有要检索的内容
									$(this).removeClass('show-tr');
								}
							});
						}else{
							$("#rptPrint-data tbody tr").each(function(){
								if($(this).find('span.searchTxt').text().indexOf(val)!=-1){
									//没有要检索的内容
									$(this).addClass('show-tr');
								}
							});
						}
						$('#rptPrint-data tbody tr:not(.show-tr)').hide();
					}else{
						if(level>0){
							//当前级次（末级+非末级）
							$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
							//小于当前的级次（末级）
							for(var i=1;i<level;i++){
								$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
							}
							$('#rptPrint-data tbody tr:not(.show-tr)').hide();
						}
					}
					$('.rpt-funnelBoxText').hide();
				});
				
				$("#rptPrint .searchHide").focus(function(){
					$(this).keydown(function(e){
						var val = $(this).val();
						var level = $('input[type="range"]').val();
						if(e.keyCode==13){
							$('#rptPrint-data tbody tr').show();
							$('#rptPrint-data tbody tr').removeClass('show-tr');
							if(val!=""){
								if(level>0){
									//当前级次（末级+非末级）
									$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
									//小于当前的级次（末级）
									for(var i=1;i<level;i++){
										$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
									}
									$("#rptPrint-data tbody tr.show-tr").each(function(){
										if($(this).find('span.searchTxt').text().indexOf(val)==-1){
											//没有要检索的内容
											$(this).removeClass('show-tr');
										}
									});
								}else{
									$("#rptPrint-data tbody tr").each(function(){
										if($(this).find('span.searchTxt').text().indexOf(val)!=-1){
											//没有要检索的内容
											$(this).addClass('show-tr');
										}
									});
								}
								$('#rptPrint-data tbody tr:not(.show-tr)').hide();
							}else{
								if(level>0){
									//当前级次（末级+非末级）
									$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
									//小于当前的级次（末级）
									for(var i=1;i<level;i++){
										$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
									}
									$('#rptPrint-data tbody tr:not(.show-tr)').hide();
								}
							}
							$("#rptPrint .searchValueHide").val(val);
						}
					});
				});
				
				$("#rptPrint #searchHideBtn").on("click",function(evt){
					evt.stopPropagation();
					if($("#rptPrint .searchHide").hasClass("focusOff")){
						var newVal = $("#rptPrint .searchValueHide").val();
						if(newVal != ""){
							$("#rptPrint .searchHide").val(newVal);
						}
						$("#rptPrint .searchHide").show().animate({"width":"160px"}).focus().removeClass("focusOff");
					}else{
						var val = $(this).siblings("input[type='text']").val();
						var level = $('input[type="range"]').val();
						$('#rptPrint-data tbody tr').show();
						$('#rptPrint-data tbody tr').removeClass('show-tr');
						if(val!=""){
							if(level>0){
								//当前级次（末级+非末级）
								$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
								//小于当前的级次（末级）
								for(var i=1;i<level;i++){
									$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
								}
								$("#rptPrint-data tbody tr.show-tr").each(function(){
									if($(this).find('span.searchTxt').text().indexOf(val)==-1){
										//没有要检索的内容
										$(this).removeClass('show-tr');
									}
								});
							}else{
								$("#rptPrint-data tbody tr").each(function(){
									if($(this).find('span.searchTxt').text().indexOf(val)!=-1){
										//没有要检索的内容
										$(this).addClass('show-tr');
									}
								});
							}
							$('#rptPrint-data tbody tr:not(.show-tr)').hide();
						}else{
							if(level>0){
								//当前级次（末级+非末级）
								$('#rptPrint-data tbody tr input[data-level="'+level+'"]').parents('tr').addClass('show-tr');
								//小于当前的级次（末级）
								for(var i=1;i<level;i++){
									$('#rptPrint-data tbody tr input[data-level="'+i+'"][data-leaf="1"]').parents('tr').addClass('show-tr');
								}
								$('#rptPrint-data tbody tr:not(.show-tr)').hide();
							}
						}
						$("#rptPrint .searchValueHide").val(val);
					}
				});
				$("#rptPrint .iframeBtnsSearch").on("mouseleave",function(){
					if(!$("#rptPrint .searchHide").hasClass("focusOff") && $("#rptPrint .searchHide").val() == ""){
						$("#rptPrint .searchHide").animate({"width":"0px"},"","",function(){
							$(".searchHide").css("display","none");
						}).addClass("focusOff");
					}
				});
				$('.rimsurl').on('click',function(){
					var codes = $('#rptTemplate option:selected').attr('value')
					var ids = $('#rptTemplate option:selected').attr('valueid')
					var templId = $('#rptTemplate option:selected').attr('templId')
                    var baseUrl = '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids;
                    uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
				})
				$('.rimsurls').on('click',function(){
					var codes = $('#rptTemplate option:selected').attr('value')
					var ids = $('#rptTemplate option:selected').attr('valueid')
					var templId = $('#rptTemplate option:selected').attr('templId')
                    var baseUrl = '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids+'&templId='+ templId;
                    uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
				})
				//滑动条事件
/*				var change = function($input){}
				$('input[type="range"]').RangeSlider({ min: 0,   max: 100,  step: 0.1,  callback: change});*/
			},
			
			//此方法必须保留
			init:function(){
				this.initPage();
				this.onEventListener();
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
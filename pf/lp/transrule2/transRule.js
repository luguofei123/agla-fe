 $(function(){
 	//判断是系统级还是单位级的变量
 	var isAgy = false;
 	
 	//防止新增规则多次触发事件
 	var addRuleType = 0;
 	
 	var tColumnsArr,tColumnDefsArr;
 	
 	var neetHide = false;
 	
 	//接口URL集合
	var interfaceURL = {
		getBillTypes : "/lp/billType/getBillTypes/", //根据单位获取单据类型数据接口
		getElement : "/lp/transRule/getElement/", //获取基础要素
		getRuleList : "/lp/transRule/getRuleList", //获取对照规则
		saveTransRule : "/lp/transRule/saveTransRule", //保存对照规则
		getRuleMap : "/lp/transRule/getRuleMap", //参数包含单据类型和单位和对照规则id，返回结果包括所有要素和已设置要素
		getRuleTableData : "/lp/transRule/getRuleTableData", //获取对照规则表格数据
		saveRuleTableData : "/lp/transRule/saveRuleTableData", //保存对照规则表格数据
		getEleItem : "/lp/eleAccItem/getEleItem", //获取单位启用的辅助核算项
		getAcct : "/lp/sys/getAcct/", //根据单位获取账套
		getAccs : "/lp/sys/getAccs/", //根据单位和账套获取科目体系
		enumerateList : "/lp/enumerate/List/" //根据fieldCode来获取枚举值域
	};
	
	var page = function(){
		
		var tableId,tableHeadId;
		var dataTableObj; //全局对象
		
		return{
			//设置左边高度
			setLeftH : function () {
				var lH = $(".workspace").height() - $(".lp-position-left").offset().top - 10;
				$(".lp-position-left").height(lH);
			},
			
			//根据单位获取单据方案
			getBillTypes : function (result) {
				$('#crBillType').html(""); //每次执行这个函数都应清理原始内容
				var data = result.data;
				var $btn;
				for (var i = 0;i < data.length;i++) {
					if (i == 0) {
						$btn = $('<button class="btn btn-primary" value="' + data[i].billTypeCode
							+ '" data-guid="' + data[i].billTypeGuid + '">' + data[i].billTypeName + '</button>');
					} else {
						$btn = $('<button class="btn btn-default" value="' + data[i].billTypeCode
							+ '" data-guid="' + data[i].billTypeGuid + '">' + data[i].billTypeName + '</button>');
					}
					$('#crBillType').append($btn);
				}
			},
			
			//根据单位获取基础要素
			getElement : function (result) {
				$('#crElement').html(""); //每次执行这个函数都应清理原始内容
				var data = result.data;
				var $li;
				for (var i = 0;i < data.length;i++) {
					if (i == 0) {
						$li = $('<li class="list-row act" data-id="' + data[i].CHR_ID + '" data-code="' + 
							data[i].ELE_CODE + '">' + data[i].ELE_NAME + '</li>');
					} else {
						$li = $('<li class="list-row" data-id="' + data[i].CHR_ID + '" data-code="' + 
							data[i].ELE_CODE + '">' + data[i].ELE_NAME + '</li>');
					}
					$('#crElement').append($li);
				}
				//获取对照规则
				page.getRuleList();
			},
			
			//根据单位、要素和单据类型获得对照规则
			getRuleList : function () {
				$('#crRule').html(""); //每次执行这个函数都应清理原始内容
				var post = {
					eleCode : $('#crElement li.act').attr("data-code"),
					billTypeGuid : $('#crBillType .btn-primary').attr("data-guid")
				};
				//判断系统级还是单位级
				post.agencyCode = isAgy ? page.cbAgency.getValue() : "*";
				var callback = function (result) {
					var data = result.data;
					var $btn;
					var showAgy;
					for (var i = 0;i < data.length;i++) {
						if (isAgy) {
							showAgy = (data[i].agencyCode == "*") ? "(系统级)" : "";
						} else {
							showAgy = "";
						}
						if (i == 0) {
							$btn = $('<button class="btn btn-primary" value="' + data[i].ruleGuid + '" data-agy="' + data[i].agencyCode + '">' + data[i].ruleName + showAgy + '</button>');
						} else {
							$btn = $('<button class="btn btn-default" value="' + data[i].ruleGuid + '" data-agy="' + data[i].agencyCode + '">' + data[i].ruleName + showAgy + '</button>');
						}
						$('#crRule').append($btn);
					}
					//获取表格
					page.createTable();
				};
				ufma.post(interfaceURL.getRuleList,post,callback);
			},
			
			//创建表格
			createTable : function () {
				$("#hide-table").html("");
				if (page.dataTableObj != undefined) {
					page.dataTableObj.clear().destroy();
				}
				
				//系统级规则，单位级不许修改
				if (isAgy&&$("#crRule").find(".btn-primary").attr("data-agy") == "*") {
					neetHide = true;
				} else {
					neetHide = false;
				}
				
				//系统级规则，单位级隐藏新增行，显示提示，禁用保存
				if (neetHide) {
					$(".add-row").find(".table-row-add").hide();
					$(".add-row").find(".add-tips").show();
					$("#crSave").prop("disabled",true);
				} else {
					$(".add-row").find(".table-row-add").show();
					$(".add-row").find(".add-tips").hide();
					$("#crSave").prop("disabled",false);
				}
				
				tColumnsArr = [{data : null}];
				tColumnDefsArr = [
					{
						"targets": [0],
	                    "serchable": false,
	                    "orderable": false,
	                    "className": "col-check noedit",
	                    "render": function (data, type, rowdata, meta) {
	                        return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
	                            '<input type="checkbox" class="checkboxes" value="' + data + '" />' +
	                            '&nbsp;<span></span></label>';
                       	}
					}
				];
				
				//创建表头html
				var $thead = $('<thead><tr class="thr-1"><th class="nowrap check-style" rowspan="2">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
					'<input type="checkbox" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
					'&nbsp;<span></span></label></th></tr><tr class="thr-2"></tr></thead>');
				//根据所选要素，组织一部分表头
				var eleCode = $("#crElement li.act").attr("data-code");
				var eleName = $("#crElement li.act").text();
				var $tlr_1;
				if (eleCode == "ACCO"||eleCode == "CASHFLOW") {
					tColumnsArr.push({data : "accsCode"},{data : "acctCode"},{data : "chrCode"});
					tColumnDefsArr.push({
						"targets": [1],
                        "orderable": false,
                        "className": "accs",
                        "render": function (data, type, rowdata, meta) {
                            return '<span data-key="' + rowdata.accsCode + '" key-code="accsCode" key-name="accsName">' + ufma.parseNull(rowdata.accsName) + '</span>';
                        }
					},{
						"targets": [2],
                        "orderable": false,
                        "className": "acct",
                        "render": function (data, type, rowdata, meta) {
                        	if (!isAgy) {
                        		return '<span style="color:#D9D9D9;" data-key="' + rowdata.acctCode + '" key-code="acctCode" key-name="acctName">系统级账套不可选</span>';
                        	} else {
                        		return '<span data-key="' + rowdata.acctCode + '" key-code="acctCode" key-name="acctName">' + ufma.parseNull(rowdata.acctName) + '</span>';
                        	}
                        }
					},{
						"targets": [3],
                        "orderable": false,
                        "className": "chr",
                        "render": function (data, type, rowdata, meta) {
                            return '<span data-key="' + rowdata.chrCode + '" key-code="chrCode" key-name="chrName">' + ufma.parseNull(rowdata.chrName) + '</span>';
                        }
					});
					
					$tlr_1 = $('<th colspan="3">对应' + eleName + '</th>');
					var $tlr_2;
					switch (eleCode){
						case "ACCO":
							$tlr_2 = $('<th>科目体系</th><th>账套</th><th>科目</th>');
							break;
						case "CASHFLOW":
							$tlr_2 = $('<th>科目体系</th><th>账套</th><th>现金流量</th>');
							break;
					}
					$thead.find(".thr-1").append($tlr_1);
					$thead.find(".thr-2").append($tlr_2);
				} else {
					tColumnsArr.push({data : "chrCode"});
					tColumnDefsArr.push({
						"targets": [1],
                        "orderable": false,
                        "className": "chr",
                        "render": function (data, type, rowdata, meta) {
                            return '<span data-key="' + rowdata.chrCode + '" key-code="chrCode" key-name="chrName">' + ufma.parseNull(rowdata.chrName) + '</span>';
                        }
					});
					
					$tlr_1 = $('<th rowspan="2">对应' + eleName + '</th>');
					$thead.find(".thr-1").append($tlr_1);
				}
				//获取条件显示的表格
				var post = {
					billTypeGuid : $('#crBillType .btn-primary').attr("data-guid"),
					ruleGuid : $("#crRule .btn-primary").val()
				};
				//判断系统级还是单位级
				post.agencyCode = isAgy ? page.cbAgency.getValue() : "*";
				var callback = function (result) {
					if (result.data != null) {
						var tar = result.data.tar;
						var $trr_1;
						if (tar.length > 0) {
							$trr_1 = $('<th colspan="' + tar.length + '">条件<div id="add-condition" class="thead-act" data-toggle="tooltip" title="添加条件">' +
								'<span class="glyphicon icon-plus"></span></div></th>');
							$thead.find(".thr-1").append($trr_1);
							var defLength = tColumnDefsArr.length;
							for (var i = 0;i < tar.length;i++) {
								var $trr_2 = $('<th>' + tar[i].itemName + '</th>');
								$thead.find(".thr-2").append($trr_2);
								
								tColumnsArr.push({data : tar[i].condition});
								(function(){
									var cond = tar[i].condition;
									var iType = tar[i].itemType;
									var iItem = tar[i].billItem;
									tColumnDefsArr.push({
										"targets": [(defLength + i)],
				                        "orderable": false,
				                        "className": "condition",
				                        "render": function (data, type, rowdata, meta) {
				                            return '<span data-key="' + rowdata[cond] + '" data-item="' + iItem + '" data-type="' + iType + '" key-code="' + cond + '">' + ufma.parseNull(rowdata[cond]) + '</span>';
				                        }
									});
								})()
							}
						} else{
							$trr_1 = $('<th rowspan="2">条件<div id="add-condition" class="thead-act" data-toggle="tooltip" title="添加条件">' +
								'<span class="glyphicon icon-plus"></span></div></th>');
							$thead.find(".thr-1").append($trr_1);
							
							tColumnsArr.push({data : null});
							tColumnDefsArr.push({
								"targets": [tColumnDefsArr.length],
		                        "orderable": false,
		                        "className": "noedit",
		                        "render": function (data, type, rowdata, meta) {
		                            return '<span style="color:#D9D9D9;">请点击表头按钮增加条件</span>';
		                        }
							});
						}
					}
					
					tColumnsArr.push({data : null});
					tColumnDefsArr.push({
						"targets": [-1],
	        			"serchable": false,
	                    "orderable": false,
	                    "className": "noedit act-style",
	                    "render": function (data, type, rowdata, meta) {
	                        return '<a class="btn btn-icon-only btn-sm btn-permission row-drag" data-toggle="tooltip" action= "" title="排序">'
	                        	+'<span class="glyphicon icon-drag"></span></a>'
	                        	+'<a class="btn btn-icon-only btn-sm btn-permission row-del" data-toggle="tooltip" action= "" title="删除">'
	                        	+'<span class="glyphicon icon-trash"></span></a>';
	                    }
					});
					
					var $thAct = $('<th class="nowrap act-style" rowspan="2">操作</th>');
					$thead.find(".thr-1").append($thAct);
					$("#hide-table").append($thead);
//					page.tableHeadId.html('<tr role="row">' + $("#hide-table .thr-1").html() + '</tr><tr role="row">' + $("#hide-table .thr-2").html() + '</tr>'); //此处有BUG，加载datatables时会把表头清空
					
					//获取表格数据
					var post2 = {
						ruleGuid : $("#crRule .btn-primary").val()
					};
					ufma.ajaxDef(interfaceURL.getRuleTableData,"post",post2,page.getRuleTableData);
				};
				ufma.ajaxDef(interfaceURL.getRuleMap,"post",post,callback);
			},
			
			//获取对照规则表格
			getRuleTableData : function (result) {
				if (result.data != null) {
					var data = result.data;
					if (data.length == 0) {
						data.push({
	            			chrId : "",
	            			chrCode : "",
	            			chrName : "",
	            			accsCode : "*",
	            			accsName : "",
	            			acctCode : "*",
	            			acctName : "",
	            			condition01 : "",
	            			condition02 : "",
	            			condition03 : "",
	            			condition04 : "",
	            			condition05 : "",
	            			condition06 : "",
	            			condition07 : "",
	            			condition08 : "",
	            			condition09 : "",
	            			condition10 : "",
	            			condition11 : "",
	            			condition12 : "",
	            			condition13 : "",
	            			condition14 : "",
	            			condition15 : "",
	            			condition16 : "",
	            			conditionGuid : "",
	            			ruleGuid : $("#crRule .btn-primary").val()
						});
					}
					//绘制表格
					page.dataTableObj = page.setDataTable(data,tColumnsArr,tColumnDefsArr);
				}
			},
			
			//配置datatables
			setDataTable : function (dataObj,columnsArr,columnDefsArr) {
				var id = "transRule-data";
                var toolBar = $('#'+id).attr('tool-bar');
                page.dataTableObj = page.tableId.DataTable({
                	"language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
				   	"data": dataObj,
                    "bFilter": false,    //去掉搜索框
                    "bLengthChange": true,   //去掉每页显示多少条数据
                    "processing": true,//显示正在加载中
                    "pagingType": "full_numbers",//分页样式
                    "lengthChange": true,//是否允许用户自定义显示数量p
                    "lengthMenu": [[25,50,100,-1],[25,50,100,"All"]],
                    "pageLength": 25,
                    "bInfo": true,//页脚信息
                    "bSort": false, //排序功能
                    "bAutoWidth": false,//表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    "columns": columnsArr,
                    "columnDefs": columnDefsArr,
                    "dom":'rt<"'+id+'-paginate">',
                    "initComplete": function (settings,json) {
                		//点击单元格开始编辑
                    	$("#transRule-data").off("click","tbody td:not(.noedit)").on("click","tbody td:not(.noedit)",function(){
                    		if ($(".datetimepicker").get(0)) {
                    			$(".datetimepicker").remove();
                    		}
                    		if ($("#combox").get(0)) {
                    			$("#combox").remove();
                    			$("#combox_popup").remove();
                    		}
                    		//var initVal = $(this).find("span").attr("data-key");
                    		var h = $(this).outerHeight(),w = $(this).outerWidth();
                    		var $div = $('<div id="combox" style="height:' + h + 'px;width:' + w + 'px;position:absolute;left:0;top:0"></div>');
                    		$(this).append($div);
                    		
                    		if ($(this).hasClass("chr")) {
                    			//点的是对应的要素单元格
                    			var url = isAgy ? interfaceURL.getEleItem + "?agencyCode=" + page.cbAgency.getValue() + "&eleCode=" + $("#crElement li.act").attr("data-code") : interfaceURL.getEleItem + "?agencyCode=*&eleCode=" + $("#crElement li.act").attr("data-code");
                    			ufma.get(url,"",function(result){
                    				if (result.data != null) {
                    					var chrData = result.data;
                    					$("#combox").ufmaTreecombox({
											valueField:'id',
							   				textField:'name',
							   				readOnly:false,
										   	leafRequire:true,
										   	popupWidth:1.5,
											data: chrData,
											onchange:function(data){
												$("#combox").parents("td").find("span").text(data.name);
												$("#combox").parents("td").find("span").attr("data-key",data.id);
						        				if ($("#combox").parents("td").find("span").attr("key-code") != undefined) {
						        					var keyCode = $("#combox").parents("td").find("span").attr("key-code");
						        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = data.id;
						        				}
						        				if ($("#combox").parents("td").find("span").attr("key-name") != undefined) {
						        					var keyName = $("#combox").parents("td").find("span").attr("key-name");
						        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyName] = data.name;
						        				}
						        				$("#combox").remove();
						        				$("#combox_popup").remove();
											}
										});
                    				}
                    			});
                    		} else if ($(this).hasClass("acct")&&isAgy) {
                    			//点的是账套（系统级没法设置）
                    			ufma.get(interfaceURL.getAcct + page.cbAgency.getValue(),"",function(result){
                    				var acctData = result.data;
                    				$("#combox").ufmaCombox({
		                    			data:acctData,
					        			valueField:"id",
					        			textField:"name",
					        			placeholder:"请选择账套",
					        			onchange:function(data){
					        				$("#combox").parents("td").find("span").text(data.name);
					        				$("#combox").parents("td").find("span").attr("data-key",data.id);
					        				if ($("#combox").parents("td").find("span").attr("key-code") != undefined) {
					        					var keyCode = $("#combox").parents("td").find("span").attr("key-code");
					        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = data.id;
					        				}
					        				if ($("#combox").parents("td").find("span").attr("key-name") != undefined) {
					        					var keyName = $("#combox").parents("td").find("span").attr("key-name");
					        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyName] = data.name;
					        				}
					        				//根据单位账套加载
					        				ufma.get(interfaceURL.getAccs + page.cbAgency.getValue() + "/" + data.id,"",function(result){
					        					var dName = result.data[0].name;
					        					var dId = result.data[0].id;
					        					page.dataTableObj.row($("#combox").parents("tr")).data().accsName = result.data[0].name;
					        					$("#combox").parents("tr").find(".accs span").text(dName);
					        					page.dataTableObj.row($("#combox").parents("tr")).data().accsCode = result.data[0].id;
					        					$("#combox").parents("tr").find(".accs span").attr("data-key",dId);
					        					$("#combox").remove();
					        					$("#combox_popup").remove();
					        				});
					        			}
					        		});
                    			});
                    		} else if ($(this).hasClass("accs")&&!isAgy) {
                    			//点的是科目体系
                    			var acctCode = $(this).parents("tr").find(".acct span").attr("data-key");
                    			ufma.get(interfaceURL.getAccs + "*/*","",function(result){
                    				var accsData = result.data;
                    				$("#combox").ufmaCombox({
		                    			data:accsData,
					        			valueField:"id",
					        			textField:"name",
					        			placeholder:"请选择科目体系",
					        			onchange:function(data){
					        				$("#combox").parents("td").find("span").text(data.name);
					        				$("#combox").parents("td").find("span").attr("data-key",data.id);
					        				if ($("#combox").parents("td").find("span").attr("key-code") != undefined) {
					        					var keyCode = $("#combox").parents("td").find("span").attr("key-code");
					        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = data.id;
					        				}
					        				if ($("#combox").parents("td").find("span").attr("key-name") != undefined) {
					        					var keyName = $("#combox").parents("td").find("span").attr("key-name");
					        					page.dataTableObj.row($("#combox").parents("tr")).data()[keyName] = data.name;
					        				}
					        				$("#combox").remove();
					        				$("#combox_popup").remove();
					        			}
					        		});
                    			});
                    		} else if ($(this).hasClass("condition")) {
                    			//点的是条件
                    			var iType = $(this).find("span").attr("data-type");
                    			switch (iType){
                    				case "03":
                    				case "08": //输入框
                    					var $inp = $('<input type="text" name="" style="height:100%;width:100%;" id="nameEdit" value="" placeholder="请输入内容" />');
			                    		$("#combox").append($inp);
			                    		$("#nameEdit").focus();
			                    		$("#transRule-data").on("keydown","#nameEdit",function(e){
			                    			if (e.keyCode == 13) {
			                    				var condTxt = $("#nameEdit").val();
			                    				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
			                    				$("#combox").parents("td").find("span").text(condTxt);
			                    				page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = condTxt;
			                    				$("#combox").remove();
			                    			}
			                    		});
			                    		$("#transRule-data").on("blur","#nameEdit",function(e){
			                    			var condTxt = $("#nameEdit").val();
		                    				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
		                    				$("#combox").parents("td").find("span").text(condTxt);
		                    				page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = condTxt;
		                    				$("#combox").remove();
			                    		});
                    					break;
                					case "05": //金额输入框
                    					var $inp = $('<input type="text" name="" style="height:100%;width:100%;" id="nameEdit" value="" placeholder="0.00" />');
			                    		$("#combox").append($inp);
			                    		$("#nameEdit").focus();
			                    		$("#transRule-data").on("keydown","#nameEdit",function(e){
			                    			if (e.keyCode == 13) {
			                    				var condTxt = $("#nameEdit").val();
			                    				condTxt = condTxt.replace(/[^\d.]/g,"");
			                    				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
			                    				$("#combox").parents("td").find("span").text(condTxt);
			                    				page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = condTxt;
			                    				$("#combox").remove();
			                    			}
			                    		});
			                    		$("#transRule-data").on("blur","#nameEdit",function(e){
			                    			var condTxt = $("#nameEdit").val();
		                    				condTxt = condTxt.replace(/[^\d.]/g,"");
		                    				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
		                    				$("#combox").parents("td").find("span").text(condTxt);
		                    				page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = condTxt;
		                    				$("#combox").remove();
			                    		});
                    					break;
                					case "04": //日期
                						var $time = $('<div style="position:relative;height:100%;"><input type="text" name=""'
                							+ 'style="height:100%;width:100%;" id="time" value="" /><i class="glyphicon icon-calendar" style="position:absolute;top:9px;right:9px;"></i></div>');
            							$("#combox").append($time);
            							$("#combox").find("#time").datetimepicker({
										    format: 'yyyy-mm-dd',
									        autoclose: true,
									        todayBtn: true,
									        startView: 'month',
									        minView:'month',
									        maxView:'decade',
									        language: 'zh-CN'
										});
										$("#time").focus();
										$("#transRule-data").on("change","#time",function(e){
											var condTxt = $("#time").val();
		                    				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
		                    				$("#combox").parents("td").find("span").text(condTxt);
		                    				page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = condTxt;
		                    				$("#combox").remove();
		                    				$(".datetimepicker").remove();
										});
                    					break;
                					case "07": //下拉列表
                						var fieldCode = $("#combox").parents("td").find("span").attr("data-item");
		                    			ufma.get(interfaceURL.enumerateList + fieldCode,"",function(result){
		                    				var fData = result.data;
		                    				$("#combox").ufmaCombox({
				                    			data:fData,
							        			valueField:"ENU_CODE",
							        			textField:"ENU_NAME",
							        			placeholder:"请选择对应值",
							        			onchange:function(data){
							        				$("#combox").parents("td").find("span").text(data.name);
							        				$("#combox").parents("td").find("span").attr("data-key",data.id);
							        				var keyCode = $("#combox").parents("td").find("span").attr("key-code");
		                    						page.dataTableObj.row($("#combox").parents("tr")).data()[keyCode] = data.id;
							        				$("#combox").remove();
							        				$("#combox_popup").remove();
							        			}
							        		});
		                    			});
                    					break;
                    				default:
                    					break;
                    			}
                    		}
                    	});
                    	
                    	//点击行内删除
                    	$("#transRule-data").off("click",".row-del").on("click",".row-del",function(){
                    		page.dataTableObj.row($(this).parents("tr")).remove().draw();
                    	});
                    	
                    	//点击行排序
                    	$("#transRule-data").off("mousedown",".row-drag").on("mousedown",".row-drag",function(){
                    		$("#transRule-data").tableSort();
                    	});
                    },
                    "drawCallback": function (settings) {
                    	//替换表头
						page.tableHeadId.html('<tr role="row">' + $("#hide-table .thr-1").html() + '</tr><tr role="row">' + $("#hide-table .thr-2").html() + '</tr>');
                    	//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						
						if (neetHide) {
							$(".checkboxes").attr("disabled","disabled");
							$(".datatable-group-checkable").attr("disabled","disabled");
							$(".row-drag").attr("disabled","disabled");
							$(".row-del").attr("disabled","disabled");
							$("#add-condition").hide();
							$("#transRule-data tbody td:not(.noedit)").addClass("noedit");
						} else {
							$(".checkboxes").removeAttr("disabled");
							$(".datatable-group-checkable").removeAttr("disabled");
							$(".row-drag").removeAttr("disabled");
							$(".row-del").removeAttr("disabled");
							$("#add-condition").show();
						}
                    }
                });
                return page.dataTableObj;
			},
			
			//初始化页面
			initPage:function(){
				isAgy = (!$("#cbAgency").get(0)) ? false : true;
				
				page.tableHeadId = $("#transRule-data-head"); //表格头部id
				page.tableId = $("#transRule-data"); //表格id
				
				if (!isAgy) {
					//系统级
					ufma.ajaxDef(interfaceURL.getBillTypes + "*","get","",page.getBillTypes);
					ufma.get(interfaceURL.getElement + "*","",page.getElement);
				} else {
					svData = ufma.getCommonData();
					//单位级
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					    onchange : function (data) {
					    	ufma.ajaxDef(interfaceURL.getBillTypes + data.id,"get","",page.getBillTypes);
					    	ufma.get(interfaceURL.getElement + data.id,"",page.getElement);
					    },
					    initComplete : function (sender) {
					    	if (ufma.GetQueryString("agencyCode") != undefined&&ufma.GetQueryString("agencyName") != undefined) {
					    		page.cbAgency.setValue(ufma.GetQueryString("agencyCode"),ufma.GetQueryString("agencyName"));
					    	} else {
					    		if (svData.svAgencyCode != ""&&svData.svAgencyName != "") {
						   			page.cbAgency.setValue(svData.svAgencyCode,svData.svAgencyName);
						   		} else {
						   			page.cbAgency.setValue(result.data[0].id,result.data[0].name);
						   		}
					    	}
						}
					});
				}
			},
			
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function(){
				//点击单据类型
				$("#crBillType").on("click","button.btn-default",function(){
					//样式改变
					$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					
					page.getRuleList();
				});
				
				//点击基础要素
				$("#crElement").on("click","li:not(.act)",function(){
					//样式改变
					$(this).addClass("act").siblings("li.act").removeClass("act");
					
					page.getRuleList();
				});
				
				//点击对照规则
				$("#crRule").on("click","button.btn-default",function(){
					//样式改变
					$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					
					page.createTable();
				});
				
				//点击对照规则的添加按钮
				$(".add-btn").on("click",function(){
					//判断按钮状态
					if (!$(this).hasClass("act")) {
						$(this).addClass("act").attr("data-original-title","确定").find("span.glyphicon").removeClass("icon-plus").addClass("icon-check");
						$(".add-input").show().animate({"width":"112px"}).focus();
					} else if ($(this).hasClass("act")&&addRuleType == 0) {
						var addData = {
							eleCode : $('#crElement li.act').attr("data-code"),
							billTypeGuid : $('#crBillType .btn-primary').attr("data-guid"),
							ruleName : $(".add-input").val()
						};
						addData.agencyCode = isAgy ? page.cbAgency.getValue() : "*";
						var  callback = function (result) {
							if (result.flag == "success") {
								addRuleType = 1;
								$(".add-input").animate({"width":"0"},function(){
									$(this).val("").hide();
									$(".add-btn.act").removeClass("act").attr("data-original-title","添加").find("span.glyphicon").addClass("icon-plus").removeClass("icon-check");
									
									page.getRuleList();
								});
							}
						};
						ufma.ajaxDef(interfaceURL.saveTransRule,"post",addData,callback);
					}
				});
				$(".add-input").on("focus",function(){
					addRuleType = 0;
					$(this).keydown(function(e){
						var ruleName = $(".add-input").val();
						if (e.keyCode == 13&&ruleName != ""&&ruleName.replace(/(^s*)|(s*$)/g,"").length != 0) {
							$(".add-btn.act").click();
						}
					});
				});
				//$(".add-input").on("blur",function(){});
				
				//点击对照规则的设置按钮
				$(".set-btn").on("click",function(){
					var post = {
						eleCode : $('#crElement li.act').attr("data-code"),
						billTypeGuid : $('#crBillType .btn-primary').attr("data-guid")
					};
					//判断系统级还是单位级
					post.agencyCode = isAgy ? page.cbAgency.getValue() : "*";
					ufma.open({
                    	url:'setRule.html',
                        title:'对照规则设置',
                        width:500,
//                    	height:500,
                        data:{action:'setRule',isAgy:isAgy,post:post},
                        ondestory:function(data){
                        	//窗口关闭时回传的值
                            if (data.action == "set") {
                            	page.getRuleList();
                            }
                        }
                    });
				});
				
				//点击添加条件
				$("#transRule-data-head").on("click","#add-condition",function(){
					//判断是否有对照规则
					if ($("#crRule button").get(0)) {
						//有对照规则
						//点击添加条件时先对原有数据进行一次保存
						var saveData = {
	            			data : []
	            		};
	            		$("#transRule-data tbody tr").each(function(){
	            			var rowData = page.dataTableObj.row($(this)).data();
	            			if (rowData.chrCode != ""&&rowData.chrCode != undefined) {
	            				saveData.data.push(rowData);
	            			}
	            		});
	            		if (saveData.data.length > 0) {
	            			ufma.post(interfaceURL.saveRuleTableData,saveData,function(result){});
	            		}
	            		//获取条件显示的表格
						var postData = {
							billTypeGuid : $('#crBillType .btn-primary').attr("data-guid"),
							ruleGuid : $("#crRule .btn-primary").val()
						};
						//判断系统级还是单位级
						postData.agencyCode = isAgy ? page.cbAgency.getValue() : "*";
						
						ufma.open({
	                    	url:'addCondition.html',
	                        title:'添加条件',
	                        width:500,
	                        data:{action:'addCondition',post:postData},
	                        ondestory:function(data){
	                        	//窗口关闭时回传的值
	                            if (data.action == "save") {
	                            	page.createTable();
	                            }
	                        }
	                    });
					} else {
						ufma.alert("请添加对照规则！");
					}
				});
				
				//点击新增行
            	$(".table-row-add").on("click",function(){
            		var addRow = {
            			chrId : "",
            			chrCode : "",
            			chrName : "",
            			accsCode : "*",
            			accsName : "",
            			acctCode : "*",
            			acctName : "",
            			condition01 : "",
            			condition02 : "",
            			condition03 : "",
            			condition04 : "",
            			condition05 : "",
            			condition06 : "",
            			condition07 : "",
            			condition08 : "",
            			condition09 : "",
            			condition10 : "",
            			condition11 : "",
            			condition12 : "",
            			condition13 : "",
            			condition14 : "",
            			condition15 : "",
            			condition16 : "",
            			conditionGuid : "",
            			ruleGuid : $("#crRule .btn-primary").val()
            		};
            		page.dataTableObj.row.add(addRow).draw();
            	});
            	
            	//点击保存
            	$("#crSave").on("click",function(){
            		var saveData = {
            			data : []
            		};
            		$("#transRule-data tbody tr").each(function(){
            			var rowData = page.dataTableObj.row($(this)).data();
            			if (rowData.chrCode != ""&&rowData.chrCode != undefined) {
            				saveData.data.push(rowData);
            			}
            		});
            		if (saveData.data.length > 0) {
            			ufma.post(interfaceURL.saveRuleTableData,saveData,function(result){
	            			ufma.showTip(result.msg,function(){
	            				if (result.flag == "success") {
	            					page.createTable();
	            				}
	            			},result.flag);
	            		});
            		}
            	});
			},
			
			//此方法必须保留
			init:function(){
				ufma.parse();
				page.setLeftH();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	
/////////////////////
    page.init();
});
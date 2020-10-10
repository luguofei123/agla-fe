$(function(){
	var page = function(){
		
		//定义datatables全局变量
		var vouPrintDataTable;
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host: "http://" + window.location.host;
		//打印列表查询传入数据
		var searchListData = {
			agencyCode:"",
			acctCode:"",
			fisPerd:"",
			// accaCode:"",
			vouStatus:"",
			rgCode:"",
			vouTypeCode:"",
//			startVouNo:"",
//			endVouNo:"",
			inputorName:""
		};
		var vouTypeArray={};
		//存储凭证数据数组
		var vouCountArr = [];
		
		var svData;
		var voutypeacca = ''
		var vousinglepz = false
		
		//年度为当前年
		var setYear;
		
		//系统用户
		var user;
		
		return{
			
			//高度设置
            setHeight:function(){
            	var outH = $(".vou-table-tab").offset().top;
            	var tableH = $("#vouPrint-data").outerHeight();
            	var barH = $("#vouPrint-tool-bar").outerHeight();
            	var infoH = $(".vou-table-info").height();
            	var addH = ((tableH+barH)>infoH)?(tableH+barH):infoH;
            	var height = outH+addH+16;
            	$(".workspace").outerHeight(height);
            	ufma.parseDoubleScroll();
            },
			
			//表格金额自动添加千分位和小数点保留两位
			moneyFormat:function(num){
				return num = (num==null || num=='' || num==undefined)?0:(parseFloat(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			
			numFormat:function(s){
				if($.isNull(s)) return '0';
				else return s;
			},
			
			showBtn:function(showBtns){
				if(showBtns.length>4){
					var $moreBtns = $('<div class="btn-group pull-right" style="margin-left: 8px;">'+
						'<button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
						'更多 <span class="caret"></span></button><ul class="dropdown-menu"></ul></div>');
					for(var s = 0;s < showBtns.length;s++){
						if(s <= ( showBtns.length - 4 )){
							var $li = $('<li><a href="javascript:;" id="'+showBtns[s].id+'" class="'+showBtns[s].id+'">'+showBtns[s].name+'</a></li>');
							$moreBtns.find('ul.dropdown-menu').prepend($li);
						}else{
							var $div = $('<div class="btn-group pull-right" style="margin-left: 8px;">'+
								'<button type="button" id="'+showBtns[s].id+'"class="btn btn-sm '+showBtns[s].class+' '+showBtns[s].id+'">'+showBtns[s].name+'</button></div>');
							$('.vou-method-tip').append($div);
						}
					}
					$('.vou-method-tip').prepend($moreBtns);
				}else if(showBtns.length<=4&&showBtns.length>0){
					for(var s = 0;s < showBtns.length;s++){
						var $div = $('<div class="btn-group pull-right">'+
							'<button type="button" id="'+showBtns[s].id+'" style="margin-left: 8px;" class="btn btn-sm '+showBtns[s].class+' '+showBtns[s].id+'">'+showBtns[s].name+'</button></div>');
						$('.vou-method-tip').append($div);
					}
				}
			},
			
			//初始化页面，默认选择当前月为结账期间
			defineFisPerd:function(){
				//获得月份（0-11）
				var indexMonth = new Date(svData.svTransDate).getMonth();
				
				//时间选择样式
				$("#vouPrint .month-text .month-one").removeClass("choose");
				$("#vouPrint .month-text .month-one").eq(indexMonth).addClass("choose");
				$("#vouPrint .blue-line .blue-one").removeClass("choose");
				$("#vouPrint .blue-line .blue-one").eq(indexMonth).addClass("choose");
				
				searchListData.fisPerd = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd");
			},
			
			//加载会计体系
			/* initAccaCode:function(result){
				var data = result.data;
				
				//循环把button填入div
				var $accaCodeBtn = '<button class="btn btn-primary" value="">全部</button>';
				for(var i=0;i<data.length;i++){
					//创建会计体系button节点
					$accaCodeBtn += '<button class="btn btn-default" value="'+data[i].accaCode+'">'+data[i].accaName+'</button>';
				}
				$('#vpAccaCode').empty();
				$('#vpAccaCode').append($accaCodeBtn);
			}, */
			
			//加载凭证类型凭证类型
			initVouType:function(result){
				var data = result.data;
				
				//循环把option(button)填入select(div)
				// var $vouTypeOp = '<option value="">  </option>';
				// var $vouTypeBtn = '<button class="btn btn-primary" value="">全部</button>';
				vouTypeArray={};
				for(var i=0;i<data.length;i++){
					//创建凭证类型option(button)节点
					vouTypeArray[data[i].CHR_CODE] = data[i].CHR_NAME;
					// $vouTypeOp += '<option value="'+data[i].CHR_CODE+'">'+data[i].CHR_NAME+'</option>';
					// $vouTypeBtn += '<button class="btn btn-default" value="'+data[i].CHR_CODE+'">'+data[i].VOU_FULLNAME+'</button>';
				}
				// $('#vpVouTypeCode').append($vouTypeOp);
				// $('#vpVouTypeCodeBtn').append($vouTypeBtn);
			},
			getVouTypeNameByCode:function(key){
				return (vouTypeArray[key]==undefined)?"":vouTypeArray[key];
			},
			//加载凭证状态
			initVouStatus:function(result){
				var data = result.data;
				
				//循环把button填入div
				var $vouStatusBtn = '<button class="btn btn-primary" value="" >全部</button>';
				for(var i=0;i<data.length;i++){
					//创建凭证状态button节点
					$vouStatusBtn += '<button class="btn btn-default" value="'+data[i].ENU_CODE+'">'+data[i].ENU_NAME+'</button>';
				}
				$('#vpVouStatus').append($vouStatusBtn);
			},
			
			//datables数据显示
            getVouPrintList: function (result) {
                var id = "vouPrint-data";
                var toolBar = $('#'+id).attr('tool-bar');
                var postData = result.data;
                vouPrintDataTable = $("#" + id).DataTable({
                    "language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
					/*"serverSide": true,
                    "ajax":{
				        url:"http://localhost:8080/gl/print/maacclist",
				        type:"POST",
				       	data:searchListData
				    },*/
				   	"data":postData,
                    "bFilter": false,    //去掉搜索框
                    "bLengthChange": true,   //去掉每页显示多少条数据
                    "processing": true,//显示正在加载中
                    "pagingType": "full_numbers",//分页样式
                    "lengthChange": true,//是否允许用户自定义显示数量p
                    "lengthMenu":[
						[20, 50, 100,200, -1],
						[20, 50, 100,200, "全部"]
					],
					"pageLength": ufma.dtPageLength(id),
                    "bInfo": true,//页脚信息
                    "bSort": false, //排序功能
                    "bAutoWidth": false,//表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    /*"scrollX":"100%",
                    "scrollCollapse":true,
                    "fixedColumns":{
                    	leftColumns:5
                    },*/
                    "columns": [
                        {
                            title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                            '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
                            '<span></span> ' +
                            '</label>',
                            className:"nowrap",
                            data: "index"
                        },
                        {
                            title: "日期",
                            data: "vouDate"
                        },
                        {
                            title: "凭证字号",
                            data: "vouNo"
						},
						{
							title: "账套",
							className:"ellipsis",
							data: "chrName"
						},
                        {
                            title: "摘要",
                            className:"ellipsis",
                            data: "vouDesc"
                        },
                        {
                            title: "金额",
                            className:"money-style ellipsis max-w-210",
//                          className:"money-style max-w-210",
                            data: "amtCr"
                        },
                        {
                            title: "制单人",
                            className:"ellipsis",
                            data: "inputorName"
                        },
                        {
                            title: "审核人",
                            className:"ellipsis",
                            data: 'auditorName'
                        },
                        {
                            title: "记账人",
                            className:"ellipsis",
                            data: 'posterName'
                        },
                        {
                            title: "打印次数",
                            className:"money-style",
                            data: 'printCount'
                        }
                    ],
                    "columnDefs": [
                        {
                            "targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [2],
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<span>'+rowdata.vouTypeName+'-'+rowdata.vouNo+'</span>';
                            }
												},
												{
													"targets": [3],
													"orderable": false,
													"render": function (data, type, rowdata, meta) {
															return '<span>'+rowdata.acctCode+' '+rowdata.acctName+'</span>';
													}
											},
                        {
                            "targets": [4],
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<span data-toggle="tooltip" title="'+ufma.parseNull(rowdata.vouDesc)+'">'+ufma.parseNull(rowdata.vouDesc)+'</span>';
                            }
                        },
                        {
                            "targets": [5],
                            "orderable": false,
                            "className": "money-style",
                            "render": function (data, type, rowdata, meta) {
                                return '<span data-toggle="tooltip" title="'+page.moneyFormat(rowdata.amtCr)+'">'+page.moneyFormat(rowdata.amtCr)+'</span>';
//                              return '<span>'+page.moneyFormat(rowdata.amtCr)+'</span>';
                            }
                        },
                        {
                            "targets": [6],
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<span data-toggle="tooltip" title="'+ufma.parseNull(rowdata.inputorName)+'">'+ufma.parseNull(rowdata.inputorName)+'</span>';
                            }
                        },
                        {
                            "targets": [7],
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<span data-toggle="tooltip" title="'+ufma.parseNull(rowdata.auditorName)+'">'+ufma.parseNull(rowdata.auditorName)+'</span>';
                            }
                        },
                        {
                            "targets": [8],
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<span data-toggle="tooltip" title="'+ufma.parseNull(rowdata.posterName)+'">'+ufma.parseNull(rowdata.posterName)+'</span>';
                            }
                        }
                    ],
                    "dom":'rt<"'+id+'-paginate"ilp>',
                    "initComplete": function (settings, json) {
                        //批量操作toolbar与分页
                        var $info = $(toolBar +' .info');
                        if($info.length == 0){
                            $info = $('<div class="info"></div>').appendTo($(toolBar+' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.'+id+'-paginate').appendTo($info);

                        //行内操作
                        $("#" + id + ' .btn').on("click", function () {
                            page.actionMore($(this).attr("action"), [$(this).attr("rowid")], $(this).closest('tr'));
                        });

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
                    "drawCallback": function (settings) {
                    	$("#vouPrint-data").find("td.dataTables_empty").text("").append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                    	if($("#vouPrint-data td.dataTables_empty").get(0)){
                    		$("#vouPrint-data input.datatable-group-checkable").prop("disabled",true);
                    		$("#vouPrint-tool-bar input.datatable-group-checkable").prop("disabled",true);
                    		$("#vouPrint-data input.datatable-group-checkable").prop("checked",false);
                    		$("#vouPrint-tool-bar input.datatable-group-checkable").prop("checked",false);
                    		$("#btn-direct-print").prop("disabled",true);
                    		$("#btn-print-preview").prop("disabled",true);
                    	}else{
                    		$("#vouPrint-data input.datatable-group-checkable").prop("disabled",false);
                    		$("#vouPrint-tool-bar input.datatable-group-checkable").prop("disabled",false);
                    		$("#vouPrint-data input.datatable-group-checkable").prop("checked",false);
                    		$("#vouPrint-tool-bar input.datatable-group-checkable").prop("checked",false);
                    		$("#btn-direct-print").prop("disabled",false);
                    		$("#btn-print-preview").prop("disabled",false);
                    	}
                    	
						//合计金额
						if(!$("#vouPrint-data tbody td.dataTables_empty").get(0)){
							var sum = 0
							for(var i=0;i<postData.length;i++){
								if(postData[i].amtCr!="" && postData[i].amtCr!=null && postData[i].amtCr!=undefined){
									sum += postData[i].amtCr
								}
							}
//							var sum = vouPrintDataTable.column(5).data().reduce(function(a,b){
//								return a + b;
//							});
							$("#vouPrint-data .amtSum").html('<span data-toggle="tooltip" title="'+page.moneyFormat(sum)+'">'+page.moneyFormat(sum)+'</span>');
							
							//样式
							if($("#vouPrint-data tbody tr").length%2==1){
								$("#vouPrint-data tfoot tr").css({"backgroundColor":"#F9F9F9"});
							}else{
								$("#vouPrint-data tfoot tr").css({"backgroundColor":"#FFFFFF"});
							}
						}
						
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						
						//权限判断
						ufma.isShow(page.reslist);
						
						//权限&更多
						$('.vou-method-tip').html("");
						var objBtns = [
							{id:"btn-print-cover",name:"打印封面",class:"btn-default"},
							{id:"btn-printset",name:"打印设置",class:"btn-default"},
							/* {id:"btn-check-vou",name:"凭证检查",class:"btn-default"}, */
							{id:"btn-direct-print",name:"直接打印",class:"btn-default"},
							{id:"btn-print-preview",name:"打印预览",class:"btn-primary"}
						];
						ufma.hasMoreBtn(page.reslist,objBtns,page.showBtn);
						
						page.setHeight();
                    }
                });
            },
			
			//获取凭证、打印信息和凭证数量数据
			/* getVouInfo:function(result){
				var data = result.data;
				
				if(data!=null){
					//凭证信息
					$("#vouPrint .vou-table-info .info-vou dd").eq(0).text(page.numFormat(data.vouMap.vouCount)+'张');
					$("#vouPrint .vou-table-info .info-vou dd").eq(2).text(page.numFormat(data.vouMap.cntCount)+'张');
					$("#vouPrint .vou-table-info .info-vou dd").eq(3).text(page.moneyFormat(data.vouMap.amtCount));
					var $ul = $('<ul class="list-unstyled"></ul>');
					for(var i=0;i<data.vouMap.vouNoList.length;i++){
						//判断noList是否为null
						if(data.vouMap.vouNoList[i].noList!=null){
							for(var j=0;j<data.vouMap.vouNoList[i].noList.length;j++){
								var $li = $('<li>'+page.getVouTypeNameByCode(data.vouMap.vouNoList[i].vouTypeCode)+'-'+data.vouMap.vouNoList[i].noList[j].beginVouNo+' ~ '+page.getVouTypeNameByCode(data.vouMap.vouNoList[i].vouTypeCode)+'-'+data.vouMap.vouNoList[i].noList[j].endVouNo+'</li>');
								$ul.append($li);
							}
						}
					}
					$("#vouPrint .vou-table-info .info-vou dd").eq(1).append($ul);
					
					//打印信息
					$("#vouPrint .vou-table-info .info-print dd").eq(0).text(data.printMap.nprintCount+'张');
					$("#vouPrint .vou-table-info .info-print dd").eq(1).text(data.printMap.printCount+'张');
					if(!data.printMap.latestTime){
						$("#vouPrint .vou-table-info .info-print dd").eq(2).text("");
					}else{
						var latestTime = data.printMap.latestTime;
						latestDay = latestTime.substring(0,latestTime.indexOf(" "));
						latestTime = latestTime.substring(latestTime.indexOf(" ")+1);
						var $ltUl = $('<ul class="list-unstyled">'
							+'<li>'+latestDay+'</li><li>'+latestTime+'</li>'
							+'</ul>');
						$("#vouPrint .vou-table-info .info-print dd").eq(2).html($ltUl);
					}
					$("#vouPrint .vou-table-info .info-print dd").eq(3).text(data.printMap.latestUser?data.printMap.latestUser:"");
					
					//凭证数量
					//循环把对应期间的数量，填入数组对应位置
					for(var k=0;k<data.vouCountMap.length;k++){
						vouCountArr[data.vouCountMap[k].FISPERD-1] = data.vouCountMap[k].VOUCOUNT;
					}
					for(var n=0;n<vouCountArr.length;n++){
						if(vouCountArr[n]==undefined){
							vouCountArr[n] = 0;
						}
					}
				}
				// page.voucounts(vouCountArr);
				
				page.setHeight();
			}, */
			
			//查询条件还原
			resetSearchData:function(){
				// searchListData.accaCode = "";
				searchListData.vouStatus = "";
				// searchListData.vouTypeCode = "";
//				searchListData.startVouNo = "";
//				searchListData.endVouNo = "";
				searchListData.inputorName = "";
				// $("#vouPrint #vpAccaCode button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				// $("#vouPrint #vpVouTypeCodeBtn button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				$("#vouPrint #vpVouStatus button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				// $("#vouPrint #vpVouTypeCode option:eq(0)").prop("selected",true);
//				$("#vouPrint #vpStartVouNo").val("");
//				$("#vouPrint #vpEndVouNo").val("");
				$("#vouPrint #vpShowOwn").prop("checked",false);
				$("#vouPrint #vpInputor").prop("disabled",false).val("");
			},
			
			//初始化页面
			initPage:function(){
				
				
				// page.reslist = ufma.getPermission();
				page.reslist = [
					{id: "btn-check-vou", flag: "9091"},
					{id: "btn-print-preview", flag: "9091"},
					{id: "btn-direct-print", flag: "9091"},
					{id: "btn-printset", flag: "9091"},
					{id: "btn-print-cover", flag: "9091"},
					{id: "btn-query", flag: "9091"},
					{id: "btn-print", flag: "9091"},
					{id: "btn-save-preview", flag: "9091"},
					{id: "btn-save", flag: "9091"}]
				
				svData = ufma.getCommonData();
				user = svData.svUserName;
				
				setYear = svData.svSetYear;
				searchListData.rgCode = svData.svRgCode;
				//初始化期间
				this.defineFisPerd();
				//账套选择
				$('#vpAcctCode').ufTextboxlist({//初始化
					idField:'CHR_CODE',//可选
					textField:'CODE_NAME',//可选
					pIdField:'pId',//可选
					async:false,//异步
					data:[],//列表数据
					onChange:function(sender, treeNode){}
				});
				/* page.cbAcct = $("#cbAcct").ufmaCombox2({
            		valueField:'CHR_CODE',
					textField:'CODE_NAME',
					placeholder:'请选择账套',
					icon:'icon-book',
            		onchange:function(data){
						searchListData.acctCode = data.CHR_CODE;
						
						//查询条件还原
						page.resetSearchData();
						
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
						
						//账套改变后，加载表格信息
						vouCountArr = [];
						$("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");
						ufma.post("/gl/print/message",searchListData,page.getVouInfo);
						//根据单位账套判断是否启用平行记账，不启用时隐藏会计体系
						var url2 = "/gl/eleCoacc/getIsParallel?agencyCode="+searchListData.agencyCode+"&acctCode="+searchListData.acctCode;
						var callback2 = function(result){
							var isParallel = result.data;
							
							if(isParallel!="1"){
								$("#vpAccaCode").parents(".vou-query-li").hide();
							}else{
								$("#vpAccaCode").parents(".vou-query-li").show();
							}
						}
						ufma.get(url2,{},callback2);
						ufma.get("/gl/eleAcca/getRptAccas?agencyCode="+searchListData.agencyCode+"&acctCode="+searchListData.acctCode+"&rgCode="+searchListData.rgCode+"&setYear="+setYear,"",page.initAccaCode);
				    }
            	}); */
				
				//单位选择
				page.cbAgency=$("#cbAgency").ufmaTreecombox2({
					valueField:"id",
					textField:"codeName",
					readonly:false,
					placeholder:"请选择单位",
					icon:"icon-unit",
				    onchange:function(data){
				    	searchListData.agencyCode = data.id;
				    	if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '1') {
							voutypeacca = 1
							vousinglepz = false
						} else if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '0') {
							voutypeacca = 1
							vousinglepz = true
						} else if(data.IS_PARALLEL == '0') {
							voutypeacca = 0
							vousinglepz = false
						}
						//改变单位,账套选择内容改变
				    	var url = '/gl/eleCoacc/getCoCoaccs/'+searchListData.agencyCode;
						var callback = function(result){
							var acctArr = [{
								CHR_CODE: '*',
								CODE_NAME: '全部'
							}]
							for (var i = 0; i < result.data.length; i++) {
								result.data[i].pId = '*'
								acctArr.push(result.data[i])
							}
							$('#vpAcctCode').getObj().load(acctArr);
							$('#vpAcctCode').getObj().val('*');
						}
						ufma.get(url,{},callback);

						if(voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//改变单位，凭证状态改变
						$("#vpVouStatus").html("");
						ufma.get("/gl/vouBox/vouStatus?agencyCode="+searchListData.agencyCode,"",page.initVouStatus);
						
						searchListData.acctCode = '*';
						$("#vouPrint-data .amtSum").text("");
						ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
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

				// ufma.get("/gl/eleAcca/getRptAccas?agencyCode="+searchListData.agencyCode+"&acctCode="+searchListData.acctCode+"&rgCode="+searchListData.rgCode+"&setYear="+setYear,"",page.initAccaCode);
			},
			
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function(){
				//表格单行选中
		       	$("#vouPrint-data").on("click","tbody tr", function(e){
	        		e.preventDefault();
	            	var inputDom = $(this).find('input.checkboxes');
	            	var inputCheck = $(inputDom).prop("checked");
	            	$(inputDom).prop("checked",!inputCheck);
	            	$(this).toggleClass("selected");
	            	var $tmp = $(".checkboxes:checkbox");
	           		$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
	           		return false;
		        });
				
				//点击凭证检查按钮
				/* $("#vouPrint").on("click","#btn-check-vou",function(){
					var vouKindArray = [];
					$("#vouPrint #vpVouTypeCodeBtn button").each(function(){
						if($(this).val()!=""){
							var kindOne = {};
							kindOne.CHR_CODE = $(this).val();
							kindOne.VOU_FULLNAME = $(this).text();
							vouKindArray.push(kindOne);
						}
					});
					//传到凭证检查页面的数据
					var postCheckData = {
						agencyCode:searchListData.agencyCode,
						acctCode:searchListData.acctCode,
						fisPerd:searchListData.fisPerd,
						vouKind:vouKindArray,
						vouTypeArray:vouTypeArray
					};
					ufma.open({
                        url:'vouPrintVouCheck.html',
                        title:'凭证检查',
                        width:800,
//                      height:500,
                        data:{action:'vouCheck',data:postCheckData},
                        ondestory:function(data){
                        	//窗口关闭时回传的值
                        	if(data.action){
								//账套改变后，加载表格
								$("#vouPrint-data .amtSum").text("");
								ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
								
								//账套改变后，加载表格信息
								vouCountArr = [];
								$("#vouPrint .vou-table-info .info-vou dd").html("");
								$("#vouPrint .vou-table-info .info-print dd").html("");
								ufma.post("/gl/print/message",searchListData,page.getVouInfo);
                        	}
                        }
                    });
				}); */
				
				//点击打印封面按钮
				$("#vouPrint").on("click","#btn-print-cover",function(){
					searchListData.acctCode = $('#vpAcctCode').getObj().getValue();
					var postCoverData = {
						agencyName:page.cbAgency.getText(),
						agencyCode:searchListData.agencyCode,
						acctCode:searchListData.acctCode,
						fisPerd:searchListData.fisPerd,
						setYear:setYear
					};
					ufma.open({
						url:'vouPrintPrintCover.html',
						title:'打印封面',
						width:900,
						data:{action:'printCover',data:postCoverData},
						ondestory:function(data){
							//窗口关闭时回传的值
						}
					});
				});
				
				//点击打印设置按钮
				$("#vouPrint").on("click","#btn-printset",function(){
					//传到打印设置页面的数据
					var postSetData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证'
					};
					ufma.open({
                        url:'vouPrintPrintSetOther.html',
                        title:'打印设置',
                        width:950,
//                      height:500,
                        data:{action:'printSet',data:postSetData},
                        ondestory:function(data){
                        	//窗口关闭时回传的值
                        }
                    });
				});
				
				//点击打印预览按钮
				$("#vouPrint").on("click", "#btn-print-preview,#vou-print-preview", function() {
					//清除缓存
					var guidArr = [];
					var acctcodes = ''
					//判断是否有勾选
					if(vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						acctcodes = tableData[0].acctCode
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						acctcodes = tableData[0].acctCode
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					}
					var searchData = {};
					searchData.agencyCode = searchListData.agencyCode;
					searchData.acctCode = $('#vpAcctCode').getObj().getValue();
					searchData.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode: searchListData.agencyCode,
						acctCode: acctcodes,
						componentId: 'GL_VOU'
					}
					var TMPL_CODEs = ''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList', 'post', ajaxdata, function(result) {
						if(result.data.length == 0) {
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印', function() {}, 'warning')
							return false;
						} else {
							TMPL_CODEs = result.data[0].printTmpl.TMPL_CODE
							searchData.tmplCode = TMPL_CODEs
						}
					})
					// 					searchData.formatTmplCode = "3001";
					// 					searchData.tmplCode = "3001";
					var guidArr = [];
					//判断是否有勾选
					if(vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					}
					searchData.vouGuids = guidArr;
					var callback = function(result) {
						var pData = result.data;

						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=100&code=' + TMPL_CODEs + '&blank&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var dno = 0
						var index = setInterval(function() {
							dno++;
							if(connected || dno > 5) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function(event) {
							//连接通信
							if(event.data.hasOwnProperty('uniqueInfo')) {
								if(event.data.uniqueInfo === uniqueInfo) {
									if(event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if(1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if(event.data.result === 1) {
										if(connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if(dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
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
					}
					ufma.post("/gl/vouPrint/getMaPrtData", searchData, callback);
					// window.open('../../pub/printpreview/printPreview.html');
					// window.open('/pqr/pages/query/query.html?sys=100&code=8008001001&button&param&show&param=' + guidArr.join(','));
				});

				//点击直接打印按钮
				$("#vouPrint").on("click", "#btn-direct-print", function() {
					//清除缓存
					var searchData = {};
					var acctcodes = ''
					var guidArr = [];
					//判断是否有勾选
					if(vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						acctcodes = tableData[0].acctCode
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						acctcodes = tableData[0].acctCode
						for(var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					}
					searchData.agencyCode = searchListData.agencyCode;
					searchData.acctCode = $('#vpAcctCode').getObj().getValue();
					searchData.componentId = "GL_VOU";
					// searchData.formatTmplCode = "3001";
					var ajaxdata = {
						agencyCode: searchListData.agencyCode,
						acctCode: acctcodes,
						componentId: 'GL_VOU'
					}
					var TMPL_CODEs = ''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList', 'post', ajaxdata, function(result) {
						if(result.data.length == 0) {
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印', function() {}, 'warning')
							return false;
						} else {
							TMPL_CODEs = result.data[0].printTmpl.TMPL_CODE
							searchData.tmplCode = TMPL_CODEs
						}
					})
					// searchData.tmplCode = "3001";
					
					searchData.vouGuids = guidArr;
					var callback = function(result) {
						var pData = result.data;

						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=100&code=' + TMPL_CODEs + '&print&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var dno = 0
						var index = setInterval(function() {
							dno++;
							if(connected || dno > 5) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function(event) {
							//连接通信
							if(event.data.hasOwnProperty('uniqueInfo')) {
								if(event.data.uniqueInfo === uniqueInfo) {
									if(event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if(1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if(event.data.result === 1) {
										if(connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if(dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
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
					}
					ufma.post("/gl/vouPrint/getMaPrtData", searchData, callback);
					// window.open('../../pub/printpreview/printPreview.html');
					// window.open('/pqr/pages/query/query.html?sys=100&code=8008001001&button&param&show&param=' + guidArr.join(','));
				});

				
				//点击月份
				$("#vouPrint .month-text .month-one a").on("click",function(){
					if(!$(this).parent().hasClass("choose")){
						//样式改变
						$(this).parent().addClass("choose").siblings("li.month-one").removeClass("choose");
						var n = $(this).parent().index();
						$("#vouPrint .blue-line .blue-one:eq("+n+")").addClass("choose").siblings("li.blue-one").removeClass("choose");
						
						searchListData.fisPerd = $(this).attr("data-fisPerd");
						searchListData.acctCode = $('#vpAcctCode').getObj().getValue();
						
						//查询条件还原
						page.resetSearchData();
						
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
						
						//账套改变后，加载表格信息
						/* $("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");
						ufma.post("/gl/print/message",searchListData,page.getVouInfo); */
					}
				});
				$("#vouPrint .blue-line .blue-one").on("click",function(){
					if(!$(this).hasClass("choose")){
						//样式改变
						$(this).addClass("choose").siblings("li.blue-one").removeClass("choose");
						var n = $(this).index();
						$("#vouPrint .month-text .month-one:eq("+n+")").addClass("choose").siblings("li.month-one").removeClass("choose");
						
						searchListData.fisPerd = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd");
						searchListData.acctCode = $('#vpAcctCode').getObj().getValue();
						
						//查询条件还原
						page.resetSearchData();
						
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
						
						//账套改变后，加载表格信息
						/* $("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");
						ufma.post("/gl/print/message",searchListData,page.getVouInfo); */
					}
				});
				
				//会计体系按钮点击
				/* $("#vouPrint #vpAccaCode").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				}); */
				
				//凭证类型按钮点击
				/* $("#vouPrint #vpVouTypeCodeBtn").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
						
						//下方凭证字号的下拉也关联改变
						var val = $(this).val();
						$("#vouPrint #vpVouTypeCode option[value='"+val+"']").prop("selected",true);
					}
				}); */
				
				//凭证状态按钮点击
				$("#vouPrint #vpVouStatus").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				
				//改变凭证字号的凭证类型下拉
				/* $("#vouPrint #vpVouTypeCode").on("change",function(){
					var val = $(this).val();
					$("#vouPrint #vpVouTypeCodeBtn button[value='"+val+"']").removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
				}); */
				
				//点击仅显示自己编制的凭证，制单人输入用户名称同时不可录入
				$("#vpShowOwn").on("change",function(){
					if($(this).prop("checked") === true){
						$("#vpInputor").val(user);
						$("#vpInputor").prop("disabled",true);
					}else{
						$("#vpInputor").val("");
						$("#vpInputor").prop("disabled",false);
					}
				});
				
				//点击查询按钮
				$("#vouPrint #btn-search").on("click",function(){
					searchListData.acctCode = $('#vpAcctCode').getObj().getValue();
					//传参取值
					// searchListData.accaCode = $("#vouPrint #vpAccaCode button.btn-primary").val();
					searchListData.vouStatus = $("#vouPrint #vpVouStatus button.btn-primary").val();
					// searchListData.vouTypeCode = $("#vouPrint #vpVouTypeCode option:selected").val();
//					searchListData.startVouNo = $("#vouPrint #vpStartVouNo").val();
//					searchListData.endVouNo = $("#vouPrint #vpEndVouNo").val();
					searchListData.inputorName = $("#vouPrint #vpInputor").val();
					
					//账套改变后，加载表格
					$("#vouPrint-data .amtSum").text("");
					ufma.post("/gl/print/maacclist",searchListData,page.getVouPrintList);
					
					//账套改变后，加载表格信息
					/* $("#vouPrint .vou-table-info .info-vou dd").html("");
					$("#vouPrint .vou-table-info .info-print dd").html("");
					ufma.post("/gl/print/message",searchListData,page.getVouInfo); */
				})
			},
			
			//此方法必须保留
			init:function(){
				this.initPage();
				this.onEventListener();
				ufma.parseDoubleScroll();
				$(document).on('click', '#vpAccaCode button', function() {
					if(voutypeacca == 1 && vousinglepz == false) {
						if($(this).attr('value') == '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else if($(this).attr('value') != '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + $(this).attr('value'), "get", "", page.initVouType);
						}
					}
				})
			}
		}
	}();
	
/////////////////////
    page.init();
});
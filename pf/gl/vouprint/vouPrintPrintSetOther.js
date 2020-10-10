$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	
	//模板设置传输数据
	var prtSetData = {
		formatTmplCode:"",
		tmplCode:"",
		agencyCode:"",
		acctCode:"",
		componentId:window.ownerData.data.componentId
	};
	
	//保存模板
	var oData = {
		acctCode:'',
		agencyCode:window.ownerData.data.agencyCode
	};
	
	//保存模板表格及信息设置数据
	var saveData = {};
	var prtFormat = {};
	var isCrossDomain = false
	//保存数据(prtFormat+saveData)
	var postTable = {};
	
	//定义datatables全局变量
	var prtSetDataTable;

    var page = function(){
    	var isCrossDomain = false
    	return{
            // 获取账套
            getAcctList:function(result){
                var data = result.data;
                
                if (data.length > 0) {
                    var $op = ''
                    for (var i = 0; i < data.length; i++) {
                        $op += '<option value="'+data[i].CHR_CODE+'">'+data[i].CODE_NAME+'</option>';
                    }
                    $("#prtAcctList").append($op)

                    oData.acctCode = data[0].CHR_CODE;
                    window.ownerData.data.acctCode = data[0].CHR_CODE;
					ufma.post("/pqr/api/report?sys=100", window.ownerData.data, this.getPrtFormatList);
                }
            },
            
    		//表格加载方法(根据辅助核算)
    		getPrtSetTable:function(url,jData){
                var id = "vpps-data";
//              var toolBar = $('#'+id).attr('tool-bar');
    			prtSetDataTable = $("#" + id).DataTable({
    				"language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
//                  "fixedHeader": {
//				    	header: true
//				    },385px
					"scrollY": "320px",
					"scrollCollapse": true,
                    "ajax": url,
                    "bFilter": false,    //去掉搜索框
                    "processing": true,//显示正在加载中
                    "pageLength": -1,
                    "bSort": false, //排序功能
                    "bAutoWidth": false,//表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    "columns": [
                        {
                            title: "辅助项",
                            data: "accItemName"
                        },
                        {
                            title: "编码规则",
                            className: "nowrap",
                            data: "codeRule"
                        },
                        {
                            title: "是否打印",
                            data: null
                        },
                        {
                            title: "打印代码",
                            data: null
                        },
                        {
                            title: "打印名称",
                            data: null
                        },
                        {
                            title: "打印全称",
                            data: null
                        },
                        {
                            title: "明细",
                            data: null
                        },
                        {
                            title: "一",
                            data: null
                        },
                        {
                            title: "二",
                            data: null
                        },
                        {
                            title: "三",
                            data: null
                        },
                        {
                            title: "四",
                            data: null
                        },
                        {
                            title: "五",
                            data: null
                        },
                        {
                            title: "六",
                            data: null
                        },
                        {
                            title: "七",
                            data: null
                        },
                        {
                            title: "八",
                            data: null
                        },
                        {
                            title: "九",
                            data: null
                        },
                        {
                            title: "十",
                            data: null
                        }
                    ],
                    "columnDefs": [
                        {
                            "targets": [0,1],
                            "orderable": false
                        },
                        {
                            "targets": [2],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="isPrint" name="'+rowdata.eleCode+'isPrint" />&nbsp;' +
                                    '<span></span>' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [3],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="printType" disabled="disabled" name="'+rowdata.eleCode+'printType" value="0" />&nbsp;' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [4],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printType" disabled="disabled" name="'+rowdata.eleCode+'printType" value="1" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [5],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printType" disabled="disabled" name="'+rowdata.eleCode+'printType" value="2" /> &nbsp;' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [6],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="0" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [7],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="1" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [8],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="2" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [9],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="3" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [10],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="4" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [11],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="5" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [12],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="6" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [13],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="7" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [14],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="8" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [15],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="9" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                            "targets": [16],
                            "orderable": false,
                            "serchable": false,
                            "className": "text-center",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="radio" class="printLevle" disabled="disabled" name="'+rowdata.eleCode+'printLevle" value="10" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        }
                    ],
                    "dom":'rt',
                    "initComplete": function (settings, json) {},
                    "drawCallback": function (settings) {
                    	if(jData.hasOwnProperty('element')){
                    		//循环载入设置值
	                    	for(var i=0;i<jData.element.length;i++){
	                    		//是否打印
	                    		if(jData.element[i].isPrint=="0"){
	                    			$("#vpps-data input[name='"+jData.element[i].eleCode+"isPrint']").prop("checked",false);
	                    		}else if(jData.element[i].isPrint=="1"){
	                    			$("#vpps-data input[name='"+jData.element[i].eleCode+"isPrint']").prop("checked",true);
	                    		}
	                    		
	                    		//打印类型
	                    		switch(jData.element[i].printType){
	                    			case "0":
	                    				$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='0']").prop("checked",true);
	                    				break;
	                				case "1":
	                					$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='1']").prop("checked",true);
	                    				break;
	            					case "2":
	            						$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='2']").prop("checked",true);
	                    				break;
	                				case "01":
	                					$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='0']").prop("checked",true);
	                					$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='1']").prop("checked",true);
	                    				break;
	                				case "02":
	                					$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='0']").prop("checked",true);
	                					$("#vpps-data input[name='"+jData.element[i].eleCode+"printType'][value='2']").prop("checked",true);
	                    				break;
	                    			default:
	                    				break;
	                    		}
	                    		
	                    		//打印级次
	                    		$("#vpps-data input[name='"+jData.element[i].eleCode+"printLevle'][value='"+jData.element[i].printLevle+"']").prop("checked",true);
	                    		
	                    		//根据是否打印禁用后方checkbox
	                    		$("#vpps-data input.isPrint").each(function(){
	                    			if($(this).prop("checked")==true){
	                    				$(this).parents('tr').find("input.printType").prop("disabled",false);
	                    				$(this).parents('tr').find("input.printLevle").prop("disabled",false);
	                    			}
	                    		});
	                    	}
                    	}
                    	
//                  	$('#vpps-data thead').ufFixedShow({
//							position: 'top',
//							zIndex: 1001, //Z轴
//							offset: 0 //偏移
//						});
                    }
    			});
    		},
    		
    		//获取模板设置信息
    		getPrtSet:function(result){
    			var data = result.data;
    			
				if(data.pubPrtPrintTmpl.defaultTmpl == "0") {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", false)
				} else {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", true)
				}
//  			//套打("0"否  "1"是)
//  			if(data.pubPrtFormatTmpl.tmplType=="0"){
//  				$("#vouPrintPrintSet #tmplType").prop("checked",false).attr("data-guid",data.pubPrtFormatTmpl.formattmplGuid);
//  			}else if(data.pubPrtFormatTmpl.tmplType=="1"){
//  				$("#vouPrintPrintSet #tmplType").prop("checked",true).attr("data-guid",data.pubPrtFormatTmpl.formattmplGuid);
//  			}
//  			
//  			//纸张大小
//  			$("#vouPrintPrintSet dd[data-name='size']").html('<span>长：'+(data.pubPrtPaper.paperHeight*10)+' 毫米</span><span>宽：'+(data.pubPrtPaper.paperWidth*10)+' 毫米</span>');
//  			
//  			//页面方向(parperOrientation)
//  			var $sl;
//  			if(data.pubPrtPaper.paperOrientation=="0"){
//  				$sl = $('<span class="glyphicon icon-file-x"></span>'
//						+'<span>横向</span>');
//  			}else if(data.pubPrtPaper.paperOrientation=="1"){
//					$sl = $('<span class="glyphicon icon-file"></span>'
//						+'<span>纵向</span>');
//  			}
//				$("#vouPrintPrintSet dd[data-name='orientation']").html($sl);
//  			
//  			//页边距
//  			var $ul = $('<ul class="list-unstyled">'
//  				+'<li><span>上：'+data.pubPrtPaper.marginTop+' 毫米</span><span>左：'+data.pubPrtPaper.marginLeft+' 毫米</span></li>'
//  				+'<li><span>下：'+data.pubPrtPaper.marginBottom+' 毫米</span><span>右：'+data.pubPrtPaper.marginRight+' 毫米</span></li>'
//  				+'</ul>');
//				$("#vouPrintPrintSet dd[data-name='margin']").html($ul);
//				
//				//图片
//				$("#vouPrintPrintSet .img").html('<img src="'+data.pubPrtFormatTmpl.tmplImg+'"/>');
//				
				//转换JSON
				var jsonData = "";
				if(data.pubPrtPrintTmpl!=null){
					jsonData = eval('('+data.pubPrtPrintTmpl.tmplValue+')');
				
					//赋值模板guid
					saveData.tmplGuid = data.pubPrtPrintTmpl.tmplGuid;
					
					//科目
					switch(jsonData.acco){
	        			case "0":
	        				$("#dysjsz input[name='print-name'][value='0']").prop("checked",true);
	        				break;
	    				case "1":
	    					$("#dysjsz input[name='print-name'][value='1']").prop("checked",true);
	        				break;
						case "2":
							$("#dysjsz input[name='print-name'][value='2']").prop("checked",true);
	        				break;
	    				case "01":
	    					$("#dysjsz input[name='print-name'][value='0']").prop("checked",true);
	    					$("#dysjsz input[name='print-name'][value='1']").prop("checked",true);
	        				break;
	    				case "02":
	    					$("#dysjsz input[name='print-name'][value='0']").prop("checked",true);
	    					$("#dysjsz input[name='print-name'][value='2']").prop("checked",true);
	        				break;
	        			default:
	        				break;
	        		}
					
					//合计值
					$("#dysjsz input[name='print-sum'][value='"+jsonData.total+"']").prop("checked",true);
				}else{
					//赋值模板guid
					saveData.tmplGuid = "";
				}
				
				//获取辅助核算加载表格
				var dataUrl = "/gl/sys/eleAccItemEnbale/getAccItemAll/"+window.ownerData.data.agencyCode;
				page.getPrtSetTable(dataUrl,jsonData);
    		},
    		
    		//获取模板种类
    		getPrtFormatList:function(result){
//  			var data = result.data;
//              
//              $("#vouPrintPrintSet #prtFormatList").html('');
//              
//              if (data.length > 0) {
//                  prtSetData.formatTmplCode = data[0].formatTmplCode;
//                  prtSetData.tmplCode = data[0].tmplCode;
//                  prtSetData.agencyCode = data[0].agencyCode;
//                  prtSetData.acctCode = data[0].acctCode;
//                  
//                  for(var i=0;i<data.length;i++){
//                      //判断是否为默认模板
//                      if(data[i].defaultTmpl==1){
//                          var $op = $('<option value="'+data[i].tmplCode+'" data-agencyCode="'+data[i].agencyCode+'" data-acctCode="'+data[i].acctCode+'" data-formatTmplCode="'+data[i].formatTmplCode+'" selected="selected">'+data[i].tmplName+'</option>');
//                          $("#vouPrintPrintSet #prtFormatList").append($op);
//                          prtSetData.formatTmplCode = data[i].formatTmplCode;
//                          prtSetData.tmplCode = data[i].tmplCode;
//                          prtSetData.agencyCode = data[i].agencyCode;
//                          prtSetData.acctCode = data[i].acctCode;
//                      }else{
//                          var $op = $('<option value="'+data[i].tmplCode+'" data-agencyCode="'+data[i].agencyCode+'" data-acctCode="'+data[i].acctCode+'" data-formatTmplCode="'+data[i].formatTmplCode+'">'+data[i].tmplName+'</option>');
//                          $("#vouPrintPrintSet #prtFormatList").append($op);
//                      }
//                  }
//                  
//                  ufma.post("/gl/vouPrint/getPrtSet",prtSetData,page.getPrtSet);
//              }
				var data = result.data;
				if(data.length > 0) {
					prtSetData.tmplCode = data[0].reportCode;
					prtSetData.agencyCode = window.ownerData.data.agencyCode;
					prtSetData.acctCode = window.ownerData.data.acctCode;
					prtSetData.componentId = "GL_VOU";
					var $op = ''
					for(var i = 0; i < data.length; i++) {
						$op +='<option templId = '+data[i].templId+' value="' + data[i].reportCode + '"  valueid="' + data[i].reportId + '" data-agencyCode="' + window.ownerData.data.agencyCode + '" data-acctCode="' + window.ownerData.data.acctCode + '" data-formatTmplCode="' + window.ownerData.data.formatTmplCode + '">' + (data[i].templId=="*"? data[i].templName +"(系统级)": data[i].templName) + '</option>'	
					}
					$("#vouPrintPrintSet #prtFormatList").html($op);
					ufma.post("/gl/vouPrint/getPrtSet", prtSetData, page.getPrtSet);
				}
    		},
    		
    		//保存数据
    		savePrtSet:function(result){
    			//设置数据
    			var postSet = {};
    			var accoSum = "";
    			$("#dysjsz input[name='print-name']:checked").each(function(){
    				accoSum = accoSum + $(this).val();
    			});
    			var eleArr = [];
    			$("#vpps-data tbody tr").each(function(){
    				//判断表格tr内是否有勾选(有勾选才传值)
    				if($(this).find(":checked").length!=0){
    					var eleOne = prtSetDataTable.row($(this)).data();
	    				eleOne.isPrint = $(this).find(".isPrint").prop("checked")?"1":"0";
	    				var typeSum = "";
		    			$(this).find(".printType:checked").each(function(){
		    				typeSum = typeSum + $(this).val();
		    			});
	    				eleOne.printType = typeSum;
	    				eleOne.printLevle = $(this).find(".printLevle:checked").val();
	    				eleArr.push(eleOne);
    				}
    			});
    			postSet.acco = accoSum;
    			postSet.element = eleArr;
    			postSet.total = $("#dysjsz input[name='print-sum']:checked").val();
    			
    			saveData.agencyCode = oData.agencyCode;
    			saveData.acctCode = oData.acctCode;
    			saveData.tmplValue = JSON.stringify(postSet).replace(/\"/g,"'");
    			saveData.formatTmplCode = prtSetData.formatTmplCode
				saveData.tmplCode = prtSetData.tmplCode;
				saveData.componentId = prtSetData.componentId;
				if($("#vouPrintPrintSet #prtFormatList option:selected").attr("data-agencyCode")=="*"){
					saveData.tmplGuid = "";
				}
    			
    			prtFormat.tmplType = $("#vouPrintPrintSet #tmplType").prop("checked")?"1":"0";
    			prtFormat.formattmplGuid = $("#vouPrintPrintSet #tmplType").attr("data-guid");
    			
    			postTable.pubPrtPrintTmpl = saveData;
    			postTable.pubPrtFormatTmpl = prtFormat;
				
				return postTable;
    		},
    		
    		initPage:function(){
    			page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
                
                ufma.get('/gl/eleCoacc/getCoCoaccs/' + window.ownerData.data.agencyCode, {}, page.getAcctList);
    			//加载模板种类
    			// ufma.post("/gl/vouPrint/getPrtFormatList",window.ownerData.data,this.getPrtFormatList);
				ufma.post("/pqr/api/report?sys=100", window.ownerData.data, this.getPrtFormatList);
    		},
			
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
				
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
                $("#vouPrintPrintSet").on("change","#prtAcctList",function(){
                    oData.acctCode = $(this).find("option:selected").val();
                    window.ownerData.data.acctCode = $(this).find("option:selected").val();
    //          	ufma.post("/gl/vouPrint/getPrtFormatList",window.ownerData.data,page.getPrtFormatList);

    //				ufma.post("/pqr/api/report?sys=100", window.ownerData.data, this.getPrtFormatList);
                    $.ajax({
                        type: "POST",
                        url: "/pqr/api/report?sys=100&ajax=1",
                        dataType: "json",
                        data: JSON.stringify(window.ownerData.data),
                        contentType: 'application/json; charset=utf-8',
                        async: false,
                        success: function(data) {
                            page.getPrtFormatList(data)
                        },
                        error: function(data) {
                            ufma.showTip("查询失败，请检查网络", function() {}, "error");
                        }
                    });
                });
				//切换纸张模板下拉
				$("#vouPrintPrintSet #prtFormatList").on("change",function(){
//					prtSetData.formatTmplCode = $(this).find("option:selected").attr("data-formatTmplCode");
					if($(this).find("option:selected").attr('templId')=='*'){
						$('.rimsurl').show()
					}else{
						$('.rimsurl').hide()
					}
					prtSetData.tmplCode = $(this).find("option:selected").val();
					prtSetData.agencyCode = window.ownerData.data.agencyCode;
					prtSetData.acctCode = window.ownerData.data.acctCode;
					prtSetData.componentId = 'GL_VOU';
					$("#vpps-data tbody").html("");
					$("#vpps-data input[name='print-name']").prop('checked',false);
					$("#vpps-data input[name='print-sum']").prop('checked',false);
					$("#vpps-data #tmplType").prop('checked',false);
					
					ufma.post("/gl/vouPrint/getPrtSet",prtSetData,page.getPrtSet);
				});
				
				//勾选打印
				$("#vpps-data").on("change","input.isPrint",function(){
					$(this).parents("tr").find("input.printType").prop("disabled",!$(this).prop("checked"));
					$(this).parents("tr").find("input.printLevle").prop("disabled",!$(this).prop("checked"));
					if($(this).prop("checked")==false){
						$(this).parents("tr").find("input.printType").prop("checked",false);
						$(this).parents("tr").find("input.printLevle").prop("checked",false);
					}else if($(this).prop("checked")==true){
						$(this).parents("tr").find("input.printType").eq(0).prop("checked",true);
						$(this).parents("tr").find("input.printType").eq(1).prop("checked",true);
						$(this).parents("tr").find("input.printLevle").eq(0).prop("checked",true);
					}
				});
				
				//点击保存的事件
				$('#btn-save').on('click',function(){
					page.savePrtSet();
					
					var callback = function(result){
						var closeTip = function(){
							_close("save");
						}
						ufma.showTip(result.msg,closeTip,result.flag);
					}
					
					ufma.post("/gl/vouPrint/savePrtSet",postTable,callback);
					$(this).prop("disabled",true);
                });
				page.openNewPages = function (isCrossDomain, that, actionType, baseUrl, isNew, title) {
					if (isCrossDomain) {
						// 此处即为监听到跨域
						var data = {
							actionType: actionType, // closeMenu 关闭   openMenu 打开
							url: window.location.protocol + '//'+ window.location.host  + baseUrl,
							isNew: isNew, // isNew: false表示在iframe中打开，为true的话就是在新页面打开
							title: title // 菜单标题
						}
						window.parent.parent.postMessage(data, '*')
					} else {
						//门户打开方式
						that.attr('data-href', baseUrl);
						that.attr('data-title', title);
						window.parent.parent.openNewMenu(that);
					}
				};
                $('.rimsurl').on('click',function(){
					var codes = $("#vouPrintPrintSet #prtFormatList option:selected").attr('value')
					var ids= $("#vouPrintPrintSet #prtFormatList option:selected").attr('valueid')
					var templId = $("#vouPrintPrintSet #prtFormatList option:selected").attr('templId')
                    var baseUrl = '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids;
                    page.openNewPages(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
                    
				})
				$('.rimsurls').on('click',function(){
					var codes = $("#vouPrintPrintSet #prtFormatList option:selected").attr('value')
					var ids= $("#vouPrintPrintSet #prtFormatList option:selected").attr('valueid')
					var templId = $("#vouPrintPrintSet #prtFormatList option:selected").attr('templId')
                    var baseUrl = '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids+'&templId='+ templId;
                    page.openNewPages(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
				})
                //点击关闭的事件
				$('#btn-qx').click(function(){
            		_close("cancel");
                });
            }
        }
    }();
/////////////////////
    page.init();
});
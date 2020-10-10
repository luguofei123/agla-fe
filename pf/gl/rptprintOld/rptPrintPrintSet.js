$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	
	window.closepost=function(action,element){
        if (window.closeOwner){
            var data = {action:action,element:element};
            window.closeOwner(data);
        }
    }
	
	//定义dataTables全局变量
	var printSetTable;
	
	var oData;
	
    var page = function(){
    	
    	return{
    		
    		//获取表格
    		getSetTable:function(data){
    			var id = "rpps-data";
//              var toolBar = $('#'+id).attr('tool-bar');
                var data = (data==undefined)?null:data;
                printSetTable = $("#" + id).DataTable({
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
                    "columns":[
                    	{
                            title: "辅助项",
                            data: "eleName"
                        },
                        {
                            title: "编码规则",
                            className: "nowrap",
                            data: "codeRule"
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
			      	"columnDefs":[
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
                                    '<input type="checkbox" class="printType" name="'+rowdata.eleCode+'printType" data-code="'+rowdata.eleCode+'" value="0" />&nbsp; ' +
                                    '<span></span> ' +
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
                                    '<input type="radio" class="printType" name="'+rowdata.eleCode+'printType" data-code="'+rowdata.eleCode+'" value="1" />&nbsp; ' +
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
                                    '<input type="radio" class="printType" name="'+rowdata.eleCode+'printType" data-code="'+rowdata.eleCode+'" value="2" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="0" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="1" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="2" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="3" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="4" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="5" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="6" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="7" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="8" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="9" />&nbsp; ' +
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
                                    '<input type="radio" class="printLevle" name="'+rowdata.eleCode+'printLevle" data-code="'+rowdata.eleCode+'" value="10" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        }
			      	],
			      	"dom":'rt',
			      	"initComplete":function(settings,json){},
			      	"drawCallback":function(settings){
			      		for(var i=0;i<oData.length;i++){
			      			//打印类型
	                		switch(oData[i].printType){
	                			case "0":
	                				$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='0']").prop("checked",true);
	                				break;
	            				case "1":
	            					$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='1']").prop("checked",true);
	                				break;
	        					case "2":
	        						$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='2']").prop("checked",true);
	                				break;
	            				case "01":
	            					$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='0']").prop("checked",true);
	            					$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='1']").prop("checked",true);
	                				break;
	            				case "02":
	            					$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='0']").prop("checked",true);
	            					$("#rpps-data input[name='"+oData[i].eleCode+"printType'][value='2']").prop("checked",true);
	                				break;
	                			default:
	                				break;
	                		}
	                		
	                		//打印级次
                    		$("#rpps-data input[name='"+oData[i].eleCode+"printLevle'][value='"+oData[i].printLevle+"']").prop("checked",true);
			      		}
			      	}
		      	});
    		},
    		
    		initPage:function(){
    			oData = window.ownerData.data;
    			
    			page.reslist = ufma.getPermission();
				//权限判断
				ufma.isShow(page.reslist);
    			
    			for(var i=0;i<oData.length;i++){
    				for(var z in oData[i]){
    					if(oData[i][z] == undefined){
    						oData[i][z] = ''
    					}
    				}
    			}
    			this.getSetTable(oData);
    		},
			
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
				
				//点击确认按钮
				$('#btn-confirm').click(function(){
					var eleArr = [];
					$('#rpps-data tbody tr').each(function(){
						//判断表格tr内是否有勾选(有勾选才传值)
    					if($(this).find(":checked").length!=0){
							var eleOne = printSetTable.row($(this)).data();
							var typeSum = "";
			    			$(this).find(".printType:checked").each(function(){
			    				typeSum = typeSum + $(this).val();
			    			});
		    				eleOne.printType = typeSum;
		    				eleOne.printLevle = $(this).find(".printLevle:checked").val();
		    				eleArr.push(eleOne);
    					}
					});
					closepost("confirm",eleArr);
				});
				
				//点击取消的事件
				$('#btn-qx').click(function(){
            		_close();
            	});
            }
        }
    }();
/////////////////////
    page.init();
});
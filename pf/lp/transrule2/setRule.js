$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	
	var srDataTable;
	
	//接口URL集合
	var interfaceURL = {
		getRuleList : "/lp/transRule/getRuleList", //获取对照规则
		updateTransRule : "/lp/transRule/updateTransRule" //修改对照规则
	};

    var page = function(){
    	
    	return{
    		//datatables数据显示
    		getRuleList:function(result){
    			var id = "setRule-data";
    			var data = result.data;
                srDataTable = $('#' + id).DataTable({
                    "language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
				   	"data": data,
				   	"paging": false,
                    "bFilter": false,    //去掉搜索框
                    "bLengthChange": false,   //去掉每页显示多少条数据
                    "processing": true,//显示正在加载中
                    "pagingType": "full_numbers",//分页样式
                    "lengthChange": false,//是否允许用户自定义显示数量p
                    "lengthMenu": [[25,50,100,-1],[25,50,100,"All"]],
                    "pageLength": 25,
                    "bInfo": false,//页脚信息
                    "bSort": false, //排序功能
                    "bAutoWidth": false,//表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    "columns": [
                    	{
                    		title: "对照规则",
                            data: "ruleName"
                    	},
                    	{
                    		title: "操作",
                    		className: "act-style",
                            data: null
                    	}
                    ],
                    "columnDefs": [
                    	{
							"targets": [0],
	                        "orderable": false,
	                        "className": "nameEdit"
						},
                    	{
                            "targets": [-1],
                            "serchable": false,
                            "orderable": false,
                            "render": function (data, type, rowdata, meta) {
                                return '<a class="btn btn-icon-only btn-sm btn-permission row-del" data-toggle="tooltip" action= "" title="删除">'
	                        		+'<span class="glyphicon icon-trash"></span></a>';
                            }
                        }
                    ],
                    "dom":'rt',
                    "initComplete": function (settings, json) {
                    	//点击单元格编辑内容
                    	$("#setRule-data").off("click","tbody td.nameEdit").on("click","tbody td.nameEdit",function(){
                    		if (window.ownerData.isAgy == false||(window.ownerData.isAgy == true&&srDataTable.row($(this).parents("tr")).data().agencyCode != "*")) {
                    			if ($("#nameEdit").get(0)) {
	                    			$("#nameEdit").remove();
	                    		}
	                    		var h = $(this).outerHeight(),w = $(this).outerWidth();
	                    		var $inp = $('<input type="text" name=""  style="height:' + h + 'px;width:' + w + 'px;position:absolute;left:0;top:0" id="nameEdit" value="" placeholder="请输入规则名称" />');
	                    		$(this).append($inp);
	                    		$("#nameEdit").focus();
	                    		$("#setRule-data").on("keydown","#nameEdit",function(e){
	                    			if (e.keyCode == 13) {
	                    				var ruleName = $("#nameEdit").val();
	                    				srDataTable.row($(this).parents("tr")).data()["ruleName"] = ruleName; //先改字段的值，再改td的text否则报错（但是如果td内有span则先后无影响）
	                    				$("#nameEdit").parents("td").text(ruleName);
	                    				$("#nameEdit").remove();
	                    			}
	                    		});
                    		}
                    	});
                    	
                    	//点击行内删除
                    	$("#setRule-data").off("click",".row-del").on("click",".row-del",function(){
                    		srDataTable.row($(this).parents("tr")).remove().draw();
                    	});
                    },
                    "drawCallback": function (settings) {
                    	$("#setRule-data").find("td.dataTables_empty").text("").append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                    	//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						//判断如果是单位级系统级不可删除
						if (window.ownerData.isAgy == true) {
							$("#setRule-data .row-del").each(function(){
								if (srDataTable.row($(this).parents("tr")).data().agencyCode == "*") {
									$(this).attr("disabled","disabled");
								}
							});
						}
                    }
                });
    		},
    		
            //此方法必须保留
            init:function(){
            	ufma.parse();
            	
            	ufma.post(interfaceURL.getRuleList,window.ownerData.post,page.getRuleList);
            	
            	//点击完成
            	$("#btn-finish").click(function(){
            		var saveMap = {
            			item : [],
            			agencyCode : window.ownerData.post.agencyCode,
            			billTypeGuid : window.ownerData.post.billTypeGuid,
            			eleCode : window.ownerData.post.eleCode
            		}
            		$("#setRule-data tbody tr").each(function(){
            			if (window.ownerData.isAgy == false||(window.ownerData.isAgy == true&&srDataTable.row($(this)).data().agencyCode != "*")) {
            				if (srDataTable.row($(this)).data() != undefined) {
	            				saveMap.item.push(srDataTable.row($(this)).data());
	            			}
            			}
            		});
            		ufma.post(interfaceURL.updateTransRule,saveMap,function(result){
            			ufma.showTip(result.msg,function(){
            				if (result.flag == "success") {
            					_close("set");
            				}
            			},result.flag);
            		});
            	});
            	
            	//点击取消
            	$("#btn-qx").click(function(){
            		_close("cancel");
            	});
            }
        }
    }();
/////////////////////
    page.init();
});
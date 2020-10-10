$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	
	var acDataTable;
	
	//接口URL集合
	var interfaceURL = {
		getRuleMap : "/lp/transRule/getRuleMap", //参数包含单据类型和单位和对照规则id，返回结果包括所有要素和已设置要素
		saveRuleMap : "/lp/transRule/saveRuleMap" //保存表头条件
	};

    var page = function(){
    	
    	return{
    		//datatables数据显示
    		getRuleMap:function(result){
    			var id = "addCondition-data";
    			var ori = result.data.ori;
    			var tar = result.data.tar;
                acDataTable = $('#' + id).DataTable({
                    "language": {
                        "url":bootPath+"agla-trd/datatables/datatable.default.js"
                    },
				   	"data": ori,
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
                    		title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'<input type="checkbox" class="datatable-group-checkable" data-set="#data-table .checkboxes"  id="addConditioncheckboxall"/>' +
							'&nbsp;<span></span></label>',
							className: "nowrap check-style",
                            data: null
                    	},
                    	{
                    		title: "条件",
                            data: "itemName"
                    	}
                    ],
                    "columnDefs": [
                    	{
                            "targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap check-style",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="checkboxes" value="' + data + '" data-item="' + rowdata.lpField + '" />&nbsp;' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        }
                    ],
                    "dom":'rt',
                    "initComplete": function (settings, json) {},
                    "drawCallback": function (settings) {
                    	$("#addCondition-data").find("td.dataTables_empty").text("").append('<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                    	
                    	//根据tar勾选
                    	for (var i = 0;i < tar.length;i++) {
                    		$("#addCondition-data input[data-item='" + tar[i].billItem + "']").prop("checked",true).attr("data-cond",tar[i].condition).parents("tr").addClass("selected");
                    	}
                    }
                });
    		},
    		
            //此方法必须保留
            init:function(){
            	ufma.parse();
            	
            	ufma.post(interfaceURL.getRuleMap,window.ownerData.post,page.getRuleMap);
            	
            	//表格单行选中
		       	$("#addCondition-data").on("click","tbody tr", function(e){
	        		e.preventDefault();
	            	var inputDom = $(this).find('input.checkboxes');
	            	var inputCheck = $(inputDom).prop("checked");
	            	$(inputDom).prop("checked",!inputCheck);
	            	$(this).toggleClass("selected");
	            	var $tmp = $(".checkboxes:checkbox");
	           		$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
	           		return false;
		        });
            	
            	$("#addCondition-data").on("click","#addConditioncheckboxall",function(){
            		var dj=$("#addCondition-data tbody").find('input.checkboxes')
            		$(this).is(':checked') ? dj.prop("checked","checked") : dj.prop("checked",false)
            	})
            	//点击确定
            	$("#btn-confirm").click(function(){
            		var saveMap = {
            			item : [],
            			ruleGuid : window.ownerData.post.ruleGuid
            		}
            		$("#addCondition-data tbody tr.selected").each(function(){
            			var itemOne = {
            				ruleGuid : window.ownerData.post.ruleGuid,
            				billItem : acDataTable.row($(this)).data().lpField,//传的是lpField
            				agencyCode : acDataTable.row($(this)).data().agencyCode,
            				billItemParent : acDataTable.row($(this)).data().parentCode
            			}
            			if ($(this).find(".checkboxes").attr("data-cond") != undefined) {
            				itemOne.condition = $(this).find(".checkboxes").attr("data-cond");
            			}
            			saveMap.item.push(itemOne);
            		});
            		ufma.post(interfaceURL.saveRuleMap,saveMap,function(result){
            			ufma.showTip(result.msg,function(){
            				if (result.flag == "success") {
            					_close("save");
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
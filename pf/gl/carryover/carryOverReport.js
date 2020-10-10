$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
    var page = function(){
    	
    	//datatables变量
		var carryOverDataTable;
        var carryOverData;
    	return{
    		
    		//加载dataTables
			getCurrentList:function(result){
				//datable的id
                var tableId = "carryOver-data";
//              var dataTableToolbar = "current-datatable-tool-bar";
                //获取table的toolbar
//              var $toolBar = $($('#' + tableId).attr('tool-bar'));
                var dataSet = result.data;
                console.log(dataSet);
                //var dataSet = [];
                carryOverDataTable = $("#" + tableId).DataTable({
                	"language": {
                        "url": "../../agla-trd/datatables/datatable.default.js",
//                      "zeroRecords": "当前期间未结账，没有结账报告！"
                	},
                	"data":dataSet,
                	"bAutoWidth": false,//表格自定义宽度，和swidth一起用
                	"bSort": false, //排序功能
                	"columns": [
                        {
			           		title:"结账校验规则",
			            	data:"closing_rule_name"
			        	},
			        	{
			           		title:"是否通过",
			            	data:"is_checked"
			        	},
			        	{
			           		title:"详细信息",
			            	data:"closing_rule_des"
			        	},
			        	{
			           		title:"控制方式",
			            	data:"ctl_type"
			        	}
                    ],
                    "columnDefs": [
                        {
                            "targets": [1],
                            "serchable": false,
                            "orderable": false,
                            "className": "current-subject",
                            "render": function (data, type, rowdata, meta) {
                            	switch(rowdata.is_checked){
                              	case "1":
                              		return '<span style="color:#00A854">通过</span>';
                              		break;
                              	case "0":
                              		return '<a href="javascript:void(0);" style="color:#F04134">未通过</a>';
                              		break;
                              }
                            }
                        },
                        {
                            "targets":[3],
                            "render":function(data,type,rowdata,meta){
                            	 switch(rowdata.ctl_type){
	                               	case "1":
	                               		return '禁止结账';
	                               		break;
	                               	case "0":
	                               		return '可以结帐';
	                               		break;
	                               }
                            }
                        }
                    ],
                    "dom":'rt',
                    "drawCallback":function(settings){
                    	$("#" + tableId).find("td.dataTables_empty").text("当前期间未结账，没有结账报告！");
                    }
                });
			},
			
            //此方法必须保留
            init:function(){
            	console.log(window.ownerData);
            	ufma.parse();
            	ufma.post("/gl/CarryOver/getCarryReport",window.ownerData.data,this.getCurrentList);
				//点击关闭的事件
				$('#btn-close').on('click',function(){
					_close('close');
                });
            	
            }
        }
    }();
    page.init();
});
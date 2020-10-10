$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	
	window.closepost=function(action,accoCode,eleSource,content){
        if (window.closeOwner){
            var data = {action:action,accoCode:accoCode,eleSource:eleSource,content:content};
            window.closeOwner(data);
        }
    }
	
	//定义datatable全局变量
	var conditionSetDataTable;
	
	var getPrtSet = {};
	
	var oData = {};
	
    var page = function(){
    	
    	return{
    		
    		//加载条件设置表格，接口：/gl/GlRpt/getPrtSet
    		getConditionSet:function(result){
    			var id = "rpcs-data";
//              var toolBar = $('#'+id).attr('tool-bar');
                var data = result.data;
                conditionSetDataTable = $("#" + id).DataTable({
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
                            title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                            '<input type="checkbox" class="datatable-group-checkable"/>&nbsp; ' +
                            '<span></span> ' +
                            '</label>',
                            className:"nowrap",
                            data: null
                        },
                        {
                        	title: "编码",
                            data: "chrCode"
                        },
                        {
                        	title: "名称",
                            data: "chrName"
                        }
                    ],
			      	"columnDefs":[
			      		{
                            "targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                    '<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp; ' +
                                    '<span></span> ' +
                                    '</label>';
                            }
                        },
                        {
                        	"targets": [1,2],
                            "orderable": false,
                            "className": "nowrap"
                        }
			      	],
			      	"dom":'rt',
			      	"initComplete":function(settings,json){
			      		//行内操作
                        $("#" + id + ' .btn').on("click", function () {
                            page.actionMore($(this).attr("action"), [$(this).attr("rowid")], $(this).closest('tr'));
                        });

                        //行checkbox的单选操作
                        $("#" + id + " tbody td:not(.btnGroup)").on("click", function (e) {
                            e.preventDefault();
                            var $ele = $(e.target);
                            //如果是a标签，就进入查看详情页
                            if ($ele.is('a')) {
                                page.bsAndEdt($ele.data('href'));
                                return false;
                            }
                            var $tr = $ele.closest("tr");
                            if ($tr.hasClass("selected")) {
                                $tr.find("input[type=checkbox]").prop("checked", false);
                                $tr.removeClass("selected");
                            } else {
                                $tr.find("input[type=checkbox]").prop("checked", true);
                                $tr.addClass("selected");
                            }
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
			      	"drawCallback":function(settings){
			      		if(typeof(window.ownerData.data.content)!="undefined"){
			      			var content = window.ownerData.data.content;
				      		//遍历表格行
				      		$('#rpcs-data tr').each(function(){
				      			//循环根据code查找对应行
				      			for(var i=0;i<content.length;i++){
				      				if($(this).find('td:eq(1)').text()==content[i].code){
				      					$(this).find('input.checkboxes').prop('checked',true);
				      					$(this).addClass('selected');
				      				}
				      			}
				      		});
			      		}
			      	}
                });
    		},
    		
    		initPage:function(){
    			oData = window.ownerData.data;
    			
    			page.reslist = ufma.getPermission();
				//权限判断
				ufma.isShow(page.reslist);
    			
    			getPrtSet.agencyCode = oData.agencyCode;
				getPrtSet.acctCode = oData.acctCode;
				getPrtSet.eleSource = oData.eleSource;
				getPrtSet.eleCode = oData.eleCode;
    			ufma.post("/gl/GlRpt/getPrtSet",getPrtSet,page.getConditionSet);
    		},
			
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
				
				//点击确定的事件
				$('#btn-confirm').click(function(){
//					code:'1001',name:'财务部',contentIsCheck:'1'
					var  contentArr = [];
					$('#rpcs-data tbody tr.selected').each(function(){
						var contentOne = {};
						contentOne.code = conditionSetDataTable.row($(this)).data().chrCode;
						contentOne.name = conditionSetDataTable.row($(this)).data().chrName;
						contentOne.contentIsCheck = "2";
						contentArr.push(contentOne);
					});
					closepost("confirm",oData.accoCode,oData.eleSource,contentArr);
				});
				
				//点击取消的事件
				$('#btn-qx').click(function(){
            		_close("cancel");
            	});
                $("#rptPrintConditionSet #searchHideBtn").on("click",function(evt){
                    evt.stopPropagation();
                    if($("#rptPrintConditionSet .searchHide").hasClass("focusOff")){
                        var newVal = $("#rptPrintConditionSet .searchValueHide").val();
                        if(newVal != ""){
                            $("#rptPrintConditionSet .searchHide").val(newVal);
                        }
                        $("#rptPrintConditionSet .searchHide").show().animate({"width":"160px"}).focus().removeClass("focusOff");
                    }else{
                        $('#rpcs-data tbody tr').show();
                        $('#rpcs-data tbody tr').removeClass('show-tr');
                        var val = $(this).siblings("input[type='text']").val();
                        $("#rptPrintConditionSet .searchValueHide").val(val);
                        $("#rpcs-data tbody tr").each(function(){
                            if($(this).find('td').text().indexOf(val)!=-1){
                                //没有要检索的内容
                                $(this).addClass('show-tr');
                            }
                        });
                        $('#rpcs-data tbody tr:not(.show-tr)').hide();
                    }
                });
            }
        }
    }();
/////////////////////
    page.init();
});
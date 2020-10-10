$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};

	var onerdata = window.ownerData;
	var page = function() {
		return {
			renderTable: function() {
				var data = onerdata.data;
				if(onerdata.pageType == 'ACCO') {//禅道83393：系统级会计科目下发，下发结果信息展示中，无下发账套信息，看起来存在多条相同成功记录--zsj--会计科目下发时添加了账套编码
					page.colName = '科目代码';
					var tHead = '<ul class="tHead clearfix" style="width:1162px;margin-left:-20px;">' +
						'<li class="head-agency-code tc"style="width:128px;">单位代码</li>' +
						'<li class="head-acct-code tc borderL"style="width:122px;">账套代码</li>' +
						'<li class="head-acco-code tc borderR borderL" style="width:300px;">' + page.colName + '</li>' + //科目代码//要素代码
						'<li class="head-status tc borderR"style="width:40px;">状态</li>' +
						'<li class="head-reason tc" style="width:570px;">原因</li>' +
						'</ul>';
					$(".content").append(tHead);
					if(data && !$.isNull(data)) {
						for(var i = 0; i < data.length; i++) {
							var row = '<div class="table-row  clearfix" style="width:1162px;margin-left:-20px;">' +
								'<div class="agencyCode block tc updateHeight" style="width:128px;">' + data[i].agencyCode + '</div>' +
								'<div class="acctCode block tc borderL" style="width:122px;">' + data[i].acctCode + '</div>' +
								'<div class="accoCode block borderR borderL tc"style="width:300px;"></div>' +
								'<div class="statuss block borderR tc"style="width:40px;"></div>' + 
								'<div class="reason block tc" style="width:570px;"></div>' +
								'</div>';
							$(".content").append(row);
						}
					}
				} else {
					page.colName = onerdata.colName + '代码';
					var tHead = '<ul class="tHead clearfix" style="width:1040px;">' +
						'<li class="head-agency-code tc"style="width:128px;">单位代码</li>' +
						'<li class="head-acco-code tc borderR borderL" style="width:300px;">' + page.colName + '</li>' + //科目代码//要素代码
						'<li class="head-status tc borderR"style="width:40px;">状态</li>' +
						'<li class="head-reason tc" style="width:570px;">原因</li>' +
						'</ul>';
					$(".content").append(tHead);
					if(data && !$.isNull(data)) {
						for(var i = 0; i < data.length; i++) {
							var row = '<div class="table-row  clearfix" style="width:1040px;">' +
								'<div class="agencyCode block tc" style="width:128px;">' + data[i].agencyCode + '</div>' +
								'<div class="accoCode block borderR borderL tc"style="width:300px;"></div>' +
								'<div class="statuss block borderR tc"style="width:40px;"></div>' +
								'<div class="reason block tc" style="width:570px;"></div>' +
								'</div>';
							$(".content").append(row);

						}
					}
				}

				//data[k].status为1是全部成功，data[k].status为2是部分成功，data[k].status为3是全部失败
				// CWYXM-16627【20200430 财务云8.20.15】mysql 基础资料-部门经济分类选用成功弹窗错乱
				setTimeout(function () {
					$(".table-row").each(function(k) {
						var failIssueList = data[k].failIssueList;
						if(!$.isNull(failIssueList) && failIssueList.length > 0) {
							for(var i = 0; i < failIssueList.length; i++) {
								var failChrCodes = failIssueList[i].failChrCodes.join(",");
								var failCodesRow = '<div title="' + failChrCodes + '">' + failChrCodes + '</div>';
								if(data[k].status == "1" || data[k].status == "3") {
									failCodesRow = '<div title="全部科目">全部</div>'; //全部科目
								}
								$(this).find(".accoCode").append(failCodesRow);
								$(this).find(".statuss").append('<div>失败</div>');
								var failMsg = failIssueList[i].failMsg.replace(/\<br>/gm, "");
								$(this).find(".reason").append('<div style="border-bottom:1px solid #d9d9d9;" title="' + failMsg + '">' + failMsg + '</div>');
							}
						}
	
						if(!$.isNull(data[k].successList) && data[k].successList.length > 0) {
							var successList = data[k].successList.join(",");
							var successRow = '<div>' + successList + '</div>';
							if(data[k].status == "1" || data[k].status == "3") {
								successRow = '<div>全部</div>'; //全部科目
							}
							$(this).find(".accoCode").append(successRow);
							$(this).find(".statuss").append('<div>成功</div>');
						}
						$(this).find('.agencyCode,.acctCode').css({
							"height":$(this).find('.accoCode').height() +'px',
							"line-height":$(this).find('.accoCode').height() +'px'
						});
					});
				  }, 100);	
			},

			//初始化页面
			initPage: function() {
				page.renderTable();
				setTimeout(function () {
					var height = $('.ufma-layout-updown').outerHeight(true) - 50;
					$(".ufma-layout-up").css("height", height);
				}, 100);
				// var tableData = [];
				// if(onerdata[0].successList.length > 0){
				//     var obj = {
				//         codes:onerdata[0].successList.join(","),
				//         status:"成功",
				//         msg:""
				//     };
				//     tableData.push(obj);
				// }
				// if(onerdata[0].failIssueList.length > 0){
				//     var failIssueList = onerdata[0].failIssueList;
				//     for(var i = 0;i<failIssueList.length;i++){
				//         var obj = {
				//             codes:failIssueList[i].failChrCodes.join(","),
				//             status:"失败",
				//             msg:failIssueList[i].failMsg
				//         };
				//         tableData.push(obj);
				//     }
				// }
				//
				// var columns = [
				//     {
				//         title:"科目代码",
				//         data:"codes",
				//         className:"tc",
				//         width:300,
				//         "render": function (data, type, rowdata, meta) {
				//             return '<div class="charCodes" style="width: 300px;overflow: hidden;text-overflow: ellipsis" title="'+data+'">'+data+'</div>'
				//         }
				//     },
				//     {
				//         title:"状态",
				//         data:"status",
				//         className:"tc",
				//         "render": function (data, type, rowdata, meta) {
				//             var style;
				//             if(data == "成功"){
				//                 style = "color:green";
				//             }else{
				//                 style = "color:red";
				//             }
				//             return '<div style="'+style+'">'+data+'</div>'
				//         }
				//     },
				//     {
				//         title:"原因",
				//         data:"msg",
				//         width: 600
				//     },
				// ];
				// var id = "tipTable"
				// page.tipTable = $('#tipTable').DataTable({
				//     "language": {
				//         "url": bootPath + "agla-trd/datatables/datatable.default.js"
				//     },
				//     "data": tableData,
				//     "searching": true,
				//     "bFilter": false, //去掉搜索框
				//     "bLengthChange": true, //去掉每页显示多少条数据
				//     "processing": true, //显示正在加载中
				//     "pagingType": "full_numbers", //分页样式
				//     "lengthChange": true, //是否允许用户自定义显示数量p
				//     "lengthMenu": [
				//         [25, 50, 100, -1],
				//         [25, 50, 100, "全部"]
				//     ],
				//     // "pageLength": pageLength,
				//     "bInfo": true, //页脚信息
				//     "bSort": false, //排序功能
				//     "bAutoWidth": false, //表格自定义宽度，和swidth一起用
				//     "bProcessing": true,
				//     "bDestroy": true,
				//     "columns": columns,
				//     "dom":'<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
				//     "initComplete": function (settings, json) {
				//         //驻底begin
				//         $('.datatable-toolbar').appendTo('#dtToolbar');
				//         var toolBar = $(this).attr('tool-bar');
				//         var $info = $(toolBar + ' .info');
				//         if ($info.length == 0) {
				//             $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
				//         }
				//         $info.html('');
				//         $('.' + id + '-paginate').appendTo($info);
				//         $(".tipTable-paginate").hide();
				//         $(".dt-buttons").hide();
				//
				//     },
				//     "drawCallback": function (settings) {
				//     }
				// });
			},
			onEventListener: function() {
				$("#btn-close").on("click", function() {
					_close();
				})
			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}

		}
	}();
	page.init();

});
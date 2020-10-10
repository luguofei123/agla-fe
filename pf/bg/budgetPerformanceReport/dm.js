var dm = $.extend(true, ufma.getCommonData(), {
	curPlan: {},
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/bg/sysdata/getAgencyList';
				break;
				//查询方案
			case 'savePlan':
				url = '/bg/report/saveReportFindPlan'; ////3, 保存报表的查询方案信息 {prjGuid : '方案的GUID' 如果=null 或者='' 表示是新方案,agencyCode : 单位代码,userName:'',userId :'',rptType :'',prjName :'', prjContent :方案内容，是json字符串。具体含义报表自行定义}
				break;
			case 'getPlan':
				url = '/bg/report/getReportFindPlan'; //2, 获取报表的查询方案信息 {agencyCode : '',userId : '',userName : '',rptType : ''}
				break;
			case 'delPlan':
				url = '/bg/report/deleteReportFindPlan'; //4, 删除报表的查询方案信息 {agencyCode : '',userId : '',prjGuid : ''}
				break;
			case 'queryExec':
				url = '/bg/report/getBgExecuteReport'; //执行情况

				break;
			default:
				break;
		}
		return url;
	},
	doGet: function(ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function(result) {}
		ufma.get(this.getCtrl(ctrl), argu, _callback);
	},
	doPost: function(ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function(result) {}
		ufma.post(this.getCtrl(ctrl), argu, _callback);
	},
	doDel: function(ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function(result) {}
		ufma.delete(this.getCtrl(ctrl), argu, _callback);
	},
	//方案初始化begin
	showPlan: function(argu) {
		function buildPlanItem(data) {
			for(var i = 0; i < data.length; i++) {
				var liHtml = ufma.htmFormat('<li data-agency="<%=agency%>" data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
					code: data[i].prjGuid,
					name: data[i].prjName,
					scope: data[i].prjScope,
					agency: data[i].agencyCode
				});
				var $li = $(liHtml);
				$.data($li[0], 'planData', data[i]);
				$li[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
			}
		}
		$("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
		this.getPlan(argu, buildPlanItem);

		$("#rptPlanList").off().on('click', 'li', function(e) {
			if($(e.target).is('.btn-close')) {
				var _li = $(this).closest('li');
				var planCode = _li.attr('data-code');
				var planName = _li.attr('data-name');
				var agencyCode = _li.attr('data-agency');
				dm.delPlan(agencyCode, planCode, planName, argu, function(action) {
					if(action) {
						_li.remove();
						$("#rptPlanList").ufTooltip('hide');
					}
				});
			} else {
				$("#rptPlanList").ufTooltip('hide');
				// if($(this).hasClass('selected')) return false;
				$(this).siblings('.selected').removeClass('selected');
				$(this).addClass('selected');

				var planCode = $(this).attr('data-code');
				dm.selectPlan($(this));
			}
		});
	},
	selectPlan: function(ths) {
		var tmpDataObj = $.data($(ths)[0], 'planData');
		dm.moreMsgSetting.id = {
			'findTable': '_reportFindMore_findTable_bgMoreMsgPnl-bgPerformanceReport'
		};
		dm.moreMsgSetting.contentObj = $.extend({}, tmpDataObj);
		_bgPub_PNL_ReportFind_ShowCase(dm.moreMsgSetting, JSON.parse(tmpDataObj.prjContentOfString));
		dm.showMore();
	},
	delPlan: function(agencyCode, planCode, planName, argu, _callback) {
		ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
			if(action) {
				var argu = {
					"agencyCode": agencyCode,
					"prjGuid": planCode,
					"userId": dm.svUserId //修改权限  将svUserCode改为 svUserId  20181012
				};
				dm.doPost('delPlan', argu, function(result) {
					ufma.showTip("方案删除成功！", function() {}, "success");
					_callback(true);
				});
			}
		}, {
			type: 'warning'
		});
	},
	getPlan: function(argu, _callback) {
		this.doPost('getPlan', argu, function(result) {

			_callback(result.data.items);
		});
	},
	//方案初始化end
});
$.fn.dataTable.ext.errMode = 'none';
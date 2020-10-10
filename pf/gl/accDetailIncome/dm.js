var dm = $.extend(true, ufma.getCommonData(), {
	curPlan: {},
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
				//账套
			case 'acct':
				url = '/gl/eleCoacc/getCoCoaccs/';
				break;
				//查询方案
			case 'getPlan':
				url = '/gl/rpt/prj/getPrjList';
				break;
			case 'getShearPlan':
				url = '/gl/rpt/prj/getSharePrjList';
				break;
			case 'delPlan':
				url = '/gl/rpt/prj/deletePrj';
				break;
				//票据类型、往来单位
			case 'commonApi':
				url = '/gl/elecommon/getEleCommonTree';
				break;
			case 'acco':
				url = '/gl/sys/coaAcc/getRptAccoTree';
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
	//票据类型、往来单位
	commonApi: function(argu, _callback) {
		this.doGet('commonApi', argu, _callback);
	},

	//方案初始化begin
	showPlan: function(argu) {
		function buildPlanItem(data) {
			for(var i = 0; i < data.length; i++) {
				var liHtml = ufma.htmFormat('<li data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
					code: data[i].prjCode,
					name: data[i].prjName,
					scope: data[i].prjScope
				});
				$(liHtml)[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
			}
		}
        $("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
		argu.userId = dm.svUserId;
		this.getPlan(argu, buildPlanItem);
		this.getShearPlan(argu, buildPlanItem);

		$("#rptPlanList").off().on('click', 'li', function(e) {
			if($(e.target).is('.btn-close')) {
				var _li = $(this).closest('li');
				var planCode = _li.attr('data-code');
				var planName = _li.attr('data-name');
				dm.delPlan(planCode, planName, function(action) {
					if(action) {
						_li.remove();
						$("#rptPlanList").addClass('hide');
					}
				});
			} else {
				$("#rptPlanList").addClass('hide');
				$(this).siblings('.selected').removeClass('selected');
				$(this).addClass('selected');
				var planCode = $(this).attr('data-code');
				dm.selectPlan(planCode);
			}
		});
	},
	selectPlan: function(planCode) {
		//此方法调用rptCommon2.js
		rpt.reqPrjCont(planCode);
	},
	delPlan: function(planCode, planName, _callback) {
		ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
			if(action) {
				var argu = {
					"agencyCode": rpt.nowAgencyCode,
					"prjCode": planCode,
					"rptType": rpt.rptType,
					"setYear": dm.svSetYear,
					"userId": dm.svUserId
				};
				dm.doDel('delPlan', argu, function(result) {
					ufma.showTip("方案删除成功！", function() {}, "success");
					_callback(true);
					//如果删除的是当前选择的方案，需要清空查选条件
					if(rpt.prjCode == planCode) {
						rpt.backToOrigin();
					}
				});
			}
		}, {
			type: 'warning'
		});
	},

	getPlan: function(argu, _callback) {
		this.doGet('getPlan', argu, function(result) {
			_callback(result.data);
			if(result.data.length == 0) {
				$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
			};
		});
	},
	getShearPlan: function(argu, _callback) {
		this.doGet('getShearPlan', argu, function(result) {
			_callback(result.data);
		});
	}
	//方案初始化end
});
$.fn.dataTable.ext.errMode = 'none';
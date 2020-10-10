var dm = {
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/bg/sysdata/getAgencyList';
				break;
				//预算方案
			case 'bgPlan':
				url = '/bg/sysdata/getBgPlanArray'; //多区划
				break;
				//单位年结状态
			case 'agencyStatus':
				url = '/bg/api/getStatus';
				break;
				//指标检查
			case 'dataCheck':
				url = '/bg/api/dataCheck';
				break;
			case 'getBgItms':
				url = '/bg/api/getBgItms';
				break;
				//选中要处理的指标进行处理
			case 'yearInit':
				url = '/bg/api/yearInit';
				break;
			case 'yearInitBack':
				url = '/bg/api/cancelYearInit';
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
	}
}
$.fn.dataTable.ext.errMode = 'none';
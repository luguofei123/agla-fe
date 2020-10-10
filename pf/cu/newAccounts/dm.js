var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/cu/common/eleAgency/getAgencyTree';
				break;
			//单位年结状态
			case 'queryDPE':
				url = '/cu/initNewYear/getBookInitData';
				break;
			//指标检查
			case 'dataCheck':
				url = '/cu/initNewYear/checkBookInitData';
				break;
			//选中要处理的指标进行处理
			case 'yearInit':
				url = '/cu/initNewYear/doBookInitData';
				break;
			case 'carryItems':
				url = '/cu/initNewYear/initNewYearForBankScheData';
				break;
			default:
				break;
		}
		return url;
	},
	doGet: function (ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function (result) { }
		ufma.get(this.getCtrl(ctrl), argu, _callback);
	},
	doPost: function (ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function (result) { }
		ufma.post(this.getCtrl(ctrl), argu, _callback);
	},
	doDel: function (ctrl, argu, _callback) {
		argu = argu || {};
		_callback = _callback || function (result) { }
		ufma.delete(this.getCtrl(ctrl), argu, _callback);
	},
	//取表格数据
	loadGridData: function (argu, _callback) {
		this.doGet('queryDPE', argu, _callback);
	},
}
$.fn.dataTable.ext.errMode = 'none';
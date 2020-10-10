var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/cu/common/eleAgency/getAgencyTree';
				break;
			//查询主表格数据
			case 'search':
				url = '/cu/journalReport/selectMoneyInfo';
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
		argu = argu || {};
		_callback = _callback || function (result) { }
		ufma.get(this.getCtrl('search'), argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
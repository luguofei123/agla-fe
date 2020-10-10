var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/cu/common/eleAgency/getAgencyTree';
				break;
			//账簿
			case 'accBook':
				url = '/cu/cuAccountBook/getBookTree';
				break;
			//获取未结账信息
			case 'getTableData':
				url = '/cu/cuAccountBook/getTerminalData';
				break;
			//多账簿结账
			case 'postMoreBook':
				url = '/cu/cuAccountBook/closeAccountForBooks';
				break;
			//多账簿反结账
			case 'postMoreBookOp':
				url = '/cu/cuAccountBook/openAccountForBooks';
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
		this.doGet('getTableData', argu, _callback);
	},
	//多账簿结账
	postMoreBook: function (argu, _callback) {
		this.doPost('postMoreBook', argu, _callback);
	},
	//多账簿反结账
	postMoreBookOp: function (argu, _callback) {
		this.doPost('postMoreBookOp', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
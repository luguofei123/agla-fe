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
				url = '/cu/cuAccountBook/getBookTree?' + '&accountbookTypes=1'; //现金日记账取ACCOUNTBOOK_TYPE=1
				break;
			case 'queryDPE':
				url = '/cu/cuAccountBook/select';
				break;
			//辅助核算项
			case 'fzhxlb':
				//url ='/cu/common/getAccoItems';
				url = '/cu/common/getAccItemList';
				break;
			case 'fzhxs':
				url = '/cu/common/getEleTree';
				break;
			//票据类型
			case 'accItem':
				url = '/cu/common/getEleTree';
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
		this.doPost('queryDPE', argu, _callback);
	},
	getAccoFZ: function (argu, _callback) {
		this.doGet('fzhxlb', argu, _callback);
	},
	//辅助核算
	cbbAccItem: function (argu, _callback) {
		this.doGet('accItem', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
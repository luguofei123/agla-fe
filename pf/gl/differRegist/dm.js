var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
			case 'acct':
				url = '/gl/eleCoacc/getCoCoaccs/';
				break;
			//登记
			case 'queryDPE':
				url = '/cu/journal/selectCuJournal';
				break;
			//删除
			case 'delete':
				url = '/cu/journal/delCuJournal';
				break;
			//获取一个详细信息
			case 'getOne':
				url = '/cu/journal/selectCuJournal';
				break;
			case 'getAcco':
				url = '/gl/common/glAccItemData/getAccItemTree';
				break;
			case 'getCWData':
				url = '/cu/journal/getGlRptJournalData';
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
	//删除
	delete: function (argu, _callback) {
		this.doPost('delete', argu, _callback);
	},
	//获取一个
	cbbGetone: function (argu, _callback) {
		this.doGet('getOne', argu, _callback);
	},
	//会计科目
	cbbAcco: function (argu, _callback) {
		this.doGet('getAcco', argu, _callback);
	},
	//从账务取数
	cbbGetData: function (argu, _callback) {
		this.doGet('getCWData', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
var dm = {
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/lp/eleAgency/getAgencyTree';
				break;
				//账套
			case 'acct':
				url = '/gl/eleCoacc/getRptAccts' 
				break;
			case 'queryDPE':
				url = '/lp/checkVouAssest/getDatas';
				break;
			case 'balanceAcc':  //对账
				url = '/lp/assest/checkAssest';
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
	//取表格数据
	loadGridData: function(argu, _callback) {
		this.doGet('queryDPE', argu, _callback);
	},
	 
	balanceAcc:function(argu, _callback) {
		this.doPost('balanceAcc', argu, _callback);
	},
	 acct:function(argu, _callback) {
		this.doGet('acct', argu, _callback);
	}
	
}
$.fn.dataTable.ext.errMode = 'none';
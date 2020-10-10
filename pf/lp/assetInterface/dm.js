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
				url = '/lp/sys/getRptAccts' 
				break;
			case 'queryDPE':
				url = '/lp/assest/getAssestData';
				break;
				//单据方案
			case 'djfa':
				url = '/lp/assest/billScheme';
				break;
			case 'balanceAcc':  //对账
				url = '/lp/assest/checkAssest';
				break;
				
            case 'canBalance':  //取消对账
				url = '/lp/assest/cancelCheck';
				break;
			 case 'vouTree':  //凭证树
				url = '/lp/assest/getVouTree';
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
		this.doPost('queryDPE', argu, _callback);
	},
	djfa: function(argu, _callback) {
		this.doGet('djfa', argu, _callback);
	},
	vouTree: function(argu, _callback) {
		this.doGet('vouTree', argu, _callback);
	},
	balanceAcc:function(argu, _callback) {
		this.doPost('balanceAcc', argu, _callback);
	},
	canBalance:function(argu, _callback) {
		this.doPost('canBalance', argu, _callback);
	},
	acct:function(argu, _callback) {
		this.doGet('acct', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
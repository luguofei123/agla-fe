var dm = {
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
				//账套树
			case 'acct':
				url = '/gl/eleCoacc/getRptAccts';
				break;
				//数据检查
			case 'dataCheck':
				url = '/gl/generateNewAccount/carryForwardValidate';
				break;
			case 'carryForward':
				url = '/gl/generateNewAccount/carryForward';
				break;
				//单位状态查询
			case 'agencyStatus':
				url = '/gl/generateNewAccount/carryForwardStatus';
				break;
				//科目表查询
			case 'getAccoRelation':
				url = '/gl/generateNewAccount/getAccoRelation';
				break;
				//获取会计科目
			case 'getAcco':
				//url = '/gl/common/glAccItemData/getAccItemTree';
				url = '/gl/generateNewAccount/getAccoTree';//CWYXM-12691 ---项目反馈 上下年度单位账套编码调整后，自定义年结，未带出下一年度科目数据--zsj
				break;
				//辅助项表查询
			case 'getItem':
				url = '/gl/generateNewAccount/getItem';
				break;
				//未达账项查询
			case 'getBankScheData':
				url = '/gl/generateNewAccount/initNewYearForBankScheData';
				break;
				//查询下一年度数据
			case 'getAccoItem':
				url = '/gl/generateNewAccount/getAccoItem';
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
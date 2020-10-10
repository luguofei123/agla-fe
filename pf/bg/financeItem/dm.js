var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/bg/sysdata/getAgencyList';
				break;
			//财政预算方案
			case 'bgPlan':
				url = '/bg/sysdata/getBgPlanArray';
				break;
			//单位预算方案
			case 'DWbgPlan':
				url = '/bg/budgetItem/multiPost/getComposeblePlans';
				break;
			//获取财政指标
			case 'getBudgetItems':
				url = '/bg/budgetItem/multiPost/getBudgetItems';
				break;
			//获取单位指标
			case 'getAgencyBudgetItems':
				url = '/bg/AgencyItem/getAgencyBudgetItems';
				break;
			//登记
			case 'bgPlanItem':
				url = '/bg/sysdata/getEleBgItemValues';
				break;
			//新增一条指标
			case 'newBudgetItem':
				url = '/bg/budgetItem/newBudgetItem';
				break;
			//审核一条指标
			case 'auditAgencyItems':
				url = '/bg/AgencyItem/auditAgencyItems';
				break;
			//销审一条指标
			case 'cancelAuditAgencyItems':
				url = '/bg/AgencyItem/cancelAuditAgencyItems';
				break;
			//保存一条指标
			case 'saveAgencyItems':
				url = '/bg/AgencyItem/saveAgencyItems';
				break;
			//预览一条指标
			case 'importAgencyItems':
				url = '/bg/AgencyItem/importAgencyItems';
				break;
			//导入一条指标
			case 'insertAgencyItems':
				url = '/bg/AgencyItem/insertAgencyItems';
				break;
				//获取单位指标预算方案下的指标
			case 'getAgencyItems':
				url = '/bg/AgencyItem/getAgencyItemsByPlan';
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
	//根据要素编码获取要素信息
	cbbGetone: function (argu, _callback) {
		this.doGet('bgPlanItem', argu, _callback);
	},
	//获取财政预算方案
	cbbBgPlan: function (argu, _callback) {
		this.doGet('bgPlan', argu, _callback);
	},
	//获取单位预算方案
	cbbDWBgPlan: function (argu, _callback) {
		this.doPost('DWbgPlan', argu, _callback);
	},
	//获取财政指标
	cbbGetBudgetItems: function (argu, _callback) {
		this.doPost('getBudgetItems', argu, _callback);
	},
	//获取单位指标
	cbbGetDWBudgetItems: function (argu, _callback) {
		this.doPost('getAgencyBudgetItems', argu, _callback);
	},
	//审核指标 
	cbbAuditBudgetItems: function (argu, _callback) {
		this.doPost('auditAgencyItems', argu, _callback);
	},
	//保存指标 
	cbbSaveBudgetItems: function (argu, _callback) {
		this.doPost('saveAgencyItems', argu, _callback);
	},
}
$.fn.dataTable.ext.errMode = 'none';
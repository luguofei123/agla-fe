var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/cu/common/eleAgency/getAgencyTree';
				break;
			//账套
			case 'acct':
				url = '/cu/common/eleCoacc/getCoCoaccs/';
				break;
			//票据类型
			case 'accItem':
				url = '/cu/common/getEleTree';
				break;
			//取主表格数据
			case 'queryDPE':
				url = '/cu/journalMain/selectCuJournalMain';
				break;
			//获取账簿余额
			case 'queryBalance':
				url = '/cu/journal/getCuJournalMoneyInfo';
				break;
			//删除
			case 'delete':
				url = '/cu/journalMain/deleteByMainGuids';
				break;
			//获取一个详细信息
			case 'getOne':
				url = '/cu/journalMain/selectJournalByMainGuid';
				break;
			case 'getCWData':
				url = '/cu/journal/getGlRptJournalData';
				break;
			case 'getNextJouNo':
				url = '/cu/journal/getNextJouNo';
				break;
			case 'getAccoFZ':
				url = '/cu/common/getAccItemList';
				break;
			case 'fzhxs':
				url = '/cu/common/getEleTree';
				break;
			/* 生成凭证、合并生成凭证、取消生成--begin--新需求*/
			//生成凭证
			case 'createVou':
				// url = '/cu/billToVou/createVou';
				url = '/cu/vouThrowLp/createVou';
				break;
			//取消生成
			case 'cancelVou':
				// url = '/cu/billToVou/cancelVouForMain';
				url = '/cu/vouThrowLp/cancelVou';
				break;
			/* 生成凭证、合并生成凭证、取消生成--end--新需求*/
			/*提现、存现、从国库生成--end*/
			//获取关联账簿信息
			case 'getlinkMessage':
				url = '/cu/journal/getMessage';
				break;
			//获取相同的辅助核算项
			case 'getEqulfz':
				url = '/cu/cuAccountBook/getBooksAccitem';
				break;
			//单个凭证生成预览
			case 'previewVou':
				// url = '/cu/billToVou/billPreviewForMain';
				url = '/cu/vouThrowLp/previewVou';
				break;
			//预览生成接口
			case 'prebulidVou':
//				url = '/cu/billToVou/savePreviewBill';
				url = '/cu/vouThrowLp/saveVou';
				break;
			//获取常用摘要
			case 'getSummary':
				url = '/cu/summary/selectMaDesc';
				break;
			//获取凭证类型
			case 'getVoutype':
				url = '/cu/eleVouType/getVouType';
				break;
			//保存跨账簿登账
			case 'saveAccount':
				url = '/cu/journalMain/saveJournalMain';
				break;
			case 'getAccitem':
				url = '/cu/common/getAccitemByCond';
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
	//取账簿余额
	queryBalance: function (argu, _callback) {
		this.doGet('queryBalance', argu, _callback);
	},
	//辅助核算
	cbbAccItem: function (argu, _callback) {
		this.doGet('accItem', argu, _callback);
	},
	//删除
	delete: function (argu, _callback) {
		this.doPost('delete', argu, _callback);
	},
	//获取一个
	cbbGetone: function (argu, _callback) {
		this.doGet('getOne', argu, _callback);
	},
	//从账务取数
	cbbGetData: function (argu, _callback) {
		this.doGet('getCWData', argu, _callback);
	},
	//获取编号
	cbbGetJouNo: function (argu, _callback) {
		this.doGet('getNextJouNo', argu, _callback);
	},
	getAccoFZ: function (argu, _callback) {
		this.doGet('getAccoFZ', argu, _callback);
	},
	/*提现、存现、从国库生成--begin*/
	//提现、存现获取账簿
	cashTake: function (argu, _callback) {
		this.doGet('cashTake', argu, _callback);
	},
	bankTake: function (argu, _callback) {
		this.doGet('bankTake', argu, _callback);
	},
	zeroTake: function (argu, _callback) {
		this.doGet('zeroTake', argu, _callback);
	},
	//提现、存现保存
	saveBookData: function (argu, _callback) {
		this.doPost('saveBookData', argu, _callback);
	},
	//提现、存现保存并新增
	addBookData: function (argu, _callback) {
		this.doPost('saveBookData', argu, _callback);
	},
	//从国库生成---获取表格内容
	getBillTabs: function (argu, _callback) {
		this.doPost('getBillTabs', argu, _callback);
	},
	//从国库生成--生成
	getBillBuild: function (argu, _callback) {
		this.doPost('getBillBuild', argu, _callback);
	},
	getBillColumns: function (argu, _callback) {
		this.doPost('getBillColumns', argu, _callback);
	},
	getBillDelete: function (argu, _callback) {
		this.doPost('getBillDelete', argu, _callback);
	},
	//获取登记出纳账--从国库生成--现金账簿---zsj
	bookTake: function (argu, _callback) {
		this.doPost('bookTake', argu, _callback);
	},
	/*提现、存现、从国库生成--end*/
	/* 生成凭证、合并生成凭证、取消生成--begin--新需求*/
	createVou: function (argu, _callback) {
		this.doPost('createVou', argu, _callback);
	},
	cancelVou: function (argu, _callback) {
		this.doPost('cancelVou', argu, _callback);
	},
	/* 生成凭证、合并生成凭证、取消生成--end--新需求*/
	getlinkMessage: function (argu, _callback) {
		this.doPost('getlinkMessage', argu, _callback);
	},
	//获取相同的辅助核算项
	getEqulfz: function (argu, _callback) {
		this.doPost('getEqulfz', argu, _callback);
	},
	//单个凭证生成预览
	previewVou: function (argu, _callback) {
		this.doPost('previewVou', argu, _callback);
	},
	//单个凭证生成预览
	prebulidVou: function (argu, _callback) {
		this.doPost('prebulidVou', argu, _callback);
	},
	//常用摘要
	cbbSummary: function (argu, _callback) {
		this.doGet('getSummary', argu, _callback);
	},
	getVoutype: function (argu, _callback) {
		this.doGet('getVoutype', argu, _callback);
	},
	//保存跨账簿登账
	saveAccount: function (argu, _callback) {
		this.doPost('saveAccount', argu, _callback);
	},
	//获取单位账套下启用的辅项
	getAccitem: function (argu, _callback) {
		this.doGet('getAccitem', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
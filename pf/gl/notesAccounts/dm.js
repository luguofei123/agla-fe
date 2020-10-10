var dm = {
	//废弃文件--zsj
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
				//账套
			case 'acct':
				// url = '/gl/eleCoacc/getCoCoaccs/';
				url = '/gl/eleCoacc/getRptAccts'; //多区划
				break;
				//备查类型
			case 'receivableType':
				url = '/gl/CbBillBook/RECEIVABLE_TYPE';
				break;
				//出票人
			case 'billPerson':
				url = '/gl/CbBillBook/selectEleCurrent';
				break;
				//票据类型、往来单位
			case 'commonApi':
				url = '/gl/elecommon/getEleCommonTree';
				break;
				//应收科目会计科目
			case 'getAcco':
				url = '/gl/sys/coaAcc/getRptAccoTree';
				break;
				//查询主表格数据
			case 'search':
				url = '/gl/current/rp/selectCurVouDetailAss';
				break;
				//保存坏账
			case 'saveBadAccount':
				url = '/gl/current/rp/saveCurAssBadDebt';
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
		argu = argu || {};
		_callback = _callback || function(result) {};
		ufma.get(this.getCtrl('search'), argu, _callback);
	},
	//备查类型
	cbbReterType: function(argu, _callback) {
		this.doGet('receivableType', argu, _callback);
	},
	radioLabelDPEType: function(_cnt) {
		$(_cnt).html('');
		this.doGet('dpetype', {}, function(result) {
			for(var i = 0; i < result.data.length; i++) {
				var item = result.data[i];
				$('<a name="apportionType" value="' + item.ENU_CODE + '" id="' + item.ENU_CODE + '" class="label label-radio ' + (i == 0 ? 'selected' : '') + '">' + item.ENU_NAME + '</a>').appendTo(_cnt);
			}
		});
	},
	//票据类型、往来单位
	commonApi: function(argu, _callback) {
		this.doGet('commonApi', argu, _callback);
	},
	//出票人
	cbbBillPerson: function(argu, _callback) {
		argu.enabled = "-1";
		argu.chrName = "";
		argu.contact = "";
		this.doGet('billPerson', argu, _callback);
	},
	//保存坏账
	doSaveBadAccount: function(argu, _callback) {
		this.doPost('saveBadAccount', argu, _callback);
	},
	//付款单位
	payerAgency: function(argu, _callback) {
		argu.enabled = "-1";
		argu.chrName = "";
		argu.contact = "";
		this.doGet('billPerson', argu, _callback);
	},
	//承兑单位
	acceptAgency: function(argu, _callback) {
		argu.enabled = "-1";
		argu.chrName = "";
		argu.contact = "";
		this.doGet('billPerson', argu, _callback);
	},
	//会计科目
	getAcco: function(argu, _callback) {
		this.doGet('getAcco', argu, _callback);
	},
	acct: function(argu, _callback) { //多区划
		this.doGet('acct', argu, _callback);
	}

}
$.fn.dataTable.ext.errMode = 'none';
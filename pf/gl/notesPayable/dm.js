var dm = {
	getCtrl: function (tag) {
		var url = '';
		switch (tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
			//账套
			case 'acct':
				//url = '/gl/eleCoacc/getCoCoaccs/';
				 url = '/gl/eleCoacc/getRptAccts';//多区划
				break;
			//备查类型
			case 'receivableType':
				url = '/gl/CbBillBook/RECEIVABLE_TYPE';
				break;
			//出票人
			case 'billPerson':
				url = '/gl/elecommon/getEleCommonTree';
				break;
			//票据类型
			case 'billtype':
				url = '/gl/elecommon/getEleCommonTree';
				break;
			//登记
			case 'bookin':
				url = '/gl/CbBillBook/saveBillBook';
				break;
			//查询主表格数据
			case 'search':
				url = '/gl/CbBillBook/searchBillBooks';
				break;
			//获取子表数据
			case 'detail':
				url = '/gl/CbBillBook/selectBillBookAss';
				break;
			//获取弹窗明细数据
			case 'modelDetail':
			url = '/gl/CbBillBook/selectAllBillBookAss';
			break;
			//删除
			case 'delete':
				url = '/gl/CbBillBook/delBillBookAss/{billBookAssId}';
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
		ufma.post(this.getCtrl('search'), argu, _callback);
	},

	//备查类型
	cbbReterType: function (argu, _callback) {
		this.doGet('receivableType', argu, _callback);
	},
	radioLabelDPEType: function (_cnt) {
		$(_cnt).html('');
		this.doGet('dpetype', {}, function (result) {
			for (var i = 0; i < result.data.length; i++) {
				var item = result.data[i];
				$('<a name="apportionType" value="' + item.ENU_CODE + '" id="' + item.ENU_CODE + '" class="label label-radio ' + (i == 0 ? 'selected' : '') + '">' + item.ENU_NAME + '</a>').appendTo(_cnt);
			}
		});
	},
	//票据类型
	cbbBillType: function (argu, _callback) {
		// argu.eleCode = "BILLTYPE";
		this.doGet('billtype', argu, _callback);
	},
	//出票人
	cbbBillPerson: function (argu, _callback) {
		argu.enabled = "-1";
		argu.chrName = "";
		argu.contact = "";
		this.doGet('billPerson', argu, _callback);
	},
	//保存
	doSave: function (argu, _callback) {
		this.doPost('bookin', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
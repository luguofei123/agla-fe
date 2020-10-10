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
			//月份
			case 'getMonth':
				url = '/cu/enumerate/CU_JOURNAL_MONTH';
				break;
			//查询主表格数据
			case 'search':
				url = '/cu/journal/getCuGeneralLedgerInfo';
				break;
			//联查明细信息
			case 'searchDetail':
				url = '/cu/journal/getCuGeneralLedgerInfoDetails';
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
		ufma.get(this.getCtrl('search'), argu, _callback);
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
	//月份
	cbbMonth: function (argu, _callback) {
		this.doGet('getMonth', argu, _callback);
	},

	//保存
	doSave: function (argu, _callback) {
		this.doPost('bookin', argu, _callback);
	},
	//联查明细
	reqDetail: function (argu, _callback) {
		this.doGet('searchDetail', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
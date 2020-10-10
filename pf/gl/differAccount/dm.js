var dm = {
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//单位树
			case 'agency':
				url = '/gl/eleAgency/getAgencyTree';
				break;
				//账套
			case 'acct':
				url = '/gl/eleCoacc/getCoCoaccs/';
				break;
			case 'queryDPE':
				url = '/gl/rptSurplus/searchSurplusJournal';
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
	},
	//取表格数据
	loadGridData: function(argu, _callback) {
		this.doPost('queryDPE', argu, _callback);
	},

	//摊销类型
	cbbDPEType: function(argu, _callback) {
		this.doGet('dpetype', argu, _callback);
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
	//费用类型
	cbbFeeType: function(argu, _callback) {
		argu.eleCode = 'FYLX';
		this.doGet('freetype', argu, _callback);
	},

	//登记
	bookIn: function(argu, _callback) {
		this.doPost('bookin', argu, _callback);
	},
	bookEdit: function(argu, _callback) {
		this.doPost('bookEdit', argu, _callback);
	},
	//摊销
	amort: function(argu, _callback) {
		this.doPost('amort', argu, _callback);
	},
	amortEdit: function(argu, _callback) {
		this.doPost('amortEdit', argu, _callback);
	},
	//转出
	rollout: function(argu, _callback) {
		this.doPost('rollout', argu, _callback);
	}
}
$.fn.dataTable.ext.errMode = 'none';
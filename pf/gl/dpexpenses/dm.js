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
				 // url = '/gl/eleCoacc/getCoCoaccs/';
                 url = '/gl/eleCoacc/getRptAccts';//多区划
				break;
				//摊销类型
			case 'dpetype':
				url = '/gl/enumerate/APPORTION_TYPE';
				break;
				//费用类型
			case 'freetype':
				url = '/gl/common/glAccItemData/getAccItemTree';
				break;
			case 'queryDPE':
				url = '/gl/ApportionBook/select';
				break;
				//登记
			case 'bookin':
				url = '/gl/ApportionBook/insert';
				break;
				//修改
			case 'bookEdit':
				url = '/gl/ApportionBook/update';
				break;
			case 'bookDel':
				url = '/gl/ApportionBook/delete';
				break;
				
				//摊销
			case 'amort':
				url = '/gl/ApportionBook/apportion';
				break;
			case 'amortEdit':
				url = '/gl/ApportionBook/updateDetail';
				break;
			case 'amortDel':
				url = '/gl/ApportionBook/deleteDetail';
				break;
				//转出
			case 'rollout':
				url = '/gl/ApportionBook/apportionOut';
				break;
				//摊销明细
			case 'amortList':
				url = '/gl/ApportionBook/getDetail/{bookGuid}';
				break;
            case 'apportions':
                url = '/gl/ApportionBook/apportionS';
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
		argu.eleCode = 'COSTKIND';
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
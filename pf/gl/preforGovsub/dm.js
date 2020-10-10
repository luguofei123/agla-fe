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
				//url = '/gl/eleCoacc/getCoCoaccs/';
				 url = '/gl/eleCoacc/getRptAccts';//多区划
				break;
				//补贴类型
			case 'btType':
				url = '/gl/common/glAccItemData/getAccItemTree';
				break;
				//登记
			case 'pfgsBookIn':
				url = '/gl/GovernmentSubsidy/insert';
				break;
			case 'pfgsEdit':
				url = '/gl/GovernmentSubsidy/update';
				break;
				//接受者类型
			case 'jszlx':
				url = '/gl/enumerate/SUBSIDY_PERSON_TYPE';
				break;
				//
			case 'query':
				url = '/gl/GovernmentSubsidy/select';
				break;
				//单项删除
			case 'deleteOne':
				url = '/gl/GovernmentSubsidy/deleteByGuid';
				break;
				//批量删除
			case 'deleteAll':
				url = '/gl/GovernmentSubsidy/deleteByids';
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
	loadGridData: function(argu, _callback) {//加载数据时重新渲染表格
		argu = argu || {};
		_callback = _callback || function (result) { }
		ufma.post(this.getCtrl('query'), argu, _callback);
	},
	//登记
	pfgsBookIn: function(argu, _callback) {
		this.doPost('pfgsBookIn', argu, _callback);
	},
	//新增保存
	doSave: function(argu, _callback) {
		this.doPost('pfgsBookIn', argu, _callback);
	},
	//修改
	pfgsEdit: function(argu, _callback) {
		this.doPost('pfgsEdit', argu, _callback);
	}, 
	//补贴种类
	btzl: function(argu, _callback) {
		argu.eleCode = 'SUBSIDYTYPE';
		this.doGet('btType', argu, _callback);
	},
	//接受者类型
	jszlx: function(argu, _callback) {
		this.doGet('jszlx', argu, _callback);
	},
	/*radioLabelType: function(_cnt) {
		$(_cnt).html('');
		this.doGet('jszlx', {}, function(result) {
			for(var i = 0; i < result.data.length; i++) {
				var item = result.data[i];
				$('<a name="subsidyPersonType" value="' + item.ENU_CODE + '" id="' + item.ENU_CODE + '" class="label label-radio ' + (i == 0 ? 'selected' : '') + '">' + item.ENU_NAME + '</a>').appendTo(_cnt);
			}
		});
	}*/
}
$.fn.dataTable.ext.errMode = 'none';
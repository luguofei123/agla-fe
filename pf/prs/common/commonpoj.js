var pfData = ufma.getCommonData();
var poj = {};
poj.portList = {
    agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
}
//储存页面已存在session的key
poj.sessionKeyArr = [];

poj.nowAgencyCode = pfData.svAgencyCode; //登录单位代码
poj.nowAgencyName = pfData.svAgencyName; //登录单位名称

//初始化单位选择样式及change事件
poj.initAgencyList = function() {
	poj.agencyCode = $("#agencyCode").ufmaTreecombox2({
		valueField: 'id',
		textField: 'codeName',
		readonly: false,
		placeholder: '请选择单位',
		icon: 'icon-unit',
		onchange: function(data) {
			//给全局单位变量赋值
			poj.nowAgencyCode = data.id;
			poj.nowAgencyName = data.name;

			// if(poj.sessionKeyArr.length > 0) {
			// 	for(var i = 0; i < poj.sessionKeyArr.length; i++) {
			// 		sessionStorage.removeItem(poj.sessionKeyArr[i]);
			// 	}
			// }
			// $("div.rpt-tree-data").hide();
		}
    });
    
};
//请求单位列表
poj.reqAgencyList = function() {
	ufma.ajax(poj.portList.agencyList, "get", "", function(result) {
		var data = result.data;
		poj.agencyCode = $("#agencyCode").ufmaTreecombox2({
			data: result.data
		});

		var code = data[0].id;
		var name = data[0].name;
		var codeName = data[0].codeName;

		if(poj.nowAgencyCode != "" && poj.nowAgencyName != "") {
			var agency = $.inArrayJson(data, 'id', poj.nowAgencyCode);
			if(agency != undefined) {
				poj.agencyCode.val(poj.nowAgencyCode);
			} else {
				poj.nowAgencyCode = code;
				poj.nowAgencyName = name;
				poj.agencyCode.val(code);
			}
		} else {
			poj.nowAgencyCode = poj.agencyCode.getValue();
			poj.nowAgencyName = poj.agencyCode.getText();
			poj.agencyCode.val(code);
		}
	});
};

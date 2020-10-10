;
var ma = {};
var pfData = ufma.getCommonData();
ma.rgCode = pfData.svRgCode;
ma.setYear = pfData.svSetYear;
ma.fjfa; //编码规则
ma.ruleData; //整个编码规则对象
ma.ctrlName;
ma.aParentCode = [];
ma.aParentName = [];
ma.jCodeName = {};
ma.aInputParentCode = [];
ma.inputParentName = '';
ma.isRuled = false;

ma.tableName = "";
ma.fieldName = 'field';

ma.nowTitle = "";
ma.pageFlag = "";
ma.isEdit = false; //判断是否是编辑，是，则回显（自动走input的blur方法）校验编码不显示错误
ma.issueAgy = "";

//ma模块中公共接口
ma.commonApi = {
	getCanIssueEleTree: "/ma/sys/common/getCanIssueEleTree", //选用获取可选用的数据
	confirmIssue: "/ma/sys/common/issue" //确认选用/下发
};

//限制表格名称列宽度
var nod = document.createElement("style"),
	str = ".ufma-table td a[href='javascript:;']{ max-width:435px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}";
nod.type = "text/css";
if(nod.styleSheet) { //ie下  
	nod.styleSheet.cssText = str;
} else {
	nod.innerHTML = str; //或者写成 nod.appendChild(document.createTextNode(str))  
}
document.getElementsByTagName("head")[0].appendChild(nod);

/**
 * 请求要素上级控制信息
 * @param url
 * @param argu
 * @param callbackFun
 */
ma.initfifaParent = function(argu, callbackFun) {
	var url = "/ma/sys/element/getParentEleDetail";
	ufma.get(url, argu, function(result) {
		if(callbackFun) {
			callbackFun(result.data);
		}
	})
};
/**
 * 请求要素编码规则
 * @param: url 请求要素编码规则接口地址，参数直接挂在地址后面
 * @param: argu 请求要素编码规则参数json对象
 * @param: callbackFun 回调函数
 */
ma.initfifa = function(url, argu, callbackFun) {
	// if(argu.tableName != undefined) {
	// 	ma.tableName = argu.tableName;
	// } else {
	//自定义数据维护
	ma.tableName = "MA_ELE_" + argu.eleCode;
	//}
	ma.fjfa = '';
	var callback = function(result) {
		var cRule = "";
		if(result.data != undefined) {
			cRule = result.data.codeRule;
		}
		if(cRule != null && cRule != "") {
			ma.fjfa = cRule;
			ma.ruleData = result.data;
			//console.log(cRule);
		}
		ma.ctrlName = "";
		switch(result.data.agencyCtrllevel) {
			case "0101":
				ma.ctrlName = "该要素为上下级公用，上级停用时，本级也随之停用";
				break;
			case "0102":
				ma.ctrlName = "该要素为上下级公用，上级停用时，本级也随之停用";
				break;
			case "0201":
				ma.ctrlName = "该要素为下级可细化，上级停用时，本级也随之停用";
				break;
			case "0202":
				ma.ctrlName = "该要素为下级可细化，上级停用时，本级也随之停用";
				break;
			case "03":
				ma.ctrlName = "该要素上下级无关";
				break;
			default:
				break;
		}
		if(callbackFun) {
			callbackFun(result.data, ma.ctrlName);
		}

	};

	ufma.ajaxDef(url, "get", argu, callback);
};

// ma.getEleCtrlLevel = function (url, callback) {
// 	var argu = {};
// 	var ctrlName;
// 	var callback1 = function (result) {
// 		switch (result.data.agencyCtrllevel) {
// 			case "0101":
// 				ctrlName = "提示：该要素为上下级公用,系统级数据启用/停用时，单位级数据会随之启用/停用";
// 				break;
// 			case "0102":
// 				ctrlName = "提示：该要素为上下级公用,系统级数据启用/停用时，单位级数据会随之启用/停用";
// 				break;
// 			case "0201":
// 				ctrlName = "提示：该要素为下级可细化,系统级数据启用/停用时，单位级数据会随之启用/停用";
// 				break;
// 			case "0202":
// 				ctrlName = "提示：该要素为下级可细化,系统级数据启用/停用时，单位级数据会随之启用/停用";
// 				break;
// 			case "03":
// 				ctrlName = "提示：该要素上下级无关";
// 				break;
// 			default:
// 				break;
// 		}
// 		callback(ctrlName);
// 	};
// 	ufma.get(url, argu, callback1);
// };
/*
 * 获取已下发单位列表
 * @param: errcode 错误编号
 * @param: name 编码名字
 */
ma.getIssueAgy = function(argu) {
	var url = "/ma/sys/common/countAgencyUse";
	var callback = function() {
		if(result.flag == "success") {
			ma.issueAgy = result.data;
		}
	}
	ufma.ajaxDef(url, "get", argu, callback);
};
/*
 * 错误提示 
 * @param: errcode 错误编号
 * @param: name 编码名字
 */
ma.getErrMsg = function(errcode, name) {
	var error = {
		0: name + '编码不能为空',
		1: name + '名称不能为空',
		2: name + '编码不符合分级规则：' + ma.fjfa,
		3: '上级编码不存在',
		4: name + '编码已存在',
		5: '只能输入0-9的数字',
		6: name + '编码长度超出规定值',
		7: name + '不能为空',
	}
	return error[errcode];
};

/*
 * 表单验证 
 * @param: codeId 编码输入框id
 * @param: nameId 名称输入框id
 * @param: name 编码名字
 * @param: action 操作类型（add,edit等）
 */
ma.formValidator = function(codeId, nameId, name, action, inputId, inputName) {
	var msgCode = '';
	var reg = /^\d+$/g
	if($('#' + codeId).val() == '') {
		msgCode = '0';
		ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + codeId).closest('.form-group').addClass('error');
	} else if((codeId != "") && (!reg.test($('#' + codeId).val())) && (inputName != '币种符号')) { //bugCWYXM-4260--币种编码可以输入字母、数字、下划线--zsj
		msgCode = '5';
		ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + codeId).closest('.form-group').addClass('error');
	} else if(action == 'add' && $.inArray($('#' + codeId).val(), ma.aParentCode) > -1) {
		msgCode = '4';
		ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + codeId).closest('.form-group').addClass('error');
	} else if($('#' + nameId).val() == '') {
		msgCode = '1';
		ufma.showInputHelp(nameId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + nameId).closest('.form-group').addClass('error');
	} else if(action == 'add' && !ma.isRuled) {
		msgCode = '2';
		ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + codeId).closest('.form-group').addClass('error');
	} else if(action == 'add' && !ufma.arrayContained(ma.aParentCode, ma.aInputParentCode)) {
		msgCode = '3';
		ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(msgCode, name) + '</span>');
		$('#' + codeId).closest('.form-group').addClass('error');
	} else if($('#' + inputId).val() == '') {
		msgCode = '7';
		ufma.showInputHelp(inputId, '<span class="error">' + ma.getErrMsg(msgCode, inputName) + '</span>');
		$('#' + inputId).closest('.form-group').addClass('error');
	}else{
		var hlpid = codeId + '-help';
		var $hlp = $('#' + hlpid);
		$hlp.remove()
	}
	return msgCode == '';
};

/*
 * 编码验证 
 * @param: codeId 编码输入框id
 * @param: name 编码名字
 * @param: url 请求右侧参考上级提示接口
 * @param: eleCode 要素代码
 * @param: agencyCode 单位代码
 * @param: helpId 右侧参考上级提示ul盒子id
 */
ma.codeValidator = function(codeId, name, url, agencyCode, acctCode, helpId, accsCode, atuoSetParentInfor) {

	var blurNum = 0;
	//修改往来单位提示不符合编码规则的提示--zsj
	$('#' + codeId).off().on('focus paste keyup', function(e) {
		//$('#' + codeId).off().on('keyup', function (e) {
		$('input[name="allowAddsub"]').each(function() {
			$(this).closest('label').removeAttr("disabled", 'disabled');
		});
		blurNum = 1;
		e.stopPropagation();
		if(e.keyCode != 8) {
			//bugCWYXM-4260--币种编码可以输入字母、数字、下划线--zsj
			if(name == '币种') {
				$(this).val($(this).val().replace(/[^a-zA-Z/\d]/g, ''));
			} else {
				$(this).val($(this).val().replace(/[^\d]/g, ''));
			}
		}
		$('#' + codeId).closest('.form-group').removeClass('error');
		var textValue = $(this).val();

		if(ma.fjfa != null && ma.fjfa != "") {
			var dmJson = ufma.splitDMByFA(ma.fjfa, textValue);
			ma.isRuled = dmJson.isRuled;
			ma.aInputParentCode = dmJson.parentDM.split(',');
			ma.aInputParentCode.pop();
			if((ma.aInputParentCode.length > 0)) {
				ma.aInputParentCode = [ma.aInputParentCode.pop()];
			} else {
				ma.aInputParentCode = [];
			}
		} else {
			ma.isRuled = true;
		}

		// if (textValue.length > 0) {
		// 	if (ma.pageFlag == "userData") {
		// 		if (ma.nowTitle == name) {
		// 			ma.showParentHelp(url, textValue, agencyCode, helpId);
		// 		}
		// 	} else {
		// 		ma.showParentHelp(url, textValue, agencyCode, helpId);
		// 	}
		// }
	}).on('blur', function() {
		blurNum++;
		if(ma.fjfa != null && ma.fjfa != "") {
			var fjfaArr = ma.fjfa.split('-');
			var num = 0;
			for(var i = 0; i < fjfaArr.length; i++) {
				num += parseInt(fjfaArr[i]);
			}
			ma.isRuled = true;
		} else {
			ma.isRuled = true;
		}

		var textValue = $(this).val();
		var originValue = $(this).val();

		if(ma.fjfa != null && ma.fjfa != "") {
			var dmJson = ufma.splitDMByFA(ma.fjfa, textValue);
			ma.isRuled = dmJson.isRuled;
			ma.aInputParentCode = dmJson.parentDM.split(',');
			ma.aInputParentCode.pop();
			if((ma.aInputParentCode.length > 0)) {
				ma.aInputParentCode = [ma.aInputParentCode.pop()];
			} else {
				ma.aInputParentCode = [];
			}
		}
		var params = {
			originValue: originValue,
			num: num,
			name: name,
			codeId: codeId,
			blurNum: blurNum,
			acctCode: acctCode,
			accsCode: accsCode,
			atuoSetParentInfor: atuoSetParentInfor,
			agencyCode: agencyCode
		}
		if(textValue.length > 0) {
			if(ma.pageFlag == "userData") {
				if(ma.nowTitle == name) {
					ma.showParentHelp(url, textValue, agencyCode, acctCode, helpId, params);
				}
			} else {
				ma.showParentHelp(url, textValue, agencyCode, acctCode, helpId, params);
			}
		}

		//var ret = /^[1-9]\d*|0$/;

	});
};
/**
 * 编码、名称输入框下面的提示
 */
ma.showHelpTips = function(value, num, name, codeId, blurNum, acctCode, accsCode, atuoSetParentInfor, agencyCode) {
	var timeID = setTimeout(function() {

		if(value == '') {
			ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(0, name) + '</span>');
			$('#' + codeId).closest('.form-group').addClass('error');
		} else if(value.length > num) {
			ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(6, name) + '</span>');
			$('#' + codeId).closest('.form-group').addClass('error');
		} else if(value.length == num) {
			//当code已经是编码规则的最长长度，即为最末级 故不允许增加下级 guohx 2020071
			//bugCWYXM-4106--要素为无编码规则时,基础数据维护,新增数据,保存时,提示新增无编码规则不符合分级规则--zsj
			ufma.hideInputHelp(codeId);
			$('#' + codeId).closest('.form-group').removeClass('error');
			$('input[name="allowAddsub"]').each(function() {
				if($(this)[0].value == '0') {
					$(this)[0].click();
				}
				$(this).closest('label').attr("disabled", 'disabled');
			});
		} else if(ma.aParentCode.length > 0 && $.inArray(value, ma.aParentCode) != -1) {
			if(!ma.isEdit) {
				ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(4, name) + '</span>');
				$('#' + codeId).closest('.form-group').addClass('error');
			}
		} else if(!ma.isRuled) {
			ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(2, name) + '</span>');
			$('#' + codeId).closest('.form-group').addClass('error');
		} else if(!ufma.arrayContained(ma.aParentCode, ma.aInputParentCode)) {
			ufma.showInputHelp(codeId, '<span class="error">' + ma.getErrMsg(3, name) + '</span>');
			$('#' + codeId).closest('.form-group').addClass('error');
		} else {
			ufma.hideInputHelp(codeId);
			$('#' + codeId).closest('.form-group').removeClass('error');
			var thisCode = $("#" + codeId).val();
			if($("#" + codeId) != "" && thisCode != "" && blurNum == 2) {
				if(ma.fjfa != null && ma.fjfa != "") {
					if(accsCode != '' && accsCode != undefined) {
						ma.tableName = 'MA_ELE_ACCO';
					}
					var obj = {
						"rgCode": ma.rgCode,
						"setYear": ma.setYear,
						"agencyCode": agencyCode,
						"acctCode": acctCode,
						"accsCode": accsCode,
						"eleCode": ma.tableName.toString().substring(7),
						"tableName": ma.tableName,
						"chrCode": thisCode
					};
					ma.nameTip = "";
					ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
						ma.nameTip = result.data;
					});
				}
			}
			//console.info(ma.nameTip);
			//新增时获取上级科目基本信息
			if(atuoSetParentInfor) {
				atuoSetParentInfor(ma.aInputParentCode);
			}
		}
		ma.setParentMC();
		clearTimeout(timeID);
	}, 200);
}
/**
 * 还原基础资料item弹窗的默认值
 */
ma.defaultRightInfor = function(id, infor) {
	$("#" + id).html("");
	var liHtml = '<li>请输入' + infor + '编码获得参考信息</li>';
	$("#" + id).html(liHtml)
}
/*
 * 名称验证 
 * @param: nameId 名称输入框id
 * @param: name 编码名字
 */
ma.nameValidator = function(nameId, name) {
	var i = 0;
	$('#' + nameId).off().on('focus paste keyup', function(e) {
		e.stopPropagation();
		$('#' + nameId).closest('.form-group').removeClass('error');
		var textValue = $(this).val();

		if(ma.nameTip != null && ma.nameTip != "") {
			textValue = ma.nameTip + "/" + textValue;
		} else {
			textValue = textValue;
		}
		ufma.showInputHelp_Name(nameId, textValue);
	}).on('blur', function() {
		$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
		if($(this).val() == '') {
			ufma.showInputHelp(nameId, '<span class="error">' + ma.getErrMsg(1, name) + '</span>');
			$('#' + nameId).closest('.form-group').addClass('error');
		} else {
			ufma.hideInputHelp(nameId);
			$(this).val(ufma.transformQj($(this).val())); //特殊字符半角转全角
			$('#' + nameId).closest('.form-group').removeClass('error');
		}
		var chrNameValue = $(this).val();
		ufma.ajaxDef('/pub/util/String2Alpha', 'post', {
			"chinese": chrNameValue
		}, function(result) {
			if(result.data.length > 42) {
				var data = result.data.substring(0, 41);
				$('#assCode').val(data);
				$('#assCode').attr('title', data);
			} else {
				$('#assCode').val(result.data);
				$('#assCode').attr('title', result.data);
			}

		});
	});
};

//必输字段校验
ma.inputValidator = function(inputId, inputName) {
	$('#' + inputId).off().on('focus paste keyup', function(e) {
		if(inputId == 'agency-orgCode') {
			$(this).val($(this).val().replace(/[^\0-9a-zA-Z]/g, ''));
		}
		e.stopepropagation;
		$('#' + inputId).closest('.form-group').removeClass('error');
	}).on('blur', function() {
		if($(this).val() == '') {
			ufma.showInputHelp(inputId, '<span class="error">' + ma.getErrMsg(7, inputName) + '</span>');
			$('#' + inputId).closest('.form-group').addClass('error');
		} else {
			ufma.hideInputHelp(inputId);
			$('#' + inputId).closest('.form-group').removeClass('error');
		}
	});
};

/*
 * 请求右侧参考上级提示
 * @param: url 请求右侧参考上级提示接口
 * @param: chrCode 元素代码
 * @param: agencyCode 单位代码
 * @param: helpId 右侧参考上级提示ul盒子id
 */
ma.showParentHelp = function(url, chrCode, agencyCode, acctCode, helpId, params) {
	var argu = {
		"chrCode": chrCode,
		"agencyCode": agencyCode,
		"rgCode": ma.rgCode,
		"setYear": ma.setYear
	};
	var callback = function(result) {
		var htm = '';
		if(result.data.length > 0) {
			ma.aParentCode = [];
			ma.aParentName = [];
			$.each(result.data, function(index, row) {
				if(index == 0) {
					htm += ufma.htmFormat('<li style="padding-left:0px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
						'CHR_CODE': row.code,
						'CHR_NAME': row.name
					});
				} else {
					htm += ufma.htmFormat('<li style="padding-left:16px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
						'CHR_CODE': row.code,
						'CHR_NAME': row.name
					});
				}
				ma.aParentCode.push(row.code);
				ma.jCodeName[row.code] = row.codeName;
			});
			$('#' + helpId).html(htm);
		}
		ma.showHelpTips(params.originValue, params.num, params.name, params.codeId, params.blurNum, params.acctCode, params.accsCode, params.atuoSetParentInfor, params.agencyCode)
	};
	ufma.get(url, argu, callback);
};

ma.setParentMC = function() {
	var parentName = [];
	for(var i = 0; i < ma.aInputParentCode.length; i++) {
		parentName.push(ma.jCodeName[ma.aInputParentCode[i]]);
	}
	ma.inputParentName = parentName.join('/');
};

/*
 * 搜索隐藏显示，查询
 * @param: id 搜索框盒子id
 * @param: selector 查询表格的id
 */
ma.searchHideShow = function(id, selector, buttonId) {
	$("#" + id + " .searchHide").focus(function() {
		$(this).keydown(function(e) {
			var val = $(this).val();
			if(e.keyCode == 13) {
				$(selector).DataTable().search(val).draw();
				$("#" + id + " .searchValueHide").val(val);
			}
			ufma.setBarPos($(window));
			//选用界面的tool-bar动态定位--zsj
			if(!$.isNull($('#comChoose-tool-bar').position())){
				var toobar = $('#comChoose-tool-bar').position().top; //339px
			}
			if(toobar > 339) {
				$('#comChoose-tool-bar').css({
					'top': "339px",
					"width":"992px",
					"position": "absolute"
				})
			}
		});
	});
	//将输入框从点击事件中取出来
	$("#" + id + " .searchHide").show().animate({
		"width": "160px"
	}).focus().removeClass("focusOff");
	//$("#" + id + " #searchHideBtn").on("click", function(evt) {
	$("#" + id + " #" + buttonId).on("click", function(evt) { //CWYXM-6748--zsj-增加搜索按钮id，完善点击搜索功能
		evt.stopPropagation();
		if($("#" + id + " .searchHide").hasClass("focusOff")) {
			var newVal = $("#" + id + " .searchValueHide").val();
			if(newVal != "") {
				$("#" + id + " .searchHide").val(newVal);
			}
		} else {
			var val = $(this).siblings("input[type='text']").val();
			$(selector).DataTable().search(val).draw();
			$("#" + id + " .searchValueHide").val(val);
		}
		ufma.setBarPos($(window));
		//选用界面的tool-bar动态定位--zsj
		if(!$.isNull($('#comChoose-tool-bar').position())){
			var toobar = $('#comChoose-tool-bar').position().top; //339px
		}
		if(toobar > 339) {
			$('#comChoose-tool-bar').css({
				'top': "339px",
				"width":"992px",
				"position": "absolute"
			})
		}
	});
	/*$("#" + id + ".iframeBtnsSearch").on("mouseleave", function () {
		if (!$("#" + id + " .searchHide").hasClass("focusOff") && $("#" + id + " .searchHide").val() == "") {
			$("#" + id + " .searchHide").animate({
				"width": "0px"
			}, "", "", function () {
				$(".searchHide").css("display", "none");
			}).addClass("focusOff");
		}
	});*/
};

//获取地址栏参数//可以是中文参数
ma.GetQueryString = function(key) {
	// 获取参数
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	return result ? decodeURIComponent(result[2]) : null;
}

//请求自定义属性
//为了满足类似部门人员这样的页面，新增了fieldName
// reqFieldList = function (agencyCode, eleCode, fieldName) {
// 	ufma.post("/ma/sys/common/getFieldRelations", {
// 		agencyCode: agencyCode,
// 		eleCode: eleCode
// 	}, function (result) {
// 		//console.info(result.data);
// 		var data = result.data;
// 		var fieldArr = [];
// 		for (var i = 0; i < data.length; i++) {
// 			if (data[i] != null && data[i].eleCode != null && data[i].eleCode != "") {
// 				var fieldObj = {};
// 				fieldObj.eleCode = data[i].eleCode;
// 				fieldObj.eleName = data[i].eleName;
// 				fieldObj.fieldCode = data[i].fieldCode;
// 				fieldArr.push(fieldObj);
// 			}
// 		}
// 		if (fieldName != null && fieldName != '' && fieldName != undefined) {
// 			ma.tempName = fieldName;
// 			$("." + fieldName + "1,." + fieldName + "2,." + fieldName + "3,." + fieldName + "4,." + fieldName + "5").hide();
// 			$("." + fieldName + "1,." + fieldName + "2,." + fieldName + "3,." + fieldName + "4,." + fieldName + "5").find("label").text("");
// 			$("#" + fieldName + "1,#" + fieldName + "2,#" + fieldName + "3,#" + fieldName + "4,#" + fieldName + "5").attr("data-code", "");
// 		} else {
// 			ma.tempName = 'field';
// 			$(".field1,.field2,.field3,.field4,.field5").hide();
// 			$(".field1,.field2,.field3,.field4,.field5").find("label").text("");
// 			$("#field1,#field2,#field3,#field4,#field5").attr("data-code", "");
// 		}

// 		if (fieldArr.length > 0) {
// 			var len = fieldArr.length;
// 			for (var i = 0; i < len; i++) {
// 				$("." + ma.tempName + "" + (i + 1)).show();
// 				$("." + ma.tempName + "" + (i + 1)).find("label").text(fieldArr[i].eleName + "：");
// 				$("#" + ma.tempName + "" + (i + 1)).attr("data-code", fieldArr[i].eleCode);
// 				ufma.ajaxDef("/ma/sys/accItem/queryAccItemTree", "get", {
// 					agencyCode: agencyCode,
// 					eleCode: fieldArr[i].eleCode
// 				}, function (result) {
// 					var oneArr = [{
// 						"id": "0",
// 						"pId": "",
// 						"name": " "
// 					}];
// 					var newData = oneArr.concat(result.data);
// 					$("#" + ma.tempName + "" + (i + 1)).ufmaTreecombox({
// 						data: newData
// 					})
// 				})
// 			}
// 		}
// 	});
// }
//查询
ma.get = function(url, argu, callback) {
	this.ajax(url, 'get', argu, callback);
};
//新增
ma.post = function(url, argu, callback) {
	this.ajax(url, 'post', argu, callback);
};
//删除
ma.delete = function(url, argu, callback) {
	this.ajax(url, 'delete', argu, callback);
};
//修改
ma.put = function(url, argu, callback) {
	this.ajax(url, 'put', argu, callback);
};
//请求失败也执行callback，不在方法里解除按钮禁用
ma.ajax = function(url, type, argu, callback) {
	if($.isNull(url)) return false;
	if(type != 'get') {
		argu = JSON.stringify(argu);
	}

	var tokenid = ufma.getCommonData().token;
	//console.log("tokenid:" + tokenid);
	if(tokenid == undefined) {
		tokenid = "";
	}
	//加入tokenid（判断url里有没有？）
	if(url.indexOf("?") != -1) {
		url = url + "&ajax=1";
	} else {
		url = url + "?ajax=1";
	}

	$.ajax({
		url: url,
		type: type, //GET
		async: true, //或false,是否异步
		data: argu,
		timeout: 60000, //超时时间
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		contentType: 'application/json; charset=utf-8',
		beforeSend: function(xhr) {
			//console.log(xhr)
			//console.log('发送前')
			//ufma.showloading('正在请求数据，请耐心等待...');
		},
		success: function(result) {
			callback(result);
		},
		error: function(jqXHR, textStatus) {
			ufma.hideloading();
			var error = "";
			switch(jqXHR.status) {
				case 408:
					error = "请求超时";
					break;
				case 500:
					error = "服务器错误";
					break;
				default:
					break;
			}
			if(error != "") {
				ufma.showTip(error, function() {}, "error");
				return false;
			}
		},
		complete: function(data) {}
	});
};
//业务相关取兄弟代码初始化新代码
ma.fillWithBrother = function($elCode, baseInfo) {
	var defaults = {
		"rgCode": ma.rgCode,
		"setYear": ma.setYear
	}
	ufma.post('/ma/sys/common/getEleSameLevelNextChrCode', $.extend(true, defaults, baseInfo), function(result) {
		$elCode.val(result.data);
		//bugCWYXM-5216--修改基础数据维护保存并新增时要素控制方式不正确问题--zsj
		$(".userDatachrCode").trigger("blur");
	});

};
//CWYXM-6760--基础资料助记码，控制下，不超过42个英文字符。直接提示，并截取前42位--zsj
$('#assCode').on('keyup', function() {
	var assCode = $(this).val();
	if(assCode.length == 42) {
		ufma.showTip('助记码最多输入42个字符', function() {}, 'warning');
		//$(this).val($(this).val().substring(0,41));
		return false;
	}
})
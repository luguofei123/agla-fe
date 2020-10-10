var dm = $.extend(true, ufma.getCommonData(), {
	curPlan: {},
	getCtrl: function(tag) {
		var url = '';
		switch(tag) {
			//查询方案
			case 'savePlan':
				url = '/bg/report/saveReportFindPlan'; ////3, 保存报表的查询方案信息 {prjGuid : '方案的GUID' 如果=null 或者='' 表示是新方案,agencyCode : 单位代码,userName:'',userId :'',rptType :'',prjName :'', prjContent :方案内容，是json字符串。具体含义报表自行定义}
				break;
			case 'getPlan':
				url = '/bg/report/getReportFindPlan'; //2, 获取报表的查询方案信息 {agencyCode : '',userId : '',userName : '',rptType : ''}
				break;
			case 'delPlan':
				url = '/bg/report/deleteReportFindPlan'; //4, 删除报表的查询方案信息 {agencyCode : '',userId : '',prjGuid : ''}
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
	// //方案初始化begin
	// showPlan: function(argu) {
	// 	function buildPlanItem(data) {
	// 		for(var i = 0; i < data.length; i++) {
	// 			var liHtml = ufma.htmFormat('<li data-agency="<%=agency%>" data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
	// 				code: data[i].prjGuid,
	// 				name: data[i].prjName,
	// 				scope: data[i].prjScope,
	// 				agency: data[i].agencyCode
	// 			});
	// 			var $li = $(liHtml);
	// 			$.data($li[0], 'planData', data[i]);
	// 			$li[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
	// 		}
	// 	}
	// 	$("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
	// 	this.getPlan(argu, buildPlanItem);

	// 	$("#rptPlanList").off().on('click', 'li', function(e) {
	// 		if($(e.target).is('.btn-close')) {
	// 			var _li = $(this).closest('li');
	// 			var planCode = _li.attr('data-code');
	// 			var planName = _li.attr('data-name');
	// 			var agencyCode = _li.attr('data-agency');
	// 			dm.delPlan(agencyCode, planCode, planName, argu, function(action) {
	// 				if(action) {
	// 					_li.remove();
	// 					$("#rptPlanList").ufTooltip('hide');
	// 				}
	// 			});
	// 		} else {
	// 			$("#rptPlanList").ufTooltip('hide');
	// 			// if($(this).hasClass('selected')) return false;
	// 			$(this).siblings('.selected').removeClass('selected');
	// 			$(this).addClass('selected');
	// 			var planCode = $(this).attr('data-code');
	// 			dm.selectPlan($(this));
	// 			if($('.label-more span').text() == '更多') {
	// 				//$('.label-more span').text('收起')
	// 				$('.label-more span').trigger("click");
	// 			}
	// 		}
	// 	});
	// },
	// selectPlan: function(ths) {
	// 	var tmpDataObj = $.data($(ths)[0], 'planData');
	// 	var tmpDataArr = JSON.parse(tmpDataObj.prjContentOfString);
	// 	var assiData = tmpDataArr.selectedItems;
	// 	$('#cbBgPlan').getObj().val(tmpDataArr.planChrId)
	// 	if(!$.isNull(tmpDataArr.bgItemCode)) {
	// 		$('#bgItemCode p').html(tmpDataArr.bgItemCode);
	// 		$('#bgItemCode p').css('color', '#333');
	// 		$('.clearBill').css("margin-top", "-28px");
	// 		$('.btnSetAccItem').css({
	// 			"margin-top": "-35px",
	// 			"margin-right": "-48px"
	// 		});
	// 	} else {
	// 		$('#bgItemCode p').html('请选择指标编码');
	// 		$('#bgItemCode p').css('color', '#d9d9d9');
	// 		$('.btnSetAccItem').css({
	// 			"margin-top": "-35px",
	// 			"margin-right": "-49px"
	// 		});
	// 		$('.clearBill').css("margin-top", "-8px");
	// 	}
	// 	setTimeout(function() {
	// 		$('#planItemMore').find('.form-group').each(function() {
	// 			var code = $(this).attr('eleCode');
	// 			if(code == 'ISUPBUDGET') {
	// 				$('#isUpBudget').getObj().val(tmpDataArr.isUpBudget);
	// 			} else if(code == 'sendDocNum') {
	// 				$('#sendDocNum').val(tmpDataArr.sendDocNum);
	// 			} else  if(code == 'bgItemIdMx') {
	// 				$('#bgItemIdMx').val(tmpDataArr.bgItemIdMx);
	// 			} else {
	// 				for(var z = 0; z < assiData.length; z++) {
	// 					if(assiData[z].eleCode == code && assiData[z].eleCode != 'ISUPBUDGET' && assiData[z].eleCode != 'bgItemIdMx' && assiData[z].eleCode != 'sendDocNum') {
	// 						var valueItem = assiData[z].itemValue;
	// 						if(valueItem && valueItem.length > 0) {
	// 							$('#cb' + code).getObj().val(assiData[z].itemValue[0].id);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}, 2000)
	// },
	// delPlan: function(agencyCode, planCode, planName, _callback) {
	// 	ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
	// 		if(action) {
	// 			var argu = {
	// 				"agencyCode": agencyCode,
	// 				"prjGuid": planCode,
	// 				"userId": dm.svUserId //修改权限  将svUserCode改为 svUserId  20181012
	// 			};
	// 			dm.doPost('delPlan', argu, function(result) {
	// 				ufma.showTip("方案删除成功！", function() {}, "success");
	// 				_callback(true);
	// 			});
	// 		}
	// 	}, {
	// 		type: 'warning'
	// 	});
	// },
	// getPlan: function(argu, _callback) {
	// 	this.doPost('getPlan', argu, function(result) {
	// 		_callback(result.data.items);
	// 	});
	// },
	//方案初始化end
});
$.fn.dataTable.ext.errMode = 'none';;
var dm = $.extend(true, ufma.getCommonData(), {
	curPlan: {},
	curColA:[],
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
				//查询方案
			case 'getPlan':
				url = '/gl/rpt/prj/getPrjList';
				break;
			case 'getShearPlan':
				url = '/gl/rpt/prj/getSharePrjList';
				break;
			case 'delPlan':
				url = '/gl/rpt/prj/deletePrj';
				break;
			case 'acco':
				url = '/gl/sys/coaAcc/getRptAccoTree';
				/*		"accaCode": accaCode,
					"acctCode": rpt.nowAcctCode,
					"agencyCode": rpt.nowAgencyCode,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId*/
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
	//方案初始化begin
	showPlan: function(argu) {
		function buildPlanItem(data) {
			for(var i = 0; i < data.length; i++) {
				var liHtml = ufma.htmFormat('<li data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
					code: data[i].prjCode,
					name: data[i].prjName,
					scope: data[i].prjScope
				});
				$(liHtml)[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
			}
		}
		$("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
		this.getPlan(argu, buildPlanItem);
		this.getShearPlan(argu, buildPlanItem);

		$("#rptPlanList").off().on('click', 'li', function(e) {
			if($(e.target).is('.btn-close')) {
				var _li = $(this).closest('li');
				var planCode = _li.attr('data-code');
				var planName = _li.attr('data-name');
				dm.delPlan(planCode, planName, function(action) {
					if(action) {
						_li.remove();
						$("#rptPlanList").ufTooltip('hide');
					}
				});
			} else {
				$("#rptPlanList").ufTooltip('hide');
				// if($(this).hasClass('selected')) return false;
				$(this).siblings('.selected').removeClass('selected');
				$(this).addClass('selected');

				var planCode = $(this).attr('data-code');
				dm.selectPlan(planCode);
			}
		});
	},
	selectPlan: function(planCode) {
		//此方法调用rptCommon2.js
		rpt.reqPrjCont(planCode);
	},
	delPlan: function(planCode, planName, _callback) {
		ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
			if(action) {
				var argu = {
					"agencyCode": dm.svAcctCode,
					"prjCode": planCode,
					"rptType": rpt.rptType,
					"setYear": dm.svSetYear,
					"userId": dm.svUserId  //修改权限  将svUserCode改为 svUserId  20181012
				};
				dm.doDel('delPlan', argu, function(result) {
					ufma.showTip("方案删除成功！", function() {}, "success");
					_callback(true);
					//
					rpt.backToOrigin();
				});
			}
		}, {
			type: 'warning'
		});
	},
	getPlan: function(argu, _callback) {
		this.doGet('getPlan', argu, function(result) {
			_callback(result.data);
		});
	},
	getShearPlan: function(argu, _callback) {
		this.doGet('getShearPlan', argu, function(result) {
			_callback(result.data);
		});
	},
	//方案初始化end
	//显示要素控制
	remItemCtrl:function(){
		$('#showColSet td').each(function() {
			var itemType = $(this).attr('data-code');
			dm.curColA.push({itemType:itemType,isShow:rpt.getShowStatus(itemType),isSum:rpt.getSumStatus(itemType)});
		});		
	},
	setItemCtrl:function(){
		for(var i=0;i<this.curColA.length;i++){
			item = this.curColA[i];
			rpt.setShowStatus(item.itemType,item.isShow);
			rpt.setSumStatus(item.itemType,item.isSum);
		}
	},
	showItemCol: function() {
		this.remItemCtrl();
		var rptType = $(".rptType").val();
		var showBox = (rptType == "GL_RPT_BAL" || rptType == "GL_RPT_JOURNAL") ? '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" class="isShowCol">显示<span></span></label>' : '';
		var sumBox = rptType == "GL_RPT_BAL" ? '<label class="mt-checkbox mt-checkbox-outline ml10"><input type="checkbox" class="isSumCol">逐级汇总<span></span></label>' : '';
		$("#showColSet").html('<table class="ufma-table uf-tip-menu"><tr><td style="padding-right:180px;" data-code="ACCO" data-name="会计科目">会计科目<span style="position:absolute;right:15px;">' + showBox + sumBox + '</span></td></tr></table>');
		$('.accList').each(function() {
			var $cb = $(this).getObj();
			if(!$.isNull($cb.getValue())) {
				if($("#showColSet").find('td[data-code="' + $cb.getValue() + '"]').length == 0) {
					var liHtml = ufma.htmFormat('<tr><td style="padding-right:180px;" data-code="<%=code%>" data-name="<%=name%>"><%=name%><span style="position:absolute;right:15px;">' + showBox + sumBox + '</span></td></tr>', {
						code: $cb.getValue(),
						name: $cb.getText()
					});
					$(liHtml).appendTo("#showColSet table");
				}
			}
		});
		this.setItemCtrl();
		if($('#showColSet input.isShowCol:checked').length==0){
			$('#showColSet tr td[data-code="ACCO"] .isShowCol').prop('checked',true);
		}
				
		$('#showColSet').on('click', '.isSumCol', function(e) {
			e.stopPropagation();
			var target = $(this);
			if(target.prop('checked')) {
				target.closest('td').find('.isShowCol').prop('checked', true);
			}
		});
		$('#showColSet').on('click', '.isShowCol', function(e) {
			if(!$(this).prop('checked')){
				if($('#showColSet input.isShowCol:checked').length==0){
					ufma.showTip('至少选择一个显示要素！',function(){},'warning');
					$(this).prop('checked',true);
				}
			}
		});
	}
});

dm.showItemCol();
$.fn.dataTable.ext.errMode = 'none';
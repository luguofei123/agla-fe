var dm = $.extend(true, ufma.getCommonData(), {
	curPlan: {},
	curColA:[],
	isPrjList:true,
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
	showItemCol: function(flag) {

		var val = JSON.parse(localStorage.getItem("colSetVal"));
		var content = localStorage.getItem("colSetHtml");

		this.remItemCtrl();
		var rptType = $(".rptType").val();
		if (rptType == "GL_RPT_BAL" && val) {
			// liuyyn #7862 余额表 【财务云】查询辅助账时，可以调整辅助项及科目显示顺序
			// 回显记录的拖拽后的顺序
			$("#showColSet").html(content);
		} else {
			var showBox = (rptType == "GL_RPT_BAL" || rptType == "GL_RPT_JOURNAL") ? '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" class="isShowCol">显示<span></span></label>' : '';
			var sumBox = rptType == "GL_RPT_BAL" ? '<label class="mt-checkbox mt-checkbox-outline ml10"><input type="checkbox" class="isSumCol">逐级汇总<span></span></label><label class="ml10"><a class="btn-label btn-Drag" title="拖动排序" style="color: rgb(51, 51, 51);"><i class="glyphicon icon-drag"></i></a></label>' : '';
			$("#showColSet").html('<table class="ufma-table uf-tip-menu"><tr><td style="padding-right:180px;" data-code="ACCO" data-name="会计科目">会计科目<span style="position:absolute;right:15px;">' + showBox + sumBox + '</span></td></tr></table>');
			if (!flag) {
				$('.accList').each(function () {
					var $cb = $(this).getObj();
					if (!$.isNull($cb.getValue())) {
						if ($("#showColSet").find('td[data-code="' + $cb.getValue() + '"]').length == 0) {
							var liHtml = ufma.htmFormat('<tr><td style="padding-right:180px;" data-code="<%=code%>" data-name="<%=name%>"><%=name%><span style="position:absolute;right:15px;">' + showBox + sumBox + '</span></td></tr>', {
								code: $cb.getValue(),
								name: $cb.getText()
							});
							$(liHtml).appendTo("#showColSet table");
						}
					}
				});
			}
		}
		
		this.setItemCtrl();
		if($('#showColSet input.isShowCol:checked').length==0 && $(".rptType").val() != "GL_RPT_JOURNAL"){
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
				if($('#showColSet input.isShowCol:checked').length==0 && rpt.rptType != "GL_RPT_JOURNAL"){
					ufma.showTip('至少选择一个显示要素！',function(){},'warning');
					$(this).prop('checked',true);
				}
			}
		});
		// liuyyn #7862 余额表 【财务云】查询辅助账时，可以调整辅助项及科目显示顺序
		$('#showColSet').on('mousedown', '.btn-Drag', function(e) {
			$('#showColSet').tableSort();
		});
		$('#showColSet').on('mouseup', function(e) {
			var dataIndex = 0;
			var colSetVal = [];
			$('#showColSet tbody tr').each(function() {
				dataIndex++;
				var dataItem = {};
				dataItem.dataIndex = dataIndex;
				dataItem.dataCode = $(this).find('td').attr('data-code');
				dataItem.dataName = $(this).find('td').attr('data-name');
				colSetVal.push(dataItem);
			});
			var colSetHtml = $('#showColSet').html();
			localStorage.setItem("colSetVal", JSON.stringify(colSetVal));
			localStorage.setItem("colSetHtml", colSetHtml);
		});
	}
});

dm.showItemCol();
$.fn.dataTable.ext.errMode = 'none';
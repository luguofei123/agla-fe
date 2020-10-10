//bug78362--zsj
function delDecomposeRows(rows) {
	if ($('#decompose-data').getObj().getData().length == 1) {
		ufma.showTip('至少需要一条分解指标', function () {}, 'warning');
		return false;
	}
	var bgItemIds = [];
	page.rows = rows;
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		bgItemIds.push(row);
	}
	var url = '/bg/budgetItem/multiPost/delComposeItems';
	var argu = {
		"agencyCode": page.agencyCode,
		"setYear": parseInt(page.pfData.svSetYear),
		"billType": 2,
		"billId": page.billId,
		"bgPlanChrId": page.curBgPlanDataChrId,
		"items": bgItemIds
	}
	ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
		if (action) {
			//CWYXM-8616 修改指标分解，删除行，未点击保存，直接关闭，应未删除成功，目前删除成功--修改为已保存数据删除时动态修改金额、余额、合计，未保存的数据删除时金额、余额不变，只有合计改变--zsj
			for (var i = 0; i < page.rows.length; i++) {
				var realCur = parseFloat($('#zbtz-data-editorBody .realBgItemCur').text().replace(/,/g, ''));
				var modifyCur = parseFloat($('#zbtz-data-editorBody .modifyAfterCur').text().replace(/,/g, ''));
				var billMoney = parseFloat($('#billHJJE').html().replace(/,/g, ''));
				var row = page.rows[i];
				var trId = 'decompose-data_row_' + row.bgItemCode;
				$('#decompose-data').getObj().del(trId);
				if (row.isNew != "是") {
					$('#zbtz-data-editorBody .realBgItemCur').text($.formatMoney((realCur + row.bgItemCur), 2));
					$('#zbtz-data-editorBody .modifyAfterCur').text($.formatMoney((modifyCur + row.bgItemCur), 2));
				}
			}
			//CWYXM-10759 修改指标分解单据-金额字段时，‘可分解金额’计算有误--zsj
			$('#billHJJE').html($.formatMoney(page.getRowsSum()));
			$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
		} else {
			//点击取消的回调函数
		}
	}, {
		type: 'warning'
	});

}
//取分解表头
function getDmpCols(sendCloName) {
	var column = [ // 支持多表头
		{
			type: 'checkbox',
			field: '',
			name: '',
			width: 40,
			headalign: 'center',
			align: 'center'
		},
		{
			field: 'bgItemCode',
			name: '指标编码',
			width: 100,
			headalign: 'center',
			"render": function (rowid, rowdata, data, meta) {
				if (!$.isNull(data)) {
					return '<span title="' + data + '">' + data + '</span>';
				} else {
					return '';
				}
			}
    },
    // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
    {
     field: 'bgTypeName',
     name: '指标类型',
     className: 'BGTenLen nowrap',
     width: 200,
     headalign: 'center',
     "render": function (rowid, rowdata, data, meta) {
       if (!$.isNull(data)) {
        return '<span title="' + data + '">' + data + '</span>';
       } else {
         return '';
       }
     }
   }, {
			type: 'input',
			field: 'bgItemSummary',
			name: '摘要',
			className: 'ellipsis',
			width: 200,
			headalign: 'center',
			"render": function (rowid, rowdata, data, meta) {
				if (!$.isNull(data)) {
					return '<span title="' + data + '">' + data + '</span>';
				} else {
					return '';
				}
			}
		}
	];
	if (page.planData1.isComeDocNum == "是") {
		column.push({
			type: 'input',
			field: 'comeDocNum',
			name: '来文文号',
			className: 'ellipsis',
			width: 200,
			headalign: 'center',
			"render": function (rowid, rowdata, data, meta) {
				if (!$.isNull(data)) {
					return '<span title="' + data + '">' + data + '</span>';
				} else {
					return '';
				}
			}
		});
	}
	if (page.planData1.isSendDocNum == "是") {
		column.push({
			type: 'input',
			field: 'sendDocNum',
			name: sendCloName,
			className: 'ellipsis',
			width: 200,
			headalign: 'center',
			"render": function (rowid, rowdata, data, meta) {
				if (!$.isNull(data)) {
					return '<span title="' + data + '">' + data + '</span>';
				} else {
					return '';
				}
			}
		});
    }
    if (page.planData1.isFinancialBudget == "1") {
		column.push({
			type: 'input',
			field: 'bgItemIdMx',
			name: '财政指标ID',
			className: 'ellipsis',
			width: 200,
			headalign: 'center',
			"render": function (rowid, rowdata, data, meta) {
				if (!$.isNull(data)) {
					return '<span title="' + data + '">' + data + '</span>';
				} else {
					return '';
				}
			}
		});
	}
	//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
	var isUpBudgetData = [{
		code: "1",
		pId: "*",
		isLeaf: 1,
		parentId: "",
		levelNum: 1,
		pCode: "",
		codeName: "是",
		name: "是",
		chrFullname: "是",
		eleCode: "",
		id: "1",
		isFinal: "",
		lastVer: "",
	}, {
		code: "0",
		pId: "*",
		isLeaf: 1,
		parentId: "",
		levelNum: 1,
		pCode: "",
		codeName: "否",
		name: "否",
		chrFullname: "否",
		eleCode: "",
		id: "0",
		isFinal: "",
		lastVer: "",
	}]
	if (!$.isNull(page.planData1)) {
		$.each(page.planData1.planVo_Items, function (i, item) {
			var cbItem = item.eleCode;
			if (cbItem != "ISUPBUDGET") {
				var url = bg.getUrl('bgPlanItem');
				var type = 'get';
				var param = {};
				param['agencyCode'] = page.agencyCode;
				param['setYear'] = parseInt(page.pfData.svSetYear);
				param['eleCode'] = item.eleCode;
				param['eleLevel'] = item.eleLevel;
				param['isNew'] = '1';
				var idField = bg.shortLineToTF(item.eleFieldName);
				var textField = bg.shortLineToTF(item.eleFieldName + '_NAME');
				var argu = param;
				var callback = function (result) {
					for (var j = 0; j < result.data.length; j++) {
						var item1 = result.data[j];
						item1[idField] = item1.code;
						item1[textField] = item1.codeName;
					}
					column.push({
						type: 'treecombox',
						field: idField,
						idField: idField,
						textField: textField,
						name: item.eleName,
						width: 240,
						headalign: 'center',
						data: result.data,
						"render": function (rowid, rowdata, data, meta) {
							//BUGCWYXM-4727--指标分解树组件清空问题--zsj
							if (!$.isNull(data)) {
								return '<span title="' + rowdata[textField] + '">' + rowdata[textField] + '</span>';
							} else {
								return '';
							}

						}
					});
				}
				ufma.ajaxDef(url, type, argu, callback);
			} else {
				column.push({
					type: 'treecombox',
					field: 'isUpBudget',
					idField: "code",
					textField: 'codeName',
					name: "是否采购",
					// width: 100,
          headalign: 'center',
          className: 'nowrap',
          align: 'center',
					data: isUpBudgetData
				});
			}

		});
	}
	column.push({
		type: 'money',
		field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
		name: '金额',
		width: 150,
		align: 'right',
		headalign: 'center',
		"render": function (rowid, rowdata, data, meta) {
			if (!$.isNull(data)) {
				return '<span title="' + rowdata.bgItemBalanceCur + '">' + $.formatMoney(rowdata.bgItemBalanceCur, 2) + '</span>';
			} else {
				return '';
			}
		},
		onKeyup: function (e) {
			$('#billHJJE').html($.formatMoney(page.getRowsSum()));
			$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
		}
	});
	column.push({
		type: 'toolbar',
		field: 'option',
		name: '操作',
		width: 150,
		headalign: 'center',
		render: function (rowid, rowdata, data, meta) {
			if (window.ownerData.status == '3') { //如果为已审核单子，不可编辑CWYXM-4872
				return '<button class="btn btn-del btn-delete icon-trash disabled" data-toggle="tooltip" title="删除"></button>';
			} else {
				return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
			}
		}
	});
	return [column];
}
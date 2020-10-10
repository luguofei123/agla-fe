$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var page = function() {
		return {
			showReport: function() {

				var data = window.ownerData.data;
				var fina = [],
					budget = []; 
				var camtDrHJ = 0.00;
				var camtCrHJ = 0.00;
				var yamtDrHJ = 0.00;
				var yamtCrHJ = 0.00;
				$.each(data, function(idx, item) {
					if(item.acceCode < 6) {
						fina.push(item);
					} else {
						budget.push(item);
					}
					if(item.acceCode < 6) {
						if(item.amtDr != 0) {
							camtDrHJ = parseFloat(parseFloat(camtDrHJ) + parseFloat(item.amtDr)).toFixed(2);
						}
						if(item.amtCr != 0) {
							camtCrHJ = parseFloat(parseFloat(camtCrHJ) + parseFloat(item.amtCr)).toFixed(2);
						}
					} else {
						if(item.amtDr != 0) {
							yamtDrHJ = parseFloat(parseFloat(yamtDrHJ) + parseFloat(item.amtDr)).toFixed(2);
						}
						if(item.amtCr != 0) {
							yamtCrHJ = parseFloat(parseFloat(yamtCrHJ) + parseFloat(item.amtCr)).toFixed(2);
						}
					}

				});
				if(parseFloat(camtDrHJ) == parseFloat(camtCrHJ) && (parseFloat(yamtDrHJ) == parseFloat(yamtCrHJ))) {
					$('.alert-success').removeClass('hide');
					$('.alert-warning').addClass('hide');
				} else {
					$('.alert-warning').removeClass('hide');
					$('.alert-success').addClass('hide');
					var da = ''
					if(parseFloat(camtDrHJ) != parseFloat(camtCrHJ)){
						da+='财务会计借方金额减贷方金额：'+$.formatMoney(camtDrHJ - camtCrHJ)+"&nbsp"
					}
					if(parseFloat(yamtDrHJ) != parseFloat(yamtCrHJ)){
						da+='预算会计借方金额减贷方金额：'+$.formatMoney(yamtDrHJ - yamtCrHJ)
					}
					$('#defAmt').html(da);
				}

				$('#reportData').ufmaDataTable({
					data: fina,
					columns: [{
							key: 'acceName',
							name: '会计要素'
						},
						{
							type: 'money',
							key: 'amtDr',
							name: '借方金额',
							align: 'right'
						},
						{
							type: 'money',
							key: 'amtCr',
							name: '贷方金额',
							align: 'right'
						}
					]
				});

				if(budget.length > 0) {
					$('.budgetCaption,#reportDataBudget').removeClass('hidden');
					$('#reportDataBudget').ufmaDataTable({
						data: budget,
						columns: [{
								key: 'acceName',
								name: '会计要素'
							},
							{
								type: 'money',
								key: 'amtDr',
								name: '借方金额',
								align: 'right'
							},
							{
								type: 'money',
								key: 'amtCr',
								name: '贷方金额',
								align: 'right'
							}
						]
					});
				} else {
					$('.budgetCaption,#reportDataBudget').addClass('hidden');
				}
			},

			//此方法必须保留
			init: function() {
				ufma.parse();
				page.showReport();
				if(!window.ownerData.isClosed){
					$('#btn-save').remove()
				}
				$('#btn-cancel').click(function() {
					_close('cancel');
				});
				$('#btn-save').on('click', function() {
//					if($('#defAmt').html()!=''){
//						ufma.showTip('试算不平衡，无法保存！', function() {}, 'warning');
//					}else{
						_close('save');
//					}
				});
			}
		}
	}();
	/////////////////////
	page.init();
});
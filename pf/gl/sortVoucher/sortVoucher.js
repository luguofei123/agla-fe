$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	function configupdate(key, value) {
		var data = {
			"agencyCode": window.ownerData.agencyCode,
			"acctCode": window.ownerData.acctCode,
			"menuId": '5444eb79-d926-46f5-ae2b-2daf90ab8bcb',
			"configKey": key,
			"configValue": value
		}
		ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function (data) { })
	}
	var istableSort = false
	var page = function() {
		var pfData = ufma.getCommonData();
		var agencyCode = window.ownerData.agencyCode,
			acctCode = window.ownerData.acctCode,
			setYear = window.ownerData.setYear,
			isDouble = window.ownerData.isDouble
		var ctrls = {
			'getVouType': '/gl/eleVouType/getVouType/' + agencyCode + '/' + setYear + '/' + acctCode + '/*',
			'querySortVoucher': '/gl/vouBox/searchSortVous',
			'saveSortVous': '/gl/vouBox/saveSortVous',
			'checkSortVous':'/gl/vouBox/checkSaveSortVous'
		}

		function intToVouNo(i) {
			var vouNo = i + 1;
			if(vouNo < 10) {
				vouNo = '000' + vouNo;
			} else if(vouNo < 100) {
				vouNo = '00' + vouNo;
			} else if(vouNo < 1000) {
				vouNo = '0' + vouNo
			}
			return vouNo;

		}
		var loadParams;
		return {
			initPeriod: function() {
				if(window.ownerData.fisPerd != undefined) {
					$('#sortPeriod').ufDatepicker({
						format: 'yyyy-mm',
						viewMode: 'month',
						initialDate: window.ownerData.setYear + '-' + window.ownerData.fisPerd,
					}).on('change', function() {
						page.loadSortVoucher();
					});
				} else {
					var mydate = new Date(ufma.getCommonData().svTransDate);
					var Year = mydate.getFullYear();
					var Month = (mydate.getMonth() + 1);
					$('#sortPeriod').ufDatepicker({
						format: 'yyyy-mm',
						viewMode: 'month',
						initialDate: Year+'-'+Month,
					}).on('change', function() {
						page.loadSortVoucher();
					});
				}

			},
			initVoucType: function() {
				var $obj = $('#vouType');
				$obj.find(':not(.label-radio)').remove();
				var callback = function(result) {
					$.each(result.data, function(idx, item) {
						$('<a name="vouTypeCode" chrName="' + item.name + '" value="' + item.code + '" class="label label-radio ' + (idx == 0 ? 'selected' : '') + '">' + item.name + '</a>').appendTo($obj);
					});
					if(window.ownerData.acctype != undefined) {
						for(var i = 0; i < $('.label-radio[name="vouTypeCode"]').length; i++) {
							if($('.label-radio[name="vouTypeCode"]').eq(i).attr('value') == window.ownerData.acctype) {
								$('.label-radio[name="vouTypeCode"]').removeClass('selected')
								$('.label-radio[name="vouTypeCode"]').eq(i).addClass('selected')
							}
						}
					}
					//ufma.parse();
					page.loadSortVoucher();
				}
				ufma.get(ctrls.getVouType, {}, callback);
			},
			loadSortVoucher: function() {
				var period = $('#sortPeriod').getObj().getValue();
				period = $.eof(period, '-');
				var sortBy = $('.label-radio[name="sortBy"].selected').attr('value');
				var vouTypeCode = $('.label-radio[name="vouTypeCode"].selected').attr('value');
				var queryParams = {
					"agencyCode": agencyCode,
					"acctCode": acctCode,
					"setYear": parseInt(setYear),
					"fisPerd": parseInt(period),
					"vouTypeCode": vouTypeCode,
					"sortBy": sortBy
				}
				loadParams = queryParams;
				var callback = function(result) {
					$('#sortGrid tbody').html('');
					if(isDouble=='*'){
						$('#sortGrid thead').find('.je').after('<th>财务金额</th><th>预算金额</th>');
						$('#sortGrid thead').find('.je').remove()
					}
					var len = result.data.length;
					for(var i=0;i<len;i++){
						if(result.data[i].amtDr == 0 || result.data[i].amtDr == ''){
							result.data[i].amtDr = result.data[i].ysAmtDr
						}
					}
					var rowHtml = ''
					if(isDouble=='*'){
						rowHtml = '<tr><td class="<%=sortColor%> sorttd" title="<%=sortNo%>"><input class="<%=sortColor%> nobor" type="text" value="<%=sortNo%>"></td><td title="<%=vouNo%>"><%=vouNo%></td><td title="<%=vouDate%>"><%=vouDate%></td><td title="<%=vouDesc%>"><%=vouDesc%></td><td class="tr"  title="<%=amtDr%>"><%=amtDr%></td><td class="tr"  title="<%=ysAmtDr%>"><%=ysAmtDr%></td><td title="<%=inputorName%>"><%=inputorName%></td><td title="<%=vouSource%>"><%=vouSource%></td>'+
						'<td><a class="btn-label btn-Drag" data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a></td></tr>'
					}else{
						rowHtml = '<tr><td class="<%=sortColor%> sorttd" title="<%=sortNo%>"><input class="<%=sortColor%> nobor" type="text" value="<%=sortNo%>"></td><td title="<%=vouNo%>"><%=vouNo%></td><td title="<%=vouDate%>"><%=vouDate%></td><td title="<%=vouDesc%>"><%=vouDesc%></td><td class="tr"  title="<%=amtDr%>"><%=amtDr%></td><td title="<%=inputorName%>"><%=inputorName%></td><td title="<%=vouSource%>"><%=vouSource%></td>'+	
						'<td><a class="btn-label btn-Drag" data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a></td></tr>'
					}
					for(var i = 0; i < len; i++) {
						var vou = result.data[i];
						vou.sortNo = intToVouNo(i);
						vou.sortColor = '';
						if(vou.sortNo != vou.vouNo) {
							vou.sortColor = 'uf-red';
						}
						vou.amtDr = $.formatMoney(vou.amtDr, 2);
						vou.ysAmtDr = $.formatMoney(vou.ysAmtDr, 2);
						var tr = $($.htmFormat(rowHtml, vou)).appendTo('#sortGrid tbody');
						$.data(tr[0], 'rowData', vou);
					}
					for(var i = 0; i < $('#sortGrid tr').length; i++) {
						$('#sortGrid tr').eq(i).find('td:last-child').addClass('text-center')
						$('#sortGrid tr').eq(i).find('td:last-child').find('a').css({'color':'#333'})
					}
					
					$('#sortGrid .btn-Drag').on('mousedown', function(e) {
						var callback = function() {
							var idx = 0;
							var ids = []
							$('#sortGrid tbody tr').each(function() {
								if(!$(this).hasClass('hide')) {
									idx = idx + 1;
									$(this).find('span.recno').html(idx);
									var idxs = {}
									idxs[$(this).attr('id')] = idx
									ids.push(idxs)
								}
							});
						};
						$('#sortGrid').tableSort(callback);
						istableSort = true
					});
					$('#sortGrid').on('mouseup', function(e) {
						if(istableSort){
							$('#sortGrid tbody tr').each(function(irow) {
								var vou = $.data(this, 'rowData');
								vou.sortNo = intToVouNo(irow);
								var dataclas = vou.sortNo != vou.vouNo ? 'uf-red' : ''
								$(this).find('td:eq(0)').find('input').addClass(dataclas).val(vou.sortNo);
								//$.data(this,'rowData',vou);
								if($(this).find('.sorttd').find('.nobor').val() == $(this).find('td').eq(1).html()){
									$(this).find('.sorttd').removeClass('uf-red')
									$(this).find('.sorttd').find('.nobor').removeClass('uf-red')
								}else{
									$(this).find('.sorttd').addClass('uf-red')
									$(this).find('.sorttd').find('.nobor').addClass('uf-red')
								}
							});
							istableSort = false
						}
					});
				}
				ufma.post(ctrls.querySortVoucher, queryParams, callback);
			},
			saveSortNo: function() {
				var sortVou = [];
				$('#sortGrid tbody tr').each(function(irow) {
					var vou = $.data(this, 'rowData');
					//if(vou.vouNo != vou.sortNo) {
						sortVou.push($.extend(true, {
							'vouGuid': vou.vouGuid,
							'newVouNo': $('#sortGrid tbody tr').eq(irow).find('.nobor').val(),
							'vouNo': vou.vouNo,
							'vouDate':vou.vouDate
						}, loadParams));
					//}
				});
				if(sortVou.length > 0) {
					ufma.confirm('凭证重排后将无法还原，您确定要执行当前操作吗？', function(action) {
						if(action) {
							ufma.post(ctrls.checkSortVous, sortVou, function(result) {
								if(result.data.status==1 || result.data.status==2){
									ufma.showTip(result.data.msg, function() {}, "error");
								}else{
									ufma.post(ctrls.saveSortVous, sortVou, function(result) {
										ufma.showTip(result.msg, function() {}, "success");
										_close(true);
									});
								}
							})
						}
					}, {
						type: 'warning',
						okText: '确定',
						cancelText: '取消'
					})

				} else {
					ufma.showTip('凭证号没有变化！', function() {}, "warning");
				}
			},
			onEventListener: function() {
				$(document).on('click', '.label-radio', function() {
					page.loadSortVoucher();
					if($(this).attr('name') == 'sortBy'){
						configupdate('sortBy',$(this).attr('value'))
					}
				});
				$(document).on("input propertychange", ".nobor", function() {
					var $this = $(this)
					if($this.val().length > 4) {
						$this.val($this.val().substring(0, 4));
					}
				});
				$(document).on("keyup", ".nobor", function(e) {
					var $this = $(this)
					if(/[^\d]/.test($this.val())) { //替换非数字字符  
						var temp_amount = $this.val().replace(/[^\d]/g, '');
						$this.val(temp_amount);
					}
				})
				$(document).on("blur", ".nobor", function() {
					var $this = $(this)
					if(!isNaN(parseFloat($this.val()))){
						if($this.val().length == 1) {
							$this.val('000'+$this.val())
						} else if($this.val().length == 2) {
							$this.val('00'+$this.val())
						} else if($this.val().length == 3) {
							$this.val('0'+$this.val())
						}
					}else{
						$this.val(9999)
					}
					$this.parents('td').attr('title',$this.val())
					if($this.val() == $this.parents('td').next('td').html()){
						$(this).removeClass('uf-red')
						$(this).parents('td').removeClass('uf-red')
					}else{
						$(this).addClass('uf-red')
						$(this).parents('td').addClass('uf-red')
					}
				});
				$('.btn-close').click(function() {
					_close(false);
				});
				$('.btn-save').click(function() {
					page.saveSortNo();
				});

			},

			init: function() {
				//获取session
				page.initPeriod();
				page.initVoucType();
				ufma.parse();
				page.onEventListener();
				ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + window.ownerData.agencyCode + '&acctCode=' + window.ownerData.acctCode + '&menuId=5444eb79-d926-46f5-ae2b-2daf90ab8bcb', "get", '', function (data) {
					if (data.data.sortBy != undefined) {
						$('.sortBydiv').find('.label-radio[value="'+data.data.sortBy+'"]').addClass('selected').siblings('.label-radio[name="sortBy"]').removeClass('selected')
					}
				})

			}
		}
	}();

	page.init();
});
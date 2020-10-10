$(function () {
	var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
	var isChange = true
	function Sors(str) {
		var arr = str.split("_");
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].toLowerCase()
		}
		for (var i = 1; i < arr.length; i++) {
			arr[i] = arr[i].toLowerCase()
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
		}
		return arr.join("");
	}
	function commafyback(num) {
		if (num == undefined || num == null) {
			return num;
		} else {
			var x = num.split(',');
			return parseFloat(parseFloat(x.join("")).toFixed(2));
		}
	}

	function getPdf(reportCode, templId, groupDef) {
		var xhr = new XMLHttpRequest()
		var formData = new FormData()
		formData.append('reportCode', reportCode)
		formData.append('templId', templId)
		formData.append('groupDef', groupDef)
		xhr.open('POST', '/pqr/api/printpdfbydata', true)
		xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
		xhr.responseType = 'blob'

		//保存文件
		xhr.onload = function (e) {
			if (xhr.status === 200) {
				if (xhr.status === 200) {
					var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
					window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
				}
			}
		}

		//状态改变时处理返回值
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				//通信成功时
				if (xhr.status === 200) {
					//交易成功时
					ufma.hideloading();
				} else {
					var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
					//提示框，各系统自行选择插件
					alert(content)
					ufma.hideloading();
				}
			}
		}
		xhr.send(formData)
	}
	var istwostadamt = ''
	var agencyName = ''
	var acctName = ''
	var page = function () {
		return {
			accsCode: '', //科目体系代码
			vouGuid: '',
			isshowbtns: '',
			vouGuidTmp: '',
			fzhsObj: {},
			fzhsTmp: {},
			balData: {},
			isShowCur: false,
			getReportData: function () {
				var acceCode = '';
				var argu = {
					'agencyCode': page.agencyCode,
					'acctCode': page.acctCode,
					'accsCode': page.accsCode,
					'setYear': page.pfData.svSetYear,
					'rgCode': page.pfData.svRgCode,
					'isShowLastBal': $('#isshowlastyear').is(":checked")?1:0,
					'isDoubleVou': page.isDoubleVou
				};
				if (istwostadamt) {
					argu.isAccrual = true
				}
				if (!$.isNull(acceCode)) argu['acceCode'] = acceCode;
				var url = '/gl/initial/getInitial';
				if ($("#issavetemp").is(':checked')) {
					url = '/gl/initial/getInitialTem'
				} else {
					url = '/gl/initial/getInitial'
				}
				var callback = function (result) {
					var data = result.data.listData || result.data;
					page.urldata = result.data.listData || result.data
					page.isClosed = !(result.data.isClosed)
					if (result.data.isTem) {
						$('.btn-save-tmp').removeClass('hide');
					} else {
						$('.btn-save-tmp').addClass('hide');
					}
					//调整数据，将pId修改为chrCode
					var newData = [];
					var pCode = '',
						pid = '';
					data = data || [];
					page.vouGuid = '';
					page.vouGuidTmp = '';
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						if (page.vouGuid == '') {
							page.vouGuid = item.vouGuid || '';
						}
						if (page.vouGuidTmp == '') {
							page.vouGuidTmp = item.vouGuidTmp || '';
						}

						item.pcode = item.pId;
						if (item.levelNum == 1) {
							item.pcode = item.acceCode;
						}
						if (item.levelNum == 0) {
							item.pcode = '';
						}

						item.currency = '';
						newData.push(item);
					}
					var columnsd = [];
					columnsd.push({
						type: 'indexcolumn',
						key: '',
						name: '序号',
						width: 50,
						align: 'center'
					})
					columnsd.push({
						key: 'codeName',
						name: '科目名称',
						textIndent: true, //缩进
						buttons: {
							'修改科目': {
								class: 'icon-edit btn-permission btn-edit',
								filter: function (rowdata) {
									return isshowbtns
								},
								action: function (event, row, rowdata) {
									if (page.isClosed) {
										page.editAcco(rowdata.chrCode, 'edit');
									}
								}
							},
							'删除科目': {
								class: 'icon-trash btn-permission btn-delete',
								filter: function (rowdata) {
									return isshowbtns
								},
								action: function (event, row, rowdata) {
									if (page.isClosed) {
										page.delAcco(rowdata.chrCode);
									}
								}
							},
							'新增科目': {
								class: 'icon-add btn-permission btn-addlower',
								filter: function (rowdata) {
									return isshowbtns
								},
								action: function (event, row, rowdata) {
									if (page.isClosed) {
										page.editAcco(rowdata.chrCode, 'addSub');
									}
								}
							},
							'辅助核算': {
								class: 'icon-text-fu fixed f24 ufma-yellow',
								filter: function (rowdata) {
									return rowdata.isAss != 0 && parseInt(rowdata.isLeaf) == 1;
								},
								action: function (event, row, rowdata) {
									page.editAss(rowdata.chrCode, rowdata.vouDetAss, rowdata.drCr, rowdata.isAllowSurplus, rowdata.isShowBill, rowdata.expireDate, rowdata.chrId, rowdata);
								}
							}
						}
					});
					page.isShowCur = result.data.isShowCur;
					if (page.isShowCur) {
						columnsd.push({
							key: 'currNum',
							name: '币种/数量',
							width: 100
						})
					}
					var dclen = 150
					if ($('#isshowlastyear').is(":checked")) {
						dclen = 150
					} else {
						dclen = 200
					}
					if (istwostadamt) {
						columnsd.push({
							key: 'drcrname',
							name: '方向',
							width: 50,
							align: 'right'
						})
						columnsd.push({
							type: 'money',
							edit: page.isClosed,
							key: 'dstadAmt',
							name: '期初借方',
							width: dclen,
							align: 'right'
						})
						columnsd.push({
							type: 'money',
							edit: page.isClosed,
							key: 'cstadAmt',
							name: '期初贷方',
							width: dclen,
							align: 'right'
						})
					} else {
						columnsd.push({
							key: 'drcrname',
							name: '方向',
							width: 50,
							align: 'right'
						})
						columnsd.push({
							type: 'money',
							edit: page.isClosed,
							key: 'stadAmt',
							name: '期初余额',
							width: dclen,
							align: 'right'
						})
					}
					if (data != undefined) {
						for (var i = 0; i < data.length; i++) {
							if (data[i].balAmt != '' && data[i].balAmt != 0) {
								data[i].stadAmt = data[i].balAmt
							} else {
								data[i].stadAmt = data[i].balAmt
							}
							if (data[i].drCr == '1') {
								data[i].drcrname = '借方'
							} else if (data[i].drCr == '-1') {
								data[i].drcrname = '贷方'
							} else {
								data[i].drcrname = ''
							}
						}
					}
					if ($('#isshowlastyear').is(":checked")) {
						columnsd.push({
							type: 'money',
							edit: false,
							key: 'lastyearDstadAmt',
							name: '上年期末借方',
							width: 150,
							align: 'right'
						})
						columnsd.push({
							type: 'money',
							edit: false,
							key: 'lastyearCstadAmt',
							name: '上年期末贷方',
							width: 150,
							align: 'right'
						})
					}
					page.balData = data;
					$(".uf-fix-top").remove();
					$("#reportTable").html('')
					ufma.showloading('正在刷新列表，请耐心等待...');
					page.rptTable = $('#reportTable').ufmaDataTable({
						ajax: '',
						data: data || null,
						idField: 'chrCode',
						pId: 'pcode',
						columns: columnsd,
						lock: { //行锁定
							class: 'bgc-gray2',
							filter: function (rowdata) {
								return parseInt(rowdata.isLeaf) == 0;
							}
						},
						textIndentFilter: function (rowdata) { //行缩进
							return rowdata.levelNum + 'em';
						},
						callbackDraw: function () {
							//权限判断
							ufma.isShow(page.reslist);
						},
						initComplete: function () {
							$('.ufma-tool-bar button').prop("disabled", false);
							page.callbackDraw();
							ufma.hideloading();
						}
					});
				};
				ufma.post(url, argu, callback);

			},
			repaintTable: function (data) {
				var newdata = data;
				var oldsdata = page.urldata
				for (var i = 0; i < oldsdata.length; i++) {
					for (var j = 0; j < newdata.length; j++) {
						if (oldsdata[i].chrCode == newdata[j].accoCode) {
							oldsdata[i]['vouDetailAsss'] = newdata[j]['vouDetailAsss']
							oldsdata[i]['cstadAmt'] = newdata[j]['cstadAmt']
							oldsdata[i]['stadAmt'] = newdata[j]['balAmt']
							oldsdata[i]['balAmt'] = newdata[j]['balAmt']
							oldsdata[i]['dstadAmt'] = newdata[j]['dstadAmt']
							oldsdata[i]['currNum'] = newdata[j]['currNum']
							var trid = 'reportTable_tr_' + oldsdata[i].chrCode;
							page.fzhsObj[trid] = newdata[j]['vouDetailAsss']
						}
					}
				}
				var data = oldsdata;
				//调整数据，将pId修改为chrCode
				var newData = [];
				var pCode = '',
					pid = '';
				data = data || [];
				page.vouGuid = '';
				page.vouGuidTmp = '';
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					if (page.vouGuid == '') {
						page.vouGuid = item.vouGuid || '';
					}
					if (page.vouGuidTmp == '') {
						page.vouGuidTmp = item.vouGuidTmp || '';
					}

					item.pcode = item.pId;
					if (item.levelNum == 1) {
						item.pcode = item.acceCode;
					}
					if (item.levelNum == 0) {
						item.pcode = '';
					}

					item.currency = '';
					newData.push(item);
				}
				var columnsd = [];
				columnsd.push({
					type: 'indexcolumn',
					key: '',
					name: '序号',
					width: 50,
					align: 'center'
				})
				columnsd.push({
					key: 'codeName',
					name: '科目名称',
					textIndent: true, //缩进
					buttons: {
						'修改科目': {
							class: 'icon-edit btn-permission btn-edit',
							filter: function (rowdata) {
								return isshowbtns
							},
							action: function (event, row, rowdata) {
								if (page.isClosed) {
									page.editAcco(rowdata.chrCode, 'edit');
								}
							}
						},
						'删除科目': {
							class: 'icon-trash btn-permission btn-delete',
							filter: function (rowdata) {
								return isshowbtns
							},
							action: function (event, row, rowdata) {
								if (page.isClosed) {
									page.delAcco(rowdata.chrCode);
								}
							}
						},
						'新增科目': {
							class: 'icon-add btn-permission btn-addlower',
							filter: function (rowdata) {
								return isshowbtns
							},
							action: function (event, row, rowdata) {
								if (page.isClosed) {
									page.editAcco(rowdata.chrCode, 'addSub');
								}
							}
						},
						'辅助核算': {
							class: 'icon-text-fu fixed f24 ufma-yellow',
							filter: function (rowdata) {
								return rowdata.isAss != 0 && parseInt(rowdata.isLeaf) == 1;
							},
							action: function (event, row, rowdata) {
								page.editAss(rowdata.chrCode, rowdata.vouDetAss, rowdata.drCr, rowdata.isAllowSurplus, rowdata.isShowBill, rowdata.expireDate, rowdata.chrId, rowdata);
							}
						}
					}
				});
				if (page.isShowCur) {
					columnsd.push({
						key: 'currNum',
						name: '币种/数量',
						width: 100
					})
				}
				var dclen = 150
				if ($('#isshowlastyear').is(":checked")) {
					dclen = 150
				} else {
					dclen = 200
				}
				if (istwostadamt) {
					columnsd.push({
						key: 'drcrname',
						name: '方向',
						width: 50,
						align: 'right'
					})
					columnsd.push({
						type: 'money',
						edit: page.isClosed,
						key: 'dstadAmt',
						name: '期初借方',
						width: dclen,
						align: 'right'
					})
					columnsd.push({
						type: 'money',
						edit: page.isClosed,
						key: 'cstadAmt',
						name: '期初贷方',
						width: dclen,
						align: 'right'
					})
				} else {
					columnsd.push({
						key: 'drcrname',
						name: '方向',
						width: 50,
						align: 'right'
					})
					columnsd.push({
						type: 'money',
						edit: page.isClosed,
						key: 'stadAmt',
						name: '期末余额',
						width: dclen,
						align: 'right'
					})
				}
				if (data != undefined) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].balAmt != '' && data[i].balAmt != 0) {
							data[i].stadAmt = data[i].balAmt
						} else {
							data[i].stadAmt = data[i].balAmt
						}
						if (data[i].drCr == '1') {
							data[i].drcrname = '借方'
						} else if (data[i].drCr == '-1') {
							data[i].drcrname = '贷方'
						} else {
							data[i].drcrname = ''
						}
					}
				}
				if ($('#isshowlastyear').is(":checked")) {
					columnsd.push({
						type: 'money',
						edit: false,
						key: 'lastyearDstadAmt',
						name: '上年期末借方',
						width: 150,
						align: 'right'
					})
					columnsd.push({
						type: 'money',
						edit: false,
						key: 'lastyearCstadAmt',
						name: '上年期末贷方',
						width: 150,
						align: 'right'
					})
				}
				page.balData = data;
				$(".uf-fix-top").remove();
				$("#reportTable").html('')
				ufma.showloading('正在刷新列表，请耐心等待...');
				page.rptTable = $('#reportTable').ufmaDataTable({
					ajax: '',
					data: data || null,
					idField: 'chrCode',
					pId: 'pcode',
					columns: columnsd,
					lock: { //行锁定
						class: 'bgc-gray2',
						filter: function (rowdata) {
							return parseInt(rowdata.isLeaf) == 0;
						}
					},
					textIndentFilter: function (rowdata) { //行缩进
						return rowdata.levelNum + 'em';
					},
					callbackDraw: function () {
						//权限判断
						ufma.isShow(page.reslist);
					},
					initComplete: function () {
						$('.ufma-tool-bar button').prop("disabled", false);
						page.callbackDraw();
						ufma.hideloading();
						for (var i = 0; i < newData.length; i++) {
							var trid = 'reportTable_tr_' + newData[i].chrCode
							page.caculateHJ(trid);
						}
					}
				});
			},
			callbackDraw: function () {
				$('#reportTable input[name="stadAmt"]').on('keyup', function (e) {
					e.stopPropagation();
					var $tr = $(this).closest('tr');
					var $td = $(this).closest('td');
					var trid = $tr.attr('id');
					$tr.addClass('edits')
					var textVal = $(this).val();
					if (textVal == '') {
						textVal = 0
					}
					$td.find('.cell-label').html($.formatMoney(textVal));
					page.caculateHJ(trid);

				});

				$('#reportTable input[name="stadAmt"]').on('focus', function (e) {
					e.stopPropagation();
					if ($(this).parents('tr').find('.icon-text-fu').length > 0) {
						$(this).attr("readonly", true);
					}
				});
				$('#reportTable input[name="cstadAmt"]').on('focus', function (e) {
					e.stopPropagation();
					if ($(this).parents('tr').find('.icon-text-fu').length > 0) {
						$(this).attr("readonly", true);
					}
				});
				$('#reportTable input[name="dstadAmt"]').on('keyup', function (e) {
					e.stopPropagation();
					if ($(this).parents('tr').find('.icon-text-fu').length > 0) {
						$(this).attr("readonly", true);
					}
				});
				$('#reportTable input[name="stadAmt"]').on('blur', function (e) {
					e.stopPropagation();
					if ($(this).val() != "") {
						var $tr = $(this).closest('tr');
						var $td = $(this).closest('td');
						var trid = $tr.attr('id');
						$tr.addClass('edits')
						var textVal = $(this).val();
						if (textVal == '') {
							textVal = 0
						}
						$(this).val(parseFloat(textVal).toFixed(2));
						$td.find('.cell-label').html($.formatMoney(textVal));
						page.caculateHJ(trid);
					}
				});
				$('#reportTable input[name="cstadAmt"]').on('keyup', function (e) {
					e.stopPropagation();
					var $tr = $(this).closest('tr');
					var $td = $(this).closest('td');
					var trid = $tr.attr('id');
					$tr.addClass('edits')
					var textVal = $(this).val();
					if (textVal == '') {
						textVal = 0
					}
					$td.find('.cell-label').html($.formatMoney(textVal));
					page.caculateHJ(trid);

				});
				$('#reportTable input[name="cstadAmt"]').on('blur', function (e) {
					e.stopPropagation();
					if ($(this).val() != "") {
						var $tr = $(this).closest('tr');
						var $td = $(this).closest('td');
						var trid = $tr.attr('id');
						$tr.addClass('edits')
						var textVal = $(this).val();
						if (textVal == '') {
							textVal = 0
						}
						$(this).val(parseFloat(textVal).toFixed(2));
						$td.find('.cell-label').html($.formatMoney(textVal));
						page.caculateHJ(trid);
					}
				});
				$('#reportTable input[name="dstadAmt"]').on('keyup', function (e) {
					e.stopPropagation();
					var $tr = $(this).closest('tr');
					var $td = $(this).closest('td');
					var trid = $tr.attr('id');
					$tr.addClass('edits')
					var textVal = $(this).val();
					if (textVal == '') {
						textVal = 0
					}
					$td.find('.cell-label').html($.formatMoney(textVal));
					page.caculateHJ(trid);
				});
				$('#reportTable input[name="dstadAmt"]').on('blur', function (e) {
					e.stopPropagation();
					if ($(this).val() != "") {
						var $tr = $(this).closest('tr');
						var $td = $(this).closest('td');
						var trid = $tr.attr('id');
						$tr.addClass('edits')
						var textVal = $(this).val();
						if (textVal == '') {
							textVal = 0
						}
						$(this).val(parseFloat(textVal).toFixed(2));
						$td.find('.cell-label').html($.formatMoney(textVal));
						page.caculateHJ(trid);
					}
				});
				$('#reportTable input').on('focus', function (e) {
					e.stopPropagation();
					var $tr = $(this).closest('tr');
					var $td = $(this).closest('td');
					var fzBtn = $tr.find('.icon-text-fu');
					if (fzBtn.length > 0) {
						fzBtn.trigger('click');
						$(this).attr("readonly", true);
						$td.find('.cell-label').addClass('allshow')
					}

				});
				$('#reportTable input').on('blur', function (e) {
					$('.money-label').each(function () {
						if ($(this).text() == '0.00') {
							$(this).html('');
						}
					});
				});
				page.setOthInfo();
				page.setBtnEnabled();
				$('#reportTable table thead').attr('id', 'reportTable-head')
				$('td[name="codeName"]').find('.cell-label').css({
					'overflow': 'hidden',
					'text-overflow': 'ellipsis',
					'white-space': 'nowrap'
				})
				$('td[name="codeName"]').find('.cell-label').width($('td[name="codeName"]').eq(i)[0].offsetWidth - 90)
				$('td[name="codeName"]').find('.cell-label').attr('title', $('td[name="codeName"]').eq(i).find('.cell-label').html())
				//顶部浮动
				$("#reportTable-head-fixed-box").remove()
				$('#reportTable table thead').ufFixedShow({
					position: 'top',
					zIndex: 1001, //Z轴
					offset: 0 //偏移
				});
			},
			caculateHJ: function (trid) {
				if (istwostadamt) {
					var $tr = $('#' + trid);
					var pid = $tr.attr('pid');
					if (pid == '') return false;
					var pTrId = 'reportTable_tr_' + pid;
					var cstadAmtHJ = 0.00;
					var dstadAmtHJ = 0.00;
					$('#reportTable tr[pid="' + pid + '"]').each(function () {
						var $cstadAmtInput = $(this).find($('input[name="cstadAmt"]'));
						var $dstadAmtInput = $(this).find($('input[name="dstadAmt"]'));
						var cstadAmt = $cstadAmtInput.val() == "" ? 0 : $cstadAmtInput.val();
						var dstadAmt = $dstadAmtInput.val() == "" ? 0 : $dstadAmtInput.val();
						cstadAmtHJ += parseFloat(parseFloat(cstadAmt).toFixed(2).toString().split('.').join(''));
						dstadAmtHJ += parseFloat(parseFloat(dstadAmt).toFixed(2).toString().split('.').join(''))
					});
					var $cstadAmtInput = $('#' + pTrId + ' input[name="cstadAmt"]');
					var $dstadAmtInput = $('#' + pTrId + ' input[name="dstadAmt"]');

					$cstadAmtInput.val(parseFloat(cstadAmtHJ / 100).toFixed(2));
					$cstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(parseFloat(cstadAmtHJ / 100).toFixed(2)));

					$dstadAmtInput.val(parseFloat(dstadAmtHJ / 100).toFixed(2));
					$dstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(parseFloat(dstadAmtHJ / 100).toFixed(2)));
					page.caculateHJ(pTrId);
				} else {
					var $tr = $('#' + trid);
					var pid = $tr.attr('pid');
					if (pid == '') return false;
					var pTrId = 'reportTable_tr_' + pid;
					var pTrIdtext = $('#' + pTrId + ' td[name="drcrname"]').text();
					var stadAmtHJ = 0.00;
					$('#reportTable tr[pid="' + pid + '"]').each(function () {
						var $cstadAmtInput = $(this).find($('input[name="stadAmt"]'));
						var thistext = $(this).find('td[name="drcrname"]').text();
						var cstadAmt = $cstadAmtInput.val() == "" ? 0 : $cstadAmtInput.val();;
						if (pTrIdtext == thistext) {
							stadAmtHJ += parseFloat(parseFloat(cstadAmt).toFixed(2).toString().split('.').join(''));
						} else {
							stadAmtHJ -= parseFloat(parseFloat(cstadAmt).toFixed(2).toString().split('.').join(''))
						}
					});
					var $cstadAmtInput = $('#' + pTrId + ' input[name="stadAmt"]');

					$cstadAmtInput.val(parseFloat(stadAmtHJ / 100).toFixed(2));
					$cstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(parseFloat(stadAmtHJ / 100).toFixed(2)));
					page.caculateHJ(pTrId);
				}
			},
			delAcco: function (accoCode) {
				ufma.confirm('请确认要删除科目【' + accoCode + '】吗？', function (ac) {
					if (ac) {
						var argu = {};
						argu.action = 'del';
						argu.rgCode = page.pfData.svRgCode;
						argu.setYear = page.pfData.svSetYear;
						argu.agencyCode = page.agencyCode;
						argu.acctCode = page.acctCode;
						argu.accsCode = page.accsCode;
						argu.chrCodes = [accoCode];
						argu.acceCode = ""
						var url = '/ma/sys/coaAcc/delete';
						var callback = function (result) {
							var trid = 'reportTable_tr_' + accoCode;
							$('#' + trid).remove();
							page.getReportData();
							page.initTabs(page.accsCode);
							$(".uf-fix-top").remove();
						}
						ufma.delete(url, argu, callback);
					}

				}, {
					type: 'warning'
				});
			},
			editAcco: function (chrCode, action) {
				$('body').find('.uf-fix-top').each(function () {
					$(this).remove();
				})
				var chrcodecs = chrCode
				$('.uf-fix-top').remove();
				if (action == 'addSub') {
					var argu = {};
					argu["agencyCode"] = page.agencyCode;
					argu["acctCode"] = page.acctCode;
					argu["accsCode"] = page.accsCode;
					argu["chrCode"] = chrCode;
					argu["eleCode"] = 'ACCO';
					ufma.ajaxDef('/ma/sys/common/getMaxLowerCode', 'post', argu, function (result) {
						if (result.data == '下级代码长度超过分级规则上限！') {
							ufma.showTip('下级代码长度超过分级规则上限！', function () { }, 'warning');
						} else {
							chrcodecs = result.data;

						}

					});
				}
				ufma.confirm('科目编辑完成后，将更新期初科目信息，请确认您的录入已保存！', function (ac) {
					if (ac) {
						var argu = {};
						argu.action = action;
						argu.flag = 1; //表示外部调用会计科目编辑页
						argu.rgCode = page.pfData.svRgCode;
						argu.setYear = page.pfData.svSetYear;
						argu.agencyCode = page.agencyCode;
						argu.acctCode = page.acctCode;
						argu.accsCode = page.accsCode;
						argu.chrCode = chrcodecs;
						argu["agencyTypeCode"] = page.agencyTypeCode
						argu["coaccagyAgency"] = true
						ufma.open({
							url: '/pf/ma/coaAcc/coaAccEdit.html',
							title: '编辑会计科目',
							width: 1106,
							height: 465,
							data: argu,
							ondestory: function (rtn) {
								page.getReportData();
								page.initTabs(page.accsCode);
							}
						});
					}

				}, {
						type: 'warning'
					});
			},
			editAss: function (accoCode, assData, drCr, allowSurplus, isShowBill, expireDate, chrId, rowdata) {
				$('body').find('.uf-fix-top').remove();
				var trid = 'reportTable_tr_' + accoCode;

				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				var fzhsdata = {
					agencyCode: page.cbAgency.getValue(),
					acctCode: page.cbAcct.getValue(),
					accoCode: rowdata.chrCode,
					acceCode: rowdata.acceCode,
					isTemp: rowdata.isTemp
				}
				var oldData;
				if (page.fzhsObj[trid] != undefined) {
					oldData = page.fzhsObj[trid]
				} else {
					oldData = page.fzhsObj[trid] || assData
				}
				var data = {
					'agencyCode': agencyCode,
					'acctCode': acctCode,
					'accoCode': accoCode,
					'isDrCr': istwostadamt,
					'fzData': JSON.stringify(oldData),
					'drCr': drCr,
					'allowSurplus': allowSurplus,
					'isShowBill': isShowBill,
					'expireDate': expireDate,
					'chrId': chrId,
					'isClosed': page.isClosed,
					'isCur': rowdata.isCur,
					'isQty': rowdata.isQty,
					'defCurCode': rowdata.defCurCode,
					'qtyDigits': rowdata.qtyDigits
				}
				ufma.open({
					url: 'kmfzhs.html',
					title: '辅助核算项信息',
					width: 1200,
					height: 500,
					data: data,
					ondestory: function (rtn) {
						if (rtn.action == 'ok') {
							var data = rtn.result;
							if (istwostadamt) {
								page.fzhsObj[trid] = data.data;
								page.fzhsTmp[trid] = data.tmpData;
								var $cstadAmtInput = $('#' + trid).find($('input[name="cstadAmt"]'));
								var $dstadAmtInput = $('#' + trid).find($('input[name="dstadAmt"]'));
								$cstadAmtInput.val(data.camt);
								$cstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(data.camt));
								$dstadAmtInput.val(data.damt);
								$dstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(data.damt));

								//							}
								page.caculateHJ(trid);
							} else {
								page.fzhsObj[trid] = data.data;
								page.fzhsTmp[trid] = data.tmpData;
								page.rptTable.data[trid]['drCr'] = data.drCr
								var $cstadAmtInput = $('#' + trid).find($('input[name="stadAmt"]'));
								$cstadAmtInput.val(data.amt);
								$cstadAmtInput.closest('td').find('.cell-label').html($.formatMoney(data.amt));
								page.caculateHJ(trid);
							}
						}

					}
				});
			},
			setOthInfo: function () {
				var count = $('#reportTable tr').length - 1;
				$('.ufma-tool-bar .info').html('共 ' + count + ' 条');
			},
			showAcce: function (acceCode) {
				ufma.showloading();
				var idBof = 'reportTable_tr_' + acceCode;
				$('#reportTable tbody tr[id^="' + idBof + '"]').removeClass('hide');
				$('#reportTable tbody tr:not([id^="' + idBof + '"])').addClass('hide');
				$(".ufma-tool-bar").parents('.uf-fix-bottom').addClass('bottom0')
				ufma.hideloading();
			},

			initTabs: function (accsCode) {
				page.accsCode = accsCode;
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				var argu = {
					'agencyCode': agencyCode,
					'acctCode': acctCode,
					'accsCode': accsCode
				};
				//console.log(argu);
				var url = '/gl/sys/eleAcce/getAcceList';
				ufma.showloading('正在获取数据，请耐心等待...');

				$('#tabAcce').html('');
				$('#tabAcce').append('<li class="active"><a href="javascript:;" data-status="">全部</a></li>');
				var callback = function (result) {
					for (var i = 0; i < result.data.length; i++) {
						tab = result.data[i];
						$('#tabAcce').append('<li><a href="javascript:;" data-status="' + tab.chrCode + '">' + tab.chrName + '</a></li>');
					}
					$('#tabAcce li.active').trigger('click');
				}
				ufma.get(url, argu, callback);
			},
			initAgencyScc: function () {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function (data) {
						ufma.ajaxDef("/gl/vou/getSysRuleSet/" + page.cbAgency.getValue() + "?chrCodes=GL022,GL027", 'get', "", function (data) {
							isshowbtns = data.data.GL022
							istwostadamt = data.data.GL027
						})
						agencyName = data.name
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: agencyName,
							selAcctCode: page.cbAcct.getValue(),
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						page.agencyTypeCode = data.agencyType
						var url = '/gl/eleCoacc/getRptAccts';
						var callback = function (result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var jumpAcctCode = page.getUrlParam("jumpAcctCode");
							if (!$.isNull(jumpAcctCode)) {
								page.cbAcct.val(jumpAcctCode);
							} else {
								var svFlag = $.inArrayJson(result.data, "code", page.pfData.svAcctCode);
								if (svFlag != undefined) {
									page.cbAcct.val(page.pfData.svAcctCode);
								} else {
									if (result.data.length > 0) {
										page.cbAcct.val(result.data[0].code);
									} else {
										page.cbAcct.val('');
									}
								}
							}
						}
						ufma.ajaxDef(url, 'get', {
							'userId': page.pfData.svUserId,
							'setYear': page.pfData.svSetYear,
							'agencyCode': data.id
						}, callback);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", page.pfData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(page.pfData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			setBtnEnabled: function () {
			},
			initPage: function () {
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function (data) {
						if (data.isParallel == 1 && data.isDoubleVou == 0) {
							page.isDoubleVou = 0
						} else {
							page.isDoubleVou = 1
						}
						acctName = data.name
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: agencyName,
							selAcctCode: page.cbAcct.getValue(),
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						ufma.showloading('正在加载数据，请耐心等待...');
						$('#curAcct').html(data['name']);
						page.agencyCode = page.cbAgency.getValue();
						page.acctCode = page.cbAcct.getValue();
						page.initTabs(data.accsCode);
						$(".uf-fix-top").remove();
						page.getReportData();
						page.fzhsObj = {}
						page.fzhsTmp = {}
					},
					initComplete: function (sender) {

					}
				});

				this.initAgencyScc();

			},
			getAcceHJJE: function getJE(acceCode) {
				var amtCr = 0.00;
				var amtDr = 0.00;
				var idBof = 'reportTable_tr_' + acceCode;
				$('#reportTable tr:not(.locked)[id^="' + idBof + '"]').each(function (irow) {
					var trid = $(this).attr('id');
					var rowTrData = page.rptTable.getTrData(trid);
					var rowData = page.rptTable.getData(trid);
					accoCode = $.bof(rowTrData.codeName, ' ');
					if (istwostadamt) {
						var cstadAmt = rowTrData.cstadAmt.toString().split(',').join('');
						var dstadAmt = rowTrData.dstadAmt.toString().split(',').join('');
						if (accoCode != '') {
							if (Math.abs(parseFloat(cstadAmt)) > 0) {
								var now = parseFloat(parseFloat(cstadAmt.toString().split('.').join('')).toFixed(2))
								var old = parseFloat(parseFloat(amtCr.toString().split('.').join('')).toFixed(2))
								amtCr = parseFloat((old + now) / 100).toFixed(2);
							}
							if (Math.abs(parseFloat(dstadAmt)) > 0) {
								var now = parseFloat(parseFloat(dstadAmt.toString().split('.').join('')).toFixed(2))
								var old = parseFloat(parseFloat(amtDr.toString().split('.').join('')).toFixed(2))
								amtDr = parseFloat((old + now) / 100).toFixed(2);
							}
						}
					} else {
						var voustadAmt = rowTrData.stadAmt.toString().split(',').join('');
						if (Math.abs(parseFloat(voustadAmt)) > 0) {
							if (rowData.drCr == -1) {
								var now = parseFloat(parseFloat(voustadAmt.toString().split('.').join('')).toFixed(2))
								var old = parseFloat(parseFloat(amtCr.toString().split('.').join('')).toFixed(2))
								amtCr = parseFloat((old + now) / 100).toFixed(2);
							} else {
								var now = parseFloat(parseFloat(voustadAmt.toString().split('.').join('')).toFixed(2))
								var old = parseFloat(parseFloat(amtDr.toString().split('.').join('')).toFixed(2))
								amtDr = parseFloat((old + now) / 100).toFixed(2);
							}
						}
					}
				});
				return {
					'amtCr': amtCr,
					'amtDr': amtDr
				};
			},
			doShisuan: function () {

				page.shisuanData = [];
				$('#tabAcce li a').each(function () {
					var acce = {};
					var acceCode = $(this).attr('data-status');
					if (acceCode != '') {
						acceName = $(this).text();
						var acceData = page.getAcceHJJE(acceCode);
						acce = {
							'acceCode': acceCode,
							'acceName': acceName,
							'amtDr': acceData['amtDr'],
							'amtCr': acceData['amtCr']
						};
						page.shisuanData.push(acce);
					}

				});
				//return shisuanData1;
			},
			save: function (op) {
				//				$('.ufma-tool-bar button').prop("disabled", true);
				$('#tabAcce').find('li').eq(0).trigger('click')
				//				setTimeout(function(){
				//					$('.ufma-tool-bar button').prop("disabled", false);
				//				},5000)
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				var vouGuid = page.vouGuid;
				var url = '/gl/initial/saveInitial';
				if (op == 1) {
					vouGuid = page.vouGuidTmp;
					url = '/gl/initial/saveInitialTmp';
				}
				var voucher = [{
					"vouGuid": vouGuid,
					"op": op || 0, //0保存，1暂存
					"acctCode": acctCode, //账套号 
					"agencyCode": agencyCode, //单位
					"amtCr": 0, //贷方合计
					"amtDr": 0, //借方合计
					'setYear': page.pfData.svSetYear,
					'rgCode': page.pfData.svRgCode
				}, {
					"vouGuid": vouGuid,
					"op": op || 0, //0保存，1暂存
					"acctCode": acctCode, //账套号 
					"agencyCode": agencyCode, //单位
					"amtCr": 0, //贷方合计
					"amtDr": 0, //借方合计
					'setYear': page.pfData.svSetYear,
					'rgCode': page.pfData.svRgCode

				}];
				var vouDetails = [
					[],
					[]
				];
				var amtCrArr = [0.00, 0.00];
				var amtDrArr = [0.00, 0.00];
				var vouSeqArr = [0, 0];
				var bHasChange = false;
				$('#reportTable tr:not(.locked)').each(function (row) {
					var trid = $(this).attr('id');
					var rowTrData = page.rptTable.getTrData(trid);
					var rowData = page.rptTable.getData(trid);
					var rowDatavouDetAss;
					if (rowData != undefined && rowData.vouDetAss.length != 0) {
						rowDatavouDetAss = rowData.vouDetAss;
					}
					var vou = {};
					vou.accoCode = $.bof(rowTrData.codeName, ' ');
					var cstadAmt = (rowTrData.cstadAmt == '' ? '0' : rowTrData.cstadAmt);
					var dstadAmt = (rowTrData.dstadAmt == '' ? '0' : rowTrData.dstadAmt);
					cstadAmt = commafyback(cstadAmt)
					dstadAmt = commafyback(dstadAmt)
					var vouDetailAsss = page.fzhsObj[trid] || rowDatavouDetAss;
					vou.drCr = rowTrData.drCr
					if (!$.isNull(vouDetailAsss)) {
						if (op == 1) {
							vou.detailAssTems = JSON.parse(JSON.stringify(vouDetailAsss));
						} else {
							vou.vouDetailAsss = JSON.parse(JSON.stringify(vouDetailAsss));
						}
					}
					if (istwostadamt) {
						if (vou.accoCode != '') {
							if (Math.abs(parseFloat(cstadAmt)) > 0 || Math.abs(parseFloat(dstadAmt)) > 0) {
								bHasChange = true;
								vou.cstadAmt = cstadAmt;
								vou.dstadAmt = dstadAmt;
								amtCrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtCrArr[(rowData.accaCode - 1)]*100)+ (cstadAmt*100))/100).toFixed(2));
								amtDrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtDrArr[(rowData.accaCode - 1)]*100) + (dstadAmt*100))/100).toFixed(2));
								vou.vouSeq = vouSeqArr[(rowData.accaCode - 1)];
								vou.accaCode = rowData.accaCode;
								vouDetails[(rowData.accaCode - 1)].push(vou);
							}
						}
					} else {
						var voustadAmt = rowTrData.stadAmt == '' ? '0' : rowTrData.stadAmt;
						voustadAmt = commafyback(voustadAmt)
						if (voustadAmt == '') {
							voustadAmt = 0
						}
						if (vou.accoCode != '') {
							vou.drCr = 0;
							if (Math.abs(parseFloat(voustadAmt)) > 0) {
								if (rowData.drCr == -1) {
									vou.drCr = -1;
									vou.stadAmt = voustadAmt;
									// amtCrArr[(rowData.accaCode - 1)] += parseFloat(voustadAmt);
									amtCrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtCrArr[(rowData.accaCode - 1)]*100)+ (voustadAmt*100))/100).toFixed(2));
								
								} else {
									vou.drCr = 1;
									vou.stadAmt = voustadAmt;
									// amtDrArr[(rowData.accaCode - 1)] += parseFloat(voustadAmt);
									amtDrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtDrArr[(rowData.accaCode - 1)]*100) + (voustadAmt*100))/100).toFixed(2));
								}
							} else if (vou.vouDetailAsss != undefined && vou.vouDetailAsss.length > 0) {
								if (rowData.drCr == -1) {
									vou.drCr = -1;
									vou.stadAmt = voustadAmt;
									amtCrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtCrArr[(rowData.accaCode - 1)]*100)+ (voustadAmt*100))/100).toFixed(2));
								} else {
									vou.drCr = 1;
									vou.stadAmt = voustadAmt;
									amtDrArr[(rowData.accaCode - 1)] = parseFloat(parseFloat(((amtDrArr[(rowData.accaCode - 1)]*100) + (voustadAmt*100))/100).toFixed(2));
								}
							}
							if (vou.drCr != 0) {
								vouSeqArr[(rowData.accaCode - 1)] = vouSeqArr[(rowData.accaCode - 1)] + 1;
								vou.vouSeq = vouSeqArr[(rowData.accaCode - 1)];
								vou.accaCode = rowData.accaCode;
								vouDetails[(rowData.accaCode - 1)].push(vou);
							}
						}
					}
				})
				if (vouDetails[1].length > 0) {
					if (voucher[1] != undefined) {
						voucher[1].amtDr = parseFloat(parseFloat(amtDrArr[1]).toFixed(2));
						voucher[1].amtCr = parseFloat(parseFloat(amtCrArr[1]).toFixed(2));
						voucher[1].accaCode = "2"; //预算会计
						if (op == 1) {
							voucher[1].vouDetailTems = vouDetails[1];
						} else {
							voucher[1].vouDetails = vouDetails[1];
						}
					}
				} else {
					voucher.splice(1, 1);
				}
				if (vouDetails[0].length > 0) {
					if (voucher[0] != undefined) {
						voucher[0].amtDr = parseFloat(parseFloat(amtDrArr[0]).toFixed(2));
						voucher[0].amtCr = parseFloat(parseFloat(amtCrArr[0]).toFixed(2));
						voucher[0].accaCode = "1"; //财务会计
						if (op == 1) {
							voucher[0].vouDetailTems = vouDetails[0];
						} else {
							voucher[0].vouDetails = vouDetails[0];
						}
					}
				} else {
					voucher.splice(0, 1);
				}
				var isClean = false
				if (vouDetails[1].length == 0 && vouDetails[0].length == 0) {
					voucher = [{
						"vouGuid": vouGuid,
						"op": op || 0, //0保存，1暂存
						"acctCode": acctCode, //账套号 
						"agencyCode": agencyCode, //单位
						"amtCr": 0, //贷方合计
						"amtDr": 0, //借方合计
						'setYear': page.pfData.svSetYear,
						'rgCode': page.pfData.svRgCode
					}]
					isClean = true
				}
				var callback = function (result) {
					$('body').find('.uf-fix-top').each(function () {
						$(this).remove();
					})
					page.getReportData();
					page.initTabs(page.accsCode);
					ufma.hideloading();
					if (op == 1) {
						ufma.showTip('暂存成功！', function () { }, 'success');
					} else if (op == 0) {
						ufma.showTip('保存成功！', function () { }, 'success');
					}
				};
				if (op == 0 && parseFloat(amtDrArr[0]).toFixed(2) != parseFloat(amtCrArr[0]).toFixed(2)) {
					ufma.confirm("财务会计借贷不平衡,是否保存", function (action) {
						if (action) {
							if (op == 1) {
								ufma.showloading('正在暂存期初余额，请耐心等待...');
							} else if (op == 0) {
								ufma.showloading('正在保存期初余额，请耐心等待...');
							}
							ufma.post(url, {
								"voucher": voucher,
								"acctCode": acctCode, //账套号 
								"agencyCode": agencyCode, //单位
								'setYear': page.pfData.svSetYear,
								'rgCode': page.pfData.svRgCode,
								'isClean': isClean,
								'isAccrual': istwostadamt
							}, callback);
						}
					})
				} else if (op == 0 && parseFloat(amtDrArr[1]).toFixed(2) != parseFloat(amtCrArr[1]).toFixed(2)) {
					ufma.confirm("预算会计借贷不平衡,是否保存", function (action) {
						if (action) {
							if (op == 1) {
								ufma.showloading('正在暂存期初余额，请耐心等待...');
							} else if (op == 0) {
								ufma.showloading('正在保存期初余额，请耐心等待...');
							}
							ufma.post(url, {
								"voucher": voucher,
								"acctCode": acctCode, //账套号 
								"agencyCode": agencyCode, //单位
								'setYear': page.pfData.svSetYear,
								'rgCode': page.pfData.svRgCode,
								'isClean': isClean,
								'isAccrual': istwostadamt
							}, callback);
						}
					})
				} else {
					if (op == 1) {
						ufma.showloading('正在暂存期初余额，请耐心等待...');
					} else if (op == 0) {
						ufma.showloading('正在保存期初余额，请耐心等待...');
					}
					ufma.post(url, {
						"voucher": voucher,
						"acctCode": acctCode, //账套号 
						"agencyCode": agencyCode, //单位
						'setYear': page.pfData.svSetYear,
						'rgCode': page.pfData.svRgCode,
						'isClean': isClean,
						'isAccrual': istwostadamt
					}, callback);
				}
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			onEventListener: function () {
				$('#btn-save').click(function () {
					$(".btn-save").prop("disabled", true);//点击保存后先禁用保存功能
					ufma.showloading('正在保存凭证，请耐心等待...');
					if (page.isClosed) {
						isChange = false
						$("#issavetemp").prop('checked', false)
						isChange = true
						page.save(0);
						setTimeout(function () {
							$('.ufma-tool-bar button').prop("disabled", false);
							ufma.hideloading();
						}, 5000)
					} else {
						ufma.showTip('已经结账期初余额的无法保存')
						ufma.hideloading()
					}
				});
				$('#btn-save-tmp').click(function () {
					$(".btn-save-tmp").prop("disabled", true);//点击暂存后先禁用保存功能
					ufma.showloading('正在保存凭证，请耐心等待...');
					if (page.isClosed) {
						isChange = false
						$("#issavetemp").prop('checked', true)
						isChange = true
						page.save(1);
						setTimeout(function () {
							$('.ufma-tool-bar button').prop("disabled", false);
							ufma.hideloading();
						}, 5000)
					} else {
						ufma.showTip('已经结账期初余额的无法暂存')
						ufma.hideloading()
					}
				});
				$('#btnShiShuan').on('click', function (e) {
					e.stopPropagation();
					page.doShisuan();
					ufma.open({
						url: 'shisuan.html',
						title: '试算平衡',
						width: 1000,
						//height:300,
						data: {
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode,
							"data": page.shisuanData,
							"isClosed": page.isClosed
						},
						ondestory: function (result) {
							if (result.action == 'save') {
								if ($("#issavetemp").is(':checked')) {
									page.save(1);
								} else {
									page.save(0);
								}
							};
						}
					});

				});
				$('#tabAcce').on('click', 'li', function () {
					var acceCode = $(this).find('a').attr('data-status');
					page.showAcce(acceCode);
				});

				page.exportColumns = [
					[{
						type: 'indexcolumn',
						field: '',
						name: '序号',
						width: 50,
						align: 'center'
					},
					{
						field: 'codeName',
						name: '科目名称',
						render: function (rowid, rowdata, data) {
							return '<span style="display:inline-block;text-indent:' + rowdata.levelNum + 'em">' + data + '</span>';
						}
					},
					{
						field: 'currency',
						name: '币种/数量',
						width: 200
					},
					{
						field: 'dstadAmt',
						name: '期初借方',
						width: 200,
						align: 'right',
						render: function (rowid, rowdata, data) {
							var text = $.formatMoney(data, 2);
							if (text == '0.00') text = '';
							return text;
						}
					},
					{
						field: 'cstadAmt',
						name: '期初贷方',
						width: 200,
						align: 'right',
						render: function (rowid, rowdata, data) {
							var text = $.formatMoney(data, 2);
							if (text == '0.00') text = '';
							return text;
						}
					}
					]
				];
				$('.btn-print').click(function () {
					var printCache = {};
					printCache.agencyCode = page.cbAgency.getValue();
					printCache.acctCode = page.cbAcct.getValue();
					printCache.componentId = "GL_VOU"
					printCache.tmplCode = 'cwy8000qc';
					ufma.post("/gl/vouPrint/getQcPrtData", printCache, function (result) {
						if (result.data.data.length > 1) {
							var groupDef = JSON.stringify([{ "gl_voucher_ds1": result.data.data[0] }, { "gl_voucher_ds1": result.data.data[1] }])
							getPdf('cwy8000qc', '*', groupDef)
						} else if (result.data.data.length > 0) {
							var groupDef = JSON.stringify([{ "gl_voucher_ds1": result.data.data[0] }])
							getPdf('cwy8000qc', '*', groupDef)
						} else {
							ufma.showTip("暂无可打印数据", function () { }, 'warning')
						}
					});
				})
				$('.btn-export').click(function () {
					window.location.href = "/gl/initial/exportQcData?setYear=" + page.pfData.svSetYear + '&rgCode=' + page.pfData.svRgCode + '&agencyCode=' + page.cbAgency.getValue() + '&acctCode=' + page.cbAcct.getValue();
				});
				$('#btn-upload').click(function () {
					$('#upmodal').trigger('click')
				})

				$(document).on('change', '#issavetemp', function () {
					if (isChange) {
						$(".uf-fix-top").remove();
						page.getReportData();
						page.fzhsObj = {}
						page.fzhsTmp = {}
					}
				})
				$(document).on('change', '#upmodal', function () {
					if (isChange) {
						ufma.confirm('是否上传文件', function (action) {
							if (action) {
								$('#rgCodes').val(page.pfData.svRgCode)
								$('#agencyCodes').val(page.cbAgency.getValue())
								$('#acctCodes').val(page.cbAcct.getValue())
								$('#setYears').val(page.pfData.svSetYear)
								$.ajax({
									url: '/gl/initial/uploadExcelInitial',
									type: 'POST',
									cache: false,
									data: new FormData($('#upmodaldata')[0]),
									processData: false,
									contentType: false
								}).done(function (res) {
									if (res.flag == "success") {
										if ($.isNull(page.vouGuid)) {
											page.repaintTable(res.data)
											ufma.showTip(res.msg, function () { }, "success");
											$('#tabAcce li').eq(0).trigger('click');
											var file = $("#upmodal");
											file.after(file.clone().val(""));
											file.remove();
										} else {
											ufma.confirm('是否覆盖原先数据', function (action) {
												if (action) {
													page.repaintTable(res.data)
													ufma.showTip(res.msg, function () { }, "success");
													$('#tabAcce li').eq(0).trigger('click');
													var file = $("#upmodal");
													file.after(file.clone().val(""));
													file.remove();
												}
											})
										}
									} else {
										ufma.showTip(res.msg, function () { }, "error");
										var file = $("#upmodal");
										file.after(file.clone().val(""));
										file.remove();
									}
								}).fail(function (res) {
									ufma.showTip(res.msg, function () { }, "error");
									var file = $("#upmodal");
									file.after(file.clone().val(""));
									file.remove();
								});
							}
						})
					}

				})
				$('#btn-dowload').click(function () {
					window.location.href = "/gl/initial/getExcelTemplate?setYear=" + page.pfData.svSetYear + '&rgCode=' + page.pfData.svRgCode + '&agencyCode=' + page.cbAgency.getValue() + '&acctCode=' + page.cbAcct.getValue();
				})
			},
			//此方法必须保留
			init: function () {
				ufma.parse();
				var agencyCode = $.getUrlParam('agencyCode');
				var acctCode = $.getUrlParam('acctCode');
				var setYear = $.getUrlParam('setYear');

				if ($.isNull(agencyCode) || $.isNull(acctCode)) {
					page.pfData = ufma.getCommonData();
				} else {
					page.pfData = $.extend(true, ufma.getCommonData(), {
						"svAgencyCode": agencyCode,
						"svAcctCode": acctCode,
						"svSetYear": setYear
					});
				}

				//获取权限数据
				page.reslist = ufma.getPermission();

				this.initPage();

				this.onEventListener();

				$(".ufma-tool-bar").ufFixedShow({
					position: 'bottom',
					zIndex: 1000, //Z轴
					offset: 0 //偏移
				});
			}
		}
	}();
	/////////////////////
	page.init();
	$(document).on('change', '#isshowlastyear', function () {
		page.getReportData();
	})
});
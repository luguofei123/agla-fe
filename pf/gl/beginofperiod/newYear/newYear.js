$(function() {

	var page = function() {
		return {
			sysData: {},
			accsCode: '', //科目体系代码
			vouGuid: '',
			vouGuidTmp: '',
			fzhsObj: {},
			initAgencyScc: function() {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					onchange: function(data) {
						//console.log(data);
						var url = '/gl/eleCoacc/getCoCoaccs/' + data.id;
						callback = function(result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data,

								initComplete: function(sender) {
									page.cbAcct.setValue(page.pfData.svAcctCode, page.pfData.svAcctName);
								}
							});
						}

						ufma.get(url, {}, callback);
					},
					initComplete: function(sender) {
						page.cbAgency.val(page.pfData.svAgencyCode);
					}
				});
			},
			editAgencyBase: function() {
				var url = '';
				var argu = '';
				var callback = function(result) {
					var data = result.data;
					$('#newYearBase').DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"data": result.data,
						"bPaginate": false, //翻页功能
						"bLengthChange": false, //改变每页显示数据数量
						"bFilter": false, //过滤功能
						"bSort": false, //排序功能
						"bInfo": false, //页脚信息
						"bAutoWidth": false, //自动宽度
						"columnDefs": [{
								"targets": [1],

								"render": function(data, type, rowdata, meta) {
									var textIndent = '0';
									if(rowdata.levelNum) {
										textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
									}
									var alldata = JSON.stringify(rowdata);
									return '<a style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
								}
							},
							{
								"targets": [2],
								"render": function(data, type, rowdata, meta) {
									if(rowdata.enabled == 1) {
										return '<span style="color:#00A854">' + data + '</span>';
									} else {
										return '<span style="color:#F04134">' + data + '</span>';
									}

								}
							},
							{
								"targets": [-1],
								"className": "text-center nowrap btnGroup",
								"render": function(data, type, rowdata, meta) {
									var active = rowdata.enabled == 1 ? 'hidden' : '';
									var unactive = rowdata.enabled == 0 ? 'hidden' : '';
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + data + '" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用">' +
										'<span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm  btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用">' +
										'<span class="glyphicon glyphicon icon-ban"></span></a>';
								}
							}
						],
					});

					//权限判断
					ufma.isShow(page.reslist);

				}
				ufma.get(url, argu, callback);
			},
			checkNewYear: function() { //检查新年度
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				if(agencyCode == '' || acctCode == '') {
					ufma.alert('请选择单位和账套！', 'warning');
					return false;
				}
				ufma.showloading();
				var url = '/gl/newAgencySetInit/initAgencyCheck/' + agencyCode + '/' + acctCode;
				var argu = {};
				$('#checkList li').remove();
				var callback = function(result) {
					page.iErrorNum = 0;
					$.each(result.data, function(idx, item) {
						var checkRs = '<span class="ufma-green float-right">检查通过</span>';
						switch(item.status) {
							case 'Y':
								checkRs = '<span class="ufma-green float-right">检查通过</span>';
								break;
							case 'N':
								page.iErrorNum = page.iErrorNum + 1;
								checkRs = '<span class="ufma-red float-right">检查未通过</span>';
								break;
							case 'W':
								checkRs = '<span class="ufma-yellow float-right">警告</span>';
								break;
						}
						var script = ufma.parseNull(item.desc);
						if(item.url != '') {
							script = '<a href="javascript:window.parent.openNewMenu($(this));" data-href="' + item.url + '" data-title="' + item.ruleName + '">' + script + '</a>'
						}
						var html = '<li class="">' +
							'<div><span class="icon icon-check-circle ufma-green margin-right-8"></span><span class="">' + item.ruleName + '</span>' + checkRs + '</div>' +
							'<div class="padding-left-15 margin-left-8"><span class="ufma-gray">' + script + '</span></div>' +
							'</li>';
						$(html).appendTo('#checkList').trigger('create');
					});
					if(result.data.length == 0) {
						$('<li class="h50 tc">未设置检查项！</li>').appendTo('#checkList').trigger('create');
					}
					ufma.hideloading();
				}
				ufma.get(url, argu, callback);
			},
			initAccoYe: function() {
				ufma.showloading('正在获取数据，请耐心等待...');
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();

				var url = '/gl/newAgencySetInit/getQc/' + agencyCode + '/' + acctCode;
				var callback = function(result) {
					var data = result.data;
					page.initCurYear(data);
				}
				ufma.get(url, {}, callback);
			},
			newTableRow: function(row) {
				var drcr = row.drcr == 0 ? '借' : '贷';

				var trid = 'accoYeb_row_' + row.chrCode;
				var $tr = $('<tr id="' + trid + '" pid="' + row.pcode + '"></tr>');
				if(row.isLeaf == '0') {
					$tr.addClass('locked bgc-gray2');
				}
				$('<td></td>').appendTo($tr);
				var $codeNameTd = $('<td></td>').appendTo($tr);
				$('<div class="cell-label" style="text-indent:' + row.levelNum + 'em">' + row.codeName + '</div>').appendTo($codeNameTd);
				if(row.isAss != '0') {
					$tr.addClass('bgc-sky');
					var $fzbtn = $('<span class="absolute icon-text-fu ufma-yellow font-size-24" style="top:-1px;right:-2px"></span>').appendTo($codeNameTd);
					$fzbtn.click(function() {
						page.viewFZHS(row.chrCode, 'edit');
					});
				}
				$('<td>' + drcr + '</td>').appendTo($tr);
				var amt = row.dstadAmt;
				amt = ufma.parseFloat(amt);
				var $amtTd = $('<td></td>').appendTo($tr);
				$('<div dstadamt_label="" class="cell-label money-label" style="text-align:right;">' + $.formatMoney(amt, 2) + '</div>').appendTo($amtTd);
				if(row.isLeaf == '1') {
					$amtTd.addClass('cell-edit');
					$('<div class="cell-control"><input dstadamt_input="" class="cell-input" type="text" name="dstadAmt" value="' + amt + '"></div>').appendTo($amtTd);
				}

				$('<td class="prevYearAcco"></td>').appendTo($tr);
				$('<td class="prevYearAmt"></td>').appendTo($tr);
				return $tr;
			},
			initCurYear: function(data) {
				var columns = [
					[{ type: 'indexcolumn', field: '', name: '序号', width: 40, rowspan: 2 },
						{ field: '', name: '<span class="newYear">2018</span>年', colspan: 3 },
						{ field: '', name: '<span class="curYear">2017</span>年', colspan: 2 }
					],
					[{
							field: 'codeName',
							name: '会计科目',
							width: 240,
							align: 'left',
							render: function(rowid, rowdata, data) {
								var text = '<span class="ib" style="text-indent:' + rowdata.levelNum + 'em;">' + data + '</span>';
								if(rowdata.isAss == 1) {
									text = text + '<span class="icon-text-fu f24 ufma-yellow pa t0 r0"></span>';
								}
								return text;
							}
						},
						{
							field: 'drCr',
							name: '方向',
							width: 60,
							headalign: 'center',
							align: 'center',
							render: function(rowid, rowdata, data) {
								return data == 1 ? '借' : '贷';
							}
						},
						{
							type: 'money',
							field: 'stadAmt',
							name: '年初数',
							width: 100,
							align: 'right',
							render: function(rowid, rowdata, data) {
								var amt = $.formatMoney(data, 2);
								if(amt == '0.00') amt = '';
								return amt;
							},
							onKeyup: function(e) {
								e.event.stopPropagation();
								page.caculateHJ(e.rowId);
							}
						},
						{ field: 'prevAccoName', name: '会计科目', width: 240, align: 'left' },
						{
							field: 'prevAmt',
							name: '余额',
							width: 100,
							align: 'right',
							render: function(rowid, rowdata, data) {
								return $.formatMoney(data, 2);
							}
						}
					]
				];
				$('#accoYeb').ufDatagrid({
					idField: 'chrCode',
					pId: 'pId',
					data: [],
					disabled: false, //可选择		
					columns: columns,
					initComplete: function(options, data) {

					},
					lock: { //行锁定
						class: 'bgc-gray2',
						filter: function(rowdata) {
							return rowdata.isLeaf == 0;
						}
					}
				});
				$('#accoYeb').getObj().load(data);
				ufma.hideloading();
				page.initPrevYear(data);
			},
			caculateHJ: function(trid) {
				var $tr = $('#accoYebBody .uf-grid-body-view tbody').find('tr[id="' + trid + '"]');
				var pid = $tr.attr('pid');
				if(pid == '0') return false;
				var pTrId = 'accoYeb_row_' + pid;
				var $pTr = $('#accoYebBody .uf-grid-body-view tbody').find('tr[id="' + pTrId + '"]');
				var amtHJ = 0.00;
				var $trGroup = $('#accoYebBody .uf-grid-body-view tbody tr[pid="' + pid + '"]');
				if($trGroup.length == 0) return false;
				$trGroup.each(function(idx) {
					var amtCell = $(this).find('td:eq(3)').text();
					var reg = new RegExp(",", "g");
					amtCell = amtCell.replace(reg, '');
					amtHJ += ufma.parseFloat(amtCell);
				});
				$pTr.find('td:eq(3)').html($.formatMoney(amtHJ, 2));
				page.caculateHJ(pTrId);
			},
			initPrevYear: function(data) {
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();

				/*				agencyCode = '001';
								acctCode = '1001';*/
				var url = '/gl/newAgencySetInit/getYearEndBal/' + agencyCode + '/' + acctCode;
				var callback = function(result) {
					var data = result.data;
					//console.log(data);
					var $tbody = $('#accoYebBody .uf-grid-body-view tbody');
					for(var i = 0; i < data.length; i++) {
						var row = data[i];
						var trid = 'accoYeb_row_' + row.chrCode;
						var $tr = $tbody.find('tr[id="' + trid + '"]');
						if($tr.length == 0) { //不存在添加新行
							$tr = page.newTableRow(row);
							$tr.find('td:eq(1)').html('');
							$tr.find('td:eq(2)').html('');
							$tr.find('td:eq(3)').html('');
						}
						var $codeNameTd = $tr.find('td:eq(4)');
						$('<span class="ib" style="text-indent:' + row.levelNum + 'em">' + row.codeName + '</span>').appendTo($codeNameTd);
						if(row.isAss != '0') {
							$tr.addClass('bgc-sky');
							var $fzbtn = $('<span class="absolute icon-text-fu ufma-yellow font-size-24" style="top:-1px;right:-2px"></span>').appendTo($codeNameTd);
							$fzbtn.click(function() {
								page.viewFZHS(row.chrCode, 'view');
							});
						}

						var amt = ufma.parseFloat(row.dstadAmt);
						amt = $.formatMoney(amt, 2);
						if(amt == '0.00') amt = '';
						$tr.find('td:eq(5)').html(amt);
						var curAmt = $tr.find('td:eq(3)').text();
						if(curAmt == '') {
							$tr.find('td:eq(3)').html(amt);
						}
					}

					$('#tAccoYe tbody tr').each(function(idx) {
						$(this).find('td:eq(0)').html(idx + 1);
					});
					ufma.hideloading();
				}
				ufma.get(url, {}, callback);
			},
			viewFZHS: function(accoCode, action) {
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();

				var data = {
					'agencyCode': agencyCode,
					'acctCode': acctCode,
					'accoCode': accoCode,
					'action': action
				}
				ufma.open({
					url: '../initialBal/kmfzhs.html',
					title: '辅助核算项信息',
					width: 800,
					height: 400,
					data: data,
					ondestory: function(rtn) {
						var data = rtn.result;
						console.log(data);
					}
				});
			},
			transSysBaseInfo: function(data) {
				if(data.length == 0) {
					ufma.alert('请选择基础资料！');
					return false;
				}
				var url = ''; //生成基础资料接口
				var argu = data;
				var callback = function(result) {
					console.log(result);
					ufma.showTip('新年度基础资料初始化操作成功！', function() {}, 'success');
					page.qrySysBaseInfo();

				};
				ufma.post(url, argu, callback);
			},
			initNewYearBaseTbl: function() {
				var columns = [
					[
						{ field: 'eleName', name: '基础资料' },
						{
							field: 'isGen',
							name: '结转状态',
							headalign: 'center',
							align: 'center',
							render: function(rowid, rowdata, data) {
								if(data == 'N') {
									return '<span class="uf-red">未结转</span>';
								} else {
									return '<span class="uf-green">已结转</span>';
								}
							}
						},
						{
							field: 'hasData',
							name: '新年度是否已有数据',
							headalign: 'center',
							align: 'center',
							width: 100,
							render: function(rowid, rowdata, data) {
								if(data == 'N') {
									return '<span class="uf-red">否</span>';
								} else {
									return '<span class="uf-green">是</span>';
								}
							}
						},
						{
							type: 'toolbar',
							field: 'opt',
							name: '操作',
							headalign: 'center',
							align: 'center',
							width: 60,
							render: function(rowid, rowdata, data) {
								return '<button onclick="window.parent.openNewMenu($(this));" data-source="' + rowdata.eleSource + '" data-title="' + rowdata.eleName + '" data-code="' + rowdata.eleCode + '" class="btn btn-modify"><span class="icon-edit"></span></button>' +
									'<button data-source="' + rowdata.eleSource + '" data-code="' + rowdata.eleCode + '" class="btn btn-rebuild"><span class="icon-regen"></span></button>';
							}
						},
					]
				]
				$('#newYearBase').ufDatagrid({
					data: [],
					columns: columns,
					initComplete: function(options, data) {
						$('#newYearBase').on('click', '.btn-rebuild', function() {
							var source = $(this).data('source');
							var eleCode = $(this).data('code');
							var url = '/gl/newAgencySetInit/initAgencyEles/' + page.cbAgency.getValue() + '/' + page.cbAcct.getValue() + '/' + source + '/' + eleCode;
							var callback = function(result) {
								page.initNewYearBaseTbl();
							}
							ufma.post(url, {}, callback);
						});
					}
				});
				var url = '/gl/newAgencySetInit/getAgencyEles/' + page.cbAgency.getValue();
				var callback = function(result) {
					$('#newYearBase').getObj().load(result.data);
				}
				ufma.get(url, {}, callback);
			},
			save: function() {
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				/*				agencyCode = '001';
								acctCode = '1001';*/
				var vouGuid = page.vouGuid;
				var url = '/gl/initial/saveInitial';
				var voucher = {
					"vouGuid": vouGuid,
					"op": 0,
					"acctCode": acctCode, //账套号 
					"agencyCode": agencyCode, //单位
					"amtCr": 0, //贷方合计
					"amtDr": 0, //借方合计
					"vouDetLs": [{
						"accoCode": "1001", //会计科目
						"descpt": "期初余额凭证", //摘要
						"detAssLs": [{
							"bgtsourceCode": "string",
							"bussDate": "string",
							"curCode": "string",
							"currAmt": 0,
							"currentCode": "string",
							"departmentCode": "string",
							"depproCode": "string",
							"drCr": 0,
							"employeeCode": "string",
							"exRate": 0,
							"expecoCode": "string",
							"expfuncCode": "string",
							"expireDate": "string",
							"exptypeCode": "string",
							"fatypeCode": "string",
							"price": 0,
							"qty": 0,
							"stadAmt": 222,
							"vouDetailSeq": "1",
							"vouSeq": "1"
						}],
						"drCr": 1,
						"stadAmt": 222,
						"vouSeq": 1
					}]

				}

				var vouDetLs = [];
				var amtCr = 0.00;
				var amtDr = 0.00;
				var vouSeq = 0;
				var bHasChange = false;
				var $YebFn = $('#accoYeb').getObj();
				$('#accoYebBody .uf-grid-body-view tbody tr[id^="accoYeb_row"]:not(.locked)').each(function(irow) {
					var trid = $(this).attr('id');

					var rowTrData = $YebFn.getRowByTId(trid);
					var vou = {};
					vou.accoCode = rowTrData.chrCode;
					var detAssLs = page.fzhsObj[trid] || rowTrData.vouDetAss;
					if(!$.isNull(detAssLs)) {
						vou.detAssLs = detAssLs;
					}
					if(vou.accoCode != '') {

						vou.drCr = 0;
						if(rowTrData.drCr == 1) {
							bHasChange = true;
							vou.drCr = -1;
							vou.stadAmt = rowTrData.stadAmt == '' ? 0.00 : rowTrData.stadAmt;
							amtCr += parseFloat(vou.stadAmt);
						}
						if(rowTrData.drCr == -1) {
							bHasChange = true;
							vou.drCr = 1;
							vou.stadAmt = rowTrData.stadAmt == '' ? 0.00 : rowTrData.stadAmt;
							amtDr += parseFloat(vou.stadAmt);
						}

						if(vou.drCr != 0) {
							vouSeq = vouSeq + 1;
							vou.vouSeq = vouSeq;
							vouDetLs.push(vou);
						}
					}

				});
				voucher.amtDr = amtDr;
				voucher.amtCr = amtCr;
				voucher.vouDetLs = vouDetLs;
				if(amtDr != amtCr) {
					ufma.showTip('借贷不平衡，无法保存！', function() {}, 'error');
					return false;
				}

				if(!bHasChange) {
					ufma.showTip('期初余额为零，无需保存！', function() {}, 'warning');
					return false;
				}
				//console.log(JSON.stringify(voucher));
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip('保存成功！', function() {}, 'success');

				};

				ufma.showloading('正在保存期初余额，请耐心等待...');

				ufma.post(url, voucher, callback);
			},
			initPage: function() {
				if(!bAgency) {
					page.qrySysBaseInfo();
					return false;
				}
				this.initAgencyScc();
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						page.accsCode = data.ACCS_CODE;
						page.checkNewYear();
					}
				});
				//时间轴
				page.timeline = $('#initNewYearTimeline').ufmaTimeline([
					{ step: '数据检查', target: 'checkData' }, { step: '新年度科目余额初始', target: 'tranAcco' }, { step: '完成', target: 'initEnd' }
				]);
			},

			buildNewBase: function(_callback) {
				ufma.showloading('正在生成新年度单位基础资料，请耐心等待...');
				var agencyCode = page.cbAgency.getValue();
				var acctCode = page.cbAcct.getValue();
				var url = '/gl/newAgencySetInit/initAgencyNewSetDataAll/' + agencyCode + '/' + acctCode;
				var callback = function(result) {
					_callback();
					ufma.hideloading();
				}
				ufma.post(url, {}, callback);
			},
			onEventListener: function() {
				if(!bAgency) {
					$('.datatable-group-checkable').click(function(e) {
						e.stopPropagation();
						var bChecked = $(this).prop("checked");
						$('input[name=transitem]').prop("checked", bChecked);
					});
					$('input[name="radioAll"]').change(function() {
						var radioVal = $(this).val();
						$('.radioItem[value="' + radioVal + '"]').prop("checked", true);
					});

					$('#tblTransNewYearBase td').on('click', '.btnTrans', function(e) {
						e.stopPropagation();
						var trid = $(this).closest('tr').attr('id');
						var rowData = page.sysData[trid];
						rowData['transType'] = $('#' + trid + ' .radioItem').val();
						page.transSysBaseInfo([rowData]);
					});
					$('#btn-transSys').click(function() {
						var data = [];
						$('input[name="transitem"]:checked').each(function() {
							var trid = $(this).closest('tr').attr('id');
							var rowData = page.sysData[trid];
							rowData['transType'] = $('#' + trid + ' .radioItem').val();
							data.push(rowData);
						});
						page.transSysBaseInfo(data);
					});

					$('#TriggerDataDown').click(function() {
						var val = $(this).attr('value');
						val = val == '1' ? '0' : '1';
						$(this).attr('value', val);
						$('input[name="downType"]').closest('.active').removeClass('active');
						var $radio = $('input[name="downType"][value="' + val + '"]');
						$radio.closest('.btn').addClass('active');
						$radio.prop('checked', 'checked');
					});
					$('#TriggerDataType').click(function() {
						var val = $(this).attr('value');
						val = val == '1' ? '0' : '1';
						$(this).attr('value', val);
						$('input[name="transType"]').closest('.active').removeClass('active');
						var $radio = $('input[name="transType"][value="' + val + '"]');
						$radio.closest('.btn').addClass('active');
						$radio.prop('checked', 'checked');
					});
					return false;
				}

				$('#btn-next').on('click', function(e) {

					if($.isNull(page.cbAgency) || $.isNull(page.cbAcct)) {
						ufma.alert('请选择单位账套！');
						return false;
					}
					if(page.iErrorNum > 0) {
						ufma.showTip('数据检查未通过，无法生成新年度数据！', function() {}, 'error');
						return false;
					}
					page.buildNewBase(function() {
						page.timeline.next();
						if(page.timeline.stepIndex() == 2) {
							$('#btn-prev').removeClass('hide');
							$('#btn-trans').removeClass('hide');
							$('#btn-check').addClass('hide');
							$('#btn-next').addClass('hide');
							page.initAccoYe();
						}
					});
/*					page.timeline.next();
					if(page.timeline.stepIndex() == 2) {
						$('#btn-prev').removeClass('hide');
						$('#btn-trans').removeClass('hide');
						$('#btn-check').addClass('hide');
						$('#btn-next').addClass('hide');
						page.initAccoYe();
					}*/

				});
				$('#btn-prev').click(function() {
					page.timeline.prev();
					if(page.timeline.stepIndex() == 1) {
						$(this).addClass('hide');
						$('#btn-next').removeClass('hide');
						$('#btn-check').removeClass('hide');
						$('#btn-trans').addClass('hide');
					}
				});
				$('#btn-check').click(function() {
					page.checkNewYear();
				});
				$('#btn-trans').click(function() {
					ufma.confirm('系统将生成新年度期初数据，您确定要执行该操作吗？', function(ac) {
						if(ac) {

							if(page.save()) {
								page.timeline.next();
								$('#btn-trans').addClass('hide');
								$('#btn-prev').addClass('hide');
							};
						}

					}, { 'type': 'warning' });

				});

				$('#btnAdjBase').click(function() {
					page.adjBaseWin = ufma.showDialog({
						content: 'adjNewYearBase',
						width: 800,
						height: 400,
						onClose: function() {

						}
					});
					page.initNewYearBaseTbl();
				});
				$('#btnMakeVou').click(function() {
					$(this).attr("data-title", page.newYear + "年期初余额")
					$(this).attr("data-href", '../initialBal/initialBal.html?agencyCode=' + page.cbAgency.getValue() + '&acctCode=' + page.cbAcct.getValue() + '&setYear=' + page.newYear);
					window.parent.openNewMenu($(this));
				});
				$('#btnCloseWind').click(function() {
					page.adjBaseWin.close();
				});
			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				page.pfData = ufma.getCommonData();
				$('.curYear').html(page.pfData.svSetYear-1);
				page.newYear = parseInt(page.pfData.svSetYear);
				$('.newYear').html(page.newYear);
				//获取权限数据
				page.reslist = ufma.getPermission();

				this.initPage();
				this.onEventListener();
			}
		}
	}();
	/////////////////////
	page.init();
});
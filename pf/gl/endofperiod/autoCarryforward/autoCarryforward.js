$(function() {
	window.showCarryKM = function(data) {
		var card = data;
		ufma.open({
			url: 'carrySetKM.html',
			title: '新增自动转账',
			width: 1000,
			height: 500,
			data: card,
			ondestory: function(result) {
				if(result.action == 'ok') {
					page.carrySetWin.setData(result.data);
				}
			}
		});
	};
	var agencyName = ''
	var acctName = ''
	var page = function() {
		var isnumvoutype = false
		var accaCodedata = []
		var selvousavedata=''
		var accacodesisxin = '';
		return {
			cards: {},
			cardData: {}, //保存数据
			initAgencyScc: function() {
				/*page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					onchange:function(data){
						//console.log(data);
						var url = '/gl/eleCoacc/getCoCoaccs/'+data.id;
						callback = function(result){
							page.cbAcct = $("#cbAcct").ufmaCombox2({
							  data: result.data,
							  initComplete:function(sender){
								page.cbAcct.val(page.pfData.svAcctCode);
							  }
							});
						}
						
						ufma.get(url,{},callback);
					},
					initComplete:function(sender){
						page.cbAgency.val(page.pfData.svAgencyCode);
					}
				});*/
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						page.qryCarryCard();
						if(bAgency) {
							var agencyCode = page.cbAgency.getValue();
							var year = page.pfData.svSetYear;
							var accacodes = ''
							acctName = data.name
							var params = {
								selAgecncyCode: page.cbAgency.getValue(),
								selAgecncyName: agencyName,
								selAcctCode: page.cbAcct.getValue(),
								selAcctName: acctName
							}
							ufma.setSelectedVar(params);
							if(data.isParallel== '1' && data.isDoubleVou == '1') {
								isnumvoutype = true
								accacodes = '*'
								accacodesisxin = '1,2'
							} else {
								isnumvoutype = false
								accacodes = '*'
								accacodesisxin = '*'
							}
							var acctCode = page.cbAcct.getValue();
							var url = '/gl/eleVouType/getVouType/' + agencyCode + '/' + year + '/' + acctCode + '/' + accacodes;
							callback = function(result) {
								accaCodedata = result.data
								var tr=''
								for(var i=0;i<accaCodedata.length;i++){
									tr += '<option value="' + accaCodedata[i].code + '">' + accaCodedata[i].name + '</option>'
								}
								$("#vouTypeCodesel").html(tr)
							};
							ufma.ajaxDef(url, 'get', {}, callback);
							var postSet = {
								//修改页面初始化报错问题
								acctCode: acctCode,//$("#cbAcct").getObj().getValue(),
								agencyCode: agencyCode,//$("#cbAgency").getObj().getValue(),
								setYear: page.pfData.svSetYear
							}
							ufma.post("/gl/CarryOver/search", postSet, function(data) {
								var tr=''
								for(var i=0;i<data.data.length;i++){
									tr+='<option guid='+data.data[i].calendarGuid+' value='+data.data[i].fisPerd+'>第'+data.data[i].fisPerd+'期间</option>'
								}
								$("#vouFisperd").html(tr)
							})
						}
					}
				});
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function(data) {
						agencyName = data.name
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: agencyName,
							selAcctCode: page.cbAcct.getValue(),
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						var url = '/gl/eleCoacc/getRptAccts';
						callback = function(result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data, "code", page.pfData.svAcctCode);
							if(svFlag != undefined) {
								page.cbAcct.val(page.pfData.svAcctCode);
							} else {
								page.cbAcct.val(result.data[0].code);
							}

						}

						ufma.get(url, {'userId':page.pfData.svUserId,'setYear':page.pfData.svSetYear,'agencyCode':data.id}, callback);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function(result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", page.pfData.svAgencyCode);
					if(agyCode != undefined) {
						page.cbAgency.val(page.pfData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			initScheType: function() {
				var url = '/gl/enumerate/AUTO_SCHE_TYPE';
				callback = function(result) {
					var data = result.data; //[{ENU_CODE:'1',ENU_NAME:'收支结转'},{ENU_CODE:'2',ENU_NAME:'费用分摊'}];
					$.each(data, function(idx, item) {
						$('<a name="scheType" value="' + item.ENU_CODE + '" class="label label-radio ">' + item.ENU_NAME + '</a>').appendTo($('#scheType'));
					});
				};
				ufma.get(url, {}, callback);

			},
			//科目体系
			initAccs: function() {

				var url = '/ma/sys/common/getEleTree';
				callback = function(result) {
					var data = result.data;
					data.splice(0, 0, {
						'code': '-1',
						'name': '全部'
					});
					$('#cbAccs').ufCombox({
						idField: 'code',
						textField: 'name',
						data: data,
						name: 'accsCode',
						onChange: function(sender, itemData) {;
							page.qryCarryCard();
						},
						onComplete: function(sender) {
							$('#cbAccs').getObj().val('-1');
						}
					});
				};
				ufma.ajaxDef(url,'get', {'rgCode':page.pfData.svRgCode,'setYear':page.pfData.svSetYear,'agencyCode': '*','eleCode': 'ACCS'}, callback);
			},
			qryCarryCardmodal: function() {
				var agencyCode = '*';
				var acctCode = '*';
				var scheTypeCode = '-1';
				var fajb = '*';
				var accsCode = '';
				if(bAgency) {
					agencyCode = page.cbAgency.getValue();
					acctCode = page.cbAcct.getValue();
					var acctData = page.cbAcct.getItemById(acctCode);
					accsCode = acctData.accsCode;
					fajb = $('.label-radio[name="fajb"].selected').attr('value');
				} else {
					accsCode = $('#cbAccs').getObj().getValue();
					fajb = $('.label-radio[name="fajb"].selected').attr('value');
					//accsCode = $('.label-radio[name="accsCode"].selected').attr('value');
				}
				scheTypeCode = $('.label-radio[name="scheType"].selected').attr('value');

				var url = '/gl/GlAutoCo/search/' + agencyCode + '/' + acctCode + '/' + scheTypeCode + '/' + accsCode + '/0/' + fajb;

				var callback = function(result) {
					$('#totalNum').html('共<span style="font-family: MicrosoftYaHei;color:#63BEFF;">&nbsp;' + result.data.length + '&nbsp;</span>个');
					page.cardDatamodal = result.data;
					page.modaltable(page.cardDatamodal);
					page.editor = ufma.showModal('agencynomodal', 1100, 500);
				}
				ufma.get(url, {}, callback);
			},
			qryCarryCard: function() {
				var agencyCode = '*';
				var acctCode = '*';
				var scheTypeCode = '-1';
				var fajb = '*';
				var accsCode = '';
				if(bAgency) {
					agencyCode = page.cbAgency.getValue();
					acctCode = page.cbAcct.getValue();
					var acctData = page.cbAcct.getItemById(acctCode);
					accsCode = acctData.accsCode;
					fajb = $('.label-radio[name="fajb"].selected').attr('value');
				} else {
					accsCode = $('#cbAccs').getObj().getValue();
					fajb = $('.label-radio[name="fajb"].selected').attr('value');
					//accsCode = $('.label-radio[name="accsCode"].selected').attr('value');
				}
				scheTypeCode = $('.label-radio[name="scheType"].selected').attr('value');
				var level = 1
				if(agencyCode == '*'){
					level = 0
				}
				var url = '/gl/GlAutoCo/search/' + agencyCode + '/' + acctCode + '/' + scheTypeCode + '/' + accsCode + '/'+level+'/' + fajb;

				var callback = function(result) {
					$('#totalNum').html('共<span style="font-family: MicrosoftYaHei;color:#63BEFF;">&nbsp;' + result.data.length + '&nbsp;</span>个');
					page.cardData = result.data;
					page.drawCarryTable(page.cardData);
				}
				ufma.get(url, {}, callback);
			},
			modaltable: function(data) {
				var accacodes = ''
				var $table = $('#tablecarryCardmodal');
				$table.html('')
				$tbl = $('<table id="tablecarryCardsmodal" class="ufma-table dataTable bordered"></table>').appendTo($table);
				$('<thead><tr><th style="width:35px;"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkalls">&nbsp;<span></span></label></th><th>序号</th><th>方案名称</th><th>科目体系</th><th>方案类型</th><th>期间类型</th></tr></thead>').appendTo($tbl);
				var $tbody = $('<tbody></tbody>').appendTo($tbl);
				var firstLetter = '';
				var rowindex = 1
				$.each(data, function(idx, row) {
					if(isnumvoutype) {
						accacodes = row.accaCode
					} else {
						accacodes = "*"
					}
					var acctCode = page.cbAcct.getValue();
					var agencyCode = page.cbAgency.getValue();
					var year = page.pfData.svSetYear;
					if(row.agencyCode == "*") {
						var fajb = '';
						if(row.agencyCode != '*') {
							fajb = '单位级';
						} else {
							fajb = '系统级';
						}
						var qjlx = '';
						if(row.vouKind == 'NJ') {
							qjlx = '年结';
						} else if(row.vouKind == 'YJ') {
							qjlx = '月结';
						}
						var tr = ''
						tr += '<tr accs = "'+row.accsCode+'" id="' + row.scheGuid + '"><td><label  class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox">&nbsp;<span></span></label></td><td><span class="recno">' + rowindex + '</span></td><td>' + row.scheName + '</td><td>' + row.accsName + '</td><td>' + row.enuName + '</td><td>' + qjlx + '</td>' +
							'</tr>'
						var $row = $(tr).appendTo($tbody);
						rowindex++
					}
				});
				$('#carryCard .btn-label[data-toggle="tooltip"]').tooltip();
			},
			drawCarryTable: function(data) {
				var $table = $('#carryCard');
				$table.html('')
				$tbl = $('<table id="tablecarryCard" class="ufma-table dataTable bordered"></table>').appendTo($table);
				$('<thead><tr>'+(true?'<th style="width:40px"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkalls">&nbsp;<span></span></label></th>':'')+'<th>方案名称</th><th>科目体系</th><th>方案类型</th><th>期间类型</th><th class="nowrap" style="width:100px;">操作</th></tr></thead>').appendTo($tbl);
				var $tbody = $('<tbody></tbody>').appendTo($tbl);
				var firstLetter = '';
				$.each(data, function(idx, row) {
					if(bAgency == true && row.agencyCode != "*") {
						var fajb = '';
						if(row.agencyCode != '*') {
							fajb = '单位级';
						} else {
							fajb = '系统级';
						}
						var qjlx = '';
						if(row.vouKind == 'NJ') {
							qjlx = '年结';
						} else if(row.vouKind == 'YJ') {
							qjlx = '月结';
						}
						var tr = '<tr class="'+row.vouKind+'" idx = "'+idx+'" scheName="'+row.scheName+'" vouTypeCode="'+row.vouTypeCode+'" accs = "'+row.accsCode+'" id="' + row.scheGuid + '">'+(true?'<td><label  class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox">&nbsp;<span></span></label></td>':'')+'<td>' + row.scheName + '</td><td>' + row.accsName + '</td><td>' + row.enuName + '</td><td>' + qjlx + '</td>' +
							'<td>' +
							'<a class="btn-label margin-right-8 btn-set btn-permission btn-setup" data-toggle="tooltip" title="设置"><i class="glyphicon icon-setting"></i></a>';
						if(bAgency) {
							tr = tr + '<a class="btn-label margin-right-8 btn-vou btn-permission btn-gen-vou" data-toggle="tooltip" title="生成凭证"><i class="glyphicon icon-Certificate"></i></a>';
						}
						if((row.agencyCode != '*' && bAgency) || !bAgency) {
							tr = tr + '<a class="btn-label margin-right-8  btn-del btn-permission btn-delete" data-toggle="tooltip" title="删除"><i class="glyphicon icon-trash"></i></a>';
						} else {
							tr = tr + '<a class="btn-label margin-right-8  btn-copy btn-permission " data-toggle="tooltip" title="复制方案"><i class="glyphicon icon-replace-t"></i></a>';
						}
						tr = tr + '<a class="btn-label btn-Drag btn-permission " data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a>';

						tr = tr + '</td></tr>';

						var $row = $(tr).appendTo($tbody);
					} else if(bAgency != true && row.agencyCode == "*") {
						var fajb = '';
						if(row.agencyCode != '*') {
							fajb = '单位级';
						} else {
							fajb = '系统级';
						}
						var qjlx = '';
						if(row.vouKind == 'NJ') {
							qjlx = '年结';
						} else if(row.vouKind == 'YJ') {
							qjlx = '月结';
						}
						var tr = '<tr class="'+row.vouKind+'" idx = "'+idx+'" scheName="'+row.scheName+'" vouTypeCode="'+row.vouTypeCode+'" accs = "'+row.accsCode+'" id="' + row.scheGuid + '">'+(true?'<td><label  class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox">&nbsp;<span></span></label></td>':'')+'<td>' + row.scheName + '</td><td>' + row.accsName + '</td><td>' + row.enuName + '</td><td>' + qjlx + '</td>' +
							'<td>' +
							'<a class="btn-label margin-right-8 btn-set btn-permission btn-setup" data-toggle="tooltip" title="设置"><i class="glyphicon icon-setting"></i></a>';
						if(bAgency) {
							tr = tr + '<a class="btn-label margin-right-8 btn-vou btn-permission btn-gen-vou" data-toggle="tooltip" title="生成凭证"><i class="glyphicon icon-Certificate"></i></a>';
						}
						if((row.agencyCode != '*' && bAgency) || !bAgency) {
							tr = tr + '<a class="btn-label margin-right-8  btn-del btn-permission btn-delete" data-toggle="tooltip" title="删除"><i class="glyphicon icon-trash"></i></a>';
						} else {
							tr = tr + '<a class="btn-label margin-right-8  btn-copy btn-permission " data-toggle="tooltip" title="复制方案"><i class="glyphicon icon-replace-t"></i></a>';
						}
						tr = tr + '<a class="btn-label btn-Drag btn-permission " data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a>';

						tr = tr + '</td></tr>';

						var $row = $(tr).appendTo($tbody);
					}
					page.cards[row.scheGuid] = row;

				});
				$('#carryCard .btn-label[data-toggle="tooltip"]').tooltip();
				$('#carryCard .btn-set').click(function(e) {
					e.stopPropagation();
					var trid = $(this).closest('tr').attr('id');
					var trindex = $(this).closest('tr').find('.recno').html();
					var card = page.cards[trid];
					card.seqindex = trindex
					page.openEditWin(card);
				});
				$('#tablecarryCard .btn-Drag').on('mousedown', function(e) {
					var callback = function() {
						console.log(1)
						var idx = 0;
						var ids = []
						$('#tablecarryCard tbody tr').each(function() {
							if(!$(this).hasClass('hide')) {
								idx = idx + 1;
								$(this).find('span.recno').html(idx);
								var idxs = {}
								idxs[$(this).attr('id')] = idx
								ids.push(idxs)
							}
						});
						ufma.post('/gl/GlAutoCo/order', ids, function() {
							ufma.showTip("排序保存成功", function() {}, "success")
						})

					};
					$('#tablecarryCard').tableSort(callback);
				});
				$('#carryCard .btn-del').click(function(e) {
					e.stopPropagation();

					var trid = $(this).closest('tr').attr('id');
					var card = page.cards[trid];
					ufma.confirm('您是要删除结转模板【' + card.scheName + '】？', function(action) {
						if(action) {
							page.deleteCarry(card.scheGuid);
						}
					});
				});
				$('#carryCard .btn-copy').click(function(e) {
					e.stopPropagation();
					var trid = $(this).closest('tr').attr('id');
					var card = page.cards[trid];
					var agencyCode = '*';
					var acctCode = '*';
					if(bAgency) {
						agencyCode = page.cbAgency.getValue();
						if(agencyCode == '') {
							ufma.alert('请选择单位！');
							return false;
						};
						acctCode = page.cbAcct.getValue();
						if(acctCode == '') {
							ufma.alert('请选择账套！');
							return false;
						};
					}
					var argu = {};
					argu.agencyCode = agencyCode;
					argu.acctCode = acctCode;
					argu.scheGuid = card.scheGuid;
					var url = '/gl/GlAutoCo/copy';
					var callback = function(result) {
						ufma.showTip(result.msg, function() {

						}, result.flag);
						page.qryCarryCard();
					};
					ufma.get(url, argu, callback);
				});
				var isclick= true;
				$('#carryCard .btn-vou').on('click', function(e) {
					e.stopPropagation();
					var trid = $(this).closest('tr').attr('id');
					var card = page.cards[trid];
					//系统级下发的没有凭证类型
//					if($(this).closest('tr').attr('vouTypeCode') == 'CZ'){
//						var scheName = $(this).closest('tr').attr('scheName');
//						ufma.showTip('方案【'+scheName+'】为系统级方案，请先修改凭证类型', 'warning', function() {})
//						return false ;
//					}
					if(card.vouKind=='NJ'){
						$('.fisperddiv').hide()
						$("#vouFisperd option[value=12]").attr('selected',true).prop('selected',true)
//						if (isclick) {
//							isclick= false;
//							var agencyCode = page.cbAgency.getValue();
//							var acctCode = page.cbAcct.getValue();
//							var optionguid= $("#vouFisperd option[value=12]").attr('guid')
//							var fisperd= 12
//							var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + card.scheGuid+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd;
//							var callback = function(result) {
//						        isclick = true;
//								ufma.showTip('成功生成凭证！', function() {}, 'success');
//							};
//							ufma.get(url, {}, callback);
//						}
					}else{
						var url = '/gl/publish/getMinOpenFisPerd';
						var urldata = {
							"agencyCode":page.cbAgency.getValue(),
							"acctCode":page.cbAcct.getValue(),
							'rgCode':page.pfData.svRgCode,
							'setYear':page.pfData.svSetYear
						}
						var callback = function(result) {
							var fisperds = result.data
							$('.fisperddiv').show()
							$("#vouFisperd option[value='"+fisperds+"']").attr('selected',true).prop('selected',true)
						};
						ufma.post(url, urldata, callback);
					}
					page.makeVou(card.scheGuid,card.vouTypeCode);
				});

				//权限判断
				ufma.isShow(page.reslist);
			},
			drawCarryCard: function(data) {
				var $cards = $('#carryCard');
				$cards.html('');
				$cards.css('margin-right', '50px');

				var $nav = $('#pinyinNav');
				$nav.html('');
				$cards.html('');
				var $row;
				var firstLetter = '';

				$.each(data, function(idx, row) {

					page.cards[row.scheGuid] = row;
					var scheName = row.scheName;
					var subTitle = row.enuName;
					if(row.agencyCode != '*') {
						subTitle += '<br/>' + '单位级';
					} else {
						subTitle += '<br/>' + '系统级';
					}
					var imgsrc = '../../../images/autoCarry-icon-' + row.scheType + '.png';
					if(idx % 4 == 0 || row.pinYin != firstLetter) {
						if(row.pinYin != firstLetter) {
							firstLetter = row.pinYin;
							var navName = 'nav-' + firstLetter;
							$('<div class="font-size14 margin-top-8" id="' + navName + '">' + firstLetter + '</div>').appendTo($cards);
							var $navitem = $('<a class="ufma-nav-fixed-item" href="#' + navName + '">' + firstLetter + '</a>').appendTo($nav);
							if(idx == 0) {
								$navitem.addClass('selected');
							}
						}

						$row = $('<div class="row"></div>').appendTo($cards);
					}
					var $col = $('<div class="col-md-3 padding-8"></div>');
					var $newCard = $('<div class="ufma-card ufma-card-icon"></div>').appendTo($col);
					$('<div class="card-icon" color-index=1><span class="icon"><img src="' + imgsrc + '" style="width:52px;height:52px;margin-top:-5px;" /></span></div>').appendTo($newCard);
					$('<div class="ufma-card-header">' + scheName + '</div>').appendTo($newCard);
					$('<div class="ufma-card-body">' + subTitle + '</div>').appendTo($newCard);
					var $footer = $('<div class="ufma-card-footer"></div>').appendTo($newCard);
					var $btnset = $('<a class="btn-label btn-permission btn-setup"><i class="glyphicon icon-setting"></i>查看</a>').appendTo($footer);
					if(bAgency) {
						var $btnmakepz = $('<a class="btn-label btn-permission btn-gen-vou"><i class="glyphicon icon-book"></i>生成凭证</a>').appendTo($footer);
					}

					if((row.agencyCode != '*' && bAgency) || !bAgency) {
						var $btndel = $('<a class="btn-label btn-permission btn-delete"><i class="glyphicon icon-trash"></i>删除</a>').appendTo($footer);
						$btndel.on('click', function() {
							ufma.confirm('您是要删除结转模板【' + scheName + '】？', function(action) {
								if(action) {
									page.deleteCarry(row.scheGuid);
								}
							});
						});
					} else {
						var $btncopy = $('<a class="btn-label btn-permission btn-copy"><i class="glyphicon icon-replace-t"></i>复制方案</a>').appendTo($footer);
						var agencyCode = '*';
						var acctCode = '*';
						if(bAgency) {
							agencyCode = page.cbAgency.getValue();
							if(agencyCode == '') {
								ufma.alert('请选择单位！');
								return false;
							};
							acctCode = page.cbAcct.getValue();
							if(acctCode == '') {
								ufma.alert('请选择账套！');
								return false;
							};
						}
						var argu = {};
						argu.agencyCode = agencyCode;
						argu.acctCode = acctCode;
						argu.scheGuid = row.scheGuid;
						$btncopy.on('click', function() {
							var url = '/gl/GlAutoCo/copy';
							var callback = function(result) {
								ufma.showTip(result.msg, function() {

								}, result.flag);
								page.qryCarryCard();
							};
							ufma.get(url, argu, callback);
						})
					}
					$col.appendTo($row);;
					$btnset.on('click', function() {
						row['isSet'] = false;
						page.openEditWin(row);
					});
					if(bAgency) {
						$btnmakepz.on('click', function() {
							page.makeVou(row.scheGuid,row.vouTypeCode);
						});
					}

				});

				//权限判断
				ufma.isShow(page.reslist);
			},
			makeVou: function(scheGuid,vouTypeCode) {
				if(vouTypeCode!='*' && !$.isNull(vouTypeCode)){
					$('#vouTypeCodesel option[value='+vouTypeCode+']').attr('selected',true).prop('selected',true)
				}
				selvousavedata = scheGuid
				page.editors = ufma.showModal('vouFisperdmodal', 550, 300);
			},
			deleteCarry: function(scheGuid) {
				var argu = {
					'guid': scheGuid
				};
				var url = '/gl/GlAutoCo/delete';
				var callback = function(result) {
					ufma.showTip('删除成功！', function() {}, "success");
					page.qryCarryCard();
				};
				ufma.delete(url, argu, callback);
			},
			initPage: function() {
				//获取权限数据
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				if(bAgency) { //单位级
					this.initAgencyScc();
					/*page.cbAcct = $("#cbAcct").ufmaCombox2({
						valueField:'CHR_CODE',
						textField:'CODE_NAME',
						placeholder:'请选择账套',
						icon:'icon-book',
						onchange:function(data){
							page.qryCarryCard();
						}
					});*/
				} else {
					this.initAccs();
				}
				this.initScheType();
			},
			openEditWin: function(card) {
				var agencyCode = '*';
				var acctCode = '*';
				var accsCode = '*';
				if(bAgency) {
					agencyCode = page.cbAgency.getValue();
					if(agencyCode == '') {
						ufma.alert('请选择单位！');
						return false;
					};
					acctCode = page.cbAcct.getValue();
					if(acctCode == '') {
						ufma.alert('请选择账套！');
						return false;
					};
					accsCode = page.cbAcct.getItemById(acctCode)['accsCode']
				} else {
					accsCode = $('#cbAccs').getObj().getValue();
					//accsCode = $('.label-radio[name="accsCode"].selected').attr('value');
				}
				card = card || {};
				if(card.isAgency == 1) {
					acctCode = page.cbAcct.getValue();
				}
				accsCode = card['accsCode'] || accsCode;
				//				card.isAgency = '1';
				if(card.agencyCode == '*') {
					card.isAgency = '0';
				}
				card['agencyCode'] = agencyCode;
				card['acctCode'] = acctCode;
				card['accsCode'] = accsCode;
				card['bAgency'] = bAgency;
				card['accaCode'] = card.accaCode;
				if(card.seqindex != undefined) {
					card['orderseq'] = card.seqindex
				} else {
					card['orderseq'] = page.cardData.length;
				}
				card['accacodes'] = accacodesisxin
				page.carrySetWin = ufma.open({
					url: 'carrySet.html',
					title: '新增自动转账',
					width: 880,
					height: 500,
					data: card,
					ondestory: function(data) {
						//if(data.action=='ok'){
						page.qryCarryCard();
						//}
					}
				});
			},
			onEventListener: function() {
				$('#btn-new').on('click', function() {
					page.openEditWin({
						'isSet': true
					});
				});
				//$('#cardType .btn[data-toggle="tooltip"]').tooltip();
				$('#cardType .btn-card').click(function() {
					page.drawCarryCard(page.cardData);
				});
				$('#cardType .btn-table').click(function() {
					page.drawCarryTable(page.cardData);
				});
				
				$(document).on('click', '.label-radio', function(e) {
					e.stopPropagation();
					page.qryCarryCard();
				});
			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				page.pfData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				if(!bAgency) {
					page.qryCarryCard();
				}
				$(document).on('click', '#btn-copy', function() {
					page.qryCarryCardmodal()
				})
				$(document).on('click', '#btn-qx', function() {
					page.editor.close()
				})
				$(document).on('click', '#btn-saveModal', function() {
					$(this).addClass('disabled')
					var data = {
						agencyCode: page.cbAgency.getValue(),
						acctCode: page.cbAcct.getValue(),
						data: []
					}
					for(var z = 0; z < $('#tablecarryCardsmodal tbody').find('tr').length; z++) {
						if($('#tablecarryCardsmodal tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							var pushdata = {}
							pushdata.vouType = ''
							pushdata.id = $('#tablecarryCardsmodal tbody').find('tr').eq(z).attr('id')
							data.data.push(pushdata)
						}
					}
					var _this =$(this)
					if(data.data.length > 0) {
						ufma.post('/gl/GlAutoCo/copyProjects', data, function(data) {
							var flag = data.flag;
							if(flag !== null && flag === "warn"){
                                ufma.showTip(data.msg, function() {}, "warning")
							}else{
                                ufma.showTip("复制成功", function() {}, "success")
                            }
							page.editor.close()
							page.qryCarryCard();
							_this.removeClass('disabled')
						});
						setTimeout(function(){
							_this.removeClass('disabled')
						},5000)
					} else {
						ufma.showTip('请勾选需要复制的内容', 'warning', function() {})
						$(this).removeClass('disabled')
					}
				})
				
				var vouclick  = true;
				$(document).on('click', '#btn-addvous', function() {
					var data = []
					var nos = true;
					for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
						if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							data.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
							if($('#tablecarryCard tbody').find('tr').eq(z).hasClass('NJ')){
								nos = false
							}else if($('#tablecarryCard tbody').find('tr').eq(z).hasClass('YJ') && !nos){
								ufma.showTip('请勿同时勾选年结和月结', 'warning', function() {})
								return false 
							}
							//系统级下发的没有凭证类型
//							if($('#tablecarryCard tbody').find('tr').eq(z).attr('vouTypeCode') == 'CZ'){
//								var scheName = $('#tablecarryCard tbody').find('tr').eq(z).attr('scheName');
//								ufma.showTip('方案【'+scheName+'】为系统级方案，请先修改凭证类型', 'warning', function() {})
//								return false 
//							}
						}
					}
					if(data.length > 0) {
						selvousavedata = data.join(',')
						if(nos){
							var url = '/gl/publish/getMinOpenFisPerd';
							var urldata = {
								"agencyCode":page.cbAgency.getValue(),
								"acctCode":page.cbAcct.getValue(),
								'rgCode':page.pfData.svRgCode,
								'setYear':page.pfData.svSetYear
							}
							var callback = function(result) {
								var fisperds = result.data
								$('.fisperddiv').show()
								$("#vouFisperd option[value='"+fisperds+"']").attr('selected',true).prop('selected',true)
							};
							ufma.post(url, urldata, callback);
						}else{
							$('.fisperddiv').hide()
							 $("#vouFisperd option[value=12]").attr('selected',true).prop('selected',true)
//							if (vouclick) {
//								vouclick= false;
//								var agencyCode = page.cbAgency.getValue();
//								var acctCode = page.cbAcct.getValue();
//								var optionguid= $("#vouFisperd option[value=12]").attr('guid')
//								var fisperd= 12
//								var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + selvousavedata+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd;
//								var callback = function(result) {
//									vouclick = true;
//									ufma.showTip('成功生成凭证！', function() {}, 'success');
//								};
//								ufma.get(url, {}, callback);
//							}
						}
						page.editors = ufma.showModal('vouFisperdmodal', 550, 300);
					} else {
						ufma.showTip('请勾选需要生成凭证的内容', 'warning', function() {})
					}
				})
				$(document).on('click', '#btn-lowsend', function(e) {
					var data = []
					for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
						if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							data.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
						}
					}
					if(data.length > 0) {
						var checkaccsCode = ''
						for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
							if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
								if(checkaccsCode!='' && checkaccsCode!=$('#tablecarryCard tbody').find('tr').eq(z).attr('accs')){
									ufma.showTip('请选择同样科目体系的转账方案下发', 'warning', function() {})
									return false 
								}else if(checkaccsCode==''){
									checkaccsCode = $('#tablecarryCard tbody').find('tr').eq(z).attr('accs')
								}
								
							}
						}
// 						ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function(result) {
// 								$('#cbAgencylowsend').ufTextboxlist({//初始化
// 									idField    :'id',//可选
// 									textField  :'codeName',//可选
// 									pIdField  :'pId',//可选
// 									async      :false,//异步
// 									data       :result.data,//列表数据
// 									// icon:'icon-book',
// 									onChange   :function(sender, treeNode){
// 									}
// 							});

						// });
						page.modal = ufma.selectBaseTree({
							url: '/ma/sys/common/getAgencyAcctTree?accsCode='+checkaccsCode,
							rootName: '所有单位',
							width: 650,
							title: '选择下发账套',
							bSearch: true, //是否有搜索框
							checkAll: true, //是否有全选
							filter: { //其它过滤条件
							},
							buttons: { //底部按钮组
								'确认下发': {
									class: 'btn-primary',
									action: function (data) {
										if (data.length == 0) {
											ufma.alert('请选择单位账套！', "warning");
											return false;
										}
										var dwdata = []
										for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
											if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
												dwdata.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
//												accsCode
											}
										}
										var datas = [];
										for (key in data) {
											if (data[key].isParent == false && !data[key].hasOwnProperty("agencyType")) {
												datas.push({
													"AgencyCode": data[key].getParentNode().id,
													"AcctCode": data[key].code,
//													'accsCode':data[key].accsCode
												});
											}
										}
										ufma.ajaxDef("/gl/GlAutoCo/issue", "post",{'Agency':datas,'id':dwdata}, function(result) {
//												ufma.showTip(result.msg, function() {}, result.flag);
												ufma.open({
													url: './issueTips.html',
													title: '下发结果',
													width: 900,
													data: result.data,
													ondestory: function(data) {
														//窗口关闭时回传的值;
														
													}
												});
										}),
										page.modal.close();
// 										page.editor.close()
// 										var ids = [];
// 										var argu = {
// 											"accsCode": page.accsCode,
// 											"vouGroupId": delData,
// 											'data': datas
// 										};
// 										ufma.post('/gl/vouTemp/sendVouTemp', argu, function (result) {
// 											ufma.showTip(result.msg, function () {
// 												page.modal.close();
// 												treeObj.checkAllNodes(false);
// 											}, result.flag);
// 										});
									}
								},
								'取消': {
									class: 'btn-default',
									action: function () {
										page.modal.close();
									}
								}
							}
						});
						// page.editor = ufma.showModal('Agencymodal', 460, 250);
					} else {
						ufma.showTip('请勾选需要下发的内容', 'warning', function() {})
					}
				});
				$(document).on('click', '#btn-lowsendsave', function(e) {
					var data = []
					for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
						if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							data.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
						}
					}
					var agency = $('#cbAgencylowsend').getObj().getItem()
					ufma.ajaxDef("/gl/GlAutoCo/issue", "post",{'Agency':agency,'id':data}, function(result) {
							ufma.showTip(result.msg, function() {}, result.flag);
					})
					page.editor.close()
				});
				$(document).on('click', '#btn-lowsendqx', function(e) {
					page.editor.close()
				});
				$(document).on('click','#btn-vouFisperdqr',function(e){
					ufma.showloading('正在加载中，请耐心等待',0);
					var agencyCode = page.cbAgency.getValue();
					var acctCode = page.cbAcct.getValue();
					var optionguid= $("#vouFisperd option:selected").attr('guid')
					var fisperd= $("#vouFisperd option:selected").attr('value')
					var voutypecode= $("#vouTypeCodesel option:selected").attr('value')
					var  hex_md5svUserCode = ''
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
					}
					var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + selvousavedata+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd+'&vouTypeCode=' + voutypecode;
					var callback = function(result) {
						var data = result.data
						var msgs = data.flag+"</br>"
						var msgss = ''
						for(var i in data){
							if(data[i].schName!=undefined){
								msgss+=data[i].schName+"内" +data[i].accoCode+data[i].message+"</br>"
							}
						}
						if(msgss!=''){
							msgs+=msgss
							ufma.showTip(msgs, function() {}, 'error');
						}else{
							ufma.showTip(msgs, function() {}, 'success');
						}
					};
					ufma.get(url, {}, callback);
                    $(this).attr('disabled',true);
                    var $that = $(this);
                    function scc(){
                        $.ajax({
                            url: '/gl/GlAutoCo/buildVouCollect/' + selvousavedata+'?ajax=1&rueicode='+hex_md5svUserCode,
                            type: "GET", //GET
                            async: false, //或false,是否异步
                            data: {},
                            timeout: 1800000, //超时时间
                            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
                            contentType: 'application/json; charset=utf-8',
                            success: function(result) {
                                if(result.data.flag == 'SUCCESS') {
                                    ufma.hideloading();
                                    $that.attr('disabled',false);
                                    // ufma.showTip('成功生成凭证！', function() {}, 'success');
                                    page.editors.close()
                                } else if(result.data.flag == 'FAIL'){
                                    ufma.hideloading();
                                    $that.attr('disabled',false);
                                    // ufma.showTip(result.data.msg, function() {}, 'success');
                                    page.editors.close()
                                }else if(result.data.flag == 'CONDUCT'){
                                    ufma.updataloading(result.data.rateVal)
                                    setTimeout(function(){
                                        scc()
                                    },1000)
                                }
                            },
                            error: function(jqXHR, textStatus) {
                                ufma.showTip(jqXHR.status+'服务器错误', function() {
                                    ufma.hideloading();
                                }, "error");
                                $that.attr('disabled',false);
                            }
                        })
                    }
                    scc()
					page.editors.close()
				})
				$(document).on('click','#btn-vouFisperdclose',function(e){
					page.editors.close()
				})
				$(document).on('click','#btn-upload',function(e){
					var data = []
					for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
						if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							var key= $('#tablecarryCard tbody').find('tr').eq(z).attr('idx')
							data.push(page.cardData[key])
						}
					}
					if(data.length>0){
						ufma.post('/gl/GlAutoCo/exportAutoCoScheme',data, function(result){
							window.location.href = result.data;
						});
					}else{
						ufma.showTip('请勾选需要导出的内容', 'warning', function() {})
					}
					 
				})
				$(document).on('click','#btn-import',function(e){
					$("#upmodal").val('').trigger('click')
				})
				$(document).on('change','#upmodal',function(e){
					if($(this).val()!=""){
						$('#rgCodes').val(page.pfData.svRgCode)
						$('#setYears').val(page.pfData.svSetYear)
						if(bAgency){
							$('#agencyCodes').val(page.cbAgency.getValue())
							$('#acctCodes').val(page.cbAcct.getValue())
						}else{
							$('#agencyCodes').val("*")
							$('#acctCodes').val("*")
						}
						$.ajax({
							url: '/gl/GlAutoCo/importAutoCoScheme',
							type: 'POST',
							cache: false,
							data: new FormData($('#upmodaldata')[0]),
							processData: false,
							contentType: false
						}).done(function (res) {
							if (res.flag == "success") {
								var msg = ''
								if(!$.isNull(res.data)){
									for(var i=0;i<res.data.length;i++){
										msg+=res.data[i].fileName+res.data[i].reason +"<br/>"
									}
								}
								if(msg == ''){
									msg="导入成功"
								}
								ufma.showTip(msg, function () { }, "error");
								page.qryCarryCard()
							} else {
								ufma.showTip(res.msg, function () { }, "error");
							}
						}).fail(function (res) {
							ufma.showTip(res.msg, function () { }, "success");
						});
					}
				})
				
			}
		}
	}();
	/////////////////////
	page.init();
	$(document).on('change', '#tablecarryCard .checkalls', function() {
		if($(this).is(':checked')) {
			$("#tablecarryCard input[type='checkbox']").prop('checked', true)
		} else {
			$("#tablecarryCard input[type='checkbox']").prop('checked', false)
		}
	})
	$(document).on('change', '#tablecarryCardsmodal .checkalls', function() {
		if($(this).is(':checked')) {
			$("#tablecarryCardsmodal input[type='checkbox']").prop('checked', true)
		} else {
			$("#tablecarryCardsmodal input[type='checkbox']").prop('checked', false)
		}
	})
});
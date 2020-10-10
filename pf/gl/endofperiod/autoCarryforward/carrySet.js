$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			if(page.action == 'ok') {
				action = 'ok';
			}
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	window.setData = function(data) {
		page.addItem(data);
	}
	var page = function() {
		return {
			accsCode: '', //科目体系代码
			action: '',
			carry: {},
			initPage: function() {
				//获取权限数据
				page.reslist = ufma.getPermission();

				page.card = window.ownerData;
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '科目对应关系',
					target: 'zdzj'
				}, {
					step: '方案设置',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);
				if(!window.ownerData.bAgency) {
					this.initKMTX();
					$("#accsCtrol").removeClass('hide');
				} else {
					page.accsCode = window.ownerData.accsCode;
					this.initKJType(window.ownerData.accsCode);
				}

				this.initScheType();
//				this.initVouType();
				this.initvoukind();
				this.initEntryDir();
				this.initSumType();
				//填充
				//this.initCard();
				this.initDetail();
				if(!window.ownerData.bAgency) {
					$('#btnMakeVou').hide();
					ufma.deferred(function() {
						page.cbAccs.select(0);
					});
				}

			},
			initCard: function() {
				//console.log(page.card);
				if(!$.isNull(page.card.scheGuid)) {
					accsCode = page.card.accsCode;
					ufma.deferred(function() {
						if(!window.ownerData.bAgency) {
							page.cbAccs.setValue(accsCode);
						}
						page.accaType.setValue(page.card.accaCode);
						page.scheType.setValue(page.card.scheType);
						page.vouKind.setValue(page.card.vouKind);
						page.vouType.setValue(page.card.vouTypeCode);
						page.entryDir.setValue(page.card.entryDir);
						page.sumType.setValue(page.card.sumType);
						$('#scheName').val(page.card.scheName);
						$('#keyword').val(page.card.keyword);
						$('#remark').val(page.card.remark);
						page.setEnabled(false);
					});
				}

			},
			setEnabled: function(ft) { //设计上没做，先保留
				if(!window.ownerData.bAgency) {
					page.cbAccs.setEnabled(ft);
				}
				page.accaType.setEnabled(ft);
				/*
				page.scheType.setEnabled(ft);
				page.vouType.setEnabled(ft);
				page.entryDir.setEnabled(ft);
				page.sumType.setEnabled(ft);
				*/
			},
			//科目体系
			initKMTX: function() {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.cbAccs = $('#cbAccs').ufmaCombox({
						valueField: 'code',
						textField: 'name',
						data: data,
						name: 'accsCode',
						onchange: function(item) {
							page.accsCode = item.code;
							page.initKJType(item.code);
						},
						initComplete: function() {
							ufma.deferred(function() {

								if(window.ownerData.accsCode == -1) {
									page.cbAccs.select(0);
								} else {
									page.cbAccs.val(window.ownerData.accsCode);
								}
								page.cbAccs.setEnabled(window.ownerData.isSet);
							});
						}
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
				} else {

					var argu = {
						rgCode:page.pfData.svRgCode,
						setYear:page.pfData.svSetYear,
						agencyCode:"*",
						eleCode:"ACCS"
					};
					var url = '/ma/sys/common/getEleTree';
					var callback = function(result) {
						data = result.data; //[{CHR_CODE:'1',text:'新行政会计'},{CHR_NAME:'2',text:'2017新财务'}];
						buildCombox();
					};

					ufma.get(url, argu, callback);
				}
			},
			//会计体系	
			initKJType: function(accsCode) {
				var cacheId = accsCode + '_acca';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.accaType = $('#cbAccaType').ufmaCombox({
						data: data,
						name: 'accaType',
						valueField: 'chrCode',
						textField: 'chrName',
						onchange: function(item) {
							page.accaCode = item.chrCode;
							page.initVouType()
						},
						initComplete: function() {
							ufma.deferred(function() {
								if($.isNull(window.ownerData.accaCode)) {
									page.accaType.select(0);
								} else {
									page.accaType.val(window.ownerData.accaCode);
								}
								page.accaType.setEnabled(window.ownerData.isSet);
							});
						}
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
				} else {
					//var url = '/gl/eleAcca/getRptAccas';
					var url = '/gl/GlAutoCo/getAcceMap/' + accsCode;
					var callback = function(result) {
						data = result.data;
						buildCombox();
					}; 
					ufma.get(url, {}, callback);
				}
			},
			//方案类型	
			initScheType: function() {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_sche';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.scheType = $('#cbScheType').ufmaCombox({
						data: data,
						name: 'scheType',
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME'
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
				} else {
					var url = '/gl/enumerate/AUTO_SCHE_TYPE';
					callback = function(result) {
						data = result.data; //[{ENU_CODE:'1',ENU_NAME:'收支结转'},{ENU_CODE:'2',ENU_NAME:'费用分摊'}];
						buildCombox();
					};
					ufma.get(url, {}, callback);
				}
			},
			//期间类型
			initvoukind: function() {
				var data ;
				function buildCombox() {
					page.vouKind = $('#cbvoukind').ufmaCombox({
						data: data,
						name: 'vouKind',
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME'
					});
				}
				data =[{ENU_CODE:'NJ',ENU_NAME:'年结'},{ENU_CODE:'YJ',ENU_NAME:'月结'}];
				buildCombox();
			},
			//凭证类型	
			initVouType: function() {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_voutype';
				var data = ufma.getObjectCache(cacheId);
				function buildCombox() {
					page.vouType = $('#cbVouType').ufmaCombox({
						data: data,
						name: 'vouTypeCode',
						valueField: 'code',
						textField: 'name'
					});
				}
				if(window.ownerData.agencyCode != '*') {
					if(!$.isNull(data)) {
						buildCombox();
					} else {
						var agencyCode = window.ownerData.agencyCode;
						var year = page.pfData.svSetYear;
						var accacodes = ''
						if(page.accaType != undefined) {
							if(window.ownerData.accacodes == '1,2'){
								accacodes = page.accaType.getValue()
							}else{
								accacodes = '*'
							}
						} else {
							accacodes = '1,2'
						}
						var url = '/gl/eleVouType/getVouType/' + agencyCode + '/' + year + '/' + window.ownerData.acctCode + '/' + accacodes;
						callback = function(result) {
							data = result.data; //[{chrCode:'1',chrName:'记账凭证'}];
							var tr=''
							for(var i=0;i<result.data.length;i++){
								tr += '<option value="' + result.data[i].code + '">' + result.data[i].name + '</option>'
							}
							$("#vouTypeCodesel").html(tr)
							buildCombox();
						};
						ufma.get(url, {}, callback);
					}
				} else {
					data = []
					buildCombox()
				}
			},
			//分录方向	
			initEntryDir: function() {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_entryDir';
				var data = ufma.getObjectCache(cacheId);
				function buildCombox() {
					page.entryDir = $('#cbEntryDir').ufmaCombox({
						data: data,
						name: 'entryDir',
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME'
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
				} else {
					var url = '/gl/enumerate/AUTO_ENTRY_DIR';
					callback = function(result) {
						data = result.data; //[{ENU_CODE:'1',ENU_NAME:'科目余额同方向'},{ENU_CODE:'2',ENU_NAME:'科目余额反方向'}];
						buildCombox();
					};
					ufma.get(url, {}, callback);
					//ufma.ajaxDef(url,'get',{},callback);//使用同步方式，等待前面的任务完成	
				}
			},
			//汇总方式	
			initSumType: function() {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_sumType';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.sumType = $('#cbSumType').ufmaCombox({
						data: data,
						name: 'sumType',
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME'
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
				} else {
					var url = '/gl/enumerate/AUTO_GATHER_TYPE';
					callback = function(result) {
						data = result.data; //[{ENU_CODE:'1',ENU_NAME:'相同科目汇总生成'},{ENU_CODE:'2',ENU_NAME:'科目明细'}];
						buildCombox();
					};
					ufma.get(url, {}, callback);
					//ufma.ajaxDef(url,'get',{},callback);//使用同步方式，等待前面的任务完成		
				}
			},
			initDetail: function() {
				if($.isNull(window.ownerData.scheGuid)) return false;
				var url = '/gl/GlAutoCo/search/' + window.ownerData.scheGuid;
//				var url = '/gl/GlAutoCo/searchDet/' + window.ownerData.scheGuid;

				var callback = function(result) {
					if($.isNull(result.data) || result.data.length == 0) return false;
					if(result.data[0].agencyCode == '*') {
						$(".iscbagery").hide()
					}
					var detail = result.data[0].glAutoDeatil;
					if($.isNull(detail)) return false;
					var groupId = '';
					var itemData = {};
					for(var i = 0; i < detail.length; i++) {
						var item = detail[i];
						if(groupId != item.groupId) {
							page.addItem(itemData);
							groupId = item.groupId;
							itemData = {};
							itemData.outData = {};
							itemData.inData = {};
						}
						var tmpItem = {};

						if(item.inOut == '1') {
							itemData.outAcco = item.accoCode + ' ' + item.chrName;
							itemData.outData = item;
						} else {
							itemData.inAcco = item.accoCode + ' ' + item.chrName;
							itemData.inData = item;
						}
					}
					page.addItem(itemData);
				}
				ufma.get(url, {}, callback);
			},
			addItem: function(itemData) {
				if($.isNull(itemData) || $.isEmptyObject(itemData)) return false;
				var trid = itemData.outData.groupId;
				bNew = $('tr[guid="' + trid + '"]').length == 0;
				page.carry[trid] = itemData;

				function transDir(dir) {
					switch(dir) {
						case '1':
							return '余额';
						case '2':
							return '借方';
						case '3':
							return '贷方';
						default:
							return dir;
					}
				}

				function transInout(inOut) {
					switch(inOut) {
						case '1':
							return '转出';
						case '2':
							return '转入';
						default:
							return inOut;
					}
				}
				var iNo = $('#accoList tr').length;
				iNo++;
				var $outRow = $('<tr detailGuid="' + itemData.outData.detailGuid + '" id="' + trid + '_out" guid="' + trid + '"><td>' + iNo + '</td><td>' + itemData.outData.descpt + '</td><td>' + itemData.outAcco + '</td><td>' + transInout(itemData.outData.inOut) + '</td><td>' + transDir(itemData.outData.transCon) + '</td><td>' + itemData.outData.proportion + '</td><td rowspan=2><span class="icon icon-edit margin-right-8 btn-edit"></span><span class="icon icon-trash btn-del btn-permission btn-delete"></span></td></tr>');
				if(bNew) {
					$outRow.appendTo($('#accoList'));
				} else {
					$('#' + trid + '_out').replaceWith($outRow);
				}

				iNo++;
				var $inRow = $('<tr detailGuid="' + itemData.inData.detailGuid + '" id="' + trid + '_in" guid="' + trid + '"><td>' + iNo + '</td><td>' + itemData.inData.descpt + '</td><td>' + itemData.inAcco + '</td><td>' + transInout(itemData.inData.inOut) + '</td><td>' + transDir(itemData.inData.transCon) + '</td><td>' + itemData.inData.proportion + '</td></tr>');
				if(bNew) {
					$inRow.appendTo($('#accoList'));
				} else {
					$('#' + trid + '_in').replaceWith($inRow);
				}
				$('#' + trid + '_out .btn-del').click(function() {
					ufma.confirm("您确定要删除当前科目对应关系？", function(action) {
						if(action) {
							page.delItem(trid);
						}
					});

				});
				$('#' + trid + '_out .btn-edit').click(function() {
					page.editItem(trid);
				});
				for(var i=0;i<$("#accoList").find('tr').length;i++){
					$("#accoList").find('tr').eq(i).find('td').eq(0).html(i+1)
				}
				//权限判断
				ufma.isShow(page.reslist);
			},
			delItem: function(trid) {
				/*
				var argu = [];
				$('tr[guid="' + trid + '"]').each(function() {
					var detailGuid = $(this).attr('detailGuid');
					if(!$.isNull(detailGuid)) {
						argu.push({ 'detailGuid': detailGuid });
					}
				});
				if(argu.length == 0) {
					delete page.carry[trid];
					$('tr[guid="' + trid + '"]').remove();
					return false;
				}
				*/
				delete page.carry[trid];
				$('tr[guid="' + trid + '"]').remove();
				for(var i=0;i<$("#accoList").find('tr').length;i++){
					$("#accoList").find('tr').eq(i).find('td').eq(0).html(i+1)
				}
				/*前端不处理，保存时处理
				var url = '/gl/GlAutoCo/deleteAcco';
				var callback = function(result) {
					delete page.carry[trid];
					$('tr[guid="' + trid + '"]').remove();
					ufma.showTip('科目对应关系删除成功！', function() {}, 'success');
				};
				ufma.delete(url, argu, callback);
				*/
			},
			editItem: function(trid) {
				var data = {};
				data['agencyCode'] = window.ownerData.agencyCode;
				data['acctCode'] = window.ownerData.acctCode;
				data['accaCode'] = page.accaType.getValue();
				data['accsCode'] = page.accsCode;
				data['carry'] = $.extend(true, {}, page.carry[trid]);
//				var inid = data['carry'].inData.detailGuid
//				var outid = data['carry'].outData.detailGuid
//				if(data['carry'].inData.glAutoAss.length>0){
//				}else{
//					ufma.ajaxDef('/gl/GlAutoCo/searchDet/'+ window.ownerData.scheGuid+'/'+inid,'get','',function(result){
//						data['carry'].inData.glAutoAss = result.data[0].glAutoAss
//					})
//				}
//				if(data['carry'].outData.glAutoAss.length>0){
//				}else{
//					ufma.ajaxDef('/gl/GlAutoCo/searchDet/'+ window.ownerData.scheGuid+'/'+outid,'get','',function(result){
//						data['carry'].outData.glAutoAss = result.data[0].glAutoAss
//					})
//				}
				parent.window.showCarryKM(data);
			},
			//循环判断每个科目的比例是否大于100
			checkTotal: function() {
				var accoCode = '';
				var num = 0;
				var fx = '';
				for(var i = 0;i < $("#accoList").find('tr').length;i++){
					accoCode = $("#accoList").find('tr').eq(i).find('td').eq(2).text().split(' ')[0];
					num = parseFloat($("#accoList").find('tr').eq(i).find('td').eq(5).text());
					fx = $("#accoList").find('tr').eq(i).find('td').eq(3).text();
					if (fx == '转入') {
						continue;
					}
					//var trid = $("#accoList").find('tr').eq(i).attr("id");
					//	carry = $.extend(true, {}, page.carry[trid.split('_')[0]]);
					for(var j = 0;j < $("#accoList").find('tr').length;j++){
						var _accoCode = $("#accoList").find('tr').eq(j).find('td').eq(2).text().split(' ')[0];
						var _num = parseFloat($("#accoList").find('tr').eq(j).find('td').eq(5).text());
						var _fx = $("#accoList").find('tr').eq(j).find('td').eq(3).text();
						if (accoCode == _accoCode && j != i && fx == _fx) {
							num += _num;
						}
						if (num > 100) break;
					}
					if (num > 100) break;
				}
				if (num > 100) {
					return "科目"+accoCode + "比例大于100,请重新修改!";
				}
				return "";
			},
			save: function() {
				ufma.showloading('正在保存中，请耐心等待...');
				if(!window.ownerData.bAgency) {
					page.accsCode = page.cbAccs.getValue();
				}
				$('#btn-save').addClass('disabled')
				$('#btnMakeVou').removeClass('hidden');
				$('.add-success').removeClass('hidden');
				$('.add-fail').addClass('hidden');
				if(window.ownerData.bAgency && window.ownerData.isAgency == '0') {
					ufma.showTip('系统级方案，单位级无法修改', function() {}, 'warnning');
					$('#btnMakeVou').addClass('hidden');
					$('.add-success').addClass('hidden');
					$('.add-fail').removeClass('hidden');
					// _close('cancel');
					var timeId = setTimeout(function() {
						_close('cancel');
						clearTimeout(timeId);
					}, 4000);
					return false;
				}
				
				if(page.accsCode == '') {
					ufma.alert('请选择科目体系！');
					return false;
				}
				page.accaCode = page.accaType.getValue();
				if(page.accaCode == '') {
					ufma.alert('请选择会计体系！');
					return false;
				}
				var argu = $('#savemb').serializeObject();
				argu['agencyCode'] = window.ownerData.agencyCode;
				argu['acctCode'] = window.ownerData.acctCode;
				argu['accsCode'] = page.accsCode;
				argu['accaCode'] = page.accaCode;
				argu['orderSeq'] = window.ownerData.seqindex;
				if(!$.isNull(page.card.scheGuid)) {
					argu['scheGuid'] = page.card.scheGuid;
				}
				if(!window.ownerData.bAgency) {
					page.accsCode = page.cbAccs.getValue();
				}
				argu['isAgency'] = window.ownerData.bAgency;
				argu['glAutoDeatil'] = [];
				var iSeq = 0;
				$.each(page.carry, function(k, v) {
					iSeq++;
					v.outData.seq = iSeq;
					v.outData.accaCode = page.accaCode
					if(v.outData.glAutoAss == ''){
						delete v.outData.glAutoAss
					}
					argu['glAutoDeatil'].push(v.outData);
					iSeq++;
					v.inData.seq = iSeq;
					v.inData.accaCode = page.accaCode
					if(v.inData.glAutoAss == ''){
						delete v.inData.glAutoAss
					}
					argu['glAutoDeatil'].push(v.inData);
				});
				//console.log(JSON.stringify(argu));
				var url = '/gl/GlAutoCo/save';
				var callback = function(result) {
					if(result.flag == 'success') {
						page.card.scheGuid = result.data.scheGuid;
						page.action = 'ok';
						page.timeline.next();
						$('#btn-prev').removeClass('hide');
						$('#btn-save').addClass('hide');
						ufma.hideloading()
					}
				};
				//console.log(argu);
				ufma.ajaxDef(url,'post', argu, callback);
				setTimeout(function(){
					$('#btn-save').removeClass('disabled')
					ufma.hideloading()
				},5000)
			},
			onEventListener: function() {
				$('#btn-next').on('click', function(e) {
					if(page.timeline.stepIndex() == 1) {
						if(page.accsCode == '') {
							ufma.alert('请选择科目体系！');
							return false;
						}
						if(page.accaCode == '') {
							ufma.alert('请选择会计体系！');
							return false;
						}
						if($("#accoList").children().length == 0) {
							ufma.alert('科目对应关系不能为空！');
							return false;
						}
						//验证合计100%
						/*var msg = page.checkTotal();
						if(msg != '') {
							ufma.alert(msg);
							return false;
						}*/
					}
					page.timeline.next();
					if(page.timeline.stepIndex() == 1) {
						$('#btn-prev').removeClass('hide');
						$('#btn-save').addClass('hide');
					}
					if(page.timeline.stepIndex() == 2) {
						$('#btn-next').addClass('hide');
						$('#btn-prev').removeClass('hide');
						$('#btn-save').removeClass('hide');
						page.initCard();
					}
				});
				$('#btn-prev').click(function() {
					page.timeline.prev();
					if(page.timeline.stepIndex() == 1) {
						$(this).addClass('hide');
						$('#btn-next').removeClass('hide');
						$('#btn-save').addClass('hide');
					}
					if(page.timeline.stepIndex() == 2) {
						$('#btn-prev').removeClass('hide');
						$('#btn-next').addClass('hide');
						$('#btn-save').removeClass('hide');
					}
				});
				$('#btn-save').click(function() {
					//如果有必填项没填写，不进行操作
					if($("#scheName").val() == "") {
						ufma.alert('请填写方案名称！');
						return false;
					}
					if($("#cbScheType_value").val() == "") {
						ufma.alert('请选择方案类型！');
						return false;
					}

//					if(!window.ownerData.bAgency) {
//						$("#cbVouType_value").val('*')
//					} else {
//						if($("#cbVouType_value").val() == "") {
//							ufma.alert('请选择凭证类型！');
//							return false;
//						}
//					}
					if($("#cbEntryDir_value").val() == "") {
						ufma.alert('请选择分录方向！');
						return false;
					}
					if($("#cbSumType_value").val() == "") {
						ufma.alert('请选择汇总方式！');
						return false;
					}
					page.save();
					
				});

				$('#btn-cancel').click(function() {
					_close('cancel');
				});

				$('#addCarrySetKM').click(function(e) {
					if($.isNull(page.accsCode)) {
						ufma.alert('请选择科目体系！');
						return false;
					}
					if($.isNull(page.accaCode)) {
						ufma.alert('请选择会计体系！');
						return false;
					}
					var data = {};
					data['agencyCode'] = window.ownerData.agencyCode;
					data['acctCode'] = window.ownerData.acctCode;
					data['accaCode'] = page.accaCode;
					data['accsCode'] = page.accsCode;
					parent.window.showCarryKM(data);
				});

				var vouclick  = true;
				$('#btnMakeVou').click(function() {
					if(page.vouKind.getValue() == 'NJ'){
						$('.fisperddiv').hide()
						$("#vouFisperd option[value=12]").attr('selected',true).prop('selected',true)
//						if (vouclick) {
//							vouclick= false;
//							var agencyCode = window.ownerData.agencyCode;
//							var acctCode = window.ownerData.acctCode;
//							var optionguid= $("#vouFisperd option:selected").attr('guid')
//							var fisperd= 12
//							var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + page.card.scheGuid+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd;
//							var callback = function(result) {
//								vouclick= true;
//								ufma.showTip('成功生成凭证！', function() {}, 'success');
//							};
//							ufma.get(url, {}, callback);
//						}
					}else{
						$('.fisperddiv').show()
						
						var url = '/gl/publish/getMinOpenFisPerd';
						var urldata = {
							"agencyCode":window.ownerData.agencyCode,
							"acctCode": window.ownerData.acctCode,
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
						page.editors = ufma.showModal('vouFisperdmodal', 550, 300);
//					var url = '/gl/GlAutoCo/buildVou?agencyCode=' + window.ownerData.agencyCode + '&acctCode=' + window.ownerData.acctCode + '&scheGuid=' + page.card.scheGuid;
//					var callback = function(result) {
//						ufma.showTip('成功生成凭证！', function() {}, 'success');
//					};
//					ufma.get(url, {}, callback);
				});
				$(document).on('click','#btn-vouFisperdqr',function(e){
					ufma.showloading('正在加载中，请耐心等待',0);
					var agencyCode = window.ownerData.agencyCode;
					var acctCode = window.ownerData.acctCode;
					var optionguid= $("#vouFisperd option:selected").attr('guid')
					var fisperd= $("#vouFisperd option:selected").attr('value')
					var voutypecode= $("#vouTypeCodesel option:selected").attr('value')
					var  hex_md5svUserCode = ''
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
					}
					var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + page.card.scheGuid+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd+'&vouTypeCode=' + voutypecode;
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
						ufma.showTip(msgs, function() {}, 'success');
					};
					ufma.get(url, {}, callback);
                    $(this).attr('disabled',true);
                    var $that = $(this);
                    function scc(){
                        $.ajax({
                            url: '/gl/GlAutoCo/buildVouCollect/' + page.card.scheGuid+'?ajax=1&rueicode='+hex_md5svUserCode,
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
                                    },3000)
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
			},
			//此方法必须保留
			init: function() {
				page.pfData = ufma.getCommonData();
				ufma.parse();
				this.initPage();
				this.onEventListener();
				if(!window.ownerData.bAgency) {
					$(".iscbagery").hide()
				}
				var postSet = {
					//修改页面初始化报错问题
					acctCode: window.ownerData.acctCode,//$("#cbAcct").getObj().getValue(),
					agencyCode: window.ownerData.agencyCode,//$("#cbAgency").getObj().getValue(),
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
	}();
	/////////////////////
	page.init();
});
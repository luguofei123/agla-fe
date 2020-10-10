$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			}
			if(action == 'ok') {
				data['data'] = page.getDetailData();
			};
			window.closeOwner(data);
		}
	}
	var page = function() {
		var accoOutInit = false;
		var accoInInit =  false;
		var changeOutAccoCode = "";
		var changeInAccoCode = "";
		return {
			groupId: '',
			initPage: function() {
				$('#fzitems').css('min-height', $('.ufma-layout-up').height() - $('.ufma-layout-down').outerHeight(true) - 60);
				this.initAccoOut();
				this.initAccoIn();
				this.initAccoDir();
				
				var interval = setInterval(function () {
					if (page.accoOutInit && page.accoInInit) {
						page.fillData();
						page.showRemark();
						clearInterval(interval);
					}
			    }, 200);
				
				/*var timeid = setTimeout(function() {
					clearTimeout(timeid);
					page.fillData();
					page.showRemark();
					timeid = null;
				}, 1000);*/
			},
			fillData: function() {
				var carry = window.ownerData.carry;
				//console.log(carry);
				if($.isNull(carry)) return false;
				var outData = carry.outData;
				page.groupId = outData.groupId;
				var outAcco = $.isNull(page.changeOutAccoCode) ? carry.outAcco : page.changeOutAccoCode;
				if (!$.isNull(page.accoOut)) {
					page.accoOut.setValue($.bof(outAcco, ' '), outAcco);
				}
				var inAcco = $.isNull(page.changeInAccoCode) ? carry.inAcco : page.changeInAccoCode;
				if (!$.isNull(page.accoIn)) {
					page.accoIn.setValue($.bof(inAcco, ' '), inAcco);
				}
				if (!$.isNull(page.accoDir)) {
					page.accoDir.setValue(outData.transCon);
				}
				
				$('#descpt').val(outData.descpt);
				$('#proportion').val(outData.proportion);

				function fillFZCombox(inout, valData) {
					//console.log(valData);
					$.each(valData, function(key, value) {
						if(!$.isNull(value)) {
							if (value.toString().startsWith(",")) {
								value = value.substring(1);
							}
							if (value == "*") {
								value = "";
							}
							$('#fzitems .row .' + inout + ' .ufma-combox[name="' + key + '"]').each(function() {
								var comboxId = $(this).attr('id');
								if($('#' + comboxId).hasClass('ufma-textboxlist')) {
									//$('#'+comboxId).ufmaTextboxlist().setValue(value,text);
									$('#' + comboxId).ufmaTextboxlist().val(value);
								} else {
									$('#' + comboxId).ufmaTreecombox().val(value);
								}

							});
						};
					});
				}
				fillFZCombox('out', carry.outData.glAutoAss[0]);
				fillFZCombox('in', carry.inData.glAutoAss[0]);
			},
			initAccoOut: function() {
				var argu = {};
				argu['agencyCode'] = window.ownerData.agencyCode;
				argu['acctCode'] = window.ownerData.acctCode;
				argu['setYear'] = page.pfData.svSetYear;
				argu['rgCode'] = page.pfData.svRgCode;
				argu['accaCode'] = window.ownerData.accaCode;
				argu['accsCode'] = window.ownerData.accsCode;
				
				var cacheId = argu['agencyCode'] + argu['acctCode'] + argu['setYear'] + argu['accsCode'] + '_out';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.accoOut = $('#cbAccoOut').ufmaTreecombox({
						valueField: 'id',
						textField: 'codeName',
						leafRequire: false,
						name: 'accoCode',
						readOnly: false,
						data: data,
						onchange: function(node) {
							$('#fzitems .row .out').html('');
							// $('#fzitems').children().each(function(index, e) {
							// 	var e1 = $(e).children();
							// 	if($(e1[0]).children().length <= 1 && $(e1[1]).children().length <= 1) {
							// 		$(e).remove();
							// 	}
							// });
							page.changeOutAccoCode = page.accoOut.getText();
							page.showFZLB('out', page.accoOut.getValue());
						}
					});
				}
				if(!$.isNull(data)) {
					buildCombox();
					page.accoOutInit = true;
					$('#cbAccoOut_input').attr('autocomplete', 'off')
				} else {
					var url = '/gl/sys/coaAcc/getRptAccoTree';
					var callback = function(result) {
						data = result.data.treeData;

						buildCombox();
						page.accoOutInit = true;
						$('#cbAccoOut_input').attr('autocomplete', 'off')
						ufma.setObjectCache(cacheId, data);
					}
					ufma.get(url, argu, callback);
				}
			},
			initAccoIn: function() {
				var argu = {};
				argu['agencyCode'] = window.ownerData.agencyCode;
				argu['acctCode'] = window.ownerData.acctCode;
				argu['setYear'] = page.pfData.svSetYear;
				argu['rgCode'] = page.pfData.svRgCode;
				argu['accaCode'] = window.ownerData.accaCode;
				argu['accsCode'] = window.ownerData.accsCode;

				var cacheId = argu['agencyCode'] + argu['acctCode'] + argu['setYear'] + argu['accsCode'] + '_in';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					page.accoIn = $('#cbAccoIn').ufmaTreecombox({
						valueField: 'id',
						textField: 'codeName',
						name: 'accoCode',
						readOnly: false,
						leafRequire: true,
						popupWidth: 1.5,
						data: data,
						onchange: function(node) {
							$('#fzitems .row .in').html('');
							// $('#fzitems').children().each(function(index, e) {
							// 	var e1 = $(e).children();
							// 	if($(e1[0]).children().length <= 1 && $(e1[1]).children().length <= 1) {
							// 		$(e).remove();
							// 	}
							// });
							page.changeInAccoCode = page.accoIn.getText();
							page.showFZLB('in', page.accoIn.getValue());

						}
					});
				}

				if(!$.isNull(data)) {
					buildCombox(data);
					page.accoInInit = true;
					$('#cbAccoIn_input').attr('autocomplete', 'off')
				} else {
					var url = '/gl/sys/coaAcc/getRptAccoTree';
					//console.log(url);
					//console.log(argu);
					var callback = function(result) {
						data = result.data.treeData;
						buildCombox();
						page.accoInInit = true;
						$('#cbAccoIn_input').attr('autocomplete', 'off')
						ufma.setObjectCache(cacheId, data);
					}
					ufma.get(url, argu, callback);
				}
			},
			initAccoDir: function() {
				var data = [{
					'id': '1',
					'name': '余额'
				}, {
					'id': '2',
					'name': '借方'
				}, {
					'id': '3',
					'name': '贷方'
				}];
				page.accoDir = $('#cbAccoDir').ufmaCombox({
					valueField: 'id',
					textField: 'name',
					name: 'scheType',
					data: data,
					onchange: function(node) {
						//console.log(node);
					}
				});
			},
			showFZLB: function(inout, accoCode) {
				var agencyCode = window.ownerData.agencyCode;
				var acctCode = window.ownerData.acctCode;
				var accsCode;
				if($.isNull(window.ownerData.accsCode)) {
					accsCode = null;
				} else {
					accsCode = window.ownerData.accsCode;
				}
				var cacheId = agencyCode + acctCode + accoCode;
				var data = ufma.getObjectCache(cacheId);
				if(!$.isNull(data)) {
					if(inout == 'out') {
						page.showOutFZLB(data);
					} else {
						page.showInFZLB(data);
					}
				} else {
					var argu = {
						'agencyCode': agencyCode,
						'acctCode': acctCode,
						'accsCode': accsCode,
						'accoCode': accoCode
					}

					var url = '/gl/sys/coaAcc/getAccoItem';
					var callback = function(result) {

						if(!$.isNull(result.data)) {
//							data = result.data[0].items;
							data = result.data
							ufma.setObjectCache(cacheId, data);
							if(inout == 'out') {
								page.showOutFZLB(data);
							} else {
								page.showInFZLB(data);
							}

						}

					}

					ufma.post(url, argu, callback);
				}

			},
			initFZItem: function(inout, type, code, name,seldata) {
				code = code.toLowerCase() + 'Code';
				code = code.replace('_i', 'I');

				var agencyCode = window.ownerData.agencyCode;
//				var data = ufma.getObjectCache(agencyCode + code);
				var data = seldata

				function buildFZRow() {
					var $row = $('.' + code);
					if($row.length == 0) {
						$row = $('<div class="row ' + code + '"><div class="inline-block out" style="width:50%;position:relative;height:40px;"></div><div class="inline-block in" style="width:50%;position:relative;height:40px;"></div></div>').appendTo('#fzitems');
					}
					$col = $('.' + code + ' .' + inout);
				
					if(inout == 'in') {
						var comboxId = $.getGuid();
						$('<div class="form-group inline-block"><label class="control-label em6">' + name + '：</label><div class="control-element"><div id="' + comboxId + '" class="ufma-treecombox w180" name="' + code + '"></div></div></div>').appendTo($col);
						if($('.' + code + ' .' + 'out').find('.ufma-textboxlist').length>0){
							$('<span class="remark" style="display:inline-block;position:absolute;top:16px;margin-left:-20px;font-family: MicrosoftYaHei;font-size: 10px;color: #999999;">自动按转出' + name + '转入</span>').appendTo($col);
						}
						$('#' + comboxId).ufmaTreecombox({
							readOnly: false,
							valueField: 'id',
							textField: 'codeName',
							name: code,
							leafRequire: true,
							data: data,
							expand: false
						});
					} else {
						var comboxId = $.getGuid();
						$('<div class="form-group inline-block"><label class="control-label em6">' + name + '：</label><div class="control-element"><div id="' + comboxId + '" class="ufma-textboxlist w180" name="' + code + '"></div></div></div>').appendTo($col);
						$('<span class="remark" style="display:inline-block;position:absolute;top:16px;margin-left:-20px;font-family: MicrosoftYaHei;font-size: 10px;color: #999999;">按余额的' + name + '转出</span>').appendTo($col);
						$('#' + comboxId).ufmaTextboxlist({
							valueField: 'id',
							textField: 'codeName',
							name: code,
							leafRequire: true,
							data: data,
							expand: false
						});
					}
				}
				if(!$.isNull(data)) {
					buildFZRow();
					page.fillData();
				} else {
					var argu = {
						'agencyCode': agencyCode,
						'eleCode': type
					}
					var url = '/gl/initial/getAccItemTree';

					var callback = function(result) {
						data = result.data;
						ufma.setObjectCache(agencyCode + code, data);
						buildFZRow();
						// page.showRemark();
						page.fillData();
					};
					ufma.get(url, argu, callback);
				}
			},
			showOutFZLB: function(data) {
				for(var i = 0; i < data.length; i++) {
					var item = data[i];
					page.initFZItem('out', item.accItemType, item.accitemCode, item.eleName,item.accItemDataList);
				}
			},
			showInFZLB: function(data) {

				for(var i = 0; i < data.length; i++) {
					var item = data[i];
					page.initFZItem('in', item.accItemType, item.accitemCode, item.eleName,item.accItemDataList);
				}

			},
			showRemark: function() {
				$('#fzitems .row').each(function() {
					var $outBox = $(this).find('.out');
					var $inBox = $(this).find('.in');
					//
					if($inBox.find('.form-group').length == 0) {
						$inBox.html('<span class="remark" style="display:inline-block;position:absolute;top:16px;margin-left:100px;font-family: MicrosoftYaHei;font-size: 10px;color: #999999;">无对应辅助核算项</span>');
					}
					if($outBox.find('.form-group').length == 0) {
						$inBox.find('.remark').html('<span style="color: #108EE9;">请指定转出项</span>');
					}
					if($inBox.find('.form-group').length == 0 && $outBox.find('.form-group').length == 0) {
						$(this).remove();
					}
				});
			},
			recur: function(comboxId, val) {
				if($('#' + comboxId).hasClass('ufma-textboxlist')) {
					var data = $('#' + comboxId).ufmaTextboxlist().setting.data;
					var id = $('#' + comboxId).ufmaTextboxlist().setting.valueField;
					for(var i = 0; i < data.length; i++) {
						if(data[i].IS_LEAF==1){							
							val += data[i][id]+',';
						};
					}
				} else {
					var data = $('#' + comboxId).ufmaTreecombox().setting.data;
					var id = $('#' + comboxId).ufmaTreecombox().setting.valueField;
					for(var i = 0; i < data.length; i++) {
						val += data[i][id] + ",";
					}
				}
				return val;
			},
			getDetailData: function() {
				var groupId = $.getGuid();
				if(page.groupId != '') groupId = page.groupId;
				page.groupId = groupId;
				//转出
				var outData = {
					"groupId": groupId,
					"accaCode": window.ownerData.acctCode, //会计体系
					"accoCode": page.accoOut.getValue(), //
					"acctCode": window.ownerData.acctCode, //账套号
					"agencyCode": window.ownerData.agencyCode, //单位代码
					"descpt": $('#descpt').val(), //摘要
					"inOut": "1", //转入转出
					"proportion": $('#proportion').val(), //比例
					"seq": 1, //对应关系的顺序号
					"transCon": page.accoDir.getValue(), //方向
					"glAutoAss": [{
						"accaCode": window.ownerData.acctCode, //会计体系
						"accoCode": page.accoOut.getValue(), //
						"acctCode": window.ownerData.acctCode, //账套号
						"agencyCode": window.ownerData.agencyCode //单位代码
					}]
				}
				var outAssText = {};
				$('#fzitems .row .out .ufma-combox').each(function() {
					var cbId = $(this).attr('id');
					var code = $(this).attr('name');
					var glautoAss = $('#' + cbId + '_value').val();
					if(glautoAss == null || glautoAss == "" || glautoAss == undefined) {
//						glautoAss = page.recur(cbId, glautoAss);
//						glautoAss = glautoAss.substr(0, glautoAss.length - 1);
						glautoAss = '*'
					}
					outData.glAutoAss[0][code] = glautoAss;
					outAssText[code] = $('#' + cbId + '_text').val();
				});
				//转入
				var inData = {
					"groupId": groupId,
					"accaCode": window.ownerData.acctCode, //会计体系
					"accoCode": page.accoIn.getValue(), //
					"acctCode": window.ownerData.acctCode, //账套号
					"agencyCode": window.ownerData.agencyCode, //单位代码
					"descpt": $('#descpt').val(), //摘要
					"inOut": "2", //转入转出
					"proportion": $('#proportion').val(), //比例
					"seq": 2, //对应关系的顺序号
					"transCon": page.accoDir.getValue(), //方向
					"glAutoAss": [{
						"accaCode": window.ownerData.acctCode, //会计体系
						"accoCode": page.accoIn.getValue(), //
						"acctCode": window.ownerData.acctCode, //账套号
						"agencyCode": window.ownerData.agencyCode //单位代码
					}]
				};

				var inAssText = {};
				$('#fzitems .row .in .ufma-combox').each(function() {
					var cbId = $(this).attr('id');
					var code = $(this).attr('name');
					//var code = code.toLowerCase() + 'Code';
					//code = code.replace('_i','I');
					var glautos = $('#' + cbId + '_value').val();
					if(glautos == null || glautos == "" || glautos == undefined) {
//						glautos = page.recur(cbId, glautos);
//						glautos = glautos.substr(0, glautos.length - 1);
						glautos = ''
					}
					inData.glAutoAss[0][code] = glautos;
					inAssText[code] = $('#' + cbId + '_text').val();
				});
				var accoOutgetText = ''
				if($.eof(page.accoOut.getText(), ' ') == undefined){
					accoOutgetText = '全部'
				}else{
					accoOutgetText=$.eof(page.accoOut.getText(), ' ')
				}
				var carryItem = {
					'outData': outData,
					'inData': inData,
					'outAcco': page.accoOut.getValue() + ' ' + accoOutgetText,
					'inAcco': page.accoIn.getValue() + ' ' + $.eof(page.accoIn.getText(), ' '),
					'inAssText': inAssText,
					'outAssText': outAssText
				};
				return carryItem;
			},
			checkFZHS: function() {
				var msg = '';
				$('#fzitems .row').each(function() {
					if($(this).find('.out').html() == '' && $(this).find('.in input.ufma-combox-value').val() == '') {
						msg = '转入科目必须设置' + $(this).find('.in .control-label').html().replaceAll('：', '') + '辅助核算!';
					}
				});
				return msg;
			},
			onEventListener: function() {
				$('#btn-cancel').click(function() {
					_close('cancel');
				});
				$('#btn-ok').click(function() {

					if(page.accoOut.getValue() == '') {
						ufma.alert('请选择转出科目！');
						return false;
					}
					if(page.accoDir.getValue() == '') {
						ufma.alert('请选择方向！');
						return false;
					}
					if($('#descpt').val() == '') {
						ufma.alert('请输入摘要！');
						return false;
					}
					if($('#proportion').val() == '') {
						ufma.alert('请输入转出比例！');
						return false;
					}
					if(isNaN(parseFloat($('#proportion').val()))) {
						ufma.alert('请在转出比例中输入数字！');
						return false;
					}
					if(parseFloat($('#proportion').val())>100) {
						ufma.alert('转出比例不能大于100%！');
						return false;
					}
					if(page.accoIn.getValue() == '') {
						ufma.alert('请选择转入科目！');
						return false;
					}
					var msg = page.checkFZHS();
					if(msg != '') {
						ufma.alert(msg);
						return false;
					}
					_close('ok');
				});

			},
			clearSessionCache: function() {
				var key, isDelete;
				var agencyCode = window.ownerData.agencyCode;
				var cacheData = window.sessionStorage;
				for(var i = 0, len = window.sessionStorage.length; i < len; i++) {
					key = cacheData.key(i);
					isDelete = key.substring(0, agencyCode.length) === agencyCode;
					if(isDelete) {
						ufma.removeCache(key);
						i--;
						len--;
					}
				}
			},
			//此方法必须保留
			init: function() {
				page.clearSessionCache()
				// ufma.clearCache();
				ufma.parse();
				page.pfData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	/////////////////////
	page.init();
});

String.prototype.startsWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
};
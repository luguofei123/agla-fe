$(function () {
	var coaMneuId = '4c4ad18d-eb1c-4053-b590-6296fa6c5ada';
	var page = function () {
		return {
			namespace: 'accSys',
			curData: new Object(),
			editMode: 'new',
			get: function (tag) {
				return $('#' + page.namespace).find(tag);
			},
			fjfa: [],

			openEdtWin: function (curData) {
				if (curData) {
					this.curData = curData;
					page.lastVer = this.curData.lastVer;
					this.editMode = 'edit';
					$('#accSysSaveAll').addClass('hide');
					$('#accSysCancelAll').addClass('hide');
					$('#accSysCloseAll').removeClass('hide');
					$('#btnAccSysBaseEdit').removeClass('hide');
					$('#btnAccSysKJYSEdit').removeClass('hide');
					$('#accSysDelete').removeClass('hide');

					$('#accSysAddKJYS').addClass('hide');
					this.initWindow(curData);
					$('#bmgz').find('b').addClass('hide');
				} else {
					this.editMode = 'new';
					$('#accsys-base')[0].reset();
					//this.get('.base-info').addClass('hide');
					this.setBaseFormEdit(true);
					$('#accSysSaveAll').removeClass('hide');
					$('#accSysCancelAll').removeClass('hide');
					$('#accSysAddKJYS').removeClass('hide');
					$('#accSysCloseAll').addClass('hide');
					$('#btnAccSysBaseEdit').addClass('hide');
					$('#btnAccSysKJYSEdit').addClass('hide');
					$('#accSysDelete').addClass('hide');
					$('#accsys-base')[0].reset();
					$('#accSysKJYS tbody').html('');
					$('#cwkjphgs li').html('');
					$('#yskjphgs li').html('');
				}
				page.editor = ufma.showModal('accsys-edt', 1100);
				page.formdata = $('#accsys-base').serializeObject();
				$('#carryOverType').ufmaCombox().val("1");
				$('#bmgz select').each(function () {
					$(this).removeClass("error");
				});
				ufma.hideInputHelp('chrCode');
			},
			initWindow: function (curData) {
				$('#accsys-base').setForm(curData);
				//bug73807--科目体系上增加属性：上级科目体系，只能选择已存在的科目体系作为当前科目体系的上级科目体系-zsj
				page.parentCode = curData.parentCode;
				page.parentCodeName = curData.parentCodeName;
				page.carryOverType.val(curData.carryOverType);
				$("#carryOverTypeName").text(page.carryOverType.getText());
				this.setBaseFormEdit(false);
				if (curData.codeRule)
					page.fjfa = curData.codeRule.split('-');
				this.setNumSelect();
				$('#accSysKJYS tbody').html('')
				page.reckonPHGS(curData.eleAcceLs);
				$.each(curData.eleAcceLs, function (idx, row) {
					page.newKJYS(row);

				});
				page.setKJYSFormEdit(false);
			},
			setBaseFormEdit: function (enabled) {
				if (enabled) {
					$('#accsys-base .control-element .form-control,#accsys-base .control-element .btn-group').removeClass('hide');
					$('#accsys-base .control-element .control-label').addClass('hide');
					//guohx 解决当点开编辑框 点击取消 再点开时编码规则为空问题  20200302
					$("#bmgz").find(".select-default").each(function (i) {
						$(this).find(".num-select").val(page.fjfa[i]);
					});
					if (this.editMode == 'edit') {
						$('#accSysBaseBtnGroup').removeClass('hide');
					} else {
						$('#accSysBaseBtnGroup').addClass('hide');
					}
					$('#btnAccSysBaseEdit').addClass('hide');
					page.parentCodeTree.val(page.parentCode);
				} else {
					$('#btnAccSysBaseEdit').removeClass('hide');
					$('#accSysBaseBtnGroup').addClass('hide');
					$('#accsys-base .control-element .form-control,#accsys-base .control-element .btn-group').addClass('hide');
					$('#accsys-base .control-element .control-label').removeClass('hide');
					//bug73807--科目体系上增加属性：上级科目体系，只能选择已存在的科目体系作为当前科目体系的上级科目体系-zsj
					$("#parentCodeName").text($('#parentCode_input').val());
					$('#parentCodeName').html(page.parentCodeName);
					$('#parentCodeName').attr("title", page.parentCodeName);
				}
				$('#accsys-base .control-element')[enabled ? 'removeClass' : 'addClass']('disabled');
			},
			setKJYSFormEdit: function (enabled) {
				if (enabled) {
					$('#accsys-kjys .control-element .form-control').removeClass('hide');
					$('#accsys-kjys .control-element .control-label').addClass('hide');
					$('#accsys-kjys .control-element .form-combox').removeClass('hide');
					if (this.editMode == 'edit') {
						$('#accSysAddKJYS').removeClass('hide');
						$('#accSysKJYSBtnGroup').removeClass('hide');
					} else {
						$('#accSysKJYSBtnGroup').addClass('hide');
					}
					$('#btnAccSysKJYSEdit').addClass('hide');
					this.kjysBtnGroupControl();
				} else {
					$('#accSysKJYS tbody tr').each(function () {
						$row = $(this);
						//$row.find('label[for="chrName"]').html($row.find('[name="chrName"]').val());
						$row.find('label[for="chrName"]').html(ufma.transformQj($row.find('[name="chrName"]').val())); //xss漏洞--zsj
						var $combox = $row.find('label[for="balDir"]').prev();
						$row.find('label[for="balDir"]').html($combox.find('.ufma-combox-text').val());
						$row.find('label[for="accaCode"]').html($row.find('[name="accaCode"]').children('option:selected').text());
					});

					///
					$('#btnAccSysKJYSEdit').removeClass('hide');
					$('#accSysAddKJYS').addClass('hide');
					$('#accSysKJYSBtnGroup').addClass('hide');
					$('#accsys-kjys .control-element .form-control').addClass('hide');
					$('#accsys-kjys .control-element .form-combox').addClass('hide');
					$('#accsys-kjys .control-element .control-label').removeClass('hide');
					$('#accSysKJYS thead tr th.btnGroup').remove();
					$('#accSysKJYS tbody tr td.btnGroup').remove();
				}
			},
			kjysBtnGroupControl: function () {
				if ($('#accSysKJYS thead tr th.btnGroup').length == 0) {
					$('#accSysKJYS thead tr').append('<th class="nowrap btnGroup">操作</th>');
				}

				$('#accSysKJYS tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除"><span class="glyphicon icon-trash"></span></a>' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动改变顺序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');

						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							$tr.remove();
							page.adjKJYSNo();
						});

						$tr.find('td.btnGroup .btnDrag').on('mousedown', function (e) {
							var callback = function () {
								page.adjKJYSNo();
							}
							$('#accSysKJYS').tableSort(callback);
						});
					}
				});
			},
			initNumSelect: function () {
				for (var i = 0; i <= 9; i++) {
					if (i == 0) {
						this.get('select.num-select').append('<option value=""></option>');
					} else {
						this.get('select.num-select').append('<option value=' + i + '>' + i + '</option>');
					}
				}
				//默认编码规则4-2-2
				this.get('select.num0 option[value="4"]').attr({
					'selected': true
				});
				this.get('select.num1 option[value="2"]').attr({
					'selected': true
				});
				this.get('select.num2 option[value="2"]').attr({
					'selected': true
				});
				this.setNumSelect();
				this.get('select.num-select').on('change', function () {
					var idx = $(this).attr('index');
					if ($(this).val() != "" && $(this).val() != null) {
						page.fjfa[parseInt(idx)] = $(this).val();
						$('#accsys-coderule').val(page.fjfa.join('-'));
					}
					//校验编码规则长度不能大于42(revise)
					page.checkRuleLen();
				});
			},
			checkRuleLen: function () {
				var selectEle = $('select.num-select');
				var len = selectEle.length,
					sum = 0,
					arr = [];
				for (var i = 0; i < len; i++) {
					if ($(selectEle[i]).val() !== null && $(selectEle[i]).val() !== '' && $(selectEle[i]).val() !== undefined) {
						sum += parseInt($(selectEle[i]).val());

					}
				}
				if (sum > 42) {
					ufma.alert("编码规则的总长度必须小于等于42", "warning");
					return false;
				}
				return true;
			},
			setNumSelect: function () {
				$("#bmgz").find(".select-default").each(function () {
					$(this).find(".num-select").val("");
				});
				for (var i = 0; i < page.fjfa.length; i++) {
					this.get('select[index=' + i + ']').val(page.fjfa[i]);
				}
			},
			getNumSelect: function () {
				page.fjfa = [];
				$('#accsys-edt select.num-select').each(function () {
					var idx = $(this).attr('index');
					if ($(this).val() != "" && $(this).val() != null) {
						page.fjfa[parseInt(idx)] = $(this).val();
						$('#accsys-coderule').val(page.fjfa.join('-'));
					}
				});
			},
			qryAccs: function () {
				var url = '/ma/sys/accs/select';
				var argu = {
					"rgCode": page.rgCode,
					"setYear": page.setYear
				};
				var callback = function (result) {
					page.drawPanleCards(result.data);
					page.reslist = ufma.getPermission();
					ufma.isShow(page.reslist);
				}
				ufma.get(url, argu, callback);
			},
			drawPanleCards: function (cardsData) {
				var $cards = $('#accSys-cards');
				$cards.html('');
				var $row;
				$.each(cardsData, function (idx, row) {
					var chrName = row.chrName;
					var codeRule = row.codeRule;
					if (idx % 4 == 0) {
						$row = $('<div class="row"></div>').appendTo($cards);
					}
					//var newUrl = "/pf/ma/coaAcc/coaAcc.html?chrName=" + chrName + "&chrCode=" + row.chrCode;
					var newUrl = "/pf/ma/coaAcc/coaAcc.html?chrCode=" + row.chrCode + '&menuid=' + coaMneuId;
					var $col = $('<div class="col-md-3 padding-8"></div>');
					var cardClass = "ufma-card ufma-card-icon";
					if (row.enabled == 0) {
						cardClass = "ufma-card ufma-card-icon disEnabled"
					}
					var $newCard = $('<div class="' + cardClass + '"></div>').appendTo($col);
					$('<div class="card-icon"> <span class="icon"> <img src="../../images/' + row.chrCode + '.png" onerror="javascript:this.src=\'../../images/default.png\' "> </span></div> ').appendTo($newCard);
					$('<div class="ufma-card-header" style="overflow:hidden;white-space:nowrap;">' + chrName + '</div>').appendTo($newCard);
					$('<div class="ufma-card-body">' + codeRule + '</div></div>').appendTo($newCard);
					var $footer = $('<div class="ufma-card-footer"></div>').appendTo($newCard);
					var $btnset = $('<a style="cursor: pointer"class="btn-label btn-setup btn-permission"><i class="glyphicon icon-setting"></i>设置</a>').appendTo($footer);
					var $btnkm = $('<a style="cursor: pointer" data-href="' + newUrl + '" data-title="会计科目" class="btn-label kjkm btn-subject btn-permission"><i class="glyphicon icon-book"></i>科目</a>').appendTo($footer);
					/*var $btndel = $('<a class="btn-label"><i class="glyphicon icon-trash"></i>删除</a>').appendTo($footer);*/
					$col.appendTo($row);
					$btnset.on('click', function () {
						page.action = 'edit';
						page.setFormEnabled();
						page.openEdtWin(row);
					});
				});
			},
			saveBaseInfo: function () {
				page.getNumSelect();
				var url = '/ma/sys/accs/saveAccs';
				var argu = $('#accsys-base').serializeObject();
				argu.agencyCode = page.agencyCode;
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu.saveType = '2';
				argu.oldCodeRule = page.curData.codeRule;
				argu.parentCode = page.parentCodeTree.getValue();
				if (!$.isNull(this.curData)) {
					argu.lastVer = this.curData.lastVer;
				}
				argu.lastVer = page.lastVer;
				var callback = function (result) {
					ufma.showTip(result.msg, function () {
						if (result.flag != 'success') return false;
						page.qryAccs();
						var arr = [];
						for (var i = 0; i < $('#bmgz select').length; i++) {
							if ($('#bmgz select').eq(i).val() != '') {
								arr.push($('#bmgz select').eq(i).val())
							}

						}
						$('#bmgz .control-label').html(arr.join('-'))
						for (var i = 0; i < $('#accsys-base input.form-control').length; i++) {
							var val = $('#accsys-base input.form-control').eq(i).val()
							$('#accsys-base input.form-control').eq(i).next().html(val)
						}
						//guohx 当保存基本信息后保证编码规则的实时性 20200302
						page.fjfa = result.data.codeRule.split('-');
						page.curData.codeRule = result.data.codeRule;
						$('#carryOverTypeName').html($('#carryOverType_input').val());
						//bug73807--科目体系上增加属性：上级科目体系，只能选择已存在的科目体系作为当前科目体系的上级科目体系-zsj
						$('#parentCodeName').html($('#parentCode_input').val());
						$('#parentCodeName').attr("title", page.parentCodeName);
						$('#accsys-base .btn-group').eq(0).next().html($('#accsys-base .btn-group .active').eq(0).text())
						$('#accsys-base .btn-group').eq(1).next().html($('#accsys-base .btn-group .active').eq(1).text())
						page.setBaseFormEdit(false);
					}, result.flag);
				}

				ufma.post(url, argu, callback);
			},
			serializeKJYS: function () {
				var aKJYS = [];
				var irow = 0;
				$('#accsys-kjys tbody tr').each(function (idx) {
					var tmpYS = {};
					irow = irow + 1;
					tmpYS.chrId = $(this).find('[name="chrId"]').val();
					tmpYS.chrCode = irow;
					tmpYS.accsCode = $('#accsys-base [name="chrCode"]').val();
					// tmpYS.chrName = $(this).find('[name="chrName"]').val();
					tmpYS.chrName = ufma.transformQj($(this).find('[name="chrName"]').val()); //xss漏洞--zsj
					tmpYS.balDir = $(this).find('[name="balDir"]').val();
					tmpYS.accaCode = $(this).find('[name="accaCode"]').children('option:selected').val();
					$(this).find('label[for="accaCode"]').html($(this).find('[name="accaCode"]').children('option:selected').text());
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},
			saveKJYSInfo: function () {
				var url = '/ma/sys/accs/saveAccs';
				var argu = {};
				argu.agencyCode = page.agencyCode;
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu.saveType = '3';
				argu.eleAcceLs = this.serializeKJYS();
				argu.oldCodeRule = page.curData.codeRule;
				if (!$.isNull(this.curData)) {
					argu.lastVer = this.curData.lastVer;
					argu.chrId = this.curData.chrId;
					argu.chrCode = this.curData.chrCode;
				}
				argu.lastVer = page.lastVer;
				var callback = function (result) {
					ufma.showTip(result.msg, function () {
						if (result.flag != 'success') return false;
						page.setKJYSFormEdit(false);
						page.qryAccs();
						//page.editor.close(); //修改点击保存时界面跳转至主界面问题
					}, result.flag);
				}
				ufma.post(url, argu, callback);
			},
			saveAll: function () {
				page.getNumSelect();
				var url = '/ma/sys/accs/saveAccs';
				var argu = $('#accsys-base').serializeObject();
				argu.eleAcceLs = this.serializeKJYS();
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu.saveType = 1;
				argu.oldCodeRule = ""; //新增传空
				if (($("#accSysKJYS").find("tbody").length == 0 || $("#accSysKJYS").find("tbody").html() == '') && argu.chrName != '' && argu.chrCode != '') {
					// ufma.confirm("会计要素为空");
					ufma.showTip("会计要素不能为空", function () { }, "warning");
					return false;
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var callback = function (result) {
					ufma.hideloading();
					ufma.showTip(result.msg, function () {
						if (result.flag != 'success') return false;
						//$('#accsys-edt')[0].reset();
						page.qryAccs();
						page.editor.close();
					}, result.flag);
				}
				var arr = argu.codeRule.split('-'),
					flag = true;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == '') {
						flag = false
					}
				}
				if (flag) {
					ufma.post(url, argu, callback);
				} else {
					ufma.showTip('请严格遵守编码规则！', function () { }, 'warning');
				}

			},
			delete: function () {
				ufma.showloading('数据保存中，请耐心等待...');
				var argu = {};
				argu.rgCode = page.rgCode;
				argu.agencyCode = '*';
				argu.setYear = page.setYear;
				argu.chrCode = $('#accsys-base').serializeObject().chrCode;
				argu.chrId = $('#accsys-base').serializeObject().chrId;
				var url = '/ma/sys/accs/deleteAccs';
				var callback = function (result) {
					ufma.hideloading();
					if (result.flag == 'success') {
						ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
					}
					page.editor.close();
					page.qryAccs();
				}
				ufma.post(url, argu, callback);
			},
			newKJYS: function (rowData) {
				var $table = $('#accSysKJYS');
				var recNo = $table.find('tr:not(.hide)').length;
				if (rowData) {
					recNo = rowData.chrCode;
				}
				var row = '<tr>' +
					'<td class="text-center"> <input type="hidden" name="chrId" value=""><span class="recno">' + recNo + '</span> </td>' +
					'<td> ' +
					'<div class="control-element"><input type="text" name="chrName" class="form-control" autocomplete="off"></span>	<label for="chrName" class="control-label hide"></label></div> ' +
					'</td>' +
					'<td> <div class="control-element">' +
					'<div class="ufma-combox w210 form-combox balDirClass"></div>' +
					'<label for="balDir" class="control-label hide"></label></div> </td>' +
					'<td> <div class="control-element">' +
					'<select class="form-control"  name="accaCode"><option value="1">财务会计</option><option value="2">预算会计</option>	</select>' +
					'<label for="accaCode" class="control-label hide"></label></div> </td>' +
					'</tr>';
				var $row = $(row).appendTo($table).trigger('create');
				page.initBalDir($row);
				if (rowData) {
					$row.find('[name="chrId"]').val(rowData.chrId);
					$row.find('[name="chrName"]').val(rowData.chrName);
					//$row.find('[name="balDir"]').val(rowData.balDir);
					$row.find('[name="accaCode"]').val(rowData.accaCode);
					$row.find('label[for="chrName"]').html(rowData.chrName);
					$row.find('.balDirClass').ufmaCombox().val(rowData.balDir);
					$row.find('label[for="accaCode"]').html($row.find('[name="accaCode"]').children('option:selected').text());
				} else {
					this.kjysBtnGroupControl();
				}
			},
			adjKJYSNo: function () {
				var idx = 0;
				$('#accSysKJYS tbody tr').each(function () {

					if (!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
						$(this).find('input[name="chrCode"]').val(idx);
					}
				});
			},
			initBalDir: function ($tr) {
				var cacheId = 'accsys_balDir';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.balDirClass').each(function () {
						$(this).ufmaCombox({
							valueField: 'ENU_CODE',
							textField: 'ENU_NAME',
							name: 'balDir',
							data: data,
							onchange: function (node) {
								var data = page.serializeKJYS();
								page.reckonPHGS(data);
							}
						});
					})
				}

				if (!$.isNull(data) && data.length > 0) {
					buildCombox();
				} else {
					ufma.ajaxDef('/ma/pub/enumerate/ACCE_FMLA_DIRECT', 'get', '', function (result) {
						data = result.data;
						ufma.setObjectCache('accsys_balDir', data);
						buildCombox();
					});
				}
			},
			joinString: function (str1, str2) {
				if (str1 == '') {
					//如果左边初始值为空需要考虑去掉运算符，运算符只会出现在第一位
					if (str2.indexOf('+') != -1 || str2.indexOf('-') != -1) {
						str2 = str2.substring(1, str2.length);
						str1 = str2;
					}
				} else {
					str1 = str1 + str2;
				}
				return str1;
			},
			initPage: function () { },
			setFormEnabled: function () {
				if (page.action == 'edit') {
					$('#chrCode').attr('disabled', 'disabled');
				} else if (page.action == 'add') {
					$('#chrCode').removeAttr('disabled');
				}
				if (page.action == 'add') {
					$('#chrId').val('');
					$('#accsys-base')[0].reset();
					$('#accsys-base')[0].reset();
				}
			},
			reckonPHGS: function (data) {
				var cwLeftString = '',
					cwRightString = '',
					ysLeftString = '',
					ysRightString = '';
				for (var i = 0; i < data.length; i++) {
					var temp = data[i];
					//chrCode为1表示财务会计，2为预算会计
					if (temp.accaCode == '1') {
						//借方
						if (temp.balDir == '1') {
							cwLeftString = page.joinString(cwLeftString, ('+' + temp.chrName));
						} //左减
						else {
							cwRightString = page.joinString(cwRightString, ('+' + temp.chrName));
						}
					} else {
						//左加
						if (temp.balDir == '1') {
							ysLeftString = page.joinString(ysLeftString, ('+' + temp.chrName));
						} else {
							ysRightString = page.joinString(ysRightString, ('+' + temp.chrName));
						}
					}
				}
				var cwkjphgs = '';
				var yskjphgs = '';
				if (cwLeftString != '' && cwRightString != '') {
					cwkjphgs = cwLeftString + '=' + cwRightString;
				} else {
					cwkjphgs = cwLeftString + cwRightString;
				}
				if (ysLeftString != '' && ysRightString != '') {
					yskjphgs = ysLeftString + '=' + ysRightString;
				} else {
					yskjphgs = ysLeftString + ysRightString;
				}
				$('#cwkjphgs li').text(cwkjphgs);
				$('#yskjphgs li').text(yskjphgs);
			},
			hasError: function () {
				var flag = true;
				$('#bmgz select').each(function () {
					if ($(this).hasClass("error")) {
						flag = false;
						return flag;
					}
				});
				return flag;
			},
			onEventListener: function () {
				//计算平衡公式的显示值
				$('#accSysKJYS').on('change', function () {
					var data = page.serializeKJYS();
					page.reckonPHGS(data);
				});
				this.get('.btn-add').on('click', function (e) {
					e.preventDefault();
					page.action = 'add';
					$('#bmgz').find('b').removeClass('hide');
					page.setFormEnabled();
					page.openEdtWin();
				});
				// this.onBtncloseClick(); 解决弹出框点击取消按钮时直接跳至主界面问题
				this.get('#accSysSaveAll').on('click', function (e) {
					e.preventDefault();

					if (page.hasError()) {
						if (page.checkRuleLen()) { //校验编码规则长度不能大于42(revise)
							page.saveAll();
						}
					} else {
						ufma.confirm("您输入的编码规则有误，请检查后再保存");
						return false;
					}
				});

				$('#accSysBaseBtnGroup .btn-save').on('click', function () {
					page.saveBaseInfo();

				});
				this.get('#accSysDelete').on('click', function () {
					ufma.confirm("您确定删除选中的科目体系吗？", function (action) {
						if (action) {
							page.delete();
						}
					}, {
							type: 'warning'
						});
				});
				$('#accSysBaseBtnGroup .btn-cancel').on('click', function () {
					page.initWindow(page.curData);
					page.setBaseFormEdit(false);
				});
				$('#btnAccSysBaseEdit').on('click', function () {
					$('#bmgz').find('b').removeClass('hide');
					page.setBaseFormEdit(true);
				});
				$('#btnAccSysKJYSEdit').on('click', function () {
					page.setKJYSFormEdit(true);
				});
				$('#accSysKJYSBtnGroup .btn-save').on('click', function () {
					page.saveKJYSInfo();
				});
				$('#accSysKJYSBtnGroup .btn-cancel').on('click', function () {
					page.initWindow(page.curData);
					page.setKJYSFormEdit(false);
				});
				$('#accSysAddKJYS').on('click', function () {
					page.newKJYS();
				});
				$('#accSysCloseAll').on('click', function () {
					page.editor.close();
				});

				$('#accSysCancelAll').click(function () {
					page.editor.close();
				});
				$("#accSys-cards").on("click", ".kjkm", function () {
					//window.parent.openNewMenu($(this));
					//var chrCode = $('#chrCode').val();
					//var  newUrl = "/pf/ma/coaAcc/coaAcc.html?chrCode=" +  chrCode + '&menuid=' + coaMneuId;
					//CWYXM-11322 ---系统管理-科目体系，查看当前科目体系对应的科目，科目页面应显示的是当前科目体系--zsj
					var newUrl = $(this).attr('data-href');
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "会计科目");
				});

				$("#accsys-edt").on("click", ".ckkm", function () {
					var fromChrCode = $('#chrCode').val();
					var newUrl = "/pf/ma/coaAcc/coaAcc.html?chrCode=" + fromChrCode + '&menuid=' + coaMneuId;
					//	$(this).attr('data-href', newUrl);
					//window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "会计科目");
				});
				$("#accsys-edt").on("click", ".xjzt", function () {
					var fromChrCode = $('#chrCode').val();
					var newUrl = "/pf/ma/coAcc/coAcc.html?chrCode=" + fromChrCode + '&menuid=16af5664-0fb2-4240-87cb-eb1e28a6feb9';
					//$(this).attr('data-href', newUrl);
					//	window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "账套管理");
				});
				$("#accsys-edt").on("click", ".fzhs", function () {
					//window.parent.openNewMenu($(this));
					var newUrl = "/pf/ma/eleAccItem/eleAccItem.html?menuid=28178abc-a21b-406c-8fb1-63ec1320975d";
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "辅助核算");
				});
				$('#bmgz select').on('click change', function () {
					$(this).prevAll().each(function () {
						if ($(this).val() == null || $(this).val() == '') {

							$(this).addClass('error');
						}
					})
				}).on('blur', function () {
					if ($(this).val() != null && $(this) != '') {
						$(this).removeClass('error');
					}
					$(this).siblings().each(function (idx, row) {
						if ($(this).val() != null && $(this).val() != '')
							$(this).removeClass('error');
					})

				});
				$('#chrCode').on('blur', function () {
					if (!ufma.isNumOrChar($(this).val())) {
						ufma.showInputHelp('chrCode', '<span class="error">请输入数字或者字母编码</span>');
						$('#chrCode').val('');
					} else {
						ufma.hideInputHelp('chrCode');
						var data = [];
						var argu = {
							rgCode: page.rgCode,
							setYear: page.setYear,
							chrCode: $('#chrCode').val(),
							eleCode: "ACCS"
						}
						var callback = function (result) {
							data = result.data;
							page.initParentCode(data);
						};
						ufma.post("/ma/sys/common/selectParentTree?", argu, callback);
					}
				});
				//zsj--xss漏洞
				$('#chrName,#vocationName').on('blur', function () {
					if ($(this).val() != '') {
						$(this).val(ufma.transformQj($(this).val())); //特殊字符半角转全角
					}
				});
			},
			initCarryOverType: function () {
				var data = [];

				function buildCombox() {
					page.carryOverType = $('#carryOverType').ufmaCombox({
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: data,
						name: 'carryOverType',
					});
				};
				var callback = function (result) {
					data = result.data;
					buildCombox();
				};
				ufma.get("/ma/pub/enumerate/CARRY_OVER_TYPE", "", callback);
			},
			initParentCode: function (data) {
				page.parentCodeTree = $('#parentCode').ufmaCombox({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择上级科目体系',
					data: data,
					name: 'parentCode'
				});

			},
			//此方法必须保留
			init: function () {
				var pfData = ufma.getCommonData();
				page.rgCode = pfData.svRgCode;
				page.setYear = parseInt(pfData.svSetYear);
				page.isCrossDomain = false;
				this.initCarryOverType();
				var treeData = []
				this.initParentCode(treeData);
				this.initPage();
				this.onEventListener();
				this.initNumSelect();
				this.qryAccs();
				$("input").attr("autocomplete", "off");

				function expand(elem) {
					if (document.createEvent) {
						var e = document.createEvent("MouseEvents");
						e.initMouseEvent("mousedown");
						elem[0].dispatchEvent(e);
					} else if (element.fireEvent) {
						elem[0].fireEvent("onmousedown");
					}
				}
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}
		}
	}();

	/////////////////////
	page.init();
});
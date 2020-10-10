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
		var tableParam;
		return {

			initEditPage: function(curData) {
				if(curData.action == "edit") {
					this.curData = curData;
					this.editMode = 'edit';
					$('#curRateSaveAddAll').addClass("hide");
					$('#curRateAccSaveAll').addClass("hide");
					$('#curRateCancelAll').removeClass("hide");
					$('#btnCurRateSetEdit').removeClass("hide");
					this.initWindow(curData);
				} else {
					//否则进入的就是新增页
					this.editMode = 'new';
					$('#form-curRateBaseTab')[0].reset();
					this.setBaseFormEdit(true);
					$("#curRateSaveAddAll").removeClass("hide");
					$("#curRateAccSaveAll").removeClass("hide");
					$("#curRateCancelAll").removeClass("hide");

					$("#btnCurRateBaseEdit").addClass("hide");
					$("#btnCurRateSetEdit").addClass("hide");
				}
				page.formdata = $('#form-curRateBaseTab').serializeObject();
			},

			initWindow: function(curData) {
				$('#form-curRateBaseTab').setForm(curData.eleCurrency);
				$('#curAttribute').getObj().val(curData.eleCurrency.curAttribute);
				this.setBaseFormEdit(false);
				//循环显示月汇率行数据
				$('#currencyRateTable tbody').html('');
				$.each(curData.eleRates, function(index, row) {
					if(row) {
						row.index = index + 1;
						page.newSetRateTableTr(row);
					}
				});
				this.setRateFormEdit(false);
			},

			setBaseFormEdit: function(enabled) {
				if(enabled) {
					//新增页、修改页为true，input显示、label隐藏，若为新增，局部保存按钮隐藏，若为修改，局部保存按钮显示
					$('#form-curRateBaseTab .control-element .form-control,#form-curRateBaseTab .control-element .uf-combox').removeClass('hide');
					$('#form-curRateBaseTab .control-element .btn-group').removeClass('hide');
					$('#form-curRateBaseTab .control-element .rate-num-count').removeClass('hide');
					$('#form-curRateBaseTab .control-element .control-label').addClass('hide');
					if(this.editMode == 'edit') {
						$('#curRateBaseBtnGroup').removeClass('hide');
						$('#chrCode').attr('disabled', true);
					} else {
						$('#curRateBaseBtnGroup').addClass('hide');
					}
				} else {
					//详情页展示为false，input隐藏、label显示，局部保存按钮隐藏
					$('#form-curRateBaseTab .control-element .form-control,#form-curRateBaseTab .control-element .uf-combox').addClass('hide');
					$('#form-curRateBaseTab .control-element .btn-group').addClass('hide');
					$('#form-curRateBaseTab .control-element .rate-num-count').addClass('hide');
					$('#form-curRateBaseTab .control-element .control-label').removeClass('hide');
					$('#curRateBaseBtnGroup').addClass('hide');
					$('#chrCode').removeAttr('disabled');

					//把input的值回显到label上
					$('label[for="chrCode"]').text($("#chrCode").val());
					$('label[for="chrName"]').text($("#chrName").val());
					$('label[for="assCode"]').text($("#assCode").val());
					$('label[for=assCode]').attr('title', $("#assCode").val());
					//新增需求：添加计算公式和币种属性
					$('label[for=curFormula]').attr('title', $("#curFormula").val());
					$('label[for=curFormula]').text($("#curFormula").val());
					$('label[for=curAttribute]').text($("#curAttribute_input").attr('title'));
					$('label[for=curAttribute]').attr('title', $("#curAttribute_input").attr('title'));
					$('label[for="curSign"]').text($("#curSign").val());
					$('label[for="rateDigits"]').text($("#rateDigits").val());
					//将toggle上的值赋值到label上
					$('label[for="isStdCur"]').text($('label[for="isStdCur"]').parent().find('label.active').text());
					$('label[for="isMidCur"]').text($('label[for="isMidCur"]').parent().find('label.active').text());

				}
			},

			setRateFormEdit: function(enabled) {
				var num = $('label[for="rateDigits"]').text();
				console.info(num);
				if(num == 0) {
					$(".rate-num-reduce").removeClass("rate-num-action").addClass("rate-num-disabled");
					$(".rate-num-add").removeClass("rate-num-disabled").addClass("rate-num-action");
				} else if(num == 6) {
					$(".rate-num-reduce").removeClass("rate-num-disabled").addClass("rate-num-action");
					$(".rate-num-add").removeClass("rate-num-action").addClass("rate-num-disabled");
				} else {
					$(".rate-num-reduce,.rate-num-add").removeClass("rate-num-disabled").addClass("rate-num-action");
				}
				if(enabled) {
					//新增页、编辑页显示，input显示、label隐藏
					$('#form-curRateSetTab .control-element .form-control').removeClass("hide");
					$('#form-curRateSetTab .control-element .control-label').addClass("hide");
					$('#currencyRateAdd').removeClass("hide");
					if(this.editMode == 'edit') {
						$('#curRateSetBtnGroup').removeClass("hide");
					} else {
						$('#curRateSetBtnGroup').addClass("hide");
					}
					this.setRateBtnGroupControl();
				} else {
					$('#currencyRateTable tbody tr').each(function() {
						$row = $(this);
						$row.find('label[for="curDate"]').html($row.find('[name="curDate"]').val());
						$row.find('label[for="direRate"]').html($row.find('[name="direRate"]').val());
						$row.find('label[for="inDireRate"]').html($row.find('[name="inDireRate"]').val());
					});
					//详情页展示，input隐藏，label显示，新增汇率按妞、操作列隐藏
					$('#form-curRateSetTab .control-element .form-control').addClass("hide");
					$('#form-curRateSetTab .control-element .control-label').removeClass("hide");
					$('#curRateSetBtnGroup').addClass("hide");
					$('#currencyRateAdd').addClass("hide");
					$('#currencyRateTable thead tr th.btnGroup').remove();
					$('#currencyRateTable tbody tr td.btnGroup').remove();

				}
			},

			setRateBtnGroupControl: function() {
				if($('#currencyRateTable thead tr th.btnGroup').length == 0) {
					$('#currencyRateTable thead tr').append('<th class="nowrap btnGroup">操作</th>');
				}
				$('#currencyRateTable tbody tr').each(function() {
					var $tr = $(this);
					if($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function(e) {
							e.stopPropagation();
							$tr.remove(); //修改bug78004
							// $tr.addClass('hide');
							page.adjRateNo();
						});
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function(e) {
							var callback = function() {
								page.adjRateNo();
							}
							$('#currencyRateTable').tableSort(callback);
						});
					}
				});
			},

			adjRateNo: function() {
				var idx = 0;
				$('#currencyRateTable tbody tr').each(function() {
					if(!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
						$(this).find('input[name="chrCode"]').val(idx);
					}
				});
			},

			newSetRateTableTr: function(rowData) {
				var $table = $('#currencyRateTable');
				var recNo = $table.find('tr:not(.hide)').length;
				if(rowData) {
					recNo = rowData.index;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="chrId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					/*'<input type="text" name="curDate" class="form-control">' +*/
					'<select class="form-control"  name="curDate">' +
					'<option value="' + page.setYear + '-01">' + page.setYear + '-01</option>' +
					'<option value="' + page.setYear + '-02">' + page.setYear + '-02</option>' +
					'<option value="' + page.setYear + '-03">' + page.setYear + '-03</option>' +
					'<option value="' + page.setYear + '-04">' + page.setYear + '-04</option>' +
					'<option value="' + page.setYear + '-05">' + page.setYear + '-05</option>' +
					'<option value="' + page.setYear + '-06">' + page.setYear + '-06</option>' +
					'<option value="' + page.setYear + '-07">' + page.setYear + '-07</option>' +
					'<option value="' + page.setYear + '-08">' + page.setYear + '-08</option>' +
					'<option value="' + page.setYear + '-09">' + page.setYear + '-09</option>' +
					'<option value="' + page.setYear + '-10">' + page.setYear + '-10</option>' +
					'<option value="' + page.setYear + '-11">' + page.setYear + '-11</option>' +
					'<option value="' + page.setYear + '-12">' + page.setYear + '-12</option>' +
					'</select>' +
					'<label for="curDate" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" name="direRate" class="form-control">' +
					'<label for="direRate" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" name="inDireRate" class="form-control">' +
					'<label for="inDireRate" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table).trigger('create');
				if(rowData) {
					$row.find('label[for="curDate"]').html($row.find('[name="curDate"]').children('option:selected').text());
					$row.find('label[for="direRate"]').html(rowData.direRate);
					$row.find('label[for="inDireRate"]').html(rowData.inDireRate);

					//为了点击修改的时候直接赋值上去
					$row.find('input[name="chrId"]').val(rowData.chrId);
					$row.find('select[name="curDate"]').val(rowData.curDate);
					$row.find('input[name="direRate"]').val(rowData.direRate);
					$row.find('input[name="inDireRate"]').val(rowData.inDireRate);
				} else {
					this.setRateBtnGroupControl();
				}
			},

			saveBaseInfo: function() {

				var url = '/ma/sys/eleCurrRate/saveCurr';
				var argu = $('#form-curRateBaseTab').serializeObject();
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = page.rgCode;
				argu.setYear = page.setYear;
				argu.lastVer = window.ownerData.eleCurrency.lastVer;
				argu.saveType = "2";
				var callback = function(result) {
					ufma.showTip('基本信息保存成功！', function(result) {
						// page.initWindow();
						page.setBaseFormEdit(false);
						//bugCWYXM-5039--修改因版本号未更新导致的保存失败问题--zsj
						page.saveBase = true;
					}, "success");
					page.closeFlag = "saveSuccess";
					window.ownerData.eleCurrency.lastVer = result.data.lastVer;
					//_close("saveSuccess");
				}
				ufma.post(url, argu, callback);
			},

			saveRateInfo: function() {
				var url = '/ma/sys/eleCurrRate/saveRate';
				//保存汇率时，需要获取币种的chrId、chrCode、chrName
				var argu = $('#form-curRateBaseTab').serializeObject();
				argu.eleRateList = this.serializeSetRate();
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = page.rgCode;
				argu.setYear = page.setYear;
				argu.lastVer = window.ownerData.eleCurrency.lastVer;
				argu.saveType = "3";
				var callback = function(result) {
					ufma.showTip('汇率保存成功！', function(result) {
						page.setRateFormEdit(false);
					}, "success");
					page.closeFlag = "saveSuccess";
					window.ownerData.eleCurrency.lastVer = result.data.lastVer;
					page.setRateFormEdit(false);
					setTimeout(function() {
						_close(page.closeFlag);
					}, 2000)
				}
				ufma.post(url, argu, callback);
			},

			serializeSetRate: function() {
				var aKJYS = [];
				var irow = 0;
				$('#currencyRateTable tbody tr').each(function(idx) {
					var tmpYS = {};
					if($(this).hasClass('hide')) {
						tmpYS.isDeleted = 1;
					} else {
						tmpYS.isDeleted = 0;
						irow = irow + 1;
					}
					tmpYS.chrId = $(this).find('[name="chrId"]').val();
					//关联币种表
					tmpYS.curId = $('#currencyRateTable [name="chrId"]').val();
					tmpYS.chrCode = irow;
					tmpYS.curDate = $(this).find('[name="curDate"]').children('option:selected').val();
					tmpYS.direRate = $(this).find('[name="direRate"]').val();
					tmpYS.inDireRate = $(this).find('[name="inDireRate"]').val();

					$(this).find('label[for="curDate"]').html($(this).find('[name="curDate"]').children('option:selected').text());
					$(this).find('label[for="direRate"]').html($(this).find('[name="direRate"]').val());
					$(this).find('label[for="accaCode"]').html($(this).find('[name="inDireRate"]').val());
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},

			saveAll: function(flag) {
				if(window.ownerData.action == 'edit') {
					ma.isRuled = true;
				}
				if(!ma.formValidator("chrCode", "chrName", "币种符号", "add", "curSign", "币种符号")) {
					return false;
				}
				//var isNull = page.validatorRate();
				//if(isNull){
				ufma.showloading('数据保存中，请耐心等待...');
				var url = '/ma/sys/eleCurrRate/saveCurrRate';
				var argu = $('#form-curRateBaseTab').serializeObject();
				argu.eleRateList = this.serializeSetRate();
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = page.rgCode;
				argu.setYear = page.setYear;
				//新增时不需要传版本号CWYXM-5761--zsj
				if(window.ownerData.action == 'edit') {
					argu.lastVer = window.ownerData.eleCurrency.lastVer; //bugCWYXM-5039--修改因版本号未更新导致的保存失败问题--zsj
				}
				argu.saveType = "1";
				var callback = function(result) {
					ufma.hideloading();
					if(flag) {
						ufma.showTip(result.msg, function() {
							_close(page.closeFlag);
						}, result.flag);
						page.closeFlag = "saveSuccess";

					} else {
						page.closeFlag = "saveSuccess";
						ufma.showTip('保存成功，您可以继续添加币种汇率！', function() {}, "success");

						$("#form-curRateBaseTab").find("input").val("");
						$("#form-curRateBaseTab").find("#rateDigits").val("4");
						$("#form-curRateBaseTab").find("input[name='isStdCur']").eq(0).removeAttr("checked")
							.parent("label").removeClass("active");
						$("#form-curRateBaseTab").find("input[name='isStdCur']").eq(1).prop("checked", true)
							.parent("label").addClass("active");
						$("#form-curRateBaseTab").find("input[name='isMidCur']").eq(0).removeAttr("checked")
							.parent("label").removeClass("active");
						$("#form-curRateBaseTab").find("input[name='isMidCur']").eq(1).prop("checked", true)
							.parent("label").addClass("active");
						$("#currencyRateTable").find("tbody").remove();
						page.formdata = $('#form-curRateBaseTab').serializeObject();
					}
				}
				ufma.post(url, argu, callback);
				//            	}else{
				//            		ufma.alert("汇率不能为空！","warning");
				//            		return false;
				//            	}
			},

			validatorRate: function() {
				var isNull = true;
				$("#currencyRateTable").find("td input[name='direRate']").each(function() {
					if($(this).val() == "") {
						//ufma.alert("直接汇率不能为空！","warning");
						isNull = false;
						return false;
					}
				})

				$("#currencyRateTable").find("td input[name='inDireRate']").each(function() {
					if($(this).val() == "") {
						//ufma.alert("间接汇率不能为空！","warning");
						isNull = false;
						return false;
					}
				})
				return isNull;
			},

			onEventListener: function() {
				//输入校验
				$("body").on("click", function() {
					if(page.agencyCode != "*") {
						//编码验证
						ma.codeValidator('chrCode', '币种', '/ma/sys/common/findParentList?eleCode=CURRENCY&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', '币种');
						//符号验证
						ma.inputValidator('curSign', '货币符号');
					} else {
						//编码验证
						ma.codeValidator('chrCode', '币种', '/ma/sys/common/findParentList?eleCode=CURRENCY&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', '币种');
						//符号验证
						ma.inputValidator('curSign', '币种');
					}
				});

				//基本信息修改点击
				$('#btnCurRateBaseEdit').on('click', function() {
					page.saveBase = false;
					page.setBaseFormEdit(true);
				});

				//基本信息局部保存按钮
				$('#curRateBaseBtnGroup .btn-save').on("click", function() {
					ma.isRuled = true;
					if(!ma.formValidator("chrCode", "chrName", "币种", "add", "curSign", "币种符号")) {
						return false;
					}
					page.saveBaseInfo();
				});

				//基本信息局部取消按钮
				$('#curRateBaseBtnGroup .btn-cancel').on('click', function() {
					$("#form-curRateBaseTab .form-group").removeClass("error");
					$("#form-curRateBaseTab .input-help-block").remove();
					page.initWindow(page.curData);
					page.setBaseFormEdit(false);
				});

				//币种汇率设置修改点击
				$('#btnCurRateSetEdit').on('click', function() {
					page.setRateFormEdit(true);
				});

				//币种汇率新增汇率
				$('#currencyRateAdd').on('click', function() {
					page.newSetRateTableTr();
				});

				//币种汇率局部保存按钮
				$('#curRateSetBtnGroup .btn-save').on("click", function() {
					page.saveRateInfo();
				});

				//币种汇率局部取消按钮
				$('#curRateSetBtnGroup .btn-cancel').on('click', function() {
					page.initWindow(page.curData);
					page.setRateFormEdit(false);
				});

				//保存
				$('#curRateAccSaveAll').on('click', function() {
					page.saveAll(true);
				});
				//保存并新增
				$('#curRateSaveAddAll').on('click', function() {
					page.saveAll(false);
				});

				//取消
				$('#curRateCancelAll').on('click', function() {
					var tmpFormData = $('#form-curRateBaseTab').serializeObject();
					if(page.formdata != null) {
						//bugCWYXM-5039--修改因版本号未更新导致的保存失败问题--zsj
						if(!ufma.jsonContained(page.formdata, tmpFormData) && page.saveBase == false) {
							ufma.confirm('您修改了币种汇率信息，关闭前是否保存？', function(action) {
								if(action) {
									page.saveAll(true);
								} else {
									_close(page.closeFlag);
								}
							}, {
								type: 'warning'
							});
						} else {
							_close(page.closeFlag);
						}
					}
					//                    _close(page.closeFlag);
				});

				//加减汇率小数点位数
				$(".rate-num-reduce").on("click", function() {
					if($(this).hasClass("rate-num-action")) {
						var num = $(this).siblings(".rate-num-val").val();
						num = parseInt(parseInt(num) - 1);
						$(this).siblings(".rate-num-val").val(num);
						if(num == 2) {
							$(this).removeClass("rate-num-action").addClass("rate-num-disabled");
						} else if(num <= 5) {
							$(this).siblings(".rate-num-add").removeClass("rate-num-disabled").addClass("rate-num-action");
						}
					}
				});
				$(".rate-num-add").on("click", function() {
					if($(this).hasClass("rate-num-action")) {
						var num = $(this).siblings(".rate-num-val").val();
						num = parseInt(parseInt(num) + 1);
						$(this).siblings(".rate-num-val").val(num);
						if(num == 6) {
							$(this).removeClass("rate-num-action").addClass("rate-num-disabled");
						} else if(num >= 3) {
							$(this).siblings(".rate-num-reduce").removeClass("rate-num-disabled").addClass("rate-num-action");
						}
					}
				});
				//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
				$('#chrName').on('blur', function() {
					var chrNameValue = $(this).val();
					ufma.post('/pub/util/String2Alpha', {
						"chinese": chrNameValue
					}, function(result) {
						if(result.data.length > 42) {
							var data = result.data.substring(0, 41);
							$('#assCode').val(data);
						} else {
							$('#assCode').val(result.data);
						}
					});
				});
				//控制汇率输入位数
				$("#currencyRateTable").on("keyup", "input[name='direRate'],input[name='inDireRate']", function() {
					$(this).val($(this).val().replace(/[^\d\.]/g, ''));
				});
				$("#currencyRateTable").on("blur", "input[name='direRate']", function() {
					var index = parseInt($(".rate-num-val").val());
					var num = $(this).val();
					if(num != "") {
						var ret1 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;
						var ret2 = /^[1-9]\d*|0$/;
						if(ret1.test(num) || ret2.test(num)) {
							var newNum = parseFloat(num).toFixed(index);
							$(this).val(newNum);
							if(newNum != 0) {
								$(this).parents("td").siblings("td").find("input[name='inDireRate']").val(parseFloat(1 / newNum).toFixed(index));
							} else {
								$(this).parents("td").siblings("td").find("input[name='inDireRate']").val(0);
							}
						} else {
							ufma.alert("请输入合法的数字！", 'error');
							return false;
						}
					}
				})
				$("#currencyRateTable").on("blur", "input[name='inDireRate']", function() {
					var index = parseInt($(".rate-num-val").val());
					var num = $(this).val();
					if(num != "") {
						var ret1 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;
						var ret2 = /^[1-9]\d*|0$/;
						if(ret1.test(num) || ret2.test(num)) {
							var newNum = parseFloat(num).toFixed(index);
							$(this).val(newNum);
						} else {
							ufma.alert("请输入合法的数字！", "error");
							return false;
						}
					}
				})
			},
			initAbTree: function() {
				ufma.ajaxDef('/ma/pub/enumerate/CUR_ATTRIBUTE', 'get', '', function(result) {
					$('#curAttribute').ufCombox({
						idField:"ENU_CODE", 
						textField: 'ENU_NAME',
						readonly: false,
						data: result.data, //json 数据
						onchange: function(data) {

						},
						onComplete: function(sender) {
                           if(result.data.length>0){
                           	$('#curAttribute').getObj().val(result.data[0].ENU_CODE);
                           }else{
                           	$('#curAttribute').getObj().val('');
                           }
						}

					});
				});
			},
			initData: function(data) {
				page.tableParam = "MA_ELE_CURRENCY";
				page.agencyCode = data.agencyCode;
				page.acctCode = data.acctCode;
				page.rgCode = data.rgCode;
				page.setYear = data.setYear;
				$('#prompt').text('编码规则：' + window.ownerData.fjfa);
			},

			init: function() {
				page.closeFlag = "";
				page.initAbTree(); //新增需求--zsj
				this.initData(window.ownerData);
				this.initEditPage(window.ownerData);
				this.onEventListener();
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$("input").attr("autocomplete", "off");

			}
		}
	}();

	page.init();
});
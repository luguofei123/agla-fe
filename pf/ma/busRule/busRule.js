$(function () {
	var page = function () {
		//定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrId, chrValue, chrConmode;
		var sysId;
		//定义单位代码变量（单位级）
		if ($("#cbAgency").get(0)) {
			var agencyCode;
		}
		//传输设置数据的对象
		var postSet;
		var ischange008 = true;
		var ischange009 = true;
		return {
			//$.ajax()，获取数据数据成功，拼接页面的方法
			initBusRule: function (result) {
				//创建dl节点并加到right-box内
				var $dl;
				//定义dt、dd和dd内ul变量，用于创建节点
				var $dt, $dd, $ul;
				//循环加载数据
				for (var i = 0; i < result.data.length; i++) {
					//创建每一条业务规则设置的li
					var $liOneChr = $('<li class="clearfix"></li>');
					//创建隐藏那个字段节点并加到li内
					//避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
					var $chrId = $('<input type="hidden" value=' + result.data[i].sysRgrPara.chrId + ' name=' + result.data[i].sysRgrPara.chrCode + ' />');
					$liOneChr.append($chrId);
					//创建chrName节点，并使用bootstrap插件，实现鼠标悬停出现tip
					//判断系统级和单位级
					if (!$("#cbAgency").get(0)) {
						//系统级
						if (result.data[i].sysRgrPara.chrConmode == 2) {
							$liOneChr.append($('<div class="rule-chrName"><span class="disabled-color" data-toggle="tooltip" data-placement="right" title=' + result.data[i].sysRgrPara.chrDesc + '>' + result.data[i].sysRgrPara.chrName + '</span></div>'));
						} else {
							$liOneChr.append($('<div class="rule-chrName"><span data-toggle="tooltip" data-placement="right" title=' + result.data[i].sysRgrPara.chrDesc + '>' + result.data[i].sysRgrPara.chrName + '</span></div>'));
						}
					} else {
						//单位级
						if (result.data[i].sysRgrPara.chrConmode == 2) {
							$liOneChr.append($('<div class="rule-chrName"><span data-toggle="tooltip" data-placement="right" title=' + result.data[i].sysRgrPara.chrDesc + '>' + result.data[i].sysRgrPara.chrName + '</span></div>'));
						} else {
							$liOneChr.append($('<div class="rule-chrName"><span class="disabled-color" data-toggle="tooltip" data-placement="right" title=' + result.data[i].sysRgrPara.chrDesc + '>' + result.data[i].sysRgrPara.chrName + '</span></div>'));
						}
					}
					//定义$chrValue变量，判断fieldDisptype，$chrValue载入不同的组件，并加入li
					var $chrValue;
					switch (result.data[i].sysRgrPara.fieldDisptype) {
						case 1:
							//fieldDisptype:1 是要素
							$chrValue = $('<div class="rule-chrValue"></div>');
							var $select;
							//判断系统级和单位级
							if (!$("#cbAgency").get(0)) {
								//系统级
								// CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--BG007系统级不显示下拉框，且单位级不显示此选项
								if (result.data[i].sysRgrPara.chrCode != 'BG007') {
									if (result.data[i].sysRgrPara.chrConmode == 2) {
										$select = $('<select class="form-control bordered-input" disabled></select>');
									} else {
										$select = $('<select class="form-control bordered-input"></select>');
									}
								}
							} else {
								//单位级
								if (result.data[i].sysRgrPara.chrConmode == 2) {
									$select = $('<select class="form-control bordered-input"></select>');
								} else {
									$select = $('<select class="form-control bordered-input" disabled></select>');
								}
							}
							var $option;
							for (var j = 0; j < result.data[i].fieldValues.length; j++) {
								if (result.data[i].sysRgrPara.chrValue == result.data[i].fieldValues[j].CHR_CODE) {
									$option = $('<option value=' + result.data[i].fieldValues[j].CHR_CODE + ' selected >' + result.data[i].fieldValues[j].CHR_NAME + '</option>');
								} else {
									$option = $('<option value=' + result.data[i].fieldValues[j].CHR_CODE + '>' + result.data[i].fieldValues[j].CHR_NAME + '</option>');
								}
								$select.append($option);
							}
							$chrValue.append($select);
							break;
						case 2:
							//fieldDisptype:2 是枚举,开关形式。判断数据chrValue的值，创建节点
							//判断系统级和单位级
							if (!$("#cbAgency").get(0)) {
								//系统级
								if (result.data[i].sysRgrPara.chrConmode == 2) {
									$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f0" disabled>' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[1].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										result.data[i].fieldValues[1].ENU_NAME + '</label>' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f1" disabled>' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[0].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										result.data[i].fieldValues[0].ENU_NAME + '</label>' +
										'</div></div>');
								} else {
									$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[1].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										result.data[i].fieldValues[1].ENU_NAME + '</label>' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[0].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										result.data[i].fieldValues[0].ENU_NAME + '</label>' +
										'</div></div>');
								}
							} else {
								//单位级
								if (result.data[i].sysRgrPara.chrConmode == 2) {
									$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[1].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										result.data[i].fieldValues[1].ENU_NAME + '</label>' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[0].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										result.data[i].fieldValues[0].ENU_NAME + '</label>' +
										'</div></div>');
								} else {
									$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f0" disabled>' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[1].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f0">' +
										result.data[i].fieldValues[1].ENU_NAME + '</label>' +
										'<label class="btn btn-sm btn-default" for="' + result.data[i].sysRgrPara.chrCode + '-f1" disabled>' +
										'<input type="radio" name="' + result.data[i].sysRgrPara.chrCode + '.chrValue" value=' + result.data[i].fieldValues[0].ENU_CODE + ' autocomplete="off" id="' + result.data[i].sysRgrPara.chrCode + '-f1">' +
										result.data[i].fieldValues[0].ENU_NAME + '</label>' +
										'</div></div>');
								}
							}
							$chrValue.find('input[value="' + result.data[i].sysRgrPara.chrValue + '"]').prop("checked", true).parents("label.btn").addClass("active");
							break;
						case 8:
							//fieldDisptype:8 是枚举，下拉列表样式。
							$chrValue = $('<div class="rule-chrValue"></div>');
							var $chrValueSelect;
							//判断系统级和单位级
							if (!$("#cbAgency").get(0)) {
								//系统级
								// CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--BG007系统级不显示下拉框，且单位级不显示此选项
								if (result.data[i].sysRgrPara.chrCode != 'BG007') {
									if (result.data[i].sysRgrPara.chrConmode == 2) {
										$chrValueSelect = $('<select class="form-control bordered-input" disabled></select>');
									} else {
										$chrValueSelect = $('<select class="form-control bordered-input"></select>');
									}
								}
							} else {
								//单位级
								if (result.data[i].sysRgrPara.chrConmode == 2) {
									$chrValueSelect = $('<select class="form-control bordered-input"></select>');
								} else {
									$chrValueSelect = $('<select class="form-control bordered-input" disabled></select>');
								}
							}
							var $chrValueOption;
							for (var j = 0; j < result.data[i].fieldValues.length; j++) {
								if (result.data[i].sysRgrPara.chrValue == result.data[i].fieldValues[j].ENU_CODE) {
									$chrValueOption = $('<option value=' + result.data[i].fieldValues[j].ENU_CODE + ' selected >' + result.data[i].fieldValues[j].ENU_NAME + '</option>');
								} else {
									$chrValueOption = $('<option value=' + result.data[i].fieldValues[j].ENU_CODE + '>' + result.data[i].fieldValues[j].ENU_NAME + '</option>');
								}
								$chrValueSelect.append($chrValueOption);
							}
							$chrValue.append($chrValueSelect);
							break;
						case 9:
							//fieldDisptype:9 下拉树样式
							$chrValue = $('<div class="rule-chrValue"></div>');
							$element = $('<div class="control-element"></div>');
							var $chrValueSelect;
							var $label;
							$chrValueSelect = $('<div id="' + result.data[i].sysRgrPara.chrCode + '" name="' + result.data[i].sysRgrPara.chrCode + '" class="uf-treecombox "></div>');
							$label = $('<label for="' + result.data[i].sysRgrPara.chrCode + '" class="control-label hide  " title=""></label>');
							$chrValue.append($element);
							$element.append($chrValueSelect);
							$element.append($label);
							if (result.data[i].sysRgrPara.chrCode == 'MA008') {
								if (!$.isNull(result.data[i].sysRgrPara.chrValue)) {
									page.initMA008(result.data[i].sysRgrPara.chrValue);
								} else {
									page.initMA008('');
								}
								if (!$("#cbAgency").get(0)) {
									//系统级
									if (result.data[i].sysRgrPara.chrConmode == 2) {
										var timeId = setTimeout(function () {
											$("#MA008").disable();
											$("#MA008").addClass("uf-combox-disabled");
											$("#MA008_btn").hide();
											$("#MA008").find('span.icon-close').hide();
											ischange008 = false;
											clearTimeout(timeId);
										}, 300);
									}
								} else {
									//单位级
									if (result.data[i].sysRgrPara.chrConmode == 1) {
										var timeId = setTimeout(function () {
											$("#MA008").disable();
											$("#MA008").addClass("uf-combox-disabled");
											$("#MA008_btn").hide();
											$("#MA008").find('span.icon-close').hide();
											ischange008 = false;
											clearTimeout(timeId);
										}, 300);
									}
								}
							} else if (result.data[i].sysRgrPara.chrCode == 'MA009') {
								if (!$.isNull(result.data[i].sysRgrPara.chrValue)) {
									page.initMA009(result.data[i].sysRgrPara.chrValue);
								} else {
									page.initMA009('');
								}
								if (!$("#cbAgency").get(0)) {
									//系统级
									if (result.data[i].sysRgrPara.chrConmode == 2) {
										var timeId = setTimeout(function () {
											$("#MA009").disable();
											$("#MA009").addClass("uf-combox-disabled");
											$("#MA009_btn").hide();
											$("#MA009").find('span.icon-close').hide();
											ischange009 = false;
											clearTimeout(timeId);
										}, 500);
									}
								} else {
									//单位级
									if (result.data[i].sysRgrPara.chrConmode == 1) {
										var timeId = setTimeout(function () {
											$("#MA009").disable();
											$("#MA009").addClass("uf-combox-disabled");
											$("#MA009_btn").hide();
											$("#MA009").find('span.icon-close').hide();
											ischange009 = false;
											clearTimeout(timeId);
										}, 500);
									}
								}
							}
							break;
						default:
							break;
					}
					$liOneChr.append($chrValue);
					//定义$chrConmode变量，判断数据chrConmode的值创建节点，并加入li
					if (!$("#cbAgency").get(0)) {
						// CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--BG007系统级不显示下拉框，且单位级不显示此选项
						//GUOHX 修改审计数据导入 系统选项不显示系统级控制下拉 默认系统级控制 单位级不显示此选项 20200929
						if (result.data[i].sysRgrPara.chrCode != 'BG007' && result.data[i].sysRgrPara.chrCode != 'DE001') {
							//系统级
							var $chrConmode = $('<div class="rule-chrConmode"></div>');
							var $chrConmodeSelect = $('<select class="form-control bordered-input"></select>');
							var $chrConmodeOption;
							for (var j = 0; j < result.data[i].chrConmodeValues.length; j++) {
								if (result.data[i].sysRgrPara.chrConmode == result.data[i].chrConmodeValues[j].ENU_CODE) {
									$chrConmodeOption = $('<option value=' + result.data[i].chrConmodeValues[j].ENU_CODE + ' selected >' + result.data[i].chrConmodeValues[j].ENU_NAME + '</option>');
								} else {
									$chrConmodeOption = $('<option value=' + result.data[i].chrConmodeValues[j].ENU_CODE + '>' + result.data[i].chrConmodeValues[j].ENU_NAME + '</option>');
								}
								$chrConmodeSelect.append($chrConmodeOption);
							}
							$chrConmode.append($chrConmodeSelect);
							$liOneChr.append($chrConmode);
						}
					}
					//第一次或者groupName与上一条数据不同，新建节点并加入；否则，直接加入
					if (i == 0 || result.data[i].sysRgrPara.groupName != result.data[i - 1].sysRgrPara.groupName) {
						$dl = $('<dl class="dl-horizontal"></dl>');
						$dt = $('<dt>' + result.data[i].sysRgrPara.groupName + '</dt>');
						$dd = $('<dd></dd>');
						$ul = $('<ul class="list-unstyled"></ul>');
						$ul.append($liOneChr);
						$dd.append($ul);
						$dl.append($dt);
						$dl.append($dd);
						$(".right-box").append($dl);
					} else {
						$ul.append($liOneChr);
					}
					if (result.data[i].sysRgrPara.chrCode == 'BG001' && result.data[i].sysRgrPara.chrValue == '0' && result.data[i].sysRgrPara.chrConmode == '1') {
						$(".list-unstyled li:eq(0) select:eq(0)").find('option:eq(1)').removeAttr('selected');
						$(".list-unstyled li:eq(0) select:eq(0)").find('option:eq(0)').prop('selected', true);
					} else if (result.data[i].sysRgrPara.chrCode == 'BG001' && result.data[i].sysRgrPara.chrValue == '0' && result.data[i].sysRgrPara.chrConmode == '2') {
						$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(1)').removeAttr('selected');
						$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(0)').prop('selected', true);
					}
				}
				//根据权限判断是否允许修改
				for (var n = 0; n < page.reslist.length; n++) {
					if (page.reslist[n].id == "can-change" && page.reslist[n].flag == "0") {
						$(".rule-chrConmode select").prop("disabled", true);
						$(".rule-chrValue select").prop("disabled", true);
						$(".rule-chrValue .btn-group label").attr("disabled", "disabled");
					}
				}
				//设置tooltip
				$('[data-toggle="tooltip"]').tooltip();
				ufma.parse();
				var winH = $(window).height();
				$(".right-box").css({
					"min-height": winH - 65 - 16 + 'px'
				});
				
			},

			//$.ajax()，传参成功后，console.log()出数据
			postBusRule: function (result) {
				ufma.showTip(result.msg, function () {
					ufma.hideloading();
				}, result.flag);
			},

			//判断盒子到顶部距离设置设置最小高度
			rightMinHeight: function () {
				var minHeight = $(".workspace").height() - ($(".right-box").offset().top - $(".workspace").offset().top);
				$(".right-box").css({
					"minHeight": minHeight
				});
			},

			//初始化页面
			initPage: function () {
				page.svData = ufma.getCommonData();
				//后台获取数据并加载
				if ($("#cbAgency").get(0)) {
					//获取门户相关数据

					page.agencyCode = page.svData.svAgencyCode;
					page.agencyName = page.svData.svAgencyName;
					//单位级
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						valueField: "id",
						textField: "codeName",
						readonly: false,
						placeholder: "请选择单位",
						icon: "icon-unit",
						onchange: function (data) {
							//改变单位触发事件
							// page.agencyCode = data.id;
							page.agencyCode = page.cbAgency.getValue();
							page.sysId = $(".left-switch-box a.choose").attr("data-sysId");

							$("#searchText").val("");
							$("dl.dl-horizontal").remove();

							ufma.get("/ma/agy/busRule/" + page.sysId + "?agencyCode=" + page.agencyCode, "", page.initBusRule);
						}
					});
					ufma.ajaxDef("/ma/sys/eleAgency/getAgencyTree", "get", "", function (result) {
						page.cbAgency = $("#cbAgency").ufmaTreecombox2({
							data: result.data,
						});
						var agyCode = $.inArrayJson(result.data, "id", page.svData.svAgencyCode);
						if (agyCode != undefined) {
							page.cbAgency.val(page.svData.svAgencyCode);
						} else {
							page.cbAgency.val(result.data[0].id);
						}
					});
				} else {
					page.agencyCode = "*";
					//系统级
 					ufma.get("/ma/sys/busRule/GL", "", this.initBusRule);
				}

				//加载页面，设置主体内容盒子的最小高度
				//this.rightMinHeight();
				ufma.parse();
			},
			//CWYXM-10272 --基础资料系统选项控制界面，增加选项间的启用判断--zsj
			/*单位级控制
			 * 1、是否启用预算控制为是：账务系统和报销单都可以选择
			 * 2、是否启用预算控制为否： 只能选择报销单，且禁用
			 * 系统级控制
			 * 1、是否启用预算控制为是：账务系统和报销单都可以选择
			 * 2、是否启用预算控制为否： 只能选择报销单，选择账务时给出提示
			 * result.data[i].sysRgrPara.chrConmode-----规则控制方式：1、系统级控制，2、单位级控制
			 */
			canChoose: function () {
				var sysId = 'GL';
				if ($("#cbAgency").get(0)) {
					//单位级
					page.agencyCode = page.cbAgency.getValue();
					ufma.get("/ma/agy/busRule/" + sysId + "?agencyCode=" + page.agencyCode, "", function (result) {
						for (var i = 0; i < result.data.length; i++) {
							if (result.data[i].sysRgrPara.chrCode == 'GL042' && result.data[i].sysRgrPara.chrValue == "0") {
								page.glCanChoose = false;
								$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(1)').removeAttr('selected');
								$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(0)').prop('selected');
							} else if (result.data[i].sysRgrPara.chrCode == 'GL042' && result.data[i].sysRgrPara.chrValue == "1") {
								page.glCanChoose = true;
							}
						}
					});
				} else {
					//系统级
					ufma.get("/ma/sys/busRule/" + sysId, "", function (result) {
						for (var i = 0; i < result.data.length; i++) {
							if (result.data[i].sysRgrPara.chrCode == 'GL042' && result.data[i].sysRgrPara.chrValue == "0") {
								page.glCanChoose = false;
								$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(1)').removeAttr('selected');
								$(".list-unstyled li:eq(1) select:eq(0)").find('option:eq(0)').prop('selected');
							} else if (result.data[i].sysRgrPara.chrCode == 'GL042' && result.data[i].sysRgrPara.chrValue == "1") {
								page.glCanChoose = true;
							}
						}
					});
				}
			},
			/**CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
			 * 当切换到指标时：请求是否使用接口，将“”禁用/启用
			 * 
			 */
			hashUseRecord: function (operationType) {
				var argus = {
					rgCode: page.svData.svRgCode,
					agencyCode: $("#cbAgency").get(0) ? page.agencyCode : '*',
					setYear: page.svData.svSetYear,
					operationType: operationType
				}
				ufma.ajaxDef('/bg/public/bg/bgapi/hashUseRecord', 'post', argus, function (result) {
					page.hashUseRecordIsUse = result.data.isUse;
				});
			},
			/**CWYXM-18144-ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj
			 * 1、只做系统级控制，不显示在单位级
			 * 2、当切换到指标时：请求是否使用接口，将“”禁用/启用
			 */
			authCurUseRecord: function (flag) {
				var argus = {
					rgCode: page.svData.svRgCode,
					agencyCode: $("#cbAgency").get(0) ? page.agencyCode : '*',
					setYear: page.svData.svSetYear,
					authCur: flag
				}
				ufma.ajaxDef('/bg/public/bg/bgapi/hashUseAuthCur', 'post', argus, function (result) {
					page.authCurIsUse = result.data.isUse;
				});
			},
			//查询角色 MA008
			initMA008: function(value) {
				var data = [];
				function buildCombox() {
					$('#MA008').ufTreecombox({
						idField: "id",
						textField: "name",
						pIdField: "pid",
						readonly: false,
						placeholder: "",
						leafRequire: true,
						data: data,
						onChange: function (sender, data) {
							if (!ischange008) {
								var newName = data.name.replace(" ", "-")
								var postSet = {
									chrCode: 'MA008',
									chrValue: data.id + "-" + newName,
									agencyCode: page.agencyCode
								};
								ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
							}
							ischange008 = false;
						},
						onComplete: function (sender) {
							if (value) {
								var newValue = value.split('-')[0];
								ischange008 = true;
								$('#MA008').getObj().val(newValue);
							} 
						}
					});
				};
				var callback = function(result) {
					data = result.data;
					buildCombox();
					//需求说可以保存为空，所以清空要走请求更新 guohx 20200925
					$("#MA008").find('span.icon-close').on('click', function() {
						var postSet = {
							chrCode: 'MA008',
							chrValue: '',
							agencyCode: page.agencyCode
						};
						ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
					});
				};
				var url = '/ma/sys/userData/selectRoleTree';
				ufma.get(url, {}, callback);
			},
			//查询数据权限 MA009
			initMA009: function(value) {
				var data = [];
				function buildCombox() {
					$('#MA009').ufTreecombox({
						idField: "rule_id",
						textField: "name",
						pIdField: "pid",
						readonly: false,
						placeholder: "",
						leafRequire: true,
						data: data,
						onChange: function (sender, data) {
							if (!ischange009) {
								var postSet = {
									chrCode: 'MA009',
									chrValue: data.rule_id,
									agencyCode: page.agencyCode
								};
								ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
							}
							ischange009 = false;
						},
						onComplete: function (sender) {
							if (value) {
								ischange009 = true;
								$('#MA009').getObj().val(value);
							} 
						}
					});
				};
				var callback = function(result) {
					data = result.data;
					buildCombox();
					$("#MA009").find('span.icon-close').on('click', function() {
						var postSet = {
							chrCode: 'MA009',
							chrValue: '',
							agencyCode: page.agencyCode
						};
						ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
					});
				};
				var url = '/ma/sys/userData/selectDataRuleTree';
				ufma.get(url, {}, callback);
			},
  
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				//点击账务或指标，页面内容达到切换
				$(".left-switch-box a").on("click", function () {
					if (!$(this).hasClass("choose")) {
						$(".left-switch-box a").removeClass("choose");
						$(this).addClass("choose");
						page.sysId = $(this).attr("data-sysId");
						$("#searchText").val("");
						$("dl.dl-horizontal").remove();

						//判断系统级单位级
						if ($("#cbAgency").get(0)) {
							//单位级
							page.agencyCode = page.cbAgency.getValue();
							ufma.get("/ma/agy/busRule/" + page.sysId + "?agencyCode=" + page.agencyCode, "", page.initBusRule);
						} else {
							//系统级
							ufma.get("/ma/sys/busRule/" + page.sysId, "", page.initBusRule);
						}
						if (page.sysId == 'BG') {
							page.canChoose();
						}
					}
				});

				//点击业务规则设置按钮，传值给后台
				$(".right-box").on("click", ".btn-group label", function (e) {
					//	$(".right-box").on("change", ".btn-group label", function(e) {
					//防止多次点击(与.asClass()配合)
					var clickType = 0;
					if (!$(this).hasClass("active") && clickType == 0) {
						if ($(this).find("input[type='radio']").attr('id') == 'GL006-f0' && $('#GL008-f0').parent('label').hasClass('active') == true) {
							ufma.showTip('不可同时启用“自动补齐凭证号”和“凭证号和凭证日期同时递增”', function () { }, 'warning');
							return false;
						} else if ($(this).find("input[type='radio']").attr('id') == 'GL008-f0' && $('#GL006-f0').parent('label').hasClass('active') == true) {
							ufma.showTip('不可同时启用“自动补齐凭证号”和“凭证号和凭证日期同时递增”', function () { }, 'warning');
							return false;
						} else if ($(this).find("input[type='radio']").attr('id') == 'GL042-f0' || $(this).find("input[type='radio']").attr('id') == 'GL042-f1') {
							var code = $(this).parents("li").find("input[type='hidden']").attr('name');
							var codeVal = $(this).find("input[type='radio']").val();
							var $this = $(this);
							var chrConmode = $(this).parents("li").find('select.form-control.bordered-input').val();
							var argu = {
								agencyCode: page.agencyCode,
								chrCode: code, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
								chrValue: codeVal,
								chrConmode: chrConmode
							}
							//CWYXM-10272 --基础资料系统选项控制界面，增加选项间的启用判断--更改前校验是否已使用--zsj
							ufma.put('/ma/sys/busRule/checkUsed', argu, function (result) {
								if (result.flag != 'success') {
									if (code == 'GL042' && codeVal == '0') {
										$this.removeClass("active").siblings().addClass('active');
									} else if (code == 'GL042' && codeVal == '1') {
										$this.removeClass("active").siblings().addClass('active');
									}
									ufma.showTip(result.msg, function () { }, 'warning');
									return false;
								} else {
									page.chrId = $this.parents("li").find("input[type='hidden']").val();
									page.chrCode = $this.parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									page.chrValue = $this.find("input[type='radio']").val();
									$this.siblings().removeClass("active");
									$this.addClass("active");
									//判断系统级单位级
									if ($("#cbAgency").get(0)) {
										//单位级
										page.agencyCode = page.cbAgency.getValue();
										postSet = {
											//chrId: page.chrId,
											chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
											chrValue: page.chrValue,
											agencyCode: page.agencyCode
										};
										ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
									} else {
										//系统级
										postSet = {
											//chrId: page.chrId,
											chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
											chrValue: page.chrValue,
											agencyCode: '*'
										};
										ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
									}
								}
							});
						} else if (($(this).find("input[type='radio']").attr('id') == 'GL064-f0') && ($("#cbAgency").get(0))) {
							var code = $(this).parents("li").find("input[type='hidden']").attr('name');
							var codeVal = $(this).find("input[type='radio']").val();
							var $this = $(this);
							var argu = {
								agencyCode: page.agencyCode,
								chrCode: code, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
								chrValue: codeVal
							}
							ufma.put('/ma/sys/busRule/checkGL064Value', argu, function (result) {
								if (result.flag != 'success') {
									if (code == 'GL064' && codeVal == '0') {
										$this.removeClass("active").siblings().addClass('active');
									} else if (code == 'GL064' && codeVal == '1') {
										$this.removeClass("active").siblings().addClass('active');
									}
									ufma.showTip(result.msg, function () { }, 'warning');
									return false;
								} else {
									page.chrId = $this.parents("li").find("input[type='hidden']").val();
									page.chrCode = $this.parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									page.chrValue = $this.find("input[type='radio']").val();
									$this.siblings().removeClass("active");
									$this.addClass("active");
								}
							});
						} else if ((($(this).find("input[type='radio']").attr('id') == 'BG005-f0') || ($(this).find("input[type='radio']").attr('id') == 'BG005-f1'))) { //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							// 当前为 系统级控制时：查看所有 单位是否都没有使用，若已使用则不允许修改；若当前为单位级控制，查看当前单位是否已使用，若已使用则不允许修改；
							var operationType = '2'; // 2表示按钮切换
							page.hashUseRecord(operationType);
							if (page.hashUseRecordIsUse == true) {
								ufma.showTip('指标权限已有数据，不允许修改', function () { }, 'warning');
								return false;
							} else {
								//CWYXM-18102--指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
								page.chrId = $(this).parents("li").find("input[type='hidden']").val();
								page.chrCode = $(this).parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
								page.chrValue = $(this).find("input[type='radio']").val();
								$(this).siblings().removeClass("active");
								$(this).addClass("active");
								//判断系统级单位级
								if ($("#cbAgency").get(0)) {
									//单位级
									page.agencyCode = page.cbAgency.getValue();
									postSet = {
										//chrId: page.chrId,
										chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
										chrValue: page.chrValue,
										agencyCode: page.agencyCode
									};
									ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
								} else {
									//系统级
									postSet = {
										//chrId: page.chrId,
										chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
										chrValue: page.chrValue,
										agencyCode: '*'
									};
									ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
								}
							}
						} else if ((($(this).find("input[type='radio']").attr('id') == 'BG007-f0') || ($(this).find("input[type='radio']").attr('id') == 'BG007-f1'))) { // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--BG007系统级不显示下拉框，且单位级不显示此选项
							//CWYXM-18102--指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							page.chrId = $(this).parents("li").find("input[type='hidden']").val();
							page.chrCode = $(this).parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
							page.chrValue = $(this).find("input[type='radio']").val();
							//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							// 当前为 系统级控制时：查看所有 单位是否都没有使用，若已使用则不允许修改；若当前为单位级控制，查看当前单位是否已使用，若已使用则不允许修改；
							if (page.chrValue == '1') {
								var flag = true
								page.authCurUseRecord(flag);
							} else if (page.chrValue == '0') {
								var flag = false
								page.authCurUseRecord(flag);
							}
							if (page.authCurIsUse == true) {
								ufma.showTip('指标权限已有数据，不允许修改', function () { }, 'warning');
								return false;
							} else {
								$(this).siblings().removeClass("active");
								$(this).addClass("active");
								//判断系统级单位级
								if ($("#cbAgency").get(0)) {
									//单位级
									page.agencyCode = page.cbAgency.getValue();
									postSet = {
										//chrId: page.chrId,
										chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
										chrValue: page.chrValue,
										agencyCode: page.agencyCode
									};
									ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
								} else {
									//系统级
									postSet = {
										//chrId: page.chrId,
										chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
										chrValue: page.chrValue,
										agencyCode: '*'
									};
									ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
								}
							}
						}
						else {
							page.chrId = $(this).parents("li").find("input[type='hidden']").val();
							page.chrCode = $(this).parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
							page.chrValue = $(this).find("input[type='radio']").val();
							$(this).siblings().removeClass("active");
							$(this).addClass("active");
							//判断系统级单位级
							if ($("#cbAgency").get(0)) {
								//单位级
								page.agencyCode = page.cbAgency.getValue();
								postSet = {
									//chrId: page.chrId,
									chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									chrValue: page.chrValue,
									agencyCode: page.agencyCode
								};
								ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
							} else {
								//系统级
								postSet = {
									//chrId: page.chrId,
									chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									chrValue: page.chrValue,
									agencyCode: '*'
								};
								ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
							}
						}

						clickType++;
					}
				});

				//点击业务规则设置下拉列表，传值给后台
				$(".right-box").on("change", "select", function () {
					page.chrId = $(this).parents("li").find("input[type='hidden']").val();
					page.chrCode = $(this).parents("li").find("input[type='hidden']").attr('name'); //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
					if ($(this).parents(".rule-chrValue")[0]) {
						page.chrValue = $(this).val();
						//CWYXM-10272 --基础资料系统选项控制界面，增加选项间的启用判断--zsj
						if (page.glCanChoose == false && page.sysId == 'BG') {
              //ZWCW01134046 切换没有控制住--zsj
							if (page.chrCode == 'BG001' && page.chrValue == '1') {
								$(this).find('option:eq(1)').removeAttr('selected');
								$(this).find('option:eq(0)').prop('selected', true);
								ufma.showTip('账务系统没有启用预算控制，来源不能选择账务系统', function () { }, 'warning');
								return false;
							}
						} else if (page.chrCode == 'BG005') {
							//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							// 当前为系统级控制时：修改为单位级控制时，不做处理；若当前为单位级控制，修改为系统级控制时需要查看所有单位是否已经使用；
							if (page.chrValue == '1') {
								var operationType = '1'; // 1表示下拉框切换为系统级：表示从单位级换到系统级
								page.hashUseRecord(operationType);
								if (page.hashUseRecordIsUse == true) {
									$(this).find('option:eq(1)').removeAttr('selected');
									$(this).find('option:eq(0)').prop('selected');
									ufma.showTip('指标权限已有数据，不允许修改', function () { }, 'warning');
									return false;
								}
								// else if(page.chrValue == '2') {
								//   // 2为单位级
								//   $(this).find('option:eq(0)').removeAttr('selected');
								//   $(this).find('option:eq(1)').prop('selected');
								//   ufma.showTip('指标权限已有数据，不允许修改', function() {}, 'warning');
								//   return false;
								// }
							}
						} else if (page.chrCode == 'GL068') {
							//CWYXM-17987【财务云】江苏人社：国标数据导入凭证号6位问题 20200804 guohx
							var $this = $(this);
							page.agencyCode = $("#cbAgency").get(0) ? page.cbAgency.getValue() : '*';
							var argu = {
								agencyCode: page.agencyCode,
								chrCode: page.chrCode,
								chrValue: $(this).val(),
							}
							ufma.put('/ma/sys/busRule/checkGL068Value', argu, function (result) {
								if (result.data == "0") {
									ufma.showTip(result.msg, function () { }, 'warning');
									ufma.ajaxDef("/ma/sysrgpara/getSysRgparaValueByChrCode/GL068", 'get', "", function (result) {
										$this.find('option[value="' + result.data + '"]').prop('selected', true);
									})
								} else {
									ufma.showloading('数据更新中，请耐心等候...');
									postSet = {
										chrCode: page.chrCode,
										chrValue: page.chrValue,
										agencyCode: page.agencyCode
									};
									ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
								}
							});
						} else {
							//判断系统级单位级
							if ($("#cbAgency").get(0)) {
								//单位级
								page.agencyCode = page.cbAgency.getValue();
								postSet = {
									//chrId: page.chrId,
									chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									chrValue: page.chrValue,
									agencyCode: page.agencyCode
								};
								ufma.put("/ma/agy/busRule/updateChrValue", postSet, page.postBusRule);
							} else {
								page.agencyCode = '*';
								//系统级
								postSet = {
									//chrId: page.chrId,
									chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
									chrValue: page.chrValue,
									agencyCode: page.agencyCode
								};
								ufma.put("/ma/sys/busRule/updateChrValue", postSet, page.postBusRule);
							}
						}
					} else {
						if ($("#cbAgency").get(0)) {
							page.agencyCode = page.cbAgency.getValue();
						} else {
							page.agencyCode = '*';
						}
						page.chrConmode = $(this).val();
						postSet = {
							//chrId: page.chrId,
							chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
							chrConmode: page.chrConmode,
							agencyCode: page.agencyCode
						};
						if (page.chrCode == 'GL042') {
							var argu = {
								chrCode: page.chrCode, //避免产生单位找不到系统选项时报错的现象，修改时将chrID改为chrCode传给后端--zsj
								chrValue: $(this).parents("li").find(".rule-chrValue label.active input").attr('value'),
								chrConmode: page.chrConmode,
								agencyCode: page.agencyCode
							}
							var $this = $(this);
							//CWYXM-10272 --基础资料系统选项控制界面，增加选项间的启用判断--更改前校验是否已使用--zsj
							ufma.put('/ma/sys/busRule/checkUsed', argu, function (result) {
								if (result.flag != 'success') {
									if (page.chrCode == 'GL042' && page.chrConmode == '0') {
										$this.find('option:eq(1)').removeAttr('selected');
										$this.find('option:eq(0)').prop('selected', true);
									} else if (page.chrCode == 'GL042' && page.chrConmode == '1') {
										$this.find('option:eq(0)').removeAttr('selected');
										$this.find('option:eq(1)').prop('selected', true);
									}
									ufma.showTip(result.msg, function () { }, 'warning');
								} else {
									ufma.showloading('数据更新中，请耐心等候...');
									ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
									if ($this.val() == 2) {
										$this.parents("li").find(".rule-chrName span").addClass("disabled-color");
										$this.parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
										$this.parents("li").find(".rule-chrValue select").prop("disabled", true);
									} else {
										$this.parents("li").find(".rule-chrName span").removeClass("disabled-color");
										$this.parents("li").find(".rule-chrValue label").removeAttr("disabled");
										$this.parents("li").find(".rule-chrValue select").prop("disabled", false);
									}
								}
							});
						} else if (page.chrCode == 'GL068') {
							//CWYXM-17987【财务云】江苏人社：国标数据导入凭证号6位问题 20200804 guohx
							var $this = $(this);
							var argu = {
								agencyCode: page.agencyCode,
								chrCode: page.chrCode,
								chrValue: $(this).parents("li").find(".rule-chrValue label.active input").attr('value'),
							}
							//单位级控制切换为系统级控制要校验 反之不校验 guohx  20200821
							if ($(this).parents("li").find(".rule-chrConmode").find('select').children('option:selected').val() == "1") {
								ufma.put('/ma/sys/busRule/checkGL068Value', argu, function (result) {
									if (result.data == "0") {
										if (page.chrCode == 'GL068' && page.chrConmode == '2') {
											$this.find('option:eq(1)').removeAttr('selected');
											$this.find('option:eq(0)').prop('selected', true);
										} else if (page.chrCode == 'GL068' && page.chrConmode == '1') {
											$this.find('option:eq(0)').removeAttr('selected');
											$this.find('option:eq(1)').prop('selected', true);
										}
										ufma.showTip(result.msg, function () { }, 'warning');
									} else {
										ufma.showloading('数据更新中，请耐心等候...');
										ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
										if ($this.val() == 2) {
											$this.parents("li").find(".rule-chrName span").addClass("disabled-color");
											$this.parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
											$this.parents("li").find(".rule-chrValue select").prop("disabled", true);
										} else {
											$this.parents("li").find(".rule-chrName span").removeClass("disabled-color");
											$this.parents("li").find(".rule-chrValue label").removeAttr("disabled");
											$this.parents("li").find(".rule-chrValue select").prop("disabled", false);
										}
									}
								});
							} else {
								ufma.showloading('数据更新中，请耐心等候...');
								ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
								if ($this.val() == 2) {
									$this.parents("li").find(".rule-chrName span").addClass("disabled-color");
									$this.parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
									$this.parents("li").find(".rule-chrValue select").prop("disabled", true);
								} else {
									$this.parents("li").find(".rule-chrName span").removeClass("disabled-color");
									$this.parents("li").find(".rule-chrValue label").removeAttr("disabled");
									$this.parents("li").find(".rule-chrValue select").prop("disabled", false);
								}
							}

						} else if (page.chrCode == 'BG005') { //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
							// 1表示从单位级切换到了系统级
							if (page.chrConmode == '1') {
								var operationType = '1'; // 1表示下拉框切换为系统级：表示从单位级换到系统级
								page.hashUseRecord(operationType);
								if (page.hashUseRecordIsUse == true) {
									ufma.showTip('指标权限已有数据，不允许修改', function () { }, 'warning');
									$(this).find('option:eq(0)').removeAttr('selected');
									$(this).find('option:eq(1)').prop('selected', 'selected');
									return false;
								} else if (page.hashUseRecordIsUse == false) {
									ufma.showloading('数据更新中，请耐心等候...');
									ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
									if ($(this).val() == 2) {
										$(this).parents("li").find(".rule-chrName span").addClass("disabled-color");
										$(this).parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
										$(this).parents("li").find(".rule-chrValue select").prop("disabled", true);
									} else {
										$(this).parents("li").find(".rule-chrName span").removeClass("disabled-color");
										$(this).parents("li").find(".rule-chrValue label").removeAttr("disabled");
										$(this).parents("li").find(".rule-chrValue select").prop("disabled", false);
									}
								}
								// else if(page.chrConmode == '2') {
								//   $(this).find('option:eq(1)').removeAttr('selected');
								//   $(this).find('option:eq(0)').prop('selected','selected');
								//   ufma.showTip('指标权限已有数据，不允许修改', function() {}, 'warning');
								//   return false;
								// }
							} else {
								ufma.showloading('数据更新中，请耐心等候...');
								ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
								if ($(this).val() == 2) {
									$(this).parents("li").find(".rule-chrName span").addClass("disabled-color");
									$(this).parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
									$(this).parents("li").find(".rule-chrValue select").prop("disabled", true);
								} else {
									$(this).parents("li").find(".rule-chrName span").removeClass("disabled-color");
									$(this).parents("li").find(".rule-chrValue label").removeAttr("disabled");
									$(this).parents("li").find(".rule-chrValue select").prop("disabled", false);
								}
							}
						} else {
							ufma.showloading('数据更新中，请耐心等候...');
							ufma.put("/ma/sys/busRule/updateChrConmode", postSet, page.postBusRule);
							if ($(this).val() == 2) {
								$(this).parents("li").find(".rule-chrName span").addClass("disabled-color");
								$(this).parents("li").find(".rule-chrValue label").attr("disabled", "disabled");
								$(this).parents("li").find(".rule-chrValue select").prop("disabled", true);
							} else {
								$(this).parents("li").find(".rule-chrName span").removeClass("disabled-color");
								$(this).parents("li").find(".rule-chrValue label").removeAttr("disabled");
								$(this).parents("li").find(".rule-chrValue select").prop("disabled", false);
							}
						}
					}
					ischange008 = true;
					ischange009 = true;
				});

				//搜索框回车
				$("#searchText").on('keydown', function (e) {
					e.stopPropagation();
					if (e.keyCode == "13") {
						$(".btn-search").click();
					}
				});

				//检索页面内容
				$(".btn-search").on('click', function () {
					$(".right-box dl li").css({
						"padding-bottom": "8px"
					});
					var sText = $("#searchText").val();
					if (sText == "") {
						$(".right-box dl:hidden,.right-box li:hidden").show();
					} else {
						$(".rule-chrName").each(function () {
							if ($(this).find('span').text().indexOf(sText) == -1) {
								//没有要检索的内容
								$(this).parents("li").hide();
							} else {
								$(this).parents("li").show();
							}
						});
						$(".right-box dl").each(function () {
							if (!$(this).find('li:visible').get(0)) {
								//dl中所有li都隐藏，则dl也隐藏
								$(this).hide();
							}
						});
					}
					$(".right-box dl li:visible").eq(0).css({
						"padding-bottom": "0"
					});
				});
				//基础数据迁移功能----分支升级
				$('#basicData').on('click', function () {
					ufma.showloading('数据迁移中，请耐心等待...');
					ufma.get('/ma/pub/users/test', "", function (result) {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('数据迁移成功!', function () {
								$('#basicData').attr('disabled', true);
							}, 'success');

						} else {
							ufma.showTip('数据迁移失败，请联系管理员!', function () {
								$('#basicData').attr('disabled', false);
								return false;
							}, 'error');
						}
					});
				});
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				page.glCanChoose = false; //CWYXM-10272 --基础资料系统选项控制界面，增加选项间的启用判断--zsj
				page.hashUseRecordIsUse = false; //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
				page.authCurIsUse = false; // CWYXM-18144-ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj
				ufma.isShow(page.reslist); //显示带有权限的按钮--zsj
				this.initPage();
				this.onEventListener();
				ufma.parse();
				//				ac.test("页内调用公共方法");
			}
		}
	}();

	/////////////////////
	page.init();
});
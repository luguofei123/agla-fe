$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};

	var page = function() {

		var agencyCtrllevel = "0101";
		var chrId = "";
		var lastVer;
		var eleSource;
		//根据系统级还是单位级表格数据接口url不同
		var dataUrl, agencyCode;

		return {

			getErrMsg: function(errcode) {
				var error = {
					0: '要素编码不能为空',
					1: '要素名称不能为空',
					2: '要素名称不能为空',
					3: '要素编码只能为大写字母'
				};
				return error[errcode];
			},

			setParentMC: function() {
				var parentName = [];
				for(var i = 0; i < page.aInputParentCode.length; i++) {
					parentName.push(page.jCodeName[page.aInputParentCode[i]]);
				}
				page.inputParentName = parentName.join('/');
			},

			//保存入库请求
			save: function(goon) {
				//新增、编辑界面如果有新的功能添加，一定要去element.js中initEleImageList拼接为不显示的div，否则你将获取不到数据
				if(page.action == 'edit') {
					ufma.confirm("是否要同步修改下级区划的要素定义的属性", function(action) {
						if($("#eleCode").val() == "") {
							ufma.showInputHelp('eleCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
							$('#eleCode').closest('.form-group').addClass('error');
							return false;
						} else if($("#eleName").val() == "") {
							ufma.showInputHelp('eleName', '<span class="error">' + page.getErrMsg(1) + '</span>');
							$('#eleName').closest('.form-group').addClass('error');
							return false;
						}

						if($("#isCodeCheck").is(':checked')) {
							if($("#eleCode").val() == "CURRENCY") {
								$(".ufma-form-control-small:gt(0)").attr("disabled", true).val("");
							}
							if($(".ufma-form-control-small").eq(0).val() == "") {
								ufma.alert("请设置编码规则！", "warning");
								return false;
							}
						}
						var oneCode = document.getElementById("oneCode").value;
						var twoCode = document.getElementById("twoCode").value;
						var threeCode = document.getElementById("threeCode").value;
						var fourCode = document.getElementById("fourCode").value;
						var fiveCode = document.getElementById("fiveCode").value;
						var sixCode = document.getElementById("sixCode").value;
						var sevenCode = document.getElementById("sevenCode").value;
						var eightCode = document.getElementById("eightCode").value;
						var nineCode = document.getElementById("nineCode").value;
						var tenCode = document.getElementById("tenCode").value;
						//var isCodeCheck = document.getElementById("isCodeCheck").value;
						var allCode = "";
						if(tenCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode + "-" + nineCode + "-" + tenCode;
						} else if(nineCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode + "-" + nineCode;
						} else if(eightCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode;
						} else if(sevenCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode;;
						} else if(sixCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode;
						} else if(fiveCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode
						} else if(fourCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode
						} else if(threeCode != "") {
							allCode = oneCode + "-" + twoCode + "-" + threeCode;
						} else if(twoCode != "") {
							allCode = oneCode + "-" + twoCode;
						} else if(oneCode != "") {
							allCode = oneCode;
						}
						if(action) {
							ufma.showloading("正在保存数据，请耐心等待");
							var url = '/ma/sys/element/save?updateAllSonAgencyEle=1';
						} else {
							var url = '/ma/sys/element/save?updateAllSonAgencyEle=0';
						}
						var argu = $('#form-element').serializeObject();
						argu.chrId = chrId;
						argu.rgCode = page.rgCode;
						argu.setYear = page.setYear;
						argu.agencyCode = page.agencyCode;
						argu.lastVer = page.lastVer;
						if($("#isCodeCheck").is(':checked')) {
							argu.codeByRule = true;
						} else {
							argu.codeByRule = false;
						}
						argu.codeRule = allCode;
						$(".enabledLabel").each(function(n) {
							if($(this).hasClass("active")) {
								if(n == 0) {
									argu.allowSameFullName = "1";
								} else if(n == 1) {
									argu.allowSameFullName = "0";
								}
							}
						});
						$(".issueTypeData").each(function(n) {
							if($(this).hasClass("active")) {
								if(n == 0) {
									argu.issueType = "2";
								} else if(n == 1) {
									argu.issueType = "1";
								}
							}
						});
						//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
						$(".isAcctLevelData").each(function(n) {
							if($(this).hasClass("active")) {
								if(n == 0) {
									argu.isAcctLevel = "1";
								} else if(n == 1) {
									argu.isAcctLevel = "0";
								}
							}
						});
						argu.enabled = "1";
						argu.agencyCtrllevel = agencyCtrllevel;

						var callback = function(result) {
							if(result.flag == "success") {
								if(goon) {
									page.closeAction = "saveAdd";
									ufma.hideloading();
									ufma.showTip('保存成功,可以继续添加要素！', function() {
										page.clearmodel();
										page.action = "add";
										chrId = "";
									}, "success");
								} else {
									ufma.hideloading();
									ufma.showTip('保存成功！', function() {
										_close("save");
									}, "success");
								}
							} else {
								ufma.showTip(result.msg, function() {}, "error");
							}

						};
						ufma.post(url, argu, callback);

					}, {
						type: 'warning'
					});
				} else if(page.action == 'add') {
					if($("#eleCode").val() == "") {
						ufma.showInputHelp('eleCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#eleCode').closest('.form-group').addClass('error');
						return false;
					} else if($("#eleName").val() == "") {
						ufma.showInputHelp('eleName', '<span class="error">' + page.getErrMsg(1) + '</span>');
						$('#eleName').closest('.form-group').addClass('error');
						return false;
					}

					if($("#isCodeCheck").is(':checked')) {
						if($("#eleCode").val() == "CURRENCY") {
							$(".ufma-form-control-small:gt(0)").attr("disabled", true).val("");
						}
						if($(".ufma-form-control-small").eq(0).val() == "") {
							ufma.alert("请设置编码规则！", "warning");
							return false;
						}
					}
					var oneCode = document.getElementById("oneCode").value;
					var twoCode = document.getElementById("twoCode").value;
					var threeCode = document.getElementById("threeCode").value;
					var fourCode = document.getElementById("fourCode").value;
					var fiveCode = document.getElementById("fiveCode").value;
					var sixCode = document.getElementById("sixCode").value;
					var sevenCode = document.getElementById("sevenCode").value;
					var eightCode = document.getElementById("eightCode").value;
					var nineCode = document.getElementById("nineCode").value;
					var tenCode = document.getElementById("tenCode").value;
					//var isCodeCheck = document.getElementById("isCodeCheck").value;
					var allCode = "";
					if(tenCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode + "-" + nineCode + "-" + tenCode;
					} else if(nineCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode + "-" + nineCode;
					} else if(eightCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode + "-" + eightCode;
					} else if(sevenCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode + "-" + sevenCode;;
					} else if(sixCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode + "-" + sixCode;
					} else if(fiveCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode + "-" + fiveCode
					} else if(fourCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode + "-" + fourCode
					} else if(threeCode != "") {
						allCode = oneCode + "-" + twoCode + "-" + threeCode;
					} else if(twoCode != "") {
						allCode = oneCode + "-" + twoCode;
					} else if(oneCode != "") {
						allCode = oneCode;
					}
					ufma.showloading("正在保存数据，请耐心等待");
					var url = '/ma/sys/element/save';
					var argu = $('#form-element').serializeObject();
					argu.chrId = chrId;
					argu.rgCode = page.rgCode;
					argu.setYear = page.setYear;
					argu.agencyCode = page.agencyCode;
					argu.lastVer = page.lastVer;
					if($("#isCodeCheck").is(':checked')) {
						argu.codeByRule = true;
					} else {
						argu.codeByRule = false;
					}
					//                argu.codeByRule = $("#isCodeCheck").prop("checked");
					argu.codeRule = allCode;

					$(".enabledLabel").each(function(n) {
						if($(this).hasClass("active")) {
							if(n == 0) {
								argu.allowSameFullName = "1";
							} else if(n == 1) {
								argu.allowSameFullName = "0";
							}
						}
					});
					$(".issueTypeData").each(function(n) {
						if($(this).hasClass("active")) {
							if(n == 0) {
								argu.issueType = "2";
							} else if(n == 1) {
								argu.issueType = "1";
							}
						}
					});
					//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
					$(".isAcctLevelData").each(function(n) {
						if($(this).hasClass("active")) {
							if(n == 0) {
								argu.isAcctLevel = "1";
							} else if(n == 1) {
								argu.isAcctLevel = "0";
							}
						}
					});
					argu.enabled = "1";
					argu.agencyCtrllevel = agencyCtrllevel;
					var callback = function(result) {
						if(result.flag == "success") {
							if(goon) {
								page.closeAction = "saveAdd";
								ufma.hideloading();
								ufma.showTip('保存成功,可以继续添加要素！', function() {
									page.clearmodel();
								}, "success");
							} else {
								ufma.hideloading();
								ufma.showTip('保存成功！', function() {
									_close("save");
								}, "success");
							}
						} else {
							ufma.showTip(result.msg, function() {}, "error");
						}

					};
					ufma.post(url, argu, callback);
				}
			},

			delete: function() {
				var argu = {};
				argu.agencyCode = page.agencyCode;
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu.eleCode = $("#eleCode").val();
				ufma.confirm("是否确认删除", function(action) {
					if(action) {
						ufma.showloading("正在删除数据，请耐心等待");
						argu.eleCode = $("#eleCode").val();
						url = '/ma/sys/element/del';
						ufma.get(url, argu, function(result) {
							ufma.hideloading();
							ufma.showTip('删除成功!', function() {
								_close("delete");
							}, 'success');
						});
					}
				}, {
					type: 'warning'
				});
			},

			clearmodel: function() {
				$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
				$("#form-element").find("input[name='eleCode']").removeAttr("disabled");
				$("#form-element").find("input").val("");
				$(".enabledLabel").eq(1).removeClass("active");
				$(".enabledLabel").eq(0).addClass("active");
				if(!$("#cbAgency").get(0)) {
					$("input[name='agencyCtrllevel']").get(0).checked = true; //revise
					$("input[name='agencyCtrllevel']").get(1).checked = false;
					$("input[name='agencyCtrllevel']").get(2).checked = false;
					$(".controlTypeOneShow").css("display", "inline-block"); //revise
					$(".controlTypeThreeShow").css("display", "none");
				}
			},

			//修改给页面赋值
			setFormData: function(paramter) {
				setTimeout(function() {
					$("#form-element").find("input").val("");
					page.eleSource = $(paramter).parents(".ele-data-dom").find(".eleSource").text();
					/*$("#isCodeCheck").prop("checked",false).attr("disabled", true)
					 .siblings("span").css({"border":"1px solid #bbb","background":"#ccc"})
					 .parent("label").css("cursor","default");*/

					//判断系统级和单位级
					/*if (!$("#cbAgency").get(0)) {*/
					//系统级
					var fieldStr = $(paramter).parents(".ele-data-dom").find(".fieldArr").text();
					//console.info("fieldStr==" + fieldStr);
					var fieldArr = fieldStr.split(",");
					var newFieldArr = [];
					for(var i = 0; i < fieldArr.length; i++) {
						if(fieldArr[i] != "null" && fieldArr[i] != null && fieldArr[i] != "") {
							newFieldArr.push(fieldArr[i]);
						}
					}
					$("#form-element").find("input[name='eleName']").val($(paramter).parents(".ele-data-dom").find(".eleName span").text());
					$("#form-element").find("input[name='eleCode']").attr("disabled", true);
					var thisEleCode = $(paramter).parents(".ele-data-dom").find(".eleCode").text();
					$("#form-element").find("input[name='eleCode']").val(thisEleCode);
					var codeRule = $(paramter).parents(".ele-data-dom").find(".codeRule").text();
					//console.info("codeRule==" + codeRule);
					var codeRuleSingle = "";
					if(codeRule != "不限定长度" && codeRule != "") {
						$("#isCodeCheck").prop("checked", true);
						codeRuleSingle = codeRule.split("-");
						$(".ufma-form-control-small").removeAttr("disabled");
						if(thisEleCode == "CURRENCY") {
							$(".ufma-form-control-small:gt(0)").attr("disabled", true);
						}
					} else {
						$("#isCodeCheck").prop("checked", false);
					}
					for(var i = 0; i < codeRuleSingle.length; i++) {
						if(i == 0) {
							$("#form-element").find("input[id='oneCode']").val(codeRuleSingle[i]);
						} else if(i == 1) {
							$("#form-element").find("input[id='twoCode']").val(codeRuleSingle[i]);
						} else if(i == 2) {
							$("#form-element").find("input[id='threeCode']").val(codeRuleSingle[i]);
						} else if(i == 3) {
							$("#form-element").find("input[id='fourCode']").val(codeRuleSingle[i]);
						} else if(i == 4) {
							$("#form-element").find("input[id='fiveCode']").val(codeRuleSingle[i]);
						} else if(i == 5) {
							$("#form-element").find("input[id='sixCode']").val(codeRuleSingle[i]);
						} else if(i == 6) {
							$("#form-element").find("input[id='sevenCode']").val(codeRuleSingle[i]);
						} else if(i == 7) {
							$("#form-element").find("input[id='eightCode']").val(codeRuleSingle[i]);
						} else if(i == 8) {
							$("#form-element").find("input[id='nineCode']").val(codeRuleSingle[i]);
						} else if(i == 9) {
							$("#form-element").find("input[id='tenCode']").val(codeRuleSingle[i]);
						}
					}

					if(!$("#cbAgency").get(0)) {
						agencyCtrllevel = $(paramter).parents(".ele-data-dom").find(".agencyCtrllevel").text();
						//console.info("agencyCtrllevel==" + agencyCtrllevel);
						if(agencyCtrllevel == "0101") { //上下级公用 -下发
							$("input[id='controlTypeOne']").get(0).checked = true;
							$(".controlTypeOneShow").css("display", "inline-block");
							$(".controlTypeThreeShow").css("display", "none");
							$("#gyxf").addClass("active");
							$("#gyxy").removeClass("active");
						}
						if(agencyCtrllevel == "0102") { //上下级公用 -选用
							$("input[id='controlTypeOne']").get(0).checked = true;
							$(".controlTypeOneShow").css("display", "inline-block");
							$(".controlTypeThreeShow").css("display", "none");
							$("#gyxy").addClass("active");
							$("#gyxf").removeClass("active");
						}
						if(agencyCtrllevel == "0201") { //下级细化 -可增加一级
							$("input[id='controlTypeThree']").get(0).checked = true;
							$(".controlTypeThreeShow").css("display", "inline-block");
							$(".controlTypeOneShow").css("display", "none");
							$("input[id='isDetail']").prop("checked", true);
						}
						if(agencyCtrllevel == "0202") { //下级细化 -不可增加一级
							$("input[id='controlTypeThree']").get(0).checked = true;
							$(".controlTypeThreeShow").css("display", "inline-block");
							$(".controlTypeOneShow").css("display", "none");
							$("input[id='isDetail']").prop("checked", false);
						}
						if(agencyCtrllevel == "03") { //上下级无关
							$("input[id='controlTypeTwo']").get(0).checked = true;
							$(".controlTypeOneShow").css("display", "none");
							$(".controlTypeThreeShow").css("display", "none");
						}
					}
					page.lastVer = $(paramter).parents(".ele-data-dom").find(".lastVer").text();
					var enabled = $(paramter).parents(".ele-data-dom").find(".data-enabled").text();
					var allowSameFullName = $(paramter).parents(".ele-data-dom").find(".allowSameFullName").text();
					var issueType = $(paramter).parents(".ele-data-dom").find(".issueType").text();
					//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
					var isAcctLevel = $(paramter).parents(".ele-data-dom").find(".isAcctLevel").text();
					//判断是否是平台维护的 guohx  20200825
					var isOperate = $(paramter).parents(".ele-data-dom").find(".isOperate").text();
					console.log(isOperate);
					//平台维护不可以编辑 guohx 20200825
					if(isOperate == "1"){
						$("#form-element").disable();
						$("#btn-saveadd").addClass("disabled");
						$("#btn-save").addClass("disabled");
						$(".btn-delete").addClass("disabled");
					}
					//console.info("enabled==" + enabled);
					if(allowSameFullName == "0") {
						$(".enabledLabel").eq(0).removeClass("active");
						$(".enabledLabel").eq(1).addClass("active");
					} else if(allowSameFullName == "1") {
						$(".enabledLabel").eq(1).removeClass("active");
						$(".enabledLabel").eq(0).addClass("active");
					}
					if(issueType == "1") {
						$("#zjxf").removeClass("active");
						$("#yfdd").addClass("active");
					} else if(issueType == "2") {
						$("#yfdd").removeClass("active");
						$("#zjxf").addClass("active");
					}
					//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
					if(isAcctLevel == "1") {
						$("#ztjNeedNo").removeClass("active");
						$("#ztjNeed").addClass("active");
					} else if(isAcctLevel == "0") {
						$("#ztjNeed").removeClass("active");
						$("#ztjNeedNo").addClass("active");
					}
					/* }
                     else {
                     //单位级
                     var dataAgy = {};
                     dataAgy.eleName = $(paramter).parents(".ele-data-dom").find(".eleName").text();
                     dataAgy.eleCode = $(paramter).parents(".ele-data-dom").find(".eleCode").text();
                     dataAgy.codeRule = $(paramter).parents(".ele-data-dom").find(".codeRule").text();
    
                     dataAgy.agencyCtrllevel = $(paramter).parents(".ele-data-dom").find(".agencyCtrllevel").text();
    
                     dataAgy.chrId = $(paramter).parents(".ele-data-dom").find(".chrId").text();
                     return dataAgy;
                     }*/
				}, 1000);
			},

			onEventListener: function() {
				$('input').on('blur', function() {
					if($(this).attr('maxlength')) {
						var testRex = /[^\x00-\xff]/ig;
						var msg = $(this).val();
						var strArr = $(this).val().split('');
						var count = 0;
						var twoCount = 0;
						var allCount = 0;
						var maxlength = parseInt($(this).attr('maxlength'));
						var finalLength = 0;
						var realLeng = parseInt(maxlength / 2);
						for(var i = 0; i < msg.length; i++) {
							if((msg.charCodeAt(i) >= 65 && msg.charCodeAt(i) <= 90) || (msg.charCodeAt(i) >= 97 && msg.charCodeAt(i) <= 122) || (msg.charCodeAt(i) >= 48 && msg.charCodeAt(i) <= 57)) {
								count += 1;
								if(count > maxlength) {
									$(this).val($(this).val().substring(0, maxlength));
								}
							} else {
								twoCount += 1;
								if(twoCount > realLeng) {
									$(this).val($(this).val().substring(0, realLeng));
								}
							}
						}
						allCount = count + parseInt(twoCount * 2);
						if(allCount > maxlength) {
							var oneOver = 0;
							if(count == 0 && twoCount != 0) {
								$(this).val($(this).val().substring(0, realLeng));
							} else if(count != 0 && twoCount == 0) {
								$(this).val($(this).val().substring(0, maxlength));
							} else if(count != 0 && twoCount != 0) {
								if(count % 2 == 0) {
									var twolen = (maxlength - count) / 2;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								} else {
									var twolen = (maxlength - count) / 2 + 1;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								}
							}
						}
					}
				});
				$('#btn-saveadd').on('click', function(e) {
					if(page.checkRuleLen()) { //校验编码规则长度不能大于42(revise)
						page.save(true);
						$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").attr("disabled", true);
						setTimeout(function() {
							$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
						}, 3000);
					}

				});

				$('#btn-save').on('click', function(e) {
					if(page.checkRuleLen()) { //校验编码规则长度不能大于42(revise)
						page.save(false);
						$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").attr("disabled", true);
						setTimeout(function() {
							$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
						}, 3000);
					}
				});

				$('.btn-delete').on('click', function() {
					page.delete();
					$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").attr("disabled", true);
					setTimeout(function() {
						$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
					}, 3000);
				});

				$('.btn-close').on('click', function() {
					// ufma.confirm("内容未保存，您确定要关闭吗？", function (action) {
					//     if (action) {
					//         _close("close");
					//     }
					// });
					if(page.closeAction != "") {
						_close(page.closeAction);
					} else {
						_close("close");
					}
				});

				//复选框事件
				$('#isCodeCheck').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						$(".ufma-form-control-small").attr("disabled", false);
					} else {
						$(".ufma-form-control-small").val("").attr("disabled", true);
					}
				});
				//单选框事件-上下级公用
				$('#controlTypeOne').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						$(".controlTypeOneShow").css("display", "inline-block");
						$(".controlTypeThreeShow").css("display", "none");
						$(".downStep").css("display", "inline-block");
						agencyCtrllevel = "0101";
					}
				});
				//下发
				$('#gyxf').on('click', function() {
					agencyCtrllevel = "0101";
				});
				//选用
				$('#gyxy').on('click', function() {
					agencyCtrllevel = "0102"
				}); 
				//上下级无关：应该隐藏“逐级下发”
				/*CWYXM-6618【20190930 财务云8.0 】要素定义界面 逐级下发选项 选择上下级无关不应该显示出来--zsj*/
				$('#controlTypeTwo').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						$(".downStep").css("display", "none");
					}
				});

				//下级细化

				$('#controlTypeThree').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						$(".controlTypeOneShow").css("display", "none");
						$(".controlTypeThreeShow").css("display", "inline-block");
						$(".downStep").css("display", "inline-block");
						agencyCtrllevel = "0202";
					}
				});
				//可增加一级
				$('#isDetail').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						agencyCtrllevel = "0201";
					} else {
						agencyCtrllevel = "0202";
					}
				});

				//上下级无关
				$('#controlTypeTwo').on('click', function(e) {
					var checked = e.currentTarget.checked;
					if(checked == true) {
						$(".controlTypeOneShow").css("display", "none");
						$(".controlTypeThreeShow").css("display", "none");
						agencyCtrllevel = "03";
					}
				});

				//校验--类别编码
				$('#eleCode').on('keydown paste keyup', function(e) {
					e.stopepropagation;
					$('#eleCode').closest('.form-element').removeClass('error');
					$(this).val($(this).val().replace(/^[^A-Z]+$/, ''));
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('eleCode', textValue);
				}).on('blur', function() {
					var ret = /^[A-Z]+$/;
					if($(this).val() == '') {
						ufma.showInputHelp('eleCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#eleCode').closest('.form-group').addClass('error');
					} else if(!ret.test($(this).val())) {
						ufma.showInputHelp('eleCode', '<span class="error">' + page.getErrMsg(3) + '</span>');
						$('#eleCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('eleCode');
						$('#eleCode').closest('.form-group').removeClass('error');
					}
				});

				//要素名称
				$('#eleName').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#eleName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('eleName', textValue);
				}).on('blur', function() {
					$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
					if($(this).val() == '') {
						ufma.showInputHelp('eleName', '<span class="error">' + page.getErrMsg(2) + '</span>');
						$('#eleName').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrName');
						$('#eleName').closest('.form-group').removeClass('error');
					}
					/*bug71560--经侯总确认暂时不用加助记码，如后期需要可放开注释--zsj
					 * //71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
						var chrNameValue = $(this).val();
						ufma.post('/pub/util/String2Alpha', {
							"chinese": chrNameValue
						}, function(result) {
							$('#assCode').val(result.data);
						});*/
				});

				//校验编码
				$(".ufma-form-control-small").each(function(n) {
					$(this).on("focus paste keyup change", function(e) {
						e.stopPropagation();
						$(this).val($(this).val().replace(/[^1-9]/g, ''));

						//                		if(n<10 && $(this).val().length == 1){
						//                			$(this).next().focus();
						//                		}
					}).on("blur", function() {
						if(n > 0 && $(this).val().length == 1 && $(this).prev().val().length == 0) {
							ufma.alert("编码之前不能有空格！", "warning");
							return false;
						}
						//校验编码规则长度不能大于42(revise)
						page.checkRuleLen();

					})
				})

			},
			checkRuleLen: function() {
				var len, codeRulesEle, sumLen = 0,
					t = true;
				codeRulesEle = $(".ufma-form-control-small");
				len = codeRulesEle.length;
				for(var i = 0; i < len; i++) {
					if($(codeRulesEle[i]).val() !== null && $(codeRulesEle[i]).val() !== '' && $(codeRulesEle[i]).val() !== undefined) {
						sumLen += parseInt($(codeRulesEle[i]).val());
					}
				}
				if(sumLen > 42) {
					if($('#_top').length === 0) {
						ufma.alert("编码规则的总长度必须小于等于42", "warning");
						t = false;
					}
				}
				return t;
			},

			initData: function(data) {
				page.action = data.action;
				page.agencyCode = data.agencyCode;
				page.rgCode = data.rgCode;
				page.setYear = data.setYear;
				// if (page.agencyCode != '*') {
				//     $('.ctrlLevel').css('display', 'none');
				// }
				if(page.action == 'edit') {
					chrId = $(data.eleData).parents(".ele-data-dom").find(".chrId").text();
					page.setFormData(data.eleData);
					$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
				} else if(page.action == 'add') {
					if($("#isCodeCheck")[0].checked == true) {
						$(".ufma-form-control-small").attr("disabled", false);
					} else {
						$(".ufma-form-control-small").val("").attr("disabled", true);
					}
					$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").removeAttr("disabled");
					//                	page.setFormData(data.eleData);
				}
			},

			init: function() {
				//            	//权限对象
				//            	page.reslist = ufma.getPermission();
				//            	//权限判断
				//            	ufma.isShow(page.reslist);
				$("#btn-saveadd,#btn-save,.btn-delete,.btn-close").attr("disabled", true);
				page.closeAction = ""; //关闭编辑窗口之前的操作
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				page.initData(window.ownerData);
				ufma.parse();
				this.onEventListener();
			}
		}
	}();

	page.init();
});
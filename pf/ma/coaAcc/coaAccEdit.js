$(function () {
	if (window.ownerData.diffAgencyType == "0") {
		$(".diffAgency").remove();
		$(".kemulx").css("margin-left", "0");
	}
	/* window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	}; */
	window._close = function (result) {
		if (window.closeOwner) {
			var data = {
				action: page.closeData,
				data: result
			};
			window.closeOwner(data);
		}
	}
	/*window.setData = function(data) {
		page.setItemsData(data);
	};*/
	//接口URL集合
	var interfaceURL = {
		queryAccoTable: "/ma/sys/coaAcc/queryAccoTable", //获取科目具体数据
		checkUsed: "/ma/sys/common/checkUsed", //检验账套是否使用
		coaAccSave: "/ma/sys/coaAcc/save", //保存
		eleCheckUsed: "/ma/sys/common/checkUsed", //检验要素是否已使用
		isParentAccoNeedTransfer: "/ma/sys/coaAcc/isParentAccoNeedTransfer", //校验上级科目是否需要迁移
		isCanUpdateUsedAcco: "/ma/sys/coaAcc/isCanUpdateUsedAcco" //已使用的会计科目是否允许修改辅助项
	};
	var aTCodeSel = []
	var editagencyTypeCode;
	var accisLeaf;
	var wbJBdata; //外币局部保存
	var removeData = [];
	var accitemValueRangeListData = [];
	var $rowTr;
	var optFlag = '';
	var useCount = 0;//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
	var page = function () {
		return {
			lastVer: 0,
			//初始化树
			initTree: function () {
				var setting = {
					view: {
						fontCss: getFontCss,
						selectedMulti: false,
						showLine: false,
						showIcon: false
					},
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: 'codeName'
						}
					},
					callback: {
						onClick: zTreeOnClick
					}
				};

				var argu = {};
				argu["rgCode"] = page.rgCode;
				argu["setYear"] = page.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				if (page.acctCode == "" || page.acctCode == undefined) {
					page.acctCode = "*"
				}
				argu["eleCode"] = 'ACCO';
				argu["accsCode"] = page.accsCode;
				ufma.get("/ma/sys/common/getEleTree", argu, function (result) {
					if (result.data && result.data.length > 0) {
						result.data[0].name = '全部'
						var zNodes = result.data;
						$.fn.zTree.init($("#leftTree"), setting, zNodes);
					}

				});

				function zTreeOnClick(event, treeId, treeNode) {
					//if(!treeNode.isParent) {
					function initForm(acco) {
						page.curData = acco;
						page.curData.action = 'edit';
						ma.isEdit = true;
						page.initParamData(acco);
						page.clickTree = true;
						page.initEditPage(acco);
						page.setBaseFormEdit(false);
						$('label[for="chrCode"]').text(acco.chrCode);
						$('label[for="chrName"]').text(acco.chrName);
					}
					if (window.ownerData.list && window.ownerData.list.accoList) {
						var Zdata = window.ownerData.list.accoList;
						for (var i = 0; i < Zdata.length; i++) {
							if (Zdata[i].chrCode == treeNode.id) {
								initForm(Zdata[i]);
								break;
							}
						}
					}

					//}
				};
				//树搜索
				var coaAccSearchKey;
				$(document).ready(function () {
					coaAccSearchKey = $("#coaAccSearchKey");
					coaAccSearchKey.bind("focus", focusKey).bind("blur", blurKey)
						.bind("input", searchNode).bind("keyup", searchNode); //guohx  20200304修改 解决键入模糊查询不起作用
				});

				function focusKey(e) {
					if (coaAccSearchKey.hasClass("empty")) {
						coaAccSearchKey.removeClass("empty");
					}
				}

				function blurKey(e) {
					if (coaAccSearchKey.get(0).value === "") {
						coaAccSearchKey.addClass("empty");
					}
				}

				var lastValue = "",
					nodeList = [],
					fontCss = {};

				function searchNode(e) {
					var zTree = $.fn.zTree.getZTreeObj("leftTree");
					var value = $.trim(coaAccSearchKey.get(0).value);
					var keyType = "name";
					if (coaAccSearchKey.hasClass("empty")) {
						value = "";
					}
					if (lastValue === value) return;
					lastValue = value;
					if (value === "") return;
					updateNodes(false);
					nodeList = zTree.getNodesByParamFuzzy(keyType, value);
					updateNodes(true);
				}

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.getZTreeObj("leftTree");
					for (var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
						//guohx 模糊搜索之后，定位到节点并展开 20200304
						for (var i = 0; i < nodeList.length; i++) {
							zTree.expandNode(nodeList[i], true, false, false);
							zTree.selectNode(nodeList[i], true);
						}
					}
				}

				function getFontCss(treeId, treeNode) {
					return (!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
							color: "#333",
							"font-weight": "normal"
						};
				}
			},

			//初始化枚举
			initEnum: function () {
				ufma.ajaxDef('/ma/pub/enumerate/AGENCY_TYPE_CODE', 'get', '', function (data) {
					var opt = '';
					for (var i = 0; i < data.data.length; i++) {
						if (i == 0) { //selected="selected"--zsj--bug--77923
							opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
						} else {
							opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
						}
					}
					var codestr;
					if (window.ownerData.agencyTypeCode != null && window.ownerData.agencyTypeCode != undefined) {
						codestr = window.ownerData.agencyTypeCode.split(',');
					} else {
						codestr = []
					}
					$("#agencyTypeCode").html(opt)
					$("#agencyTypeCode").addClass('js-example-programmatic-multi')
					$("#agencyTypeCode").addClass('js-states')
					$("#agencyTypeCode").prop('multiple', 'multiple')
					$("#agencyTypeCode").select2({
						language: "zh-CN",
						tokenSeparators: [',', ' ']
					}).val(codestr).trigger('change');
					if (window.ownerData.agencyCode != "*") { //单位级的适用单位由账套决定，是不可选;系统级是可选的--zsj;
						$("#agencyTypeCode").prop('disabled', 'disabled')
					}
					//.val([data.data[0].ENU_CODE]).trigger('change');
					aTCodeSel = [data.data[0].ENU_CODE]
					$("#agencyTypeCode").on("select2:select", function () {
						var dataa = $(this).val()
						aTCodeSel = dataa
					})
				})
				ufma.comboxInit('accoType');
				ufma.comboxInit('defCurCode', '/ma/sys/common/getEleTree?setYear=' + page.setYear + '&rgCode=' + page.rgCode + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=CURRENCY');
			},

			setBtnShowHide: function (action) {
				if (action == 'edit') {
					$("#coaAccSaveAddAll").addClass("hide");
					$("#coaAccSaveAll").addClass("hide");
					$("#coaAccCancelAll").removeClass("hide");

					$("#btnCoaAccBaseEdit").removeClass("hide");
					$("#btnCoaAccNummoneyEdit").removeClass("hide");
					$("#btnCoaAccAssistEdit").removeClass("hide");
					$("#btnCoaAccIllegalEdit").removeClass("hide");
					$('#btnCoaAccRemarkEdit').removeClass("hide");
					$("#btnAmtCtrlEdit").removeClass("hide");
				} else {
					$("#coaAccSaveAddAll").removeClass("hide");
					$("#coaAccAddAll").removeClass("hide");
					$("#coaAccSaveAll").removeClass("hide");

					$("#btnCoaAccBaseEdit").addClass("hide");
					$("#btnCoaAccNummoneyEdit").addClass("hide");
					$("#btnCoaAccAssistEdit").addClass("hide");
					$("#btnCoaAccIllegalEdit").addClass("hide");
					$("#btnCoaAccRemarkEdit").addClass("hide");
					$("#btnAmtCtrlEdit").removeClass("hide");
				}
			},

			//常用辅助核算项
			initAssisCards: function () {
				var html = '';
				ufma.get('/ma/sys/coaAcc/getAccoItemUse', {}, function (result) {
					$.each(result.data, function (index, row) {
						if (index < 6) {
							if (index % 2 == 0) {
								html += '<div class="row">';
								html += ufma.htmFormat('<div class="col-xs-6 text-center">' +
									'<a class="label-a bordered bgc-white coaAcc-assistname" name="" value="<%=CHR_CODE%>"><%=CHR_NAME%>' +
									'<span class="glyphicon icon-up" style="margin-left: 8px;"></span></a>' +
									'</div>', {
									'CHR_CODE': row.accitemCode,
									'CHR_NAME': row.eleName
								});
							} else {
								html += ufma.htmFormat('<div class="col-xs-6 text-center">' +
									'<a class="label-a bordered bgc-white coaAcc-assistname" name="" value="<%=CHR_CODE%>"><%=CHR_NAME%>' +
									'<span class="glyphicon icon-up" style="margin-left: 8px;"></span></a>' +
									'</div>', {
									'CHR_CODE': row.accitemCode,
									'CHR_NAME': row.eleName
								});
								html += '</div>';
							}
						} else {
							return false;
						}
					});
					$('#coaAccLabelCards').html(html);
				});
			},

			initEditPage: function (curData) {
				page.initEnum();
				page.editMode = '';
				//page.initAssisCards();
				//若有数据，表示点击名称进入的详情页
				if (curData.action == 'edit') {
					var useData = '';
					if (page.clickTree == true) {
						useData = page.TreeData;
					} else {
						useData = curData;
					}
					$('#moneyAssistAdd').addClass("hide");
					//page.lastVer = curData.lastVer;
					page.lastVer = useData.lastVer;
					//page.curData = curData;
					page.curData = useData;
					page.editMode = 'edit';
					//page.setBtnShowHide(curData.action);
					page.setBtnShowHide(useData.action);
					//page.initWindow(curData);
					page.initWindow(useData);
					page.sureMoneyUpdate = false;
					$('#coaAccSaveAddAll').addClass('hide');
					$('#coaAccSaveAll').addClass('hide');
					if ($.isNull(useData.chrFullname)) {
						useData.chrFullname = '';
					}
					ma.nameTip = useData.chrFullname.indexOf('/') == -1 ? '' : useData.chrFullname.replace('/' + useData.chrName, ''); //去掉本级，得到上级代码
				} else {
					//否则进入的就是新增页
					page.editMode = 'new';
					$('#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab')[0].reset();
					page.setBtnShowHide(curData.action);
					page.setBaseFormEdit(true);
					page.setNummoneyFormEdit(true);
					page.setAmtCtrlFormEdit(true);
					$('#coaAccSaveAddAll').removeClass('hide');
					$('#coaAccSaveAll').removeClass('hide');

					//新增页中的增加下级或者修改
					if (curData.action == 'edit' || curData.action == 'addSub') {
						$('#chrCode').val(curData.chrCode);
						ma.nameTip = curData.chrFullname;
						page.getAcco(curData.chrCode);
					}
				}
				if ($('.moneyCheckGroup').find('.datatable-group-checkable:checked').length == 0) {
					$('#enableLargeAccitem,#enableBalanceAccitem').attr('disabled', true);
				}
			},

			//枚举项显示
			initEnumData: function (curData) {
				setTimeout(function () {
					$('#agencyTypeCode').parent('.control-element').find('.select2').removeClass('hide');
					$('#agencyTypeCode').removeClass('hide');
					var codestr;
					if (editagencyTypeCode != null && editagencyTypeCode != undefined) {
						codestr = editagencyTypeCode.split(',');
					} else {
						codestr = []
					}
					$("#agencyTypeCode").addClass('js-example-programmatic-multi')
					$("#agencyTypeCode").addClass('js-states')
					$("#agencyTypeCode").prop('multiple', 'multiple')
					$("#agencyTypeCode").select2({
						language: "zh-CN",
						tokenSeparators: [',', ' ']
					}).val(codestr).trigger('change');
					if (window.ownerData.agencyCode != "*" && (window.ownerData.accsCode == "" || window.ownerData.accsCode == undefined)) {
						$("#agencyTypeCode").prop('disabled', 'disabled')
					}
					aTCodeSel = codestr
					$("#agencyTypeCode").on("select2:select", function () {
						var dataa = $(this).val()
						aTCodeSel = dataa
					});
					//修改bug75066--zsj--修改删除某一“适用单位”点保存时仍出现刚删除的“适用单位”问题
					$("#agencyTypeCode").on("select2:unselect", function () {
						removeData = [];
						removeData = $(this).val();
						aTCodeSel = removeData;
					});
					var codestrs = aTCodeSel
					var st = []
					if (codestrs != null && codestrs != undefined) {
						for (var k = 0; k < codestrs.length; k++) {
							for (var z = 0; z < $('#agencyTypeCode').find('option').length; z++) {
								if ($('#agencyTypeCode').find('option').eq(z).attr('value') == codestrs[k]) {
									st.push($('#agencyTypeCode').find('option').eq(z).text())
								}
							}
						}
						$('label[for="agencyTypeCode"]').text(st.join());
					} else {
						$('label[for="agencyTypeCode"]').text('');
					}
					$('#agencyTypeCode').parents('.control-element').find('.select2').addClass('hide');
					$('#agencyTypeCode').addClass('hide');
				}, 100)

				//				}
				ufma['accoType'].val(curData.accoType).trigger("change");
				ufma['defCurCode'].val(curData.defCurCode).trigger("change");
			},

			//显示输入到期日、票据号、现金流量
			initExpireDate: function (curData) {
				//修改辅助核算项复选框选中问题--zsj
				if (curData.isShowBill == '1') {
					$('#isShowBill').prop('checked', curData.isShowBill == '1');
				} else {
					$('#isShowBill').removeAttr("checked");
				}
				if (curData.expireDate == '1') {
					$('#expireDate').prop('checked', curData.expireDate == '1');
				} else {
					$('#expireDate').removeAttr("checked");
				}
				if (curData.isCashflow == '1') {
					$('#isCashflow').prop('checked', curData.isCashflow == '1');
				} else {
					$('#isCashflow').removeAttr("checked");
				}
				if (curData.isCheckRegister == '1') {
					//bug76759--保存并新增时保留父级的辅助核算项--zsj
					$('#isCheckRegister').prop('checked', curData.isCheckRegister == '1');
				} else {
					$('#isCheckRegister').removeAttr("checked");
				}
				if (curData.field1 == '1') {
					//bug76759--保存并新增时保留父级的辅助核算项--zsj
					$('#field1').prop('checked', curData.field1 == '1');
				} else {
					$('#field1').removeAttr("checked");
				}
				if (curData.field2 == '1') {
					//bug76759--保存并新增时保留父级的辅助核算项--zsj
					$('#field2').prop('checked', curData.field2 == '1');
				} else {
					$('#field2').removeAttr("checked");
				}
				if (curData.allowSurplus == '1') {
					//bug76759--保存并新增时保留父级的辅助核算项--zsj
					$('#allowSurplus').prop('checked', curData.allowSurplus == '1');
				} else {
					$('#allowSurplus').removeAttr("checked");
				}
				if (curData.updateAllSonAccItems == '1') {
					$('#updateAllSonAccItems').prop('checked', curData.updateAllSonAccItems == '1');
				} else {
					$('#updateAllSonAccItems').removeAttr("checked");
				}
			},

			//显示金额控制部分除表格外的控制--依次控制
			initMoneyAssistLable: function (curData) {
				//启用余额
				if (curData.enableBalanceControl == '1') {
					$('#enableBalanceControl').prop('checked', true);
					$('#balanceControlMoney').removeAttr('disabled');
					$('#balanceControlMode').removeClass('uf-combox-disabled');
				} else {
					$('#enableBalanceControl').removeAttr("checked");
					$('#balanceControlMoney').attr('disabled', true);
					$('#balanceControlMode').addClass('uf-combox-disabled');
					$('#balanceControlMoney').val('');
					$('#balanceControlMode').getObj().val('');
				}
				if (!$.isNull(curData.balanceControlMoney) && curData.enableBalanceControl == '1') {
					$('#balanceControlMoney').val('');
					$('#balanceControlMoney').val($.formatMoneyNull(curData.balanceControlMoney));
				} else {
					$('#balanceControlMoney').val('');
				}
				$('#balanceControlMode').getObj().val(curData.balanceControlMode);
				if (curData.enableBalanceAccitem == '1') {
					$('#enableBalanceAccitem').prop('checked', true);
				} else {
					$('#enableBalanceAccitem').removeAttr("checked");
				}
				//启用大额
				if (curData.enableLargeControl == '1') {
					$('#enableLargeControl').prop('checked', true);
					$('#largeControlMoney').removeAttr('disabled');
					$('#largeControlMode').removeClass('uf-combox-disabled');
				} else {
					$('#enableLargeControl').removeAttr("checked");
					$('#largeControlMoney').attr('disabled', true);
					$('#largeControlMode').addClass('uf-combox-disabled');
					$('#largeControlMoney').val('');
					$('#largeControlMode').getObj().val('');
				}
				if (!$.isNull(curData.largeControlMoney) && curData.enableLargeControl == '1') {
					$('#largeControlMoney').val(''); //CWYXM-9906 科目同时启用余额和大额控制时，保存后页面自动刷新，余额控制的金额未带出已录入值
					$('#largeControlMoney').val($.formatMoneyNull(curData.largeControlMoney));
				} else {
					$('#largeControlMoney').val('');
				}
				$('#largeControlMode').getObj().val(curData.largeControlMode);
				if (curData.enableLargeAccitem == '1') {
					$('#enableLargeAccitem').prop('checked', true);
				} else {
					$('#enableLargeAccitem').removeAttr("checked");
				}
			},

			initWindow: function (curData) {
				page.initEnumData(curData);
				page.initExpireDate(curData);
				page.initMoneyAssistLable(curData);
				page.useLabelData = curData;
				//基本信息、数量外卡、备注页卡上显示数据
				$("#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab").setForm(curData);
				//如果小数位数为空，则赋值为0
				if (curData.qtyDigits == null) {
					$('#qtyDigits').val(0);
				}
				page.setBaseFormEdit(false);
				page.setNummoneyFormEdit(false);
				page.initAssistTable(curData);
				page.initIlaccTable(curData);
				page.setRemarkFormEdit(false);
				page.initAmtCtrl(curData);
			},

			bubbleSort: function (arr) {
				var len = arr.length;
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len - 1 - i; j++) {
						if (arr[j].ordSeq > arr[j + 1].ordSeq) { //相邻元素两两对比
							var temp = arr[j + 1]; //元素交换
							arr[j + 1] = arr[j];
							arr[j] = temp;
						}
					}
				}
				return arr;
			},
			//增加下级自动显示上级科目辅助项
			initAssistTable2: function (curData) {
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				if (!$.isNull(curData.eleAccoItems) && curData.eleAccoItems.length > 0) {
					page.bubbleSort(curData.eleAccoItems);
					$.each(curData.eleAccoItems, function (index, row) {
						if (row) {
							row.index = index + 1;
							// page.newAssistTable(row);
							page.preAccItemTable(row);
						}
					});
				}
			},
			//循环显示辅助核算行数据
			initAssistTable: function (curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				if (!$.isNull(curData.eleAccoItems) && curData.eleAccoItems.length > 0) {
					page.bubbleSort(curData.eleAccoItems);
					$.each(curData.eleAccoItems, function (index, row) {
						if (row) {
							row.index = index + 1;
							// page.newAssistTable(row);
							page.preAccItemTable(row);
						}
					});
				}
				this.setAssistFormEdit(false);
			},
			//增加下级自动带出上级科目辅助项
			accItemsTableEdit2: function (curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				//修改bug77038--zsj--修改父级辅助核算为空时进行行填充为undefined
				if (curData.eleAccoItems.length > 0) {
					for (var i = 0; i < curData.eleAccoItems.length; i++) {
						delete curData.eleAccoItems[i].accitemId;
					}
					$.each(curData.eleAccoItems, function (index, row) {
						if (row) {
							row.index = index + 1;
							page.newAssistTable(row);
						}
					});
				}
				this.setAssistFormEdit(true);
			},
			//点击辅助核算编辑按钮，渲染辅助项表格，并显示编辑状态
			accItemsTableEdit: function (curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				//修改bug77038--zsj--修改父级辅助核算为空时进行行填充为undefined
				if (curData.eleAccoItems.length > 0) {
					$.each(curData.eleAccoItems, function (index, row) {
						if (row) {
							row.index = index + 1;
							page.newAssistTable(row);
						}
					});
				}
				this.setAssistFormEdit(true);
			},
			//点击...设置辅助核算项
			setAccItem: function (row) {
				row.find('td .btnSetAccItem').on('click', function (e) {
					e.stopPropagation();
					var argu = {};
					//设置辅助项
					var index = $(this).closest("tr").index();
					var beforeData = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
					if (!$.isNull(beforeData)) {
						//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
						if (page.action == 'edit') {
							for (var i = 0; i < page.rowpreData.length; i++) {
								if ((index + 1) == page.rowpreData[i].ordSeq) {
									argu.rowData = page.rowpreData[i];
								}
							}
						}
						argu.index = index;
						argu.isShow = '';
						if (row.find('[name="isShow"]').is(':checked')) {
							argu.isShow = '1';
						} else {
							argu.isShow = '0';
						}
						argu.agencyCode = page.agencyCode;
						argu.acctCode = page.acctCode;
						var rowData = $(this).closest("tr").attr("accitemValueRangeList");
						if (rowData && !$.isNull(rowData)) {
							argu.accitemValueRangeList = eval("(" + rowData + ")");
						} else {
							argu.accitemValueRangeList = '';
						}
						argu.action = page.action;
						argu.chrCode = page.chrCode;
						argu.chrId = page.chrId;
						argu.lastVer = page.lastVer;
						argu.isDef = false;
						var nowElcode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val()
						if (page.action != "edit") {
							argu.rowData = {}
							argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
							argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
							argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
						}
						if (page.action == "edit") {
							if (!$.isNull(argu.rowData)) {
								if (nowElcode != argu.rowData.accitemCode) {
									argu.rowData = {}
									argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
									argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
									argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
								}
							} else {
								argu.rowData = {}
								argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
								argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
								argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
							}

						}
						var text = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
						//设置关联辅助项
						var openData = {};
						openData = argu;
						ufma.open({
							url: 'setAccItem.html',
							title: '设置关联辅助项',
							width: 580,
							height: 735,
							data: openData,
							ondestory: function (data) {
								if (data.action) {
									if (data.isDef) {
										page.setDefItemsData(data);
									} else {
										page.setItemsData(data);
									}

								}
							}
						});
					} else {
						ufma.showTip('请先选择辅助核算项', function () { }, 'warning');
						return false;
					}
				});
			},
			//点击...设置辅助核算项默认值 guohx
			setAccItemDef: function (row) {
				row.find('td .btnSetAccItemDef').on('click', function (e) {
					e.stopPropagation();
					var argu = {};
					//设置辅助项
					var index = $(this).closest("tr").index();
					var beforeData = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
					if (!$.isNull(beforeData)) {
						//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
						if (page.action == 'edit') {
							for (var i = 0; i < page.rowpreData.length; i++) {
								if ((index + 1) == page.rowpreData[i].ordSeq) {
									argu.rowData = page.rowpreData[i];
								}
							}
						}
						argu.index = index;
						argu.isShow = '';
						if (row.find('[name="isShow"]').is(':checked')) {
							argu.isShow = '1';
						} else {
							argu.isShow = '0';
						}
						argu.agencyCode = page.agencyCode;
						argu.acctCode = page.acctCode;
						var rowData = $(this).closest("tr").attr("accitemValueRangeList");
						if (rowData && !$.isNull(rowData)) {
							argu.accitemValueRangeList = eval("(" + rowData + ")");
						} else {
							argu.accitemValueRangeList = '';
						}
						argu.action = page.action;
						argu.chrCode = page.chrCode;
						argu.chrId = page.chrId;
						argu.lastVer = page.lastVer;
						argu.isDef = true;
						var nowElcode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val()
						if (page.action != "edit") {
							argu.rowData = {}
							argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
							argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
							argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
						}
						if (page.action == "edit") {
							if (!$.isNull(argu.rowData)) {
								if (nowElcode != argu.rowData.accitemCode) {
									argu.rowData = {}
									argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
									argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
									argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
								}
							} else {
								argu.rowData = {}
								argu.rowData.accitemCode = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-value").val();
								argu.rowData.eleCode = $(this).closest("tr").find('.accountClassLabel').html();
								argu.rowData.eleName = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
							}

						}
						var text = $(this).closest("tr").find(".accitemCodeClass").find(".ufma-combox-text").val();
						//设置关联辅助项
						var openData = {};
						openData = argu;
						ufma.open({
							url: 'setAccItem.html',
							title: '设置关联辅助项',
							width: 580,
							height: 735,
							data: openData,
							ondestory: function (data) {
								if (data.action) {
									if (data.isDef) {
										page.setDefItemsData(data);
									} else {
										page.setItemsData(data);
									}

								}
							}
						});
					} else {
						ufma.showTip('请先选择辅助核算项', function () { }, 'warning');
						return false;
					}
				});
			},
			isShowAcc: function (row) {
				row.find('.fzisShow input[name="isShow"]').on('click', function (e) {
					e.stopPropagation();
					$(this).parent().closest('td').siblings().find('.accitemDataClass p').html('');
					$(this).parent().closest('td').siblings().find('.accitemDataClassDef p').html('');
					$(this).parent().closest('td').parent().attr('accitemValueRangeList', '');
					$(this).parent().closest('td').siblings().find('label[for="accitemName"]').html('');
					$(this).parent().closest('td').siblings().find('.accitemDataClass .btnSetAccItem').animate({
						"margin-top": "-14px"
					});
					$(this).parent().closest('td').siblings().find('.accitemDataClassDef .btnSetAccItemDef').animate({
						"margin-top": "-14px"
					});
				})
			},
			//编辑页，预展示辅助项（即假的表格），点击编辑按钮才真正渲染辅助项表格
			preAccItemTable: function (rowData) {
				var $table = $('#coaAccAssist');
				//新增时，自动往后加
				var recNo = $table.find('tr').length,
					accitemValueRangeList = "";
				//修改时，为排序号
				if (rowData && !$.isNull(rowData)) {
					recNo = rowData.ordSeq;
					if (rowData.accitemValueRangeList != "") {
						var str = JSON.stringify(rowData.accitemValueRangeList);
						accitemValueRangeList = str.replace(/\"/g, "'");
					}
				}
				var row =
					'<tr accitemValueRangeList="' + accitemValueRangeList + '">' +
					'<td class="text-center">' +
					'<input type="hidden" name="accitemId" value="">' +
					'<span class="recno">' + recNo + '</span>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemCodeClass" style="width:250px;"></div>' +
					//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
					'<label for="eleName" class="control-label hide accountClassLabel commonShow" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td class="treeClick">' +
					'<div class="control-element">' +
					'<div class="accitemDataClass"><p style="max-width:200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;"></p><span class="btnSetAccItem">...</span></div>' +
					'<label for="accitemName" class="control-label hide commonShow"></label>' +
					'</div>' +
					'</td>' +
					'<td class="treeClick">' +
					'<div class="control-element">' +
					'<div class="accitemDataClassDef"><p style="max-width:200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;"></p><span class="btnSetAccItemDef">...</span></div>' +
					'<label for="accitemNameDef" class="control-label hide commonShow"></label>' +
					'</div>' +
					'</td>' +
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline fzisShow" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isShow" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline needInput" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isMust" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				$rowTr = '';
				$rowTr = $row;
				page.setAccItem($row);
				page.setAccItemDef($row);
				page.isShowAcc($row);
				if (rowData && !$.isNull(rowData)) {
					rowData.accitemType = 2;
					//详情页显示label值
					$row.find('label[for="eleName"]').html(rowData.eleName);
					$row.find('label[for="accitemName"]').html(rowData.accitemValue + ' ' + rowData.accitemName);					
					$row.find('.accitemDataClass p').html(rowData.accitemValue + ' ' + rowData.accitemName);
					if(!$.isNull(rowData.defaultCode)){
						$row.find('label[for="accitemNameDef"]').html(rowData.defaultCode + ' ' + rowData.defaultName);
						$row.find('.accitemDataClassDef p').html(rowData.defaultCode + ' ' + rowData.defaultName);
					}					
					if (rowData.isShow == '1') {
						$row.find('input[name="isShow"]').attr('checked', true);
					} else {
						$row.find('input[name="isShow"]').removeAttr("checked");
					}
					//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					if (rowData.isMust == '1') {
						$row.find('input[name="isMust"]').attr('checked', true);
					} else {
						$row.find('input[name="isMust"]').removeAttr("checked");
					}
					$row.find('input[name="accitemId"]').val(rowData.accitemId);
					if (page.action == 'edit') {
						var showArray = [];
						var defalutArr = [];
						var show = false;
						for (var i = 0; i < rowData.accitemValueRangeList.length; i++) {
							var singleData = rowData.accitemValueRangeList[i].accitemValue + ' ' + rowData.accitemValueRangeList[i].accitemValueName;
							if (rowData.accitemValueRangeList[i].isDefault == 1) {
								show = true;
								defalutArr.push(singleData);
							}
							showArray.push(singleData);
						}
						if (show == true) {
							$row.find('label[for="accitemName"]').html(defalutArr.join(','));
							$row.find('label[for="accitemName"]').attr('title', defalutArr.join(','));
							$row.find('.accitemDataClass p').html(defalutArr.join(','));
							$row.find('.accitemDataClass p').attr('title', defalutArr.join(','));
						} else {
							$row.find('label[for="accitemName"]').html(showArray.join(','));
							$row.find('label[for="accitemName"]').attr('title', showArray.join(','));
							$row.find('.accitemDataClass p').html(showArray.join(','));
							$row.find('.accitemDataClass p').attr('title', showArray.join(','));
						}
						if (rowData.accitemValueRangeList != "") {
							var str = JSON.stringify(rowData.accitemValueRangeList);
							accitemValueRangeList = str.replace(/\"/g, "'");
						}
						$row.attr("accitemValueRangeList", accitemValueRangeList);
					}
					if (!$.isNull($row.find('.accitemDataClass p').html())) {
						$row.find('.accitemDataClass .btnSetAccItem').animate({
							"margin-top": "-33px"
						});
						$row.find('.accitemDataClass .btnSetAccItem').closest('td').removeClass('showChange');
					} else {
						$row.find('.accitemDataClass .btnSetAccItem').animate({
							"margin-top": "-14px"
						});
						$row.find('.accitemDataClass .btnSetAccItem').closest('td').addClass('showChange');
					}
					if (!$.isNull($row.find('.accitemDataClassDef p').html())) {
						$row.find('.accitemDataClassDef .btnSetAccItemDef').animate({
							"margin-top": "-33px"
						});
						$row.find('.accitemDataClassDef .btnSetAccItemDef').closest('td').removeClass('showChange');
					} else {
						$row.find('.accitemDataClassDef .btnSetAccItemDef').animate({
							"margin-top": "-14px"
						});
						$row.find('.accitemDataClassDef .btnSetAccItemDef').closest('td').addClass('showChange');
					}
				} else {
					page.setAssistGroupControl();
				}
			},
			//编辑界面金额控制赋值
			initAmtCtrl: function (curData) {
				//$('#frmAMTCtrl').setForm(curData);
				//CWYXM-9831--会计科目点击保存并新增按钮，金额控制处未恢复默认状态--zsj
				page.initMoneyAssistLable(curData);
				//循环显示金额启用辅助项行数据
				$('#moneyAssist tbody').html('');
				page.bubbleSort(curData.moneyCtrls);
				$.each(curData.moneyCtrls, function (index, row) {
					if (row) {
						row.index = index;
						page.initMoneyAssist(row);
					}
				});
				this.setAmtCtrlFormEdit(page.editMode != 'edit');
			},
			//循环显示非法对应科目行数据
			initIlaccTable: function (curData) {
				$('#coaAccIllegal tbody').html('');
				page.bubbleSort(curData.eleAccoIlaccs);
				$.each(curData.eleAccoIlaccs, function (index, row) {
					if (row) {
						row.index = index;
						page.newIllegalTable(row);
					}
				});
				this.setIllegalFormEdit(false);
			},

			//基本信息页卡
			setBaseFormEdit: function (enabled) {
				if (enabled) {
					$('#btnCoaAccBaseEdit').addClass('hide');
					$('#form-mainInfoTab .control-element .form-control').removeClass('hide');
					$('#form-mainInfoTab .control-element .control-label').addClass('hide');
					$('#form-mainInfoTab .control-element .btn-group').removeClass('hide');
					//枚举的下拉框显示
					$('#agencyTypeCode').parent('.control-element').find('.select2').removeClass('hide');
					$('#agencyTypeCode').removeClass('hide');
					$('#accoType').parent('.control-element').find('span.select2').removeClass('hide');
					if (page.editMode == 'edit' || page.editMode == 'editJB') { //bug79292--zsj
						$('#coaAccBaseBtnGroup').removeClass('hide');
					} else {
						$('#coaAccBaseBtnGroup').addClass('hide');
					}
				} else {
					//若为详情显示，显示可修改图标，显示label信息，隐藏保存、取消按钮等
					$('#btnCoaAccBaseEdit').removeClass('hide');
					$('#form-mainInfoTab .control-element .control-label').removeClass('hide');
					$('#form-mainInfoTab .control-element .form-control').addClass('hide');
					$('#form-mainInfoTab .control-element .btn-group').addClass('hide');

					//局部保存成功后数量外币呈不可编辑状态
					$('#btnCoaAccNummoneyEdit').removeClass('hide');
					$('#form-moneyInfoTab .control-element .form-control').addClass('hide');
					$('#form-moneyInfoTab .control-element .control-label').removeClass('hide');
					$('#form-moneyInfoTab .control-element .btn-group').addClass('hide');
					$("#coaAccNummoneyBtnGroup").addClass('hide');

					//编码输入框disabled
					$('#chrCode').attr("disabled", true);
					//枚举的下拉框隐藏

					//将input框上的数据赋值到label上
					$('label[for="chrCode"]').text($("#chrCode").val());
					$('label[for="chrName"]').text($("#chrName").val()).attr('title', $("#chrName").val());
					//将枚举值赋值到label上
					var codestrs = aTCodeSel
					var st = []
					if (codestrs != null && codestrs != undefined) {
						for (var k = 0; k < codestrs.length; k++) {
							for (var z = 0; z < $('#agencyTypeCode').find('option').length; z++) {
								if ($('#agencyTypeCode').find('option').eq(z).attr('value') == codestrs[k]) {
									st.push($('#agencyTypeCode').find('option').eq(z).text())
								}
							}
						}
						$('label[for="agencyTypeCode"]').text(st.join());
						$('label[for="agencyTypeCode"]').attr('title', st.join()); //CWYXM-7127--修改枚举树问题--zsj
					} else {
						$('label[for="agencyTypeCode"]').text('');
					}
					$('label[for="accoType"]').text($('#accoType').children('option:selected').text());
					//将toggle上的值赋值到label上
					$('label[for="accBal"]').text($('label[for="accBal"]').parent().find('label.active').text());
					$('label[for="isChangeAttr"]').text($('label[for="isChangeAttr"]').parent().find('label.active').text());
					$('label[for="allowChangeName"]').text($('label[for="allowChangeName"]').parent().find('label.active').text());
					$('label[for="enabled"]').text($('label[for="enabled"]').parent().find('label.active').text());
					$('label[for="assCode"]').text($("#assCode").val());
					$('label[for=assCode]').attr('title', $("#assCode").val());
					$('label[for="allowAddsub"]').text($('label[for="allowAddsub"]').parent().find('label.active').text());
					$('#agencyTypeCode').parents('.control-element').find('.select2').addClass('hide');
					$('#agencyTypeCode').addClass('hide');
					$('#accoType').parent('.control-element').find('span.select2').addClass('hide');
					$('#coaAccBaseBtnGroup').addClass('hide');
				}
				$('#form-mainInfoTab .control-element')[enabled ? 'removeClass' : 'addClass']('disabled');
			},

			//数量外币页卡
			setNummoneyFormEdit: function (enabled) {
				if (enabled) {
					$('#btnCoaAccNummoneyEdit').addClass('hide');
					$('#form-moneyInfoTab .control-element .form-control').removeClass('hide');
					$('#form-moneyInfoTab .control-element .control-label').addClass('hide');
					$('#form-moneyInfoTab .control-element .btn-group').removeClass('hide');
					//枚举的下拉框
					$('#defCurCode').parent('.control-element').find('span.select2').removeClass('hide');
					$('#form-moneyInfoTab .control-element .coaAcc-num-count').removeClass('hide');
					var wb = $('label[for="isCur"]').parent().find('label.active input[name="isCur"]').val();
					if (wb == '1') {
						$('#defCurCode').attr('disabled', false);
						$('#mrbz').removeClass('hidden');
					} else {
						$('#defCurCode').attr('disabled', true);
						$('#mrbz').addClass('hidden');
					}
					if ($("#isQty").find("label").eq(0).hasClass("active")) {
						$("#xsws").removeClass("hidden");
						$("#wbhs").removeClass("hidden");
						$('#qtyUom').removeClass('hidden');
						$('#qtyUom').attr('disabled', false);
						$('#qtyDigits').attr('disabled', false);
						$('.coaAcc-num-reduce').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						$('.coaAcc-num-add').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						if ($('.coaAcc-num-val').val() == 0) {
							$('.coaAcc-num-reduce').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if ($('.coaAcc-num-val').val() == 6) {
							$('.coaAcc-num-add').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						}
					} else {
						$("#xsws").addClass("hidden");
						$("#wbhs").addClass("hidden");
						$('#qtyUom').addClass('hidden');
						$('#qtyUom').attr('disabled', true);
						$('#qtyDigits').attr('disabled', true);
						$('.coaAcc-num-reduce').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						$('.coaAcc-num-add').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
					}
					if (!$.isNull(page.curData)) {
						$('label[for="qtyUom"]').text(page.curData.qtyUom);
						$('label[for="qtyDigits"]').text(page.curData.qtyDigits);
					}
					var select =
						$('label[for="defCurCode"]').text($('#defCurCode').children('option:selected').text() || '');
					if (page.editMode == 'edit') {
						$('#coaAccNummoneyBtnGroup').removeClass('hide');
					} else if (page.editMode == 'editJB') {
						$('#coaAccNummoneyBtnGroup').addClass('hide');
						$('#btnCoaAccNummoneyEdit').removeClass('hide');
						$('#form-moneyInfoTab .control-element .form-control').addClass('hide');
						$('#form-moneyInfoTab .control-element .control-label').removeClass('hide');
						$('#form-moneyInfoTab .control-element .btn-group').addClass('hide');
						//枚举的下拉框隐藏
						$('#defCurCode').parent('.control-element').find('span.select2').addClass('hide');
						$('#form-moneyInfoTab .control-element .coaAcc-num-count').addClass('hide');
						$('#coaAccNummoneyBtnGroup').addClass('hide');
						$('label[for="qtyUom"]').text($("#qtyUom").val());
						$('label[for="isCur"]').text($('label[for="isCur"]').parent().find('label.active').text());
						$('label[for="isQty"]').text($('label[for="isQty"]').parent().find('label.active').text());
						$('label[for="qtyDigits"]').text($("#qtyDigits").val());
						var wb = $('label[for="isCur"]').parent().find('label.active input[name="isCur"]').val();
						if (wb == '1') {
							$('#defCurCode').attr('disabled', false);
							$('#mrbz').removeClass('hidden');
						} else {
							$('#defCurCode').attr('disabled', true);
							$('#mrbz').addClass('hidden');
						}

						//打开编辑界面时显示数量相关内容
						var isQtyData = $('label[for="isQty"]').parent().find('label.active input[name="isQty"]').val();
						if (isQtyData == '1') {
							$('#qtyDigits').attr('disabled', false);
							$('#xsws').removeClass('hidden');
							$('#wbhs').removeClass('hidden');
							$('#qtyUom').removeClass('hidden');
						} else {
							$('#qtyDigits').attr('disabled', true);
							$('#xsws').addClass('hidden');
							$('#wbhs').addClass('hidden');
							$('#qtyUom').addClass('hidden');
						}
						//将枚举值赋值到label上
						var select =
							$('label[for="defCurCode"]').text($('#defCurCode').children('option:selected').text() || '');
					} else {
						$('#coaAccNummoneyBtnGroup').addClass('hide');
					}
				} else {
					//详情页
					$('#btnCoaAccNummoneyEdit').removeClass('hide');
					$('#form-moneyInfoTab .control-element .form-control').addClass('hide');
					$('#form-moneyInfoTab .control-element .control-label').removeClass('hide');
					$('#form-moneyInfoTab .control-element .btn-group').addClass('hide');
					//枚举的下拉框隐藏
					$('#defCurCode').parent('.control-element').find('span.select2').addClass('hide');
					$('#form-moneyInfoTab .control-element .coaAcc-num-count').addClass('hide');
					$('#coaAccNummoneyBtnGroup').addClass('hide');
					if (page.edit == 'editJB') {
						var showData;
						if (!$.isNull(wbJBdata)) {
							showData = wbJBdata;
						} else {
							showData = page.curData;
						}
						if (showData.isCur == '1') {
							$(".curActive").addClass("active");
							$(".curStop").removeClass("active");
							$('#defCurCode').attr('disabled', false);
							$('#mrbz').removeClass('hidden');
							$('label[for="isCur"]').text($('.curActive').text());
						} else {
							$(".curStop").addClass("active");
							$(".curActive").removeClass("active");
							$('#defCurCode').attr('disabled', true);
							$('#mrbz').addClass('hidden');
							$('label[for="isCur"]').text($('.curStop').text());
						}
						if (showData.isQty == '1') {
							$(".qtyActive").addClass("active");
							$(".qtyStop").removeClass("active");
							$('#qtyDigits').attr('disabled', false);
							$('#xsws').removeClass('hidden');
							$('#wbhs').removeClass('hidden');
							$('#qtyUom').removeClass('hidden');
							$('label[for="isQty"]').text($('.qtyActive').text());
						} else {
							$(".qtyStop").addClass("active");
							$(".qtyActive").removeClass("active");
							$('#qtyDigits').attr('disabled', true);
							$('#xsws').addClass('hidden');
							$('#wbhs').addClass('hidden');
							$('#qtyUom').addClass('hidden');
							$('label[for="isQty"]').text($('.qtyStop').text());
						}
						$('label[for="qtyUom"]').text(showData.qtyUom);
						$('label[for="qtyDigits"]').text(showData.qtyDigits);
						$('label[for="defCurCode"]').text(showData.defCurName);
					} else {
						if (!$.isNull(page.curData)) {
							if (page.curData.isCur == '1') {
								$(".curActive").addClass("active");
								$(".curStop").removeClass("active");
								$('#defCurCode').attr('disabled', false);
								$('#mrbz').removeClass('hidden');
								$('label[for="isCur"]').text($('.curActive').text());
							} else {
								$(".curStop").addClass("active");
								$(".curActive").removeClass("active");
								$('#defCurCode').attr('disabled', true);
								$('#mrbz').addClass('hidden');
								$('label[for="isCur"]').text($('.curStop').text());
							}
							if (page.curData.isQty == '1') {
								$(".qtyActive").addClass("active");
								$(".qtyStop").removeClass("active");
								$('#qtyDigits').attr('disabled', false);
								$('#xsws').removeClass('hidden');
								$('#wbhs').removeClass('hidden');
								$('#qtyUom').removeClass('hidden');
								$('label[for="isQty"]').text($('.qtyActive').text());
							} else {
								$(".qtyStop").addClass("active");
								$(".qtyActive").removeClass("active");
								$('#qtyDigits').attr('disabled', true);
								$('#xsws').addClass('hidden');
								$('#wbhs').addClass('hidden');
								$('#qtyUom').addClass('hidden');
								$('label[for="isQty"]').text($('.qtyStop').text());
							}
							$('label[for="qtyUom"]').text(page.curData.qtyUom);
							$('label[for="qtyDigits"]').text(page.curData.qtyDigits);
							$('label[for="defCurCode"]').text(page.curData.defCurName);
						}
					}
				}
			},
			//辅助核算项页卡
			setAssistFormEdit: function (enabled) {
				if (enabled) {
					//新增页、编辑页显示
					$('#btnCoaAccAssistEdit').addClass("hide");
					$('#coaAccAssist .control-element .form-combox').removeClass("hide");
					$('#coaAccAssist .control-element .form-control').removeClass("hide");
					$('#coaAccAssist .control-element .control-label').addClass("hide");
					$('#coaAccAssist .treeClick .accitemDataClass').removeClass("hide");
					$('#coaAccAssist .treeClick .accitemDataClassDef').removeClass("hide");
					$('#coaAccAssistBtnGroup').removeClass("hide");
					$('#coaAccAddAssist').removeClass("hide");

					$('#expireDate').attr("disabled", false);
					$('#isShowBill').attr("disabled", false);
					$('#isCashflow').attr("disabled", false);
					$('.fzisShow input[name="isShow"]').attr("disabled", false);
					$('.needInput input[name="isMust"]').attr("disabled", false);//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					$('#isCheckRegister').attr("disabled", false);
					$('#field1').attr("disabled", false);
					$('#field2').attr("disabled", false);
					$('#allowSurplus').attr("disabled", false);
					$('#updateAllSonAccItems').attr("disabled", false);

					page.setAssistGroupControl();
				} else {
					//详情页展示
					$('#btnCoaAccAssistEdit').removeClass("hide");
					$('#coaAccAssist .control-element .form-combox').addClass("hide");
					$('#coaAccAssist .control-element .form-control').addClass("hide");
					$('#coaAccAssist .treeClick .accitemDataClass').addClass("hide");
					$('#coaAccAssist .treeClick .accitemDataClassDef').addClass("hide");
					$('#coaAccAssist .control-element .control-label').removeClass("hide");
					$('#coaAccAssistBtnGroup').addClass("hide");
					//移除新增按钮和操作列
					$('#coaAccAddAssist').addClass("hide");
					$('#coaAccAssist thead tr th.btnGroup').remove();
					$('#coaAccAssist tbody tr td.btnGroup').remove();

					//设置到期日和票据号的disabled
					$('#expireDate').attr("disabled", true);
					$('#isShowBill').attr("disabled", true);
					$('#isCashflow').attr("disabled", true);
					$('.fzisShow input[name="isShow"]').attr("disabled", true);
					$('.needInput input[name="isMust"]').attr("disabled", true);//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					$('#isCheckRegister').attr("disabled", true);
					$('#field1').attr("disabled", true);
					$('#field2').attr("disabled", true);
					$('#allowSurplus').attr("disabled", true);
					$('#updateAllSonAccItems').attr("disabled", true);

					//取消时的操作
					$('#coaAccAssist tbody tr').each(function () {
						var $tr = $(this);
						$tr.removeClass("hide");
						if ($tr.find('td label[for="eleName"]').text() == '') {
							$tr.remove();
						}
					});
				}
			},
			//编辑金额控制
			setAmtCtrlFormEdit: function (enabled) {
				$('#frmAMTCtrl')[enabled ? 'enable' : 'disable']();
				$('#amtCtrlBtngrp')[enabled && this.editMode == 'edit' ? 'removeClass' : 'addClass']('hide');
				$('#btnAmtCtrlEdit')[enabled ? 'addClass' : 'removeClass']('hide');
				if (enabled) {
					//新增页、编辑页显示
					$('#moneyAssist .control-element .form-combox').removeClass("hide");
					$('#moneyAssist .control-element .form-control').removeClass("hide");
					$('#moneyAssist .control-element .control-label').addClass("hide");
					$('#moneyAssist .moneyAssTree,#moneyAssist .moneTypeTree').removeClass("hide");
					page.setIMoneyAssistGroupControl();
					//余额控制
					if ($('#enableBalanceControl').is(":checked")) {
						$('#balanceControlMoney').removeAttr('disabled');
						$('#balanceControlMode').removeClass('uf-combox-disabled');
						$('#enableBalanceAccitem').removeAttr('disabled');
						if ($('#enableBalanceAccitem').is(":checked")) {
							$('#moneyAssistAdd').removeClass('hide');
						} else {
							$('#moneyAssistAdd').addClass('hide');
						}
					} else {
						$('#balanceControlMoney').attr('disabled', true);
						$('#balanceControlMode').addClass('uf-combox-disabled');
						$('#enableBalanceAccitem').attr('disabled', true);
						$('#enableBalanceAccitem').removeAttr('checked');
						$('#moneyAssistAdd').addClass('hide');
						$('#moneyAssist tbody').html('');
					}
					//大额控制
					if ($('#enableLargeControl').is(":checked")) {
						$('#largeControlMoney').removeAttr('disabled');
						$('#largeControlMode').removeClass('uf-combox-disabled');
						$('#enableLargeAccitem').removeAttr('disabled');
					} else {
						$('#largeControlMoney').attr('disabled', true);
						$('#largeControlMode').addClass('uf-combox-disabled');
						$('#enableLargeAccitem').attr('disabled', true);
						$('#enableLargeAccitem').removeAttr('checked');
					}
				} else {
					//详情页展示
					$('#moneyAssist .control-element .form-combox').addClass("hide");
					$('#moneyAssist .control-element .form-control').addClass("hide");
					$('#moneyAssist .moneyAssTree,#moneyAssist .moneTypeTree').addClass("hide");
					$('#moneyAssist .control-element .control-label').removeClass("hide");
					//移除新增按钮和操作列
					$('#moneyAssistAdd').addClass("hide");
					$('#moneyAssist thead tr th.btnGroup').remove();
					$('#moneyAssist tbody tr td.btnGroup').remove();
					if (page.action != "edit") {
						//余额控制
						if ($('#enableBalanceControl').is(":checked")) {
							$('#balanceControlMoney').removeAttr('disabled');
							$('#balanceControlMode').removeClass('uf-combox-disabled');
							$('#enableBalanceAccitem').removeAttr('disabled');
							if ($('#enableBalanceAccitem').is(":checked")) {
								$('#moneyAssistAdd').removeClass('hide');
							}
						} else {
							$('#balanceControlMoney').attr('disabled', true);
							$('#balanceControlMode').addClass('uf-combox-disabled');
							$('#enableBalanceAccitem').attr('disabled', true);
							$('#enableBalanceAccitem').removeAttr('checked');
							$('#moneyAssistAdd').addClass('hide');
							$('#moneyAssist tbody').html('');
						}
						//大额控制
						if ($('#enableLargeControl').is(":checked")) {
							$('#largeControlMoney').removeAttr('disabled');
							$('#largeControlMode').removeClass('uf-combox-disabled');
							$('#enableLargeAccitem').removeAttr('disabled');
							if ($('#enableLargeAccitem').is(":checked")) {
								$('#moneyAssistAdd').removeClass('hide');
							}
						} else {
							$('#largeControlMoney').attr('disabled', true);
							$('#largeControlMode').addClass('uf-combox-disabled');
							$('#enableLargeAccitem').attr('disabled', true);
							$('#enableLargeAccitem').removeAttr('checked');
						}
					}
					//取消时的操作
					$('#moneyAssist tbody tr').each(function () {
						var $tr = $(this);
						$tr.removeClass("hide");
						if ($tr.find('td label[for="moneyAssTypeCode"]').text() == '') {
							$tr.remove();
						}
					});
				}
			},
			//非法对应科目页卡
			setIllegalFormEdit: function (enabled) {
				//CWYXM-9937 科目启用大额控制，修改启用辅助项控制按钮，无法点击--zsj
				if (enabled) {
					//新增、编辑页显示
					$('#btnCoaAccIllegalEdit').addClass("hide");
					$('#coaAccIllegal .control-element .form-combox').removeClass("hide");
					$('#coaAccIllegal .control-element .form-control').removeClass("hide");
					$('#coaAccIllegal .control-element .control-label').addClass("hide");
					$('#coaAccIllegalBtnGroup').removeClass("hide");
					$('#coaAccIllegalBtnGroup').removeClass("hide");
					$('#coaAccAddIllegal').removeClass("hide");

					page.setIllegalGroupControl();
				} else {
					//详情页展示
					$('#btnCoaAccIllegalEdit').removeClass("hide");
					$('#coaAccIllegal .control-element .form-combox').addClass("hide");
					$('#coaAccIllegal .control-element .form-control').addClass("hide");
					$('#coaAccIllegal .control-element .control-label').removeClass("hide");
					$('#coaAccIllegalBtnGroup').addClass("hide");
					//移除新增按钮和操作列
					$('#coaAccAddIllegal').addClass("hide");
					$('#coaAccIllegal thead tr th.btnGroup').remove();
					$('#coaAccIllegal tbody tr td.btnGroup').remove();

					//取消时的操作
					$('#coaAccIllegal tbody tr').each(function () {
						var $tr = $(this);
						//把删除时隐藏的显示出来
						$tr.removeClass("hide");
						if ($tr.find('td label[for="ilaccCode"]').text() == '') {
							$tr.remove();
						}
					});
				}
			},

			//备注页卡
			setRemarkFormEdit: function (enabled) {
				if (enabled) {
					$('#btnCoaAccRemarkEdit').addClass('hide');
					$('#form-remarkInfoTab .control-element .control-label').addClass('hide');
					$('#form-remarkInfoTab .control-element .form-control').removeClass('hide');
					if (page.editMode == 'edit') {
						$('#coaAccRemarkBtnGroup').removeClass('hide');
					} else {
						$('#coaAccRemarkBtnGroup').addClass('hide');
					}
				} else {
					$('#btnCoaAccRemarkEdit').removeClass('hide');
					$('#form-remarkInfoTab .control-element .form-control').addClass('hide');
					$('#form-remarkInfoTab .control-element .control-label').removeClass('hide');
					$('#coaAccRemarkBtnGroup').addClass('hide');

					$('label[for="remark"]').text($("#remark").val());
				}
			},
			//记录设置关联辅助项
			setItemsData: function (data) {
				if (data.action) {
					accitemValueRangeListData = data.data.eleAccoAccos;
					var str = JSON.stringify(accitemValueRangeListData);
					var newStr = str.replace(/\"/g, "'");
					$('#coaAccAssist tbody tr').eq(data.data.index).attr("accitemValueRangeList", newStr);
					var eleCode = data.data.eleCode;
					var $tr = $('#coaAccAssist tbody tr').eq(data.data.index) //$rowTr;

					optFlag = 'saveRest';
					//获取id清空HTML，remove这个ufma-combox-id_popup
					var trId = $tr.find('.accitemDataClass').attr('id');
					//page.initAssitData(eleCode, $tr);
					optFlag = '';
					$tr.find('.accitemDataClass p').html(data.data.showAssitem);
					$tr.find('.accitemDataClass p').attr('title', data.data.showAssitem.join(','));
					if (!$.isNull($tr.find('.accitemDataClass p').html())) {
						$tr.find('.accitemDataClass .btnSetAccItem').animate({
							"margin-top": "-33px"
						});
					} else {
						$tr.find('.accitemDataClass .btnSetAccItem').animate({
							"margin-top": "-14px"
						});
					}
				}
			},

			//记录设置默认值 guohx  改到这  
			setDefItemsData: function (data) {
				if (data.action) {
					if(!$.isNull(data.data.codeName)){
						var $tr = $('#coaAccAssist tbody tr').eq(data.data.index)
						$tr.find('.accitemDataClassDef p').html(data.data.codeName);
						$tr.find('.accitemDataClassDef p').attr('title', data.data.codeName);
					}else{
						var $tr = $('#coaAccAssist tbody tr').eq(data.data.index)
						$tr.find('.accitemDataClassDef p').html('');
					}
					if (!$.isNull($tr.find('.accitemDataClassDef p').html())) {
						$tr.find('.accitemDataClassDef .btnSetAccItemDef').animate({
							"margin-top": "-33px"
						});
					} else {
						$tr.find('.accitemDataClassDef .btnSetAccItemDef').animate({
							"margin-top": "-14px"
						});
					}
				}
			},
			setAssistGroupControl: function () {
				if ($('#coaAccAssist thead tr th.btnGroup').length == 0) {
					$('#coaAccAssist thead tr').append('<th class="nowrap btnGroup" style="width:50px;min-width:50px;text-align:center;">操作</th>');
				}
				$('#coaAccAssist tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							var assistArry = [];
							if (page.action != 'edit') {
								assistArry = page.serializeAssist();
							} else {
								assistArry = page.eleAssAccoItems;
							}
							var moneyAssistArr = [];
							if (page.action != 'add' && page.action != 'addSub') {
								moneyAssistArr = page.serializeMoneyAssist();
							} else {
								moneyAssistArr = page.eleMoneyAccoItems;
							}
							if (!$.isNull(moneyAssistArr) && moneyAssistArr.length > 0) {
								var delCode = $(this).parent().siblings().find('input.ufma-combox-value').attr('value');
								//CWYXM-9830 会计科目启用金额控制且勾选辅助项控制后，删除辅助项没反应--zsj
								var comCode = [];
								for (var i = 0; i < moneyAssistArr.length; i++) {
									comCode.push(moneyAssistArr[i].accitemCode);
								}
								if ($.inArray(delCode, comCode) > -1) {
									ufma.showTip('此辅助项已在金额启用辅助项中使用，请先删除对应金额启用的辅助核算项', function () { }, 'warning');
									return false;
								} else {
									$tr.remove();
									page.adjAssitNo();
								}

							} else {
								/*if(assistArry.length > 0 && !$.isNull(assistArry[0].accitemCode)) {
									page.initMoneyAssistTree();
								} else {
									$('#enableLargeAccitem,#enableBalanceAccitem').removeAttr('checked');
									$('#moneyAssistAdd').addClass('hide');
									$('#moneyAssist tbody').html('');
								}*/
								$tr.remove();
								page.adjAssitNo();
							}
						});
						page.setAccItem($tr);
						page.setAccItemDef($tr);
						page.isShowAcc($tr);
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function (e) {
							var callback = function () {
								page.adjAssitNo();
							};
							$('#coaAccAssist').tableSort(callback);
						});
					}
				});
			},

			setIllegalGroupControl: function () {
				if ($('#coaAccIllegal thead tr th.btnGroup').length == 0) {
					$('#coaAccIllegal thead tr').append('<th class="nowrap btnGroup" style="width: 40px;min-width: 40px;">操作</th>');
				}
				$('#coaAccIllegal tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							//如果非法对应科目代码为空，直接删除不隐藏
							$tr.remove();
							page.adjIlacNo();
						});
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function (e) {
							var callback = function () {
								page.adjIlacNo();
							};
							$('#coaAccIllegal').tableSort(callback);
						});
					}
				});
			},
			//辅助项序号
			adjAssitNo: function () {
				var idx = 0;
				$('#coaAccAssist tbody tr').each(function () {
					if (!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
					}
				});
			},
			//非法对应科目序号
			adjIlacNo: function () {
				var idx = 0;
				$('#coaAccIllegal tbody tr').each(function () {
					if (!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
						$(this).find('input[name="chrCode"]').val(idx);
					}
				});
			},

			//辅助核算数据行循环显示
			newAssistTable: function (rowData) {
				var $table = $('#coaAccAssist');
				//新增时，自动往后加
				var recNo = $table.find('tr').length,
					accitemValueRangeList = "";
				//修改时，为排序号
				if (rowData && !$.isNull(rowData)) {
					page.rowData = rowData;
					recNo = rowData.ordSeq;
					if (rowData.accitemValueRangeList != "") {
						var str = JSON.stringify(rowData.accitemValueRangeList);
						accitemValueRangeList = str.replace(/\"/g, "'");
					}
				}
				var row =
					'<tr accitemValueRangeList="' + accitemValueRangeList + '">' +
					'<td class="text-center">' +
					'<input type="hidden" name="accitemId" value="">' +
					'<span class="recno">' + recNo + '</span>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemCodeClass" style="width:250px;"></div>' +
					////bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
					'<label for="eleName" class="control-label hide accountClassLabel commonShow" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td class="treeClick">' +
					'<div class="control-element">' +
					'<div class="accitemDataClass"><p style="max-width:200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;"></p><span class="btnSetAccItem">...</span></div>' +
					'<label for="accitemName" class="control-label hide commonShow"></label>' +
					'</div>' +
					'</td>' +
					'<td class="treeClick">' +
					'<div class="control-element">' +
					'<div class="accitemDataClassDef"><p style="max-width:200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;cursor: pointer;"></p><span class="btnSetAccItemDef">...</span></div>' +
					'<label for="accitemNameDef" class="control-label hide commonShow"></label>' +
					'</div>' +
					'</td>' +
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline fzisShow" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isShow" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline needInput" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isMust" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				//初始化辅助核算的combox的值
				page.initAssit($row);
				$rowTr = '';
				$rowTr = $row;
				//去掉使用方式的选择，如果想恢复需要取svn上2018-05-16之前代码
				if (rowData && !$.isNull(rowData)) {
					// page.initAssitData(rowData.accitemCode, $row); //根据combox上的值，给ufmaTreecombox初始化
					rowData.accitemType = 2;
					//详情页显示label值
					$row.find('label[for="eleName"]').html(rowData.eleName);
					$row.find('label[for="eleName"]').siblings('.accitemCodeClass').ufmaCombox().setValue(rowData.accitemCode, rowData.eleName); //详情页直接给combox赋值
					$row.find('label[for="accitemName"]').html(rowData.accitemValue + ' ' + rowData.accitemName);
					$row.find('.accitemDataClass p').html(rowData.accitemValue + ' ' + rowData.accitemName);
					if(!$.isNull(rowData.defaultCode)){
						$row.find('label[for="accitemNameDef"]').html(rowData.defaultCode + ' ' + rowData.defaultName);
						$row.find('.accitemDataClassDef p').html(rowData.defaultCode + ' ' + rowData.defaultName);
					}
					if (rowData.isShow == '1') {
						$row.find('input[name="isShow"]').attr('checked', true);
					} else {
						$row.find('input[name="isShow"]').removeAttr("checked");
					}
					//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					if (rowData.isMust == '1') {
						$row.find('input[name="isMust"]').attr('checked', true);
					} else {
						$row.find('input[name="isMust"]').removeAttr("checked");
					}
					$row.find('input[name="accitemId"]').val(rowData.accitemId);
					if (page.action == 'edit') {
						var showArray = [];
						var defalutArr = [];
						var show = false;
						for (var i = 0; i < rowData.accitemValueRangeList.length; i++) {
							var singleData = rowData.accitemValueRangeList[i].accitemValue + ' ' + rowData.accitemValueRangeList[i].accitemValueName;
							if (rowData.accitemValueRangeList[i].isDefault == 1) {
								show = true;
								defalutArr.push(singleData);
							}
							showArray.push(singleData);
						}
						if (show == true) {
							$row.find('label[for="accitemName"]').html(defalutArr.join(','));
							$row.find('label[for="accitemName"]').attr('title', defalutArr.join(','));
							$row.find('.accitemDataClass p').html(defalutArr.join(','));
							$row.find('.accitemDataClass p').attr('title', defalutArr.join(','));
						} else {
							$row.find('label[for="accitemName"]').html(showArray.join(','));
							$row.find('label[for="accitemName"]').attr('title', showArray.join(','));
							$row.find('.accitemDataClass p').html(showArray.join(','));
							$row.find('.accitemDataClass p').attr('title', showArray.join(','));
						}
						if (rowData.accitemValueRangeList != "") {
							var str = JSON.stringify(rowData.accitemValueRangeList);
							accitemValueRangeList = str.replace(/\"/g, "'");
						}
						$row.attr("accitemValueRangeList", accitemValueRangeList);
					}
					if (!$.isNull($row.find('.accitemDataClass p').html())) {
						if (page.action == 'addSub') {
							$row.find('.accitemDataClass .btnSetAccItem').animate({
								"margin-top": "-14px"
							});
						} else {
							$row.find('.accitemDataClass .btnSetAccItem').animate({
								"margin-top": "-33px"
							});
							$row.find('.accitemDataClass .btnSetAccItem').closest('td').addClass('showChange');
						}

					} else {
						$row.find('.accitemDataClass .btnSetAccItem').animate({
							"margin-top": "-14px"
						});
						$row.find('.accitemDataClass .btnSetAccItem').closest('td').removeClass('showChange');
					}
					if (!$.isNull($row.find('.accitemDataClassDef p').html())) {
						if (page.action == 'addSub') {
							$row.find('.accitemDataClassDef .btnSetAccItemDef').animate({
								"margin-top": "-14px"
							});
						} else {
							$row.find('.accitemDataClassDef .btnSetAccItemDef').animate({
								"margin-top": "-33px"
							});
							$row.find('.accitemDataClassDef .btnSetAccItemDef').closest('td').addClass('showChange');
						}

					} else {
						$row.find('.accitemDataClassDef .btnSetAccItemDef').animate({
							"margin-top": "-14px"
						});
						$row.find('.accitemDataClassDef .btnSetAccItemDef').closest('td').removeClass('showChange');
					}
				} else {
					page.setAssistGroupControl();
				}
			},

			//非法对应科目数据行循环显示
			newIllegalTable: function (rowData) {
				var $table = $('#coaAccIllegal');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				if (rowData && !$.isNull(rowData)) {
					recNo = rowData.ordSeq;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="ilaccId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<select class="form-control coaAcc-drCr"  name="drCr">' +
					'<option value="1">借</option>' +
					'<option value="-1">贷</option>' +
					'</select>' +
					'<label for="drCr" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox w200 form-combox coaAccIlacc"></div>' +
					'<label for="ilaccCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input name="ilaccName" class="form-control" disabled />' +
					'<label for="ilaccName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				//初始化非法对应科目的treeCombox的值
				page.initIllegal($row);

				//修改时显示数据
				if (rowData && !$.isNull(rowData)) {
					var drCrName;
					if (rowData.drCr == 1) {
						drCrName = '借';
					} else if (rowData.drCr == -1) {
						drCrName = '贷';
					}
					$row.find('label[for="drCr"]').html(drCrName);
					$row.find('label[for="ilaccCode"]').html(rowData.ilaccCode);
					$row.find('label[for="ilaccName"]').html(rowData.ilaccName);

					$row.find('input[name="ilaccId"]').val(rowData.ilaccId);
					$row.find('select[name="drCr"]').val(rowData.drCr);
					// $row.find('.coaAccIlacc').ufmaTreecombox().setValue(rowData.ilaccCode, rowData.ilaccCode);
					$row.find('.coaAccIlacc').find(".ufma-combox-input").val(rowData.ilaccCode);
					$row.find('.coaAccIlacc').find(".ufma-combox-value").val(rowData.ilaccCode);
					$row.find('input[name="ilaccName"]').val(rowData.ilaccName);
				} else {
					//新增时
					page.setIllegalGroupControl();
				}
			},
			//初始化金额控制的辅助项表格
			initMoneyAssist: function (rowData) {
				var $table = $('#moneyAssist');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				if (rowData && !$.isNull(rowData)) {
					recNo = rowData.ordSeq;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="moneyAssId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element tc">' +
					'<div class="ufma-combox form-combox moneyAssTree"></div>' +
					'<label for="moneyAssCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td class="moneyTreeDiv hide">' +
					'<div class="control-element tc">' +
					'<div class="ufma-combox form-combox moneTypeTree"></div>' +
					'<label for="moneyAssTypeCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>'
				'</tr>';
				var $row = $(row).appendTo($table);
				//初始化非法对应科目的treeCombox的值
				page.initMoneyAssistTree($row);
				page.initMoneyTypeTree($row);
				//修改时显示数据
				if (rowData && !$.isNull(rowData)) {
					$row.find('label[for="moneyAssCode"]').html(rowData.accitemName);
					$row.find('label[for="moneyAssCode"]').siblings('.moneyAssTree').ufmaCombox().setValue(rowData.accitemCode, rowData.accitemName);
					$row.find('label[for="moneyAssTypeCode"]').html(rowData.controlName);
					$row.find('label[for="moneyAssTypeCode"]').siblings('.moneTypeTree').ufmaCombox().setValue(rowData.controlType, rowData.controlName);
					$row.find('.moneyAssTree').find(".ufma-combox-input").val(rowData.accitemName);
					$row.find('.moneyAssTree').find(".ufma-combox-value").val(rowData.accitemCode);
					$row.find('.moneTypeTree').find(".ufma-combox-input").val(rowData.controlName);
					$row.find('.moneTypeTree').find(".ufma-combox-value").val(rowData.controlType);
				} else {
					//新增时
					page.setIMoneyAssistGroupControl();
				}
			},
			//设置金额控制的辅助项表格操作列
			setIMoneyAssistGroupControl: function () {
				if ($('#moneyAssist thead tr th.btnGroup').length == 0) {
					$('#moneyAssist thead tr').append('<th class="nowrap btnGroup" style="width: 40px;min-width: 40px;font-weight: 100;">操作</th>');
				}
				$('#moneyAssist tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup tc">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							$tr.remove();
							page.addMoneyAssisNo();
						});
						$tr.find('td.moneyTreeDiv .moneTypeTree').on('click', function () {
							page.initMoneyData();
							page.initMoneyTypeTree($tr);
						});
					}
				});
			},
			//初始化金额辅助项树
			initMoneyAssistTree: function ($tr) {
				var treeData = [];
				var assistArry = [];
				if (page.editMode != 'edit') {
					assistArry = page.serializeAssist();
				} else {
					assistArry = page.eleAssAccoItems;
				}
				for (var j = 0; j < assistArry.length; j++) {
					for (var i = j; i < page.AccItemTypeList.length; i++) {
						if (page.AccItemTypeList[i].accItemCode == assistArry[j].accitemCode) {
							treeData.push(page.AccItemTypeList[i]);
						}
					}
				}
				$tr.find('.moneyAssTree').each(function () {
					$(this).ufmaCombox({
						valueField: 'accItemCode',
						textField: 'accItemName',
						name: 'accItemCode',
						data: treeData,
						readOnly: true,
						onchange: function (node) {
							//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
							$tr.find('.moneyAssCode').html(node.accItemName);
							$tr.find('.moneyAssCode').attr('title', node.accItemName);
						}
					});
				});
			},
			//初始化金额控制分类树
			initMoneyTypeTree: function ($tr) {
				$tr.find('.moneTypeTree').each(function () {
					var $tree = $(this);
					$(this).ufmaCombox({
						valueField: 'code',
						textField: 'codeName',
						name: 'code',
						data: page.moneyAssTypeData,
						readOnly: true,
						onchange: function (node) { },
						initComplete: function () {
							/*if($.isNull($tree.ufmaCombox().getValue())) {
								var data = $tree.ufmaCombox().setting.data;
								if(data.length > 0) {
									var code = data[0].code;
									var codeName = data[0].codeName;
									$tree.ufmaCombox().setValue(code, codeName);
								}
							}*/
						}
					});

				});
			},
			//初始化金额控制的辅助项表格序号
			addMoneyAssisNo: function () {
				var idx = 0;
				$('#moneyAssist tbody tr').each(function () {
					if (!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
					}
				});
			},
			//请求辅助核算项列表
			getComAccItemTypeList: function () {
				var argu = {};
				argu["rgCode"] = page.rgCode;
				argu["setYear"] = page.setYear;
				ufma.ajaxDef('/ma/sys/accitem/select/' + window.ownerData.agencyCode, 'get', argu, function (result) {
					var reData = result.data;
					reData = reData.sort(
						function compareFunction(item1, item2) {
							return item1.accItemName.localeCompare(item2.accItemName, "zh");
						}
					);
					page.AccItemTypeList = reData;
				});

			},

			//初始化辅助核算项
			initAssit: function ($tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.accitemCodeClass').each(function () {
						$(this).ufmaCombox({
							valueField: 'accItemCode',
							textField: 'accItemName',
							name: 'accItemCode',
							data: page.AccItemTypeList,
							readOnly: true,
							onchange: function (node) {
								//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
								$tr.find('.accountClassLabel').html(node.eleCode);
								$tr.find('.accountClassLabel').attr('title', node.accItemName);
								$tr.find('label[for="accitemName"]').html('');
								$tr.find('label[for="accitemNameDef"]').html('');
								accitemValueRangeListData = '';
								$tr.find('.accitemDataClass p').html('');
								$tr.find('.accitemDataClassDef p').html('');
								$tr.attr('accitemValueRangeList', '');
								$tr.find('.accitemDataClass .btnSetAccItem').animate({
									"margin-top": "-14px"
								});
								$tr.find('.accitemDataClassDef .btnSetAccItemDef').animate({
									"margin-top": "-14px"
								});
							}
						});
					})
				}

				buildCombox();
			},

			//根据辅助核算项获取辅助核算项数据
			initAssitData: function (eleCode, $tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);
				var tableData = [];
				if (!$.isNull(data)) {
					tableData = [];
					tableData = data;
					buildCombox();
				} else {
					var argu = {};
					argu["rgCode"] = page.rgCode;
					argu["setYear"] = page.setYear;
					argu["agencyCode"] = page.agencyCode;
					argu["acctCode"] = page.acctCode; //bugCWYXM-4570--传入账套--zsj
					argu["eleCode"] = eleCode;
					if (accitemValueRangeListData.length > 0) {
						var chrCodes = [];
						for (var i = 0; i < accitemValueRangeListData.length; i++) {
							chrCodes.push(accitemValueRangeListData[i].accitemValue)
						}
						argu["chrCodes"] = chrCodes;
					}
					ufma.ajaxDef('/ma/sys/coaAcc/getAccItemTree', 'post', argu, function (result) {
						tableData = [];
						tableData = result.data;
						//buildCombox();
					});
				}

				function buildCombox() {
					if (optFlag == 'saveRest') {
						var trId = $tr.find('.accitemDataClass').attr('id');
						//将原来的组件ufmaTreecombox改为ufmaTreecombox2，并将样式调整为样式--zsj--CWYXM-4389
						page.accItemValue = $tr.find('.accitemDataClass').ufmaTreecombox2({
							valueField: 'id',
							textField: 'codeName', //显示出来的值
							name: 'accItemValue',
							data: tableData,
							onchange: function (data) {

							},
							initComplete: function (sender) {

							}
						});
						$('#' + trId).find('.ufma-combox-border').css({
							"position": "relative",
							"background": "#fff",
							"border": "1px #d9d9d9 solid",
							"-moz-border-radius": "4px",
							"-webkit-border-radius": "4px",
							"border-radius": "4 px",
							"padding": "4 px 8 px",
							"width": " 100 %",
							"cursor": " text",
							"height": "30 px",
							"text-align": "left"
						});
						$('#' + trId).find('.ufma-combox-border').hover(function () {
							$('#' + trId).find('.ufma-combox-border .ufma-combox-inputLi').css({
								"color": "#333",
								"cursor": "default"
							});
						});
					} else {
						$tr.find('.accitemDataClass').each(function () {
							page.accItemValueEdit = $(this).ufmaTreecombox2({
								valueField: 'id',
								textField: 'codeName', //显示出来的值
								name: 'accItemValue',
								data: tableData,
								onchange: function (data) {

								},
								initComplete: function (sender) {

								}
							});
						})
						$tr.find('.accitemDataClass').find('.ufma-combox-border').css({
							"position": "relative",
							"background": "#fff",
							"border": "1px #d9d9d9 solid",
							"-moz-border-radius": "4px",
							"-webkit-border-radius": "4px",
							"border-radius": " 4 px",
							"padding": "4 px 8 px",
							"width": "100 % ",
							"cursor": "text",
							"height": "30 px",
							"text-align": "left"
						});
						$tr.find('.accitemDataClass').find('.ufma-combox-border').hover(function () {
							$tr.find('.accitemDataClass').find('.ufma-combox-border .ufma-combox-inputLi').css({
								"color": "#333",
								"cursor": "default"
							});
						});
					}
				}
			},

			//初始化非法会计科目
			initIllegal: function ($tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.coaAccIlacc').each(function () {
						$(this).ufmaTreecombox({
							valueField: 'id',
							textField: 'codeName',
							name: 'ilaccCode',
							data: data,
							readOnly: false,
							onchange: function (node) {
								//带出该行科目名称
								$tr.find('input[name="ilaccName"]').val(node.name);
								$tr.find('.coaAccIlacc .ufma-combox-input').val(node.code);
							}
						});
					});
				}

				if (!$.isNull(data)) {
					buildCombox();
				} else {
					var argu = {};
					argu["rgCode"] = page.rgCode;
					argu["setYear"] = page.setYear;
					argu["agencyCode"] = page.agencyCode;
					argu["acctCode"] = page.acctCode;
					argu["eleCode"] = 'ACCO';
					argu["accsCode"] = page.accsCode;
					ufma.ajaxDef('/ma/sys/common/getEleTree', 'get', argu, function (result) {
						data = result.data;
						buildCombox();
					});
				}
			},

			//辅助核算数据序列化
			serializeAssist: function () {
				var aKJYS = [];
				var irow = 0;
				useCount = 0;
				$('#form-assistInfoTab tbody tr').each(function (idx) {
					var tmpYS = {};
					var defaultCount = 0;
					//if(!$(this).hasClass('hide')) {
					irow = irow + 1;
					tmpYS.accoCode = $('#form-mainInfoTab').find('[name="chrCode"]').val(); //当前会计科目code
					tmpYS.accitemId = $(this).find('[name="accitemId"]').val(); //辅助核算的行上的accitem_id
					tmpYS.ordSeq = irow; //辅助核算序号
					tmpYS.accitemCode = $(this).find('[name="accItemCode"]').val(); //辅助核算eleCode
					tmpYS.accitemType == '2';
					if ($(this).find('[name="isShow"]').is(':checked')) {
						tmpYS.isShow = '1';
					} else {
						tmpYS.isShow = '0';
					}
					//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
					if ($(this).find('[name="isMust"]').is(':checked')) {
						tmpYS.isMust = '1';
					} else {
						tmpYS.isMust = '0';
					}
					if (tmpYS.isShow == '0' && tmpYS.isMust == '0') {
						useCount++;
					}
					var codeArr = $(this).find('.accitemDataClassDef p').html().split(' ');
					tmpYS.defaultCode = codeArr[0];
					tmpYS.defaultName = codeArr[1];
					var newData = $(this).attr("accitemValueRangeList");
					var accitemValueData;
					if (!$.isNull(newData)) {
						accitemValueData = eval("(" + newData + ")");
						tmpYS.accitemValueRangeList = accitemValueData;
						var codeArr = $(this).find('.accitemDataClass p').html().split(' ');
						var accitemValue = codeArr[0]; //辅助核算code
						var accitemName = codeArr[1]; //辅助核算name*/
						for (var i = 0; i < accitemValueData.length; i++) {
							if (accitemValueData[i].isDefault == 1 && accitemValueData[i].accitemValue == accitemValue) {
								tmpYS.accitemValue = accitemValueData[i].accitemValue; //辅助核算code
								tmpYS.accitemName = accitemName; //辅助核算name*/
							}
						}
					}
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},

			//非法对应科目数据序列化
			serializeIllegal: function () {
				var aKJYS = [];
				var irow = 0;
				$('#form-illegalInfoTab tbody tr').each(function (idx) {
					if (!$(this).hasClass('hide')) {
						var tmpYS = {};
						tmpYS.isDeleted = 0;
						irow = irow + 1;
						tmpYS.chrCode = $('#form-mainInfoTab').find('[name="chrCode"]').val(); //当前会计科目code
						tmpYS.ilaccId = $(this).find('[name="ilaccId"]').val(); //非法对应科目行上的ilaccId
						tmpYS.ordSeq = irow; //非法对应科目行序号
						tmpYS.drCr = $(this).find('[name="drCr"]').children('option:selected').val(); //方向
						tmpYS.ilaccCode = $(this).find('[name="ilaccCode"]').val(); //非法对应科目编码code
						aKJYS.push(tmpYS);
					}
				});
				return aKJYS;
			},

			//保存基本信息、数量外币、备注
			saveBaseInfo: function (flag, type) {
				var argu = {};
				if (flag == 'form-mainInfoTab') {
					argu = $('#form-mainInfoTab').serializeObject();
					if (aTCodeSel != null) {
						argu.agencyTypeCode = aTCodeSel.join(',')
					} else {
						argu.agencyTypeCode = ''
					}

					if (window.ownerData.diffAgencyType == '0') {
						argu.agencyTypeCode = ''; //科目体系不控制适用单位
					}
					//全称
					if ($("#chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
						argu["chrFullname"] = $("#chrName").val();
					} else {
						argu["chrFullname"] = ma.nameTip + "/" + $("#chrName").val();
					}
					argu.saveType = "2";
				} else if (flag == 'form-moneyInfoTab') {
					argu = $('#form-moneyInfoTab').serializeObject();
					argu.saveType = "3";
					if (argu.isQty == '0') {
						argu.qtyDigits = '';
						argu.qtyUom = '';
					}
					if (argu.isCur == '0') {
						argu.defCurCode = '';
						argu.defCurName = '';
					} else {
						argu.defCurName = $('#defCurCode').children('option:selected').text();
					}
					if (page.saveNext == true) {
						argu.confirmUpdateUsedAcco = "1";
					}
				} else if (flag == 'form-remarkInfoTab') {
					argu = $('#form-remarkInfoTab').serializeObject();
					argu.saveType = "7";
				}
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu = page.initSaveArgu(argu);
				ufma.showloading('数据保存中，请耐心等待...');
				ufma.post(interfaceURL.coaAccSave, argu, function (result) {
					ufma.hideloading();
					if (result.flag == 'success') {
						ufma.showTip('保存成功！', function () {
							//保证版本号+1
							//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
							page.setBaseFormEdit(false);
							page.getCurData();
							page.closeData = true;
							page.editMode = 'editJB';
							wbJBdata = result.data;
							page.setNummoneyFormEdit(true);
						}, 'success');
					} else {
						ufma.showTip(result.msg, function () { }, 'warning');
					}
				});
			},
			//判断辅项是否可以修改
			isCanUpdateUsedAcco: function (again) {
				var argu = {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"chrCode": $('#chrCode').val()
				};
				ufma.post(interfaceURL.isCanUpdateUsedAcco, argu, function (result) {
					if (result.data) {
						//提示用户是否要修改
						ufma.confirm('科目已使用，请确认是否修改？', function (action) {
							if (action) {

								//点击确定的回调函数
								//bugCWYXM-5425--当会计科目已使用时确认是否选择仍然修改辅助核算项或外币
								if (page.saveAreaFlag == 'assist') { //辅助核算项
									ufma.showloading('数据保存中，请耐心等待...');
									page.saveAssistInfo(true);
								} else if (page.saveAreaFlag == 'money') { //数量、外币
									var moneyData = $('#form-moneyInfoTab').serializeObject();
									//如果外币和数量原本就是已启用状态则比对是否修改内容，如果没有修改则保存成功，否则保存不成功
									if (page.curData.isQty == '1' && page.curData.isQty == moneyData.isQty && page.curData.isCur == moneyData.isCur && page.curData.isCur == '1' && page.curData.qtyDigits == moneyData.qtyDigits && page.curData.qtyUom == moneyData.qtyUom && page.curData.defCurCode == moneyData.defCurCode) {
										page.sureMoneyUpdate = true;
									} else if (page.curData.isQty == '0' && page.curData.isCur == '0' && (moneyData.isQty == '1' || moneyData.isCur == '1')) { //如果外币和数量原本就是已停用状态则修改为启用状态，则可以保存成功
										page.sureMoneyUpdate = true;
									} else if (page.curData.isQty == '1' && page.curData.isQty == moneyData.isQty && page.curData.isCur == moneyData.isCur && page.curData.isCur == '0' && page.curData.qtyDigits == moneyData.qtyDigits && page.curData.qtyUom == moneyData.qtyUom) { //如果数量原本就是已启用状态则比对是否修改内容，如果没有修改则保存成功，否则保存不成功，不控制外币
										page.sureMoneyUpdate = true;
									} else if (page.curData.isQty == '0' && page.curData.isQty == moneyData.isQty && page.curData.isCur == moneyData.isCur && page.curData.isCur == '1' && page.curData.defCurCode == moneyData.defCurCode) { //如果外币原本就是已启用状态则比对是否修改内容，如果没有修改则保存成功，否则保存不成功，不控制数量
										page.sureMoneyUpdate = true;
									}
									if (page.sureMoneyUpdate == true) {
										ufma.showloading('数据保存中，请耐心等待...');
										page.saveNext = true;
										page.saveBaseInfo('form-moneyInfoTab');
									} else if (page.sureMoneyUpdate == false) {
										page.saveNext = false;
										ufma.showTip('已使用的科目不允许修改', function () {
											return false;
										}, 'warning');
									}
								}
							} else {
								//点击取消的回调函数
								$("#coaAccAssistBtnGroup .btn-cancel").trigger("click");
							}
						}, {
							type: 'warning'
						});
					} else {
						//走保存接口
						if (page.saveAreaFlag == 'assist') {
							page.saveAssistInfo(again);
						} else if (page.saveAreaFlag == 'money') {
							page.sureMoneyUpdate = false;
							page.saveBaseInfo('form-moneyInfoTab');
						}
					}
				});
			},
			//保存辅助项
			coaAccSaveAccItems: function (flag, again, argu) {
				if (!flag) {
					ufma.alert("辅助核算项不允许为空！", "warning");
					ufma.hideloading();
					return false;
				}
				if (again) {
					//科目已使用，继续修改辅项时confirmUpdateUsedAcco为1
					argu.confirmUpdateUsedAcco = "1";
				}
				argu.saveType = "4";
				ufma.post(interfaceURL.coaAccSave, argu, function (result) {
					ufma.showTip(result.msg, function () { }, result.flag);
					//重新获取辅助核算项数据，重绘表格
					page.getCurData();
					page.initAssistTable(page.curData);
					page.closeData = true;
				});
			},
			//判断保存辅助项是否同步
			saveAssistInfo: function (again) {
				var argu = {};
				argu = page.findSingleArgu(argu);
				argu.eleAccoItems = page.serializeAssist();
				argu = page.initSaveArgu(argu);

				//判断辅助核算项是否为空
				var flag = true,
					idx = 0;
				$.each(argu.eleAccoItems, function (index, row) {
					if (row.accitemCode == '') {
						flag = false;
						return false;
					}
					var distinctList = argu.eleAccoItems.select(function (el, i, res, param) {
						return el.isDeleted == 0 && el.accitemCode == row.accitemCode;
					});
					if (distinctList.length > 1) {
						idx = index;
						return false;
					}
				});
				if (idx > 0) {
					ufma.alert("第" + (idx + 1) + "行，辅助核算重复，请重新设置！", "warning");
					return false;
				}
				//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
				if (useCount > 0) {
					ufma.showTip('显示设置为否时，必输必须设置为是', function () { }, 'warning');
					return false;
				}
				//判断同步选框是否勾选
				if ($('#updateAllSonAccItems').is(':checked') != true && accisLeaf != 1) {
					ufma.confirm('是否同步修改下级科目的辅助核算', function (action) {
						if (action) {
							argu["updateAllSonAccItems"] = 1; //同步
							page.coaAccSaveAccItems(flag, again, argu);
						} else {
							page.coaAccSaveAccItems(flag, again, argu);
						}
					})
				} else {
					page.coaAccSaveAccItems(flag, again, argu);
				}
			},
			//保存非法科目
			saveIllegalInfo: function () {
				var argu = {};
				argu = page.initSaveArgu(argu);
				argu.eleAccoIlaccs = page.serializeIllegal();
				//判断非法对应科目代码是否为空
				var ilaccFlag = true;
				$.each(argu.eleAccoIlaccs, function (index, row) {
					if (row.ilaccCode == '') {
						ilaccFlag = false;
						return false;
					}
				});
				if (!ilaccFlag) {
					ufma.alert("非法对应科目不允许为空！", "warning");
				} else {
					argu.saveType = "6";
					ufma.showloading('数据保存中，请耐心等待...');
					ufma.post(interfaceURL.coaAccSave, argu, function (result) {
						ufma.showTip(result.msg, function () {
							//重新获取非法对应科目数据，重绘表格
							page.getCurData();
							page.initIlaccTable(page.curData);
							page.closeData = true;
						}, result.flag);
					});
				}
			},
			//保存金额控制
			saveAMTCtrl: function () {
				var argu = $('#frmAMTCtrl').serializeObject();
				argu = page.initSaveArgu(argu);
				argu.enableBalanceControl = $('#enableBalanceControl').prop('checked') ? 1 : 0;
				argu.enableLargeControl = $('#enableLargeControl').prop('checked') ? 1 : 0;
				argu.saveType = "5";
				//enableLargeAccitem  启用大额辅助项控制：1启用 0不启用
				if ($('#enableLargeAccitem').is(":checked")) {
					argu.enableLargeAccitem = '1';
				} else if (!($('#enableLargeAccitem').is(":checked"))) {
					argu.enableLargeAccitem = '0';
				}
				//enableBalanceAccitem   启用余额辅助项控制：1启用 0不启用;
				if ($('#enableBalanceAccitem').is(":checked")) {
					argu.enableBalanceAccitem = '1';
				} else if (!($('#enableBalanceAccitem').is(":checked"))) {
					argu.enableBalanceAccitem = '0';
				}
				if (argu.enableBalanceControl != 1) {
					argu.balanceControlMoney = '';
				}
				if (argu.enableLargeControl != 1) {
					argu.largeControlMoney = '';
				}
				argu.moneyCtrls = page.serializeMoneyAssist();
				if (!page.checkBeforSave(argu)) {
					return false;
				} else {
					ufma.post(interfaceURL.coaAccSave, argu, function (result) {
						ufma.showTip('金额控制保存成功！', function () {
							page.setAmtCtrlFormEdit(false);
							page.getCurData();
							page.closeData = true;
						}, 'success');
					});
				}
			},
			//校验上级科目是否需要迁移
			isParentAccoNeedTransfer: function (flag, argu) {
				var transferArgu = {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"chrCode": $('#chrCode').val()
				};
				ufma.post(interfaceURL.isParentAccoNeedTransfer, transferArgu, function (result) {
					if (result.data) {
						//科目已使用，需要迁移
						page.parentTransfer(argu);
					} else {
						//科目没有使用，不需要迁移
						page.coaAccSave(flag, argu);
					}
				});
			},
			//渲染迁移
			parentTransfer: function (argu) {
				parent.document.getElementsByClassName('u-msg-title')[0].innerHTML += '<div class="mask"></div>'
				parent.document.getElementsByClassName('mask')[0].style.width = "100%"
				parent.document.getElementsByClassName('mask')[0].style.height = "100%"
				parent.document.getElementsByClassName('mask')[0].style.background = "rgba(0,0,0,.3)"
				parent.document.getElementsByClassName('mask')[0].style.position = "absolute"
				parent.document.getElementsByClassName('mask')[0].style.left = "0"
				parent.document.getElementsByClassName('mask')[0].style.top = "0"
				var arguStr = JSON.stringify(argu);
				var newTitle = "<div class='coaAccMoveBox'>" +
					"<div id='coaAccMove'>" +
					"<div class='waing'>!</div>" +
					"<p class='coaAccMoveTitle'>当前科目代码（" + argu.chrCode.substring(0, argu.chrCode.length - 2) + "）已使用，不能增加下级科目。若要增加下级科目，系统会自动将当前科目（" + argu.chrCode.substring(0, argu.chrCode.length - 2) + "）相关业务数据迁移到另一个下级科目中。<br/><span>确定要增加下级科目吗？</span></p>" +
					"<div id='coaAccMoveContent'><button class='btn btn-sm btn-default' item='3' >取消</button><button class='btn btn-sm btn-primary btn-sure' item='2' data='" + arguStr + "'>确定</button>" +
					"</div>" +
					"</div>" +
					"</div>" +
					"<div class='mask'></div>";
				$('#coaAccEdit').append(newTitle)
			},
			//保存前校验
			checkBeforSave: function (argu) {
				if (!ma.formValidator("chrCode", "chrName", "会计科目", page.action)) {
					return false;
				}
				//判断辅助核算项和非法对应科目是否为空
				var assistFlag = true;
				$.each(argu.eleAccoItems, function (index, row) {
					if (row.accitemCode == '') {
						assistFlag = false;
						return false;
					}
				});
				var ilaccFlag = true;
				$.each(argu.eleAccoIlaccs, function (index, row) {
					if (row.ilaccCode == '') {
						ilaccFlag = false;
						return false;
					}
				});
				//if((argu.enableBalanceAccitem == '1' || argu.enableLargeAccitem == '1') && argu.moneyCtrls.length == 0) {
				if (argu.enableBalanceAccitem == '1' && argu.moneyCtrls.length == 0) { //CWYXM-9225--只有余额需要辅助项表格，大额直接使用科目选择的所有辅助项--zsj
					ufma.showTip("未新增金额启用的辅助核算项，请取消启用辅助核算项勾选！", function () { }, "warning");
					return false;
				}
				//CWYXM-9759 启用金额控制，若勾选控制，应校验金额和控制方式必填--zsj
				if (argu.enableBalanceControl == '1') {
					if ($.isNull(argu.balanceControlMoney)) {
						ufma.showTip('已启用余额控制，金额不能为空', function () { }, 'warning');
						return false;
					} else if ($.isNull(argu.balanceControlMode)) {
						ufma.showTip('已启用余额控制，控制方式不能为空', function () { }, 'warning');
						return false;
					}
				}
				if (argu.enableLargeControl == '1') {
					if ($.isNull(argu.largeControlMoney)) {
						ufma.showTip('已启用大额控制，金额不能为空', function () { }, 'warning');
						return false;
					} else if ($.isNull(argu.largeControlMode)) {
						ufma.showTip('已启用大额控制，控制方式不能为空', function () { }, 'warning');
						return false;
					}
				}
				var moneyAssistType = true;
				var moneyAssistCon = true;
				//判断辅助核算 是否重复
				$.each(argu.moneyCtrls, function (index, row) {
					if ($.isNull(row.accitemCode)) {
						moneyAssistType = false;
						return false;
					}

				});
				var countNum = 0;
				var moneyCtrlsArr = [];
				for (var i = 0; i < argu.moneyCtrls.length; i++) {
					moneyCtrlsArr.push(argu.moneyCtrls[i].accitemCode);
				}
				moneyCtrlsArr = moneyCtrlsArr.sort();
				for (var i = 0; i < moneyCtrlsArr.length; i++) {
					if (moneyCtrlsArr[i] == moneyCtrlsArr[i + 1]) {
						countNum++;
					}
				}
				if (countNum > 0) {
					ufma.alert("金额启用的辅助核算项不允许重复！", "warning");
					return false;
				}
				$.each(argu.moneyCtrls, function (index, row) {
					if ($.isNull(row.controlType)) {
						moneyAssistCon = false;
						return false;
					}
				});
				if (!assistFlag) {
					ufma.alert("辅助核算项不允许为空！", "warning");
					return false;
				}
				if (!ilaccFlag) {
					ufma.alert("非法对应科目不允许为空！", "warning");
					return false;
				}
				if (!moneyAssistType) {
					ufma.alert("已启用辅助项控制，辅助项类别不能为空！", "warning");
					return false;
				}
				//CWYXM-9225--只有余额使用辅助项，所以余额默认传01
				/*if(!moneyAssistCon) {
					ufma.alert("已启用辅助项控制，控制类别不能为空！", "warning");
					return false;
				}*/
				//CWYXM-11605 --会计科目新增编辑辅助核算部分，‘显示’列后增加一列，‘必输’，默认为是，当显示选择为是时，可以选择是否必输，当显示选择为否时，必输只能为是，也就是默认值为是--zsj
				if (useCount > 0) {
					ufma.showTip('显示设置为否时，必输必须设置为是', function () { }, 'warning');
					return false;
				}
				return true;
			},
			/**
			 *
			 * @param flag  true是保存并新增，false是保存
			 * @param again
			 * @returns {boolean}
			 */
			//请求保存接口
			coaAccSave: function (flag, argu) {
				ufma.post(interfaceURL.coaAccSave, argu, function (result) {
					ufma.hideloading();
					if (flag) {
						//保存并新增，保存成功后表单置空
						ufma.showTip('保存成功,您可以继续添加会计科目！', function () { }, 'success');
						//重置表单
						page.resetForm();
						$('#agencyTypeCode').val(page.agencyTypeCode)
						ma.fillWithBrother($('#chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": "ACCO",
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode,
							"accsCode": page.accsCode
						});
						page.closeData = true;// guohx 保存并新增后 点击关闭要刷新主界面 20200226
						//bug76759--保存并新增时保留父级的辅助核算项--zsj
						page.accItemsTableEdit2(page.curData);
						//bugCWYXM-4452--新增下级时是自动把上级科目类型复制过来的。保存并新增时，没有复制上级科目的属性--zsj
						if (!$.isNull(page.curData.accoType)) {
							ufma['accoType'].val(page.curData.accoType).trigger("change");
						}
					} else {
						//保存成功后提示成功，并关闭弹窗
						ufma.showTip(result.msg, function () {
							page.closeData = true;
							_close('save');
						}, result.flag)
					}
				})
			},
			//新增保存
			saveAll: function (flag, again) {
				var argu = page.findSaveAllArgu();
				//保存前校验
				if (!page.checkBeforSave(argu)) {
					ufma.hideloading();
					return false;
				}
				page.isParentAccoNeedTransfer(flag, argu);
			},
			//新增保存辅助项input选项
			findSingleArgu: function (argu) {
				//到期日
				if ($('#expireDate').is(':checked')) {
					argu["expireDate"] = $('#expireDate').val();
				} else {
					argu["expireDate"] = '0';
				}
				//票据号
				if ($('#isShowBill').is(':checked')) {
					argu["isShowBill"] = $('#isShowBill').val();
				} else {
					argu["isShowBill"] = '0';
				}
				if ($('#isCashflow').is(':checked')) {
					argu["isCashflow"] = $('#isCashflow').val();
				} else {
					argu["isCashflow"] = '0';
				}
				if ($('#isCheckRegister').is(':checked')) {
					argu["isCheckRegister"] = $('#isCheckRegister').val();
				} else {
					argu["isCheckRegister"] = '0';
				}
				if ($('#field1').is(':checked')) {
					argu["field1"] = $('#field1').val();
				} else {
					argu["field1"] = '0';
				}
				if ($('#field2').is(':checked')) {
					argu["field2"] = $('#field2').val();
				} else {
					argu["field2"] = '0';
				}
				//CWYXM-7706--经赵雪蕊确认先隐藏会计科目编辑界面差异项的勾选项--按照默认未勾选保存--zsj
				argu["allowSurplus"] = '0';
				if ($('#updateAllSonAccItems').is(':checked')) {
					argu["updateAllSonAccItems"] = $('#updateAllSonAccItems').val();
				} else {
					argu["updateAllSonAccItems"] = '0';
				}
				return argu;
			},
			//去除空格
			removeStringSpace: function (strname) {
				var newStrname = strname.replace(/\s+/g, ""); //去空格
				newStrname.replace(/[\r\n]/g, ""); //去回车换行
				return newStrname;
			},
			//新增保存所有参数
			findSaveAllArgu: function () {
				var argu = {};
				var argu1 = $('#form-mainInfoTab').serializeObject();
				var argu2 = $('#form-moneyInfoTab').serializeObject();
				var argu3 = $('#form-remarkInfoTab').serializeObject();
				var argu4 = $('#frmAMTCtrl').serializeObject();
				var agencyTypeCodeArr = [];
				$("ul.select2-selection__rendered li").each(function () {
					var title = $(this).attr("title")
					agencyTypeCodeArr.push(title);
				});
				var newAgencyTypeCodeArr = [];
				for (var i = 0; i < agencyTypeCodeArr.length; i++) {
					$("#agencyTypeCode option").each(function () {
						if ($(this).text() == agencyTypeCodeArr[i]) {
							newAgencyTypeCodeArr.push($(this).attr('value'));
						}
					})
				}
				argu4.enableBalanceControl = $('#enableBalanceControl').prop('checked') ? 1 : 0;
				argu4.enableLargeControl = $('#enableLargeControl').prop('checked') ? 1 : 0;
				//去掉会计科目名称中的空格
				var nameString = argu1['chrName'];
				argu1['chrName'] = page.removeStringSpace(nameString);

				argu = page.findSingleArgu(argu);
				var argu = $.extend(argu, argu1, argu2, argu3, argu4);
				argu.eleAccoItems = page.serializeAssist();
				argu.eleAccoIlaccs = page.serializeIllegal();
				//enableLargeAccitem  启用大额辅助项控制：1启用 0不启用
				if ($('#enableLargeAccitem').is(":checked")) {
					argu.enableLargeAccitem = '1';
				} else if (!($('#enableLargeAccitem').is(":checked"))) {
					argu.enableLargeAccitem = '0';
				}
				//enableBalanceAccitem   启用余额辅助项控制：1启用 0不启用;
				if ($('#enableBalanceAccitem').is(":checked")) {
					argu.enableBalanceAccitem = '1';
				} else if (!($('#enableBalanceAccitem').is(":checked"))) {
					argu.enableBalanceAccitem = '0';
				}
				argu.moneyCtrls = page.serializeMoneyAssist();
				argu = page.initSaveArgu(argu);
				//全称
				var chrNameVal = $("#chrName").val();
				var newChrName = page.removeStringSpace(chrNameVal); //去掉会计科目名称中的空格
				if ($("#chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = newChrName;
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + newChrName;
				}
				argu.agencyTypeCode = newAgencyTypeCodeArr.join(',');
				return argu;
			},
			//初始化保存参数
			initSaveArgu: function (argu) {
				argu["rgCode"] = page.rgCode;
				argu["setYear"] = page.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.accsCode;
				argu["acceCode"] = page.acceCode;
				argu["accaCode"] = page.accaCode;
				argu["chrId"] = $('#chrId').val();
				argu["chrCode"] = $('#chrCode').val();
				argu['chrName'] = page.removeStringSpace($('#chrName').val());
				argu["lastVer"] = page.lastVer;
				return argu;
			},

			//重置表单
			resetForm: function () {
				//CWYXM-9833 --取消勾选科目金额控制时，已录入的金额、控制方式、启用辅助项等应清空--zsj
				$('#chrCode').removeAttr("disabled");
				$('#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab,#frmAMTCtrl,#form-assistInfoTab,#form-illegalInfoTab')[0].reset();
				$('#expireDate').prop("checked", false);
				$('#isShowBill').prop("checked", false);
				$('#isCashflow').prop("checked", false);
				$('#isCheckRegister').prop("checked", false);
				$('#field1').prop("checked", false);
				$('#field2').prop("checked", false);
				$('#allowSurplus').prop("checked", false);
				$('#coaAccAssist').find('tbody').html('');
				$('#coaAccIllegal').find('tbody').html('');
				$('#moneyAssist').find('tbody').html('');
				$('#enableBalanceControl').prop("checked", false);
				$('#enableBalanceAccitem').prop("checked", false);
				$('#enableLargeControl').prop("checked", false);
				$('#enableLargeAccitem').prop("checked", false);
				$('#balanceControlMoney').val('');
				$('#balanceControlMode').getObj().val('');
				$('#largeControlMoney').val('');
				$('#largeControlMode').getObj().val('');
				ufma.comboxInit('accoType');
			},
			getAcco: function (textValue) {
				if (textValue.length > 1) {
					page.acceCode = textValue.substr(0, 1);
				} else {
					page.acceCode = textValue;
				}
				ufma.get('/ma/sys/coaAcc/queryAcce', {
					"accsCode": page.accsCode,
					"acceCode": page.acceCode
				}, function (result) {
					var balDir = 0;
					if (result.data.length > 0) {
						page.acceName = result.data[0].chrName;
						page.accaCode = result.data[0].accaCode;
						$('#editAcceName').text(page.acceName);

						//确定余额方向
						if (result.data[0].balDir == -1) {
							balDir = 1;
						}
					} else {
						$('#editAcceName').text("");
					}
					//根据会计要素的方向确定会计科目的方向
					$("#balDir").find("label").eq(balDir).addClass("active").siblings("label").removeClass("active");
					$("#balDir").find("label").eq(balDir).find("input").prop("checked", true);
					$("#balDir").find("label").eq(balDir).siblings("label").find("input").prop("checked", false);

				});
			},
			//新增科目时，获取上级科目基本信息，并自动填充上级科目信息
			atuoSetParentInfor: function (aInputParentCode) {
				var arguObj = page.initGetArgu();
				arguObj.chrCode = aInputParentCode.join();
				ufma.get(interfaceURL.queryAccoTable, arguObj, function (result) {
					if (result.data.accoList.length > 0) {
						//余额方向
						var accBal = result.data.accoList[0].accBal;
						if (accBal == 1) {
							$("#balDir").find("label").eq(0).addClass("active").siblings("label").removeClass("active");
						} else {
							$("#balDir").find("label").eq(1).addClass("active").siblings("label").removeClass("active");
						}
						//单位修改属性
						var isChangeAttr = result.data.accoList[0].isChangeAttr;
						if (isChangeAttr == "1") {
							$("label[name='isChangeAttr']").eq(0).addClass("active").siblings("label").removeClass("active");
						} else {
							$("label[name='isChangeAttr']").eq(1).addClass("active").siblings("label").removeClass("active");
						}
						//单位修改名称
						var allowChangeName = result.data.accoList[0].allowChangeName;
						if (allowChangeName == "1") {
							$("label[name='allowChangeName']").eq(0).addClass("active").siblings("label").removeClass("active");
						} else {
							$("label[name='allowChangeName']").eq(1).addClass("active").siblings("label").removeClass("active");
						}
						//启用状态
						var enabled = result.data.accoList[0].enabled;
						if (enabled == "1") {
							$("label[name='enabled']").eq(0).addClass("active").siblings("label").removeClass("active");
						} else {
							$("label[name='enabled']").eq(1).addClass("active").siblings("label").removeClass("active");
						}
						//允许增加下级
						var allowAddsub = result.data.accoList[0].allowAddsub;
						if (allowAddsub == "1") {
							$("label[name='allowAddsub']").eq(0).addClass("active").siblings("label").removeClass("active");
						} else {
							$("label[name='allowAddsub']").eq(1).addClass("active").siblings("label").removeClass("active");
						}
						//科目类型
						var accoType = result.data.accoList[0].accoType;
						// $("#accoType").val(accoType);
						ufma['accoType'].val(accoType).trigger("change");
						//适用单位
						if (result.data.accoList[0].agencyCode != '*') {
							var agencyTypeCode = result.data.accoList[0].agencyTypeCode.split(",");
							$("#agencyTypeCode").select2({
								language: "zh-CN",
								tokenSeparators: [',', ' ']
							}).val(agencyTypeCode).trigger('change');
						}
					}
				});
			},
			//根据勾选启用辅助项，设置控制类列数据
			initMoneyData: function () {
				if ($('.assistCheckGroup').find('.datatable-group-checkable:checked').length == 2) {
					page.moneyAssTypeData = [{
						chrId: '001',
						id: '01',
						code: '01',
						codeName: '全部',
						isLeaf: 1,
						name: "全部",
						pCode: "1",
						pId: "1",
					}, {
						chrId: '002',
						id: '02',
						code: '02',
						codeName: '余额',
						isLeaf: 1,
						name: "余额",
						pCode: "1",
						pId: "1",
					}, {
						chrId: '003',
						id: '03',
						code: '03',
						codeName: '大额',
						isLeaf: 1,
						name: "大额",
						pCode: "1",
						pId: "1",
					}];
					$('#enableBalanceAccitem,#enableLargeAccitem').prop('checked', 'checked');
				} else if ($('.assistCheckGroup').find('.datatable-group-checkable:checked').length == 1) {
					if ($('#enableBalanceAccitem').is(":checked")) {
						page.moneyAssTypeData = [{
							chrId: '002',
							id: '02',
							code: '02',
							codeName: '余额',
							isLeaf: 1,
							name: "余额",
							pCode: "1",
							pId: "1",
						}];
						if ($('#moneyAssist tbody tr').length > 0) {
							$('#moneyAssist tbody tr').each(function () {
								var moneType = $(this).find('.moneTypeTree').find(".ufma-combox-value").val();
								if (moneType != '02') { //如果控制类已选值不属于下拉框的值，则清空
									$(this).find('.moneTypeTree').ufmaCombox().setValue('', '');
								}
							});
						}
						$('#enableBalanceAccitem').prop('checked', 'checked');
						$('#enableLargeAccitem').removeAttr('checked');
					} else if ($('#enableLargeAccitem').is(":checked")) {
						page.moneyAssTypeData = [{
							chrId: '003',
							id: '03',
							code: '03',
							codeName: '大额',
							isLeaf: 1,
							name: "大额",
							pCode: "1",
							pId: "1",
						}];
						if ($('#moneyAssist tbody tr').length > 0) {
							$('#moneyAssist tbody tr').each(function () {
								var moneType = $(this).find('.moneTypeTree').find(".ufma-combox-value").val();
								if (moneType != '03') { //如果控制类已选值不属于下拉框的值，则清空
									$(this).find('.moneTypeTree').ufmaCombox().setValue('', '');
								}
							});
						}
						$('#enableLargeAccitem').prop('checked', 'checked');
						$('#enableBalanceAccitem').removeAttr('checked');
					}
				}
			},
			//金额启用辅助项数据序列化
			serializeMoneyAssist: function () {
				var aKJYS = [];
				var irow = 0;
				$('#moneyAssist tbody tr').each(function (idx) {
					var tmpYS = {};
					irow = irow + 1;
					tmpYS.ordSeq = irow; //金额启用辅助项行序号
					//tmpYS.controlType = $(this).find('.moneTypeTree').find(".ufma-combox-value").val(); //金额启用辅助项树数据
					tmpYS.controlType = '01'; //只有余额需要表格
					tmpYS.accitemCode = $(this).find('.moneyAssTree').find(".ufma-combox-value").val(); //金额启用辅助项控制类code
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},
			onEventListener: function () {
				$(document).on("blur", "#chrName", function () {
					if (page.action == 'addSub' && !page.clickBlur) {
						page.accItemsTableEdit2(page.curData);
						$("#coaAccAssistBtnGroup").addClass("hidden");
						page.clickBlur = true;
					}
				});

				//保存迁移下级数据
				$('#coaAccEdit').on('click', 'button', function (e) {
					switch ($(this).attr('item')) {
						case '1':
							var arguObj2 = JSON.parse($(this).attr('data'))
							var newArguObj = {
								"acctCode": arguObj2.acctCode,
								"agencyCode": arguObj2.agencyCode,
								"accsCode": page.accsCode,
								"setYear": arguObj2.setYear + "",
								"rgCode": arguObj2.rgCode,
								"eleCode": "ACCO",
								"oldChrCode": arguObj2.chrCode.substring(0, arguObj2.chrCode.length - 2),
								"newChrCode": $('.coaAccMoveText').eq(0).val(),
								"newChrName": $('.coaAccMoveText').eq(1).val()
							}
							if ($('.coaAccMoveText').eq(0).val()) {
								if ($('.coaAccMoveText').eq(1).val()) {
									ufma.post('/ma/sys/coaAcc/transferAcco', newArguObj, function (result) {
										ufma.showTip('保存成功！', function () {
											ufma.hideloading();
											//page.lastVer = result.data.lastVer;
											//关闭页面的回传数据
											page.resultData = newArguObj;
											$('.coaAccMoveBox').remove()
											$('.mask').remove()
											parent.document.getElementsByClassName('u-msg-title')[0].removeChild(parent.document.getElementsByClassName('mask')[0])
										}, 'success');
									});
								} else {
									ufma.showTip('科目名称不能为空！', function () { }, 'warning');
								}
							} else {
								ufma.showTip('科目编码不能为空！', function () { }, 'warning');
							}

							break;
						case '2':
							document.getElementsByClassName('coaAccMoveBox')[0].style.width = "476px"
							document.getElementById('coaAccMove').style.paddingTop = "0"
							document.getElementsByClassName('coaAccMoveBox')[0].style.height = "316px"
							document.getElementsByClassName('coaAccMoveBox')[0].style.marginLeft = "-238px"
							document.getElementsByClassName('coaAccMoveBox')[0].style.marginTop = "-173px"
							var arguObj1 = JSON.parse($(this).attr('data'));
							var newArguobj = $(this).attr('data');
							var newCont = "<p id='coaAccMoveTitl'>设置会计科目<span id='coaAccMoveClose'>x</span></p><p class='coacctitle'>当前科目（" + arguObj1.chrCode.substring(0, arguObj1.chrCode.length - 2) + "）业务数据迁移到：</p><p class='coaccipt'><span>科目代码：</span><input type='text' class='coaAccMoveText'></p><p class='coaccipt'><span>科目名称：</span><input type='text' class='coaAccMoveText'></p><p class='coaccbtn'><button class='btn btn-default btn-cancel' item='3'>取消</button><button class='btn btn-sm btn-primary' id='coaAccMoveContentSave' item='1' data='" + newArguobj + "'>保存</button></p>";
							$('#coaAccMove').html(newCont)
							$('#coaAccMoveClose').on('click', function () {
								$('.coaAccMoveBox').remove()
								$('.mask').remove()
								parent.document.getElementsByClassName('u-msg-title')[0].removeChild(parent.document.getElementsByClassName('mask')[0])

							})
							break;
						case '3':
							$('.coaAccMoveBox').remove()
							$('.mask').remove();
							ufma.hideloading();
							parent.document.getElementsByClassName('u-msg-title')[0].removeChild(parent.document.getElementsByClassName('mask')[0])
							break;
						default:
							break;
					}
				})

				//增加下级时，若chrCode为disabled，则不校验编码规则
				if ($('#chrCode').attr("disabled") == "disabled") {
					ma.isRuled = true;
				}

				//编码验证--bug81136 【20190619 财务云8.0 广东省财政厅】单位100102，201账套是工会，新增会计科目，提示上级编码不存在

				ma.codeValidator('chrCode', '会计科目', '/ma/sys/common/findParentList?acctCode=' + page.acctCode + '&agencyCode=' + page.agencyCode + '&accsCode=' + page.accsCode + '&eleCode=ACCO', page.agencyCode, "", page.acctCode, page.accsCode, page.atuoSetParentInfor);
				// 名称验证
				ma.nameValidator('chrName', '会计科目');

				$('#btnCoaAccBaseEdit').on('click', function () {
					page.setBaseFormEdit(true);
				});
				$('#btnCoaAccNummoneyEdit').on('click', function () {
					page.editMode = 'edit';
					//page.editMode = 'editJB';
					page.setNummoneyFormEdit(true);
				});
				$('#btnCoaAccAssistEdit').on('click', function () {
					page.editMode = 'edit';
					// page.setAssistFormEdit(true);
					page.accItemsTableEdit(page.curData);
				});
				$('#btnCoaAccIllegalEdit').on('click', function () {
					page.editMode = 'edit';
					page.setIllegalFormEdit(true);
				});
				$('#btnCoaAccRemarkEdit').on('click', function () {
					page.editMode = 'edit';
					page.setRemarkFormEdit(true)
				});
				$('#btnAmtCtrlEdit').on('click', function () {
					page.editMode = 'edit';
					page.setAmtCtrlFormEdit(true)
				});
				//基本信息局部按钮
				$('#coaAccBaseBtnGroup .btn-save').on("click", function () {
					page.saveBaseInfo('form-mainInfoTab', "0");

				});
				$('#coaAccBaseBtnGroup .btn-cancel').on('click', function () {
					$("#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab").setForm(page.curData);
					// CWYXM-18769 设置会计科目界面，修改适用单位（添加或删除）后点击【取消】按钮，界面显示的适用单位为修改后的 guohx 20200827
					page.initEditPage(page.curData);
					page.setBaseFormEdit(false);
				});
				$('#coaAccNummoneyBtnGroup .btn-save').on('click', function () {
					page.saveAreaFlag = 'money';
					page.isCanUpdateUsedAcco();

				});
				$('#coaAccNummoneyBtnGroup .btn-cancel').on('click', function () {
					page.edit = 'edit';
					page.setNummoneyFormEdit(false);
				});
				//辅助项单独保存
				$('#coaAccAssistBtnGroup .btn-save').on('click', function () {
					// page.saveAssistInfo();
					page.saveAreaFlag = 'assist';
					page.isCanUpdateUsedAcco()
				});
				$('#coaAccAssistBtnGroup .btn-cancel').on('click', function () {
					page.getCurData();
					page.initAssistTable(page.curData);
					page.setAssistFormEdit(false);
				});
				$('#coaAccAddAssist').on('click', function () {
					page.newAssistTable();
				});
				$('#coaAccIllegalBtnGroup .btn-save').on('click', function () {
					page.saveIllegalInfo();
				});
				$('#coaAccIllegalBtnGroup .btn-cancel').on('click', function () {
					page.setIllegalFormEdit(false);
				});
				$('#coaAccAddIllegal').on('click', function () {
					page.newIllegalTable();
				});
				//新增金额启用辅助项表格行
				$('#moneyAssistAdd').on('click', function () {
					page.initMoneyData();
					page.initMoneyAssist();
				});
				//勾选金额启用辅助项
				//CWYXM-9941 科目余额控制-启用辅助项控制，修改时，辅助项新增行按钮不见了--zsj
				$('#enableBalanceAccitem').on('click', function () { //只有余额需要
					var assistArry = [];
					if (page.editMode != 'edit') {
						assistArry = page.serializeAssist();
					} else {
						assistArry = page.eleAssAccoItems;
					}
					if (assistArry.length > 0 && !$.isNull(assistArry[0].accitemCode)) {
						if (!$('#enableBalanceAccitem').is(":checked")) {
							$('#moneyAssistAdd').addClass('hide');
							$('#moneyAssist tbody').html('');
						} else {
							//只有余额启用时才需要辅助项
							if ($('#enableBalanceAccitem').is(":checked")) {
								$('#moneyAssistAdd').removeClass('hide');
							}
							page.initMoneyData();
						}
					} else {
						ufma.showTip('请先新增该科目的辅助核算', function () { }, 'warning');
						return false;
					}
				});
				$('#enableLargeAccitem').on('click', function () { //现在大额也需要了
					var assistArry = [];
					if (page.editMode != 'edit') {
						assistArry = page.serializeAssist();
					} else {
						assistArry = page.eleAssAccoItems;
					}
					if (assistArry.length > 0 && !$.isNull(assistArry[0].accitemCode)) { } else {
						ufma.showTip('请先新增该科目的辅助核算', function () { }, 'warning');
						return false;
					}
				});
				$('#enableBalanceControl,#enableLargeControl').on('click', function () {
					if ($('#enableBalanceControl').is(":checked")) {
						$('#balanceControlMoney').removeAttr('disabled');
						$('#balanceControlMode').removeClass('uf-combox-disabled');
					} else {
						$('#balanceControlMoney').attr('disabled', true);
						$('#balanceControlMoney').val('');
						$('#balanceControlMode').getObj().val('');
						$('#balanceControlMode').addClass('uf-combox-disabled');
					}
					if ($('#enableLargeControl').is(":checked")) {
						$('#largeControlMoney').removeAttr('disabled');
						$('#largeControlMode').removeClass('uf-combox-disabled');
					} else {
						$('#largeControlMoney').attr('disabled', true);
						$('#largeControlMode').addClass('uf-combox-disabled');
						$('#largeControlMoney').val('');
						$('#largeControlMode').getObj().val('');
					}
					if ($('.moneyCheckGroup').find('.datatable-group-checkable:checked').length == 0) {
						$('#enableLargeAccitem,#enableBalanceAccitem').attr('disabled', true);
						$('#enableLargeAccitem,#enableBalanceAccitem').removeAttr('checked');
						$('#moneyAssistAdd').addClass('hide');
						$('#moneyAssist tbody').html('');
					} else if (($('.moneyCheckGroup').find('.datatable-group-checkable:checked').length == 1)) {
						if ($('#enableBalanceControl').is(":checked")) {
							$('#enableBalanceAccitem').removeAttr('disabled');
							$('#enableLargeAccitem').attr('disabled', true);
							$('#enableLargeAccitem').removeAttr('checked');
						} else if ($('#enableLargeControl').is(":checked")) {
							$('#enableLargeAccitem').removeAttr('disabled');
							$('#enableBalanceAccitem').attr('disabled', true);
							$('#enableBalanceAccitem').removeAttr('checked');
						}
					} else if ($('.moneyCheckGroup').find('.datatable-group-checkable:checked').length == 2) {
						$('#enableLargeAccitem,#enableBalanceAccitem').removeAttr('disabled');
					}
				});

				$('#coaAccRemarkBtnGroup .btn-save').on('click', function () {
					page.saveBaseInfo('form-remarkInfoTab');
					page.setRemarkFormEdit(false);
				});
				$('#coaAccRemarkBtnGroup .btn-cancel').on('click', function () {
					page.setRemarkFormEdit(false);
				});
				$('#amtCtrlBtngrp .btn-save').on('click', function () {
					page.saveAMTCtrl();
				});
				$('#amtCtrlBtngrp .btn-cancel').on('click', function () {
					page.initAmtCtrl(page.useLabelData);
					//	page.initMoneyAssistLable(page.useLabelData);
					page.setAmtCtrlFormEdit(false);
				});
				//保存并新增
				$('#coaAccSaveAddAll').on('click', function () {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveAll(true);
				});

				//保存
				$('#coaAccSaveAll').on('click', function () {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveAll(false);
				});

				//取消
				$('#coaAccCancelAll').on('click', function () {
					var formMainInfoTab = $('#form-mainInfoTab').serializeObject();
					if (!ufma.jsonContained(page.formdata, formMainInfoTab)) {
						ufma.confirm('您修改了' + page.getPageName(page.tableParam).title + '，关闭前是否保存？', function (action) {
							if (action) {
								page.save(false);
							} else {
								ma.nameTip = null;
								page.editor.close();
							}
						}, {
							type: 'warning'
						});

					} else {
						_close("actionCancel");
					}

				});

				//左侧树滑出
				$('.coaAcc-shopping-trolley').on('click', function (e) {
					e.stopPropagation();
					var $this = $(this);
					var $shop = $($(this).attr('data-target'));

					if ($shop.attr('slidout') == 'true') return false;
					$shop.attr('slidout', 'true')
					$shop.animate({
						'left': '0px'
					}, 300, function () {
						$shop.attr('slidout', 'false');
					});

				});

				//左侧树关闭
				$(document).on('click', function (e) {
					if ($(e.target).closest(".coaAcc-shopp").length == 0) {
						$('#coaAcc-shopp').animate({
							'left': '-250px'
						}, 300);
					}
				});
				//根据输入编码的第一个code，判断显示会计要素
				$('#chrCode').on('blur', function (e) {
					e.stopPropagation();
					var textValue = $(this).val();
					page.getAcco(textValue);

				});

				//外币核算
				$('#isCur').on('click', function (e) {
					if ($(this).find('label').hasClass('active')) {
						if ($('#defCurCode').attr('disabled') == 'disabled') {
							$('#defCurCode').attr('disabled', false);
						} else {
							$('#defCurCode').attr('disabled', true);
						}
					}
				});
				$('.curActive').on('click', function (e) {
					$('#mrbz').removeClass('hidden');
				});
				$('.curStop').on('click', function (e) {
					$('#mrbz').addClass('hidden');
				})

				//数量核算
				$('#isQty').on('click', function (e) {
					if ($(e.target).find('input[name="isQty"]').val() == '1') {
						$('#qtyUom').attr('disabled', false);
						$('#wbhs').removeClass('hidden');
						$('#xsws').removeClass('hidden');
						$('#qtyUom').removeClass('hidden');
						//启用时判断
						$('.coaAcc-num-reduce').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						$('#qtyDigits').attr('disabled', false);
						$('.coaAcc-num-add').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");

						if ($('.coaAcc-num-val').val() == 0) {
							$('.coaAcc-num-reduce').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if ($('.coaAcc-num-val').val() == 6) {
							$('.coaAcc-num-add').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						}
					} else {
						//停用的时候直接所有都disabled
						$('#qtyUom').attr('disabled', true);
						$('#wbhs').addClass('hidden');
						$('#xsws').addClass('hidden');

						$('.coaAcc-num-reduce').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						$('#qtyDigits').attr('disabled', true);
						$('.coaAcc-num-add').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
					}
				});

				//加减小数点位数
				$(".coaAcc-num-reduce").on("click", function () {
					if ($(this).hasClass("coaAcc-num-action")) {
						var num = $(this).siblings(".coaAcc-num-val").val();
						num = parseInt(parseInt(num) - 1);
						$(this).siblings(".coaAcc-num-val").val(num);
						if (num == 0) {
							$(this).removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if (num <= 5) {
							$(this).siblings(".coaAcc-num-add").removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						}
					}
				});
				$(".coaAcc-num-add").on("click", function () {
					if ($(this).hasClass("coaAcc-num-action")) {
						var num = $(this).siblings(".coaAcc-num-val").val();

						num = parseInt($.isNull(num) ? 0 : num) + 1;
						$(this).siblings(".coaAcc-num-val").val(num);
						if (num == 6) {
							$(this).removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if (num >= 1) {
							$(this).siblings(".coaAcc-num-reduce").removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						}
					}
				});

			},

			//初始化编码规则和控制方式
			initfifa: function () {
				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: 'ACCO',
					agencyCode: page.agencyCode,
					rgCode: page.rgCode,
					setYear: page.setYear,
					accsCode: page.accsCode
				});
				page.fjfa = ma.ruleData.codeRule;
				ma.fjfa = page.fjfa;
				page.ctrlLevel = ma.ruleData.isAddFirst;
				$('#editAccsName').text(page.accsName);
				$('#editAccoRule').text(page.fjfa);
				if (page.ctrlLevel == '1') {
					$('#ctrlLvelName').text("此内容可增加一级，下级可细化");
				} else if (page.ctrlLevel == '0') {
					$('#ctrlLvelName').text("此内容不可增加一级，下级可细化");
				} else {
					$('#ctrlLvelName').text("此内容下级可细化");
				}
			},

			//显示会计要素名称
			getAcce: function () {
				ufma.get('/ma/sys/coaAcc/queryAcce', {
					"accsCode": page.accsCode,
					"acceCode": page.acceCode
				}, function (result) {
					if (result.data.length > 0) {
						page.acceName = result.data[0].chrName;
						$('#editAcceName').text(page.acceName);
					} else {
						$('#editAcceName').text("");
					}
				});
			},

			//凭证录入页面调用只传帐套，需获取科目体系
			getAccsCode: function () {
				ufma.ajaxDef('/ma/sys/eleCoacc/getAccsByAcctCode', 'get', {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				}, function (result) {
					if (result.data.length > 0) {
						page.accsCode = result.data[0].chrCode;
					}
				});
			},

			initParamData: function (data) {
				page.action = data.action; //add edit addSub
				page.flag = data.flag; //flag=1为外部调用编辑页
				page.rgCode = data.rgCode;
				page.setYear = parseInt(data.setYear);
				page.agencyCode = data.agencyCode;
				page.acctCode = data.acctCode;
				page.accsCode = data.accsCode;
				page.accsName = data.accsName;
				page.chrCode = data.chrCode;
				page.chrId = data.chrId;
				page.agencyTypeCode = data.agencyTypeCode;
				//根据帐套代码获取科目体系，凭证录入页面没有科目体系只有帐套
				if (data.accsCode == "" || data.accsCode == undefined) {
					page.getAccsCode();
				} else {
					page.accsCode = data.accsCode;
				}
				if (page.agencyCode != "*" && data.action != "edit") {
					setTimeout(function () {
						aTCodeSel = [];
						$('#agencyTypeCode').val(page.agencyTypeCode);
						aTCodeSel.push(page.agencyTypeCode);
					}, 500);
				}

				//获取编码规则
				page.initfifa();
				if (page.action == "edit") {
					//为修改时
					page.acceCode = data.acceCode;
					page.accaCode = data.accaCode;
					page.getAcce();
					//当为edit的时候获取chrCode详情数据
					page.getCurData();
				} else if (page.action == "addSub") {
					//增加下级
					page.acceCode = page.chrCode.substr(0, 1);
					page.getAcce();
					//获取上级科目具体数据
					page.getSupData();
				}
			},

			initGetArgu: function () {
				var argu = {};
				argu["rgCode"] = page.rgCode;
				argu["setYear"] = page.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.accsCode;
				argu["chrCode"] = page.chrCode;
				return argu;
			},
			//增加下级时，获取上级科目辅助项
			getSupData: function () {
				var arguObj = page.initGetArgu();
				if (page.action == 'addSub') {
					arguObj.chrCode = window.ownerData.supChrCode;
				}
				ufma.get(interfaceURL.queryAccoTable, arguObj, function (result) {
					page.curData = result.data.accoList[0];
				});

			},
			//获取编辑界面弹窗数据
			getCurData: function () {
				//根据chrCode获取数据
				ufma.ajaxDef(interfaceURL.queryAccoTable, "get", page.initGetArgu(), function (result) {
					if (!$.isNull(result.data.accoList) && result.data.accoList.length > 0) {
						page.curData = result.data.accoList[0];
						page.initAmtCtrl(page.curData); //CWYXM-9761 科目金额控制，维护辅助项后保存显示成功，但是前台未加载--zsj
						page.useLabelData = result.data.accoList[0];
						page.eleAssAccoItems = page.curData.eleAccoItems;
						page.eleMoneyAccoItems = page.curData.moneyCtrls;
						page.TreeData = result.data.accoList[0];
						editagencyTypeCode = page.curData.agencyTypeCode
						page.curData["action"] = "edit";
						page.formdata = result;
						accisLeaf = page.curData.isLeaf;
						page.lastVer = page.curData.lastVer;
						//bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
						page.rowpreData = [];
						page.rowpreData = result.data.accoList[0].eleAccoItems;
					}
				});
			},
			//金额控制方式树
			initBalanceCtrl: function () {
				ufma.ajaxDef('/ma/pub/enumerate/MA_ACCO_BALANCE_CONTROL_MODE', 'get', '', function (result) {
					var opts = {
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						readonly: true,
						data: result.data
					}
					$('#balanceControlMode').ufCombox(opts);
					$('#largeControlMode').ufCombox(opts);
				})
			},
			//判断系统选项是否勾选“已使用科目允许修改辅助核算”
			getSysRgparaValueByChrCode: function () {
				var argu = {
					rgCode: window.ownerData.rgCode,
					setYear: window.ownerData.setYear,
					agencyCode: window.ownerData.agencyCode
				};
				ufma.get("/ma/sysrgpara/getSysRgparaValueByChrCode/GL025", argu, function (result) {
					page.sysParam = result.data;
				});
			},
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.rgCode = window.ownerData.rgCode;
				page.setYear = window.ownerData.setYear;
				page.AccItemTypeList = [];
				page.eleAssAccoItems = [];
				page.eleMoneyAccoItems = [];
				page.initBalanceCtrl();
				page.getComAccItemTypeList();
				//CWYXM-9762 --科目金额控制，维护金额超过3位，保存后查看，金额千分位--zsj
				$('#balanceControlMoney,#largeControlMoney').amtInputNull();
				//请求辅助核算项列表
				page.initParamData(window.ownerData);
				page.TreeData = '';
				page.clickTree = false;
				page.closeData = false;
				page.initTree();
				page.initEditPage(page.action == 'edit' ? page.curData : window.ownerData);
				page.onEventListener();
				if (window.ownerData.agencyCode != "*") {
					ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTable", "get", page.initGetArgu(), function (result) {
						if (result) {
							if (result.data.accoList.length > 0) {
								var editFlag = result.data.accoList[0].isChangeAttr;
								if (editFlag == "0") {
									$(".coaAcc-edit").hide();
								}
								accisLeaf = result.data.accoList[0].isLeaf
							}
							page.formdata = result;
						}
					});
					$('label[name="allowChangeName"]').attr('disabled', 'disabled');
					$('label[name="isChangeAttr"]').attr('disabled', 'disabled');

				}
				//非平行记账差异项登记不能勾选
				if (window.ownerData.isParallel != "1") {
					$("#allowSurplus").prop({
						"checked": false,
						"disabled": true
					});
				}
				//新增页中的增加下级带入上级科目的基本信息
				if (page.action == 'addSub') {
					$('#chrCode').trigger("blur");
				}

				if (page.action == 'edit') {
					ma.isEdit = true;
				}
				ufma.parse();
			}
		}
	}();

	page.init();
});
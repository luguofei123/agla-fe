$(function() {
	if(window.ownerData.diffAgencyType == "0") {
		$(".diffAgency").remove();
		$(".kemulx").css("margin-left", "0");
	}
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var interfaceURL = {
		queryAccoTable: "/ma/sys/coaAcc/queryAccoTable" //获取科目具体数据
	};
	var aTCodeSel = []
	var editagencyTypeCode;
	var accisLeaf;
	var page = function() {
		return {
			lastVer: 0,
			//初始化树
			initTree: function() {
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
						}
					},
					callback: {
						onClick: zTreeOnClick
					}
				};

				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				if(page.acctCode == "" || page.acctCode == undefined) {
					page.acctCode = "*"
				}
				argu["eleCode"] = 'ACCO';
				argu["accsCode"] = page.accsCode;
				ufma.get("/ma/sys/common/getEleTree", argu, function(result) {
					if(result.data && result.data.length > 0) {
						result.data[0].name = '全部'
						var zNodes = result.data;
						$.fn.zTree.init($("#leftTree"), setting, zNodes);
					}

				});

				function zTreeOnClick(event, treeId, treeNode) {
					//if(!treeNode.isParent) {

					var Zdata = window.ownerData.list.accoList

					function initForm(acco) {
						page.curData = acco;
						page.curData.action = 'edit';
						page.initParamData(acco)
						page.initEditPage(acco);
						page.setBaseFormEdit(false);
						$('label[for="chrCode"]').text(acco.chrCode);
						$('label[for="chrName"]').text(acco.chrName);
					}
					for(var i = 0; i < Zdata.length; i++) {
						if(Zdata[i].chrCode == treeNode.id) {
							initForm(Zdata[i]);
							break;
						}
					}

					//}
				};
				//树搜索
				var coaAccSearchKey;
				$(document).ready(function() {
					coaAccSearchKey = $("#coaAccSearchKey");
					coaAccSearchKey.bind("focus", focusKey).bind("blur", blurKey)
						.bind("propertychange", searchNode).bind("input", searchNode);
				});

				function focusKey(e) {
					if(coaAccSearchKey.hasClass("empty")) {
						coaAccSearchKey.removeClass("empty");
					}
				}

				function blurKey(e) {
					if(coaAccSearchKey.get(0).value === "") {
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
					if(coaAccSearchKey.hasClass("empty")) {
						value = "";
					}
					if(lastValue === value) return;
					lastValue = value;
					if(value === "") return;
					updateNodes(false);
					nodeList = zTree.getNodesByParamFuzzy(keyType, value);
					updateNodes(true);
				}

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.getZTreeObj("leftTree");
					for(var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}

				function getFontCss(treeId, treeNode) {
					return(!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
						color: "#333",
						"font-weight": "normal"
					};
				}
			},

			//初始化枚举
			initEnum: function() {
				//				if(window.ownerData.coaccagyAgency == true || window.ownerData.coaccagyAgency == undefined) {
				//					ufma.ajaxDef('/ma/pub/enumerate/AGENCY_TYPE_CODE', 'get', '', function(data) {
				//						var opt = '';
				//						for(var i = 0; i < data.data.length; i++) {
				//							opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
				//						}
				//						$("#agencyTypeCode").html(opt)
				//						$("#agencyTypeCode").attr('disabled', true)
				//					})
				//				} else 
				//				if(window.ownerData.coaccagyAgency == false && window.ownerData.diffAgencyType=='1') {
				ufma.ajaxDef('/ma/pub/enumerate/AGENCY_TYPE_CODE', 'get', '', function(data) {
					var opt = '';
					for(var i = 0; i < data.data.length; i++) {
						if(i == 0) {
							opt += '<option selected="selected" value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
						} else {
							opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
						}
					}
					var codestr;
					if(window.ownerData.agencyTypeCode != null && window.ownerData.agencyTypeCode != undefined) {
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
					if(window.ownerData.agencyCode != "*" && (window.ownerData.accsCode == "" || window.ownerData.accsCode == undefined)) {
						$("#agencyTypeCode").prop('disabled', 'disabled')
					}
					//.val([data.data[0].ENU_CODE]).trigger('change');
					aTCodeSel = [data.data[0].ENU_CODE]
					$("#agencyTypeCode").on("select2:select", function() {
						var dataa = $(this).val()
						aTCodeSel = dataa
					})
				})
				//				}else{
				//					$("#agencyTypeCode").attr('disabled', true);
				//					$("#agencyTypeCode").html('')
				//				}
				ufma.comboxInit('accoType');
				//ufma.comboxInit('defCurCode', '/ma/sys/eleCurrRate/getCurrType?agencyCode=' + page.agencyCode);
				ufma.comboxInit('defCurCode', '/ma/sys/common/getEleTree?setYear=' + ma.setYear + '&rgCode=' + ma.rgCode + '&agencyCode=' + page.agencyCode + '&eleCode=CURRENCY');
			},

			setBtnShowHide: function(action) {
				if(action == 'edit') {
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
			initAssisCards: function() {
				var html = '';
				ufma.get('/ma/sys/coaAcc/getAccoItemUse', {}, function(result) {
					$.each(result.data, function(index, row) {
						if(index < 6) {
							if(index % 2 == 0) {
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

			initEditPage: function(curData) {
				page.initEnum();
				//page.initAssisCards();
				//若有数据，表示点击名称进入的详情页
				if(curData.action == 'edit') {
					page.lastVer = curData.lastVer;
					page.curData = curData;
					page.editMode = 'edit';
					page.setBtnShowHide(curData.action);
					page.initWindow(curData);
					$('#coaAccSaveAddAll').addClass('hide');
					$('#coaAccSaveAll').addClass('hide');
					if($.isNull(curData.chrFullname)) {
						curData.chrFullname = '';
					}
					ma.nameTip = curData.chrFullname.indexOf('/') == -1 ? '' : curData.chrFullname.replace('/' + curData.chrName, ''); //去掉本级，得到上级代码
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
					if(curData.action == 'edit' || curData.action == 'addSub') {
						$('#chrCode').val(curData.chrCode);
						ma.nameTip = curData.chrFullname;
						page.getAcco(curData.chrCode);
					}
				}

			},

			//枚举项显示
			initEnumData: function(curData) {
				//              ufma['agencyTypeCode'].val(curData.agencyTypeCode).trigger("change");
				//				if(window.ownerData.coaccagyAgency == true || window.ownerData.coaccagyAgency == undefined) {
				//					setTimeout(function() {
				//						for(var i = 0; i < $("#agencyTypeCode").find('option').length; i++) {
				//							if($("#agencyTypeCode").find('option').eq(i).attr('value') == editagencyTypeCode) {
				//								$("#agencyTypeCode").find('option').eq(i).attr("selected", true);
				//								$("#agencyTypeCode").next('label[for="agencyTypeCode"]').text($('#agencyTypeCode').find('option:selected').text());
				//							}
				//						}
				//					}, 100)
				//				} else {
				setTimeout(function() {
					$('#agencyTypeCode').parent('.control-element').find('.select2').removeClass('hide');
					$('#agencyTypeCode').removeClass('hide');
					var codestr;
					if(editagencyTypeCode != null && editagencyTypeCode != undefined) {
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
					if(window.ownerData.agencyCode != "*" && (window.ownerData.accsCode == "" || window.ownerData.accsCode == undefined)) {
						$("#agencyTypeCode").prop('disabled', 'disabled')
					}
					aTCodeSel = codestr
					$("#agencyTypeCode").on("select2:select", function() {
						var dataa = $(this).val()
						aTCodeSel = dataa
					})
					var codestrs = aTCodeSel
					var st = []
					if(codestrs != null && codestrs != undefined) {
						for(var k = 0; k < codestrs.length; k++) {
							for(var z = 0; z < $('#agencyTypeCode').find('option').length; z++) {
								if($('#agencyTypeCode').find('option').eq(z).attr('value') == codestrs[k]) {
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
			initExpireDate: function(curData) {
				/*if(curData.expireDate == '1') {
					$('#expireDate').attr("checked", "true");
				} else {
					$('#expireDate').removeAttr("checked");
				}*/
				/*if(curData.isShowBill == '1') {
					$('#isShowBill').attr("checked", "true");
				} else {
					$('#isShowBill').removeAttr("checked");
				}*/
				$('#expireDate').prop('checked', curData.expireDate == '1');
				$('#isShowBill').prop('checked', curData.isShowBill == '1');
				if(curData.isCheckRegister == '1') {
					$('#isCheckRegister').attr("checked", "true");
				} else {
					$('#isCheckRegister').removeAttr("checked");
				}
				if(curData.allowSurplus == '1') {
					$('#allowSurplus').attr("checked", "true");
				} else {
					$('#allowSurplus').removeAttr("checked");
				}
				//				if(curData.updateAllSonAccItems == '1') {
				//					$('#updateAllSonAccItems').attr("checked", "true");
				//				} else {
				//					$('#updateAllSonAccItems').removeAttr("checked");
				//				}
			},

			initWindow: function(curData) {

				page.initEnumData(curData);
				page.initExpireDate(curData);

				//基本信息、数量外卡、备注页卡上显示数据
				$("#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab").setForm(curData);
				//如果小数位数为空，则赋值为0
				if(curData.qtyDigits == null) {
					$('#qtyDigits').val(0);
				}
				page.setBaseFormEdit(false);
				page.setNummoneyFormEdit(false);
				page.initAssistTable(curData);
				page.initIlaccTable(curData);
				page.setRemarkFormEdit(false);
				page.initAmtCtrl(curData);
			},

			bubbleSort: function(arr) {
				var len = arr.length;
				for(var i = 0; i < len; i++) {
					for(var j = 0; j < len - 1 - i; j++) {
						if(arr[j].ordSeq > arr[j + 1].ordSeq) { //相邻元素两两对比
							var temp = arr[j + 1]; //元素交换
							arr[j + 1] = arr[j];
							arr[j] = temp;
						}
					}
				}
				return arr;
			},
			//增加下级自动显示上级科目辅助项
			initAssistTable2: function(curData) {
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				$.each(curData.eleAccoItems, function(index, row) {
					if(row) {
						row.index = index + 1;
						// page.newAssistTable(row);
						page.preAccItemTable(row);
					}
				});
			},
			//循环显示辅助核算行数据
			initAssistTable: function(curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				$.each(curData.eleAccoItems, function(index, row) {
					if(row) {
						row.index = index + 1;
						// page.newAssistTable(row);
						page.preAccItemTable(row);
					}
				});
				this.setAssistFormEdit(false);
			},
			//增加下级自动带出上级科目辅助项
			accItemsTableEdit2: function(curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				for(var i = 0; i < curData.eleAccoItems.length; i++) {
					delete curData.eleAccoItems[i].accitemId;
				}
				$.each(curData.eleAccoItems, function(index, row) {
					if(row) {
						row.index = index + 1;
						page.newAssistTable(row);
					}
				});
				this.setAssistFormEdit(true);
			},
			//点击辅助核算编辑按钮，渲染辅助项表格，并显示编辑状态
			accItemsTableEdit: function(curData) {
				page.initExpireDate(curData);
				$('#coaAccAssist tbody').html('');
				//curData.eleAccoItems按ordSeq升序
				page.bubbleSort(curData.eleAccoItems);
				$.each(curData.eleAccoItems, function(index, row) {
					if(row) {
						row.index = index + 1;
						page.newAssistTable(row);
					}
				});
				this.setAssistFormEdit(true);
			},
			//编辑页，预展示辅助项（即假的表格），点击编辑按钮才真正渲染辅助项表格
			preAccItemTable: function(rowData) {
				var $table = $('#coaAccAssist');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				if(rowData) {
					recNo = rowData.ordSeq;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="accitemId" value="">' +
					'<span class="recno">' + recNo + '</span>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemCodeClass" style="width:250px;"></div>' +
					'<label for="eleName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemDataClass" style="width:260px;"></div>' +
					'<label for="accitemName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline fzisShow" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isShow" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				if(rowData) {
					rowData.accitemType = 2;
					//详情页显示label值
					$row.find('label[for="eleName"]').html(rowData.eleName);
					// $row.find('label[for="eleName"]').siblings('.accitemCodeClass').ufmaCombox().setValue(rowData.accitemCode, rowData.eleName); //详情页直接给combox赋值
					$row.find('label[for="accitemName"]').html(rowData.accitemName);
					// var _combox = $row.find('label[for="accitemName"]').siblings('.accitemDataClass').ufmaTreecombox();
					// _combox.val(rowData.accitemValue); //给ufmaTreecombox赋值
					// $row.find('label[for="accitemName"]').html(_combox.getText());
					if(rowData.isShow == '1') {
						$row.find('input[name="isShow"]').attr('checked', true);
					} else {
						$row.find('input[name="isShow"]').removeAttr("checked");
					}
					$row.find('input[name="accitemId"]').val(rowData.accitemId);
				} else {
					page.setAssistGroupControl();
				}
			},
			initAmtCtrl: function(curData) {
				$('#frmAMTCtrl').setForm(curData);
				this.setAmtCtrlFormEdit(page.editMode != 'edit');
			},
			//循环显示非法对应科目行数据
			initIlaccTable: function(curData) {
				$('#coaAccIllegal tbody').html('');
				page.bubbleSort(curData.eleAccoIlaccs);
				$.each(curData.eleAccoIlaccs, function(index, row) {
					if(row) {
						row.index = index;
						page.newIllegalTable(row);
					}
				});
				this.setIllegalFormEdit(false);
			},

			//基本信息页卡
			setBaseFormEdit: function(enabled) {
				if(enabled) {
					$('#btnCoaAccBaseEdit').addClass('hide');
					$('#form-mainInfoTab .control-element .form-control').removeClass('hide');
					$('#form-mainInfoTab .control-element .control-label').addClass('hide');
					$('#form-mainInfoTab .control-element .btn-group').removeClass('hide');
					//枚举的下拉框显示
					$('#agencyTypeCode').parent('.control-element').find('.select2').removeClass('hide');
					$('#agencyTypeCode').removeClass('hide');
					$('#accoType').parent('.control-element').find('span.select2').removeClass('hide');
					if(page.editMode == 'edit') {
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

					//					if(window.ownerData.coaccagyAgency == true || window.ownerData.coaccagyAgency == undefined) {
					//						$('label[for="agencyTypeCode"]').text($('#agencyTypeCode').children('option:selected').text());
					//					} else {
					var codestrs = aTCodeSel
					var st = []
					if(codestrs != null && codestrs != undefined) {
						for(var k = 0; k < codestrs.length; k++) {
							for(var z = 0; z < $('#agencyTypeCode').find('option').length; z++) {
								if($('#agencyTypeCode').find('option').eq(z).attr('value') == codestrs[k]) {
									st.push($('#agencyTypeCode').find('option').eq(z).text())
								}
							}
						}
						$('label[for="agencyTypeCode"]').text(st.join());
					} else {
						$('label[for="agencyTypeCode"]').text('');
					}
					//					}

					$('label[for="accoType"]').text($('#accoType').children('option:selected').text());
					//将toggle上的值赋值到label上
					$('label[for="accBal"]').text($('label[for="accBal"]').parent().find('label.active').text());
					$('label[for="isChangeAttr"]').text($('label[for="isChangeAttr"]').parent().find('label.active').text());
					$('label[for="allowChangeName"]').text($('label[for="allowChangeName"]').parent().find('label.active').text());
					$('label[for="enabled"]').text($('label[for="enabled"]').parent().find('label.active').text());
					$('label[for="allowAddsub"]').text($('label[for="allowAddsub"]').parent().find('label.active').text());
					$('#agencyTypeCode').parents('.control-element').find('.select2').addClass('hide');
					$('#agencyTypeCode').addClass('hide');
					$('#accoType').parent('.control-element').find('span.select2').addClass('hide');
					$('#coaAccBaseBtnGroup').addClass('hide');
				}
				$('#form-mainInfoTab .control-element')[enabled ? 'removeClass' : 'addClass']('disabled');
			},

			//数量外币页卡
			setNummoneyFormEdit: function(enabled) {
				if(enabled) {
					$('#btnCoaAccNummoneyEdit').addClass('hide');
					$('#form-moneyInfoTab .control-element .form-control').removeClass('hide');
					$('#form-moneyInfoTab .control-element .control-label').addClass('hide');
					$('#form-moneyInfoTab .control-element .btn-group').removeClass('hide');
					//枚举的下拉框
					$('#defCurCode').parent('.control-element').find('span.select2').removeClass('hide');
					$('#form-moneyInfoTab .control-element .coaAcc-num-count').removeClass('hide');
					if(page.editMode == 'edit') {
						$('#coaAccNummoneyBtnGroup').removeClass('hide');
					} else {
						$('#coaAccNummoneyBtnGroup').addClass('hide');
					}
					var wb = $('label[for="isCur"]').parent().find('label.active input[name="isCur"]').val();
					if(wb == '1') {
						$('#defCurCode').attr('disabled', false);
						$('#mrbz').removeClass('hidden');
					} else {
						$('#defCurCode').attr('disabled', true);
						$('#mrbz').addClass('hidden');
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

					$('label[for="qtyUom"]').text($("#qtyUom").val());
					$('label[for="isCur"]').text($('label[for="isCur"]').parent().find('label.active').text());
					$('label[for="isQty"]').text($('label[for="isQty"]').parent().find('label.active').text());
					$('label[for="qtyDigits"]').text($("#qtyDigits").val());
					var wb = $('label[for="isCur"]').parent().find('label.active input[name="isCur"]').val();
					if(wb == '1') {
						$('#defCurCode').attr('disabled', false);
						$('#mrbz').removeClass('hidden');
					} else {
						$('#defCurCode').attr('disabled', true);
						$('#mrbz').addClass('hidden');
					}
					//将枚举值赋值到label上
					var select =
						$('label[for="defCurCode"]').text($('#defCurCode').children('option:selected').text() || '');
				}
			},

			//辅助核算项页卡
			setAssistFormEdit: function(enabled) {
				if(enabled) {
					//新增页、编辑页显示
					$('#btnCoaAccAssistEdit').addClass("hide");
					$('#coaAccAssist .control-element .form-combox').removeClass("hide");
					$('#coaAccAssist .control-element .form-control').removeClass("hide");
					$('#coaAccAssist .control-element .control-label').addClass("hide");
					$('#coaAccAssistBtnGroup').removeClass("hide");
					$('#coaAccAddAssist').removeClass("hide");

					$('#expireDate').attr("disabled", false);
					$('#isShowBill').attr("disabled", false);
					$('.isShow').attr("disabled", false);
					$('#isCheckRegister').attr("disabled", false);
					$('#allowSurplus').attr("disabled", false);
					$('#updateAllSonAccItems').attr("disabled", false);

					page.setAssistGroupControl();
				} else {
					//详情页展示
					$('#btnCoaAccAssistEdit').removeClass("hide");
					$('#coaAccAssist .control-element .form-combox').addClass("hide");
					$('#coaAccAssist .control-element .form-control').addClass("hide");
					$('#coaAccAssist .control-element .control-label').removeClass("hide");
					$('#coaAccAssistBtnGroup').addClass("hide");
					//移除新增按钮和操作列
					$('#coaAccAddAssist').addClass("hide");
					$('#coaAccAssist thead tr th.btnGroup').remove();
					$('#coaAccAssist tbody tr td.btnGroup').remove();

					//设置到期日和票据号的disabled
					$('#expireDate').attr("disabled", true);
					$('#isShowBill').attr("disabled", true);
					$('.isShow').attr("disabled", true);
					$('#isCheckRegister').attr("disabled", true);
					$('#allowSurplus').attr("disabled", true);
					$('#updateAllSonAccItems').attr("disabled", true);

					//取消时的操作
					$('#coaAccAssist tbody tr').each(function() {
						var $tr = $(this);
						$tr.removeClass("hide");
						if($tr.find('td label[for="eleName"]').text() == '') {
							$tr.remove();
						}
					});
				}
			},
			setAmtCtrlFormEdit: function(enabled) {
				$('#frmAMTCtrl')[enabled ? 'enable' : 'disable']();
				$('#amtCtrlBtngrp')[enabled && this.editMode == 'edit' ? 'removeClass' : 'addClass']('hide');
				$('#btnAmtCtrlEdit')[enabled ? 'addClass' : 'removeClass']('hide');
			},
			//非法对应科目页卡
			setIllegalFormEdit: function(enabled) {
				if(enabled) {
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
					$('#coaAccIllegal tbody tr').each(function() {
						var $tr = $(this);
						//把删除时隐藏的显示出来
						$tr.removeClass("hide");
						if($tr.find('td label[for="ilaccCode"]').text() == '') {
							$tr.remove();
						}
					});
				}
			},

			//备注页卡
			setRemarkFormEdit: function(enabled) {
				if(enabled) {
					$('#btnCoaAccRemarkEdit').addClass('hide');
					$('#form-remarkInfoTab .control-element .control-label').addClass('hide');
					$('#form-remarkInfoTab .control-element .form-control').removeClass('hide');
					if(page.editMode == 'edit') {
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

			setAssistGroupControl: function() {
				if($('#coaAccAssist thead tr th.btnGroup').length == 0) {
					$('#coaAccAssist thead tr').append('<th class="nowrap btnGroup" style="width:50px;min-width:50px;">操作</th>');
				}
				$('#coaAccAssist tbody tr').each(function() {
					var $tr = $(this);
					if($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function(e) {
							e.stopPropagation();
							//如果辅助核算项为空，直接删除不隐藏
							if($tr.find('[name="accitemId"]').val() == '') {
								$tr.remove();
							} else {
								$tr.addClass('hide');
							}
							page.adjAssitNo();
						});
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function(e) {
							var callback = function() {
								page.adjAssitNo();
							};
							$('#coaAccAssist').tableSort(callback);
						});
					}
				});
			},

			setIllegalGroupControl: function() {
				if($('#coaAccIllegal thead tr th.btnGroup').length == 0) {
					$('#coaAccIllegal thead tr').append('<th class="nowrap btnGroup" style="width: 40px;min-width: 40px;">操作</th>');
				}
				$('#coaAccIllegal tbody tr').each(function() {
					var $tr = $(this);
					if($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function(e) {
							e.stopPropagation();
							//如果非法对应科目代码为空，直接删除不隐藏
							if($tr.find('[name="ilaccCode"]').val() == '') {
								$tr.remove();
							} else {
								$tr.addClass('hide');
							}
							page.adjIlacNo();
						});
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function(e) {
							var callback = function() {
								page.adjIlacNo();
							};
							$('#coaAccIllegal').tableSort(callback);
						});
					}
				});
			},

			adjAssitNo: function() {
				var idx = 0;
				$('#coaAccAssist tbody tr').each(function() {
					if(!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
					}
				});
			},

			adjIlacNo: function() {
				var idx = 0;
				$('#coaAccIllegal tbody tr').each(function() {
					if(!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
						$(this).find('input[name="chrCode"]').val(idx);
					}
				});
			},

			//辅助核算数据行循环显示
			newAssistTable: function(rowData) {
				var $table = $('#coaAccAssist');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				if(rowData) {
					recNo = rowData.ordSeq;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="accitemId" value="">' +
					'<span class="recno">' + recNo + '</span>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemCodeClass" style="width:250px;"></div>' +
					'<label for="eleName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accitemDataClass" style="width:260px;"></div>' +
					'<label for="accitemName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td class="text-center">' +
					'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline fzisShow" style="top:4px;right:-3px;">' +
					'<input type="checkbox" class="datatable-group-checkable" checked name="isShow" value="1"/>' +
					'<span></span>' +
					'</label>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				//初始化辅助核算的combox的值
				page.initAssit($row);
				//去掉使用方式的选择，如果想恢复需要取svn上2018-05-16之前代码
				if(rowData) {
					// page.initAssitData(rowData.accitemCode, $row); //根据combox上的值，给ufmaTreecombox初始化
					rowData.accitemType = 2;
					//详情页显示label值
					$row.find('label[for="eleName"]').html(rowData.eleName);
					$row.find('label[for="eleName"]').siblings('.accitemCodeClass').ufmaCombox().setValue(rowData.accitemCode, rowData.eleName); //详情页直接给combox赋值

					var _combox = $row.find('label[for="accitemName"]').siblings('.accitemDataClass').ufmaTreecombox();
					_combox.val(rowData.accitemValue); //给ufmaTreecombox赋值
					$row.find('label[for="accitemName"]').html(_combox.getText());
					if(rowData.isShow == '1') {
						$row.find('input[name="isShow"]').attr('checked', true);
					} else {
						$row.find('input[name="isShow"]').removeAttr("checked");
					}
					$row.find('input[name="accitemId"]').val(rowData.accitemId);
				} else {
					page.setAssistGroupControl();
				}
			},

			//非法对应科目数据行循环显示
			newIllegalTable: function(rowData) {
				var $table = $('#coaAccIllegal');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				if(rowData) {
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
				if(rowData) {
					var drCrName;
					if(rowData.drCr == 1) {
						drCrName = '借';
					} else if(rowData.drCr == -1) {
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
			//请求辅助核算项列表
			getComAccItemTypeList: function() {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.ajaxDef('/ma/sys/accitem/select/' + window.ownerData.agencyCode, 'get', argu, function(result) {
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
			initAssit: function($tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.accitemCodeClass').each(function() {
						$(this).ufmaCombox({
							valueField: 'accItemCode',
							textField: 'accItemName',
							name: 'accItemCode',
							// data: data,
							data: page.AccItemTypeList,
							readOnly: true,
							onchange: function(node) {

								page.initAssitData(node.eleCode, $tr);

							}
						});
					})
				}
				buildCombox();
				// if(!$.isNull(data)) {
				// 	buildCombox();
				// } else {
				// 	var argu = {};
				// 	argu["rgCode"] = ma.rgCode;
				// 	argu["setYear"] = ma.setYear;
				// 	argu["agencyCode"] = page.agencyCode;
				// 	ufma.ajaxDef('/ma/sys/coaAcc/getComAccItemTypeList', 'get', argu, function(result) {
				// 		data = result.data;
				// 		data = data.sort(
				// 			function compareFunction(item1, item2) {
				// 				return item1.eleName.localeCompare(item2.eleName, "zh");
				// 			}
				// 		)
				// 		buildCombox();
				// 	});
				// }
			},

			//根据辅助核算项获取辅助核算项数据
			initAssitData: function(accItemCode, $tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.accitemDataClass').each(function() {
						$(this).ufmaTreecombox({
							valueField: 'id',
							textField: 'codeName', //显示出来的值
							name: 'accItemValue',
							data: data,
							readOnly: false
						});
					})
				}

				if(!$.isNull(data)) {
					buildCombox();
				} else {
					var argu = {};
					argu["rgCode"] = ma.rgCode;
					argu["setYear"] = ma.setYear;
					argu["agencyCode"] = page.agencyCode;
					argu["eleCode"] = accItemCode;
					ufma.ajaxDef('/ma/sys/common/getEleTree', 'get', argu, function(result) {
						data = result.data;
						buildCombox();
					});
				}
			},

			//初始化非法会计科目
			initIllegal: function($tr) {
				var cacheId = window.ownerData.agencyCode + window.ownerData.acctCode + '_accs';
				var data = ufma.getObjectCache(cacheId);

				function buildCombox() {
					$tr.find('.coaAccIlacc').each(function() {
						$(this).ufmaTreecombox({
							valueField: 'id',
							textField: 'codeName',
							name: 'ilaccCode',
							data: data,
							readOnly: false,
							onchange: function(node) {
								//带出该行科目名称
								$tr.find('input[name="ilaccName"]').val(node.name);
								$tr.find('.coaAccIlacc .ufma-combox-input').val(node.code);
							}
						});
					})
				}

				if(!$.isNull(data)) {
					buildCombox();
				} else {
					var argu = {};
					argu["rgCode"] = ma.rgCode;
					argu["setYear"] = ma.setYear;
					argu["agencyCode"] = page.agencyCode;
					argu["acctCode"] = page.acctCode;
					argu["eleCode"] = 'ACCO';
					argu["accsCode"] = page.accsCode;
					ufma.ajaxDef('/ma/sys/common/getEleTree', 'get', argu, function(result) {
						data = result.data;
						buildCombox();
					});
				}
			},

			//辅助核算数据序列化
			serializeAssist: function() {
				var aKJYS = [];
				var irow = 0;
				$('#form-assistInfoTab tbody tr').each(function(idx) {
					var tmpYS = {};
					// if ($(this).hasClass('hide')) {
					// 	tmpYS.isDeleted = 1;
					// } else {
					// 	tmpYS.isDeleted = 0;
					// 	
					// }
					if(!$(this).hasClass('hide')) {
						irow = irow + 1;
						tmpYS.accoCode = $('#form-mainInfoTab').find('[name="chrCode"]').val(); //当前会计科目code
						tmpYS.accitemId = $(this).find('[name="accitemId"]').val(); //辅助核算的行上的accitem_id
						tmpYS.ordSeq = irow; //辅助核算序号
						tmpYS.accitemCode = $(this).find('[name="accItemCode"]').val(); //辅助核算code
						tmpYS.accitemType == '2';
						tmpYS.accitemValue = $(this).find('[name="accItemValue"]').val(); //辅助核算code
						if($(this).find('[name="isShow"]').is(':checked')) {
							tmpYS.isShow = '1';
						} else {
							tmpYS.isShow = '0';
						}
						aKJYS.push(tmpYS);
					}
				});
				return aKJYS;
			},

			//非法对应科目数据序列化
			serializeIllegal: function() {
				var aKJYS = [];
				var irow = 0;
				$('#form-illegalInfoTab tbody tr').each(function(idx) {
					var tmpYS = {};
					if($(this).hasClass('hide')) {
						tmpYS.isDeleted = 1;
					} else {
						tmpYS.isDeleted = 0;
						irow = irow + 1;
					}
					tmpYS.chrCode = $('#form-mainInfoTab').find('[name="chrCode"]').val(); //当前会计科目code
					tmpYS.ilaccId = $(this).find('[name="ilaccId"]').val(); //非法对应科目行上的ilaccId
					tmpYS.ordSeq = irow; //非法对应科目行序号
					tmpYS.drCr = $(this).find('[name="drCr"]').children('option:selected').val(); //方向
					tmpYS.ilaccCode = $(this).find('[name="ilaccCode"]').val(); //非法对应科目编码code

					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},

			//保存基本信息、数量外币、备注
			saveBaseInfo: function(flag, type) {
				var argu = {};
				if(flag == 'form-mainInfoTab') {
					argu = $('#form-mainInfoTab').serializeObject();
					/*if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == false) {
						if(aTCodeSel != null) {
							argu.agencyTypeCode = aTCodeSel.join(',')
						} else {
							argu.agencyTypeCode = ''
						}
					} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == true) {
						argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
					} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == undefined) {
						argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
					}*/
					//					if(window.ownerData.coaccagyAgency == false) {
					if(aTCodeSel != null) {
						argu.agencyTypeCode = aTCodeSel.join(',')
					} else {
						argu.agencyTypeCode = ''
					}
					//					} else if(window.ownerData.coaccagyAgency == true) {
					//						argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
					//					} else if(window.ownerData.coaccagyAgency == undefined) {
					//						argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
					//					}
					if(window.ownerData.diffAgencyType == '0') {
						argu.agencyTypeCode = ''; //科目体系不控制适用单位
					}
					//全称
					if($("#chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
						argu["chrFullname"] = $("#chrName").val();
					} else {
						argu["chrFullname"] = ma.nameTip + "/" + $("#chrName").val();
					}
					argu.saveType = "2";
					// argu.eleAccoItems = [];
					// argu.isCur = -1;
				} else if(flag == 'form-moneyInfoTab') {
					argu = $('#form-moneyInfoTab').serializeObject();
					argu.saveType = "3";
					// argu.eleAccoItems = [];
				} else if(flag == 'form-remarkInfoTab') {
					argu = $('#form-remarkInfoTab').serializeObject();
					argu.saveType = "7";
				}
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;
				argu = page.initSaveArgu(argu);
				ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
					if(result.flag == 'success') {
						ufma.showTip('保存成功！', function() {
							//保证版本号+1
							//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
							page.setBaseFormEdit(false);
							page.lastVer = result.data.lastVer;
						}, 'success');
					} else {
						ufma.showTip(result.msg, function() {}, 'warning');
					}
				});
			},

			saveAssistInfo: function(again) {
				var argu = {};
				argu = page.findSingleArgu(argu);
				argu.eleAccoItems = page.serializeAssist();
				argu = page.initSaveArgu(argu);

				//判断辅助核算项是否为空
				var flag = true,
					idx = 0;
				//var assList = [];
				$.each(argu.eleAccoItems, function(index, row) {

					if(row.accitemCode == '') {
						flag = false;
						return false;
					}
					var distinctList = argu.eleAccoItems.select(function(el, i, res, param) {
						return el.isDeleted == 0 && el.accitemCode == row.accitemCode;
					});
					if(distinctList.length > 1) {
						idx = index;
						return false;
					}

					/*					if(assList.indexOf(row.accitemCode) == -1) {
											assList.push(row.accitemCode);
										} else if(assList.indexOf(row.accitemCode)>=0){
											assList.push(row.accitemCode);
										}else{
											idx = index;
											return false;
										}*/

				});
				if(idx > 0) {
					ufma.alert("第" + (idx + 1) + "行，辅助核算重复，请重新设置！", "warning");
					return false;
				}
				if($('#updateAllSonAccItems').is(':checked') != true && accisLeaf != 1) {
					ufma.confirm('是否勾选同步修改下级科目的辅助核算', function(action) {
						if(action) {
							argu["updateAllSonAccItems"] = 1
							if(!flag) {
								ufma.alert("辅助核算项不允许为空！", "warning");
							} else {
								if(again) {
									argu.confirmUpdateUsedAcco = "1";
								}
								argu.saveType = "4";
								ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
									if(page.sysParam == "0" && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
										ufma.showTip(result.msg, function() {}, "error");
									} else if(page.sysParam == "1" && result.accoIsUsed == true && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
										ufma.confirm('科目已使用，请确认是否修改？', function(action) {
											if(action) {
												//点击确定的回调函数
												page.saveAssistInfo(true);
											} else {
												//点击取消的回调函数
												$("#coaAccAssistBtnGroup .btn-cancel").trigger("click");
											}
										}, {
											type: 'warning'
										});
									} else {
										ufma.showTip(result.msg, function() {
											//重新获取辅助核算项数据，重绘表格
											page.getCurData();
											page.initAssistTable(page.curData);
											//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
											page.lastVer = result.data.lastVer;
										}, result.flag);
									}

								});
							}
						} else {
							if(!flag) {
								ufma.alert("辅助核算项不允许为空！", "warning");
							} else {
								if(again) {
									argu.confirmUpdateUsedAcco = "1";
								}
								argu.saveType = "4";
								ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
									if(page.sysParam == "0" && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
										ufma.showTip(result.msg, function() {}, "error");
									} else if(page.sysParam == "1" && result.accoIsUsed == true && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
										ufma.confirm('科目已使用，请确认是否修改？', function(action) {
											if(action) {
												//点击确定的回调函数
												page.saveAssistInfo(true);
											} else {
												//点击取消的回调函数
												$("#coaAccAssistBtnGroup .btn-cancel").trigger("click");
											}
										}, {
											type: 'warning'
										});
									} else {
										ufma.showTip(result.msg, function() {
											//重新获取辅助核算项数据，重绘表格
											page.getCurData();
											page.initAssistTable(page.curData);
											//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
											page.lastVer = result.data.lastVer;
										}, result.flag);
									}

								});
							}
						}
					})
				} else {
					if(!flag) {
						ufma.alert("辅助核算项不允许为空！", "warning");
					} else {
						if(again) {
							argu.confirmUpdateUsedAcco = "1";
						}
						argu.saveType = "4";
						ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
							if(page.sysParam == "0" && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
								ufma.showTip(result.msg, function() {}, "error");
							} else if(page.sysParam == "1" && result.accoIsUsed == true && result.msg == "科目辅助核算项保存失败，该会计科目已经发生业务数据！") {
								ufma.confirm('科目已使用，请确认是否修改？', function(action) {
									if(action) {
										//点击确定的回调函数
										page.saveAssistInfo(true);
									} else {
										//点击取消的回调函数
										$("#coaAccAssistBtnGroup .btn-cancel").trigger("click");
									}
								}, {
									type: 'warning'
								});
							} else {
								ufma.showTip(result.msg, function() {
									//重新获取辅助核算项数据，重绘表格
									page.getCurData();
									page.initAssistTable(page.curData);
									//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
									page.lastVer = result.data.lastVer;
								}, result.flag);
							}

						});
					}
				}
			},

			saveIllegalInfo: function() {
				var argu = {};
				argu = page.initSaveArgu(argu);
				argu.eleAccoIlaccs = page.serializeIllegal();
				//判断非法对应科目代码是否为空
				var ilaccFlag = true;
				$.each(argu.eleAccoIlaccs, function(index, row) {
					if(row.ilaccCode == '') {
						ilaccFlag = false;
						return false;
					}
				});
				if(!ilaccFlag) {
					ufma.alert("非法对应科目不允许为空！", "warning");
				} else {
					argu.saveType = "6";
					ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
						ufma.showTip(result.msg, function() {
							//重新获取非法对应科目数据，重绘表格
							page.getCurData();
							page.initIlaccTable(page.curData);
							//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
							page.lastVer = result.data.lastVer;
						}, result.flag);
					});
				}
			},
			saveAMTCtrl: function() {
				var argu = $('#frmAMTCtrl').serializeObject();
				argu = page.initSaveArgu(argu);
				argu.enableBalanceControl = $('#enableBalanceControl').prop('checked') ? 1 : 0;
				argu.enableLargeControl = $('#enableLargeControl').prop('checked') ? 1 : 0;
				argu.saveType = "5";
				ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
					ufma.showTip('金额控制保存成功！', function() {
						page.setAmtCtrlFormEdit(false);
						page.lastVer = result.data.lastVer;
					}, 'success');
				});

			},
			saveAll: function(flag, again) {
				if(!ma.formValidator("chrCode", "chrName", "会计科目", page.action)) {
					return false;
				}

				var argu = page.findSaveAllArgu();
				//				if(window.ownerData.coaccagyAgency == false) {
				if(aTCodeSel != null) {
					argu.agencyTypeCode = aTCodeSel.join(',')
				} else {
					argu.agencyTypeCode = ''
				}
				//			 	//判断辅助核算项和非法对应科目是否为空
				var assistFlag = true;
				$.each(argu.eleAccoItems, function(index, row) {
					if(row.accitemCode == '') {
						assistFlag = false;
						return false;
					}
				});
				var ilaccFlag = true;
				$.each(argu.eleAccoIlaccs, function(index, row) {
					if(row.ilaccCode == '') {
						ilaccFlag = false;
						return false;
					}
				});

				if(!assistFlag) {
					ufma.alert("辅助核算项不允许为空！", "warning");
				} else if(!ilaccFlag) {
					ufma.alert("非法对应科目不允许为空！", "warning");
				} else {
					if(again) {
						argu.confirmUpdateUsedAcco = "1";
					}
					ufma.showloading();
					ufma.post('/ma/sys/coaAccSys/save', argu, function(result) {
						 ufma.hideloading();
						argu.saveType = "1";
						if(page.sysParam == "0" && result.msg == "科目保存失败:该会计科目已经发生业务数据！") {
							ufma.showTip(result.msg, function() {}, "error");
						} else if(page.sysParam == "1" && result.accoIsUsed == true && result.msg == "科目保存失败:该会计科目已经发生业务数据！") {
							ufma.confirm('科目已使用，请确认是否修改？', function(action) {
								if(action) {
									//点击确定的回调函数
									page.saveAll(flag, true);
								} else {
									//点击取消的回调函数
								}
							}, {
								type: 'warning'
							});
						} else if(result.isUse > 0 && result.allowAdd == true) {
							parent.document.getElementsByClassName('u-msg-title')[0].innerHTML += '<div class="mask"></div>'
							parent.document.getElementsByClassName('mask')[0].style.width = "100%"
							parent.document.getElementsByClassName('mask')[0].style.height = "100%"
							parent.document.getElementsByClassName('mask')[0].style.background = "rgba(0,0,0,.3)"
							parent.document.getElementsByClassName('mask')[0].style.position = "absolute"
							parent.document.getElementsByClassName('mask')[0].style.left = "0"
							parent.document.getElementsByClassName('mask')[0].style.top = "0"
							var arguStr = JSON.stringify(argu);
							var newTitle = "<div class='coaAccMoveBox'><div id='coaAccMove'><div class='waing'>!</div><p class='coaAccMoveTitle'>当前科目代码（" + argu.chrCode.substring(0, argu.chrCode.length - 2) + "）已使用，不能增加下级科目。若要增加下级科目，系统会自动将当前科目（" + argu.chrCode.substring(0, argu.chrCode.length - 2) + "）相关业务数据迁移到另一个下级科目中。<br/><span>确定要增加下级科目吗？</span></p><div id='coaAccMoveContent'><button class='btn btn-sm btn-default' item='3' >取消</button><button class='btn btn-sm btn-primary btn-sure' item='2' data='" + arguStr + "'>确定</button></div></div></div><div class='mask'></div>";
							$('#coaAccEdit').append(newTitle)

						} else {
							if(flag) {
								if(!result.allowAdd) {
									ufma.showTip(result.msg, function() {
										ufma.hideloading();
									}, "error");
									return false;
								}
								ufma.showTip('保存成功,您可以继续添加会计科目！', function() {
									//重置表单
									page.resetForm();
									$('#agencyTypeCode').val(page.agencyTypeCode)
									// _close();
									ma.fillWithBrother($('#chrCode'), {
										"chrCode": argu.chrCode,
										"eleCode": "ACCO",
										"agencyCode": page.agencyCode,
										"acctCode": page.acctCode,
										"accsCode": page.accsCode
									});
								}, 'success');

							} else {
								if(result.flag != "success") {
									ufma.showTip(result.msg, function() {

									}, 'warning');
									ufma.hideloading();
									return false;
								}
								ufma.showTip('保存成功！', function() {
									//$('#lastVer').val(parseInt($('#lastVer').val()) + 1);
									page.lastVer = result.data.lastVer;
									_close();
									//关闭页面的回传数据
									page.resultData = argu;
								}, 'success');
							}

						}
					});
				}
			},
			findSingleArgu: function(argu) {
				//到期日
				if($('#expireDate').is(':checked')) {
					argu["expireDate"] = $('#expireDate').val();
				} else {
					argu["expireDate"] = '0';
				}
				//票据号
				if($('#isShowBill').is(':checked')) {
					argu["isShowBill"] = $('#isShowBill').val();
				} else {
					argu["isShowBill"] = '0';
				}
				if($('#isCheckRegister').is(':checked')) {
					argu["isCheckRegister"] = $('#isCheckRegister').val();
				} else {
					argu["isCheckRegister"] = '0';
				}
				if($('#allowSurplus').is(':checked')) {
					argu["allowSurplus"] = $('#allowSurplus').val();
				} else {
					argu["allowSurplus"] = '0';
				}
				if($('#updateAllSonAccItems').is(':checked')) {
					argu["updateAllSonAccItems"] = $('#updateAllSonAccItems').val();
				} else {
					argu["updateAllSonAccItems"] = '0';
				}
				return argu;
			},

			removeStringSpace: function(strname) {
				var newStrname = strname.replace(/\s+/g, ""); //去空格
				newStrname.replace(/[\r\n]/g, ""); //去回车换行
				return newStrname;
			},

			findSaveAllArgu: function() {
				var argu = {};
				var argu1 = $('#form-mainInfoTab').serializeObject();
				var argu2 = $('#form-moneyInfoTab').serializeObject();
				var argu3 = $('#form-remarkInfoTab').serializeObject();
				var argu4 = $('#frmAMTCtrl').serializeObject();
				argu4.enableBalanceControl = $('#enableBalanceControl').prop('checked') ? 1 : 0;
				argu4.enableLargeControl = $('#enableLargeControl').prop('checked') ? 1 : 0;
				//				if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == false) {
				if(aTCodeSel != null) {
					argu.agencyTypeCode = aTCodeSel.join(',')
				} else {
					argu.agencyTypeCode = ''
				}
				//				} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == true) {
				//					argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
				//				} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == undefined) {
				//					argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
				//				}
				//去掉会计科目名称中的空格
				var nameString = argu1['chrName'];
				argu1['chrName'] = page.removeStringSpace(nameString);

				argu = page.findSingleArgu(argu);
				var argu = $.extend(argu, argu1, argu2, argu3, argu4);
				argu.eleAccoItems = page.serializeAssist();
				argu.eleAccoIlaccs = page.serializeIllegal();
				argu = page.initSaveArgu(argu);
				//				if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == false) {
				if(aTCodeSel != null) {
					argu.agencyTypeCode = aTCodeSel.join(',')
				} else {
					argu.agencyTypeCode = ''
				}
				//				} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == true) {
				//					argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
				//				} else if(argu.agencyTypeCode != undefined && window.ownerData.coaccagyAgency == undefined) {
				//					argu.agencyTypeCode = $("#agencyTypeCode").find('option:selected').attr('value')
				//				}
				//全称
				var chrNameVal = $("#chrName").val();
				var newChrName = page.removeStringSpace(chrNameVal); //去掉会计科目名称中的空格
				if($("#chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = newChrName;
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + newChrName;
				}
				return argu;
			},

			initSaveArgu: function(argu) {
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.accsCode;
				argu["acceCode"] = page.acceCode;
				argu["accaCode"] = page.accaCode;
				argu["chrId"] = $('#chrId').val();
				argu["chrCode"] = $('#chrCode').val();
				argu['chrName'] = page.removeStringSpace($('#chrName').val());
				//argu["lastVer"] = $('#lastVer').val();
				argu["lastVer"] = page.lastVer;
				return argu;
			},

			//重置表单
			resetForm: function() {
				$('#chrCode').removeAttr("disabled");
				$('#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab')[0].reset();
				$('#expireDate').prop("checked", false);
				$('#isShowBill').prop("checked", false);
				$('#isCheckRegister').prop("checked", false);
				$('#allowSurplus').prop("checked", false);
				$('#coaAccAssist').find('tbody').html('');
				$('#coaAccIllegal').find('tbody').html('');
				ufma.comboxInit('accoType');
			},
			getAcco: function(textValue) {
				if(textValue.length > 1) {
					page.acceCode = textValue.substr(0, 1);
				} else {
					page.acceCode = textValue;
				}
				ufma.get('/ma/sys/coaAcc/queryAcce', {
					"accsCode": page.accsCode,
					"acceCode": page.acceCode
				}, function(result) {
					var balDir = 0;
					if(result.data.length > 0) {
						page.acceName = result.data[0].chrName;
						page.accaCode = result.data[0].accaCode;
						$('#editAcceName').text(page.acceName);

						//确定余额方向
						if(result.data[0].balDir == -1) {
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

			onEventListener: function() {
				$(document).on("blur", "#chrName", function() {
					if(page.action == 'addSub' && !page.clickBlur) {
						page.accItemsTableEdit2(page.curData);
						$("#coaAccAssistBtnGroup").addClass("hidden");
						page.clickBlur = true
					}

				});

				//保存迁移下级数据
				$('#coaAccEdit').on('click', 'button', function(e) {
					switch($(this).attr('item')) {
						case '1':
							var arguObj2 = JSON.parse($(this).attr('data'))
							var newArguObj = {
								"acctCode": arguObj2.acctCode,
								"agencyCode": arguObj2.agencyCode,
								"setYear": arguObj2.setYear + "",
								"rgCode": arguObj2.rgCode,
								"eleCode": "ACCO",
								"oldChrCode": arguObj2.chrCode.substring(0, arguObj2.chrCode.length - 2),
								"newChrCode": $('.coaAccMoveText').eq(0).val(),
								"newChrName": $('.coaAccMoveText').eq(1).val()
							}
							if($('.coaAccMoveText').eq(0).val()) {
								if($('.coaAccMoveText').eq(1).val()) {
									ufma.post('/ma/sys/coaAcc/transferAcco', newArguObj, function(result) {
										ufma.showTip('保存成功！', function() {
											ufma.hideloading();
											page.lastVer = result.data.lastVer;
											//关闭页面的回传数据
											page.resultData = newArguObj;
											$('.coaAccMoveBox').remove()
											$('.mask').remove()
											parent.document.getElementsByClassName('u-msg-title')[0].removeChild(parent.document.getElementsByClassName('mask')[0])
										}, 'success');
									});
								} else {
									ufma.showTip('科目名称不能为空！', function() {}, 'warning');
								}
							} else {
								ufma.showTip('科目编码不能为空！', function() {}, 'warning');
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
							$('#coaAccMoveClose').on('click', function() {
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
				if($('#chrCode').attr("disabled") == "disabled") {
					ma.isRuled = true;
				}

				//编码验证
				ma.codeValidator('chrCode', '会计科目', '/ma/sys/common/findParentList?acctCode=' + page.acctCode + '&accsCode=' + page.accsCode + '&eleCode=ACCO', page.agencyCode, "", page.acctCode, page.accsCode);
				// 名称验证
				ma.nameValidator('chrName', '会计科目');

				$('#btnCoaAccBaseEdit').on('click', function() {
					page.setBaseFormEdit(true);
				});
				$('#btnCoaAccNummoneyEdit').on('click', function() {
					page.setNummoneyFormEdit(true);
				});
				$('#btnCoaAccAssistEdit').on('click', function() {
					// page.setAssistFormEdit(true);
					page.accItemsTableEdit(page.curData);
				});
				$('#btnCoaAccIllegalEdit').on('click', function() {
					page.setIllegalFormEdit(true);
				});
				$('#btnCoaAccRemarkEdit').on('click', function() {
					page.setRemarkFormEdit(true)
				});
				$('#btnAmtCtrlEdit').on('click', function() {
					page.setAmtCtrlFormEdit(true)
				});
				//基本信息局部按钮
				$('#coaAccBaseBtnGroup .btn-save').on("click", function() {
					page.saveBaseInfo('form-mainInfoTab', "0");

				});
				$('#coaAccBaseBtnGroup .btn-cancel').on('click', function() {
					$("#form-mainInfoTab,#form-moneyInfoTab,#form-remarkInfoTab").setForm(page.curData);
					page.setBaseFormEdit(false);
				});
				$('#coaAccNummoneyBtnGroup .btn-save').on('click', function() {
					page.saveBaseInfo('form-moneyInfoTab');

				});
				$('#coaAccNummoneyBtnGroup .btn-cancel').on('click', function() {
					page.setNummoneyFormEdit(false);
				});
				$('#coaAccAssistBtnGroup .btn-save').on('click', function() {
					page.saveAssistInfo();
				});
				$('#coaAccAssistBtnGroup .btn-cancel').on('click', function() {
					page.getCurData();
					page.initAssistTable(page.curData);
					page.setAssistFormEdit(false);
				});
				$('#coaAccAddAssist').on('click', function() {
					page.newAssistTable();
				});
				$('#coaAccIllegalBtnGroup .btn-save').on('click', function() {
					page.saveIllegalInfo();
				});
				$('#coaAccIllegalBtnGroup .btn-cancel').on('click', function() {
					page.setIllegalFormEdit(false);
				});
				$('#coaAccAddIllegal').on('click', function() {
					page.newIllegalTable();
				});
				$('#coaAccRemarkBtnGroup .btn-save').on('click', function() {
					page.saveBaseInfo('form-remarkInfoTab');
					page.setRemarkFormEdit(false);
				});
				$('#coaAccRemarkBtnGroup .btn-cancel').on('click', function() {
					page.setRemarkFormEdit(false);
				});
				$('#frmAMTCtrl .btn-save').on('click', function() {
					page.saveAMTCtrl();
				});
				$('#frmAMTCtrl .btn-cancel').on('click', function() {
					page.setAmtCtrlFormEdit(false);
				});
				//保存并新增
				$('#coaAccSaveAddAll').on('click', function() {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveAll(true);
				});

				//保存
				$('#coaAccSaveAll').on('click', function() {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveAll(false);
				});

				//取消
				$('#coaAccCancelAll').on('click', function() {
					var formMainInfoTab = $('#form-mainInfoTab').serializeObject();
					if(!ufma.jsonContained(page.formdata, formMainInfoTab)) {
						ufma.confirm('您修改了' + page.getPageName(page.tableParam).title + '，关闭前是否保存？', function(action) {
							if(action) {
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
				$('.coaAcc-shopping-trolley').on('click', function(e) {
					e.stopPropagation();
					var $this = $(this);
					var $shop = $($(this).attr('data-target'));

					if($shop.attr('slidout') == 'true') return false;
					$shop.attr('slidout', 'true')
					$shop.animate({
						'left': '0px'
					}, 300, function() {
						$shop.attr('slidout', 'false');
					});

				});

				//左侧树关闭
				$(document).on('click', function(e) {
					if($(e.target).closest(".coaAcc-shopp").length == 0) {
						$('#coaAcc-shopp').animate({
							'left': '-250px'
						}, 300);
					}
				});
				//根据输入编码的第一个code，判断显示会计要素
				$('#chrCode').on('focus paste keyup change', function(e) {
					e.stopPropagation();
					var textValue = $(this).val();
					page.getAcco(textValue);

				});

				//外币核算
				$('#isCur').on('click', function(e) {
					if($(this).find('label').hasClass('active')) {
						if($('#defCurCode').attr('disabled') == 'disabled') {
							$('#defCurCode').attr('disabled', false);
						} else {
							$('#defCurCode').attr('disabled', true);
						}
					}
				});
				$('.curActive').on('click', function(e) {
					$('#mrbz').removeClass('hidden');
				});
				$('.curStop').on('click', function(e) {
					$('#mrbz').addClass('hidden');
				})

				//数量核算
				$('#isQty').on('click', function(e) {
					if($(this).find('label').hasClass('active')) {
						if($('#qtyUom').attr('disabled') == 'disabled') {
							$('#qtyUom').attr('disabled', false);
							$('#wbhs').removeClass('hidden');
							$('#xsws').removeClass('hidden');

							//启用时判断
							$('.coaAcc-num-reduce').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
							$('#qtyDigits').attr('disabled', false);
							$('.coaAcc-num-add').removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");

							if($('.coaAcc-num-val').val() == 0) {
								$('.coaAcc-num-reduce').removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
							} else if($('.coaAcc-num-val').val() == 6) {
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
					}
				});

				//加减小数点位数
				$(".coaAcc-num-reduce").on("click", function() {
					if($(this).hasClass("coaAcc-num-action")) {
						var num = $(this).siblings(".coaAcc-num-val").val();
						num = parseInt(parseInt(num) - 1);
						$(this).siblings(".coaAcc-num-val").val(num);
						if(num == 0) {
							$(this).removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if(num <= 5) {
							$(this).siblings(".coaAcc-num-add").removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						}
					}
				});
				$(".coaAcc-num-add").on("click", function() {
					if($(this).hasClass("coaAcc-num-action")) {
						var num = $(this).siblings(".coaAcc-num-val").val();

						num = parseInt($.isNull(num) ? 0 : num) + 1;
						$(this).siblings(".coaAcc-num-val").val(num);
						if(num == 6) {
							$(this).removeClass("coaAcc-num-action").addClass("coaAcc-num-disabled");
						} else if(num >= 1) {
							$(this).siblings(".coaAcc-num-reduce").removeClass("coaAcc-num-disabled").addClass("coaAcc-num-action");
						}
					}
				});

			},

			//初始化编码规则和控制方式
			initfifa: function() {
				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: 'ACCO',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				});

				// ufma.get("/ma/sys/coaAcc/queryAccsRule", {
				// 	"accsCode": page.accsCode
				// }, function (result) {
				page.fjfa = ma.ruleData.codeRule;
				ma.fjfa = page.fjfa;
				page.accsName = ma.ruleData.chrName;
				page.ctrlLevel = ma.ruleData.isAddFirst;
				$('#editAccsName').text(page.accsName);
				$('#editAccoRule').text(page.fjfa);
				if(page.ctrlLevel == '1') {
					$('#ctrlLvelName').text("此内容可增加一级，下级可细化");
				} else if(page.ctrlLevel == '0') {
					$('#ctrlLvelName').text("此内容不可增加一级，下级可细化");
				} else {
					$('#ctrlLvelName').text("此内容下级可细化");
				}
				//});
			},

			//显示会计要素名称
			getAcce: function() {
				ufma.get('/ma/sys/coaAcc/queryAcce', {
					"accsCode": page.accsCode,
					"acceCode": page.acceCode
				}, function(result) {
					if(result.data.length > 0) {
						page.acceName = result.data[0].chrName;
						$('#editAcceName').text(page.acceName);
					} else {
						$('#editAcceName').text("");
					}
				});
			},

			//凭证录入页面调用只传帐套，需获取科目体系
			getAccsCode: function() {
				ufma.ajaxDef('/ma/sys/eleCoacc/getAccsByAcctCode', 'get', {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				}, function(result) {
					if(result.data.length > 0) {
						page.accsCode = result.data[0].chrCode;
					}
				});
			},

			initParamData: function(data) {
				page.action = data.action; //add edit addSub
				page.flag = data.flag; //flag=1为外部调用编辑页
				page.rgCode = data.rgCode;
				page.setYear = data.setYear;
				page.agencyCode = data.agencyCode;
				page.acctCode = data.acctCode;
				page.accsCode = data.accsCode;
				page.chrCode = data.chrCode;
				page.agencyTypeCode = data.agencyTypeCode;
				//根据帐套代码获取科目体系，凭证录入页面没有科目体系只有帐套
				if(data.accsCode == "" || data.accsCode == undefined) {
					page.getAccsCode();
				} else {
					page.accsCode = data.accsCode;
				}
				if(page.agencyCode != "*" && data.action != "edit") {
					setTimeout(function() {
						aTCodeSel = [];
						$('#agencyTypeCode').val(page.agencyTypeCode);
						aTCodeSel.push(page.agencyTypeCode);
					}, 500);
				}

				//获取编码规则
				page.initfifa();
				if(page.action == "edit") {
					//为修改时
					page.acceCode = data.acceCode;
					page.accaCode = data.accaCode;
					page.getAcce();
					//当为edit的时候获取chrCode详情数据
					page.getCurData();
				} else if(page.action == "addSub") {
					//增加下级
					page.acceCode = page.chrCode.substr(0, 1);
					page.getAcce();
					//获取上级科目具体数据
					page.getSupData();
				}
			},

			initGetArgu: function() {
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
			getSupData: function() {
				var arguObj = page.initGetArgu();
				if(page.action == 'addSub') {
					arguObj.chrCode = window.ownerData.supChrCode;
				}
				ufma.get(interfaceURL.queryAccoTable, arguObj, function(result) {
					page.curData = result.data.accoList[0];
				});

			},
			getCurData: function() {

				//根据chrCode获取数据
				ufma.ajaxDef(interfaceURL.queryAccoTable, "get", page.initGetArgu(), function(result) {
					if(result) {
						page.curData = result.data.accoList[0];
						editagencyTypeCode = page.curData.agencyTypeCode
						page.curData["action"] = "edit";
						page.formdata = result;
						accisLeaf = page.curData.isLeaf
					}
				});
			},
			initBalanceCtrl: function() {
				ufma.ajaxDef('/ma/pub/enumerate/MA_ACCO_BALANCE_CONTROL_MODE', 'get', '', function(result) {
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
			getSysRgparaValueByChrCode: function() {
				var argu = {
					rgCode: window.ownerData.rgCode,
					setYear: window.ownerData.setYear,
					agencyCode: window.ownerData.agencyCode
				};
				ufma.get("/ma/sysrgpara/getSysRgparaValueByChrCode/GL025", argu, function(result) {
					page.sysParam = result.data;
				});
			},
			init: function() {
				page.reslist = ufma.getPermission();
				//if(window.ownerData.isSys!='0'){
				window.ownerData.rgCode = window.ownerData.rg;
				page.rgCode = window.ownerData.rg;
				ma.rgCode = window.ownerData.rg;
				/*}else{
					window.ownerData.rgCode='*';
					page.rgCode = '*';
					ma.rgCode = '*';
				}*/
				ufma.isShow(page.reslist);
				//请求辅助核算项列表
				page.getComAccItemTypeList();
				page.getSysRgparaValueByChrCode();
				page.initParamData(window.ownerData);
				page.initTree();
				// page.initEditPage((page.flag == 1 && page.action == 'edit') ? page.curData : window.ownerData);
				page.initEditPage(page.action == 'edit' ? page.curData : window.ownerData);
				page.onEventListener();
				page.initBalanceCtrl();
				$('#balanceControlMoney').amtInput();
				$('#largeControlMoney').amtInput();
				if(window.ownerData.agencyCode != "*") {
					ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTable", "get", page.initGetArgu(), function(result) {
						if(result) {
							var editFlag = result.data.accoList[0].isChangeAttr;
							if(editFlag == "0") {
								$(".coaAcc-edit").hide();
							}
							page.formdata = result;
							accisLeaf = result.data.accoList[0].isLeaf
						}
					});
					$('label[name="allowChangeName"]').attr('disabled', 'disabled');
					$('label[name="isChangeAttr"]').attr('disabled', 'disabled');

				}
				ufma.parse();
			}
		}
	}();

	page.init();
});
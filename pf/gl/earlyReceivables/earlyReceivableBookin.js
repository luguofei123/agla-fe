$(function() {
	window._close = function() {

		window.closeOwner();

	};

	var page = function() {
		var ptData = {};
		var argu = {};
		$('#vouNo').attr('disabled', true)
		var dateTime = window.ownerData.dateTime;//bug79646--zsj
		return {
			//初始化页面
			initPage: function(op) {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				var url = "/gl/sys/coaAcc/getRptAccoTree";
				var reqDatas1 = {
					agencyCode: window.ownerData.sendObj.agencyCode,
					acctCode: window.ownerData.sendObj.acctCode,
					accoType: "6",
					setYear: ptData.svSetYear,
					//修改权限  将svUserCode改为 svUserId  20181012
					userId: ptData.svUserId
					// userId: ptData.svUserCode
				};
				ufma.get(url, reqDatas1, function(result) {
					if(result.data.treeData) {
						page.accoCode = $("#accoCode").ufTreecombox({
							idField: "code",
							textField: "codeName",
							readonly: false,
							placeholder: "",
							leafRequire: true,
							data: result.data.treeData,
							onChange: function(sender, data) {
								argu.accoCode = data.code
								argu.accoName = data.name
							},
							onComplete: function(sender) {
								if(window.ownerData.sendObj.accoCode) {
									$("#accoCode").getObj().val(window.ownerData.sendObj.accoCode);
								}
								ufma.hideloading();
							}
						});
					} else {
						ufma.showTip('此账套下没有会计科目！', function() {}, 'warning');
					}
				});
				//票据类型
				//ufma.get('/gl/CbBillBook/select?agencyCode=' + window.ownerData.sendObj.agencyCode + '&rgCode=' + window.ownerData.sendObj.rgCode + '&enabled=-1&table=MA_ELE_BILLTYPE', {}, function (result) {
				var reqData = {
					agencyCode: window.ownerData.sendObj.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};

				ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
					if(result.data) {
						$("#billType").ufTreecombox({
							/*idField: 'chrId',
							textField: 'codeName',
							pIdField: 'parentId', //可选*/
							idField: 'code',
							textField: 'codeName',
							pIdField: 'pCode', //可选
							readonly: false,
							placeholder: '请选择票据类型',
							leafRequire: true,
							data: result.data,
							onChange: function(sender, data) {
								argu.billType = data.chrCode
							},
							onComplete: function(sender) {
								$('#billType').getObj().val(window.ownerData.sendObj.billTypeName);
								ufma.hideloading();
							}
						});
					} else {
						ufma.showTip('此单位下没有票据类型！', function() {}, 'warning');
					}
				});
				if(window.ownerData.type && window.ownerData.type == "02" && window.ownerData.sendObj.employee) {
					$("#colAction .text").text("个人");
					$("#colAction").attr("data-type", "02");
					//编辑回显个人往来（人员）
					var reqData = {
						agencyCode: window.ownerData.sendObj.agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						eleCode: "EMPLOYEE"
					};

					ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
						$("#currentAgency").ufTreecombox({
							idField: 'code',
							textField: 'codeName',
							pIdField: 'pCode', //可选
							readonly: false,
							placeholder: '请选择往来方',
							leafRequire: true,
							data: result.data,
							onChange: function(sender, data) {
								argu.currentAgency = data.code
								//$('#currentAgency').getObj().val(window.ownerData.sendObj.currentAgencyName);

							},
							onComplete: function(sender) {
								$("#currentAgency").getObj().val(window.ownerData.sendObj.employee);
							}
						});
					});
				} else {
					//往来单位
					var reqDatas2 = {
						agencyCode: window.ownerData.sendObj.agencyCode,
						setYear: window.ownerData.sendObj.setYear,
						rgCode: window.ownerData.sendObj.rgCode,
						eleCode: "CURRENT"
					};
					ufma.get("/gl/elecommon/getEleCommonTree", reqDatas2, function(result) {
						if(result.data && result.data.length != 0) {
							$("#currentAgency").ufTreecombox({
								idField: 'code',
								textField: 'codeName',
								pIdField: 'pCode', //可选
								readonly: false,
								placeholder: '请选择往来方',
								leafRequire: true,
								data: result.data,
								onChange: function(sender, data) {
									argu.currentAgency = data.code
									//$('#currentAgency').getObj().val(window.ownerData.sendObj.currentAgencyName);

								},
								onComplete: function(sender) {
									if(window.ownerData.sendObj.currentAgency) {
										$("#colAction .text").text("单位");
										$("#colAction").attr("data-type", "01");
										$("#currentAgency").getObj().val(window.ownerData.sendObj.currentAgency);

									}
									ufma.hideloading();
								}
							});
						} else {
							ufma.showTip('此单位下没有往来单位！', function() {}, 'warning');
						}
					});
				}
				//凭证号
				var vouTypeUrl = ''
				if(window.ownerData.sendObj.accaCode) {
					vouTypeUrl = '/gl/eleVouType/selVouType/' + window.ownerData.sendObj.agencyCode + '?acctCode=' + window.ownerData.sendObj.acctCode + '&setYear=' + ptData.svSetYear + '&rgCode=' + ptData.svRgCode + '&accaCode=' + window.ownerData.sendObj.accaCode
				} else {
					vouTypeUrl = '/gl/eleVouType/selVouType/' + window.ownerData.sendObj.agencyCode + '?acctCode=' + window.ownerData.sendObj.acctCode + '&setYear=' + ptData.svSetYear + '&rgCode=' + ptData.svRgCode
				}
				ufma.get(vouTypeUrl, {}, function(result) {
					if(result.data && result.data.length != 0) {
						$("#vouType").ufTreecombox({
							idField: "chrCode",
							textField: "chrName",
							readonly: false,
							placeholder: "",
							data: result.data,
							onChange: function(sender, data) {
								console.log(data)
								argu.vouType = data.chrCode
								$('#vouNo').attr('disabled', false)
							},
							onComplete: function(sender) {
								if(window.ownerData.sendObj.vouType) {
									$("#vouType").getObj().val(window.ownerData.sendObj.vouType);
									$('#vouNo').val(window.ownerData.sendObj.vouNo)
								}
								ufma.hideloading();
							}
						});
					} else {
						ufma.showTip('此单位下没有凭证号！', function() {}, 'warning');
						page.vouType = $("#vouType").ufTreecombox({
							idField: "CHR_NAME",
							textField: "CHR_NAME",
							readonly: false,
							placeholder: "",
							data: []
						});
						$('#vouNo').val('')
					}
				});

			},
			onEventListener: function() {
				$('#btnSaveAndAdd').on('click', function() {
					page.save(true)
				})
				$('#btnSave').on('click', function() {
					page.save(false)
				})
				$('#btnQuit').on('click', function() {
					_close()
				})
			},
			clearContent: function() {
				$('#descpt').val('') //摘要
				$('#billNo').val('')
				$('#subsidyMoney').val('')
				$('#vouNo').val('')
				$("#accoCode").getObj().setValue('', '');
				$("#billType").getObj().setValue('', '');
				$("#currentAgency").getObj().setValue('', '');
				$("#vouType").getObj().setValue('', '');
			},
			save: function(flag) {
				argu.descpt = $('#descpt').val() //摘要
				argu.billNo = $('#billNo').val() //票据号
				argu.recAmount = $('#subsidyMoney').val().replace(/,/g, '') //金额
				argu.bussinessDate = $('#subsidyDate').getObj().getValue() //时间
				argu.vouNo = $('#vouNo').val(); //凭证号
				if($("#colAction").attr("data-type") == "02") {
					argu.employee = argu.currentAgency;
					argu.currentAgency = "";
				} else {
					argu.employee = "";
				}
				var url = '/gl/GlCbRecPayBook/saveRecPayBook';
				if(argu.bussinessDate) {
					if(argu.currentAgency || argu.employee) {
						if(argu.descpt) {
							if(argu.accoCode) {
								if(argu.recAmount) {
									ufma.post(url, argu, function(result) {
										ufma.showTip(result.msg, function() {
											if(flag) {
												page.clearContent()
											} else {
												_close()
											}
										}, result.flag);
									})
								} else {
									ufma.showTip('必填项不能为空！', function() {}, 'warning');
								}
							} else {
								ufma.showTip('必填项不能为空！', function() {}, 'warning');
							}
						} else {
							ufma.showTip('必填项不能为空！', function() {}, 'warning');
						}
					} else {
						ufma.showTip('必填项不能为空！', function() {}, 'warning');
					}
				} else {
					ufma.showTip('必填项不能为空！', function() {}, 'warning');
				}
			},

			onEventListener: function() {
				$('#btnSaveAndAdd').on('click', function() {
					page.save(true)
				})
				$('#btnSave').on('click', function() {
					page.save(false)
				})
				$('#btnQuit').on('click', function() {
					_close()
				});
				$('#delete').on('click', function() {
					var arr = []
					for(var i = 0; i < $('input.check-all').length; i++) {
						if($('input.check-all')[i].checked) {
							arr.push(argu[i].bookGuid)
						}
					}
					if(arr.length == 0) {
						ufma.showTip('请选择数据！', function() {}, 'warning');
					} else {
						ufma.post('/gl/GlCbRecPayBook/delRecPayBook', {
							"bookGuids": arr
						}, function(result) {
							if(result.flag == 'success') {
								$('#query_table').trigger('click');
								ufma.showTip('删除成功！', function() {}, 'success');
							}
						})
					}

				})
				//显示/隐藏列隐藏框
				$("#colAction").on("click", function(evt) {
					evt.stopPropagation();

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})
				//选择往来类型
				$("#colList").on("click", "span", function() {
					if($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if($(this).text() == "单位") {
							page.payerAgency();
						} else if($(this).text() == "个人") {
							page.payerEmployee();
						}
					}

					$(this).closest(".rpt-funnelBox").hide();
				})
			},
			//请求往来单位
			payerAgency: function() {
				var reqData = {
					agencyCode: window.ownerData.sendObj.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};

				ufma.get("/gl/elecommon/getEleCommonTree", reqData, function(result) {
					$('#currentAgency').getObj().load(result.data);
				});
			},
			//请求个人往来（人员列表）
			payerEmployee: function() {
				var reqData = {
					agencyCode: window.ownerData.sendObj.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "EMPLOYEE"
				};

				ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
					page.payerAgencyData = result.data;
					$('#currentAgency').getObj().load(result.data);
					// $('#btnQuery').trigger('click');
				});
			},
			clearContent: function() {
				$('#descpt').val('') //摘要
				$('#billNo').val('')
				$('#subsidyMoney').val('')
				$('#vouNo').val('')
				$("#accoCode").getObj().setValue('', '');
				$("#billType").getObj().setValue('', '');
				$("#currentAgency").getObj().setValue('', '');
				$("#vouType").getObj().setValue('', '');
			},
			initData: function() {
				argu = {
					"accoCode": null,
					"accoName": null,
					"acctCode": window.ownerData.sendObj.acctCode,
					"agencyCode": window.ownerData.sendObj.agencyCode,
					"billNo": null,
					"billType": null,
					"bookType": "1",
					"bussinessDate": null,
					"currentAgency": null,
					"descpt": null,
					"op": window.ownerData.op, //新增0  修改1
					"payAmount": null,
					"recAmount": null,
					"rgCode": ptData.svRgCode,
					"setYear": ptData.svSetYear,
					"vouNo": null,
					"vouType": null
				}
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(dateTime)//bug79646--zsj
				});
				$('#subsidyMoney').amtInput();
				$('#billNo').val(window.ownerData.sendObj.billNo);
				$('#descpt').val(window.ownerData.sendObj.descpt);
				$('#subsidyMoney').val(window.ownerData.sendObj.recAmount);
				//$('#frmBookIn').setForm(window.ownerData.sendObj); ------后期解决点击修改时没有取到行值的问题

			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData();

				this.initPage();
				this.initData();
				if(window.ownerData.op == 1) {
					argu.bookGuid = window.ownerData.sendObj.bookGuid
					$('#subsidyDate').getObj().setValue(window.ownerData.sendObj.bussinessDate)
				}
				this.onEventListener();

			}
		}
	}();
	page.init();

});
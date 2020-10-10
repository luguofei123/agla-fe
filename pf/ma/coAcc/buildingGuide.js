$(function () {
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var postData = {}
	var issueData;
	var closeAction;
	var page = function () {
		return {
			//按钮与步骤条逻辑
			timeline: function () {
				$('#initNewYearTimeline').ufmaTimeline([{
					step: '基本信息',
					target: 'checkData'
				},
				{
					step: '辅助核算',
					target: 'tranAcco'
				},
				{
					step: '会计科目',
					target: 'yinitEnd'
				},
				{
					step: '完成',
					target: 'initsEnd'
				}
				])
				$('#btn-next').on('click', function (e) {
					if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 1) {
						if ($("#caEditChrCode").val() != '' && $("#caEditChrName").val() != '') {
							if (page.treeAgency.getValue() != '') {
								if ($("#caFiLeader").val() != '') {
									page.saveCoAcc()
									delete postData.issueAcco
									page.getaAccTable()
									$('#initNewYearTimeline').ufmaTimeline().next();
								} else {
									ufma.showTip("请输入财务负责人", function () { }, "warning");
								}
							} else {
								ufma.showTip("请选择单位", function () { }, "warning");
							}
						} else {
							ufma.showTip("请输入账套名称和账套编码", function () { }, "warning");
						}

					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 2) {
						$('#initNewYearTimeline').ufmaTimeline().next();
					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 3) {
						var tr = ''
						var trsd = $("#treeAgency").ufmaTreecombox().getText();
						if (trsd == '') {
							trsd = '暂无'
						}
						var agencyTypeCodeSpan = $('#coAccEdit #agencyType option:checked').html();
						if (!agencyTypeCodeSpan) {
							agencyTypeCodeSpan = ""
						}
						tr += "<p class='clearfix'><span class='span1'>账套：</span><span class='span2' title='" + $('#coAccEdit #caEditChrCode').val() + " " + $('#coAccEdit #caEditChrName').val() + "'>" + $('#coAccEdit #caEditChrCode').val() + " " + $('#coAccEdit #caEditChrName').val() + "</span></p>"
						tr += "<p class='clearfix'><span class='span1'>单位：</span><span class='span2' title='" + trsd + "'>" + trsd + "</span></p>"
						tr += "<p class='clearfix'><span class='span1'>单位负责人：</span><span class='span2' title='" + $("#caFiLeader").val() + "'>" + $("#caFiLeader").val() + "</span></p>"
						tr += "<p class='clearfix' id='agencyCodeType'><span class='span1'>单位类型：</span><span class='span2' title='" + agencyTypeCodeSpan + "'>" + agencyTypeCodeSpan + "</span></p>"
						if ($("#isParallel").is(':checked')) {
							if ($("#isDoubleVou").is(':checked')) {
								tr += "<p class='clearfix'><span class='span1'>平行记账：</span><span class='span2'>启用单凭证模式</span></p>"
							} else {
								tr += "<p class='clearfix'><span class='span1'>平行记账：</span><span class='span2'>启用双凭证模式</span></p>"
							}
						} else {
							tr += "<p class='clearfix'><span class='span1'>平行记账：</span><span class='span2'>未启用</span></p>"
						}
						tr += "<p class='clearfix' id='accsCodeType'><span class='span1'>科目体系：</span><span class='span2' title='" + $('#coAccEdit #caEditEleAcc option:selected').html() + "'>" + $('#coAccEdit #caEditEleAcc option:selected').html() + "</span></p>"
						$("#initEnddata").html(tr)
						//bug82112--当不区分适用单位时隐藏单位类型--zsj
						if (page.agencyTypeShow == true) {
							$('#agencyCodeType').removeClass('hide');
						} else {
							$('#agencyCodeType').addClass('hide');
						}
						$('#initNewYearTimeline').ufmaTimeline().next();
					} else {
						$('#initNewYearTimeline').ufmaTimeline().next();
					}
					if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 3) {
						page.issueType();
						var runds = {
							'accsCode': $("#caEditEleAcc option:selected").attr('value'),
							'agencyTypeCode': $("#coAccEdit #agencyType option:checked").attr('value'),
							'agencyCode': page.treeAgency.getValue(), //issueData,//
							'acctCode': '*',
							'acceCode': $(".accnab .active").find('a').attr('data-status')
						}
						ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTableForNewAcct", 'get', runds, function (data) { //由于多区划所以将“/ma/sys/coaAcc/queryAccoTable”改为“/ma/sys/coaAcc/queryAccoTableForNewAcct”并且单位传入的是用户选择的单位--zsj--bug79430
							//var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>差异项登记</th><th>科目类型</th><th>级次</th><tr>'
							//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
							var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>科目类型</th><th>级次</th><tr>'
							for (var i = 0; i < data.data.accoList.length; i++) {
								tr += '<tr><td>' + data.data.accoList[i].chrCode + '</td>'
								tr += '<td>' + data.data.accoList[i].chrName + '</td>'
								tr += '<td title="' + data.data.accoList[i].accoItems + '">' + data.data.accoList[i].accoItems + '</td>'
								tr += '<td>' + $(".accnab .active").find('a').text() + '</td>'
								if (data.data.accoList[i].accBal == '1') {
									tr += '<td>借</td>'
								} else {
									tr += '<td>贷</td>'
								}
								if (data.data.accoList[i].isCheckRegister == '1') {
									tr += '<td>是</td>'
								} else {
									tr += '<td>否</td>'
								}
								//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
								/*if(data.data.accoList[i].allowSurplus == '1') {
									tr += '<td>是</td>'
								} else {
									tr += '<td>否</td>'
								}*/
								tr += '<td>' + data.data.accoList[i].accoTypeName + '</td>'
								tr += '<td>' + data.data.accoList[i].levelNum + '</td></tr>'
							}
							$("#AccTable").html(tr)
							for (var i = 0; i < $("#AccTable").find('tr').eq(0).find('th').length; i++) {
								var hes = $("#AccTable").find('tr').eq(0).find('th').eq(i)[0].offsetWidth
								$("#AccTable").find('tr').find('td').eq(i).css("width", hes)
								$("#AccTable").find('tr').eq(0).find('th').eq(i).css("width", hes)
								$("#AccTablehead").find('tr').eq(0).find('th').eq(i).css("width", hes)
							}
						});
						$('#btn-prev').removeClass('hide');
						$('#btn-next').removeClass('hide');
						$("#checkData").addClass('hide');
						$("#tranAcco").addClass('hide');
						$("#yinitEnd").removeClass('hide');
						$("#initEnd").addClass('hide');
						$("#btn-close").removeClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-succesadd").addClass('hide');
					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 2) {
						setTimeout(function () {
							for (var i = 0; i < $("#aAccTable").find('tr').eq(0).find('th').length; i++) {
								var hes = $("#aAccTable").find('tr').eq(0).find('th').eq(i)[0].offsetWidth
								$("#aAccTable").find('tr').eq(0).find('th').eq(i).css("width", hes)
								$("#aAccTablehead").find('tr').eq(0).find('th').eq(i).css("width", hes)
							}
						}, 10);
						$('#btn-prev').removeClass('hide');
						$('#btn-next').removeClass('hide');
						$("#checkData").addClass('hide');
						$("#tranAcco").removeClass('hide');
						$("#yinitEnd").addClass('hide');
						$("#initEnd").addClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-close").removeClass('hide');
						$("#btn-succesadd").addClass('hide');
					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 4) {
						$('#btn-prev').removeClass('hide');
						$('#btn-next').addClass('hide');
						$("#btn-succes").removeClass('hide');
						$("#btn-succesadd").removeClass('hide');
						$("#btn-close").addClass('hide');
						$("#checkData").addClass('hide');
						$("#tranAcco").addClass('hide');
						$("#yinitEnd").addClass('hide');
						$("#initEnd").removeClass('hide');
					}
				});
				$('#btn-prev').on('click', function () {
					$('#initNewYearTimeline').ufmaTimeline().prev();
					if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 3) {
						$('#btn-prev').removeClass('hide');
						$('#btn-next').removeClass('hide');
						$("#checkData").addClass('hide');
						$("#tranAcco").addClass('hide');
						$("#btn-close").removeClass('hide');
						$("#yinitEnd").removeClass('hide');
						$("#initEnd").addClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-succesadd").addClass('hide');
					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 2) {
						$('#btn-prev').removeClass('hide');
						$('#btn-next').removeClass('hide');
						$("#checkData").addClass('hide');
						$("#btn-close").removeClass('hide');
						$("#tranAcco").removeClass('hide');
						$("#yinitEnd").addClass('hide');
						$("#initEnd").addClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-succesadd").addClass('hide');
					} else if ($('#initNewYearTimeline').ufmaTimeline().stepIndex() == 1) {
						$('#btn-prev').addClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-succesadd").addClass('hide');
						$("#checkData").removeClass('hide');
						$("#btn-close").removeClass('hide');
						$("#tranAcco").addClass('hide');
						$("#yinitEnd").addClass('hide');
						$("#initEnd").addClass('hide');
					}
				});
				$('#btn-close').on('click', function (e) {
					if(!$.isNull(closeAction)){
						var data = {
							action: 'save'
						}
						_close(data);
					}else{
						_close('close');
					}
					
				})
				$('#btn-succes').on('click', function (e) {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveCoAcc();
					//guohx 修改同步请求为异步,保存时遮罩层才能正常 20191206
					ufma.post("/ma/sys/eleCoacc/saveCoacc", postData, function (result) {
						var data = {
							action: 'save',
							angery: page.treeAgency.getValue(),
							acct: $("#coAccEdit #caEditChrCode").val()
						}

						ufma.showTip(result.msg, function () {
							ufma.hideloading();
							_close(data);
						}, result.flag);

					})
				})
				$('#btn-succesadd').on('click', function (e) {
					ufma.showloading('数据保存中，请耐心等待...');
					page.saveCoAcc();
					ufma.ajaxDef("/ma/sys/eleCoacc/saveCoacc", 'post', postData, function (result) {
						closeAction = 'save';
						$('#initNewYearTimeline').ufmaTimeline().prev();
						$('#initNewYearTimeline').ufmaTimeline().prev();
						$('#initNewYearTimeline').ufmaTimeline().prev();
						$('#btn-prev').addClass('hide');
						$('#btn-next').removeClass('hide');
						$("#btn-close").removeClass('hide');
						$("#btn-succes").addClass('hide');
						$("#btn-succesadd").addClass('hide');
						$("#checkData").removeClass('hide');
						$("#tranAcco").addClass('hide');
						$("#yinitEnd").addClass('hide');
						$("#initEnd").addClass('hide');
						page.tjCoAcc();
						ufma.hideloading();
					})
				})
			},
			//bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
			getangery: function () {
				ufma.ajaxDef("/ma/pub/enumerate/AGENCY_TYPE_CODE", 'get', "", function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
					}
					$("#agencyType").html(opt)
				});
				if ($("#caEditEleAcc option:selected").attr('data-agencyType') == 1) {
					page.agencyTypeShow = true;
					$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').removeClass('hidden');
				} else {
					page.agencyTypeShow = false;
					$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').addClass('hidden');
					$('#agencyType').val('');
				}
			},
			//bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
			initTaxpayerType: function () {
				ufma.ajaxDef("/ma/pub/enumerate/TAXPAYER_TYPE_CODE", 'get', "", function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
					}
					$("#taxpayerType").html(opt)
				});
			},
			issueType: function () {
				var argurunds = {
					eleCode: 'ACCO',
					"agencyCode": page.treeAgency.getValue(),
					"setYear": window.ownerData.setYear,
					"rgCode": window.ownerData.rgCode,
				};
				ufma.ajaxDef("/ma/sys/element/getEleDetail", 'get', argurunds, function (data) {
					var useData = data.data;
					if (useData.issueType == '1') {
						issueData = '*'
					} else if (useData.issueType == '2') {
						issueData = page.treeAgency.getValue();
					}

				});
			},
			initAgency: function (result) {
				var data = result.data;
				page.treeAgency = $("#treeAgency").ufmaTreecombox({
					valueField: 'id',
					textField: 'codeName',
					readOnly: false,
					leafRequire: true,
					popupWidth: 1.5,
					data: data,
					onchange: function (data) {
						for (var i = 0; i < $("#agencyType").find('option').length; i++) {
							if ($("#agencyType").find('option').eq(i).attr('value') == data.agencyType) {
								$("#agencyType").find('option').eq(i).prop('selected', true)
							}
						}
						if (data.financeCharge != undefined) {
							$("#caFiLeader").val(data.financeCharge)
						} else {
							$("#caFiLeader").val('')
						}
					}
				});
			},
			getacce: function () {
				ufma.ajaxDef("/ma/sys/common/getEleTree", 'get', {
					"agencyCode": page.treeAgency.getValue(),
					"setYear": window.ownerData.setYear,
					"rgCode": window.ownerData.rgCode,
					"eleCode": "ACCS"
				}, function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].code + ' data-ispx=' + data.data[i].accaCount + ' data-agencyType=' + data.data[i].diffAgencyType + ' data-tixi=' + data.data[i].codeRule + '>' + data.data[i].codeName + '</option>'
					}
					$("#caEditEleAcc").html(opt)
					if (data.data.length > 0) {
						$("#caEditEleAccrule").html(data.data[0].codeRule)
						$("#caEditEleAcctext").html(data.data[0].codeName)
						if (data.data[0].accaCount > 1) {
							$("#isParallel").prop('checked', true)
							$("#isParallel").parent(".btn").addClass("active")
							$("#isParallels").prop('checked', false)
							$("#isParallels").parent(".btn").removeClass("active")
							$(".ispx").show()
						} else {
							$("#isParallels").prop('checked', true)
							$("#isParallels").parent(".btn").addClass("active")
							$("#isParallel").prop('checked', false)
							$("#isParallel").parent(".btn").removeClass("active")
							$(".ispx").hide()
						}
					}
					if ($("#caEditEleAcc option:selected").attr('data-agencyType') == 1) {
						page.agencyTypeShow = true;
						$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').removeClass('hide');
						$('#agencyTypeGroup label').css('display: block !important');
						//bugCWYXM-4786新增账套单位类型下拉栏无内容--zsj
						page.getangery();
					} else {
						page.agencyTypeShow = false;
						$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').addClass('hide');
						$('#agencyTypeGroup label').css('display: none !important');
						$('#agencyType').val('');
					}

				})
				var runs = {
					'agencyCode': '*',
					'accsCode': $("#caEditEleAcc option:selected").attr('value')
				}
				ufma.ajaxDef("/ma/sys/coaAcc/queryAcce", 'get', runs, function (data) {
					var ts = ''
					for (var i = 0; i < data.data.length; i++) {
						ts += '<li><a href="javascript:;" data-status="' + data.data[i].chrCode + '">' + data.data[i].chrName + '</a></li>'
					}
					$(".accnab").html(ts);
					if (data.data.length > 0) {
						$(".accnab li").eq(0).addClass('active')
					}
				});
			},
			getaAccTable: function () {
				ufma.ajaxDef("/ma/sys/accitem/select/" + page.treeAgency.getValue(), 'get', {
					"setYear": window.ownerData.setYear
				}, function (data) {
					var tr = '<tr><th>类别代码</th><th>类别名称</th><th>控制方式</th><th>分级规则</th><tr>'
					for (var i = 0; i < data.data.length; i++) {
						tr += '<tr><td>' + data.data[i].eleCode + '</td><td>' + data.data[i].accItemName + '</td><td>' + data.data[i].contrlLevelname + '</td>'
						if (data.data[i].codeRule == null) {
							tr += '<td></td><tr>'
						} else {
							tr += '<td>' + data.data[i].codeRule + '</td><tr>'
						}
					}
					$("#aAccTable").html(tr)
					setTimeout(function () {
						for (var i = 0; i < $("#aAccTable").find('tr').eq(0).find('th').length; i++) {
							var hes = $("#aAccTable").find('tr').eq(0).find('th').eq(i)[0].offsetWidth
							$("#aAccTable").find('tr').eq(0).find('th').eq(i).css("width", hes)
							$("#aAccTablehead").find('tr').eq(0).find('th').eq(i).css("width", hes)
						}
					}, 10)

				});
			},
			saveCoAcc: function () {
				postData.agencyCode = page.treeAgency.getValue();
				postData.setYear = window.ownerData.setYear;
				postData.rgCode = window.ownerData.rgCode;
				//				postData.agencyCode = '100101';
				postData.enabled = '1';
				postData.chrId = '';
				postData.chrName = $("#coAccEdit #caEditChrName").val();
				postData.chrCode = $("#coAccEdit #caEditChrCode").val();
				postData.accsCode = $("#coAccEdit #caEditEleAcc option:selected").val();
				postData.fiLeader = $("#coAccEdit #caFiLeader").val();
				postData.enablePeriod = $("#enablePeriod option:checked").attr('value');
				postData.agencyTypeCode = $("#coAccEdit #agencyType option:checked").attr('value');
				postData.taxpayerTypeCode = $("#coAccEdit  #taxpayerType option:checked").attr('value');
				postData.carryOverType = '';
				if ($("#isParallel").is(':checked')) {
					postData.isParallel = 1
					if ($("#isDoubleVou").is(':checked')) {
						postData.isDoubleVou = 0
					} else {
						postData.isDoubleVou = 1
					}
				} else {
					postData.isParallel = 0
					postData.isDoubleVou = ''
				}
				if ($("#isCashFlowAccount").is(':checked')) {
					postData.isCashFlowAccount = '1';
				} else {
					postData.isCashFlowAccount = '0';
				}
				if ($("#issueAcco").is(':checked')) {
					postData.issueAcco = '1';
				} else {
					postData.issueAcco = '0';
				}
				if ($("#isDefaultAcct").is(':checked')) {
					postData.isDefaultAcct = '1';
				} else {
					postData.isDefaultAcct = 0;
				}

				return postData;
			},
			tjCoAcc: function () {
				page.treeAgency.setValue('');
				$("#coAccEdit #caEditChrName").val('');
				$("#coAccEdit #caEditChrCode").val('');
				$("#coAccEdit #caEditEleAcc option").eq(0).prop('selected');
				if ($("#caEditEleAcc option:selected").attr('data-agencyType') == 1) {
					page.agencyTypeShow = true;
					$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').removeClass('hidden');
				} else {
					page.agencyTypeShow = false;
					$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').addClass('hidden');
					$('#agencyType').val('');
				}
				$("#coAccEdit #caFiLeader").val('');
				$("#enablePeriod option").eq(0).prop('selected');
				$("#coAccEdit #agencyType option").eq(0).prop('selected');
				$("#coAccEdit  #taxpayerType option").eq(0).prop('selected');
				$("#isParallel").attr('checked', true)
				$("#issueAcco").attr('checked', true)
				$("#isCashFlowAccount").attr('checked', false)
				$("#isShowBill").attr('checked', false)
				if (window.ownerData.action == 'edit') {
					postData.setYear = window.ownerData.setYear;
					postData.rgCode = window.ownerData.rgCode;
				}
			},
			initPage: function () {
				//bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
				ufma.ajaxDef("/ma/sys/eleAgency/getAgencyTree", 'get', "", this.initAgency);
				page.getacce();
				page.initTaxpayerType();
			},
			//此方法必须保留
			init: function () {
				this.timeline();
				this.initPage();
				ufma.parse();
			}
		}
	}();
	page.init();
	$(document).on('click', ".clickbigs1", function () {
		var _this = $(this); //将当前的pimg元素作为_this传入函数  
		imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
	})
	$(document).on('click', ".clickbigs2", function () {
		var _this = $(this); //将当前的pimg元素作为_this传入函数  
		imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
	})
	$(".accnab").on('click', "li", function () {
		// if($(this).hasClass('active') ==true){
		// $('.accnab li').removeClass('active')
		// $(this).addClass('active')
		page.issueType();
		var runds = {
			'accsCode': $("#caEditEleAcc option:selected").attr('value'),
			'agencyTypeCode': $("#coAccEdit #agencyType option:checked").attr('value'),
			'agencyCode': page.treeAgency.getValue(), //issueData,
			'acctCode': '*',
			'acceCode': $(".accnab .active").find('a').attr('data-status')
		}
		ufma.showloading('数据加载中，请耐心等待...');
		ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTableForNewAcct", 'get', runds, function (data) { //由于多区划所以将“/ma/sys/coaAcc/queryAccoTable”改为“/ma/sys/coaAcc/queryAccoTableForNewAcct”并且单位传入的是用户选择的单位--zsj--bug79430
			//var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>差异项登记</th><th>科目类型</th><th>级次</th><tr>'
			//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
			var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>科目类型</th><th>级次</th><tr>'
			for (var i = 0; i < data.data.accoList.length; i++) {
				tr += '<tr><td>' + data.data.accoList[i].chrCode + '</td>'
				tr += '<td>' + data.data.accoList[i].chrName + '</td>'
				tr += '<td title="' + data.data.accoList[i].accoItems + '">' + data.data.accoList[i].accoItems + '</td>'
				tr += '<td>' + $(".accnab .active").find('a').text() + '</td>'
				if (data.data.accoList[i].accBal == '1') {
					tr += '<td>借</td>'
				} else {
					tr += '<td>贷</td>'
				}
				if (data.data.accoList[i].isCheckRegister == '1') {
					tr += '<td>是</td>'
				} else {
					tr += '<td>否</td>'
				}
				//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
				/*if(data.data.accoList[i].allowSurplus == '1') {
					tr += '<td>是</td>'
				} else {
					tr += '<td>否</td>'
				}*/
				tr += '<td>' + data.data.accoList[i].accoTypeName + '</td>'
				tr += '<td>' + data.data.accoList[i].levelNum + '</td></tr>'
			}
			$("#AccTable").html(tr)
			setTimeout(function () {
				for (var i = 0; i < $("#AccTable").find('tr').eq(0).find('th').length; i++) {
					var hes = $("#AccTable").find('tr').eq(0).find('th').eq(i)[0].offsetWidth
					$("#AccTable").find('tr').eq(0).find('th').eq(i).css("width", hes)
					$("#AccTablehead").find('tr').eq(0).find('th').eq(i).css("width", hes)
				}
			}, 10)
			ufma.hideloading();
		});
		// }
	})
	$(document).on("change", '#caEditEleAcc', function () {
		$("#caEditEleAccrule").html($("#caEditEleAcc option:selected").attr('data-tixi'))
		$("#caEditEleAcctext").html($("#caEditEleAcc option:selected").html())
		if ($("#caEditEleAcc option:selected").attr('data-ispx') > 1) {
			$("#isParallel").prop('checked', true)
			$("#isParallel").parent(".btn").addClass("active")
			$("#isParallels").prop('checked', false)
			$("#isParallels").parent(".btn").removeClass("active")
			$(".ispx").show()
		} else {
			$("#isParallels").prop('checked', true)
			$("#isParallels").parent(".btn").addClass("active")
			$("#isParallel").prop('checked', false)
			$("#isParallel").parent(".btn").removeClass("active")
			$(".ispx").hide()
		}
		page.issueType();
		var runs = {
			'agencyCode': '*',
			'accsCode': $("#caEditEleAcc option:selected").attr('value')
		}
		ufma.ajaxDef("/ma/sys/coaAcc/queryAcce", 'get', runs, function (data) {
			var ts = ''
			for (var i = 0; i < data.data.length; i++) {
				ts += '<li><a href="javascript:;" data-status="' + data.data[i].chrCode + '">' + data.data[i].chrName + '</a></li>'
			}
			$(".accnab").html(ts);
			if (data.data.length > 0) {
				$(".accnab li").eq(0).addClass('active')
			}
		});
		var runds = {
			'accsCode': $("#caEditEleAcc option:selected").attr('value'),
			'agencyTypeCode': $("#coAccEdit #agencyType option:checked").attr('value'),
			'agencyCode': page.treeAgency.getValue(),
			'acctCode': '*',
			'acceCode': $(".accnab .active").find('a').attr('data-status')
		}
		ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTableForNewAcct", 'get', runds, function (data) { //由于多区划所以将“/ma/sys/coaAcc/queryAccoTable”改为“/ma/sys/coaAcc/queryAccoTableForNewAcct”并且单位传入的是用户选择的单位--zsj--bug79430
			//var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>差异项登记</th><th>科目类型</th><th>级次</th><tr>'
			//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
			var tr = '<tr><th>科目代码</th><th>科目名称</th><th>辅项信息</th><th>会计要素</th><th>余额方向</th><th>备查登记</th><th>科目类型</th><th>级次</th><tr>'
			for (var i = 0; i < data.data.accoList.length; i++) {
				tr += '<tr><td>' + data.data.accoList[i].chrCode + '</td>'
				tr += '<td>' + data.data.accoList[i].chrName + '</td>'
				tr += '<td title="' + data.data.accoList[i].accoItems + '">' + data.data.accoList[i].accoItems + '</td>'
				tr += '<td>' + $(".accnab .active").find('a').text() + '</td>'
				if (data.data.accoList[i].accBal == '1') {
					tr += '<td>借</td>'
				} else {
					tr += '<td>贷</td>'
				}
				if (data.data.accoList[i].isCheckRegister == '1') {
					tr += '<td>是</td>'
				} else {
					tr += '<td>否</td>'
				}
				//CWYXM-7706--经赵雪蕊确认账套新增，会计科目的差异项登记列应去掉--zsj
				/*if(data.data.accoList[i].allowSurplus == '1') {
					tr += '<td>是</td>'
				} else {
					tr += '<td>否</td>'
				}*/
				tr += '<td>' + data.data.accoList[i].accoTypeName + '</td>'
				tr += '<td>' + data.data.accoList[i].levelNum + '</td></tr>'
			}
			$("#AccTable").html(tr)
			setTimeout(function () {
				for (var i = 0; i < $("#AccTable").find('tr').eq(0).find('th').length; i++) {
					var hes = $("#AccTable").find('tr').eq(0).find('th').eq(i)[0].offsetWidth
					$("#AccTable").find('tr').eq(0).find('th').eq(i).css("width", hes)
					$("#AccTablehead").find('tr').eq(0).find('th').eq(i).css("width", hes)
				}
			}, 10);

			if ($("#caEditEleAcc option:selected").attr('data-agencyType') == 1) {
				page.agencyTypeShow = true;
				$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').removeClass('hidden');
			} else {
				page.agencyTypeShow = false;
				$('#agencyTypeGroup .control-label,#agencyTypeGroup .control-element').addClass('hidden');
				$('#agencyType').val('');
			}
		});
	})

	function imgShow(outerdiv, innerdiv, bigimg, _this) {
		var src = _this.attr("src"); //获取当前点击的pimg元素中的src属性  
		$(bigimg).attr("src", src); //设置#bigimg元素的src属性  
		/*获取当前点击图片的真实大小，并显示弹出层及大图*/
		$("<img/>").attr("src", src).load(function () {
			var windowW = $(window).width(); //获取当前窗口宽度  
			var windowH = $(window).height(); //获取当前窗口高度  
			var realWidth = this.width; //获取图片真实宽度  
			var realHeight = this.height; //获取图片真实高度  
			var imgWidth, imgHeight;
			var scale = 0.8; //缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

			if (realHeight > windowH * scale) { //判断图片高度  
				imgHeight = windowH * scale; //如大于窗口高度，图片高度进行缩放  
				imgWidth = imgHeight / realHeight * realWidth; //等比例缩放宽度  
				if (imgWidth > windowW * scale) { //如宽度扔大于窗口宽度  
					imgWidth = windowW * scale; //再对宽度进行缩放  
				}
			} else if (realWidth > windowW * scale) { //如图片高度合适，判断图片宽度  
				imgWidth = windowW * scale; //如大于窗口宽度，图片宽度进行缩放  
				imgHeight = imgWidth / realWidth * realHeight; //等比例缩放高度  
			} else { //如果图片真实高度和宽度都符合要求，高宽不变  
				imgWidth = realWidth;
				imgHeight = realHeight;
			}
			$(bigimg).css("height", windowH - 5); //以最终的宽度对图片缩放  

			var w = (windowW - imgWidth) / 2; //计算图片与窗口左边距  
			var h = (windowH - imgHeight) / 2; //计算图片与窗口上边距  
			$(innerdiv).css({
				"top": 2,
				"left": '50%',
				'margin-left': '-' + marleft + 'px'
			}); //设置#innerdiv的top和left属性  
			$(outerdiv).fadeIn("fast"); //淡入显示#outerdiv及.pimg
			var marleft = $(innerdiv)[0].offsetWidth / 2
			$(innerdiv).css({
				"top": 2,
				"left": '50%',
				'margin-left': '-' + marleft + 'px'
			})
		});
		$(outerdiv).click(function () { //再次点击淡出消失弹出层  
			$(this).fadeOut("fast");
		});
	}
	$('#acctabdiv').scroll(function () {
		$("#AccTablehead").css('top', $(this).scrollTop())
	})
	$('#aAccTablediv').scroll(function () {
		$("#aAccTablehead").css('top', $(this).scrollTop())
	})
	$(document).on("keyup", "#caEditChrCode", function () {
		var c = $(this);
		if (/[^\d.]/.test(c.val())) { //替换非数字字符  
			var temp_amount = c.val().replace(/[^\d]/g, '');
			$(this).val(temp_amount);
		}
	})
	$(document).on("input", "#caEditChrCode", function () {
		var c = $(this);
		if (/[^\d.]/.test(c.val())) { //替换非数字字符  
			var temp_amount = c.val().replace(/[^\d]/g, '');
			$(this).val(temp_amount);
		}
	})
	/*$(document).on("keyup", "#caEditChrName", function() {
		var c = $(this);
		if(/[^a-zA-Z0-9\u4E00-\u9FA5\(\（\）\)]/.test(c.val())) { //替换非数字字符  
			var temp_amount = c.val().replace(/[^a-zA-Z0-9\u4E00-\u9FA5\(\（\）\)]/g, '');
			$(this).val(temp_amount);
		}
	})
	$(document).on("input", "#caEditChrName", function() {
		var c = $(this);
		if(/[^a-zA-Z0-9\u4E00-\u9FA5\(\（\）\)]/.test(c.val())) { //替换非数字字符  
			var temp_amount = c.val().replace(/[^a-zA-Z0-9\u4E00-\u9FA5\(\（\）\)]/g, '');
			$(this).val(temp_amount);
		}
	})*/
	//bug81726----20190701【财务云8.0】新建账套时，输入账套名称，显示在输入框中的字段有误--针对qq输入法、M输入法等引起“input输入中文时，拼音触发input事件”的问题 
	var containSpecial = RegExp(/[(\ )(\.)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\?)(\】)(\、)(\，)(\,)(\?)(\？)(\》)(\《)(\【)(\")(\")(\“)(\”)(\：)(\‘)(\’)(\|)(\@))(\#)(\￥)(\%)(\……)(\&)(\*)(\-)(\——)(\=)(\+)(\；)(\。)(\·)(\~)]+/);
	$('#caEditChrName').on('blur', function () {
		if (containSpecial.test($(this).val())) { //替换非数字字符  
			//CZSB-796--财政社保项目，账套管理功能项存在跨站点脚本编制。<财政社保资金信息管理系统安全检测提出>--zsj
			var temp_amount = $(this).val().replaceAll(containSpecial, "");
			$(this).val(temp_amount);
		}
	});
});
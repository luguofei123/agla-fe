$(function () {
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
		var r = window.location.search.substr(1).match(reg); //匹配目标参数 
		if (r != null)
			return unescape(r[2]);
		return null; //返回参数值 
	}
	//接口URL集合
	var interfaceURL = {
		checkUsed: "/ma/sys/common/checkUsed" //检验账套是否使用
	};
	var page = function () {
		//检索数据的条件对象
		var liL = 0;
		var ulL = 0;
		var postData = {}
		var searchObj = {}
		var fromChrCodesd = getUrlParam("chrCode")
		if (fromChrCodesd != null) {
			searchObj = {
				agencyCode: "*",
				accsCode: fromChrCodesd,
				enabled: "*"
			}
		} else {
			searchObj = {
				agencyCode: "*",
				accsCode: "*",
				enabled: "*",
				currentPage: 1,
				pageSize: 25
			}
		}
		return {
			initTabs: function (result) {
				var list = result.data.list;
				if (list.length == 0) return false;

				var ts = '';
				if (list[0].eleAccts != undefined) {
					for (var i = 0; i < list[0].eleAccts.length; i++) {
						ts += '<li><a href="javascript:;" code="' + list[0].eleAccts[i].chrCode + '">' + list[0].eleAccts[i].chrName + '</a></li>'
					}
					$(".accnab").html(ts);
					if (list[0].eleAccts.length > 0) {
						//	$(".accnab li").eq(0).trigger('click').css('margin-left', "0px")
						//修改CZSB:火狐浏览器下无法正确对应显示信息的问题--zsj
						$(".accnab li").eq(0).addClass('active').css('margin-left', "0px");
						ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoacc", 'get', {
							'agencyCode': page.cbAgency.getValue(),
							'acctCode': $(".accnab li.active").find('a').attr('code')
						}, function (data) {
							page.getCoAcc(data.data);
							//bug82114--修改根据账套是否区分单位类型来控制单位类型的显示或隐藏--zsj
							if (data.data.agencyTypeCode == '1') {
								$('#agencyType').addClass('hidden');
							} else {
								$('#agencyType').removeClass('hidden');
							}
							postData.lastVer = data.data.lastVer;
						});
					}
					ulL = $(".accnab")[0].offsetWidth;
					liL = 0
					for (var i = 0; i < $(".accnab li").length; i++) {
						liL += $(".accnab li").eq(i)[0].offsetWidth
					}
					if (ulL > liL) {
						$("#btn-left").hide()
						$("#btn-right").hide()
					} else {
						$("#btn-left").show()
						$("#btn-right").show()
					}
				}
			},
			//初始化页面
			initPage: function () {
				//后台获取数据并加载
				//获取门户相关数据
				page.svData = ufma.getCommonData();

				//单位级
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function (data) {
						//改变单位触发事件
						searchObj.agencyCode = page.cbAgency.getValue();
						//初始化页面，加载表格
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initTabs);
						//缓存单位账套
						var params = {
							selAgecncyCode: searchObj.agencyCode,
							selAgecncyName: page.cbAgency.getText()
						}
						ufma.setSelectedVar(params);
					}
				});
				var argu = {
					rgCode: page.svData.svRgCode,
					setYear: page.svData.svSetYear
				};
				ufma.ajaxDef("/ma/sys/eleAgency/getAgencyTree", "get", argu, function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data,
					});
					if (page.agencyCode && $.inArrayJson(result.data, "id", page.agencyCode)) {
						page.cbAgency.val(page.agencyCode);
					} else {
						var agyCode = $.inArrayJson(result.data, "id", page.svData.svAgencyCode);
						if (agyCode != undefined) {
							page.cbAgency.val(page.svData.svAgencyCode);
						} else {
							page.cbAgency.val(result.data[0].id);
						}
					}

				});
				ufma.ajaxDef("/ma/pub/enumerate/AGENCY_TYPE_CODE", 'get', "", function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
					}
					$("#agencyTypecode").html(opt)
				});
				ufma.ajaxDef("/ma/pub/enumerate/TAXPAYER_TYPE_CODE", 'get', "", function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].ENU_CODE + '>' + data.data[i].ENU_NAME + '</option>'
					}
					$("#taxpayerTypecode").html(opt)
				});
				ufma.ajaxDef("/ma/sys/common/getEleTree", 'get', {
					"setYear": page.svData.svSetYear,
					"agencyCode": page.cbAgency.getValue(),
					"rgCode": page.svData.svRgCode,
					"eleCode": 'ACCS'
				}, function (data) {
					var opt = ''
					for (var i = 0; i < data.data.length; i++) {
						opt += '<option value=' + data.data[i].code + '>' + data.data[i].codeName + '</option>'
					}
					$("#caEditEleAcCode").html(opt)
				});
			},
			checkAcctUsed: function (data) {
				$("#taxpayerTypecode").attr("disabled", false);
				var url = "/ma/sys/eleCoacc/checkAcctUsed";
				var chrCodes = [];
				chrCodes.push(data.data.chrCode);
				var argu = {
					"accItemCode": null,
					"accsCode": null,
					"acctCode": null,
					"agencyCode": data.data.agencyCode,
					"checkType": "3",
					"chrCodes": chrCodes,
					"eleCode": "ACCT",
					"rgCode": page.svData.svRgCode,
					"setYear": page.svData.svSetYear
				}
				ufma.post(url, argu, function (result) {
					if (result.data.status != "1") {
						$("#taxpayerTypecode").attr("disabled", true);
					}
				});
			},
			getCoAcc: function (data) {
				page.getCoAccData = data;
				$("#caChrId").attr('value', data.chrId);
				$("#caEditChrName").val(data.chrName)
				$("#caEditChrCode").val(data.chrCode);
				$("#caFiLeader").val(data.fiLeader)
				$("#caEditEleAccNum .control-element span").html(data.accoCount);
				for (var i = 0; i < $("#caEditEleAcCode option").length; i++) {
					if ($("#caEditEleAcCode option").eq(i).attr('value') == data.accsCode) {
						$("#caEditEleAcCode option").eq(i).attr('selected', true);
						$("#caEditEleAcCode option").eq(i).prop('selected', true);
						break;
					}
				}
				if (data.agencyTypeCode == "") {
					$("#agencyTypecode").css("background-color", "#d9d9d9");
					$("#agencyTypecode").val("")
				} else {
					$("#agencyTypecode").css("background-color", "#fff");
					for (var i = 0; i < $("#agencyTypecode option").length; i++) {
						if ($("#agencyTypecode option").eq(i).attr('value') == data.agencyTypeCode) {
							$("#agencyTypecode option").eq(i).attr('selected', true);
							$("#agencyTypecode option").eq(i).prop('selected', true);
							break;
						}
					}
				}

				for (var i = 0; i < $("#taxpayerTypecode option").length; i++) {
					if ($("#taxpayerTypecode option").eq(i).attr('value') == data.taxpayerTypeCode) {
						$("#taxpayerTypecode option").eq(i).attr('selected', true);
						$("#taxpayerTypecode option").eq(i).prop('selected', true);
						break;
					}
				}
				if (data.isParallel == 1) {
					$("#isParallel").prop('checked', true)
					$("#isParallel").parent(".btn").addClass("active")
					$("#isParallels").prop('checked', false)
					$("#isParallels").parent(".btn").removeClass("active")
					$(".ispx").show();
					if (data.isDoubleVou == 0) {
						$("#isDoubleVou").prop('checked', true)
						$("#isDoubleVous").prop('checked', false)
					} else {
						$("#isDoubleVous").prop('checked', true)
						$("#isDoubleVou").prop('checked', false)
					}
				} else {
					$("#isParallels").prop('checked', true)
					$("#isParallels").parent(".btn").addClass("active")
					$("#isParallel").prop('checked', false)
					$("#isParallel").parent(".btn").removeClass("active")
					$(".ispx").hide()
				}
				//CWYXM-11754 --系统管理-账套管理-账套信息是否勾选核算现金流量与基础资料-账套管理的现金流量核算状态应是一致的--zsj
				if (data.isCashFlowAccount == 1) {
					$("#isCashFlowAccount").prop('checked', true)
					$(".isCashFlowAccountY").addClass("active")
					$("#isCashFlowAccounts").prop('checked', false)
					$(".isCashFlowAccountN").removeClass("active")
				} else {
					$("#isCashFlowAccounts").prop('checked', true)
					$(".isCashFlowAccountN").addClass("active")
					$("#isCashFlowAccount").prop('checked', false)
					$(".isCashFlowAccountY").removeClass("active")
				}
				ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoaccHis/" + data.chrId, 'get', "", page.eleCoaccHis);
				page.checkUsed();
			},
			eleCoaccHis: function (data) {
				var pshtml = ''
				if (data.data.length == 1) {
					pshtml += '<p class="voucher-history-by-nr" namess=""><span class="voucher-history-by-time">' + data.data[0].bfLatestOpDate + '</span><span class="jeiduan"></span><span class="voucher-history-by-pz">由' + data.data[0].fiLeader + '创建</span></p>'
				} else {
					for (var i = 0; i < data.data.length - 1; i++) {
						pshtml += '<p class="voucher-history-by-nr" namess=""><span class="voucher-history-by-time">' + data.data[i + 1].bfLatestOpDate + '</span><span class="jeiduan"></span><span class="voucher-history-by-pz">财务负责人由' + data.data[i].fiLeader + '变更为' + data.data[i + 1].fiLeader + '</span></p>'
					}
				}
				$('.voucher-history-by').html(pshtml)
			},
			saveCoAcc: function () {
				//参数设定
				postData.agencyCode = page.cbAgency.getValue();
				postData.chrId = $("#caChrId").attr('value');
				postData.chrName = $("#caEditChrName").val();
				postData.chrCode = $("#caEditChrCode").val();
				postData.accsCode = $("#caEditEleAcCode option:selected").val();
				postData.fiLeader = $("#caFiLeader").val();
				postData.carryOverType = '';
				postData.enablePeriod = '1';
				postData.agencyTypeCode = $("#agencyTypecode option:selected").attr('value');
				postData.taxpayerTypeCode = $("#taxpayerTypecode option:selected").attr('value');
				// if($("#isParallel").is(':checked')) {
				// 	postData.isParallel = 1
				// 	if($("#isDoubleVou").is(':checked')) {
				// 		postData.isDoubleVou = 0
				// 	} else {
				// 		postData.isDoubleVou = 1
				// 	}
				// } else {
				// 	postData.isParallel = 0
				// 	postData.isDoubleVou = ''
				// }
				postData.isParallel = page.getCoAccData.isParallel;
				postData.isDoubleVou = page.getCoAccData.isDoubleVou;
				if ($("#isCashFlowAccount").is(':checked')) {
					postData.isCashFlowAccount = '1';
				} else {
					postData.isCashFlowAccount = '0';
				}
				postData.isDefaultAcct = 0;
				postData.setYear = page.svData.svSetYear;
				postData.rgCode = page.svData.svRgCode;
				return postData;
			},
			checkUsed: function () {
				var agru = {
					agencyCode: page.cbAgency.getValue(),
					eleCode: "ACCT",
					chrCodes: [page.getCoAccData.chrCode],
					rgCode: page.svData.svRgCode,
					setYear: page.svData.svSetYear,
				};
				ufma.post(interfaceURL.checkUsed, agru, function (result) {
					if (result.data) {
						$("#taxpayerTypecode").attr("disabled", true);
					} else {
						$("#taxpayerTypecode").attr("disabled", false);
					}
				});
			},
			queryData: function () {
				ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoacc", 'get', {
					'agencyCode': page.cbAgency.getValue(),
					'acctCode': $(".accnab li.active").find('a').attr('code')
				}, function (data) {
					page.getCoAcc(data.data);
					postData.lastVer = data.data.lastVer;
				});
			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				$(document).on('click', ".accnab li", function () {
					if ($(this).hasClass('active') != true) {
						$('.accnab li').removeClass('active')
						$(this).addClass('active')
						ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoacc", 'get', {
							'agencyCode': page.cbAgency.getValue(),
							'acctCode': $(this).find('a').attr('code')
						}, function (data) {
							page.getCoAcc(data.data);
							//bug82114--修改根据账套是否区分单位类型来控制单位类型的显示或隐藏--zsj
							if (data.data.agencyTypeCode == '1') {
								$('#agencyType').addClass('hidden');
							} else {
								$('#agencyType').removeClass('hidden');
							}
							postData.lastVer = data.data.lastVer;
						});
					}
				})
				$(document).on('click', '#btn-save', function () {
					page.saveCoAcc()
					var callback = function (result) {
						ufma.showTip(result.msg, function () {

						}, result.flag);
						page.queryData();
						ufma.hideloading();
					}
					ufma.showloading('保存中，请耐心等待...');
					ufma.post("/ma/sys/eleCoacc/saveCoacc", postData, callback);
					//$(document).find(".accnab li").trigger('click'); //bug79079

				})
				$(document).on('click', '#btn-right', function () {
					var str = $(".accnab li").eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					if (liL - ulL - parseFloat(strin) > 100) {
						var lis = parseFloat(strin) + 100
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					} else {
						var lis = liL - ulL
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					}
				})
				$(document).on('click', '#btn-left', function () {
					var str = $(".accnab li").eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					if (parseFloat(strin) > 100) {
						var lis = parseFloat(strin) - 100
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					} else {
						var lis = liL - ulL
						$(".accnab li").eq(0).css('margin-left', '0px')
					}
				})
				$(document).on('click', '.OftenUrl .ashbody span', function () {
					var url = $(this).attr('data-href'); //.replaceAll(/..\/..\/../g,'');
					url = url + "&jumpAcctCode=" + $("#caEditChrCode").val(); //增加跳转账套 guohx 
					var title = $(this).attr('data-title');
					//window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, title);
				});
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				this.initPage();
				this.onEventListener();
				// ufma.setPortalHeight();
				// ufma.parse();
				ufma.parseScroll();
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
	page.init();
});
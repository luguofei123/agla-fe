$(function () {
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	window.closepost = function (action, msg) {
		if (window.closeOwner) {
			var data = {
				action: action,
				msg: msg
			};
			window.closeOwner(data);
		}
	}
	//接口URL集合
	var interfaceURL = {
		checkUsed: "/ma/sys/common/checkUsed"//检验账套是否使用
	};
	var page = function () {

		//向后台传参的对象
		var postData = {};
		var cAction = 'close';

		var codeRule;
		var isRuled;

		return {

			//表单验证提示信息
			getErrMsg: function (errcode) {
				var error = {
					0: '请选择单位',
					1: '请选择科目体系',
					2: '账套名称不能为空',
					3: '财务负责人不能为空',
					4: '账套编码不能为空',
					5: '您选择的科目体系无会计要素，请先在科目体系界面添加会计要素！',
					6: '账套编码只能英文和数字',
					9: '编码不符合编码规则:'
				}
				return error[errcode];
			},

			//$.ajax()，加载单位下拉列表
			/*initAgency:function(result){
				var data = result.data;
				
				//全部option节点
				var $allOp = $('<option value="*"> </option>');
				$("#coAccEdit #caAddAgency").append($allOp);
				//循环创建并添加单位节点
				for(var i=0;i<data.length;i++){
					var $agencyOp = $('<option data-pid="'+data[i].pId+'" value="'+data[i].id+'">'+data[i].name+'</option>');
					$("#coAccEdit #caAddAgency").append($agencyOp);
				}
				
				page.formdata=$('#coAccEdit').serializeObject();
			},*/
			initAgency: function (result) {
				var data = result.data;
				/*var all = {
					"id": "0",
					"pId": "0",
					"name": "全部",
					"agencyType": "0"
				};
				data.unshift(all);*/
				page.treeAgency = $("#treeAgency").ufmaTreecombox({
					valueField: 'id',
					textField: 'codeName',
					readOnly: false,
					leafRequire: true,
					popupWidth: 1.5,
					data: data,
					onchange: function (data) {

					}
				});
			},

			//$.ajax()，获取编码规则
			getCodeRule: function () {
				// codeRule = "3-2-2-2-2-2";
				// var callback = function(result) {
				// 	var cRule = result.codeRule;
				// 	if(cRule != null && cRule != "") {
				// 		codeRule = cRule;
				// 	}
				// }
				// ufma.get("/ma/sys/element/getElementCodeRule?tableName=MA_ELE_ACCT", "", callback);

				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: 'ACCT',
					agencyCode: '*', //临时 guohx
					rgCode: ma.rgCode,
					setYear: ma.setYear
				});
				codeRule = "3-2-2-2-2-2";
				if (!$.isNull(ma.fjfa)) {
					codeRule = ma.fjfa;
				}
			},


			//根据chrId，获取财务负责人变更信息，接口：/ma/sys/eleCoacc/getCoCoaccHis/+chrId，并获取页面为使用数据内容
			eleCoaccHis: function (result) {
				var data = result.data;
				if (data != null && data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						var bfTime = data[i].bfLatestOpDate;
						bfTime = bfTime.substring(0, bfTime.indexOf(" "));
						bfTime = bfTime.replace(/\\/g, "-");
						var fName = data[i].fiLeader == null ? "" : data[i].fiLeader;
						var $li;
						if (data[i].latestOpDate != null) {
							$li = $('<li>' + bfTime + '~' + data[i].latestOpDate + ' ' + fName + '</li>');
						} else {
							$li = $('<li>' + bfTime + ' 至今 ' + fName + '</li>');
						}
						$("#project-ul").append($li);
					}
					var showdata = data[data.length - 1]
					if (showdata.agencyTypeCode == "") {
						$("#agencyTypecode").css("background-color", "#d9d9d9");
						$("#agencyTypecode").val("")
					} else {
						$("#agencyTypecode").css("background-color", "#fff");
						for (var i = 0; i < $("#agencyTypecode").find('option').length; i++) {
							if ($("#agencyTypecode").find('option').eq(i).attr('value') == showdata.agencyTypeCode) {
								$("#agencyTypecode").find('option').eq(i).prop('selected', true)
							}
						}
					}
					for (var i = 0; i < $("#taxpayerTypecode").find('option').length; i++) {
						if ($("#taxpayerTypecode").find('option').eq(i).attr('value') == showdata.taxpayerTypeCode) {
							$("#taxpayerTypecode").find('option').eq(i).prop('selected', true)
						}
					}
					for (var i = 0; i < $("#enablePeriod").find('option').length; i++) {
						if ($("#enablePeriod").find('option').eq(i).attr('value') == showdata.enablePeriod) {
							$("#enablePeriod").find('option').eq(i).prop('selected', true)
						}
					}
					if (showdata.isParallel == 1) {
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
					if (showdata.isCashFlowAccount == 1) {
						$("#isCashFlowAccount").prop('checked', true)
					} else {
						$("#isCashFlowAccount").prop('checked', false)
					}
					if (showdata.isDoubleVou == 0) {
						$("#isDoubleVou").prop('checked', true)
						$("#isDoubleVous").prop('checked', false)
					} else {
						$("#isDoubleVou").prop('checked', false)
						$("#isDoubleVous").prop('checked', true)
					}

				}
			},

			//$.ajax()，加载科目体系按钮
			initEleAcc: function (result) {
				var data = window.ownerData.data.accsData;

				//全部option节点
				var $allOp = $('<option value="*"> </option>');
				$("#coAccEdit #caEditEleAcc").append($allOp);
				//循环创建科目体系按钮
				for (var i = 0; i < data.length; i++) {
					var $eleAccOp;
					if (window.ownerData.action == "edit" && window.ownerData.data.accsCode == data[i].code) {
						$eleAccOp = $('<option value="' + data[i].code + '" data-carryovertype="' + data[i].carryOverType + '" data-accacount="' + data[i].accaCount + '" selected="selected">' + data[i].codeName + '</option>');
					} else {
						$eleAccOp = $('<option value="' + data[i].code + '" data-carryovertype="' + data[i].carryOverType + '" data-accacount="' + data[i].accaCount + '">' + data[i].codeName + '</option>');
					}
					$("#coAccEdit #caEditEleAcc").append($eleAccOp);
				}

				page.formdata = $('#coAccEdit').serializeObject();
			},
			checkUsed:function(){
				var agru = {
					agencyCode: window.ownerData.data.agencyCode,
					eleCode:"ACCT",
					chrCodes: [window.ownerData.data.chrCode],
					rgCode:window.ownerData.data.rgCode,
					setYear:window.ownerData.data.setYear,
				};
				ufma.post(interfaceURL.checkUsed, agru, function (result) {
					if(result.data){
						$("#taxpayerTypecode").attr("disabled",true);
					}
				});
			},
			initPage: function () {
				//获取编码规则
				this.getCodeRule();
				page.initEleAcc();
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
				//判断action
				if (window.ownerData.action == 'edit') {
					//账套保存成功后值允许修改财务负责人和纳税人类型，其他一律不能修改
					$("#caEditChrName").attr("disabled",true);
					$("#caEditEleAcc").attr("disabled",true);
					$("#agencyTypecode").attr("disabled",true);

					page.checkUsed();
					var data = window.ownerData.data;
                    //bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
					if(data.accsCodeType == '0') {
						$('#agencyType').addClass('hidden');
					} else {
						$('#agencyType').removeClass('hidden');
					}
					ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoaccHis/" + data.chrId, 'get', "", page.eleCoaccHis);
					ufma.ajaxDef("/ma/sys/eleCoacc/getCoCoacc", 'get', {
						'agencyCode': window.ownerData.data.agencyCode,
						'acctCode': window.ownerData.data.chrCode
					}, function (data) {
						postData.lastVer = data.data.lastVer;
						var showdata = data.data
						for (var i = 0; i < $("#agencyTypecode").find('option').length; i++) {
							if ($("#agencyTypecode").find('option').eq(i).attr('value') == showdata.agencyTypeCode) {
								$("#agencyTypecode").find('option').eq(i).prop('selected', true)
							}
						}

						for (var i = 0; i < $("#taxpayerTypecode").find('option').length; i++) {
							if ($("#taxpayerTypecode").find('option').eq(i).attr('value') == showdata.taxpayerTypeCode) {
								$("#taxpayerTypecode").find('option').eq(i).prop('selected', true)
							}
						}
						for (var i = 0; i < $("#enablePeriod").find('option').length; i++) {
							if ($("#enablePeriod").find('option').eq(i).attr('value') == showdata.enablePeriod) {
								$("#enablePeriod").find('option').eq(i).prop('selected', true)
							}
						}
						if (showdata.isParallel == 1) {
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
						if (showdata.isCashFlowAccount == 1) {
							$("#isCashFlowAccount").prop('checked', true)
						} else {
							$("#isCashFlowAccount").prop('checked', false)
						}
						if (showdata.isDoubleVou == 0) {
							$("#isDoubleVou").prop('checked', true)
							$("#isDoubleVous").prop('checked', false)
						} else {
							$("#isDoubleVou").prop('checked', false)
							$("#isDoubleVous").prop('checked', true)
						}
					});

					if (data.lType == "system") {
						var isUseAcctCallback = function (result) {
							var isType = result.data;
							//if(isType == 0) {
							var $accs = $('<option value="' + data.accsCode + '">' + data.accsName + '</option>');
							$("#coAccEdit #caEditEleAcc").append($accs);

							$("#coAccEdit #caEditChrName").prop("disabled", true);
							$("#coAccEdit #caEditEleAcc").prop("disabled", true);
							$("#coAccEdit #caCarryOverTypes label").attr("disabled", true);
							$("#coAccEdit #caIsParallel label").attr("disabled", true);
							$("#coAccEdit #caCarryOverTypes input").attr("disabled", true);
							$("#coAccEdit #caIsParallel input").attr("disabled", true);
							$("#coAccEdit #agencyTypecode").attr("disabled", true);
							//$("#coAccEdit #taxpayerTypecode").attr("disabled", true);
							$("#coAccEdit #enablePeriod").attr("disabled", true);
							$("#isCashFlowAccount").attr("disabled", true);
							page.formdata = $('#coAccEdit').serializeObject();
							//} else {
							//初始化页面，加载科目体系按钮
							ufma.get("/ma/sys/eleAcc/seltAccs", "", page.initEleAcc);

							//}
						}
						//临时注释,以后再调 guohx
						//ufma.get("/ma/sys/eleCoacc/isUseAcct?agencyCode=" + data.agencyCode + "&chrCode=" + data.chrCode, "", isUseAcctCallback);
					}

					/*var $agency = $('<option value="'+data.agencyCode+'">'+data.agencyName+'</option>');
					$("#coAccEdit #caAddAgency").append($agency);*/
					$("#coAccEdit #treeAgency").parent().html('<select class="form-control" name="agency" id="caAddAgency" require-all=1>' +
						'<option value="' + data.agencyCode + '" selected="selected">' + data.agencyName + '</option></select>');
					$("#coAccEdit input[type='hidden']").attr("data-enabled", data.enabled);
					$("#coAccEdit input[type='hidden']").val(data.chrId);
					$("#coAccEdit #caEditChrName").val(data.chrName);
					$("#coAccEdit #caEditChrCode").val(data.chrCode);

					$("#coAccEdit #caFiLeader").val(data.fiLeader);
					$("#coAccEdit #caCarryOverTypes input[value='" + data.carryOverType + "']").prop("checked", true).parents("label").addClass("active").siblings().removeClass("active");

					$("#coAccEdit #caAddAgency").prop("disabled", true);
					$("#coAccEdit #caEditChrCode").prop("disabled", true);

					//判断系统级和单位级编辑
					if (data.lType == "unit") {
						//单位级
						var $accs = $('<option value="' + data.accsCode + '">' + data.accsName + '</option>');
						$("#coAccEdit #caEditEleAcc").append($accs);

						$("#coAccEdit #caEditChrName").prop("disabled", true);
						$("#coAccEdit #caEditEleAcc").prop("disabled", true);
						$("#coAccEdit #caCarryOverTypes label").attr("disabled", true);
						$("#coAccEdit #caIsParallel label").attr("disabled", true);
						$("#coAccEdit #caCarryOverTypes input").attr("disabled", true);
						$("#coAccEdit #caIsParallel input").attr("disabled", true);
						$("#coAccEdit #agencyTypecode").attr("disabled", true);
						$("#coAccEdit #taxpayerTypecode").attr("disabled", true);
						$("#coAccEdit #enablePeriod").attr("disabled", true);
						$("#isCashFlowAccount").attr("disabled", true);
						$("#btn-save-add").hide();
						$("#btn-save").removeClass("btn-default").addClass("btn-primary");

						this.formdata = $('#coAccEdit').serializeObject();
					}
				} else if (window.ownerData.action == 'add') {
					//初始化页面，加载单位下拉
					ufma.get("/ma/sys/eleAgency/getAgencyTree", "", this.initAgency);

					// //初始化页面，加载科目体系按钮
					// ufma.get("/ma/sys/eleAcc/seltAccs", "", this.initEleAcc);
				}
			},

			//新增事件
			saveCoAcc: function () {

				//参数设定
				/*postData.agencyCode = $("#coAccEdit #caAddAgency option:selected").val();*/
				if (!$("#coAccEdit #treeAgency").get(0)) {
					postData.agencyCode = $("#coAccEdit #caAddAgency option:selected").val();
				} else {
					postData.agencyCode = page.treeAgency.getValue();
				}
				//				postData.enabled = $("#coAccEdit input[type='hidden']").attr("data-enabled");
				postData.chrId = $("#coAccEdit input[type='hidden']").val();
				postData.chrName = $("#coAccEdit #caEditChrName").val();
				postData.chrCode = $("#coAccEdit #caEditChrCode").val();
				postData.accsCode = $("#coAccEdit #caEditEleAcc option:selected").val();
				postData.fiLeader = $("#coAccEdit #caFiLeader").val();
				postData.carryOverType = '';
				postData.enablePeriod = $("#enablePeriod option:checked").attr('value');
				postData.agencyTypeCode = $("#coAccEdit #agencyTypecode option:checked").attr('value');
				postData.taxpayerTypeCode = $("#coAccEdit  #taxpayerTypecode option:checked").attr('value');
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
				postData.isDefaultAcct = 0;
				if (window.ownerData.action == 'edit') {
					postData.setYear = window.ownerData.data.setYear;
					postData.rgCode = window.ownerData.data.rgCode;
				}

				return postData;
			},
			checkForm: function () {
				var msg = '';
				if (postData.agencyCode == '') {
					msg = '请选择单位！';
				} else if (postData.chrCode == '') {
					msg = '请输入账套编码！';
				} else if (postData.chrName == '') {
					msg = '请输入账套名称！';
				} else if (postData.accsCode == '') {
					msg = '请选择科目体系！';
				} else if (postData.fiLeader == '') {
					msg = '请输入财务负责人！';
				}
				if (msg != '') {
					ufma.showTip(msg, function () { }, 'error');
					return false;
				}
				return true;
			},
			save: function () {
				page.saveCoAcc();
				if (!this.checkForm()) {
					return false;
				}

				var callback = function (result) {
					ufma.hideloading();
					cAction = 'save';
					msg = result.msg;
					closepost(cAction, msg);
				}
				ufma.showloading('保存中，请耐心等待...');
				ufma.post("/ma/sys/eleCoacc/saveCoacc", postData, callback);
			},
            checkAcctUsed:function(){
			    var url = "/ma/sys/eleCoacc/checkAcctUsed";
			    var chrCodes = [];
                chrCodes.push($("#coAccEdit #caEditChrCode").val());
			    var argu = {
                    "accItemCode": null,
                    "accsCode": null,
                    "acctCode": null,
                    "agencyCode": window.ownerData.data.agencyCode,
                    "checkType": "3",
                    "chrCodes": chrCodes,
                    "eleCode": "ACCT",
                    "rgCode": window.ownerData.data.rgCode,
                    "setYear": window.ownerData.data.setYear
                }
                ufma.post(url,argu,function (result) {
                    //status 1  都未使用    2 部分使用   3 全部被使用
                    //successChrCodes   未使用的账套列表
                    // failChrCodes   已使用的账套列表
                    if(result.data.status != "1"){
                        $("#coAccEdit #taxpayerTypecode").attr("disabled", true);
                    }
                });
            },

			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				//				//根据action判断页面功能，进行不同的操作
				this.initPage();
				ufma.parse();
				//      		page.formdata=$('#coAccEdit').serializeObject();

				//点击保存的事件
				$('#btn-save').on('click', function () {
					if (!$("#coAccEdit .form-horizontal .form-group.error").get(0)) {
						//$('.ufma-layout-down button').attr("disabled","disabled");
						page.save();
					}
				});

				//点击取消的事件
				$('#btn-close').on('click', function () {
					var tmpFormData = $('#coAccEdit').serializeObject();
					if (!ufma.jsonContained(page.formdata, tmpFormData)) {
						ufma.confirm('您修改了账套信息，关闭前是否保存？', function (action) {
							if (action) {
								page.save();
							} else {
								_close(cAction);
							}
						});
					} else {
						_close(cAction);
					}
				});

				$('#btn-save-add').on('click', function () {
					if (!$("#coAccEdit .form-horizontal .form-group.error").get(0)) {
						page.saveCoAcc();

						var callback = function (result) {
							ufma.showTip(result.msg, function () { }, result.flag);

							if (result.flag == "success") {
								$('#coAccEdit form')[0].reset();
								page.formdata = $('#coAccEdit').serializeObject();
							}

							cAction = 'save';
							//revise
							$("#coAccEdit #caAddAgency").prop("disabled", false);
							$("#coAccEdit #caEditChrCode").prop("disabled", false);
						}

						ufma.post("/ma/sys/eleCoacc/saveCoacc", postData, callback);
					}
				});

				/*----表单验证  开始----*/
				//单位表单
				$("#caAddAgency").on("blur change", function () {
					if ($(this).val() == "*") {
						ufma.showInputHelp("caAddAgency", '<span class="error">' + page.getErrMsg(0) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp("caAddAgency");
						$(this).closest('.form-group').removeClass('error');
					}
				});

				//科目体系表单
				$("#caEditEleAcc").on("blur change", function () {
					if ($(this).val() == "*") {
						ufma.showInputHelp("caEditEleAcc", '<span class="error">' + page.getErrMsg(1) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						//根据科目体系carryOverType，带出结账方式
						var carryOverType = $(this).find("option:selected").attr('data-carryovertype');
						$("#coAccEdit #caCarryOverTypes input[value='" + carryOverType + "']").prop("checked", true).parents("label").addClass("active").siblings().removeClass("active");

						//根据科目体系accaCount，判断平行记账
						if ($(this).find("option:selected").attr('data-accacount') == "2") {
							$("#coAccEdit #caIsParallel input[value='1']").prop("checked", true).parents("label").addClass("active").siblings().removeClass("active");
							ufma.hideInputHelp("caEditEleAcc");
							$(this).closest('.form-group').removeClass('error');
							$("#btn-save-add,#btn-save").prop("disabled", false);
						} else if ($(this).find("option:selected").attr('data-accacount') == "1") {
							$("#coAccEdit #caIsParallel input[value='0']").prop("checked", true).parents("label").addClass("active").siblings().removeClass("active");
							ufma.hideInputHelp("caEditEleAcc");
							$(this).closest('.form-group').removeClass('error');
							$("#btn-save-add,#btn-save").prop("disabled", false);
						} else if ($(this).find("option:selected").attr('data-accacount') == "0") {
							$("#coAccEdit #caIsParallel input[value='0']").prop("checked", true).parents("label").addClass("active").siblings().removeClass("active");
							ufma.showInputHelp("caEditEleAcc", '<span class="error">' + page.getErrMsg(5) + '</span>');
							$(this).closest('.form-group').addClass('error');
							$("#btn-save-add,#btn-save").prop("disabled", true);
						}
						if ($(this).find("option:selected").attr('data-accacount') > 1) {
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
				});

				//账套名称
				$("#caEditChrName").on('focus', function () {
					ufma.hideInputHelp("caEditChrName");
					$(this).closest('.form-group').removeClass('error');
				}).on('blur', function () {
					if ($(this).val() == "") {
						ufma.showInputHelp("caEditChrName", '<span class="error">' + page.getErrMsg(2) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp("caEditChrName");
						$(this).closest('.form-group').removeClass('error');
					}
				});

				//财务负责人
				$("#caFiLeader").on('focus', function () {
					ufma.hideInputHelp("caFiLeader");
					$(this).closest('.form-group').removeClass('error');
				}).on('blur', function () {
					if ($(this).val() == "") {
						ufma.showInputHelp("caFiLeader", '<span class="error">' + page.getErrMsg(3) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp("caFiLeader");
						$(this).closest('.form-group').removeClass('error');
					}
				});

				//账套编码
				$("#caEditChrCode").on('focus paste keyup change', function (e) {
					e.stopepropagation;
					ufma.hideInputHelp("caEditChrCode");
					$(this).closest('.form-group').removeClass('error');
					var textVal = $(this).val();

					var str = ufma.splitDMByFA(codeRule, textVal);
					isRuled = str.isRuled;
				}).on('blur', function () {
					var reg = /^[0-9a-zA-Z]*$/g;
					if ($(this).val() == "") {
						ufma.showInputHelp('caEditChrCode', '<span class="error">' + page.getErrMsg(4) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else if (!isRuled) {
						ufma.showInputHelp('caEditChrCode', '<span class="error">' + page.getErrMsg(9) + ' ' + codeRule + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else if (!reg.test($(this).val())) {
						ufma.showInputHelp('caEditChrCode', '<span class="error">' + page.getErrMsg(6) + '</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp("caEditChrCode");
						$(this).closest('.form-group').removeClass('error');
					}
				});
				/*----表单验证  结束----*/
			}
		}
	}();
	/////////////////////
	page.init();
	$(document).on("change", '#isParallel', function () {
		if ($(this).is(":checked")) {
			$(".ispx").show()
		} else {
			$(".ispx").hide()
		}
	})
});
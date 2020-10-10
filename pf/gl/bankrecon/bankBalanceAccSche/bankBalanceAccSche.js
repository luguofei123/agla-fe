$(function () {
	var page = function () {

		//对账方案接口
		var portList = {
			agencyList: "/gl/eleAgency/getAgencyTree",//单位列表接口
			accScheList: "/gl/bank/recon/getBankReconSche",//方案列表接口
			deleteAccSche: "/gl/bank/recon/deleteReconSche",//删除对账方案
			getOneAccSche: "/gl/bank/recon/getBankRecon",//请求单个对账方案的内容
		};

		return {
			namespace: 'bankBalAccSche',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},

			//获取对账方案列表
			reqMethod: function () {
				var argu = {
					"agencyCode": page.agencyCode
				}
				ufma.get(portList.accScheList, argu, function (result) {
					var data = result.data;
					var cartHtml = "";
					var bgcolor = ['#D19DEF', '#63BEFF', '#FFD149', '#64DDA0', '#FFA0A0'];
					if (data.length == 0) {
						var cartHtml = ufma.htmFormat('<img src="../../../images/accNoData.png"  style="width:150px;height:150px;position:absolute;top:43%;left:43%">' +
							'<div class="actions" style="position:absolute;top:75%;left:38%">' +
							'<span style="color:#999999">您还没有对账方案哦，点击</span>' +
							'<a style="text-decoration:none;cursor:pointer"  href="javascript:void(0)" class="noAdd"> 新增 </a>' +
							'<span style="color:#999999">按钮~</span>' +
							'</div>')
					}
					else {
						for (var i = 0; i < data.length; i++) {
							var index = (i + 1) % 5;
							var oneCartHtml = ufma.htmFormat('<div class="col-md-3 p8">' +
								'<div class="ufma-card ufma-card-icon">' +
								'<div style="background-color:<%=color%>" class="card-icon">' +
								'<span class="icon" color-index="3"><span class="icon"><%=icon%></span></span>' +
								'</div>' +
								'<div class="ufma-card-header"><%=schemaName%></div>' +
								'<div class="ufma-card-body">' +
								'<div class="uf-text-overflow2" title="<%=remark%>">' +
								'<%=remark%>' +
								'</div>' +
								'</div>' +
								'<div class="ufma-card-footer" data-id="<%=schemaGuid%>">' +
								'<a class="btn-label btn-setup btn-permission">' +
								'<i class="glyphicon icon-setting"></i>设置' +
								'</a>&nbsp;' +
								'<a class="btn-label btn-delete btn-permission">' +
								'<i class="glyphicon icon-trash"></i>删除' +
								'</a>' +
								'</div>' +
								'</div>' +
								'</div>', {
									icon: data[i].schemaName.charAt(0),
									color: bgcolor[index],
									schemaName: data[i].schemaName,
									remark: data[i].remark,
									schemaGuid: data[i].schemaGuid
								});
							cartHtml += oneCartHtml;
						}
					}

					$("#cartList").html(cartHtml);
					ufma.isShow(reslist);
					if ($('.noAdd')) {
						$('.noAdd').on('click', function () {
							$('.btn-add').trigger('click');
						})
					}
				})
			},

			//打开模态框
			openEdtWin: function (action, obj) {
				var actionName = "";
				if (action == "add") {
					actionName = "新增对账方案";
				} else if (action == "edit") {
					actionName = "编辑对账方案";
				}
				var param = {};
				param["action"] = action;
				param["agencyCode"] = page.cbAgency.getValue();
				param["agencyName"] = page.cbAgency.getText();
				param["rgCode"] = page.rgCode;
				param["setYear"] = page.setYear;
				param["data"] = obj;
				ufma.open({
					url: "setAccSche.html",
					title: actionName,
					width: 1090,
					data: param,
					ondestory: function (data) {
						//guohx 增加判断条件，当关闭弹窗X号时 也需要刷新对账方案
						if (data.action == "save" || data.action == "saveadd" || $.isNull(data.action)) {
							//获取对账方案列表
							page.reqMethod();
						}
					}
				});
			},

			onEventListener: function () {
				//新增
				$('.btn-add').on('click', function (e) {
					e.preventDefault();
					page.action = "add";
					var data = $('#accScheForm').serializeObject();
					page.openEdtWin(page.action, data);
				});
				//编辑设置
				$('#cartList').on('click', '.btn-setup', function (e) {
					e.preventDefault();
					page.action = "edit";
					var data = {};
					data.schemaGuid = $(this).parent(".ufma-card-footer").data("id");
					page.openEdtWin(page.action, data);
				});

				//删除方案
				$("#cartList").on('click', '.btn-delete', function (e) {
					e.preventDefault();
					var argu = {
						schemaGuid: $(this).parent(".ufma-card-footer").data("id")
					}
					ufma.ajaxDef(portList.getOneAccSche, "get", argu, function (result) {
						if (result.flag == 'success') {
							var isUpdate = result.data.isUpdate;
							if (isUpdate > 0) {
								ufma.showTip("该方案已经被使用,不可以删除！", function () { }, "warning");
								return false;
							} else {
								ufma.confirm("您确认删除该方案吗？", function (action) {
									if (action) {
										ufma.delete(portList.deleteAccSche, argu, function (result) {
											ufma.showTip(result.msg, function () { }, result.flag);
											//获取对账方案列表
											page.reqMethod();
										});
									}
								}, { type: 'warning' });
							}
						}
					});
				});
			},

			//初始化页面
			initPage: function () {
				var pfData = ufma.getCommonData();
				page.nowDate = pfData.svTransDate;//当前年月日
				page.rgCode = pfData.svRgCode;//区划代码

				page.setYear = pfData.svSetYear;//本年 年度
				page.month = pfData.svFiscalPeriod;//本期 月份
				page.today = pfData.svTransDate;//今日 年月日

				//修改权限  将svUserCode改为 svUserId  20181012
				page.userId = pfData.svUserId; //登录用户ID
				// page.userId = pfData.svUserCode; //登录用户ID
				page.userName = pfData.svUserName;//登录用户名称
				page.agencyCode = pfData.svAgencyCode;//登录单位代码
				page.agencyName = pfData.svAgencyName;//登录单位名称

				//初始化单位列表样式
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择单位',
					icon: 'icon-unit',
					readOnly: false,
					onchange: function (data) {
						//给全局单位变量赋值
						page.agencyCode = data.id;
						page.agencyName = data.name;
						//缓存单位账套
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);

						//获取对账方案列表
						page.reqMethod();
					}
				});

				//请求单位列表
				ufma.ajax(portList.agencyList, "get", { "rgCode": page.rgCode, "setYear": page.setYear }, function (result) {
					var data = result.data;
					var cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});

					var code = data[0].id;
					var name = data[0].name;

					if (page.agencyCode != "" && page.agencyName != "") {
						var agency = $.inArrayJson(data, 'id', page.agencyCode);
						if (agency != undefined) {
							cbAgency.val(page.agencyCode);
						} else {
							cbAgency.val(code);
							page.agencyCode = code;
							page.agencyName = name;
						}
					} else {
						cbAgency.val(code);
						page.agencyCode = code;
						page.agencyName = name;
					}

					//获取对账方案列表
					page.reqMethod();
				});


			},

			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				this.initPage();
				this.onEventListener();
			}
		}
	}();

	page.init();
});
$(function () {
	var bgItemTable = "items-selected-table";

	var newCtrlItemForName = function (name) {
		return {
			ruleEleName: name,
			ruleEleValue: "",
			ruleEleLength: "",
			ruleEleValuetype: "",
			chrName: "",
			busBillId: ""
		};
	};

	/**
	 * 表格金额输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_cellChange = function (value, doc) {
		var tbl = $("#" + bgItemTable).DataTable();
		var val = value;
		if (val == null) {
			val = '';
		}
		tbl.cell(doc).data(val);
		tbl.row(doc).data().shouldSave = "1";
	}

	var page = function () {
		// 定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrCode, chrName, remark;
		// 传输设置数据的对象
		var fromSys;
		var postSet;
		var budgetModel = {
			items: []
		};
		var tempCrtlPlan;
		var agencyCode;
		var selectedItems;
		var leftItems;
		var ctrlItems = [
			newCtrlItemForName("前缀"),
			newCtrlItemForName("年度"),
			newCtrlItemForName("月份"),
			newCtrlItemForName("日期"),
			newCtrlItemForName("流水号"),
			newCtrlItemForName("字符"),
			newCtrlItemForName("后缀")
		];

		return {
			namespace: 'crtlPlan',
			curData: budgetModel,
			editMode: 'new',
			get: function (tag) {
				return $('#' + page.namespace).find(tag);
			},
			/**
			 * 根据data执行重新绘制表格的行为
			 */
			drawSelectedItemsTable: function (pData) {
				var bgitemTbl = $("#" + bgItemTable).DataTable();
				bgitemTbl.destroy();
				$("#" + bgItemTable).empty();
				var colObjs = [{
						title: "编号字段",
						data: "ruleEleName",
						width: "100px",
						className: "UnEdit"
					},
					{
						title: "字段默认值",
						data: "ruleEleValue",
						width: "200px"
					},
					{
						title: "字段长度",
						data: "ruleEleLength",
						width: "100px"
					},
					{
						title: "自动补零",
						data: "ruleEleValuetype",
						width: "100px"
					}
				];
				var colDefObjs = [];

				//*********************************************************
				var tblSetting = {
					"data": pData,
					"columns": colObjs,
					"columnDefs": colDefObjs,
					"ordering": false,
					"lengthChange": false,
					"paging": false,
					"bFilter": false, // 去掉搜索框
					"processing": true, // 显示正在加载中
					"bInfo": false, // 页脚信息
					"bSort": false, // 排序功能
					"autoWidth": false, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
					"select": true,
					"bDestroy": true,
					"dom": 'rt',
					"fnDrawCallback": function (setting, json) {}
				};
				var tbl = $("#" + bgItemTable).DataTable(tblSetting);
				var $clostDiv = $("#" + bgItemTable).closest("div");
				$($clostDiv).css("border-bottom", "0px black solid");

				$(tbl.table().container()).off("click", "tr").on("click", "tr", function (e) {
					if ($(this).hasClass("selected")) {
						$(this).removeClass("selected");
					} else {
						$(this).addClass("selected");
					}
				});

				$(tbl.table().container()).on("dblclick", "td:not(.UnEdit)", function (e) { //双击编辑单元格
					var row = $(this).closest("tr");
					var col = tbl.column(this);

					var sId = col.dataSrc();
					_BgPub_Bind_InputText(this, sId + "_value", tbl_afterInputMoney_cellChange, tbl.cell(this).data());
					$("#" + sId + "_value").focus();
					$("#" + sId + "_value").blur(function (e) {
						var e = jQuery.Event("keyup");
						e.keyCode = 13;
						$("#" + sId + "_value").trigger(e);
					});
				});
			},
			// $.ajax()，获取数据数据成功，拼接页面的方法
			openEdtWin: function (curData) {
				if (curData) {
					//查看界面
					this.curData = curData;
					this.editMode = 'edit';
					$('#crtlPlanSaveAdd').addClass('hide'); //最外面按钮隐藏(保存并新增,保存,下发,取消)
					$('#crtlPlanSaveAll').addClass('hide');
					$('#crtlPlanCancelAll').addClass('hide');
					$('#crtlPlanCloseAll').removeClass('hide'); //显示关闭按钮
					$('#btnCrtlPlanBaseEdit').removeClass('hide'); //显示基本信息编辑按钮
					$('#btnUseCtrlItemsEdit').removeClass('hide');
					$('#items-allShow').addClass('hide');
					this.initWindow(curData);
				} else {
					//新增界面
					this.editMode = 'new';
					$('#crtlplan-base')[0].reset();
					this.setBaseFormEdit(true);
					$('#crtlPlanSaveAdd').removeClass('hide');
					$('#crtlPlanSaveAll').removeClass('hide');
					$('#crtlPlanIssued').removeClass('hide');
					$('#crtlPlanCancelAll').removeClass('hide');
					$('#crtlPlanCloseAll').addClass('hide');
					$('#btnCrtlPlanBaseEdit').addClass('hide');
					$('#btnUseCtrlItemsEdit').addClass('hide');
					$('#crtlPlanYSXXBtnGroup').addClass('hide');
					$('#btnUseCtrlItemsEdit').addClass('hide');
					$('#items-allShow').addClass('hide');
					$('#crtlplan-base')[0].reset();
					$('#items-selected-ul').html("");
					page.leftItems = [];
					for (var i = 0; i < ctrlItems.length; ++i) {
						page.leftItems.push(ctrlItems[i]);
					}
					page.selectedItems = [];
					page.drawCtrlItems(page.leftItems);
					page.drawSelectedItemsTable(page.selectedItems);
				}
				page.initCodeRuleBillType(curData);
				page.editor = ufma.showModal('crtlplan-edt', 1150); //contentID,width,height,callback
				$('#crtlplan-base').collapse('show');
				$('#crtlplan-items').collapse('show');
				$('#crtlplan-budgetplan').collapse('show');
				$('.u-msg-content').css("min-height", $('.u-msg-content').outerHeight());
			},
			initWindow: function (curData) {
				$('#crtlplan-base').setForm(curData);
				page.leftItems = [];
				for (var i = 0; i < ctrlItems.length; ++i) {
					var haveInRight = false;
					for (var j = 0; j < curData.rules.length; ++j) {
						if (ctrlItems[i].ruleEleName === curData.rules[j].ruleEleName) {
							haveInRight = true;
							break;
						}
					}
					if (!haveInRight) {
						page.leftItems.push(ctrlItems[i]);
					}
				}
				page.drawCtrlItems(page.leftItems);
				page.selectedItems = curData.rules;
				page.drawSelectedItemsTable(curData.rules);
				page.drawAllItems(curData.rules);
				this.setBaseFormEdit(false);
				this.setCtrlItemsFormEdit(false);
			},
			initCodeRuleBillType: function (curData) {
				var url = '/bg/sysdata/getCodeRuleBillType';
				var argu = {
					"setYear": page.pfData.svSetYear
				};
				var callback = function (result) {
					$("#codeRuleBillType").html("");
					for (var i = 0; i < result.data.length; ++i) {
						$("#codeRuleBillType").append("<option value=\"" + result.data[i] + "\">" + result.data[i] + "</option>");
					}
					$('#crtlplan-base').setForm(curData);
				}
				ufma.get(url, argu, callback);
			},
			setBaseFormEdit: function (enabled) {
				if (enabled) {
					//查看2页面 编辑基本信息
					$('#crtlplan-base .control-element .form-control,#crtlplan-base .control-element .btn-group').removeClass('hide');
					$('#crtlplan-base .control-element .control-label').addClass('hide');
					if (this.editMode == 'edit') {
						$('#crtlPlanBaseBtnGroup').removeClass('hide');
					} else {
						$('#crtlPlanBaseBtnGroup').addClass('hide');
					}
					$('#btnCrtlPlanBaseEdit').addClass('hide');
				} else {
					$('#btnCrtlPlanBaseEdit').removeClass('hide');
					$('#crtlPlanBaseBtnGroup').addClass('hide');
					$('#crtlplan-base .control-element .form-control,#crtlplan-base .control-element .btn-group').addClass('hide');
					$('#crtlplan-base .control-element .control-label').removeClass('hide');
				}
			},
			setCtrlItemsFormEdit: function (enabled) {
				if (enabled) {
					$('#crtlplan-ysxx .control-element .form-control').removeClass('hide');
					$('#crtlplan-ysxx .control-element .control-label').addClass('hide');
					if (this.editMode == 'edit') {
						$('#crtlItemsBtnGroup').removeClass('hide');
					} else {
						$('#crtlItemsBtnGroup').addClass('hide');
					}
					$('#btnUseCtrlItemsEdit').addClass('hide');
				} else {
					$('#crtlPlanYSXX tbody tr').each(function () {});
					$('#btnUseCtrlItemsEdit').removeClass('hide');
					$('#crtlItemsBtnGroup').addClass('hide');
				}
			},
			qryAccs: function () {
				var url = '/bg/codeRule/getRule';
				var argu = {
					"agencyCode": page.agencyCode,
					"setYear": page.pfData.svSetYear
				};
				var callback = function (result) {
					if (result.data.rules) {
						page.drawCrtlPlanCount(result.data.rules);
						page.drawPanleCards(result.data.rules);
					}

				}
				ufma.get(url, argu, callback);
			},
			drawPanleCards: function (cardsData) { //画主页面卡片
				var $cards = $('#crtlplan-cards'); //未懂
				$cards.html('');
				var $row;
				$.each(cardsData, function (idx, row) {
					var chrId = row.chrId;
					var chrName = row.chrName;
					var busBillId = row.busBillId;
					var rgCode = row.rgCode;
					var chrCode = row.chrCode;
					var colorIndex = idx % 5 + 1;
					var rules = "";
					if (row.rules) {
						var i = 0;
						for (; i < row.rules.length; ++i) {
							var item = row.rules[i];
							if (i > 0) {
								rules += " + ";
							}
							rules += item.ruleEleName;
						}
					}

					var sample = "";

					if (idx % 3 == 0) {
						$row = $('<div class="row"></div>').appendTo($cards);
					}
					var $col = $('<div class="col-xs-6 col-md-4 padding-15 padding-top-8 " ></div>');

					var $newCard = $('<div class="ufma-card ufma-card-icon ">').appendTo($col);
					$('<div class="card-icon" color-index=' + colorIndex + '><span class="icon">' + chrName.substring(0, 1) + '</span></div>').appendTo($newCard);
					var $newCard1 = $('<div class="ufma-card-header"><p class="chrId hidden">' + chrId + '</p><span>' + chrName + '</span></div>').appendTo($newCard);

					var $newCard2 = $('<div class="ufma-card-body card-height"><div style=" margin-bottom: 2px";>适用单据：<span>' + busBillId + '</span></div>').appendTo($newCard);
					$('<div style=" margin-bottom: 8px";>编号规则：<span style="padding-right:24px;">' + rules + '</span></div>').appendTo($newCard2);
					$('<div class="card-fams" id="description">编号实例 : ' + sample + '</div></div>').appendTo($newCard2);
					var $footer = $('<div class="ufma-card-footer">').appendTo($newCard);
					var $btnsee = $('<a class="btn-label crtlplan-see" ><i class="glyphicon icon-eye"></i>查看</a>').appendTo($footer);
					var $btndel = $('<a class="btn-label"><i class="glyphicon icon-trash"></i>删除</a>').appendTo($footer);
					$col.appendTo($row);
					$btnsee.on('click', function () {
						page.clearmodel();
						page.seeCrtlPlan(row);
					});
					var chrId = row.chrId;
					$btndel.on('click', function () {

						ufma.confirm('您是要删除编号规则【' + chrName + '】？', function (action) {
							if (action) {
								page.delete(chrId);
							} else {

							}
						});

					});
				});
			},
			drawCrtlPlanCount: function (cardsData) {
				$(".crtlPlanCount").html("");
				var $dl = $('<div class="col-xs-8">' +
					'<div id="ele-count" style="font-size: 16px;">全部编号规则共 <span style="color: #108EE9;" >' + cardsData.length + '</span> 个</div> '
				);
				$(".crtlPlanCount").append($dl);
			},
			delete: function (chrId) {
				var url = '/bg/codeRule/delRule';
				var argu = {
					"chrId": chrId,
					"setYear": page.pfData.svSetYear
				};
				var callback = function (result) {
					page.qryAccs();
				}
				ufma.get(url, argu, callback);
			},
			drawCtrlItems: function (result) { //已选控制要素
				var $node = $('#ctrl-items');
				$node.html("");
				for (var i = 0; i < result.length; i++) {
					var $dl = $(
						'<li class="items" style="list-style-type:none;" name="eleName">' + result[i].ruleEleName +
						'</li>'
					);
					$node.append($dl);
				}
			},
			drawAllItems: function (result) {
				var $node = $('#items-allShow');
				for (var i = 0; i < result.length; i++) {
					var $dl = $(
						'<div style="padding-left: 16px;padding-top: 11px;float:left;div-inline;" name="chrName">' + result[i].ruleEleName + '</div>'
					);
					$node.append($dl);
				}
			},

			saveAll: function () {
				var url = '/bg/codeRule/insert';
				var argu = $('#crtlplan-base').serializeObject();

				var bgitemTbl = $("#" + bgItemTable).DataTable();
				var items = bgitemTbl.rows().data();
				budgetModel.items = new Array();
				budgetModel.setYear = page.pfData.svSetYear;
				for (var i = 0; i < items.length; ++i) {
					items[i].chrName = argu.chrName;
					items[i].busBillId = argu.busBillId;
					budgetModel.items.push(items[i]);
				}

				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					});
				}

				ufma.post(url, budgetModel, callback);

			},
			saveAdd: function () {
				var url = '/bg/codeRule/insert';
				var argu = $('#crtlplan-base').serializeObject();
				budgetModel.chrName = argu.chrName;
				budgetModel.enabled = argu.enabled;
				budgetModel.bgCtrlTypeName = argu.bgCtrlTypeName;
				if (argu.bgCtrlRatio == null || argu.bgCtrlRatio == "") {
					budgetModel.bgCtrlRatio = 100;
				} else {
					budgetModel.bgCtrlRatio = argu.bgCtrlRatio;
				}
				if (argu.bgWarnRatio == null || argu.bgWarnRatio == "") {
					budgetModel.bgWarnRatio = 100;
				} else {
					budgetModel.bgWarnRatio = argu.bgWarnRatio;
				}
				budgetModel.summary = argu.summary;
				budgetModel.isNew = '是';
				budgetModel.agencyCode = page.agencyCode;
				budgetModel.setYear = page.pfData.svSetYear;
				budgetModel.items = this.serializeItems();
				budgetModel.budgetPlan = this.serializeBudgetplan();

				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					});
				}

				ufma.post(url, budgetModel, callback);

			},
			saveBaseInfo: function () {
				var url = '/bg/codeRule/insert';
				var argu = $('#crtlplan-base').serializeObject();
				tempCrtlPlan.chrName = argu.chrName;
				tempCrtlPlan.enabled = argu.enabled;
				tempCrtlPlan.bgCtrlTypeName = argu.bgCtrlTypeName;
				if (argu.bgCtrlRatio == null || argu.bgCtrlRatio == "") {
					tempCrtlPlan.bgCtrlRatio = 100;
				} else {
					tempCrtlPlan.bgCtrlRatio = argu.bgCtrlRatio;
				}
				if (argu.bgWarnRatio == null || argu.bgWarnRatio == "") {
					tempCrtlPlan.bgWarnRatio = 100;
				} else {
					tempCrtlPlan.bgWarnRatio = argu.bgWarnRatio;
				}
				tempCrtlPlan.summary = argu.summary;
				tempCrtlPlan.isnew = '否';
				tempCrtlPlan.agencyCode = page.agencyCode;
				tempCrtlPlan.setYear = page.pfData.svSetYear;
				tempCrtlPlan.items = this.serializeItems();

				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					});
				}

				ufma.post(url, tempCrtlPlan, callback);

			},
			saveCtrlItems: function () { //保存控制要素
				var url = '/bg/codeRule/insert';
				tempCrtlPlan.isNew = '否';
				tempCrtlPlan.setYear = page.pfData.svSetYear;
				argu.agencyCode = page.agencyCode;
				tempCrtlPlan.items = this.serializeItems();
				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					});
				}
				ufma.post(url, tempCrtlPlan, callback);
			},
			seeCrtlPlan: function (data) {
				page.openEdtWin(data);
			},
			clearmodel: function () {
				$('#items-selected-ul').html("");
				$('#ctrl-crtlplan').html("");
				$('#ctrl-items').html("");
				$('#items-allShow').html("");
			},
			findCtrlItem: function (items, ruleEleName) {
				for (var i = 0; i < items.length; ++i) {
					if (items[i].ruleEleName === ruleEleName) {
						return items[i];
					}
				}

				return null;
			},
			removeItems: function (items, toRemoves) {
				var newItems = [];
				for (var i = 0; i < items.length; ++i) {
					var finded = false;
					for (var j = 0; j < toRemoves.length; ++j) {
						if (items[i] == toRemoves[j]) {
							finded = true;
							break;
						}
					}
					if (!finded) {
						newItems.push(items[i]);
					}
				}

				return newItems;
			},
			onEventListener: function () { //新增按钮触发事件
				this.get('#btn-add').on('click', function (e) {
					page.clearmodel();
					e.preventDefault();
					page.action = 'add';
					page.openEdtWin();
				});
				this.get('#crtlPlanSaveAll').on('click', function (e) {
					e.preventDefault();
					page.saveAll();
				});
				this.get('#crtlPlanSaveAdd').on('click', function (e) { //保存并新增
					e.preventDefault();
					page.saveAdd();
					page.openEdtWin();
				});
				$('#crtlPlanBaseBtnGroup .btn-save').on('click', function () { //基本信息保存
					page.saveBaseInfo();
					page.setBaseFormEdit(false);
				});
				$('#crtlPlanBaseBtnGroup .btn-cancel').on('click', function () { //基本信息取消
					page.clearmodel();
					page.initWindow(page.curData);
					page.setBaseFormEdit(false);
				});
				$('#crtlItemsBtnGroup .btn-save').on('click', function () { //控制要素保存
					page.saveBaseInfo(); //待完善
					page.setCtrlItemsFormEdit(false);
				});
				$('#crtlItemsBtnGroup .btn-cancel').on('click', function () { //控制要素取消
					page.clearmodel();
					page.initWindow(page.curData);
					page.setCtrlItemsFormEdit(false);
				});
				$('#btnCrtlPlanBaseEdit').on('click', function () { //基本信息编辑
					page.setBaseFormEdit(true);
				});
				$('#btnUseCtrlItemsEdit').on('click', function () { //控制要素编辑
					page.setCtrlItemsFormEdit(true);
				});
				$('#crtlPlanCloseAll').on('click', function () {
					page.editor.close();
				});
				$('#crtlPlanCancelAll').on('click', function () {
					page.editor.close();
					page.clearmodel();
				});
				$('#btnUseCtrlItemsStop').on('click', function () {
					if ($('#items-allShow').hasClass('hide')) {
						$('#items-allShow').removeClass('hide');
					} else {
						$('#items-allShow').addClass('hide');
					}
				});
				//控制要素
				$('#crtlplan-items').find(".items-list-ul").on("click", "li", function () {
					if (!$(this).hasClass("rpt-li-active"))
						$(this).addClass("rpt-li-active");
					else
						$(this).removeClass("rpt-li-active");
				});
				$('#crtlplan-items').find(".items-list-ul").on("dblclick", "li", function () {
					$(this).addClass("rpt-li-active").siblings().removeClass("rpt-li-active");
					var flag = $(this).parent("ul").hasClass("items-list-ul-l");
					if (flag) {
						$(".items-list-ul-r li").removeClass("rpt-li-active");
						$(".items-list-ul-r").append($(this));
					} else {
						if ($(".items-list-ul-r li").length > 1) {
							$(".items-list-ul-l li").removeClass("rpt-li-active");
							$(".items-list-ul-l").append($(this));
						} else {
							ufma.showTip("至少保留一个控制要素", function () {});
						}
					}
				});
				$("#items-setRight").on("click", function () {
					var checkDom = $(".items-list-ul-l li.rpt-li-active");
					if (checkDom.length > 0) {
						if ($(checkDom).siblings().length > 0) {
							$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						}

						$(".items-list-ul-l li").removeClass("rpt-li-active");

						var toRemoves = [];
						for (var i = 0; i < checkDom.length; ++i) {
							var item = page.findCtrlItem(page.leftItems, $(checkDom[i]).text());
							page.selectedItems.push(item);
							toRemoves.push(item);
						}
						page.leftItems = page.removeItems(page.leftItems, toRemoves);
						page.drawSelectedItemsTable(page.selectedItems);
						page.drawAllItems(page.selectedItems);
						page.drawCtrlItems(page.leftItems);
					}
				});
				$("#items-setLeft").on("click", function () {
					var bgitemTbl = $("#" + bgItemTable).DataTable();
					var selectedItems = bgitemTbl.rows(".selected").data();
					if (selectedItems.length > 0) {
						var allRowCount = bgitemTbl.rows().data().length;
						if (selectedItems.length < allRowCount) {
							var toRemoves = [];
							for (var i = 0; i < selectedItems.length; ++i) {
								var item = selectedItems[i];
								page.leftItems.push(item);
								toRemoves.push(item);
							}

							page.selectedItems = page.removeItems(page.selectedItems, toRemoves);
							page.drawSelectedItemsTable(page.selectedItems);
							page.drawAllItems(page.selectedItems);
							page.drawCtrlItems(page.leftItems);
						} else {
							ufma.showTip("至少保留一个控制要素", function () {});
						}
					}
				});

			},

			// $.ajax()，传参成功后， 
			postVouType: function (result) {
				ufma.showTip(result.msg);
				page.initPage();
			},

			// 初始化页面
			initPage: function () {
				page.agencyCode = "001";
			},
			// 此方法必须保留
			init: function () {
				page.pfData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				this.qryAccs();
			}
		}
	}();

	page.init();
});
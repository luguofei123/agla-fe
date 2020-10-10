$(function () {
	var page = function () {
		// 定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrCode, chrName, remark;
		// 传输设置数据的对象
		var fromSys;
		var postSet;
		var planData;
		var budgetModel;
		var tempCrtlPlan;
		var agencyCode;
		var selectedItems = new Array();
		var selectedBudgetPlans = new Array();
		return {
			namespace: 'crtlPlan',
			curData: new Object(),
			editMode: 'new',
			chrId: '',
			get: function (tag) {
				return $('#' + page.namespace).find(tag);
			},
			openEdtWin: function (curData, ret) {
				if (curData) {
					//查看界面
					this.curData = curData;
					this.editMode = 'edit';
					$('#crtlPlanSaveAdd').addClass('hide');//最外面按钮隐藏(保存并新增,保存,下发,取消)
					$('#crtlPlanSaveAll').addClass('hide');
					$('#crtlPlanCancelAll').addClass('hide');
					$('#crtlPlanCloseAll').removeClass('hide');//显示关闭按钮
					$('#btnCrtlPlanBaseEdit').removeClass('hide');//显示基本信息编辑按钮
					$('#btnUseCtrlItemsEdit').removeClass('hide');
					//$('#btnUseBudgetPlanEdit').removeClass('hide');
					$('#items-allShow').addClass('hide');
					$('#budgetplans-allShow').addClass('hide');
					page.action = 'edit';
					this.initWindow(curData);
				} else {
					//新增界面
					this.editMode = 'new';
					selectedItems = [];
					selectedBudgetPlans = [];
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
					//$('#btnUseBudgetPlanEdit').addClass('hide');
					$('#btnUseCtrlItemsEdit').addClass('hide');
					$('#items-allShow').addClass('hide');
					$('#budgetplans-allShow').addClass('hide');
					$('#crtlplan-base')[0].reset();
					$('#items-selected-ul').html("");
				}
				if (ret == undefined) {
					page.editor = ufma.showModal('crtlplan-edt', 1100, 420);  //contentID,width,height,callback
				}
				$('#crtlplan-base').collapse('show');
				$('#crtlplan-items').collapse('show');
				$('#crtlplan-budgetplan').collapse('show');
				$('.u-msg-content').css("min-height", $('.u-msg-content').outerHeight());
			},
			initWindow: function (curData) {
				if (curData.chrName != null) {
					if (curData.chrName.length > 30) {  //30个字符  字符长度大于等于30  超过长度显示...
						curData.chrName = curData.chrName.substring(0, 30);
						curData.chrName = curData.chrName + "..."
					}
				}
				$('#crtlplan-base').setForm(curData);
				page.drawSelectedCtrlItems(curData);
				page.drawSelectedBudgetPlan(curData);
				page.getBudgetModel();
				page.drawAllItems(curData);
				page.drawAllBudgetplans(curData);
				this.setBaseFormEdit(false);
				this.setCtrlItemsFormEdit(false);
				//this.setBudgetPlanFormEdit(false);
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
				$('#crtlplan-base .control-element')[enabled ? 'removeClass' : 'addClass']('disabled');
			},
			setCtrlItemsFormEdit: function (enabled) {
				if (enabled) {
					$('#crtlplan-ysxx .control-element .form-control').removeClass('hide');
					$('#crtlplan-ysxx .control-element .control-label').addClass('hide');
					if (this.editMode == 'edit') {
						$('#crtlItemsBtnGroup').removeClass('hide');
						$('#budgetplanBtnGroup').removeClass('hide');
					} else {
						$('#crtlItemsBtnGroup').addClass('hide');
						$('#budgetplanBtnGroup').addClass('hide');
					}
					$('#btnUseCtrlItemsEdit').addClass('hide');
					$('#items-setRight').attr('disabled', false);
					$('#items-setLeft').attr('disabled', false);
					$('#budgetplan-setLeft').attr('disabled', false);
					$('#budgetplan-setRight').attr('disabled', false);
				} else {
					$('#crtlPlanYSXX tbody tr').each(function () { });
					$('#btnUseCtrlItemsEdit').removeClass('hide');
					$('#crtlItemsBtnGroup').addClass('hide');
					$('#items-setRight').attr('disabled', true);
					$('#items-setLeft').attr('disabled', true);
					$('#budgetplanBtnGroup').addClass('hide');
					$('#crtlplan-ysxx .control-element .form-control').addClass('hide');
					$('#crtlplan-ysxx .control-element .control-label').removeClass('hide');
					$('#crtlPlanYSXX thead tr th.btnGroup').remove();
					$('#crtlPlanYSXX tbody tr td.btnGroup').remove();
					$('#budgetplan-setRight').attr('disabled', true);
					$('#budgetplan-setLeft').attr('disabled', true);
				}
			},
			setBudgetPlanFormEdit: function (enabled) {
				if (enabled) {
					$('#crtlplan-ysxx .control-element .form-control').removeClass('hide');
					$('#crtlplan-ysxx .control-element .control-label').addClass('hide');
					if (this.editMode == 'edit') {
						$('#budgetplanBtnGroup').removeClass('hide');
					} else {
						$('#budgetplanBtnGroup').addClass('hide');
					}
					//$('#btnUseBudgetPlanEdit').addClass('hide');
					$('#budgetplan-setLeft').attr('disabled', false);
					$('#budgetplan-setRight').attr('disabled', false);
				} else {
					/*$('#crtlPlanYSXX tbody tr').each(function(){
						$row = $(this);
						$row.find('label[for="chrName"]').html($row.find('[name="chrName"]').val());
						$row.find('label[for="balDir"]').html($row.find('[name="balDir"]').children('option:selected').text());
						$row.find('label[for="accaCode"]').html($row.find('[name="accaCode"]').children('option:selected').text());
					});*/

					//$('#btnUseBudgetPlanEdit').removeClass('hide');
					$('#budgetplanBtnGroup').addClass('hide');
					$('#crtlplan-ysxx .control-element .form-control').addClass('hide');
					$('#crtlplan-ysxx .control-element .control-label').removeClass('hide');
					$('#crtlPlanYSXX thead tr th.btnGroup').remove();
					$('#crtlPlanYSXX tbody tr td.btnGroup').remove();
					$('#budgetplan-setRight').attr('disabled', true);
					$('#budgetplan-setLeft').attr('disabled', true);
				}
			},
			qryAccs: function () {
				var url = '/bg/Plan/ctrlPlan/getPlanList';
				var argu = { "agencyCode": page.agencyCode, "setYear": page.pfData.svSetYear };
				var callback = function (result) {
					planData = result.data;
					page.drawCrtlPlanCount(result.data);
					page.drawPanleCards(result.data);
					//page.setBaseFormEdit(false);
				}
				ufma.get(url, argu, callback);
			},
			drawPanleCards: function (cardsData) {//画主页面卡片
				var $cards = $('#crtlplan-cards'); //未懂
				$cards.html('');
				var $row;
				$.each(cardsData.plans, function (idx, row) {
					var chrId = row.chrId;
					var chrName = row.chrName || '';
					var bgCtrlTypeName = row.bgCtrlTypeName;
					var bgCtrlRatio = row.bgCtrlRatio;
					var bgWarnRatio = row.bgWarnRatio;
					var summary = row.summary;
					var isUsed = row.isUsed;
					var enabled = row.enabled;
					var colorIndex = idx % 5 + 1;
					if (summary != null && summary.length > 48) {  //20个字符  字符长度大于等于10
						summary = summary.substring(0, 48);
						summary = summary + "..."
					}
					if (chrName != null) {
						if (chrName.length > 20) {  //20个字符  字符长度大于等于10  超过长度显示...
							chrName = chrName.substring(0, 20);
							chrName = chrName + "..."
						}
					}
					if (idx % 3 == 0) {
						$row = $('<div class="row"></div>').appendTo($cards);
					}
					var $col = $('<div class="col-xs-6 col-md-4 padding-15 padding-8 padding-top-8 " ></div>');
					if (enabled == '否') {
						var $newCard = $('<div class="ufma-card ufma-card-icon card-gray ">').appendTo($col);
						$('<div class="card-icon circle-gray" color-index=' + colorIndex + '><span class="icon name-font">' + chrName.substring(0, 1) + '</span></div>').appendTo($newCard);
						var $newCard1 = $('<div class="ufma-card-header"><p class="chrId hidden">' + chrId + '</p><span class="name-gray">' + chrName + '</span></div>').appendTo($newCard);
						$('</div></div>').appendTo($newCard1);
					} else {
						var $newCard = $('<div class="ufma-card ufma-card-icon ">').appendTo($col);
						$('<div class="card-icon" color-index=' + colorIndex + '><span class="icon">' + chrName.substring(0, 1) + '</span></div>').appendTo($newCard);
						var $newCard1 = $('<div class="ufma-card-header"><p class="chrId hidden">' + chrId + '</p><span>' + chrName + '</span></div>').appendTo($newCard);
						if (isUsed == '1') {
							$('<span class="budget-used">已使用</span></div>').appendTo($newCard1);
						}
					}
					var $newCard2 = $('<div class="ufma-card-body card-height"><div style=" margin-bottom: 2px";>控制方式：<span>' + bgCtrlTypeName + '</span></div>').appendTo($newCard);
					$('<div style=" margin-bottom: 8px";>控制百分比：<span style="padding-right:24px;">' + bgCtrlRatio + '%</span>预警百分比 : <span>' + bgWarnRatio + '%</span></div>').appendTo($newCard2);
					if (summary == null) {
						$('<div class="card-fams" id="description">方案描述 : </div></div>').appendTo($newCard2);
					} else {
						$('<div class="card-fams" id="description">方案描述 : ' + summary + '</div></div>').appendTo($newCard2);
					}
					var $footer = $('<div class="ufma-card-footer">').appendTo($newCard);
					var $btnwatch = $('<a class="btn-label btn-watch crtlplan-watch btn-permission" ><i class="glyphicon icon-eye"></i>查看</a>').appendTo($footer);
					var $btndel = $('<a class="btn-label btn-delete btn-permission"><i class="glyphicon icon-trash"></i>删除</a>').appendTo($footer);
					$col.appendTo($row);
					$btnwatch.on('click', function () {
						ufma.hideInputHelp('chrName');
						$('#chrName').closest('.form-group').removeClass('error');  //guohx  修改 新增查看时去掉上次未填写方案名称出现的错误提示
						page.clearmodel();
						page.seeCrtlPlan(chrId);
						page.drawOtherCtrlplan(planData);
					});
					var chrId = row.chrId;
					$btndel.on('click', function () {

						if (isUsed == '1') {
							ufma.showTip('该控制方案已经被使用,不允许删除！', function () {
							}, 'warning');
						} else {
							ufma.confirm('您是要删除控制方案【' + chrName + '】？', function (action) {
								if (action) {
									page.delete(chrId);
								}
							}, {
									'type': 'warning'
								});
						}
					});
				});
				ufma.isShow(reslist);
			},
			drawCrtlPlanCount: function (cardsData) {
				$(".crtlPlanCount").html("");
				var $dl = $('<div class="col-xs-8">' +
					'<div id="ele-count" style="font-size: 16px;">全部方案共 <span style="color: #108EE9;" >' + cardsData.planCount + '</span> 个</div> '
				);
				$(".crtlPlanCount").append($dl);
			},
			delete: function (chrId) {
				var url = '/bg/Plan/ctrlPlan/delPlan';
				var argu = { "ctrlPlanChrId": chrId, "agencyCode": page.agencyCode, "setYear": page.pfData.svSetYear };
				var callback = function (result) {
					if (result.flag == 'success') {
						ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
					}
					page.qryAccs();
				}
				ufma.get(url, argu, callback);
			},
			drawCtrlItems: function (result) {   //可选控制要素
				var $node = $('#ctrl-items');
				for (var i = 0; i < result.items.length; i++) {
					var $dl = $(
						'<li class="items" style="list-style-type:none;" name="eleName">' + result.items[i].eleName +
						'<div style="display:none" name="eleId" id="eleId" value="' + result.items[i].eleId + '"></div>' +
						'<div style="display:none" name="eleCode" id="eleCode" value="' + result.items[i].eleCode + '"></div>' +
						'</li>'
					);
					$node.append($dl);
				}
			},
			drawSelectedCtrlItems: function (result) {   //已选控制要素
				selectedItems = [];
				$('#items-selected-ul').html("");
				var $node = $('#items-selected-ul');
				for (var i = 0; i < result.items.length; i++) {
					var $dl = $(
						'<li class="items" style="list-style-type:none;" name="eleName">' + result.items[i].eleName +
						'<div style="display:none" name="eleId" id="eleId" value="' + result.items[i].eleId + '"></div>' +
						'<div style="display:none" name="eleCode" id="eleCode" value="' + result.items[i].eleCode + '"></div>' +
						'</li>'
					);
					selectedItems.push(result.items[i].eleCode);
					$node.append($dl);
				}
			},
			drawOptionCtrlItems: function (result) {   //可选控制要素
				var $node = $('#ctrl-items');
				for (var i = 0; i < result.items.length; i++) {
					if ($.inArray(result.items[i].eleCode, selectedItems) == -1) {
						var $dl = $(
							'<li class="items" style="list-style-type:none;" name="eleName">' + result.items[i].eleName +
							'<div style="display:none" name="eleId" id="eleId" value="' + result.items[i].eleId + '"></div>' +
							'<div style="display:none" name="eleCode" id="eleCode" value="' + result.items[i].eleCode + '"></div>' +
							'</li>'
						);
						$node.append($dl);
					}
				}
			},
			/*drawBudgetPlan:function(result){   //预算方案
				var $node = $('#ctrl-crtlplan');
				for(var i=0;i<result.budgetPlan.length;i++){
					var $dl = $(
						'<li class="budgetplan" style="list-style-type:none;" name="chrName">'+result.budgetPlan[i].chrName+
						'<div style="display:none" name="budget-chrid" id="budget-chrid" value="'+result.budgetPlan[i].chrId+'"></div>'+
						'<div style="display:none" name="budget-chrcode" id="budget-chrcode" value="'+result.budgetPlan[i].chrCode+'"></div>'+
						'</li>'
					);
					$node.append($dl);
				}
			},*/
			//判断一个数组中是否包含另一个数组
			containArray: function (big, small) {
				if (small.length > big.length) {
					return false;
				}
				for (var i = 0; i < small.length; i++) {
					if($.inArray(small[i], big)<0){
						return false;
					}
				}
				return true;
			},
			redrawBudgetPlan: function (result) { //根绝已选指标要素控制可选预算方案                                                      
				if (page.action == 'add') { //guohx  修改 不显示已选预算方案问题
					selectedBudgetPlans = [];
					$('#budgetplan-selected-ul').html("");
				}
				var $node = $('#ctrl-crtlplan');
				$node.empty();

				var items = new Array();
				var planVoItems = [];
				$(".items-list-ul-r li").each(function () {
					planVoItems.push($(this).find("div:last").attr("value"));
				});

				if (planVoItems.length > 0) {
					for (var i = 0; i < result.budgetPlan.length; i++) {
						var arr = [];
						for (var j = 0; j < result.budgetPlan[i].planVo_Items.length; j++) {
							arr.push(result.budgetPlan[i].planVo_Items[j].eleCode);
						}

						if (page.containArray(arr, planVoItems) && $.inArray(result.budgetPlan[i].chrId, items) == -1) {
							if ($.inArray(result.budgetPlan[i].chrCode, selectedBudgetPlans) == -1) {
								items.push(result.budgetPlan[i].chrId);
								var $dl = $(
									'<li class="budgetplan" style="list-style-type:none;" name="chrName">' + result.budgetPlan[i].chrName +
									'<div style="display:none" name="budget-chrid" id="budget-chrid" value="' + result.budgetPlan[i].chrId + '"></div>' +
									'<div style="display:none" name="budget-chrcode" id="budget-chrcode" value="' + result.budgetPlan[i].chrCode + '"></div>' +
									'</li>'
								);
								$node.append($dl);
							}
						}
					}
				}
			},
			drawSelectedBudgetPlan: function (result) {  //已选预算方案
				// selectedBudgetPlans = [];
				// $('#budgetplan-selected-ul').html("");
				var $node = $('#budgetplan-selected-ul');
				for (var i = 0; i < result.budgetPlan.length; i++) {
					var $dl = $(
						'<li class="budgetplan" style="list-style-type:none;" name="chrName">' + result.budgetPlan[i].chrName +
						'<div style="display:none" name="budget-chrid" id="budget-chrid" value="' + result.budgetPlan[i].chrId + '"></div>' +
						'<div style="display:none" name="budget-chrcode" id="budget-chrcode" value="' + result.budgetPlan[i].chrCode + '"></div>' +
						'</li>'
					);
					selectedBudgetPlans.push(result.budgetPlan[i].chrCode);
					$node.append($dl);
				}
			},
			drawAllItems: function (result) {
				var $node = $('#items-allShow');
				for (var i = 0; i < result.items.length; i++) {
					var $dl = $(
						'<div style="padding-left: 16px;padding-top: 11px;float:left;div-inline;" name="chrName">' + result.items[i].eleName + '</div>'
					);
					$node.append($dl);
				}
			},
			drawAllBudgetplans: function (result) {
				var $node = $('#budgetplans-allShow');
				for (var i = 0; i < result.budgetPlan.length; i++) {
					var $dl = $(
						'<div style="padding-left: 16px;padding-top: 11px;float:left;div-inline;" name="chrName";>' + result.budgetPlan[i].chrName + '</div>'
					);
					$node.append($dl);
				}
			},
			drawOtherCtrlplan: function (cardsData) {    //画链接其他控制方案
				var $cards = $('#crtlplan-other');
				$cards.html('');
				var $row;
				$.each(cardsData.plans, function (idx, row) {
					var chrName = row.chrName;
					if (chrName != null) {
						if (chrName.length > 15) {
							chrName = chrName.substring(0, 15);
							chrName = chrName + "..."
						}
					}
					var chrId = row.chrId;
					var $row = $('<a class="label-a bordered bgc-white" name="" value="">' + chrName + '</a>');
					$cards.append($row);
					$row.on('click', function () {
						page.clearmodel();
						page.editor.close();
						page.seeCrtlPlan(chrId);
					});
				});
			},
			saveAll: function () {
				var url = '/bg/Plan/ctrlPlan/savePlan?agencyCode' + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = $('#crtlplan-base').serializeObject();
                if(parseFloat(argu.bgCtrlRatio) > 100){
                    ufma.showTip('控制百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
                if(parseFloat(argu.bgWarnRatio) > 100){
                    ufma.showTip('预警百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
				if (argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function () {
					}, 'error');
				} else {
					budgetModel.chrName = argu.chrName;
					budgetModel.enabled = argu.enabled;
					budgetModel.bgCtrlType = argu.bgCtrlType;
					budgetModel.bgCtrlTypeName = "";
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
					ufma.showloading('数据保存中，请耐心等待...');
					var callback = function (result) {
						ufma.hideloading();
						ufma.showTip('保存成功！', function () {}, 'success');
							$('#crtlPlanSaveAll').attr('disabled', true);
							page.qryAccs();
							page.editor.close();
							//page.setItemsPlansFormEdit(false);
						
					}

					ufma.post(url, budgetModel, callback);
				}
			},

			saveAdd: function () {
				var url = '/bg/Plan/ctrlPlan/savePlan?agencyCode' + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = $('#crtlplan-base').serializeObject();
                if(parseFloat(argu.bgCtrlRatio) > 100){
                    ufma.showTip('控制百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
                if(parseFloat(argu.bgWarnRatio) > 100){
                    ufma.showTip('预警百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
				if (argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function () {
					}, 'warning');
				} else {
					budgetModel.chrName = argu.chrName;
					budgetModel.enabled = argu.enabled;
					budgetModel.bgCtrlType = argu.bgCtrlType;
					budgetModel.bgCtrlTypeName = "";
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
					ufma.showloading('数据保存中，请耐心等待...');
					var callback = function (result) {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('保存成功！', function () {}, 'success');
								page.qryAccs();
								page.setBaseFormEdit(true);
								page.editor.close();
								page.getBudgetModel();
								page.openEdtWin();
								page.action = 'add';
								page.clearmodel();
							
						}
					}
					ufma.post(url, budgetModel, callback);
				}
			},
			saveBaseInfo: function () {
				var url = '/bg/Plan/ctrlPlan/savePlan?agencyCode' + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = $('#crtlplan-base').serializeObject();
                if(parseFloat(argu.bgCtrlRatio) > 100){
                    ufma.showTip('控制百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
                if(parseFloat(argu.bgWarnRatio) > 100){
                    ufma.showTip('预警百分比不能大于100', function () {
                    }, 'warning');
                    return false;
                }
				if (argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function () {
					}, 'warning');
					return false;
				} else {
					tempCrtlPlan.chrName = argu.chrName;
					tempCrtlPlan.enabled = argu.enabled;
					tempCrtlPlan.bgCtrlType = argu.bgCtrlType;
					tempCrtlPlan.bgCtrlTypeName = "";
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
					tempCrtlPlan.items = this.serializeItems();
					tempCrtlPlan.budgetPlan = this.serializeBudgetplan();
                    ufma.showloading('数据保存中，请耐心等待...');
					var callback = function (result) {
						ufma.hideloading();
						ufma.showTip('保存成功！', function () {}, 'success');
							page.qryAccs();
							if (tempCrtlPlan.chrName != null) {
								if (tempCrtlPlan.chrName.length > 30) {  //20个字符  字符长度大于等于10  超过长度显示...
									tempCrtlPlan.chrName = tempCrtlPlan.chrName.substring(0, 30);
									tempCrtlPlan.chrName = tempCrtlPlan.chrName + "..."
								}
							}
							$('#crtlplan-base').setForm(tempCrtlPlan);
							//this.setCtrlItemsFormEdit(false);
							page.setBudgetPlanFormEdit(false);
							page.setBaseFormEdit(false);
						

					}

					ufma.post(url, tempCrtlPlan, callback);

				}
			},
			/*saveCtrlItems: function () {  //保存控制要素
				var url = '/bg/Plan/ctrlPlan/savePlan';
				tempCrtlPlan.isNew = '否';
				argu.agencyCode = page.agencyCode;
				tempCrtlPlan.items = this.serializeItems();
				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					}, 'success');
				}
				ufma.post(url, tempCrtlPlan, callback);
			},
			saveBudgetPlan: function () {  //保存预算方案
				var url = '/bg/Plan/ctrlPlan/savePlan';
				tempCrtlPlan.isNew = '否';
				tempCrtlPlan.setYear = page.pfData.svSetYear;
				argu.agencyCode = page.agencyCode;
				tempCrtlPlan.budgetPlan.planVo_Items = this.serializeBudgetplan();
				var callback = function (result) {
					ufma.showTip('保存成功！', function () {
						page.qryAccs();
					}, 'success');
				}
				ufma.post(url, tempCrtlPlan, callback);
			},*/
			serializeItems: function () {
				var aItems = [];
				$('#items-selected ul li').each(function () {
					var tmpItems = {};
					tmpItems.eleId = $(this).find("#eleId").attr("value");
					tmpItems.eleCode = $(this).find("#eleCode").attr("value");
					tmpItems.eleName = $(this).html();
					tmpItems.useThis = "1";
					aItems.push(tmpItems);
				});
				return aItems;
			},
			serializeBudgetplan: function () {
				var aBudgetplan = [];
				$('#budgetplan-selected ul li').each(function () {
					var tmpBudgetplan = {};
					tmpBudgetplan.chrId = $(this).find("#budget-chrid").attr("value");
					tmpBudgetplan.chrCode = $(this).find("#budget-chrcode").attr("value");
					tmpBudgetplan.chrName = $(this).html();
					tmpBudgetplan.useThis = "1";
					aBudgetplan.push(tmpBudgetplan);
				});
				return aBudgetplan;
			},
			seeCrtlPlan: function (chrId, ret) {
				//ufma.showloading('正在请求数据，请耐心等待...');
				page.chrId = chrId;
				var url = '/bg/Plan/ctrlPlan/getPlan';
				var argu = { "ctrlPlanChrId": chrId, "agencyCode": page.agencyCode, "setYear": page.pfData.svSetYear };
				var callback = function (result) {
					isUsed = result.data.isUsed;
					tempCrtlPlan = result.data;
					if (ret == undefined)
						page.openEdtWin(tempCrtlPlan);
					else
						page.openEdtWin(tempCrtlPlan, false);
				}

				ufma.get(url, argu, callback);
			},
			getBudgetModel: function () {
				var url = '/bg/Plan/ctrlPlan/newPlan';
				var argu = { "agencyCode": page.agencyCode, "setYear": page.pfData.svSetYear };
				var callback = function (result) {
					budgetModel = result.data;
					page.drawOptionCtrlItems(budgetModel);
					page.redrawBudgetPlan(budgetModel);
				}
				ufma.get(url, argu, callback);

			},
			clearmodel: function () {
				$('#items-selected-ul').html("");
				$('#budgetplan-selected-ul').html("");
				$('#ctrl-crtlplan').html("");
				$('#ctrl-items').html("");
				$('#items-allShow').html("");
				$('#budgetplans-allShow').html("");
			},
			getErrMsg: function (errcode) {
				var error = {
					0: '方案名称不能为空'
				}
				return error[errcode];
			},
			initAgencyScc: function () {   //初始化单位信息
				bg.setAgencyCombox($('#cbAgency'), {
					"userCode": page.pfData.svUserCode,
					"userId": page.pfData.svUserId,
					"setYear": page.pfData.svSetYear
				}, function (sender,treeNode) {
					page.agencyCode = treeNode.id;
					page.agencyName = treeNode.name;
					//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
					page.qryAccs();	
				});
			},
			onEventListener: function () { //新增按钮触发事件
				this.get('#btn-add').on('click', function (e) {
					if ($.isNull(page.agencyCode)) {
						ufma.showTip("请选择单位！",function(){}, "warning");
						return false;
					}
					ufma.hideInputHelp('chrName');
					$('#chrName').closest('.form-group').removeClass('error');
					$('#crtlPlanSaveAll').attr('disabled', false);
					e.preventDefault();
					page.action = 'add';
					page.getBudgetModel();
					page.openEdtWin();
					page.clearmodel();
					page.drawOtherCtrlplan(planData);
					$('#items-setRight').attr('disabled', false);
					$('#items-setLeft').attr('disabled', false);
					$('#budgetplan-setLeft').attr('disabled', false);
					$('#budgetplan-setRight').attr('disabled', false);
				});
				this.get('#crtlPlanSaveAll').on('click', function (e) {
					e.preventDefault();
					page.saveAll();
				});
				this.get('#crtlPlanSaveAdd').on('click', function (e) {//保存并新增
					e.preventDefault();
					page.saveAdd();

				});
				$('#crtlPlanBaseBtnGroup .btn-save').on('click', function () {  //基本信息保存
					var ret = page.saveBaseInfo();
				});
				$('#crtlPlanBaseBtnGroup .btn-cancel').on('click', function () {  //基本信息取消
					page.clearmodel();
					page.initWindow(page.curData);
					page.seeCrtlPlan(page.chrId, false);
				});
				$('#budgetplanBtnGroup .btn-save').on('click', function () {  //预算方案保存
					var ret = page.saveBaseInfo();//待完善
				});
				$('#budgetplanBtnGroup .btn-cancel').on('click', function () {  //控制方案取消
					page.clearmodel();
					page.initWindow(page.curData);
					page.seeCrtlPlan(page.chrId, false);
				});
				$('#btnCrtlPlanBaseEdit').on('click', function () {//基本信息编辑
					if (isUsed == '1') {  //isUsed后台暂传过来NULL  待修改
						ufma.showTip('该方案已经被使用,不可修改控制要素信息!', function () {
						}, 'warning');
					} else {
						page.setBaseFormEdit(true); //guohx 新增判断查看界面  控制方式不可修改
					}
				});
				$('#btnUseCtrlItemsEdit').on('click', function () {   //控制要素编辑
					if (isUsed == '1') {  //isUsed后台暂传过来NULL  待修改
						ufma.showTip('该方案已经被使用,不可修改控制要素信息!', function () {
						}, 'warning');
					} else {
						page.setCtrlItemsFormEdit(true);
					}

				});
				/*	$('#btnUseBudgetPlanEdit').on('click', function () {  //控制方案编辑
						if (isUsed == '1') {
							ufma.showTip('该方案已经被使用,不可修改控制方案信息!', function () {
							}, 'warning');
						} else {
							page.setBudgetPlanFormEdit(true);
						}
	
					});*/
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
					}
					else {
						$('#items-allShow').addClass('hide');
					}
				});
				$('#btnUseBudgetPlansStop').on('click', function () {
					if ($('#budgetplans-allShow').hasClass('hide')) {
						$('#budgetplans-allShow').removeClass('hide');
					}
					else {
						$('#budgetplans-allShow').addClass('hide');
					}
				});
				//控制要素
				$('#crtlplan-items').find(".items-list-ul").on("click", "li", function () {
					if (!$(this).hasClass("rpt-li-active"))
						$(this).addClass("rpt-li-active");
					else
						$(this).removeClass("rpt-li-active");
				});
				$("#items-setRight").on("click", function () {
					var checkDom = $(".items-list-ul-l li.rpt-li-active");
					if (checkDom.length > 0) {
						if ($(checkDom).siblings().length > 0) {
							$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						}
						$(".items-list-ul-r").append($(checkDom));
						$(".items-list-ul-r li").removeClass("rpt-li-active");
						$(".items-list-ul-l li").removeClass("rpt-li-active");
						page.redrawBudgetPlan(budgetModel);
						selectedBudgetPlans = [];  //只要变换了要素,就要清空已选预算方案  bug78761
						$('#budgetplan-selected-ul').html("");
					}
				});
				$("#items-setLeft").on("click", function () {
					var checkDom = $(".items-list-ul-r li.rpt-li-active");
					if (checkDom.length > 0) {
						if ($(checkDom).siblings().length > 0) {
							$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						}
						$(".items-list-ul-l").append($(checkDom));
						$(".items-list-ul-l li").removeClass("rpt-li-active");
						$(".items-list-ul-r li").removeClass("rpt-li-active");
						page.redrawBudgetPlan(budgetModel);
						selectedBudgetPlans = [];  //只要变换了要素,就要清空已选预算方案  bug78761
						$('#budgetplan-selected-ul').html("");
					}
				});
				//控制方案
				$('#crtlplan-budgetplan').find(".budgetplan-list-ul").on("click", "li", function () {
					if (!$(this).hasClass("rpt-li-active"))
						$(this).addClass("rpt-li-active");
					else
						$(this).removeClass("rpt-li-active");
				});
				$("#budgetplan-setRight").on("click", function () {
					var checkDom = $(".budgetplan-list-ul-l li.rpt-li-active");
					if (checkDom.length > 0) {
						if ($(checkDom).siblings().length > 0) {
							$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						}
						$(".budgetplan-list-ul-r li").removeClass("rpt-li-active");
						$(".budgetplan-list-ul-r").append($(checkDom));
					}
				});
				$("#budgetplan-setLeft").on("click", function () {
					var checkDom = $(".budgetplan-list-ul-r li.rpt-li-active");
					if (checkDom.length > 0) {
						if ($(checkDom).siblings().length > 0) {
							$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						}
						$(".budgetplan-list-ul-l li").removeClass("rpt-li-active");
						$(".budgetplan-list-ul-l").append($(checkDom));
					}
				});
				$("#bgCtrlRatio").on("keyup", function (e) {
					$(this).val($(this).val().replace(/[^0-9.]/g, ''));
					if (parseInt($(this).val()) > 100) {
						$(this).val('');
					}
				});
				$("#bgWarnRatio").on("keyup", function (e) {
					$(this).val($(this).val().replace(/[^0-9.]/g, ''));
					if (parseInt($(this).val()) > 100) {
						$(this).val('');
					}
				});
				//CWYXM-11838 --基础资料-指标控制方案，点击右侧常用功能-预算支出控制设置在该界面新增窗口没有下一步按钮--zsj
				$("#crtlplan-edt").on("click", ".ysfa", function () {
					var newUrl = "/pf/bg/budgetPlan/budgetPlan.html?agencyCode=" + page.agencyCode+"&menuid=ea6e8c67-1b4d-4823-9351-e627e42b9377";
					//$(this).attr('data-href', newUrl);
					//window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "预算方案");
				});
					//CWYXM-11838 --基础资料-指标控制方案，点击右侧常用功能-预算支出控制设置在该界面新增窗口没有下一步按钮--zsj
				$("#crtlplan-edt").on("click", ".yszc", function () {
					var newUrl = "/pf/bg/budgetAccoSet/budgetAccoSet.html?agencyCode=" + page.agencyCode+"&menuid=30a424d4-ff41-4f65-a312-c8eeaf71a527";
					//$(this).attr('data-href', newUrl);
					//window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', newUrl, false, "预算支出控制设置");
				});
				//校验方案名称
				$('#chrName').on('mouseenter paste keyup', function (e) {
					e.stopepropagation;
					$('#chrName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('chrName', textValue);
				}).on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#chrName').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrName');
						$('#chrName').closest('.form-group').removeClass('error');
					}
				});
				var vdefault = $('#bgCtrlRatio').val();
				$('#bgCtrlRatio').focus(function () {
					//获得焦点时，如果值为默认值，则设置为空
					if ($(this).val() == vdefault) {
						$(this).val("");
					}
				});
				$('#bgCtrlRatio').blur(function () {
					//失去焦点时，如果值为空，则设置为默认值
					if ($(this).val() == "") {
						$(this).val(vdefault);;
					}
				});

				var vefault = $('#bgWarnRatio').val();
				$('#bgWarnRatio').focus(function () {
					//获得焦点时，如果值为默认值，则设置为空
					if ($(this).val() == vefault) {
						$(this).val("");
					}
				});
				$('#bgWarnRatio').blur(function () {
					//失去焦点时，如果值为空，则设置为默认值
					if ($(this).val() == "") {
						$(this).val(vefault);;
					}
				});
			},
			// 初始化页面
			initPage: function () {
				this.initAgencyScc();
				$('#ctrlRatio').intInput();
				$('#warnRatio').intInput();
			},
			// 此方法必须保留
			init: function () {
				page.pfData = ufma.getCommonData();
				this.initPage();
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				this.onEventListener();
				this.qryAccs();
				ufma.parse();
				window.addEventListener('message', function(e) {
					if(e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
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

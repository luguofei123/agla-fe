$(function() {
	var page = function() {
		// 定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrCode, chrName, remark;
		// 传输设置数据的对象
		var fromSys;
		var budgetModel;
		var tempBudgetPlan;
		var agencyCode;
		var setYear;
		var curBgPlanChrId = '';
		return {
			namespace: 'budgetPlanSys',
			curData: new Object(),
			editMode: 'new',
			get: function(tag) {
				return $('#' + page.namespace).find(tag);
			},
			openEdtWin: function(curData) {
				if(curData) {
					//查看界面
					this.curData = curData;
					this.editMode = 'edit';
					$('#budgetPlanSaveAdd').addClass('hide'); //最外面按钮隐藏(保存并新增,保存,下发,取消)
					$('#budgetPlanSaveAll').addClass('hide');
					$('#budgetPlanCancelAll').addClass('hide');
					$('#budgetPlanCloseAll').removeClass('hide'); //显示关闭按钮
					$('#btnBudgetPlanBaseEdit').removeClass('hide'); //显示基本信息编辑按钮
          $('#btnBudgetPlanYSXXEdit').removeClass('hide'); //显示要素信息编辑按钮
          // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          $('#btnPlanTextEdit').removeClass('hide'); //显示文本说明项编辑按钮
          $('#budgetPlanTextBtnGroup').addClass('hide'); //隐藏文本说明项保存、关闭按钮
					this.initWindow(curData);
					$('#budgetPlanYSXX').find("input[name='isUsed']").attr("disabled", true);
          $('#budgetPlanYSXX').find("a[data-toggle='tooltip']").attr("disabled", true);
          // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          $('#budgetPlanText').find("input[name='isUsed']").attr("disabled", true);
					$('#budgetPlanText').find("a[data-toggle='tooltip']").attr("disabled", true);
				} else {
					//新增界面
					this.editMode = 'new';
					$('#budgetPlanSys-base')[0].reset();
					this.setBaseFormEdit(true);
					$('#budgetPlanSaveAdd').removeClass('hide');
					$('#budgetPlanSaveAll').removeClass('hide');
					$('#budgetPlanCancelAll').removeClass('hide');
					$('#budgetPlanCloseAll').addClass('hide');
					$('#btnBudgetPlanBaseEdit').addClass('hide');
					$('#btnBudgetPlanYSXXEdit').addClass('hide');
          $('#budgetPlanYSXXBtnGroup').addClass('hide');
          // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          $('#btnPlanTextEdit,#budgetPlanTextBtnGroup').addClass('hide'); //显示文本说明项编辑按钮
          $('#budgetPlanYSXXBtnGroup').addClass('hide');
					$('#budgetPlanSys-base')[0].reset();
				}
				page.editor = ufma.showModal('budgetPlanSys-edt', 990, 420); //contentID,width,height,callback
			},
			initWindow: function(curData) {
				$('#budgetPlanSys-base').setForm(curData);
				this.setBaseFormEdit(false);
        page.drawBudgetPlanYSXX(curData);
        // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        page.drawBudgetPlanText(curData);
				page.setYSXXFormEdit(false);
			},
			setBaseFormEdit: function(enabled) {
				if(enabled) {
					//编辑基本信息
					$('#budgetPlanSys-base .control-element .form-control,#budgetPlanSys-base .control-element .btn-group').removeClass('hide');
					$('#budgetPlanSys-base .control-element .control-label').addClass('hide');
					if(this.editMode == 'edit') {
						$('#budgetPlanBaseBtnGroup').removeClass('hide');
					} else {
						$('#budgetPlanBaseBtnGroup').addClass('hide');
					}
					$('#btnBudgetPlanBaseEdit').addClass('hide');
				} else {
					$('#btnBudgetPlanBaseEdit').removeClass('hide');
					$('#budgetPlanBaseBtnGroup').addClass('hide');
					$('#budgetPlanSys-base .control-element .form-control,#budgetPlanSys-base .control-element .btn-group').addClass('hide');
					$('#budgetPlanSys-base .control-element .control-label').removeClass('hide');
				}
			},
			setYSXXFormEdit: function(enabled) { //编辑要素信息
				if(enabled) {
					$('#budgetPlanSys-ysxx .control-element .form-control').removeClass('hide');
					$('#budgetPlanSys-ysxx .control-element .control-label').addClass('hide');
					if(this.editMode == 'edit') {
						$('#budgetPlanYSXXBtnGroup').removeClass('hide');
					} else {
						$('#budgetPlanYSXXBtnGroup').addClass('hide');
					}
					$('#btnBudgetPlanYSXXEdit').addClass('hide');
				} else {
					$('#budgetPlanYSXX tbody tr').each(function() {
						$row = $(this);
						$row.find('label[for="chrName"]').html($row.find('[name="chrName"]').val());
					});
					$('#btnBudgetPlanYSXXEdit').removeClass('hide');
					$('#budgetPlanYSXXBtnGroup').addClass('hide');
					$('#budgetPlanSys-ysxx .control-element .form-control').addClass('hide');
					$('#budgetPlanSys-ysxx .control-element .control-label').removeClass('hide');
					$('#budgetPlanYSXX thead tr th.btnGroup').remove();
					$('#budgetPlanYSXX tbody tr td.btnGroup').remove();
					$('#budgetPlanYSXX').find("input[name='isUsed']").attr("disabled", true);
					$('#budgetPlanYSXX').find("a[data-toggle='tooltip']").attr("disabled", true);
					$('#budgetPlanYSXX').find("input[name='eleIsPri']").attr("disabled", true);
					$('#budgetPlanYSXX').find("select[name='eleLevel']").attr("disabled", true);
				}
			},
			qryAccs: function() {
				var url = '/bg/Plan/budgetPlan/getPlanList';
				var argu = {
					"agencyCode": page.agencyCode,
					"setYear": page.setYear
				};
				var callback = function(result) {
					page.drawBudgetPlanCount(result.data);
					page.drawPanleCards(result.data);
				}
				ufma.get(url, argu, callback);

			},
			drawPanleCards: function(cardsData) { //画主页面卡片
				var $cards = $('#budgetPlanSys-cards'); //未懂
				$cards.html('');
				var $row;
				$.each(cardsData.plans, function(idx, row) {
					var chrId = row.chrId;
					var chrName = row.chrName || '';
					var expBgTypeName = row.expBgTypeName;
					var summary = row.summary;
					var enabled = row.enabled;
					var fromSys = row.fromSys;
					var isUsed = row.isUsed;
					var colorIndex = idx % 5 + 1;
					if(summary != null) {
						if(summary.length > 48) { //20个字符  字符长度大于等于10  超过长度显示...
							summary = summary.substring(0, 48);
							summary = summary + "..."
						}
					}
					if(chrName != null) {
						if(chrName.length > 15) { //20个字符  字符长度大于等于10  超过长度显示...
							chrName = chrName.substring(0, 15);
							chrName = chrName + "..."
						}
					}
					if(idx % 3 == 0) {
						$row = $('<div class="row"></div>').appendTo($cards);
					}
					var $col = $('<div class="col-xs-6 col-md-4 padding-15 padding-8 padding-top-8 " ></div>');
					if(enabled == '否') {
						var $newCard = $('<div class="ufma-card ufma-card-icon card-gray ">').appendTo($col);
						$('<div class="card-icon circle-gray" color-index=' + colorIndex + '><span class="icon">' + chrName.substring(0, 1) + '</span></div>').appendTo($newCard);
						var $newCard1 = $('<div class="ufma-card-header"><p class="font-size16 chrId hidden">' + chrId + '</p><span class="name-gray">' + chrName + '</span></div>').appendTo($newCard);
						$('</div></div>').appendTo($newCard1);
					} else {
						var $newCard = $('<div class="ufma-card ufma-card-icon ">').appendTo($col);
						$('<div class="card-icon" color-index=' + colorIndex + '><span class="icon name-font">' + chrName.substring(0, 1) + '</span></div>').appendTo($newCard);
						var $newCard1 = $('<div class="ufma-card-header"><p class="font-size16 chrId hidden">' + chrId + '</p><span>' + chrName + '</span></div>').appendTo($newCard);
						if(isUsed == '1') {
							$('<span class="budget-used">已使用</span></div>').appendTo($newCard1);
						}
					}
					var $newCard2 = $('<div class="ufma-card-body card-height"><div style=" margin-bottom: 8px";>方案类型：<span>' + expBgTypeName + '</span></div>').appendTo($newCard);
					if(summary == null) {
						$('<div class="card-fams" id="description">方案描述 : </div></div>').appendTo($newCard2);
					} else {
						$('<div class="card-fams" id="description">方案描述 : ' + summary + '</div></div>').appendTo($newCard2);
					}
					var $footer = $('<div class="ufma-card-footer">').appendTo($newCard);
					if(fromSys == "1") {
						if(enabled == '否') {
							var $common = $('<div class="budget-common common-gray"><span>公共</span></div>').appendTo($footer);
						} else {
							var $common = $('<div class="budget-common"><span>公共</span></div>').appendTo($footer);
						}
					}
					var $btnwatch = $('<a class="btn-label btn-watch budgetPlanSys-watch btn-permission" style="cursor:pointer;"><i class="glyphicon icon-eye"></i>查看</a>').appendTo($footer);
					var $btndel = $('<a class="btn-label btn-delete btn-permission" style="cursor:pointer;"><i class="glyphicon icon-trash"></i>删除</a>').appendTo($footer);
          $col.appendTo($row);
          // 修改85问题 ：系统管理-预算方案-查看：连续迅速点击多次时，会连续弹出多个详细信息页面--zsj
          var clicktag = 0;
					$btnwatch.on('click', function() {
            // 修改85问题 ：系统管理-预算方案-查看：连续迅速点击多次时，会连续弹出多个详细信息页面--zsj
            if (clicktag == 0 || $('.u-msg-dialog-content').length == 0){
              ufma.hideInputHelp('chrName');
              $('#chrName').closest('.form-group').removeClass('error'); //guohx  修改 新增查看时去掉上次未填写方案名称出现的错误提示
              page.clearmodel();
              page.seeBudgetPlan(chrId);
              $('#budgetPlanSenddown').attr('disabled', false);
              clicktag ++;
            } else {
              return false;
            }
					});
					var chrId = row.chrId;
					$btndel.on('click', function() {
						if(isUsed == '1') {
							ufma.showTip('该预算方案已经被使用,不允许删除！', function() {}, 'warning');
						} else {
							ufma.confirm('您是要删除预算方案【' + chrName + '】？', function(action) {
								if(action) {
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
			drawBudgetPlanCount: function(cardsData) {
				$(".budgetPlanCount").html("");
				var $dl = $('<div class="col-xs-8">' +
					'<div id="ele-count" style="font-size: 16px;">全部方案共 <span style="color: #108EE9;" >' + cardsData.planCount + '</span> 个</div> '
				);
				$(".budgetPlanCount").append($dl);
			},
			drawBudgetPlanYSXX: function(result) { //绘制要素信息
				var $table = $('#budgetPlanYSXX');
				for(var i = 0; i < result.planVo_Items.length; i++) {
					var $dl = $('<tr style="height:35px">');
					var $dl1 = $('<td class="text-center hide" > <div name="eleSn" value="' + result.planVo_Items[i].eleSn + '"></div></td>' +
						'<td class="text-center" name="eleCode" >' + result.planVo_Items[i].eleCode + '</td>' +
						'<td class="text-center" name="eleName">' + result.planVo_Items[i].eleName + '</td>').appendTo($dl);
					if(result.planVo_Items[i].isUsed == '1') {
						var $used = $('<td class="text-center">' +
							'	<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'   	<input type="checkbox" class="group-checkable" data-set="#data-table .checkboxes" name="isUsed" checked /><span></span> ' +
							'	&nbsp</label>' +
							'</td>').appendTo($dl);
					} else {
						var $used = $('<td class="text-center">' +
							'	<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'   	<input type="checkbox" class="group-checkable" data-set="#data-table .checkboxes" name="isUsed" /><span></span> ' +
							'	&nbsp</label>' +
							'</td>').appendTo($dl);
					}
					if(result.planVo_Items[i].eleIsPri == '1') {
						var $priEle = $('<td class="text-center">' +
							'	<label class="mt-radio mt-radio-outline">' +
							'   	<input type="radio" class ="notIsUpBudget"  name="eleIsPri" checked /><span></span> ' +
							'	&nbsp</label>' +
							'</td>').appendTo($dl);
					} else {
						//CWYXM-11697-最后一行增加‘是否采购’，可以勾选是否使用、拖动顺序，不能设置主要素和编制级次--zsj
						if(result.planVo_Items[i].eleCode == 'ISUPBUDGET') {
							var $priEle = $('<td class="text-center">' +
								'	<label class="mt-radio mt-radio-outline">' +
								'   	<input type="radio"  name="eleIsPri" disabled /><span></span> ' +
								'	&nbsp</label>' +
								'</td>').appendTo($dl);
						} else {
							var $priEle = $('<td class="text-center">' +
								'	<label class="mt-radio mt-radio-outline">' +
								'   	<input type="radio" class ="notIsUpBudget"  name="eleIsPri" /><span></span> ' +
								'	&nbsp</label>' +
								'</td>').appendTo($dl);
						}

					}
					var temEleLevel = result.planVo_Items[i].eleLevel;
					var maEleLevel = result.planVo_Items[i].maEleLevel;
					if(result.planVo_Items[i].eleCode == 'ISUPBUDGET') {
						var $eleLevel = $('<td class=" text-center">').appendTo($dl);
						var $eleLevel1 = $('<select class="select-ie compile-order" id="edit-order' + i + '" name="eleLevel" disabled>').appendTo($eleLevel);
						var $eleLevel2 = $('<option value="-1">不限制</option><option value="0">明细级</option>').appendTo($eleLevel1);
						var $eleLevel4 = $('	</select>' +
							'</td>' +
							'<td class="text-center">' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动改变顺序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>' +
							'</tr>').appendTo($dl);
						$dl.find("#edit-order" + i).find("option[value='" + temEleLevel + "']").attr("selected", true);
					} else if(temEleLevel != "" || temEleLevel != null) {
						var $eleLevel = $('<td class=" text-center">').appendTo($dl);
						var $eleLevel1 = $('<select class="select-ie compile-order notIsUpBudget" id="edit-order' + i + '" name="eleLevel">').appendTo($eleLevel);
						var $eleLevel2 = $('<option value="-1">不限制</option><option value="0">明细级</option>').appendTo($eleLevel1);
						for(var j = 1; j <= maEleLevel; j++) {
							var $dyElelevel = $('<option value=' + j + '>' + j + '级</option>').appendTo($eleLevel1);
						}
						var $eleLevel4 = $('	</select>' +
							'</td>' +
							'<td class="text-center">' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动改变顺序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>' +
							'</tr>').appendTo($dl);
						$dl.find("#edit-order" + i).find("option[value='" + temEleLevel + "']").attr("selected", true);
					} else {
						var $eleLevel = $('<td class=" text-center">').appendTo($dl);
						var $eleLevel1 = $('<select class="select-ie compile-order notIsUpBudget" id="edit-order' + i + '" name="eleLevel">').appendTo($eleLevel);
						var $eleLevel2 = $('<option value="-1">不限制</option><option value="0">明细级</option>').appendTo($eleLevel1);
						for(var j = 1; j <= maEleLevel; j++) {
							var $dyElelevel = $('<option value=' + j + '>' + j + '级</option>').appendTo($eleLevel1);
						}
						var $eleLevel4 = $('	</select>' +
							'</td>' +
							'<td class="text-center">' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动改变顺序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>' +
							'</tr>').appendTo($dl);
					}
					$table.append($dl);
					$dl.find('td .btn[data-toggle="tooltip"]').tooltip();
					$dl.find('td .btnDrag').on('mousedown', function(e) {
						var callback = function() {}
						$('#budgetPlanYSXX').tableSort(callback);
					});
				}
				$("input[name='eleIsPri']").attr("disabled", true);
				$("select[name='eleLevel']").attr("disabled", true);
				$('input[name="isUsed"]').on('click', function() {
					if($(this).is(':checked')) {
						$(this).parent().parent().parent().find("input[name='eleIsPri'].notIsUpBudget").attr("disabled", false);
						$(this).parent().parent().parent().find("select[name='eleLevel'].notIsUpBudget").attr("disabled", false);
					} else {
						$(this).parent().parent().parent().find("input[name='eleIsPri'].notIsUpBudget").attr("disabled", true);
						$(this).parent().parent().parent().find("input[name='eleIsPri'].notIsUpBudget").attr("checked", false);
						$(this).parent().parent().parent().find("select[name='eleLevel'].notIsUpBudget").attr("disabled", true);
					}
				});
				ufma.isShow(reslist);
      },
      // 绘制文本项
      drawBudgetPlanText: function(result) {
        $('#budgetPlanText tbody').html('')
				var $table = $('#budgetPlanText');
				for(var i = 0; i < result.planVo_Txts.length; i++) {
					var $dl = $('<tr style="height:35px">');
					var $dl1 = $('<td class="text-center hide" > <div name="eleSn" value="' + result.planVo_Txts[i].eleSn + '"></div></td>' +
						'<td class="" name="eleCode" >' + result.planVo_Txts[i].eleCode + '</td>' +
						'<td class="" name="eleName">' + result.planVo_Txts[i].eleName + '</td>').appendTo($dl);
					if(result.planVo_Txts[i].isUsed == '1') {
						var $used = $('<td class="text-center">' +
							'	<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'   	<input type="checkbox" class="group-checkable" data-set="#data-table .checkboxes" name="isUsed" checked /><span></span> ' +
							'	&nbsp</label>' +
							'</td>').appendTo($dl);
					} else {
						var $used = $('<td class="text-center">' +
							'	<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'   	<input type="checkbox" class="group-checkable" data-set="#data-table .checkboxes" name="isUsed" /><span></span> ' +
							'	&nbsp</label>' +
							'</td>').appendTo($dl);
					}
          var $eleLevel4 = $('</select>' +
          '</td>' +
          '<td class="text-center">' +
          '<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动改变顺序"><span class="glyphicon icon-drag"></span></a>' +
          '</td>' +
          '</tr>').appendTo($dl);
					$table.append($dl);
					$dl.find('td .btn[data-toggle="tooltip"]').tooltip();
					$dl.find('td .btnDrag').on('mousedown', function(e) {
						var callback = function() {}
						$('#budgetPlanText').tableSort(callback);
					});
				}
				ufma.isShow(reslist);
      },
      // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
      //编辑文本项信息
			setTextFormEdit: function(enabled) {
				if(enabled) {
					$('#budgetplan-text .control-element .form-control').removeClass('hide');
					$('#budgetplan-text .control-element .control-label').addClass('hide');
					if(this.editMode == 'edit') {
						$('#budgetPlanTextBtnGroup').removeClass('hide');
					} else {
						$('#budgetPlanTextBtnGroup').addClass('hide');
					}
					$('#btnPlanTextEdit').addClass('hide');
				} else {
					$('#budgetPlanText tbody tr').each(function() {
						$row = $(this);
						$row.find('label[for="chrName"]').html($row.find('[name="chrName"]').val());
					});
					$('#btnPlanTextEdit').removeClass('hide');
					$('#budgetPlanTextBtnGroup').addClass('hide');
					$('#budgetplan-text .control-element .form-control').addClass('hide');
					$('#budgetplan-text .control-element .control-label').removeClass('hide');
					$('#budgetPlanText thead tr th.btnGroup').remove();
					$('#budgetPlanText tbody tr td.btnGroup').remove();
					$('#budgetPlanText').find("input[name='isUsed']").attr("disabled", true);
					$('#budgetPlanText').find("a[data-toggle='tooltip']").attr("disabled", true);
				}
      },
      //保存文本项信息
			saveTextInfo: function() {
				var url = '/bg/Plan/budgetPlan/savePlan';
				var argu = $('#budgetPlanSys-base').serializeObject();
				tempBudgetPlan.isNew = '否';
				tempBudgetPlan.bgTypeName = argu.bgTypeName;
				tempBudgetPlan.chrName = argu.chrName;
				tempBudgetPlan.enabled = argu.enabled;
				tempBudgetPlan.isComeDocNum = argu.isComeDocNum;
        tempBudgetPlan.isSendDocNum = argu.isSendDocNum;
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        tempBudgetPlan.isFinancialBudget = argu.isFinancialBudget;
				tempBudgetPlan.expBgTypeName = argu.expBgTypeName;
				tempBudgetPlan.summary = argu.summary;
        tempBudgetPlan.planVo_Items = this.serializeYSXX();
        // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        tempBudgetPlan.planVo_Txts = page.serializeText();
				argu.agencyCode = page.agencyCode;
				ufma.showloading('数据保存中，请耐心等待...');
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip('保存成功！', function() {}, 'success');
					page.qryAccs();
				}
				ufma.post(url, tempBudgetPlan, callback);
      },
      //序列化文本项信息
			serializeText: function() { 
				var aKJYS = [];
				var irow = 100;
				$('#budgetPlanText tbody tr').each(function(idx) {
					var tmpYS = {};
					irow = irow + 1;
					tmpYS.eleCode = $(this).find('[name="eleCode"]').html();
          tmpYS.eleSn = irow;
          tmpYS.eleIsPri = '0';
          tmpYS.eleLevel = '0';
					tmpYS.eleName = $(this).find('[name="eleName"]').html();
					if($(this).find('input[name="isUsed"]').is(':checked') == true) {
						tmpYS.isUsed = "1";
					} else {
						tmpYS.isUsed = "0";
					}
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},
			delete: function(chrId) { //删除
				var url = '/bg/Plan/budgetPlan/delPlan/';
				var argu = {
					"bgPlanChrId": chrId,
					"agencyCode": page.agencyCode,
					"setYear": page.setYear
				};
				var callback = function(result) {
					if(result.flag == 'success') {
						ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
					}
					page.qryAccs();
				}
				ufma.get(url, argu, callback);
			},
			saveAll: function() { //保存
				var url = '/bg/Plan/budgetPlan/checkPlanNameExist';
				var argu = $('#budgetPlanSys-base').serializeObject();
				if(argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function() {}, 'error');
				} else {
					budgetModel.bgTypeName = argu.bgTypeName;
					budgetModel.chrName = argu.chrName;
					budgetModel.enabled = argu.enabled;
          budgetModel.isComeDocNum = argu.isComeDocNum;
          budgetModel.isSendDocNum = argu.isSendDocNum;
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          budgetModel.isFinancialBudget = argu.isFinancialBudget;
					budgetModel.expBgTypeName = argu.expBgTypeName;
					budgetModel.summary = argu.summary;
					budgetModel.setYear = page.setYear;
					budgetModel.isNew = '是';
					argu.agencyCode = page.agencyCode;
					budgetModel.agencys = [{
						agencyCode: page.agencyCode,
						agencyName: page.agencyName
					}];
					var callback = function(result) {
						if((result.flag == 'success') && (result.data.canSaveMsg == '1')) {
							var url = '/bg/Plan/budgetPlan/savePlan';
							var argu = $('#budgetPlanSys-base').serializeObject();
							budgetModel.bgTypeName = argu.bgTypeName;
							budgetModel.chrName = argu.chrName;
							budgetModel.enabled = argu.enabled;
							budgetModel.isComeDocNum = argu.isComeDocNum;
              budgetModel.isSendDocNum = argu.isSendDocNum;
              //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
              budgetModel.isFinancialBudget = argu.isFinancialBudget;                            
							budgetModel.expBgTypeName = argu.expBgTypeName;
							budgetModel.summary = argu.summary;
							budgetModel.setYear = page.setYear;
							budgetModel.isNew = '是';
							argu.agencyCode = page.agencyCode;
              budgetModel.planVo_Items = page.serializeYSXX();
              // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
              budgetModel.planVo_Txts = page.serializeText();
							ufma.showloading('数据保存中，请耐心等待...');
							var callback = function(result) {
								ufma.hideloading();
								if(result.flag == "success") {
									ufma.showTip('保存成功！', function() {}, 'success');
									$('#budgetPlanSenddown').attr('disabled', false);
                  page.editor.close();
									page.qryAccs();
								}
							}
							ufma.post(url, budgetModel, callback);
						} else if(result.data.canSaveMsg == '2') {
							//弹出确认框
							ufma.confirm('该单位下已经存在同名的预算方案,是否还要继续保存?', function(action) {
								if(action) {
									var url = '/bg/Plan/budgetPlan/savePlan';
									var argu = $('#budgetPlanSys-base').serializeObject();
									budgetModel.bgTypeName = argu.bgTypeName;
									budgetModel.chrName = argu.chrName;
									budgetModel.enabled = argu.enabled;
									budgetModel.isComeDocNum = argu.isComeDocNum;
                  budgetModel.isSendDocNum = argu.isSendDocNum;
                  //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                  budgetModel.isFinancialBudget = argu.isFinancialBudget;
									budgetModel.expBgTypeName = argu.expBgTypeName;
									budgetModel.summary = argu.summary;
									budgetModel.setYear = page.setYear;
									budgetModel.isNew = '是';
									argu.agencyCode = page.agencyCode;
                  budgetModel.planVo_Items = page.serializeYSXX();
                  // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
                  budgetModel.planVo_Txts = page.serializeText();
									ufma.showloading('数据保存中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										if(result.flag == "success") {
											ufma.showTip('保存成功！', function() {}, 'success');
											$('#budgetPlanSenddown').attr('disabled', false);
                      page.editor.close();
											page.qryAccs();
										}
									}
									ufma.post(url, budgetModel, callback);
								}
							}, {
								'type': 'warning'
							});
						} else {
							ufma.showTip(result.data.canSaveMsg, function() {}, 'error');
						}
					}
					ufma.post(url, budgetModel, callback);
				}
			},
			saveAdd: function() { //保存并新增
				var url = '/bg/Plan/budgetPlan/checkPlanNameExist';
				var argu = $('#budgetPlanSys-base').serializeObject();
				if(argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function() {}, 'warning');
				} else {
					budgetModel.bgTypeName = argu.bgTypeName;
					budgetModel.chrName = argu.chrName;
					budgetModel.enabled = argu.enabled;
					budgetModel.isComeDocNum = argu.isComeDocNum;
          budgetModel.isSendDocNum = argu.isSendDocNum;
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          budgetModel.isFinancialBudget = argu.isFinancialBudget;
					budgetModel.expBgTypeName = argu.expBgTypeName;
					budgetModel.summary = argu.summary;
					budgetModel.setYear = page.setYear;
					budgetModel.isNew = '是';
					argu.agencyCode = page.agencyCode;
					budgetModel.agencys = [{
						agencyCode: page.agencyCode,
						agencyName: page.agencyName
					}];
					var callback = function(result) {
						if((result.flag == 'success') && (result.data.canSaveMsg == '1')) {
							var url = '/bg/Plan/budgetPlan/savePlan';
							var argu = $('#budgetPlanSys-base').serializeObject();
							budgetModel.bgTypeName = argu.bgTypeName;
							budgetModel.chrName = argu.chrName;
							budgetModel.enabled = argu.enabled;
							budgetModel.isComeDocNum = argu.isComeDocNum;
              budgetModel.isSendDocNum = argu.isSendDocNum;
              //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
              budgetModel.isFinancialBudget = argu.isFinancialBudget;
							budgetModel.expBgTypeName = argu.expBgTypeName;
							budgetModel.summary = argu.summary;
							budgetModel.setYear = page.setYear;
							budgetModel.isNew = '是';
							argu.agencyCode = page.agencyCode;
              budgetModel.planVo_Items = page.serializeYSXX();
              // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
              budgetModel.planVo_Txts = page.serializeText();
							ufma.showloading('数据保存中，请耐心等待...');
							var callback = function(result) {
								ufma.hideloading();
								if(result.flag == "success") {
									ufma.showTip('保存成功！', function() {}, 'success');
									page.qryAccs();
									page.editor.close();
									$('#btn-add').trigger("click");
								}else {
                  page.setYSXXFormEdit(true);
                  page.setTextFormEdit(true);
								}
							}
							ufma.post(url, budgetModel, callback);
						} else if(result.data.canSaveMsg == '2') {
							//弹出确认框
							ufma.confirm('该单位下已经存在同名的预算方案,是否还要继续保存?', function(action) {
								if(action) {
									var url = '/bg/Plan/budgetPlan/savePlan';
									var argu = $('#budgetPlanSys-base').serializeObject();
									budgetModel.bgTypeName = argu.bgTypeName;
									budgetModel.chrName = argu.chrName;
									budgetModel.enabled = argu.enabled;
									budgetModel.isComeDocNum = argu.isComeDocNum;
                  budgetModel.isSendDocNum = argu.isSendDocNum;
                  //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                  budgetModel.isFinancialBudget = argu.isFinancialBudget;
									budgetModel.expBgTypeName = argu.expBgTypeName;
									budgetModel.summary = argu.summary;
									budgetModel.setYear = page.setYear;
									budgetModel.isNew = '是';
									argu.agencyCode = page.agencyCode;
                  budgetModel.planVo_Items = page.serializeYSXX();
                  // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
                  budgetModel.planVo_Txts = page.serializeText();
									ufma.showloading('数据保存中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										if(result.flag == "success") {
											ufma.showTip('保存成功！', function() {}, 'success');
											page.qryAccs();
											page.editor.close();
											$('#btn-add').trigger("click");
										}
									}
									ufma.post(url, budgetModel, callback);
								}
							}, {
								'type': 'warning'
							});
						} else {
							ufma.showTip(result.data.canSaveMsg, function() {}, 'error');
						}
					}
					ufma.post(url, budgetModel, callback);
				}
			},
			saveBaseInfo: function() { //保存基本信息
				var url = '/bg/Plan/budgetPlan/checkPlanNameExist';
				var argu = $('#budgetPlanSys-base').serializeObject();
				if(argu.chrName == null || argu.chrName == '') {
					ufma.showTip('请输入方案名称！保存失败', function() {}, 'warning');
				} else {
					tempBudgetPlan.isNew = '否';
					tempBudgetPlan.bgTypeName = argu.bgTypeName;
					tempBudgetPlan.chrName = argu.chrName;
					tempBudgetPlan.enabled = argu.enabled;
					tempBudgetPlan.isComeDocNum = argu.isComeDocNum;
          tempBudgetPlan.isSendDocNum = argu.isSendDocNum;
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          tempBudgetPlan.isFinancialBudget = argu.isFinancialBudget;
					tempBudgetPlan.expBgTypeName = argu.expBgTypeName;
					tempBudgetPlan.summary = argu.summary;
					tempBudgetPlan.setYear = page.setYear;
					argu.agencyCode = page.agencyCode;
					tempBudgetPlan.agencys = [{
						agencyCode: page.agencyCode,
						agencyName: page.agencyName
					}];
					var callback = function(result) {
						if((result.flag == 'success') && (result.data.canSaveMsg == '1')) {
							var url = '/bg/Plan/budgetPlan/savePlan';
							var argu = $('#budgetPlanSys-base').serializeObject();
							tempBudgetPlan.isNew = '否';
							tempBudgetPlan.bgTypeName = argu.bgTypeName;
							tempBudgetPlan.chrName = argu.chrName;
							tempBudgetPlan.enabled = argu.enabled;
							tempBudgetPlan.isComeDocNum = argu.isComeDocNum;
              tempBudgetPlan.isSendDocNum = argu.isSendDocNum;
              //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
              tempBudgetPlan.isFinancialBudget = argu.isFinancialBudget;
							tempBudgetPlan.expBgTypeName = argu.expBgTypeName;
							tempBudgetPlan.summary = argu.summary;
							argu.agencyCode = page.agencyCode;
							ufma.showloading('数据保存中，请耐心等待...');
							var callback = function(result) {
								ufma.hideloading();
								if(result.flag == "success") {
									ufma.showTip('保存成功！', function() {}, 'success');
									page.qryAccs();
								}
							}
							ufma.post(url, tempBudgetPlan, callback);
							$('#budgetPlanSys-base').setForm(tempBudgetPlan);
						} else if(result.data.canSaveMsg == '2') {
							//弹出确认框
							ufma.confirm('该单位下已经存在同名的预算方案,是否还要继续保存?', function(action) {
								if(action) {
									var url = '/bg/Plan/budgetPlan/savePlan';
									var argu = $('#budgetPlanSys-base').serializeObject();
									tempBudgetPlan.isNew = '否';
									tempBudgetPlan.bgTypeName = argu.bgTypeName;
									tempBudgetPlan.chrName = argu.chrName;
									tempBudgetPlan.isComeDocNum = argu.isComeDocNum;
                  tempBudgetPlan.isSendDocNum = argu.isSendDocNum;
                  //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                  tempBudgetPlan.isFinancialBudget = argu.isFinancialBudget;
									tempBudgetPlan.enabled = argu.enabled;
									tempBudgetPlan.expBgTypeName = argu.expBgTypeName;
									tempBudgetPlan.summary = argu.summary;
									argu.agencyCode = page.agencyCode;
									ufma.showloading('数据保存中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										if(result.flag == "success") {
											ufma.showTip('保存成功！', function() {}, 'success');
											page.qryAccs();
										}
									}
									ufma.post(url, tempBudgetPlan, callback);
								}
							}, {
								'type': 'warning'
							});
						} else {
							ufma.showTip(result.data.canSaveMsg, function() {}, 'error');
						}
					}
					ufma.post(url, tempBudgetPlan, callback);
					$('#budgetPlanSys-base').setForm(tempBudgetPlan);
				}
      },
      //保存要素信息
			saveYSXXInfo: function() {
				var url = '/bg/Plan/budgetPlan/savePlan';
				var argu = $('#budgetPlanSys-base').serializeObject();
				tempBudgetPlan.isNew = '否';
				tempBudgetPlan.bgTypeName = argu.bgTypeName;
				tempBudgetPlan.chrName = argu.chrName;
				tempBudgetPlan.enabled = argu.enabled;
				tempBudgetPlan.isComeDocNum = argu.isComeDocNum;
        tempBudgetPlan.isSendDocNum = argu.isSendDocNum;
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        tempBudgetPlan.isFinancialBudget = argu.isFinancialBudget;
				tempBudgetPlan.expBgTypeName = argu.expBgTypeName;
				tempBudgetPlan.summary = argu.summary;
        tempBudgetPlan.planVo_Items = this.serializeYSXX();
        // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        // CWYXM-18753 系统级预算方案文本说明项勾选两个说明项后,修改要素后保存,无反应,且前端报错,具体见截图--zsj-mac复现不了，只在windows复现
        tempBudgetPlan.planVo_Txts = page.serializeText();
				argu.agencyCode = page.agencyCode;
				ufma.showloading('数据保存中，请耐心等待...');
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip('保存成功！', function() {}, 'success');
					page.qryAccs();
				}
				ufma.post(url, tempBudgetPlan, callback);
			},
			serializeYSXX: function() { //序列化要素信息
				var aKJYS = [];
				var irow = 100;
				$('#budgetPlanSys-ysxx tbody tr').each(function(idx) {
					var tmpYS = {};
					irow = irow + 1;
					tmpYS.eleCode = $(this).find('[name="eleCode"]').html();
					tmpYS.eleSn = irow;
					tmpYS.eleName = $(this).find('[name="eleName"]').html();
					if($(this).find('input[name="eleIsPri"]').is(':checked') == true) {
						tmpYS.eleIsPri = "1";
					} else {
						tmpYS.eleIsPri = "0";
					}
					if($(this).find('input[name="isUsed"]').is(':checked') == true) {
						tmpYS.isUsed = "1";
					} else {
						tmpYS.isUsed = "0";
					}
					tmpYS.eleLevel = $(this).find('select[name="eleLevel"]').children('option:selected').val();
					aKJYS.push(tmpYS);
				});
				return aKJYS;
			},
			seeBudgetPlan: function(chrId) { //查看一个预算方案
				var url = getURL(0) + '/bg/Plan/budgetPlan/getPlan/';
				var argu = {
					"bgPlanChrId": chrId,
					"agencyCode": page.agencyCode,
					"setYear": page.setYear
				};
				var callback = function(result) {
					//result添加数据 将模板值帮到html
					result.chrId = $('#budgetPlanSys-base').find('[name="chrId"]').val();
					result.chrCode = $('#budgetPlanSys-base').find('[name="chrCode"]').val();
					tempBudgetPlan = result.data;
					curBgPlanChrId = result.data.chrId;
					isDown = result.data.isDown;
					page.openEdtWin(tempBudgetPlan);
				}
				ufma.get(url, argu, callback);
			},
			getBudgetModel: function(result) { //新增获取模板
				var url = getURL(0) + '/bg/Plan/budgetPlan/newPlan';
				var argu = {
					"agencyCode": page.agencyCode,
					"setYear": +page.setYear
				};
				var callback = function(result) {
					budgetModel = result.data;
					curBgPlanChrId = result.data.chrId;
					isDown = result.data.isDown;
          page.drawBudgetPlanYSXX(budgetModel);
          // CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          page.drawBudgetPlanText(budgetModel);
				}
				ufma.get(url, argu, callback);
			},

			initAgencyScc: function() { //初始化单位信息
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					onchange: function(data) {
						page.agencyCode = page.cbAgency.getValue();
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);
						page.qryAccs();
					}
				});
				page.cbAgency.select(1);
			},
			GetAgencyCode: function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r != null)
					return unescape(r[2]);
				return null;
			},
			clearmodel: function() {
				$("#budgetPlanYSXX tbody").html("");
				$(".ufma-panel").find("input[name='bgTypeName']:first").parent("label").addClass("active");
				$(".ufma-panel").find("input[name='bgTypeName']:last").parent("label").removeClass("active");
				$(".ufma-panel").find("input[name='enabled']:first").parent("label").addClass("active");
        $(".ufma-panel").find("input[name='enabled']:last").parent("label").removeClass("active");
        $('input[name="isFinancialBudget"]:first').parent().removeClass("active");
        $('input[name="isFinancialBudget"]:last').parent().addClass("active");
			},
			getErrMsg: function(errcode) {
				var error = {
					0: '方案名称不能为空'
				}
				return error[errcode];
			},
			onBtncloseClick: function() {
				this.get('.btn-close').on('click', function() {
					if(!ufma.jsonContained(page.formdata, tmpFormData)) {
						ufma.confirm('您修改了预算方案信息，关闭前是否保存？', function(action) {
							if(action) {
								page.save();
							} else {
								page.editor.close();
							}
						}, {
							'type': 'warning'
						});
					} else {
						page.editor.close();
					}
          page.editor.close();
				});
			},
			onEventListener: function() { //新增按钮触发事件
				this.get('#btn-add').on('click', function(e) {
					$('#budgetPlanSaveAll').attr('disabled', false);
					$('#budgetPlanSaveAdd').attr('disabled', false);
					$('#budgetPlanSenddown').attr('disabled', true);
					page.clearmodel();
					e.preventDefault();
					page.action = 'add';
					page.getBudgetModel();
					page.openEdtWin();
				});
				this.get('#budgetPlanSaveAll').on('click', function(e) {
					e.preventDefault();
					page.saveAll();
				});
				this.get('#budgetPlanSaveAdd').on('click', function(e) { //保存并新增
					e.preventDefault();
					page.saveAdd();

				});
				//下发
				this.get('#budgetPlanSenddown').on('click', function(e) {
					if(page.agencyCode == '*') {
						e.stopPropagation();
						var bgPlanChrId = curBgPlanChrId;
						page.modal = ufma.selectBaseTree({
							url: '/bg/sysdata/getAgencyList?setYear=' + page.setYear,
							rootName: '所有单位',
							title: '选择下发单位',
							bSearch: true, //是否有搜索框
							checkAll: true, //全选--zsj
							filter: { //其它过滤条件
								'单位类型': { //标签
									ajax: '/bg/sysdata/getAgencyType', //地址
									formControl: 'combox', //表单元素
									idField: 'ENU_CODE',
									textField: 'ENU_NAME',
									filterField: 'agencyType' //后加，解决再次点击单位类型时获取不到单位类型的问题
								}
							},
							buttons: { //底部按钮组
								'确认下发': {
									class: 'btn-primary',
									action: function(data) {
										if(data.length == 0) {
                      ufma.showTip("请选择单位！",function(){}, "warning");
											return false;
										}
										var dwCode = [];
										for(var i = 0; i < data.length; i++) {
											if(data[i].id != '0' && data[i].isParent == false) {
												dwCode.push("{agencyCode:'" + data[i].id + "',agencyName:'" + data[i].name + "'}");
											}
										}
										// var url = '/bg/Plan/budgetPlan/downPlan' + "?setYear=" + page.setYear;
										// var argu = {
										// 	'bgPlanChrId': bgPlanChrId,
										// 	'downToAgencyCode': dwCode,
										// 	'agencyCode': page.agencyCode,
										// 	'setYear': page.setYear
										// };
										// var callback = function (result) {
										// 	if (result.msg = 'SUCCESS') {
										// 		ufma.showTip('下发成功！', function () {
										// 			page.modal.close();
										// 			page.editor.close();
										// 		}, 'success');
										// 	} else {
										// 		ufma.confirm(result.msg, function (action) {
										// 			if (action) {
										// 				page.modal.close();
										// 			}
										// 		}, {
										// 				'type': 'error'
										// 			});
										// 	}
										// };
										// ufma.post(url, argu, callback);
										var checkUrl = '/bg/Plan/budgetPlan/checkPlanNameExist' + "?setYear=" + page.setYear;
										var argu = {
											'bgPlanChrId': bgPlanChrId,
											'downToAgencyCode': dwCode,
											'agencyCode': page.agencyCode,
											'setYear': page.setYear,
											'agencys': dwCode
										};
										var callback = function(result) {
											if((result.flag == 'success') && (result.data.canSaveMsg == '1')) {
												var url = '/bg/Plan/budgetPlan/downPlan' + "?setYear=" + page.setYear;
												var argu = {
													'bgPlanChrId': bgPlanChrId,
													'downToAgencyCode': dwCode,
													'agencyCode': page.agencyCode,
													'setYear': page.setYear
												};
												var callback = function(result) {
													if(result.msg = 'SUCCESS') {
														ufma.showTip('下发成功！', function() {
															page.modal.close();
                              page.editor.close();
														}, 'success');
													} else {
														ufma.confirm(result.msg, function(action) {
															if(action) {
                                page.modal.close();
															}
														}, {
															'type': 'error'
														});
													}
												};
												ufma.post(url, argu, callback);
											} else if(result.data.canSaveMsg == '2') {
												//弹出确认框
												ufma.confirm('该单位下已经存在同名的预算方案,是否还要继续下发?', function(action) {
													if(action) {
														var url = '/bg/Plan/budgetPlan/downPlan' + "?setYear=" + page.setYear;
														var argu = {
															'bgPlanChrId': bgPlanChrId,
															'downToAgencyCode': dwCode,
															'agencyCode': page.agencyCode,
															'setYear': page.setYear
														};
														var callback = function(result) {
															if(result.msg = 'SUCCESS') {
																ufma.showTip('下发成功！', function() {
																	page.modal.close();
                                  page.editor.close();
																}, 'success');
															} else {
																ufma.confirm(result.msg, function(action) {
																	if(action) {
                                    page.modal.close();
																	}
																}, {
																	'type': 'error'
																});
															}
														};
														ufma.post(url, argu, callback);
													}
												}, {
													'type': 'warning'
												});
											} else {
												ufma.showTip(result.data.canSaveMsg, function() {}, 'error');
											}
										};
										ufma.post(checkUrl, argu, callback);
									}
								},
								'取消': {
									class: 'btn-default',
									action: function() {
                    page.modal.close();
									}
								}
							}
						});
					} else {
						ufma.showTip('非系统级预算方案不能下发！', function() {}, 'warning');
					}
				});
				$('#budgetPlanBaseBtnGroup .btn-save').on('click', function() {
					page.saveBaseInfo();
					page.setBaseFormEdit(false);
				});
				$('#budgetPlanBaseBtnGroup .btn-cancel').on('click', function() {
					page.clearmodel();
					page.initWindow(page.curData);
					page.setBaseFormEdit(false);
				});
				$('#btnBudgetPlanBaseEdit').on('click', function() {
					if(isDown == "1") {
						ufma.showTip('该方案已经下发,不可修改!', function() {}, 'warning');
					} else {
            page.setBaseFormEdit(true);
					}
				});
				$('#btnBudgetPlanYSXXEdit').on('click', function() {
					if(isDown == "1") {
						ufma.showTip('该方案已经下发,不可修改!', function() {}, 'warning');
					} else {
						page.setYSXXFormEdit(true);
						$('#budgetPlanYSXX').find("input[name='isUsed']").attr("disabled", false);
						$('#budgetPlanYSXX').find("a[data-toggle='tooltip']").attr("disabled", false);
						if($('#budgetPlanYSXX').find("input[name='isUsed']").is(':checked')) {
							$('#budgetPlanYSXX').find("select[name='eleLevel'].notIsUpBudget").attr("disabled", false);
							$('#budgetPlanYSXX').find("input[name='eleIsPri'].notIsUpBudget").attr("disabled", false);
						}
					}
				});
				$('#budgetPlanCancelAll').on('click', function() {
          page.editor.close();
					$('#budgetPlanSaveAll').attr('disabled', false);
					$('#budgetPlanSaveAdd').attr('disabled', false);
				});
				$('#budgetPlanCloseAll').on('click', function() {
          page.editor.close();
					$('#budgetPlanSaveAll').attr('disabled', false);
					$('#budgetPlanSaveAdd').attr('disabled', false);
				});
				$('#budgetPlanYSXXBtnGroup .btn-save').on('click', function() {
					page.saveYSXXInfo();
					page.setYSXXFormEdit(false);
				});
				$('#budgetPlanYSXXBtnGroup .btn-cancel').on('click', function() {
					page.clearmodel();
					page.initWindow(page.curData);
					page.setYSXXFormEdit(false);
        });
        // 文本项相关
				$('#btnPlanTextEdit').on('click', function() {
					if(isDown == "1") {
						ufma.showTip('该方案是被下发的,不可修改!', function() {}, 'warning');
					}else {
						page.setTextFormEdit(true);
						$('#budgetPlanText').find("input[name='isUsed']").attr("disabled", false);
						$('#budgetPlanText').find("a[data-toggle='tooltip']").attr("disabled", false);
					}
        });
        // 文本项相关
        $('#budgetPlanTextBtnGroup .btn-save').on('click', function() {
					page.saveTextInfo();
					page.setTextFormEdit(false);
				});
				$('#budgetPlanTextBtnGroup .btn-cancel').on('click', function() {
					page.clearmodel();
					page.initWindow(page.curData);
					page.setTextFormEdit(false);
				});
				//校验方案名称
				$('#chrName').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#chrName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('chrName', textValue);
				}).on('blur', function() {
					if($(this).val() == '') {
						ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#chrName').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrName');
						$('#chrName').closest('.form-group').removeClass('error');
					}
				});
			},
			// 初始化页面
			initPage: function() {},
			// 此方法必须保留
			init: function() {
				page.agencyCode = "*"; //系统预算方案，强制改成*
				var ufgovkey = ufma.getCommonData();
				page.setYear = ufgovkey.svSetYear;
				this.initPage();
				this.onEventListener();
				this.qryAccs();
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				ufma.parse();
			}
		}
	}();
	page.init();
});
$(function () {
	var cacheData = [];
	window._close = function (state,data) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: data
			};
			window.closeOwner(data);
		}
	}
	var modal_billAttachment = [];
  var fileLeng = 0; //实际上传文件数
  var modalCurBgBill = {};
	var modal_billAttachment = []; //单据的附件
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var billType = 1; //1=指标单据新增(可执行-社保) 2=分解单 3=调剂单 4=调整单 5=待分配(社保) 6=下拨单(社保) 7=分配单(社保)
	var catchTblData = [];
	//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
	var acctCode = '*';
	var menuId = '6f7c4687-0463-4d2c-85c1-178e82361811';
  var openType = 'new';
  var billData = {};
	var page = function () {
		return {
			addData: [],
			planData: '',
			planData1: '',
			billId: '',
			billCode: '',
			composePlanId: '',
			composePlanName: '',
			cacheData: [],
			getBudgetHead: function (data) { // 第一个页面表格
        var column = [ // 支持多表头
          {
						field: 'bgItemCode',
						name: '指标编码',
            width: 100,
            headalign: 'center',
            className: "nowrap BGasscodeClass",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
            type: 'input',
						field: 'bgItemSummary',
						name: '摘要',
						className: "nowrap BGThirtyLen",
            width: 200,
            rowspan: 2,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}
				];
				if (page.planData.isComeDocNum == "是") {
					column.push({
            type: 'input',
						field: 'comeDocNum',
						name: '来文文号',
						rowspan: 2,
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
				}
				if (page.planData.isSendDocNum == "是") {
					column.push({
            type: 'input',
						field: 'sendDocNum',
						name: page.sendCloName,
						rowspan: 2,
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
        }
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
					column.push({
            type: 'input',
						field: 'bgItemIdMx',
						name: '财政指标ID',
						rowspan: 2,
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
        }
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				if (data && data.eleValueList) {
					for (var i = 0; i < data.eleValueList.length; i++) {
						var item = data.eleValueList[i];
            var cbItem = item.eleCode;
            var id = bg.shortLineToTF(item.eleFieldName);
            if (item.maEleType != '0') {
              if (item.eleName != '摘要' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx'&& cbItem != 'sendDocNum') {
                if (cbItem == "ISUPBUDGET") { 
                  column.push({
                    type: 'treecombox',
                    field: 'isUpBudget',
                    name: '是否采购',
                    idField: 'code',
                    textField: 'codeName',
                    rowspan: 2,
                    className: "nowrap",
                    // width: 200,
                    headalign: 'center',
                    align: 'center',
                    data: item.data,
                    "render": function (rowid, rowdata, data, meta) {
                      if (!$.isNull(data)) {
                        if (rowdata['isUpBudget'] == '0') {
                          return '<code title="否">否</code>';
                        }else if (rowdata['isUpBudget'] == '1') {
                          return '<code title="是">是</code>';
                        }
                      } else {
                        return '';
                      }
                    }
                  });
                } else {
                  column.push({
                    type: 'treecombox',
                    field: id,
                    idField: 'code',
                    textField: 'codeName',
                    name: item.eleName,
                    // width: 240,
                    headalign: 'center',
                    className: 'nowrap BGThirtyLen',
                    data: item.data,
                    "render": function (rowid, rowdata, data, colField) {
                      var colFieldName = colField + 'Name'
                      if (!$.isNull(data)) {
                        return '<code title="' + rowdata[colFieldName] + '">' + rowdata[colFieldName] + '</code>';
                      } else {
                        return '';
                      }
                    },
                    beforeExpand: function (sender, data) {
                      console.log('oooo')
                    }
                  });
                }
              }
            }  else if (item.maEleType == '0') {
              column.push({
                type: 'input',
                field: cbItem,
                name: item.eleName,
                rowspan: 2,
                className: "nowrap BGThirtyLen",
                width: 200,
                headalign: 'center',
                "render": function (rowid, rowdata, data, meta) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
            }
          };
        }
        if (page.planData){
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
            var fieldNew = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName);
            column.push({
              type: 'input',
              field: fieldNew,
              name:  page.planData.planVo_Txts[k].eleName,
              className: "nowrap BGThirtyLen",
              // width: 200,
              headalign: 'center',
              "render": function (rowid, rowdata, data, meta) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            });
          }
				}
				column.push({
				  type: 'money',
					field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，经赵雪蕊确认后金额取值应为指标编制的最初金额，加上调整、调剂的调增，减去调整、调剂、分解的减少后的值--zsj
					name: '金额',
					width: 150,
          headalign: 'center',
          rowspan: 2,
          align: 'right',
          className: "nowrap",
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
						} else {
							return '';
						}
					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
          width: 150,
          className: "nowrap",
					headalign: 'center',
					render: function (rowid, rowdata, data, meta) {
						if (billData.status == '3') { //如果为已审核单子，不可编辑CWYXM-4872
							return '<button class="btn btn-del btn-delete icon-trash disabled" data-toggle="tooltip" title="删除"></button>';
						} else {
							return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
						}
					}
        });
        //CWYXM-14548--指标编制 - 如果要素不填保存在弹出框的提示是导入结果--zsj
        page.useColumn = [{
          data: "desc",
          title: "保存结果",
          className: "nowrap BGThirtyLen",
          width: "250px",
          "render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        }];
        for (var k = 0; k < column.length - 1; k++) {
          var columnOne = {
            data: column[k].field,
            title: column[k].name,
            width: column[k].width,
            className: column[k].className
            // ,
            // render: column[k].render
          }
          page.useColumn.push(columnOne)
        }
        //ZJGA820-1459【指标管理】指标编制新增导入指标，在除金额不同其他要素相同时，还要提示一列计算金额的差额。---导入失败时，做个金额比较吧，单独一列显示差额
        page.useColumn.push({
          data: "diffCur",
          title: "差额",
          width: "180px",
          className: "bgPubMoneyCol tr nowrap",
          render: $.fn.dataTable.render.number(',', '.', 2, '')
        })
        return [column];
			},
			setBudgetTable: function (data,tbData) { // 第一页显示所有指标表格
        if (billData.status == '3') { //如果为已审核单子，不可编辑
					sDisabled = true;
				} else {
          sDisabled = false;
				}
				$('#multiPostGrid').ufDatagrid({
					data: tbData,
					idField: 'bgItemCode', // 用于金额汇总
					pId: 'pid', // 用于金额汇总
          disabled: sDisabled, //可选择
					frozenStartColumn: 0, // 冻结开始列,从1开始
					frozenEndColumn: 0, // 冻结结束列
					paginate: false, // 分页
					columns: page.getBudgetHead(data),
					initComplete: function (options, data) {
            var height = $('.ufma-layout-up').height() - $('.uf-panel').height() - $('.u-msg-footer').height()  - 100;
            // $('#multiPostGrid').getObj().setBodyHeight(height);
						$('#multiPostGrid tr').on('click', '.btn-delete', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#multiPostGrid').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetItemDecomposeAdd", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
            });
            ufma.isShow(reslist);
            catchTblData = $.extend(true, [], $('#multiPostGrid').getObj().getData());
					},
        });
			},
			initSearchPnl: function () {
				uf.cacheDataRun({
					element: $('#bg-multiModal-bgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1" + "&isEnabled=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.setYear
					},
					callback: function (element, data) {
						element.ufCombox({ // 初始化
							data: data, // 列表数据
							readonly: true, // 可选
							placeholder: "请选择预算方案",
							onChange: function (sender, data) {
                page.planData = data;
                if (catchTblData.length > 0) {
                  var tmpTblDt = $('#multiPostGrid').getObj().getData();
                  if (!$.equalsArray(catchTblData, tmpTblDt)) {
                    ufma.confirm('指标信息已修改，是否切换预算方案？', function (ac) {
                      if (ac) {
                        if (page.planData != null && page.planData.chrId == data.chrId) {
                          return;
                        }
                        page.planData = data;
                        $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl').getObj().getValue()
                        //根据预算方案的变化加载表格
                        // page.setBudgetTable(page.planData);
                      } else {
                        $("#bg-multiModal-bgPlan").getObj().setValue(page.planData.chrId, page.planData.chrName, false);
                      }
                    }, {
                      'type': 'warning'
                    });
                    return false;
                  };
                }
								//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
								page.parentAssiArr = [];
								for (var i = 0; i < page.planData.planVo_Items.length; i++) {
									var item = page.planData.planVo_Items[i];
									var cbItem = item.eleCode;
									page.parentAssiArr.push(cbItem)
                };
								//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
								page.configKey = '';
								page.configValue = '';
								page.configKey = 'bg-multiModal-bgPlan';
								var cbBgPlanId = $('#bg-multiModal-bgPlan').getObj().getValue();
								var cbBgPlanText = $('#bg-multiModal-bgPlan').getObj().getText();
                page.configValue = cbBgPlanId + ',' + cbBgPlanText;
                if (page.addAtion == 'add') {
                  $('#btn-newRow').trigger('click')
                }
							},
							onComplete: function () {
								$(element).getObj().val($.isNull(window.ownerData.planId) ? 'null' : window.ownerData.planId); //CWYXM-11974 达梦库和oracle库有此问题：指标管理模块，指标分解，点击新增时没有选择预算方案前，页面样式错误--zsj
                if (page.addAtion == 'edit') {
                  $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').addClass('hide')
                } else {
                  $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').removeClass('hide')
                }
              }
						});
					}
        });
			},
			initPage: function () {
        //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
        $('#bg_multiModal_dtp').ufDatepicker('update', page.pfData.svTransDate);
        page.initSearchPnl();
			},
      saveItems:function (isAdd) {
        var tmpTblDt = $('#multiPostGrid').getObj().getData();
        modalCurBgBill.items = [];
        var billCur = 0;
        var sendCount = 0; //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
        var isUpBudgetCount = 0; //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
        var bgItemIdMxCount = 0; //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj 
        var hasIsUpBudget = false;
        if ($.inArray("ISUPBUDGET", page.parentAssiArr) > -1) {
          hasIsUpBudget = true;
        }
        for (var i = 0; i < tmpTblDt.length; i++) {
          var rowDt = tmpTblDt[i];
          //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
          if ($.isNull(rowDt.sendDocNum)) {
            sendCount++;
          }
          //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
          if ($.isNull(rowDt.isUpBudget) && hasIsUpBudget == true) {
            isUpBudgetCount++;
          } else {
            if (rowDt.isUpBudget == '是') {
              rowDt.isUpBudget = '1';
            } else if (rowDt.isUpBudget == '否') {
              rowDt.isUpBudget = '0';
            }
          }
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          if ($.isNull(rowDt.bgItemIdMx)) {
            bgItemIdMxCount++;
          }
          if (!$.isNull(rowDt.isDeleted) && rowDt.isDeleted == 1) {
            continue;
          }
          rowDt.createUser = page.pfData.svUserCode;
          rowDt.createUserName = page.pfData.svUserName;
          modalCurBgBill.items[modalCurBgBill.items.length] = rowDt;
          billCur = billCur + parseFloat(rowDt.bgItemCur);
        }
        modalCurBgBill.billType = billType;
        modalCurBgBill.billCur = billCur == "null" ? "" : billCur;
        modalCurBgBill.setYear = page.setYear;
        //bugCWYXM-4281--新增指标编制，单据日期应为当前登录所选日期，目前为1月1日，保存后自动变更为当前日期
        modalCurBgBill.billDate = $('#bg_multiModal_dtp').getObj().getValue(); //_bgPub_getUserMsg().busDate;
        modalCurBgBill.createUser = page.pfData.svUserCode;
        modalCurBgBill.createUserName = page.pfData.svUserName;
        modalCurBgBill.bgPlanId = page.planData.chrId; //加上预算方案ss
        //bug77471--zsj
        if ($("#btn-multiModal-fileCountInput").val() < fileLeng) {
          ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
          return false;
        }
        //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
        if (page.planData.isSendDocNum == "是" && sendCount > 0 && page.needSendDocNum == true) {
          ufma.showTip('请输入' + page.sendCloName, function () {}, 'warning');
          return false;
        }
        //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
        if (isUpBudgetCount > 0) {
          ufma.showTip('请选择是否采购！', function () {}, 'warning');
          return false;
          }
            //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          if(page.planData.isFinancialBudget == "1" && bgItemIdMxCount > 0) {
            ufma.showTip('请输入财政指标ID！', function () {}, 'warning');
            return false;    
          }
        modalCurBgBill.attachNum = $("#btn-multiModal-fileCountInput").val(); //bug77471--zsj
        page.configKey = '';
        page.configValue = '';
        page.configKey = 'bg-multiModal-bgPlan';
        var cbBgPlanId = $('#bg-multiModal-bgPlan').getObj().getValue();
        var cbBgPlanText = $('#bg-multiModal-bgPlan').getObj().getText();
        page.configValue = cbBgPlanId + ',' + cbBgPlanText;
        //ZJGA820-1346--指标管理】--【指标导入】除金额不同以外所有要素包括ID都一致的情况下，导入之后以列表的形式展示导入情况，并且显示指标所有信息，还需要支持EXCEL导出--zsj
        ufma.post(
          '/bg/budgetItem/multiPost/saveBudgetItemsAdd?billType=' + billType + '&agencyCode=' + page.agencyCode + '&setYear=' + page.setYear,
          modalCurBgBill,
          function (result) {
            if ($.isNull(result.data)) {
              page.updateSessionPlan();
              catchTblData = $.extend(true, [], $('#multiPostGrid').getObj().getData());
              if (isAdd == 'false') {
                ufma.showTip("保存成功", function(){
                   _close('save',cbBgPlanId, cbBgPlanText);
                }, "success");
              } else {
                setTimeout(function () {
                  ufma.get(_bgPub_requestUrlArray_subJs[14], {
                      "agencyCode": page.agencyCode
                    },
                    function (result) {
                      if (result.flag == "success") {
                        //1, 重绘表格
                        modalCurBgBill = result.data;
                        modalCurBgBill.billType = billType;
                        modalCurBgBill.items = [];
                        $('#btn-newRow').trigger('click');
                        page.setBudgetTable(result.data,result.data.items)
                        // $('#multiPostGrid').getObj().load(result.data);
                        //2, 替换成新的方案
                        $("#multiModal_billCode").val(result.data.billCode);
                        $("#multiModal_billCode").attr("data", result.data);
                        $("#multiModal_billCode").attr("billId", result.data.billId);
                        $("#btn-multiModal-fileCountInput").val('0');
                        modal_billAttachment = [];
                      }
                    }
                  );
                }, 2000); //延迟两秒后自动清空
              }
            } else {
              var openData = {};
              openData.tableData = result.data.wrongList;
              openData.columns = page.useColumn;
              openData.msg = result.msg;
              openData.modalCurBgBill = modalCurBgBill;
              openData.billType = billType;
              openData.agencyCode = page.agencyCode;
              openData.setYear = page.setYear;
              openData.url = result.data.expUrl;
              ufma.open({
                url: 'openExcel.html',
                title: '保存结果预览',
                width: 1000,
                height: 500,
                data: openData,
                ondestory: function (result) {
                  if (result.action == 'save' && result.flag == true) {
                    _close('save',cbBgPlanId, cbBgPlanText);
                  }
                }
              });

              //ufma.showTip("保存失败!" + result.msg, null, "error");
            }
          }
        );
      },

			del: function (data) {
				var data = {
					'items': data
				};
				var url = _bgPub_requestUrlArray_subJs[5] + "?agencyCode=" +
					page.agencyCode + "billType=1";
				var callback = function (result) {}
				ufma.post(url, data, callback);
      },
      // 弹窗点击取消时，校验是否有修改
      closeCheck:function () {
        var tblData = $('#multiPostGrid').getObj().getData();
        var cacheData = catchTblData;
        //以下两个循环，主要解决isNew对这两个对象判断相等的干扰
        for (var i = 0; i < tblData.length; i++) {
          tblData[i].isNew = "否";
        }
        for (var i = 0; i < cacheData.length; i++) {
          cacheData[i].isNew = "否";
        }
        return $.equalsArray(cacheData, tblData);
        },
			//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
			updateSessionPlan: function () {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKey,
					configValue: page.configValue,
					menuId: "6f7c4687-0463-4d2c-85c1-178e82361811"
				}
				ufma.post('/pub/user/menu/config/update', argu, function (reslut) {});
      },
			onEventListener: function () {
				$('#btn-save').click(function () {
          page.saveItems("false");
          page.addNew = true;
          page.btnAdd = true;
				});
				$('#btn-close').click(function () {
					if (!page.closeCheck()) {
						ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
							if (rst) {
								_close('ok');
							}
						}, {
							'type': 'warning'
						});
						return false;
					} else {
						_close('ok');
					}
				});
				//解决金额输入不能为负数
				$('#multiPostGrid').on('keyup', 'input[name="bgItemCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var val = $(this).val();
					if (val < 0)
						$(this).val('');
				});
				//指标分解 金额列要全选中,方便用户编辑 guohx 20191209
				$("#multiPostGrid").on("focus", "input[name='bgItemBalanceCur']", function () {
					$(this).select();
				})
				/**
				/**
				 * 模态框表格-新增一行[本质就是获得一条指标] 特点：手工录入 + 新增未审核 + 可执行指标
				 */
				$('#btn-newRow').click(
					function () {
						var tmpChrId = page.planData.chrId;
						if (tmpChrId == "") {
							ufma.showTip("请先选择一个预算方案", null,
								"warning");
							return;
						}
						//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
            ufma.get(_bgPub_requestUrlArray_subJs[3], //3  新增一条指标
              {
                "bgPlanChrId": page.planData.chrId,
                "bgPlanChrCode": page.planData.chrCode,
                "agencyCode": page.agencyCode,
                "setYear": page.setYear
              },
							function (result) {
								if (result.flag == "success") {
                  // var newRow = page.getBudgetHead(page.sendCloName);
                  var data = [];
                  if ($('#multiPostGrid').find('tbody tr').length == 0) {
                    page.setBudgetTable(result.data);
                  }
                  var decomData = $('#multiPostGrid').find('tbody tr').length > 0 ? $('#multiPostGrid').getObj().getData()[0] : {};
                  data = $.extend(true, [], decomData);
                  var newData = {}
                  //初始化一些指标数据
                  result.data.status = '1'; //未审核
                  result.data.dataSource = '1'; //数据来源：手工编制
                  result.data.createSource = '1'; //建立来源：编制
                  result.data.bgReserve = '1'; //可执行指标
                  //新增行时只有bgItemCode、bgItemId和上一行不一样
                  newData = result.data;
                  result.data.billId = modalCurBgBill.billId
                  var newBgItemId = result.data.bgItemId;
                  var newBgItemCode = result.data.bgItemCode;
                  //财务云项目CWYXM-11692 --nbsh----指标编制新增指标数据时，新增行默认带出上一行编辑的要素数据，摘要和金额不需要带入--zsj
                  var oldData = $('#multiPostGrid').getObj().getData();
                  var prevRowDt = oldData[oldData.length - 1];
                  var tableData = $.extend(true, result.data, prevRowDt);
                  tableData.bgItemId = newBgItemId;
                  tableData.bgItemCode = newBgItemCode;
                  tableData.bgItemCur = '';
                  tableData.bgItemSummary = '';
									$('#multiPostGrid').getObj().add(tableData); // 取对象
								}
							});
				});
				$(document).on('mousedown', '#multiPostGrid .btn-del', function (e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
					var obj = $('#multiPostGrid').getObj(); // 取对象
					//bugCWYXM-4308--新增指标分解，选择预算方案再删除时，行删除控制应与列表删除控制逻辑一致“至少需要保留一条分解指标”--zsj
					ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
						if (action) {
							obj.del(rowid);
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});

        });
      
        /**
         * 模态框 - 文件导入  按钮
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#btn-modal-imp").off("click").on("click", function (e) {
          var tmpImpModal = _ImpXlsFile("budgetItemMultiPostOpen", "bgMultiItem", page.planData.chrId,
            function (data) {
              //success
              if (data.flag == "success") {
                modalCurBgBill.items = data.data.items
                //这里注意，需要自动切换方案。方案的信息应当来源于服务的应答
                page.setBudgetTable(data.data);
                // $('#multiPostGrid').getObj().load(modalCurBgBill.items);
                tmpImpModal.closeModal();
                ufma.showTip("导入成功", null, "success");
              } else {
      
                ufma.showTip(data.msg, function () {
                  $('#bgMultiItem_xlsInputModal_filePath').val('');
                }, "error");
              }
            },
            function (data) {
              //failed
              ufma.showTip(data, function () {
                $('#bgMultiItem_xlsInputModal_filePath').val('');
              }, "error");
            }, {
              "agencyCode": page.agencyCode,
              "billId": modalCurBgBill.billId
            });
        });
        $("#btn-modal-close").off("click").on("click", function (e) {
          if (!page.closeCheck()) {
            ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
              if (rst) {
                _close('cancel','');
              }
            }, {
              'type': 'warning'
            });
            return false;
          } else {
            //新增页面直接点“取消”按钮时请求该接口，下次点击“新增”时后端返回的指标编码不会多增加一次
            var billCode = $('#multiModal_billCode').val();
            var argu = {
              billCode: billCode,
              "agencyCode": page.agencyCode
            }
            if (openType == 'new') { //只有新增时才请求--zsj--CWYXM10681 
              ufma.get('/bg/budgetItem/multiPost/backMaxsn', argu, function () {});
            }
            _close('cancle','');
          }
        });
        /**
         * 模态框 - 保存并新增  按钮
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#btn-modal-saveAndNew").off("click").on("click", function (e) {
          fileLeng = 0;
          page.saveItems("true");
          page.add = true;
          page.btnAdd = true;
        });
        /**
         * 模态框  - 附件  按钮事件绑定
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#btn-multiModal-aboutFiles").off("click").on("click", function (e) {
          var option = {
            "agencyCode": page.agencyCode,
            "billId": modalCurBgBill.billId,
            "uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.setYear,
            "delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + page.agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.setYear,
            "downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + page.agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.setYear,
            "onClose": function (fileList) {
              /*$("#btn-multiModal-fileCountInput").val(fileList.length + "");
              modal_billAttachment = cloneObj(fileList);*/
              //bug77471--zsj

              fileLeng = fileList.length;
              if (page.btnAdd || page.addNew) {
                attachNum = fileLeng;
              } else {
                attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
              }
              $("#btn-multiModal-fileCountInput").val(attachNum + "");
              modal_billAttachment = cloneObj(fileList);
            }
          };
          //bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
          _bgPub_ImpAttachment("budgetItemMultiPostOpen", "指标单据[" + modalCurBgBill.billCode + "]附件导入", modal_billAttachment, option, modalCurBgBill.status);
        });
			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
        uf.parse();
        page.pageData = window.ownerData;
				page.agencyCode = window.ownerData.agencyCode;
        page.needSendDocNum = window.ownerData.needSendDocNum; //根据系统选项判断发文文号是否必填
        page.addAtion = window.ownerData.action;
        page.setYear = window.ownerData.setYear;
        billData = window.ownerData.billData;
        modalCurBgBill = window.ownerData.billData;
        page.planData = [];
        page.useColumn = [];
        //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
				if (page.needSendDocNum == true) {
					page.sendCloName = "指标id";
				} else {
					page.sendCloName = "发文文号";
				}
				this.initPage();
        if (page.addAtion == 'edit') {
          page.planData = window.ownerData.planData;
          page.setBudgetTable(window.ownerData.assiData,billData.items);
          // $('#multiPostGrid').getObj().load(billData.items);
          pageAttachNum = modalCurBgBill.attachNum;
          modalCurBgBill.latestOpUserName = page.pfData.svUserName;
          modalCurBgBill.latestOpUser = page.pfData.svUserCode;
          modalCurBgBill.latestOpDate = page.pfData.svSysDate;
          // 2,加载单据的附件信息  getURL(0) + "/bg/attach/getAttach"   //17，附件查找
          var tmpRst = _bgPub_GetAttachment({
            "billId": billData.billId,
            "agencyCode": page.agencyCode
          });
          if (!$.isNull(tmpRst.data.bgAttach)) {
            for (var m = 0; m < tmpRst.data.bgAttach.length; m++) {
              modal_billAttachment[modal_billAttachment.length] = {
                "filename": tmpRst.data.bgAttach[m].fileName,
                "filesize": 0,
                "fileid": tmpRst.data.bgAttach[m].attachId
              };
            }
            //$("#btn-multiModal-fileCountInput").val(modal_billAttachment.length + "");
          }
          $("#btn-multiModal-fileCountInput").val(pageAttachNum + ""); //bug77471--zsj
          //3, 已审核单据进入，不能 修改\导入\新增行 功能。-----此处需求未明确，后续维护人员可与需求经理核实后进行补充开发
          if (modalCurBgBill.status == "3") {
            $("#btn-modal-imp").hide();
            $("#btn-modal-saveAndNew").hide();
            $("#btn-modal-save").hide();
            $("#btn-newRow").hide();
            $("#budgetItemMultiPostOpen-add .u-msg-title h4").text("指标查看-[已审核]");
            //已审核的单子不允许修改附件数或者上传附件
            $('#btn-multiModal-fileCountInput').attr('disabled', true);
          } else {
            $("#btn-modal-imp").show();
            $("#btn-modal-saveAndNew").show();
            $("#btn-modal-save").show();
            $("#btn-newRow").show();
            $("#budgetItemMultiPostOpen-add .u-msg-title h4").text("指标查看-[未审核]");
            //未审核的单子允许修改附件数或者上传附件
            $('#btn-multiModal-fileCountInput').attr('disabled', false);
          }
          //修改  编辑界面不可修改单据日期  guohx
          $("#bg-multiModal-bgPlan").getObj().setEnabled(false);
          $("#bg-multiModal-bgPlan input").attr("disabled", "disabled");
          $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').addClass('hide');
          $("#bg_multiModal_dtp input").attr("disabled", "disabled");
          $("#bg_multiModal_dtp span").hide();
          $("#bg_multiModal_dtp").css("background", "#eee");
          $("#bg_multiModal_dtp").getObj().setValue(billData.billDate);
          // 4,取消遮罩层
          ufma.hideloading();
        } else {
          $("#btn-modal-imp").show();
          $("#btn-modal-saveAndNew").show();
          $("#btn-modal-save").show();
          $("#btn-newRow").show();
          $("#budgetItemMultiPostOpen-add .u-msg-title h4").text("新增指标编制");
          //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
          $("#bg_multiModal_dtp").getObj().setValue(page.pfData.svTransDate);
          //$('#bg_multiModal_dtp').getObj().setValue(page.Year + '-01-01');
          $("#bg_multiModal_dtp input").attr("disabled", false);
          $("#bg_multiModal_dtp span").show();
          $("#bg_multiModal_dtp").css("background", "#ffffff");
          $("#bg-multiModal-bgPlan").getObj().setEnabled(true);
          $("#bg-multiModal-bgPlan input").attr("disabled", false);
          $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').removeClass('hide')
          modalCurBgBill.items = [];
        }
        $('#multiModal_billCode').val(billData.billCode)
				this.onEventListener();
				$("#createDate1 input").attr("disabled", false);
				$("#createDate1 span").show();
				$("#createDate1").css("background", "#ffffff");
			}
		}
	}();
	window.page = page;
	// ///////////////////
	page.init();
});
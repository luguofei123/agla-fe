$(function () {
	var cacheData = [];
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}

	var pageData = window.ownerData;
	//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
	var page = function () {
		return {
			cacheData: [],
			//加载表格数据
			getDmpCols: function (data) {
				var column = [
          {
            type: 'toolbar',
            field: 'option',
            name: '操作',
            width: 60,
            headalign: 'center',
            align: 'center',
            render: function (rowid, rowdata, data, meta) {
              return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
            }
          }
        ];
				if (!$.isNull(data.treeData)) {
          column.push({
            type: 'treecombox',
            field: 'configId',
            idField: 'code',
            textField: 'codeName',
            name: '授权部门',
            width: 200,
            headalign: 'center',
            className: 'nowrap BGThirtyLen ',
            leafRequire: true,
            data: data.treeData,
            "render": function (rowid, rowdata, data, colField) {
              var colFieldName = !$.isNull(rowdata.codeName)  ? rowdata.codeName : rowdata.configCode
              if (!$.isNull(data)) {
                return '<span title="' + colFieldName + '">' + colFieldName + '</span>';
              } else {
                return '';
              }
            },
            beforeExpand: function (sender, data) {
            },
            onChange: function(e) {
               
            }
          });
				}
				column.push({
					type: 'money',
					field: 'authCur',
					name: '授权金额',
          width: 150,
          className: "nowrap BGmoneyClass",
					align: 'right',
					headalign: 'center',
					"render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>'
            } else {
              return '';
            }
					},
					onKeyup: function (e) {
					}
				}, {
					field: 'usedAuthCur', 
					name: '执行数',
          width: 150,
          className: "nowrap BGmoneyClass",
					align: 'right',
					headalign: 'center',
					"render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>'
            } else {
              return '';
            }
					}
				},{
					type: 'input',
					field: 'remark',
					name: '备注',
          width: 150,
          className: "nowrap BGThirtyLen",
					align: 'left',
					headalign: 'center',
					"render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>'
            } else {
              return '';
            }
					},
					onKeyup: function (e) {
            $('#authDatainputremark').attr("maxlength", "100"); //控制备注列输入不可超出100位
					}
				});
				return [column];
			},
			setChildTable: function (data) {
				var columns = page.getDmpCols(data);
				$('#authData').ufDatagrid({
					data: [],
					idField: 'bgItemCode', // 用于金额汇总
					pId: 'billId', // 用于金额汇总
					disabled: false, // 可选择
					frozenStartColumn: 1, // 冻结开始列,从1开始
					frozenEndColumn: 1, // 冻结结束列
					paginate: true, // 分页
					columns: columns,
					initComplete: function (options, data) {
						ufma.isShow(reslist);
					}
				});
				if ($.isNull(page.planData1)) {
					return false;
				}
				$('#btn-newRow-decompose').addClass('hide');
				var url = "/bg/Plan/budgetPlan/checkBudgetPlan" +
					"?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.pfData.svSetYear,
					'items': [{
						"toCompose": '1',
						"bgPlanChrId": page.composePlanId,
						"bgPlanChrName": page.composePlanName
					}, {
						"compose": '0',
						"bgPlanChrId": page.planData1.chrId,
						"bgPlanChrName": page.planData1.chrName
					}]
				};
				var callbacks = function (result) {
					if (result.flag == "success") {
						$('#btn-newRow-decompose').removeClass('hide');
						$('#btn-newRow-decompose').trigger("click");
					}
				};
				ufma.post(url, argu, callbacks);
				ufma.isShow(reslist);
				$('#authDatainputremark').attr("maxlength", "100"); //控制备注列输入不可超出100位
			},
      // 获取部门树
      getDepData: function () {
        //CWYXM-18102 --指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
        if (pageData.treeDepType == true) {
          var parm = {
            "rgCode": pageData.rgCode,
            "setYear": pageData.setYear,
            "agencyCode": pageData.agencyCode,
            "orgCode" : ""
          }
          // 系统选项启用人员库时使用如下接口
          var bgUrl = '/ma/api/selectPrsOrgTree?';
          ufma.ajaxDef(bgUrl,'post',parm,function(result){
            page.treeData = [];
            page.treeData = result.data;
          })
        } else {
          // 系统选项不启用人员库时使用如下接口
          var url = '/bg/rule/newRuleSet?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear + '&configType=' + pageData.configType;
          ufma.ajaxDef(url,'post', {}, function (result) {
            page.treeData = [];
            page.treeData = result.data;
          });
        }
      },
      // 保存
			save: function () {
        var data = $('#authData').getObj().getData();
				var detailItems = []
				// cacheData = detailItems;
        var configIdCount = 0;
        var authCurCount = 0;
        var authCurCountCom = 0;
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            var dataObj = {}
            dataObj.configId = data[i].configId;
            dataObj.usedAuthCur = !$.isNull(data[i].usedAuthCur) ? parseFloat(data[i].usedAuthCur) : 0;
            dataObj.configCode = !$.isNull(data[i].codeName) ? data[i].codeName : data[i].configCode;
            dataObj.authCur =  !$.isNull(data[i].authCur) ? parseFloat(data[i].authCur) : '';
            dataObj.configType = 'AUTH_CUR';
            dataObj.orgAuthType = '1';
            dataObj.remark = data[i].remark;
            if ($.isNull(dataObj.configId)) {
              configIdCount++;
            }
            if ($.isNull(dataObj.authCur)) {
              authCurCount++;
            }
            if (dataObj.authCur < dataObj.usedAuthCur) {
              authCurCountCom++;
            }
              detailItems.push(dataObj)
            }
            if(configIdCount > 0) {
              ufma.showTip('授权部门不能为空！', function () {}, 'warning');
              return false;    
            }
            if(authCurCount > 0) {
              ufma.showTip('授权金额不能为空！', function () {}, 'warning');
              return false;    
            }
            if(authCurCountCom > 0) {
              ufma.showTip('授权金额不能少于执行数！', function () {}, 'warning');
              return false;    
            }
        }
        if (configIdCount == 0 && authCurCount == 0 && authCurCountCom == 0) {
          var url = '/bg/ctrlManage/saveAuthCurData';
          var callback = function (result) {
            if (result.flag == "success") {
              cacheData = detailItems;
              ufma.showTip(result.msg, function(){
                _close('ok');
              }, "success");
             
            } else {
              ufma.showTip(result.msg, null, "warning");
            }
          }
          var argu = {
            'agencyCode': pageData.agencyCode,
            'setId': pageData.bgItemId,
            'setCode': pageData.bgItemCode,
            'setType': 'bgItem',
            'setYear': pageData.setYear,
            'configType': pageData.configType,
            'authCurList': detailItems,
            'rgCode': pageData.rgCode
          };
          ufma.post(url, argu, callback);
        }
      },
       // 关闭前校验
			closeCheck: function () {
				var result = true;
				if ($('#authData').html() != '') {
					var tblData = $('#authData').getObj().getData();
					return result = $.equalsArray(cacheData, tblData);
				} else {
					return result;
				}
      },
      // 获取详细信息
      getDetailData: function(){
        var argu = {
          'agencyCode': pageData.agencyCode,
          'setId': pageData.bgItemId,
          'setCode': pageData.bgItemCode,
          'setType': 'bgItem',
          'setYear': pageData.setYear,
          'rgCode': pageData.rgCode,
          'configType': pageData.configType
        }
        ufma.ajaxDef('/bg/ctrlManage/getAuthCurDataByBgItemId','post',argu,function(result){
          var detailData = result.data;
          var treeData = {
            treeData: page.treeData
          }
          if (detailData.length == 0) {
            $('#btnAddRow').trigger('click')
          } else {
            page.setChildTable(treeData)
            $('#authData').getObj().load(detailData);
          }
        })
      },
			onEventListener: function () {
				$('#btn-save').click(function () {
					$.timeOutRun(null, null, function () {
						page.save();
					}, 300);
				});
				$('#btn-close').click(function () {
          _close('ok');
					// if (!page.closeCheck()) {
					// 	ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
					// 		if (rst) {
					// 			_close('ok');
					// 		}
					// 	}, {
					// 		'type': 'warning'
					// 	});
					// 	return false;
					// } else {
					// 	_close('ok');
					// }
				});
				//解决金额输入不能为负数
				$('#authData').on('keyup', 'input[name="authCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var val = $(this).val();
					if (val < 0)
						$(this).val('');
        });
        // 删除
				$(document).on('mousedown', '#authData .btn-del', function (e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
          var obj = $('#authData').getObj(); // 取对象
					ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
						if (action) {
              var configId = $(".uf-grid-body-view #"+rowid).find('td[name="configId"]').text()
              var authCurText = $(".uf-grid-body-view #"+rowid).find('td[name="authCur"]').text()
              var authCur = !$.isNull(authCurText) ? parseFloat(authCurText.replace(/,/g, '')) : 0
              var usedAuthCurText = $(".uf-grid-body-view #"+rowid).find('td[name="usedAuthCur"]').text()
              var usedAuthCur = !$.isNull(usedAuthCurText) ? parseFloat(usedAuthCurText.replace(/,/g, '')) : 0
              var dataDel = $('#authData').getObj().getRowByTId(rowid)
              if (usedAuthCur > 0){
                ufma.showTip('此授权已使用不能删除',function(){
                  return false;
                },'warning');
              }else if (!$.isNull(dataDel.chrId)){
                var argu = {
                  'agencyCode': pageData.agencyCode,
                  'setYear': pageData.setYear,
                  'setId': pageData.bgItemId,
                  'configId': dataDel.configId 
                }
                ufma.post('/bg/ctrlManage/checkDeleteAuthCur', argu,function(result){
                  if (result.data == '') {
                    obj.del(rowid);
                  } else if(!$.isNull(result.data) && result.data > 0){
                    $(".uf-grid-body-view #"+rowid).find('td[name="authCur"]').text($.formatMoney(result.data, 2))
                    ufma.showTip('此授权已使用不能删除',function(){
                      return false;
                    },'warning');
                  }
                })
              } else if ($.isNull(dataDel.chrId)){
                obj.del(rowid);
              }
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});

        });
        // 新增行
				$('#btnAddRow').click(function () {
          var tmpData = {
            'configCode':'',
            'authCur':'',
            'configId':'',
            'orgAuthType':'1',
            'usedAuthCur':'',
            'remark':'',
            'treeData': page.treeData
          }
          if ($('#authData').find('tbody tr').length == 0) {
            page.setChildTable(tmpData);
          }
          var data = $.extend(true, {}, tmpData);
          // var decomData = $('#authData').find('tbody tr').length > 0 ? $('#authData').getObj().getData()[0] : {};
          // var data = $.extend(true, [], decomData);
          var data = $.extend(true, [], data);
          $('#authData').getObj().add(data); // 取对象
        });
        // // 授权金额输入后判断是否少于执行数
        $(document).on("blur", "#authDatamoneyauthCur", function () {
          var authDatamoneyauthCur = !$.isNull($('#authDatamoneyauthCur').val()) ? parseFloat($('#authDatamoneyauthCur').val().replace(/,/g,'')) : '';
          var authParentId = $('#authDatamoneyauthCur').parent('.uf-grid-table-edit').attr('rowid');
          var usedAuthCurText = $(".uf-grid-body-view #"+authParentId).find('td[name="usedAuthCur"]').text()
          var usedAuthCur = !$.isNull(usedAuthCurText) ? parseFloat(usedAuthCurText.replace(/,/g, '')) : 0
          if (authDatamoneyauthCur < usedAuthCur){
            ufma.showTip('授权金额不能少于执行数',function(){},warning);
            return false;
          }
        })
			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				uf.parse();
        page.agencyCode = window.ownerData.agencyCode;
        this.onEventListener();
        page.treeData = [];
        page.getDepData();
        page.getDetailData();
        
			}
		}
	}();
	window.page = page;
	// ///////////////////
	page.init();
});
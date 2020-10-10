$(function () {
	//open弹窗的关闭方法
	window._close = function (action, msg) {
		if (window.closeOwner) {
			var data = {
				action: action,
				msg: msg
			}
			window.closeOwner(data)
		}
	}
	var ownerData = window.ownerData
	var svData = ufma.getCommonData()

	function getByteLen(val) {
		var len = 0
		for (var i = 0; i < val.length; i++) {
			var a = val.charAt(i)
			if (a.match(/[^\x00-\xff]/gi) != null) {
				len += 2
			} else {
				len += 1
			}
		}
		return len
	}

	// 接口URL集合
	var interfaceURL = {
		selectMaEmpAndPrsCalcData: '/ma/emp/maEmp/selectMaEmpAndPrsCalcData', // 点击新增/编辑获取页面信息
		selectMaEmp: '/ma/emp/maEmp/selectMaEmp', // 查询具体人员信息
		saveMaEmp: '/ma/emp/maEmp/saveMaEmp', // 新增/修改人员信息  rmwyid 有值为修改   没有是新增
		getIntervalPrsLevelCo: '/ma/prslevelco/getIntervalPrsLevelCo', // 查询两个级别之间级别工资档次列表
		getProvince: '/ma/emp/maEmp/selectBankProvinceCityInfoByCode',  //查询银行账户相关信息
		getEmpType : '/ma/ele/emptype/selectEmpType', //获取人员身份
		showAccount: '/ma/api/sysRgPara/selectChrValueByChrCodeApi'
	}
	var pageLength = 25

	// 生成HTML元素
	var createHtml = (function () {
		return {
			//照片附件
			createFilePicture: function(require, id, name, imgName, imgPath, disable){
				var html = 
				'<div class="form-group margin-top-10 col-xs-10 col-sm-4 col-md-4">'+
					'<div class="pictureCell">'+
						'<label class="control-label text-align-left data-label" title="<%=name%>"><%=name%>:</label>' +
						'<div class="pictureWrap">'+
							'<img id="picture" data-name="<%=imgName%>" src="<%=imgPath%>" />'+
							'<input id="pictureFile" class="fileBtn" name="pictureFile" type="file" accept=".jpg,.jpeg,.png,.gif"/>'+
							'<div class="deletePicture hidden">×</div>'+
						'</div>'+
					'</div>'+
				'</div>'
				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					disable: disable ? 'disabled' : '',
					id: id,
					name: name,
					imgName: imgName,
					imgPath: imgPath
				})
			},
			// 字符型
			createInput: function (require, id, name, disable) {
				var html =
					'<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
					'<label class="control-label text-align-left data-label" title="<%=name%>"><%=name%>:</label>' +
					'<div class="control-element" style="width:180px;">' +
					'<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 180px" <%=disable%> autocomplete="off" />' +
					'</div></div>'

				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					disable: disable ? 'disabled' : '',
					id: id,
					name: name
				})
			},
			// 数字型
			createNumInput: function (require, id, name,disable) {
				var html =
					'<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
					'<label class="control-label text-align-left data-label"  title="<%=name%>"><%=name%>:</label>' +
					'<div class="control-element" style="width:180px;">' +
					'<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 180px" autocomplete="off" <%=disable%> placeholder="请输入数字"  />' +
					'</div></div>'

				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					disable: disable ? 'disabled' : '',
					id: id,
					name: name
				})
			},
			// 日期型
			createDate: function (require, id, name,parentId) {
				var html =
					'<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
					'<label class="control-label text-align-left data-label"  title="<%=name%>"><%=name%>:</label>' +
					'<div id="<%=parentId%>" class="control-element" style="width:180px;">' +
					'<div id="<%=id%>" name="<%=id%>" class="uf-datepicker" style="width:200px;"></div></div></div>'
				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					id: id,
					name: name,
					parentId: parentId
				})
			},
			// 开关
			createRadioGroup: function (require, id, name, code,parentId,activeN,activeY) {
				var html =
					'<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
					'<label class="control-label data-label "  title="<%=name%>"><%=name%>:</label>' +
					'<div id="<%=parentId%>" class="control-element"><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-default btn-sm <%=activeN%>">' +
					'<input type="radio" class="toggle" name="<%=id%>" value="<%=code1%>"/><%=codeName1%></label>' +
					'<label class="btn btn-default btn-sm <%=activeY%>">' +
					'<input type="radio" class="toggle" name="<%=id%>" value="<%=code2%>" checked/><%=codeName2%></label>' +
					'</div></div></div>'

				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					id: id,
					name: name,
					code1: code[0].valId,
					codeName1: code[0].val,
					code2: code[1].valId,
					codeName2: code[1].val,
					parentId: parentId,
					activeN: activeN ? 'active' : '',
					activeY: activeY ? 'active' : ''
				})
			},
			// 枚举型 引用 多选
			createCombox: function (require, id, name, disable) {
				var html =
					'<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
					'<label class="control-label data-label" title="<%=name%>"><%=name%>:</label>' +
					'<div class="control-element"><div id="<%=id%>" class="<%=disable%>"  idField="code" textField="codeName" leafRequire="true" name="<%=id%>" style="width:180px"></div></div></div>'

				return ufma.htmFormat(html, {
					required: require ? 'required' : '',
					id: id,
					name: name,
					disable: disable ? 'uf-treecombox uf-combox-disabled' : 'uf-treecombox',
				})
			}
		}
	})()

	var page = (function () {
		return {
			posiCodeList: [],
			pictureFlag: false,
			// 定义列
			columns: function () {
				var columns = [
					[{
						type: 'checkbox',
						width: 30,
						align: 'center',
						headalign: 'center'
					},
					{
						type: 'indexcolumn',
						width: 40,
						name: '序号',
						align: 'center',
						headalign: 'center'
					},
					//CWYXM-9700--人员库/部门人员信息/账户信息/增加一列“账户类别”用于标识银行卡的属性--zsj
					{
						type: 'combox',
						field: 'accountAttr',
						name: '账户类别',
						headalign: 'center',
						align: 'center',
						className: 'accountAttr',
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: page.accountAttrData,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.accountAttr)) {
								return '<span title="' + rowdata.accountAttr + ' ' + rowdata.accountAttrName + '">' + rowdata.accountAttrName + '</span>';
							} else {
								return '';
							}
						},
						onChange: function (e, data) {

						},
						beforeExpand: function (e) { }
					},
					{
						type: 'input',
						field: 'accountNo',
						name: '账号',
						className: 'isprint nowrap  ellipsis',
						width: 240,
						headalign: 'center',
						align: 'center',
						onKeyup: function (e) {
							if (e.data !== '') {
								var newData = e.data.replace(/[^\d]/g, '')
								$('#accountMessageinputaccountNo').val(newData)
							}
						}
					},
					{
						type: 'input',
						field: 'accountName',
						name: '户名',
						headalign: 'center',
						align: 'center',
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.accountName)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						},
					},
					{
						type: 'treecombox',
						field: 'bankCategoryCode',
						name: '银行类别',
						width: 180,
						headalign: 'center',
						align: 'center',
						className: 'bankType',
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pId',
						data: page.bankTypeData,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.bankCategoryCode)) {
								return '<span title="' + rowdata.bankCategoryCode + ' ' + rowdata.bankCategoryName + '">' + rowdata.bankCategoryCode + ' ' + rowdata.bankCategoryName + '</span>';
							} else {
								return '';
							}
						},
						onChange: function (e) {
							$(e.sender).siblings('.inputedit[name="province"]').val('');
							$(e.sender).siblings('.inputedit[name="city"]').val('');
							$(e.sender).siblings('.inputedit[name="pbcbankno"]').val('');
							page.initBankCategoryData(e);
						},
						beforeExpand: function (e) { }
					},
					{
						type: 'treecombox',
						field: 'bankCode',
						name: '开户银行',
						width: 180,
						headalign: 'center',
						className: 'acctBankType',
						align: 'center',
						idField: 'code',
						textField: 'codeName',
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.bankCode)) {
								return '<span title="' + rowdata.bankCode + ' ' + rowdata.bankName + '">' + rowdata.bankCode + ' ' + rowdata.bankName + '</span>';
							} else {
								return '';
							}
						},
						onChange: function (e, data) {
							$(e.sender).siblings('.inputedit[name="province"]').val('');
							$(e.sender).siblings('.inputedit[name="city"]').val('');
							$(e.sender).siblings('.inputedit[name="pbcbankno"]').val('');
							page.initRelaitonInfo(e);
						},
						beforeExpand: function (e) { }
					},
					{
						type: 'input',
						field: 'province',
						name: '省份',
						headalign: 'center',
						align: 'center',
						className: 'accountType',
						readOnly: true,
						disabled: true,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.province)) {
								return '<span title="' + rowdata.province + '">' + rowdata.province + '</span>';
							} else {
								return '';
							}
						}
					},
					{
						type: 'input',
						field: 'city',
						name: '城市',
						headalign: 'center',
						align: 'center',
						className: 'accountType',
						readOnly: true,
						disabled: true,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.city)) {
								return '<span title="' + rowdata.city + '">' + rowdata.city + '</span>';
							} else {
								return '';
							}
						}
					},
					{
						type: 'input',
						field: 'pbcbankno',
						name: '人行联行号',
						width: 150,
						headalign: 'center',
						align: 'center',
						className: 'accountType',
						readOnly: true,
						disabled: true,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.pbcbankno)) {
								return '<span title="' + rowdata.pbcbankno + '">' + rowdata.pbcbankno + '</span>';
							} else {
								return '';
							}
						}
					},
					{
						field: 'accountType',
						name: '账户性质',
						headalign: 'center',
						align: 'center',
						className: 'accountType',
						readOnly: true,
						disabled: true,
						data: page.accountType,
						render: function (rowid, rowdata, data) {
							return '<span>个人</span>'
						}
					},
					{
						type: 'combox',
						field: 'accountStatus',
						name: '账户状态',
						headalign: 'center',
						align: 'center',
						className: 'acctBankStatus',
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: page.acctClassData,
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.accountStatus)) {
								return '<span title="' + rowdata.accountStatus + ' ' + rowdata.accountStatusName + '">' + rowdata.accountStatusName + '</span>';
							} else {
								return '';
							}
						},
						onChange: function (e, data) {

						},
						beforeExpand: function (e) { }
					},
					{
						type: 'combox',
						field: 'isReimburseCard',
						name: '默认为报销卡',
						width: 120,
						headalign: 'center',
						align: 'center',
						idField: 'isReimburseCard',
						textField: 'isReimburseType',
						data: [{
							isReimburseCard: '1',
							isReimburseType: '是'
						},
						{
							isReimburseCard: '0',
							isReimburseType: '否'
						}
						],
						render: function (rowid, rowdata, data) {
							if (!$.isNull(rowdata.isReimburseCard)) {
								if (rowdata.isReimburseCard == 'Y' || rowdata.isReimburseCard == '1') {
									return '是'
								} else if (rowdata.isReimburseCard == 'N' || rowdata.isReimburseCard == '0') {
									return '否'
								}
							} else {
								return ''
							}
						},
						onChange: function (e) { },
						beforeExpand: function (e) { }
					},
					{
						type: 'combox',
						field: 'isPrsCard',
						name: '默认为工资卡',
						width: 120,
						headalign: 'center',
						align: 'center',
						idField: 'isPrsCard',
						textField: 'isPrsCardType',
						data: [{
							isPrsCard: '1',
							isPrsCardType: '是'
						},
						{
							isPrsCard: '0',
							isPrsCardType: '否'
						}
						],
						render: function (rowid, rowdata, data) {
							if (rowdata.isPrsCard == 'Y' || rowdata.isPrsCard == '1') {
								return '是'
							} else if (rowdata.isPrsCard == 'N' || rowdata.isPrsCard == '0' || rowdata.isPrsCard == '') {
								return '否'
							}
						},
						onChange: function (e) { },
						beforeExpand: function (e) { }
					}
					]
				]
				return columns
			},
			//渲染表格
			initTable: function (tableData) {
				page.tableObjData = tableData;
				page.initAccountAttr();//获取账户类别枚举值：--CWYXM-9700--人员库/部门人员信息/账户信息/增加一列“账户类别”用于标识银行卡的属性--zsj
				page.initBankTypeData();
				page.initAccountType();
				page.initAccountClass();
				var id = 'accountMessage'
				$('#' + id).ufDatagrid({
					frozenStartColumn: 1, //冻结开始列,从1开始
					// frozenEndColumn: 1, //冻结结束列
					data: tableData,
					disabled: false, // 可选择
					columns: page.columns(),
					initComplete: function (options, data) {
					}
				})
				//控制账户信息区域的隐藏显示
				$.get('/ma/api/sysRgPara/selectChrValueByChrCodeApi?agencyCode='+
				ownerData.agencyCode+
				'&rgCode='+svData.svRgCode+
				'&setYear='+svData.svSetYear+
				'&acctCode=*&chrCode=MA003',
				function(result){
					console.log(result)
					if(!result){
						$('#accountInfoWrap').addClass('hide')
					}
				})
			},
			/**
			* @description: 构建html
			* @param {string} name 数据中的className 副标题
			* @param {string} htmlArray
			*/
			createClassNameHtml: function (name, htmlArray) {
				var classNameHtml = ''
				var htmls = []
				if(page.pictureFlag){
					//第1行放入前3个
					htmls.push(htmlArray.slice(0, 3))
					//2、3、4行只放入两个 3,4 5,6 7,8
					for (var i = 3; i <= 7; i += 2) {
						htmls.push(htmlArray.slice(i, i + 2))
					}
					for (var i = 9, len = htmlArray.length; i < len; i += 3) {
						htmls.push(htmlArray.slice(i, i + 3))
					}
				}else{
					// 每三个form-group添加一个clearfix
					for (var i = 0, len = htmlArray.length; i < len; i += 3) {
						htmls.push(htmlArray.slice(i, i + 3))
					}
				}
				for (var i = 0; i < htmls.length; i++) {
					var item = htmls[i]
					item.push('<div class="clearfix"></div>')
				}

				htmls = [].concat.apply([], htmls)

				var html = htmls.join('')
				classNameHtml +=
					'<div class="info-title margin-bottom-10">' +
					name +
					'</div><div class="form-row">' +
					html +
					'<div class="clearfix"></div></div>'

				return classNameHtml
			},
			//获取账户类别枚举值：--CWYXM-9700--人员库/部门人员信息/账户信息/增加一列“账户类别”用于标识银行卡的属性--zsj
			initAccountAttr: function () {
				var argu = {};
				argu["rgCode"] = svData.svRgCode;
				argu["setYear"] = svData.svSetYear;
				ufma.ajaxDef('/ma/pub/enumerate/MA_EMP_ACCOUNT_ACCOUNT_ATTR', 'get', argu, function (result) {
					page.accountAttrData = result.data;
					buildCombox();
				});

				function buildCombox() {
					$('#accountMessagecomboxaccountAttr').ufTreecombox({
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: page.accountAttrData,
						name: 'accountAttrData'
					});
				};
			},
			//获取账户状态枚举值：
			initAccountClass: function () {
				var argu = {};
				argu["rgCode"] = svData.svRgCode;
				argu["setYear"] = svData.svSetYear;
				ufma.ajaxDef('/ma/pub/enumerate/MA_EMP_ACCOUNT_ACCOUNT_STATUS', 'get', argu, function (result) {
					page.acctClassData = result.data;
					buildCombox();
				});

				function buildCombox() {
					$('#accountMessagecomboxaccountStatus').ufTreecombox({
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: page.acctClassData,
						name: 'acctClassData'
					});
				};
			},
			//获取账户性质枚举值
			initAccountType: function () {
				var argu = {};
				argu["rgCode"] = svData.svRgCode;
				argu["setYear"] = svData.svSetYear;
				ufma.ajaxDef('/ma/pub/enumerate/MA_EMP_ACCOUNT_ACCOUNT_TYPE', 'get', argu, function (result) {
					page.accountType = result.data;
					buildCombox();
				});

				function buildCombox() {
					$('#accountMessagecomboxaccountType').ufTreecombox({
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: page.accountType,
						name: 'accountType',
					});
				};
				$('#accountMessagecomboxaccountType_input').attr("readOnly")
			},
			//获取银行类型下拉
			initBankTypeData: function () {
				var argu = {};
				argu["rgCode"] = svData.svRgCode;
				argu["setYear"] = svData.svSetYear;
				ufma.ajaxDef('/ma/emp/maEmp/selectBankCategoryTree', 'get', argu, function (result) {
					page.bankTypeData = result.data;
					// buildCombox();
				});

				// function buildCombox() {
				// 	$('#accountMessagecomboxbankCategoryCode').ufTreecombox({
				// 		idField: 'code',
				// 		textField: 'codeName',
				// 		data: page.bankTypeData,
				// 		name: 'bankType',
				// 		onChange: function(e, data) {
				// 				var bankCategoryCode = $('#accountMessagecomboxbankCategoryCode').getObj().getValue();
				// 				page.initBankCategoryData(bankCategoryCode)
				// 			},
				// 	});
				// };
			},
			//获取网点信息列表
			initBankCategoryData: function (e) {
				var $trEdit = e.sender.parent(".uf-grid-table-edit");
				var $trId = $trEdit.attr("rowid");
				var $trShow = $("tr#" + $trId);
				var bankCategoryCode = e.itemData.code;
				var bankCategoryCode = $trEdit.find('[name="bankCategoryCode"].uf-combox').getObj().getValue();
				var $bankCodeObj = $trEdit.find('[name="bankCode"].uf-combox').getObj();
				if (bankCategoryCode != "" && bankCategoryCode != null) {
					var argu = {};
					argu["rgCode"] = svData.svRgCode;
					argu["setYear"] = svData.svSetYear;
					argu["bankCategoryCode"] = bankCategoryCode;
					ufma.ajaxDef('/ma/emp/maEmp/selectBankTree', 'get', argu, function (result) {
						$bankCodeObj.load(result.data);
						if (e.rowData.hasOwnProperty("bankCategoryCode")) {
							$bankCodeObj.val(e.rowData.bankCategoryCode);
						}
					});

				}
			},
			//获取银行省份、城市、人行联行号 guohx 20200302
			initRelaitonInfo: function (e) {
				var argu = {};
				argu["rgCode"] = svData.svRgCode;
				argu["setYear"] = svData.svSetYear;
				argu["bankCode"] = e.itemData.code;
				ufma.ajaxDef(interfaceURL.getProvince, 'get', argu, function (result) {
					if (!$.isNull(result.data)) {
						$(e.sender).siblings('.inputedit[name="province"]').val(result.data.province);
						$(e.sender).siblings('.inputedit[name="city"]').val(result.data.city);
						$(e.sender).siblings('.inputedit[name="pbcbankno"]').val(result.data.pbcbankno);
					} else {
						$(e.sender).siblings('.inputedit[name="province"]').val('');
						$(e.sender).siblings('.inputedit[name="city"]').val('');
						$(e.sender).siblings('.inputedit[name="pbcbankno"]').val('');
					}

				});
			},
			// 初始化表单
			initForm: function (data, posiCode) {
                                            page.property = {};
                                            page.combox = []; // 下拉选项类型
                                            page.numInput = []; // 数字类型
                                            page.charNum = []; // 字符数字类
											page.dateInput = []; // 日期类型
											page.disDate =[]; // 禁用的日历类型
											page.require = []; // 必须输入
											page.disRadio =[]; // 禁用的开关按钮
                                            var classNameHtml = "";

                                            var orgCodeList = [];

                                            // 过滤停用部门
                                            for (var i = 0; i < window.ownerData.orgCodeList.length; i++) {
                                              if (window.ownerData.orgCodeList[i].isUsed === "Y") {
                                                var item = window.ownerData.orgCodeList[i];
                                                orgCodeList.push({
                                                  code: item.code,
                                                  name: item.name,
                                                  pId: item.pId,
                                                });
                                              }
                                            }
                                            for (var i = 0; i < data.length; i++) {
                                              var item = data[i];
                                              if (item.data.length !== 0 && item.ordIndex !== "*") {
                                                var htmlArray = [];
                                                for (var j = 0; j < item.data.length; j++) {
												  var require = item.data[j].isEmpty === "N" ? true : false;
												  if(window.ownerData.action =="edit"){
													var disable = item.data[j].isEdit == "N" ? true : false;
												  }else{
													var disable = false;
												  }
                                                  var id = item.data[j].propertyCode;
												  var name = item.data[j].propertyName;
												  var parentId = "parent" +id;
                                                  page.property[id] = "";
                                                  if (require) {
                                                    page.require.push({
                                                      id: id,
                                                      name: name,
                                                    });
												  }
												  //单选按钮（开关）组件或者下拉框组件  当选项为2个的时候使用单选按钮（开关）样式
                                                  if (item.data[j].dataType === "E" || item.data[j].dataType === "R" || item.data[j].dataType === "X") {
                                                    // 单选按钮（开关）样式
                                                    if (item.data[j].asValList && item.data[j].asValList.length === 2) {
														//是否孤老,是否残疾,是否烈属,是否境外人员,任职受雇从业类型 默认为否 guohx 14131
                                                      if (id == "isLonelyaged" || id == "isDisabled" || id == "isMartyrFamilies" || id == "isForeigner" || id== "careerType") {
														activeN = true;
														activeY = false;
                                                      } else {
														activeN = false;
														activeY = true;
                                                      }
                                                      htmlArray.push(createHtml.createRadioGroup(require, id, name, item.data[j].asValList, parentId, activeN, activeY));
                                                      if (disable) {
                                                        page.disRadio.push(parentId);
                                                      }
                                                    } else {
                                                      htmlArray.push(createHtml.createCombox(require, id, name, disable));
                                                      page.combox.push({
                                                        id: id,
                                                        name: name,
                                                        asValList: item.data[j].asValList ? item.data[j].asValList : [],
                                                        posiLevelList: item.data[j].posiLevelList ? item.data[j].posiLevelList : [],
                                                      });
                                                    }
                                                  } else if (item.data[j].dataType === "N") {
                                                    htmlArray.push(createHtml.createNumInput(require, id, name, disable));
                                                    page.numInput.push(id);
                                                    page.charNum.push({
                                                      id: id,
                                                      name: name,
                                                    });
                                                  } else if (item.data[j].dataType === "D") {//日期类型
													
													htmlArray.push(createHtml.createDate(require, id, name,parentId));
													page.dateInput.push(id);
													if(disable){
														page.disDate.push(parentId);
													}
												  } else { //C?普通文本框类型
													if(item.data[j].propertyCode==='picture'){//如果是照片需要特殊处理 向数组中增加一条作为第三条
														page.pictureFlag = true;//照片已启用
														htmlArray.splice(2,0,createHtml.createFilePicture(require, id, name,'', './img/user.png',disable))
													}else{
														htmlArray.push(createHtml.createInput(require, id, name ,disable));
														//主要用于校验？
														page.charNum.push({
														  id: id,
														  name: name,
														});
													}
                                                  }
                                                }
                                                classNameHtml += page.createClassNameHtml(item.className, htmlArray);
                                              }
                                            //   if (item.ordIndex === "*") {
                                            //     page.bankfileStyle = item.data.bankfileStyle;
                                            //   }
                                            }

											$("#form-container").html(classNameHtml);
											//删除图片按钮的隐藏 显示
											$('.pictureWrap').hover(function(){
												var src = $('#picture').prop('src')
												if(src&&src.indexOf('user.png') < 0){
													$('.deletePicture').removeClass('hidden')
												}
											},function(){
												$('.deletePicture').addClass('hidden')
											})

											//删除图片 
											$('.deletePicture').on('click', function(){
												$('#pictureFile').val('')
												$('#picture').attr('data-name','').prop('src', './img/user.png')
											})
											//上传图片
											$('#pictureFile').on('change', function(e){
												var formData = new FormData()
												formData.append("file", $('#pictureFile')[0].files[0]);
												formData.append("imageName", $('#picture').attr('data-name'));
												ufma.showloading()
												$.ajax({
													url: '/ma/emp/maEmp/uploadImage',
													type: 'POST',
													data: formData,
													cache: false,
													processData: false,
													contentType: false,
													success: function(res){
														ufma.hideloading()
														if(res.flag === 'success'){
															$('#picture').attr('data-name', res.data).prop('src', '/ma/emp/maEmp/showImage?fileName='+res.data)
														}else{
															ufma.showTip(res.msg, function(){},'error')
														}
													},
													error: function(error){
														ufma.hideloading()
													}
												})
											})
                                            for (var i = 0; i < page.combox.length; i++) {
                                              var id = page.combox[i].id;
                                              var name = page.combox[i].name;
                                              var asValList = page.combox[i].asValList;
                                              if (page.combox[i].id == "posiCode") {
                                                page.posiCodeList = page.combox[i].asValList;
                                              }
                                              if (page.combox[i].id == "posiLevel") {
                                                if (asValList.length !== 0) {
                                                  $("#" + id).ufTreecombox({
                                                    idField: "valId",
                                                    textField: "val",
                                                    pIdField: "pCode", //可选
                                                    placeholder: "请选择" + name,
                                                    data: asValList,
                                                    leafRequire: true,
                                                    readonly: false,
                                                    onChange: function (e, data) {
                                                      var posiLevel = data.valId;
                                                      var data = [];
                                                      var posiCodeList = page.posiCodeList;
                                                      if (posiCodeList.length <= 20) {
                                                        return;
                                                      }
                                                      switch (parseInt(posiLevel)) {
                                                        case 1:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode == 1) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 2:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 2 && pcode <= 4) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 3:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 4 && pcode <= 8) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 4:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 6 && pcode <= 10) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 5:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 8 && pcode <= 13) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 6:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 10 && pcode <= 15) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 7:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 12 && pcode <= 18) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 8:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 14 && pcode <= 20) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 9:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 16 && pcode <= 22) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 10:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 17 && pcode <= 24) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 11:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 18 && pcode <= 26) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        case 12:
                                                          for (var i = 0; i < posiCodeList.length; i++) {
                                                            var pcode = parseInt(posiCodeList[i].valId.substring(0, 2));
                                                            if (pcode >= 19 && pcode <= 27) {
                                                              data.push({
                                                                valId: posiCodeList[i].valId,
                                                                val: posiCodeList[i].val,
                                                              });
                                                            }
                                                          }
                                                          break;
                                                        default:
                                                      }
                                                      $("#posiCode").getObj().load(data);
                                                      $("#posiCode")
                                                        .getObj()
                                                        .val(posiCode ? posiCode : "");
                                                    },
                                                    onComplete: function (sender, data) {},
                                                  });
                                                }
                                              } else if (page.combox[i].id == "staffingOrgCode") {
                                                //请求单位列表
                                                $("#" + id).ufTreecombox({
                                                  idField: "code",
                                                  textField: "name",
                                                  pIdField: "pId", //可选
                                                  placeholder: "请选择部门",
                                                  data: orgCodeList,
                                                  leafRequire: true,
                                                  readonly: false,
                                                  onChange: function (sender, data) {},
                                                  onComplete: function (sender, data) {},
                                                });
                                              } else if (page.combox[i].id == "workAgencyCode") {
                                                ufma.ajax(
                                                  "/ma/sys/eleAgency/getAgencyTree",
                                                  "get",
                                                  {
                                                    rgCode: svData.svRgCode,
                                                    setYear: svData.svSetYear,
                                                  },
                                                  function (result) {
                                                    var data = result.data;
                                                    $("#workAgencyCode").ufTreecombox({
                                                      idField: "code",
                                                      textField: "name",
                                                      pIdField: "pId", //可选
                                                      placeholder: "请选择单位",
                                                      data: data,
                                                      leafRequire: true,
                                                      readonly: false,
                                                      onChange: function (sender, data) {},
                                                      onComplete: function (sender, data) {},
                                                    });
                                                  }
                                                );
                                              } else {
                                                $("#" + id).ufTreecombox({
                                                  idField: "valId",
                                                  textField: "val",
                                                  pIdField: "pCode", //可选
                                                  placeholder: "请选择" + name,
                                                  data: asValList,
                                                  leafRequire: true,
                                                  readonly: false,
                                                  onChange: function (sender, data) {},
                                                  onComplete: function (sender, data) {},
                                                });
                                              }
                                            }
                                            for (var i = 0; i < page.numInput.length; i++) {
                                              var id = page.numInput[i];
                                              // 数字类型需要处理
                                              $("#" + id).numberInput();
                                            }
                                            for (var i = 0; i < page.dateInput.length; i++) {
                                              var id = page.dateInput[i];
                                              if (id == "inworkDate") {
                                                //给参加工作日期绑定onchang事件，动态计算工龄
                                                //绑定日历控件
                                                $("#" + id).ufDatepicker({
                                                  format: "yyyy-mm-dd",
                                                  initialDate: "",
                                                  onChange: function (sender, data) {
                                                    var workExperience = page.getWorkExper(sender, svData.svTransDate);
                                                    $("#workExperience").val(workExperience);
                                                    $("#workExperience").attr("disabled", true);
                                                  },
                                                });
                                              } else {
                                                //绑定日历控件
                                                $("#" + id).ufDatepicker({
                                                  format: "yyyy-mm-dd",
                                                  initialDate: "",
                                                });
                                              }
                                            }
                                            // 部门名称 单独处理
                                            $("#orgCode").ufTreecombox({
                                              idField: "code",
                                              textField: "name",
                                              pIdField: "pId", //可选
                                              placeholder: "请选择部门",
                                              data: orgCodeList,
                                              leafRequire: true,
                                              readonly: false,
                                              onChange: function (sender, data) {
												  console.log(data)
											  },
                                              onComplete: function (sender, data) {
												var len = orgCodeList.length
												if(len === 1){
													setTimeout(function(){
														$("#orgCode").getObj().val(orgCodeList[0].code)
													}, 500)
												}
											  },
											});
											page.getEmpType(function(typeCodeList){
												var len = typeCodeList.length
												// 人员身份 单独处理
												$("#typeCode").ufTreecombox({
												  idField: "chrCode",
												  textField: "chrName",
												  pIdField: "parentCode", //可选
												  placeholder: "请选择人员身份",
												  data: typeCodeList,
												  leafRequire: true,
												  readonly: false,
												  onChange: function (sender, data) {},
												  onComplete: function (sender, data) {
													if(len === 1){
														setTimeout(function(){
															$("#typeCode").getObj().val(typeCodeList[0].chrCode)
														}, 500)
													}
												  },
												});
											})
											//如果人员姓名输入框和助记码输入框存在 在输入人员姓名后要填入助记码
											if( $('#empName').length > 0 && $('#assCode').length > 0 ){
												$('#empName').on('blur', function() {
													$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
													var chrNameValue = $(this).val();
													ufma.post('/pub/util/String2Alpha', {
														"chinese": chrNameValue
													}, function(result) {
														if(result.data.length > 42) {
															var data = result.data.substring(0, 41);
															$('#assCode').val(data);
														} else {
															$('#assCode').val(result.data);
														}
													});
												});
											}
                                            // 填写身份证号后，自动带出“出生日期”
                                            $("#identityCode").on("blur", function () {
                                              var identityType = $("#identityType").getObj().getValue();
											  var identityCode = $("#identityCode").val();
											  if (identityType === "01"){
												var flag = true
												ufma.ajaxDef(
												  '/ma/emp/maEmp/validateIdCard',
												  'get',
												  {
													  identityCode: identityCode
												  },
												  function(result){
													  console.log(result)
													  flag = result.data
												  }
												)
												if(!flag){
												  ufma.showTip('请输入正确的证件号码', function () { }, 'warning')
												  return false
												}else{
													var birthday = identityCode.substr(6, 4) + "-" + identityCode.substr(10, 2) + "-" + identityCode.substr(12, 2);
													$("#birthday").getObj().setValue(birthday);
												}
											  }
                                            //   if (identityType === "01" && ufma.checkIdCard(identityCode)) {
                                            //     var birthday = identityCode.substr(6, 4) + "-" + identityCode.substr(10, 2) + "-" + identityCode.substr(12, 2);
                                            //     $("#birthday").getObj().setValue(birthday);
                                            //   }
                                            });
                                          },

			// 校验数据
			checkData: function (formData) {
				for (var i = 0; i < window.ownerData.allEmpCodes.length; i++) {
					var element = window.ownerData.allEmpCodes[i]
					if (
						element === formData.empCode &&
						element !== window.ownerData.empCode
					) {
						ufma.showTip('人员编码重复，请重新录入！', function () { }, 'warning')
						return false
					}
				}
				for (var i = 0; i < page.require.length; i++) {
					var item = page.require[i]
					if (formData[item.id].trim() === '') {
						ufma.showTip('请输入' + item.name, function () { }, 'warning')
						return false
					}
				}
				for (var i = 0; i < page.charNum.length; i++) {
					var item = page.charNum[i]
					if (getByteLen(formData[item.id].trim()) > 120) {
						var message = item.name + '最大可输入120个字符'
						ufma.showTip(message, function () { }, 'warning')
						return false
					}
				}
				// 邮箱合法性校验
				if( $('#email') && $('#email').val() ){
					var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
					if(!reg.test($('#email').val())){
						ufma.showTip('邮箱格式有误！')
						return false
					}
				}
				// 身份证号合法性校验
				if ($('#identityType') && $('#identityCode')) {
					var identityType = $('#identityType')
						.getObj()
						.getValue()
					var identityCode = $('#identityCode').val()
					// && !ufma.checkIdCard(identityCode)
					if (identityType === '01' && identityCode !== '') {
						var flag = true
						ufma.ajaxDef(
							'/ma/emp/maEmp/validateIdCard',
							'get',
							{
								identityCode: $('#identityCode').val()
							},
							function(result){
								console.log(result)
								flag = result.data
							}
						)
						if(!flag){
							ufma.showTip('请输入正确的证件号码', function () { }, 'warning')
							return false
						}
					}
				}
				var tableData = $('#accountMessage').getObj().getData()
				var  accountNoObj = {}
				for (var i = 0; i < tableData.length; i++) {
					if (!tableData[i].accountNo) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，账号没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
					var flag = false
					for(var p in accountNoObj){
						if(p === tableData[i].accountNo){
							flag = true
						}
					}
					if(flag){
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，账号有重复，请检查！',
							function () { },
							'warning'
						)
						return false
					}else{
						accountNoObj[tableData[i].accountNo] = 1
					}
					if (!tableData[i].accountName) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，户名没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
					if (!tableData[i].bankCategoryCode && tableData[i].isReimburseCard != 0) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，银行类别 没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
					if (!tableData[i].bankCode && tableData[i].isReimburseCard != 0) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，开户银行没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
					if (!tableData[i].accountStatus) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，账户状态没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
					if (!tableData[i].isReimburseCard) {
						var index = i + 1
						ufma.showTip(
							'账户信息第' + index + '行，默认报销卡没有设置，请检查！',
							function () { },
							'warning'
						)
						return false
					}
				}
				return true
			},
			getAddArgu: function (maEmpAccountList, formData) {
				var tableData = [];
				var maEmpAccountList = maEmpAccountList;
				return $.extend({}, formData, {
					maEmpAccountList: maEmpAccountList,
					agencyCode: ownerData.agencyCode,
					rgCode: svData.svRgCode,
					setYear: svData.svSetYear
				})
			},
			// 编辑参数
			getEditArgu: function (maEmpAccountList, formData) {
				var tableData = [];
				var tableData1 = [];
				var maEmpAccountList = maEmpAccountList;
				return $.extend({}, formData, {
					maEmpAccountList: maEmpAccountList,
					delproTypeCodeList: page.delproTypeCodeList,
					agencyCode: ownerData.agencyCode,
					rgCode: svData.svRgCode,
					setYear: svData.svSetYear
				})
			},
			getArgu: function (formData) {
				var maEmpAccountList = $('#accountMessage').getObj().getData();
				for (var i = 0; i < maEmpAccountList.length; i++) {
					if (maEmpAccountList[i].accountType == '') {
						maEmpAccountList[i].accountType = '1';
					}
				}
				// 编辑
				if (window.ownerData.id) {
					argu = page.getEditArgu(maEmpAccountList, formData);
				} else {
					argu = page.getAddArgu(maEmpAccountList, formData)
				}

				if (window.ownerData.id) {
					argu.rmwyid = window.ownerData.id
				} else {
					argu.rmwyid = ''
				}
				delete argu.file
				return argu
			},
			// 校验账户信息
			checkArgu: function (tableData) {
				var reimburseCardNum = 0; // 报销卡数量
				for (var i = 0; i < tableData.length; i++) {
					if (tableData[i].accountStatus == '1' && tableData[i].isReimburseCard == '1') {
						reimburseCardNum++;
					}
				}
				if (reimburseCardNum > 1) {
					ufma.showTip(
						'账户信息，帐号状态是“正常”的，只允许添加一行“是报销卡”的记录！',
						function () { },
						'warning'
					)
					return false
				} else {
					return true
				}
			},
			// 保存并新增
			saveAdd: function (formData) {
				var formData = $('#frmQuery').serializeObject()
				if (!page.checkData(formData)) {
					return
				}
				var argu = page.getArgu(formData)
				if(!page.checkArgu(argu.maEmpAccountList)) {
					return;
				}
				argu.picture = $('#picture').attr('data-name')
				argu.agencyCode = ownerData.agencyCode
				$('button').attr('disabled', true)
				ufma.showloading('正在加载数据请耐心等待...')
				ufma.post(interfaceURL.saveMaEmp, argu, function (result) {
					ufma.hideloading()
					$('button').attr('disabled', false)
					if (result.flag == 'fail') {
						ufma.showTip(result.msg, function () { }, 'warning')
					} else if (result.flag == 'success') {
						var msg = result.msg
						$('#frmQuery').setForm(page.property);
						$('#accountMessage').getObj().load([]);
						$('#picture').attr('data-name','').prop('src', './img/user.png')
						//$('#posiCode').getObj().load([]);
						window.ownerData.maxOrdIndex += 1
						window.ownerData.allEmpCodes.push(formData.empCode)
						ufma.showTip(msg, function () { }, 'success')
					}
				})
				var timeId = setTimeout(function () {
					clearTimeout(timeId)
					$('button').attr('disabled', false)
				}, '5000')
			},
			// 保存
			save: function () {
				var formData = $('#frmQuery').serializeObject()
				if (!page.checkData(formData)) {
					return
				}
				var argu = page.getArgu(formData)
				if(!page.checkArgu(argu.maEmpAccountList)) {
					return;
				}
				if (window.ownerData.id) {
					argu.rmwyid = window.ownerData.id
				} else {
					argu.rmwyid = ''
				}
				argu.picture = $('#picture').attr('data-name')
				argu.agencyCode = ownerData.agencyCode
				$('button').attr('disabled', true)
				ufma.showloading('正在加载数据请耐心等待...')
				ufma.post(interfaceURL.saveMaEmp, argu, function (result) {
					ufma.hideloading()
					$('button').attr('disabled', false)
					if (result.flag == 'fail') {
						ufma.showTip(result.msg, function () { }, 'warning')
					} else if (result.flag == 'success') {
						$('#picture').attr('data-name','').prop('src', './img/user.png')
						_close('sure', result.msg)
					}
				})
				var timeId = setTimeout(function () {
					clearTimeout(timeId)
					$('button').attr('disabled', false)
				}, '5000')
			},
			//获取计算工龄  工龄计算方法：（当前日期-参加工作日期）天数/365 ，结果保留一位小数。 guohx 20200310
			getWorkExper: function (dateString1, dateString2) {
				var startDate = Date.parse(dateString1);
				var endDate = Date.parse(dateString2);
				var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000 * 365);
				var flt = parseFloat(days).toFixed(1);
				if (!isNaN(flt)) return flt;
				return 0.0;
			},
			//获取人员身份
			getEmpType: function (callback) {
				var argu = {
					agencyCode: ownerData.agencyCode,
					setYear: svData.setYear,
					rgCode: svData.rgCode,
				};
				ufma.get(interfaceURL.getEmpType, argu, function (result) {
					callback(result.data)
					// typeCodeList = result.data;
				});
			},
			initPage: function () {
				//权限控制
				page.reslist = ufma.getPermission()
				ufma.isShow(page.reslist)
				ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function (result) {
					if (result.flag == 'fail') {
						ufma.showTip(result.msg, function () { }, 'warning')
					} else if (result.flag == 'success') {
						var formData = result.data
						for (var i = 0; i < formData.length; i++) {
							if (formData[i].className === '基本信息') {
								formData[i].data.unshift({
									dataType: "E",
									isEmpty: "N",
									isEdit : "Y",
									ordIndex: "0",
									propertyCode: "typeCode",
									propertyName: "人员身份",
								  });
								formData[i].data.unshift({
									dataType: 'E',
									isEmpty: 'N',
									isEdit : "Y",
									ordIndex: '0',
									propertyCode: 'orgCode',
									propertyName: '部门名称'
								})
							}
						}
						// 修改
						if (window.ownerData.id) {
							$('#person-saveadd').hide()
							var argu = {
								rmwyid: window.ownerData.id,
								agencyCode: ownerData.agencyCode,
								rgCode: svData.svRgCode,
								setYear: svData.svSetYear
							}
							ufma.post(interfaceURL.selectMaEmp, argu, function (result) {
								if (result.flag == 'fail') {
									ufma.showTip(result.msg, function () { }, 'warning')
								} else if (result.flag == 'success') {
									page.initForm(formData, result.data.posiCode);
									//guohx 根据是否允许修改控制日期控件禁用，写到别的地方，日期控件还没有生成
									for (var i = 0; i < page.disDate.length; i++) {
                    					$("#" + page.disDate[i]).disable();
              					    }
									for (var i = 0; i < page.disRadio.length; i++) {
										$("#" + page.disRadio[i]).disable();
									}
									$('#frmQuery').setForm(result.data);
									if(result.data.picture){
										$('#picture').attr('data-name', result.data.picture).prop('src', '/ma/emp/maEmp/showImage?fileName='+result.data.picture)
									}else{
										$('#picture').attr('data-name', '').prop('src', './img/user.png')
									}
									var workExperience = page.getWorkExper(result.data.inworkDate, svData.svTransDate);
									$('#workExperience').val(workExperience);
									$('#workExperience').attr('disabled', true)
									page.initTable(result.data.maEmpAccountList);
								}
							})
						} else {//新增
							page.initForm(formData)
							// 是否领导默认为否 ，停发状态默认为发放
							$('#frmQuery').setForm({
								isFugle: 'N',
								isStop: 'N',
								ordIndex: Number(window.ownerData.maxOrdIndex)
							})
							$('#person-saveadd').show();
							page.initTable([]);
						}
					}
				})
				page.delproTypeCodeList = [] // 工资类别删除保存原有数据
			},

			onEventListener: function () {
				//阻止冒泡事件
				$("#accountMessagecomboxbankCategoryCode").on("click", function (e) {
					stopPropagation(e);
				});
				$("#accountMessagecomboxbankCode").on("click", function (e) {
					stopPropagation(e);
				});
				$("#accountMessagecomboxaccountStatus").on("click", function (e) {
					stopPropagation(e);
				});
				$("#accountMessagecomboxaccountAttr").on("click", function (e) {
					stopPropagation(e);
				});
				$("#accountMessagecomboxisReimburseCard").on("click", function (e) {
					stopPropagation(e);
				});
				//增行
				$('.btn-add-row').on('click', function () {
					// var rowdata = {
					// 	accountNo: "",
					// 	accountName: "",
					// 	bankCategoryCode: "",
					// 	bankCode: "",
					// 	accountType: "",
					// 	accountStatus: '',
					// 	isReimburseCard: "N"
					// }
					// page.initBankTypeData();
					// page.initAccountType();
					// page.initAccountClass();
					// page.columns();
					// var obj = $('#accountMessage').getObj()//可编辑表格对象
					// obj.add(rowdata)//增加一行空数据
					var obj = $('#accountMessage').getObj(); // 取对象
					//CWYXM-19054【部门人员信息】新增一行银行卡信息时，“账户状态”要默认为“正常”
					var newId = obj.add({ accountStatus: '1' });
					obj.edit(newId);
				});
				//删行
				$('.btn-del-row').on('click', function () {
					var obj = $('#accountMessage').getObj()
					var checkData = obj.getCheckData()
					var $check = $('#accountMessage').find('.check-item:checked')
					if ($check.length > 0) {
						for (var i = 0; i < checkData.length; i++) {
							var rowid = $check.eq(i).attr('rowid')
							obj.del(rowid)
						}
					} else {
						ufma.showTip('请至少选择一项', function () { }, 'error')
					}
				});
				// 保存并新增按钮点击事件
				$('#person-saveadd').on('click', page.saveAdd)
				// 保存按钮点击事件
				$('#person-save').on('click', page.save)
				// 关闭按钮点击事件
				$('#btn-close').on('click', function () {
					_close()
				})
				$("#accountMessage").click(function () {
					$("#accountMessage").find('input[name="province"]').attr('disabled', true);
					$("#accountMessage").find('input[name="city"]').attr('disabled', true);
					$("#accountMessage").find('input[name="pbcbankno"]').attr('disabled', true);
				});
			},
			//此方法必须保留
			init: function () {
				ufma.parse()
				page.initPage()
				page.onEventListener()
				ufma.parseScroll()
			}
		}
	})()
	/////////////////////
	page.init()
})

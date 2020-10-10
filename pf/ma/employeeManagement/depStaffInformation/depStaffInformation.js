$(function () {
	//open弹窗的关闭方法
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			}
			window.closeOwner(data)
		}
	}
	var svData = ufma.getCommonData()

	//接口URL集合
	var interfaceURL = {
		getPrsOrgTree: '/ma/emp/prsOrg/getPrsOrgTree', // 获取部门树
		delete: '/ma/emp/prsOrg/delete', //  删除部门
		able: '/ma/emp/prsOrg/able', // 启用/停用
		getPropertyInList: '/ma/emp/maEmpProperty/getPropertyInList', // 获取在列表中显示的属性字段
		getMaEmpByOrgCodes: '/ma/emp/maEmp/getMaEmpByOrgCodes', // 查询部门下属的人员信息
		delMaEmp: '/ma/emp/maEmp/delMaEmp', // 批量删除人员信息
		selectMaEmpAndPrsCalcData: '/ma/emp/maEmp/selectMaEmpAndPrsCalcData', // 点击新增/编辑获取页面信息
		//getPrsLevelList: '/prs/prslevelco/getPrsLevelList' // 查询级别工资档次列表
		sameStepUrl: '/ma/emp/maEmp/addFapUser',//同步人员信息至平台--zsj
		sameJZ: '/ma/emp/maEmp/getJzUrl',
		getEmpTYpe: '/ma/ele/emptype/selectEmpType' //获取人员身份
	}
	var lastValue = ''
	var nodeList = []
	var pageLength = 25
	var typeCodeList; // 人员身份下拉选项
	var searchData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 20,
	};
	// 生成HTML元素
	var createHtml = (function () {
		return {
			// 字符型
			createInput: function (id, name) {
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label text-align-left data-label"><%=name%>:</label>' +
					'<div class="control-element" style="width:200px;">' +
					'<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 200px" autocomplete="off" />' +
					'</div></div>'

				return ufma.htmFormat(html, {
					id: id,
					name: name
				})
			},
			// 数字型
			createNumInput: function (id, name) {
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label text-align-left data-label"><%=name%>:</label>' +
					'<div class="control-element" style="width:200px;">' +
					'<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 200px" autocomplete="off" placeholder="请输入数字"  />' +
					'</div></div>'

				return ufma.htmFormat(html, {
					id: id,
					name: name
				})
			},
			// 日期型
			createDate: function (id, name) {
				var startName = id + 'Start'
				var startId = id + 'Start'
				var endName = id + 'End'
				var endId = id + 'End'
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label text-align-left data-label"><%=name%>:</label>' +
					'<div class="control-element" style="width: 130px !important;">' +
					'<div id="<%=startId%>" name="<%=startId%>" class="uf-datepicker startDate"></div></div>' +
					'<span class="split">-</span>' +
					'<div class="control-element" style="width: 130px !important;">' +
					'<div id="<%=endId%>" name="<%=endId%>" class="uf-datepicker endDate"></div></div></div>'
				return ufma.htmFormat(html, {
					id: id,
					name: name,
					startName: startName,
					startId: startId,
					endName: endName,
					endId: endId
				})
			},
			// 开关
			createRadioGroup: function (id, name, code) {
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label data-label"><%=name%>:</label>' +
					'<div class="control-element"><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-default btn-sm">' +
					'<input type="radio" class="toggle" name="<%=id%>" value="<%=code1%>"/><%=codeName1%></label>' +
					'<label class="btn btn-default btn-sm active">' +
					'<input type="radio" class="toggle" name="<%=id%>" value="<%=code2%>" checked/><%=codeName2%></label>' +
					'</div></div></div>'

				return ufma.htmFormat(html, {
					id: id,
					name: name,
					code1: code[0].valId,
					codeName1: code[0].val,
					code2: code[1].valId,
					codeName2: code[1].val
				})
			},
			// 复选框
			createCheckBox: function (id, name, code) {
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label data-label"><%=name%>:</label>' +
					'<span><label class="mt-checkbox mt-checkbox-outline margin-right-20"><input checked name="<%=id%>" type="checkbox" value="<%=code1%>" /><%=codeName1%><span></span></label>' +
					'<label class="mt-checkbox mt-checkbox-outline margin-right-20"><input checked name="<%=id%>" type="checkbox" value="<%=code2%>" /><%=codeName2%><span></span></label>' +
					'</span></div>'

				return ufma.htmFormat(html, {
					id: id,
					name: name,
					code1: code[0].valId,
					codeName1: code[0].val,
					code2: code[1].valId,
					codeName2: code[1].val
				})
			},
			// 枚举型 引用 多选
			createCombox: function (id, name) {
				var html =
					'<div class="form-group col-xs-10 col-sm-6 col-md-6">' +
					'<label class="control-label data-label"><%=name%>:</label>' +
					'<div class="control-element"><div id="<%=id%>" class="uf-treecombox" idField="code" textField="codeName" leafRequire="true" name="<%=id%>" style="width:200px"></div></div></div>'

				return ufma.htmFormat(html, {
					id: id,
					name: name
				})
			}
		}
	})()

	/** 部门树的回调方法 */
	var treeCallback = (function () {
		return {
			getFontCss: function (treeId, treeNode) {
				return !!treeNode.highlight ? {
					color: '#F04134',
					'font-weight': 'bold'
				} : {
						color: '#333',
						'font-weight': 'normal'
					}
			},
			addHoverDom: function (treeId, treeNode) {
				if (treeNode.id == '0') {
					return;
				}
				var sObj = $('#' + treeNode.tId + '_span')
				if (treeNode.editNameFlag || $('#editBtn_' + treeNode.tId).length > 0) {
					return
				}

				var addStr =
					"<span class='button department-edit btn-permission' id='editBtn_" +
					treeNode.tId +
					"' title='编辑部门信息' onfocus='this.blur();'></span>"
				if (page.isEdit == true) {
					addStr =
						"<span class='button department-edit' id='editBtn_" +
						treeNode.tId +
						"' title='编辑部门信息' onfocus='this.blur();'></span>"
				}

				sObj.after(addStr)
				var btn = $('#editBtn_' + treeNode.tId)
				if (btn)
					btn.bind('click', function (e) {
						e.stopPropagation()
						page.openDepEdit('编辑部门', treeNode)
					})
			},
			removeHoverDom: function (treeId, treeNode) {
				$('#editBtn_' + treeNode.tId)
					.unbind()
					.remove()
			},
			beforeClick: function (treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj('tree')
				zTree.checkNode(treeNode, !treeNode.checked, null, true)
			},
			focusKey: function (e) {
				var key = $('#key')
				if (key.hasClass('empty')) {
					key.removeClass('empty')
				}
			},
			blurKey: function (e) {
				var key = $('#key')
				if (key.get(0).value === '') {
					key.addClass('empty')
				}
			},
			getAllChildrenNodes: function (treeNode, result) {
				if (treeNode.isParent) {
					var childrenNodes = treeNode.children
					if (childrenNodes) {
						for (var i = 0; i < childrenNodes.length; i++) {
							result += ',' + childrenNodes[i].id
							result = treeCallback.getAllChildrenNodes(
								childrenNodes[i],
								result
							)
						}
					}
				}
				return result
			},
			allNodesArr: function () {
				var zTree = $.fn.zTree.getZTreeObj('tree')
				var nodes = zTree.getNodes()
				var allNodesArr = []
				var allNodesStr
				for (var i = 0; i < nodes.length; i++) {
					var result = ''
					var result = treeCallback.getAllChildrenNodes(nodes[i], result)
					var NodesStr = result
					NodesStr = NodesStr.split(',')
					NodesStr.splice(0, 1, nodes[i].id)
					NodesStr = NodesStr.join(',')
					allNodesStr += ',' + NodesStr
				}
				allNodesArr = allNodesStr.split(',')
				allNodesArr.shift()
				return allNodesArr
			},
			updateNodes: function (highlight) {
				var zTree = $.fn.zTree.getZTreeObj('tree')
				for (var i = 0, l = nodeList.length; i < l; i++) {
					nodeList[i].highlight = highlight
					zTree.updateNode(nodeList[i])
				}
			},
			searchNode: function (e) {
				if (e.target.value != '') {
					var zTree = $.fn.zTree.getZTreeObj('tree')
					zTree.expandAll(true)
					var key = $('#key')
					var value = $.trim(key.get(0).value)
					var keyType = 'codeName'

					if (key.hasClass('empty')) {
						value = ''
					}
					if (lastValue === value) return
					lastValue = value
					if (value === '') {
						zTree.expandAll(false)
						return
					}
					treeCallback.updateNodes(false)

					nodeList = zTree.getNodesByParamFuzzy(keyType, value)

					treeCallback.updateNodes(true)

					var NodesArr = treeCallback.allNodesArr()
					if (nodeList.length > 0) {
						var index = NodesArr.indexOf(nodeList[0].id.toString())
						$('#tree').scrollTop(20.2 * index)
					}
				} else {
					$('#tree li a').css({
						color: '#333',
						'font-weight': 'normal'
					})
				}
			}
		}
	})()

	var page = (function () {
		return {
			initAgencyTree: function () {
				//取单位数据
				var arguAge = {
					setYear: svData.svSetYear,
					rgCode: svData.svRgCode
				}
				//根据选择单位改变账套
				ufma.get("/gl/eleAgency/getAgencyTree", arguAge, function (result) {
					page.cbAgency = $("#cbAgency").ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: "请选择单位",
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function (sender, data) {
							page.agencyCode = data.code
							page.agencyName = data.name
							console.log(page.agencyCode)
							page.initTree()
							page.getEmpTYpe()
							//初始化表格
							page.initColumns()
						},
						onComplete: function (sender) {
							$("#cbAgency").getObj().val(svData.svAgencyCode)
							// 初始化时取缓存中记录的行数信息
							searchData.pageSize =
								parseInt(localStorage.getItem("depStaffPageSize")) ? parseInt(localStorage.getItem("depStaffPageSize")) : 20;
							$('.deparmentTree').height($(window).height() - 194)
						}
					});
				});
			},
			// 初始化树
			initTree: function () {
				page.departMentTree = page.departmentTree({
					url: interfaceURL.getPrsOrgTree,
					agencyCode: page.agencyCode,
					checkbox: true
				},
					$('#tree')
				)
				var treeObj = $.fn.zTree.getZTreeObj("tree");
				var nodes = treeObj.getNodesByParam("id", "0", null);
				if (nodes.length > 0) {
					treeObj.expandNode(nodes[0], true, false, true);
				}
			},
			departmentTree: function (setting, $tree) {
				setting.idKey = setting.idKey || 'id'
				setting.pIdKey = setting.pIdKey || 'pId'
				setting.nameKey = setting.nameKey || 'codeName'
				setting.rootName = setting.rootName || ''
				setting.async = setting.async || true

				if (!$tree.hasClass('ufmaTree')) {
					$tree.addClass('ufmaTree')
				}
				if (!$tree.hasClass('ztree')) {
					$tree.addClass('ztree')
				}
				var url = setting.url + '?agencyCode=' + setting.agencyCode
				var treeSetting = {
					async: {
						enable: setting.async,
						type: 'get',
						dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
						contentType: 'application/json; charset=utf-8',
						url: url,
						dataFilter: function (treeId, parentNode, responseData) {
							var data = responseData
							if (responseData.hasOwnProperty('data')) {
								data = responseData.data
							}
							if (!$.isNull(setting.rootName)) {
								var rootNode = {}
								rootNode[setting.idKey] = '0'
								rootNode[setting.nameKey] = setting.rootName
								rootNode['open'] = true
								data.unshift(rootNode)
							}
							if ($.isNull(data)) return false
							for (var i = 0; i < data.length; i++) {
								data[i]['open'] = true
							}
							return data
						}
					},
					view: {
						showLine: false,
						showIcon: false,
						fontCss: treeCallback.getFontCss,
						addHoverDom: treeCallback.addHoverDom,
						removeHoverDom: treeCallback.removeHoverDom
					},
					check: {
						/*chkboxType: {
							"Y": "s",
							"N": "s"
						},*/
						enable: (function () {
							if (setting.checkbox) return setting.checkbox
							else return false
						})()
					},
					data: {
						simpleData: {
							enable: true,
							idKey: setting.idKey,
							pIdKey: setting.pIdKey,
							rootPId: 0
						},

						key: {
							name: setting.nameKey
						},

						keep: {
							leaf: true
						}
					},
					callback: {
						beforeClick: treeCallback.beforeClick,
						onCheck: page.setTableData
					}
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode
				}

				$(document).ready(function () {
					var key = $('#key')
					key
						.bind('focus', treeCallback.focusKey)
						.bind('blur', treeCallback.blurKey)
						.bind('propertychange', treeCallback.searchNode)
						.bind('input', treeCallback.searchNode)
				})

				if (setting.hasOwnProperty('url') && !$.isNull(url)) {
					ufma.ajaxDef(url, 'get', '', function (result) {
						setting.data = result.data || []
						setting.data.push({
							name: '全部',
							codeName: '全部',
							id: '0',
							pId: null
						})
					})
				}
				if (page.$tree) {
					page.$tree.destroy()
				}
				page.$tree = $.fn.zTree.init($tree, treeSetting, setting.data || [])
				return page.$tree
			},
			// 获取部门树勾选中的节点code
			getCheckedCodes: function () {
				var checkNodes = page.departMentTree.getCheckedNodes(true)
				var selectNodes = []
				for (var i = 0; i < checkNodes.length; i++) {
					var node = checkNodes[i]
					if (!node.isParent && node.pId !== 0) {
						selectNodes.push(node.code)
					}
				}
				return selectNodes
			},
			// 部门删除
			deleteDepartMent: function () {
				var selectNodes = page.getCheckedCodes()
				if (selectNodes.length == 0) {
					ufma.showTip('请选择要删除的部门!', function () { }, 'warning')
					return false
				}
				var callback = function (result) {
					ufma.showTip(result.msg, function () { }, result.flag)
					page.initTree()
					page.setTableData()
				}
				var argu = {
					orgCodes: selectNodes
				}
				ufma.post(interfaceURL.delete, argu, callback)
			},
			// 部门启用
			startDepartMent: function () {
				var checkNodes = page.departMentTree.getCheckedNodes(true)
				var selectNodes = []
				for (var i = 0; i < checkNodes.length; i++) {
					var node = checkNodes[i]
					if (node.pId !== 0) {
						selectNodes.push(node.code)
					}
				}
				if (selectNodes.length == 0) {
					ufma.showTip('请选择启用部门!', function () { }, 'warning')
					return false
				}
				var callback = function (result) {
					ufma.showTip(result.msg, function () { }, result.flag)
					page.initTree()
					page.setTableData()
				}
				var argu = {
					action: 'active',
					orgCode: selectNodes,
					agencyCode: page.agencyCode,
					rgCode: svData.svRgCode,
					setYear: svData.svSetYear
				}
				ufma.post(interfaceURL.able, argu, callback)
			},
			// 部门停用
			stopDepartMent: function () {
				var checkNodes = page.departMentTree.getCheckedNodes(true)
				var selectNodes = []
				for (var i = 0; i < checkNodes.length; i++) {
					var node = checkNodes[i]
					if (node.pId !== 0) {
						selectNodes.push(node.code)
					}
				}
				if (selectNodes.length == 0) {
					ufma.showTip('请选择启用部门!', function () { }, 'warning')
					return false
				}
				var callback = function (result) {
					ufma.showTip(result.msg, function () { }, result.flag)
					page.initTree()
					page.setTableData()
				}
				var argu = {
					action: 'unactive',
					orgCode: selectNodes,
					agencyCode: page.agencyCode,
					rgCode: svData.svRgCode,
					setYear: svData.svSetYear
				}
				ufma.post(interfaceURL.able, argu, callback)
			},
			// 打开编辑部门模态框
			openDepEdit: function (title, data) {
				var treeObj = $.fn.zTree.getZTreeObj('tree')
				var nodes = treeObj.transformToArray(treeObj.getNodes());
				var codeArray = []
				for (var i = 0; i < nodes.length; i++) {
					codeArray.push(nodes[i].id)
				}
				var openData = {
					depData: data,
					isUpdate: data ? true : false,
					codeArray: codeArray,
					agencyCode: page.agencyCode
				}
				ufma.open({
					url: 'departmentEdit.html',
					title: title,
					width: 720,
					height: 460,
					data: openData,
					ondestory: function (data) {
						//窗口关闭时回传的值
						if (data.action) {
							ufma.showTip(data.msg, function () { }, 'success')
						}
						page.initTree()
						page.setTableData()
					}
				})
			},
			createClassNameHtml: function (htmlArray, type) {
				var classNameHtml = '',
					htmls = [];
				// 每两个form-group添加一个clearfix
				for (var i = 0, len = htmlArray.length; i < len; i += 2) {
					htmls.push(htmlArray.slice(i, i + 2))
				}
				//htmls二维数组 数组每个元素是两个dom标签 再补充一个清除浮动标签
				for (var i = 0; i < htmls.length; i++) {
					var item = htmls[i];
					if (type === 'queryMoreHtml') {
						item.unshift('<div class="form-row margin-top-10">');
					} else {
						item.unshift('<div class="form-row">');
					}
					item.push('<div class="clearfix"></div></div>');
				}
				htmls = [].concat.apply([], htmls);
				classNameHtml = htmls.join('');
				return classNameHtml
			},
			// 初始化查询条件
			initQuery: function (propertyInList, propertyListData, prsLevelList) {
				page.checkBox = [] // 复选框类型
				page.combox = [] // 下拉选项类型
				page.numInput = [] // 数字类型
				page.charNum = [] // 字符数字类
				page.dateInput = [] // 日期类型
				var htmlArray = []
				var frmQueryHtml = ''
				var queryMoreHtml = ''
				for (var i = 0; i < propertyInList.length; i++) {
					// 是否是查询条件
					if (propertyInList[i].IS_CONDITION === 'y') {
						for (var j = 0; j < propertyListData.length; j++) {
							var item = propertyListData[j]
							if (item.data.length !== 0 && item.ordIndex !== '*') {
								for (var m = 0; m < item.data.length; m++) {
									var id = item.data[m].propertyCode
									var name = item.data[m].propertyName
									if (id === propertyInList[i].PROPERTY_CODE) {
										if (
											item.data[m].dataType === 'E' ||
											item.data[m].dataType === 'R' ||
											item.data[m].dataType === 'X'
										) {
											// 开关样式
											if (
												item.data[m].asValList &&
												item.data[m].asValList.length === 2
											) {
												htmlArray.push(
													createHtml.createCheckBox(
														id,
														name,
														item.data[m].asValList
													)
												)
												page.checkBox.push({
													id: id,
													name: name
												})
											} else {
												htmlArray.push(createHtml.createCombox(id, name))
												page.combox.push({
													id: id,
													name: name,
													asValList: item.data[m].asValList ?
														item.data[m].asValList : [],
													posiLevelList: item.data[m].posiLevelList ?
														item.data[m].posiLevelList : []
												})
											}
										} else if (item.data[m].dataType === 'N') {
											htmlArray.push(createHtml.createNumInput(id, name))
											page.numInput.push(id)
											page.charNum.push({
												id: id,
												name: name
											})
										} else if (item.data[m].dataType === 'D') {
											htmlArray.push(createHtml.createDate(id, name))
											page.dateInput.push(id)
										} else {
											htmlArray.push(createHtml.createInput(id, name))
											page.charNum.push({
												id: id,
												name: name
											})
										}
									}
								}
							}
						}
					}
				}
				htmlArray.push(
					createHtml.createCheckBox(
						"isEmpty",
						"必填项为空",
						[{ valId: "Y", val: "是" }, { valId: "N", val: "否" }]
					)
				)
				page.checkBox.push({
					id: "isEmpty",
					name: "必填项为空"
				})
				frmQueryHtml += page.createClassNameHtml(htmlArray.slice(0, 2), 'frmQueryHtml')
				queryMoreHtml += page.createClassNameHtml(htmlArray.slice(2), 'queryMoreHtml')
				$('#frmQuery').html(frmQueryHtml)
				$('#queryMore').html(queryMoreHtml)
				for (var i = 0; i < page.checkBox.length; i++) {
					;
					(function (i) {
						var id = page.checkBox[i].id
						// 复选框必须选中一个
						var query = "input[name='" + id + "']"
						$(query).on('click', function () {
							var checked = $(query + ':checked')
							if (checked.length === 0) {
								$(this).prop('checked', true)
							}
						})
					})(i)
				}
				for (var i = 0; i < page.combox.length; i++) {
					var id = page.combox[i].id
					var name = page.combox[i].name
					var asValList = page.combox[i].asValList
					var posiLevelList = page.combox[i].posiLevelList
					if (posiLevelList.length !== 0) {
						$('#' + id).ufTreecombox({
							idField: 'dutyCode',
							textField: 'dutyName',
							pIdField: 'pCode', //可选
							placeholder: '请选择' + name,
							data: posiLevelList,
							leafRequire: true,
							readonly: false,
							onChange: function (e, data) { },
							onComplete: function (sender, data) { }
						})
					} else {
						if (id === 'typeCode') {
							$('#typeCode').ufTextboxlist({
								autocomplete: 'off',
								idField: 'typeCode',
								textField: 'val',
								pIdField: 'pCode', //可选
								placeholder: '请选择人员身份',
								data: asValList,
								// leafRequire: true,
								readonly: false
							})
						} else {
							$('#' + id).ufTreecombox({
								idField: 'valId',
								textField: 'val',
								pIdField: 'pCode', //可选
								placeholder: '请选择' + name,
								data: asValList,
								leafRequire: true,
								readonly: false,
								onChange: function (sender, data) { },
								onComplete: function (sender, data) { }
							})
						}

					}
				}
				for (var i = 0; i < page.numInput.length; i++) {
					var id = page.numInput[i]
					// 数字类型需要处理
					$('#' + id).numberInput()
				}
				for (var i = 0; i < page.dateInput.length; i++) {
					var id = page.dateInput[i]
					//绑定日历控件
					$('#' + id + 'Start').ufDatepicker({
						format: 'yyyy-mm-dd',
						initialDate: ''
					})
					$('#' + id + 'Start')
						.getObj()
						.setValue('')
					$('#' + id + 'End').ufDatepicker({
						format: 'yyyy-mm-dd',
						initialDate: ''
					})
					$('#' + id + 'End')
						.getObj()
						.setValue('')
				}
			},
			// 初始化表格列
			initColumns: function () {
				ufma.get(interfaceURL.getPropertyInList, '', function (result) {
					if (result.flag == 'fail') {
						ufma.showTip(result.msg, function () { }, 'warning')
					} else if (result.flag == 'success') {
						var propertyInList = result.data
						page.columns = page.setColumns(result.data)
						var checkNodes = page.departMentTree.getCheckedNodes(true)
						var selectNodes = []
						for (var i = 0; i < checkNodes.length; i++) {
							var node = checkNodes[i]
							if (node.pId !== 0) {
								selectNodes.push(node.code)
							}
						}
						var argu = {
							orgCodeList: selectNodes,
							agencyCode: page.agencyCode,
							rgCode: svData.svRgCode,
							setYear: svData.svSetYear
						}
						// 修改为后端分页
						pageLength = ufma.dtPageLength('#dep-staff-info-table');
						argu.pageNum = parseInt(searchData.currentPage);
						argu.pageSize = parseInt(searchData.pageSize) ? parseInt(searchData.pageSize) : 99999999; // 没有值时查全部
						//查询后记录当前选择的行数信息到缓存
						localStorage.removeItem("depStaffPageSize");
						localStorage.setItem("depStaffPageSize", argu.pageSize);
						ufma.showloading('正在加载数据请耐心等待...')
						ufma.post(interfaceURL.getMaEmpByOrgCodes, argu, function (result) {
							if (result.flag == 'fail') {
								ufma.hideloading()
								ufma.showTip(result.msg, function () { }, 'warning')
							} else if (result.flag == 'success') {
								var tableData = result.data.page.list
								page.tableData = result.data
								ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function (
									result
								) {
									if (result.flag == 'fail') {
										ufma.hideloading()
										ufma.showTip(result.msg, function () { }, 'warning')
									} else if (result.flag == 'success') {
										var propertyListData = result.data
										var argu = {
											agencyCode: page.agencyCode,
											setYear: svData.svSetYear,
											rgCode: svData.svRgCode,
										};
										ufma.get(interfaceURL.getEmpTYpe, argu, function (result) {
											typeCodeList = [];
											result.data.forEach(function (item) {
												var obj = {
													valId: item.chrCode,
													val: item.chrName,
													typeCode: item.chrCode,
													pCode: item.parentCode
												}
												for (var prop in item) {
													obj[prop] = item[prop]
												}
												typeCodeList.push(obj)
											})
											// typeCodeList = result.data;

											propertyInList.unshift({
												PROPERTY_CODE: "typeCode",
												IS_CONDITION: "y",
												PROPERTY_NAME: "人员身份"
											})
											propertyListData[0].data.unshift({
												dataType: "E",
												isEmpty: "N",
												isEdit: "Y",
												ordIndex: "0",
												propertyCode: "typeCode",
												propertyName: "人员身份",
												asValList: typeCodeList
											})
											var prsLevelList = [];
											page.initQuery(
												propertyInList,
												propertyListData,
												prsLevelList
											)
											var data = page.transformTableData(
												tableData,
												propertyListData,
												result.data
											)
											// 所有表格数据
											page.allTableData = data
											page.initTable(data, page.columns)
											ufma.hideloading()
										});
									}
								})
							}
						})
					}
				})
			},
			// 表格列定义
			setColumns: function (data) {
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
						'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
					className: 'nowrap check-style no-print',
					render: function (data, type, rowdata, meta) {
						return (
							'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="checkboxes check-all" data-step="' + rowdata.userId + '" data-code="' + rowdata.empCode + '" data-id="' +
							rowdata.rmwyid +
							'" />' +
							'&nbsp;<span></span></label>'
						)
					}
				},
				{
					title: '操作',
					className: 'nowrap minW no-print',
					data: 'userId',
					width: 120,
					render: function (data, type, rowdata, meta) {
						var newRowData = JSON.stringify(rowdata);
						var sameStep = rowdata.userId ? 'hidden' : '';
						return (
							'<a class="btn btn-icon-only btn-edit btn-permission" data-id="' +
							rowdata.rmwyid +
							'"' +
							'data-code="' +
							rowdata.empCode +
							'" data-rowdata=\'' +
							newRowData +
							"'" +
							'" data-toggle="tooltip" action= "" title="编辑">' +
							'<span class="glyphicon icon-edit"></span></a>' +
							'<a class="btn btn-icon-only btn-delete btn-permission" data-id="' + rowdata.rmwyid + '" data-step="' + rowdata.userId + '" data-toggle="tooltip" action= "" title="删除">' +
							'<span class="glyphicon icon-trash"></span></a>' +
							'<a class="btn btn-icon-only btn-sm btn-permission btn-sameStep"' + sameStep + ' chrCode="' + rowdata.empCode + '" data-toggle="tooltip" title="同步">' +
							'<span class="glyphicon glyphicon icon-replace-t"></span></a>'
						)
					}
				},
				{
					title: '部门名称',
					data: 'orgName',
					className: 'isprint nowrap ellipsis',
					render: function (data, type, rowdata, meta) {
						if (!data) {
							return ''
						}
						return data
					}
				},
				{
					title: '人员身份',
					data: 'typeCode',
					className: 'isprint nowrap',
					render: function (data, type, rowdata, meta) {
						if (!data) {
							return ''
						}
						return data
					}
				}
				]
				for (var i = 0; i < data.length; i++) {
					var propertyName = data[i].PROPERTY_NAME
					var propertyCode = data[i].PROPERTY_CODE
					if (propertyCode === 'empName') {
						columns.push({
							title: propertyName,
							data: propertyCode,
							className: 'isprint nowrap ellipsis',
							render: function (data, type, rowdata, meta) {
								if (!data) {
									return ''
								}
								var newRowData = JSON.stringify(rowdata)
								//此问题修改，当数据宽度增加很大，不自动撑开列宽，改为下面写法，不要给这个查看走权限了，如果不能保存，点开也是没有保存按钮 不影响 guohx 20200616
								return "<a class='btn-edit  common-jump-link' data-id='" +
									rowdata.rmwyid + "' data-code='" + rowdata.empCode + "' data-rowdata='" + newRowData + "'>" + data + "</a>"
							}
						})
					} else {
						columns.push({
							title: propertyName,
							data: propertyCode,
							className: 'isprint nowrap ellipsis',
							render: function (data, type, rowdata, meta) {
								if (!data) {
									return ''
								}
								return data
							}
						})
					}
				}
				return columns
			},
			// 初始化表格
			initTable: function (data, columns) {
				var id = 'dep-staff-info-table'
				var toolBar = $('#' + id).attr('tool-bar')
				page.DataTable = $('#' + id).DataTable({
					language: {
						url: bootPath + 'agla-trd/datatables/datatable.default.js'
					},
					data: data,
					fixedHeader: true,
					scrollY: page.getScrollY(),
					scrollX: true,
					fixedColumns: {
						leftColumns: 2
					},
					searching: true,
					bFilter: false, //去掉搜索框
					bLengthChange: true, //去掉每页显示多少条数据
					processing: true, //显示正在加载中
					// pagingType: 'full_numbers', //分页样式
					// lengthChange: true, //是否允许用户自定义显示数量p
					// lengthMenu: [
					// 	[25, 50, 100, -1],
					// 	[25, 50, 100, '全部']
					// ],
					// pageLength: pageLength,
					paging: false,
					bInfo: true, //页脚信息
					bSort: false, //排序功能
					bAutoWidth: true, //表格自定义宽度，和swidth一起用
					bProcessing: true,
					bDestroy: true,
					columns: columns,
					dom: '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (win) {
							$(win.document.body)
								.find('h1')
								.css('text-align', 'center')
							$(win.document.body).css('height', 'auto')
						}
					},
					{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml']
						}
					}
					],
					initComplete: function (settings, json) {
						//打印&导出按钮
						$('.datatable-toolbar').appendTo('#dtToolbar')
						$('.datatable-toolbar .buttons-print')
							.addClass('btn-print btn-permission')
							.attr({
								'data-toggle': 'tooltip',
								title: '打印'
							})
						$('.datatable-toolbar .buttons-excel')
							.addClass('btn-export btn-permission')
							.attr({
								'data-toggle': 'tooltip',
								title: '导出'
							})

						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info')
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo(
								$(toolBar + ' .tool-bar-body')
							)
						}
						$info.html('')
						$('.' + id + '-paginate').appendTo($info)

						//导出begin
						$('#dtToolbar .buttons-excel')
							.off()
							.on('click', function (evt) {
								// evt = evt || window.event
								// evt.preventDefault()
								// ufma.expXLSForDatatable($('#' + id), '部门人员信息')
								uf.expTable({
									title: '部门人员信息',
									exportTable: '#' + id,
									topInfo: '',
									bottomInfo: []
								});
							})
						//导出end
						//权限控制
						ufma.isShow(page.reslist)
						$('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
						$('#tool-bar').width($('.prs-workspace').width() - 230)
						$('#tool-bar .slider').width($('.prs-workspace').width() - 250)
						$('#tool-bar').css('margin-left', '250px')
						$('#tool-bar').css('padding-right', '9px')
						$("#checkAll,.datatable-group-checkable").on("click", function () {
							if ($(this).prop("checked") === true) {
								$("#checkAll,.datatable-group-checkable").prop("checked", $(this).prop("checked"));
								// page.depTable.find("input[name='checkList']").prop("checked", $(this).prop("checked"));
								// page.depTable.find("tbody tr").addClass("selected");
							} else {
								$("#checkAll,.datatable-group-checkable").prop("checked", false);
								// page.depTable.find("input[name='checkList']").prop("checked", false);
								// page.depTable.find("tbody tr").removeClass("selected");
							}
						});
						ufma.setBarPos($(window))
						//驻底end
					},
					drawCallback: function (settings) {
						$('#dep-staff-info-table').find('td.dataTables_empty').text('').append(
							'<img src="' +
							bootPath +
							'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
						)
						//checkbox的全选操作
						$('.datatable-group-checkable').on('click', function () { //CWYXM-8979--zsj--全选
							var isCorrect = $(this).is(':checked')
							$('#' + id + ' tbody tr').find('.checkboxes').each(function () {
								isCorrect ? $(this).prop('checked', !0) : $(this).prop('checked', !1)
								isCorrect ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected')
							})
							$('.DTFC_LeftBodyLiner tbody tr').find('.checkboxes').each(function () {
								isCorrect ? $(this).prop('checked', !0) : $(this).prop('checked', !1)
								isCorrect ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected')
							})
							$('.datatable-group-checkable').prop('checked', isCorrect)
						})

						// sunch 2020-08-27【CWYXM-19649】 部门人员信息界面出现多个滚动条
						setTimeout(function () {
							$('.DTFC_LeftBodyLiner').css({ 'overflow-x': 'hidden', 'width': 'auto' })
							$('.DTFC_LeftBodyLiner').addClass('hideScroll')
							$('.DTFC_LeftBodyLiner .dataTables_empty').css({ 'border-bottom': '0' })
						}, 24)

						//权限控制
						ufma.isShow(page.reslist)
						// 修改为后端分页
						$("#dep-staff-info .ufma-table-paginate").empty();
						if (!$.isNull(page.tableData)) {
							var paging = page.tableData.page; //此全局变量为后端返回的分页的相关信息
						}
						// 分页部分功能 -- B
						// 分页 不分页需判断
						if (!$.isNull(paging)) {
							if (paging.pageSize != 0) {
								//创建基本分页节点
								var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>')
								//创建上一页节点 根据当前也判断是否可以点
								var $pagePrev
								if (paging.pageNum - 1 == 0) {
									$pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>')
								} else {
									$pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.pageNum - 1) + '>' + '<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' + '</a></li>')
								}
								$pageBase.append($pagePrev)
								//创建页数节点,根据pageSize和凭证数据总数
								//创建页数变量
								var pageAmount = paging.pages
								var $pageItem
								for (var k = 1; k <= pageAmount; k++) {
									//第一页和最后一页显示
									if (k == 1 || k == pageAmount) {
										//三元运算判断是否当前页
										$pageItem = k == paging.pageNum ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>')
									} else {
										//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
										if (pageAmount - 2 <= 3) {
											//三元运算判断是否当前页
											$pageItem = k == paging.pageNum ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>')
										} else if (pageAmount - 2 > 3) {
											//判断当前页位置
											if (paging.pageNum <= 2) {
												//分页按钮加载2到4之间
												if (k >= 2 && k <= 4) {
													//三元运算判断是否当前页
													$pageItem = k == paging.pageNum ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>')
												}
											} else if (paging.pageNum > 2 && paging.pageNum < pageAmount - 1) {
												//分页按钮加载pageNum-1到pageNum+1之间
												if (k >= paging.pageNum - 1 && k <= paging.pageNum + 1) {
													//三元运算判断是否当前页
													$pageItem = k == paging.pageNum ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>')
												}
											} else if (paging.pageNum >= pageAmount - 1) {
												//分页按钮加载pageAmount-3到pageAmount-1之间
												if (k >= pageAmount - 3 && k <= pageAmount - 1) {
													//三元运算判断是否当前页
													$pageItem = k == paging.pageNum ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>')
												}
											}
										}
									}
									$pageBase.append($pageItem)
								}
								//创建下一页节点 根据当前页判断是否可以点
								var $pageNext
								if (pageAmount - paging.pageNum == 0) {
									$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>')
								} else {
									$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.pageNum + 1) + '>' + '<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' + '</a></li>')
								}
								$pageBase.append($pageNext)
								$('#dep-staff-info .ufma-table-paginate').html($pageBase)
							}
							//创建分页大小基本节点
							var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>')
							var $pageSel = $('<select class="vbPageSize bordered-input"></select>')
							//根据pageSize创建下拉列表
							//分页数组
							var pageArr = [20, 50, 100, 200, '全部']
							var $pageOp
							//定义是否不分页变量
							var isNoPaging
							for (var n = 0; n < pageArr.length; n++) {
								isNoPaging = pageArr[n] == 0 ? '全部' : pageArr[n]
								if (pageArr[n] == searchData.pageSize) {
									$pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>')
								} else {
									$pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>')
								}
								$pageSel.append($pageOp)
							}
							$pageSizeBase.append('<span>显示 </span>')
							$pageSizeBase.append($pageSel)
							$pageSizeBase.append('<span> 条</span>')
							$('#dep-staff-info .ufma-table-paginate').prepend($pageSizeBase)
							//创建总数统计节点
							var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + paging.total + '</span> 条</div>')
							$('#dep-staff-info .ufma-table-paginate').prepend($vouDataSum)
						}
						ufma.setBarPos($(window))
					}
				})
			},
			// 计算表格的高度
			getScrollY: function () {
				var $bar = $('.ufma-tool-bar');
				var winH = $(window).height();
				var barH = $bar.outerHeight(true);
				return winH - barH - 56 - 78 - 30 - 40 - 30 + 'px'
			},
			// 转换表格数据
			transformTableData: function (
				tableData,
				propertyListData,
				getPrsLevelList
			) {
				var obj = {}
				for (var i = 0; i < propertyListData.length; i++) {
					var item = propertyListData[i]
					if (item.data.length !== 0 && item.ordIndex !== '*') {
						for (var j = 0; j < item.data.length; j++) {
							if (
								item.data[j].dataType === 'E' ||
								item.data[j].dataType === 'R' ||
								item.data[j].dataType === 'X'
							) {
								if (item.data[j].asValList) {
									obj[item.data[j].propertyCode] = item.data[j].asValList
								} else if (item.data[j].posiLevelList) {
									//obj[item.data[j].propertyCode] = item.data[j].posiLevelList
								} else {
									obj[item.data[j].propertyCode] = []
								}
							}
						}
					}
				}
				//obj.posiCode = getPrsLevelList

				for (var i = 0; i < tableData.length; i++) {
					var item = tableData[i]
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							var element = obj[key]
							var code = item[key]
							for (var j = 0; j < element.length; j++) {
								if (code == element[j].valId) {
									item[key] = element[j].val
								}
							}
						}
					}
					// 部门名称单独处理
					var treeObj = $.fn.zTree.getZTreeObj('tree')
					var nodes = treeObj.transformToArray(treeObj.getNodes())
					for (var index = 0; index < nodes.length; index++) {
						if (item.orgCode === nodes[index].code) {
							item.orgName = nodes[index].name
						}
					}
				}
				return tableData
			},
			cancelCheckAll: function () {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
			},
			// 设置表格数据
			setTableData: function () {
				var checkNodes = page.departMentTree.getCheckedNodes(true)
				var selectNodes = []
				for (var i = 0; i < checkNodes.length; i++) {
					var node = checkNodes[i]
					if (node.pId !== 0) {
						selectNodes.push(node.code)
					}
				}
				var queryData = $('#frmQuery').serializeObject()
				var typeCodeData = [];
				var strs = new Array(); //定义一数组
				strs = queryData.typeCode.split(","); //字符分割
				for (i = 0; i < strs.length; i++) {
					if (strs[i] != '') {
						typeCodeData.push(strs[i]);
					}
				}
				var moreQueryData = $('#queryMore').serializeObject()
				var startDate = '', endDate = ''
				if ($('.startDate').length > 0) {
					startDate = $('.startDate').getObj().getValue();
				}
				if ($('.endDate').length > 0) {
					endDate = $('.endDate').getObj().getValue();
				}
				var argu = {
					orgCodeList: selectNodes,
					agencyCode: page.agencyCode,
					rgCode: svData.svRgCode,
					setYear: svData.svSetYear
				}
				// 复选框数据
				// 都勾选传空字符串
				for (var i = 0; i < page.checkBox.length; i++) {
					var id = page.checkBox[i].id
					var query = "#frmQuery input[name='" + id + "']"
					var length = 0
					$(query + ':checked').each(function (value) {
						queryData[id] = this.value
						length += 1
					})
					if (queryData[id]) {
						queryData[id] = length !== 2 ? queryData[id] : ''
					}
				}
				for (var i = 0; i < page.checkBox.length; i++) {
					var id = page.checkBox[i].id
					var query = "#queryMore input[name='" + id + "']"
					var length = 0
					$(query + ':checked').each(function (value) {
						moreQueryData[id] = this.value
						length += 1
					})
					if (moreQueryData[id]) {
						moreQueryData[id] =
							moreQueryData[id] && length !== 2 ? moreQueryData[id] : ''
					}
				}
				if (startDate) {
					moreQueryData.birthdayStart = startDate;
				}
				if (endDate) {
					moreQueryData.birthdayEnd = endDate;
				}
				var birthdayStart = moreQueryData.birthdayStart;
				var birthdayEnd = moreQueryData.birthdayEnd;
				if ($.isNull(birthdayStart) && !$.isNull(birthdayEnd)) {
					ufma.showTip('日期区间不正确！', function () { }, 'warning');
					return;
				}
				if ($.isNull(birthdayEnd) && !$.isNull(birthdayStart)) {
					ufma.showTip('日期区间不正确！', function () { }, 'warning');
					return;
				}

				argu = $.extend({}, argu, queryData, moreQueryData)
				argu.typeCode = typeCodeData
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#dep-staff-info-table');
				argu.pageNum = parseInt(searchData.currentPage);
				argu.pageSize = parseInt(searchData.pageSize) ? parseInt(searchData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("depStaffPageSize");
				localStorage.setItem("depStaffPageSize", argu.pageSize);
				ufma.showloading('正在加载数据请耐心等待...')
				ufma.post(interfaceURL.getMaEmpByOrgCodes, argu, function (result) {
					if (result.flag == 'fail') {
						ufma.hideloading()
						ufma.showTip(result.msg, function () { }, 'warning')
					} else if (result.flag == 'success') {
						var tableData = result.data.page.list
						page.tableData = result.data
						ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function (
							result
						) {
							if (result.flag == 'fail') {
								ufma.hideloading()
								ufma.showTip(result.msg, function () { }, 'warning')
							} else if (result.flag == 'success') {
								var propertyListData = result.data;
								propertyListData[0].data.unshift({
									dataType: "E",
									isEmpty: "N",
									isEdit: "Y",
									ordIndex: "0",
									propertyCode: "typeCode",
									propertyName: "人员身份",
									asValList: typeCodeList
								})
								var data = page.transformTableData(
									tableData,
									propertyListData, []
								)
								//顺序号主要取自page.allTableData数组最后一位的值orderIndex，在编辑后重新查询表格数据后重置page.allTableData的值
								page.allTableData = data;
								page.DataTable.clear().draw()
								if (data.length > 0) {
									page.DataTable.rows.add(data)
									page.DataTable.columns.adjust().draw()
								}
								ufma.setBarPos($(window))
								page.cancelCheckAll()
								ufma.hideloading()
							}
						})
					}
				})
			},
			// 删除传参
			delArgu: function (ele) {
				var argu = {
					rmwyidList: []
				}
				if (ele[0].id === 'tool-bar-del') {
					var checks = $('input.checkboxes:checked')
					argu.rmwyidList = [];
					checks.each(function () {
						var id = $(this).attr('data-id');
						var stepFlag = $(this).attr('data-step');
						//如果人员userId不为空
						if (!$.isNull(stepFlag)) {
							page.sameStepType = true;
						}
						argu.rmwyidList.push(id)
					})
				} else if (ele[0].id === 'tool-bar-sync') {
					var checks = $('input.checkboxes:checked')
					argu.rmwyidList = [];
					checks.each(function () {
						var chrCode = $(this).attr('data-code');
						var stepFlag = $(this).attr('data-step');
						console.log(stepFlag)
						//如果人员userId不为空 也就是同步按钮不显示时
						if (!$.isNull(stepFlag)) {
							page.sameStepType = true;
						} else {//userId为空 同步按钮不显示时
							argu.rmwyidList.push(chrCode)
						}
					})
				} else {
					var stepFlag = ele.attr('data-step');
					if (!$.isNull(stepFlag)) {
						page.sameStepType = true;
					}
					argu.rmwyidList.push(ele.attr('data-id'))
				}
				return argu
			},
			/**
			 * 删除
			 * @param {jQuery Object} ele
			 * @param {Boolean} flag true:批量删除 false: 单行删除
			 */
			delValues: function (ele, flag) {
				page.delArgu(ele);
				var checks = $('input.checkboxes:checked')
				if (flag && checks.length == 0) {
					ufma.showTip('请选择要删除的数据', function () { }, 'warning')
					return false
				}
				var info = '';
				info = flag ?
					'您确定要删除选中的数据吗？' :
					'您确定要删除当前行的数据吗？'
				ufma.confirm(
					info,
					function (action) {
						if (action) {
							var sameInfo = '';
							if (page.sameStepType == true) {
								sameInfo = flag ?
									'已选数据中包含已同步数据，是否停用关联登录用户？' :
									'是否停用关联登录用户？'
								ufma.confirm(sameInfo, function (action) {
									if (action) {
										//点击确定的回调函数
										var argu = page.delArgu(ele);
										argu.agencyCode = page.agencyCode;
										argu.rgCode = svData.svRgCode;
										argu.setYear = svData.svSetYear;
										if (page.sameStepType == true) {
											argu.ableUser = "1";
										}
										ufma.showloading('数据删除中，请耐心等待...')
										ufma.post(interfaceURL.delMaEmp, argu, function (result) {
											ufma.hideloading()
											page.setTableData()
											ufma.showTip(result.msg, function () { }, result.flag)
										})
									} else {
										//点击取消的回调函数
										if (page.sameStepType == true) {
											var argu = page.delArgu(ele);
											argu.agencyCode = page.agencyCode;
											argu.rgCode = svData.svRgCode;
											argu.setYear = svData.svSetYear;
											argu.ableUser = "0";
											ufma.showloading('数据删除中，请耐心等待...');
											ufma.post(interfaceURL.delMaEmp, argu, function (result) {
												ufma.hideloading()
												page.setTableData()
												ufma.showTip(result.msg, function () { }, result.flag)
											})
										}
									}
								}, { type: 'warning' });
							} else {
								var argu = page.delArgu(ele);
								argu.agencyCode = page.agencyCode;
								argu.rgCode = svData.svRgCode;
								argu.setYear = svData.svSetYear;
								argu.ableUser = "0";
								ufma.showloading('数据删除中，请耐心等待...');
								ufma.post(interfaceURL.delMaEmp, argu, function (result) {
									ufma.hideloading()
									page.setTableData()
									ufma.showTip(result.msg, function () { }, result.flag)
								})
							}
						}
					}, {
					type: 'warning'
				}
				)
			},
			/**
			 * 同步
			 * @param {jQuery Object} ele
			 * @param {Boolean} flag true:批量同步 false: 单行同步
			 */
			sameStep: function (ele, flag) {
				var chrCodes = page.delArgu(ele).rmwyidList
				if (flag && chrCodes.length == 0) {
					ufma.showTip('未选择数据或选择的行不可同步！', function () { }, 'warning')
					return false
				}
				var info = '';
				info = flag ?
					'您确定同步增加当前选中的人员吗？' :
					'您确定同步增加当前人员吗？'
				ufma.confirm(
					info,
					function (action) {
						if (action) {
							//点击确定的回调函数
							var argu = {
								agencyCode: page.agencyCode,
								rgCode: svData.svRgCode,
								setYear: svData.svSetYear,
								acctCode: svData.svAcctCode,
							}
							if (flag) {
								argu.chrCodes = chrCodes
							} else {
								argu.chrCode = $(ele).attr('chrCode')
							}
							ufma.showloading('正在加载数据请耐心等待...')
							ufma.post(interfaceURL.sameStepUrl, argu, function (result) {
								ufma.hideloading()
								page.setTableData()
								ufma.showTip(result.msg, function () { }, result.flag)
							})
						} else {
							//点击取消的回调函数
						}
					}, {
					type: 'warning'
				}
				)
			},
			// 打开弹窗
			openWin: function (ele) {
				var title, openData
				var treeObj = $.fn.zTree.getZTreeObj('tree')
				var nodes = treeObj.transformToArray(treeObj.getNodes())
				var tableData = page.allTableData
				var allEmpCodes = []
				var rmwyidList = []
				// CWYXM-8266
				// [部门人员信息]新增人员时，“顺序号”要自动递增。现在是只要修改过已有人员的顺序号后，再新建人员，顺序号就不递增了
				// 如过编辑了人员 表格数据会有变化，重新取一次表格数据
				var maxOrdIndex = 0;
				//CWYXM-20582 新增人员时，界面的“排序号”需要自动递增，但是现在取的是当前分页列表中的最大值，应该取全部数据的最大值 guohx  改为从后端接口中获取 20200928
				var argu = {
					agencyCode: page.agencyCode,
					setYear: svData.svSetYear,
					rgCode: svData.svRgCode
				};
				ufma.ajaxDef('/ma/emp/maEmp/selectMaxOrder', 'get', argu, function (result) {
					maxOrdIndex = result.data
				})
				for (var i = 0; i < tableData.length; i++) {
					allEmpCodes.push(tableData[i].empCode)
				}
				var checks = $('input.checkboxes:checked');
				checks.each(function () {
					var id = $(this).attr('data-id')
					rmwyidList.push(id)
				})

				if (ele[0].id == 'btn-add-dep-staff-info') {
					title = '新增人员'
					openData = {
						orgCodeList: nodes,
						maxOrdIndex: maxOrdIndex,
						allEmpCodes: allEmpCodes,
						action: "add",
						agencyCode: page.agencyCode
					}
					ufma.open({
						url: 'addStaff.html',
						title: title,
						width: 1200,
						height: 600,
						data: openData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							if (data.action) {
								ufma.showTip(data.msg, function () { }, 'success')
							}
							//关闭弹窗之后 需要重新加载表格数据
							page.setTableData()
						}
					})
				} else if (ele[0].id == 'btn-batch-upgrade-staff-info') {
					if (checks.length == 0) {
						ufma.showTip('请选择数据', function () { }, 'warning')
						return false;
					}
					title = '人员批量调级'
					openData = {
						orgCodeList: nodes,
						maxOrdIndex: maxOrdIndex,
						allEmpCodes: allEmpCodes,
						rmwyidList: rmwyidList,
						agencyCode: page.agencyCode
					}
					ufma.open({
						url: 'departBudgetAgy.html',
						title: title,
						width: 500,
						height: 450,
						data: openData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							if (data.action) {
								ufma.showTip(data.msg, function () { }, 'success')
							}
							page.setTableData()
						}
					})
				} else {
					title = '编辑人员'
					var id = ele.attr('data-id')
					var empCode = ele.attr('data-code')
					openData = {
						id: id,
						empCode: empCode,
						orgCodeList: nodes,
						maxOrdIndex: maxOrdIndex,
						allEmpCodes: allEmpCodes,
						action: "edit",
						agencyCode: page.agencyCode
					}
					ufma.open({
						url: 'addStaff.html',
						title: title,
						width: 1200,
						height: 600,
						data: openData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							if (data.action) {
								ufma.showTip(data.msg, function () { }, 'success')
							}
							page.setTableData()
						}
					})
				}
			},
			//获取人员身份
			getEmpTYpe: function () {
				var argu = {
					agencyCode: page.agencyCode,
					setYear: svData.svSetYear,
					rgCode: svData.svRgCode,
				};
				ufma.get(interfaceURL.getEmpTYpe, argu, function (result) {
					typeCodeList = result.data;
				});
			},
			// 初始化页面
			initPage: function () {
				//权限控制
				page.reslist = ufma.getPermission()
				ufma.isShow(page.reslist)
				//初始化单位树
				page.initAgencyTree()
			},

			onEventListener: function () {
				//分页尺寸下拉发生改变
				$('.ufma-table-paginate').on('change', '.vbPageSize', function () {
					pageLength = ufma.dtPageLength('#dep-staff-info-table', $('.ufma-table-paginate').find('.vbPageSize').val())
					searchData.pageSize = $('.ufma-table-paginate').find('.vbPageSize').val()
					$('.vbDataSum').html('')
					$('#dep-staff-info-table tbody').html('')
					$('#tool-bar .slider').remove()
					$('.ufma-table-paginate').html('')
					page.setTableData();
				})
				//点击页数按钮
				$('.ufma-table-paginate').on('click', '.vbNumPage', function () {
					if ($(this).find('a').length != 0) {
						searchData.currentPage = $(this).find('a').attr('data-gopage')
						searchData.pageSize = $('.ufma-table-paginate').find('.vbPageSize').val()
						$('.vbDataSum').html('')
						$('#dep-staff-info-table tbody').html('')
						$('#tool-bar .slider').remove()
						$('.ufma-table-paginate').html('')
						page.setTableData()
					}
				})
				//点击上一页
				$('.ufma-table-paginate').on('click', '.vbPrevPage', function () {
					if (!$('.ufma-table-paginate .vbPrevPage').hasClass('disabled')) {
						searchData.currentPage = $(this).find('a').attr('data-prevpage')
						searchData.pageSize = $('.ufma-table-paginate').find('.vbPageSize').val()
						$('.vbDataSum').html('')
						$('#dep-staff-info-table tbody').html('')
						$('#tool-bar .slider').remove()
						$('.ufma-table-paginate').html('')
						page.setTableData()
					}
				})
				//点击下一页
				$('.ufma-table-paginate').on('click', '.vbNextPage', function () {
					if (!$('.ufma-table-paginate .vbNextPage').hasClass('disabled')) {
						searchData.currentPage = $(this).find('a').attr('data-nextpage')
						searchData.pageSize = $('.ufma-table-paginate').find('.vbPageSize').val()
						$('.vbDataSum').html('')
						$('#dep-staff-info-table tbody').html('')
						$('.ufma-tool-btns').html('')
						$('.ufma-table-paginate').html('')
						page.setTableData()
					}
				})
				/**  部门树事件   ***/
				// 新增部门按钮点击事件
				$('.btn-add-department').on('click', function () {
					page.openDepEdit('新增部门')
				})
				// 删除部门
				$('.department-delete').on('click', function (e) {
					ufma.confirm(
						'你确定要删除选中数据吗？',
						function (action) {
							if (action) {
								page.deleteDepartMent()
							}
						}, {
						type: 'warning'
					}
					)
				})
				// 启用部门
				$('.department-start').on('click', function (e) {
					ufma.confirm(
						'你确定要启用选中数据吗？',
						function (action) {
							if (action) {
								page.startDepartMent()
							}
						}, {
						type: 'warning'
					}
					)
				})
				// 停用部门
				$('.department-stop').on('click', function (e) {
					ufma.confirm(
						'你确定要停用选中数据吗？',
						function (action) {
							if (action) {
								page.stopDepartMent()
							}
						}, {
						type: 'warning'
					}
					)
				})
				/**********************************/
				// 查询
				$('#btnQuery').on('click', function () {
					page.setTableData()
				})
				// 新增
				$(document).on('click', '#btn-add-dep-staff-info', function () {
					page.openWin($(this))
				})
				// 批量调级
				$(document).on('click', '#btn-batch-upgrade-staff-info', function () {
					page.openWin($(this))
				})
				// 编辑
				$(document).on('click', 'a.btn-edit', function () {
					page.openWin($(this))
				})
				// 删除
				$(document).on('click', '#tool-bar-del', function () {
					page.delValues($(this), true)
				})
				// 同步
				$(document).on('click', '#tool-bar-sync', function () {
					page.sameStep($(this), true)
				})
				// 删除表格行
				$(document).on('click', 'a.btn-delete', function () {
					page.delValues($(this), false)
				})
				//同步人员--zsj
				$(document).on('click', 'a.btn-sameStep', function () {
					page.sameStep($(this), false)
				})
				//导入
				$('#btn-import').on('click', function () {
					var openData = {
						agencyCode: page.agencyCode,
						agencyName: page.agencyName
					}
					ufma.open({
						url: 'excelImport.html',
						title: '选择人员信息导入格式',
						width: 1090,
						//height:500,
						data: openData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							// if (data.action) {
							page.setTableData()
							// }
						}
					})
				})
				// $('#btn-test').on('click', function(){
				// 	ufma.open({
				// 		url: '/pf/vue/ma/addEmpModal/addEmpModal',
				// 		title: '新增人员',
				// 		width: 1100,
				// 		//height:500,
				// 		data: {},
				// 		ondestory: function (data) {
				// 			console.log(data)
				// 			//窗口关闭时回传的值
				// 			// if (data.action) {
				// 			// }
				// 		}
				// 	})
				// })
				$('#btn-bank-import').on('click', function () {
					var openData = {}
					ufma.open({
						url: 'bankAccountInfoImport.html',
						title: '银行账户信息导入',
						width: 1090,
						//height:500,
						data: openData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							// if (data.action) {
							page.setTableData()
							// }
						}
					})
				})
				//同步警综用户 guohx 20200313
				$('#btnSynchronous').on('click', function () {
					var argu = {}
					ufma.get(interfaceURL.sameJZ, argu, function (result) {
						ufma.get(result.data, {}, function (result) {
							if (result.code == "0") {
								ufma.showTip('同步警综用户成功!', function () {
									page.setTableData();
								}, 'success')
								return false;
							} else {
								ufma.showTip('同步警综用户失败!', function () { }, 'error')
								return false;
							}
						})
					})
				})
				//表头全选
				$("body").on("click", 'input#check-head', function () {
					var isCorrect = $(this).is(':checked')
					$('#dep-staff-info-table tbody tr').find('.checkboxes').each(function () {
						isCorrect ? $(this).prop('checked', !0) : $(this).prop('checked', !1)
						isCorrect ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected')
					})
					$('.DTFC_LeftBodyLiner tbody tr').find('.checkboxes').each(function () {
						isCorrect ? $(this).prop('checked', !0) : $(this).prop('checked', !1)
						isCorrect ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected')
					})
					$('.datatable-group-checkable').prop('checked', isCorrect)
				});

			},
			//此方法必须保留
			init: function () {
				ufma.parse()
				page.initPage()
				page.sameStepType = false;
				page.onEventListener()
				ufma.parseScroll()
			}
		}
	})()

	/////////////////////
	page.init();

	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
})

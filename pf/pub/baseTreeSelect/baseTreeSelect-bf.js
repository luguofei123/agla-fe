$(function() {
	var params = window.ownerData || {};
	var flag = params.flag || 'ACCO';
	var bodyId = $(window.parent.document.body).attr("id");
	var bodyClass = $(window.parent.document.body).attr("class");
	bodyClass = bodyClass ? bodyClass.split(' ') : [];
	var checkbox = params.checkbox || false;
	var noRelation = params.noRelation || false;
	var isRelation = true;
	var rootName = params.rootName;
	var leafRequire = true;
	if(params.hasOwnProperty('leafRequire')) {
		leafRequire = params.leafRequire;
	}
	var treeObj, treeData;
	var levelNumValue;
	//zsj---经侯总确认弹窗选中数据后，再次打开暂时不用带有已选数据，若以后有此类需求可将这段代码取消注释
	/*var checkBoxArr = [];
	checkBoxArr = params.data.treeData;*/
	if (params.data.treeData && params.data.treeData.length > 0) {
		var checkBoxArr = [];
		// checkBoxArr = JSON.parse(params.data.ztreeNodeList);
		checkBoxArr = params.data.treeData;
	}
	window._close = function(action, data, level, accaCode, vouTypeCode) {
		if(window.closeOwner) {
			window.closeOwner({
				'action': action,
				'data': data,
				'itemLevel': level,
				'accaCode': accaCode,
				'vouTypeCode': vouTypeCode
			});
		}
	};
	//不多选时无需全选框
	$(".uf-selectAll")[checkbox == true ? 'removeClass' : 'addClass']("hidden")
	// $('#baserule')[flag == 'ACCO' ? 'removeClass' : 'addClass']('none');
	// if(flag == 'ACCO' && !$.isNull(params.data.accsCode)) {
	var newParams = JSON.parse(JSON.stringify(params.data));
	// newParams.ztreeNodeList = [];
	newParams.treeData = [];
	if (!$.isNull(newParams.accsCode)) {//辅助项也要显示级次
		var argu = $.extend({}, newParams, true);
		if(argu.accItemCode){
			delete argu.accItemCode
		}
		ufma.get("/ma/sys/element/getEleDetail", argu, function(result) {
			var ruleData = [];
			var ruleList = result.data && result.data.codeRule ? result.data.codeRule.split('-') : [];
			var textList = '一级,二级,三级,四级,五级,六级,七级,八级,九级,十级'.split(',');
			for(var i = 0; i < ruleList.length; i++) {
				ruleData.push({
					id: i + 1,
					text: textList[i]
				});
			}
			$('#cbbRule').ufCombox({
				idField: 'id',
				textField: 'text',
				readonly: true,
				data: ruleData,
				onChange: function(sender, itemData) {
					var timeId = setTimeout(function() {
						doFilter();
						clearTimeout(timeId);
					}, 30);
				},
			});
			if($.isNull(result.data)) {
				return false;
			}
		});
	}

	function getOptions() {
		var defaults = { //初始化
			idField: 'id', //可选
			textField: 'text', //可选
			pIdField: 'pId', //可选
			readonly: false, //可选
			autocomplete: 'off',
			//leafRequire: true, //可选
			onChange: function(sender, treeNode) {
				console.log(treeNode);
			}
		}
		var opts = {};
		switch(flag) {
			case "ACCO":
				opts = {
					idField: 'code',
					textField: 'codeName',
					url: '/gl/common/glAccItemData/getAccItemTree',
					filter: [{
						label: '会计体系',
						idField: 'id',
						textField: 'text',
						nameField: 'accaCode',
						theme: 'radio',
						data: [{
							id: '',
							text: '全部'
						}, {
							id: '1',
							text: '财务会计'
						}, {
							id: '2',
							text: '预算会计'
						}]
					}]
				}
				break;
			case "ACCOS": //会计科目复制
				opts = {
					idField: 'code',
					textField: 'codeName',
					url: '/ma/sys/common/getEleTree',
					filter: [{
						label: '会计体系',
						idField: 'id',
						textField: 'text',
						nameField: 'accaCode',
						theme: 'radio',
						data: [{
							id: '',
							text: '全部'
						}, {
							id: '1',
							text: '财务会计'
						}, {
							id: '2',
							text: '预算会计'
						}]
					}]
				}
				break;
			case "ACCS": //集中查询查询会计科目
				opts = {
					idField: 'code',
					textField: 'codeName',
					url: '/gl/sys/coaAcc/getAccoTree/' + params.setYear,
					filter: [{
						label: '会计体系',
						idField: 'id',
						textField: 'text',
						nameField: 'accaCode',
						theme: 'radio',
						data: [{
							id: '',
							text: '全部'
						}, {
							id: '1',
							text: '财务会计'
						}, {
							id: '2',
							text: '预算会计'
						}]
					}]
				}
				break;
			case "ACCSMA": //基础资料选用
				opts = {
					idField: 'code',
					textField: 'codeName',
					url: '/ma/sys/common/getCanIssueEleTree',
					filter: [{
						label: '会计体系',
						idField: 'id',
						textField: 'text',
						nameField: 'accaCode',
						theme: 'radio',
						data: [{
							id: '',
							text: '全部'
						}, {
							id: '1',
							text: '财务会计'
						}, {
							id: '2',
							text: '预算会计'
						}]
					}]
				}
				break;
			default:
				opts = {
					idField: 'code',
					textField: 'codeName',
					url: '/gl/common/glAccItemData/getAccItemTree',
					filter: []
				}
				break;
		}
		if(params.modal == 'ma') {
			opts = {
				idField: 'code',
				pIdField: 'pCode',
				textField: 'codeName',
				url: '/ma/sys/common/getEleTree',
				filter: []
			}
		}

		if(params.data) {
			opts.data = params.data;
		}
		if(flag == 'EXPFUNC') {
			opts.filter.push({
				label: '预算体系',
				idField: 'id',
				textField: 'text',
				nameField: 'bgttypeCode',
				theme: 'radio',
				data: [{
					id: '',
					text: '全部代码'
				}, {
					id: '1',
					text: '一般公共预算'
				}, {
					id: '2',
					text: '政府性基金预算'
				}, {
					id: '3',
					text: '国有资本经营预算'
				}, {
					id: '4',
					text: '社会保险基金预算'
				}]
			});
		}
		opts.filter.push({
			label: '代码级次',
			idField: 'id',
			textField: 'text',
			nameField: 'levelNum',
			theme: 'radio',
			data: [{
				id: '',
				text: '全部代码'
			}, {
				id: '1',
				text: '一级代码'
			}, {
				id: '0',
				text: '明细代码'
			}]
		});

		return $.extend(true, defaults, opts);
	}
	var opts = getOptions();

	//----------------------凭证字号 start-------------------------//
	function vouVouType () {
		var isAcctCode = false;
		if (bodyId == "glRptJournal" || bodyId == "glRptDlyJounal" || bodyId == "glRptLedger" || bodyId == "glRptBal") { // 有帐套的页面：明细账、日记账、总账、余额表
			if ($.inArray('bida-rpt-journal', bodyClass) >= 0 || $.inArray('bida-rpt-bal', bodyClass) >= 0 || $.inArray('bida-rpt-ledger', bodyClass) >= 0 || $.inArray('bida-rpt-summaryBal', bodyClass) >= 0 || $.inArray('bida-rpt-summaryJournal', bodyClass) >= 0 || $.inArray('bida-rpt-summaryLedger', bodyClass) >= 0) {
				// 账务查询-明细账、账务查询-余额表、账务查询-总账、账务查询-汇总余额表、账务查询-汇总明细账、汇总总账
			} else {
				isAcctCode = true;
			}
		};
		var reqUrl = "/gl/eleVouType/getVouType/" + params.data.agencyCode + "/" + params.data.setYear;
		if (isAcctCode) {
			reqUrl = reqUrl + "/" + params.data.acctCode + "/" + "*"
		}
		ufma.ajax(reqUrl, "get", "", function(result) {
			var data = result.data;
			var selectHtml = "";
			for(var i = 0; i < data.length; i++) {
				var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
					code: data[i].code,
					name: isAcctCode ? data[i].name : data[i].CHR_NAME
				});
				selectHtml += sHtml;
			}
			selectHtml = '<option value=""></option>' + selectHtml;
			$("#rpt-query-pzzh").html(selectHtml);
			$("#rpt-query-pzzh").val(params.data.vouTypeCode);
		});
	};
	//----------------------凭证字号 end-----------------------------//

	function buildTree(responseData) {
		var treeSetting = {
			async: {
				enable: true,
				type: 'get',
				dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
				contentType: 'application/json; charset=utf-8',
				//url:opts.url||null
			},
			view: {
				showLine: false,
				showIcon: false,
				// liuyyn #82094 明细账只能查一个科目,控制1个，不允许用ctrl选择多个--修改zTree配置
				selectedMulti: (flag === "ACCO" && bodyId === "glRptJournal") ? false : true
			},
			check: {
				enable: checkbox,
				// #4422 多栏账的新建/修改格式弹框中 展开项弹出树结构 父子节点不关联
				autoCheckTrigger: (bodyId === "styleModel" || noRelation || !isRelation) ? false : true,
				chkboxType: (bodyId === "styleModel" || noRelation || !isRelation) ? { "Y" : "", "N" : "" } : { "Y": "ps", "N": "ps" }
			},

			data: {
				simpleData: {
					enable: true,
					idKey: opts.idField,
					pIdKey: opts.pIdField,
					rootPId: 0
				},

				key: {
					name: opts.textField,
				},

				keep: {
					leaf: true
				}
			},
			callback: {
				onClick: function(event, treeId, treeNode) {
					event.stopPropagation();
					//var node = $.fn.zTree.getZTreeObj(treeId);
					treeObj.checkNode(treeNode, !treeNode.checked, true);
					if(params.checkAll) {
						onCheck(event, treeId, treeNode)
					}

				},
				onCheck: function(event, treeId, treeNode) {
					if(params.checkAll) {
						onCheck(event, treeId, treeNode)
					}
					if (!((bodyId === "styleModel")|| noRelation || !isRelation) ) { // #4422 多栏账的新建/修改格式弹框中 展开项弹出树结构 父子节点不关联
						//判断树节点全部勾选后自动勾选“全选”复选框=--zsj
						var myTree = $.fn.zTree.getZTreeObj(treeId);
						var zNodes = myTree.getNodes();
						var zNodess = treeObj.transformToArray(zNodes)
						if(myTree.getCheckedNodes(true).length == zNodess.length) {
							$(".uf-selectAll").find("input[name='isAll']").prop("checked", true);
						} else {
							$(".uf-selectAll").find("input[name='isAll']").removeAttr("checked", true);
						}
					}
				},
				onDblClick: function() {
					if(!checkbox) {
						$('#btnOk').trigger('click');
					}
				},
				onAsyncSuccess: function() {

				}
			}
		};
		//
		if(!$.isNull(treeObj)) {
			treeObj.destroy();
		}
		treeObj = $.fn.zTree.init($('#baseTree'), treeSetting, responseData);
		treeObj.expandAll(true);
		var nodes = treeObj.getNodes();
		/* 修改bug77711--修改当节点编码为“0”时出现自动变为父节点的问题--zsj
		 * if(nodes.length > 0) {
			//nodes[0].pId = '';--zsj避免条件筛选后前端将节点置为父节点
			treeObj = $.fn.zTree.init($('#baseTree'), treeSetting, nodes);
			treeObj.expandAll(true);
		}*/
		/*if(params.checkAll && $(".uf-selectAll").length == 0){
			//需要加全选框
			var labelHtml = '<div class="uf-selectAll">' +
				'<label class="rpt-check rpt-checkAll mt-checkbox mt-checkbox-outline">' +
				'<input name="isAll" type="checkbox">全选<span></span>' +
				'</label>' +
				'</div>';
			$(".tree-outer-box").prepend(labelHtml);
			//全选事件
			$(document).on("click",".rpt-checkAll",function () {
				var treeObj = $.fn.zTree.getZTreeObj("baseTree");
				if(treeObj){
					if($(".uf-selectAll").find("input[name='isAll']").prop("checked")){
						treeObj.checkAllNodes(true);
					}else{
						treeObj.checkAllNodes(false);
					}
				}
			});
		}*/

		//全选事件--zsj--经侯总确认去掉“全部”
		$(document).on("click", ".rpt-checkAll", function() {
			var treeObj = $.fn.zTree.getZTreeObj("baseTree");
			if(treeObj) {
				if($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
					treeObj.checkAllNodes(true);
					$(".uf-selectAll").find("input[name='isAll']").prop("checked", true);
				} else {
					treeObj.checkAllNodes(false);
					$(".uf-selectAll").find("input[name='isAll']").removeAttr("checked", true);
				}
			}
		});

		//处理树节点全部选中与否与全选框是否选中之间的变化
		function onCheck(event, treeId, treeNode) {
			var myTree = $.fn.zTree.getZTreeObj(treeId);
			var zNodes = myTree.getNodes();
			if(myTree.getCheckedNodes(true).length == zNodes.length) {
				$(".uf-selectAll").find("input[name='isAll']").prop("checked", true);
			} else {
			 	$(".uf-selectAll").find("input[name='isAll']").prop("checked", false);
			}
		}
	}

	function buildFilter() {
		var opts = getOptions();
		var _filterCnt = $('#frmFilter');
		if(!opts.filter) {
			return false;
		}
		$.each(opts.filter, function(idx, opts) {
			if(params.isParallelsum != "1" && opts.label == "会计体系") {
				//账套不是平行记账时不渲染会计体系
				return;
			} else {
				var text = opts.label;
				var idField = opts.idField; //条件
				var textField = opts.textField; //条件名称
				var name = opts.nameField || idField; //过滤
				var sb = [];
				sb.push('<ul>');
				sb.push('<li>' + text + '：</li>');
				switch(opts.theme) {
					case 'radio':
						for(var i = 0; i < opts.data.length; i++) {
							var item = opts.data[i];
							sb.push('<li><label class="mt-radio mt-radio-outline"><input type="radio" ' + (i == 0 ? 'checked' : '') + ' name="' + name + '" value="' + item[idField] + '"/>' + item[textField] + '<span></span></label></li>');
						}
						break;
					default:
						break;
				}
				sb.push('</ul>');
				$(sb.join('')).appendTo(_filterCnt).trigger('create');
			}
		});

		_filterCnt.on('click', '.mt-radio,span', function(e) {
			// if ((flag == 'ACCO' || flag == 'ACCS') && $('input[name="levelNum"]:checked').val() == '') {
			if ($('input[name="levelNum"]:checked').val() == '') {
				$('#baserule').removeClass('none');
			} else {
				$('#baserule').addClass('none');
			}
			//切换筛选条件时取消全选
			if($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
				$(".uf-selectAll").find("input[name='isAll']").prop("checked", false);
			}
			var timeId = setTimeout(function() {
				doFilter();
				clearTimeout(timeId);
			}, 30);
		});
	}

	function getFormData() {
		var elms = $('#frmFilter').find('[name]');
		var params = {};
		$.each(elms, function() {
			var key = $(this).attr('name');
			var value = '';
			if($(this).attr('type') == 'radio' && $(this).prop('checked')) {
				value = $(this).attr('value');
				if(value == '' && !$('#baserule').hasClass('none') && key == 'levelNum') {
					value = $('#cbbRule').getObj().getValue();
				}
			}
			if(value != '') {
				params[key] = value;
			}
		});
		return params;
	}

	//经侯总确认前端无需加“全部”节点，故将此方法注释--zsj
	/*function getRootNode() {
		var rootNode = {};
		// rootNode[opts.idField] = "0";
		rootNode[opts.idField] = "*";
		rootNode[opts.textField] = '全部';
		if(flag == 'ACCO') {
			var accaCode = $('input[name="accaCode"]:checked').val();
			if(accaCode == '1') {
				rootNode[opts.textField] = '全部财务会计';
				// rootNode.ACCA_CODE = '1';
				rootNode.accaCode = '1';
			} else if(accaCode == '2') {
				rootNode[opts.textField] = '全部预算会计';
				// rootNode.ACCA_CODE = '2';
				rootNode.accaCode = '2';
			}
		}
		rootNode.isLeaf = '0';
		rootNode.levelNum = 0;
		rootNode.pId = '';
		return rootNode;
	}
*/
	function doFilter() {
		//var nodeList = [getRootNode()];
		var nodeList = [];
		var searchText = $('#searchText').val();

		function filter(node) {
			var bOk = false;//返回的状态
			if(searchText != '') {//搜索内容为空
				//if(node[opts.textField].substr(0, searchText.length) != searchText && node[opts.idField].substr(0, searchText.length) != searchText) {
				if(node[opts.textField]!=undefined && node[opts.idField]!=undefined){
					if(node[opts.textField].indexOf(searchText) == -1 && node[opts.idField].indexOf(searchText) == -1) {
						return false;
					}
				}
			}

			var params = getFormData();//返回筛选条件对象 会计体系accaCode:"1"或"2" 代码级次 一级levelNum:"1" 明细"0"
			$.each(params, function(key, value) {//遍历对象
				var nodeValue = node[key];
				//zsj---筛选代码级次后将会计要素类型作为上级节点加上
				var sellevel = $("input[name=levelNum]:checked").val();
				var selLevelList = $("#cbbRule").length > 0 ? $("#cbbRule").getObj().getValue():"";
				if(nodeValue == '') {
					levelNumValue = '';
					levelNumValue = value;
					nodeValue = value;
					node.levelNum = levelNumValue;
				} else if(nodeValue != '') {
					if(node.acceCode != '') {
						for(var i = 0; i < treeData.length; i++) {
							if (treeData[i]){
								if (node.acceCode == treeData[i].id && treeData[i].acceCode == '' && (!$.isNull(sellevel) || !$.isNull(selLevelList))) {
									node.pId = treeData[i].id;
									node.pCode = treeData[i].code;
									node.parentId = treeData[i].chrId;
								}
							}
							
						}
					}
				}
				if(!$.isNull(value)) {//有值
					if(key == 'levelNum') {//如果是级次
							nodeValue = nodeValue || 0;
							bLeafOnly = value == 0;
							if((value != 0 && nodeValue == value)||(value != 0 && parseInt(nodeValue) < parseInt(value)&&(node.isLeaf == '1' || node.isLeaf != '0'))) {
								bOk = true;
							}else if(value == 0 && (node.isLeaf == '1' || node.isLeaf != '0')){
								if(node.acceCode != '') {
									for(var i = 0; i < treeData.length; i++) {
										if (treeData[i]){
											if (node.acceCode == treeData[i].id && treeData[i].acceCode == '' && treeData[i].isLeaf == '') {
												node.isLeaf == '1';
											}
										}
									}
								} else {//'全部'？
									node.levelNum = '0';
								}
								bOk = true;
								if(flag == 'ACCO' && (node.isLeaf == '1' || node.isLeaf != '0')) {
									//node[opts.pIdField] = node.ACCE_CODE
									node[opts.pIdField] = node.acceCode
								} else if(flag == 'ACCS' && (node.isLeaf == '1' || node.isLeaf != '0')) {
									node[opts.pIdField] = node.acceCode;
								}
							}else{
								bOk = false;
							}
						
					} else if(nodeValue == value) {//如果过滤条件与结点数据属性值相等 结点符合条件
						bOk = true;
					} else {
						bOk = false;
					}

					if(!bOk) {
						return bOk;
					}
				}else{
					bOk = true;
					return bOk;
				}
			});

			return bOk;
		}
		for(var i = 0; i < treeData.length; i++) {
			var node = $.extend(true, {}, treeData[i]);
			if(node[opts.idField] == "*" || node["id"] == "*") {
				continue;
			}
			var state = filter(node);
			if(state) {//结点是否满足条件
				if (node.id){
					nodeList.push(node);//满足条件结点放入新列表中
				}
			}
		}
		buildTree(nodeList);
	}

	getTreeData();

	function getTreeData () {
		var newopts = JSON.parse(JSON.stringify(opts.data));
		// newopts.ztreeNodeList = [];
		newopts.treeData = [];
		ufma.get(opts.url, newopts, function(result) {
			treeData = result.data;
			if (!checkbox){
				for (var i = 0; i < treeData.length;i++){
					if (treeData[i].id == "*") {
						delete treeData[i]
					}
				}
			}
			//经侯总确认前端无需加“全部”节点，故将此方法注释
			// if(flag != 'ACCS' && flag != 'ACCOS' && flag != 'ACCO' && flag != 'ACCSMA') {
			/*if(flag != 'ACCOS' && flag != 'ACCO' && flag != 'ACCSMA') {
				treeData.unshift(getRootNode());
			}*/
			//修改bug76850--zsj
			/*if(flag != 'ACCOS' && flag != 'ACCO' && flag != 'ACCSMA') {
				treeData.unshift(getRootNode());
			} else if(flag == 'ACCO') {
				$('#baseTree_1_switch .noline_docu').addClass('hide');
			} else {
				treeData.push(getRootNode());
			}*/
			//zsj---经侯总确认弹窗选中数据后，再次打开暂时不用带有已选数据，若以后有此类需求可将这段代码取消注释
			/*if(!$.isNull(checkBoxArr) && checkBoxArr.length > 0) {
				for(var i = 0; i < checkBoxArr.length; i++) {
					for(var j = 0; j < treeData.length; j++)
						if(checkBoxArr[i].code == treeData[j].code) {
							treeData[j] = $.extend(treeData[j], {
								checked: true
							});
						}
					if(checkBoxArr.length == treeData.length) {
						$(".uf-selectAll").find("input[name='isAll']").prop("checked", true)
					}
				}
			}*/
			if(!$.isNull(checkBoxArr) && checkBoxArr.length > 0) {
				for(var i = 0; i < checkBoxArr.length; i++) {
					for(var j = 0; j < treeData.length; j++)
						if(checkBoxArr[i].code == treeData[j].code) {
							treeData[j] = $.extend(treeData[j], {
								checked: true
							});
						}
					if(checkBoxArr.length == treeData.length) {
						$(".uf-selectAll").find("input[name='isAll']").prop("checked", true)
					}
				}
			}
	
			buildTree(treeData);
		});
	};

	if (bodyId == "glRptJournal" || bodyId == "glRptDlyJounal" || bodyId == "glRptLedger" || bodyId == "glRptBal") {
		// 展示级联选择：明细账、日记账、总账、余额表  账务查询-余额表 汇总余额表
		if ($.inArray('bida-rpt-journal', bodyClass) >= 0 || $.inArray('bida-rpt-ledger', bodyClass) >= 0 || $.inArray('bida-rpt-summaryJournal', bodyClass) >= 0 || $.inArray('bida-rpt-summaryLedger', bodyClass) >= 0) {
			// 账务查询-明细账 账务查询-总账 汇总总账 汇总明细账
		} else {
			isRelation = true
			$("#frmFilter .rpt-query-jlxz-wrap").css({ "display": "block" });
			$("#frmFilter #rpt-query-jlxz").on('change',function(){
				isRelation = $(this).prop("checked") ? true : false;
				getTreeData();
				doFilter();
			});
		}
		// 展示凭证类型：明细账、日记账、总账、余额表
		if ($.inArray('bida-rpt-journal', bodyClass) >= 0 || $.inArray('bida-rpt-bal', bodyClass) >= 0 || $.inArray('bida-rpt-ledger', bodyClass) >= 0 || $.inArray('bida-rpt-summaryBal', bodyClass) >= 0 || $.inArray('bida-rpt-summaryJournal', bodyClass) >= 0 || $.inArray('bida-rpt-summaryLedger', bodyClass) >= 0) {
			// 账务查询-明细账、账务查询-余额表、账务查询-总账、账务查询-汇总余额表、账务查询-汇总明细账、汇总总账
		} else {
			$("#frmFilter .rpt-query-pzzh-wrap").css({ "display": "block" });
			vouVouType();
			$("#frmFilter #rpt-query-pzzh").on('change',function(){
				opts.data.vouTypeCode = $("#frmFilter #rpt-query-pzzh").val();
				getTreeData();
				doFilter();
			});
		}
	}
	if(params.isselectnoall == true){
		isRelation = true
		$("#frmFilter .rpt-query-jlxz-wrap").css({ "display": "block" });
		$("#frmFilter #rpt-query-jlxz").on('change',function(){
			isRelation = $(this).prop("checked") ? true : false;
			getTreeData();
			doFilter();
		});
	}
	buildFilter();

	$('#searchText').on('keyup', function() {
		var timeId = setTimeout(function() {

			doFilter();
		}, 300);
	});
	$('#btnSearch').click(function() {
		doFilter();
	});
	$('#btnOk').click(function() {
		var nodes = checkbox ? treeObj.getCheckedNodes(true) : treeObj.getSelectedNodes();
		var nodeList = [];
		for(var i = 0; i < nodes.length; i++) {

			var node = nodes[i];
			if(checkbox) {
				//if(node[opts.idField] == '0' || node[opts.idField] == '*') continue;
				if(node[opts.idField] == '*') continue;//bug77711--修改当编码为0时被过滤的问题，若之后需要传“全部”节点，应将此行代码注释，并将对“*”的限制放开
				if($.isNull(node.accoType) && flag == 'ACCO' && bodyId !== "styleModel" && !noRelation && isRelation) continue;
				if(leafRequire && node.isParent) {
					continue;
				}
				if(node.checked == true && (node.check_Child_State == -1 || node.check_Child_State == 2)) {
					nodeList.push(node);
				}else if(bodyId === "styleModel" || noRelation || !isRelation){
					if (node.code != params.data.chrCodeLike && node.pCode != "*") {
						// #7041 多栏账-格式-会计科目 当前科目及上级应置为不可选择 选择后不带入到页面
						nodeList.push(node);
					}
				}
			} else {
				if(leafRequire && node.isParent) {
					ufma.showTip('请选择明细' + rootName, function() {}, 'warning');
					return false;
				} else {
					nodeList.push(node);
				}
			}
		}
		if(nodeList.length == 0) {
			ufma.showTip('请选择' + rootName, function() {}, 'warning');
			return false;
		}
		var level = $('input[name="levelNum"]:checked').val();
		if ((flag == 'ACCO' || flag == 'ACCS') && !$.isNull(params.data.accsCode)) {
			$('#cbbRule').getObj().getValue();
		}
		var accaCode = getFormData() ? getFormData().accaCode : '';
		// bug jira#9832 余额表页面清除辅助项设置拖拽后的缓存（需求#7862）
		if (bodyId == "glRptBal" && $.inArray('bida-rpt-bal', bodyClass) < 0 && $.inArray('bida-rpt-summaryBal', bodyClass) < 0) {
			localStorage.removeItem("colSetVal");
			localStorage.removeItem("colSetHtml");
		}
		// localStorage.removeItem("ztreeNodeList");
		// localStorage.setItem("ztreeNodeList", JSON.stringify(nodeList));
		_close(true, nodeList, level, accaCode, $("#frmFilter #rpt-query-pzzh").val());
	});
	$('#btnCancel').click(function() {
		_close(false);
	});
});
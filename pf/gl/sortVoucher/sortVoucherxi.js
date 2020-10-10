$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	var page = function() {
		var voutempSendList = []
		var searchacctCode = ''
		var fispred = 1
		var pfData = ufma.getCommonData();
		var agencyCode = window.ownerData.agencyCode,
			acctCode = searchacctCode,
//			acctCode = window.ownerData.acctCode,
			setYear = window.ownerData.setYear,
			isDouble = window.ownerData.isDouble
		var ctrls = {
//			'getVouType': '/gl/eleVouType/getVouType/' + agencyCode + '/' + setYear + '/' + searchacctCode + '/' + isDouble,
			'querySortVoucher': '/gl/vouBox/searchSortVous',
			'saveSortVous': '/gl/vouBox/saveSortVous'
		}

		function intToVouNo(i) {
			var vouNo = i + 1;
			if(vouNo < 10) {
				vouNo = '000' + vouNo;
			} else if(vouNo < 100) {
				vouNo = '00' + vouNo;
			} else if(vouNo < 1000) {
				vouNo = '0' + vouNo
			}
			return vouNo;

		}
		var loadParams;
		return {
			initPeriod: function() {
				var indexMonth = new Date().getMonth();
				fispred = indexMonth+1
				if(window.ownerData.fisPerd != undefined) {
					indexMonth = window.ownerData.fisPerd-1;
					fispred = window.ownerData.fisPerd;
				}
//				page.loadSortVoucher();
				//时间选择样式
				$("#month-line .month-text .month-one").removeClass("choose");
				$("#month-line .month-text .month-one").eq(indexMonth).addClass("choose");
				$("#month-line .blue-line .blue-one").removeClass("choose");
				$("#month-line .blue-line .blue-one").eq(indexMonth).addClass("choose");
			},
			initacctCode:function(){
				var woCode = window.ownerData.acctCode.split(',')
				var woName = window.ownerData.acctName.split(',')
				var tr = ''
				searchacctCode = woCode[0]
				for(var i=0;i<woCode.length;i++){
					tr+='<option value='+woCode[i]+'>'+ woName[i] +'</option>'
				}
				$("#cbacct").html(tr)
			},
			initVoucType: function() {
				var $obj = $('#vouType');
				$obj.find(':not(.label-radio)').remove();
				$obj.html('')
				var callback = function(result) {
					$('<a name="vouTypeCode" chrName="全部" value="*" class="label label-radio">全部</a>').appendTo($obj);
					$.each(result.data, function(idx, item) {
						$('<a name="vouTypeCode" chrName="' + item.name + '" value="' + item.code + '" class="label label-radio ' + (idx == 0 ? 'selected' : '') + '">' + item.name + '</a>').appendTo($obj);
					});
					if(window.ownerData.acctype != undefined) {
						for(var i = 0; i < $('.label-radio[name="vouTypeCode"]').length; i++) {
							if($('.label-radio[name="vouTypeCode"]').eq(i).attr('value') == window.ownerData.acctype) {
								$('.label-radio[name="vouTypeCode"]').removeClass('selected')
								$('.label-radio[name="vouTypeCode"]').eq(i).addClass('selected')
							}
						}
					}
					//ufma.parse();
					page.loadSortVoucher();
				}
				ufma.get('/gl/eleVouType/getVouType/' + agencyCode + '/' + setYear + '/' + searchacctCode + '/' + isDouble, {}, callback);
			},
			loadSortVoucher: function() {
				var sortBy = $('.label-radio[name="sortBy"].selected').attr('value');
				var vouTypeCode = $('.label-radio[name="vouTypeCode"].selected').attr('value');
				var queryParams = {
					"agencyCode": agencyCode,
					"acctCode": searchacctCode,
					"setYear": parseInt(setYear),
					"fisPerd": fispred,
					"vouTypeCode": vouTypeCode,
					"sortBy": sortBy
				}
				loadParams = queryParams;
				var callback = function(result) {
					$('#sortGrid tbody').html('');
					if(isDouble=='*'){
						$('#sortGrid thead').find('.je').after('<th>财务金额</th><th>预算金额</th>');
						$('#sortGrid thead').find('.je').remove()
					}
					var len = result.data.length;
					for(var i=0;i<len;i++){
						if(result.data[i].amtDr == 0 || result.data[i].amtDr == ''){
							result.data[i].amtDr = result.data[i].ysAmtDr
						}
					}
					var rowHtml = ''
					if(isDouble=='*'){
						rowHtml = '<tr><td class="<%=sortColor%>" title="<%=sortNo%>"><%=sortNo%></td><td title="<%=vouNo%>"><%=vouNo%></td><td title="<%=vouTypeName%>"><%=vouTypeName%></td><td title="<%=vouDate%>"><%=vouDate%></td><td title="<%=vouDesc%>"><%=vouDesc%></td><td class="tr"  title="<%=amtDr%>"><%=amtDr%></td><td class="tr"  title="<%=ysAmtDr%>"><%=ysAmtDr%></td><td title="<%=inputorName%>"><%=inputorName%></td><td title="<%=vouSource%>"><%=vouSource%></td></tr>';
					}else{
						rowHtml = '<tr><td class="<%=sortColor%>" title="<%=sortNo%>"><%=sortNo%></td><td title="<%=vouNo%>"><%=vouNo%></td><td title="<%=vouTypeName%>"><%=vouTypeName%></td><td title="<%=vouDate%>"><%=vouDate%></td><td title="<%=vouDesc%>"><%=vouDesc%></td><td class="tr"  title="<%=amtDr%>"><%=amtDr%></td><td title="<%=inputorName%>"><%=inputorName%></td><td title="<%=vouSource%>"><%=vouSource%></td></tr>';	
					}
					for(var i = 0; i < len; i++) {
						var vou = result.data[i];
						vou.sortNo = vou.newVouNo;
						vou.sortColor = '';
						if(vou.sortNo != vou.vouNo) {
							vou.sortColor = 'uf-red';
						}
						vou.amtDr = $.formatMoney(vou.amtDr, 2);
						vou.ysAmtDr = $.formatMoney(vou.ysAmtDr, 2);
						var tr = $($.htmFormat(rowHtml, vou)).appendTo('#sortGrid tbody');
						$.data(tr[0], 'rowData', vou);
					}
					/*
					 * 手动重排序
					$('#sortGrid').sortTable({
						onEndDrag: function(srcRow, targetRow) {
							$('#sortGrid tbody tr').each(function(irow) {
								var vou = $.data(this, 'rowData');
								vou.sortNo = intToVouNo(irow);
								$(this).find('td:eq(0)').attr('class', (vou.sortNo != vou.vouNo ? 'uf-red' : '')).html(vou.sortNo);
								//$.data(this,'rowData',vou);
							});
						}
					});*/
				}
				ufma.post(ctrls.querySortVoucher, queryParams, callback);
			},
			saveSortNo: function() {
				var sortVou = [];
				$('#sortGrid tbody tr').each(function(irow) {
					var vou = $.data(this, 'rowData');
					//if(vou.vouNo != vou.sortNo) {
						sortVou.push($.extend(true, {
							'vouGuid': vou.vouGuid,
							'newVouNo': vou.sortNo,
							'vouNo': vou.vouNo,
							'vouDate':vou.vouDate
						}, loadParams));
					//}
				});
				if(sortVou.length > 0) {
					ufma.confirm('凭证重排后将无法还原，您确定要执行当前操作吗？', function(action) {
						if(action) {
							ufma.post(ctrls.saveSortVous, sortVou, function(result) {
								ufma.showTip(result.msg, function() {}, "success");
								page.loadSortVoucher();
//								_close(true);
							});
						}
					}, {
						type: 'warning', 
						okText: '确定',
						cancelText: '取消'  
					})

				} else {
					ufma.showTip('凭证号没有变化！', function() {}, "warning");
				}
			},
			saveSortNos: function() {
				var sortVou = [];
 				var zTree = $.fn.zTree.getZTreeObj("docTree");
				var ztreesel = zTree.getCheckedNodes();
				var selacct = ''
				if(ztreesel.length>0){
					var ztreeselstr =[]
					for(var i=0;i<ztreesel.length;i++){
						if(ztreesel[i].accoCode!='*'){
							ztreeselstr.push(ztreesel[i].accoCode)
						}
					}
					selacct = ztreeselstr.join(',')
				}else{
					ufma.showTip('请选中一个账套后使用自动排序！', function() {}, "warning");
					return false
				}
				
				var sortBy = $('.label-radio[name="sortBy"].selected').attr('value');
				var vouTypeCode = $('.label-radio[name="vouTypeCode"].selected').attr('value')
				ufma.showloading('正在重排序，请耐心等待...');
				ufma.post('/gl/vouBox/saveReOrderVousWithAccts', {
					accts:selacct,
					fisperd:parseFloat(fispred),
					sortBy:sortBy,
					agencyCode:agencyCode,
					setYear:parseInt(setYear)
				}, function(result) {
					ufma.showTip(result.msg, function() {}, "success");
					page.loadSortVoucher();
					ufma.hideloading();
				});
			},
			treedata:function(){
				var atreeArr = window.ownerData.acctCode.split(',')
				var woName = window.ownerData.acctName.split(',')
				var znodes = []
				var nodeObja = {};
					nodeObja.open = true;
					nodeObja.id = '*';
					nodeObja.pId = 0;
					nodeObja.accoName = '全部';
					nodeObja.accoCode = '*';
					nodeObja.isLeaf = '0';
					znodes.push(nodeObja);
				for (var i = 0; i < atreeArr.length; i++) {
					var nodeObj = {};
					nodeObj.id = atreeArr[i];
					nodeObj.pId = '*';
					nodeObj.accoName = woName[i];
					nodeObj.accoCode = atreeArr[i];
					nodeObj.isLeaf = '1';
					znodes.push(nodeObj);
				}
				page.docTree(znodes)
			},
			docTree:function (zNodes) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: 'accoName'
						},
					},
					check: {
						enable: true
					},
					view: {
						fontCss: getFontCss,
						showLine: false,
						showIcon: false,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick,
						onCheck: zTreeOnCheck
					}
				};

				function zTreeOnClick(event, treeId, treeNode) {
					if(treeNode.isLeaf!=0){
						var zTree = $.fn.zTree.getZTreeObj("docTree"),
						nodes = zTree.getSelectedNodes();
						zTree.checkNode(nodes[0], null, false)
						searchacctCode = treeNode.accoCode
						page.initVoucType()
					}
				};
				function zTreeOnCheck(event, treeId, treeNode) {
				};
				//节点名称超出长度 处理方式
				function addDiyDom(treeId, treeNode) {
					var spaceWidth = 5;
					var switchObj = $("#" + treeNode.tId + "_switch"),
						icoObj = $("#" + treeNode.tId + "_ico");
					switchObj.remove();
					icoObj.before(switchObj);
					if (treeNode.level > 1) {
						var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
						switchObj.before(spaceStr);
					}
					var spantxt = $("#" + treeNode.tId + "_span").html();
					if (spantxt.length > 16) {
						spantxt = spantxt.substring(0, 16) + "...";
						$("#" + treeNode.tId + "_span").html(spantxt);
					}
				}

				function focusKey(e) {
					if (key.hasClass("empty")) {
						key.removeClass("empty");
					}
				}
				function searchNode(e){
						
				}
				function blurKey(e) {
					if (key.get(0).value === "") {
						key.addClass("empty");
					}
				}
				var lastValue = "",
					nodeList = [],
					fontCss = {};

				function clickRadio(e) {
					lastValue = "";
					searchNode(e);
				}

				function allNodesArr() {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					var nodes = zTree.getNodes();
					var allNodesArr = [];
					var allNodesStr;
					for (var i = 0; i < nodes.length; i++) {
						var result = "";
						var result = page.getAllChildrenNodes(nodes[i], result);
						var NodesStr = result
						NodesStr = NodesStr.split(",");
						NodesStr.splice(0, 1, nodes[i].id);
						NodesStr = NodesStr.join(",");
						allNodesStr += "," + NodesStr;
					}
					allNodesArr = allNodesStr.split(",");
					allNodesArr.shift();
					return allNodesArr;
				}
				function updateNodes(highlight) {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					for (var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}
				function getFontCss(treeId, treeNode) {
					return (!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
							color: "#333",
							"font-weight": "normal"
						};
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}
				var key;
				$(document).ready(function () {
					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
					var zTree = $.fn.zTree.getZTreeObj("docTree")
					var atreeArr = window.ownerData.acctCode.split(',')
					var node = zTree.getNodeByParam("accoCode",atreeArr[0]);
					zTree.cancelSelectedNode();//先取消所有的选中状态
					zTree.selectNode(node,true)
					searchacctCode = atreeArr[0]
					page.initVoucType()
				});
				
			},
			onEventListener: function() {
				$(document).on('click', '.label-radio', function() {
					page.loadSortVoucher();
				});
				$('.btn-close').click(function() {
					_close(true);
				});
				$('.btn-save').click(function() {
					page.saveSortNo();
				});
				$('.btn-saves').click(function() {
					page.saveSortNos();
				});
				$("#cbacct").change(function(){
					searchacctCode = $("#cbacct option:selected").attr('value')
					page.initVoucType();
				})
				$("#month-line .month-text .month-one a").on("click", function() {
					if(!$(this).parent().hasClass("choose")) {
						//样式改变
						$(this).parent().addClass("choose").siblings("li.month-one").removeClass("choose");
						var n = $(this).parent().index();
						$("#month-line .blue-line .blue-one:eq(" + n + ")").addClass("choose").siblings("li.blue-one").removeClass("choose");
						fispred = $(this).attr("data-fisPerd")
						page.loadSortVoucher();
					}
				})
			},

			init: function() {
				//获取session
				page.initacctCode()
				page.treedata()
				page.initPeriod();
				ufma.parse();
				page.onEventListener();

			}
		}
	}();

	page.init();
});
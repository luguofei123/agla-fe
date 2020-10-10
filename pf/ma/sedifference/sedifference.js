$(function() {

	var page = function() {
		var ptData = {};
		var curSurplusId = '',
			curSurplusCode = '';
		var treeObj;
		
		
		return {
			//如果有单位账套的缓存，则取缓存的值
			getSelectedVar:function(){
				var selEnviornmentVar = ufma.getSelectedVar();
				if (selEnviornmentVar) {
					page.agencyCode = selEnviornmentVar.selAgecncyCode;
					page.agencyName = selEnviornmentVar.selAgecncyName;
					page.acctCode = selEnviornmentVar.selAcctCode;
					page.acctName = selEnviornmentVar.selAcctName;
				}
			},
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
                    leafRequire:true,
					onchange: function(treeNode) {
						page.agencyCode = treeNode.code;
						page.agencyName = treeNode.name;
						var url = '/ma/sys/eleCoacc/getAcctTree/';
						callback = function(result) {
							// var data = $.inArrayJson(result.data, 'agencyCode', treeNode.id).acct;
							$("#cbAcct").getObj().load(result.data);
						}

						ufma.get(url + treeNode.code, {}, callback);
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function(sender) {
						if (page.agencyCode && page.agencyCode != ""){
							page.cbAgency.val(page.agencyCode);
						}else if(ptData.svAgencyCode) {
							page.cbAgency.val(ptData.svAgencyCode);
						} else {
							page.cbAgency.val('1');
						}
						ufma.hideloading();
					}
				});

				//page.cbAgency.select(1);
			},
			loadSEDif: function() {
				ufma.get('/ma/sys/surplus/select', {
					agencyCode: page.agencyCode,
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}, function(result) {
					var data = result.data;
					$('#seDifference').html('');
					for(var i = 0; i < data.length; i++) {
						var item = data[i];
						var locked = item.isLeaf == 1 ? '' : 'locked bgc-gray2';
						
                        var firstTDCnt = '<div class="uf-text-overflow" style="width:500px;" title="' + item.chrName + '">' + item.chrCode + ' ' + item.chrName + '</div>';
						/*var trHtm = '<tr class="' + locked + '"><td style="text-indent:' + (item.levelNum - 1) * 1.5 + 'em;">' + firstTDCnt + '</td><td style="padding-right:40px;"><div class="accoBox" style="float:left;" id="' + item.chrId + '"></div>' +
							(item.isLeaf == 1 ? '<span class="pa btn-addacco btn-permission icon icon-list-ul f18" surpCode="' + item.chrCode + '" target="' + item.chrId + '" style="right:10px;bottom:5px;cursor:pointer"></span>' : '') +
							'</td></tr>';*/
							//CWYXM-5000差异项基础资料中针对每一条差异项增加方向--zsj--暂时隐藏会计科目
							var trHtm = '<tr class="' + locked + '"><td style="text-indent:' + (item.levelNum - 1) * 1.5 + 'em;">' + firstTDCnt + '</td><td style="text-align:center">' +item.drCrName+'</td></tr>';
						$(trHtm).appendTo('#seDifference');
						/*if(item.isLeaf == 1 && item.eleSurplusAccoList) {
							page.showSEDifAcco(item.eleSurplusAccoList);
						}*/
					}

				});
			},
			showSEDifAcco: function(data) {
				for(var i = 0; i < data.length; i++) {
					var item = data[i];
					var _box = $('[id="' + item.SURPLUS_ID + '"]');
					if(_box.find('span[accoId="' + item.ACCO_ID + '"]').length == 0) {
						var _label = $('<div>').addClass('uf-label-item').appendTo(_box);
						$('<span class="uf-label-item-text">' + item.ACCO_CODE + ' ' + item.ACCO_NAME + '</spans>').appendTo(_label);
						$('<span accoId="' + item.ACCO_ID + '" class="uf-label-item-close btn-permission btn-delete icon-close"></spans>').appendTo(_label);
					}
				}
				ufma.isShow(reslist);
			},
			saveSEAcco: function(data) {
				var argu = {
					"agencyCode": page.agencyCode,
					"acctCode": $('#cbAcct').getObj().getValue(),
					"setYear": ptData.svSetYear,
					"rgCode":ptData.svRgCode,
					"userId": ptData.svUserId,
					"eleSurplus": {
						"chrId": curSurplusId,
						"chrCode": curSurplusCode
					},
					"eleSurplusAccoList": []
				}
				for(var i = 0; i < data.length; i++) {
					argu.eleSurplusAccoList.push({
						"chrId": data[i].ACCO_ID,
						"chrCode": data[i].ACCO_CODE,
						"setYear": ptData.svSetYear
					});
				}
				ufma.post('/ma/sys/surplus/saveEleSurplusAcco', argu, function(result) {
					page.showSEDifAcco(data);
				});
			},
			initSEAccoTree: function() {
				ufma.get('/ma/sys/common/getEleTree', {
					agencyCode: page.agencyCode,
					acctCode: $("#cbAcct").getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode:"ACCO",
					accsCode:$("#cbAcct").getObj().getItem().accsCode,
					allowSurplus: 1
				}, function(result) {
					treeObj = $('#seAccoTree').ufmaTree({
						async: false,
						checkbox: true,
						data: result.data,
						nameKey: 'codeName',
						idKey: 'id',
						onCheck: function(event, treeId, treeNode) {
							event.stopPropagation();
							var nodes = treeObj.getCheckedNodes(true);
							var checkNodes = [];
							for(var i = 0; i < nodes.length; i++) {
								var node = nodes[i];
								if(node.isLeaf == '1') {
									checkNodes.push({
										'SURPLUS_ID': curSurplusId,
										'ACCO_ID': node.id,
										'ACCO_CODE': node.code,
										'ACCO_NAME': node.name
									});
								}
							}
							page.saveSEAcco(checkNodes);
						}
					});
					treeObj.expandAll(true);
				});

			},
			onEventListener: function() {

			},
			//初始化页面
			initPage: function() {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(data) {
						page.initSEAccoTree();
						page.loadSEDif();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							selAcctCode: $("#cbAcct").getObj().getValue(),
							selAcctName: $("#cbAcct").getObj().getText()
						}
						ufma.setSelectedVar(params);
					},
					onComplete: function(sender) {
						if (page.acctCode && page.acctCode != ""){
							$("#cbAcct").getObj().val(page.acctCode);
						}else if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}						
						page.loadSEDif();
						ufma.hideloading();
					}
				});
				$(document).on('click', '.uf-label-item-close', function(e) {
					var label = $(this).closest('.uf-label-item');
					surplusId = $(this).closest('.accoBox').attr('id');
					accoId = $(this).attr('accoId');
					ufma.post('/ma/sys/surplus/deleteEleSurplusAcco', {
						'surplusId': surplusId,
						'accoId': accoId
					}, function(result) {
						label.remove();
					});
				});

				$(document).on('click', '.btn-addacco', function(e) {
					curSurplusId = $(this).attr('target');
					curSurplusCode = $(this).attr('surpCode');
					if(!treeObj || treeObj.getNodes().length < 2) {
						page.initSEAccoTree();
					}
					if(treeObj) {
						treeObj.checkAllNodes(false);
						$('.accoBox[id="' + curSurplusId + '"]').find('span[accoid]').each(function(idx, acco) {
							var node = treeObj.getNodeByParam("CHR_ID", $(acco).attr('accoid'), null);
							if(node) {
								treeObj.checkNode(node, true, true);
							}
						});
					}

					$(this).slidedown({
						position: 'right',
						element: '#seAccoTree'
					});
				});
				this.initAgencyScc();
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				this.initPage();
				this.onEventListener();
				ufma.parse();
				page.getSelectedVar()
			}
		}
	}();

	page.init();
});
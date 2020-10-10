$(function () {
	window._close = function (state,data) {
		if(data == undefined){
			data = []
		}
		if (window.closeOwner) {
			var data = {
				action: state,
				data: data
			};
			window.closeOwner(data);
		}
	};
	var isl=false
	var pfData = ufma.getCommonData();
	var modelData = window.ownerData
	var page = function () {
		var portList = {};
		return {
			showHideTree: function (dom, code, text, codeType, eleCode) {
				var params = {
					"accsCode": modelData.accsCode,
					"acctCode": modelData.acctCode,
					"agencyCode": modelData.agencyCode,
					"setYear": modelData.setYear,
					"userId": modelData.userId,
					"eleCode": eleCode//辅助项的eleCode，查级次用
				}
				//多栏账科目要显示isLeaf=0的
				if (rpt.rptType == "GL_RPT_COLUMNAR") {
					params.isLeaf = '0'
				}
				params[codeType] = code;
				//zsj---经侯总确认弹窗选中数据后，再次打开暂时不用带有已选数据，若以后有此类需求可将这段代码取消注释
				/* params.treeData = rpt.treeAlldata;
				params.dataLevel = rpt.itemLevel;*/
				ufma.open({
					url: bootPath + 'pub/baseTreeSelect/baseTreeSelect.html',
					title: '选择' + text,
					width: 580,
					height: 545,
					data: {
						'flag': code,
						'rootName': text,
                        'flag': code,
                        'rootName': text,
                        'leafRequire': false,
						'checkbox': true,
						'data': params,
						'noRelation':false,
						'isParallelsum': modelData.isParallelsum
					},
					ondestory: function (result) {
						if (result.action) {
							var $input = $(dom).parents(".searchass").find("input");
							var valList = [],
								codeList = [];
							for (var i = 0; i < result.data.length; i++) {
								if(result.data[i].pId !="*"){
									valList.push(result.data[i].codeName);
									codeList.push(result.data[i]);
								}
							}
							$input.val(valList.join(',')).attr('title',valList.join(','));
							var attrCode = JSON.stringify(codeList);
							$input.attr('code', attrCode).attr('itemLevel', result.itemLevel);
							ufma.setBarPos($(window));
						};
						if (result && result.data && result.data.length && result.data[0]) {
							rpt.nowAccoCode = result.data[0].code;
						}
					}
				});
			},
			saveData: function () {
				if ($('#accList1').getObj().getValue() == '' || $('#accList2').getObj().getValue()=='') {
					ufma.showTip('横纵向为必填条件')
					return false
				}
				if ($('#accList1').parents('tr').find('.searchass input').val() == '' || $('#accList2').parents('tr').find('.searchass input').val()=='') {
					ufma.showTip('横纵向查询范围为必填条件')
					return false
				}
				var rptOption = []
				var rlength = 0
				for (var i = 0; i < $('.asschecks').length; i++) {
					var rptone = {}
					if ($('.asschecks').eq(i).is(":checked")) {
						rptone.defCompoValue = "Y"
						rlength += 1
					} else {
						rptone.defCompoValue = "N"
					}
					rptone.optCode = $('.asschecks').eq(i).attr('data-code')
					rptone.optName = $('.asschecks').eq(i).attr('data-name')
					rptOption.push(rptone)
				}
				if (rlength == 0) {
					ufma.showTip('请选择至少一个分析项')
					return false
				}
				for (var i = 0; i < $('.asscheck').length; i++) {
					var rptone = {}
					if ($('.asscheck').eq(i).is(":checked")) {
						rptone.defCompoValue = "Y"
						rlength += 1
					} else {
						rptone.defCompoValue = "N"
					}
					rptone.optCode = $('.asscheck').eq(i).attr('data-code')
					rptone.optName = $('.asscheck').eq(i).attr('data-name')
					rptOption.push(rptone)
				}
				var qryItems = []
				for (var i = 0; i < $('.ufma-table tbody tr').length; i++) {
					var s = i + 1
					var trs = $('.ufma-table tbody tr').eq(i)
					var qryitemss = {}
					if ($('#accList' + s).getObj().getValue() != '') {
						if (s == 1) {
							qryitemss.condType = "row"
							qryitemss.isOutTablleShow = '0'
						} else if (s == 2) {
							qryitemss.condType = "col"
							qryitemss.isOutTablleShow = '0'
						} else {
							qryitemss.condType = "cond"
							qryitemss.isOutTablleShow = trs.find('.assIsshow option:selected').attr("value")
						}
						qryitemss.itemType = $('#accList' + s).getObj().getValue()
						qryitemss.itemTypeName = $('#accList' + s).getObj().getText()
						if(trs.find('.searchass').find('input').attr('code')!=undefined){
							qryitemss.items = JSON.parse(trs.find('.searchass').find('input').attr('code'))
						}else{
							qryitemss.items = []
						}
						qryItems.push(qryitemss)
					}
				}
				var datas={
					rptOption:rptOption,
					qryItems:qryItems
				}
				return datas
			},
			initPage: function () {
				if(modelData.menucode!=undefined){
					$('#methodName').val(modelData.fanantitle)
					var prjContent = modelData.setData
					$(".fananradio input[value="+modelData.prjScope+"]").attr('checked',true).prop('checked',true)
					for(var i=0;i<prjContent.qryItems.length;i++){
						var s= i+1;
						$("#accList"+s).getObj().setValue(prjContent.qryItems[i].itemType,prjContent.qryItems[i].itemTypeName)
						var $input = $('.ufma-table tbody').find('tr').eq(i).find('.searchass input')
						if(i>1){
							if(prjContent.qryItems[i].isOutTablleShow ==0){
								$('.ufma-table tbody').find('tr').eq(i).find('.assIsshow').find('option[value="0"]').attr('selected',true).prop('selected',true)
							}
						}
						var valList = []
						for (var z = 0; z < prjContent.qryItems[i].items.length; z++) {
							valList.push(prjContent.qryItems[i].items[z].code+ ' '+prjContent.qryItems[i].items[z].name);
						}
						$input.val(valList.join(',')).attr('title',valList.join(','));
						var attrCode = JSON.stringify(prjContent.qryItems[i].items);
						$input.attr('code', attrCode)
					}
					page.setcolquery=0
					for(var i=0;i<prjContent.rptOption.length;i++){
						if(prjContent.rptOption[i].defCompoValue == 'Y'){
							$("input[data-code="+prjContent.rptOption[i].optCode+"]").attr('checked',true).prop('checked',true)
						}else{
							$("input[data-code="+prjContent.rptOption[i].optCode+"]").attr('checked',false).prop('checked',false)
						}
					}
				}else if(modelData.setData.length!=0){
					var prjContent = modelData.setData
					for(var i=0;i<prjContent.qryItems.length;i++){
						var s= i+1;
						$("#accList"+s).getObj().setValue(prjContent.qryItems[i].itemType,prjContent.qryItems[i].itemTypeName)
						var $input = $('.ufma-table tbody').find('tr').eq(i).find('.searchass input')
						if(i>1){
							if(prjContent.qryItems[i].isOutTablleShow ==0){
								$('.ufma-table tbody').find('tr').eq(i).find('.assIsshow').find('option[value="0"]').attr('selected',true).prop('selected',true)
							}
						}
						var valList = []
						for (var z = 0; z < prjContent.qryItems[i].items.length; z++) {
							valList.push(prjContent.qryItems[i].items[z].code+ ' '+prjContent.qryItems[i].items[z].name);
						}
						$input.val(valList.join(',')).attr('title',valList.join(','));
						var attrCode = JSON.stringify(prjContent.qryItems[i].items);
						$input.attr('code', attrCode)
					}
					page.setcolquery=0
					for(var i=0;i<prjContent.rptOption.length;i++){
						if(prjContent.rptOption[i].defCompoValue == 'Y'){
							$("input[data-code="+prjContent.rptOption[i].optCode+"]").attr('checked',true).prop('checked',true)
						}else{
							$("input[data-code="+prjContent.rptOption[i].optCode+"]").attr('checked',false).prop('checked',false)
						}
					}
				}
			},
			onEventListener: function () {
				$("#accList1,#accList2,#accList3,#accList4,#accList5,#accList6,#accList7").ufCombox({
					idField: "accItemCode",
					textField: "accItemName",
					placeholder: "请选择",
					readonly: true,
					onChange: function (sender, data) {
						var raun = true;
						var senderid = sender.attr("id")
						if ($("#" + senderid).getObj().getText() != '请选择') {
							for (var i = 1; i < 8; i++) {
								if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
									raun = false
									ufma.showTip("请勿选择重复辅助项", function () { }, "warning");
									$("#" + senderid).getObj().setValue("", "请选择")
								}else{
									$("#" + senderid).parents('tr').find('td').eq(3).html('')
									$("#" + senderid).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
								}
							}
							if (raun && senderid!='accList1' && senderid!='accList2') {
								var sel = '<select class="assIsshow">'
								sel += '<option value="1">是</option>'
								sel += '<option value="0">否</option>'
								sel += '</select>'
								$("#" + senderid).parents('tr').find('td').eq(3).html(sel)
							}
						} else {
							$("#" + senderid).parents('tr').find('td').eq(3).html('')
							$("#" + senderid).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
						}
					},
					onComplete: function (sender) {
					}
				});
				$("#accList1,#accList2,#accList3,#accList4,#accList5,#accList6,#accList7").on('click',"span.icon-close",function(){
					$(this).parents('tr').find('td').eq(3).html('')
					$(this).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
				})
				var listItem = modelData.accListData;
				var newArr = [{
					"accItemCode": "",
					"accItemName": "请选择"
				}];
				for (var i = 0; i < listItem.length; i++) {
					newArr.push(listItem[i]);
				}
				$("#accList1").getObj().load(newArr);
				$("#accList2").getObj().load(newArr);
				$("#accList3").getObj().load(newArr);
				$("#accList4").getObj().load(newArr);
				$("#accList5").getObj().load(newArr);
				$("#accList6").getObj().load(newArr);
				$("#accList7").getObj().load(newArr);
				$(document).on("click", '.search-btn', function (e) {
					e.stopPropagation();
					var combox = $(this).attr('data-ass')
					var $combox = $('#' + combox)
					var code = $combox.getObj().getValue();
					var text = $combox.getObj().getText();
					if($combox.getObj().getItem()!=undefined){
						var eleCode = $combox.getObj().getItem().eleCode;
						if($combox.getObj().getItem().accItemCode == 'ACCO'){
							eleCode = $combox.getObj().getItem().accItemCode
						}
						if (eleCode) {
							page.showHideTree(this, code, text, "accItemCode", eleCode);
						} else {
							ufma.showTip("请先选择辅助项")
						}
					}else{
						ufma.showTip("此辅助项在当前单位账套下无内容，请重新选择辅助项")
					}
				});
				$("#btn-searchTable").on('click',function(){
					var prjContent =  page.saveData()
					_close('search',prjContent)
				})
				$('#sureSaveMethod').on('click', function () {
					var savePrjArgu = {};
					savePrjArgu.acctCode = modelData.acctCode; //账套代码
					savePrjArgu.agencyCode = modelData.agencyCode; //单位代码
					savePrjArgu.prjCode = $("#methodName").attr('data-code'); //方案代码
					savePrjArgu.prjName = $("#methodName").val(); //方案名称
					if(savePrjArgu.prjName==''){
						ufma.showTip("请填写方案名称")
						return false
					}
					savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val() //方案作用域
					savePrjArgu.rptType ='GL_RPT_ASS_ANALYZE'; //账表类型
					savePrjArgu.setYear = modelData.setYear; //业务年度
					savePrjArgu.userId = modelData.userId; //用户Id 
					savePrjArgu.prjContent =  page.saveData();//方案内容
					if(savePrjArgu.prjContent){
						ufma.ajax('/gl/rpt/prj/savePrj', "post", savePrjArgu, function(result){
							_close('ok')
						});
					}
				})
				$('#saveAs').on('click', function () {
					var savePrjArgu = {};
					savePrjArgu.acctCode = modelData.acctCode; //账套代码
					savePrjArgu.agencyCode = modelData.agencyCode; //单位代码
					savePrjArgu.prjCode = ''; //方案代码
					savePrjArgu.prjName = $("#methodName").val(); //方案名称
					if(savePrjArgu.prjName==''){
						ufma.showTip("请填写方案名称")
						return false
					}
					savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val() //方案作用域
					savePrjArgu.rptType ='GL_RPT_ASS_ANALYZE'; //账表类型
					savePrjArgu.setYear = modelData.setYear; //业务年度
					savePrjArgu.userId = modelData.userId; //用户Id
					savePrjArgu.prjContent =  page.saveData();//方案内容
					if(savePrjArgu.prjContent){
						ufma.ajax('/gl/rpt/prj/savePrj', "post", savePrjArgu, function(result){
							_close('ok')
						});
					}
				})
				$('#btnClose').on('click', function () {
					_close('')
				})
				
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				page.svTransDate = pfData.svTransDate
				$('#methodName').attr('data-code',modelData.menucode)
				this.onEventListener();
				this.initPage();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});
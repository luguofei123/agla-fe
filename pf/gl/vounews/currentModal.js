$(function () {
	window._close = function (state) {
		if (window.closeOwner) {
			if(state == undefined){
				state=[]
			}
			var data = {
				action: state,
			};
			window.closeOwner(data);
		}
	}
	var windata =window.ownerData
	var page = function () {
		var pfData;

		return {
			getTable:function(data){
				var search ={
					agencyCode: windata.agencyCode,
					acctCode: windata.acctCode,
					vouDate:windata.vouDate,
					vouGuid:windata.vouGuid==undefined?'':windata.vouGuid,
					accoCode:windata.accoCode,
					newAssGuid:windata.newassid,
					descpt:windata.despct,
					startDate:$("#vbStartDate").getObj().getValue(),
					endDate:$("#vbEndDate").getObj().getValue(),
					field1:windata.field1,
					// searchAssData:page.searchAssData,
					// cruxinput:$("#cruxinput").val(),
					// vbstartTotalAmt:$("#vbstartTotalAmt").val(),
					// vbendTotalAmt:$("#vbendTotalAmt").val(),
					// vbStartDate:$("#vbStartDate").getObj().getValue(),
					// vbEndDate:$("#vbEndDate").getObj().getValue()
				}
				var theadh = ''
				theadh+='<tr><th>凭证日期</th>'
				theadh+='<th>凭证字号</th>'
				theadh+='<th>往来号</th>'
				theadh+='<th>摘要</th>'
				for(var i in windata.voudetailAss){
					if(page.searchAssData[i]!=undefined){
						theadh+='<th>'+windata.voudetailAss[i].ELE_NAME+'</th>'
						search[windata.voudetailAss[i].ACCITEM_CODE] = page.searchAssData[i]
					}
				}
				theadh+='<th>金额</th>'
				theadh+='<th>已核销金额</th>'
				theadh+='<th>未核销金额</th>'
				theadh+='<th>核销金额</th></tr>'
				$("#currentTable").find('thead').html(theadh)
				ufma.post(' /gl/vou/getCancelNexus',search,function(result){
					var data = result.data
					page.DataList = JSON.parse(JSON.stringify(data));
					var tr = ''
					for(var i=0;i<data.length;i++){
						tr+='<tr titles='+i+'><td>'+data[i].VOU_DATE+'</td>'
						var typeObj = $.inArrayJson(windata.voutype, 'code', data[i].VOU_TYPE_CODE);
						tr+='<td>'+typeObj.name+ '-'+data[i].VOU_NO+'</td>'
						tr+='<td>'+data[i].FIELD1+'</td>'
						tr+='<td>'+data[i].DESCPT+'</td>'
						for(var z in windata.voudetailAss){
							if(page.searchAssData[z]!=undefined){
								var assval = data[i][windata.voudetailAss[z].ACCITEM_CODE]!=undefined?data[i][windata.voudetailAss[z].ACCITEM_CODE]:''
								tr+='<td>'+assval+'</td>'
							}
						}
						tr+='<td class="moenytd">'+data[i].STAD_AMT+'</td>'
						var benvouamt = windata.voufield1amt[data[i].FIELD1]
						if(benvouamt == undefined){
							benvouamt = 0
						}
						var nocancelmoney = parseFloat(data[i].STAD_AMT)-parseFloat(data[i].CANCEL_MONEY)-parseFloat(benvouamt)
						var cencelmoeny = parseFloat(data[i].CANCEL_MONEY)+parseFloat(benvouamt)
						var Rmoney = windata.nowmoney
						if(Rmoney>data[i].STAD_AMT){
							Rmoney = data[i].STAD_AMT
						}
						if(windata.field1 != data[i].FIELD1){
							Rmoney = ''
						}
						tr+='<td class="moenytd">'+cencelmoeny+'</td>'
						tr+='<td class="moenytd noWriteAmt">'+nocancelmoney+'</td>'
						tr+='<td class="writeAmtTd"><input type="text" class="writeAmt" value="'+Rmoney+'" field1="'+data[i].FIELD1+'"></td></tr>'
					}
					$("#currentTable").find('tbody').html(tr)
				})
			},
			//初始化页面
			initPage: function () {
				page.searchAssData = JSON.parse(JSON.stringify(windata.data))
				var noarr={
					'expireDate':'','stadAmt':'','field1':'','remark':'',
					'qty':'','price':'','currAmt':'','exRate':'',
				}
				for(var i in noarr){
					delete page.searchAssData[i]
				}
				$("#vbStartDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: page.svTransDate,
				}).on('change', function () {
					var startdate = $('#vbStartDate').getObj().getValue();
					var enddate = $('#vbEndDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbStartDate').getObj().setValue($('#vbEndDate').getObj().getValue());
					}
				})
				$("#vbEndDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: page.svTransDate,
				}).on('change', function () {
					var startdate = $('#vbStartDate').getObj().getValue();
					var enddate = $('#vbEndDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbEndDate').getObj().setValue($('#vbStartDate').getObj().getValue());
					}
					
				})
			},
			onEventListener: function () {
				$("#btn-sure").on('click',function(){
					var field1Data = {}
					for(var i=0;i<$("#currentTable").find("tbody").find('tr').length;i++){
						var trDom = $("#currentTable").find("tbody").find('tr').eq(i)
						var titbs =  $("#currentTable").find("tbody").find('tr').eq(i).attr('titles')
						if(trDom.find('.writeAmt').val()!=''){
							var data ={} 
							for(var z in windata.voudetailAss){
								if(page.searchAssData[z]!=undefined && page.DataList[titbs][windata.voudetailAss[z].ACCITEM_CODE]!=undefined){
									data[z] = page.DataList[titbs][windata.voudetailAss[z].ACCITEM_CODE]
								
								}
							}
							data.remark = page.DataList[titbs].DESCPT
							data.cancelAssGuid  = page.DataList[titbs].CANCEL_ASS_GUID
							data.amt = parseFloat(trDom.find('.writeAmt').val())
							field1Data[trDom.find('.writeAmt').attr('field1')] =data
						}
					}
					var returndata = []
					for(var i in field1Data){
						var key = JSON.parse(JSON.stringify(windata.data))
						if(!windata.isint){
							field1Data[i].amt = -parseFloat(field1Data[i].amt)
						}
						key.field1 = i
						for(var z in field1Data[i]){
							key[z]= field1Data[i][z]
						}
						key.stadAmt = field1Data[i].amt
						returndata.push(key)
					}
					_close(returndata);
				})
				$('#btn-cancle').click(function () {
					_close();
				});
				$(document).on("keyup", ".writeAmt,#vbstartTotalAmt,#vbendTotalAmt", function() {
					var c = $(this);
					if(/[^\d.]/.test(c.val())) { //替换非数字字符  
						var temp_amount = c.val().replace(/[^\d.+=-]/g, '');
						$(this).val(temp_amount);
					}
				})
				$(document).on("blur", ".writeAmt", function() {
					var reg = /^[-\d]+(\.\d+)?$/;
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val('');
						ufma.showTip("请输入正确的金额，谢谢！");
					} else {
						var noWriteAmt = parseFloat($(this).parents('tr').find('.noWriteAmt').html().split(",").join(""))
						if(val>noWriteAmt){
							ufma.showTip("不可超过未核销金额");
							val=parseFloat(noWriteAmt).toFixed(2)
							$(this).val(val);
						}else{
							val = parseFloat(val).toFixed(2);
							$(this).val(val);
						}
					}
				})
				$("#vbstartTotalAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var max = parseFloat($("#vbendTotalAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (max != "" && val > max) {
						ufma.showTip("起始金额不得大于截止金额！");
						$(this).val(max.toFixed(2));
					} else {
						val = parseFloat(val).toFixed(2);
						$(this).val(val);
					}
				});
				$("#vbendTotalAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var min = parseFloat($("#vbstartTotalAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (min != "" && val < min) {
						ufma.showTip("截止金额不得小于起始金额！");
						$(this).val(min.toFixed(2));
					} else {
						val = parseFloat(val).toFixed(2);
						$(this).val(val);
					}
				});
				$("#btn-search").on('click',function(){
					page.getTable()
				})
			},
			//此方法必须保留
			init: function () {
				pfData = ufma.getCommonData();
				page.svTransDate =  windata.vouDate
				ufma.parse();
				this.initPage();
				this.onEventListener();
				$(".maintable").height($('.workspace').height()-90)
				page.getTable()
			}
		}
	}();

	page.init();
});
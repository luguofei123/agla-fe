$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
    };
    window.setEditorData=function(html,id,val){
		$('#'+html).find("input[type='text']").val(val);
		$('#'+html).attr('key',id);
    };
	var page = function() {
		return {
			appendHtml:function(id,data){
				$('#'+id).attr('refGuid',data.refGuid)
				$('#'+id).attr('key',data.templateId)
				$('#'+id).find("input[type='text']").val(data.templateName);
			},
			initPage:function(){
				var wwt={
					"agencyCode": window.ownerData.agencyCode,//单位
					"acctCode": window.ownerData.acctCode,//账套
					"billTypeCode": "3",//待摊费用

				}
				ufma.post('/gl/CbBillBook/selectVouCreateRuleSet', wwt, function (result) {
					for(var i=0;i<result.data.length;i++){
						if(result.data[i].billStatus=='01'){//登记业务凭证模板
							page.appendHtml('dj',result.data[i])
						}else if(result.data[i].billStatus=='08'){//摊销业务凭证模板
							page.appendHtml('tx',result.data[i])
						}else if(result.data[i].billStatus=='09'){//转出业务凭证模板
							page.appendHtml('zc',result.data[i])
						}
					}
					
				})
			},
			onEventListener: function() {
				$('#btnClose').click(function() {
					_close();
				});
				//保存操作
				$('#btnSave').click(function() { 
					var datas={
						"agencyCode": window.ownerData.agencyCode,//单位
						"acctCode": window.ownerData.acctCode,//账套
						"billTypeCode": "3",//待摊费用
						"billStatusObj":[],

					}
					$.each($(".uf-buttonedit"),function(){
						if($(this).attr("key")){
							var obj={
								"billStatus":$(this).attr("typeCode"),
								"templateId":$(this).attr("key"),
								"refGuid":$(this).attr("refGuid")||''
							} 
							datas.billStatusObj.push(obj);
						} 
                        
                    })
					if(datas.billStatusObj.length>0){
						ufma.post('/gl/CbBillBook/saveVouCreateRuleSet', datas, function (result) {
							flag=result.flag;
							if(flag=="fail"){
								ufma.showTip(result.msg, function () {}, 'warning');
							}else if(flag=="success"){
								
								ufma.showTip(result.msg, function () {
									_close();
								}, 'success');
							}
						})
					}else{
						ufma.showTip('请填写正确的数据！', function () {}, 'warning');
					}

                });
               
			},
			init: function() {
				page.initPage();
                page.onEventListener();
                //三个点的初始化
                $('.uf-buttonedit').ufButtonedit({
                    onBtnClick:function(sender,api){
                        //调取父页面的方法
                        parent.window.openAgy(sender.attr('id'));
                        
                    }
                });
			}
		}
	}();

	page.init();
});
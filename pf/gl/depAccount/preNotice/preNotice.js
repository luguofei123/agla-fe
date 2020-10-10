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
					"billTypeCode": "4",//预收账款

				}
				ufma.post('/gl/CbBillBook/selectVouCreateRuleSet', wwt, function (result) {
					for(var i=0;i<result.data.length;i++){
						if(result.data[i].billStatus=='01'){//登记业务凭证模板
							page.appendHtml('dj',result.data[i])
						}else if(result.data[i].billStatus=='07'){//核销业务凭证模板
							page.appendHtml('hx',result.data[i])
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
						"billTypeCode": "4",//预收账款
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
                        $("button").attr("disabled",true);
						ufma.post('/gl/CbBillBook/saveVouCreateRuleSet', datas, function (result) {
							var flag=result.flag;
							if(flag=="fail"){
								ufma.showTip('保存失败！', function () {}, 'warning');
							}else if(flag=="success"){
								ufma.showTip('保存成功！', function () {
                                    _close();
								}, 'success');
							}
                            var timeId = setTimeout(function () {
                                $("button").attr("disabled",false);
                                clearTimeout(timeId)
                            },5000);
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
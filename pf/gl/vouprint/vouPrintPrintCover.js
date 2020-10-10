$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	function getPdf(reportCode, templId, groupDef) {
		var xhr = new XMLHttpRequest()
		var formData = new FormData()
		formData.append('reportCode', reportCode)
		formData.append('templId', templId)
		formData.append('groupDef', groupDef)
		xhr.open('POST', '/pqr/api/printpdfbydata', true)
		xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
		xhr.responseType = 'blob'

		//保存文件
		xhr.onload = function(e) {
			if(xhr.status === 200) {
				if(xhr.status === 200) {
					var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
					window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
				}
			}
		}

		//状态改变时处理返回值
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				//通信成功时
				if(xhr.status === 200) {
					//交易成功时
					ufma.hideloading();
				} else {
					var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
					//提示框，各系统自行选择插件
					alert(content)
					ufma.hideloading();
				}
			}
		}
		xhr.send(formData)
	}
    var page = function(){
    	
    	return{
    		
    		//加载凭证类型
			initVouType:function(result){
				var data = result.data;
				
				//循环把label填入#vppcVouTypeCode
				for(var i=0;i<data.length;i++){
					//创建凭证类型option(button)节点
					var $label =  $('<label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="vouType" id="">'+data[i].VOU_FULLNAME+'<span></span></label>');
					$('#vppcVouTypeCode').append($label);
				}
			},
    		
    		//加载会计主管
        	getFiLeader:function(result){
        		var data = result.data;
        		$("#vouPrintPrintCover #vppcFiLeader").val(data);
        		
        		//input内没有值，可以显示线
        		$("#vouPrintPrintCover .cover-box input[type='text']").each(function(){
        			if($(this).val()==""){
        				$(this).css({"border-bottom":"1px solid #333333"});
        			}else{
        				$(this).css({"border-bottom":"1px solid transparent"});
        			}
        		});
        	},
    		
    		initPage:function(){
    			page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
    			
    			//页面默认填入数据
    			$("#vouPrintPrintCover #vppcAgencyName").val(window.ownerData.data.agencyName);
    			$("#vouPrintPrintCover #vppcSetYear").val(window.ownerData.data.setYear);
    			$("#vouPrintPrintCover #vppcFisPerd").val(window.ownerData.data.fisPerd);
    			
    			//根据单位获取凭证类型/getVouType/"+searchListData.agencyCode+"/"+setYear
    			ufma.get("/gl/eleVouType/getVouType/"+window.ownerData.data.agencyCode+"/"+window.ownerData.data.setYear,"",page.initVouType);
    			
    			//根据单位和账套获取会计主管
    			ufma.get("/gl/eleCoacc/getFiLeader?agencyCode="+window.ownerData.data.agencyCode+"&acctCode="+window.ownerData.data.acctCode,"",this.getFiLeader);
    		},
			
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
				
				//点击取消的事件
				$('#btn-qx').click(function(){
            		_close("cancel");
            	});
            	
            	//点击打印的事件
            	$("#btn-print").click(function(){
//          		window.print();
//					$('.ufma-layout-up').printArea();
					
					//隐藏按钮
					$("#vouPrintPrintCover .ufma-layout-down").hide();
					
					//高度100%
					$("#vouPrintPrintCover .ufma-layout-up").css({"height":"100%","overflow":"hidden"});

//					$('#vouPrintPrintCover').printArea();
					
					//隐藏按钮
					$("#vouPrintPrintCover .ufma-layout-down").show();
					
					//高度100%
					ufma.parse();
					$("#vouPrintPrintCover .ufma-layout-up").css({"overflow":"auto"});
					//$("#vouPrintPrintCover .ufma-layout-up").css({"height":"480px","overflow":"auto"});
					//清除缓存
					var voudata =[{
						"COVER_PRINT": [{
							"remark": $("#remark").val(),
							"numberSum": $("#number-sum").val(),
							"vouMonth": $("#vppcFisPerd").val(),
							"numberNumStart":$("#number-num-s").val(),
							"binder": $("#binder").val(),
							"volumeNum": $("#volume-num").val(),
							"dateEnd":  $("#date-e").val(),
							"agencyName": $("#vppcAgencyName").val(),
							"volumeSum": $("#volume-sum").val(),
							"dateStart": $("#date-s").val(),
							"vouTypeNO": $("#vouTypeNO").val(),
							"vppcFiLeader": $("#vppcFiLeader").val(),
							"vouYear": $("#vppcSetYear").val(),
							"numberNumEnd": $("#number-num-e").val()
						}]
					}]
					
					var pData = JSON.stringify(voudata);
					getPdf('COVER_PRINT', '*', pData)
            	});
            	
            	//input移入显示线，移出没有内容显示线
            	$("#vouPrintPrintCover .cover-box input").focus(function(){
            		$(this).css({"border-bottom":"1px solid #333333"});
            	}).blur(function(){
            		if($(this).val()!=""){
        				$(this).css({"border-bottom":"1px solid transparent"});
        			}
            	});
            }
        }
    }();
/////////////////////
    page.init();
});
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
    		
    		initPage:function(){
    			page.reslist = ufma.getPermission();
				//权限判断
				ufma.isShow(page.reslist);
    			
    			//页面默认填入数据
    			$("#rptPrintPrintCover #rppcAgencyName").val(window.ownerData.data.agencyName);
    			$("#rptPrintPrintCover #rppcRptName").val(window.ownerData.data.rptName);
    			$("#rptPrintPrintCover #rppcSetYear").val(window.ownerData.data.setYear);
    			
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
					// $("#rptPrintPrintCover .ufma-layout-down").hide();
					
					//高度100%
					// $("#rptPrintPrintCover .ufma-layout-up").css({"height":"100%","overflow":"hidden"});

//					$('#rptPrintPrintCover').printArea();
					
					//隐藏按钮
//					$("#rptPrintPrintCover .ufma-layout-down").show();
					var voudata =[{
						"COVER_ACCOUNT_PRINT": [{
							"agencyName": $("#rppcAgencyName").val(),
							"accountBookName": $("#rppcRptName").val(),
							"accountYear": $("#rppcSetYear").val(),
							"volumeNum":$("#volume-num").val(),
							"volumeSum": $("#volume-sum").val(),
							"numberNumStart":  $("#pages").val(),
							"numberNumEnd": $("#pagee").val(),
							"numberSum": $("#pagen").val(),
							"remark": $("#remark").val()
						}]
					}]
					
					var pData = JSON.stringify(voudata);
					getPdf('COVER_ACCOUNT_PRINT', '*', pData)
					
					//高度100%
//					ufma.parse();
//					$("#rptPrintPrintCover .ufma-layout-up").css({"overflow":"auto"});
					//$("#rptPrintPrintCover .ufma-layout-up").css({"height":"480px","overflow":"auto"});
            	});
            	
            	//input移入显示线，移出没有内容显示线
            	$("#rptPrintPrintCover .cover-box input[type='text']").focus(function(){
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
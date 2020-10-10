$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	var odata = window.ownerData;
	var svData = ufma.getCommonData();
	//定义dataTables全局变量
    var page = function(){
    	return{
			getPdf:function(datas){
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				formData.append('reportCode', 'RPT_CATALOG_PRINT')
				formData.append('templId', "*")
				formData.append('groupDef', JSON.stringify(datas))
				if (datas.length == 0) {
					ufma.showTip('发生额与余额都为零，不需打印')
					return false;
				}
				xhr.open('POST', '/pqr/api/printpdfbydata', true)
				xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
				xhr.responseType = 'blob'

				//保存文件
				xhr.onload = function (e) {
					if (xhr.status === 200) {
						if (xhr.status === 200) {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
						}
					}
				}

				//状态改变时处理返回值
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						//通信成功时
						if (xhr.status === 200) {
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
			},
			gettable:function(){
				var data = odata.yemadata
				var tr = ''
				for(var i=0;i<data.length;i++){
					tr+='<tr><td class="acconame">'+data[i].accoName+'</td><td class="pageinput"><input type="input"  value='+data[i].pageAllNum+' class="pageAllNum"></td>'
					tr+='<td class="pageinput"><input type="input" value='+data[i].endPage+' class="endPage"></td>'
					tr+='<td class="pageinput"><input type="input"  value='+data[i].totalPage+' class="totalPage"></td></tr>'
				}
				$("#rpps-data").find('tbody').html(tr)
				$("#titles").html('科目'+odata.formatTmplCode+'目录')
			},
			onEventListener:function(){
				//确保录入为数字
				$(document).on("blur",'.pageinput input',function(){
					var c = $(this);
					if(/[^\d]/.test(c.val())) { //替换非数字字符  
						var temp_amount = c.val().replace(/[^\d]/g, '');
						if(temp_amount == ''){
							$(this).val(0);
						}else{
							$(this).val(parseFloat(temp_amount).toFixed(0));
						}
					}
				})
				//点击确认按钮
				$('#btn-confirm').click(function(){
					var GL_RPT_CATALOG_HEAD =[{
						"titleType": $("#titles").html(),
						"dwztControl": odata.agency+' '+odata.acct,
						"dyrq": svData.svTransDate,
						"dyr": svData.svUserName
					}]
					var GL_RPT_CATALOG_DATA =[]
					for(var i=0;i<$("#rpps-data").find('tbody').find('tr').length;i++){
						var that = $("#rpps-data").find('tbody').find('tr').eq(i)
						var key = {
							"accoName":that.find('.acconame').html(),
							"pageAllNum": that.find(".pageAllNum").val(),
							"endPage": that.find(".endPage").val(),
							"totalPage": that.find(".totalPage").val()
						}
						GL_RPT_CATALOG_DATA.push(key)
					}
					var datass = [{
						"GL_RPT_CATALOG_HEAD": GL_RPT_CATALOG_HEAD,
						"GL_RPT_CATALOG_DATA":GL_RPT_CATALOG_DATA
					}]
					page.getPdf(datass)
				});
				
				//点击取消的事件
				$('#btn-qx').click(function(){
            		_close();
            	});
			},
    		initPage:function(){
				page.gettable()
				page.onEventListener()
			},
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
            }
        }
    }();
/////////////////////
    page.init();
});
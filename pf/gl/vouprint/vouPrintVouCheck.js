$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
	var vouTypeArray={};
	//定义表格传输数据对象
	var checkData = {
		acctCode:"",
		agencyCode:"",
		fisPerd:""
	};

    var page = function(){
    	
    	return{
    		
    		//断号运算
    		numFormat:function(num){
    			var num = num.toString();
    			if(num.length<4){
    				var l = num.length;
				    for(var i=0;i<(4-l);i++){
				        num="0"+num;
				    }
				}
    			return num;
    		},
    		getVouTypeNameByCode:function(key){
				
				return vouTypeArray[key];
			},
    		//填入表格数据
    		getVouCheckData:function(result){
    			var data = result.data;
    			
    			//循环判断填写数据
    			for(var i=0;i<data.length;i++){
    				var typeCode = data[i].vouTypeCode;
    				//小计
					$("#vpvcTable tbody tr.data-sum[data-typecode='"+typeCode+"']").find("td[data-role='sum']").text(data[i].vouCount);
					
					//填入数据
					for(var j=0;j<data[i].checkVou.length;j++){
						switch(data[i].checkVou[j].vouStatus){
							case "P":
								$("#vpvcTable tbody tr[data-typecode='"+typeCode+"']").find("td[data-status='P']").text(data[i].checkVou[j].vouCount);
								break;
							case "A":
								$("#vpvcTable tbody tr[data-typecode='"+typeCode+"']").find("td[data-status='A']").text(data[i].checkVou[j].vouCount);
								break;
							case "O":
								$("#vpvcTable tbody tr[data-typecode='"+typeCode+"']").find("td[data-status='O']").text(data[i].checkVou[j].vouCount);
								break;
							case "C":
								$("#vpvcTable tbody tr[data-typecode='"+typeCode+"']").find("td[data-status='C']").text(data[i].checkVou[j].vouCount);
								break;
							default:
								break;
						}
					}
					
					//没断号隐藏断号：和重新排序
					if(data[i].noList.length>1 || (data[i].noList.length==1 && data[i].noList[0].beginVouNo != '0001')){
						$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .dl-horizontal").show();
						$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .reordering").show();
					}else{
						$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .dl-horizontal").hide();
						$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .reordering").hide();
					}
					
					//字号信息
					var $ul = $('<ul class="list-unstyled"></ul>');
					var $ul2 = $('<ul class="list-unstyled"></ul>');
					var issyg = 0
					for(var k=0;k<data[i].noList.length;k++){
						var $li = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].endVouNo+'</li>');
						$ul.append($li);
					}
					for(var k=0;k<data[i].lackNoList.length;k++){
						var $li2 = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].lackNoList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].lackNoList[k].endVouNo+'</li>');
						$ul2.append($li2);
					}
					$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .info").append($ul);
					$("#vpvcTable tr[data-typecode='"+typeCode+"'] td.list-info .dl-horizontal dd").append($ul2);
    				
    				
//  				switch(data[i].vouTypeCode){
//  					//根据凭证类型判断数据填写位置
//  					case "ZZ":
//  						//小计
//  						$("#vpvcTable tbody tr.data-sum[data-typecode='ZZ']").find("td[data-role='sum']").text(data[i].vouCount);
//  						
//  						//填入数据
//  						for(var j=0;j<data[i].checkVou.length;j++){
//  							switch(data[i].checkVou[j].vouStatus){
//  								case "P":
//  									$("#vpvcTable tbody tr[data-typecode='ZZ']").find("td[data-status='P']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "A":
//										$("#vpvcTable tbody tr[data-typecode='ZZ']").find("td[data-status='A']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "O":
//										$("#vpvcTable tbody tr[data-typecode='ZZ']").find("td[data-status='O']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "C":
//										$("#vpvcTable tbody tr[data-typecode='ZZ']").find("td[data-status='C']").text(data[i].checkVou[j].vouCount);
//  									break;
//  								default:
//  									break;
//  							}
//  						}
//  						
//  						//没断号隐藏断号：和重新排序
//  						if(data[i].noList.length>1){
//  							$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .dl-horizontal").show();
//  							$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .reordering").show();
//  						}else{
//  							$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .dl-horizontal").hide();
//  							$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .reordering").hide();
//  						}
//  						
//  						//字号信息
//  						var $ul = $('<ul class="list-unstyled"></ul>');
//  						var $ul2 = $('<ul class="list-unstyled"></ul>');
//  						for(var k=0;k<data[i].noList.length;k++){
//  							var $li = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].endVouNo+'</li>');
//  							$ul.append($li);
//  							if(k!=0){
//  								var $li2 = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k-1].endVouNo)+1)+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k].beginVouNo)-1)+'</li>');
//  								$ul2.append($li2);
//  							}
//  						}
//  						$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .info").append($ul);
//  						$("#vpvcTable tr[data-typecode='ZZ'] td.list-info .dl-horizontal dd").append($ul2);
//  						break;
//  					case "FK":
//  						//小计
//  						$("#vpvcTable tbody tr.data-sum[data-typecode='FK']").find("td[data-role='sum']").text(data[i].vouCount);
//  						
//  						//填入数据
//  						for(var j=0;j<data[i].checkVou.length;j++){
//  							switch(data[i].checkVou[j].vouStatus){
//  								case "P":
//  									$("#vpvcTable tbody tr[data-typecode='FK']").find("td[data-status='P']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "A":
//										$("#vpvcTable tbody tr[data-typecode='FK']").find("td[data-status='A']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "O":
//										$("#vpvcTable tbody tr[data-typecode='FK']").find("td[data-status='O']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "C":
//										$("#vpvcTable tbody tr[data-typecode='FK']").find("td[data-status='C']").text(data[i].checkVou[j].vouCount);
//  									break;
//  								default:
//  									break;
//  							}
//  						}
//  						
//  						//没断号隐藏断号：和重新排序
//  						if(data[i].noList.length>1){
//  							$("#vpvcTable tr[data-typecode='FK'] td.list-info .dl-horizontal").show();
//  							$("#vpvcTable tr[data-typecode='FK'] td.list-info .reordering").show();
//  						}else{
//  							$("#vpvcTable tr[data-typecode='FK'] td.list-info .dl-horizontal").hide();
//  							$("#vpvcTable tr[data-typecode='FK'] td.list-info .reordering").hide();
//  						}
//  						
//  						//字号信息
//  						var $ul = $('<ul class="list-unstyled"></ul>');
//  						var $ul2 = $('<ul class="list-unstyled"></ul>');
//  						for(var k=0;k<data[i].noList.length;k++){
//  							var $li = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].endVouNo+'</li>');
//  							$ul.append($li);
//  							if(k!=0){
//  								var $li2 = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k-1].endVouNo)+1)+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k].beginVouNo)-1)+'</li>');
//  								$ul2.append($li2);
//  							}
//  						}
//  						$("#vpvcTable tr[data-typecode='FK'] td.list-info .info").append($ul);
//  						$("#vpvcTable tr[data-typecode='FK'] td.list-info .dl-horizontal dd").append($ul2);
//  						break;
//  					case "SK":
//  						//小计
//  						$("#vpvcTable tbody tr.data-sum[data-typecode='SK']").find("td[data-role='sum']").text(data[i].vouCount);
//  						
//  						//填入数据
//  						for(var j=0;j<data[i].checkVou.length;j++){
//  							switch(data[i].checkVou[j].vouStatus){
//  								case "P":
//  									$("#vpvcTable tbody tr[data-typecode='SK']").find("td[data-status='P']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "A":
//										$("#vpvcTable tbody tr[data-typecode='SK']").find("td[data-status='A']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "O":
//										$("#vpvcTable tbody tr[data-typecode='SK']").find("td[data-status='O']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "C":
//										$("#vpvcTable tbody tr[data-typecode='SK']").find("td[data-status='C']").text(data[i].checkVou[j].vouCount);
//  									break;
//  								default:
//  									break;
//  							}
//  						}
//  						
//  						//没断号隐藏断号：和重新排序
//  						if(data[i].noList.length>1){
//  							$("#vpvcTable tr[data-typecode='SK'] td.list-info .dl-horizontal").show();
//  							$("#vpvcTable tr[data-typecode='SK'] td.list-info .reordering").show();
//  						}else{
//  							$("#vpvcTable tr[data-typecode='SK'] td.list-info .dl-horizontal").hide();
//  							$("#vpvcTable tr[data-typecode='SK'] td.list-info .reordering").hide();
//  						}
//  						
//  						//字号信息
//  						var $ul = $('<ul class="list-unstyled"></ul>');
//  						var $ul2 = $('<ul class="list-unstyled"></ul>');
//  						for(var k=0;k<data[i].noList.length;k++){
//  							var $li = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].endVouNo+'</li>');
//  							$ul.append($li);
//  							if(k!=0){
//  								var $li2 = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k-1].endVouNo)+1)+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k].beginVouNo)-1)+'</li>');
//  								$ul2.append($li2);
//  							}
//  						}
//  						$("#vpvcTable tr[data-typecode='SK'] td.list-info .info").append($ul);
//  						$("#vpvcTable tr[data-typecode='SK'] td.list-info .dl-horizontal dd").append($ul2);
//  						break;
//  					case "JZ":
//  						//小计
//  						$("#vpvcTable tbody tr.data-sum[data-typecode='JZ']").find("td[data-role='sum']").text(data[i].vouCount);
//  						
//  						//填入数据
//  						for(var j=0;j<data[i].checkVou.length;j++){
//  							switch(data[i].checkVou[j].vouStatus){
//  								case "P":
//  									$("#vpvcTable tbody tr[data-typecode='JZ']").find("td[data-status='P']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "A":
//										$("#vpvcTable tbody tr[data-typecode='JZ']").find("td[data-status='A']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "O":
//										$("#vpvcTable tbody tr[data-typecode='JZ']").find("td[data-status='O']").text(data[i].checkVou[j].vouCount);
//  									break;
//									case "C":
//										$("#vpvcTable tbody tr[data-typecode='JZ']").find("td[data-status='C']").text(data[i].checkVou[j].vouCount);
//  									break;
//  								default:
//  									break;
//  							}
//  						}
//  						
//  						//没断号隐藏断号：和重新排序
//  						if(data[i].noList.length>1){
//  							$("#vpvcTable tr[data-typecode='JZ'] td.list-info .dl-horizontal").show();
//  							$("#vpvcTable tr[data-typecode='JZ'] td.list-info .reordering").show();
//  						}else{
//  							$("#vpvcTable tr[data-typecode='JZ'] td.list-info .dl-horizontal").hide();
//  							$("#vpvcTable tr[data-typecode='JZ'] td.list-info .reordering").hide();
//  						}
//  						
//  						//字号信息
//  						var $ul = $('<ul class="list-unstyled"></ul>');
//  						var $ul2 = $('<ul class="list-unstyled"></ul>');
//  						for(var k=0;k<data[i].noList.length;k++){
//  							var $li = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].beginVouNo+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+data[i].noList[k].endVouNo+'</li>');
//  							$ul.append($li);
//  							if(k!=0){
//  								var $li2 = $('<li>'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k-1].endVouNo)+1)+'~'+page.getVouTypeNameByCode(data[i].vouTypeCode)+"-"+page.numFormat(parseInt(data[i].noList[k].beginVouNo)-1)+'</li>');
//  								$ul2.append($li2);
//  							}
//  						}
//  						$("#vpvcTable tr[data-typecode='JZ'] td.list-info .info").append($ul);
//  						$("#vpvcTable tr[data-typecode='JZ'] td.list-info .dl-horizontal dd").append($ul2);
//  						break;
//						default:
//							break;
//  				}
    			}
    		},
    		
    		//加载表格
    		initVouCheckTable:function(){
    			var data = window.ownerData.data;
    			console.log(data)
    			$("#vouPrintVouCheck #vpvcTable tbody").html("");
    			//循环添加每个凭证类型
    			console.log(data.vouKind)
    			for(var i=0;i<data.vouKind.length;i++){
    				var $kindFirst = $('<tr data-typeCode="'+data.vouKind[i].CHR_CODE+'">'
    					+'<td rowspan="5">'+data.vouKind[i].VOU_FULLNAME+'</td>'
    					+'<td>已记账</td><td data-status="P">0</td>'
    					+'<td rowspan="5" class="list-info"><div class="info"></div><dl class="dl-horizontal"><dt>断号：</dt><dd></dd></dl><a href="javascript:;" class="btn-reordering reordering">重新排序</a></td>'
    					+'</tr>');
    				$("#vouPrintVouCheck #vpvcTable tbody").append($kindFirst);
    				var $kindOther = $('<tr data-typeCode="'+data.vouKind[i].CHR_CODE+'"><td>已审核</td><td data-status="A">0</td></tr>'
    					+'<tr data-typeCode="'+data.vouKind[i].CHR_CODE+'"><td>未审核</td><td data-status="O">0</td></tr>'
    					+'<tr data-typeCode="'+data.vouKind[i].CHR_CODE+'"><td>作废</td><td data-status="C">0</td></tr>'
    					+'<tr data-typeCode="'+data.vouKind[i].CHR_CODE+'" class="data-sum"><td>小计</td><td data-role="sum">0</td>'
    					+'</tr>');
					$("#vouPrintVouCheck #vpvcTable tbody").append($kindOther);
    			}
    			
    			//表格数据填入
    			checkData.acctCode = window.ownerData.data.acctCode;
				checkData.agencyCode = window.ownerData.data.agencyCode;
				checkData.fisPerd = window.ownerData.data.fisPerd;
    			ufma.post("/gl/print/checkVou",checkData,this.getVouCheckData);
    		},
    		
    		initPage:function(){
    			//标题月份
    			$("#vouPrintVouCheck .monthNum").text(window.ownerData.data.fisPerd);
    			
    			//表格加载
    			this.initVouCheckTable();
    			
    			
    		},
			
            //此方法必须保留
            init:function(){
				this.initPage();
				ufma.parse();
				vouTypeArray=window.ownerData.data.vouTypeArray;
				page.needRefresh = false;
				//点击关闭的事件
				$('#btn-close').click(function(){
            		_close(page.needRefresh);
            	});
            }
        }
    }();
/////////////////////
    page.init();
    $(document).on("click",".reordering",function(){
		ufma.open({
            title: '凭证重排序',
            width: 950,
//                      height: 400,
            url: '../sortVoucher/sortVoucher.html',
            data: {
                setYear: window.ownerData.setYear,
                agencyCode: window.ownerData.data.agencyCode,
                acctCode: window.ownerData.data.acctCode,
                fisPerd:window.ownerData.data.fisPerd,
                acctype:$(this).parents('tr').attr('data-typecode'),
                isDouble:window.ownerData.isDouble
            },
            ondestory: function(result) {
				page.initVouCheckTable();
            }
        });
	});
});
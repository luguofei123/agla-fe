$(function(){
	window._close=function(reData){
        if (window.closeOwner){
            var data = {
            	reData:reData
            };
            window.closeOwner(data);
        }
    }

    var page = function(){
    	
    	return{
    		
    		setDayInDay:function(){
				var mydate = new Date();
				Year=mydate.getFullYear();
				Month=(mydate.getMonth()+1);
				Month = Month<10?('0'+Month):Month;
				Day=mydate.getDate();
				Day = Day<10?('0'+Day):Day;
				$('#vbrvVouDate').val(Year+'-'+Month+'-'+Day);
			},
			
			//$.ajax()，获取数据数据成功，给凭证类型下拉列表添加option
			initVouType:function(result){
				var data = result.data;
				//循环把option填入select
				var $vouTypeOp = '';
				for(var i=0;i<data.length;i++){
					//创建凭证类型option节点
					$vouTypeOp += '<option value="'+data[i].CHR_CODE+'">'+data[i].CHR_NAME+'</option>';
				}
				$('#vbrvVouType').append($vouTypeOp);
			},
    		
            //此方法必须保留
            init:function(){
            	ufma.parse();
            	
            	page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
            	
            	//加载凭证类型
				ufma.get("/gl/eleVouType/getVouType/"+window.ownerData.data.agencyCode+"/"+window.ownerData.data.setYear,"",page.initVouType);
            	
            	var  Year, Month, Day;
				this.setDayInDay();
            	
            	//datetimepicker
            	$("#vouBoxRedVoucher").find("#vbrvVouDate").datetimepicker({
				    format: 'yyyy-mm-dd',
			        autoclose: true,
			        todayBtn: true,
			        startView: 'month',
			        minView:'month',
			        maxView:'decade',
			        language: 'zh-CN'
				});
            	
            	//点击保存
        		$("#btn-save").click(function(){
        			var postData = {
        				vouGuid:window.ownerData.data.vouGuid,
        				vouDate:$("#vouBoxRedVoucher #vbrvVouDate").val(),
        				vouType:$("#vouBoxRedVoucher #vbrvVouType option:selected").val(),
        				ysvouType:''
        			};
					var callback = function(result){
						ufma.showTip(result.msg, function() {}, "success");
						_close({action:"success",msg:result.msg});
					}
					ufma.post("/gl/vou/redVoucher",postData,callback);
            	});
            	
            	//点击取消
            	$("#btn-qx").click(function(){
            		_close({action:"cancel"});
            	});
            }
        }
    }();
/////////////////////
    page.init();
});
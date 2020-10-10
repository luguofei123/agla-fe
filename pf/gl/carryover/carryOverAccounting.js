$(function(){
	window.close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
    var page = function(){
    	
    	var timerId; 
        
    	return{
    		
			initPage:function(){
	    		console.log(window.ownerData);
	    		
	    		var data = window.ownerData.data;
//	    		var callback;
	    		//判断action
	    		if(window.ownerData.action=='closeAccount'){
	    			console.log(data);
	    			
	    			callback = function(result){
	    				var progressValue = result.progressValue;
	    				console.log(progressValue);
	    			}
	    			
	    			ufma.post("/gl/CarryOver/doCarryVou",data,callback);
	    		}else if(window.ownerData.action=='unCloseAccount'){
//	    			var data = window.ownerData.data;
	    			console.log(data);
	    			
//	    			callback = function(result){
//	    				var progressValue = result.progressValue;
//	    				console.log(progressValue);
//	    			}
//	    			
//	    			ufma.post("/gl/CarryOver/cancelCarryVou",data,callback);
	    			
	    			//使用JQuery从后台获取JSON格式的数据  
	                $.ajax({  
	                   type:"post",//请求方式  
	                   url:"/gl/CarryOver/cancelCarryVou",//发送请求地址  
	                   timeout:30000,//超时时间：30秒  
	                   dataType:"json",//设置返回数据的格式  
	                   data:JSON.stringify(data),
	                   //请求成功后的回调函数 data为json格式  
	                   success:function(data){  
	                      if(data.progressValue>=100){  
	                         window.clearInterval(timerId);  
	                      }  
	                      $('.progress-bar').progressbar('setValue',data.progressValue);  
	                  },  
	                  //请求出错的处理  
	                  error:function(){  
	                     window.clearInterval(timerId);  
	                     alert("请求出错");  
	                  }  
	               }); 
	    			
	    		}
			},
			
            //此方法必须保留
            init:function(){
            	console.log(window.ownerData);
            	
            	timerId=window.setInterval(this.initPage,500);
				
				//点击关闭的事件
				$('#btn-close').on('click',function(){
					close('close');
                });
            	
            }
        }
    }();
    page.init();
});
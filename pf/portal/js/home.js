$(function(){
	
	//右侧fixed中的动画效果
	$("#work a").click(function(){
		$("#recent_work_div").animate({"right":"37"},200);
	})
	$("#recent_work_div").mouseleave(function(){
		$(this).animate({"right":"-300"},200);
	})
	//top栏事件
		$(".nav .dropdown a").click(function(){
			var i = $(this).parent("li").index();
			$(".toggle").each(function(){
				$(this).hide();
			});
			console.log(i);
			if(!$(".toggle").eq(i).hasClass("null")){
				$(".toggle").eq(i).show();
			}			
		});

	$(".toggle").mouseleave(function(){
		$(".toggle").each(function(){
			$(this).hide();
		});
		
	});
	
	
//head获取当前年月日
		getTime();
	
	//head获取当前年月日
	function getTime(){
		var myDate = new Date();
		var Year=myDate.getFullYear();
		var Month=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var Today=myDate.getDate();        //获取当前日(1-31)
		var Day=myDate.getDay(); 
		var week = "星期" + "日一二三四五六".split("")[Day];
		var time="";
		time+=Year+'年'+Month+'月'+Today+'日'+'&nbsp;&nbsp;'+week;
		$("#time").append(time);
	}
	
	function color(){
		
		     
		     
		     
	}
	
	
	
	//侧栏去掉鼠标冒泡
	$("#sidebar ul li p").addClass("has-open");
	$("#sidebar ul li").eq(0).addClass('active');
	$("#sidebar ul li p").mouseover(function(){
		
		var i = $(this).parent("li").index();
		$(".two-level").each(function(){
			$(this).hide();
		});
		if(!$(".two-level").eq(i).hasClass("null")){
			$(".two-level").eq(i).slideDown();
		}
	})
	$(".two-level").mouseleave(function(){
		$(".two-level").each(function(){
			$(this).slideUp();
		})
		
	});
	

	var flag=false;
	$("#sidebar-btn").click(function(){
	
		if(flag){
			$("#sidebar ul li p").removeClass('has-close');
			$("#sidebar ul li p").addClass('has-open');
			
		}else{
			$("#sidebar ul li p").removeClass('has-open');
			$("#sidebar ul li p").addClass('has-close');

		}
		flag=!flag;
		
	})
	


	
})
$(function(){
	window.onload=function(){
		//获取head一级菜单
		getInitMenu();
		//head获取当前年月日
		getTime();
	}
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

	//获取tokenId方法
	getTokenId = function(){
    	var current_url = location.search;
		var tokenId = current_url.substring(current_url.indexOf("tokenid") + 8);
		return tokenId;
		
	}
	//菜单初始化方法
	getInitMenu = function(){
		var tokenId = getTokenId();
        $.ajax({
            url: "/df/menu/getAllMenu.do?tokenid=" + tokenId,
            type: 'GET',
            dataType: 'json',
			data: tokenId,
            success: function (data) {
            	var menuList = data.mapMenu;
            	var menuFirstLevelList ={};
            	var j=0;
            	for (var i = 0; i < menuList.length; i++){
            		if(menuList[i].levelno=='1'){
            			menuFirstLevelList[j] = menuList[i];
            			j++;
            		}
            	}
            	var menuHtml = '<ul>';
            	menuHtml += '<li><a href="#">首页</a></li>';
            	for (var i = 0; i < j-1; i++){
            		menuHtml +='<li><a href="'+ menuFirstLevelList[i].url + '?tokenid=' + tokenId +'">' +menuFirstLevelList[i].name +'</a></li>';
            	}
            	menuHtml +='</ul>';
            	$("#h-nav").append(menuHtml);
            		
            }
        });
	}
/*//左栏隐藏事件	
	$("#ss").click(function(){
		$("#main #left").removeClass('active');
		$("#main #left").addClass('hid');
		$('#main #center').css({
			"width":"985px",
			"left":"-=200px"
		});
		$("#center #set1").addClass("active");
	});
//左栏显示事件
	$("#center #set1").click(function(){
		$(this).removeClass('hid');
		$("#main #left").addClass('active');
		$('#main #center').css({
			"width":"786px",
			"left":"218px",
		});
		$(this).removeClass('active');
		$(this).addClass("hid");
	})*/
	
	//左栏隐藏事件	
	$("#ss").click(function(){
		$("#main #left").hide(500,function(){
			$('#main #center').css({
				"left":"-=200px",
				"width":"+=200px",
			});
			$("#center #set1").addClass("active");
		});

	});
//左栏显示事件
	$("#center #set1").click(function(){
		$(this).removeClass('hid');
		$("#main #left").show(500);
		$('#main #center').css({
			"left":"218px",
			"width":"786px",
		});
		$(this).removeClass('active');
		$(this).addClass("hid");
	})
	

	//head隐藏部分
	$("#h-nav li a").mouseover(function(){
		$("#h-nav li").removeClass('bg');
		var i = $(this).parent("li").index();
		$(".menulist .menu").each(function(){
			$(this).hide();
		});
		if(!$(".menulist .menu").eq(i).hasClass("null")){
			$('.menulist').slideDown();
			$(".menulist .menu").eq(i).slideDown();
		}			
	});
	$(".menulist .menu").mouseleave(function(){
		$(".menulist .menu").each(function(){
			$(this).slideUp();
		})
		$("#h-nav li").eq(0).addClass('bg');
	});
//head右侧按钮	
	$("#h-btn").click(function(){
		var displayCss = $("#hid-btn").css("display");
		if(displayCss=='none'){
			$("#hid-btn").removeClass();
			$("#hid-btn").addClass('hid-btn-disp');
		}else{
			$("#hid-btn").removeClass();
			$("#hid-btn").addClass('hid-btn-none') 
		}
		
	});
	//left左边部分中的内容鼠标滑过事件
	$("#list-l li").mouseover(function(){
		var i =$(this).index();
		$("#list-l li").each(function(){
			$(this).css({"background":"#ffffff"});
			$("#list-l li").eq(i).css({"background":"#f5f5f5"})
		})
		$("#list-l li").mouseleave(function(){
			$("#list-l li").each(function(){
				$(this).css({"background":"#ffffff"});
			})
		})
	})
})
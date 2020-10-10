var int_keycode;
var cnt = 0;
var timer;
var timeout_url;
function backToLogin(){
    
    $('#timeOutRemaind').modal();
	$.ajax({
		url:"/pf/login/loginOut.do",
		type: 'GET',
		data:{},
		dataType: 'json',
		success: function (data){
			var url = data.url;
			localStorage.clear(); //清空前端缓存session  2019-02-25 by dangzw
			clearCookie("tokenid");
			clearCookie("JSESSIONID");
			//超时功能暂不进行跳转到登录页，等待用户点击确定才会跳转
			if(url != "" && url != null){				
				timeout_url = url;   
			}else{
				timeout_url = "/pf/portal/login/login.html"; 
			}
		}
	});
	
    
}
function isBackToLogin(){
    
    window.location.href="/pf/portal/login/login.html";
   
}
var keyPressListener;
//监听扫描枪输入事件
function scanCode() {
	var code = ''
	var lastTime, nextTime
	var lastCode, nextCode
	var that = this
	var scanTimer;
	//var temp = [];
	keyPressListener = window.document.onkeypress = function(e) {
	  if (window.event) { // IE
		nextCode = e.keyCode
	  } else if (e.which) { // Netscape/Firefox/Opera
		nextCode = e.which
	  }
	  //console.log(temp.join(","));
	  //如果100毫秒内没有触发下次键盘事件，下面的处理函数就会生效，如果100毫秒内触发了键盘事件，就取消请求发送，判断条件是防止用户扫描完按回车键导致请求无法发送
	  if(nextCode !== 13){
		scanTimer = null;
	  }
	  //每次输入都尝试在100毫秒后请求单据，如果在这100毫秒内没有后续输入，表示扫描枪输入完毕，就发送请求，否则就不发送请求
	  scanTimer = setTimeout(function(){
		if (code.length < 5) return //code.length < 5表示不存在连续的5个字符输入间隔小于30毫秒，这里判定为不是扫描枪输入
		console.log(code);
		//将扫描结果传给业务系统，获取单据数据
		$.ajax({
			url:"/lp/getBillData/selectBillByEwm",
			type:"GET",
			data:{"qrCode": code},
			dataType:"json",
			success: function(data){
				if( !(data.flag && data.flag === "fail") ){
					//var frames = $("iframe");
					var span = $("#min_title_list li.active span")[0];
					if(span.getAttribute("data-href").indexOf("/pf/lp/billSchemeQuery/billSchemeQuery.html") > -1){
						var index = $("#min_title_list li span").index(span);
						var frame = $(".show_iframe iframe").eq(index);
						frame = frame[0] || frame;
						
						frame.contentWindow.postMessage(data, "*");
					} else {
						var tempLink = $('<a href="#" data-href="/pf/lp/billSchemeQuery/billSchemeQuery.html" data-title="单据查询"></a>');
						Hui_admin_tab(tempLink);
						var frames = $("iframe");
						console.log('frames对象：',frames);
						for (var i = 0; i < frames.length; i++) {
							if(frames[i].src.indexOf("/pf/lp/billSchemeQuery/billSchemeQuery.html") > -1){
								console.log('frames readyState: ',frames[i].contentWindow.document.readyState);
								var _frame = frames[i];
								_frame.onload = function(){
									console.log('----frame.onload已运行----');
									console.log('已向frame发送data');
									return _frame.contentWindow.postMessage(data, "*");
								}
							}
						}
						
					}
				 } else {
				 	alert(data.msg);
				 }
			},
			error: function(e){
				console.log("获取单据异常:" + e);
				console.log("扫描结果为：" + code);
			}
		})

		code = ''
		lastCode = ''
		lastTime = ''
		return
	  }, 1000)
	  
	  nextTime = new Date().getTime()
	  //temp.push(nextTime - lastTime);
	  if (!lastTime && !lastCode) {
		code += e.key
	  }

	  if (lastCode && lastTime && nextTime - lastTime > 30) { // 当扫码前有keypress事件时,防止首字缺失
		code = e.key
	  } else if (lastCode && lastTime) {
		code += e.key
	  }
	  lastCode = nextCode
	  lastTime = nextTime
	}
  }
$(function(){
	//启动扫描枪监听
	scanCode();

    //监听鼠标移动
    document.onmousemove = function(e) {
       if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
       
    };
    //监听键盘事件
    document.onkeydown = function (e) {
        if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
      
    };
    //鼠标按下
    document.onmousedown = function(e){
        if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
    };

	var tokenId = getTokenId();
	var caroleguid = localStorage.select_role_guid==undefined?"":localStorage.select_role_guid;
	$.ajax({
		url:"/pf/portal/initIndex.do",
		type:"GET",
		data:{"tokenid":tokenId, "caroleguid":Base64.encode(caroleguid)},
		dataType:"json",
		async:false,
		success: function(data){
			// isLogin
			if(data.isLogin=="N"){
				window.location.href="/pf/portal/login/login.html";
			}
			// public params to localStorage
        	toLocalStorage(data.publicParam);
        	
        	// public params to hidden label
        	toHiddenLabel(data.publicParam);
        	$("#userName").html(Base64.decode(data.publicParam.svUserName));
        	$("#time-span").html(Base64.decode(data.publicParam.svTransDate));
        	//$('#time-span').fdatepicker({format : 'yyyy-mm-dd'});
        	$("#rolefont").html(Base64.decode(data.publicParam.svRoleName));
        	$("#rolefontname").html(Base64.decode(data.publicParam.svRoleName));
        	$("#empCode").val(Base64.decode(data.publicParam.svUserId));
        	userCode = Base64.decode(data.publicParam.svUserCode);
        	userId = Base64.decode(data.publicParam.svUserId);
        	rgCode = Base64.decode(data.publicParam.svRgCode);
        	svTransDate = Base64.decode(data.publicParam.svTransDate);
			svAgencyCode = Base64.decode(data.publicParam.svAgencyCode);
			svAccountCode = Base64.decode(data.publicParam.svAcctCode);
			svRoleId = Base64.decode(data.publicParam.svRoleId);
			svSetYear = Base64.decode(data.publicParam.svSetYear);
        	//首页名称
        	 $("#title").html(data.loginPageInfo.portalName);
        	 $("#toptitle").html(data.loginPageInfo.portalName);
			 
			 //请求当前角色的超时时间
			 $.ajax({
				url:"/pf/portal/getUserRoleInfo.do",
				type: 'GET',
				data:{'tokenId':tokenId,'roleId':svRoleId},
				dataType: 'json',
				success: function (data){
					var time = parseInt(data.datetime);
					//约定time为0表示不设置超时时间，这时候该角色不会超时
					if( time > 0 ){
						cnt = time;
						timer = setTimeout(backToLogin,cnt*1000);
					}
				},
				error: function(msg){
					console.log(msg);
				}
			  });
	
        	 if(data.loginPageInfo.isUseApplet=='Y'){
        		 $("#iframeId").attr("src","subPage.html?compoId=GLA_SHOW_PORTAL");
        		 $("#menuFrame").prop("src", "/pf/portal/admin/index/subPage.html?compoId=GLA_SHOW_PORTAL");
        		 $("#my_bills").css("display","none");
        	 }else if(data.loginPageInfo.isUseApplet=='A'){

                $("#iframeId").attr("src","/pf/portal/admin/index/subPage_cwy/zdshkj/zdshkj.html");


        		 // var role = Base64.decode(data.publicParam.svRoleCode);
        		 // if(role=="fm_role00"){
           //  		 $("#iframeId").attr("src","subPage_fanZ/subPage.html");
           //  		 $("#menuFrame").prop("src", "/pf/portal/admin/index/subPage_fanZ/subPage.html");
            	/**
            	 * 角色为出纳
            	 */
        		 // }else if(role == '666002'){
        			//  $("#iframeId").attr("src","/pf/portal/admin/index/subPage_cwy/chuna/chuna.html");
        		/**
        		 * 角色为制单会计
        		 */
        		 // }else if(role == '666003'){
        			//  $("#iframeId").attr("src","/pf/portal/admin/index/subPage_cwy/zdshkj/zdshkj.html");
        		/**
        		 * 角色为财务主管
        		 */
        		//  }else if(role == '666005'){
        		// 	 $("#iframeId").attr("src","/pf/portal/admin/index/subPage_cwy/cwfzr/cwfzr.html");            			 
        		//  }else{
        		// 	 $("#iframeId").attr("src","/pf/portal/admin/index/subPage_cwy/zdshkj/zdshkj.html");
        		//  }
        	 }else{
        		 
        		  $("#iframeId").attr("src","subpage2.html");
        		  $("#menuFrame").prop("src", "/pf/portal/admin/index/subpage2.html");
             }
			 
			  $("#iframeId").on("load", function(){
				$(document.getElementById('iframeId').contentWindow.document).on('keypress', keyPressListener);
				
				$(document.getElementById('iframeId').contentWindow.document).on('mousemove', function(e) {
						if(cnt > 0){
							clearTimeout(timer);
							timer = setTimeout(backToLogin,cnt*1000);
					}
    //  		   console.log(e.target);
					});
		
					//监听键盘事件
					$(document.getElementById('iframeId').contentWindow.document).on('keydown', function(e) {
						if(cnt > 0){
							clearTimeout(timer);
							timer = setTimeout(backToLogin,cnt*1000);
						}
					// console.log(e.target);
					});
				
					//鼠标按下
					$(document.getElementById('iframeId').contentWindow.document).on('mousedown', function(e) {
						if(cnt > 0){
							clearTimeout(timer);
							timer = setTimeout(backToLogin,cnt*1000);
						}
					
					});
				})
					
			}
	});
	getInitMenu();
	
//	getHandleMessage();
//	
//	window.setInterval("getHandleMessage()",1000*60);
	//我的单据待办事件
//	getMyBillData();
//	window.setInterval("getMyBillData()",1000*60*2);  
	/*
	 * 初始化切换角色
	 */	
	initSwitchRole();
	if(!isUserManager){
		 $("#toPortalManage").hide();
	}
	/*
	 * 初始化用户编辑
	 */
	initUserEdit();
	//键盘点击事件Key获取并赋值全局变量
    document.onkeydown = function(event_e){
	    var e = event_e || window.event  || event_e.which||arguments.callee.caller.arguments[0];
	    
	    int_keycode = e.charCode||e.keyCode; 
    }
	// $("#_sidebar_menu").height(1020);
	

	//刷新页面事件
	window.onbeforeunload = function(){
		
	    var commonData = localStorage.getItem("commonData");
	    var svTokenId = svUserId = tokenId = userId='';
		
		if(commonData!=''&&commonData!=undefined||commonData!=null){
			 svTokenId = JSON.parse(commonData).token;
		     svUserId = JSON.parse(commonData).svUserId;
			 userId = Base64.decode(svUserId);
			 tokenId = Base64.decode(svTokenId);
		}
		  try {
//		    var n = window.screenX - window.screenLeft;
//		    var b = n > document.documentElement.scrollWidth - 30;
			    console.log(int_keycode);
//			    if (int_keycode != 116 && (b || ((window.event.altKey) && (int_keycode == 115)))) {
			    if (int_keycode != 116 && ( ((window.event.altKey) && (int_keycode == 115)))) {
			    	$.ajax({
			    		url:"/pf/login/loginOut.do",
			    		type: 'GET',
			    		data:{'tokenId':tokenId,'userId':userId},
			    		dataType: 'text',
			    		success: function (data){
			    			if(data=="success"){
			    				console.log("浏览器关闭session销毁");
			    			}
			    		}
			    	});
			    }
		    
		  } catch (e) {
		  }
		};
	
	// init current time
	getTime();
	
	
	// 右侧，最近操作
	// $("#right-hid").mouseover(function(){
	// 	$(".fix").show();
	// })
	// $(".fix").mouseleave(function(){
	// 	$(".fix").hide();
	// })
	
	// // 右侧fixed中的动画效果
	// $("#work a").click(function(){
	// 	$("#recent_work_div").animate({"right":"3"},200);
	// })
	// $("#recent_work_div").mouseleave(function(){
	// 	$(this).animate({"right":"-300"},200);
	// 	$(".fix").hide();
	// })

	// top栏事件


   $('.userNameParent').on('click',function (event) {
        event.stopPropagation();//阻止事件冒泡
        $(this).siblings('.uName').toggle();
        // 修改业务日期成功
        $("#time-getter1").change(function(){
        	
            //判断所选业务日期是否超过授权日期，若超过则不允许更改业务日期
            var selectedDateStr = $(this).val();
            var selectedDate = new Date(selectedDateStr).getTime();
            if(licenseEndDate!=null&&licenseEndDate!=''){
                var licenseEndDateTime = new Date(licenseEndDate).getTime();
                var difDay = judgeTimeDiffer(selectedDate,licenseEndDateTime);
                if((licenseType == 0 && difDay < 0)||(licenseType == 1 && difDay<-180)){
                	ufma.showTip("您选择的业务日期已超过授权日期", function() {}, "warnning");
                	return;
                }
            }

        	
        	
                $("#time-span").text($(this).val());
                params = {};
                params['userId'] = userId;
                params['svTransDate'] = $(this).val();
                $.ajax({
                    url : "/pf/portal/saveTransDateToSession.do",
                    type : "GET",
                    dataType : "json",
                    data : params,
                    success : function(data) {
                        //alert("修改业务日期成功");
                    	setDataToLabelAndLocalStorage();
                    	window.location.reload();
                    }
                });
        });
        $("#time-getter2").change(function(){
        	
            //判断所选业务日期是否超过授权日期，若超过则不允许更改业务日期
            var selectedDateStr = $(this).val();
            var selectedDate = new Date(selectedDateStr).getTime();
            if(licenseEndDate!=null&&licenseEndDate!=''){
                var licenseEndDateTime = new Date(licenseEndDate).getTime();
                var difDay = judgeTimeDiffer(selectedDate,licenseEndDateTime);
                if((licenseType == 0 && difDay < 0)||(licenseType == 1 && difDay<-180)){
                	ufma.showTip("您选择的业务日期已超过授权日期", function() {}, "warnning");
                	return;
                }
            }
        	
        	
                $("#time-span").text($(this).val());
                params = {};
                params['userId'] = userId;
                params['svTransDate'] = $(this).val();
                $.ajax({
                    url : "/pf/portal/saveTransDateToSession.do",
                    type : "GET",
                    dataType : "json",
                    data : params,
                    success : function(data) {
                        //alert("修改业务日期成功");
                    	setDataToLabelAndLocalStorage();
                    	window.location.reload();
                    }
                });
        });
        // 修改业务日期结束
        
        //点击空白处，下拉框隐藏-------开始
        var tag = $(this).siblings('.uName');
         var tagp = $('.uName',window.parent);
        var flag = true;
        $(document).bind("click",function(e){//点击空白处，设置的弹框消失
            var target = $(e.target);
            if(target.closest(tag).length == 0 && flag == true){
                $(tag).hide();
                flag = false;
            }
        });
        var  len = window.frames.length;
       for (var i = 0; i <= len-1; i++) {
           
           $(window.frames[i].document).bind("click",function(e){//点击空白处，设置的弹框消失
                var target = $(e.target);
                if(target.closest(tagp).length == 0 && flag == true){
                    $(tag).hide();
                    flag = false;
                }
            });
       };
    
    });


    $("#roleName span").mouseover(function(){
            var roleNameLeh = $("#roleName>span").text().length;
            var roleName = $("#roleName>span").text();
            if(roleNameLeh >7){
                $("#roleNameBubble").css({'display':"block"});
                $("#roleNameBubblePic").css({'display':"block"});
                $("#roleNameBubble").html(roleName);
            }
        }).mouseleave(function(){
            $("#roleNameBubble").css({'display':"none"});
            $("#roleNameBubblePic").css({'display':"none"});
        })

	// $(".uName").mouseleave(function(){
		
	// 	$(".uName").slideUp(300);
	// })

	// 修改密码
	/*$("#dMenuInfo1").mouseleave(function(){
		$("#dropdown-menu1").hide();
	});
	
	// ??
	$("#dMenuInfo2").mouseleave(function(){
		$("#dropdown-menu2").hide();
	});
	*/
	// document.getElementById('iframeF').contentWindow.document.body.scrollTop;


	$(window).scroll(function(event){  
	    var wScrollY = window.scrollY; // 当前滚动条位置
	    var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
	    var bScrollH = document.body.scrollHeight; // 滚动条总高度
	// alert("调用成功！"+temp);
	    if (wScrollY + wInnerH >= 800) {            
	       // showMore();
	       // window.menuFrame.testScollEvent(1);
	      // alert("调用成功！"+temp);
	     // parent.frames["menuFrame"].window.testScollEvent(1);
	      }
    }); 
/*
 * 
 * window.onscroll= function(){ //变量t是滚动条滚动时，距离顶部的距离 var t =
 * document.documentElement.scrollTop||document.body.scrollTop; var scrollup =
 * document.getElementById('scrollup'); //当滚动到距离顶部200px时，返回顶部的锚点显示 if(t>=200){
 * scrollup.style.display="block"; }else{ //恢复正常 scrollup.style.display="none"; } }
 */

	//版权  菜单收起 事件
     var i=1;
	$("#sidebar-btn").click(function(){
        
	   var ou=i%2;
		// var displayCss = $(".main-sidebar").css("z-index");
		if(!ou){
			$("#copyright").show(500);
			$("#Z_TypeList").css("width","168px");
            $('.Hui-tabNav-wp').css('paddingRight','0');
            $(".Z_MenuList").css("width","168px");
            $(".list-item").css("width","168px");
            $(".list-item a span").css("display","block");
            
			$("#workPlatClick").click();
            i++;
		}else{
			if($('#iframe_box>div:first').css('display') === 'block')$('.Hui-tabNav-wp').css('paddingRight','16px');
			$('.Hui-tabNav-wp').css('paddingRight','16px');
			$("#copyright").hide(100);
            $(".Z_MenuList").css("width","68px");
			$("#Z_TypeList").css("width","68px");
			$(".list-item").css("width","68px");
            $(".list-item a span").css("display","none");
            $("#workPlatClick").click();

            i++;
		}
	});

	//domListen($("#sidebar-btn"));
	//document.onmousemove = mouseMove;

	//置顶按钮方法
/*	$("#up").click (function() {
		var timer = setInterval(function() {
			window.scrollBy(0, -50);
			if (document.body.scrollTop == 0) {
				clearInterval(timer);
			};
		}, 2);
	})
	window.onscroll = function() {
		var y = window.scrollY;
		//clientH=document.body.clientHeight/2;
		if(y>=100){
			$("#up").css({"display":"block"});
		}else{
			$("#up").css({"display":"none"});
		}
	}*/
	
	$(".nav .mesbtn ").click(function(){
		var displayCss = $(".mes").css("display");
		if(displayCss=='none'){
			$(".mes").slideDown(500);
		}else{
			$(".mes").slideUp(300);
		}
	})

	$(".mes").mouseleave(function(){
		$(".mes .message li a img").attr("src","img/finished.png");
		$("#bell").removeClass("bell");
		$("#bell").attr("src","img/bell.png");
		$(".mes").slideUp(300);
	})
	//跨域监听  打开页签菜单
     window.addEventListener('message',function(e){
    //if(e.source!=window.parent) return;
        var hrefStr= e.data.href;
        var titleStr= e.data.title;
        var href = $(this).attr('data-href',hrefStr);
        var title = $(this).attr("data-title",titleStr);
        Hui_admin_tab($(this));
     },false);

	/*//点击我的单据
	$('#bills a').on('click',function (e) {
		console.log(2);
		e.preventDefault();
		// 模拟单据
		var code = $(this).attr('code'), bills = [],text = $(this).text();
		//依据code从后台取出bills
		if(code == '1'){
            bills = [
            	{items:SR_BKSQNum,href:'/pf/sssfm/incmAndExps/income/clctByTax/sssfmIncomeTaxList.action?actionType=list&menuname=地税征缴收入&menuid=3E5B4B97C08E4C92A6A3CC702218539B',title:'地税征缴收入'},
            	{items:SR_DJNum,href:'/pf/sssfm/incmAndExps/income/clctByAgcy/incomeAgency/sssfmIncomeAgencyList.action?actionType=list&itemBizKind=INS_IN,INSTEREST_IN,OTHER_IN&pageTitle=经办机构转入&compoId=sssfm_income_agency_clct_by_agcy&menuname=经办机构转入&menuid=41DCB4CD445A4D8A8C432B883D2745EE',title:'经办机构转入'},
            	{items:SR_LXNum,href:'/pf/sssfm/incmAndExps/income/clctByInterest/incomeInterest/sssfmIncomeInterestList.action?actionType=list&menuname=专户利息收入&menuid=700CB7356F5741CD9F48309371068A16',title:'专户利息收入'},
            	{items:SR_CZBZSQNum,href:'/pf/sssfm/incmAndExps/income/clctByFunSupply/sssfmIncomeFinSupplyList.action?actionType=list&menuid=763884A0EB5247E490809E346056A1CB&menuname=财政补贴收入',title:'财政补贴收入'}
            ];
            //bills
		}else if(code == '2') {
            bills = [
            	{items:ZF_BKSQANum,href:'/pf/sssfm/incmAndExps/expenses/appropriation/expendAllocate/sssfmExpendAllocAppList.action?actionType=list&menuid=A152724FF08340C282796469446F57F3&menuname=拨款申请单',title:'拨款申请单'},
            	{items:ZF_BKSQNum,href:'/pf/sssfm/incmAndExps/expenses/appropriation/expandAccount/sssfmExpendAccountList.action?actionType=list&menuname=专户拨款单&menuid=BF4422E541D847ADB2465C6D9B3541D7',title:'专户拨款单'}

            ];
		}else if(code == '3'){
            bills = [
                {items:0,href:'/pf/ssfo/mta/ivstpln/ivstList/SsfoMtaInvestMentPlanList.html?menuid=310c451a612e4f339322be79816d5bc4&menuname=保值增值计划',title:'保值增值计划'},
                {items:0,href:'/pf/ssfo/mta/mtaList/mtaList.html?recerptType=01&menuid=499e3f2a97474e3090b3df8be9681c40&menuname=存单管理',title:'存单管理'},
                {items:0,href:'/pf/ssfo/mta/mtaList/mtaList.html?recerptType=02&menuid=5aaeb71556e84035a857d5e3437fa19b&menuname=债券管理',title:'债券管理'},
                {items:0,href:'/pf/ssfo/mta/mtaList/mtaList.html?recerptType=03&menuid=9cb277e923fd4772bee9d45f67ddcec3&menuname=资金运作',title:'资金运作'}

            ];

		}else if(code == '4'){
            bills = [
                {items:0,href:'/pf/gl/voubox/vouBox.html',title:'凭证箱'}
            ];
		}
		var isExist = false;
        $('#min_title_list li>[title],#min_title_list li>span').each(function(){
        	if((text == $(this).attr('title'))||(text == $(this).text())){
        		return !(isExist = true);
			}
		})
		if(isExist) return;
		if(bills.length === 1){
			window.openNewMenu($('<a data-title="'+bills[0].title+'" data-href="'+bills[0].href+'">'+bills[0].title+'</a>'));
		}else {
			var tab = '';
			tab += '<li class="active">\n' +
                '<div title="'+text+'" class="dropdown pull-left">\n' +
                '<button type="button" class="btn dropdown-toggle" id="srdj" data-toggle="dropdown">\n' +
				text +
                '<span style="margin-left:4px;" class="icon-angle-bottom"></span>\n' +
                '</button>\n' +
                '<ul class="dropdown-menu" role="menu" aria-labelledby="srdj">\n' +
				(function () {
					var lis = ''
					bills.forEach(function (item) {
                        lis += '<li role="presentation">\n' +
                        '<a role="menuitem" title="'+item.title+'" data-title="'+item.title+'" tabindex="-1" href="javascript:;" data-href="'+item.href+'">'+item.title+(item.items?'<span style="background-color: #fe6f6e;color:#fff;padding:1px 6px;margin-left: 4px;border-radius: 9px;font-size:10px;">'+item.items+'</span>':'')+'</a>\n' +
                        '</li>';
                    });
					return lis;
                })()+
                '</ul>\n' +
                '</div>\n' +
                '<i class="icon-close"></i>\n' +
                '</li>';
            $('#min_title_list>li.active').removeClass('active');
			$('#min_title_list').append($(tab));
            $('#min_title_list').css('width',$('#min_title_list>li.active').width()+$('#min_title_list').width()+30+'px');
            $('#iframe_box').append('<div class="show_iframe"><iframe frameborder="0" scrolling="yes" src="'+bills[0].href+'" name="'+bills[0].title+'"></iframe></div>')
            $('#iframe_box').children().hide();
            $('#iframe_box').children(':last').show();
            $('.Hui-tabNav-wp').css('paddingRight','0');
		}
    });*/

	/*$('#min_title_list').on('click','.dropdown-menu a',function () {
		var href = $(this).attr('data-href');
		var $li = $(this).closest('div.dropdown').parent();
        $('#iframe_box').children().hide();
        $('#iframe_box').children(':eq('+$li.index()+')').show().children().attr('src',href);
    });
	$('.Hui-tabNav-wp').on('click','.dropdown .dropdown-toggle',function(){
		
		var $li = $(this).parent().parent();
		if(!$li.hasClass('active')){
            $li.click();
		}
	});
    $('#min_title_list').on('click','>li',function () {
    	setTimeout(function () {
            $(this).addClass('active').siblings('.active').removeClass('active');
            if($('#iframe_box>div:first').css('display') === 'block'){
            	$('.Hui-tabNav-wp').css('paddingRight','16px');
            }else {
                $('.Hui-tabNav-wp').css('paddingRight','0');
			}
            $('#min_title_list .dropdown-menu li.active').removeClass('active');
        }.bind(this),0);
    });

    $('#Hui-tabNav').on('blur','.dropdown-toggle',function () {
        setTimeout(function () {
            $(this).parent().removeClass('open');
        }.bind(this),200);
    });*/
});

    //搜索框模糊搜索
 //相关功能
    var fun = ['凭证录入','凭证箱','凭证汇总表','凭证箱（多账套查询）','总账','明细账','余额表'];
    //相关数据
    var data = ['0012','0034','0134','1024','BPT20180001','BCC20180002','4096'];
    //匹配的项
    var filterFun = [];
    var filterData = [];
    $("#search").on('input',function(){
        if($("#selection").css("display") !== "block" && $(this).val() !== ""){
            $("#selection").css("display","block");
        }
        if($(this).val()==''){
            $("#selection").css("display","none");
        }
        var searchText = $(this).val();
        for(var i = 0; i < fun.length; i++){
            if(fun[i].indexOf(searchText) === 0){
                filterFun.push(fun[i]);
            }
        }
        for(var j = 0; j < data.length; j++){
            if(data[j].indexOf(searchText) === 0){
                filterData.push(data[j]);
            }
        }
        
        if(filterFun.length > 0 && $(this).val()!='' ){
            $("#selection").show();
            $("#fun").show();
            $("#fun ul").find("li").remove();
            $.each(filterFun, function(index, item){
                $("#fun ul").append("<li>" + item + "</li>");
            });
            
        } else {
            $("#fun").hide();
        }
        if(filterData.length > 0 && $(this).val()!=''){
            $("#selection").show();
            $("#data").show();
            $("#data ul").find("li").remove();
            $.each(filterData, function(index, item){
                $("#data ul").append("<li>" + item + "</li>");
            });
           
        } else {
            $("#data").hide();
        }
        if(filterFun.length === 0 && filterData.length === 0){
            $("#selection").hide();
        }
        filterFun = [];
        filterData = [];
        
        $(".inner li").mousedown(function(){
            var text = $(this).text();
            $("#search").val(text);
        });
    });




var temp = "";

function testValuetoParent(t){
	temp = t;
	parent.frames["menuFrame"].window.testScollEvent(1)
	// alert("调用成功！"+t);
}


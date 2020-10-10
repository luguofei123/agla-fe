var num=0,oUl=$("#min_title_list"),hide_nav=$("#Hui-tabNav");
var count=0;

//新增数组，保存各个页面的滚动值
var scrollTop = [0];
/*获取顶部选项卡总长度*/
function tabNavallwidth(){
	var taballwidth=0,
		$tabNav = hide_nav.find(".acrossTab"),
		$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
		$tabNavitem = hide_nav.find(".acrossTab li"),
		$tabNavmore =hide_nav.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth += Number(parseFloat($(this).width()+44))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
    /*更多按钮是否显示*/
	if(taballwidth+25>w){
        var p=taballwidth+25-w;
		$tabNavmore.show();
        $tabNav.css({left:-p})
    }
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0})
	}
}

/*菜单导航*/
function Hui_admin_tab(obj){
	var bStop = false,
		bStopIndex = 0,
		firstLevel = $(obj).attr('data-firstLevel'),
		href = $(obj).attr('data-href'),
		title = $(obj).attr("data-title"),
		topWindow = $(window.parent.document),
		show_navLi = topWindow.find("#min_title_list li"),
		iframe_box = topWindow.find("#iframe_box");
	
	if(typeof(href)=='undefined'||typeof(title)=='undefined'){
		return;
	}
	show_navLi.each(function() {
		// if($(this).find('span').attr("data-href")==href || $(this).find('span').text()==title){
		if($(this).find('span').attr("data-href")==href ){
			bStop=true;
			bStopIndex=show_navLi.index($(this));
			return false;
		}
	});
	if(!bStop){
		creatIframe(href,title);
		var ooli=$(window.parent.document).find(".acrossTab li").length;
		//console.log(ooli);
		count=ooli;
		min_titleList();
	}
	else{
		show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
		count=(bStopIndex);
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src",href);
	}	
}
/*返回顶部 */
$("#up").click (function(m) {
	
	if(count==0){
		count = 1;
	}
	window.frames[count-1].scrollTo(0, 0);
	scrollTop[count-1] = 0;
})

/*最新tab标题栏列表*/
function min_titleList(){
	var topWindow = $(window.parent.document),
		show_nav = topWindow.find("#min_title_list"),
		aLi = show_nav.find("li");  
		//aSpan=aLi.find("i").text("×");
}

/*创建iframe*/

function creatIframe(href,titleName){
	var topWindow=$(window.parent.document),
		show_nav=topWindow.find('#min_title_list'),
		iframe_box=topWindow.find('#iframe_box'),
		iframeBox=iframe_box.find('.show_iframe'),
		$tabNav = topWindow.find(".acrossTab"),
		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
		$tabNavmore =topWindow.find(".Hui-tabNav-more");
	var taballwidth=0;
		
	show_nav.find('li').removeClass("active");	
	
	//新增，添加一个页面时，scrollTop数组数量加1
	scrollTop.push(0);
	
	show_nav.append('<li class="active"><span data-href="'+href+'">'+titleName+'</span><i class="icon-close"></i><em></em></li>');
	var $tabNavitem = topWindow.find(".acrossTab li");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+44))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		 var p=taballwidth+25-w;
        $tabNavmore.show();
        $tabNav.css({left:-p})
    }
	else{
		$tabNavmore.hide();	
		$tabNav.css({left:0})
	}	
	iframeBox.hide();
	
	var len = window.frames.length;
    iframe_box.append('<div class="show_iframe"><iframe frameborder="0" scrolling="yes" data-index="'+len+'"  name ="'+titleName+'" src='+href+'></iframe></div>');
    len = window.frames.length;
	var frame = window.frames[len - 1];
	
	//用于处理扫描枪事件，保证焦点在业务系统内时也可以使用扫描枪
    scanCode.call(frame);
    $(frame).on('mousedown',function(event){
           if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
     });
    $(frame).on('mousemove',function(event){
           if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
     });
    $(frame).on('keydown',function(event){
           if(cnt > 0){
			clearTimeout(timer);
            timer = setTimeout(backToLogin,cnt*1000);
		}
     });

    $(frame).scroll(function(){
        var sTop = this.document.documentElement.scrollTop || this.document.body.scrollTop;
        var index = this.frameElement.getAttribute("data-index");
        if(sTop !== 0){
            scrollTop[index] = sTop;
            //alert(index+"+"+sTop);
        }
    });
    
}

/*关闭iframe*/
function removeIframe(){
	var topWindow = $(window.parent.document),
		iframe = topWindow.find('#iframe_box .show_iframe'),
		tab = topWindow.find(".acrossTab li"),
		showTab = topWindow.find(".acrossTab li.active"),
		showBox=topWindow.find('.show_iframe:visible'),
		i = showTab.index();
	//tab.eq(i-1).addClass("active");
	if(tab.eq(i).hasClass('active')){
		tab.eq(i-1).addClass("active");
	}
	tab.eq(i).remove();
	iframe.eq(i-1).show();
	//count=(i-1);
	iframe.eq(i).remove();
}
$(function(){
	$(document).on("click","#min_title_list li",function(){
		//我的工作台
		var mainPage = document.getElementById("iframeId");
		
		var bStopIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		$("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
		/**if(bStopIndex=0){
			count = 0;
		}else**/
		if(bStopIndex!=-1){
			count=bStopIndex+1;
		}
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
		
		//新增，将页面滚动到之前的位置
		window.frames[bStopIndex].scroll(0,scrollTop[bStopIndex]);
		
		if($(this).attr('hide')=='true'){
			$('#js-tabNav-next').trigger('click');
		}
		
		//如果我的工作台页面可见，则刷新
		if($(mainPage).parent().css("display") === 'block'){
			mainPage.src = mainPage.src;
		}
	});
	$(document).on("click","#min_title_list li i",function(e){
		//新增，阻止事件冒泡
		e.cancelBubble = true;
		e.stopPropagation();
		e.preventDefault(); 
		
		//新增，获取标签栏和iframe
		var topWindow = $(window.parent.document),
		iframe = topWindow.find('#iframe_box .show_iframe'),
		tab = topWindow.find(".acrossTab li");
        var showTab;
		
		//我的工作台
		var mainPage = document.getElementById("iframeId");
		var aCloseIndex=$(this).parents("li").index();
		$(this).parent().remove();
		$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();	
		
		//新增，当活动标签页被关闭，则将被关闭标签的前一个设置为active，并将其对应的iframe显示出来
        showTab = topWindow.find(".acrossTab li.active");
		if(showTab.length==0){
			tab.eq(aCloseIndex-1).addClass("active");
			iframe.eq(aCloseIndex-1).show();
            //新增，将页面滚动到之前的位置
             window.frames[aCloseIndex-1].scroll(0,scrollTop[aCloseIndex-1]);
		}
		
		//新增，当关闭页签时，从数组中删除对应的数组元素
		scrollTop.splice(aCloseIndex, 1);
		
		num==0?num=0:num--;
		tabNavallwidth();
		count = window.frames.length-1;
		//controlHeight(aCloseIndex-1);
		
		//如果我的工作台页面可见，则刷新
		if($(mainPage).parent().css("display") === 'block'){
			mainPage.src = mainPage.src;
		}
	});
	$(document).on("dblclick","#min_title_list li",function(){
        //我的工作台
		var mainPage = document.getElementById("iframeId");
        var aCloseIndex=$(this).index();
        var iframe_box=$("#iframe_box");
        
        if(aCloseIndex>0){
            $(this).remove();
            $('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove(); 
            num==0?num=0:num--;
            $("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
            iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
            
            //新增，将页面滚动到之前的位置
            window.frames[aCloseIndex-1].scroll(0,scrollTop[aCloseIndex-1]);
            //新增，当关闭页签时，从数组中删除对应的数组元素
            scrollTop.splice(aCloseIndex, 1);
            
            tabNavallwidth();
            count = window.frames.length-1;
            //controlHeight(aCloseIndex-1);
            
        }else{
            return false;
        }
        //如果我的工作台页面可见，则刷新
		if($(mainPage).parent().css("display") === 'block'){
			mainPage.src = mainPage.src;
		}
    });
	tabNavallwidth();
	
	$('#js-tabNav-next').click(function(){
		num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
		if(!toNavPos(1)) num--;
	});
	$('#js-tabNav-prev').click(function(){
		num==0?num=0:num--;
		if(!toNavPos(-1)) num++;
	});
	
	function toNavPos(dir){
		var leftWidth = 0;
		for(var iTab = 0;iTab < num-dir;iTab++){
			var tabWidth = $('#min_title_list li:eq('+iTab+')').outerWidth(true);
			leftWidth -= tabWidth;
		}
		var tabListWidth = 0;
		var navWidth = $('.Hui-tabNav-wp').width()-80;
		var tabs = $('#min_title_list li');
		for(var iTab = num;iTab <= tabs.length;iTab++){
			var $tab = $(tabs[iTab]);
			var tabWidth = $tab.outerWidth(true);
			tabListWidth += tabWidth;
			if(tabListWidth < navWidth){
				$tab.attr('hide','false');
			}else{
				$tab.attr('hide','true');
			}			
		}			
		if(dir==1){//next

			if(tabListWidth > navWidth-80){
				var tabWidth = $('#min_title_list li:eq('+(num-1)+')').outerWidth(true);
				leftWidth = leftWidth - tabWidth;
				oUl.stop().animate({'left':leftWidth},100);	
				return true;
			}
			return false;			
		}else{
		
			if(tabListWidth > navWidth-100){
				var tabWidth = $('#min_title_list li:eq('+(num)+')').outerWidth(true);
				leftWidth = leftWidth + tabWidth;
				oUl.stop().animate({'left':leftWidth},100);	
				return true;
			}
			return false;			
		}
		
	}
	
}); 

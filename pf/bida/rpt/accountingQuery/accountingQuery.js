$(function(){
	var page = function(){
		
		//账务查询所用接口
		var portList = {
				
		};
        //左侧树高度
        var h = $(window).height();
        $(".rpt-acc-box-left").height(h-36);
        $(".rpt-atree-box-body").height(h - 90);
		
		return{
			
			//******初始化页面******************************************************
			initPage:function(){
				//请求左侧单位账套树
				rpt.atreeData();
			},
			
			//******绑定事件******************************************************
			onEventListener: function(){
				//打开对应的查询页面
				$(".rpt-acc-nav li").on("click",function(){
					rpt.openTabMenu(this);
				});
			},
			
			//******开始******************************************************
			init:function(){
				page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	
 	/////////////////////
    page.init();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "60px");
        }
    })
});
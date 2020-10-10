$(function(){
	
	//获取门户信息
	var svData;
	
			var page = function() {
				// 定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
				var acctCode, agencyCode, setYear;
				// 传输设置数据的对象
				var postSet;
				var month=new Array("Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec");
				var num=new Array("01","02","03","04","05","06","07","08","09","10","11","12");
				return {

					// $.ajax()，传参成功后，console.log()出数据
					initCarryOver : function(result) {
						$(".fisPerdsLeft").html("");
						$(".fisPerdsRight").html("");
						for(var i=0;i<result.data.length;i++){
							var acctClass = result.data[i].status=='OPENED'?' ':' close-account ';
							var m = (i+1)>9?(i+1):"0"+(i+1);
							var str='<div class="time-item'+acctClass+'clearfix">'+
							'<a name="'+month[i]+'"></a>'+
							'<input class="fisPerd" type="hidden" value="'+result.data[i].fisPerd+'"/>'+
							'<input class="calendarGuid" type="hidden" value="'+result.data[i].calendarGuid+'"/>'+
							'<div class="time-item-decorate"><div class="time-circle">'+num[i]+'</div></div>'+
							'<div class="time-item-content">'+
							'<img src="../../images/carryover/carry_over_close_accounts.png"/>'+
							'<div class="time-info">'+
							'<h5>'+postSet.setYear+'年'+m+'期间</h5>'+
							'<ul class="list-unstyled clearfix">'+
							'<li class="wsh"><div>未审核<p>'+result.data[i].noAuditCount+'</p></div></li>'+
							'<li class="ysh"><div>已审核<p>'+result.data[i].auditCount+'</p></div></li>'+
							'<li class="yjz"><div>已记账<p>'+result.data[i].jzCount+'</p></div></li>'+
							'</ul></div>'+
							'<div class="time-action clearfix">'+
							'<div class="time-link pull-left"><a href="javascript:void(0);">结账报告</a></div>'+
							'<div class="time-btn pull-right">';
							if(result.data[i].status=='OPENED'){
								str+='<button type="button" id="btn-close-account" class="btn btn-sm btn-primary btn-permission btn-close-account" >结账</button>'+
								'<button type="button" id="btn-anti-settlement" class="btn btn-sm btn-default btn-permission btn-anti-settlement" style="display:none;">反结账</button>';
							}
							else{
								str+='<button type="button" id="btn-close-account" class="btn btn-sm btn-default btn-permission btn-close-account" style="display:none;">结账</button>'+
								'<button type="button" id="btn-anti-settlement" class="btn btn-sm btn-primary btn-permission btn-anti-settlement" >反结账</button>';
							}
							
							
							str+='</div>'+
							'</div>'+
							'</div>'+
							'</div>';
							var $dl = $(str);
							if(i%2==0)
								$(".fisPerdsLeft").append($dl);
							else
								$(".fisPerdsRight").append($dl);
							//add by wangxin 
							$('.time-nav').find('a[data-time="'+month[i]+'"]').siblings('span').html(postSet.setYear+'年'+m+'期间');	
						}
						ufma.setPortalHeight();
						$(".time-item").each(function(){
							if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
								$(this).find('.time-circle,.time-item-content').addClass('is-hidden');
							}
						});
						
						//权限判断
						ufma.isShow(page.reslist);
					},
					
/*					//$.ajax()，获取数据数据成功，填充单位下拉列表
					initAgency:function(result){
						var data = result.data;
						//给页面初始默认单位id变量赋值
						//serachData.agencyCode = data[0].id;
						var agencyCode = data[0].id;
						//循环把option填入select
						for(var i=0;i<data.length;i++){
							//创建单位option节点
							var $agencyOp = $('<option data-pid='+data[i].pId+' value='+data[i].id+'>'+data[i].name+'</option>');
							//单位option节点填入单位select
							$('#coAgencyCode').append($agencyOp);
						}
						
						//载入单位数据（默认第一个单位）后，相关的查询数据加载
						//初始的账套数据
						ufma.get("/gl/eleCoacc/getCoCoaccs/"+agencyCode,"",page.initCoCoaccs);
					},*/
					
/*					//$.ajax()，获取数据数据成功，填充账套下拉列表
					initCoCoaccs:function(result){
						var data = result.data;
						//给页面初始默认账套CHR_CODE变量赋值
						//serachData.acctCode = data[0].CHR_CODE;
						//循环把option填入select
						for(var i=0;i<data.length;i++){
							//创建账套option节点
							var $coCoaccOp = $('<option value='+data[i].CHR_CODE+'>'+data[i].CHR_NAME+'</option>');
							//账套option节点填入账套select
							$('#coAcctCode').append($coCoaccOp);
						}
						page.getCarryOver();
						//根据单位和账套代码加载内容位置**********
					},*/
		            getCarryOver:function(){
//          			page.setYear = new Date().getFullYear();
            			postSet = {acctCode:page.acctCode,agencyCode:page.agencyCode,setYear:page.setYear};
            			ufma.post("/gl/CarryOver/search", postSet, page.initCarryOver);
		            },
					// 初始化页面
					initPage : function() {
						page.reslist = ufma.getPermission();
						
						svData = ufma.getCommonData();
						page.setYear = svData.svSetYear;
						
						//初始化页面填入单位下拉列表
//						ufma.get("/gl/eleAgency/getAgencyTree","",this.initAgency);
						
						//账套选择
						page.cbAcct = $("#cbAcct").ufmaCombox2({
		            		valueField:'CHR_CODE',
							textField:'CODE_NAME',
							placeholder:'请选择账套',
							icon:'icon-book',
		            		onchange:function(data){
								page.acctCode = data.CHR_CODE;
								
								page.getCarryOver();
						    }
		            	});
						
						//单位选择
						page.cbAgency=$("#cbAgency").ufmaTreecombox2({
							valueField:"id",
							textField:"codeName",
							readonly:false,
							placeholder:"请选择单位",
							icon:"icon-unit",
						    onchange:function(data){
						    	page.agencyCode = data.id;
						    	
						    	//改变单位,账套选择内容改变
						    	var url = '/gl/eleCoacc/getCoCoaccs/'+page.agencyCode;
								var callback = function(result){
									page.cbAcct = $("#cbAcct").ufmaCombox2({
										data: result.data
									});
									var svFlag = $.inArrayJson(result.data,"CHR_CODE",svData.svAcctCode);
									if(svFlag!=undefined){
										page.cbAcct.val(svData.svAcctCode);
									}else{
										page.cbAcct.val(result.data[0].CHR_CODE);
									}
								}
								ufma.get(url,{},callback);
						    }
						});
						ufma.ajaxDef("/gl/eleAgency/getAgencyTree","get","",function(result){
							page.cbAgency=$("#cbAgency").ufmaTreecombox2({
								data:result.data
							});
							var agyCode = $.inArrayJson(result.data,"id",svData.svAgencyCode);
					    	if(agyCode!=undefined){
					   			page.cbAgency.val(svData.svAgencyCode);
					   		}else{
					   			page.cbAgency.val(result.data[0].id);
					   		}
						});
						
					},
					// 页面元素事件绑定使用jquery 的 on()方法
					onEventListener : function() {
/*						//切换单位对应账套和凭证类型切换
						$("#coAgencyCode").on("change",function(){
							//获得单位信息
							page.agencyCode = $(this).val();
							//清空账套和凭证类型列表
							$("#coAcctCode").html("");
							//关联的数据列表变更
							ufma.get("/gl/eleCoacc/getCoCoaccs/"+page.agencyCode,"",page.initCoCoaccs);
						});
						$("#coAcctCode").on("change",function(){
							//获得单位信息
							page.acctCode = $(this).val();
							page.getCarryOver();
						});*/
						//点击结账报告
						$("#carryOver").on("click",".time-link a",function(){
							var fisPerd = $(this).parents(".time-item").find("input[type='hidden']").val();
							var data = {acctCode:page.acctCode,agencyCode:page.agencyCode,setYear:page.setYear,fisPerd:fisPerd}
							ufma.open({
		                        url:'carryOverReport.html',
		                        title:'结账报告',
		                        width:1000,
		                        height:550,
		                        data:{action:'report',data:data},
		                        ondestory:function(data){
		                        	//窗口关闭时回传的值
		                        }
		                    });
						});
						$("#carryOver").on("click","#btn-close-account",function(){
							var fisPerd = $(this).parents(".time-item").find(".fisPerd").val();
							var calendarGuid = $(this).parents(".time-item").find(".calendarGuid").val();
							var data = {acctCode:page.acctCode,agencyCode:page.agencyCode,setYear:page.setYear,fisPerd:fisPerd,calendarGuid:calendarGuid}
							callback = function(result){
								ufma.hideloading();
								$(".time-nav").find("a[data-time]").parent().removeClass("onit");
								ufma.showTip(result.msg,"",result.flag);
								page.getCarryOver();
			    			}
							/*ufma.open({
		                        url:'carryOverAccounting.html',
		                        title:'结账',
		                        width:780,
		                        height:300,
		                        data:{action:'closeAccount',data:data},
		                        ondestory:function(data){
		                        	//窗口关闭时回传的值
		                        }
		                    });*/
							ufma.showloading('正在结账');
							ufma.post("/gl/CarryOver/doCarryVou",data,callback);
						});
						$("#carryOver").on("click","#btn-anti-settlement",function(){
							var fisPerd = $(this).parents(".time-item").find(".fisPerd").val();
							var calendarGuid = $(this).parents(".time-item").find(".calendarGuid").val();
							var data = {acctCode:page.acctCode,agencyCode:page.agencyCode,setYear:page.setYear,fisPerd:fisPerd,calendarGuid:calendarGuid}
							callback = function(result){
								ufma.hideloading();
								$(".time-nav").find("a[data-time]").parent().removeClass("onit");
								ufma.showTip(result.msg,"",result.flag);
								page.getCarryOver();
			    			}
							ufma.showloading('正在反结账');
							ufma.post("/gl/CarryOver/cancelCarryVou",data,callback);
							
							/*ufma.open({
		                        url:'carryOverAccounting.html',
		                        title:'反结账',
		                        width:780,
		                        height:300,
		                        data:{'action':'unCloseAccount',data:data},
		                        ondestory:function(data){
		                        	//窗口关闭时回传的值
		                        }
		                    });*/
						});
						
						//鼠标悬停时间线，锚链接样式改变
						$("#carryOver").on("mouseover mouseout",".time-item",function(event){
							var timeNum = $(this).find('a[name]').attr('name');
							if(event.type == "mouseover"){
								$(this).addClass("onit");
								$(".time-nav").find("a[data-time='"+timeNum+"']").parent().addClass("onit");
							}else if(event.type == "mouseout"){
								$(this).removeClass("onit");
								$(".time-nav").find("a[data-time='"+timeNum+"']").parent().removeClass("onit");
							}
						});
						
						//鼠标悬停锚链接，时间线样式改变
						$("#carryOver").on("mouseover mouseout",".time-nav li",function(event){
							var timeNum = $(this).find('a').attr("data-time");
							if(event.type == "mouseover"){
								$(this).addClass("onit");
								$(".time-item a[name='"+timeNum+"']").parent().addClass("onit");
							}else if(event.type == "mouseout"){
								$(this).removeClass("onit");
								$(".time-item a[name='"+timeNum+"']").parent().removeClass("onit");
							}
						});
						
						//动画效果
						$(".time-item").each(function(){
							if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
								$(this).find('.time-circle,.time-item-content').addClass('is-hidden');
							}
						});
						$(window).on('scroll', function(){
							$(".time-item").each(function(){
								if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.time-circle').hasClass('is-hidden') ) {
									$(this).find('.time-circle,.time-item-content').removeClass('is-hidden').addClass('bounce-in');
								}
							});
						});
						
					},
					// 此方法必须保留
					init : function() {
						this.initPage();
						this.onEventListener();
					}
				}
			}();

			page.init();
		});
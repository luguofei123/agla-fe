$(function(){	
	var page = function(){
		//定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrId,chrValue,chrConmode;
		var sysId;
		//定义单位代码变量（单位级）
		if($("#cbAgency").get(0)){
			var agencyCode;
		}
		//传输设置数据的对象
		var postSet;
		
		return{
			//$.ajax()，获取数据数据成功，拼接页面的方法
			initBusRule:function(result){
				//创建dl节点并加到right-box内
				var $dl;
				//定义dt、dd和dd内ul变量，用于创建节点
				var $dt,$dd,$ul;
				//循环加载数据
				for(var i=0;i<result.data.length;i++){
					//创建每一条业务规则设置的li
					var $liOneChr = $('<li class="clearfix"></li>');
					//创建隐藏那个字段节点并加到li内
					var $chrId = $('<input type="hidden" value='+result.data[i].sysRgrPara.chrId+' />');
					$liOneChr.append($chrId);
					//创建chrName节点，并使用bootstrap插件，实现鼠标悬停出现tip
					//判断系统级和单位级
					if(!$("#cbAgency").get(0)){
						//系统级
						if(result.data[i].sysRgrPara.chrConmode==2){
							$liOneChr.append($('<div class="rule-chrName"><span style="color:#999;" data-toggle="tooltip" data-placement="right" title='+result.data[i].sysRgrPara.chrDesc+'>'+result.data[i].sysRgrPara.chrName+'</span></div>'));
						}else{
							$liOneChr.append($('<div class="rule-chrName"><span data-toggle="tooltip" data-placement="right" title='+result.data[i].sysRgrPara.chrDesc+'>'+result.data[i].sysRgrPara.chrName+'</span></div>'));
						}
					}else{
						//单位级
						if(result.data[i].sysRgrPara.chrConmode==2){
							$liOneChr.append($('<div class="rule-chrName"><span data-toggle="tooltip" data-placement="right" title='+result.data[i].sysRgrPara.chrDesc+'>'+result.data[i].sysRgrPara.chrName+'</span></div>'));
						}else{
							$liOneChr.append($('<div class="rule-chrName"><span style="color:#999;" data-toggle="tooltip" data-placement="right" title='+result.data[i].sysRgrPara.chrDesc+'>'+result.data[i].sysRgrPara.chrName+'</span></div>'));
						}
					}
					//定义$chrValue变量，判断fieldDisptype，$chrValue载入不同的组件，并加入li
					var $chrValue;
					switch(result.data[i].sysRgrPara.fieldDisptype){
						case 1:
							//fieldDisptype:1 是要素
							$chrValue = $('<div class="rule-chrValue"></div>');
							var $select;
							//判断系统级和单位级
							if(!$("#cbAgency").get(0)){
								//系统级
								if(result.data[i].sysRgrPara.chrConmode==2){
									$select = $('<select class="form-control bordered-input" disabled></select>');
								}else{
									$select = $('<select class="form-control bordered-input"></select>');
								}
							}else{
								//单位级
								if(result.data[i].sysRgrPara.chrConmode==2){
									$select = $('<select class="form-control bordered-input"></select>');
								}else{
									$select = $('<select class="form-control bordered-input" disabled></select>');
								}
							}
							var $option;
							for(var j=0;j<result.data[i].fieldValues.length;j++){
								if(result.data[i].sysRgrPara.chrValue==result.data[i].fieldValues[j].CHR_CODE){
									$option = $('<option value='+result.data[i].fieldValues[j].CHR_CODE+' selected >'+result.data[i].fieldValues[j].CHR_NAME+'</option>');
								}else{
									$option = $('<option value='+result.data[i].fieldValues[j].CHR_CODE+'>'+result.data[i].fieldValues[j].CHR_NAME+'</option>');
								}
								$select.append($option);
							}
							$chrValue.append($select);
							break;
						case 2:
							//fieldDisptype:2 是枚举,开关形式。判断数据chrValue的值，创建节点
							switch(result.data[i].sysRgrPara.chrValue){
								case "0":
									//判断系统级和单位级
									if(!$("#cbAgency").get(0)){
										//系统级
										if(result.data[i].sysRgrPara.chrConmode==2){
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f0" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f1" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}else{
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}
									}else{
										//单位级
										if(result.data[i].sysRgrPara.chrConmode==2){
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}else{
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f0" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f1" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}
									}
									break;
								case "1":
									//判断系统级和单位级
									if(!$("#cbAgency").get(0)){
										//系统级
										if(result.data[i].sysRgrPara.chrConmode==2){
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f0" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f1" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}else{
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}
									}else{
										//单位级
										if(result.data[i].sysRgrPara.chrConmode==2){
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}else{
											$chrValue = $('<div class="rule-chrValue"><div class="btn-group btn-group-sm" data-toggle="buttons">'
												+'<label class="btn btn-sm btn-default active" for="'+result.data[i].sysRgrPara.chrCode+'-f0" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" checked value='+result.data[i].fieldValues[1].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f0">'
												+result.data[i].fieldValues[1].ENU_NAME+'</label>'
												+'<label class="btn btn-sm btn-default" for="'+result.data[i].sysRgrPara.chrCode+'-f1" disabled>'
												+'<input type="radio" name="'+result.data[i].sysRgrPara.chrCode+'.chrValue" value='+result.data[i].fieldValues[0].ENU_CODE+' autocomplete="off" id="'+result.data[i].sysRgrPara.chrCode+'-f1">'
												+result.data[i].fieldValues[0].ENU_NAME+'</label>'
												+'</div></div>');
										}
									}
									break;
								default:
									break;
							}
							break;
						case 8:
							//fieldDisptype:8 是枚举，下拉列表样式。
							$chrValue = $('<div class="rule-chrValue"></div>');
							var $chrValueSelect;
							//判断系统级和单位级
							if(!$("#cbAgency").get(0)){
								//系统级
								if(result.data[i].sysRgrPara.chrConmode==2){
									$chrValueSelect = $('<select class="form-control bordered-input" disabled></select>');
								}else{
									$chrValueSelect = $('<select class="form-control bordered-input"></select>');
								}
							}else{
								//单位级
								if(result.data[i].sysRgrPara.chrConmode==2){
									$chrValueSelect = $('<select class="form-control bordered-input"></select>');
								}else{
									$chrValueSelect = $('<select class="form-control bordered-input" disabled></select>');
								}
							}
							var $chrValueOption;
							for(var j=0;j<result.data[i].fieldValues.length;j++){
								if(result.data[i].sysRgrPara.chrValue==result.data[i].fieldValues[j].ENU_CODE){
									$chrValueOption = $('<option value='+result.data[i].fieldValues[j].ENU_CODE+' selected >'+result.data[i].fieldValues[j].ENU_NAME+'</option>');
								}else{
									$chrValueOption = $('<option value='+result.data[i].fieldValues[j].ENU_CODE+'>'+result.data[i].fieldValues[j].ENU_NAME+'</option>');
								}
								$chrValueSelect.append($chrValueOption);
							}
							$chrValue.append($chrValueSelect);
							break;
						default:
							break;
					}
					$liOneChr.append($chrValue);
					//定义$chrConmode变量，判断数据chrConmode的值创建节点，并加入li
					if(!$("#cbAgency").get(0)){
						//系统级
						var $chrConmode = $('<div class="rule-chrConmode"></div>');
						var $chrConmodeSelect = $('<select class="form-control bordered-input"></select>');
						var $chrConmodeOption;
						for(var j=0;j<result.data[i].chrConmodeValues.length;j++){
							if(result.data[i].sysRgrPara.chrConmode==result.data[i].chrConmodeValues[j].ENU_CODE){
								$chrConmodeOption = $('<option value='+result.data[i].chrConmodeValues[j].ENU_CODE+' selected >'+result.data[i].chrConmodeValues[j].ENU_NAME+'</option>');
							}else{
								$chrConmodeOption = $('<option value='+result.data[i].chrConmodeValues[j].ENU_CODE+'>'+result.data[i].chrConmodeValues[j].ENU_NAME+'</option>');
							}
							$chrConmodeSelect.append($chrConmodeOption);
						}
						$chrConmode.append($chrConmodeSelect);
						$liOneChr.append($chrConmode);
					}
					
					//第一次或者groupName与上一条数据不同，新建节点并加入；否则，直接加入
					if(i==0||result.data[i].sysRgrPara.groupName!=result.data[i-1].sysRgrPara.groupName){
						$dl = $('<dl class="dl-horizontal"></dl>');
						$dt = $('<dt>'+result.data[i].sysRgrPara.groupName+'</dt>');
						$dd = $('<dd></dd>');
						$ul = $('<ul class="list-unstyled"></ul>');
						$ul.append($liOneChr);
						$dd.append($ul);
						$dl.append($dt);
						$dl.append($dd);
						$(".right-box").append($dl);
					}else{
						$ul.append($liOneChr);
					}
				}
				//设置tooltip
				$('[data-toggle="tooltip"]').tooltip();
				ufma.parse();
				var winH = $(window).height();
				$(".right-box").css({"min-height":winH-65-16+'px'});
			},
			
			//$.ajax()，传参成功后，console.log()出数据
			postBusRule:function(result){
				ufma.showTip(result.msg,"",result.flag);
			},
			

			//判断盒子到顶部距离设置设置最小高度
			rightMinHeight:function(){
				var minHeight = $(".workspace").height()-($(".right-box").offset().top-$(".workspace").offset().top);
				$(".right-box").css({"minHeight":minHeight});
			},

			
			//初始化页面
			initPage:function(){
				
				

//				ufma.setWorkspaceHeight();

				//后台获取数据并加载
				if($("#cbAgency").get(0)){
					//获取门户相关数据
					page.svData = ufma.getCommonData();
					//单位级
					page.cbAgency=$("#cbAgency").ufmaTreecombox2({
					    onchange:function(data){
					    	//改变单位触发事件
					    	page.agencyCode = page.cbAgency.getValue();
					    	page.sysId = $(".left-switch-box a.choose").attr("data-sysId");
					    	
					    	$("#searchText").val("");
					    	$("dl.dl-horizontal").remove();
					    	
							ufma.get("/ma/agy/busRule/"+page.sysId+"?agencyCode="+page.agencyCode ,"",page.initBusRule);
					    },
					    initComplete:function(sender){
							page.cbAgency.setValue(page.svData.svAgencyCode,page.svData.svAgencyName);
						}
					});
//					默认选取第一个
//					page.cbAgency.select(1);
				}else{
					//系统级
					ufma.get("/ma/sys/busRule/GL","",this.initBusRule);
				}
				
				//加载页面，设置主体内容盒子的最小高度
				//this.rightMinHeight();
				ufma.parseScroll();
			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function(){
				//点击账务或指标，页面内容达到切换
				$(".left-switch-box a").on("click",function(){
					if(!$(this).hasClass("choose")){
						$(".left-switch-box a").removeClass("choose");
						$(this).addClass("choose");
						page.sysId = $(this).attr("data-sysId");
						
						$("#searchText").val("");
						$("dl.dl-horizontal").remove();
						
						//判断系统级单位级
						if($("#cbAgency").get(0)){
							//单位级
							page.agencyCode = page.cbAgency.getValue();
							ufma.get("/ma/agy/busRule/"+page.sysId+"?agencyCode="+page.agencyCode ,"",page.initBusRule);
						}else{
							//系统级
							ufma.get("/ma/sys/busRule/"+page.sysId,"",page.initBusRule);
						}
					}
				});
				
				//点击业务规则设置按钮，传值给后台
				$(".right-box").on("click",".btn-group label",function(e){
					//防止多次点击(与.asClass()配合)
					var clickType = 0;
					if(!$(this).hasClass("active")&&clickType==0){
						page.chrId = $(this).parents("li").find("input[type='hidden']").val();
						page.chrValue = $(this).find("input[type='radio']").val();
						$(this).siblings().removeClass("active");
						$(this).addClass("active");
						//判断系统级单位级
						if($("#cbAgency").get(0)){
							//单位级
							page.agencyCode = page.cbAgency.getValue();
							postSet = {chrId:page.chrId,chrValue:page.chrValue,agencyCode:page.agencyCode};
							ufma.put("/ma/agy/busRule/updateChrValue",postSet,page.postBusRule);
						}else{
							//系统级
							postSet = {chrId:page.chrId,chrValue:page.chrValue};
							ufma.put("/ma/sys/busRule/updateChrValue",postSet,page.postBusRule);
						}
						clickType++;
					}
				});
				
				//点击业务规则设置下拉列表，传值给后台
				$(".right-box").on("change","select",function(){
					page.chrId = $(this).parents("li").find("input[type='hidden']").val();
					if($(this).parents(".rule-chrValue")[0]){
						page.chrValue = $(this).val();
						//判断系统级单位级
						if($("#cbAgency").get(0)){
							//单位级
							page.agencyCode = page.cbAgency.getValue();
							postSet = {chrId:page.chrId,chrValue:page.chrValue,agencyCode:page.agencyCode};
							ufma.put("/ma/agy/busRule/updateChrValue",postSet,page.postBusRule);
						}else{
							//系统级
							postSet = {chrId:page.chrId,chrValue:page.chrValue};
							ufma.put("/ma/sys/busRule/updateChrValue",postSet,page.postBusRule);
						}
					}else{
						page.chrConmode = $(this).val();
						postSet = {chrId:page.chrId,chrConmode:page.chrConmode};
						ufma.put("/ma/sys/busRule/updateChrConmode",postSet,page.postBusRule);
						if($(this).val()==2){
							$(this).parents("li").find(".rule-chrName span").css("color","#999");
							$(this).parents("li").find(".rule-chrValue label").attr("disabled","disabled");
							$(this).parents("li").find(".rule-chrValue select").prop("disabled",true);
						}else{
							$(this).parents("li").find(".rule-chrName span").css("color","#333");
							$(this).parents("li").find(".rule-chrValue label").removeAttr("disabled");
							$(this).parents("li").find(".rule-chrValue select").prop("disabled",false);
						}
					}
					
				});
				
				//搜索框回车
				$("#searchText").on('keydown',function(e){
					e.stopPropagation();
					if(e.keyCode=="13"){
						$(".btn-search").click();
					}
				});
				
				//检索页面内容
				$(".btn-search").on('click',function(){
					$(".right-box dl li").css({"padding-bottom":"8px"});
					var sText = $("#searchText").val();
					if(sText==""){
						$(".right-box dl:hidden,.right-box li:hidden").show();
					}else{
						$(".rule-chrName").each(function(){
							if($(this).find('span').text().indexOf(sText)==-1){
								//没有要检索的内容
								$(this).parents("li").hide();
							}
						});
						$(".right-box dl").each(function(){
							if(!$(this).find('li:visible').get(0)){
								//dl中所有li都隐藏，则dl也隐藏
								$(this).hide();
							}
						});
					}
					$(".right-box dl li:visible").eq(0).css({"padding-bottom":"0"});
				});
			},
			//此方法必须保留
			init:function(){
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
//				ac.test("页内调用公共方法");
			}
		}
	}();
	
/////////////////////
page.init();
});
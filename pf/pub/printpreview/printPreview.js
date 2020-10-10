$(function(){
	
	//传入的数据
	var getData = {
		agencyCode:"",
		acctCode:"",
		componentId:""
	};
	
	//传入vouGuids数组
	var guidArr = [];
	
	//模板p-paper
	var paperArr = [];
	
	//模板p-form
	var formArr = [];
	
	//模板p-formtmpl
	var formtmplArr = [];
	
	//查询p_data传递数据
	var searchData = {};
	
	//模板p-data
	var pData;
	
	//缓存数据
	var cData;
	
	var oType,oFrom;

    var page = function(){
    	
    	return{
    		//左侧设置模板高度
    		templateBoxHeight:function(){
    			var height = $(window).height() - $("#printPreview .title").outerHeight() - $("#printPreview .set-box").outerHeight();
    			$("#printPreview .template-box").css({"height":height});
    		},
    		
    		//模板加载
    		getPrtList:function(result){
				var data = result.data;
				
				var defaultType = true;//防止多个默认模板，导致程序出错
				
				//循环创建模板
				for(var i=0;i<data.length;i++){
					var $item = $('<li class="template-item"></li>');
					
					//合计行获取
					if (cData.judge.moreAcct == null) {
						var t = eval("("+data[i].prtSet.pubPrtPrintTmpl.tmplValue+")");
					} else {
						var t = eval("("+data[i].prtSet.pubPrtPrintTmpl[0].tmplValue+")");
					}
					var sum;
					switch (t.total){
						case "0":
							sum = "tmAddUpPage";
							break;
						case "1":
							sum = "tmSubPage";
							break;
						case "2":
							sum = "tmAllPage";
							break;
						default:
							break;
					}
					
					if (cData.judge.moreAcct == null) {
						var $hide = $('<input type="hidden" class="hideData" data-td="'+data[i].prtSet.pubPrtFormatTmpl.tmplType+'" data-sumMode="'+sum+'" data-agencyCode="'+data[i].prtSet.pubPrtFormatTmpl.agencyCode+'" data-acctCode="'+data[i].prtSet.pubPrtFormatTmpl.acctCode+'" data-tmplCode="'+data[i].printTmpl.tmplCode+'" data-formatTmplCode="'+data[i].printTmpl.formatTmplCode+'" value="'+data[i].prtSet.pubPrtPrintTmpl.tmplGuid+'" />');
					} else {
						var $hide = $('<input type="hidden" class="hideData" data-td="'+data[i].prtSet.pubPrtFormatTmpl[0].tmplType+'" data-sumMode="'+sum+'" data-agencyCode="'+data[i].prtSet.pubPrtFormatTmpl[0].agencyCode+'" data-acctCode="'+data[i].prtSet.pubPrtFormatTmpl[0].acctCode+'" data-tmplCode="'+data[i].printTmpl.tmplCode+'" data-formatTmplCode="'+data[i].printTmpl.formatTmplCode+'" value="'+data[i].prtSet.pubPrtPrintTmpl[0].tmplGuid+'" />');
					}
					$item.append($hide);
					
					//p_paper获取
					paperArr.push(data[i].prtSet.pubPrtPaper);
					
					//p_form获取
					if (cData.judge.moreAcct == null) {
						formArr.push(eval("("+data[i].prtSet.pubPrtFormatTmpl.formattmplValue+")"));
					} else {
						formArr.push(eval("("+data[i].prtSet.pubPrtFormatTmpl[0].formattmplValue+")"));
					}
					
					//p_formtmpl获取
					if (cData.judge.moreAcct == null) {
						formtmplArr.push(data[i].prtSet.pubPrtSortTmpl.sorttmplValue);
					} else {
						formtmplArr.push(data[i].prtSet.pubPrtSortTmpl[0].sorttmplValue);
					}
					
					//模板
					var $tmp = $('<div class="template-img"></div>');
					var $tmpPos;
					if(data[i].prtSet.pubPrtPrintTmpl.defaultTmpl=="1"&&defaultType==true){
						$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" checked="checked" id="">默认模板<span></span></label></div>');
					}else{
						$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" id="">默认模板<span></span></label></div>');
					}
					if (cData.judge.moreAcct == null) {
						var $img = $('<img src="'+data[i].prtSet.pubPrtFormatTmpl.tmplImg+'"/>');
					} else {
						var $img = $('<img src="'+data[i].prtSet.pubPrtFormatTmpl[0].tmplImg+'"/>');
					}
					$tmp.append($tmpPos);
					$tmp.append($img);
					$item.append($tmp);
					
					//标题
					var $tit = $('<p class="template-title">'+data[i].printTmpl.tmplName+'</p>');
					$item.append($tit);
					
					$("#printPreview .template-box ul.list-unstyled").append($item);
					
					if(data[i].prtSet.pubPrtPrintTmpl.defaultTmpl=="1"&&defaultType==true){
						$("#printPreview .template-box").find(".template-item").eq(i).click();
					}
					
					//第一个默认后，开关变量变为false
					if(data[i].prtSet.pubPrtPrintTmpl.defaultTmpl=="1"&&defaultType==true){
						defaultType = false;
					}
				}
				
				//判断图片宽高
				$('.template-item img').each(function(){
					var divh=$(this).parent('.template-img').height();
					var divw=$(this).parent('.template-img').width();
					$(this).css({"max-width":divw});
					$(this).css({"max-height":divh-4});
					$(this).css({"margin-top":"0px"});
					$(this).css({"margin-bottom":"0px"});
				});
    		},
    		
    		//点击模板事件
    		clickModel:function(dom){
    			dom.addClass("choose").siblings().removeClass("choose");
        		var n = dom.index();
        		
        		//加载数据开始，显示等待遮罩
        		if($(".spinner-cover").get(0)){
        			$(".spinner-cover").show();
        		}else{
					var $spinnerCover = $('<div class="spinner-cover"></div>');
					var $spinner= $('<div class="spinner"></div>');
					for(var i=1;i<=5;i++){
						var $rect = $('<div class="rect'+i+'"></div>');
						$spinner.append($rect);
					}
					$spinnerCover.append($spinner);
					$(".vpppBox-right").append($spinnerCover);
        		}
        		
        		if(oFrom=="rptPrint"){
        			var m = cData.print.models;
        			
        			$("#tmplName").text(dom.find(".template-title").text());
    				$("input[name='orientation'][value='"+m[n].pPaper.paperOrientation+"']").prop("checked",true);
        			$("#paperHeight").val(m[n].pPaper.paperHeight);
        			$("#paperWidth").val(m[n].pPaper.paperWidth);
        			$("#marginTop").val(m[n].pPaper.marginTop);
        			$("#marginBottom").val(m[n].pPaper.marginBottom);
        			$("#marginLeft").val(m[n].pPaper.marginLeft);
        			$("#marginRight").val(m[n].pPaper.marginRight);
        			
        			//判断是明细账还是总账
        			if(cData.print.componentId=="GL_RPT_JOURNAL"){
        				//明细账
        				var options = {};
        				var result;
        				var pageCount = 0;
        				$("#all_pages").html("");
        				for(var i=0;i<cData.print.pDataArr.length;i++){
							result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pDataArr[i], options);
							$("#all_pages").append(result.html);
							page.scaleAgency();	
							pageCount = pageCount + result.pageCount;
        				}
        				document.getElementById("pageNum").innerHTML = "总计： " + pageCount + " 页";
        			}else if(cData.print.componentId=="GL_RPT_LEDGER"){
        				//总账
        				/***********老方案    开始**********/
        				/*var options = {};
						var result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pData, options);
						document.getElementById("all_pages").innerHTML = result.html;
						document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";*/
						/***********老方案    结束**********/
						
						/***********新方案    开始**********/
						//判断是否有printdatas
						/*var options = {};
        				var result;
						if(!("printdatas" in cData.print.pData)){
							//不存在，说明是单条
							result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pData, options);
							document.getElementById("all_pages").innerHTML = result.html;
							page.scaleAgency();	
							document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
						}else{
							//存在，说明是多条
							var pageCount = 0;
	        				$("#all_pages").html("");
	        				for(var i=0;i<cData.print.pData.printdatas.length;i++){
								result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pData.printdatas[i], options);
								$("#all_pages").append(result.html);
								page.scaleAgency();	
								pageCount = pageCount + result.pageCount;
	        				}
	        				document.getElementById("pageNum").innerHTML = "总计： " + pageCount + " 页";
						}*/
						/***********新方案    结束**********/
						//cData.print.pData 不存在 改回和原来明细账一样处理方法  by guohx
        				//判断是调用账簿打印方法还是使用本页面打印方法，如果pDataArr存在则调用新方法，不存在则调用老方法
        				if(cData.print.pDataArr!=undefined){
        					var options = {};
            				var result;
            				var pageCount = 0;
            				$("#all_pages").html("");
            				for(var i=0;i<cData.print.pDataArr.length;i++){
    							result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pDataArr[i], options);
    							$("#all_pages").append(result.html);
    							pageCount = pageCount + result.pageCount;
            				}
            				document.getElementById("pageNum").innerHTML = "总计： " + pageCount + " 页";
        				}else{
        					var options = {};
            				var result;
    						if(!("printdatas" in cData.print.pData)){
    							//不存在，说明是单条
    							result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pData, options);
    							document.getElementById("all_pages").innerHTML = result.html;
    							page.scaleAgency();	
    							document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
    						}else{
    							//存在，说明是多条
    							var pageCount = 0;
    	        				$("#all_pages").html("");
    	        				for(var i=0;i<cData.print.pData.printdatas.length;i++){
    								result = getPrintHtml(cData.print.models[n].pFormtmpl, cData.print.models[n].pPaper, eval("("+cData.print.models[n].pForm+")"), cData.print.pData.printdatas[i], options);
    								$("#all_pages").append(result.html);
    								page.scaleAgency();	
    								pageCount = pageCount + result.pageCount;
    	        				}
    	        				document.getElementById("pageNum").innerHTML = "总计： " + pageCount + " 页";
    						}
        				}
						
        			}
					
					var pageWidth = $("#all_pages .data_page").outerWidth();
					$("#all_pages").parent().css({"width":pageWidth});
					
					//加载数据完成，隐藏等待遮罩
        			$(".spinner-cover").hide();
					
					//如果是直接打印执行打印默认模板
      		  		if(oType=="1"){
      		  			$('#all_pages').printArea();
      		  			//防止直接打印进来每次点击模板都执行系统打印，使其只有第一次进入才会执行
      		  			oType = "0";
      		  		}
        		}else if(oFrom=="vouPrint"||oFrom=="vou"){
        			searchData.agencyCode = dom.find("input[type='hidden']").attr("data-agencyCode");
        			searchData.acctCode = dom.find("input[type='hidden']").attr("data-acctCode");
        			searchData.formatTmplCode = dom.find("input[type='hidden']").attr("data-formatTmplCode");
        			searchData.tmplCode = dom.find("input[type='hidden']").attr("data-tmplCode");
        			searchData.vouGuids = guidArr;
        			
        			var setInfo = paperArr[n];
        			
        			$("#tmplName").text(dom.find(".template-title").text());
    				$("input[name='orientation'][value='"+setInfo.paperOrientation+"']").prop("checked",true);
        			$("#paperHeight").val(setInfo.paperHeight);
        			$("#paperWidth").val(setInfo.paperWidth);
        			$("#marginTop").val(setInfo.marginTop);
        			$("#marginBottom").val(setInfo.marginBottom);
        			$("#marginLeft").val(setInfo.marginLeft);
        			$("#marginRight").val(setInfo.marginRight);
        			
        			
        			var callback = function(result){
        				pData = result.data.data;
        				
      					p_formtmpl = formtmplArr[n];
	        			p_paper = paperArr[n];
	        			p_form = formArr[n];
	        			p_data = pData;
	        			
						var s = dom.find("input[type='hidden']").attr("data-sumMode");
						var td = dom.find("input[type='hidden']").attr("data-td");
						td = (td=="1")?true:false;
						var options = {sumMode:s,isTD:td};
						var result = getPrintHtml_PZ(p_formtmpl, p_paper, p_form, p_data, options);
						
						document.getElementById("all_pages").innerHTML = result.html;
						document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
						page.scaleAgency();	
						var pageWidth = $("#all_pages .data_page").outerWidth();
						$("#all_pages").parent().css({"width":pageWidth});
						
						//加载数据完成，隐藏等待遮罩
        				$(".spinner-cover").hide();
						
						//如果是直接打印执行打印默认模板
	      		  		if(oType=="1"){
	      		  			var printCount = {};
							printCount.vouGuids = guidArr;
							ufma.post("/gl/vouPrint/updatePtintCountByGuid",printCount,function(result){});
	      		  			$('#all_pages').printArea();
	      		  			//防止直接打印进来每次点击模板都执行系统打印，使其只有第一次进入才会执行
	      		  			oType = "0";
	      		  		}
        			};
        			if (cData.judge.moreAcct == null) {
        				ufma.post("/gl/vouPrint/getPrtData",searchData,callback);
        			} else if (cData.judge.moreAcct == true) {
        				ufma.post("/gl/vouPrint/getMaPrtData",searchData,callback);
        			}
        		}else if(oFrom=="vouBox"){
        			var setInfo = paperArr[n];
        			
        			$("#tmplName").text(dom.find(".template-title").text());
    				$("input[name='orientation'][value='"+setInfo.paperOrientation+"']").prop("checked",true);
        			$("#paperHeight").val(setInfo.paperHeight);
        			$("#paperWidth").val(setInfo.paperWidth);
        			$("#marginTop").val(setInfo.marginTop);
        			$("#marginBottom").val(setInfo.marginBottom);
        			$("#marginLeft").val(setInfo.marginLeft);
        			$("#marginRight").val(setInfo.marginRight);
        			
        			//判断vouGuids数组是否为空数组
        			if(cData.print.vouGuids.length!=0){
        				//不是空数组
        				searchData.agencyCode = dom.find("input[type='hidden']").attr("data-agencyCode");
	        			searchData.acctCode = dom.find("input[type='hidden']").attr("data-acctCode");
	        			searchData.formatTmplCode = dom.find("input[type='hidden']").attr("data-formatTmplCode");
	        			searchData.tmplCode = dom.find("input[type='hidden']").attr("data-tmplCode");
	        			guidArr = cData.print.vouGuids;
	        			searchData.vouGuids = guidArr;
	        			
	        			var callback = function(result){
	        				pData = result.data.data;
	        				
	      					p_formtmpl = formtmplArr[n];
		        			p_paper = paperArr[n];
		        			p_form = formArr[n];
		        			p_data = pData;
		        			
							var s = $("#printPreview .template-item.choose").find("input[type='hidden']").attr("data-sumMode");
							var td = $("#printPreview .template-item.choose").find("input[type='hidden']").attr("data-td");
							td = (td=="1")?true:false;
							var options = {sumMode:s,isTD:td};
							var result = getPrintHtml_PZ(p_formtmpl, p_paper, p_form, p_data, options);
							document.getElementById("all_pages").innerHTML = result.html;
							document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
							page.scaleAgency();	
							var pageWidth = $("#all_pages .data_page").outerWidth();
							$("#all_pages").parent().css({"width":pageWidth});
							
							//加载数据完成，隐藏等待遮罩
        					$(".spinner-cover").hide();
							
							//如果是直接打印执行打印默认模板
		      		  		if(oType=="1"){
		      		  			var printCount = {};
								printCount.vouGuids = guidArr;
								ufma.post("/gl/vouPrint/updatePtintCountByGuid",printCount,function(result){});
		      		  			$('#all_pages').printArea();
		      		  			//防止直接打印进来每次点击模板都执行系统打印，使其只有第一次进入才会执行
		      		  			oType = "0";
		      		  		}
	        			};
	        			ufma.post("/gl/vouPrint/getPrtData",searchData,callback);
        			}else{
        				//是空数组
        				searchData = cData.print.condition;
        				
        				searchData.vouAgencyCode = cData.print.base.agencyCode;
        				searchData.vouAcctCode = cData.print.base.acctCode;
        				
        				searchData.agencyCode = dom.find("input[type='hidden']").attr("data-agencyCode");
	        			searchData.acctCode = dom.find("input[type='hidden']").attr("data-acctCode");
	        			searchData.formatTmplCode = dom.find("input[type='hidden']").attr("data-formatTmplCode");
	        			searchData.tmplCode = dom.find("input[type='hidden']").attr("data-tmplCode");
	        			
	        			var callback = function(result){
	        				pData = result.data.data;
	        				
	        				guidArr = result.data.vouGuids;
	        				
	        				p_formtmpl = formtmplArr[n];
	        				p_paper = paperArr[n];
		        			p_form = formArr[n];
		        			p_data = pData;
		        			
							var s = $("#printPreview .template-item.choose").find("input[type='hidden']").attr("data-sumMode");
							var td = $("#printPreview .template-item.choose").find("input[type='hidden']").attr("data-td");
							td = (td=="1")?true:false;
							var options = {sumMode:s,isTD:td};
							var result = getPrintHtml_PZ(p_formtmpl, p_paper, p_form, p_data, options);
							document.getElementById("all_pages").innerHTML = result.html;
							document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
							page.scaleAgency();	
							var pageWidth = $("#all_pages .data_page").outerWidth();
							$("#all_pages").parent().css({"width":pageWidth});
							
							//加载数据完成，隐藏等待遮罩
        					$(".spinner-cover").hide();
							
							//如果是直接打印执行打印默认模板
		      		  		if(oType=="1"){
		      		  			var printCount = {};
								printCount.vouGuids = guidArr;
								ufma.post("/gl/vouPrint/updatePtintCountByGuid",printCount,function(result){});
		      		  			$('#all_pages').printArea();
		      		  			//防止直接打印进来每次点击模板都执行系统打印，使其只有第一次进入才会执行
		      		  			oType = "0";
		      		  		}
	        			}
	        			ufma.post("/gl/vouBox/showPrintVivew",searchData,callback);
        			}
        		}else if(oFrom=="glRptJournal"||oFrom=="glRptLedger"){
        			$("#tmplName").text(dom.find(".template-title").text());
    				$("input[name='orientation'][value='"+paperArr[n].paperOrientation+"']").prop("checked",true);
        			$("#paperHeight").val(paperArr[n].paperHeight);
        			$("#paperWidth").val(paperArr[n].paperWidth);
        			$("#marginTop").val(paperArr[n].marginTop);
        			$("#marginBottom").val(paperArr[n].marginBottom);
        			$("#marginLeft").val(paperArr[n].marginLeft);
        			$("#marginRight").val(paperArr[n].marginRight);
        			
        			p_formtmpl = formtmplArr[n];
        			p_paper = paperArr[n];
        			p_form = formArr[n];
        			p_data = cData.print.pData;
        			
        			var options = {title:cData.print.title};
					var result = getPrintHtml(p_formtmpl, p_paper, p_form, p_data, options);
					document.getElementById("all_pages").innerHTML = result.html;
					document.getElementById("pageNum").innerHTML = "总计： " + result.pageCount + " 页";
					page.scaleAgency();	
					var pageWidth = $("#all_pages .data_page").outerWidth();
					$("#all_pages").parent().css({"width":pageWidth});
					
					//加载数据完成，隐藏等待遮罩
        			$(".spinner-cover").hide();
					
					//如果是直接打印执行打印默认模板
      		  		if(oType=="1"){
      		  			$('#all_pages').printArea();
      		  			//防止直接打印进来每次点击模板都执行系统打印，使其只有第一次进入才会执行
      		  			oType = "0";
      		  		}
    			}
        		
        	
    		},
    		
    		scaleAgency:function(){
    			var agency= document.getElementById("agency");    			 
    			if (agency!=null){
    		      var agencywidth=agency.getAttribute("agencywidth");
    			  agency.style.transform="scale("+Math.min(agencywidth/agency.innerText.length,1)+","+Math.min(agencywidth/agency.innerText.length,1)+")";
    			}
    		},
    		
    		//模板加载（明细账、总账页面）
    		getPrtFormatList:function(result){
				var data = result.data;
				
				var defaultType = true;//防止多个默认模板，导致程序出错
				
				//循环创建模板
				for(var i=0;i<data.length;i++){
					var $item = $('<li class="template-item"></li>');
					
					var $hide = $('<input type="hidden" value="'+data[i].formattmplCode+'">');
					$item.append($hide);
					
					//p_formtmpl获取
					formtmplArr.push(data[i].sorttmplValue);
					
					//p_form获取
					formArr.push(eval("("+data[i].formattmplValue+")"));
					
					//p_paper获取
					var paperOne = {
						marginBottom:data[i].marginBottom,
						marginLeft:data[i].marginLeft,
						marginRight:data[i].marginRight,
						marginTop:data[i].marginTop,
						paperCode:data[i].paperCode,
						paperHeight:data[i].paperHeight,
						paperName:data[i].paperName,
						paperOrientation:data[i].paperOrientation,
						paperWidth:data[i].paperWidth
					}
					paperArr.push(paperOne);
					
					//模板
					var $tmp = $('<div class="template-img"></div>');
					var $tmpPos;
					if(data[i].defaultTmpl=="1"&&defaultType==true){
						$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" checked="checked" id="">默认模板<span></span></label></div>');
					}else{
						$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" id="">默认模板<span></span></label></div>');
					}
					var $img = $('<img src="'+data[i].tmplImg+'"/>');
					$tmp.append($tmpPos);
					$tmp.append($img);
					$item.append($tmp);
					
					//标题
					var $tit = $('<p class="template-title">'+data[i].paperName+'</p>');
					$item.append($tit);
					
					$("#printPreview .template-box ul.list-unstyled").append($item);
					
					if(data[i].defaultTmpl=="1"&&defaultType==true){
						$("#printPreview .template-box").find(".template-item").eq(i).click();
					}
					
					//第一个默认后，开关变量变为false
					if(data[i].defaultTmpl=="1"&&defaultType==true){
						defaultType = false;
					}
				}
				
				//判断图片宽高
				$('.template-item img').each(function(){
					var divh=$(this).parent('.template-img').height();
					var divw=$(this).parent('.template-img').width();
					$(this).css({"max-width":divw});
					$(this).css({"max-height":divh-4});
					$(this).css({"margin-top":"0px"});
					$(this).css({"margin-bottom":"0px"});
				});
    		},
    		
    		//初始化页面
			initPage:function(){
				this.templateBoxHeight();
				
				cData = ufma.getObjectCache("iWantToPrint");
				oType = cData.judge.direct;
				oFrom = cData.judge.dataFrom;
				if (!(cData.judge.moreAcct == null)) {
					$('#printPreview labe.mt-checkbox').prop('disabled', true)
				}
				if(oFrom=="rptPrint"){
					//创建模板
					var models = cData.print.models;
					
					var defaultType = true;//防止多个默认模板，导致程序出错
					
					for(var i=0;i<models.length;i++){
						var $item = $('<li class="template-item"></li>');
						
						var $hide = $('<input type="hidden" value="'+models[i].formattmplCode+'">');
						$item.append($hide);
						
						//模板
						var $tmp = $('<div class="template-img"></div>');
						var $tmpPos;
						if(models[i].defaultTmpl=="1"&&defaultType==true){
							$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" checked="checked" id="">默认模板<span></span></label></div>');
						}else{
							$tmpPos = $('<div class="blue-top"></div><div class="template-check"><label class="mt-checkbox mt-checkbox-outline"><input type="radio" name="defaultTemplate" id="">默认模板<span></span></label></div>');
						}
						//第一个默认后，开关变量变为false
						if(models[i].defaultTmpl=="1"&&defaultType==true){
							defaultType = false;
						}
						var $img = $('<img src="'+models[i].tmplImg+'"/>');
						$tmp.append($tmpPos);
						$tmp.append($img);
						$item.append($tmp);
						
						//标题
						var $tit = $('<p class="template-title">'+models[i].formattmplName+'</p>');
						$item.append($tit);
						
						$("#printPreview .template-box ul.list-unstyled").append($item);
					}
					//点击模板选中样式改变及事件
	            	$("#printPreview .template-box").on("click",".template-item",function(){
	            		page.clickModel($(this));
	            	});
					$("#printPreview .template-box").find(".template-item:eq("+cData.judge.index+")").click();
					
					//判断图片宽高
					$('.template-item img').each(function(){
						var divh=$(this).parent('.template-img').height();
						var divw=$(this).parent('.template-img').width();
						$(this).css({"max-width":divw});
						$(this).css({"max-height":divh-4});
						$(this).css({"margin-top":"0px"});
						$(this).css({"margin-bottom":"0px"});
						/*if(divh/divw>h/w){
							$(this).css({"width":"80%"});
						}else{
							$(this).css({"height":"80%"});
						}*/
					});
					
				}else if(oFrom=="vouPrint"||oFrom=="vou"){
					getData.agencyCode = cData.print.agencyCode;
					getData.acctCode = cData.print.acctCode;
					getData.componentId = cData.print.componentId;
					
					guidArr = cData.print.vouGuids;
					
					//点击模板选中样式改变及事件
					$("#printPreview .template-box").on("click",".template-item",function(){
	            		page.clickModel($(this));
	            	});
					
					//获得模板数据
					if (cData.judge.moreAcct == null) {
        				ufma.post("/gl/vouPrint/getPrtList",getData,page.getPrtList);
        			} else if (cData.judge.moreAcct == true) {
        				ufma.post("/gl/vouPrint/getMaPrtList",getData,page.getPrtList);
        			}
				}else if(oFrom=="rptPrintCatalog"){
					var $style = $('<style type="text/css">@media print{.catalog{width: 793.69px;min-height:1122.52px;margin: 0 auto;background-color: #FFFFFF;color: #333333;padding-top: 24px;}.catalog h3{font-size: 24px;line-height: 32px;text-align: center;margin: 0;}.catalog .list-unstyled{margin: 24px 80px 0 80px;}.catalog .list-unstyled li{font-size: 14px;line-height: 20px;margin-bottom: 8px;}.catalog .list-unstyled li .pull-left{padding-right: 16px;background-color: #FFFFFF;}.catalog .list-unstyled li .pull-right{padding-left: 16px;background-color: #FFFFFF;}.catalog .list-unstyled li .dot{width: 100%;height: 9px;border-bottom: 1px dotted #D9D9D9;}}</style>');
					var $page = $('<div class="catalog"><h3>目录</h3</div>');
					
					var $ul = $('<ul class="list-unstyled"></ul>');
					var num = 1;
					for(var i=0;i<cData.print.length;i++){
						var $li = $('<li class="clearfix"></li>');
						var $title = $('<div class="pull-left">'+cData.print[i].title+'</div>');
						if(i>0){
							num = num + parseInt(cData.print[i].num);
						}
						var $num = $('<div class="pull-right">'+num+'</div>');
						var $dot = $('<div class="dot"></div>');
						$li.append($title);
						$li.append($num);
						$li.append($dot);
						$ul.append($li);
					}
					$page.append($ul);
					$('#all_pages').append($style);
					$('#all_pages').append($page);
				}else if(oFrom=="vouBox"){
					getData = cData.print.base;
					
					//点击模板选中样式改变及事件
					$("#printPreview .template-box").on("click",".template-item",function(){
	            		page.clickModel($(this));
	            	});
					
					//获得模板数据
			  		ufma.post("/gl/vouPrint/getPrtList",getData,page.getPrtList);
				}else if(oFrom=="glRptJournal"||oFrom=="glRptLedger"){
					getData = cData.print.getModels;
					
					//点击模板选中样式改变及事件
					$("#printPreview .template-box").on("click",".template-item",function(){
	            		page.clickModel($(this));
	            	});
					
					//获得模板数据
			  		ufma.post("/gl/GlRpt/getPrtFormatList",getData,page.getPrtFormatList);
				}
			},
    		
    		//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function(){
				//页面设置显示隐藏
            	$("#printPreview .set-content").hide();
            	$("#printPreview .show-set").on("click",function(){
            		if($(this).find(".glyphicon").hasClass("icon-angle-bottom")){
            			$(this).find(".glyphicon").removeClass("icon-angle-bottom").addClass("icon-angle-top");
            			$("#printPreview .set-content").slideDown();
            		}else{
            			$(this).find(".glyphicon").removeClass("icon-angle-top").addClass("icon-angle-bottom");
            			$("#printPreview .set-content").slideUp();
            		}
            	});
            	
            	//点击模板选中样式改变及事件（放在此处）
//          	$("#printPreview .template-box").on("click",".template-item",function(){
//          		page.clickModel($(this));
//          	});
            	
            	//点击打印按钮
            	$("#printPreview #btn-print").on("click",function(){
            		if(oFrom=="vouPrint"||oFrom=="vouBox"||oFrom=="vou"){
            			//传递打印次数，接口：/gl/vouPrint/updatePtintCountByGuid
						var printCount = {};
						printCount.vouGuids = guidArr;
						var callback = function(result){}
						ufma.post("/gl/vouPrint/updatePtintCountByGuid",printCount,callback);
						$('#all_pages').printArea();
            		}else if(oFrom=="rptPrint"||oFrom=="glRptJournal"||oFrom=="glRptLedger"){
            			$('#all_pages').printArea();
            		}else if(oFrom=="rptPrintCatalog"){
            			$('.catalog').printArea();
            		}

//					var headstr = "<html><head><title></title></head><body>"; 
//					var footstr = "</body>"; 
//					var newstr = document.all.item("all_pages").innerHTML; 
//					var oldstr = document.body.innerHTML; 
//					document.body.innerHTML = headstr+newstr+footstr; 
//					window.print(); 
//					document.body.innerHTML = oldstr; 
            	});
            	
            	//点击默认保存默认模板
            	$("#printPreview").on("click","labe.mt-checkbox",function(event){
            		event.stopPropagation();
            	});
            	$("#printPreview").on("change","input[name='defaultTemplate']",function(){
            		var clickType = 0;
            		
            		//判断是打印来源
            		if(oFrom=="vouPrint"||oFrom=="vouBox"||oFrom=="vou"){
            			if($(this).prop("checked")==true&&clickType==0){
	            			var defaultData = getData;
	            			defaultData.tmplGuid = $(this).parents(".template-item").find("input[type='hidden']").val();
	            			defaultData.formatTmplCode = $(this).parents(".template-item").find("input[type='hidden']").attr("data-formattmplcode");
	            			defaultData.tmplCode = $(this).parents(".template-item").find("input[type='hidden']").attr("data-tmplcode");
	            			
	            			var callback = function(result){
	            				ufma.showTip(result.msg,function(){},result.flag);
	            			};
	            			ufma.post("/gl/vouPrint/saveDefultTmpl",defaultData,callback);
	            			
	            			clickType++;
	            		}
            		}else if(oFrom=="rptPrint"||oFrom=="glRptJournal"||oFrom=="glRptLedger"){
            			if($(this).prop("checked")==true&&clickType==0){
            				if(oFrom=="rptPrint"){
            					var defaultData = {
	            					agencyCode:cData.print.agencyCode,
	            					acctCode:cData.print.acctCode,
	            					componentId:cData.print.componentId,
	            					rptFormat:cData.print.rptFormat,
	            					formattmplCode:$(this).parents('.template-item').find('input[type="hidden"]').val()
	            				}
            				}else{
            					var defaultData = {
	            					agencyCode:cData.print.getModels.agencyCode,
	            					acctCode:cData.print.getModels.acctCode,
	            					componentId:cData.print.getModels.componentId,
	            					rptFormat:cData.print.getModels.rptFormat,
	            					formattmplCode:$(this).parents('.template-item').find('input[type="hidden"]').val()
	            				}
            				}
            				var callback = function(result){
	            				ufma.showTip(result.msg,function(){},result.flag);
	            			};
	            			ufma.post("/gl/GlRpt/setDefaultModel",defaultData,callback);
	            			
	            			clickType++;
            			}
            		}
            		
            		event.stopPropagation();
            	});
            	
            	//模板搜索
            	$(".template-search").on("keyup","input[type='text']",function(){
            		var searchVal = $(this).val();
            		if(searchVal==""){
            			$("li.template-item").show();
            		}else{
            			$(".template-title").each(function(){
            				if($(this).text().indexOf(searchVal)==-1){
            					$(this).parents("li.template-item").hide();
            				}else{
            					$(this).parents("li.template-item").show();
            				}
            			});
            		}
            	});
			},
			
            //此方法必须保留
            init:function(){
            	$('link[href*="u.css"]').remove();
            	this.initPage();
				this.onEventListener();
            }
        }
    }();
/////////////////////
    page.init();
});
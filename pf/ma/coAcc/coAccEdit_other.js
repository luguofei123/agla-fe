$(function(){
	window._close=function(action){
        if (window.closeOwner){
            var data = {action:action};
            window.closeOwner(data);
        }
    }
    var page = function(){
        
    	//向后台传参的对象
        var postData = {};
        var cAction = 'close';
        
        var codeRule;
        var isRuled;
    	
    	return{
    		
    		//表单验证提示信息
    		getErrMsg:function(errcode){
	            var error = {
	                0: '请选择单位',
	                1: '请选择科目体系',
	                2: '账套名称不能为空',
	                3: '财务负责人不能为空',
	                4: '账套编码不能为空',
	                5: '您选择的科目体系无会计要素，请先在科目体系界面添加会计要素！',
	                9: '编码不符合编码规则:'
	            }
	            return error[errcode];
	        },
        
        	//$.ajax()，加载单位下拉列表
        	/*initAgency:function(result){
				var data = result.data;
				
				//全部option节点
				var $allOp = $('<option value="*"> </option>');
				$("#coAccEdit #caAddAgency").append($allOp);
				//循环创建并添加单位节点
				for(var i=0;i<data.length;i++){
					var $agencyOp = $('<option data-pid="'+data[i].pId+'" value="'+data[i].id+'">'+data[i].name+'</option>');
					$("#coAccEdit #caAddAgency").append($agencyOp);
				}
				
				page.formdata=$('#coAccEdit').serializeObject();
			},*/
			initAgency: function(result) {
				var data = result.data;
				var all = {
					"id": "0",
					"pId": "0",
					"name": "全部",
					"agencyType": "0"
				};
				data.unshift(all);
				page.treeAgency = $("#treeAgency").ufmaTreecombox({
					valueField: 'id',
					textField: 'name',
					readOnly: false,
					leafRequire: true,
					popupWidth: 1.5,
					data: data,
					onchange: function(data) {
						
					}
				});
			},
			
			//$.ajax()，获取编码规则
			getCodeRule:function(){
				codeRule = "3-2-2-2-2-2";
				var callback = function(result){
					var cRule=result.codeRule;
	                if(cRule!=null&&cRule!=""){
	                    codeRule = cRule;
	                }
				}
				ufma.get("/ma/sys/element/getElementCodeRule?tableName=MA_ELE_ACCT","",callback);
			},
			
			//根据chrId，获取财务负责人变更信息，接口：/ma/sys/eleCoacc/getCoCoaccHis/+chrId
			eleCoaccHis:function(result){
				var data = result.data;
				if(data!=null&&data.length>0){
					for(var i=0;i<data.length;i++){
						var bfTime = data[i].bfLatestOpDate;
						bfTime = bfTime.substring(0,bfTime.indexOf(" "));
						bfTime = bfTime.replace(/\\/g,"-");
						var fName = data[i].fiLeader==null?"":data[i].fiLeader;
						var $li;
						if(data[i].latestOpDate!=null){
							$li = $('<li>'+bfTime+'~'+data[i].latestOpDate+' '+fName+'</li>');
						}else{
							$li = $('<li>'+bfTime+' 至今 '+fName+'</li>');
						}
						$("#project-ul").append($li);
					}
				}
			},
			
			//$.ajax()，加载科目体系按钮
			initEleAcc:function(result){
				var data = result.data;
				
				//全部option节点
				var $allOp = $('<option value="*"> </option>');
				$("#coAccEdit #caEditEleAcc").append($allOp);
				//循环创建科目体系按钮
				for(var i=0;i<data.length;i++){
					var $eleAccOp;
					if(window.ownerData.action=="edit"&&window.ownerData.data.accsCode==data[i].chrCode){
						$eleAccOp = $('<option value="'+data[i].chrCode+'" data-carryovertype="'+data[i].carryOverType+'" data-accacount="'+data[i].accaCount+'" selected="selected">'+data[i].chrName+'</option>');
					}else{
						$eleAccOp = $('<option value="'+data[i].chrCode+'" data-carryovertype="'+data[i].carryOverType+'" data-accacount="'+data[i].accaCount+'">'+data[i].chrName+'</option>');
					}
					$("#coAccEdit #caEditEleAcc").append($eleAccOp);
				}
				
				page.formdata=$('#coAccEdit').serializeObject();
			},
        	
        	initPage:function(){
        		//获取编码规则
        		this.getCodeRule();
        		
        		//判断action
        		if(window.ownerData.action=='edit'){
        			var data = window.ownerData.data;
        			
        			ufma.get("/ma/sys/eleCoacc/getCoCoaccHis/"+data.chrId,"",page.eleCoaccHis);
        			
        			if(data.lType=="system"){
						
						var isUseAcctCallback = function(result){
							var isType = result.data;
							if(isType==0){
								$("#coAccEdit #caEditChrName").parent().html('<div class="txt-chrName" style="padding-top:4px;padding-left:8px;">'+data.chrName+'</div>');
								$("#coAccEdit #caEditEleAcc").parent().html('<div class="txt-accs" style="padding-top:4px;padding-left:8px;" data-val="'+data.accsCode+'">'+data.accsName+'</div>');
								if(data.carryOverType=="2"){
									$("#coAccEdit #caCarryOverTypes .btn-group[data-toggle='buttons']").parent().html('<div class="txt-carryOver" style="padding-top:4px;padding-left:8px;" data-val="'+data.carryOverType+'">年结</div>');
								}else if(data.carryOverType=="1"){
									$("#coAccEdit #caCarryOverTypes .btn-group[data-toggle='buttons']").parent().html('<div class="txt-carryOver" style="padding-top:4px;padding-left:8px;" data-val="'+data.carryOverType+'">月结</div>');
								}
								if(data.isParallel=="0"){
									$("#coAccEdit #caIsParallel .btn-group[data-toggle='buttons']").parent().html('<div class="txt-parallel" style="padding-top:4px;padding-left:8px;" data-val="'+data.isParallel+'">否</div>');
								}else if(data.isParallel=="1"){
									$("#coAccEdit #caIsParallel .btn-group[data-toggle='buttons']").parent().html('<div class="txt-parallel" style="padding-top:4px;padding-left:8px;" data-val="'+data.isParallel+'">是</div>');
								}
								
								page.formdata=$('#coAccEdit').serializeObject();
							}else{
								$("#coAccEdit #caEditChrName").val(data.chrName);
								$("#coAccEdit #caCarryOverTypes input[value='"+data.carryOverType+"']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
								$("#coAccEdit #caIsParallel input[value='"+data.isParallel+"']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
								//初始化页面，加载科目体系按钮
								ufma.get("/ma/sys/eleAcc/seltAccs","",page.initEleAcc);
							}
						}
						ufma.get("/ma/sys/eleCoacc/isUseAcct?agencyCode="+data.agencyCode+"&chrCode="+data.chrCode,"",isUseAcctCallback);
        			}
        			
					$("#coAccEdit #treeAgency").parent().html('<div class="txt-agy" style="padding-top:4px;padding-left:8px;" data-val="'+data.agencyCode+'">'+data.agencyName+'</div>');
					$("#coAccEdit input[type='hidden']").attr("data-enabled",data.enabled);
					$("#coAccEdit input[type='hidden']").val(data.chrId);
					$("#coAccEdit #caEditChrCode").parent().html('<div class="txt-chrCode" style="padding-top:4px;padding-left:8px;">'+data.chrCode+'</div>');
					$("#coAccEdit #caFiLeader").val(data.fiLeader);
					
					//判断系统级和单位级编辑
					if(data.lType=="unit"){
						//单位级
						$("#coAccEdit #caEditEleAcc").parent().html('<div class="txt-accs" style="padding-top:4px;padding-left:8px;" data-val="'+data.accsCode+'">'+data.accsName+'</div>');
						$("#coAccEdit #caEditChrName").parent().html('<div class="txt-chrName" style="padding-top:4px;padding-left:8px;">'+data.chrName+'</div>');
						if(data.carryOverType=="2"){
							$("#coAccEdit #caCarryOverTypes .btn-group[data-toggle='buttons']").parent().html('<div class="txt-carryOver" style="padding-top:4px;padding-left:8px;" data-val="'+data.carryOverType+'">年结</div>');
						}else if(data.carryOverType=="1"){
							$("#coAccEdit #caCarryOverTypes .btn-group[data-toggle='buttons']").parent().html('<div class="txt-carryOver" style="padding-top:4px;padding-left:8px;" data-val="'+data.carryOverType+'">月结</div>');
						}
						if(data.isParallel=="0"){
							$("#coAccEdit #caIsParallel .btn-group[data-toggle='buttons']").parent().html('<div class="txt-parallel" style="padding-top:4px;padding-left:8px;" data-val="'+data.isParallel+'">否</div>');
						}else if(data.isParallel=="1"){
							$("#coAccEdit #caIsParallel .btn-group[data-toggle='buttons']").parent().html('<div class="txt-parallel" style="padding-top:4px;padding-left:8px;" data-val="'+data.isParallel+'">是</div>');
						}
						
						$("#btn-save-add").hide();
						$("#btn-save").removeClass("btn-default").addClass("btn-primary");
						
						this.formdata=$('#coAccEdit').serializeObject();
					}
        		}else if(window.ownerData.action=='add'){
        			//初始化页面，加载单位下拉
					ufma.get("/ma/sys/eleAgency/getAgencyTree","",this.initAgency);
					
					//初始化页面，加载科目体系按钮
					ufma.get("/ma/sys/eleAcc/seltAccs","",this.initEleAcc);
        		}
        	},

        	//新增事件
        	saveCoAcc:function(){
        		
    			//参数设定
    			if(!$("#coAccEdit #treeAgency").get(0)){
    				postData.agencyCode = $("#coAccEdit .txt-agy").attr("data-val");
    			}else{
    				postData.agencyCode = page.treeAgency.getValue();
    			}
				postData.enabled = $("#coAccEdit input[type='hidden']").attr("data-enabled");
				postData.chrId = $("#coAccEdit input[type='hidden']").val();
				if(!$("#coAccEdit #caEditChrName").get(0)){
					postData.chrName = $("#coAccEdit .txt-chrName").text();
				}else{
					postData.chrName = $("#coAccEdit #caEditChrName").val();
				}
				if(!$("#coAccEdit #caEditChrCode").get(0)){
					postData.chrCode = $("#coAccEdit .txt-chrCode").text();
				}else{
					postData.chrCode = $("#coAccEdit #caEditChrCode").val();
				}
				if(!$("#coAccEdit #caEditEleAcc").get(0)){
					postData.accsCode = $("#coAccEdit .txt-accs").attr("data-val");
				}else{
					postData.accsCode = $("#coAccEdit #caEditEleAcc option:selected").val();
				}
				postData.fiLeader = $("#coAccEdit #caFiLeader").val();
				if(!$("#coAccEdit #caCarryOverTypes .btn-group[data-toggle='buttons']").get(0)){
					postData.carryOverType = $("#coAccEdit .txt-carryOver").attr("data-val");
				}else{
					postData.carryOverType = $("#coAccEdit input[name='carryOverType']:checked").val();
				}
				if(!$("#coAccEdit #caIsParallel .btn-group[data-toggle='buttons']").get(0)){
					postData.isParallel = $("#coAccEdit .txt-carryOver").attr("data-val");
				}else{
					postData.isParallel = $("#coAccEdit input[name='isParallel']:checked").val();
				}
				
				if(window.ownerData.action=='edit'){
					postData.setYear = window.ownerData.data.setYear;
					postData.rgCode = window.ownerData.data.rgCode;
				}
				
				return postData;
        	},
        	save:function(){
        		page.saveCoAcc();

        		var callback = function(result){
        			ufma.showTip(result.msg,function(){
        				cAction = 'save';
	        			_close(cAction);
        			},result.flag);
        		}

//      		ufma.post("/ma/sys/eleCoacc/saveCoacc",postData,callback);
        	},

            //此方法必须保留
            init:function(){
            	page.reslist = ufma.getPermission();
            	ufma.isShow(page.reslist);
        		
//				//根据action判断页面功能，进行不同的操作
        		this.initPage();
        		ufma.parse();
//      		page.formdata=$('#coAccEdit').serializeObject();
            		
        		//点击保存的事件
				$('#btn-save').on('click',function(){
					if(!$("#coAccEdit .form-horizontal .form-group.error").get(0)){
						page.save();
					}
                });
				
				//点击取消的事件
				$('#btn-close').on('click',function(){
					var tmpFormData = $('#coAccEdit').serializeObject();
					if (!ufma.jsonContained(page.formdata, tmpFormData)) {
						ufma.confirm('您修改了账套信息，关闭前是否保存？', function (action) {
							if (action) {
								page.save();
							} else {
								_close(cAction);
							}
						});
					} else {
						_close(cAction);
					}   
                });
                
                $('#btn-save-add').on('click',function(){
                	if(!$("#coAccEdit .form-horizontal .form-group.error").get(0)){
                		page.saveCoAcc();
                		
                		var callback = function(result){
							ufma.showTip(result.msg,"",result.flag);
							
							if(result.flag=="success"){
								page.formdata = postData;
							}
							
//							window.location.reload();
							$('#coAccEdit form')[0].reset();
							
							cAction = 'save';
						}
					
						ufma.post("/ma/sys/eleCoacc/saveCoacc",postData,callback);
                	}
                });
                
                /*----表单验证  开始----*/
               	//单位表单
           		/*$("#caAddAgency").on("blur change",function(){
           			if($(this).val()=="*"){
           				ufma.showInputHelp("caAddAgency",'<span class="error">'+page.getErrMsg(0)+'</span>');
           				$(this).closest('.form-group').addClass('error');
           			}else{
           				ufma.hideInputHelp("caAddAgency");
           				$(this).closest('.form-group').removeClass('error');
           			}
           		});*/
           		
           		//科目体系表单
           		$("#caEditEleAcc").on("blur change",function(){
           			if($(this).val()=="*"){
           				ufma.showInputHelp("caEditEleAcc",'<span class="error">'+page.getErrMsg(1)+'</span>');
           				$(this).closest('.form-group').addClass('error');
           			}else{
           				//根据科目体系carryOverType，带出结账方式
           				var carryOverType = $(this).find("option:selected").attr('data-carryovertype');
           				$("#coAccEdit #caCarryOverTypes input[value='"+carryOverType+"']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
           				
           				//根据科目体系accaCount，判断平行记账
           				if($(this).find("option:selected").attr('data-accacount')=="2"){
	                		$("#coAccEdit #caIsParallel input[value='1']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
	                		ufma.hideInputHelp("caEditEleAcc");
           					$(this).closest('.form-group').removeClass('error');
           					$("#btn-save-add,#btn-save").prop("disabled",false);
	                	}else if($(this).find("option:selected").attr('data-accacount')=="1"){
	                		$("#coAccEdit #caIsParallel input[value='0']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
	                		ufma.hideInputHelp("caEditEleAcc");
           					$(this).closest('.form-group').removeClass('error');
           					$("#btn-save-add,#btn-save").prop("disabled",false);
	                	}else if($(this).find("option:selected").attr('data-accacount')=="0"){
	                		$("#coAccEdit #caIsParallel input[value='0']").prop("checked",true).parents("label").addClass("active").siblings().removeClass("active");
	                		ufma.showInputHelp("caEditEleAcc",'<span class="error">'+page.getErrMsg(5)+'</span>');
           					$(this).closest('.form-group').addClass('error');
	                		$("#btn-save-add,#btn-save").prop("disabled",true);
	                	}
           			}
           		});
           		
           		//账套名称
           		$("#caEditChrName").on('focus',function(){
           			ufma.hideInputHelp("caEditChrName");
       				$(this).closest('.form-group').removeClass('error');
           		}).on('blur',function(){
           			if($(this).val()==""){
           				ufma.showInputHelp("caEditChrName",'<span class="error">'+page.getErrMsg(2)+'</span>');
           				$(this).closest('.form-group').addClass('error');
           			}else{
           				ufma.hideInputHelp("caEditChrName");
       					$(this).closest('.form-group').removeClass('error');
           			}
           		});
           		
           		//财务负责人
           		$("#caFiLeader").on('focus',function(){
           			ufma.hideInputHelp("caFiLeader");
       				$(this).closest('.form-group').removeClass('error');
           		}).on('blur',function(){
           			if($(this).val()==""){
           				ufma.showInputHelp("caFiLeader",'<span class="error">'+page.getErrMsg(3)+'</span>');
           				$(this).closest('.form-group').addClass('error');
           			}else{
           				ufma.hideInputHelp("caFiLeader");
       					$(this).closest('.form-group').removeClass('error');
           			}
           		});
           		
           		//账套编码
           		$("#caEditChrCode").on('focus paste keyup change',function(e){
           			e.stopepropagation;
           			ufma.hideInputHelp("caEditChrCode");
                    $(this).closest('.form-group').removeClass('error');
                    var textVal = $(this).val();
                    
                    var str = ufma.splitDMByFA(codeRule,textVal);
                    isRuled = str.isRuled;
           		}).on('blur',function(){
           			if($(this).val()==""){
           				ufma.showInputHelp('caEditChrCode', '<span class="error">'+page.getErrMsg(4)+'</span>');
                        $(this).closest('.form-group').addClass('error');
           			}else if(!isRuled){
           				ufma.showInputHelp('caEditChrCode', '<span class="error">'+page.getErrMsg(9)+' '+codeRule+'</span>');
                        $(this).closest('.form-group').addClass('error');
           			}else{
           				ufma.hideInputHelp("caEditChrCode");
           				$(this).closest('.form-group').removeClass('error');
           			}
           		});
               	/*----表单验证  结束----*/
            }
        }
    }();
/////////////////////
    page.init();
});
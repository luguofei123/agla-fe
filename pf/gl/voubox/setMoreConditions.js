$(function () {
    window._close = function (state) {
        if (window.closeOwner) {
            var data = {
                action: state,
				result: serachData,
				datebtn:$('.vouTimes').find(".btn-primary").attr('id')
            };
            window.closeOwner(data);
        }
	};
	function intToVouNo(i) {
		var vouNo = i;
		if(vouNo < 10) {
			vouNo = '000' + vouNo;
		} else if(vouNo < 100) {
			vouNo = '00' + vouNo;
		} else if(vouNo < 1000) {
			vouNo = '0' + vouNo
		}
		return vouNo;

	}
    var ptData = ufma.getCommonData();
	var serachData = window.ownerData.serachData;
	var nowfisPerd = window.ownerData.serachData;
    var treeObj;
    var pfData;
    var user="";
    var page = function () {
        var portList = {};
        return {
          //凭证类型
          	initVouTypeData:function(){
				var data = window.ownerData.agencyData
				var voutypeacca ;
				var vousinglepz ;
				if (data.isParallel == '1' && data.isDoubleVou == '1') {
					voutypeacca = 1
					vousinglepz = false
					$(".vbAccaCode").parents(".vou-query-li").show();
				} else if (data.isParallel == '1' && data.isDoubleVou == '0') {
					voutypeacca = 1
					vousinglepz = true
					$(".vbAccaCode").parents(".vou-query-li").hide();
				} else if (data.isParallel == '0') {
					voutypeacca = 0
					vousinglepz = false
					$(".vbAccaCode").parents(".vou-query-li").hide();
				}
				if (voutypeacca == 1 && vousinglepz == false) {
					ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '1,2', "get", "", page.initVouType);
				} else {
					ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '*', "get", "", page.initVouType);
				}
          	},
			getLastDay: function (year, month) {
				var new_year = year; //取当前的年份          
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
				if (month > 12) {
					new_month -= 12; //月份减          
					new_year++; //年份增          
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 
			},
			initVouType: function (result) {
				var data = result.data;
				vouTypeArray = {};
				//循环把option填入select
				var $vouTypeOp = '<option value="">  </option>';
				for (var i = 0; i < data.length; i++) {
					//创建凭证类型option节点
					vouTypeArray[data[i].code] = data[i].name;
					$vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
				}
				$('#vbVouTypeCode').html($vouTypeOp);
			},
			getVouResource: function () {
				ufma.ajaxDef('/gl/enumerate/VOU_SOURCE', "get", "", function (result) {
					var obj = {
						ENU_CODE: "*",
						ENU_NAME: "全部",
						codeName: "* 全部"
					};
					result.data.unshift(obj);
					//凭证来源
					// rpt.cbAcct.getValue()
					rpt.vouSource = $("#vouSource").ufmaCombox2({
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME',
						readOnly: false,
						placeholder: '请选择凭证来源',
						data:result.data,
						onchange: function (data) {

						},
						onComplete: function (sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
						}
					});
					$('#vouSource').find('.ufma-combox-border').css('border','')
					// rpt.vouSource.load(result.data);
					if ($.isNull(rpt.vouSource.getValue())) {
						rpt.vouSource.val("*");
					}
					if(!$.isNull(serachData.vouSource)){
						rpt.vouSource.val(serachData.vouSource)
					}
				})
			},
			getVouvbInputor: function () {
				ufma.ajaxDef('/gl/vouBox/getInputorNames', "get", {"agencyCode": window.ownerData.agencyCode,"acctCode": window.ownerData.acctCode,}, function (result) {
					var obj = {
						code: "",
						name: ""
					};
					for(var i=0;i<result.data.length;i++){
						for(var z in result.data[i]){
							result.data[i].code=result.data[i][z]
							result.data[i].name=result.data[i][z]
						}
					}
					result.data.unshift(obj);
					//凭证来源
					rpt.vbInputor = $("#vbInputor").ufmaCombox2({
						valueField: 'code',
						textField: 'name',
						readOnly: false,
						data:result.data,
						placeholder: '请选择制单人',
						onchange: function (data) {
							if(rpt.vbInputor.getValue() == user){
								$("#vbShowOwn").attr('checked',true).prop('checked',true)
							}else{
								$("#vbShowOwn").attr('checked',false).prop('checked',false)
							}
						},
						onComplete: function (sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
						}
					});
					$('#vbInputor').find('.ufma-combox-border').css('border','')
					// rpt.vbInputor.load(result.data);
					if ($.isNull(rpt.vbInputor.getValue())) {
						rpt.vbInputor.val("");
					}
					if(!$.isNull(serachData.inputorName)){
						rpt.vbInputor.val(serachData.inputorName)
					}
				})
			},
			getacco:function(){
			},
            getAccItemType: function () {
				var data= window.ownerData.accItems
				var accItemArgu = {
					"acctCode": window.ownerData.acctCode,
					"agencyCode": window.ownerData.agencyCode,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId
				};
				var keys = []
                for (var i = 1; i < data.length; i++) {
					keys.push(data[i].accItemCode)
                    renderItem(data[i], i);
				}
				accItemArgu.accItemCode = keys.join(",")
				ufma.get("/gl/common/glAccItemData/getAccItemTreeForVouBox", accItemArgu, function (result) {
					for (var k in result.data){
						var item = result.data[k]
						$("#" + k).ufTextboxlist({//初始化
							idField    :'id',//可选
							textField  :'codeName',//可选
							pIdField  :'pId',//可选
							async      :false,//异步
							data       :item,//列表数据
							// icon:'icon-book',
							onChange   :function(sender, treeNode){
							}
						});
						page.setCoditions(k);
					}
				})
                var clearHtml = '<div class="clearfix"></div>';
                $(".tab-content-box .content").eq(1).find("#frmQuery2").append(clearHtml);
                function renderItem(item, i) {
                    var id = item.accItemCode;
                    var accItemName = item.accItemCode;
                        if(item.accItemName && item.accItemName != ""){
                            accItemName = item.accItemName;
                        }
                    var itemsHtml = '<div class="form-group">' +
                        '<label class="control-label" title="' + accItemName + '">' + accItemName + '：</label>' +
                        '<div class="control-element">' +
                        // '<div id="' + id + '" name="' + id + '" class="uf-treecombox" style="width: 262px"></div>' +
                        '<div id="' + id + '" name="' + id + '" class="uf-textboxlist" disabled="true" autocomplete="on" style="width: 240px"></div>' +
                        '</div>' +
                        '</div>';
                    $(".tab-content-box .content").eq(1).find("#frmQuery2").append(itemsHtml);
                    var accItemArgu = {
                        "acctCode": window.ownerData.acctCode,
                        "agencyCode": window.ownerData.agencyCode,
                        "setYear": rpt.nowSetYear,
                        "userId": rpt.nowUserId,
                        "accItemCode": item.accItemCode
                    };
                }
            },
			setDayInYear: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				$('#vbStartVouDate').getObj().setValue(Year + '-01-01');
				$('#vbEndVouDate').getObj().setValue(Year + '-12-31');
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			setDayInMonth: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				if(nowfisPerd!=''){
					Month = nowfisPerd
					nowfisPerd = ''
				}
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');

				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + this.getLastDay(Year, Month));
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			setDayInDay: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			
            //set主要素
            setdetail: function () {
            	$("#"+window.ownerData.period).addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary");
            	$('#vbAccaCode .btn[value="'+serachData.accaCode+'"]').addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary")
			   	$('#vbStartVouDate').getObj().setValue(serachData.startVouDate)
				$('#vbEndVouDate').getObj().setValue(serachData.endVouDate)
				$("#"+window.ownerData.datebtn).addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary");
				$('#vbVouTypeCode option[value="'+serachData.vouTypeCode+'"]').attr('selected',true).prop('selected',true)
				$('#vbStartVouNo').val(serachData.startVouNo)
				$('#vbEndVouNo').val(serachData.endVouNo)
				$('#vbtreasuryHook .btn[value="'+serachData.treasuryHook+'"]').addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary")
				$('#vbPrintStatus .btn[value="'+serachData.printCount+'"]').addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary")
				$('#isWriteoff .btn[value="'+serachData.isWriteOff+'"]').addClass("btn-primary").removeClass("btn-default").siblings("button").addClass("btn-default").removeClass("btn-primary")
				if (serachData.startTotalAmt != null) {
					$('#vbstartTotalAmt').val(serachData.startTotalAmt)
				}
				if (serachData.endTotalAmt != null) {
					$('#vbendTotalAmt').val(serachData.endTotalAmt)
				}
				if (serachData.startStadAmt != null) {
					$('#vbStartStadAmt').val(serachData.startStadAmt)
				}
				if (serachData.endStadAmt != null) {
					$('#vbEndStadAmt').val(serachData.endStadAmt)
				}
				if (serachData.startStadAmt != null) {
					$('#vbStartStadAmt').val(serachData.startStadAmt)
				}
				if (serachData.assStartAmt != null) {
					$('#vbassStartAmt').val(serachData.assStartAmt)
				}
				if (serachData.assEndAmt != null) {
					$('#vbassEndAmt').val(serachData.assEndAmt)
				}
				$('#vbRemark').val(serachData.remark);
				$('#billNo').val(serachData.billNo);
				if(rpt.vbInputor.getValue()==user){
					$("#vbShowOwn").attr('checked',true).prop('checked',true)
				}
				//重新加载会计科目
				var url = '/gl/sys/coaAcc/getAccoTree/' + serachData.setYear + '?agencyCode=' + serachData.agencyCode + '&acctCode=' + serachData.acctCode;
				if ($('#vbVouTypeCode option:selected').val() != undefined && $('#vbVouTypeCode option:selected').val() != "") {
					url += '&vouTypeCode=' + $('#vbVouTypeCode option:selected').val();
				}
				var accaCode = $("#vbAccaCode").find('.btn-primary').val();
				if (accaCode != undefined && accaCode != "") {
					url += "&accaCode=" + accaCode;
				}
				callback = function (result) {
					page.acco=$("#vbAcco").ufmaTreecombox2({
						valueField: "id",
						textField: "codeName", 
						readOnly: false,
						leafRequire: false,
						data: result.data,
						popupWidth: 1.5,
						onchange: function (data) {
							serachData.accoCode = data.id;
						}
					});
					page.acco.val(serachData.accoCode)
				}
				ufma.get(url, {}, callback);
            },
            //set值
            setCoditions: function (ids) {
				var accitemdata=serachData.accItem
				var nowitemid = ids
            	if(accitemdata[nowitemid]!=undefined){
            		$('#'+nowitemid).getObj().val(accitemdata[nowitemid])
            	}
//          	$("#frmQuery2").find(".uf-textboxlist[id='" + itemId + "']").getObj().val(codeList.join(','));
            },
            initPage: function () {
                //请求辅助项
                page.getAccItemType();
                //凭证类型
                page.initVouTypeData()
                //凭证来源
				page.getVouResource()
				page.getVouvbInputor()
                //会计科目
				page.getacco()
            },

            onEventListener: function () {
                $(".nav-tabs").on("click", "li", function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active").siblings("li").removeClass("active");
                        var num = $(this).index();
                        $(".tab-content-box .content").eq(num).fadeIn();
						$(".tab-content-box .content").eq(num).siblings(".content").fadeOut();
						if(num == '1'){
							$("#btn-del").show()
						}else{
							$("#btn-del").hide()
						}
                    }
				});
				$('#vbStartVouNo').on('blur',function(){
					if(!isNaN(parseFloat($('#vbStartVouNo').val()))){
						$('#vbStartVouNo').val(intToVouNo(parseFloat($('#vbStartVouNo').val())))
					}else{
						$('#vbStartVouNo').val('')
					}
				})
				$('#vbEndVouNo').on('blur',function(){
					if(!isNaN(parseFloat($('#vbEndVouNo').val()))){
						$('#vbEndVouNo').val(intToVouNo(parseFloat($('#vbEndVouNo').val())))
					}else{
						$('#vbEndVouNo').val('')
					}
				})
				$(".vouTimes").find(".vouTimeYear").on("click", function () {
					page.setDayInYear();
				});
				$(".vouTimes").find(".vouTimeMonth").on("click", function () {
					page.setDayInMonth();
				});
				$(".vouTimes").find(".vouTimeDay").on("click", function () {
					page.setDayInDay();
				});
                $("#btnClose").on("click", function () {
                    _close();
                });
                $("#btnSave").on("click", function () {
                	if ($("#vouBox .vbAccaCode:hidden").get(0)) {
						serachData.accaCode = "";
					} else {
						serachData.accaCode = $(".vbAccaCode button.btn-primary").val();
					}
					serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					//第二行
					if ($('#vbVouTypeCode option').length == 0) {
						serachData.vouTypeCode = "";
					} else {
						serachData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					}
					serachData.startVouNo = $('#vbStartVouNo').val();
					serachData.endVouNo = $('#vbEndVouNo').val();
					if ($('#vbstartTotalAmt').val() == "") {
						serachData.startTotalAmt = null;
					} else {
						serachData.startTotalAmt = Number($('#vbstartTotalAmt').val());
					}
					if ($('#vbendTotalAmt').val() == "") {
						serachData.endTotalAmt = null;
					} else {
						serachData.endTotalAmt = Number($('#vbendTotalAmt').val());
					}
					if(serachData.startTotalAmt>serachData.endTotalAmt && serachData.startTotalAmt!=null && serachData.endTotalAmt!=null){
						ufma.showTip("凭证起始金额不得大于截止金额！");
						return false
					}
					if ($('#vbStartStadAmt').val() == "") {
						serachData.startStadAmt = null;
					} else {
						serachData.startStadAmt = Number($('#vbStartStadAmt').val());
					}
					if ($('#vbEndStadAmt').val() == "") {
						serachData.endStadAmt = null;
					} else {
						serachData.endStadAmt = Number($('#vbEndStadAmt').val());
					}
					if(serachData.startStadAmt>serachData.endStadAmt && serachData.startStadAmt!=null && serachData.endStadAmt!=null){
						ufma.showTip("分录起始金额不得大于截止金额！");
						return false
					}
					if($('#vbassStartAmt').val() == "") {
						serachData.assStartAmt = null;
					} else {
						serachData.assStartAmt = Number($('#vbassStartAmt').val());
					}
					if($('#vbassEndAmt').val() == "") {
						serachData.assEndAmt = null;
					} else {
						serachData.assEndAmt = Number($('#vbassEndAmt').val());
					}
					if(serachData.assStartAmt>serachData.assEndAmt && serachData.assStartAmt!=null && serachData.assEndAmt!=null){
						ufma.showTip("辅助分录起始金额不得大于截止金额！");
						return false
					}
					//会计科目
					if ($('#vbAcco_input').val() == "" || page.acco == undefined) {
						serachData.accoCode = "";
					} else {
						serachData.accoCode = page.acco.getValue();
					}
					//第三行
					serachData.inputorName = rpt.vbInputor.getValue()
					serachData.remark = $('#vbRemark').val();
					serachData.printCount = $('#vbPrintStatus button.btn-primary').val();
					serachData.treasuryHook = $('#vbtreasuryHook button.btn-primary').val();
					serachData.isWriteOff = $('#isWriteoff button.btn-primary').val();
					serachData.vouSource = rpt.vouSource.getValue();
					
					serachData.billNo = $('#billNo').val();
                    var accItem={};
                    var argu2 = $('#frmQuery2').serializeObject();
                    $("#frmQuery2 .form-group").each(function (i) {
                        var id = $(this).find(".uf-textboxlist").attr("id");
                        if (argu2[id] != "") {
                            var items = $("#" + id).getObj().getItem();
                            if(items.length > 0 && items[0] != null){
                            	var keys = []
                                for (var i = 0;i<items.length;i++){
                                    keys.push(items[i].id);
                                }
                                accItem[id]=keys.join(',')
                            }
                        }
                    });
                    serachData.accItem = accItem
                    _close("save");
				});
				$("#btn-del").on("click", function () {
                    $("#frmQuery2 .form-group").each(function (i) {
                        var id = $(this).find(".uf-textboxlist").attr("id");
						$('#'+id).getObj().clear()
                    });
				})
                //打印状态
                $("#vbPrintStatus").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").addClass("btn-default").removeClass("btn-primary");
                    }
                });
                //借贷
                $("#drcr").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").addClass("btn-default").removeClass("btn-primary");
                    }
                });
                //当前用户改变
                $("#nowUser").on("change", function () {
                    if ($(this).prop("checked")) {
                        $("#inputorName").val(ptData.svUserName).attr("disabled", true);
                        return false;
                    }
                    $("#inputorName").val("").attr("disabled", false);
                })
				$(".vbAccaCode").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
						//重新加载会计科目
						var url = '/gl/sys/coaAcc/getAccoTree/' + serachData.setYear + '?agencyCode=' + serachData.agencyCode + '&acctCode=' + serachData.acctCode;
						if ($('#vbVouTypeCode option:selected').val() != undefined && $('#vbVouTypeCode option:selected').val() != "") {
							url += '&vouTypeCode=' + $('#vbVouTypeCode option:selected').val();
						}
						var accaCode = $(this).val();
						if (accaCode != undefined && accaCode != "") {
							url += "&accaCode=" + accaCode;
						}
						callback = function (result) {
							page.acco = $("#vbAcco").ufmaTreecombox({
								data: result.data
							});
						}
						ufma.get(url, {}, callback);
					}
				});
				//点击期间按钮
				$(document).on("click", ".vouTimes button,vbPrintStatus button,#vbErrFlag button,#vbtreasuryHook button,#isWriteoff button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				$("#vbShowOwn").on("change", function () {
					if ($(this).prop("checked") === true) {
						rpt.vbInputor.val(user)
						$("#vbInputor").prop("disabled", true);
					} else {
						rpt.vbInputor.val("")
						$("#vbInputor").prop("disabled", false);
					}
				});
				$("#vbstartTotalAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var max = parseFloat($("#vbendTotalAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (max != "" && val > max) {
						ufma.showTip("起始金额不得大于截止金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbendTotalAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var min = parseFloat($("#vbstartTotalAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (min != "" && val < min) {
						ufma.showTip("截止金额不得小于起始金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbStartStadAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var max = parseFloat($("#vbEndStadAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (max != "" && val > max) {
						ufma.showTip("起始金额不得大于截止金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbEndStadAmt").on("blur", function () {
					var reg = /^[-\d]+(\.\d+)?$/;
					var min = parseFloat($("#vbStartStadAmt").val());
					var val = parseFloat($(this).val());
					if ($(this).val() == "") {
						$(this).val("");
					} else if (!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if (min != "" && val < min) {
						ufma.showTip("截止金额不得小于起始金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbassStartAmt").on("blur", function() {
					var reg = /^[-\d]+(\.\d+)?$/;
					var max = parseFloat($("#vbassEndAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val() == "") {
						$(this).val("");
					} else if(!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if(max != "" && val > max) {
						ufma.showTip("起始金额不得大于截止金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbassEndAmt").on("blur", function() {
					var reg = /^[-\d]+(\.\d+)?$/;
					var min = parseFloat($("#vbassStartAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val() == "") {
						$(this).val("");
					} else if(!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if(min != "" && val < min) {
						ufma.showTip("截止金额不得小于起始金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbStartVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbStartVouDate').getObj().setValue($('#vbEndVouDate').getObj().getValue());
					}

				})
				$("#vbEndVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
					}
				})
				$('#vbVouTypeCode').on("change",function(){
					page.getacco()
				})
            },
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
				pfData = ufma.getCommonData();
				page.svTransDate =  pfData.svTransDate
				user = pfData.svUserName;
//				serachData.setYear = svData.svSetYear;
//				serachData.rgCode = svData.svRgCode;
                this.initPage();
                this.onEventListener();
				page.setdetail()
                ufma.parse();
                ufma.parseScroll();
            }
        }
    }();

    page.init();
});
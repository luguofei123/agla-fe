$(function () {
	window._close = function () {
		if (window.closeOwner) {
			var data = { action: 'ok', result: {} };
			window.closeOwner(data);
		}
	}
	var page = function () {

        var createTableData = {};
		//接口
		var beginList = {
            createShowBankBalance:"/cu/bankBal/createShowBankBalance",//生成
            getCuBankRecon:"/cu/bankBal/getCuBankRecon",//获取出纳银行对账余额调节信息
            saveBankBalance:"/cu/bankBal/saveBankBalance"//保存预览余额调节表
		};

		return {
			namespace: 'bankReconciliation',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			resShowSetQueryBox: function (result) {
				var listItem = result.data;
				var nowList = [];
				var queryLi = $('#bankReconciliation').find(".rpt-query-box-li0");
				if (queryLi.length > 0) {
					for (var i = 0; i < queryLi.length; i++) {
						var listObj = {};

						//选中标签
						var tagDom = $(queryLi).eq(i).find("ul.rpt-tags-list li");
						var tagsArr = [];
						if (tagDom.length > 1) {
							for (var n = 0; n < tagDom.length - 1; n++) {
								var tagsObj = {};
								tagsObj.name = tagDom.eq(n).find("span").text();
								tagsObj.code = tagDom.eq(n).find("span").data("code");
								tagsArr.push(tagsObj);
							}
						}

						//推荐
						var iDom = $(queryLi).eq(i).find(".rpt-query-li-tip-c i");
						var tipsArr = [];
						for (var j = 0; j < iDom.length; j++) {
							var tipsObj = {};
							tipsObj.chrName = iDom.eq(j).text();
							tipsObj.chrCode = iDom.eq(j).data("code");
							tipsArr.push(tipsObj);
						}
						listObj.tags = tagsArr;
						listObj.tips = tipsArr;
						listObj.JOURNAL_ELE_CODE = $(queryLi).eq(i).find("label span").data("code");
						listObj.JOURNAL_SHOW_NAME = $(queryLi).eq(i).find("label span").text();

						nowList.push(listObj);
					}
				}
				console.info("nowList==" + nowList.length + "===" + JSON.stringify(nowList));
				listItem = listItem.concat(nowList);
				var newListItem = rpt.uniqueArray(listItem, "JOURNAL_ELE_CODE");
				for (var i = 0; i < nowList.length; i++) {
					for (var j = 0; j < newListItem.length; j++) {
						if (nowList[i].accItemCode == newListItem[j].accItemCode) {
							newListItem.splice(j, 1);
						}
					}
				}
				var ulLeftHtml = "";
				for (var i = 0; i < newListItem.length; i++) {
					var tipsObj = JSON.stringify([]);
					tipsObj = tipsObj.replace(/\"/g, "'");
					var leftHtml = ufma.htmFormat('<li data-journal="<%=journal%>" data-statement="<%=statement%>" data-id="<%=code%>" data-tips="<%=tips%>"><%=name%></li>', {
						code: newListItem[i].JOURNAL_ELE_CODE,
						name: newListItem[i].JOURNAL_SHOW_NAME,
						tips: tipsObj,
						journal: newListItem[i].JOURNAL_EXTEND_FIELD,
						statement: newListItem[i].STATEMENT_EXTEND_FIELD,
					});
					ulLeftHtml += leftHtml;
				}
				$(".rpt-set-list-ul-l").html(ulLeftHtml);
				$(".rpt-set-list-ul-l").find("li").eq(0).addClass("rpt-li-active");
				var ulRightHtml = "";
				for (var i = 0; i < nowList.length; i++) {
					var tagsObj = JSON.stringify(nowList[i].tags);
					var tipsObj = JSON.stringify(nowList[i].tips);
					tagsObj = tagsObj.replace(/\"/g, "'");
					tipsObj = tipsObj.replace(/\"/g, "'");
					var rightHtml = ufma.htmFormat('<li data-journal="<%=journal%>" data-statement="<%=statement%>" data-id="<%=code%>" data-tags="<%=tags%>" data-tips="<%=tips%>"><%=name%></li>', {
						code: nowList[i].JOURNAL_ELE_CODE,
						name: nowList[i].JOURNAL_SHOW_NAME,
						tags: tagsObj,
						tips: tipsObj,
						journal: nowList[i].JOURNAL_EXTEND_FIELD,
						statement: nowList[i].STATEMENT_EXTEND_FIELD,
					});
					ulRightHtml += rightHtml;
				}
				$(".rpt-set-list-ul-r").html(ulRightHtml);
				$(".rpt-set-list-ul-r").find("li").eq(0).addClass("rpt-li-active");

				rpt.setQuery = ufma.showModal('setQuery-box', 790);
			},
			sureSetQuery: function () {
				var ulDom = $(".rpt-set-list-ul-r");
				var liArr = []; //需要显示的辅助核算项
				$(ulDom).find("li").each(function () {
					var liObj = {};
					liObj.seq = "condition";
					liObj.dir = "";
					liObj.itemPos = "";
					liObj.itemTypeName = $(this).text();
					liObj.itemType = $(this).data("id");
					liObj.journal = $(this).data("journal");
					liObj.statement = $(this).data("statement")
					if ($(this).data("tips") != null && $(this).data("tips") != "") {
						liObj.tips = eval('(' + $(this).data("tips") + ')');
					} else {
						liObj.tips = "";
					}
					if ($(this).data("tags") != null && $(this).data("tags") != "") {
						liObj.items = eval('(' + $(this).data("tags") + ')');
					} else {
						liObj.items = "";
					}
					liArr.push(liObj);
				});

				page.glRptBalQueryShow(liArr);
			},
			glRptBalQueryShow: function (liArr) {
				var ulTop = $(".rpt-query-box-top");
				$(ulTop).find("li").eq(1).remove();
				var ulBottom = $("#setQuery").parents("li.rpt-query-box-li");
				$(ulBottom).prevAll().remove();

				var topArr = [];
				topArr.push(liArr[0]);
				var ulTopHtml = rpt.queryInputHtml(topArr);
				$(ulTop).append($(ulTopHtml));

				var bottomArr = [];
				if (liArr.length > 1) {
					for (var i = 1; i < liArr.length; i++) {
						bottomArr.push(liArr[i]);
					}
				}
				var ulBottomHtml = rpt.queryInputHtml(bottomArr);
				$(ulBottom).before($(ulBottomHtml));

				//显示选中的标签
				$("ul.rpt-tags-list").on("myEvent", function () {
					var ulDom = this;
					var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
					rpt.selectTip(ulDom, numDom);
				});
				$("ul.rpt-tags-list").trigger("myEvent");
				$(".rpt-query-li-tip").hide();
			},
			notEmpty: function (val) {
				if (val != null && val != "" && val != undefined) {
					return true;
				}
				return false;
			},
			//初始化表格
			initReconTable: function () {
				// var balanceKey = [];
				// var argu = {};
				// argu.fisPerd = window.ownerData.month;
				// argu.balanceKey = balanceKey;
				// argu.schemaGuid = window.ownerData.schemaGuid;
				// ufma.post('/gl/bank/getRecon', argu, function (result) {
				// 	page.drawReconTable(result.data);
				// });
                var argu = {};
                argu.fisPerd = window.ownerData.month;
                argu.bankInfo = window.ownerData.bankInfo;//开户行
                argu.schemaGuid = window.ownerData.schemaGuid;
                argu.agencyCode = page.agencyCode;
                ufma.post(beginList.createShowBankBalance, argu, function (result) {
                    if ($.isNull(window.ownerData.schemaGuid)) {
                        ufma.showTip("请先选择一个对账方案!", function () { }, "warning");
                        return false;
                    }
                    ufma.showTip(result.msg, '', result.flag);
                    page.drawReconTable(result.data);
                    createTableData = result.data;
                });
			},

			//绘制余额调节表表格
			drawReconTable: function (data) {
				//头固定
				page.drawReconTableHead(data);
				//上部分数据
				page.drawReconTableUpData(data);
				//中固定
				page.drawReconTableMid(data);
				//下部分数据
				page.drawReconTableDownData(data);
				//底固定
				page.drawReconTableBottom(data);

				$('#glRecon').html(page.tableHtm);

			},

			//头固定
			drawReconTableHead: function (data) {
				page.tableHtm =
					'<table class="ufma-table dateTable pull-left glReconTable">' +
					'<thead>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" style="width:37%" class="headInfo">项目</th>' +
					'<th colspan="1" rowspan="1" style="width:13%" class="headInfo">余额</th>' +
					'<th colspan="3" rowspan="1" style="width:37%" class="headInfo">项目</th>' +
					'<th colspan="1" rowspan="1" style="width:13%" class="headInfo">余额</th>' +
					'</tr>';
				if (data.head) {
					page.tableHtm +=
						ufma.htmFormat(
							'<tr role="row">' +
							'<th colspan="3" rowspan="1" class="headInfo">单位银行存款日记账余额</th>' +
							'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=agencyAmt%></th>' +
							'<th colspan="3" rowspan="1" class="headInfo">银行对账单余额</th>' +
							'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=bankAmt%></th>', {
								'agencyAmt': $.formatMoney(data.head.agencyAmt.toString()),
								'bankAmt': $.formatMoney(data.head.bankAmt.toString()),
							});
				} else {
					page.tableHtm +=
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">单位银行存款日记账余额</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important; "></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">银行对账单余额</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"></th>';
				}

				page.tableHtm +=
					'</tr>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">加：银行已收、单位未收款</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="3" rowspan="1" class="headInfo">加：单位已收、银行未收款</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'<tr role="row">' +
					'<th colspan="1" rowspan="1" class="headInfo">单据日期</th>' +
					//'<th colspan="1" rowspan="1" class="headInfo">对方账号</th>' +
					'<th colspan="2" rowspan="1" class="headInfo">单据摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">登账日期</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">编号</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'</thead>';
			},

			//上部分数据
			drawReconTableUpData: function (data) {
				if (data) {

				if(!data.bankIncomeLs){
                    return false;
                    }else {
                    var bankIncomeLsLength = data.bankIncomeLs.length;
                    }
					var agencyIncomeLsLength = data.agencyIncomeLs.length;

					var sub = bankIncomeLsLength - agencyIncomeLsLength;

					if (sub == 0) {
						//两边持平
						if ((bankIncomeLsLength === agencyIncomeLsLength) && (bankIncomeLsLength === 0)) {
							page.drawReconTableDataEmpety();
						} else {
							for (var i = 0; i < bankIncomeLsLength; i++) {
								page.drawReconTableData(data.bankIncomeLs[i], data.agencyIncomeLs[i]);
							}
						}
					} else if (sub > 0) {
						//左侧大于右侧
						for (var i = 0; i < bankIncomeLsLength; i++) {
							if (i < agencyIncomeLsLength) {
								page.drawReconTableData(data.bankIncomeLs[i], data.agencyIncomeLs[i]);
							} else {
								page.drawReconTableLeftMaxData(data.bankIncomeLs[i]);
							}
						}
					} else {
						//左侧小于右侧
						for (var i = 0; i < agencyIncomeLsLength; i++) {
							if (i < bankIncomeLsLength) {
								page.drawReconTableData(data.bankIncomeLs[i], data.agencyIncomeLs[i]);
							} else {
								page.drawReconTableLeftMinData(data.agencyIncomeLs[i]);
							}
						}
					}
				}
			},
			//中固定
			drawReconTableMid: function (data) {
				if (data.head) {
					page.tableHtm += ufma.htmFormat(
						'<thead>' +
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;    text-align: center !important;"><%=bankIncome%></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;    text-align: center !important;"><%=agencyIncome%></th>' +
						'</tr>', {
							'bankIncome': $.formatMoney(data.head.bankIncome.toString()),
							'agencyIncome': $.formatMoney(data.head.agencyIncome.toString())
						});
				} else {
					page.tableHtm +=
						'<thead>' +
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;    text-align: center !important;"></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;    text-align: center !important;"></th>' +
						'</tr>';
				}
				page.tableHtm +=
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">减：银行已付、单位未付款</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="3" rowspan="1" class="headInfo">减：单位已付、银行未付款</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'<tr role="row">' +
					'<th colspan="1" rowspan="1" class="headInfo">单据日期</th>' +
					//'<th colspan="1" rowspan="1" class="headInfo">对方账号</th>' +
					'<th colspan="2" rowspan="1" class="headInfo">单据摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">登账日期</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">编号</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'</thead>';
			},

			//下部分数据
			drawReconTableDownData: function (data) {
				if (data) {
					var bankIncomeLsLength = 0;
					if (!data.bankIncomeLs) {
						return false;
					} else {
						bankIncomeLsLength = data.bankIncomeLs.length;
					}


					var agencyLoanLsLength = data.agencyLoanLs.length;
					var bankLoanLsLength = data.bankLoanLs.length;
					var sub = bankLoanLsLength - agencyLoanLsLength;
					if (sub == 0) {
						//两边持平
						if ((bankLoanLsLength === agencyLoanLsLength) && (agencyLoanLsLength === 0)) {
							page.drawReconTableDataEmpety();
						} else {
							for (var i = 0; i < bankLoanLsLength; i++) {
								page.drawReconTableData(data.bankLoanLs[i], data.agencyLoanLs[i]);
							}
						}
					} else if (sub > 0) {
						//左侧大于右侧
						for (var i = 0; i < bankLoanLsLength; i++) {
							if (i < agencyLoanLsLength) {
								page.drawReconTableData(data.bankLoanLs[i], data.agencyLoanLs[i]);
							} else {
								page.drawReconTableLeftMaxData(data.bankLoanLs[i]);
							}
						}
					} else {
						//左侧小于右侧
						for (var i = 0; i < agencyLoanLsLength; i++) {
							if (i < bankLoanLsLength) {
								page.drawReconTableData(data.bankLoanLs[i], data.agencyLoanLs[i]);
							} else {
								page.drawReconTableLeftMinData(data.agencyLoanLs[i]);
							}
						}
					}
				}
			},

			//底固定
			drawReconTableBottom: function (data) {
				page.tableHtm += ufma.htmFormat(
					'<thead>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=bankLoan%></th>' +
					'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=agencyLoan%></th>' +
					'</tr>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">调节后的存款余额</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=agencyBalAmt%></th>' +
					'<th colspan="3" rowspan="1" class="headInfo">调节后的存款余额</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="padding-right: 4px !important;"><%=bankBalAmt%></th>' +
					'</tr>' +
					'</thead>', {
						'bankLoan': $.formatMoney(data.head.bankLoan.toString()),
						'agencyLoan': $.formatMoney(data.head.agencyLoan.toString()),
						'agencyBalAmt': $.formatMoney(data.head.agencyBalAmt.toString()),
						'bankBalAmt': $.formatMoney(data.head.bankBalAmt.toString())
					});
			},

			//持平
			drawReconTableData: function (bankRowData, agencyRowData) {
				page.tableHtm += ufma.htmFormat(
					'<tr height="37px">' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1"><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1"  style="text-align: center;"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1"><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBalA%></td>' +
					'</tr>', {
						'outStadDate': bankRowData.outStadDate,
						'vouNo': bankRowData.vouNo,
						'descpt': bankRowData.descpt,
						'outStadBal': $.formatMoney(bankRowData.outStadBal.toString()),
						'outStadDateA': agencyRowData.outStadDate,
						'vouNoA': agencyRowData.vouNo,
						'descptA': agencyRowData.descpt,
						'outStadBalA': $.formatMoney(agencyRowData.outStadBal.toString()),
					});
			},
			drawReconTableDataEmpety: function (bankRowData, agencyRowData) {
				page.tableHtm += ufma.htmFormat(
					'<tr height="37px">' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1"><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1"style="text-align: center;"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1"><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBalA%></td>' +
					'</tr>', {
						'outStadDate': "&nbsp;",
						'vouNo': "&nbsp;",
						'descpt': "&nbsp;",
						'outStadBal': "&nbsp;",
						'outStadDateA': "&nbsp;",
						'vouNoA': "&nbsp;",
						'descptA': "&nbsp;",
						'outStadBalA': "&nbsp;",
					});
			},

			//左侧大于右侧
			drawReconTableLeftMaxData: function (bankRowData) {
				page.tableHtm += ufma.htmFormat(
					'<tr height="37px">' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1" style="text-align: center;"><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					'</tr>', {
						'outStadDate': bankRowData.outStadDate,
						'vouNo': bankRowData.vouNo,
						'descpt': bankRowData.descpt,
						'outStadBal': $.formatMoney(bankRowData.outStadBal.toString()),
					});
			},
			//左侧小于右侧
			drawReconTableLeftMinData: function (agencyRowData) {
				page.tableHtm += ufma.htmFormat(
					'<tr height="37px">' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					//'<td colspan="1" rowspan="1"></td>' +
					'<td colspan="2" rowspan="1" style="text-align: center;"></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1" style="text-align: center;"><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right" style="padding-right: 4px !important;"><%=outStadBal%></td>' +
					'</tr>', {
						'outStadDateA': agencyRowData.outStadDate,
						'vouNoA': agencyRowData.vouNo,
						'descptA': agencyRowData.descpt,
						'outStadBal': $.formatMoney(agencyRowData.outStadBal.toString()),
					});
			},
			addZero: function (num) {
				if (num < 10) {
					num = '0' + num;
				}
				return num;
			},
			onEventListener: function () {


                $('#btn-save').on('click', function () {  //保存按钮
                    var argu = {};
                    argu.fisPerd = window.ownerData.month;
                    argu.schemaGuid = window.ownerData.schemaGuid;
                    argu.bankInfo = window.ownerData.bankInfo;//开户行

                    argu.agencyCode = page.agencyCode;
                    ufma.get(beginList.getCuBankRecon, argu, function (result) { //查询余额调节表数据量
                        if (result.data > 0) {
                            ufma.confirm('当前期间余额调节表数据发生变动,是否覆盖?', function (ac) {
                                if (ac) {
                                    var month = window.ownerData.month;;
                                    var GlBankReconHeadVo = createTableData.head;
                                    //revise S
                                    var theads = $(".glReconTable").find("thead");
                                    var len = theads.length;
                                    var showMoney = $(theads).eq(len-1).find(".showMoney");
                                    var dwrjMoney = $(showMoney).eq(showMoney.length-2).text();
                                    var yhdzMoney = $(showMoney).eq(showMoney.length-1).text();

                                    if(dwrjMoney !== yhdzMoney){
                                        ufma.showTip("调节后余额调节表不平衡，不能保存", "", "warning");
                                        return false;
                                    }
                                    //revise E
                                    ufma.post(beginList.saveBankBalance, GlBankReconHeadVo, function (result) {
                                        //revise S
                                        var flag = "success";
                                        if(result.flag == "fail"){
                                            flag = "error";
                                        }
                                        ufma.showTip(result.msg, function () {
                                            // page.initReconTable();
                                        }, flag);
                                        //revise E
                                    });
                                }
                            }, { 'type': 'warning' });
                        } else {
                            //revise S
                            var theads = $(".glReconTable").find("thead");
                            var len = theads.length;
                            var showMoney = $(theads).eq(len-1).find(".showMoney");
                            var dwrjMoney = $(showMoney).eq(showMoney.length-2).text();
                            var yhdzMoney = $(showMoney).eq(showMoney.length-1).text();
                            if(dwrjMoney !== yhdzMoney){
                                ufma.showTip("调节后余额调节表不平衡，不能保存", "", "warning");
                                return false;
                            }
                            //revise E
                            var month = window.ownerData.month;
                            var GlBankReconHeadVo = createTableData.head;
                            ufma.post(beginList.saveBankBalance, GlBankReconHeadVo, function (result) {
                                //revise S
                                var flag = "success";
                                if(result.flag == "fail"){
                                    flag = "error";
                                }
                                ufma.showTip(result.msg, function () {
                                    // page.initReconTable();
                                }, flag);
                                //revise E
                            });
                        }
                        console.log(result.data);
                    });



                });
				$('#btn-close').on('click', function () {
					_close();
				});

			},

			initPage: function () {
				var pfData = ufma.getCommonData();
				page.nowDate = pfData.svTransDate; //当前年月日
				page.rgCode = pfData.svRgCode; //区划代码
				page.bennian = pfData.svSetYear; //本年 年度
				page.benqi = pfData.svFiscalPeriod; //本期 月份
				page.today = pfData.svTransDate;
				page.userId = pfData.svUserId; //登录用户ID //修改权限  将svUserCode改为 svUserId  20181012
				page.userName = pfData.svUserName; //登录用户名称
				page.agencyCode = window.ownerData.agencyCode; //登录单位代码
				page.agencyName = pfData.svAgencyName; //登录单位名称

				var glRptBalDate = {
					format: 'yyyy-mm',
					autoclose: true,
					todayBtn: true,
					startView: 'year',
					minView: 'year',
					maxView: 'decade',
					language: 'zh-CN2'
				};
				$('#period').html(window.ownerData.fisPerd);
				$('#bankInfo').html(window.ownerData.bankInfo);

				page.initReconTable();
			},
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				this.initPage();
				this.onEventListener();
				ufma.parse();
			}
		}
	}();
	page.init();
})
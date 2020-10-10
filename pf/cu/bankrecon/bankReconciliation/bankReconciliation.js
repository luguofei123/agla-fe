$(function () {

	var page = function () {
		var printData = []
		var createTableData = {};
		//接口
		var beginList = {
			agencyList: "/cu/common/eleAgency/getAgencyTree", //单位列表接口
			accScheList: "/cu/bankReconSche/select", //方案查询接口
			createShowBankBalance: "/cu/bankBal/createShowBankBalance", //生成
			selectReconBal: "/cu/bankBal/selectReconBal", //查询余额调节表信息
			getCuBankRecon: "/cu/bankBal/getCuBankRecon", //获取出纳银行对账余额调节信息
			getExtendForReconBalance: "/cu/bankExtend/getExtendForBanlance", //获取余额调节表要素下拉
			saveBankBalance: "/cu/bankBal/saveBankBalance" //保存预览余额调节表
		};

		return {
			namespace: 'bankReconciliation',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			//获取对账方案列表
			reqMethod: function () {
				//初始化方案列表
				$("#selectList").ufCombox({
					idField: "schemaGuid",
					textField: "schemaName",
					placeholder: "请选择对账方案",
					onChange: function (sender, data) {
						page.schemaGuid = data.schemaGuid;
						page.schemaName = data.schemaName;
						page.initReconTable();
						var bankInfo = "";
						if (page.notEmpty(data.bank)) {
							bankInfo = data.bank;
						}
						if (page.notEmpty(data.bankAccount)) {
							bankInfo += "&nbsp;" + data.bankAccount;
						}
						$('#bankInfo').html(bankInfo);
						$('#saveMethod').addClass("disabled");
						page.removeQuery();
					},
					onComplete: function (sender) {
						$('#saveMethod').addClass("disabled");
					}
				});
				var argu = {
					"agencyCode": page.cbAgency.getValue()
				}
				ufma.get(beginList.accScheList, argu, function (result) {
					var data = result.data;
					var selectList = $("#selectList").ufCombox({
						data: data
					});
					if (result.data.length > 0) {
						$("#selectList").getObj().val(result.data[0].schemaGuid);
						page.schemaGuid = result.data[0].schemaGuid;
						page.initReconTable();
						var bankInfo = "";
						if (page.notEmpty(result.data[0].bank)) {
							bankInfo = result.data[0].bank;
						}
						if (page.notEmpty(result.data[0].bankAccount)) {
							bankInfo += "&nbsp;" + result.data[0].bankAccount;
						}
						$('#bankInfo').html(bankInfo);
					} else {
						$("#selectList").getObj().val('');
						page.schemaGuid = "";
						$(".bal-clear").html("");
					}
				});
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
				// $(".rpt-set-list-ul-l").find("li").eq(0).addClass("rpt-li-active");

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
				// $(".rpt-set-list-ul-r").find("li").eq(0).addClass("rpt-li-active");

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
			//切换单位或者方案时移除已经选中的辅项信息
			removeQuery: function () {
				var len = $(".rpt-query-box-top").find("li").length;
				for (var i = 1; i < $(".rpt-query-box-top").find("li").length - 1; i++) {
					$(".rpt-query-box-top").find("li").eq(i).remove();
				}
			},
			glRptBalQueryShow: function (liArr) {
				var ulTop = $(".rpt-query-box-top");
				$(ulTop).find("li").eq(1).remove();
				var ulBottom = $("#setQuery").parents("li.rpt-query-box-li");
				$(ulBottom).prevAll().remove();

				if (liArr.length > 0) {
					var topArr = [];
					topArr.push(liArr[0]);
					var ulTopHtml = rpt.queryInputHtml(topArr);
					$(ulTop).append($(ulTopHtml));
				}

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
			//初始化表格xuejx
			initReconTable: function () {
				var balanceKey = [];
				$('#bankReconciliation').find(".rpt-query-box-li0").each(function (i) {
					var spanDom = $(this).find('.subjoin span');
					var journal = $(spanDom).data('journal');
					var statement = $(spanDom).data('statement');
					var tagsLiDom = $(this).find('.rpt-tags-list li');
					var liArray = [];
					for (var i = 0; i < tagsLiDom.length - 1; i++) {
						liArray.push($(tagsLiDom).eq(i).find("span").data("code"));
					}
					extendsValue = liArray.join(",");
					if (page.notEmpty(journal) && page.notEmpty(statement) && page.notEmpty(extendsValue)) {
						balanceKey.push({
							'journalKey': journal,
							'journalVal': extendsValue,
							'statementKey': statement,
							'statementVal': extendsValue
						});
					}
				});
				var argu = {};
				//	var year = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getFullYear();
				//	var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;
				//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
				var year = (new Date($("#dateEnd").getObj().getValue())).getFullYear();
				var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;
				argu.fisPerd = month;
				argu.agencyCode = page.cbAgency.getValue();
				argu.balanceKey = balanceKey;
				argu.schemaGuid = page.schemaGuid;
				argu.setYear = page.setYear;
				argu.rgCode = page.rgCode;

				if ($.isNull(page.schemaGuid)) {
					ufma.showTip("请先选择一个对账方案!", function () { }, "warning");
					return false;
				}
				ufma.post(beginList.selectReconBal, argu, function (result) {
					printData = result.data
					if (JSON.stringify(result.data) == "{}") {
						$(".bal-clear").html(""); //切换方案时清空原有数据 重新绘制表格 guohx 
						ufma.showTip("对账方案 " + "[" + page.schemaName + "]" + "当期没有生成余额调节表", function () { }, "warning");

						return false;
					} else {
						page.drawReconTable(result.data);
					}

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
							'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"><%=agencyAmt%></th>' +
							'<th colspan="3" rowspan="1" class="headInfo">银行对账单余额</th>' +
							'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"><%=bankAmt%></th>', {
								'agencyAmt': $.formatMoney(data.head.agencyAmt.toString()),
								'bankAmt': $.formatMoney(data.head.bankAmt.toString()),
							});
				} else {
					page.tableHtm +=
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">单位银行存款日记账余额</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">银行对账单余额</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"></th>';
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
					'<th colspan="1" rowspan="1" class="headInfo tc" style="width:70px;text-align:center">单据日期</th>' +
					//'<th colspan="1" rowspan="1" class="headInfo">对方账号</th>' +
					'<th colspan="2" rowspan="1" class="headInfo" style="width:250px">单据摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="1" rowspan="1" class="headInfo tc" style="width:88px;text-align:center">登账日期</th>' +
					'<th colspan="1" rowspan="1" class="headInfo" style="width:70px">编号</th>' +
					'<th colspan="1" rowspan="1" class="headInfo" style="width:150px">摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'</thead>';
			},

			//上部分数据
			drawReconTableUpData: function (data) {
				if (data) {
					if (!$.isNull(data.bankIncomeLs)) {
						var bankIncomeLsLength = data.bankIncomeLs.length;
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
				}
			},
			//中固定
			drawReconTableMid: function (data) {
				if (data.head) {
					page.tableHtm += ufma.htmFormat(
						'<thead>' +
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"><%=bankIncome%></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"><%=agencyIncome%></th>' +
						'</tr>', {
							'bankIncome': $.formatMoney(data.head.bankIncome.toString()),
							'agencyIncome': $.formatMoney(data.head.agencyIncome.toString())
						});
				} else {
					page.tableHtm +=
						'<thead>' +
						'<tr role="row">' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"></th>' +
						'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
						'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"></th>' +
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
					'<th colspan="1" rowspan="1" class="headInfo tc" style="width:88px;text-align:center">单据日期</th>' +
					//'<th colspan="1" rowspan="1" class="headInfo">对方账号</th>' +
					'<th colspan="2" rowspan="1" class="headInfo" style="width:250px">单据摘要</th>' +
					'<th colspan="1" rowspan="1">' +
					'<hr/>' +
					'</th>' +
					'<th colspan="1" rowspan="1" class="headInfo tc" style="width:88px;text-align:center">登账日期</th>' +
					'<th colspan="1" rowspan="1" class="headInfo" style="width:70px">编号</th>' +
					'<th colspan="1" rowspan="1" class="headInfo">摘要</th>' +
					'<th colspan="1" rowspan="1" style="width:150px">' +
					'<hr/>' +
					'</th>' +
					'</tr>' +
					'</thead>';
			},

			//下部分数据
			drawReconTableDownData: function (data) {
				if (data) {
					if (!$.isNull(data.bankIncomeLs)) {
						var bankLoanLsLength = data.bankLoanLs.length;
						var agencyLoanLsLength = data.agencyLoanLs.length;
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
				}
			},

			//底固定
			drawReconTableBottom: function (data) {
				page.tableHtm += ufma.htmFormat(
					'<thead>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"><%=bankLoan%></th>' +
					'<th colspan="3" rowspan="1" class="headInfo">小计</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"><%=agencyLoan%></th>' +
					'</tr>' +
					'<tr role="row">' +
					'<th colspan="3" rowspan="1" class="headInfo">调节后的存款余额</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear"  style="    padding-right: 4px!important;"><%=agencyBalAmt%></th>' +
					'<th colspan="3" rowspan="1" class="headInfo">调节后的存款余额</th>' +
					'<th colspan="1" rowspan="1" class="showMoney bal-clear" style="    padding-right: 4px!important;"><%=bankBalAmt%></th>' +
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
					'<td colspan="1" rowspan="1" class="bal-clear nowrap tc"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descpt%> ><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descptA%>><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBalA%></td>' +
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
					'<td colspan="1" rowspan="1" class="bal-clear nowrap  tc"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descpt%>><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descpt%>><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBalA%></td>' +
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
					'<td colspan="1" rowspan="1" class="bal-clear nowrap  tc"><%=outStadDate%></td>' +
					//'<td colspan="1" rowspan="1"><%=vouNo%></td>' +
					'<td colspan="2" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descpt%>><%=descpt%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBal%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear"></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear"></td>' +
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
					'<td colspan="1" rowspan="1" class="bal-clear"></td>' +
					//'<td colspan="1" rowspan="1"></td>' +
					'<td colspan="2" rowspan="1" class="bal-clear"></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear"></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=outStadDateA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear tc nowrap"><%=vouNoA%></td>' +
					'<td colspan="1" rowspan="1" class="bal-clear nowrap descpt-overflow" title=<%=descptA%>><%=descptA%></td>' +
					'<td colspan="1" rowspan="1" class="money-right bal-clear" style="    padding-right: 4px!important;"><%=outStadBal%></td>' +
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
			//获取本期
			getBenQi: function (endId) {
				var ddYear = rpt.bennian;
				var ddMonth = rpt.benqi - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				//$(rpt.namespace).find("#" + endId).datetimepicker('setDate', (new Date(ddYear, ddMonth, ddDay)));
				$(rpt.namespace).find("#" + endId).getObj().setValue((new Date(ddYear, ddMonth, ddDay)));//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
			},
			onEventListener: function () {

				//按钮提示
				$("[data-toggle='tooltip']").tooltip();
				$("#setQuery").on('click', function () {
					//ufma.showModal('setQuery-box',790);
					var argu = {
						"schemaGuid": page.schemaGuid
					};
					ufma.get(beginList.getExtendForReconBalance, argu, function (result) {
						page.resShowSetQueryBox(result);
					});
				});
				$("#setRight").on("click", function () {
					var checkDom = $(".rpt-set-list-ul-l li.rpt-li-active");
					if (checkDom.length > 0) {
						// if ($(checkDom).siblings().length > 0) {
						// 	$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						// }
						$(".rpt-set-list-ul-r").append($(checkDom));
						$(".rpt-set-list-ul-r li").removeClass("rpt-li-active");
					}
				});
				$(".rpt-set-list-ul-l").on("click", "li", function () {
					if (!$(this).hasClass("rpt-li-active")) {
						$(this).addClass("rpt-li-active");
					} else {
						$(this).removeClass("rpt-li-active");
					}

				});
				$(".rpt-set-list-ul-r").on("click", "li", function () {
					if (!$(this).hasClass("rpt-li-active")) {
						$(this).addClass("rpt-li-active");
					} else {
						$(this).removeClass("rpt-li-active");
					}

				});
				$("#setLeft").on("click", function () {
					var checkDom = $(".rpt-set-list-ul-r li.rpt-li-active");
					if (checkDom.length > 0) {
						// if ($(checkDom).siblings().length > 0) {
						// 	$(checkDom).siblings().eq(0).addClass("rpt-li-active");
						// }
						$(".rpt-set-list-ul-l").append($(checkDom));
						$(".rpt-set-list-ul-l li").removeClass("rpt-li-active");
					}
				});
				$("#setUp").on("click", function () {
					if ($(".rpt-set-list-ul-r li").length > 1) {
						var checkDom = $(".rpt-set-list-ul-r li.rpt-li-active");
						if ($(checkDom).prev().length > 0) {
							$(checkDom).prev().before($(checkDom));
						} else {
							$(checkDom).parent().append($(checkDom));
						}
					}
				});
				$("#setDown").on("click", function () {
					if ($(".rpt-set-list-ul-r li").length > 1) {
						var checkDom = $(".rpt-set-list-ul-r li.rpt-li-active");
						if ($(checkDom).next().length > 0) {
							$(checkDom).next().after($(checkDom));
						} else {
							$(checkDom).parent().find("li").eq(0).before($(checkDom));
						}
					}
				});
				$("#sureSetQuery").on("click", function () {
					page.sureSetQuery();
					rpt.nowAcctCode = "";
					rpt.nowAgencyCode = page.cbAgency.getValue();
					rpt.showSelectTree("bankRecon");
					rpt.setQuery.close();
				});
				$('.btn-close').on('click', function () {
					rpt.setQuery.close();
				});
				$('#searchTableData').on('click', function () {
					page.initReconTable();

				});
				$('#createData').on('click', function () { //生成按钮
					var argu = {};
					//var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;
					var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
					argu.fisPerd = month;
					argu.schemaGuid = page.schemaGuid;
					argu.agencyCode = page.cbAgency.getValue();
					argu.rgCode = page.rgCode;
					argu.setYear = page.setYear;
					if ($.isNull(argu.schemaGuid)) {
						ufma.showTip("请先选择一个对账方案!", function () { }, "warning");
						return false;
					}
					ufma.post(beginList.createShowBankBalance, argu, function (result) {
						printData = result.data
						//page.initReconTable();
						var balanceKey = [];
						$('#bankReconciliation').find(".rpt-query-box-li0").each(function (i) {
							var spanDom = $(this).find('.subjoin span');
							var journal = $(spanDom).data('journal');
							var statement = $(spanDom).data('statement');
							var tagsLiDom = $(this).find('.rpt-tags-list li');
							var extendsValue = $(tagsLiDom).eq(0).find("span").data("code");
							if (page.notEmpty(journal) && page.notEmpty(statement) && page.notEmpty(extendsValue)) {
								balanceKey.push({
									'journalKey': journal,
									'journalVal': extendsValue,
									'statementKey': statement,
									'statementVal': extendsValue
								});
							}
						});
						var argu = {};
						/*var year = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getFullYear();
						var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;*/
						//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
						var year = (new Date($("#dateEnd").getObj().getValue())).getFullYear();
						var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;
						argu.fisPerd = month;
						argu.balanceKey = balanceKey;
						argu.schemaGuid = page.schemaGuid;
						if ($.isNull(page.schemaGuid)) {
							ufma.showTip("请先选择一个对账方案!", function () { }, "warning");
							return false;
						}
						ufma.showTip(result.msg, '', result.flag);
						//ufma.post('/gl/bank/getRecon', argu, function (result) {
						page.drawReconTable(result.data);
						//});
						if (result.flag == "success") {
							$('#saveMethod').removeClass("disabled");
						}
						createTableData = result.data;
					});
				});
				$('#saveMethod').on('click', function () { //保存按钮
					var argu = {};
					//var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;
					var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
					argu.fisPerd = month;
					argu.schemaGuid = page.schemaGuid;
					argu.agencyCode = page.cbAgency.getValue();
					ufma.get(beginList.getCuBankRecon, argu, function (result) { //查询余额调节表数据量
						if (result.data > 0) {
							ufma.confirm('当前期间余额调节表数据发生变动,是否覆盖?', function (ac) {
								if (ac) {
									//var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;
									var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
									var GlBankReconHeadVo = createTableData.head;
									//revise S
									var theads = $(".glReconTable").find("thead");
									var len = theads.length;
									var showMoney = $(theads).eq(len - 1).find(".showMoney");
									var dwrjMoney = $(showMoney).eq(showMoney.length - 2).text();
									var yhdzMoney = $(showMoney).eq(showMoney.length - 1).text();

									if (dwrjMoney !== yhdzMoney) {
										ufma.showTip("调节后余额调节表不平衡，不能保存", "", "warning");
										return false;
									}
									//revise E
									ufma.post(beginList.saveBankBalance, GlBankReconHeadVo, function (result) {
										// page.initReconTable();
										// ufma.showTip(result.msg, '', result.flag);
										//revise S
										var flag = "success";
										if (result.flag == "fail") {
											flag = "error";
										}
										ufma.showTip(result.msg, function () {
											page.initReconTable();
										}, flag);
										//revise E
									});
								}
							}, {
									'type': 'warning'
								});
						} else {
							//revise S
							var theads = $(".glReconTable").find("thead");
							var len = theads.length;
							var showMoney = $(theads).eq(len - 1).find(".showMoney");
							var dwrjMoney = $(showMoney).eq(showMoney.length - 2).text();
							var yhdzMoney = $(showMoney).eq(showMoney.length - 1).text();
							if (dwrjMoney !== yhdzMoney) {
								ufma.showTip("调节后余额调节表不平衡，不能保存", "", "warning");
								return false;
							}
							//revise E
							//var month = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1;
							//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
							var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;
							var GlBankReconHeadVo = createTableData.head;
							ufma.post(beginList.saveBankBalance, GlBankReconHeadVo, function (result) {
								// page.initReconTable();
								// ufma.showTip(result.msg, '', result.flag);
								//revise S
								var flag = "success";
								if (result.flag == "fail") {
									flag = "error";
								}
								ufma.showTip(result.msg, function () {
									page.initReconTable();
								}, flag);
								//revise E
							});
						}
						if (result.flag == "success") {
							$('#saveMethod').addClass("disabled");
						}
					});
				});
				//				$('#btn-print').on('click', function () {
				//					$("#glReconTable").ufPrintTable({
				//						mode: "rowHeight",
				//						header: "#headerInfo",
				//						footer: "#footerInfo",
				//						pageNumClass: ".pageNum",
				//						pageHeight: 924,
				//						topMargin: 200,
				//						bottomRight: '第1页/共1页',
				//						bottomMargin: 45
				//					});
				//				});
				$('#btn-print').on('click', function () {
					ufma.post('/cu/bankBal/getPrintBalData', printData, function (result) {
						var printresult = {};
						printresult.CU_BANK_BALANCE_HEAD = result.data[0].CU_BANK_BALANCE_HEAD
						printresult.CU_BANK_BALANCE_HEAD[0].agencyName = page.agencyCode + ' ' + page.agencyName
						printresult.CU_BANK_BALANCE_HEAD[0].schemaName = page.schemaName
						printresult.CU_BANK_BALANCE_ADD = result.data[1].CU_BANK_BALANCE_ADD
						printresult.CU_BANK_BALANCE_SUB = result.data[2].CU_BANK_BALANCE_SUB
						var postSetData = {
							agencyCode: page.agencyCode,
							rgCode: pfData.svRgCode,
							setYear: pfData.svSetYear,
							sys: '105',
							directory: '调节表'
						};
						$.ajax({
							type: "POST",
							url: "/pqr/api/templ",
							dataType: "json",
							data: postSetData,
							success: function (data) {
								var xhr = new XMLHttpRequest()
								var formData = new FormData()
								formData.append('reportCode', data.data[0].reportCode)
								formData.append('templId', data.data[0].templId)
								formData.append('groupDef', JSON.stringify([printresult]))
								xhr.open('POST', '/pqr/api/printpdfbydata', true)
								xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
								xhr.responseType = 'blob'

								//保存文件
								xhr.onload = function (e) {
									if (xhr.status === 200) {
										if (xhr.status === 200) {
											var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
											window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
										}
									}
								}

								//状态改变时处理返回值
								xhr.onreadystatechange = function () {
									if (xhr.readyState === 4) {
										//通信成功时
										if (xhr.status === 200) {
											//交易成功时
											ufma.hideloading();
										} else {
											var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
											//提示框，各系统自行选择插件
											alert(content)
											ufma.hideloading();
										}
									}
								}
								xhr.send(formData)
							},
							error: function () { }
						});
					})
				});
				//导出余额调节表
				$(".btn-export").on("click", function (evt) {
					evt = evt || window.event;
					evt.preventDefault();
					var topInfo = [
						['单位名称：' + page.agencyCode + ' ' + page.agencyName],
						['方案名称：' + page.schemaName],
						['开户行及行号：' + $('#bankInfo').html()],
						['期间：' + $("#dateEnd").getObj().getValue()]
					]
					uf.expTable({
						title: '余额调节表',
						topInfo : topInfo,
						exportTable: '.dateTable'
					});
				});
			},
			initPage: function () {
				var pfData = ufma.getCommonData();
				page.nowDate = pfData.svTransDate; //当前年月日
				page.rgCode = pfData.svRgCode; //区划代码
				page.setYear = pfData.svSetYear //年度
				page.userId = pfData.svUserId; //登录用户ID //修改权限  将svUserCode改为 svUserId  20181012
				page.userName = pfData.svUserName; //登录用户名称
				page.agencyCode = pfData.svAgencyCode; //登录单位代码
				page.agencyName = pfData.svAgencyName; //登录单位名称
				//CWYXM-9523--宁波 出纳管理-余额调节表，期间选择为英文--zsj
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						var year = (new Date($("#dateEnd").getObj().getValue())).getFullYear();
						var month = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1;
						var period = year + '-' + page.addZero(month);
						$('#period').html(period);
					}
				};
				$("#bankReconciliation").find("#dateEnd").ufDatepicker(glRptLedgerDate);
				page.getBenQi("dateEnd");
				var ddYear = rpt.bennian;
				var ddMonth = rpt.benqi;
				var dperiod = ddYear + '-' + ddMonth;
				$('#period').html(dperiod);

				//初始化单位列表样式
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择单位',
					icon: 'icon-unit',
					readOnly: false,
					onchange: function (data) {
						//给全局单位变量赋值
						page.agencyCode = data.id;
						page.agencyName = data.name;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);
						page.reqMethod();

						rpt.nowAcctCode = "";
						rpt.nowAgencyCode = page.cbAgency.getValue();
						rpt.showSelectTree("bankRecon");
						page.removeQuery();
					}
				});

				//请求单位列表
				ufma.ajax(beginList.agencyList, "get", {
					"rgCode": page.rgCode,
					"setYear": page.setYear
				}, function (result) {
					var data = result.data;
					var cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var code = data[0].id;
					var name = data[0].name;
					if (page.agencyCode != "" && page.agencyName != "") {
						var agency = $.inArrayJson(data, 'id', page.agencyCode);
						if (agency != undefined) {
							cbAgency.val(page.agencyCode);
						} else {
							cbAgency.val(code);
							page.agencyCode = code;
							page.agencyName = name;
						}
					} else {
						cbAgency.setValue(code, code + " " + name);
						page.agencyCode = code;
						page.agencyName = name;
					}

				});
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
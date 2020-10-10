$(function() {
	var page = function() {

		var eleDataTable, eleBox, eleTable, eleThead;
		//根据系统级还是单位级表格数据接口url不同
		var dataUrl, agencyCode, agencyName, eleSource;
		var dataAllNew, imageListButton;
		var agencyCtrllevel = "0101";
		var chrId = "";
		var lineNumber = 0;

		//基础数据维护页面
		var sysUserMenuId = "804c27d4-ccd6-40cf-958c-0af1f59c604a";
		var agyUserMenuId = "ebb236b4-7020-4d40-b306-5fd90669ee59";

		return {

			//          openEditHtm: function(data) {
			//              if (data) {
			//                  //修改
			//                  data["action"] = "edit";
			//                  data["agencyCode"] = page.agencyCode;
			//                  data["rgCode"] = page.rgCode;
			//                  data["setYear"] = page.setYear;
			//                  ufma.open({
			//                      url: 'elementEdit.html',
			//                      title: '要素定义',
			//                      width: 600,
			//                      height: 505,
			//                      data: data,
			//                      ondestory: function(data) {
			//                          console.info(data);
			//                          if (data.action != "close") {
			//                              if ($('body').data("code")) {
			//                                  page.createTable(page.dataUrl, "none");
			//                                  page.initEleImageList("none");
			//                              } else {
			//                                  page.createTable(page.dataUrl, "inline-block");
			//                                  page.initEleImageList("inline-block");
			//                              }
			//                          }
			//                      }
			//                  });
			//              } else {
			//                  //新增
			//                  var param = {};
			//                  param["action"] = "add";
			//                  param["agencyCode"] = page.agencyCode;
			//                  param["rgCode"] = page.rgCode;
			//                  param["setYear"] = page.setYear;
			//                  var height = 505;
			//                  if (page.agencyCode != '*') {
			//                      height = 405;
			//                  }
			//                  ufma.open({
			//                      url: 'elementEdit.html',
			//                      title: '要素定义',
			//                      width: 600,
			//                      height: height,
			//                      data: param,
			//                      ondestory: function(data) {
			//                          if (data.action != "close") {
			//                              if ($('body').data("code")) {
			//                                  page.initEleImageList("none");
			//                                  page.createTable(page.dataUrl, "none");
			//                              } else {
			//                                  page.initEleImageList("inline-block");
			//                                  page.createTable(page.dataUrl, "inline-block");
			//                              }
			//                          }
			//
			//                      }
			//                  });
			//              }
			//          },

			openEditHtm: function(data) {
				var param = {};
				param["action"] = data.action;
				param["agencyCode"] = page.agencyCode;
				param["rgCode"] = page.rgCode;
				param["setYear"] = page.setYear;
				param["eleData"] = data.eleData;
				ufma.open({
					url: 'elementEdit.html',
					title: '要素定义',
					width: 700,
					data: param,
					ondestory: function(data) {
						if(data.action != "close") {
							if($("#cardBtn").hasClass("active")) {
								$("#cardBtn").click();
							} else {
								$("#listBtn").click();
							}
						}

					}
				});
			},

			//动态创建要素表格
			createTable: function(dataUrl, flag) {
				var isKind = $("a[name='isSystem'].selected").data("code");
				var queryType;
				if(isKind == "*") {
					queryType = "all";
				} else if(isKind == "1") {
					queryType = "system";
				} else {
					queryType = "self";
				}
				var anchorArry = new Array();
				var callback = function(result) {
					dataAllNew = result.data;
					page.eleCount(dataAllNew.length);
					$("#dyTable").html("");
					var table = $("<table class=\"table eleTable ufma-table table-hover\">");
					table.appendTo($("#dyTable"));
					var pinyinBefore = "";
					for(var i = 0; i < dataAllNew.length; i++) {
						pinyinBefore = dataAllNew[i].pinyin.substring(0, 1);
						if(i == 0) {
							anchorArry.push(pinyinBefore);

							// var newUrl = dataAllNew[i].url;
							// var isSystem = dataAllNew[i].isSystem;
							//获取跳转的url
							var newUrl = dataAllNew[i].url;
							var isSystem = dataAllNew[i].isSystem;
							newUrl = page.newElementUrl(dataAllNew[i]);
							var eleButton = '<div class="endButton">' +
								'<a class="ele-setdata elemargin elecolor btn-setup btn-permission"><i class="glyphicon glyphicon-cog"></i>&nbsp;设置</a>' +
								'<a class="ele-searchdata elecolor" data-href="' + newUrl + '" data-title="' + dataAllNew[i].title + '"><i class="glyphicon glyphicon-search"></i>&nbsp;数据</a>' +
								'</div>';
							//表头
							var tr = $("<tr style='background:white;' class='tr-letter' id='" + pinyinBefore + "'>");
							tr.appendTo(table);
							var td = $("<td colspan='5' >" + pinyinBefore + "</td>");
							td.appendTo(tr);
							var tr1 = $("</tr>");
							tr1.appendTo(table);
							//表内容
							var tr = $("<tr class='oddColor ele-data-dom'>");
							tr.appendTo(table);
							var td = $("<td class='eleName'><span>" + dataAllNew[i].eleName + "</span><div style='display:none'>" +
								"<div class='fieldArr'>" + dataAllNew[i].fieldRelationEle1 + "," + dataAllNew[i].fieldRelationEle2 + "," + dataAllNew[i].fieldRelationEle3 + "," + dataAllNew[i].fieldRelationEle4 + "," + dataAllNew[i].fieldRelationEle5 + "</div>" +
								"<div class='chrId'>" + dataAllNew[i].chrId + "</div>" +
								"<div class='eleCode'>" + dataAllNew[i].eleCode + "</div>" +
								"<div class='data-enabled'>" + dataAllNew[i].enabled + "</div>" +
								"<div class='eleSource'>" + dataAllNew[i].eleSource + "</div>" +
								"<div class='agencyCtrllevel'>" + dataAllNew[i].agencyCtrllevel + "</div>" +
								"<div class='lastVer'>" + dataAllNew[i].lastVer + "</div>" +
								"</div></td>");
							td.appendTo(tr);

							var td = $("<td class='codeRule bodycolor'>" + dataAllNew[i].codeRuleName + "</td>");
							td.appendTo(tr);
							var tr1 = $("</tr>");
							tr1.appendTo(table);
							var td = "";
							if(flag == "none") {
								td = $("<td class='three bodycolor'></td>");
							} else {
								td = $("<td class='three bodycolor'>" + dataAllNew[i].agencyCtrlName + "</td>");
							}
							//                            var td = $("<td class='three bodycolor'>" + dataAllNew[i].agencyCtrlName + "</td>");
							td.appendTo(tr);
							// var agencyName = "";
							// if (dataAllNew[i].agencyName != null) {
							//     agencyName = dataAllNew[i].agencyName;
							// }
							// var td = $("<td class='agencyName'>" + agencyName + "</td>");
							// td.appendTo(tr);
							var td = $("<td style='text-align: right;'>" + eleButton + "</td>");
							td.appendTo(tr);
							var tr1 = $("</tr>");
							tr1.appendTo(table);
						}
						if(i != dataAllNew.length - 1) {
							var pinyinAfter = dataAllNew[i + 1].pinyin.substring(0, 1);
							// var newUrl = dataAllNew[i + 1].url;
							// var isSystem = dataAllNew[i + 1].isSystem;

							//获取跳转的url
							var newUrl = dataAllNew[i + 1].url;
							var isSystem = dataAllNew[i + 1].isSystem;
							newUrl = page.newElementUrl(dataAllNew[i + 1]);

							var eleButton = '<div class="endButton">' +
								'<a class="ele-setdata elemargin elecolor btn-setup btn-permission"><i class="glyphicon glyphicon-cog"></i>&nbsp;设置</a>' +
								'<a class="ele-searchdata elecolor" data-href="' + newUrl + '" data-title="' + dataAllNew[i + 1].title + '"><i class="glyphicon glyphicon-search"></i>&nbsp;数据</a>' +
								'</div>';

							if(pinyinBefore != pinyinAfter) {
								anchorArry.push(pinyinAfter);
								lineNumber = 0;
								//表头
								var tr = $("<tr style='background:white;' class='tr-letter' id='" + pinyinAfter + "'>");
								tr.appendTo(table);
								var td = $("<td colspan='5'>" + pinyinAfter + "</td>");
								td.appendTo(tr);
								var tr1 = $("</tr>");
								tr1.appendTo(table);
								//表尾
								var tr = $("<tr class='oddColor ele-data-dom'>");
								tr.appendTo(table);
								var td = $("<td class='eleName'><span>" + dataAllNew[i + 1].eleName + "</span><div style='display:none'>" +
									"<div class='fieldArr'>" + dataAllNew[i + 1].fieldRelationEle1 + "," + dataAllNew[i].fieldRelationEle2 + "," + dataAllNew[i].fieldRelationEle3 + "," + dataAllNew[i].fieldRelationEle4 + "," + dataAllNew[i].fieldRelationEle5 + "</div>" +
									"<div class='chrId'>" + dataAllNew[i + 1].chrId + "</div>" +
									"<div class='eleCode'>" + dataAllNew[i + 1].eleCode + "</div>" +
									"<div class='data-enabled'>" + dataAllNew[i + 1].enabled + "</div>" +
									"<div class='eleSource'>" + dataAllNew[i + 1].eleSource + "</div>" +
									"<div class='agencyCtrllevel'>" + dataAllNew[i + 1].agencyCtrllevel + "</div>" +
									"<div class='lastVer'>" + dataAllNew[i].lastVer + "</div>" +
									"</div></td>");
								td.appendTo(tr);

								var td = $("<td class='codeRule bodycolor'>" + dataAllNew[i + 1].codeRuleName + "</td>");
								td.appendTo(tr);
								var tr1 = $("</tr>");
								tr1.appendTo(table);
								var td = "";
								if(flag == "none") {
									td = $("<td class='three bodycolor'></td>");
								} else {
									td = $("<td class='three bodycolor'>" + dataAllNew[i + 1].agencyCtrlName + "</td>");
								}
								//                                var td = $("<td class='three bodycolor'><span style='"+flag+"'>" + dataAllNew[i + 1].agencyCtrlName + "</span></td>");
								td.appendTo(tr);
								// var agencyName = "";
								// if (dataAllNew[i + 1].agencyName != null) {
								//     agencyName = dataAllNew[i + 1].agencyName;
								// }
								// var td = $("<td class='agencyName'>" + agencyName + "</td>");
								// td.appendTo(tr);
								var td = $("<td style='text-align: right;'>" + eleButton + "</td>");
								td.appendTo(tr);
								var tr1 = $("</tr>");
								tr1.appendTo(table);
							} else {
								var tr;
								if(lineNumber % 2 == 0) {
									tr = $("<tr class='evenColor ele-data-dom'>");
								} else {
									tr = $("<tr class='oddColor ele-data-dom'>");
								}
								tr.appendTo(table);
								var td = $("<td class='eleName'><span>" + dataAllNew[i + 1].eleName + "</span><div style='display:none'>" +
									"<div class='fieldArr'>" + dataAllNew[i + 1].fieldRelationEle1 + "," + dataAllNew[i].fieldRelationEle2 + "," + dataAllNew[i].fieldRelationEle3 + "," + dataAllNew[i].fieldRelationEle4 + "," + dataAllNew[i].fieldRelationEle5 + "</div>" +
									"<div class='chrId'>" + dataAllNew[i + 1].chrId + "</div>" +
									"<div class='eleCode'>" + dataAllNew[i + 1].eleCode + "</div>" +
									"<div class='data-enabled'>" + dataAllNew[i + 1].enabled + "</div>" +
									"<div class='eleSource'>" + dataAllNew[i + 1].eleSource + "</div>" +
									"<div class='agencyCtrllevel'>" + dataAllNew[i + 1].agencyCtrllevel + "</div>" +
									"<div class='lastVer'>" + dataAllNew[i].lasrVer + "</div>" +
									"</div></td>");
								td.appendTo(tr);

								var td = $("<td class='codeRule bodycolor'>" + dataAllNew[i + 1].codeRuleName + "</td>");
								td.appendTo(tr);
								var tr1 = $("</tr>");
								tr1.appendTo(table);
								var td = "";
								if(flag == "none") {
									td = $("<td class='three bodycolor'></td>");
								} else {
									td = $("<td class='three bodycolor'>" + dataAllNew[i + 1].agencyCtrlName + "</td>");
								}
								//                                var td = $("<td class='three bodycolor'><span style='"+flag+"'>" + dataAllNew[i].agencyCtrlName + "</span></td>");
								td.appendTo(tr);
								// var agencyName = "";
								// if (dataAllNew[i + 1].agencyName != null) {
								//     agencyName = dataAllNew[i + 1].agencyName;
								// }
								// var td = $("<td class='agencyName'>" + agencyName + "</td>");
								// td.appendTo(tr);
								var td = $("<td style='text-align: right;'>" + eleButton + "</td>");
								td.appendTo(tr);
								var tr1 = $("</tr>");
								tr1.appendTo(table);
								lineNumber = lineNumber + 1;
							}
						}
					}
					$("#dyTable").append("</table>");
					$(".anchorAuto-no,.anchorAuto-select").remove();
					$(".rowtou").remove();
					page.initAnchor(anchorArry);
					ufma.isShow(page.reslist);
				}
				ufma.get(page.dataUrl, {
					"queryType": queryType
				}, callback);
			},

			//绘制锚点
			initAnchor: function(anchor) {
				$("#dyTableAuto").html("");
				var singleDefaultAnchor; //默认选中锚点
				var singleNoAnchor; //没选中锚点
				for(var i = 0; i < anchor.length; i++) {
					var href = "#" + anchor[i];
					$singleDefaultAnchor = $("<div class='anchorAuto-no anchorAuto-color'>" +
						"<a hrefs='" + href + "'  class='anchorAuto-no-a'>" + anchor[i] + "</a>" +
						'</div>'
					);
					$singleNoAnchor = $("<div class='anchorAuto-no'>" +
						"<a hrefs='" + href + "' class='anchorAuto-no-a'>" + anchor[i] + "</a>" +
						'</div>'
					);
					if(i == 0) {
						$singleDefaultAnchor.appendTo($("#dyTableAuto"));
					} else {
						$singleNoAnchor.appendTo($("#dyTableAuto"));
					}
				}
			},

			//要素总数
			eleCount: function(size) {
				var eleCount = document.getElementById("ele-count");
				eleCount.innerHTML = "全部要素共 " + size + " 个";
			},
			//系统预置要素url
			elementUrl: function(eleCode) {
				var newUrl;
				if(eleCode == "EXPECO") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/departBudget/departBudgetAgy.html?menuid=26cc1847-a3e0-4c80-a2a2-5b47467b7fa9";
					} else {
						newUrl = "/pf/ma/departBudget/departBudget.html?menuid=261341c7-22e8-4c56-8ba1-7e42e8d076e0";
					}
				} else if(eleCode == "EXPFUNC") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/expFunc/expFuncAgy.html?menuid=706bea16-f878-4427-b1d3-32e565720f77";
					} else {
						newUrl = "/pf/ma/expFunc/expFunc.html?menuid=0e951af5-3b40-49d0-91d5-f6e550dfab8e";
					}
				} else if(eleCode == "GOVEXPECO") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_GOVEXPECO&menuid=e0cffa22-27a6-4a53-b655-3ab456f2227d";
					} else {
						newUrl = "/pf/ma/govMoban/govMoban.html?tableParam=MA_ELE_GOVEXPECO&menuid=43435477-d22c-4498-a53d-fa1eb94f3c96";
					}
				} else if(eleCode == "PROJECT") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/project/projectAgy.html?menuid=f109ec32-830c-4be1-9a8a-0705777eaadd";
					} else {
						newUrl = "/pf/ma/project/project.html?menuid=92b89964-6c6b-48cf-a058-f54b03c128ae";
					}
				} else if(eleCode == "CURRENT") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/current/currentAgy.html?menuid=b443807f-d0ec-4182-8c5b-660702a232cf";
					} else {
						newUrl = "/pf/ma/current/current.html?menuid=c60ba2a0-31b8-4a3c-a1f0-fd9aee1d4553";
					}
				} else if(eleCode == "DEPARTMENT" || eleCode == "EMPLOYEE") {
					//CWYXM-11576 系统管理-要素定义，部门和人员要素点击数据，跳转到相应单位级页面，已与雪蕊确认--zsj
					newUrl = "/pf/ma/depEmp/depEmpAgy.html?menuid=bae081ed-a84c-4a15-9457-9ae259327575";
//					if($('body').data("code")) {
//						newUrl = "/pf/ma/depEmp/depEmpAgy.html?menuid=bae081ed-a84c-4a15-9457-9ae259327575";
//					} else {
//						newUrl = "/pf/ma/depEmp/depEmp.html?menuid=a71c17ec-3865-4bf4-a0cd-98b6681b597b";
//					}
				} else if(eleCode == "FATYPE") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_FATYPE&menuid=f30cbb73-0568-41b7-82c1-caa3822f151d";
					} else {
						newUrl = "/pf/ma/govMoban/govMoban.html?tableParam=MA_ELE_FATYPE&menuid=49805882-c6df-46cc-8ed9-2518e754b455";
					}
				} else if(eleCode == "SETMODE") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_SETMODE&menuid=db990e4f-6b0a-43a8-ac08-22d73651e892";
					} else {
						newUrl = "/pf/ma/govMoban/govMoban.html?tableParam=MA_ELE_SETMODE&menuid=5eab6bb3-0c4d-474b-b85b-f7957d6bccb8";
					}
				} else if(eleCode == "BILLTYPE") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_BILLTYPE&menuid=769b9bf4-a112-4ef0-a0c3-f389540e994c";
					} else {
						newUrl = "/pf/ma/govMoban/govMoban.html?tableParam=MA_ELE_SETMODE&menuid=5eab6bb3-0c4d-474b-b85b-f7957d6bccb8";
					}
				} else if(eleCode == "CURRENCY") {
					if($('body').data("code")) {
						newUrl = "/pf/ma/currencyRate/currencyRateAgy.html?menuid=8209af1b-8da2-456f-82ac-ff414c17d499";
					} else {
						newUrl = "/pf/ma/currencyRate/currencyRate.html?menuid=0c3694db-4821-4fe3-82a3-c463ce5d76b7";
					}
				}
				return newUrl;

			},
			newElementUrl: function(curElement) {
				//首选根据eleCode判断是否为系统预置要素，跳转到预置的界面
				curElement['title'] = curElement['eleName'];
				var theEleCode = curElement.eleCode;
				var newUrl = page.elementUrl(theEleCode);

				if(!newUrl) {
					//不是系统预置要素

					if(curElement.url) {

						//数据里自带url,使用自带的url
						curElement['title'] = curElement['eleName'];
						if(curElement.url.indexOf("?") == "-1") {
							newUrl = curElement.url + "?menuid=" + curElement.menuId;
						} else {
							newUrl = curElement.url + "&menuid=" + curElement.menuId;
						}
					} else {

						//数据里不带url,跳转基础数据维护
						curElement['title'] = '基础数据维护';
						if($('body').data("code")) {
							newUrl = "/pf/ma/userData/userDataAgy.html?agencyCode=" + page.agencyCode + "&agencyName=" + page.agencyCode + "&eleCode=" + curElement.eleCode + "&eleName=" + curElement.eleName + "&letter=" + curElement.pinyin.substring(0, 1) + "&menuid=" + agyUserMenuId;
							ufma.removeCache(curElement.eleCode + "_cacheData");
							var cacheData = {};
							cacheData.elename = curElement.eleName;
							ufma.setObjectCache(curElement.eleCode + "_cacheData", cacheData);
						} else {
							newUrl = "/pf/ma/userData/userData.html?agencyCode=\*&eleCode=" + curElement.eleCode + "&eleName=" + curElement.eleName + "&letter=" + curElement.pinyin.substring(0, 1) + "&menuid=" + sysUserMenuId;
							ufma.removeCache(curElement.eleCode + "_cacheData");
							var cacheData = {};
							cacheData.elename = curElement.eleName;
							ufma.setObjectCache(curElement.eleCode + "_cacheData", cacheData);
						}
					}
				}
				return newUrl;
			},
			//绘制卡片
			initEleImageList: function() {
				var isKind = $("a[name='isSystem'].selected").data("code");
				var queryType;
				if($('body').data("code")) {
					queryType = "all";
				} else {
					if(isKind == "*") {
						queryType = "all";
					} else if(isKind == "1") {
						queryType = "system";
					} else {
						queryType = "self";
					}
				}
				var anchorArry = new Array();
				ufma.showloading("正在加载数据，请耐心等待");
				ufma.get(page.dataUrl, {
					"queryType": queryType
				}, function(result) {
					dataAllNew = result.data;
					$("#imageList").html("");
					page.eleCount(dataAllNew.length);
					var pinyinAfter = "";
					for(var i = 0; i < dataAllNew.length; i++) {
						var istrue = true;
						var before = dataAllNew[i];
						var pinyinBefore = before.pinyin.substring(0, 1);
						if(i == 0) {
							anchorArry.push(pinyinBefore);
						}
						if(i > 0) {
							var old = dataAllNew[i - 1];
							pinyinOld = old.pinyin.substring(0, 1);
							if(pinyinBefore != pinyinOld) {
								anchorArry.push(pinyinBefore);
								istrue = false;
							} else {
								istrue = true;
							}
						}

						//获取跳转的url
						var newUrl = dataAllNew[i].url;
						var isSystem = dataAllNew[i].isSystem;
						newUrl = page.newElementUrl(dataAllNew[i]);
						imageListButton = '<a class="btn-label ele-imagedata btn-setup btn-permission"><i class="glyphicon glyphicon-cog"></i>设置</a>' +
							'<a class="btn-label ele-searchdata" data-href="' + newUrl + '" data-title="' + dataAllNew[i].title + '"><i class="glyphicon glyphicon-search"></i>数据</a>'
						//var image = '../../images/element/' + dataAllNew[i].eleCode + '\.png';
						//var errorImage = '../../images/element/undefined.png';
						var image = "";
						if(isSystem == "1") {
							//image = '../../images/element/' + dataAllNew[i].eleCode + '.png';
							image = 'bg-' + dataAllNew[i].eleCode;
						} else {
							//image = '../../images/element/undefined.png';
							image = 'bg-undefined';
						}

						//不带表头
						var $dl = $('<div class="col-xs-6 col-md-3 padding-8">' +
							'<div class="ufma-card ufma-card-icon ele-data-dom">' +
							'<div class="card-icon">' +
							'<span class="icon"><div class="' + image + '"></div></span>' +
							'</div>' +
							'<div class="ufma-card-header">' +
							'<div class="fieldArr" style="display:none">' + dataAllNew[i].fieldRelationEle1 + ',' + dataAllNew[i].fieldRelationEle2 + ',' + dataAllNew[i].fieldRelationEle3 + ',' + dataAllNew[i].fieldRelationEle4 + ',' + dataAllNew[i].fieldRelationEle5 + '</div>' +
							'<div class="chrId" style="display:none">' + dataAllNew[i].chrId + '</div>' +
							'<div class="eleCode" style="display:none">' + dataAllNew[i].eleCode + '</div>' +
							'<div class="agencyCtrllevel" style="display:none">' + dataAllNew[i].agencyCtrllevel + '</div>' +
							'<div class="lastVer" style="display:none">' + dataAllNew[i].lastVer + "</div>" +
							'<div class="data-enabled" style="display:none">' + dataAllNew[i].enabled + '</div>' +
							'<div class="eleSource" style="display:none">' + dataAllNew[i].eleSource + '</div>' +
							'<div class="allowSameFullName" style="display:none">' + dataAllNew[i].allowSameFullName + '</div>' +
							'<div class="issueType" style="display:none">' + dataAllNew[i].issueType + '</div>' +
							//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
							'<div class="isAcctLevel" style="display:none">' + dataAllNew[i].isAcctLevel + '</div>' +
							//判断是否是平台维护的 guohx  20200825
							'<div class="isOperate" style="display:none">' + dataAllNew[i].isOperate + '</div>' + 
							'<div class="eleName"><span>' + dataAllNew[i].eleName + '</span></div>' +
							'</div>' +
							'<div class="ufma-card-body">' +
							'<div class="codeRule">' + dataAllNew[i].codeRuleName + '</div>' +
							'<div class="isSystem" style="display:inline-block">' + dataAllNew[i].agencyCtrlName + '</div>' +
							'</div>' +
							'<div class="ufma-card-footer">' +
							imageListButton +
							'</div>' +
							'</div>' +
							'</div>'
						);
						//带表头重新一行
						var $dll = $('<div class="row rowtou" style="margin-left: 0px;">' +
							'<p  style="margin: 8px 0 0px 8px;" id="' + pinyinBefore + '">' + pinyinBefore + '</p>' +
							'<div class="col-xs-6 col-md-3 padding-8">' +
							'<div class="ufma-card ufma-card-icon ele-data-dom">' +
							'<div class="card-icon">' +
							'<span class="icon"><div class="' + image + '"></div></span>' +
							'</div>' +
							'<div class="ufma-card-header">' +
							'<div class="fieldArr" style="display:none">' + dataAllNew[i].fieldRelationEle1 + ',' + dataAllNew[i].fieldRelationEle2 + ',' + dataAllNew[i].fieldRelationEle3 + ',' + dataAllNew[i].fieldRelationEle4 + ',' + dataAllNew[i].fieldRelationEle5 + '</div>' +
							'<div class="chrId" style="display:none">' + dataAllNew[i].chrId + '</div>' +
							'<div class="eleCode" style="display:none">' + dataAllNew[i].eleCode + '</div>' +
							'<div class="agencyCtrllevel" style="display:none">' + dataAllNew[i].agencyCtrllevel + '</div>' +
							'<div class="lastVer" style="display:none">' + dataAllNew[i].lastVer + "</div>" +
							'<div class="data-enabled" style="display:none">' + dataAllNew[i].enabled + '</div>' +
							'<div class="eleSource" style="display:none">' + dataAllNew[i].eleSource + '</div>' +
							'<div class="allowSameFullName" style="display:none">' + dataAllNew[i].allowSameFullName + '</div>' +
							'<div class="issueType" style="display:none">' + dataAllNew[i].issueType + '</div>' +
							//bug80541--20190612【财务云8.0 】基础资料区分账套管理--zsj
							'<div class="isAcctLevel" style="display:none">' + dataAllNew[i].isAcctLevel + '</div>' +
							//判断是否是平台维护的 guohx  20200825
							'<div class="isOperate" style="display:none">' + dataAllNew[i].isOperate + '</div>' + 
							'<div class="eleName"><span>' + dataAllNew[i].eleName + '</span></div>' +
							'</div>' +
							'<div class="ufma-card-body">' +
							'<div class="codeRule">' + dataAllNew[i].codeRuleName + '</div>' +
							'<div class="isSystem" style="display:inline-block">' + dataAllNew[i].agencyCtrlName + '</div>' +
							'</div>' +
							'<div class="ufma-card-footer">' +
							imageListButton +
							'</div>' +
							'</div>' +
							'</div>' +
							'</div>'
						);
						if(i == 0) {
							$("#imageList").append($dll);
						} else {
							if(istrue) {
								$("#imageList .rowtou:last").append($dl);
							} else {
								$("#imageList").append($dll);
							}
						}
					}
					page.initAnchor(anchorArry);
					ufma.hideloading();
					ufma.isShow(page.reslist);
					$("span.icon div").each(function() {
						if($(this).height() == 0) {
							$(this).addClass("bg-undefined")
						}
					})
				});
			},

			//元素是否一组
			isSameGroup: function(before, after) {
				var pinyinBefore = before.pinyin.substring(0, 1);
				var pinyinAfter = "";
				if(after != "") {
					pinyinAfter = after.pinyin.substring(0, 1);
				}
				if(pinyinBefore == pinyinAfter) {
					return true;
				} else {
					return false;
				}
			},

			onEventListener: function() {

				//新增
				$('#btn-add').on('click', function(e) {
					e.preventDefault();
					$('#element-edt').find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					page.openEditHtm({
						action: "add",
						eleData: ""
					});
				});

				//卡片上的设置
				$("#imageList").on("click", ".ele-imagedata", function(e) {
					$('#element-edt').find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					page.openEditHtm({
						action: "edit",
						eleData: $(this)
					});
				});

				//列表上的设置
				$("#dyTable").on("click", ".ele-setdata", function() {
					$('#element-edt').find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					page.openEditHtm({
						action: "edit",
						eleData: $(this)
					});
				});

				//锚点列表
				$(".anchorAuto-all").on("click", "a", function() {
					page.clickA = $(this).text();
					var datas = $(this).attr('hrefs')
					$(window).scrollTop($(datas).position().top);
					$(".anchorAuto-no").removeClass('anchorAuto-color');
					$(this).closest('.anchorAuto-no').addClass('anchorAuto-color');
				});

				//卡片与列表的切换
				$('#cardBtn').on('click', function() {
					page.initEleImageList();
					$('#dyTable').css('display', 'none');
					$('#imageList').css('display', 'block');
				});

				//卡片与列表的切换
				$('#listBtn').on('click', function() {
					if($('body').data("code")) {
						// page.createTable(page.dataUrl, "none");
						page.createTable(page.dataUrl, "inline-block");
					} else {
						page.createTable(page.dataUrl, "inline-block");
					}
					$('#dyTable').css('display', 'block');
					$('#imageList').css('display', 'none');
				});

				//点击数据操作
				$("#imageList,#dyTable").on("click", ".ele-searchdata", function() {
					if($(this).attr("data-href") != null && $(this).attr("data-href") != "null" && $(this).attr("data-href") != "") {
						var href = $(this).attr("data-href").replaceAll(/\s+/g, '');
						//$(this).attr("data-href",href);
						var title = $(this).attr("data-title");
						//window.parent.openNewMenu($(this));
						uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', href, false, title);
					}
				});

				//点击分类操作
				$("a[name='isSystem']").on("click", function() {
					$(this).addClass("selected");
					$(this).siblings().removeClass("selected");
					if($("#cardBtn").hasClass("active")) {
						$("#cardBtn").click();
					} else {
						$("#listBtn").click();
					}
				});
				///////////////
				// $('body>.container-fluid').scroll(function() {
				// 	var sc = $(this).scrollTop();
				// 	var dtList = $('#dyTableAuto a[hrefs]');

				// 	var letterFlag = 'A';
				// 	for(var i = 0; i < dtList.length; i++) {
				// 		var tmpFlag = $(dtList[i]).text();
				// 		if(tmpFlag != "" && tmpFlag != null && tmpFlag != undefined) {
				// 			var dtTop = $('[id="' + tmpFlag + '"]').offset().top;
				// 			if(dtTop > 0) {
				// 				if(dtTop < 188) {
				// 					letterFlag = tmpFlag;
				// 				} else {
				// 					break;
				// 				}
				// 			} else {
				// 				letterFlag = tmpFlag;
				// 			}
				// 		}

				// 	}
				// 	if(page.clickA && page.clickA != letterFlag) {
				// 		letterFlag = page.clickA;
				// 	}
				// 	$('.anchorAuto-color').removeClass('anchorAuto-color');
				// 	$('a[hrefs="#' + letterFlag + '"]').parent().addClass('anchorAuto-color');
				// 	page.clickA = false;
				// });
				$(window).scroll(function() {
					var sc = $(this).scrollTop();
					var dtList = $('#dyTableAuto a[hrefs]');

					var letterFlag = 'A';
					for(var i = 0; i < dtList.length; i++) {
						var tmpFlag = $(dtList[i]).text();
						if(tmpFlag != "" && tmpFlag != null && tmpFlag != undefined) {
							var dtTop = $('[id="' + tmpFlag + '"]').position().top;
							if(dtTop > 0) {
								if(dtTop > sc) {
									letterFlag = tmpFlag;
									break;
								} 
							} else {
								letterFlag = tmpFlag;
							}
						}

					}
					if(page.clickA && page.clickA != letterFlag) {
						letterFlag = page.clickA;
					}
					$('.anchorAuto-color').removeClass('anchorAuto-color');
					$('a[hrefs="#' + letterFlag + '"]').parent().addClass('anchorAuto-color');
					page.clickA = false;
				});
			},

			init: function() {
				//修改页面获取body高度为100 改为待页面元素加载完之后再给高度赋值 guohx 20200707  CWYXM-18069 基础资料要素定义，页面空白
				// $(document).load(function(){
				$(window).on('load',function(){
					$(".ufma-container").height($("body").height() - 10)
					$(".ufma-container").css("overflow-y", "scroll")
				})
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.rgCode = pfData.svRgCode;
				page.setYear = pfData.svSetYear;

				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				if($('body').data("code")) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						leafRequire: false,
						url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + page.rgCode + '&setYear=' + page.setYear,
						onchange: function(data) {
							page.agencyCode = data.code;
							page.agencyName = data.codeName;
							page.dataUrl = '/ma/sys/element/select?agencyCode=' + page.agencyCode + '&rgCode=' + page.rgCode + '&setYear=' + page.setYear;
							page.initEleImageList();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
							}
							ufma.setSelectedVar(params);
						},
						initComplete: function(sender) {
							if(page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
							// page.agencyCode = page.cbAgency.getValue();
							// page.agencyName = page.cbAgency.getText();
						}
					});
				} else {
					page.dataUrl = '/ma/sys/element/select?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=*';
					page.agencyCode = '*';
					page.initEleImageList();
				}
				this.onEventListener();
				ufma.parse();

				$('.ufma-container').scroll(function(e) {
					var winPos = $(this).scrollTop();
					if(winPos > 150) {
						$("#dyTableAuto").css("top", (20 + winPos) + "px");
					} else {
						$("#dyTableAuto").css("top", "180px");
					}
				});
				$(window).scroll(function(e) {
					var winPos = $(this).scrollTop();
					if(winPos > 150) {
						$("#dyTableAuto").css("top", (20 + winPos) + "px");
					} else {
						$("#dyTableAuto").css("top", "180px");
					}
				});
				page.isCrossDomain = false;
				window.addEventListener('message', function(e) {
					if(e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}

		}
	}();

	page.init();
});
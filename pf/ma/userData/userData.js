$(function () {
	var page = function () {
		var agencyCtrlLevel;
		var eleCodeVal;
		var agencyCode;
		var acctAlldata;
		/*bug80948--【20190611 财务云8.0 广东省财政厅】基础资料-要素定义，点击数据，跳转到基础数据维护界面，显示的是第一个，没能直接跳转到该要素
		 * 比如：要素定义——费用类型，然后点击费用类型下的数据，跳转到础数据维护界面，显示的是第一个的数据而不是费用类型的数据--zsj*/
		var showElecode = false;
		return {
			namespace: 'userData',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			initfifaCallBack: function (data, ctrlName) {
				page.agencyCtrlLevel = data.agencyCtrllevel;
				var isAcctLevel = data.isAcctLevel;
				//bugCWYXM-4478-从要素定义页面，选择一条自定义要素，点击“数据”进入编辑，无新增等按钮--zsj
				if ($('body').data("code")) {
					if (page.aCode != "*") {
						$(".btn-choose").hide();
						$(".btn-add").show();
					}
				}
				if ($('body').data("code")) {
					if (isAcctLevel != '1') {
						$("#cbAcct").hide();
						page.chooseAcctFlag = false;
						page.acctCode = '*';
						//点击改变新增模态框上的显示值
						page.initUserDataForm();
						page.getUserDataList(page.eleCodeVal);
					} else if (isAcctLevel == '1') {
						if (page.acctFlag == true) {
							$("#cbAcct").show();
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function (result) {
								var acctData = result.data;
								if (acctData.length > 0) {
									page.chooseAcctFlag = false;
								} else {
									page.chooseAcctFlag = true;
								}
								page.acctTreeData = [];
								page.acctTreeData = result.data;
								page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									data: acctData,
									onchange: function (data) {
										page.acctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
										/*if($.isNull(data)) {
											page.acctCode = '*';
										}*/
										if (page.chooseAcctFlag == true) {
											ufma.showTip('请选择账套', function () { }, 'warning');
											return false;
										} else {
											//点击改变新增模态框上的显示值
											//由于获取账套树是异步请求，当账套树下拉change之后已经获取完上级财政项目的数据 guohx 20200814
											page.initUserDataForm();
											page.getUserDataList(page.eleCodeVal);
										}

										//缓存单位账套
										var params = {
											selAgecncyCode: page.agencyCode,
											selAgecncyName: page.agencyName,
											selAcctCode: page.acctCode,
											selAcctName: page.acctName
										}
										ufma.setSelectedVar(params);
									},
									initComplete: function (sender) {
										if (!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
											page.cbAcct.setValue(page.acctCode, page.acctName);
										} else {
											if (page.acctTreeData.length > 0) {
												page.cbAcct.select(1);
											} else {
												page.cbAcct.val('');
												page.accsCode = '';
												page.acctCode = '';
												page.chooseAcctFlag = true;
												var result = [];
												page.renderTable(result, page.pageNum, page.pageLen);
												ufma.showTip('请选择账套', function () { }, 'warning');
												return false;
											}
										}
									}

								});
							});
							//page.initAcctScc();
						} else {
							page.chooseAcctFlag = false;
							$("#cbAcct").hide();
							page.acctCode = '*';
							//点击改变新增模态框上的显示值
							page.initUserDataForm();
							page.getUserDataList(page.eleCodeVal);
						}
					}
				} else {
					//点击改变新增模态框上的显示值
					page.initUserDataForm();
					page.getUserDataList(page.eleCodeVal);
				}

				$('.table-sub-info').text(ctrlName);
				if ($('body').data("code") && page.isLeaf != 0) {
					//单位为末级单位时不显示下发按钮
					$("#userDataBtnDown").hide();
				} else {
					//非末级单位需根据控制规则显示/隐藏按钮
					//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
					if (page.agencyCtrlLevel == "03") {
						//上下级公用选用,上下级无关下发隐藏
						$("#userDataBtnDown").hide();
					} else {
						//上下级公用下发,下级细化可增加一级,下级细化不可增加一级下发显示
						$("#userDataBtnDown").show();
					}
				}

				//请求上级控制信息
				page.parentCtrlBtn(ctrlName);
				// if ($('body').data("code")) {
				// 	//单位级的
				// 	//请求上级控制信息
				// 	page.parentCtrlBtn(ctrlName);
				// } else {
				// 	$(".table-sub-info").text("提示：" + ctrlName);
				// }
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function (ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					eleCode: page.eleCodeVal,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function (data2) {
					if (!$.isNull(data2)) {
						page.agencyCtrlLevel2 = data2.agencyCtrllevel;
						var ctrlName2;
						if (page.agencyCtrlLevel2 == "0101") {
							//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
							$(".btn-add").hide();
							//$(".btn-choose").hide();
							$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
							ctrlName2 = data2.agencyCtrlName;
						} else if (page.agencyCtrlLevel2 == "0102") {
							//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
							$(".btn-choose").show();
							$(".btn-add").hide();
							ctrlName2 = data2.agencyCtrlName;
						} else if (page.agencyCtrlLevel2 == "0201") {
							//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
							$(".btn-add").show();
							$(".btn-addlower").show();
							$(".btn-choose").show();
							ctrlName2 = data2.agencyCtrlName;
						} else if (page.agencyCtrlLevel2 == "0202") {
							//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
							$(".btn-add").show();
							$(".btn-addlower").hide();
							$(".btn-choose").show();
							ctrlName2 = data2.agencyCtrlName;
						} else if (page.agencyCtrlLevel2 == "03") {
							//上下级无关，新增不强制，选用隐藏，增加下级不强制（在表格的complete中做了控制）
							$(".btn-choose").hide();
							$(".btn-add").show();
							ctrlName2 = data2.agencyCtrlName;
						}

						//控制信息提示
						var newCtrlInfor = "提示：";
						// if(ctrlName2 && ctrlName){
						// 	newCtrlInfor ='<div>提示：'+ctrlName2+'</div><div>'+ctrlName+'</div>';
						// }
						newCtrlInfor = newCtrlInfor + ctrlName;
						$(".table-sub-info").html(newCtrlInfor);
					}
				});
			},
			//判断是否显示控制方式
			isShowControl: function () {
				var aCode = $('.userData-result dl dd.result-active').find("span").data("agency");
				page.tabledatas = $('.userData-result dl dd.result-active').find('span').attr('data-table')
				page.aCode = aCode;
				var argu = {
					eleCode: page.eleCodeVal,
					agencyCode: aCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, page.initfifaCallBack);

				/*if($('body').data("code")) {
					if(aCode == "*") {
						// page.agencyCtrlLevel = ma.ruleData.agencyCtrllevel;
						page.getUserDataList(page.eleCodeVal);
					} else {
						$(".btn-choose").hide();
						$(".btn-add").show();
						//$(".table-sub-info").hide();
						page.getUserDataList(page.eleCodeVal);
					}
				} else {
					//page.initConTrolevel();
					page.getUserDataList(page.eleCodeVal);
					// page.reqInitRightIssueAgy();
				}*/
			},

			//显示指定要素
			isShowSet: function (aCode, aName, eleCode, eleName, letter) {
				page.letterChar = letter;
				$('.userData-anchor ul li.letter-able a[href="#letter' + letter + '"]').parent().addClass("letter-active");
				$('.userData-result dl dd span[data-elecode="' + eleCode + '"]').parents("dd").addClass("result-active");
				$('.userData-result dl dd span[data-elecode="' + eleCode + '"]').parents("dd").siblings("dd").removeClass("result-active");
				page.tabledatas = $('.userData-result dl dd span[data-elecode="' + eleCode + '"]').attr('data-table');
				page.pageTitle = eleName;
				page.eleCodeVal = eleCode;
				page.agencyCode = aCode;
				showElecode = true;
				//初始化新增、编辑页面的名称
				page.initUserDataForm();
				// ma.initfifa('/ma/sys/element/getEleDetail', {
				// 	eleCode: page.eleCodeVal,
				// 	agencyCode: page.agencyCode,
				// 	rgCode: ma.rgCode,
				// 	setYear: ma.setYear
				// });
				// $('.table-sub-info').text(ma.ctrlName);
				if ($('body').data("code")) {
					page.agencyName = aName;
					page.cbAgency.setValue(page.agencyCode, page.agencyName);
					$(".btn-choose").hide();
					$(".btn-add").show();
					//page.getUserDataList(page.eleCodeVal);
				} else {
					//page.getUserDataList(page.eleCodeVal);
				}
			},
			// 从要素定义进入基础数据维护时默认带入要素定义的单位，只执行一次--bug77855
			locationData: function () {
				var fromAgencyCode = ma.GetQueryString("agencyCode");
				if (fromAgencyCode != null && fromAgencyCode.toString().length >= 1) {
					fromAgencyCode = ma.GetQueryString("agencyCode");
					eleCode = ma.GetQueryString("eleCode");
					eleName = ma.GetQueryString("eleName");
					if (JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")) != null && JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")).elename != undefined) {
						eleName = JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")).elename;
					}
					//CWYXM-7807--从凭证跳转到基础数据维护时letter字段的处理--zsj
					var datafor = ma.GetQueryString("datafor");
					var nameArr = [];
					if (!$.isNull(datafor) && datafor == 'vou') { //lal
						for (var i = 0; i < page.letterData.length; i++) {
							nameArr = nameArr.concat(page.letterData[i].NAME);
						}
						for (var j = 0; j < nameArr.length; j++) {
							if (eleName == nameArr[j].ELE_NAME) {
								letter = nameArr[j].PINYIN;
							}
						}

					} else {
						letter = ma.GetQueryString("letter");
					}
					if (fromAgencyCode == "*") {
						page.isShowSet(fromAgencyCode, "", eleCode, eleName, letter);
					} else {
						fromAgencyName = ma.GetQueryString("agencyName");
						page.isShowSet(fromAgencyCode, fromAgencyName, eleCode, eleName, letter);
					}
					//请求自定义属性
					// reqFieldList(page.agencyCode, eleCode);
				}
			},

			//初始化自定义要素名称列表
			initUserDataName: function () {
				var url;
				if ($('body').data("code")) {
					url = "/ma/sys/userData/getEle";
				} else {
					url = "/ma/sys/userData/getEle";
				}
				var argu = {
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var htm = '';
				var htmPOS = '';
				var callback = function (result) {
					page.letterData = result.data;
					page.locationData();
					ufma.isShow(page.reslist);
					$.each(result.data, function (index, row) {
						if (index === 0) {
							if (showElecode == false) {
								page.eleCodeVal = row.NAME[0].ELE_CODE;
								page.pageTitle = row.NAME[0].ELE_NAME;
								/*$('.caption-subject').text(page.pageTitle);*/
								//初始化新增、编辑页面的名称
								page.initUserDataForm();
							}
						}
						htm += ufma.htmFormat('<dt id="letter<%=PINYIN%>"><%=PINYIN%></dt>', {
							'PINYIN': row.PINYIN
						});
						htmPOS += "<div class='anchorAuto-no'>" +
							"<a hrefs='#letter" + row.PINYIN + "'  class='anchorAuto-no-a'>" + row.PINYIN + "</a>" +
							'</div>'
						$.each(row.NAME, function (index1, row1) {
							//修改bug77951--zsj--系统级不应该显示“单位”二字
							var isSys = row1.AGENCY_CODE != '*' && row1.IS_SYS_ELE != '1' ? '<span class="uf-blue">[单位]</span>' : '';
							htm += ufma.htmFormat('<dd><p><span class="wordElement" data-flag="1" data-agency=<%=AGENCY_CODE%> data-elecode =<%=ELE_CODE%>  data-table =<%=table%>><%=ELE_NAME%></span>' + isSys + '</p></dd>', {
								'table': row1.table,
								'AGENCY_CODE': row1.AGENCY_CODE,
								'ELE_CODE': row1.ELE_CODE,
								'ELE_NAME': row1.ELE_NAME
							});
						});
						//初始化字母锚点可用
						$('.userData-anchor ul li a').each(function (i) {
							if ($(this).text() == row.PINYIN) {
								$(this).closest('li').addClass('letter-able');
							}
						});
					});
					$('.posUserdataResult').html(htmPOS)
					$('.userData-result dl').html(htm);
					$(".posUserdataResult").on("click", "a", function () {
						page.lockScroll = true;
						var datas = $(this).attr('hrefs');
						$(".userData-result").scrollTop($(datas).position().top + $(this).height() - 5);
						$(".anchorAuto-no").removeClass('anchorAuto-color');
						$(this).parent('.anchorAuto-no').addClass('anchorAuto-color');
						setTimeout(function () {
							page.lockScroll = false;
						}, 100);
					});
					//bugCWYXM-4287--新增需求：从要素定义跳入基础数据维护时选中指定要素并将该关键字（letter）内容置顶--zsj
					if (!$.isNull(page.letterChar)) {
						$('.posUserdataResult a.anchorAuto-no-a').each(function (i) {
							if ($('.posUserdataResult a.anchorAuto-no-a').eq(i).text().trim() == letter) {
								$(this).parent().addClass("anchorAuto-color");
								page.lockScroll = true;
								var datas = $(this).attr('hrefs');
								$(".userData-result").scrollTop($(datas).position().top + $(this).height() - 5);
								$(".anchorAuto-no").removeClass('anchorAuto-color');
								$(this).parent('.anchorAuto-no').addClass('anchorAuto-color');
								setTimeout(function () {
									page.lockScroll = false;
								}, 100);
							}
						});
					}

					//回调函数执行完才初始化表格,默认为第一个要素的所有数据
					/* var fromAgencyCode = ma.GetQueryString("agencyCode");
          if (fromAgencyCode != null && fromAgencyCode.toString().length >= 1) {
              fromAgencyCode = ma.GetQueryString("agencyCode");
              eleCode = ma.GetQueryString("eleCode");
              eleName = ma.GetQueryString("eleName");
              if (JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")) != null && JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")).elename != undefined) {
                  // eleName = JSON.parse(window.sessionStorage.getItem("cacheData")).elename;
                  eleName = JSON.parse(window.sessionStorage.getItem(eleCode + "_cacheData")).elename;
              }
              letter = ma.GetQueryString("letter");
              if (fromAgencyCode == "*") {
                  page.isShowSet(fromAgencyCode, "", eleCode, eleName, letter);
              } else {
                  fromAgencyName = ma.GetQueryString("agencyName");
                  page.isShowSet(fromAgencyCode, fromAgencyName, eleCode, eleName, letter);
              }
              //请求自定义属性
              // reqFieldList(page.agencyCode, eleCode);
          } else {*/

					/*bug80948--【20190611 财务云8.0 广东省财政厅】基础资料-要素定义，点击数据，跳转到基础数据维护界面，显示的是第一个，没能直接跳转到该要素
					 * 比如：要素定义——费用类型，然后点击费用类型下的数据，跳转到础数据维护界面，显示的是第一个的数据而不是费用类型的数据--zsj*/
					if (!$.isNull(page.eleCodeVal)) {
						if (showElecode == true) {
							var letterStr = page.eleCodeVal.substring(0, 1);
							$('.userData-anchor ul li.letter-able').each(function (i) {
								if ($('.userData-anchor ul li.letter-able').eq(i).text() == letterStr) {
									$(this).addClass("letter-active");
								}
							});
							$('.userData-result dl dd').each(function (i) {
								if ($('.userData-result dl dd .wordElement').eq(i).text() == page.pageTitle) {
									$(this).addClass("result-active");
								}
							});
						} else {
							$('.userData-anchor ul li.letter-able').eq(0).addClass("letter-active");
							$('.userData-result dl dd').eq(0).addClass("result-active");

						}

						// page.isShowControl();
						//请求自定义属性
						// reqFieldList(page.agencyCode, page.eleCodeVal);
					} else {
						$('#userData-data').DataTable({
							"bPaginate": false, //翻页功能
							"bLengthChange": false, //改变每页显示数据数量
							"bFilter": false, //过滤功能
							"bSort": false, //排序功能
							"bInfo": false, //页脚信息
							"bAutoWidth": false, //自动宽度
							"destroy": true,
							"drawCallback": function (settings) {
								ufma.isShow(page.reslist);
								$('#userData-data').find("td.dataTables_empty").text("")
									.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
							}
						});
						// $(".control-element a").on("click", function () {
						//     return false;
						// });影响状态选择，先注释掉了
						//$(".btn-group,.table-sub,.ufma-tool-bar").hide();   // guohx 临时注释
					}

					//}
					page.isShowControl();
					ma.nowTitle = page.pageTitle;
					/* if($('body').data("code")) {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userData/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, page.acctCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					} else {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userData/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, page.acctCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					} */
				}
				ufma.get(url, argu, callback);
			},

			//打开编辑、详情页
			bsAndEdt: function (data) {
				page.action = 'edit';
				$("#field1").ufmaTreecombox().setValue("", "");
				$("#field2").ufmaTreecombox().setValue("", "");
				$("#field3").ufmaTreecombox().setValue("", "");
				$("#field4").ufmaTreecombox().setValue("", "");
				$("#field5").ufmaTreecombox().setValue("", "");
				ufma.deferred(function () {
					$('#form-userData').setForm(data);
					$("#field1").ufmaTreecombox().val(data.field1);
					$("#field2").ufmaTreecombox().val(data.field2);
					$("#field3").ufmaTreecombox().val(data.field3);
					$("#field4").ufmaTreecombox().val(data.field4);
					$("#field5").ufmaTreecombox().val(data.field5);
				});
				ma.isRuled = true;
				ma.isEdit = true; //bug79461--zsj--修改编辑界面校验编码问题
				this.openEdtWin(data);
				this.setFormEnabled();
			},

			//打开模态框方法
			openEdtWin: function (data) {
				ma.defaultRightInfor("expfunc-help", page.pageTitle)
				if ($.isNull(data)) {
					data = {};
				}
				if (page.action == 'edit' || page.action == 'addlower') {
					if (page.action == 'edit') {
						ma.isEdit = true;
						$("#chrCode").attr('disabled', true)
					} else {
						ma.isEdit = false;
						$("#chrCode").attr('disabled', false)
					}

					var thisCode = $("#chrCode").val();
					if ($("#chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"table": page.tabledatas,
							"eleCode": page.eleCodeVal,
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
							ma.nameTip = result.data;
						});
					}
				}
				if (page.action == "add" || page.action == "addlower") {
					ma.isEdit = false;
					$("#chrName").attr('disabled', false)
					$('.btn-group label').attr('disabled', false)
					$('.u-msg-footer button').prop('display', 'block')
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					data.lastVer = "";
					$("input[name='chrId'],input[name='lastVer'],input[name='chrName']").val(""); //bug79462--增加下级时带有刚才查看的上级信息
				}
				$('#userData-edt').find('.form-group').each(function () {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});

				$('#expfunc-help').html('<li style="padding:0">请输入<span>' + page.pageTitle + '</span>编码获得参考信息</li>');
				page.editor = ufma.showModal('userData-edt', 800, 400);
				page.formdata = data;
				if ($('.btn-save').prop('display') == 'none') {
					$('#form-userData').disable()
				}
				if (ma.fjfa != '') {
					$('#prompt').text('编码规则：' + ma.fjfa)
				} else {
					$('#prompt').text("")
				}
				//page.formdata=$('#form-userData').serializeObject();
				//bugCWYXM-4106--要素为无编码规则时,基础数据维护,新增数据,保存时,提示新增无编码规则不符合分级规则--zsj
				if ($('body').data("code")) {
					//编码验证
					// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--编码变化后上级财政项目获取数据--zsj--与maCommon.js的编码相关事件冲突，估重新提出
					page.codeValidator('chrCode', page.pageTitle, '/ma/sys/userData/findParentList?eleCode=' + page.eleCodeVal + '&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help", page.accsCode);
				} else {
					//编码验证
					// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--编码变化后上级财政项目获取数据--zsj--与maCommon.js的编码相关事件冲突，估重新提出
					page.codeValidator('chrCode', page.pageTitle, '/ma/sys/userData/findParentList?eleCode=' + page.eleCodeVal + '&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help", page.accsCode);
				}
				//名称验证
				ma.nameValidator('chrName', page.pageTitle);
				//bugCWYXM-4119--公共要素下助记码在新建时会自动带入,且不能删掉--zsj
				setTimeout(function () {
					$('#assCode').val(data.assCode);
				}, 250);
			},
			// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--编码变化后上级财政项目获取数据--zsj--与maCommon.js的编码相关事件冲突，估重新提出
			codeValidator: function (codeId, name, url, agencyCode, acctCode, helpId, accsCode, atuoSetParentInfor) {
				var blurNum = 0;
				//修改往来单位提示不符合编码规则的提示--zsj
				$('#' + codeId).off().on('focus paste keyup', function (e) {
					$('input[name="allowAddsub"]').each(function () {
						$(this).closest('label').removeAttr("disabled", 'disabled');
					});
					blurNum = 1;
					if (e !== undefined) {
						e.stopPropagation();
					}
					$('#' + codeId).closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					if (ma.fjfa != null && ma.fjfa != "") {
						var dmJson = ufma.splitDMByFA(ma.fjfa, textValue);
						ma.isRuled = dmJson.isRuled;
						ma.aInputParentCode = dmJson.parentDM.split(',');
						ma.aInputParentCode.pop();
						if ((ma.aInputParentCode.length > 0)) {
							ma.aInputParentCode = [ma.aInputParentCode.pop()];
						} else {
							ma.aInputParentCode = [];
						}
					} else {
						ma.isRuled = true;
					}
				}).on('blur', function () {
					blurNum++;
					if (ma.fjfa != null && ma.fjfa != "") {
						var fjfaArr = ma.fjfa.split('-');
						var num = 0;
						for (var i = 0; i < fjfaArr.length; i++) {
							num += parseInt(fjfaArr[i]);
						}
						ma.isRuled = true;
					} else {
						ma.isRuled = true;
					}
					var textValue = $(this).val();
					var originValue = $(this).val();
					if (ma.fjfa != null && ma.fjfa != "") {
						var dmJson = ufma.splitDMByFA(ma.fjfa, textValue);
						ma.isRuled = dmJson.isRuled;
						ma.aInputParentCode = dmJson.parentDM.split(',');
						ma.aInputParentCode.pop();
						if ((ma.aInputParentCode.length > 0)) {
							ma.aInputParentCode = [ma.aInputParentCode.pop()];
						} else {
							ma.aInputParentCode = [];
						}
					}
					var params = {
						originValue: originValue,
						num: num,
						name: name,
						codeId: codeId,
						blurNum: blurNum,
						acctCode: acctCode,
						accsCode: accsCode,
						atuoSetParentInfor: atuoSetParentInfor,
						agencyCode: agencyCode
					}
					if (textValue.length > 0) {
						if (ma.pageFlag == "userData") {
							if (ma.nowTitle == name) {
								ma.showParentHelp(url, textValue, agencyCode, acctCode, helpId, params);
							}
						}
					}
					//无编码规则时
					if (ma.fjfa == '') {
						page.initUpDepro(textValue);
					}
				});
			},
			//详情页设置字段disabled，字段名称
			setFormEnabled: function () {
				if (page.action == 'edit') {
					if ($('body').data("code")) {
						if (page.aCode == "*") {
							if (page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {
								$('#chrName').attr('disabled', 'disabled');
								$('#userData-edt label.btn').attr('disabled', 'disabled');
								$("#userData-edt .btn-saveadd,#userData-edt .btn-save").hide();
							} else {
								$('#chrName').removeAttr('disabled');
								$('#userData-edt label.btn').removeAttr('disabled');
								$("#userData-edt .btn-saveadd,#userData-edt .btn-save").show();
							}
						} else {
							$('#chrName').removeAttr('disabled');
							$('#userData-edt label.btn').removeAttr('disabled');
							$("#userData-edt .btn-saveadd,#userData-edt .btn-save").show();
						}
					} else {
						$('#chrName').removeAttr('disabled');
						$('#userData-edt label.btn').removeAttr('disabled');
						$("#userData-edt .btn-saveadd,#userData-edt .btn-save").show();
					}
				} else if (page.action == 'add') {
					$('#chrCode').removeAttr('disabled');
					//$('#chrName').removeAttr('disabled');
					$('#form-userData')[0].reset();
					$('#form-userData input[name="chrId"]').val('');
					$('#form-userData input[name="lastVer"]').val('');
				}
			},

			//批量行操作
			actionMore: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#userData-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#userData-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					'action': action,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: page.eleCodeVal,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				argu.eleCode = page.eleCodeVal;
				var callback = function (result) {
					ufma.hideloading();
					if (action == 'del') {
						if ($tr) {
							$tr.remove();
						} else {
							//                            page.getUserDataList(page.eleCodeVal);
						}
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else if (action == 'active') {
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('启用成功', function () { }, 'success');
						}
					} else if (action == 'unactive') {
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('停用成功！', function () { }, 'success');
						}
					} else {
						if ($tr) {
							if (action == "active") {
								$tr.find('.btn[action="active"]').attr('disabled', action == "active");
								$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							} else { }
						} else {
							//                            page.getUserDataList(page.eleCodeVal);
						}
					}
					page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
				};
				if (action == 'del') {
					ufma.confirm("你确认删除选中的" + page.pageTitle + "吗？", function (action) {
						if (action) {
							ufma.showloading('数据删除中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
							page.isNoData();
						}
					}, {
						type: 'warning'
					})
				} else if (action == 'addlower') {
					ufma.showloading('正在增加下级，请耐心等待...');
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.agencyCode = page.agencyCode;
					newArgu.acctCode = page.acctCode;
					newArgu.eleCode = page.eleCodeVal;
					newArgu.rgCode = ma.rgCode;
					newArgu.setYear = ma.setYear;
					ufma.ajax(options.url, options.type, newArgu, function (result) {
						var data = result.data;
						ma.isRuled = true;
						$("#chrCode").val(data)
						page.action = 'addlower';
						ufma.hideloading();
						page.openEdtWin();
						$("#chrCode").trigger("blur");
					});
				} else if (action == 'active') {
					ufma.confirm("你确认启用选中的" + page.pageTitle + "吗？", function (action) {
						if (action) {
							ufma.showloading('数据启用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					})
				} else if (action == 'unactive') {
					ufma.confirm("你确认停用选中的" + page.pageTitle + "吗？", function (action) {
						if (action) {
							ufma.showloading('数据停用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					})
				}
			},
			//单行行操作
			actionMoreOne: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#userData-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#userData-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					'action': action,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: page.eleCodeVal
				};
				argu.eleCode = page.eleCodeVal;
				var callback = function (result) {
					ufma.hideloading();
					if (action == 'del') {
						if ($tr) {
							$tr.remove();
						}
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else if (action == 'active') {
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('启用成功', function () { }, 'success');
						}
					} else if (action == 'unactive') {
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('停用成功！', function () { }, 'success');
						}
					} else {
						if ($tr) {
							if (action == "active") {
								$tr.find('.btn[action="active"]').attr('disabled', action == "active");
								$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							}
						}
					}
					page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
				};
				if (action == 'del') {
					ufma.ajax(options.url, options.type, argu, callback);
					page.isNoData();
				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},

			getInterface: function (action) {
				var urls = {
					del: {
						type: 'delete',
						url: '/ma/sys/userData/del'
					},
					active: {
						type: 'put',
						url: '/ma/sys/userData/able'
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/userData/able'
					},
					addlower: {
						type: 'post',
						url: '/ma/sys/common/getMaxLowerCode'
					}
				};
				return urls[action];
			},

			//模态框上的保存
			save: function (eleCodeVal, flag) {
				page.pageNum = $('#userData-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#userData-data_length').find('select').val());
				if (page.action == 'add') {
					if (!ma.formValidator("chrCode", "chrName", page.pageTitle, "add")) {
						return false;
					}
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var url = '/ma/sys/userData/save';
				var argu = $('#form-userData').serializeObject();

				if (ma.nameTip != null && ma.nameTip != "") {
					argu["chrFullname"] = ma.nameTip + "/" + $("#chrName").val();
				} else {
					argu["chrFullname"] = $("#chrName").val();
				}

				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				if (page.eleCodeVal) {
					argu["eleCode"] = eleCodeVal;
				}
				var callback = function (result) {
					page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
					$('#chrCode').removeAttr('disabled');
					if (flag) {
						ma.aParentCode = [];
						ufma.hideloading();
						ufma.showTip('保存成功！', function () {
							$('#form-userData')[0].reset();
							//bugCWYXM-5216--修改基础数据维护保存并新增时要素控制方式不正确问题--zsj
							$("#form-userData").find(".btn-group").each(function () {
								$(this).find("label").eq(0).addClass("active").attr("disabled", false)
									.find("input[type='radio']").prop("checked", true);
								$(this).find("label").eq(1).removeClass("active").attr("disabled", false)
									.find("input[type='radio']").prop("checked", false);
							});
							page.initUserDataForm();
							page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
							page.editor.close();
						}, "success");
					} else {
						ufma.hideloading();
						ufma.showTip('保存成功，您可以继续添加' + page.pageTitle + '！', function () {
							$('#form-userData')[0].reset();
							page.action = 'add'
							//清空表单数据
							$("#form-userData").find("input[type='text']").val("");
							$("input[name='chrId'],input[name='lastVer']").val("");
							//bugCWYXM-5216--修改基础数据维护保存并新增时要素控制方式不正确问题--zsj
							$("#form-userData").find(".btn-group").each(function () {
								$(this).find("label").eq(0).addClass("active").attr("disabled", false)
									.find("input[type='radio']").prop("checked", true);
								$(this).find("label").eq(1).removeClass("active").attr("disabled", false)
									.find("input[type='radio']").prop("checked", false);
							});
							page.formdata = $('#form-userData').serializeObject();
							ma.fillWithBrother($('#chrCode'), {
								"chrCode": argu.chrCode,
								"eleCode": page.eleCodeVal,
								"agencyCode": page.agencyCode,
								"acctCode": page.acctCode
							});
						}, "success");
					}
				}
				ufma.post(url, argu, callback);
			},

			//表单校验
			//            formValidator: function () {
			//
			//            },

			//多选checkbox函数
			getCheckedRows: function () {
				var checkedArray = [];
				$("#userData-data .checkboxes:checked").each(function () {
					checkedArray.push($(this).val());
				})
				return checkedArray;
			},
			renderTable: function (result, pageNum, pageLen) {
				var id = "userData-data";
				$('#' + id).html('');
				var toolBar = $('#' + id).attr('tool-bar');
				var data = [];
				if (result.data) {
					data = result.data;
				} else {
					data = [];
				}
				page.userData = $("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					"destroy": true,
					"data": data,
					"pageLength": ufma.dtPageLength("#" + id),
					"bFilter": true, //去掉搜索框
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
							'<span></span> ' +
							'</label>',
						data: "chrCode",
						width: 40
					},
					{
						title: page.pageTitle + "编码",
						data: "chrCode",
						className: 'tl',
						width: 300
					},
					{
						title: page.pageTitle + "名称",
						className: 'tl',
						data: "chrName"
					},
					{
						title: "控制方式",
						data: "allowAddsubName",
						width: 120
					},
					{
						title: "状态",
						data: "enabledName",
						width: 60
					},
					{
						title: "操作",
						data: '',
						width: 100,
						"render": function (data, type, rowdata, meta) {
							var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
							var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';

							var addlower = "";
							var del = "hidden";
							if (rowdata.canAddsub == "1") {
								addlower = '';
							} else {
								addlower = 'hidden';
							}
							return '<a class="btn btn-icon-only btn-sm btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + rowdata.chrCode + '" agencyCode="' + page.agencyCode + '" title="增加下级">' +
								'<span class="glyphicon icon-add-subordinate"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-start" data-toggle="tooltip" ' + active + ' action= "active" chrCode="' + rowdata.chrCode + '" title="启用">' +
								'<span class="glyphicon icon-play"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" chrCode="' + rowdata.chrCode + '" title="停用">' +
								'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-delete" data-toggle="tooltip"  action= "del" chrCode="' + rowdata.chrCode + '" title="删除">' +
								'<span class="glyphicon icon-trash"></span></a>';
						}
					}
					],
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"className": "checktd",
						"render": function (data, type, rowdata, meta) {
							return '<div class="checkdiv"></div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" class="checkboxes" value="' + data + '" data-addlow="' + rowdata.allowAddsub + '" data-start="' + rowdata.enabled + '"/>&nbsp;' +
								'<span></span> ' + '</label>';
						}
					},
					{
						"targets": [1, 2, 3, 4],
						"className": "isprint"
					},
					{
						"targets": [2],
						"serchable": false,
						"orderable": false,
						"render": function (data, type, rowdata, meta) {
							var textIndent = '0';
							if (rowdata.levelNum) {
								textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
							}
							var alldata = JSON.stringify(rowdata);
							return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
						}
					},
					{
						"targets": [4],
						"className": "userData-status",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.enabled == 1) {
								return '<span style="color:#00A854">' + data + '</span>';
							} else {
								return '<span style="color:#F04134">' + data + '</span>';
							}
						}
					},
					{
						"targets": [-1],
						"serchable": false,
						"orderable": false,
						"className": "text-center nowrap btnGroup",
					}
					],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (win) {
							$(win.document.body).find('h1').css("text-align", "center");
							$(win.document.body).css("height", "auto");
						}
					},
					{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					"initComplete": function (settings, json) {
						//控制按钮显示
						page.tableBtnShow();

						$(".datatable-group-checkable").prop("checked", false);

						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#printTableData .buttons-excel").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#' + id), page.pageTitle);
						});
						//导出end
						$("#printTableData .buttons-print").addClass("btn-permission btn-print");
						$("#printTableData .buttons-excel").addClass("btn-permission btn-export");

						$('#printTableData.btn-group').css({
							"position": "inherit",
							"margin-right": "2px"
						});
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						//批量操作toolbar与分页
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						if (pageLen != "" && typeof (pageLen) != "undefined") {
							$('#' + id).DataTable().page.len(pageLen).draw(false);
							if (pageNum != "" && typeof (pageNum) != "undefined") {
								$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
							}
						}

						//checkbox的全选操作
						$(".datatable-group-checkable").on("change", function () {
							var isCorrect = $(this).is(":checked");
							$("#" + id + " .checkboxes").each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$(".datatable-group-checkable").prop("checked", isCorrect);
						});

						//权限控制
						ufma.isShow(page.reslist);
						// $('#' + id).closest('.dataTables_wrapper').ufScrollBar({
						// 	hScrollbar: true,
						// 	mousewheel: false
						// });
						// ufma.setBarPos($(window));
						//固定表头
						$("#userData-data").tblcolResizable();
						$("#userData-data").fixedTableHead($("#outDiv"));
					},
					"drawCallback": function (settings) {
						//控制按钮显示
						page.tableBtnShow();

						ufma.isShow(page.reslist);
						// ufma.parseScroll();
						page.isNoData();
						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						//操作按钮显示tips
						$('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();

						$('#' + id + ' .btn').on('click', function () {
							page._self = $(this);
						});
						$('#' + id + ' .btn-delete').ufTooltip({
							content: '您确定删除当前' + page.pageTitle + '吗？',
							onYes: function () {
								ufma.showloading('数据删除中，请耐心等待...');
								page.actionMoreOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						$('#' + id + ' .btn-start').ufTooltip({
							content: '您确定启用当前' + page.pageTitle + '吗？',
							onYes: function () {
								ufma.showloading('数据启用中，请耐心等待...');
								page.actionMoreOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						$('#' + id + ' .btn-stop').ufTooltip({
							content: '您确定停用当前' + page.pageTitle + '吗？',
							onYes: function () {
								ufma.showloading('数据停用中，请耐心等待...');
								page.actionMoreOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						// ufma.setBarPos($(window));
					}

				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function () {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});
			},
			//datables数据显示
			getUserDataList: function (eleCodeVal, pageNum, pageLen) {
				var argu = $('#query-status').serializeObject();
				if (eleCodeVal) {
					argu["eleCode"] = eleCodeVal;
				}
				var callback = function (result) {
					page.renderTable(result, page.pageNum, page.pageLen);
				};

				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				argu.table = page.tabledatas;
				if (argu.table) {
					ufma.get("/ma/sys/userData/list", argu, callback);
				}
			},
			//根据上级控制规则决定表格中的按钮显示
			tableBtnShow: function () {
				//控制增加下级按钮
				if ($('body').attr("data-code")) {
					if (page.agencyCtrlLevel2 != '0101' && page.agencyCtrlLevel2 != '0102') {
						$(".btn-addlower").show();
					} else {
						$(".btn-addlower").hide();
					}
				} else {
					$(".btn-addlower").show();
				}
				//控制删除按钮--经赵雪蕊确认先不做删除按钮的显示控制，后续需要时放开注释即可--zsj
				/*if($('body').attr("data-code")) {
					if(page.agencyCtrlLevel != '0101') {
						$('#delete').removeClass('hidden')
					} else {
						$('#delete').addClass('hidden')
					}
				}*/
			},

			//选用页面初始化
			getExpFuncChoose: function () {
				// var url = "/ma/sys/userData/list";
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					if (result.data.length > 0) {
						page.issueAgecyCode = result.data[0].agencyCode;
					}
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"data": result.data,
						"bFilter": true, //去掉搜索框
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						"pagingType": "full_numbers", //分页样式
						"lengthChange": true, //是否允许用户自定义显示数量p
						"lengthMenu": [
							[20, 50, 100, 200, -1],
							[20, 50, 100, 200, "全部"]
						],
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": true, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
								'class="datatable-choose-checkall"/> &nbsp; <span></span> </label>',
							data: "code"
						},
						{
							title: page.pageTitle + "编码",
							data: "code"
						},
						{
							title: page.pageTitle + "名称",
							data: "codeName"
						},
						{
							title: "状态",
							data: "enabledName"
						}
						],
						"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function (data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
									'<span></span> </label>';
							}
						},
						{
							"targets": [3],
							"render": function (data, type, rowdata, meta) {
								if (rowdata.enabled == 1) {
									return '<span style="color:#00A854">启用</span>';
								} else {
									return '<span style="color:#F04134">停用</span>';
								}
							}
						}
						],
						"dom": 'rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
						"initComplete": function (settings, json) {

							//                        	var $info = $(toolBar + ' .info');
							//                            if ($info.length == 0) {
							//                                $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							//                            }
							//                            $info.html('');
							//                            $('.' + id + '-paginate').appendTo($info);

							//权限控制
							ufma.isShow(page.reslist);
							// ufma.setBarPos($(window));
							//bug81141基础资料维护-财政项目-选用，在弹出窗选用界面里点击搜索没反应--zsj
							//ufma.searchHideShow($('#' + id), ".searchHideBtn");
							ma.searchHideShow('choose-search', '#expfunc-choose-datatable', 'searchHideChooseBtn');
						},
						"drawCallback": function (settings) {
							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function () {
								var t = $(this).is(":checked");
								$('#' + id + ' .checkboxes').each(function () {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});

							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						}
					});
					ufma.hideloading();
				};
				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: page.eleCodeVal,
					bgttypeCode: ""
				};
				ufma.get(ma.commonApi.getCanIssueEleTree, argu, callback);
			},

			initUserDataForm: function () {
				$('.u-msg-title h4').text(page.pageTitle + "编辑");
				$('#form-userData .form-group .tab-paramcode').text(page.pageTitle + "编码：").attr("title", page.pageTitle + "编码：");
				$('#form-userData .form-group .tab-paramname').text(page.pageTitle + "名称：").attr("title", page.pageTitle + "名称：");
				$('#expfunc-help li span').text(page.pageTitle);
				if (page.pageTitle == "财政项目") {
					$("#protype").show();
					page.initProType();
					//无编码规则时
					if (ma.fjfa == '') {
						$("#upDepro").show();
						// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--zsj
						page.initUpDepro();
					}
				} else {
					$("#protype").hide();
					$("#upDepro").hide();
				}
			},
			//选用模态框
			openChooseWin: function () {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			getChooseCheckedRows: function () {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getCoaAccList: function (pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if (page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if (page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function (result) {
					//page.renderTable(result, pageNum, pageLen);
				});
			},
			issueTips: function (data, isCallBack) {
				var title = "";
				if (isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = page.pageTitle;
				data.pageType = page.eleCodeVal;
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function (data) {
						//窗口关闭时回传的值;
						if (isCallBack) {
							// page.getCoaAccList(page.pageNum, page.pageLen);
							// CWYXM-14519【20200430 财务云8.20.15】基础资料中的基础数据维护，选用数据后，页面不立即回显数据
							page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
						}
					}
				});
			},
			//初始化项目类别下拉 guohx 20200713
			initProType: function () {
				var data = [];
				function buildCombox() {
					$('#protypeCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode',
						data: data,
						readonly: false,
						leafRequire: true,
						name: 'protypeCode'
					});
				};
				var callback = function (result) {
					data = result.data;
					buildCombox();
				};
				if ($('body').attr('data-code')) {
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=PROTYPE'
				} else {
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=*&acctCode=*&eleCode=PROTYPE'
				}
				ufma.get(url, "", callback);
			},
			//初始化上级财政项目下拉 guohx 20200729
			// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--zsj
			initUpDepro: function (chrCode) {
				var data = [];
				function buildCombox() {
					$('#upDeproCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						// pIdField: 'parentCode',
						data: data,
						readonly: false,
						leafRequire: false,
						name: 'parentCode'
					});
				};
				var callback = function (result) {
					data = result.data;
					buildCombox();
				};
				// var argu = $('#query-status').serializeObject();
				// argu["eleCode"] = 'DEPPRO';
				// argu.agencyCode = page.agencyCode;
				// argu.acctCode = page.acctCode;
				// argu.rgCode = ma.rgCode;
				// argu.setYear = ma.setYear;
				// argu.table = page.tabledatas;
				// var url = '/ma/sys/userData/list';
				//  /ma/sys/common/getParentTree?eleCode=DEPPRO&acctCode=*&chrCode=4&agencyCode=101001&rgCode=87&setYear=2020
				// CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--zsj
				var argu = {};
				argu.eleCode = 'DEPPRO';
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				argu.chrCode = chrCode;
				var url = '/ma/sys/common/getParentTree';
				ufma.get(url, argu, callback);
			},
			onEventListener: function () {
				//导入
				$('.btn-imp').click(function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var agencyCode = $('body').data("code") ? page.agencyCode : '*';
						var acctCode = $('body').data("code") ? page.acctCode : '*';
						var url = "/ma/general/excel/impEleDatas?eleCode=" + page.eleCodeVal + "&rgCode=" + ma.rgCode + "&agencyCode=" + agencyCode + "&acctCode=" + acctCode + "&setYear=" + ma.setYear;
						ufma.open({
							title: '辅助项导入',
							url: '../../pub/impXLS/impXLS.html',
							width: 800,
							height: 400,
							data: {
								eleName: page.pageTitle,
								/* 修改bug78785--传参错误问题--zsj
								 eleCode: "userData",*/
								eleCode: "USERDATA",
								projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
								url: url
							},
							ondestory: function (rst) {
								page.userData.clear().destroy();
								page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
							}
						});
					}
				});
				//右侧隐藏的下发单位
				$(".ufma-shopping-trolley").on('click', function () {
					var chrCodes = page.getCheckedRows();
					var argu = {
						"rgCode": ma.rgCode,
						"setYear": ma.setYear,
						'agencyCode': page.agencyCode,
						'acctCode': page.acctCode,
						"acctCode": page.acctCode,
						'chrCodes': [],
						'eleCode': page.eleCodeVal
					}
					if (chrCodes.length > 0) {
						//选中表格中的具体行数据
						argu.chrCodes = chrCodes
					}
					ufma.showloading("正在加载数据，请耐心等待");
					ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
						if (chrCodes.length > 0) {
							page.rightAgencyUse2(result);
						} else {
							page.rightAgencyUse(result);
						}
					});
				});
				//列表页面表格行操作绑定

				//行checkbox的单选操作
				$("#userData-data").on("click", "tbody td:not(.btnGroup)", function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					//如果是a标签，就进入查看详情页
					if ($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest("tr");
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					//$input.prop('checked',!$input.prop('checked'));
					//$tr[$input.prop('checked')?'addClass':'removeClass']('selected');
					if (ma.fjfa != '') {
						if ($tr.hasClass("selected")) {
							$ele.parents("tbody").find("tr").each(function () {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if (!$.isNull(thisCode)) {
									if ((thisCode.substring(0, code.length) == code) || thisCode == code) {
										$(this).removeClass("selected");
										$(this).find('input[type="checkbox"]').prop("checked", false);
									}
								}
							});
						} else {
							$ele.parents("tbody").find("tr").each(function () {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if (!$.isNull(thisCode)) {
									if ((thisCode.substring(0, code.length) == code) || thisCode == code) {
										$(this).addClass("selected");
										$(this).find('input[type="checkbox"]').prop("checked", true);
									}
								}
							});
						}
					} else {
						//无编码规则
						var $tr = $(this).closest("tr");
						var dataCode = $tr.find(".checkboxes").val();
						var tDatas = page.userData.data()
						$tr.toggleClass("selected");
						if ($tr.hasClass("selected")) {
							$(this).find(".checkboxes").prop("checked", true);
						} else {
							$(this).find(".checkboxes").prop("checked", false);
						}
						var isChecked = $(this).find(".checkboxes").prop("checked")
						for (var i = 0; i < tDatas.length; i++) {
							var parentCode = tDatas[i].parentCode;
							if (tDatas[i].chrCode.substring(0, dataCode.length) == dataCode || parentCode == dataCode) {
								$('#userData-data').find("tbody").find("tr").eq(i).find(".checkboxes").prop("checked", isChecked)
							}
						}
					}
					var $tmp = $("#userData-data tbody .checkboxes");
					$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);

				});

				//选用页面表格行操作绑定
				$('#expfunc-choose-datatable').on('click', 'tbody td', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					if ($tr.hasClass('selected')) {
						//$tr.removeClass('selected');
						//$input.prop("checked", false);
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})
					} else {
						//$tr.addClass('selected');
						//$input.prop("checked", true);
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}
				});

				//	ufma.searchHideShow($('#userData-data'));
				//bug81141基础资料维护-财政项目-选用，在弹出窗选用界面里点击搜索没反应--zsj
				ma.searchHideShow('index-search', '#userData-data', 'searchHideBtn');
				//点击左侧自定义要素事件
				$('.userData-result dl').on('click', ' dd', function (e) {
					page.agencyCtrlLevel = ''
					page.pageTitle = '';
					page.pageTitle = $(this).find('span[data-elecode]').text();
					page.eleCodeVal = $(this).find("p").find("span").data('elecode');
					/*$('.caption-subject').text(page.pageTitle);*/
					//初始化状态为全部
					$("#query-status").find("a").removeClass("selected");
					$("#query-status").find("a").eq(0).addClass("selected");

					//page.getUserDataList(page.eleCodeVal);
					page.isShowControl();


					$('.userData-anchor ul li.letter-able').removeClass("letter-active");
					$('.userData-result dl dd').removeClass("result-active");
					$(this).addClass("result-active");

					ma.nowTitle = '';
					ma.nowTitle = page.pageTitle;
					ufma.isShow(page.reslist);

				});

				$('.userData-anchor').on('click', 'ul li.letter-able', function () {
					$('.userData-anchor ul li.letter-able').removeClass("letter-active");
					$(this).addClass("letter-active");
				});

				//单选状态事件
				$("#query-status .control-element").on('click', 'a', function (e) {
					$(this).parent().find("a[class='label label-radio selected']").removeClass("selected");
					$(this).addClass("selected");
					//对数据进行过滤
					e = e || window.event;
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						ufma.deferred(function () {
							page.userData.clear().destroy();
							page.getUserDataList(page.eleCodeVal);
						});
					}

				});

				//新增打开模态框
				$(".btn-add").on('click', function (e) {
					e.preventDefault();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.action = 'add';
						page.setFormEnabled();
						var data = $('#form-userData').serializeObject();
						// CWYXM-19416 新增财政项目时，点击项目类别下拉框中默认获取焦点的item项，项的value值在项目类别框不显示 guohx 由于编辑后点新增 下拉框没有重新初始化
						page.initUserDataForm();
						page.openEdtWin(data);
					}
				});
				//下发
				$('#userDataBtnDown').on('click', function (e) {
					e.stopPropagation();
					var paramData = page.getCheckedRows();
					if (paramData.length == 0) {
						ufma.alert("请选择" + page.pageTitle + "!", "warning");
						return false;
					}
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=' + page.eleCodeVal,
						rootName: '所有单位',
						title: '选择下发单位',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function (data) {
									if (data.length == 0) {
										ufma.alert('请选择单位或账套！', "warning");
										return false;
									}
									acctAlldata = data;
									/*var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										dwCode.push({
											"toAgencyCode": data[i].id
										});
									}*/
									var isAcctTruedata = [];
									var isAcctFalsedata = [];
									var isAcctLeafdata = [];
									var dwCode = [];
									if (acctAlldata) {
										if (acctAlldata.length > 0) {
											for (var i = 0; i < acctAlldata.length; i++) {
												//if(acctAlldata[i].isAcct == true && acctAlldata[i].agencyCode != '' && acctAlldata[i].isLeaf == '1') {
												//单位账套：校验条件--isAcct = true && isFinal =1;传参：toAgencyCode：传选中的单位，toAcctCode:传选中的账套--zsj
												if (acctAlldata[i].isAcct == true && acctAlldata[i].isFinal == '1') {
													chooseAcct = acctAlldata[i].code;
													chooseAgency = acctAlldata[i].agencyCode;
													isAcctTruedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
											for (var i = 0; i < acctAlldata.length; i++) {
												//单位：校验条件--isAcct = false && isFinal =1；传参：toAgencyCode：传选中的单位，toAcctCode:"*"--zsj
												if (acctAlldata[i].isAcct == false && acctAlldata[i].isFinal == '1') {
													chooseAgency = acctAlldata[i].code;
													chooseAcct = '*';
													isAcctFalsedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
										}
									}
									dwCode = isAcctTruedata.concat(isAcctFalsedata);
									var url = '/ma/sys/userData/issue';
									var argu = {
										'chrCodes': paramData,
										'toAgencyAcctList': dwCode,
										"eleCode": page.eleCodeVal,
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function (result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										page.modal.close();
										page.issueTips(result);
										/*if(result.flag == "success") {
										    ufma.showTip("下发成功！", function() {}, "success");
											page.modal.close();
											page.issueTips(result);
										} else {
											ufma.alert(result.msg, "error");
											return false;
										} */
									}
									ufma.post(url, argu, callback);
									//下发后取消全选
									$(".datatable-group-checkable,.checkboxes").prop("checked", false);
									$("#userData-data").find("tbody tr.selected").removeClass("selected");
								}
							},
							'取消': {
								class: 'btn-default',
								action: function () {
									page.modal.close();
								}
							}
						}
					});
				});

				//保存
				$(".btn-save").on('click', function (e) {
					page.save(page.eleCodeVal, true);
					page.isNoData();
				});
				//保存并新增
				$(".btn-saveadd").on('click', function (e) {
					page.save(page.eleCodeVal, false);
					page.isNoData();
				});

				//取消
				$('.btn-close').on('click', function (e) {
					var tmpFormData = $('#form-userData').serializeObject();
					if (!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') == 'block') {
						ufma.confirm('您修改了' + page.pageTitle + '信息，关闭前是否保存', function (isOk) {
							if (isOk) {
								page.save(page.eleCodeVal, true);
							} else {
								ma.aParentCode = [];
								page.editor.close();
							}
						}, {
							type: 'warning'
						})
					} else {
						ma.aParentCode = [];
						page.editor.close();
					}
					page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
				});

				//批量删除
				$('.btn-del').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择' + page.pageTitle + '！', "warning");
							return false;
						};
						page.actionMore('del', checkedRow);
						page.isNoData();
					}
				});

				//批量启用
				$('.btn-active').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择' + page.pageTitle + '！', "warning");
							return false;
						};
						page.actionMore('active', checkedRow);
					}
				});

				//批量停用
				$('.btn-unactive').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择' + page.pageTitle + '！', "warning");
							return false;
						}
						page.actionMore('unactive', checkedRow);
					}
				});

				//增加下级
				$('body').on('click', '.btn-addlower', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = [];
						checkedRow.push($(this).parents("tr").find("input").val());
						page.addlowFlag = $(this).parents("tr").find("input").attr('data-addlow');
						page.startFlag = $(this).parents("tr").find("input").attr('data-start');
						page.actionMore('addlower', checkedRow);
					}

				});

				//"单位级页面监听------------"
				$('.btn-choose').on('click', function (e) {
					e.preventDefault();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						/*page.getExpFuncChoose();
						page.openChooseWin();*/
						//由于原始将选用界面问题太多，且维护不便，故统一为公共界面--zsj--CZSB-182
						ufma.open({
							url: '../maCommon/comChooseIssue.html',
							title: '选用',
							width: 1000,
							height: 500,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/common/issue",
								pageName: page.pageTitle,
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: page.eleCodeVal,
								bgttypeCode: ''
							},
							ondestory: function (result) {
								if (result.action) {
									page.issueTips(result, true);
								}
							}
						});
					}
				});
				//选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
					if (checkRow.length > 0) {
						ufma.showloading('数据选用中，请耐心等待...');
						var toAgencyAcctList = [{
							toAgencyCode: page.agencyCode,
							toAcctCode: page.acctCode
						}];
						var argu = {
							chrCodes: checkRow,
							toAgencyAcctList: toAgencyAcctList, //选用的单位
							eleCode: page.eleCodeVal,
							rgCode: ma.rgCode,
							setYear: ma.setYear,
							agencyCode: page.issueAgecyCode //上级单位代码，是从选用列表的数据中赋值得来的
						};
						var callback = function (result) {
							if (result) {
								ufma.hideloading();
								//ufma.showTip("选用成功", function() {
								page.choosePage.close();
								page.getUserDataList(page.eleCodeVal);
								//	}, "success");
								page.issueTips(result, true);

							}
						};
						ufma.post(ma.commonApi.confirmIssue, argu, callback);
					} else {
						ufma.alert("请选择要选用的数据！", "warning");
						return false;
					}

				});

				$('.btn-agyClose').on('click', function (e) {
					e.preventDefault();
					page.choosePage.close();
				});
				///////
				$('.userData-result').scroll(function () {
					if (!page.lockScroll) {
						var sc = $(this).scrollTop();
						var dtList = $('.userData-result').find('dt');
						var offsetTop = $('.userData-result').offset().top;
						var letterFlag = 'letterA';
						for (var i = 0; i < dtList.length; i++) {
							var dtTop = $(dtList[i]).offset().top - offsetTop - 10;
							if (dtTop > 0) {
								break;
							} else {
								letterFlag = $(dtList[i]).attr('id');
							}
						}
						$('.anchorAuto-color').removeClass('anchorAuto-color');
						$('a[hrefs="#' + letterFlag + '"]').parent().addClass('anchorAuto-color');
					}
				});
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				// $("#userData-data").on("mouseover",'thead', function () {
				// 	console.log('dededede')
				// 	console.log($("#userData-data thead"))
				// })
				$("#userData-data").on("mouseover",'thead', function () {
					$("#userData-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "1px solid #D9D9D9")
					})
				}).on("mouseout",'thead', function () {
					$("#userData-data").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#outDiv").scroll(function () {
					$("#userData-datafixed thead").on("mouseover", function () {
						$("#userData-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#userData-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "none")
						})
					});
				})
				$(window).resize(function(){
					setTimeout(function () {
						$(".myuserData-data .ufma-tool-bar").css({
							width:parseInt($("#outDiv").outerWidth(true))+10+'px'
						})
						// $("#outDiv").outerWidth(true)
					}, 300);
				})
				window.onload = function() {
					$(".myuserData-data .ufma-tool-bar").css({
						width:parseInt($("#outDiv").outerWidth(true))+10+'px'
					})
				}
			},

			//判断表格为空时，添加提示图片，禁用全选
			isNoData: function () {
				var tdDom = $("#" + page.namespace).find("#userData-data tbody tr").eq(0).find("td");
				if ($(tdDom).hasClass("dataTables_empty")) {
					$("#" + page.namespace).find(".ufma-tool-btns input,thead input").attr("disabled", true);
				} else {
					$("#" + page.namespace).find(".ufma-tool-btns input,thead input").removeAttr("disabled");
				}
			},

			getDWUsedInfo: function (data, columnsArr) {
				page.usedDataTable = $('#userData-table').DataTable({
					"data": data,
					"columns": columnsArr,
					"bPaginate": false, //翻页功能
					"bLengthChange": false, //改变每页显示数据数量
					"bFilter": false, //过滤功能
					"bSort": false, //排序功能
					"bInfo": false, //页脚信息
					"destroy": true,
					"bAutoWidth": false, //自动宽度
					"initComplete": function () {
						ufma.hideloading();
					}
				});

			},
			//初始化加载引用单位信息
			// reqInitRightIssueAgy: function () {
			//     var chrCodes = [];
			//     chrCodes = page.getCheckedRows();
			//     var argu = {
			//         "rgCode": ma.rgCode,
			//         "setYear": ma.setYear,
			//         'agencyCode': page.agencyCode,
			//         'chrCodes': [],
			//         'eleCode': page.eleCodeVal
			//     }
			//     ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
			//
			//     })
			// },
			//未选表格行数据
			rightAgencyUse: function (result) {
				var data = result.data;
				var columnsArr = [{
					data: "agencyCode",
					title: "单位ID",
					visible: false
				},
				{
					data: "agencyName",
					title: "单位"
				},
				{
					data: "issuedCount",
					title: "已用"
				}
				];

				var isRight = true;
				if (data != null && data != "null") {
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (!data[i].hasOwnProperty("agencyCode")) {
								ufma.alert("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！", "error");
								isRight = false;
								return false;
							}
							if (!data[i].hasOwnProperty("agencyName")) {
								ufma.alert("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！", "error");
								isRight = false;
								return false;
							}
							if (!data[i].hasOwnProperty("issuedCount")) {
								ufma.alert("第" + i + "条数据的count(" + data[i].count + ")字段不存在！", "error");
								isRight = false;
								return false;
							}
						}
					}
				} else {
					ufma.alert(data + ":格式不正确！", "error");
					isRight = false;
					return false;
				}

				if (isRight) {
					page.getDWUsedInfo(data, columnsArr);
				} else {
					ufma.alert("后台数据格式不正确！", "error");
					return false;
				}
			},
			//选了表格行数据
			rightAgencyUse2: function (result) {
				var data = result.data;
				var columnsArr = [{
					data: "issuedCount",
					title: "编码",
					visible: false
				},
				{
					data: "agencyCode",
					title: "单位代码"
				},
				{
					data: "agencyName",
					title: "单位名称"
				}
				];

				var isRight = true;
				if (data != null && data != "null") {
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							//											if (!data[i].hasOwnProperty("chrCode")) {
							//												isRight = false;
							//												return false;
							//											}
							if (!data[i].hasOwnProperty("agencyCode")) {
								isRight = false;
								return false;
							}
							if (!data[i].hasOwnProperty("agencyName")) {
								isRight = false;
								return false;
							}
						}
					}
				} else {
					isRight = false;
					return false;
				}

				if (isRight) {
					// if(page.usedDataTable){
					//     page.usedDataTable.clear().destroy();
					// }
					page.getDWUsedInfo(data, columnsArr);
				} else {
					ufma.alert("后台数据格式不正确！", "error");
					return false;
				}
			},
			//初始化单位
			initAgencyCode: function () {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function (data) {
						page.agencyCode = data.code;
						page.agencyName = data.name;
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
						page.isLeaf = data.isLeaf;
						if (data.isLeaf != 1) {
							$(".ufma-shopping-trolley").show();
							page.acctFlag = false;
							//非末级单位不显示账套选择框和选用科目按钮
							$("#cbAcct").hide();
						} else {
							$(".ufma-shopping-trolley").hide();
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.initUserDataName();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							selAcctCode: page.acctCode,
							selAcctName: page.acctName
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function (sender) {
						if (!$.isNull(page.agencyCode) && !$.isNull(page.agencyName) != "" && page.agencyCode != "*" && page.agencyName != "*") {
							page.cbAgency.val(page.agencyCode);
						} else {
							page.cbAgency.val(1);
						}
					}
				});
			},
			//初始化账套
			/*			
			 * initAcctScc: function() {
							page.cbAcct = $("#cbAcct").ufmaTreecombox2({
								valueField: 'code',
								textField: 'codeName',
								placeholder: '请选择账套',
								icon: 'icon-book',
								onchange: function(data) {
									page.acctCode = data.code;
									page.acctName = data.name;
									page.accsCode = data.accsCode;
									page.accsName = data.accsName;
									$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
									page.getUserDataList(page.eleCodeVal);
									//缓存单位账套
									var params = {
										selAgecncyCode: page.agencyCode,
										selAgecncyName: page.agencyName,
										selAcctCode: page.acctCode,
										selAcctName: page.acctName
									}
									ufma.setSelectedVar(params);
								},
								initComplete: function(sender) {
									if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
										page.cbAcct.setValue(page.acctCode, page.acctName);
									} else {
										if(page.acctTreeData.length > 0) {
											page.cbAcct.select(1);
										} else {
											page.cbAcct.val('');
										}
									}
								}

							});
						},*/
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ma.pageFlag = "userData";
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.letterChar = '';
				if ($('body').data("code")) {
					page.initAgencyCode();
				} else {
					page.agencyCode = "*";
					page.acctCode = "*";
					page.chooseAcctFlag = false;
					this.initUserDataName();
				}
				this.onEventListener();
				ufma.parse(page.namespace);
				var winH = $(window).height();
				$(".userData-result").css({
					'height': (winH - 80) + 'px'
				});

				$('.userData-result').scroll(function (e) {
					var winPos = $(this).scrollTop();
					if (winPos < 56) {
						$(".posUserdataResult").css("top", (winPos + 70) + "px");
					} else {
						$(".posUserdataResult").css("top", "126px");
					}
				});
				$(".tab-content").css({
					'height': (winH - 80 - 68 - 30 - 8 - 50) + 'px'
				});
				ufma.parse();
				// ufma.parseScroll();
			}
		}
	}();

	page.init();
});
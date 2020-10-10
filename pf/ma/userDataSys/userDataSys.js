$(function () {
	var page = function () {
		var agencyCtrlLevel;
		var eleCodeVal;
		var agencyCode;
		return {
			namespace: 'userData',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},

			//判断是否显示控制方式
			isShowControl: function () {
				var aCode = $('.userData-result dl dd.result-active').find("span").data("agency");
				page.tabledatas = $('.userData-result dl dd.result-active').find('span').attr('data-table')
				page.aCode = aCode;
				//page.agencyCode = aCode;
				//console.info(page.agencyCode);

				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: page.eleCodeVal,
					agencyCode: aCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				});
				$('.table-sub-info').text(ma.ctrlName);
				if ($('body').data("code")) {
					if (page.rgCode == "*") {
						// $(".table-sub-info").show();
						//page.initConTrolevel();
						// ufma.get("/ma/sys/element/getEleDetail", {
						// 	"eleCode": page.eleCodeVal,
						// 	"agencyCode": aCode,
						// 	"rgCode": ma.rgCode,
						// 	"setYear": ma.setYear,
						// 	table: page.tabledatas
						// // }, function (result) {
						// 	var data = result.data;
						page.agencyCtrlLevel = ma.ruleData.agencyCtrllevel;
						//                        	console.info(page.agencyCtrlLevel);
						page.getUserDataList(page.eleCodeVal);
						if (page.agencyCtrlLevel == "0101") { //无按钮
							$(".btn-choose,.btn-add").hide();
						} else if (page.agencyCtrlLevel == "0102") { //右上角：选用  
							$(".btn-choose").show();
							$(".btn-add").hide();
						} else if (page.agencyCtrlLevel == "0201") { //右上角：新增  表格：增加下级
							$(".btn-choose").hide();
							$(".btn-add").show();
						} else if (page.agencyCtrlLevel == "0202") { //右上角：新增 表格：增加下级
							$(".btn-choose").hide();
							$(".btn-add").show();
						} else if (page.agencyCtrlLevel == "03") { //右上角：新增  
							$(".btn-choose").hide();
							$(".btn-add").show();
						}
						//})
					} else {
						$(".btn-choose").hide();
						$(".btn-add").show();
						//$(".table-sub-info").hide();
						page.getUserDataList(page.eleCodeVal);
					}
				} else {
					//page.initConTrolevel();
					page.getUserDataList(page.eleCodeVal);
					page.reqInitRightIssueAgy();
				}
			},

			//显示指定要素
			isShowSet: function (aCode, aName, eleCode, eleName, letter) {
				$('.userData-anchor ul li.letter-able a[href="#letter' + letter + '"]').parent().addClass("letter-active");
				$('.userData-result dl dd span[data-elecode="' + eleCode + '"]').parents("dd").addClass("result-active");
				page.tabledatas = $('.userData-result dl dd span[data-elecode="' + eleCode + '"]').attr('data-table')
				page.pageTitle = eleName;
				page.eleCodeVal = eleCode;
				page.agencyCode = aCode;
				//初始化新增、编辑页面的名称
				page.initUserDataForm();
				//            	console.info(page.agencyCode);
				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: page.eleCodeVal,
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				});
				$('.table-sub-info').text(ma.ctrlName);
				// initConTrolevel: function () {
				// 	var url = "/ma/sys/element/getEleDetail?eleCode=" + page.eleCodeVal + "&agencyCode=" + page.agencyCode + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
				// 	ufma.getEleCtrlLevel(url, function (result) {
				// 		$('.table-sub-info').text(result);
				// 	});
				// },
				if ($('body').data("code")) {
					page.agencyName = aName;
					page.cbAgency.setValue(page.agencyCode, page.agencyName);
					$(".btn-choose").hide();
					$(".btn-add").show();
					//$(".table-sub-info").hide();
					page.getUserDataList(page.eleCodeVal);
				} else {
					//page.initConTrolevel();
					page.getUserDataList(page.eleCodeVal);
					page.reqInitRightIssueAgy();
				}
			},

			//初始化自定义要素名称列表
			initUserDataName: function () {
				var url;
				if ($('body').data("code")) {
					url = "/ma/sys/userDataSys/getEle";
				} else {
					url = "/ma/sys/userDataSys/getEle";
				}
				var argu = {
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var htm = '';
				var htmPOS = '';
				var callback = function (result) {
					ufma.isShow(page.reslist);
					$.each(result.data, function (index, row) {
						if (index === 0) {
							page.eleCodeVal = row.NAME[0].ELE_CODE;
							page.pageTitle = row.NAME[0].ELE_NAME;
							/*$('.caption-subject').text(page.pageTitle);*/
							//初始化新增、编辑页面的名称
							page.initUserDataForm();
						}
						htm += ufma.htmFormat('<dt id="letter<%=PINYIN%>"><%=PINYIN%></dt>', {
							'PINYIN': row.PINYIN
						});
						htmPOS += "<div class='anchorAuto-no'>" +
							"<a hrefs='#letter" + row.PINYIN + "'  class='anchorAuto-no-a'>" + row.PINYIN + "</a>" +
							'</div>'
						$.each(row.NAME, function (index1, row1) {
							var isSys = row1.IS_SYS_ELE != '1' ? '<span class="uf-blue">[单位]</span>' : '';
							htm += ufma.htmFormat('<dd><p><span data-flag="1" data-agency=<%=AGENCY_CODE%> data-elecode =<%=ELE_CODE%>  data-table =<%=table%>><%=ELE_NAME%></span>' + isSys + '</p></dd>', {
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
					//回调函数执行完才初始化表格,默认为第一个要素的所有数据
					var fromAgencyCode = ma.GetQueryString("agencyCode");
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
					} else {
						//						console.info("不是从要素定义打开的页面！");

						//	                    console.info(page.eleCodeVal);
						if (page.eleCodeVal != "" && page.eleCodeVal != undefined) {
							$('.userData-anchor ul li.letter-able').eq(0).addClass("letter-active");
							$('.userData-result dl dd').eq(0).addClass("result-active");

							page.isShowControl();
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
							$(".control-element a").on("click", function () {
								return false;
							});
							//$(".btn-group,.table-sub,.ufma-tool-bar").hide();   // guohx 临时注释
						}

					}
					ma.nowTitle = page.pageTitle;
					if ($('body').data("code")) {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userDataSys/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					} else {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userDataSys/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					}
				}
				ufma.get(url, argu, callback);
			},
			// initConTrolevel: function () {
			// 	var url = "/ma/sys/element/getEleDetail?eleCode=" + page.eleCodeVal + "&agencyCode=" + page.agencyCode + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
			// 	ufma.getEleCtrlLevel(url, function (result) {
			// 		$('.table-sub-info').text(result);
			// 	});
			// },

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
				this.openEdtWin(data);
				this.setFormEnabled();
			},

			//打开模态框方法
			openEdtWin: function (data) {

				if ($.isNull(data)) {
					data = {};
				}
				if (page.action == 'edit' || page.action == 'addlower') {
					if (page.action == 'edit') {
						$("#chrCode").attr('disabled', true)
					} else {
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
							"agencyCode": page.agencyCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
							ma.nameTip = result.data;
						});
					}

				}
				if (page.action == "add" || page.action == "addlower") {
					$("#chrName").attr('disabled', false)
					$('.btn-group label').attr('disabled', false)
					$('.u-msg-footer button').prop('display', 'block')
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					data.lastVer = "";
					$("input[name='chrId'],input[name='lastVer']").val("");
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
				}
				//page.formdata=$('#form-userData').serializeObject();
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
					eleCode: page.eleCodeVal,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				argu.eleCode = page.eleCodeVal;
				var callback = function (result) {
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
								
							} else {
								
							}
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
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.agencyCode = page.agencyCode;
					newArgu.eleCode = page.eleCodeVal;
					newArgu.rgCode = ma.rgCode;
					newArgu.setYear = ma.setYear;
                    ufma.showloading('正在增加下级，请耐心等待...');
					ufma.ajax(options.url, options.type, newArgu, function (result) {
						var data = result.data;
						ma.isRuled = true;
						$("#chrCode").val(data)
						page.action = 'addlower';
						ufma.hideloading();
						page.openEdtWin();
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
					eleCode: page.eleCodeVal
				};
				argu.eleCode = page.eleCodeVal;
				var callback = function (result) {
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
						url: '/ma/sys/userDataSys/del?rgCode='+ma.rgCode+ '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: '/ma/sys/userDataSys/able?rgCode='+ma.rgCode+ '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/userDataSys/able?rgCode='+ma.rgCode+ '&setYear=' + ma.setYear
					},
					addlower: {
						type: 'post',
						url: '/ma/sys/common/getMaxLowerCode?rgCode='+ma.rgCode+ '&setYear=' + ma.setYear
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
				var url = '/ma/sys/userDataSys/save';
				var argu = $('#form-userData').serializeObject();

				if (ma.nameTip != null && ma.nameTip != "") {
					argu["chrFullname"] = ma.nameTip + "/" + $("#chrName").val();
				} else {
					argu["chrFullname"] = $("#chrName").val();
				}

				argu.agencyCode = page.agencyCode;
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				if (page.eleCodeVal) {
					argu["eleCode"] = eleCodeVal;
				}
				var callback = function (result) {
					page.getUserDataList(page.eleCodeVal, page.pageNum, page.pageLen);
					$('#chrCode').removeAttr('disabled');
					ma.aParentCode = [];
					if (flag) {
						ufma.hideloading();
						ufma.showTip('保存成功！', function () {
							$('#form-userData')[0].reset();
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
							$("#form-userData").find(".btn-group").each(function () {
								$(this).find("label").eq(0).addClass("active")
									.find("input[type='radio']").prop("checked", true);
								$(this).find("label").eq(1).removeClass("active")
									.find("input[type='radio']").prop("checked", false);
							});
							page.formdata = $('#form-userData').serializeObject();
							ma.fillWithBrother($('#chrCode'), {
								"chrCode": argu.chrCode,
								"eleCode": page.eleCodeVal,
								"agencyCode": page.agencyCode
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
			//datables数据显示
			getUserDataList: function (eleCodeVal, pageNum, pageLen) {
				var argu = $('#query-status').serializeObject();
				if (eleCodeVal) {
					argu["eleCode"] = eleCodeVal;
				}
				var callback = function (result) {
					var id = "userData-data";
					var toolBar = $('#' + id).attr('tool-bar');
					$("#" + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"fixedHeader": {
							header: true
						},
						"destroy": true,
						"data": result.data,
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
							data: "chrCode"
						},
						{
							title: page.pageTitle + "编码",
							data: "chrCode"
						},
						{
							title: page.pageTitle + "名称",
							data: "chrName"
						},
						{
							title: "控制方式",
							data: "allowAddsubName"
						},
						{
							title: "状态",
							data: "enabledName"
						},
						{
							title: "操作",
							data: ''
						}
						],
						"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function (data, type, rowdata, meta) {
								return '<div class="checkdiv"></div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '"/>&nbsp;' +
									'<span></span> ' +
									'</label>';
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
								return '<a style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
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
							"render": function (data, type, rowdata, meta) {
								var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
								var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';

								var addlower = "hidden";
								var del = "hidden";
								//                                   console.info("page.agencyCtrlLevel="+page.agencyCtrlLevel);
								if ($('body').attr("data-code")) {
									if (page.agencyCtrlLevel != '0101') {
										addlower = "";

									} else {
										addlower = 'hidden';
									}
								} else {
									addlower = '';
								}
								return '<a class="btn btn-icon-only btn-sm btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + rowdata.chrCode + '" agencyCode="' + page.agencyCode + '" title="增加下级">' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-start" data-toggle="tooltip" ' + active + ' action= "active" chrCode="' + rowdata.chrCode + '" title="启用">' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" chrCode="' + rowdata.chrCode + '" title="停用">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" chrCode="' + rowdata.chrCode + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>';
							}
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
							if ($('body').attr("data-code")) {
								if (page.agencyCtrlLevel != '0101') {
									$('#delete').removeClass('hidden')
								} else {
									$('#delete').addClass('hidden')
								}
							}
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
							ufma.setBarPos($(window));
						},
						"drawCallback": function (settings) {

							ufma.isShow(page.reslist);
							ufma.parseScroll();
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

						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function () {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
				};

				argu.agencyCode = page.agencyCode;
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				argu.table = page.tabledatas;
				if (!$('body').data("code")) {
					ufma.get("/ma/sys/userDataSys/list", argu, callback);
				} else {
					ufma.get("/ma/sys/userDataSys/list", argu, callback);
				}
			},

			//选用页面初始化
			getExpFuncChoose: function () {
				var url = "/ma/sys/userDataSys/list";
				var argu = {};
				argu["agencyCode"] = "*";
				argu["eleCode"] = page.eleCodeVal;
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["table"] = page.tabledatas;
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						//                        "fixedHeader": {
						//    				        header: true
						//    				    },
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
							data: "chrCode"
						},
						{
							title: page.pageTitle + "编码",
							data: "chrCode"
						},
						{
							title: page.pageTitle + "名称",
							data: "chrName"
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
									return '<span style="color:#00A854">' + data + '</span>';
								} else {
									return '<span style="color:#F04134">' + data + '</span>';
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
							ufma.setBarPos($(window));
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
				ufma.get(url, argu, callback);
			},

			initUserDataForm: function () {
				$('.u-msg-title h4').text(page.pageTitle + "编辑");
				$('#form-userData .form-group .tab-paramcode').text(page.pageTitle + "编码：");
				$('#form-userData .form-group .tab-paramname').text(page.pageTitle + "名称：");
				$('#expfunc-help li span').text(page.pageTitle);
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
			getCoaAccList: function(pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if(page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if(page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function(result) {
					page.renderTable(result, pageNum, pageLen);
				});
			},
            issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = page.pageTitle;
				data.pageType = page.eleCodeVal;
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width:1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						if(isCallBack) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				});
			},
			onEventListener: function () {
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

					if ($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if ((ma.fjfa != '' && thisCode.substring(0, code.length) == code) || thisCode == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})

					} else {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if ((ma.fjfa != '' && thisCode.substring(0, code.length) == code) || thisCode == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}

					if (!$('body').data("code")) {
						var chrCodes = [];
						chrCodes = page.getCheckedRows();
						//                    	console.info(JSON.stringify(chrCodes));
						if (chrCodes.length > 0) {
							var argu = {
								"rgCode": ma.rgCode,
								"setYear": ma.setYear,
								'agencyCode':page.agencyCode,
								'chrCodes':chrCodes,
								'eleCode': page.eleCodeVal
							}
							ufma.post("/ma/sys/commonRg/countRgUse", argu, function(result) {
								var data = result.data;
								var columnsArr = [{
									data: "issuedCount",
									title: "编码",
									visible: false
								},
								{
									data: "rgCode",
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
											//                							console.info(JSON.stringify(data[i]));
//											if (!data[i].hasOwnProperty("chrCode")) {
//												//                								console.info("第"+i+"条数据的chrCode("+data[i].chrCode+")字段不存在！");
//												isRight = false;
//												return false;
//											}
											if (!data[i].hasOwnProperty("agencyCode")) {
												//                								console.info("第"+i+"条数据的agencyCode("+data[i].agencyCode+")字段不存在！");
												isRight = false;
												return false;
											}
											if (!data[i].hasOwnProperty("agencyName")) {
												//                								console.info("第"+i+"条数据的agencyName("+data[i].agencyName+")字段不存在！");
												isRight = false;
												return false;
											}
										}
									}
								} else {
									//                					console.info(data+":格式不正确！");
									isRight = false;
									return false;
								}

								if (isRight) {
									page.usedDataTable.clear().destroy();
									page.getDWUsedInfo(data, columnsArr);
								} else {
									ufma.alert("后台数据格式不正确！", "error");
									return false;
								}

							});
						} else {
							//购物车表格初始化
							page.usedDataTable.clear().destroy();
							page.reqInitRightIssueAgy();
						}
					}
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

				ufma.searchHideShow($('#userData-data'));
				//点击左侧自定义要素事件
				$('.userData-result dl').on('click', ' dd', function (e) {
					page.agencyCtrlLevel = ''
					page.pageTitle = $(this).find('span[data-elecode]').text();
					page.eleCodeVal = $(this).find("p").find("span").data('elecode');
					//                    console.info(page.pageTitle);
					//                    console.info(page.eleCodeVal);

					/*$('.caption-subject').text(page.pageTitle);*/
					//初始化状态为全部
					$("#query-status").find("a").removeClass("selected");
					$("#query-status").find("a").eq(0).addClass("selected");

					//page.getUserDataList(page.eleCodeVal);
					//点击改变新增模态框上的显示值
					page.initUserDataForm();


					$('.userData-anchor ul li.letter-able').removeClass("letter-active");

					$('.userData-result dl dd').removeClass("result-active");
					$(this).addClass("result-active");

					//page.userDataTable.clear().destroy();
					//$("#userData-data").DataTable().fnDestroy();
					page.isShowControl();
					//请求自定义属性
					// reqFieldList(page.agencyCode, page.eleCodeVal);

					ma.nowTitle = page.pageTitle;
					if ($('body').data("code")) {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userDataSys/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					} else {
						//编码验证
						ma.codeValidator('chrCode', page.pageTitle, '/ma/sys/userDataSys/findParentList?eleCode=' + page.eleCodeVal, page.agencyCode, "expfunc-help");
						//名称验证
						ma.nameValidator('chrName', page.pageTitle);
					}
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
					ufma.deferred(function () {
						page.getUserDataList(page.eleCodeVal);
					});
				});

				//新增打开模态框
				$(".btn-add").on('click', function (e) {
					e.preventDefault();
					page.action = 'add';
					page.setFormEnabled();
					var data = $('#form-userData').serializeObject();
					page.openEdtWin(data);

				});

				//下发
				$('#userDataBtnDown').on('click', function (e) {
					e.stopPropagation();
					var paramData = page.getCheckedRows();
					if (paramData.length == 0) {
						ufma.alert("请选择" + page.pageTitle + "!", "warning");
						return false;
					}
					var url ='';
					if($('body').data("code")) {
						url='/ma/sys/expFuncSys/getRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}else{
						url='/ma/sys/expFuncSys/getSysRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}
					page.modal = ufma.selectBaseTree({
						url: url,
						rootName: '所有区划',
						title: '选择下发区划',
						bSearch: true, //是否有搜索框
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function (data) {
									if (data.length == 0) {
										ufma.alert('请选择单位！', "warning");
										return false;
									}
									// var dwCode = [];
									// for (var i = 0; i < data.length; i++) {
									// 	if (!data[i].isParent) {
									// 		dwCode.push(data[i].id);
									// 	}
									// }
									var dwCode = [];
									for (var i = 0; i < data.length; i++) {
										/*dwCode.push({
											"toRgCode": data[i].id
										});*/
										dwCode.push(data[i].CHR_CODE);
									}
									var url = '/ma/sys/userDataSys/issue';
									var argu = {
										'chrCodes': paramData,
										'toRgCodes': dwCode,
										"eleCode": page.eleCodeVal,
										"agencyCode" : page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									 //bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function (result) {
										ufma.hideloading();
										if (result.flag == "success") {
											ufma.showTip("下发成功！", function () { }, "success");
											page.modal.close();
											 page.issueTips(result);
										} else {
											ufma.alert(result.msg, "error");
											return false;
										}
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

				//输入
				$("body").on("click", function () {

				})

				//取消
				$('.btn-close').on('click', function (e) {
					var tmpFormData = $('#form-userData').serializeObject();
					console.info(page.formdata);
					console.info(tmpFormData)
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
				});

				//批量删除
				$('.btn-del').on('click', function (e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if (checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '！', "warning");
						return false;
					};
					page.actionMore('del', checkedRow);
					page.isNoData();
				});

				//批量启用
				$('.btn-active').on('click', function (e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if (checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '！', "warning");
						return false;
					};
					page.actionMore('active', checkedRow);
				});

				//批量停用
				$('.btn-unactive').on('click', function (e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if (checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '！', "warning");
						return false;
					}
					page.actionMore('unactive', checkedRow);
				});

				//增加下级
				$('body').on('click', '.btn-addlower', function (e) {
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").val());
					page.actionMore('addlower', checkedRow);
				});

				//"单位级页面监听------------"
				$('.btn-choose').on('click', function (e) {
					e.preventDefault();
					page.getExpFuncChoose();
					page.openChooseWin();
				});
				//选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
			 			if (checkRow.length > 0) {
						ufma.showloading('数据选用中，请耐心等待...');
						var argu = {
							chrCodes: checkRow,
							toAgencyCodes: [page.agencyCode],
							eleCode: page.eleCodeVal,
							rgCode: ma.rgCode,
							setYear: ma.setYear,
							table: page.tabledatas
						}
						var url = "/ma/sys/userDataSys/issue";
						var callback = function (result) {
							if (result) {
								ufma.hideloading();
								ufma.showTip("选用成功", function () {
									page.choosePage.close();
									page.getUserDataList(page.eleCodeVal);
								}, "success");
								 page.issueTips(result,true);
							}
						};
						ufma.post(url, argu, callback);
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
					console.log(page.lockScroll);
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
					"bAutoWidth": false //自动宽度
				});
			},
			//初始化加载引用单位信息
			reqInitRightIssueAgy: function () {
				var chrCodes = [];
				chrCodes = page.getCheckedRows();
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode':page.agencyCode,
					'chrCodes':[],
					'eleCode': page.eleCodeVal
				}
				ufma.post("/ma/sys/commonRg/countRgUse", argu, function(result) {
					var data = result.data;
					var columnsArr = [{
						data: "rgCode",
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
								//    							console.info(JSON.stringify(data[i]));
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
				})
			},

			init: function () {
				ma.pageFlag = "userData";
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.rgCode = pfData.svRgCode;
				if ($('body').data("code")) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						url: "/ma/sys/commonRg/getAllRgInfo?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
						leafRequire: false,
						onchange: function (data) {
							//page.agencyCode = page.cbAgency.getValue();
							$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
							pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
							page.initUserDataName();
						},
						initComplete: function (sender) {
							if(!$.isNull(page.rgCode)) {
								page.cbAgency.val(page.rgCode);
							} else {
								page.cbAgency.val(1);
							}
							//page.agencyCode = page.cbAgency.getValue();
							pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
						}
					});
				} else {
					page.agencyCode = "*";
					ma.rgCode = pfData.svRgCode;
					page.rgCode = pfData.svRgCode;
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
				ufma.parseScroll();
				ufma.parse();
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

			}
		}
	}();

	page.init();
});
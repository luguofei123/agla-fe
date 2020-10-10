$(function () {
	//接口URL集合
	var interfaceURL = {
		getAccItemTree: "/lp/FinlDataInterface/getAccItemTree", //请求单位级基础资料树
		getAgencyTree: "/lp/eleAgency/getAgencyTree", //请求单位树
		getAgencyItemTree: "/lp/FinlDataInterface/getAgencyItemTree", //请求系统级基础资料树
		getAcct: "/lp/sys/getRptAccts", //账套
		exportBasicDataXml: "/lp/FinlDataInterface/exportBasicDataXml", //导出基础资料树
		exportProgress: "/lp/FinlDataInterface/exportProgress", //访问进度条
		exportFile: "/lp/FinlDataInterface/exportFile" //执行导出
	};
	var ptData = ufma.getCommonData(), setIntervalId;
	var nowAgencyCode = ptData.svAgencyCode;
	var nowAgencyName = ptData.svAgencyName;
	var nowAcctCode = ptData.svAcctCode;
	var nowAcctName = ptData.svAcctName;
	//如果有单位账套的缓存，则取缓存的值
	var selEnviornmentVar = ufma.getSelectedVar();
	if (selEnviornmentVar) {
		nowAgencyCode = selEnviornmentVar.selAgecncyCode; //登录单位代码
		nowAgencyName = selEnviornmentVar.selAgecncyName; //登录单位名称
		nowAcctCode = selEnviornmentVar.selAcctCode; //账套代码
		nowAcctName = selEnviornmentVar.selAcctName; //账套名称
	}
	//初始化fileinput
	var FileInput = function () {
		var oFile = new Object();

		//初始化fileinput控件（第一次初始化）
		oFile.Init = function (ctrlName, uploadUrl) {
			var control = $('#' + ctrlName);

			//初始化上传控件的样式
			control.fileinput({
				language: 'zh', //设置语言
				uploadUrl: uploadUrl, //上传的地址
				allowedFileExtensions: ['xml'],//接收的文件后缀 //guohx 20190425 全哥说更改为只支持xml 前端修改
				showUpload: true, //是否显示上传按钮
				showCaption: false, //是否显示标题
				browseClass: "btn btn-primary", //按钮样式
				//dropZoneEnabled: false,//是否显示拖拽区域
				//minImageWidth: 50, //图片的最小宽度
				//minImageHeight: 50,//图片的最小高度
				//maxImageWidth: 1000,//图片的最大宽度
				//maxImageHeight: 1000,//图片的最大高度
				maxFileSize: 10240,
				//minFileCount: 0,
				maxFileCount: 10, //表示允许同时上传的最大文件个数
				enctype: 'multipart/form-data',
				validateInitialCount: true,
				previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
				msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
				uploadExtraData: function () {
					return {
						'agencyCode': nowAgencyCode,
						'acctCode': nowAcctCode,
						'setYear': ptData.svSetYear,
						'rgCode': ptData.svRgCode,
						'userId': ptData.svUserId,
						'userName': ptData.svUserName
					};
				}
			}).on("filebatchselected", function (event, files) {
				// $(this).fileinput("upload");
				//                 $.ajax({
				//                     url: "/lp/FinlDataInterface/importVoucher",
				//                     type: 'POST',
				//                     cache: false,
				//                     data: new FormData($('#textFileFrom')[0]),
				//                     processData: false,
				//                     contentType: false
				//                 }).done(function (res) {
				// //                        	console.info(res);
				//                     if (res.flag == "success") {
				//                         ufma.showTip("导入成功！", function () {
				//                             _close("import", res.data);
				//                         }, "success");
				//                     } else {
				//                         ufma.showTip(res.msg, function () {
				//                         }, "error");
				//                     }
				//                 }).fail(function (res) {
				// //                        	console.info(res);
				//                     ufma.showTip(res.msg, function () {
				//                     }, "error");
				//                 });
				$(".fileinput-remove").removeClass("hidden");
				$(".file-preview").css({
					"border": "1px solid #d9d9d9"
				});
				$(".file-drop-zone-title").removeClass("hidden");
				$(".file-drop-zone").css({
					"padding": "4px 0 20px 8px"
				});
			}).on("fileuploaded", function (event, data) {
				page.uploadComplete(data);

			}).on('filebatchuploadcomplete', function (event, files, extra) {
				$('.fileinput-remove-button').trigger("click");
				$(".file-drop-zone").css({
					"min-height": "1px",
					padding: 0
				});
				$(".file-preview").css("border", "none");
				$(".file-drop-zone-title").addClass("hidden");
				$(".kv-upload-progress").removeClass("hide");
				// debugger;
				$(".fileinput-remove").addClass("hidden");
			});
		}
		return oFile;
	};

	var page = function () {

		return {
			uploadError: null,
			uploadComplete: function (data) {
				if (data.response) {
					var statusText = "导入成功",
						fileName = "",
						msg = "详细信息";
					var statusStyle = "color:#5cb85c";
					if (data.response.data[0].status == false) {
						statusText = "导入失败";
						var statusStyle = "color:red";
						msg = "详细原因"
					}
					if (data.response.data[0].fileName == "" && data.response.data[0].signFileName != "") {
						fileName = data.response.data[0].signFileName;
					} else {
						fileName = data.response.data[0].fileName;
					}
					var datamsg = data.response.data[0].msg
					var tips = data.response.data[0].msg;
					page.uploadError = tips;
					var filesHtml = '<div class="result-item">' +
						'<div class="result-file-title"><span>文件名：' + fileName + '</span>' +
						'<span style=' + statusStyle + '>&nbsp;&nbsp;&nbsp;&nbsp;' + statusText + '&nbsp;&nbsp;</span>' +
						'<div class="result-msg"><span class="view-msg" clstitle='+datamsg+'>,' + msg + '</span><span class="msg-triangle" style="display: none"></span></div>' +
						'</div>' +
						// '<div class="msg-detail" style="display: none">' + tips + '</div>' +
						'<div class="result-file-content"><span>文件内容：' + data.response.data[0].content + '</span></div>' +
						'</div>';
					$(".upload-result").removeClass("hidden");
					if (data.response.data[0].fileName == "" && data.response.data[0].signFileName != "") {
						$(".no-sign .result-con").append(filesHtml);
					} else {
						$(".sign .result-con").append(filesHtml);
					}

				}
			},
			//初始化上传控件
			initUpLoad: function () {
				//0.初始化fileinput
				var oFileInput = new FileInput();
				oFileInput.Init("txt_file", "/lp/FinlDataInterface/importVoucher");
				$(".file-drop-zone-title").html('<span class="glyphicon icon-upload-lg"></span><p>拖拽文件到这里</p>');
				$(".file-preview-thumbnails .attach-show-li-add").hide();
				$(".fileinput-upload").find(".hidden-xs").text("导入");
			},
			//初始化上传控件
			initUpLoadexport: function () {
				//0.初始化fileinput
				var oFileInput = new FileInput();
				oFileInput.Init("export_file", "/lp/FinlDataInterface/importBaseData");
				$(".file-drop-zone-title").html('<span class="glyphicon icon-upload-lg"></span><p>拖拽文件到这里</p>');
				$(".file-preview-thumbnails .attach-show-li-add").hide();
				$(".fileinput-upload").find(".hidden-xs").text("导入");
			},
			//请求单位级基础资料树
			getAccItemTreeAgency: function () {
				// var argu = {
				//     agencyCode:page.cbAgency.getValue(),
				//     setYear:ptData.svSetYear,
				//     rgCode:ptData.svRgCode
				// };
				ufma.get(interfaceURL.getAccItemTree, "", function (result) {
					page.renderBaseDataTreeAgency(result.data);
				});
			},
			//渲染单位级基础资料树
			renderBaseDataTreeAgency: function (treeDatas) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: "codeName",
							title: "codeName"
						}
					},
					check: {
						enable: true,
					},
					view: {
						// addDiyDom: addDiyDom,
						// fontCss: getFontCss,
						showLine: false,
						showIcon: false
					},
					// callback: {
					//     beforeClick: atreeBeforeClick,
					//     onClick: zTreeOnClick
					// }
				};
				var treeObj = $.fn.zTree.init($("#baseTreeAgency"), setting, treeDatas);
				ufma.hideloading();
			},
			//请求系统级基础资料树
			getAccItemTreeXt: function () {
				var argu = {
					agencyCode: "*",
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				};
				ufma.get(interfaceURL.getAgencyItemTree, argu, function (result) {
					page.renderBaseDataTreeXt(result.data);
				});
			},
			//渲染系统级基础资料树
			renderBaseDataTreeXt: function (treeDatas) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: "codeName",
							title: "codeName"
						}
					},
					check: {
						enable: true,
					},
					view: {
						// addDiyDom: addDiyDom,
						// fontCss: getFontCss,
						showLine: false,
						showIcon: false,
					},
					// callback: {
					//     beforeClick: atreeBeforeClick,
					//     onClick: zTreeOnClick
					// }
				};
				var treeObj = $.fn.zTree.init($("#baseTreeXt"), setting, treeDatas);
				treeObj.expandAll(true);
			},
			//初始化单位
			initAgency: function () {
				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择单位',
					icon: 'icon-unit',
					onchange: function (data) {
						nowAgencyCode = data.id;
						//请求账套
						page.getAcct();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: page.cbAgency.getText(),
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function (sender) { }
				});
			},
			//初始化账套
			initAcct: function () {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function (sender, data) {
						//缓存单位账套
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: page.cbAgency.getText(),
							selAcctCode: $("#cbAcct").getObj().getValue(),
							selAcctName: $("#cbAcct").getObj().getText()
						}
						ufma.setSelectedVar(params);
						nowAcctCode = data.code;
					},
					onComplete: function (sender) {
						$(".uf-combox input").attr("autocomplete", "off");
						if (nowAcctCode) {
							$("#cbAcct").getObj().val(nowAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
					}
				});
			},
			//请求账套
			getAcct: function () {
				//请求账套
				// var agencyCode = page.cbAgency.getValue();
				var arg = {
					agencyCode: nowAgencyCode,
					userId: ptData.svUserId,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				};
				ufma.get(interfaceURL.getAcct, arg, function (result) {
					var data = result.data;
					$("#cbAcct").getObj().load(data);
				});
			},
			//请求单位树
			getAgencyTree: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.get(interfaceURL.getAgencyTree, "", function (result) {
					var data = result.data;
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: data,
					});
					//默认选择单位S
					var code = data[0].id;
					var codeName = data[0].codeName;
					if (data[0].pId === "0") {
						code = data[1].id;
						codeName = data[1].codeName;
					}

					if (nowAgencyCode != "" && nowAgencyName != "") {
						var agency = $.inArrayJson(data, 'id', nowAgencyCode);
						if (agency != undefined) {
							page.cbAgency.setValue(nowAgencyCode, nowAgencyCode + " " + nowAgencyName);
						} else {
							page.cbAgency.setValue(code, codeName);
						}
					} else {
						page.cbAgency.setValue(code, codeName);
					}
					//默认选择单位E
				});
			},
			//获取进度条进度
			exportProgress: function (seed) {
				var argus2 = {
					seed: seed
				};
				ufma.get(interfaceURL.exportProgress, argus2, function (result) {
					var data = result.data;
					var msg = result.data.msg;
					var timeId = null;

					if (data != "") {
						//进度条 S
						$('.xt-result .prog_in').width(Math.ceil(data.current) + '%');
						$(".xt-result .proglabel").html(Math.ceil(data.current) + "%");
						//进度条 E

						if (timeId) {
							clearTimeout(timeId);
						}
						timeId = setTimeout(function () {
							//导出结果渲染在页面中
							var html = "";
							for (var i = 0; i < msg.length; i++) {
								html += msg[i] + "<br>";
								if (i == msg.length - 1) {
									$("button").attr("disabled", false);
								}
							}
							$(".xt-result .show-result").html("");
							$(".xt-result .show-result").append(html);
							clearTimeout(timeId);
						}, 200);

						if (data.current == 100) {
							//进度条 S
							$('.xt-result .prog_in').addClass("progress-bar-success").removeClass("progress-bar-info");
							$('.xt-result .prog_out').attr("class", "progress progress-bar-success");
							//进度条 E
							$(".xt-result .result-title").html("导出完成！");

							//取消请求进度条接口
							clearInterval(setIntervalId);

							if (msg.length > 0) {
								$("button").attr("disabled", true);
								$(".xt-result .result-infor").html("导出结果加载完成！");

							}
						}
					}

				})
			},
			seedValue: function () {
				//当前时间加随机6位数组合成一个随机数
				// 随机6位数
				var Atanisi = Math.floor(Math.random() * 999999);
				console.log(Atanisi);
				// 随机6位数
				//时间
				var myDate = new Date();
				var tY = myDate.getFullYear(); //年
				var tM = myDate.getMonth() + 1; //月
				if (tM >= 1 && tM <= 9) {
					tM = "0" + tM;
				} else {
					tM = tM.toString();
				}
				var tD = myDate.getDate(); //日
				if (tD >= 1 && tD <= 9) {
					tD = "0" + tD;
				} else {
					tD = tD.toString();
				}
				var tH = myDate.getHours(); //时
				if (tH >= 1 && tH <= 9) {
					tH = "0" + tH;
				} else {
					tH = tH.toString();
				}
				var tm = myDate.getMinutes(); //分
				if (tm >= 1 && tm <= 9) {
					tm = "0" + tm;
				} else {
					tm = tm.toString();
				}
				var tS = myDate.getSeconds(); //秒
				if (tS >= 1 && tS <= 9) {
					tS = "0" + tS;
				} else {
					tS = tS.toString();
				}
				//组合的随机数
				var CrDate = tY.toString() + tM + tD + tH + tm + tS + Atanisi;
				return CrDate;
			},
			//初始化页面
			initPage: function () {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//btn底栏宽度控制
				var w = $(".workspace").width();
				$(".export-btns").width(w - 6);
				$("#files-vou").hide();
				page.initAgency();
				page.getAgencyTree();
				page.initAcct();
				page.getAcct();
				//初始化上传控件
				page.initUpLoad();
				page.initUpLoadexport();
				//请求单位级基础资料树
				page.getAccItemTreeAgency();
				//请求系统级基础资料树
				page.getAccItemTreeXt();
				//计算左侧的树的高度
				var H = $(".workspace").height();
				var newH = H - 46 - 33 - 10;
				var itemH = newH / 2 - 40;
				var xH = itemH - 26;
				var agencyH = itemH + 15;
				$(".xt-tree").height(xH);
				$(".agency-tree").height(agencyH);
				$(".export-result-outter").height(newH - 48)
			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				// $(document).on("mouseover", ".view-msg", function (e) {
				// 	e.stopPropagation();
				// 	$(this).next(".msg-triangle").show();
				// 	$(this).closest(".result-item").find(".msg-detail").show();
				// });
				// $(document).on("mouseout", ".view-msg", function (e) {
				// 	e.stopPropagation();
				// 	$(this).next(".msg-triangle").hide();
				// 	$(this).closest(".result-item").find(".msg-detail").hide();
				// });
				$(document).on('click','.view-msg',function(e){
					// console.log(page.uploadError);
					if(page.uploadError){
						if($(this).attr('clstitle')!=undefined){
							page.uploadError = $(this).attr('clstitle')
						}
						ufma.open({
							url: 'uploadError.html',
							title: '详细原因',
							width: 720,
							data: {
								action: 'errmsg',
								data: page.uploadError
							},
							ondestory: function (data) {
	
							}
						});
					}
				});
				$(".nav-tabs").on("click", "li", function () {
					if ($(this).hasClass("active")) {
						if ($(this).attr("index") != "0") {
							$("#files-export").hide();
							$('.export-btns').hide()
						}else{
							$('.export-btns').show()
							$("#files-export").show();
						}
						if ($(this).attr("index") != "2") {
							$("#files-vou").hide();
						}else{
							$('.export-btns').hide()
							$("#files-vou").show();
						}
						if($(this).attr("index") == 1 || $(this).attr("index") == 3){
							$('.export-btns').hide()
							$(".file-preview").css({
								"border": "1px solid #d9d9d9"
							});
						}
						$('.fileinput-remove-button').trigger("click");
						$(".upload-result .result-con").html("");
						$(".upload-result").addClass("hidden");
						$(".datas").html("");
						var num = $(this).index();
						$(".tab-content-box .content").eq(num).fadeIn();
						$(".tab-content-box .content").eq(num).siblings(".content").fadeOut();
					}
				});
				//导入文件上传完成之后的事件
				$("#txt_file").on("fileuploaded", function (event, data, previewId, index) {
					// $("#myModal").modal("hide");
					// var data = data.response.lstOrderImport;
					// if (data == undefined) {
					//     toastr.error('文件格式类型不正确');
					//     return;
					// }
					// //1.初始化表格
					// var oTable = new TableInit();
					// oTable.Init(data);
					// $("#div_startimport").show();
				});
				//重置
				$('#txt_file').on('filereset', function (event) {
					var timeId = setTimeout(function () {
						$(".file-drop-zone-title").html('<span class="glyphicon icon-upload-lg"></span><p>拖拽文件到这里</p>');
						clearTimeout(timeId);
					}, 100)

				});
				//按钮移除后触发
				$('#txt_file').on('filecleared', function (event) {
					var timeId = setTimeout(function () {
						$(".file-drop-zone-title").html('<span class="glyphicon icon-upload-lg"></span><p>拖拽文件到这里</p>');
						clearTimeout(timeId);
					}, 100)
				});
				//图片右上角的X移除
				$('#txt_file').on('fileclear', function (event) {
					var timeId = setTimeout(function () {
						$(".file-drop-zone-title").html('<span class="glyphicon icon-upload-lg"></span><p>拖拽文件到这里</p>');
						clearTimeout(timeId);
					}, 100)
				});
				//导出
				$("#files-export").on("click", function () {
					//锚点
					// $("#a01")[0].scrollIntoView();

					var seed = page.seedValue();
					var argus = {
						seed: seed,
						exportList: []
					};

					//系统级辅助项树
					var treeObj = $.fn.zTree.getZTreeObj("baseTreeXt");
					if (!treeObj) {
						ufma.showTip("系统级下无辅助核算项", function () {

						}, "warning");
						return false;
					}

					var checkedNodes = treeObj.getCheckedNodes(true);
					if (checkedNodes.length > 0) {
						var obj = {
							agencyCode: "*",
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							eleCodes: []
						};
						for (var i = 0; i < checkedNodes.length; i++) {
							if (checkedNodes[i].pId != null) {
								obj.eleCodes.push(checkedNodes[i].id);
							}
						}
						argus.exportList.push(obj);
					}

					var treeObj2 = $.fn.zTree.getZTreeObj("baseTreeAgency");
					if (!treeObj2) {
						ufma.showTip("单位级下无辅助核算项", function () {

						}, "warning");
						return false;
					}

					//单位级辅助项树
					var checkedNodes2 = treeObj2.getCheckedNodes(true);
					if (checkedNodes2.length > 0) {
						var agencyArr = [],
							noPidArr = [];

						for (var i = 0; i < checkedNodes2.length; i++) {
							if (checkedNodes2[i].isLeaf == 1) {
								var argu = {
									agencyCode: checkedNodes2[i].id,
									setYear: ptData.svSetYear,
									rgCode: ptData.svRgCode,
									eleCodes: []
								};
								agencyArr.push(argu);
							} else {
								noPidArr.push(checkedNodes2[i]);
							}
						}
						for (var y = 0; y < agencyArr.length; y++) {
							for (var z = 0; z < noPidArr.length; z++) {
								if (noPidArr[z].pId == agencyArr[y].agencyCode) {
									agencyArr[y].eleCodes.push(noPidArr[z].id);
								}
							}
							argus.exportList.push(agencyArr[y]);
						}
					}

					//校验
					if (argus.exportList.length == 0) {
						ufma.showTip("请至少选择一项辅助项");
						return false;
					}

					//
					// var html = '<div class="result-title">正在导出...</div>' +
					// 	'<div class="prog_out progress progress-striped active">' +
					// 	'<div class="prog_in progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">' +
					// 	'<span class="proglabel">正在导出......</span>' +
					// 	'</div>' +
					// 	'</div>' +
					// 	'<div class="show-result-part"></div>';
					// $(".xt-result").html(html);
					// //进度条 S
					// $('.xt-result .prog_in').width('0%');
					// $(".xt-result .proglabel").html("0%");
					//进度条 E

					// $(".xt-result").append('<div class="result-infor" style="margin-bottom: 10px">正在加载导出结果,请耐心等待...</div><div class="show-result"></div>');
					//请求导出接口
					ufma.showloading('正在加载导出结果,请耐心等待...');
					ufma.post(interfaceURL.exportBasicDataXml, argus, function (result) {
						//执行导出
						ufma.hideloading()
						var url = interfaceURL.exportFile + "?path=" + encodeURIComponent(result.data);
						window.location.href = url;
						ufma.showTip(result.msg, function () {}, result.flag);
					});
					// setIntervalId = setInterval(function () {
					// 	//请求查询进度条接口
					// 	page.exportProgress(seed);
					// }, 1000)
				});
				$("#checkall").on('change',function(){
					if($(this).is(":checked")){
						$(".checkdan").attr('checked',true).prop("chekced",true)
					}else{
						$(".checkdan").attr('checked',false).prop("chekced",false)
					}
				})
				$("#files-vou").on('click',function(){
					var k = []
					for(var i=0;i<$(".checkdan").length;i++){
						if($(".checkdan").eq(i).is(":checked")){
							k.push($(".checkdan").eq(i).attr("value"))
						}
					}
					if(k.length==0){
						ufma.showTip("请至少选择一个期间导出")
						return false
					}
					var argus = {
						'agencyCode': nowAgencyCode,
						'acctCode': nowAcctCode,
						'setYear': ptData.svSetYear,
						'rgCode': ptData.svRgCode,
						'fisPerds':k.join()
					}
					ufma.showloading('正在加载导出结果,请耐心等待...');
					ufma.get('/lp/FinlDataInterface/exportVouInfo', argus, function (result) {
						//执行导出
						ufma.hideloading()
						var url = "/lp/FinlDataInterface/exportVouFile" + "?path=" + result.path;
						console.log(url)
						window.location.href = url;
						ufma.showTip(result.msg, function () {}, result.flag);
						for(var i=0;i<result.data.length;i++){
							$('.datas[item="'+result.data[i].fisPerd+'"]').html(result.data[i].result)
						}
					});
					// window.location.href = "/lp/FinlDataInterface/exportVou?setYear=" + ptData.svSetYear + '&rgCode=' + ptData.svRgCode + '&agencyCode=' + nowAgencyCode + '&acctCode=' + nowAcctCode;
					// ufma.hideloading();
				})
				$("#key").on("input", function () {
					var _keywords = $(this).val();
					searchNodeLazy(_keywords);
				})
			},
			//此方法必须保留
			init: function () {
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();

	page.init();
	// 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
	var timeoutId = null;

	function searchNodeLazy(_keywords) {
		var zTreeObj = $.fn.zTree.getZTreeObj("baseTreeAgency");
		if (!zTreeObj) {
			// alter("获取树对象失败");
			return false;
		}
		if (timeoutId) { //如果不为空,结束任务
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(function () {
			var nodes = zTreeObj.getNodesByParamFuzzy("codeName", _keywords, null);
			var fitedNode = [];
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].codeName.indexOf(_keywords) == 0 && nodes[i].isLeaf == "1") {
					fitedNode.push(nodes[i]);
				}
			}
			if (fitedNode.length > 0) {
				zTreeObj.selectNode(fitedNode[0]);
			}
			// $("#searchText").focus();//输入框重新获取焦点
		}, 300);
	};
});
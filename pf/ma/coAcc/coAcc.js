$(function() {
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
		var r = window.location.search.substr(1).match(reg); //匹配目标参数 
		if(r != null)
			return unescape(r[2]);
		return null; //返回参数值 
	}
	var page = function() {
		var setYear;
		var rgCode;
		//检索数据的条件对象
		var searchObj = {};
		var fromChrCodesd = getUrlParam("chrCode")
		if(fromChrCodesd != null) {
			searchObj = {
				agencyCode: "*",
				accsCode: fromChrCodesd,
				enabled: "*",
				currentPage: 1,
				pageSize: 25
			}
		} else {
			searchObj = {
				agencyCode: "*",
				accsCode: "*",
				enabled: "*",
				currentPage: 1,
				pageSize: 25
			}
		}
		var updatedata = {
			angery: '',
			acct: ''
		}
		var caChrId;
		var caObj;
		return {
			//$.ajax()，加载科目体系按钮
			initEleAcc: function(result) {
				var data = result.data;
				page.accsData = data;
				//创建全部节点并添加节点
				if(fromChrCodesd == null) {
					var $allOp = $('<a name="acc" value="*" class="label label-radio selected">全部</a>');
					$(".caEleAcc .control-element").append($allOp);
					//循环创建科目体系按钮
					for(var i = 0; i < data.length; i++) {
						//bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
						var $accA = $('<a name="acc" value=' + data[i].code + ' class="label label-radio" data-accsType=' + data[i].diffAgencyType + '>' + data[i].name + '</a>');
						$(".caEleAcc .control-element").append($accA);
						//注意，多于四个的时候，显示更多按钮，过多按钮下方隐藏(需要添加)
					}
				} else {
					var $allOp = $('<a name="acc" value="*" class="label label-radio ">全部</a>');
					$(".caEleAcc .control-element").append($allOp);
					//循环创建科目体系按钮
					for(var i = 0; i < data.length; i++) {
						//bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
						if(data[i].code == fromChrCodesd) {
							var $accA = $('<a name="acc" value=' + data[i].code + ' class="label label-radio selected" data-accsType=' + data[i].diffAgencyType + '>' + data[i].name + '</a>');
							$(".caEleAcc .control-element").append($accA);
						} else {
							var $accA = $('<a name="acc" value=' + data[i].code + ' class="label label-radio" data-accsType=' + data[i].diffAgencyType + '>' + data[i].name + '</a>');
							$(".caEleAcc .control-element").append($accA);
						}
						//注意，多于四个的时候，显示更多按钮，过多按钮下方隐藏(需要添加)
					}
				}

			},
 
			initAgency: function(result) {
				var data = result.data;
				var all = {
					"id": "*",
					"pId": "0",
					"codeName": "所有单位",
					"agencyType": "0"
				};
				data.unshift(all);
				page.caAgency = $("#caAgency").ufmaTreecombox({
					valueField: 'id',
					textField: 'codeName',
					readOnly: false,
					leafRequire: false,
					popupWidth: 1.5,
					data: data,
					onchange: function(data) {
						searchObj.agencyCode = page.caAgency.getValue();
						$("#coAccTable tbody").html("");
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
					}
				});
				page.caAgency.setValue("*", "所有单位");
			},

			//$.ajax()，根据单位和科目体系，加载表格数据
			initCoAccTable: function(result) {
				var list = result.data.list;
				var paging = result.data.page;

				//判断获取到数据接口，并且有想要的数据
				if(list != null && list.length > 0) {
					$("#coAccTable tbody").html('');

					//创建计算账套数的变量
					var accaSum = 0;

					//循环创建账套（以单位分组）
					for(var i = 0; i < list.length; i++) {
						if(!$("body").attr("datacode")) {
							//创建单位节点，并填入tbody
							var $caAgency = $('<tr class="caGroup"><td colspan="9">' +
								'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
								'<input type="checkbox" class="caCheckGroup"/>&nbsp;<span></span>' +
								'</label>' +
								'<span class="caGroupName">' + list[i].agencyCode + ' ' + list[i].agencyName + '</span>' +
								'</td></tr>');
							$("#coAccTable tbody").append($caAgency);

						}

						//循环创建该单位下的账套，并填入tbody
						for(var j = 0; j < list[i].eleAccts.length; j++) {
							var $caAcct;
							if(list[i].agencyCode == updatedata.angery && list[i].eleAccts[j].chrCode == updatedata.acct) {
								$caAcct = $('<tr data-cag=' + i + ' class="selected">' +
									'<td class="ca-check-style"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
									'<input type="checkbox" checked="true" value="' + list[i].eleAccts[j].chrCode + '" name="checkList" />&nbsp;<span></span></label></td>' +
									'<td style="display: none;">' +
									'<input type="hidden" name="chrId" id="" value="' + list[i].eleAccts[j].chrId + '" data-setyear="' + list[i].eleAccts[j].setYear + '" data-rgcode="' + list[i].eleAccts[j].rgCode + '" data-chrcode="' + list[i].eleAccts[j].chrCode + '" data-agencycode="' + list[i].agencyCode + '" data-accsname="' + list[i].eleAccts[j].accsName + '" data-agencyname="' + list[i].agencyName + '" data-fileader="' + list[i].eleAccts[j].fiLeader + '" data-enabled="' + list[i].eleAccts[j].enabled + '" data-carryovertype="' + list[i].eleAccts[j].carryOverType + '" data-isparallel="' + list[i].eleAccts[j].isParallel + '" data-accs="' + list[i].eleAccts[j].accsCode + '" /></td>' +
									'<td>' + list[i].eleAccts[j].chrCode + '</td><td><a class="common-jump-link caEdit" href="javascript:;">' + list[i].eleAccts[j].chrName + '</a></td><td>' + ufma.parseNull(list[i].eleAccts[j].accsName) + '</td>' +
									'<td>' + list[i].eleAccts[j].accoCount + '</td></tr>');
							} else {
								$caAcct = $('<tr data-cag=' + i + '>' +
									'<td class="ca-check-style"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
									'<input type="checkbox" value="' + list[i].eleAccts[j].chrCode + '" name="checkList" />&nbsp;<span></span></label></td>' +
									'<td style="display: none;">' +
									'<input type="hidden" name="chrId" id="" value="' + list[i].eleAccts[j].chrId + '" data-setyear="' + list[i].eleAccts[j].setYear + '" data-rgcode="' + list[i].eleAccts[j].rgCode + '" data-chrcode="' + list[i].eleAccts[j].chrCode + '" data-agencycode="' + list[i].agencyCode + '" data-accsname="' + list[i].eleAccts[j].accsName + '" data-agencyname="' + list[i].agencyName + '" data-fileader="' + list[i].eleAccts[j].fiLeader + '" data-enabled="' + list[i].eleAccts[j].enabled + '" data-carryovertype="' + list[i].eleAccts[j].carryOverType + '" data-isparallel="' + list[i].eleAccts[j].isParallel + '" data-accs="' + list[i].eleAccts[j].accsCode + '" /></td>' +
									'<td>' + list[i].eleAccts[j].chrCode + '</td><td><a class="common-jump-link caEdit" href="javascript:;">' + list[i].eleAccts[j].chrName + '</a></td><td>' + ufma.parseNull(list[i].eleAccts[j].accsName) + '</td>' +
									'<td>' + list[i].eleAccts[j].accoCount + '</td></tr>');
							}
						 		//结账期间为0时显示“尚未结账”
							var $fisPerd;
							if(list[i].eleAccts[j].fisPerd == "0") {
								$fisPerd = $('<td>尚未结账</td>');
							} else {
								$fisPerd = $('<td>第&nbsp;' + list[i].eleAccts[j].fisPerd + '&nbsp;期间</td>');
							}
							$caAcct.append($fisPerd);

							//启用停用和操作节点（判断list[i].eleAccts[j].enabled：1，启用；0，停用）
							var $caEnable;
							switch(list[i].eleAccts[j].enabled) {
								case 1:
									$caEnable = $('<td class="ca-enable-style enable">启用</td>' +
										'<td class="ca-action-style enable">' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" action= "" title="启用" hidden><span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" action= "" title="停用"><span class="glyphicon icon-ban"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "" title="删除"><span class="glyphicon icon-trash"></span></a></td>');
									break;
								case 0:
									$caEnable = $('<td class="ca-enable-style disable">停用</td>' +
										'<td class="ca-action-style disable">' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" action= "" title="启用"><span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" action= "" title="停用" hidden><span class="glyphicon icon-ban"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "" title="删除"><span class="glyphicon icon-trash"></span></a></td>');
									break;
							}
							$caAcct.append($caEnable);
							$("#coAccTable tbody").append($caAcct);

						}

						//渲染表格背景颜色
						//表格单位背景白色
						$("#coAcc").find("tr.caGroup").css({
							"background-color": "#ffffff"
						});
						//表格账套背景分颜色
						$("#coAcc").find("tr[data-cag]:odd").css({
							"background-color": "#f9f9f9"
						});
						$("#coAcc").find("tr[data-cag]:even").css({
							"background-color": "#ffffff"
						});

						//计算多少条账套
						accaSum = accaSum + list[i].eleAccts.length;
					}

					//按钮提示
					$("[data-toggle='tooltip']").tooltip();
					$("#coAccTable .btn-delete").on("click", function() {
						page._self = $(this);
					});
					$('#coAccTable .btn-delete').ufTooltip({
						content: '您确定删除当前账套吗？',
						onYes: function() {
							page.caActOne("/ma/sys/eleCoacc/delete", $(page._self), "delete");
						},
						onNo: function() {}
					});
					$(".ufma-tool-btns").html('');
					//表格下方工具条
					//定义批量操作按钮节点
					var $moreAct = '<label class="mt-checkbox mt-checkbox-outline margin-right-8" style="margin-bottom: 0;">' +
						'<input class="caTable-toolbar-checkAll" type="checkbox" name="test" value="1"> 全选' +
						'<span></span>' +
						'</label>';
					$moreAct += '<button id="ca-delete-more" type="button" class="btn btn-sm btn-default btn-permission btn-downto btn-delete">删除</button>';
					$(".ufma-tool-btns").append($moreAct);

					//分页功能（判断：分页，创建分页组件；不分页，不创建）
					if(paging.pageSize != 0) {
						$('.tablePage').html('');
						//创建基本分页节点
						var $pageBase = $('<ul id="caTable-pagination" class="pagination pagination-sm pull-left tablePage"></ul>');
						//创建上一页节点  根据当前也判断是否可以点
						var $pagePrev;
						if((paging.currentPage - 1) == 0) {
							$pagePrev = $('<li class="caPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
						} else {
							$pagePrev = $('<li class="caPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.currentPage - 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' +
								'</a></li>');
						}
						$pageBase.append($pagePrev);
						//创建页数节点,根据pageSize和凭证数据总数
						//创建页数变量
						var pageAmount = Math.ceil(paging.totalRows / paging.pageSize);
						var $pageItem;
						for(var k = 1; k <= pageAmount; k++) {
							//第一页和最后一页显示
							if(k == 1 || k == pageAmount) {
								//三元运算判断是否当前页
								$pageItem = (k == paging.currentPage) ? $('<li class="caNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="caNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
							} else {
								//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
								if((pageAmount - 2) <= 3) {
									//三元运算判断是否当前页
									$pageItem = (k == paging.currentPage) ? $('<li class="caNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="caNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
								} else if((pageAmount - 2) > 3) {
									//判断当前页位置
									if(paging.currentPage <= 2) {
										//分页按钮加载2到4之间
										if(k >= 2 && k <= 4) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="caNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="caNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage > 2 && paging.currentPage < (pageAmount - 1)) {
										//分页按钮加载currentPage-1到currentPage+1之间
										if(k >= (paging.currentPage - 1) && k <= (paging.currentPage + 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="caNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="caNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage >= (pageAmount - 1)) {
										//分页按钮加载pageAmount-3到pageAmount-1之间
										if(k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="caNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="caNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									}
								}
							}
							$pageBase.append($pageItem);
						}
						//创建下一页节点 根据当前页判断是否可以点
						var $pageNext;
						if((pageAmount - paging.currentPage) == 0) {
							$pageNext = $('<li class="caNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
						} else {
							$pageNext = $('<li class="caNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.currentPage + 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
								'</a></li>');
						}
						$pageBase.append($pageNext);
						$("#coAcc .ufma-table-paginate").append($pageBase);
					}

					//创建分页大小基本节点
					var $pageSizeBase = $('<div class="pull-left tablePage" style="margin: 0 16px;"></div>');
					var $pageSel = $('<select style="padding-left:8px" class="caPageSize bordered-input"></select>');
					//根据pageSize创建下拉列表
					//分页数组
					var pageArr = [25, 50, 75, 100, 100000];
					var $pageOp;
					//定义是否不分页变量
					var isNoPaging;
					for(var n = 0; n < pageArr.length; n++) {
						isNoPaging = (pageArr[n] == 100000) ? "全部" : pageArr[n];
						if(pageArr[n] == paging.pageSize) {
							$pageOp = $('<option  value= ' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
						} else {
							$pageOp = $('<option value= ' + pageArr[n] + '>' + isNoPaging + '</option>');
						}
						$pageSel.append($pageOp);
					}
					$pageSizeBase.append("<span>每页 </span>");
					$pageSizeBase.append($pageSel);
					// $pageSizeBase.append("<span> 项</span>");
					$pageSizeBase.append("<span> 个单位</span>");
					$("#coAcc .ufma-table-paginate").prepend($pageSizeBase);

					//创建总数统计节点
					// var $dataSum = $('<div class="pull-left">共'+paging.totalRows+'项</div>');
					var $dataSum = $('<div class="pull-left tablePage">共' + paging.totalRows + '个单位</div>');
					$("#coAcc .ufma-table-paginate").prepend($dataSum);

					 
					$("#coAccTable input#caCheckAll").prop("checked", false);
					$("#caTable-tool-bar input.caTable-toolbar-checkAll").prop("checked", false);
					$("#coAccTable input#caCheckAll").prop("disabled", false);
					$("#caTable-tool-bar input.caTable-toolbar-checkAll").prop("disabled", false);

				} else {
					$("#coAccTable tbody").html('');
					$("#coAccTable input#caCheckAll").prop("checked", false);
					$("#caTable-tool-bar input.caTable-toolbar-checkAll").prop("checked", false);
					$("#coAccTable input#caCheckAll").prop("disabled", true);
					$("#caTable-tool-bar input.caTable-toolbar-checkAll").prop("disabled", true);
					var $empty = $('<tr><td class="dataTables_empty" valign="top" colspan="9">' +
						'<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>' +
						'</td></tr>');
					$("#coAccTable tbody").append($empty);
				}

				//判断系统级还是单位级
				if($("#cbAgency").get(0)) {
					//单位级
					$("#coAcc").find(".ufma-tool-btns").remove();
					$("#coAcc").find(".caCheckGroup").parent().remove();
					$("#coAcc").find(".caGroupName").css({
						"margin-left": "0"
					});
					$("#coAcc").find(".ca-check-style").remove();
					$("#coAcc").find(".ca-action-style").remove();
				}
				// ufma.parseScroll();
				ufma.isShow(page.reslist);
				updatedata.angery = ''
				updatedata.acct = ''

				$("#coAccTable").tblcolResizable();
				//固定表头
				$("#coAccTable").fixedTableHead($("#outDiv"));
			},

			//单行操作
			caActOne: function(url, dom, type, action) {
				//传输chrId
				switch(type) {
					case "post":
						//获得该点击的账套的chrId
						caChrCode = $(dom).parents("tr").find("input[name='checkList']").val();
						caAgencyCode = $(dom).parents("tr").find("input[type='hidden']").attr('data-agencycode');
						var caCallback = function(result) {
							//返回操作信息
							ufma.showTip(result.msg, function() {}, result.flag);

							//清空表格原有数据
							$("#coAccTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");

							//重新加载表格
							ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);

						}
						var argu = {
							rgCode: page.rgCode,
							setYear: page.setYear,
							action: action,
							chrCodes: [caChrCode],
							agencyCode: caAgencyCode
						};
						ufma.put(url, argu, caCallback);
						break;

					case "delete":
						caChrCode = $(dom).parents("tr").find("input[name='checkList']").val();
						caAgencyCode = $(dom).parents("tr").find("input[type='hidden']").attr('data-agencycode');
						var caCallback = function(result) {
							//返回操作信息
							ufma.showTip(result.msg, function() {}, result.flag);

							//清空表格原有数据
							$("#coAccTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");

							//重新加载表格
							ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);

						}
						var arr = [{
							chrCodes: [caChrCode],
							agencyCode: caAgencyCode
						}]
						var dData = {
							"rgCode": page.rgCode,
							"setYear": page.setYear,
							"paramList": arr
						}
						//	var dData = { deleteAcct: arr }
						ufma.delete(url, dData, caCallback);
						break;
				}
				$("#caCheckAll").prop("checked", false);
			},

			//通用检索方法
			searchData: function() {
				searchObj.agencyCode = page.caAgency.getValue();
				searchObj.accsCode = $("#coAcc .caEleAcc a.selected").attr("value");
				searchObj.enabled = $("#coAcc .caEnable a.selected").attr("value");

				//分页判断分页大小元素存在时，重新赋值(数据未加载的时候分页大小元素不存在，避免因此自动变成不分页)
				if($(".ufma-table-paginate").find(".caPageSize").length != 0) {
					searchObj.pageSize = $(".ufma-table-paginate").find(".caPageSize").val();
					if($(".ufma-table-paginate").find(".caPageSize").val() == 0) {
						searchObj.currentPage = 0;
					} else {
						searchObj.currentPage = 1;
					}
				}

				//清空表格原有数据
				$("#coAccTable tbody").html('');
				$(".ufma-tool-btns").html('');
				$(".ufma-table-paginate").html("");

				//重新加载表格
				ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, this.initCoAccTable);
			},

			//初始化页面
			initPage: function() {
				//ufma.parseScroll();
				//获取门户相关数据
				page.svData = ufma.getCommonData();
				page.setYear = parseInt(page.svData.svSetYear);
				page.rgCode = page.svData.svRgCode;
				//初始化页面，加载科目体系按钮
				ufma.get("/ma/sys/common/getEleTree", {
					"setYear": page.setYear,
					"agencyCode": '*',
					"rgCode": page.rgCode,
					"eleCode": 'ACCS'
				}, this.initEleAcc);

				//后台获取数据并加载
				if($("#cbAgency").get(0)) {

					//单位级
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						valueField: "id",
						textField: "codeName",
						readonly: false,
						placeholder: "请选择单位",
						icon: "icon-unit",
						onchange: function(data) {
							//改变单位触发事件
							searchObj.agencyCode = page.cbAgency.getValue();

							//清空表格原有数据
							$("#coAccTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");

							//初始化页面，加载表格
							ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
						}
					});
					var argu = {
						rgCode: page.svData.svRgCode,
						setYear: page.svData.svSetYear
					};
					ufma.ajaxDef("/ma/sys/eleAgency/getAgencyTree", "get", argu, function(result) {
						page.cbAgency = $("#cbAgency").ufmaTreecombox2({
							data: result.data,
						});
						var agyCode = $.inArrayJson(result.data, "id", page.svData.svAgencyCode);
						if(agyCode != undefined) {
							page.cbAgency.val(page.svData.svAgencyCode);
						} else {
							page.cbAgency.val(result.data[0].id);
						}
					});
				} else {
					//系统级
					//初始化页面，加载单位下拉
					var argu = {
						rgCode: page.svData.svRgCode,
						setYear: page.svData.svSetYear
					};
					ufma.get("/ma/sys/eleAgency/getAgencyTree", argu, this.initAgency);
 
				}

			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() {
				//this.onBtnaddClick();

				//批量账套导入
				$("#importAcct").on("click", function() {
					ufma.open({
						title: '账套导入',
						url: 'importExcel.html',
						width: 1100,
						data: {
							rgCode: page.rgCode,
							setYear: page.setYear,
						},
						ondestory: function(rst) {
							ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
						}
					});

				});
				//点击账套名称变更账套信息
				$("#coAcc #coAccTable").on("click", ".caEdit", function() {
					//传输数据
					var setPostData = {};
					if($("#cbAgency").get(0)) {
						//单位级
						setPostData.lType = "unit";
					} else {
						//系统级
						setPostData.lType = "system";
					}
					setPostData.chrId = $(this).parents("tr").find("input[name='chrId']").val();
					setPostData.agencyCode = $(this).parents("tr").find("input[name='chrId']").attr("data-agencycode");
					setPostData.agencyName = $(this).parents("tr").find("input[name='chrId']").attr("data-agencyname");
					setPostData.chrCode = $(this).parents("tr").find("input[name='chrId']").attr("data-chrcode");
					setPostData.chrName = $(this).parents("tr").find(".caEdit").text();
					setPostData.accsCode = $(this).parents("tr").find("input[name='chrId']").attr("data-accs");
					setPostData.accsName = $(this).parents("tr").find("input[name='chrId']").attr("data-accsname");
					setPostData.enabled = $(this).parents("tr").find("input[name='chrId']").attr("data-enabled");
					setPostData.fiLeader = $(this).parents("tr").find("input[name='chrId']").attr("data-fileader");
					setPostData.carryOverType = $(this).parents("tr").find("input[name='chrId']").attr("data-carryovertype");
					setPostData.isParallel = $(this).parents("tr").find("input[name='chrId']").attr("data-isparallel");
					setPostData.setYear = $(this).parents("tr").find("input[name='chrId']").attr("data-setyear");
					setPostData.rgCode = $(this).parents("tr").find("input[name='chrId']").attr("data-rgcode");
					setPostData.accsCodeType = page.accsCodeType;
					setPostData.accsData = page.accsData;
					ufma.open({
						url: 'coAccEdit.html',
						title: '编辑',
						width: 1100,
						height: 550,
						data: {
							action: 'edit',
							data: setPostData
						},
						ondestory: function(data) {
							//窗口关闭时回传的值
							if(data.action == 'save') {
								if(data.msg != undefined) {
									ufma.showTip(data.msg, function() {}, "success");
								}
								//清空表格原有数据
								$("#coAccTable tbody").html('');
								$(".ufma-tool-btns").html('');
								$(".ufma-table-paginate").html("");

								ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
							};
						}
					});
				});

				//点击新增弹出新增页面
				$("#coAcc #btn-add").on("click", function() {
					ufma.open({
						url: 'coAccEdit.html',
						title: '新增',
						width: 1100,
						height: 550,
						data: {
							'action': 'add'
						},
						ondestory: function(data) {
							//窗口关闭时回传的值
							if(data == 'save') {
								 
								//清空表格原有数据
								$("#coAccTable tbody").html('');
								$(".ufma-tool-btns").html('');
								$(".ufma-table-paginate").html("");

								ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
							};
						}
					});
				});
				$("#coAcc #btn-adds").on("click", function() {
					ufma.open({
						url: 'buildingGuide.html',
						title: '新增',
						width: 1100,
						height: 600,
						data: {
							'action': 'add',
							'setYear': page.setYear,
							'rgCode': page.rgCode,
							'accsCodeType': page.accsCodeType
						}, //bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
						ondestory: function(data) {
							//窗口关闭时回传的值
							if (data.action != undefined) {
								if (data.action.action == 'save') {
									$("#coAccTable tbody").html('');
									$(".ufma-tool-btns").html('');
									$(".ufma-table-paginate").html("");
									updatedata = data.action
									ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
								}
							} else {
								// CZSB-3060 新增账套最后一步选择继续添加后，点击取消/右上角叉号按钮，刚新增的账套没有刷新 guohx 20200831
								ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
							}

						}
					});
				});

				//点击科目体系按钮
				$("#coAcc .caEleAcc").on("click", "a[name='acc']", function() {
					$("#coAcc .caEleAcc a[name='acc']").removeClass("selected");
					$(this).addClass("selected");
					searchObj.accsCode = $(this).attr("value");
					//bug82114--科目体系为社保时新增界面不能出现单位类型下拉框--zsj
					page.accsCodeType = $(this).attr("data-accsType"); //bug82114 --科目体系设置区分适用单位为否时隐藏单位 类型--zsj
					$("#coAccTable tbody").html("");
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					searchObj.currentPage = "1";
					ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
				});

				//点击状态按钮
				$("#coAcc .caEnable").on("click", "a[name='enabled']", function() {
					$("#coAcc .caEnable a[name='enabled']").removeClass("selected");
					$(this).addClass("selected");

					searchObj.enabled = $(this).attr("value");
					$("#coAccTable tbody").html("");
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					searchObj.currentPage = "1";
					ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
				});
 
				//checkbox全选
				$("#coAcc").on("click", "#caCheckAll,.caTable-toolbar-checkAll", function() {
					if($(this).prop("checked") === true) {
						$("#caCheckAll,.caTable-toolbar-checkAll").prop("checked", $(this).prop("checked"));
						$("#coAccTable").find(".caCheckGroup").prop("checked", $(this).prop("checked"));
						$("#coAccTable").find("input[name='checkList']").prop("checked", $(this).prop("checked"));
						$("#coAccTable").find("tbody tr").addClass("selected");
					} else {
						$("#caCheckAll,.caTable-toolbar-checkAll").prop("checked", false);
						$("#coAccTable").find(".caCheckGroup").prop("checked", false);
						$("#coAccTable").find("input[name='checkList']").prop("checked", false);
						$("#coAccTable").find("tbody tr").removeClass("selected");
					}
				});

				//选中单条账套数据
				$("#coAccTable").find("tbody").on("click", 'tr input[name="checkList"]', function() {
					var cag = $(this).parents("tr").attr("data-cag");
					var $tr = $(this).parents("tr");
					$tr.toggleClass("selected");
					var isGroupCheck = ($("#coAccTable tbody tr[data-cag=" + cag + "].selected").length == $("#coAccTable tbody tr[data-cag=" + cag + "]").length) ? true : false;
					$("#coAccTable tbody tr.caGroup").eq(cag).find(".caCheckGroup").prop("checked", isGroupCheck);
					if(isGroupCheck) {
						$("#coAccTable tbody tr.caGroup").eq(cag).addClass("selected");
					} else {
						$("#coAccTable tbody tr.caGroup").eq(cag).removeClass("selected");
					}
					var $tmp = $("[name=checkList]:checkbox");
					$("#caCheckAll,.caTable-toolbar-checkAll").prop("checked", $tmp.length == $tmp.filter(":checked").length);
				});

				//分组选择
				$("#coAccTable").find("tbody").on("click", "tr.caGroup .caCheckGroup", function() {
					var $tr = $(this).parents("tr.caGroup");
					$tr.toggleClass("selected");
					/*					var cag = $(this).parents("#tr.caGroup").index();
										$("#coAccTable tbody tr[data-cag="+cag+"]").toggleClass("selected").find('input[name="checkList"]').prop("checked", $(this).prop("checked"));*/
					if($tr.hasClass("selected")) {
						$tr.nextUntil("tr.caGroup").addClass("selected");
					} else {
						$tr.nextUntil("tr.caGroup").removeClass("selected");
					}
					$tr.nextUntil("tr.caGroup").find('input[name="checkList"]').prop("checked", $(this).prop("checked"));
					var $tmp = $("[name=checkList]:checkbox");
					$("#caCheckAll,.caTable-toolbar-checkAll").prop("checked", $tmp.length == $tmp.filter(":checked").length);
				});

				//批量删除
				$("#caTable-tool-bar").on("click", "#ca-delete-more", function() {
					if($("#coAccTable").find("tr[data-cag].selected").length != 0) {
						//询问是否删除
						ufma.confirm("确定删除选中的账套吗？", function(action) {
							if(action) {
								var arr = [];
								for(var i = 0; i < $("#coAccTable tr.caGroup").length; i++) {
									if($("#coAccTable").find("tr[data-cag='" + i + "'].selected").get(0)) {
										var one = {};
										one.agencyCode = $("#coAccTable").find("tr[data-cag='" + i + "'].selected").eq(0).find("input[type='hidden']").attr('data-agencycode');
										one.chrCodes = [];
										$("#coAccTable").find("tr[data-cag='" + i + "'].selected").each(function() {
											var chrCode = $(this).find("input[name='checkList']").val();
											one.chrCodes.push(chrCode);
										});
										arr.push(one);
									}
								}
								var dData = {
									"rgCode": page.rgCode,
									"setYear": page.setYear,
									"paramList": arr
								}
								var caCallback = function(result) {
									//返回操作信息
									//									ufma.alert(result.msg);
									ufma.showTip(result.msg, function() {}, result.flag)
									//清空表格原有数据
									$("#coAccTable tbody").html('');
									$(".ufma-tool-btns").html('');
									$(".ufma-table-paginate").html("");
									//重新加载表格
									searchObj.currentPage = "1";
									ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
								}
								ufma.delete("/ma/sys/eleCoacc/delete", dData, caCallback);
								$("#caCheckAll").prop("checked", false);
							}
						});
					} else {
						ufma.alert("请勾选您要删除的账套，谢谢！");
					}
				});
 

				//单行启用
				$("#coAccTable").on("click", ".btn-start", function() {
					page.caActOne("/ma/sys/eleCoacc/able", $(this), "post", 'active');
				});

				//单行停用
				$("#coAccTable").on("click", ".btn-stop", function() {
					var t = $(this);
					//询问是否停用revise
					ufma.confirm("停用后单位将无法对该账套进行业务处理，只能进行数据查询，确定停用吗？", function(action) {
						if(action) {
							page.caActOne("/ma/sys/eleCoacc/able", t, "post", 'unactive');
						}
					});
				});

				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".caPageSize", function() {
					searchObj.pageSize = parseInt($(this).val());
					if($(this).val() == "0") {
						//不分页
						searchObj.currentPage = 0;
					} else {
						//分页
						searchObj.currentPage = 1;
					}
					$("#coAccTable tbody").html("");
					$(".ufma-tool-btns").html("");
					$(".ufma-table-paginate").html("");
					ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".caNumPage", function() {
					if($(this).find("a").length != 0) {
						searchObj.currentPage = parseInt($(this).find("a").attr("data-gopage"));
						searchObj.pageSize = parseInt($(".ufma-table-paginate").find(".caPageSize").val());
						$("#coAccTable tbody").html("");
						$(".ufma-tool-btns").html("");
						$(".ufma-table-paginate").html("");
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".caPrevPage", function() {
					if(!$(".ufma-table-paginate .caPrevPage").hasClass("disabled")) {
						searchObj.currentPage = parseInt($(this).find("a").attr("data-prevpage"));
						searchObj.pageSize = parseInt($(".ufma-table-paginate").find(".caPageSize").val());
						$("#coAccTable tbody").html("");
						$(".ufma-tool-btns").html("");
						$(".ufma-table-paginate").html("");
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".caNextPage", function() {
					if(!$(".ufma-table-paginate .caNextPage").hasClass("disabled")) {
						searchObj.currentPage = parseInt($(this).find("a").attr("data-nextpage"));
						searchObj.pageSize = parseInt($(".ufma-table-paginate").find(".caPageSize").val());
						$("#coAccTable tbody").html("");
						$(".ufma-tool-btns").html("");
						$(".ufma-table-paginate").html("");
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
					}
				});

				//跳转页面
				$(".ufma-table-paginate").on("blur", "#caGoPage", function() {
					var val = $(this).val();
					if(!isNaN($("#caGoPage").val()) && $(".ufma-table-paginate #caGoPage").val() <= $(".ufma-table-paginate .caNumPage").length) {
						$(this).val(val);
					} else {
						$(this).val("");
						ufma.alert("请输入正确的页码，谢谢！");
					}
				});
				$(".ufma-table-paginate").on("click", "#ca-go-btn", function() {
					if($(".ufma-table-paginate").find("#caGoPage").val() != "") {
						searchObj.currentPage = parseInt($(".ufma-table-paginate").find("#caGoPage").val());
						searchObj.pageSize = parseInt($(".ufma-table-paginate").find(".caPageSize").val());
						$("#coAccTable tbody").html("");
						$(".ufma-tool-btns").html("");
						$(".ufma-table-paginate").html("");
						ufma.post("/ma/sys/eleCoacc/getCoaccs", searchObj, page.initCoAccTable);
					} else {
						ufma.alert("请输入跳转的页码！");
					}
				});

				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#coAccTable thead ").on("mouseover", function () {
					$("#coAccTable thead").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#coAccTable thead").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#outDiv").scroll(function () {
					$("#coAccTablefixed thead").on("mouseover", function () {
						$("#coAccTablefixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#coAccTablefixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "none")
						})
					});
				});

			},

			//此方法必须保留
			init: function() {

				page.reslist = ufma.getPermission();

				this.initPage();
				// 限制高度，避免出现最外层的y轴滚动条
				setTimeout(function () {
					var centerHeight = $(window).height() - $(".workspace-top").height() - 10 - 40 - 5;
					$('#outDiv').css("height", centerHeight);
					$('#outDiv').css("width", $(".table-sub").width());
					$('#outDiv').css("overflow", "auto");

				}, 500)
				this.onEventListener();
				$('.table-sub-info').text(ma.ctrlName);
				ufma.setPortalHeight();
				// ufma.parseScroll();
				//$('#caTable-tool-bar').pin();
				//this.onBtncloseClick();
			}
		}
	}();

	/////////////////////
	page.init();
});
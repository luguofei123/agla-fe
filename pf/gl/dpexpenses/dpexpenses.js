$(function() {
	//入账设置--凭证模板
    window.openAgy = function(html){
        var comData=ufma.getCommonData()
        var openData = {
            agencyCode: $("#cbAgency").getObj().getValue(),
            acctCode: $("#cbAcct").getObj().getValue(),
            setYear:comData.svSetYear,
            rgCode: comData.svRgCode,
            //isParallel:$("#cbAcct").getObj().getItem().IS_PARALLEL,
            isParallel: $("#cbAcct").getObj().getItem().isParallel,//多区划
            searchStr:"",
            isChange:true
        };
        ufma.open({
            url: '../vou/vouModelAgy.html',
            title: "凭证模板",
            width: 1090,
            data: openData,
            ondestory: function(result) {
                if (result.action == "ok") {
                	 page.rzwin.setEditorData(html,result.voutempSendList,result.voutempText);//解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
                   // wxframe.window.setEditorData(html,result.voutempSendList,result.voutempText);
                }
            }
                
        });
	}
	
	var page = function() {
		var ptData = {};
		var agencyCode = '',
			acctCode = '';
		var oTable;
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				var arguAge = {
					setYear:ptData.svSetYear,
					rgCode:ptData.svRgCode
				}
                dm.doGet("agency",arguAge,function (result) {
                    $('#cbAgency').ufTreecombox({
                        // url: dm.getCtrl('agency'),
                        idField: 'id', //可选
                        textField: 'codeName', //可选
                        pIdField: 'pId', //可选
                        readonly: false,
                        placeholder: '请选择单位',
                        icon: 'icon-unit',
                        theme: 'label',
                        leafRequire: true,
						data:result.data,
                        onChange: function(sender, treeNode) {
							agencyCode = $('#cbAgency').getObj().getValue();
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.code,
								selAgecncyName: treeNode.name,
							}
							ufma.setSelectedVar(params);
                            //多区划
                            var argu={
                            	agencyCode:agencyCode,
                            	setYear:ptData.svSetYear
                            }
                            var url = dm.getCtrl('acct'); //+ agencyCode;
                            callback = function(result) {
                                $("#cbAcct").getObj().load(result.data);
                            }
                            ufma.get(url, argu, callback);
                            /*var url = dm.getCtrl('acct') + agencyCode;
                            callback = function(result) {
                                $("#cbAcct").getObj().load(result.data);
                            }
                            ufma.get(url, {}, callback);*/
                            //费用类型
                            dm.cbbFeeType({
                                agencyCode: agencyCode
                                //setYear: window.ownerData.setYear,
                                //rgCode: window.ownerData.rgCode
                            }, function(result) {
                                $('#fylxCode').ufTreecombox({
                                    idField: "id",
                                    textField: "codeName",
                                    pIdField: "pId",
                                    readonly: false,
                                    leafRequire: true,
                                    data: result.data,
                                    onComplete: function(sender) {
                                        var timeId = setTimeout(function() {
                                            $('#btnQuery').trigger('click');
                                            clearTimeout(timeId);
                                        }, 300);
                                    }
                                });
                                $('#fylxCode').getObj().val('01');
                            });

                        },
                        onComplete: function(sender) {
                            if(ptData.svAgencyCode) {
                                $('#cbAgency').getObj().val(ptData.svAgencyCode);
                            } else {
                                $('#cbAgency').getObj().val('1');
                            }
                            ufma.hideloading();
                        }
                    });
				})

				//page.cbAgency.select(1);
			},
			initGridDPE: function() {
				var tableId = 'gridDPE';
				var columns = [
                    {
                        title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
                        data: null,
                        className: 'tc nowrap no-print',
                        width: 30
                    },
					/*{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap isprint',
						width: 30
					},*/
					//bug78303--zsj
					{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap isprint',
						width: 44,
						"render": function(data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "费用类型",
						data: "fylxName",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!rowdata.bookGuid) return '';
							return data + '<span class="row-details icon-angle-bottom" dataId="' + rowdata.bookGuid + '"></span>'
						}
					},
					{
						title: "发生日期",
						data: "occurDate",
						className: 'nowrap isprint'
					},
					{
						title: "摊销类型",
						data: "apportionTypeName",
						className: 'nowrap isprint'
					},
					{
						title: "开始日期",
						data: 'startDate',
						className: 'nowrap isprint'
					},
					{
						title: "到期日期",
						data: 'endDate',
						className: 'nowrap isprint'
					},
					{
						title: "摊销金额",
						data: "apportionMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "摊销期",
						data: "apportionPeriod",
						className: 'tc nowrap isprint',
						render: function(data, type, rowdata, meta) {
							return data == 0 ? '' : data;
						}
					},
					{
						title: "已摊销金额",
						data: "apportionedMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "已摊销期",
						data: "apportionedPeriod",
						className: 'tc nowrap isprint',
						render: function(data, type, rowdata, meta) {
							return data == 0 ? '' : data;
						}
					},
					{
						title: "未摊销金额",
						data: "noapportionedMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "未摊销期",
						data: "noapportionedPeriod",
						className: 'tc nowrap isprint',
						render: function(data, type, rowdata, meta) {
							return data == 0 ? '' : data;
						}
					},
					{
						title: "状态",
						data: "statusName",
						className: 'nowrap isprint'
					},
					{
						title: "操作",
						data: "opt",
						width: 100,
						className: 'nowrap tc',
						render: function(data, type, rowdata, meta) {
							if(rowdata.status == '03') {
								return '';
							}
							return '<a class="btn btn-icon-only btn-sm btn-permission icon-write-off f16 btn-amort" rowindex="' + meta.row + '" data-toggle="tooltip" title="摊销">' +
								'<a class="btn btn-icon-only btn-sm btn-permission icon-exit f16 btn-rollout" rowindex="' + meta.row + '" data-toggle="tooltip" title="转出">';
						}
					}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100,//默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
                    "columnDefs": [{
                        "targets": [0], //第一列
                        "serchable": false,
                        "orderable": false,
                        "className": "nowrap no-print",
                        "render": function(data, type, rowdata, meta) {
                            return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' rowIndex='"+meta.row+"' /> &nbsp;<span></span> </label>";
                        }
                    }],
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
							},
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
                        $("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						 //导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridDPE'), '待摊费用登记簿');
						});
						//导出end
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
					},
                    "drawCallback": function (settings) {
                        $("#gridDPE input.check-all").prop("checked",false);
                        $("#all").prop("checked",false);
                        $("#check_H").prop("checked",false);
                        ufma.isShow(page.reslist);

                    }/*,
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(1)', nRow).html(iDataIndex + 1);
					}*/
				}

				oTable = $("#" + tableId).dataTable(opts);
			},
			loadGridDPE: function() {
				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});

				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(result.data.length > 0){
                        oTable.fnAddData(result.data, true);
					}
					$('#gridDPE').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));

					$('#gridDPE').fixedColumns({
						rightColumns: 1
					});
				});
			},

			getDetails: function(dataId) {
				var _detailCnt = $('<div>').css({
					'width': '900px'
				});
				var _dt = $("<table>").addClass('ufma-table').css({
					'border-bottom': "1px #ddd solid"
				});
				_dt.appendTo(_detailCnt);
				var columns = [{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap',
						width: 30
					},
					{
						title: "备查类型",
						data: "businessTypeName",
						className: 'nowrap'
					},
					{
						title: "摊销期",
						data: "apportionPeriod",
						className: 'tc nowrap',
						render: function(data, type, rowdata, meta) {
							return data == 0 ? '' : data;
						}
					}, {
						title: "摊销日期",
						data: "apportionDate",
						className: 'nowrap'
					},
					{
						title: "当期摊销金额",
						data: "apportionMoney",
						className: 'tr nowrap',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "转出金额",
						data: "outMoney",
						className: 'tr nowrap',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "操作人",
						data: "createUserName",
						className: 'nowrap'
					},

					{
						title: "操作",
						data: "opt",
						width: 100,
						className: 'nowrap tc',
						render: function(data, type, rowdata, meta) {
							if(rowdata.status == '03') {
								return '';
							}
							var btns = '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-edit" rowindex="' + meta.row + '" data-toggle="tooltip" title="修改">';
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-trash f16 btn-delete" rowindex="' + meta.row + '" data-toggle="tooltip" title="删除">';
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-supplement f16 btn-makevouc" rowindex="' + meta.row + '" data-toggle="tooltip" title="制证">';
							return btns;
						}
					}
				];

				var dtTable = $(_dt).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					searching: false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
					columns: columns,
					data: [],

					initComplete: function(settings, json) {
                        ufma.isShow(page.reslist);

					},
                    "drawCallback": function (settings) {
                        ufma.isShow(page.reslist);
                    },
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				});
				$.data(_dt[0], 'otable', dtTable);
				ufma.get(dm.getCtrl('amortList').replace('{bookGuid}', dataId), {}, function(result) {
					dtTable.fnClearTable();
					dtTable.fnAddData(result.data, true);
				});
				return _detailCnt;
			},
			onEventListener: function() {
                $(document).on("click", 'input#check_H', function() {
                    var flag = $(this).prop("checked");
                    $("#gridDPE").find('input.check-all').prop('checked', flag);
                    $("#all").prop('checked', flag)
                });
                $(document).on("click","#all", function() {
                    var flag = $(this).prop("checked");
                    $("#gridDPE").find('input.check-all').prop('checked', flag);
                    $("#check_H").prop('checked', flag)
                });
                $(document).on("click","input.check-all", function(e) {
                    stopPropagation(e);
                    var flag = $(this).prop("checked");
                    $(this).prop('checked', flag);
                });
				$('#btnAdd').click(function() {

					ufma.open({
						url: 'bookin.html',
						title: '待摊费用登记',
						width: 680,
						height: 500,
						data: {
							mainData: {
								agencyCode: $("#cbAgency").getObj().getValue(),
								acctCode: $("#cbAcct").getObj().getValue(),
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								status: '01'
							}
						},
						ondestory: function(action) {
                            $('#btnQuery').trigger('click');
						}
					});
				});
				$(document).on("click","#btn-gather-amort",function () {
                    var tableRows = oTable.fnGetData();
                    var checkedArray = [],arguArr = [];
                    $('#gridDPE input.check-all:checked').each(function() {
                        checkedArray.push($(this).attr("rowIndex"));
                    });
                    if(checkedArray.length == 0) {
                        ufma.showTip('请选择数据！', function() {}, 'warning');
						return false;
                    }

                    for(var i = 0;i<checkedArray.length;i++){
                        arguArr.push(tableRows[checkedArray[i]]);
					}
                    var svTransDate = ptData.svTransDate;
                    var fisPerd = new Date(svTransDate).getMonth() + 1;
                    var agru = {
                    	data:arguArr,
                        fisPerd:fisPerd
					};

                    ufma.post(dm.getCtrl('apportions'),agru,function (result) {
						ufma.showTip(result.msg,function () {

                        },"warning");
						$("#btnQuery").trigger("click");
                    });

                });
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');
					if(rowIndex) {
						var rowData = {},
							detailData = {};

						var url = '';
						var title = '';
						if($(e.target).is('.btn-amort')) {
							//rowData = oTable.api(false).row(nTr).data();
							rowData = oTable.api(false).rows(rowIndex).data()[0];
                            rowData.id = rowData.fylxCode;
							var title = '待摊费用摊销';
							url = 'amort.html';
						} else if($(e.target).is('.btn-rollout')) {
							//rowData = oTable.api(false).row(nTr).data();
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							var title = '待摊费用转出';
							url = 'rollout.html';
						} else if($(e.target).is('.btn-edit')) {
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							var businessType = detailData.businessType;
							if(businessType == '01') {
								url = 'bookin.html';
								title = '待摊费用登记';
							} else if(businessType == '02') {
								var title = '待摊费用摊销';
								url = 'amort.html';
							} else if(businessType == '03') {
								var title = '待摊费用转出';
								url = 'rollout.html';
							} else {
								ufma.showTip('不支持的业务类型是！', {}, function() {});
								return false;
							}
						} else if($(e.target).is('.btn-delete')) {
							var nTr = $(e.target).closest('tr');
							var dtTable = $.data($(nTr).closest('.dataTable')[0], 'otable');
							rowData = dtTable.api(true).row(nTr).data();
							var businessType = rowData.businessType;
							if(businessType == '01') {
								dm.doDel('bookDel', {
									bookGuid: rowData.bookGuid
								}, function(result) {
									dtTable.fnDeleteRow(nTr);
									ufma.showTip(result.msg,function () {
										
                                    },result.flag);
									$("#btnQuery").trigger("click");
								});
							} else {
								dm.doDel('amortDel', {
									detailGuid: rowData.detailGuid
								}, function(result) {
                                    $("#btnQuery").trigger("click");
									dtTable.fnDeleteRow(nTr);
								});
							}

							return false;
						} else if($(e.target).is('.btn-makevouc')) {
							ufma.showTip('开发中...',function(){},'warning');
							return false;
						} else {
							return false;
						}
						ufma.open({
							url: url,
							title: title,
							width: 680,
							height: 500,
							data: {
								mainData: rowData,
								detailData: detailData
							},
							ondestory: function(action) {
                                $('#btnQuery').trigger('click');
							}
						});
					}
				});

				$('#btnQuery').click(function() {
					if($('#minOccurDate').getObj().getValue() > $('#maxOccurDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var minApportionMoney = $('#minApportionMoney').val().replace(/,/g, "");
					var maxApportionMoney = $('#maxApportionMoney').val().replace(/,/g, "");
					if(parseFloat(minApportionMoney)> parseFloat(maxApportionMoney)) {
						ufma.showTip('开始金额不能大于结束金额！', function() {}, 'error');
						return false;
					}
					page.loadGridDPE();
				});
				///////////////
				$('.ufma-table').on('click', ' tbody td .row-details', function() {
					var nTr = $(this).parents('tr')[0];
					if(oTable.fnIsOpen(nTr)) //判断是否已打开            
					{
						$(nTr).find('td:last-child').attr('rowspan', '1');
						oTable.fnClose(nTr);
						$(this).addClass("icon-angle-bottom").removeClass("icon-angle-top");

					} else {
						$(this).addClass("icon-angle-top").removeClass("icon-angle-bottom");
						var shtml = page.getDetails($(this).attr("dataId"));
						var dtTr = oTable.fnOpen(nTr, shtml, 'details');
						$(nTr).find('td:last-child').attr('rowspan', '2');
						$(dtTr).find('td:eq(0)').attr('colspan', $(nTr).find('td').length - 1).css({
							'padding-left': $(nTr).find('td:eq(0)').outerWidth() + 'px'
						});
					}
					var timeId = setTimeout(function() {
						ufma.setBarPos($(window));
						$('#gridDPE').fixedColumns({
							rightColumns: 1
						});
						clearTimeout(timeId);
					}, 300);

				});
				//入账设置保存  
                $('#zhangSet').click(function () {
                    if($("#cbAcct").getObj().getValue()){
                    	//解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
						 page.rzwin = ufma.open({  
                      //  ufma.open({
                            url: 'dpNotice/dpNotice.html',
                            title: "入账设置-待摊费用",
                            width: 600,
                            height: 250,
                            data: {
                                'agencyCode': $("#cbAgency").getObj().getValue(),
                                'acctCode': $("#cbAcct").getObj().getValue()
                            },
                            ondestory: function() {
                               
                            }    
                        });
                    }else{
                        ufma.showTip('请选择账套！', function () {}, 'warning');
                    }
				});
				//对应html部分 39行的按钮 保留原因：可能用于测试
				// function linkpost(url, params) { 
				// 	var temp_form = document.createElement("form");     
				// 	temp_form.action = url;     
				// 	temp_form.target = "_blank";
				// 	temp_form.method = "post";     
				// 	temp_form.style.display = "none"; 
				// 	for (var x in params) { 
				// 		var opt = document.createElement("textarea");     
				// 		opt.name = x;     
				// 		opt.value = params[x];     
				// 		temp_form.appendChild(opt);     
				// 	}     
				// 	document.body.appendChild(temp_form);     
				// 	temp_form.submit();    
				// }
				// //测试跳转
				// $('#linkurtest').on('click',function(){
				// 	linkpost('/gl/api/linkJournal',{})
				// })
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$("#cbAcct").ufCombox({
					/*idField: 'CHR_CODE',
					textField: 'CODE_NAME',*/
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(sender,data) {
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: data.code,
							selAcctName: data.name
						}
						ufma.setSelectedVar(params);

					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
						ufma.hideloading();
					}
				});

				this.initAgencyScc();
				/////////////
                var signInDate = new Date(ptData.svTransDate),y = signInDate.getFullYear(), m = signInDate.getMonth();
                $('#minOccurDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: new Date(y,m,1)
                });
                $('#maxOccurDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: signInDate
                });
				dm.radioLabelDPEType('#apportionType');
				//$('#minApportionMoney,#maxApportionMoney').amtInput();
				$('#minApportionMoney,#maxApportionMoney').amtInputNull();
				page.initGridDPE();
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
    function stopPropagation(e) {
        if(e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
});
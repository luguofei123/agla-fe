$(function () {
    var page = function () {
        var agencyCtrlLevel;
        var govExpecoTable;
        var agencyCode;
        var eleCode = "EXPECO";
        var tableParam = 'MA_ELE_EXPECO';
        var baseUrl;
        var usedDataTable; //引用表格对象
        var agencyType;
        return {
            namespace: 'govMoban',
            get: function (tag) {
                return $('#' + this.namespace + ' ' + tag);
            },
            getInterface: function (action) {
                var urls = {
                    del: {
                        type: 'delete',
                        url: page.baseUrl + 'commonRg/deleteSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
                    },
                    active: {
                        type: 'put',
                        url: page.baseUrl + 'commonRg/ableSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
                    },
                    unactive: {
                        type: 'put',
                        url: page.baseUrl + 'commonRg/ableSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
                    },
                    addlower: {
                        type: 'post',
                        url: page.baseUrl + 'common/getMaxLowerCode?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
                    }
                };
                return urls[action];
            },
            getDWUsedInfo: function (data, columnsArr) {
                page.usedDataTable = $('#dw-used').DataTable({
                    "data": data,
                    "columns": columnsArr,
                    "bPaginate": false, //翻页功能
                    "bLengthChange": false, //改变每页显示数据数量
                    "bFilter": false, //过滤功能
                    "bSort": false, //排序功能
                    "bInfo": false, //页脚信息
                    "bAutoWidth": false //自动宽度
                });
            },
            getPageName: function (tableParam) {
                var pageName = {
                    MA_ELE_GOVEXPECO: {
                        title: '政府经济分类',
                        eleCode: "GOVEXPECO"
                    },
                    MA_ELE_EXPECO: {
                        title: '部门经济分类',
                        eleCode: "EXPECO"
                    },
                    MA_ELE_PROTYPE: {
                        title: '项目类别',
                        eleCode: "PROTYPE"
                    },
                    MA_ELE_FUNDTYPE: {
                        title: '资金性质',
                        eleCode: "FUNDTYPE"
                    },
                    MA_ELE_BGTSOURCE: {
                        title: '预算来源',
                        eleCode: "BGTSOURCE"
                    },
                    MA_ELE_FUNDSOURCE: {
                        title: '经费来源',
                        eleCode: "FUNDSOURCE"
                    },
                    MA_ELE_PAYTYPE: {
                        title: '支付方式',
                        eleCode: "PAYTYPE"
                    },
                    MA_ELE_EXPTYPE: {
                        title: '支出类型',
                        eleCode: "EXPTYPE"
                    },
                    MA_ELE_SETMODE: {
                        title: '结算方式',
                        eleCode: "SETMODE"
                    },
                    MA_ELE_FATYPE: {
                        title: '资产类型',
                        eleCode: "FATYPE"
                    },
                    MA_ELE_DEPPRO: {
                        title: '财政项目',
                        eleCode: "DEPPRO"
                    },
                    MA_ELE_BILLTYPE: {
                        title: '票据类型',
                        eleCode: 'BILLTYPE'
                    },
                    //财政社保新增要素
                    SSSFM_ELE_INPIRDSTYPE: {
                        title: '缴费期',
                        eleCode: 'INPIRDSTYPE'
                    },
                    SSSFM_ELE_SUBSIDYLEVERLS: {
                        title: '财政补贴级次',
                        eleCode: 'SUBSIDYLEVERLS'
                    },
                    SSSFM_ELE_OPERITEM: {
                        title: '资金运作项目',
                        eleCode: 'OPERITEM'
                    },
                    SSSFM_ELE_INSUREDPLACE: {
                        title: '参保地',
                        eleCode: 'INSUREDPLACE'
                    },
                    SSSFM_ELE_MEDICALPLACE: {
                        title: '就医地',
                        eleCode: 'MEDICALPLACE'
                    }
                }
                return pageName[tableParam];
            },

            getCommonData: function (pageNum, pageLen) {
                var url = "/ma/sys/expecoSys/select";
                var argu = $('#enabled').serializeObject();

                var columns = [{
                    title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
                        'class="datatable-group-checkable"/> &nbsp;<span></span> </label>',
                    data: "chrId"
                },
                {
                    title: "部门经济分类编码",
                    data: "chrCode"
                },
                {
                    title: "部门经济分类名称",
                    data: "chrName"
                },
                {
                    title: "政府经济分类",
                    data: "govexpecoName",
                    render: function (rowid, rowdata, data) {
                    	return data.govexpecoCode+ ' ' + data.govexpecoName
//                      if (!$('body').data("code")) { //系统级
//                          var divKind = $('#query-tj').find('a[name="divkind"].selected').attr("value");
//                          for (var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
//                              if (divKind == data.eleExpecoGovexpecoList[i].govAgencyType) {
//                                  return (!$.isNull(data.eleExpecoGovexpecoList[i].govexpecoName)) ? data.eleExpecoGovexpecoList[i].govexpecoName : "";
//                              }
//                          }
//                          return " ";
//                      } else {
//                          if (data.eleExpecoGovexpecoList.length != 0) {
//                              for (var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
//                                  return (!$.isNull(data.eleExpecoGovexpecoList[i].govexpecoName)) ? data.eleExpecoGovexpecoList[i].govexpecoName : "";
//                              }
//                          } else {
//                              return " ";
//                          }
//                      }
                    }
                },
                {
                    title: "状态",
                    data: "enabledName"
                },
                {
                    title: "操作",
                    data: 'chrId'
                }
                ];
                //if (!$('body').data("code")) { //系统级
                    argu["govAgencyType"] = $('#query-tj').find('a[name="divkind"].selected').attr("value");
                //}else{
                    //argu["govAgencyType"] = page.divKind;
                //}
                argu["agencyCode"] = page.agencyCode;
                argu["table"] = 'MA_ELE_EXPECO';
                argu["rgCode"] = ma.rgCode;
                argu["setYear"] = ma.setYear;
                argu["setYear"] = ma.setYear;
                ufma.showloading('正在请求数据，请耐心等待...');
                var callback = function (result) {
                    page.data = result.data
                    var id = "expfunc-data";
                    var toolBar = $('#' + id).attr('tool-bar');
                    page.govExpecoTable = $('#' + id).DataTable({
                        "language": {
                            "url": bootPath + "agla-trd/datatables/datatable.default.js"
                        },
                        "fixedHeader": {
                            header: true
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
                        "columns": columns,
                        "columnDefs": [{
                            "targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrCode + '"/> &nbsp;<span></span> </label>';
                            }
                        },
                        {
                            "targets": [1, 2, 3, 4], ////部门预算经济分类增加"政府预算"列 guohx 20180620
                            "className": "isprint"
                        },
                        {
                            "targets": [2],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap",
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
                                var chrCode = rowdata.chrCode;
                                var agencyCode = rowdata.agencyCode;

                                var addlower = "";

                                if ($('body').attr("data-code")) {
                                    if (page.agencyCtrlLevel != '0101') {
                                        addlower = "";
                                    } else {
                                        addlower = 'hidden';
                                    }
                                } else {
                                    addlower = '';
                                }
                                return '<a class="btn btn-icon-only btn-sm btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级">' +
                                    '<span class="glyphicon icon-add-subordinate"></span></a>' +
                                    '<a class="btn btn-icon-only btn-sm btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="启用">' +
                                    '<span class="glyphicon icon-play"></span></a>' +
                                    '<a class="btn btn-icon-only btn-sm btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="停用">' +
                                    '<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="删除">' +
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
                            $("#printTableData").html("");
                            $("#printTableData").append($(".printButtons"));

                            $("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
                                "data-toggle": "tooltip",
                                "title": "打印"
                            });
                            $("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
                                "data-toggle": "tooltip",
                                "title": "导出"
                            });
                            //导出begin
							$("#printTableData .buttons-excel").off().on('click', function(evt) {
								evt = evt || window.event;
								evt.preventDefault();
								ufma.expXLSForDatatable($('#'+id), '部门经济分类');
							});
							//导出end	
                            $('#printTableData.btn-group').css("position", "inherit");
                            $('#printTableData div.dt-buttons').css("position", "inherit");
                            $('#printTableData [data-toggle="tooltip"]').tooltip();
                            ufma.isShow(page.reslist);
                            //全选按钮与分页工具条
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

                            $(".datatable-group-checkable").prop("checked", false);
                            $(".datatable-group-checkable").on('change', function () {
                                var t = $(this).is(":checked");
                                $('.checkboxes').each(function () {
                                    t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                    t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
                                });
                                $(".datatable-group-checkable").prop("checked", t);
                            });

                        },
                        "headerCallback": function () {

                        },
                        "drawCallback": function (settings) {
                        	ufma.dtPageLength($(this));
                            ufma.isShow(page.reslist);
                            ufma.parseScroll();
                            $('#' + id).find("td.dataTables_empty").text("")
                                .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                            $('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();
                            $('#' + id + ' .btn').on('click', function () {
                                //page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
                                page._self = $(this);
                                //                        		var action = $(this).attr('action');
                                //                        		if(action == "del"){
                                //                        			page.ufTooltipAction = "删除";
                                //                        		}else if(action == "active"){
                                //                        			page.ufTooltipAction = "停用";
                                //                        		}else if(action == "unactive"){
                                //                        			page.ufTooltipAction = "启用";
                                //                        		}
                            });
                            $('#' + id + ' .btn-delete').ufTooltip({
                                content: '您确定删除当前部门预算经济分类吗？',
                                onYes: function () {
                                	ufma.showloading('数据删除中，请耐心等待...');
                                    page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
                                },
                                onNo: function () { }
                            })
                            $('#' + id + ' .btn-start').ufTooltip({
                                content: '您确定启用当前部门预算经济分类吗？',
                                onYes: function () {
                                	ufma.showloading('数据启用中，请耐心等待...');
                                    page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
                                },
                                onNo: function () { }
                            })
                            $('#' + id + ' .btn-stop').ufTooltip({
                                content: '您确定停用当前部门预算经济分类吗？',
                                onYes: function () {
                                	ufma.showloading('数据停用中，请耐心等待...');
                                    page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
                                },
                                onNo: function () { }
                            });

                            ufma.setBarPos($(window));
                        }
                    });
                    //翻页取消勾选
                    $('#' + id).on('page.dt', function () {
                        $(".datatable-group-checkable,.checkboxes").prop("checked", false);
                        $('#' + id).find("tbody tr.selected").removeClass("selected");
                    });
                    ufma.hideloading();
                };
                ufma.get(url, argu, callback);
            },

            //选用页面初始化
            getExpFuncChoose: function () {
                var url = "/ma/sys/commonRg/select";
                var argu = $('#enabled').serializeObject();
                argu["agencyCode"] = "*";
                argu["table"] = 'MA_ELE_EXPECO';
                argu["rgCode"] = ma.rgCode;
                argu["setYear"] = ma.setYear;
                argu["govAgencyType"] = "1";
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
                            title: "部门经济分类编码",
                            data: "chrCode"
                        },
                        {
                            title: "部门经济分类名称",
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
                            var $info = $(toolBar + ' .info');
                            if ($info.length == 0) {
                                $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                            }
                            $info.html('');
                            $('.' + id + '-paginate').appendTo($info);
                        },
                        "drawCallback": function (settings) {
                            ufma.isShow(page.reslist);

                            $('#' + id).find("td.dataTables_empty").text("")
                                .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                            $(".datatable-choose-checkall").prop("checked", false);
                            $(".datatable-choose-checkall").on('change', function () {
                                var t = $(this).is(":checked");
                                $('#' + id).find('.checkboxes').each(function () {
                                    t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                    t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
                                });
                                $(".datatable-choose-checkall").prop("checked", t);
                            });

                        }
                    });
                    ufma.hideloading();

                };
                ufma.get(url, argu, callback);
            },

            getCheckedRows: function () {
                var checkedArray = [];
                table = page.govExpecoTable;
                activeLine = table.rows('.selected');
                data = activeLine.data();
                for (var i = 0; i < data.length; i++)
                    checkedArray.push(data[i].chrCode);
                return checkedArray;
            },
            getCheckedRowIds: function () {
                var checkedArray = [];
                $('#expfunc-data .checkboxes:checked').each(function () {
                    checkedArray.push($(this).val());
                });
                return checkedArray;
            },
            getChooseCheckedRows: function () {
                var checkedArray = [];
                $('#expfunc-choose-datatable .checkboxes:checked').each(function () {
                    checkedArray.push($(this).val());
                });
                return checkedArray;
            },
            getDW: function () {
				/*var codes = page.getCheckedRows();
				var url = page.baseUrl + "common/countAgencyUse";
				var argu = {
				    'codes': codes,
				    "table": page.tableParam
				};
				var callback = function(result) {
				    $('#dw-used').DataTable({
				        "language": {
				            "url": bootPath + "agla-trd/datatables/datatable.default.js"
				        },
				        "data": result.data,
				        "bFilter": false, //去掉搜索框
				        "paging": false,
				        "bLengthChange": true, //去掉每页显示多少条数据
				        "processing": true, //是否显示正在加载
				        "pagingType": "first_last_numbers", //分页样式
				        "lengthChange": false, //是否允许用户自定显示数量
				        "pageLength": 10,
				        "bInfo": false, //页脚信息
				        "bSort": false, //排序功能
				        "bAutoWidth": false, //表格自定义宽度
				        "bProcessing": true,
				        "bDestroy": true,
				        "columns": [{
				                title: "单位",
				                data: "CHR_NAME"

				            },
				            {
				                title: "已用",
				                data: "NUM"
				            }
				        ]
				    });
				    ufma.hideloading();
				}
				ufma.post(url, argu, callback);*/
            },
            //批量删除、停用、启用
            delRow: function (action, idArray, $tr, data) {
                var options = this.getInterface(action);
                page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
                page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
                var argu = {
                    chrCodes: idArray,
                    "agencyCode": page.agencyCode,
                    "tableName": 'MA_ELE_EXPECO',
                    "eleCode": "EXPECO",
                    "action": action,
                    "rgCode": ma.rgCode,
                    "setYear": ma.setYear
                };
                var callback = function (result) {
                    if (action == 'del') {
                    	ufma.hideloading();
                        if ($tr) $tr.remove();
                        if (result.flag == 'success') {
                            ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
                        }
                    } else if (action == 'active') {
                    	ufma.hideloading();
                        if (result.flag == 'success') {
                            ufma.showTip('启用成功', function () { }, 'success');
                        }
                    } else if (action == 'unactive') {
                    	ufma.hideloading();
                        if (result.flag == 'success') {
                            ufma.showTip('停用成功！', function () { }, 'success');
                        }
                    }
                    else {
                        if ($tr) {
                            $tr.find('.btn[action="active"]').attr('disabled', action == "active");
                            $tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
                        }
                    }
                    page.getCommonData(page.pageNum, page.pageLen);
                }
                if (action == 'del') {
                    ufma.confirm('您确定要删除选中的部门预算经济分类吗？', function (action) {
                        if (action) {
                        	ufma.showloading('数据删除中，请耐心等待...');
                            delete argu.action;
                            ufma.ajax(options.url, options.type, argu, callback);
                        }
                    }, {
                            type: 'warning'
                        });
                } else if (action == 'addlower') {
                    $('#expFunc-chrName').removeAttr('disabled')
                    $('#govInput').removeAttr('disabled')
                    $('.btn-group label').removeClass('disabled')
                    $('.u-msg-footer .btn').removeClass('hidden')
                    $('#expFunc-chrCode').trigger('click');
                    var newArgu = {}
                    newArgu.chrCode = argu.chrCodes[0];
                    newArgu.agencyCode = page.agencyCode;
                    newArgu.eleCode = "EXPECO";
                    newArgu.tableName = 'MA_ELE_EXPECO';
                    newArgu.rgCode = ma.rgCode;
                    newArgu.setYear = ma.setYear;
                    if ($('body').attr('data-code')) {
                        $('#govBudgetLabel').addClass('none')
                        $('#govBudget').removeClass('none')
                        setTimeout(function () {
                            var chrCode = $('#expFunc-chrCode').val();
                            if ($.isNull(chrCode)) {
                                return false;
                            } else {
                                var argu = {
                                    chrCode: chrCode,
                                    rgCode: ma.rgCode,
                                    setYear: ma.setYear,
                                    agencyCode: page.agencyCode
                                };
                                ufma.showloading('数据加载中，请耐心等待...');
                                var url = "/ma/sys/expecoSys/getParentGovexpeco";
                                var callback = function (result) {
                                    if (!$.isNull(result.data.agencyType1)) { //行政
                                        for (var i = 0; i < result.data.agencyType1.length; i++) {
                                            $('#govBudgetXZ-hide').html("");
                                            $('#govBudgetXZ-hide').addClass('hide');
                                            var $title = $('#govBudgetXZ-title');
                                            $('<label  class="control-label"  name="for-del">' + result.data.agencyType1[i].codeName + '</label>').appendTo($title);
                                        }
                                        $('#govBudget').ufTreecombox({
                                            valueField: 'id',
                                            textField: 'codeName',
                                            //leafRequire: true,
                                            name: 'name',
                                            readOnly: false,
                                            data: result.data.agencyType1,
                                            onComplete: function (sender) {
                                                $('#govBudget').getObj().val('1')
                                            }
                                        });
                                        ufma.hideloading();
                                    } else if (!$.isNull(result.data.agencyType2)) {
                                        for (var i = 0; i < result.data.agencyType2.length; i++) {
                                            $('#govBudgetSY-hide').html("");
                                            $('#govBudgetSY-hide').addClass('hide');
                                            var $title = $('#govBudgetSY-title');
                                            $('<label  class="control-label"  name="for-del">' + result.data.agencyType2[i].codeName + '</label>').appendTo($title);
                                        }
                                        $('#govBudget').ufTreecombox({
                                            valueField: 'id',
                                            textField: 'codeName',
                                            //leafRequire: true,
                                            name: 'name',
                                            readOnly: false,
                                            data: result.data.agencyType2,
                                            onComplete: function (sender) {
                                                $('#govBudget').getObj().val('1')
                                            }
                                        });
                                    } else {
                                        $('#govBudgetXZ-hide').removeClass('hide');
                                        $('#govBudgetSY-hide').removeClass('hide');
                                        ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                                        //ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' +'*' + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                                            $('#govBudget').ufTreecombox({
                                                valueField: 'id',
                                                textField: 'codeName',
                                                //leafRequire: true,
                                                name: 'name',
                                                readOnly: false,
                                                data: result.data
                                            });
                                        })
                                    }
                                     ufma.hideloading();
                                }
                                ufma.get(url, argu, callback);
                                //                          $('#govBudget').getObj().setEnabled(false)
                            }
                        }, 300)

                    } else {
                        for (var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
                            if (data.eleExpecoGovexpecoList[i].govAgencyType == 1) {
                                $('#govBudgetXZ').getObj().setValue(data.eleExpecoGovexpecoList[i].govexpecoId, data.eleExpecoGovexpecoList[i].govexpecoName)
                            } else {
                                $('#govBudgetSY').getObj().setValue(data.eleExpecoGovexpecoList[i].govexpecoId, data.eleExpecoGovexpecoList[i].govexpecoName)
                            }
                        }
                        //                      $('#govBudgetXZ').getObj().setEnabled(false)
                        //                      $('#govBudgetSY').getObj().setEnabled(false)
                    }

                    ufma.ajax(options.url, options.type, newArgu, function (result) {
                        var data = result.data;
                        ma.isRuled = true;
                        $("#expFunc-chrCode").val(data)
                        page.action = 'addlower';
                        $('#expFunc-chrCode').trigger('click');
                        page.openEdtWin();
                        $('#expFunc-chrCode').trigger('click');
                    });

                } else if (action == 'active') {
                    ufma.confirm('您确定要启用选中的部门预算经济分类吗？', function (action) {
                        if (action) {
                        	ufma.showloading('数据启用中，请耐心等待...');
                            ufma.ajax(options.url, options.type, argu, callback);
                        }
                    }, {
                            type: 'warning'
                        });
                } else if (action == 'unactive') {
                    ufma.confirm('您确定要停用选中的部门预算经济分类吗？', function (action) {
                        if (action) {
                        	ufma.showloading('数据停用中，请耐心等待...');
                            ufma.ajax(options.url, options.type, argu, callback);
                        }
                    }, {
                            type: 'warning'
                        });
                }
            },
            //单一删除、停用、启用
            delRowOne: function (action, idArray, $tr) {
                var options = this.getInterface(action);
                page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
                page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
                var argu = {
                    chrCodes: idArray,
                    "agencyCode": page.agencyCode,
                    "tableName": 'MA_ELE_EXPECO',
                    "eleCode": "EXPECO",
                    "action": action,
                    "rgCode": ma.rgCode,
                    "setYear": ma.setYear
                };
                var callback = function (result) {
                    if (action == 'del') {
                    	ufma.hideloading();
                        if ($tr) $tr.remove();
                        if (result.flag == 'success') {
                            ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
                        }
                    } else if (action == 'active') {
                    	ufma.hideloading();
                        if (result.flag == 'success') {
                            ufma.showTip('启用成功', function () { }, 'success');
                        }
                    } else if (action == 'unactive') {
                    	ufma.hideloading();
                        if (result.flag == 'success') {
                            ufma.showTip('停用成功！', function () { }, 'success');
                        }
                    }
                    else {
                        if ($tr) {
                            $tr.find('.btn[action="active"]').attr('disabled', action == "active");
                            $tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
                        }
                    }
                    page.getCommonData(page.pageNum, page.pageLen);
                }
                if (action == 'del') {
                    delete argu.action;
                    ufma.ajax(options.url, options.type, argu, callback);
                } else {
                    ufma.ajax(options.url, options.type, argu, callback);
                }
            },
            openEdtWin: function (data) {
                if ($('body').attr('data-code') && page.action == 'edit') {
                    page.chrId = data.chrId;
                }
                if (page.action == 'edit' || page.action == 'addlower') {
                    $('#expFunc-chrCode').attr('disabled', false)
                    $("[name='chrId'],[name='lastVer'],[name='chrName']").val("");
                    var thisCode = $("#expFunc-chrCode").val();
                    if ($("#expFunc-chrCode") != "" && thisCode != "") {
                        var obj = {
                            "chrCode": thisCode,
                            "tableName": 'MA_ELE_EXPECO',
                            "eleCode": page.tableParam.substring(7),
                            "rgCode": ma.rgCode,
                            "setYear": ma.setYear,
                            "agencyCode": page.agencyCode
                        }
                        ma.nameTip = "";
                        ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
                            ma.nameTip = result.data;

                        });
                    } else {
                        if (!$.isNull(data)) {
                            ma.nameTip = data.chrFullname.replace('/' + data.chrName, ''); //去掉本级，得到上级代码	
                        } else {
                            ma.nameTip = ''
                        }
                    }

                    $('#prompt').text('编码规则：' + ma.fjfa)

                }
				var callback = function (result) {
					var cRule = result.data.codeRule;
					if (cRule != null && cRule != "") {
						page.fjfa = cRule;
						$('.table-sub-info').text(result.data.agencyCtrlName);
					}
				};
				var argu = {
					eleCode: 'EXPECO',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}
				//				var url = '/ma/sys/element/getElementCodeRule?tableName=MA_ELE_CASHFLOW';
				var url = '/ma/sys/element/getEleDetail';
				ufma.get(url, argu, callback);
			// },
//              var url = "/ma/sys/common/getCommonRule/MA_ELE_EXPECO";
//              var argu = {
//                  rgCode: ma.rgCode,
//                  setYear: ma.setYear
//              };
//              var callback = function (result) {
//                  gRule = result.gRule;
//                  if (result.gRule != "")
//                      page.fifa = gRule;
//              }
//              ufma.get(url, argu, callback);
                $('#expfunc-edt').find('.form-group').each(function () {
                    $(this).removeClass('error');
                    $(this).find(".input-help-block").remove();
                });

                if (page.action == 'add') {
                    data.chrId = "";
                    data.chrCode = "";
                    data.chrName = "";
                    data.lastVer = "";
                    $("form input[type='hidden']").val("");

                }
                if ($('body').attr('data-code')) {
                    page.editor = ufma.showModal('expfunc-edt', 800, 350);
                } else {
                    page.editor = ufma.showModal('expfunc-edt', 800, 460);
                }

                page.formdata = data;
                if (page.action == 'add') {
                    ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                    //ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + '*' + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                        $('#govBudget').ufTreecombox({
                            valueField: 'id',
                            textField: 'codeName',
                            //leafRequire: true,
                            name: 'name',
                            readOnly: false,
                            data: result.data
                        });
                    })
                    $("#expFunc-chrCode").attr('disabled', false)
                    $("#expFunc-chrName").attr('disabled', false)
                    $('.btn-group label').removeClass('disabled')
                    $('.u-msg-footer .btn-permission').removeClass('hidden')
                    $('#govBudgetXZ').removeClass('none');
                    $('#govBudgetSY').removeClass('none');
                    $('#govBudgetXZLabel').addClass('none');
                    $('#govBudgetSYLabel').addClass('none');
                    $('#govInput').addClass('none')
                    $('#govBudget').removeClass('none')
                    $('#govBudgetHide').addClass('w180');
                    $('#govBudgetXZHide').addClass('w180');
                    $('#govBudgetSYHide').addClass('w180');
                    //                  $('#govBudgetXZ').getObj().setEnabled(true)
                    //                  $('#govBudgetSY').getObj().setEnabled(true)

                }

            },
            openChooseWin: function () {
                page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
            },
            bsAndEdt: function (data) { //编辑
                page.action = 'edit';
                this.openEdtWin(data);
                $('#govBudgetLabel').removeClass('none')
                $('#govBudget').addClass('none')
                $("#expFunc-chrCode").attr('disabled', true)
                $("#expFunc-chrName").attr('disabled', true)
                $('.btn-group label').addClass('disabled')
                $('.u-msg-footer .btn-permission').eq(0).addClass('hidden')
                $('.u-msg-footer .btn-permission').eq(1).addClass('hidden')
                $('#expFunc-chrCode').val(data.chrCode)
                $('#expFunc-chrName').val(data.chrName)
                $('#chrId').val(data.chrId);
                $('#lastVer').val(data.lastVer);
                //add guohx
                if (!$('body').data("code")) { //系统级
                    $('.btn-group label').removeClass('disabled')
                    if (data.enabled == 1) {
                        $('#expfunc-edt .btn').eq(2).trigger('click')
                    } else {
                        $('#expfunc-edt .btn').eq(3).trigger('click')
                    }
                    if (data.allowAddsub == 1) {
                        $('#expfunc-edt .btn').eq(0).trigger('click')
                    } else {
                        $('#expfunc-edt .btn').eq(1).trigger('click')
                    }
                    var argu = {
                        rgCode: ma.rgCode,
                        setYear: ma.setYear,
                        chrCode:data.chrCode,
                       	agencyCode:page.agencyCode
                    }
                 	var argu = {
                        rgCode: ma.rgCode,
                        setYear: ma.setYear,
                        chrCode:data.chrCode,
                       	agencyCode:page.agencyCode
                    }
                 	var _thisdata = data
                    ufma.ajaxDef('/ma/sys/expecoSys/selectEleExpecoGovexpeco','post',argu,function(data){
	                   _thisdata.eleExpecoGovexpecoList = data.data
                    })
                    for (var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
                        if (data.eleExpecoGovexpecoList[i].govAgencyType == '1') {
                            $('#govBudgetXZ').removeClass('none');
                            $('#govBudgetXZ').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
                            $('#govBudgetXZHide').removeClass('w180');
                            if (!data.eleExpecoGovexpecoList[i].govexpecoName) {
                                data.eleExpecoGovexpecoList[i].govexpecoName = "";
                            }
                            $('#govBudgetXZLabel').addClass('none');

                        } else if (data.eleExpecoGovexpecoList[i].govAgencyType == '2') {
                            $('#govBudgetSY').removeClass('none');
                            $('#govBudgetSYHide').removeClass('w180');
                            $('#govBudgetSY').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
                            if (!data.eleExpecoGovexpecoList[i].govexpecoName) {
                                data.eleExpecoGovexpecoList[i].govexpecoName = "";
                            }
                            $('#govBudgetSYLabel').addClass('none');
                        }
                    }
                } else { //单位级
                	var argu = {
                        rgCode: ma.rgCode,
                        setYear: ma.setYear,
                        chrCode:data.chrCode,
                       	agencyCode:page.agencyCode
                    }
                 	var _thisdata = data
                    ufma.ajaxDef('/ma/sys/expecoSys/selectEleExpecoGovexpeco','post',argu,function(data){
	                   _thisdata.eleExpecoGovexpecoList = data.data
                    })
                    if (!$.isNull(data.eleExpecoGovexpecoList)) {
                        ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                        //ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + '*' + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                            $('#govBudget').ufTreecombox({
                                valueField: 'id',
                                textField: 'codeName',
                                //leafRequire: true,
                                name: 'name',
                                readOnly: false,
                                data: result.data
                            });
                            $('#govBudget').removeClass('none')
                            for (var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
                                //                                  $('#govBudget').addClass('none');
                                //                                  $('#govBudgetHide').removeClass('W180');
                                //                                  if ($.isNull(data.eleExpecoGovexpecoList[i].govexpecoName)) {
                                //                                      data.eleExpecoGovexpecoList[i].govexpecoName = "";
                                //                                  }
                                //                                  $('#govBudgetLabel').removeClass('hidden').html('<input id="govInput" type="text" class="form-control w180" value='+data.eleExpecoGovexpecoList[i].govexpecoName+'> ');
                                //                                  $('#govInput').val(data.eleExpecoGovexpecoList[i].govexpecoName)
                                $('#govBudget').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
                                $('#govBudget').removeClass('none')

                            }
                        })

                    }

                    if ($('.btn-save').hasClass('hidden')) {
                        $('#govInput').attr('disabled', 'disabled')
                    } else {
                        $('#govInput').attr('disabled', false)
                    }

                }
                //                  $('#govBudgetXZ').getObj().setEnabled(false)
                //                  $('#govBudgetSY').getObj().setEnabled(false)
                if (page.action == 'edit') {
                    if ($('.btn-save').hasClass('hidden')) {
                        $("#expFunc-chrCode").attr('disabled', true)
                        $("#expFunc-chrName").attr('disabled', true)
                        $('.btn-group label').addClass('disabled')

                    } else {
                        $("#expFunc-chrCode").attr('disabled', true)
                        $("#expFunc-chrName").attr('disabled', true)
                        $('.btn-group label').removeClass('disabled')
                    }
                }
                // });

                page.setFormEnabled();

            },
            save: function (goon) {
                page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
                page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
                if (page.action == 'add') {
                    if (!ma.formValidator("expFunc-chrCode", "expFunc-chrName", page.getPageName(page.tableParam).title, "add")) {
                        return false;
                    }
                }
                ufma.showloading('数据保存中，请耐心等待...');
                var url = "/ma/sys/expecoSys/saveSys";
                var argu = $('#form-expfunc').serializeObject();
                if ($("#expFunc-chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
                    argu["chrFullname"] = $("#expFunc-chrName").val();
                } else {
                    argu["chrFullname"] = ma.nameTip + "/" + $("#expFunc-chrName").val();
                }

                argu["agencyCode"] = page.agencyCode;
                argu["table"] = 'MA_ELE_EXPECO';
                if ($('body').attr('data-code')) { //单位级
                    if ($('#govBudget').hasClass('uf-combox-combox')) {
                        var eleExpecoGovexpecoList = [];
                        var xzIems = $('#govBudget').getObj().getItem();
                        if (!$.isNull(xzIems)) {
                            var xzGovList = {};
                            xzGovList.govexpecoCode = xzIems.code;
                            xzGovList.govexpecoName = xzIems.codeName;
                            xzGovList.govexpecoId = xzIems.id;
                            xzGovList.expecoCode = $('#expFunc-chrCode').val();
                            xzGovList.govAgencyType = page.agencyType;
                            xzGovList.agencyCode = page.agencyCode
                            xzGovList.rgCode = xzIems.RG_CODE
                            xzGovList.setYear = xzIems.SET_YEAR
                            eleExpecoGovexpecoList.push(xzGovList);
                        }
                        argu["eleExpecoGovexpecoList"] = eleExpecoGovexpecoList;
                    }

                } else { //系统级
                    var eleExpecoGovexpecoList = [];
                    var xzIems = $('#govBudgetXZ').getObj().getItem();
                    if (!$.isNull(xzIems)) {
                        var xzGovList = {};
                        xzGovList.govexpecoCode = xzIems.code;
                        xzGovList.govexpecoName = xzIems.codeName;
                        xzGovList.govexpecoId = xzIems.id;
                        xzGovList.expecoCode = $('#expFunc-chrCode').val();
                        xzGovList.govAgencyType = "1";
                        xzGovList.agencyCode = xzIems.AGENCY_CODE
                        xzGovList.rgCode = xzIems.RG_CODE
                        xzGovList.setYear = xzIems.SET_YEAR
                        eleExpecoGovexpecoList.push(xzGovList);
                    }
                    var syIems = $('#govBudgetSY').getObj().getItem();
                    if (!$.isNull(syIems)) {
                        var syGovList = {};
                        syGovList.govexpecoCode = syIems.code;
                        syGovList.govexpecoName = syIems.codeName;
                        syGovList.govexpecoId = syIems.id;
                        syGovList.expecoCode = $('#expFunc-chrCode').val();
                        syGovList.govAgencyType = "2";
                        syGovList.agencyCode = syIems.AGENCY_CODE
                        syGovList.rgCode = syIems.RG_CODE
                        syGovList.setYear = syIems.SET_YEAR
                        eleExpecoGovexpecoList.push(syGovList);
                    }
                    argu["eleExpecoGovexpecoList"] = eleExpecoGovexpecoList;
                }

                argu.rgCode = ma.rgCode;
                argu.setYear = ma.setYear;

                var callback = function (result) {
                    $("[name='chrId']").val('');
                    $("[name='lastVer']").val('');
                    $('#expFunc-chrCode').removeAttr('disabled');
                    page.getCommonData(page.pageNum, page.pageLen);
                    ma.nameTip = null;
                    if (!goon) {
                    	ufma.hideloading();
                        ufma.showTip(result.msg, function () { }, result.flag);
                        $('#form-expfunc')[0].reset();
                        page.editor.close();
                    } else {
                    	ufma.hideloading();
                        ufma.showTip('保存成功,您可以继续添加部门预算经济分类！', function () { }, result.flag);
                        $('#form-expfunc')[0].reset();
                        $("#expFunc-chrCode").removeAttr("disabled");
                        page.formdata = $('#form-expfunc').serializeObject();

                        ma.fillWithBrother($('#expFunc-chrCode'), { "chrCode": argu.chrCode, "eleCode": "EXPECO", "agencyCode": page.agencyCode });
                    }
                }
                if (page.chrId != undefined && page.action == 'edit') {
                    argu.chrId = page.chrId
                }
                ufma.post(url, argu, callback);
            },
            setFormEnabled: function () {
                if (page.action == 'edit') {
                    ma.isRuled = true;

                    if ($('body').data("code")) {
                        if (page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {
                            $('#expFunc-chrName').attr('disabled', 'disabled');
                            $('#expfunc-edt label.btn').attr('disabled', 'disabled');
                            $("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").hide();
                        } else {
                            $('#expFunc-chrName').removeAttr('disabled');
                            $('#expfunc-edt label.btn').removeAttr('disabled');
                            $("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").show();
                        }
                    } else {
                        $('#expFunc-chrName').removeAttr('disabled');
                        $('#expfunc-edt label.btn').removeAttr('disabled');
                        $("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").show().removeClass('hidden');
                    }

                } else if (page.action == 'add') {
                    $('#expFunc-chrCode').removeAttr('disabled');
                    $('#form-expfunc')[0].reset();

                    $('#form-expfunc input[name="chrId"]').val('');
                    $('#form-expfunc input[name="lastVer"]').val('');
                }
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
				data.colName = '部门经济分类';
				data.pageType = 'EXPECO';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
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
                $('#expfunc-data').on('click', 'tbody td:not(.btnGroup)', function (e) {
                    e.preventDefault();
                    var $ele = $(e.target);
                    if ($ele.is('a')) {
                        page.bsAndEdt($ele.data('href'));
                        return false;
                    }
                    var $tr = $ele.closest('tr');
                    var $input = $ele.closest('tr').find('input[type="checkbox"]');
                    var code = $input.data("code").toString();
                    if ($tr.hasClass("selected")) {
                        //$input.prop("checked", false);
                        //$tr.removeClass("selected");

                        $ele.parents("tbody").find("tr").each(function () {
                            var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
                            if (thisCode.substring(0, code.length) == code) {
                                $(this).removeClass("selected");
                                $(this).find('input[type="checkbox"]').prop("checked", false);
                            }
                        })

                    } else {
                        //$input.prop("checked", true);
                        //$tr.addClass("selected");

                        $ele.parents("tbody").find("tr").each(function () {
                            var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
                            if (thisCode.substring(0, code.length) == code) {
                                $(this).addClass("selected");
                                $(this).find('input[type="checkbox"]').prop("checked", true);
                            }
                        })
                    }

                    var chrCodes = [];
                    chrCodes = page.getCheckedRows();
                    if (chrCodes.length > 0) {
                        var argu = {
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							'agencyCode':page.agencyCode,
							'chrCodes':chrCodes,
							'eleCode':'EXPECO'
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
//                                      if (!data[i].hasOwnProperty("chrCode")) {
//                                          console.info("第" + i + "条数据的chrCode(" + data[i].chrCode + ")字段不存在！");
//                                          isRight = false;
//                                          return false;
//                                      }
                                        if (!data[i].hasOwnProperty("agencyCode")) {
                                            console.info("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！");
                                            isRight = false;
                                            return false;
                                        }
                                        if (!data[i].hasOwnProperty("agencyName")) {
                                            console.info("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！");
                                            isRight = false;
                                            return false;
                                        }
                                    }
                                }
                            } else {
                                console.info(data + ":格式不正确！");
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

                });

                //选用页面表格行操作绑定
                $('#expfunc-choose-datatable').on('click', 'tbody td', function (e) {
                    e.preventDefault();
                    var $ele = $(e.target);
                    var $tr = $ele.closest('tr');
                    var $input = $ele.closest('tr').find('input[type="checkbox"]');
                    var code = $input.val();
                    if ($tr.hasClass("selected")) {
                        //$input.prop("checked", false);
                        //$tr.removeClass("selected");

                        $ele.parents("tbody").find("tr").each(function () {
                            var thisCode = $(this).find('input[type="checkbox"]').val();
                            if (thisCode.substring(0, code.length) == code) {
                                $(this).removeClass("selected");
                                $(this).find('input[type="checkbox"]').prop("checked", false);
                            }
                        })

                    } else {
                        //$input.prop("checked", true);
                        //$tr.addClass("selected");

                        $ele.parents("tbody").find("tr").each(function () {
                            var thisCode = $(this).find('input[type="checkbox"]').val();
                            if (thisCode.substring(0, code.length) == code) {
                                $(this).addClass("selected");
                                $(this).find('input[type="checkbox"]').prop("checked", true);
                            }
                        })
                    }
                });

                //ufma.searchHideShow($('#expfunc-data'));
                ma.searchHideShow('index-search', '#expfunc-data');
                ma.searchHideShow('choose-search', '#expfunc-choose-datatable');

                this.get('.ufma-shopping-trolley').on('click', function (e) {
                    page.getDW();
                });

                this.get('.btn-add').on('click', function (e) {
                    e.preventDefault();
                    page.action = 'add';
                    page.setFormEnabled();
                    var data = $('#form-expfunc').serializeObject();
                    page.openEdtWin(data);
                    $('#prompt').text('编码规则：' + ma.fjfa)
                });

                this.get('.btn-close').on('click', function () {
                    var tmpFormData = $('#form-expfunc').serializeObject();
                    if (page.agencyCtrlLevel == '0101' || page.agencyCtrlLevel == '0102') {
                        ma.nameTip = null;
                        if (!$.isNull($('#govBudgetXZ').getObj())) {
                            $('#govBudgetXZ').getObj().clear();
                            $('#govBudgetSY').getObj().clear();
                        }
                        page.editor.close();
                    } else if (!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') == 'block') {
                        ufma.confirm('您修改了部门预算经济分类，关闭前是否保存？', function (action) {
                            if (action) {
                                page.save(false);
                            } else {
                                ma.nameTip = null;
                                if ($('#govBudgetXZ').length != 0) {
                                    $('#govBudgetXZ').getObj().clear();
                                    $('#govBudgetSY').getObj().clear();
                                }
                                page.editor.close();
                            }
                        }, {
                                type: 'warning'
                            });
                    } else {
                        ma.nameTip = null;
                        if ($('#govBudgetXZ').length != 0) {
                            $('#govBudgetXZ').getObj().clear();
                            $('#govBudgetSY').getObj().clear();
                        }
                        page.editor.close();
                    }
                });
                //保存
                this.get('.btn-save-add').on('click', function () {
                    page.save(true);
                });
                this.get('.btn-save').on('click', function () {
                    page.save(false);
                });
                $(document).on('click', '.label-radio', function (e) {
                    e = e || window.event;
                    e.stopPropagation();
                    ufma.deferred(function () {
                        page.getCommonData();
                    });
                });
                $("body").on("click", function () {
                    //编码验证
                    ma.codeValidator('expFunc-chrCode', page.getPageName(page.tableParam).title, page.baseUrl + 'common/findParentList?eleCode=EXPECO&acctCode='+page.acctCode, page.agencyCode, "expfunc-help");
                    //名称验证
                    ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
                })

                this.get('.btn-del').on('click', function (e) {
                    e.stopPropagation();
                    var checkedRow = page.getCheckedRows();
                    if (checkedRow.length == 0) {
                        ufma.alert('请选择部门预算经济分类!', "warning");
                        return false;
                    };
                    page.delRow('del', checkedRow);
                });
                this.get('.btn-active').on('click', function (e) {
                    e.stopPropagation();
                    var checkedRow = page.getCheckedRows();
                    if (checkedRow.length == 0) {
                        ufma.alert('请选择部门预算经济分类!', "warning");
                        return false;
                    }
                    page.delRow('active', checkedRow);
                });
                this.get('.btn-unactive').on('click', function (e) {
                    e.stopPropagation();
                    var checkedRow = page.getCheckedRows();
                    if (checkedRow.length == 0) {
                        ufma.alert('请选择部门预算经济分类!', 'warning');
                        return false;
                    }
                    page.delRow('unactive', checkedRow);
                });
                //增加下级
                $("body").on('click', '.btn-addlower', function (e) {
                    var obj;
                    for (var i = 0; i < page.data.length; i++) {
                        if (page.data[i].chrId == $(this).attr('rowid')) {
                            obj = $.extend(true, {}, page.data[i]);
                        }
                    }
                    
                    page.action = 'add'
                    e.stopPropagation();
                    var checkedRow = [];
                    checkedRow.push($(this).parents("tr").find("input").data("code"));
                    page.delRow('addlower', checkedRow, $(this), obj);
                });
                //下发
                $('#expFuncBtnDown').on('click', function (e) {
                    e.stopPropagation();
                    var gnflData = page.getCheckedRows();
                    if (gnflData.length == 0) {
                        ufma.alert('请选择部门预算经济分类！', 'warning');
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
                       /* filter: { //其它过滤条件
                            '单位性质': { //标签
                                ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
                                formControl: 'combox', //表单元素
                                data: {
                                    rgCode: ma.rgCode,
                                    setYear: ma.setYear
                                },
                                idField: 'ENU_CODE',
                                textField: 'ENU_NAME',
                                filterField: 'agencyType',
                            }
                        },*/
                        buttons: { //底部按钮组
                            '确认下发': {
                                class: 'btn-primary',
                                action: function (data) {
                                    if (data.length == 0) {
                                        ufma.alert('请选择单位！', 'warning');
                                        return false;
                                    }
                                    var dwCode = [];
                                    for (var i = 0; i < data.length; i++) {
                                        if (!data[i].isParent) {
                                           /* dwCode.push({
											"toAgencyCode": data[i].id
										});*/
                                            dwCode.push(data[i].CHR_CODE);
                                        }
                                    }
                                    var url = '/ma/sys/expecoSys/issueSys';
									var argu = {
										'chrCodes': gnflData,
										'toRgCodes': dwCode,
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear,
										"eleCode": 'EXPECO'
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
                                    var callback = function (result) {
                                    	ufma.hideloading(); 
                                        ufma.showTip(result.msg, function () { }, result.flag);
                                        page.modal.close();
                                         page.issueTips(result);
                                    };
                                    ufma.post(url, argu, callback);
                                    //下发后取消全选
                                    $(".datatable-group-checkable,.checkboxes").prop("checked", false);
                                    $("#expfunc-data").find("tbody tr.selected").removeClass("selected");
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

                //"单位级页面监听------------"
                $('.btn-choose').on('click', function (e) {
                    e.preventDefault();
                    page.getExpFuncChoose();
                    page.openChooseWin();
                });
                //选用
                $('.btn-agyChoose').on('click', function (e) {
                    var checkRow = page.getChooseCheckedRows();
                    console.info(JSON.stringify(checkRow));
                    var argu = {
                        chrCodes: checkRow,
                        toAgencyCodes: [page.agencyCode],
                        tableName: 'MA_ELE_EXPECO',
                        rgCode: ma.rgCode,
                        setYear: ma.setYear
                    }
                    //console.info(JSON.stringify(argu));
                    var url = "/ma/sys/expecoSys/issue";
                    var callback = function (result) {
                        if (result) {
                            ufma.showTip("选用成功！", function () {
                                page.choosePage.close();
                                page.initPage();
                            }, "success");
                             page.issueTips(result,true);
                        }
                    };
                    ufma.post(url, argu, callback);
                });

                $('.btn-agyClose').on('click', function (e) {
                    e.preventDefault();
                    page.choosePage.close();
                });

                //编码失去焦点绑定事件 guohx
                $('#expFunc-chrCode').blur(function () {
                    //$("input").css("background-color","#D6D6FF");
                    if ((!$('body').data("code"))) {
                        var chrCode = $('#expFunc-chrCode').val();
                        if ($.isNull(chrCode)) {
                            return false;
                        } else {
                            page.getGovexpecoByParent(chrCode);
                        }

                    } else {
                        var chrCode = $('#expFunc-chrCode').val();
                        page.getGovexpecoByParent(chrCode);
                    }
                });
            },

            getQueryString: function (url) {
                var tableParam;
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    var strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        tableParam = unescape(strs[i].split("=")[1]);
                        break;
                    }
                }
                return tableParam;
            },

            //初始化表单名称
            initFormPage: function () {
                $('#expfunc-choose .u-msg-title h4').text("选用部门经济分类");
                $('#expfunc-edt .u-msg-title h4').text("部门经济分类编辑");
                $('#form-expfunc .form-group .tab-paramcode').text("部门经济分类编码：");
                $('#form-expfunc .form-group .tab-paramname').text("部门经济分类名称：");
            },

            //初始化加载引用单位信息
            reqInitRightIssueAgy: function () {
                var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode':page.agencyCode,
					'chrCodes':[],
					'eleCode':'EXPECO'
				}
				ufma.post("/ma/sys/commonRg/countRgUse", argu, function(result) {   var data = result.data;
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
                                    ufma.alert("第" + i + "条数据的count(" + data[i].issuedCount + ")字段不存在！", "error");
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

            //获取部门预算经济分类父级对应的政府预算经济分类 guohx
            getGovexpecoByParent: function (chrCode) {
                ufma.get(page.baseUrl + 'common/findParentList', {
                    "eleCode": 'GOVEXPECO',
                    "rgCode": ma.rgCode,
                    "setYear": ma.setYear,
                    "agencyCode": ma.agencyCode,
                    "chrCode": chrCode
                }, function (result) {
                    if (result.flag == "success" && (result.data.length != 0)) {
                        var argu = {
                            chrCode: data[0].chrCode,
                            rgCode: ma.rgCode,
                            setYear: ma.setYear,
                            agencyCode: page.agencyCode
                        };
                        var url = "/ma/sys/expecoSys/getParentGovexpeco";
                        var callback = function (result) {
                            if (!$('body').data("code")) { //系统级 新增
                                if (result.data == "") { //没有父级对应的政府预算
                                    page.getGovData();
                                } else {
                                    page.buildComboxXZ(result.data.agencyType1);
                                    page.buildComboxSY(result.data.agencyType2);
                                }
                            } else { //单位级
                                if (!$.isNull(result.data.agencyType1)) { //行政
                                    for (var i = 0; i < result.data.agencyType1.length; i++) {
                                        $('#govBudgetXZ-hide').html("");
                                        $('#govBudgetXZ-hide').addClass('hide');
                                        var $title = $('#govBudgetXZ-title');
                                        $('<label  class="control-label"  name="for-del">' + result.data.agencyType1[i].codeName + '</label>').appendTo($title);
                                    }
                                    $('#govBudget').ufTreecombox({
                                        valueField: 'id',
                                        textField: 'codeName',
                                        //leafRequire: true,
                                        name: 'name',
                                        readOnly: false,
                                        data: result.data.agencyType1
                                    });
                                } else if (!$.isNull(result.data.agencyType2)) {
                                    for (var i = 0; i < result.data.agencyType2.length; i++) {
                                        $('#govBudgetSY-hide').html("");
                                        $('#govBudgetSY-hide').addClass('hide');
                                        var $title = $('#govBudgetSY-title');
                                        $('<label  class="control-label"  name="for-del">' + result.data.agencyType1[i].codeName + '</label>').appendTo($title);
                                    }
                                    $('#govBudget').ufTreecombox({
                                        valueField: 'id',
                                        textField: 'codeName',
                                        //leafRequire: true,
                                        name: 'name',
                                        readOnly: false,
                                        data: result.data.agencyType2
                                    });
                                } else {
                                    $('#govBudgetXZ-hide').removeClass('hide');
                                    $('#govBudgetSY-hide').removeClass('hide');
                                    ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                                    //ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgCode=' + '*' + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function (result) {
                                        $('#govBudget').ufTreecombox({
                                            valueField: 'id',
                                            textField: 'codeName',
                                            //leafRequire: true,
                                            name: 'name',
                                            readOnly: false,
                                            data: result.data
                                        });
                                    })
                                }
                            }

                        }
                        ufma.get(url, argu, callback);
                    }
                })

            },
            getGovData: function () {
                var url = "/ma/sys/common/getEleTree";
                var argu = {
                    "agencyCode": page.agencyCode,
                    "rgCode": ma.rgCode,
                    //"rgCode": '*',
                    "setYear": ma.setYear,
                    "eleCode": 'GOVEXPECO'
                };
                var callback = function (result) {
                    page.buildComboxXZ(result.data);
                    page.buildComboxSY(result.data);
                }
                ufma.get(url, argu, callback);
            },
            buildComboxXZ: function (XZData) {
                $('#govBudgetXZ').ufTreecombox({
                    idField: 'id',
                    textField: 'codeName',
                    //leafRequire: true,
                    name: 'name',
                    readOnly: false,
                    data: XZData,
                    onchange: function (node) {

                    }
                    // onComplete: function (sender) {
                    //     $('#govBudgetXZ').getObj().val('1');
                    // }
                });
            },
            buildComboxSY: function (SYData) {
                page.accoOut = $('#govBudgetSY').ufTreecombox({
                    valueField: 'id',
                    textField: 'codeName',
                    //leafRequire: true,
                    name: 'name',
                    readOnly: false,
                    data: SYData,
                    onchange: function (node) { }
                    // onComplete: function (sender) {
                    //     $('#govBudgetSY').getObj().val('1');
                    // }
                });
            },
            initPage: function () {
                //初始化标题头
                $('.caption-subject').text("部门经济分类");
                this.initFormPage();
                this.getCommonData();
            },

            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                var pfData = ufma.getCommonData();
                page.agencyCode = pfData.svAgencyCode;
                page.agencyName = pfData.svAgencyName;
                page.rgCode = pfData.svRgCode;
                page.tableParam = 'MA_ELE_EXPECO';
              //  if (!$('body').data("code")) { //系统级
                    $('#query-all').html('');
                    var $dl = $('#query-all');
                    var $dl0 = $('<div id="query-tj" class="form-body">').appendTo($dl);
                    var $dl2 = $('<div>').addClass('form-row').appendTo($dl0);
                    var $dl3 = $(' <div class="form-group label-group" style="float: left;">').appendTo($dl2);
                    $('<div class="control-label">单位类型：</div>').appendTo($dl3);
                    var $dl4 = $('<div class="control-element id="agencyType">').appendTo($dl3);
                    $('<a name="divkind" value="1" class="label label-radio selected">行政</a>').appendTo($dl4);
                    $('<a name="divkind" value="2" class="label label-radio ">事业</a>').appendTo($dl4);
                    //$('</div>').appendTo($dl3);
                    //$('</div>').appendTo($dl2);
                    var $dl5 = $('<div class="form-group label-group" id="enabled"  style="float: left;margin-left:25px">').appendTo($dl2);
                    $('<div class="control-label">启用状态：</div>').appendTo($dl5);
                    var $dl6 = $('<div class="control-element">').appendTo($dl5);
                    $('<a name="enabled" value="-1" class="label label-radio selected">全部</a>').appendTo($dl6);
                    $('<a name="enabled" value="1" class="label label-radio ">启用</a>').appendTo($dl6);
                    $('<a name="enabled" value="0" class="label label-radio">停用</a>').appendTo($dl6);
                    //$('</div>').appendTo($dl5);
                    //$('</div>').appendTo($dl2);
                    //$('</div>').appendTo($dl);
                    $('<div class="clearfix"></div>').appendTo($dl2);
              //  };
                //初始化title
                if ($('body').data("code")) {
                    $(document).attr("title", "部门经济分类（单位级）");
                    page.cbAgency = $("#cbAgency").ufmaTreecombox2({
                    	url: "/ma/sys/commonRg/getAllRgInfo?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
                        leafRequire: false,
                        onchange: function (data) {
                        	/*if(data.isLeaf != '0'){
								//末级单位不显示下发按钮
								//$(".btn-senddown").hide();
							}else{
								//$(".btn-senddown").show();
							}*/
                        	page.divKind = data.divKind
                            //page.agencyCode = page.cbAgency.getValue();
                        	pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
                            page.agencyType = data.agencyType
                            page.initPage();
                            $("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
                       		ufma.get("/ma/sys/element/getEleDetail", {
		                        "eleCode": 'EXPECO',
								agencyCode: page.agencyCode,
		                        "rgCode": ma.rgCode,
		                        "setYear": ma.setYear
		                    }, function (result) {
		                        var data = result.data;
		                        page.agencyCtrlLevel = data.agencyCtrllevel;
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
		                    })
                       		ma.initfifa('/ma/sys/element/getEleDetail', {
		                        "eleCode": 'EXPECO',
								'agencyCode': page.agencyCode,
		                        "rgCode": ma.rgCode,
		                        "setYear": ma.setYear
			                });
                        },
                        initComplete: function (sender) {
                            if(!$.isNull(page.rgCode)) {
								page.cbAgency.val(page.rgCode);
							} else {
								page.cbAgency.val(1);
							}
                            //page.agencyCode = page.cbAgency.getValue();
                            //page.agencyType = data.agencyType
                            pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
                        }
                    });
//                  page.baseUrl = '/ma/agy/';
                    page.baseUrl = '/ma/sys/';
//					ma.initfifa('/ma/sys/element/getEleDetail', {
//						eleCode: 'EXPECO',
//						agencyCode: page.agencyCode,
//						rgCode: ma.rgCode,
//						setYear: ma.setYear
//					});
                    ufma.get("/ma/sys/element/getEleDetail", {
                        "eleCode": 'EXPECO',
						'agencyCode': page.agencyCode,
                        "rgCode": ma.rgCode,
                        "setYear": ma.setYear
                    }, function (result) {
                        var data = result.data;
                        page.agencyCtrlLevel = data.agencyCtrlLevel;
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
                    })
                } else {
                    $(document).attr("title", "部门经济分类");
                    page.baseUrl = '/ma/sys/';
                    page.agencyCode = "*";
					ma.rgCode = pfData.svRgCode;
					page.rgCode = pfData.svRgCode;
                    page.initPage();
                    //购物车表格初始化
                    this.reqInitRightIssueAgy();
                    page.getGovData();
                }
                ufma.parse(page.namespace);
//              ma.initfifa('/ma/sys/element/getElementCodeRule', {
//                  "tableName": 'MA_ELE_EXPECO',
//                  "rgCode": ma.rgCode,
//                  "setYear": ma.setYear
//              });
             	ma.initfifa('/ma/sys/element/getEleDetail', {
                        "eleCode": 'EXPECO',
						agencyCode: page.agencyCode,
                        "rgCode": ma.rgCode,
                        "setYear": ma.setYear
                });
//              ufma.getEleCtrlLevel("/ma/sys/common/queryCtrlLevel?tableName=MA_ELE_EXPECO&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear, function (result) {
//                  $('.table-sub-info').text(result);
//              });
                this.onEventListener();

                //请求自定义属性
                //reqFieldList(page.agencyCode, "EXPECO");

            }

        }
    }();

    page.init();
});
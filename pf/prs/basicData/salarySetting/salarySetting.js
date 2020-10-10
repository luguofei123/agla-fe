$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = { action: action }
            window.closeOwner(data)
        }
    }
    var stopPropagation = function (e) {
        if (e.stopPropagation) e.stopPropagation()
        else e.cancelBubble = true
    }

    var svData = ufma.getCommonData()
    // console.log(svData);

    //接口URL集合
    var interfaceURL = {
        getPrsItemSettingList: '/prs/prsitemco/getPrsItemSettingList', // 查询工资项显示设置列表
        updatePrsItemSettingList: '/prs/prsitemco/updatePrsItemSettingList', // 保存工资项显示设置
    }

    var page = (function () {
        return {
            //表格列
            columns: function () {
                var columns = [
                    {
                        data: 'pritemCode',
                        title: '工资项代码',
                        className: 'center isprint nowrap ellipsis'
                    },
                    {
                        data: 'pritemName',
                        title: '工资项目',
                        className: 'center isprint nowrap ellipsis'
                    },
                    {
                        data: 'pritemProp',
                        title: '工资项目性质',
                        className: 'center isprint nowrap ellipsis',
                        render: function (data, type, rowdata, meta) {
                            // console.log('data:',data);
                            // console.log('type:',type);
                            // console.log('rowdata:',rowdata);
                            // console.log('meta:',meta);
                            var a = 'selected="selected"', b = '', c = '', d = '', e = '';

                            function statefactory(index) {
                                var arr = ['', '', '', '', ''];
                                arr[index] = 'selected="selected"';
                                a = arr[0], b = arr[1], c = arr[2], d = arr[3], e = arr[4];
                            }
                            if (data) switch (data) {
                                case '0':
                                    statefactory(0)
                                    break;
                                case '1':
                                    statefactory(1)
                                    break;
                                case '2':
                                    statefactory(2)
                                    break;
                                case '3':
                                    statefactory(3)
                                    break;
                                case '4':
                                    statefactory(4)
                                    break;
                            }
                            return '<select class="uselect" data-index="' + meta.row + '" data-type="PROP"><option value="0" ' + a + '></option><option value="1" ' + b + '>应发项</option><option ' + c + ' value="2">实发项</option><option ' + d + ' value="3">扣发项</option><option ' + e + ' value="4">补发项</option></select>';
                        }
                    },
                    {
                        data: 'pritemDataSource',
                        title: '工资数据来源',
                        className: 'center isprint nowrap ellipsis',
                        render: function (data, type, rowdata, meta) {
                            var a = 'selected="selected"', b = '', c = '', d = '';

                            function statefactory(index) {
                                var arr = ['', '', '', ''];
                                arr[index] = 'selected="selected"';
                                a = arr[0], b = arr[1], c = arr[2], d = arr[3];
                            }
                            if (data) switch (data) {
                                case '01':
                                    statefactory(0)
                                    break;
                                case '02':
                                    statefactory(1)
                                    break;
                                case '03':
                                    statefactory(2)
                                    break;
                                case '04':
                                    statefactory(3)
                                    break;
                            }
                            return '<select class="uselect" data-index="' + meta.row + '" data-type="SOU"><option value="01" ' + a + '>来源1</option><option value="02" ' + b + '>来源2</option><option value="03" ' + c + '>来源3</option><option value="04" ' + d + '>来源4</option></select>';
                        }
                    },
                    {
                        data: 'showIndex',
                        title: '显示顺序',
                        className: 'center',
                        render: function (data, type, rowdata, meta) {
                            // data ? data : data = meta.row + 1;
                            page.datalist[meta.row].showIndex = meta.row + 1;
                            return meta.row + 1;
                        }
                    },
                    {
                        data: 'personDis',
                        title: '个人端是否显示',
                        className: 'center isprint nowrap ellipsis',
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return ''
                            }
                            var str1 = '', str2 = '';
                            data === 'Y' ? str1 = 'selected="selected"' : str2 = 'selected="selected"';
                            return '<select class="uselect" data-index="' + meta.row + '" data-type="DIS"><option value="Y" ' + str1 + '>是</option><option value="N" ' + str2 + '>否</option></select>';
                        }
                    },
                    {
                        data: 'smsDis',
                        title: '短信是否显示',
                        className: 'center isprint nowrap ellipsis',
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return ''
                            }
                            var str1 = '', str2 = '';
                            data === 'Y' ? str1 = 'selected="selected"' : str2 = 'selected="selected"';
                            return '<select class="uselect" data-index="' + meta.row + '" data-type="SMS"><option value="Y" ' + str1 + '>是</option><option value="N" ' + str2 + '>否</option></select>';
                        }
                    },
                    {
                        title: '操作',
                        data: null,
                        className: 'center',
                        render: function (data, type, rowdata, meta) {
                            return '<a class="btn btn-icon-only btn-permission" data-type="UP" data-index="' + meta.row + '" action= "" title="上移"><span class="glyphicon icon-angle-top"></span></a>' +
                                '<a class="btn btn-icon-only btn-permission ml10" data-type="DOWN" data-index="' + meta.row + '" action= "" title="下移"><span class="glyphicon icon-angle-bottom"></span></a>' +
                                '<a class="btn btn-icon-only btn-permission ml10" data-type="TOP" data-index="' + meta.row + '" action= "" title="置顶"><span class="glyphicon icon-arrow-top"></span></a>' +
                                '<a class="btn btn-icon-only btn-permission ml10" data-type="BOTTOM" data-index="' + meta.row + '" action= "" title="置底"><span class="glyphicon icon-arrow-bottom"></span></a>';
                        }
                    },
                ]
                return columns
            },
            queryTableData: function () {
                ufma.post(interfaceURL.getPrsItemSettingList, { pritemCode: "", pritemName: "" }, function (result) {
                    ufma.hideloading()
                    page.datalist = result.data
                    page.initTable(result.data)
                })
            },
            initPritemProp: function (code) {
                switch (code) {
                    case '1':
                        return '应发项';
                    case '2':
                        return '实发项';
                    case '3':
                        return '扣发项';
                    case '4':
                        return '补发项';
                    default:
                        return '';

                }
            },
            initPritemDataSource: function (code) {
                switch (code) {
                    case '01':
                        return '来源1';
                    case '02':
                        return '来源2';
                    case '03':
                        return '来源3';
                    case '04':
                        return '来源4';
                    default:
                        return '';

                }
            },
            initBoolean: function (code) {
                switch (code) {
                    case 'N':
                        return '否';
                    case 'Y':
                        return '是';
                }
            },
            // 初始化表格
            initTable: function (data) {


                var id = 'salary-set-table';
                var $table = $('#' + id + ' tbody');
                var rows = '';
                data.forEach(function (item, index) {
                    rows +=
                        '<tr agencyCode="' +
                        item.agencyCode + '" ' +
                        'createDate="' +
                        item.createDate + '" ' +
                        'createUser="' +
                        item.createUser + '" ' +
                        'dataType="' +
                        item.dataType + '" ' +
                        'isDisplay="' +
                        item.isDisplay + '" ' +
                        'isSystem="' +
                        item.isSystem + '" ' +
                        'isUsed="' +
                        item.isUsed + '" ' +
                        'latestOpDate="' +
                        item.latestOpDate + '" ' +
                        'latestOpUser="' +
                        item.latestOpUser + '" ' +
                        'listIndex="' +
                        item.listIndex + '" ' +
                        'personDis="' +
                        item.personDis + '" ' +
                        'pritemCode="' +
                        item.pritemCode + '" ' +
                        'pritemDataSource="' +
                        item.pritemDataSource + '" ' +
                        'pritemName="' +
                        item.pritemName + '" ' +
                        'pritemProp="' +
                        item.pritemProp + '" ' +
                        'pritemType="' +
                        item.pritemType + '" ' +
                        'rgCode="' +
                        item.rgCode + '" ' +
                        'setYear="' +
                        item.setYear + '" ' +
                        'smsDis="' +
                        item.smsDis + '" ' +
                        '>' +
                        '<td class="center isprint">' + item.pritemCode +
                        '</td>' +
                        '<td class="isprint nowrap ellipsis">' + item.pritemName +
                        '</td>' +
                        '<td class="center isprint pritemProp">' + page.initPritemProp(item.pritemProp) +
                        '</td>' +
                        '<td class="center isprint pritemDataSource">' + page.initPritemDataSource(item.pritemDataSource) +
                        '</td>' +
                        '<td class="center isprint showIndex">' + (parseInt(index) + 1) +
                        '</td>' +
                        '<td class="center isprint personDis">' + page.initBoolean(item.personDis) +
                        '</td>' +
                        '<td class="center isprint smsDis">' + page.initBoolean(item.smsDis) +
                        '</td>' +
                        '<td class="center nowrap btnGroup minW">' +
                        '<a class="btn btn-icon-only btn-edit btn-permission" pritemCode="' +
                        item.pritemCode +
                        '" pritemName="' +
                        item.pritemName +
                        '" pritemProp="' +
                        item.pritemProp +
                        '" pritemDataSource="' +
                        item.pritemDataSource +
                        '" personDis="' +
                        item.personDis +
                        '" smsDis="' +
                        item.smsDis +
                        '" data-index="' +
                        index +
                        '" data-toggle="tooltip" action= "" title="编辑">' +
                        '<span class="glyphicon icon-edit"></span></a>' +
                        '<a class="btn btn-icon-only btn-sm btnDrag" data-index="' + index + '" data-toggle="tooltip" title="拖动排序">' +
                        '<span class="glyphicon icon-drag"></span></a>' +
                        '</td>' +
                        '</tr>';
                })
                $table.html('');
                var $tr = $(rows).appendTo($table);
                $tr.find('td.btnGroup .btnDrag').on('mousedown', function (e) {
                    var callback = function () {
                        page.adjAssitNo();
                    };
                    $('#' + id).tableSort(callback);
                });
                ufma.isShow(page.reslist)
                // var toolBar = $('#' + id).attr('tool-bar')
                // page.DataTable = $('#' + id).DataTable({
                //     data: data,
                //     processing: true, //显示正在加载中
                //     paging: false,
                //     columns: page.columns(),
                //     bFilter: false, //去掉搜索框
                //     bLengthChange: false, //每页显示多少条数据
                //     bInfo: false, //页脚信息
                //     bSort: false, //排序功能
                //     bDestroy: true,
                //     dom: '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
                //     buttons: [
                //         {
                //             extend: 'print',
                //             text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                //             exportOptions: {
                //                 columns: '.isprint'
                //             },
                //             customize: function (win) {
                //                 $(win.document.body)
                //                     .find('h1')
                //                     .css('text-align', 'center')
                //                 $(win.document.body).css('height', 'auto')
                //             }
                //         },
                //         {
                //             extend: 'excelHtml5',
                //             text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                //             exportOptions: {
                //                 columns: '.isprint'
                //             },
                //             customize: function (xlsx) {
                //                 var sheet = xlsx.xl.worksheets['sheet1.xml']
                //             }
                //         }
                //     ],
                //     initComplete: function (settings, json) {
                //         //打印&导出按钮
                //         $('.datatable-toolbar').appendTo('#dtToolbar')
                //         // $('#datatables-print').html('');
                //         // $('#datatables-print').append($(".datatable-toolbar"));
                //         $('.datatable-toolbar .buttons-print')
                //         .addClass('btn-print btn-permission')
                //         .attr({
                //             'data-toggle': 'tooltip',
                //             title: '打印'
                //         })
                //         $('.datatable-toolbar .buttons-excel')
                //         .addClass('btn-export btn-permission')
                //         .attr({
                //             'data-toggle': 'tooltip',
                //             title: '导出'
                //         })

                //         //导出begin
                //         $('#dtToolbar .buttons-excel')
                //         .off()
                //         .on('click', function(evt) {
                //         evt = evt || window.event
                //         evt.preventDefault()
                //         ufma.expXLSForDatatable($('#' + id), '工资项显示设置')
                //         })
                //         //导出end

                //         $('.uselect').on('change', function (e) {
                //             // console.log(e.target.dataset.type);
                //             var type = e.target.dataset.type, value = e.target.value,index = e.target.dataset.index,
                //             data = page.datalist;
                //             function _changepropDataListItem(index,value) { 
                //                 data[index].pritemProp=value;
                //             }
                //             function _changesouDataListItem(index,value) {
                //                 data[index].pritemDataSource=value;
                //              }
                //             function _toogledisDataListItem(index) { 
                //                 data[index].personDis==='Y'?data[index].personDis='N':data[index].personDis='Y';
                //             }
                //             function _tooglesmsDataListItem(index) { 
                //                 data[index].smsDis==='Y'?data[index].smsDis='N':data[index].smsDis='Y';
                //             }
                //             switch (type) {
                //                 case 'PROP':
                //                         _changepropDataListItem(index,value);
                //                     break;
                //                 case 'SOU':
                //                         _changesouDataListItem(index,value);
                //                     break;
                //                 case 'DIS':
                //                         _toogledisDataListItem(index);
                //                     break;
                //                 case 'SMS':
                //                         _tooglesmsDataListItem(index);
                //                     break;
                //             }
                //         })
                //         $('#salary-set-table a').on('click', function (e) {
                //             var index = parseInt(e.currentTarget.dataset.index), list = page.datalist, type = e.currentTarget.dataset.type;
                //             // console.log(type);
                //             function moveUp(index, data) {
                //                 if (index <= 0) {
                //                     return;
                //                 }
                //                 var box = data[index];
                //                 data[index] = data[index - 1];
                //                 data[index - 1] = box;
                //                 page.initTable(data);
                //             }
                //             function moveDown(index, data) {
                //                 if (index >= data.length - 1) {
                //                     return;
                //                 }
                //                 var box = data[index];
                //                 data[index] = data[index + 1];
                //                 data[index + 1] = box;
                //                 page.initTable(data);
                //             }
                //             function setTop(index, data) {
                //                 var len = data.length;
                //                 var cur = data.splice(index, 1);
                //                 data.unshift(cur[0]);
                //                 page.initTable(data);
                //             }
                //             function setBottom(index, data) {
                //                 var len = data.length;
                //                 var cur = data.splice(index, 1);
                //                 data.push(cur[0]);
                //                 page.initTable(data);
                //             }
                //             switch (type) {
                //                 case 'UP':
                //                     moveUp(index, list);
                //                     break;
                //                 case 'DOWN':
                //                     moveDown(index, list);
                //                     break;
                //                 case 'TOP':
                //                     setTop(index, list);
                //                     break;
                //                 case 'BOTTOM':
                //                     setBottom(index, list);
                //                     break;
                //             }
                //         })
                //         $('#salary-set-table_wrapper').ufScrollBar({
                //             hScrollbar: true,
                //             mousewheel: false
                //         })
                //         ufma.setBarPos($(window))
                // //驻底end

                // ufma.isShow(page.reslist)
                // $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
                // },
                // drawCallback: function (settings) {
                //     // if (data.length > 0) {
                //     //     $('#' + id).fixedColumns({})
                //     // }

                //     //权限控制
                //     ufma.isShow(page.reslist)
                //     ufma.setBarPos($(window))
                // }
                // })
            },
            //序号
            adjAssitNo: function () {
                var idx = 0;
                $('#salary-set-table tbody tr').each(function () {
                    idx++;
                    $(this).find('.showIndex').html(idx);
                });
            },
            // 打开弹窗
            openWin: function (ele, index) {
                var title = '编辑工资项显示设置', pritemCode = ele.attr('pritemCode'),
                    pritemCode = ele.attr('pritemCode'),
                    pritemName = ele.attr('pritemName'),
                    pritemProp = ele.attr('pritemProp'),
                    pritemDataSource = ele.attr('pritemDataSource'),
                    personDis = ele.attr('personDis'),
                    smsDis = ele.attr('smsDis'),
                    openData = {
                        pritemCode: pritemCode,
                        pritemName: pritemName,
                        pritemProp: pritemProp,
                        pritemDataSource: pritemDataSource,
                        personDis: personDis,
                        smsDis: smsDis,
                    }
                ufma.open({
                    url: 'editSalarySetting.html',
                    title: title,
                    width: 450,
                    height: 450,
                    data: openData,
                    ondestory: function (data) {
                        //窗口关闭时回传的值
                        if (data.action) {
                            // console.log(data.msg.pritemCode);
                            var $tr = $('#salary-set-table tbody tr').eq(index);
                            $tr.attr({
                                pritemProp: data.msg.pritemProp,
                                pritemDataSource: data.msg.pritemDataSource,
                                personDis: data.msg.personDis,
                                smsDis: data.msg.smsDis,
                            });
                            $tr.find('.pritemProp').html(page.initPritemProp(data.msg.pritemProp));
                            $tr.find('.pritemDataSource').html(page.initPritemDataSource(data.msg.pritemDataSource));
                            $tr.find('.personDis').html(page.initBoolean(data.msg.personDis));
                            $tr.find('.smsDis').html(page.initBoolean(data.msg.smsDis));
                            // ufma.showTip('x修改成功', function () { }, 'success')
                        }
                    }
                })
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission()
                ufma.isShow(page.reslist)
                //初始化单位
                // poj.initAgencyList();
                //请求单位
                // poj.reqAgencyList();

                //初始化表格
                ufma.showloading('正在加载数据请耐心等待...')
                page.queryTableData();

            },
            onEventListener: function () {
                // 查询按钮点击事件
                $('#btnQuery').on('click', function () {
                    page.queryTableData()
                })
                // 保存按钮点击事件
                $('#btn-save-salary-set').click(function (e) {
                    var data = []
                    $('#salary-set-table tbody tr').each(function (index, item) {
                        var trdata = $(item).context.attributes;
                        var obj = {};
                        for (var prop in trdata) {
                            if (!isNaN(prop)) {
                                obj[trdata[prop].nodeName] = trdata[prop].nodeValue;
                            }
                        }
                        obj.showIndex = index + 1;
                        data.push(obj);
                    })
                    console.log(data);
                    ufma.post(interfaceURL.updatePrsItemSettingList, { settingList: data }, function (result) {
                        ufma.hideloading()
                        if(result.flag == "success"){
                        	page.queryTableData();
                        }
                        ufma.showTip(result.msg, function () { }, 'success');
                    })
                });
                // 编辑
                $(document).on('click', 'a.btn-edit', function () {
                    page.openWin($(this), $(this).attr('data-index'))
                })

            },

            //此方法必须保留
            init: function () {
                ufma.parse()
                page.initPage()
                page.onEventListener()
                ufma.parseScroll()
            }
        }
    })()
    /////////////////////
    page.init()

})
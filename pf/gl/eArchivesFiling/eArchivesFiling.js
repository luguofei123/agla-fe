$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = { action: action };
            window.closeOwner(data);
        }
    };
    /**
     * blog格式转base64
     * @param {*} blob blog流
     * @param {*} callback 回调
     */
    function blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    }
    /**
     * 请求pdf返回流
     * @param {*} reportCode 
     * @param {*} templId 
     * @param {*} groupDef 组织的参数
     * @param {*} callback 回调函数
     */
    function getPdfStream(reportCode, templId, groupDef, successCallBack, errorCallBack) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append('reportCode', reportCode);
        formData.append('templId', templId);
        formData.append('groupDef', groupDef);
        formData.append('printBackground', '1');
        xhr.open('POST', '/pqr/api/printpdfstreambydata', true);
        xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8');
        xhr.responseType = 'blob';
        //保存文件
        xhr.onload = function () {
            if (xhr.status === 200) {
                blobToDataURL(xhr.response, function (fileStreamOfbase64) {
                    typeof (successCallBack) == 'function' ? successCallBack(fileStreamOfbase64) : false;
                });
            }
        }
        //状态改变时处理返回值
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //通信成功时
                if (xhr.status === 200) {
                    //交易成功时
                } else {
                    typeof (errorCallBack) == 'function' ? errorCallBack(xhr) : false;
                }
            }
        }
        xhr.send(formData);
    }
    var pageLength = 25;
    var svData = ufma.getCommonData();
    console.log(svData)

    //接口URL集合
    var interfaceURL = {
        agencyList: '/gl/eleAgency/getAgencyTree',//单位列表接口
        acctList: "/gl/eleCoacc/getRptAccts", //账套列表接口
        archive: '/gl/GlFileEdoc/archive',//归档按钮
        search: '/gl/GlFileEdoc/search',//查询按钮
        list: '/gl/print/list',//凭证数据
        getVouName: '/gl/eleVouType/getVouType',//查询凭证类型名称
        getPrtDataPdf: '/gl/vouPrint/getPrtDataPdf',//凭证打印预处理
        getPrtTmplPdfNew: '/gl/vouPrint/getPrtTmplPdfNew',//查询单位账套凭证打印方案
        printpdfstreambydata: '/pqr/api/printpdfstreambydata',//生成pdf流
        getAccItemTree: '/gl/common/glAccItemData/getAccItemTree',//GET 获取全部会计科目（已不使用，换成下面的）
        glRptAllPrint: '/gl/rpt/getReportData/GL_RPT_ALLPRINT', //POST 来源自账簿打印 用来筛选会计科目 使科目能根据“含未结转凭证”和“发生额及余额为零不打印”两个条件进行筛选
        getRptJournal: '/gl/rpt/getReportData/GL_RPT_JOURNAL',//查询明细账
        getRptBal: '/gl/rpt/getReportData/GL_RPT_BAL',//查询余额表
        getRptLedger: '/gl/rpt/getReportData/GL_RPT_LEDGER',//查询总账
        getStream: '/gl/print/getStream', //向后端发送文件
        getRmisPDF: '../../../ur/pdf/interface/printPDF', //post 获取报表
        getTaskAndRpts: '../../../ur/pdf/interface/getTaskAndRpts', //post 获取报表系统的任务及任务下的报表信息
        getFisperdStatus: '/gl/GlFileEdoc/getFisperdStatus' //GET 判断期间是否结账
    };


    var page = function () {
        return {
            filePathObj: {},
            nowAgencyCode: svData.svAgencyCode,
            nowAcctCode: svData.svAcctCode,
            rgCode: svData.svRgCode, //区划代码
            bennian: svData.svSetYear, //本年 年度
            benqi: svData.svFiscalPeriod, //本期 月份
            today: svData.svTransDate, //今日 年月日
            rmisTreeComboxStr: '',
            initTable: function () {
                var columns = [
                    {
                        title: "单位",
                        data: "agencyCodeName",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "账套",
                        data: "acctCodeName",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "归档档案编码",
                        data: "chrCode",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "归档期间",
                        data: "fisPerd",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "归档人",
                        data: "userName",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "归档日期",
                        data: "operateDate",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "归档状态",
                        data: "state",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    {
                        title: "申请归档次数",
                        data: "archiveTimes",
                        className: 'tc nowrap',
                        width: 100,
                        render: function (data, type, rowdata, meta) {
                            return data ? data : '';
                        }
                    },
                    // {
                    //     title: "归档内容",
                    //     data: null,
                    //     className: 'tc nowrap',
                    //     width: 100,
                    //     render: function (data, type, rowdata, meta) {
                    //         // return data ? data : '';
                    //         return '';
                    //     }
                    // },

                ];
                var id = 'eArchivesFilingTable';
                page.table = $('#' + id).dataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "autoWidth": false,
                    "bDestory": true,
                    "processing": true, //显示正在加载中
                    // "paging": false, //分页
                    "searching": false,
                    "serverSide": false,
                    "ordering": false,
                    "bInfo": false,
                    "columns": columns,
                    "bFilter": false, //去掉搜索框
                    "bLengthChange": true, //去掉每页显示多少条数据
                    "processing": true, //显示正在加载中
                    "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, '全部']],
                    "pagingType": 'full_numbers', //分页样式
                    "lengthChange": true, //是否允许用户自定义显示数量p
                    "pageLength": pageLength,
                    "bInfo": true, //页脚信息
                    "bSort": false, //排序功能
                    "data": [],
                    "dom": '<"datatable-toolbar">rt<"' + id + '-paginate"ilp>',
                    "initComplete": function (settings, json) {
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info')
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo(
                                $(toolBar + ' .tool-bar-body')
                            )
                        }
                        $info.html('')
                        $('.' + id + '-paginate').appendTo($info)
                        $('#eArchivesFilingTable_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        })
                        ufma.setBarPos($(window))
                        //驻底end
                        ufma.isShow(page.reslist)

                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
                    },
                    "drawCallback": function (settings) {
                        $('#eArchivesFilingTable')
                            .find('td.dataTables_empty')
                            .text('')
                            .append(
                                '<img src="' +
                                bootPath +
                                'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
                            )
                        setTimeout(function () {
                            ufma.setBarPos($(window))
                            $('#eArchivesFilingTable_wrapper').ufScrollBar('update')
                            //权限控制
                            ufma.isShow(page.reslist)
                        }, 30)
                    }
                })
            },
            queryTable: function () {
                var startDate = $("#dateStart").getObj().getValue();
                var startEnd = $("#dateEnd").getObj().getValue();
                var startFisperd = (new Date(startDate)).getMonth() + 1; //起始期间(只有月份，如7)
                var endFisperd = (new Date(startEnd)).getMonth() + 1; //截止期间(只有月份，如7)
                var argu = {
                    setYear: svData.svSetYear,
                    rgCode: svData.svRgCode,
                    agencyCode: page.nowAgencyCode,
                    acctCode: page.nowAcctCode,
                    startMonth: startFisperd,
                    endMonth: endFisperd,
                    userId: svData.svUserId
                };
                ufma.ajax(interfaceURL.search, "get", argu, function (result) {
                    if (result.data) {
                        page.table.fnClearTable();
                        page.table.fnAddData(result.data, true);
                    } else { }
                })
            },
            initAgencyList: function () {
                page.cbAgency = $("#cbAgency").ufmaTreecombox2({
                    valueField: 'id',
                    textField: 'codeName',
                    readonly: false,
                    placeholder: '请选择单位',
                    icon: 'icon-unit',
                    onchange: function (data) {
                        //给全局单位变量赋值
                        page.nowAgencyCode = data.id;
                        page.nowAgencyName = data.name;

                        //请求账套列表
                        page.reqAcctList();
                        //缓存单位账套
                        var params = {
                            selAgecncyCode: page.nowAgencyCode,
                            selAgecncyName: page.nowAgencyName,
                            selAcctCode: page.nowAcctCode,
                            selAcctName: page.nowAcctName
                        }
                        ufma.setSelectedVar(params);
                    }
                });
            },
            //请求单位列表
            reqAgencyList: function () {
                ufma.ajax(interfaceURL.agencyList, "get", "", function (result) {
                    if (result.data && result.data.length > 0) {
                        var data = result.data;
                        page.cbAgency = $("#cbAgency").ufmaTreecombox2({
                            data: result.data
                        });

                        var code = data[0].id;
                        var name = data[0].name;
                        var codeName = data[0].codeName;

                        if (page.nowAgencyCode != "" && page.nowAgencyName != "") {
                            var agency = $.inArrayJson(data, 'id', page.nowAgencyCode);
                            if (agency != undefined) {
                                page.cbAgency.val(page.nowAgencyCode);
                            } else {
                                page.nowAgencyCode = code;
                                page.nowAgencyName = name;
                                page.cbAgency.val(code);
                            }
                        } else {
                            page.nowAgencyCode = page.cbAgency.getValue();
                            page.nowAgencyName = page.cbAgency.getText();
                            page.cbAgency.val(code);
                        }

                    } else {
                        return;
                    }
                });
            },
            //初始化账套选择样式及change事件
            initAcctList: function () {
                page.cbAcct = $("#cbAcct").ufmaCombox2({
                    valueField: 'code',
                    textField: 'codeName',
                    readOnly: false,
                    placeholder: '请选择账套',
                    icon: 'icon-book',
                    onchange: function (data) {
                        //给全局账套变量赋值
                        page.nowAccsCode = data.accsCode;
                        page.nowAcctCode = data.code;
                        page.nowAcctName = data.name;
                        page.isParallelsum = data.isParallel;
                        page.isDoubleVousum = data.isDoubleVou;
                        //缓存单位账套
                        var params = {
                            selAgecncyCode: page.nowAgencyCode,
                            selAgecncyName: page.nowAgencyName,
                            selAcctCode: page.nowAcctCode,
                            selAcctName: page.nowAcctName
                        }
                        ufma.setSelectedVar(params);
                    }
                });

            },
            //请求账套列表
            reqAcctList: function () {
                var acctArgu = {
                    "agencyCode": page.nowAgencyCode,
                    "userId": page.nowUserId,
                    "setYear": page.nowSetYear
                };
                ufma.ajax(interfaceURL.acctList, "get", acctArgu, function (result) {
                    var data = result.data;
                    page.cbAcct = $("#cbAcct").ufmaCombox2({
                        data: data
                    });
                    if (data.length > 0) {
                        var code = data[0].code;
                        var name = data[0].name;
                        var codeName = data[0].codeName;
                        page.cbAcct.val(code);
                        page.nowAcctCode = code;
                        page.nowAcctName = name;
                    }
                });
            },
            dateBenQi: function (startId, endId) {
                var ddYear = new Date(page.today).getFullYear();
                var ddMonth = new Date(page.today).getMonth();
                var tdd = new Date(ddYear, ddMonth + 1, 0)
                var ddDay = tdd.getDate();
                $("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
                $("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
            },
            dateBenNian: function (startId, endId) {
                var ddYear = page.bennian;
                $("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
                $("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
            },
            checkDate: function (fmtDate, id) {
                var date = svData.svTransDate;
                var year = new Date(date).getFullYear();
                if (fmtDate != "") {
                    var curDate = new Date(fmtDate)
                    var curYear = curDate.getFullYear();
                    if (curYear !== "" && curYear !== undefined && year !== curYear) {
                        ufma.showTip("只能选择登录年度日期", function () {
                            $(id).getObj().setValue("")
                        }, "warning");

                    }
                }
            },
            initRmisTreeCombox: function (){
                $.ajax({
                    url: interfaceURL.getTaskAndRpts+'?nd='+svData.svSetYear+'&rg='+svData.svRgCode,
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        console.log(result);
                        if(result.result === 'success'){
                            var result = result.data, arr = [], codeList = []
                            for(var prop in result){
                                var obj = {
                                    code: prop,
                                    name: result[prop].taskName,
                                    perdType: result[prop].perdType,
                                    children: []
                                }
                                var codes = []
                                result[prop].rpts.forEach(function(item){
                                    var it = {
                                        code: item.rptCode,
                                        name: item.rptName,
                                        taskCode: prop,
                                        taskName: result[prop].taskName,
                                        rptNameAbb: item.rptNameAbb,
                                        groupId: item.groupId,
                                        groupName: item.groupName,
                                        perdType: result[prop].perdType,
                                        children: []
                                    }
                                    codes.push(item.rptCode)
                                    obj.children.push(it)
                                })
                                codeList = codeList.concat(codes)
                                arr.push(obj)
                            }
                            page.rmisTreeComboxStr = codeList.join(',')
                            // console.log(page.rmisTreeComboxStr)
                            //资产负债表对象
                            $("#rmisTreeCombox").ufmaTextboxlist({
                                valueField:"code",
                                textField:"name",
                                name: 'rmisTreeCombox',
                                leafRequire: true,
                                data: arr, //json 数据 
                                expand: true
                            });
                        }else{
                            ufma.showTip('获取“资产负债表”类型pdf失败，服务器错误',function(){},'error')
                        }
                    },
                    error: function (jqXHR) {
                        ufma.showTip('获取“资产负债表”类型pdf失败，服务器错误',function(){},'error')
                    }
                })
            },
            /**
             * 返回随机数拼接后的路径
             */
            getRandomFilePath: function(){
                //随机数函数
                function getRandomNum() {
                    return String(Math.floor(Math.random() * 10));
                }
                //文件夹需要一个随机数路径
                var num1 = getRandomNum(), num2 = getRandomNum();
                var randomStr = String(new Date().getTime()) + num1 + num2;
                //默认路径时间戳与2位随机数组成15位字符串
                var filePath = '/' + randomStr + '/' + page.nowAgencyCode + '(' + page.nowAgencyName + ')/' + page.nowAcctCode + '(' + page.nowAcctName + ')';
                return filePath;
            },
            initPage: function () {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);

                page.initRmisTreeCombox();
                page.initAgencyList();
                page.initAcctList();
                page.reqAgencyList();
                page.initTable();

                //绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        page.checkDate(fmtDate, "#dateStart")
                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        page.checkDate(fmtDate, "#dateEnd")
                    }
                };
                $("#dateStart").ufDatepicker(glRptLedgerDate);
                $("#dateEnd").ufDatepicker(glRptLedgerEndDate);
                page.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $("#dateBq").on("click", function () {
                    page.dateBenQi("dateStart", "dateEnd");
                });
                $("#dateBn").on("click", function () {
                    page.dateBenNian("dateStart", "dateEnd");
                });

                setTimeout(function () {
                    page.queryTable();
                }, 500)
            },
            onEventListener: function () {
                //点击查询按钮
                $('#eArchivesQuery').on('click', function (e) {
                    if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.hideloading();
                        ufma.showTip('开始期间不能大于结束期间！', function () { }, 'error');
                        return false;
                    }
                    page.queryTable();
                })

                $('#isAll').on('change', function (e) {
					if($(this).is(":checked")){
                        $('input[name=archiveopt]').prop("checked",true).attr("chekced",true)
                        $("#rmisTreeCombox").ufmaTextboxlist().val(page.rmisTreeComboxStr)
					}else{
                        $('input[name=archiveopt]').prop("checked",false).attr("chekced",false)
                        $("#rmisTreeCombox").ufmaTextboxlist().val('')
					}
				})
				$('input[name=archiveopt]').on('change', function (e) {
					var ischecked = true
					$('input[name=archiveopt]').each(function (i) {
					    if (!$(this).is(":checked")) {
					        ischecked = false
					    }
					})
					$('#isAll').prop("checked",ischecked).attr("chekced",ischecked)
                })
                /**
                 * @description: 关闭进度条窗口modal  窗口显示数据重置
                 */
                $('#progressModalClose').on('click',function(){
                    $('.progressModalWrap').addClass('tablehide')
                    //清除显示
                    //清除期间
                    $('#qj').html('')
                    //清除当前期间总数
                    $('#qjTotal').html('0')
                    //清除主进度条白分比显示
                    $('#percent').html('0%')
                    //设置主进度条宽度为0
                    $('#progressBar').css({width:'0'})
                    //清除第二进度条白分比显示
                    $('#subpercent').html('0%')
                    //设置第二进度条宽度为0
                    $('#subProgressBar').css({width:'0'})
                    //归档位置清空
                    $('#current').html('')
                    //当前归档内容总数清空
                    $('#currentTotal').html('0')
                    //归档详情清空
                    $('#filingDetail').html('')

                    //清除数值
                    //归档位置清空
                    page.currentPeriod = ''
                    //当前归档内容总数清空
                    page.optTotal = 0
                    //清除当前期间总数
                    page.qjTotal = 0
                    //完成数清0
                    page.completeCount = 0
                    //主进度清0
                    page.percent = 0;
                    //第二进度清0
                    page.subPercent = 0;
                })

                //将归档信息打印在输出信息窗口 并自动滚动
                function showDetail(str){
                    $('#filingDetail').html($('#filingDetail').html()+str)
                    console.log($('#filingDetail')[0].scrollHeight)
                    $('#filingDetail').scrollTop($('#filingDetail')[0].scrollHeight);
                }

                //完成一个期间内归档内容的归档 进度条增加 完成百分比增加
                function setPercent(){
                    page.curCount++
                    page.subPercent = parseInt((page.curCount/page.optTotal)*100);
                    $('#subpercent').html(page.subPercent+'%')
                    $('#subProgressBar').css({width:page.subPercent+'%'});
                }

                //点击归档按钮
                $('#eArchivesFiling').on('click', function (e) {
                    // console.log($("#rmisTreeCombox").ufmaTextboxlist().setting.data)
                    // console.log($("#rmisTreeCombox").ufmaTextboxlist().getValue())
                    // console.log($("#rmisTreeCombox").ufmaTextboxlist().getText())
                    // return 
                    //期间的校验
                    if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.hideloading();
                        ufma.showTip('开始期间不能大于结束期间！', function () { }, 'error');
                        return false;
                    }
                    //归档内容字段组成的数组
                    var archiveOptArr = ['isGG','isGlXml','isVou'];
                    $('input[name=archiveopt]').each(function (i) {
                        if ($(this).prop('checked') && $(this).val()!='isAll') {
                            archiveOptArr.push($(this).val());
                        }
                    })
                    var rmisTextboxlistData = $("#rmisTreeCombox").ufmaTextboxlist().setting.data;
                    var rptList = []
                    rmisTextboxlistData.forEach(function(item){
                        rptList = rptList.concat(item.children)
                    })
                    console.log(rptList)
                    var rmisTreeCodeList = $("#rmisTreeCombox").ufmaTextboxlist().getValue().split(',')
                    // var rmisTreeTextList = $("#rmisTreeCombox").ufmaTextboxlist().getText().split(',')
                    var rmisTreeObjList = []
                    rptList.forEach(function(item){
                        rmisTreeCodeList.forEach(function(it){
                            if(item.code === it){
                                rmisTreeObjList.push(item)
                            }
                        })
                    })
                    //归档内容校验
                    if (archiveOptArr.length === 0&&rmisTreeObjList.length === 0) {
                        ufma.showTip('没有选择任何归档内容', function () { }, 'error')
                        return;
                    }
                    page.completeCount = 0
                    //归档类型总数
                    page.optTotal = archiveOptArr.length + (rmisTreeObjList.length>0?1:0)
                    $('#currentTotal').html(page.optTotal)
                    //经过处理的日期
                    var startDate = $("#dateStart").getObj().getValue();
                    var startEnd = $("#dateEnd").getObj().getValue();
                    var year = (new Date(startEnd)).getFullYear(); //截止年度(只有年，如2017)
                    var startFisperd = (new Date(startDate)).getMonth() + 1; //起始期间(只有月份，如7)
                    var endFisperd = (new Date(startEnd)).getMonth() + 1; //截止期间(只有月份，如7)
                    var archiveOptStr = archiveOptArr.join(',');//归档类型参数字符串类型逗号分隔
                    //q1起始期间,q2结束期间
                    var q1 = parseInt(startFisperd), q2 = parseInt(endFisperd);
                    ufma.showloading('正在归档，请稍候');
                    //所有期间总数
                    page.qjTotal = q2 - q1 + 1
                    $('#qjTotal').html(page.qjTotal)
                    //所有任务数
                    // page.taskTotal = page.optTotal * page.qjTotal
                    //当前执行的任务下标
                    page.taskIndex = 1
                    //显示进度
                    $('.progressModalWrap').removeClass('tablehide')
                    /**
                     * 在选择的期间内循环 一个期间内“流式传输”类型的全部完成传输后，最后调用archive，其中除了某些数据为空外，不能有错误中断。
                     * ！！！archive成功返回后才能再执行下个期间！！！
                     * “公共档案”和“总账类XML”归档类型会随着archiveOpt参数自动处理
                     */
                    archiveByPeriod(q1,q2);
                    /**
                     * 判断该归档类型是否勾选的状态机
                     * @param {String} type 归档类型
                     * @return {Boolean}
                     */
                    function archiveTypeIsChecked(type){
                        return archiveOptStr.indexOf(type) > -1
                    }
                    /**
                     * 归档流程
                     * @param {Number} currentPeriod 当前期间
                     * @param {Number} endPeriod 终止期间
                     */
                    function archiveByPeriod(currentPeriod, endPeriod) {
                        page.curCount = 0
                        $('#subpercent').html('0%')
                        $('#subProgressBar').css({width: 0});
                        $('#qj').html(currentPeriod)
                        showDetail('<p>############期间：' + currentPeriod + '月 开始归档############</p>')
                        page.currentPeriod = currentPeriod
                        var filePath = page.getRandomFilePath();
                        showDetail('<p>当前期间目录：'+filePath+'</p>')

                        //查询会计科目的参数
                        var accoArgu = {
                            acctCode: page.nowAcctCode,
                            acctName: page.nowAcctName,
                            agencyCode: page.nowAgencyCode,
                            // prjCode: '',
                            // prjName: '',
                            agencyName: page.nowAgencyName,
                            prjContent:{
                                rptOption:[
                                    {
                                        defCompoValue:"N",
                                        optCode:"IS_INCLUDE_UNPOST",
                                        optName:"含未记账凭证"
                                    },
                                    {
                                        defCompoValue:"Y",
                                        optCode:"IS_INCLUDE_JZ",
                                        optName:"含未结转凭证"
                                    },
                                    {
                                        defCompoValue:"Y",
                                        optCode:"IS_HAVE_AMTANDCUR",
                                        optName:"发生额及余额为零不打印"
                                    },
                                    {
                                        defCompoValue:"N",
                                        optCode:"IS_JUSTSHOW_OCCFISPERD",
                                        optName:"只显示有发生期间"
                                    },
                                    {
                                        defCompoValue:"Y",
                                        optCode:"IS_NOASS_NOPRINT",
                                        optName:"没有所选辅助项的科目不打印"
                                    },{
                                        defCompoValue:"N",
                                        optCode:"IS_PRINT_FRONTLASTPAGE",
                                        optName:"打印承前页过次页"
                                    }
                                ],
                                qryItems:[
                                    {
                                        condType:"cond",
                                        isOutTableShow:"1",//表外项
                                        printLevel:"10",//筛选出末级科目
                                        itemLevel:"10",//筛选出末级科目
                                        isGradsum:"0", //取消逐级汇总
                                        itemType:"ACCO",
                                        itemTypeName:"会计科目",
                                        isShowCode:"0",
                                        isShowFullName:"0",
                                        items:[]
                                    }
                                ],
                                endFisperd: currentPeriod,
                                endDate: startEnd,
                                startFisperd: currentPeriod,
                                startDate: startDate
                            },
                            setYear: svData.svSetYear,
                            rptType: "GL_RPT_ALLPRINT"
                        }

                        //查询期间是否结账
                        new Promise(function (res0, rej0) {
                            var argu = {
                                setYear: svData.svSetYear,
                                rgCode: svData.svRgCode,  
                                agencyCode: page.nowAgencyCode,    
                                acctCode: page.nowAcctCode,  
                                fisPerd: currentPeriod
                            }
                            $.ajax({
                                url: interfaceURL.getFisperdStatus,
                                type: "GET",
                                data: argu,
                                dataType: 'json',
                                contentType: 'application/json; charset=utf-8',
                                success: function (result) {
                                    console.log(result)
                                    if (result.flag != 'fail') {
                                        res0(true);
                                    } else {
                                        rej0(result.msg);
                                    }
                                },
                                error: function (jqXHR) {
                                    rej0('获取期间结账状态失败，归档失败');
                                }
                            })
                        }).then(function (state) {
                            if(!state){
                                throw '当前期间: '+currentPeriod+' 月未结账，不可归档'
                            }
                            //凭证归档方法
                            return new Promise(function (res1, rej1) {
                                //归档类型是否含有“凭证及附件”类型
                                if (archiveTypeIsChecked('isVou')) {
                                    $('#current').html('凭证及附件')
                                    /**
                                     * 因为多个http请求流程中有对请求断开的控制（调用rej1），分离出来逻辑繁琐
                                     */
                                    //list接口组织参数
                                    var vouListArgu = {
                                        agencyCode: page.nowAgencyCode,
                                        acctCode: page.nowAcctCode,
                                        fisPerd: currentPeriod,
                                        accaCode: "",
                                        vouStatus: "",
                                        rgCode: svData.svRgCode,
                                        vouTypeCode: "",
                                        startVouNo: "",
                                        endVouNo: "",
                                        inputorName: "",
                                        startVouDate: startDate + '-01',
                                        endVouDate: startEnd + '-' + (new Date(year, endFisperd, 0)).getDate()
                                    }
                                new Promise(function (resolve, reject) {
                                        $.ajax({
                                            url: interfaceURL.list,
                                            type: "POST",
                                            data: JSON.stringify(vouListArgu),
                                            timeout: 600000, //超时时间
                                            dataType: 'json',
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {
                                                if (result.flag != 'fail') {
                                                    if (result.data && result.data.length > 0) {
                                                        resolve(result);
                                                    } else {
                                                        reject('凭证及附件归档失败，list接口没有返回数据');
                                                    }
                                                } else {
                                                    reject(result.msg);
                                                }
                                            },
                                            error: function (jqXHR) {
                                                reject('凭证及附件归档失败，服务器错误');
                                            }
                                        })
                                }).then(function (result) {
                                        // console.log(result);
                                        return new Promise(function (resolve1, reject1) {
                                            var prtTmplArgu = {
                                                agencyCode: page.nowAgencyCode,
                                                acctCode: page.nowAcctCode,
                                                componentId: "GL_VOU"
                                            };
                                            $.ajax({
                                                url: interfaceURL.getPrtTmplPdfNew,
                                                type: "POST",
                                                data: JSON.stringify(prtTmplArgu),
                                                timeout: 600000, //超时时间
                                                dataType: 'json',
                                                contentType: 'application/json; charset=utf-8',
                                                success: function (res1) {
                                                    var tmplCode = res1.data[0].tmplCode;
                                                    if (tmplCode) {
                                                        page.tmplCode = tmplCode;
                                                        if (res1.flag != 'fail') {
                                                            var promiseTask = [];
                                                            //单张凭证调用情况
                                                            result.data.forEach(function (item) {
                                                                var prtArgu = {
                                                                    agencyCode: page.nowAgencyCode,
                                                                    acctCode: page.nowAcctCode,
                                                                    componentId: "GL_VOU",
                                                                    tmplCode: tmplCode,
                                                                    formatTmplCode: "*",
                                                                    vouGuids: [item.vouGuid]
                                                                }
                                                                var vouTypeCode = item.vouTypeCode, vouNo = item.vouNo;
                                                                showDetail('<p>正在生成：【凭证及附件】['+vouNo+']</p>')
                                                                //应该建立日志或生成电子档案过程查看机制
                                                                // 这里要包一层 因为Promise.all之后的then只会接到第一次promise的返回结果 并且不能reject 否则中断所有
                                                                var p = new Promise(function (res, rej) {
                                                                    new Promise(function (resolve2, reject2) {
                                                                        $.ajax({
                                                                            url: interfaceURL.getPrtDataPdf,
                                                                            type: "POST",
                                                                            data: JSON.stringify(prtArgu),
                                                                            timeout: 600000, //超时时间
                                                                            dataType: 'json',
                                                                            contentType: 'application/json; charset=utf-8',
                                                                            success: function (res2) {
                                                                                if (res2.flag != 'fail') {
                                                                                    if (res2.data && res2.data.data && res2.data.data.length > 0) {
                                                                                        var pdfStreamArgu = [];
                                                                                        //将参数进行适度封装
                                                                                        res2.data.data.forEach(function (item) {
                                                                                            var obj = {
                                                                                                gl_voucher_ds1: item,
                                                                                                lp_bill_info: [{}]
                                                                                            }
                                                                                            pdfStreamArgu.push(obj);
                                                                                        })
                                                                                        var groupDef = JSON.stringify(pdfStreamArgu);
                                                                                        resolve2(groupDef);
                                                                                    } else {
                                                                                        reject2('凭证[' + item.vouGuid + ']生成电子档案中断，getPrtDataPdf接口没有返回数据');
                                                                                    }
                                                                                } else {
                                                                                    reject2('凭证及附件归档失败，'+res2.msg);
                                                                                }
                                                                            },
                                                                            error: function (jqXHR) {
                                                                                reject2('凭证及附件归档失败，服务器错误');
                                                                            }
                                                                        })
                                                                    }).then(function (groupDef) {
                                                                        // console.log(groupDef);
                                                                        return new Promise(function (resolve3, reject3) {

                                                                            getPdfStream(page.tmplCode, '*', groupDef, function (res3) {
                                                                                var index = res3.indexOf(',') + 1;
                                                                                var resStr = res3.substr(index);
                                                                                // console.log(resStr);
                                                                                var streamArgu = {
                                                                                    base64Content: resStr
                                                                                };
                                                                                resolve3(streamArgu);
                                                                            }, function (xhr) {
                                                                                //这种情况单独处理
                                                                                reject3('凭证及附件归档失败，服务器错误');
                                                                            })
                                                                        });
                                                                    }).then(function (streamArgu) {
                                                                            $.ajax({
                                                                                url: interfaceURL.getStream + '?vouNo=' + vouNo + '&vouTypeCode=' + vouTypeCode+'&vouGroupId='+ item.vouGroupId +'&startFisperd='+ currentPeriod +'&endFisperd='+ currentPeriod +'&agencyCode=' + page.nowAgencyCode + '&agencyName=' + page.nowAgencyName + '&acctCode=' + page.nowAcctCode + '&acctName=' + page.nowAcctName + '&filePath=' + filePath,
                                                                                type: "POST",
                                                                                data: JSON.stringify(streamArgu),
                                                                                timeout: 600000, //超时时间
                                                                                dataType: 'json',
                                                                                contentType: 'application/json; charset=utf-8',
                                                                                success: function (res4) {
                                                                                    // console.log(res4);
                                                                                    if (res4.flag != 'fail') {
                                                                                        res(res4.data);
                                                                                    } else {
                                                                                        // rej(res4.msg);
                                                                                        rej('凭证及附件归档失败，服务器错误');
                                                                                    }
                                                                                },
                                                                                error: function (jqXHR) {
                                                                                    // rej('服务器错误');
                                                                                    rej('凭证及附件归档失败，服务器错误');
                                                                                }
                                                                            })
                                                                    }).catch(function (err) {
                                                                        ufma.hideloading();
                                                                        rej(err);
                                                                    });
                                                                })
                                                                promiseTask.push(p);
                                                            })


                                                            //全部执行完成后才执行
                                                            Promise.all(promiseTask).then(function (results) {
                                                                // console.log(results); // 获得一个由请求结果数据组成的Array: [{},{}]
                                                                showDetail('<p>【凭证及附件】归档已完成</p>')
                                                                setPercent();
                                                                resolve1();
                                                            }).catch(function (err) {
                                                                ufma.hideloading();
                                                                // ufma.showTip(err, function() {}, "error");
                                                                console.log(err);
                                                                reject1(err);
                                                            });


                                                        } else {
                                                            reject1(res1.msg);
                                                        }
                                                    } else {
                                                        reject1('凭证及附件归档失败，getPrtTmplPdfNew接口没有可供使用的tmplCode');
                                                    }
                                                },
                                                error: function (jqXHR) {
                                                    reject1('凭证及附件归档失败，服务器错误');
                                                }
                                            })
                                        })
                                    }).then(function(){
                                        res1(true)
                                    }).catch(function (err) {
                                        ufma.hideloading();
                                        rej1(err)
                                    });
                                } else {
                                    res1(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“凭证及附件”类型已完成==========');
                            return new Promise(function (res2, rej2) {
                                //归档类型是否含有“总账”类型
                                if (archiveTypeIsChecked('isLedger')) {
                                    $('#current').html('总账')
                                    //查询总账的参数
                                    var argu2 = {
                                        acctCode: page.nowAcctCode,
                                        agencyCode: page.nowAgencyCode,
                                        acctName: page.nowAcctName,
                                        agencyName: page.nowAgencyName,
                                        prjCode: "",
                                        prjName: "",
                                        prjScope: "",
                                        rptType: "GL_RPT_LEDGER",
                                        setYear: svData.svSetYear,
                                        userId: svData.svUserId,
                                        prjContent: {
                                            agencyAcctInfo: [{
                                                acctCode: page.nowAcctCode,
                                                agencyCode: page.nowAgencyCode
                                            }],
                                            startDate: startDate,
                                            endDate: startEnd,
                                            startFisperd: startFisperd,
                                            endFisperd: endFisperd,
                                            startYear: svData.svSetYear,
                                            endYear: svData.svSetYear,
                                            period: "dateBq",
                                            qryItems: [{
                                                itemType: "ACCO",
                                                itemIndex: 1,
                                                itemTypeName: "会计科目",
                                                items: [],
                                                isShowItem: "0",
                                                isGradsum: "0"
                                            }],
                                            rptCondItem: [{
                                                condCode: "stadAmtFrom",
                                                condName: "金额起",
                                                condText: "",
                                                condValue: ""
                                            }, {
                                                condCode: "stadAmtTo",
                                                condName: "金额止",
                                                condText: "",
                                                condValue: ""
                                            }],
                                            rptOption: [{
                                                defCompoValue: "N",
                                                optCode: "IS_INCLUDE_UNPOST",
                                                optName: "含未记账凭证"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_INCLUDE_JZ",
                                                optName: "含结转凭证"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_JUSTSHOW_OCCFISPERD",
                                                optName: "只显示有发生期间"
                                            }],
                                            rptStyle: "SANLAN",
                                            curCode: "",
                                            formCode: "",
                                            formName: "",
                                            rptTitleName: "",
                                            vouTypeCode: ""
                                        }
                                    }
                                    $.ajax({
                                        url: interfaceURL.glRptAllPrint,
                                        type: "POST",
                                        data: JSON.stringify(accoArgu),
                                        dataType: 'json',
                                        contentType: 'application/json; charset=utf-8',
                                        success: function (result) {
                                            console.log(result);
                                            if (result.data && result.data.tableData && result.data.tableData.length > 0) {
                                            var accItemArray = result.data.tableData;
                                            var promiseTask = [];
                                            accItemArray.forEach(function (item, index) {
                                                    var obj = {
                                                        "code": item.accoCode,//会计科目
                                                        "name": item.accoName
                                                    }
                                                    //每次更换这里
                                                    argu2.prjContent.qryItems[0].items = [obj];
                                                    argu2.prjContent.startFisperd = currentPeriod;
                                                    argu2.prjContent.endFisperd = currentPeriod;
                                                    showDetail('<p>正在生成：【总账】单位('+page.nowAgencyCode+')账套('+page.nowAcctCode+')会计科目['+item.accoName+' '+item.accoCode+']</p>')
                                                    var p = new Promise(function (res, rej) {
                                                        new Promise(function (resolve1, reject1) {
                                                            $.ajax({
                                                                url: interfaceURL.getRptLedger,
                                                                type: "POST",
                                                                data: JSON.stringify(argu2),
                                                                timeout: 600000, //超时时间
                                                                dataType: 'json',
                                                                contentType: 'application/json; charset=utf-8',
                                                                success: function (result) {
                                                                    // console.log(res4);
                                                                    if (result.flag != 'fail') {
                                                                        if (result.data && result.data.tableData.length > 0) {
                                                                            resolve1(result.data.tableData);
                                                                        } else {
                                                                            showDetail('<p>科目['+item.accoName+']总账无数据</p>')
                                                                            // console.log('科目['+item.accoName+']总账无数据');
                                                                            res('科目['+item.accoName+']总账无数据');
                                                                        }
                                                                    } else {
                                                                        showDetail('<p>科目['+item.accoName+']总账无数据</p>')
                                                                        // console.log('科目['+item.accoName+']总账无数据');
                                                                        res('科目['+item.accoName+']总账：'+result.msg);
                                                                    }
                                                                },
                                                                error: function (jqXHR) {
                                                                    rej('查询总账数据（科目['+item.accoName+']）发生服务器错误');
                                                                }
                                                            })
                                                        }).then(function (result) {
                                                            // console.log(result);
                                                            return new Promise(function (resolve3, reject3) {
                                                                var arr = [{
                                                                    GL_RPT_PRINT: result
                                                                }]
                                                                getPdfStream('GL_RPT_LEDGER_01', '*', JSON.stringify(arr), function (res3) {
                                                                    var index = res3.indexOf(',') + 1;
                                                                    var resStr = res3.substr(index);
                                                                    // console.log(resStr);
                                                                    var streamArgu = {
                                                                        base64Content: resStr
                                                                    };
                                                                    resolve3(streamArgu);
                                                                }, function (xhr) {
                                                                    //这种情况单独处理
                                                                    reject3('总账组织pdf数据服务器错误');
                                                                })
                                                            });
                                                        }).then(function (streamArgu) {
                                                            // console.log(streamArgu);
                                                            //传科目和账簿类型
                                                            $.ajax({
                                                                url: interfaceURL.getStream + '?startFisperd=' + currentPeriod + '&endFisperd=' + currentPeriod + '&accoCode=' + item.accoCode + '&rptType=KMZZ&agencyCode=' + page.nowAgencyCode + '&agencyName=' + page.nowAgencyName + '&acctCode=' + page.nowAcctCode + '&acctName=' + page.nowAcctName + '&filePath=' + filePath,
                                                                type: "POST",
                                                                data: JSON.stringify(streamArgu),
                                                                timeout: 600000, //超时时间
                                                                dataType: 'json',
                                                                contentType: 'application/json; charset=utf-8',
                                                                success: function (res4) {
                                                                    // console.log(res4);
                                                                    if (res4.flag != 'fail') {
                                                                        res(res4.data);
                                                                    } else {
                                                                        // rej(res4.msg);
                                                                        rej('接口传输pdf流服务器错误');
                                                                    }
                                                                },
                                                                error: function (jqXHR) {
                                                                    // rej('服务器错误');
                                                                    rej('接口传输pdf流服务器错误');
                                                                }
                                                            })
                                                        }).catch(function (err) {
                                                            ufma.hideloading();
                                                            // ufma.showTip(err, function() {}, "error");
                                                            console.log(err);
                                                            rej(err);
                                                        });
                                                    })
                                                    promiseTask.push(p);
                                            })

                                            Promise.all(promiseTask).then(function (results) {
                                                console.log(results); // 获得一个由请求结果数据组成的Array: [{},{}]
                                                showDetail('<p>【总账】归档已完成</p>')
                                                setPercent();
                                                res2(true)
                                            }).catch(function (err) {
                                                ufma.hideloading();
                                                // ufma.showTip(err, function() {}, "error");
                                                console.log(err);
                                                rej2(err)
                                            });
                                        }else{
                                            rej3('归档总账过程中，接口glRptAllPrint查询会计科目无返回');
                                        }
                                    },
                                    error: function (jqXHR) {
                                        rej3('归档总账过程中，接口glRptAllPrint查询会计科目错误');
                                    }
                                })
                                } else {
                                    res2(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“总账”类型已完成==========');
                            return new Promise(function (res3, rej3) {
                                //归档类型是否含有“明细账”类型
                                if (archiveTypeIsChecked('isJournal')) {
                                    $('#current').html('明细账')
                                    //查询明细账的参数
                                    var argu2 = {
                                        acctCode: page.nowAcctCode,
                                        agencyCode: page.nowAgencyCode,
                                        acctName: page.nowAcctName,
                                        agencyName: page.nowAgencyName,
                                        prjCode: "",
                                        prjName: "",
                                        prjScope: "",
                                        rptType: "GL_RPT_JOURNAL",
                                        setYear: svData.svSetYear,
                                        userId: svData.svUserId,
                                        prjContent: {
                                            agencyAcctInfo: [{
                                                acctCode: page.nowAcctCode,
                                                agencyCode: page.nowAgencyCode
                                            }],
                                            startDate: startDate,
                                            endDate: startEnd,
                                            startFisperd: startFisperd,
                                            endFisperd: endFisperd,
                                            startYear: svData.svSetYear,
                                            endYear: svData.svSetYear,
                                            period: "dateBq",
                                            qryItems: [{
                                                itemType: "ACCO",
                                                itemIndex: 1,
                                                itemTypeName: "会计科目",
                                                items: [],
                                                isShowItem: "0",
                                                isGradsum: "0"
                                            }],
                                            rptCondItem: [{
                                                condCode: "stadAmtFrom",
                                                condName: "金额起",
                                                condText: "",
                                                condValue: ""
                                            }, {
                                                condCode: "stadAmtTo",
                                                condName: "金额止",
                                                condText: "",
                                                condValue: ""
                                            }],
                                            rptOption: [{
                                                defCompoValue: "N",
                                                optCode: "IS_INCLUDE_UNPOST",
                                                optName: "含未记账凭证"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_INCLUDE_JZ",
                                                optName: "含结转凭证"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_JUSTSHOW_OCCFISPERD",
                                                optName: "只显示有发生期间"
                                            }],
                                            rptStyle: "SANLAN",
                                            curCode: "",
                                            formCode: "",
                                            formName: "",
                                            rptTitleName: "",
                                            vouTypeCode: ""
                                        }
                                    }
                            $.ajax({
                                    url: interfaceURL.glRptAllPrint,
                                    type: "POST",
                                    data: JSON.stringify(accoArgu),
                                    dataType: 'json',
                                    contentType: 'application/json; charset=utf-8',
                                    success: function (result) {
                                        console.log(result);
                                        if (result.data && result.data.tableData && result.data.tableData.length > 0) {
                                            var accItemArray = result.data.tableData;
                                            var promiseTask = [];
                                            accItemArray.forEach(function (item, index) {
                                                //item.isLeaf 只有末级科目才查询明细账 if (item.isLeaf)
                                                    var obj = {
                                                        "code": item.accoCode,//会计科目
                                                        "name": item.accoName
                                                    }
                                                    //每次更换这里
                                                    argu2.prjContent.qryItems[0].items = [obj];
                                                    argu2.prjContent.startFisperd = currentPeriod;
                                                    argu2.prjContent.endFisperd = currentPeriod;
                                                    showDetail('<p>正在生成：【明细账】单位('+page.nowAgencyCode+')账套('+page.nowAcctCode+')会计科目['+item.accoName+' '+item.accoCode+']</p>')
                                                    var p = new Promise(function (res, rej) {
                                                        new Promise(function (resolve1, reject1) {
                                                            $.ajax({
                                                                url: interfaceURL.getRptJournal,
                                                                type: "POST",
                                                                data: JSON.stringify(argu2),
                                                                timeout: 600000, //超时时间
                                                                dataType: 'json',
                                                                contentType: 'application/json; charset=utf-8',
                                                                success: function (result) {
                                                                    // console.log(res4);
                                                                    if (result.flag != 'fail') {
                                                                        if (result.data && result.data.tableData.length > 0) {
                                                                            resolve1(result.data.tableData);
                                                                        } else {
                                                                            // console.log('科目['+item.accoName+']明细账无数据');
                                                                            showDetail('<p>科目['+item.accoName+']明细账无数据</p>')
                                                                            res('科目['+item.accoName+']明细账无数据');
                                                                        }
                                                                    } else {
                                                                        // console.log('科目['+item.accoName+']明细账无数据');
                                                                        showDetail('<p>科目['+item.accoName+']明细账无数据</p>')
                                                                        res('科目['+item.accoName+']明细账'+result.msg);
                                                                    }
                                                                },
                                                                error: function (jqXHR) {
                                                                    rej('查询明细账数据（科目['+item.accoName+']）服务器错误');
                                                                }
                                                            })
                                                        }).then(function (result) {
                                                            // console.log(result);
                                                            return new Promise(function (resolve3, reject3) {
                                                                var arr = [{
                                                                    GL_RPT_PRINT: result,
                                                                    GL_RPT_TOTAL_AMT: [{totalDrAmt:'累计发生额借方',totalCrAmt:'累计发生额贷方'}],
                                                                    GL_RPT_HEAD_EXT: [{ext1Name: '会计科目'}]
                                                                }]
                                                                getPdfStream('GL_RPT_JOURNAL_01', '*', JSON.stringify(arr), function (res3) {
                                                                    var index = res3.indexOf(',') + 1;
                                                                    var resStr = res3.substr(index);
                                                                    // console.log(resStr);
                                                                    var streamArgu = {
                                                                        base64Content: resStr
                                                                    };
                                                                    resolve3(streamArgu);
                                                                }, function (xhr) {
                                                                    //这种情况单独处理
                                                                    reject3('明细账组织pdf数据服务器错误');
                                                                })
                                                            });
                                                        }).then(function (streamArgu) {
                                                            // console.log(streamArgu);
                                                            //传科目和账簿类型
                                                            $.ajax({
                                                                url: interfaceURL.getStream + '?startFisperd=' + currentPeriod + '&endFisperd=' + currentPeriod + '&accoCode=' + item.accoCode + '&rptType=KMMXZ&agencyCode=' + page.nowAgencyCode + '&agencyName=' + page.nowAgencyName + '&acctCode=' + page.nowAcctCode + '&acctName=' + page.nowAcctName + '&filePath=' + filePath,
                                                                type: "POST",
                                                                data: JSON.stringify(streamArgu),
                                                                timeout: 600000, //超时时间
                                                                dataType: 'json',
                                                                contentType: 'application/json; charset=utf-8',
                                                                success: function (res4) {
                                                                    // console.log(res4);
                                                                    if (res4.flag != 'fail') {
                                                                        res(res4.data);
                                                                    } else {
                                                                        // rej(res4.msg);
                                                                        rej('明细账传输pdf流服务器错误');
                                                                    }
                                                                },
                                                                error: function (jqXHR) {
                                                                    // rej('服务器错误');
                                                                    rej('明细账传输pdf流服务器错误');
                                                                }
                                                            })
                                                        }).catch(function (err) {
                                                            ufma.hideloading();
                                                            // ufma.showTip(err, function() {}, "error");
                                                            console.log(err);
                                                            rej(err);
                                                        });
                                                    })
                                                    promiseTask.push(p);
                                            })

                                            Promise.all(promiseTask).then(function (results) {
                                                console.log(results); // 获得一个由请求结果数据组成的Array: [{},{}]
                                                showDetail('<p>【明细账】归档已完成</p>')
                                                setPercent();
                                                res3(true)
                                            }).catch(function (err) {
                                                ufma.hideloading();
                                                // ufma.showTip(err, function() {}, "error");
                                                console.log(err);
                                                rej3(err)
                                            });
                                        }else{
                                            rej3('归档明细账过程中，接口glRptAllPrint查询会计科目无返回');
                                        }
                                    },
                                    error: function (jqXHR) {
                                        rej3('归档明细账过程中，接口glRptAllPrint查询会计科目错误');
                                    }
                                })
                                } else {
                                    res3(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“明细账”类型已完成==========')


                            return new Promise(function (res4, rej4) {
                                //归档类型是否含有“余额表”类型
                                if (archiveTypeIsChecked('isBal')) {
                                    $('#current').html('余额表')
                                    var argu = {
                                        acctCode: page.nowAcctCode,
                                        agencyCode: page.nowAgencyCode,
                                        acctName: page.nowAcctName,
                                        agencyName: page.nowAgencyName,
                                        prjCode: "",
                                        prjName: "",
                                        prjScope: "",
                                        rptType: "GL_RPT_BAL",
                                        setYear: svData.svSetYear,
                                        userId: svData.svUserId,
                                        prjContent: {
                                            agencyAcctInfo: [{
                                                acctCode: page.nowAcctCode,
                                                agencyCode: page.nowAgencyCode
                                            }],
                                            startDate: startDate,
                                            endDate: startEnd,
                                            startFisperd: startFisperd,
                                            endFisperd: endFisperd,
                                            startYear: svData.svSetYear,
                                            endYear: svData.svSetYear,
                                            period: "dateBq",
                                            qryItems: [{
                                                itemType: "ACCO",
                                                itemIndex: 1,
                                                itemTypeName: "会计科目",
                                                items: [],
                                                isShowItem: "1",
                                                isGradsum: "1"
                                            }],
                                            rptCondItem: [],
                                            rptOption: [{
                                                defCompoValue: "N",
                                                optCode: "IS_INCLUDE_UNPOST",
                                                optName: "含未记账凭证"
                                            }, {
                                                defCompoValue: "Y",
                                                optCode: "IS_INCLUDE_JZ",
                                                optName: "含结转凭证"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_UNSHOW_OCCZERO",
                                                optName: "发生额为零不显示"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_UNSHOW_ENDBALZERO",
                                                optName: "期末余额为零不显示"
                                            }, {
                                                defCompoValue: "Y",
                                                optCode: "IS_UNSHOW_OCCENDBALZERO",
                                                optName: "发生额和期末余额为零不显示"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_UNSHOW_OCCBALZERO",
                                                optName: "发生额和余额为零不显示"
                                            }, {
                                                defCompoValue: "N",
                                                optCode: "IS_UNSHOW_BEGBALENDBALZERO",
                                                optName: "期初和期末余额同时为零不显示"
                                            }],
                                            rptStyle: "SANLAN",
                                            curCode: "",
                                            formCode: "",
                                            formName: "",
                                            rptTitleName: ""
                                        },
                                        accaCode: ""
                                    }
                                    new Promise(function (resolve1, reject1) {
                                        showDetail('<p>正在生成：【余额表】单位('+page.nowAgencyCode+')账套('+page.nowAcctCode+')</p>')
                                        $.ajax({
                                            url: interfaceURL.getRptBal,
                                            type: "POST",
                                            data: JSON.stringify(argu),
                                            timeout: 600000, //超时时间
                                            dataType: 'json',
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {
                                                // console.log(res4);
                                                if (result.flag != 'fail') {
                                                    if (result.data && result.data.tableData.length > 0) {
                                                        resolve1(result.data.tableData);
                                                    } else {
                                                        reject1('余额表无数据');
                                                    }
                                                } else {
                                                    reject1(result.msg);
                                                }
                                            },
                                            error: function (jqXHR) {
                                                reject1('服务器错误');
                                            }
                                        })
                                    }).then(function (result) {
                                        console.log(result);
                                        return new Promise(function (resolve3, reject3) {
                                            var arr = [{
                                                GL_RPT_PRINT: result,
                                                GL_RPT_TOTAL_AMT: [{totalDrAmt:'累计发生额借方',totalCrAmt:'累计发生额贷方'}],
                                                GL_RPT_HEAD_EXT: [{ext1Name: '会计科目'}]
                                            }]
                                            getPdfStream('GL_RPT_BAL', '*', JSON.stringify(arr), function (res3) {
                                                var index = res3.indexOf(',') + 1;
                                                var resStr = res3.substr(index);
                                                console.log(resStr);
                                                var streamArgu = {
                                                    base64Content: resStr
                                                };
                                                resolve3(streamArgu);
                                            }, function (xhr) {
                                                //这种情况单独处理
                                                reject3('服务器错误');
                                            })
                                        });
                                    }).then(function (streamArgu) {
                                        console.log(streamArgu);
                                        $.ajax({
                                            url: interfaceURL.getStream + '?startFisperd=' + currentPeriod + '&endFisperd=' + currentPeriod + '&rptType=ZZYEB&agencyCode=' + page.nowAgencyCode + '&agencyName=' + page.nowAgencyName + '&acctCode=' + page.nowAcctCode + '&acctName=' + page.nowAcctName + '&filePath=' + filePath,
                                            type: "POST",
                                            data: JSON.stringify(streamArgu),
                                            timeout: 600000, //超时时间
                                            dataType: 'json',
                                            contentType: 'application/json; charset=utf-8',
                                            success: function (result) {
                                                // console.log(result);
                                                if (result.flag != 'fail') {
                                                    // console.log(result.data);
                                                    showDetail('<p>【余额表】归档已完成</p>')
                                                    setPercent();
                                                    res4(true)
                                                } else {
                                                    rej4('“余额表”类型归档服务器错误');
                                                }
                                            },
                                            error: function (jqXHR) {
                                                rej4('“余额表”类型归档服务器错误');
                                            }
                                        })
                                    }).catch(function (err) {
                                        ufma.hideloading();
                                        console.log(err);
                                        ufma.showTip(err, function() {}, "error");
                                    });
                                } else {
                                    res4(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“余额表”类型已完成==========')


                            return new Promise(function (res5, rej5) {
                                //归档类型是否含有“多栏账”类型
                                if (archiveTypeIsChecked('isColumnar')) {
                                    $('#current').html('多栏账')
                                    page.curCount++
                                    page.subPercent = parseInt((page.curCount/page.optTotal)*100);
                                    $('#subpercent').html(page.subPercent+'%')
                                    $('#subProgressBar').css({width:page.subPercent+'%'});
                                    res5(true)
                                } else {
                                    res5(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“多栏账”类型已完成==========')


                            return new Promise(function (res6, rej6) {
                                //归档类型是否含有“日记账”类型
                                if (archiveTypeIsChecked('isBook')) {
                                    $('#current').html('日记账')
                                    setPercent();
                                    res6(true)
                                } else {
                                    res6(true)
                                }
                            })
                        }).then(function (state) {
                            console.log('==========“日记账”类型已完成==========')


                            return new Promise(function (res7, rej7) {
                                //归档类型是否含有“序时账”类型
                                if (archiveTypeIsChecked('isDaily')) {
                                    $('#current').html('序时账')
                                    setPercent();
                                    res7(true)
                                } else {
                                    res7(true)
                                }
                            })
                        }).then(function (state) {//去除了差异项明细账和辅助分析表
                            console.log('==========“序时账”类型已完成==========')

                            return new Promise(function (res10, rej10) {
                                //归档类型是否含有“报表”类型
                                if (rmisTreeObjList.length>0) {
                                    $('#current').html('报表')
                                    new Promise(function(resolve1,reject1){
                                        console.log(rmisTreeObjList)
                                        var taskList = []
                                        rmisTreeObjList.forEach(function(item){
                                            showDetail('<p>正在生成：【报表】报表任务：[' + item.taskName + '] 报表名称：[' + item.name + '] 报表编码：[' + item.code + '] 单位('+page.nowAgencyCode+')账套('+page.nowAcctCode+')</p>')
                                            var p = new Promise(function(res,rej){
                                                return new Promise(function(res1,rej1){
                                                    qjStr = String(currentPeriod)
                                                    qjStr.length<2?qjStr='0'+qjStr:qjStr
                                                    //【YDBG】月表 【NDBG】年表
                                                    var param = JSON.stringify({
                                                        "taskCode": item.taskCode,
                                                        "nd": svData.svSetYear,
                                                        "rg": svData.svRgCode,
                                                        "dwCode": page.nowAgencyCode,
                                                        "rptCode": item.code,
                                                        "qj": svData.svSetYear + qjStr,
                                                        "perdType": item.perdType,
                                                        "fileName": (item.perdType === 'M'?'YDBG':'NDBG') + svData.svSetYear + qjStr + '_' + page.nowAgencyCode+'-' + page.nowAcctCode + '_' + page.nowAgencyName + item.name,
                                                    })
                                                    var argu = { param: param }
                                                    var xhr = new XMLHttpRequest();
                                                    xhr.open('POST', interfaceURL.getRmisPDF, true);
                                                    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
                                                    xhr.responseType = "blob";
                                                    xhr.onload = function(){
                                                        if (xhr.status === 200) {
                                                            console.log(xhr.response)
                                                            if(xhr.response.size > 0){
                                                                var a = new FileReader();
                                                                a.onload = function (e) { 
                                                                    //去掉前缀
                                                                    var index = e.target.result.indexOf(',') + 1;
                                                                    var resStr = e.target.result.substr(index);
                                                                    // console.log(resStr);
                                                                    var streamArgu = {
                                                                        base64Content: resStr
                                                                    };
                                                                    var param = {
                                                                        name: item.name,
                                                                        type: item.perdType === 'M'?'YDBG':'NDBG',//【YDBG】资产负债月表 【NDBG】资产负债年表
                                                                        streamArgu: streamArgu
                                                                    }
                                                                    res1(param); 
                                                                }
                                                                a.readAsDataURL(xhr.response);
                                                            }else{
                                                                rej1('报表返回内容为空')
                                                            }
                                                        }
                                                    }
                                                    xhr.onreadystatechange = function() {
                                                        if (xhr.readyState === 4) {
                                                            //通信成功时
                                                            if (xhr.status === 200) {
                                                                //交易成功时
                                                            } else {
                                                                rej1('请求报表返回pdf流接口失败')
                                                            }
                                                        }
                                                    }
                                                    xhr.send(JSON.stringify(argu));
                                                }).then(function(param){
                                                    $.ajax({
                                                        url: interfaceURL.getStream + '?startFisperd=' + currentPeriod + '&endFisperd=' + currentPeriod + '&accoCode=' + item.code + '&fileSuffix=' + param.name + '&filePrefix=' + param.type + '&rptType=BB&agencyCode=' + page.nowAgencyCode + '&agencyName=' + page.nowAgencyName + '&acctCode=' + page.nowAcctCode + '&acctName=' + page.nowAcctName + '&filePath=' + filePath,
                                                        type: "POST",
                                                        data: JSON.stringify(param.streamArgu),
                                                        timeout: 600000, //超时时间
                                                        dataType: 'json',
                                                        contentType: 'application/json; charset=utf-8',
                                                        success: function (res4) {
                                                            // console.log(res4);
                                                            if (res4.flag != 'fail') {
                                                                res(res4.data);
                                                            } else {
                                                                rej('资产负债表传输pdf流服务器错误');
                                                            }
                                                        },
                                                        error: function (jqXHR) {
                                                            rej('资产负债表传输pdf流服务器错误');
                                                        }
                                                    })
                                                }).catch(function (err) {
                                                    ufma.hideloading();
                                                    console.log(err);
                                                    rej(err);
                                                });
                                            })
                                            taskList.push(p)
                                        })

                                        Promise.all(taskList).then(function (results) {
                                            console.log(results); // 获得一个由请求结果数据组成的Array: [{},{}]
                                            showDetail('<p>【报表】归档已完成</p>')
                                            setPercent();
                                            res10(true);
                                        }).catch(function (err) {
                                            ufma.hideloading();
                                            console.log(err);
                                            rej10(err);
                                        });

                                    }).catch(function(error){
                                        ufma.hideloading();
                                        rej10(error)
                                    })
                                } else {
                                    res10(true)
                                }
                            })
                        }).then(function (state) {
                            // console.log('==========“报表”类型已完成==========')
                            $('#current').html('上传'+ currentPeriod +'期间归档内容')
                            
                            //归档接口必要参数
                            var argu = {
                                setYear: svData.svSetYear,
                                rgCode: svData.svRgCode,
                                agencyCode: page.nowAgencyCode,
                                agencyName: page.nowAgencyName,
                                acctCode: page.nowAcctCode,
                                acctName: page.nowAcctName,
                                startMonth: currentPeriod,
                                endMonth: currentPeriod,
                                userId: svData.svUserId,
                                archiveOpt: archiveOptStr,
                                filePath: filePath,
                                // gdnr: "总账类MXL，总账，余额表"
                            }
                            //该期间内归档处理
                            ufma.ajax(interfaceURL.archive, "get", argu, function (result) {
                                // ufma.showTip(result.msg, function () { }, result.flag);
                                showDetail('<p style="color: green;font-size: 14px;">期间 ' + currentPeriod + '月归档结果：'+result.msg+'</p>')
                                currentPeriod++;
                                page.completeCount++
                                page.percent = parseInt((page.completeCount/page.qjTotal)*100);
                                if(archiveTypeIsChecked('isGG')){
                                    page.curCount++
                                }
                                if(archiveTypeIsChecked('isGlXml')){
                                    page.curCount++
                                }
                                page.subPercent = parseInt((page.curCount/page.optTotal)*100);
                                $('#subpercent').html(page.subPercent+'%')
                                $('#subProgressBar').css({width:page.subPercent+'%'});
                                $('#progressBar').css({width:page.percent+'%'});
                                $('#percent').html(page.percent+'%')
                                if(currentPeriod<=endPeriod){
                                    archiveByPeriod(currentPeriod , endPeriod);
                                }else{
                                    showDetail('<p>============全部归档流程已完成============</p>')
                                    $('#current').html('完成')
                                    ufma.hideloading();
                                }
                            })
                        }).catch(function (err) {
                            // ufma.showTip(err, function () { }, "error");
                            showDetail('<p style="color: red;font-size: 14px;">期间 ' + currentPeriod + '月归档结果：'+err+'</p>')
                            currentPeriod++;
                            page.completeCount++
                            page.percent = parseInt((page.completeCount/page.qjTotal)*100);
                            $('#progressBar').css({width:page.percent+'%'});
                            $('#percent').html(page.percent+'%')
                            if(currentPeriod<=endPeriod){
                                archiveByPeriod(currentPeriod , endPeriod);
                            }else{
                                showDetail('<p>============全部归档流程已完成============</p>')
                                $('#current').html('完成')
                                ufma.hideloading();
                            }
                        })
                    }
                })
            },
            //此方法必须保留
            init: function () {
                ufma.parse();
                page.initPage();
                page.onEventListener();
                ufma.parseScroll();
            }
        }
    }();
    /////////////////////
    page.init();
});
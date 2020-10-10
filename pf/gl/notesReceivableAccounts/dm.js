var dm = {
    getCtrl: function (tag) {
        var url = '';
        switch (tag) {
            //单位树
            case 'agency':
                url = '/gl/eleAgency/getAgencyTree';
                break;
            //账套
            case 'acct':
               // url = '/gl/eleCoacc/getCoCoaccs/';
                 url = '/gl/eleCoacc/getRptAccts';//多区划
                break;
            //备查类型
            case 'receivableType':
                url = '/gl/CbBillBook/RECEIVABLE_TYPE';
                break;
            //出票人
            case 'billPerson':
                url = '/gl/CbBillBook/selectEleCurrent';
                break;
            //票据类型、往来单位
            case 'commonApi':
                url = '/gl/elecommon/getEleCommonTree';
                break;
            //会计科目
            case 'getAcco':
                url = '/gl/sys/coaAcc/getRptAccoTree';
                break;
            case 'queryAccoTable':
                url = '/ma/sys/coaAcc/queryAccoTable'
                break;
            //查询主表格数据
            case 'search':
                url = '/gl/current/rp/selectCurVouDetailAss';
                break;
            //保存坏账
            case 'saveBadAccount':
                url = '/gl/current/rp/saveCurAssBadDebt';
                break;
            //删除坏账
            case 'deleteBadAccount':
                url = '/gl/current/rp/deleteCurAssBadDebt';
                break;

            //坏账原因
            case 'badReason':
                url = '/gl/enumerate/BAD_REASON';
                break;

            //获取查询方案
            case 'getPlan':
                url = '/gl/rpt/prj/getPrjList';
                break;

            //删除查询方案
            case 'delPlan':
                url = '/gl/rpt/prj/deletePrj';
                break;
            default:
                break;
        }
        return url;
    },
    doGet: function (ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        ufma.get(this.getCtrl(ctrl), argu, _callback);
    },
    doDefGet: function (ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        ufma.ajaxDef(this.getCtrl(ctrl), 'get',argu, _callback)
    },
    doPost: function (ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        ufma.post(this.getCtrl(ctrl), argu, _callback);
    },
    doDel: function(ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function(result) {};
        ufma.delete(this.getCtrl(ctrl), argu, _callback);
    },
    //取表格数据
    loadGridData: function (argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        };
        ufma.get(this.getCtrl('search'), argu, _callback);
    },
    //备查类型
    cbbReterType: function (argu, _callback) {
        this.doGet('receivableType', argu, _callback);
    },
    radioLabelDPEType: function (_cnt) {
        $(_cnt).html('');
        this.doGet('dpetype', {}, function (result) {
            for (var i = 0; i < result.data.length; i++) {
                var item = result.data[i];
                $('<a name="apportionType" value="' + item.ENU_CODE + '" id="' + item.ENU_CODE + '" class="label label-radio ' + (i == 0 ? 'selected' : '') + '">' + item.ENU_NAME + '</a>').appendTo(_cnt);
            }
        });
    },
    //票据类型、往来单位
    commonApi: function (argu, _callback) {
        //切换往来单位的时候，同步请求不影响往来单位和个人的下拉数据 guohx 20200728
        this.doDefGet('commonApi', argu, _callback);
    },
    //出票人
    cbbBillPerson: function (argu, _callback) {
        argu.enabled = "-1";
        argu.chrName = "";
        argu.contact = "";
        this.doGet('billPerson', argu, _callback);
    },
    //保存坏账
    doSaveBadAccount: function (argu, _callback) {
        this.doPost('saveBadAccount', argu, _callback);
    },
    //付款单位
    // payerAgency: function (argu, _callback) {
    //     argu.enabled = "-1";
    //     argu.chrName = "";
    //     argu.contact = "";
    //     this.doGet('billPerson', argu, _callback);
    // },
    //承兑单位
    acceptAgency: function (argu, _callback) {
        argu.enabled = "-1";
        argu.chrName = "";
        argu.contact = "";
        this.doGet('billPerson', argu, _callback);
    },
    //会计科目
    getAcco: function (argu, _callback) {
        this.doGet('getAcco', argu, _callback);
    },
    queryAccoTable: function(argu, _callback){
        this.doGet('queryAccoTable', argu, _callback);
    },
    getBadReason: function (argu, _callback) {
        this.doGet('badReason', argu, _callback);
    }

};
var ptData = ufma.getCommonData();
dm.curPlan = {};
dm.portList = {
    savePrj: "/gl/rpt/prj/savePrj", //保存查询方案
    prjContent: "/gl/rpt/prj/getPrjcontent", //查询方案内容接口
    deletePrj: "/gl/rpt/prj/deletePrj" //删除查询方案
};
//请求函数——请求保存方案
dm.reqSavePrj = function (quryObj,isNew) {
    var savePrjArgu = {};

    savePrjArgu.acctCode = quryObj.acctCode; //账套代码
    savePrjArgu.agencyCode = quryObj.agencyCode; //单位代码

    savePrjArgu.prjCode = isNew ? '' : $("#methodName").attr("data-code"); //方案代码
    savePrjArgu.prjName = $("#methodName").val(); //方案名称
    savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val(); //方案作用域
    savePrjArgu.rptType = "RECEIVABLE_ACCOUNT"; //账表类型
    savePrjArgu.setYear = ptData.svSetYear; //业务年度
	//修改权限  将svUserCode改为 svUserId  20181012
    savePrjArgu.userId = ptData.svUserId; //用户Id
    // savePrjArgu.userId = ptData.svUserCode; //用户Id

    //方案内容
    savePrjArgu.prjContent = dm.prjContObj(quryObj);

    ufma.ajax(dm.portList.savePrj, "post", savePrjArgu, dm.resSavePrj);
};
//返回方案内容对象
dm.prjContObj = function (quryObj) {
    //方案内容
    prjContObj = {
        "accaCode": "*",
        "curCode": "",
        "rptStyle": "SANLAN",
        "rptTitleName": ""
    };
    //会计体系代码
    prjContObj.accaCode = "";

    //选择的单位账套信息
    prjContObj.agencyAcctInfo = [];
    var acctInfoObj = {};
    acctInfoObj.acctCode = quryObj.acctCode; //科目代码
    acctInfoObj.agencyCode = quryObj.agencyCode; //单位代码
    prjContObj.agencyAcctInfo.push(acctInfoObj);
    var currentTypeSign = $('#hxType .selected').attr('value');
    prjContObj.accoCode = quryObj.accoCode;//科目代码
    prjContObj.accoName = quryObj.accoName; //科目名称
    prjContObj.startVouDate = quryObj.startVouDate; //起始日期(如2017-01-01)
    prjContObj.endVouDate = quryObj.endVouDate; //截止日期(如2017-01-01)
    prjContObj.startYear = ""; //起始年度(只有年，如2017)
    prjContObj.startFisperd = ""; //起始期间(只有月份，如7)
    prjContObj.endYear = ""; //截止年度(只有年，如2017)
    prjContObj.endFisperd = ""; //截止期间(只有月份，如7)
    prjContObj.currentCode = quryObj.currentCode;
    prjContObj.billType = quryObj.billType;
    prjContObj.billNo = quryObj.billNo;
    prjContObj.minAmt = quryObj.minAmt;
    prjContObj.maxAmt = quryObj.maxAmt;
    prjContObj.rptOption = [{
        "defCompoValue": "Y",
        "optCode": "IS_INCLUDE_UNPOST",
        "optName": "含未记账凭证"
    }];
    prjContObj.dataType = quryObj.dataType;
    //核算项设置
    prjContObj.qryItems = [];
    //查询条件对象
    prjContObj.rptCondItem = [];


    prjContObj.rptStyle = ""; //账表样式
    prjContObj.rptTitleName = ""; //账表中标题名称
    return prjContObj;
};
//回调函数——请求保存方案
dm.resSavePrj = function (result) {
    var flag = result.flag;
    dm.prjCode = result.data.prjCode;
    var prjScope = result.data.prjScope;
    dm.curPlan = result.data;
    if (flag == "success") {

        ufma.showTip("查询方案保存成功！", function () {
            dm.setQuery.close();
        }, "success");
        // //重构-刷新方案列表
        dm.showPlan({
            "agencyCode": $('#cbAgency').getObj().getValue(),
            "acctCode": $("#cbAcct").getObj().getValue(),
            "rptType": "RECEIVABLE_ACCOUNT",
            "userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
            "setYear": ptData.svSetYear
        });

    } else {
        ufma.alert(result.msg, "error");
        return false;
    }
};
//请求往来单位
dm.payerAgency=function (agencyCode) {
    var reqData = {
        agencyCode: agencyCode,
        setYear: ptData.svSetYear,
        rgCode: ptData.svRgCode,
        eleCode:"CURRENT"
    };

    dm.commonApi(reqData, function (result) {
        dm.payerAgencyData = result.data;
        $('#currentCode').getObj().load(result.data);
        $('#btnQuery').trigger('click');
    });
},
//请求个人往来（人员列表）
dm.payerEmployee=function (agencyCode) {
    var reqData = {
        agencyCode: agencyCode,
        setYear: ptData.svSetYear,
        rgCode: ptData.svRgCode,
        eleCode:"EMPLOYEE"
    };

    dm.commonApi(reqData, function (result) {
        dm.payerAgencyData = result.data;
        $('#currentCode').getObj().load(result.data);
        $('#btnQuery').trigger('click');
    });
},
//请求函数——请求方案内容
dm.reqPrjCont = function (prjCode) {
    var prjContArgu = {
        "agencyCode": $('#cbAgency').getObj().getValue(),
        "acctCode": $("#cbAcct").getObj().getValue(),
        "prjCode": prjCode,
        "rptType": "RECEIVABLE_ACCOUNT",
        "userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
        "setYear": ptData.svSetYear
    };
    ufma.ajax(dm.portList.prjContent, "get", prjContArgu, dm.showPrjCont);
};
dm.showPrjCont = function (result) {
    var prjContent = JSON.parse(result.data.prjContent);
    var _keywords = prjContent.accoCode;
    dm.searchNodeLazy(_keywords);
    $('#frmQuery').setForm(prjContent);
    $('#queryMore').setForm(prjContent);
    $('#searchText').attr("chrCode",_keywords).val(prjContent.accoName);
    if(prjContent.dataType == "02"){
        //切换往来类型 S
        $("#colAction .text").text("个人");
        $("#colAction").attr("data-type","02");
        //切换往来类型 E
        dm.payerEmployee(prjContent.agencyCode);
    }else{
        //切换往来类型 S
        $("#colAction .text").text("单位");
        $("#colAction").attr("data-type","01");
        //切换往来类型 E
        dm.payerAgency(prjContent.agencyCode);
    }
    dm.prjCode = result.data.prjCode;


};
//打开-保存查询方案模态框
dm.openSaveMethodModal = function () {
    $('#saveMethod').on('click', function () {
        var meLi = $("#rptPlanList li.selected");
        if ($(meLi).length > 0) {
            var code = $(meLi).attr("data-code");
            var name = $(meLi).attr("data-name");
            var scope = $(meLi).attr("data-scope"); //作用域
            $("#methodName").val(name).attr("data-code", code);
            var nn = parseInt(scope - 1);
            $(".rpt-radio-span").find("input").prop("checked", false);
            $(".rpt-radio-span").eq(nn).find("input").prop("checked", true);

        } else {
            $("#methodName").val("").attr("data-code", "");
            $(".rpt-radio-span").eq(0).find("input").attr("checked");
            $(".rpt-radio-span").eq(0).siblings().find("input").removeAttr("checked");
        }

        dm.setQuery = ufma.showModal('saveMethod-box', 600, 320);
    });
    $('.btn-close').on('click', function () {
        dm.setQuery.close();
    });

    document.onkeydown = function (e) {
        //捕捉回车事件
        var ev = (typeof event != 'undefined') ? window.event : e;
        if (ev.keyCode == 13) {
            return false;
        }
    }
};

//输入方案名的提示
dm.methodNameTips = function () {
    $('#methodName').on('focus', function () {
        ufma.hideInputHelp('methodName');
        $('#methodName').closest('.form-group').removeClass('error');
    }).on("blur", function () {
        if ($("#methodName").val().trim() == "") {
            ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
            $('#methodName').closest('.form-group').addClass('error');
        }
    });
};
dm.showPlan = function (argu) {
    function buildPlanItem(data) {
        for (var i = 0; i < data.length; i++) {
            var liHtml = ufma.htmFormat('<li data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
                code: data[i].prjCode,
                name: data[i].prjName,
                scope: data[i].prjScope
            });
            $(liHtml)[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
        }
        $("#rptPlanList li").each(function () {
            var e = $._data(this, "events");
            if (e && e["click"]) {

            }else{
                $(this).click(function (e) {
                    if ($(e.target).is('.btn-close')) {
                        var _li = $(e.target).closest('li');
                        var planCode = _li.attr('data-code');
                        var planName = _li.attr('data-name');
                        dm.delPlan(planCode, planName, function (action) {
                            if (action) {
                                _li.remove();
                                $("#rptPlanList").ufTooltip('hide');
                            }
                        });
                    } else {
                        $("#rptPlanList").ufTooltip('hide');
                        // if ($(this).hasClass('selected')) return false;
                        $(this).siblings('.selected').removeClass('selected');
                        $(this).addClass('selected');

                        var planCode = $(this).attr('data-code');
                        dm.selectPlan(planCode);
                    }
                })
            }
        })
    }

    $("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
    dm.getPlan(argu, buildPlanItem);
    // this.getShearPlan(argu, buildPlanItem);

    // $("#rptPlanList").on('click', 'li', function (e) {
    //
    // });
};
dm.selectPlan = function (planCode) {
    //此方法调用rptCommon2.js
    dm.reqPrjCont(planCode);
};
dm.delPlan = function (planCode, planName, _callback) {
    ufma.confirm('您确定要删除查询方案' + planName + '吗?', function (action) {
        if (action) {
            var argu = {
                "agencyCode": $('#cbAgency').getObj().getValue(),
                "rptType": "RECEIVABLE_ACCOUNT",
                "userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
                "setYear": ptData.svSetYear,
                "prjCode":planCode
            };
            dm.doDel('delPlan', argu, function (result) {
                ufma.showTip("方案删除成功！", function () {

                }, "success");
                _callback(true);
                //
                //如果删除的是当前选择的方案，需要清空查选条件
                if(dm.prjCode == planCode){
                    dm.prjCode = "";
                    dm.backToOrigin();
                }
            });
        }
    }, {
        type: 'warning'
    });
};
dm.backToOrigin = function () {
    // var _keywords = "";
    // dm.searchNodeLazy(_keywords);
    // $('#frmQuery').setForm({});
    $('#queryMore').setForm({});
    // $('#searchText').val("");
    $("#minAmt input").val("");
    $("#maxAmt input").val("");
    $("#billNo input").val("");
};
// 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
var timeoutId = null;
dm.searchNodeLazy = function (_keywords) {
    var zTreeObj = $.fn.zTree.getZTreeObj("baseTree");
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
dm.getPlan = function (argu, _callback) {
    this.doGet('getPlan', argu, function (result) {
        _callback(result.data);
    });
};
$.fn.dataTable.ext.errMode = 'none';
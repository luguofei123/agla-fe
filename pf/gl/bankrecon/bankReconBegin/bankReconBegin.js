$(function () {
    var isOppositeid = "";
    var page = function () {

        //对账方案接口
        var beginList = {
            agencyList: "/gl/eleAgency/getAgencyTree",//单位列表接口
            acctList: "/gl/eleCoacc/getRptAccts",//账套列表接口
            accScheList: "/gl/bank/recon/getBankReconSche",//方案查询接口
            bankReconBeginList: "/gl/bank/getBankBalAccInit",//获取银行对账期初
            saveBankReconBegin: "/gl/bank/saveBankBalAccInit",//保存银行对账期初
        };

        return {
            namespace: "bankReconBegin",
            get: function (tag) {
                return $('#' + this.namespace + ' ' + tag);
            },

            //获取对账方案列表
            reqMethod: function (data) {
                var argu = {
                    "agencyCode": page.agencyCode
                }
                ufma.get(beginList.accScheList, argu, function (result) {
                    var data = result.data;
                    var selectList = $("#selectList").ufCombox({
                        data: data
                    });
                    $("input").attr("autocomplete", "off");
                    //无对账方案
                    if (data.length == 0) {
                        page.schemaGuid = "";
                        //colOnload[0].push(delOpt);
                        //colOnloadOne[0].push(delOpt);
                        // page.initTable('lateBox', dataOnload, colOnload);
                        // page.initTable('listBox', dataOnloadOne, colOnloadOne);
                        // colOnload[0].pop(delOpt);
                        // colOnloadOne[0].pop(delOpt);
                        $("#reconChangeInput,#bankChangeInput").val('');
                        $("#changeAfter,#changeAfterOne,#bankBeginGrid td:eq(3)," +
                            "#bankBeginGrid td:eq(5),#reconBeginGrid td:eq(3),#reconBeginGrid td:eq(5)").html('0.00');
                    }
                    if (data.length > 0) {
                        $("#selectList").getObj().val(data[0].schemaGuid);
                        page.schemaGuid = data[0].schemaGuid;
                        //page.reqReconBegin();
                    }
                });
            },


            //根据方案id向后台获取表格数据
            reqReconBegin: function () {
                //page.fixedTable();
                ufma.get(beginList.bankReconBeginList + '/' + page.schemaGuid + '/' + page.agencyCode, "", function (result) {
                    var data = result.data;
                    page.datas = data;
                    var b = 0;
                    $("#journalLsCount").text(data.journalLsCount);
                  //  $("#journalLsDr").text(data.journalLsDr);
                    $("#journalLsDr").text(rpt.comdify(data.journalLsDr.toFixed(2)));//修改bug79676--金额千分位格式化--zsj
                   // $("#journalLsCr").text(data.journalLsCr);
                    $("#journalLsCr").text(rpt.comdify(data.journalLsCr.toFixed(2)));//修改bug79676--金额千分位格式化--zsj
                    $("#statementLsCount").text(data.statementLsCount);
                    //$("#statementLsDr").text(data.statementLsDr);
                    $("#statementLsDr").text(rpt.comdify(data.statementLsDr.toFixed(2)));//修改bug79676--金额千分位格式化--zsj
                    //$("#statementLsCr").text(data.statementLsCr);
                    $("#statementLsCr").text(rpt.comdify(data.statementLsCr.toFixed(2)));//修改bug79676--金额千分位格式化--zsj
                    if (data.bankInit) {
                        $("#changeAfter").html(rpt.comdify(data.bankInit.agencyBalAmt.toFixed(2)));
                        $("#changeAfterOne").html(rpt.comdify(data.bankInit.bankBalAmt.toFixed(2)));
                        $("#bankChangeInput").val(rpt.comdify(data.bankInit.agencyAmt.toFixed(2)));
                        $("#reconChangeInput").val(rpt.comdify(data.bankInit.bankAmt.toFixed(2)));
                        $("#bankBeginGrid td:eq(3)").html(rpt.comdify(data.bankInit.bankIncome.toFixed(2)));
                        $("#bankBeginGrid td:eq(5)").html(rpt.comdify(data.bankInit.bankLoan.toFixed(2)));
                        $("#reconBeginGrid td:eq(3)").html(rpt.comdify(data.bankInit.agencyIncome.toFixed(2)));
                        $("#reconBeginGrid td:eq(5)").html(rpt.comdify(data.bankInit.agencyLoan.toFixed(2)));
                    }
                    else {
                        $("#reconChangeInput").val('');
                        $("#bankChangeInput").val('');
                        $("#changeAfter,#changeAfterOne,#bankBeginGrid td:eq(3),#bankBeginGrid td:eq(5),#reconBeginGrid td:eq(3),#reconBeginGrid td:eq(5)").html(b.toFixed(2));
                    }
                })
            },
            //所有计算
            //定义小数加减
            accAdd: function (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2))
                return ((arg1 * m + arg2 * m) / m).toFixed(2);
            },
            subTr: function (arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                //动态控制精度长度
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(2);
            },

            //无onInput,onKeyup事件时的计算
            calMoneyOne: function () {
                var DYSeq1 = 0;
                var DYFeq1 = 0;
                var YDSeq1 = 0;
                var YDFeq1 = 0;
                var c = 0;
                $("#lateBoxBody td.money:even").each(function (idx, item) {
                    var eq = item.innerHTML;
                    eq = eq.replaceAll(',', '');
                    if (eq == '') {
                        eq = 0;
                    }
                    DYSeq1 += parseFloat(eq);
                })
                $("#reconBeginGrid td:eq(3)").html(rpt.comdify(DYSeq1.toFixed(2)));

                $("#lateBoxBody td.money:odd").each(function (idx, item) {
                    var eq = item.innerHTML;
                    eq = eq.replaceAll(',', '');
                    if (eq == '') {
                        eq = 0;
                    }
                    DYFeq1 += parseFloat(eq);
                })
                $("#reconBeginGrid td:eq(5)").html(rpt.comdify(DYFeq1.toFixed(2)));

                if ($("#reconChangeInput").val() == '') {
                    $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd(0, $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                }
                else {
                    $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd($("#reconChangeInput").val().replaceAll(',', ''), $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                }

                $("#listBoxBody td.money:even").each(function (idx, item) {
                    var eq = item.innerHTML;
                    eq = eq.replaceAll(',', '');
                    if (eq == '') {
                        eq = 0;
                    }
                    YDSeq1 += parseFloat(eq);
                })
                $("#bankBeginGrid td:eq(3)").html(rpt.comdify(YDSeq1.toFixed(2)));

                $("#listBoxBody td.money:odd").each(function (idx, item) {
                    var eq = item.innerHTML;
                    eq = eq.replaceAll(',', '');
                    if (eq == '') {
                        eq = 0;
                    }
                    YDFeq1 += parseFloat(eq);
                })
                $("#bankBeginGrid td:eq(5)").html(rpt.comdify(YDFeq1.toFixed(2)));
                $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd($("#bankChangeInput").val().replaceAll(',', ''), $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
            },
            //模态窗
            openEditWin: function (data, enabled, namecla) {
                var type, stitle;
                if (namecla == "bankReconciliationid") {
                    stitle = '银行对账单期初未达项';
                    // var tableId = 'listBox';
                    // tableId = 'lateBox';
                    type = '1';
                } else {
                    stitle = '单位日记账期初未达项';
                    // tableId = 'lateBox';
                    type = '0';
                }
                if (page.datas == undefined || page.datas == null) {
                    ufma.showTip("请选择对账方案", function () {

                    }, "warning");
                    return false;
                }
                ufma.open({
                    url: 'agencyJournal.html',
                    title: stitle,
                    width: 1054,
                    data: {
                        'data': data,
                        // 'tableId': tableId,
                        'type': type,
                        'tableId': 'lateBox',
                        'schemaGuid': page.schemaGuid,
                        'agencyCode': page.agencyCode,
                        'bankChangeInput': $("#bankChangeInput").val().replaceAll(',', ''),
                        'reconChangeInput': $("#reconChangeInput").val().replaceAll(',', ''),
                        'datas': page.datas
                    },
                    ondestory: function (result) {
                        page.reqReconBegin();
                    }
                });
            },
            //动态计算
            calMoney: function () {
                //调整前余额onInput事件计算
                $("#reconChangeInput").on("input propertychange", function () {
                    if ($(this).val() == '') {
                        $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd(0, $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                    else {
                        $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd($("#reconChangeInput").val().replaceAll(',', ''), $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                });
                $("#bankChangeInput").on("input propertychange", function () {
                    if ($(this).val() == '') {
                        $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd(0, $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                    else {
                        $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd($("#bankChangeInput").val().replaceAll(',', ''), $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                });
                //调整前余额onblur事件
                $("#reconChangeInput").on("blur", function () {
                    if ($(this).val() != '') {
                        var oldVal = rpt.comdify(parseFloat($(this).val().replaceAll(',', '')).toFixed(2));
                        $(this).val(oldVal);
                        $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd($("#reconChangeInput").val().replaceAll(',', ''), $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    } else {
                        $(this).val("0.00");
                    }
                })
                $("#bankChangeInput").on("blur", function () {
                    if ($(this).val() != '') {
                        var oldVal = rpt.comdify(parseFloat($(this).val().replaceAll(',', '')).toFixed(2));
                        $(this).val(oldVal);
                        $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd($("#bankChangeInput").val().replaceAll(',', ''), $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    } else {
                        $(this).val("0.00");
                    }

                })
                //可编辑表格onKeyup事件计算
                //定义日记账借方额之和
                function calLateEven() {
                    var DYSeq = 0;
                    $("#lateBoxBody td.money:even").each(function (idx, item) {
                        var eq = item.innerHTML;
                        eq = eq.replaceAll(',', '')
                        if (item.innerHTML == '') {
                            eq = 0
                        }
                        DYSeq += parseFloat(eq);
                    })
                    $("#reconBeginGrid td:eq(3)").html(rpt.comdify(DYSeq.toFixed(2)));
                }

                //定义日记账贷方额之和
                function calLateOdd() {
                    var DYFeq = 0;
                    $("#lateBoxBody td.money:odd").each(function (idx, item) {
                        var eq = item.innerHTML;
                        eq = eq.replaceAll(',', '')
                        if (item.innerHTML == '') {
                            eq = 0
                        }
                        DYFeq += parseFloat(eq);
                    })
                    $("#reconBeginGrid td:eq(5)").html(rpt.comdify(DYFeq.toFixed(2)));
                }

                //定义对账单借方额之和
                function calListEven() {
                    var YDSeq = 0;
                    $("#listBoxBody td.money:even").each(function (idx, item) {
                        var eq = item.innerHTML;
                        eq = eq.replaceAll(',', '')
                        if (item.innerHTML == '') {
                            eq = 0
                        }
                        YDSeq += parseFloat(eq);
                    })
                    if (isOppositeid != 1) {
                        $("#bankBeginGrid td:eq(3)").html(rpt.comdify(YDSeq.toFixed(2)));
                    } else {
                        $("#bankBeginGrid td:eq(5)").html(rpt.comdify(YDSeq.toFixed(2)));
                    }

                    /*$("#bankBeginGrid td:eq(3)").html(rpt.comdify(YDSeq.toFixed(2)));*/
                }

                //定义对账单贷方额之和
                function calListOdd() {
                    var YDFeq = 0;
                    $("#listBoxBody td.money:odd").each(function (idx, item) {
                        var eq = item.innerHTML;
                        eq = eq.replaceAll(',', '')
                        if (item.innerHTML == '') {
                            eq = 0
                        }
                        YDFeq += parseFloat(eq);
                    })
                    if (isOppositeid != 1) {
                        $("#bankBeginGrid td:eq(5)").html(rpt.comdify(YDFeq.toFixed(2)));
                    } else {
                        $("#bankBeginGrid td:eq(3)").html(rpt.comdify(YDFeq.toFixed(2)));

                    }
                    /*$("#bankBeginGrid td:eq(5)").html(rpt.comdify(YDFeq.toFixed(2)));*/
                }

                //单位日记账借方金额之和
                $("#lateBoxmoneyamtDr").on('keyup blur', function (idx) {
                    //借贷方同一行只能有一个值
                    $("#lateBoxmoneyamtCr").val('');
                    var point = $(this).closest('div').attr('rowid');
                    $("#lateBoxBody #" + point).eq(1).find("td[name='amtCr']").html('');
                    calLateEven();
                    calLateOdd();
                    $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd($("#reconChangeInput").val().replaceAll(',', ''), $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    if ($("#reconChangeInput").val() == '') {
                        $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd(0, $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                })
                //单位日记账贷方金额之和
                $("#lateBoxmoneyamtCr").on('keyup blur', function () {
                    $("#lateBoxmoneyamtDr").val('');
                    var point = $(this).closest("div").attr('rowid');
                    $("#lateBoxBody #" + point).eq(1).find("td[name='amtDr']").html('')
                    calLateEven();
                    calLateOdd();
                    $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd($("#reconChangeInput").val().replaceAll(',', ''), $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    if ($("#reconChangeInput").val() == '') {
                        $("#changeAfterOne").html(rpt.comdify(page.subTr(page.accAdd(0, $("#reconBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                    }
                })
                //银行对账单借方金额之和
                $("#listBoxmoneyamtDr").on('keyup blur', function () {
                    $("#listBoxmoneyamtCr").val('');
                    var point = $(this).closest("div").attr('rowid');
                    $("#listBoxBody #" + point).eq(1).find("td[name='amtCr']").html('')
                    calListEven();//借方额之和
                    calListOdd();//贷方额之和

                    $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd($("#bankChangeInput").val().replaceAll(',', ''), $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                })
                //银行对账单贷方金额之和
                $("#listBoxmoneyamtCr").on('keyup blur', function () {
                    $("#listBoxmoneyamtDr").val('');
                    var point = $(this).closest("div").attr('rowid');
                    $("#listBoxBody #" + point).eq(1).find("td[name='amtDr']").html('')
                    calListEven();//借方额之和
                    calListOdd();//贷方额之和
                    $("#changeAfter").html(rpt.comdify(page.subTr(page.accAdd($("#bankChangeInput").val().replaceAll(',', ''), $("#bankBeginGrid td:eq(3)").html().replaceAll(',', '')), $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''))));
                })
            },
            onEventListener: function () {
                page.calMoney();
                var data = {};
                var namecla = "Journalid";
                $("#Journalid").on("click", function (e) {
                    e.preventDefault();
                    page.openEditWin(data, true, namecla);
                })
                $("#bankReconciliationid").on("click", function (e) {
                    e.preventDefault();
                    var namecla = "bankReconciliationid";
                    page.openEditWin(data, true, namecla);
                })
                $(".btn-close").on("click", function () {
                    page.editor.close();
                })
                //切换单位未达项、对账单未达项
                $(".nav-tabs li").each(function (i) {
                    $(this).on("click", function () {
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".cont-tabs" + i).show().siblings().hide();
                    });
                });
               
                //清空表格数据
                $(".btn-empty").on('click', function () {
                    var a = 0, banckRestAmt, agencyRestAmt;
                    // $("#lateBoxBody .uf-grid-body-view tr:gt(0)").each(function () {
                    //     for (var i = 1; i < $(this).find("td").length - 1; i++) {
                    //         $(this).find("td").eq(i).empty();
                    //     }
                    // })
                    // $("#listBoxBody .uf-grid-body-view tr:gt(0)").each(function () {
                    //     for (var i = 1; i < $(this).find("td").length - 1; i++) {
                    //         $(this).find("td").eq(i).empty();
                    //     }
                    // })
                    $("#bankChangeInput").val(a.toFixed(2));
                    $("#reconChangeInput").val(a.toFixed(2));
                    banckRestAmt = (page.datas.bankInit.agencyIncome - page.datas.bankInit.agencyLoan).toFixed(2);
                    agencyRestAmt = (page.datas.bankInit.bankIncome - page.datas.bankInit.bankLoan).toFixed(2);
                    $("#changeAfterOne").html($.formatMoney(banckRestAmt, 2));
                    $("#changeAfter").html($.formatMoney(agencyRestAmt, 2));
                    // $(".empty").html(a.toFixed(2)).val(a.toFixed(2));
                    // $("#changeAfter,#changeAfterOne").html(a.toFixed(2));
                });
                //保存期初对账
                $(".btn-save").on('click', function () {
                    //检测是否有对账方案
                    var argus = {
                        "agencyCode": chrCodeid
                    };
                    ufma.get(beginList.accScheList, argus, function (result) {
                        var data = result.data;
                        if (data.length == 0) {
                            ufma.showTip("请选择对账方案！", function () {
                            }, "warning");
                            return false;
                        }
                        //预设保存条件
                        if ($("#changeAfter").html() != $("#changeAfterOne").html()) {
                            ufma.showTip("单位调整后余额和银行调整后余额不调平！", function () {
                            }, "warning");
                            return false;
                        }
                        // var journal = $("#lateBox").getObj().getData();
                        //
                        // for (var i = 0; i < journal.length; i++) {
                        //     journal[i]['amtDr'] = journal[i]['amtDr'] ? journal[i]['amtDr'].replaceAll(',', '') : '0.00';
                        //     journal[i]['amtCr'] = journal[i]['amtCr'] ? journal[i]['amtCr'].replaceAll(',', '') : '0.00';
                        //     journal[i]['ordSeq'] = i + 1;
                        //     if (journal[i]['vouDate'] == null || journal[i]['vouDate'] == '') {
                        //         ufma.showTip("有日记账未达项日期未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        //     if ($.isNull(journal[i]['descpt'])) {
                        //         ufma.showTip("有日记账摘要未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        //     if (journal[i]['amtCr'] == '0.00' && journal[i]['amtDr'] == '0.00') {
                        //         ufma.showTip("有日记账借贷金额未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        // }
                        // var statement = $("#listBox").getObj().getData();
                        // console.log(statement);
                        // for (var j = 0; j < statement.length; j++) {
                        //     statement[j]['amtDr'] = statement[j]['amtDr'] ? statement[j]['amtDr'].replaceAll(',', '') : '0.00';
                        //     statement[j]['amtCr'] = statement[j]['amtCr'] ? statement[j]['amtCr'].replaceAll(',', '') : '0.00';
                        //     statement[j]['ordSeq'] = j + 1;
                        //     if (statement[j]['statementDate'] == null || statement[j]['statementDate'] == '') {
                        //         ufma.showTip("有对账单未达项日期未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        //     if ($.isNull(statement[j]['descpt'])) {
                        //         ufma.showTip("有对账单摘要未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        //     if (statement[j]['amtCr'] == '0.00' && statement[j]['amtDr'] == '0.00') {
                        //         ufma.showTip("有对账单借贷金额未填写", function () {
                        //         }, "warning");
                        //         return false;
                        //     }
                        // }
                        var argu = {
                            schemaGuid: page.schemaGuid,
                            bankInit: {
                                agencyAmt: $("#bankChangeInput").val().replaceAll(',', ''),
                                agencyIncome: $("#bankBeginGrid td:eq(3)").html().replaceAll(',', ''),
                                agencyLoan: $("#bankBeginGrid td:eq(5)").html().replaceAll(',', ''),
                                agencyBalAmt: $("#changeAfter").html().replaceAll(',', ''),
                                bankAmt: $("#reconChangeInput").val().replaceAll(',', ''),
                                bankIncome: $("#reconBeginGrid td:eq(3)").html().replaceAll(',', ''),
                                bankLoan: $("#reconBeginGrid td:eq(5)").html().replaceAll(',', ''),
                                bankBalAmt: $("#changeAfterOne").html().replaceAll(',', '')
                            },
                            journalLs: page.datas.journalLs,
                            statementLs: page.datas.statementLs
                        };
                        ufma.post(beginList.saveBankReconBegin + "?agencyCode=" + page.agencyCode, argu, function (result) {
                            ufma.showTip(result.msg, function () {
                                page.reqReconBegin();
                            }, result.flag);
                        });
                    })
                })
            },
            //初始化页面
            initPage: function () {
                var pfData = ufma.getCommonData();
                //console.info(pfData);
                page.nowDate = pfData.svTransDate;//当前年月日
                page.rgCode = pfData.svRgCode;//区划代码
                page.setYear = pfData.svSetYear;//本年 年度
                page.month = pfData.svFiscalPeriod;//本期 月份
                page.today = pfData.svTransDate;//今日 年月日
                //修改权限  将svUserCode改为 svUserId  20181012
                page.userId = pfData.svUserId; //登录用户ID
                // page.userId = pfData.svUserCode; //登录用户ID
                page.userName = pfData.svUserName;//登录用户名称
                page.agencyCode = pfData.svAgencyCode;//登录单位代码
                page.agencyName = pfData.svAgencyName;//登录单位名称
                //初始化单位列表样式
                $("#cbAgency").ufmaTreecombox2({
                    valueField: 'id',
                    textField: 'codeName',
                    placeholder: '请选择单位',
                    icon: 'icon-unit',
                    readOnly: false,
                    onchange: function (data) {
                        //给全局单位变量赋值
                        page.agencyCode = data.id;
                        page.agencyName = data.name;
                        //缓存单位账套
                        var params = {
                            selAgecncyCode: data.id,
                            selAgecncyName: data.name
                        }
                        ufma.setSelectedVar(params);
                        //获取对账方案列表
                        page.reqMethod(data);
                    }
                });
                //请求单位列表
                ufma.ajax(beginList.agencyList, "get", {
                    "rgCode": page.rgCode,
                    "setYear": page.setYear
                }, function (result) {
                    var data = result.data;
                    var cbAgency = $("#cbAgency").ufmaTreecombox2({
                        data: result.data
                    });
                    if (data.length != 0) {
                    var code = data[0].id;
                    var name = data[0].name;
                    if (page.agencyCode != "" && page.agencyName != "") {
                        var agency = $.inArrayJson(data, 'id', page.agencyCode);
                        if (agency != undefined) {
                            cbAgency.val(page.agencyCode);
                        } else {
                            cbAgency.val(code);
                            page.agencyCode = code;
                            page.agencyName = name;
                        }
                    } else {
                        cbAgency.val(code);
                        page.agencyCode = code;
                        page.agencyName = name;
                        }
                    }
                });

                //初始化方案列表
                $("#selectList").ufCombox({
                    idField: "schemaGuid",
                    textField: "schemaName",
                    placeholder: "请选择对账方案",
                    onChange: function (sender, data) {
                        page.schemaGuid = data.schemaGuid;
                        page.reqReconBegin();
                        chrCodeid = data.agencyCode;
                        isOppositeid = data.isOpposite;
                        $("#lateBoxBody").html("");
                        $("#listBoxBody").html("");
                    }
                });
                // $("#bankChangeInput").amtInput();
                // $("#reconChangeInput").amtInput();

            },
            init: function () {
                reslist = ufma.getPermission();
                ufma.isShow(reslist);
                this.initPage();
                this.onEventListener();
            }
        }
    }();

    page.init();
});

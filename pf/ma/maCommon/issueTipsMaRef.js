$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };

    var onerdata = window.ownerData;
    var page = function () {
        return {
            renderTable: function () {
                var data = onerdata.data;
                //表头
                var tHead = '<ul class="tHead clearfix" style="width:1023px;">' +
                    '<li class="head-element tc"style="width:128px;">要素名称</li>' +
                    '<li class="head-agency-code borderL tc"style="width:122px;">单位代码</li>' +
                    '<li class="head-acco-code tc borderR borderL"style="width:300px;">科目代码</li>' +
                    '<li class="head-status tc borderR"style="width:40px;">状态</li>' +
                    '<li class="head-reason tc" style="width:431px;">原因</li>' +
                    '</ul>';
                $(".content").append(tHead);

                //表体
                var elementArr = [];
                for (var i in data) {
                    elementArr.push(i);
                    var row = '<div class="table-row  clearfix" style="width:1023px;">' +
                        '<div class="element block tc" style="width:128px;" title="' + i + '">' + i + '</div>' +
                        '<div class="agencyCode block tc clearfix" style="width:893px;"></div>' +
                        '</div>';
                    $(".content").append(row);
                }
                $(".table-row").each(function (k) {
                    var agencyCodesData = data[elementArr[k]];
                    //每个要素下的单位信息
                    for (var m = 0; m < agencyCodesData.length; m++) {
                        var agecnyCodeHtml = '<div class="agency borderL clearfix tc"style="width:893px;"><div class="agencyCon block tc" style="width:122px;" title="' + agencyCodesData[m].agencyCode + '">' + agencyCodesData[m].agencyCode + '</div>' +
                            '<div class="accoCode block borderR borderL tc" style="width:299px;"></div>' +
                            '<div class="statuss block borderR tc" style="width:40px;"></div>' +
                            '<div class="reason block tc" style="width:430px;"></div>'+
                            '</div>';
                        $(this).find(".agencyCode").append(agecnyCodeHtml);
                    }
                    $(this).find(".agency").each(function (i) {
                        //每个单位下的成功失败信息
                        var t = $(this);
                        detailReasult(agencyCodesData[i], t);
                    })

                });

                //data[k].status为1是全部成功，data[k].status为2是部分成功，data[k].status为3是全部失败
                function detailReasult(agencyCodeData, t) {
                    //失败的
                    var failIssueList = agencyCodeData.failIssueList;
                    for (var i = 0; i < failIssueList.length; i++) {
                        var failChrCodes = failIssueList[i].failChrCodes.join(",");
                        var failCodesRow = '<div class="failRow" title="' + failChrCodes + '">' + failChrCodes + '</div>';
                        if (agencyCodeData.status == "1" || agencyCodeData.status == "3") {
                            failCodesRow = '<div class="failRow" title="全部科目">全部科目</div>';
                        }
                        t.find(".accoCode").append(failCodesRow);
                        t.find(".statuss").append('<div>失败</div>');
                        var failMsg = failIssueList[i].failMsg.replace(/\<br>/gm, "");
                       // t.find(".reason").append('<div title="' + failIssueList[i].failMsg + '">' + failIssueList[i].failMsg + '</div>');
                       t.find(".reason").append('<div title="' + failMsg + '">' + failMsg + '</div>');
                    }

                    //成功的
                    var successList;
                    if(agencyCodeData.successList == ""){
                        successList = [].join(",");
                    }else{
                        successList = agencyCodeData.successList.join(",");
                    }
                    if (successList != "") {
                        var successRow = '<div class="successRow" title="'+successList+'">' + successList + '</div>';
                        if (agencyCodeData.status == "1" || agencyCodeData.status == "3") {
                            successRow = '<div class="successRow">全部科目</div>';
                        }
                        t.find(".accoCode").append(successRow);
                        t.find(".statuss").append('<div>成功</div>');
                        t.find(".reason").append('<div title=""></div>');
                    }
                    if(t.find(".failRow").length > 0 && t.find(".successRow").length > 0){
                        t.find(".agencyCon").css("height","auto");
                    }
                }
            },

            //初始化页面
            initPage: function () {
                page.renderTable();

            },
            onEventListener: function () {
                $("#btn-close").on("click", function () {
                    _close();
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

});
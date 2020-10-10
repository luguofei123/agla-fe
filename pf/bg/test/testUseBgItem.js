$(function () {
    var agencyCode = "",
        acctCode = "",
        httpType = 1;

    var bindEleCbb = function (divId, setting) {
        var url = _bgPub_requestUrlArray[8];
        ufma.get(url, null, function (data) {
            var rst = $("#" + divId).ufmaTreecombox2({
                data: data.data.items,
                icon: "",
                valueField: "eleCode",
                textField: "eleName",
                placeholder: "请选择要素",
                onchange: setting.afterChange || null
            });
        });
    };

    $("#query_addEle").off("click").on("click", function () {
        var newtr = '<tr>' +
            '   <td style="width: 30%;">' +
            '       <div class="bgpub-bgnormal-postion-1 bgelediv" id="{divid}" ></div>' +
            '   </td>' +
            '   <td>' +
            '       <div><input type="text" class="bgpub-bgnormal-postion-1 eleVal" id="{inputid}"></div>' +
            '   </td>' +
            '</tr>';
        var divid = "tr_div_" + $.getGuid(),
            inputid = "input_" + $.getGuid();
        newtr = newtr.replace("{divid}", divid).replace("{inputid}", inputid);
        $("#tbl_query_params").append(newtr);
        bindEleCbb(divid, {
            afterChange: function (data) {

                var $div = $("#" + divid).closest("tr");
                $div.attr("eleCode", data.eleCode);
                $div.attr("eleName", data.eleName);
                $div.attr("bgItemCode", data.bgItemCode);
            }
        });
    });

    $("#query_delEle").off("click").on("click", function () {
        $("#tbl_query_params").find("tr:not(.notDel)").remove();
    });

    $("#getRst").off("click").on("click", function () {
        var url = getURL(0) + '/bg/test/bghttptest';
        var data = {
            "type": httpType,
            "agencyCode": agencyCode,
            "acctCode": acctCode,
            "setYear": "2017",
            "sysId": $("#q_sysId").text(),
            "accoCode": $("#accoCode").val(),
            "busBillId": $("#busbillid").val() || "",
            "stadAmt": $("#money").val() || "",
            "elements": []
        };
        $("#tbl_query_params tr").each(function (index, tr) {
            data.elements.push({
                "eleCode": $(tr).attr("eleCode"),
                "eleValue": $(tr).find("input.eleVal").val()
            });
        });

        //********** for test **********************
        //url = getURL(0) + "/bg/sysdata/getBgToDoListCount";
        //data = {
        //    agencyCode : "124001",
        //    setYear : "2017",
        //    userId : "001",
        //};
        //*******************************************
        ufma.post(url, data, function (data) {
            var m = JSON.stringify(data);
            m = m.replace(/,/g, ",<br//>");
            $("#rstText").empty();
            $("#rstText").append(m);
            $('#modalShowRst').modal('show');
        })
    });

    var init = function () {
        $(".tabController").hide();
        var httptype = $("#httptype").ufmaTreecombox2({
            data: [{
                id: "1",
                text: "凭证-查询可用指标"
            }, {
                id: "2",
                text: "凭证-使用指标"
            }],
            icon: "",
            valueField: "id",
            textField: "text",
            placeholder: "请选择访问类型",
            onchange: function (data) {
                httpType = data.id;
                if (data.id == 1) {
                    $(".tabController").hide();
                    $("#glquery").show();
                    $("#tr_busbillid").hide();
                } else if (data.id == 2) {
                    $(".tabController").hide();
                    $("#glquery").show();
                    $("#tr_busbillid").show();
                }
            }
        });
        httptype.select(1);
        _bgPub_Bind_Cbb_AgencyList("q_agencyDiv", {
            afterChange: function (treeNode) {
                agencyCode = treeNode.id;
                // 单位切换后，切换账套
                $("#q_acctDiv").empty();
                $("#q_acctDiv").removeAttr("aria-new");
                $("#q_acctDiv").removeClass();
                _bgPub_Bind_Cbb_AcctList("q_acctDiv", {
                    afterChange: function (data) {
                        if ($.isNull(data) || data.length == 0) {
                            return;
                        }
                        acctCode = data.CHR_CODE;
                    }
                }, agencyCode);
            }
        });

    };

    init();
});
$(function () {
    var page = function () {
        return {

            onEventListener: function () {

            },

            initYixin: function () {
                var ipAPort = "10.10.5.181:7003";
                var logInfo = "id=admin&pw=admin";
                var residInfo = "&resid=" + ufma.GetQueryString("resid");
                var baseUrl = "http://" + ipAPort + "/bi/showreport.do?" + logInfo + residInfo +
                    "&@rgCode=" + page.rgCode + "&@setYear=" + page.setYear + "&@agencyCode=" + page.agencyCode +
                    "&@acctCode=" + page.acctCode + "&calcnow=true";
                $("#biRptContent").attr("src", baseUrl);
                var pageheight = $("#biRptHtml").height() - 4;
                $("#biRptHtml").height(pageheight);
            },

            initAcctScc: function () {
                page.cbAcct = $("#cbAcct").ufmaTreecombox2({
                    valueField: 'acctCode',
                    textField: 'acctName',
                    placeholder: '请选择账套',
                    icon: 'icon-book',
                    onchange: function (data) {
                        page.acctCode = data.acctCode;
                        page.agencyCode = page.cbAgency.getValue();
                        page.initYixin();
                    }
                });
            },

            initAgencyScc: function () {
                page.cbAgency = $("#cbAgency").ufmaTreecombox2({
                    leafRequire: true,
                    onchange: function (data) {
                        var code = data.id;
                        ufma.get('/ma/sys/eleAgency/selUintAcct', '', function (result) {
                            var selUnitAcct = result.data;
                            for (key in selUnitAcct) {
                                if (selUnitAcct[key].agencyCode === code) {
                                    acctData = selUnitAcct[key].acct;
                                    if (acctData != null) {
                                        page.cbAcct = $("#cbAcct").ufmaTreecombox2({
                                            data: acctData
                                        });
                                        setTimeout(100);
                                        if (page.acctCode != "" && page.acctName != "" && page.acctCode != "*" && page.acctName != "*") {
                                            page.cbAcct.setValue(page.acctCode, page.acctName);
                                        } else {
                                            page.cbAcct.select(1);
                                        }
                                        page.acctCode = page.cbAcct.getValue();
                                    }
                                }
                            }
                            page.initYixin();
                        });
                    },
                    initComplete: function (sender) {
                        page.cbAgency.val(page.agencyCode);
                    }
                });
            },

            init: function () {
                //获取session
                var pfData = ufma.getCommonData();
                page.rgCode = pfData.svRgCode;
                page.setYear = pfData.svSetYear;
                page.agencyCode = pfData.svAgencyCode;
                page.agencyName = pfData.svAgencyName;
                page.acctCode = pfData.svAcctCode;
                page.initAcctScc();
                page.initAgencyScc();
                page.onEventListener();
            }
        }
    }();

    page.init();
});
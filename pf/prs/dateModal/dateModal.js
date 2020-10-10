$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };

    var page = function () {
        var pfData;
        return {
            // 获取当前月的第一天
            getCurrentMonthFirst: function(){
                var date=new Date();
                date.setDate(1);
                return date;
            },
            // 获取当前月的最后一天
            getCurrentMonthLast: function(){
                var date=new Date();
                var currentMonth=date.getMonth();
                var nextMonth=++currentMonth;
                var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
                var oneDay=1000*60*60*24;
                return new Date(nextMonthFirstDay-oneDay);
            },
            dateBenNian : function (startId, endId) {
                // var ddYear = pfData.svSetYear;
                $("#" + startId).getObj().setValue(page.getCurrentMonthFirst());
                $("#" + endId).getObj().setValue(page.getCurrentMonthLast());
            },
            onEventListener: function () {
                $("#btn-sure").on("click",function () {
                    if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
                        return false;
                    }
                    if(!$('#dateStart').getObj().getValue()||!$('#dateEnd').getObj().getValue()){
                        ufma.showTip('请选择数据提取的时间范围', function() {}, 'error');
                        return false;
                    }
                    var argu =$('#frmQuery').serializeObject();
                    _close(argu);
                });
                $("#btn-qx").on("click",function () {
                    _close();
                })
            },

            //此方法必须保留
            init: function () {
                var ownerData = window.ownerData;
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                ufma.parse();
                pfData = ufma.getCommonData();
                
                page.onEventListener();
                var date = new Date(pfData.svTransDate);
                var year = date.getFullYear();
                var mm = date.getMonth() + 1;
                var dd1 = '01',dd2 = new Date(year, mm, 0).getDate();
                var startDate =  year + '-'  + mm + '-' + dd1,endDate =  year + '-'  + mm + '-' + dd2;

                var glRptLedgerStartDate = {
					format: 'yyyy-mm-dd',
                    initialDate: startDate,
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
                            if (curYear !== "" && curYear !== undefined && year !== curYear) {
                                ufma.showTip("只能选择本年日期", function () {
                                    $("#dateStart").getObj().setValue("")
                                }, "warning");

                            }
                        }

                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: endDate,
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
                            if (year !== curYear) {
                                ufma.showTip("只能选择本年日期", function () {
                                    $("#dateEnd").getObj().setValue("")
                                }, "warning");

                            }
                        }
                    }
                };
                $("#dateStart").ufDatepicker(glRptLedgerStartDate);
                $("#dateEnd").ufDatepicker(glRptLedgerEndDate);
                // page.dateBenNian("dateStart", "dateEnd");
                
            }
        }
    }();
/////////////////////
    page.init();
});
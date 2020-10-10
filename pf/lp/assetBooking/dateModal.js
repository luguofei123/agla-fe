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
            
            dateBenNian : function (startId, endId) {
                // var ddYear = pfData.svSetYear;
                // 获取当前月的第一天
                function getCurrentMonthFirst(){
                    var date=new Date();
                    date.setDate(1);
                    return date;
                }
                // 获取当前月的最后一天
                function getCurrentMonthLast(){
                    var date=new Date();
                    var currentMonth=date.getMonth();
                    var nextMonth=++currentMonth;
                    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
                    var oneDay=1000*60*60*24;
                    return new Date(nextMonthFirstDay-oneDay);
                }
                $("#" + startId).getObj().setValue(getCurrentMonthFirst());
                $("#" + endId).getObj().setValue(getCurrentMonthLast());
            },
            onEventListener: function () {
                $("#btn-sure").on("click",function () {
                    if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
                        return false;
                    }
                    var argu =$('#frmQuery').serializeObject();
                    var data = {
                        action:"save",
                        argu:argu
                    };
                    _close(data);
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
                page.onEventListener();
                pfData = ufma.getCommonData();
                var date = new Date(pfData.svTransDate);
                var year = date.getFullYear();

                function convertDateFromString(dateString) {
                  if (dateString) { 
                    var date = new Date(dateString.replace(/-/,"/")) 
                    return date;
                  }
                }

                var dateFrom = convertDateFromString(ownerData.dateFrom),
                dateTo = convertDateFromString(ownerData.dateTo);
                var glRptLedgerStartDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: dateFrom,
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
                        }

                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: dateTo,
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
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
    function closeModel() {
        $("#tempModalBg", parent.document).prevAll("#assetBooking").find(".lp-query-box-right .btn-query").click();
        $("#tempModalBg", parent.document).prevAll("#assetBooking").siblings("#ModalBg").css("display","none");
        $("#tempModalBg", parent.document).remove();
    }
});
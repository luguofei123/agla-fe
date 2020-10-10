/**
 * jquery datatables固定表头
 * 
 * 作者： guohx
 * 固定表头
 */
(function ($) {
    $.fn.fixedTableHeadBank = function () {
        var t = $(this);
        //获取表头距离文档顶端的高度
        var headTop = $(this).find("thead").offset().top;
        var headLeft = $(this).find("thead").offset().left;
        var h = t.find("thead").height();
        var renderFixedHead = function () {
            //固定表头
            var w = t.find("thead").width();
            var textAlign = t.find("thead").find("th").eq(1).css("text-align")
            var wrapperW = $(".dataTables_wrapper").width();
            $(".headFixedDiv").remove();
            //外层div
            var $headFixedDiv = '<div class="headFixedDiv hidden" style="position:fixed;top:' + headTop + 'px;left:31px;width:' + wrapperW + 'px;overflow:hidden;"></div>';
            $("body").append($headFixedDiv);
            $(".headFixedDiv").css("left", headLeft - 1 + "px")
            if (wrapperW == null || wrapperW == undefined || wrapperW == 0) {
                wrapperW = t.parent().width();
            }
            $(".headFixedDiv").width(wrapperW - 2);
            $(".headFixedDiv").height(h + 1);
            //内层div
            var $headFixedInnerDiv = '<div class="headFixedInnerDiv"></div>';
            $(".headFixedDiv").append($headFixedInnerDiv);
            $(".headFixedInnerDiv").width(w);
            //复制表头到内层div
            $(".headFixedInnerDiv").html("");
            var cloneTable = t.clone();
            cloneTable.appendTo($(".headFixedInnerDiv"))
            $(".headFixedInnerDiv").find("table").addClass("fixedTable")
            var id = $(".headFixedInnerDiv").find("table").attr("id");
            $(".headFixedInnerDiv").find("table").attr("id", id + "fixed")
            $(".fixedTable").find("tbody").css("visibility", "hidden")
            $(".headFixedInnerDiv").find("th").find("input[type=checkbox]").closest("label").addClass("hidden")
            $(".headFixedDiv th").css("text-align", textAlign)
        }
        //更多展开时 动态计算固定表头的top
        var reviewFixedHead = function () {
            var allHeight;
            if ($("#queryMore").outerHeight() != 0) {
                allHeight = headTop - $(window).scrollTop() + $("#queryMore").outerHeight() + 10;
            } else {
                allHeight = headTop - $(window).scrollTop();
            }
            $(".headFixedDiv").css("top", allHeight)
        }
        renderFixedHead();
        window.addEventListener('resize', renderFixedHead);
        // 简单的节流函数
        function throttle(func, wait, mustRun) {
            var timeout,
                startTime = new Date();

            return function () {
                var context = this,
                    args = arguments,
                    curTime = new Date();

                clearTimeout(timeout);
                // 如果达到了规定的触发时间间隔，触发 handler
                if (curTime - startTime >= mustRun) {
                    func.apply(context, args);
                    startTime = curTime;
                    // 没达到触发间隔，重新设定定时器
                } else {
                    timeout = setTimeout(func, wait);
                }
            };
        };
        $('#dwrjz').scroll(function(){
            if ($("#dwrjz").scrollTop() >= h) {
                $(".headFixedDiv").removeClass("hidden")
            } else {
                $(".headFixedDiv").addClass("hidden")
            }
            if ($("#dwrjz").scrollLeft() >= 0) {
                $(".headFixedDiv #heng-dwrjzfixed").css("margin-left", "-" + $("#dwrjz").scrollLeft() + "px")
            } 
        })
        // 解决页面内纵向滚动条有高度的时候 重新计算表头的top guohx 15897 
        function realFunc() {
            if ($(window).scrollTop() >= 0) {
                //解决页面表格滚动条，和页面的纵向滚动条一起滚动的时候，表头top计算不对 guohx 20200603
                reviewFixedHead();
            }
        }
        // 采用了节流函数
        window.addEventListener('scroll', throttle(realFunc, 50, 1000));
        $('#hide').on('click', function () {
            reviewFixedHead();
        })
        $('#show').on('click', function () {
            reviewFixedHead();
        })
    }
    $.fn.fixedTableHeadBankTwo = function () {
        var t = $(this);
        //获取表头距离文档顶端的高度
        var headTop = $(this).find("thead").offset().top;
        var headLeft = $(this).find("thead").offset().left;
        var h = t.find("thead").height();
        var renderFixedHead = function () {
            //固定表头
            var w = t.find("thead").width();
            var textAlign = t.find("thead").find("th").eq(1).css("text-align")
            var wrapperW = $(".dataTables_wrapper").width();
            $(".headFixedDivTwo").remove();
            //外层div
            var $headFixedDivTwo = '<div class="headFixedDivTwo hidden" style="position:fixed;top:' + headTop + 'px;left:31px;width:' + wrapperW + 'px;overflow:hidden;"></div>';
            $("body").append($headFixedDivTwo);
            $(".headFixedDivTwo").css("left", headLeft -1 + "px")
            if (wrapperW == null || wrapperW == undefined || wrapperW == 0) {
                wrapperW = t.parent().width();
            }
            $(".headFixedDivTwo").width(wrapperW - 2);
            $(".headFixedDivTwo").height(h + 1);
            //内层div
            var $headFixedInnerDivTwo = '<div class="headFixedInnerDivTwo"></div>';
            $(".headFixedDivTwo").append($headFixedInnerDivTwo);
            $(".headFixedInnerDivTwo").width(w);
            //复制表头到内层div
            $(".headFixedInnerDivTwo").html("");
            var cloneTable = t.clone();
            cloneTable.appendTo($(".headFixedInnerDivTwo"))
            $(".headFixedInnerDivTwo").find("table").addClass("fixedTable")
            var id = $(".headFixedInnerDivTwo").find("table").attr("id");
            $(".headFixedInnerDivTwo").find("table").attr("id", id + "fixed")
            $(".fixedTable").find("tbody").css("visibility", "hidden")
            $(".headFixedInnerDivTwo").find("th").find("input[type=checkbox]").closest("label").addClass("hidden")
            $(".headFixedDivTwo th").css("text-align", textAlign)
        }
        renderFixedHead();
        //更多展开时 动态计算固定表头的top
        var reviewFixedHeadTwo = function () {
            var allHeight;
            if ($("#queryMore").outerHeight() != 0) {
                allHeight = headTop - $(window).scrollTop() + $("#queryMore").outerHeight() + 10;
            } else {
                allHeight = headTop - $(window).scrollTop();
            }
            $(".headFixedDivTwo").css("top", allHeight)
        }
        window.addEventListener('resize', renderFixedHead);
        // 简单的节流函数
        function throttle(func, wait, mustRun) {
            var timeout,
                startTime = new Date();
            return function () {
                var context = this,
                    args = arguments,
                    curTime = new Date();

                clearTimeout(timeout);
                // 如果达到了规定的触发时间间隔，触发 handler
                if (curTime - startTime >= mustRun) {
                    func.apply(context, args);
                    startTime = curTime;
                    // 没达到触发间隔，重新设定定时器
                } else {
                    timeout = setTimeout(func, wait);
                }
            };
        };
        $('#yhdzd').scroll(function () {
            if ($("#yhdzd").scrollTop() >= h) {
                $(".headFixedDivTwo").removeClass("hidden")
            } else {
                $(".headFixedDivTwo").addClass("hidden")
            }
            if ($("#yhdzd").scrollLeft() >= 0) {
                $(".headFixedDivTwo #heng-yhdzdfixed").css("margin-left", "-" + $("#yhdzd").scrollLeft() + "px")
            }
        })
        // 解决页面内纵向滚动条有高度的时候 重新计算表头的top guohx 15897 
        function realFunc() {
            if ($(window).scrollTop() >= 0) {
                reviewFixedHeadTwo();
            }
        }
        // 采用了节流函数
        window.addEventListener('scroll', throttle(realFunc, 50, 1000));
        $('#hide').on('click', function () {
            reviewFixedHeadTwo();
        })
        $('#show').on('click', function () {
            reviewFixedHeadTwo();
        })
    }
})(jQuery);
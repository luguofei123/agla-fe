$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var ownerData = window.ownerData;

    var page = function () {
        return {
            onEventListener: function () {
                $("#btn-qx").on("click",function () {
                    _close();
                })
            },

            //此方法必须保留
            init: function () {
                $(".fail-reason").html(ownerData.reason);
                page.onEventListener();
            }
        }
    }();
    page.init();
});
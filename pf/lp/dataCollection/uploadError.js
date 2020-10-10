$(function () {
	var page = function () {

		return {
            initPage:function(){
                console.log(window.ownerData.data);
                // if(window.ownerData.data instanceof Array){

                // }
                $('#uploadErr').html(window.ownerData.data);
            },
            onEventListener: function(){},
			//此方法必须保留
			init: function () {
				this.initPage();
				this.onEventListener();
			}
		}
	}();

	page.init();
});
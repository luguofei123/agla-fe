$(function () {

	$("#checkVou").click(function(){
		var reqData = {
					curPage: $("#curPage").val()
		};
		ufma.get("/gl/voucheck/checkAccitemValue/"+$("#rgCode").val()+"/"+$("#setYear").val(),reqData,function(data) {});
		
	});
	
	$("#checkVouAssValue").click(function(){
		var reqData = {
					curPage: $("#curPage").val()
		};
		ufma.get("/gl/voucheck/checkVouAssValue/"+$("#rgCode").val()+"/"+$("#setYear").val(),reqData,function(data) {});
		
	});
				
});
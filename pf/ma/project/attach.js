var att = {
	vouAttachBox: "",
	vouAttachShowList: "",
	namespace: "#vouAttachBox",
	inObjArray: function (keyName, val, arr) {
		var index = -1;
		for (var i = 0; i < arr.length; i++) {
			if (val == arr[i][keyName]) {
				index = i;
			}
		}
		return index;
	}
};

$("#attachBtn").on("click", function () {
	att.vouAttachBox = ufma.showModal("vouAttachBox", 1090, 480);
});

$(att.namespace).on("mouseenter", ".attach-show-li", function () {
	$(this).find(".attach-img-btns").show();
}).on("mouseleave", ".attach-show-list li", function () {
	$(this).find(".attach-img-btns").hide();
});

$(att.namespace).on("click", ".attach-img-btns .icon-edit", function () {
	var editDom = $(this).parent(".attach-img-btns").siblings(".attach-img-sub-edit");
	var txt = $(editDom).siblings(".attach-img-sub").attr("title");
	$(editDom).siblings(".attach-img-sub").hide();
	$(editDom).find("input").val(txt);
	$(editDom).show();
});
$(att.namespace).on("click", ".attach-img-sub-edit .icon-check", function () {
	$(this).parent(".attach-img-sub-edit").hide();
	var txt = $(this).siblings("input").val();
	$(this).parent(".attach-img-sub-edit").siblings(".attach-img-sub").text(txt).attr("title", txt).show();
});

$(att.namespace).on("click", "#attachUploadBtn", function () {
	var projectId = $('#chrId').val();
	if (projectId != null && projectId != "") {
		$(att.namespace).find(".attach-step1").hide();
		$(att.namespace).find(".attach-step2").show();
	} else {
		ufma.showTip("上传附件前请先保存项目信息！", '', 'warning')
	}
});

$(att.namespace).on("click", ".attach-toolbar-back", function () {
	$(att.namespace).find(".attach-step2").hide();
	$(att.namespace).find(".attach-step1").show();
});

$(att.namespace + " #attachUploadFile").fileinput({
	language: "zh",
	//uploadUrl: "/ma/sys/eleProject/upload"+"?tokenid=" + ufma.getCommonData().token + "&ajax=1",
	uploadUrl: "/ma/sys/eleProject/upload",
	//allowedFileExtensions: ['jpg','png','gif','txt','pdf','xls','xlsx','doc','docx','ppt'],
	overwriteInitial: false,
	uploadAsync: true, //默认异步上传
	showUpload: true, //是否显示上传按钮
	showRemove: true, //显示移除按钮
	showPreview: true, //是否显示预览
	browseClass: "btn btn-primary", //按钮样式 
	uploadExtraData: function (previewId, index) {
		var obj = {};
		obj.chrId = $('#chrId').val();
		return obj;
	},
	slugCallback: function (filename) {
		$("param").each(function(){
			if ($(this).attr("value") == filename){
				var fileName = filename.lastIndexOf(".");//取到文件名开始到最后一个点的长度
				var fileNameLength = filename.length;//取到文件名长度
				var fileFormat = filename.substring(fileName + 1, fileNameLength);//截
				if (fileFormat == "doc" || fileFormat == "docx"){
					fileFormat = "word"
				} else if (fileFormat == "txt"){
					fileFormat = "txt"
				} else if (fileFormat == "xlsx" || fileFormat == "xls") {
					fileFormat = "xls"
				} else if (fileFormat == "pptx" || fileFormat == "ppt") {
					fileFormat = "ppt"
				} else if (fileFormat == "pdf") {
					fileFormat = "pdf"
				}else{
					fileFormat = "other"
				}
				$(this).siblings("img").attr("src", "img/" + fileFormat + ".png")
			}
		})
		return filename.replace('(', '_').replace(']', '_');
	},
	fileimageuploaded: function () {
		console.info(1);
	},
});
$('.attach-toolbar-back').on("click", function () {
	var projectId = $('#chrId').val();
	$.ajax({
		type: "get",
		//url: "/ma/sys/eleProject/getFileList?chrId=" + projectId+"&tokenid=" + ufma.getCommonData().token + "&ajax=1",
		url: "/ma/sys/eleProject/getFileList?chrId=" + projectId,
		async: false,
		success: function (data) {
			$('.attach-show').html("");
			var fileinputs = '';
			if (data.data != null && data.data != '') {
				fileinputs += '<ul class="attach-show-list">';
				for (var i = 0; i < data.data.length; i++) {
					$('#vouAttachBox').find('.attach-num').text(data.data.length);
					fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
					fileinputs += '<div class="attach-img-box">'
					if (data.data[i].fileFormat == ".txt") {
						fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
					} else if (data.data[i].fileFormat == ".doc" || data.data[i].fileFormat == ".docx") {
						fileinputs += '<img class="attach-img-file" src="img/word.png" />'
					} else if (data.data[i].fileFormat == ".xlsx" || data.data[i].fileFormat == ".xls") {
						fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
					} else if (data.data[i].fileFormat == ".ppt" || data.data[i].fileFormat == ".pptx") {
						fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
					} else if (data.data[i].fileFormat == ".pdf") {
						fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
					} else if (data.data[i].fileFormat == ".jpg" || data.data[i].fileFormat == ".png" || data.data[i].fileFormat == ".gif" || data.data[i].fileFormat == ".bmp" || data.data[i].fileFormat == ".jpeg") {
						fileinputs += '<img class="attach-img-file" src="/ma/sys/eleProject/download?attachGuid=' + data.data[i].attachGuid + '" />'
					} else if (data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
						fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
					} else {
						fileinputs += '<img class="attach-img-file" src="img/other.png" />'
					}
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-tip">'
					fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
					fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
					fileinputs += '<span class="attach-clear"></span>'
					fileinputs += '</div>'
					if (data.data[i].remark != null) {
						fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
					} else {
						fileinputs += '<div class="attach-img-sub" title="">暂无备注</div>'
					}
					fileinputs += '<div class="attach-img-sub-edit">'
					fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
					fileinputs += '<span class="glyphicon icon-check"></span>'
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-btns">'
					fileinputs += '<span class="glyphicon icon-edit"></span>'
					fileinputs += '<span class="glyphicon icon-download"></span>'
					fileinputs += '<span class="glyphicon icon-trash"></span>'
					fileinputs += '</div>'
					fileinputs += '</li>'
				}
				fileinputs += '</ul>';
			} else {
				fileinputs += '<div class="attach-noData">';
				fileinputs += '<img src="../../images/noData.png"/>';
				fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>';
				fileinputs += '</div>';
			}
			$('.attach-show').html(fileinputs);

		}
	})
});
//下载
$(document).on("click", ".attach-show-li .icon-download", function () {
	var downloadvouguid = $(this).parents(".attach-show-li").attr("names");
	var hostname = window.location.hostname;
	var port = window.location.port;
	var dizidowload = "http://" + hostname + ":" + port + "/ma/sys/eleProject/download?attachGuid=" + downloadvouguid;
	window.open(dizidowload)
});
//删除
$(document).on("click", ".attach-show-li .icon-trash", function () {
	var guid = $(this).parents(".attach-show-li").attr("names");
	_this = $(this);
	var obj = {
		"attachGuid": guid
	};
	$.ajax({
		type: "delete",
		//url: "/ma/sys/eleProject/delAtt"+"?tokenid=" + ufma.getCommonData().token + "&ajax=1",
		url: "/ma/sys/eleProject/delAtt",
		async: false,
		data: JSON.stringify(obj),
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			if (data.flag == "success") {
				_this.parents(".attach-show-li").remove();
				var lilength = $(".attach-show-list").find(".attach-show-li").length;
				$(".attach-toolbar-tip").html("<p>附件数：共 <span>" + lilength + "</span> 张</p>")
			} else {
				ufma.showTip(data.msg, function () {}, "error");
			}
		},
		error: function (data) {
			ufma.showTip("删除失败！", function () {}, "error");
		}
	});
});
var count = 0;
$(".file-preview").on("click", function () {
	count++;
	if (count == 0) {
		$(att.namespace + " #attachUploadFile").click();
	}
})

$(att.namespace + " .attach-upload-noData").on("click", function () {
	$(this).hide();
	$(att.namespace + " #attachUploadFile").click();
	$(att.namespace + " .attach-upload-toolbar").show();
})

//选择上传文件
$(".attach-show-li-add").on("click", function () {
	var num=$('.kv-preview-thumb').length
	$(att.namespace + " #attachUploadFile").click();
	$('.kv-file-upload').addClass('hidden')
})

//开始上传
$("#attach-upload-start").on("click", function () {
	if($('.kv-preview-thumb')){
		var num=$('.kv-preview-thumb').length;
		var lastdiv=$('.kv-preview-thumb')[num-1]
		var lastName=lastdiv.className.charAt(lastdiv.className.length-1)
		if(lastName=='b'){
			$(".fileinput-upload-button").click();
		}
	}
	

	
	
})

$(att.namespace).on("mouseenter", ".krajee-default", function () {
	$(this).find(".attach-img-file-pos-bg").css("background", "#E6F4FD");
}).on("mouseleave", ".krajee-default", function () {
	$(this).find(".attach-img-file-pos-bg").css("background", "#fff");
});

//判断上下翻页按钮是否可用
att.isDisabledBtn = function (index) {
	if (att.fileArr.length > 1) {
		if (index == 0) {
			$("#kvFileinputModal .btn-prev").attr("disabled", "disabled");
			$("#kvFileinputModal .btn-next").removeAttr("disabled");
		} else if (index == att.fileArr.length - 1) {
			$("#kvFileinputModal .btn-next").attr("disabled", "disabled");
			$("#kvFileinputModal .btn-prev").removeAttr("disabled");
		} else {
			$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").removeAttr("disabled");
		}
	} else if (att.fileArr.length == 1) {
		$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").attr("disabled", "disabled");
	}
};

//预览文件
$(att.namespace).on("click", ".attach-img-box", function () {
	$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").removeAttr("disabled");
	att.fileArr = [];
	$(att.namespace + " .attach-show-list li").each(function () {
		var fileObj = {};
		fileObj.name = $(this).find(".attach-img-name").text();
		fileObj.bytes = $(this).find(".attach-img-byte").text();
		fileObj.sub = $(this).find(".attach-img-sub").attr("title");
		fileObj.src = $(this).find(".attach-img-file").attr("src");
		att.fileArr.push(fileObj);
	})

	att.thisName = $(this).siblings(".attach-img-tip").find(".attach-img-name").text();
	att.thisBytes = $(this).siblings(".attach-img-tip").find(".attach-img-byte").text();
	att.thisSrc = $(this).find(".attach-img-file").attr("src");

	var index = att.inObjArray("name", att.thisName, att.fileArr);

	att.isDisabledBtn(index);

	$("#kvFileinputModal").find(".kv-zoom-title").html(att.thisName + ' <samp>(' + att.thisBytes + ')</samp>');
	$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.thisSrc + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.thisName + '" alt="' + att.thisName + '" style="width:auto; height:90%;margin-top:3%; max-width: 100%; max-height: 100%;"/>');

	var modalFooter = '<div class="kv-modalFooter">' +
		'<span class="glyphicon icon-download"></span>' +
		'<span class="glyphicon icon-trash"></span>' +
		'</div>';
	$("#kvFileinputModal").find(".modal-dialog").append($(modalFooter));
	$("#kvFileinputModal").modal("show");
});

//预览上一个文件
$("#kvFileinputModal .btn-prev").on("click", function () {
	var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
	var index = att.inObjArray("name", name, att.fileArr);
	if (index > 0) {
		var newIndex = index - 1;
		$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].name + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
		$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:90%;margin-top:3%; max-width: 100%; max-height: 100%;"/>');
		att.isDisabledBtn(newIndex);
	}

});

//预览下一个文件
$("#kvFileinputModal .btn-next").on("click", function () {
	var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
	var index = att.inObjArray("name", name, att.fileArr);
	if (index < att.fileArr.length - 1) {
		var newIndex = index + 1;
		$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].name + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
		$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:90%;margin-top:3%; max-width: 100%; max-height: 100%;"/>');
		att.isDisabledBtn(newIndex);
	}

});

//
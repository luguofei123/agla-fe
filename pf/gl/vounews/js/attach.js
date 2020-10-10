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


$(document).on("click", ".attach-img-btns .icon-edit", function () {
	if (selectdata.data.vouStatus == "O") {
		var editDom = $(this).parent(".attach-img-btns").siblings(".attach-img-sub-edit");
		var txt = $(editDom).siblings(".attach-img-sub").attr("title");
		$(editDom).siblings(".attach-img-sub").hide();
		$(editDom).find("input").val(txt);
		$(editDom).show();
	} else {
		ufma.showTip("抱歉，此状态附件无法修改备注", function () { }, "warning")
	}

});
var updateattach = true;
$(document).on("click", "#attachUploadBtn", function () {
	if (selectdata.data.vouStatus == "O") {
		$("#vouAttachBox").find(".attach-step1").hide();
		$("#vouAttachBox").find(".attach-step2").show();
	} else {
		var istdata = $("#pzzhuantai").html()
		var isattdata = "抱歉，凭证处于" + istdata + "状态附件无法继续上传"
		ufma.showTip(isattdata, function () { }, "warning")
	}
});

$(document).on("click", "#attachgaopaiyiBtn", function () {
	if (selectdata.data.vouStatus == "O") {
		ufma.open({
			title: '高拍仪上传',
			width: 970,
			height: 600,
			url: '/pf/gl/sdkphoto/sdkphoto.html',
			data: {
				guid: $(".voucher-head").attr("namess")
			},
			ondestory: function (result) {
				var ssupdateattach = result.updateattach
				$.ajax({
					type: "get",
					url: "/gl/file/getFileList/" + $(".xuanzhongcy").attr("names") + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					success: function (data) {
						var fileinputs = '';
						for (var i = 0; i < data.data.length; i++) {
							fileinputs += '<li class="attach-show-li" relPath="'+data.data[i].relPath+'" names="' + data.data[i].attachGuid + '">'
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
								fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
							} else if (data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
								fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
							} else {
								fileinputs += '<img class="attach-img-file" src="img/other.png" />'
							}
							fileinputs += '</div>'
							fileinputs += '<div class="attach-img-tip">'
							fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
							if(!$.isNull(data.data[i].fileSize)){
								fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
							}else{
								fileinputs += '<span class="attach-img-byte">暂无</span>'
							}
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
							if(data.data[i].sysId == 'ar'){
								fileinputs += '<span class="glyphicon icon-edit" style="display:none;"></span>'
								fileinputs += '<span class="glyphicon icon-download"></span>'
								fileinputs += '<span class="glyphicon icon-trash" style="display:none;"></span>'
							}else{
								fileinputs += '<span class="glyphicon icon-edit"></span>'
								fileinputs += '<span class="glyphicon icon-download"></span>'
								fileinputs += '<span class="glyphicon icon-trash"></span>'
							}
							fileinputs += '</div>'
							fileinputs += '</li>'
						}
						$(".attach-show-list").html(fileinputs)
						var thisvouguid = new Object();
						thisvouguid.vouGroupId = $(".xuanzhongcy").attr("names");
						if (ssupdateattach == false) {
							ufma.confirm('是否更新凭证附件张数?', function (action) {
								if (action) {
									$.ajax({
										type: "post",
										url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
										async: false,
										data: JSON.stringify(thisvouguid),
										contentType: 'application/json; charset=utf-8',
										success: function (data) {
											if (data.flag == "success") {
												if (data.data[0] != null && data.data[0].lastVer != null && quanjuvouchaiwu != null) {
													if (data.data[0].lastVer - 1 == quanjuvouchaiwu.lastVer) {
														quanjuvouchaiwu.lastVer = data.data[0].lastVer
														quanjuvouchaiwu.vouCnt = data.data[0].vouCnt
													} else {
														ufma.showTip("其他用户已经修改!", function () { }, "warning");
													}
												}
												if (data.data[1] != null && data.data[1].lastVer != null && quanjuvouyusuan != null) {
													if (data.data[1].lastVer - 1 == quanjuvouyusuan.lastVer) {
														quanjuvouyusuan.lastVer = data.data[1].lastVer
														quanjuvouyusuan.vouCnt = data.data[1].vouCnt
													} else {
														ufma.showTip("其他用户已经修改!", function () { }, "warning");
													}
												}
												if ($(".xuanzhongcy").hasClass("chaiwu")) {
													selectdata.data.lastVer = data.data[0].lastVer
													$("#fjd").val(data.data[0].vouCnt);
												} else {
													selectdata.data.lastVer = data.data[0].lastVer
													$("#fjd").val(data.data[0].vouCnt);
												}
											} else {
												ufma.showTip(data.msg, function () { }, "error");
											}
										},
										error: function () {
											ufma.showTip("无法连接数据库", function () { }, "error");
										}
									});
								}
							})
							updateattach = true;
						}
					}

				});
			}
		});
	} else {
		var istdata = $("#pzzhuantai").html()
		var isattdata = "抱歉，凭证处于" + istdata + "状态附件无法继续上传"
		ufma.showTip(isattdata, function () { }, "warning")
	}
});

$(document).on("click", ".kv-file-upload", function () {
	updateattach = false;
});
$(document).on("click", ".attach-toolbar-back", function () {
	mediaStreamTrack && mediaStreamTrack.stop();
	$.ajax({
		type: "get",
		url: "/gl/file/getFileList/" + $(".xuanzhongcy").attr("names") + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		success: function (data) {
			$("#zezhao").show();
			$("#zezhao").html("");
			var fileinputs = '';
			fileinputs += '<div id="vouAttachBox">'
			fileinputs += '<div class="u-msg-title">'
			fileinputs += '<p style="font-size:16px">凭证附件</p>'
			fileinputs += '<div class="attach-close icon-close"></div>'
			fileinputs += '</div>'
			fileinputs += '<div class="u-msg-content">'
			fileinputs += '<div class="attach-step1">'
			fileinputs += '<div class="attach-toolbar">'
			fileinputs += '<div class="attach-toolbar-tip">'
			fileinputs += '<p>附件数：共 <span>' + data.data.length + '</span> 张</p>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-toolbar-btns">'
			fileinputs += '<button class="btn btn-primary" id="attachUploadBtn">上传</button>'
			fileinputs += '<button class="btn btn-primary" id="attachsaomiaoBtn">拍照</button>'
			fileinputs += '<button class="btn btn-primary" id="attachgaopaiyiBtn">扫描</button>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-clear"></div>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-show">'
			fileinputs += '<div class="attach-noData" style="display:none;">'
			fileinputs += '<img src="../../images/noData.png" />'
			fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>'
			fileinputs += '</div>'
			fileinputs += '<ul class="attach-show-list">'
			for (var i = 0; i < data.data.length; i++) {
				fileinputs += '<li class="attach-show-li" relPath="'+data.data[i].relPath+'" names="' + data.data[i].attachGuid + '">'
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
					fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
				} else if (data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
					fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
				} else {
					fileinputs += '<img class="attach-img-file" src="img/other.png" />'
				}
				fileinputs += '</div>'
				fileinputs += '<div class="attach-img-tip">'
				fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
				if(!$.isNull(data.data[i].fileSize)){
					fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
				}else{
					fileinputs += '<span class="attach-img-byte">暂无</span>'
				}
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
				if(data.data[i].sysId == 'ar'){
					fileinputs += '<span class="glyphicon icon-edit" style="display:none;"></span>'
					fileinputs += '<span class="glyphicon icon-download"></span>'
					fileinputs += '<span class="glyphicon icon-trash" style="display:none;"></span>'
				}else{
					fileinputs += '<span class="glyphicon icon-edit"></span>'
					fileinputs += '<span class="glyphicon icon-download"></span>'
					fileinputs += '<span class="glyphicon icon-trash"></span>'
				}
				fileinputs += '</div>'
				fileinputs += '</li>'
			}
			fileinputs += '</ul>'
			fileinputs += '</div>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-step2">'
			fileinputs += '<div class="attach-toolbar">'
			fileinputs += '<div class="attach-toolbar-back">'
			fileinputs += '<span class="glyphicon icon-angle-left"></span>返回'
			fileinputs += '</div>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-upload-box">'
			fileinputs += '<div class="attach-upload-noData">'
			fileinputs += '<span class="glyphicon icon-upload-lg"></span>'
			fileinputs += '<p>点击或点击后将文件拖拽到这里上传</p>'
			fileinputs += '</div>'
			fileinputs += '<form enctype="multipart/form-data" style="margin-top:10px;">'
			fileinputs += '<input id="attachUploadFile" type="file" multiple class="file" data-overwrite-initial="false">'
			fileinputs += '</form>'
			fileinputs += '<div class="attach-upload-toolbar" style="display:none">'
			fileinputs += '<button class="btn btn-primary" id="attach-upload-start">开始上传</button>'
			fileinputs += '<span class="attach-uploaded-info"></span>'
			fileinputs += '</div>'
			fileinputs += '</div>'
			fileinputs += '</div>'
			fileinputs += '<div class="attach-step3"></div>'
			fileinputs += '</div>'
			fileinputs += '</div>'
			$("#zezhao").html(fileinputs);
			$("#vouAttachBox").show();
			$("#vouAttachBox").css("background", "#fff");
			$("#vouAttachBox #attachUploadFile").fileinput({
				language: "zh",
				uploadUrl: "/gl/file/upload",
				//		allowedFileExtensions: ['jpg', 'png', 'gif', 'txt', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt'],
				overwriteInitial: false,
				uploadasync: false, //默认异步上传
				showUpload: true, //是否显示上传按钮
				showRemove: false, //显示移除按钮
				maxFileSize: 10000,
				showPreview: true, //是否显示预览
				browseClass: "btn btn-primary", //按钮样式    
				uploadExtraData: function (previewId, index) {
					var obj = {};
					obj.vouGuid = $(".voucher-head").attr("namess");
					return obj;
				},
				slugCallback: function (filename) {
					return filename.replace('(', '_').replace(']', '_');
				},
				fileimageuploaded: function () {
					console.info(1);
				},
			}).on("fileuploaded", function (event, data, previewId, index) {
				if (data.response) {
					$(".file-preview-frame .file-upload-indicator[title='上传']").parents(".file-preview-frame").find(".kv-file-remove").hide();
					ufma.showTip('处理成功', function () { }, "success");
				}
			})
		}

	});
	var thisvouguid = new Object();
	thisvouguid.vouGroupId = $(".xuanzhongcy").attr("names");
	if (updateattach == false) {
		ufma.confirm('是否更新凭证附件张数?', function (action) {
			if (action) {
				$.ajax({
					type: "post",
					url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					data: JSON.stringify(thisvouguid),
					contentType: 'application/json; charset=utf-8',
					success: function (data) {
						if (data.flag == "success") {
							if (data.data[0] != null && data.data[0].lastVer != null && quanjuvouchaiwu != null) {
								if (data.data[0].lastVer - 1 == quanjuvouchaiwu.lastVer) {
									quanjuvouchaiwu.lastVer = data.data[0].lastVer
									quanjuvouchaiwu.vouCnt = data.data[0].vouCnt
								} else {
									ufma.showTip("其他用户已经修改!", function () { }, "warning");
								}
							}
							if (data.data[1] != null && data.data[1].lastVer != null && quanjuvouyusuan != null) {
								if (data.data[1].lastVer - 1 == quanjuvouyusuan.lastVer) {
									quanjuvouyusuan.lastVer = data.data[1].lastVer
									quanjuvouyusuan.vouCnt = data.data[1].vouCnt
								} else {
									ufma.showTip("其他用户已经修改!", function () { }, "warning");
								}
							}
							if ($(".xuanzhongcy").hasClass("chaiwu")) {
								selectdata.data.lastVer = data.data[0].lastVer
								$("#fjd").val(data.data[0].vouCnt);
							} else {
								selectdata.data.lastVer = data.data[0].lastVer
								$("#fjd").val(data.data[0].vouCnt);
							}
						} else {
							ufma.showTip(data.msg, function () { }, "error");
						}
					},
					error: function () {
						ufma.showTip("无法连接数据库", function () { }, "error");
					}
				});
			}
		})
		updateattach = true;
	}

});
var count = 0;
$(".file-preview").on("click", function () {
	count++;
	if (count == 0) {
		$("#vouAttachBox #attachUploadFile").click();
	}
})

$(document).on("click", "#vouAttachBox .attach-upload-noData", function () {
	$(this).hide();
	$("#vouAttachBox #attachUploadFile").click();
	$("#vouAttachBox .attach-upload-toolbar").show();
})

//选择上传文件
$(document).on("click", ".attach-show-li-add", function () {
	$("#vouAttachBox #attachUploadFile").click();
})

//开始上传
$(document).on("click", "#attach-upload-start", function () {
	var shangc = true;
	var sk = 0;
	for (var i = 0; i < $(".attach-step2").find(".krajee-default").length; i++) {
		if ($(".attach-step2").find(".krajee-default").eq(i).find(".file-thumb-progress").hasClass("hide")) {
			sk += 1;
		}
	}
	if (sk != $(".attach-step2").find(".krajee-default").length / 2) {
		shangc = false;
	}
	if ($('.file-upload-indicator .glyphicon-exclamation-sign').length > 0) {
		ufma.showTip("您有超出大小的附件无法上传", function () { }, "warning")
	} else if ($(".kv-upload-progress").hasClass("hide") && shangc == false) {
		updateattach = false
		$(".fileinput-upload-button").click();
	} else {
		ufma.showTip("您没有上传新的附件", function () { }, "warning")
	}
})

$(document).on("mouseenter", ".krajee-default", function () {
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
$(document).on("click", ".attach-img-box", function () {
	$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").removeAttr("disabled");
	att.fileArr = [];
	$(att.namespace + " .attach-show-list li").each(function () {
		var fileObj = {};
		fileObj.name = $(this).find(".attach-img-name").text();
		fileObj.namex = $(this).find(".attach-img-name").find("b").text();
		fileObj.bytes = $(this).find(".attach-img-byte").text();
		fileObj.sub = $(this).find(".attach-img-sub").attr("title");
		fileObj.src = $(this).find(".attach-img-file").attr("src");
		att.fileArr.push(fileObj);
	})

	att.thisName = $(this).siblings(".attach-img-tip").find(".attach-img-name").text();
	att.thisNamex = $(this).siblings(".attach-img-tip").find(".attach-img-name").find("b").text();
	att.thisBytes = $(this).siblings(".attach-img-tip").find(".attach-img-byte").text();
	att.thisSrc = $(this).find(".attach-img-file").attr("src");

	var index = att.inObjArray("name", att.thisName, att.fileArr);

	att.isDisabledBtn(index);

	$("#kvFileinputModal").find(".kv-zoom-title").html(att.thisNamex + ' <samp>(' + att.thisBytes + ')</samp>');
	$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.thisSrc + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.thisName + '" alt="' + att.thisName + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');

	var modalFooter = '<div class="kv-modalFooter">' +
		'<span class="glyphicon icon-download"></span>' +
		'<span class="glyphicon icon-trash"></span>' +
		'</div>';
	$("#kvFileinputModal").find(".modal-dialog").find(".kv-modalFooter").remove();
	$("#kvFileinputModal").find(".modal-dialog").append($(modalFooter));

	//	$("#kvFileinputModal").modal("show");
	$("#kvFileinputModal").css("display", "block");
	$("#kvFileinputModal").css("z-index", "2005");
	$("#kvFileinputModal").css("opacity", "1");

});

//预览上一个文件
$(document).on("click", "#kvFileinputModal .btn-prev", function () {
	var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
	var index = att.inObjArray("name", name, att.fileArr);
	if (index > 0) {
		var newIndex = index - 1;
		$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].namex + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
		$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');
		att.isDisabledBtn(newIndex);
	}

});

//预览下一个文件
$(document).on("click", "#kvFileinputModal .btn-next", function () {
	var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
	var index = att.inObjArray("name", name, att.fileArr);
	if (index < att.fileArr.length - 1) {
		var newIndex = index + 1;
		$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].namex + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
		$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');
		att.isDisabledBtn(newIndex);
	}

});

$(document).on("click", ".btn-close", function () {
	if ($(this).find("i").hasClass("glyphicon-remove")) {
		$("#kvFileinputModal").hide();
	}
})

$(document).on("click", ".attach-show-li .icon-download", function () {
	var downloadvouguid = $(this).parents(".attach-show-li").attr("names");
	var hostname = window.location.hostname;
	var port = window.location.port;
	var relPath=$(this).parents(".attach-show-li").attr("relPath");
	var filename =  $(this).parents(".attach-show-li").find('.attach-img-name').text()
	var dizidowload = "http://" + hostname + ":" + port + "/gl/file/download?attachGuid=" + downloadvouguid+"&relPath="+relPath+"&filename="+filename;
	window.open(dizidowload)
})
$(document).on("click", ".attach-img-sub-edit .icon-check", function () {
	_this = $(this);
	var thisbeizhuguid = $(this).parents(".attach-show-li").attr("names");
	var beizhuneirong = $(this).prev("input").val();
	var beizhuremark = new Object();
	beizhuremark.remark = beizhuneirong;
	beizhuremark.attachGuid = thisbeizhuguid;
	$.ajax({
		type: "post",
		url: "/gl/file/editRemark" + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		data: JSON.stringify(beizhuremark),
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			if (data.flag == "success") {
				_this.parent(".attach-img-sub-edit").hide();
				var txt = _this.siblings("input").val();
				_this.parent(".attach-img-sub-edit").siblings(".attach-img-sub").text(txt).attr("title", txt).show();
			} else {
				ufma.showTip(data.msg, function () { }, "error");
			}
		},
		error: function (data) {
			ufma.showTip("无法连接数据库", function () { }, "error");
		}
	});
})

$(document).on("click", ".attach-img-btns .icon-trash", function () {
	if (selectdata.data.vouStatus == "O") {
		var delectbeizhu = new Object();
		delectbeizhu.attachGuid = $(this).parents(".attach-show-li").attr("names");
		_this = $(this);
		$.ajax({
			type: "delete",
			url: "/gl/file/delAtt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			data: JSON.stringify(delectbeizhu),
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				updateattach = false
				if (data.flag == "success") {
					_this.parents(".attach-show-li").remove();
					var lilength = $(".attach-show-list").find(".attach-show-li").length;
					$(".attach-toolbar-tip").html("<p>附件数：共 <span>" + lilength + "</span> 张</p>")
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function (data) {
				ufma.showTip("无法连接数据库", function () { }, "error");
			}
		});
	} else {
		ufma.showTip("抱歉,此状态附件无法删除", function () { }, "warning")
	}

});
$(document).on("click", ".attach-close", function (e) {
	mediaStreamTrack && mediaStreamTrack.stop();
	var thisvouguid = new Object();
	thisvouguid.vouGroupId = $(".xuanzhongcy").attr("names");
	if (updateattach == false) {
		ufma.confirm('是否更新凭证附件张数?', function (action) {
			if (action) {
				$.ajax({
					type: "post",
					url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					data: JSON.stringify(thisvouguid),
					contentType: 'application/json; charset=utf-8',
					success: function (data) {
						if (data.flag == "success") {
							if (data.data[0] != null && data.data[0].lastVer != null && quanjuvouchaiwu != null) {
								if (data.data[0].lastVer - 1 == quanjuvouchaiwu.lastVer) {
									quanjuvouchaiwu.lastVer = data.data[0].lastVer
									quanjuvouchaiwu.vouCnt = data.data[0].vouCnt
								} else {
									ufma.showTip("其他用户已经修改!", function () { }, "warning");
								}
							}
							if (data.data[1] != null && data.data[1].lastVer != null && quanjuvouyusuan != null) {
								if (data.data[1].lastVer - 1 == quanjuvouyusuan.lastVer) {
									quanjuvouyusuan.lastVer = data.data[1].lastVer
									quanjuvouyusuan.vouCnt = data.data[1].vouCnt
								} else {
									ufma.showTip("其他用户已经修改!", function () { }, "warning");
								}
							}
							if ($(".xuanzhongcy").hasClass("chaiwu")) {
								selectdata.data.lastVer = data.data[0].lastVer
								$("#fjd").val(data.data[0].vouCnt);
							} else {
								selectdata.data.lastVer = data.data[0].lastVer
								$("#fjd").val(data.data[0].vouCnt);
							}
						} else {
							ufma.showTip(data.msg, function () { }, "error");
						}
					},
					error: function () {
						ufma.showTip("无法连接数据库", function () { }, "error");
					}
				});
			}
		})
		updateattach = true;
	}
	$("#zezhao").hide();
	$("#zezhao").html("");
})
var mediaStreamTrack;
var falshqidong;
var context
var snap
var aVideo
$(document).on("click", "#attachsaomiaoBtn", function () {
	if (selectdata.data.vouStatus == "O") {
		$("#vouAttachBox").find(".attach-step1").hide();
		$("#vouAttachBox").find(".attach-step3").show();
		$("#vouAttachBox").find(".attach-step3").html('');
		var shexiang = '';
		shexiang += '<div class="attach-toolbar">'
		shexiang += '<div class="attach-toolbar-back">'
		shexiang += '<span class="glyphicon icon-angle-left"></span>返回'
		shexiang += '</div>'
		shexiang += '</div>'
		shexiang += '<video id="myVideo" autoplay style="width:640px;height:360px"></video>'
		shexiang += '<canvas id="luxcanvas" height="480" width="640" style="display:none;"></canvas>'
		shexiang += '<p id="status" style="display: none;"></p>'
		shexiang += '<div id="webcam">'
		shexiang += '</div>'
		shexiang += '<div id="btn-paishe">拍照</div>'
		shexiang += '<div class="shangchuanneirong">'
		shexiang += '</div>'
		shexiang += '<div id="btn-paishetijiao">上传</div>'
		$("#vouAttachBox").find(".attach-step3").html(shexiang)
		falshqidong = false;
		context = document.getElementById('luxcanvas').getContext('2d');
		aVideo = document.getElementById('myVideo');
		snap = $('#btn-paishe');
		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia; //获取媒体对象（这里指摄像头）
		navigator.getUserMedia({
			video: true
		}, gotStream, noStream); //参数1获取用户打开权限；参数二是一个回调函数，自动传入视屏流，成功后调用，并传一个视频流对象，参数三打开失败后调用，传错误信息

		function gotStream(stream) {

			// video.src = URL.createObjectURL(stream); // 老写法
			aVideo.srcObject = stream;

			aVideo.onerror = function () {
				stream.stop();
			};
			stream.onended = noStream;
			aVideo.onloadedmetadata = function () {
			};
		}
		function noStream(err) {
			alert(err);
		}
	} else {
		var istdata = $("#pzzhuantai").html()
		ufma.showTip("抱歉，凭证处于" + istdata + "状态附件无法继续上传", function () { }, "warning")
	}
})
$(document).on("click", "#btn-paishe", function () {
	if (falshqidong == false) {
		context.drawImage(aVideo, 0, 0, 640, 480);
		var dnn = context.canvas.toDataURL();
		$(".shangchuanneirong").prepend('<div class="shangchuanshuru"><img src="' + dnn + '" width="220"><div class="paishecaozuo"><input class="xiugaipaishe" type="text" placeholder="点击此处输入附件名称"><div class="delpaishe icon-trash"></div><div class="chuanpaishe icon-upload"></div></div>')
	} else {
		webcam.capture();
		setTimeout(function () {
			var dnn = context.canvas.toDataURL()
			$(".shangchuanneirong").prepend('<div class="shangchuanshuru"><img src="' + dnn + '" width="220"><div class="paishecaozuo"><input class="xiugaipaishe" type="text" placeholder="点击此处输入附件名称"><div class="delpaishe icon-trash"></div><div class="chuanpaishe icon-upload"></div></div>')
		}, 200)
	}
})
$(document).on("click", "#btn-paishetijiao", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		var paisheobj = new Object();
		if ($(".shangchuanneirong").find(".shangchuanshuru").length == $(".shangchuanneirong").find(".shangchuanshuruyishangchuan").length) {
			ufma.showTip("您没有上传新的图片", function () { }, "error");
		} else {
			paisheobj.vouGuid = $(".voucher-head").attr("namess");
			var imgList = new Array();
			for (var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
				var shangchuangimg = new Object()
				if ($(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val() == "") {
					shangchuangimg.imgName = "扫描图片" + (i + 1)
					$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val("扫描图片" + (i + 1))
				} else {
					shangchuangimg.imgName = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val()
				}
				shangchuangimg.imgStr = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find("img").attr("src");
				imgList.push(shangchuangimg);
			}
			paisheobj.imgList = imgList
			$.ajax({
				type: "post",
				url: "/gl/file/uploadImage" + "?ajax=1&rueicode=" + hex_md5svUserCode,
				async: false,
				data: JSON.stringify(paisheobj),
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					if (data.flag == "success") {
						updateattach = false
						ufma.showTip("上传成功", function () { }, "success");
						for (var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
							$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".delpaishe").remove();
							$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".chuanpaishe").remove();
							$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
							$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").attr("disabled", true);
							$(".shangchuanneirong").find(".shangchuanshuru").eq(i).addClass("shangchuanshuruyishangchuan");
						}
					} else {
						ufma.showTip(data.msg, function () { }, "error");
					}
				},
				error: function (data) {
					ufma.showTip("连接数据库失败", function () { }, "error");
				}
			});
		}

		$(this).removeClass("btn-disablesd")
	}

})
$(document).on("click", ".delpaishe", function () {
	$(this).parents(".shangchuanshuru").remove();
})
$(document).on("click", ".chuanpaishe", function () {
	_this = $(this)
	if ($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		var paisheobj = new Object();
		paisheobj.vouGuid = $(".voucher-head").attr("namess");
		var imgList = new Array();
		var shangchuangimg = new Object()
		if ($(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val() == "") {
			shangchuangimg.imgName = "扫描图片" + 1
			$(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val("扫描图片" + 1)
		} else {
			shangchuangimg.imgName = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val()
		}
		shangchuangimg.imgStr = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find("img").attr("src");
		imgList.push(shangchuangimg);
		paisheobj.imgList = imgList
		$.ajax({
			type: "post",
			url: "/gl/file/uploadImage" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			data: JSON.stringify(paisheobj),
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				if (data.flag == "success") {
					updateattach = false
					ufma.showTip("上传成功", function () { }, "success");
					_this.parents(".shangchuanshuru").find(".delpaishe").remove();
					_this.parents(".shangchuanshuru").find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
					_this.parents(".shangchuanshuru").find(".xiugaipaishe").attr("disabled", true);
					_this.parents(".shangchuanshuru").addClass("shangchuanshuruyishangchuan");
					_this.remove();
				}
			},
			error: function (data) {
				ufma.showTip("连接数据库失败", function () { }, "error");
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})


/**
 * 获得指定的一张单据的附件列表  (同步请求方式)
 * @param  {[json]} setting [要获得附件的单据的相关参数，结构如下]
 *                         billId : 单据ID
 *                         agencyCode ： 单位代码
 *                         url : 附件的url。可以为null。如果=null，则使用默认的url
 * @return {[json]}         [description]
 */
var _bgPub_GetAttachment = function(setting) {
  var aurl = getURL(0) + "/bg/attach/getAttach";
  var menuid = $.getUrlParam('menuid');
	if(!$.isNull(setting.url)) {
		aurl = setting.url;
	}
	var rst = {};
	$.ajax({
		url: aurl,
		type: "GET",
		async: false,
		cache: false,
		data: {
			"billId": setting.billId,
			"agencyCode": setting.agencyCode
		},
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
    contentType: 'application/json; charset=utf-8',
    beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",menuid);
		},
		success: function(data) {
			rst = data;
		},
		failed: function(data) {}
	});
	return rst;
};

var _inputFile_bg = null;
/**
 * 附件导入-指标  [************************ 这个是 ！！！！"主函数(入口函数)"！！！！ ************************]
 * @param  {[string]} divId       [附件导入的浮层挂接到哪个div上面]
 * @param  {[string]} caption     [附件显示的名称, 也就是弹层的标题]
 * @param  {[array]} showFileArr [要显示的附件文件数组，用于初始化显示。结构例如：
 *                                [{filename:"文件名", filesize:"文件大小（可以不传）", "fileid":"附件id"}]   ]
 * @param  {[json]} option     [系统数据的设置，需要以下参数：
 *                                1，agencyCode：单位代码
 *                                2，billId : 附件属于的单据ID
 *                                3，uploadURL :上传的url
 *                                4，delURL ：删除的url
 *                                5，downloadURL：下载的url
 *                                6, onClose(allFiles) : function(array) 当模态框关闭时调用, 传入数组结构，包含全部的保存成功的附件数量]
 * @return {[type]}             [description]
 */
var showFileArr=[];
var _bgPub_ImpAttachment = function(divId, caption, showFileArr, option, status) {
showFileArr = showFileArr;
	var _setting = {
		_form_Id: "_bgPub_attachmentFileImpForm",
		_div_modalId: "_bgPub_modal_" + divId,
		_div_modal_contentId: "_bgPub_modal_contentDiv_" + divId,
		_div_modal_content_headId: "_bgPub_modal_contentDiv_head_" + divId,
		_div_modal_content_bodyId: "_bgPub_modal_contentDiv_body_" + divId,
		_div_modal_content_body_span_fileCountId: "_bgPub_modal_contentDiv_body_span_fileCount_" + divId,
		_div_modal_content_body_fileBoxId: "_bgPub_modal_contentDiv_body_fileBox_" + divId,
		_div_modal_content_body_fileBox_subIdHead: "_bgPub_modal_contentDiv_body_fileBox_subhead_",
		_btn_edit: "_bgPub_modal_btn_edit_" + divId,
		_btn_upload: "_bgPub_modal_btn_upload_" + divId,
		_btn_del: "_bgPub_modal_btn_del_" + divId,
		_btn_cancel: "_bgPub_modal_btn_cancel_" + divId,
		_chk_selAll: "_bgPub_modal_chkSelAll_" + divId
	};
	_setting._option = $.extend({}, option);

	var _modelHTML = _bgPub_getModalHtml("bgPubAttachHtml");
	_modelHTML = _modelHTML.replace("{_div_modalId}", _setting._div_modalId).replace("{caption}", caption).replace("{cp}", caption).replace("{_form_Id}", _setting._form_Id).replace("{_div_modal_contentId}", _setting._div_modal_contentId).replace("{_div_modal_content_headId}", _setting._div_modal_content_headId).replace("{_div_modal_content_bodyId}", _setting._div_modal_content_bodyId).replace("{_div_modal_content_body_span_fileCountId}", _setting._div_modal_content_body_span_fileCountId).replace("{_btn_edit}", _setting._btn_edit).replace("{_div_modal_content_body_fileBoxId}", _setting._div_modal_content_body_fileBoxId).replace("{_chk_selAll}", _setting._chk_selAll).replace("{_btn_del}", _setting._btn_del).replace("{_btn_upload}", _setting._btn_upload).replace("{_btn_cancel}", _setting._btn_cancel);

	if($("#" + _setting._div_modalId).length > 0) {
		$("#" + _setting._div_modalId).remove();
	}
	$("#" + divId).append(_modelHTML);
	$("#" + _setting._div_modal_contentId).css("width", parseInt($("#" + divId).css("width")) * 0.7);
	$("#" + _setting._div_modal_contentId).css("left", parseInt($("#" + divId).css("width")) * 0.15 * -1);

	$("#" + _setting._div_modal_contentId).css("max-height", 550);
	$("#" + _setting._div_modal_contentId).css("min-height", 550);

	var bigBoxHeight = 550 - 56 - 30 - 30 - 4 - 2 * 15;
	$("#" + _setting._div_modal_content_body_fileBoxId).css("max-height", bigBoxHeight);
	$("#" + _setting._div_modal_content_body_fileBoxId).css("min-height", bigBoxHeight);

	//计算每个subfilebox的长宽
	var bigBoxWidth = $("#" + _setting._div_modal_contentId).innerWidth() - 35 - 35;
	var subFileBoxWidth = parseFloat(bigBoxWidth) / 4 - 2;
	//添加  新增  按钮
	_bgPub_ImpAttachment_subFileBox_addBox(_setting._div_modal_content_body_fileBoxId,
		subFileBoxWidth,
		_setting._div_modal_content_body_fileBox_subIdHead,
		_setting._form_Id);
	//添加  每个已有的附件 的显示
	var tmpExistFileBoxId = "";
	if(showFileArr.flag && showFileArr.flag == "workFlow") {
		for(var i = 0; i < showFileArr.length; i++) {
			tmpExistFileBoxId = _bgPub_ImpAttachment_subFileBox_fileBox(_setting._div_modal_content_body_fileBoxId,
				subFileBoxWidth,
				_setting._div_modal_content_body_fileBox_subIdHead,
				showFileArr[i].filename, null, showFileArr[i].createUser, showFileArr[i].singleStatus);
			$("#" + tmpExistFileBoxId).attr("fileid", showFileArr[i].fileid);
		}
	} else {
		for(var i = 0; i < showFileArr.length; i++) {
			tmpExistFileBoxId = _bgPub_ImpAttachment_subFileBox_fileBox(_setting._div_modal_content_body_fileBoxId,
				subFileBoxWidth,
				_setting._div_modal_content_body_fileBox_subIdHead,
				showFileArr[i].filename, null);
			$("#" + tmpExistFileBoxId).attr("fileid", showFileArr[i].fileid);
		}
	}

	$('#attachNum').html(showFileArr.length);
	//绑定事件**************************************************************************************************************
	$("#" + _setting._btn_edit).off("click").on("click", function(e) {
		var iSubBoxCount = $("#" + _setting._div_modal_content_body_fileBoxId).attr("subcount");
		if(typeof(iSubBoxCount) == "undefined") {
			iSubBoxCount = 0;
		}
		if(iSubBoxCount == 0) {
			ufma.showTip("无可编辑数据", null, "warning");
			return;
		}
		if($(this).text() == "编辑") {
			$(this).text("完成");
			$(".outRadio").show();
			$(".innerRadio").show();
			$(".bottomBatch").show();
			$(".bottomBtn").hide();
			$("#" + _setting._div_modal_content_body_fileBox_subIdHead + "0").hide();
			$(".outRadio").off("click").on("click", function(e) {
				var $innerRadion = $(this).find(".innerRadio");
				if($($innerRadion).hasClass("selected")) {
					$($innerRadion).removeClass("selected");
					$($innerRadion).addClass("unSelected");
				} else {
					$($innerRadion).removeClass("unSelected");
					$($innerRadion).addClass("selected");
				}
			});
		} else {
			$(this).text("编辑");
			$(".outRadio").hide();
			$(".innerRadio").hide();
			$(".bottomBatch").hide();
			$(".bottomBtn").show();
			$("#" + _setting._div_modal_content_body_fileBox_subIdHead + "0").show();
		}
	});
	//全选、全不选
	$("#" + _setting._chk_selAll).off("change").on("change", function(e) {
		if($(this).is(':checked') == true) {
			$(".innerRadio").removeClass("unSelected");
			$(".innerRadio").addClass("selected");
		} else {
			$(".innerRadio").removeClass("selected");
			$(".innerRadio").addClass("unSelected");
		}
	});
	//全部删除按钮
	$("#" + _setting._btn_del).off("click").on("click", function(e) {
		var iselCount = 0;
		var delObjs = {
			"items": []
		};
		$(".innerRadio").each(function(e) {
			if($(this).hasClass("selected")) {
				iselCount++;
				var $parent = $(this).closest(".impAttachmentSubFileBox");
				delObjs.items[delObjs.items.length] = {
					"attachId": $parent.attr("fileid")
				};
				_bgPub_ImpAttachment_subFileBox_fileBox_remove($parent);
			}
		});
		if(iselCount > 0) {
			ufma.post(
				_setting._option.delURL,
				delObjs,
				function(result) {
					if(result.flag == "success") {
						$(".innerRadio").each(function(e) {
							// 服务端删除成功，再循环一遍做删除前台。
							if($(this).hasClass("selected")) {
								_bgPub_ImpAttachment_subFileBox_fileBox_remove($parent);
							}
						});
					} else {
						ufma.showTip("删除失败:" + result.msg, null, "error");
					}
				}
			);
		}
	});

	//按钮的批量上传
	//bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
	if(status == '3') {
		$("#" + _setting._btn_upload).addClass('hide');
		$(document).find('.impAttachmentSubFile_innerBox_bottom .trash').addClass('hide');
		$("#" + _setting._btn_del).addClass('hide');
	} else {
		if(showFileArr.flag && showFileArr.flag != 'workFlow') {
			$(document).find('.impAttachmentSubFile_innerBox_bottom .trash').removeClass('hide');
			$("#" + _setting._btn_del).removeClass('hide');
			$("#" + _setting._btn_upload).removeClass('hide');
		}
		$("#" + _setting._btn_upload).removeClass('hide');
		$("#" + _setting._btn_upload).off("click").on("click", function(e) {
			if($('.impAttachmentSubDiv .impAttachmentSubFileBox').length == $('.impAttachmentSubDiv .impAttachmentSubFileBox[fileid]').length + 1) {
				ufma.showTip('没有发现需要上传的文件！', function() {}, 'warning');
				return false;
			}
			$("#" + _setting._form_Id).find("div.input-group-btn").find(".fileinput-upload-button").trigger("click");
		});
	}

	//单个文件的下载
	$(document).off("click", ".impAttachmentSubFile_innerBox_bottom .download").on("click", ".impAttachmentSubFile_innerBox_bottom .download", function(e) {
		var $parent = $(this).closest(".impAttachmentSubFileBox");
		var asignedInputId = $parent.attr("asignedInputId");
		if(asignedInputId != '') {
			//在form中有对应的节点
			ufma.showTip("附件未上传, 不能下载.", null, "warning");
		} else {
			var tmpFileId = $parent.attr("fileid");
			window.location.href = _setting._option.downloadURL + "&attachId=" + tmpFileId;
		}
	});

	//单个文件的删除
	$(document).off("click", ".impAttachmentSubFile_innerBox_bottom .trash").on("click", ".impAttachmentSubFile_innerBox_bottom .trash", function(e) {
		var $parent = $(this).closest(".impAttachmentSubFileBox");
		var asignedInputId = $parent.attr("asignedInputId");
		if(asignedInputId != '') {
			//在form中有对应的节点
			_bgPub_ImpAttachment_subFileBox_fileBox_remove($parent);
		} else {
			//在form中没有对应的节点
			var delObjs = {
				"items": []
			};
			delObjs.items[delObjs.items.length] = {
				"attachId": $parent.attr("fileid")
			};
			ufma.post(
				_setting._option.delURL,
				delObjs,
				function(result) {
					if(result.flag == "success") {
						_bgPub_ImpAttachment_subFileBox_fileBox_remove($parent);
						var fileNum = parseInt($('.impAttachmentSubFileBox').length) - 1;
						$('#attachNum').html(fileNum)
					} else {
						ufma.showTip("删除失败:" + result.msg, null, "error");
					}
				}
			);
		}
	});
	//显示模态框
	$("#" + _setting._div_modalId).modal({
		"backdrop": true,
		"show": true,
		"keyboard": false
	});

	//模态框关闭事件的监听
	$("#" + _setting._div_modalId).off("hidden.bs.modal").on("hidden.bs.modal", function() {
		if(!$.isNull(_setting._option.onClose)) {
			var _fileList = [];
			$("#" + _setting._div_modal_content_body_fileBoxId + " .impAttachmentSubFileBox[type='file'][asignedInputId='']").each(function() {
				var fileName = $(this).find("span").text();
				_fileList[_fileList.length] = {
					"filename": fileName,
					"filesize": 0,
					"fileid": $(this).attr("fileid")
				};
			});
			_setting._option.onClose(_fileList);
		}
	});

	//************************ 使用 fileinput 控件进行上传 *****************************************************
	$("#" + _setting._form_Id).hide();
	_inputFile_bg = $("#AAAtest").fileinput({
		language: "zh",
		uploadUrl: _setting._option.uploadURL,
		overwriteInitial: false,
		uploadAsync: true, //默认异步上传
		showUpload: true, //是否显示上传按钮
		showRemove: false, //显示移除按钮
		showPreview: true, //是否显示预览
		maxFileSize: 10240, //add  guohx
		browseClass: "btn btn-primary", //按钮样式
		enctype: 'multipart/form-data'
	});
	_inputFile_bg.on("filebatchselected", function(event, files) {
		/*if(files.length==0){
    		ufma.showTip('文件大小超过允许的最大数10M！',function(){},'error');
    		return false;
    	}
        //选择文件后的处理方法。
        var subFile = files[files.length - 1];
        var fileName = subFile.name;
        var fileSize = subFile.size;

        var $filesDiv = $("#" + _setting._form_Id).find(".file-preview div.kv-preview-thumb");
        var fileDiv = $filesDiv[$filesDiv.length - 1];

        _bgPub_ImpAttachment_subFileBox_fileBox(_setting._div_modal_content_body_fileBoxId,
            subFileBoxWidth,
            _setting._div_modal_content_body_fileBox_subIdHead,
            fileName,
            $(fileDiv).attr("id"));*/
		//将控制文件大小的方法提到控件外面，保证上传大于10M的文件时文件一直为前一个导入成功的文件---zsj--bug74890
		if(event.target.files[0].size > 10485760) {
			ufma.showTip('文件大小超过允许的最大数10M！', function() {}, 'error');
			event.target.value = '';
			return false;
		} else {
			//选择文件后的处理方法。
			var subFile = files[files.length - 1];
			var fileName = subFile.name;
			var fileSize = subFile.size;
			var $filesDiv = $("#" + _setting._form_Id).find(".file-preview div.kv-preview-thumb");
			var fileDiv = $filesDiv[$filesDiv.length - 1];
			if(showFileArr.flag && showFileArr.flag == "workFlow") {
				_bgPub_ImpAttachment_subFileBox_fileBox(_setting._div_modal_content_body_fileBoxId,
					subFileBoxWidth,
					_setting._div_modal_content_body_fileBox_subIdHead,
					fileName,
					$(fileDiv).attr("id"),
					showFileArr.createUser
				);
			} else {
				_bgPub_ImpAttachment_subFileBox_fileBox(_setting._div_modal_content_body_fileBoxId,
					subFileBoxWidth,
					_setting._div_modal_content_body_fileBox_subIdHead,
					fileName,
					$(fileDiv).attr("id"));
			}

		}

	});
	_inputFile_bg.on("fileuploaded", function(event, data, previewId, index) {
		//上传成功后执行
		var rspData = data.response;
		if(rspData.flag == "success") {
			//添加得到的附件ID。
			$(".impAttachmentSubFileBox[asignedInputId=" + previewId + "]").attr("fileid", rspData.data.bgAttach[0].attachId);
			//清空与form的关联
			$(".impAttachmentSubFileBox[asignedInputId=" + previewId + "]").attr("asignedInputId", "");
			_bgPub_ImpAttachment_showTip("success", null, (index + 1) == data.files.length);
			$('#attachNum').html($('.impAttachmentSubDiv .impAttachmentSubFileBox[fileid]').length);
		} else {
			_bgPub_ImpAttachment_showTip("error", rspData.msg, (index + 1) == data.files.length);
		}
	});
	//*****************************************************************************************************
};

var _bgPub_ImpAttachment_showTip = function(type, msg, bShow) {
	if(bShow) {
		if(type == "success") {
			ufma.showTip("上传成功", null, "success");

		} else if(type == "error") {
			ufma.showTip("上传失败." + msg, null, "error");
		}
	}
}

/**
 * 显示[增加附件]按钮的box，放在第一个位置上
 * @param  {[type]} parentId [box要画在哪个div上]
 * @param  {[type]} boxWidth [box的长度和宽度。正方形]
 * @param  {[type]} idHead   [box的id头部，加上iSubBoxCount组成id]
 */
var _bgPub_ImpAttachment_subFileBox_addBox = function(parentId, boxWidth, idHead) {

	var iSubBoxCount = $("#" + parentId).attr("subcount");
	if(typeof(iSubBoxCount) == "undefined") {
		iSubBoxCount = -1;
	}
	iSubBoxCount++;
	if(iSubBoxCount != 0) {
		return;
	}

	var subId = idHead + iSubBoxCount;
	var subInnerboxId = idHead + "_innerbox_" + iSubBoxCount;
	var halfWidth = (boxWidth - 16) / 2;

	var subBoxHTML2 = '<div class="impAttachmentSubFileBox" style="width:' + boxWidth + 'px; height:' + boxWidth + 'px" ' +
		'id="' + subId + '" A="' + parentId + '" B="' + boxWidth + '" C="' + idHead + '" D="' + iSubBoxCount + '" type="addbox">' +
		'<div class="impAttachmentSubFileBox_innerbox addInnerBox" id="' + subInnerboxId + '">' +
		'<div class="impAttachmentSubFileBox-iconsize" style="left:' + (halfWidth - 30) + 'px; top:' + (halfWidth - 40) + 'px">' +
		'<div class="addfileIcon"></div>' +
		'</div>' +
		'<p style="left:' + (halfWidth - 26) + 'px; top:50px">添加附件</p>' +
		'</div>' +
		'</div>';
	$("#" + parentId).append(subBoxHTML2);
	$("#" + parentId).attr("subcount", iSubBoxCount);

	//********** 事件 ***********************
	$(".impAttachmentSubFileBox_innerbox").off("mouseenter").on("mouseenter", function(e) {
		$(this).css("cursor", "pointer");
	});
	$(".impAttachmentSubFileBox_innerbox").off("mouseleave").on("mouseleave", function(e) {
		$(this).css("cursor", "auto");
	});
	$(".impAttachmentSubFileBox_innerbox.addInnerBox").off("click").on("click", function(e) {
		$("#AAAtest").trigger("click");
	});
};

/**
 * 删除指定文件box(会删除filebox的div，同时删除对应的input元素)
 * @param fileBox [要删除的filebox]
 * @return {[type]} [description]
 */
var _bgPub_ImpAttachment_subFileBox_fileBox_remove = function(fileBox) {
	// var iIndex = $(fileBox).attr("D");
	var inputId = $(fileBox).attr("asignedInputId");
	if(!$.isNull(inputId) && inputId != '') {
		$("#" + inputId).find(".file-thumbnail-footer").find("i.icon-trash").trigger("click");
	}
	$(fileBox).remove();
};

/**
 * 添加一个文件的box
 * @param  {[type]} parentId [description]
 * @param  {[type]} boxWidth [description]
 * @param  {[type]} idHead   [description]
 * @param  {[string]} fileName [description]
 * @param  {[string]} asignedInputId [相关联的inputId。如果！=null，表示为本次新增的附件。否则表示应此附件已经保存到数据库了]
 * @return {[type]}          [description]
 */
if(showFileArr.flag && showFileArr.flag == "workFlow") {
	var _bgPub_ImpAttachment_subFileBox_fileBox = function(parentId, boxWidth, idHead, fileName, asignedInputId, createUser, singleStatus) {
		var iSubBoxCount = $("#" + parentId).attr("subcount");
		if(typeof(iSubBoxCount) == "undefined") {
			return;
		}
		iSubBoxCount++;

		var subId = idHead + iSubBoxCount;
		var subInnerboxId = idHead + "_innerbox_" + iSubBoxCount;
		var subId_top = idHead + iSubBoxCount + "_top";
		var subId_bottom = idHead + iSubBoxCount + "_bottom";
		var halfWidth = (boxWidth - 16) / 2;
		//  var imgSrc = getURL(1) + "/bg/img/txt.png";
		//bug75443--zsj--根据不同文件类型展示对应图标
		var ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
		var imgSrc;
		if(ext == 'xls' || ext == 'xlsx') { //上传excel文件
			imgSrc = getURL(1) + "/bg/img/excel.png";
		} else if(ext == 'txt') { //上传txt文件
			imgSrc = getURL(1) + "/bg/img/txt.png";
		} else if(ext == 'xml') { //上传xml文件
			imgSrc = getURL(1) + "/bg/img/xml.png";
		} else if(ext == 'doc' || ext == 'docx') { //上传word文件
			imgSrc = getURL(1) + "/bg/img/word.png";
		} else if(ext == 'ppt' || ext == 'pptx') { //上传ppt文件
			imgSrc = getURL(1) + "/bg/img/ppt.png";
		} else if(ext == 'pdf') { //上传pdf
			imgSrc = getURL(1) + "/bg/img/pdf.png";
		} else if(ext == 'json') { //上传json
			imgSrc = getURL(1) + "/bg/img/json.png";
		} else if(ext == 'sql') { //上传sql
			imgSrc = getURL(1) + "/bg/img/sql.png";
		} else if(ext == 'png' || ext == 'jpg' || ext == 'svg' || ext == 'jpeg' || ext == 'bmp' || ext == 'pcx' ||
			ext == 'tif' || ext == 'gif' || ext == 'jpg' || ext == 'tga' || ext == 'exif' || ext == 'fpx' ||
			ext == 'psd' || ext == 'cdr' || ext == 'pcd' || ext == 'dxf' || ext == 'ufo' || ext == 'eps' ||
			ext == 'ai' || ext == 'hdri' || ext == 'raw' || ext == 'wmf' || ext == 'flic' || ext == 'emf' ||
			ext == 'ico') { //上传图片
			imgSrc = getURL(1) + "/bg/img/img.png";
		} else { //上传其他类型文件
			imgSrc = getURL(1) + "/bg/img/otherType.png";
		}
		var asignedInputIdVal = asignedInputId;
		if($.isNull(asignedInputId)) {
			asignedInputIdVal = "";
		}
		var hideStyle = '';
		if(singleStatus == 'true') {
			hideStyle = 'hide';
		} else {
			hideStyle = '';
		}
		var subBoxHTML1 = '<div class="impAttachmentSubFileBox" style="width:' + boxWidth + 'px; height:' + boxWidth + 'px" ' +
			'id="' + subId + '" A="' + parentId + '" B="' + boxWidth + '" C="' + idHead + '" D="' + iSubBoxCount + '" ' +
			'asignedInputId="' + asignedInputIdVal + '" type="file">' +
			'<div class="impAttachmentSubFileBox_innerbox fileInnerBox" id="' + subInnerboxId + '">' +
			'<div class="impAttachmentSubFile_innerBox_top" style="width:' + (boxWidth - 16) + 'px; height:' + (boxWidth - 30 - 16) + 'px" id="' + subId_top + '">' +
			'<p style="max-width:' + (boxWidth - 16) + 'px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-bottom:0px;" title="' + createUser + '">上传人：' + createUser + '</p>' +
			'<img style="margin-top:-15px;" src="' + imgSrc + '"/>' +
			'<span style="margin-top: 5px;"></span>' +
			'<div class="outRadio">' +
			'<div class="innerRadio unSelected"  />' +
			'</div>' +
			'</div>' +
			'<div class="impAttachmentSubFile_innerBox_bottom" style="width:' + (boxWidth - 16) + 'px; height:30px" id="' + subId_bottom + '">' +
			// '<a class="btn btn-icon-only btn-sm left upload" action= "unactive" title="上传"><span class="glyphicon icon-upload" /></a>' +
			'<a class="btn btn-icon-only btn-sm left download" action= "unactive" title="下载"><span class="glyphicon icon-download" /></a>' +
			// '<a class="btn btn-icon-only btn-sm right search" action= "unactive" title="查看"><span class="glyphicon icon-search" /></a>' +
			'<a class="btn btn-icon-only btn-sm right trash ' + hideStyle + '" action= "unactive" title="删除"><span class="glyphicon icon-trash" /></a>' +
			'</div>' +
			'</div>' +
			'</div>';

		$("#" + parentId).append(subBoxHTML1);
		$("#" + parentId).attr("subcount", iSubBoxCount);
		$(".impAttachmentSubFileBox_innerbox.fileInnerBox").off("click").on("click", function(e) {
			var vThisBoxIndex = $(this).parents("div").attr("D");
		});
		$("#" + subInnerboxId + " .impAttachmentSubFile_innerBox_top").off("click").on("click", function(e) {
			var imgWidth = boxWidth * 0.5;
			var imgLeft = boxWidth * 0.2; //(boxWidth-20-16)
			var fileNameTop = boxWidth - 30 - 16 - 25;
			var fileNameLeft = 5;

			var $img = $(this).find("img");
			var $span = $(this).find("span");
			$($img).css("top", "15px");
			$($img).css("left", imgLeft + "px");
			$($img).css("width", imgWidth + "px");
			$($img).css("height", imgWidth + "px");

			$($span).css("top", fileNameTop + "px");
			$($span).css("left", fileNameLeft + "px");
			$($span).css("max-width", boxWidth - 25 + "px");
			if(fileName.indexOf("\/") > -1) {
				var fileNameAnalizeArr = fileName.split("\/");
				$($span).text(fileNameAnalizeArr[fileNameAnalizeArr.length - 1]);
				$($span).attr('title', fileNameAnalizeArr[fileNameAnalizeArr.length - 1]);
			} else {
				$($span).text(fileName);
				$($span).attr('title', fileName);
			}
		});
		$("#" + subInnerboxId + " .impAttachmentSubFile_innerBox_top").trigger("click");
		return subId;
	};
} else {
	var _bgPub_ImpAttachment_subFileBox_fileBox = function(parentId, boxWidth, idHead, fileName, asignedInputId) {
		var iSubBoxCount = $("#" + parentId).attr("subcount");
		if(typeof(iSubBoxCount) == "undefined") {
			return;
		}
		iSubBoxCount++;

		var subId = idHead + iSubBoxCount;
		var subInnerboxId = idHead + "_innerbox_" + iSubBoxCount;
		var subId_top = idHead + iSubBoxCount + "_top";
		var subId_bottom = idHead + iSubBoxCount + "_bottom";
		var halfWidth = (boxWidth - 16) / 2;
		//  var imgSrc = getURL(1) + "/bg/img/txt.png";
		//bug75443--zsj--根据不同文件类型展示对应图标
		var ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
		var imgSrc;
		if(ext == 'xls' || ext == 'xlsx') { //上传excel文件
			imgSrc = getURL(1) + "/bg/img/excel.png";
		} else if(ext == 'txt') { //上传txt文件
			imgSrc = getURL(1) + "/bg/img/txt.png";
		} else if(ext == 'xml') { //上传xml文件
			imgSrc = getURL(1) + "/bg/img/xml.png";
		} else if(ext == 'doc' || ext == 'docx') { //上传word文件
			imgSrc = getURL(1) + "/bg/img/word.png";
		} else if(ext == 'ppt' || ext == 'pptx') { //上传ppt文件
			imgSrc = getURL(1) + "/bg/img/ppt.png";
		} else if(ext == 'pdf') { //上传pdf
			imgSrc = getURL(1) + "/bg/img/pdf.png";
		} else if(ext == 'json') { //上传json
			imgSrc = getURL(1) + "/bg/img/json.png";
		} else if(ext == 'sql') { //上传sql
			imgSrc = getURL(1) + "/bg/img/sql.png";
		} else if(ext == 'png' || ext == 'jpg' || ext == 'svg' || ext == 'jpeg' || ext == 'bmp' || ext == 'pcx' ||
			ext == 'tif' || ext == 'gif' || ext == 'jpg' || ext == 'tga' || ext == 'exif' || ext == 'fpx' ||
			ext == 'psd' || ext == 'cdr' || ext == 'pcd' || ext == 'dxf' || ext == 'ufo' || ext == 'eps' ||
			ext == 'ai' || ext == 'hdri' || ext == 'raw' || ext == 'wmf' || ext == 'flic' || ext == 'emf' ||
			ext == 'ico') { //上传图片
			imgSrc = getURL(1) + "/bg/img/img.png";
		} else { //上传其他类型文件
			imgSrc = getURL(1) + "/bg/img/otherType.png";
		}
		var asignedInputIdVal = asignedInputId;
		if($.isNull(asignedInputId)) {
			asignedInputIdVal = "";
		}
		var subBoxHTML1 = '<div class="impAttachmentSubFileBox" style="width:' + boxWidth + 'px; height:' + boxWidth + 'px" ' +
			'id="' + subId + '" A="' + parentId + '" B="' + boxWidth + '" C="' + idHead + '" D="' + iSubBoxCount + '" ' +
			'asignedInputId="' + asignedInputIdVal + '" type="file">' +
			'<div class="impAttachmentSubFileBox_innerbox fileInnerBox" id="' + subInnerboxId + '">' +
			'<div class="impAttachmentSubFile_innerBox_top" style="width:' + (boxWidth - 16) + 'px; height:' + (boxWidth - 30 - 16) + 'px" id="' + subId_top + '">' +
			'<img src="' + imgSrc + '"/>' +
			'<span></span>' +
			'<div class="outRadio">' +
			'<div class="innerRadio unSelected"  />' +
			'</div>' +
			'</div>' +
			'<div class="impAttachmentSubFile_innerBox_bottom" style="width:' + (boxWidth - 16) + 'px; height:30px" id="' + subId_bottom + '">' +
			// '<a class="btn btn-icon-only btn-sm left upload" action= "unactive" title="上传"><span class="glyphicon icon-upload" /></a>' +
			'<a class="btn btn-icon-only btn-sm left download" action= "unactive" title="下载"><span class="glyphicon icon-download" /></a>' +
			// '<a class="btn btn-icon-only btn-sm right search" action= "unactive" title="查看"><span class="glyphicon icon-search" /></a>' +
			'<a class="btn btn-icon-only btn-sm right trash" action= "unactive" title="删除"><span class="glyphicon icon-trash" /></a>' +
			'</div>' +
			'</div>' +
			'</div>';

		$("#" + parentId).append(subBoxHTML1);
		$("#" + parentId).attr("subcount", iSubBoxCount);
		$(".impAttachmentSubFileBox_innerbox.fileInnerBox").off("click").on("click", function(e) {
			var vThisBoxIndex = $(this).parents("div").attr("D");
		});
		$("#" + subInnerboxId + " .impAttachmentSubFile_innerBox_top").off("click").on("click", function(e) {
			var imgWidth = boxWidth * 0.5;
			var imgLeft = boxWidth * 0.2; //(boxWidth-20-16)
			var fileNameTop = boxWidth - 30 - 16 - 25;
			var fileNameLeft = 5;

			var $img = $(this).find("img");
			var $span = $(this).find("span");
			$($img).css("top", "15px");
			$($img).css("left", imgLeft + "px");
			$($img).css("width", imgWidth + "px");
			$($img).css("height", imgWidth + "px");

			$($span).css("top", fileNameTop + "px");
			$($span).css("left", fileNameLeft + "px");
			$($span).css("max-width", boxWidth - 25 + "px");
			if(fileName.indexOf("\/") > -1) {
				var fileNameAnalizeArr = fileName.split("\/");
				$($span).text(fileNameAnalizeArr[fileNameAnalizeArr.length - 1]);
			} else {
				$($span).text(fileName);
			}
		});
		$("#" + subInnerboxId + " .impAttachmentSubFile_innerBox_top").trigger("click");
		return subId;
	};
}
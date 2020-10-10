//BEGIN SETUP
//拍照数据（base64）
window._close = function (state) {
    if (window.closeOwner) {
        var data = {
            updateattach:updateattach
        }
		if(window.dialog){
			window.dialog.get_actionType("closeSignal");
		}
        window.closeOwner(data);
    }
}
var baseUrl;
var socket;
var updateattach = true
function openSocket() {
    socket = new WebSocket(baseUrl);
    socket.onclose = function () {
        console.error("web channel closed");
    };
    socket.onerror = function (error) {
        console.error("web channel error: " + error);
    };
    socket.onopen = function () {
        new QWebChannel(socket, function (channel) {
            // make dialog object accessible globally
            window.dialog = channel.objects.dialog;
            //网页关闭函数
            window.onbeforeunload = function () {
                dialog.get_actionType("closeSignal");
            }
            window.onunload = function () {
                dialog.get_actionType("closeSignal");
            }
            //左转
            document.getElementById("rotateLeft").onclick = function() {
                dialog.get_actionType("rotateLeft");
            };
            //右转
            document.getElementById("rotateRight").onclick = function() {
                dialog.get_actionType("rotateRight");
            };
            //拍照按钮点击
            document.getElementById("photographPri").onclick = function () {
                dialog.photoBtnClicked("primaryDev_");
                dialog.get_actionType("savePhotoPriDev");
            };
            //服务器返回消息
            dialog.sendPrintInfo.connect(function (message) { });
            //接收图片流用来展示，多个，较小的base64，副头数据
            dialog.send_priImgData.connect(function (message) {
                var element = document.getElementById("bigPriDev");
                element.src = "data:image/png;base64," + message;
            });
            //接收拍照base64
            dialog.send_priPhotoData.connect(function (message) {
                var srt = ''
                srt += '<div class="shangchuanshuru">'
                srt += '<img src="data:image/png;base64,' + message + '" width="220">'
                srt += '<div class="paishecaozuo">'
                srt += '<input class="xiugaipaishe" type="text" placeholder="点击此处输入附件名称">'
                srt += '<div class="delpaishe icon-trash"></div>'
                srt += '<div class="chuanpaishe icon-upload"></div>'
                srt += '</div>'
                document.getElementById('shangchuanneirong').innerHTML  = document.getElementById('shangchuanneirong').innerHTML+srt
                // $(".").append(srt)
            });
            //网页加载完成信号
            dialog.html_loaded("one");
        });
    }
}
//网页初始化函数
window.onload = function () {
    baseUrl = "ws://127.0.0.1:12345";
    openSocket();
}
$(document).on("click", ".delpaishe", function() {
	$(this).parents(".shangchuanshuru").remove();
})
$(document).on("click", ".chuanpaishe", function() {
	_this = $(this)
	if($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		var paisheobj = new Object();
		paisheobj.vouGuid = window.ownerData.guid
		var imgList = new Array();
		var shangchuangimg = new Object()
		if($(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val() == "") {
			shangchuangimg.imgName = "扫描图片" + 1
			$(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val("扫描图片" + 1)
		} else {
			shangchuangimg.imgName = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val()
		}
		shangchuangimg.imgStr = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find("img").attr("src");
		imgList.push(shangchuangimg);
        paisheobj.imgList = imgList
        ufma.ajaxDef('/gl/file/uploadImage', 'post', paisheobj, function (data) {
            updateattach = false
            ufma.showTip("上传成功", function() {}, "success");
            _this.parents(".shangchuanshuru").find(".delpaishe").remove();
            _this.parents(".shangchuanshuru").find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
            _this.parents(".shangchuanshuru").find(".xiugaipaishe").attr("disabled", true);
            _this.parents(".shangchuanshuru").addClass("shangchuanshuruyishangchuan");
            _this.remove();
        })
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-sure", function() {
	if($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		var paisheobj = new Object();
		if($(".shangchuanneirong").find(".shangchuanshuru").length == $(".shangchuanneirong").find(".shangchuanshuruyishangchuan").length) {
			ufma.showTip("您没有上传新的图片", function() {}, "error");
		} else {
			paisheobj.vouGuid =  window.ownerData.guid;
			var imgList = new Array();
			for(var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
				var shangchuangimg = new Object()
				if($(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val() == "") {
					shangchuangimg.imgName = "扫描图片" + (i + 1)
					$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val("扫描图片" + (i + 1))
				} else {
					shangchuangimg.imgName = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val()
				}
				shangchuangimg.imgStr = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find("img").attr("src");
				imgList.push(shangchuangimg);
			}
			paisheobj.imgList = imgList
            ufma.ajaxDef('/gl/file/uploadImage', 'post', paisheobj, function (data) {
                updateattach = false
                ufma.showTip("上传成功", function() {}, "success");
                for(var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
                    $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".delpaishe").remove();
                    $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".chuanpaishe").remove();
                    $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
                    $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").attr("disabled", true);
                    $(".shangchuanneirong").find(".shangchuanshuru").eq(i).addClass("shangchuanshuruyishangchuan");
                }
			});
		}
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-cancle", function() {
    _close()
})


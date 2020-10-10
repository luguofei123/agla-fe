var keydownctrls = true;
$(document).on("keydown", function(event) {
	event = event || window.event;
	//Shift+S 保存为模版
	if(event.shiftKey && event.keyCode == 83) {
	 	if(keydownctrls == true && $("#mbbc").length == 1) {
			keydownctrls = false
			$('#mbbc').trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Alt+S 保存并新增
	if(event.altKey && event.keyCode == 83) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bcbxz").length == 1) {
			keydownctrls = false
			$("#btn-voucher-bcbxz").click();
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	if(event.keyCode == 119) {
		event.preventDefault();
		if(keydownctrls == true) {
			keydownctrls = false;
			setTimeout(function() {
				if(isaccfullname!=true){
					$("#vouisfullname #vouisfullnamesingle").trigger('click');
				}else{
					$("#vouisfullname #vouisfullnamesingles").trigger('click');
				}
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	//Ctrl+S 保存
	if(event.keyCode == 83 && event.ctrlKey) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bc").length == 1) {
			keydownctrls = false;
			setTimeout(function() {
				$("#btn-voucher-bc").trigger('click');
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	//Alt+N 新增
	if(event.altKey && event.keyCode == 78) {
		event.preventDefault();
		$('#btn-voucher-xz').trigger('click');
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Alt+PgUp 第一张凭证
	if(event.altKey && event.keyCode == 33) {
		if(keydownctrls == true && $(".btn-onevoucher").length == 1) {
			keydownctrls = false
			$('.btn-onevoucher').eq(0).trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Alt+PgDn 最后一张凭证
	if(event.altKey && event.keyCode == 34) {
		if(keydownctrls == true && $(".btn-lastvoucher").length == 1) {
			keydownctrls = false
			$('.btn-lastvoucher').eq(0).trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//PgUp 上一张凭证
	if(event.keyCode == 33) {
		if(keydownctrls == true && $(".btn-prevvoucher").length == 1) {
			keydownctrls = false
			$('.btn-prevvoucher').eq(0).trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//PgDn 下一张凭证
	if(event.keyCode == 34) {
		if(keydownctrls == true && $(".btn-nextvoucher").length == 1) {
			keydownctrls = false
			$('.btn-nextvoucher').eq(0).trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Alt+A 审核
	if(event.keyCode == 65 && event.altKey) {
		if(keydownctrls == true && $("#btn-voucher-sh").length == 1) {
			keydownctrls = false
			$("#btn-voucher-sh").click();
			keydownctrls = true
			event.preventDefault();
			event.returnValue = false;
			return false;
		}
	}
	//Alt+O 记账
	if(event.keyCode == 79 && event.altKey) {
		if(keydownctrls == true && $("#btn-voucher-jz").length == 1) {
			keydownctrls = false
			$("#btn-voucher-jz").click();
			keydownctrls = true
			event.preventDefault();
			event.returnValue = false;
			return false;
		}
	}
	//Ctrl+M 调用模版
	if(event.keyCode == 81 && event.ctrlKey) {
		if(keydownctrls == true && $("#mbsr").length == 1) {
			keydownctrls = false;
			$("#mbsr").click();
		}
		keydownctrls = true;
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Ctrl+E 标错
	if(event.keyCode == 69 && event.ctrlKey) {
		if(keydownctrls == true && $("#btn-voucher-biaocuo").length == 1) {
			keydownctrls = false
			$('#btn-voucher-biaocuo').trigger('click')
			keydownctrls = true
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}

	//弹出式询问，左右切换
	//left 37 right 39
	if(event.keyCode == 37) {
		if($(".u-msg-cancel").length == 1) {
			if($(".u-msg-cancel").hasClass("btn-primary")) {
				$(".u-msg-cancel").removeClass("btn-primary").addClass("btn-default")
					.css({
						"background-color": "#fff",
						"color": "#333",
						"border": "1px #D9D9D9 solid"
					})
					.siblings(".u-msg-ok").removeClass("btn-default").addClass("btn-primary")
					.css({
						"background-color": "#108ee9",
						"color": "#fff",
						"border": "1px #108ee9 solid"
					});
			}
			event.preventDefault();
			event.returnValue = false;
			return false;
		}
	}
	if(event.keyCode == 39) {
		if($(".u-msg-ok").length == 1) {
			if($(".u-msg-ok").hasClass("btn-primary")) {
				$(".u-msg-ok").removeClass("btn-primary").addClass("btn-default")
					.css({
						"background-color": "#fff",
						"color": "#333",
						"border": "1px #D9D9D9 solid"
					})
					.siblings(".u-msg-cancel").removeClass("btn-default").addClass("btn-primary")
					.css({
						"background-color": "#108ee9",
						"color": "#fff",
						"border": "1px #108ee9 solid"
					});
			}
			event.preventDefault();
			event.returnValue = false;
			return false;
		}
	}
	if(event.keyCode == 13) {
		afterAddRow();
		if($(".u-msg-ok").length == 1) {
			if($(".u-msg-ok").hasClass("btn-primary")) {
				$(".u-msg-ok").click();
			} else if($(".u-msg-cancel").hasClass("btn-primary")) {
				$(".u-msg-cancel").click();
			}
			$(".abstractinp").eq(0).focus();
			event.preventDefault();
			event.returnValue = false;
			return false;
		}
	}
	if(event.keyCode == 80 && event.ctrlKey) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-dy").length == 1) {
			keydownctrls = false;
			setTimeout(function() {
				$("#btn-voucher-dy").trigger('click');
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	if(event.keyCode == 80 && event.shiftKey) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-dyyl").length == 1) {
			keydownctrls = false;
			setTimeout(function() {
				$("#btn-voucher-dyyl").trigger('click');
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	if(event.keyCode == 78 && event.shiftKey) {
		event.preventDefault();
		if(keydownctrls == true) {
			keydownctrls = false;
			setTimeout(function() {
				if(vousinglepz == true){
					$("#vouisdoublesingle").trigger('click')
				}else if(vousinglepzzy==true){
					$("#vouisdoublesingles").trigger('click')
				}
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
})
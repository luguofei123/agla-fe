$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			}
			window.closeOwner(data);
		}
	};
	var dateTime = window.ownerData.dateTime; //bug79086--zsj
	var page = function() {
		return {
			onEventListener: function() {
				// CWYXM-8660--不能超出数据库对应字段长度--zsj
				$('input').on('blur', function() {
					if($(this).attr('maxlength')) {
						var testRex = /[^\x00-\xff]/ig;
						var msg = $(this).val();
						var strArr = $(this).val().split('');
						var count = 0;
						var twoCount = 0;
						var allCount = 0;
						var maxlength = parseInt($(this).attr('maxlength'));
						var finalLength = 0;
						var realLeng = parseInt(maxlength / 2);
						for(var i = 0; i < msg.length; i++) {
							if((msg.charCodeAt(i) >= 65 && msg.charCodeAt(i) <= 90) || (msg.charCodeAt(i) >= 97 && msg.charCodeAt(i) <= 122) || (msg.charCodeAt(i) >= 48 && msg.charCodeAt(i) <= 57)) {
								count += 1;
								if(count > maxlength) {
									$(this).val($(this).val().substring(0, maxlength));
								}
							} else {
								twoCount += 1;
								if(twoCount > realLeng) {
									$(this).val($(this).val().substring(0, realLeng));
								}
							}
						}
						allCount = count + parseInt(twoCount * 2);
						if(allCount > maxlength) {
							var oneOver = 0;
							if(count == 0 && twoCount != 0) {
								$(this).val($(this).val().substring(0, realLeng));
							} else if(count != 0 && twoCount == 0) {
								$(this).val($(this).val().substring(0, maxlength));
							} else if(count != 0 && twoCount != 0) {
								if(count % 2 == 0) {
									var twolen = (maxlength - count) / 2;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								} else {
									var twolen = (maxlength - count) / 2 + 1;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								}
							}
						}
					}
				});
				$('#subsidyPersonIdentity').on('keyup paste', function() {
					$(this).val($(this).val().replace(/[\W]|_/g, '')); //身份证只能输入数字和字母--zsj
				})
				//取消
				$('#btnQuit').click(function() {
					ufma.setBarPos($(window));
					_close();
				});
				// 保存
				$('#btnSave').click(function() {
					var argu = $('#frmBookIn').serializeObject();
					argu.agencyCode = window.ownerData.agencyCode;
					argu.acctCode = window.ownerData.acctCode;
					argu.setYear = window.ownerData.setYear;
					argu.rgCode = window.ownerData.rgCode;
					if($.isNull(window.ownerData.rowData)) {
						if(!$.isNull(argu.btzlCode) && !$.isNull(argu.subsidyPersonType) && !$.isNull(argu.subsidyPersonName) && !$.isNull(argu.subsidyDate) && !$.isNull(argu.subsidyMoney) && !$.isNull(argu.subsidyProject)) {
							if(argu.subsidyMoney != 0) { // CWYXM-8684--补贴金额不能为0--zsj
								dm.pfgsBookIn(argu, function(result) {
									ufma.showTip(result.msg, function() {
										_close();
										ufma.setBarPos($(window));
									}, 'success');
								});
							} else {
								ufma.showTip('补贴金额不能为0！', function() {
									return false;
								}, "warning");
							}
						} else {
							ufma.showTip('请输入必填项！', function() {
								return false;
							}, "warning");
						}
					} else {
						argu.subsidyGuid = window.ownerData.rowData.subsidyGuid; //传入id值
						if(argu.btzlCode != "" && argu.subsidyPersonType != "" && argu.subsidyPersonName != "" && argu.subsidyDate != "" && argu.subsidyMoney != "" && argu.subsidyProject != "") {
							dm.pfgsEdit(argu, function(result) {
								ufma.showTip(result.msg, function() {
									ufma.setBarPos($(window));
									_close();
								}, 'success');
							});
						}
					}
				});
				//保存并新增
				$('#btnSaveAndAdd').click(function() {
					var argu = $('#frmBookIn').serializeObject();
					argu.agencyCode = window.ownerData.agencyCode;
					argu.acctCode = window.ownerData.acctCode;
					argu.setYear = window.ownerData.setYear;
					argu.rgCode = window.ownerData.rgCode;
					if($.isNull(window.ownerData.rowData)) {
						if(!$.isNull(argu.btzlCode) && !$.isNull(argu.subsidyPersonType) && !$.isNull(argu.subsidyPersonName) && !$.isNull(argu.subsidyDate)  && !$.isNull(argu.subsidyMoney)&& !$.isNull(argu.subsidyProject)) {
							if(argu.subsidyMoney != 0) { // CWYXM-8660--补贴金额不能为0--zsj
								dm.doSave(argu, function(result) {
									//如果保存成功，当前表单置空，可再次录入
									if(result.flag == 'success') {
										ufma.showTip(result.msg, function() {}, 'success');
										var datePre = argu.subsidyDate;
										$('#frmBookIn')[0].reset(); //表单置空
										$('#btzlCode,#subsidyPersonType').getObj().clear();
									}
								})
							} else {
								ufma.showTip('补贴金额不能为0！', function() {
									return false;
								}, "warning");
							}

						} else {
							ufma.showTip('请输入必填项！', function() {}, "warning");
							return false;
						}
					} else {
						argu.subsidyGuid = window.ownerData.rowData.subsidyGuid; //传入id值
						if(argu.btzlCode != "" && argu.subsidyPersonType != "" && argu.subsidyPersonName != "" && argu.subsidyDate != "" && argu.subsidyMoney != "" && argu.subsidyProject != "") {
							dm.pfgsEdit(argu, function(result) {
								//如果保存成功，当前表单置空，可再次录入
								if(result.flag == 'success') {
									ufma.showTip(result.msg, function() {}, 'success');
									//表单置空
									$('#frmBookIn')[0].reset();
									$('#btzlCode,#subsidyPersonType').getObj().clear();
									window.ownerData.rowData = '';
								}
							});
						}
						window.ownerData.rowData = '';
					}
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//接受者类型
				dm.jszlx({
					//初始化为ufTreecombox，可获得相关事件,如onChange
				}, function(result) {
					$('#subsidyPersonType').ufTreecombox({
						idField: "ENU_CODE",
						textField: "ENU_NAME",
						pIdField: "pId",
						readonly: false,
						leafRequire: true,
						data: result.data
					});
				});
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(dateTime) //bug79086--zsj
				});
				//补贴种类
				dm.btzl({
					agencyCode: window.ownerData.agencyCode
				}, function(result) {
					$('#btzlCode').ufTreecombox({
						idField: "id",
						textField: "codeName",
						readonly: false,
						leafRequire: true,
						data: result.data,
						onComplete: function(sender) {

						}
					});
				});
				$('#subsidyMoney').amtInput();
				$('#subsidyDate').intInput();
				$('#frmBookIn').setForm(window.ownerData.rowData); //弹出层初始化赋表格里取到的值
				$('#subsidyDate').getObj().setValue('');
			},
			init: function() {
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});
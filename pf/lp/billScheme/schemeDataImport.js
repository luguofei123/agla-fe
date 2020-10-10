/*zhaoxjb 2018.5.22*/
var guid = "";
var tableHeadName = [];
$(function() {

	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
	/* 
	 * CWYXM-8433--业务单据记账和凭证生成界面，选择使用xml导入的方案点击取数时，弹出xml文件选择框
	 *  1、根据方案的类型动态控制弹窗标题；
	 * 2、根据方案类型控制弹窗界面“工作表”和“数据行”的显示与隐藏
	 * zsj
	 */
	var ownerData = window.ownerData;
	if(ownerData.openDataSrcType == "06") {
		$('.showOrHide').addClass('hide');
	} else if(ownerData.openDataSrcType == "01") {
		$('.showOrHide').removeClass('hide');
	}  
	//获取年度，区域并赋值 S
	var pfData = ufma.getCommonData();
	var ds = {};
	ds.setYear = pfData.svSetYear;
	ds.rgCode = pfData.svRgCode;
	$("#setYear,#setYearXML").val(ds.setYear);
	$("#rgCode,#rgCodeXML").val(ds.rgCode);
	$("#agencyCode,#agencyCodeXML").val(infor.agencyCode);
	$("#acctCode,#acctCodeXML").val(infor.acctCode);
	//获取年度，区域并赋值 E

	tableHeadName = infor.tableHeadName;
	//接口URL集合
	var interfaceURL = {};
	var page = function() {
		return {
			//请求单据方案
			getSchemeByCondition: function() {
				page.randerSchemeBtns();
			},
			//渲染数据源名称list
			randerSchemeBtns: function() {
				var guid = infor.schemeGuid;
				var schemeName = infor.schemeName;
				var btns = '<button class="btn btn-primary" scheme-guid="' + guid + '">' + schemeName + '</button>';
				$("#source-btn").append(btns);
			},
			//初始化页面
			initPage: function() {
				//请求所有单据方案
				page.getSchemeByCondition();
				// $('input[name="schemeGuid"]').val(infor.schemeGuid);
				// $('input[name="dataSrcType"]').val(infor.item.dataSrcType);
				// $('input[name="billTypeCode"]').val(infor.item.billTypeCode);

			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() { //选中单位的时候,单位下拉才会出现
				//取消
				$(document).on("click", "#btn-cancle", function(e) {
					_close("cancel");
				});
				//关闭
				$(document).on("click", "#btn-close", function(e) {
					_close("close", {});
				});

			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	page.init();
});
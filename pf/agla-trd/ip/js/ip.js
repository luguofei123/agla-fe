//封装页面公共参数
function getCommonOptions(options) {
	var common_data = JSON.parse(localStorage.getItem("commonData"));
	var token_id = getTokenId();
	options["ajax"] = "noCache";
	options["tokenid"] = token_id;
	options["svFiscalPeriod"] = common_data.svFiscalPeriod;
	options["svSetYear"] = common_data.svSetYear;
	options["svTransDate"] = common_data.svTransDate;
	options["svUserId"] = common_data.svUserId;
	options["svUserCode"] = common_data.svUserCode;
	options["svUserName"] = common_data.svUserName;
	options["svRgCode"] = common_data.svRgCode;
	options["svRgName"] = common_data.svRgName;
	options["svRoleId"] = common_data.svRoleId;
	options["svRoleCode"] = common_data.svRoleCode;
	options["svRoleName"] = common_data.svRoleName;
	options["svMenuId"] = common_data.svMenuId;
	return options;
}
function getPriEleCodeRelation(ele_code,eleRelations)
{
	var m = "";
	for(var i = 0; i < eleRelations.length; i++){
		if(eleRelations[i].sec_ele_code == ele_code.toUpperCase()){
			var pri_ele_code = $("#" + eleRelations[i].pri_ele_code.toLowerCase()+"-h");
			if(pri_ele_code!= undefined &&pri_ele_code.val()!=""){
				
				m +=eleRelations[i].pri_ele_code+":"+pri_ele_code.val().split("@")[2]+"@@";
		  	
		  }
		}
	}
	return m;
}
var grelations=null;
var grelationvalue=null;
function coaRelation(ele_code,coa_id,eleRelations,flag) {
	var old_value = $("#" + ele_code).val();
	grelationvalue = old_value;
	var relations = getPriEleCodeRelation(ele_code,eleRelations);
	grelations = eleRelations;
    $.ajax({
        url: "/df/dic/dictree.do",
        type: "GET",
        dataType: "json",
		async: false,
        data: {
        	"tokenid" : getTokenId(),
            "element": ele_code,
            "coa_id":coa_id,
            "relations":relations,
            "ajax":"noCache"
        },
        success: function (data) {
           treeChoice(ele_code,data.eleDetail,flag);
        }
    })
	
} 
function clearSecEleCode(ele_code) {
	if(grelations==null){
		return;
	}
    var cur_value = $("#" + ele_code).val();
	if(grelationvalue != cur_value) {
		for(var i = 0; i < grelations.length; i++){
			if(relations[i].pri_ele_code == ele_code){
				var sec_ele_code = $("#" + relations[i].sec_ele_code);
				if(sec_ele_code != undefined) {
					    $("#" + relations[i].sec_ele_code + "-h").val("");
					    $("#" + relations[i].sec_ele_code ).val("");
				}
			}
		}
	}
    grelations=null;
}
//传入主值id
function relationRank (id) {
	var value = $("#" + id).val();
	$.ajax({
        url: "/df/view/getViewDetail.do?tokenid="+tokenid,
        type: "GET",
        dataType: "json",
		async: false,
        data: {
            "id": id,
            "value": value
        },
        success: function (data) {
        	data = data.datas;
			for (var i = 0; i < data.length; i++) {
				switch (data[i].type) {
					case "combobox":
						var html = "";
						for (var k = 0; k < data[i].datas.length; i++){
							html += '<option value="' + data[i].datas[k].value + '">' + data[i].datas[k].name + '</option>';
						}
						$("#" + data[i].datas[k].id).html(html);
		                break;
		            case "tree":
			            var dataobj = localStorage.getItem($("#" + data[i].id));
						if (dataobj == null || dataobj.length == 0 || dataobj != JSON.stringify(data)) {
							localStorage.setItem(data[i].id, JSON.stringify(data[i].datas));
						}
		                break;
		        }
			}
		}
	});
}
//通过角色菜单判断资源标识显示与否
function isShow(data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].flag == "0") {
			$("#" + data[i].id).css("display","none");
		} else {
			$("#" + data[i].id).css("display","block");
		}
	}
}
//带确定 取消的消息提示框
function warnJumpMsg(msg,sureId,cancelCla){
	var configModal = $("#config-modal")[0];
	if(!configModal){
		var innerHTML="<div id='config-modal' class='bs-modal-sm'><div class='modal-dialog modal-sm'>";
		innerHTML+="<div class='modal-content'><div class='modal-header'>";
		innerHTML+="<button type='button' class='close closeBtn "+cancelCla+"'><span>&times;</span></button>";
		innerHTML+="<h4 class='modal-title'>系统提示</h4></div><div class='modal-body'><p id='msg-notice'>"+msg+"</p></div>";
		innerHTML+="<div class='modal-footer'><button id="+sureId+" type='button' class='btn btn-primary sure'>确定</button>";
		innerHTML+="<button  type='button' class='closeBtn btn btn-default "+cancelCla+"'>取消</button></div></div></div></div>";
		$("body").append(innerHTML);
	}else{
		$("#config-modal").show();
		$("#msg-notice").text(msg);
		$(".sure").attr("id",sureId);
		$(".closeBtn").addClass(cancelCla);
	}
};
// 获取当前用户tokenid
function getTokenId () {
	var current_url = location.search;
	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
	return tokenid;
}
//取url后参数
function getUrlParameter(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		return unescape(r[2]);
	}
	return null;
}

// 信息提示弹窗组件 ipInfoJump
function ipInfoJump(msg) {
	var success_info = $("#info-notice")[0];
	if(!success_info){
		$("body").append('<div id="info-notice" class="info-notice">' + msg + '</div>');
	} else {
		$("#info-notice").text(msg);
	}
	$("#info-notice").css("display","block");
	$("#info-notice").css("z-index","9999");
	$("#info-notice").fadeOut(4000);
}
// 创建表格区域
// viewId: 视图id
// areaId: 创建表格的位置id(命名使用驼峰命名，例如：gridArea)
// url:获取表格数据的url
// options: 获取数据的参数
// flag: 0 页面初始化不加载数据，1 页面初始化加载数据
function createGrid(viewId,areaId,url,options,flag) {
	var tokenid = getTokenId();
	var view = {};
	$.ajax({
        url: "/df/view/getViewDetail.do?tokenid="+tokenid,
        type: "GET",
        dataType: "json",
		async: false,
        data: {
            viewid: viewId
        },
        success: function (data) {
			view = initGrid(data,areaId,url,options,flag);
		}
	});
	return view;
}
function initGrid(data,areaId,url,options,flag) {
	var viewModel = {
		gridData: new u.DataTable({
			meta:''
		}),
		totals:[],
	};
	viewModel.createGrid = function(data){
		var viewId = data.viewid.substring(1,37);
		var meta = '{';
		for(var j=0;j<data.viewDetail.length;j++){
			meta += '"' + data.viewDetail[j].id + '"';
			meta += ":{}";
			if(j < data.viewDetail.length - 1){
				meta += ",";
			}
		}
		meta += "}";
		viewModel.gridData.meta = JSON.parse(meta);
		var innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","autoExpand":false,"needLocalStorage":true,"multiSelect": true,"showNumCol": true,"showSumRow": true,"onSortFun":"sortFun"}' + "'>";
		innerHTML += "<div options='" + '{"field":"operate","dataType":"String","editType":"string","title":"操作","fixed":true,"width": 150,"renderType":"' + areaId + '"}'+"'></div>";
		for(var i = 0; i < data.viewDetail.length; i++ ) {
			if(data.viewDetail[i].width == ""){
				data.viewDetail[i].width = 200;
			}
			canVisible = ((data.viewDetail[i].visible == false) ? true : false);
			if(data.viewDetail[i].sumflag == "1") {
				console.log(data.viewDetail[i]);
				viewModel.totals.push(data.viewDetail[i].id);
				viewModel[data.viewDetail[i].id] = "";
				innerHTML += "<div options='"+'{"field":"'+ data.viewDetail[i].id +'","editType":"string","visible":' + data.viewDetail[i].visible + ',"canVisible":' + canVisible + ',"dataType":"String","title":"'+ data.viewDetail[i].name +'","headerLevel":"'+ data.viewDetail[i].headerlevel +'","width": '+ data.viewDetail[i].width +',"sumCol":true,"sumRenderType":"summ"}'+"'></div>";
			} else {
				innerHTML += "<div options='"+'{"field":"'+ data.viewDetail[i].id +'","editType":"string","visible":' + data.viewDetail[i].visible + ',"canVisible":' + canVisible + ',"dataType":"String","title":"'+ data.viewDetail[i].name +'","headerLevel":"'+ data.viewDetail[i].headerlevel +'","width": '+ data.viewDetail[i].width +'}'+"'></div>";
			} 
		}
		innerHTML += "</div>";
		innerHTML += "<div id='pagination' class='u-pagination' u-meta='" + '{"type":"pagination","data":"gridData","pageList":[10,20,50,100],"sizeChange":"sizeChangeFun","pageChange":"pageChangeFun"}' + "'></div>";
		$('#' + areaId).append(innerHTML);
	};
	viewModel.pageChangeFun = function(pageIndex){
		viewModel.gridData.pageIndex(pageIndex);
		var total_row = viewModel.gridData.totalRow();
		var page_size = viewModel.gridData.pageSize();
		viewModel.getDataTableStaff(url,page_size,pageIndex,total_row);
	};
	viewModel.sizeChangeFun = function(size){
		viewModel.gridData.pageSize(size);
	    viewModel.gridData.pageIndex("0");
	    viewModel.pageSizeNum = size;
		var total_row = viewModel.gridData.totalRow();
	    viewModel.getDataTableStaff(url,size,"0",total_row);
	};
	viewModel.getDataTableStaff = function (url,size,pageIndex,totalElements) {
		var pageInfo =size+","+pageIndex+","+totalElements ;
		$.ajax({
            url: url,
            type: "GET",
			data: {
				"pageInfo":pageInfo,
				"sortType":JSON.stringify(viewModel.string)
			},
            success: function (data) {
            	var totnum = data.totalElements;
    			var pagenum = Math.ceil(totnum/size);
				viewModel.gridData.setSimpleData(data.dataDetail);
				viewModel.gridData.setRowUnSelect(0);
				viewModel.gridData.totalPages(pagenum);
				viewModel.gridData.totalRow(totnum);
			}
		});
	};
	summ = function(obj){
		obj.element.parentNode.style.height = 'auto';
		obj.element.parentNode.innerHTML = '<div class = "text-left" style="height:15px; line-height:15px;">总计：' + viewModel[obj.gridCompColumn.options.field] + '</div><div class = "text-left" style="height:15px; line-height:15px;">小计：' + obj.value + '</div>';
	}
	sortFun = function(field,sort) {
		viewModel.string = {};
		if (sort != undefined) {
			viewModel.string = {
				"name":field,
				"type":sort
			};
		}
		options["sortType"] = JSON.stringify(viewModel.string);
		options["pageInfo"] = viewModel.pageSizeNum+","+0+",";
		options["totals"] = viewModel.totals.join(",");
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			async: false,
			data: options,
			success: function (data) {
				for(var j = 0; j < viewModel.totals.length; j++) {
					viewModel[viewModel.totals[j]] = data.totals[viewModel.totals[j]];
				}
				viewModel.gridData.pageIndex("0");
				viewModel.gridData.pageSize(viewModel.pageSizeNum);
				var totnum = data.totalElements;
				var pagenum = Math.ceil(totnum/viewModel.pageSizeNum);
				viewModel.gridData.setSimpleData(data.dataDetail);
				viewModel.gridData.setRowUnSelect(0);
				viewModel.gridData.totalPages(pagenum);
				viewModel.gridData.totalRow(totnum);
			}
		});
	}
	viewModel.createGrid(data);
	ko.cleanNode($('#' + areaId)[0]);
	var app = u.createApp({
		el: '#' + areaId,
		model: viewModel
	});
	if (flag == "0") {
		viewModel.gridData.pageIndex("0");
		viewModel.gridData.pageSize("20");
		viewModel.gridData.totalPages("1");
		viewModel.gridData.totalRow("0");
	} else {
		options["sortType"] = JSON.stringify(viewModel.string);
		options["pageInfo"] = 20+","+0+",";
		options["totals"] = viewModel.totals.join(",");
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			async: false,
			data: options,
			success: function (data) {
				for(var j = 0; j < viewModel.totals.length; j++) {
					viewModel[viewModel.totals[j]] = data.totals[viewModel.totals[j]];
				}
				viewModel.gridData.pageIndex("0");
				viewModel.gridData.pageSize("20");
				var totnum = data.totalElements;
				var pagenum = Math.ceil(totnum/20);
				viewModel.gridData.setSimpleData(data.dataDetail);
				viewModel.gridData.setRowUnSelect(0);
				viewModel.gridData.totalPages(pagenum);
				viewModel.gridData.totalRow(totnum);
			}
		});
	}
	return viewModel;
}
//viewModel: createGrid返回的值
//url：获取grid数据的url地址
//options：获取grid数据的参数
function setGrid(viewModel,url,options){
	options["pageInfo"] = 20+","+0+",";
	options["sortType"] = "";
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		async: false,
		data: options,
		success: function (data) {
			for(var j = 0; j < viewModel.totals.length; j++) {
				viewModel[viewModel.totals[j]] = data.totals[viewModel.totals[j]];
			}
			viewModel.gridData.pageIndex("0");
			viewModel.gridData.pageSize("20");
			var totnum = data.totalElements;
			var pagenum = Math.ceil(totnum/20);
			viewModel.gridData.setSimpleData(data.dataDetail);
			viewModel.gridData.setRowUnSelect(0);
			viewModel.gridData.totalPages(pagenum);
			viewModel.gridData.totalRow(totnum);
		}
	});
}
//function setGrid(viewModel,data){
//	for(var j = 0; j < viewModel.totals.length; j++) {
//		viewModel[viewModel.totals[j]] = data.totals[viewModel.totals[j]];
//	}
//	viewModel.gridData.pageIndex("0");
//	viewModel.gridData.pageSize("20");
//	var totnum = data.totalElements;
//	var pagenum = Math.ceil(totnum/20);
//	viewModel.gridData.setSimpleData(data.dataDetail);
//	viewModel.gridData.setRowUnSelect(0);
//	viewModel.gridData.totalPages(pagenum);
//	viewModel.gridData.totalRow(totnum);
//}
// 设置动态生成的搜索、编辑区域的值
// function setAreaData(area_data,set_data) {
// 	for (var i = 0; i < area_data.length; i++) {
// 		switch (area_data[i].type) {
// 			case "input":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
//                 break;
// 			case "number":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "radio":
// 				$("input:radio[value='" + set_data[area_data[i].id] + "']").attr('checked','true');
// 				break;
// 			case "select":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
//             case "checkbox":
// 				if(set_data[area_data[i].id].length > 0){
// 					for(var m = 0; m < set_data[area_data[i].id].length; m++){
// 						$("input[value='" + set_data[area_data[i].id][m] + "']").prop("checked", 'true');
// 					}
// 				}
// 				break;
// 			case "date":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "tree":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id].name);
// 				$("#" + area_data[i].id).attr("name",set_data[area_data[i].id].id);
// 				break;
// 		}
// 	}
// }
// 获取动态生成的搜索、编辑、新增区域的值
function getAreaData(data){
	var area_data = {};
	for(var i = 0; i < data.length; i++){
		switch (data[i].type) {
			case "text":
				var value = $("#" + data[i].id).val();
				area_data[data[i].id] = value;
                break;
			case "int":
				var value = $("#" + data[i].id).val();
				area_data[data[i].id] = value;
				break;
			case "radio":
				var value = $("input[name='" + data[i].id + "']:checked").val();
				area_data[data[i].id] = value;
				break;
			case "combobox":
				var value = $("#" + data[i].id).val();
				area_data[data[i].id] = value;
				break;
            case "checkbox":
				var check_value = [];
				var check_values = $("input[name='" + data[i].id + "']:checked");
				if(check_values.length > 0){
					for(var i = 0; i < check_values.length; i++){
						check_value.push(check_values[i].value);
					}
				}
				area_data[data[i].id] = check_value.join(",");
				break;
			case "datetime":
				var value = $("#" + data[i].id).val();
				area_data[data[i].id] = value;
				break;
			case "decimal":
				var value = $("#" + data[i].id).val();
				area_data[data[i].id] = value;
				break;
			case "treeassist":
				area_data[data[i].id] = $("#" + data[i].id + "-h").val();
				break;
			case "multreeassist":
				area_data[data[i].id] = $("#" + data[i].id + "-h").val();
				break;
			case "doubledecimal":
				var money_values =[];
				for(var j = 1 ; j<3;j++){
					var money_value = $("#" + data[i].id + j).val();
					money_values.push(money_value);
				}
				var money_object = money_values.join(",");
				area_data[data[i].id ] = money_object;
				break;
			case "doubletime":
				var date_values =[];
				for(var k = 1 ; k<3;k++){
					var date_value = $("#" + data[i].id + k).val();
					date_values.push(date_value);
				}
				var date_object = date_values.join(",");
				area_data[data[i].id ] = date_object;
				break;
		}
	}
	return area_data;
}
// 搜索、编辑区域动态生成 createArea（）
// areaType or edit search
// creatData： 创建区域的json数据
// viewId：视图ID
// areaId：创建区域的ID
function createArea(areaType,viewId,areaId) {
	var tokenid = getTokenId();
	var aims = [];
	$.ajax({
        url: "/df/view/getViewDetail.do?tokenid="+tokenid,
        type: "GET",
        dataType: "json",
        async: false,
        data: {
            viewid: viewId
        },
        success: function (data) {
    		viewId = viewId.substring(1,37);
			aims = initArea(data.viewDetail,areaType,viewId,areaId);
		}
	});
	return aims;
}

function initArea(creatData,areaType,viewId,areaId) {
	var n = areaType == "edit" ? 6 : 4;
	var html = '';
	var aims = [];
    for (var i = 0; i < creatData.length; i++) {
        switch (creatData[i].disp_mode) {
			case "text":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="' + creatData[i].id + '" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-8 ip-input-group">' +
								'<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '">' +
							'</div>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "text"
				};
				aims.push(current_aim);
                break;
			case "int":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-8 ip-input-group">' +
								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '">' +
							'</div>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "int"
				};
				aims.push(current_aim);
				break;
			case "radio":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-8 ip-input-group">';
				var m = creatData[i].ref_model.split("+");
				for(var t = 0; t < m.length; t++){
					var k = m[t].split("#");
					if(k.length > 1){
						html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + k[0] + '">' + k[1] + '</label>';
					} else {
						html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="">' + k[0] + '</label>';
					}
				}
				html += '</div></div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "radio"
				};
				aims.push(current_aim);
                break;
			case "combobox":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
								'<div class="col-md-8 ip-input-group">';
				html += '<select class="form-control" class="col-md-8" id="' + creatData[i].id + '-' + viewId + '">';
				var m = creatData[i].ref_model.split("+");
				for(var t = 0; t < m.length; t++){
					var k = m[t].split("#");
					if(k.length > 1){
						html += '<option value="' + k[0] + '">' + k[1] + '</option>';
					} else {
						html += '<option value="">' + k[0] + '</option>';
					}
				}
				html += '</select></div></div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "combobox"
				};
				aims.push(current_aim);
                break;
            case "checkbox":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-8 ip-input-group">';
				
				var m = creatData[i].ref_model.split("+");
				for(var nn = 0; nn < m.length; nn++){
					var kk = m[nn].split("#");
					if(kk.length > 1){
						html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + kk[0] + '">' + kk[1] + '</label>';
					} else {
						html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="">' + kk[0] + '</label>';
					}
				}
				html += '</div></div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "checkbox"
				};
				aims.push(current_aim);
                break;
            case "decimal":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-8 ip-input-group">' +
								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="moneyQuset(this.id)">' +
							'</div>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "decimal"
				};
				aims.push(current_aim);
				break;
            case "doubledecimal":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
							'<div class="col-md-3 ip-input-group">' +
								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)">' +
							'</div>' +
							'<div class="col-md-2 ip-to-font">至</div>'+
							'<div class="col-md-3 ip-input-group">' +
								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '2" onblur="moneyQuset(this.id)">' +
							'</div>' +
						'</div>';

				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "doubledecimal"
				};
				aims.push(current_aim);
				break;
            case "datetime":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].name + '</label>'+
							'<div class="input-group date form_date col-md-8 ip-input-group" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '" data-link-format="yyyy-mm-dd">' +
								'<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="" readonly>' +
								'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
								'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
							'</div>' +
							// '<input type="hidden" id="' + creatData[i].id + '-' + viewId + '" value="" /><br/>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "datetime"
				};
				aims.push(current_aim);
                break;
            case "doubletime":
				html += '<div class="col-md-'+ n +'">'+
							'<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].name + '</label>'+
							'<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '1" data-link-format="yyyy-mm-dd">' +
								'<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '1" type="text" value="" readonly>' +
								// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
								'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
							'</div>' +
							'<div class="col-md-2 ip-to-font">至</div>'+
							'<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '2" data-link-format="yyyy-mm-dd">' +
							'<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="" readonly>' +
								// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
							'</div>' +
							// '<input type="hidden" id="'  + creatData[i].id + '-' + viewId + '" value="" /><br/>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "doubletime"
				};
				aims.push(current_aim);
                break;
			case "treeassist":
				html += '<div class="col-md-'+ n +'">'+
							'<label class="col-md-4 text-right">' + creatData[i].name + '</label>'+
							'<div class="input-group col-md-8 ip-input-group">' +
								'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '">' +
								'<input type="text" id="' + creatData[i].id + '-' + viewId + '-h">' +
								'<span class="input-group-btn">' +
									'<button class="btn btn-default glyphicon glyphicon-list" style="margin-top: -2px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" onclick="showAssitTree(this.id,this.name,0)"></button>' +
								'</span>' +
							'</div>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "treeassist"
				};
				aims.push(current_aim);
				break;
			case "multreeassist":
				html += '<div class="col-md-'+ n +'">'+
							'<label class="col-md-4 text-right">' + creatData[i].name + '</label>'+
							'<div class="input-group col-md-8 ip-input-group">' +
								'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '">' +
								'<input type="text" id="' + creatData[i].id + '-' + viewId + '-h">' +
								'<span class="input-group-btn">' +
									'<button class="btn btn-default glyphicon glyphicon-list" style="margin-top: -2px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" onclick="showAssitTree(this.id,this.name,1)"></button>' +
								'</span>' +
							'</div>' +
						'</div>';
				var current_aim = {
					"id" : creatData[i].id + '-' + viewId,
					"type" : "multreeassist"
				};
				aims.push(current_aim);
				break;
        }
    }
	html += '<button type="submit" class="btn btn-default">查询</button>';
	$("#" + areaId ).append(html);
	$('.form_date').datetimepicker({
		language:  'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});
	return aims;
}
function moneyQuset(id) {
	$("#" + id).val(parseFloat($("#" + id).val()).toFixed(2));
}
function treeChoice(id,data,flag) {
	var success_info = $("#myModalTree")[0];
	var html = '';
	if(!success_info){
		html += '<div class="modal fade" id="myModalTree" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
			'<div class="modal-dialog" role="document">' +
				'<div class="modal-content">' +
					'<div class="modal-header">' +
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
						'<h4 class="modal-title" id="myModalLabel">基础要素</h4>' +
					'</div>' +
					'<div class="modal-body">' +
					    '<label for="" class="col-md-2 text-right" style="width:18%; font-weight:normal">快速定位</label>' +
						'<input type="hidden" id="choiced-node">' +
						'<input type="hidden" id="aim">' +
						'<div class="col-md-4 ip-input-group">' +
							'<input type="text" class="form-control" id="user-write">' +
						'</div>' +
						'<button id="btn-data-tree" class="btn btn-primary top-button" type="button" name="btnFind" onClick="search();" >查找<span class="glyphicon glyphicon-search search-addon"></span></button>' +
						'<button id="nex-data-tree" class="btn btn-default top-button-next" style="margin-left:10px;" type="button" name="btnNext" onClick="next();">下一个</button>' +
						'<div class="tree-area">' +
						'</div>' +
					'</div>' +
					'<div class="modal-footer">' +
						'<div class="radio pull-left" id="isRelationPc"><label><input type="checkbox" name="optionsCheck" value="" onclick="multiCheckTree()" checked>包含下级</label></div>'+
						'<button type="button" class="btn btn-primary" onclick="setSelectedNode();">确定</button>' +
						'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
		$("body").append(html);
	}
	var tree_html="";
    $(".tree-area").html("");
	if(flag == 0){
		//单选树
		$("#isRelationPc").hide();
		tree_html = "<div class='ztree radio_tree' u-meta='"+'{"id":"data-tree","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSetting"}'+"'>";
		$(".tree-area").append(tree_html);
	}else{
		//多选树
		$("#isRelationPc").show();
		tree_html = "<div class='ztree check_tree' u-meta='"+'{"id":"data-tree","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSettingCheck"}'+"'>";
		$(".tree-area").append(tree_html);
	}
	localStorage.setItem("tree_flag",flag);
	initTree(id,data,flag);
}
function initTree(id,data,flag) {
	var viewModel = {
    treeSetting:{
        view:{
            showLine:false,
            selectedMulti:false
        },
        callback:{
			onDblClick:function(e,id,node){
				setSelectedNode();
			}
        }
    },
    treeSettingCheck:{
        view:{
            showLine:false,
            selectedMulti:false
        },
        callback:{
			onDblClick:function(e,id,node){
				setSelectedNode();
			}
        },
        check:{
        	enable: true,
        	chkboxType:{ "Y" : "ps", "N" : "ps" }
        }
    },
    treeDataTable: new u.DataTable({
        meta: {
            'chr_id': {
                'value':""
            },
            'parent_id': {
                'value':""
            },
            'chr_name':{
                'value':""
            }
        }
    })
	};
	ko.cleanNode($('.tree-area')[0]);
	var app = u.createApp({
	    el: '.tree-area',
	    model: viewModel
	});
	viewModel.treeDataTable.setSimpleData(data);
	$("#aim").val(id);
	$("#myModalTree").modal({backdrop: 'static', keyboard: false});
}
function getTreeInputValue(id) {
	var tree_info = $("#" + id).val();
	var space_position = tree_info.indexOf(" ");
	var value = {};
		value["code"] = tree_info.substring("0",space_position);
		value["name"] = tree_info.substring(space_position + 1);
		value["id"] = $("#" + id).attr("name");
	return value;
}
function setSelectedNode () {
    var data_tree = $("#data-tree")[0]['u-meta'].tree;
	var aim = $("#aim").val();
	var flag = localStorage.getItem("tree_flag");
	if(flag == "0") {
		var select_node = data_tree.getSelectedNodes();
	} else {
		var select_node = data_tree.getCheckedNodes(true);
	}
	console.log(select_node);
	var tree_string = "";
	var tree_string_old = "";
	for(var i = 0; i < select_node.length; i++) {
		// tree_string_old += select_node[0].code + " " + select_node[0].name + ",";
		if(i == select_node.length - 1){
			tree_string_old += select_node[0].codename ;
			tree_string += select_node[i].id + "@" + encodeURI(select_node[i].chr_name,"utf-8") + "@" + select_node[i].chr_code;
		} else {
			tree_string_old += select_node[0].codename + ",";
			tree_string += select_node[i].id + "@" + encodeURI(select_node[i].chr_name,"utf-8") + "@" + select_node[i].chr_code + ",";
		}
	}
	$("#"+ aim).val(tree_string_old);
	// if(flag == "1") {
		$("#" + aim + "-h").val(tree_string);
	// }
	$("input[name='optionsCheck']").attr("checked",false);
	$("#myModalTree").modal('hide');
}
function search (){
	var user_write = $("#user-write").val();
	var data_tree = $("#data-tree")[0]['u-meta'].tree;
    var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
    if(search_nodes == null || search_nodes.length == 0){
    	ipInfoJump("无搜索结果");
    }else{
	    data_tree.expandNode(search_nodes[0],true,false,true);
	    data_tree.selectNode(search_nodes[0]);
    }
}
var node_count = 1;
function next (){
	var user_write = $("#user-write").val();
	var data_tree = $("#data-tree")[0]['u-meta'].tree;
	var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
	if(node_count < search_nodes.length){
    	data_tree.selectNode(search_nodes[node_count++]);
	}else{
		node_count = 1;
		ipInfoJump("最后一个");
    	//alert("最后一个");
    }
}

/*
 * 辅助录入树的弹窗 
 * param id 目标输入框的id  element 资源标识    flag单选和多选的标识（0代表单选，1代表有多选框的）
 */
function showAssitTree(id,element,flag) {
	var current_url = location.search;
	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
	$.ajax({
		url: "/df/dic/dictree.do",
		type: "GET",
		async: false,
		data: {
			"element": element,
			"tokenid":tokenid,
			"ajax":"noCache"
		},
		success: function(data){
			treeChoice(id,data.eleDetail,flag);
		}
	});
}
﻿;
$.extend({
	wxcache: {},
	writeCache: function(key, obj) {
		this.wxcache[key] = obj;
	},
	readCache: function(key) {
		return this.wxcache[key] || {};
	},

	getGuid: function(s) {
		function S4() {
			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return(S4() + S4() + S4() + S4());
	},

	isNull: function(target) {
		if(typeof(target) == 'undefined' || null == target || '' === target || 'null' == target || 'undefined' === target) {
			return true;
		} else {
			return false;
		}
	},
	bof: function(str, dev) {
		if($.isNull(str)) return '';
		var strA = str.split(dev);
		return strA[0];
	},
	eof: function(str, dev) {
		if($.isNull(str)) return '';
		var strA = str.split(dev);
		return strA[1];
	},
	/*
	formatMoney: function(s, n) {
		if(!$.isNumeric(s)) return '0.00';
		var firstChar = String(s).charAt(0);
		s = String(s).replace(/[^\d\.]/g, '');

		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1];
		t = "";
		for(i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		s = t.split("").reverse().join("") + "." + r;
		if(firstChar == '-') {
			s = '-' + s;
		}
		return s;
	},
	*/
	htmFormat: function(e, d) {
		var c = !/\W/.test(e) ? b[e] = b[e] || a(document.getElementById(e).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + e.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
		return d ? c(d) : c
	},
	hasHScroll: function(dom) {
		return $(dom)[0].scrollHeight > $(dom)[0].offsetHeight
	},

	inArrayJson: function(array, key, val) {
		var rtn;
		for(var i = 0; i < array.length; i++) {
			var json = array[i];
			var tmpVal = json[key];
			if(!$.isNull(tmpVal)) {
				if(tmpVal == val) {
					rtn = json;
					break;
				}
			}

		}
		return rtn;
	},
	numberInput: function(event, obj) {

	},
	myBrowser: function() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1;
		if(isOpera) {
			return "Opera"
		}; //判断是否Opera浏览器
		if(userAgent.indexOf("Firefox") > -1) {
			return "FF";
		} //判断是否Firefox浏览器
		if(userAgent.indexOf("Chrome") > -1) {
			return "Chrome";
		}
		if(userAgent.indexOf("Safari") > -1) {
			return "Safari";
		} //判断是否Safari浏览器
		if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
			return "IE";
		}; //判断是否IE浏览器
	},
	css2Dom: function(sName) {
		return sName.replace(/^\_/, '').replace(/\_(\w)(\w+)/g, function(a, b, c) {
			return b.toUpperCase() + c.toLowerCase();
		});
	}
});

/*************input 方法扩展***********/
$.fn.numberInput = function() {
	var obj = $(this);
	obj.keypress(function(event) {
		var event = event || window.event;
		if(event.shiftKey) { //或者event.keyCode==16 也是可行的。
			event.cancelBubble = true;
			event.keyCode = 0;
			return false;
		}
		var value = obj.val();
		if(value.length == 0 && event.which == 46) {
			event.preventDefault();
			return;
		}
		if(value.indexOf('.') != -1 && event.which == 46) {
			event.preventDefault();
			return;
		}
		if(value.length > 0 && event.which == 45) {
			event.preventDefault();
			return;
		}
		if(event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46 && event.which != 45) {
			event.preventDefault();
			return;
		}
		if(value.indexOf('.') != -1) {
			var eofV = $.eof(value, '.');
			//console.log(eofV);
			if($.eof(value, '.').length == 2) {
				event.preventDefault();
				return;
			};
		}

	});
	obj.keyup(function(event) {
		var value = obj.val();
		if(/[^\d.]/.test(value)) { //替换非数字字符  
			var temp_amount = value.replace(/[^\d.-]/g, '');
			obj.val(temp_amount);
		}
	});
}
//修改保留两位小数的计算精度不对的问题
Number.prototype.toFixed = function(s){
	var times = Math.pow( 10, s )
	changenum=(parseInt(this * times + 0.5)/ times).toString();
	if(this<0){
		changenum=(parseInt(this * times - 0.5)/ times).toString();
	}
    index=changenum.indexOf(".");
	if(index<0&&s>0){
		changenum=changenum+".";
		for(i=0;i<s;i++){
			changenum=changenum+"0";
		}

	}else {
      index=changenum.length-index;
      for(i=0;i<(s-index)+1;i++){
        changenum=changenum+"0";
      }
	}
	return changenum;
}

/********************************/
//通用get方法请求数据('#mytree',{url:'eleAgency/getAgencyTree',async:true,[checkbox:true],[nameKey:'',idKey:'',pIdKey:'',rootName:''],[onclick:function(event, treeId, treeNode){},OnDblClick:function(event, treeId, treeNode){}]})
$.fn.ufmaTree = function(setting) {
	setting.idKey = setting.idKey || 'id';
	setting.pIdKey = setting.pIdKey || 'pId';
	setting.nameKey = setting.nameKey || 'name';
	setting.rootName = setting.rootName || '';
	setting.async = setting.async || true;

	$tree = $(this);
	if(!$tree.hasClass('ufmaTree')) {
		$tree.addClass('ufmaTree');
	}
	if(!$tree.hasClass('ztree')) {
		$tree.addClass('ztree');
	}
	var tokenid = ufma.getCommonData().token;
	if(tokenid == undefined) {
		tokenid = "";
	}
	if(!$.isNull(setting.url)) {
		if(setting.url.indexOf("?") != -1) {
			setting.url = setting.url + "&ajax=1";
		} else {
			setting.url = setting.url + "?ajax=1";
		}
	} else {
		setting.url = null;
	}

	var treeSetting = {
		async: {
			enable: setting.async,
			type: 'get',
			dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
			contentType: 'application/json; charset=utf-8',
			url: setting.url,
			dataFilter: function(treeId, parentNode, responseData) {
				//console.log(responseData);
				var data = responseData;
				if(responseData.hasOwnProperty('data')) {
					data = responseData.data;
				}
				if(!$.isNull(setting.rootName)) {
					var rootNode = {};
					rootNode[setting.idKey] = "0";
					rootNode[setting.nameKey] = setting.rootName;
					rootNode["open"] = true;
					data.unshift(rootNode);
				}
				if($.isNull(data)) return false;
				for(var i = 0; i < data.length; i++) {
					data[i]["open"] = true;
				}
				return data;
			}
		},
		view: {
			showLine: false,
			showIcon: false
		},
		check: {
			enable: function() {
				if(setting.hasOwnProperty('checkbox'))
					return setting.checkbox;
				else return false;
			}()
		},

		data: {
			simpleData: {
				enable: true,
				idKey: setting.idKey,
				pIdKey: setting.pIdKey,
				rootPId: 0
			},

			key: {
				name: setting.nameKey
			},

			keep: {
				leaf: true
			}
		},
		callback: {
			/*onAsyncError: function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
				ufma.alert(XMLHttpRequest);
			},*/
			beforeClick: setting.beforeSelect || null,
			onClick: setting.onClick || null,
			onDblClick: setting.onDblClick || null,
			onCheck: setting.onCheck || null

		}
	};
	//return $.fn.zTree.init($tree, setting);

	var $tree;
	if(setting.hasOwnProperty('url') && !$.isNull(setting.url)) {
		ufma.ajaxDef(setting.url, 'get', {}, function(result) {
			setting.data = result.data || [];
		});
	}
	$tree = $.fn.zTree.init($tree, treeSetting, setting.data || []);
	$tree.expandAll(true);
	return $tree;
};
/**************datatable***********************/

$.fn.ufmaDataTable = function(setting) {
	var $obj = $(this);
	var data = setting.data;
	setting.callbackDraw = setting.callbackDraw || function() {};
	setting.initComplete = setting.initComplete || function() {};
	var vm = {};
	vm.id = $obj.attr('id');
	
	vm.buttons = {};
	vm.data = {};
	vm.emptyData = {};
	function anilyzeComuns() {
		vm.thead = ''
		vm.formatRow = '';
		var cols = setting.columns;
		for(var i = 0; i < cols.length; i++) {
			var col = cols[i];
			if(!$.isNull(col.key)) {
				vm.emptyData[col.key] = '';
			}
			var width = col.hasOwnProperty('width') ? ' width=' + col.width : '';
			var align = col.hasOwnProperty('align') ? ' align=' + col.align : '';
			var colname = col.hasOwnProperty('name') ? col.name : '';
			var textindent = '';
			if(col.hasOwnProperty('textIndent') && (col.textIndent || col.textIndent == 'true')) {
				textindent = ' style="text-indent:<%=textIndent%>"';
			}
			//theader
			var th = '<th ' + width + '>' + colname + '</th>';
			vm.thead += th;
			//tbody
			vm.formatRow += '<td name="' + col.key + '" type="' + col.type + '" class="';
			if(col.hasOwnProperty('edit') && (col.edit == 'true' || col.edit)) {
				if(col.hasOwnProperty('type') && col.type == 'money') {
					vm.formatRow += 'cell-edit moneyEdit';
				} else if(col.hasOwnProperty('type') && col.type == 'textInput') {
					vm.formatRow += 'cell-edit textInputEdit';
				}
				//vm.formatRow += 'cell-edit';
			}
			vm.formatRow += '"';
			vm.formatRow += align + '>';
			if(col.hasOwnProperty('type') && col.type == 'indexcolumn') {
				vm.formatRow += '<%=rowno%>';
			} else if(col.hasOwnProperty('type') && col.type == 'money') {
				if(col.hasOwnProperty('key') && col.key != '') {
					vm.formatRow += '<div id="<%=trid%>_"' + col.key + '_label class="cell-label money-label" style="text-align:right;"><%=' + col.key + '%></div>';
					if(col.hasOwnProperty('edit') && (col.edit == 'true' || col.edit)) {
						vm.formatRow += '<div class="cell-control"><input id="<%=trid%>_"' + col.key + '_input class="cell-input" inputType="' + col.type + '" type="text" name="' + col.key + '" value="<%=' + col.key + '%>"/></div>';
					}
				}
			} else if(col.hasOwnProperty('type') && col.type == 'textInput') {
				if(col.hasOwnProperty('key') && col.key != '') {
					vm.formatRow += '<div id="<%=trid%>_"' + col.key + '_label class="cell-label textInput-label"><%=' + col.key + '%></div>';
					if(col.hasOwnProperty('edit') && (col.edit == 'true' || col.edit)) {
						vm.formatRow += '<div class="cell-control"><input id="<%=trid%>_"' + col.key + '_input class="cell-input textInput-cell" inputType="' + col.type + '" type="text" name="' + col.key + '" value="<%=' + col.key + '%>"  maxlength="100"/></div>';
					}
				}
			} else if(col.hasOwnProperty('type') && col.type == 'combox') {
				if(col.hasOwnProperty('edit') && (col.edit == 'true' || col.edit)) {
					vm.formatRow += '<div class="cell-control visible"><div id="' + col.key + '-<%=guid%>" name="' + col.key + '" class="ufma-combox cell-input" valueField="id" textField="name"></div></div>';
				}
			} else if(col.hasOwnProperty('type') && col.type == 'treecombox') {
				if(col.hasOwnProperty('edit') && (col.edit == 'true' || col.edit)) {
					vm.formatRow += '<div class="cell-control visible"><div class="ufma-treecombox" valueField="id" textField="name" id="' + col.key + '-<%=guid%>" name="' + col.key + '" class="cell-input"></div></div>';
				}
			} else {
				if(col.hasOwnProperty('key') && col.key != '') {
					vm.formatRow += '<div class="cell-label" ' + textindent + '><%=' + col.key + '%></div>';
				}
			}
			//buttons
			if(col.hasOwnProperty('buttons')) {
				vm.formatRow += '<span class="actions">'
				var buttons = col.buttons;

				$.each(buttons, function(name, obj) {
					vm.buttons[name] = obj;
					vm.formatRow += '<span action="' + name + '" class="wxbtn glyphicon none ' + obj.class + '"></span>';
				});
				vm.formatRow += '</span>';
			}
			vm.formatRow += '</td>';
		}
	}
	function formatTbodyRow(rowData) {
		var lockClass = '';
		if(setting.hasOwnProperty('lock')) {
			var lock = setting.lock;
			if(lock.hasOwnProperty('filter')) {
				var lockFilter = lock.filter;
				if(lockFilter(rowData)) {
					lockClass = ' class="locked ' + lock.class + '"';
				};
			}
		}
		if(setting.hasOwnProperty('textIndentFilter')) {
			var indent = setting.textIndentFilter;
			var textindext = indent(rowData);
			rowData.textIndent = textindext;
		}
		var trid = vm.id + '_tr_' + $.getGuid();
		if(setting.hasOwnProperty('idField') && setting.idField != '' && !$.isNull(rowData[setting.idField])) {
			trid = vm.id + '_tr_' + rowData[setting.idField];
		}
		rowData.trid = trid;
		vm.data[trid] = rowData;

		return '<tr id="' + trid + '" ' + lockClass + ' pid="' + rowData[setting.pId] + '">' + $.htmFormat(vm.formatRow, rowData) + '</tr>'
	}

	function initBody(dataRows) {
		var $table = $('#' + vm.id + ' .ufma-datatable');
		var $tbody = $('<tbody></tbody>').appendTo($table);
		var tbodyHtml = '';
		var len = dataRows.length;
		for(var i = 0; i < len; i++) {
			var rowData = dataRows[i];
			rowData.rowno = i + 1;
			rowData.guid = $.getGuid();
			var rowHtml = formatTbodyRow(rowData);
            tbodyHtml = tbodyHtml + rowHtml;
        }
        $tbody.html(tbodyHtml)
        setting.callbackDraw();
		function process(row) {
			var rowHtml = formatTbodyRow(row);
			var $row = $(rowHtml).appendTo($tbody);
        }
        
        $('#' + vm.id + ' .money-label').each(function() {
            var tmpText = $(this).html().replaceAll(',', '');
            $(this).closest('.cell-edit').find(".cell-input").val(tmpText);
            tmpText = $.formatMoney(tmpText, 2);
            $(this).html(tmpText);
        });
        $('#' + vm.id + ' .textInput-label').each(function() {
            var tmpText = $(this).html();
            $(this).closest('.cell-edit').find(".cell-input").val(tmpText);
            $(this).html(tmpText);
        });
        
        $('#' + vm.id + ' input[inputType="money"]').each(function() {
            $(this).numberInput();
        });

        $('#' + vm.id + ' .money-label').each(function() {
            if($(this).text() == '0.00') {
                $(this).html('');
            }
        });
		var timeId = setTimeout(function() {
			clearTimeout(timeId);
            setting.initComplete();
            for(var i=0;i<$tbody.find('tr').length;i++){
				bindEvent($tbody.find('tr').eq(i));
            }
            bindTableEvent();
		}, 30);
	}

	///////////
	function drowRowCtr($row) {
		var trid = $row.attr('id');
		$('#' + trid + ' .ufma-combox:not(.ufma-treecombox)').each(function() {
			if($(this).attr('aria-new') != 'false') $(this).ufmaCombox();
		});

		$('#' + trid + ' .ufma-treecombox').each(function() {
			if($(this).attr('aria-new') != 'false') {
				$(this).ufmaTreecombox({
					leafRequire: true,
					readOnly: false
				});
			}
		});
	}

	function bindEvent($row) {
		drowRowCtr($row);
		var trid = $row.attr('id');
		var buttons = $row.find('.wxbtn');
		$.each(buttons, function(obj) {
			var $tr = $(this).closest('tr');
			var btn = vm.buttons[$(this).attr('action')];
			var rowdata = vm.data[$tr.attr('id')];

			if(btn.hasOwnProperty('filter')) {
				if(!btn.filter(rowdata)) {
					$(this).remove();
				} else {
					$(this).removeClass('none');
				}
			}
		});
		$('#' + trid + ':not(.locked)').on('click', '.moneyEdit', function(e) {
            if($(this).val() == '0.00') $(this).val('');
            if($(this).find('.cell-label').length) {

                $(this).find('.cell-control').css('display', 'block');
                $(this).find('.cell-input').focus();
                if($(this).find(".cell-input").val() == "0") {
                    $(this).find(".cell-input").val("");
                }
                $(this).find('.cell-label').css('display', 'none');
            }
            var $scollCtrl = $obj.parent();
            var $td = $(e.target).closest('td');
            if($td.offset().left + $td.outerWidth(true) - $scollCtrl.offset().left > $scollCtrl.width()) {
                $scollCtrl.scrollLeft($td.offset().left + $td.outerWidth(true) - $scollCtrl.offset().left - $scollCtrl.width() + 20);
                $('.ufma-combox-popup').attr('popup-lock', 'false');
                $td.find('.ufma-combox').trigger('click');
            } else if($td.offset().left < 0) {

                $scollCtrl.scrollLeft($scollCtrl.scrollLeft() + $td.offset().left - $scollCtrl.offset().left - 20);
                $('.ufma-combox-popup').attr('popup-lock', 'false');
                $td.find('.ufma-combox').trigger('click');
            };

        });
        $('#' + trid + ':not(.locked)').on('click', '.textInputEdit', function(e) {
            if($(this).find('.cell-label').length) {

                $(this).find('.cell-control').css('display', 'block');
                $(this).find('.cell-input').focus();
                $(this).find('.cell-label').css('display', 'none');
            }
            var $scollCtrl = $obj.parent();
            var $td = $(e.target).closest('td');
            if($td.offset().left + $td.outerWidth(true) - $scollCtrl.offset().left > $scollCtrl.width()) {
                $scollCtrl.scrollLeft($td.offset().left + $td.outerWidth(true) - $scollCtrl.offset().left - $scollCtrl.width() + 20);
                $('.ufma-combox-popup').attr('popup-lock', 'false');
                $td.find('.ufma-combox').trigger('click');
            } else if($td.offset().left < 0) {
                $scollCtrl.scrollLeft($scollCtrl.scrollLeft() + $td.offset().left - $scollCtrl.offset().left - 20);
                $('.ufma-combox-popup').attr('popup-lock', 'false');
                $td.find('.ufma-combox').trigger('click');
            };

        });
        $('#' + trid + ':not(.locked)').on('blur', '.cell-input', function(e) {
            e.stopPropagation();
            var $cell = $(this).closest('td');
            if($cell.find('.cell-label').length) {
                var $label = $cell.find('.cell-label');
                var $control = $cell.find('.cell-control');
                $control.css('display', 'none');
                $label.css('display', 'block');
                var lblVal = $.formatMoney($(this).val());
                if(lblVal == '0.00') lblVal = '';
                $label.html(lblVal);
            }

        });
        //非金额输入框
        $('#' + trid + ':not(.locked)').on('blur', '.textInput-cell', function(e) {
            e.stopPropagation();
            //CWYXM-10737指标编制-摘要列，指标调整、调剂-备注列前台应限制长度，目前未限制保存报错--zsj
            $(this).closest('td').addClass('commonShow');
            $(this).closest('td').attr('title', $(this).val());
            var $cell = $(this).closest('td');
            if($cell.find('.cell-label').length) {
                var $label = $cell.find('.cell-label');
                var $control = $cell.find('.cell-control');
                $control.css('display', 'none');
                $label.css('display', 'block');
                var lblVal = $(this).val();
                $label.html(lblVal);
            }
        });
        $('#' + trid + ' td').on('click', '.wxbtn', function(e) {
            var $tr = $(this).closest('tr');
            var rowdata = vm.data[$tr.attr('id')];
            var btn = vm.buttons[$(this).attr('action')];
            btn.action(e, $tr, rowdata);
            return false;
        });
	}

	function bindTableEvent() {
		$obj.on('mouseover', 'tr', function(e) {
			e.stopPropagation();
			if($(this).hasClass('locked')) {
				return false;
			}
			$(this).addClass('hover');
		});
		$obj.on('mouseout', 'tr', function(e) {
			if($(this).hasClass('locked')) {
				return false;
			}
			e.stopPropagation();
			$(this).removeClass('hover');
		});
	}
    
	anilyzeComuns();
	$obj.html('');
	var thead = '<thead>' + vm.thead + '</thead>';
	$('<table class="ufma-datatable">' + thead + '</table>').appendTo($obj);

    
	if(data != undefined && data != null) {
		initBody(data);
	} else if(setting.url != '') {
		var argu = setting.params || {};
		var callback = function(result) {
			initBody(result.data);
		}
		ufma.get(setting.url, argu, callback);
	};

	vm.getData = function(trid) {
		return vm.data[trid];
	}
	vm.getTrData = function(trid) {
		var rowData = {};
		$('#' + trid + ' td').each(function() {

			var name = $(this).attr('name');
			var type = $(this).attr('type');
			if(name != '') {
				var val = '';
				if(type == 'money') {
					val = $(this).find('input').val();
				} else if(type == 'combox' || type == 'treecombox') {
					val = $(this).find('.ufma-combox-value').val();
				}
				if(type == 'textInput') {
					val = $(this).find('input').val();
				} else {
					val = $(this).text();
				}
				rowData[name] = val;
			}
		});
		return rowData;
	}
    
	vm.getTableData = function() {
		var tableData = [];
		$('#' + vm.id + ' tbody tr:not(locked)').each(function() {
			var trid = $(this).attr('id');
			var rowData = vm.getTrData(trid);
			tableData.push(rowData);
		});
		return tableData;
	}
	// vm.createRow = function() {
	// 	var $tbody = $('#' + vm.id + ' .ufma-datatable tbody');
	// 	var rowData = vm.emptyData;
	// 	rowData.rowno = $tbody.find('tr').length + 1;
	// 	rowData.guid = $.getGuid();
	// 	var rowHtml = formatTbodyRow(rowData);
	// 	var $row = $(rowHtml).appendTo($tbody);
	// 	bindEvent($row);
	// 	return $row;
	// }
	return vm;
};
/******************combox******************************/

$.fn.ufmaCombox = function(setting) {
	var $obj = $(this);
	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var id = $obj.attr('id');
	setting = setting || {};
	setting.id = id;
	setting = $.extend({}, $.readCache(id), setting);
	setting.onchange = setting.onchange || function() {};
	var bNew = false;
	if($obj.attr('aria-new') != 'false') {
		bNew = true;
		buildList();
		$.writeCache(id, setting);
	}

	function buildList() {

		setting.id = setting.id || $obj.attr('id');
		setting.id = setting.id || 'ufma-combox-' + $.getGuid();
		setting.url = setting.url || $obj.attr('url');
		setting.url = setting.url || '';
		setting.name = setting.name || $obj.attr('name');
		setting.textField = setting.textField || $obj.attr('textField');
		setting.valueField = setting.valueField || $obj.attr('valueField');
		setting.placeholder = setting.placeholder || $obj.attr('placeholder');
		setting.screen = setting.screen || $obj.attr('screen');
		setting.placeholder = setting.placeholder || '';
		setting.icon = setting.icon || $obj.attr('icon');
		setting.icon = setting.icon || '';
		if(!$.isNull(setting.readOnly) && (setting.readOnly || setting.readOnly == 'true')) {
			setting.readOnly = '';
		} else {
			setting.readOnly = 'readonly unselectable=on';
		}

		setting.data = setting.data || [];

		$.writeCache(setting.id, setting);

		$obj.removeAttr('url');

		var boxHtml = '<div class="ufma-combox-border">';
		var leftMargin = '';
		if(setting.icon != '') {
			boxHtml += '<span class="icon ' + setting.icon + '"></span>'
			leftMargin = '18px';
		}
		boxHtml += '<span class="ufma-combox-inputLi" style="margin-left:' + leftMargin + ';"><input id="' + setting.id + '_input" class="ufma-combox-input" ' + setting.readOnly + ' type="text" placeholder="' + setting.placeholder + '" autocomplete="off"></span>';
		boxHtml += '<span class="uf-combox-clear icon-close"></span>';
		boxHtml += '<span id="' + setting.id + '_btn" class="ufma-combox-btn"><b></b></span>';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_value" class="ufma-combox-value" name="' + setting.name + '">';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_text" class="ufma-combox-text">';
		boxHtml += '</div>';
		var boxList = $(boxHtml).appendTo($obj).trigger('create');
		$('<div id="' + setting.id + '_popup" class="ufma-combox-popup"><ul class="ufma-combox-list" id="' + setting.id + '_list"></ul></div>').appendTo('body');

		function setPopupPos() {
			var popupWidth = $('#' + setting.id).width();
			var posX = $('#' + setting.id).offset().left;
			var posY = $('#' + setting.id).offset().top + $('#' + setting.id).outerHeight(true);
			var popupTop = $('#' + setting.id).outerHeight(true) + 2;
			var popupOffsetWidth = parseInt($('#' + setting.id + ' .ufma-combox-border').css('border-left-width')) == 0 ? 2 : 0;
			var maxWidth = $(window).width() - posX - 20;
			$('#' + setting.id + '_popup').hide().css({
				'min-width': popupWidth + popupOffsetWidth + 'px',
				'max-width': maxWidth + 'px',
				'top': posY + 'px',
				'left': posX + 'px'
			});
		}
		setPopupPos();

		function showPopup() {
			var $popup = $('#' + setting.id + '_popup');

			if($popup.attr('popup-lock') != 'true') {
				$popup.attr('popup-lock', 'true');
				$('#' + setting.id).addClass('ufma-combox-open');
				setPopupPos();
				var val = $('#' + setting.id + '_value').val();

				$('#' + setting.id + ' .ufma-combox-btn').addClass('open');
				$popup.slideDown(200, function() {

				});
				$('#' + setting.id + '_popup .ufma-combox-list-item.selected').removeClass('selected');
				$('#' + setting.id + '_popup .ufma-combox-list-item[option-value="' + val + '"]').addClass('selected');
			}
		}

		function hidePopup() {
			var $popup = $('#' + setting.id + '_popup');
			$popup.attr('popup-lock', 'true');
			$popup.slideUp(200, function() {
				$(this).attr('popup-lock', 'false');
				$('#' + setting.id).removeClass('ufma-combox-open');
				if($('#' + id + '_input').val() == '') {
					clear();
				}
			});
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('open');

		}

		function afterSelect() {

			$popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				return false;
			}

			var item = $('#' + setting.id + '_popup .ufma-combox-list-item.selected');
			if(item.length > 0) {
				var itemData = $.readCache(setting.id + '_item' + item.attr('option-value'));
				$('#' + setting.id + '_value').val(itemData[setting.valueField]);
				if(itemData.enabled == '0') {
					$('#' + setting.id + '_input').addClass('uf-red').val(itemData[setting.textField] + '(已停用)');
				} else {
					$('#' + setting.id + '_input').removeClass('uf-red').val(itemData[setting.textField]);
				}
				$('#' + setting.id + '_text').val(itemData[setting.textField]);

				onchange(itemData);
			}
			hidePopup();
		}

		function onchange(item) {
			var val = $('#' + setting.id + '_value').val();
			var text = $('#' + setting.id + '_text').val();
			var vt = $('#' + setting.id + '_input').val();

			var change = setting.onchange;

			if(!change) {
				change = function() {}
			};
			setting.onchange = change;
			change(item);
		}

		function keyboardSelect(key) {

			/*			if(key != 8) {
							showPopup();
							if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
								return false;
							}
						}*/

			function selectItem(item) {
				if(item.length > 0 && item.hasClass('ufma-combox-list-item')) {
					$('#' + setting.id + '_popup .ufma-combox-list-item.selected').removeClass('selected');
					item.addClass('selected');
				} else {
					return false;
				}
				//$('#'+setting.id+' .ufma-combox-input').focus();
			}
			var item = $('#' + setting.id + '_popup .ufma-combox-list-item.selected');

			if(item.length == 0 && (key == 40 || key == 38)) {
				item = $('#' + setting.id + '_popup .ufma-combox-list-item:first-child');
				if(item.length > 0) {
					item.addClass('selected');
				}
				selectItem(item);
				return false;
			}

			function doSearch(bNext) {
				var $input = $('#' + setting.id + '_input');
				var inputValue = $input.val();
				//guohx 增加参数screen 传参的时候，就是要筛选功能，当输入关键字后只过滤出包含该关键字的列表项 20200721 ysdp20200708140426
				if (setting.screen) {
					if(inputValue != '') {
						$input.attr('temValue', inputValue);
						var cacheId = setting.id + 'SearchIdx';
						var iSearch = uf.getCache(cacheId) || 0;
						if(bNext) {
							iSearch = parseInt(iSearch) + 1;
						}
						var items = $('#' + setting.id + '_popup').find('.ufma-combox-list-item[option-value*="' + inputValue + '"],.ufma-combox-list-item[option-text*="' + inputValue + '"]');
						$('#' + setting.id + '_popup').find('ul li').each(function() {
							$(this).addClass('hide');
						});
						if(items.length > 0) {
							if(iSearch >= items.length) iSearch = 0;
							uf.setCache(cacheId, iSearch);
							$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
							$(items[iSearch]).addClass('selected');
							$('#' + setting.id + '_popup').find('.ufma-combox-list-item[option-value*="' + inputValue + '"],.ufma-combox-list-item[option-text*="' + inputValue + '"]').removeClass('hide');
							$('#' + setting.id + '_popup').scrollTop(0);
						} else {
							uf.setCache(cacheId, 0);
							$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
							$('#' + setting.id + '_popup').find('ul li').each(function() {
								$(this).removeClass('hide');
							});
						}
						// $input.focus();
					} else {
						$('#' + setting.id + '_popup').find('ul li').each(function () {
							$(this).removeClass('hide');
						});
					}
				} else {
					if(inputValue != '') {
						$input.attr('temValue', inputValue);
						var cacheId = setting.id + 'SearchIdx';
						var iSearch = uf.getCache(cacheId) || 0;
						if(bNext) {
							iSearch = parseInt(iSearch) + 1;
						}
	
						var items = $('#' + setting.id + '_popup').find('.ufma-combox-list-item[option-value*="' + inputValue + '"],.ufma-combox-list-item[option-text*="' + inputValue + '"]');
						if(items.length > 0) {
							if(iSearch >= items.length) iSearch = 0;
							uf.setCache(cacheId, iSearch);
							$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
							$(items[iSearch]).addClass('selected');
							$('#' + setting.id + '_popup').scrollTop($(items[iSearch]).prevAll('.ufma-combox-list-item').length * 28);
						} else {
							uf.setCache(cacheId, 0);
							$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
						}
						//$input.focus();
					}
				}
				}
			switch(key) {
				case 40:
					item = item.next();
					selectItem(item);
					break;
				case 38:
					item = item.prev();
					selectItem(item);
					break;
				case 13:
					if(item.length > 0) {
						//$treeObj.checkNode(node,!node.checked,true);
						afterSelect();
						hidePopup();
					}
					break;
				case 114:
					doSearch(true);
					break;
				default:
					var timeId = setTimeout(function() {
						doSearch(false);
						clearTimeout(timeId);
					}, 30);
					break;
			}
		}
		//绑定事件
		var $popup = $('#' + setting.id + '_popup');
		$('#' + setting.id).on('click', function(e) {
			e.stopPropagation();
			if($(this).hasClass('ufma-combox-disabled')) return false;
			if($(e.target).is('.uf-combox-clear')) {
				clear();
				//修改点击下拉框“×”时，将相关联的下拉框内容一起清空
				//onChange();
				e.stopPropagation();
				return false;
			}
			var $input = $('#' + setting.id + ' .ufma-combox-input');
			if($input.attr('readonly')) {
				$input.blur()
			} else {
				$input.focus().select();
			}
			showPopup();
			keyboardSelect();
		});
		$('#' + setting.id ).on('click', ' .ufma-combox-btn', function(e) {
			e.stopPropagation();
			if($(this).hasClass('open')){
				hidePopup();
			}else{
				showPopup();
			}
		})
		$('#' + setting.id + '_popup').on('click', '.ufma-combox-list-item', function(e) {
			e.stopPropagation();
			$('#' + setting.id + '_popup .ufma-combox-list-item.selected').removeClass('selected');
			$(this).addClass('selected');
			afterSelect();
		});
		window.mosedownhandlerclick = false
		$('#' + setting.id + '_input').on('blur', function(e) {
			if(window.mosedownhandlerclick) {
				hidePopup();
			}
		});
		$('#' + setting.id + '_input').on('keydown', function(e) {
			if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;
			if($popup.attr('popup-lock') != 'true') {
				showPopup();
			} else {

				var key = e.keyCode;
				if(key == 114) {
					$.stopDefault(e);
				}
				keyboardSelect(key);
			}
		});
		ufma.domClickHideEle(setting.id, function() {
			hidePopup();
		});
		$obj.attr('aria-new', 'false');
	}

	function clear() {

		$('#' + id + '_value').val('');
		$('#' + id + '_input').val('');
		$('#' + id + '_text').val('');
	}

	function initList(data) {
		setting.data = data;
		setting.itemCount = data.length;
		clear();
		var $list = $('#' + setting.id + '_list');
		$list.html('');
		var listHtml = '';
		for(var i = 0; i < data.length; i++) {
			var item = data[i];
			var cacheID = setting.id + '_item' + item[setting.valueField];
			$.writeCache(cacheID, item);

			listHtml += '<li class="ufma-combox-list-item" option-text="' + item[setting.textField] + '" option-value="' + item[setting.valueField] + '">' + item[setting.textField] + (item.enabled == 0 ? '<span class="uf-red">(已停用)</span>' : '') + '</li>';
		}
		$(listHtml).appendTo($list);
		var initComplete = setting.initComplete || function() {};
		var timeId = setTimeout(function() {
			initComplete($('#' + id));
		}, 300);

	}

	if(!$.isEmptyObject(setting)) {
		if(!bNew) {
			setting = $.extend({}, $.readCache(id), setting);
		}
		if($.isNull(setting.url) && !$.isNull(setting.data)) {
			initList(setting.data);
		} else {
			ufma.get(setting.url, '', function(result) {
				initList(result.data);
			});
		}
	}
	var vm = {
		setting: $.extend({}, $.readCache(id), setting),
		itemCount: setting.itemCount,
		getValue: function() {
			return $('#' + id + '_value').val();
		},
		getText: function() {
			return $('#' + id + '_text').val();
		},
		getItemById: function(val) {
			var cachid = id + '_item' + val;
			return $.readCache(cachid);
		},
		clear: function() {
			$('#' + id + '_value').val('');
			$('#' + id + '_text').val('');
			$('#' + id + '_input').val('');
		},
		setValue: function(val, text) {
			if($.isNull(val)) return false;
			if($('#' + id + '_popup .ufma-combox-list-item[option-value="' + val + '"]').length == 0) {
				vm.clear();
				return false;
			}
			var oldVal = $('#' + id + '_value').val();
			$('#' + id + '_value').val(val);
			if(!$.isNull(text)) {
				$('#' + id + '_text').val(text);
				$('#' + id + '_input').val(text);
				$('#' + id + '_input').attr('title', text);
			} else {
				var item = vm.getItemById(val);
				var text = item[vm.setting.textField];
				$('#' + id + '_text').val(text);
				$('#' + id + '_input').val(text);
				$('#' + id + '_input').attr('title', text);
			}
			if(oldVal != val) {
				var change = vm.setting.onchange;
				var item = vm.getItemById(val);
				if(!$.isNull(item)) change(item);
			}
		},
		val: function(value) {
			var tmpItem = vm.getItemById(value);
			if($('#' + id + '_popup .ufma-combox-list-item[option-value="' + value + '"]').length == 0) {
				this.clear();
				return false;
			}
			var text = tmpItem[vm.setting['textField']];
			vm.setValue(value, text);
		},
		select: function(idx) {
			if(idx > this.itemCount - 1) {
				return -1;
			} else {
				var item = vm.setting.data[idx];
				this.setValue(item[vm.setting.valueField], item[vm.setting.textField]);
			}
		},
		setEnabled: function(ft) {
			if(ft) {
				$('#' + id).removeClass('ufma-combox-disabled');
			} else {
				$('#' + id).addClass('ufma-combox-disabled');
			}

		}
	}
	return vm;
};

//////////////treecombox/////////////////////////
$.fn.ufmaTreecombox = function(setting) {
	var $obj = $(this);

	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var id = $obj.attr('id');
	setting = setting || {};
	setting.id = id;
	if(!$.isNull($.readCache(id))) {
		setting = $.extend({}, $.readCache(id), setting);
	}
	$obj.addClass('ufma-combox');
	var bNew = false;
	if($obj.attr('aria-new') != 'false') {
		bNew = true;
		buildList();
		$.writeCache(id, setting);
	}

	function buildList() {

		setting.id = setting.id || $obj.attr('id');
		setting.url = setting.url || $obj.attr('url');
		setting.name = setting.name || $obj.attr('name');
		setting.textField = setting.textField || $obj.attr('textField');
		setting.valueField = setting.valueField || $obj.attr('valueField');
		setting.placeholder = setting.placeholder || $obj.attr('placeholder');
		setting.placeholder = setting.placeholder || '';
		setting.icon = setting.icon || $obj.attr('icon');
		setting.icon = setting.icon || '';
		setting.popupWidth = setting.popupWidth || 3;
		setting.expand = setting.expand;

		if(!$.isNull(setting.expand)) {
			setting.expand = setting.expand;
		} else {
			setting.expand = true;
		}

		if(!$.isNull(setting.readOnly) && !(setting.readOnly || setting.readOnly == 'true')) {
			setting.readOnly = '';
		} else {
			setting.readOnly = 'readonly unselectable=on';
		}
		if(!setting.hasOwnProperty('leafRequire')) {
			setting.leafRequire = true;
		}
		setting.data = setting.data || [];
		$.writeCache(setting.id, setting);

		$obj.removeAttr('url');

		var boxHtml = '<div class="ufma-combox-border">';
		var leftMargin = '';
		if(setting.icon != '') {
			boxHtml += '<span class="icon ' + setting.icon + '"></span>'
			leftMargin = '18px';
		}
		boxHtml += '<span class="ufma-combox-inputLi" style="margin-left:' + leftMargin + '"><input id="' + setting.id + '_input" class="ufma-combox-input" ' + setting.readOnly + ' type="text" placeholder="' + setting.placeholder + '" autocomplete="off"></span>';
		boxHtml += '<span class="uf-combox-clear icon-close"></span>';
		boxHtml += '<span id="' + setting.id + '_btn" class="ufma-combox-btn"><b></b></span>';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_value" class="ufma-combox-value" name="' + setting.name + '">';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_text" class="ufma-combox-text">';
		boxHtml += '</div>';
		var boxList = $(boxHtml).appendTo($obj).trigger('create');
		$('<div id="' + setting.id + '_popup" class="ufma-combox-popup"><ul id="' + setting.id + '_tree"></ul></div>').appendTo('body');

		function setPopupPos() {
			var popupWidth = $('#' + setting.id).width();
			var posX = $('#' + setting.id).offset().left;
			var posY = $('#' + setting.id).offset().top + $('#' + setting.id).outerHeight(true);
			var popupTop = $('#' + setting.id).outerHeight(true) + 2;
			var popupOffsetWidth = parseInt($('#' + setting.id + ' .ufma-combox-border').css('border-left-width')) == 0 ? 2 : 0;
			var maxWidth = $(window).width() - posX - 20;
			$('#' + setting.id + '_popup').hide().css({
				'min-width': popupWidth + popupOffsetWidth + 'px',
				'max-width': maxWidth + 'px',
				'top': posY + 'px',
				'left': posX + 'px'
			});
		}
		var $tree = $('#' + setting.id + '_tree');
		var $treeObj = $tree.ufmaTree({ /*url:setting.url,*/
			async: false,
			checkbox: false,
			nameKey: setting.textField,
			idKey: setting.valueField,
			beforeClick: function(treeId, treeNode, clickFlag) {
				if(setting.beforeSelect) {
					return setting.beforeSelect(treeNode);
				}
				return true;
			},
			onClick: function(event, treeId, treeNode) {
				event.stopPropagation();
				if(setting.leafRequire && treeNode.isParent) return false;
				treeKeyboardSelect(13);
			}
		});

		setting.tree = $treeObj;

		function showPopup() {
			var $popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				$popup.attr('popup-lock', 'true');
				$('#' + setting.id).addClass('ufma-combox-open');
				setPopupPos();
				var id = $('#' + setting.id + '_value').val();
				var nodes = $treeObj.getNodesByParam(setting.valueField, id, null);
				if($.isNull(nodes)) return false;
				var node = nodes[0];
				if(!$.isNull(node)) {
					if(!node.isParent) {
						$treeObj.selectNode(node);
					}
				};
				$('#' + setting.id + ' .ufma-combox-btn').addClass('open');
				$popup.slideDown(200, function() {

				});
				setting.tree.expandAll(true);
			}
		}

		function hidePopup() {
			var $popup = $('#' + setting.id + '_popup');
			$popup.attr('popup-lock', 'true');
			$popup.slideUp(200, function() {
				$(this).attr('popup-lock', 'false');
				$('#' + setting.id).removeClass('ufma-combox-open');
				if($('#' + id + '_input').val() == '') {
					clear();
				}
			});
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('open');

		}

		function afterTreeSelect() {
			$popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				return false;
			}
			var nodes = $treeObj.getSelectedNodes();
			if(nodes.length > 0) {
				var node = nodes[0];
				$treeObj.selectNode(node);
				$('#' + setting.id + '_value').val(node[setting.valueField]);
				$('#' + setting.id + '_input').val(node[setting.textField]);
				$('#' + setting.id + '_text').val(node[setting.textField]);
				$('#' + setting.id + '_input').attr('title', node[setting.textField]);
				onchange(node);
			}
			hidePopup();
		}

		function onchange(node) {
			var val = $('#' + setting.id + '_value').val();
			var text = $('#' + setting.id + '_text').val();
			var vt = $('#' + setting.id + '_input').val();
			var change = setting.onchange;
			if(!change) {
				change = function() {}
			};
			setting.onchange = change;
			change(node);
		}

		function treeKeyboardSelect(key) {

			/*			if(key != 8) {
							showPopup();
							if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
								return false;
							}
						}*/

			function selectNode(node) {
				if(!$.isNull(node)) {
					node = $treeObj.selectNode(node);
				}
				$('#' + setting.id + '_input').focus();
				return node;
			}
			var nodes = $treeObj.getSelectedNodes(),
				node;
			if(nodes.length == 0 && (key == 40 || key == 37 || key == 38 || key == 39)) {
				var nodes = $treeObj.getNodes();
				if(nodes.length > 0) {
					node = $treeObj.selectNode(nodes[0]);
					$('#' + setting.id + '_input').focus();
				}
			} else {
				node = nodes[0];
			}

			function doSearch(bNext) {
				if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;

				var $input = $('#' + setting.id + '_input');
				var inputValue = $input.val();
				if(inputValue != '') {
					$(this).attr('temValue', inputValue);
					var cacheId = setting.id + 'SearchIdx';
					var iSearch = uf.getCache(cacheId) || 0;
					if(bNext) {
						iSearch = parseInt(iSearch) + 1;
					}
					var istb = true
					//检索树
					function filter(node) {
						var val = node[setting.valueField];
						var txt = node[setting.textField];
						var len = inputValue.length;
						/*bug75669---zsj---修改会计科目搜索时：从前往后匹配问题*/
						var valcompierData = val.substr(0, len);
						var txtcompierData = txt.substr(0, len);
						if(istb == true) {
							return(valcompierData == inputValue || txtcompierData == inputValue);
						} else {
							return(val.indexOf(inputValue) >= 0 || txt.indexOf(inputValue) >= 0)
						}
					}
					var nodes = $treeObj.getNodesByFilter(filter, false);

					if(nodes.length <= 0) {
						istb = false
						nodes = $treeObj.getNodesByFilter(filter, false)
					}
					if(nodes.length > 0) {
						if(iSearch >= nodes.length) iSearch = 0;
						uf.setCache(cacheId, iSearch);
						$treeObj.selectNode(nodes[iSearch]);
					} else {
						uf.setCache(cacheId, 0);
						var nodes = $treeObj.getSelectedNodes();
						if(nodes.length > 0) {
							$treeObj.cancelSelectedNode(nodes[0]);
						}
					}
					$input.focus();
				}
			}
			switch(key) {
				case 40:
					node = node.getNextNode();
					node = selectNode(node);

					break;
				case 37:

					var tmpNode = node.getParentNode();
					node = selectNode(tmpNode);
					break;
				case 38:
					var tmpNode = node.getPreNode();
					node = selectNode(tmpNode);
					break;
				case 39:
					if(node.children != null && node.children != undefined) {
						node = node.children[0];
						node = selectNode(node);
					}
					break;
				case 13:
					if(!$.isNull(node)) {
						if(setting.beforeSelect) {
							if(!setting.beforeSelect(node)) {
								return false;
							};
						}
						//$treeObj.checkNode(node,!node.checked,true);
						if(setting.leafRequire && node.isParent) return false;
						afterTreeSelect();
						hidePopup();
						return false;
					}
					break;
				case 114:
					doSearch(true);
					break;
				default:
					var timeId = setTimeout(function() {
						doSearch(false);
						clearTimeout(timeId);
					}, 30);
					break;
			}
		}

		//绑定事件
		$('#' + setting.id).on('click', function(e) {
			if($(this).hasClass('ufma-combox-disabled')) return false;
			if($(e.target).is('.uf-combox-clear')) {
				clear();
				//修改点击下拉框“×”时，将相关联的下拉框内容一起清空
				//onchange();
				e.stopPropagation();
				return false;
			}
			//

			var $input = $('#' + setting.id + ' .ufma-combox-input');
			//			$input[$input.attr('readonly') ? 'blur' : 'focus']();
			if($input.attr('readonly')) {
				$input.blur()
			} else {
				$input.focus().select();
			}
			showPopup();
			treeKeyboardSelect();
		});
		var $popup = $('#' + setting.id + '_popup');
		$('#' + setting.id + '_input').on('keydown', function(e) {

			if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;
			if($popup.attr('popup-lock') != 'true') {
				showPopup();
			} else {
				var key = e.keyCode;
				if(key == 114) {
					$.stopDefault(e);
				}
				if(key == 8 && $(this).val() == '') {
					$.stopDefault(e);
				}
				treeKeyboardSelect(key);
			}
		});
		$('#' + setting.id + '_input').on('input', function(e) {
			if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;
			if($popup.attr('popup-lock') != 'true') {
				showPopup();
			} else {
				treeKeyboardSelect(228);
			}
		});
		$('#' + setting.id ).on('click', ' .ufma-combox-btn', function(e) {
			e.stopPropagation();
			if($(this).hasClass('open')){
				hidePopup();
			}else{
				showPopup();
			}
		})
		window.mosedownhandlerclick = false
		$('#' + setting.id + '_input').on('blur', function(e) {
			if(window.mosedownhandlerclick) {
				hidePopup();
			}
		});
		/*$('#' + setting.id + '_input').on('blur', function (e) {
			var nodes = $treeObj.getSelectedNodes();
			if(nodes.length<=0){
				$(this).val('')
			}
		});*/
		ufma.domClickHideEle(setting.id, function() {
			hidePopup();
		});
		$obj.attr('aria-new', 'false');
	}

	function clear() {
		$('#' + id + '_value').val('');
		$('#' + id + '_input').val('');
		$('#' + id + '_text').val('');
		var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
		treeObj.cancelSelectedNode();
	}

	function complete() {
		var timeId = setTimeout(function() {
			var initComplete = setting.initComplete || function() {};
			initComplete($('#' + id));
			clearTimeout(timeId);
		}, 300);
	}
	if(bNew && ((setting.hasOwnProperty('data') && setting.data.length > 0) || (!$.isNull(setting.url)))) {
		clear();
	}
	if(!$.isEmptyObject(setting)) {
		var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
		var settingTree = treeObj.setting;

		if(!bNew) {
			setting = $.extend({}, $.readCache(id), setting);
			settingTree.data.simpleData['idKey'] = setting.valueField || settingTree.data.simpleData['idKey'];
			settingTree.data.key['name'] = setting.textField || settingTree.data.key['name'];
		}
		settingTree.async.url = setting.url;

		if(!$.isNull(setting.url)) {
			//$.fn.zTree.init($(id+"_tree"), settingTree);
			var callback = function(result) {
				$.fn.zTree.init($('#' + id + '_tree'), settingTree, result.data);
				/*var initComplete = setting.initComplete || function() {};
				initComplete($('#' + id));*/
				complete();
			};
			ufma.get(setting.url, {}, callback);
		} else if(setting.hasOwnProperty('data') && setting.data.length >= 0) {
			$.fn.zTree.init($('#' + id + '_tree'), settingTree, setting.data);
			/*var initComplete = setting.initComplete || function() {};
			initComplete($('#' + id));*/
			complete();
		}

		if(setting.expand) {
			treeObj.expandAll(true);
		}
		var nodes = treeObj.getNodes();
		if(nodes.length > 0) {
			treeObj.selectNode(nodes[0]);
		}
	}

	var vm = {
		setting: $.extend({}, $.readCache(id), setting),

		getValue: function() {
			return $('#' + id + '_value').val();
		},
		getText: function() {
			return $('#' + id + '_text').val();
		},
		getItemById: function(val) {
			var tree = $.fn.zTree.getZTreeObj($('#' + id + '_tree'));
			if($.isNull(tree)) return false;
			var nodes = tree.getNodesByParam(this.setting.valueField, val, null);
			if(nodes.length == 0) return -1;
			else return nodes[0];
		},
		setValue: function(val, text) {
			if($.isNull(val)) return false;
			var oldVal = $('#' + id + '_value').val();

			$('#' + id + '_value').val(val);
			$('#' + id + '_text').val(text);
			$('#' + id + '_input').val(text);
			$('#' + id + '_input').attr('title', text);
			if(oldVal != val) {
				var change = setting.onchange;
				if($.isNull(change)) return false;
				var node = this.getItemById(val);
				change(node);
			}
		},
		val: function(value) {
			if($.isNull(value)) return false;
			var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
			var tmpNode = treeObj.getNodeByParam(vm.setting['valueField'], value, null);
			if($.isNull(tmpNode)) {
				var nodes = treeObj.getNodes();
				if(nodes.length > 0) {
					tmpNode = nodes[0];
				} else {
					return false;
				}
			}
			var text = tmpNode[vm.setting['textField']];
			if(tmpNode.isParent && vm.setting.leafRequire) {
				var leafFirst = tmpNode.children[0];
				value = leafFirst.id;
				text = leafFirst.name;
			}
			vm.setValue(value, text);
		},
		select: function(idx) {
			function setVal() {
				var tree = vm.setting.tree;
				if($.isNull(tree)) return false;
				var tId = id + '_tree_' + idx;
				var node = tree.getNodeByTId(tId);
				vm.setValue(node[vm.setting.valueField], node[vm.setting.textField]);
				return true;
			}
			vm.times = 0;
			var intID = setInterval(function() {
				if(setVal()) {
					vm.times = 0;
					clearTimeout(intID);
					intID = null;
				} else {
					vm.times = vm.times + 1;
					if(vm.times >= 10) {
						clearTimeout(intID);
						intID = null;
					}
				}
			}, 300);
		}
	}
	return vm;
};
$.fn.ufmaCombox2 = function(setting) {
	var $obj = $(this);
	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var id = $obj.attr('id');
	setting = setting || {};
	$obj.addClass('ufma-combox2');
	var bNew = false;
	if($obj.attr('aria-new') != 'false') {
		bNew = true;
		buildList();
	}

	function buildList() {

		setting.id = setting.id || $obj.attr('id');
		setting.id = setting.id || 'ufma-combox-' + $.getGuid();
		setting.url = setting.url || $obj.attr('url');
		setting.url = setting.url || '';
		setting.name = setting.name || $obj.attr('name');
		setting.textField = setting.textField || $obj.attr('textField');
		setting.valueField = setting.valueField || $obj.attr('valueField');
		setting.placeholder = setting.placeholder || $obj.attr('placeholder');
		setting.placeholder = setting.placeholder || '';
		setting.icon = setting.icon || $obj.attr('icon');
		setting.readOnly = setting.readOnly || false;
		if(!$.isNull(setting.readOnly) && !(setting.readOnly || setting.readOnly == 'true')) {
			setting.readOnly = '';
		} else {
			setting.readOnly = 'readonly=readonly';
		}
		setting.icon = setting.icon || '';
		setting.data = setting.data || [];
		$.writeCache(setting.id, setting);

		$obj.removeAttr('url');

		var boxHtml = '<div class="ufma-combox-border" style="border:none;">';
		var leftMargin = '';
		if(setting.icon != '') {
			boxHtml += '<span class="icon-border"><span class="icon ' + setting.icon + '"></span></span>'
			leftMargin = '18px';
		}
		boxHtml += '<span class="ufma-combox-inputLi" style="margin-left:' + leftMargin + ';"><input id="' + setting.id + '_input" ' + setting.readOnly + ' class="ufma-combox-input" type="text" placeholder="' + setting.placeholder + '" autocomplete="off"></span>';

		boxHtml += '<span id="' + setting.id + '_btn" class="ufma-combox-btn hide"><b></b></span>';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_value" class="ufma-combox-value" name="' + setting.name + '">';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_text" class="ufma-combox-text">';
		boxHtml += '</div>';
		var boxList = $(boxHtml).appendTo($obj).trigger('create');

		var popupHtml = '<div id="' + setting.id + '_popup" class="ufma-combox-popup ufma-combox-popup2">';
		/*		if(setting.readOnly == '') {
					popupHtml += '<span class="ufma-combox-inputLi" style="margin:8px 8px 2px 8px;border:1px #d9d9d9 solid;padding:2px 4px 5px;"><input id="' + setting.id + '_input" class="ufma-combox-input" type="text" placeholder="输入搜索内容" autocomplete="off"></span>';
				}*/
		popupHtml += '<ul class="ufma-combox-list" id="' + setting.id + '_list"></ul>';
		popupHtml += '</div>';
		$(popupHtml).appendTo('body');

		function setPopupPos() {
			var popupWidth = $('#' + setting.id).width();
			var posX = $('#' + setting.id).offset().left;
			var posY = $('#' + setting.id).offset().top + $('#' + setting.id).outerHeight(true);
			var popupTop = $('#' + setting.id).outerHeight(true) + 2;
			var popupOffsetWidth = parseInt($('#' + setting.id + ' .ufma-combox-border').css('border-left-width')) == 0 ? 2 : 0;
			var maxWidth = $(window).width() - posX - 20;
			$('#' + setting.id + '_popup').hide().css({
				'min-width': popupWidth + popupOffsetWidth + 'px',
				'max-width': maxWidth + 'px',
				'top': posY + 'px',
				'left': posX + 'px'
			});
		}
		setPopupPos();

		function showPopup() {
			var $popup = $('#' + setting.id + '_popup');

			if($popup.attr('popup-lock') != 'true') {
				$popup.attr('popup-lock', 'true');
				setPopupPos();
				var val = $('#' + setting.id + '_value').val();
				$('#' + setting.id + ' .ufma-combox-btn').removeClass('hide');
				$('#' + setting.id + ' .ufma-combox-btn').addClass('open');
				$popup.slideDown(200, function() {

				});
				$popup.find('.ufma-combox-list-item.selected').removeClass('selected');
				$popup.find('.ufma-combox-list-item[option-value="' + val + '"]').addClass('selected');
			}
		}

		function hidePopup() {
			var $popup = $('#' + setting.id + '_popup');
			$popup.attr('popup-lock', 'true');
			$popup.slideUp(200, function() {
				$(this).attr('popup-lock', 'false');
			});
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('open');
			$('#' + setting.id + ' .ufma-combox-btn').addClass('hide');
			if($('#' + id + '_input').val() == '') {
				clear();
			}
		}

		function afterSelect() {

			$popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				return false;
			}

			var item = $popup.find('.ufma-combox-list-item.selected');
			if(item.length > 0) {
				var itemData = $.readCache(setting.id + '_item' + item.attr('option-value'));
				$('#' + setting.id + '_value').val(itemData[setting.valueField]);
				if(itemData.enabled == '0') {
					$('#' + setting.id + '_input').addClass('uf-red').val(itemData[setting.textField] + '(已停用)');
				} else {
					$('#' + setting.id + '_input').removeClass('uf-red').val(itemData[setting.textField]);
				}

				$('#' + setting.id + '_text').val(itemData[setting.textField]);

				onchange(itemData);
			}
			hidePopup();
		}

		function onchange(item) {
			var val = $('#' + setting.id + '_value').val();
			var text = $('#' + setting.id + '_text').val();
			var vt = $('#' + setting.id + '_input').val();

			var change = setting.onchange;

			if(!change) {
				change = function() {}
			};
			setting.onchange = change;
			change(item);
		}

		function keyboardSelect(key) {

			/*			if(key != 8) {
							showPopup();
							if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
								return false;
							}
						}*/

			function selectItem(item) {
				if(item.length > 0 && item.hasClass('ufma-combox-list-item')) {
					$('#' + setting.id + '_popup .ufma-combox-list-item.selected').removeClass('selected');
					item.addClass('selected');
				} else {
					return false;
				}
				//$('#'+setting.id+' .ufma-combox-input').focus();
			}
			var item = $('#' + setting.id + '_popup .ufma-combox-list-item.selected');

			if(item.length == 0 && (key == 40 || key == 38)) {
				item = $('#' + setting.id + '_popup .ufma-combox-list-item:first-child');
				if(item.length > 0) {
					item.addClass('selected');
				}
				selectItem(item);
				return false;
			}

			function doSearch(bNext) {
				var $input = $('#' + setting.id + '_input');
				var inputValue = $input.val();
				if(inputValue != '') {
					$input.attr('temValue', inputValue);
					var cacheId = setting.id + 'SearchIdx';
					var iSearch = uf.getCache(cacheId) || 0;
					if(bNext) {
						iSearch = parseInt(iSearch) + 1;
					}

					var items = $('#' + setting.id + '_popup').find('.ufma-combox-list-item[option-value*="' + inputValue + '"],.ufma-combox-list-item[option-text*="' + inputValue + '"]');
					if(items.length > 0) {
						if(iSearch >= items.length) iSearch = 0;
						uf.setCache(cacheId, iSearch);
						$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
						$(items[iSearch]).addClass('selected');
						$(items[iSearch]).parents(".ufma-combox-popup2").scrollTop($(items[iSearch]).index()*$(items[iSearch]).outerHeight())
					} else {
						uf.setCache(cacheId, 0);
						$('#' + setting.id + '_popup').find('.ufma-combox-list-item.selected').removeClass('selected');
					}
					//$input.focus();
				}
			}

			switch(key) {
				case 40:
					item = item.next();
					selectItem(item);
					break;
				case 38:
					item = item.prev();
					selectItem(item);
					break;
				case 13:
					if(item.length > 0) {
						//$treeObj.checkNode(node,!node.checked,true);
						afterSelect();
						hidePopup();
					}
					break;
				case 114:
					doSearch(true);
					break;
				default:
					var timeId = setTimeout(function() {
						doSearch(false);
						clearTimeout(timeId);
					}, 30);
					break;
			}
		}
		var $popup = $('#' + setting.id + '_popup');
		//绑定事件
		$('#' + setting.id).on('mouseover', function() {
			if($(this).hasClass('ufma-combox-disabled')) return false;
			$(this).addClass('hover');
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('hide');
		});
		$('#' + setting.id).on('mouseout', function() {
			if($(this).hasClass('ufma-combox-disabled')) return false;
			$(this).removeClass('hover');
			$('#' + setting.id + ' .ufma-combox-btn').addClass('hide');
		});
		$('#' + setting.id).on('click', function(e) {
			if($(e.target).is('.uf-combox-clear')) {
				clear();
				//修改点击下拉框“×”时，将相关联的下拉框内容一起清空
				//onchange();
				e.stopPropagation();
				return false;
			}
			e.stopPropagation();
			if($(this).hasClass('ufma-combox-disabled')) return false;
			var $input = $('#' + setting.id + '_input');
			//			$input[$input.attr('readonly') ? 'blur' : 'focus']();
			if($input.attr('readonly')) {
				$input.blur()
			} else {
				$input.focus().select();
			}
			showPopup();
			keyboardSelect();
		});
		$popup.on('click', '.ufma-combox-list-item', function(e) {
			e.stopPropagation();
			$popup.find('.ufma-combox-list-item.selected').removeClass('selected');
			$(this).addClass('selected');
			afterSelect();
		});
		$('#' + setting.id + '_input').on('keydown', function(e) {
			if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;
			if($popup.attr('popup-lock') != 'true') {
				showPopup();
			} else {
				var key = e.keyCode;
				if(key == 114) {
					$.stopDefault(e);
				}
				keyboardSelect(key);
			}
		});
		$('#' + setting.id ).on('click', ' .ufma-combox-btn', function(e) {
			e.stopPropagation();
			if($(this).hasClass('open')){
				hidePopup();
			}else{
				showPopup();
			}
		})
		window.mosedownhandlerclick = false
		$('#' + setting.id + '_input').on('blur', function(e) {
			if(window.mosedownhandlerclick) {
				hidePopup();
			}
		});
		ufma.domClickHideEle(setting.id, function() {
			hidePopup();
		});
		$obj.attr('aria-new', 'false');
	}

	function initList(data) {
		setting.data = data;
		setting.itemCount = data.length;
		clear();
		var $list = $('#' + setting.id + '_list');
		$list.html('');
		var listHtml = '';
		for(var i = 0; i < data.length; i++) {
			var item = data[i];
			var cacheID = setting.id + '_item' + item[setting.valueField];
			$.writeCache(cacheID, item);

			listHtml += '<li class="ufma-combox-list-item" option-text="' + item[setting.textField] + '" option-value="' + item[setting.valueField] + '">' + item[setting.textField] + (item.enabled == 0 ? '<span class="uf-red">(已停用)</span>' : '') + '</li>'
		}
		$(listHtml).appendTo($list);
		var initComplete = setting.initComplete || function() {};
		var timeId = setTimeout(function() {
			initComplete($('#' + id));
			clearTimeout(timeId);
		}, 300);

	}

	function clear() {
		$('#' + id + '_value').val('');
		$('#' + id + '_input').val('');
		$('#' + id + '_text').val('');
		$('#' + id + '_input').removeAttr('title');
	}

	if(!$.isEmptyObject(setting)) {
		if(!bNew) {
			setting = $.extend({}, $.readCache(id), setting);
		}
		if($.isNull(setting.url) && !$.isNull(setting.data)) {
			initList(setting.data);
		} else {
			$ufma.get(setting.url, '', function(result) {
				initList(result.data);
			});
		}
	}
	var vm = {
		setting: $.extend({}, $.readCache(id), setting),
		itemCount: setting.itemCount,
		getValue: function() {
			return $('#' + id + '_value').val();
		},
		getText: function() {
			return $('#' + id + '_text').val();
		},
		getItemById: function(val) {
			var cachid = id + '_item' + val;
			return $.readCache(cachid);
		},
		clear: function() {
			$('#' + id + '_value').val('');
			$('#' + id + '_text').val('');
			$('#' + id + '_input').val('');
			$('#' + id + '_input').removeAttr('title');
		},
		setValue: function(val, text) {
			if($.isNull(val)) return false;
			if($('#' + id + '_popup .ufma-combox-list-item[option-value="' + val + '"]').length == 0) {
				this.clear();
				return false;
			}
			var oldVal = $('#' + id + '_value').val();
			$('#' + id + '_value').val(val);
			if(!$.isNull(text)) {
				$('#' + id + '_text').val(text);
				$('#' + id + '_input').val(text);
				$('#' + id + '_input').attr('title', text);
			} else {
				var item = this.getItemById(val);
				var text = item[this.setting.textField];
				$('#' + id + '_text').val(text);
				$('#' + id + '_input').val(text);
				$('#' + id + '_input').attr('title', text);
			}
			if(oldVal != val) {
				var change = this.setting.onchange;
				var item = this.getItemById(val);
				change(item);
			}
		},
		val: function(value) {
			var tmpItem = vm.getItemById(value);
			if($('#' + id + '_popup .ufma-combox-list-item[option-value="' + value + '"]').length == 0) {
				this.clear();
				return false;
			}
			var text = tmpItem[vm.setting['textField']];
			vm.setValue(value, text);
		},
		select: function(idx) {
			if(idx > this.itemCount - 1) {
				return -1;
			} else {
				var item = this.setting.data[idx];
				this.setValue(item[this.setting.valueField], item[this.setting.textField]);
			}
		}
	}
	return vm;
};

$.fn.ufmaTreecombox2 = function(setting) {
	var $obj = $(this);

	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var id = $obj.attr('id');
	setting = setting || {};
	//setting = $.extend({},$.readCache(id),setting);	
	$obj.addClass('ufma-combox ufma-combox2');
	var bNew = false;
	if($obj.attr('aria-new') != 'false') {
		bNew = true;
		buildList();
	}

	function buildList() {

		setting.id = setting.id || $obj.attr('id');
		setting.url = setting.url || $obj.attr('url');
		setting.name = setting.name || $obj.attr('name');
		setting.textField = setting.textField || $obj.attr('textField');
		setting.valueField = setting.valueField || $obj.attr('valueField');
		setting.placeholder = setting.placeholder || $obj.attr('placeholder');
		setting.placeholder = setting.placeholder || '';
		setting.icon = setting.icon || $obj.attr('icon');
		setting.icon = setting.icon || '';
		setting.readOnly = setting.readOnly || false;
		if(!$.isNull(setting.readOnly) && !(setting.readOnly || setting.readOnly == 'true')) {
			setting.readOnly = '';
		} else {
			setting.readOnly = 'readonly';
		}
		if(!setting.hasOwnProperty('leafRequire')) {
			setting.leafRequire = true;
		}

		setting.data = setting.data || [];
		$.writeCache(setting.id, setting);

		$obj.removeAttr('url');

		var boxHtml = '<div class="ufma-combox-border" style="border:none;">';
		var leftMargin = '';
		if(setting.icon != '') {
			boxHtml += '<span class="icon-border"><span class="icon ' + setting.icon + '"></span></span>'
			leftMargin = '18px';
		}
		boxHtml += '<span class="ufma-combox-inputLi" style="margin-left:' + leftMargin + ';"><input id="' + setting.id + '_input" class="ufma-combox-input" ' + setting.readOnly + ' type="text" placeholder="' + setting.placeholder + '" autocomplete="off"></span>';
		boxHtml += '<span id="' + setting.id + '_btn" class="ufma-combox-btn hide"><b></b></span>';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_value" class="ufma-combox-value" name="' + setting.name + '">';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_text" class="ufma-combox-text">';
		boxHtml += '</div>';
		var boxList = $(boxHtml).appendTo($obj).trigger('create');

		var popupHtml = '<div id="' + setting.id + '_popup" class="ufma-combox-popup ufma-combox-popup2">';
		/*		if(setting.readOnly == '') {
					popupHtml += '<span class="ufma-combox-inputLi" style="margin:8px 8px 2px 8px;border:1px #d9d9d9 solid;padding:2px 4px 5px;"><input id="' + setting.id + '_input" class="ufma-combox-input" type="text" placeholder="输入搜索内容" autocomplete="off"></span>';
				}*/
		popupHtml += '<ul id="' + setting.id + '_tree"></ul>';
		popupHtml += '</div>';
		$(popupHtml).appendTo('body');

		function setPopupPos() {
			var popupWidth = $('#' + setting.id).width();
			var posX = $('#' + setting.id).offset().left;
			var posY = $('#' + setting.id).offset().top + $('#' + setting.id).outerHeight(true);
			var popupTop = $('#' + setting.id).outerHeight(true) + 2;
			var popupOffsetWidth = parseInt($('#' + setting.id + ' .ufma-combox-border').css('border-left-width')) == 0 ? 2 : 0;
			var maxWidth = $(window).width() - posX - 20;
			$('#' + setting.id + '_popup').hide().css({
				'min-width': popupWidth + popupOffsetWidth + 'px',
				'max-width': maxWidth + 'px',
				'top': posY + 'px',
				'left': posX + 'px'
			});
		}

		var $tree = $('#' + setting.id + '_tree');

		var $treeObj = $tree.ufmaTree({ /*url:setting.url,*/
			async: false,
			checkbox: false,
			nameKey: setting.textField,
			idKey: setting.valueField,
			onClick: function(event, treeId, treeNode) {
				event.stopPropagation();
				if(setting.leafRequire && treeNode.isParent) return false;
				//treeKeyboardSelect(13);

				var treeObj = $.fn.zTree.getZTreeObj(treeId);
				if(treeNode.hasOwnProperty("isPermis") && treeNode.isPermis == "N") {
					treeObj.cancelSelectedNode(treeNode);
					return false;
				}
				showPopup();
				if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
					return false;
				}
				if(!$.isNull(treeNode)) {
					afterTreeSelect();
					hidePopup();
				}

			}
		});
		setting.tree = $treeObj;

		function showPopup() {
			var $popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				$popup.attr('popup-lock', 'true');
				setPopupPos();
				var id = $('#' + setting.id + '_value').val();
				var nodes = $treeObj.getNodesByParam(setting.valueField, id, null);
				if($.isNull(nodes)) return false;
				var node = nodes[0];
				if(!$.isNull(node)) {
					//					if(!node.isParent) {
					//						$treeObj.selectNode(node);
					//					}

					if(!(node.hasOwnProperty("isPermis") && node.isPermis == "N")) {
						$treeObj.selectNode(node);
					}
				};
				$('#' + setting.id + ' .ufma-combox-btn').removeClass('hide');
				$('#' + setting.id + ' .ufma-combox-btn').addClass('open');
				$popup.slideDown(200, function() {

				});
			}
		}

		function hidePopup() {
			var $popup = $('#' + setting.id + '_popup');
			$popup.attr('popup-lock', 'true');
			$popup.slideUp(200, function() {
				$(this).attr('popup-lock', 'false');
			});
			//$('#' + setting.id + '_input').val('');
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('open');
			$('#' + setting.id + ' .ufma-combox-btn').addClass('hide');
			if($('#' + id + '_input').val() == '') {
				clear();
			}
		}

		function afterTreeSelect() {
			$popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				return false;
			}
			var nodes = $treeObj.getSelectedNodes();
			if(nodes.length > 0) {
				var node = nodes[0];
				$treeObj.selectNode(node);

				$('#' + setting.id + '_value').val(node[setting.valueField]);
				$('#' + setting.id + '_input').val(node[setting.textField]);
				$('#' + setting.id + '_text').val(node[setting.textField]);
				$('#' + setting.id + '_input').attr('title', node[setting.textField]);
				onchange(node);
			}
			hidePopup();
		}

		function onchange(node) {
			var val = $('#' + setting.id + '_value').val();
			var text = $('#' + setting.id + '_text').val();
			var vt = $('#' + setting.id + '_input').val();
			var change = setting.onchange;
			if(!change) {
				change = function() {}
			};
			setting.onchange = change;
			change(node);
		}

		function treeKeyboardSelect(key) {

			/*			if(key != 8) {
							showPopup();
							if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
								return false;
							}
						}*/

			function selectNode(node) {
				if(!$.isNull(node)) {
					node = $treeObj.selectNode(node);
				}
				$('#' + setting.id + '_input').focus();
				return node;
			}
			var nodes = $treeObj.getSelectedNodes(),
				node;
			if(nodes.length == 0 && (key == 40 || key == 37 || key == 38 || key == 39)) {
				var nodes = $treeObj.getNodes();
				if(nodes.length > 0) {
					node = $treeObj.selectNode(nodes[0]);
					$('#' + setting.id + '_input').focus();
				}
			} else {
				node = nodes[0];
			}

			function doSearch(bNext) {
				if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;

				var $input = $('#' + setting.id + '_input');
				var inputValue = $input.val();
				if(inputValue != '') {
					$(this).attr('temValue', inputValue);
					var cacheId = setting.id + 'SearchIdx';
					var iSearch = uf.getCache(cacheId) || 0;
					if(bNext) {
						iSearch = parseInt(iSearch) + 1;
					}
					//检索树
					function filter(node) {
						return(node[setting.valueField].indexOf(inputValue) > -1 || node[setting.textField].indexOf(inputValue) > -1);
					}
					var nodes = $treeObj.getNodesByFilter(filter, false);

					if(nodes.length > 0) {
						if(iSearch >= nodes.length) iSearch = 0;
						uf.setCache(cacheId, iSearch);
						$treeObj.selectNode(nodes[iSearch]);
					} else {
						uf.setCache(cacheId, 0);
						var nodes = $treeObj.getSelectedNodes();
						if(nodes.length > 0) {
							$treeObj.cancelSelectedNode(nodes[0]);
						}
					}
					$input.focus();
				}
			}
			switch(key) {
				case 40:
					node = node.getNextNode();
					node = selectNode(node);

					break;
				case 37:

					var tmpNode = node.getParentNode();
					node = selectNode(tmpNode);
					break;
				case 38:
					var tmpNode = node.getPreNode();
					node = selectNode(tmpNode);
					break;
				case 39:
					if(node.children != null && node.children != undefined) {
						node = node.children[0];
						node = selectNode(node);
					}
					break;
				case 13:
					if(node != null && node != undefined) {
						//$treeObj.checkNode(node,!node.checked,true);
						if(setting.leafRequire && node.isParent) return false;
						afterTreeSelect();
						hidePopup();
					}
					break;
				case 114:
					doSearch(true);
					break;
				default:
					var timeId = setTimeout(function() {
						doSearch(false);
						clearTimeout(timeId);
					}, 30);
					break;
			}
		}
		//绑定事件
		$('#' + setting.id).on('mouseover', function() {
			if($(this).hasClass('ufma-combox-disabled')) return false;
			$(this).addClass('hover');
			$('#' + setting.id + ' .ufma-combox-btn').removeClass('hide');
		});
		$('#' + setting.id).on('mouseout', function() {
			if($(this).hasClass('ufma-combox-disabled')) return false;
			$(this).removeClass('hover');
			if(!$('#' + setting.id + ' .ufma-combox-btn').hasClass('open')) {
				$('#' + setting.id + ' .ufma-combox-btn').addClass('hide');
			}
		});
		$('#' + setting.id).on('click', function(e) {
			e.stopPropagation();
			if($(this).hasClass('ufma-combox-disabled')) return false;
			if($(e.target).is('.uf-combox-clear')) {
				clear();
				//修改点击下拉框“×”时，将相关联的下拉框内容一起清空
				//onchange();
				e.stopPropagation();
				return false;
			}
			var $input = $('#' + setting.id + '_input');
			//			$input[$input.attr('readonly') ? 'blur' : 'focus']();
			if($input.attr('readonly')) {
				$input.blur()
			} else {
				$input.focus().select();
			}
			showPopup();
			treeKeyboardSelect();
		});
		var $popup = $('#' + setting.id + '_popup');
		$('#' + setting.id + '_input').on('keydown', function(e) {
			if($('#' + setting.id).hasClass('ufma-combox-disabled')) return false;
			if($popup.attr('popup-lock') != 'true') {
				showPopup();
			} else {
				var key = e.keyCode;
				if(key == 114) {
					$.stopDefault(e);
				}
				treeKeyboardSelect(key);
			}
		});
		$('#' + setting.id ).on('click', ' .ufma-combox-btn', function(e) {
			e.stopPropagation();
			if($(this).hasClass('open')){
				hidePopup();
			}else{
				showPopup();
			}
		})
		window.mosedownhandlerclick = false
		$('#' + setting.id + '_input').on('blur', function(e) {
			if(window.mosedownhandlerclick) {
				hidePopup();
			}
		});
		ufma.domClickHideEle(setting.id, function() {
			hidePopup();
		});
		$obj.attr('aria-new', 'false');
	}

	function clear() {
		$('#' + id + '_value').val('');
		$('#' + id + '_input').val('');
		$('#' + id + '_input').val('');
		$('#' + id + '_text').val('');
	}
	if(setting.hasOwnProperty('data') || (setting.hasOwnProperty('url') && setting.url != '')) {
		clear();
	}

	function complete() {
		var timeId = setTimeout(function() {
			var initComplete = setting.initComplete || function() {};
			initComplete($('#' + id));
			clearTimeout(timeId);
		}, 300);
	}

	if(!$.isEmptyObject(setting)) {
		var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
		var settingTree = treeObj.setting;
		if(!bNew) {
			setting = $.extend({}, $.readCache(id), setting);
			settingTree.data.simpleData['idKey'] = setting.valueField || settingTree.data.simpleData['idKey'];
			settingTree.data.key['name'] = setting.textField || settingTree.data.key['name'];
		}

		settingTree.async.url = setting.url;
		if(!$.isNull(setting.url)) {
			//$.fn.zTree.init($(id+"_tree"), settingTree);
			var callback = function(result) {
				$.fn.zTree.init($('#' + id + '_tree'), settingTree, result.data);
				/*var initComplete = setting.initComplete || function() {};
				initComplete($('#' + id));*/
				complete();
			};
			ufma.get(setting.url, {}, callback);
			// } else if(setting.hasOwnProperty('data') && setting.data.length > 0) {
		} else if(setting.hasOwnProperty('data')) {
			$.fn.zTree.init($('#' + id + '_tree'), settingTree, setting.data);
			/*var initComplete = setting.initComplete || function() {};
			initComplete($('#' + id));*/
			complete();
		}
		treeObj.expandAll(true);
		var nodes = treeObj.getNodes();
		if(nodes.length > 0) {
			treeObj.selectNode(nodes[0]);
		}
	}

	var vm = {
		setting: $.extend({}, $.readCache(id), setting),
		getValue: function() {
			return $('#' + id + '_value').val();
		},
		getText: function() {
			return $('#' + id + '_text').val();
		},
		getItemById: function(val) {
			var tree = this.setting.tree;
			var treeNodes = tree.getNodes();
			var nodes = tree.getNodesByParam(this.setting.valueField, val, null);
			// if(nodes.length == 0) return -1;
			// else return nodes[0];
			if(nodes.length == 0) {
				return treeNodes[0]
			} else {
				return nodes[0];
			}
		},
		setValue: function(val, text) {
			if($.isNull(val)) return false;
			var oldVal = $('#' + id + '_value').val();
			if(!$.isNull(text)) {
				var node = vm.getItemById(val);
				var text = node[setting.textField];
			}
			$('#' + id + '_value').val(val);
			$('#' + id + '_text').val(text);
			$('#' + id + '_input').val(text);
			$('#' + id + '_input').attr('title', text);
			if(oldVal != val) {
				var change = setting.onchange;
				var node = this.getItemById(val);
				change(node);
			}

		},
		val: function(value) {
			if($.isNull(value)) return false;
			var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
			var tmpNode = treeObj.getNodeByParam(setting['valueField'], value, null);
			if($.isNull(tmpNode)) {
				var nodes = treeObj.getNodes();
				if(nodes.length > 0) {
					tmpNode = nodes[0];
				} else {
					return false;
				}
			}
			var text = tmpNode[setting['textField']];
			if(tmpNode.isParent && setting.leafRequire) {
				var leafFirst = tmpNode.children[0];
				value = leafFirst.id;
				text = leafFirst.name;
			}

			vm.setValue(value, text);
		},
		select: function(idx) {
			function setVal() {
				var tree = vm.setting.tree;
				if($.isNull(tree)) return false;
				var tId = id + '_tree_' + idx;
				var node = tree.getNodeByTId(tId);
				vm.setValue(node[vm.setting.valueField], node[vm.setting.textField]);
				return true;
			}
			vm.times = 0;
			var intID = setInterval(function() {
				vm.times = vm.times + 1;
				if(setVal()) {
					clearTimeout(intID);
					intID = null;
				}

				if(vm.times >= 10) {
					clearTimeout(intID);
					intID = null;
				}

			}, 300);
		}
	}
	return vm;
};
//////////////////////////////////////////////
$.fn.ufmaTextboxlist = function(setting) {
	var $obj = $(this);
	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var id = $obj.attr('id');
	setting = setting || {};
	$obj.addClass('ufma-combox ufma-combox2');
	var bNew = false;
	if($obj.attr('aria-new') != 'false') {
		bNew = true;
		buildList();
	}

	function addItem(id, value, text) {
		if($.isNull(value)) return false;

		if($('#' + id + ' .ufma-textboxlist-item[value="' + value + '"]').length == 0) {
			var $item = $('<li class="ufma-textboxlist-item" value="' + value + '"></li>').appendTo($('#' + id + '>.ufma-textboxlist-border>ul'));
			var $txt = $('<span class="ufma-textboxlist-item-text">' + text + '</span>').appendTo($item);
			var $btnClose = $('<span class="ufma-textboxlist-close glyphicon icon-close"></span>').appendTo($item);
			$item.width($txt.outerWidth(true) + $btnClose.outerWidth(true));
			var $valueInput = $('#' + id + '_value');
			addValue($valueInput, value);
			var $textInput = $('#' + id + '_text');
			addValue($textInput, text);
			adjInput(id);
		}
	};

	function addValue($input, v) {
		var textVal = $input.val();
		if(textVal == '') textVal = v;
		else {
			var valArray = textVal.split(',');
			valArray.push(v);
			textVal = valArray.join(',');
		}
		$input.val(textVal);
	}

	function adjInput(id) {
		//ufma.deferred(function(){
		var $list = $('#' + id + '>.ufma-textboxlist-border>.ufma-textboxlist-inner');
		var $moreitem = $('#' + id + ' .ufma-textboxlist-border .ufma-textboxlist-item-more');
		var boxWidth = $('#' + id).width();
		var $inputLi = $('#' + id + '_input');
		var defWidth = $inputLi.outerWidth(true) - $inputLi.width() + 10;

		var numWidth = 4;
		var moreBtnWidth = $moreitem.outerWidth(true);

		var listWidth = 0;
		var $liObjs = $list.find('.ufma-textboxlist-item');
		$moreitem.addClass('hide');
		if($liObjs.length > 0) {
			$('#' + id + '_num').html('(' + $liObjs.length + ')').show();
			$('#' + id + '_selecticon').hide()
			numWidth = numWidth + $('#' + id + '_num').outerWidth(true);

			listWidth = boxWidth - numWidth - moreBtnWidth - 40;
			var itemLen = 0;

			$liObjs.each(function(idx) {
				var tmpItemWidth = $(this).outerWidth(true);
				if(itemLen + tmpItemWidth < listWidth) {
					itemLen = itemLen + tmpItemWidth;
					$(this).addClass('showlabel');
				} else {
					$(this).removeClass('showlabel');
					$moreitem.removeClass('hide');
				}

			});
			listWidth = itemLen;
		} else {
			$('#' + id + '_num').hide();
			$('#' + id + '_selecticon').show()
		}
		$list.css('width', listWidth + 'px');
		inputWidth = boxWidth - defWidth - numWidth - listWidth - moreBtnWidth;
		$inputLi.css({
			'min-width': inputWidth + 'px',
			width: inputWidth + 'px',
			right: numWidth + 'px'
		});
		//});
	};

	function buildList() {
		setting.id = setting.id || $obj.attr('id');
		setting.url = setting.url || $obj.attr('url');
		setting.name = setting.name || $obj.attr('name');
		setting.textField = setting.textField || $obj.attr('textField');
		setting.valueField = setting.valueField || $obj.attr('valueField');
		setting.placeholder = setting.placeholder || $obj.attr('placeholder');
		setting.placeholder = setting.placeholder || '';
		setting.data = setting.data || [];
		setting.expand = setting.expand;

		if(!$.isNull(setting.expand)) {
			setting.expand = setting.expand;
		} else {
			setting.expand = true;
		}

		$.writeCache(setting.id, setting);

		$obj.removeAttr('url');

		var boxHtml = '<div class="ufma-textboxlist-border">';
		boxHtml += '<ul class="ufma-textboxlist-inner">';

		boxHtml += '</ul>';
		boxHtml += '<span class="ufma-textboxlist-item-more hide">...</span>'
		boxHtml += '<span id="' + setting.id + '_selecticon" class="icon-angle-bottom open"><b></b></span>';
		boxHtml += '<span id="' + setting.id + '_input" class="ufma-textboxlist-inputLi"><input class="ufma-textboxlist-input" type="text" autocomplete="off"></span>';
		boxHtml += '<span id="' + setting.id + '_num" class="ufma-textboxlist-numLi">(' + setting.data.length + ')</span>';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_value" name="' + setting.name + '">';
		boxHtml += '<input type="hidden" value="" id="' + setting.id + '_text" >';
		//boxHtml += '<div id="'+setting.id+'_popup" class="ufma-combox-popup"><ul id="'+setting.id+'_tree"></ul></div>';
		boxHtml += '</div>';
		var boxList = $(boxHtml).appendTo($obj).trigger('create');
		$('<div id="' + setting.id + '_popup" class="ufma-combox-popup"><ul id="' + setting.id + '_tree"></ul></div>').appendTo('body');

		function setPopupPos() {
			var popupWidth = $('#' + setting.id).width();
			var posX = $('#' + setting.id).offset().left;
			var posY = $('#' + setting.id).offset().top + $('#' + setting.id).outerHeight(true);
			var popupTop = $('#' + setting.id).outerHeight(true) + 2;
			var popupOffsetWidth = parseInt($('#' + setting.id + ' .ufma-combox-border').css('border-left-width')) == 0 ? 2 : 0;
			var maxWidth = $(window).width() - posX - 20;
			$('#' + setting.id + '_popup').hide().css({
				'min-width': popupWidth + popupOffsetWidth + 'px',
				'max-width': maxWidth + 'px',
				'top': posY + 'px',
				'left': posX + 'px'
			});
		}

		adjInput(setting.id);

		var $tree = $('#' + setting.id + '_tree');
		var tokenid = ufma.getCommonData().token;
		if(tokenid == undefined) {
			tokenid = "";
		}
		if(!$.isNull(setting.url)) {
			if(setting.url.indexOf("?") != -1) {
				setting.url = setting.url + "&ajax=1";
			} else {
				setting.url = setting.url + "?ajax=1";
			}
		} else {
			setting.url = null;
		}
		var $treeObj = $tree.ufmaTree({
			url: setting.url,
			async: false,
			checkbox: true,
			nameKey: setting.textField,
			idKey: setting.valueField,
			onClick: function(event, treeId, treeNode) {
				event.stopPropagation();
				$treeObj.checkNode(treeNode, !treeNode.checked, true);
				//if(setting.leafRequire && treeNode.isParent) return false;
				treeKeyboardSelect();
			}
		});
		setting.tree = $treeObj;

		function showPopup() {
			var $popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				$popup.attr('popup-lock', 'true');
				$('#' + setting.id).addClass('ufma-combox-open');
				setPopupPos();
				var ids = $('#' + setting.id + '_value').val();
				var idArray = ids.split(',');
				$treeObj.checkAllNodes(false);

				for(var i = 0; i < idArray.length; i++) {
					var nodes = $treeObj.getNodesByParam(setting.valueField, idArray[i], null);
					var node = nodes[0];
					if(!$.isNull(node)) {
						if(!node.isParent) {
							$treeObj.checkNode(node, true, true);
						}

					}
				}

				$popup.slideDown(300, function() {

				});
			}
		}

		function hidePopup() {
			var $popup = $('#' + setting.id + '_popup');
			$popup.attr('popup-lock', 'true');
			$popup.slideUp(300, function() {
				$(this).attr('popup-lock', 'false');
				$('#' + setting.id).removeClass('ufma-combox-open');
				if($('#' + id + ' .ufma-textboxlist-item').length == 0) {
					$('#' + id + '_value').val('');
					$('#' + id + '_text').val('');
				}
			});
		};

		function delLabelItem(v) {
			var $valueInput = $('#' + id + '_value');
			var $textInput = $('#' + id + '_text');
			var textVal = $textInput.val();
			var val = $valueInput.val();
			var valArray = val.split(',');
			var textArray = textVal.split(',');
			if(textVal == '') {
				$valueInput.val('');
				$textInput.val('');
				return false;
			} else {
				var idx = valArray.indexOf(v);
				if(idx == -1) return false;
				valArray.splice(idx, 1);
				textArray.splice(idx, 1);
				$valueInput.val(valArray.join(','));
				$textInput.val(textArray.join(','));
				$('#' + id + ' .ufma-textboxlist-item[value="' + v + '"]').remove();
			}
		}

		function delValue(v) {
			delLabelItem(v);
			var nodes = $treeObj.getNodesByParam('pId', v, null);
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				$treeObj.checkNode(node, false, false);
				var newVal = node[setting.valueField];
				delValue(newVal);
			}
			var nodes = $treeObj.getNodesByParam(setting.valueField, v, null);
			if(nodes.length > 0) {
				$treeObj.checkNode(nodes[0], false, false);
			}
			//
			nodes = $treeObj.getCheckedNodes(true);
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if(!$.isNull(node)) {
					if(node.getCheckStatus().half) {
						delLabelItem(node[setting.valueField]);
					}
				}
			}
			adjInput(setting.id);
		};

		function afterTreeSelect(blur) {
			$popup = $('#' + setting.id + '_popup');
			if($popup.attr('popup-lock') != 'true') {
				return false;
			}
			$('#' + setting.id + '>.ufma-textboxlist-border>.ufma-textboxlist-inner>.ufma-textboxlist-item').remove();
			$('#' + setting.id + '>.ufma-textboxlist-border>.ufma-textboxlist-item-more').addClass('hide');
			var nodes = $treeObj.getCheckedNodes(true);

			adjInput(setting.id);
			$('#' + setting.id + '_value').val('');
			$('#' + setting.id + '_text').val('');
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if(setting.leafRequire || setting.leafRequire == true || setting.leafRequire == 'true') { //必须有叶子？
					if(!node.isParent) { //如果是叶子节点
						addItem(setting.id, node[setting.valueField], node[setting.textField]);
					}
				} else {
					if(!node.getCheckStatus().half) { //如果当前节点不是半勾选的状态(也就是没有选中子集)
						addItem(setting.id, node[setting.valueField], node[setting.textField]);
					}
				}
			}
			onchange();
			if(!blur) {
				$('#' + setting.id + ' .ufma-textboxlist-input').val('').focus();
			}
		}

		function onchange() {
			/*
			var val = $('#'+setting.id+'_value').val();
			var text = $('#'+setting.id+'_text').val();
			var vt = $('#'+setting.id+'_input').val();
			*/
			var change = setting.onchange;
			if(!change) {
				change = function() {}
			};
			setting.onchange = change;
			change();
		}

		function treeKeyboardSelect(key) {

			if(key != 8) {
				showPopup();
				if($('#' + setting.id + '_popup').attr('popup-lock') != 'true') {
					return false;
				}
			}

			function selectNode(node) {
				if(!$.isNull(node)) {
					node = $treeObj.selectNode(node);
				}
				$('#' + setting.id + ' .ufma-textboxlist-input').focus();
				return node;
			}
			var nodes = $treeObj.getSelectedNodes(),
				node;
			if(nodes.length == 0) {
				var nodes = $treeObj.getNodes();
				if(nodes.length > 0) {
					node = $treeObj.selectNode(nodes[0]);
					$('#' + id + ' .ufma-textboxlist-input').focus();
				}
			} else {
				node = nodes[0];
			}

			switch(key) {
				case 40:
					node = node.getNextNode();
					node = selectNode(node);
					break;
				case 38:
					node = node.getPreNode();
					node = selectNode(node);

					break;
				case 37:
					node = node.getParentNode();
					node = selectNode(node);

					break;
				case 39:
					if(!$.isNull(node.children)) {
						node = node.children[0];
						node = selectNode(node);
					}
					break;
				case 13:
					if(!$.isNull(node)) {
						//$treeObj.checkNode(node,!node.checked,true);
						afterTreeSelect();
						hidePopup();
					}
					break;
				case 27:
					if(!$.isNull(node)) {
						$treeObj.checkNode(node, !node.checked, true);
					}
					break;
				case 8:
					var textValue = $('#' + id + ' .ufma-textboxlist-input').val();
					if(textValue == '') {
						var showLabels = $('#' + id + ' .showlabel');
						if(showLabels.length > 0) {
							var lastLabel = showLabels[showLabels.length - 1];
							if(!$.isNull(lastLabel)) {
								var val = $(lastLabel).attr('value');
								delValue(val);
							}
						}
						return false;
					}
					break;
				default:
					break;
			}
		}
		//绑定事件
		$('#' + setting.id).on('click', '.ufma-textboxlist-close', function(e) {
			e.stopPropagation();
			var $item = $(this).closest('.ufma-textboxlist-item');
			var $valueInput = $('#' + setting.id + '_value');
			delValue($item.attr('value'));
			$item.remove();
			adjInput(setting.id);
		});

		$('#' + setting.id).on('click', ':not(.ufma-textboxlist-close)', function(e) {
			e.stopPropagation();
			var $input = $('#' + setting.id + ' .ufma-textboxlist-input');
			$input[$input.attr('readonly') ? 'blur' : 'focus']();
			showPopup();
			treeKeyboardSelect();
		});

		$('#' + setting.id).on('keydown', function(e) {
			e.stopPropagation();
			if($(this).attr('keydown') == 'true') return false;
			$(this).attr('keydown', 'true');
			treeKeyboardSelect(e.keyCode);
		});
		$('#' + setting.id).on('keyup', function(e) {
			e.stopPropagation();
			$(this).attr('keydown', 'false');
			var $input = $('#' + setting.id + ' .ufma-textboxlist-input');
			var inputValue = $input.val();
			if($(this).attr('temValue') != inputValue && inputValue != '') {
				$(this).attr('temValue', inputValue);
				//检索树
				function filter(node) {
					return(node[setting.valueField].indexOf(inputValue) > -1 || node[setting.textField].indexOf(inputValue) > -1);
				}
				var node = $treeObj.getNodesByFilter(filter, true);
				if(!$.isNull(node)) {
					$treeObj.selectNode(node);
				}
				$input.focus();
			}
		});

		ufma.domClickHideEle(setting.id, function() {
			afterTreeSelect(true);
			hidePopup();
		});
		$obj.attr('aria-new', 'false');
	}
	if(!$.isEmptyObject(setting)) {
		if(!bNew) {
			setting = $.extend({}, $.readCache(id), setting);
		}
		var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
		var settingTree = treeObj.setting;
		settingTree.async.url = setting.url;
		if(!$.isNull(setting.url)) {
			//$.fn.zTree.init($(id+"_tree"), settingTree);
			var callback = function(result) {
				$.fn.zTree.init($('#' + id + '_tree'), settingTree, result.data);
			};
			ufma.get(setting.url, {}, callback);
		} else if(setting.hasOwnProperty('data') && setting.data.length > 0) {
			$.fn.zTree.init($('#' + id + '_tree'), settingTree, setting.data);
		}
		if(setting.expand) {
			treeObj.expandAll(true);
		}
		var nodes = treeObj.getNodes();
		if(nodes.length > 0) {
			treeObj.selectNode(nodes[0]);
		}
	}
	var vm = {
		setting: $.extend({}, $.readCache(id), setting),
		getValue: function() {
			return $('#' + id + '_value').val();
		},
		getText: function() {
			return $('#' + id + '_text').val();
		},
		setValue: function(val, text) {
			if($.isNull(val)) return false;
			var oldVal = $('#' + id + '_value').val();
			//$('#'+id+'_value').val(val);
			//$('#'+id+'_text').val(text);
			var valList = val.split(',');
			var textList = text.split(',');
			var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
			for(var i = 0; i < valList.length; i++) {
				var nodeId = valList[i];
				var tmpNode = treeObj.getNodeByParam(vm.setting['valueField'], nodeId, null);
				var isParent = tmpNode.isParent,
					half = tmpNode.getCheckStatus().half,
					leafRequire = this.setting.leafRequire;
				if(leafRequire || leafRequire == true || leafRequire == 'true') { //必须有叶子？
					if(!isParent) { //如果是叶子节点
						addItem(id, valList[i], textList[i]);
					}
				}
			}

			if(oldVal != val) {
				var change = setting.onchange;
				if(!$.isNull(change)) change();
			}
		},
		val: function(value) {
			if($.isNull(value)) {
				$('#' + id + ' .ufma-textboxlist-close').click();
				return;
			}
			var valArray = value.split(',');

			var text = '';
			var valList = [];
			var treeObj = $.fn.zTree.getZTreeObj(id + "_tree");
			for(var i = 0; i < valArray.length; i++) {
				var nodeId = valArray[i];
				if(!$.isNull(nodeId)) {
					valList.push(nodeId);
					var tmpNode = treeObj.getNodeByParam(vm.setting['valueField'], nodeId, null);
					var txt = tmpNode[vm.setting['textField']];
					text = text == '' ? txt : text + ',' + txt;

				}
			}
			$('#' + id + '_num').html('(' + valList.length + ')').show();
			vm.setValue(valList.join(','), text);
		}
	}
	return vm;
};
///////////////////////////////
$.fn.ufmaTimeline = function(setting) {
	var $obj = $(this);
	if($.isNull($obj.attr('id'))) $obj.attr('id', 'ufma-combox-' + $.getGuid());
	var vm = {};
	vm.id = $obj.attr('id');
	var bCreate = false;
	if(!$.isNull(setting)) {
		bCreate = true;
		var width = $obj.width();
		var stepLen = setting.length || 1;
		var liWidth = Math.floor(width / stepLen);

		var $timeline = $('<ul class="ufma-timeline"></ul').appendTo($obj);
		for(var i = 0; i < stepLen; i++) {
			var step = setting[i].step;
			var iStep = i + 1;
			var $item = $('<li style="width:' + liWidth + 'px;" step=' + iStep + '></li>').appendTo($timeline);
			$('<div class="ufma-timeline-map"><div class="ufma-timeline-line"></div><div class="ufma-timeline-icon"><span>' + iStep + '</span></div></div>').appendTo($item);
			if(!$.isNull(step)) {
				$('<div class="ufma-timeline-content">' + step + '</div>').appendTo($item);
			}
		}
		vm.setting = setting;
		$.writeCache($obj.attr('id'), setting);

	} else {
		vm.setting = $.readCache($obj.attr('id'));
	};

	vm.step = function(newStep) {
		newStep = newStep || 1;
		newStep = newStep == 0 ? 1 : newStep;
		$('#' + vm.id + ' .ufma-timeline li[step=' + newStep + ']').addClass('actived');
		var target = vm.setting[newStep - 1].target;
		if(!$.isNull(vm.curTarget)) {
			$('#' + vm.curTarget).hide();
		}
		for(var i = 0; i < vm.setting.length; i++) {
			iStep = i + 1;
			if(iStep <= newStep) {
				$('#' + vm.id + ' .ufma-timeline li[step=' + iStep + ']').addClass('actived');
			} else {
				$('#' + vm.id + ' .ufma-timeline li[step=' + iStep + ']').removeClass('actived');
			}
		}
		if(!$.isNull(target)) {
			$('#' + target).removeClass('hide');
			$('#' + target).show();
			vm.curTarget = target;
		}
	};
	vm.stepIndex = function() {
		var $activedSteps = $('#' + vm.id + ' .ufma-timeline li.actived');
		var curStep = $activedSteps.length;
		return curStep;
	};
	vm.next = function() {
		var curStep = vm.stepIndex();
		newStep = curStep + 1;
		vm.step(newStep);
	}
	vm.prev = function() {
		var curStep = vm.stepIndex();
		newStep = curStep - 1;
		vm.step(newStep);
	}
	vm.isLast = function() {
		return vm.stepIndex() == setting.length;
	}
	if(bCreate) {
		vm.step(1);
	}
	return vm;
};

//////////////////////////////
$.fn.tableSort = function(callback) {
	var obj = this;
	var tbody = $(obj).find('tbody');
	var rows = tbody.children();
	var selectedRow;
	var pointerY = 0;
	//压下鼠标时选取行
	rows.mousedown(function(e) {
		pointerY = e.clientY;
		selectedRow = this;
		tbody.css('cursor', 'move');
		//根据需求先去除鼠标离开时的样式
		//$(selectedRow).addClass('mouseOver');
		return false; //防止拖动时选取文本内容，必须和 mousemove 一起使用
	});
	rows.mousemove(function(e) {
		e.stopPropagation();
		if(selectedRow) {
			if(selectedRow != this) {
				if(e.clientY < pointerY) {
					$(this).before($(selectedRow)); //.removeClass('mouseOver'); //插入
				} else {
					$(this).after($(selectedRow)); //.removeClass('mouseOver'); //插入
				}

			}
		}

		return false; //防止拖动时选取文本内容，必须和 mousedown 一起使用
	});
	//释放鼠标键时进行插入
	rows.mouseup(function(e) {
		if(selectedRow) {
			/*
			 if(selectedRow != this)
			 {
			 if(e.clientY < pointerY){
			 $(this).before($(selectedRow)).removeClass('mouseOver'); //插入
			 }else{
			 $(this).after($(selectedRow)).removeClass('mouseOver'); //插入
			 }
			 }
			 */
			rows.unbind();
			tbody.find('.mouseOver').removeClass('mouseOver');
			tbody.css('cursor', 'default');
			selectedRow = null;
			if(callback) {
				callback();
			}
		}
	});
	//标示当前鼠标所在位置
	rows.hover(
		/*
		 function(){
		 if(selectedRow && selectedRow != this)
		 {
		 $(this).addClass('mouseOver');	//区分大小写的，写成 'mouseover' 就不行
		 }
		 },
		 function(){
		 if(selectedRow && selectedRow != this)
		 {
		 $(this).removeClass('mouseOver');
		 }
		 }
		 */
	);

	//当用户压着鼠标键移出 tbody 时，清除 cursor 的拖动形状，以前当前选取的 selectedRow			
	tbody.mouseover(function(event) {
		event.stopPropagation(); //禁止 tbody 的事件传播到外层的 div 中
	});
	$(obj).mouseover(function(event) {
		if($(event.relatedTarget).parents(tbody)) //event.relatedTarget: 获取该事件发生前鼠标所在位置处的元素
		{
			tbody.css('cursor', 'default');
			selectedRow = null;
		}
	});
};
//指标管理专用--zsj--CWYXM-10173	
$.fn.mangerTableSort = function(callback) {
	var obj = this;
	var tbody = $(obj).find('tbody');
	var rows = tbody.children();
	var selectedRow;
	var pointerY = 0;
	//压下鼠标时选取行
	rows.mousedown(function(e) {
		pointerY = e.clientY;
		selectedRow = this;
		tbody.css('cursor', 'move');
		//根据需求先去除鼠标离开时的样式
		//$(selectedRow).addClass('mouseOver');
		return false; //防止拖动时选取文本内容，必须和 mousemove 一起使用
	});
	rows.mousemove(function(e) {
		e.stopPropagation();
		if(selectedRow) {
			if(selectedRow != this) {
				if(e.clientY < pointerY) {
					$(this).before($(selectedRow)); //.removeClass('mouseOver'); //插入
					tbody.animate({
						scrollTop: -pointerY
					}, 1);
				} else {
					$(this).after($(selectedRow)); //.removeClass('mouseOver'); //插入
					var seq = parseInt($(this).find("td.recNoTd").attr('title')) + 1;
					var length = tbody.find("tr").length;
					var tbodyHeight = tbody.height();
					var h = tbody.find("tr.selectTr").height();
					var totalHeight = h * length;
					var sstop = 10 * seq + 40;
					var nowHeight = seq * h;
					if(length - seq > 10 && nowHeight >= tbodyHeight) {
						//var scrollHeight =  tbodyHeight/nowHeight;
						tbody.animate({
							scrollTop: nowHeight
						}, 1);
					} else if(length - seq < 10) {
						tbody.animate({
							scrollTop: totalHeight
						}, 1);
					} else {
						console.log("pointerY:" + pointerY);
						tbody.animate({
							scrollTop: pointerY + 80
						}, 1);
					}
					//	tbody.trigger('mousewheel')
				}

			}
		}

		return false; //防止拖动时选取文本内容，必须和 mousedown 一起使用
	});
	//释放鼠标键时进行插入
	rows.mouseup(function(e) {
		if(selectedRow) {
			rows.unbind();
			tbody.find('.mouseOver').removeClass('mouseOver');
			tbody.css('cursor', 'default');
			selectedRow = null;
			if(callback) {
				callback();
			}
		}
	});
	//标示当前鼠标所在位置
	rows.hover();

	//当用户压着鼠标键移出 tbody 时，清除 cursor 的拖动形状，以前当前选取的 selectedRow			
	tbody.mouseover(function(event) {
		event.stopPropagation(); //禁止 tbody 的事件传播到外层的 div 中
	});
	$(obj).mouseover(function(event) {
		if($(event.relatedTarget).parents(tbody)) //event.relatedTarget: 获取该事件发生前鼠标所在位置处的元素
		{
			tbody.css('cursor', 'default');
			selectedRow = null;
		}
	});
};
$.fn.serializeObject = function() {
	var o = {};

	$(this).find('input,textarea').each(function() {
		var name = $(this).attr('name');
		if(name != undefined && !o.hasOwnProperty(this.name)) {
			if(this.name != undefined) {
				//启用停用的toggle的值，不通过checked拿
				if($(this).attr('type') == 'radio' && $(this).hasClass('toggle')) {
					o[$(this).attr('name')] = $(this).parent().parent().find('label.active').find('input').val();
				} else {
					o[$(this).attr('name')] = $(this).val();
				}
			}
			if($(this).hasClass('amt')) {
				o[$(this).attr('name')] = o[$(this).attr('name')].replaceAll(',', '');
			}
		}
	});
	$(this).find('select').each(function() {
		var name = $(this).attr('name');
		if(name != undefined && !o.hasOwnProperty(name)) {
			o[name] = $(this).children('option:selected').val();
		}
	});

	var $nameVales = $('[name][value]', this);
	$.each($nameVales, function() {
		if(!$(this).hasClass('selected')) return true;
		var name = $(this).attr("name");
		var value = $(this).attr("value");
		if(!o.hasOwnProperty(name) && name != '') {
			o[name] = value;
		}
	});
	return o;
};

//表单加载json对象数据
$.fn.setForm = function(jsonValue) {
	var obj = this;
	$.each(jsonValue, function(name, ival) {
		var $oinput = obj.find('[name="' + name + '"]:not([class^="uf-"])');
		$.each($oinput, function() {
			if($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
				if($(this).val() == ival) {
					$(this)[0].click();
					$(this).prop("checked", "checked");
					obj.find('label[for="' + name + '"]').html($(this).parent().text());
				}
			} else {
				$(this).val(ival);
				if($(this).find('option[value="' + ival + '"]').length > 0) {
					obj.find('label[for="' + name + '"]').html($(this).find('option[value="' + ival + '"]').text());
				} else {
					obj.find('label[for="' + name + '"]').html(ival);
				}
				$(this).trigger('blur');
			}
		});
	});
	var timeId = setTimeout(function() {
		var $ufel = obj.find('.uf-combox,.uf-datepicker');
		$.each($ufel, function() {
			var key = $(this).attr('name');
			var api = $(this).getObj();
			if(api.val) {
				api.val(jsonValue[key]);
			} else if(api.setValue) {
				api.setValue(jsonValue[key]);
			}
		});
		clearTimeout(timeId);
	}, 600);

};
$.fn.disable = function() {
	return $(this).find("*").each(function() {
		if($(this).hasClass('uf-combox') || $(this).hasClass('uf-datepicker')) {
			var api = $(this).getObj();
			if(api.setEnabled) {
				api.setEnabled(false);
			}
		} else {
			$(this).attr("disabled", "disabled");
		}
	});
}
$.fn.enable = function() {
	return $(this).find("*").each(function() {
		if($(this).hasClass('uf-combox') || $(this).hasClass('uf-datepicker')) {
			var api = $(this).getObj();
			if(api.setEnabled) {
				api.setEnabled(true);
			}
		} else {
			$(this).removeAttr("disabled");
		}
	});
}
/***********************************************************/
Array.prototype.removeByValue = function(val) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
}

/***********************************************************/
var ufma = {};
ufma.timeID = 0;
ufma.inIframe = false;
ufma.getTimeID = function() {
	ufma.timeID += 1;
	return 'timeID' + ufma.timeID;
};
ufma.setCache = function(key, value) {
	window.sessionStorage.setItem(key, value);
};
ufma.getCache = function(key) {
	return window.sessionStorage.getItem(key);
};
ufma.setObjectCache = function(key, value) {
	window.sessionStorage.setItem(key, JSON.stringify(value));
};
ufma.getObjectCache = function(key) {
	return JSON.parse(window.sessionStorage.getItem(key));
};
ufma.removeCache = function(key) {
	window.sessionStorage.removeItem(key);
};
ufma.clearCache = function() {
	window.sessionStorage.clear();
};

ufma.decode = function(s, s1, s2) {
	var sw = arguments[0];
	var rtnStr = arguments[arguments.length - 1];
	var rtnStrDef = rtnStr;
	for(var i = 1; i < arguments.length - 1; i++) {
		var ifStr = arguments[i];
		i++;
		if(i >= arguments.length - 1) break;
		rtnStr = arguments[i];
		if(sw == ifStr) {
			break;
		} else {
			rtnStr = rtnStrDef;
		}
	}
	return rtnStr;
}

ufma.deferred = function(func) {
	var timeID = ufma.getTimeID();
	ufma[timeID] = setTimeout(function() {
		func();
		clearTimeout(ufma[timeID]);
	}, 300);
};
ufma.ajaxDef = function(url, type, argu, callback,timeoutback,menuids) {
	var menuid = $.getUrlParam('menuid');
	if(menuids!=undefined){
		menuid =menuids
	}
	var roleId = $.getUrlParam('roleId')
	if($.isNull(roleId)) {
		roleId = ufma.getCommonData().svRoleId
	}
	if(!$.isNull(menuid) && (!$.isNull(url))) {
		if(url.indexOf('?') == -1) {
			url = url + '?menuId=' + menuid;
		} else {
			url = url + '&menuId=' + menuid;
		}
		url = url + '&roleId=' + roleId;
		if(typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
			if(url.indexOf('?') > 0) {
				url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
			} else {
				url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
			}
		}
	}

  if($.isNull(url)) return false;
  //CWYXM-20868 -- 基础资料-预算支出控制设置，设置完科目后前台没显示，具体见截图--zsj--兼容业务代码中请求方式为get或GET的情况
	if(type != 'get' && type != 'GET') {
		argu = JSON.stringify(argu);
	}

	var tokenid = ufma.getCommonData().token;
	//console.log("tokenid:" + tokenid);
	if(tokenid == undefined) {
		tokenid = "";
	}
	//加入tokenid（判断url里有没有？）
	if(url.indexOf("?") != -1) {
		url = url + "&ajax=1";
	} else {
		url = url + "?ajax=1";
	}

	$.ajax({
		url: url,
		type: type, //GET
		async: false, //或false,是否异步
		data: argu,
		timeout: 600000, //超时时间
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		contentType: 'application/json; charset=utf-8',
		beforeSend: function(xhr) {
			//console.log(xhr)
			//console.log('发送前')
			//ufma.showloading('正在请求数据，请耐心等待...');
			xhr.setRequestHeader("x-function-id",menuid);
			//xhr.setRequestHeader("x-functiongroup-ids",roleId);
		},
		success: function(result) {
			ufma.hideloading();
			if(result.flag == 'success') {
				callback(result);
			} else {
				callback(result);
				ufma.showTip(result.msg, function() {}, "error");
			}

		},
		error: function(jqXHR, textStatus) {
			ufma.hideloading();
			var error = "";
			switch(jqXHR.status) {
				case 408:
					error = "请求超时";
					break;
				case 500:
					error = "服务器错误";
					break;
				case 504:
					if(timeoutback!=undefined && timeoutback!=''){
						timeoutback()
					}
					break;
				default:
					break;
			}
			if(error != "") {
				callback(result);
				ufma.showTip(error, function() {}, "error");
				return false;
			}
		},
		complete: function(data) {
			//callback(data);
			//console.log('结束')
			ufma.hideloading();
		}
	});
};
ufma.ajax = function(url, type, argu, callback, async,timeoutback) {
	if($.isNull(async)) async = true;
	var menuid = $.getUrlParam('menuid');
	var roleId = $.getUrlParam('roleId')
	if($.isNull(roleId)) {
		roleId = ufma.getCommonData().svRoleId
	}
	if(!$.isNull(menuid) && (!$.isNull(url))) {
		if(url.indexOf('?') == -1) {
			url = url + '?menuId=' + menuid;
		} else {
			url = url + '&menuId=' + menuid;
		}
		url = url + '&roleId=' + roleId;
		if(typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
			if(url.indexOf('?') > 0) {
				url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
			} else {
				url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
			}
		}
	}
	if($.isNull(url)) return false;
	if(type != 'get') {
		argu = JSON.stringify(argu);
	}

	var tokenid = ufma.getCommonData().token;
	//console.log("tokenid:" + tokenid);
	if(tokenid == undefined) {
		tokenid = "";
	}
	//加入tokenid（判断url里有没有？）
	if(url.indexOf("?") != -1) {
		url = url + "&ajax=1";
	} else {
		url = url + "?ajax=1";
	}
	$.ajax({
		url: url,
		type: type, //GET
		async: async, //或false,是否异步
		data: argu,
		timeout: 600000, //超时时间
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		contentType: 'application/json; charset=utf-8',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",menuid);
			//xhr.setRequestHeader("x-functiongroup-ids",roleId);想·
		},
		success: function(result) {

			if (result.tag && result.tag == 'fail') { // 会计平台：业务单据记账/凭证生成接口fail时需要回调添加
				callback(result);
			} else if(result.flag != 'fail') {
				callback(result);

			} else {
				ufma.showTip(result.msg, function() {
					ufma.hideloading();
				}, "error");

			}
		},
		error: function(jqXHR, textStatus) {
			var $btn = $.data($('body')[0], 'btnAjax');
			if($btn) {
				$btn.removeAttr('disabled');
			}
			ufma.hideloading();
			var error = "";
			switch(jqXHR.status) {
				case 408:
					error = "请求超时";
					break;
				case 500:
					error = "服务器错误";
					break;
				case 504:
					if(timeoutback!=undefined){
						timeoutback()
					}
					break;
				default:
					break;
			}
			if(error != "") {
				ufma.showTip(error, function() {}, "error");
				return false;
			}
		},
		complete: function(xhr, data) {
			var licenseMap = JSON.parse(localStorage.getItem('licenseMap'));
			if(licenseMap == null) {
				licenseMap = {};
			}
			//系统授权类型
			var type = xhr.getResponseHeader('x_check_license_type');
			//授权截止时间 long
			var endTime = '';
			if(xhr.getResponseHeader('x_check_expiretime') != null) {
				endTime = parseInt(xhr.getResponseHeader('x_check_expiretime'));
			}

			//授权截止时间 yyyy-mm-dd
			var endDate = xhr.getResponseHeader('x_check_expiredate');
			//授权检查状态
			var checkStatus = xhr.getResponseHeader('x_check_licenseck_status');

			var dateTime = xhr.getResponseHeader("x_check_nowtime");

			if(type != null && type != '') {
				licenseMap['type'] = type;
			}
			if(endTime != null && endTime != '') {
				licenseMap['endTime'] = endTime;
			}
			if(endDate != null && endDate != '') {
				licenseMap['endDate'] = endDate;
			}
			if(checkStatus != null && checkStatus != '') {
				licenseMap['checkStatus'] = checkStatus;
			}
			if(dateTime != null && dateTime != '') {
				licenseMap['dateTime'] = dateTime;
			}
			localStorage.licenseMap = JSON.stringify(licenseMap);
		}
	});
};
//查询
ufma.get = function(url, argu, callback) {
	this.ajax(url, 'get', argu, callback);
};
//新增
ufma.post = function(url, argu, callback) {
	this.ajax(url, 'post', argu, callback);
};
//删除
ufma.delete = function(url, argu, callback) {
	this.ajax(url, 'delete', argu, callback);
};
//修改
ufma.put = function(url, argu, callback) {
	this.ajax(url, 'put', argu, callback);
};
///////////////////////////////
ufma.getTopZIndex = function(obj) {
	var topZindex = 0;
	$(obj).find('div').each(function() {
		var tmpIndex = $(this).css('z-index');
		if(tmpIndex != 'auto') {
			if(topZindex < parseInt(tmpIndex)) {
				topZindex = parseInt(tmpIndex);
			}
		}
	});
	if(topZindex == 0) topZindex = 1006;
	return topZindex;
};

ufma.showloading = function(msg, lengths) {
	if(lengths == undefined || isNaN(lengths)) {
		lengths = 100
	}
	msg = msg || '正在加载数据，请耐心等待...';
	//var iOverlay = this.getTopZIndex('body');
	var iOverlay = 9999;
	var iMsg = iOverlay + 1;
	if($('#ufma-overlay').length == 0) {
		ufma.hideloading();
		var $overlay = $('<div id="ufma-overlay" class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
		var $msg = $('<div id="ufma-loading" class="loading" style="z-index: ' + iMsg + ';">' +
			'<div class="progress progress-striped active" style="margin-bottom: 0;"><div class="progress-bar" style="width: ' + lengths + '%;"></div></div>' +
			msg +
			'</div>').appendTo($('body'));
		$msg.css({
			"top": ($(window).height() - $msg.outerHeight(true)) / 2 + 'px',
			"left": ($(window).width() - $msg.outerWidth(true)) / 2 + 'px'
		});
		$overlay.hide().appendTo($('body')).fadeIn();
	}

};

ufma.updataloading = function(lengths) {
	if(lengths == undefined || isNaN(lengths)) {
		lengths = 100
	}
	$("#ufma-loading").find('.progress-bar').css("width", lengths + "%")
}
ufma.hideloading = function() {
	this.showScrollbar();
	if($('#ufma-loading').length > 0) {
		$('#ufma-loading').remove();
	}
	if($('#ufma-overlay').length > 0) {
		$('#ufma-overlay').remove();
	}
};
ufma.hideScrollbar = function() {
	var $parent = $('body');
	var sclW = ufma.scrollbarWidth();
	if($parent[0].scrollHeight < $parent.height() + sclW) {
		sclW = 0;
	};

	$parent.css({
		'overflow-y': 'hidden',
		'padding-right': sclW + 'px'
	});
}
ufma.showScrollbar = function() {
	$('body').css({
		'overflow-y': 'auto',
		'padding-right': '0'
	});
}
///////////////////////////////

ufma.showModal = function(contentID, width, height, callback) {
	return this.showDialog({
		content: contentID,
		width: width,
		height: height,
		onClose: callback
	});
};
//{content:modalid,width:width,height:height,onClose:function(){}}
ufma.showDialog = function(options) {
	var contentID = options.content;
	var width = options.width;
	var height = options.height;
	if($.isNull(height)) {
		height = $(window).height() - 60;
	} else {
		if(height > $(window).height() - 60) {
			height = $(window).height() - 60;
		};
	}

	var dialogID = 'ufma' + '_' + contentID
	//if($('#'+dialogID).length > 0) return false;
	var modalView = {};
	modalView.id = contentID;
	modalView.modal = $('#' + contentID);
	modalView.parent = modalView.modal.parent();
	modalView.canClose = true;
	width = width || '790';

	var iOverlay = this.getTopZIndex(modalView.id) - 2;

	var iwind = iOverlay + 1;

	var $overlay = $('<div class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
	$overlay.appendTo($('body')).trigger('create');

	var $dialogBox = $('<div class="u-msg-dialog-top" id="' + dialogID + '_top" style="z-index: ' + iwind + ';"></div>');
	$dialogBox.hide().appendTo($('body')).trigger('create');

	var $dialog = $('<div class="u-msg-dialog" id="' + dialogID + '"></div>').appendTo($dialogBox).trigger('create');
	$dialog.css({
		'width': width + 'px',
		'height': height + 'px'
	});
	var $closeBtn = $('<div class="u-msg-close"> <span aria-hidden="true">×</span></div>').appendTo($dialog).trigger('create');
	var $content = $('<div class="u-msg-dialog-content"></div>').appendTo($dialog).trigger('create');
	modalView.modal.appendTo($content).css('display', 'block').trigger('create');
	var contentHeight = height;
	if(modalView.modal.find('.u-msg-title').length > 0) {
		contentHeight = contentHeight - 50;
	}
	if(modalView.modal.find('.u-msg-footer').length > 0) {
		contentHeight = contentHeight - 60;
	}
	modalView.msgContent = modalView.modal.find('.u-msg-content');
	modalView.msgContent.css({
		'height': contentHeight + 'px',
		'overflow-y': 'auto',
		'display': 'inline-block'
	});

	$(window).resize(function() {
		if($dialogBox.attr('resizeAble')) {
			return false;
		}
		$dialogBox.css({
			'visibility': 'hidden'
		});
		$dialogBox.attr('resizeAble', 'true');
		var timeId = setTimeout(function() {

			var dlgTop = $(document).scrollTop() + ($(window).height() - $dialog.outerHeight(true)) / 2;
			var dlgLeft = $(document).scrollLeft() + ($(window).width() - width) / 2;

			/*			var dlgTop = ($(window).height() - $dialog.outerHeight(true)) / 2;
						var dlgLeft = ($(window).width() - width) / 2;*/
			var cssOpts = {
				'top': dlgTop + 'px',
				'left': dlgLeft + 'px',
				'visibility': 'visible',
				'display': 'inline-block'
			};
			$dialogBox.css(cssOpts).fadeIn();
			$dialogBox.removeAttr('resizeAble');
			clearTimeout(timeId);
			ufma.hideScrollbar();
		}, 30);

	}).trigger('resize');

	modalView.close = function() {
		if(modalView.canClose) {
			ufma.showScrollbar();
			modalView.modal.css('display', 'none').appendTo(modalView.parent);
			modalView.msgContent.css('height', 'auto');
			modalView.modal.css('height', 'auto');
			$overlay.css({
				'visibility': 'hidden'
			});
			$dialogBox.css({
				'visibility': 'hidden'
			});
			$overlay.remove();
			$dialogBox.remove();
			if(options.onClose) {
				options.onClose();
			}
		}
	};

	$closeBtn.on('click', function(e) {

		if(options.onClose == undefined) {
			modalView.close();
		} else {
			options.onClose();
			modalView.close();
		}
		//e.stopPropagation();
	});
	window.md = modalView;
	modalView.modal.find('.u-msg-title').addClass('handler');
	modalView.modal.find('.u-msg-title h4').addClass('handler');
	$('#' + dialogID + '_top').addClass('drag');
	$('#' + dialogID + '_top').ufDrag({
		handler: '.handler'
	});
	return modalView;
};
//options={baseType:dw,title:"选择下发单位",buttons:{'确认下发':{class:'',action:function(){}},'取消':{class:'',action:function(){}}},bSearch:true}
ufma.selectBaseTree = function(options) {
	var width = options.width || 600;
	var height = options.height;
	if($.isNull(height)) {
		height = $(window).height() - 100;
	} else {
		if(height > $(window).height() - 100) {
			height = $(window).height() - 100;
		};
	}
	options.filter = options.filter || {};
	if($.isNull(options.bSearch)) {
		options.bSearch = true;
	}
	var modalView = {};
	modalView.filter = [];
	modalView.url = options.url || '';
	modalView.treeRoot = options.rootName || '';

	if(modalView.url == '') {
		ufma.alert('请设置数据接口地址！');
		return false;
	}

	var angencyArr = [];
	// ufma.ajaxDef(modalView.url, "get", "{}", function(result) {
	ufma.ajaxDef(modalView.url, "get", "", function(result) {

		angencyArr = result.data;
	});
	if(angencyArr.length == 0) {
		modalView.treeRoot = '';
	}

	function selectNode(key, value, flag) {
		treeObj.checkAllNodes(false);
		treeObj.cancelSelectedNode();
		var arr = [];
		if(value != '') {
			for(var i = 0; i < angencyArr.length; i++) {
				if(flag) {
					if(angencyArr[i][key] == value) {
						arr.push(angencyArr[i]);
					}
				} else {
					var id = angencyArr[i]['id'];
					var name = angencyArr[i]['name'];

					//if(id.indexOf(value) != "-1" || name.indexOf(value) != "-1") {
					if(angencyArr[i].codeName.indexOf(value) != -1) {
						arr.push(angencyArr[i]);
					}
				}

			}
		} else {
			arr = angencyArr;
		}
		var sltFlag = false;
		for(var j = 0; j < arr.length; j++) {
			var node = treeObj.getNodeByParam("id", arr[j].id, null);

			if(!node.isParent) {
				treeObj.checkNode(node, true, true);
			}
			treeObj.selectNode(node, true);
			/*if(!sltFlag) {
				treeObj.selectNode(node);
				sltFlag = true;
			}*/
		}
		$input.focus();
	};

	var iOverlay = this.getTopZIndex('body');

	var iwind = iOverlay + 1;
	var $overlay = $('<div class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
	$overlay.appendTo($('body')).trigger('create');

	ufma.hideScrollbar();

	var $dialogBox = $('<div class="u-msg-dialog-top" style="z-index: ' + iwind + ';"></div>');
	$dialogBox.hide().appendTo($('body')).trigger('create');

	var $dialog = $('<div class="u-msg-dialog" style="position:relative"></div>').appendTo($dialogBox).trigger('create');
	$dialog.css({
		'width': width + 'px',
		'height': height + 'px'
	});
	var $closeBtn = $('<div class="u-msg-close"> <span aria-hidden="true">×</span></div>').appendTo($dialog).trigger('create');
	var $dialogContent = $('<div class="u-msg-dialog-content"></div>').appendTo($dialog).trigger('create');

	var $msgTitle = $('<div class="u-msg-title"><h4>' + options.title + '</h4></div>').appendTo($dialogContent).trigger('create');
	var $msgContent = $('<div class="u-msg-content" style="padding:0px 30px 15px;"></div>').appendTo($dialogContent).trigger('create');
	var $msgHeader = $('<div class="container-fluid u-msg-content-header form-horizontal"></div>').appendTo($msgContent).trigger('create');
	var $row = $('<div class="row" style="padding: 0px;margin:0 -16px;clear:both;"></div>').appendTo($msgHeader).trigger('create');;
	$msgContent.height(height - 120);
	modalView.hasFilter = false;
	$.each(options.filter, function(name, obj) {
		modalView.hasFilter = true;
		var formEle = '<input type="text" name="' + obj.idField + '" class="form-control">';
		if(obj.formControl == 'combox') {
			modalView.filter.push(obj.filterField);
			//formEle ='<select name="'+obj.idField+'" class="form-control" style="width:180px;"></select>';
			formEle = '<div id="' + obj.filterField + '" class="form-control ufma-combox" style="width:180px;"></div>';
		}
		var formCtrol = '<div class="form-group" style="float: left;padding: 0">' +
			'<label class="control-label" style="float: left;">' + name + '：</label>' +
			'<div class="control-element" style="float: left;">' + formEle + '</div>' +
			'</div>';
		$(formCtrol).appendTo($row);
		if(!$.isNull(obj.ajax)) {
			var argu = obj.data || {};
			var callback = function(result) {
				var data = result.data;
				$('#' + obj.filterField).ufmaCombox({
					data: data,
					name: obj.filterField,
					valueField: obj.idField,
					textField: obj.textField,
					onchange: function(data) {
						//console.log(data);
						//var searchData = { 'key': obj.filterField, 'val': data[obj.idField] };
						//modalView.filter.push(searchData);

						//doSearch();
						selectNode("agencyTypeCode", data.ENU_CODE, true);
					},
					initComplete: function() {
						$('#' + obj.filterField + '_popup').css({
							'z-index': iwind
						});
					}
				});
			}
			ufma.get(obj.ajax, argu, callback);
		}
	});
	//
	if(options.bSearch) {
		var searchPos = 'right';
		if(!modalView.hasFilter) searchPos = 'left';
		var formCtrol = '<div class="form-group input-group" style="width:210px;float:' + searchPos + ';padding: 0">' +
			'<input type="text" class="form-control" placeholder="请输入要搜索的关键词">' +
			'<span class="input-group-addon btn-search"><i class="glyphicon icon-search"></i></span>' +
			'</div>';
		$(formCtrol).appendTo($row);
	}

	var $msgBody = $('<div class="u-msg-content-body" style="border:1px #d9d9d9 solid;"></div>').appendTo($msgContent).trigger('create');
	var $tree = $('<ul id="' + options.baseType + 'Tree" class="ufmaTree ztree uf-ztree"></ul>').appendTo($msgBody).trigger('create');
	var treeObj = $tree.ufmaTree({
		// url: modalView.url,
		data: angencyArr,
		checkbox: true,
		rootName: modalView.treeRoot,
		nameKey: "codeName", //revise
		onCheck: options.checkAll ? onCheck : false

	});

	if(options.data) {
		var timeId = setTimeout(function() {
				for(var i = 0; i < options.data.length; i++) {
					var node = options.data[i];
					var findNode = treeObj.getNodeByParam("id", node.id, null);
					if(!$.isNull(findNode)) {
						if(!findNode.isParent) {
							treeObj.checkNode(findNode, true, true);
						}
					}

				}

				clearTimeout(timeId);
			},
			600);
	}
	//
	var $footer = $('<div class="u-msg-footer"></div>').appendTo($dialogContent).trigger('create');
	$.each(options.buttons, function(name, obj) {

		$('<a href="#" class="wxbtn btn btn-sm ' + obj['class'] + '" style="margin-right:8px;"><span>' + name + '</span></a>').appendTo($footer);

		if(!obj.action) {
			obj.action = function() {};
		}
	});

	function setPositions() {
		var contentHeight = $msgContent.height();
		contentHeight = contentHeight - 48;
		contentHeight = contentHeight - $msgBody.outerHeight(true) + $msgBody.height();
		$msgBody.css({
			'height': contentHeight + 'px',
			'overflow-y': 'auto',
			'display': 'block'
		});
	}
	setPositions();

	function setDlgBoxPos() {
		if($dialogBox.attr('resizeAble')) {
			return false;
		}
		$dialogBox.css({
			'visibility': 'hidden'
		});
		$dialogBox.attr('resizeAble', 'true');
		var timeId = setTimeout(function() {
			var dlgTop = $(document).scrollTop() + ($(window).height() - height) / 2;
			var dlgLeft = $(document).scrollLeft() + ($(window).width() - width) / 2;
			var cssOpts = {
				'top': dlgTop + 'px',
				'left': dlgLeft + 'px',
				'visibility': 'visible',
				'display': 'inline-block'
			};
			$dialogBox.css(cssOpts).fadeIn();
			$dialogBox.removeAttr('resizeAble');
			clearTimeout(timeId);
			ufma.hideScrollbar();
		}, 30);
	}
	$(window).resize(function() {
		setDlgBoxPos();
	});
	setDlgBoxPos();
	//search
	$input = $dialog.find('input');

	function filter(node) {
		var inputValue = $input.val();
		bFind = true;
		if(inputValue != '') {
			//console.log(node);
			bFind = (node['id'].indexOf(inputValue) > -1 || node['name'].indexOf(inputValue) > -1);
		}
		for(var i = 0; i < modalView.filter.length; i++) {
			var keyField = modalView.filter[i];
			var keyVal = $('#' + keyField + '_value').val();
			if(keyVal != '') {
				bFind = bFind && node[keyField] == keyVal;
			}

		}
		return bFind;
	}

	function doSearch() {
		var node = treeObj.getNodesByFilter(filter, true);
		if(!$.isNull(node)) {
			treeObj.selectNode(node);
		}
	}
	$input.on('keyup', function(e) {
		e.stopPropagation();
		treeObj.checkAllNodes(false);
		treeObj.cancelSelectedNode();
		if($input.val() == '') return false;
		//doSearch();
		var val = $input.val();
		selectNode("name", val, false);
	});
	$dialog.find('.btn-search').on('click', function(e) {
		//doSearch();
		e.stopPropagation();
		if($input.val() == '') return false;
		var val = $input.val();
		selectNode("name", val, false);
	});
	modalView.close = function() {
		$.each(options.filter, function(name, obj) {
			var popup = $('#' + obj.filterField + '_popup');
			if(popup.length > 0) popup.remove();
		});
		ufma.showScrollbar();
		$overlay.fadeOut();
		$dialogBox.fadeOut();
		$overlay.remove();
		$dialogBox.remove();
	};
	var data = treeObj.getCheckedNodes(true); //树选择结果

	var buttons = $footer.find('.wxbtn'),
		i = 0;
	$.each(options.buttons, function(name, obj) {

		buttons.eq(i++).click(function() {
			var data = treeObj.getCheckedNodes(true); //树选择结果
			obj.action(data);
			return false;
		});
	});

	$closeBtn.on('click', function(e) {
		e.stopPropagation();
		if(options.onClose == undefined) {
			modalView.close();
		} else {
			options.onClose();
		}

	});
	window.md = modalView;

	$dialogBox.addClass('drag');
	$dialogBox.find('.u-msg-title').addClass('handler');
	$dialogBox.find('.u-msg-title h4').addClass('handler');
	$dialogBox.ufDrag({
		handler: '.handler'
	});

	//处理树节点全部选中与否与全选框是否选中之间的变化
	function onCheck(event, treeId, treeNode) {
		var myTree = $.fn.zTree.getZTreeObj(treeId);
		var zNodes = myTree.getNodes(); //获取所有父节点--zsj
		/*if(myTree.getCheckedNodes(true).length == zNodes.length) {*/
		var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
		if(myTree.getCheckedNodes(true).length == allNodes.length) { //全选操作应该判断已勾选数据与所有数据长度的比较--zsj
			$(".uf-selectAll").find("input[name='isAll']").prop("checked", true)
		} else {
			$(".uf-selectAll").find("input[name='isAll']").prop("checked", false)
		}
	}
	//如果需要加全选
	if(options.checkAll) {
		var labelHtml = '<div class="uf-selectAll">' +
			'<label class="rpt-check rpt-checkAll mt-checkbox mt-checkbox-outline">' +
			'<input name="isAll" type="checkbox">全选<span></span>' +
			'</label>' +
			'</div>';
		$(".u-msg-content-body").prepend(labelHtml);
	}
	//全选事件
	$(document).on("click", ".rpt-checkAll", function() {
		var treeObj = $.fn.zTree.getZTreeObj(options.baseType + "Tree");
		if(treeObj) {
			if($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
				treeObj.checkAllNodes(true);
			} else {
				treeObj.checkAllNodes(false);
			}
		}
	});

	return modalView;
};
///
//open({url:'',title:'',width:600,height:400,ondestory:function(action){}});
ufma.open = function(options) {
	var width = options.width || 600;
	var height = options.height;
	if($.isNull(height)) {
		height = $(window).height() - 40;
	} else {
		if(height > $(window).height() - 40) {
			height = $(window).height() - 40;
		};
	}

	windHeight = $(window).height();
	var windWidth = $(window).width();
	var $parent = $('body');
	var modalView = {};
	var iOverlay = this.getTopZIndex($parent) + 2;
	var iwind = iOverlay + 1;
	var $overlay = $('<div class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
	$overlay.appendTo($parent).trigger('create');
	ufma.hideScrollbar();
	var $dialogBox = $('<div class="u-msg-dialog-top" style="z-index: ' + iwind + ';"></div>');
	//$dialogBox.hide().appendTo($parent).trigger('create');
	$dialogBox.appendTo($parent).trigger('create');
	var $dialog = $('<div class="u-msg-dialog"></div>').appendTo($dialogBox).trigger('create');
	$dialog.css({
		'width': width + 'px'
	});
	var $closeBtn = $('<div class="u-msg-close"> <span aria-hidden="true">×</span></div>').appendTo($dialog).trigger('create');
	var $dialogContent = $('<div class="u-msg-dialog-content"></div>').appendTo($dialog).trigger('create');

	var $msgTitle = $('<div class="u-msg-title"><h4>' + options.title + '</h4></div>').appendTo($dialogContent).trigger('create');
	var contentHeight = height;
	contentHeight = contentHeight - $msgTitle.outerHeight(true);

	var url = options.url;
	if(url.indexOf('?') == -1) url = url + '?';
	if(url.indexOf('menuid') == -1) {
		url = url + 'menuid=' + ufma.GetQueryString("menuid");
		if(typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
			//open方法打开的也要添加isjump
			if(url.indexOf('?') > 0) {
				url = url + '&isJump=1' + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode )
			} else {
				url = url + "?isJump=1&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
			}
		}
	}
	var $msgContent = $('<div class="u-msg-content" style="margin:0px;padding:0px;padding-bottom:4px;overflow: hidden;height:' + contentHeight + 'px;"></div>').appendTo($dialogContent).trigger('create');
	var $iframe = $('<iframe name="wxframe" src="' + url + '" style="width:100%;height:100%;" frameborder="0"></iframe>').appendTo($msgContent);
	$iframe.height($msgContent.outerHeight() - 4);

	$(window).resize(function() {
		if($dialogBox.attr('resizeAble')) {
			return false;
		}
		$dialogBox.css({
			'visibility': 'hidden'
		});
		$dialogBox.attr('resizeAble', 'true');
		var timeId = setTimeout(function() {
			var dlgTop = $(document).scrollTop() + ($(window).height() - height) / 2;
			var dlgLeft = $(document).scrollLeft() + ($(window).width() - width) / 2;
			var cssOpts = {
				'top': dlgTop + 'px',
				'left': dlgLeft + 'px',
				'visibility': 'visible',
				'display': 'inline-block'
			};
			$dialogBox.css(cssOpts).fadeIn();
			$dialogBox.removeAttr('resizeAble').trigger('create');
			$overlay.css({
				'z-index': $overlay.css('z-index') - 1
			});
			clearTimeout(timeId);
		}, 30);

	}).trigger('resize');

	//$dialogBox.fadeIn(200);
	modalView.close = function() {
		ufma.showScrollbar();
		$overlay.css({
			'visibility': 'hidden'
		});
		$dialogBox.css({
			'visibility': 'hidden'
		});

		//ufma.deferred(function() {
		$overlay.remove();
		$dialogBox.remove();
		//});
	};

	var frmWin = $iframe[0].contentWindow;
	frmWin.window.ownerData = options.data;

	var destory = options.ondestory;
	if(destory == undefined) {
		destory = function() {};
	}
	$closeBtn.on('click', function(e) {
		e.stopPropagation();
		if(frmWin.close) {
			frmWin.close();
		}
		if(frmWin._close) {
			frmWin._close();
		}
		modalView.close();
	});
	//解决凭证模板点完确定后弹窗不关闭问题--zsj
	frmWin.closeOwner = function(data) {
		destory(data);
		modalView.close();
	}
	$iframe.contents().find("html,body").css({
		'height': '100%'
	});
	//升级jquery库到3.4.1 guohx
	// $iframe.load(function() {
	$iframe.on('load',function() {
		frmWin.closeOwner = function(data) {
			destory(data);
			modalView.close();
		}
		if(frmWin.window.ownerData == undefined) {
			console.log(frmWin)
			console.log(frmWin.window.ownerData)
			frmWin.window.ownerData = options.data;
		}
		$iframe.contents().find("html,body").css({
			'height': '100%'
		});
	});
	$dialogBox.addClass('drag');
	$dialogBox.find('.u-msg-title').addClass('handler');
	$dialogBox.find('.u-msg-title h4').addClass('handler');
	$dialogBox.ufDrag({
		handler: '.handler'
	});
	return frmWin;
};
//type:warning||error||success
//setting:{type:'warning',okText:'是',cancelText:'否'}
ufma.confirm = function(smsg, _callback, setting) {
	setting = setting || {};
	setting.okText = setting.okText || '是';
	setting.cancelText = setting.cancelText || '否';

	var iOverlay = this.getTopZIndex('body');
	var iDialog = iOverlay + 1;
	var $overlay = $('<div class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
	$overlay.appendTo($('body')).trigger('create');
	var $dialogBox = $('<div class="u-msg-dialog-top" id="_top" style="z-index: ' + iDialog + ';"></div>').hide().appendTo($('body')).trigger('create');
	var $dialog = $('<div class="u-msg-dialog"></div>').appendTo($dialogBox).trigger('create');
	var $content = $('<div class="u-msg-dialog-content"></div>').appendTo($dialog).trigger('create');
	$('<div class="u-msg-title"><h4></h4></div>').appendTo($content).trigger('create');
	var icon = '<span class="icon icon-warning font-size-24 absolute" style="left:20px;"></span>';
	if(setting.type == 'success') {
		icon = '<span class="icon icon-check-circle font-size-24 absolute ufma-green" style="left:20px;"></span>';
	} else if(setting.type == 'error') {
		icon = '<span class="icon icon-warning font-size-24 absolute ufma-red" style="left:20px;"></span>';
	} else if(setting.type == 'warning') {
		icon = '<span class="icon icon-warning font-size-24 absolute ufma-yellow" style="left:20px;"></span>';
	}
	$('<div class="u-msg-content" style="padding-left:48px;">' + icon + '<p>' + smsg + '</p></div>').appendTo($content).trigger('create');
	var $footer = $('<div class="u-msg-footer"></div>').appendTo($content).trigger('create');
	var $cancel = $('<button class="u-msg-cancel u-button u-grey btn-default">' + setting.cancelText + '<span class="u-button-container"><span class="u-ripple"></span></span></button>').appendTo($footer);
	var $ok = $('<button class="u-msg-ok u-button btn-primary raised">' + setting.okText + '<span class="u-button-container"><span class="u-ripple"></span></span></button>').appendTo($footer);

	$dialogBox.fadeIn();
	$dialogBox.css({
		'top': ($(window).height() / 2 - $dialog.outerHeight(true)) + 'px',
		'left': ($(window).width() - $dialog.outerWidth(true)) / 2 + 'px'
	});
	var close = function() {
		$overlay.fadeOut();
		$dialogBox.fadeOut();
		$overlay.remove();
		$dialogBox.remove();
	}
	$ok.on('click', function(e) {
		e.stopPropagation();
		close();
		_callback(true);
	});
	$cancel.on('click', function(e) {
		e.stopPropagation();
		close();
		_callback(false);
	});
};
//type:warning||error||success
ufma.alert = function(msg, type,callback) {
	//u.messageDialog({ msg: msg, title: "", btnText: "确定" });
	var iOverlay = this.getTopZIndex('body');
	var iDialog = iOverlay + 1;
	var $overlay = $('<div class="u-overlay" style="z-index: ' + iOverlay + ';"></div>');
	$overlay.appendTo($('body')).trigger('create');
	var $dialogBox = $('<div class="u-msg-dialog-top" id="_top" style="z-index: ' + iDialog + ';"></div>').hide().appendTo($('body')).trigger('create');
	var $dialog = $('<div class="u-msg-dialog"></div>').appendTo($dialogBox).trigger('create');
	var $content = $('<div class="u-msg-dialog-content"></div>').appendTo($dialog).trigger('create');
	$('<div class="u-msg-title"><h4></h4></div>').appendTo($content).trigger('create');
	var icon = '<span class="icon icon-warning font-size-24 absolute" style="left:20px;"></span>';
	if(type == 'success') {
		icon = '<span class="icon icon-check-circle font-size-24 absolute ufma-green" style="left:20px;"></span>';
	} else if(type == 'error') {
		icon = '<span class="icon icon-warning font-size-24 absolute ufma-red" style="left:20px;"></span>';
	} else if(type == 'warning') {
		icon = '<span class="icon icon-warning font-size-24 absolute ufma-yellow" style="left:20px;"></span>';
	}

	$('<div class="u-msg-content" style="padding-left:48px;">' + icon + '<div>' + msg + '</div></div>').appendTo($content).trigger('create');
	var $footer = $('<div class="u-msg-footer"></div>').appendTo($content).trigger('create');
	var $ok = $('<button class="u-msg-ok u-button btn-primary raised" style="float:none">是<span class="u-button-container"><span class="u-ripple"></span></span></button>').appendTo($footer);
	$dialogBox.fadeIn();
	$dialogBox.css({
		'top': ($(window).height() / 2 - $dialog.outerHeight(true)) + 'px',
		'left': ($(window).width() - $dialog.outerWidth(true)) / 2 + 'px'
	});
	var close = function() {
		$overlay.fadeOut();
		$dialogBox.fadeOut();
		$overlay.remove();
		$dialogBox.remove();
	}
	$ok.on('click', function(e) {
		e.stopPropagation();
		if (callback != undefined) {
			callback();
		}
		close();
	});

};
//type:warning||error||success
// ufma.showTip = function(msg, callback, type, delayTime) {
// 	if($.isNull(delayTime)) {
// 		delayTime = 3000;
// 		if(type == 'error') {
// 			delayTime = 15000;
// 		}
// 	}
// 	var topZindex = 10000;
// 	var $topDiv;
// 	/*$('div').each(function() {
// 		var tmpIndex = $(this).css('z-index');
// 		if(tmpIndex != 'auto') {
// 			if(topZindex < parseInt(tmpIndex)) {
// 				topZindex = parseInt(tmpIndex);
// 				$topDiv = $(this);
// 			}
// 		}
// 	});

// 	if(topZindex == 0) {
// 		topZindex = 1001;

// 	} else {
// 		topZindex = topZindex + 1;

// 	}*/
// 	var timeId = setTimeout(function() {
// 		clearTimeout(timeId);
// 		$topDiv = $('body');
// 		topZindex = topZindex + 1;
// 		var icon = '<span class="icon icon-warning"></span>';
// 		var tipType = 'ufma-tip-warning';
// 		if(type == 'success') {
// 			tipType = 'ufma-tip-success';
// 			icon = '<span class="icon icon-check-circle ufma-green"></span>';
// 		} else if(type == 'error') {
// 			tipType = 'ufma-tip-error';
// 			icon = '<span class="icon icon-warning ufma-red"></span>';
// 		} else if(type == 'warning' || type == 'warn') {
// 			tipType = 'ufma-tip-warning';
// 			icon = '<span class="icon icon-warning ufma-yellow"></span>';
// 		}

// 		var _tip = $('<div class="ufma-tip ' + tipType + '" style="z-index:' + topZindex + ';top:5px;"><div class="ufma-tip-body"><span class="u-msg-close uf uf-close"></span>' + icon + msg + '</div></div>');
// 		_tip.hide().appendTo($topDiv).slideDown(10);
// 		_tip.css('left', ($(window).width() - _tip.outerWidth(true)) / 2);
// 		var timeID = ufma.getTimeID();;
// 		ufma[timeID] = setTimeout(function() {
// 			_tip.remove();
// 			if(callback != undefined) {
// 				callback();
// 			}
// 			clearTimeout(ufma[timeID]);
// 		}, delayTime);

// 		_tip.find('.u-msg-close').on('click', function() {
// 			_tip.slideUp();
// 			_tip.remove();
// 			clearTimeout(ufma[timeID]);
// 			if(callback != undefined) {
// 				callback();
// 			}
// 		});
// 		ufma.removeTips(callback, ufma[timeID])
// 	}, 5);
// };
//
ufma.showTip = function(msg, callback, type, delayTime) {
	if($.isNull(delayTime)) {
		delayTime = 3000;
		if(type == 'error') {
			delayTime = 15000;
		}
	}
	var topZindex = 10000;
	var $topDiv;
	var timeId = setTimeout(function() {
		clearTimeout(timeId);
		$topDiv = $('body');
		topZindex = topZindex + 1;
		var icon = '<span class="icon icon-warning"></span>';
		var tipType = 'ufma-tip-warning';
		if(type == 'success') {
			tipType = 'ufma-tip-success';
			icon = '<span class="icon icon-check-circle ufma-green"></span>';
		} else if(type == 'error') {
			tipType = 'ufma-tip-error';
			icon = '<span class="icon icon-warning ufma-red"></span>';
		} else if(type == 'warning' || type == 'warn') {
			tipType = 'ufma-tip-warning';
			icon = '<span class="icon icon-warning ufma-yellow"></span>';
		}

		var _tip = $('<div class="ufma-tip ' + tipType + '" style="z-index:' + topZindex + ';top:5px;"><div class="ufma-tip-body"><span class="u-msg-close uf uf-close"></span>' + icon + msg + '</div></div>');
		_tip.hide().appendTo($topDiv).slideDown(10);
		var h = $(window).height();
		var w = $(window).width();
		$(".ufma-tip .ufma-tip-body").css({
			"max-height": h - 20 + "px",
			"overflow": "auto",
			"max-width": 50 / 100 * w + "px",
			"white-space": "normal",
			"word-wrap": "break-word",
			"word-break": "break-all"
		})
		_tip.css('left', ($(window).width() - _tip.outerWidth(true)) / 2);

		var timeID = ufma.getTimeID();
		ufma[timeID] = setTimeout(function () {
		_tip.remove();
		if (callback != undefined) {
			callback();
		}
		clearTimeout(ufma[timeID]);
		}, delayTime);
    _tip.find(".u-msg-close").on("click", function () {
      _tip.slideUp();
      _tip.remove();
      clearTimeout(ufma[timeID]);
      if (callback != undefined) {
        callback();
      }
    });
		ufma.removeTips(callback, ufma[timeID])

	}, 5);
};
//2019-5-28zxj控制showTip框消失，鼠标在元素上，提示框就一直存在
ufma.removeTips = function(callback, timeId) {
	$(".ufma-tip").on('mouseleave', function() {
		var timeIDD = ufma.getTimeID();
		ufma[timeIDD] = setTimeout(function() {
			$(".ufma-tip").remove();
			if(callback != undefined) {
				callback();
			}
			clearTimeout(ufma[timeIDD]);
		}, 100);
	});
	$(".ufma-tip").on('mouseover', function() {
		clearTimeout(timeId);
	});
}
//
ufma.buildlabelboxlist = function() {
	$('.ufma-labelboxlist').each(function() {
		var $obj = $(this);

		var options = {};
		options.url = $obj.attr('url');
		options.label = $obj.attr('aria-label');
		options.textField = $obj.attr('textField');
		options.valueField = $obj.attr('valueField');
		options.data = [];
		if($obj.attr('ids') != undefined && $obj.attr('ids') != '') {
			var idsA = $obj.attr('ids').split(',');
			var textsA = $obj.attr('texts').split(',');
			for(var i = 0; i < idsA.length; i++) {
				var item = {};
				item[options.valueField] = idsA[i];
				item[options.textField] = textsA[i];
				options.data.push(item);
			}
		}

		function buildBox(options) {
			var textField = options.textField;
			var valueField = options.valueField;
			var data = options.data;

			var boxlist = '<div class="ufma-labelboxlist-label em4">' + options.label + '：</div>';
			boxlist += '<div class="ufma-labelboxlist-content"><ul >';
			for(var i = 0; i < data.length; i++) {
				var item = data[i];
				var itemid = $obj.attr('id') + '_item' + i
				boxlist += '<li class="ufma-labelboxlist-item" id="' + itemid + '" name="' + textField + '" value="' + item[valueField] + '">' + item[textField] + '<span class="ufma-labelboxlist-close"><span class="glyphicon icon-close"></span></span></li>';
			}
			boxlist += '</ul></div>';
			boxlist += '<div class="btn-collapse"><span class="glyphicon icon-navicon"></span></div>';
			$obj.html(boxlist);
			if($obj.height() < $obj.find('.ufma-labelboxlist-content').outerHeight() - 5) {
				$obj.find('.btn-collapse').removeClass('hide');
			} else {
				$obj.find('.btn-collapse').addClass('hide');
			}
			$obj.on('click', '.ufma-labelboxlist-close', function(e) {
				e.stopPropagation();
				var closeItem = $(this).closest('.ufma-labelboxlist-item');
				var itemId = closeItem.attr('id');
				var closeFunc = $obj.attr('onItemClose');
				if(closeFunc != undefined) {
					eval(closeFunc + '("' + itemId + '","' + closeItem.text() + '","' + closeItem.attr('value') + '")');
				} else {
					closeItem.remove();
					if($obj.height() < $obj.find('.ufma-labelboxlist-content').outerHeight() - 5) {
						$obj.find('.btn-collapse').removeClass('hide');
					} else {
						$obj.find('.btn-collapse').addClass('hide');
						$obj.find('.ufma-labelboxlist-content').css({
							'position': 'relative',
							'box-shadow': 'none'
						});
					}
				}
			});
			$obj.on('mouseenter', '.btn-collapse', function(e) {
				e.stopPropagation();
				var $cnt = $obj.find('.ufma-labelboxlist-content');
				var cntHeight = $cnt.height();
				if($.myBrowser() == 'FF') {
					$cnt.css({
						'box-shadow': '0 2px 4px 0px rgba(0,0,0,0.20)',
						'height': $obj.height(),
						'position': 'fixed'
					}).css({
						'height': cntHeight + 'px'
					});
					$obj.find('.ufma-labelboxlist-content').css('height', 'auto');
				} else {
					$cnt.css({
						'box-shadow': '0 2px 4px 0px rgba(0,0,0,0.20)',
						'height': $obj.height(),
						'position': 'fixed'
					}).animate({
						'height': cntHeight + 'px'
					}, 300, function() {
						$obj.find('.ufma-labelboxlist-content').css('height', 'auto');
					});
				}

			});
			$obj.on('click', '.ufma-labelboxlist-item', function(e) {
				e.stopPropagation();
				$obj.find('.ufma-labelboxlist-item-selected').removeClass('ufma-labelboxlist-item-selected');
				$(this).addClass('ufma-labelboxlist-item-selected');
				if(!$obj.find('.btn-collapse').hasClass('hide')) {
					$(this).prependTo($(this).parent());
				}

				$obj.find('.ufma-labelboxlist-content').css({
					'position': 'relative',
					'box-shadow': 'none'
				});
				var clickFunc = $obj.attr('onItemClick');
				if(clickFunc != undefined) {
					eval(clickFunc + '("' + $(this).attr('id') + '","' + $(this).text() + '","' + $(this).attr('value') + '")');
				}
			});
			$(document).on('click', function() {
				$obj.find('.ufma-labelboxlist-content').css({
					'position': 'relative',
					'box-shadow': 'none'
				});
			});
		}

		if($obj.attr('aria-new') == undefined) {
			$obj.attr('aria-new', 'false');
			if(options.url != undefined && options.url != '') {
				ufma.get(options.url, {}, function(result) {
					options.data = result.data;
					buildBox(options);
				});
			} else {
				buildBox(options);
			}

		}
	});
};

////////////////////
ufma.id = function(id) {
	var obj = {};
	var $obj = $('#' + id);
	if($obj.hasClass('ufma-labelboxlist')) {
		obj.removeItem = function(itemid) {
			$('#' + itemid).remove();
			if($obj.height() < $obj.find('.ufma-labelboxlist-content').outerHeight() - 5) {
				$obj.find('.btn-collapse').removeClass('hide');
			} else {
				$obj.find('.btn-collapse').addClass('hide');
				$obj.find('.ufma-labelboxlist-content').css({
					'position': 'relative',
					'box-shadow': 'none'
				});
			}
		}
	}
};
//////////////////////////////////////////////////
ufma.scrollbarWidth = function() {
	var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
		$outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
		inner = $inner[0],
		outer = $outer[0];
	jQuery('body').append(outer);
	var width1 = inner.offsetWidth;
	$outer.css('overflow', 'scroll');
	var width2 = outer.clientWidth;
	$outer.remove();
	return width1 - width2;
};
ufma.isNull = function(target) {
	$.isNull(target);
};
ufma.htmFormat = function(e, d) {
	return $.htmFormat(e, d);
}
ufma.parseFloat = function(s) {
	if($.isNull(s)) return 0.00;
	else return parseFloat(s);
}
ufma.parseNull = function(s) {
	if($.isNull(s)) return '';
	else return s;
}
//代码加区隔
ufma.splitDMByFA = function(fa, dm) {
	var aDMFJ = fa.split('-');
	var aDM = new Array();
	var aParentGrp = new Array();
	var jDM = new Object();
	var lastLen = 0;
	var dmLen = parseInt(dm.length);
	for(var i = 0; i < aDMFJ.length; i++) {
		var len = parseInt(aDMFJ[i]);
		aDM[i] = dm.substr(lastLen, len);
		if(aDM[i].length === 0) {
			break;
		}
		jDM.isRuled = true;
		if(aDM[i].length < len) {
			aDM[i] = aDM[i] + '<span style="color:red;">*</span>';
			jDM.isRuled = false;
			break;
		}
		lastLen += len;
		aParentGrp[i] = dm.substr(0, lastLen);
	}
	if(dmLen > lastLen) {
		jDM.isRuled = false;
	}
	if(aParentGrp.indexOf(dm) == -1) {
		aParentGrp[i] = dm;
	}

	jDM.splitDM = aDM.join('　');
	jDM.parentDM = aParentGrp.join(',');
	return jDM;
};
//代码输入时在下方按分级显示,输入框下方要15px
ufma.showInputHelp = function(oid, msg) {
	var hlpid = oid + '-help';
	var $hlp = $('#' + hlpid);
	if($hlp.length == 0) {
		$hlp = $('<span id="' + hlpid + '" class="input-help-block"></span>');
		$('#' + oid).after($hlp);
	}
	if(msg != $hlp.html()) {
		$hlp.html(msg);
	}
	if($hlp.is(':hidden')) {
		$hlp.show(300);
	}
};

//input输入时若有特殊字符会转为全角字符--zsj--如果用户输入为全角则会将数字和字母转换为半角(\ )(\@)
ufma.transformQj = function(msg) {
	var containSpecial = RegExp(/[(\~)(\!)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\?)(\)]+/);
	//只校验<></>防止XSS脚本攻击
	//var containSpecial = RegExp(/[(\<)(\>)]+/);
	if(containSpecial.test(msg)) {
		var msgArr = msg.split('');
		var tmp = "";
		for(var i = 0; i < msg.length; i++) {
			if(msg.charCodeAt(i) == 32) {
				tmp = tmp + String.fromCharCode(12288);
			} else if(msg.charCodeAt(i) < 127 && !((msg.charCodeAt(i) >= 65 && msg.charCodeAt(i) <= 90) || (msg.charCodeAt(i) >= 97 && msg.charCodeAt(i) <= 122)) && !(msg.charCodeAt(i) >= 48 && msg.charCodeAt(i) <= 57)) {
				tmp = tmp + String.fromCharCode(msg.charCodeAt(i) + 65248);
			} else {
				tmp = tmp + msgArr[i];
			}
		}
		msg = tmp;
	} else {
		var msgArr = msg.split('');
		var tmp = "";
		for(var i = 0; i < msg.length; i++) {
			if(((msg.charCodeAt(i) >= 65345 && msg.charCodeAt(i) <= 65370) || (msg.charCodeAt(i) >= 65313 && msg.charCodeAt(i) <= 65338)) || (msg.charCodeAt(i) >= 65296 && msg.charCodeAt(i) <= 65305)) {
				tmp += String.fromCharCode(msg.charCodeAt(i) - 65248);
			} else {
				tmp = tmp + msgArr[i];
			}
		}
		msg = tmp;
	}
	return msg;
};
//input输入时若有特殊字符会转为全角字符--zsj
ufma.showInputHelp_Name = function(oid, msg) {
	var hlpid = oid + '-help';
	var $hlp = $('#' + hlpid);
	if($hlp.length == 0) {
		$hlp = $('<span id="' + hlpid + '" class="input-help-block"></span>');
		$('#' + oid).after($hlp);
	}
	msg = ufma.transformQj(msg)
	$hlp.attr("title", msg).css({
		"display": "inline-block",
		"width": "200px",
		"overflow": "hidden",
		"text-overflow": "ellipsis"
	})
	if(msg != $hlp.html()) {
		$hlp.html(msg);
	}
	if($hlp.is(':hidden')) {
		$hlp.show(300);
	}
};
ufma.hideInputHelp = function(oid) {
	var hlpid = oid + '-help';
	var $hlp = $('#' + hlpid);
	if($hlp.length != 0) {
		$hlp.remove();
	}
};
//判断是否是为固定电话或者手机号码
ufma.checkTelePhone = function(phone) {
	var telePhoneRegex = /^0\d{2,3}-?\d{7,8}$/;
	var mobileRegex = /^1(3|4|5|7|8)\d{9}$/;
	var isNum = /^[1-9]\d*$/;
	if(phone.length > 15) {
		return false;
	}
	if(telePhoneRegex.test(phone)) {
		return true;
	} else if(mobileRegex.test(phone)) {
		return true;
	} else if(isNum.test(phone)) {
		return true;
	} else {
		return false;
	}

}
ufma.checkIdCard = function(id) {
	var eighteen = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var fifteen = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
	if(eighteen.test(id)) {
		return true;
	} else if(fifteen.test(id)) {
		return true;
	}
	return false;
}
//判断表单是否存在错误
ufma.hasNoError = function(selector) {
		var flag = true;
		$(selector).find('.form-group').each(function() {
			if($(this).hasClass('error') || $(this).find('span').hasClass('error')) {
				flag = false;
				ufma.showTip('保存失败！请检查输入信息是否正确。', '', 'error');
			}
		});
		return flag;
	},
	////////////////////////////////////////////		
	ufma.isNumOrChar = function(str) {
		var reg = /^[A-Za-z0-9]+$/;
		return reg.test(str);
	}
//数组包含判断
ufma.arrayContained = function(ary, subArray) {
	if(!(ary instanceof Array) || !(subArray instanceof Array)) return false;
	if(ary.length < subArray.length) return false;
	var aStr = ary.toString();
	for(var i = 0, len = subArray.length; i < len; i++) {
		if(aStr.indexOf(subArray[i]) == -1) return false;
	}
	return true;
};
//json 包含关系
ufma.jsonContained = function(json, subJson) {
	if(typeof(json) != 'object' || typeof(subJson) != 'object') return true;
	var result = true;
	for(var k in subJson) {
		if(json.hasOwnProperty(k)) {
			if(json[k] != subJson[k]) {
				result = false;
				return false;
			}
		}

	}
	return result;
};
//键盘事件值
ufma.keyPressInteger = function(event) {
	var keyCode = event.which;
	if(keyCode >= 48 && keyCode <= 57)
		rtn = true;
	else
		rtn = false;
	return rtn;
};

////////////////////////////////
//下拉框绑定
ufma.comboxInit = function(cbid, wurl) {
	var $combox;
	if(cbid.substr(0, 1) == '#' && cbid.substr(0, 1) == '.') {
		$combox = $(cbid);
	} else {
		$combox = $('#' + cbid);
	}
	var url = wurl || $combox.attr('url');
	var idField = $combox.attr('idField');
	var textField = $combox.attr('textField');
	if(url == '' || idField == '' || textField == '') {
		return false;
	}
	var options = [];
	if($combox.attr('idField') == '1') {
		options.push('<option value=""></option>');
	}

	var callback = function(result) {
		//console.log(result.data);
		$.each(result.data, function(idx, option) {
			options.push('<option value="' + option[idField] + '">' + option[textField] + '</option>');
		});
		$combox.html(options.join(''));

		ufma[cbid] = $combox.select2({
			language: 'zh-CN',
			minimumResultsForSearch: function() {
				if($combox.attr('aria-multiple') == 'true') return '';
				else return Infinity;
			}()
		});
	};

	// this.get(url,{},callback);
	this.ajaxDef(url, 'get', {}, callback);
};

ufma.comboxInitModal = function(cbid, wurl, argu, defaultOption) {
	var $combox;
	if(cbid.substr(0, 1) == '#' && cbid.substr(0, 1) == '.') {
		$combox = $(cbid);
	} else {
		$combox = $('#' + cbid);
	}
	var url = wurl || $combox.attr('url');
	var idField = $combox.attr('idField');
	var textField = $combox.attr('textField');
	if(url == '' || idField == '' || textField == '') {
		return false;
	}
	var options = [];
	if($combox.attr('idField') == '1') {
		options.push('<option value=""></option>');
	}
	if(defaultOption != null) {
		options.push('<option value="' + defaultOption["key"] + '">' + defaultOption["value"] + '</option>');
	}
	var callback = function(result) {
		//console.log(result.data);
		$.each(result.data, function(idx, option) {
			options.push('<option value="' + option[idField] + '">' + option[textField] + '</option>');
		});
		$combox.html(options.join(''));
	};
	if(argu == null) {
		argu = {};
	}
	// this.get(url,{},callback);
	this.ajaxDef(url, 'get', argu, callback);
};
//点击其它部位时隐藏元素
ufma.domClickHideEle = function(objId, callback) {

	$(document).on('mousedown mousewheel DOMMouseScroll', function(e) { //这里监听div会不会有问题  
		var e = e || window.event; //浏览器兼容性    
		if($(e.target).closest('#' + objId).length == 0 && $(e.target).closest('#' + objId + '_popup').length == 0) {
			if(callback) callback();
		}
	});
	$(document).on('click', '.handler', function(e) { //这里监听div会不会有问题  
		var e = e || window.event; //浏览器兼容性    
		if(callback) callback();
	});
};

ufma.isIframe = function() {
	var pWindow = $(window.parent);
	if($.isNull(pWindow)) return false;
	if($('.main-header', pWindow[0].document).length == 0) {
		return false;
	} else {
		return true;
	}
};

ufma.setBarPos = function(pWindow,bottomdiv) {
	var scrollTop = 0;
	var tid = $('.ufma-tool-bar').attr('id')
	var kdiv = $('.ufma-table').parents('.uf-sc-content')
	scrollTop = $(document).scrollTop();

	var $bar = $('.ufma-tool-bar');
	if($bar.length == 0) return false;
	var $bread = $('.ufma-container>.bread-box');
	var breadH = 0;
	if($bread.length > 0 && $bread.css('display') != 'none' && !$bread.is(':hidden')) {
		breadH = $bread.outerHeight(true);
	}

	var barH = $bar.outerHeight(true);
	
	if(bottomdiv != true){
		$bar.parent().css('padding-bottom', barH + 20 + 'px');
	}
	var pWindow = $(parent.window);
	var winH = $(window).height();
	var bindElBtmPos = 0;
	var _bindEl;
	$('[tool-bar]').each(function() {
		if($($(this).attr('tool-bar')).is($bar)) {
			_bindEl = $(this);

			if($bar.attr('fixedwidth')) {
				$bar.width(_bindEl.width());
			}

			bindElBtmPos = $(this).offset().top + $(this).outerHeight(true);
			return false;
		}
	});
	barTop = 0;

	function setTop(hsc) {
		//如果是主界面的toolbar 就驻底  guohx 20200707 主要解决出纳从账务取数，工具栏挡住了按钮区 凭证箱的工具栏要驻底的问题 18054
		if($bar.parent().outerHeight(true) >= winH + scrollTop + 16) {
			barTop = winH - barH - breadH + scrollTop;
		} else if(bindElBtmPos < winH - barH - 16 && bindElBtmPos > 0) {
			barTop = bindElBtmPos;
		} else {
			barTop = $bar.parent().outerHeight(true) - barH - 16;
		}
		if(bottomdiv == true){
			barTop = winH - barH - breadH + scrollTop;
		}
		if(hsc) {
			barTop = barTop + 1;
		}
		// if($bar.parent().outerHeight(true) < winH + scrollTop + 1 && kdiv.length>0) {
		// 	if(bottomdiv!=undefined){
		// 		kdiv.css("height",bottomdiv.offset().top-kdiv.offset().top+'px')
		// 	}else{
		// 		kdiv.css("height",$bar.offset().top-kdiv.offset().top+'px')
		// 	}
		// }
		if($bar.parent().outerHeight(true) != 0) {
			for(var i = 0; i < $bar.length; i++) {
				if($bar.parents('#expfunc-choose-content').length < 1) {
					$bar.css({
						'position': 'absolute',
						'top': barTop + 'px'
					});
				}
			}
		}
	}

	var _hsc = $bar.find('.slider.hsc');
	if(_hsc.length > 0) {
		_hsc.css({
			'width': $bar.width() - 28 + 'px'
		});

		if(_hsc.hasClass('none')) {
			$bar.css({
				'padding-top': '0px'
				/*,
								'margin-top':'0px'*/
			});
			setTop(false);
		} else {
			$bar.css({
				'padding-top': '8px'
				/*,
								'top': barTop + 9 + 'px'*/
			});
			setTop(true);
			
			if(bottomdiv != true){
				$bar.parent().css('padding-bottom', $bar.outerHeight(true) + 16 + 'px');
			}
		}
		return false;
	}
	setTop();
	if(_bindEl) {

		if(_bindEl.length > 0) {
			if(_bindEl.parent('.uf-sc-content').length > 0) {
				var sliderBar = _bindEl.parent('.uf-sc-content').parent().find('.slider.hsc');
				if(sliderBar.length > 0) {
					$bar.css({
						'padding-top': '8px'
					});
					sliderBar.prependTo($bar).css({
						'top': '0px',
						'left': '15px',
						'width': $bar.width() - 28 + 'px'
					});
				}
			}
		}
		setTop();
	}
};
ufma.parseScroll = function(bottomdiv) {
	if(bottomdiv ==undefined){
		bottomdiv = ''
	}
	var scrollTop = 0;
	var $bar = $('.ufma-tool-bar');
	var winH = $(window).height();
	var barH = $bar.outerHeight(true);
	//console.log(winH);/*iframe页面默认高度（页面底部有一个padding=10px）*/
	//console.log(scrollTop);/*滚动条高度*/
	//console.log($bar.parent().outerHeight(true));/*工具条的父级div
	//（workspace（底部默认有一个padding=16 工具条高度40px））的高度*/
	if($bar.parent().outerHeight(true) > winH - 16) {
		var barTop = winH - barH + scrollTop;
		$bar.css({
			'position': 'absolute',
			'top': barTop + 'px'
		});
	} else {
		var barTop = winH - barH + scrollTop;
		$bar.css({
			'position': 'static',
			'top': ''
		});
	}
	$(window).on('resize scroll DOMMouseScroll', function() {
		if(window.sc) {} else {
			window.sc = true;
			var timeId = setTimeout(function() {
				window.sc = false;
				clearTimeout(timeId);
				ufma.setBarPos($(this),bottomdiv);
			}, 30);
		}
	});
	// $(document).load(function() {
	$(window).on('load',function(){
		ufma.setBarPos($(window),bottomdiv);
	});
};
ufma.setDoubleBarPos = function(pWindow) {

	var scrollTop = 0;

	scrollTop = $(document).scrollTop();
	var $table = $('.ufma-table');

	var $bar = $('.ufma-tool-bar');
	if($bar.length == 0) return false;
	var $bread = $('.ufma-container>.bread-box');
	var breadH = 0;
	if($bread.length > 0 && $bread.css('display') != 'none' && !$bread.is(':hidden')) {
		breadH = $bread.outerHeight(true);
	}

	var barH = $bar.outerHeight(true);
	$bar.parent().css('padding-bottom', barH + 16 + 'px');
	//console.log($table.offset().top);
	//console.log($table.height());

	//var pWindow = $(parent.window);
	var winH = $(window).height();
	//console.log(winH);
	//console.log(scrollTop);
	//console.log("变化");
	if($table.offset().top + $table.height() + 40 >= winH + scrollTop) {
		var barTop = winH - barH - breadH + scrollTop;
		$bar.css({
			'position': 'absolute',
			'top': barTop + 'px'
		});
	} else {
		$bar.css({
			'position': 'static',
			'top': ''
		});
	}

};
ufma.parseDoubleScroll = function() {
	var scrollTop = 0;
	var $bar = $('.ufma-tool-bar');
	var $table = $('.ufma-table');
	var winH = $(window).height();
	var barH = $bar.outerHeight(true);
	/*console.log(1111);
	console.log(winH);iframe页面默认高度（页面底部有一个padding=10px）
	console.log(scrollTop);滚动条高度
	console.log($bar.parent().outerHeight(true));工具条的父级div
	（workspace（底部默认有一个padding=16 工具条高度40px））的高度*/
	/*console.log($table.offset().top);
	console.log($table.height());
	console.log(winH);
	console.log(11111111111111111111111);*/
	if($bar.parent().outerHeight(true) > winH - 10 && $table.offset().top + $table.height() + 40 > winH - 10) {
		var barTop = winH - barH + scrollTop;
		$bar.css({
			'position': 'absolute',
			'top': barTop + 'px'
		});
	} else {
		$bar.css({
			'position': 'static',
			'top': ''
		});
	}
	$(window).scroll(function() {
		ufma.setDoubleBarPos($(this));
	});

};
ufma.delayBtn = function(btn) {
	if($.isNull(btn)) return false;
	if(btn.length == 0) return false;
	btn.attr('disabled', 'true');
	var delay = $(this).attr('delay') || 0;
	if(delay != 0) {
		var timeID = setTimeout(function() {
			btn.removeAttr('disabled');
			clearTimeout(timeID);
		}, delay);
	}
};
//初始化页面,主要是控件样式
ufma.parse = function() {
	//input输入时若有特殊字符会转为全角字符--zsj--如果用户输入为全角则会将数字和字母转换为半角
	$(document).on('change', 'input,textarea', function(e) { //(\.')(\',)金额输入控制,(\_)(\/),(\:)(\?)url中用,(\ )去掉空格;邮箱校验去掉(\@)；传值校验(\+)(\()(\))---CWYXM-6433--zsj
		//去掉对负号的校验，避免金额出现问题  ==xiaosen
		//http和https url不参与校验
    //账套管理的账套名称 不走此校验$(this).attr('acctType') != 'acctCheck'--zsj
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--指标要素设置--说明项区域input不走 此校验：$(this).attr('bgItem') != 'bgItemInput' --zsj
		if($(this).attr('type') != 'file' && $(this).val().indexOf("http") < 0 && $(this).val().indexOf("https") < 0 && $(this).attr('acctType') != 'acctCheck' && !$(this).hasClass('sqlControl') && $(this).attr('bgItem') != 'bgItemInput') {
			// var containSpecial = RegExp(/[(\~)(\!)(\#)(\$)(\%)(\^)(\&)(\*)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\')(\")(\<)(\>)(\)]+/); //将'.'和','去除是因为金额输入时会用到，所以不能转义
			// 20200114nyb提CWYXM-11555 liuyyn
			//20201009 去掉(\*),因为需求提出需要在凭证内进行乘法计算 ，NHWHCWGXZX-904
			var containSpecial = RegExp(/[(\~)(\#)(\$)(\%)(\^)(\&)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\')(\")(\<)(\>)(\)]+/); //将'.'和','去除是因为金额输入时会用到，所以不能转义
			var inputValue = $(this).val();
			//只校验<></>防止XSS脚本攻击
			//var containSpecial = RegExp(/[(\<)(\>)(\")]+/);
			if(containSpecial.test(inputValue)) {
				var inputValueArr = inputValue.split('');
				var tmp = "";
				for(var i = 0; i < inputValue.length; i++) {
					if(inputValue.charCodeAt(i) == 32) {
						tmp = tmp + String.fromCharCode(12288);
					} else if(inputValue.charCodeAt(i) < 127 && !((inputValue.charCodeAt(i) >= 65 && inputValue.charCodeAt(i) <= 90) || (inputValue.charCodeAt(i) >= 97 && inputValue.charCodeAt(i) <= 122)) && !(inputValue.charCodeAt(i) >= 48 && inputValue.charCodeAt(i) <= 57)) {
						tmp = tmp + String.fromCharCode(inputValue.charCodeAt(i) + 65248);
					} else {
						tmp = tmp + inputValueArr[i];
					}
				}
				inputValue = tmp;
				$(this).val(inputValue);
			} else {
				var inputValueArr = inputValue.split('');
				var tmp = "";
				for(var i = 0; i < inputValue.length; i++) {
					if(((inputValue.charCodeAt(i) >= 65345 && inputValue.charCodeAt(i) <= 65370) || (inputValue.charCodeAt(i) >= 65313 && inputValue.charCodeAt(i) <= 65338)) || (inputValue.charCodeAt(i) >= 65296 && inputValue.charCodeAt(i) <= 65305)) {
						tmp += String.fromCharCode(inputValue.charCodeAt(i) - 65248);
					} else {
						tmp = tmp + inputValueArr[i];
					}
				}
				inputValue = tmp;
				$(this).val(inputValue);
			}
		}
	});
	//单选按钮事件绑定
	$(document).on('click', '.label-radio', function(e) {
		e.stopPropagation();
		if($(this).hasClass('selected')) {
			return false;
		}
		var name = $(this).attr('name');
		$('.label-radio[name=' + name + '].selected').removeClass('selected');
		$(this).addClass('selected');
	}).trigger("create");

	//更多事件绑定
	$('.label-more').on('click', function(e) {
		//e.stopPropagation();
		var target = $(this).attr('data-target');
		var targetH = 0;
		var $glyphicon = $(this).find('.glyphicon');
		$(target).css({
			'height': 'auto'
		});
		if($glyphicon.hasClass('icon-angle-bottom')) {
			$glyphicon.removeClass('icon-angle-bottom');
			$glyphicon.addClass('icon-angle-top');
			$(target).removeClass('none');
		} else {
			$glyphicon.removeClass('icon-angle-top');
			$glyphicon.addClass('icon-angle-bottom');
			$(target).addClass('none');
		}
		// ufma.setBarPos($(window));
		// $(".ufma-table.dataTable").fixedTableHead(); 
		//guohx 注释 影响了其他没有加固定表头的界面  原本为余额表加 现不需要

	});
	//购物车,按钮及弹出层不要放在有滚动条的层
	$(document).on('click', '.ufma-shopping-trolley', function(e) {
		e.stopPropagation();
		var $this = $(this);
		if($this.attr('aria-hidden') == 'true') return false;
		$this.attr('aria-hidden', 'true');
		var $shop = $($(this).attr('data-target'));
		var shopWidth = $shop.width();
		if(!$.isNull($shop.attr('width'))) {
			shopWidth = $shop.attr('width');
		} else {
			$shop.attr('width', shopWidth);
		}

		var $shopInner = $shop.find('.ufma-shopp-inner');
		if($shopInner.length == 0) {
			$shopInner = $('<div class="ufma-shopp-inner"></div>').css({
				'width': shopWidth + 'px',
				'display': 'block'
			}).trigger('create');
			$shop.wrapInner($shopInner);
		}

		$shopInner.css({
			'width': shopWidth + 'px',
			'display': 'block'
		});
		$this.hide();
		if($shop.hasClass('ufma-shopp-right')) {
			$shop.css({
				'width': '0px',
				'right': '0px',
				'box-shadow': '-2px 0px 5px rgba(0,0,0,.15)',
				'overflow-x': 'hidden'
			}).show().animate({
				'width': shopWidth + 'px'
			}, 300);
		} else {
			$shop.css({
				'width': '0px',
				'left': '0px',
				'box-shadow': '2px 0px 5px rgba(0,0,0,.15)',
				'overflow-x': 'hidden'
			}).show().animate({
				'width': shopWidth + 'px'
			}, 300);
		}

		$(window).off('click').on('click', function(e) {
			e.stopPropagation();
			$this.attr('aria-hidden', 'false');
			$shop.animate({
				'width': '0px',
				'box-shadow': 'none'
			}, 300, function() {
				$this.fadeIn();
			});
		});
	});
	//tabs切换样式
	$('.nav-tabs').on('click', 'li', function(e) {
		e.stopPropagation();
		if($(this).hasClass('active')) return false;
		$(this).closest('.nav-tabs').find('li.active').removeClass('active');
		$(this).addClass('active');
	});
	//

	$('.ufma-nav-fixed').on('click', '.ufma-nav-fixed-item', function(e) {
		e.stopPropagation();
		$(this).closest('.ufma-nav-fixed').find('.selected').removeClass('selected');
		$(this).addClass('selected');
	});

	//按钮点击后去掉焦点
	$(document).on('click', 'button', function(e) {
		e.preventDefault();
		$(this).blur();
		e.stopPropagation();
	});
	//按钮ajax后灰
	$('.btn-ajax').click(function(e) {
		$.data($('body')[0], 'btnAjax', $(this));
		/*var btn = $(this);
		btn.attr('disabled', 'true');
		var delay = $(this).attr('delay') || 0;
		if(delay != 0) {
			var timeID = setTimeout(function() {
				btn.removeAttr('disabled');
				clearTimeout(timeID);
			}, delay);
		}*/
	});
	// $('.ufma-layout-updown').each(function() {
	// 	var updownHeight = $(this).outerHeight(); 
	// 	var downHeight = $(this).find('.ufma-layout-down').outerHeight(true);
	// 	if (updownHeight <= 100) {
	// 		setTimeout(function() {
	// 			$(this).find('.ufma-layout-up').height($(this).outerHeight() - downHeight);
	// 		}, 0);
	// 	} else {
	// 		$(this).find('.ufma-layout-up').height(updownHeight - downHeight);
	// 	}
	// });
	//上下结构
	//guohx CWYXM-17879 账务处理，对账方案页面，设置银行对账单格式，样式有问题 20200708 
	//修改先获取页面弹窗高度赋给ufma-layout-updown 不然页面取出来100% 会认为是100Px进行赋值
	//CWYXM-15319【20200430 财务云8.20.15】mysql 基础资料-选用界面和下发成功界面显示不全
	$('.ufma-layout-updown').each(function() {
		var updownHeight = $(window).outerHeight(true); 
		$(this).css('height',updownHeight)
		var downHeight = $(this).find('.ufma-layout-down').outerHeight(true);
		$(this).find('.ufma-layout-up').height(updownHeight - downHeight);
	});

	var winH = $(window).height();
	$('.workspace').css({
		'min-height': winH - 16 + 'px'
	});

	$('input').attr('autocomplete', 'off');
	//解决火狐浏览器重新加载框架时没有清空搜索框内容的问题--zsj--bug82864
	$('.searchValueHide').attr('value', '');
	$(".searchHide").val('');
};

/*
 * 定义前端sessionStorage的key值
 * module：模块代码
 * compoCode:部件代码
 * rgCode：区划代码
 * setYear：年度
 * agencyCode：单位代码
 * acctCode：账套代码
 * code：自定义名称
 *
 */
ufma.sessionKey = function(module, compoCode, rgCode, setYear, agencyCode, acctCode, code) {
	return module + "_" + compoCode + "_" + rgCode + "_" + setYear + "_" + agencyCode + "_" + acctCode + "_" + code;
};

/*
 * 获取基础资料控制方式
 *
 */
ufma.getEleCtrlLevel = function(url, callback) {
	var argu = {};
	var ctrlName;
	var callback1 = function(result) {
		switch(result.data.agencyCtrlLevel) {
			case "0101":
				ctrlName = "提示：该要素为上下级公用,系统级数据启用/停用时，单位级数据会随之启用/停用";
				break;
			case "0102":
				ctrlName = "提示：该要素为上下级公用,系统级数据启用/停用时，单位级数据会随之启用/停用";
				break;
			case "0201":
				ctrlName = "提示：该要素为下级可细化,系统级数据启用/停用时，单位级数据会随之启用/停用";
				break;
			case "0202":
				ctrlName = "提示：该要素为下级可细化,系统级数据启用/停用时，单位级数据会随之启用/停用";
				break;
			case "03":
				ctrlName = "提示：该要素上下级无关";
				break;
			default:
				break;
		}
		callback(ctrlName, result.data.agencyCtrlLevel);
	};
	ufma.get(url, argu, callback1);
};
ufma.Base64 = function() {

	// private property 
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding 
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while(i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding 
	this.decode = function(input) {
		if(typeof(input) == "undefined") {
			return "";
		}
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while(i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding 
	_utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for(var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding 
	_utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while(i < utftext.length) {
			c = utftext.charCodeAt(i);
			if(c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};
ufma.getFapVersion = function(callback){
	$.ajax({
		url: '/ma/sys/common/getFapVersion',
		type: 'GET',
		async: false, //或false,是否异步
		cache: false,
		data: {},
		processData: false,
		contentType: false
	}).done(function (res) {
		if(res.flag == "success"){
			callback(res);
		}
	}).fail(function (res) {
	});
}
var commonData;
ufma.getCommonDatafornew=function(){
	var base = new ufma.Base64();
	var test = {};
	var portalCommonData = {};
	ufma.getFapVersion(function(res){
		if (res.data == "1") { //85
			$.ajax({
				url: '/ma/sys/common/getParamBean',
				type: 'GET',
				async: false, //或false,是否异步
				cache: false,
				data: {},
				processData: false,
				contentType: false
			}).done(function (res) {
				commonData = res.data;
				if ($.isNull(commonData)) {
					var cdDate, cdMonth, cdYear, cdDay;
					cdDate = new Date();
					cdYear = cdDate.getFullYear();
					cdMonth = cdDate.getMonth() + 1;
					cdMonth = (cdMonth > 9) ? cdMonth : ("0" + cdMonth);
					cdDay = cdDate.getDate();
					cdDay = (cdDay > 9) ? cdDay : ("0" + cdDay);
					cdDay = cdYear + "-" + cdMonth + "-" + cdDay;
					commonData = {
						svAgencyCode: "3001",
						svFiscalPeriod: cdDate.getMonth() + 1,
						svSetYear: cdYear,
						svRgCode: "87",
						//区划为空base.decode(portalCommonData.svRgCode),
						svTransDate: cdDay,
						svUserId: "50CE95E4584F446BBB02CF83ED0BFCD2",
						svRoleName: "财务pf测试环境角色",
						svSysDate: cdDay + " " + cdDate.getHours() + ":" + cdDate.getMinutes() + ":" + cdDate.getSeconds(),
						svRoleCode: null,
						svAcctCode: "cs70402",
						svAcctName: "高校70402",
						svUserCode: "sa",
						svMenuId: "",
						//菜单id为空
						svUserName: "超牛sa财务管理员",
						svAgencyName: "测试单位1",
						svRgName: null,
						//区划名称为空
						svRoleId: 87
					}
				}
			}).fail(function (res) {
				//ufma.showTip("导入失败！",function(){},"error");
			});
		} else {
			portalCommonData = JSON.parse(localStorage.getItem("commonData"));
			if ($.isNull(portalCommonData)) {
				if (location.href.indexOf('/pf/vue/prs/mySalaryMobile') > -1) {
					return {}
				} else {
					var reloginHtml = '/pf/portal/login/relogin.html';
					//top.location.href = reloginHtml;
				}
			}
			var roleId = ufma.getUrlParam('roleId')
			if ($.isNull(roleId)) {
				roleId = base.decode(portalCommonData.svRoleId);
			}
			commonData = {
				svAgencyCode: base.decode(portalCommonData.svAgencyCode),
				svFiscalPeriod: base.decode(portalCommonData.svFiscalPeriod),
				svSetYear: base.decode(portalCommonData.svSetYear),
				svRgCode: base.decode(portalCommonData.svRgCode),
				//区划为空base.decode(portalCommonData.svRgCode),
				svTransDate: base.decode(portalCommonData.svTransDate),
				svUserId: base.decode(portalCommonData.svUserId),
				svRoleName: base.decode(portalCommonData.svRoleName),
				svSysDate: base.decode(portalCommonData.svSysDate),
				svRoleCode: base.decode(portalCommonData.svRoleCode),
				svAcctCode: base.decode(portalCommonData.svAcctCode),
				svAcctName: base.decode(portalCommonData.svAcctName),
				svUserCode: base.decode(portalCommonData.svUserCode),
				svMenuId: base.decode(portalCommonData.svMenuId),
				//菜单id为空
				svUserName: base.decode(portalCommonData.svUserName),
				svAgencyName: base.decode(portalCommonData.svAgencyName),
				svRgName: base.decode(portalCommonData.svRgName),
				//区划名称为空
	
				svRoleId: roleId,
				token: base.decode(portalCommonData.token)
			};
			/**********集成门户后，不使用我请干掉我，然后把上方注释的代码取消，谢谢。***********/
	
			if (localStorage.getItem("commonData") != null) {
				portalCommonData = JSON.parse(localStorage.getItem("commonData"));
				//console.log(localStorage.getItem("commonData"));
				commonData = {
					svAgencyCode: base.decode(portalCommonData.svAgencyCode),
					svFiscalPeriod: base.decode(portalCommonData.svFiscalPeriod),
					svSetYear: base.decode(portalCommonData.svSetYear),
					svRgCode: base.decode(portalCommonData.svRgCode),
					//区划为空base.decode(portalCommonData.svRgCode),
					svTransDate: base.decode(portalCommonData.svTransDate),
					svUserId: base.decode(portalCommonData.svUserId),
					svRoleName: base.decode(portalCommonData.svRoleName),
					svSysDate: base.decode(portalCommonData.svSysDate),
					svRoleCode: base.decode(portalCommonData.svRoleCode),
					svAcctCode: base.decode(portalCommonData.svAcctCode),
					svAcctName: base.decode(portalCommonData.svAcctName),
					svUserCode: base.decode(portalCommonData.svUserCode),
					svMenuId: base.decode(portalCommonData.svMenuId),
					//菜单id为空
					svUserName: base.decode(portalCommonData.svUserName),
					svAgencyName: base.decode(portalCommonData.svAgencyName),
					svRgName: base.decode(portalCommonData.svRgName),
					//区划名称为空
					svRoleId: base.decode(portalCommonData.svRoleId),
					token: base.decode(portalCommonData.token)
				}
			} else {
				var cdDate, cdMonth, cdYear, cdDay;
				cdDate = new Date();
				cdYear = cdDate.getFullYear();
				cdMonth = cdDate.getMonth() + 1;
				cdMonth = (cdMonth > 9) ? cdMonth : ("0" + cdMonth);
				cdDay = cdDate.getDate();
				cdDay = (cdDay > 9) ? cdDay : ("0" + cdDay);
				cdDay = cdYear + "-" + cdMonth + "-" + cdDay;
				commonData = {
					svAgencyCode: "3001",
					svFiscalPeriod: cdDate.getMonth() + 1,
					svSetYear: cdYear,
					svRgCode: "87",
					//区划为空base.decode(portalCommonData.svRgCode),
					svTransDate: cdDay,
					svUserId: "50CE95E4584F446BBB02CF83ED0BFCD2",
					svRoleName: "财务pf测试环境角色",
					svSysDate: cdDay + " " + cdDate.getHours() + ":" + cdDate.getMinutes() + ":" + cdDate.getSeconds(),
					svRoleCode: null,
					svAcctCode: "cs70402",
					svAcctName: "高校70402",
					svUserCode: "sa",
					svMenuId: "",
					//菜单id为空
					svUserName: "超牛sa财务管理员",
					svAgencyName: "测试单位1",
					svRgName: null,
					//区划名称为空
					svRoleId: 87
				}
			}
		}	
	});
}
ufma.getUrlParam= function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if(r != null)
		return unescape(r[2]);
	return ""; // 返回参数值
}
ufma.getCommonDatafornew()
ufma.getCommonData = function() {
	
	/**********集成门户后，不使用我请干掉我，然后把上方注释的代码取消，谢谢。***********/
	//如果有单位账套的缓存，则取缓存的值
	var selEnviornmentVar = ufma.getSelectedVar();
	if(selEnviornmentVar) {
		commonData.svAgencyCode = !$.isNull(selEnviornmentVar.selAgecncyCode) ? selEnviornmentVar.selAgecncyCode : commonData.svAgencyCode;
		commonData.svAgencyName = !$.isNull(selEnviornmentVar.selAgecncyName) ? selEnviornmentVar.selAgecncyName : commonData.svAgencyName;
		commonData.svAcctCode = !$.isNull(selEnviornmentVar.selAcctCode) ? selEnviornmentVar.selAcctCode : commonData.svAcctCode;
		commonData.svAcctName = !$.isNull(selEnviornmentVar.selAcctName) ? selEnviornmentVar.selAcctName : commonData.svAcctName;
	}
	return commonData;
};
ufma.setSelectedVar = function(params) {
	var base = new ufma.Base64();
	var selEnviornmentVar = {
		selAgecncyCode: params.selAgecncyCode ? base.encode(params.selAgecncyCode) : "",
		selAgecncyName: params.selAgecncyName ? base.encode(params.selAgecncyName) : "",
		selAcctCode: params.selAcctCode ? base.encode(params.selAcctCode) : base.encode(ufma.getCommonData().svAcctCode),
		selAcctName: params.selAcctName ? base.encode(params.selAcctName) : base.encode(ufma.getCommonData().svAcctName),
		selAccBookCode: params.selAccBookCode ? base.encode(params.selAccBookCode) : "",
		selAccBookName: params.selAccBookName ? base.encode(params.selAccBookName) : "",
	};
	sessionStorage.setItem("selEnviornmentVar", JSON.stringify(selEnviornmentVar))

};
ufma.getSelectedVar = function() {
	var base = new ufma.Base64();
	var getSelEnviornmentVar = JSON.parse(sessionStorage.getItem("selEnviornmentVar"));
	if(getSelEnviornmentVar) {
		var selEnviornmentVar = {
			selAgecncyCode: getSelEnviornmentVar.selAgecncyCode ? base.decode(getSelEnviornmentVar.selAgecncyCode) : "",
			selAgecncyName: getSelEnviornmentVar.selAgecncyName ? base.decode(getSelEnviornmentVar.selAgecncyName) : "",
			selAcctCode: getSelEnviornmentVar.selAcctCode ? base.decode(getSelEnviornmentVar.selAcctCode) : "",
			selAcctName: getSelEnviornmentVar.selAcctName ? base.decode(getSelEnviornmentVar.selAcctName) : "",
			selAccBookCode: getSelEnviornmentVar.selAccBookCode ? base.decode(getSelEnviornmentVar.selAccBookCode) : "",
			selAccBookName: getSelEnviornmentVar.selAccBookName ? base.decode(getSelEnviornmentVar.selAccBookName) : "",
		};
		return selEnviornmentVar;
	}

};
ufma.setPortalHeight = function() {
	$('body').css('min-height', window.parent.document.documentElement.clientHeight - 80 + 'px');
	$('.ufma-container').css('min-height', window.parent.document.documentElement.clientHeight - 80 + 'px');
	//$('.content-wrapper',window.parent.document).height($('body').height()+40+'px');
};
ufma.searchHideShow = function(selector, btnSelector) {
	$(".searchHide").css({
		"width": "160px",
		"display": "inline-block"
	});
	var ele;
	if(btnSelector) {
		ele = $(btnSelector)
	} else {
		ele = $("#searchHideBtn");
	}
	if(ele.length == 0) {
		$(".searchHide").addClass("hidden")
	}
	var searchHide = ele.closest(".iframeBtnsSearch").find(".searchHide");
	var searchValueHide = ele.closest(".iframeBtnsSearch").find(".searchValueHide");

	function doSearch(val) {
		if((!$.data($(selector)[0], 'dosearch') || $.data($(selector)[0], 'dosearch') == '0') && val == '') {
			return false;
		}
		ufma.showloading('正在过滤数据，请耐心等待...');
		if($.data($(selector)[0], 'dosearch') == '1' && val == '') {
			$.data($(selector)[0], 'dosearch', '0');
		} else {
			$.data($(selector)[0], 'dosearch', '1');
		};
		if($(selector).hasClass('dataTable')) {
			$(selector).dataTable().api(true).search(val).draw();
		} else if($(selector).hasClass('uf-datagrid')) {
			setTimeout(function() {
				$(selector).getObj().search(val);
			}, 300);
		} else {
			ufma.showTip('不支持该表格搜索', function() {}, 'warning');
		}
		$(searchHide).focus();
		ufma.hideloading();
		ufma.setBarPos($(window));
	}

	//$(".searchHide").off().focus(function() {
	$(searchHide).off().on('keydown', function(e) {
		var val = $(this).val();
		if(e.keyCode == 13) {
			doSearch(val);
			$(searchValueHide).val(val);
		}
	});
	//});
	ele.off('click').on("click", function(evt) {
		evt.stopPropagation();
		// if($(searchHide).hasClass("focusOff")) {
		// 	var newVal = $(searchValueHide).val();
		// 	if(newVal != "") {
		// 		$(searchHide).val(newVal);
		// 	}
		// 	$(searchHide).show().animate({
		// 		"width": "160px"
		// 	}).focus().removeClass("focusOff");
		// } else {
		// 	var val = $(this).siblings("input[type='text']").val();

		// 	//$(selector).DataTable().search(val).draw();
		// 	doSearch(val);
		// 	$(searchValueHide).val(val);
		// }
		var val = $(this).siblings("input[type='text']").val();

		//$(selector).DataTable().search(val).draw();
		doSearch(val);
		$(searchValueHide).val(val);
	});
	// $(".iframeBtnsSearch").on("mouseleave", function() {
	// 	var searchHide = $(this).find(".searchHide");
	// 	if(!$(searchHide).hasClass("focusOff") && searchHide.val() == "") {
	// 		$(searchHide).animate({
	// 			"width": "0px"
	// 		}, "", "", function() {
	// 			$(searchHide).css("display", "none");
	// 		}).addClass("focusOff");
	// 	}
	// });
};
//解析url数据
ufma.GetQueryString = function(key) {
	// 获取参数
	var url = window.location.href;
	//截取？后的字符
	url = url.substring(url.indexOf("?"));
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	return result ? decodeURIComponent(result[2]) : null;
}
//通过角色菜单判断资源标识显示与否
ufma.isShow = function(data) {
	if(data != null) {
		for(var i = 0; i < data.length; i++) {
			$("." + data[i].code).removeClass('btn-permission');		
		}
	}
};
//权限用ajax
ufma.QXajax = function(url, callback) {
	if($.isNull(url)) return false;

	var tokenid = ufma.getCommonData().token;
	//console.log("tokenid:" + tokenid);
	if(tokenid == undefined) {
		tokenid = "";
	}
	//加入tokenid（判断url里有没有？）
	if(url.indexOf("?") != -1) {
		url = url + "&ajax=1";
	} else {
		url = url + "?ajax=1";
	}
	if(typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
		if(url.indexOf('?') > 0) {
			url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
		} else {
			url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
		}
	}
	$.ajax({
		url: url,
		type: 'get', //GET
		async: false, //或false,是否异步
		//		data:argu,
		timeout: 600000, //超时时间
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		contentType: 'application/json; charset=utf-8',
		beforeSend: function(xhr) {
			//console.log(xhr)
			//console.log('发送前')
			//ufma.showloading('正在请求数据，请耐心等待...');
		},
		success: function(result) {

			callback(result);

		},
		error: function(jqXHR, textStatus) {
			var $btn = $.data($('body')[0], 'btnAjax');
			if($btn) {
				$btn.removeAttr('disabled');
			}
			ufma.hideloading();
			var error = "";
			switch(jqXHR.status) {
				case 408:
					error = "请求超时";
					break;
				case 500:
					error = "服务器错误";
					break;
				default:
					break;
			}
			if(error != "") {
				ufma.alert(error);
				return false;
			}
		},
		complete: function(data) {
			var $btn = $.data($('body')[0], 'btnAjax');
			if($btn) {
				$btn.removeAttr('disabled');
			}
		}
	});
};
//根据svMenuId和svRoleId获取按钮权限 
ufma.getPermission = function () {
	var reslist = [];
	var menuid;
	var permissionCalback = function (result) {
		reslist = result;
	}
	//85平台的menuid和80不一致，需要请求后端重新获取 解决页面联查menuid不对问题 guohx  20200910
	ufma.getFapVersion(function (res) {
		if (res.data == "1" && ufma.GetQueryString("isJump") == "1") { //85平台 并且是从页面链接跳转过来的
			var callback = function (result) {
				menuid = result.data[0].id;
				var roleId = $.getUrlParam('roleId')
				if ($.isNull(roleId)) {
					roleId = ufma.getCommonData().svRoleId;
				}
				ufma.QXajax("/crux-appmodule/api/operation?appFunction.id=" + menuid + "&svRoleId=" + roleId, permissionCalback)
			}
			ufma.ajaxDef("/ma/sys/common/selectMenuCodeById", 'get',
				{
					menuId: ufma.GetQueryString("menuid")
				}, callback)
		} else {
			menuid = ufma.GetQueryString("menuid");
			var roleId = $.getUrlParam('roleId')
			if ($.isNull(roleId)) {
				roleId = ufma.getCommonData().svRoleId;
			}
			ufma.QXajax("/crux-appmodule/api/operation?appFunction.id=" + menuid + "&svRoleId=" + roleId, permissionCalback)
		}
	})
	return reslist;
};

//根据自己页面按钮的需求，和权限，获得新的对象，根据对象决定节点的创建
ufma.hasMoreBtn = function(reslist, wantBtns, showFunc) {
	var showBtns = [];
	//遍历传入的对象
	for(var i = 0; i < wantBtns.length; i++) {
		//遍历权限
		for(var j = 0; j < reslist.length; j++) {
			if(wantBtns[i].id == reslist[j].id && reslist[j].flag != "0") {
				showBtns.push(wantBtns[i]);
			}
		}
	}
	showFunc(showBtns);
};
//dataTable分页长度
ufma.dtPageLength = function($dataTable) {
	var lsId = window.location.pathname + $($dataTable).attr('id');
	var defLen = localStorage.getItem(lsId);
	if($.isNull(defLen)) {
		//defLen = 20;
		defLen = 100; //默认每页显示100条--zsj--吉林公安需求
	} else {
		defLen = parseInt(defLen);
	}
	if($($dataTable).closest('.dataTables_wrapper').length == 0) return defLen;
	var oTable = $($dataTable).dataTable();
	var oSettings = oTable.fnSettings();
	if($.isNull(oSettings)) return defLen;
	var pl = oSettings._iDisplayLength;
	setTimeout(function() {
		localStorage.setItem(lsId, pl);
	}, 300);
	return pl;
}
//后端分页记忆
ufma.dtPageLengthbackend = function(id, val) {
	var lsId = window.location.pathname + id;
	var defLen = localStorage.getItem(lsId);
	if($.isNull(defLen)) {
		if($.isNull(val)) {
			defLen = 100; //默认每页显示100条--zsj--吉林公安需求
		} else {
			defLen = parseInt(val);
		}
	} else {
		if($.isNull(val)) {
			defLen = parseInt(defLen);
		} else {
			defLen = parseInt(val);
		}
	}
	var pl = defLen;
	setTimeout(function() {
		localStorage.setItem(lsId, pl);
	}, 300);
	return pl;
}
/**
 * 导出控件
 * dt 表格的id
 * fileName 表的名字
 * topInfo 表格以外的表格上边的内容
 * type 是否多表头
 */
ufma.expXLSForDatatable = function(dt, fileName, topInfo, type) {
	var oTable = $(dt).dataTable();
	var tblData = oTable.fnGetData(),
		tblCols = oTable.fnSettings().aoColumns;

	var expCols = tblCols.select(function(el, i, res, param) {
		if(!el.className) {
			return el.bVisible;
		} else {
			return el.bVisible && el.className.indexOf('isprint') >= 0;
		}
	});
	var tmpCols = [];
	//for(var i = 0; i < expCols.length; i++) {
	$.each(expCols, function(i, col) {
		if(col.data) {
			col.className = col.className || '';
			var sTitle = $(col.nTh)[0].innerText;
			var expCol = {
				field: col.data,
				name: sTitle,
				className: col.className,
				align: 'left'
			}
			if(col.className.indexOf('tdNum') >= 0) {
				expCol.render = function(rowid, rowdata, data) {
					var fmtData = $.formatMoney(data);
					return fmtData == '0.00' ? '' : fmtData;
				}
				expCol.align = "right";
			}
			if(!$.isNull(col.render) && typeof(col.render) == 'function') {
				expCol.render = function(rowid, rowdata, data) {
					var meta = {
						row: rowid,
						col: i,
						settings: oTable.fnSettings()
					};
					var rtn = col.render(data, 'num', rowdata, meta);
					return $('<span>' + rtn + '</span>').text();
				}
			}
		}
		if(!$.isNull(expCol)) {
			tmpCols.push(expCol);
		}

	});
	var opts = {
		title: fileName,
		data: tblData,
		columns: [tmpCols],
		dt: dt
	};
	if(topInfo && topInfo != "") {
		opts.topInfo = topInfo;
	}
	if(type) {
		opts.type = type
	}
	uf.expTable(opts);
}
ufma.printForPT = function(settings) {
	var uls = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
	var defaults = {
		printServiceUrl: uls,
		modalCode: '100', //模块默认财务
		printModal: '', //打印模板
		print: 'print', //打印print|预览blank
		data: []
	}
	var opts = $.extend({}, defaults, settings);
	var pData = opts.data;

	var domain = opts.printServiceUrl + '/pqr/pages/query/query.html';
	var uniqueInfo = new Date().getTime().toString()
	var url = domain +
		'?sys=' + opts.modalCode + '&code=' + opts.printModal + '&' + opts.print + '&' +
		'uniqueInfo=' + uniqueInfo
	var myPopup = window.open(url, uniqueInfo);
	var dataCnt = 0;
	var connected = false;
	var index = setInterval(function() {
		if(connected) {
			clearInterval(index)
		} else {
			var message = {
				uniqueInfo: uniqueInfo,
				type: 0
			}
			//send the message and target URI
			myPopup.postMessage(message, domain)
		}
	}, 2000)
	window.addEventListener('message', function(event) {
		//连接通信
		if(event.data.hasOwnProperty('uniqueInfo')) {
			if(event.data.uniqueInfo === uniqueInfo) {
				if(event.data.result === 0) {
					connected = true;
					//如果发送测试数据未关闭，先关闭发送测试数据index
					console.log(event.data.uniqueInfo)
					//第一遍发送数据
					var message;
					var dType = 1;
					if(1 == pData.data.length) {
						dType = 2;
					}
					message = {
						uniqueInfo: uniqueInfo,
						type: dType,
						dataType: 1,
						data: {
							'GL_RPT_PRINT': pData.data[0]
						}
					}
					if(settings.headData) {
						message.data["GL_RPT_HEAD_EXT"] = settings.headData;
					}
					console.log(JSON.stringify(message))
					myPopup.postMessage(message, domain)
				} else if(event.data.result === 1) {
					if(connected) {
						dataCnt++;
						var message;
						var dType = 1;
						if(dataCnt == (pData.data.length - 1)) {
							dType = 2;
						}
						message = {
							uniqueInfo: uniqueInfo,
							type: dType,
							dataType: 1,
							data: {
								'GL_RPT_PRINT': pData.data[dataCnt]
							}
						}
						if(settings.headData) {
							message.data["GL_RPT_HEAD_EXT"] = settings.headData;
						}
						console.log(JSON.stringify(message))
						myPopup.postMessage(message, domain)
					}
				} else {
					console.log(event.data.reason)
				}
			}
		}
	}, false);
}
ufma.printForPTPdf = function(settings) {
	var opts = settings;
	var xhr = new XMLHttpRequest()
	var formData = new FormData()
	formData.append('reportCode', opts.valueid)
	formData.append('templId', opts.templId)
	var datas = [{
		"GL_RPT_PRINT": opts.data.data[0],
		'GL_RPT_HEAD_EXT': opts.headData
	}]
	formData.append('groupDef', JSON.stringify(datas))
	xhr.open('POST', '/pqr/api/printpdfbydata', true)
	xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
	xhr.responseType = 'blob'

	//保存文件
	xhr.onload = function(e) {
		if(xhr.status === 200) {
			if(xhr.status === 200) {
				var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
				window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
			}
		}
	}

	//状态改变时处理返回值
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {
			//通信成功时
			if(xhr.status === 200) {
				//交易成功时
				ufma.hideloading();
			} else {
				var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
				//提示框，各系统自行选择插件
				alert(content)
				ufma.hideloading();
			}
		}
	}
	xhr.send(formData)
}
ufma.each = function(array, process, callback) {
	var i = 0,
		len = array.length;
	var timeId = setTimeout(function() {
		clearTimeout(timeId);
		var row = array[i];
		process(i, row);
		i++;
		if(i < len) {
			setTimeout(arguments.callee, 0);
		} else {
			if(callback) {
				callback();
			}
		}
	}, 0);

};
function download(data, strFileName, strMimeType) {
	
	var self = window, // this script is only for browsers anyway...
		u = "application/octet-stream", // this default mime also triggers iframe downloads
		m = strMimeType || u, 
		x = data,
		D = document,
		a = D.createElement("a"),
		z = function(a){return String(a);},
		
		
		B = self.Blob || self.MozBlob || self.WebKitBlob || z,
		BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
		fn = strFileName || "download",
		blob, 
		b,
		ua,
		fr;

	//if(typeof B.bind === 'function' ){ B=B.bind(self); }
	
	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
		x=[x, m];
		m=x[0];
		x=x[1]; 
	}
	
	
	
	//go ahead and download dataURLs right away
	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
			navigator.msSaveBlob(d2b(x), fn) : 
			saver(x) ; // everyone else can save dataURLs un-processed
	}//end if dataURL passed?
	
	try{
	
		blob = x instanceof B ? 
			x : 
			new B([x], {type: m}) ;
	}catch(y){
		if(BB){
			b = new BB();
			b.append([x]);
			blob = b.getBlob(m); // the blob
		}
		
	}
	
	
	
	function d2b(u) {
		var p= u.split(/[:;,]/),
		t= p[1],
		dec= p[2] == "base64" ? atob : decodeURIComponent,
		bin= dec(p.pop()),
		mx= bin.length,
		i= 0,
		uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new B([uia], {type: t});
	 }
	  
	function saver(url, winMode){
		
		
		if ('download' in a) { //html5 A[download] 			
			a.href = url;
			a.setAttribute("download", fn);
			a.innerHTML = "downloading...";
			D.body.appendChild(a);
			setTimeout(function() {
				a.click();
				D.body.removeChild(a);
				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
			}, 66);
			return true;
		}
		
		//do iframe dataURL download (old ch+FF):
		var f = D.createElement("iframe");
		D.body.appendChild(f);
		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
		}
		 
	
		f.src = url;
		setTimeout(function(){ D.body.removeChild(f); }, 333);
		
	}//end saver 
		

	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		return navigator.msSaveBlob(blob, fn);
	} 	
	
	if(self.URL){ // simple fast and modern way using Blob and URL:
		saver(self.URL.createObjectURL(blob), true);
	}else{
		// handle non-Blob()+non-URL browsers:
		if(typeof blob === "string" || blob.constructor===z ){
			try{
				return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  ); 
			}catch(y){
				return saver( "data:" +  m   + "," + encodeURIComponent(blob)  ); 
			}
		}
		
		// Blob but not URL:
		fr=new FileReader();
		fr.onload=function(e){
			saver(this.result); 
		};
		fr.readAsDataURL(blob);
	}	
	return true;
} /* end download() */


import $ from 'jquery'
import axios from '../http.js'
/**
 * @description: 创建表格
 */
const createTable = function(options) {
	var columns = [];
	var colInfo = new Array();
	var colIndex = 0;
	var prevRow = null;

	var $table = $('<table border="1" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; word-break: keep-all; border-color: Black;"></table>');
	var $thead = $('<thead></thead>').appendTo($table);
	var $tbody = $('<tbody></tbody>').appendTo($table);
	var $mergeTr = null;

	function initTheadColumns() {
		var rowCount = options.columns.length;
		for(var i = 0; i < rowCount; i++) {
			columns[i] = new Array();
		}

		for(var irow = 0; irow < rowCount; irow++) {
			var row = options.columns[irow];
			$.each(row, function(icol, col) {
				var iColspan = 1;
				if(col.hasOwnProperty('colspan')) {
					iColspan = col.colspan;
				}
				if(col['type'] == 'indexcolumn') {
					col.field = 'indexcolumn';
				}
				if(col['type'] == 'checkbox') {
					col.field = 'checkbox';
				}
				var colField = col['field'];

				for(var j = irow; j < rowCount; j++) {
					if(irow == 0) {
						columns[j].push(colField);
						for(var k = 1; k < iColspan; k++) {
							columns[j].push('');
						}
					} else {
						for(var m = 0; m < columns[j].length; m++) {
							if(columns[j][m] == '') {
								columns[j][m] = colField;
								break;
							}
						}
					}
				}

			});
		}
	}

	function createTableHead() {
		for(var irow = 0; irow < options.columns.length; irow++) {
			var column = columns[irow];
			var row = options.columns[irow];
			var tr = '<tr>';
			var iCol = 0;
			$.each(row, function(icol, col) {
				iCol = iCol + 1;
				var iRowspan = 1;
				if(col.hasOwnProperty('rowspan')) {
					iRowspan = col.rowspan;
				}
				var rowspan = '';
				if(iRowspan > 1) rowspan = ' rowspan=' + iRowspan;

				var iColspan = 1;
				if(col.hasOwnProperty('colspan')) {
					iColspan = col.colspan;
				}
				var colspan = '';
				if(iColspan > 1) colspan = ' colspan=' + iColspan;

				var headalign = '';
				if(col.hasOwnProperty('headalign')) {
					headalign = 'text-align:' + col.headalign + ';';
				}

				if(col['type'] == 'indexcolumn') {
					col.field = 'indexcolumn';
				}
				if(col['type'] == 'checkbox') {
					col.field = 'checkbox';
					col.name = '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" class="check-all" index=' + icol + ' value="1"><span></span></label>';
				}

				var index = column.indexOf(col.field);
				if(index > -1) {
					colInfo[index] = col;
					iCol = index + 1;
				}

				var lastCell = '';
				if(iCol == column.length) lastCell = 'last-cell';

				tr += '<th class=" ' + lastCell + '" ' + colspan + rowspan + ' ' + col.className + ' ><span style="' + headalign + '" >' + col.name + '</span></th>';

				var width = '100px';
				if(col.hasOwnProperty('width')) {
					width = col.width + 'px;';
				} else {
					col.width = '100';
				}

				if(col['type'] == 'checkbox') {
					width = '48px';
					col.width = '48';
				}

				if(iColspan > 1) iCol = iCol + iColspan;
			});
			tr += '</tr>';
			$(tr).appendTo($thead);
		};

		var fixedRow = '<tr class="no-print" style="height:0px;">';
		for(var i = 0; i < colInfo.length; i++) {
			var col = colInfo[i];
			var width = col['width'] || 100;
			fixedRow += '<td style = "padding:0;border:0;margin:0;height:0px;width:' + width + 'px"></td>';
		}
		fixedRow += '</tr>';

		$thead.prepend(fixedRow);
		/*start zxj2019-5-24余额表等账表不能打印所有数据，只能打印当前页，所以加了以下代码*/
		if(options.dt && options.type) {
			$thead.html("");
			var newdt = options.dt;
			var $newHead = $(newdt).find("thead");
			$thead.append($newHead.html());
		}
		/* end*/

	}

	function addRow(row) {
		colIndex = colIndex + 1;
		var rowid = $.getGuid();
		var idField = options['idField'];
		if(idField != undefined && idField != 'undefined' && row != null && row != undefined) {
			if(!$.isNull(row[idField])) {
				rowid = options['id'] + '_row_' + row[idField];
			}
		};

		var mergeColumns = options['mergeColumns'] || function(rowdata) {
			return []
		};
		var merges = mergeColumns(row);
		var mergeRows = options['mergeRows'] || function(prevRow, rowdata) {
			return []
		};

		var mrows = [];
		if(!$.isNull(prevRow)) {
			mrows = mergeRows(prevRow, row);
		}

		var pid = row[options['pId']];
		if($.isNull(pid)) pid = rowid;
		var tr = '<tr id="' + rowid + '" pid="' + pid + '">';
		for(var icol = 0; icol < colInfo.length; icol++) {
			var col = colInfo[icol];

			var colText = '';
			if(col['field'] == 'indexcolumn') {
				colText = colIndex;
			} else if(col['field'] == 'checkbox') {
				colText = '<label class="mt-checkbox mt-checkbox-outline"><input data-id="' + row[idField] + '" rowid="' + rowid + '" pid="' + pid + '" class="check-item" index=' + icol + ' type="checkbox" value="1"><span></span></label>';
			} else {
				colText = row[col['field']];
			}

			var align = '';
			if(col.hasOwnProperty('align')) {
				align = 'text-align:' + col.align + ';';
			}
			var sclass = col['className'] || '';

			var render = col['render'] || function(rowid, rowdata, text) {
				return text;
			}
			colText = render(rowid, row, colText);
			if(colText == undefined || colText == 'undefined') colText = '';

			var colspan = '';
			var mergeTdClass = '';
			for(var iMerge = 0; iMerge < merges.length; iMerge++) {
				var merge = merges[iMerge];

				if(merge['columnIndex'] == icol) {
					colspan = ' colspan=' + merge['colSpan'];
					mergeTdClass = merge['className'] || '';
					if(!$.isNull(merge['text'])) {
						colText = merge['text'];
					}
					icol = icol + merge['colSpan'] - 1;
					break;
				}
			}

			var tdtypeClass = col['type'] || '';
			var lastCell = '';
			if(icol == colInfo.length - 1) {
				lastCell = 'last-cell';
			};

			tr += '<td class="' + sclass + ' ' + tdtypeClass + ' ' + mergeTdClass + lastCell + ' ' + col.className + '" ' + colspan + ' style="' + align + '">' + colText + '</td>';

		}
		var $tr = $(tr).appendTo($tbody);
		if(mrows.length == 0) {
			$mergeTr = $tr;
		}
		for(var i = 0; i < mrows.length; i++) {
			$tr.find('td:eq(' + mrows[i] + ')').remove();
			var column = $mergeTr.find('td:eq(' + mrows[i] + ')');
			var rowspan = column.attr('rowspan') || 1;
			column.attr('rowspan', parseInt(rowspan) + 1);
		}

		prevRow = row;
	}

	function createTableBody() {
		colIndex = 0;
		for(var irow = 0; irow < options.data.length; irow++) {
			var row = options.data[irow];
			addRow(row);
		}
	}

	initTheadColumns();
	createTableHead();
	createTableBody();
	return $table;
};

/**
 * @description: 构造一个表格 从 uf.core.min.js 拷贝而来
 * @param {Object} 接收一个表格构造参数
 * @return {Promise} 返回一个promise对象
 */
export const constructTableExport = function(opts) {
  var getFileName = function() {
		return opts.title;
  }
  
  var HtmlExportToExcel = function(table) {
    var template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>td{text-align:left;}#expTableTitle{text-align:center;}.tdNum{text-align:right;}.tc{text-align:center;}.tr{text-align:right;}.tl{text-align:left;}</style></head><body><table>{table}</table></body></html>',
      format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) {
          return c[p]
        })
      }

    function downfile(fileName, fileContent) {
      var url = '/pub/file/export'

      var params = {
        fileName: encodeURI(fileName),
        fileContent: fileContent,
      }
      return axios.post(url, params).then((result) => {
        return new Promise((resolve, reject)=> {
          if(result.data.data.attachGuid) {
            window.location.href = '/pub/file/download?attachGuid=' + result.data.data.attachGuid + '&fileName=' + decodeURI(result.data.data.fileName)
            resolve(true)
          }else{
            reject('服务端未能生成导出文件')
          }
        })
      })
    }

    var filename = getFileName()
    if (!table) {
      table = $(table)
    }
    var ctx = {
      worksheet: filename || 'Worksheet',
      table: table.html(),
    }

    var wkseet = format(template, ctx)

    return downfile(filename + '.xls', wkseet)
  }

  var exportTable = opts.exportTable
  //自定义
  var columns = opts.columns || []
  if (columns.length > 0) {
    exportTable = createTable(opts)
    exportTable.addClass('table-export')
  }

  var $panelExcel = $('#panelExcel')
  if ($panelExcel.length == 0) {
    $panelExcel = $('<div id="panelExcel">')
  }
  $panelExcel.html('')

  //--------------------------------------------
  var colCount = 1
  $(exportTable)
    .find('tr')
    .each(function() {
      var tmpCount = $(this).find('td').length
      if (tmpCount == colCount) return true
      colCount = tmpCount > colCount ? tmpCount : colCount
    })
  var $gridTop = $('<table class="grid-top" cellspacing="0" cellpadding="0" align="center" border="0"></table>')
  $('<tr><td align="center" colspan="' + colCount + '" style="min-height: 40px"><h3 id="expTableTitle">' + (opts.title ? opts.title : '') + '</h3></td></tr>').appendTo($gridTop)
  if (opts.topInfo) {
    var topInfoNum = 1
    for (var i = 0; i < opts.topInfo.length; i++) {
      topInfoNum = colspan > opts.topInfo[i].length ? topInfoNum : opts.topInfo[i].length
    }
    var colspan = Math.ceil(colCount / topInfoNum)
    for (var i = 0; i < opts.topInfo.length; i++) {
      var row = opts.topInfo[i]
      var tr = '<tr>'
      for (var j = 0; j < row.length; j++) {
        tr += '<td colspan=' + colspan + '>' + row[j] + '</td>'
      }
      tr += '</tr>'
      $(tr).appendTo($gridTop)
    }
  }
  $gridTop.appendTo($panelExcel)
  //----------------------------------------------
  if (columns.length > 0) {
    $(exportTable).appendTo($panelExcel)
  } else {
    var cloneTable = $(exportTable).clone()
    cloneTable.appendTo($panelExcel)
    $('<table border="1" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; word-break: keep-all; border-color: Black;"></table>')
    $panelExcel.find('table:not(.grid-top)').attr({
      border: '1',
      cellpadding: '0',
      cellspacing: '0',
      align: 'center',
    })
    $panelExcel.find('table:not(.grid-top)').css({
      'border-collapse': 'collapse',
      'word-break': 'keep-all',
      'border-color': 'Black',
    })
  }

  //--------------------------------------------
  //增加表格底部表外项 guohx 20200630
  var $gridBottom = $('<table class="grid-bottom" cellspacing="0" cellpadding="0" align="center" border="0"></table>')
  if (opts.bottomInfo) {
    var topInfoNum = 1
    for (var i = 0; i < opts.bottomInfo.length; i++) {
      topInfoNum = colspan > opts.bottomInfo[i].length ? topInfoNum : opts.bottomInfo[i].length
    }
    var colspan = Math.ceil(colCount / topInfoNum)
    var row = ''
    for (var i = 0; i < opts.bottomInfo.length; i++) {
      row += opts.bottomInfo[i]
    }
    var tr = '<tr><td colspan=' + colspan + '>' + row + '</td></tr>'
    $(tr).appendTo($gridBottom)
  }
  $gridBottom.appendTo($panelExcel)
  $panelExcel.find('td,th').css({
    height: '26px',
  })
  $panelExcel.find('td.money').addClass('tdNum')
  $panelExcel.find('td.tdNum,td.tr,td.money').css({
    'text-align': 'right',
  })
  $panelExcel.find('td.tdNum,td.money').css({
    width: '160px',
  })
  $panelExcel.find('td.tl').css({
    'text-align': 'left',
  })
  $panelExcel.find('td.tc').css({
    'text-align': 'center',
  })
  $panelExcel.find('.no-print').remove()

  return HtmlExportToExcel($panelExcel)
}

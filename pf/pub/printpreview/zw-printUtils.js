/* 2017.05.05 cuilg 打印工具集 */

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
// author: meizz   
Date.prototype.format = function(fmt)   
{
  var o = {   
    'M+' : this.getMonth() + 1,                   //月份   
    'd+' : this.getDate(),                        //日   
    'h+' : this.getHours(),                       //小时   
    'm+' : this.getMinutes(),                     //分   
    's+' : this.getSeconds(),                     //秒   
    'q+' : Math.floor((this.getMonth() + 3) / 3), //季度   
    'S'  : this.getMilliseconds()                 //毫秒   
  };   
  if (/(y+)/.test(fmt))   
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));   
  for (var k in o)   
    if (new RegExp('(' + k + ')').test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (('00'+ o[k]).substr((''+ o[k]).length)));   
  return fmt;   
}

// 转义字符替换为普通字符
function escapeHtml(str) {
  var arrEntities = {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all,t){return arrEntities[t];});
}

// 对象复制（不复制 notCopy 中的属性）
function deepCopy(fromObj, toObj, notCopy) {
  if (undefined == toObj || null == toObj) {
    toObj = (Array.isArray(fromObj) ? new Array() : {});
  }
  for (var key in fromObj) {
    if (undefined == notCopy || null == notCopy || (Array.isArray(notCopy) ? notCopy.indexOf(key) == -1 : key !== notCopy)) {
      toObj[key] = (undefined != fromObj[key] && null != fromObj[key] ? 'object' === typeof fromObj[key] ? deepCopy(fromObj[key], toObj[key], notCopy) : fromObj[key] : '');
    }
  }
  return toObj;
}

// 数字金额大写转换
function upDigit(num) {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟'] ];
  var head = num < 0 ? '负' : '';
  num = Math.abs(num);

  var s = '';

  for (var i = 0; i < fraction.length; i++) {
    s += digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i];
  }
  s = s.replace(/零分$/, '').replace(/零角$/, '整') || '整';
  
  num = Math.floor(num);

  for (var i = 0; i < unit[0].length && num > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && num > 0; j++) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');;
}

// 按fmtstr格式化num并返回格式化后的字符串
function formatNumber(num, fmtstr) {
  if ('undefined' === typeof num || null == num || '' === num ||
      'undefined' === typeof fmtstr || null == fmtstr || '' === fmtstr) {
    return num;
  } else {
    var n = parseFloat(num).toFixed(2);

    if ('JEXX' === fmtstr) {
      var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
      return n.replace(re, '$1,');

    } else if ('JEDX' === fmtstr) {
      return upDigit(n);

    } else {
      return num;
    }
  }
}

// 解析表达式expr
function getExprValue(expr, params) {
  var s = expr.toString();
  var rg;
  for (var key in params) {
    rg = new RegExp('#' + key + '#', 'gi');
    s = s.replace(rg, params[key]);
  }
  return s;
}

// 获取日期中的年份
function getYear(sDate) {
  var s = sDate.toString();
  if (10 == s.length) {
    return s.substr(0, 4);
  } else {
    return s;
  }
}

// 获取日期中的月份
function getMonth(sDate) {
  var s = sDate.toString();
  if (10 == s.length) {
    return s.substr(5, 2);
  } else {
    return s;
  }
}

// 获取日期中的日份
function getDay(sDate) {
  var s = sDate.toString();
  if (10 == s.length) {
    return s.substr(8, 2);
  } else {
    return s;
  }
}

// 对总账明细账打印数据进行分页处理，将p_data拆分为多页并返回分页数据的数组
function getPagingData(p_form, p_data) {

  // 开启承前页启后页的列名  
  var options = {};
  if (p_form.table.options && p_form.table.options.cqyqhy) {
    options.CQYQHY = true;
    options.cqyqhy_col = p_form.table.options.cqyqhy;
  } else {
    options.CQYQHY = false;
  }
  
  var allpages = new Array();
  var pageTo = 0;
  var bNewPage = true;
  var newPage;

  var rowFrom = 0;
  var rowTo = 0;
  var rowsLength = p_data.rows.length;
  var rowsPerPage = 0;
  var rowPageEnd = 0;

  while (rowFrom < rowsLength) {

    // 新建数据页
    if (bNewPage) {
      newPage = deepCopy(p_data, null, 'rows');
      allpages[pageTo] = newPage;

      // 处理 labels 中的函数
      for (var i = 0; i < p_form.labels.length; i++) {
        if ('string' == typeof p_form.labels[i].func && 'string' == typeof p_form.labels[i].stem) {
          var s_func = p_form.labels[i].func;
          var s_stem = p_form.labels[i].stem.replace(/labels./, '');
          var s_name = s_stem + '_' + s_func;
          eval("allpages[pageTo].labels." + s_name + " = " + s_func + "(allpages[pageTo].labels." + s_stem + ");");
        }
      }
      // 在 labels 中增加页码变量

      pageTo++;

      var rows = new Array();
      rowTo = 0;
      bNewPage = false;
    }

    // 处理承前页启后页
    if (options.CQYQHY) {
      if (1 == pageTo) {
        rowsPerPage = p_form.table.maxrows - 1;
      } else {
        rowsPerPage = p_form.table.maxrows - 2;

        // 除第1页其他页都增加承前页
        rows[rowTo] = {};
        eval("rows[rowTo]." + options.cqyqhy_col + " = '承前页';");
        rowTo++;
      }
    } else {
      rowsPerPage = p_form.table.maxrows;
    }
    // 只需设置第1页的 rowPageEnd ，后续页在 while 循环的尾部设置。
    if (1 == pageTo) {
      rowPageEnd = rowsPerPage - 1;
    }
    
    // 复制本页数据行
    while (rowFrom <= rowPageEnd && rowFrom < rowsLength) {
      rows[rowTo] = deepCopy(p_data.rows[rowFrom], null);
      // 处理数据格式转换
      for (var i = 0; i < p_form.table.columns.length; i++) {
        var col = (undefined != p_form.table.columns[i].col ? p_form.table.columns[i].col : '');
        var fmtstr = (undefined != p_form.table.columns[i].fmtstr ? p_form.table.columns[i].fmtstr : '');
        var prefix = (undefined != p_form.table.columns[i].prefix ? p_form.table.columns[i].prefix : '');
        var suffix = (undefined != p_form.table.columns[i].suffix ? p_form.table.columns[i].suffix : '');
        // 如果有fmtstr则执行格式化函数
        if ('' !== col && '' !== fmtstr) {
          var s = '';
          if ('' !== prefix) {
            s += prefix;
          }
          eval("var cv = p_data.rows[rowFrom]." + col + "; if (undefined != cv && null != cv) {cv = cv.toString().replace(/,/g,''); s += formatNumber(cv, fmtstr);}");
          if ('' !== suffix) {
            s += suffix;
          }
          eval("rows[rowTo]." + col + " = s;");
        }
      }
      rowFrom++;
      rowTo++;
    }

    // 处理承前页启后页
    if (options.CQYQHY) {
      // 除最后一页其他页都增加启后页
      if (rowFrom < rowsLength) {
        rows[rowTo] = {};
        if (rowFrom < rowsLength - 1) {
          eval("rows[rowTo]." + options.cqyqhy_col + " = '启后页';");
        } else {
          rows[rowTo] = deepCopy(p_data.rows[rowFrom], null);
          rowFrom++;
        }
      }
      // 从第2页开始，每页行数减2。
      rowsPerPage = p_form.table.maxrows - 2;
    } else {
      rowsPerPage = p_form.table.maxrows;
    }

    // 将数据行赋值给新建的数据页
    newPage.rows = rows;

    // 调整游标准备复制下一页数据
    rowPageEnd += Number(rowsPerPage);

    bNewPage = true;
  }
  
  // 处理页码标签、打印日期等打印变量
  var printDate = new Date().format("yyyy-MM-dd");
  var sLabel = '';
  var sParams = {};
  var iPageCount = allpages.length;
  for (var iPageNo = 0; iPageNo < iPageCount; iPageNo++) {
    for (var iLabel = 0; iLabel < p_form.labels.length; iLabel++) {
      // 处理打印变量
      if (p_form.labels[iLabel].expr) {
        sLabel = 'expr_value_' + iLabel;
        sParams.pageno = Number(iPageNo) + 1;
        sParams.pagecount = iPageCount;
        sParams.printdate = printDate;
        eval('allpages[iPageNo].labels.' + sLabel + ' = getExprValue(p_form.labels[iLabel].expr, sParams);');
      }
    }
  }  
  
  return allpages;
}

// 对前台凭证数据进行分页处理，将p_data数组中的每张凭证拆分为多个子页并返回全部凭证的分页数组
function getPagingData_PZ(p_form, p_data, options) {

  // 为options参数设置默认值
  if (!options) {options = {};}
  if (!options.sumMode) {options.sumMode = 'tmSubPage';}

  // 初始化函数内局部变量
  var allpages = new Array();
  var pageFrom = 0;
  var pageTo = -1;
  var pageTo_0 = 0;
  var subpageCount = 0;
  var subpageNo = 1;
  var subpageTo = 0;
  var subpageTo_0 = 0;
  var rowFrom = 0;
  var rowTo = 0;
  
  var p_footers = p_form.table.footers;

  // 初始化存放合计变量的数组
  var tmpfooters = new Array();
  
  if ('undefined' !== typeof p_footers) {
    for (var i = 0; i < p_footers.length; i++) {
      tmpfooters[i] = new Array();
      for (var j = 0; j < p_footers[i].length; j++) {
        tmpfooters[i][j] = {};
        tmpfooters[i][j].col = (undefined != p_footers[i][j].col ? p_footers[i][j].col : '');
        tmpfooters[i][j].fmtstr = (undefined != p_footers[i][j].fmtstr ? p_footers[i][j].fmtstr : '');
        tmpfooters[i][j].prefix = (undefined != p_footers[i][j].prefix ? p_footers[i][j].prefix : '');
        tmpfooters[i][j].suffix = (undefined != p_footers[i][j].suffix ? p_footers[i][j].suffix : '');
        tmpfooters[i][j].visible = (undefined != p_footers[i][j].visible ? p_footers[i][j].visible : '');
        tmpfooters[i][j].pageSum = 0;
      }
    }
  }

  // 新建凭证分页
  function newPage() {
    pageTo++;
    allpages[pageTo] = {};
    allpages[pageTo].subpages = new Array();
    subpageTo = 0;
    rowTo = 0;
  }

  newPage();

  // 逐张凭证进行复制，一张凭证可能分为多个分页和子页
  while (pageFrom < p_data.length) {

    // 处理新的凭证前初始化各项合计值
    if ('undefined' !== typeof p_footers) {
      for (var i = 0; i < tmpfooters.length; i++) {
        for (var j = 0; j < tmpfooters[i].length; j++) {
          tmpfooters[i][j].pageSum = 0;
        }
      }
    }

    // 每次更换原始凭证时将本次凭证的起始分页/起始分录行保存在pageTo_0/subpageTo_0中，后面处理tmAllPage类型合计值时要用。
    pageTo_0 = pageTo;
    subpageTo_0 = subpageTo;

    // 计算凭证子页页码
    subpageCount = Math.ceil(p_data[pageFrom].rows.length / p_form.table.maxrows);
    subpageNo = 1;
    // 逐行复制凭证分录，多行凭证分录可能分到多个凭证分页的子页中
    while (rowFrom < p_data[pageFrom].rows.length) {
      // 复制当前分页凭证数据
      while (subpageTo < p_form.subpage.count) {
        // 在当前分页新建子页并复制子页对应的凭证数据
        allpages[pageTo].subpages[subpageTo] = {};
        allpages[pageTo].subpages[subpageTo].labels = deepCopy(p_data[pageFrom].labels, null);
        // 处理 labels 中的函数
        for (var i = 0; i < p_form.labels.length; i++) {
          if ('string' == typeof p_form.labels[i].func && 'string' == typeof p_form.labels[i].stem) {
            var s_func = p_form.labels[i].func;
            var s_stem = p_form.labels[i].stem.replace(/labels./, '');
            var s_name = s_stem + '_' + s_func;
            eval("allpages[pageTo].subpages[subpageTo].labels." + s_name + " = " + s_func + "(allpages[pageTo].subpages[subpageTo].labels." + s_stem + ");");
          }
        }
        // 在 labels 中增加页码变量
        allpages[pageTo].subpages[subpageTo].labels.v_subpageNo = subpageNo;
        allpages[pageTo].subpages[subpageTo].labels.v_subpageCount = subpageCount;
        allpages[pageTo].subpages[subpageTo].labels.v_printDate = printDate;
        allpages[pageTo].subpages[subpageTo].rows = new Array();
        // 复制当前子页的分录行
        while (rowFrom < p_data[pageFrom].rows.length && rowTo < p_form.table.maxrows) {
          allpages[pageTo].subpages[subpageTo].rows[rowTo] = deepCopy(p_data[pageFrom].rows[rowFrom], null);

          // 处理数据格式转换
          for (var i = 0; i < p_form.table.columns.length; i++) {
            var col = (undefined != p_form.table.columns[i].col ? p_form.table.columns[i].col : '');
            var fmtstr = (undefined != p_form.table.columns[i].fmtstr ? p_form.table.columns[i].fmtstr : '');
            var prefix = (undefined != p_form.table.columns[i].prefix ? p_form.table.columns[i].prefix : '');
            var suffix = (undefined != p_form.table.columns[i].suffix ? p_form.table.columns[i].suffix : '');
            // 如果有fmtstr则执行格式化函数
            if ('' !== col && '' !== fmtstr) {
              var s = '';
              if ('' !== prefix) {
                s += prefix;
              }
              eval("var cv = p_data[pageFrom].rows[rowFrom]." + col + "; if (undefined != cv && null != cv) {cv = cv.toString().replace(/,/g,''); s += formatNumber(cv, fmtstr);}");
              if ('' !== suffix) {
                s += suffix;
              }
              eval("allpages[pageTo].subpages[subpageTo].rows[rowTo]." + col + " = s;");
            }
          }

          // 计算各合计项的合计值
          for (var i = 0; i < tmpfooters.length; i++) {
            for (var j = 0; j < tmpfooters[i].length; j++) {
              if ('' !== tmpfooters[i][j].col) {
                eval("var cv = allpages[pageTo].subpages[subpageTo].rows[rowTo]." + tmpfooters[i][j].col + "; if (undefined != cv && null != cv) {cv = cv.toString().replace(/,/g,''); tmpfooters[i][j].pageSum += Number(cv);}");
              }
            }
          }
          rowFrom++;
          rowTo++;
        }

        // 处理合计项
        if ('undefined' !== typeof p_footers) {

          // 创建当前分页的合计项数组
          var subfooters = new Array();
          for (var i = 0; i < tmpfooters.length; i++) {
            subfooters[i] = new Array();
            for (var j = 0; j < tmpfooters[i].length; j++) {
              subfooters[i][j] = {};
              subfooters[i][j].value = '';
            }
          }
          allpages[pageTo].subpages[subpageTo].footers = subfooters;
        
          // 处理当前子页上需要显示的不同类型合计项
          // options.sumMode 取值如下：
          // tmSubPage:   当前页小计值
          // tmAddUpPage: 截止当前页累计值
          // tmAllPage:   全部页合计值
          if ('tmSubPage' === options.sumMode || 'tmAddUpPage' === options.sumMode) {
            // 将tmSubPage/tmAddUpPage类型的合计数值更新到合计打印项
            if (rowFrom < p_data[pageFrom].rows.length) {
              // 处理各合计项
              for (var i = 0; i < tmpfooters.length; i++) {
                for (var j = 0; j < tmpfooters[i].length; j++) {
                  if ('vtOnlyEndPage' != tmpfooters[i][j].visible) {
                    subfooters[i][j].value = tmpfooters[i][j].prefix;
                    if ('' !== tmpfooters[i][j].col) {
                      subfooters[i][j].value += formatNumber(tmpfooters[i][j].pageSum, tmpfooters[i][j].fmtstr)
                    }
                    subfooters[i][j].value += tmpfooters[i][j].suffix;
                  }
                }
              }
              // tmSubPage/tmAddUpPage共用pageSum，区别是tmSubPage每个子页都清空该值，tmAddUpPage不清空。
              if ('tmSubPage' === options.sumMode) {
                for (var i = 0; i < tmpfooters.length; i++) {
                  tmpfooters[i].pageSum = 0;
                }
              }
            } else {
              // 最后一个子页必须是全部子页的合计值
              for (var i = 0; i < tmpfooters.length; i++) {
                for (var j = 0; j < tmpfooters[i].length; j++) {
                  subfooters[i][j].value = tmpfooters[i][j].prefix;
                  if ('' !== tmpfooters[i][j].col) {
                    subfooters[i][j].value += formatNumber(tmpfooters[i][j].pageSum, tmpfooters[i][j].fmtstr)
                  }
                  subfooters[i][j].value += tmpfooters[i][j].suffix;
                }
              }
            }
          } else if ("tmAllPage" === options.sumMode) {
            if (rowFrom === p_data[pageFrom].rows.length) {
              // 当所有分录行都处理完以后，再将tmAllPage类型的合计数值更新到所有子页的合计打印项
              // 1. 因所有子页的合计打印项都相同，所以先计算出来再更新到每个子页的打印项
              for (var i = 0; i < tmpfooters.length; i++) {
                for (var j = 0; j < tmpfooters[i].length; j++) {
                  subfooters[i][j].value = tmpfooters[i][j].prefix;
                  if ('' !== tmpfooters[i][j].col) {
                    subfooters[i][j].value += formatNumber(tmpfooters[i][j].pageSum, tmpfooters[i][j].fmtstr)
                  }
                  subfooters[i][j].value += tmpfooters[i][j].suffix;
                }
              }
              // 2. 将刚才计算的合计想更新到全部子页
              for (var q = pageTo_0; q <= pageTo; q ++) {
                for (var p = 0; p < allpages[q].subpages.length; p++) {
                  if (q === pageTo_0 ? p >= subpageTo_0 : q === pageTo ? p <= subpageTo : true) {
                    for (var i = 0; i < tmpfooters.length; i++) {
                      for (var j = 0; j < tmpfooters[i].length; j++) {
                        allpages[q].subpages[p].footers[i][j].value = subfooters[i][j].value;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        
        if (rowFrom < p_data[pageFrom].rows.length) {
          // 子页序号递增
          subpageNo++;
          subpageTo++;
          rowTo = 0;
        } else {
          // 标识当前子页是当前凭证的最后一个子页
          allpages[pageTo].subpages[subpageTo].isEndSubPage = true;
          break;
        }
      }
      // 新建分页复制其他分录行
      if (rowFrom < p_data[pageFrom].rows.length) {
        newPage();
      } else {
        break;
      }
    }
    // 增加源页码编号
    pageFrom++;
    rowFrom = 0;

    if (pageFrom < p_data.length) {
      if (subpageTo < p_form.subpage.count && options.newPagePerPZ) {
        newPage();
      } else {
        subpageTo++;
        rowTo = 0;
      }
    }
  }

  // 处理页码标签、打印日期等打印变量
  var printDate = new Date().format("yyyy-MM-dd");
  var sLabel = '';
  var sParams = {};
  var iPageCount = allpages.length;
  for (var iPageNo = 0; iPageNo < iPageCount; iPageNo++) {
    var iSubPageCount = allpages[iPageNo].subpages.length;
    for (var iSubPageNo = 0; iSubPageNo < iSubPageCount; iSubPageNo++) {
      for (var iLabel = 0; iLabel < p_form.labels.length; iLabel++) {
        // 处理打印变量
        if (p_form.labels[iLabel].expr) {
          sLabel = 'expr_value_' + iLabel;
          sParams.pageno = iPageNo;
          sParams.subpageno = allpages[iPageNo].subpages[iSubPageNo].labels.v_subpageNo;
          sParams.subpagecount = allpages[iPageNo].subpages[iSubPageNo].labels.v_subpageCount;
          sParams.printdate = printDate;
          eval('allpages[iPageNo].subpages[iSubPageNo].labels.' + sLabel + ' = getExprValue(p_form.labels[iLabel].expr, sParams);');
        }
      }
    }
  }  

  return allpages;
}

// 对包含多表的单据进行数据处理，只处理格式和合计，不进行数据分页。
function getPagingData_DB(p_form, p_data) {

  // 初始化存放合计变量的数组
  var tmpfooters = new Array();
  for (t = 0; t < p_form.tables.length; t++) {
    var p_footers = p_form.tables[t].footers;
    tmpfooters[t] = new Array();
    if ('undefined' !== typeof p_footers) {
      for (var i = 0; i < p_footers.length; i++) {
        tmpfooters[t][i] = new Array();
        for (var j = 0; j < p_footers[i].length; j++) {
          tmpfooters[t][i][j] = {};
          tmpfooters[t][i][j].col = (undefined != p_footers[i][j].col ? p_footers[i][j].col : '');
          tmpfooters[t][i][j].fmtstr = (undefined != p_footers[i][j].fmtstr ? p_footers[i][j].fmtstr : '');
          tmpfooters[t][i][j].prefix = (undefined != p_footers[i][j].prefix ? p_footers[i][j].prefix : '');
          tmpfooters[t][i][j].suffix = (undefined != p_footers[i][j].suffix ? p_footers[i][j].suffix : '');
          tmpfooters[t][i][j].visible = (undefined != p_footers[i][j].visible ? p_footers[i][j].visible : '');
          tmpfooters[t][i][j].pageSum = 0;
        }
      }
    }
  }

  var allpages = new Array();
  // 新建数据页
  allpages[0] = deepCopy(p_data, null, null);
  allpages[0].footers = new Array();

  // 复制所有子表的数据行
  if (p_data.rows instanceof Array) {
    for (var t = 0; t < allpages[0].rows.length; t++) {
      for (var r = 0; r < allpages[0].rows[t].length; r++) {
        // 处理数据
        if (undefined != p_form.tables[t] && null != p_form.tables[t]) {
          for (var i = 0; i < p_form.tables[t].columns.length; i++) {
            var col = (undefined != p_form.tables[t].columns[i].col ? p_form.tables[t].columns[i].col : '');
            var fmtstr = (undefined != p_form.tables[t].columns[i].fmtstr ? p_form.tables[t].columns[i].fmtstr : '');
            var prefix = (undefined != p_form.tables[t].columns[i].prefix ? p_form.tables[t].columns[i].prefix : '');
            var suffix = (undefined != p_form.tables[t].columns[i].suffix ? p_form.tables[t].columns[i].suffix : '');
            // 如果有fmtstr则执行格式化函数
            if ('' !== col && '' !== fmtstr) {
              var s = '';
              if ('' !== prefix) {
                s += prefix;
              }
              eval("var cv = allpages[0].rows[t][r]." + col + "; if (undefined != cv && null != cv) {cv = cv.toString().replace(/,/g,''); s += formatNumber(cv, fmtstr);}");
              if ('' !== suffix) {
                s += suffix;
              }
              eval("allpages[0].rows[t][r]." + col + " = s;");
            }
          }
          
          // 计算各合计项的合计值
          for (var i = 0; i < tmpfooters[t].length; i++) {
            for (var j = 0; j < tmpfooters[t][i].length; j++) {
              if ('' !== tmpfooters[t][i][j].col) {
                eval("var cv = allpages[0].rows[t][r]." + tmpfooters[t][i][j].col + "; if (undefined != cv && null != cv) {cv = cv.toString().replace(/,/g,''); tmpfooters[t][i][j].pageSum += Number(cv);}");
              }
            }
          }
        }
      }

      // 处理合计项
      var p_footers = p_form.tables[t].footers;
      if ('undefined' !== typeof p_footers) {
        // 创建当前分页的合计项数组
        subfooters = new Array();
        for (var i = 0; i < tmpfooters[t].length; i++) {
          subfooters[i] = new Array();
          for (var j = 0; j < tmpfooters[t][i].length; j++) {
            subfooters[i][j] = {};
            subfooters[i][j].value = tmpfooters[t][i][j].prefix;
            if ('' !== tmpfooters[t][i][j].col) {
              subfooters[i][j].value += formatNumber(tmpfooters[t][i][j].pageSum, tmpfooters[t][i][j].fmtstr)
            }
            subfooters[i][j].value += tmpfooters[t][i][j].suffix;
          }
        }
        allpages[0].footers[t] = subfooters;
      }
    }
  }
  
  // 处理页码标签、打印日期等打印变量
  var printDate = new Date().format("yyyy-MM-dd");
  var sLabel = '';
  var sParams = {};
  for (var iLabel = 0; iLabel < p_form.labels.length; iLabel++) {
    // 处理打印变量
    if (p_form.labels[iLabel].expr) {
      sLabel = 'expr_value_' + iLabel;
      sParams.pageno = 1;
      sParams.pagecount = 1;
      sParams.printdate = printDate;
      eval('allpages[0].labels.' + sLabel + ' = getExprValue(p_form.labels[iLabel].expr, sParams);');
    }
  }
  
  return allpages;
}

// 计算表格宽度
function getTableWidth(table) {
  var w = 0;
  if (undefined != table.headers && null != table.headers) {
    if (Array.isArray(table.headers)) {
      // 多层表头
      for (var i = 0; i < table.headers[0].length; i++) {
	    w += Number(table.headers[0][i].width);
	  }
	} else {
      // 单层表头
      for (var i = 0; i < table.headers.length; i++) {
	    w += Number(table.headers[i].width);
	  }
	}
  }
  return w;
}

// 根据总账明细账打印行数调整打印项位置
function adjustLabelsPosition(p_form, p_data, fixedTableSize) {

  var rowCount = 0;
  if (p_form.table.headers) {
    rowCount += Number(p_form.table.headers.length);
  }
  if ('undefined' !== typeof fixedTableSize && fixedTableSize) {
    rowCount += Number(p_form.table.maxrows);
  } else {
    rowCount += Number(p_data.rows.length);
  }
  if (p_form.table.footers) {
    rowCount++;
  }

  // 计算纸张表格的高度和宽度
  var paper_height;
  var paper_width;
  if ("1" == p_form.paper.paperOrientation) {
    paper_height = p_form.paper.paperWidth;
    paper_width = p_form.paper.paperHeight;
  } else {
    paper_height = p_form.paper.paperHeight;
    paper_width = p_form.paper.paperWidth;
  }
  var table_height = p_form.table.rowheight * rowCount;
  var table_width = getTableWidth(p_form.table);
  // 设定表格高度和宽度
  p_form.table.height = table_height;
  p_form.table.width = table_width;

  // 计算所有标签的具体位置
  for (var i = 0; i < p_form.labels.length; i++) {
    var label = p_form.labels[i];
    // 根据标签位置类型(dt)计算位置
    switch (label.dt) {
    case 'tpLT':
      label.left = Number(label.dx);
      label.top = Number(label.dy);
      break;
    case 'tpLB':
      label.left = Number(label.dx);
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'tpRT':
      label.align = 'right';
      label.left = Number(paper_width) + Number(label.dx);
      label.top = Number(label.dy);
      break;
    case 'tpRB':
      label.align = 'right';
      label.left = Number(paper_width) + Number(label.dx);
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'tpMT':
      label.align = 'center';
      label.left = 0;
      label.width = paper_width;
      label.top = Number(label.dy);
      break;
    case 'tpMB':
      label.align = 'center';
      label.left = 0;
      label.width = paper_width;
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'ttLT':
      label.left = Number(p_form.table.left) + Number(label.dx);
      label.top = Number(p_form.table.top) + Number(label.dy);
      break;
    case 'ttLB':
      label.left = Number(p_form.table.left) + Number(label.dx);
      label.top = Number(p_form.table.top) + Number(table_height) + Number(label.dy);
      break;
    case 'ttRT':
      label.align = 'right';
      label.left = Number(p_form.table.left) + Number(table_width) + Number(label.dx);
      label.top = Number(p_form.table.top) + Number(label.dy);
      break;
    case 'ttRB':
      label.align = 'right';
      label.left = Number(p_form.table.left) + Number(table_width) + Number(label.dx);
      label.top = Number(p_form.table.top) + Number(table_height) + Number(label.dy);
      break;
    case 'ttMT':
      label.align = 'center';
      label.left = p_form.table.left;
      label.width = table_width;
      label.top = Number(p_form.table.top) + Number(label.dy);
      break;
    case 'ttMB':
      label.align = 'center';
      label.left = p_form.table.left;
      label.width = table_width;
      label.top = Number(p_form.table.top) + Number(table_height) + Number(label.dy);
      break;
    }
  }
}

// 多表单据调整打印项位置
function adjustLabelsPosition_DB(p_form, p_data, fixedTableSize) {

  var table_left = 9999;
  var table_top = p_form.tables[0].top;
  var table_width = 0;
  var table_height = 0;

  // 把多个子表当作一个表格计算整体宽度和高度
  for (i = 0; i < p_form.tables.length; i++) {
    var rowCount = 0;
    if (p_form.tables[i].headers) {
      rowCount += Number(p_form.tables[i].headers.length);
    }
    if ('undefined' !== typeof fixedTableSize && fixedTableSize) {
      rowCount += Number(p_form.tables[i].maxrows);
    } else {
      rowCount += Number(p_data.rows[i].length);
    }
    if (p_form.tables[i].footers) {
      rowCount++;
    }
    
    // 设置当前子表的top
    if (i > 0) {
      p_form.tables[i].top = table_top + table_height + p_form.tables[i].topspace;
    }

    // 当前子表高度
    var tmp_height = p_form.tables[i].rowheight * rowCount;
    if (i > 0) {
      tmp_height += p_form.tables[i].topspace;
    }
    // 当前子表宽度
    var tmp_width = getTableWidth(p_form.tables[i]);

    // 调整整体表格高度
    table_height += tmp_height;
    // 调整整体表格宽度
    if (table_width < tmp_width) {
      table_width = tmp_width;
    }
    if (p_form.tables[i].left < table_left) {
      table_left = p_form.tables[i].left;
    }
  }

  // 计算纸张的高度和宽度
  var paper_height;
  var paper_width;
  if ("1" == p_form.paper.paperOrientation) {
    paper_height = p_form.paper.paperWidth;
    paper_width = p_form.paper.paperHeight;
  } else {
    paper_height = p_form.paper.paperHeight;
    paper_width = p_form.paper.paperWidth;
  }
  
  // 计算所有标签的具体位置
  for (var i = 0; i < p_form.labels.length; i++) {
    var label = p_form.labels[i];
    // 根据标签位置类型(dt)计算位置
    switch (label.dt) {
    case 'tpLT':
      label.left = Number(label.dx);
      label.top = Number(label.dy);
      break;
    case 'tpLB':
      label.left = Number(label.dx);
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'tpRT':
      label.align = 'right';
      label.left = Number(paper_width) + Number(label.dx);
      label.top = Number(label.dy);
      break;
    case 'tpRB':
      label.align = 'right';
      label.left = Number(paper_width) + Number(label.dx);
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'tpMT':
      label.align = 'center';
      label.left = 0;
      label.width = paper_width;
      label.top = Number(label.dy);
      break;
    case 'tpMB':
      label.align = 'center';
      label.left = 0;
      label.width = paper_width;
      label.top = Number(paper_height) + Number(label.dy);
      break;
    case 'ttLT':
      label.left = Number(table_left) + Number(label.dx);
      label.top = Number(table_top) + Number(label.dy);
      break;
    case 'ttLB':
      label.left = Number(table_left) + Number(label.dx);
      label.top = Number(table_top) + Number(table_height) + Number(label.dy);
      break;
    case 'ttRT':
      label.align = 'right';
      label.left = Number(table_left) + Number(table_width) + Number(label.dx);
      label.top = Number(table_top) + Number(label.dy);
      break;
    case 'ttRB':
      label.align = 'right';
      label.left = Number(table_left) + Number(table_width) + Number(label.dx);
      label.top = Number(table_top) + Number(table_height) + Number(label.dy);
      break;
    case 'ttMT':
      label.align = 'center';
      label.left = table_left;
      label.width = table_width;
      label.top = Number(table_top) + Number(label.dy);
      break;
    case 'ttMB':
      label.align = 'center';
      label.left = table_left;
      label.width = table_width;
      label.top = Number(table_top) + Number(table_height) + Number(label.dy);
      break;
    }
  }
}

function tmplToHtml(p_tmpl, p_data) {
  return template.render(p_tmpl, p_data);
}

// 生成普通表格（总账明细账）Html页面
function getPrintHtml(p_formtmpl, p_paper, p_form, p_data, options) {
  // 为options参数设置默认值
  if (!options) {
    options = {};
  }
  if (undefined != options.isTD && null != options.isTD) {
    p_form.isTD = options.isTD;
  }
  if (undefined != options.title && null != options.title) {
  	p_form.labels[0].prefix = options.title;
  }

  p_form.paper = p_paper;
  p_form.datapageWidth = Number(p_form.paper.paperWidth) - 0.1;
  p_form.datapageHeight = Number(p_form.paper.paperHeight) - 0.1;

  var all_html = "";
  // 处理分页数据
  var allpages = getPagingData(p_form, p_data);
  // 循环打印每一页
  for (var i = 0; i < allpages.length; i++) {
    // 根据打印行数调整打印项位置
    adjustLabelsPosition(p_form, allpages[i], false);
    // 模拟后台使用分类模版将打印格式元数据转换为打印模版
    var tmpl = escapeHtml(tmplToHtml(p_formtmpl, p_form));
    // 前台使用打印模版将打印数据转换为打印页面内容
    allpages[i].isLastDataPage = (i == allpages.length - 1);
    var html = tmplToHtml(tmpl, allpages[i]);
    // 将包含CSS打印样式和打印数据的页面内容输出到html
    all_html += html;
  }
  // 构建返回值对象
  var result = {};
  result.html = all_html;
  result.pageCount = allpages.length;
  return result;
}

// 生成凭证Html页面
function getPrintHtml_PZ(p_formtmpl, p_paper, p_form, p_data, options) {
  // 为options参数设置默认值
  if (!options) {
    options = {};
  }
  if (!options.sumMode) {
    options.sumMode = 'tmSubPage';
  }
  if (undefined != options.isTD && null != options.isTD) {
    p_form.isTD = options.isTD;
  }
  if (undefined != options.title && null != options.title) {
  	p_form.labels[0].prefix = options.title;
  }

  p_form.paper = p_paper;
  p_form.datapageWidth = Number(p_form.paper.paperWidth) - 0.1;
  p_form.datapageHeight = Number(p_form.paper.paperHeight) - 0.1;

  var all_html = "";
  // 处理分页数据
  var allpages = getPagingData_PZ(p_form, p_data, options);
  // 循环打印每一页
  for (var i = 0; i < allpages.length; i++) {
    // 根据打印行数调整打印项位置
    adjustLabelsPosition(p_form, allpages[i], true);
    // 模拟后台使用分类模版将打印格式元数据转换为打印模版
    var tmpl = escapeHtml(tmplToHtml(p_formtmpl, p_form));
    // 前台使用打印模版将打印数据转换为打印页面内容
    allpages[i].isLastDataPage = (i == allpages.length - 1);
    var html = tmplToHtml(tmpl, allpages[i]);
    // 将包含CSS打印样式和打印数据的页面内容输出到html
    all_html += html;
  }
  // 构建返回值对象
  var result = {};
  result.html = all_html;
  result.pageCount = allpages.length;
  return result;
}

// 生成包含多表的单据Html页面
function getPrintHtml_DB(p_formtmpl, p_paper, p_form, p_data, options) {
  // 为options参数设置默认值
  if (!options) {
    options = {};
  }
  if (undefined != options.isTD && null != options.isTD) {
    p_form.isTD = options.isTD;
  }

  p_form.paper = p_paper;
  p_form.datapageWidth = Number(p_form.paper.paperWidth) - 0.1;
  p_form.datapageHeight = Number(p_form.paper.paperHeight) - 0.1;

  var all_html = "";
  // 处理分页数据
  var allpages = getPagingData_DB(p_form, p_data);
  // 根据打印行数调整打印项位置
  adjustLabelsPosition_DB(p_form, allpages[0], false);
  // 模拟后台使用分类模版将打印格式元数据转换为打印模版
  var tmpl = escapeHtml(tmplToHtml(p_formtmpl, p_form));
  // 前台使用打印模版将打印数据转换为打印页面内容
  var html = tmplToHtml(tmpl, allpages[0]);
  // 构建返回值对象
  var result = {};
  result.html = html;
  result.pageCount = 1;
  return result;
}

// 生成多栏账Html页面（待续）
function getDLZForm(p_form, p_columns) {
  var maxW = Number(p_form.table.maxwidth);
  var tmpW = 0;
  var all_form = new Array();
  var formData;
  var bNewForm = true;
  var iheaders = new Array();
  iheaders[0] = 0;
  iheaders[1] = 0;
  var iTitleCounts = new Array();
  iTitleCounts[0] = p_form.table.headers[0].length;
  iTitleCounts[1] = p_form.table.headers[1].length;
  while (iCol < iColCount) {
    if (bNewForm) {
      formData = deepCopy(p_form, null, ['headers', 'columns']);
      // 拆分多栏账的列到多个页模版
      while (tmpW < maxW) {
        // 拆分多栏账的列到多个页模版
      }
    }
    iCol++;
  }
}

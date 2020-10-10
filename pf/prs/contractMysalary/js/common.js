(function flexible (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
  
    // adjust body font size
    function setBodyFontSize () {
      if (document.body) {
        document.body.style.fontSize = (12 * dpr) + 'px'
      }
      else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }
    setBodyFontSize();
  
    // set 1rem = viewWidth / 10
    function setRemUnit () {
      var rem = docEl.clientWidth / 10
      docEl.style.fontSize = rem + 'px'
    }
  
    setRemUnit()
  
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  
    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }(window, document))
/**
 * 数字千分位格式化
 * @public
 * @param mixed mVal 数值
 * @param int iAccuracy 小数位精度(默认为2)
 * @return string
 */
function formatMoney(mVal, iAccuracy){
  var fTmp = 0.00;//临时变量
  var iFra = 0;//小数部分
  var iInt = 0;//整数部分
  var aBuf = new Array(); //输出缓存
  var bPositive = true; //保存正负值标记(true:正数)
  /**
   * 输出定长字符串，不够补0
   * <li>闭包函数</li>
   * @param int iVal 值
   * @param int iLen 输出的长度
   */
  function funZero(iVal, iLen){
      var sTmp = iVal.toString();
      var sBuf = new Array();
      for(var i=0,iLoop=iLen-sTmp.length; i<iLoop; i++)
          sBuf.push('0');
      sBuf.push(sTmp);
      return sBuf.join('');
  };

  if (typeof(iAccuracy) === 'undefined')
      iAccuracy = 2;
  bPositive = (mVal >= 0);//取出正负号
  fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);//强制转换为绝对值数浮点
  //所有内容用正数规则处理
  iInt = parseInt(fTmp); //分离整数部分
  iFra = parseInt((fTmp - iInt) * Math.pow(10,iAccuracy) + 0.5); //分离小数部分(四舍五入)

  do{
      aBuf.unshift(funZero(iInt % 1000, 3));
  }while((iInt = parseInt(iInt/1000)));
  aBuf[0] = parseInt(aBuf[0]).toString();//最高段区去掉前导0
  return ((bPositive)?'':'-') + aBuf.join(',') +'.'+ ((0 === iFra)?'00':funZero(iFra, iAccuracy));
}
/**
 * 将千分位格式的数字字符串转换为浮点数
 * @public
 * @param string sVal 数值字符串
 * @return float
 */
function unformatMoney(sVal){
  var fTmp = parseFloat(sVal.replace(/,/g, ''));
  return (isNaN(fTmp) ? 0 : fTmp);
}
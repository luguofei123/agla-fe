$(function() {
    //open弹窗的关闭方法
    window._close = function(action, msg) {
      if (window.closeOwner) {
        var data = { action: action, msg: msg }
        window.closeOwner(data)
      }
    }
  
    //接口URL集合
    var interfaceURL = {
    }
    var pageLength = 25
  
    var page = (function() {
      return {
        // 初始化表单
        initFormData: function() {
          var params = window.ownerData;
          console.log(params);
          if (!$.isEmptyObject(params)) {
            $('#frmQuery').setForm(params);
            $('#pritemCode').html(params.pritemCode);
            $('#pritemName').html(params.pritemName);
            var data1 = [{id:'0',name:''},
            {id:'1',name:'应发项'},
            {id:'2',name:'实发项'},
            {id:'3',name:'扣发项'},
            {id:'4',name:'补发项'}],data2=[{id:'01',name:'来源1'},
            {id:'02',name:'来源2'},
            {id:'03',name:'来源3'},
            {id:'04',name:'来源4'}];
            $("#pritemProp").ufCombox({
              idField:"id",
              textField:"name",
              data:data1, //json 数据 
              placeholder:"请选择", 
              onChange:function(sender,data){ },
              onComplete:function(sender){
              } });
            
            $("#pritemDataSource").ufCombox({
              idField:"id",
              textField:"name",
              data:data2, //json 数据 
              placeholder:"请选择", 
              onChange:function(sender,data){ },
              onComplete:function(sender){
              } });
            $("#pritemProp").getObj().val(params.pritemProp);
            $("#pritemDataSource").getObj().val(params.pritemDataSource);
          }
        },
        // 保存
        save: function() {
          var formData = $('#frmQuery').serializeObject();
          var pritemCode = $('#pritemCode').html();
          formData.pritemCode = pritemCode;
          console.log(formData);
          _close('sure', formData)
        },
  
        initPage: function() {
          //权限控制
          page.reslist = ufma.getPermission()
          ufma.isShow(page.reslist)
          this.initFormData()
        },
        onEventListener: function() {
          // 保存按钮点击事件
          $('#btn-save').on('click', page.save)
          // 关闭按钮点击事件
          $('#btn-close').on('click', function() {
            _close()
          })
        },
  
        //此方法必须保留
        init: function() {
          ufma.parse()
          page.initPage()
          page.onEventListener()
          ufma.parseScroll()
        }
      }
    })()
    /////////////////////
    page.init()
  
    function stopPropagation(e) {
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
    }
  })
  
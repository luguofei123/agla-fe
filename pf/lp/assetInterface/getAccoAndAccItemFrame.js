$(function(){
    //open弹窗的关闭方法
    window._close = function(action, msg) {
        if (window.closeOwner) {
          var data = { action: action, msg: msg }
          window.closeOwner(data)
        }
      }

    var page = function(){
		
		//现金流量统计表所用接口
		var portList = {
            GET_ACCO_AND_ACC_ITEM_TREE:'/gl/glAssetRc/getAccoAndAccItemTree',
            // GET_ASSET_TYPE_TREE:'/gl/glAssetRc/getAssetTypeTree',
            GET_ASSET_TYPE_TREE:'/lp/assest/getAssestType',
            SAVE_CONDITION:'/gl/glAssetRc/saveCondition',
		};
    	
        return{
            params:{},
            selectArr:[],
            focusIndex:0,
			getTreeData:function(){
                ufma.showloading('正在加载数据请耐心等待...');
				ufma.get(portList.GET_ASSET_TYPE_TREE,{ schemeGuid: window.ownerData.schemeGuid },function(result){
					// console.log(result.data);
                    ufma.hideloading();
                    $("#typeTreeCode").ufTreecombox ({
                        idField:"id",
                        textField:"codeName",
                        data:result.data, //json 数据 
                        placeholder:"请选择", 
                        expandAll:false,
                        onChange:function(sender,data){ 
                            // console.log(data);
                            // var flag = false;
                            // page.selectArr.forEach(function(item,index){
                            //     if(item===data.codeName){
                            //         ufma.showTip('不能选择已选过的条件',function(){},'error')
                            //         flag = true;
                            //         return ;
                            //     }
                            // })
                            // if(flag){
                            //     $("#typeTreeCode").getObj().val('');
                            //     return ;
                            // }else{
                            //     page.selectArr.push(data.codeName);
                                $('#treeList li').eq(page.focusIndex).attr({'asset-code':data.code, 'asset-type':data.codeName}).find('.itemRight').html(data.codeName);
                            // }

                        },
                        onComplete:function(sender){
                            // console.log($.fn.zTree.getZTreeObj('typeTreeCode_tree'));
                            var oneTree = $.fn.zTree.getZTreeObj('typeTreeCode_tree')
                            // console.log(oneTree);
                            oneTree.expandAll(false);
                            $('.icon-close').on('click', function(){
                                $("#typeTreeCode").getObj().setValue('','');
                                $('#treeList li').eq(page.focusIndex).attr({'asset-code':'', 'asset-type':''}).find('.itemRight').html('');
                            })
                        } 
                    });
				})
            },
            getData:function(params){
				ufma.get(portList.GET_ACCO_AND_ACC_ITEM_TREE,params,function(result){
                    // console.log(result.data);
                    var data = result.data, htmlstr = '';
                    data.forEach(function(item,index){
                        var nbsps = '';
                        for(var i = 0;i<item.levelNum;i++){
                            nbsps +='&nbsp;&nbsp;';
                        }
                        // if(item.assetType){
                        //     page.selectArr.push(item.assetType)
                        // }
                        htmlstr+='<li index="'+index+'" data-name="'+item.name+'" data-fullname="'+item.fullName+
                        '" asset-code="' +item.assetType.split(' ')[0]+ '" asset-type="' +item.assetType+ '"><div class="itemLeft">'+nbsps+item.name+
                        '</div><div class="itemRight" data-fullname="'+
                        item.fullName+'">'+item.assetType+'</div></li>';
                    })
                    $('#treeList').html(htmlstr);
                    $('#treeList li').on('click',function(e){
                        $('#treeList li').removeClass('rowActive');
                        $(this).addClass('rowActive');
                        var ROW_HEIGHT = 31,
                        index = parseInt($(this).attr('index')),
                        h = ROW_HEIGHT*(index+1);
                        page.focusIndex = index;
                        var assetCode= $(this).attr('asset-code');
                        var assetType = $(this).attr('asset-type');
                        $("#typeTreeCode").getObj().setValue(assetCode, assetType);
                        $('#editRow').css({top:h+'px'}).removeClass('hide');
                    })
				})
            },
            saveData:function(type){
                
                var params = [];
                $('#treeList li').each(function(index,el){
                    var val = $(el).find('.itemRight').html(),
                    name=$(el).attr('data-name'),
                    fullName=$(el).attr('data-fullname');
                    // console.log(name);
                    // console.log(fullName);
                    // console.log(val);
                    if(name&&fullName&&val){
                        var obj = {
                            name:name,
                            fullName:fullName,
                            assetType:val
                        }
                        params.push(obj);
                    }
                })
                // console.log(params);
                var con = page.params;
                var urlp = '?rgCode='+con.rgCode+'&agencyCode='+con.agencyCode+'&acctCode='+con.acctCode+'&setYear='+con.setYear
                ufma.post(portList.SAVE_CONDITION+urlp,params,function(result){
                    // ufma.hideloading();
                    ufma.showTip(result.msg,function(){
                        if(type==='saveAndClose'){
                            window._close();
                        }
                        return ;
                    },'success')
                })
            },
            //初始化页面
            initPage:function(){
                page.params = window.ownerData;
                page.getData(page.params);
                page.getTreeData();
            },
            
            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function(){
                $('#saveAndCloseBtn').on('click',function(){
                    page.saveData('saveAndClose');
                })
                $('#saveBtn').on('click',function(){
                    page.saveData('save');
                })
				$('#cancelBtn').on('click',function(){
                    window._close();
                })
            },
            //此方法必须保留
            init:function(){
                this.initPage();
                this.onEventListener();
            }
        }
    }();

 /////////////////////
    page.init();
});
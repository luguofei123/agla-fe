$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = { action: action };
            window.closeOwner(data);
        }
    }
    var pfData = ufma.getCommonData();
    var svData;
    var modelData = window.ownerData;
    var mAgency = modelData.agencyCode;
    var mAcct = modelData.acctCode;
    var isEdit = true
    var mxdata ={
        "mxSanlSysND":"明细账三栏式","mxShulSysND":"明细账数量式","mxWbSysND":"明细账外币式","mxSlwbSysND":"明细账数量外币式",
        "mxSanlND":"明细账三栏式","mxShulND":"明细账数量式","mxWbND":"明细账外币式","mxSlwbND":"明细账数量外币式"
    }
    var  zzdata={
        "zzSanlSysND":"总账三栏式","zzShulSysND":"总账外币式","zzSanlND":"总账三栏式","zzShulND":"总账外币式"
    }
    var ztreeDataSys = [{
        "id": 'zzSysND',
        "formattmplCode": '0',
        'pId': '0',
        'tmplName': '总账',
        'agencyCode': '*',
        'acctCode': '*',
        'tmplCode': '',
        'isLeaf': '0'
    }, {
        "id": 'mxSysND',
        "formattmplCode": '0',
        'pId': '0',
        'tmplName': '明细账',
        'agencyCode': '*',
        'acctCode': '*',
        'tmplCode': '',
        'isLeaf': '0'
    }]

    var ztreeDataAgc = [
    ]
    var page = function () {

        return {
            showHideTree: function (dom, code, text, codeType, eleCode,accitemss) {
                var params = {
                    "accsCode": modelData.accsCode,
                    "acctCode": modelData.acctCode,
                    "agencyCode": modelData.agencyCode,
                    "setYear": modelData.setYear,
                    "userId": modelData.userId,
                    "eleCode": eleCode//辅助项的eleCode，查级次用
                }
                if(eleCode == 'ACCO' && accitemss!=''){
                    params = {
                        "accsCode": modelData.accsCode,
                        "acctCode": modelData.acctCode,
                        "agencyCode": modelData.agencyCode,
                        "setYear": modelData.setYear,
                        "userId": modelData.userId,
                        "eleCode": eleCode,//辅助项的eleCode，查级次用
                        'accItemList':accitemss
                    }
                }
                if(modelData.isSys){
                    params.accsCode = $("#accsCodesel option:selected").attr('value')
                }
                params[codeType] = code;
                //zsj---经侯总确认弹窗选中数据后，再次打开暂时不用带有已选数据，若以后有此类需求可将这段代码取消注释
				/* params.treeData = rpt.treeAlldata;
				params.dataLevel = rpt.itemLevel;*/
                ufma.open({
                    url: bootPath + 'pub/baseTreeSelect/baseTreeSelect.html',
                    title: '选择' + text,
                    width: 580,
                    height: 545,
                    data: {
                        'flag': code,
                        'rootName': text,
                        'leafRequire': false,
                        'checkbox': true,
                        'data': params,
                        'isselectnoall':true,
                        'isParallelsum': modelData.isParallelsum
                    },
                    ondestory: function (result) {
                        if (result.action) {
							var levels = $(dom).parents('tr').find('.noborde').find('option:selected').attr('value')
                            var $input = $(dom).parents(".searchass").find("input");
                            var valList = [],
                                codeList = [];
                            for (var i = 0; i < result.data.length; i++) {
								if(levels!=0 && levels!=10){
									if(result.data[i].levelNum == levels){
										valList.push(result.data[i].codeName);
										codeList.push(result.data[i]);
									}
								}else if(levels==10){
									if(result.data[i].isLeaf==1){
										valList.push(result.data[i].codeName);
										codeList.push(result.data[i]);
									}
								}else{
									valList.push(result.data[i].codeName);
									codeList.push(result.data[i]);
								}
                            }
                            $input.val(valList.join(',')).attr('title', valList.join(','));
                            var attrCode = JSON.stringify(codeList);
                            $input.attr('code', attrCode).attr('itemLevel', result.itemLevel);
                            ufma.setBarPos($(window));
                        };
                        // if (result && result.data && result.data.length && result.data[0]) {
                        //     rpt.nowAccoCode = result.data[0].code;
                        // }
                    }
                });
            },
            getModelData: function () {
                var postSetData = {
                    agencyCode: modelData.agencyCode,
                    acctCode: modelData.acctCode,
                    componentId: 'GL_RPT',
                    rgCode: svData.svRgCode,
                    setYear: svData.svSetYear,
                    sys: '100',
                    directory: page.checkTrees.fullName
                };
                if (page.checkTrees.fullName == undefined) {
                    $('#modelsel').html('')
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/pqr/api/templ",
                        dataType: "json",
                        data: postSetData,
                        success: function (data) {
                            page.initRptTemplate(data)
                        },
                        error: function () { }
                    });
                }
            },
            initRptTemplate: function (result) {
                var data = result.data;
                //循环填入账簿样式
                var $op = '';
                for (var i = 0; i < data.length; i++) {
                    $op += '<option valueid="' + data[i].reportCode + '">' + data[i].reportName + '</option>'
                }
                $('#modelsel').html($op)
                $("#modelsel option[valueid='" + page.checkTrees.tmplCode + "']").attr('selected', true).prop('selected', true)
            },
            getPrtFormatList: function () {
                var ztreeDatanow = []
                for (var i = 0; i < ztreeDataSys.length; i++) {
                    ztreeDatanow.push(ztreeDataSys[i])
                }
                var seacData = { "agencyCode": mAgency, "acctCode": mAcct, "componentId": "GL_RPT"}
                if(modelData.isSys){
                    seacData.accsCode = ''
                }else{
                    seacData.accsCode = modelData.accsCode
                }
                ufma.post('/gl/vouPrint/getPrtTmplPdfNew', seacData, function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        if(mxdata[data.data[i].formattmplCode]!=undefined || zzdata[data.data[i].formattmplCode]!=undefined){
                            if(mxdata[data.data[i].formattmplCode]!=undefined){
                                data.data[i].pId = 'mxSysND'
                            }
                            if(zzdata[data.data[i].formattmplCode]!=undefined){
                                data.data[i].pId = 'zzSysND'
                            }
                            data.data[i].id = data.data[i].tmplGuid
                            data.data[i].tmplNameall = data.data[i].tmplName
                            data.data[i].isLeaf = '1'
                            if (data.data[i].agencyCode != '*' && modelData.isSys) { 
    
                            } else if(data.data[i].agencyCode == '*' && !modelData.isSys){
                                data.data[i].tmplName =  "<span>"+ data.data[i].tmplName+"</span><span class='spanora'>（系统级）</span>"
                                ztreeDatanow.push(data.data[i])
                            }else{
                                ztreeDatanow.push(data.data[i])
                            }
                        }
                    }
                    page.docTree(ztreeDatanow);
                })
                // ztreeDatanow.push({
                //     "tmplGuid":'12312awsdasd',
                //     "formattmplCode":'mxSanlSys',
                //     'tmplName':'功能科目明细账',
                //     'agencyCode':'*',
                //     'acctCode':'*',
                //     'tmplCode':'',
                //     'isLeaf':'1'
                // })
            },
            presetdata:function(){

            },
            getAccs:function(){
                var url = '/ma/sys/common/getEleTree';
				var callback = function(result) {
                    var data = result.data;
                    var tr = '';
                    for(var i=0;i<data.length;i++){
                        tr+='<option value ='+data[i].id+'>'+data[i].codeName+'</option>'
                    }
                    $("#accsCodesel").html(tr)
                    if(!modelData.isSys){
                        $(".accsCode").addClass('hide');
                        $("#accsCodesel option[value='" + modelData.accsCode + "']").attr('selected', true).prop('selected', true)
                    }
                };
                var accsdata = {
                    'rgCode':pfData.svRgCode,
                    'setYear':pfData.svSetYear,
                    'agencyCode': '*',
                    'eleCode': 'ACCS'
                }
				ufma.ajaxDef(url,'get',accsdata, callback);
            },
            docTree: function (zNodes) {
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        },
                        key: {
                            name: 'tmplName',
                        },
                    },
                    check: {
                        enable: false
                    },
                    view: {
                        nameIsHTML: true,
                        fontCss: getFontCss,
                        showLine: false,
                        showIcon: false,
                        selectedMulti: false
                    },
                    callback: {
                        beforeClick: bzTreeOnClick,
                        onClick: zTreeOnClick
                    }
                };
                function bzTreeOnClick(treeId, treeNode, clickFlag) {
                    $(".disableddiv").hide()
                    function trueclick(){
                        page.checkTrees = treeNode
                        isEdit = true
                        $(".mxzzradio").hide()
                        $(".mxzzradio").find('input').attr('checked',false).prop('checked',false)
                        if(mxdata[treeNode.formattmplCode]!=undefined || treeNode.id == 'mxSysND'){
                            $(".mxradio").show()
                            $(".zzradio").hide()
                        }
                        if(zzdata[treeNode.formattmplCode]!=undefined || treeNode.id == 'zzSysND'){
                            $(".zzradio").show()
                            $(".mxradio").hide()
                        }
                        if (treeNode.isLeaf == 1) {
                            if(mxdata[treeNode.formattmplCode]!=undefined){
                                page.checkTrees.fullName = mxdata[treeNode.formattmplCode]
                            }
                            if(zzdata[treeNode.formattmplCode]!=undefined){
                                page.checkTrees.fullName = zzdata[treeNode.formattmplCode]
                            }
                            if(modelData.isSys){
                                var  url = '/gl/EleAccItem/getRptAccItemTypePostAccs?acctCode=*&agencyCode=*'
                                +'&setYear='+modelData.setYear+'&accsCode='+treeNode.accsCode;
                                ufma.ajaxDef(url, 'POST', [], function (result) {
                                    page.nowAccItemTypeList = result.data;
                                    var listItem = page.nowAccItemTypeList;
                                    var newArr = [{
                                        "accItemCode": "",
                                        "accItemName": "请选择"
                                    }];
                                    for (var i = 0; i < listItem.length; i++) {
                                        newArr.push(listItem[i]);
                                    }
                                    $("#accList1").getObj().load(newArr);
                                    $("#accList2").getObj().load(newArr);
                                    $("#accList3").getObj().load(newArr);
                                    $("#accList4").getObj().load(newArr);
                                    $("#accList5").getObj().load(newArr);
                                    $("#accList6").getObj().load(newArr);
                                });
                            }
                            page.getModelData()
                            $("#fananName").val(treeNode.tmplNameall).attr("Guid", treeNode.id).removeAttr('formattmplCode')
                            $("#accsCodesel option[value='" + treeNode.accsCode + "']").attr('selected', true).prop('selected', true)
                            var searchsData={
                                acctCode: treeNode.acctCode,
                                agencyCode: treeNode.agencyCode,
                                prjCode:treeNode.id,
                                rptType: 'GL_RPT_ALLPRINT',
                                setYear: modelData.setYear
                            }
                            ufma.get('/gl/rpt/prj/getPrjcontent',searchsData,function(result){
                                if(result.data!=''){
                                    page.emptyFanData()
                                    page.getFanData(JSON.parse(result.data.prjContent))
                                    isEdit = true
                                }else{
                                    page.emptyFanData()
                                    if(treeNode.agencyCode == "*"){
                                        var savePrjArgu ={}
                                        savePrjArgu.acctCode = "*"; //账套代码
                                        savePrjArgu.agencyCode = "*"; //单位代码
                                        savePrjArgu.prjCode =$("#fananName").attr('Guid'); //方案代码
                                        savePrjArgu.prjName = $("#fananName").val(); //方案名称
                                        savePrjArgu.prjScope = '3' //方案作用域
                                        savePrjArgu.rptType ='GL_RPT_ALLPRINT'; //账表类型
                                        savePrjArgu.setYear =  modelData.setYear; //业务年度
                                        savePrjArgu.userId = modelData.userId; //用户Id
                                        savePrjArgu.prjContent ={
                                            "rptOption": [{
                                                "defCompoValue": "N",
                                                "optCode": "IS_INCLUDE_UNPOST",
                                                "optName": "含未记账凭证"
                                            }, {
                                                "defCompoValue": "N",
                                                "optCode": "IS_HAVE_AMTANDCUR",
                                                "optName": "发生额及余额为零不打印"
                                            }, {
                                                "defCompoValue": "N",
                                                "optCode": "IS_JUSTSHOW_OCCFISPERD",
                                                "optName": "只显示有发生期间"
                                            }, {
                                                "defCompoValue": "N",
                                                "optCode": "IS_SHOW_QCASSBAL",
                                                "optName": "打印期初辅助余额"
                                            },{
                                                "defCompoValue": "N",
                                                "optCode": "IS_NOASS_NOPRINT",
                                                "optName": "没有所选辅助项的科目不打印"
                                            },{
                                                "defCompoValue": "N",
                                                "optCode": "IS_PRINT_FRONTLASTPAGE",
                                                "optName": "打印承前页过次页"
                                            },{
                                                "defCompoValue": "Y",
                                                "optCode": "IS_INCLUDE_JZ",
                                                "optName": "含未结转凭证"
                                            }],
                                            "qryItems": [{
                                                "condType": "cond",
                                                "isOutTableShow": "1",
                                                "printLevel": "10",
                                                "itemLevel": "10",
                                                "isGradsum": "0",
                                                "itemType": "ACCO",
                                                "itemTypeName": "会计科目",
                                                "isShowCode": "0",
                                                "isShowFullName": "0",
                                                "items": []
                                            }]
                                        }
                                        ufma.ajax('/gl/rpt/prj/savePrjForPrt', "post", savePrjArgu, function(result){
                                            page.getFanData(savePrjArgu.prjContent)
                                            isEdit = true
                                        });
                                    }
                                    isEdit = true
                                }
                            })
                        } else {
                            $(".disableddiv").show()
                            page.getModelData()
                            page.emptyFanData()
                            $("#fananName").val('').removeAttr("Guid").removeAttr('formattmplCode')
                        }
                    }
                    if (!isEdit) {
                        ufma.confirm('当前改动未保存，是否切换', function (action) {
                            if (action) {
                                page.checkTrees = treeNode
                                trueclick()
                                if(key.isadd != '1'){
                                    
                                }
                            } else {
                                var zTreess = $.fn.zTree.getZTreeObj(treeId);
                                var nodes = zTreess.getNodeByParam('id', page.checkTrees.id)
                                zTreess.cancelSelectedNode()
                                zTreess.selectNode(nodes, true)
                                return false
                            }
                        })
                    } else {
                        page.checkTrees = treeNode
                        trueclick()
                        isEdit = true
                    }
                }
                function zTreeOnClick(event, treeId, treeNode) {

                };

                //节点名称超出长度 处理方式
                function addDiyDom(treeId, treeNode) {
                    var spaceWidth = 5;
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);
                    if (treeNode.level > 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
                        switchObj.before(spaceStr);
                    }
                    var spantxt = $("#" + treeNode.tId + "_span").html();
                    if (spantxt.length > 16) {
                        spantxt = spantxt.substring(0, 16) + "...";
                        $("#" + treeNode.tId + "_span").html(spantxt);
                    }
                }

                function focusKey(e) {
                    if (key.hasClass("empty")) {
                        key.removeClass("empty");
                    }
                }

                function blurKey(e) {
                    if (key.get(0).value === "") {
                        key.addClass("empty");
                    }
                }
                var lastValue = "",
                    nodeList = [],
                    fontCss = {};

                function clickRadio(e) {
                    lastValue = "";
                    searchNode(e);
                }

                function allNodesArr() {
                    var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
                    var nodes = zTree.getNodes();
                    var allNodesArr = [];
                    var allNodesStr;
                    for (var i = 0; i < nodes.length; i++) {
                        var result = "";
                        var result = page.getAllChildrenNodes(nodes[i], result);
                        var NodesStr = result
                        NodesStr = NodesStr.split(",");
                        NodesStr.splice(0, 1, nodes[i].id);
                        NodesStr = NodesStr.join(",");
                        allNodesStr += "," + NodesStr;
                    }
                    allNodesArr = allNodesStr.split(",");
                    allNodesArr.shift();
                    return allNodesArr;
                }

                function updateNodes(highlight) {
                    var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
                    for (var i = 0, l = nodeList.length; i < l; i++) {
                        nodeList[i].highlight = highlight;
                        zTree.updateNode(nodeList[i]);
                    }
                }

                function getFontCss(treeId, treeNode) {
                    return (!!treeNode.highlight) ? {
                        color: "#F04134",
                        "font-weight": "bold",
                        "font-size": '16px'
                    } : {
                            color: "#333",
                            "font-weight": "normal",
                            "font-size": '14px'
                        };
                }

                function filter(node) {
                    return !node.isParent && node.isFirstNode;
                }
                var key;
                $(document).ready(function () {
                    var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
                    key = $("#key");
                    key.bind("focus", focusKey)
                        .bind("blur", blurKey)

                    zTree = $.fn.zTree.getZTreeObj("docTree");//treeDemo界面中加载ztree的div
                    zTree.expandAll(true)
                    // zTree.cancelSelectedNode();//先取消所有的选中状态
                    // zTree.selectNode(node,true);//将指定ID的节点选中
                    // zTree.setting.callback.onClick(null, zTree.setting.treeId, node)
                });
            },
            rptOptionArr: function () {
				var rptOptionArr = [];
				$('.rptOption').each(function () {
					var rptOptionObj = {};
					var flag = $(this).prop("checked");
					if (flag) {
						rptOptionObj.defCompoValue = "Y";
					} else {
						rptOptionObj.defCompoValue = "N";
					}
					rptOptionObj.optCode = $(this).val();
					if ($(this).val() == "IS_JUSTSHOW_OCCFISPERD") {
						rptOptionObj.optName = "只显示有发生期间";
					} else if ($(this).val() == "IS_SHOW_QCASSBAL") {
						rptOptionObj.optName = "打印期初辅助余额";
					}else if ($(this).val() == "IS_INCLUDE_UNPOST") {
						rptOptionObj.optName = "含未记账凭证";
					} else if ($(this).val() == "IS_HAVE_AMTANDCUR") {
						rptOptionObj.optName = "发生额及余额为零不打印";
					} else if ($(this).val() == "IS_INCLUDE_JZ") {
						rptOptionObj.optName = "含未结转凭证";
					} else if ($(this).val() == "IS_NOASS_NOPRINT") {
						rptOptionObj.optName = "没有所选辅助项的科目不打印";
					} else if ($(this).val() == "IS_PRINT_FRONTLASTPAGE") {
						rptOptionObj.optName = "打印承前页过次页";
					}
					rptOptionArr.push(rptOptionObj);
				})
				return rptOptionArr;
			},
            emptyFanData:function(){
                for(var i=0;i<$('.ufma-table tbody tr').length;i++){
                    var s= i+1;
                    var trs = $('.ufma-table tbody tr').eq(i)
                    $("#accList"+s).getObj().setValue('','')  
                    trs.find('.selecttd').find('option').eq(0).attr('selected',true).prop('selected',true)
                    trs.find('.levels').find('option').eq(0).attr('selected',true).prop('selected',true)
                    trs.find('.isLevel').find('option').eq(0).attr('selected',true).prop('selected',true)
                    trs.find('.searchass input').val('').removeAttr('title')
                }
                $('.rptOption').prop('checked',false).attr('checked',false)
                $('#kmqjbm input[name="isShowCode"]').prop('checked',true).attr('checked',true)
                $('.rptOption[name="IS_INCLUDE_JZ"]').prop('checked',true).attr('checked',true)
                
                $('#isShowFullNamej').prop('checked',true).attr('checked',true)
            },
            getFanData:function(prjContent){
                $(".kmOption[value='"+page.checkTrees.fullName+"']").prop('checked',true).attr('checked',true)
                for(var i=0;i<prjContent.qryItems.length;i++){
                    var s= i+1;
					var trs = $('.ufma-table tbody tr').eq(i)
                    $("#accList"+s).getObj().setValue(prjContent.qryItems[i].itemType,prjContent.qryItems[i].itemTypeName)
                    var $input = $('.ufma-table tbody').find('tr').eq(i).find('.searchass input')
                    trs.find('.selecttd').find('option[value="'+ prjContent.qryItems[i].isOutTableShow +'"]').attr('selected',true).prop('selected',true)
                    trs.find('.levels').find('option[value="'+ prjContent.qryItems[i].printLevel +'"]').attr('selected',true).prop('selected',true)
                    trs.find('.isLevel').find('option[value="'+ prjContent.qryItems[i].isGradsum +'"]').attr('selected',true).prop('selected',true)
                    if(prjContent.qryItems[i].isShowCode ==1){
                        $('#kmqjbm input[name="isShowCode"]').prop('checked',true).attr('checked',true)
                    }else{
                        $('#kmqjbm input[name="isShowCode"]').prop('checked',false).attr('checked',false)
                    } 
                    if(prjContent.qryItems[i].isShowFullName ==1){
                        $('#isShowFullNameq').prop('checked',true).attr('checked',true)
                    }else{
                        $('#isShowFullNamej').prop('checked',true).attr('checked',true)
                    }
                    var valList = []
                    for (var z = 0; z < prjContent.qryItems[i].items.length; z++) {
                        valList.push(prjContent.qryItems[i].items[z].code+ ' '+prjContent.qryItems[i].items[z].name);
                    }
                    $input.val(valList.join(',')).attr('title',valList.join(','));
                    var attrCode = JSON.stringify(prjContent.qryItems[i].items);
                    $input.attr('code', attrCode)
                }
                for(var i in prjContent.rptOption){
                    if(prjContent.rptOption[i].defCompoValue=='Y'){
                        var code = prjContent.rptOption[i].optCode
                        $('.rptOption[value="'+ code +'"]').prop('checked',true).attr('checked',true)
                    }else{
                        var code = prjContent.rptOption[i].optCode
                        $('.rptOption[value="'+ code +'"]').prop('checked',false).attr('checked',false)
                    }
                }
                if(prjContent.qryItems.length==0){
                    page.emptyFanData()
                }
            },
            savesData:function(){
				var rptOption = []
				var qryItems = []
				for (var i = 0; i < $('.ufma-table tbody tr').length; i++) {
					var s = i + 1
					var trs = $('.ufma-table tbody tr').eq(i)
					var qryitemss = {}
					if ($('#accList' + s).getObj().getValue() != '') {
                        qryitemss.condType = "cond"
                        qryitemss.isOutTableShow = trs.find('.selecttd option:selected').attr("value")
                        qryitemss.printLevel= trs.find('.levels option:selected').attr("value")
                        qryitemss.itemLevel= trs.find('.levels option:selected').attr("value")
                        qryitemss.isGradsum= trs.find('.isLevel option:selected').attr("value")
						qryitemss.itemType = $('#accList' + s).getObj().getValue()
                        qryitemss.itemTypeName = $('#accList' + s).getObj().getText()
                        qryitemss.isShowCode = $('#kmqjbm input[name="isShowCode"]').is(':checked')?"1":"0";
                        qryitemss.isShowFullName = $('#kmqjbm input[name="isShowFullName"]:checked').val();
						if(trs.find('.searchass').find('input').attr('code')!=undefined){
							qryitemss.items = JSON.parse(trs.find('.searchass').find('input').attr('code'))
						}else{
							qryitemss.items = []
						}
						qryItems.push(qryitemss)
					}
				}
				var datas={
					rptOption:page.rptOptionArr(),
					qryItems:qryItems
				}
				return datas
            },
            initPage: function () {
                page.reslist = ufma.getPermission();
                svData = ufma.getCommonData();
                if (modelData.isSys) {
                    $('.btn-fanan').hide()
                }
                var jici = '<select class="noborde"><option value="0">全部</option><option value="1">一级</option>'+
                '<option value="2">二级</option> <option value="3">三级</option>'+
                '<option value="4">四级</option> <option value="5">五级</option>'+
                '<option value="6">六级</option> <option value="7">七级</option>'+
                '<option value="8">八级</option> <option value="9">九级</option>'+
                '<option value="10">末级</option></select>'
                $(".ufma-table .levels").html(jici)
                var url = '/gl/EleAccItem/getRptAccItemTypePostAccs?acctCode='+modelData.acctCode+'&agencyCode='+modelData.agencyCode
                +'&setYear='+modelData.setYear+'&userId='+modelData.userId;
                if(modelData.isSys){
                    url = '/gl/EleAccItem/getRptAccItemTypePostAccs?acctCode=*&agencyCode=*'
                 +'&setYear='+modelData.setYear+'&accsCode='+modelData.accsCode;
                }
                ufma.ajaxDef(url, 'POST', [], function (result) {
                    page.nowAccItemTypeList = result.data;
                });
                $('.kmOption').on('change',function(){
                    page.checkTrees.fullName = $(this).attr('value')
                    page.getModelData()
                })
                $("#accList1,#accList2,#accList3,#accList4,#accList5,#accList6").ufCombox({
                    idField: "accItemCode",
                    textField: "accItemName",
                    placeholder: "请选择",
                    readonly: true,
                    onChange: function (sender, data) {
                        isEdit = false
                        var raun = true;
                        var senderid = sender.attr("id")
                        if ($("#" + senderid).getObj().getText() != '请选择') {
                            for (var i = 1; i < 7; i++) {
                                if ($("#accList" + i).getObj().getValue()!='' && $("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
                                    raun = false
                                    ufma.showTip("请勿选择重复辅助项", function () { }, "warning");
                                    $("#" + senderid).getObj().setValue("", "请选择")
                                } else {
                                    $("#" + senderid).parents('tr').find('td').find('.selecttd').html('')
                                    $("#" + senderid).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
                                }
                            }
                            var sel = '<select class="assIsshow">'
                            sel += '<option value="1">是</option>'
                            sel += '<option value="0">否</option>'
                            sel += '</select>'
                            $("#" + senderid).parents('tr').find('.selecttd').html(sel)
                        } else {
                            $("#" + senderid).parents('tr').find('td').find('.selecttd')
                                .html('')
                            $("#" + senderid).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
                        }
                    },
                    onComplete: function (sender) {
                    }
                });
                var listItem = page.nowAccItemTypeList;
                var newArr = [{
                    "accItemCode": "",
                    "accItemName": "请选择"
                }];
                for (var i = 0; i < listItem.length; i++) {
                    newArr.push(listItem[i]);
                }
                $("#accList1").getObj().load(newArr);
                $("#accList2").getObj().load(newArr);
                $("#accList3").getObj().load(newArr);
                $("#accList4").getObj().load(newArr);
                $("#accList5").getObj().load(newArr);
                $("#accList6").getObj().load(newArr);
				$(document).on('mouseup','.uf-combox-clear',function(){
                    $(this).parents('tr').find('td').find('.selecttd')
                        .html('')
                    $(this).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
                })
				$(document).on('change','.noborde',function(){
                    $(this).parents('tr').find('.searchass').find('input').val('').removeAttr('code').removeAttr('title')
                })
                $(document).on("click", '.search-btn', function (e) {
                    e.stopPropagation();
                    var combox = $(this).attr('data-ass')
                    var $combox = $('#' + combox)
                    var code = $combox.getObj().getValue();
                    var text = $combox.getObj().getText();
                    var keyss = ''
                    if ($combox.getObj().getItem() != undefined) {
                        var eleCode = $combox.getObj().getItem().eleCode;
                        if ($combox.getObj().getItem().accItemCode == 'ACCO') {
                            eleCode = $combox.getObj().getItem().accItemCode
                            var comboxindex = parseFloat(combox.substring(combox.length-1,combox.length))-1
                            var accts = []
                            for(var i=comboxindex;i>0;i--){
                                if($('#accList' + i).getObj().getValue() != ''){
                                    accts.push($('#accList' + i).getObj().getValue())
                                }
                            }
                            keyss= accts.join(',')
                        }
                        if (eleCode) {
                            page.showHideTree(this, code, text, "accItemCode", eleCode,keyss);
                        } else {
                            ufma.showTip("请先选择辅助项")
                        }
                    } else {
                        ufma.showTip("此辅助项在当前单位账套下无内容，请重新选择辅助项")
                    }
                });
                $(document).on("click", '.btn-add', function (e) {
                    if(page.checkTrees == undefined){
                        ufma.showTip('请先选择一个账表节点')
                        return false
                    }
                    var key = JSON.parse(JSON.stringify(page.checkTrees))
                    // if (page.checkTrees.agencyCode == '*' && !modelData.isSys) {
                    //     ufma.showTip('此节点下当前不可新增方案')
                    //     return false
                    // }
                    if (key.isadd != '1' && key.isLeaf != '1' && key.id!="zzSysND"  &&  key.id!="mxSysND") {
                        ufma.showTip('此节点下不可新增方案')
                        return false
                    }
                    if (key.isLeaf == '1') {
                        key.id = key.pId
                    }else{
                        key.pId = key.id
                    }
                    page.checkTrees.agencyCode = modelData.agencyCode
                    page.checkTrees.acctCode = modelData.acctCode
                    page.checkTrees.accsCode = modelData.accsCode
                    page.checkTrees.isLeaf = "1"
                    if(key.id == 'zzSysND'){
                        page.checkTrees.fullName = '总账三栏式'
                        $('.kmOption[value="总账三栏式"]').attr('checked',true).prop('checked',true)
                    }
                    if(key.id == 'mxSysND'){
                        page.checkTrees.fullName = '明细账三栏式'
                        $('.kmOption[value="明细账三栏式"]').attr('checked',true).prop('checked',true)
                    }
                    $(".disableddiv").hide()
                    isEdit = false
                    $("#fananName").val('').removeAttr("Guid").removeAttr('formattmplCode')
                    page.getModelData()
                    page.emptyFanData()
                    $("#fananName").focus()
                })
                $(document).on("click", '.btn-fanan', function (e) {
                    var key = JSON.parse(JSON.stringify(page.checkTrees))
                    if (key.isLeaf != '1') {
                        ufma.showTip('此节点下不可复制')
                        return false
                    }
                    if (key.agencyCode != '*') {
                        ufma.showTip('只可复制系统级方案')
                        return false
                    }
                    var datasid = page.checkTrees.formattmplCode
                    if (key.isLeaf == '1') {
                        key.id = datasid
                    }
                    isEdit = false
                    $("#fananName").val('').removeAttr("Guid").attr('formattmplCode', datasid).focus()
                    page.getModelData()
                })
                $(document).on("input", '#fananName', function (e) {
                    isEdit = false
                })
                $(document).on("change", '#modelsel', function (e) {
                    isEdit = false
                })
                $(document).on("change", '#accsCodesel', function (e) {
                    isEdit = false
                    for(var i=0;i<$('.ufma-table tbody tr').length;i++){
                        var s= i+1;
                        var trs = $('.ufma-table tbody tr').eq(i)
                        $("#accList"+s).getObj().setValue('','')  
                        trs.find('.selecttd').find('option').eq(0).attr('selected',true).prop('selected',true)
                        trs.find('.levels').find('option').eq(0).attr('selected',true).prop('selected',true)
                        trs.find('.isLevel').find('option').eq(0).attr('selected',true).prop('selected',true)
                        trs.find('.searchass input').val('').removeAttr('title')
                    }
                    if(modelData.isSys){
                        var  url = '/gl/EleAccItem/getRptAccItemTypePostAccs?acctCode=*&agencyCode=*'
                        +'&setYear='+modelData.setYear+'&accsCode='+$("#accsCodesel option:selected").attr("value")
                        ufma.ajaxDef(url, 'POST', [], function (result) {
                            page.nowAccItemTypeList = result.data;
                            var listItem = page.nowAccItemTypeList;
                            var newArr = [{
                                "accItemCode": "",
                                "accItemName": "请选择"
                            }];
                            for (var i = 0; i < listItem.length; i++) {
                                newArr.push(listItem[i]);
                            }
                            $("#accList1").getObj().load(newArr);
                            $("#accList2").getObj().load(newArr);
                            $("#accList3").getObj().load(newArr);
                            $("#accList4").getObj().load(newArr);
                            $("#accList5").getObj().load(newArr);
                            $("#accList6").getObj().load(newArr);
                        });
                    }
                })
                $(document).on("click", '#btn-save', function (e) {
                    if ($("#fananName").val() == '') {
                        ufma.showTip("请输入方案名称")
                        return false;
                    }
                    if($('#modelsel option:selected').length==0){
                        ufma.showTip("无可选模板不可保存")
                        return false;
                    }
                    var key = JSON.parse(JSON.stringify(page.checkTrees));
                    if (page.checkTrees.agencyCode == '*' && !modelData.isSys && $("#fananName").attr('formattmplcode')==undefined) {
                        ufma.showTip('此节点下当前不可改动')
                        return false
                    }
                    if (key.isadd != '1' && key.isLeaf != '1' && key.id!="zzSysND"  &&  key.id!="mxSysND") {
                        ufma.showTip('此节点下当前不可改动')
                        return false
                    }
                    var isacclist = true
                    var isordtable = true
                    for (var i = 1; i < $('.ufma-table tbody tr').length+1; i++) {
                        if ($('#accList' + i).getObj().getValue() != '') {
                            isacclist = false
                            if ($('.ufma-table tbody tr').eq(i-1).find('.assIsshow').find('option:selected').attr('value') != '0') {
                                isordtable = false
                            }
                        }
                    }
                    if (isacclist) {
                        ufma.showTip('打印方案未设置打印项')
                        return false
                    }
                    if (isordtable) {
                        ufma.showTip('需要设置至少要一个表外项')
                        return false
                    }
                    if (key.isLeaf == '1') {
                        key.ids = key.id
                        for(var i=0;i<$('.kmOption').length;i++){
                            if($('.kmOption').eq(i).is(":checked")){
                                key.id =  $('.kmOption').eq(i).attr('formpId')
                            }
                        }
                    }
                    if ($("#fananName").attr('formattmplCode') != undefined) {
                        key.id = $("#fananName").attr('formattmplCode')
                    }
                    var saveData = {
                        "pubPrtPrintTmpl": {
                            "tmplGuid": $("#fananName").attr('Guid'),
                            "agencyCode": modelData.agencyCode,
                            "acctCode": modelData.acctCode,
                            "accsCode":modelData.accsCode,
                            "tmplValue": "",
                            "formattmplCode": key.id,
                            "tmplCode": $('#modelsel option:selected').attr("valueid"),
                            "componentId": "GL_RPT",
                            "tmplName": $("#fananName").val(),
                            "defaultTmpl": 0
                        },
                        "pubPrtFormatTmpl": {
                            "tmplType": "0"
                        }
                    }
                    if (modelData.isSys && $("#fananName").attr('formattmplCode') == undefined) {
                        saveData.pubPrtPrintTmpl.agencyCode = "*"
                        saveData.pubPrtPrintTmpl.acctCode = "*"
                        saveData.pubPrtPrintTmpl.accsCode = $("#accsCodesel").find('option:selected').attr('value')
                    }
                    if ($("#fananName").attr('Guid') == undefined) {
                        saveData.pubPrtPrintTmpl.tmplGuid = ''
                    }
                    if ($("#fananName").attr('formattmplCode') != undefined) {
                        saveData.pubPrtPrintTmpl.formattmplCode = $("#fananName").attr('formattmplCode')
                    }
                    ufma.post('/gl/vouPrint/copySysPrtSetPdfForRpt', saveData, function (data) {
                        ufma.showTip('保存成功',function(){},'success')
                        if(data.data!='success'){
                            var id = data.data
                            $("#fananName").attr('Guid', id)
                            isEdit = true
                            var keyPid;
                            if(mxdata[key.id]!=undefined){
                                keyPid = 'mxSysND'
                            }
                            if(zzdata[key.id]!=undefined){
                                keyPid = 'zzSysND'
                            }
                            var addData = {
                                "id": id,
                                "formattmplCode": key.id,
                                'pId': keyPid,
                                'tmplName':  $("#fananName").val(),
                                'tmplNameall': $("#fananName").val(),
                                'agencyCode': saveData.pubPrtPrintTmpl.agencyCode,
                                'acctCode': saveData.pubPrtPrintTmpl.acctCode,
                                'accsCode':saveData.pubPrtPrintTmpl.accsCode,
                                'tmplCode': $('#modelsel option:selected').attr("valueid"),
                                'isLeaf': '1',
                                'fullName': key.fullName
                            }
                            if(modelData.agencyCode=="*"){
                                addData.tmplName = "<span>"+ $("#fananName").val() +"</span><span class='spanora'>（系统级）</span>"
                            }
                            var treeObj = $.fn.zTree.getZTreeObj("docTree");
                            var node = treeObj.getNodes(); //可以获取所有的父节点
                            var nodes = treeObj.transformToArray(node); //获取树所有节点
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].id == keyPid) {
                                    treeObj.addNodes(nodes[i], addData);
                                }
                            }
                            var nodesd = treeObj.getNodeByParam("id", id);
                            treeObj.selectNode(nodesd, true);//指定选中ID的节点
                            treeObj.expandNode(nodesd, true, false);//指定选中ID节点展开
                            page.checkTrees = addData
                        }else{
                            isEdit = true
                            var treeObj = $.fn.zTree.getZTreeObj("docTree");
                            type = "refresh",
                            silent = false;
                            var nodes = treeObj.getNodeByParam("id", key.ids, null); 
                            nodes.tmplName=$("#fananName").val()
                            nodes.tmplCode = $('#modelsel option:selected').attr("valueid")
                            treeObj.updateNode(nodes);
                            treeObj.reAsyncChildNodes(nodes[0], type, silent);
                            page.checkTrees = nodes
                        }
                        var savePrjArgu = {};
                        savePrjArgu.acctCode = key.acctCode; //账套代码
                        savePrjArgu.agencyCode = key.agencyCode; //单位代码
                        savePrjArgu.prjCode =$("#fananName").attr('Guid'); //方案代码
                        savePrjArgu.prjName = $("#fananName").val(); //方案名称
                        savePrjArgu.prjScope = '3' //方案作用域
                        savePrjArgu.rptType ='GL_RPT_ALLPRINT'; //账表类型
                        savePrjArgu.setYear =  modelData.setYear; //业务年度
                        savePrjArgu.userId = modelData.userId; //用户Id
                        savePrjArgu.prjContent =  page.savesData();//方案内容
                        ufma.ajax('/gl/rpt/prj/savePrjForPrt', "post", savePrjArgu, function(result){

                        });
                    })
                })
                $(document).on("click", '.btn-delfanan', function (e) {
                    var key = JSON.parse(JSON.stringify(page.checkTrees));
                    if(key.isLeaf!='1'){
                        ufma.showTip("此节点不可删除")
                        return false;
                    }
                    if(key.agencyCode=='*' && !modelData.isSys){
                        ufma.showTip("此节点请在系统级打印设置界面删除")
                        return false;
                    }
                    var delData = {
                        "pubPrtPrintTmpl": {
                            "tmplGuid": $("#fananName").attr('Guid'),
                            "agencyCode": key.agencyCode,
                            "acctCode": key.acctCode,
                            "tmplValue": "",
                            "formattmplCode": key.formattmplCode,
                            "tmplCode": key.tmplCode,
                            "componentId": "GL_RPT",
                            "tmplName": $("#fananName").val(),
                            "defaultTmpl": 0
                        },
                        "pubPrtFormatTmpl": {
                            "tmplType": "0"
                        }
                    }
                    ufma.post('/gl/vouPrint/deletePrtSetNew', delData, function (data) {
                        var treeObj = $.fn.zTree.getZTreeObj("docTree");
                        var nodes = treeObj.getNodeByParam("id", key.id, null); 
                        treeObj.removeNode(nodes);
                        var argu = {
                            "agencyCode": key.agencyCode,
                            "prjCode": $("#fananName").attr('Guid'),
                            "rptType": 'GL_RPT_ALLPRINT',
                            "setYear": modelData.setYear,
                            "userId": modelData.userId,
                        };
                        ufma.delete('/gl/rpt/prj/deletePrj', argu, function(data){
                            ufma.showTip('删除成功',function(){},'success')
                            $("#fananName").val('').removeAttr('Guid')
                            page.emptyFanData()
                        });

                    })
                })
                page.getAccs()
                page.getPrtFormatList()
            },

            //此方法必须保留
            init: function () {
                this.initPage();
                ufma.parse();
                //点击取消的事件
                $('#btn-qx').click(function () {
                    _close("cancel");
                });
                setTimeout(function(){
                    $('.container-fluid').css('height', $(".ufma-layout-up").css('height'))
                    $(".ztrees").css("height", $(".ufma-layout-up").height() - 50 + "px")
                },100)

            }
        }
    }();
    /////////////////////
    page.init();
});
$(function() {
	window._close = function(action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
	};
	var pfData = ufma.getCommonData();
	var treeObj;

    //接口URL集合
    var interfaceURL = {
        getAccoTree: "/ma/sys/common/getEleTree",//请求会计科目树，根据会计体系过滤科目树
        saveAccoRefAccos:"/ma/sys/coaAccSys/save",//保存关联会计科目
        queryAccoTable:"/ma/sys/coaAccSys/queryAccoTable",//请求科目具体数据
    };
	var page = function() {
		return {
		    //请求会计科目具体数据
            queryAccoTable:function(){
                var argu ={};
                argu["rgCode"] = pfData.svRgCode;
                argu["setYear"] = pfData.svSetYear;
                argu["agencyCode"] = window.ownerData.agencyCode;
                argu["acctCode"] = window.ownerData.acctCode;
                argu["accsCode"] = window.ownerData.accsCode;
                argu["chrCode"] = window.ownerData.rowData.chrCode;
                ufma.get(interfaceURL.queryAccoTable,argu,function (result) {
                    page.setSelectedAcco(result);
                })
            },
		    //请求会计科目树
            getAccoTree:function () {
                var accaCode;
                if(window.ownerData.rowData.accaCode == 1){
                    accaCode = 2;
                }else if(window.ownerData.rowData.accaCode == 2){
                    accaCode = 1;
                }
				var argu = {
                    rgCode:pfData.svRgCode,
                    setYear:pfData.svSetYear,
                    agencyCode:window.ownerData.rowData.agencyCode,
                    acctCode:window.ownerData.rowData.acctCode,
                    accsCode:window.ownerData.rowData.accsCode,
                    acceCode:"",
                    ilaccCode:"",
					// accaCode:accaCode,
                    eleCode:"ACCO"

                };
                ufma.showloading('正在加载数据，请耐心等待...');
				ufma.get(interfaceURL.getAccoTree,argu,function (result) {
					page.accoTree(result);
                })
            },
            //会计科目树
            accoTree: function (result) {
                var treeData = result.data;
                var treeSetting = {
                    view: {
                        showLine: false,
                        showIcon: false
                    },
                    check: {
                        enable: true,
                        chkStyle: "checkbox"
                    },

                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 0
                        },

                        key: {
                            name: "codeName",
                        },

                        keep: {
                            leaf: true
                        }
                    },
                    callback: {
                        // onClick:function (event, treeId, treeNode) {
                        //     page.clickTreeNode(event, treeId, treeNode);
                        // }
                        // beforeCheck:function (treeId, treeNode) {
                        //     if(treeNode.isLeaf == "0"){
                        //         ufma.showTip("请勾选会计科目末级节点",function () {
                        //
                        //         },"warning");
                        //         return false;
                        //     }
                        // }
                    }
                };
                //
                if (!$.isNull(treeObj)) {
                    treeObj.destroy();
                }
                treeObj = $.fn.zTree.init($('#accoTree'), treeSetting, treeData);
                treeObj.expandAll(true);
                ufma.hideloading();
                // var timeId = setTimeout(function () {
                //     page.setSelectedAcco();
                //     clearTimeout(timeId);
                // },300)
                page.queryAccoTable();
            },
            setSelectedAcco:function (result) {
                page.lastVer = result.data.accoList[0].lastVer;
                var eleAccoAccos = result.data.accoList[0].eleAccoAccos;
                if(eleAccoAccos.length == 0){
                    return false;
                }
                var selectedHtml = "";
                var zTreeObj = $.fn.zTree.getZTreeObj("accoTree");
                if (!zTreeObj) {
                    return false;
                }
                for(var i=0;i<eleAccoAccos.length;i++){
                    selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="'+eleAccoAccos[i].refAccoCode+'" accaCode="'+eleAccoAccos[i].refAccaCode+'"/>'+eleAccoAccos[i].refAccoCode+ "" + eleAccoAccos[i].refAccoCodeName+'<span></span></label>';
                    var nodes = treeObj.getNodesByParam("code", eleAccoAccos[i].refAccoCode, null);
                    if(nodes.length>0){
                    	  zTreeObj.checkNode(nodes[0], true, true);
                     }
                }
                $(".have-selected .select-content").append(selectedHtml);

            },
            //暂存已选中科目的code
            removeRepetition:function (code) {
                if(page.repetition){
                    if(page.repetition.indexOf(code) < 0){
                        page.repetition.push(code);
                    }
                }else{
                    page.repetition = [];
                    page.repetition.push(code);
                }
            },

            //选择会计科目
            selectedTreeNode:function (event, treeId, treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj("accoTree");
                var nodes = treeObj.getCheckedNodes(true);
                var selectedHtml = "";
                $(".have-selected .select-content").html("");
                for(var i = 0;i<nodes.length;i++){
                    if(nodes[i].isLeaf != "0"){
                        selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="'+nodes[i].code+'" accaCode="'+nodes[i].accaCode+'"/>'+nodes[i].codeName+'<span></span></label>';
                    }
                }
                $(".have-selected .select-content").append(selectedHtml);
            },
            //移除会计科目
            cancelTreeNode:function () {
                var selectedLabels = $('input[name="selectedNode"]:checked');
                if(selectedLabels.length == 0){
                    ufma.showTip("请选择要移除的科目",function () {

                    },"warning");
                    return false;
                }
                $(selectedLabels).each(function () {
                    $(this).closest("label").remove();
                })
            },
			onEventListener: function() {
				$("#coaAccCancelAll").on("click",function () {
                    _close("cancel");
                });
				$("#node-selecte").on("click",function () {
                    page.selectedTreeNode();
                });
                $("#node-cancle").on("click",function () {
                    page.cancelTreeNode();
                });
                //保存关联会计科目
                $("#coaAccSaveAll").on("click",function () {
                    var selectedLabels = $('input[name="selectedNode"]');

                    var eleAccoAccos = [];
                    $(selectedLabels).each(function () {
                        var obj = {
                            "refAccoCode":$(this).attr("code"),
                            "refAccaCode":$(this).attr("accaCode")
                        };
                        eleAccoAccos.push(obj);
                    });
                    ufma.showloading('数据保存中，请耐心等待...');
                    var argu = {
                        "rgCode":pfData.svRgCode,
                        "setYear":pfData.svSetYear,
                        "agencyCode":window.ownerData.rowData.agencyCode,
                        "acctCode":window.ownerData.rowData.acctCode,
                        "accsCode":window.ownerData.rowData.accsCode,
                        "acceCode":window.ownerData.rowData.acceCode,
                        "accaCode":window.ownerData.rowData.accaCode,
                        "chrId":window.ownerData.rowData.chrId,
                        "chrCode":window.ownerData.rowData.chrCode,
                        "chrName":window.ownerData.rowData.chrName,
                        "lastVer":page.lastVer,
                        "eleAccoAccos":eleAccoAccos,
                        "saveType":"8"
                    };
                    $("#coaAccSaveAll").attr("disabled",true);
                    $("#coaAccCancelAll").attr("disabled",true);
                    ufma.post(interfaceURL.saveAccoRefAccos, argu, function (result) {
                    	ufma.hideloading();
                        ufma.showTip(result.msg,function () {
                            _close("save");
                        },result.flag)
                    });
                    var timeId = setTimeout(function () {
                        $("#coaAccSaveAll").attr("disabled",false);
                        $("#coaAccCancelAll").attr("disabled",false);
                    },5000);
                })

			},
			init: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.onEventListener();
				page.getAccoTree();
				$(".current-acco span").html(window.ownerData.rowData.chrCode+" "+window.ownerData.rowData.chrName);
			}
		}
	}();

	page.init();
});
var prs = {};

prs.atree = function (param) {
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: param.idKey,
                pIdKey: "pId",
                rootPId: null
            },
            key: {
                title:param.name,
                name:param.name
            },
        },
        check: {
            enable: true
        },
        view: {
            fontCss: getFontCss,
            showLine: false,
            showIcon: false,
            selectedMulti: false
        },
        callback: {
            onClick: zTreeOnClick,
            onCheck: zTreeOnCheck
        }
    };

    function zTreeOnClick(event, treeId, treeNode) {
        var be = treeNode.checked;
        var myTree = $.fn.zTree.getZTreeObj(treeId);
        myTree.checkNode(treeNode, !be, true);
    };

    function zTreeOnCheck(event, treeId, treeNode) {
        var be = treeNode.checked;
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

    var lastValue = "", nodeList = [], fontCss = {};

    function clickRadio(e) {
        lastValue = "";
        searchNode(e);
    }

    function allNodesArr() {
        var zTree = $.fn.zTree.getZTreeObj(param.ele);
        var nodes = zTree.getNodes();
        var allNodesArr = [];
        var allNodesStr;
        for (var i = 0; i < nodes.length; i++) {
            var result = "";
            var result = rpt2.getAllChildrenNodes(nodes[i], result);
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

    function searchNode(e) {
        var zTree = $.fn.zTree.getZTreeObj(param.ele);
        var value = $.trim(key.get(0).value);
        var keyType = "name";

        if (key.hasClass("empty")) {
            value = "";
        }
        if (lastValue === value) return;
        lastValue = value;
        if (value === "") {
            updateNodes(false);
            return;
        }
        updateNodes(false);

        nodeList = zTree.getNodesByParamFuzzy(keyType, value);

        updateNodes(true);

        var NodesArr = allNodesArr();
        console.info(NodesArr)
        if (nodeList.length > 0) {
            var index = NodesArr.indexOf(nodeList[0].id.toString());
            $(".rpt-atree-box-body").scrollTop((30 * index));
        }
    }

    function updateNodes(highlight) {
        var zTree = $.fn.zTree.getZTreeObj(param.ele);
        for (var i = 0, l = nodeList.length; i < l; i++) {
            nodeList[i].highlight = highlight;
            zTree.updateNode(nodeList[i]);
        }
    }

    function getFontCss(treeId, treeNode) {
        return (!!treeNode.highlight) ? {color: "#F04134", "font-weight": "bold"} : {
            color: "#333",
            "font-weight": "normal"
        };
    }

    function filter(node) {
        return !node.isParent && node.isFirstNode;
    }

    var key;
    $(document).ready(function () {
        var treeObj = $.fn.zTree.init($("#" + param.ele), setting, param.zNodes);

        // var nodes = treeObj.getNodesByParam("level", 0);
        // for (var i = 0; i < nodes.length; i++) {
        //     treeObj.expandNode(nodes[i], true, false, false);
        // }
        if(param.isOpenAll){
            treeObj.expandAll(true);
        }
        if(param.selCheckedNode){
            param.selCheckedNode();
        }
        

        key = $("#key");
        key.bind("focus", focusKey)
            .bind("blur", blurKey)
            .bind("propertychange", searchNode)
            .bind("input", searchNode);
    });

};

//获取选中的节点
prs.getTreeSelectedNodes = function (id) {
    var treeObj = $.fn.zTree.getZTreeObj(id);
    var nodes = treeObj.getCheckedNodes(true);//获取选中的节点
    return nodes;
};
//字符串下滑线转驼峰
prs.strTransform = function (str) {
    str = str.toLowerCase();
    var re = /_(\w)/g;
    str = str.replace(re, function ($0, $1) {
        return $1.toUpperCase();
    });
    return str;
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }
  prs.stringTrim = function(){
      $(document).on("blur","input[type=text]",function(){
          var val = $(this).val();
          $(this).val(val.trim())
      })
  };
  $(function () {
    prs.stringTrim();
  })
  //中文转字符计算字符的长度
  function getByteLen(val) {
    var len = 0
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i)
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 2
      } else {
        len += 1
      }
    }
    return len
  }


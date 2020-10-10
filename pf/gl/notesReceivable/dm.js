var dm = {
    getCtrl: function (tag) {
        var url = '';
        switch (tag) {
            //单位树
            case 'agency':
                url = '/gl/eleAgency/getAgencyTree';
                break;
            //账套
            case 'acct':
               // url = '/gl/eleCoacc/getCoCoaccs/';
               url = '/gl/eleCoacc/getRptAccts';//多区划
                break;
            //备查类型
            case 'receivableType':
                url = '/gl/CbBillBook/RECEIVABLE_TYPE';
                break;
            //付款单位、承兑单位、出票人、票据类型
            case 'billPerson':
                url = '/gl/elecommon/getEleCommonTree';
                break;
            //费用类型（票据类型）
            case 'billtype':
                url = '/gl/CbBillBook/select';
                break;
            //登记、背书
            case 'bookin':
                url = '/gl/CbBillBook/saveBillBook';
                break;
            //查询主表格数据
            case 'search':
                url = '/gl/CbBillBook/searchBillBooks';
                break;
            //点票据号数查询子表数据
            case 'searchDetail':
                url = '/gl/CbBillBook/selectBillBookAss';
                break;
            //子表修改查询子表当前行具体数据
            case 'searchRowDetail':
                url = '/gl/CbBillBook/selectAllBillBookAss';
                break;
            //子表删除当前行
            case 'deleteRowDetail':
                url = '/gl/CbBillBook/delBillBookAss/';
                break;
            //登记弹窗界面的背书信息删除
            case 'delBillBookEndor':
                url = '/gl/CbBillBook/delBillBookEndor/';
                break;
            default:
                break;
        }
        return url;
    },
    doGet: function (ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        ufma.get(this.getCtrl(ctrl), argu, _callback);
    },
    doPost: function (ctrl, argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        ufma.post(this.getCtrl(ctrl), argu, _callback);
    },
    //取表格数据
    loadGridData: function (argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        };
        ufma.post(this.getCtrl('search'), argu, _callback);
    },
    //点票据号数获取子表数据
    loadGridDataDetail: function (argu, _callback) {
        this.doGet("searchDetail", argu, _callback);
    },
    //子表修改查询子表当前行具体数据
    loadGridDataRowDetail: function (argu, _callback) {
        this.doGet("searchRowDetail", argu, _callback);
    },
    //子表删除当前行
    deleteRowDetail:function (argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        var url = this.getCtrl("deleteRowDetail") + argu.billbookAssGuid;
        ufma.get(url, "", _callback);
    },
     //登记弹窗界面的背书信息删除
    delBillBookEndor:function (argu, _callback) {
        argu = argu || {};
        _callback = _callback || function (result) {
        }
        var url = this.getCtrl("delBillBookEndor") + argu.endorGuid;
        ufma.get(url, "", _callback);
    },
    //备查类型
    cbbReterType: function (argu, _callback) {
        this.doGet('receivableType', argu, _callback);
    },
    radioLabelDPEType: function (_cnt) {
        $(_cnt).html('');
        this.doGet('dpetype', {}, function (result) {
            for (var i = 0; i < result.data.length; i++) {
                var item = result.data[i];
                $('<a name="apportionType" value="' + item.ENU_CODE + '" id="' + item.ENU_CODE + '" class="label label-radio ' + (i == 0 ? 'selected' : '') + '">' + item.ENU_NAME + '</a>').appendTo(_cnt);
            }
        });
    },
    //票据类型
    cbbBillType: function (argu, _callback) {
        argu.enabled = "-1";
        argu.table = "MA_ELE_BILLTYPE";
        this.doGet('billtype', argu, _callback);
    },
    //出票人
    cbbBillPerson: function (argu, _callback) {
        argu.enabled = "-1";
        argu.chrName = "";
        argu.contact = "";
        this.doGet('billPerson', argu, _callback);
    },
    //保存
    doSave: function (argu, _callback) {
        this.doPost('bookin', argu, _callback);
    },
    //付款单位
    payerAgency: function (argu, _callback) {
        argu.enabled = "-1";
        argu.chrName = "";
        argu.contact = "";
        this.doGet('billPerson', argu, _callback);
    },
    //承兑单位、付款单位、票据类型、出票人
    acceptAgency: function (argu, _callback) {
        argu.enabled = "-1";
        argu.chrName = "";
        argu.contact = "";
        this.doGet('billPerson', argu, _callback);
    }

}
$.fn.dataTable.ext.errMode = 'none';
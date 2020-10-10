$(function () {
    window._close = function (state, assetData) {
        if (window.closeOwner) {
            var data = {
                action: state,
                assetData : assetData
            };
            window.closeOwner(data);
        }
    }
    var page = function () {
        var depMethodData = []; //折旧方法
        var assetColunms = [[        //支持多表头
            { 
				type: 'indexcolumn', 
				field: 'ordSeq', 
				name: '序号', 
				width: 50, 
				headalign: 'center', 
				align: 'center' 
			},
			{
				type: 'input',
				field: 'assetCode',
				name: '资产编码',
				width: 180,
				headalign: 'center'
			},
			{
				type: 'input',
				field: 'assetName',
				name: '资产名称',
				width: 100,
				headalign: 'center'
			},
			{
				type: 'input',
				field: 'gbTypeName',
				name: '资产分类',
				width: 150,
				headalign: 'center'
			},
			{
				type: 'input',
				field: 'pinp',
				name: '品牌',
				width: 100,
				headalign: 'center'
			},
			{
				type: 'input',
				field: 'guigxh',
				name: '规格型号',
				width: 100,
				headalign: 'center'
			},
			{
				type: 'datepicker',
				field: 'qudrq',
				name: '取得日期',
				width: 100,
				headalign: 'center',
				align: 'center'
            },
            {
                type: 'input',
                field: 'qudfsName',
                name: '取得方式',
                width: 80,
                headalign: 'center'
            },
            {
                type: 'input',
                field: 'shul',
                name: '数量',
                width: 125,
                headalign: 'center'
            },
            {
                type: 'money',
                field: 'originvalue',
                name: '原值',
                width: 100,
                headalign: 'center',
                align: 'right',
                render: function (rowid, rowdata, data) {
                    if (!data || data == "0.00" || data == 0) {
                        return '';
                    }
                    return $.formatMoney(data, 2);
                }
            },
            {
                type: 'treecombox',
                field: 'depmethodCode',
                name: '折旧方法',
                width: 140,
                headalign: 'center',
                idField: 'depmethodCode',
                textField: 'depmethodName',
                data: depMethodData,
                onChange: function (e) {
                },
                beforeExpand: function (e) {
                },
                render: function (rowid, rowdata, data) {
                    return rowdata.depmethodName;
                }
            },
			{
				type: 'input',
				field: 'yujsynx',
				name: '预计使用年限',
				width: 125,
				headalign: 'center',
				align: 'right'
			}
        ]];

        return {
            //获取折旧方法要素
            getDepMethod: function () {
                var arg = {
					"eleCode": "DEPMETHOD"
				};
                ufma.ajaxDef('/fa/api/assetCommon/getDataByEleCode', 'get',arg, function (result) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = {};
                        var ele = "depmethod"
                        var code = ele + "Code";
                        var codeName = ele + "Name";
                        obj[code] = data[i].code;
                        obj[codeName] = data[i].name;
                        depMethodData.push(obj);
                    }
                });

            },
            //初始化单位未达项表格
            initTable: function (id, data, col) {
                $('#' + id).ufDatagrid({
                    data: data,
                    //idField: 'chrCode',
                    pId: 'pcode',
                    disabled: false,  //可选择
                    columns: col,
                    initComplete: function (options, data) {
                        $("#lateBoxmoneyoriginvalue").amtInput();
                    },
                    lock: { //行锁定
                        class: 'bgc-gray2',
                        filter: function (rowdata) {
                        }
                    }
                })
            },
            initPage: function () {
                var timeId = setTimeout(function () {
                    var centerH = $('.ufma-layout-up').outerHeight(true) - 100;
                    $('.workspace-center').css({ height: centerH + 'px', 'overflow': 'auto' });
                    $('#assetTable').css({ height: centerH - 50 + 'px'});
                    $('#assetTableBody').css({ height: centerH - 50 - 30 + 'px'});
                }, 200);
				page.getDepMethod();
                page.initTable('assetTable', window.ownerData.assetData, assetColunms);
            },
            onEventListener: function () {
                $('#btnCancle').click(function () {
                    _close('close');
                });
                $("#btnSave").on("click", function () {
                    var assetData = $("#assetTable").getObj().getData();
                    var result = $.equalsArray(assetData, window.ownerData.assetData);
                    if (result) {
                        _close("close", assetData);
                    } else {
                        _close("save", assetData);
                    }
                });
                $("#assetTable").click(function () {
                    $("#assetTable").find('input[name="assetCode"]').attr('disabled', true);
                    $("#assetTable").find('input[name="assetName"]').attr('disabled', true);
                    $("#assetTable").find('input[name="gbTypeName"]').attr('disabled', true);
                    $("#assetTable").find('input[name="pinp"]').attr('disabled', true);
                    $("#assetTable").find('input[name="guigxh"]').attr('disabled', true);
                    $("#assetTable").find('input[name="qudrq"]').attr('disabled', true);
                    $("#assetTable").find('input[name="qudfsName"]').attr('disabled', true);
                    $("#assetTable").find('input[name="shul"]').attr('disabled', true);
                    $("#assetTable").find('input[name="originvalue"]').attr('disabled', true);
                });
                // //隐藏菜单
				// $('#hide').on('click', function () {
				// 	$('#show').removeClass('hidden');
				// 	$(this).addClass('hidden');
				// 	$('#queryMore').addClass('hidden');
				// 	ufma.setBarPos($(window));
				// })
				// //显示菜单
				// $('#show').on('click', function () {
				// 	$('#hide').removeClass('hidden')
				// 	$(this).addClass('hidden')
				// 	$('#queryMore').removeClass('hidden')
				// 	ufma.setBarPos($(window));
				// })
            },
            // 此方法必须保留
            init: function () {
                reslist = ufma.getPermission();
                ufma.isShow(reslist);
                ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }
        ();
    page.init();
})
    ;

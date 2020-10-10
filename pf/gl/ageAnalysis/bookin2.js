$(function() {
    var oTable,columnBad,analyFlag;
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
    };
   	//百分比取值范围
	/*$(document).on("keyup",".form-control",function(){
	    var number=$(this).val();
	     //验证百分比是0-100之间
	    var re=/^(?:[1-9]?\d|100)$/;
	    if(re.test(number)){
	        $(this).val(number);
	       }else{
	        $(this).val('');
	        ufma.showTip('请输入0-100之间的数字！', function () {}, 'warning');
	    }
	      
	});*/
	var rowdataId, rowData;
	$(document).on("keyup", ".form-control", function(e) {
		var number = $(this).val();
		//验证百分比是0-100之间
		var re = /^(?:[1-9]?\d|100)$/;
		if(re.test(number)) {
			$(this).val(number);
			var rowid = $(e.target).attr('rowid');
			rowdataId = rowid;
			rowData = oTable.api(false).row(rowid).data();
			var curBal = rowData.curBal;
			var provisionAmt = curBal * number / 100;
			oTable.fnUpdate(provisionAmt, rowdataId, 3, 0, 0); //百分比变化时应收计提金额相应变化
		} else {
			$(this).val('');
			ufma.showTip('请输入0-100之间的数字！', function() {}, 'warning');
		}

	});
	var page = function() {
		return {
            //初始化table
            initGrid: function() {
                if(window.ownerData.analyFlag=="GB"){  //个别认定法     
                    columnBad = [
                        {
                            title: "往来单位",
                            data: 'provisionName',
                            className: 'nowrap'
                        },
                        {
                            title: "发生日期",
                            data: "bussDate",
                            width: 100,
                            className: 'nowrap'
                        },
                        {
                            title: "摘要",
                            data: 'descpt',
                            className: 'nowrap'
                        },
                        {
                            title: "票据号",
                            data: 'billNo',
                            className: 'nowrap'
                        },
                        {
                            title: "应收金额",
                            data: 'curAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "应收余额",
                            data: 'curBal',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "账龄",
                            data: 'aging',
                            className: 'nowrap'
                        },
                        {
                            title: "计提百分比(%)",
                            data: 'percent',
                            className: 'nowrap',
                           render: function(data, type, rowdata, meta) {//此处为获取行数据添加了rowid
								// return '<div class="td-content"  provisionAmt="'+rowdata.provisionAmt+'"  proName="'+rowdata.provisionCode+'"><input type="text" name="percent" class="form-control" value="'+rowdata.percent+'"/></div>'
								return '<div class="td-content" provisionAmt="' + rowdata.provisionAmt + '" proName="' + rowdata.provisionCode + '"value="0"><input type="text" name="percent" class="form-control" value="' + rowdata.percent + '"rowid="' + meta.row + '"/></div>'

							}
                        },
                        {
                            title: "应计提金额",
                            data: 'provisionAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "本年坏账准备余额",
                            data: 'curProAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "上年坏账准备余额",
                            data: 'preYearAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "补提/冲减金额",
                            data: 'subAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        }
                    ];
                }else if(window.ownerData.analyFlag=="ZL"){ //账龄分析法
                    columnBad = [
                        {
                            title: "账龄区间",
                            data: 'provisionName',
                            className: 'nowrap'
                        },
                        {
                            title: "应收款余额",
                            data: 'curBal',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "计提百分比(%)",
                            data: 'percent',
                            className: 'nowrap',
                            render: function(data, type, rowdata, meta) {//此处为获取行数据添加了rowid
								// return '<div class="td-content"  provisionAmt="'+rowdata.provisionAmt+'"  proName="'+rowdata.provisionCode+'"><input type="text" name="percent" class="form-control" value="'+rowdata.percent+'"/></div>'
								return '<div class="td-content" provisionAmt="' + rowdata.provisionAmt + '" proName="' + rowdata.provisionCode + '"value="0"><input type="text" name="percent" class="form-control" value="' + rowdata.percent + '"rowid="' + meta.row + '"/></div>'

							}
                        },
                        {
                            title: "应计提金额",
                            data: 'provisionAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "坏账准备上年余额",
                            data: 'preYearAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        },
                        {
                            title: "补提/冲减金额",
                            data: 'subAmt',
                            className: 'tr nowrap',
                            render: function(data, type, rowdata, meta) {
                                var val = $.formatMoney(data);
                                return val == '0.00' ? '' : val;
                            }
                        }              
                    ];  
                }  

                if(oTable){
                    $('#badZhang').closest('.dataTables_wrapper').ufScrollBar('destroy');
                    oTable.fnDestroy();
                    $("#badZhang").html('');
                }
                oTable = $("#badZhang").dataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "autoWidth": false,
                    "bDestory": true,
                    "processing": true, //显示正在加载中
                    "serverSide": false,
                    "ordering": false,
                    columns: columnBad,
                    data: [],
                    "dom": 'rt',
                    initComplete:function(){
                    	
                    },
                    "drawCallback":function(){
						$('#badZhang').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                       
                        $('#badZhang').closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                    }
				
                });

                //调取后台数据开始------------------
                var agencyCode=window.ownerData.agencyCode;
                var anysDate=window.ownerData.anysDate;
                var agingSet=window.ownerData.agingSet;
                var acctCode=window.ownerData.acctCode;
                var analyFlag=window.ownerData.analyFlag;
                var atype = window.ownerData.atype;
                var url='';
                if(analyFlag=="ZL"){
                    //账龄分析法
                   // url='/gl/current/aging/getAgingProvision';//点击提取坏账准备按钮时，传入参数增加atype区分往来类型,将原来的url拆开写--zsj--bug74702
                   url='/gl/current/aging/getAgingProvision'+'/'+agencyCode+'/'+acctCode+'/'+anysDate+'/'+agingSet;
                }else if(analyFlag=="GB"){
                    //个别认定法
                    //url='/gl/current/aging/getSingleProvision';//点击提取坏账准备按钮时，传入参数增加atype区分往来类型--zsj--bug74702
                    url='/gl/current/aging/getSingleProvision'+'/'+agencyCode+'/'+acctCode+'/'+anysDate+'/'+agingSet+'/'+atype;
                }
                ufma.get(url, {}, function (result) {//点击提取坏账准备按钮时，传入参数增加atype区分往来类型--zsj--bug74702
                //ufma.get(url+'/'+agencyCode+'/'+acctCode+'/'+anysDate+'/'+agingSet, {}, function (result) {
                    argu=result.data
                    oTable.fnClearTable();
                    if(argu.length!=0){
                        oTable.fnAddData(argu, true);
                    }else{
                        ufma.showTip('数据不存在！', function () {}, 'warning');
                    }
                })
            },

            //获取datables数据
            getTableContent: function(){  
                ptData = ufma.getCommonData();
                if(window.ownerData.analyFlag=="GB"){  //个别认定法 
                    var datas={
                        "setYear":ptData.svSetYear,
                        "provisionType":3,
                        "agencyCode": window.ownerData.agencyCode,//单位
						"acctCode": window.ownerData.acctCode,//账套
                        "list":[]
                    };

                   $.each($(".td-content"),function(){ 
                        var obj={
                            "provisionCode":$(this).attr("proName"),
                            "percent":$(this).find("input").val(),
                           //"provisionAmt": $(this).attr("provisionAmt")
							"provisionAmt":  $(this).closest("tr").find("td").eq(3).text() //获取当前页面表格对应的单元格值
                        } 
                        datas.list.push(obj);
                    })
                    return datas;

                }else if(window.ownerData.analyFlag=="ZL"){ //账龄分析法
                    var datas={
                        "setYear":ptData.svSetYear,
                        "provisionType":1,
                        "agencyCode": window.ownerData.agencyCode,//单位
						"acctCode": window.ownerData.acctCode,//账套
                        "list":[]
                    };
                    $.each($(".td-content"),function(){ 
                        var obj={
                            "provisionCode":$(this).attr("proName"),
                            "percent":$(this).find("input").val(),
                            //"provisionAmt": $(this).attr("provisionAmt")
							"provisionAmt":  $(this).closest("tr").find("td").eq(3).text() //获取当前页面表格对应的单元格值
                        } 
                        datas.list.push(obj);
                    })

                    return datas;
                }
 
            },
			onEventListener: function() {

                $('#coaAccSave').click(function() {
                	var glCurProvisionBean=page.getTableContent();
					ufma.post('/gl/current/aging/buildVou', glCurProvisionBean, function (result) {
                        flag=result.flag;
                        if(flag=="fail"){
                            ufma.showTip('生成凭证失败！', function () {}, 'warning');
                        }else if(flag=="success"){
                            ufma.showTip('生成凭证成功！', function () {}, 'success');
                        }
                    })
                });
                
				$('#btnClose').click(function() {
					_close();
				});
				$('#btnSave').click(function() { 
                    var glCurProvisionBean=page.getTableContent();

                    ufma.post('/gl/current/aging/saveVouMuti',glCurProvisionBean, function (result) {
                        flag=result.flag;
                        if(flag=="fail"){
                            ufma.showTip('保存失败！', function () {}, 'warning');
                        }else if(flag=="success"){
                            ufma.showTip('保存成功！', function () { _close();}, 'success');
                        }
                    })
				});
			},

			init: function() {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
				$('#ageName').text('计提方法：'+window.ownerData.ageName);
                this.onEventListener();
                page.initGrid();
				uf.parse();
                ufma.parse();
                analyFlag=window.ownerData.analyFlag;
                
			}
		}
	}();

	page.init();
});



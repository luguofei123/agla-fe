$(function() {
    window._close = function(action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
	};
    var agencyCode = window.ownerData.agencyCode,
    setYear = window.ownerData.setYear,
    rgCode = window.ownerData.rgCode,
    acctCode = window.ownerData.acctCode;
    var page = function() {
        return {
            empList: [],
            deptList: [],
            rightTreeList: [],
            deptMap:[],
            queryRightData: function(callback){
                ufma.ajax(
                    '/ma/sys/department/getDepTree', 
                    'get', 
                    {
                        "agencyCode": agencyCode,
                        "setYear": setYear,
                        "acctCode": acctCode?acctCode:'*'
                    },
                    function(result){
                        if(result.flag != 'fail'){
                            page.rightTreeList = result.data;
                            if(typeof(callback)==='function'){
                                callback();
                            }
                        }
                    }
                )
            },
            initTable: function(){
                var columns = [
                {
                    title: "人员库部门",
                    data: "codeName",
                    className: 'tc nowrap',
                    render: function (data, type, rowdata, meta) {
                        return data ? data : '';
                    }
                },
                {
                    title: "公共要素部门",
                    data: null,
                    className: 'tc nowrap',
                    render: function (data, type, rowdata, meta) {
                        return '<div id="rightTreeCombox_'+meta.row+'" data-orgcode="'+rowdata.code+'" class="uf-combox"></div>';
                    }
                }];

                function initCombox(){
                    $('#syncEmpTable .uf-combox').each(function (i) {
                        $(this).ufTreecombox({
                            idField: "code",
                            textField: "codeName",
                            data: page.rightTreeList, //json 数据 
                            placeholder:"请选择公共要素部门",
                            onChange: function (sender, data) {
                               var obj = {prsOrgCode:sender[0].dataset.orgcode,deptCode:data.code};
                               var flag = false;
                               page.deptMap.forEach(function(item){
                                   if(item.prsOrgCode===sender[0].dataset.orgcode){
                                       flag = true;
                                       item.deptCode = data.code;
                                   }
                               })
                               if(!flag){
                                    page.deptMap.push(obj);
                               }
                            }
                        })
                    })
                }
                page.table = $('#syncEmpTable').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					"searching": false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
                    "columns": columns,
                    "data": [],
                    "initComplete": function (settings, json) {
                    },
                    "drawCallback": function (settings) {
                        if(page.rightTreeList&&page.rightTreeList.length>0){
                            initCombox()
                        
                            $('.uf-combox').each(function(i){
                                $('#rightTreeCombox_'+i).on('click', 'span.icon-close', function() { //辅助核算项点击“×”时对应 的辅助核算项消失
                                    page.deptMap.forEach(function(item){
                                        if(item.prsOrgCode===$('#rightTreeCombox_'+i).attr('data-orgcode')){
                                            item.deptCode = '';
                                        }
                                    })
                                });
                            })
                        }else{
                            page.queryRightData(function(){
                                initCombox()
                        
                                $('.uf-combox').each(function(i){
                                    $('#rightTreeCombox_'+i).on('click', 'span.icon-close', function() { //辅助核算项点击“×”时对应 的辅助核算项消失
                                        page.deptMap.forEach(function(item){
                                            if(item.prsOrgCode===$('#rightTreeCombox_'+i).attr('data-orgcode')){
                                                item.deptCode = '';
                                            }
                                        })
                                    });
                                })
                            })
                        }
                    }
                });
            },
            updateTable: function (data, cb) {
				if (data) {
					if (data.length > 0) {
						page.table.fnClearTable();
						page.table.fnAddData(data, true);
						if (typeof (cb) === 'function') {
							cb();
						}

					}
				}
			},
            initPage: function(){
                page.initTable();
            },
            onEventListener: function(){
                $('.btn-sync-emp').on('click',function(){
                    ufma.ajax(
                        '/ma/sys/department/syncDeptEmpfromPrs', 
                        'POST', 
                        {
                            rgCode: rgCode,
                            agencyCode: agencyCode,
                            acctCode: acctCode,
                            setYear: setYear,
                            empList: page.empList,
                            deptMap: page.deptMap
                        },
                        function(result){
                            if(result.flag != 'fail'){
                                ufma.showTip(result.msg,function(){},result.flag)
                                _close({flag: result.flag,msg:result.msg})
                            }else{
                                if(result.flag){
                                    ufma.showTip(result.msg,function(){},result.flag)
                                }else{
                                    ufma.showTip('同步成功',function(){},'success')
                                }
                            }
                        }
                    )
                })
            },
            init: function(){
                page.queryRightData();
                atreeObj.initAtree(null,function(empList, deptList){
                    // console.log(empList, deptList)
                    page.empList = empList;
                    page.deptList = deptList;
                    page.deptMap = [];
                    deptList.forEach(function(item){
                        var obj = {
                            prsOrgCode: item.code,
                            deptCode: ''
                        }
                        page.deptMap.push(obj);
                    })
                    page.updateTable(page.deptList);
                })
                this.initPage();
				this.onEventListener();

				var timeId = setTimeout(function () {
					//左侧树高度
					var h = $(window).height()-20;
					$(".rpt-acc-box-left").height(h);
					var H = $(".rpt-acc-box-right").height();
					if (H > h) {
						$(".rpt-acc-box-left").height(h + 48);
						if ($("#tool-bar .slider").length > 0) {
							$(".rpt-acc-box-left").height(h + 52);
						}
					}
					$(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 76);
					clearTimeout(timeId);
				}, 200);
            }
        }
    }()
    page.init();
})
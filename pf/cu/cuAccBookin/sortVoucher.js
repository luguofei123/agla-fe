$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	var istableSort = false
	var page = function() {
		var pfData = ufma.getCommonData();
		var agencyCode = window.ownerData.agencyCode,
			setYear = window.ownerData.setYear
		var ctrls = {
			'querySortVoucher': '/cu/journal/getResetDataByParams',
			'saveSortVous': '/cu/journal/updateJouNoForCujournals'
		}
		var accountbookGuid;
		var numType;
		var isSameNo;
		function intToVouNo(i) {
			var jouNo = i + 1;
			if(jouNo < 10) {
				jouNo = '000' + jouNo;
			} else if(jouNo < 100) {
				jouNo = '00' + jouNo;
			} else if(jouNo < 1000) {
				jouNo = '0' + jouNo
			}
			return jouNo;

		}
		var loadParams;
		return {
			initPeriod: function(numType) {
				if(numType == "1") { //按日
					$('#startJouDate').ufDatepicker({
						format: 'yyyy-mm-dd',
						initialDate: new Date(),
					}).on('change', function() {
						page.loadSortVoucher(numType);	
					});
				} else {
					$('#sortPeriod').ufDatepicker({
						format: 'yyyy-mm',
						viewMode: 'month',
						initialDate: window.ownerData.setYear + '-' + window.ownerData.fisPerd,
					}).on('change', function() {
						page.loadSortVoucher( numType);	
					});
				}
			},
			loadSortVoucher: function(numType) {
				var argu = $('#frmQuery').serializeObject();
				var queryParams = {
					"agencyCode": agencyCode,
					"setYear": parseInt(setYear),
					"rgCode"  : window.ownerData.rgCode
				}
				argu = $.extend(argu, queryParams);
				if(numType == "1"){
					delete argu.startFisPerd;
					argu.startJouDate = $("#startJouDate").getObj().getValue();
					argu.endJouDate = $("#startJouDate").getObj().getValue();
				}else{
					delete argu.startJouDate;
					argu.startFisPerd = $("#sortPeriod").getObj().getValue().substring(5,7);
					argu.endFisPerd = $("#sortPeriod").getObj().getValue().substring(5,7);
				}
				if(isSameNo){
					delete argu.accountbookGuid;
				}
				var callback = function(result) {
					$('#sortGrid tbody').html('');
					var len = result.data.length;
					var rowHtml = ''
					rowHtml = '<tr><td class="<%=sortColor%> sorttd" title="<%=newJouNo%>"><input class="<%=sortColor%> nobor" type="text" value="<%=newJouNo%>"></td>' +
						'<td title="<%=jouNo%>"><%=jouNo%></td><td title="<%=accountbookName%>"><%=accountbookName%></td><td title="<%=accountbookTypeName%>"><%=accountbookTypeName%></td>' +
						'<td title="<%=jouDate%>"><%=jouDate%></td><td title="<%=summary%>"><%=summary%></td>'+
						'<td class="tr"  title="<%=drMoney%>"><%=drMoney%></td><td class="tr"  title="<%=crMoney%>"><%=crMoney%></td>' +
						'<td title="<%=vouTypeNameNo%>"><%=vouTypeNameNo%></td><td title="<%=createUser%>"><%=createUser%></td><td title="<%=recordTypeName%>"><%=recordTypeName%></td>' +
						'<td><a class="btn-label btn-Drag" data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a></td></tr>';

					for(var i = 0; i < len; i++) {
						var vou = result.data[i];
						vou.newJouNo = intToVouNo(i);
						vou.sortColor = '';
						if(vou.newJouNo != vou.jouNo) {
							vou.sortColor = 'uf-red';
						}
						vou.drMoney = $.formatMoney(vou.drMoney, 2);
						vou.crMoney = $.formatMoney(vou.crMoney, 2);
						var tr = $($.htmFormat(rowHtml, vou)).appendTo('#sortGrid tbody');
						$.data(tr[0], 'rowData', vou);
					}
					for(var i = 0; i < $('#sortGrid tr').length; i++) {
						$('#sortGrid tr').eq(i).find('td:last-child').addClass('text-center')
						$('#sortGrid tr').eq(i).find('td:last-child').find('a').css({'color':'#333'})
					}
					
					$('#sortGrid .btn-Drag').on('mousedown', function(e) {
						var callback = function() {
							var idx = 0;
							var ids = []
							$('#sortGrid tbody tr').each(function() {
								if(!$(this).hasClass('hide')) {
									idx = idx + 1;
									$(this).find('span.recno').html(idx);
									var idxs = {}
									idxs[$(this).attr('id')] = idx
									ids.push(idxs)
								}
							});
						};
						$('#sortGrid').tableSort(callback);
						istableSort = true
					});
					$('#sortGrid').on('mouseup', function(e) {
						if(istableSort){
							$('#sortGrid tbody tr').each(function(irow) {
								var vou = $.data(this, 'rowData');
								vou.newJouNo = intToVouNo(irow);
								var dataclas = vou.newJouNo != vou.JouNo ? 'uf-red' : ''
								$(this).find('td:eq(0)').find('input').addClass(dataclas).val(vou.newJouNo);
								//$.data(this,'rowData',vou);
							});
							istableSort = false
						}
					});
				}
				ufma.get(ctrls.querySortVoucher, argu, callback);
			},
			saveSortNo: function () {
				var sortVou = [];
				$('#sortGrid tbody tr').each(function (irow) {
					var vou = $.data(this, 'rowData');
					sortVou.push({
						'newJouNo': $('#sortGrid tbody tr').eq(irow).find('.nobor').val(),
						'accountbookGuid' :vou.accountbookGuid,
						'jouGuid':vou.jouGuid,
						'jouNo':vou.jouNo
					});
				});
				if (sortVou.length > 0) {
					ufma.confirm('编号重排后将无法还原，您确定要执行当前操作吗？', function (action) {
						if (action) {
							ufma.post(ctrls.saveSortVous, sortVou, function (result) {
								ufma.showTip(result.msg, function () { 
									if(result.flag == "success"){
										_close(true);
									}
								}, "success");
							});
						}
					}, {
						type: 'warning',
						okText: '确定',
						cancelText: '取消'
					})

				} else {
					ufma.showTip('编号没有变化！', function () { }, "warning");
				}
			},
			 //账簿
			 reqAccountBook: function() {
				var url = dm.getCtrl("accBook");
				callback = function(result) {
				  $("#accountbookCode").ufTreecombox({
					idField: "ID",
					textField: "accountbookName",
					pIdField: "PID", //可选
					leafRequire: true,
					readonly: false,
					data: result.data,
					onComplete: function(sender) {
						if (window.ownerData.accountbookGuid) {
							$("#accountbookCode").getObj().val(window.ownerData.accountbookGuid);
						}
					},
					onChange: function(sender, data) {
						if (data.numType == "2") {//按月编号
							$("#reFisPerd").show();
							$("#reDate").hide();
						} else {
							$("#reFisPerd").hide();
							$("#reDate").show();
						}
						accountbookGuid = data.ID;
						numType = data.numType;
						page.initPeriod(numType);
						if ($('.label-radio[name="recordType"].selected').attr('value') == "0") { //期初
							if (numType == "1") { //按日
								$('#startJouDate').getObj().setValue(new Date(window.ownerData.setYear, 0, 1));
								$('#startJouDate').disable();
							} else {
								$('#sortPeriod').getObj().setValue(window.ownerData.setYear + '-01');
								$('#sortPeriod').disable();
							}
						} else {
							if (numType == "1") { //按日
								$('#startJouDate').getObj().setValue(new Date(window.ownerData.nowDate));
								$('#startJouDate').enable();
							} else {
								$('#sortPeriod').getObj().setValue(window.ownerData.setYear + '-0' + window.ownerData.fisPerd);
								$('#sortPeriod').enable();
							}
						}
						page.loadSortVoucher(numType);	
					}
				  });
				};
				ufma.ajaxDef( url,  "get", {agencyCode: window.ownerData.agencyCode}, callback);
			  },
			//请求系统选项 出纳是否统一编号 guohx 
			reqSysItem: function () {
				ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU001" + "/" + agencyCode, {}, function (result) {
					isSameNo = result.data;
					//所有账簿统一编号
					if (isSameNo) {
						$("#allAccount").show();
						$("#singleAccount").hide();
						$("#reFisPerd").show();
						$("#reDate").hide();
						$("#accountLable").css("width","80px")
						page.initPeriod(2);
						page.loadSortVoucher(2);
						numType = "0";
					} else {
						$("#singleAccount").show();
						$("#allAccount").hide();
						page.reqAccountBook();
					}
				})
			},
			onEventListener: function() {
				$(document).on('click', '.label-radio', function () {
					if ($('.label-radio[name="recordType"].selected').attr('value') == "0") { //期初
						if (numType == "1") { //按日
							$('#startJouDate').getObj().setValue(new Date(window.ownerData.setYear, 0, 1));
							$('#startJouDate').disable();
						} else {
							$('#sortPeriod').getObj().setValue(window.ownerData.setYear + '-01');
							$('#sortPeriod').disable();
						}
					} else {
						if (numType == "1") { //按日
							$('#startJouDate').getObj().setValue(new Date(window.ownerData.nowDate));
							$('#startJouDate').enable();
						} else {
							$('#sortPeriod').getObj().setValue(window.ownerData.setYear + '-0' + window.ownerData.fisPerd);
							$('#sortPeriod').enable();
						}
					}
					page.loadSortVoucher( numType);
				});
				$(document).on("input propertychange", ".nobor", function () {
					var $this = $(this)
					if ($this.val().length > 4) {
						$this.val($this.val().substring(0, 4));
					}
				});
				$(document).on("keyup", ".nobor", function(e) {
					var $this = $(this)
					if(/[^\d]/.test($this.val())) { //替换非数字字符  
						var temp_amount = $this.val().replace(/[^\d]/g, '');
						$this.val(temp_amount);
					}
				})
				$(document).on("blur", ".nobor", function() {
					var $this = $(this)
					if(!isNaN(parseFloat($this.val()))){
						if($this.val().length == 1) {
							$this.val('000'+$this.val())
						} else if($this.val().length == 2) {
							$this.val('00'+$this.val())
						} else if($this.val().length == 3) {
							$this.val('0'+$this.val())
						}
					}else{
						$this.val(9999)
					}
					$this.parents('td').attr('title',$this.val())
					if($this.val() == $this.parents('td').next('td').html()){
						$(this).removeClass('uf-red')
						$(this).parents('td').removeClass('uf-red')
					}else{
						$(this).addClass('uf-red')
						$(this).parents('td').addClass('uf-red')
					}
				});
				$('.btn-close').click(function() {
					_close(false);
				});
				$('.btn-save').click(function() {
					page.saveSortNo();
				});

			},

			init: function() {
				//获取session
				page.reqSysItem();
				ufma.parse();
				page.onEventListener();
			}
		}
	}();

	page.init();
});
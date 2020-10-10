$(function(){

    var page = function(){	
        return{
			sysData:{},
			qrySysBaseInfo:function(status){
				//var status = $('.label-radio[name="status"].selected').attr('value');
				var url = '/ma/pub/newSetInit/getSysEles/'+status;
				var argu = {};
				var callback = function(result){
					
					var $tbl = $('#tblTransNewYearBase').html('');
					$tbl.html('');
					$.each(result.data,function(idx,row){
						page.sysData[row.eleCode] = row;
						var tr = '<tr id="'+row.eleCode+'">'
							+'<td style="width:30px;padding-left:10px;"><label class="mt-checkbox mt-checkbox-outline margin-right-8">						<input type="checkbox" name="transitem" value="'+row.eleCode+'">&nbsp;<span></span></label></td>'
							+'<td>'+row.eleName+'</td>'
							+'<td>'+ufma.decode(row.isGen,'Y','已生成','未生成')+'</td>'
							+'<td>'+ufma.decode(row.hasData,'Y','是','否')+'</td>'
							+'<td><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-sm btn-default '+ufma.decode(row.optType,'cover','active','add','','active')+'"><input type="radio" class="toggle" name="transType" value="cover" '+ufma.decode(row.optType,'cover','checked','add','','checked')+'> 覆盖 </label><label class="btn btn-sm btn-default" '+ufma.decode(row.optType,'add','active','')+'><input type="radio" class="toggle" name="transType" value="add" '+ufma.decode(row.optType,'add','checked','')+'> 追加 </label></div></td>'											
							+'<td><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-sm btn-default '+ufma.decode(row.issuedSimTime,'Y','active','N','','active')+'"><input type="radio" class="toggle" name="downType" value="Y" '+ufma.decode(row.issuedSimTime,'Y','checked','N','','checked')+'> 是 </label><label class="btn btn-sm btn-default" '+ufma.decode(row.issuedSimTime,'N','active','')+'><input type="radio" class="toggle" name="downType" value="N" '+ufma.decode(row.issuedSimTime,'N','checked','')+'> 否 </label></div></td>'							
							+'<td align="center"><span class="btnTrans icon icon-file" title="生成" ></span></td>'
							+'</tr>';
						var $tr = $(tr).appendTo($tbl);
						
					});
					ufma.hideloading();
										//顶部浮动
					$('#tblTransNewYear thead').ufFixedShow({
						position: 'top',
						zIndex: 1001, //Z轴
						offset: 0 //偏移
					});
				}
				ufma.showloading('正在请求数据，请耐心等待...');
				ufma.get(url,argu,callback);
			},
			transSysBaseInfo:function(data){
				if(data.length == 0){
					ufma.alert('请选择基础资料！');
					return false;
				}
				ufma.showloading('正在生成新年度数据，请耐心等待！');
				var url = '/ma/pub/newSetInit/doInit';//生成基础资料接口
				var argu=data;
				var callback = function(result){
					ufma.showTip(result.msg,function(){},'success');
					ufma.hideloading();
					var status = $('.label-radio[name="status"].selected').attr('value');
					page.qrySysBaseInfo(status);
					
				};
				ufma.post(url,argu,callback);
			},
            initPage:function(){
				page.qrySysBaseInfo('all');
            },	
			
            onEventListener:function(){

				$('.datatable-group-checkable').click(function(e){
					e.stopPropagation();
					var bChecked = $(this).prop("checked");
					$('input[name=transitem]').prop("checked",bChecked);	
				});
				$('input[name="radioAll"]').change(function(){
					var radioVal = $(this).val();
					$('.radioItem[value="'+radioVal+'"]').prop("checked",true);
				});
				
				$('#tblTransNewYearBase').on('click','.btnTrans',function(e){
					e.stopPropagation();
					var trid = $(this).closest('tr').attr('id');
					var rowData = page.sysData[trid];
					rowData['optType'] = $('#'+trid+' .active input[name="transType"]').val();
					rowData['issuedSimTime'] = $('#'+trid+' .active input[name="downType"]').val();
					page.transSysBaseInfo([rowData]);
				});
				$('#btn-transSys').click(function(){
					var data = [];
					$('#tblTransNewYearBase input[name="transitem"]:checked').each(function(){
						var trid = $(this).closest('tr').attr('id');
						var rowData = page.sysData[trid];
						rowData['optType'] = $('#'+trid+' .active input[name="transType"]').val();
						rowData['issuedSimTime'] = $('#'+trid+' .active input[name="downType"]').val();
						data.push(rowData);
					});
					page.transSysBaseInfo(data);
				});
				
				$('#TriggerDataDown').click(function(){
					var val = $(this).attr('value');
					val = val=='Y'?'N':'Y';

					$(this).attr('value',val);
					$('input[name="downType"]').closest('.active').removeClass('active');
					var $radio = $('input[name="downType"][value="'+val+'"]');
					$radio.closest('.btn').addClass('active');
					$radio.prop('checked','checked');
				});
				$('#TriggerDataType').click(function(){
					var val = $(this).attr('value');
					val = val=='cover'?'add':'cover';

					$(this).attr('value',val);
					$('input[name="transType"]').closest('.active').removeClass('active');
					var $radio = $('input[name="transType"][value="'+val+'"]');
					$radio.closest('.btn').addClass('active');
					$radio.prop('checked','checked');
				});	
				$('.label-radio').click(function(){
					page.qrySysBaseInfo($(this).attr('value'));
				});
            },
            //此方法必须保留
            init:function(){
                ufma.parse();
                this.initPage();
				this.onEventListener();
				ufma.parseScroll();
            }
        }
    }();
/////////////////////
    page.init();
});			
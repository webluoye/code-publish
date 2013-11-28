define(function(require, exports, module){
    var $ = require('jquery');
	var std = require('std');
	var main = std.cacheMain();//主框架缓存变量
    var createser = '<ul class="breadcrumb"><li><a href="/servers">服务器管理</a><span class="divider">/</span></li><li class="active">创建服务器</li></ul><form class="form-stacked" id="serform"><fieldset><div class="clearfix"><label for="spath">Host地址*</label><div class="input"><input type="text" id="spath" class="span8" size="256" name="spath" /><span class="help-block">比如：192.168.1.253</span></div></div><div class="clearfix"><label for="suser">用户名*</label><div class="input"><input type="text" class="span3" id="suser" name="suser" /></div></div><div class="clearfix"><label for="spass">密码*</label><div class="input"><input type="password" id="spass" name="spass" /></div></div><div class="clearfix"><label for="vpnpro">vpn网关</label><div class="input"><select name="vpnpro" class="mini"><option value="1">PPTP</option></select>&nbsp;<input type="text" placeholder="192.168.1.253" id="svpn" class="span5" size="256" name="svpn" /></div></div><div class="clearfix"><label for="vpnname">vpn帐号</label><div class="input"><input type="text" id="vpnname" name="vpnname" /></div></div><div class="clearfix"><label for="vpnpass">vpn密码</label><div class="input"><input type="password" id="vpnpass" name="vpnpass" /></div></div></fieldset><div class="actions"><button class="btn primary" id="sersubmit">提交</button>&nbsp;<button class="btn" id="cancel">取消</button></div></form>';
    var createser_ = '<ul class="breadcrumb"><li><a href="/servers">服务器管理</a><span class="divider">/</span></li><li class="active">创建服务器</li></ul><form class="form-stacked" id="serform"><fieldset><div class="clearfix"><label for="pid">所属项目*</label><div class="input"><select name="pid" id="pid"><option value="">请选择</option></select></div></div><div class="clearfix"><label for="sname">名称*</label><div class="input"><input type="text" id="sname" class="xlarge" size="30" name="sname" /></div></div><div class="clearfix"><label for="pdir">生产地址*</label><div class="input"><input type="text" id="pdir" class="span8" size="256" name="pdir" /><span class="help-block">比如：/data/wwwV2/</span></div></div><div class="clearfix"><label for="pdir">备份地址*</label><div class="input"><input type="text" id="bdir" class="span8" size="256" name="bdir" /><span class="help-block">比如：/data/release/</span></div></div><div class="clearfix"><label for="spath">Host地址*</label><div class="input"><input type="text" id="spath" class="span8" size="256" name="spath" /><span class="help-block">比如：192.168.1.253</span></div></div><div class="clearfix"><label for="suser">用户名*</label><div class="input"><input type="text" class="span3" id="suser" name="suser" /></div></div><div class="clearfix"><label for="spass">密码*</label><div class="input"><input type="password" id="spass" name="spass" /></div></div><div class="clearfix"><label for="vpnpro">vpn网关</label><div class="input"><select name="vpnpro" class="mini"><option value="1">PPTP</option></select>&nbsp;<input type="text" placeholder="192.168.1.253" id="svpn" class="span5" size="256" name="svpn" /></div></div><div class="clearfix"><label for="vpnname">vpn帐号</label><div class="input"><input type="text" id="vpnname" name="vpnname" /></div></div><div class="clearfix"><label for="vpnpass">vpn密码</label><div class="input"><input type="password" id="vpnpass" name="vpnpass" /></div></div></fieldset><div class="actions"><button class="btn primary" id="sersubmit">提交</button>&nbsp;<button class="btn" id="cancel">取消</button></div></form>';
	var history = '<tr><td colspan="6"><div class="alert-message info"><a class="close hislist" href="javascript:void(0)">X</a><p><strong>历史记录</strong></p></div><table class="bordered-table zebra-striped"><thead><tr><th>#</th><th>版本号</th><th>发布时间</th></tr></thead><tbody></tbody></table><div class="pagination"><ul></ul></div><input type="hidden" />';

	exports.init = function(){
		//显示创建表单
        $('#createser').live('click', function(){
			$('#main').hide().fadeIn('slow').html(createser);
		});
		//点击取消按钮
		$('#cancel').live('click', function(){var cancel = std.cancel('main', main);return false;});
		//提交创建表单
		$('#serform').live('submit', function(){
			std.active('sersubmit');
			var postData ={};
			postData.spath = $('#spath').val();
			postData.suser = $('#suser').val();
			postData.spass = $('#spass').val();
			if(std.validAllNotEmpty(postData) == false)
			{
				std.alertErrorBox('serform', '带*号不能为空');
				std.resetActive('sersubmit');
				return false;
			}

			postData.svpn = $('#svpn').val();
			postData.svpnname = $('#vpnname').val();
			postData.svpnpass = $('#vpnpass').val();
			postData.action = 'createServer';

			std.getJson('post',ajaxurl, postData, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('serform', data['msg']);
					std.resetActive('sersubmit');
					return false;
				}
				else
				{
					location.href = baseUrl+'?page=publishcode';
					return false;
				}
			});

			return false;
		});

		//设置服务器列表信息为可编辑
		$('span[id^="ser"]').live('dblclick', function(){
			var val = $(this).text();
			var id = $(this).attr('id');
			id.indexOf('pass') != -1 ? val = '' : '';
			$(this).html('<input type="text" value="' + val + '" id="edit_' + id + '" />');
			$('#edit_' + id).focus();
		});

		//保存服务器列表编辑项
		$('input[id^="edit_"]').live('blur', function(){
			var val = $(this).val();
			var id = $(this).attr('id');
			if(!val && id.indexOf('vpn') == -1){
				std.alertErrorBox('slist', '该值不能为空');
				return false;
			}

			var p = id.split('_');
			std.getJson('post',ajaxurl, {name: p[2], id: p[3], val: val, action:'updateServer'}, function(data){
				if(!data['res'])
					std.alertErrorBox('slist', data['msg']);
				else
					id.indexOf("pass") != -1 ? $('#'+id).parent().html('双击修改密码') : $('#'+id).parent().html(val);
			});
		});

		//服务器列表状态修改函数
		function changeStatus(obj, status){
			var id = $(obj).attr('id');
			std.active(id);
			var checkboxs = $('input[name="scheck"]:checked');
			if(!checkboxs.length)
			{
				std.alertErrorBox('slist', '请至少选择一项');
				std.resetActive(id);
				return false;
			}

			var sValues = new Array();
			checkboxs.each(function(){sValues.push($(this).val());});
			std.getJson('post', ajaxurl, {checkboxs: sValues.join('|'), status: status,action:'changeServer'}, function(data){
				if(!data['res'])
				{
					std.alertErrorBox('slist', data['msg']);
					std.resetActive(id);
				}
				else
					location.href = baseUrl+'?page=publishcode';
			});
		};

		//服务器状态开启关闭操作
		$('#sopen').live('click', function(){changeStatus(this, 1)});
		$('#sclose').live('click', function(){changeStatus(this, 2)});

		//发布历史记录查看
		$('a[id^="history_"]').live('click', function(){
			var id = $(this).attr('id');
			var serId = id.split('_')[1];
			if($('#hislist_' + serId).length)
				return false;

			$(this).parents('tr').after(history);
			$(this).parents('tr').next().find('a').attr('id', 'hislist_' + serId);
			$(this).parents('tr').next().find('input').val(serId);
			$(this).parents('tr').next().find('.pagination').attr('id', 'pagebar_' + serId);

			showHistoryList(serId);
		});

		function showHistoryList(serId, page)
		{
            page = !page ? 1 : page;
			$.getJSON('/servers/history/' + serId + '/' + page, function(data){
				if(data['res'] == 1)
				{
					var ctx = '';
					for(var i = 0, j = data['list'].length; i < j; i++)
					{
						ctx += '<tr><td>' + data['list'][i].h_id + '</td><td>' + data['list'][i].r_no + '</td><td>' + std.getLocalTime(data['list'][i].r_dateline) + '</td></tr>';
					}

					var pageRange = std.setPage((!page ? 1 : page), data['maxPage'], 2);
					var pl = '<li class="prev ' + (page == 1 ? 'disabled' : '') + '" id="pagepre"><a href="javascript:;" id="s_page_prev">&larr; Previous</a></li>';
					if(pageRange[1] - data['maxPage'] >= 0 && data['maxPage'] > 5) pl += '<li><a href="javascript:;" id="s_page_1">1</li><li><a href="javascript:;">...</a></li>';
					for(var i = pageRange[0]; i <= pageRange[1]; i++)
					{
						pl += '<li ' + (i == page ? 'class="active"' : '') + '><a href="javascript:;" id="s_page_' + i + '">' + i + '</a></li>';
					}

					if(data['maxPage'] > pageRange[1]) pl += '<li><a href="javascript:;">...</a></li><li><a href="javascript:;" id="s_page_' + data['maxPage'] + '">' + data['maxPage'] + '</li>';
					pl += '<li class="next ' + (page == data['maxPage'] ? 'disabled' : '') + '"><a href="javascript:;" id="s_page_next">Next &rarr;</a></li>';
					$('#hislist_' + serId).parents('tr').find('ul').html(pl);
					$('#hislist_' + serId).parents('tr').find('tbody').html(ctx);
				}
				else
					std.alertErrorBox('slist', data['msg']);
			});
		}

		//历史记录隐藏
		$('a[class~="hislist"]').live('click', function(){
			$(this).parents('tr').remove();
		});

		//页码按钮事件
		$('a[id^="s_page_"]').live('click', function(){
			var id = $(this).attr('id').split('_')[2];
			var serId = $(this).parents('div').next('input').val();
			var curPage = parseInt($('a[id^="s_page_"]').parent('.active').text());
			if(id ==curPage) return false;

			if(id == 'prev' && curPage == 1) return false;
			if(id == 'prev' && curPage > 1)
				return showHistoryList(serId, curPage-1);

			if(id == 'next') 
			{
				if($(this).parent('.disabled').get(0))
					return false
				else
					return showHistoryList(serId, curPage+1);
			}

			showHistoryList(serId, parseInt($(this).text()));
		});
	};
});

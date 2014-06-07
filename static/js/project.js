define(function(require, exports, module){
    var $ = require('jquery');
	var std = require('std');
	var main = std.cacheMain();//主框架缓存变量
    var createPro = '<ul class="breadcrumb"><li><a href="/wp-admin/admin.php?page=project/">项目管理</a><span class="divider">/</span></li><li class="active">创建项目</li></ul><form class="form-stacked" id="proform"> <fieldset><div class="clearfix"><label for="pname">名称</label><div class="input"><input type="text" id="pname" class="xlarge" size="30" name="pname" /></div></div><div class="clearfix"><label for="vcspath">版本控制地址</label><div class="input"><input type="text" id="vcspath" class="span8" size="256" name="vcspath" /><span class="help-block">比如：svn://192.168.1.253:4000/code/v2/branches/pangu</span></div></div><div class="clearfix"><label for="user">版本控制用户名</label><div class="input"><input type="text" id="user" name="user" /></div></div><div class="clearfix"><label for="pass">版本控制密码</label><div class="input"><input type="password" id="pass" name="pass" /></div></div></fieldset><div class="actions"><button id="prosubmit" class="btn primary">提交</button>&nbsp;<button class="btn" id="cancel">取消</button></div></form>';
	var goPack = '<ul class="breadcrumb"><li><a href="/wp-admin/admin.php?page=project/">项目管理</a><span class="divider">/</span></li><li><a href="/wp-admin/admin.php?page=project/">项目列表</a><span class="divider">/</span></li><li><span id="pname"></span><span class="divider">/</span></li><li class="active">打包</li></ul><input type="text" id="vids" name="vno" placeholder="输入版本号，多个版本号用半角逗号隔开"/>&nbsp;<input type="hidden" id="pcurid" /><a href="javascript:;" id="govcs" class="btn primary">提交</a>';
	var listTable = '<table><thead><th class="span1"><input type="checkbox" id="alltotal" name="all" /></th><th>vcs号</th><th>文件</th></thead><tbody></tbody></table><div class="well"><input type="text" name="version" id="version" class="normal" placeholder="请填写对外版本号"/>&nbsp;<a href="javascript:;" id="startpack" class="btn danger">开始打包</a><span class="help-block">如：2.0.15.r5798或者2.0.16.r5799.p15(补丁的版本号规则)</span>';
	var packList = '<ul class="breadcrumb"><li><a href="/wp-admin/admin.php?page=project/">项目管理</a><span class="divider">/</span></li><li><a href="/wp-admin/admin.php?page=project/">项目列表</a><span class="divider">/</span></li><li><span id="pname"></span><span class="divider">/</span></li><li class="active">包列表</li></ul><table id="listtable"><thead><tr><th colspan="7"><select id="tserver" class="medium" name="tserver"><option value="0">请选择</option></select>&nbsp;<a href="javascript:;" id="action_prele" class="btn primary">发布</a>&nbsp;<a href="javascript:;" id="action_proll" class="btn danger">回滚</a></th></tr><tr><th>#</th><th>版本号</th><th>创建时间</th><th>状态</th><th>最后发布服务器</th><th>最后发布时间</th><th>操作</th></tr></thead><tbody></tbody></table><div class="pagination" id="pagebar"><ul></ul></div><input type="hidden" id="pcurid" />';

	exports.init = function(){
		//显示创建表单
        $('#createpro').live('click', function(){$('#main').hide().fadeIn('slow').html(createPro);});
		//点击取消按钮
		$('#cancel').live('click', function(){std.cancel('main', main);return false;});
		//提交创建表单
		$('#proform').live('submit', function(){
			std.active('prosubmit');
			$('#prosubmit').attr('disabled', true);
			var postData ={};
			postData.pname = $('#pname').val();
			postData.vcs = $('#vcspath').val();
			postData.vcsuser = $('#user').val();
			postData.vcspass = $('#pass').val();
			if(std.validAllNotEmpty(postData) == false)
			{
				std.alertErrorBox('proform', '各项都不能为空');
				std.resetActive('prosubmit');
				return false;
			}
			postData.action = 'createProject';
			std.getJson('post', ajaxurl, postData, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('proform', data['msg']);
					std.resetActive('prosubmit');
					return false;
				}
				else
				{
					location.href = baseUrl+"?page=project";
					return false;
				}
			});
			return false;
		});

		//设置项目列表信息为可编辑
		$('td[id^="vcs"]').live('dblclick', function(){
			var val = $(this).text();
			var id = $(this).attr('id');
			id.indexOf('pass') != -1 ? val = '' : '';
			$(this).html('<input type="text" value="' + val + '" id="edit_' + id + '" />');
			$('#edit_' + id).focus();
		});

		//保存项目列表编辑项
		$('input[id^="edit_"]').live('blur', function(){
			var val = $(this).val();
			var id = $(this).attr('id');
			if(!val){
				std.alertErrorBox('tlist', '该值不能为空');
				return false;
			}

			var p = id.split('_');
			std.getJson('post', ajaxurl, {name: p[1], id: p[2], val: val,action:'updatePassword'}, function(data){
				if(!data['res'])
					std.alertErrorBox('tlist', data['msg']);
				else
					id.indexOf("pass") != -1 ? $('#'+id).parent().html('双击修改密码') : $('#'+id).parent().html(val);
			});
		});

		//项目列表状态修改函数
		function changeStatus(obj, status){
			var id = $(obj).attr('id');
			std.active(id);
			var checkboxs = $('input[name="pcheck[]"]:checked');
			if(!checkboxs.length)
			{
				std.alertErrorBox('tlist', '请至少选择一项');
				std.resetActive(id);
				return false;
			}

			var sValues = new Array();
			checkboxs.each(function(){sValues.push($(this).val());});
			std.getJson('post', ajaxurl, {checkboxs: sValues.join('|'), status: status,action:'changeProject'}, function(data){
				if(!data['res'])
				{
					std.alertErrorBox('tlist', data['msg']);
					std.resetActive(id);
				}
				else
					location.href = baseUrl+"?page=project";
			});
		};

		//项目状态开启关闭操作
		$('#popen').live('click', function(){changeStatus(this, 1)});
		$('#pclose').live('click', function(){changeStatus(this, 2)});

		//显示打包操作
		$('a[id^="package_"]').live('click', function(){
			var pInfo = $(this).attr('id').split('_');
			main = std.cacheMain();
			$('#main').hide().fadeIn('slow').html(goPack);
			$('#pname').html(pInfo[2]);
			$("#pcurid").val(pInfo[1]);
		});

		//根据版本号显示项目打包的文件信息
		$('#govcs').live('click', function(){
			std.active('govcs');
			var vIds = $('#vids').val();
			var vIdsArr = vIds.split(',');
			var vIdLen = vIdsArr.length;
			var pro = $('#pcurid').val();
			if(!vIdLen)
			{
				std.alertErrorBox('vids', '请输入版本号，多个版本号用半角逗号隔开');
				std.resetActive('govcs');
				return false;
			}

			for(var i = 0; i < vIdLen; i++)//判断版本合法性
			{
				if(isNaN(vIdsArr[i]))
				{
					std.alertErrorBox('vids', '请输入纯数字版本号');
					std.resetActive('govcs');
					return false;
				}
			}

			vIds = vIds.split(',').join('|');
			std.getJson('post', ajaxurl, {pro: pro, vids: vIds,action:'packageList'}, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('vids', data['msg']);
					std.resetActive('govcs');
					return false;
				}
				else
				{
					if($('#main > table').length == 0) $('#main').append(listTable);
					$('#main > table > tbody').html('');
					
					$.each(data['logs'],function(i,item){
						var files = [];
						$.each(data['logs'][i],function(j,file){
							files.push('<li><input type="checkbox" name="vf[]" id="vf_' + i + '_' + j + '" value="' + i + '::' + file.a + '::' + file.f + '"/><span class="help-inline">' + file.a + ' ' +  file.f + '</span></li>');
						});
						$('#main > table > tbody').append('<tr><td><input type="checkbox" id="total_' + i + '" name="all" /></td><td><p>r' + i + '</p></td><td><ul class="unstyled packhide">' + files.join('') + '</ul></td></tr>');
					});
					if( data['lastVersion']!='')
					{
						$("#version").val(data['lastVersion']);
					}
					std.resetActive('govcs');
				}
			});
		});

		//项目打包文件选项操作开始
		$('input[id^="total_"]').live('click', function(){
			var id = $(this).attr('id').split('_')[1];
			var val = $(this).attr('checked');
			var checked = val == 'checked' ?  true : false;
			$('input[id^="vf_'+id+'"]').each(function(){$(this).attr('checked', checked)});
		});

		$('#alltotal').live('click', function(){
			var val = $(this).attr('checked');
			var checked = val == 'checked' ?  true : false;
			$('input[id^="total_"]').each(function(){$(this).attr('checked', checked)});
			$('input[id^="vf_"]').each(function(){$(this).attr('checked', checked)});
		});

		$('input[id^="vf_"]').live('click', function(){
			var id = $(this).attr('id');
			var idArr = id.split('_');
			var totalId = 'total_' + idArr[1];
			var vfIds = idArr[0] + '_' + idArr[1];
			var val = $(this).attr('checked');
			if(val != 'checked')
			{
				$('#' + totalId).attr('checked', false);
				$('#alltotal').attr('checked', false);
			}
			else if($('input[id^="' + vfIds + '"]:checked').length == $('input[id^="' + vfIds + '"]').length)
					$('#' + totalId).attr('checked', true);
		});
		//项目打包文件选项操作结束

		//打版本号操作
		$('#startpack').live('click', function(){
			var isSub = $(this).attr('class').indexOf('disabled');
			std.active('startpack');
			var checkboxs = $('input[id^="vf_"]:checked');
			var version = $('#version').val();
			if(!checkboxs.length || !version)
			{
				std.alertErrorBox('version', '请填写版本号并且至少选择一个文件');
				std.resetActive('startpack');
				return false;
			}

			if(isSub > -1) return false;
			//组织数据发送服务器
			var pro = $('#pcurid').val();
			var cVals = [];
			checkboxs.each(function(){cVals.push($(this).val())});
			std.getJson('post', ajaxurl, {verno : version, pro : pro, vals : cVals.join('|'),action:'createPackage'}, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('version', data['msg']);
					std.resetActive('startpack');
					return false;
				}
				else
					showPackList($('#pname').text(), pro);
			});
		});

		//显示项目已经打包的列表
		$('a[id^="packlist_"]').live('click', function(){
			var pInfo = $(this).attr('id').split('_');
			showPackList(pInfo[2], pInfo[1]);
		});

		//页码按钮事件
		$('a[id^="p_page_"]').live('click', function(){
			var id = $(this).attr('id').split('_')[2];
			var curPage = parseInt($('a[id^="p_page_"]').parent('.active').text());
			if(id ==curPage) return false;

			if(id == 'prev' && curPage == 1) return false;
			if(id == 'prev' && curPage > 1)
				return getPackageList($('#pcurid').val(), curPage-1);

			if(id == 'next') 
			{
				if($(this).parent('.disabled').get(0))
					return false
				else
					return getPackageList($('#pcurid').val(), curPage+1);
			}

			getPackageList($('#pcurid').val(), parseInt($(this).text()));
		});

		//点击包名称显示详细
		$('a[id^="p_detail_"]').live('click', function(){
			var id = $(this).attr('id').split('_')[2];
			if($('#detail_' + id).length == 1) return $('#detail_' + id).parent().remove();
			var detail = '<tr><td id="detail_' + id + '" colspan="7">正在读取...</td></tr>';
			$(this).parents('tr').after(detail);
			$.getJSON(ajaxurl +'?action=packdetail&rid=' + id, function(data){
				var dListTr = '';
				if(data['res'] == 1)
				{
					var dls = data['list'];
					dListTr = '<ol>';
					for(var i = 0, j = dls.length; i < j; i++)
					{
						dListTr += '<li>r' + dls[i].f_ver + '&nbsp;&nbsp;' + dls[i].f_path + '</li>';
					}

					dListTr += '</ol>';
				}
				else
					dListTr = 'Oops... 读取失败';

				$('#detail_' + id).html(dListTr);
			});
		});

		//点击设置删除包
		$('a[id^="p_chastatus_"]').live('click', function(){
			if($(this).hasClass('disabled')) return false;

			var idArr = $(this).attr('id').split('_');
			var type = idArr[2];
			var id = idArr[3];
			var parentObj = $('#p_chastatus_' + type + '_' + id).parent();
			std.active($(this).attr('id'));
			$.getJSON(ajaxurl + '?action=deletePackage&op=' + type + '/' + id, function(data){
				if(data['res'] == 1)
				{
					if(type == 2)
					{
						$('#status_' + id).html('<span class="label warning">已删除</span>');
						parentObj.html('<a href="javascript:;" id="p_chastatus_1_' + id + '" class="btn">设置为待发布</a>');
						$('#rid_' + id).removeAttr('checked').attr('disabled', 'disabled');
					}
					else
					{
						$('#status_' + id).html('<span class="label important">待发布</span>');
						parentObj.html('<a href="javascript:;" id="p_chastatus_2_' + id + '" class="btn">删除</a>');
						$('#rid_' + id).removeAttr('disabled');
					}
				}
				else
					parentObj.html('<span class="label warning">Oops..' + data['msg'] + '</span>');
			});
		});

		function getPackageList(pId, page)
		{
            page = !page ? 1 : page;
			$('#listtable').ready(function(){
				$('#listtable > tbody').html('<tr><td colspan="7" style="text-align:center">正在读取,请稍候...</td></tr>');
				std.getJson('post',ajaxurl, {pid :pId,page:page,action:'getPackageList'}, function(data){
					if(data['res'] == 1)
					{
						var ls = data['list'];
						var listTr = '';
						for(var i = 0, j = ls.length; i < j; i++)
						{
							var dis = ls[i].r_status == 2 ? ' disabled = "disabled" ' : ' ';
							listTr += '<tr><td><input type="checkbox" name="package"' + dis + 'id="rid_' + ls[i].r_id + '" value="' + ls[i].r_id + '"/></td>';
							listTr += '<td><a href="javascript:;" id="p_detail_' + ls[i].r_id + '">' + ls[i].r_no + '</a></td>';
							listTr += '<td>' + std.getLocalTime(ls[i].r_cdateline) + '</td><td id="status_' + ls[i].r_id + '">';
							if(ls[i].r_status == 1)
								listTr += '<span class="label important">待发布</span>';
							else if(ls[i].r_status == 2)
								listTr += '<span class="label warning">已删除</span>';
							else if(ls[i].r_status == 3)
								listTr += '<span class="label notice">已发布</span>';
							else if(ls[i].r_status == 4)
								listTr += '<span class="label warning">已回滚</span>';
							
							listTr += '</td><td>' + ls[i].s_name + '</td>';
							listTr += '<td>' + std.getLocalTime(ls[i].r_dateline) + '</td><td>';
							if(ls[i].r_status == 1) 
								listTr += '<a href="javascript:;" class="btn" id="p_chastatus_2_' + ls[i].r_id + '">删除</a>';
							else if(ls[i].r_status == 2 || ls[i].r_status == 4)
								listTr += '<a href="javascript:;" id="p_chastatus_1_' + ls[i].r_id + '" class="btn">设置为待发布</a>';
							listTr += '</td></tr>';
						}

						$('#listtable > tbody').html(listTr);
                        var pageRange = std.setPage((!page ? 1 : page), data['maxPage'], 2);
                        var pl = '<li class="prev ' + (page == 1 ? 'disabled' : '') + '" id="pagepre"><a href="javascript:;" id="p_page_prev">&larr; Previous</a></li>';
						if(pageRange[1] - data['maxPage'] >= 0 && data['maxPage'] > 5) pl += '<li><a href="javascript:;" id="p_page_1">1</li><li><a href="javascript:;">...</a></li>';
                        for(var i = pageRange[0]; i <= pageRange[1]; i++)
                        {
                            pl += '<li ' + (i == page ? 'class="active"' : '') + '><a href="javascript:;" id="p_page_' + i + '">' + i + '</a></li>';
                        }

                        if(data['maxPage'] > pageRange[1]) pl += '<li><a href="javascript:;">...</a></li><li><a href="javascript:;" id="p_page_' + data['maxPage'] + '">' + data['maxPage'] + '</li>';
						pl += '<li class="next ' + (page == data['maxPage'] ? 'disabled' : '') + '"><a href="javascript:;" id="p_page_next">Next &rarr;</a></li>';
                        $('#pagebar > ul').html(pl);
						return false;
					}
					else
						$('table[id="listtable"] > tbody > tr > td').html(data['msg']);
				});
			});
		}

		function showPackList(pName, pId, page)
		{
			$('#main').hide().fadeIn('slow').html(packList);
			$('#pname').html(pName);
			$('#pcurid').val(pId);
			getPackageList(pId, page);
			//取得服务器列表
			getServerList(pId);
		}

		//取得服务器列表
		function getServerList(pId)
		{
			$('#tserver').ready(function(){
				$('#tserver').html('<option value="">请选择</option>');
				var postData = {};
				postData.action = 'getRuntimeList';
				postData.pid = pId;
				std.getJson('post',ajaxurl, postData, function(data){
					if(data['res'] == 1)
					{
						var ls = data['list'];
						var listOpt = [];
						for(var i = 0, j = ls.length; i < j; i++)
						{
							listOpt.push('<option value="' + ls[i].r_id + '">' + ls[i].r_name+'['+ls[i].host+']' + '</option>');
						}
						$('#tserver').append(listOpt.join(''));
					}
					else
					{
						$('a[id^="action_"]').addClass('disabled').die();
						std.alertErrorBox('listtable', data['msg']);
					}
				});
			});
		}

		$('a[id^="action_"]').live('click', function(){
			var releId = 'action_prele';
			var rollId = 'action_proll';
			var id = $(this).attr('id');
			id == releId ? $('#' + rollId).die('click') : $('#' + releId).die('click');
			std.active(id);
			var checkboxs = $('input[name="package"]:checked');
			var tSer = $('#tserver').val();
			if(checkboxs.length <= 0 || !tSer)
			{
				std.alertErrorBox('listtable', '请至少选择一项并且选择对应的目标服务器');
				std.resetActive(id);
				return false;
			}

			//开始发布
			var sValues = new Array();
			var pro = $('#pcurid').val();
			var iframeUrl = ajaxurl+'?action=optionPackage&op=';
			iframeUrl += id == releId ? 'actioning' : 'rollbacking';
			iframeUrl += '/' + tSer + '/'+ pro + '/';

			checkboxs.each(function(){sValues.push($(this).val());});
			$('#listtable').before('<div class="alert-message block-message info" id="proccess_info"><a href="javascript:;" id="goingclose" class="close">X</a><h4>操作正在进行中...</h4></div>');
			$('#proccess_info > h4').append('<br/><iframe width="900" height="200" frameborder="no" allowTransparency="true" scrolling="no" id="going" src="' + iframeUrl + sValues.join('|') + '"></iframe>');
			$('#going').ready(function(){setInterval(function(){var ih = $('#going').contents().find('body').height();if(ih >= 200) $('#going').attr('height', ih+10);}, 1000);});
		});

		$('#goingclose').live('click', function(){
			if(confirm('请不要轻易中断，这样可能造成数据发布混乱...'))
			{
				$(this).parent().remove();
				showPackList($('#pname').text(), $('#pcurid').val(), parseInt($('div[id="pagebar"] > ul > li.active').text()));
			}
		});
	};
});

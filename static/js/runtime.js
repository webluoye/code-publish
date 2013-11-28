define(function(require, exports, module){
    var $ = require('jquery');
	var std = require('std');
	var main = std.cacheMain();//主框架缓存变量
    var createser = '<ul class="breadcrumb"><li><a href="/servers">运行环境管理</a><span class="divider">/</span></li><li class="active">创建运行环境</li></ul><form class="form-stacked" id="serform"><fieldset><div class="clearfix"><label for="pid">所属项目*</label><div class="input"><select name="pid" id="pid"><option value="">请选择</option></select></div></div><div class="clearfix"><label for="pid">目标服务器*</label><div class="input"><select name="sid" id="sid"><option value="">请选择</option></select></div></div><div class="clearfix"><label for="sname">名称*</label><div class="input"><input type="text" id="sname" class="xlarge" size="30" name="sname" /></div></div><div class="clearfix"><label for="pdir">生产地址*</label><div class="input"><input type="text" id="pdir" class="span8" size="256" name="pdir" /><span class="help-block">比如：/data/wwwV2/</span></div></div><div class="clearfix"><label for="pdir">备份地址*</label><div class="input"><input type="text" id="bdir" class="span8" size="256" name="bdir" /><span class="help-block">比如：/data/release/</span></div></div></fieldset><div class="actions"><button class="btn primary" id="sersubmit">提交</button>&nbsp;<button class="btn" id="cancel">取消</button></div></form>';
	var history = '<tr><td colspan="6"><div class="alert-message info"><a class="close hislist" href="javascript:void(0)">X</a><p><strong>历史记录</strong></p></div><table class="bordered-table zebra-striped"><thead><tr><th>#</th><th>版本号</th><th>发布时间</th></tr></thead><tbody></tbody></table><div class="pagination"><ul></ul></div><input type="hidden" />';

	exports.init = function(){
		//显示创建表单
        $('#createser').live('click', function(){
			$('#main').hide().fadeIn('slow').html(createser);
			 //取得服务器列表
			var postData ={};
			postData.action = 'initRuntime';
			std.getJson('post',ajaxurl, postData, function(data){
                    if(data['res'] == 1)
                    {
                            for(var i = 0, j = data['list'].length; i < j; i++)
                            {
                                    $('#pid').append('<option value="' + data['list'][i].p_id + '">' + data['list'][i].p_name + '</option>');
                            }
                            $(data['server']).each(function(k){
                            	$('#sid').append('<option value="' + data['server'][k].s_id + '">' + data['server'][k].s_host + '</option>');
                            });
                    }
                    else
                            std.alertErrorBox('serform', data['msg']);
            });
		});
		//点击取消按钮
		$('#cancel').live('click', function(){var cancel = std.cancel('main', main);return false;});
		//提交创建表单
		$('#serform').live('submit', function(){
			std.active('sersubmit');
			var postData ={};
			postData.rname = $('#sname').val();
			postData.pdir = $('#pdir').val();
			postData.bdir = $('#bdir').val();
			postData.pid = $('#pid').val();
			postData.sid = $('#sid').val();
			if(std.validAllNotEmpty(postData) == false)
			{
				std.alertErrorBox('serform', '带*号不能为空');
				std.resetActive('sersubmit');
				return false;
			}
			postData.action = 'createRuntime';
			std.getJson('post',ajaxurl, postData, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('serform', data['msg']);
					std.resetActive('sersubmit');
					return false;
				}
				else
				{
					location.href = baseUrl+'?page=runtime';
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
			std.getJson('post',ajaxurl, {name: p[2], id: p[3], val: val, action:'updateRuntime'}, function(data){
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
			std.getJson('post', ajaxurl, {checkboxs: sValues.join('|'), status: status,action:'changeRuntime'}, function(data){
				if(!data['res'])
				{
					std.alertErrorBox('slist', data['msg']);
					std.resetActive(id);
				}
				else
					location.href = baseUrl+'?page=runtime';
			});
		};

		//服务器状态开启关闭操作
		$('#sopen').live('click', function(){changeStatus(this, 1)});
		$('#sclose').live('click', function(){changeStatus(this, 2)});

	};
});

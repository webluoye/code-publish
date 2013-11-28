seajs.config({
    alias:{
        'jquery':'jquery-1.7.1.min.js',
    }
});

define(function(require, exports, module){
	$ = require('jquery');
	std = require('std');
	$(document).ready(function(){
		var qString = std.queryString();
		if(qString == 'login' || qString['login'])
		{
			if($('#loginwarning').length == 0)
			{
				std.alertErrorBox('main', 'Oops...请先登录，谢谢!!');
				$('#loginwarning').fadeOut(600).fadeIn(600);
			}
			$('#loginuserinput').focus();
		}

		$('#loginsubmit').live('click', function(){
			std.active('loginsubmit');
			var postData ={};
			postData.user = $('input[name="username"]').val();
			postData.pass = $('input[name="password"]').val();
			if(std.validAllNotEmpty(postData) == false)
			{
				std.alertErrorBox('main', 'Oops...请填写正确的用户名和密码');
				std.resetActive('loginsubmit');
				return false;
			}

			std.getJson('post', '/logged/login/', postData, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('main', data['msg']);
					std.resetActive('loginsubmit');
					return false;
				}
				else
				{
					std.loginDisplay(data['uInfo']);
					return false;
				}
			});
		});

		$('#logout').live('click', function(){
			std.active('logout');
			std.getJson('get', '/logged/logout/', {}, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('main', data['msg']);
					std.resetActive('logout');
					return false;
				}
				else
				{
					location.href = data['redirect'];
					return false;
				}
			});
		});

		$('#logset').live('click', function(){
			var setLists = '<ul class="breadcrumb"><li><a href="/">首页</a><span class="divider">/</span>用户设置</li></ul><table id="ulist"><thead><tr><th>#</th><th>用户名</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody></tbody></table>';
			$('#main').hide().fadeIn('slow').html(setLists);
			std.getJson('get', '/users', {}, function(data){
				if(data['res'] == 0)
				{
					std.alertErrorBox('main', data['msg']);
					return false;
				}
				else
				{
					var users = data['users'];
					var tbodys = [];
					for(var i = 0, j = users.length; i < j; i++)
					{
						var ts = '<tr><td>' + users[i].adm_id + '</td>';
						ts += '<td>' + users[i].adm_user + '</td><td>';
						ts += users[i].adm_status == 1 ? '<span class="label success">正常</span>&nbsp;' : '<span class="label warning">关闭</span>';
						ts += '</td>';
						ts += '<td>' + std.getLocalTime(users[i].adm_dateline) + '</td><td>';
						ts += '';
						ts += (data['curId'] == users[i].adm_id || data['curAuth'] == 1) ? '&nbsp;<a href="javascript:;" id="setpass_' + users[i].adm_id + '" class="btn">修改密码</a>' : '';
						if(data['curId'] != users[i].adm_id && data['curAuth'] == 1)
							ts += users[i].adm_status == 1 ? '&nbsp;<a href="javascript:;" id="admstatus_' + users[i].adm_id + '_0" class="btn">设为关闭</a>' : '&nbsp;<a href="javascript:;" id="admstatus_' + users[i].adm_id + '_1" class="btn">设为正常</a>';

						ts += '</td></tr>';
						tbodys.push(ts);
						ts = '';
					}

					if(data['curAuth'] == 1)
						tbodys.push('<tr></tr><tr><td colspan="5"><h3>增加用户</h3><form id="adminform"><fieldset><div class="clearfix"><label for="username">登录名：</label><div class="input"><input type="text" name="username" size="30" id="username"></div></div><div class="clearfix"><label for="userpwd">密码：</label><div class="input"><input type="password" name="userpwd" size="30" id="userpwd"></div></div><div class="clearfix"><label for="repeatpwd">确认密码：</label><div class="input"><input type="password" name="repeatpwd" size="30" id="repeatpwd"></div></div></fieldset><div class="actions"><a class="btn primary" id="addadmin">提交</a></div></form></td></tr>');

					$('#ulist > tbody').html(tbodys.join(''));
					return false;
				}
			});

			$('#addadmin').live('click', function(){
				std.active('addadmin');
				var uName = $('#username').val();
				var uPwd = $('#userpwd').val();
				var repeatPwd = $('#repeatpwd').val();
				var uNameLen = uName.length;
				var uPwdLen = uPwd.length;
				var msg = '';
				if(uNameLen < 5 || uNameLen > 12)
					msg += '登录名必须在5-12个字符之间<br />';

				if(uPwdLen < 6 || uPwdLen > 12 || uPwd != repeatPwd)
					msg += '密码必须在6-12个字符之间，并且两次密码必须一致<br />';

				if(msg)
				{
					std.alertErrorBox('adminform', msg);
					std.resetActive('addadmin');
					return false;
				}

				std.getJson('POST', '/users/add', {uName : uName, pwd : uPwd}, function(data){
					if(data['res'] == 1)
					{
						$('#username').val('');
						$('#userpwd').val('');
						$('#repeatpwd').val('');
						alert(data['msg']);
					}
					else
						std.alertErrorBox('adminform', data['msg']);

					std.resetActive('addadmin');
					return false;
				});
			});

			$('a[id^="setpass_"]').live('click', function(){
				var idName = $(this).attr('id');
				var id = idName.split('_')[1];
				if(!$(this).parents('tr').next().find('form').length)
				{
					$(this).parents('tr').after('<tr><td colspan="5"><form><fieldset><div class="clearfix"><label for="userpwd_' + id + '">新密码：</label><div class="input"><input type="password" name="userpwd" size="30" id="userpwd_' + id + '"></div></div><div class="clearfix"><label for="repeatpwd_' + id + '">确认密码：</label><div class="input"><input type="password" name="repeatpwd" size="30" id="repeatpwd_' + id + '"></div></div></fieldset><div class="actions"><a class="btn primary" id="pwdsub_' + id + '">提交</a>&nbsp;<a id="pwdcancel_' + id + '" class="btn">取消</a></div></form></td></tr>');
				}
				else
					$(this).parents('tr').next('tr').fadeIn('slow');
			});

			$('a[id^="pwdsub_"]').live('click', function(){
				var idName = $(this).attr('id');
				std.active(idName);
				var id = idName.split('_')[1];
				var pwd = $('#userpwd_' + id).val();
				var repeatPwd = $('#repeatpwd_' + id).val();
				var pwdLen = pwd.length;
				if(pwd != repeatPwd || !pwd || pwdLen < 6 || pwdLen > 12)
				{
					std.alertErrorBox('main', '密码长度必须在6－12个字符之间，且两次密码必须一致，请确认');
					std.resetActive(idName);
					return false;
				}

				std.getJson('POST', '/users/pwd', {pwd : pwd, uId : id}, function(data){
					std.resetActive(idName);
					if(data['res'] == 0)
						std.alertErrorBox('main', data['msg']);
					else
						$('#' + idName).parents('tr').fadeOut('slow');
				});
			});

			$('a[id^="pwdcancel_"]').live('click', function(){
				$(this).parents('tr').fadeOut('slow');
			});

			$('a[id^="admstatus_"]').live('click', function(){
				var idName = $(this).attr('id');
				var tArr = idName.split('_');
				var id = parseInt(tArr[1]);
				var sta = parseInt(tArr[2]);
				if(!id)
				{
					std.alertErrorBox('main', '参数错误');
					return false;
				}

				std.getJson('post', '/users/set', {uId : id, sta : sta}, function(data){
					if(data['res'] == 0)
					{
						std.alertErrorBox('main', data['msg']);
						return false;
					}
					else
					{
						var setTxt = '设为正常';
						var rClass = 'success';
						var aClass = 'warning';
						var spanTxt = '关闭';
						var nowSta = 1;
						if(sta == 1)
						{
							setTxt = '设为关闭';
							spanTxt = '正常';
							tmpClass = rClass;
							rClass = aClass;
							aClass = tmpClass;
							nowSta = 0;
						}

						$('#' + idName).text(setTxt);
						var spanObj = $('#' + idName).parents('tr').find('span');
						spanObj.text(spanTxt);
						spanObj.removeClass(rClass).addClass(aClass);
						$('#' + idName).attr('id', tArr[0] + '_' + tArr[1] + '_' + nowSta);
						return false;
					}
				});
			});
		});
	});
});

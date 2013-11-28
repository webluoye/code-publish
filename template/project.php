<?php include_once 'header.php'; ?>
<!--项目列表管理开始-->
<ul class="breadcrumb">
	<li><a href="#">项目管理</a><span class="divider">/</span></li>
	<li class="active">项目列表</li>
	<li><a class="btn large primary" href="javascript:;" id="createpro">创建项目</a></li>
</ul>
<table id="tlist">
	<thead>
		<tr>
			<th>#</th>
			<th>名称</th>
			<th style="width:40%;">版本控制地址</th>
			<th>用户名</th>
			<th>密码</th>
			<th>创建时间</th>
			<th>操作</th>
		</tr>
	</thead>
	<tbody>
		<?php
foreach($result as $v)
{
	if(false === isset($codePublishAccess[$v->p_id]) || (isset($codePublishAccess[$v->p_id]) && false === in_array(get_current_user_id(), $codePublishAccess[$v->p_id])))
	{
		continue;
	}
		?>
		<tr>
			<td><input type="checkbox" name="pcheck[]" value="<?php echo $v->p_id; ?>"/></td>
			<td><?php echo $v->p_name; ?></td>
			<td style="word-break:break-all;" id="vcs_<?php echo $v->p_id; ?>"><?php echo $v->p_vcspath; ?></td>
			<td id="vcsuser_<?php echo $v->p_id; ?>"><?php echo $v->p_user; ?></td>
			<td id="vcspass_<?php echo $v->p_id; ?>">双击修改密码</td>
			<td><?php echo date("Y-m-d H:i:s", $v->p_cdateline); ?></td>
			<td>
			<?php if(1 == $v->p_status)
	{
			?>
				<a href="javascript:;" id="package_<?php echo $v->p_id; ?>_<?php echo $v->p_name; ?>" class="btn success">打包</a>&nbsp;<a href="javascript:;" id="packlist_<?php echo $v->p_id; ?>_<?php echo $v->p_name; ?>" class="btn">包列表</a>
			<?php }
	else
	{
			?>
				<span class="label warning">已关闭</span>
			<?php } ?>
			</td>
		</tr>
		<?php } ?>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="7">
				<button class="btn" id="popen">打开</button>
				<button class="btn" id="pclose">关闭</button>
				<a href="javascript:;" class="btn primary" id="createpro">创建项目</button>
			</td>
		</tr>
	</tfoot>
</table>
<!--项目列表管理结束-->
<script language="javascript" type="text/javascript">seajs.use('<?php echo CODE_URL ?>/static/js/project', function(project) {project.init();});</script>
<?php include_once 'footer.php'; ?>

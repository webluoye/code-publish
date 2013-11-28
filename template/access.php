<?php include_once 'header.php'; ?>
<ul class="breadcrumb">
	<li><a href="#">权限管理</a><span class="divider">/</span></li>
	<li class="active">权限管理</li>
</ul>
<form action="" method="post">
<table id="tlist">
	<thead>
		<tr>
			<th>项目名称</th>
			<th style="width:40%;">用户帐号</th>
		</tr>
	</thead>
	<tbody>
		<?php
$userList = get_users();
foreach($result as $v)
{
		?>
		<tr>
			<td><?php echo $v->p_name; ?></td>
			<td><?php
	foreach($userList as $u)
	{
		$selectd = (isset($codePublishAccess[$v->p_id]) && in_array($u->ID, $codePublishAccess[$v->p_id])) ? 'checked' : '';
		echo '<input type="checkbox" ' . $selectd . '  name="access_' . $v->p_id . '[]" value="' . $u->ID . '"/>' . $u->user_login . "<br/>";
	}
				?></td>
			<td></td>
		</tr>
		<?php } ?>
	</tbody>
	<tfoot>
		<tr>
			<td></td>
			<td><button type="submit" class="btn" id="popen">保存</button></td>
		</tr>
	</tfoot>
</table>
</form>
<?php include_once 'footer.php'; ?>
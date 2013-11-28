<?php include_once 'header.php'; ?>
<!--服务器列表管理开始-->
<ul class="breadcrumb">
	<li><a href="#">运行环境管理</a><span class="divider">/</span></li>
	<li class="active">运行环境列表</li>
	<li><a class="btn large primary" href="javascript:;" id="createser">创建运行环境</a></li>
</ul>
<table id='slist'>
	<thead>
		<tr>
			<th>#</th>
			<th>运行环境</th>
			<th>服务器</th>
			<th>项目</th>
			<th width="40%">详细</th>
			<th>创建时间</th>
			<th>状态</th>
		</tr>
	</thead>
	<tbody>
		<?php
foreach($result as $v)
{
		?>
		<tr>
			<td><input type="checkbox" name="scheck" value="<?php echo $v->r_id ?>"/></td>
			<td><span id="ser_name_<?php echo $v->r_id ?>"><?php echo $v->r_name ?></span></td>
			<td><?php echo $v->s_id_name ?></td>
			<td><?php echo $v->p_id_name ?></td>
			<td>
				<ul class="unstyled">
					<li><span class="blue">生产地址：</span><span id="ser_pdir_<?php echo $v->r_id ?>"><?php echo $v->r_pdir ?></span></li>
					<li><span class="blue">备份地址：</span><span id="ser_bdir_<?php echo $v->r_id ?>"><?php echo $v->r_bdir ?></span></li>
				</ul>
			</td>
			<td><?php echo date("Y-m-d H:i:s", $v->r_cdateline) ?></td>
			<td>
			<?php if($v->r_status == 1)
	{
			?>
				<span class="label success">正常</span>
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
				<button class="btn" id="sopen">打开</button>
				<button class="btn" id="sclose">关闭</button>
				<a class="btn large primary" href="javascript:;" id="createser">创建运行环境</a>
			</td>
		</tr>
	</tfoot>
</table>
<!--服务器列表管理结束-->
<script language="javascript" type="text/javascript">
seajs.use('<?php echo CODE_URL ?>/static/js/runtime', function(servers) {servers.init();});</script>
<?php include_once 'footer.php'; ?>

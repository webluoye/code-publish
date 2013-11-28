<?php include_once 'header.php'; ?>
<!--服务器列表管理开始-->
<ul class="breadcrumb">
	<li><a href="#">服务器管理</a><span class="divider">/</span></li>
	<li class="active">服务器列表</li>
	<li><a class="btn large primary" href="javascript:;" id="createser">创建服务器</a></li>
</ul>
<table id='slist'>
	<thead>
		<tr>
			<th>#</th>
			<th>服务器HOST</th>
			<th>用户</th>
			<th>详情</th>
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
			<td><input type="checkbox" name="scheck" value="<?php echo $v->s_id?>"/></td>
			<td><?php echo $v->s_host?></td>
			<td><?php echo $v->s_user?></td>
			<td>
				<ul class="unstyled">
					<li><span class="blue">密码：</span><span id="ser_pass_<?php echo $v->s_id?>">双击修改密码</span></li>
					<?php if($v->s_vpn) {?>
					<li><span class="blue">vpn网关：</span><span id="ser_vpn_<?php echo $v->s_id?>"><?php echo $v->s_vpn?></span></li>
					<li><span class="blue">vpn帐号：</span><span id="ser_vpnuser_<?php echo $v->s_id?>"><?php echo $v->s_vpnuser?></span></li>
					<li><span class="blue">vpn密码：</span><span id="ser_vpnpass_<?php echo $v->s_id?>">双击修改密码</span></li>
					<?php }?>
				</ul>
			</td>
			<td><?php echo date("Y-m-d H:i:s",$v->s_cdateline)?></td>
			<td>
			<?php if($v->s_status == 1){?>
				<span class="label success">正常</span>
			<?php }else{?>
				<span class="label warning">已关闭</span>
			<?php }?>
				<a href="javascript:void(0)" id="history_<?php echo $v->s_id?>" class="label">查看发布记录</a>
			</td>
		</tr>
		<?php } ?>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="6">
				<button class="btn" id="sopen">打开</button>
				<button class="btn" id="sclose">关闭</button>
				<a class="btn large primary" href="javascript:;" id="createser">创建服务器</a>
			</td>
		</tr>
	</tfoot>
</table>
<!--服务器列表管理结束-->
<script language="javascript" type="text/javascript">
seajs.use('<?php echo CODE_URL ?>/static/js/servers', function(servers) {servers.init();});</script>
<?php include_once 'footer.php'; ?>

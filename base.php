<?php
class CodeBase
{
	public static function base()
	{
		global $wpdb;
		$result = $wpdb->get_results("select * from wp_c2_server order by s_id desc");
		include_once CODE_PATH . '/template/servers.php';
	}

	public static function access()
	{
		global $wpdb;
		$result = $wpdb->get_results("select * from wp_c2_project order by p_id desc");
		if($_POST)
		{
			$userAccess = array();
			foreach($result as $c)
			{
				$access = isset($_POST['access_' . $c->p_id]) ? $_POST['access_' . $c->p_id] : array();
				foreach($access as $acc)
				{
					$userAccess[$c->p_id][] = $acc;
				}
			}
			update_site_option('codePublish_access', json_encode($userAccess));
		}
		$codePublishAccess = json_decode(get_site_option('codePublish_access'), true);
		require_once CODE_PATH . '/template/access.php';
	}

	public static function project()
	{
		global $wpdb;
		$result = $wpdb->get_results("select * from wp_c2_project order by p_id desc");
		$codePublishAccess = json_decode(get_site_option('codePublish_access'), true);
		include_once CODE_PATH . '/template/project.php';
	}

	public static function runtime()
	{
		global $wpdb;
		$result = $wpdb->get_results("select * from wp_c2_runtime order by r_id desc");
		foreach($result as $k => $v)
		{
			$result[$k]->p_id_name = $wpdb->get_var("select p_name from wp_c2_project where p_id=" . $v->p_id);
			$result[$k]->s_id_name = $wpdb->get_var("select s_host from wp_c2_server where s_id=" . $v->s_id);
		}
		include_once CODE_PATH . '/template/runtime.php';
	}
}

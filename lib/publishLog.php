<?php
class CodePublishLog
{
	private $uesrId;
	private $db;

	function __construct($userId)
	{
		global $wpdb;
		$this->db = $wpdb;
		$this->uesrId = $userId;
	}

	public function addLog($project, $server, $version, $type)
	{
		return $this->db->query("insert into wp_c2_user_log(l_user,l_time,l_project,l_server,l_version,l_type)values(
				'" . $this->uesrId . "','" . time() . "','" . $project . "','" . $server . "','" . $version . "','" . $type . "')");
	}
}

<?php
class CodeCommonDbLib
{
	private $db;

	function __construct()
	{
		global $wpdb;
		$this->db = $wpdb;
	}

	public function addFileLog($rid, $action, $path, $ver)
	{
		return $this->db->query("insert into wp_c2_files(r_id,f_action,f_path,f_ver)values('" . $rid . "','" . $action . "','" . $path . "','" . $ver . "')");
	}

}

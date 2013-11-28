<?php

class CodeAction
{
	public static function addMenu()
	{
		add_menu_page('代码发布系统', '代码发布系统', 'administrator', 'publishcode', array('CodeBase', 'base'), '');
		add_submenu_page('publishcode', '服务器管理', '服务器管理', 'administrator', 'publishcode', array('CodeBase', 'base'));
		add_submenu_page('publishcode', '项目管理', '项目管理', '0', 'project', array('CodeBase', 'project'));
		add_submenu_page('publishcode', '运行环境管理', '运行环境管理', 'administrator', 'runtime', array('CodeBase', 'runtime'));
		add_submenu_page('publishcode', '权限管理', '权限管理', 'administrator', 'access', array('CodeBase', 'access'));
	}

	public static function handleError($errno, $errstr, $errfile, $errline, array $errcontext)
	{
		if(0 === error_reporting())
		{
			return false;
		}
		if(stripos($errfile, 'code-publish') !== false)
		{
			throw new Exception($errstr . ',file:' . $errfile . ',line:' . $errline);
		}
	}

	public static function initRuntime()
	{
		global $wpdb;
		$projectList = $wpdb->get_results("select p_id,p_name from wp_c2_project where p_status=1 order by p_id desc");
		$serverList = $wpdb->get_results("select s_id,s_host from wp_c2_server where s_status=1 order by s_id desc");
		$data = array('res' => 1);
		if(!$serverList)
		{
			$data['res'] = 0;
			$data['msg'] = '执行查询SQL失败';
		}
		else
		{
			$data['list'] = $projectList;
			$data['server'] = $serverList;
		}
		echo json_encode($data);
		exit;
	}

	public static function createRuntime()
	{
		$rname = trim($_POST['rname']);
		$pdir = trim($_POST['pdir']);
		$bdir = trim($_POST['bdir']);
		$pid = trim($_POST['pid']);
		$sid = trim($_POST['sid']);
		$data = array('res' => 1);
		if(!is_numeric($pid) || !is_numeric($sid))
		{
			$data['res'] = 0;
			$data['msg'] = '项目ID 和 服务器ID 必须是数字';
		}
		else
		{
			$sql = "insert into wp_c2_runtime(p_id,s_id,r_pdir,r_bdir,r_name,r_status,r_cdateline)values(
				'" . intval($pid) . "','" . intval($sid) . "','" . $pdir . "','" . $bdir . "','" . $rname . "',1,'" . time() . "')";
			global $wpdb;
			if(!$wpdb->query($sql))
			{
				$data['res'] = 0;
				$data['msg'] = '创建项目SQL执行失败';
			}
		}
		echo json_encode($data);
		exit;
	}

	public static function changeRuntime()
	{
		$checkboxs = $_POST['checkboxs'];
		$status = intval($_POST['status']);
		$checkboxs = str_replace('|', ',', $checkboxs);
		global $wpdb;
		$sql = "update wp_c2_runtime set r_status ='" . $status . "' where r_id in('" . $checkboxs . "')";
		$data = array('res' => 1);
		if(false === $wpdb->query($sql))
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败' . $sql;
		}
		echo json_encode($data);
		exit;
	}

	public static function getRuntimeList()
	{
		$pid = intval($_POST['pid']);
		global $wpdb;
		$sql = "select r_id,r_name,s_id from wp_c2_runtime where p_id=" . $pid;
		$data = array('res' => 1);
		$runtimeList = $wpdb->get_results($sql);
		if(false === $runtimeList)
		{
			$data['res'] = 0;
			$data['msg'] = '查询SQL执行失败';
		}
		foreach($runtimeList as $k => $v)
		{
			$runtimeList[$k]->host = $wpdb->get_var("select s_host from wp_c2_server where s_id=" . $v->s_id);
		}
		$data['list'] = $runtimeList;
		echo json_encode($data);
		exit;
	}

	public static function updateRuntime()
	{
		$name = $_POST['name'];
		$id = $_POST['id'];
		$val = $_POST['val'];
		global $wpdb;
		$sql = "update wp_c2_runtime set r_" . $name . " ='" . $val . "' where r_id=" . intval($id);
		$data = array('res' => 1);
		if(!$wpdb->query($sql))
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败';
		}
		echo json_encode($data);
		exit;
	}

	public static function createProject()
	{
		$pname = trim($_POST['pname']);
		$vcs = trim($_POST['vcs']);
		$vcsuser = trim($_POST['vcsuser']);
		$vcspass = trim($_POST['vcspass']);
		$data = array('res' => 0);
		global $wpdb;
		if($wpdb->get_var("select p_id from wp_c2_project where p_vcspath='".$vcs."'")){
			$data['msg'] = $vcs."已经存在!";
		}
		else{
			$sql = "insert into wp_c2_project(p_name,p_vcspath,p_user,p_pass,p_status,p_cdateline)values(
					'" . $pname . "','" . $vcs . "','" . $vcsuser . "','" . $vcspass . "',1,'" . time() . "')";		
			if(!$wpdb->query($sql))
			{
				$data['msg'] = '创建项目SQL执行失败';
			}
			else{
				$data['res'] = 1;
			}
		}
		echo json_encode($data);
		exit;
	}

	public static function getPackageList()
	{
		$pid = intval($_POST['pid']);
		$page = intval($_POST['page']);
		global $wpdb;
		$data = array('res' => 1);
		$result = $wpdb->get_results("select * from wp_c2_revision where p_id=" . $pid . " order by r_id desc limit " . (($page - 1) * 20) . ', 20');
		if(!$result)
		{
			$data['res'] = 0;
			$data['msg'] = '还没有发布任何文件';
		}
		else
		{
			$data['res'] = 1;
			$data['list'] = $result;
			$data['maxPage'] = ceil($wpdb->get_var("select count(*) from  wp_c2_revision where p_id=" . $pid) / 20);
		}
		echo json_encode($data);
		exit;
	}

	public static function deletePackage()
	{
		$op = trim($_GET['op']);
		$opArr = explode('/', $op);
		global $wpdb;
		$result = $wpdb->query("update wp_c2_revision set r_status=" . ($opArr[0] == 2 ? '3' : 1) . " where r_id=" . $opArr[1]);
		$data = array('res' => 1);
		if(!$result)
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败';
		}
		else
		{
			$data['res'] = 1;
		}
		echo json_encode($data);
		exit;
	}

	public static function packdetail()
	{
		$rid = intval($_GET['rid']);
		global $wpdb;
		$detail = $wpdb->get_results("select f_ver,f_path from wp_c2_files where r_id=" . $rid . ' order by f_id desc');
		$data = array('res' => 1);
		if(!$detail)
		{
			$data['res'] = 0;
			$data['msg'] = '还没有发布记录';
		}
		else
		{
			$data['list'] = $detail;
		}
		echo json_encode($data);
		exit;
	}

	public static function optionPackage()
	{
		$op = trim($_GET['op']);
		$opArr = explode('/', $op);
		if(4 != count($opArr))
		{
			echo '参数错误';
			exit;
		}
		flush();
		$opAction = $opArr[0];
		$runtime = $opArr[1];
		$pid = $opArr[2];
		$versionId = str_replace('|', ',', $opArr[3]);
		global $wpdb;
		$runtimeInfo = $wpdb->get_row("select r_pdir,r_bdir,s_id,r_name from wp_c2_runtime where r_id=" . $runtime);
		if(!$runtimeInfo)
		{
			echo "不存在的运行环境配置";
			exit;
		}
		$serverInfo = $wpdb->get_row("select s_host,s_user,s_pass from wp_c2_server where s_id=" . $runtimeInfo->s_id);
		if(!$serverInfo)
		{
			echo "运行环境配置的服务器信息不存在";
			exit;
		}
		$verInfo = $wpdb->get_results("select r_no,r_cdateline from wp_c2_revision where r_id in (" . $versionId . ")");
		if(!$verInfo)
		{
			echo "要发布的包信息不存在";
			exit;
		}
		$sendVer = array();
		foreach($verInfo as $v)
		{
			$sendVer[$v->r_no] = $v->r_cdateline;
		}
		'actioning' == $opAction ? asort($sendVer) : arsort($sendVer);
		self::optionPackageLib($runtimeInfo, $serverInfo, array_keys($sendVer), $pid, $opAction, $versionId);
		exit;
	}

	private static function optionPackageLib($runtimeInfo, $serverInfo, $sendVer, $pid, $opAction, $versionId)
	{
		global $wpdb;
		echo "<br/>开始连接服务器<br/>";
		$ssh = new CodeSshLib($serverInfo->s_host, $serverInfo->s_user, $serverInfo->s_pass);
		try
		{
			if(!$conn = $ssh->connection())
			{
				echo "服务器连接失败" . $serverInfo->s_host . ':' . $serverInfo->s_user . "\n";
				exit;
			}
			$resultStatus = 3;
			$publishLog = new CodePublishLog(get_current_user_id());
			if('actioning' == $opAction)
			{
				echo "开始上传文件到目标服务器<br/>";
				foreach($sendVer as $v)
				{
					$tarfile = CODE_PATH . '/packdir/' . $pid . '/' . $v . '.tar.gz';
					if(!file_exists($tarfile))
					{
						echo "上传文件 " . $v . ".tar.gz 文件不存在 流程终止<br/>";
						exit;
					}
					if(!$ssh->sendFile($tarfile, $runtimeInfo->r_bdir . $v . '.tar.gz'))
					{
						echo "上传文件 " . $v . ".tar.gz 到目标服务器失败<br/>";
						exit;
					}
				}
				echo "开始执行服务器命令<br/>";
				echo "开始发布" . implode(' ', $sendVer) . "包<br/>";
				$msg = $ssh->execCommand('cd ' . $runtimeInfo->r_bdir . '/bin; python release.py "' . implode(' ', $sendVer) . '" ' . $runtimeInfo->r_bdir . ' ' . $runtimeInfo->r_pdir);

			}
			else
			{
				echo "开始执行服务器命令<br/>";
				echo "开始回滚" . implode(' ', $sendVer) . "包<br/>";
				$msg = $ssh->execCommand('cd ' . $runtimeInfo->r_bdir . '/bin; python rollback.py "' . implode(' ', $sendVer) . '" ' . $runtimeInfo->r_bdir . ' ' . $runtimeInfo->r_pdir);
				$resultStatus = 4;
			}
			echo '服务端操作信息<br/>' . nl2br($msg['msg']);
			if(empty($msg['error']))
			{
				$wpdb->query("update wp_c2_revision set r_status=" . $resultStatus . ",r_dateline='" . time() . "',s_id=" . $runtimeInfo->s_id . ",s_name='" . $runtimeInfo->r_name . "' where r_id in(" . $versionId . ")");
			}
			else
			{
				echo '错误信息<br/>' . nl2br($msg['error']);
			}
			foreach(explode(',', $versionId) as $v)
			{
				$publishLog->addLog($pid, $runtimeInfo->s_id, $v, 'actioning' == $opAction ? 1 : 2);
			}
		}
		catch(Exception $e)
		{
			echo $e->getMessage();
		}
	}

	public static function createPackage()
	{
		$version = trim(strip_tags($_POST['verno']));
		$pro = trim($_POST['pro']);
		$vals = trim($_POST['vals']);
		$data = array('res' => 0);
		if($version && $pro && $vals)
		{
			global $wpdb;
			try
			{
				$lastVer = $wpdb->get_var("select r_no from wp_c2_revision where p_id=" . $pro . " and r_no='" . $version . "' order by r_id desc limit 1");
				$proInfo = $wpdb->get_row("select p_vcspath,p_user,p_pass from wp_c2_project where p_status=1 and p_id=" . $pro);
				if(!$proInfo)
				{
					throw new Exception($version . '不存在的项目');
				}
				if($lastVer)
				{
					throw new Exception($version . '版本号已经存在');
				}
				$cvsFile = explode('|', $vals);
				$result = self::createPackageLib($proInfo, $version, $cvsFile, $pro);
				if(true !== $result)
				{
					self::showMsg($result);
				}
				else
				{
					$revResult = $wpdb->query("insert into wp_c2_revision(p_id,r_no,s_id,s_name,r_dateline,r_cdateline,r_status)values('" . $pro . "',
								'" . $version . "','','','','" . time() . "','1')");
					if($revResult)
					{
						$codeComDbLib = new CodeCommonDbLib();
						$rid = $wpdb->insert_id;
						foreach($cvsFile as $f)
						{
							$fileArr = explode('::', $f);
							$codeComDbLib->addFileLog($rid, $fileArr[1], $fileArr[2], $fileArr[0]);
						}
						self::showMsg('', 1);
					}
					self::showMsg('写入发布包记录失败');
				}
			}
			catch(Exception $e)
			{
				self::showMsg($e->getMessage());
			}
		}
		self::showMsg('版本号，SVN文件必须存在');
	}

	private static function createPackageLib($proInfo, $target, $okFileList, $pro)
	{
		$svn = new CodeSvnLib($proInfo->p_user, $proInfo->p_pass, $proInfo->p_vcspath, array(1));
		$package = new CodePackageLib($okFileList, CODE_PATH . '/' . $target);
		if(false == $svn->checkOut())
		{
			return "svn checkout 失败";
		}
		$successCount = 0;
		foreach($okFileList as $v)
		{
			$fileArr = explode('::', $v);
			if('D' == strtoupper($fileArr[1]))
			{
				$successCount++;
				continue;
			}
			$toFile = CODE_PATH . '/' . $target . '/source/' . $fileArr[2];
			if(!$package->createPath($toFile))
			{
				return 'mkdir path ' . $toFile . ' failed';
				break;
			}
			if($svn->export($fileArr[2], $toFile, $fileArr[0]))
			{
				$successCount++;
			}
		}
		if($successCount != count($okFileList))
		{
			rmdir(CODE_PATH . '/' . $target);
			return "export failed (export file num:" . $successCount . "/" . count($okFileList) . ") 请重试！";
		}
		$package->rrmdir(CODE_PATH . $svn->getCheckoutPath());
		if(!$package->createSendPackage($okFileList))
		{
			return 'ready to create bin backup folder error' . "\n";
		}
		$projectDir = CODE_PATH . '/packdir/' . $pro . '/';
		if(!$package->createPath($projectDir, true))
		{
			return "create dir " . $projectDir . ' failed';
		}
		$tarFile = $target . '.tar.gz';
		$gzip = new Codegzip(CODE_PATH . './' . $target . '/', $projectDir . $tarFile);
		$gzip->createGzFile();
		$package->rrmdir(CODE_PATH . '/' . $target);
		return true;
	}

	public static function packageList()
	{
		$data = array();
		try
		{
			$pro = trim($_POST['pro']);
			$vids = trim($_POST['vids']);
			$data['res'] = 0;
			if(!is_numeric($pro) || empty($vids))
			{
				$data['msg'] = '创建项目SQL执行失败';
			}
			else
			{
				global $wpdb;
				$proInfo = $wpdb->get_row("select p_vcspath,p_user,p_pass from wp_c2_project where p_status=1 and p_id=" . $pro);
				if(!$proInfo)
				{
					$data['msg'] = '不存在的项目';
				}
				else
				{
					$data['res'] = 1;
					$version = explode('|', $vids);
					$svn = new CodeSvnLib($proInfo->p_user, $proInfo->p_pass, $proInfo->p_vcspath, $version);
					$file = $svn->getLogFile();
					$package = new CodePackageLib($file, CODE_PATH . '/test');
					$okFileList = $package->getUniqueFile();
					$SvnPrefixPath = $svn->getSvnPrefixPath($okFileList);
					$okFile = array();
					foreach($okFileList as $k => $v)
					{
						$okFile[$v['rev']][] = array('a' => $v['action'], 'f' => str_replace($SvnPrefixPath, '', $k));
					}
					unset($file);
					$data['logs'] = $okFile;
					$data['lastVersion'] = $wpdb->get_var("select r_no from wp_c2_revision where p_id=" . $pro . " order by r_id desc limit 1");
				}
			}
		}
		catch(Exception $e)
		{
			$data['res'] = 0;
			$data['msg'] = $e->getMessage();
		}
		echo json_encode($data);
		exit;
	}

	public static function changeProject()
	{
		$checkboxs = $_POST['checkboxs'];
		$status = intval($_POST['status']);
		$checkboxs = str_replace('|', ',', $checkboxs);
		global $wpdb;
		$sql = "update wp_c2_project set p_status ='" . $status . "' where p_id in('" . $checkboxs . "')";
		$data = array('res' => 1);
		if(false === $wpdb->query($sql))
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败' . $sql;
		}
		echo json_encode($data);
		exit;
	}

	public static function changeServer()
	{
		$checkboxs = $_POST['checkboxs'];
		$status = intval($_POST['status']);
		$checkboxs = str_replace('|', ',', $checkboxs);
		global $wpdb;
		$sql = "update wp_c2_server set s_status ='" . $status . "' where s_id in('" . $checkboxs . "')";
		$data = array('res' => 1);
		if(false === $wpdb->query($sql))
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败' . $sql;
		}
		echo json_encode($data);
		exit;
	}

	public static function updateServer()
	{
		$name = $_POST['name'];
		$id = $_POST['id'];
		$val = $_POST['val'];
		global $wpdb;
		$sql = "update wp_c2_server set s_" . $name . " ='" . $val . "' where s_id=" . intval($id);
		$data = array('res' => 1);
		if(!$wpdb->query($sql))
		{
			$data['res'] = 0;
			$data['msg'] = '更新SQL执行失败';
		}
		echo json_encode($data);
		exit;
	}

	public static function createServer()
	{
		$spath = $_POST['spath'];
		$suser = $_POST['suser'];
		$spass = $_POST['spass'];
		$svpn = isset($_POST['svpn']) ? trim($_POST['svpn']) : '';
		$vpnname = isset($_POST['vpnname']) ? trim($_POST['vpnname']) : '';
		$vpnpass = isset($_POST['vpnpass']) ? trim($_POST['vpnpass']) : '';
		global $wpdb;
		$data = array('res' => 1);
		if($wpdb->get_var("select s_id from wp_c2_server where s_host='".$spath."'")){
			$data['res'] = 0;
			$data['msg'] = '服务器'.$spath."已经存在!";
		}
		else{
			$sql = "insert into wp_c2_server(s_host,s_user,s_pass,s_vpn,s_vpnuser,s_vpnpass,s_vpnpro,s_status,s_cdateline)values(
				'" . $spath . "','" . $suser . "','" . $spass . "','" . $svpn . "','" . $vpnname . "','" . $vpnpass . "',1,1,'" . time() . "')";
			if(!$wpdb->query($sql))
			{
				$data['res'] = 0;
				$data['msg'] = '创建服务器SQL执行失败';
			}
		}
		echo json_encode($data);
		exit;
	}

	private static function showMsg($msg, $result = 0, array $data = array())
	{
		$data['res'] = $result;
		$data['msg'] = $msg;
		echo json_encode($data);
		exit;
	}
}

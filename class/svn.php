<?php
class CodeSvnLib
{
	private $svnPath;
	private $svnVersion;
	private $localPath;

	function __construct($username, $password, $path, $version)
	{
		$this->svnPath = $path;
		$this->svnVersion = $version;
		svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $username);
		svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $password);
		svn_auth_set_parameter(PHP_SVN_AUTH_PARAM_IGNORE_SSL_VERIFY_ERRORS, true); // <--- Important for certificate issues!
		svn_auth_set_parameter(SVN_AUTH_PARAM_NON_INTERACTIVE, true);
		svn_auth_set_parameter(SVN_AUTH_PARAM_NO_AUTH_CACHE, true);
	}

	public function checkout()
	{
		$this->localPath = mt_rand(100000, 999999);
		setlocale(LC_ALL, 'zh_CN.UTF-8');
		return svn_checkout($this->svnPath, CODE_PATH . $this->localPath);
	}

	public function getCheckoutPath()
	{
		return $this->localPath;
	}

	public function getLogFile()
	{
		$fileArr = array();
		if(is_array($this->svnVersion))
		{
			foreach($this->svnVersion as $v)
			{
				$result = svn_log($this->svnPath, $v);
				if(is_array($result))
				{
					$fileArr[] = $result;
				}
			}
		}
		if($fileArr)
		{
			arsort($fileArr);
		}
		return $fileArr;
	}

	public function getSvnPrefixPath($okFileList)
	{
		$oneFilePath = array_keys($okFileList);
		$oneFilePath = $oneFilePath[0];
		$svnArr = explode('/', $this->svnPath);
		$fileArr = explode('/', $oneFilePath);
		return '/' . implode('/', array_filter(array_intersect($svnArr, $fileArr)));
	}

	public function export($formFile, $toFile, $version)
	{
		return svn_export(CODE_PATH . $this->localPath . '/' . $formFile, $toFile, false, $version);
	}
}

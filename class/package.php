<?php
class CodePackageLib
{
	private $fileInfo;
	private $packname;
	private $targetPath;
	private $okFileInfo;

	function __construct($fileInfo, $target)
	{
		$this->fileInfo = $fileInfo;
		$this->targetPath = $target;
	}

	public function getUniqueFile()
	{
		$uniqueFile = array();
		foreach($this->fileInfo as $v)
		{
			$action = 'M';
			foreach($v[0]['paths'] as $p)
			{
				if(!isset($uniqueFile[$p['path']]))
				{
					$uniqueFile[$p['path']] = array('rev' => $v[0]['rev'], 'action' => $p['action']);
				}
			}
		}
		$this->okFileInfo = $uniqueFile;
		return $uniqueFile;
	}

	public function rrmdir($dir)
	{
		if(is_dir($dir))
		{
			$objects = scandir($dir);
			foreach($objects as $object)
			{
				if($object != "." && $object != "..")
				{
					if(filetype($dir . "/" . $object) == "dir")
					{
						$this->rrmdir($dir . "/" . $object);
					}
					else
					{
						unlink($dir . "/" . $object);
					}
				}
			}
			reset($objects);
			rmdir($dir);
		}
	}

	public function createSendPackage($okFileList)
	{
		$this->createPath($this->targetPath . '/bin/', true);
		$this->createPath($this->targetPath . '/backup/', true);
		return $this->createPackageInfo($okFileList);
	}

	private function createPackageInfo($okFileList)
	{
		$data = "";
		foreach($okFileList as $k => $v)
		{
			$infoArr = explode('::', $v);
			$action = $infoArr[1];
			$action = $action == 'G' ?'M' :$action;
			$data .= $action . '::' . $infoArr[2] . PHP_EOL;
		}
		return file_put_contents($this->targetPath . '/bin/files.log', $data);
	}

	public function createPath($path, $isPath = FALSE)
	{
		if(false == $isPath)
		{
			$pathInfo = pathinfo($path);
			$path = $pathInfo['dirname'];
			unset($pathInfo);
		}
		if(!file_exists($path))
		{
			if(!mkdir($path, 0777, true))
			{
				return false;
			}
		}
		return true;
	}
}

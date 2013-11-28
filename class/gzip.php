<?php
class Codegzip
{
	private $fileName;
	private $filePath;

	function __construct($filePath, $fileName)
	{
		$this->fileName = $fileName;
		$this->filePath = $filePath;
	}

	public function createGzFile($rootPath = FALSE)
	{
		require_once 'Archive/Tar.php';
		$tar = new Archive_Tar($this->fileName, 'gz');
		$rootPath = $rootPath === false ? $this->filePath : $rootPath;
		$result = $tar->addModify($this->filePath, './', $rootPath);
		if(!$result)
		{
			throw new Exception(error_get_last());
		}
		return true;
	}
}

<?php
class CodeSshLib
{
	private $host;
	private $port;
	private $user;
	private $pwd;
	private $conn;

	function __construct($host, $user, $pwd, $port = 22)
	{
		$this->host = $host;
		$this->port = $port;
		$this->user = $user;
		$this->pwd = $pwd;
	}

	public function connection()
	{
		if(stripos($this->host, ':'))
		{
			$hostInfo = explode(':', $this->host);
			$this->host = $hostInfo[0];
			$this->port = $hostInfo[1];
		}
		$this->conn = ssh2_connect($this->host, $this->port);
		if(!$this->conn)
		{
			throw new Exception('connection to ' . $this->host . ':' . $this->port . ' failed');
		}
		return ssh2_auth_password($this->conn, $this->user, $this->pwd);
	}

	public function sendFile($localFile, $target)
	{
		return ssh2_scp_send($this->conn, $localFile, $target, 0644);
	}

	public function execCommand($cmd)
	{
		$stream = ssh2_exec($this->conn, $cmd);
		if(false === $stream)
		{
			throw new Exception('exec command ' . $cmd . ' failed');
		}
		$errorStream = ssh2_fetch_stream($stream, SSH2_STREAM_STDERR);
		stream_set_blocking($errorStream, true);
		stream_set_blocking($stream, true);
		$result = array('msg' => stream_get_contents($stream), 'error' => stream_get_contents($errorStream));
		fclose($errorStream);
		fclose($stream);
		return $result;
	}

}

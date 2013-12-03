#!/bin/env python
#!-*-coding:utf-8-*-
import os
import sys
FILELOG = 'files.log'
PRESHELL = 'pre.sh'
class RollBack:
	def __init__(self):
		self.verNo = sys.argv[1]
		self.relDir = sys.argv[2]
		self.wwwDir = sys.argv[3]
		#解压压缩包
		os.system('mkdir -p %s/%s' % (self.relDir, self.verNo))
		os.system('tar zxvf %s/%s.tar.gz -C %s/%s' % (self.relDir, self.verNo, self.relDir, self.verNo))
		self.curSource = self.relDir + '/' + self.verNo + '/source'
		self.curBackup = self.relDir + '/' + self.verNo + '/backup'
		self.curBin = self.relDir + '/' + self.verNo + '/bin'
		#预发布前执行的脚本
		if os.path.isfile(self.curBin + '/' + PRESHELL):
			os.system('/bin/bash %s/%s' % (self.curBin, PRESHELL))

		self.binFile = self.curBin + '/' + FILELOG
		self.lines = []
		if os.path.isfile(self.binFile):
			log = open(self.binFile, 'r')
			self.logLine = log.readlines()
			log.close()
			if len(self.logLine) > 0:
				for line in self.logLine:
					lines = line.strip('\n').split('::')
					self.lines.append([lines[0], lines[1]])

	def rollBack(self):
		'''回滚该版本'''
		if len(self.lines) > 0:
			for line in self.lines:
				if line[0] == 'A':
					os.system('rm -rf %s/%s' % (self.wwwDir, line[1]))
				else:
					os.system('cp -rf %s/%s %s/%s' % (self.curBackup, line[1], self.wwwDir, line[1]))
			return True
		else:
			return False

	def clear(self):
		'''重新打包已经备份的文件和发布的文件'''
		os.system('rm -rf %s/%s.tar.gz' % (self.relDir, self.verNo))
		os.system('tar zcvf %s/%s.tar.gz -C %s/%s ./' % (self.relDir, self.verNo, self.relDir, self.verNo))
		os.system('rm -rf %s/%s' % (self.relDir, self.verNo))
		return True

def usage():
	print 'Usage:python rollback.py 2.0.15.r8888 /data/server/a0b923820dcc509a /data/wwwV2'
	print 'Usage:python rollback.py "3.0.16.r1888 2.0.15.r8888" /data/server/a0b923820dcc509a /data/wwwV2'

def main():
	pass

if __name__ == '__main__':
	if len(sys.argv) < 4:
		usage()
		sys.exit(2)

	rb = RollBack()
	if rb.rollBack() == False:
		print 'log文件不存在，备份失败'
		sys.exit(2)

	print '版本%s回滚成功' % sys.argv[1]
	rb.clear()

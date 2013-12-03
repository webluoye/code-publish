#!/bin/env python
#!-*-coding:utf-8-*-
import os
import sys
FILELOG = 'files.log'
PRESHELL = 'pre.sh'
class Server:
	def __init__(self, verNo, relDir, wwwDir):
		self.verNo = verNo
		self.relDir = relDir
		self.wwwDir = wwwDir
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

	def backup(self):
		'''发布前备份'''
		if len(self.lines) > 0:
			for line in self.lines:
				if line[0] != 'A':
					lineDir = line[1][0:line[1].rindex('/')]
					if line[0] == 'D' and os.path.isdir('%s/%s' % (self.wwwDir, line[1])):
						os.system('mkdir -p %s/%s' % (self.curBackup, line[1]))

					if os.path.isdir('%s/%s' % (self.curBackup, lineDir)) is False:
						os.system('mkdir -p %s/%s' % (self.curBackup, lineDir))

					if os.path.isfile('%s/%s' % (self.wwwDir, line[1])):
						os.system('cp %s/%s %s/%s' % (self.wwwDir, line[1], self.curBackup, line[1]))

			return True
		else:
			return False

	def release(self):
		'''开始发布'''
		if len(self.lines) > 0:
			for line in self.lines:
				if line[0] != 'D':
					lineDir = line[1][0:line[1].rindex('/')]
					if os.path.isdir('%s/%s' % (self.wwwDir, lineDir)) is False:
						os.system('mkdir -p %s/%s' % (self.wwwDir, lineDir))

					if os.path.isfile('%s/%s' % (self.curSource, line[1])):
						os.system('cp %s/%s %s/%s' % (self.curSource, line[1], self.wwwDir, line[1]))
				else:
					if os.path.isdir('%s/%s' % (self.wwwDir, line[1]) or os.path.isfile('%s/%s' % (self.wwwDir, line[1]) or os.path.isfile())):
						os.system('rm -rf %s/%s' % (self.wwwDir, line[1]))

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
	print 'Usage:python release.py 2.0.15.r8888 /data/server/a0b923820dcc509a /data/wwwV2'
	print 'Usage:python release.py "2.0.15.r8888 20111221" /data/server/a0b923820dcc509a /data/wwwV2'

def main():
	if len(sys.argv) < 4:
		usage()
		sys.exit(2)

	for verNo in sys.argv[1].split(' '):
		ser = Server(verNo, sys.argv[2], sys.argv[3])

		print '发布<b>%s</b>版本前备份文件...' % verNo
		if ser.backup() == False:
			print '[ERROR]log文件不存在，<b>%s</b>版本备份失败，将停止整个发布过程，请检查' % verNo
			sys.exit(2)

		print '开始发布<b>%s</b>版本...' % verNo
		if ser.release() == False:
			print '[ERROR]发布<b>%s</b>失败，将停止整个发布过程，请检查' % verNo
			sys.exit(2)
		print '发布后清理...'
		ser.clear()
		print '<b>%s</b>版本发布成功' % verNo


if __name__ == '__main__':
	main()

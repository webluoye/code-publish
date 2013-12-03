#!/bin/env python
#!-*-coding:utf-8-*-
import os
import sys

def usage():
	print 'Usage:python release.py 2.0.15.r8888  /data/wwwV2'
	print 'Usage:python checkTar.py 2.0.15.r8888 /data/server/a0b923820dcc509a'
	print 'Usage:python checkTar.py "2.0.15.r8888 20111221" /data/server/a0b923820dcc509a'

def main():
	if len(sys.argv) < 3:
		usage()
		sys.exit(2)

	for verNo in sys.argv[1].split(' '):
		if os.path.exists('%s/%s.tar.gz' % (sys.argv[2], verNo)):
			print '检查版本%s对应的备份包存在' % verNo
		else:
			print '[ERROR]检查版本<b>%s</b>对应的备份包不存在，请检查' % verNo

if __name__ == '__main__':
	main()

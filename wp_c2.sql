-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.8 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL version:             7.0.0.4053
-- Date/time:                    2013-11-09 21:14:33
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- Dumping structure for table wordpress6.wp_c2_admin
CREATE TABLE IF NOT EXISTS `wp_c2_admin` (
  `adm_id` int(11) NOT NULL AUTO_INCREMENT,
  `adm_user` varchar(30) NOT NULL,
  `adm_pass` char(32) NOT NULL,
  `adm_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-可用，2-禁用',
  `adm_dateline` int(11) NOT NULL,
  `adm_auth` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1-总管理员 0-一般使用者',
  PRIMARY KEY (`adm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_files
CREATE TABLE IF NOT EXISTS `wp_c2_files` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `r_id` int(11) DEFAULT NULL,
  `f_action` char(1) NOT NULL,
  `f_path` varchar(250) NOT NULL,
  `f_ver` varchar(10) NOT NULL,
  PRIMARY KEY (`f_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_log
CREATE TABLE IF NOT EXISTS `wp_c2_log` (
  `h_id` int(11) NOT NULL AUTO_INCREMENT,
  `r_no` varchar(30) NOT NULL,
  `s_id` int(11) DEFAULT NULL,
  `r_id` int(11) DEFAULT NULL,
  `s_name` varchar(30) NOT NULL,
  `r_dateline` int(11) NOT NULL,
  PRIMARY KEY (`h_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_project
CREATE TABLE IF NOT EXISTS `wp_c2_project` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_name` varchar(20) NOT NULL,
  `p_vcspath` varchar(120) NOT NULL COMMENT 'svn、git等',
  `p_user` varchar(30) NOT NULL COMMENT '对应的账号',
  `p_pass` varchar(30) NOT NULL COMMENT '对应的密码',
  `p_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1-正常 2-关闭',
  `p_cdateline` int(11) NOT NULL,
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_revision
CREATE TABLE IF NOT EXISTS `wp_c2_revision` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_id` int(11) DEFAULT NULL,
  `r_no` varchar(30) NOT NULL,
  `s_id` int(11) NOT NULL,
  `s_name` varchar(30) NOT NULL,
  `r_dateline` int(11) NOT NULL,
  `r_cdateline` int(11) NOT NULL,
  `r_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1-待发布 2-删除 3-已发布 4-已回滚',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_runtime
CREATE TABLE IF NOT EXISTS `wp_c2_runtime` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_id` int(11) DEFAULT NULL,
  `s_id` int(11) DEFAULT NULL,
  `r_pdir` varchar(255) NOT NULL COMMENT '存放项目对应的物理地址',
  `r_bdir` varchar(255) NOT NULL COMMENT '存放发布时对应的物理地址',
  `r_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1-正常，2-关闭',
  `r_cdateline` int(11) NOT NULL,
  `r_name` varchar(30) NOT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_server
CREATE TABLE IF NOT EXISTS `wp_c2_server` (
  `s_id` int(11) NOT NULL AUTO_INCREMENT,
  `s_host` char(25) NOT NULL,
  `s_user` varchar(30) NOT NULL,
  `s_pass` varchar(30) NOT NULL,
  `s_vpn` char(25) NOT NULL,
  `s_vpnuser` varchar(30) NOT NULL,
  `s_vpnpass` varchar(30) NOT NULL,
  `s_vpnpro` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1-pptp',
  `s_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1-正常，2-关闭',
  `s_cdateline` int(11) NOT NULL,
  PRIMARY KEY (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wordpress6.wp_c2_user_log
CREATE TABLE IF NOT EXISTS `wp_c2_user_log` (
  `l_id` int(11) NOT NULL AUTO_INCREMENT,
  `l_user` varchar(30) NOT NULL,
  `l_time` int(11) NOT NULL,
  `l_project` int(11) NOT NULL,
  `l_version` int(11) NOT NULL,
  `l_server` varchar(30) NOT NULL,
  `l_type` tinyint(4) NOT NULL,
  PRIMARY KEY (`l_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

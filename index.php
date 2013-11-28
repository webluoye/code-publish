<?php
/*
Plugin Name: 代码发布系统
Plugin URI: http://ciphp.com
Description: 代码发布系统 for wordpress
Version: 1.0
Author: zougc
Author URI: http://ciphp.com
 */
define("CODE_URL", plugins_url('', __FILE__));
define("CODE_PATH", plugin_dir_path(__FILE__));
set_time_limit(0);
include_once CODE_PATH . './class/svn.php';
include_once CODE_PATH . './class/package.php';
include_once CODE_PATH . './class/gzip.php';
include_once CODE_PATH . './class/ssh.php';
include_once CODE_PATH . './action.php';
include_once CODE_PATH . './base.php';
include_once CODE_PATH . './lib/commonLib.php';
include_once CODE_PATH . './lib/publishLog.php';
set_error_handler(array('CodeAction', 'handleError'));
add_action("admin_menu", array('CodeAction', 'addMenu'));
add_action('wp_ajax_createServer', array('CodeAction', 'createServer'));
add_action('wp_ajax_updateServer', array('CodeAction', 'updateServer'));
add_action('wp_ajax_changeServer', array('CodeAction', 'changeServer'));
//
add_action('wp_ajax_createProject', array('CodeAction', 'createProject'));
add_action('wp_ajax_changeProject', array('CodeAction', 'changeProject'));
add_action('wp_ajax_packageList', array('CodeAction', 'packageList'));
add_action('wp_ajax_createPackage', array('CodeAction', 'createPackage'));
add_action('wp_ajax_getPackageList', array('CodeAction', 'getPackageList'));
add_action('wp_ajax_optionPackage', array('CodeAction', 'optionPackage'));
add_action('wp_ajax_deletePackage', array('CodeAction', 'deletePackage'));
add_action('wp_ajax_packdetail', array('CodeAction', 'packdetail'));
//
add_action('wp_ajax_initRuntime', array('CodeAction', 'initRuntime'));
add_action('wp_ajax_createRuntime', array('CodeAction', 'createRuntime'));
add_action('wp_ajax_changeRuntime', array('CodeAction', 'changeRuntime'));
add_action('wp_ajax_updateRuntime', array('CodeAction', 'updateRuntime'));
add_action('wp_ajax_getRuntimeList', array('CodeAction', 'getRuntimeList'));

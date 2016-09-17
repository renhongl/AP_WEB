/**
 * 存储所有的静态变量
 * 属于工具类，放在AP中
 */

define([], function() {
    'use strict';
    class Constant {
        
    }

    Constant.WS_SERVER = 'ws://127.0.0.1:9090/'; //lrh.apws.ngrok.cc
    Constant.TEST = false;
    Constant.BASE_SERVER = 'http://127.0.0.1:8080/'; //lrh.ngrok.cc
    Constant.DEFAULT_PAGE = 'login';
    Constant.SKIP_AUTH = true;

    Constant.LOGIN = Constant.BASE_SERVER + 'login';

    return Constant;
});
/**
 *
 Created by zhangzhao on 2017/5/24.
 Email: zhangzhao@gomeplus.com
 */
import test from 'ava';
var randomstring = require("randomstring");
process.env.NODE_ENV='test';
let port=8+randomstring.generate({length: 3,charset: 'numeric'});
process.env.npm_package_config_port=port;
require('../app');
module.exports={test,port};
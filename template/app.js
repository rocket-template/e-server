/**
 * Created by zhangmike on 16/8/8.
 */
var express = require('express');
require('babel-register');
require('babel-polyfill');

var init =  require('./lib/init');

var middlewareCommon = require('./middleCommon/common');
var app = express();
var PORT = process.env.npm_package_config_port || 3355;

middlewareCommon(app);

app.listen(PORT, () =>{
	// init.default(PORT);
});
console.log(`the server is listen on ${PORT}`);
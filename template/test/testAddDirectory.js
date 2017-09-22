/**
 * Created by zhangmike on 16/8/17.
 */
var fs = require('fs');
console.log(fs.existsSync('/Users/zhangmike/test/data'))
if (!fs.existsSync('/Users/zhangmike/test/data')){
	fs.mkdirSync('/Users/zhangmike/test/data');
}
if (!fs.existsSync('/Users/zhangmike/test/data/2016-8-17')){
	fs.mkdirSync('/Users/zhangmike/test/data/2016-8-17/');
}
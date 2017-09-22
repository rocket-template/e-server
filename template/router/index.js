/**
 * Created by zhangmike on 16/8/8.
 */
import {logger,loggerError} from '../lib/log'
import path from 'path';

module.exports = function(Router) {
	Router.all('/', function(req, res) {
		res.redirect('/index');
	});
	Router.get('/index', function (req, res) {
		res.render(path.resolve(__dirname,'../Views/index'), {
			title: '配置页面'
		});
	});

	return Router;
}
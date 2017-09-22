/**
 * Created by zhangmike on 16/8/8.
 */
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var lactate = require('lactate');
var routers = require('../router/routersIndex');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var connect = require('connect');
const favicon = require('express-favicon');
const log4js = require('log4js');
const cors = require('cors');
import {loghttp, loggerError, logger} from '../lib/log';
import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
let env  = argv.env || 'dev';
//logger.info("env....", env, process.env);
let config = require(`../config/config.${env}.json`);
//bind to global var
global.$g        = global.$g || {};
global.$g.config = config;

var dir =  process.cwd();

module.exports = function(app) {
	app.engine('html', ejs.renderFile);
	app.set('view engine', 'html');

    app.use(cors({
        "credentials":true,
        "origin": true
    }));
	app.use(lactate.static(path.join(__dirname, '../public')));
    app.use(lactate.static(dir)); //app public directory
    app.use(lactate.static(__dirname)); //module directory
	app.use('/api/static', lactate.static(path.join(__dirname, '../views')));
    app.use(favicon(__dirname + '/public/favicon.png'));
	app.use(function() {
		var args = arguments;
		var isErr = args[0] instanceof Error;
		if (isErr) {
			args[2].status(500).send(args[0]);
		} else {
			args[2]();
		}
	});

	app.use(cookieParser());

	//parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: false
	}));

    app.set('trust proxy', 1);
	//
	//parse application/json
	app.use(bodyParser.json());

	// Use native promises
    mongoose.Promise = Promise;
	mongoose.connect(config.server_ip);
	const session = require('express-session');
	app.use(cookieSession({
        name: 'athenatags',
        secret: 'athenatags',
        maxAge: 1000*60*60*24*30
	}));
	/*app.use(function(req, res, next) {
	    res.header('Access-Control-Allow-Credentials', true);
	    res.header('Access-Control-Allow-Origin', global.$g.config.withCredential);
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	    next();
	});*/

    app.use(function(req, res, next) {
        res.locals.session = req.session;
        next();
    });

	app.use(log4js.connectLogger(loghttp, {
	    level: log4js.levels.INFO,
        format: ':method :url'
	}));

	routers.forEach(function(router) {
		app.use(router, cors());
	});

	//return error
	app.use(function(err, req, res, next){
        loggerError.error("请求异常：", err);
	    res.end(err);
	});
};
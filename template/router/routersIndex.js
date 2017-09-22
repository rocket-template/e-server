/**
 * Created by zhangmike on 16/8/8.
 */
var express = require('express');
var router = express.Router();
import {apiRouter} from '../module'


(function(...paths){
	paths.forEach((path)=>{
		require(path)(router);
	});
})('./index');

module.exports=[apiRouter,router];
/**
 * Created by zhangmike on 16/8/12.
 */
import {test,port} from '../commonDevEnv';
import request from '../util/request';
import moment from 'moment';
import db from '../../module/dbmodel';
import infoInserMongoDaily from '../../module/lib/schedule/infoInsertMongoDaily';
import jsonFileCreatedDaily from '../../module/lib/schedule/jsonFileCreatedDaily';
import pdfZipCreatedFriday from '../../module/lib/schedule/pdfZipCreatedFriday';
import emailZipFileFriday from '../../module/lib/schedule/emailZipFileFriday';
test('createRule', async (x) => {
	/*let result = await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/createRule`,
		data: { ruleType: 1, ruleName: 'insertMongoDayReport',
			rule:'at 7:00 also at 12:00 also at 16:00 every weekday'}
	});
	 await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/createRule`,
		data: { ruleType: 3, ruleName: 'generateGroupDayReport',
			rule:'at 7:30 also at 12:30 also at 17:30 every weekday'}
	});*/
	/*await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/createRule`,
		data: { ruleType: 2, ruleName: 'generateWeekReportAndSendEmail',
			rule:'at 17:00 on the first sec every 6 day of week'}
	});*/
	await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/createRule`,
		data: { ruleType: 4, ruleName: 'SendReportByEmail',
			rule:'at 17:30 on the first sec every 6 day of week'}
	});
	//console.log(result);
	x.is(1,1);
});

test('findRule', async (x) => {
	let result = await request({
		method:'get',
		url: `http://localhost:${port}/api/schedule/findRule`,
		params: {_id:"57ada9f5039078092b45c24e"}
	});
	//console.log(result.data);
	x.is(1,1);
});

test('executeSchedule', async (x) => {
	let result = await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/executeStartRule`,
		params: {ruleType:1}
	});
	//console.log(result.data);
	x.is(1,1);
});

test('moment', async (x)=> {
	console.log('moment,now...',moment().format('YYYY-MM-DD'))
	console.log('moment,last 5 days', moment().add(-5, 'day').format('YYYY-MM-DD'))
});

/*test.only('insertMongoAndCreateJsonFile', async (x)=> {
	let dailyResult = await request({
		method:'post',
		url: `http://localhost:${port}/api/schedule/testExecuteStartRule`,
		data: {ruleType:1}
	});
	if (dailyResult.data.msg) {
		console.log("每日执行三次的任务启动成功!");
	}
});*/

/*
test.only('pdfZipFileCreateAndSend', async (x)=> {
	await pdfZipCreatedFriday();
	await emailZipFileFriday();
});*/

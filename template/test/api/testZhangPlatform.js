/**
 * Created by zhangmike on 16/8/15.
 */
import {test,port} from '../commonTestEnv';
import request from '../util/request';

test('createPlatform', async (x) => {
	let result = await request({
		method:'post',
		url: `http://localhost:${port}/api/platform/createPlatform`,
		data: {
			urls: ["https://m.gomeplus.com","https://h5.gomeplus.com"]
		}
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

test('findPlatform', async (x) => {
	let result = await request({
		method:'get',
		url: `http://localhost:${port}/api/platform/createPlatform`,
		data: {
			urls: ["https://m.gomeplus.com","https://h5.gomeplus.com"]
		}
	});
	//console.log(result);
	x.is(1,1);
});



/**
 * Created by zhangmike on 16/9/3.
 */
import {test,port} from '../commonTestEnv';
import db from '../../module/dbmodel';

test('create', async (x) => {
	let names = [
		'wanglonghai@gomeplus.com',
		'huangyihai@gomeplus.com',
		'wangchunpeng@gomeplus.com',
		'jiyunpeng@gomeplus.com',
		'fuzhengchun@gomeplus.com',
		'zhaodonghong@gomeplus.com',
		'zhoujun@gomeplus.com',
		'houjiawei@gomeplus.com',
		'lishengyong@gomeplus.com',
		'sunguang@gomeplus.com',
		'zhaoyongzhen@gomeplus.com',
		'luoye@gomeplus.com',
		'liangxiao@gomeplus.com',
		'fuqiang@gomeplus.com',
		'heshengkai@gomeplus.com',
		'zhanghuadong@gomeplus.com',
		'wangzhibo@gomeplus.com',
		'handong@gomeplus.com',
		'guojianing@gomeplus.com',
		'liuchao@gomeplus.com',
		'jiashilong@gomeplus.com',
		'matianye@gomeplus.com',
		'zhantao@gomeplus.com'
	];
	let map = new Map();
	names.forEach(cur=>{
		let m = cur.match(/(\w+)\@/);
		if (m.length > 0 ) {
			map.set(m[1], cur);
		}
	});

	for(let [key,value] of map ) {
		await db.userInfo.$create({
			name: key,
			email:value,
			password: '123456',
			root: false
		})
	}
	/*await db.userInfo.$create({
		name: 'test',
		password: '123456',
		root: false
	})*/
});
import {test,port} from '../commonTestEnv';
import request from '../util/request';
test('index', async (x) => {
	let result = await request({
        url: `http://localhost:${port}/`,
        headers:{
        	'Content-Type' : 'text/html,application/xhtml+xml,application/xml'
        }
    });
    //console.log(result);
    x.is(1,1);
});
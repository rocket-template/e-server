import {test,port} from '../commonTestEnv';
import request from '../util/request';
import {summaryTypes} from '../../config/speedTypes'
test('record', async (x) => {
	let count=0;
	let result
	for(let type of summaryTypes){
		result = await request({
	        url: `http://localhost:${port}/api/record/findByUrl`,
	        params: { url: 'https://m.gomeplus.com',types:['coach.pageSummary']}
	    });
	    console.log(result.data[0].type);
	    console.log(result.data[0].taskid);
	    console.log(result.data[0].url);
	    count++;
	}
    x.is(count,summaryTypes.length);
});

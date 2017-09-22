import {test} from '../commonTestEnv';
import {addSitespeedTask} from '../../module/lib/sitespeed'

test('addSitespeedTask', async (x) => {

	let taskarr=[];
	for(let i=1;i<2;i++){

		taskarr.push(addSitespeedTask({
			url:'https://m.gomeplus.com',
			taskid:i
				}));

	}

	//console.log(taskarr);
	let results=await Promise.all(taskarr);
	x.is(results.length,4);

});

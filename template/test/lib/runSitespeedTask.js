import {test} from '../commonTestEnv';
import {runSitespeedTask} from '../../module/lib/task'

test('runSitespeedTask', async (x) => {

	let taskarr=[];
	for(let i=1;i<5;i++){
		let option={
			taskid:i,
			run:async ()=>{
				console.log(`Now running ${i}!`);
				let result=await runSitespeedTask({url:'https://m.gomeplus.com'});
				return result;
			}
		}
		taskarr.push(addTask(option,'SiteSpeed'));

	}

	//console.log(taskarr);
	let results=await Promise.all(taskarr);
	x.is(results.length/2,4);

});

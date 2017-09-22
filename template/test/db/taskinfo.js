import {test,port} from '../commonTestEnv';
import db from '../../module/dbmodel';

test('create', async (x) => {
    let results = await db.taskInfo.$create({
        url: 'https://m.gomeplus.com'
    });
    console.log(results);
    x.is(1,1);

});
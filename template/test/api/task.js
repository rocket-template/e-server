import {test,port} from '../commonTestEnv';
import request from '../util/request';

test('add', async (x) => {
    let result = [];
    for(let i=0;i<15;i++){
        result.push( request({
            method:'post',
            url: `http://localhost:${port}/api/task/`,
            data: { 
                url: 'https://m.gomeplus.com'
            }
        }).then((res)=>{
            x.not(res.data,null);
            return res;
        }));
        // x.is(result.status,200);
        // x.not(result.data,null);
    }
    let res=await Promise.all(result);
    res.forEach((r)=>{
        x.is(r.status,200);
    });

});

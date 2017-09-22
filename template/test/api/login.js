/**
 *
 Created by zhangzhao on 2017/5/24.
 Email: zhangzhao@gomeplus.com
 */
import {test,port} from '../commonTestEnv';
import request from '../util/request';
import constants from '../../config/constants';
test('login', async (x) => {
    result = await request({
        url: constants.GITAUTH,
        data: {
            form: {
                grant_type: 'password',
                username: 'zhangzhao',
                password: '5285.gome'
            }
        },
        method: 'post'
    });
    console.log(result, JSON.stringify(result));
});
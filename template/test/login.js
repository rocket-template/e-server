/**
 *
 Created by zhangzhao on 2017/5/24.
 Email: zhangzhao@gomeplus.com
 */
let axios = require('axios');
axios.post("http://gitlab.intra.gomeplus.com/oauth/token", {
        grant_type: 'password',
        username: 'zhangzhao',
        password: ''
}).then(function(response){
    console.log(response.data);
});
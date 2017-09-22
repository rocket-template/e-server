'use strict'
import errors   from '../error';
import constant from '../../config/constants';
import msgFormat from '../lib/msgFormat';
import {logger, loggerError} from '../../lib/log';
let conf={
    userid: {
        type: Number
    },
    username: {
       type: String
    },
    name : {
        type     : String
    },
    groupid: {
        type: [],
        default: []
    },
    _status:{
        type     : Number,
        default  : 0
    }
}

let statics={
    $create:async function(option){
        try{
            let userInfo = await this.findOneAndUpdate({
                _status: constant.availableStatus,
                userid: option.userid
            }, option, {
                upsert: true
            });
            return msgFormat('用户插入成功', {
                data: userInfo
            });
        }catch(err){
            loggerError.error('用户插入失败: ', err);
            return errors.format(err);
        }
    },
    $findByUserId:async function(userid){
        return await this.findOne({
            _status: constant.availableStatus,
            userid: userid
        }).then(data=>{
           return data;
        });
    },
    $update: async function(id, data){
        return await this.findOneAndUpdate({
            userid : id
        }, data)
    }
};
module.exports= {conf,statics}

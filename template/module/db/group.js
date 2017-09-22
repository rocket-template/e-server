'use strict'
import errors   from '../error';
import constant from '../../config/constants';
import {logger, loggerError} from '../../lib/log';

let conf = {
    groupname: {
        type: String,
        unique: true
    },
    groupid: {
        type: Number,
        unique: true
    },
    groupdesc: {
        type: String
    },
    _status:{
        type     : Number,
        default  : 0
    }
};

let statics={
    $create:async function(option){
        try{
            let group = await this.findOneAndUpdate({
                _status: constant.availableStatus,
                groupid: option.groupid
            }, option,{
                upsert: true
            });
            return errors.success({
                result: group
            });
        }catch(err){
            loggerError.error('组插入失败:', err);
            return errors.format(err);
        }
    },
    $find:async function(ids){
        return await this.find({
            _status: constant.availableStatus,
            groupid: {$in: ids}
        }).select({
            groupid: 1,
            groupname: 1
        }).then(data=>{
            return data;
        });
    }
};
module.exports= {conf,statics}

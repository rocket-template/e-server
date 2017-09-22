/**
 * Created by zhangmike on 16/8/15.
 */
import errors   from '../error';
import constant from '../../config/constants';
import msgFormat from '../lib/msgFormat';
import {logger, loggerError} from '../../lib/log';

let conf={
	projectname : {
		type     : String,
		required: true
	},
    projectid: {
	   type: Number
    },
	userid : {
		type     : Number
	},
	groupid: {
		type     : Number
	},
	projecturl : {
		type     : String
	},
    projectdesc: {
	    type: String
    },
    projectwithgroup: {
	    type: String
    },
	_status:{
		type     : Number,
		default  : 0
	}
}

let statics={
    $create:async function(options){
        try{
            let projects = await this.insertMany(options);
            return msgFormat('插入成功');
        }catch(err){
            loggerError.error('项目插入失败: ', err);
            return errors.format(err);
        }
    },
    $delete: async function (userId) {
        await this.where({
            _status: constant.availableStatus,
            userid: userId
        }).setOptions({ multi: true }).
            update({
                $set:{
                    _status: constant.deleteStatus
            }}).catch(err=>{
            loggerError.error("删除项目：", err);
            });
    },
    $find: async function(option, flag){
        let queryParam = {
            _status: constant.availableStatus
        };
        queryParam = Object.assign(queryParam, option);
        let handler = {
            one: 'findOne',
            multi: 'find'
        }
        return await this[handler[flag]](queryParam).select({
            userid: 1,
            groupid: 1,
            projectid: 1,
            projectname: 1,
            projectwithgroup: 1,
            projecturl: 1,
            projectdesc: 1,
        }).then(data=>{
            return data;
        }).catch(err=>{
            loggerError.error('查询失败', err);
        })
    }
};
module.exports= {conf,statics}

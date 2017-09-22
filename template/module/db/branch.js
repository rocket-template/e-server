
import mongoose from  'mongoose';
import msgFormat from '../lib/msgFormat';
import count from './common/count';
import paginate from './common/paginate';
import constants from '../../config/constants';
import message from '../../config/message';
import {logger, loggerError} from '../../lib/log';
let conf={
    servername: {
        type: String
    },
    projectid: {
        type : Number
    },
    branchname : {
        type     : String,
        required: true
    },
    portname : {
        type     : Number
    },
    groupid: {
        type     : Number
    },
    branchtype: {
        type: String
    },
    envtype: {
        type: String
    },
    diskpath: {
        type: String
    },
    _status:{
        type     : Number,
        default  : 0
    },
    userid: {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'user'
    }
}

let statics={
    $create:async function(option){
        try{
            let model = this;
            let branch = new model(option);
            return await branch.save().then(data=>{
                logger.info({
                    info: `静态资源服务${data.servername}插入成功，分支名称为${data.branchname}`,
                    userid: data.userid
                });
                return data;
            }).catch(error=>{
                loggerError.error('分支插入失败：',error);
            })
        }catch(err){
            loggerError.error('分支插入失败：',err);
            return msgFormat('分支插入失败', {
                code: message.branch.error.insertCode
            });
        }
    },
    $update: async function(id, data){
        return await this.findOneAndUpdate({
            _id : id
        }, data).then(data=>{
            return data;
        }).catch(err=>{
            loggerError.error('更新分支失败：',err);
           return msgFormat('更新分支失败');
        });
    },
    $delete: async function(id) {
        return await this.findOneAndUpdate({
            _id : id
        }, {
            _status: constants.deleteStatus
        }).then(data=>{
            logger.info({
                info: `静态资源服务${data.servername}删除成功，分支名称为${data.branchname}`,
                userid: data.userid
            });
            return msgFormat('删除静态资源成功');
        }).catch(err=>{
            loggerError.error("删除静态资源失败", err);
            return msgFormat('删除静态资源失败',{
                code: message.branch.error.delCode
            });
        })
    },
    $count: async function(data){
        // todo,增加过滤参数
        //data.filter['user.ID'] = id;
        return count(data, this);
    },
    $paginate:async function(data){
        return paginate(data, this);
    },
    $findById: async function(id) {
        return await this.findById(id).then(data=>{
           return data;
        });
    },
    $insertMany: async function(data) {
        return await this.insertMany(data).then(data=>{
            return data;
        })
    },
    $find: async function(data) {
        data = Object.assign(data, {
            _status: 0
        });
        return await this.find(data).then(d=>{
           return d;
        });
    }
};
module.exports= {conf,statics}

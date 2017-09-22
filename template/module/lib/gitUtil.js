
import {exec} from 'child-process-promise';
import msgFormat from './msgFormat';
import message from '../../config/message';
import {axiosInstance} from './requestutil';
import {logger, loggerError} from '../../lib/log';
import {requestParam} from './requestutil';

export default class GitUtil {
    constructor(config = {}){
        this.options = this.options || {};
        Object.assign(this.options, config);
    }
    clone() {
        let cmd = `git clone -b ${this.options.branchname} ${this.options.projecturl}  ${this.options.diskpath}`;
        console.log('git clone  cmd...', cmd);
        return exec(cmd, {maxBuffer: 1024 * 1024 * 50}).then(data=>{
            logger.info({
                info: `${this.options.branchname} clone成功`
            });
            return msgFormat(message.clone.success);
        }).catch(function (err) {
            loggerError.error('git clone: ', err);
            return msgFormat(message.clone.fail, {
                code: message.clone.code
            });
        });
    }
    pull() {
        let cmd = `cd ${this.options.diskpath} && git pull`;
        return exec(cmd).then(data=>{
            return msgFormat(message.pull.success);
        }).catch(function (err) {
            loggerError.error('git pull: ', err);
            return msgFormat(message.pull.fail, {
                code: message.pull.code
            });
        });
    }
    reClone() {
        let cmd = `rm -rf ${this.options.diskpath}`;
        return exec(cmd).then(data=>{
            return this.clone().then(()=>{
                logger.info({
                    info: `${this.options.branchname} 重新clone成功`
                });
                return msgFormat(data.stdout);
            });
        }).catch(function (err) {
            loggerError.error('git reclone : ', err);
            return msgFormat(message.clone.fail, {
                code: message.clone.code
            });
        });
    }
    async release() {
        let devUrl = `/projects/${this.options.projectid}/repository/branches/develop`;
        return await axiosInstance.get(devUrl, requestParam({})).then(async (data)=>{
            logger.info('release get....');
            let delUrl = `/projects/${this.options.projectid}/repository/branches/release`;
            return await axiosInstance.delete(delUrl, requestParam({})).then(async (data)=>{
                let createUrl = `/projects/${this.options.projectid}/repository/branches?branch_name=release&ref=develop`;
                logger.info('release delete....');
                return await axiosInstance.post(createUrl, {}, requestParam({})).then((data)=>{
                    logger.info('release post...');
                    return msgFormat(message.release.createRelease.success);
                }).catch(err=>{
                    loggerError.error('git release...', err);
                    return msgFormat(message.release.createRelease.fail, {
                        code: message.release.createRelease.code
                    });
                });
            }).catch(err=>{
                loggerError.error('git release...', err);
                return msgFormat(message.release.deleteRelease.fail, {
                    code: message.release.deleteRelease.code
                });
            });
        }).catch(err=>{
            loggerError.error('git release...', err);
            if (err.data.message == "404 Branch Not Found") {
                return msgFormat("404 Branch Not Found");
            }
        });
    }
}
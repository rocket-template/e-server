
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import {exec} from 'child-process-promise';
import db from '../dbmodel';
import {getUserInfo} from '../lib/requestutil';
import GitUtil from '../lib/gitUtil';
import msgFormat from '../lib/msgFormat';
import message from '../../config/message';
import constant from '../../config/constants';
import {logger, loggerError} from '../../lib/log';

var instance = null;
const CDN = 'cdn';
/***
 * 获取 GitUtil 实例
 * @param model
 * @returns {*}
 */
function getInstance(model) {
    if (instance == null) {
        return new GitUtil({
            branchname: model.branchname,
            projecturl: model.projecturl,
            diskpath:   model.diskpath,
            projectid:  model.projectid
        });
    } else {
        return instance;
    }
}

/***
 * 获取项目分支的实际项目目录
 * @param branch
 * @returns {*}
 */
function getPath(branch) {
    return branch.branchtype === CDN ? global.$g.config.project_path + branch.envtype + "cdn/" + global.$g.config.prefix: global.$g.config.feature_path;
}

/***
 * 获取项目的详细路径
 * @param dirPath
 * @param portName
 * @returns {string}
 */
function getProjectPath(dirPath, portName) {
    return `${dirPath}${global.$g.config.prefix}${constant.prefix}${portName}`;
}

/***
 * 创建静态资源服务
 * @param branch
 * @returns {Promise.<*>}
 */
export async function insertBranch(userInfo, branch) {
    try {
        let ops = {
            projectid: branch.projectid,
            branchname: branch.branchname
        };
        if (branch.branchtype === CDN) {
            Object.assign(ops, {
                envtype: branch.envtype
            });
        }
        let exitsBranch = await db.branch.$find(ops, 'one');

        if (!_.isEmpty(exitsBranch)) {
            return new Promise(function (resolve, reject) {
                resolve(msgFormat("该分支已存在", {
                    code: message.branch.error.existCode
                }));
            });
        }

        let project = await db.project.$find({
            projectid: branch.projectid
        }, 'one');

        let dirPath = getPath(branch); // 项目的root路径
        let portName = '',
            diskPath = '',
            absolutePath = '';
        if (branch.branchtype != CDN) {
            portName = await db.dictionary.$getNewPort({
                type: 'NEWPORT',
                name: 'NEWPORT'
            });
            portName = portName.value;
            diskPath = `${constant.prefix}${portName}`;
            absolutePath = getProjectPath(dirPath, portName);
        } else {
            absolutePath = `${dirPath}${branch.servername}`;
        }

        Object.assign(branch, {
            portname: portName,
            projecturl: project.projecturl,
            diskpath: diskPath,
            userid: userInfo._id
        });

        // 插入分支数据
        let p1 = await db.branch.$create(branch);

        Object.assign(branch, {
            diskpath: absolutePath
        });
        // clone到对应目录
        let p2 = await getInstance(branch).clone();

        return await Promise.all([p1, p2]).then(data=>{
            console.log(data);
            if (_.isEmpty(data[0])) {
                db.branch.$delete(data[0]._id);
                return msgFormat(message.clone.fail,{
                    code: message.clone.code
                });
            }

            if (data[1] && data[1].code && data[1].code === 200) {
                return msgFormat(message.clone.success);
            } else {
                db.branch.$delete(data[0]._id);
                return msgFormat(message.clone.fail,{
                    code: message.clone.code
                });
            }
        }).catch(err=>{
            loggerError.error('静态资源服务创建失败：',err);
            return msgFormat(message.clone.fail,{
                code: message.clone.code
            });
        });
    }catch (err){
        logger.error({info:`静态资源服务创建失败：${err}`});
        loggerError.error('静态资源服务创建失败：',err);
        return msgFormat(message.clone.fail, {
            code: message.clone.code
        });
    }
};

/***
 * 更新静态资源服务
 * @param id
 * @returns {Promise.<*|{code, msg, success, fail}>}
 */
export async function updateBranch(id) {
    let branch = await findBranch(id);
    Object.assign(branch, {
       diskpath: getProjectPath(getPath(branch), branch.portname)
    });
    return await getInstance(branch).pull();
};

/****
 * 编辑静态资源服务
 * @param branch
 * @returns {Promise.<*|Promise>}
 */
export async function editBranch(branch) {
    let obj = {
        _id: branch._id,
        branchname: branch.branchname,
        servername: branch.servername,
    }
    let project = await db.project.$find({
        projectid: branch.projectid
    }, 'one');
    let dirPath = getPath(branch);
    branch.diskpath = getProjectPath(dirPath, branch.portname);
    branch.projecturl = project.projecturl;
    await db.branch.$update(branch._id, obj);
    let p = await getInstance(branch).reClone();
    return p;
};

/***
 * 删除静态资源服务
 * @param id
 * @returns {Promise.<*|Promise>}
 */
export async function offLineBranch(id) {
    let result = await db.branch.$delete(id);
    return result;
};

/***
 * 静态资源服务列表
 * @param branch
 * @returns {Promise.<{totalCount: (*|Promise), data: (*|Promise)}>}
 */
export async function queryBranch(branch) {
    Object.assign(branch, {
        status: constant.availableStatus,
        population: {
            userid: {
                select: 'name'
            }
        }
    });
    let result = await db.branch.$paginate(branch);
    let totalCount = await db.branch.$count(branch);
    return {
        code: result.code,
        data : {
            totalCount : totalCount.data.count,
            result: result.data,
            host: constant.host
        }
    };
};

/***
 * 获取单个静态资源服务信息
 * @param id
 * @returns {Promise.<*|Promise>}
 */
export async function findBranch(id) {
    return await db.branch.$findById(id);
};

export async function test(id) {
    return await db.dictionary.$create();
};

export async function insertMany(data) {
    return await db.branch.$insertMany(data);
}

async function processBuild(diskPath, script) {
    let promisesBuild = [];
    logger.info(script);
    for (let b of script) {
        logger.info('processBuild...', b);
        let p = await exec(`cd ${diskPath} && ${b}`).then(data => {
            return true;
        }).catch(err => {
            logger.error('build 出错。。。。', err);
            loggerError.error('build 出错。。。。', err);
            let flag = message.yunbuild.info.some(current=>{
                return err.stdout.includes(current);
            });
            logger.info(flag);
            return flag;
        });
        promisesBuild.push(p);
    };
    return await Promise.all(promisesBuild).then(data=>{
        let result = data.every(d=>{
            return d === true;
        });
        if (result) {
            return msgFormat("云编译成功");
        } else {
            return msgFormat("云编译失败，请查看错误日志", {
                code: message.yunbuild.error.fail.code
            });
        }
    });
}
export async function yunBuild(branch) {
    let diskPath = getProjectPath(getPath(branch), branch.portname)
    // diskPath + '/' + yunbuild.yml
    logger.info('项目路径...', diskPath);
    if (!fs.existsSync(diskPath + constant.YUNBUILD)) {
        return Promise.resolve(msgFormat(message.yunbuild.error.noExits.msg, {
            code: message.yunbuild.error.noExits.code
        }));
    }
    var doc = await yaml.safeLoad(fs.readFileSync(diskPath + constant.YUNBUILD, 'utf8'), {
        json: true
    });
    /*doc['before_script'].forEach((current, index) => {
        shell.exec(`${current}`);
    });*/
    let promiseBuildResult,
        promiseAfterResult;
    try {
        promiseBuildResult = await processBuild(diskPath, doc['build']);
        logger.info('promiseBuildResult...', promiseBuildResult);
        if (doc['after_script'] && doc['after_script'].length > 0 ) {
            if (promiseBuildResult.code === 200) {
                promiseAfterResult = await processBuild(diskPath, doc['after_script']);
                return promiseAfterResult;
            }else {
                return promiseBuildResult;
            }
        } else {
            return promiseBuildResult;
        }
    } catch (err) {
        logger.error('云编译出错。。。', err);
        loggerError.error('云编译出错。。。', err);
    }


}

export async function getFiles(b) {
    let branch = await db.branch.$findById(b.id);
    let dirPath = getPath(branch),
        p = '';
    if (branch.branchtype === CDN) {
        p = `${dirPath}${branch.servername}`;
    } else {
        p = getProjectPath(dirPath, branch.portname);
    }
    logger.info('浏览文件夹，根路径...', p);
    if (!fs.existsSync(p)) {
        return Promise.resolve(msgFormat("文件夹不存在，请联系管理员", {
            code: message.files.error.noProject.code
        }));
    };
    let currentDir = '';
    // 基准目录
    let rootPath = p;
    var query = b.queryPath || '/';
    currentDir = path.join(rootPath, query);
    return new Promise((resolve, reject)=>{
        if (fs.statSync(currentDir).isFile()) {
            let f = fs.readFileSync(currentDir);
            resolve(f.toString());
            return;
        }
        fs.readdir(currentDir, function (err, files) {
            if (err) {
                reject(err);
                throw err;
            }
            var data = [];
            files
                .filter(function (file) {
                    return true;
                }).forEach(function (file) {
                try {
                    //console.log("processing ", file);
                    var isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();
                    if (isDirectory) {
                        data.push({Name: file, IsDirectory: true, Path: path.join(query, file)});
                    } else {
                        var ext = path.extname(file);
                        if(constant.excludes.includes(file)) {
                            console.log("excluding file ", file);
                            return;
                        }
                        data.push({Name: file, Ext: ext, IsDirectory: false, Path: path.join(query, file)});
                    }

                } catch (e) {
                    console.log(e);
                }
            });
            _.sortBy(data, function (f) {
                return f.Name
            });
            resolve(data);
        });
    });
}

export async function insertBatch(userInfo, branch) {
    try {
        let dirPath = getPath(branch);

        let portName = branch.portname;

        Object.assign(branch, {
            portname: portName,
            projecturl: branch.projecturl,
            diskpath: `${constant.prefix}${portName}`,
            userid: userInfo._id
        });

        // 插入分支数据
        let p1 = await db.branch.$create(branch);

        Object.assign(branch, {
            diskpath: getProjectPath(dirPath, portName)
        });
        // clone到对应目录
        let p2 = await getInstance(branch).clone();

        return await Promise.all([p1, p2]).then(data=>{
            return msgFormat(message.clone.success);
        }).catch(err=>{
            return msgFormat(message.clone.fail,{
                code: message.clone.code
            });
        });
    }catch (err){
        logger.error('静态资源服务创建失败：',err);
        loggerError.error('静态资源服务创建失败：',err);
        return msgFormat(message.clone.fail, {
            code: message.clone.code
        });
    }
}
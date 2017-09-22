import axios from 'axios';
import constants from '../../config/constants';
import msgFormat from '../lib/msgFormat';
import {axiosInstance, requestParam} from '../lib/requestutil';
import {insertOrUpdateUser} from '../service/userservice';
import {insertOrUpdateGroup} from '../service/groupservice';
import {insertOrUpdateProject} from '../service/projectservice';
import message from '../../config/message';
import {logger, loggerError} from '../../lib/log';

/***
 * gitlab登录验证
 * @param req
 * @param res
 * @param username
 * @param pwd
 * @param next
 */
function gitLogin (req, res, username, pwd, next) {
    axios.post(constants.GITAUTH, {
        grant_type: 'password',
        username: username,
        password: pwd
    },{
        validateStatus: function (status) {
            return status >= 200 && status < 500; // default
        },
        withCredentials: true
    }).then(async (response)=>{
        try {
            let data = response.data;
            if (data.error) {
                var regFail = new RegExp("invalid_grant", "gim");
                if (regFail.test(data.error)) {
                    res.json(msgFormat('用户没有权限', {
                        code: message.login.error.permission
                    }));
                }
            }else {
                let user = {
                    username: username,
                    access_token: data.access_token
                };
                req.session.userInfo = user;
                req.session.isLogin = true;
                /*req.session.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('session saved');
                });*/
                await syncData(req, res);
                /*await res.json(msgFormat("登录成功",{
                    code: message.login.success,
                    data: user
                }));*/
            }
        }catch (e) {
            loggerError.error("登录失败：:", e);
            res.json(msgFormat("登录失败", {
                code: message.login.error.handleCode
            }));
            next();
        }
    }).catch((error)=>{
        loggerError.error('登录失败：', error);
        res.json(msgFormat("登录失败",{
            code: message.login.error.reqCode
        }));
    });
}

/***
 * 获取当前登录用户所在组信息
 * @param req
 * @param res
 * @returns {Promise.<T>|Promise}
 */
function fetchGroup(req, res) {
    return axiosInstance.get("/groups", requestParam(req)).then((response)=>{
        return response.data;
    }).catch((error)=>{
       console.log(error.data);
    });
}
/***
 * 获取当前登录用户所在组的项目信息
 * @param req
 * @param res
 * @param args
 * @returns {Promise.<Promise.<TResult>|Promise>}
 */
async function fetchProjects(req, res, args = {}) {
    var promises = [];
    for (let id of args.ids){
        let p = await axiosInstance.get(`/groups/${id}/projects`, requestParam(req)).then((response)=>{
            return response.data;
        }).catch((error)=>{
            loggerError.error("fetchProjects:", error.data);
        });
        promises.push(p);
    }
    return await Promise.all(promises).then(values => {
        return values;
    });
}

/***
 * 获取当前登录用户信息
 * @param req
 * @param res
 * @returns {Promise.<T>|Promise}
 */
function fetchUser(req, res) {
    return axiosInstance.get("/user", requestParam(req)).then((response)=>{
        req.session.userInfo = req.session.userInfo || {};
        Object.assign(req.session.userInfo, {
            userId: response.data.id
        });
        logger.info("fetchuser....",req);
        //res.cookie('userInfo',JSON.stringify(req.session.userInfo), { maxAge: 1000 * 60 * 60 *24});
        return response.data;
    }).catch((error)=>{
        loggerError.error("fetchUser:", error);
    });
}

/***
 * 获取当前用户所在组的项目中的项目访问权限
 * @param projectId
 * @returns {Promise.<T>|Promise}
 */
function fetchProjectAccess(req, projectId) {
    return axiosInstance.get(`/projects/${projectId}/members/${req.session.userInfo.userId}`, requestParam(req)).then((response)=>{
        let data = {
            projectid: projectId
        };
        return Object.assign(data, response.data);
    }).catch((error)=>{
        loggerError.error('fetchProjectAccess error...',error);
    });
}

function syncData(req, res) {
    axios.all([fetchUser(req, res), fetchGroup(req, res)])
        .then(axios.spread(function (user, groups) {
            let ids = [];
            groups.forEach(current=>{
                ids.push(current.id);
            });

            // 用户信息入库
            Object.assign(user, {groupids: ids});
            insertOrUpdateUser(user).then(data=>{
                Object.assign(req.session.userInfo, {
                    _id: data.data._id,
                    userId: data.data.userid
                })
            });
            // 组信息入库
            insertOrUpdateGroup(groups);
            return ids;
        })).then(groupids=>{
        fetchProjects(req, res, { ids: groupids }).then(response=>{
            return response;
        }).then(async (projects)=>{
            // let promises = [],
            let  projectMap = new Map();
            for (let project of projects) {
                for (let p of project) {
                    await fetchProjectAccess(req, p.id).then(data=>{
                        // 需要将用户加入项目中称为成员
                        if (data && data.access_level && data.access_level >= 30) {
                            projectMap.set(p.id, p);
                        }
                    });
                }
            }
            // 用户项目信息入库
            let result =  await insertOrUpdateProject(projectMap, {
                userId: req.session.userInfo.userId
            });
            Object.assign(result, {
                data: {
                    userId: req.session.userInfo.userId,
                    username: req.session.userInfo.username,
                    _id: req.session.userInfo._id
                }
            })
            logger.info('用户信息：', result);
            await res.json(result);
        });
    });
}
module.exports = function(Router) {

    Router.post('/login', function(req, res, next) {
        var username = req.body.username,
            pwd = req.body.password;
        gitLogin(req, res, username, pwd, next);
    });

    /***
     * 用户信息同步
     */
    Router.get('/syncuserdata', function(req, res, next) {
        syncData(req, res);
    });


    Router.get('/logout', function (req, res) {
        req.session = null;
        res.json(msgFormat("退出成功"))
    });

    return Router;
}
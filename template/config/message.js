let message = {
    clone: {
        code: 50000,
        success: 'clone成功',
        fail: 'clone失败'
    },
    pull: {
        code: 50001,
        msg: 'pull失败',
        success: 'pull成功',
        fail: 'pull失败'
    },
    release: {
        getDevelop: {
            code: 50002,
            msg: '获取项目develop分支失败',
            success: '查询分支成功',
            fail: '查询分支失败'
        },
        deleteRelease: {
            code: 50003,
            msg: '删除项目release分支失败',
            success: '删除分支成功',
            fail: '删除分支失败'
        },
        createRelease: {
            code: 50004,
            msg: '创建项目release分支失败',
            success: '创建分支成功',
            fail: '创建分支失败'
        }
    },
    login: {
        success: 200,
        error: {
            reqCode: 50005,
            handleCode: 50006,
            permission: 50007
        }
    },
    branch: {
        success: 200,
        error: {
            delCode: 50008,
            existCode: 50012,
            insertCode: 50013
        }
    },
    yunbuild: {
        info: [
            'nothing to commit, working directory clean'
        ],
        error: {
            noExits: {
                msg: '云编译文件不存在',
                code: 50009
            },
            fail: {
                msg: '云编译失败',
                code: 50010
            }
        }
    },
    files: {
        error: {
            noProject: {
                msg: '项目不存在',
                code: 50011
            }
        }
    }
};
export default message;
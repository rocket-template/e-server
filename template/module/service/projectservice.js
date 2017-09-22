
import db from '../dbmodel';
import GitUtil from '../lib/gitUtil';

export async function insertOrUpdateProject(groupProjects, args = {}) {
    let projectArray = [];

    await db.project.$delete(args.userId);

    for (var [id, project] of groupProjects) {
        let model = {
            userid: args.userId,
            groupid: project.namespace.id,
            projectid: id,
            projectname: project.name,
            projectwithgroup: project.name_with_namespace,
            projecturl: project.http_url_to_repo,
            projectdesc: project.description
        }
        projectArray.push(model);
    }

    return await db.project.$create(projectArray);
};

export async function findProjects(userInfo, groupid) {
    return await db.project.$find({
        userid: userInfo.userId,
        groupid: groupid
    }, 'multi');
};

export async function releaseProject(userId, projectid) {
    let git = new GitUtil({
        projectid: projectid,
        userid: userId
    });
    return await git.release().then(data=>{
        console.log('release...',data);
        return data;
    });
};
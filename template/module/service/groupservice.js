
import db from '../dbmodel';
import {getUserInfo} from '../lib/requestutil';

export function insertOrUpdateGroup(group) {
    group.forEach(g=>{
        db.group.$create({
            groupname: g.name,
            groupdesc: g.description,
            groupid: g.id
        });
    });
};

export async function findGroup(userInfo) {
    let user = await db.user.$findByUserId(userInfo.userId);
    return await db.group.$find(user.groupid);
};
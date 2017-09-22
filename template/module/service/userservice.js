
import db from '../dbmodel';

export function insertOrUpdateUser(user) {
    return db.user.$create({
        userid: user.id,
        name: user.name,
        username: user.username,
        groupid: user.groupids
    });
};

export function findUser(user) {

};
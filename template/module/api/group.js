
import {findGroup} from '../service/groupservice';

module.exports = function(Router) {

    Router.get('/', async function(req, res, next){
        try {
            let data = await findGroup(req.session.userInfo);
            res.json({
                data: data
            });
        } catch(err) {
            next(err);
        }
    });

    return Router;
}
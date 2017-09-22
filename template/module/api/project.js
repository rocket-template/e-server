import {findProjects, releaseProject} from '../service/projectservice';

module.exports = function(Router) {

	Router.get('/:id', async function(req, res, next){
	    try {
	    	let result = await findProjects(req.session.userInfo, req.params.id);
	        res.json({
	            data: result
            });
	    } catch(err) {
	    	console.log(err);
	        next(err);
	    }
	});

    Router.get('/release/:id', async function(req, res, next){
        try {
            await releaseProject(req.session.userInfo.userId, req.params.id).then(data=>{
            	// console.log('release...', data);
                res.json(data);
			});
        } catch(err) {
            console.log(err);
            next(err);
        }
    });

	return Router;
}
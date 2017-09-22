/**
 * Created by zhangmike on 16/8/15.
 */
import {insertBranch, editBranch, findBranch, offLineBranch,
        queryBranch, updateBranch, test, insertBatch, yunBuild, getFiles} from '../service/branchservice';
import queue from '../lib/queue';
import mongoose from 'mongoose';

module.exports = function(Router) {

	Router.post('/create', async function(req, res, next){
		try {
		    queue({
		        fun: insertBranch,
                args: [req.session.userInfo, req.body.params]
            }).then((result)=>{
		        // console.log('create branch..', result);
                res.json(result);
            });
			/*let result = await insertBranch(req.query, req.body.params);
			res.json({
			    data: result
            });*/
		} catch(err) {
			next(err);
		}
	});

	Router.put('/edit/:id', async function(req, res, next){
		try {
			let result = await editBranch(req.body.params);
			res.json(result);
		} catch(err) {
			next(err);
		}
	});

    Router.put('/:id', async function(req, res, next){
        try {
            let result = await updateBranch(req.params.id);
            res.json(result);
        } catch(err) {
            next(err);
        }
    });

	Router.delete('/:id', async function(req, res, next){
		try {
			let result = await offLineBranch(req.params.id);
			res.json(result);
		} catch(err) {
			next(err);
		}
	});

	Router.get('/query', async function(req, res, next){
		try {
		    // console.log(req);
		    let param = req.query;
            param.filter = {};
            param.likes = {};
            param.filter['groupid'] = param.groupid;
            if (param.projectid) {
                param.filter['projectid'] = param.projectid;
            }
            if (param.branchtype) {
                param.filter['branchtype'] = param.branchtype;
            }
            if (param.envtype) {
                param.filter['envtype'] = param.envtype;
            }
            if (param.branchname) {
                param.filter['branchname'] = new RegExp(param.branchname, 'i');
            }
            if (param.servername) {
                param.filter['servername'] = new RegExp(param.servername, 'i');
            }
			let result = await queryBranch(param);
			res.json(result);
		} catch(err) {
			next(err);
		}
	});

	Router.get('/find/:id', async function(req, res, next){
		try {
			let result = await findBranch(req.params.id);
			res.json(result);
		} catch(err) {
			next(err);
		}
	});

    Router.get('/test', async function(req, res, next){
        try {
            let result = await test();
            res.json({
                data: result
            });
        } catch(err) {
            next(err);
        }
    });

    /*Router.post('/insertMany', async function(req, res, next){
        try {
            let result = await insertMany(req.body.data);
            res.json({
                data: result
            });
        } catch(err) {
            next(err);
        }
    });*/

    Router.post('/createBatch', async function(req, res, next){
        try {
            // console.log('createBatch...', req);
            queue({
                fun: insertBatch,
                args: [{_id: new mongoose.Types.ObjectId(-1)}, req.body.params]
            }).then((result)=>{
                res.json(result);
            });
        } catch(err) {
            next(err);
        }
    });

    Router.post('/yunbuild', async function(req, res, next){
        try {
            //console.log('yunBuild...', req);
            let result = yunBuild(req.body.params).then(data=>{
                res.json(data);
            });
        } catch(err) {
            next(err);
        }
    });

    Router.get('/files', async function(req, res, next){
        try {
            let result = await getFiles(req.query).then(data=>{
                console.log('files...',data);
                res.json(data);
            });
        } catch(err) {
            next(err);
        }
    });

	return Router;
}
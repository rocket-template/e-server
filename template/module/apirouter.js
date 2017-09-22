import  path from 'path';
import express from 'express';
let apiRouter = express.Router();

import {getDirModule} from './lib/fsutil';

let api=getDirModule(path.join(__dirname,'/api'));

Object.keys(api).forEach((key)=>{
	apiRouter.use(`/api/${key}`,api[key](express.Router()));
});


export default apiRouter;
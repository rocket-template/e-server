import {getDirModule} from './lib/fsutil';
import  path from 'path';
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
const defaultOptions={
	timestamps:{
        createdAt : '_createdAt',
        updatedAt : '_updatedAt'
    },
    versionKey: false
};

let db=getDirModule(path.join(__dirname,'/db'));

Object.keys(db).forEach((key)=>{
	let __schema=new Schema(db[key].conf,db[key].option||defaultOptions);
	__schema.static(db[key].statics);
	db[key]=mongoose.model(key,__schema);
});

export default db;

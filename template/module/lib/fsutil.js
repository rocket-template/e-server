
import  fs from 'fs';
import  path from 'path';

function scanDir(dir,callback){
	let listobj={};
	 fs.readdirSync(dir).forEach((file)=>{
	 	let fullpath=path.join(dir, file);
	 	if(!fs.statSync(fullpath).isDirectory()){
	 		listobj[file.replace(/\.js.*/,'')]=callback(fullpath);
	 	}
	 });
	 return listobj;
}

let getFileList = (dir)=>{
	return scanDir(dir,x=>x);
}

let getDirModule = (dir)=>{
	 return scanDir(dir,path=>require(path));
}

module.exports={getFileList,getDirModule};
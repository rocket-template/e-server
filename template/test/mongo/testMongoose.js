/**
 * Created by zhangmike on 16/8/18.
 */
/**
 * Created by zhangmike on 16/8/18.
 */
import test from 'ava';
require('../../app');
import db from '../../module/dbmodel'
import mongoose from 'mongoose'
test("group", function(){
	var taskIds = [new mongoose.Types.ObjectId("57b6e2e60be137da6f1f5889"),
	new mongoose.Types.ObjectId("57b6e2dd0be137da6f1f5888")];


	try{
		var result = db.speedInfo.aggregate(
			[
				{
				 $match:{
					 taskid:{$in:taskIds},
					 $or: [
						 {
						 type: "coach.summary"
						 },
						 {
						 type: "pagexray.summary"
						 },
						 {
						 type: "browsertime.summary"
						 }
						 ]
					 }
				 },
			 {
			 $group:{
			 _id:{
			 url:"$url"
			 },
			 item:{
			 $push: {
			 type:"$type",
			 data:"$data",
			 timestamp:"$timestamp"
			 }
			 }
			 }
			 }

			]
			,function(err, data){
				console.log(err,data)
			});
	}catch(e){
		console.log(e)
	}
})


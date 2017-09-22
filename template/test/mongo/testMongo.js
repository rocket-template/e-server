/**
 * Created by zhangmike on 16/8/18.
 */

var MongoClient = require('mongodb').MongoClient
		, assert = require('assert');
var ObjectID = require('mongodb').ObjectID
var taskIds = ["57b54148b4d00a1548a7b913"];


// Connection URL
var url = 'mongodb://127.0.0.1:27017/sitespeed';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	console.log("Connected correctly to server");

	function read (fn){
		return new Promise(function(resolve,reject){
			resolve(fn);
		});
	}
	console.log("objectId",new ObjectID("57b576407d854b974b5052f5"))
	var arr = [];
	var v = ["57b576407d854b974b5052f5"];
	v.forEach(function(c){
		arr.push(new ObjectID(c));
	})

	read().then(function(resolve,reject){
		db.collection("speedinfos").aggregate(
				{
					$match:{
						taskid:{$in:arr},
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
		,function(err,data){
					console.log(data)
					return data;
				});
	}).then(function(err,data){
		//console.log(data)
	});
	/*var result = db.collection("speedinfos").aggregate(
			{
				$match:{
					taskid:{$in:[ObjectID("57b576407d854b974b5052f5")]},
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
	/!*,function(err,result){
				console.log("result...",result)
			}*!/).then(function(err,result){
		console.log(result);
	});*/




});
/*try{
 var result = db.speedInfo.aggregate(
 //{$project: {data: 1, url: 1}},
 // group everything by the like and then add each name with that like to
 // the set for the like
 {$match: {
 $or: [
 /!*{
 type: "coach.summary"
 },
 {
 type: "pagexray.summary"
 },*!/
 {
 type: "browsertime.summary"
 }
 ]
 }}
 ,function(err, data){
 console.log(err,data)
 });
 }catch(e){
 console.log(e)
 }*/

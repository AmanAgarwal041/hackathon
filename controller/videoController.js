var os= require('os');
var es = require('../model/getDataOfVideo.js');
videoController = function videoController(req, res, functionName){
	this.req = req;
	this.res = res;
	this.functionName = functionName;
	console.log("time: " + (new Date()));
	console.log("functionName is ", functionName);
	console.log(process.memoryUsage());
	console.log("os.freemem: " + os.freemem() + " os.totalmem: " + os.totalmem());
	this.run();
};
videoController.prototype.run = function(){
	switch(this.functionName){
	case 'getVideoData':
	this.getVideoData(this.req, this.res);
	break;
	default:
	this.res.end();
	break;
	}
};
videoController.prototype.getVideoData = function( req, res){
	var videoid = req.body.videoid || null;
	if(videoid){
			es.getVideoData(videoid , response=>{
				console.log("data at the controller is");
				console.log(JSON.stringify(response));
				response = parseResult(response, finaldata =>{
						res.send(finaldata);
				});
			})
	}
	else{
		res.send("error");
	}
}
var parseResult = function( response , callback)
{
	var finalresponse = JSON.parse(JSON.stringify(response));
	var result = [];
	console.log("shallow copy of the json onject is ");
	console.log(JSON.stringify(finalresponse));
	response.forEach(function(data){
		console.log("data inside the for loop is ", data);
		temp = data['_source'];
		console.log("temp inside the for loop is");
		console.log(JSON.stringify(temp));
		tempflashcarddata = temp.flashcards;
		console.log(JSON.stringify(tempflashcarddata))
		temp['flashcards'] = [];
		tempflashcarddata.split("</b>").forEach(function(flashcard){
			console.log("flashcard",flashcard);
			flashcarddataarray = flashcard.split("**");
			flashcardtempjson = { id : flashcarddataarray[0], time : flashcarddataarray[1], data : flashcarddataarray[2]};
			temp['flashcards'].push(flashcardtempjson);
		});
		tempquestiondata = temp['question'];
		temp['question'] = [];
		tempquestiondata.split(";;").forEach(function(entry){
			tempquestiondataarray = entry.split("**");
			questiontemparray = {id : tempquestiondataarray[0], time: tempquestiondataarray[1], meta: JSON.parse(tempquestiondataarray[2]) };
			temp['question'].push(questiontemparray);
		});
		result.push(temp);
	});
	callback(result);
}
module.exports = videoController;

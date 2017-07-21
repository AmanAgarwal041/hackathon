const elasticsearch = require('elasticsearch');
const constants = require('../classes/constants');
const strings = require('../classes/strings');
const esClient = new elasticsearch.Client({
	host: constants.esUrl,
	requestTimeout: constants.esReqTimeOut,
	// log: 'trace'
});
var searchWithClient = function(sort,callback){
	const params = {
		index : "videoindex",
		type : "videoindex",
		_source: [],
		body: { query: sort },
		from: 0,
		size: 1,
	};
	console.log("params are");
	console.log(JSON.stringify(params));
	esClient.search(params).then(resp => {
		console.log("response data");
		console.log(JSON.stringify(resp));
		const hits = resp.hits.hits;
		callback(hits);
	}, err => {
		console.trace(err.message);
		callback(null, err.message);
	});
}

exports.getVideoData = function(videoid,callback){
	console.log("video id from the method id",videoid);
	var query = { match : { videoid : videoid} };
	searchWithClient( query, hits=>{
			console.log("data from elasticsearch is");
			console.log(JSON.stringify(hits));
			callback(hits);
	});
}

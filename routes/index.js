var express = require('express');
var router = express.Router();
var  videoController = require('../controller/videoController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/getVideoData', function(req, res, next) {
    //res.send("sangam");
    new videoController(req, res, "getVideoData");
});

module.exports = router;

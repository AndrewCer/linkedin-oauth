var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env.MONGOLAB_URI);
var usersCollection = db.get('userInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    usersCollection.findOne({id: req.user.id}, function (err, data) {
      unirest.get('https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)')
        .header('Authorization', 'Bearer ' + data.token)
        .header('x-li-format', 'json')
        .end(function (response) {
          console.log(response.body);
          res.render('index', { profile: response.body, user: data.displayName });
        })
    });
  } else {
    res.render('index', {  });
  }
});

module.exports = router;

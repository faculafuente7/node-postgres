'use strict';
var express = require('express');
var router = express.Router();
//var tweetBank = require('../tweetBank');
var client = require('../db/index')
module.exports = router;

// una función reusable
function respondWithAllTweets(req, res, next) {
  client.query('SELECT * FROM tweets JOIN users ON users.id = tweets.id', function (err, result) {
    if (err) return next(err); // pasa el error a Express
    var tweets = result.rows;
    console.log(tweets)
    res.render('index', { title: 'Tweety.js', tweets: tweets, showForm: true });
  });
}

// function respondSelectedTweet(req, res, next) {
//   client.query('SELECT * FROM tweets JOIN users ON users.id = tweets.id', function (err, result) {
//     if (err) return next(err); // pasa el error a Express
//     var tweets = result.rows;
//     console.log(tweets)
//     res.render('index', { title: 'Tweety.js', tweets: tweets, showForm: true });
//   });
// }



// aca basícamente tratamos a la root view y la tweets view como identica
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);
//router.get('/tweets/:id', respondSelectedTweet)

// página del usuario individual
router.get('/users/:username', function (req, res, next) {
  client.query('SELECT * FROM users INNER JOIN tweets ON users.id = tweets.user_id WHERE users.name = $1', [req.params.username], function (err, result) {
    var tweetsForName = result.rows
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsForName,
      showForm: true,
      username: req.params.username
    });
  })

  // página del tweet individual
  router.get('/tweets/:id', function (req, res, next) {
    client.query('SELECT * FROM users INNER JOIN tweets ON users.id = tweets.user_id WHERE tweets.id = $1', [+req.params.id], function (err, result) {
      console.log(req.params.id)
      var tweets = result.rows
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweets,
      });
    });
  });

  // crear un nuevo tweet
  router.post('/tweets', function (req, res, next) {
    var newTweet = tweetBank.add(req.body.name, req.body.content);
    res.redirect('/');
  });

});
// // reemplazá esta ruta hard-codeada con static routing general en app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });

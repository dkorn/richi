var Twitter = require('twitter');

var config = require('./config');

var client = new Twitter({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token_key: config.accessToken,
  access_token_secret: config.accessTokenSecret
});

client.get('search/tweets', {q: 'trump', count: 3}, function(error, tweets, response) {
   console.log(tweets);
});

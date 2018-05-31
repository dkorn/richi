import React, { Component } from 'react';
import './App.css';
import { InputGroup,
  InputGroupAddon,
  InputGroupDropdown,
  Input,
  Button} from 'reactstrap';

import Twitter from 'twitter';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TweetEmbed from 'react-tweet-embed';
import request from 'superagent';
import GifList from './GifList';


const config = require('./config');
const speak = require('speakeasy-nlp');

var client = new Twitter({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token_key: config.accessToken,
  access_token_secret: config.accessTokenSecret
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: null,
      displayedTweets: null,
      numberOfTweetsToDisplay: 3,
      value: '',
      copied: false,
      loading: true,
      gifs: []
    };

    this.getTweets = this.getTweets.bind(this);
    this.nlp = this.nlp.bind(this);
    this.sortTweets = this.sortTweets.bind(this);
    this.compareByFavourites = this.compareByFavourites.bind(this);
    this.getFavoriteCount = this.getFavoriteCount.bind(this);
    this.loadMoreTweets = this.loadMoreTweets.bind(this);
  }
  getFavoriteCount(tweet) {
    const favoriteCount = tweet.retweeted_status ? tweet.retweeted_status.favorite_count : tweet.favorite_count;
    return favoriteCount;
  }
  compareByFavourites(a, b) {
    const favCountA = this.getFavoriteCount(a);
    const favCountB = this.getFavoriteCount(b);
    if (favCountA < favCountB)
      return 1;
    if (favCountA > favCountB)
      return -1;
    return 0;
  }
  sortTweets(tweets) {
    return tweets.sort(this.compareByFavourites);
  }
  getTweets() {
    client.get('search/tweets', {q: this.state.value, count: 100}, (error, tweets, response) => {
      if (tweets && tweets.statuses) {
        const sortedTweets = this.sortTweets(tweets.statuses);
        this.setState({ tweets: sortedTweets, displayedTweets: sortedTweets.slice(0, this.state.numberOfTweetsToDisplay) });
      }
    });
  }
  nlp(text) {
    const result = speak.classify(text);
    // delete when we're happy w/ the results
    console.log(result);
    if (result.nouns && result.nouns.length) {
      return result.nouns.join(' ').replace(/[.\\\/]+/g, '');
    } else if (result.subject) {
      return result.subject;
    } else {
      return result.tokens.join(' ').replace(/[.\\\/]+/g, '');
    }
  }
  loadMoreTweets() {
    console.log('load more');
    const tweetsNumber = this.state.numberOfTweetsToDisplay + 3;
    this.setState({
      numberOfTweetsToDisplay: tweetsNumber,
      displayedTweets: this.state.tweets.slice(0, tweetsNumber)
    })
  }
  componentDidMount() {
    setTimeout(function() {
      const text = document.getElementById("hidden").value;
      var nlpresult = this.nlp(text);
      this.setState({ value: nlpresult, loading: false });
      var url = `http://api.giphy.com/v1/gifs/search?q=${nlpresult.replace(/\s/g, '+')}&api_key=oICbJ6LMTfwuBvZnhFlX30FNhh7mBsav`;

      request.get(url, (err, res) => {
        console.log(res)
        this.setState({ gifs: res.body.data })
      });
    }.bind(this), 1500);
  }

  render() {
    console.log(this.state.value);
    if (this.state.loading) {
      return ( <div> <img style={{width: 200}} src="spinner.gif" /> <Input ref='hidden' id="hidden" style={{display: 'none'}}></Input></div>)
    }

    return (
      <div className="App">
        <div className="search-line">
          <InputGroup>
            <Input ref='hidden' id="hidden" style={{display: 'none'}}></Input>
            <Input id="input" value={this.state.value} />
            <InputGroupAddon addonType="prepend">
              <Button onClick={this.getTweets}>Search</Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
          { this.state.displayedTweets && <div className="result-list">
            {this.state.displayedTweets.map((tweet) =>
              (<div className="tweet-embed">
                <TweetEmbed id={tweet.id_str} options={{cards: 'hidden' }} />
                <Input value={`<a class="twitter-timeline" href="https://twitter.com/${tweet.user.screen_name}">Tweets by @${tweet.user.screen_name}</a>`} />
                <CopyToClipboard text={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`}>
                  <Button>{`</>`}</Button>
                </CopyToClipboard>
              </div>))}
           <Button onClick={this.loadMoreTweets} color="link">Show more...</Button>
          </div>}
        </div>
        <GifList gifs={this.state.gifs}/>
      </div>
    );
  }
}

export default App;

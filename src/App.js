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
      value: '',
      copied: false,
      loading: true
    };

    this.getTweets = this.getTweets.bind(this);
  }
  getTweets() {
    client.get('search/tweets', {q: this.state.value, count: 3}, (error, tweets, response) => {
      console.log(tweets)
      tweets && tweets.statuses && this.setState({ tweets: tweets.statuses });
    });
  }
  nlp(text) {
    const result = speak.classify(text);
    console.log(result);
    if (result.subject) {
      return result.nouns.join(' ').replace(/[.\\\/]+/g, '');
    } else if (result.subject) {
      return result.subject;
    } else {
      return result.tokens.join(' ').replace(/[.\\\/]+/g, '');
    }
  }
  componentDidMount() {
    console.log('did mount');
    setTimeout(function() {
      const text = document.getElementById("hidden").value;
      console.log('nlp:', this.nlp(text));
      this.setState({ value: this.nlp(text), loading: false });
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
        <div>{generateList(this.state.tweets)}</div>
      </div>
    );
  }
}

const generateList = (tweets) =>
  tweets && (<div className="result-list">
    {tweets.map((tweet) =>
      (<div className="tweet-embed">
        <TweetEmbed id={tweet.id_str} options={{cards: 'hidden' }} />
        <Input value={`<a class="twitter-timeline" href="https://twitter.com/$              {tweet.user.screen_name}">Tweets by @${tweet.user.screen_name}</a>`} />
        <CopyToClipboard text={`<a class="twitter-timeline" href="https://twitter.com/${tweet.user.screen_name}">Tweets by @${tweet.user.screen_name}</a>`}>
          <Button>{`</>`}</Button>
        </CopyToClipboard>
      </div>))}
   <Button color="link">Show more...</Button>
</div>);

export default App;

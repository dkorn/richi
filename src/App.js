import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupDropdown,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import Twitter from 'twitter';
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
      value: ''
    };

    this.getTweets = this.getTweets.bind(this);
  }
  getTweets() {
    client.get('search/tweets', {q: 'trump', count: 3}, (error, tweets, response) => {
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
      this.setState({ value: this.nlp(text) });
    }.bind(this), 1500);
  }

  render() {
    console.log(this.state.value);
    return (
      <div className="App">
        <div className="search-line">
          <InputGroup>
            <Input id="hidden" style={{display: 'none'}}></Input>
            <Input id="input" value={this.state.value} />
            <InputGroupAddon addonType="prepend">
              <Button onClick={this.getTweets}>I'm a button</Button>
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
      (<TweetEmbed id={tweet.id_str} options={{cards: 'hidden' }} />))}
   <Button color="link">Show more...</Button>
</div>);

export default App;

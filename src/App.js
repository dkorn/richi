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
      tweets: null
    };

    this.getTweets = this.getTweets.bind(this);
  }
  getTweets() {
    //client.get('search/tweets', {q: 'trump', count: 3}, (error, tweets, response) => {
    //  console.log(tweets)
    // tweets && tweets.statuses && this.setState({ tweets: tweets.statuses });
  // });
  }

  render() {
    return (
      <div className="App">
        <div className="search-line">
          <InputGroup>
            <Input id="input"/>
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

const generateList = (tweets) => {
  {/*tweets && (<div className="result-list">*/}
  {/*<ul>*/}
    {/*{tweets.map((tweet) => (<li>{tweet.text}</li>))}*/}
  {/*</ul>*/}
  console.log('nihnas lepo')
 return (<div>
   <TweetEmbed id='692527862369357824' />
   <Button color="link">Show more...</Button>
</div>)};

export default App;

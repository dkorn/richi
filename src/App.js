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

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="search-line">
          <InputGroup>
            <InputGroupAddon addonType="prepend"><Button>I'm a button</Button></InputGroupAddon>
            <Input />
          </InputGroup>
        </div>
        <div className="result-list">
          <ul>
            <li>Result</li>
            <li>Result</li>
            <li>Result</li>
            <li>Result</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

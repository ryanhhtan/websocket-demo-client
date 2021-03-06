import React, { Component } from 'react';
import Chat from './component/chat/Chat';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Chat />
      </Provider>
    );
  }
}

export default App;

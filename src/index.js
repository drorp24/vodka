import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux"
import rootReducer from "./redux/reducers/rootReducer"
import asyncRESTCall from './redux/middlewares/asyncRESTCall';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(rootReducer, compose(
    applyMiddleware(asyncRESTCall),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))}>
      <App/>
    </Provider>    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

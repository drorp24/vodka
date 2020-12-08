import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux"
import rootReducer from "./redux/reducers/rootReducer"
import asyncRestCallMiddleware from './redux/middlewares/asyncRestCallMiddleware';
import { use_redux_toolkit } from './configLoader';

let middlewares = compose(applyMiddleware(asyncRestCallMiddleware))
if(use_redux_toolkit){
  middlewares = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(rootReducer, middlewares)}>
      <App/>
    </Provider>    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

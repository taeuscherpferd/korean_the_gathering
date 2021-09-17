import { applyMiddleware, createStore } from 'redux';
import createWebSocketMiddleware from 'redux/middleware/socketio';
import { AppReducer } from 'redux/reducers/appReducer';

export const store = createStore(AppReducer, applyMiddleware(createWebSocketMiddleware));
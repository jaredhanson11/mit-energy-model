import { applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { createLogger } from 'redux-logger';

const middleware = applyMiddleware(apiMiddleware, createLogger());

var configureStore = function(reducer, initialState){
    return createStore(
        reducer,
        initialState,
        middleware
    );
};

export { configureStore };



import { applyMiddleware, createStore, compose } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { createLogger } from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = applyMiddleware(apiMiddleware);

var configureStore = function(reducer, initialState){
    return createStore(
        reducer,
        initialState,
        composeEnhancers(middleware)
    );
};

export { configureStore };

import { applyMiddleware, combineReducers, compose, createStore, } from 'redux';
import {PostsReducer, toggleMenu} from './reducers/PostsReducer';
import { thunk } from 'redux-thunk';
import { AuthReducer } from './reducers/AuthReducer';
import todoReducers from './reducers/Reducers';
import { workflowReducer } from './reducers/WorkflowReducer';
const middleware = applyMiddleware(thunk);

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    sideMenu: toggleMenu,
    posts: PostsReducer,
    auth: AuthReducer,
    todoReducers,
    workflow: workflowReducer,

});


export const store = createStore(reducers, composeEnhancers(middleware));

import { createStore } from 'redux';
import rootReducer from '../reducers';

const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());

export default store;

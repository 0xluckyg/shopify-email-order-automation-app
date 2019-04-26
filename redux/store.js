import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer, routerReducer } from './reducers';

const reducer = combineReducers({ 
    isDirtyReducer, 
    isLoadingReducer, 
    showToastReducer,
    getUserReducer,
    routerReducer
});

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['routerReducer']
}
const middlewares = [thunk];
const persistedReducer = persistReducer(persistConfig, reducer)

export default () => {
    let store = createStore(
        persistedReducer,
        applyMiddleware(...middlewares)
    )
    let persistor = persistStore(store)
    return { store, persistor }
}

//Without redux persist

// import { createStore, applyMiddleware, combineReducers } from 'redux';
// import thunk from 'redux-thunk';
// import { isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer, routerReducer } from './reducers';

// const reducer = combineReducers({ 
//     isDirtyReducer, 
//     isLoadingReducer, 
//     showToastReducer,
//     getUserReducer,
//     routerReducer
// });

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// const store = createStoreWithMiddleware(reducer);

// export default store;
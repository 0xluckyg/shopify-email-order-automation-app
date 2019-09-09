import keys from '../config/keys';
import axios from 'axios';

//Action that shows the status of the top bar save button when user is typing something unsaved.
export const isDirtyAction = (isDirty, onSave) => {    
    return {
        type: keys.IS_DIRTY,
        payload: {isDirty, onSave}
    }
}

//Action that shows the status of the toast after user saves
export const showToastAction = (show, text) => {    
    return {
        type: keys.SHOW_TOAST,
        payload: {show, text}
    }
}

//Action that shows the status of the loading screen
export const isLoadingAction = (isLoading) => {    
    return {
        type: keys.IS_LOADING,
        payload: isLoading
    }
}

//Thunk middleware and action for getting user from the server
export const getUserAction = () => {
    return dispatch => {
        axios.get(process.env.APP_URL + '/get-user')
        .then(res => {
            dispatch(getUserResolveAction(res.data))
        }).catch(err => {
            console.log('Error getting user: ',err)
        })
    }
}

const getUserResolveAction = (user) => {
    return {
        type: keys.SET_USER,
        payload: user
    }
}

export const setUserAction = (user) => {
    return {
        type: keys.SET_USER,
        payload: user
    }
}

export const showPaymentPlanAction = (show, needsUpgrade) => {
    return {
        type: keys.SHOW_PAYMENT_PLAN,
        payload: {show, needsUpgrade}
    }
}

//Action that shows the status of the loading screen
export const routerAction = (route) => {
    return {
        type: keys.ROUTE,
        payload: route
    }
}
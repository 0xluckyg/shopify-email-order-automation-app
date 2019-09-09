import * as keys from '../config/keys';
import template from '../helper/template';

//Reducer that shows the status of the top bar save button when user is typing something unsaved.
export const isDirtyReducer = (state = {}, action) => {
    switch (action.type) {
        case keys.IS_DIRTY:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that shows the status of the toast after user saves
export const showToastReducer = (state = {show:false, text:''}, action) => {
    switch (action.type) {
        case keys.SHOW_TOAST:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that shows the status of the loading screen
export const isLoadingReducer = (state = false, action) => {    
    switch (action.type) {
        case keys.IS_LOADING:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that shows users the payment plans
export const showPaymentPlanReducer = (state = false, action) => {    
    switch (action.type) {
        case keys.SHOW_PAYMENT_PLAN:
            state = action.payload
            return state;        
        default:            
            return state;
    }
}

//Reducer that gets and saves the user
// accessToken: string
// active: boolean
// createdAt: date string
// payment: {accepted: boolean, date: date string}
// shop: string (example.myshopify.com)
// type: string ("shopify")
// updatedAt: date string
// gmail: { googleRefreshToken: String, isActive: Boolean }
export const getUserReducer = (state = {}, action) => {
    switch(action.type) {
        case keys.SET_USER:
            state = action.payload
            return state;
        default:
            return state;
    }
}

//Reducer that routes pages inside frame and navigation
export const routerReducer = (state = 0, action) => {
    switch(action.type) {
        case keys.ROUTE:
            state = action.payload
            return state;
        default:
            return state;
    }
}
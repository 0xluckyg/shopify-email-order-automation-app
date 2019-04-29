import { TopBar } from '@shopify/polaris';
import * as keys from '../config/keys';

//Uses store domain for initial and name
function getInitial(domain) {
    return (domain) ? domain.charAt(0).toUpperCase() : ""
}

function getName(domain) {        
    const arr = (domain) ? domain.split('.') : []
    return (arr.length > 0) ? arr[0].charAt(0).toUpperCase() + arr[0].slice(1) : "Loading"
}

//User avatar and shop name on the right of the top bar.
function UserPrevewMarkup(state, toggleState, router, redirect) {    
        
    const userMenuActions = [
        {
            items: [
                { 
                    content: 'Contact Us', 
                    onAction: () => router(keys.CONTACT_US_INDEX)
                },
                { 
                    content: 'FAQs', 
                    onAction: () => router(keys.FAQ_INDEX)
                },
                {
                    content: 'Leave a Review', 
                    onAction: redirect
                },            
            ],
        },
    ];

    const shopDomain = state.shop
    const name = getName(shopDomain)
    const initials = getInitial(shopDomain)
    return ( 
        <TopBar.UserMenu
            actions={userMenuActions}
            name={name}
            detail= {shopDomain}
            initials={initials}
            open={state.userMenuOpen}
            //Toggle state opens a menu from index file when user clicks on the user profile
            onToggle={toggleState('userMenuOpen')}
        /> 
    )
};

export default UserPrevewMarkup
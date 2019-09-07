import { Navigation } from '@shopify/polaris';
import * as keys from '../config/keys';

//Navigation bar on the left panel. Uses custom made router from index file. 
//Can not use react component because Navigation has to be sent as a prop for frame
function NavigationMarkup(router, payment) {
    return (
        <Navigation location="/">            
            <Navigation.Section                
                title={keys.APP_FULL_NAME}
                items={[
                    {                        
                        label: 'Orders',
                        // icon: 'home',
                        onClick: () => {
                            router(0);                            
                        }
                    },
                    {                        
                        label: 'Email Rules',
                        // icon: 'home',
                        onClick: () => {
                            router(1);                            
                        }
                    },
                    {                        
                        label: 'Add Email Rule',
                        // icon: 'home',
                        onClick: () => {
                            router(2);                            
                        }
                    },
                    {                        
                        label: 'Settings',
                        // icon: 'home',
                        onClick: () => {
                            router(3);                            
                        }
                    },
                    {
                        label: 'Subscription Plans',
                        onClick: () => payment()
                    }
                ]}                
            />
        </Navigation>            
    )
}

export default NavigationMarkup;
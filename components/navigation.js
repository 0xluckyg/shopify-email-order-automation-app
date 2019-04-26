import { Navigation } from '@shopify/polaris';
import * as keys from '../config/keys';

//Navigation bar on the left panel. Uses custom made router from index file. 
//Can not use react component because Navigation has to be sent as a prop for frame
function NavigationMarkup(router) {
    return (
        <Navigation location="/">            
            <Navigation.Section                
                title={keys.APP_FULL_NAME}
                items={[
                    {                        
                        label: 'Navigation Example 1',
                        icon: 'home',
                        onClick: () => {
                            router(0);                            
                        }
                    },
                    {                        
                        label: 'Navigation Example 2',
                        icon: 'orders',
                        onClick: () => {
                            router(1);                            
                        }
                    },
                ]}                
            />
        </Navigation>            
    )
}

export default NavigationMarkup;
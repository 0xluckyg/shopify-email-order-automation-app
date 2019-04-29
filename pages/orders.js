import {     
    Card,         
    Layout, 
} from '@shopify/polaris';
import pageHeader from '../components/page-header'

class Orders extends React.Component {
    constructor(props){
        super(props)        
    }
    render() {
        return (            
            <Layout>                
                <Layout.Section>
                    {pageHeader('Orders')}
                    <Card sectioned>
                        
                    </Card>
                </Layout.Section>
            </Layout>
        )
    }
}

export default Orders;
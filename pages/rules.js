import {     
    Card,         
    Layout, 
} from '@shopify/polaris';
import pageHeader from '../components/page-header'

class Rules extends React.Component {
    constructor(props){
        super(props)        
    }
    render() {
        return (            
            <Layout>
                <Layout.Section>
                    {pageHeader('Rules')}
                    <Card sectioned>
                        
                    </Card>                    
                </Layout.Section>
            </Layout>
        )
    }
}

export default Rules;
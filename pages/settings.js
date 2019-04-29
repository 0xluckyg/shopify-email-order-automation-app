import {     
    Card,         
    Layout, 
    ButtonGroup,
    Button,    
    CalloutCard
} from '@shopify/polaris';
import pageHeader from '../components/page-header'
import GmailCard from '../components/gmail-auth'

class Settings extends React.Component {
    constructor(props){
        super(props)       
        
        this.state = {
            sendMethodManual:true,            
        }
    }
    render() {
        return (            
            <Layout>
                <Layout.Section>
                    {pageHeader('Settings')}
                    <Card sectioned title="Order Method">
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                        <p style={{lineHeight:'35px'}}>Order email send method (Automatic sends once everyday).</p>
                        <ButtonGroup segmented>
                            <Button 
                                disabled={this.state.sendMethodManual}
                                onClick={() => {
                                    this.setState({sendMethodManual:true})
                                }}
                            >
                                Manual
                            </Button>
                            <Button 
                                disabled={!this.state.sendMethodManual}
                                onClick={() => {
                                    this.setState({sendMethodManual:false})
                                }}
                            >
                                Automatic
                            </Button>
                        </ButtonGroup>
                        </div>
                    </Card>
                    <GmailCard/>           
                </Layout.Section>
            </Layout>            
        )
    }
}

export default Settings;
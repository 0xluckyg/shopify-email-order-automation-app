import {     
    Card,         
    Layout, 
    ButtonGroup,
    Button,
    TextField,
    Badge
} from '@shopify/polaris';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction} from '../redux/actions';
import pageHeader from '../components/page-header'
import GmailCard from '../components/gmail-auth'
import keys from '../config/template'

class Settings extends React.Component {
    mounted = false
    constructor(props){
        super(props)       
        
        this.state = {            
            previousTemplateText: keys.TEMPLATE_TEXT,
            templateText: keys.TEMPLATE_TEXT,
            templateTextLoading: false,
            sendMethod: 'manual',  
            sendMethodLoading: false,
        }
    }

    componentDidMount() {
        this.mounted = true      
        axios.get(process.env.APP_URL + '/get-settings')
        .then(res => {            
            if (!this.mounted) return
            if (!res.data.templateText) return this.setState({ sendMethod:res.data.sendMethod.method })
            this.setState({
                previousTemplateText: res.data.templateText,
                templateText: res.data.templateText,
                sendMethod: res.data.sendMethod.method
            })
        }).catch(err => {               
            if (!this.mounted) return            
            this.props.showToastAction(true, "Couldn't get settings. Please try again later.")
        })  
    }

    setEmailTemplate() {
        this.setState({templateTextLoading: true})
        axios.post(process.env.APP_URL + '/email-template', {templateText: this.state.templateText})
        .then(() => {            
            if (!this.mounted) return            
            this.setState({previousTemplateText: this.state.templateText, templateTextLoading: false})
            this.props.showToastAction(true, 'Saved settings!')
        }).catch(() => {   
            if (!this.mounted) return            
            this.setState({templateTextLoading: false})
            this.props.showToastAction(true, "Couldn't save. Please try again later.")
        })   
    }

    setSendMethod(sendMethod) {
        this.setState({sendMethodLoading: true})
        axios.post(process.env.APP_URL + '/send-method', {sendMethod})
        .then(() => {            
            if (!this.mounted) return            
            this.setState({sendMethod, sendMethodLoading: false});
            this.props.showToastAction(true, 'Saved settings!')
        }).catch(() => {   
            if (!this.mounted) return            
            this.setState({sendMethodLoading: false})
            this.props.showToastAction(true, "Couldn't save. Please try again later.")
        })   
    }

    render() {
        return (            
            <Layout>
                <Layout.Section>
                    {pageHeader('Settings')}
                    <Card sectioned title="Email Template">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
                            <div style={{flex:1, margin: '10px'}}>
                                <p style={{}}>
                                    This is the template email per product that will be sent to the email you specify. 
                                    A line will be omitted if the information does not exist. <br/>
                                </p>
                                <p style={{lineHeight:'35px'}}>List of tags you can use:</p>
                                <Badge status="success">{`{{${keys.SHOP}}}`}</Badge>
                                <Badge status="success">{`{{${keys.ORDER_NUMBER}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PROCESSED_AT}}}`}</Badge>
                                <Badge status="success">{`{{${keys.NOTE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.TITLE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.VARIANT_TITLE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.QUANTITY}}}`}</Badge>
                                <Badge status="success">{`{{${keys.SKU}}}`}</Badge>
                                <Badge status="success">{`{{${keys.VENDOR}}}`}</Badge>
                                <Badge status="success">{`{{${keys.GTIN}}}`}</Badge>
                                <Badge status="success">{`{{${keys.GRAMS}}}`}</Badge>
                                <Badge status="success">{`{{${keys.NAME}}}`}</Badge>
                                <Badge status="success">{`{{${keys.EMAIL}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PHONE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.ADDRESS1}}}`}</Badge>
                                <Badge status="success">{`{{${keys.CITY}}}`}</Badge>
                                <Badge status="success">{`{{${keys.ZIP}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PROVINCE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.COUNTRY}}}`}</Badge>
                                <Badge status="success">{`{{${keys.ADDRESS2}}}`}</Badge>
                                <Badge status="success">{`{{${keys.COMPANY}}}`}</Badge>
                                <Badge status="success">{`{{${keys.VARIANT_ID}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PRODUCT_ID}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PRICE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.PRODUCT_TYPE}}}`}</Badge>
                                <Badge status="success">{`{{${keys.TOTAL_TAX}}}`}</Badge>
                            </div>
                            <div style={{flex:1, margin: '10px'}}>
                                <TextField                                    
                                    value={this.state.templateText}
                                    onChange={templateText => this.setState({templateText})}
                                    multiline
                                />
                            </div>
                        </div>
                        <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div style={{marginRight:'20px'}}>
                        <Button 
                            disabled={(this.state.templateText == keys.TEMPLATE_TEXT)}
                            onClick={() => this.setState({templateText:keys.TEMPLATE_TEXT})}
                        >
                            Reset to default
                        </Button>
                        </div>
                        <Button 
                            disabled={(this.state.previousTemplateText == this.state.templateText)}
                            onClick={() => this.setEmailTemplate()}
                            loading={this.state.templateTextLoading}
                        >
                            Save
                        </Button>
                        </div>
                    </Card>                    
                    <Card sectioned title="Order Method">
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                        <p style={{lineHeight:'35px'}}>Order email send method (Automatic sends once everyday).</p>
                        <ButtonGroup segmented>
                            <Button 
                                disabled={(this.state.sendMethod == 'manual')}
                                onClick={() => this.setSendMethod('manual')}
                                loading={this.state.sendMethodLoading}
                            >
                                Manual
                            </Button>
                            <Button 
                                disabled={(this.state.sendMethod == 'automatic')}
                                onClick={() => this.setSendMethod('automatic')}
                                loading={this.state.sendMethodLoading}
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

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Settings);
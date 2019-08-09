import {         
    Card,    
    Button,
    Layout,    
    Badge,
    Collapsible,    
    Spinner
} from '@shopify/polaris';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';
import {createOrderText} from '../config/template'
import NoContent from './no-content'

class EmailPreview extends React.Component {    
    constructor(props){
        super(props)                          
        this.state = {
            isSending: false,
            emailDetail: {},            
            previewTexts: [],
            previewTextsLoading: [],
            headerTemplateText: '',
            orderTemplateText: '',
            productTemplateText: '',
            footerTemplateText: ''
        }
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        const emailDetail = nextProps.detail
        if (emailDetail === prevState.emailDetail 
            || Object.keys(nextProps.detail).length == 0) return ({emailDetail})
        let previewTexts = []; let previewTextsLoading = [];
        Object.keys(emailDetail).map(() => {
            previewTexts.push(false)
            previewTextsLoading.push(false)
        })
        return ({emailDetail, previewTexts, previewTextsLoading})
    }

    async getPreviewText(index, email) {
        let {
            previewTexts, 
            previewTextsLoading, 
            emailDetail, 
            headerTemplateText, 
            orderTemplateText, 
            productTemplateText, 
            footerTemplateText
        } = this.state        
        //If already open
        if (previewTexts[index]) {
            previewTexts[index] = false
            return this.setState({previewTexts})
        }
        let shop = this.props.getUserReducer.shop
        //if tempalte texts are loaded
        if (headerTemplateText != '' && orderTemplateText != '' && productTemplateText != '' && footerTemplateText != '') {
            previewTexts[index] = createOrderText(
                emailDetail[email], 
                shop, 
                headerTemplateText,
                orderTemplateText, 
                productTemplateText,
                footerTemplateText
            )
            return this.setState({previewTexts})
        }
        //if template texts are not loaded
        try {            
            previewTextsLoading[index] = true
            this.setState({previewTextsLoading})
            let res =  await axios.get(process.env.APP_URL + '/get-settings')  
            let {headerTemplateText, orderTemplateText, productTemplateText, footerTemplateText} = res.data
            let previewText = createOrderText(
                emailDetail[email], 
                shop, 
                headerTemplateText, 
                orderTemplateText, 
                productTemplateText, 
                footerTemplateText
            )      
            this.setState(() => {
                previewTextsLoading[index] = false
                if (!previewTexts[index]) {
                    previewTexts[index] = previewText
                } else {
                    previewTexts[index] = false
                }
                return {                     
                    previewTexts,
                    previewTextsLoading,
                    orderTemplateText: res.data.orderTemplateText,
                    productTemplateText: res.data.productTemplateText
                };
            })            
        } catch (err) {            
            this.props.showToastAction(true, "Couldn't get settings. Please try again later.")
        }
    }

    renderEmails(data, key, index) {        
        let orderCount = 0; let productCount = 0;        
        Object.keys(data).map((order) => {                        
            orderCount++
            Object.keys(data[order].items).map(() => { productCount++ })
        })        
        return <Card key={key}>            
            <div style={{width: '90%', margin: '20px', display:"flex", justifyContent: "space-between"}}>                                      
                <div style={{width:"40%"}}><Badge>{key}</Badge></div>
                <div style={{width:"15%"}}>{orderCount} orders</div>
                <div style={{width:"15%"}}>{productCount} products</div>                            
                <div style={{width: "10%"}}>
                    <Button 
                        loading={this.state.previewTextsLoading[index]}
                        onClick={async () => await this.getPreviewText(index, key)} 
                        size="slim">
                        Preview
                    </Button>
                </div>                
            </div>  
            <div style={{width: '90%', margin: '20px', maxHeight:'700px', overflowY: 'auto'}}>
                <Collapsible open={(this.state.previewTexts[index])} id="basic-collapsible">
                    <div style={{whiteSpace: "pre-wrap"}}>
                        {this.state.previewTexts[index]}
                    </div>
                </Collapsible>
            </div>
        </Card>
    };    

    showEmails() {
        return (                               
            <div style={emailPreviewBox}>                             
                {Object.keys(this.state.emailDetail).map((key, index) => {                    
                    if (key) return this.renderEmails(this.state.emailDetail[key], key, index)
                })}
            </div>
            
        )               
    }

    sendEmails() {
        this.setState({isSending: true})
        axios.post(process.env.APP_URL + '/send-orders', {
            orders: this.state.emailDetail
        })
        .then(() => {
            this.props.showToastAction(true, 'Orders sent!')
            this.setState({isSending: false})
            this.props.reload()
        }).catch(err => {
            this.props.showToastAction(true, "Couldn't send. Please Try Again Later.")
            this.setState({isSending: false})
        })
    }

    hasNothingToSend() {
        return (!this.props.loading && Object.keys(this.state.emailDetail).length == 0)
    }

    render() {        
        return(            
            <div style={modalContentStyle}>                    
                <Layout>
                    <Layout.Section>                                                            
                        {(this.props.loading) ? ( 
                            <div>
                                <div style={{width: '650px', display:'flex', justifyContent: 'center'}}>
                                    <div style={{alignSelf: 'center', margin: '100px 100px 50px 100px'}}>
                                        <Spinner size="large" color="teal" /><br/>                                        
                                    </div>
                                </div>
                                <p style={{marginBottom: '20px', textAlign: 'center', fontSize: '20px'}}>
                                    If you have a lot of orders, this may take a while. Please don't close the popup.
                                </p>
                            </div>
                        ) : null }
                        {this.hasNothingToSend() ? ( 
                            <NoContent
                                logo='../static/gmail.svg'
                                text={`No emails to send!`}
                            />
                        ) : null }
                        {this.showEmails()}
                        <div style={finalButtonStyle}>
                            <Button 
                                disabled={this.props.loading || this.hasNothingToSend()} 
                                loading={this.state.isSending} 
                                primary size="large" 
                                onClick={() => this.sendEmails()}
                            >
                                Send Orders
                            </Button>
                        </div>
                    </Layout.Section>
                </Layout>  
            </div>            
        )
    }
}

const modalContentStyle = {
    padding: '30px',
    display: 'flex',
    width: '700px',
    overflowY: 'auto',
    alignItems: "center",
    justifyContent: "center",    
}
const emailPreviewBox = {minWidth: '650px'}
const finalButtonStyle = {float:"right", padding: "16px 0px 16px 0px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailPreview);
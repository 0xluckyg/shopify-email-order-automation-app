import {         
    Card,    
    Button,
    Layout,    
    Badge,
    Collapsible,
    TextContainer,
    Spinner
} from '@shopify/polaris';
import Modal from "react-responsive-modal";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';

//A pop up to ask users to write a review
class EmailPreviewModal extends React.Component {    
    constructor(props){
        super(props)                          
        this.state = {
            emailDetail: {},
            showSpinner: true,
            openPreview: []
        }
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.detail === prevState.emailDetail 
            || Object.keys(nextProps.detail).length == 0) return null
        const emailDetail = nextProps.detail
        let openPreview = [];
        Object.keys(emailDetail).map(() => openPreview.push(false))
        return ({emailDetail, openPreview, showSpinner: false})
    }

    previewText() {
        
    }

    renderEmails(email, key, index) {
        console.log('email: ', email)
        let orderCount = 0; let productCount = 0;        
        Object.keys(email).map((order) => {                        
            orderCount++
            Object.keys(email[order].items).map(() => { productCount++ })
        })        
        return <Card key={key}>            
            <div style={{width: '90%', margin: '20px', display:"flex", justifyContent: "space-between"}}>                                      
                <div style={{width:"40%"}}><Badge>{key}</Badge></div>
                <div style={{width:"15%"}}>{orderCount} orders</div>
                <div style={{width:"15%"}}>{productCount} products</div>                            
                <div style={{width: "10%"}}>
                    <Button 
                        onClick={() =>
                            this.setState((state) => {
                                let openPreview = state.openPreview
                                openPreview[index] = !openPreview[index];                                
                                return { openPreview };
                            })
                        } 
                        size="slim">
                        Preview
                    </Button>
                </div>                
            </div>  
            <div style={{width: '90%', margin: '20px', maxHeight:'700px', overflowY: 'auto'}}>
                <Collapsible open={this.state.openPreview[index]} id="basic-collapsible">
                    <TextContainer>
                       
                    </TextContainer>
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

    render() {        
        return(
            <Modal 
                open={this.props.open}                
                onClose={this.props.close}
                showCloseIcon={true}
                center
            >
                <div style={modalContentStyle}>                    
                    <Layout>
                        <Layout.Section>       
                            {(this.state.showSpinner) ? <Spinner size="large" color="teal" /> : null}                                                 
                            {this.showEmails()}                            
                            <div style={finalButtonStyle}>
                                <Button primary size="large" onClick={() => {}}>Send Orders</Button>
                            </div>
                        </Layout.Section>  
                    </Layout>  
                </div>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailPreviewModal);
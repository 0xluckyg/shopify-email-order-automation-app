import {         
    ResourceList,    
    Card,    
    Button,
    Layout,    
    Tag,
    TextField
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
            emailDetail: {}
        }
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.detail === prevState.emailDetail 
            || Object.keys(nextProps.detail).length == 0) return null                              
        return ({emailDetail: nextProps.detail})
    }

    renderEmails = () => {             
        if (Object.keys(nextProps.detail).length == 0) return
        for (key in this.state.emailDetail) {
            console.log('key: ', key)
            if (key) return <Card>{key}</Card>
        }
    };    

    showEmails() {        
        return (
            <Card>                         
                <div style={productSelectBoxStyle}>
                <Card>                
                    {
                        this.renderEmails()
                    }
                </Card>
                </div>
            </Card>
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
const productSelectBoxStyle = {minWidth: '650px'}
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
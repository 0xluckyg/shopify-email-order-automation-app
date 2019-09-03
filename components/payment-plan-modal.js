import {         
    ButtonGroup,
    Button,    
} from '@shopify/polaris';
import {connect} from 'react-redux';
import Modal from "react-responsive-modal";
import Cookies from 'js-cookie'
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import * as keys from '../config/keys';

//A pop up to ask users to write a review
class ReviewModal extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            isOpen: true
        }
    }

    // This line is very important! It tells React to attach the `polaris`
    // object to `this.context` within your component.
    static contextTypes = {
        polaris: PropTypes.object
    };
    
    renderPaymentCard(planName, planPricing, options) {
        return (
            <div style={paymentCardStyle}>
                <p style={planNameStyle}>{planName}</p>
                <h1 style={planPricingStyle}>{planPricing}</h1>
                <p style={planPricingSubtextStyle}>per month</p>
                <hr/>
                <div style={planOptionsContainerStyle}>
                 {options}
                 </div>
                 <div style={planButtonContainerStyle}>
                    <Button primary>Try Free</Button>
                 </div>
            </div>
        )
    }

    render() {
        return(
            <Modal 
                open={this.state.isOpen} 
                onClose={() => {                    
                    this.setState({isOpen:false})
                }} 
                showCloseIcon={true}
                center                
            >
                <div style={modalContentStyle}>
                    {
                        this.renderPaymentCard("COMPLIANCE", "$14.95", 
                        <ul>
                            <li>Option 1</li>
                            <li>Option 2</li>
                            <li>Option 3</li>
                        </ul>)
                    }
                    {
                        this.renderPaymentCard("PREMIUM", "$49.95", 
                        <ul>
                            <li>Option 1</li>
                            <li>Option 2</li>
                            <li>Option 3</li>
                        </ul>)
                    }
                    {
                        this.renderPaymentCard("ENTERPRISE", "$99.95", 
                        <ul>
                            <li>Option 1</li>
                            <li>Option 2</li>
                            <li>Option 3</li>
                        </ul>)
                    }
                </div>
            </Modal>
        )
    }
}

//We need the user from the reducer to get install date
function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

const paymentCardStyle = {
    padding: 20
}

const planNameStyle = {
    textAlign: "center",
    fontSize: 25,
    paddingBottom: 20
}

const planPricingStyle = {
    textAlign: "center",
    fontSize: 40,    
    paddingBottom: 10
}

const planPricingSubtextStyle = {
    textAlign: "center",
    fontSize: 8,
    paddingBottom: 20,
}

const planOptionsContainerStyle = {
    padding: 15
}

const planOptionsTextStyle = {
    fontSize: 12
}

const planButtonStyle = {
    padding: 15
}

const planButtonContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
}

const modalContentStyle = {
    padding: 10,
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'auto',
    alignItems: "center",
    justifyContent: "center",    
}

export default connect(mapStateToProps, null)(ReviewModal);
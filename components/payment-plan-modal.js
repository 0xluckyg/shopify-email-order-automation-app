import {         
    ButtonGroup,
    Button,    
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction, getUserAction} from '../redux/actions';
import Modal from "react-responsive-modal";
import axios from 'axios'
import Cookies from 'js-cookie'
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import * as keys from '../config/keys';

//A pop up to ask users to write a review
class PaymentPlanModal extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            isOpen: true,
            isLoading: false,
        }
    }

    // This line is very important! It tells React to attach the `polaris`
    // object to `this.context` within your component.
    static contextTypes = {
        polaris: PropTypes.object
    };
    
    changeSubscriptionRequest(plan) {
        this.setState({isLoading: true})
        axios.get(process.env.APP_URL + '/change-subscription', {
            params: { plan }
        })
        .then(res => {
            const redirectUrl = res.data
            window.location.replace(redirectUrl);
            this.setState({isLoading: false})
        }).catch(err => {
            console.log('err: ', err)
            this.props.showToastAction(true, "Couldn't subscribe. Please Try Again Later.")
            this.setState({isLoading: false})
        })    
    }
    
    renderPaymentCard(plan, planPricing, options) {
        let payment = this.props.getUserReducer.payment
        if (!payment) {
            this.props.getUserAction();
        }
        
        let cardStyle = paymentCardStyle
        let buttonText = 'Try Free'
        let selected =  (payment && payment.plan == planPricing)
        if (selected) {
            cardStyle = paymentCardSelectedStyle
            buttonText = 'Current Plan'
        }

        return (
            <div style={cardStyle}>
                <p style={planNameStyle}>${plan}</p>
                <h1 style={planPricingStyle}>{planPricing}</h1>
                <p style={planPricingSubtextStyle}>per month</p>
                <hr style={hrStyle}/>
                <div style={planOptionsContainerStyle}>
                 {options}
                 </div>
                 <div style={planButtonContainerStyle}>
                    <Button 
                        onClick={() => this.changeSubscriptionRequest(planPricing)} 
                        primary
                        disabled={selected}
                        loading={this.state.loading}
                    >{buttonText}</Button>
                 </div>
            </div>
        )
    }

    render() {
        return(
            <Modal 
                styles={modalStyle}
                open={this.state.isOpen} 
                onClose={() => {                    
                    this.setState({isOpen:false})
                }} 
                showCloseIcon={true}
                center                
            >
                <div style={modalContentStyle}>
                    {
                        this.renderPaymentCard("COMPLIANCE", keys.FEE_0, 
                        <ul style={planOptionsListStyle}>
                            <li style={planOptionsTextStyle}>Up to <b>50 orders</b> per day</li>
                            <li style={planOptionsTextStyle}>Up to <b>10 email rules</b></li>
                            <li style={planOptionsTextStyle}><b>PDF</b> version available</li>
                            <li style={planOptionsTextStyle}><b>14 day FREE</b> trial</li>
                            <li style={planOptionsTextStyle}>Send emails through your <b>private Gmail</b> account</li>
                            <li style={planOptionsTextStyle}>Fully <b>customizable email</b> format</li>
                            <li style={planOptionsTextStyle}><b>Full</b> Customer Support (Reply Within a Day)</li>
                        </ul>)
                    }
                    {
                        this.renderPaymentCard("PREMIUM", keys.FEE_1, 
                        <ul style={planOptionsListStyle}>
                            <li style={planOptionsTextStyle}>Up to <b>300 orders</b> per day</li>
                            <li style={planOptionsTextStyle}><b>Unlimited</b> email rules</li>
                            <li style={planOptionsTextStyle}><b>PDF</b> version available</li>
                            <li style={planOptionsTextStyle}><b>14 day FREE</b> trial</li>
                            <li style={planOptionsTextStyle}>Send emails through your <b>private Gmail</b> account</li>
                            <li style={planOptionsTextStyle}>Fully <b>customizable email</b> format</li>
                            <li style={planOptionsTextStyle}><b>Full</b> Customer Support (Reply Within a Day)</li>
                        </ul>)
                    }
                    {
                        this.renderPaymentCard("ENTERPRISE", keys.FEE_2, 
                        <ul style={planOptionsListStyle}>
                            <li style={planOptionsTextStyle}><b>Unlimited</b> orders per day</li>
                            <li style={planOptionsTextStyle}><b>Unlimited</b> email rules</li>
                            <li style={planOptionsTextStyle}><b>PDF</b> version available</li>
                            <li style={planOptionsTextStyle}><b>14 day FREE</b> trial</li>
                            <li style={planOptionsTextStyle}>Send emails through your <b>private Gmail</b> account</li>
                            <li style={planOptionsTextStyle}>Fully <b>customizable email</b> format</li>
                            <li style={planOptionsTextStyle}><b>Full</b> Customer Support (Reply Within a Day)</li>
                        </ul>)
                    }
                </div>
            </Modal>
        )
    }
}

const modalStyle = {
  modal: { padding: 0 }
}

const modalContentStyle = {
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'auto',
    alignItems: "center",
    justifyContent: "center",    
}

const paymentCardStyle = {
    padding: 20
}

const paymentCardSelectedStyle = {
    padding: 20,
    backgroundColor: '#d1d1d1'
}

const planNameStyle = {
    textAlign: "center",
    fontSize: 25,
    padding: 20
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 5
}

const planOptionsListStyle = {
    listStyle:'none',
    padding: 0
}

const planOptionsTextStyle = {
    textAlign: "center",
    paddingBottom: 8,
    fontSize: 14
}

const planButtonStyle = {
    padding: 15
}

const planButtonContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
}

const hrStyle = {
    border: '0.1px solid rgb(128, 128, 128)'
}

//We need the user from the reducer to get install date
function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction, getUserAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPlanModal);
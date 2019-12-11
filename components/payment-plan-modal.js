import {         
    ButtonGroup,
    Button,    
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction, getUserAction, showPaymentPlanAction} from '../redux/actions';
import Modal from "react-responsive-modal";
import axios from 'axios'
import Cookies from 'js-cookie'
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import * as keys from '../config/keys';
import React from 'react'

//A pop up to ask users to write a review
class PaymentPlanModal extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
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
            console.log('Failed change subscription request: ', err)
            this.props.showToastAction(true, "Couldn't subscribe. Please Try Again Later.")
            this.setState({isLoading: false})
        })    
    }
    
    showNeedsUpgradeHeader() {
        if (!this.props.showPaymentPlanReducer.needsUpgrade) return
        return (
            <div style={upgradeNoteContainerStyle}>
                <h3 style={upgradeNoteTextStyle}>Your plan needs an upgrade!</h3>
            </div>    
        )
    }
    
    renderPaymentCard(plan, planPricing, options) {
        let payment = this.props.getUserReducer.payment
        if (!payment) {
            this.props.getUserAction();
        }
        
        let cardStyle = paymentCardStyle
        let buttonText = 'Try'
        if (planPricing == keys.FEE_0) buttonText = 'Downgrade'
        let selected =  (payment && payment.plan == planPricing)
        if (selected) {
            cardStyle = paymentCardSelectedStyle
            buttonText = 'Current Plan'
        }

        return (
            <div style={cardStyle}>
                <p style={planNameStyle}>{plan}</p>
                <h1 style={planPricingStyle}>${planPricing}</h1>
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
        //paymentlock true when user enabled automatic send email but payment plan prevented app from auto send
        let paymentLock = false
        if (this.props.getUserReducer.payment) {
            paymentLock = this.props.getUserReducer.payment.lock
        }

        return(
            <Modal 
                styles={modalStyle}
                open={this.props.showPaymentPlanReducer.show && !paymentLock}
                onClose={() => {
                    this.props.showPaymentPlanAction(false)
                }}
                showCloseIcon={true}
                center
            >
                {this.showNeedsUpgradeHeader()}
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
  modal: { 
      padding: 0
  },
  zIndex: 111
}

const modalContentStyle = {
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'auto',
    alignItems: "center",
    justifyContent: "center",    
}

const upgradeNoteContainerStyle = {
    width: '100%',
    backgroundColor: keys.APP_COLOR
}

const upgradeNoteTextStyle = {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    padding: 20
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
function mapStateToProps({getUserReducer, showPaymentPlanReducer}) {
    return {getUserReducer, showPaymentPlanReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction, getUserAction, showPaymentPlanAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPlanModal);
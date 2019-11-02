import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

class Pricing extends React.Component {
  render() {
  	return (
        <section className="section pt-5" id="pricing">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h1 className="section-title text-center">Our Pricing</h1>
                    <div className="section-title-border margin-t-20"></div>
                    <p className="section-subtitle font-secondary text-muted text-center padding-t-30">Call to action pricing table is really crucial to your for your business website. Make your bids stand-out with amazing options.</p>
                </div>
            </div>            
            <div className="row margin-t-30" style={{display: 'flex', justifyContent: 'center'}}>
                <div className="col-lg-4">
                    <div className="text-center pricing-box bg-white hover-effect price-active">
                        <h4 className="text-uppercase">FREE TRIAL</h4>
                        <h1>$0.00</h1>
                        <h6 className="text-uppercase text-muted">For 14 days</h6>
                        <div className="pricing-border"></div>
                        <div className="plan-features margin-t-30">
                            <p>Features: <b className="text-custom">All</b></p>
                            <p>Support: <b className="text-custom">Yes</b></p>
                            <p>Cancelation: <b className="text-custom">Anytime</b></p>
                            <p><b className="text-custom">42</b> Holidays</p>
                            <p><b className="text-custom">4</b> Seasons</p>
                            <p><b className="text-custom">No</b> Hidden Fees</p>
                        </div>
                        <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom waves-effect waves-light margin-t-30">Join Now</button>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="text-center pricing-box hover-effect">
                        <h4 className="text-uppercase">DELUXE</h4>
                        <h1>$9.90</h1>
                        <h6 className="text-uppercase text-muted">Billing Per Month</h6>
                        <div className="pricing-border"></div>
                        <div className="plan-features margin-t-30">
                            <p>Features : <b className="text-custom">All</b></p>
                            <p>Support: <b className="text-custom">24/7</b></p>
                            <p>Cancelation: <b className="text-custom">Anytime</b></p>
                            <p><b className="text-custom">42</b> Holidays</p>
                            <p><b className="text-custom">4</b> Seasons</p>
                            <p><b className="text-custom">No</b> Hidden Fees</p>
                        </div>
                        <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom waves-effect waves-light margin-t-30">Join Now</button>
                    </div>
                </div>
            </div>            
        </div>
    </section>
  	);
  }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Pricing);
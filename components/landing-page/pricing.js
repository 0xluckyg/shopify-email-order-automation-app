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
                        <h4 className="text-uppercase">COMPIANCE</h4>
                        <h1>$14.95</h1>
                        <h6 className="text-uppercase text-muted">BILLING PER MONTH</h6>
                        <div className="pricing-border"></div>
                        <div className="plan-features margin-t-30">
                            <p>Up to <b className="text-custom">50</b> orders per day</p>
                            <p>Up to <b className="text-custom">10</b> email order rules</p>
                            <p><b className="text-custom">PDF Version</b> available</p>
                            <p><b className="text-custom">14 Day</b> FREE Trial</p>
                            <p>Send emails through your private <b className="text-custom">Gmail</b> account</p>
                            <p>Full <b className="text-custom">customer support </b></p>
                        </div>
                        <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom waves-effect waves-light margin-t-30">Join Now</button>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="text-center pricing-box hover-effect">
                        <h4 className="text-uppercase">PREMIUM</h4>
                        <h1>$49.95</h1>
                        <h6 className="text-uppercase text-muted">BILLING PER MONTH</h6>
                        <div className="pricing-border"></div>
                        <div className="plan-features margin-t-30">
                            <p>Up to <b className="text-custom">300</b> orders per day</p>
                            <p><b className="text-custom">UNLIMITED</b> email order rules</p>
                            <p><b className="text-custom">PDF Version</b> available</p>
                            <p><b className="text-custom">14 Day</b> FREE Trial</p>
                            <p>Send emails through your private <b className="text-custom">Gmail</b> account</p>
                            <p>Full <b className="text-custom">customer support </b></p>
                        </div>
                        <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom waves-effect waves-light margin-t-30">Join Now</button>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="text-center pricing-box hover-effect">
                        <h4 className="text-uppercase">ENTERPRISE</h4>
                        <h1>$99.95</h1>
                        <h6 className="text-uppercase text-muted">BILLING PER MONTH</h6>
                        <div className="pricing-border"></div>
                        <div className="plan-features margin-t-30">
                            <p><b className="text-custom">UNLIMITED</b> orders per day</p>
                            <p><b className="text-custom">UNLIMITED</b> email order rules</p>
                            <p><b className="text-custom">PDF Version</b> available</p>
                            <p><b className="text-custom">14 Day</b> FREE Trial</p>
                            <p>Send emails through your private <b className="text-custom">Gmail</b> account</p>
                            <p>Full <b className="text-custom">customer support </b></p>
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
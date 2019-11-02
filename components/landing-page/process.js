import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

class Process extends React.Component {
  render() {
  	return (
        <section className="section bg-light">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h1 className="section-title text-center">Setup Process</h1>
                    <div className="section-title-border margin-t-20"></div>
                    <p className="section-subtitle text-muted text-center font-secondary padding-t-30">We make getting started as effortless and fast as possible.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 text-center process-left-icon-1">
                    <i className="pe-7s-angle-right"></i>
                </div>
                <div className="col-lg-6 text-center process-left-icon-2">
                    <i className="pe-7s-angle-right"></i>
                </div>
            </div>
            <div className="row margin-t-50">
                <div className="col-lg-4 plan-line">
                    <div className="text-center process-box">
                        <i className="fas fa-user-plus text-custom"></i>
                        <h4 className="padding-t-15">Signup</h4>
                        <p className="text-muted">Authorize with Shopify in one click!</p>
                    </div>
                </div>
                <div className="col-lg-4 plan-line">
                    <div className="text-center process-box">
                        <i className="fas fa-sitemap text-custom"></i>
                        <h4 className="padding-t-15">1 Click Setup</h4>
                        <p className="text-muted">Automatically set up our holiday designs and marketing in 1 click!</p>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="text-center process-box">
                        <i className="fas fa-tools text-custom"></i>
                        <h4 className="padding-t-15">Customize</h4>
                        <p className="text-muted">Edit, remove or add any holidays or seasonal marketing tools you need!</p>
                    </div>
                </div>
                <div className="text-center mx-auto">
                <button onClick={() => this.props.showAuthorizeModalAction(true)} className="btn btn-custom waves-light waves-effect margin-t-50">Get Started <i className="mdi mdi-arrow-right"></i></button>
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

export default connect(null, mapDispatchToProps)(Process);
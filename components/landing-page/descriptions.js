import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

class Descriptions extends React.Component {
  render() {
  	return (
          <section className="section section-lg bg-web-desc">
            <div className="bg-overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="text-white">Get Started For Free!</h2>
                        <p className="padding-t-15 home-desc">We offer you 14 day trial! Cancel anytime and you won't be charged.</p>
                        <button 
                            onClick={() => this.props.showAuthorizeModalAction(true)}
                            className="btn btn-bg-white margin-t-30 waves-effect waves-light mb-5"
                        >                            
                            Get Started!
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-pattern-effect">
                <img src="../../static/landing-page/images/bg-pattern.png" alt="" />
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

export default connect(null, mapDispatchToProps)(Descriptions);
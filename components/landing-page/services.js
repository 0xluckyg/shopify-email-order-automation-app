import React from 'react';

class Services extends React.Component {
  render() {
  	return (
        <section className="section pt-5" id="services">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <h1 className="section-title text-center">4 SEASONS, 42 HOLIDAYS</h1>
                        <div className="section-title-border margin-t-20"></div>
                        <p className="section-subtitle text-muted text-center padding-t-30 font-secondary">We craft original store designs and market for you automatically on all the holidays and seasons. All the features are customiable to every detail!</p>
                    </div>
                </div>
                <div className="row margin-t-30">
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-calendar-alt text-custom"></i>                            
                            <h4 className="padding-t-15">Custom Headers</h4>
                            <p className="padding-t-15 text-muted">We automatically set up customized holiday headers on every holiday!</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-tags text-custom"></i>                            
                            <h4 className="padding-t-15">Custom Discounts</h4>
                            <p className="padding-t-15 text-muted">We automatically set up custom discounts for each holiday!</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-paint-brush text-custom"></i>                            
                            <h4 className="padding-t-15">Holiday Banner</h4>
                            <p className="padding-t-15 text-muted">Automatically set up holiday banner cards and designs on your website!</p>
                        </div>
                    </div>
                </div>
                <div className="row margin-t-30">
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-envelope-square text-custom"></i>
                            <h4 className="padding-t-15">Email Popups (Coming Soon)</h4>
                            <p className="padding-t-15 text-muted">Customize your subscription popups customized for Black Friday, Thanks Giving and more!!</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-paper-plane text-custom"></i>
                            <h4 className="padding-t-15">Automated Emails (Coming Soon)</h4>
                            <p className="padding-t-15 text-muted">We increase your sales on every holiday using our holiday email system!</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-palette text-custom"></i>
                            <h4 className="padding-t-15">Advanced Designs (Coming Soon)</h4>
                            <p className="padding-t-15 text-muted">Do you want some christmas trees and fireworks on your website? We got you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  	);
  }
}
export default Services;
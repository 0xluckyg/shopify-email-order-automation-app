import React from 'react';

class Services extends React.Component {
  render() {
  	return (
        <section className="section pt-5" id="services">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <h1 className="section-title text-center">Automatic Email Order Sends!</h1>
                        <div className="section-title-border margin-t-20"></div>
                        <p className="section-subtitle text-muted text-center padding-t-30 font-secondary">We use Gmail Send API to safely and precisely send your order emails to your suppliers automatically everyday through your Gmail account.</p>
                    </div>
                </div>
                <div className="row margin-t-30">
                <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-calendar-alt text-custom"></i>                            
                            <h4 className="padding-t-15">Automatic Email Order Sends!</h4>
                            <p className="padding-t-15 text-muted">We use Gmail Send API to safely and precisely send your order emails to your suppliers automatically everyday through your Gmail account.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-calendar-alt text-custom"></i>                            
                            <h4 className="padding-t-15">Customizable Emails</h4>
                            <p className="padding-t-15 text-muted">You can customize your email template using our email customization tool.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-tags text-custom"></i>                            
                            <h4 className="padding-t-15">Set Email Rules</h4>
                            <p className="padding-t-15 text-muted">You can set up which emails will be sent on which orders on a granular level by checking which products are contained in an order.</p>
                        </div>
                    </div>
                </div>
                <div className="row margin-t-30">
                     <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-paint-brush text-custom"></i>                            
                            <h4 className="padding-t-15">PDF Format Support</h4>
                            <p className="padding-t-15 text-muted">You can send your order emails in a PDF that we automatically create for you.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-envelope-square text-custom"></i>
                            <h4 className="padding-t-15">FREE Trial</h4>
                            <p className="padding-t-15 text-muted">Enjoy a 14 day trial. Not charged after the trial period as long as you don't use the app anymore.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 margin-t-20">
                        <div className="services-box text-center hover-effect">
                            <i className="fas fa-paper-plane text-custom"></i>
                            <h4 className="padding-t-15">Shopify-Integrated Order Management (Coming Soon)</h4>
                            <p className="padding-t-15 text-muted">Change status of the orders on Shopify according to email sent status.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  	);
  }
}
export default Services;
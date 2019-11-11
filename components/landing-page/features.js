import React from 'react';

class Features extends React.Component {
  render() {
  	return (
        <section className="section bg-light" id="features">
        <div className="container">
            <div className="row vertical-content">
                <div className="col-lg-5">
                    <div className="features-box">
                        <h3>We use <b className="text-custom">Gmail API</b> to streamline your Shopify orders.</h3>
                        <p className="text-muted web-desc">
                            Authorize your Gmail account inside our application, and we summarize, format and send email orders to your vendors that you specify.
                        </p>
                        <h3><b className="text-custom">Why </b>do you need authorization to my Gmail account?</h3>
                        <p className="text-muted web-desc">
                            We only need approval to "send" emails on your account's behalf, so that we can send your orders while you spend your time growing your business, while the receivers think that you're behind the scenes sending them everday!
                        </p>
                        <h3><b className="text-custom">What </b>information do you need from me?</h3>
                        <ul className="text-muted list-unstyled margin-t-30 features-item-list">
                            <li className="">Permission to send email on behalf of your Gmail account (gmail.send approval)</li>
                            <li className="">Your email address</li>
                            <li className="">Your personal info that you've made publicly available</li>
                        </ul>
                        <button onClick={() => window.location.replace(`${process.env.APP_URL}/privacy-policy`)} className="btn btn-custom margin-t-30 waves-effect waves-light">Privacy Policy <i className="mdi mdi-arrow-right"></i></button>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="features-img features-right text-right">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/D_hzn4gaKHU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>                    
                    </div>
                </div>
            </div>
        </div>
    </section>
  	);
  }
}

export default Features;
import React from 'react';

class Started extends React.Component {
  render() {
  	return (
        <section className="section section-lg bg-get-start">
            <div className="bg-overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <h1 className="get-started-title text-white">Interested In Our Other Apps?</h1>
                        <div className="section-title-border margin-t-20 bg-white"></div>
                        <p className="section-subtitle font-secondary text-white text-center padding-t-30">We offer fast, affordable and reliable software solutions to your ecommerce business at Kroco.</p>
                        <a target="_blank" href="https://kroco.io/#products" className="btn btn-bg-white waves-effect margin-t-20 mb-4">Check them out!<i className="mdi mdi-arrow-right"></i> </a>
                    </div>
                </div>
            </div>
            <div className="bg-pattern-effect">
                <img src="../../static/landing-page/images/bg-pattern-light.png" alt="" />
            </div>
        </section>
  	);
  }
}
export default Started;
import React from 'react';
import * as keys from '../../config/keys'

class SocialMedia extends React.Component {
  render() {
  	return (
        <section className="cta bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <ul className="list-inline social margin-t-20">
                            <li className="list-inline-item"> <a href="JavaScript:Void(0);" className="social-icon"><i className="mdi mdi-facebook"></i></a></li>
                            <li className="list-inline-item"> <a href="JavaScript:Void(0);" className="social-icon"><i className="mdi mdi-twitter"></i></a></li>
                            <li className="list-inline-item"> <a href="JavaScript:Void(0);" className="social-icon"><i className="mdi mdi-linkedin"></i></a></li>
                            <li className="list-inline-item"> <a href="JavaScript:Void(0);" className="social-icon"><i className="mdi mdi-google-plus"></i></a></li>
                            <li className="list-inline-item"> <a href="JavaScript:Void(0);" className="social-icon"><i className="mdi mdi-dribbble"></i></a></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 margin-t-30">
                        <p className="margin-b-0 contact-title"><i className="pe-7s-call"></i> &nbsp;+91 123 4556 789</p>
                    </div>
                    <div className="col-lg-3 margin-t-30 text-right">
                        <p className="contact-title"><i className="pe-7s-mail-open"></i>&nbsp; {keys.APP_EMAIL}</p>
                    </div>
                </div>
            </div>
        </section>
  	);
  }
}
export default SocialMedia;
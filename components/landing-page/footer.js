import React from 'react';
import keys from '../../config/keys'

class Footer extends React.Component {
  render() {
  	return (
         <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 margin-t-20">
                        <h4>Festfunnel</h4>
                        <div className="text-muted margin-t-20">
                            <ul className="list-unstyled footer-list">
                                <li><a href="/home#home">Home</a></li>
                                <li><a href="/home#services">Services</a></li>                                
                                <li><a href="/home#features">Features</a></li>
                                <li><a href="/home#pricing">Pricing</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 margin-t-20">
                        <h4>Information</h4>
                        <div className="text-muted margin-t-20">
                            <ul className="list-unstyled footer-list">
                                <li><a href={process.env.APP_URL+"/terms-of-service"}>Terms & Conditions</a></li>
                                <li><a href={process.env.APP_URL+"/privacy-policy"}>Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 margin-t-20">
                        <h4>Support</h4>
                        <div className="text-muted margin-t-20">
                            <ul className="list-unstyled footer-list">                                
                                <li><a href="/home#contact">Contact</a></li>
                                <li><a href="/home#contact">info@kroco.io</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 margin-t-20">
                        <h4>Subscribe</h4>
                        <div className="text-muted margin-t-20">
                            <p>Subscribe to our newsletters, discounts, and more!</p>
                        </div>
                        <form className="form subscribe">
                            <input placeholder="Email" className="form-control" required />
                            <a href="/home" className="submit"><i className="pe-7s-paper-plane"></i></a>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
  	);
  }
}
export default Footer;
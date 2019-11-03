import React from 'react';

class Main extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        const bkg1 = {
            backgroundImage: 'url(../../static/landing-page/images/wave-shape/wave1.png)',
        };
        const bkg2 = {
            backgroundImage: 'url(../../static/landing-page/images/wave-shape/wave2.png)',
        };
        const bkg3 = {
            backgroundImage: 'url(../../static/landing-page/images/wave-shape/wave3.png)',
        };

        return (
            <section className="section bg-home home-half" id="home" data-image-src="images/bg-home.jpg">
                <div className="bg-overlay"></div>
                <div className="display-table">
                    <div className="display-table-cell">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2 text-white text-center">
                                    <img style={{width: '100%'}} src='../../static/logo-color.svg'/>
                                    <h1 className="home-title">
                                        Kroco Order Gmail Automation
                                    </h1>
                                    <p className="padding-t-15 home-desc">
                                        <b>Automate Your Shopify Order Pipeline Through Gmail</b>
                                    </p>
                                    <button 
                                        onClick={() => this.props.showAuthorizeModalAction(true)} 
                                        className="btn btn-custom margin-t-30 waves-effect waves-light">
                                            Get Started Now!
                                            <i className="mdi mdi-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wave-effect wave-anim">
                    <div className="waves-shape shape-one">
                        <div className="wave wave-one" style={bkg1}></div>
                    </div>
                    <div className="waves-shape shape-two">
                        <div className="wave wave-two" style={bkg2}></div>
                    </div>
                    <div className="waves-shape shape-three">
                        <div className="wave wave-three" style={bkg3}></div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Main;
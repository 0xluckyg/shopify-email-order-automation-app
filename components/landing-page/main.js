import { withStyles } from '@material-ui/core/styles';

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
        const {classes} = this.props

        return (
            <section className="section bg-home home-half" id="home" data-image-src="images/bg-home.jpg">
                <div className="bg-overlay"></div>
                <div className="display-table">
                    <div className="display-table-cell">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2 text-white text-center">
                                    <img className={classes.logo} src='../../static/logo-big.png'/>
                                    <h1 className="home-title">YOUR HOLIDAY MARKETING APP</h1>
                                    <p className="padding-t-15 home-desc">We make your customers happy for every holiday out there.</p>
                                    {/* <p className="play-shadow margin-t-30 margin-l-r-auto">                                             
                                        <a href="http://vimeo.com/99025203"  className="play-btn video-play-icon"><i className="mdi mdi-play text-center"></i></a>
                                    </p>   */}
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


const useStyles = theme => ({
    logo: {
        width: '100%'
    },    
});

export default withStyles(useStyles)(Main);
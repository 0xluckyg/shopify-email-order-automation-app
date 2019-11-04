import React from 'react';
import Main from '../components/landing-page/main';
import Services from '../components/landing-page/services';
import Features from '../components/landing-page/features';
import Descriptions from '../components/landing-page/descriptions';
import Pricing from '../components/landing-page/pricing';
import Process from '../components/landing-page/process';
import Footer from '../components/landing-page/footer';
import FooterLinks from '../components/landing-page/footer-links';

//landing page component. uses bootstrap
class Home extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {        
        return (
            <div>
                {/* Main view */}
                <Main />

               {/* Services Component */}
                <Services />

                {/* Features Component*/}
                <Features />

                {/* Descriptions Component*/}
                <Descriptions />

                {/* Pricing Component*/}
                <Pricing />

                {/* Process Component*/}
                <Process />

                {/* Footer Component*/}
                <Footer />

                {/* FooterLinks Component*/}
                <FooterLinks />
            </div>
        );
    }
}

export default Home;
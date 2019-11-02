import React from 'react';
import Navbar from '../components/landing-page/nav-bar';
import Main from '../components/landing-page/main';
import Services from '../components/landing-page/services';
import Features from '../components/landing-page/features';
import Descriptions from '../components/landing-page/descriptions';
import Pricing from '../components/landing-page/pricing';
import Team from '../components/landing-page/team';
import Process from '../components/landing-page/process';
import Testi from '../components/landing-page/testimonials';
import Started from '../components/landing-page/started';
import Blog from '../components/landing-page/blog';
import Contact from '../components/landing-page/contact';
import SocialMedia from '../components/landing-page/social-media';
import Footer from '../components/landing-page/footer';
import FooterLinks from '../components/landing-page/footer-links';
import Toast from '../components/toast'
import Authorization from '../components/landing-page/authorize-modal';

//landing page component. uses bootstrap
class Home extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {        
        return (
            <div>
                {/* Navbar Component*/}

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

                {/* Team Component*/}
                {/* <Team /> */}

                {/* Process Component*/}
                <Process />

                {/* Testi Component*/}
                {/* <Testi /> */}

                {/* Started Component*/}
                <Started />

                {/* Blog Component*/}
                {/* <Blog /> */}

                {/* Contact Component*/}

                {/* SocialMedia Component*/}
                {/* <SocialMedia /> */}

                {/* Footer Component*/}
                <Footer />

                {/* FooterLinks Component*/}
                <FooterLinks />

                {/* Switcher Component*/}
                {/* <Switcher />  */}
               
            </div>
        );
    }
}

export default Home;
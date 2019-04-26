require('../config/config');
//Polaris CSS, different from components. Determines styles for Polaris components.
import '@shopify/polaris/styles.css';
//Polaris components. Polaris has built in building blocks we can use
import { AppProvider } from '@shopify/polaris';
import App from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import configureStore from '../redux/store';
let { store, persistor } = configureStore()
import * as keys from '../config/keys';

//_app file overrides Next.js App file.
// Next.js uses an App component to pass down classes to the other files in your app. This saves us from having to add imports to each file
// _app.js file that passes down Apollo and Polaris components, styles, and everything else typically found in an index file
class Boilerplate extends App {
    state = {
        shopOrigin: Cookies.get('shopOrigin')
    }
    render() {
        const { Component, pageProps } = this.props;
        return (
            // React.Fragment lets you add extra children without adding a node to the DOM
            <React.Fragment>
                <Head>
                    <title>{keys.APP_NAME}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta charSet="utf-8"/>
                </Head>
                {/* Polaris AppProvider must wrap the whole app in order for Polaris React components to function */}
                {/* We access Shopify App Bridge through Polaris. 
                The app will use a library called Shopify App Bridge to enable Shopify embeded app by passing in Shopify API key to shopOrigin in Polaris AppProvider */}                
                <AppProvider theme={theme} shopOrigin={this.state.shopOrigin} apiKey={(keys.EMBEDDED) ? process.env.SHOPIFY_API_KEY : null}>
                    {/* Wrapping the app with Redux Provider lets components further down the tree access the Redux */}                    
                    <Provider store={store}>                        
                        <PersistGate loading={null} persistor={persistor}>                       
                            <Component {...pageProps} />                    
                        </PersistGate>
                    </Provider>
                </AppProvider>
            </React.Fragment>
        );
    }
}

const theme = {
    //Polaris only lets users customize the top bar color. Will have to fork polaris in order to make further custom changes
    colors: {
        topBar: {
            background: keys.APP_COLOR,
            backgroundLighter: keys.APP_COLOR_LIGHT,
            color: '#FFFFFF',
        },
    },
    logo: {
        width: 124,
        //Shows the logo on the top bar
        topBarSource: keys.LOGO,
        //Where the top bar links to
        // url: '',
        accessibilityLabel: 'App Logo',
    },
};

export default Boilerplate;
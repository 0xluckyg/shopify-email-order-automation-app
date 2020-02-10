// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import flush from 'styled-jsx/server';

class KoeaDocument extends Document {    
    componentDidMount() {
        
    }
    
    renderHead() {

        if (this.props.__NEXT_DATA__.page == '/home') {            
            return (
            //link files to load when user is on the landing page before signup
            <Head>
                <meta charSet="utf-8" />
                {/* Use minimum-scale=1 to enable GPU rasterization */}
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />        
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
                />
                
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <meta name="author" content="Themesbrand" />   
                <link rel="shortcut icon" href="static/logo-small.png"/>
            
                <link rel="manifest" href="static/landing-page/manifest" />
                {/* Google Font */}
                <link href="https://fonts.googleapis.com/css?family=Poppins:400,500,700|Rubik:300,400,500" rel="stylesheet"/>

                {/* Material Icon */}
                <link rel="stylesheet" type="text/css" href="static/landing-page/css/materialdesignicons.min.css" />

                {/* Waves effect Css */}
                <link rel="stylesheet" type="text/css" href="static/landing-page/css/waves.css" />

                {/* Bootstrap Css */}
                <link rel="stylesheet" type="text/css" href="static/landing-page/css/bootstrap.min.css" />

                {/* Magnific-popup */}
                <link rel="stylesheet" href="static/landing-page/css/magnific-popup.css" />

                {/* Custom Css */}
                <link rel="stylesheet" type="text/css" href="static/landing-page/css/style.css" />
                <link rel="stylesheet" href="static/landing-page/css/colors/red.css" id="color-opt" />   

                <script src="https://kit.fontawesome.com/3b07425bbb.js"></script>
            </Head>
            )
        } else {            
            //when user is inside the app's content
            return (
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />        
            </Head>
            )
        }
    }

    render() {                
        return (
        <html lang="en" dir="ltr">
            {this.renderHead()}
            <body>    
                <Main />
                <NextScript />
            </body>
        </html>
        );
    }
}

KoeaDocument.getInitialProps = async ctx => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: (
        <React.Fragment>
            {sheets.getStyleElement()}
            {flush() || null}
        </React.Fragment>
        ),
    };
};

export default KoeaDocument;
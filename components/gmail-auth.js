import {         
    Card,
    Button
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, setUserAction} from '../redux/actions';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import React from 'react';

const scopes= [
    // 'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send',
    'profile',
    'email'
]

//A pop up to ask users to write a review
class GmailAuth extends React.Component {    
    constructor(props){
        super(props)                          
        
        this.state = {
            isLoading: false
        }
    }    

    isLoggedIn() {
        if (!this.props.getUserReducer || !this.props.getUserReducer.gmail) return false        
        return this.props.getUserReducer.gmail.isActive
    }

    showText() {
        if (this.isLoggedIn()) {
            return (
                <div>
                    <p style={{fontSize:'20px', lineHeight: '35px'}}><b>Logout Gmail</b></p>
                    <p style={{lineHeight: '35px'}}>Unauthorize your Gmail account. You will not be able to use the app, but you can reauthorize anytime!</p>
                </div>
            )
        } else {
            return (
                <div>
                    <p style={{fontSize:'20px', lineHeight: '35px'}}><b>Link Gmail</b></p>
                    <p style={{lineHeight: '35px'}}>Link your Gmail address to send order emails from your account.</p>                
                </div>
            )
        }        
    }

    showButton() {        
        if (this.isLoggedIn()) {
            return (
                <div style={{marginTop: '5px'}}>
                    <Button 
                        loading={this.state.isLoading}
                        onClick={async () => {
                            this.setState({isLoading: true})
                            const user = await axios.post(process.env.APP_URL + '/gmail-logout')
                            this.setState({isLoading: false})
                            this.props.setUserAction(user.data)
                            this.props.showToastAction(true, "Logged out gmail")
                        }}
                    >
                        Logout
                    </Button>
                </div>
            )
        } else {
            return (
                <GoogleLogin
                    scope={scopes.join(' ')}
                    clientId={process.env.GMAIL_API_CLIENT_ID}
                    render={renderProps => (
                        <div style={{marginTop: '5px'}}>
                            <Button 
                                isLoading={this.state.isLoading}
                                onClick={renderProps.onClick} 
                                disabled={renderProps.disabled}
                            >
                                Login
                            </Button>
                        </div>
                    )}        
                    uxMode='redirect'  
                    accessType='offline'
                    responseType='code'
                    onSuccess={async authResult => {
                        if (!authResult.code) return
                        this.setState({isLoading: true})
                        const user = await axios.get(process.env.APP_URL + '/gmail-auth', {
                            params: {code: authResult.code}
                        })
                        this.setState({isLoading: false})
                        this.props.setUserAction(user.data)
                        this.props.showToastAction(true, "Authorized gmail!")
                    }}
                    onFailure={err => {
                        this.setState({isLoading: false})
                        console.log('Failed Google Login: ', err)
                    }}
                    cookiePolicy='single_host_origin'
                    prompt='consent'
                />
            )
        }        
    }

    render() {         
        return(
            <Card>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{flex: 4, margin: 'auto', padding:'40px'}}>
                        {this.showText()}
                        {/* https://developers.google.com/identity/sign-in/web/server-side-flow */}
                        {this.showButton()}
                    </div>
                    <div style={{flex: 1, margin: 'auto'}}>
                        <img style={imageStyle} src={'../static/gmail.svg'}/>
                    </div>
                </div>
            </Card>
        )
    }
}

const imageStyle = {
    display: 'flex',    
    margin: '50px',     
    width: '100px',    
}

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, setUserAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(GmailAuth);
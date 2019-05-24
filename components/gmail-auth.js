import {         
    CalloutCard,
    Card,
    Button
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';

const scopes= [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'profile',
    'email'
]

//A pop up to ask users to write a review
class GmailAuth extends React.Component {    
    constructor(props){
        super(props)                          
        
    }    

    render() {         
        return(
            <Card>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{flex: 4, margin: 'auto', marginLeft:'50px'}}>
                        <p style={{fontSize:'20px', lineHeight: '35px'}}><b>Link Gmail</b></p>
                        <p style={{lineHeight: '35px'}}>Link your Gmail address to send order emails from your account.</p>                
                        {/* https://developers.google.com/identity/sign-in/web/server-side-flow */}
                        <GoogleLogin
                            scope={scopes.join(' ')}
                            clientId={process.env.GMAIL_API_CLIENT_ID}
                            render={renderProps => (
                                <div style={{marginTop: '5px'}}>
                                    <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</Button>
                                </div>
                            )}        
                            uxMode='redirect'  
                            accessType='offline'
                            responseType='code'
                            onSuccess={async authResult => {
                                if (!authResult.code) return
                                const user = await axios.get(process.env.APP_URL + '/gmail-auth', {
                                    params: {code: authResult.code}
                                })
                            }}
                            onFailure={err => {
                                console.log('err ', err)
                            }}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                    <div style={{flex: 1, margin: 'auto'}}>
                    <img style={imageStyle} src={'../static/gmail.svg'}/>
                    </div>
                </div>
            </Card>
            // <CalloutCard
            //     title="Link Gmail"
            //     illustration="../static/gmail.svg"
            //     primaryAction={{
            //         content: 'Authorize',
            //         onAction: () => {
            //         }
            //     }}
            // >
            // <p>Link your Gmail address to send order emails from your account.</p>
            // </CalloutCard>   
        )
    }
}

const imageStyle = {
    display: 'flex',     
    // paddingBottom: '30px',
    margin: '50px',     
    width: '100px',    
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(GmailAuth);
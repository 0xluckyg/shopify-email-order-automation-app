import {         
    Card,
    Button,
    TextField
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, setUserAction} from '../redux/actions';
const emailValidator = require("email-validator");
import axios from 'axios';
import React from 'react';

//A pop up to ask users to write a review
class EmailRegister extends React.Component {    
    constructor(props){
        super(props)                          
        
        this.state = {
            isLoading: false,
            email: ''
        }
    }
    
    componentDidMount() {
        const email = this.isLoggedIn()
        if (!email) return this.setState({email: ''})
        this.setState({email})
    }

    isLoggedIn() {
        if (!this.props.getUserReducer || !this.props.getUserReducer.email) return false   
        const email = this.props.getUserReducer.email
        return email
    }

    showText() {
        if (this.isLoggedIn()) {
            return (
                <div>
                    <p style={{fontSize:'20px', lineHeight: '35px'}}><b>Change Email</b></p>
                    <p style={{lineHeight: '35px'}}>Change your email address to send order emails from.</p>
                </div>
            )
        } else {
            return (
                <div>
                    <p style={{fontSize:'20px', lineHeight: '35px'}}><b>Step 1. Register Email</b></p>
                    <p style={{lineHeight: '35px'}}>Link your email address to send order emails from.</p>                
                </div>
            )
        }        
    }
    
    async saveEmail(email) {
        if (!emailValidator.url(email)) {
            this.props.showToastAction(true, "Please enter a valid email")
            return
        }
        this.setState({isLoading: true})
        const user = await axios.post(process.env.APP_URL + '/set-email', { email })
        this.setState({isLoading: false})
        this.props.setUserAction(user.data)
    }

    showButton() {        
        if (this.isLoggedIn()) {
            return (
                <div style={{marginTop: 20}}>
                    <Button 
                        loading={this.state.isLoading}
                        onClick={async () => {
                            await this.saveEmail(this.state.email)
                            this.props.showToastAction(true, "Changed email")
                        }}
                    >
                        Edit
                    </Button>
                </div>
            )
        } else {
            return (
                <div style={{marginTop: 20}}>
                    <Button 
                        loading={this.state.isLoading}
                        onClick={async () => {
                            await this.saveEmail(this.state.email)
                            this.props.showToastAction(true, "Changed email")
                        }}
                    >
                        Save
                    </Button>
                </div>
            )
        }        
    }

    render() {         
        return(
            <Card>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{flex: 4, margin: 'auto', padding:'40px'}}>
                        {this.showText()}
                        <div style={{width: '50%'}}>
                        <TextField
                            value={this.state.email}
                            onChange={email => this.setState({email})}
                            placeholder='ex) info@kroco.io'
                        />
                        </div>
                        {this.showButton()}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailRegister);
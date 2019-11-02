import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAuthorizeModalAction} from '../../redux/actions';

//A pop up to ask users to login or signup
class AuthorizeModal extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            domain: '',
            fieldError: ''
        }
    }

    //redirects back to shopify with shopify url
    authorize() {
        if (!this.state.domain.includes('.myshopify.com')) {
            this.setState({fieldError: 'Please provide a valid Shopify domain.'})
            return
        }
        window.location.replace(`${process.env.APP_URL}/auth?shop=${this.state.domain}`)    
    }

    render() {
        const { classes } = this.props;
        const { domain, fieldError } = this.state;
        return(
            <Modal 
                open={this.props.showAuthorizeModalReducer}
                onClose={() => {                    
                    this.props.showAuthorizeModalAction(false)
                }}
            >
                <div style={modalContent} className={classes.paper}>
                    <div>
                    {/* images get rendered from static folder for nextjs */}
                    <img className={classes.imgStyle} src={'../static/shopify-logo.jpg'}/>
                    <p className={classes.subTextStyle}>Sign Up / Login With Shopify!</p>
                    <TextField
                        className={classes.textField}
                        id="subject"
                        label={fieldError ? fieldError : "Shopify Domain"}
                        value={domain}
                        onChange={(event) => {
                            this.setState({domain:event.target.value})
                        }}
                        margin="normal"
                        placeholder="Shopify domain (ex. kroco.myshopify.com)"
                        error={fieldError ? true : false}
                        fullWidth
                    />
                    <div className={classes.buttonContainer}>                        
                        <Button 
                            onClick={() => this.authorize()} 
                            // fullWidth={true}
                            variant="contained" 
                            size="large" 
                            color="primary" 
                            className={classes.button}
                        >
                                Login
                        </Button>
                    </div>
                    </div>                               
                </div>
            </Modal>
        )
    }
}

const modalContent = {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
}

const useStyles = theme => ({
    textField: {
        fontSize: '15px'
    },
    imgStyle: {    
        width: 330,    
        padding: 30
    },
    subTextStyle: {
        textAlign: "center",
        fontSize: 20,    
        paddingBottom: 10
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: 'none',
    },
    button: {
        color: 'white',
        margin: 'auto',
        marginTop: theme.spacing(4),
        fontSize: '13px',
        width: '40%',        
    }
});

//We need the user from the reducer to get install date
function mapStateToProps({showAuthorizeModalReducer}) {
    return {showAuthorizeModalReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showAuthorizeModalAction},
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(AuthorizeModal));
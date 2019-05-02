import {     
    Card,         
    Layout, 
    FormLayout, 
    TextField, 
    Button
} from '@shopify/polaris';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showToastAction } from '../redux/actions';
import axios from 'axios';
const emailValidator = require("email-validator");

//Lets users email the admin through a form.
class ContactUs extends React.Component {
    constructor(props){
        super(props)

        this.submitEmail = this.submitEmail.bind(this); 
        this.validator = this.validator.bind(this);       
    }

    state = {
        subjectValue: "",
        emailValue: "",
        bodyValue: "",
        subjectError: "",
        emailError: "",
        bodyError: ""
    }

    render() {
        return (            
            <Layout>
                <Layout.AnnotatedSection
                    title="Contact Us!"
                    description="This is an example description."
                >
                <Card sectioned>
                    <FormLayout>
                    <TextField
                        label="Subject"
                        placeholder="e.g. Save button not working!"
                        value={this.state.subjectValue}
                        error={this.state.subjectError}
                        onChange={(subjectValue) => {
                            this.setState({subjectValue})
                        }}
                    />
                    <TextField
                        type="email"
                        label="Email"
                        placeholder="e.g. youremail@example.com"
                        value={this.state.emailValue}
                        error={this.state.emailError}
                        onChange={(emailValue) => {
                            this.setState({emailValue})                                
                        }}
                    />
                    <TextField
                        label="Body"
                        placeholder='Any technical issues? &#10;Any feedback? &#10;Want to get in touch? &#10;Please fill out the form and shoot us an email!'
                        value={this.state.bodyValue}
                        onChange={(bodyValue) => {
                            this.setState({bodyValue})
                        }}
                        error={this.state.bodyError}
                        multiline
                    />
                    <div style={buttomWrapper}>
                        <Button onClick={this.submitEmail} size="large" primary>Add product</Button>
                    </div>
                    </FormLayout>
                </Card>
                </Layout.AnnotatedSection>
            </Layout>            
        )
    }

    //Sends a post request to our server and uses nodemailer from backend to send the email.
    submitEmail() {
        if (this.validator()) {
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
            const emailContent = {
                subject: this.state.subjectValue,
                email: this.state.emailValue,
                body: this.state.bodyValue
            }            
            axios.post(process.env.APP_URL + '/contact-us', emailContent, headers)
            .then(() => {                
                this.props.showToastAction(true, 'Email Sent!')
                this.setState({
                    subjectValue: "",
                    emailValue: "",
                    bodyValue: "",
                    subjectError: "",
                    emailError: "",
                    bodyError: ""
                })
            }).catch(() => {                
                this.props.showToastAction(true, 'Having Trouble.. Please Try Again Later ):')
            })
        }
    }

    //Simple checks from the clientside before sending info to the server
    validator() {
        let valid = true
        if (this.state.subjectValue.length < 3) {
            this.setState({subjectError:"Please enter more than 3 characters"})            
            valid = false
        } else {
            this.setState({subjectError:""})                        
        }   

        if (this.state.bodyValue.length < 10) {
            this.setState({bodyError:"Please enter more than 10 characters"})
            valid = false
        } else {
            this.setState({bodyError:""})
        }

        if (!emailValidator.validate(this.state.emailValue)) {
            this.setState({emailError:"Please enter a valid email address"})            
            valid = false
        } else {
            this.setState({emailError:""})
        }

        return valid
    }
}

const buttomWrapper = {float:"right", paddingBottom: "15px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(ContactUs);;
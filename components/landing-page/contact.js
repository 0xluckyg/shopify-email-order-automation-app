import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showToastAction } from '../../redux/actions';
import emailValidator from "email-validator";

const recaptchaRef = React.createRef();

class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subjectValue: "",
            nameValue: "",
            emailValue: "",
            bodyValue: "",
            loading: false,
            recaptchaComplete: false
        }
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
                name: this.state.nameValue,
                email: this.state.emailValue,
                body: this.state.bodyValue
            }
            this.setState({isLoading: true})
            axios.post(process.env.APP_URL + '/contact-us-unauthorized', emailContent, headers)
            .then(res => {                
                this.props.showToastAction(true, 'Email Sent!')
                this.setState({
                    nameValue: "",
                    subjectValue: "",
                    emailValue: "",
                    bodyValue: "",
                    isLoading: false
                })
            }).catch(err => {
                this.props.showToastAction(true, 'Having Trouble.. Please Try Again Later ):', 'error')                
                this.setState({isLoading: false})
                return err
            })
        }
    }

    //Simple checks from the clientside before sending info to the server
    validator() {
        let valid = true
        if (this.state.nameValue.length < 1) {
            this.props.showToastAction(true, 'Please enter a valid name', 'error')
            valid = false
        } 

        if (this.state.subjectValue.length < 3) {
            this.props.showToastAction(true, 'Please enter more than 3 characters', 'error')            
            valid = false
        } 

        if (this.state.bodyValue.length < 10) {
            this.props.showToastAction(true, 'Please enter more than 10 characters', 'error')            
            valid = false
        }

        if (!emailValidator.validate(this.state.emailValue)) {
            this.props.showToastAction(true, 'Please enter a valid email address', 'error')            
            valid = false
        }

        if (!this.state.recaptchaComplete) {
            this.props.showToastAction(true, 'Are you a robot?', 'error')            
            valid = false
        }

        return valid
    }

    handleSubmit() {                
        if (!this.validator()) return        
        this.submitEmail()
    }

    render() {
        return (
            <section className="section" id="contact">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <h1 className="section-title text-center">Get In Touch</h1>
                        <div className="section-title-border margin-t-20"></div>
                        <p className="section-subtitle text-muted text-center font-secondary padding-t-30">We thrive when coming up with innovative ideas but also understand that a smart concept should be supported with measurable results.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="mt-4 pt-4">
                            <p className="mt-4"><span className="h5">Office Address 1:</span><br /> <span className="text-muted d-block mt-2">40 Newport Parkway, NJ 07310</span></p>
                            {/* <p className="mt-4"><span className="h5">Office Address 2:</span><br /> <span className="text-muted d-block mt-2">2467 Swick Hill Street <br/>New Orleans, LA 70171</span></p> */}
                            <p className="mt-4"><span className="h5">Working Hours:</span><br /> <span className="text-muted d-block mt-2">9:00AM To 6:00PM</span></p>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="custom-form mt-4 pt-4">
                            <div id="message"></div>
                            <div name="contact-form" id="contact-form">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group mt-2">
                                            <input 
                                                name="name" id="name" className="form-control" placeholder="Your name*" 
                                                value={this.state.name} 
                                                onChange={event => this.setState({nameValue:event.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group mt-2">
                                            <input 
                                                name="email" id="email" className="form-control" placeholder="Your email*" 
                                                value={this.state.email} 
                                                onChange={event => this.setState({emailValue:event.target.value})}
                                            />
                                        </div>
                                    </div>                                
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group mt-2">
                                            <input 
                                                className="form-control" id="subject" placeholder="Your Subject.." 
                                                value={this.state.subject} 
                                                onChange={event => this.setState({subjectValue:event.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group mt-2">
                                            <textarea 
                                                name="comments" id="comments" rows="4" className="form-control" placeholder="Your message..."
                                                value={this.state.body} 
                                                onChange={event => this.setState({bodyValue:event.target.value})}
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 text-right">
                                        <button  onClick={() => this.handleSubmit()} type="submit" id="submit" name="send" className="submitBnt btn btn-custom">Send Message</button>
                                        <div id="simple-msg"></div>
                                    </div>
                                </div>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    // size="invisible"
                                    sitekey="6LeVJqcUAAAAAA8Dk62V1k_y3bnT4M4deQvK2aZl"
                                    onChange={() => this.setState({recaptchaComplete: true})}
                                />
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </section> 
        );
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Contact)
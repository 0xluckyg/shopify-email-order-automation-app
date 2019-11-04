import React from 'react'
import {         
    ButtonGroup,
    Button,    
} from '@shopify/polaris';
import {connect} from 'react-redux';
import Modal from "react-responsive-modal";
import Cookies from 'js-cookie'
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import * as keys from '../config/keys';

//A pop up to ask users to write a review
class ReviewModal extends React.Component {
    constructor(props){
        super(props)

        this.redirectToReviews = this.redirectToReviews.bind(this);
        this.reviewShouldShow = this.reviewShouldShow.bind(this);
    }

    state = {   
        //For open status     
        open: false,
        //For cookies. If the user closes the modal, doesn't show for 1 day
        closed: false
    }    

    // This line is very important! It tells React to attach the `polaris`
    // object to `this.context` within your component.
    static contextTypes = {
        polaris: PropTypes.object
    };

    componentDidMount() {
        this.reviewShouldShow()
    }

    render() {
        return(
            <Modal 
                open={this.state.open} 
                onClose={() => {                    
                    this.setState({open:false, closed:true})
                    //If the user closes the modal, doesn't show for 1 day
                    Cookies.set('stop-review', true, {expires: 1})
                }} 
                showCloseIcon={false}
                center                
            >
                <div style={modalContentStyle}>
                    <div>
                    <h1 style={mainTextStyle}>
                        <strong>
                            DO YOU LIKE OUR APP?
                        </strong>
                    </h1>    
                    {/* images get rendered from static folder for nextjs */}
                    <img style={starsStyle} src={'../static/review-stars.png'}/>
                    <p style={subTextStyle}>If so, please leave us a nice review!</p>                    
                    <ButtonGroup fullWidth={true} style={buttonStyle}>
                        <Button onClick={() => {
                            this.setState({open:false, closed:true})
                            Cookies.set('stop-review', true, {expires: 1})
                        }}>Later</Button>
                        <Button onClick={this.redirectToReviews} primary>Sure!</Button>
                    </ButtonGroup>
                    </div>                               
                </div>
            </Modal>
        )
    }

    //Directs user to the review app page after user clicks on yes. Must use polaris app bridge if using embedded app
    redirectToReviews = () => {
        if (!keys.EMBEDDED) { window.open(keys.REVIEW_URL, '_blank'); return }
        const redirect = Redirect.create(this.context.polaris.appBridge);        
        redirect.dispatch(Redirect.Action.REMOTE, {
            url: keys.REVIEW_URL,
            newContext: true,
        });
    };

    //Every week after the user has installed the app, show the modal.
    reviewShouldShow() {
        const stopReview = Cookies.get('stop-review')     
        //1 second delay for cookies and user experience   
        setTimeout(() => {
            if (this.state.closed || stopReview || !this.props.getUserReducer.shop) { return false }

            const a = new Date(this.props.getUserReducer.payment.date)
            const b = new Date()
            if (a) {
                const _MS_PER_DAY = 1000 * 60 * 60 * 24;
                // a and b are javascript Date objects
                // Discard the time and time-zone information.
                const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            
                const dayDifference = Math.floor((utc2 - utc1) / _MS_PER_DAY);

                if (dayDifference % 7 == 0 && dayDifference != 0) {
                    this.setState({open: true})
                } else {
                    this.setState({open: false})
                }
            }            
        }, 1000)            
    }
}

//We need the user from the reducer to get install date
function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

const mainTextStyle = {
    textAlign: "center",
    fontSize: 30,    
}

const subTextStyle = {
    textAlign: "center",
    fontSize: 20,    
    paddingBottom: 30
}

const buttonStyle = {
    padding: 10
}

const starsStyle = {    
    width: 330,    
    padding: 30
}

const modalContentStyle = {
    display: 'flex',
    height: '330px',
    width: '500px',    
    alignItems: "center",
    justifyContent: "center",    
}

export default connect(mapStateToProps, null)(ReviewModal);
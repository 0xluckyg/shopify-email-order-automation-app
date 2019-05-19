import {         
    CalloutCard
} from '@shopify/polaris';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';

//A pop up to ask users to write a review
class GmailAuth extends React.Component {    
    constructor(props){
        super(props)                          
        
    }    

    render() {         
        return(
            <CalloutCard
                title="Link Gmail"
                illustration="../static/gmail.svg"
                primaryAction={{
                    content: 'Authorize',
                    onAction: () => {

                    }
                }}
            >
            <p>Link your Gmail address to send order emails from your account.</p>
            </CalloutCard>   
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(GmailAuth);
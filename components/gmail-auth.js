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
                illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                primaryAction={{
                    content: 'Reauthorize',
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
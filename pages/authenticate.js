import {     
    TopBar,        
    Card, 
    ActionList, 
    Frame,
    Loading,       
    TextField,
    Button 
} from '@shopify/polaris';
import {connect} from 'react-redux';
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {showToastAction} from '../redux/actions';
import Toast from '../components/toast';
import ContactUs from './contact-us';
import Faq from './faq';
import * as keys from '../config/keys';

class Authenticate extends React.Component {
    constructor(props) {
        super(props)
        
        this.redirectToReviews = this.redirectToReviews.bind(this);
    }

    state = {         
        searchActive: false,
        searchText: '',
        userMenuOpen: false,
        searchOptions: this.searchOptions,
        showMobileNavigation: false,
        //Custom router and page status
        page: 0,
        modal: false,
        domain: ''
    };

    static contextTypes = {
        polaris: PropTypes.object,
    };


    //Search bar on the top bar
    searchOptions = [
        { 
            content: 'Sign In', 
            onAction: () => this.router(0)
        },        
        { 
            content: 'Contact Us', 
            onAction: () => this.router(1)
        },
        { 
            content: 'FAQs', 
            onAction: () => this.router(2)
        },
        {
            content: 'Leave a Review', 
            onAction: () => this.redirectToReviews()
        }
    ]

    render() {
        
    const {        
        searchActive,
        searchText,        
    } = this.state;

    const pages = [
        null,
        <ContactUs/>,
        <Faq/>
    ]

    const searchResultsMarkup = (
        <Card>            
            <ActionList items={this.state.searchOptions}/>
        </Card>
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={this.handleSearchFieldChange}
            value={searchText}
            placeholder="Search"
        />
    );
    
    const topBarMarkup = (
        <TopBar            
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={this.handleSearchResultsDismiss}
        />
    );

    const loadingMarkup = this.props.isLoadingReducer ? <Loading /> : null;    
    const toastMarkup = this.props.showToastReducer.show ? 
                        Toast(this.props.showToastReducer.text, 
                        (bool) => { this.props.showToastAction(bool) }) : null;    
    return (
        <Frame topBar={topBarMarkup}>            
            {loadingMarkup}
            <div style={outerWrapper}>
                <div style={pageWrapper}>
                    <Card>
                        <div style={cardWrapper}>
                            <div style={{margin:'40px', width: '300px'}}>
                                <img style={logoStyle} src={'../static/logo-color.svg'}/>
                                <p style={textStyle}>Shopify Domain</p>
                                <TextField                                    
                                    placeholder="(ex. kroco.myshopify.com)"
                                    value={this.state.domain}
                                    onChange={domain => this.setState({domain})}
                                    error={this.state.fieldError}
                                /><br/>
                                <div style={{marginBottom:'30px'}}>
                                <Button primary fullWidth onClick={this.authenticate}>Log In</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {pages[this.props.routerReducer]}
                </div>
            </div>
            {toastMarkup}            
        </Frame>                
    );
    }

    authenticate = () => {
        if (!this.state.domain.includes('myshopify.com')) {
            this.state.fieldError = 'Please provide a valid Shopify domain.'
            return
        }
        window.location.replace(`${process.env.APP_URL}/auth?shop=${this.state.domain}`)    
    }

    toggleState = (key) => {
        return () => {
            this.setState((prevState) => ({[key]: !prevState[key]}));
        };
    };

    //Shows menu options while user is using the search bar
    handleSearchFieldChange = (value) => {
        this.setState({searchText: value});
        if (value.length > 0) {
            this.setState({searchActive: true});
        } else {
            this.setState({searchActive: false});
        }
        this.filterAndUpdateOptions(value);
    };
    
    //Dynamic auto complete from the search bar
    filterAndUpdateOptions = (inputString) => {
        if (inputString === '') {
            this.setState({
                searchOptions: this.searchOptions,
            });
            return;
        }
    
        //Uses regex to filter out the options
        const filterRegex = new RegExp(inputString, 'i');
        let resultOptions = this.searchOptions.filter((option) =>
            option.content.match(filterRegex)
        );

        //Shows full menu if nothing matches
        (resultOptions.length == 0) ? resultOptions = this.searchOptions : resultOptions

        this.setState({
            searchOptions: resultOptions,
        });
    };

    //When the user closes the search option 
    handleSearchResultsDismiss = () => {
        this.setState(() => {
            return {
                searchActive: false,
                searchText: '',
                searchOptions: this.searchOptions
            };
        });
    };

    //Custom router
    router = (n) => this.setState({page:n})

    //For search option action for "write review"
    redirectToReviews() {
        if (!keys.EMBEDDED) { window.open(keys.REVIEW_URL, '_blank'); return }
        const redirect = Redirect.create(this.context.polaris.appBridge)
        redirect.dispatch(Redirect.Action.REMOTE, {
            url: keys.REVIEW_URL,
            newContext: true,
        });
    };
}

function mapStateToProps({routerReducer, isLoadingReducer, showToastReducer}) {
    return {routerReducer, isLoadingReducer, showToastReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

const logoStyle = {
    display: 'flex',     
    paddingBottom: '30px',
    margin: 'auto',     
    width: '300px',
    
}
const textStyle = { 
    marginBottom: '20px', 
    fontSize: '20px', 
    fontWeight: '300',
    textAlign: 'center' 
}
const outerWrapper = { display: 'flex', justifyContent: 'center' }
const pageWrapper = { width: '70%', padding: '30px 40px 40px 40px' }
const cardWrapper = { 
    display: 'flex', 
    height: '500px', 
    justifyContent: 'center',
    alignItems: 'center'
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
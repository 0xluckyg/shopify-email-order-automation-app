// https://polaris.shopify.com/components/get-started
// document.getElementById('html5').ondragstart = function () { return false; };
// https://medium.com/@marzouk/how-to-prevent-saving-image-as-or-dragging-image-to-download-it-in-a-web-page-f0ee4121b32f

import {     
    TopBar,        
    Card, 
    ActionList, 
    Frame,
    Loading,        
} from '@shopify/polaris';
import {connect} from 'react-redux';
import { Redirect } from '@shopify/app-bridge/actions';
import * as PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {getUserAction, routerAction, showToastAction, isDirtyAction} from '../redux/actions';
import NavigationMarkup from '../components/navigation';
import SaveBar from '../components/save-bar';
import UserPreviewMarkup from '../components/user-preview';
import Toast from '../components/toast';
import ReviewModal from "../components/review-modal";
import AddRule from './add-rule';
import Rules from './rules';
import Orders from './orders';
import Settings from './settings';
import ContactUs from './contact-us';
import Faq from './faq';
import * as keys from '../config/keys';

class Index extends React.Component {
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
        shop: this.props.getUserReducer.shop,
        //Custom router and page status
        page: 0,
        modal: false,        
    };

    static contextTypes = {
        polaris: PropTypes.object,
    };


    //Search bar on the top bar
    searchOptions = [
        { 
            content: 'Contact Us', 
            onAction: () => this.router(keys.CONTACT_US_INDEX)
        },
        { 
            content: 'FAQs', 
            onAction: () => this.router(keys.FAQ_INDEX)
        },
        {
            content: 'Leave a Review', 
            onAction: () => this.redirectToReviews()
        },            
    ]

    static getDerivedStateFromProps(nextProps) {
        const shop = nextProps.getUserReducer.shop                        
        return ({shop})
    }

    componentDidMount() {
        //get user and save it to the reducer on app mount        
        if (!this.props.getUserReducer.shop) {            
            this.props.getUserAction();
        }
    }

    render() {
        
    const {        
        searchActive,
        searchText,
        showMobileNavigation,
    } = this.state;

    const pages = [
        <Orders/>,
        <Rules/>,        
        <AddRule/>,        
        <Settings/>,
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
            showNavigationToggle={true}
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={this.handleSearchResultsDismiss}
            userMenu={UserPreviewMarkup(this.state, this.toggleState, this.router, this.redirectToReviews)}
            onNavigationToggle={this.toggleState('showMobileNavigation')}
        />
    );

    const loadingMarkup = this.props.isLoadingReducer ? <Loading /> : null;    
    const toastMarkup = this.props.showToastReducer.show ? 
                        Toast(this.props.showToastReducer.text, 
                        (bool) => { this.props.showToastAction(bool) }) : null;
    const contextualSaveBarMarkup = this.props.isDirtyReducer.isDirty ? 
                                    SaveBar(this.props.isDirtyReducer.onSave, 
                                    (bool, func) => { this.props.isDirtyAction(bool, func) }, 
                                    (bool, text) => { this.props.showToastAction(bool, text) }) : null;        
    return (
        <Frame
            topBar={topBarMarkup}
            showMobileNavigation={showMobileNavigation}
            navigation={NavigationMarkup(this.router)}
            //Enables sliding navigation bar on mobile
            onNavigationDismiss={this.toggleState('showMobileNavigation')}            
        >
            {contextualSaveBarMarkup}
            {loadingMarkup}
            <div style={pageWrapper}>
                {pages[this.props.routerReducer]}
            </div>
            {toastMarkup}
            <ReviewModal/>
        </Frame>                
    );
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
    router = (n) => this.props.routerAction(n)

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

function mapStateToProps({routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer}) {
    return {routerReducer, isDirtyReducer, isLoadingReducer, showToastReducer, getUserReducer};
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {getUserAction, routerAction, showToastAction, isDirtyAction},
        dispatch
    );
}

const pageWrapper = { padding: '30px 40px 40px 40px' }

export default connect(mapStateToProps, mapDispatchToProps)(Index);
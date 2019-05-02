import {
    ResourceList,    
    Card,        
    Button,
    Pagination,
    Layout,
    Badge
} from '@shopify/polaris';
import axios from 'axios';
import RuleDetailModal from '../components/rule-detail-modal.js';
import pageHeader from '../components/page-header'
import NoContent from '../components/no-content'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction, routerAction} from '../redux/actions';

class Rules extends React.Component {   
    mounted = false 
    constructor(props) {
        super(props)
        
        this.state = {        
            totalRulesCount: 0,
            rules: [],
            rulesLoading: true,
            showDetail: false,
            ruleDetail: {},
            perPage: 10,
            currentPage: 1,
            editButtonIsLoading: false,
            removeButtonIsLoading: false
        };   
    }     


    componentDidMount() {        
        this.mounted = true
        this.fetchEmailRules({ skip: 0 });                   
    }
    
    componentWillUnmount() {
        this.mounted = false
    }

    fetchEmailRules(params, changePage) {        
        this.setState({rulesLoading: true})
        axios.get(process.env.APP_URL + '/get-rules', {
            params,
            withCredentials: true
        }).then(res => {
            if (!this.mounted) return
            let currentPage = this.state.currentPage;            
            if (changePage) currentPage = changePage()            
            const {total, rules} = res.data
            this.setState({
                totalRulesCount: total,
                rulesLoading: false,
                rules,
                hasNext: this.hasNext(currentPage, total),
                hasPrevious: this.hasPrevious(currentPage)
            })
        }).catch(err => {
            if (!this.mounted) return
            this.setState({rulesLoading: false})
            this.props.showToastAction(true, "Couldn't get rules. Please refresh.")
            console.log('err getting rules, ', err)
        })
    }

    makeSelectionDescription(filters, selectedItems) {   
        if (!filters) return
        if (filters.length == 0 && selectedItems.length == 0) return 'All products selected'
        if (selectedItems.length > 0) return `${selectedItems.length} custom items selected`        
        let queryString = 'Products where '
        for (let i = 0; i < filters.length; i ++) {    
            let key = filters[i].key
            if (key == 'product_type') key = 'product type'
            queryString = queryString + key + ' is ' + filters[i].value
            if (i != filters.length - 1) queryString = queryString + ' OR '                        
        }
        return queryString
    }

    makeEmailDescription(emails) {        
        const text = (emails.length > 1) ? `${emails.length} emails` : emails[0]
        return (
            <Badge>{text}</Badge>
        )
    }

    refreshCurrentPage() {
        this.fetchEmailRules({ skip: (currentPage * perPage) - perPage })
    }

    removeRule() {
        this.setState({rulesLoading: true})
        axios.post(process.env.APP_URL + '/remove-rule', {_id})
        .then(() => {            
            if (!this.mounted) return
            this.refreshCurrentPage()
            this.props.showToastAction(true, 'Rule removed!')
        }).catch(() => {   
            if (!this.mounted) return
            this.setState({rulesLoading: false})
            this.props.showToastAction(true, "Couldn't save. Please Try Again Later.")
        })    
    }

    renderItem = (item) => {
        const { _id, filters, selectedProducts, emails } = item;
        return (
            <ResourceList.Item
                id={_id}                                
                persistActions
            >
                <div style={{display:"flex", justifyContent: "space-between"}}>
                    <p style={{width:"45%"}}>{this.makeSelectionDescription(filters, selectedProducts)}</p>                                                      
                    {this.makeEmailDescription(emails)}
                    
                    <div>
                        <div style={rowButtonStyle}>
                            <Button 
                                onClick={() => this.setState({ruleDetail: item, showDetail:true})} 
                                size="slim">
                                Edit / View Detail
                            </Button>
                        </div>
                        <div style={rowButtonStyle}>
                            <Button onClick={this.removeRule} size="slim">
                                Remove
                            </Button>
                        </div>                
                    </div>
                </div>                
            </ResourceList.Item>
        );
    };

    hasPrevious(currentPage) {        
        return (currentPage == 1) ? false : true
    }

    hasNext(currentPage, totalRulesCount) {              
        const {perPage} = this.state
        const totalPages = Math.ceil(totalRulesCount / perPage)
        return (totalRulesCount == 0 || currentPage == totalPages) ? false : true
    }

    renderNoContent() {
        if (this.state.rules.length != 0 || this.state.rulesLoading) return null
        return (
            <NoContent
                logo='../static/email.svg'
                text='Set up some rules to automate orders!'
                action={() => this.props.routerAction(2)}
                actionText='Create a Rule'          
            />
        )
    }

    render() {
        const resourceName = {
            singular: 'rule',
            plural: 'rules',
        };
        return (
        <Layout>
            <RuleDetailModal 
                open={this.state.showDetail} 
                detail={this.state.ruleDetail} 
                close={() => { 
                    this.setState({showDetail:false})                    
                 }}
                 onUpdate={update => {
                    let rules = this.state.rules                    
                    const index = rules.findIndex((r => r._id == update._id))
                    if (index < 0) return
                    rules[index] = update
                    this.setState({rules})
                 }}
            />
            <Layout.Section>       
                {pageHeader('Rules')}
                <Card>
                    {this.renderNoContent()}
                    <ResourceList
                        resourceName={resourceName}
                        items={this.state.rules}
                        renderItem={this.renderItem}
                        loading={this.state.rulesLoading}
                    />
                    <div style={paginationWrapper}>
                        <Pagination
                            hasPrevious={this.state.hasPrevious}
                            onPrevious={() => {
                                let {currentPage, perPage} = this.state
                                this.setState({hasNext: false, hasPrevious: false});                                
                                this.fetchEmailRules({
                                    skip: ((currentPage - 1) * perPage) - perPage
                                }, () => {         
                                    currentPage = currentPage - 1;                           
                                    this.setState({currentPage})                                    
                                    return currentPage
                                })
                            }}
                            hasNext={this.state.hasNext}
                            onNext={() => {
                                this.setState({hasNext: false, hasPrevious: false});
                                let {currentPage, perPage} = this.state
                                this.fetchEmailRules({
                                    skip: currentPage * perPage
                                }, () => {
                                    currentPage = currentPage + 1;
                                    this.setState({currentPage})                                    
                                    return currentPage
                                })
                            }}
                        />                    
                    </div>                    
                </Card>
            </Layout.Section>  
        </Layout>        
        );
    }
}

const paginationWrapper = {float:"left", padding: "16px"}
const rowButtonStyle = {display: "inline", paddingRight:"10px"}


function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction, routerAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Rules);
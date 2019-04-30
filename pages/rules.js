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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';

class Rules extends React.Component {    
    constructor(props) {
        super(props)
        
        this.state = {        
            totalRulesCount: 0,
            rules: [{    
                shop: 'miraekomerco.myshopify.com',
                filters: [ {key: 'vendor', value: 'jaypro'} ],
                selectedProducts: [],                                
                emails: ['soigjeg@gmail.com']
            },{    
                shop: 'miraekomerco.myshopify.com',
                filters: [ {key: 'vendor', value: 'fisher'} ],
                selectedProducts: [],                                
                emails: ['soigjeg@gmail.com', 'ejgij@gmail.com', 'reohij@gmail.com']
            },{    
                shop: 'miraekomerco.myshopify.com',
                filters: [],
                selectedProducts: [],                                
                emails: ['soigjeg@gmail.com', 'ejgij@gmail.com', 'reohij@gmail.com']
            }],
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
        this.fetchEmailRules({ skip: 0 });           
    }

    fetchEmailRules(params, changePage) {        
        axios.get(process.env.APP_URL + '/get-email-rules', {
            params,
            withCredentials: true
        }).then(res => {
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

    renderItem = (item) => {
        const { _id, filters, selectedProducts, emails, createdAt, updatedAt } = item;
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
                            <Button onClick={() => {
                                
                            }} size="slim">
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
                close={() => this.setState({showDetail:false})}
            />
            <Layout.Section>       
                {pageHeader('Rules')}
                <Card>
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
                                this.setState({hasNext: false, hasPrevious: false, rulesLoading: true});                                
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
                                this.setState({hasNext: false, hasPrevious: false, rulesLoading: true});
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
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Rules);
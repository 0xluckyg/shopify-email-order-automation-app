import {
    ResourceList,    
    Card,        
    Button,
    Pagination,
    Layout,
    Badge
} from '@shopify/polaris';
import axios from 'axios';
import OrderDetailModal from '../components/order-detail-modal.js';
import pageHeader from '../components/page-header'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';

class Orders extends React.Component {    
    constructor(props) {
        super(props)
        
        this.state = {        
            totalOrdersCount: 0,
            orders: [],            
            showDetail: false,
            orderDetail: {},
            perPage: 10,
            currentPage: 1,
            ordersLoading: true,
            revertButtonIsLoading: false,
            restoreButtonIsLoading: false
        };   
    }     

    componentDidMount() {
        this.fetchOrders({ skip: 0 });
    }

    fetchOrders(params, changePage) {        
        axios.get(process.env.APP_URL + '/get-orders', {
            params,
            withCredentials: true
        }).then(res => {
            let currentPage = this.state.currentPage;            
            if (changePage) currentPage = changePage()            
            const {total, orders} = res.data
            this.setState({
                totalOrdersCount: total,
                ordersLoading: false,
                orders,
                hasNext: this.hasNext(currentPage, total),
                hasPrevious: this.hasPrevious(currentPage)
            })
        }).catch(err => {
            this.setState({ordersLoading: false})
            this.props.showToastAction(true, "Couldn't get orders. Please refresh.")
            console.log('err getting orders, ', err)
        })
    }

    renderItem = (item) => {
        const { _id, products, emails, status, total, createdAt, customer, orderNumber, emailSent, } = item;
        return (
            <ResourceList.Item
                id={_id}                                
                persistActions
            >
                <div style={{display:"flex", justifyContent: "space-between"}}>
                    <p style={{width:"45%"}}></p>
                    <div>
                        <div style={rowButtonStyle}>
                            <Button 
                                onClick={() => this.setState({orderDetail: item, showDetail:true})} 
                                size="slim">
                                View Details
                            </Button>
                        </div>
                        <div style={rowButtonStyle}>
                            <Button onClick={() => {
                                
                            }} primary size="slim">
                                Send Emails
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

    hasNext(currentPage, totalOrdersCount) {              
        const {perPage} = this.state
        const totalPages = Math.ceil(totalOrdersCount / perPage)
        return (totalOrdersCount == 0 || currentPage == totalPages) ? false : true
    }

    render() {
        const resourceName = {
            singular: 'order',
            plural: 'orders',
        };
        return (
        <Layout>
            <OrderDetailModal 
                open={this.state.showDetail} 
                detail={this.state.orderDetail} 
                close={() => this.setState({showDetail:false})}
            />
            <Layout.Section>       
                {pageHeader('Orders')}
                <Card>
                    <ResourceList
                        resourceName={resourceName}
                        items={this.state.orders}
                        renderItem={this.renderItem}
                        loading={this.state.ordersLoading}
                    />
                    <div style={paginationWrapper}>
                        <Pagination
                            hasPrevious={this.state.hasPrevious}
                            onPrevious={() => {
                                let {currentPage, perPage} = this.state
                                this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});                                
                                this.fetchOrders({
                                    skip: ((currentPage - 1) * perPage) - perPage
                                }, () => {         
                                    currentPage = currentPage - 1;                           
                                    this.setState({currentPage})                                    
                                    return currentPage
                                })
                            }}
                            hasNext={this.state.hasNext}
                            onNext={() => {
                                this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});
                                let {currentPage, perPage} = this.state
                                this.fetchOrders({
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

export default connect(null, mapDispatchToProps)(Orders);
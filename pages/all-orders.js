import {
    ResourceList,          
    Button,
    Pagination,    
    Badge
} from '@shopify/polaris';
import axios from 'axios';
import OrderDetailModal from '../components/order-detail-modal.js';
import NoContent from '../components/no-content'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction} from '../redux/actions';

class Orders extends React.Component {    
    constructor(props) {
        super(props)
        
        this.state = {            
            orders: [],
            showDetail: false,
            orderDetail: {},
            page: 1,
            hasPrevious: false,
            hasNext: false,
            ordersLoading: true,
        };
    }     

    componentDidMount() {
        this.fetchOrders({ page: 1 });
    }

    fetchOrders(params) {        
        this.setState({ ordersLoading: true })
        axios.get(process.env.APP_URL + '/get-orders', {
            params,
            withCredentials: true
        }).then(res => {            
            const {orders, page, hasNext, hasPrevious} = res.data            
            this.setState({ orders, page, hasNext, hasPrevious, ordersLoading: false })
        }).catch(err => {
            this.setState({ordersLoading: false})
            this.props.showToastAction(true, "Couldn't get orders. Please refresh.")
            console.log('err getting orders, ', err)
        })
    }

    renderItem = (item) => {        
        const { id, total_price, currency, processed_at, order_number, customer, line_items, shipping_address  } = item;
        const { email, first_name, last_name, phone, orders_count, total_spent } = customer
        const { address1, address2, city, company, country, province, province_code, zip } = shipping_address        
        const date = new Date(processed_at)
        const dateString = `${this.formatDate(date)} ${date.getHours()}:${date.getMinutes()}` 
        return (
            <ResourceList.Item
                id={id}
                persistActions
            >
                <div style={{display:"flex", justifyContent: "space-between"}}>                                      
                    <div style={{width:"15%"}}><Badge>#{order_number}</Badge></div>
                    <div style={{width:"20%"}}>{dateString}</div>
                    <div style={{width:"20%"}}>{first_name} {last_name}</div>
                    <div style={{width:"10%"}}>{total_price} {currency}</div>
                    <div style={{width:"10%"}}>{line_items.length}</div>
                    
                    <div style={{width: "10%"}}>
                        <Button 
                            onClick={() => this.setState({orderDetail: item, showDetail:true})} 
                            size="slim">
                            Details
                        </Button>
                    </div>                                                          
                </div>                
            </ResourceList.Item>
        );
    };

    renderNoContent() {        
        if (this.state.orders.length != 0 || this.state.ordersLoading) return null
        return (
            <NoContent
                logo='../static/shopping-bag.svg'
                text='Your store has no orders yet!'
            />
        )
    }

    formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    }

    onPrevious = () => {
        let page = Number(this.state.page) - 1      
        this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});
        this.fetchOrders({page})
    }

    onNext = () => {
        let page = Number(this.state.page) + 1       
        this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});
        this.fetchOrders({page})
    }

    render() {
        const resourceName = {
            singular: 'order',
            plural: 'orders',
        };
        return (        
            <div>
                <OrderDetailModal 
                    open={this.state.showDetail} 
                    detail={this.state.orderDetail} 
                    close={() => this.setState({showDetail:false})}
                />                
                <div style={{display:"flex", justifyContent: "space-between", margin: "20px"}}>                                      
                    <div style={{width:"15%"}}><b>Order Number</b></div>
                    <div style={{width:"20%"}}><b>Date Ordered</b></div>
                    <div style={{width:"20%"}}><b>Customer Name</b></div>
                    <div style={{width:"10%"}}><b>Price</b></div>
                    <div style={{width:"10%"}}><b>Products</b></div>                            
                    <div style={{width: "10%"}}><b>Show Details</b></div>
                </div>        
                {this.renderNoContent()}
                <ResourceList
                    resourceName={resourceName}
                    items={this.state.orders}
                    renderItem={this.renderItem}
                    loading={this.state.ordersLoading}
                />
                <div style={paginationWrapper}>
                    <Pagination
                        hasPrevious={this.state.hasPrevious}
                        onPrevious={this.onPrevious}
                        hasNext={this.state.hasNext}
                        onNext={this.onNext}
                    />                    
                </div>          
            </div>
        );
    }
}

const paginationWrapper = {float:"left", padding: "16px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Orders);
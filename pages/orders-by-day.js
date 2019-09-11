import {
    ResourceList,      
    Button,
    Pagination,    
    Badge
} from '@shopify/polaris';
import axios from 'axios';
import OrderDetailModal from '../components/order-detail-modal.js';
import NoContent from '../components/no-content'
import sentStatus from '../components/order-sent-status'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Modal from "react-responsive-modal";
import {showToastAction, showPaymentPlanAction} from '../redux/actions';
import EmailPreview from '../components/email-preview';

class OrdersByDay extends React.Component {    
    constructor(props) {
        super(props)
        
        this.state = {
            orders: [],
            showDetail: false,
            showOrderPreview: false,
            orderDetail: {},
            previewDetail: {},
            page: 1,
            hasPrevious: false,
            hasNext: false,
            ordersLoading: true,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.date !== this.props.date) {            
            this.fetchOrders({page: 1, date: this.props.date})
        }
    }

    componentDidMount() {
        this.fetchOrders({ page: 1, date: this.props.date });
    }

    fetchOrders(params) {
        this.setState({ordersLoading: true, hasNext: false, hasPrevious: false}) 
        axios.get(process.env.APP_URL + '/get-orders', {
            params,
            withCredentials: true
        }).then(res => {
            const {orders, page, hasNext, hasPrevious} = res.data            
            this.setState({ orders, page, hasNext, hasPrevious, ordersLoading: false })
        }).catch(err => {
            this.setState({ordersLoading: false})
            this.props.showToastAction(true, "Couldn't get orders. Please refresh.")
            console.log('Failed getting orders: ', err)
        })
    }

    getAllOrdersForDay = () => {        
        this.setState({ showOrderPreview: true, previewLoading: true })
        axios.get(process.env.APP_URL + '/get-day-orders', {
            params: {
                date: this.props.date
            },
            withCredentials: true
        }).then(res => {                     
            this.setState({ previewDetail: res.data, previewLoading: false })
        }).catch(err => {
            this.setState({ showOrderPreview: false })
            this.props.showToastAction(true, "Couldn't get order preview. Please refresh.")
            console.log('Failed getting preview: ', err)
        })
    }

    renderItem = (item) => {        
        const { id, total_price, currency, created_at, order_number, customer, line_items, shipping_address  } = item;
        const { first_name, last_name } = customer
        const date = new Date(created_at)
        const dateString = `${this.formatDate(date)} ${date.getHours()}:${date.getMinutes()}` 
        return (
            <ResourceList.Item
                id={id}
                persistActions
            >
                <div style={{display:"flex", justifyContent: "space-between"}}>                                      
                    <div style={{width:"10%"}}><Badge>#{order_number}</Badge></div>                    
                    <div style={{width:"15%"}}>{dateString}</div>
                    <div style={{width:"15%"}}>{sentStatus(line_items)}</div>
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
                text={`No orders on ${this.formatDate(this.props.date)}!`}
            />
        )
    }

    formatDate(date) {        
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    }

    onPrevious() {
        let page = Number(this.state.page) - 1      
        this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});
        this.fetchOrders({page, date: this.props.date})
    }

    onNext() {
        let page = Number(this.state.page) + 1       
        this.setState({hasNext: false, hasPrevious: false, ordersLoading: true});
        this.fetchOrders({page, date: this.props.date})
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
                    reload={() => {                        
                        this.fetchOrders({page: Number(this.state.page), date: this.props.date})
                        this.setState({showDetail:false})
                    }}
                />
                <Modal 
                    open={this.state.showOrderPreview}                
                    onClose={() => this.setState({showOrderPreview:false, previewDetail:{}})}
                    showCloseIcon={true}
                    center
                >
                    <EmailPreview 
                        date={this.props.date}
                        loading={this.state.previewLoading}                        
                        detail={this.state.previewDetail}
                        reload={() => {                        
                            this.fetchOrders({page: Number(this.state.page), date: this.props.date})
                            this.setState({showOrderPreview:false})
                        }}
                    />
                </Modal>
                <div style={{margin: '15px'}}>
                    <Button 
                        primary 
                        disabled={(this.state.orders.length == 0)}
                        onClick={this.getAllOrdersForDay}
                    >
                        Send all orders for {this.formatDate(this.props.date)}
                    </Button>
                </div>     
                <div style={{display:"flex", justifyContent: "space-between", margin: "20px"}}>                                      
                    <div style={{width:"10%"}}><b>Order #</b></div>                    
                    <div style={{width:"15%"}}><b>Date Ordered</b></div>
                    <div style={{width:"15%"}}><b>Sent Status</b></div>
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
                        onPrevious={() => this.onPrevious()}
                        hasNext={this.state.hasNext}
                        onNext={() => this.onNext()}
                    />                  
                    <div>
                        <div style={rowButtonStyle}>
                            <Button 
                                onClick={this.props.dayBefore} 
                                size="slim">
                                Day Before
                            </Button>
                        </div>
                        <div style={rowButtonStyle}>
                            <Button onClick={this.props.dayAfter} size="slim">
                                Day After
                            </Button>
                        </div>                
                    </div>  
                </div>          
            </div>
        );
    }
}

const paginationWrapper = {display: 'flex', justifyContent:'space-between', padding: "16px"}
const rowButtonStyle = {display: "inline", paddingRight:"10px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, showPaymentPlanAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(OrdersByDay);
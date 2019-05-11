import {         
    ResourceList,    
    Card,    
    Button,
    Layout,
    Badge
} from '@shopify/polaris';
import Modal from "react-responsive-modal";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';

//A pop up to ask users to write a review
class OrderDetailModal extends React.Component {    
    constructor(props){
        super(props)                          
        this.state = {                                    
            
        }
    }    

    redirectToProductPage = (id) => {
        window.open(`https://${this.props.getUserReducer.shop}/admin/products/${id}`, '_blank')
    }

    renderItem = (item) => {        
        const { product_id, title, quantity, sku, price, variant_title, vendor, emails } = item
        return (
            <ResourceList.Item
                id={product_id}                                
                accessibilityLabel={`View details for ${title}`}
            >
            <div ><b>{title}</b></div>
            <div style={{display:'flex', justifyContent: 'space-between'}}>                
                {(variant_title) ? <div >{variant_title}</div> : null}
                <div >Quantity: {quantity}</div>
                <div >${price}</div>
                {(vendor) ? <div >{vendor}</div> : null}
                {(sku) ? <div >{sku}</div> : null}                
            </div>
            <div >
                <Button onClick={() => this.redirectToProductPage(product_id)} plain>
                    View product
                </Button>
            </div>
            </ResourceList.Item>
        );
    };    

    showProducts() {        
        return (
            <Card>                
                <div style={productSelectBoxStyle}>
                <Card>                
                    <ResourceList
                        resourceName={{ singular: 'product', plural: 'products' }}
                        items={this.props.detail.line_items}
                        renderItem={this.renderItem}
                    />    
                </Card>
                </div>
            </Card>
        )       
    }

    showCustomer() {        
        if (Object.keys(this.props.detail).length === 0) return
        const { email, first_name, last_name, phone, orders_count, total_spent } = this.props.detail.customer        
        return (
            <Card>
                <div style={{margin:'20px'}}>
                <p><b>Customer</b></p>
                {(first_name && last_name) ? <p><b>Name:</b> {first_name} {last_name}</p> : null}
                {(email) ? <p><b>Email:</b> {email}</p> : null}
                {(phone) ? <p><b>Phone:</b> {phone}</p> : null}
                {(orders_count) ? <p ><b>Total orders:</b> {orders_count}</p> : null}
                {(total_spent) ? <p ><b>Total spent:</b> ${total_spent}</p> : null}
                </div>
            </Card>
        )
    }

    showAddress() {
        if (Object.keys(this.props.detail).length === 0) return
        const { address1, address2, city, company, country, province, province_code, zip } = this.props.detail.shipping_address        
        return (
            <Card>
                <div style={{margin:'20px'}}>
                <p><b>Shipping Address</b></p>
                {(country) ? <p ><b>Country:</b> {country}</p> : null}                
                {(province && province_code) ? <p ><b>Province:</b> {province} {province_code}</p> : null}
                {(city) ? <p ><b>City:</b> {city}</p> : null}            
                {(address1) ? <p ><b>Address1:</b> {address1}</p> : null}
                {(address2) ? <p ><b>Address2:</b> {address2}</p> : null}                
                {(zip) ? <p ><b>Zip Code:</b> {zip}</p> : null}                      
                {(company) ? <p ><b>Company:</b> {company}</p> : null}    
                </div>  
            </Card>
        )
    }

    handleAction() {

    }

    render() {        
        return(
            <Modal 
                open={this.props.open}                
                onClose={this.props.close}
                showCloseIcon={true}
                center
            >
                <div style={modalContentStyle}>
                    <Layout>
                        <Layout.Section>
                            {this.showProducts()}
                            {this.showCustomer()}
                            {this.showAddress()}
                            <div style={finalButtonStyle}>
                                <Button primary size="large" onClick={this.props.close}>Close</Button>
                            </div>
                        </Layout.Section>  
                    </Layout>  
                </div>
            </Modal>
        )
    }
}

const modalContentStyle = {
    padding: '30px',
    display: 'flex',
    width: '700px',
    overflowY: 'auto',
    alignItems: "center",
    justifyContent: "center",    
}
const productSelectBoxStyle = {maxHeight: '300px', minWidth: '650px', overflowX: 'auto'}
const finalButtonStyle = {float:"right", padding: "16px 0px 16px 0px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailModal);
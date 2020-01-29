import {         
    ResourceList,    
    Card,    
    Button,
    Layout,    
    Tag,
    TextField
} from '@shopify/polaris';
import axios from 'axios';
import Modal from "react-responsive-modal";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';
import emailValidator from "email-validator";
import EmailPreview from './email-preview'
import React from 'react'

//A pop up to ask users to write a review
class OrderDetailModal extends React.Component {    
    constructor(props){
        super(props)                          
        this.state = {                                    
            additionalEmails: [],
            emailErrors: [],
            orderDetail: {},
            isSending: false,
            showEmailPreview: false
        }
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.detail === prevState.orderDetail 
            || Object.keys(nextProps.detail).length == 0) return null
        const orderDetail = nextProps.detail                
        let additionalEmails = []; let emailErrors = [];
        orderDetail.line_items.map(() => {
            additionalEmails.push('')
            emailErrors.push('')
        })
        return ({orderDetail, additionalEmails, emailErrors})
    }

    redirectToProductPage = (id) => {
        window.open(`https://${this.props.getUserReducer.shop}/admin/products/${id}`, '_blank')
    }

    renderCircleMark = (positive) => {
        if (positive) {
            return <div style={{ margin: '2.5px 5px 2.5px 0px', float: 'left', width:'15px', height:'15px',  borderRadius:'7.5px', backgroundColor: "#bbe5b3"}}></div>
        } else {
            return null
        }
    }

    renderEmailTags(emails, index) {
        return (
            <div style={{width: '80%'}}>
                {emails.map((email, i) => {
                    return (
                    <div key={`${index}${i}`} style={{display: 'inline-block', margin: '10px 10px 0px 0px'}}>
                        <Tag onRemove={() => {
                            let orderDetail = this.state.orderDetail
                            let emailRules = orderDetail.line_items[index].email_rules.filter(e => e.email !== email.email)
                            orderDetail.line_items[index].email_rules = emailRules
                            this.setState({orderDetail})
                        }}>{this.renderCircleMark(email.sent)}{email.email}</Tag>
                    </div>
                    )
                })}                
            </div>
        )
    }

    renderEmailTextField(index) {
        return (
            <div style={{marginTop: '10px', display:'flex', justifyContent: 'space-between'}}>
                <div style={{width:'80%'}}>
                    <TextField
                        placeholder="Add Email (ex. kroco@gmail.com)"
                        value={this.state.additionalEmails[index]}
                        onChange={(email) => {
                            let additionalEmails = this.state.additionalEmails                            
                            additionalEmails[index] = email
                            this.setState({additionalEmails})
                        }}
                        error={this.state.emailErrors[index]}
                    />
                </div>
                <div style={{width:'15%'}}>
                    <Button primary fullWidth onClick={() => {
                        if (!emailValidator.url(this.state.additionalEmails[index])) {                            
                            let emailErrors = this.state.emailErrors
                            emailErrors[index] = "Please provide a valid email"
                            return this.setState({emailErrors})                                                        
                        }
                        let {additionalEmails, emailErrors} = this.state                        
                        
                        //save new added email
                        let orderDetail = this.state.orderDetail                        
                        orderDetail.line_items[index].email_rules.push({email: additionalEmails[index], sent: false})                        
                        //reset errors and textfield
                        additionalEmails[index] = ''
                        emailErrors[index] = ''

                        this.setState({orderDetail, emailErrors, additionalEmails})
                    }}>
                        Add
                    </Button>
                </div>
            </div>
        )
    }

    renderItem = (item) => {        
        const { product_id, title, variant_id, quantity, sku, price, variant_title, vendor, email_rules } = item        
        const index = this.state.orderDetail.line_items.findIndex(item => item.variant_id == variant_id)        
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
            <div>
                <Button onClick={() => this.redirectToProductPage(product_id)} plain>
                    View product
                </Button>
            </div>
            {this.renderEmailTags(email_rules, index)}
            {this.renderEmailTextField(index)}
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
                        items={this.state.orderDetail.line_items}
                        renderItem={this.renderItem}
                    />    
                </Card>
                </div>
            </Card>
        )       
    }

    showCustomer() {        
        if (Object.keys(this.state.orderDetail).length === 0) return
        const { email, first_name, last_name, phone, orders_count, total_spent } = this.state.orderDetail.customer        
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
        if (Object.keys(this.state.orderDetail).length === 0) return
        const { address1, address2, city, company, country, province, province_code, zip } = this.state.orderDetail.shipping_address        
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

    createEmailObject(emails, order, item, email) {        
        if (email.sent) return emails    
    
        if (!emails[email.email]){ 
            emails[email.email] = {}
        }
        
        if (!emails[email.email][order.order_number]){
            emails[email.email][order.order_number] = {
                customer: order.customer,
                shipping_address: order.shipping_address,
                created_at: order.created_at,
                note: order.note,
                id: order.id,
                items: {}
            }
        }
    
        if (!emails[email.email][order.order_number].items[item.variant_id]) {
            emails[email.email][order.order_number].items[item.variant_id] = item
        } else {                
            emails[email.email][order.order_number].items[item.variant_id].quantity += 1
        }
        return emails
    }

    reformatOrdersByEmail() {
        let emails = {}
        const order = this.state.orderDetail        
        if (!order.line_items) return emails
        order.line_items.forEach(item => {
            item.email_rules.forEach(email => {
                emails = this.createEmailObject(emails, order, item, email)
            })
        })
        return emails
    }    

    sendEmail() {
        this.setState({isSending: true})
        axios.post(process.env.APP_URL + '/send-orders', {
            orders: this.reformatOrdersByEmail()
        })
        .then(() => {
            this.props.showToastAction(true, 'Order sent!')
            this.setState({isSending: false, showEmailPreview: false})
            this.props.reload()
        }).catch(() => {
            this.props.showToastAction(true, "Couldn't send. Please Try Again Later.")
            this.setState({isSending: false})
        })
    }

    hasNothingToSend() {
        const emails = this.reformatOrdersByEmail()        
        return (Object.keys(emails).length == 0)
    }

    render() {        
        return(
            <Modal 
                open={this.props.open}                
                onClose={() => {
                    this.setState({showEmailPreview:false})
                    this.props.close()
                }}
                showCloseIcon={true}
                center
            >
                {(!this.state.showEmailPreview) 
                ? 
                    <div style={modalContentStyle}>
                        <Layout>
                            <Layout.Section>                            
                                <div style={{margin: '0px 10px 15px 0px', float: 'left'}}><Tag>{this.renderCircleMark(true)}Email has been sent</Tag></div>
                                <div style={{margin: '0px 0px 15px 0px'}}><Tag>{this.renderCircleMark(false)}Email has not been sent</Tag></div> 
                                {this.showProducts()}
                                {this.showCustomer()}
                                {this.showAddress()}
                                <div style={{float:'right', marginTop: '20px'}}>
                                    <div style={rowButtonStyle}>
                                        <Button 
                                            onClick={() => this.setState({showEmailPreview:true})}
                                            loading={this.state.isSending}
                                            disabled={this.hasNothingToSend()}
                                        >
                                            Preview Orders
                                        </Button>
                                    </div>
                                    <div style={rowButtonStyle}>
                                        <Button 
                                            primary onClick={() => this.sendEmail()}
                                            loading={this.state.isSending}
                                            disabled={this.hasNothingToSend()}
                                        >
                                            Send Orders
                                        </Button>
                                    </div>                
                                </div>
                            </Layout.Section>  
                        </Layout>  
                    </div>
                :                
                    <EmailPreview 
                        loading={false}
                        detail={this.reformatOrdersByEmail()}
                        reload={() => {
                            this.setState({showEmailPreview: false})
                            this.props.reload()
                        }}
                    />
                }                
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
const productSelectBoxStyle = {minWidth: '650px'}
const rowButtonStyle = {display: "inline", margin:"16px 0px 0px 16px"}

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
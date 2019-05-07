import {         
    ResourceList,
    TextStyle,
    Card,    
    Button,
    Pagination,
    Layout    
} from '@shopify/polaris';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import { Redirect } from '@shopify/app-bridge/actions';
import Modal from "react-responsive-modal";
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction, isLoadingAction} from '../redux/actions';
import AddEmail from './add-email';

//A pop up to ask users to write a review
class RulesDetailModal extends React.Component {    
    mounted = false
    constructor(props){
        super(props)                          
        this.state = {
            productsAreLoading: true,        
            hasPreviousPage: false,
            hasNextPage: false,
            products: [],
            email: null,
            buttonIsLoading: false
        }
    }    
    static contextTypes = {
        polaris: PropTypes.object,
    };

    componentWillReceiveProps(newProps) {        
        {this.setState({email:newProps.detail.email})} 
    }
    componentDidMount() {        
        this.mounted = true        
    }

    componentWillUnmount() {
        this.mounted = false
    }

    fetchProducts(beforeCursor, afterCursor) {
        this.setState({hasNextPage: false, hasPreviousPage: false})
        const { filters, selectedProducts } = this.props.detail;        
        // const { addText, removeText, filters, selectedProducts, completed, count, editType, editMethod, editContentType, updatedAt } = this.props.detail;                
        axios.get(process.env.APP_URL + '/get-products', {
            params: {
                filters: JSON.stringify(filters), 
                selectedProducts: JSON.stringify(selectedProducts),
                afterCursor,
                beforeCursor
            },
            withCredentials: true
        }).then(res => {                        
            let hasPreviousPage; let hasNextPage; let products = []            
            if (selectedProducts.length > 0 || res.data.products == undefined) {
                hasPreviousPage = false, hasNextPage = false, products = res.data
            } else {                
                hasPreviousPage = res.data.products.pageInfo.hasPreviousPage
                hasNextPage = res.data.products.pageInfo.hasNextPage
                products = res.data.products.edges
            }                        
            this.setState({
                hasPreviousPage,
                hasNextPage,
                products,
                productsAreLoading: false
            })
        }).catch(err => {
            this.setState({productsAreLoading: false})
            this.props.showToastAction(true, "Couldn't get products. Please refresh.")            
        })
    }

    redirectToProductPage = (url) => {
        const redirect = Redirect.create(this.context.polaris.appBridge)
        redirect.dispatch(Redirect.Action.REMOTE, {
            url,
            newContext: true,
        });
    }

    renderItem = (item) => {
        if (item.node) { item = item.node }
        const {id, title, vendor, productType, featuredImage, onlineStoreUrl } = item
        const imgSrc = (featuredImage) ? featuredImage.originalSrc : null
        const media = <img style={productImageStyle} src={imgSrc} />;                
        return (
            <ResourceList.Item
                id={id}                
                media={media}
                accessibilityLabel={`View details for ${name}`}                
            >
            <div style={{display:'flex', justifyContent: 'space-between'}}>
            <div>
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{vendor}</div>
                <div>{productType}</div>
            </div>
            <div style={{display:'block', float: 'right'}}>
                <Button onClick={() => this.redirectToProductPage(onlineStoreUrl)} plain>View product</Button>
            </div>
            </div>
            </ResourceList.Item>
        );
    };

    handleNextPage = () => {
        const afterCursor = this.state.products[this.state.products.length - 1].cursor                
        this.fetchProducts(undefined, afterCursor)
        this.setState({productsAreLoading: true})
    }
    handlePreviousPage = () => {
        const beforeCursor = this.state.products[0].cursor        
        this.fetchProducts(beforeCursor, undefined)
        this.setState({productsAreLoading: true})
    }

    showProducts() {        
        return (
            <Card>                
                <div style={productSelectBoxStyle}>
                <Card>                
                <ResourceList
                    resourceName={{ singular: 'product', plural: 'products' }}
                    items={this.state.products}
                    renderItem={this.renderItem}
                    loading={this.state.productsAreLoading}
                />    
                </Card>                                                                     
                </div>                
                <div style={paginationStyle}>
                    <Pagination
                        hasPrevious={this.state.hasPreviousPage}
                        hasNext={this.state.hasNextPage}
                        onPrevious={() => this.handlePreviousPage()}
                        onNext={() => this.handleNextPage()}
                    />
                </div>
            </Card>
        )       
    }
    makeSelectionDescription(filters, selectedItems) {  
        if (!filters || !selectedItems) return null
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
    renderSummary() {
        const detail = this.props.detail        
        return (
            <div style={{display:"flex", justifyContent: "space-between"}}>
                <p style={{width:"600px"}}>{this.makeSelectionDescription(detail.filters, detail.selectedProducts)}</p>
            </div>
        )
    }

    handleEdit() {
        this.setState({buttonIsLoading: true})
        const { _id, filters, selectedProducts } = this.props.detail;
        const newEmail = this.state.email
        axios.post(process.env.APP_URL + '/edit-rule', {
            _id,
            //rules for filtering products
            filters,
            //manually selected products if the user has done so
            selectedProducts,
            email: this.state.email
        })
        .then(() => {            
            if (!this.mounted) return                       
            this.props.showToastAction(true, 'Rule edited!')            
            this.props.onUpdate({ _id, filters, selectedProducts, email: newEmail })
            this.setState({buttonIsLoading: false})            
        }).catch(err => {
            this.props.showToastAction(true, "Couldn't save. Please Try Again Later.")
        })    
    }

    render() {        
        return(
            <Modal 
                open={this.props.open}
                onEntered={() => this.fetchProducts()}
                onClose={() => {
                    this.setState({products: [], productsAreLoading: true})
                    this.props.close()
                }}
                showCloseIcon={true}
                center
            >
                <div style={modalContentStyle}>
                    <Layout>
                        <Layout.Section>
                        {this.renderSummary()}
                        <br />
                        {this.showProducts()}
                        <br />                            
                        <AddEmail email={this.state.email} setEmail={email => this.setState({email})}/>
                        <div style={finalButtonStyle}>
                            <Button primary loading={this.state.buttonIsLoading} size="large" onClick={() => this.handleEdit()}>Edit!</Button>
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
const productImageStyle = {
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",        
    width: "60px",
    height: "60px"
}
const paginationStyle = {float:"left", padding: "16px"}
const finalButtonStyle = {float:"right", padding: "16px 0px 16px 0px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction, isLoadingAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(RulesDetailModal);
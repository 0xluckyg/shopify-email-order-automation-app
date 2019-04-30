import {
    ResourceList,
    TextStyle,
    Card,
    FilterType,
    Button,
    Pagination,
    SettingToggle,
    Layout,    
    Badge,    
} from '@shopify/polaris';
import * as PropTypes from 'prop-types';
import { Redirect } from '@shopify/app-bridge/actions';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction} from '../redux/actions';
import * as keys from '../config/keys'
import pageHeader from '../components/page-header';
import AddEmails from '../components/add-emails';

class AddRule extends React.Component {
    isMounted = false
    state = {
        productsAreLoading: true,
        hasPreviousPage: false,
        hasNextPage: false,
        selectedItems: [],
        searchValue: '',
        // [{key:"key", value:"value"}]
        appliedFilters: [],
        // Cursor is for pagination. Send the last cursor to server
        // { cursor: String, node: { featuredImage:{originalSource:url}, handle, id, onlineStoreUrl, productType, tags:[], title, vendor }} 
        products: [],
        showProductSelect: true,
        email: '',
        emails: [],
        emailFieldError: '',
        buttonIsLoading: false        
    };
    static contextTypes = {
        polaris: PropTypes.object,
    };

    componentDidMount() {        
        this.isMounted = true
        this.fetchProducts({filters: JSON.stringify([])})
    }

    componentWillUnmount() {
        this.isMounted = false
    }

    fetchProducts(params) {
        axios.get(process.env.APP_URL + '/get-products', {
            params,
            withCredentials: true
        }).then(res => {            
            if (!this.isMounted) return            
            this.setState({
                hasPreviousPage: res.data.products.pageInfo.hasPreviousPage,
                hasNextPage: res.data.products.pageInfo.hasNextPage,
                products: res.data.products.edges,
                productsAreLoading: false
            })            
        }).catch(err => {
            if (!this.isMounted) return
            this.setState({productsAreLoading: false})
            this.props.showToastAction(true, "Couldn't get products. Please refresh.")
            console.log('err getting products, ', err)
        })
    }

    handleSearchChange = () => {        
        // Only one value for title
        if (this.state.searchValue == "") return
        
        const newFilter = {key: "title", value: this.state.searchValue}        
        let newAppliedFilters = this.state.appliedFilters        
        const i = newAppliedFilters.findIndex(filter => newFilter.key == filter.key)        
        if (i > -1) { newAppliedFilters[i] = newFilter } 
        else { newAppliedFilters.push(newFilter) }        

        this.setState({ appliedFilters: newAppliedFilters, productsAreLoading: true });   
        this.fetchProducts({filters: JSON.stringify(newAppliedFilters)});
    };
    handleFiltersChange = (appliedFilters) => {           
        this.setState({ appliedFilters, productsAreLoading: true });        
        this.fetchProducts({filters: JSON.stringify(appliedFilters)})
    };
    handleNextPage = () => {
        const afterCursor = this.state.products[this.state.products.length - 1].cursor                
        this.fetchProducts({filters: JSON.stringify(this.state.appliedFilters), afterCursor})
        this.setState({productsAreLoading: true})
    }
    handlePreviousPage = () => {
        const beforeCursor = this.state.products[0].cursor        
        this.fetchProducts({filters: JSON.stringify(this.state.appliedFilters), beforeCursor})
        this.setState({productsAreLoading: true})
    }    
    handleSelectionChange = (selectedItems) => {        
        this.setState({ selectedItems });
    };
    handleFinalSubmit = () => {        
        const {showProductSelect, emails, selectedItems, appliedFilters} = this.state
        
        this.setState({buttonIsLoading: true})
        if (showProductSelect) {
            this.setState({buttonIsLoading: false})
            return this.props.showToastAction(true, 'Please select products')
        }        
        if (emails.length <= 0) {
            this.setState({buttonIsLoading: false})
            return this.props.showToastAction(true, 'Please enter one or more emails')
        }        

        axios.post(process.env.APP_URL + '/add-rule', {
            //rules for filtering products
            filters: appliedFilters,
            //manually selected products if the user has done so
            selectedProducts: selectedItems,
            emails
        })
        .then(() => {
            if (!this.isMounted) return            
            this.setState({
                productsAreLoading: true,
                hasPreviousPage: false,
                hasNextPage: false,
                selectedItems: [],
                searchValue: '',
                appliedFilters: [],                
                products: [],
                showProductSelect: true,
                email: '',
                emails: [],
                emailFieldError: '',
                buttonIsLoading: false
            })
            this.props.showToastAction(true, 'Rule saved!')
            this.fetchProducts({filters: JSON.stringify([])})
        }).catch(err => {            
            this.props.showToastAction(true, "Couldn't save. Please Try Again Later.")
        })        
    }
    
    redirectToProductPage = (url) => {        
        if (!keys.EMBEDDED) { window.open(url, '_blank'); return }
        const redirect = Redirect.create(this.context.polaris.appBridge)
        redirect.dispatch(Redirect.Action.REMOTE, {
            url,
            newContext: true,
        });
    }

    renderItem = (item) => {
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

    makeSelectionDescription() {
        let {appliedFilters, selectedItems} = this.state
        if (appliedFilters.length == 0 && selectedItems.length == 0) return 'All products selected'
        if (selectedItems.length > 0) return `${selectedItems.length} custom items selected`        
        let queryString = 'Products where '
        for (let i = 0; i < appliedFilters.length; i ++) {    
            let key = appliedFilters[i].key
            if (key == 'product_type') key = 'product type'
            queryString = queryString + key + ' is ' + appliedFilters[i].value
            if (i != appliedFilters.length - 1) queryString = queryString + ' OR '                        
        }
        return queryString
    }

    showProductSelect() {        
        //need to filter products before rendering so that each object has "id" in it's root
        const productsReadyForRendering = this.state.products.map(product => product.node)
        const promotedBulkActions = [
            {
                content: 'Select only the selected products',
                onAction: () => this.setState({showProductSelect: false})                
            },
        ];
        const filters = [            
            {
                key: 'product_type',
                label: 'Product type',
                operatorText: 'is',
                type: FilterType.TextField                
            },
            {
                key: 'vendor',
                label: 'Product vendor',
                operatorText: 'is',
                type: FilterType.TextField
            },
            {
                key: 'tag',
                label: 'Tagged with',                
                type: FilterType.TextField
            }            
        ];
        const filterControl = (
            <ResourceList.FilterControl
                filters={filters}
                appliedFilters={this.state.appliedFilters}
                onFiltersChange={this.handleFiltersChange}
                searchValue={this.state.searchValue}
                onSearchChange={searchValue => this.setState({searchValue})}
                additionalAction={{
                    content: 'Search',
                    onAction: () => this.handleSearchChange()
                }}                                
            />
        );
        if (this.state.showProductSelect) {
            return (
                <Card>
                <div style={productSelectBoxStyle}>
                <Card>                
                <ResourceList
                    resourceName={{ singular: 'product', plural: 'products' }}
                    items={productsReadyForRendering}
                    renderItem={this.renderItem}
                    selectedItems={this.state.selectedItems}
                    onSelectionChange={this.handleSelectionChange}
                    promotedBulkActions={promotedBulkActions}
                    filterControl={filterControl}
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
                <div style={productButtonStyle}>
                    <Button primary onClick={
                        () => {
                            if (this.state.selectedItems.length == 0 && this.state.products.length == 0) {
                                return this.props.showToastAction(true, 'Please select more than 1 product')
                            }
                            this.setState({showProductSelect:false})                        
                        }                        
                    }> {(this.state.appliedFilters.length > 0) ? 'Select All Filtered Products' : 'Select All Products From Store'}</Button>
                </div>   
                </Card>
            )
        } else {
            return (
                <SettingToggle
                    action={{
                        content: "Choose products again",
                        onAction: () => this.setState({showProductSelect:true})
                    }}
                    enabled={true}
                >
                   <Badge><div style={{padding:'4px'}}>{this.makeSelectionDescription()}</div></Badge>
                </SettingToggle>
            )
        }
    }

    render() {
        return (
            <Layout>                
                <Layout.Section>                                    
                    {pageHeader('Add Email Rule')}
                    {this.showProductSelect()}
                    <br />    
                    <AddEmails emails={this.state.emails} setEmails={emails => this.setState({emails})}/>
                    <br />    
                    <div style={finalButtonStyle}>
                        <Button primary loading={this.state.buttonIsLoading} size="large" onClick={() => this.handleFinalSubmit()}>Create Rule!</Button>
                    </div>                    
                </Layout.Section>  
            </Layout>
        );
    }
}

const productSelectBoxStyle = {maxHeight: '300px', overflowX: 'auto'}
const productImageStyle = {
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",        
    width: "60px",
    height: "60px"
}
const paginationStyle = {float:"left", padding: "16px"}
const productButtonStyle = {float:"right", padding: "16px"}
const finalButtonStyle = {float:"right", padding: "16px 0px 16px 0px", marginBottom: "100px"}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {showToastAction},
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(AddRule);
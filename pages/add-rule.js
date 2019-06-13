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
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showToastAction} from '../redux/actions';
import pageHeader from '../components/page-header';
import AddEmail from '../components/add-email';

class AddRule extends React.Component {
    mounted = false
    state = {
        productsAreLoading: true,
        hasPrevious: false,
        hasNext: false,
        page: 1,

        selectedItems: [],
        searchValue: '',
        // [{key:"key", value:"value"}]
        filters: [],
        // Cursor is for pagination. Send the last cursor to server
        // { cursor: String, node: { featuredImage:{originalSource:url}, handle, id, onlineStoreUrl, productType, tags:[], title, vendor }} 
        products: [],
        showProductSelect: true,
        email: '',                
        emailFieldError: '',
        buttonIsLoading: false        
    };
    static contextTypes = {
        polaris: PropTypes.object,
    };

    componentDidMount() {        
        this.mounted = true
        this.fetchProducts({page: 1, filters: []})
    }

    componentWillUnmount() {
        this.mounted = false
    }

    //filters by shopify are [{key: "vendor", value: 'adidas'}].
    //API on backend uses filters: { filters: {"vendor": "adidas"} }
    filtersToParams(filters) {
        let param = {}
        filters.map(filter => param[filter.key] = filter.value)
        return param
    }

    fetchProducts(params) {
        params.filters = this.filtersToParams(params.filters)
        axios.get(process.env.APP_URL + '/get-products', {
            params,
            withCredentials: true
        }).then(res => {            
            if (!this.mounted) return            
            const {products, page, hasNext, hasPrevious} = res.data
            this.setState({
                hasPrevious,
                hasNext,
                products,
                page,
                productsAreLoading: false
            })            
        }).catch(err => {
            if (!this.mounted) return
            this.setState({productsAreLoading: false})
            this.props.showToastAction(true, "Couldn't get products. Please refresh.")
            console.log('err getting products, ', err)
        })
    }

    modifyFilters = (newFilter) => {        
        //Only allows 1 unique value per key
        let filters = this.state.filters
        const i = filters.findIndex(filter => newFilter.key == filter.key)
        if (i > -1) { filters[i] = newFilter } 
        else { filters.push(newFilter) }
        return filters
    }

    handleSearchChange = () => {
        if (this.state.searchValue == "") return        
        const newFilter = {key: "title", value: this.state.searchValue}        
        const filters = this.modifyFilters(newFilter)

        this.setState({ filters: filters, productsAreLoading: true });   
        this.fetchProducts({page: 1, filters});
    };

    handleFiltersChange = (filters) => {      
        //remove filter
        if (filters.length < this.state.filters.length) {
            this.setState({ filters, productsAreLoading: true });
            this.fetchProducts({page: 1, filters: filters})
            return
        }
        
        //modify filter
        const newFilter = filters[filters.length - 1]
        filters = this.modifyFilters(newFilter)
        
        this.setState({filters, productsAreLoading: true });
        this.fetchProducts({page: 1, filters})
    };
    handleNextPage = () => {
        let page = Number(this.state.page) + 1       
        this.setState({hasNext: false, hasPrevious: false, productsAreLoading: true});
        this.fetchProducts({page, filters: this.state.filters })
    }
    handlePreviousPage = () => {
        let page = Number(this.state.page) - 1     
        this.setState({hasNext: false, hasPrevious: false, productsAreLoading: true});
        this.fetchProducts({page, filters: this.state.filters })
    }    
    handleSelectionChange = (selectedItems) => {
        this.setState({ selectedItems });
    };
    handleFinalSubmit = () => {        
        let {showProductSelect, page, email, selectedItems, filters} = this.state        
        this.setState({buttonIsLoading: true})
        if (showProductSelect) {
            this.setState({buttonIsLoading: false})
            return this.props.showToastAction(true, 'Please select products')
        }        
        if (!email) {
            this.setState({buttonIsLoading: false})
            return this.props.showToastAction(true, 'Please enter an email')
        }

        filters = this.filtersToParams(filters)
        axios.post(process.env.APP_URL + '/add-rule', {
            //rules for filtering products
            filters: filters,
            page,
            //manually selected products if the user has done so
            selectedProducts: selectedItems,
            email
        })
        .then(() => {
            if (!this.mounted) return            
            this.setState({
                productsAreLoading: true,
                hasPrevious: false,
                hasNext: false,
                page: 1,

                selectedItems: [],
                searchValue: '',
                filters: [],                
                products: [],
                showProductSelect: true,
                email: null,
                emailFieldError: '',
                buttonIsLoading: false
            })
            this.props.showToastAction(true, 'Rule saved!')
            this.fetchProducts({page: 1, filters: []})
        }).catch(err => {            
            this.props.showToastAction(true, "Couldn't save. Please Try Again Later.")
        })        
    }
    
    redirectToProductPage = (id) => {        
        window.open(`https://${this.props.getUserReducer.shop}/admin/products/${id}`, '_blank')
    }

    renderItem = (item) => {
        const {id, title, vendor, product_type, images } = item
        const imgSrc = (images.length > 0) ? images[0].src : null
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
                <div>{product_type}</div>
            </div>
            <div style={{display:'block', float: 'right'}}>
                <Button onClick={() => this.redirectToProductPage(id)} plain>View product</Button>
            </div>
            </div>
            </ResourceList.Item>
        );
    };

    makeSelectionDescription() {
        let {filters, selectedItems} = this.state
        if (filters.length == 0 && selectedItems.length == 0) return 'All products selected'
        if (selectedItems.length > 0) return `${selectedItems.length} custom items selected`        
        let queryString = 'Products where '
        for (let i = 0; i < filters.length; i ++) {    
            let key = filters[i].key
            if (key == 'product_type') key = 'product type'
            queryString = queryString + key + ' is ' + filters[i].value
            if (i != filters.length - 1) queryString = queryString + ' AND '                        
        }
        return queryString
    }

    showProductSelect() {                
        const promotedBulkActions = [
            {
                content: 'Select only the selected products',
                onAction: () => this.setState({showProductSelect: false})                
            },
        ];
        const filters = [            
            {
                key: 'vendor',
                label: 'Product vendor',
                operatorText: 'is',
                type: FilterType.TextField
            }  
        ];
        const filterControl = (
            <ResourceList.FilterControl
                filters={filters}
                appliedFilters={this.state.filters}
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
                    items={this.state.products}
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
                        hasPrevious={this.state.hasPrevious}
                        hasNext={this.state.hasNext}
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
                    }> {(this.state.filters.length > 0) ? 'Select All Filtered Products' : 'Select All Products From Store'}</Button>
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
                    <AddEmail email={this.state.email} setEmail={email => this.setState({email})}/>
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

function mapStateToProps({getUserReducer}) {
    return {getUserReducer};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRule);
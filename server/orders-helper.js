const axios = require('axios');
const {Rule} = require('./db/rule')
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order')
const _ = require('lodash')

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function asyncForEach(array, callback) {    
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//this function got placed here due to cyclic dependency problem.
//https://stackoverflow.com/questions/35534806/module-exports-not-working
function getPDFName(data) {
	const orderNumbers = Object.keys(data)
	const name = (orderNumbers.length <= 1) ?
		`order-${orderNumbers[0]}.pdf` :
		`order-${orderNumbers[0]}-${orderNumbers[orderNumbers.length - 1]}.pdf`
	return name
}

function returnStartAndEndDate(date) {
    console.log('START END : ', date)
    if (date) {        
        date = new Date(date)
        let endDate = new Date(date).setDate(date.getDate() + 1)        
        return {
            created_at_min: date.toISOString(),
            created_at_max: new Date(endDate).toISOString()
        }
    } else {
        return {}
    }
}

async function fetchAllOrdersForDay(shop, accessToken, queryDate) {
    try {                
        const version = '2019-04'
        const limit = 250
        let page = 1; let hasNext = true
        const headers = getHeaders(accessToken)
        const date = returnStartAndEndDate(queryDate)

        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers,
            params: date
        })
        const totalPages = Math.ceil(total.data.count / limit)

        let allOrders = []
        while (hasNext) {           
            let orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
                headers,
                params: {
                    limit,
                    page,
                    ...date
                }
            })            
            const callLimitHeader = orders.headers.http_x_shopify_shop_api_call_limit
            const callLimit = parseInt(callLimitHeader.split('/')[0])            
            console.log(`api limit reached: ${callLimitHeader}`)
            if (callLimit > 38) {                
                console.log(`${shop} get order api limit reached: ${callLimitHeader}`)
                const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
                await waitFor(2000);
            }

            allOrders = [...allOrders, ...orders.data.orders]
            console.log('page', page)
            if (page == totalPages || totalPages == 0) hasNext = false
            page ++
        }        
        console.log('all: ', allOrders.length)
        return allOrders
    } catch (err) {
        console.log('Failed getting orders: ', err)        
    }
}

async function cleanOrders(orders) {    
    await asyncForEach(orders, async (order, i, array) => {        
        if (!order.customer || !order.shipping_address || !order.line_items) return 
        array[i] = _.pick(order, ["id", "total_price", "currency", "created_at", "order_number", "customer", "line_items", "shipping_address", "note"])
        array[i].customer = _.pick(order.customer, ["email", "first_name", "last_name", "phone", "orders_count", "total_spent"])
        array[i].shipping_address = _.pick(order.shipping_address, ["address1", "address2", "city", "company", "country", "province", "province_code", "zip"])        
        await asyncForEach(order.line_items, (item, j) => {            
            array[i].line_items[j] = _.pick(item, ["variant_id", "product_id", "title", "quantity", "sku", "price", "variant_title", "vendor", "grams"])
        })
    })
    return orders
}

function compareVendors(item, rule) {
    return ((rule.filters.vendor && item.vendor) && 
    (rule.filters.vendor.toUpperCase() == item.vendor.toUpperCase())) ?
    true : false    
}

function compareTitles(item, rule) {
    return ((item.title && rule.filters.title) && 
    (item.title.toUpperCase().includes(rule.filters.title.toUpperCase()))) ?
    true : false    
}

function compareProductIds(item, rule) {
    return ((rule.selectedProducts && item.product_id) && 
    (rule.selectedProducts.includes(item.product_id))) ?
    true : false    
}

function ruleIncludesAllProducts(rule) {
    return (rule.selectedProducts.length < 0 
        && !rule.filters.title 
        && !rule.filters.vendor)
}

async function combineOrdersAndEmailRules(shop, orders) {
    const rules = await Rule.find({shop})
    await asyncForEach(orders, async (order, i, array) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item, j) => {

            //initiating email rules to the orders result to each product in the order
            if (!array[i].line_items[j].email_rules) { 
                array[i].line_items[j].email_rules = []
            }

            await asyncForEach(rules, async rule => {
                //check for if product matches vendor, title, product_id


                if (compareTitles(item, rule) || 
                    compareVendors(item, rule) || 
                    compareProductIds(item, rule) || 
                    ruleIncludesAllProducts(rule)) {
                    
                    // console.log('title: ', item.title)
                    // console.log('filter: ', rule.filters)
                    // console.log('email: ', rule.email)
                    
                    let emailRules = array[i].line_items[j].email_rules
                    //filter out duplicates
                    if (emailRules.filter(e => e.email === rule.email).length > 0) return
                    //put send all emails to by day page
                    emailRules.push({email: rule.email, sent: false})
                }
            })
        })
    })
    return orders
}

async function getProcessedEmails(orders) {
    const orderIds = []
    await asyncForEach(orders, async (order) => {
        orderIds.push(order.id)
    })
    return await ProcessedOrder.find({
        'order_id': orderIds
    })
}

async function combineOrdersAndSentHistory(orders) { 
    let processedEmails = await getProcessedEmails(orders)
    console.log('Got processed orders ', processedEmails.length)

    await asyncForEach(orders, async (order, i, array) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item, j) => {            
            await asyncForEach(processedEmails, (processed) => {   
                // product_id and email have to match if the email has already been processed for item
                if (processed.product_id != item.product_id || 
                    processed.variant_id != item.variant_id) return             
                let unregisteredEmailCount = 0
                if (item.email_rules.length == 0) unregisteredEmailCount ++
                item.email_rules.forEach((email, k) => {
                    if (processed.email == email.email) {
                        array[i].line_items[j].email_rules[k].sent = true
                    } else {
                        unregisteredEmailCount++                        
                    }                            
                })                                
                    //case where email rule doesn't exist but user has sent a custom email
                if ((item.email_rules.length != 0 && unregisteredEmailCount == item.email_rules.length) ||
                    //case where email rules exist and user has sent a additional custom emails
                    (item.email_rules.length == 0 && unregisteredEmailCount > item.email_rules.length)) {                    
                    item.email_rules.push({email:processed.email, sent: true})
                }                
                unregisteredEmailCount = 0
            })                      
        })
    })
    return orders
}

function createEmailObject(emails, order, item, email) {        
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
        emails[email.email][order.order_number].items[item.variant_id][quantity] += 1
    }
    return emails
}

async function reformatOrdersByEmail(orders) {
    //  [{
    //     id
    //     shipping_address
    //     customer
    //     line_items [
    //         {
    //             product
    //             emails [
    //                 {email, sent}
    //             ]
    //         }
    //     ]
    // }]

    // FORMAT TO

    // {
    //     email: {
    //         id: {    
    //             shipping_address
    //             customer        
    //             items [
    //                 { product }
    //             ]
    //         }
    //     }
    // }
    let emails = {}

    await asyncForEach(orders, async (order) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item) => {
            await asyncForEach(item.email_rules, async (email) => {
                emails = createEmailObject(emails, order, item, email)
            })
        })
    })
    
    return emails
}

async function reduceLongOrders(shop, emails) {
    const user = await User.findOne({shop}, { settings: 1 })
    const { PDFSettings } = user.settings

    await asyncForEach(Object.keys(emails), async (email) => {
        const {PDFOrderLimit} = PDFSettings
        const tooLong = Object.keys(emails[email]).length
        if (tooLong >= PDFOrderLimit) {
            const pdfName = getPDFName(emails[email])
            console.log('toolong')
            emails[email] = {
                type: 'pdf',
                name: pdfName,
                count: tooLong,
                email,

            }
        }
    })

    return emails
}

module.exports = {
    getHeaders, 
    asyncForEach, 
    cleanOrders, 
    fetchAllOrdersForDay,
    combineOrdersAndEmailRules, 
    combineOrdersAndSentHistory, 
    reformatOrdersByEmail,
    getPDFName,
    reduceLongOrders
}
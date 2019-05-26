const keys = {
    SHOP: 'SHOP',
    ORDER_NUMBER: 'ORDER_NUMBER',
    PROCESSED_AT: 'PROCESSED_AT',
    NOTE: 'NOTE',
    TITLE: 'TITLE',
    VARIANT_TITLE: 'VARIANT_TITLE',
    QUANTITY: 'QUANTITY',
    SKU: 'SKU',
    VENDOR: 'VENDOR',
    // GTIN: 'GTIN',
    // GRAMS: 'GRAMS',
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    PHONE: 'PHONE',
    ADDRESS1: 'ADDRESS1',
    CITY: 'CITY',
    ZIP: 'ZIP',
    PROVINCE: 'PROVINCE',
    COUNTRY: 'COUNTRY',
    ADDRESS2: 'ADDRESS2',
    COMPANY: 'COMPANY',

    VARIANT_ID: 'COMPANY',
    PRODUCT_ID: 'PRODUCT_ID',
    PRICE: 'PRICE',
    // PRODUCT_TYPE: 'PRODUCT_TYPE',
    // TOTAL_TAX: 'TOTAL_TAX',
}

let SUBJECT_TEMPLATE_TEXT = `{{${keys.SHOP}}} customer orders`

let HEADER_TEMPLATE_TEXT = `{{${keys.SHOP}}}'s orders:

`

let ORDER_TEMPLATE_TEXT = 
`ORDER {{${keys.ORDER_NUMBER}}}
--------------------
Shop: {{${keys.SHOP}}}
Order Number: {{${keys.ORDER_NUMBER}}}
Date: {{${keys.PROCESSED_AT}}}
Note: {{${keys.NOTE}}}\n
CUSTOMER INFORMATION
--------------------
Customer name: {{${keys.NAME}}} 
Email: {{${keys.EMAIL}}}, 
Phone: {{${keys.PHONE}}}\n
ADDRESS INFORMATION
--------------------
Address1: {{${keys.ADDRESS1}}}
City: {{${keys.CITY}}} 
Zip: {{${keys.ZIP}}}
Province: {{${keys.PROVINCE}}} 
Country: {{${keys.COUNTRY}}}
Address2: {{${keys.ADDRESS2}}}
Company: {{${keys.COMPANY}}}\n`

let PRODUCT_TEMPLATE_HEADER = 
`
PRODUCT INFORMATION
--------------------
`

let PRODUCT_TEMPLATE_TEXT = 
`Title: {{${keys.TITLE}}}
Variant Title: {{${keys.VARIANT_TITLE}}}
Quantity: {{${keys.QUANTITY}}}
SKU: {{${keys.SKU}}}
Vendor: {{${keys.VENDOR}}}\n\n`

let FOOTER_TEMPLATE_TEXT = `
Thank you!`

function createShopName(shop) {
    let shopName = shop.split('.')[0]
    return shopName.charAt(0).toUpperCase() + shopName.slice(1)
}

function createSubjectText(shop, subjectTemplateText) {
    let shopName = shop ? createShopName(shop) : 'our store'
    let subjectTemplate = (subjectTemplateText) ? subjectTemplateText : SUBJECT_TEMPLATE_TEXT
    return subjectTemplate.replace(new RegExp(`{{${keys.SHOP}}}`,"g"), shopName)
}

function createOrderText(data, shop, headerTemplateText, orderTemplateText, productTemplateText, footerTemplateText) {        
    let orderText = ''
    let shopName = shop ? createShopName(shop) : 'our store'

    let headerTemplate = (headerTemplateText) ? headerTemplateText : HEADER_TEMPLATE_TEXT        
    headerTemplate = headerTemplate.replace(new RegExp(`{{${keys.SHOP}}}`,"g"), shopName)

    Object.keys(data).map(orderID => {
        let orderTemplate = (orderTemplateText) ? orderTemplateText : ORDER_TEMPLATE_TEXT    
        
        let order = data[orderID]
        let customer = order.customer
        let shippingAddress = order.shipping_address

        let orderNumber = orderID ? orderID : 'Not provided'        
        let date = order.processed_at ? order.processed_at : 'Not provided'
        let note = order.note ? order.note : 'None'

        let customerName = `${customer.first_name} ${customer.last_name}` 
        let customerEmail = customer.email ? customer.email : 'Not provided'
        let customerPhone = customer.phone ? customer.phone : 'Not provided'

        let address1 = shippingAddress.address1 ? shippingAddress.address1 : 'Not provided'
        let city = shippingAddress.city ? shippingAddress.city : 'Not provided'
        let zip = shippingAddress.zip ? shippingAddress.zip : 'Not provided'
        let province = shippingAddress.province ? shippingAddress.province : 'Not provided'
        let country = shippingAddress.country ? shippingAddress.country : 'Not provided'
        let company = shippingAddress.company ? shippingAddress.company : 'Not provided'
        let address2 = shippingAddress.address2 ? shippingAddress.address2 : 'Not provided'

        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.ORDER_NUMBER}}}`,"g"), orderNumber)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.SHOP}}}`,"g"), shopName)        
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.PROCESSED_AT}}}`,"g"), date)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.NOTE}}}`,"g"), note)

        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.NAME}}}`,"g"), customerName)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.EMAIL}}}`,"g"), customerEmail)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.PHONE}}}`,"g"), customerPhone)

        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.ADDRESS1}}}`,"g"), address1)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.CITY}}}`,"g"), city)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.ZIP}}}`,"g"), zip)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.PROVINCE}}}`,"g"), province)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.COUNTRY}}}`,"g"), country)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.ADDRESS2}}}`,"g"), address2)
        orderTemplate = orderTemplate.replace(new RegExp(`{{${keys.COMPANY}}}`,"g"), company)
        
        if (orderText != '') orderText = orderText + `\n\n`
        orderText = orderText + orderTemplate

        let productText = PRODUCT_TEMPLATE_HEADER
        Object.keys(order.items).map(itemID => {                     
            let item = order.items[itemID]
            let productTemplate = (productTemplateText) ? productTemplateText : PRODUCT_TEMPLATE_TEXT            
            
            let productTitle =  item.title ? item.title : 'Not provided'
            let variantTitle = item.variant_title ? item.variant_title : 'Not provided' 
            let productQuantity = item.quantity ? item.quantity : 'Not provided'
            let sku = item.sku ? item.sku : 'Not provided'
            let vendor = item.vendor ? item.vendor : 'Not provided'            

            productTemplate = productTemplate.replace(new RegExp(`{{${keys.TITLE}}}`,"g"), productTitle)
            productTemplate = productTemplate.replace(new RegExp(`{{${keys.VARIANT_TITLE}}}`,"g"), variantTitle)
            productTemplate = productTemplate.replace(new RegExp(`{{${keys.QUANTITY}}}`,"g"), productQuantity)
            productTemplate = productTemplate.replace(new RegExp(`{{${keys.SKU}}}`,"g"), sku)
            productTemplate = productTemplate.replace(new RegExp(`{{${keys.VENDOR}}}`,"g"), vendor)            

            productText = productText + productTemplate
        })        

        orderText = orderText + productText
    })

    let footerTemplate = (footerTemplateText) ? footerTemplateText : FOOTER_TEMPLATE_TEXT
    footerTemplate = footerTemplate.replace(new RegExp(`{{${keys.SHOP}}}`,"g"), shopName)

    orderText = headerTemplate + orderText + footerTemplate

    return orderText
}

module.exports = {
    ...keys,
    SUBJECT_TEMPLATE_TEXT,
    HEADER_TEMPLATE_TEXT,
    ORDER_TEMPLATE_TEXT,
    PRODUCT_TEMPLATE_TEXT,
    FOOTER_TEMPLATE_TEXT,
    createSubjectText,
    createOrderText
}
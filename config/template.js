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

let TEMPLATE_TEXT = 
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

function createOrderText(data, shop, templateText, productTemplateText) {        
    let orderText = ''

    Object.keys(data).map(orderID => {
        let orderTemplate = (templateText) ? templateText : TEMPLATE_TEXT    
        
        let order = data[orderID]
        let customer = order.customer
        let shippingAddress = order.shipping_address

        let orderNumber = orderID ? orderID : 'Not provided'
        let shopName = shop ? shop : 'Not provided'
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

        orderTemplate = orderTemplate.replace(`{{${keys.ORDER_NUMBER}}}`, orderNumber)
        orderTemplate = orderTemplate.replace(`{{${keys.SHOP}}}`, shopName)
        orderTemplate = orderTemplate.replace(`{{${keys.ORDER_NUMBER}}}`, orderNumber)
        orderTemplate = orderTemplate.replace(`{{${keys.PROCESSED_AT}}}`, date)
        orderTemplate = orderTemplate.replace(`{{${keys.NOTE}}}`, note)

        orderTemplate = orderTemplate.replace(`{{${keys.NAME}}}`, customerName)
        orderTemplate = orderTemplate.replace(`{{${keys.EMAIL}}}`, customerEmail)
        orderTemplate = orderTemplate.replace(`{{${keys.PHONE}}}`, customerPhone)

        orderTemplate = orderTemplate.replace(`{{${keys.ADDRESS1}}}`, address1)
        orderTemplate = orderTemplate.replace(`{{${keys.CITY}}}`, city)
        orderTemplate = orderTemplate.replace(`{{${keys.ZIP}}}`, zip)
        orderTemplate = orderTemplate.replace(`{{${keys.PROVINCE}}}`, province)
        orderTemplate = orderTemplate.replace(`{{${keys.COUNTRY}}}`, country)
        orderTemplate = orderTemplate.replace(`{{${keys.ADDRESS2}}}`, address2)
        orderTemplate = orderTemplate.replace(`{{${keys.COMPANY}}}`, company)
        
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

            productTemplate = productTemplate.replace(`{{${keys.TITLE}}}`, productTitle)
            productTemplate = productTemplate.replace(`{{${keys.VARIANT_TITLE}}}`, variantTitle)
            productTemplate = productTemplate.replace(`{{${keys.QUANTITY}}}`, productQuantity)
            productTemplate = productTemplate.replace(`{{${keys.SKU}}}`, sku)
            productTemplate = productTemplate.replace(`{{${keys.VENDOR}}}`, vendor)            

            productText = productText + productTemplate
        })

        orderText = orderText + productText
    })

    return orderText
}

module.exports = {
    ...keys,
    TEMPLATE_TEXT,
    PRODUCT_TEMPLATE_TEXT,
    createOrderText
}
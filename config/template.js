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
    GRAMS: 'GRAMS',
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

const TEMPLATE_TEXT = 
`
ORDER {{${keys.ORDER_NUMBER}}}
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
Company: {{${keys.COMPANY}}}\n
`

const PRODUCT_TEMPLATE_TEXT = 
`
Title: {{${keys.TITLE}}}
Variant Title: {{${keys.VARIANT_TITLE}}}
Quantity: {{${keys.QUANTITY}}}
SKU: {{${keys.SKU}}}
Vendor: {{${keys.VENDOR}}}    
grams: {{${keys.GRAMS}}}
`

function createOrderText(data, shop, templateText) {    
    let orderText = (templateText) ? templateText : TEMPLATE_TEXT
    Object.keys(data).map(orderID => {
        let order = data[orderID]
        let customer = order.customer
        let shippingAddress = order.shippingAddress

        let orderNumber = orderID
        let shop = 'shop'
        let date = order.processed_at
        let note = order.note

        let customerName = `${customer.first_name} ${customer.last_name}`
        let customerEmail = customer.email
        let customerPhone = customer.phone

        let address1 = shippingAddress.address1
        let city = shippingAddress.city
        let zip = shippingAddress.zip
        let province = shippingAddress.province
        let country = shippingAddress.country
        let company = shippingAddress.company
        let address2 = shippingAddress.address2

        Object.keys(order.items).map(itemID => {            
            let item = order[itemID]

            let productTitle =  item.title
            let variantTitle = item.variant_title
            let productQuantity = item.quantity
            let sku = item.sku
            let vendor = item.vendor
            let grams = item.grams
        })

        data.
    data.customer
    data.shipping_address
    })
}

module.exports = {
    ...keys,
    TEMPLATE_TEXT,
    PRODUCT_TEMPLATE_TEXT
}
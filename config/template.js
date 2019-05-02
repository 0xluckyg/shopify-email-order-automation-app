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
    GTIN: 'GTIN',
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
    PRODUCT_TYPE: 'PRODUCT_TYPE',
    TOTAL_TAX: 'TOTAL_TAX',
}

module.exports = {
    ...keys,
    TEMPLATE_TEXT: 
    `
    ORDER INFORMATION
    --------------------
    Shop: {{${keys.SHOP}}}
    Order Number: {{${keys.ORDER_NUMBER}}}
    Date: {{${keys.PROCESSED_AT}}}
    Note: {{${keys.NOTE}}}\n
    PRODUCT INFORMATION
    --------------------
    Title: {{${keys.TITLE}}}
    Variant Title: {{${keys.VARIANT_TITLE}}}
    Quantity: {{${keys.QUANTITY}}}
    SKU: {{${keys.SKU}}}
    Vendor: {{${keys.VENDOR}}}
    gtin: {{${keys.GTIN}}}
    grams: {{${keys.GRAMS}}}\n
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
    Company: {{${keys.COMPANY}}}
    `
}
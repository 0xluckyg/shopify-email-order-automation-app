export const APP_NAME = 'Email Order Automation'
export const APP_FULL_NAME = 'KROCO EMAIL AUTOMATION'
export const APP_COLOR = '#8AB274';
export const APP_COLOR_LIGHT = '#A6D38D';
export const LOGO = '../static/logo-white.svg';
export const REVIEW_URL = 'https://google.com';
export const EMBEDDED = false;

export const CONTACT_US_INDEX = 4;
export const FAQ_INDEX = 5;

export const SHOW_TOAST = 'SHOW_TOAST';
export const IS_LOADING = 'IS_LOADING';
export const IS_DIRTY = 'IS_DIRTY';
export const HANDLE_SAVE_ACTION = 'HANDLE_SAVE_ACTION';
export const GET_USER = 'GET_USER';
export const ROUTE = 'ROUTE';

export const SHOP = 'SHOP';
export const ORDER_NUMBER = 'ORDER_NUMBER';
export const PROCESSED_AT = 'PROCESSED_AT';
export const NOTE = 'NOTE';
export const TITLE = 'TITLE';
export const VARIANT_TITLE = 'VARIANT_TITLE';
export const QUANTITY = 'QUANTITY';
export const SKU = 'SKU';
export const VENDOR = 'VENDOR';
export const GTIN = 'GTIN';
export const GRAMS = 'GRAMS';
export const NAME = 'NAME';
export const EMAIL = 'EMAIL';
export const PHONE = 'PHONE';
export const ADDRESS1 = 'ADDRESS1';
export const CITY = 'CITY';
export const ZIP = 'ZIP';
export const PROVINCE = 'PROVINCE';
export const COUNTRY = 'COUNTRY';
export const ADDRESS2 = 'ADDRESS2';
export const COMPANY = 'COMPANY';

export const VARIANT_ID = 'COMPANY';
export const PRODUCT_ID = 'PRODUCT_ID';
export const PRICE = 'PRICE';
export const PRODUCT_TYPE = 'PRODUCT_TYPE';
export const TOTAL_TAX = 'TOTAL_TAX'


export const TEMPLATE_TEXT = 
`
ORDER INFORMATION
--------------------
Shop: {{${SHOP}}}
Order Number: {{${ORDER_NUMBER}}}
Date: {{${PROCESSED_AT}}}
Note: {{${NOTE}}}\n
PRODUCT INFORMATION
--------------------
Title: {{${TITLE}}}
Variant Title: {{${VARIANT_TITLE}}}
Quantity: {{${QUANTITY}}}
SKU: {{${SKU}}}
Vendor: {{${VENDOR}}}
gtin: {{${GTIN}}}
grams: {{${GRAMS}}}\n
CUSTOMER INFORMATION
--------------------
Customer name: {{${NAME}}} 
Email: {{${EMAIL}}}, 
Phone: {{${PHONE}}}\n
ADDRESS INFORMATION
--------------------
Address1: {{${ADDRESS1}}}
City: {{${CITY}}} 
Zip: {{${ZIP}}}
Province: {{${PROVINCE}}} 
Country: {{${COUNTRY}}}
Address2: {{${ADDRESS2}}}
Company: {{${COMPANY}}}
`
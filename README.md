# Kroco Order Email Automation
Didn't write descriptions for the files that I think are self explanatory. (Or I got lazy << most likely it)

## File Structure

### components
Contains reusable frontend components
```
add-email.js
Component for adding new emails for rules. 
Used twice; once for editing rules in rule-detail-modal.js and once in add-rule.js
```
```
email-preview.js
Component for previewing email that's about to be sent. 
Used by order-detail-modal.js
```
```
gmail-auth.js
Annoying little view that asks the user to authorize with gmail first. 
Also can be seen on the bottom of setting.js
```
```
navigation.js
Lefthand navigation panel
```
```
no-content.js
View to show inside tables when there's 0 row
```
```
order-detail-modal.js
A popup modal to view details about an order, or send an individual order. 
Can be accessed from orders-by-day.js or all-orders.js
```
```
order-sent-status.js
A small badge that shows if the order has been processed or not. 
(green if processed, gray if not)
```
```
page-header.js
Topbar
```
```
payment-plan-modal.js
A popup modal explaining the payment plans and pops up if the user has to upgrade plan to use a certain feature.
Is supposed to popup when user logs into the app if an automatic email didn't get sent due to plan restrictions
```
```
review-modal.js
A popup modal asking user to write a review. Pops up every week
```
```
rule-detail-modal.js
A popoup modal for viewing details about an email rule. 
Only used in rules.js
```
```
save-bar.js
A savebar that pops up on the top of the app if the user starts editing something. 
I don't think I implemented this, so possibly a subject to delete.
```
```
skeleton.js
A gray empty view to show that a page is loading. 
I don't think I implemented this.
```
```
toast.js
Black toast that pops up for few seconds to notify success and error
```
```
user-preview.js
Avatar on the right corner of topbar header that shows menu when clicked
```

### config
Contains reusable keys and environment variables

### pages
A default folder structure by Next.js. 
Next.js will automatically route the files inside this folder to a directory. 
For example, contact-us.js will become kroco.io/contact-us
```
_app.js
Default filename for Next.js that deals with configurations once the components loads in the frontend.
This is like the parent component for all components inside pages, 
and default configurations can be overriden by writing this file.
```
```
_document.js
Default filename for Next.js that deals with configurations while the pages compile on the server. 
Can add things like scripts in the head.
```
```
index.js
Parent for all pages, that goes into _app.js. Not a good Next.js practice to put all files in one component, 
but I forgot why I did this (I think it was related to polaris). 
I didn't do this for other projects.
```
```
orders-by-day.js
For viewing and sending orders by day. 
This page is implemented into orders.js
```
```
orders.js
For viewing all orders and orders by day. 
Implements orders-by-day.js
```
```
polaris.js
For viewing all available polaris components.
Polaris is a Shopify UI component library, like Google's Material UI. I gave it a shot, but i don't like it. 
We may change this system in the near future.
If you want to add new polaris component, go to appurl/polaris to view which components can be used.
```

### redux
has all files related to redux. Combined all methods into actions and reducers files for simplicity.

### static
A default folder by Next.js
All static files such as images will be stored and rendered from this folder

## Backend File Structure (Inside Server Folder)

### auth
All authentication and external API related code is stored here. 
Includes authentication and usage of GMAIL api.
```
shopify-auth.js & shopify-payment.js
auth
1. We send a request to Shopify with a redirect url to our store
2. User accepts payment / download
3. Shopify redirects the user back to our app
session
1. When user clicks on an app on Shopify, shop and hmac is provided
2. We compare shop and hmac, get and store session
3. We don't let the session expire or change by setting "renew: true" in server.js until the user logout or login from another store 
```
```
auth.js
Just contains logout function for now
```
```
gmail-auth.js
Everything related to gmail including gmail auth, send, etc
```

### db
All db related models
```
mongoose.js
Sets up mongoose and connects to the db
```
```
processed-order.js
We store the history of orders that we processed in this model. 
All orders are stored in Shopify only (it wouldn't make sense to store millions of customer orders that we don't even use)
We fetch the orders from Shopify and compare them with the documents in this model to determine which orders still need to be sent.
```
```
rule.js
We store all the rules for whome to send which orders to.
For example, user will have set up a rule: order containing product vendor "adidas" will be sent to info@adidas.com 
and the email will be sent to this addres whenever there's an order that matches this rule.
```
```
user.js
User credentials and info including settings
```

### webhooks
Webhooks are listners for any Shopify changes. 
A registered webhook on Shopify (There's a code snippet to register this inside shopify-auth) will notify our app server, and code inside this folder will listen for the event. 

### individual files
```
contact-us.js
Logic for the contact-us page for users to send email inquiries. 
Has nothing to do with our Gmail API, and uses nodemailer
```
```
edit-rule.js
Logic for adding / editing email rules
```
```
get-rules.js
Logic for getting and viewing email rules the user created
```
```
get-products.js
Logic for fetching products from Shopify (Not orders). 
This is used in the create rule page where the user has to browse through the products in the store
```
```
pdf.js
Everything related to pdf, including creating pdf previews, creating pdf orders, etc
```

### important files
```
orders-helper.js
We gotta compare rules, processed history, and orders fetched from Shopify everytime we view orders and send orders.
This helper module is therefore used by both get-orders.js and send-orders.js, 
and contains logic for comparing, filtering, and reformatting the three datasets.
```
```
get-orders.js
For getting orders from Shopify and showing it to the user. 
Has separate logic for getting orders for a specific day and getting all orders.
```
```
send-orders.js
For sending orders either manually or automatically according to email rules.
Contains cronjob for sending the orders automatically.
```
```
get-user.js
Logic for getting the user.
App calls this module on start from the frontend and stores it in reducer
```

## Shared Filed Structure

### helper
Contains code that can be reused by both frontend and backend
```
template.js
Code for transforming data into a presentable format for sending and previewing emails
```
```
timezones.js
Not used, but may use for future implementations
```

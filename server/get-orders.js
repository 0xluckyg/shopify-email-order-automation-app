const axios = require('axios');
const {getHeaders, cleanOrders, combineOrdersAndEmailRules, combineOrdersAndSentHistory} = require('./orders-helper')
const _ = require('lodash')
const PDFKit = require('pdfkit')
const fs = require('fs')
const UUIDv4 = require('uuid/v4')
const version = '2019-04'

async function getOrders(ctx) {
    try {        
        const {shop, accessToken} = ctx.session
        let {page, date} = ctx.query     
        const limit = 10
        let hasPrevious = true; let hasNext = true
        const headers = getHeaders(accessToken)
        
        if (date) {            
            date = new Date(date)          
            let endDate = new Date(date).setDate(date.getDate() + 1)
                        
            date = {
                created_at_min: date.toISOString(),
                created_at_max: new Date(endDate).toISOString()
            }
        } else {
            date = {}
        }

        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers,
            params: date
        })        
        const totalPages = Math.ceil(total.data.count / limit)        
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false

        let orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit,
                page,
                ...date
            }
        })
        console.log('total: ', totalPages)
        console.log('orders: ', orders.data.orders.length)
        
        orders = await cleanOrders(orders.data.orders)
        orders = await combineOrdersAndEmailRules(shop, orders)
        orders = await combineOrdersAndSentHistory(orders)
        

        ctx.body = {orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

async function getOrderPDF(ctx) {
    function streamEnd(stream) {
        return new Promise(function(resolve, reject) {
            stream.on('error', reject);
            stream.on('close', resolve);
        });
    }
    
    // Generate random file name
    let tempFileName = `${UUIDv4()}.pdf`;
    
    // Create the PDF using PDFKit
    let doc = new PDFKit();
    let writeStream = fs.createWriteStream(tempFileName);
    doc.pipe(writeStream);
    
    doc.fillColor("blue")
    .text('Here is a link!', 100, 100)
    .underline(100, 100, 160, 27, { color: "#0000FF" })
    .link(100, 100, 160, 27, 'http://google.com/')
    
    doc.end();
    
    // Read the created file
    const readStream = fs.createReadStream(tempFileName);
    // Create an array of buffers 
    let data = [];
    readStream.on('data', (d) => data.push(d));
    
    // Wait until the read stream finishes
    await streamEnd(readStream);

    // Set the response headers
    ctx.response.attachment(tempFileName);
    
    // Set the body of the response
    ctx.body = Buffer.concat(data);
    
    // Delete the file
    fs.unlink(tempFileName);
}


module.exports = {getOrders, getOrderPDF}
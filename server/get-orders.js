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

async function writePDF(tempFileName) {
    return new Promise((resolve, reject) => {
        
        // Create the PDF using PDFKit
        let doc = new PDFKit();
        let writeStream = fs.createWriteStream(tempFileName);
        doc.pipe(writeStream);
                
        // draw some text
        doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
        
        // some vector graphics
        doc
          .save()
          .moveTo(100, 150)
          .lineTo(100, 250)
          .lineTo(200, 250)
          .fill('#FF3300');
        
        doc.circle(280, 200, 50).fill('#6600FF');
        
        // an SVG path
        doc
          .scale(0.6)
          .translate(470, 130)
          .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
          .fill('red', 'even-odd')
          .restore();
        
        // and some justified text wrapped into columns
        doc
          .text('And here is some wrapped text...', 100, 300)
          .font('Times-Roman', 13)
          .moveDown()
          .text('random text', {
            width: 412,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 300,
            ellipsis: true
         });

        console.log('doc: ', doc)
         
        doc.end();

        writeStream.addListener('finish', resolve);
        writeStream.addListener('error', reject)
    })
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
    
    await writePDF(tempFileName)
    
    // Read the created file
    const readStream = fs.createReadStream(tempFileName);
    // Create an array of buffers 
    let data = [];
    readStream.on('data', (d) => data.push(d));
    
    // Wait until the read stream finishes
    await streamEnd(readStream);
    let pdfFile = Buffer.concat(data)
    

    // Delete the file
    fs.unlinkSync(tempFileName);
    
    // Set the response headers
    ctx.response.attachment(tempFileName);
    ctx.type = 'application/pdf';
    // ctx.ok( Buffer.concat(data));
    // Set the body of the response
    ctx.body = pdfFile;
}


module.exports = {getOrders, getOrderPDF}
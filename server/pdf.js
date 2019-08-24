const PDFKit = require('pdfkit')
const fs = require('fs')
const UUIDv4 = require('uuid/v4')
const {User} = require('./db/user');
const {createOrderText} = require('../helper/template')
const { 
fetchAllOrdersForDay,
cleanOrders, 
combineOrdersAndEmailRules, 
combineOrdersAndSentHistory, 
reformatOrdersByEmail,
} = require('./orders-helper')

//For previewing send
async function getAllOrdersForDay(ctx) {
	try {
		const {shop, accessToken} = ctx.session
		const {date} = ctx.query

		let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)
		allOrders = await cleanOrders(allOrders)
		allOrders = await combineOrdersAndEmailRules(shop, allOrders)
		allOrders = await combineOrdersAndSentHistory(allOrders)
		let reformattedOrders = await reformatOrdersByEmail(allOrders, date, true)
		return reformattedOrders
	} catch (err) {
		console.log('Failed getting all orders for day: ', err)
	}
}

async function getTemplateTexts(shop) {
	const user = await User.findOne({shop}).select({ 
		"settings": 1
	})
	return user.settings
}

//when order data is available and just need to convert it into right format
async function createPDFContent(shop, pdfData) {
	const {
		headerTemplateText, 
		orderTemplateText, 
		productTemplateText, 
		footerTemplateText
	} = await getTemplateTexts(shop)
	return createOrderText(
		pdfData, 
		shop, 
		headerTemplateText, 
		orderTemplateText, 
		productTemplateText, 
		footerTemplateText
	)
}

//when order data isnt available and must refetch all orders again from shop
async function createPDFContentFromScratch(ctx) {
	const {shop} = ctx.session
	const {pdfInfo} = ctx.query
	const formattedOrders = await getAllOrdersForDay(ctx)
	const pdfData = formattedOrders[JSON.parse(pdfInfo).email]
	return await createPDFContent(shop, pdfData)
}

async function writePDF(tempFileName, pdfData) {
	return new Promise((resolve, reject) => {
		
		// Create the PDF using PDFKit
		let doc = new PDFKit();
		let writeStream = fs.createWriteStream(tempFileName);

		doc.pipe(writeStream);
		doc.fontSize(12).text(pdfData, 100, 80)
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

	const pdfData = await createPDFContentFromScratch(ctx)

	await writePDF(tempFileName, pdfData)
	
	// Read the created file
	const readStream = fs.createReadStream(tempFileName);
	// Create an array of buffers 
	let data = [];
	readStream.on('data', (d) => data.push(d));
	
	// Wait until the read stream finishes
	await streamEnd(readStream);
		
	// Delete the pdf file
	fs.unlinkSync(tempFileName);

	const pdfBinary = Buffer.concat(data)
	const pdfBase64 = pdfBinary.toString('base64')
	
	ctx.response.attachment(tempFileName);
	ctx.type = 'application/pdf';
	ctx.body = pdfBase64;
}

module.exports = {getOrderPDF}
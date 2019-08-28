const PDFKit = require('pdfkit')
const fs = require('fs')
const UUIDv4 = require('uuid/v4')
const { User } = require('./db/user');
const { createOrderText, getTemplateTexts } = require('../helper/template')
const { 
	fetchAllOrdersForDay, 
	cleanOrders, 
	combineOrdersAndEmailRules, 
	combineOrdersAndSentHistory, 
	getPDFName, 
	reformatOrdersByEmail 
} = require('./orders-helper')

//For previewing send
async function getAllOrdersForDay(ctx) {
	try {
		const { shop, accessToken } = ctx.session
		const { date } = ctx.query

		let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)
		allOrders = await cleanOrders(allOrders)
		allOrders = await combineOrdersAndEmailRules(shop, allOrders)
		allOrders = await combineOrdersAndSentHistory(allOrders)
		let reformattedOrders = await reformatOrdersByEmail(allOrders, true)
		return reformattedOrders
	} catch (err) {
		console.log('Failed getting all orders for day: ', err)
	}
}

async function getUserSettings(shop) {
	const user = await User.findOne({ shop }).select({
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
	} = await getUserSettings(shop)
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
	const { pdfInfo } = ctx.query
	const formattedOrders = await getAllOrdersForDay(ctx)
	return formattedOrders[JSON.parse(pdfInfo).email]
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

function streamEnd(stream) {
	return new Promise(function (resolve, reject) {
		stream.on('error', reject);
		stream.on('close', resolve);
	});
}

async function getOrderPDF(ctx, pdfData) {
	try {
		// Generate random file name
		let tempFileName = `${UUIDv4()}.pdf`;
		// Default pdf name
		let pdfName = 'orders.pdf'
		//If pdf data is provided (for sending purpose) ctx will be shop instead
		if (typeof ctx === 'string' || ctx instanceof String) {
			pdfName = getPDFName(pdfData)
			pdfData = await createPDFContent(ctx, pdfData)
		//If pdf data isn't provided (for preview purpose)
		} else {
			const { shop } = ctx.session
			const pdfJson = await createPDFContentFromScratch(ctx)
			pdfName = getPDFName(pdfJson)
			pdfData = await createPDFContent(shop, pdfJson)
		}

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

		return { pdfName, pdfBase64 }

	} catch (err) {
		console.log('Failed getting order pdf: ', err)
	}
}

async function getOrderPDFPreview(ctx) {
	const { pdfBase64 } = await getOrderPDF(ctx)
	ctx.type = 'application/pdf';
	ctx.body = pdfBase64;
}

//For previewing PDF in settings
async function getPDFPreview(ctx) {
	try {

		const { shop } = ctx.session
		// Generate random file name
		let tempFileName = `${UUIDv4()}.pdf`;

		const {
			headerTemplateText,
			orderTemplateText,
			productTemplateText,
			footerTemplateText
		} = await getUserSettings(shop)

		const { headerTemplate, orderTemplate, productTemplate, footerTemplate } =
			getTemplateTexts(headerTemplateText, orderTemplateText, productTemplateText, footerTemplateText)

		const pdfText =
			headerTemplate +
			orderTemplate +
			productTemplate +
			footerTemplate

		await writePDF(tempFileName, pdfText)

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

		ctx.type = 'application/pdf';
		ctx.body = pdfBase64;

	} catch (err) {
		console.log('Failed getting pdf preview: ', err)
	}
}

module.exports = { getOrderPDF, getOrderPDFPreview, getPDFName, getPDFPreview }
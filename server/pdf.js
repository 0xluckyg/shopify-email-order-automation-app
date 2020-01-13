const PDFKit = require('pdfkit')
const fs = require('fs')
const UUIDv4 = require('uuid/v4')
const { User } = require('./db/user');
const { createOrderText, createPreviewText } = require('../helper/template')
const { 
	asyncForEach,
	fetchAllOrdersForDay,
	formatOrders
} = require('./orders-helper')

//TODO: TEST
async function markLongOrdersAsPdf(shop, emails) {
    const user = await User.findOne({shop}, { settings: 1 })
    const { PDFSettings } = user.settings

    await asyncForEach(Object.keys(emails), async (email) => {
        const {PDFOrderLimit} = PDFSettings
        const tooLong = Object.keys(emails[email]).length
        if (tooLong >= PDFOrderLimit) {
            const pdfName = getPDFName(emails[email])
            emails[email] = {
                type: 'pdf',
                name: pdfName,
                count: tooLong,
                email,

            }
        }
    })

    return emails
}

async function getUserSettings(shop) {
	const user = await User.findOne({ shop }).select({
		"settings": 1
	})
	return user.settings
}

//this function got placed here due to cyclic dependency problem. Do not remove
//https://stackoverflow.com/questions/35534806/module-exports-not-working
function getPDFName(data) {
	const orderNumbers = Object.keys(data)
	const name = (orderNumbers.length <= 1) ?
		`order-${orderNumbers[0]}.pdf` :
		`order-${orderNumbers[0]}-${orderNumbers[orderNumbers.length - 1]}.pdf`
	return name
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
	const { shop, accessToken } = ctx.session
	const { date, pdfInfo } = ctx.query
	let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)
	const reformattedOrders = await formatOrders(shop, allOrders)
	return reformattedOrders[JSON.parse(pdfInfo).email]
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

		const pdfText = createPreviewText(headerTemplateText, orderTemplateText, productTemplateText, footerTemplateText)

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

module.exports = { getOrderPDF, getOrderPDFPreview, getPDFPreview, markLongOrdersAsPdf }
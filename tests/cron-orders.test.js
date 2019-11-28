const expect = require('chai').expect;
const {
    sendOrdersCron,
    checkStoreNeedsUpgrade,
    getUsers,
    getShopTimezone
} = require('../server/cron-orders')
const sinon = require('sinon')
const {User} = require('../server/db/user')

const mainTestShop = 'krocoio.myshopify.com'
async function getTestShop() {
    const accessToken = await User.findOne({shop: mainTestShop}, {accessToken: 1})
    return {
        shop: mainTestShop,
        accessToken
    }
}

async function createTestUsers() {
    
    for (let i = 0; i < 10; i ++) {
        let user = new User({
            shop: `test${i}.myshopify.com`, settings: {}, gmail: {}, payment: {}
        })
        if (i % 4 == 0) {
            user.type = 'shopify'
            user.active = true
            user.settings.sendMethod = { method: 'automatic', PDFSettings: { PDFOrderLimit: 2 } }
            user.gmail.isActive = true
            user.payment = { lock: false, accepted: true, date: new Date(), plan: 0} 
        } else if (i % 3 == 0) {
            user.type = 'shopify'
            user.active = true
            user.settings.sendMethod = { method: 'manual', PDFSettings: { PDFOrderLimit: 2 } }
            user.gmail.isActive = false
            user.payment = { lock: false, accepted: true, date: new Date(), plan: 0} 
        } else if (i % 2 == 0) {
            user.type = 'shopify'
            user.active = true
            user.settings.sendMethod = { method: 'automatic', PDFSettings: { PDFOrderLimit: 2 } }
            user.gmail.isActive = false
            user.payment = { lock: false, accepted: true, date: new Date(), plan: 0} 
        }
        
        await user.save()
    }
}

async function removeTestUsers() {
    let testStores = []
    for (let i = 0; i < 10; i ++) {
        testStores.push(`test${i}.myshopify.com`)
    }
    await User.remove({ 
        shop : { $in: testStores } 
    })
}

function cronJobTest() {
    describe('send orders cron job test', () => {
        it ('should match time', (done) => {
            const clock = sinon.useFakeTimers();
            
            sendOrdersCron()
            
            console.log('start virtual date" ', new Date())
            clock.tick(1000 * 60 * 60 * 24 * 2) //2 days
            console.log('end virtual date: ', new Date())
        
            clock.restore()
            
            done()
        })
    })
}

function checkStoreNeedsUpgradeTest() {
    describe('description', () => {        
        it('condition', async () => {
            const shop = await getTestShop()
        });
    });
}

function getUsersTest() {
    describe('get users for cron job test', () => {        
        it('should get all users', async () => {
            await createTestUsers()
            let users = await User.find({}, {shop: 1})

            await removeTestUsers()
        });
    });
}

function getShopTimezoneTest() {
    describe('description', () => {        

        it('condition', (done) => {
            
            done()
        });
    });
}

module.exports = {
    cronJobTest,
    checkStoreNeedsUpgradeTest,
    getUsersTest,
    getShopTimezoneTest
};
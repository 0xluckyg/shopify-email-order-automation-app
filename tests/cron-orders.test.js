const expect = require('chai').expect;
const {
    sendOrdersCron,
    checkStoreNeedsUpgrade,
    getUsers,
    getShopTimezone
} = require('../server/cron-orders')
const sinon = require('sinon')
const {User} = require('../server/db/user')

const testShop = 'krocoio.myshopify.com'
async function getTestShop() {
    const accessToken = await User.findOne({shop: testShop}, {accessToken: 1})
    return {
        shop: testShop,
        accessToken
    }
}

function cronJobTest() {
    describe('send orders cron job works', () => {
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
    describe('description', () => {        

        it('condition', (done) => {
            
            done()
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
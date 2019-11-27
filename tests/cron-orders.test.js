const expect = require('expect');
const {
    sendOrdersCron,
    checkStoreNeedsUpgrade,
    getUsers,
    getShopTimezone
} = require('../server/cron-orders')
const sinon = require('sinon')

function cronJobTest() {
    describe('clock works', () => {
        it ('should match time', (done) => {
            const clock = sinon.useFakeTimers();
            
            sendOrdersCron()
            console.log('current date" ', new Date())
            clock.tick(1000 * 60 * 60 * 24)
            
            console.log('next date: ', new Date())
            
            clock.restore()
            
            done()
        })
    })
}

function checkStoreNeedsUpgradeTest() {
    describe('description', () => {        

        it('condition', (done) => {
            
            done()
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
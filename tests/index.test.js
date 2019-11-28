const {
    getStartAndEndDateForOrderQueryTest,
    cleanOrdersTest,
    combineOrdersAndEmailRulesTest,
    combineOrdersAndSentHistoryTest,
    reformatOrdersByEmailTest,
    markLongOrdersAsPdfTest,
    formatOrdersTest
} = require('./orders-helper.test');
const {
    cronJobTest,
    checkStoreNeedsUpgradeTest,
    getUsersTest,
    getShopTimezoneTest
} = require('./cron-orders.test');
const {User} = require('../server/db/user')
require('../config/config');
require('../server/db/mongoose'); //If using DB


cronJobTest()
// getStartAndEndDateForOrderQueryTest()
// cleanOrdersTest()
// combineOrdersAndEmailRulesTest()
// combineOrdersAndSentHistoryTest()
// reformatOrdersByEmailTest()
// markLongOrdersAsPdfTest()
// formatOrdersTest()

checkStoreNeedsUpgradeTest()
getUsersTest()
// getShopTimezoneTest()

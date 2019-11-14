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
    checkStoreNeedsUpgradeTest,
    getUsersTest,
    getShopTimezoneTest
} = require('./cron-orders.test');

getStartAndEndDateForOrderQueryTest()
cleanOrdersTest()
combineOrdersAndEmailRulesTest()
combineOrdersAndSentHistoryTest()
reformatOrdersByEmailTest()
markLongOrdersAsPdfTest()
formatOrdersTest()

checkStoreNeedsUpgradeTest()
getUsersTest()
getShopTimezoneTest()

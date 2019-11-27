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

cronJobTest()
// getStartAndEndDateForOrderQueryTest()
// cleanOrdersTest()
// combineOrdersAndEmailRulesTest()
// combineOrdersAndSentHistoryTest()
// reformatOrdersByEmailTest()
// markLongOrdersAsPdfTest()
// formatOrdersTest()

// checkStoreNeedsUpgradeTest()
// getUsersTest()
// getShopTimezoneTest()

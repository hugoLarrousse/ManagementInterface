const {
  GraphQLObjectType,
} = require('graphql');

const authentication = require('./authentication');
const subscription = require('./subscription');
const payment = require('./payment');
const integration = require('./integration');
const funnel = require('./funnel');
const list = require('./list');
const userList = require('./userList');
const dataTest = require('./dataTest');
const user = require('./user');
const pi = require('./pi');
const metrics = require('./metrics');
const channels = require('./channels');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    jwtLogin: authentication.jwtLoginQuery,
    subscriptionInfo: subscription.count,
    paymentInfo: payment.count,
    integrationInfo: integration.count,
    funnelInfo: funnel.count,
    listInfo: list.info,
    userListInfo: userList.info,
    checkAllData: dataTest.allData,
    checkData: dataTest.data,
    teamsUsers: user.teamsUsers,
    teams: user.teams,
    coupons: payment.getCoupons,
    getPis: pi.data,
    getLogsPi: pi.logs,
    pagesVisited: metrics.pagesVisitedQuery,
    slidesInfo: metrics.slidesInfoQuery,
    organizations: user.organizations,
    generateInvoiceNumber: payment.generateInvoiceNumberQuery,
    previousInfoInvoice: payment.previousInfoInvoiceQuery,
    previousInvoices: payment.previousInvoicesQuery,
    channelsLive: channels.channelsLiveQuery,
  },
});

exports.queryType = queryType;

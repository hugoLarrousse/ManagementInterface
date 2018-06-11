const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} = require('graphql');


const userInfoList = new GraphQLObjectType({
  name: 'userInfoList',
  fields: {
    subDate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    mail: {
      type: new GraphQLNonNull(GraphQLString),
    },
    integration: {
      type: GraphQLString,
    },
    lastSeen: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    funnelPosition: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.info = new GraphQLObjectType({
  name: 'infoList',
  fields: {
    orgaId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    subDate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    companyName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mail: {
      type: new GraphQLNonNull(GraphQLString),
    },
    teamSize: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    integration: {
      type: GraphQLString,
    },
    lastSeen: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    plan: {
      type: new GraphQLNonNull(GraphQLString),
    },
    endDate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    funnelPosition: {
      type: new GraphQLNonNull(GraphQLString),
    },
    users: {
      type: new GraphQLList(userInfoList),
    },
  },
});

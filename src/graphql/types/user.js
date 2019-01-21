const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
} = require('graphql');

exports.deleteUsers = new GraphQLObjectType({
  name: 'UsersDelete',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

const team = new GraphQLObjectType({
  name: 'team',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const user = new GraphQLObjectType({
  name: 'user',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    team_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.getTeamsUsers = new GraphQLObjectType({
  name: 'TeamsUsers',
  fields: {
    teams: {
      type: new GraphQLNonNull(new GraphQLList(team)),
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(user)),
    },
  },
});

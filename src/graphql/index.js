/* ------------------------------------------
   GraphQL core
--------------------------------------------- */
const express = require('express');
const {
  graphql,
  GraphQLSchema,
} = require('graphql');
const graphQLHTTP = require('express-graphql');
const cors = require('cors');

const env = process.env.NODE_ENV || 'development';

const { queryType } = require('./query');
// const mutationType = require('./mutation');

const schema = new GraphQLSchema({
  query: queryType,
  // mutation: mutationType,
});

const rootValue = {};
const contextValue = {};
const corsOptions = {
  methods: ['OPTIONS', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  origin: '*', // TODO improve with env values for production
};

const makeRequest = (requestString, variableValues = null) =>
  graphql(schema, requestString, rootValue, contextValue, variableValues);

const createGraphQLRouter = () => {
  const router = express.Router();
  router.use('/graph', cors(corsOptions), graphQLHTTP(req => { // res, params
    return {
      schema,
      graphiql: false,
      context: {
        headers: req.headers || {},
      },
    };
  }));
  if (env === 'development') {
    router.use('/graphi', graphQLHTTP(req => { // res, params
      return {
        schema,
        graphiql: true,
        context: {
          headers: req.headers || {},
        },
      };
    }));
  }
  return router;
};

exports.makeRequest = makeRequest;
exports.schema = schema;
exports.createGraphQLRouter = createGraphQLRouter;

// All graphql-js methods
// import {
//   graphql,
//   getNamedType,
//   getNullableType,
//   GraphQLBoolean,
//   GraphQLEnumType,
//   GraphQLFloat,
//   GraphQLID,
//   GraphQLInputObjectType,
//   GraphQLInt,
//   GraphQLInterfaceType,
//   GraphQLList,
//   GraphQLNonNull,
//   GraphQLObjectType,
//   GraphQLScalarType,
//   GraphQLSchema,
//   GraphQLString,
//   GraphQLUnionType,
//   isAbstractType,
//   isCompositeType,
//   isInputType,
//   isLeafType,
//   isOutputType,
// } from 'graphql';

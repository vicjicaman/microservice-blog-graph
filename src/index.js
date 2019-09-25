require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { schema: rootSchema, resolvers: rootResolvers } = require("./schema");

import * as AuthLib from "@nebulario/microservice-auth-common";
import * as GraphCommon from "@nebulario/microservice-graph-common";
import * as Utils from "@nebulario/microservice-utils";

const BLOG_DATA_INTERNAL_URL = process.env["BLOG_DATA_INTERNAL_URL"];
const BLOG_ROUTE_GRAPH = process.env["BLOG_ROUTE_GRAPH"];
const BLOG_INTERNAL_PORT_GRAPH = process.env["BLOG_INTERNAL_PORT_GRAPH"];

const AUTH_ACCOUNT_INTERNAL_URL_GRAPH =
  process.env["AUTH_ACCOUNT_INTERNAL_URL_GRAPH"];
const AUTH_SECRET_PASSWORD_CACHE = process.env["AUTH_SECRET_PASSWORD_CACHE"];
const AUTH_INTERNAL_HOST_CACHE = process.env["AUTH_INTERNAL_HOST_CACHE"];
const AUTH_INTERNAL_PORT_CACHE = process.env["AUTH_INTERNAL_PORT_CACHE"];

(async () => {
  const cxt = { mongoose };
  GraphCommon.Data.connect({ mongoose, url: BLOG_DATA_INTERNAL_URL }, cxt);

  var app = express();
  var { passport } = AuthLib.init({
    app,
    cache: {
      host: AUTH_INTERNAL_HOST_CACHE,
      port: AUTH_INTERNAL_PORT_CACHE,
      secret: AUTH_SECRET_PASSWORD_CACHE
    },
    accounts: {
      url: AUTH_ACCOUNT_INTERNAL_URL_GRAPH
    }
  });

  const schema = makeExecutableSchema({
    typeDefs: rootSchema,
    resolvers: rootResolvers
  });

  app.use(
    BLOG_ROUTE_GRAPH,
    graphqlHTTP(request => ({
      schema: schema,
      graphiql: true,
      context: {
        passport,
        request,
        services: {}
      }
    }))
  );
  app.listen(BLOG_INTERNAL_PORT_GRAPH, () =>
    console.log("Blog GraphQL running...")
  );
})();

Utils.Process.shutdown(signal => {
  console.log("Closing connection");
  mongoose.connection.close();
  console.log("Shutdown " + signal);
});

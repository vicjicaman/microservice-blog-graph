require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { schema: rootSchema, resolvers: rootResolvers } = require("./schema");

import * as AuthLib from "@nebulario/microservice-auth-common";


const BLOG_DATA_INTERNAL_URL = process.env["BLOG_DATA_INTERNAL_URL"];
const BLOG_ROUTE_GRAPH = process.env["BLOG_ROUTE_GRAPH"];
const BLOG_INTERNAL_PORT_GRAPH = process.env["BLOG_INTERNAL_PORT_GRAPH"];

const AUTH_ACCOUNT_INTERNAL_URL_GRAPH =
  process.env["AUTH_ACCOUNT_INTERNAL_URL_GRAPH"];
const AUTH_SECRET_PASSWORD_CACHE = process.env["AUTH_SECRET_PASSWORD_CACHE"];
const AUTH_INTERNAL_HOST_CACHE = process.env["AUTH_INTERNAL_HOST_CACHE"];
const AUTH_INTERNAL_PORT_CACHE = process.env["AUTH_INTERNAL_PORT_CACHE"];


export function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

(async () => {
  let db = null;
  let connected = false;

  while (!connected) {
    try {
      console.log("Connect to data service... " + BLOG_DATA_INTERNAL_URL);
      mongoose.connect("mongodb://" + BLOG_DATA_INTERNAL_URL, {
        useNewUrlParser: true,
        reconnectTries: 3,
        reconnectInterval: 100
      });

      mongoose.connection.on("disconnected", () => {
        console.log("-> lost connection");
      });
      mongoose.connection.on("reconnect", () => {
        console.log("-> reconnected");
      });
      mongoose.connection.on("connected", () => {
        console.log("-> connected");
      });
      mongoose.connection.on("reconnectFailed", () => {
        console.log("-> gave up reconnecting");
        process.exit(17);
      });
      connected = true;
    } catch (e) {
      console.log("DATA_ERROR:  " + e.toString());
      await wait(2500);
    }
  }

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
  app.listen(BLOG_INTERNAL_PORT_GRAPH, () => console.log("Blog GraphQL running..."));
})();

function shutdown(signal) {
  return async function(err) {
    console.log(`${signal}...`);
    if (err) {
      console.error(err.stack || err);
    }

    console.log("Closing connection");
    mongoose.connection.close();

    setTimeout(() => {
      process.exit(err ? 1 : 0);
    }, 500).unref();
  };
}

process
  .on("SIGTERM", shutdown("SIGTERM"))
  .on("SIGINT", shutdown("SIGINT"))
  .on("uncaughtException", shutdown("uncaughtException"));

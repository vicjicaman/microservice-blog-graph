require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const { schema: rootSchema, resolvers: rootResolvers } = require("./schema");

import * as Logger from "@nebulario/microservice-logger";
import * as AuthLib from "@nebulario/microservice-auth-common";
import * as GraphCommon from "@nebulario/microservice-graph-common";
import * as Utils from "@nebulario/microservice-utils";
import * as Pkg from "Pkg";
import ArticleConfig from "Model/article/config";

const ENV_MODE = process.env["ENV_MODE"];
const ENV_LOG_FOLDER = process.env["ENV_LOG_FOLDER"];

const BLOG_ROUTE_GRAPH = process.env["BLOG_ROUTE_GRAPH"];
const BLOG_INTERNAL_PORT_GRAPH = process.env["BLOG_INTERNAL_PORT_GRAPH"];

const AUTH_ACCOUNT_INTERNAL_URL_GRAPH =
  process.env["AUTH_ACCOUNT_INTERNAL_URL_GRAPH"];
const AUTH_SECRET_PASSWORD_CACHE = process.env["AUTH_SECRET_PASSWORD_CACHE"];
const AUTH_INTERNAL_HOST_CACHE = process.env["AUTH_INTERNAL_HOST_CACHE"];
const AUTH_INTERNAL_PORT_CACHE = process.env["AUTH_INTERNAL_PORT_CACHE"];

const RESOURCES_DATA_INTERNAL_URL = process.env["RESOURCES_DATA_INTERNAL_URL"];
const RESOURCES_DATA_NAME = process.env["RESOURCES_DATA_NAME"];
const RESOURCES_DATA_SECRET_USER = process.env["RESOURCES_DATA_SECRET_USER"];
const RESOURCES_DATA_SECRET_PASSWORD =
  process.env["RESOURCES_DATA_SECRET_PASSWORD"];

const RESOURCES_QUEUE_SECRET_USER = process.env["RESOURCES_QUEUE_SECRET_USER"];
const RESOURCES_QUEUE_SECRET_PASSWORD =
  process.env["RESOURCES_QUEUE_SECRET_PASSWORD"];
const RESOURCES_QUEUE_INTERNAL_HOST =
  process.env["RESOURCES_QUEUE_INTERNAL_HOST"];
const RESOURCES_QUEUE_INTERNAL_PORT =
  process.env["RESOURCES_QUEUE_INTERNAL_PORT"];

const RESOURCES_CACHE_INTERNAL_HOST =
  process.env["RESOURCES_CACHE_INTERNAL_HOST"];
const RESOURCES_CACHE_INTERNAL_PORT =
  process.env["RESOURCES_CACHE_INTERNAL_PORT"];
const RESOURCES_CACHE_SECRET_PASSWORD =
  process.env["RESOURCES_CACHE_SECRET_PASSWORD"];

const cxt = {
  env: {
    mode: ENV_MODE,
    logs: {
      folder: ENV_LOG_FOLDER
    }
  },
  services: {
    data: mongoose
  },
  logger: null
};

cxt.logger = Logger.create({ path: ENV_LOG_FOLDER, env: ENV_MODE }, cxt);

(async () => {
  await GraphCommon.Data.connect(
    {
      mongoose,
      url: RESOURCES_DATA_INTERNAL_URL,
      database: RESOURCES_DATA_NAME,
      user: RESOURCES_DATA_SECRET_USER,
      password: RESOURCES_DATA_SECRET_PASSWORD
    },
    cxt
  );

  /*cxt.services.queue = await Pkg.Queue.connect(
    [
      {
        id: ArticleConfig.StaticContentQueueID,
        name: "UTILITIES_STATIC_CONTENT_GENERATOR_QUEUE"
      }
    ],
    {
      host: RESOURCES_QUEUE_INTERNAL_HOST,
      port: RESOURCES_QUEUE_INTERNAL_PORT,
      user: RESOURCES_QUEUE_SECRET_USER,
      password: RESOURCES_QUEUE_SECRET_PASSWORD
    }
  );*/

  cxt.services.queue = await GraphCommon.Queue.connect(
    "blog",
    {
      queues: [
        {
          name: "UTILITIES_STATIC_CONTENT_GENERATOR_QUEUE",
          type: "exchange",
          mode: "fanout"
        }
      ]
    },
    {
      host: RESOURCES_QUEUE_INTERNAL_HOST,
      port: RESOURCES_QUEUE_INTERNAL_PORT,
      user: RESOURCES_QUEUE_SECRET_USER,
      password: RESOURCES_QUEUE_SECRET_PASSWORD
    },
    cxt
  );

  cxt.services.cache = await Pkg.Cache.connect(
    {
      host: RESOURCES_CACHE_INTERNAL_HOST,
      port: RESOURCES_CACHE_INTERNAL_PORT,
      password: RESOURCES_CACHE_SECRET_PASSWORD
    },
    cxt
  );

  var app = express();
  Logger.Service.use(app, cxt);

  var { passport } = AuthLib.init(
    {
      app,
      cache: {
        host: AUTH_INTERNAL_HOST_CACHE,
        port: AUTH_INTERNAL_PORT_CACHE,
        secret: AUTH_SECRET_PASSWORD_CACHE
      },
      accounts: {
        url: AUTH_ACCOUNT_INTERNAL_URL_GRAPH
      }
    },
    cxt
  );

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
        ...cxt
      }
    }))
  );
  app.listen(BLOG_INTERNAL_PORT_GRAPH, () =>
    cxt.logger.info("service.running", { port: BLOG_INTERNAL_PORT_GRAPH })
  );
})().catch(e => cxt.logger.error("service.error", { error: e.toString() }));

Utils.Process.shutdown(signal => {
  mongoose.connection.close();
  cxt.logger.info("service.shutdown", { signal });
});

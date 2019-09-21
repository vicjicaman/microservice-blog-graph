import * as Article from "Schema/article";
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

const schema = [
  ...Article.schema,
  `
  scalar DateTime
  scalar Date

  type Viewer {
    id: ID
    username: String
    article: ArticleQueries
  }

  type ViewerMutations {
    username: String
    article: ArticleMutations
  }

  type Query {
    viewer: Viewer
  }

  type Mutation {
    viewer: ViewerMutations
  }
`
];

const getViewer = cxt => {
  const username = cxt.request.user ? cxt.request.user.username : null;
  return {
    id: username,
    username
  };
};

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  ...Article.resolvers,
  Viewer: {
    article: viewer => viewer
  },
  ViewerMutations: {
    article: viewer => viewer
  },
  Query: {
    viewer: (parent, args, cxt) => getViewer(cxt)
  },
  Mutation: {
    viewer: (parent, args, cxt) => getViewer(cxt)
  }
};

export { schema, resolvers };

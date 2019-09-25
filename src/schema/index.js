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
    articles: ArticleQueries
  }

  type ViewerMutations {
    id: ID
    username: String
    articles: ArticleMutations
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
    articles: viewer => viewer
  },
  ViewerMutations: {
    articles: viewer => (viewer.id ? viewer : null)
  },
  Query: {
    viewer: (parent, args, cxt) => getViewer(cxt)
  },
  Mutation: {
    viewer: (parent, args, cxt) => getViewer(cxt)
  }
};

export { schema, resolvers };

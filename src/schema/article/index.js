import * as Queries from "./queries";
import * as Mutations from "./mutations";
import * as Admin from './admin'

const schema = [
  `
  type Article {
    id: ID
    title: String!
    abstract: String!
    content: String!
    url: String!
    status: String!
    authorid: String!
    created_at: DateTime!
  }
  `,
  ...Queries.schema,
  ...Mutations.schema,
  ...Admin.schema
];

const resolvers = {
  ...{},
  ...Queries.resolvers,
  ...Mutations.resolvers,
  ...Admin.resolvers
};

export { schema, resolvers };

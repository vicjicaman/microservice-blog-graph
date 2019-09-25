import * as Queries from "./queries";
import * as Mutations from "./mutations";

const schema = [
  `
  type Article {
    id: ID
    title: String!
    abstract: String!
    content: String!
    status: String!
    authorid: String!
    created_at: DateTime!
  }
  `,
  ...Queries.schema,
  ...Mutations.schema
];

const resolvers = {
  ...{},
  ...Queries.resolvers,
  ...Mutations.resolvers
};

export { schema, resolvers };

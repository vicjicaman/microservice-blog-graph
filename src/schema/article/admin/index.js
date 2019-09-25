import * as Queries from "./queries";
import * as Mutations from "./mutations";

const schema = [
  ...Queries.schema,
  ...Mutations.schema
];

const resolvers = {
  ...{},
  ...Queries.resolvers,
  ...Mutations.resolvers
};

export { schema, resolvers };

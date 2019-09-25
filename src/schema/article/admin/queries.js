import * as ArticleAdmin from "Model/article/admin";

const schema = [
  `

  type ArticleAdminQueries {
    get (id: ID!): Article
    list : [Article]
  }

`
];

const resolvers = {
  ArticleAdminQueries: {
    get: async (viewer, { id }, cxt) => await ArticleAdmin.get(id , cxt),
    list: async (viewer, args, cxt) => await ArticleAdmin.list({}, cxt)
  }
};

export { schema, resolvers };

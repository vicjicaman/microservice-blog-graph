import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";

const schema = [
  `

  type ArticleQueries {
    get (id: ID!): Article
    list : [Article],
    admin: ArticleAdminQueries
  }

`
];

const resolvers = {
  ArticleQueries: {
    get: async (viewer, { id }, cxt) => await Article.get({ id }, cxt),
    list: async (viewer, args, cxt) =>
      await Article.list({ status: "active" }, cxt),
    admin: viewer => ArticleAdmin.getAdmin(viewer)
  }
};

export { schema, resolvers };

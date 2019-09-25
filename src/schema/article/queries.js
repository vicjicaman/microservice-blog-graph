import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";

const schema = [
  `

  type ArticleQueries {
    get (url: String!): Article
    list : [Article],
    admin: ArticleAdminQueries
  }

`
];

const resolvers = {
  ArticleQueries: {
    get: async (viewer, { url }, cxt) => await Article.get(url, cxt),
    list: async (viewer, args, cxt) =>
      await Article.list({ status: "active" }, cxt),
    admin: viewer => ArticleAdmin.getAdmin(viewer)
  }
};

export { schema, resolvers };

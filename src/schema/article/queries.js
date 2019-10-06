import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";
import * as Pkg from "Pkg";
import * as ArticleCache from "./cache";

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
    admin: viewer => ArticleAdmin.getAdmin(viewer),
    get: async (viewer, { url }, cxt) =>
      await Pkg.Cache.object(
        ArticleCache.Keys.url(url),
        {
          params: { url },
          getter: ({ url }, cxt) => Article.get(url, cxt),
          serializer: ArticleCache.Serializers.Complete
        },
        cxt
      ),
    list: async (viewer, args, cxt) =>
      await Pkg.Cache.list(
        ArticleCache.Keys.list("main", "P0"),
        {
          getter: (params, cxt) => Article.list({ status: "active" }, cxt),
          serializer: ArticleCache.Serializers.List
        },
        cxt
      )
  }
};

export { schema, resolvers };

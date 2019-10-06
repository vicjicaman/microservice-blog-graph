import * as ArticleEntity from "Entities/article";
import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";
import * as Pkg from "Pkg";

const schema = [
  `

  type ArticleQueries {
    get (url: String!): Article
    list : [Article],
    admin: ArticleAdminQueries
  }

`
];

const getListKey = (name, subset) => "Articles/List/" + name + "/" + subset;
const getURLKey = url => "Articles/URL/" + url;

const resolvers = {
  ArticleQueries: {
    admin: viewer => ArticleAdmin.getAdmin(viewer),
    get: async (viewer, { url }, cxt) =>
      await Pkg.Cache.object(
        getURLKey(url),
        {
          params: { url },
          getter: ({ url }, cxt) => Article.get(url, cxt),
          serializer: ArticleEntity.Serialize.Complete
        },
        cxt
      ),
    list: async (viewer, args, cxt) =>
      await Pkg.Cache.list(
        getListKey("main", "P0"),
        {
          getter: (params, cxt) => Article.list({ status: "active" }, cxt),
          serializer: ArticleEntity.Serialize.List
        },
        cxt
      )
  }
};

export { schema, resolvers };

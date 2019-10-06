import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";
import * as Pkg from "Pkg";
import * as ArticleCache from "./cache";

const schema = [
  `

  type ArticleMutations {
    admin: ArticleAdminMutations!
  }
`
];

const resolvers = {
  ArticleMutations: {
    admin: async (viewer, args, cxt) => {
      const res = ArticleAdmin.getAdmin(viewer);

      if (res) {
        await Pkg.Cache.remove(ArticleCache.Keys.list("main", "P0"), cxt);
      }

      return res;
    }
  }
};

export { schema, resolvers };

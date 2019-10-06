import * as ArticleAdmin from "Model/article/admin";
import * as ArticleCache from "../cache";
import * as Pkg from "Pkg";

const schema = [
  `

  input ArticleCreateInput {
    title: String!
    url: String!
    abstract: String!
    content: String!
  }

  input ArticleEditInput {
    title: String!
    abstract: String!
    content: String!
  }

  type ArticleAdminMutations {
    create ( input: ArticleCreateInput! ): Article!
    article ( id: ID! ) : ArticleEntityAdminMutations
  }

  type ArticleEntityAdminMutations {
    publish: Article!
    inactive: Article!
    edit ( input: ArticleEditInput! ): Article!
    remove: ID
  }
`
];

const resolvers = {
  ArticleAdminMutations: {
    create: async (
      { username },
      { input: { title, abstract, content, url } },
      cxt
    ) =>
      await ArticleAdmin.create(
        { title, authorid: username, abstract, content, url },
        cxt
      ),
    article: async ({ username }, { id }, cxt) => {
      const res = await ArticleAdmin.get(id, cxt);
      if (res) {
        await Pkg.Cache.remove(ArticleCache.Keys.url(res.url), cxt);
      }
      return res;
    }
  },
  ArticleEntityAdminMutations: {
    publish: async (article, args, cxt) =>
      await ArticleAdmin.publish(article, cxt),
    inactive: async (article, args, cxt) =>
      await ArticleAdmin.inactive(article, cxt),
    edit: async (article, { input: { title, abstract, content } }, cxt) =>
      await ArticleAdmin.edit(article, { title, abstract, content }, cxt),
    remove: async (article, args, cxt) =>
      await ArticleAdmin.remove(article, cxt)
  }
};

export { schema, resolvers };

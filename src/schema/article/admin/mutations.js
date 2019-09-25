import * as ArticleAdmin from "Model/article/admin";

const schema = [
  `

  input ArticleInput {
    title: String!
    abstract: String!
    content: String!
  }

  type ArticleAdminMutations {
    create ( input: ArticleInput! ): Article!
    article ( id: ID! ) : ArticleEntityAdminMutations
  }

  type ArticleEntityAdminMutations {
    edit ( input: ArticleInput! ): Article!
    remove: ID
  }
`
];

const resolvers = {
  ArticleAdminMutations: {
    create: async (
      { username },
      { input: { title, abstract, content } },
      cxt
    ) =>
      await ArticleAdmin.create(
        { title, authorid: username, abstract, content },
        cxt
      ),
    article: async ({ username }, { id }, cxt) =>
      await ArticleAdmin.get(id, cxt)
  },
  ArticleEntityAdminMutations: {
    edit: async (article, { input: { title, abstract, content } }, cxt) =>
      await ArticleAdmin.edit(article, { title, abstract, content }, cxt),
    remove: async (article, args, cxt) =>
      await ArticleAdmin.remove(article, cxt)
  }
};

export { schema, resolvers };

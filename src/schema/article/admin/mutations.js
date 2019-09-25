import * as Article from "Model/article";

const schema = [
  `

  input ArticleInput {
    title: String!
    abstract: String!
    content: String!
  }

  type ArticleAdminMutations {
    create ( input: ArticleInput! ): Article!
    remove ( id: ID! ): ID
  }
`
];

const resolvers = {
  ArticleAdminMutations: {
    create: async (
      { username },
      { input: { title, abstract, content } },
      cxt
    ) => {
      return await Article.create(
        { title, authorid: username, abstract, content },
        cxt
      );
    },
    remove: async ({ username }, { id }, cxt) => {
      return await Article.remove({ authorid: username, id }, cxt);
    }
  }
};

export { schema, resolvers };

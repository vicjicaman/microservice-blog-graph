import * as Article from "Model/article";

const schema = [
  `

  input ArticleInput {
    title: String!
    abstract: String!
    content: String!
    status: String!
  }

  type ArticleMutations {
    create ( input: ArticleInput! ): Article!
    remove ( id: ID! ): ID
  }
`
];

const resolvers = {
  ArticleMutations: {
    create: async (
      { username },
      { input: { title, abstract, content, status } },
      cxt
    ) => {
      return await Article.create(
        { title, authorid: username, abstract, content, status },
        cxt
      );
    },
    remove: async ({ username }, { id }, cxt) => {
      return await Article.remove({ authorid: username, id }, cxt);
    }
  }
};

export { schema, resolvers };

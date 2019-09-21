import * as Article from "Model/article";

const schema = [
  `
  type ArticleMutations {
    create (title: String!, abstract: String!, content: String! ): Article!
    remove (id: ID! ): ID
  }
`
];

const resolvers = {
  ArticleMutations: {
    create: async ({ username }, { title, abstract, content }, cxt) => {
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

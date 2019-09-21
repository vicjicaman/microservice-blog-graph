import * as Article from "Model/article";

const schema = [
  `

  type ArticleQueries {
    get (id: ID!): Article
    list : [Article]
  }

`
];

const resolvers = {
  ArticleQueries: {
    get: async (viewer, { id }, cxt) => await Article.getById({ id }, cxt),
    list: async (viewer, args, cxt) => await Article.list({}, cxt)
  }
};

export { schema, resolvers };

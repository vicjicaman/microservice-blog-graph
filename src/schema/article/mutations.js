import * as Article from "Model/article";
import * as ArticleAdmin from "Model/article/admin";

const schema = [
  `

  type ArticleMutations {
    admin: ArticleAdminMutations!
  }
`
];

const resolvers = {
  ArticleMutations: {
    admin: viewer => ArticleAdmin.getAdmin(viewer)
  }
};

export { schema, resolvers };

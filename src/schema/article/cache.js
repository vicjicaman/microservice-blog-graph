import * as ArticleEntity from "Entities/article";


const Keys = {
  list: (name, subset) => "Articles/List/" + name + "/" + subset,
  url: url => "Articles/URL/" + url
};

const Serializers = ArticleEntity.Serialize;

export { Keys, Serializers };

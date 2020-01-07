import * as Article from "Entities/article";
import ArticleConfig from "Model/article/config";
import * as Pkg from "Pkg";

const getAdmin = async viewer =>
  viewer.username === "vicjicama" ? viewer : null;

const get = async (id, cxt) => {
  return await Article.Model.findById(id);
};

const list = async ({}, cxt) => {
  const res = await Article.Model.find({});

  return res;
};

const create = async ({ url, title, abstract, authorid, content }, cxt) => {
  return await Article.Model.create({
    title,
    url,
    abstract,
    authorid,
    content,
    status: "draft"
  });
};

const publish = async (article, cxt) => {
  article.status = "active";
  const mod = await article.save();
  /*const payload = { type: "blog.article", article: Article.Serialize.Complete.serialize(mod) };
  Pkg.Queue.send(
    ArticleConfig.StaticContentQueueID,
    JSON.stringify(payload),
    cxt
  );*/
  return mod;
};

const inactive = async (article, cxt) => {
  article.status = "draft";
  return await article.save();
};

const edit = async (article, { title, abstract, content }, cxt) => {
  article.title = title;
  article.abstract = abstract;
  article.content = content;

  return await article.save();
};

const remove = async (article, cxt) => {
  await article.remove();
  return article.id;
};

export { getAdmin, get, list, create, edit, remove, publish, inactive };

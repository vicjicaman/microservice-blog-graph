import { Article } from "Entities/article";

const getAdmin = async viewer =>
  viewer.username === "vicjicama" ? viewer : null;

const get = async (id, cxt) => {
  return await Article.findById(id);
};

const list = async ({}, cxt) => {
  const res = await Article.find({});

  return res;
};

const create = async ({ url, title, abstract, authorid, content }, cxt) => {
  return await Article.create({
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
  return await article.save();
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

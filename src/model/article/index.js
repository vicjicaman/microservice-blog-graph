import { Article } from "Entities/article";

const getById = async ({ id }, cxt) => {
  return await Article.findById(id);
};

const list = async ({ id }, cxt) => {
  return await Article.find({});
};

const create = async ({ title, abstract, authorid, content }, cxt) => {
  return await Article.create({ title, abstract, authorid, content });
};

const remove = async ({ id, authorid }, cxt) => {
  const article = await Article.findOne({ id, authorid });
  await article.remove();
  return article.id;
};

export { getById, list, create, remove };

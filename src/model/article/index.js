import { Article } from "Entities/article";

const get = async (url, cxt) => {
  return await Article.findOne({ url });
};

const list = async ({ status }, cxt) => {
  const res = await Article.find({ status });
  return res;
};

export { get, list };

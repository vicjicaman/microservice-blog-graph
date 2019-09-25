import { Article } from "Entities/article";

const get = async (url, cxt) => {
  const res = await Article.findOne({ url });

  if (res.status !== "active") {
    return null;
  }

  return res;
};

const list = async ({ status }, cxt) => {
  const res = await Article.find({ status });
  return res;
};

export { get, list };

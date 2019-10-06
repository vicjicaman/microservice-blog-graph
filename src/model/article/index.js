import * as Article from "Entities/article";

const get = async (url, cxt) => {
  const res = await Article.Model.findOne({ url });

  if (res.status !== "active") {
    return null;
  }

  return res;
};

const list = async ({ status }, cxt) => {
  return await Article.Model.find({ status });
};

export { get, list };
